(function(Scratch) {
  const variables = {};

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("TurboBuilder must run unsandboxed");
  }

  class Extension {
      getInfo() {
          return {
              id: "Turbobuilder",
              name: "TurboBuilder",
              color1: "#ff6680",
              blocks: [
                  {
                    blockType: Scratch.BlockType.LABEL,
                    text: 'Main'
                  },
                  {
                    func: 'JScodeClipboard',
                    blockType: Scratch.BlockType.BUTTON,
                    text: 'copy extension code to clipboard'
                  },
                  {
                    opcode: 'TurboBuilder_JScode',
                    func: 'JScode',
                    text: 'extension code',
                    color1: '#666666',
                    color2: '#4d4d4d',
                    color3: '#4d4d4d',
                    blockType: Scratch.BlockType.REPORTER,
                  },
                  "---",
                  {
                    opcode: 'TurboBuilder_RawStringBlock',
                    func: 'RawStringBlock',
                    text: 'raw [TEXT]',
                    color1: '#666666',
                    color2: '#4d4d4d',
                    color3: '#4d4d4d',
                    blockType: Scratch.BlockType.COMMAND,
                    arguments: {
                      TEXT: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "string"
                      },
                    }
                  },
                  {
                    opcode: 'TurboBuilder_RawString',
                    func: 'RawString',
                    text: 'raw [TEXT]',
                    color1: '#666666',
                    color2: '#4d4d4d',
                    color3: '#4d4d4d',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                      TEXT: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "string"
                      },
                    }
                  },
                  "---",
                  {
                    opcode: 'TurboBuilder_returnValue',
                    func: 'returnValue',
                    text: 'return [TEXT]',
                    color1: '#666666',
                    color2: '#4d4d4d',
                    color3: '#4d4d4d',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                      TEXT: {
                        type: Scratch.ArgumentType.EMPTY,
                      },
                    }
                  },
                  {
                    opcode: 'TurboBuilder_String',
                    func: 'String',
                    text: '\'[TEXT]\'',
                    color1: '#666666',
                    color2: '#4d4d4d',
                    color3: '#4d4d4d',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                      TEXT: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "string"
                      },
                    }
                  },
                  {
                    opcode: 'TurboBuilder_Number',
                    func: 'Number',
                    text: '\([NUMBER]\)',
                    color1: '#666666',
                    color2: '#4d4d4d',
                    color3: '#4d4d4d',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                      NUMBER: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: "0"
                      },
                    }
                  },
                  {
                    blockType: Scratch.BlockType.LABEL,
                    text: 'Events'
                  },
                  {
                    opcode: 'TurboBuilder_EverySecDo',
                    func: 'EverySecDo',
                    color1: '#ffbf00',
                    color2: '#cc9900',
                    color3: '#cc9900',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'every [NUM] seconds do [TEXT]',
                    arguments: {
                      NUM: {
                        type: Scratch.ArgumentType.EMPTY,
                      },
                      TEXT: {
                        type: Scratch.ArgumentType.EMPTY,
                      },
                    }
                  },
                  {
                    opcode: 'TurboBuilder_InSecDo',
                    func: 'InSecDo',
                    color1: '#ffbf00',
                    color2: '#cc9900',
                    color3: '#cc9900',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'in [NUM] seconds do [TEXT]',
                    arguments: {
                      NUM: {
                        type: Scratch.ArgumentType.EMPTY,
                      },
                      TEXT: {
                        type: Scratch.ArgumentType.EMPTY,
                      },
                    }
                  },
                  {
                    blockType: Scratch.BlockType.LABEL,
                    text: 'Control'
                  },
                  {
                    opcode: 'TurboBuilder_WaitForMS',
                    func: 'WaitForMS',
                    color1: '#ffab19',
                    color2: '#cf8b17',
                    color3: '#cf8b17',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'wait [NUM] \(ms\)',
                    arguments: {
                      NUM: {
                        type: Scratch.ArgumentType.EMPTY,
                      },
                    }
                  },
                  {
                    opcode: 'TurboBuilder_WaitUntil',
                    func: 'WaitUntil',
                    color1: '#ffab19',
                    color2: '#cf8b17',
                    color3: '#cf8b17',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'wait until [NUM]',
                    arguments: {
                      NUM: {
                        type: Scratch.ArgumentType.EMPTY,
                      },
                    }
                  },
                  {
                    blockType: Scratch.BlockType.LABEL,
                    text: 'Sensing'
                  },
                  {
                    opcode: 'TurboBuilder_KeyPressedBlock',
                    func: 'KeyPressedBlock',
                    color1: '#5cb1d6',
                    color2: '#2e8eb8',
                    color3: '#2e8eb8',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'if key [KEY] pressed than do [TEXT]',
                    arguments: {
                      KEY: {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'KEY_MENU'
                      },
                      TEXT: {
                        type: Scratch.ArgumentType.EMPTY,
                      },
                    }
                  },
                  {
                    opcode: 'TurboBuilder_KeyPressed',
                    func: 'KeyPressed',
                    color1: '#5cb1d6',
                    color2: '#2e8eb8',
                    color3: '#2e8eb8',
                    hideFromPalette: true,
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'key [KEY] pressed',
                    arguments: {
                      KEY: {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'KEY_MENU'
                      },
                    }
                  },
                  {
                    blockType: Scratch.BlockType.LABEL,
                    text: 'Functions'
                  },
                  {
                    opcode: 'TurboBuilder_Setup',
                    func: 'Setup',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set up extension [ID] [NAME] [COLOR1]',
                    arguments: {
                      ID: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'ID'
                      },
                      NAME: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'EXTENSION NAME'
                      },
                      COLOR1: {
                        type: Scratch.ArgumentType.COLOR,
                        defaultValue: '#000000'
                      },
                    }
                  },
                  {
                    opcode: 'TurboBuilder_createblock',
                    func: 'createblock',
                    text: 'create block / id [ID] text [TEXT] blockType: [BLOCKTYPE_MENU] function: [FUNCTION]',
                    blockType: Scratch.BlockType.COMMAND,
                    arguments: {
                      ID: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "ID"
                      },
                      TEXT: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'text'
                      },
                      BLOCKTYPE_MENU: {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'BLOCKTYPE_MENU'
                      },
                      FUNCTION: {
                        type: Scratch.ArgumentType.EMPTY,
                      },
                    },
                  },/*
                  {
                    opcode: 'TurboBuilder_addFunctionality',
                    func: 'addFunctionality',
                    text: 'add function [FUNCTIONALITY] / BlockID [BLOCKID]',
                    blockType: Scratch.BlockType.COMMAND,
                    hideFromPalette: false,
                    arguments: {
                      FUNCTIONALITY: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'return true;',
                      },
                      BLOCKID: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'ID'
                      },
                    },
                  },*/
                  {
                    opcode: 'TurboBuilder_addInput',
                    func: 'addInput',
                    text: 'add Input / Parent: [BlockID], ID: [ID] DefaultValue: [TEXT] / ArgumentType: [ARGUMENU]',
                    blockType: Scratch.BlockType.COMMAND,
                    hideFromPalette: true,
                    arguments: {
                      BlockID: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'ID'
                      },
                      ID: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'ID'
                      },
                      TEXT: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'text'
                      },
                      ARGUMENU: {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'ARGUMENU'
                      },
                    }
                  },
                  "---",
                  {
                    opcode: 'TurboBuilder_functionid',
                    func: 'functionid',
                    text: 'function id [ID] function [TEXT]',
                    blockType: Scratch.BlockType.COMMAND,
                    arguments: {
                      ID: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: "ID"
                      },
                      TEXT: {
                        type: Scratch.ArgumentType.EMPTY,
                      },
                    },
                  },
                  {
                    opcode: 'TurboBuilder_CallID',
                    func: 'CallID',
                    text: 'call [ID]',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                      ID: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: ''
                      },
                    }
                  },
                  {
                    opcode: 'TurboBuilder_CallIDBlock',
                    func: 'CallIDBlock',
                    text: 'call [ID]',
                    blockType: Scratch.BlockType.COMMAND,
                    arguments: {
                      ID: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: ''
                      },
                    }
                  },
              ],
              menus: {
                ARGUMENU: {
                  acceptReporters: false,
                  items: [
                    { text: "string", value: "STRING" },
                    { text: "number", value: "NUMBER" },
                    { text: "boolean", value: "BOOLEAN" },
                    { text: "empty", value: "EMPTY" },
                    { text: "color", value: "COLOR" },
                  ]
                },
                BLOCKTYPE_MENU: {
                  acceptReporters: false,
                  items: [
                    { text: "command", value: "COMMAND" },
                    { text: "reporter", value: "REPORTER" },
                    { text: "boolean", value: "BOOLEAN" },
                    { text: "hat", value: "HAT" },
                  ]
                },
                KEY_MENU: {
                  acceptReporters: false,
                  items: [
                    { text: "a", value: "a" },
                    { text: "b", value: "b" },
                    { text: "c", value: "c" },
                    { text: "d", value: "d" },
                    { text: "e", value: "e" },
                    { text: "f", value: "f" },
                    { text: "g", value: "g" },
                    { text: "h", value: "h" },
                    { text: "i", value: "i" },
                    { text: "j", value: "j" },
                    { text: "k", value: "k" },
                    { text: "l", value: "l" },
                    { text: "m", value: "m" },
                    { text: "n", value: "n" },
                    { text: "o", value: "o" },
                    { text: "p", value: "p" },
                    { text: "q", value: "q" },
                    { text: "r", value: "r" },
                    { text: "s", value: "s" },
                    { text: "t", value: "t" },
                    { text: "u", value: "u" },
                    { text: "v", value: "v" },
                    { text: "w", value: "w" },
                    { text: "x", value: "x" },
                    { text: "y", value: "y" },
                    { text: "z", value: "z" },
                    { text: "0", value: "0" },
                    { text: "1", value: "1" },
                    { text: "2", value: "2" },
                    { text: "3", value: "3" },
                    { text: "4", value: "4" },
                    { text: "5", value: "5" },
                    { text: "6", value: "6" },
                    { text: "7", value: "7" },
                    { text: "8", value: "8" },
                    { text: "9", value: "9" },
                  ]
                },
              }
          };
      }
      _Clear() {
        localStorage.setItem("SAVE-EXT-" + "LatestInputID", 'Blank');
        localStorage.setItem("SAVE-EXT-" + "LatestInputArgument", 'Blank');
        localStorage.setItem("SAVE-EXT-" + "LatestInputText", 'Blank');
      }
      Setup(args, util) {
        this._Clear()
        const ID = args.ID;
        const ExtName = args.NAME;
        const color1 = args.COLOR1;
        localStorage.setItem("SAVE-EXT-" + "ID", ID)
        localStorage.setItem("SAVE-EXT-" + "ExtName", ExtName)
        localStorage.setItem("SAVE-EXT-" + "color1", color1)
        const Script = `(async function(Scratch) {
          const variables = {};
          const blocks = [];
          const menus = [];
      
          class Extension {
              getInfo() {
                  return {
                      "id": "${ID}",
                      "name": "${ExtName}",
                      "color1": "${color1}",
                      "blocks": blocks
                  }
              }   
      }
      `;
      localStorage.setItem("SAVE-EXT-" + "JS", Script)
        
      }
      JScode(args, util){
        return localStorage.getItem("SAVE-EXT-" + "JS") + `Scratch.extensions.register(new Extension());
})(Scratch);`
      }
      JScodeClipboard() {
        let JScode = localStorage.getItem("SAVE-EXT-" + "JS") + `Scratch.extensions.register(new Extension());
      })(Scratch);`
        navigator.clipboard.writeText(JScode);
      }
      createblock(args, util) {
        const BlockID = args.ID;
        const BlockText = args.TEXT;
        const BlockType = args.BLOCKTYPE_MENU;
        const Function = args.FUNCTION;

        const Script = `blocks.push({
        blockType: Scratch.BlockType.${BlockType},
        text: '${BlockText}',
        opcode: '${BlockID}',
        arguments: {}
      });
      Extension.prototype['${BlockID}'] = async (args, util) => {
        ${Function}
      };
      `;
      const LocalStorage_JS = localStorage.getItem("SAVE-EXT-" + "JS");
      localStorage.setItem("SAVE-EXT-" + "JS", LocalStorage_JS + Script);
      }
      addFunctionality(args, util){
        let LocalStorage_JS = localStorage.getItem("SAVE-EXT-" + "JS");
        let BlockID = args.BLOCKID;
        let Function = args.FUNCTIONALITY;
        let [ firstPart, middlePart, secondPart ] = this._splitByTwo(LocalStorage_JS, `Extension.prototype['${BlockID}'] = (args, util) => {
          `, `};`)
        let AfterMath = (firstPart + Function + secondPart)
        localStorage.setItem("SAVE-EXT-" + "JS", AfterMath);
      }
      addInput(args, util) {
        /*
        let Script1 = `"${LatestInputID}": {
            type: Scratch.ArgumentType.${LatestInputArgument},
            defaultValue: '${LatestInputText}',
          },
        `;*/
        const BlockID = args.BlockID
        const InputID = args.ID
        const InputArgument = args.ARGUMENU
        const InputTEXT = args.TEXT
        const Script = `"${InputID}": {
          type: Scratch.ArgumentType.${InputArgument},
          defaultValue: '${InputTEXT}',
        }`;
        const Part1 = `opcode: '${BlockID}',
        arguments: {`
        const Part2 = `}
      });
      Extension`
        const [ firstPart, middlePart, secondPart ] = this._splitByTwo(LocalStorage_JS, Part1, Part2)
        const AfterMath = (firstPart + Script + secondPart)
        const LocalStorage_JS = localStorage.getItem("SAVE-EXT-" + "JS");
        localStorage.setItem("SAVE-EXT-" + "JS", AfterMath);
      }
      functionid(args, util) {
        const FunctionID = args.ID;
        const FunctionScript = args.TEXT;

        const Script = `function ${FunctionID} {
          ${FunctionScript}
        }
      `;
      const LocalStorage_JS = localStorage.getItem("SAVE-EXT-" + "JS");
      localStorage.setItem("SAVE-EXT-" + "JS", LocalStorage_JS + Script);
      }
      EverySecDo(args, util){

        const Numeric = args.NUM;
        const Command = args.TEXT;

        const Script = `setInterval(async () => {
          ${Command}
        }, (${Numeric} * 1000));\n`;
      const LocalStorage_JS = localStorage.getItem("SAVE-EXT-" + "JS");
      localStorage.setItem("SAVE-EXT-" + "JS", LocalStorage_JS + Script);
      }
      InSecDo(args, util){
        const Numeric = args.NUM;
        const Command = args.TEXT;
        return (`setTimeout(async () => {
          ${Command}
        }, (${Numeric} * 1000))\n`)
      }
      WaitForMS(args, util){
        const Numeric = args.NUM;
        return (`await new Promise(resolve => setTimeout(resolve, ${Numeric}))\n`)
      }
      WaitUntil(args, util){
        const BOOLEAN = args.NUM;
        return (`await new Promise(resolve => {
          let x = setInterval(() => {
              if (${BOOLEAN}) {
                  clearInterval(x);
                  resolve()
              }
          }, 50)
      })\n`)
      }
      RawStringBlock(args, util){
        const Command = args.TEXT;
        const Script = `${Command};\n`;
        const LocalStorage_JS = localStorage.getItem("SAVE-EXT-" + "JS");
        localStorage.setItem("SAVE-EXT-" + "JS", LocalStorage_JS + Script);
      }
      RawString(args, util){
        return args.TEXT
      }
      returnValue(args, util){
        return ("return " + args.TEXT + ";\n")
      }
      String(args, util){
        return ("\'" + args.TEXT + "\'")
      }
      Number(args, util){
        return args.NUMBER
      }
      CallID(args, util){
        return args.ID + "()\n"
      }
      CallIDBlock(args, util){
        const Command = args.ID;
        const Script = `${Command}();\n`;
        const LocalStorage_JS = localStorage.getItem("SAVE-EXT-" + "JS");
        localStorage.setItem("SAVE-EXT-" + "JS", LocalStorage_JS + Script);
      }
      KeyPressedBlock(args, util){
        const Key = args.KEY;
        const Command = args.TEXT;
        const Script = `document.addEventListener("keypress", event => {
          if (event.key == '${Key}') { ${Command} }
      })\n`
        const LocalStorage_JS = localStorage.getItem("SAVE-EXT-" + "JS");
        localStorage.setItem("SAVE-EXT-" + "JS", LocalStorage_JS + Script);
      }
      KeyPressed(args, util){
        const Key = args.KEY;
        const Script = `document.addEventListener("keypress", event => {
          if (event.key == '${Key}') { return true; } else { return false; }
      })\n`
        return Script
      }
      _splitByTwo(input, splitValue1, splitValue2) {
        // Find the indices of the split values in the input
        let splitIndex1 = input.indexOf(splitValue1);
        let splitIndex2 = input.indexOf(splitValue2);
    
        // Check if both split values are found in the input
        if (splitIndex1 !== -1 && splitIndex2 !== -1) {
            // Determine the starting and ending indices for the split
            let startIndex = Math.min(splitIndex1, splitIndex2);
            let endIndex = Math.max(splitIndex1 + String(splitValue1).length, splitIndex2 + String(splitValue2).length);
    
            // Split the input into two parts based on the specified values
            let firstPart = input.slice(0, startIndex);
            let middlePart = input.slice(startIndex, endIndex);
            let secondPart = input.slice(endIndex);
    
            return [firstPart, middlePart, secondPart];
        } else {
            // Handle case where one or both split values are not found
            return "One or both split values not found in the input.";
        }
      }
  }

  Scratch.extensions.register(new Extension());
})(Scratch);