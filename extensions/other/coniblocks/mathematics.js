// Name: Mathematics
// ID: mathematics
// Description: More advanced math.
// License: GPLV3

(function(Scratch) {
  'use strict';

  class Mathematics {
    getInfo() {
      return {
        id: 'mathematics',
        name: 'Mathematics',
        color1: '#4CAF50', 
        color2: '#388E3C',
        color3: '#2C6B2F',
        blocks: [
          {
            opcode: 'factorial',
            blockType: Scratch.BlockType.REPORTER,
            text: 'factorial of [NUM]',
            arguments: {
              NUM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
            }
          },
          {
            opcode: 'permutation',
            blockType: Scratch.BlockType.REPORTER,
            text: 'permutation [N] P [R]',
            arguments: {
              N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
              R: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 }
            }
          },
          {
            opcode: 'combination',
            blockType: Scratch.BlockType.REPORTER,
            text: 'combination [N] C [R]',
            arguments: {
              N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
              R: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 }
            }
          },
          {
            opcode: 'gcd',
            blockType: Scratch.BlockType.REPORTER,
            text: 'gcd of [A] and [B]',
            arguments: {
              A: { type: Scratch.ArgumentType.NUMBER, defaultValue: 48 },
              B: { type: Scratch.ArgumentType.NUMBER, defaultValue: 180 }
            }
          },
          {
            opcode: 'lcm',
            blockType: Scratch.BlockType.REPORTER,
            text: 'lcm of [A] and [B]',
            arguments: {
              A: { type: Scratch.ArgumentType.NUMBER, defaultValue: 48 },
              B: { type: Scratch.ArgumentType.NUMBER, defaultValue: 180 }
            }
          },
          {
            opcode: 'solveQuadratic',
            blockType: Scratch.BlockType.REPORTER,
            text: 'solve quadratic equation [EQUATION]',
            arguments: {
              EQUATION: { type: Scratch.ArgumentType.STRING, defaultValue: 'x^2 - 3x + 2' }
            }
          },
          {
            opcode: 'fibonacci',
            blockType: Scratch.BlockType.REPORTER,
            text: 'fibonacci number at position [N]',
            arguments: { N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 6 } }
          },
          {
            opcode: 'isPrime',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is [NUM] prime?',
            arguments: { NUM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 7 } }
          },
          {
            opcode: 'mean',
            blockType: Scratch.BlockType.REPORTER,
            text: 'mean of [NUMS]',
            arguments: { NUMS: { type: Scratch.ArgumentType.STRING, defaultValue: '1,2,3,4,5' } }
          },
          {
            opcode: 'median',
            blockType: Scratch.BlockType.REPORTER,
            text: 'median of [NUMS]',
            arguments: { NUMS: { type: Scratch.ArgumentType.STRING, defaultValue: '1,2,3,4,5' } }
          },
          {
            opcode: 'variance',
            blockType: Scratch.BlockType.REPORTER,
            text: 'variance of [NUMS]',
            arguments: { NUMS: { type: Scratch.ArgumentType.STRING, defaultValue: '1,2,3,4,5' } }
          },
          {
            opcode: 'stdDev',
            blockType: Scratch.BlockType.REPORTER,
            text: 'standard deviation of [NUMS]',
            arguments: { NUMS: { type: Scratch.ArgumentType.STRING, defaultValue: '1,2,3,4,5' } }
          }
        ]
      };
    }

    factorial(args) {
      const n = args.NUM;
      if (n < 0) return 'undefined';
      return n === 0 ? 1 : n * this.factorial({ NUM: n - 1 });
    }

    permutation(args) {
      const n = args.N;
      const r = args.R;
      return this.factorial({ NUM: n }) / this.factorial({ NUM: n - r });
    }

    combination(args) {
      const n = args.N;
      const r = args.R;
      return this.permutation({ N: n, R: r }) / this.factorial({ NUM: r });
    }

    gcd(args) {
      let a = args.A;
      let b = args.B;
      while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
      }
      return a;
    }

    lcm(args) {
      const a = args.A;
      const b = args.B;
      return (a * b) / this.gcd({ A: a, B: b });
    }

    solveQuadratic(args) {
      const eq = args.EQUATION.replace(/\s+/g, '');
      const match = eq.match(/^([+-]?\d*)x\^2([+-]?\d*)x([+-]?\d+)$/);
      if (!match) return 'Invalid format. Example: 2x^2+3x-5';
      let a = parseFloat(match[1] || (match[1] === '' ? 1 : match[1]));
      let b = parseFloat(match[2] || (match[2] === '' ? 1 : match[2]));
      let c = parseFloat(match[3] || 0);
      const discriminant = b * b - 4 * a * c;
      if (discriminant < 0) return 'No real solutions';
      const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      return [root1, root2];
    }

    fibonacci(args) {
      const n = args.N;
      if (n <= 1) return n;
      return this.fibonacci({ N: n - 1 }) + this.fibonacci({ N: n - 2 });
    }

    isPrime(args) {
      const n = args.NUM;
      if (n <= 1) return false;
      for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
      }
      return true;
    }

    mean(args) {
      const nums = args.NUMS.split(',').map(Number);
      const sum = nums.reduce((a, b) => a + b, 0);
      return sum / nums.length;
    }

    median(args) {
      const nums = args.NUMS.split(',').map(Number).sort((a, b) => a - b);
      const mid = Math.floor(nums.length / 2);
      return nums.length % 2 === 0 ? (nums[mid - 1] + nums[mid]) / 2 : nums[mid];
    }

    variance(args) {
      const nums = args.NUMS.split(',').map(Number);
      const mean = this.mean({ NUMS: args.NUMS });
      const squaredDiffs = nums.map(num => Math.pow(num - mean, 2));
      return this.mean({ NUMS: squaredDiffs.join(',') });
    }

    stdDev(args) {
      return Math.sqrt(this.variance(args));
    }
  }

  Scratch.extensions.register(new Mathematics());
})(Scratch);
