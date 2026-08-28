(function (Scratch) {
  // Made by ddededodediamante
  "use strict";

  const isPM = Scratch.extensions?.isPenguinMod ?? false;

  if (!Scratch.extensions.unsandboxed) {
    window.alert('The extension "Template" must be ran unsandboxed!');
    throw new Error('The extension "Template" must be ran unsandboxed!');
  }
  
  class ddeTemplate {
    getInfo() {
      return {
        id: "ddeTemplate",
        name: "Template",
        color1: "#59c081",
        blocks: [],
        menus: {},
      };
    }
  }

  Scratch.extensions.register(new ddeTemplate());
})(Scratch);
