// Created by TheShovel
// https://github.com/TheShovel
//
// 99% of the code here was not created by a PenguinMod developer!
// Look above for proper crediting :)
(function (Scratch) {
	"use strict";
	
	const BlockType = Scratch.BlockType;
    const ArgumentType = Scratch.ArgumentType;
    const Cast = Scratch.Cast;
    const log = Scratch.log;
	
class profanityAPI {
    getInfo() {
        return {
            id: "profanityAPI",
            name: "Censorship",
            blocks: [
                {
                    opcode: "checkProfanity",
                    blockType: BlockType.REPORTER,
                    disableMonitor: false,
                    text: "remove profanity from [TEXT]",
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "Hello, I love pizza!",
                        },
                    },
                },
            ],
        };
    }

    checkProfanity({ TEXT }) {
        const text = encodeURIComponent(Cast.toString(TEXT));
        return fetch(`https://www.purgomalum.com/service/plain?text=${text}`)
            .then((r) => r.text())
            .catch(() => "");
    }
}


	Scratch.extensions.register(new profanityAPI());
  })(Scratch);
  