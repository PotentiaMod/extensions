(async function(Scratch) {
          const variables = {};
          const blocks = [];
          const menus = [];
      
          class GaiaLooks {
              getInfo() {
                  return {
                      "id": "alert",
                      "name": "Alert",
                      "color1": "#B700FF",
                      "blocks": blocks
                  }
              }   
      }
      blocks.push({
        blockType: Scratch.BlockType.COMMAND,
        text: 'send alert',
        opcode: 'sendalert',
        arguments: {}
      });
      GaiaLooks.prototype['sendalert'] = async (args, util) => {
        alert("PenguinMod is a jerk.");
      };
      Scratch.extensions.register(new GaiaLooks());
      })(Scratch);