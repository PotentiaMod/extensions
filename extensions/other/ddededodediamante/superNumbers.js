(function (Scratch) {
  // Made by ddededodediamante

  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('The extension "Super Numbers" must run unsandboxed!');
  }

  const vm = Scratch.vm;

  class SuperNumberType {
    customId = "ddeSuperNumber";

    states = []; // [{ value: number, weight: number }]

    constructor(states = []) {
      this.states = states.map(s => ({
        value: Number(s.value) || 0,
        weight: Number(s.weight) || 0,
      }));
    }

    static from(x) {
      if (x instanceof SuperNumberType) {
        return new SuperNumberType([...x.states]);
      }
      const n = Number(x);
      if (!isNaN(n)) return new SuperNumberType([{ value: n, weight: 1 }]);
      return new SuperNumberType([{ value: 0, weight: 1 }]);
    }

    collapse() {
      if (this.states.length === 0) return 0;
      const total = this._totalWeight();
      if (total === 0) return this.states[0].value;
      let r = Math.random() * total;
      for (const s of this.states) {
        r -= Math.abs(s.weight);
        if (r <= 0) return s.value;
      }
      return this.states[this.states.length - 1].value;
    }

    mean() {
      const total = this._totalWeight();
      if (total === 0 || this.states.length === 0) return 0;
      return (
        this.states.reduce((acc, s) => acc + s.value * Math.abs(s.weight), 0) / total
      );
    }

    _totalWeight() {
      return this.states.reduce((acc, s) => acc + Math.abs(s.weight), 0);
    }

    toString() {
      if (this.states.length === 0) return "(empty)";
      return this.states.map(s => `${s.value}×${s.weight}`).join(" + ");
    }
  }

  const ddeSuperNumber = {
    Type: SuperNumberType,
    Block: {
      blockType: Scratch.BlockType.REPORTER,
      disableMonitor: true,
      forceOutputType: "SuperNumber",
    },
    Argument: {
      check: ["SuperNumber"],
    },
  };

  class Extension {
    constructor() {
      vm.ddeSuperNumber = ddeSuperNumber;
      vm.runtime.registerCompiledExtensionBlocks(
        "ddesupernumberext",
        this.getCompileInfo(),
      );
      vm.runtime.registerSerializer(
        "ddeSuperNumber",
        v => v.states.map(s => [s.value, s.weight]),
        v => new SuperNumberType(v.map(([value, weight]) => ({ value, weight }))),
      );
    }

    getInfo() {
      return {
        id: "ddesupernumber",
        name: "Super Numbers",
        color1: "#1a7dff",
        blocks: [
          {
            opcode: "fromNumber",
            text: "super number from [NUM]",
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              NUM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
            ...ddeSuperNumber.Block,
          },
          {
            opcode: "currentSuperNumber",
            text: "current super number",
            hideFromPalette: true,
            canDragDuplicate: true,
            ...ddeSuperNumber.Block,
          },
          {
            opcode: "builder",
            text: "super number builder [CURRENT]",
            disableMonitor: true,
            arguments: {
              CURRENT: {
                fillIn: "currentSuperNumber",
              },
            },
            branches: [{}],
            ...ddeSuperNumber.Block,
          },
          {
            opcode: "builderAddState",
            text: "add state [VALUE] weight [WEIGHT]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              WEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
          {
            opcode: "builderSetWeight",
            text: "set weight of state [VALUE] to [WEIGHT]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              WEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
          {
            opcode: "builderRemoveState",
            text: "remove state [VALUE]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            opcode: "builderSet",
            text: "set builder to [VALUE]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              VALUE: {
                check: ["SuperNumber"],
              },
            },
          },
          "---",
          {
            opcode: "collapse",
            text: "collapse [SN]",
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              SN: { ...ddeSuperNumber.Argument },
            },
          },
          {
            opcode: "getProperty",
            text: "get [PROP] of [SN]",
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              PROP: {
                type: Scratch.ArgumentType.STRING,
                menu: "properties",
              },
              SN: { ...ddeSuperNumber.Argument },
            },
          },
          {
            opcode: "getStateValue",
            text: "value of state [INDEX] in [SN]",
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
              SN: { ...ddeSuperNumber.Argument },
            },
          },
          {
            opcode: "getStateWeight",
            text: "weight of state [INDEX] in [SN]",
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
              SN: { ...ddeSuperNumber.Argument },
            },
          },
          "---",
          {
            opcode: "mapValues",
            text: "[OP] [VALUE] to all values in [SN]",
            arguments: {
              OP: {
                type: Scratch.ArgumentType.STRING,
                menu: "arithmetic",
              },
              VALUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
              SN: { ...ddeSuperNumber.Argument },
            },
            ...ddeSuperNumber.Block,
          },
          {
            opcode: "mapWeights",
            text: "[OP] [VALUE] to all weights in [SN]",
            arguments: {
              OP: {
                type: Scratch.ArgumentType.STRING,
                menu: "arithmetic",
              },
              VALUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
              SN: { ...ddeSuperNumber.Argument },
            },
            ...ddeSuperNumber.Block,
          },
          {
            opcode: "superArithmetic",
            text: "[OP] [B] to [A]",
            arguments: {
              OP: {
                type: Scratch.ArgumentType.STRING,
                menu: "arithmetic",
              },
              A: { ...ddeSuperNumber.Argument },
              B: { ...ddeSuperNumber.Argument },
            },
            ...ddeSuperNumber.Block,
          },
          {
            opcode: "merge",
            text: "merge [A] and [B]",
            arguments: {
              A: { ...ddeSuperNumber.Argument },
              B: { ...ddeSuperNumber.Argument },
            },
            ...ddeSuperNumber.Block,
          },
          "---",
          {
            opcode: "compare",
            text: "is [A] [CMP] than [B]",
            blockType: Scratch.BlockType.BOOLEAN,
            arguments: {
              A: { ...ddeSuperNumber.Argument },
              CMP: {
                type: Scratch.ArgumentType.STRING,
                menu: "compare",
              },
              B: { ...ddeSuperNumber.Argument },
            },
          },
        ],
        menus: {
          properties: {
            acceptReporters: true,
            items: [
              { text: "mean", value: "mean" },
              { text: "min value", value: "min" },
              { text: "max value", value: "max" },
              { text: "state count", value: "count" },
              { text: "total weight", value: "totalWeight" },
              { text: "spread", value: "spread" },
              { text: "variance", value: "variance" },
            ],
          },
          arithmetic: {
            acceptReporters: true,
            items: ["add", "subtract", "multiply", "divide", "set"],
          },
          compare: {
            acceptReporters: true,
            items: [
              { text: "greater mean", value: "greaterMean" },
              { text: "lesser mean", value: "lesserMean" },
              { text: "more spread", value: "moreSpread" },
              { text: "more states", value: "moreStates" },
              { text: "heavier", value: "heavier" },
            ],
          },
        },
      };
    }

    // Thanks to dogeIsCut and jwklong for helping with this part! (carried over from Super Booleans)
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
            compiler.source += "    thread._ddesupernumberextBuilderIndex ??= [];";
            compiler.source += "    thread._ddesupernumberextBuilderIndex.push([]);";
            compiler.descendStack(
              node.substack,
              new imports.Frame(false, undefined, true),
            );
            compiler.source +=
              "    const __states = thread._ddesupernumberextBuilderIndex.pop();";
            compiler.source += "    return new runtime.vm.ddeSuperNumber.Type(__states);";
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

    _getBuilderStack(util) {
      const stack = util.thread._ddesupernumberextBuilderIndex;
      if (!stack || !stack.length) {
        throw 'This block must be inside of a "super number builder" block.';
      }
      return stack;
    }

    _applyOp(op, a, b) {
      switch (op) {
        case "add":
          return a + b;
        case "subtract":
          return a - b;
        case "multiply":
          return a * b;
        case "divide":
          return b === 0 ? a : a / b;
        case "set":
          return b;
      }
      return a;
    }

    fromNumber({ NUM }) {
      return new SuperNumberType([{ value: Scratch.Cast.toNumber(NUM), weight: 1 }]);
    }

    currentSuperNumber({ }, util) {
      const stack = this._getBuilderStack(util);
      return new SuperNumberType(stack[stack.length - 1]);
    }

    async builder({ }, util) {
      return "noop";
    }

    builderAddState({ VALUE, WEIGHT }, util) {
      const stack = this._getBuilderStack(util);
      const top = stack[stack.length - 1];
      top.push({
        value: Scratch.Cast.toNumber(VALUE),
        weight: Scratch.Cast.toNumber(WEIGHT),
      });
    }

    builderSetWeight({ VALUE, WEIGHT }, util) {
      const stack = this._getBuilderStack(util);
      const top = stack[stack.length - 1];
      const v = Scratch.Cast.toNumber(VALUE);
      const w = Scratch.Cast.toNumber(WEIGHT);
      const existing = top.find(s => s.value === v);
      if (existing) {
        existing.weight = w;
      } else {
        top.push({ value: v, weight: w });
      }
    }

    builderRemoveState({ VALUE }, util) {
      const stack = this._getBuilderStack(util);
      const top = stack[stack.length - 1];
      const v = Scratch.Cast.toNumber(VALUE);
      const idx = top.findIndex(s => s.value === v);
      if (idx !== -1) top.splice(idx, 1);
    }

    builderSet({ VALUE }, util) {
      const stack = this._getBuilderStack(util);
      const sn = SuperNumberType.from(VALUE);
      stack[stack.length - 1] = sn.states.map(s => ({ ...s }));
    }

    collapse({ SN }) {
      return SuperNumberType.from(SN).collapse();
    }

    getProperty({ PROP, SN }) {
      const sn = SuperNumberType.from(SN);
      const states = sn.states;

      switch (PROP) {
        case "mean":
          return sn.mean();
        case "min":
          return states.length === 0 ? 0 : Math.min(...states.map(s => s.value));
        case "max":
          return states.length === 0 ? 0 : Math.max(...states.map(s => s.value));
        case "count":
          return states.length;
        case "totalWeight":
          return sn._totalWeight();
        case "spread": {
          if (states.length < 2) return 0;
          return (
            Math.max(...states.map(s => s.value)) - Math.min(...states.map(s => s.value))
          );
        }
        case "variance": {
          const mean = sn.mean();
          const total = sn._totalWeight();
          if (total === 0) return 0;
          return (
            states.reduce(
              (acc, s) => acc + Math.abs(s.weight) * (s.value - mean) ** 2,
              0,
            ) / total
          );
        }
      }
      return 0;
    }

    getStateValue({ INDEX, SN }) {
      const sn = SuperNumberType.from(SN);
      const i = Scratch.Cast.toNumber(INDEX) - 1;
      if (i < 0 || i >= sn.states.length) return 0;
      return sn.states[i].value;
    }

    getStateWeight({ INDEX, SN }) {
      const sn = SuperNumberType.from(SN);
      const i = Scratch.Cast.toNumber(INDEX) - 1;
      if (i < 0 || i >= sn.states.length) return 0;
      return sn.states[i].weight;
    }

    mapValues({ OP, VALUE, SN }) {
      const sn = SuperNumberType.from(SN);
      const v = Scratch.Cast.toNumber(VALUE);
      return new SuperNumberType(
        sn.states.map(s => ({ value: this._applyOp(OP, s.value, v), weight: s.weight })),
      );
    }

    mapWeights({ OP, VALUE, SN }) {
      const sn = SuperNumberType.from(SN);
      const v = Scratch.Cast.toNumber(VALUE);
      return new SuperNumberType(
        sn.states.map(s => ({ value: s.value, weight: this._applyOp(OP, s.weight, v) })),
      );
    }

    superArithmetic({ OP, A, B }) {
      // The crazy part: every state in A paired with every state in B (cartesian product).
      // The resulting weight is the product of the two states' weights.
      const a = SuperNumberType.from(A);
      const b = SuperNumberType.from(B);
      const result = [];
      for (const sa of a.states) {
        for (const sb of b.states) {
          result.push({
            value: this._applyOp(OP, sa.value, sb.value),
            weight: sa.weight * sb.weight,
          });
        }
      }
      return new SuperNumberType(result);
    }

    merge({ A, B }) {
      const a = SuperNumberType.from(A);
      const b = SuperNumberType.from(B);
      return new SuperNumberType([...a.states, ...b.states]);
    }

    compare({ A, CMP, B }) {
      const a = SuperNumberType.from(A);
      const b = SuperNumberType.from(B);

      const spread = sn =>
        sn.states.length < 2
          ? 0
          : Math.max(...sn.states.map(s => s.value)) -
          Math.min(...sn.states.map(s => s.value));

      switch (CMP) {
        case "greaterMean":
          return a.mean() > b.mean();
        case "lesserMean":
          return a.mean() < b.mean();
        case "moreSpread":
          return spread(a) > spread(b);
        case "moreStates":
          return a.states.length > b.states.length;
        case "heavier":
          return a._totalWeight() > b._totalWeight();
      }
      return false;
    }
  }

  Scratch.extensions.register(new Extension());
})(Scratch);
