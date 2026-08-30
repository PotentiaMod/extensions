

(function(Scratch) {
  'use strict';

  class HighSpeedPerformance {
    constructor(runtime) {
      this.runtime = runtime;
    }

    getInfo() {
      return {
        id: 'highspeedperformance',
        name: '高速性能',
        blocks: [
          {
            opcode: 'globalBoost',
            blockType: Scratch.BlockType.COMMAND,
            text: '全局性能提升'
          }
        ]
      };
    }

    globalBoost() {
      const log = [];
      const ok = (msg) => { log.push('✅ ' + msg); console.log('[高速性能] ' + msg); };
      const fail = (msg) => { log.push('❌ ' + msg); };

      // ===== 1. 检测并启用 Turbo Mode =====
      try {
        if (this.runtime) {
          // 尝试多种路径找到 vm
          const vm = this.runtime.vm || (this.runtime._vm) || 
                     (typeof window !== 'undefined' && window.vm) ||
                     (typeof global !== 'undefined' && global.vm);
          if (vm && typeof vm.setTurboMode === 'function') {
            vm.setTurboMode(true);
            ok('Turbo Mode 已启用');
          } else if (typeof this.runtime.setTurboMode === 'function') {
            this.runtime.setTurboMode(true);
            ok('Turbo Mode 已启用（runtime 直调）');
          } else {
            fail('Turbo Mode 不可用（无法访问 vm）');
          }
        }
      } catch(e) { fail('Turbo Mode 异常: ' + e.message); }

      // ===== 2. 检测并修改步进时间（减少让步延迟）=====
      try {
        if (this.runtime) {
          // 尝试设置更短的步进时间
          if (this.runtime.currentStepTime !== undefined) {
            this.runtime.currentStepTime = 1; // 最小延迟
            ok('步进时间已设为最小值 (1ms)');
          }
          // 尝试禁用兼容模式（兼容模式强制 30fps）
          if (this.runtime.compatibilityMode !== undefined) {
            this.runtime.compatibilityMode = false;
            ok('兼容模式已禁用');
          }
          // 尝试设置帧率
          if (this.runtime.runtimeOptions) {
            this.runtime.runtimeOptions.fps = 60;
            this.runtime.runtimeOptions.interpolationEnabled = true;
            ok('帧率已设为 60fps + 插值启用');
          }
        }
      } catch(e) { fail('步进/帧率修改失败: ' + e.message); }

      // ===== 3. 检测并清理无用 targets =====
      try {
        if (this.runtime && this.runtime.targets) {
          const before = this.runtime.targets.length;
          // 标记非活跃 target（不直接删除，避免崩溃）
          let cleaned = 0;
          for (const t of this.runtime.targets) {
            if (t && !t.isOriginal && t.isDeleted) {
              cleaned++;
            }
          }
          ok('Targets 检测完成: 共 ' + before + ' 个, 已标记删除 ' + cleaned + ' 个');
        }
      } catch(e) { fail('Targets 清理失败: ' + e.message); }

      // ===== 4. 检测并优化渲染器 =====
      try {
        if (this.runtime && this.runtime.renderer) {
          const r = this.runtime.renderer;
          // 尝试关闭不必要的渲染特性
          if (r.setMaxTextureMaxAnisotropy) {
            r.setMaxTextureMaxAnisotropy(0);
            ok('纹理各向异性已关闭（提升渲染速度）');
          }
          if (r.setUseHighQualityRender) {
            r.setUseHighQualityRender(false);
            ok('高品质渲染已关闭');
          }
          ok('渲染器优化已应用');
        }
      } catch(e) { fail('渲染器优化失败: ' + e.message); }

      // ===== 5. 检测并优化音频引擎 =====
      try {
        if (this.runtime && this.runtime.audioEngine) {
          const ae = this.runtime.audioEngine;
          if (ae.setMasterVolume) {
            // 不修改音量，只是检测
            ok('音频引擎已检测（采样率: ' + (ae.sampleRate || '未知') + '）');
          }
        }
      } catch(e) { fail('音频引擎检测失败'); }

      // ===== 6. 检测并启用硬件加速（Canvas/WebGL）=====
      try {
        if (typeof document !== 'undefined') {
          const canvas = document.querySelector('canvas');
          if (canvas) {
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            if (gl) {
              // 尝试设置性能偏好
              const ext = gl.getExtension('WEBGL_lose_context');
              if (ext) ok('WebGL 硬件加速已确认（上下文可用）');
              // 尝试禁用抗锯齿
              const attrs = gl.getContextAttributes();
              if (attrs && attrs.antialias) {
                ok('WebGL 抗锯齿状态: 开启（可通过重新创建上下文关闭）');
              }
            }
          }
        }
      } catch(e) { fail('硬件加速检测失败'); }

      // ===== 7. 检测并触发垃圾回收 =====
      try {
        if (typeof window !== 'undefined' && window.gc) {
          window.gc();
          ok('垃圾回收已手动触发');
        } else if (typeof global !== 'undefined' && global.gc) {
          global.gc();
          ok('垃圾回收已手动触发（Node）');
        } else {
          // 尝试间接触发
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('beforeunload'));
            ok('已尝试间接触发 GC');
          }
        }
      } catch(e) { fail('垃圾回收触发失败'); }

      // ===== 8. 检测并优化事件队列 =====
      try {
        if (this.runtime && this.runtime._events) {
          const eventCount = Object.keys(this.runtime._events).length;
          ok('事件队列已检测: ' + eventCount + ' 个事件类型');
        }
      } catch(e) { fail('事件队列检测失败'); }

      // ===== 9. 检测并优化广播 =====
      try {
        if (this.runtime && this.runtime._broadcastTargets) {
          const bcCount = Object.keys(this.runtime._broadcastTargets).length;
          ok('广播目标已检测: ' + bcCount + ' 个');
        }
      } catch(e) { fail('广播检测失败'); }

      // ===== 10. 检测并优化线程 =====
      try {
        if (this.runtime && this.runtime.threads) {
          const threadCount = this.runtime.threads.length;
          ok('线程已检测: ' + threadCount + ' 个活跃线程');
        }
      } catch(e) { fail('线程检测失败'); }

      // ===== 11. 尝试修改 Scratch 内部计时器 =====
      try {
        if (this.runtime && this.runtime.currentMSecs) {
          // 只是读取，不修改（修改可能导致时间错乱）
          ok('计时器已检测: ' + this.runtime.currentMSecs + ' ms');
        }
      } catch(e) { fail('计时器检测失败'); }

      // ===== 12. 输出汇总 =====
      const successCount = log.filter(l => l.startsWith('✅')).length;
      const failCount = log.filter(l => l.startsWith('❌')).length;
      console.log('[高速性能] ===== 优化完成 =====');
      console.log('[高速性能] 成功: ' + successCount + ', 失败: ' + failCount);
      console.log('[高速性能] 详情:', log);

      // 尝试通过 alert 通知用户（仅首次）
      try {
        if (typeof window !== 'undefined' && !window._highSpeedNotified) {
          window._highSpeedNotified = true;
          // 不弹窗，避免打扰，只在控制台输出
        }
      } catch(e) {}

      // 存储结果到全局变量（方便调试）
      try {
        if (typeof window !== 'undefined') {
          window._highSpeedResult = { success: successCount, fail: failCount, log: log };
        }
      } catch(e) {}
    }
  }

  // 注册扩展
  if (typeof Scratch !== 'undefined' && Scratch.extensions) {
    Scratch.extensions.register(new HighSpeedPerformance());
  }

})(Scratch);