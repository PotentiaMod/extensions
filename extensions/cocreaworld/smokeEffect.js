const ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij4KICA8cmFkaWFsR3JhZGllbnQgaWQ9ImciIGN4PSIzMiIgY3k9IjMyIiByPSIzMiI+CiAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmZmZmZmIiBzdG9wLW9wYWNpdHk9IjEuMCIvPgogICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiNkZGQ5ZDEiIHN0b3Atb3BhY2l0eT0iMC42Ii8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM4ODg0N2MiIHN0b3Atb3BhY2l0eT0iMCIvPgogIDwvcmFkaWFsR3JhZGllbnQ+CiAgPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIGZpbGw9InVybCgjZykiLz4KPC9zdmc+';

const PRESETS = {
  '白色': ['#ffffff', '#d8d8d8'],
  '黄色': ['#fff3b0', '#e6c200'],
  '绿色': ['#b6f5c8', '#1faa4b'],
  '红色': ['#ffc2c2', '#d11a1a'],
  '粉色': ['#ffd0ec', '#ff3aa6'],
  '蓝色': ['#c2e0ff', '#1f6fff'],
  '紫色': ['#e3c8ff', '#8a1fff']
};

function toHex(c) {
  if (typeof c === 'number') return '#' + ('000000' + (c & 0xffffff).toString(16)).slice(-6);
  if (typeof c === 'string') {
    if (c[0] === '#') return c;
    const m = c.match(/rgba?\((\d+),(\d+),(\d+)/i);
    if (m) return '#' + ('000000' + ((+m[1] << 16) | (+m[2] << 8) | (+m[3])).toString(16)).slice(-6);
  }
  return '#cccccc';
}

function parseRGB(c) {
  const h = toHex(c).slice(1);
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function lerpColor(a, b, t) {
  const A = parseRGB(a), B = parseRGB(b);
  return [
    Math.round(A[0] + (B[0] - A[0]) * t),
    Math.round(A[1] + (B[1] - A[1]) * t),
    Math.round(A[2] + (B[2] - A[2]) * t)
  ];
}

class SmokeEffect {
  constructor(runtime) {
    this.runtime = runtime;
    this.canvas = null;
    this.ctx = null;
    this.raf = null;
    this.running = false;
    this.particles = [];
    this.sprite = null;
    this._stageEl = null;
    this.cfg = {
      angle: -90,
      wind: 0.4,
      rise: 1.0,
      shape: '软团',
      color1: '#ffffff',
      color2: '#d8d8d8',
      size: 4,
      density: 14,
      speed: 1.0,
      opacity: 0.8,
      blend: '正常',
      originX: 0,
      originY: -120,
      follow: '',
      followCamera: false
    };
  }

  getInfo() {
    return {
      id: 'smokeEffect',
      name: '烟雾特效',
      color1: '#5b6470',
      color2: '#3e4c59',
      menuIconURI: ICON,
      blockIconURI: ICON,
      blocks: [
        { opcode: 'startSmoke', blockType: 'command', text: '开启烟雾' },
        { opcode: 'stopSmoke', blockType: 'command', text: '关闭烟雾' },
        { opcode: 'extractionSmoke', blockType: 'command', text: '生成撤离点烟雾(颜色 [PRESET])', arguments: { PRESET: { type: 'string', menu: 'PRESET', defaultValue: '白色' } } },
        { opcode: 'setOrigin', blockType: 'command', text: '烟雾源舞台坐标 X [X] Y [Y]', arguments: { X: { type: 'number', defaultValue: 0 }, Y: { type: 'number', defaultValue: -120 } } },
        { opcode: 'followSprite', blockType: 'command', text: '烟雾跟随角色 [NAME]', arguments: { NAME: { type: 'string', defaultValue: '' } } },
        { opcode: 'unfollow', blockType: 'command', text: '取消跟随角色' },
        { opcode: 'setFollowCamera', blockType: 'command', text: '烟雾跟随相机 [ON]', arguments: { ON: { type: 'Boolean', defaultValue: true } } },
        { opcode: 'cameraX', blockType: 'reporter', text: '镜头 X' },
        { opcode: 'cameraY', blockType: 'reporter', text: '镜头 Y' },
        { opcode: 'cameraZoom', blockType: 'reporter', text: '镜头 缩放' },
        { opcode: 'setDrift', blockType: 'command', text: '设置飘向角度 [ANGLE]', arguments: { ANGLE: { type: 'number', defaultValue: -90 } } },
        { opcode: 'setRise', blockType: 'command', text: '设置上升高度 [RISE]', arguments: { RISE: { type: 'number', defaultValue: 1 } } },
        { opcode: 'setShape', blockType: 'command', text: '设置形态 [SHAPE]', arguments: { SHAPE: { type: 'string', menu: 'SHAPE', defaultValue: '软团' } } },
        { opcode: 'setPreset', blockType: 'command', text: '设置颜色预设 [PRESET]', arguments: { PRESET: { type: 'string', menu: 'PRESET', defaultValue: '白色' } } },
        { opcode: 'setColor1', blockType: 'command', text: '设置颜色1 [C1]', arguments: { C1: { type: 'color', defaultValue: '#ffffff' } } },
        { opcode: 'setColor2', blockType: 'command', text: '设置颜色2 [C2]', arguments: { C2: { type: 'color', defaultValue: '#d8d8d8' } } },
        { opcode: 'setSize', blockType: 'command', text: '设置颗粒大小 [SIZE]', arguments: { SIZE: { type: 'number', defaultValue: 4 } } },
        { opcode: 'setDensity', blockType: 'command', text: '设置颗粒数量 [DENSITY]', arguments: { DENSITY: { type: 'number', defaultValue: 14 } } },
        { opcode: 'setSpeed', blockType: 'command', text: '设置速度 [SPEED]', arguments: { SPEED: { type: 'number', defaultValue: 1 } } },
        { opcode: 'setOpacity', blockType: 'command', text: '设置不透明度 [OP]', arguments: { OP: { type: 'number', defaultValue: 0.8 } } },
        { opcode: 'setBlend', blockType: 'command', text: '设置混合模式 [BLEND]', arguments: { BLEND: { type: 'string', menu: 'BLEND', defaultValue: '正常' } } },
        { opcode: 'isRunning', blockType: 'Boolean', text: '烟雾是否开启?' }
      ],
      menus: {
        SHAPE: { acceptReporters: false, items: ['软团', '上升柱', '撤离柱', '爆炸', '横流'] },
        BLEND: { acceptReporters: false, items: ['正常', '发光', '叠加'] },
        PRESET: { acceptReporters: false, items: ['白色', '黄色', '绿色', '红色', '粉色', '蓝色', '紫色'] }
      }
    };
  }

  _findStage() {
    if (this._stageEl && this._stageEl.isConnected) return;
    const cands = Array.from(document.querySelectorAll('canvas'));
    let best = null, bestArea = 0;
    for (const c of cands) {
      const r = c.getBoundingClientRect();
      const area = r.width * r.height;
      if (r.width > 200 && area > bestArea) { bestArea = area; best = c; }
    }
    this._stageEl = best;
  }

  _stageRect() {
    this._findStage();
    return this._stageEl ? this._stageEl.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
  }

  _ensureCanvas() {
    if (this.canvas) return;
    const c = document.createElement('canvas');
    c.style.cssText = 'position:fixed;left:0;top:0;pointer-events:none;z-index:99990;';
    document.body.appendChild(c);
    this.canvas = c;
    this.ctx = c.getContext('2d');
    this._resize();
    if (typeof window !== 'undefined') window.addEventListener('resize', () => this._resize());
    this._buildSprite();
  }

  _resize() {
    if (!this.canvas) return;
    const r = this._stageRect();
    this.canvas.style.left = r.left + 'px';
    this.canvas.style.top = r.top + 'px';
    this.canvas.style.width = r.width + 'px';
    this.canvas.style.height = r.height + 'px';
    this.canvas.width = Math.max(1, Math.round(r.width));
    this.canvas.height = Math.max(1, Math.round(r.height));
  }

  _buildSprite() {
    const s = 128;
    const cv = document.createElement('canvas');
    cv.width = cv.height = s;
    const g = cv.getContext('2d');
    const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.45, 'rgba(255,255,255,0.55)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
    this.sprite = cv;
  }

  _origin() {
    let wx = this.cfg.originX, wy = this.cfg.originY;
    if (this.cfg.follow && this.runtime) {
      const t = this.runtime.getTargetByName ? this.runtime.getTargetByName(this.cfg.follow) : null;
      if (t) { wx = t.x; wy = t.y; }
    }
    return { x: wx, y: wy };
  }

  _camera() {
    const r = this.runtime;
    if (!r) return { x: 0, y: 0, zoom: 1 };
    try {
      const rd = r.renderer;
      if (rd && typeof rd.getCameraPosition === 'function') {
        const p = rd.getCameraPosition();
        const z = (typeof rd.getCameraScale === 'function') ? rd.getCameraScale() : 1;
        if (p) return { x: p.x || 0, y: p.y || 0, zoom: z || 1 };
      }
      if (r.camera) return { x: r.camera.x || 0, y: r.camera.y || 0, zoom: r.camera.zoom || r.camera.scale || 1 };
      if (typeof r.getCamera === 'function') {
        const c = r.getCamera();
        if (c) return { x: c.x || 0, y: c.y || 0, zoom: c.zoom || 1 };
      }
    } catch (e) {}
    return { x: 0, y: 0, zoom: 1 };
  }

  _w2s(wx, wy, cam) {
    const W = this.canvas.width, H = this.canvas.height;
    const sx = ((wx - cam.x) * cam.zoom + 240) / 480 * W;
    const sy = (180 - (wy - cam.y) * cam.zoom) / 360 * H;
    return [sx, sy];
  }

  _spawn() {
    const cfg = this.cfg;
    const W = this.canvas.width;
    const PW = W / 480; // 屏幕像素 / 世界单位
    const rad = cfg.angle * Math.PI / 180;
    const windX = Math.cos(rad) * cfg.wind * cfg.speed;
    const windY = Math.sin(rad) * cfg.wind * cfg.speed;
    const o = this._origin();
    const grain = cfg.size;
    let wx, wy, wvx, wvy, life, r;
    if (cfg.shape === '爆炸') {
      wx = o.x; wy = o.y;
      const a = Math.random() * Math.PI * 2;
      const sp = (0.4 + Math.random() * 1.6) * cfg.speed;
      wvx = (Math.cos(a) * sp) / PW; wvy = (Math.sin(a) * sp) / PW;
      life = 90 + Math.random() * 90; r = grain * (0.7 + Math.random() * 1.2);
    } else if (cfg.shape === '撤离柱' || cfg.shape === '上升柱') {
      // 小颗粒挤在源点附近，慢慢往上堆成烟柱
      wx = o.x + (Math.random() - 0.5) * grain * 10 / PW;
      wy = o.y + (Math.random() - 0.5) * grain * 4 / PW;
      wvx = (windX + (Math.random() - 0.5) * 0.15 * cfg.wind) / PW;
      wvy = (-(0.5 + cfg.rise * 0.6 + Math.random() * 0.4) * cfg.speed) / PW;
      life = 160 + Math.random() * 140; r = grain * (0.7 + Math.random() * 1.2);
    } else {
      // 软团 / 横流：大量小颗粒在源点附近堆在一起
      wx = o.x + (Math.random() - 0.5) * grain * 16 / PW;
      wy = o.y + (Math.random() - 0.5) * grain * 10 / PW;
      wvx = (windX + (Math.random() - 0.5) * 0.3) / PW;
      wvy = (windY - cfg.rise * 0.4 * cfg.speed) / PW;
      if (cfg.shape === '横流') { wvy *= 0.3; wvx += ((cfg.angle === 0 ? 1 : -1) * 0.3 * cfg.speed) / PW; }
      life = 120 + Math.random() * 120; r = grain * (0.7 + Math.random() * 1.2);
    }
    this.particles.push({ wx, wy, wvx, wvy, life: 0, maxLife: life, r, seed: Math.random() * 100 });
  }

  _update() {
    const cfg = this.cfg;
    const W = this.canvas.width;
    const PW = W / 480;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life++;
      if (cfg.shape === '爆炸') {
        p.wvy += (0.04 * cfg.speed) / PW;
        p.r += 0.02 * cfg.speed;
      } else if (cfg.shape === '撤离柱' || cfg.shape === '上升柱') {
        p.wvy -= (cfg.rise * 0.008 * cfg.speed) / PW;
        p.wvx += (Math.sin((p.life + p.seed) * 0.05) * 0.1 * cfg.wind) / PW;
        p.r += 0.05 * cfg.speed;
      } else {
        p.wvy -= (cfg.rise * 0.01 * cfg.speed) / PW;
        p.wvx += (Math.sin((p.life + p.seed) * 0.05) * 0.08 * cfg.wind) / PW;
        p.r += 0.06 * cfg.speed;
      }
      p.wx += p.wvx * cfg.speed;
      p.wy += p.wvy * cfg.speed;
      if (p.life >= p.maxLife) this.particles.splice(i, 1);
    }
    for (let k = 0; k < cfg.density; k++) this._spawn();
    if (this.particles.length > 4000) this.particles.splice(0, this.particles.length - 4000);
  }

  _draw() {
    const ctx = this.ctx, cfg = this.cfg;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const cam = cfg.followCamera ? this._camera() : { x: 0, y: 0, zoom: 1 };
    ctx.globalCompositeOperation = cfg.blend === '正常' ? 'source-over' : (cfg.blend === '发光' ? 'screen' : 'lighter');
    for (const p of this.particles) {
      const t = p.life / p.maxLife;
      const [rr, gg, bb] = lerpColor(cfg.color1, cfg.color2, t);
      // 颗粒淡入淡出，避免生硬闪现
      const fade = t < 0.15 ? (t / 0.15) : (1 - (t - 0.15) / 0.85);
      const alpha = cfg.opacity * Math.max(0, Math.min(1, fade)) * 0.9;
      if (alpha <= 0.01) continue;
      const [sx, sy] = this._w2s(p.wx, p.wy, cam);
      const rad = p.r * cam.zoom;
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, rad);
      grad.addColorStop(0, `rgba(${rr},${gg},${bb},${alpha})`);
      grad.addColorStop(1, `rgba(${rr},${gg},${bb},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, rad, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  _loop() {
    if (!this.running) { this.raf = null; return; }
    this._resize();
    this._update();
    this._draw();
    this.raf = requestAnimationFrame(() => this._loop());
  }

  startSmoke() {
    this._ensureCanvas();
    if (this.running) return;
    this.running = true;
    this._loop();
  }

  stopSmoke() {
    this.running = false;
    if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.length = 0;
  }

  extractionSmoke(args) {
    const p = PRESETS[String(args.PRESET)] || PRESETS['白色'];
    this.cfg.color1 = p[0];
    this.cfg.color2 = p[1];
    this.cfg.shape = '撤离柱';
    this.cfg.rise = 1.6;
    this.cfg.size = 5;
    this.cfg.density = 18;
    this.cfg.opacity = 0.85;
    this.cfg.blend = '正常';
    this.startSmoke();
  }

  setOrigin(args) { this.cfg.originX = Number(args.X); this.cfg.originY = Number(args.Y); this.cfg.follow = ''; }
  followSprite(args) { this.cfg.follow = String(args.NAME); }
  unfollow() { this.cfg.follow = ''; }
  setDrift(args) { this.cfg.angle = Number(args.ANGLE); }
  setRise(args) { this.cfg.rise = Number(args.RISE); }
  setShape(args) { this.cfg.shape = String(args.SHAPE); }
  setPreset(args) { const p = PRESETS[String(args.PRESET)]; if (p) { this.cfg.color1 = p[0]; this.cfg.color2 = p[1]; } }
  setColor1(args) { this.cfg.color1 = toHex(args.C1); }
  setColor2(args) { this.cfg.color2 = toHex(args.C2); }
  setSize(args) { this.cfg.size = Number(args.SIZE); }
  setDensity(args) { this.cfg.density = Math.max(1, Math.min(40, Number(args.DENSITY))); }
  setSpeed(args) { this.cfg.speed = Math.max(0.1, Number(args.SPEED)); }
  setOpacity(args) { this.cfg.opacity = Math.max(0, Math.min(1, Number(args.OP))); }
  setBlend(args) { this.cfg.blend = (args.BLEND === '正常' || args.BLEND === '发光' || args.BLEND === '叠加') ? args.BLEND : '发光'; }
  setFollowCamera(args) { this.cfg.followCamera = !!args.ON; }
  cameraX() { return this._camera().x; }
  cameraY() { return this._camera().y; }
  cameraZoom() { return this._camera().zoom; }
  isRunning() { return this.running; }
}

if (typeof window !== 'undefined') {
  window.tempExt = {
    Extension: SmokeEffect,
    info: {
      name: 'smoke.extensionName',
      description: 'smoke.description',
      extensionId: 'smokeEffect',
      iconURL: ICON,
      featured: true,
      disabled: false,
      collaborator: 'ccw collaborator only'
    },
    l10n: {
      'zh-cn': {
        'smoke.extensionName': '烟雾特效',
        'smoke.description': '舞台内烟雾特效，支持撤离点烟柱、飘向、高度、形态与颜色可调'
      },
      en: {
        'smoke.extensionName': 'Smoke Effect',
        'smoke.description': 'Stage smoke effect with extraction-pillar, drift, height, shape and color controls'
      }
    }
  };
}

if (typeof Scratch !== 'undefined' && Scratch.extensions) {
  Scratch.extensions.register(new SmokeEffect());
}
