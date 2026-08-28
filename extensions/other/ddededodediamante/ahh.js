(async function (Scratch) {
  class MinecraftType {
    constructor() {
      this.customId = "ddeTextExtEvil.minecraft";
    }

    toString() {
      return "Minecraft";
    }

    toReporterContent() {
      const scale = 0.5;
      const width = 300;
      const height = 200;

      const wrapper = document.createElement("div");
      wrapper.style.width = width + "px";
      wrapper.style.height = height + "px";
      wrapper.style.overflow = "hidden";

      const iframe = document.createElement("iframe");
      iframe.src = "https://classic.minecraft.net/";

      iframe.style.transform = `scale(${scale})`;
      iframe.style.transformOrigin = "top left";

      iframe.style.width = `${width / scale}px`;
      iframe.style.height = `${height / scale}px`;

      wrapper.appendChild(iframe);
      return wrapper;
    }

    toMonitorContent() {
      const container = document.createElement("p");
      container.innerText = "yeah it doesn't work here";
      return container;
    }

    toListItem() {
      return this.toMonitorContent();
    }

    toListEditor() {
      return this.toString();
    }

    fromListEditor(edit) {
      return new MinecraftType(edit);
    }
  }

  class PenguinModType {
    constructor(where, projectId) {
      this.customId = "ddeTextExtEvil.penguinmod";
      this.where = where || "homepage";
      this.projectId = projectId || "skibidi";
    }

    toString() {
      return "PenguinMod";
    }

    toReporterContent() {
      const url =
        this.where === "homepage"
          ? "https://penguinmod.com/"
          : `https://studio.penguinmod.com/#${this.projectId}`;

      const scale = 0.5;
      const width = 300;
      const height = 200;

      const wrapper = document.createElement("div");
      wrapper.style.width = width + "px";
      wrapper.style.height = height + "px";
      wrapper.style.overflow = "hidden";

      const iframe = document.createElement("iframe");
      iframe.src = url;

      iframe.style.transform = `scale(${scale})`;
      iframe.style.transformOrigin = "top left";

      iframe.style.width = `${width / scale}px`;
      iframe.style.height = `${height / scale}px`;

      wrapper.appendChild(iframe);
      return wrapper;
    }

    toMonitorContent() {
      const container = document.createElement("p");
      container.innerText = "yeah it doesn't work here";
      return container;
    }

    toListItem() {
      return this.toMonitorContent();
    }

    toListEditor() {
      return this.toString();
    }

    fromListEditor(edit) {
      return new PenguinModType(edit);
    }
  }

  class ddeTestExtEvil {
    constructor() {
      this.runtime = Scratch.vm.runtime;
      this.runtime.registerCompiledExtensionBlocks(
        "ddeTestExtEvil",
        this.getCompileInfo()
      );
    }

    getInfo() {
      return {
        id: "ddeTestExtEvil",
        name: "dde Test Extension (EVIL)",
        color1: "#4abcdf",
        blocks: [
          {
            opcode: "compiledIfNot",
            text: "if not [CONDITION] then (compiled)",
            branchCount: 1,
            blockType: Scratch.BlockType.CONDITIONAL,
            arguments: {
              CONDITION: { type: Scratch.ArgumentType.BOOLEAN },
            },
          },
          {
            opcode: "minecraft",
            blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.TICKET,
            text: "minecraft",
            disableMonitor: true
          },
          {
            opcode: "penguinmodHomepage",
            blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.TICKET,
            text: "penguinmod homepage",
            disableMonitor: true
          },
          {
            opcode: "penguinmodProject",
            blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.TICKET,
            text: "penguinmod project with id [projectId]",
            arguments: {
              projectId: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "skibidi",
              },
            },
            disableMonitor: true
          },
        ],
      };
    }

    getCompileInfo() {
      return {
        ir: {
          compiledIfNot: (generator, block) => ({
            kind: "stack",
            condition: generator.descendInputOfBlock(block, "CONDITION"),
            whenTrue: generator.descendSubstack(block, "SUBSTACK"),
            whenFalse: [],
          }),
        },
        js: {
          compiledIfNot: (node, compiler, imports) => {
            compiler.source += `if (!(${compiler
              .descendInput(node.condition)
              .asBoolean()})) {\n`;
            compiler.descendStack(node.whenTrue, new imports.Frame(false));
            if (node.whenFalse.length) {
              compiler.source += `} else {\n`;
              compiler.descendStack(node.whenFalse, new imports.Frame(false));
            }
            compiler.source += `}\n`;
          },
        },
      };
    }

    compiledIfNot(args, util) {
      const condition = Scratch.Cast.toBoolean(args.CONDITION);
      if (!condition) {
        util.startBranch(1, false);
      }
    }

    minecraft() {
      return new MinecraftType();
    }

    penguinmodHomepage() {
      return new PenguinModType("homepage");
    }

    penguinmodProject({ projectId }) {
      return new PenguinModType("project", projectId || "skibidi");
    }
  }

  Scratch.extensions.register(new ddeTestExtEvil());
})(Scratch);
