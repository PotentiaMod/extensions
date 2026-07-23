(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("this extension must be run unsandboxed");
  }

  const requireNonPackagedRuntime = (blockName) => {
    if (Scratch.vm.runtime.isPackaged) {
      alert(
        `To use the Looks Expansion ${blockName} block, the creator of the packaged project must uncheck "Remove raw asset data after loading to save RAM" under advanced settings in the packager.`
      );
      return false;
    }
    return true;
  };

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

  let showExtraSay = false;

class LooksExtension {
  constructor(runtime) {
    this.runtime = runtime
  }
  static get SAY_OR_THINK () {
    return 'SAY';
  }
  getInfo() {
    return {
      id: 'looksexample',
      name: 'Looks Expansion',
      color1: "#9966ff",
      blocks: [
        /*{
          func: 'notify',
          blockType: Scratch.BlockType.BUTTON,
          text: 'note to this extension'
        },*/
        {
          opcode: 'sayConvert_for_seconds',
          text: 'say [SAY] and convert to [CONVERSION] for [NUMBER] seconds',
          blockType: Scratch.BlockType.COMMAND,
          hideFromPalette: false,
          filter: [Scratch.TargetType.SPRITE],
          arguments: {
            SAY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Hello!'
            },
            CONVERSION: {
              type: Scratch.ArgumentType.STRING,
              menu: 'ConversionMenu'
            },
	          NUMBER: {
	            type: Scratch.ArgumentType.NUMBER,
	            defaultValue: 2
	          }
          }
        },
        {
          opcode: 'sayConvert',
          text: 'say [SAY] and convert to [CONVERSION]',
          blockType: Scratch.BlockType.COMMAND,
          hideFromPalette: false,
          filter: [Scratch.TargetType.SPRITE],
          arguments: {
            SAY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Hello!'
            },
            CONVERSION: {
              type: Scratch.ArgumentType.STRING,
              menu: 'ConversionMenu'
            },
          }
        },
        {
          opcode: 'thinkConvert_for_seconds',
          text: 'think [SAY] and convert to [CONVERSION] for [NUMBER] seconds',
          blockType: Scratch.BlockType.COMMAND,
          hideFromPalette: false,
          filter: [Scratch.TargetType.SPRITE],
          arguments: {
            SAY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Hmm..'
            },
            CONVERSION: {
              type: Scratch.ArgumentType.STRING,
              menu: 'ConversionMenu'
            },
	          NUMBER: {
	            type: Scratch.ArgumentType.NUMBER,
	            defaultValue: 2
	          }
          }
        },
        {
          opcode: 'thinkConvert',
          text: 'think [SAY] and convert to [CONVERSION]',
          blockType: Scratch.BlockType.COMMAND,
          hideFromPalette: false,
          filter: [Scratch.TargetType.SPRITE],
          arguments: {
            SAY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Hmm..'
            },
            CONVERSION: {
              type: Scratch.ArgumentType.STRING,
              menu: 'ConversionMenu'
            },
          }
        },
        "---",
        {
          opcode: 'showAllsprites',
          text: 'show all sprites',
          blockType: Scratch.BlockType.COMMAND,
          // hideFromPalette: true,
          // filter: [Scratch.TargetType.SPRITE],
          arguments: {}
        },
        {
          opcode: 'hideAllsprites',
          text: 'hide all sprites',
          blockType: Scratch.BlockType.COMMAND,
          // hideFromPalette: true,
          // filter: [Scratch.TargetType.SPRITE],
          arguments: {}
        },
        "---",
        {
          opcode: 'randomHex',
          text: 'random hex color',
          blockType: Scratch.BlockType.REPORTER,
          disableMonitor: true,
          // hidefromPalette: false,
          // filter: [Scratch.TargetType.SPRITE],
          arguments: {}
        },
        "---",
        {
          opcode: "setLayerTo",
          blockType: Scratch.BlockType.COMMAND,
          text: "set layer # of [TARGET] to [LAYER]",
          arguments: {
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "spriteMenu",
            },
            LAYER: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: "1",
            },
          },
        },
        {
          opcode: "changeLayerBy",
          blockType: Scratch.BlockType.COMMAND,
          text: "change layer # of [TARGET] by [LAYER]",
          arguments: {
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "spriteMenu",
            },
            LAYER: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: "1",
            },
          },
        },
        {
          opcode: "spriteLayerNumber",
          blockType: Scratch.BlockType.REPORTER,
          text: "layer # of [TARGET]",
          arguments: {
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "spriteMenu",
            },
          },
        },
        {
          opcode: "setLayer",
          blockType: Scratch.BlockType.COMMAND,
          text: "set [TARGET] to [LAYER] layer",
          arguments: {
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "spriteMenu",
            },
            LAYER: {
              type: Scratch.ArgumentType.STRING,
              menu: "layerMenu"
            },
          },
        },
        "---",
        {
          opcode: "effectValue",
          blockType: Scratch.BlockType.REPORTER,
          text: "[EFFECT] effect of [TARGET]",
          arguments: {
            EFFECT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "color",
              menu: "effectMenu",
            },
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "spriteMenu",
            },
          },
        },
        {
          opcode: "changeeffectoftarget",
          blockType: Scratch.BlockType.COMMAND,
          text: "change [EFFECT] effect of [TARGET] by [NUMBER]",
          // hideFromPalette: false,
          arguments: {
            EFFECT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "color",
              menu: "effectMenu",
            },
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "spriteMenu",
            },
	          NUMBER: {
	            type: Scratch.ArgumentType.NUMBER,
	            defaultValue: 0
	          }
          },
        },
        {
          opcode: "seteffectoftarget",
          blockType: Scratch.BlockType.COMMAND,
          text: "set [EFFECT] effect of [TARGET] to [NUMBER]",
          // hideFromPalette: false,
          arguments: {
            EFFECT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "color",
              menu: "effectMenu",
            },
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "spriteMenu",
            },
	          NUMBER: {
	            type: Scratch.ArgumentType.NUMBER,
	            defaultValue: 0
	          }
          },
        },
        "---",
        {
          opcode: "snapshotStage",
          blockType: Scratch.BlockType.REPORTER,
          text: "snapshot stage",
          disableMonitor: true,
        },
        "---",
        {
          opcode: "replaceCostumeContent",
          blockType: Scratch.BlockType.COMMAND,
          text: "set [TYPE] for [COSTUME] to [CONTENT]",
          arguments: {
            TYPE: {
              type: Scratch.ArgumentType.STRING,
              menu: "SVGPNG",
              defaultValue: "SVG",
            },
            COSTUME: {
              type: Scratch.ArgumentType.COSTUME,
            },
            CONTENT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "<svg />",
            },
          },
        },
        {
          opcode: "restoreCostumeContent",
          blockType: Scratch.BlockType.COMMAND,
          text: "restore content for [COSTUME]",
          arguments: {
            COSTUME: {
              type: Scratch.ArgumentType.COSTUME,
            },
          },
        },
        "---",
        {
          opcode: "replaceColors",
          blockType: Scratch.BlockType.REPORTER,
          text: "replace [COLOR1] with [COLOR2] in [SVG]",
          arguments: {
            COLOR1: {
              type: Scratch.ArgumentType.COLOR,
              defaultValue: "#FCB1E3",
            },
            COLOR2: {
              type: Scratch.ArgumentType.COLOR,
              defaultValue: "#8ECAFF",
            },
            SVG: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "<svg />",
            },
          },
        },
        "---",
        {
          opcode: "getCostumeNumName",
          blockType: Scratch.BlockType.REPORTER,
          text: "costume [NUMBER_NAME] of [TARGET]",
          arguments: {
            NUMBER_NAME: {
              type: Scratch.ArgumentType.STRING,
              menu: "NUMBER_NAME",
            },
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "spriteMenu",
            },
          },
        },
        {
          opcode: "getSizeOfTarget",
          blockType: Scratch.BlockType.REPORTER,
          text: "size of [TARGET]",
          arguments: {
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "spriteMenu",
            },
          },
        },
        "---",
        {
          opcode: "targetCostumeNumber",
          blockType: Scratch.BlockType.REPORTER,
          text: "# of costumes in [TARGET]",
          arguments: {
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "spriteMenu",
            },
          },
        },
        "---",
        {
          opcode: "switchCostumeDif",
          blockType: Scratch.BlockType.COMMAND,
          text: "switch costume of [TARGET] to [OTHER_COSTUMES] costume",
          arguments: {
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "spriteMenu",
            },
            OTHER_COSTUMES: {
              type: Scratch.ArgumentType.STRING,
              menu: "OTHER_COSTUMES",
            },
          },
        },
        {
          opcode: "switchCostumeDif2",
          blockType: Scratch.BlockType.COMMAND,
          text: "switch costume of [TARGET] to [COSTUME]",
          arguments: {
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: "spriteMenu",
            },
            COSTUME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "costume1",
            },
          },
        },
      ],
      menus: {
        spriteMenu: {
          acceptReporters: true,
          items: "getSprites",
        },
        layerMenu: {
          acceptReporters: false,
          items: ["front", "back"]
        },
        NUMBER_NAME: {
          acceptReporters: false,
          items: ["number", "name"]
        },
        OTHER_COSTUMES: {
          acceptReporters: true,
          items: ["previous", "random", "next"]
        },
        SVGPNG: {
          acceptReporters: false,
          items: [
            {
              text: "SVG",
              value: "SVG",
            },
          ],
        },
        effectMenu: {
          // false for Scratch parity
          acceptReporters: false,
          items: [
            {
              text: "color",
              value: "color",
            },
            {
              text: "fisheye",
              value: "fisheye",
            },
            {
              text: "whirl",
              value: "whirl",
            },
            {
              text: "pixelate",
              value: "pixelate",
            },
            {
              text: "mosaic",
              value: "mosaic",
            },
            {
              text: "brightness",
              value: "brightness",
            },
            {
              text: "ghost",
              value: "ghost",
            },
          ],
        },
        ConversionMenu: {
            acceptReporters: false,
            items: ['UPPERCASE','lowercase']
        }
      }
    };
  }
  notify() {
    alert(
      `This extension is still work in progress
      `
    )
  }
  /*
  ShowMoreSay() {
    switch (showExtraSay) {
      case 'true':
        showExtraSay = false
      case 'false':
        showExtraSay = true
    }
  }
  */
  getSprites() {
    const spriteNames = [];
    const targets = Scratch.vm.runtime.targets;
    const myself = Scratch.vm.runtime.getEditingTarget().getName();
    for (let index = 1; index < targets.length; index++) {
      const target = targets[index];
      if (target.isOriginal) {
        const targetName = target.getName();
        if (targetName === myself) {
          spriteNames.unshift({
            text: "this sprite",
            value: targetName,
          });
        } else {
          spriteNames.push({
            text: targetName,
            value: targetName,
          });
        }
      }
    }
    if (spriteNames.length > 0) {
      return spriteNames;
    } else {
      return [{ text: "", value: 0 }]; //this should never happen but it's a failsafe
    }
  }
  _toUppercase(text) {
    return text.toUpperCase();
  }

  _toLowercase(text) {
    return text.toLowerCase();
  }
  sayConvert (args, util) {
    let textToSAY;
    switch (args.CONVERSION) {
      case 'UPPERCASE':
        textToSAY = this._toUppercase(args.SAY)
        break;
      case 'lowercase':
        textToSAY = this._toLowercase(args.SAY)
        break;
    }
    Scratch.vm.runtime.emit(LooksExtension.SAY_OR_THINK, util.target, 'say', textToSAY);
  }
  sayConvert_for_seconds (args, util) {
    let textToSAY;
    switch (args.CONVERSION) {
      case 'UPPERCASE':
        textToSAY = this._toUppercase(args.SAY)
        break;
      case 'lowercase':
        textToSAY = this._toLowercase(args.SAY)
        break;
    }
    const duration = args.NUMBER * 1000;
    Scratch.vm.runtime.emit(LooksExtension.SAY_OR_THINK, util.target, 'say', textToSAY);

    setTimeout(() => {
      Scratch.vm.runtime.emit(LooksExtension.SAY_OR_THINK, util.target, 'say', ''); // Clear the speech bubble
      Scratch.vm.runtime.requestRedraw();
    }, duration)
  }
  thinkConvert (args, util) {
    let textToSAY;
    switch (args.CONVERSION) {
      case 'UPPERCASE':
        textToSAY = this._toUppercase(args.SAY)
        break;
      case 'lowercase':
        textToSAY = this._toLowercase(args.SAY)
        break;
    }
    Scratch.vm.runtime.emit(LooksExtension.SAY_OR_THINK, util.target, 'think', textToSAY);
  }
  thinkConvert_for_seconds (args, util) {
    let textToSAY;
    switch (args.CONVERSION) {
      case 'UPPERCASE':
        textToSAY = this._toUppercase(args.SAY)
        break;
      case 'lowercase':
        textToSAY = this._toLowercase(args.SAY)
        break;
    }
    const duration = args.NUMBER * 1000;
    Scratch.vm.runtime.emit(LooksExtension.SAY_OR_THINK, util.target, 'think', textToSAY);

    setTimeout(() => {
      Scratch.vm.runtime.emit(LooksExtension.SAY_OR_THINK, util.target, 'say', ''); // Clear the speech bubble
      Scratch.vm.runtime.requestRedraw();
    }, duration)
  }
  showAllsprites (args, util) {
    /*alert(
      `This block is non-functional, it does not do anything other than executing this alert.

      this block is work in progress.
      `
    )*/
    const targets = Scratch.vm.runtime.targets;
    for (const target of targets) {
      if (!target.isStage) {
        target.setVisible(true)
      }
    }
  }
  hideAllsprites (args, util) {
    /*alert(
      `This block is non-functional, it does not do anything other than executing this alert.

      this block is work in progress.
      `
    )*/
    const targets = Scratch.vm.runtime.targets;
    for (const target of targets) {
      if (!target.isStage) {
        target.setVisible(false)
      }
    }
  }
  randomHex (_, util) {
    const originalArray = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
    ];

    const selectedItems = [];
    const itemsCount = Math.min(6, originalArray.length);

    while (selectedItems.length < itemsCount) {
      const randomIndex = Math.floor(Math.random() * originalArray.length);
      const selectedItem = originalArray.splice(randomIndex, 1)[0];
      selectedItems.push(selectedItem);
    }

    const resultString = selectedItems.join('');
    return '#' + resultString
    }
    // copied from https://extensions.turbowarp.org/Lily/LooksPlus.js
    setLayerTo(args, util) {
      const target = getSpriteTargetByName(util, args.TARGET);
      if (!target) {
        return;
      }
      const drawableID = target.drawableID;
      const layerOrder = target.getLayerOrder();
      const newLayer = args.LAYER - layerOrder;
      target.renderer.setDrawableOrder(drawableID, newLayer, "sprite", true);
    }
    changeLayerBy(args, util) {
      const target = getSpriteTargetByName(util, args.TARGET);
      if (!target) {
        return;
      }
      const drawableID = target.drawableID;
      const layerOrder = target.getLayerOrder();
      const newLayer = (args.LAYER + layerOrder) - layerOrder;
      target.renderer.setDrawableOrder(drawableID, newLayer, "sprite", true);
    }
    setLayer(args, util) {
      const target = getSpriteTargetByName(util, args.TARGET);
      const maximumLayer = ((999*999)*(999*999)*(999*999)*(999*999)*(999*999)*(999*999)*(999*999)*(999*999))
      const minimumLayer = '0'
      if (!target) {
        return;
      }
      const drawableID = target.drawableID;
      const layerOrder = target.getLayerOrder();
      if (args.LAYER === 'front') {
      const newLayer = maximumLayer - layerOrder
      target.renderer.setDrawableOrder(drawableID, newLayer, "sprite", true);
      } else if (args.LAYER === 'back') {
      const newLayer = minimumLayer - layerOrder
      target.renderer.setDrawableOrder(drawableID, newLayer, "sprite", true);
      }
    }
    // copied from https://extensions.turbowarp.org/Lily/LooksPlus.js
    spriteLayerNumber(args, util) {
      const target = getSpriteTargetByName(util, args.TARGET);
      if (!target) {
        return 0;
      }
      return target.getLayerOrder();
    }
    // copied from https://extensions.turbowarp.org/Lily/LooksPlus.js
    effectValue(args, util) {
      const target = getSpriteTargetByName(util, args.TARGET);
      if (!target) {
        return 0;
      }
      const effects = target.effects;
      const name = Scratch.Cast.toString(args.EFFECT);
      if (Object.prototype.hasOwnProperty.call(effects, name)) {
        return effects[name];
      }
      // should never happen
      return 0;
    }
    seteffectoftarget(args, util) {
      /*
      alert(
        `This block is non-functional, it does not do anything other than executing this alert.
  
        this block is work in progress.
        `
      )
      const effects = target.effects;
      const name = Scratch.Cast.toString(args.EFFECT);
      effects[name]=args.NUMBER;
      */
      const target = getSpriteTargetByName(util, args.TARGET);
      if (!target) {
        return;
      }
      const effect = Scratch.Cast.toString(args.EFFECT)
      let value = Scratch.Cast.toNumber(args.NUMBER);
      util.target.setEffect(effect, value);
    }
    changeeffectoftarget(args, util) {
      /*
      alert(
        `This block is non-functional, it does not do anything other than executing this alert.
  
        this block is work in progress.
        `
      )
      */
      const target = getSpriteTargetByName(util, args.TARGET);
      if (!target) {
        return;
      }
      const effects = target.effects;
      const name = Scratch.Cast.toString(args.EFFECT);
      const effect = Scratch.Cast.toString(args.EFFECT)
      let number = Scratch.Cast.toNumber(args.NUMBER);
      let value = (Number(number) + Number(effects[name]))
      util.target.setEffect(effect, value);
    }
    // copied from https://extensions.turbowarp.org/Lily/LooksPlus.js
    snapshotStage(args, util) {
      return new Promise((resolve) => {
        Scratch.vm.runtime.renderer.requestSnapshot((uri) => {
          resolve(uri);
        });
      });
    }
    // copied from https://extensions.turbowarp.org/Lily/LooksPlus.js
    replaceCostumeContent(args, util) {
      const costumeIndex = this.getCostumeInput(args.COSTUME, util.target);
      const costume = util.target.sprite.costumes[costumeIndex];
      if (!costume) {
        console.error("Costume doesn't exist");
        return;
      }

      //This is here to ensure no changes are made to bitmap costumes, as changes are irreversible
      //Check will be removed when it's possible to edit bitmap skins
      const format = costume.asset.assetType.runtimeFormat;
      if (format !== "svg") {
        console.error("Costume is not vector");
        return;
      }

      const contentType = args.TYPE;
      const content = args.CONTENT;
      if (contentType === "SVG") {
        Scratch.vm.runtime.renderer.updateSVGSkin(
          costume.skinId,
          Scratch.Cast.toString(content)
        );
      } else {
        console.error("Options other than SVG are currently unavailable");
        return;
      }
      Scratch.vm.emitTargetsUpdate();
    }
    // copied from https://extensions.turbowarp.org/Lily/LooksPlus.js
    restoreCostumeContent(args, util) {
      const costumeIndex = this.getCostumeInput(args.COSTUME, util.target);
      const costume = util.target.sprite.costumes[costumeIndex];
      if (!costume) {
        console.error("Costume doesn't exist");
        return;
      }

      if (!requireNonPackagedRuntime("restore costume content")) {
        return;
      }

      //This is here to ensure no changes are made to bitmap costumes, as changes are irreversible
      //Check will be removed when it's possible to edit bitmap skins
      const format = costume.asset.assetType.runtimeFormat;
      if (format !== "svg") {
        console.error("Costume is not vector");
        return;
      }

      const content = costume.asset.decodeText();
      const rotationCenterX = costume.rotationCenterX;
      const rotationCenterY = costume.rotationCenterY;
      util.target.renderer.updateSVGSkin(costume.skinId, content, [
        rotationCenterX,
        rotationCenterY,
      ]);
    }
    // copied from https://extensions.turbowarp.org/Lily/LooksPlus.js
    replaceColors(args, util) {
      const svg = Scratch.Cast.toString(args.SVG);
      const color1 = args.COLOR1;
      const color2 = args.COLOR2;
      try {
        return svg.replace(new RegExp(color1, "gi"), color2);
      } catch (e) {
        // regex was invalid, don't replace anything
        return svg;
      }
    }
    getCostumeNumName(args, util) {
      const target = getSpriteTargetByName(util, args.TARGET);
      if (args.NUMBER_NAME === 'number') {
        return target.currentCostume + 1;
      }
      // Else return name
      return target.getCostumes()[target.currentCostume].name;
    }
    getSizeOfTarget(args, util) {
      const target = getSpriteTargetByName(util, args.TARGET);
      return Math.round(target.size);
    }
    targetCostumeNumber(args, util) {
      const target = getSpriteTargetByName(util, args.TARGET);
      if (!target) {
        return 0;
      }
      return Scratch.Cast.toNumber(target.sprite.costumes.length);
    }
    switchCostumeDif(args, util) {
      const target = getSpriteTargetByName(util, args.TARGET);
      let min = 1;
      let max = target.sprite.costumes.length;
      if (args.OTHER_COSTUMES === 'previous') {
        target.setCostume(target.currentCostume - 1);
      } else if (args.OTHER_COSTUMES === 'next') {
        target.setCostume(target.currentCostume + 1);
      } else if (args.OTHER_COSTUMES === 'random') {
        target.setCostume(Math.floor(Math.random() * (max - min + 1) + min));
      } else {

      }
    }
    switchCostumeDif2(args, util) {
      const target = getSpriteTargetByName(util, args.TARGET);
      target.setCostume(this.getCostumeInput(args.COSTUME, target));
    }
    // copied from https://extensions.turbowarp.org/Lily/LooksPlus.js
    getCostumeInput(costume, target) {
      if (typeof costume === "number") {
        costume = Math.round(costume - 1);
        if (costume === Infinity || costume === -Infinity || !costume) {
          costume = 0;
        }
        costume = this.wrapClamp(costume, 0, target.sprite.costumes.length - 1);
        return costume;
      } else {
        return target.getCostumeIndexByName(Scratch.Cast.toString(costume));
      }
    }
    // copied from https://extensions.turbowarp.org/Lily/LooksPlus.js
    wrapClamp(n, min, max) {
      const range = max - min + 1;
      return n - Math.floor((n - min) / range) * range;
    }
}
Scratch.extensions.register(new LooksExtension());
})(Scratch);
