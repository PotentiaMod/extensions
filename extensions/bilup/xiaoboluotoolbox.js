// Name: Xiaoboluo's ToolBox
// ID: xiaoboluotoolbox
// Description: A comprehensive toolbox with list, text, math, and utility blocks for Scratch projects.
// By: 勇敢的菠萝🍍 <https://space.bilibili.com/521949499>
// License: MIT

(function (Scratch) {
  'use strict';

  if (!Scratch || !Scratch.BlockType || !Scratch.ArgumentType) {
    throw new Error(Scratch.translate({
      id: 'errorNoSandbox',
      default: "Xiaoboluo's ToolBox extension must be run unsandboxed"
    }));
  }

  // ===== 运行时能力探测 =====
  const HAS_LOOP = typeof Scratch.BlockType.LOOP !== 'undefined';
  const HAS_BOOLEAN = typeof Scratch.BlockType.BOOLEAN !== 'undefined';
  const HAS_HAT = typeof Scratch.BlockType.HAT !== 'undefined';

  // ===== 菠萝图标：手绘 SVG（path + ellipse + polygon），base64 内嵌 =====
  // 在任何 SVG 渲染器里都能正确显示叶子和果身，不依赖 emoji 字体。
  const PINEAPPLE_SVG = [
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>",
    // 顶部 3 片叶子
    "<path d='M32 4 L26 22 L30 18 L32 24 L34 18 L38 22 Z' fill='#3FAE5C'/>",
    "<path d='M22 10 L18 24 L24 22 L24 30 L20 26 Z' fill='#4CC76B'/>",
    "<path d='M42 10 L46 24 L40 22 L40 30 L44 26 Z' fill='#4CC76B'/>",
    // 菠萝果身
    "<ellipse cx='32' cy='44' rx='18' ry='20' fill='#FFC93C' stroke='#E5A82E' stroke-width='0.5'/>",
    // 菱格纹路
    "<g fill='#E89012'>",
    "<polygon points='20,36 24,34 28,36 24,38'/>",
    "<polygon points='28,36 32,34 36,36 32,38'/>",
    "<polygon points='36,36 40,34 44,36 40,38'/>",
    "<polygon points='22,42 26,40 30,42 26,44'/>",
    "<polygon points='30,42 34,40 38,42 34,44'/>",
    "<polygon points='38,42 42,40 46,42 42,44'/>",
    "<polygon points='20,48 24,46 28,48 24,50'/>",
    "<polygon points='28,48 32,46 36,48 32,50'/>",
    "<polygon points='36,48 40,46 44,48 40,50'/>",
    "<polygon points='22,54 26,52 30,54 26,56'/>",
    "<polygon points='30,54 34,52 38,54 34,56'/>",
    "<polygon points='38,54 42,52 46,54 42,56'/>",
    "</g>",
    // 高光
    "<ellipse cx='24' cy='34' rx='3' ry='5' fill='#FFE38A' opacity='0.6'/>",
    "</svg>"
  ].join('');
  const PINEAPPLE_ICON =
    'data:image/svg+xml;base64,' +
    (typeof btoa === 'function'
      ? btoa(unescape(encodeURIComponent(PINEAPPLE_SVG)))
      : Buffer.from(PINEAPPLE_SVG).toString('base64'));

  // ===== 类型转换辅助 =====
  const castToString = (v) =>
    Scratch.Cast ? Scratch.Cast.toString(v) : String(v == null ? '' : v);
  const castToNumber = (v) =>
    Scratch.Cast ? Scratch.Cast.toNumber(v) : Number(v);

  // ===== 列表对象查询（unsandboxed 标准做法） =====
  function getListObject(name, util) {
    const listName = castToString(name);
    if (!listName) return null;
    let variable = util.target.lookupVariableByNameAndType(listName, 'list');
    if (!variable && util.runtime && util.runtime.getTargetForStage) {
      const stage = util.runtime.getTargetForStage();
      if (stage) variable = stage.lookupVariableByNameAndType(listName, 'list');
    }
    return variable || null;
  }
  function getListValue(name, util) {
    const list = getListObject(name, util);
    return list && Array.isArray(list.value) ? list.value : [];
  }
  function touchList(list) {
    list._monitorUpToDate = false;
  }

  // Fisher–Yates 原地洗牌
  function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  }

  // 列表排序比较器：数字按数值比较，其余按字符串比较；desc=true 时倒序
  function listComparator(desc) {
    return (a, b) => {
      const na = castToNumber(a), nb = castToNumber(b);
      if (!isNaN(na) && !isNaN(nb)) return desc ? nb - na : na - nb;
      const sa = castToString(a), sb = castToString(b);
      if (sa < sb) return desc ? 1 : -1;
      if (sa > sb) return desc ? -1 : 1;
      return 0;
    };
  }

  // ===== 运行控制辅助：访问 scratch-vm / TurboWarp Runtime =====
  // 这些 API 在 unsandboxed 模式下才可用，因此本扩展必须勾选「取消沙箱」。
  let _pausedCache = false;
  let _turboCache = false;
  function getRT(util) {
    return util && util.runtime ? util.runtime : null;
  }
  function setPause(util, paused) {
    const rt = getRT(util);
    if (!rt) return;
    if (typeof rt.setPaused === 'function') rt.setPaused(paused);
    else if (rt.runOptions) rt.runOptions.paused = paused; // 兜底：直接写字段
    _pausedCache = paused;
  }
  function readPaused(rt) {
    if (!rt) return _pausedCache;
    if (typeof rt.isPaused === 'function') {
      try { return rt.isPaused(); } catch (e) { /* fallthrough */ }
    }
    if (rt.runOptions && typeof rt.runOptions.paused === 'boolean') return rt.runOptions.paused;
    return _pausedCache;
  }
  function setTurbo(util, on) {
    const rt = getRT(util);
    if (!rt) return;
    if (typeof rt.setTurboMode === 'function') rt.setTurboMode(on);
    _turboCache = on;
  }
  function readTurbo(rt) {
    if (!rt) return _turboCache;
    if (typeof rt.isTurboMode === 'function') {
      try { return rt.isTurboMode(); } catch (e) { /* fallthrough */ }
    }
    if (typeof rt.turboMode === 'boolean') return rt.turboMode;
    return _turboCache;
  }

  // ===== 积木定义（按显示顺序） =====
  function buildBlocks() {
    const B = []; // 当前类别
    const BT = Scratch.BlockType;
    const AT = Scratch.ArgumentType;

    // ---------- 📋 列表操作 ----------
    B.push({ blockType: 'label', text: Scratch.translate({ id: 'label.lists', default: '📋 List Operations' }) });

    // 1. 随机打乱列表 (返回新列表)
    B.push({
      opcode: 'shuffleList', blockType: BT.REPORTER,
      text: Scratch.translate({ id: 'shuffleList', default: 'shuffle list [LIST] (returns new list)' }),
      arguments: { LIST: { type: AT.STRING, menu: 'lists' } }
    });
    // 2. 原地打乱
    B.push({
      opcode: 'shuffleListInPlace', blockType: BT.COMMAND,
      text: Scratch.translate({ id: 'shuffleListInPlace', default: 'shuffle list [LIST] in place' }),
      arguments: { LIST: { type: AT.STRING, menu: 'lists' } }
    });
    // 3. 随机取一项
    B.push({
      opcode: 'pickRandom', blockType: BT.REPORTER,
      text: Scratch.translate({ id: 'pickRandom', default: 'pick random item from list [LIST]' }),
      arguments: { LIST: { type: AT.STRING, menu: 'lists' } }
    });
    // 4. 列表包含?
    if (HAS_BOOLEAN) {
      B.push({
        opcode: 'listContains', blockType: BT.BOOLEAN,
        text: Scratch.translate({ id: 'listContains', default: 'does list [LIST] contain [ITEM]?' }),
        arguments: {
          LIST: { type: AT.STRING, menu: 'lists' },
          ITEM: { type: AT.STRING, defaultValue: Scratch.translate({ id: 'default.apple', default: 'apple' }) }
        }
      });
    }
    // 5. 出现次数
    B.push({
      opcode: 'countOccurrences', blockType: BT.REPORTER,
      text: Scratch.translate({ id: 'countOccurrences', default: 'number of occurrences of [ITEM] in list [LIST]' }),
      arguments: {
        ITEM: { type: AT.STRING, defaultValue: Scratch.translate({ id: 'default.apple', default: 'apple' }) },
        LIST: { type: AT.STRING, menu: 'lists' }
      }
    });
    // 6. 某项首次出现位置（紧跟在「出现次数」之后）
    B.push({
      opcode: 'listIndexOf', blockType: BT.REPORTER,
      text: Scratch.translate({ id: 'listIndexOf', default: 'position of first occurrence of [ITEM] in list [LIST]' }),
      arguments: {
        LIST: { type: AT.STRING, menu: 'lists' },
        ITEM: { type: AT.STRING, defaultValue: Scratch.translate({ id: 'default.apple', default: 'apple' }) }
      }
    });
    // 7. 求和 / 8. 平均 / 9. 最大 / 10. 最小
    B.push(
      { opcode: 'listSum', blockType: BT.REPORTER, text: Scratch.translate({ id: 'listSum', default: 'sum of list [LIST]' }),
        arguments: { LIST: { type: AT.STRING, menu: 'lists' } } },
      { opcode: 'listAverage', blockType: BT.REPORTER, text: Scratch.translate({ id: 'listAverage', default: 'average of list [LIST]' }),
        arguments: { LIST: { type: AT.STRING, menu: 'lists' } } },
      { opcode: 'listMax', blockType: BT.REPORTER, text: Scratch.translate({ id: 'listMax', default: 'maximum of list [LIST]' }),
        arguments: { LIST: { type: AT.STRING, menu: 'lists' } } },
      { opcode: 'listMin', blockType: BT.REPORTER, text: Scratch.translate({ id: 'listMin', default: 'minimum of list [LIST]' }),
        arguments: { LIST: { type: AT.STRING, menu: 'lists' } } }
    );
    // 10. 随机取 N 项（返回新）/ 原地替换
    B.push(
      { opcode: 'listSample', blockType: BT.REPORTER,
        text: Scratch.translate({ id: 'listSample', default: 'pick [N] unique random items from list [LIST] (returns new list)' }),
        arguments: {
          LIST: { type: AT.STRING, menu: 'lists' },
          N: { type: AT.NUMBER, defaultValue: 3 }
        } },
      { opcode: 'listSampleInPlace', blockType: BT.COMMAND,
        text: Scratch.translate({ id: 'listSampleInPlace', default: 'replace list [LIST] with [N] unique random items' }),
        arguments: {
          LIST: { type: AT.STRING, menu: 'lists' },
          N: { type: AT.NUMBER, defaultValue: 3 }
        } }
    );
    // 11. 拼接两列表（返回新）/ 原地：把 B 追加到 A 末尾
    B.push(
      { opcode: 'listConcat', blockType: BT.REPORTER,
        text: Scratch.translate({ id: 'listConcat', default: 'concatenate list [A] and list [B] (returns new list)' }),
        arguments: {
          A: { type: AT.STRING, menu: 'lists' },
          B: { type: AT.STRING, menu: 'lists' }
        } },
      { opcode: 'listConcatInPlace', blockType: BT.COMMAND,
        text: Scratch.translate({ id: 'listConcatInPlace', default: 'append list [B] to the end of list [A]' }),
        arguments: {
          A: { type: AT.STRING, menu: 'lists' },
          B: { type: AT.STRING, menu: 'lists' }
        } }
    );
    // 14. 去重（返回新）/ 原地
    B.push(
      { opcode: 'uniqueList', blockType: BT.REPORTER,
        text: Scratch.translate({ id: 'uniqueList', default: 'remove duplicates from list [LIST] (returns new list)' }),
        arguments: { LIST: { type: AT.STRING, menu: 'lists' } } },
      { opcode: 'uniqueListInPlace', blockType: BT.COMMAND,
        text: Scratch.translate({ id: 'uniqueListInPlace', default: 'remove duplicates from list [LIST] in place' }),
        arguments: { LIST: { type: AT.STRING, menu: 'lists' } } }
    );
    // 15. 反转（返回新）/ 16. 反转（原地）
    B.push(
      { opcode: 'reverseList', blockType: BT.REPORTER, text: Scratch.translate({ id: 'reverseList', default: 'reverse list [LIST] (returns new list)' }),
        arguments: { LIST: { type: AT.STRING, menu: 'lists' } } },
      { opcode: 'reverseListInPlace', blockType: BT.COMMAND, text: Scratch.translate({ id: 'reverseListInPlace', default: 'reverse list [LIST] in place' }),
        arguments: { LIST: { type: AT.STRING, menu: 'lists' } } }
    );
    // 17. 排序（返回新）/ 原地
    B.push(
      { opcode: 'sortList', blockType: BT.REPORTER,
        text: Scratch.translate({ id: 'sortList', default: 'sort list [LIST] [ORDER] (returns new list)' }),
        arguments: {
          LIST: { type: AT.STRING, menu: 'lists' },
          ORDER: { type: AT.STRING, defaultValue: '升序', menu: 'ORDER' }
        } },
      { opcode: 'sortListInPlace', blockType: BT.COMMAND,
        text: Scratch.translate({ id: 'sortListInPlace', default: 'sort list [LIST] [ORDER] in place' }),
        arguments: {
          LIST: { type: AT.STRING, menu: 'lists' },
          ORDER: { type: AT.STRING, defaultValue: '升序', menu: 'ORDER' }
        } }
    );
    // 18. 列表转文本
    B.push({
      opcode: 'listToText', blockType: BT.REPORTER,
      text: Scratch.translate({ id: 'listToText', default: 'join list [LIST] with separator [SEP] into text' }),
      arguments: {
        LIST: { type: AT.STRING, menu: 'lists' },
        SEP: { type: AT.STRING, defaultValue: ', ' }
      }
    });
    // 19. 是否含重复项
    if (HAS_BOOLEAN) {
      B.push({
        opcode: 'listHasDupe', blockType: BT.BOOLEAN, text: Scratch.translate({ id: 'listHasDupe', default: 'does list [LIST] contain duplicates?' }),
        arguments: { LIST: { type: AT.STRING, menu: 'lists' } }
      });
    }

    // 22. 遍历循环（仅当运行时支持 LOOP block type 时注册）
    if (HAS_LOOP) {
      B.push({
        opcode: 'forEachItem',
        blockType: BT.LOOP,
        branchCount: 1,
        text: Scratch.translate({ id: 'forEachItem', default: 'for each item in list [LIST], store it in variable [VAR]' }),
        arguments: {
          LIST: { type: AT.STRING, menu: 'lists' },
          VAR: { type: AT.STRING, defaultValue: Scratch.translate({ id: 'default.item', default: 'item' }) }
        }
      });
    }

    // ---------- 🔤 文本操作 ----------
    B.push({ blockType: 'label', text: Scratch.translate({ id: 'label.text', default: '🔤 Text Operations' }) });
    B.push(
      { opcode: 'shuffleText', blockType: BT.REPORTER, text: Scratch.translate({ id: 'shuffleText', default: 'shuffle text [TEXT]' }),
        arguments: { TEXT: { type: AT.STRING, defaultValue: Scratch.translate({ id: 'default.pineapple', default: 'pineapple' }) } } },
      { opcode: 'reverseText', blockType: BT.REPORTER, text: Scratch.translate({ id: 'reverseText', default: 'reverse text [TEXT]' }),
        arguments: { TEXT: { type: AT.STRING, defaultValue: Scratch.translate({ id: 'default.pineapple', default: 'pineapple' }) } } },
      // ★ 改造后的拆分积木：命令积木，拆分后依次加入指定列表
      { opcode: 'textSplitToList', blockType: BT.COMMAND,
        text: Scratch.translate({ id: 'textSplitToList', default: 'split text [TEXT] by separator [SEP] and add items to [LIST]' }),
        arguments: {
          TEXT: { type: AT.STRING, defaultValue: Scratch.translate({ id: 'default.fruits', default: 'apple,banana,orange' }) },
          SEP: { type: AT.STRING, defaultValue: ',' },
          LIST: { type: AT.STRING, menu: 'lists' }
        } },
      { opcode: 'textLength', blockType: BT.REPORTER, text: Scratch.translate({ id: 'textLength', default: 'length of text [TEXT]' }),
        arguments: { TEXT: { type: AT.STRING, defaultValue: Scratch.translate({ id: 'default.pineapple', default: 'pineapple' }) } } },
      { opcode: 'textToUpperCase', blockType: BT.REPORTER, text: Scratch.translate({ id: 'textToUpperCase', default: '[TEXT] to uppercase' }),
        arguments: { TEXT: { type: AT.STRING, defaultValue: 'hello' } } },
      { opcode: 'textToLowerCase', blockType: BT.REPORTER, text: Scratch.translate({ id: 'textToLowerCase', default: '[TEXT] to lowercase' }),
        arguments: { TEXT: { type: AT.STRING, defaultValue: 'HELLO' } } },
      { opcode: 'textTrim', blockType: BT.REPORTER, text: Scratch.translate({ id: 'textTrim', default: 'remove whitespace from both ends of [TEXT]' }),
        arguments: { TEXT: { type: AT.STRING, defaultValue: '  hello  ' } } },
      { opcode: 'textReplace', blockType: BT.REPORTER,
        text: Scratch.translate({ id: 'textReplace', default: 'replace all [OLD] with [NEW] in [TEXT]' }),
        arguments: {
          TEXT: { type: AT.STRING, defaultValue: 'hello world' },
          OLD: { type: AT.STRING, defaultValue: 'world' },
          NEW: { type: AT.STRING, defaultValue: 'Scratch' }
        } }
    );
    if (HAS_BOOLEAN) {
      B.push({
        opcode: 'textContains', blockType: BT.BOOLEAN,
        text: Scratch.translate({ id: 'textContains', default: 'does [TEXT] contain [SUB]?' }),
        arguments: {
          TEXT: { type: AT.STRING, defaultValue: 'hello world' },
          SUB: { type: AT.STRING, defaultValue: 'world' }
        }
      });
    }
    B.push({
      opcode: 'textRepeat', blockType: BT.REPORTER,
      text: Scratch.translate({ id: 'textRepeat', default: 'repeat [TEXT] [N] times' }),
      arguments: {
        TEXT: { type: AT.STRING, defaultValue: Scratch.translate({ id: 'default.ah', default: 'ah' }) },
        N: { type: AT.NUMBER, defaultValue: 5 }
      }
    });
    // 文本：子串出现次数 / 截取子串 / 数字格式化 / 是否数字 / 左侧补齐
    B.push(
      { opcode: 'textCountSub', blockType: BT.REPORTER,
        text: Scratch.translate({ id: 'textCountSub', default: 'number of times [SUB] appears in [TEXT]' }),
        arguments: {
          TEXT: { type: AT.STRING, defaultValue: 'banana' },
          SUB: { type: AT.STRING, defaultValue: 'a' }
        } },
      { opcode: 'textSubstr', blockType: BT.REPORTER,
        text: Scratch.translate({ id: 'textSubstr', default: 'characters [START] to [END] of text [TEXT]' }),
        arguments: {
          TEXT: { type: AT.STRING, defaultValue: Scratch.translate({ id: 'default.pineappleToolbox', default: 'pineapple toolbox' }) },
          START: { type: AT.NUMBER, defaultValue: 1 },
          END: { type: AT.NUMBER, defaultValue: 3 }
        } },
      { opcode: 'numToFixed', blockType: BT.REPORTER,
        text: Scratch.translate({ id: 'numToFixed', default: 'format [NUM] as text with [DEC] decimal places' }),
        arguments: {
          NUM: { type: AT.NUMBER, defaultValue: 3.14159 },
          DEC: { type: AT.NUMBER, defaultValue: 2 }
        } }
    );
    if (HAS_BOOLEAN) {
      B.push({
        opcode: 'textIsNumber', blockType: BT.BOOLEAN, text: Scratch.translate({ id: 'textIsNumber', default: 'is [TEXT] a number?' }),
        arguments: { TEXT: { type: AT.STRING, defaultValue: '3.14' } }
      });
    }
    B.push({
      opcode: 'textPadStart', blockType: BT.REPORTER,
      text: Scratch.translate({ id: 'textPadStart', default: 'pad [TEXT] on the left with [PAD] to [LEN] characters' }),
      arguments: {
        TEXT: { type: AT.STRING, defaultValue: '42' },
        PAD: { type: AT.STRING, defaultValue: '0' },
        LEN: { type: AT.NUMBER, defaultValue: 5 }
      }
    });

    // ---------- 🔢 数学工具 ----------
    B.push({ blockType: 'label', text: Scratch.translate({ id: 'label.math', default: '🔢 Math Tools' }) });
    B.push(
      { opcode: 'roundTo', blockType: BT.REPORTER, text: Scratch.translate({ id: 'roundTo', default: 'round [NUM] to [DEC] decimal places' }),
        arguments: {
          NUM: { type: AT.NUMBER, defaultValue: 3.14159 },
          DEC: { type: AT.NUMBER, defaultValue: 2 }
        } },
      // 随机小数：TurboWarp 内置「取随机数」只返回整数，这里专门生成小数
      { opcode: 'randomFloat', blockType: BT.REPORTER, text: Scratch.translate({ id: 'randomFloat', default: 'random decimal from [MIN] to [MAX]' }),
        arguments: {
          MIN: { type: AT.NUMBER, defaultValue: 0 },
          MAX: { type: AT.NUMBER, defaultValue: 1 }
        } },
      { opcode: 'mapRange', blockType: BT.REPORTER,
        text: Scratch.translate({ id: 'mapRange', default: 'map [X] from range [A1]-[A2] to [B1]-[B2]' }),
        arguments: {
          X: { type: AT.NUMBER, defaultValue: 5 },
          A1: { type: AT.NUMBER, defaultValue: 0 },
          A2: { type: AT.NUMBER, defaultValue: 10 },
          B1: { type: AT.NUMBER, defaultValue: 0 },
          B2: { type: AT.NUMBER, defaultValue: 100 }
        } },
      { opcode: 'clamp', blockType: BT.REPORTER, text: Scratch.translate({ id: 'clamp', default: 'clamp [NUM] between [MIN] and [MAX]' }),
        arguments: {
          NUM: { type: AT.NUMBER, defaultValue: 15 },
          MIN: { type: AT.NUMBER, defaultValue: 0 },
          MAX: { type: AT.NUMBER, defaultValue: 10 }
        } }
    );
    // 数学常量（下拉菜单）
    B.push(
      { opcode: 'mathConst', blockType: BT.REPORTER, text: Scratch.translate({ id: 'mathConst', default: 'mathematical constant [CONST]' }),
        arguments: { CONST: { type: AT.STRING, defaultValue: 'pi', menu: 'CONSTS' } } }
    );
    // 数学运算（下拉菜单，单目）
    B.push(
      { opcode: 'mathOp', blockType: BT.REPORTER,
        text: Scratch.translate({ id: 'mathOp', default: 'apply operation [OP] to [NUM]' }),
        arguments: {
          NUM: { type: AT.NUMBER, defaultValue: 2 },
          OP: { type: AT.STRING, defaultValue: 'sqrt', menu: 'OPS' }
        } }
    );
    // 二元运算：幂 / 开方 / 余数 / 最大公因数 / 最小公倍数
    B.push(
      { opcode: 'mathPow', blockType: BT.REPORTER, text: Scratch.translate({ id: 'mathPow', default: '[BASE] to the power of [EXP]' }),
        arguments: {
          BASE: { type: AT.NUMBER, defaultValue: 2 },
          EXP: { type: AT.NUMBER, defaultValue: 10 }
        } },
      { opcode: 'mathNthRoot', blockType: BT.REPORTER, text: Scratch.translate({ id: 'mathNthRoot', default: 'the [N]th root of [X]' }),
        arguments: {
          X: { type: AT.NUMBER, defaultValue: 8 },
          N: { type: AT.NUMBER, defaultValue: 3 }
        } },
      { opcode: 'mathMod', blockType: BT.REPORTER, text: Scratch.translate({ id: 'mathMod', default: 'remainder of [A] divided by [B] (always non-negative)' }),
        arguments: {
          A: { type: AT.NUMBER, defaultValue: 17 },
          B: { type: AT.NUMBER, defaultValue: 5 }
        } },
      { opcode: 'mathGcd', blockType: BT.REPORTER, text: Scratch.translate({ id: 'mathGcd', default: 'greatest common divisor of [A] and [B]' }),
        arguments: {
          A: { type: AT.NUMBER, defaultValue: 12 },
          B: { type: AT.NUMBER, defaultValue: 18 }
        } },
      { opcode: 'mathLcm', blockType: BT.REPORTER, text: Scratch.translate({ id: 'mathLcm', default: 'least common multiple of [A] and [B]' }),
        arguments: {
          A: { type: AT.NUMBER, defaultValue: 12 },
          B: { type: AT.NUMBER, defaultValue: 18 }
        } }
    );
    if (HAS_BOOLEAN) {
      B.push(
        { opcode: 'isEven', blockType: BT.BOOLEAN, text: Scratch.translate({ id: 'isEven', default: 'is [NUM] even?' }),
          arguments: { NUM: { type: AT.NUMBER, defaultValue: 4 } } },
        { opcode: 'isInteger', blockType: BT.BOOLEAN, text: Scratch.translate({ id: 'isInteger', default: 'is [NUM] an integer?' }),
          arguments: { NUM: { type: AT.NUMBER, defaultValue: 3 } } }
      );
    }

    // ---------- ⏰ 实用工具 ----------
    B.push({ blockType: 'label', text: Scratch.translate({ id: 'label.tools', default: '⏰ Utility Tools' }) });
    B.push(
      { opcode: 'timestampMs', blockType: BT.REPORTER, text: Scratch.translate({ id: 'timestampMs', default: 'current timestamp (milliseconds)' }) },
      { opcode: 'timestampSec', blockType: BT.REPORTER, text: Scratch.translate({ id: 'timestampSec', default: 'current timestamp (seconds)' }) },
      { opcode: 'nowDateTime', blockType: BT.REPORTER, text: Scratch.translate({ id: 'nowDateTime', default: 'current date and time (YYYY-MM-DD HH:MM:SS)' }) },
      { opcode: 'nowDate', blockType: BT.REPORTER, text: Scratch.translate({ id: 'nowDate', default: 'current date (YYYY-MM-DD)' }) }
    );

    // ---------- 🎮 运行控制 ----------
    B.push({ blockType: 'label', text: Scratch.translate({ id: 'label.control', default: '🎮 Run Control' }) });
    B.push(
      { opcode: 'greenFlagRun', blockType: BT.COMMAND, text: Scratch.translate({ id: 'greenFlagRun', default: 'run project (green flag)' }) },
      { opcode: 'stopProject', blockType: BT.COMMAND, text: Scratch.translate({ id: 'stopProject', default: 'stop project' }) },
      { opcode: 'restartProject', blockType: BT.COMMAND, text: Scratch.translate({ id: 'restartProject', default: 'restart project' }) },
      { opcode: 'pauseProject', blockType: BT.COMMAND, text: Scratch.translate({ id: 'pauseProject', default: 'pause project' }) },
      { opcode: 'resumeProject', blockType: BT.COMMAND, text: Scratch.translate({ id: 'resumeProject', default: 'resume project' }) },
      { opcode: 'togglePause', blockType: BT.COMMAND, text: Scratch.translate({ id: 'togglePause', default: 'toggle pause / resume' }) },
      { opcode: 'turboOn', blockType: BT.COMMAND, text: Scratch.translate({ id: 'turboOn', default: 'enable turbo mode' }) },
      { opcode: 'turboOff', blockType: BT.COMMAND, text: Scratch.translate({ id: 'turboOff', default: 'disable turbo mode' }) },
      { opcode: 'toggleTurbo', blockType: BT.COMMAND, text: Scratch.translate({ id: 'toggleTurbo', default: 'toggle turbo mode' }) }
    );
    if (HAS_HAT) {
      B.push(
        { opcode: 'whenProjectStopped', blockType: BT.HAT, text: Scratch.translate({ id: 'whenProjectStopped', default: 'when project stops' }) },
        { opcode: 'whenProjectStarted', blockType: BT.HAT, text: Scratch.translate({ id: 'whenProjectStarted', default: 'when project starts running (green flag clicked)' }) }
      );
    }
    if (HAS_BOOLEAN) {
      B.push(
        { opcode: 'isPaused', blockType: BT.BOOLEAN, text: Scratch.translate({ id: 'isPaused', default: 'is project paused?' }) },
        { opcode: 'isTurbo', blockType: BT.BOOLEAN, text: Scratch.translate({ id: 'isTurbo', default: 'is turbo mode on?' }) },
        { opcode: 'isProjectRunning', blockType: BT.BOOLEAN, text: Scratch.translate({ id: 'isProjectRunning', default: 'is project running?' }) }
      );
    }

    return B;
  }

  // ===== 积木实现 =====
  class XiaoBoLuoToolbox {
    getInfo() {
      return {
        id: 'xiaoboluotoolbox',
        name: Scratch.translate({ id: 'extensionName', default: "Xiaoboluo's ToolBox" }),
        color1: '#FF9F1C',
        color2: '#F08700',
        color3: '#FFE3C2',
        menuIconURI: PINEAPPLE_ICON,
        blockIconURI: PINEAPPLE_ICON,
        // 扩展描述：在某些 fork（其他编辑器等）里会显示在扩展名下方作为简介
        description: Scratch.translate({
          id: 'extensionDescription',
          default: 'A toolbox that integrates list, text, math, and other utility tools.'
        }),
        menus: {
          ORDER: [
            { text: Scratch.translate({ id: 'menu.ascending', default: 'Ascending' }), value: '升序' },
            { text: Scratch.translate({ id: 'menu.descending', default: 'Descending' }), value: '降序' }
          ],
          // 数学常量下拉
          CONSTS: [
            { text: Scratch.translate({ id: 'menu.pi', default: 'π (pi)' }), value: 'pi' },
            { text: Scratch.translate({ id: 'menu.e', default: "e (Euler's number)" }), value: 'e' },
            { text: Scratch.translate({ id: 'menu.tau', default: 'τ (2π)' }), value: 'tau' },
            { text: Scratch.translate({ id: 'menu.phi', default: 'φ (golden ratio)' }), value: 'phi' },
            { text: Scratch.translate({ id: 'menu.sqrt2', default: '√2 (square root of 2)' }), value: 'sqrt2' },
            { text: Scratch.translate({ id: 'menu.sqrt3', default: '√3 (square root of 3)' }), value: 'sqrt3' },
            { text: Scratch.translate({ id: 'menu.ln2', default: 'ln2 (natural log of 2)' }), value: 'ln2' },
            { text: Scratch.translate({ id: 'menu.ln10', default: 'ln10 (natural log of 10)' }), value: 'ln10' },
            { text: Scratch.translate({ id: 'menu.c', default: 'c (speed of light m/s)' }), value: 'c' },
            { text: Scratch.translate({ id: 'menu.g', default: 'g (gravity acceleration)' }), value: 'g' },
            { text: Scratch.translate({ id: 'menu.gamma', default: 'γ (Euler-Mascheroni constant)' }), value: 'gamma' },
            { text: Scratch.translate({ id: 'menu.inf', default: '∞ (infinity)' }), value: 'inf' }
          ],
          // 数学运算下拉（单目）
          OPS: [
            { text: Scratch.translate({ id: 'menu.sqrt', default: 'Square root √x' }), value: 'sqrt' },
            { text: Scratch.translate({ id: 'menu.cbrt', default: 'Cube root ∛x' }), value: 'cbrt' },
            { text: Scratch.translate({ id: 'menu.square', default: 'Square x²' }), value: 'square' },
            { text: Scratch.translate({ id: 'menu.cube', default: 'Cube x³' }), value: 'cube' },
            { text: Scratch.translate({ id: 'menu.recip', default: 'Reciprocal 1/x' }), value: 'recip' },
            { text: Scratch.translate({ id: 'menu.factorial', default: 'Factorial n!' }), value: 'factorial' },
            { text: Scratch.translate({ id: 'menu.sign', default: 'Sign' }), value: 'sign' },
            { text: Scratch.translate({ id: 'menu.sin', default: 'Sine sin (degrees)' }), value: 'sin' },
            { text: Scratch.translate({ id: 'menu.cos', default: 'Cosine cos (degrees)' }), value: 'cos' },
            { text: Scratch.translate({ id: 'menu.tan', default: 'Tangent tan (degrees)' }), value: 'tan' },
            { text: Scratch.translate({ id: 'menu.asin', default: 'Arcsine asin (degrees)' }), value: 'asin' },
            { text: Scratch.translate({ id: 'menu.acos', default: 'Arccosine acos (degrees)' }), value: 'acos' },
            { text: Scratch.translate({ id: 'menu.atan', default: 'Arctangent atan (degrees)' }), value: 'atan' },
            { text: Scratch.translate({ id: 'menu.ln', default: 'Natural logarithm ln' }), value: 'ln' },
            { text: Scratch.translate({ id: 'menu.log10', default: 'Common logarithm log₁₀' }), value: 'log10' },
            { text: Scratch.translate({ id: 'menu.exp', default: 'Exponential e^x' }), value: 'exp' }
          ],
          // 动态菜单：列出项目中所有「列表」变量，供列表类积木下拉选择
          lists: {
            acceptReporters: true,
            items: '_getLists'
          }
        },
        blocks: buildBlocks()
      };
    }

    // 动态菜单：返回项目中所有「列表」变量名（供列表类积木的下拉选择）
    _getLists() {
      if (typeof Blockly === 'undefined' || !Blockly.getMainWorkspace) return [''];
      try {
        const lists = Blockly.getMainWorkspace()
          .getVariableMap()
          .getVariablesOfType(/** @type {ScratchBlocks.VariableType} */ ('list'))
          .map((model) => model.name);
        return lists.length > 0 ? lists : [''];
      } catch (e) {
        return [''];
      }
    }

    // ---------- 列表 ----------
    shuffleList(args, util) { return shuffleInPlace(getListValue(args.LIST, util).slice()); }
    shuffleListInPlace(args, util) {
      const list = getListObject(args.LIST, util);
      if (list) { shuffleInPlace(list.value); touchList(list); }
    }
    pickRandom(args, util) {
      const arr = getListValue(args.LIST, util);
      return arr.length === 0 ? '' : arr[Math.floor(Math.random() * arr.length)];
    }
    listContains(args, util) {
      return getListValue(args.LIST, util).indexOf(castToString(args.ITEM)) !== -1;
    }
    countOccurrences(args, util) {
      const item = castToString(args.ITEM);
      let c = 0;
      for (const v of getListValue(args.LIST, util)) if (castToString(v) === item) c++;
      return c;
    }
    listSum(args, util) {
      let s = 0;
      for (const v of getListValue(args.LIST, util)) s += castToNumber(v);
      return s;
    }
    listAverage(args, util) {
      const arr = getListValue(args.LIST, util);
      if (arr.length === 0) return 0;
      let s = 0;
      for (const v of arr) s += castToNumber(v);
      return s / arr.length;
    }
    listMax(args, util) {
      const arr = getListValue(args.LIST, util);
      if (arr.length === 0) return 0;
      let m = castToNumber(arr[0]);
      for (let i = 1; i < arr.length; i++) {
        const n = castToNumber(arr[i]);
        if (n > m) m = n;
      }
      return m;
    }
    listMin(args, util) {
      const arr = getListValue(args.LIST, util);
      if (arr.length === 0) return 0;
      let m = castToNumber(arr[0]);
      for (let i = 1; i < arr.length; i++) {
        const n = castToNumber(arr[i]);
        if (n < m) m = n;
      }
      return m;
    }
    listSample(args, util) {
      const arr = getListValue(args.LIST, util).slice();
      const n = Math.max(0, Math.min(Math.floor(castToNumber(args.N) || 0), arr.length));
      shuffleInPlace(arr);
      return arr.slice(0, n);
    }
    listSampleInPlace(args, util) {
      const list = getListObject(args.LIST, util);
      if (list) {
        const arr = list.value.slice();
        const n = Math.max(0, Math.min(Math.floor(castToNumber(args.N) || 0), arr.length));
        shuffleInPlace(arr);
        list.value = arr.slice(0, n);
        touchList(list);
      }
    }
    listConcat(args, util) { return getListValue(args.A, util).concat(getListValue(args.B, util)); }
    listConcatInPlace(args, util) {
      const a = getListObject(args.A, util);
      if (a) { a.value = a.value.concat(getListValue(args.B, util)); touchList(a); }
    }
    uniqueList(args, util) {
      const seen = new Set();
      const out = [];
      for (const v of getListValue(args.LIST, util)) {
        const key = castToString(v);
        if (!seen.has(key)) { seen.add(key); out.push(v); }
      }
      return out;
    }
    uniqueListInPlace(args, util) {
      const list = getListObject(args.LIST, util);
      if (list) {
        const seen = new Set();
        const out = [];
        for (const v of list.value) {
          const key = castToString(v);
          if (!seen.has(key)) { seen.add(key); out.push(v); }
        }
        list.value = out;
        touchList(list);
      }
    }
    reverseList(args, util) { return getListValue(args.LIST, util).slice().reverse(); }
    reverseListInPlace(args, util) {
      const list = getListObject(args.LIST, util);
      if (list) { list.value.reverse(); touchList(list); }
    }
    sortList(args, util) {
      const arr = getListValue(args.LIST, util).slice();
      arr.sort(listComparator(castToString(args.ORDER) === '降序'));
      return arr;
    }
    sortListInPlace(args, util) {
      const list = getListObject(args.LIST, util);
      if (list) { list.value.sort(listComparator(castToString(args.ORDER) === '降序')); touchList(list); }
    }
    listToText(args, util) {
      return getListValue(args.LIST, util).map(castToString).join(castToString(args.SEP));
    }
    listIndexOf(args, util) {
      const item = castToString(args.ITEM);
      const arr = getListValue(args.LIST, util);
      for (let i = 0; i < arr.length; i++) {
        if (castToString(arr[i]) === item) return i + 1; // 1-indexed，找不到返回 0
      }
      return 0;
    }
    listHasDupe(args, util) {
      const arr = getListValue(args.LIST, util);
      const seen = new Set();
      for (const v of arr) {
        const k = castToString(v);
        if (seen.has(k)) return true;
        seen.add(k);
      }
      return false;
    }
    forEachItem(args, util) {
      if (!HAS_LOOP) return;
      if (util.stackFrame.index === undefined) {
        util.stackFrame.list = getListValue(args.LIST, util).slice();
        util.stackFrame.index = 0;
      }
      const list = util.stackFrame.list;
      if (util.stackFrame.index < list.length) {
        const item = list[util.stackFrame.index];
        const varName = castToString(args.VAR);
        let variable = util.target.lookupVariableByNameAndType(varName, '');
        if (!variable) variable = util.target.lookupVariableByNameAndType(varName, '', true);
        if (variable) {
          variable.value = item;
          variable._monitorUpToDate = false;
        }
        util.stackFrame.index++;
        util.startBranch(1, true);
      }
    }

    // ---------- 文本 ----------
    shuffleText(args) {
      const chars = castToString(args.TEXT).split('');
      shuffleInPlace(chars);
      return chars.join('');
    }
    reverseText(args) { return castToString(args.TEXT).split('').reverse().join(''); }
    textSplitToList(args, util) {
      const list = getListObject(args.LIST, util);
      if (!list) return;
      const text = castToString(args.TEXT);
      const sep = castToString(args.SEP);
      const parts = sep === '' ? text.split('') : text.split(sep);
      list.value = list.value.concat(parts);
      touchList(list);
    }
    textLength(args) { return castToString(args.TEXT).length; }
    textToUpperCase(args) { return castToString(args.TEXT).toUpperCase(); }
    textToLowerCase(args) { return castToString(args.TEXT).toLowerCase(); }
    textTrim(args) { return castToString(args.TEXT).trim(); }
    textReplace(args) {
      return castToString(args.TEXT).split(castToString(args.OLD)).join(castToString(args.NEW));
    }
    textContains(args) {
      return castToString(args.TEXT).indexOf(castToString(args.SUB)) !== -1;
    }
    textRepeat(args) {
      const s = castToString(args.TEXT);
      const n = Math.max(0, Math.floor(castToNumber(args.N) || 0));
      return s.repeat(n);
    }
    textCountSub(args) {
      const text = castToString(args.TEXT);
      const sub = castToString(args.SUB);
      if (sub === '') return 0;
      let c = 0, i = 0;
      while ((i = text.indexOf(sub, i)) !== -1) { c++; i += sub.length; }
      return c;
    }
    textSubstr(args) {
      const text = castToString(args.TEXT);
      let start = Math.floor(castToNumber(args.START));
      let end = Math.floor(castToNumber(args.END));
      if (start < 1) start = 1;
      if (end < start) return '';
      return text.slice(start - 1, end); // 1-indexed 闭区间
    }
    numToFixed(args) {
      const n = castToNumber(args.NUM);
      const d = Math.max(0, Math.floor(castToNumber(args.DEC) || 0));
      return n.toFixed(d);
    }
    textIsNumber(args) {
      const s = castToString(args.TEXT).trim();
      if (s === '') return false;
      const num = Number(s);
      return !isNaN(num) && isFinite(num);
    }
    textPadStart(args) {
      const text = castToString(args.TEXT);
      const pad = castToString(args.PAD);
      const len = Math.floor(castToNumber(args.LEN));
      if (pad === '') return text.slice(0, Math.max(len, text.length));
      return text.padStart(len, pad);
    }

    // ---------- 数学 ----------
    roundTo(args) {
      const n = castToNumber(args.NUM);
      const d = Math.max(0, Math.floor(castToNumber(args.DEC) || 0));
      const shifted = Number(n + 'e' + d);
      const rounded = Math.sign(shifted) * Math.round(Math.abs(shifted));
      return Number(rounded + 'e-' + d);
    }
    randomFloat(args) {
      const min = castToNumber(args.MIN);
      const max = castToNumber(args.MAX);
      if (min > max) return 0;
      return Math.random() * (max - min) + min;
    }
    isEven(args) {
      const n = castToNumber(args.NUM);
      return Math.floor(n) === n && (n % 2) === 0;
    }
    isInteger(args) {
      const n = castToNumber(args.NUM);
      return !isNaN(n) && Math.floor(n) === n;
    }
    mapRange(args) {
      const x = castToNumber(args.X);
      const a1 = castToNumber(args.A1);
      const a2 = castToNumber(args.A2);
      const b1 = castToNumber(args.B1);
      const b2 = castToNumber(args.B2);
      if (a1 === a2) return b1;
      return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
    }
    clamp(args) {
      const n = castToNumber(args.NUM);
      const min = castToNumber(args.MIN);
      const max = castToNumber(args.MAX);
      return Math.max(min, Math.min(max, n));
    }
    mathConst(args) {
      const map = {
        pi: Math.PI, e: Math.E, tau: 2 * Math.PI,
        phi: (1 + Math.sqrt(5)) / 2, sqrt2: Math.SQRT2, sqrt3: Math.sqrt(3),
        ln2: Math.LN2, ln10: Math.LN10, c: 299792458, g: 9.80665,
        gamma: 0.5772156649015329, inf: Infinity
      };
      return map[args.CONST] !== undefined ? map[args.CONST] : Math.PI;
    }
    mathOp(args) {
      const x = castToNumber(args.NUM);
      switch (args.OP) {
        case 'sqrt': return Math.sqrt(x);
        case 'cbrt': return Math.cbrt(x);
        case 'square': return x * x;
        case 'cube': return x * x * x;
        case 'recip': return x === 0 ? Infinity : 1 / x;
        case 'factorial': {
          const n = Math.floor(x);
          if (n < 0) return NaN;
          let r = 1;
          for (let i = 2; i <= n; i++) r *= i;
          return r;
        }
        case 'sign': return Math.sign(x);
        // 三角/反三角沿用 Scratch 习惯：以「度」为单位
        case 'sin': return Math.sin(x * Math.PI / 180);
        case 'cos': return Math.cos(x * Math.PI / 180);
        case 'tan': return Math.tan(x * Math.PI / 180);
        case 'asin': return Math.asin(Math.max(-1, Math.min(1, x))) * 180 / Math.PI;
        case 'acos': return Math.acos(Math.max(-1, Math.min(1, x))) * 180 / Math.PI;
        case 'atan': return Math.atan(x) * 180 / Math.PI;
        case 'ln': return Math.log(x);
        case 'log10': return Math.log10(x);
        case 'exp': return Math.exp(x);
        default: return NaN;
      }
    }
    mathPow(args) { return Math.pow(castToNumber(args.BASE), castToNumber(args.EXP)); }
    mathNthRoot(args) {
      const x = castToNumber(args.X);
      const n = castToNumber(args.N);
      if (n === 0) return NaN;
      return Math.sign(x) * Math.pow(Math.abs(x), 1 / n);
    }
    mathMod(args) {
      const a = castToNumber(args.A);
      const b = castToNumber(args.B);
      if (b === 0) return 0;
      return ((a % b) + b) % b; // 永远返回非负余数
    }
    mathGcd(args) {
      let a = Math.abs(Math.round(castToNumber(args.A)));
      let b = Math.abs(Math.round(castToNumber(args.B)));
      while (b) { const t = a % b; a = b; b = t; }
      return a;
    }
    mathLcm(args) {
      const a = Math.abs(Math.round(castToNumber(args.A)));
      const b = Math.abs(Math.round(castToNumber(args.B)));
      if (a === 0 || b === 0) return 0;
      let x = a, y = b;
      while (y) { const t = x % y; x = y; y = t; }
      return (a / x) * b;
    }

    // ---------- 实用工具 ----------
    timestampMs() { return Date.now(); }
    timestampSec() { return Math.floor(Date.now() / 1000); }
    _formatDate(d, withTime) {
      const p = (n) => String(n).padStart(2, '0');
      const date = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
      return withTime
        ? `${date} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
        : date;
    }
    nowDateTime() { return this._formatDate(new Date(), true); }
    nowDate() { return this._formatDate(new Date(), false); }

    // ---------- 运行控制 ----------
    constructor() {
      this._hooksReady = false;   // 是否已绑定运行时事件监听
      this._whenStopped = false; // 作品停止事件触发标志
      this._whenStarted = false; // 作品开始运行事件触发标志
      this._runningCache = false; // 作品是否在运行（由事件维护）
    }
    // 惰性绑定运行时事件（PROJECT_RUN_STOP / PROJECT_RUN_START）
    _ensureHooks(util) {
      if (this._hooksReady) return;
      const rt = getRT(util);
      if (!rt || typeof rt.on !== 'function') return;
      rt.on('PROJECT_RUN_STOP', () => {
        this._whenStopped = true;
        this._runningCache = false;
      });
      rt.on('PROJECT_RUN_START', () => {
        this._whenStarted = true;
        this._runningCache = true;
      });
      this._hooksReady = true;
    }
    greenFlagRun(args, util) {
      const rt = getRT(util);
      if (rt && rt.greenFlag) rt.greenFlag();
    }
    stopProject(args, util) {
      const rt = getRT(util);
      if (rt && rt.stopAll) rt.stopAll();
    }
    restartProject(args, util) {
      const rt = getRT(util);
      if (!rt) return;
      if (rt.stopAll) rt.stopAll();
      if (rt.greenFlag) rt.greenFlag();
    }
    pauseProject(args, util) { setPause(util, true); }
    resumeProject(args, util) { setPause(util, false); }
    togglePause(args, util) {
      const rt = getRT(util);
      if (!rt) return;
      if (typeof rt.togglePaused === 'function') { rt.togglePaused(); return; }
      setPause(util, !readPaused(rt));
    }
    turboOn(args, util) { setTurbo(util, true); }
    turboOff(args, util) { setTurbo(util, false); }
    toggleTurbo(args, util) {
      const rt = getRT(util);
      if (!rt) return;
      if (typeof rt.toggleTurboMode === 'function') { rt.toggleTurboMode(); return; }
      setTurbo(util, !readTurbo(rt));
    }
    whenProjectStopped(args, util) {
      this._ensureHooks(util);
      const fire = this._whenStopped;
      this._whenStopped = false;
      return fire;
    }
    whenProjectStarted(args, util) {
      this._ensureHooks(util);
      const fire = this._whenStarted;
      this._whenStarted = false;
      return fire;
    }
    isPaused(args, util) {
      this._ensureHooks(util);
      return readPaused(getRT(util));
    }
    isTurbo(args, util) {
      this._ensureHooks(util);
      return readTurbo(getRT(util));
    }
    isProjectRunning(args, util) {
      this._ensureHooks(util);
      return this._runningCache;
    }
  }

  Scratch.extensions.register(new XiaoBoLuoToolbox());
})(Scratch);
