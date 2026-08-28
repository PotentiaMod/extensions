(async function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed)
    throw new Error("This extension must run unsandboxed!");

  if (Scratch.gui)
    Scratch.gui.getBlockly().then((ScratchBlocks) => {
      ScratchBlocks.BlockSvg.registerCustomNotch(
        "ddeFunnyNotches-spidor",
        "l 14.4 8 l -3.6 -8 h 14.4 l -3.6 8 l 14.4 -8"
      );
      ScratchBlocks.BlockSvg.registerCustomNotch(
        "ddeFunnyNotches-handy",
        "h 6.5455 v 6 q -6.5455 0 -6.5455 6 a 15 3.2727 90 0 0 3.2727 0 a 30 3.2727 90 0 0 3.2727 0 a 34.5 3.2727 90 0 0 3.2727 0 a 30 3.2727 90 0 0 3.2727 0 a 22.5 3.2727 90 0 0 3.2727 0 q 0 -6 -6.5455 -6 v -6 h 9.8182 h 6.5455 v 6 q -6.5455 0 -6.5455 6 a 22.5 3.2727 90 0 0 3.2727 0 a 30 3.2727 90 0 0 3.2727 0 a 34.5 3.2727 90 0 0 3.2727 0 a 30 3.2727 90 0 0 3.2727 0 a 15 3.2727 90 0 0 3.2727 0 q 0 -6 -6.5455 -6 v -6 h 6.5455"
      );
      ScratchBlocks.BlockSvg.registerCustomNotch(
        "ddeFunnyNotches-footy",
        "h 7.2 v 10.8 q -7.2 0 -7.2 3.6 q 0 3.6 4.8 3.6 h 7.2 q 2.4 0 2.4 -1.8 v -16.2 h 7.2 v 16.2 q 0 1.8 2.4 1.8 h 7.2 q 4.8 0 4.8 -3.6 q 0 -3.6 -7.2 -3.6 v -10.8 h 7.2"
      );
      ScratchBlocks.BlockSvg.registerCustomNotch(
        "ddeFunnyNotches-reverse",
        "c 2 0 3 -1 4 -2 l 4 -4 c 1 -1 2 -2 4 -2 h 12 c 2 0 3 1 4 2 l 4 4 c 1 1 2 2 4 2"
      );
    });

  class ddeFunnyNotches {
    getInfo() {
      return {
        id: "ddeFunnyNotches",
        name: "dde funny notches",
        color1: "#55aa52",
        blocks: [
          {
            opcode: "blockspidor",
            blockType: Scratch.BlockType.COMMAND,
            text: "this is a block",
            notchAccepts: "ddeFunnyNotches-spidor",
          },
          {
            opcode: "blockhand",
            blockType: Scratch.BlockType.COMMAND,
            text: "hello haha",
            notchAccepts: "ddeFunnyNotches-handy",
          },
          {
            opcode: "blockfeet",
            blockType: Scratch.BlockType.COMMAND,
            text: "oh my gort",
            notchAccepts: "ddeFunnyNotches-footy",
          },
          {
            opcode: "blockreverse",
            blockType: Scratch.BlockType.COMMAND,
            text: "what the freak",
            notchAccepts: "ddeFunnyNotches-reverse",
          },
        ],
      };
    }

    blockspidor() {
      return true;
    }

    blockhand() {
      return true;
    }

    blockfeet() {
      return true;
    }

    blockreverse() {
      return true;
    }
  }

  Scratch.extensions.register(new ddeFunnyNotches());
})(Scratch);
