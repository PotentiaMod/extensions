(async function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed)
    throw new Error("This extension must run unsandboxed!");

  // Thanks sharkpool for original patch!
  if (Scratch.gui)
    Scratch.gui.getBlockly().then((SB) => {
      function waitForBlocks(ids, callback) {
        const check = () => {
          if (ids.every((id) => SB.Blocks[id])) {
            callback(SB);
          } else {
            requestAnimationFrame(check);
          }
        };
        check();
      }

      const buttocks = (width, height) => {
        width -= 18;
        height /= 2;
        return `M 9 0 a 1 1 0 0 0 0 ${height} a 1 1 0 0 0 0 ${height} h ${width} a 1 1 0 0 0 0 -${height} a 1 1 0 0 0 0 -${height} h -${width} z`;
      };

      const octagon = (width, height) => {
        width -= 18;
        return `M 9 0 l -10 10 v ${
          height - 20
        } l 10 10 h ${width} l 10 -10 v -${
          height - 20
        } l -10 -10 h -${width} z`;
      };

      const roundPuzzle = (width, height) => {
        height -= 20;
        height /= 2;
        width -= 20;
        return `M 20 0 q -10 0 -10 ${height} q -10 0 -10 10 q 0 10 10 10 q 0 ${height} 10 ${height} H ${width} q 10 0 10 -${height} q 10 0 10 -10 q 0 -10 -10 -10 q 0 -${height} -10 -${height} H 20 Z`;
      };

      const ogRender = SB.BlockSvg.prototype.render;
      SB.BlockSvg.prototype.render = function (...args) {
        const data = ogRender.call(this, ...args);

        if (this?.svgPath_ && this?.type?.startsWith("ddeTestExt_")) {
          function getShape(block) {
            let { width, height } = block;
            let safeType = block.type.replace("ddeTestExt_", "");
            let outputs = block?.outputConnection?.check_ ?? [];

            if (safeType === "octagon") return octagon(width, height);
            if (outputs.includes("Boolean")) return buttocks(width, height);
            else return roundPuzzle(width, height);
          }

          if (this?.outputConnection?.check_?.length > 0) {
            this.svgPath_.setAttribute("d", getShape(this));
          }

          this.inputList.forEach((input) => {
            const block = input?.connection?.targetBlock();
            if (block && block?.svgPath_ && block?.outputConnection) {
              block.svgPath_.setAttribute("d", getShape(block));
            }
          });
        }

        return data;
      };

      waitForBlocks(["ddeTestExt_shapeshifting", "ddeTestExt_hey"], (SB) => {
        SB.Blocks["ddeTestExt_shapeshifting"].onchange = function (event) {
          if (
            !this.workspace ||
            event.type !== "change" ||
            event?.blockId !== this?.childBlocks_?.at(0)?.id
          )
            return;

          if (event.name === "MODE" && event.element === "field") {
            this.unplug(true);
            if (event.newValue === "STATEMENT") {
              this.setOutput(false);
              this.setPreviousStatement(true);
              this.setNextStatement(true);
            } else if (event.newValue === "OUTPUT") {
              this.setPreviousStatement(false);
              this.setNextStatement(false);
              this.setOutput(true, ["Number"]);
            }
          }
        };

        SB.Blocks["ddeTestExt_hey"].init = function () {
          this.appendDummyInput().appendField("run this");
          this.appendStatementInput("code").setCheck(null);
          this.appendDummyInput().appendField("and also run below");
          this.setColour("#81aaef");
          this.setTooltip("this is a tooltip");
          this.setNextStatement(true, null);
          this.isHat_ = true;
        };
      });
    });

  // Made by ddededodediamante

  class ddeTestExt {
    getInfo() {
      return {
        id: "ddeTestExt",
        name: "dde Text Extension",
        color1: "#ee74b5",
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
          {
            opcode: "poop",
            blockType: Scratch.BlockType.REPORTER,
            text: "poop",
          },
          {
            opcode: "octagon",
            blockType: Scratch.BlockType.REPORTER,
            text: "this is an octagon",
          },
          {
            opcode: "ddededodediamante",
            blockType: Scratch.BlockType.REPORTER,
            text: "ddededodediamante [VAL]",
            arguments: {
              VAL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "value",
              },
            },
          },
          {
            opcode: "tornadoAlert",
            blockType: Scratch.BlockType.COMMAND,
            text: "send a tornado alert",
          },
          {
            opcode: "ifThenDoNothing",
            blockType: Scratch.BlockType.COMMAND,
            text: "if [BOOLEAN] then do nothing",
            arguments: {
              BOOLEAN: {
                type: Scratch.ArgumentType.BOOLEAN,
              },
            },
          },
          {
            opcode: "shapeshifting",
            blockType: Scratch.BlockType.COMMAND,
            text: "i am [MODE]",
            arguments: {
              MODE: {
                type: Scratch.ArgumentType.STRING,
                menu: "MODE",
              },
            },
          },
          {
            opcode: "hey",
            blockType: Scratch.BlockType.CONDITIONAL,
            text: "run this [code] and also run below",
            color1: "#81aaef",
            arguments: {
              code: {
                type: Scratch.ArgumentType.STACK,
              },
            },
            branches: [
              {
                name: "code"
              },
            ],
          },
        ],
        menus: {
          MODE: {
            acceptReporters: true,
            items: [
              {
                text: "statement",
                value: "STATEMENT",
              },
              {
                text: "output",
                value: "OUTPUT",
              },
            ],
          },
        },
      };
    }

    true() {
      return true;
    }

    false() {
      return false;
    }

    poop() {
      return "💩";
    }

    octagon() {
      return "🛑";
    }

    ddededodediamante(args) {
      return "ddededodediamante " + String(args.VAL);
    }

    tornadoAlert() {
      window.alert("Hi tornado incoming :D");
    }

    ifThenDoNothing(args) {
      if (args.BOOLEAN === true) "do nothing";
    }

    shapeshifting(args) {
      if (args.MODE === "STATEMENT") {
        window.alert("Statement!");
        return "";
      } else return Math.random();
    }

    hey(args, util) {
      util.startBranch(1, false);
    }
  }

  Scratch.extensions.register(new ddeTestExt());
})(Scratch);
