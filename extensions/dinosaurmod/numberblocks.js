/*
   This extension was made with TurboBuilder and vscode!
   https://turbobuilder.vercel.app/
*/
(function(Scratch) {
  const variables = {};

  let NumberblocksMenu = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '35',
    '36',
    '40',
    '42',
    '45',
    '48',
    '49',
    '54',
    '50',
    '56',
    '60',
    '63',
    '64',
    '70',
    '72',
    '80',
    '81',
    '90',
    '100',
    '200',
    '300',
    '1000',
    '7000',
    '10000',
    '90000',
    '100000',
    '1000000',
    '10000000',
    '100000000',
    '1000000000',
  ];

  class Extension {
      getInfo() {
          return {
              "blockIconURI": "data:image/png;base64,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",
              "id": "numberblocks",
              "name": "Numberblocks",
              "color1": "#ff0000",
              "color2": "#c70000",
              "blocks": [
                {
                  opcode: 'numberblockcringe',
                  blockType: Scratch.BlockType.BOOLEAN,
                  text: 'is numberblocks cringe?',
                  disableMonitor: true,
                  hideFromPalette: true
                },
                {
                  opcode: 'numberblockinteger',
                  blockType: Scratch.BlockType.BOOLEAN,
                  text: 'is numberblocks ever gonna have non-integer numbers?',
                  disableMonitor: true,
                  hideFromPalette: true
                },
                {
                  opcode: 'numberblockcom',
                  blockType: Scratch.BlockType.BOOLEAN,
                  text: 'does numberblocks have a nice community?',
                  disableMonitor: true,
                  hideFromPalette: true
                },
                //"---",
                {
                  opcode: 'numberblockoriginal',
                  blockType: Scratch.BlockType.REPORTER,
                  text: 'does number [INPUT] exist in numberblocks?',
                  disableMonitor: true,
                  arguments: {
                    INPUT: {
                      type: Scratch.ArgumentType.STRING,
                      defaultValue: '1'
                    }
                  }
                },
                {
                  opcode: 'numbermenu',
                  blockType: Scratch.BlockType.REPORTER,
                  text: '[NUMORI]',
                  disableMonitor: true,
                  arguments: {
                    NUMORI: {
                      type: Scratch.ArgumentType.STRING,
                      menu: 'NUMORI_MENU'
                    }
                  }
                },
              ],
              menus: {
                NUMORI_MENU: {
                  acceptReporters: true,
                  items: NumberblocksMenu
                }
              }
          };
      }
      numberblockcringe() {
        return true
      }
      numberblockinteger() {
        return "no, they most likely wont."
      }
      numberblockcom() {
        return "no, mostly toxic."
      }
      numberblockoriginal(args) {
        if (!NumberblocksMenu.includes(args.INPUT)) {
          // `args.INPUT` is not any of the input in the `NumberblocksMenu` array
          return "false"
        } else {
          return "true"
        }
      }
      numbermenu(args) {
        return args.NUMORI;
      }
  }

  Scratch.extensions.register(new Extension());
})(Scratch);