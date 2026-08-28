(function (Scratch) {
  // Made by ddededodediamante

  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('The extension "Super Boolean" must run unsandboxed!');
  }

  const vm = Scratch.vm;

  class SuperBooleanType {
    customId = "ddeSuperBoolean";

    t = 0;
    f = 0;

    constructor(t = 0, f = 0) {
      this.t = Number(t) || 0;
      this.f = Number(f) || 0;
    }

    static from(x) {
      if (x instanceof SuperBooleanType) {
        return new SuperBooleanType(x.t, x.f);
      }

      if (typeof x === "boolean") {
        return x
          ? new SuperBooleanType(1, 0)
          : new SuperBooleanType(0, 1);
      }

      if (typeof x === "number") {
        return new SuperBooleanType(x, 1 - x);
      }

      return new SuperBooleanType(0, 0);
    }

    collapse() {
      const T = Math.abs(this.t);
      const F = Math.abs(this.f);
      const total = T + F;

      if (total === 0) return false;
      return Math.random() < T / total;
    }

    toString() {
      const t = this.t * 100;
      const f = this.f * 100;
      return `${t}% true, ${f}% false`;
    }

    toMonitorContent() {
      const span = document.createElement("span");
      span.textContent = this.toString();
      span.style.textDecoration = "underline";
      return span;
    }

    toReporterContent() {
      const div = document.createElement("divide");
      div.textContent = this.toString();
      div.style.textDecoration = "underline double";
      return div;
    }

    dogeiscutSetHandler() {
      return toString();
    }

    jwArrayHandler() {
      return toString();
    }
  }

  const ddeSuperBoolean = {
    Type: SuperBooleanType,
    Block: {
      blockType: Scratch.BlockType.REPORTER,
      blockShape: Scratch.BlockShape.HEXAGONAL,
      forceOutputType: "SuperBoolean",
      disableMonitor: true,
      extensions: ["colours_operators"],
    },
    Argument: {
      shape: Scratch.BlockShape.HEXAGONAL,
      check: ["SuperBoolean", "Boolean"]
    }
  }

  class Extension {
    constructor() {
      vm.ddeSuperBoolean = ddeSuperBoolean;
      vm.runtime.registerCompiledExtensionBlocks(
        "ddesuperbooleanext",
        this.getCompileInfo()
      );
      vm.runtime.registerSerializer(
        "ddeSuperBoolean",
        v => [v.t, v.f],
        v => new SuperBooleanType(v[0], v[1])
      );
    }
    getInfo() {
      return {
        id: "ddesuperbooleanext",
        name: "Super Booleans",
        color1: "#59C059",
        blocks: [
          {
            opcode: "fromBoolean",
            text: "super boolean from [BOOL]",
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              BOOL: {
                ...ddeSuperBoolean.Argument,
              },
            },
            ...ddeSuperBoolean.Block,
          },
          {
            opcode: "currentSuperBoolean",
            text: "current super boolean",
            hideFromPalette: true,
            canDragDuplicate: true,
            ...ddeSuperBoolean.Block
          },
          // Thanks to dogeIsCut and jwklong for helping with this part!
          {
            opcode: "builder",
            text: "super boolean builder [CURRENT]",
            disableMonitor: true,
            arguments: {
              CURRENT: {
                fillIn: "currentSuperBoolean",
              },
            },
            branches: [{}],
            extensions: ["colours_operators"],
            ...ddeSuperBoolean.Block,
          },
          {
            opcode: "builderOperate",
            text: "[OP] [VALUE] on [SIDE] in builder",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              OP: {
                type: Scratch.ArgumentType.STRING,
                menu: "operator",
              },
              VALUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0.25",
              },
              SIDE: {
                type: Scratch.ArgumentType.STRING,
                menu: "side",
              },
            },
            extensions: ["colours_operators"],
          },
          {
            opcode: "builderSet",
            text: "set builder to [VALUE]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              VALUE: {
                shape: Scratch.BlockShape.HEXAGONAL,
                check: ["SuperBoolean", "Boolean"]
              },
            },
            extensions: ["colours_operators"],
          },
          '---',
          {
            opcode: "getProperty",
            text: "get [PROP] of [SB]",
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              PROP: {
                type: Scratch.ArgumentType.STRING,
                menu: "properties",
              },
              SB: {
                ...ddeSuperBoolean.Argument,
              },
            },
            extensions: ["colours_operators"],
          },
          {
            opcode: "collapseSuperBoolean",
            text: "collapse [SB]",
            arguments: {
              SB: {
                ...ddeSuperBoolean.Argument,
              },
            },
            blockType: Scratch.BlockType.BOOLEAN,
          },
          {
            opcode: "invertSuperBoolean",
            text: "invert [SB]",
            arguments: {
              SB: {
                ...ddeSuperBoolean.Argument,
              },
            },
            ...ddeSuperBoolean.Block,
          },
          {
            opcode: "operateOnSide",
            text: "[OP] [VALUE] on [SIDE] of [SB]",
            arguments: {
              OP: {
                type: Scratch.ArgumentType.STRING,
                menu: "operator",
              },
              VALUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0.5",
              },
              SIDE: {
                type: Scratch.ArgumentType.STRING,
                menu: "side",
              },
              SB: {
                ...ddeSuperBoolean.Argument,
              },
            },
            ...ddeSuperBoolean.Block,
          },
          {
            opcode: "operateSuperBooleans",
            text: "[OP] [B] to [A]",
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              OP: {
                type: Scratch.ArgumentType.STRING,
                menu: "operator",
              },
              A: {
                ...ddeSuperBoolean.Argument,
              },
              B: {
                ...ddeSuperBoolean.Argument,
              },
            },
            ...ddeSuperBoolean.Block,
          },
          {
            opcode: "compareSB",
            text: "is [A] [CMP] than [B]",
            blockType: Scratch.BlockType.BOOLEAN,
            arguments: {
              A: { ...ddeSuperBoolean.Argument },
              CMP: {
                type: Scratch.ArgumentType.STRING,
                menu: "compare",
              },
              B: { ...ddeSuperBoolean.Argument },
            },
          },
        ],
        menus: {
          properties: {
            acceptReporters: true,
            items: [
              { text: "true weight", value: "true" },
              { text: "false weight", value: "false" },
              { text: "total weight", value: "total" },
              { text: "bias", value: "bias" },
              { text: "probability true", value: "probabilityTrue" },
              { text: "probability false", value: "probabilityFalse" },
            ],
          },
          side: {
            acceptReporters: true,
            items: ["true", "false", "both"],
          },
          operator: {
            acceptReporters: true,
            items: [
              "add", "remove", "set", "multiply", "divide"
            ],
          },
          compare: {
            acceptReporters: true,
            items: [
              { text: "more true", value: "moreTrue" },
              { text: "more false", value: "moreFalse" },
              { text: "more certain", value: "moreCertain" },
            ],
          },
        },
      };
    }

    // Thanks to dogeIsCut and jwklong for helping with this part!
    getCompileInfo() {
      return {
        ir: {
          builder: (generator, block) => ({
            kind: "input",
            substack: generator.descendSubstack(block, "SUBSTACK"),
          }),
        },
        js: {
          builder: (node, compiler, imports) => {
            const originalSource = compiler.source;

            compiler.source = "(yield* (function*() {";
            compiler.source += "  const __inner = (yield* (function*() {";
            compiler.source += "    thread._ddesuperbooleanextBuilderIndex ??= [];";
            compiler.source += "    thread._ddesuperbooleanextBuilderIndex.push({ t: 0, f: 0 });";
            compiler.descendStack(node.substack, new imports.Frame(false, undefined, true));
            compiler.source += "    const __v = thread._ddesuperbooleanextBuilderIndex.pop();";
            compiler.source += "    return new runtime.vm.ddeSuperBoolean.Type(__v.t, __v.f);";
            compiler.source += "  })());";
            compiler.source += "  return __inner;";
            compiler.source += "})())";

            const stackSource = compiler.source;
            compiler.source = originalSource;

            return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
          },
        },
      };
    }

    fromBoolean({ BOOL }) {
      return SuperBooleanType.from(BOOL);
    }

    currentSuperBoolean({ }, util) {
      const stack = util.thread._ddesuperbooleanextBuilderIndex;
      if (!stack || !stack.length) {
        throw 'This block must be inside of a "super boolean builder" block.';
      }

      const top = stack[stack.length - 1];
      return new SuperBooleanType(top.t, top.f);
    }

    async builder({ }, util) {
      return "noop";
    }

    builderOperate({ OP, VALUE, SIDE }, util) {
      const stack = util.thread._ddesuperbooleanextBuilderIndex;
      if (!stack || !stack.length) {
        throw 'This block must be inside of a "super boolean builder" block.';
      }

      const top = stack[stack.length - 1];
      const v = Scratch.Cast.toNumber(VALUE);

      const apply = (obj, key) => {
        switch (OP) {
          case "add": obj[key] += v; break;
          case "remove": obj[key] -= v; break;
          case "set": obj[key] = v; break;
          case "multiply": obj[key] *= v; break;
          case "divide": obj[key] /= v || 1; break;
        }
      };

      if (SIDE === "true" || SIDE === "both") apply(top, "t");
      if (SIDE === "false" || SIDE === "both") apply(top, "f");
    }

    builderSet({ VALUE }, util) {
      const stack = util.thread._ddesuperbooleanextBuilderIndex;
      if (!stack || !stack.length) {
        throw 'This block must be inside of a "super boolean builder" block.';
      }

      const superboolean = SuperBooleanType.from(VALUE);
      stack[stack.length - 1] = { t: superboolean.t, f: superboolean.f };
    }

    getProperty({ PROP, SB }) {
      const sb = SuperBooleanType.from(SB);

      const T = Math.abs(sb.t);
      const F = Math.abs(sb.f);
      const total = T + F;

      switch (PROP) {
        case "true": return sb.t;
        case "false": return sb.f;
        case "total": return total;
        case "bias": return sb.t - sb.f;
        case "probabilityTrue": return total === 0 ? 0 : T / total;
        case "probabilityFalse": return total === 0 ? 0 : F / total;
      }
    }

    collapseSuperBoolean({ SB }) {
      const sb = SuperBooleanType.from(SB);
      return sb.collapse();
    }

    invertSuperBoolean({ SB }) {
      const sb = SuperBooleanType.from(SB);
      return new SuperBooleanType(sb.f, sb.t);
    }

    operateOnSide({ OP, VALUE, SIDE, SB }) {
      const sb = SuperBooleanType.from(SB);
      const v = Scratch.Cast.toNumber(VALUE);

      const apply = (obj, key) => {
        switch (OP) {
          case "add": obj[key] += v; break;
          case "remove": obj[key] -= v; break;
          case "set": obj[key] = v; break;
          case "multiply": obj[key] *= v; break;
          case "divide": obj[key] /= v || 1; break;
        }
      };

      if (SIDE === "true" || SIDE === "both") apply(sb, "t");
      if (SIDE === "false" || SIDE === "both") apply(sb, "f");

      return sb;
    }

    operateSuperBooleans({ OP, A, B }) {
      const a = SuperBooleanType.from(A);
      const b = SuperBooleanType.from(B);

      switch (OP) {
        case "add":
          return new SuperBooleanType(a.t + b.t, a.f + b.f);
        case "remove":
          return new SuperBooleanType(a.t - b.t, a.f - b.f);
        case "set":
          return new SuperBooleanType(b.t, b.f);
        case "multiply":
          return new SuperBooleanType(a.t * b.t, a.f * b.f);
        case "divide":
          return new SuperBooleanType(
            a.t / (b.t || 1),
            a.f / (b.f || 1)
          );
      }

      return a;
    }

    _certainess(sb) {
      const t = Math.abs(sb.t);
      const f = Math.abs(sb.f);
      const total = t + f || 1;
      return Math.abs(t - f) / total;
    }

    compareSB({ A, CMP, B }) {
      const aRaw = SuperBooleanType.from(A);
      const bRaw = SuperBooleanType.from(B);

      switch (CMP) {
        case "moreTrue":
          return aRaw.t > bRaw.t;

        case "moreFalse":
          return aRaw.f > bRaw.f;

        case "moreCertain":
          return this._certainess(aRaw) > this._certainess(bRaw);
      }

      return false;
    }
  }

  Scratch.extensions.register(new Extension());
})(Scratch);
