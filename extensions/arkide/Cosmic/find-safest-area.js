(function(Scratch) {
  'use strict';

  class SafeAreaFinder {
    getInfo() {
      return {
        id: 'safeareafinder',
        name: 'Safe Area Finder',
        blocks: [
          {
            opcode: 'findSafeX',
            blockType: Scratch.BlockType.REPORTER,
            text: 'find safest X not touching [SPRITE]',
            arguments: {
              SPRITE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'targets'
              }
            }
          },
          {
            opcode: 'findSafeY',
            blockType: Scratch.BlockType.REPORTER,
            text: 'find safest Y not touching [SPRITE]',
            arguments: {
              SPRITE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'targets'
              }
            }
          }
        ],
        menus: {
          targets: {
            acceptReporters: true,
            items: '_getTargets'
          }
        }
      };
    }

    _getTargets() {
      const sprites = Scratch.vm.runtime.targets.filter(t => t.isOriginal && !t.isStage);
      return sprites.map(t => t.getName());
    }

    _findSafePosition(spriteName, util) {
      const currentTarget = util.target;
      const targetSprite = Scratch.vm.runtime.getSpriteTargetByName(spriteName);

      if (!targetSprite) {
        return { x: currentTarget.x, y: currentTarget.y };
      }

      const currentX = currentTarget.x;
      const currentY = currentTarget.y;

      // Search pattern: expanding circles around current position
      const searchDistances = [5, 10, 20, 30, 40, 50, 75, 100];
      const angles = [0, 45, 90, 135, 180, 225, 270, 315];

      for (const distance of searchDistances) {
        for (const angle of angles) {
          const rad = (angle * Math.PI) / 180;
          const testX = currentX + Math.cos(rad) * distance;
          const testY = currentY + Math.sin(rad) * distance;

          // Temporarily move to test position
          const origX = currentTarget.x;
          const origY = currentTarget.y;

          currentTarget.setXY(testX, testY);
          const isTouching = currentTarget.isTouchingObject(targetSprite.getName());
          currentTarget.setXY(origX, origY);

          if (!isTouching) {
            return { x: testX, y: testY };
          }
        }
      }

      // If no safe spot found, return current position
      return { x: currentX, y: currentY };
    }

    findSafeX(args, util) {
      const safePos = this._findSafePosition(args.SPRITE, util);
      return safePos.x;
    }

    findSafeY(args, util) {
      const safePos = this._findSafePosition(args.SPRITE, util);
      return safePos.y;
    }
  }

  Scratch.extensions.register(new SafeAreaFinder());
})(Scratch);