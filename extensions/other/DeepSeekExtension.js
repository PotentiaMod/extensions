(function (Scratch) {
	"use strict";
	
	const BlockType = Scratch.BlockType;
    const ArgumentType = Scratch.ArgumentType;
    const Cast = Scratch.Cast;
	
class DeepSeekExtension {
    constructor() {
        this.baseUrl = 'http://localhost:5000';
    }

    getInfo() {
        return {
            id: 'deepseek',
            name: 'DeepSeek AI',
            blocks: [
                {
                    opcode: 'askAI',
                    blockType: BlockType.REPORTER,
                    text: 'Ask AI: [QUESTION]',
                    arguments: {
                        QUESTION: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello！'
                        }
                    }
                }
            ]
        };
    }

    askAI(args) {
        const question = args.QUESTION;
        return fetch(`${this.baseUrl}/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: question
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                return data.response;
            } else {
                return 'An error occurred.: ' + data.error;
            }
        })
        .catch(error => {
            console.error('API Error:', error);
            return 'Failed to connect to the server.';
        });
    }
}

	Scratch.extensions.register(new DeepSeekExtension());
  })(Scratch);
  