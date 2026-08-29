// Name: Platform Detector
// ID: POTPlatformDetector
// Description: Detects whenever the platform was a Scratch mod or not.
// By: GaiaWindWave90 <https://github.com/gaiawindwave90/>
(function (Scratch) {
    "use strict";
class platformDetector {
    getInfo() {
      return {
        id: 'platformDetector',
        name: 'Platform Detector',
        color1: '#96619A',
        blocks: [
          {
            opcode: 'isPotentiaMod',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Is PotentiaMod?'
          },
		  {
            opcode: 'isGaiaMod',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Is GaiaMod?'
          },
		  {
            opcode: 'isDash',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Is Dash?'
          },
		  {
            opcode: 'isMistWarp',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Is MistWarp?'
          },
		  {
            opcode: 'isElectraMod',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Is ElectraMod?'
          },
		  {
            opcode: 'isPenguinMod',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Is a PenguinMod fork?'
          }
        ]
      };
    }
  
    isPotentiaMod() {
      this.ispot = Scratch.extensions.isPotentiaMod
    ? "true"  : "false";
  return this.ispot
    }
    isGaiaMod() {
      this.isgm = Scratch.extensions.isGaiaMod
    ? "true"  : "false";
  return this.isgm
    }
    isDash() {
      this.isdash = Scratch.extensions.isDash
    ? "true"  : "false";
  return this.isdash
    }
	    isMistWarp() {
      this.ismw = Scratch.extensions.isMistWarp
    ? "true"  : "false";
  return this.ismw
    }
    isElectraMod() {
      this.isem = Scratch.extensions.isElectraMod
    ? "true"  : "false";
  return this.isem
    }
    isPenguinMod() {
      this.ispm = Scratch.extensions.isPenguinMod
    ? "true"  : "false";
  return this.ispm
    }
  }
  
  Scratch.extensions.register(new platformDetector());
})(Scratch);