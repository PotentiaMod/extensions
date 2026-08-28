(function (Scratch) {
  "use strict";

  const isPM = Scratch.extensions?.isPenguinMod ?? false;

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('The extension "Super Temporary Variables" must run unsandboxed!');
  }
  if (!isPM) {
    throw new Error(
      'The extension "Super Temporary Variables" is only compatible with PenguinMod!',
    );
  }

  const VARS_KEY = Symbol("ddeSuperTempVars");

  function getFrameVars(frame) {
    if (!frame[VARS_KEY]) frame[VARS_KEY] = Object.create(null);
    return frame[VARS_KEY];
  }

  function findFrame(thread, name) {
    const frames = thread.stackFrames;
    for (let i = frames.length - 1; i >= 0; i--) {
      const vars = frames[i][VARS_KEY];
      if (vars && name in vars) return vars;
    }
    return null;
  }

  function currentVars(thread) {
    const frames = thread.stackFrames;
    return getFrameVars(frames[frames.length - 1]);
  }

  class ddeSuperTempVars {
    getInfo() {
      return {
        id: "ddeSuperTempVars",
        name: "Super Temporary Variables",
        color1: "#5960c0",
        blocks: [
          {
            opcode: "new",
            blockType: Scratch.BlockType.COMMAND,
            text: "new [NAME]",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "name" },
            },
          },
          {
            opcode: "set",
            blockType: Scratch.BlockType.COMMAND,
            text: "set [NAME] to [VALUE]",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "name" },
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            },
          },
          {
            opcode: "get",
            blockType: Scratch.BlockType.REPORTER,
            text: "get [NAME]",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "name" },
            },
          },
        ],
      };
    }

    new({ NAME }, util) {
      const vars = currentVars(util.thread);
      if (!(NAME in vars)) vars[NAME] = null;
    }

    set({ NAME, VALUE }, util) {
      const vars = findFrame(util.thread, NAME) ?? currentVars(util.thread);
      vars[NAME] = VALUE;
    }

    get({ NAME }, util) {
      const vars = findFrame(util.thread, NAME);
      return vars ? vars[NAME] : "";
    }
  }

  Scratch.extensions.register(new ddeSuperTempVars());
})(Scratch);
