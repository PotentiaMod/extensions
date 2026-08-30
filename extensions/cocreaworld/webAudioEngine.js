/**
 * Name: WebAudioEngine
 * ID: WebAudioEngine
 * Description: 在Scratch中构建音频图
 * By: 大尾巴奇@CCW.SITE
 */
(function (Scratch) {
  'use strict';
  
  const {ArgumentType, BlockType, TargetType, Cast, translate, extensions, vm} = Scratch;
  const runtime = vm.runtime;
  
  const FFT_LENGTHS = new Set([32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768]);
  const WAVEFORMS = new Set(['sine', 'square', 'sawtooth', 'triangle']);

  const NODE_TYPES_MENU = [
    { text: '振荡器节点', value: 'OscillatorNode' },
    { text: '音频节点', value: 'AudioBufferSourceNode' },
    { text: '分析节点', value: 'AnalyserNode' },
  ];
  const NODE_PROPS_MENUS = {
    OscillatorNode: [
      { text: '频率', value: 'frequency' },
      { text: '音高偏移', value: 'detune' },
      { text: '波形', value: 'type' },
    ],
    AudioBufferSourceNode: [
      { text: '速度', value: 'playbackRate' },
      { text: '音高偏移', value: 'detune' },
      { text: '是否循环?', value: 'loop' },
      { text: '循环开始时间', value: 'loopStart' },
      { text: '循环结束时间', value: 'loopEnd' },
    ],
    AnalyserNode: [
      { text: 'FFT大小', value: 'fftSize' },
      { text: '平滑时间常数', value: 'smoothingTimeConstant' },
      { text: '最小阈值', value: 'minDecibels' },
      { text: '最大阈值', value: 'maxDecibels' },
    ],
  };
  const PROP_CONFIG = {
    OscillatorNode: {
      constructor: OscillatorNode,
      frequency: {
        type: 'number',
        getter: (n) => n.frequency.value,
        setter: (n, v) => n.frequency.value = v },
      detune: {
        type: 'number',
        getter: (n) => n.detune.value,
        setter: (n, v) => n.detune.value = v },
      type: {
        type: 'string',
        getter: (n) => n.type,
        setter: (n, v) => n.type = v },
    },

    AudioBufferSourceNode: {
      constructor: AudioBufferSourceNode,
      playbackRate: {
        type: 'number',
        getter: (n) => n.playbackRate.value,
        setter: (n, v) => n.playbackRate.value = v },
      detune: {
        type: 'number',
        getter: (n) => n.detune.value,
        setter: (n, v) => n.detune.value = v },
      loop: {
        type: 'boolean',
        getter: (n) => n.loop,
        setter: (n, v) => n.loop = v },
      loopStart: {
        type: 'number',
        getter: (n) => n.loopStart,
        setter: (n, v) => n.loopStart = Math.max(0, v) },
      loopEnd: {
        type: 'number',
        getter: (n) => n.loopEnd,
        setter: (n, v) => n.loopEnd = Math.max(n.loopStart, v) },
    },

    AnalyserNode: {
      constructor: AnalyserNode,
      fftSize: {
        type: 'number',
        setter: (n,v)=>n.fftSize=v,
        getter: (n)=>n.fftSize
      },
      smoothingTimeConstant: {
        type: 'number',
        setter: (n,v)=>n.smoothingTimeConstant=v,
        getter: (n)=>n.smoothingTimeConstant
      },
      minDecibels: {
        type: 'number',
        setter: (n,v)=>n.minDecibels=v,
        getter: (n)=>n.minDecibels
      },
      maxDecibels: {
        type: 'number',
        setter: (n,v)=>n.maxDecibels=v,
        getter: (n)=>n.maxDecibels
      },
    },

  };
  const ANALYSER_CONFIG = {
    byte: {
      timeDomain: {ArrayType: Uint8Array, sizeKey: 'fftSize', method: 'getByteTimeDomainData'},
      frequency: {ArrayType: Uint8Array, sizeKey: 'frequencyBinCount', method: 'getByteFrequencyData'}
    },
    float: {
      timeDomain: {ArrayType: Float32Array, sizeKey: 'fftSize', method: 'getFloatTimeDomainData'},
      frequency: {ArrayType: Float32Array, sizeKey: 'frequencyBinCount', method: 'getFloatFrequencyData'}
    }
  };

  translate.setup({  // translate({id: 'extensionName'})
    zh: {
      //'extensionName': '我的扩展 demo',

    },
    en: {
      //'extensionName': 'ext demo',

    }
  });


  class Terminal {  // 简易终端
    constructor(logSystem, prefix) {
      this.terminal = logSystem;
      this.prefix = prefix;
    }
    #output(level, msg) {
      const outPut = `[${this.prefix}] ${msg}`

      console[level](outPut);
      if (this.terminal && typeof this.terminal[level] === 'function') {
        this.terminal[level](outPut);
      }
    }
    log(msg)  { return this.#output('log', msg) }
    warn(msg) { return this.#output('warn', msg) }
    error(msg) { return this.#output('error', msg) }
  }
  // 模块化基础
  class SafeAudioNode extends String {
    /**
     * 包装音频节点, 防止渲染出错
     * @param {AudioNode} realNode 被包装的AudioNode
     */
    constructor(realNode) {
      super('SafeAudioNode'); // 继承String
      if (!(realNode instanceof AudioNode)) {
        throw new Error('SafeAudioNode 仅接受一个 AudioNode 对象');
      }

      /** @type {Object} 附带数据 */
      this.value = {};

      /** @type {AudioNode} 音频节点 */
      this.node = realNode;
    }

    // AudioNode的字符串显示
    #display() { return `(AudioNode)[${this.node.constructor.name}]`; }
    toString() { return this.#display() };
    valueOf() { return this.#display() };
    toJSON() { return this.#display() };

    // 获得真实的节点
    get realNode() {
      return this.node
    }

    // 静态方法
    /**
     * 是否为SafeAudioNode
     * @param {*} obj
     * @returns {boolean}
     */
    static isSafeAudioNode(obj) {
      return obj instanceof String && Object.prototype.hasOwnProperty.call(obj, 'node');
    }

    /**
     * 获取真实AudioNode
     * @param {SafeAudioNode|AudioNode} obj
     * @returns {AudioNode}
     */
    static getRealNode(obj) {
      return SafeAudioNode.isSafeAudioNode(obj) ? obj.node : obj;
    }

    /**
     * 将AudioNode包装成SafeAudioNode
     * @param {AudioNode} node
     * @returns {SafeAudioNode}
     */
    static wrap(node) {
      return new SafeAudioNode(node);
    }
  }
  class SafeAudioContext extends String {
    /**
     * 包装上下文, 防止渲染出错
     * @param {BaseAudioContext} realContext 被包装的AudioContext
     */
    constructor(realContext) {
      super('SafeAudioContext'); // 继承String
      if (!(realContext instanceof BaseAudioContext)) {
        throw new Error('SafeAudioContext 仅接受一个 BaseAudioContext 对象');
      }

      /** @type {Object} 附带数据 */
      this.value = {};

      /** @type {BaseAudioContext} 音频上下文 */
      this.audioCtx = realContext;
    }

    // AudioContext的字符串显示
    #display() { return `(BaseAudioContext)[${this.audioCtx.constructor.name}]`; }
    toString() { return this.#display() };
    valueOf() { return this.#display() };
    toJSON() { return this.#display() };

    // 获得真实的AudioContext
    get realContext() {
      return this.audioCtx
    }

    // 静态方法
    /**
     * 是否为SafeAudioContext
     * @param {*} obj
     * @returns {boolean}
     */
    static isSafeAudioContext(obj) {
      return obj instanceof String && Object.prototype.hasOwnProperty.call(obj, 'audioCtx');
    }

    /**
     * 获取真实AudioContext
     * @param {SafeAudioContext|BaseAudioContext} obj
     * @returns {AudioContext}
     */
    static getRealContext(obj) {
      return SafeAudioContext.isSafeAudioContext(obj) ? obj.audioCtx : obj;
    }

    /**
     * 将AudioContext包装成SafeAudioContext
     * @param {BaseAudioContext} ac
     * @returns {SafeAudioContext}
     */
    static wrap(ac) {
      return new SafeAudioContext(ac);
    }
  }
  class SafeAudioParam extends String {
    /**
     * 包装AudioParam, 防止渲染出错
     * @param {AudioParam} realParam 被包装的AudioParam
     */
    constructor(realParam) {
      super('SafeAudioParam'); // 继承String
      if (!(realParam instanceof AudioParam)) {
        throw new Error('SafeAudioParam 仅接受一个 AudioParam 对象');
      }

      /** @type {Object} 附带数据 */
      this.value = {};

      /** @type {AudioParam} 音频节点 */
      this.audioParam = realParam;
    }

    // AudioParam的字符串显示
    #display() { return `(AudioParam){automationRate:"${this.audioParam.automationRate}",value:${this.audioParam.value}}`; }
    toString() { return this.#display() };
    valueOf() { return this.#display() };
    toJSON() { return this.#display() };

    // 获得真实的AudioParam
    get realParam() {
      return this.audioParam
    }

    // 静态方法
    /**
     * 是否为SafeAudioParam
     * @param {*} obj
     * @returns {boolean}
     */
    static isSafeAudioParam(obj) {
      return obj instanceof String && Object.prototype.hasOwnProperty.call(obj, 'audioParam');
    }

    /**
     * 获取真实AudioParam
     * @param {SafeAudioParam|AudioParam} obj
     * @returns {AudioParam}
     */
    static getRealParam(obj) {
      return SafeAudioParam.isSafeAudioParam(obj) ? obj.audioParam : obj;
    }

    /**
     * 将AudioParam包装成SafeAudioParam
     * @param {AudioParam} param
     * @returns {SafeAudioParam}
     */
    static wrap(param) {
      return new SafeAudioParam(param);
    }
  }


  // MARK: 拓展类
  class WebAudioEngine {
    constructor (runtime) {
      this.runtime = runtime;

      this.audioCtx = runtime.audioEngine.audioContext;  // 拿Scratch的上下文
      this.cacheIndex = {};
      this.cache = new Map();
      this.onendedData = null
      this.term = new Terminal(runtime.logSystem, 'WebAudio引擎');  // 兼容各个平台的终端
      this.scratchBlocks = window.ScratchBlocks ?? runtime.scratchBlocks; // 兼容TurboWarp与Gandi

      this._updateAudioData();  // 初始化索引

      // 调试功能 正式版记得删
      this.nodes = new WeakMap();
      this.nextId = 0;
      this.nodeRegistry = new FinalizationRegistry((m) => {
        // this.term.log(m)
        if (m.type === '引用壳') this.term.log(`节点ID ${m.id} 解除引用`)
          else this.term.log(`节点ID ${m.id} 被回收 类型:${m.type} `)
      });
    }
    getInfo () {
      return {
        id: 'webAudioEngine',
        color1: '#171f4a',
        color2: '#88a1eb',
        color3: '#a4cefe',
        name: 'WebAudio引擎',
        blocks: [
          // MARK: 定义连接
          {
            opcode: 'connectNode',
            blockType: BlockType.COMMAND,
            text: '连接节点 [UPNODE] 到节点 [DOWNNODE]',
            arguments: {
              UPNODE: {
                type: null
              },
              DOWNNODE: {
                type: null
              },
            }
          },
          {
            opcode: 'connectNodeWithChannel',
            blockType: BlockType.COMMAND,
            text: '连接节点 [UPNODE] 通道 [OUTPUTCHANNEL] 到节点 [DOWNNODE] 通道 [INPUTCHANNEL]',
            arguments: {
              UPNODE: {
                type: null
              },
              OUTPUTCHANNEL: {
                type: ArgumentType.NUMBER,
                defaultValue: 0
              },
              DOWNNODE: {
                type: null
              },
              INPUTCHANNEL: {
                type: ArgumentType.NUMBER,
                defaultValue: 0
              },
            }
          },
          {
            opcode: 'disconnectNode',
            blockType: BlockType.COMMAND,
            text: '断开节点 [NODE] 到下游所有节点的连接',
            arguments: {
              NODE: {
                type: null
              },
            }
          },
          {
            opcode: 'disconnectNodeWithNode',
            blockType: BlockType.COMMAND,
            text: '断开节点 [UPNODE] 到节点 [DOWNNODE] 的连接',
            arguments: {
              UPNODE: {
                type: null
              },
              DOWNNODE: {
                type: null
              },
            }
          },
          {
            opcode: 'disconnectNodeWithChannel',
            blockType: BlockType.COMMAND,
            text: '断开节点 [UPNODE] 通道 [OUTPUTCHANNEL] 到节点 [DOWNNODE] 通道 [INPUTCHANNEL] 的连接',
            arguments: {
              UPNODE: {
                type: null
              },
              OUTPUTCHANNEL: {
                type: ArgumentType.NUMBER,
                defaultValue: 0
              },
              DOWNNODE: {
                type: null
              },
              INPUTCHANNEL: {
                type: ArgumentType.NUMBER,
                defaultValue: 0
              },
            }
          },
          '---',
          {
            opcode: 'mergeNodes',
            blockType: BlockType.REPORTER,
            text: '[NODE1] , [NODE2]',
            arguments: {
              NODE1: {
                type: null
              },
              NODE2: {
                type: null
              },
            },
          },
          {
            opcode: 'chainConnectNodes',
            blockType: BlockType.COMMAND,
            text: '链式连接节点组 [NODES]',
            arguments: {
              NODES: {
                type: null
              },
            },
          },
          {
            opcode: 'connectMultipleNodes',
            blockType: BlockType.COMMAND,
            text: '多对一连接节点组 [NODES] 到节点 [TARGETNODE]',
            arguments: {
              NODES: {
                type: null
              },
              TARGETNODE: {
                type: null
              },
            },
          },
          '---',

          // MARK: 定义其他
          {
            opcode: 'scratchDestinationNode',
            blockType: BlockType.REPORTER,
            text: 'Scratch上下文目标',
            disableMonitor: true
          },
          {
            opcode: 'getScratchCurrentTime',
            blockType: BlockType.REPORTER,
            text: 'Scratch上下文当前时间',
            disableMonitor: true,
          },
          '---',

          // MARK: 定义属性
          {
            opcode: 'propTip',
            blockType: BlockType.LABEL,
            text: '属性',
          },
          {
            opcode: 'getNodeBaseProperty',
            blockType: BlockType.REPORTER,
            text: '基本节点 [NODE] 的 [PROP]',
            arguments: {
              NODE: {
                type: null
              },
              PROP: {
                type: ArgumentType.STRING,
                menu: 'nodeBaseProps'
              },
            }
          },
          {
            opcode: 'getNodeParam',
            blockType: BlockType.REPORTER,
            text: '[TYPE] [NODE] 的 [PROP] 的AudioParam对象',
            arguments: {
              TYPE: {
                type: ArgumentType.STRING,
                menu: 'nodeTypes'
              },
              NODE: {
                type: null
              },
              PROP: {
                type: ArgumentType.STRING,
                menu: 'nodeProps'
              },
            }
          },
          {
            opcode: 'getNodeProperty',
            blockType: BlockType.REPORTER,
            text: '[TYPE] [NODE] 的 [PROP]',
            arguments: {
              TYPE: {
                type: ArgumentType.STRING,
                menu: 'nodeTypes'
              },
              NODE: {
                type: null
              },
              PROP: {
                type: ArgumentType.STRING,
                menu: 'nodeProps'
              },
            }
          },
          {
            opcode: 'setNodeProperty',
            blockType: BlockType.COMMAND,
            text: '设置 [TYPE] [NODE] 的 [PROP] 为 [VALUE]',
            arguments: {
              TYPE: {
                type: ArgumentType.STRING,
                menu: 'nodeTypes'
              },
              NODE: {
                type: null
              },
              PROP: {
                type: ArgumentType.STRING,
                menu: 'nodeProps'
              },
              VALUE: {
                type: ArgumentType.STRING,
                defaultValue: ''
              },
            }
          },
          '---',

          // MARK: 定义参数自动化
          {
            opcode: 'ParamTip',
            blockType: BlockType.LABEL,
            text: '参数自动化'
          },
          {
            opcode: 'setValueAtTime',
            blockType: BlockType.COMMAND,
            text: '在 [TIME] 时 将参数 [PARAM] 设为 [VALUE]',
            arguments: {
              TIME: {
                type: ArgumentType.NUMBER,
                defaultValue: 0
              },
              PARAM: {
                type: null
              },
              VALUE: {
                type: ArgumentType.NUMBER,
                defaultValue: 1
              },
            }
          },
          {
            opcode: 'linearRampToValueAtTime',
            blockType: BlockType.COMMAND,
            text: '在 [TIME] 时 将参数 [PARAM] 线性变化为 [VALUE]',
            arguments: {
              TIME: {
                type: ArgumentType.NUMBER,
                defaultValue: 0
              },
              PARAM: {
                type: null
              },
              VALUE: {
                type: ArgumentType.NUMBER,
                defaultValue: 1
              },
            }
          },
          {
            opcode: 'exponentialRampToValueAtTime',
            blockType: BlockType.COMMAND,
            text: '在 [TIME] 时 将参数 [PARAM] 指数变化为 [VALUE]',
            arguments: {
              TIME: {
                type: ArgumentType.NUMBER,
                defaultValue: 0
              },
              PARAM: {
                type: null
              },
              VALUE: {
                type: ArgumentType.NUMBER,
                defaultValue: 1
              },
            }
          },
          {
            opcode: 'setTargetAtTime',
            blockType: BlockType.COMMAND,
            text: '在 [TIME] 时 将参数 [PARAM] 指数趋近至 [TARGET] 时间常数 [TC] ',
            arguments: {
              TIME: {
                type: ArgumentType.NUMBER,
                defaultValue: 0
              },
              PARAM: {
                type: null
              },
              TARGET: {
                type: ArgumentType.NUMBER,
                defaultValue: 1
              },
              TC: {
                type: ArgumentType.NUMBER,
                defaultValue: 0.1
              },
            }
          },
          {
            opcode: 'setValueCurveAtTime',
            blockType: BlockType.COMMAND,
            text: '在 [TIME] 时 将参数 [PARAM] 按列表 [LIST] 变化 用时 [DURATION] 秒',
            arguments: {
              TIME: {
                type: ArgumentType.NUMBER,
                defaultValue: 0
              },
              PARAM: {
                type: null
              },
              LIST: {
                type: ArgumentType.STRING,
                menu: 'listMenu'
              },
              DURATION: {
                type: ArgumentType.NUMBER,
                defaultValue: 3
              },
            }
          },
          {
            opcode: 'cancelScheduledValues',
            blockType: BlockType.COMMAND,
            text: '取消参数 [PARAM] 在 [TIME] 秒之后的所有行为',
            arguments: {
              PARAM: {
                type: null
              },
              TIME: {
                type: ArgumentType.NUMBER,
                defaultValue: 0
              },
            }
          },
          {
            opcode: 'cancelAndHoldAtTime',
            blockType: BlockType.COMMAND,
            text: '取消参数 [PARAM] 在 [TIME] 秒之后的所有行为并保持当前值',
            arguments: {
              PARAM: {
                type: null
              },
              TIME: {
                type: ArgumentType.NUMBER,
                defaultValue: 0
              },
            }
          },
          '---',
          
          // MARK: 定义缓存
          {
            opcode: 'bufferTip',
            blockType: BlockType.LABEL,
            text: '音频缓存'
          },
          {
            opcode: 'cacheAudioFromProject',
            blockType: BlockType.COMMAND,
            text: '从项目中缓存音频 [AUDIO]',
            arguments: {
              AUDIO: {
                type: ArgumentType.STRING,
                menu: 'projectAudios'
              },
            }
          },
          {
            opcode: 'cacheURLAudio',
            blockType: BlockType.COMMAND,
            text: '从URL [URL] 缓存音频并命名为 [NAME]',
            arguments: {
              URL: {
                type: ArgumentType.STRING,
                defaultValue: ''
              },
              NAME: {
                type: ArgumentType.STRING,
                defaultValue: ''
              }
            }
          },
          {
            opcode: 'getCachedList',
            blockType: BlockType.REPORTER,
            text: '音频缓存列表',
          },
          {
            opcode: 'isCached',
            blockType: BlockType.BOOLEAN,
            text: '音频 [NAME] 已缓存?',
            arguments: {
              NAME: {
                type: ArgumentType.STRING,
                menu: 'projectAudios'
              }
            }
          },
          {
            opcode: 'deleteCache',
            blockType: BlockType.COMMAND,
            text: '删除缓存 [NAME]',
            arguments: {
              NAME: {
                type: ArgumentType.STRING,
                menu: 'cachedList'
              }
            }
          },
          {
            opcode: 'deleteAllCache',
            blockType: BlockType.COMMAND,
            text: '删除所有缓存',
          },
          '---',


          // MARK: 定义源节点
          {
            opcode: 'sourceNodeTip',
            blockType: BlockType.LABEL,
            text: '源节点',
          },
          {
            opcode: 'createOscillatorNode',
            blockType: BlockType.REPORTER,
            text: '振荡器节点 波形[TYPE]',
            arguments: {
              TYPE: {
                type: ArgumentType.STRING,
                menu: 'waveform',
              },
            }
          },
          {
            opcode: 'setOscillatorNodeCustomWave',
            blockType: BlockType.COMMAND,
            text: '振荡器节点 [NODE] 以 [REAL] 为实部 [IMAG] 为虚部 作为自定义波形',
            arguments: {
              NODE: {
                type: null
              },
              REAL: {
                type: ArgumentType.STRING,
                menu: 'listMenu'
              },
              IMAG: {
                type: ArgumentType.STRING,
                menu: 'listMenu'
              },
            }
          },

          {
            opcode: 'createAudioBufferNode',
            blockType: BlockType.REPORTER,
            text: '音频缓冲节点 缓存[NAME]',
            arguments: {
              NAME: {
                type: ArgumentType.STRING,
                menu: 'cachedList'
              }
            }
          },
          {
            opcode: 'startAudioBufferSourceNode',
            blockType: BlockType.COMMAND,
            text: '在 [TIME] 时使音频缓冲节点 [NODE] 开始 起始位置 [OFFSET] 持续 [DURATION]',
            arguments: {
              TIME: {
                type: ArgumentType.NUMBER,
                defaultValue: 0
              },
              NODE: {
                type: null
              },
              OFFSET: {
                type: ArgumentType.NUMBER,
                defaultValue: 2
              },
              DURATION: {
                type: ArgumentType.NUMBER,
                defaultValue: 4
              },
            }
          },
          '---',
          {
            opcode: 'operateSourceNode',
            blockType: BlockType.COMMAND,
            text: '使源节点 [NODE] [OPERATION]',
            arguments: {
              NODE: {
                type: null
              },
              OPERATION: {
                type: ArgumentType.STRING,
                menu: 'operation'
              }
            }
          },
          {
            opcode: 'operateSourceNodeAtTime',
            blockType: BlockType.COMMAND,
            text: '在 [TIME] 时使源节点 [NODE] [OPERATION]',
            arguments: {
              NODE: {
                type: null
              },
              TIME: {
                type: ArgumentType.NUMBER,
                defaultValue: 0
              },
              OPERATION: {
                type: ArgumentType.STRING,
                menu: 'operation'
              }
            }
          },
          '---',
          {
            opcode: 'setSourceNodeOnended',
            blockType: BlockType.COMMAND,
            text: '当节点 [NODE] 结束时回调 附带数据[DATA]',
            arguments: {
              NODE: {
                type: null
              },
              DATA: {
                type: ArgumentType.STRING,
                defaultValue: ''
              }
            },
          },
          {
            opcode: 'getOnendedData',
            blockType: BlockType.REPORTER,
            text: '上一次回调附带数据',
          },
          {
            opcode: 'onendedEvent',
            blockType: BlockType.EVENT,
            text: '当节点回调后',
            isEdgeActivated: false,
          },


          // MARK: 定义分析节点
          {
            opcode: 'AnalyserNodeTip',
            blockType: BlockType.LABEL,
            text: '分析节点',
          },
          {
            opcode: 'createAnalyserNode',
            blockType: BlockType.REPORTER,
            text: '分析节点 FFT大小[FFT]',
            arguments: {
              FFT: {
                type: ArgumentType.NUMBER,
                defaultValue: 2048
              },
            }
          },
          {
            opcode: 'getAnalyserData',
            blockType: BlockType.REPORTER,
            text: '分析节点 [NODE] 的 [TYPE] [DOMAIN] 数据',
            arguments: {
              NODE: {
                type: null
              },
              TYPE: {
                type: ArgumentType.STRING,
                menu: 'AnalyserPrecision'
              },
              DOMAIN: {
                type: ArgumentType.STRING,
                menu: 'domainType'
              },
            }
          },
          {
            opcode: 'setAnalyserDataToScratchList',
            blockType: BlockType.COMMAND,
            text: '将分析节点 [NODE] 的 [TYPE] [DOMAIN] 数据覆盖到列表 [NAME]',
            arguments: {
              NODE: {
                type: null
              },
              TYPE: {
                type: ArgumentType.STRING,
                menu: 'AnalyserPrecision'
              },
              DOMAIN: {
                type: ArgumentType.STRING,
                menu: 'domainType'
              },
              NAME: {
                type: ArgumentType.STRING,
                menu: 'listMenu'
              },
            }
          },



          // MARK: 定义调试功能, 正式版记得删
          {
            opcode: 'debugTip',
            blockType: BlockType.LABEL,
            text: '调试工具',
          },
          {
            opcode: 'printWeakMap',
            blockType: BlockType.COMMAND,
            text: '打印追踪节点列表到浏览器控制台',
          },
          {
            opcode: 'getNodeId',
            blockType: BlockType.REPORTER,
            text: '节点 [NODE] 的追踪ID',
            arguments: {
              NODE: {
                type: null
              }
            }
          },
          {
            opcode: 'traceNode',
            blockType: BlockType.COMMAND,
            text: '追踪节点 [NODE]',
            arguments: {
              NODE: {
                type: null
              }
            }
          },
          {
            opcode: 'log',
            blockType: BlockType.COMMAND,
            text: 'log [THING]',
            arguments: {
              THING: {
                type: ArgumentType.STRING,
                defaultValue: ''
              }
            }
          },
          {
            opcode: 'returnRuntime',
            blockType: BlockType.COMMAND,
            text: '输出runtime到控制台',

          },
        ],
        // MARK: 菜单定义
        menus: {
          nodeTypes: {
            acceptReporters: false,
            items: NODE_TYPES_MENU
          },
          nodeBaseProps: {
            acceptReporters: false,
            items: [
              { text: '所属上下文', value: 'context' },
              { text: '输入通道数', value: 'numberOfInputs' },
              { text: '输出通道数', value: 'numberOfOutputs' },
              { text: '声道数', value: 'channelCount' },
              { text: '声道匹配方式', value: 'channelCountMode' },
              { text: '声道混音方式', value: 'channelInterpretation' },
            ]
          },
          nodeProps: {
            acceptReporters: false,
            items: '_getProps'
          },
          projectAudios: {
            acceptReporters: true,
            items: '_updateAudioData'
          },
          waveform: {
            acceptReporters: true,
            items: [
              { text: '正弦波', value: 'sine' },
              { text: '脉冲波', value: 'square' },
              { text: '锯齿波', value: 'sawtooth' },
              { text: '三角波', value: 'triangle' },
            ]
          },
          cachedList: {
            acceptReporters: true,
            items: '_getCachedList'
          },
          operation: {
            acceptReporters: false,
            items: [
              { text: '开始', value: 'start' },
              { text: '停止', value: 'stop' },
            ]
          },
          AnalyserPrecision: {
            acceptReporters: false,
            items: [
              { text: '常规', value: 'byte' },
              { text: '高精度', value: 'float' },
            ]
          },
          domainType: {
            acceptReporters: false,
            items: [
              { text: '时域', value: 'timeDomain' },
              { text: '频域', value: 'frequency' },
            ]
          },
          listMenu: {
            acceptReporters: false,
            items: '_listMenu'
          },
        }
      };
    }


    // MARK: 连接
    connectNode(args) {
      const up = this._unwrapNode(args.UPNODE);
      const down = this._unwrapNode(args.DOWNNODE);
      if (!up) return;
      if (!down) return;

      if (up.numberOfOutputs === 0) return this.term.warn('上游节点不存在输出');
      if (down.numberOfInputs === 0) return this.term.warn('下游节点不存在输入');
      if (up.context !== down.context) return this.term.error('节点不属于同一AudioContext');

      up.connect(down);
    }

    connectNodeWithChannel(args) {
      const up = this._unwrapNode(args.UPNODE);
      const down = this._unwrapNode(args.DOWNNODE);
      if (!up) return;
      if (!down) return;

      const outChannel = args.OUTPUTCHANNEL;
      const inChannel = args.INPUTCHANNEL;
      if (!Number.isInteger(outChannel) || outChannel < 0 || outChannel >= up.numberOfOutputs) return this.term.warn(`无效的输出通道: ${outChannel}`);
      if (!Number.isInteger(inChannel) || inChannel < 0 || inChannel >= down.numberOfInputs) return this.term.warn(`无效的输入通道: ${inChannel}`);
      if (up.context !== down.context) return this.term.error('节点不属于同一AudioContext');

      up.connect(down, outChannel, inChannel);
    }

    disconnectNode(args) {
      const node = this._unwrapNode(args.NODE);
      if (!node) return;

      node.disconnect();
    }

    disconnectNodeWithNode(args) {
      const up = this._unwrapNode(args.UPNODE);
      const down = this._unwrapNode(args.DOWNNODE);
      if (!up) return;
      if (!down) return;

      if (up.numberOfOutputs === 0) return this.term.warn('上游节点不存在输出');
      if (down.numberOfInputs === 0) return this.term.warn('下游节点不存在输入');
      if (up.context !== down.context) return this.term.error('节点不属于同一AudioContext');

      try {
        up.disconnect(down);
      } catch(e) {
        return this.term.error(`断开时发生错误: ${e}`);
      };
    }

    disconnectNodeWithChannel(args) {
      const up = this._unwrapNode(args.UPNODE);
      const down = this._unwrapNode(args.DOWNNODE);
      if (!up) return;
      if (!down) return;

      const outChannel = args.OUTPUTCHANNEL;
      const inChannel = args.INPUTCHANNEL;
      if (!Number.isInteger(outChannel) || outChannel < 0 || outChannel >= up.numberOfOutputs) return this.term.warn(`无效的输出通道: ${outChannel}`);
      if (!Number.isInteger(inChannel) || inChannel < 0 || inChannel >= down.numberOfInputs) return this.term.warn(`无效的输入通道: ${inChannel}`);
      if (up.context !== down.context) return this.term.error('节点不属于同一AudioContext');

      try {
        up.disconnect(down, outChannel, inChannel);
      } catch(e) {
        return this.term.error(`断开时发生错误: ${e}`);
      };
    }

    // MARK: 多节点连接
    mergeNodes(args){
      return [].concat(args.NODE1, args.NODE2)
    }

    chainConnectNodes(args) {
      const nodes = args.NODES
      const actualNodes = nodes.map((n) => this._unwrapNode(n));

      let node, ctx = null;
      for(let i = 0; i < nodes.length; i++) {
        node = actualNodes[i];
        if (!node) return this.term.error(`节点包含无效项: ${nodes[i]}`);

        if (i === 0) ctx = node.context;
        else if (node.context !== ctx) return this.term.error(`有节点不属于同一AudioContext: ${nodes[i].toString()}`);
        if (node.numberOfOutputs === 0 && i+1 !== nodes.length) return this.term.error(`节点 ${nodes[i].toString()} 不存在输出`);
        if (node.numberOfInputs === 0 && i !== 0) return this.term.error(`节点 ${nodes[i].toString()} 不存在输入`);
      }

      try {
        for(let i = 0; i < nodes.length - 1; i++) {
          actualNodes[i].connect(actualNodes[i + 1]);
        };
      } catch(e) {
        if (e.name === 'InvalidAccessError') return this.term.error('连接时不允许非DelayNode节点循环连接');
        else return this.term.error(`连接时发生未知错误: ${e}`);

      };
    }

    connectMultipleNodes(args) {
      const target = this._unwrapNode(args.TARGETNODE);
      if (!target) return;
      if (target.numberOfInputs === 0) return this.term.error('目标节点不存在输入');
      let ctx = target.context;

      const nodes = args.NODES;
      const actualNodes = nodes.map((n) => this._unwrapNode(n));

      let node = null;
      for(let i = 0; i < nodes.length; i++) {
        node = actualNodes[i];
        if (!node) return this.term.error(`节点包含无效项: ${nodes[i]}`);

        if (node.context !== ctx) return this.term.error(`节点 ${nodes[i].toString()} 与目标节点不属于同一AudioContext`);
        if (node.numberOfOutputs === 0) return this.term.error(`节点 ${nodes[i].toString()} 不存在输出`);
      }

      try {
        for(let i = 0; i < nodes.length; i++) {
          actualNodes[i].connect(target);
        };
      } catch(e) {
        return this.term.error(`连接时发生错误: ${e}`);
      };
    }



    // MARK: 属性
    getNodeBaseProperty(args) {
      const node = this._unwrapNode(args.NODE);
      if (!node) return;

      if (args.PROP === 'context') return new SafeAudioContext(node.context);
      else return node[args.PROP];
    }

    getNodeParam(args) {
      const { TYPE, PROP } = args;
      const node = this._unwrapNode(args.NODE);
      if (!node) return;

      const props = PROP_CONFIG[TYPE];
      const config = props[PROP];
      if(!(node instanceof props.constructor)) return this.term.warn('所选类型与实际节点的类型不匹配');

      const param = node[args.PROP];
      if (param instanceof AudioParam) return new SafeAudioParam(param);
      return '';
    }

    getNodeProperty(args) {
      const { TYPE, PROP } = args;
      const node = this._unwrapNode(args.NODE);
      if (!node) return;

      const props = PROP_CONFIG[TYPE];
      const config = props[PROP];
      if(!(node instanceof props.constructor)) return this.term.warn('所选类型与实际节点的类型不匹配');

      try {
        return config.getter(node);
      } catch(e) {

      }
    }

    setNodeProperty(args) {
      const { TYPE, PROP, VALUE } = args;
      const node = this._unwrapNode(args.NODE);
      if (!node) return;

      const props = PROP_CONFIG[TYPE];
      const config = props[PROP];
      if(!(node instanceof props.constructor)) return this.term.warn('所选类型与实际节点的类型不匹配');

      let value = 0;
      switch(config.type){
        case 'number':
          value = Number(VALUE);
          if (isNaN(value)) return;
          break;
        case 'string':
          value = VALUE;
          break;
        case 'boolean':
          value = Cast.toBoolean(VALUE);
          break;
      };

      try {
        config.setter(node, value);
      } catch(e){
        this.term.error(`设置参数错误: ${e.message}\n节点: ${node}\n目标属性: '${PROP}'\n值: ${VALUE} -> ${value}`);
      };
    }

    // MARK: 参数自动化
    setValueAtTime(args){
      const param = this._unwrapParam(args.PARAM);
      if (!param) return;

      const time = Number(args.TIME);
      const value = Number(args.VALUE);

      try {
        param.setValueAtTime(value, time);
      } catch(e) {
        this.term.error(e);
        return;
      }
    }

    linearRampToValueAtTime(args){
      const param = this._unwrapParam(args.PARAM);
      if (!param) return;

      const time = Number(args.TIME);
      const value = Number(args.VALUE);

      try {
        param.linearRampToValueAtTime(value, time);
      } catch(e) {
        this.term.error(e);
        return;
      }
    }

    exponentialRampToValueAtTime(args){
      const param = this._unwrapParam(args.PARAM);
      if (!param) return;

      const time = Number(args.TIME);
      const value = Number(args.VALUE);

      try {
        param.exponentialRampToValueAtTime(value, time);
      } catch(e) {
        this.term.error(e);
        return;
      }
    }

    setTargetAtTime(args){
      const param = this._unwrapParam(args.PARAM);
      if (!param) return;

      const target = Number(args.TARGET);
      const time = Number(args.TIME);
      const tc = Number(args.TC);

      try {
        param.setTargetAtTime(target, time, tc);
      } catch(e) {
        this.term.error(e);
        return;
      }
    }

    setValueCurveAtTime(args, util){
      const param = this._unwrapParam(args.PARAM);
      if (!param) return;

      const listName = args.LIST;
      const time = Number(args.TIME);
      const duration = Number(args.DURATION);
      
      let list;
      if (listName === 'empty') return '';
        list = util.target.lookupVariableById(listName);
        if (!list) {
          list = util.target.lookupVariableByNameAndType(listName, 'list');
          if (!list) return '';
        }

      try {list = new Float32Array(list.value)}
      catch {return this.term.error(`无效的数组: ${list.value}`)}

      try {
        param.setValueCurveAtTime(list, time, duration);
      } catch(e) {
        this.term.error(e);
        return;
      }
    }

    cancelScheduledValues(args){
      const param = this._unwrapParam(args.PARAM);
      if (!param) return;

      const time = Number(args.TIME);

      try {
        param.cancelScheduledValues(time);
      } catch(e) {
        this.term.error(e);
        return;
      }
    }

    cancelAndHoldAtTime(args){
      const param = this._unwrapParam(args.PARAM);
      if (!param) return;

      const time = Number(args.TIME);

      try {
        param.cancelScheduledValues(time);
      } catch(e) {
        this.term.error(e);
        return;
      }
    }




    // MARK: 其他
    scratchDestinationNode() {
      return this._wrapNode(this.audioCtx.destination);
    }

    getScratchCurrentTime() {
      return this.audioCtx.currentTime;
    }



    // MARK: 缓存
    cacheAudioFromProject(args) {
      const name = String(args.AUDIO);
      const buffer = this.cacheIndex[name]
      if (!buffer) return;
      this._cacheAudio(name, buffer);
    }

    cacheURLAudio(args) {
      const url = args.URL;
      if (!URL.canParse(url)) return;
      this._cacheURLAudio(args.NAME, url);
    }

    getCachedList() {
      return JSON.stringify([...this.cache.keys()])
    }

    isCached(args) {
      return this._isCached(String(args.NAME))
    }

    deleteCache(args) {
      const name = String(args.NAME)
      if (!this._isCached(name)) return;
      this.cache.delete(name);
    }

    deleteAllCache(args) {
      this.cache.clear();
    }



    // MARK: 源节点
    createOscillatorNode(args) {
      const node = new OscillatorNode(this.audioCtx);
      if (WAVEFORMS.has(args.TYPE))node.type = args.TYPE;
      return this._wrapNode(node);
    }
    setOscillatorNodeCustomWave(args, util) {
      const node = this._unwrapNode(args.NODE);
      if (!(node instanceof OscillatorNode)) return;

      const real = args.REAL;
      const imag = args.IMAG;

      if (real === 'empty') return;
      let realArray = util.target.lookupVariableById(real);
      if (!realArray) realArray = util.target.lookupVariableByNameAndType(real, 'list');
      
      if (imag === 'empty') return;
      let imagArray = util.target.lookupVariableById(imag);
      if (!imagArray) imagArray = util.target.lookupVariableByNameAndType(imag, 'list');

      if (realArray.value.length !== imagArray.value.length) return this.term.error(`两个数组的长度必须相同`);
      try {
        const i = new Float32Array(imagArray.value);
        const r = new Float32Array(realArray.value);
        const wave = this.audioCtx.createPeriodicWave(r, i);
        node.setPeriodicWave(wave)
      } catch(e) {
        this.term.error(e)
      }
    }

    createAudioBufferNode(args) {
      const name = String(args.NAME);
      const buffer = this._isCached(name) ? this.cache.get(name) : null;

      const node = new AudioBufferSourceNode(this.audioCtx);
      node.buffer = buffer;

      return this._wrapNode(node);
    }

    startAudioBufferSourceNode(args) {
      try {
        const node = this._unwrapNode(args.NODE);
        const time = Number(args.TIME);
        const offset = Number(args.OFFSET);
        const duration = Number(args.DURATION);
        if (!(node instanceof AudioBufferSourceNode)) return;
        if (isNaN(time) || time < 0) return this.term.warn(`非法的时间: ${time}`);
        if (isNaN(offset) || offset < 0) return this.term.warn(`非法的起始位置: ${offset}`);
        if (isNaN(duration) || duration < 0) return this.term.warn(`非法的持续时间: ${duration}`);
        
        node.start(time, offset, duration);
      } catch(e) {
        if (e.name === 'InvalidStateError') {
          this.term.error(`节点当前状态不允许.start() : ${e.message}`);
        } else {
          this.term.error(`${args.OPERATION} 时发生错误: ${e}`);
        }
      }
    }

    operateSourceNode(args){
      try {
        const node = this._unwrapNode(args.NODE);
        if (!(node instanceof AudioScheduledSourceNode)) return;

        if (args.OPERATION === 'start') node.start();
        else if (args.OPERATION === 'stop') node.stop();
      } catch(e) {
        if (e.name === 'InvalidStateError') {
          this.term.error(`节点当前状态不允许 ${args.OPERATION} : ${e.message}`);
        } else {
          this.term.error(`${args.OPERATION} 时发生错误: ${e}`);
        }
      }
    }

    operateSourceNodeAtTime(args){
      try {
        const node = this._unwrapNode(args.NODE);
        const time = Number(args.TIME);
        if (!(node instanceof AudioScheduledSourceNode)) return;
        if (isNaN(time) || time < 0) return this.term.warn(`非法的时间: ${time}`);
        
        if (args.OPERATION === 'start') node.start(time);
        else if (args.OPERATION === 'stop') node.stop(time);
      } catch(e) {
        if (e.name === 'InvalidStateError') {
          this.term.error(`节点当前状态不允许 ${args.OPERATION} : ${e.message}`);
        } else {
          this.term.error(`${args.OPERATION} 时发生错误: ${e}`);
        }
      }
    }
    
    setSourceNodeOnended(args) {
      const node = this._unwrapNode(args.NODE);
      if (!(node instanceof AudioScheduledSourceNode)) return;

      if (!('onended' in node)) {
        this.term.warn(`节点 ${node} 没有onended属性`);
        return;
      }
      node.onended = () => {
        this.onendedData = args.DATA;
        this.runtime.startHats('webAudioEngine_onendedEvent');
      }
    }

    getOnendedData(args) {
      return this.onendedData
    }



    // MARK: 分析节点
    createAnalyserNode(args) {
      let fftSize = Number(args.FFT);
      if (!FFT_LENGTHS.has(fftSize)) {
        this.term.warn('FFT大小必须为2^n(5≤n≤15且n为整数)')
        fftSize = 2048
      }
      const node = new AnalyserNode(this.audioCtx)
      node.fftSize = fftSize
      return this._wrapNode(node)
    }

    getAnalyserData(args) {
      const data = this._getAnalyserData(args.NODE, args.TYPE, args.DOMAIN);
      if (!data) return '';
      return JSON.stringify(Array.from(data));
    }

    setAnalyserDataToScratchList(args, util) {
      let data = this._getAnalyserData(args.NODE, args.TYPE, args.DOMAIN);
      if (!data) data = [];

      //by Arkos
      const {NAME} = args
      const obj = Array.from(data);
      if (NAME === 'empty') return;
      let list = util.target.lookupVariableById(NAME);
      if (!list) {
        list = util.target.lookupVariableByNameAndType(NAME, 'list');
        if (!list) return;
      }
      list.value = obj;
    }



    // MARK: 调试功能 正式版记得删
    printWeakMap() {
      console.log(this.nodes);
    }

    getNodeId(args) {
      const node = this._unwrapNode(args.NODE);
      if (this.nodes.has(node)) return this.nodes.get(node);
      return -1;
    }

    traceNode(args) {
      const node = args.NODE;
      if (!this.nodes.has(node)) {
        const id = this.nextId++;

        this.nodes.set(node, id);

        this.nodeRegistry.register(node, {id: id, type: '引用壳'});
        this.nodeRegistry.register(node.realNode, {id: id, type: node.toString()});

        this.term.log(`跟踪节点ID ${this.nextId - 1}`);
      } else {
        return this.nodes.get(node);
      };
    }

    log(args) {
      console.log(args.THING);
    }

    returnRuntime(){
      console.log(runtime)
    }



    // MARK: 内部方法
    /**
     * 包装AudioNode为SafeAudioNode
     * @param {AudioNode} node 被转换的对象
     * @return {SafeAudioNode} SafeAudioNode对象
     */
    _wrapNode(node) {
      return SafeAudioNode.wrap(node);
    }

    /**
     * 转换SafeAudioNode为原AudioNode
     * @param {SafeAudioNode} node 被转换的对象
     * @return {AudioNode} 真正的AudioNode对象
     */
    _unwrapNode(node) {
      return SafeAudioNode.isSafeAudioNode(node) ? node.realNode : undefined;
    }

    /**
     * 转换SafeAudioParam为原AudioParam
     * @param {SafeAudioParam} param 被转换的对象
     * @return {AudioParam} 真正的AudioParam对象
     */
    _unwrapParam(param) {
      return SafeAudioParam.isSafeAudioParam(param) ? param.realParam : undefined;
    }

    /**
     * 异步解码音频
     * @param {string} key 作为键的值
     * @param {Uint8Array} data 待解码的音频数据
     * @return {void}
     */
    async _cacheAudio(key, data) {
      // 检查键值防止短期多次解码
      if (this.cache.get(key) instanceof Promise) return;

      this.term.log(`音频 ${key} 解码中...`);
      // 先放promise占位
      this.cache.set(key, this.audioCtx.decodeAudioData(data.buffer.slice())
      .then(buffer =>{
        // 再将promise替换成真正的buffer
        this.cache.set(key, buffer);
        this.term.log(`音频 ${key} 解码成功!`);
        return buffer;
      })
      .catch(e => {
        // 若解码失败则删除该项
        this.cache.delete(key);
        this.term.error(`音频 ${key} 解码失败: ${e.message}`)
        throw e;
      }))
    }

    /**
     * 获取节点属性列表
     * @return {Object}
     */
    _getProps(spriteId){
      try {
        // 当前查看菜单的积木
        const selected = this.scratchBlocks.selected;
        // console.log(selected);
        const value = selected.getFieldValue('TYPE');

        const menu = NODE_PROPS_MENUS[value];
        if (!menu) return [{ text: '-', value: '-' }];
        return menu;
      } catch {
        return [{ text: '-', value: '-' }];
      }
    }

    /**
     * 获取项目中所有音频的名称与原数据
     * @return {[['音频名称'], {'音频名称': Uint8Array}]}
     */
    _getAllAudioData(){
      const spriteNames = new Set();
      const names = [];
      const data = {};

      const targets = this.runtime.targets;

      for (const target of targets) {
        const sprite = target.sprite;

        // 克隆体算独立实例, 要做区分
        if (spriteNames.has(sprite.name)) continue;

        const spriteName = sprite.name;
        const sounds = sprite.sounds;

        spriteNames.add(spriteName);

        for (const sound of sounds) {
          const name = `${spriteName}.${sound.name}`;
          names.push(name);
          data[name] = sound.asset.data;
        }
      }

      return [names, data];
    }

    /**
     * 返回项目所有音频名称并更新数据索引
     * @return {List}
     */
    _updateAudioData(){
      const data = this._getAllAudioData();
      this.cacheIndex = data[1]
      return data[0].length > 0 ? data[0] : ['-']
    }

    /**
     * 返回已缓存音频列表
     * @return {List}
     */
    _getCachedList(){
      const cacheList = [...this.cache.keys()]
      return cacheList.length > 0 ? cacheList : ['-']
    }

    /**
     * 缓存URL音频
     * @param {String} name 音频的名字
     * @param {URL} url 音频的URL
     * @return {void}
     */
    async _cacheURLAudio(name, url){
      try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        const uint8 = new Uint8Array(buffer);
        this._cacheAudio(name, uint8)
      } catch(e) {
        this.term.error(`音频 ${name} 获取失败`);
      }
    }

    /**
     * 判断cache元素是否存在与完成
     * @param {String} key 被判断元素的键
     * @return {Boolean}
     */
    _isCached(key) {
      return this.cache.get(key) instanceof AudioBuffer;
    }

    /**
     * 获取AnalyserNode的频域时域数据
     * @param {SafeAudioNode} node 正确的SafeAudioNode
     * @param {String} type 获取数据的精度(byte / float)
     * @param {String} damain 频域或时域数据(frequency / timeDomain)
     * @return {Uint8Array|Float32Array} 返回的类型取决于输入的精度
     */
    _getAnalyserData(node, type, domain) {
      const realNode = this._unwrapNode(node);
      if (!(realNode instanceof AnalyserNode)) return false;

      const { ArrayType, sizeKey, method } = ANALYSER_CONFIG[type][domain];
      const size = realNode[sizeKey];

      let dataArray = node.value?.[domain];
      if (dataArray?.length !== size || !(dataArray instanceof ArrayType)) {
        node.value[domain] = new ArrayType(size);
        dataArray = node.value[domain];
      }
      realNode[method](dataArray);

      return dataArray;
    }

    // by Arkos
    /**
     * Scratch列表的菜单
     * @returns {text: "列表名", value: "列表id"}[];
     */
    _listMenu() {
      const menus = [];
      let { variables } = this.runtime._stageTarget;
      Object.keys(variables).forEach((variable) => {
          if (variables[variable].type === 'list') {
          menus.push({
              text: variables[variable].name,
              value: variables[variable].id,
          });
          }
      });
      try {
          variables = this.runtime._editingTarget.variables;
      } catch (e) {
          variables = 'error';
      }
      if (variables !== 'error' && this.runtime._editingTarget !== this.runtime._stageTarget) {
          Object.keys(variables).forEach((variable) => {
          if (variables[variable].type) {
              menus.push({
              text: `[PRIVATE] ${variables[variable].name}`,
              value: variables[variable].id,
              });
          }
          });
      }
      if (menus.length === 0) {
          menus.push({
          text: '-',
          value: 'empty',
          });
      }
      return menus;
    }
  }
  extensions.register(new WebAudioEngine(runtime));
}(Scratch));