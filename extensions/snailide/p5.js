var script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/p5@1.9.2/lib/p5.js';

class p5Extension {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    getInfo() {
        return {
            id: 'p5js',
            name: 'p5.js',
            blocks: [
                {
                    opcode: 'drawcirclesimple',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'draw circle at x: [X] and y: [Y]',
                    arguments: {
                        X: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '0'
                        },
                        Y: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '0'
                        }
                    }
                }
            ]
        };
    }

    drawcirclesimple(args) {
        console.log('lol not done');
    }
}

Scratch.extensions.register(new p5Extension());
document.head.appendChild(script);
