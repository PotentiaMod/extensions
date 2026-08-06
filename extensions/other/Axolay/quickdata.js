//NAME: quickdata
//quickly store and read data for multiple objects


(function (Scratch) {
  'use strict';

    const data = {};

  class MyExtension {
    getInfo() {
      return {
        id: 'gaquickdata', // ID used in the URL, must be unique
        name: 'Quickdata', // Display name
        color1: '#8084FF', // Block color
        color2: '#696effff', // Outline color
        color3: '#585effff', // Text highlight color
        blocks: [
          {
            opcode: 'set',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set [NUMBER] to [VAL] in list [ID]',
            arguments: {
                NUMBER: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: 0
                },
                VAL: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: 'cat'
                },
                ID: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: 0
                },
            }
          },
          {
            opcode: 'get',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get [NUMBER] from list [ID]',
            arguments: {
              NUMBER: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'export',
            blockType: Scratch.BlockType.REPORTER,
            text: 'all data in [TYPE]',
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'export'
              }
            }
          }
        ],
        menus: {
          export: {
            acceptReporters: true,
            items: ['JSON (raw)', 'array']
          }
        }
      };
    }

    set({NUMBER, VAL, ID}) {
        if(!data[ID]) {data[ID] = {}}
        data[ID][NUMBER] = VAL
    }

    get({NUMBER, ID}) {
      if(!data[ID]) return ''
      if(!(NUMBER in data[ID])) return ''
        return data[ID][NUMBER]
    }

    export({TYPE}) {
      if(TYPE === 'JSON (raw)') {
        return JSON.stringify(data)
      } else if(TYPE === 'array') {
        let output = [];
        Object.values(data).forEach(list => {
            Object.values(list).forEach(value => {
                output.push(value);
            });
        });
        return output;
      }
    }
  }

  Scratch.extensions.register(new MyExtension());
})(Scratch);
