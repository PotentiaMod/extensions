(function (Scratch) {
    "use strict";
class PotentiaModDetector {
    getInfo() {
      return {
        id: 'potentiaModDetector',
        name: 'PotentiaMod Detector',
        color1: '#4800cc',
        blocks: [
          {
            opcode: 'isPotentiaMod',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Is PotentiaMod?'
          }
        ]
      };
    }
  
    isPotentiaMod() {
      this.ispot = Scratch.extensions.isPotentiaMod
    ? "true"  : "false";
  return this.ispot
  
    }
  }
  
  Scratch.extensions.register(new PotentiaModDetector());
})(Scratch);