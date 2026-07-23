/*
   This extension was 10% made with TurboBuilder!
   https://turbobuilder.vercel.app/
*/

// name: Wait Block Expansion
// description: just more wait blocks, i guess..

(function(Scratch) {
  const variables = {};

  const WaitFacts = [
    '1000 Milliseconds = 1 Second',
    '60 Seconds = 1 Minute',
    '100 Seconds = 1 Minute and 40 Seconds',
    '60 Minutes = 1 Hour',
    '24 Hours = 1 Day',
    '7 Day = 1 Week',
    '4 Weeks = 1 Month',
    '12 Months = 1 Year',
    '10 Years = 1 Decade',
    '10 Decades = 1 Century',
  ];
  let DAYMENU = [
    'days',
    'weeks',
    'months'
  ];
  let MATHMENU = [
    'plus',
    'minus',
    'times',
    'divided by',
    'to the power of'
  ];

  class Extension {
      getInfo() {
          return {
              id: "WAITEXPAND",
              name: "Wait Block Expansion",
              color1: "#ffab19",
              color2: "#cc7800",
              blocks: [
                {
                  blockType: "label",
                  text: "WARNING: BLOCKS MIGHT NOT WORK",
                },
                {
                  opcode: 'wait_m_secs',
                  text: 'wait [INPUT] milliseconds',
                  blockType: Scratch.BlockType.COMMAND,
                  arguments: {
                    INPUT: {
                      type: Scratch.ArgumentType.NUMBER,
                      defaultValue: '1000'
                    }
                  }
                },
                {
                  opcode: 'wait_mins',
                  text: 'wait [MINS] minutes',
                  blockType: Scratch.BlockType.COMMAND,
                  arguments: {
                    MINS: {
                      type: Scratch.ArgumentType.NUMBER,
                      defaultValue: '1'
                    }
                  }
                },
                {
                  opcode: 'wait_hour',
                  text: 'wait [HOUR] hours',
                  blockType: Scratch.BlockType.COMMAND,
                  arguments: {
                    HOUR: {
                      type: Scratch.ArgumentType.NUMBER,
                      defaultValue: '1'
                    }
                  }
                },
                {
                  opcode: 'wait_abit',
                  text: 'wait [RTYPE] [DAYMENU]',
                  blockType: Scratch.BlockType.COMMAND,
                  arguments: {
                    RTYPE: {
                      type: Scratch.ArgumentType.NUMBER,
                      defaultValue: '1'
                    },
                    DAYMENU: {
                      type: Scratch.ArgumentType.STRING,
                      menu: 'DAYMENU'
                    },
                  }
                },
                "---",
                {
                  opcode: 'wait_funfact',
                  text: 'a rule about time',
                  disableMonitor: true,
                  blockType: Scratch.BlockType.REPORTER,
                },
                "---",
                {
                  blockType: Scratch.BlockType.XML,
                  xml: '<block type="control_wait"><value name="DURATION"><shadow type="text"><field name="TEXT">Infinity</field></shadow></value></block>',
                },
                {
                  opcode: 'wait_divided',
                  text: 'wait [INPUT1] seconds divided by [INPUT2]',
                  blockType: Scratch.BlockType.COMMAND,
                  hideFromPalette: true,
                  arguments: {
                    INPUT1: {
                      type: Scratch.ArgumentType.NUMBER,
                      defaultValue: '10'
                    },
                    INPUT2: {
                      type: Scratch.ArgumentType.NUMBER,
                      defaultValue: '2'
                    }
                  }
                },
                {
                  opcode: 'wait_math',
                  text: 'wait [input1] seconds [MATHMENU] [input2]',
                  blockType: Scratch.BlockType.COMMAND,
                  arguments: {
                    input1: {
                      type: Scratch.ArgumentType.NUMBER,
                      defaultValue: '1'
                    },
                    MATHMENU: {
                      type: Scratch.ArgumentType.STRING,
                      menu: 'MATHMENU'
                    },
                    input2: {
                      type: Scratch.ArgumentType.NUMBER,
                      defaultValue: '2'
                    }
                  }
                },
              ],
              menus: {
                DAYMENU: {
                  acceptReporters: false,
                  items: DAYMENU
                },
                MATHMENU: {
                  acceptReporters: false,
                  items: MATHMENU
                },
              }
          };
      }
      wait_m_secs (args) {
        return new Promise((resolve, reject) => {
          const timeInMilliseconds = args.INPUT * 0.9;
          setTimeout(() => {
            resolve();
          }, timeInMilliseconds);
        });
      }
      wait_mins (args) {
        return new Promise((resolve, reject) => {
          const timeInMinutes = args.MINS * 60000;
          setTimeout(() => {
            resolve();
          }, timeInMinutes);
        });
      }
      wait_hour (args) {
        return new Promise((resolve, reject) => {
          const timeInHours = args.HOUR * 3600000;
          setTimeout(() => {
            resolve();
          }, timeInHours);
        });
      }
      wait_abit (args) {
        if ((args.DAYMENU) === 'days') {
        return new Promise((resolve, reject) => {
          const timeInABit = args.RTYPE * 86400000;
          setTimeout(() => {
            resolve();
          }, timeInABit);
        });
      } else if ((args.DAYMENU) === 'weeks') {
        return new Promise((resolve, reject) => {
          const timeInABit2 = args.RTYPE * 604800000;
          setTimeout(() => {
            resolve();
          }, timeInABit2);
        });
      } else if ((args.DAYMENU) === 'months') {
        return new Promise((resolve, reject) => {
          const timeInABit3 = args.RTYPE * 2600640000;
          setTimeout(() => {
            resolve();
          }, timeInABit3);
        });
      }
      }
      wait_funfact () {
        const error404 = 'something went wrong.'
        const change = Math.floor(Math.random() * 10) + 1
        if ((change) === 1) {
          return '1000 Milliseconds = 1 Second'
        } else if ((change) === 2) {
          return '60 Seconds = 1 Minute'
        } else if ((change) === 3) {
          return '100 Seconds = 1 Minute and 40 Seconds'
        } else if ((change) === 4) {
          return '60 Minutes = 1 Hour'
        } else if ((change) === 5) {
          return '24 Hours = 1 Day'
        } else if ((change) === 6) {
          return '7 Day = 1 Week'
        } else if ((change) === 7) {
          return '4.4 Weeks = 1 Month'
        } else if ((change) === 8) {
          return '12 Months = 1 Year'
        } else if ((change) === 9) {
          return '10 Years = 1 Decade'
        } else if ((change) === 10) {
          return '10 Decades = 1 Century'
        } else {
          return error404
        }
      }
      wait_divided (args) {
        return new Promise((resolve, reject) => {
          const timeInMilliseconds = (args.INPUT1 * 1000) / args.INPUT2;
          setTimeout(() => {
            resolve();
          }, timeInMilliseconds);
        });
      }
      wait_math (args) {
        switch (args.MATHMENU) {
          case 'plus':
            return new Promise((resolve, reject) => {
              const timeInMilliseconds = (args.input1 + args.input2) * 1000;
              setTimeout(() => {
                resolve();
              }, timeInMilliseconds);
            });
          case 'minus':
            return new Promise((resolve, reject) => {
              const timeInMilliseconds = (args.input1 - args.input2) * 1000;
              setTimeout(() => {
                resolve();
              }, timeInMilliseconds);
            });
          case 'times':
            return new Promise((resolve, reject) => {
              const timeInMilliseconds = (args.input1 * args.input2) * 1000;
              setTimeout(() => {
                resolve();
              }, timeInMilliseconds);
            });
          case 'divided by':
            return new Promise((resolve, reject) => {
              const timeInMilliseconds = (args.input1 / args.input2) * 1000;
              setTimeout(() => {
                resolve();
              }, timeInMilliseconds);
            });
          case 'to the power of':
            return new Promise((resolve, reject) => {
              const timeInMilliseconds = (args.input1 ** args.input2) * 1000;
              setTimeout(() => {
                resolve();
              }, timeInMilliseconds);
            });
          default:
            return new Promise((resolve, reject) => {
              const timeInMilliseconds = (args.input1 * 1000);
              setTimeout(() => {
                resolve();
              }, timeInMilliseconds);
            });
        }
      }
  }

  Scratch.extensions.register(new Extension());
})(Scratch);