(function(Scratch) {
  'use strict';

  class CustomBlocks {
    getInfo() {
      return {
        id: 'customblocks',
        name: 'Custom Blocks',
        color1: '#FF6680',
        color2: '#FF4D6A',
        color3: '#FF3355',
        blocks: [
          {
            opcode: 'checkTextOrNumber',
            blockType: Scratch.BlockType.CONDITIONAL,
            branchCount: 2,
            text: 'if [VALUE] has text',
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello'
              }
            }
          },
          {
            opcode: 'percentageDifference',
            blockType: Scratch.BlockType.REPORTER,
            text: 'percentage difference between [VALUE1] and [VALUE2]',
            arguments: {
              VALUE1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 500
              },
              VALUE2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1200
              }
            }
          },
          {
            opcode: 'ratingOutOf10',
            blockType: Scratch.BlockType.REPORTER,
            text: 'rating out of 10 for [INPUT] vs [TARGET]',
            arguments: {
              INPUT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 500
              },
              TARGET: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 510
              }
            }
          },
          {
            opcode: 'secondsFromRating',
            blockType: Scratch.BlockType.REPORTER,
            text: 'seconds for [INPUT] vs [TARGET]',
            arguments: {
              INPUT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 500
              },
              TARGET: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 510
              }
            }
          }
        ]
      };
    }

    checkTextOrNumber(args) {
      const value = String(args.VALUE);
      
      // Check if the value contains any non-numeric characters (excluding decimal point and negative sign)
      const hasText = /[^0-9.\-]/.test(value);
      
      return hasText;
    }

    percentageDifference(args) {
      const val1 = Number(args.VALUE1);
      const val2 = Number(args.VALUE2);
      
      if (val2 === 0) return 0;
      
      const difference = Math.abs(val2 - val1);
      const percentage = (difference / val2) * 100;
      
      return Math.round(percentage * 100) / 100; // Round to 2 decimal places
    }

    ratingOutOf10(args) {
      const input = Number(args.INPUT);
      const target = Number(args.TARGET);
      
      if (target === 0) return 1; // Avoid division by zero
      
      const difference = Math.abs(target - input);
      // Calculate percentage based on the target value
      const percentDiff = (difference / Math.abs(target)) * 100;
      
      // Convert percentage difference to a rating (lower difference = higher rating)
      // 0% difference = 10, larger differences = lower ratings
      let rating;
      if (percentDiff <= 2) {
        rating = 10;
      } else if (percentDiff <= 5) {
        rating = 9;
      } else if (percentDiff <= 10) {
        rating = 8;
      } else if (percentDiff <= 20) {
        rating = 7;
      } else if (percentDiff <= 30) {
        rating = 6;
      } else if (percentDiff <= 50) {
        rating = 5;
      } else if (percentDiff <= 75) {
        rating = 4;
      } else if (percentDiff <= 100) {
        rating = 3;
      } else if (percentDiff <= 200) {
        rating = 2;
      } else {
        rating = 1;
      }
      
      return rating;
    }

    secondsFromRating(args) {
      const rating = this.ratingOutOf10(args);
      
      // Map rating to seconds (lower rating = more seconds)
      const secondsMap = {
        10: Math.floor(Math.random() * 4) + 5,  // 5-8 seconds
        9: Math.floor(Math.random() * 4) + 5,   // 5-8 seconds
        8: Math.floor(Math.random() * 6) + 10,  // 10-15 seconds
        7: Math.floor(Math.random() * 6) + 15,  // 15-20 seconds
        6: Math.floor(Math.random() * 6) + 20,  // 20-25 seconds
        5: Math.floor(Math.random() * 11) + 30, // 30-40 seconds
        4: Math.floor(Math.random() * 11) + 40, // 40-50 seconds
        3: Math.floor(Math.random() * 11) + 50, // 50-60 seconds
        2: Math.floor(Math.random() * 11) + 60, // 60-70 seconds
        1: Math.floor(Math.random() * 11) + 70  // 70-80 seconds
      };
      
      return secondsMap[rating];
    }
  }

  Scratch.extensions.register(new CustomBlocks());
})(Scratch);