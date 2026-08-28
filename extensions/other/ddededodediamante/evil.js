(async function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed)
    throw new Error("This extension must run unsandboxed!");

  // Thanks sharkpool for original patch!
  if (Scratch.gui)
    Scratch.gui.getBlockly().then((SB) => {
      function getShape(block) {
        let { width, height } = block;
        return `M 0 0 H ${width} V ${height} H 0 V 0 Z`;
      }
      
      const ogRender = SB.BlockSvg.prototype.render;
      SB.BlockSvg.prototype.render = function (...args) {
        const data = ogRender.call(this, ...args);

        if (this?.svgPath_) {
          this.svgPath_.setAttribute("d", getShape(this));
        }

        if (this?.inputList)
          this.inputList.forEach((input) => {
            const block = input?.connection?.targetBlock();
            if (block && block?.svgPath_) {
              block.svgPath_.setAttribute("d", getShape(block));
            }
          });

        return data;
      };
    });

  // Made by ddededodediamante

  class ddeEvilExt {
    getInfo() {
      return {
        id: "ddeEVilExt",
        name: "Evil Extension",
        color1: "#b14242",
        blocks: [
          {
            opcode: "true",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "true",
          },
          {
            opcode: "false",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "false",
          },
        ],
      };
    }

    true() {
      return false;
    }

    false() {
      return true;
    }
  }

  Scratch.extensions.register(new ddeEvilExt());
})(Scratch);
