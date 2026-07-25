(function(Scratch) {
    'use strict';
  
    if (!Scratch.extensions.unsandboxed) {
      throw new Error('This extension must be ran unsandboxed');
    }
    const vm = Scratch.vm;
  
    class JokeBlocks  {
      getInfo() {
        return {
          id: 'jokeblocks',
          name: 'Wacky Joke Blocks',
          blocks: [
            {
              opcode: 'turbomode_set',
              blockType: Scratch.BlockType.COMMAND,
              text: 'set super crazy cool mode to [ENABLED]',
              arguments: {
                ENABLED: {
                  type: Scratch.ArgumentType.STRING,
                  menu: 'ENABLED_MENU'
                }
              }
            },
            {
                opcode: 'punish',
                blockType: Scratch.BlockType.COMMAND,
                text: 'i punish you to 6 years in turbowarp',
              },
            {
                opcode: 'mynamejeff',
                text: 'what is my name hmmmmmmmmmmmmm',
                blockType: Scratch.BlockType.REPORTER,
              },
              {
                opcode: 'the_truth',
                text: 'T H E T R U T H',
                blockType: Scratch.BlockType.BOOLEAN,
              },
              {
                opcode: 'lie',
                text: 'stinky lier',
                blockType: Scratch.BlockType.BOOLEAN,
              },
              {
                opcode: 'butter',
                blockType: Scratch.BlockType.COMMAND,
                text: 'set butter mode to [ENABLED]',
                arguments: {
                  ENABLED: {
                    type: Scratch.ArgumentType.STRING,
                    menu: 'ENABLED_MENU'
                  }
                }
              },
          ],
          menus: {
            ENABLED_MENU: {
              acceptReporters: true,
              items: ['👍', '👎','when the extension is a joke: 💀']
            }
          }
        };
      }
      turbomode_set(args) {
        vm.setTurboMode(args.ENABLED === '👍');
      }
      the_truth() {
        return 'true';
      }
      lie() {
        return 'false';
      }
      punish() {
        Scratch.redirect('https://turbowarp.org/editor')
      }
      butter(args) {
        vm.setInterpolation(args.ENABLED === '👍');
      }
      mynamejeff(_args, util) {
        return util.target.getName();
      }
    }
    Scratch.extensions.register(new JokeBlocks());
  })(Scratch);