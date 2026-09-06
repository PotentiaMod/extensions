// Name: 按键侦测
// ID: advancedkeys
// Description: 更多的按键侦测与组合键侦测等进阶功能。
// By: Yesshape <https://scratch.mit.edu/users/yesshape/>

(function (Scratch) {
  "use strict";

  const KeyCodes = {
    // 字母键
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,

    // 数字键 (主键盘区)
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,

    // 功能键
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,

    // 方向键
    "arrow left": 37,
    "arrow up": 38,
    "arrow right": 39,
    "arrow down": 40,

    // 特殊键
    space: 32,
    enter: 13,
    shift: 16,
    ctrl: 17,
    alt: 18,
    "caps lock": 20,
    esc: 27,
    "page up": 33,
    "page down": 34,
    end: 35,
    home: 36,
    insert: 45,
    delete: 46,
    backspace: 8,
    tab: 9,

    // 符号键
    "`": 192,
    "-": 189,
    "=": 187,
    "[": 219,
    "]": 221,
    "\\": 220,
    ";": 186,
    "'": 222,
    ",": 188,
    ".": 190,
    "/": 191,

    // 小键盘
    "num 0": 96,
    "num 1": 97,
    "num 2": 98,
    "num 3": 99,
    "num 4": 100,
    "num 5": 101,
    "num 6": 102,
    "num 7": 103,
    "num 8": 104,
    "num 9": 105,
    "num *": 106,
    "num +": 107,
    "num -": 109,
    "num .": 110,
    "num /": 111,

    // 媒体键 (部分浏览器可能不支持)
    "media play": 179,
    "media pause": 179,
    "media next": 176,
    "media previous": 177,
    "volume up": 175,
    "volume down": 174,
    "volume mute": 173,
  };

  // 数字键映射表 - 修复数字键检测问题
  const NumberKeyMap = {
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
  };

  class AdvancedKeyDetection {
    constructor() {
      this.keysPressed = {};
      this.keyEvents = [];
      this.maxEvents = 100;
      this.combinationMode = false;
      this.combinationKeys = [];
      this.combinationTimeout = null;
      this.combinationTimeWindow = 500; // 组合键时间窗口（毫秒）

      // 初始化事件监听
      if (typeof document !== "undefined") {
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("keyup", this.handleKeyUp.bind(this));
      }
    }

    getInfo() {
      return {
        id: "advancedkeys",
        name: "按键侦测",
        color1: "#5cb1d6", // 主色
        color2: "#47a8d1", // 复色
        blocks: [
          {
            opcode: "keyPressed",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "按下 [KEY] 键?",
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                menu: "keysMenu",
              },
            },
          },
          {
            opcode: "anyKeyPressed",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "按下任意键？",
          },
          {
            opcode: "getLastKey",
            blockType: Scratch.BlockType.REPORTER,
            text: "最后按下的键",
          },
          {
            opcode: "getKeyName",
            blockType: Scratch.BlockType.REPORTER,
            text: "按键码 [CODE] 的名称",
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 65,
              },
            },
          },
          {
            opcode: "getKeyCode",
            blockType: Scratch.BlockType.REPORTER,
            text: "按键 [KEY] 的键码",
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                menu: "keysMenu",
              },
            },
          },
          {
            opcode: "isModifierPressed",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "按下修饰键 [MOD]？",
            arguments: {
              MOD: {
                type: Scratch.ArgumentType.STRING,
                menu: "modifiersMenu",
              },
            },
          },
          {
            opcode: "getKeyEvents",
            blockType: Scratch.BlockType.REPORTER,
            text: "按键事件记录",
          },
          "---",
          {
            opcode: "clearKeyEvents",
            blockType: Scratch.BlockType.COMMAND,
            text: "清空按键事件记录",
          },
          "---",
          {
            opcode: "startCombinationDetection",
            blockType: Scratch.BlockType.COMMAND,
            text: "开始检测组合键",
          },
          {
            opcode: "stopCombinationDetection",
            blockType: Scratch.BlockType.COMMAND,
            text: "停止检测组合键",
          },
          {
            opcode: "isCombinationPressed",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "按下了组合键 [KEYS]？",
            arguments: {
              KEYS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "ctrl+a",
              },
            },
          },
          {
            opcode: "getCurrentCombination",
            blockType: Scratch.BlockType.REPORTER,
            text: "当前组合键",
          },
          {
            opcode: "setCombinationTimeWindow",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置组合键时间窗口 [TIME] 毫秒",
            arguments: {
              TIME: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 500,
              },
            },
          },
        ],
        menus: {
          keysMenu: {
            acceptReporters: true,
            items: Object.keys(KeyCodes).map((key) => ({
              text: key,
              value: key,
            })),
          },
          modifiersMenu: {
            acceptReporters: true,
            items: [
              { text: "Shift", value: "shift" },
              { text: "Control", value: "ctrl" },
              { text: "Alt", value: "alt" },
              { text: "Meta/Windows", value: "meta" },
            ],
          },
        },
      };
    }

    handleKeyDown(event) {
      let key = event.key.toLowerCase();
      const code = event.keyCode || event.which;

      // 修复数字键检测问题
      if (NumberKeyMap[key]) {
        key = NumberKeyMap[key];
      }

      this.keysPressed[key] = true;
      this.keysPressed[code] = true;

      // 记录事件
      this.keyEvents.unshift({
        type: "down",
        key: key,
        code: code,
        timestamp: Date.now(),
      });

      // 限制事件记录数量
      if (this.keyEvents.length > this.maxEvents) {
        this.keyEvents.pop();
      }

      // 组合键检测
      if (this.combinationMode) {
        // 避免重复添加相同的键
        if (!this.combinationKeys.includes(key)) {
          this.combinationKeys.push(key);
        }

        // 重置超时计时器
        if (this.combinationTimeout) {
          clearTimeout(this.combinationTimeout);
        }

        // 设置新的超时计时器
        this.combinationTimeout = setTimeout(() => {
          this.combinationKeys = [];
        }, this.combinationTimeWindow);
      }

      // 阻止默认行为，避免按键重复输入到输入框
      if (event.target === document.body) {
        event.preventDefault();
      }
    }

    handleKeyUp(event) {
      let key = event.key.toLowerCase();
      const code = event.keyCode || event.which;

      // 修复数字键检测问题
      if (NumberKeyMap[key]) {
        key = NumberKeyMap[key];
      }

      this.keysPressed[key] = false;
      this.keysPressed[code] = false;

      // 记录事件
      this.keyEvents.unshift({
        type: "up",
        key: key,
        code: code,
        timestamp: Date.now(),
      });

      // 限制事件记录数量
      if (this.keyEvents.length > this.maxEvents) {
        this.keyEvents.pop();
      }

      // 从组合键中移除释放的键
      if (this.combinationMode) {
        const index = this.combinationKeys.indexOf(key);
        if (index > -1) {
          this.combinationKeys.splice(index, 1);
        }
      }
    }

    keyPressed(args) {
      const key = args.KEY.toLowerCase();

      // 检查按键名称
      if (this.keysPressed[key]) {
        return true;
      }

      // 检查键码
      if (KeyCodes[key] !== undefined) {
        return !!this.keysPressed[KeyCodes[key]];
      }

      return false;
    }

    anyKeyPressed() {
      return Object.keys(this.keysPressed).some((key) => this.keysPressed[key]);
    }

    getLastKey() {
      if (this.keyEvents.length > 0) {
        return this.keyEvents[0].key;
      }
      return "";
    }

    getKeyName(args) {
      const code = Number(args.CODE);

      // 查找键码对应的名称
      for (const [key, keyCode] of Object.entries(KeyCodes)) {
        if (keyCode === code) {
          return key;
        }
      }

      return `未知键 (${code})`;
    }

    getKeyCode(args) {
      const key = args.KEY.toLowerCase();
      return KeyCodes[key] || 0;
    }

    isModifierPressed(args) {
      const mod = args.MOD.toLowerCase();

      switch (mod) {
        case "shift":
          return this.keysPressed["shift"] || false;
        case "ctrl":
          return this.keysPressed["control"] || false;
        case "alt":
          return this.keysPressed["alt"] || false;
        case "meta":
          return this.keysPressed["meta"] || false;
        default:
          return false;
      }
    }

    getKeyEvents() {
      return JSON.stringify(this.keyEvents);
    }

    clearKeyEvents() {
      this.keyEvents = [];
    }

    startCombinationDetection() {
      this.combinationMode = true;
      this.combinationKeys = [];
    }

    stopCombinationDetection() {
      this.combinationMode = false;
      this.combinationKeys = [];
      if (this.combinationTimeout) {
        clearTimeout(this.combinationTimeout);
        this.combinationTimeout = null;
      }
    }

    isCombinationPressed(args) {
      if (!this.combinationMode || this.combinationKeys.length === 0) {
        return false;
      }

      const requestedKeys = args.KEYS.toLowerCase()
        .split("+")
        .map((k) => k.trim());

      // 检查所有请求的键是否都在当前按下的组合键中
      return requestedKeys.every((key) => this.combinationKeys.includes(key));
    }

    getCurrentCombination() {
      if (!this.combinationMode || this.combinationKeys.length === 0) {
        return "";
      }

      return this.combinationKeys.join("+");
    }

    setCombinationTimeWindow(args) {
      const time = Math.max(100, Math.min(Number(args.TIME) || 500, 5000));
      this.combinationTimeWindow = time;
    }
  }

  // 添加扩展图标（使用指定颜色的键盘图标）
  AdvancedKeyDetection.prototype.getIcon = function () {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#5cb1d6"><path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/></svg>';
  };

  Scratch.extensions.register(new AdvancedKeyDetection());
})(Scratch);
