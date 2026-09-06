// Name: 云变量+
// ID: cloudvariablesplus
// Description: 更多的云变量操作积木，允许创建、更改、删除云变量，连接不同的云变量服务器，更改作品 ID等进阶功能。
// By: Yesshape <https://scratch.mit.edu/users/yesshape/>
// Video: https://www.bilibili.com/video/BV1H9RDBDEk2/?spm_id_from=333.1387.homepage.video_card.click
// License: MPL-2.0

(function (Scratch) {
  'use strict';

  const A = Scratch.ArgumentType;
  const B = Scratch.BlockType;
  const Cast = Scratch.Cast || { toString: x => String(x), toNumber: x => Number(x), toBoolean: x => !!x };

  const clampLen = (s, n) => (String(s).length > n ? String(s).slice(0, n) : String(s));
  const nowMs = () => Date.now();

  const PROTOCOL_ID = 'CV2';
  const NS_PREFIX = `☁ ${PROTOCOL_ID}.`;
  const MANIFEST_PREFIX = `${NS_PREFIX}_manifest.`;
  const VERSION = '2.0.2';

  class CloudV2 {
    constructor() {
      this.server = 'wss://clouddata.turbowarp.org';
      this.projectId = null;
      this.username = 'Guest';
      this.ws = null;
      this.status = 'disconnected';
      this.connectedProjectId = null;

      this.values = new Map();
      this.lastSendAt = new Map();

      this.seed = 0;
      this._initialTimer = 0;
      
      this.projectVarLists = new Map();
      
      this._varUpdateFlags = new Map();
      this._projectIdChanged = false;
      this._statusChanged = false;
      this._lastStatus = 'disconnected';
    }

    getCurrentServer() {
      return this.server;
    }

    toCloudName(name, projectId = this.projectId) {
      if (!projectId) return null;
      let n = String(name || '').trim();
      if (!n) n = 'var';
      const cleanPid = String(projectId).replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 20);
      const cleanVar = n.slice(0, 40);
      let raw = `${NS_PREFIX}${cleanPid}.${cleanVar}`;
      raw = clampLen(raw, 128);
      return raw;
    }
    
    parseCloudName(cloudName) {
      const s = String(cloudName || '');
      if (!s.startsWith(NS_PREFIX)) return null;
      const withoutPrefix = s.slice(NS_PREFIX.length);
      const dotIndex = withoutPrefix.indexOf('.');
      if (dotIndex === -1) return null;
      const projectId = withoutPrefix.slice(0, dotIndex);
      const varName = withoutPrefix.slice(dotIndex + 1);
      return { projectId, varName };
    }
    
    fromCloudName(cloudName) {
      const parsed = this.parseCloudName(cloudName);
      if (!parsed) return null;
      if (parsed.projectId === this.projectId) return parsed.varName;
      return null;
    }

    isCurrentProjectVar(cloudName) {
      const parsed = this.parseCloudName(cloudName);
      return parsed && parsed.projectId === this.projectId;
    }

    refreshCurrentProjectVars() {
      if (!this.projectId) return;
      
      const varSet = new Set();
      for (const cloudName of this.values.keys()) {
        const parsed = this.parseCloudName(cloudName);
        if (parsed && parsed.projectId === this.projectId && cloudName !== this.getManifestName()) {
          varSet.add(parsed.varName);
        }
      }
      this.projectVarLists.set(this.projectId, varSet);
    }

    connect(optionalServer, pid) {
      const oldStatus = this.status;
      try {
        if (pid) {
          const cleanPid = String(pid).replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 20);
          if (cleanPid) this.projectId = cleanPid;
        }
        if (!this.projectId) this.projectId = 'default_project';
        
        if (optionalServer) {
          const s = String(optionalServer).trim();
          if (/^wss?:\/\//i.test(s)) this.server = s;
        }

        if (this.ws) { 
          try { this.ws.close(); } catch (e) {} 
          this.ws = null; 
        }

        const url = this.server.includes('?')
          ? this.server
          : this.server.replace(/\/?$/, '/') + `?project_id=${encodeURIComponent(this.projectId)}`;

        this.status = 'connecting';
        this._checkStatusChange(oldStatus);
        this.connectedProjectId = this.projectId;
        this.seed = 0;
        this.values.clear();
        this.lastSendAt.clear();

        this.ws = new WebSocket(url);
        this.ws.onopen = () => {
          this._send({ method: 'handshake', user: this.username, project_id: this.projectId });
          this._scheduleInitialScan(600);
        };
        this.ws.onclose = () => { 
          this._clearInitialScan(); 
          const old = this.status;
          if (this.status !== 'legacy-conflict') this.status = 'disconnected';
          this._checkStatusChange(old);
        };
        this.ws.onerror = () => { 
          this._clearInitialScan(); 
          const old = this.status;
          if (this.status !== 'legacy-conflict') this.status = 'error';
          this._checkStatusChange(old);
        };
        this.ws.onmessage = (ev) => {
          const lines = String(ev.data || '').split('\n').filter(Boolean);
          if (lines.length) this._onAnyMessage();
          for (const line of lines) {
            let msg; 
            try { msg = JSON.parse(line); } catch (e) { continue; }
            this._handleMessage(msg);
          }
        };
      } catch (e) {
        console.error('连接错误:', e);
        const old = this.status;
        this.status = 'error';
        this._checkStatusChange(old);
      }
    }
    
    disconnect() {
      const oldStatus = this.status;
      if (this.ws) { 
        try { this.ws.close(); } catch (e) {} 
        this.ws = null; 
      }
      this._clearInitialScan();
      this.status = 'disconnected';
      this._checkStatusChange(oldStatus);
      this.connectedProjectId = null;
      this.values.clear();
      this.lastSendAt.clear();
    }

    _send(obj) {
      if (!this.ws || this.ws.readyState !== 1) return false;
      try { this.ws.send(JSON.stringify(obj)); return true; } catch (e) { return false; }
    }

    _onAnyMessage() { this._scheduleInitialScan(300); }
    
    _scheduleInitialScan(ms) {
      if (this._initialTimer) clearTimeout(this._initialTimer);
      this._initialTimer = setTimeout(() => {
        this._initialTimer = 0;
        this._evaluateNamespaceAndManifest();
      }, ms);
    }
    
    _clearInitialScan() { if (this._initialTimer) { clearTimeout(this._initialTimer); this._initialTimer = 0; } }

    _handleMessage(msg) {
      const method = msg && msg.method;
      if (method === 'set' || method === 'update') {
        const cloudName = String(msg.name || '');
        const value = String(msg.value ?? '');
        if (!cloudName.startsWith('☁')) return;
        
        const oldValue = this.values.get(cloudName);
        this.values.set(cloudName, value);
        
        if (this.isCurrentProjectVar(cloudName)) {
          if (cloudName === this.getManifestName()) {
            const m = String(value).match(/^2(\d{6})/);
            if (m) this.seed = Number(m[1]);
          } else {
            const localName = this.fromCloudName(cloudName);
            if (localName && oldValue !== value) {
              this._varUpdateFlags.set(localName, true);
            }
            this.refreshCurrentProjectVars();
          }
        }
      }
    }

    getManifestName() {
      if (!this.projectId) return MANIFEST_PREFIX + 'default';
      const cleanPid = String(this.projectId).replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 20);
      return `${MANIFEST_PREFIX}${cleanPid}`;
    }

    _evaluateNamespaceAndManifest() {
      if (!this.ws) return;

      const manifestName = this.getManifestName();
      let hasManifest = false;
      let cv2Count = 0;
      let legacyCount = 0;

      this.refreshCurrentProjectVars();

      for (const cloudName of this.values.keys()) {
        if (cloudName === manifestName) { hasManifest = true; continue; }
        const parsed = this.parseCloudName(cloudName);
        if (parsed) {
          cv2Count++;
        } else if (cloudName.startsWith('☁')) {
          legacyCount++;
        }
      }

      if (legacyCount > 0 && !hasManifest) {
        const old = this.status;
        this.status = 'legacy-conflict';
        this._checkStatusChange(old);
        try { this.ws.close(); } catch (e) {}
        this.ws = null;
        return;
      }

      if (!hasManifest && cv2Count === 0 && legacyCount === 0) {
        const seed = Math.floor(100000 + Math.random() * 900000);
        this.seed = seed;
        const manifestVal = `2${String(seed).padStart(6,'0')}`;
        this._send({ method: 'set', name: manifestName, value: manifestVal });
        this.values.set(manifestName, manifestVal);
      }

      if (hasManifest && !this.seed) {
        const v = this.values.get(manifestName) || '';
        const m = String(v).match(/^2(\d{6})/);
        if (m) this.seed = Number(m[1]);
      }

      if (this.status === 'connecting' || this.status === 'disconnected' || this.status === 'error') {
        const old = this.status;
        this.status = 'connected';
        this._checkStatusChange(old);
      }
    }

    _guard() { 
      return this.status !== 'legacy-conflict' && this.ws && this.ws.readyState === 1 && this.projectId === this.connectedProjectId;
    }

    _checkStatusChange(oldStatus) {
      if (oldStatus !== this.status) {
        this._statusChanged = true;
        this._lastStatus = this.status;
      }
    }

    pollStatusChanged() {
      if (this._statusChanged) {
        this._statusChanged = false;
        return true;
      }
      return false;
    }

    getLastStatus() {
      return this._lastStatus;
    }

    setProjectId(pid) {
      const cleanPid = String(pid).replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 20);
      if (cleanPid) { 
        if (this.projectId !== cleanPid) {
          this.projectId = cleanPid;
          this._projectIdChanged = true;
          
          if (this.ws && this.ws.readyState === 1) {
            this.disconnect();
            this.connect(this.server, this.projectId);
          }
          
          this.refreshCurrentProjectVars();
        }
        return true; 
      }
      return false;
    }
    
    pollProjectIdChanged() {
      if (this._projectIdChanged) {
        this._projectIdChanged = false;
        return true;
      }
      return false;
    }
    
    getProjectId() { return this.projectId || '(未设置)'; }

    createVar(name) {
      if (this.status === 'legacy-conflict' || !this.projectId) return;
      const cloudName = this.toCloudName(name);
      if (!cloudName) return;
      if (!this.values.has(cloudName)) {
        this.values.set(cloudName, '0');
        this.refreshCurrentProjectVars();
      }
      this._send({ method: 'set', name: cloudName, value: String(this.values.get(cloudName)) });
    }
    
    deleteVar(name) {
      if (this.status === 'legacy-conflict' || !this.projectId) return;
      const cloudName = this.toCloudName(name);
      if (!cloudName) return;
      this.values.delete(cloudName);
      this.refreshCurrentProjectVars();
    }

    toNumberValue(value) {
      const num = Cast.toNumber(value);
      return isNaN(num) ? 0 : Math.floor(num);
    }

    setVar(name, value) {
      if (!this.projectId) return;
      const cloudName = this.toCloudName(name);
      if (!cloudName) return;
      
      const numValue = this.toNumberValue(value);
      const v = String(numValue);
      
      const oldValue = this.values.get(cloudName);
      
      const now = nowMs();
      const last = this.lastSendAt.get(cloudName) || 0;
      if (now - last < 100) {
        this.values.set(cloudName, v);
        if (oldValue !== v) {
          this._varUpdateFlags.set(name, true);
        }
        return;
      }

      if (this._guard()) {
        this.lastSendAt.set(cloudName, now);
        this.values.set(cloudName, v);
        this._send({ method: 'set', name: cloudName, value: v });
      } else {
        this.values.set(cloudName, v);
      }
      
      if (oldValue !== v) {
        this._varUpdateFlags.set(name, true);
      }
      
      this.refreshCurrentProjectVars();
    }

    changeVar(name, delta) {
      if (!this.projectId) return;
      const cloudName = this.toCloudName(name);
      if (!cloudName) return;
      const cur = Number(this.values.get(cloudName) || '0');
      const d = Cast.toNumber(delta) || 0;
      const next = cur + d;
      this.setVar(name, String(next));
    }

    getVar(name) {
      if (!this.projectId) return '0';
      const cloudName = this.toCloudName(name);
      if (!cloudName) return '0';
      const val = this.values.get(cloudName) ?? '0';
      const num = Number(val);
      return isNaN(num) ? '0' : String(num);
    }

    pollVarUpdated(name) {
      if (this._varUpdateFlags.get(name)) {
        this._varUpdateFlags.set(name, false);
        return true;
      }
      return false;
    }

    varExists(name) {
      if (!this.projectId) return false;
      const cloudName = this.toCloudName(name);
      if (!cloudName) return false;
      return this.values.has(cloudName);
    }

    listNames() {
      if (!this.projectId) return ['(请先设置项目ID)'];
      const varSet = this.projectVarLists.get(this.projectId);
      if (!varSet || varSet.size === 0) return ['(无)'];
      const out = Array.from(varSet);
      out.sort((a, b) => a.localeCompare(b));
      return out;
    }

    getAllCloudVariables() {
      const result = [];
      if (!this.projectId) return result;
      
      for (const [cloudName, value] of this.values.entries()) {
        const parsed = this.parseCloudName(cloudName);
        if (parsed && parsed.projectId === this.projectId && cloudName !== this.getManifestName()) {
          result.push(parsed.varName + ': ' + value);
        }
      }
      result.sort((a, b) => a.localeCompare(b));
      return result;
    }
  }

  const runtime = new CloudV2();

  // 积木左侧图标（base64 格式）
  const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCwwLDE4MS45OCwxODEuOTgiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNDkuNzA5OTEsLTg5LjAxKSI+PGcgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIj48ZyBmaWxsLXJ1bGU9Im5vbnplcm8iPjxwYXRoIGQ9Ik0xNTQuNzEwOTIsMTgwYzAsLTQ3LjQ5IDM4LjQ5OCwtODUuOTkgODUuOTg5LC04NS45OWM0Ny40OSwwIDg1Ljk5LDM4LjUgODUuOTksODUuOTljMCw0Ny40OSAtMzguNSw4NS45OSAtODUuOTksODUuOTljLTQ3LjQ5MSwwIC04NS45OSwtMzguNSAtODUuOTksLTg1Ljk5eiIgZmlsbD0iI2ZmOGMxOSIgc3Ryb2tlPSIjZGI2ZTAwIiBzdHJva2Utd2lkdGg9IjEwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMDAuNTYyOTIsMjI3LjU5YzAsMCAtMTguNDE5LC0xNi4xNzYgLTE2Ljc1MiwtNDkuNTkyYzEuMzksLTI3Ljg1OSAxOS41OTIsLTQ2LjkzIDE5LjU5MiwtNDYuOTMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTI4MC4xNzA5MSwxMzIuNDFjMCwwIDE3LjA1MSwxOS45OSAxNi44MDEsNDcuODc5Yy0wLjMsMzMuNDUyIC0xOS42NDEsNDguNjQzIC0xOS42NDEsNDguNjQzIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMjAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48cGF0aCBkPSJNMjI3LjY4MjkyLDE2MC40N2wyNC41NTMsNDEuNiIvPjxwYXRoIGQ9Ik0yNjEuNTkxOTEsMTYwLjQ3bC00Mi41NDYsMzkuNDQiLz48L2c+PC9nPjxnIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiPjxwYXRoIGQ9Ik0yOTAuNjIzNzMsMjI3LjQwOTEzYzYuNzA1MzQsMCAxMi4xNDExLDUuNDM1ODYgMTIuMTQxMSwxMi4xNDEzM2MwLDYuNzA1NDcgLTUuNDM1NzYsMTIuMTQxMzQgLTEyLjE0MTEsMTIuMTQxMzRoLTI2LjYwOTRjLTYuNzA1MzQsMCAtMTIuMTQxMSwtNS40MzU4NyAtMTIuMTQxMSwtMTIuMTQxMzRjMCwtNi43MDU0NyA1LjQzNTc2LC0xMi4xNDEzMyAxMi4xNDExLC0xMi4xNDEzM2gxLjIwNDE4YzAuNTI5NjcsLTYuMjg4MTMgNS43ODc5OCwtMTEuMTIyMjEgMTIuMDk4MjYsLTExLjEyMjIxYzYuMzEwMjgsMCAxMS41Njg1OSw0LjgzNDA5IDEyLjA5ODI2LDExLjEyMjIyeiIgZmlsbD0ibm9uZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMTQ5MDIiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIxNy41Ii8+PHBhdGggZD0iTTI5MC42MjM3MywyMjcuNDA5MTNjNi43MDUzNCwwIDEyLjE0MTEsNS40MzU4NiAxMi4xNDExLDEyLjE0MTMzYzAsNi43MDU0NyAtNS40MzU3NiwxMi4xNDEzNCAtMTIuMTQxMSwxMi4xNDEzNGgtMjYuNjA5NGMtNi43MDUzNCwwIC0xMi4xNDExLC01LjQzNTg3IC0xMi4xNDExLC0xMi4xNDEzNGMwLC02LjcwNTQ3IDUuNDM1NzYsLTEyLjE0MTMzIDEyLjE0MTEsLTEyLjE0MTMzaDEuMjA0MThjMC41Mjk2NywtNi4yODgxMyA1Ljc4Nzk4LC0xMS4xMjIyMSAxMi4wOTgyNiwtMTEuMTIyMjFjNi4zMTAyOCwwIDExLjU2ODU5LDQuODM0MDkgMTIuMDk4MjYsMTEuMTIyMjJ6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIvPjwvZz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PHBhdGggZD0iTTI5Ni41NDA0MSwyNDUuODAyMTFoMTkuMDg2MTZNMzA2LjA4MzkzLDIzNi4yNTk0N3YxOS4wODU3MSIgc3Ryb2tlLW9wYWNpdHk9IjAuMTUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyMCIvPjxwYXRoIGQ9Ik0yOTYuNTQwNDEsMjQ1LjgwMjExaDE5LjA4NjE2TTMwNi4wODM5MywyMzYuMjU5NDd2MTkuMDg1NzEiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxMCIvPjwvZz48L2c+PC9nPjwvc3ZnPg==';

  class CloudVarsV2Extension {
    getInfo() {
      return {
        id: 'morecloudvariable',
        name: '云变量+',
        color1: '#FF8C1A',
        color2: '#DB6E00',
        color3: '#B35400',
        blockIconURI: blockIconURI,
        blocks: [
          { opcode: 'setProjectId', blockType: B.COMMAND, text: '设置项目ID为 [PID]', arguments: { PID: { type: A.STRING, defaultValue: 'my_project' } } },
          { opcode: 'getProjectId', blockType: B.REPORTER, text: '当前项目ID' },
          { opcode: 'getCurrentServer', blockType: B.REPORTER, text: '当前服务器地址' },
          { opcode: 'connect', blockType: B.COMMAND, text: '连接云服务器 [SERVER]', arguments: { SERVER: { type: A.STRING, defaultValue: 'wss://clouddata.turbowarp.org' } } },
          { opcode: 'disconnect', blockType: B.COMMAND, text: '断开云服务器' },
          { opcode: 'status', blockType: B.REPORTER, text: '连接状态' },
          { opcode: 'version', blockType: B.REPORTER, text: '协议版本' },
          { opcode: 'createVar', blockType: B.COMMAND, text: '创建云变量 [NAME]', arguments: { NAME: { type: A.STRING, defaultValue: '云变量' } } },
          { opcode: 'deleteVar', blockType: B.COMMAND, text: '删除云变量 [NAME]', arguments: { NAME: { type: A.STRING, menu: 'varNames' } } },
          { opcode: 'setVar', blockType: B.COMMAND, text: '将 [NAME] 设为 [VAL]', arguments: { NAME: { type: A.STRING, menu: 'varNames' }, VAL: { type: A.STRING, defaultValue: '0' } } },
          { opcode: 'changeVar', blockType: B.COMMAND, text: '将 [NAME] 增加 [DELTA]', arguments: { NAME: { type: A.STRING, menu: 'varNames' }, DELTA: { type: A.STRING, defaultValue: '1' } } },
          { opcode: 'getVar', blockType: B.REPORTER, text: '读取 [NAME]', arguments: { NAME: { type: A.STRING, menu: 'varNames' } } },
          { opcode: 'getAllCloudVariables', blockType: B.REPORTER, text: '所有云变量' },
          { opcode: 'varExists', blockType: B.BOOLEAN, text: '云变量 [NAME] 存在?', arguments: { NAME: { type: A.STRING, menu: 'varNames' } } },
          { opcode: 'onVarUpdate', blockType: B.HAT, isEdgeActivated: true, text: '当云变量 [NAME] 被改变时', arguments: { NAME: { type: A.STRING, menu: 'varNames' } } },
          { opcode: 'onProjectIdChange', blockType: B.HAT, isEdgeActivated: true, text: '当项目ID被改变时' },
          { opcode: 'onStatusChange', blockType: B.HAT, isEdgeActivated: true, text: '当连接状态改变时' }
        ],
        menus: { varNames: { acceptReporters: true, items: 'listVarNamesDyn' } }
      };
    }

    setProjectId(args) { runtime.setProjectId(Cast.toString(args.PID).trim()); }
    getProjectId() { return runtime.getProjectId(); }
    getCurrentServer() { return runtime.getCurrentServer(); }
    connect(args) { runtime.connect(Cast.toString(args.SERVER), runtime.projectId); }
    disconnect() { runtime.disconnect(); }
    status() { return runtime.projectId ? runtime.status : '未设置项目ID'; }
    version() { return `${PROTOCOL_ID}/${VERSION}`; }
    createVar(args) { if (runtime.projectId) runtime.createVar(Cast.toString(args.NAME)); }
    deleteVar(args) { const n = Cast.toString(args.NAME); if (n && n !== '(无)' && n !== '(请先设置项目ID)') runtime.deleteVar(n); }
    setVar(args) { runtime.setVar(Cast.toString(args.NAME), Cast.toString(args.VAL)); }
    changeVar(args) { runtime.changeVar(Cast.toString(args.NAME), Cast.toNumber(args.DELTA)); }
    getVar(args) { return runtime.getVar(Cast.toString(args.NAME)); }
    getAllCloudVariables() { return runtime.getAllCloudVariables(); }
    varExists(args) { return runtime.varExists(Cast.toString(args.NAME)); }
    onVarUpdate(args) { return runtime.pollVarUpdated(Cast.toString(args.NAME)); }
    onProjectIdChange() { return runtime.pollProjectIdChanged(); }
    onStatusChange() { return runtime.pollStatusChanged(); }
    listVarNamesDyn() { return runtime.listNames(); }
  }

  Scratch.extensions.register(new CloudVarsV2Extension());
})(typeof Scratch === 'undefined' ? {} : Scratch);