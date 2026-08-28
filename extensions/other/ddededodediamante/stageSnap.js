(function (Scratch) {
  "use strict";

  const vm = Scratch.vm;

  class ddeStageSnap {
    constructor() {
      this.margin = {
        x: 0,
        y: 0,
      };
    }

    getInfo() {
      return {
        id: "ddeStageSnap",
        name: "Stage Snap",
        color1: "#4067b9",
        blocks: [
          {
            opcode: "goToStageSide",
            text: "go to stage's [SIDE]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              SIDE: {
                type: Scratch.ArgumentType.STRING,
                menu: "sides",
              },
            },
          },
          {
            opcode: "setMargin",
            text: "set [AXIS] margin to [NUM] px",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              AXIS: {
                type: Scratch.ArgumentType.STRING,
                menu: "axis",
              },
              NUM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            opcode: "stagePercent",
            text: "stage [AXIS] percent [NUM] %",
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              AXIS: {
                type: Scratch.ArgumentType.STRING,
                menu: "axis",
              },
              NUM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50,
              },
            },
          },
          {
            opcode: "stageProperty",
            text: "stage [PROPERTY]",
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              PROPERTY: {
                type: Scratch.ArgumentType.STRING,
                menu: "stageproperty",
              },
            },
          },
          {
            opcode: "stageSide",
            text: "[AXIS] of stage [SIDE]",
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              AXIS: {
                type: Scratch.ArgumentType.STRING,
                menu: "axis",
              },
              SIDE: {
                type: Scratch.ArgumentType.STRING,
                menu: "sides",
              },
            },
          },
        ],
        menus: {
          axis: {
            acceptReporters: true,
            items: ["x", "y"],
          },
          stageproperty: {
            acceptReporters: true,
            items: ["width", "height", "x margin", "y margin"],
          },
          sides: {
            acceptReporters: true,
            items: [
              "center",
              "top left",
              "top right",
              "bottom left",
              "bottom right",
              "top",
              "bottom",
              "left",
              "right",
            ],
          },
        },
      };
    }

    getStageSize() {
      return vm.renderer._nativeSize;
    }

    getSidePosition(side) {
      const [width, height] = this.getStageSize();
      const halfW = width / 2;
      const halfH = height / 2;
      const margin = this.margin;

      switch (side) {
        case "center":
          return { x: 0, y: 0 };
        case "top left":
          return { x: -halfW + margin.x, y: halfH - margin.y };
        case "top right":
          return { x: halfW - margin.x, y: halfH - margin.y };
        case "bottom left":
          return { x: -halfW + margin.x, y: -halfH + margin.y };
        case "bottom right":
          return { x: halfW - margin.x, y: -halfH + margin.y };
        case "top":
          return { x: 0, y: halfH - margin.y };
        case "bottom":
          return { x: 0, y: -halfH + margin.y };
        case "left":
          return { x: -halfW + margin.x, y: 0 };
        case "right":
          return { x: halfW - margin.x, y: 0 };
      }

      return { x: 0, y: 0 };
    }

    setMargin({ AXIS, NUM }) {
      const value = Scratch.Cast.toNumber(NUM ?? 0);
      if (AXIS === "x") this.margin.x = value;
      if (AXIS === "y") this.margin.y = value;
    }

    goToStageSide({ SIDE }, util) {
      const target = util.target;
      if (target.isStage) return;

      const pos = this.getSidePosition(SIDE);
      target.setXY(pos.x, pos.y);
    }

    stagePercent({ AXIS, NUM }) {
      const [width, height] = this.getStageSize();
      const percent = Scratch.Cast.toNumber(NUM) / 100;

      if (AXIS === "x") {
        return (percent - 0.5) * width;
      } else {
        return (percent - 0.5) * height;
      }
    }

    stageProperty({ PROPERTY }) {
      const [width, height] = this.getStageSize();
      if (PROPERTY === "width") return width;
      if (PROPERTY === "height") return height;
      if (PROPERTY === "x margin") return this.margin.x;
      if (PROPERTY === "y margin") return this.margin.y;
    }

    stageSide({ AXIS, SIDE }) {
      const position = this.getSidePosition(SIDE);
      return AXIS === "x" ? position.x : position.y;
    }
  }

  Scratch.extensions.register(new ddeStageSnap());
})(Scratch);
