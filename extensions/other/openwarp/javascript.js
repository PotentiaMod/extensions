// Name: javascript
// ID: javascript
// Description: 使用javascript代码
// By: Yesshape <https://scratch.mit.edu/users/yesshape/>
// License: MPL-2.0
(function(Scratch) {
  'use strict';
  
  // 扩展ID和版本信息
  const EXTENSION_ID = 'javascript';
  const EXTENSION_NAME = 'JavaScript';
  
  // 检查环境是否支持
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('此扩展必须在非沙盒模式下运行');
  }
  
  class JavaScriptExecutor {
    constructor() {
      // 存储变量和函数
      this.variables = {};
      this.functions = {};
    }
    
    getInfo() {
      return {
        id: EXTENSION_ID,
        name: EXTENSION_NAME,
        color1: '#FFAB19',
        color2: '#E69D00',
        color3: '#CC8E00',
        blocks: [
          // --- 代码执行类 ---
          {
            opcode: 'executeCode',
            blockType: Scratch.BlockType.COMMAND,
            text: '执行 JavaScript 代码 [CODE]',
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'console.log("Hello TurboWarp!")'
              }
            }
          },
          {
            opcode: 'evaluateExpression',
            blockType: Scratch.BlockType.REPORTER,
            text: '求值 JavaScript 表达式 [EXPR]',
            arguments: {
              EXPR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1 + 1'
              }
            }
          },
          {
            opcode: 'executeCodeInContext',
            blockType: Scratch.BlockType.COMMAND,
            text: '在上下文中执行 [CODE] 并返回结果到变量 [VAR]',
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Math.random() * 100'
              },
              VAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'result'
              }
            }
          },
          
          '---',
          
          // --- 变量操作类 ---
          {
            opcode: 'setVariable',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置 JS 变量 [NAME] 为 [VALUE]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myVar'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '42'
              }
            }
          },
          {
            opcode: 'getVariable',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 JS 变量 [NAME]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myVar'
              }
            }
          },
          {
            opcode: 'setObjectProperty',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置 JS 对象 [OBJ] 的属性 [PROP] 为 [VALUE]',
            arguments: {
              OBJ: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myObj'
              },
              PROP: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'x'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '100'
              }
            }
          },
          
          '---',
          
          // --- DOM操作类 ---
          {
            opcode: 'manipulateDOM',
            blockType: Scratch.BlockType.COMMAND,
            text: 'DOM操作: [OPERATION]',
            arguments: {
              OPERATION: {
                type: Scratch.ArgumentType.STRING,
                menu: 'domOperations'
              }
            }
          },
          {
            opcode: 'getElement',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取元素 [SELECTOR] 的 [PROPERTY]',
            arguments: {
              SELECTOR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#myElement'
              },
              PROPERTY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'textContent'
              }
            }
          },
          
          '---',
          
          // --- 工具类 ---
          {
            opcode: 'createAlert',
            blockType: Scratch.BlockType.COMMAND,
            text: '显示提示框 [MESSAGE]',
            arguments: {
              MESSAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello!'
              }
            }
          },
          {
            opcode: 'createPrompt',
            blockType: Scratch.BlockType.REPORTER,
            text: '显示输入框 [MESSAGE] 默认值 [DEFAULT]',
            arguments: {
              MESSAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '请输入:'
              },
              DEFAULT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              }
            }
          },
          {
            opcode: 'getCurrentTime',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前时间戳',
          },
          {
            opcode: 'fetchURL',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取 URL [ADDRESS] 的内容',
            arguments: {
              ADDRESS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://api.example.com/data'
              }
            }
          },
          
          '---',
          
          // --- 控制类 ---
          {
            opcode: 'loadScript',
            blockType: Scratch.BlockType.COMMAND,
            text: '加载外部脚本 [URL]',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://cdn.example.com/script.js'
              }
            }
          },
          {
            opcode: 'defineFunction',
            blockType: Scratch.BlockType.COMMAND,
            text: '定义 JS 函数 [NAME] 代码为 [CODE]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myFunction'
              },
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'return a + b;'
              }
            }
          },
          {
            opcode: 'callFunction',
            blockType: Scratch.BlockType.REPORTER,
            text: '调用函数 [NAME] 参数 [ARGS]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myFunction'
              },
              ARGS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1,2'
              }
            }
          }
        ],
        menus: {
          domOperations: {
            acceptReporters: true,
            items: [
              {
                text: '隐藏舞台',
                value: 'document.querySelector(".stage-wrapper").style.display = "none"'
              },
              {
                text: '显示舞台',
                value: 'document.querySelector(".stage-wrapper").style.display = ""'
              },
              {
                text: '更改背景色',
                value: 'document.body.style.backgroundColor = "#' + Math.floor(Math.random()*16777215).toString(16) + '"'
              },
              {
                text: '添加CSS动画',
                value: 'document.querySelector(".stage-wrapper").style.animation = "spin 2s linear infinite"'
              }
            ]
          }
        }
      };
    }
    
    // === 核心执行方法 ===
    executeCode(args, util) {
      try {
        const result = eval(args.CODE);
        return result;
      } catch (error) {
        console.error('JS执行错误:', error);
        return 'Error: ' + error.message;
      }
    }
    
    evaluateExpression(args, util) {
      try {
        const result = eval(args.EXPR);
        return String(result);
      } catch (error) {
        return 'Error: ' + error.message;
      }
    }
    
    executeCodeInContext(args, util) {
      try {
        const result = eval(args.CODE);
        this.variables[args.VAR] = result;
      } catch (error) {
        console.error('执行错误:', error);
      }
    }
    
    // === 变量操作 ===
    setVariable(args, util) {
      try {
        this.variables[args.NAME] = JSON.parse(args.VALUE);
      } catch {
        this.variables[args.NAME] = args.VALUE;
      }
    }
    
    getVariable(args, util) {
      const value = this.variables[args.NAME];
      return value !== undefined ? String(value) : 'undefined';
    }
    
    setObjectProperty(args, util) {
      try {
        const obj = this.variables[args.OBJ];
        if (obj && typeof obj === 'object') {
          try {
            obj[args.PROP] = JSON.parse(args.VALUE);
          } catch {
            obj[args.PROP] = args.VALUE;
          }
        }
      } catch (error) {
        console.error('设置属性错误:', error);
      }
    }
    
    // === DOM操作 ===
    manipulateDOM(args, util) {
      try {
        eval(args.OPERATION);
      } catch (error) {
        console.error('DOM操作错误:', error);
      }
    }
    
    getElement(args, util) {
      try {
        const element = document.querySelector(args.SELECTOR);
        if (element) {
          return String(element[args.PROPERTY] || '');
        }
        return 'Element not found';
      } catch (error) {
        return 'Error: ' + error.message;
      }
    }
    
    // === 工具方法 ===
    createAlert(args, util) {
      alert(args.MESSAGE);
    }
    
    createPrompt(args, util) {
      return prompt(args.MESSAGE, args.DEFAULT) || '';
    }
    
    getCurrentTime() {
      return Date.now();
    }
    
    async fetchURL(args, util) {
      try {
        const response = await fetch(args.ADDRESS);
        const data = await response.text();
        return data.substring(0, 1000); // 限制返回长度
      } catch (error) {
        return 'Fetch Error: ' + error.message;
      }
    }
    
    // === 控制方法 ===
    loadScript(args, util) {
      const script = document.createElement('script');
      script.src = args.URL;
      script.onload = () => console.log('Script loaded:', args.URL);
      script.onerror = () => console.error('Failed to load script:', args.URL);
      document.head.appendChild(script);
    }
    
    defineFunction(args, util) {
      try {
        this.functions[args.NAME] = new Function(args.CODE);
      } catch (error) {
        console.error('函数定义错误:', error);
      }
    }
    
    callFunction(args, util) {
      try {
        const func = this.functions[args.NAME];
        if (typeof func === 'function') {
          const argsArray = args.ARGS.split(',').map(arg => {
            const trimmed = arg.trim();
            try {
              return JSON.parse(trimmed);
            } catch {
              return trimmed;
            }
          });
          const result = func.apply(null, argsArray);
          return String(result);
        }
        return 'Function not found';
      } catch (error) {
        return 'Error: ' + error.message;
      }
    }
  }
  
  // 注册扩展
  Scratch.extensions.register(new JavaScriptExecutor());
  
})(Scratch);