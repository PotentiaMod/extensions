(function (Scratch) {
	"use strict";
	
	const BlockType = Scratch.BlockType;
    const ArgumentType = Scratch.ArgumentType;
    const Cast = Scratch.Cast;
    
	class BaseExt {
	  getInfo() {
		return {
		  name: 'Base Extension',
          id: 'baseext',
          color1: '#FF4AD5',
          color2: '#9e107f',
          color3: '#530943',
		  blocks: [
			{
			  opcode: "sayHello",
			  blockType: Scratch.BlockType.REPORTER,
			  text: Scratch.translate("Say hello!"),
			},
		  ],
		};
	  }
  
	  sayHello() {
		return 'Hello!';
	  }
	}
	Scratch.extensions.register(new BaseExt());
  })(Scratch);
  