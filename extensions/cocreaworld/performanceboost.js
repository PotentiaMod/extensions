

(function(Scratch) {
  'use strict';

  class PerformanceBoost {
    constructor(runtime) {
      this.runtime = runtime;
      this.lastNetworkTime = 0;
      this.networkInterval = 50; // 节流间隔 ms
      this.fastMsgQueue = {};
      this.frameCount = 0;
      this.lastFpsTime = Date.now();
      this.currentFps = 60;
      this._startFpsCounter();
    }

    _startFpsCounter() {
      // 简易 FPS 计数器
      setInterval(() => {
        const now = Date.now();
        const elapsed = now - this.lastFpsTime;
        if (elapsed > 0) {
          this.currentFps = Math.round((this.frameCount * 1000) / elapsed);
        }
        this.frameCount = 0;
        this.lastFpsTime = now;
      }, 1000);
    }

    getInfo() {
      return {
        id: 'performanceboost',
        name: '性能提升',
        blocks: [
          {
            opcode: 'networkBoost',
            blockType: Scratch.BlockType.COMMAND,
            text: '联机提升 设置节流间隔 [MS] ms',
            arguments: {
              MS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              }
            }
          },
          {
            opcode: 'networkBoostCheck',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '联机提升 是否允许发送？'
          },
          {
            opcode: 'cloneBoost',
            blockType: Scratch.BlockType.COMMAND,
            text: '克隆体提升 建议：使用对象池，当前克隆数 [COUNT]',
            arguments: {
              COUNT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'cloneBoostCheck',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '克隆体提升 数量是否超过 [MAX]？',
            arguments: {
              MAX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              }
            }
          },
          {
            opcode: 'loopBoost',
            blockType: Scratch.BlockType.REPORTER,
            text: '循环提升 快速计算 1 到 [N] 的累加',
            arguments: {
              N: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              }
            }
          },
          {
            opcode: 'loopBoostBatch',
            blockType: Scratch.BlockType.REPORTER,
            text: '循环提升 批量运算 [A] + [B] × [N] 次',
            arguments: {
              A: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              B: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },
          {
            opcode: 'detectBoost',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '检测提升 距离 ([X1],[Y1]) 到 ([X2],[Y2]) < [DIST]',
            arguments: {
              X1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              X2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              Y2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              DIST: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 }
            }
          },
          {
            opcode: 'broadcastBoostSend',
            blockType: Scratch.BlockType.COMMAND,
            text: '广播提升 发送消息 [MSG]',
            arguments: {
              MSG: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'msg'
              }
            }
          },
          {
            opcode: 'broadcastBoostCheck',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '广播提升 收到消息 [MSG]？',
            arguments: {
              MSG: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'msg'
              }
            }
          },
          {
            opcode: 'fpsBoost',
            blockType: Scratch.BlockType.REPORTER,
            text: 'fps综合提升 当前FPS'
          },
          {
            opcode: 'fpsBoostSuggest',
            blockType: Scratch.BlockType.STRING,
            text: 'fps综合提升 获取优化建议'
          }
        ]
      };
    }

    // ===== 1. 联机提升 =====
    networkBoost(args) {
      this.networkInterval = Math.max(0, Number(args.MS));
    }

    networkBoostCheck() {
      const now = Date.now();
      if (now - this.lastNetworkTime >= this.networkInterval) {
        this.lastNetworkTime = now;
        return true;
      }
      return false;
    }

    // ===== 2. 克隆体提升 =====
    cloneBoost(args) {
      // 沙箱内无法直接控制 runtime 克隆，仅作提示
      console.log('[性能提升] 克隆体建议：用"显示/隐藏"代替"创建/删除克隆体"');
    }

    cloneBoostCheck(args) {
      // 尝试从 runtime 获取克隆数（沙箱内可能拿不到真实值）
      try {
        if (this.runtime && this.runtime.targets) {
          const clones = this.runtime.targets.filter(t => t.isOriginal ? false : true).length;
          return clones > Number(args.MAX);
        }
      } catch(e) {}
      return false;
    }

    // ===== 3. 循环提升 =====
    loopBoost(args) {
      let sum = 0;
      const n = Math.floor(Number(args.N));
      for (let i = 1; i <= n; i++) {
        sum += i;
      }
      return sum;
    }

    loopBoostBatch(args) {
      let result = Number(args.A);
      const b = Number(args.B);
      const n = Math.floor(Number(args.N));
      for (let i = 0; i < n; i++) {
        result += b;
      }
      return result;
    }

    // ===== 4. 检测提升 =====
    detectBoost(args) {
      const dx = Number(args.X1) - Number(args.X2);
      const dy = Number(args.Y1) - Number(args.Y2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist < Number(args.DIST);
    }

    // ===== 5. 广播提升 =====
    broadcastBoostSend(args) {
      const msg = String(args.MSG);
      this.fastMsgQueue[msg] = true;
      // 同时触发一个自定义事件，供高级用户使用
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('perf-boost-msg', { detail: msg }));
      }
    }

    broadcastBoostCheck(args) {
      const msg = String(args.MSG);
      if (this.fastMsgQueue[msg]) {
        this.fastMsgQueue[msg] = false; // 消费掉
        return true;
      }
      return false;
    }

    // ===== 6. FPS综合提升 =====
    fpsBoost() {
      this.frameCount++;
      return this.currentFps;
    }

    fpsBoostSuggest() {
      const fps = this.currentFps;
      if (fps >= 50) return '性能良好，无需优化';
      if (fps >= 30) return '建议：减少克隆体数量，降低检测频率';
      if (fps >= 15) return '建议：使用对象池，避免高频广播，简化背景';
      return '建议：关闭非必要特效，减少角色数量，考虑导出到 TurboWarp';
    }
  }

  // 注册扩展
  if (typeof Scratch !== 'undefined' && Scratch.extensions) {
    Scratch.extensions.register(new PerformanceBoost());
  }

})(Scratch);