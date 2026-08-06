(function (Scratch) {
  'use strict';

  let calledFunctions = []
  let FunctionArguments = []

  class AxoLuaModding {


    getInfo() {
      return {
        id: 'AxoLuaModding', // ID used in the URL, must be unique
        name: 'Lua Modding', // Display name
        color1: '#000080', // Block color
        color2: '#0000b4', // Outline color
        color3: '#00003a', // Text highlight color
        blocks: [
          {
            opcode: 'createFunction',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create function [FUNCTION]',
            arguments: {
              FUNCTION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "function"
              }
            }
          },
          {
            opcode: 'onFunctionCall',
            blockType: Scratch.BlockType.HAT,
            text: 'when [FUNCTION] gets called',
            arguments: {
              FUNCTION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "function"
              }
            }
          },
          {
            opcode: 'getCancer',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get cancer'
          }
        ]
      };
    }

    createFunction({FUNCTION}) {
      calledFunctions.push(FUNCTION)
    }

    getCancer() {
      return calledFunctions
    }

    onFunctionCall({ FUNCTION }) {
      for(let i = 0; i < calledFunctions.length; i++) {
        if(calledFunctions[i] === FUNCTION) {  
          
            calledFunctions.splice(i, 1)

          return true
        }  else {
          return false
        }
      };
    }
  }

  Scratch.extensions.register(new AxoLuaModding());
})(Scratch);
