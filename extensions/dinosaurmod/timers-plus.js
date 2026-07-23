(function (Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Timers Plus Extension must run unsandboxed");
  }

  const variables = {};
  const newTimers = [];

  variables["paused_timer"] = false;

  // This comes from https://github.com/PenguinMod/PenguinMod-Vm/blob/develop/src/util/timer.js
  class Timer {
    constructor (nowObj = Timer.nowObj) {
        /**
         * Used to store the start time of a timer action.
         * Updated when calling `timer.start`.
         */
      this.startTime = 0;

        /**
         * Used to pass custom logic for determining the value for "now",
         * which is sometimes useful for compatibility with Scratch 2
         */
      this.nowObj = nowObj;

        /**
         * Detirmins if this timer is paused or not
         */
      this._pausedTime = null;
    }

    /**
     * Disable use of self.performance for now as it results in lower performance
     * However, instancing it like below (caching the self.performance to a local variable) negates most of the issues.
     * @type {boolean}
     */
    static get USE_PERFORMANCE () {
      return false;
    }

    /**
     * Legacy object to allow for us to call now to get the old style date time (for backwards compatibility)
     * @deprecated This is only called via the nowObj.now() if no other means is possible...
     */
    static get legacyDateCode () {
      return {
        now: function () {
          return new Date().getTime();
        }
      };
    }

    /**
     * Use this object to route all time functions through single access points.
     */
    static get nowObj () {
      if (Timer.USE_PERFORMANCE && typeof self !== 'undefined' && self.performance && 'now' in self.performance) {
          return self.performance;
      } else if (Date.now) {
          return Date;
      }
      return Timer.legacyDateCode;
    }

    /**
     * Return the currently known absolute time, in ms precision.
     * @returns {number} ms elapsed since 1 January 1970 00:00:00 UTC.
     */
    time () {
      return this.nowObj.now();
    }

    /**
     * Returns a time accurate relative to other times produced by this function.
     * If possible, will use sub-millisecond precision.
     * If not, will use millisecond precision.
     * Not guaranteed to produce the same absolute values per-system.
     * @returns {number} ms-scale accurate time relative to other relative times.
     */
    relativeTime () {
      return this.nowObj.now();
    }

    /**
     * Start a timer for measuring elapsed time,
     * at the most accurate precision possible.
     */
    start () {
      this.startTime = this.nowObj.now();
    }

    /**
     * pause the timer
     */
    pause() {
      if (this._pausedTime) return;
      this._pausedTime = this.timeElapsed();
    }

    /**
     * unpause the timer
     */
    play() {
      if (!this._pausedTime) return;
      this.startTime = this.nowObj.now() - this._pausedTime;
      this._pausedTime = null;
    }

    timeElapsed () {
      if (this._pausedTime) return this._pausedTime;
      const now = this.nowObj.now();
      return now - this.startTime;
    }

    /**
     * Call a handler function after a specified amount of time has elapsed.
     * @param {function} handler - function to call after the timeout
     * @param {number} timeout - number of milliseconds to delay before calling the handler
     * @returns {number} - the ID of the new timeout
     */
    setTimeout (handler, timeout) {
      return global.setTimeout(handler, timeout);
    }

    /**
     * Clear a timeout from the pending timeout pool.
     * @param {number} timeoutId - the ID returned by `setTimeout()`
     * @memberof Timer
     */
    clearTimeout (timeoutId) {
      global.clearTimeout(timeoutId);
    }
  }
  
  // This code comes from TurboBuilder (https://github.com/jwklong/turbobuilder/blob/main/src/resources/compiler/compileVarSection.js)
  function compileVarSection() {
    const compileVars = {};
    compileVars._idx = 0;
    compileVars.new = () => {
      const _listLow = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
      const _listHigh = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      const _listSym = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '@', '#', '$', '%', '&', '(', ')', '_', '-', '+', '=', '[', ']', '|'];
      const list = [].concat(_listLow, _listHigh);
      let str = '';
      for (let i = 0; i < 16; i++) {
        str += list[Math.round(Math.random() * (list.length - 1))];
      };
      return str;
    };
    return compileVars.new()
  }

  class Extension {
    constructor(vm) {
      this.vm = vm;
      this.runtime = vm.runtime;

      const update = () => {
        for (const timer of newTimers) {
          if (!timer.paused) {
            const timerInstance = variables[timer.key];
            timerInstance.play();
            if (timerInstance) {
              timer.value = timerInstance.timeElapsed() / 1000;
            }
          } else {
            const timerInstance = variables[timer.key];
            timerInstance.pause();
          }
        }
        window.requestAnimationFrame(update);
      };
      window.requestAnimationFrame(update);
    }
    getExistingTimers() {
      if (!newTimers.length) return [
        { text: "No timers", value: "No timers" },
        { text: "Create new timer", value: () => this.createnewtimer() }
      ];
      return newTimers.map(timer => ({
        text: timer.name,
        value: timer.name
      }));
    }
    getInfo() {
      return {
        id: "TimersPlus",
        name: "Timers+",
        color1: "#5cb1d6",
        blocks: [
          {
            blockType: Scratch.BlockType.XML,
            xml: `<block id="timer" type="sensing_timer"/>`,
          },
          {
            blockType: Scratch.BlockType.XML,
            xml: `<block type="sensing_resettimer"/>`,
          },
          {
            opcode: 'pausetimer',
            text: 'pause timer',
            blockType: Scratch.BlockType.COMMAND,
            arguments: {}
          },
          {
            opcode: 'resumetimer',
            text: 'resume timer',
            blockType: Scratch.BlockType.COMMAND,
            arguments: {}
          },
          {
            opcode: 'pausedtimer',
            text: 'is timer paused?',
            blockType: Scratch.BlockType.BOOLEAN,
            arguments: {},
            disableMonitor: true
          },
          "---",
          {
            opcode: 'createnewtimer',
            text: 'Create new Timer',
            func: 'createnewtimer',
            blockType: Scratch.BlockType.BUTTON
          },
          {
            opcode: 'deletenewtimer',
            text: 'Delete existing Timer',
            func: 'deletenewtimer',
            blockType: Scratch.BlockType.BUTTON
          },
          {
            opcode: 'getcustomtimers',
            text: 'get timer [TIMERS]',
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              TIMERS: {
                type: Scratch.ArgumentType.STRING,
                menu: "timersMenu",
              },
            }
          },
          {
            opcode: 'resetcustomtimers',
            text: 'reset timer [TIMERS]',
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              TIMERS: {
                type: Scratch.ArgumentType.STRING,
                menu: "timersMenu",
              },
            }
          },
          {
            opcode: 'setcustomtimers',
            text: 'set timer [TIMERS] to [VALUE]',
            blockType: Scratch.BlockType.COMMAND,
            hideFromPalette: true,
            arguments: {
              TIMERS: {
                type: Scratch.ArgumentType.STRING,
                menu: "timersMenu",
              },
              VALUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0"
              },
            }
          },
          {
            opcode: 'pausecustomtimers',
            text: 'pause timer [TIMERS]',
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              TIMERS: {
                type: Scratch.ArgumentType.STRING,
                menu: "timersMenu",
              },
            }
          },
          {
            opcode: 'resumecustomtimers',
            text: 'resume timer [TIMERS]',
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              TIMERS: {
                type: Scratch.ArgumentType.STRING,
                menu: "timersMenu",
              },
            }
          },
          {
            opcode: 'pausedcustomtimer',
            text: 'is timer [TIMERS] paused?',
            blockType: Scratch.BlockType.BOOLEAN,
            arguments: {
              TIMERS: {
                type: Scratch.ArgumentType.STRING,
                menu: "timersMenu",
              },
            }
          },
        ],
        menus: {
          timersMenu: {
            acceptReporters: true,
            items: "getExistingTimers",
          }
        }
      }
    }
    pausetimer() { 
      variables["paused_timer"] = true;
      this.runtime.ioDevices.clock.pause();
    }
    resumetimer() {
      variables["paused_timer"] = false;
      this.runtime.ioDevices.clock.resume();
    }
    pausedtimer() {
      return !!variables["paused_timer"];
    }

    createnewtimer() {
      const timerName = prompt("Use a name for the timer");
      if (!timerName) return alert("Cancelled");
      const index = newTimers.findIndex(t => t.name === timerName);
      if (index !== -1) return alert(`A Timer already exists by the name: "${timerName}"`);

      const key = compileVarSection();
      variables[key] = new Timer({ now: () => this.runtime.currentMSecs });
      variables[key].start();

      newTimers.push({
        "name": timerName,
        "value": 0.00,
        "paused": false,
        "key": key
      });

      // this.runtime.emit("BLOCKSINFO_UPDATE", this.runtime);
      this.refreshToolbox();
    }
    deletenewtimer() {
      const timerName = prompt("Delete existing timer");
      if (!timerName) return alert("Cancelled");
      const index = newTimers.findIndex(t => t.name === timerName);
      if (index == -1) return alert("Timer does not exist.");

      newTimers.splice(index, 1);

      this.refreshToolbox();
    }
    getcustomtimers(args) {
      const timer = newTimers.find(t => t["name"] === args.TIMERS);
      return timer ? timer.value : 0;
    }
    resetcustomtimers(args) {
      const timer = newTimers.find(t => t["name"] === args.TIMERS);
      if (!timer) return;
      const timerInstance = variables[timer.key];
      timerInstance.start();
    }
    pausecustomtimers(args) {
      const timer = newTimers.find(t => t["name"] === args.TIMERS);
      if (!timer) return;
      timer.paused = true;
    }
    resumecustomtimers(args) {
      const timer = newTimers.find(t => t["name"] === args.TIMERS);
      if (!timer) return;
      timer.paused = false;
    }
    pausedcustomtimer(args) {
      const timer = newTimers.find(t => t["name"] === args.TIMERS);
      return timer ? timer.paused : false;
    }
    setcustomtimers(args) {
      const timer = newTimers.find(t => t["name"] === args.TIMERS);
      const timerInstance = variables[timer.key];
      if (timerInstance) {
        
      }
      timer.value = args.VALUE;
    }

    refreshToolbox() {
      if (window.Blockly) {
        const Blockly = window.Blockly;
        const workspace = Blockly.getMainWorkspace();
        const toolboxXml = workspace.options.languageTree.cloneNode(true);
        workspace.updateToolbox(toolboxXml);
      }
    }
  }

  Scratch.extensions.register(new Extension(Scratch.vm));
})(Scratch)