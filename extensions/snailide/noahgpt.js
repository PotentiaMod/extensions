
// Made with PenguinBuilder 2.6
// use PenguinBuilder at "https://chickencuber.github.io/PenguinBuilder/"
(function(Scratch) {
  const blocks = [];
  const vars = {};
  const menus = {};
const key = 'https://c.ai/c/SuGJTIu7niq55uscGvNj0-TJCleEsB2vNDgH_tsh7b4'
  

  class Extension {
    getInfo() {
      return {
        "id": "noahgpt",
        "name": "noahgpt",
        "color1": "#383838",
        "blocks": blocks,
        "menus": menus,
      }
    }
  }
  
blocks.push({
  opcode: "noahgpt_Block_prompt-noahgpt",
  blockType: Scratch.BlockType.REPORTER,
  text: "prompt [input] to noahgpt",
  arguments: {
      "input": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: `how are you?`
    },

  },
  disableMonitor: false
});
Extension.prototype["noahgpt_Block_prompt-noahgpt"] = function(args, util) {
	const input = args.input
  const localVars = {};
    return Scratch.fetch(key, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
	  'Origin': 'https://c.ai/c/SuGJTIu7niq55uscGvNj0-TJCleEsB2vNDgH_tsh7b4',
	  'Referer': 'https://c.ai/c/SuGJTIu7niq55uscGvNj0-TJCleEsB2vNDgH_tsh7b4'
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: input }],
},



  Scratch.extensions.register(new Extension()),
})(Scratch)}
