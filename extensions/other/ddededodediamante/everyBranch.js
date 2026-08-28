(function (Scratch) {
  // Made by ddededodediamante

  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('The extension "Every Branch" must run unsandboxed!');
  }

  class Extension {
    getInfo() {
      return {
        id: "ddeeverybranch",
        name: "Every Branch",
        color1: "#59C059",
        blocks: [
          {
            opcode: "hexagonal",
            text: "hex",
            blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.HEXAGONAL,
            branches: [{}],
          },
          {
            opcode: "round",
            text: "rnd",blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.ROUND,
            branches: [{}],
          },
          {
            opcode: "square",
            text: "sqr",blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.SQUARE,
            branches: [{}],
          },
          {
            opcode: "leaf",
            text: "lef",blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.LEAF,
            branches: [{}],
          },
          {
            opcode: "plus",
            text: "pls",blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.PLUS,
            branches: [{}],
          },
          {
            opcode: "octagonal",
            text: "oct",blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.OCTAGONAL,
            branches: [{}],
          },
          {
            opcode: "bumped",
            text: "bum",blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.BUMPED,
            branches: [{}],
          },
          {
            opcode: "indented",
            text: "ind",blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.INDENTED,
            branches: [{}],
          },
          {
            opcode: "scrapped",
            text: "scr",blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.SCRAPPED,
            branches: [{}],
          },
          {
            opcode: "arrow",
            text: "arr",blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.ARROW,
            branches: [{}],
          },
          {
            opcode: "ticket",
            text: "tic",blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.TICKET,
            branches: [{}],
          },
        ],
      };
    }
  }

  Scratch.extensions.register(new Extension());
})(Scratch);
