(function(Scratch) {
  'use strict';

  class ColorValidator {
    constructor() {
      this.lastGeneratedColor = '#000000';
    }

    getInfo() {
      return {
        id: 'colorvalidator',
        name: 'Color Validator',
        blocks: [
          {
            opcode: 'isVisibleColor',
            blockType: Scratch.BlockType.REPORTER,
            text: 'is [HEX] a visible color?',
            arguments: {
              HEX: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#FF5733'
              }
            }
          },
          {
            opcode: 'generateRandomColor',
            blockType: Scratch.BlockType.COMMAND,
            text: 'generate random color'
          },
          {
            opcode: 'getGeneratedColor',
            blockType: Scratch.BlockType.REPORTER,
            text: 'generated color'
          }
        ]
      };
    }

    isVisibleColor(args) {
      let hex = args.HEX.trim();

      // Remove # if present
      if (hex.startsWith('#')) {
        hex = hex.substring(1);
      }

      // Check if it's a valid hex format (3 or 6 characters, only 0-9 and A-F)
      if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(hex)) {
        return false;
      }

      // Expand 3-digit hex to 6-digit
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }

      // Convert hex to RGB values
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      // Check if the color appears as black (all RGB values are 0)
      if (r === 0 && g === 0 && b === 0) {
        return false;
      }

      // Valid hex code that's not black
      return true;
    }

    generateRandomColor() {
      // Generate random RGB values
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);

      // Convert to hex and pad with zeros if needed
      const hexR = r.toString(16).padStart(2, '0');
      const hexG = g.toString(16).padStart(2, '0');
      const hexB = b.toString(16).padStart(2, '0');

      // Store the generated color
      this.lastGeneratedColor = '#' + hexR + hexG + hexB;
    }

    getGeneratedColor() {
      return this.lastGeneratedColor;
    }
  }

  Scratch.extensions.register(new ColorValidator());
})(Scratch);