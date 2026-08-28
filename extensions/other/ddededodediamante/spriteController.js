(function (Scratch) {
  // Made by ddededodediamante

  if (!Scratch.extensions.unsandboxed) {
    window.alert('The extension "Sprite Controller" must be ran unsandboxed!');
    throw new Error(
      'The extension "Sprite Controller" must be ran unsandboxed!'
    );
  }

  const isPM = Scratch.extensions?.isPenguinMod ?? false;
  const runtime = Scratch.vm.runtime;

  const rightIcon =
    "https://turbowarp.org/static/blocks-media/default/rotate-right.svg";
  const leftIcon =
    "https://turbowarp.org/static/blocks-media/default/rotate-left.svg";

  if (isPM) {
    var clickFlag =
      "https://studio.penguinmod.com/static/blocks-media/blue-flag.svg";
  } else {
    var clickFlag =
      "https://turbowarp.org/static/blocks-media/default/green-flag.svg";
  }

  const motion = runtime.ext_scratch3_motion;
  const looks = runtime.ext_scratch3_looks;

  function getSpriteByName(name) {
    if (name === "_stage_") {
      return runtime.getTargetForStage();
    } else {
      return runtime.getSpriteTargetByName(name);
    }
  }

  class extension {
    getInfo() {
      return {
        id: "ddeSpriteController",
        name: "Sprite Controller",
        color1: "#737FFF",
        blocks: [
          {
            opcode: "logsprite",
            blockType: Scratch.BlockType.COMMAND,
            text: "log target and util",
            hideFromPalette: true,
          },
          {
            opcode: "getrandomsprite",
            blockType: Scratch.BlockType.REPORTER,
            text: "random sprite",
            disableMonitor: true,
          },
          {
            opcode: "getcurrentsprite",
            blockType: Scratch.BlockType.REPORTER,
            text: "current sprite",
            disableMonitor: true,
            filter: [Scratch.TargetType.SPRITE],
          },
          "---",
          {
            opcode: "isClone",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "is clone?",
            disableMonitor: true,
            filter: [Scratch.TargetType.SPRITE],
          },
          {
            opcode: "spritedraggable",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "is [spritemenu] draggable?",
            arguments: {
              spritemenu: {
                type: Scratch.ArgumentType.STRING,
                menu: "sprites",
              },
            },
          },
          {
            opcode: "spritedragging",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "dragging [spritemenu]?",
            arguments: {
              spritemenu: {
                type: Scratch.ArgumentType.STRING,
                menu: "sprites",
              },
            },
          },
          {
            opcode: "spriteProperty",
            blockType: Scratch.BlockType.REPORTER,
            text: "[menu] of [spritemenu]",
            arguments: {
              menu: {
                type: Scratch.ArgumentType.STRING,
                menu: "spriteProperties",
              },
              spritemenu: {
                type: Scratch.ArgumentType.STRING,
                menu: "sprites",
              },
            },
          },
          "---",
          {
            opcode: "runAsSprite",
            blockType: Scratch.BlockType.CONDITIONAL,
            text: "as [sprite] run",
            arguments: {
              sprite: {
                type: Scratch.ArgumentType.STRING,
                menu: "sprites",
              },
            },
          },
          {
            opcode: "runAsClonesOfSprite",
            blockType: Scratch.BlockType.CONDITIONAL,
            text: "as clones of [sprite] run",
            arguments: {
              sprite: {
                type: Scratch.ArgumentType.STRING,
                menu: "sprites",
              },
            },
          },
          "---",
          {
            opcode: "movestepsprite",
            blockType: Scratch.BlockType.COMMAND,
            text: "move [spritemenu] [amount] steps",
            arguments: {
              amount: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
              },
              spritemenu: {
                type: Scratch.ArgumentType.STRING,
                menu: "sprites",
              },
            },
          },
          {
            opcode: "changexory",
            blockType: Scratch.BlockType.COMMAND,
            text: "change [spritemenu] [menu] by [amount]",
            arguments: {
              amount: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
              },
              menu: {
                type: Scratch.ArgumentType.STRING,
                menu: "xy",
              },
              spritemenu: {
                type: Scratch.ArgumentType.STRING,
                menu: "sprites",
              },
            },
          },
          {
            opcode: "setxory",
            blockType: Scratch.BlockType.COMMAND,
            text: "set [spritemenu] [menu] to [amount]",
            arguments: {
              amount: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
              },
              menu: {
                type: Scratch.ArgumentType.STRING,
                menu: "xy",
              },
              spritemenu: {
                type: Scratch.ArgumentType.STRING,
                menu: "sprites",
              },
            },
          },
          {
            opcode: "changexy",
            blockType: Scratch.BlockType.COMMAND,
            text: "change [spritemenu] x [x] y [y]",
            arguments: {
              x: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
              },
              y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
              },
              spritemenu: {
                type: Scratch.ArgumentType.STRING,
                menu: "sprites",
              },
            },
          },
          {
            opcode: "setxy",
            blockType: Scratch.BlockType.COMMAND,
            text: "set [spritemenu] to x [x] y [y]",
            arguments: {
              x: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
              },
              y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
              },
              spritemenu: {
                type: Scratch.ArgumentType.STRING,
                menu: "sprites",
              },
            },
          },
          {
            opcode: "changesizesprite",
            blockType: Scratch.BlockType.COMMAND,
            text: "change [spritemenu] size by [size]%",
            arguments: {
              size: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
              },
              spritemenu: {
                type: Scratch.ArgumentType.STRING,
                menu: "sprites",
              },
            },
          },
          {
            opcode: "setsizesprite",
            blockType: Scratch.BlockType.COMMAND,
            text: "set [spritemenu] size to [size]%",
            arguments: {
              size: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100,
              },
              spritemenu: {
                type: Scratch.ArgumentType.STRING,
                menu: "sprites",
              },
            },
          },
          {
            opcode: "turnspriteright",
            blockType: Scratch.BlockType.COMMAND,
            text: "turn [spritemenu] [image] [amount] degrees",
            arguments: {
              amount: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 15,
              },
              image: {
                type: Scratch.ArgumentType.IMAGE,
                dataURI: rightIcon,
              },
              spritemenu: {
                type: Scratch.ArgumentType.STRING,
                menu: "sprites",
              },
            },
          },
          {
            opcode: "turnspriteleft",
            blockType: Scratch.BlockType.COMMAND,
            text: "turn [spritemenu] [image] [amount] degrees",
            arguments: {
              amount: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 15,
              },
              image: {
                type: Scratch.ArgumentType.IMAGE,
                dataURI: leftIcon,
              },
              spritemenu: {
                type: Scratch.ArgumentType.STRING,
                menu: "sprites",
              },
            },
          },
          {
            opcode: "spritesay",
            blockType: Scratch.BlockType.COMMAND,
            text: "sprite [spritemenu] say [speak]",
            hideFromPalette: isPM,
            arguments: {
              speak: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "Hello!",
              },
              spritemenu: {
                type: Scratch.ArgumentType.STRING,
                menu: "sprites",
              },
            },
          },
          {
            opcode: "spritethink",
            blockType: Scratch.BlockType.COMMAND,
            text: "sprite [spritemenu] think [think]",
            hideFromPalette: isPM,
            arguments: {
              think: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "Hmm...",
              },
              spritemenu: {
                type: Scratch.ArgumentType.STRING,
                menu: "sprites",
              },
            },
          },
          {
            opcode: "spritegreenflag",
            blockType: Scratch.BlockType.COMMAND,
            text: "emit [image] to [spritemenu]",
            arguments: {
              image: {
                type: Scratch.ArgumentType.IMAGE,
                dataURI: clickFlag,
              },
              spritemenu: {
                type: Scratch.ArgumentType.STRING,
                menu: "spritesStage",
              },
            },
          },
          {
            opcode: "spriteclickevent",
            blockType: Scratch.BlockType.COMMAND,
            text: "emit click to [spritemenu]",
            arguments: {
              spritemenu: {
                type: Scratch.ArgumentType.STRING,
                menu: "spritesStage",
              },
            },
          },
          {
            opcode: "stopsprite",
            blockType: Scratch.BlockType.COMMAND,
            text: "stop [spritemenu]",
            arguments: {
              spritemenu: {
                type: Scratch.ArgumentType.STRING,
                menu: "spritesStage",
              },
            },
          },
        ],
        menus: {
          sprites: {
            acceptReporters: true,
            items: "allsprites",
          },
          spritesStage: {
            acceptReporters: true,
            items: "allspritesStage",
          },
          xy: {
            acceptReporters: true,
            items: ["x", "y"],
          },
          spriteProperties: {
            acceptReporters: true,
            items: [
              { text: "x position", value: "x" },
              { text: "y position", value: "y" },
              { text: "direction", value: "direction" },
              { text: "rotation style", value: "rotationStyle" },
              { text: "size", value: "size" },
              { text: "costume number", value: "currentCostume" },
              { text: "volume", value: "volume" },
              { text: "is visible", value: "visible" },
              { text: "tempo", value: "tempo" },
              { text: "clones amount", value: "clonesAmount" },
            ],
          },
        },
      };
    }

    allsprites(id) {
      const array = [];
      const targets = runtime.targets;
      if (targets.length < 2) {
        return ["No sprites."];
      }

      for (let e = 1; e < targets.length; e++) {
        const sprite = targets[e];
        if (sprite.isOriginal) {
          const name = sprite.getName();
          array.push({ text: sprite.id === id ? "myself" : name, value: name });
        }
      }

      return array;
    }

    allspritesStage(id) {
      const array = [{ text: "Stage", value: "_stage_" }];
      const sprites = this.allsprites(id);

      if (sprites.length === 1 && sprites[0] === "No sprites.") return array;
      else return array.concat(sprites);
    }

    /* secret mode */
    logsprite(args, util) {
      console.log(util, util.target);
    }

    getrandomsprite() {
      const sprites = this.allsprites();
      return sprites[Math.floor(Math.random() * sprites.length)];
    }

    getcurrentsprite(args, util) {
      return util.target.getName();
    }

    movestepsprite(args, util) {
      const target = getSpriteByName(args.spritemenu);
      if (!target) return;
      const amount = Scratch.Cast.toNumber(args.amount);
      motion._moveSteps(amount, target);
    }

    changexory(args, util) {
      const target = getSpriteByName(args.spritemenu);
      if (!target) return;
      const amount = Scratch.Cast.toNumber(args.amount);
      if (args.menu === "x") {
        target.setXY(target.x + amount, target.y);
      } else if (args.menu === "y") {
        target.setXY(target.x, target.y + amount);
      }
    }

    setxory(args, util) {
      const target = getSpriteByName(args.spritemenu);
      if (!target) return;
      const amount = Scratch.Cast.toNumber(args.amount);
      if (args.menu === "x") {
        target.setXY(amount, target.y);
      } else if (args.menu === "y") {
        target.setXY(target.x, amount);
      }
    }

    changexy(args, util) {
      const target = getSpriteByName(args.spritemenu);
      if (!target) return;
      const amounts = [
        Scratch.Cast.toNumber(args.x),
        Scratch.Cast.toNumber(args.y),
      ];
      target.setXY(target.x + amounts[0], target.y + amounts[1]);
    }

    setxy(args, util) {
      const target = getSpriteByName(args.spritemenu);
      if (!target) return;
      const amounts = [
        Scratch.Cast.toNumber(args.x),
        Scratch.Cast.toNumber(args.y),
      ];
      target.setXY(amounts[0], amounts[1]);
    }

    setsizesprite(args, util) {
      const target = getSpriteByName(args.spritemenu);
      if (!target) return;
      const size = Scratch.Cast.toNumber(args.size);
      target.setSize(size);
    }

    changesizesprite(args, util) {
      const target = getSpriteByName(args.spritemenu);
      if (!target) return;
      const size = Scratch.Cast.toNumber(args.size);
      target.setSize(target.size + size);
    }

    turnspriteright(args, util) {
      const target = getSpriteByName(args.spritemenu);
      if (!target) return;
      const amount = Scratch.Cast.toNumber(args.amount);
      target.setDirection(target.direction + amount);
    }

    turnspriteleft(args, util) {
      const target = getSpriteByName(args.spritemenu);
      if (!target) return;
      const amount = Scratch.Cast.toNumber(args.amount);
      target.setDirection(target.direction - amount);
    }

    spritesay(args, util) {
      if (isPM) throw new Error("This block does not work in PenguinMod.");

      const target = getSpriteByName(args.spritemenu);
      if (!target) return;
      const speak = Scratch.Cast.toString(args.speak);
      looks._say(speak, target);
    }

    spritethink(args, util) {
      if (isPM) throw new Error("This block does not work in PenguinMod.");

      const target = getSpriteByName(args.spritemenu);
      if (!target) return;
      const think = Scratch.Cast.toString(args.think);
      runtime.emit("SAY", target, "think", think);
    }

    spritegreenflag(args, util) {
      const target = getSpriteByName(args.spritemenu);
      if (!target) return;
      util.startHats("event_whenflagclicked", {}, target);
    }

    spriteclickevent(args, util) {
      const target = getSpriteByName(args.spritemenu);
      if (!target) return;
      if (args.spritemenu === "_stage_") {
        util.startHats("event_whenstageclicked");
      } else {
        util.startHats("event_whenthisspriteclicked", {}, target);
      }
    }

    stopsprite(args, util) {
      const target = getSpriteByName(args.spritemenu);
      if (!target) return;
      runtime.stopForTarget(target);
    }

    spritedraggable(args, util) {
      const target = getSpriteByName(args.spritemenu);
      if (!target) return;
      return target.draggable;
    }

    spritedragging(args, util) {
      const target = getSpriteByName(args.spritemenu);
      if (!target) return;
      return target.dragging;
    }

    runThreadInSprite(thread, originalTarget, newTarget) {
      const firstBlock = thread.blockContainer.getBranch(thread.peekStack(), 1);
      if (!firstBlock) return;

      const newThread = runtime._pushThread(firstBlock, originalTarget, {
        stackClick: false,
      });
      newThread.target = newTarget;

      if (runtime.compilerOptions.enabled) newThread.tryCompile();
    }

    runAsSprite(args, util) {
      const target = getSpriteByName(args.sprite);
      if (!target) return;

      this.runThreadInSprite(util.thread, util.target, target);
    }

    runAsClonesOfSprite(args, util) {
      const clones = runtime.targets.filter(
        (c) => !c.isOriginal && c?.sprite?.name === args.sprite
      );
      if (!clones || clones.length === 0) return;
      clones.forEach((c) => {
        this.runThreadInSprite(util.thread, util.target, c);
      });
    }

    isClone(_, util) {
      return !util?.target?.isOriginal;
    }

    spriteProperty({ spritemenu, menu }) {
      const target = getSpriteByName(spritemenu);
      if (!target) return;

      if (menu === "clonesAmount")
        return runtime.targets.filter(
          (c) => !c.isOriginal && c?.sprite?.name === spritemenu
        ).length;

      let result = target[menu];
      if (menu === "currentCostume") result++;

      return result;
    }
  }

  Scratch.extensions.register(new extension());
})(Scratch);
