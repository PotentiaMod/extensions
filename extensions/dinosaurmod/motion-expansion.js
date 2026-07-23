Scratch.translate.setup({
  "de":{
    "_there's no home":"Es gibt keine Zuhause",
    "_Motion Expansion":"Bewegungserweiterung",
    "_set my home":"setze mein zuhause",
    "_set my home to x: [X] y: [Y]":"setze mein Zuhause zum x: [X] y: [Y]",
    "_go to home":"geh Zuhause",
    "_home [POSITION]":"[POSITION] von Zuhause",
    "_move [STEPS] steps towards x: [X] y: [Y]":"gehe [STEPS] er Schritt richtung zur x: [X] y: [Y]",
    "_move [PERCENT]% of the way to x: [X] y: [Y]":"gehe [PERCENT]% auf der weg zur x: [X] y: [Y]",
    "_manually fence":"Verhindern Sie, dass Figuren die Bühne verlassen",
    "_rotation style":"Drehtyp"
  },
  "it":{
    "_Motion Expansion":"Espansione del moto",
    "_set my home":"impostare la mia casa",
    "_set my home to x: [X] y: [Y]":"imposta la mia casa su x: [X] y: [Y]",
    "_go to home":"tornare a casa",
    "_manually fence":"impedisci sprite fuori Stage",
    "_move [PERCENT]% of the way to x: [X] y: [Y]":"percorri [PERCENT]% della distanza da x: [X] y: [Y]",
    "_move [STEPS] steps towards x: [X] y: [Y]":"fai [STEPS] passi verso x: [X] y: [Y]",
    "_rotation style":"stile rotazione",
    "_touching rectangle x1: [X1] y1: [Y1] x2: [X2] y2: [Y2]?":"sta toccando rettangolo x1: [X1] y1: [Y1] x2: [X2] y2: [Y2]",
    "_touching x: [X] y: [Y]?":"sta toccando x: [X] y: [Y]"
  }
});

