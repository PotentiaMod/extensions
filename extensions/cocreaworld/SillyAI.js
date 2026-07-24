//Translated by Gaia.
var ccwEmptyExtension = function () {};

var _extensionData = '';
let extensionInstance = null;

const getVM = () => {
    if (Scratch && Scratch.vm) return Scratch.vm;
    if (vm) return vm;
    if (Scratch && Scratch.extensions && Scratch.extensions.runtime && Scratch.extensions.runtime.vm) {
        return Scratch.extensions.runtime.vm;
    }
    return null;
};

ccwEmptyExtension.prototype.getInfo = function () {
    return {
        id: 'sillyAIExtension',
        name: 'Silly AI🤪',
        color1: '#8B4513',
        blocks: [
            {
                opcode: 'sillyAIChat',
                blockType: Scratch.BlockType.REPORTER,
                text: 'Try to chat [INPUT]',
                arguments: {
                    INPUT: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'Did you know? I\'m a human!'
                    }
                }
            }
        ],
        menus: {}
    };
};

ccwEmptyExtension.prototype.sillyAIChat = function (args) {
    const userInput = (args.INPUT || '').trim();
    if (!userInput) {
        return 'What kind of garbage is that!?😡';
    }
    
    const suffix = '🤪';
    const sillyReplies = [
        'I don\'t undertand that🤪',
        'What on Earth is this?🤪',
        'What are you talking about?🤪',
        'I don\'t get it. I\'m uncultured!🤪',
        'What? Please speak English!🤪',
        'My head is spinning round and round!🤪',
        'What kind of gibberish is that?🤪',
        'I have no clue what\'s going on!🤪',
        'I jut can\'t do it!🤪',
        'My specialty is simply don\'t understand a thing.🤪'
    ];
    
    const randomChoice = Math.random();
    if (randomChoice > 0.5) {
        let startIndex, endIndex;
        if (userInput.length <= 3) {
            startIndex = 0;
            endIndex = userInput.length;
        } else {
            startIndex = Math.floor(Math.random() * (userInput.length - 2));
            endIndex = startIndex + 1 + Math.floor(Math.random() * (userInput.length - startIndex - 1));
        }
        const randomPart = userInput.substring(startIndex, endIndex);
        return `"${randomPart}"What is it?${suffix}`;
    } else {
        const randomReply = sillyReplies[Math.floor(Math.random() * sillyReplies.length)];
        return randomReply;
    }
};

extensionInstance = new ccwEmptyExtension();
Scratch.extensions.register(extensionInstance);