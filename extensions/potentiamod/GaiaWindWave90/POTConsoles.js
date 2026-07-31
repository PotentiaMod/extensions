(function (Scratch) {
	"use strict";
    
	class POTConsoles {
	  getInfo() {
		return {
		  id: "consoles",
		  name: "Consoles",
		  color1: "#8E5AED",
		  blocks: [
			{
			  opcode: "logStuff",
			  blockType: Scratch.BlockType.COMMAND,
			  text: "Log: [TEXT]",
			  arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Welcome to PotentiaMod!"
              },
             },
			},
			////
		   {
			  opcode: "warnStuff",
			  blockType: Scratch.BlockType.COMMAND,
			  text: "Warn: [TEXT]",
			  arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "This mod may contain bugs!"
              },
             },
			},
			////
		   {
			  opcode: "errorStuff",
			  blockType: Scratch.BlockType.COMMAND,
			  text: "Error: [TEXT]",
			  arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Failed to load the mod's UI..."
              },
             },
			},
			////
			{
			  opcode: "infoStuff",
			  blockType: Scratch.BlockType.COMMAND,
			  text: "Info: [TEXT]",
			  arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Remember to correct mistakes."
              },
             },
			},
			////
			{
			  opcode: "trace",
			  blockType: Scratch.BlockType.COMMAND,
			  text: "Trace console",
			},
			////
			{
			  opcode: "collapseGroup",
			  blockType: Scratch.BlockType.COMMAND,
			  text: "Collapse group",
			},
			////
			{
			  opcode: "groupConsole",
			  blockType: Scratch.BlockType.COMMAND,
			  text: "Group console",
			},
			////
			{
			  opcode: "groupConsoleEnd",
			  blockType: Scratch.BlockType.COMMAND,
			  text: "End group console",
			},
			////
			{
			  opcode: "tableInputs_3",
			  blockType: Scratch.BlockType.REPORTER,
			  text: "Table inputs: [A] [B] [C]",
			  arguments: {
			  A: {
			  type: Scratch.ArgumentType.STRING,
			  defaultValue: "a"
			  },
			  B: {
			  type: Scratch.ArgumentType.STRING,
			  defaultValue: "b"
			  },
			  C: {
			  type: Scratch.ArgumentType.STRING,
			  defaultValue: "c"
			  },
			  },
			},
			////
			{
			  opcode: "clearConsole",
			  blockType: Scratch.BlockType.COMMAND,
			  text: "Clear console",
			},
			////
		  ],
		};
	  }
  ////
  async logStuff(args) {
            console.log(args.TEXT);
        }
  ////
  async warnStuff(args) {
            console.warn(args.TEXT);
        }
  ////
  async errorStuff(args) {
            console.error(args.TEXT);
        }
  ////
  async infoStuff(args) {
            console.info(args.TEXT);
        }
  ////
  async groupConsole() {
            console.group();
        }
  ////
  async groupConsoleEnd() {
            console.groupEnd();
        }
  ////
   async trace() {
            console.trace();
        }
  ////
   async collapseGroup() {
            console.groupCollapsed();
        }
  ////
  async tableInputs_3(args) {
let inputA = Scratch.Cast.toString(args.A);
let inputB = Scratch.Cast.toString(args.B);
let inputC = Scratch.Cast.toString(args.C);
  console.table([inputA, inputB, inputC]);
        }
  ////
  async clearConsole() {
            console.clear();
        }
  ////
	}
	Scratch.extensions.register(new POTConsoles());
  })(Scratch);
  