(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("this extension must be run unsandboxed");
  }

  const variables = {};

  /**
   * @param {VM.BlockUtility} util
   * @param {unknown} targetName
   */
  const getSpriteTargetByName = (util, targetName) => {
    const nameString = Scratch.Cast.toString(targetName);
    const target = util.target;
    if (target.getName() === nameString) {
      return target;
    }
    return util.runtime.getSpriteTargetByName(nameString);
  };

  // @ts-expect-error - not typed yet
  const Rectangle = Scratch.vm.renderer.exports.Rectangle;

  class MotionExtension {
      constructor(runtime) {
        this.runtime = runtime
      }
      getInfo() {
          return {
            id: "MotionExtension",
            name: Scratch.translate("Motion Expansion"),
            color1: "#4c97ff",
            blocks: [
              {
                filter: [Scratch.TargetType.STAGE],
                blockType: Scratch.BlockType.LABEL,
                // We can copy this translation from scratch-blocks
                text:
                  typeof ScratchBlocks !== "undefined"
                    ? ScratchBlocks.Msg["MOTION_STAGE_SELECTED"]
                    : "Stage selected: no motion blocks",
              },
              {
                opcode: `motion_diagonalmovesteps`,
                blockType: Scratch.BlockType.COMMAND,
                filter: [Scratch.TargetType.SPRITE],
                text: "move [TOPBOTTOM] [LEFTRIGHT] [STEPS] steps",
                arguments: {
                  TOPBOTTOM: {
                    type: Scratch.ArgumentType.STRING,
                    menu: 'TopBottomMenu'
                  },
                  LEFTRIGHT: {
                    type: Scratch.ArgumentType.STRING,
                    menu: 'LeftRightMenu'
                  },
                  STEPS: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: '10'
                  },
                }
              },
              "---",
              {
                opcode: `motion_setmyHome`,
                blockType: Scratch.BlockType.COMMAND,
                filter: [Scratch.TargetType.SPRITE],
                text: Scratch.translate('set my home'),
                arguments: {}
              },
              {
                opcode: `motion_setmyHomeTo`,
                blockType: Scratch.BlockType.COMMAND,
                filter: [Scratch.TargetType.SPRITE],
                text: Scratch.translate('set my home to x: [X] y: [Y]'),
                arguments: {
                  X: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: '0'
                  },
                  Y: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: '0'
                  }
                }
              },
              {
                opcode: `motion_gotoHome`,
                filter: [Scratch.TargetType.SPRITE],
                blockType: Scratch.BlockType.COMMAND,
                text: Scratch.translate('go to home'),
                arguments: {}
              },
              {
                opcode: `motion_getHome`,
                filter: [Scratch.TargetType.SPRITE],
                blockType: Scratch.BlockType.REPORTER,
                text: Scratch.translate('home [POSITION]'),
                arguments: {
                  POSITION: {
                    type: Scratch.ArgumentType.STRING,
                    menu: 'PositionMenu'
                  }
                }
              },
              "---",
              {
                opcode: `motion_pointawayfrom`,
                filter: [Scratch.TargetType.SPRITE],
                blockType: Scratch.BlockType.COMMAND,
                text: 'point away from [AWAYFROM]',
                arguments: {
                  AWAYFROM: {
                    type: Scratch.ArgumentType.STRING,
                    menu: 'SpritesMenu'
                  }
                }
              },
              "---",
              {
                filter: [Scratch.TargetType.SPRITE],
                opcode: "motion_steptowards",
                blockType: Scratch.BlockType.COMMAND,
                text: Scratch.translate("move [STEPS] steps towards x: [X] y: [Y]"),
                arguments: {
                  STEPS: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: "10",
                  },
                  X: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: "0",
                  },
                  Y: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: "0",
                  },
                },
              },
              {
                filter: [Scratch.TargetType.SPRITE],
                opcode: "motion_tweentowards",
                blockType: Scratch.BlockType.COMMAND,
                text: Scratch.translate("move [PERCENT]% of the way to x: [X] y: [Y]"),
                arguments: {
                  PERCENT: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: "10",
                  },
                  X: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: "0",
                  },
                  Y: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: "0",
                  },
                },
              },
              "---",
              {
                filter: [Scratch.TargetType.SPRITE],
                opcode: "motion_fence",
                blockType: Scratch.BlockType.COMMAND,
                text: Scratch.translate('manually fence'),
              },
              "---",
              {
                filter: [Scratch.TargetType.SPRITE],
                opcode: "motion_touchingxy",
                blockType: Scratch.BlockType.BOOLEAN,
                text: Scratch.translate("touching x: [X] y: [Y]?"),
                arguments: {
                  X: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: "0",
                  },
                  Y: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: "0",
                  },
                },
              },
              {
                filter: [Scratch.TargetType.SPRITE],
                opcode: "motion_touchingrect",
                blockType: Scratch.BlockType.BOOLEAN,
                text: Scratch.translate("touching rectangle x1: [X1] y1: [Y1] x2: [X2] y2: [Y2]?"),
                arguments: {
                  X1: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: "-100",
                  },
                  Y1: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: "-100",
                  },
                  X2: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: "100",
                  },
                  Y2: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: "100",
                  },
                },
              },
              "---",
              {
                filter: [Scratch.TargetType.SPRITE],
                opcode: "motion_isinxy",
                blockType: Scratch.BlockType.BOOLEAN,
                text: Scratch.translate("is in between x [X1] to [X2] and y [Y1] to [Y2]"),
                hideFromPalette: true,
                arguments: {
                  X1: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: "-240",
                  },
                  X2: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: "240",
                  },
                  Y1: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: "-180",
                  },
                  Y2: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: "180",
                  },
                },
              },
              "---",
              {
                filter: [Scratch.TargetType.SPRITE],
                opcode: "motion_rotationStyle",
                blockType: Scratch.BlockType.REPORTER,
                text: Scratch.translate("rotation style"),
                disableMonitor: true,
              },
            ],
            menus: {
              SpritesMenu: {
                acceptReporters: true,
                items: "_getTargets"//[{ text: "mouse-pointer", value: "_mouse_" },'this menu is work in progress.']
              },
              PositionMenu: {
                acceptReporters: true,
                items: ['X', 'Y']
              },
              TopBottomMenu: {
                acceptReporters: false,
                items: ['top', 'bottom']
              },
              LeftRightMenu: {
                acceptReporters: false,
                items: ['left', 'right']
              }
            },
          }
      }
      motion_setmyHome(_, util){
        const target = util.target;
        variables["MOTION-EXPANSION-X-POSITION"] = this._limitPrecision(target.x)
        variables["MOTION-EXPANSION-Y-POSITION"] = this._limitPrecision(target.y)
        //return localStorage.setItem('MOTION-EXPANSION' + 'X-POSITION', this._limitPrecision(target.x)),
        //localStorage.setItem('MOTION-EXPANSION' + 'Y-POSITION', this._limitPrecision(target.y))
      }
      motion_setmyHomeTo(args, util){
        //return localStorage.setItem('MOTION-EXPANSION' + 'X-POSITION', /*this._limitPrecision*/(args.X)),
        //localStorage.setItem('MOTION-EXPANSION' + 'Y-POSITION', /*this._limitPrecision*/(args.Y))
        variables["MOTION-EXPANSION-X-POSITION"] = args.X
        variables["MOTION-EXPANSION-Y-POSITION"] = args.Y
      }
      motion_gotoHome(_, util){
        const target = util.target;
        let x = variables["MOTION-EXPANSION-X-POSITION"]//localStorage.getItem('MOTION-EXPANSION' + 'X-POSITION');
        let y = variables["MOTION-EXPANSION-Y-POSITION"]//localStorage.getItem('MOTION-EXPANSION' + 'Y-POSITION');
        return target.setXY(x, y);
      }
      motion_getHome(args, util) {
        if (Scratch.Cast.toString(args.POSITION) === 'X') {
          return variables["MOTION-EXPANSION-X-POSITION"] ?? Scratch.translate("there's no home");
        } else if (Scratch.Cast.toString(args.POSITION) === 'Y') {
          return variables["MOTION-EXPANSION-Y-POSITION"] ?? Scratch.translate("there's no home");
        }
      }
      motion_pointawayfrom(args, util) {
        let targetX = 0;
        let targetY = 0;
        if (args.AWAYFROM === '_mouse_') {
            targetX = util.ioQuery('mouse', 'getScratchX');
            targetY = util.ioQuery('mouse', 'getScratchY');
        } else {
            args.AWAYFROM = Scratch.Cast.toString(args.AWAYFROM);
            const pointTarget = getSpriteTargetByName(util, args.AWAYFROM);
            if (!pointTarget) return;
            targetX = pointTarget.x;
            targetY = pointTarget.y;
        }

        const dx = targetX - util.target.x;
        const dy = targetY - util.target.y;
        const direction = 90 - this._radToDeg(Math.atan2(dy, dx));
        return util.target.setDirection(direction - 180);
      }
      motion_steptowards(args, util) {
        const x = Scratch.Cast.toNumber(args.X);
        const y = Scratch.Cast.toNumber(args.Y);
        const steps = Scratch.Cast.toNumber(args.STEPS);
        const val =
          steps / Math.sqrt((x - util.target.x) ** 2 + (y - util.target.y) ** 2);
        if (val >= 1) {
          return util.target.setXY(x, y);
        } else {
          return util.target.setXY(
            (x - util.target.x) * val + util.target.x,
            (y - util.target.y) * val + util.target.y
          );
        }
      }
      motion_tweentowards(args, util) {
        const x = Scratch.Cast.toNumber(args.X);
        const y = Scratch.Cast.toNumber(args.Y);
        const val = Scratch.Cast.toNumber(args.PERCENT);
        // Essentially a smooth glide script.
        return util.target.setXY(
          (x - util.target.x) * (val / 100) + util.target.x,
          (y - util.target.y) * (val / 100) + util.target.y
        );
      }
      motion_fence(args, util) {
        const newpos = Scratch.vm.renderer.getFencedPositionOfDrawable(
          util.target.drawableID,
          [util.target.x, util.target.y]
        );
        return util.target.setXY(newpos[0], newpos[1]);
      }
      motion_touchingxy(args, util) {
        const x = Scratch.Cast.toNumber(args.X);
        const y = Scratch.Cast.toNumber(args.Y);
        const drawable =
          Scratch.vm.renderer._allDrawables[util.target.drawableID];
        if (!drawable) {
          return false;
        }
        // Position should technically be a twgl vec3, but it doesn't actually need to be
        drawable.updateCPURenderAttributes();
        return drawable.isTouching([x, y]);
      }
      motion_touchingrect(args, util) {
        let left = Scratch.Cast.toNumber(args.X1);
        let right = Scratch.Cast.toNumber(args.X2);
        let bottom = Scratch.Cast.toNumber(args.Y1);
        let top = Scratch.Cast.toNumber(args.Y2);
  
        // Fix argument order if they got it backwards
        if (left > right) {
          let temp = left;
          left = right;
          right = temp;
        }
        if (bottom > top) {
          let temp = bottom;
          bottom = top;
          bottom = temp;
        }
  
        const drawable =
          Scratch.vm.renderer._allDrawables[util.target.drawableID];
        if (!drawable) {
          return false;
        }
  
        // See renderer.isTouchingDrawables
  
        const drawableBounds = drawable.getFastBounds();
        drawableBounds.snapToInt();
  
        const containsBounds = new Rectangle();
        containsBounds.initFromBounds(left, right, bottom, top);
        containsBounds.snapToInt();
  
        if (!containsBounds.intersects(drawableBounds)) {
          return false;
        }
  
        drawable.updateCPURenderAttributes();
  
        const intersectingBounds = Rectangle.intersect(
          drawableBounds,
          containsBounds
        );
        for (let x = intersectingBounds.left; x < intersectingBounds.right; x++) {
          for (
            let y = intersectingBounds.bottom;
            y < intersectingBounds.top;
            y++
          ) {
            // technically should be a twgl vec3, but does not actually need to be
            if (drawable.isTouching([x, y])) {
              return true;
            }
          }
        }
        return false;
      }
      motion_isinxy(args, util) {
        return !(((util.target.x < (Scratch.Cast.toNumber(args.X1) + 1)) || (util.target.x > (Scratch.Cast.toNumber(args.X2) - 1))) && ((util.target.y < (Scratch.Cast.toNumber(args.Y1) + 1)) || (util.target.y > (Scratch.Cast.toNumber(args.Y2) - 1))))
      }
      motion_rotationStyle(args, util) {
        return util.target.rotationStyle;
      }
      motion_diagonalmovesteps(args, util) { // terribly coded but if it works, it works
        switch (args.LEFTRIGHT) {
          case 'left':
            this._moveSteps(args.STEPS * -1, util);
            break;
          case 'right':
            this._moveSteps(args.STEPS, util);
            break;
        }
        switch (args.TOPBOTTOM) {
          case 'top':
            util.target.setDirection(util.target.direction + 90);
            this._moveSteps(args.STEPS * -1, util);
            util.target.setDirection(util.target.direction - 90);
            break;
          case 'bottom':
            util.target.setDirection(util.target.direction + -90)
            this._moveSteps(args.STEPS * -1, util);
            util.target.setDirection(util.target.direction + 90);
            break;
        }
      }
      _radToDeg (rad) {
        return rad * 180 / Math.PI;
      }
      _degToRad (deg) {
        return deg * Math.PI / 180;
      }
      _getTargets() {
        let spriteNames = [
          { text: "mouse-pointer", value: "_mouse_" },
        ];
        const targets = Scratch.vm.runtime.targets
          .filter((target) => target.isOriginal && !target.isStage)
          .map((target) => target.getName());
        spriteNames = spriteNames.concat(targets);

        const myself = Scratch.vm.runtime.getEditingTarget().getName();
        spriteNames.splice(spriteNames.indexOf(myself), 1);
        return spriteNames;
      }
      _getSprites() {
        const spriteNames = [];
        const targets = Scratch.vm.runtime.targets;
        for (let index = 1; index < targets.length; index++) {
          const target = targets[index];
          if (target.isOriginal) {
            const targetName = target.getName();
              spriteNames.push({
                text: targetName,
                value: targetName,
              });
          }
        }
        if (spriteNames.length > 0) {
          return spriteNames;
        } else {
          return [{ text: "", value: 0 }]; //this should never happen but it's a failsafe
        }
      }
      _limitPrecision (coordinate) {
        const rounded = Math.round(coordinate);
        const delta = coordinate - rounded;
        const limitedCoord = (Math.abs(delta) < 1e-9) ? rounded : coordinate;
        return limitedCoord;
      }
      _moveSteps(steps, util) {
        const radians = this._degToRad(90 - util.target.direction);
        const dx = steps * Math.cos(radians);
        const dy = steps * Math.sin(radians);
        util.target.setXY(util.target.x + dx, util.target.y + dy);
      }
  }
  
Scratch.extensions.register(new MotionExtension(Scratch.vm.runtime));
})(Scratch);
