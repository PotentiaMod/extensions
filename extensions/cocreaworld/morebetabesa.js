(function(Scratch) {
  'use strict';

  class MoreMotion {
    getInfo() {
      return {
        id: 'morebetabesa',
        name: '更多运动（简易版）适合MMO枪战前期制作，后期会单独出一个',
        color1: '#4A90E2',
        color2: '#357ABD',
        blocks: [
          {
            opcode: 'changeXY',
            blockType: Scratch.BlockType.COMMAND,
            text: 'x坐标增加[DX]，y坐标增加[DY]',
            arguments: {
              DX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              DY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'pointTowardsXY',
            blockType: Scratch.BlockType.COMMAND,
            text: '面向x[X]y[Y]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'rotationStyle',
            blockType: Scratch.BlockType.REPORTER,
            text: '旋转模式'
          },
          {
            opcode: 'backToStage',
            blockType: Scratch.BlockType.COMMAND,
            text: '回到舞台'
          },
          {
            opcode: 'moveTowardsSteps',
            blockType: Scratch.BlockType.COMMAND,
            text: '向x[X]y[Y]移动[STEPS]步',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              STEPS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },
          {
            opcode: 'moveTowardsPercent',
            blockType: Scratch.BlockType.COMMAND,
            text: '向x[X]y[Y]移动[PCT]%的路程',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              PCT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },
          {
            opcode: 'directionToXY',
            blockType: Scratch.BlockType.REPORTER,
            text: '角色位置到x[X]y[Y]的方向',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'distanceToXY',
            blockType: Scratch.BlockType.REPORTER,
            text: '角色位置到x[X]y[Y]的距离',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'spriteSize',
            blockType: Scratch.BlockType.REPORTER,
            text: '角色的[DIM]',
            arguments: {
              DIM: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '宽度',
                menu: 'dimMenu'
              }
            }
          },
          {
            opcode: 'touchingXY',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '触碰坐标x[X]y[Y]？',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'inRegion',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '位于从x[X1]y[Y1]到x[X2]y[Y2]的区域内？',
            arguments: {
              X1: { type: Scratch.ArgumentType.NUMBER, defaultValue: -100 },
              Y1: { type: Scratch.ArgumentType.NUMBER, defaultValue: -100 },
              X2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              Y2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
            }
          }
        ],
        menus: {
          dimMenu: {
            acceptReporters: true,
            items: ['宽度', '高度']
          }
        }
      };
    }

    changeXY(args, util) {
      const t = util.target;
      t.setXY(t.x + Number(args.DX), t.y + Number(args.DY));
    }

    pointTowardsXY(args, util) {
      const t = util.target;
      const dx = Number(args.X) - t.x;
      const dy = Number(args.Y) - t.y;
      const dir = Math.atan2(dx, dy) * 180 / Math.PI;
      t.setDirection(dir);
    }

    rotationStyle(args, util) {
      const map = {
        'all around': '任意旋转',
        'left-right': '左右翻转',
        "don't rotate": '不可旋转'
      };
      return map[util.target.rotationStyle] || util.target.rotationStyle;
    }

    backToStage(args, util) {
      const t = util.target;
      const b = t.getBounds ? t.getBounds() : null;
      let x = t.x, y = t.y;
      if (b) {
        if (b.left < -240) x += -240 - b.left;
        if (b.right > 240) x -= b.right - 240;
        if (b.bottom < -180) y += -180 - b.bottom;
        if (b.top > 180) y -= b.top - 180;
      } else {
        x = Math.max(-240, Math.min(240, x));
        y = Math.max(-180, Math.min(180, y));
      }
      t.setXY(x, y);
    }

    moveTowardsSteps(args, util) {
      const t = util.target;
      const dx = Number(args.X) - t.x;
      const dy = Number(args.Y) - t.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Number(args.STEPS);
      if (dist === 0) return;
      const ratio = Math.min(steps, dist) / dist;
      t.setXY(t.x + dx * ratio, t.y + dy * ratio);
    }

    moveTowardsPercent(args, util) {
      const t = util.target;
      const dx = Number(args.X) - t.x;
      const dy = Number(args.Y) - t.y;
      const pct = Number(args.PCT) / 100;
      t.setXY(t.x + dx * pct, t.y + dy * pct);
    }

    directionToXY(args, util) {
      const t = util.target;
      const dx = Number(args.X) - t.x;
      const dy = Number(args.Y) - t.y;
      return Math.round(Math.atan2(dx, dy) * 180 / Math.PI);
    }

    distanceToXY(args, util) {
      const t = util.target;
      const dx = Number(args.X) - t.x;
      const dy = Number(args.Y) - t.y;
      return Math.round(Math.sqrt(dx * dx + dy * dy) * 100) / 100;
    }

    spriteSize(args, util) {
      const b = util.target.getBounds ? util.target.getBounds() : null;
      if (!b) return 0;
      if (String(args.DIM) === '高度') return Math.round(b.top - b.bottom);
      return Math.round(b.right - b.left);
    }

    touchingXY(args, util) {
      const b = util.target.getBounds ? util.target.getBounds() : null;
      if (!b) return false;
      const x = Number(args.X), y = Number(args.Y);
      return x >= b.left && x <= b.right && y >= b.bottom && y <= b.top;
    }

    inRegion(args, util) {
      const t = util.target;
      const x1 = Math.min(Number(args.X1), Number(args.X2));
      const x2 = Math.max(Number(args.X1), Number(args.X2));
      const y1 = Math.min(Number(args.Y1), Number(args.Y2));
      const y2 = Math.max(Number(args.Y1), Number(args.Y2));
      return t.x >= x1 && t.x <= x2 && t.y >= y1 && t.y <= y2;
    }
  }

  Scratch.extensions.register(new MoreMotion());
})(Scratch);
