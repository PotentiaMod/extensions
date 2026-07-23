// Name: Approaches!
// ID: approaches
// Description: Nonlinear approach functions.
// By: DL_Grass <https://github.com/DLGrass>
// Original: 蓝立方Blue3 <https://space.bilibili.com/25786611>
// License: MIT

(function (Scratch) {
    'use strict';

    // const block_icon = "https://m.ccw.site/creator-college/images/95c1d774ecfb8191c9b58c6ae4faae8a.png";

    const rebound_constant = 0.46410161513775444;

    let max_number = 1e+10;

    function log(a, b) {
        return Math.log(b) / Math.log(a);
    }

    function nitian(a) {
        return a ** a ** a;
    }

    class approaches {
        getInfo() {
            return {
                id: "approaches",
                name: Scratch.translate({'default': 'Approaches!', 'id': 'extensionName' }),
                description: Scratch.translate({'default': 'Nonlinear approach functions', 'id': 'extensionDescription' }),

                color1: "#3b3bf7",
                color2: "#1425b6",
                color3: "#110f94",
                // blockIconURI: block_icon,

                blocks: [
                    {
                        opcode: 'label2',
                        blockType: Scratch.BlockType.LABEL,
                        text: Scratch.translate({'default': '🔁Recursive Approach', 'id': 'label.recursive' }),
                    },
                    {
                        opcode: 'block1',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({'default': 'Approach [temp] to [temp2] at rate [temp3]', 'id': 'block.block1' }),
                        arguments: {
                            temp: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            temp2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10,
                            },
                            temp3: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5,
                            },
                        }
                    },

                    {
                        opcode: 'label2',
                        blockType: Scratch.BlockType.LABEL,
                        text: Scratch.translate({'default': '🔁Recursive Rebound', 'id': 'label.rebound' }),
                    },
                    {
                        opcode: 'block2_1',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({'default': 'Rebound [temp] to [temp2] with sine at rate [temp3]', 'id': 'block.block2_1' }),
                        arguments: {
                            temp: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            temp2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10,
                            },
                            temp3: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5,
                            },
                        }
                    },
                    {
                        opcode: 'label3',
                        blockType: Scratch.BlockType.LABEL,
                        text: Scratch.translate({'default': '📈Function Curve Approach', 'id': 'label.curve' }),
                    },
                    {
                        opcode: 'blockHeyiwei',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({'default': 'Linear approach [temp] to [temp2] by [temp3]%', 'id': 'block.blockeyiwei' }),
                        arguments: {
                            temp: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            temp2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10,
                            },
                            temp3: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50,
                            },
                        }
                    },
                    {
                        opcode: 'block2',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({'default': 'Sine approach [temp] to [temp2] by [temp3]%', 'id': 'block.block2' }),
                        arguments: {
                            temp: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            temp2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10,
                            },
                            temp3: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50,
                            },
                        }
                    },
                    {
                        opcode: 'block3',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({'default': 'Logarithmic approach [temp] to [temp2] by [temp3]%', 'id': 'block.block3' }),
                        arguments: {
                            temp: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            temp2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10,
                            },
                            temp3: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50,
                            },
                        }
                    },
                    {
                        opcode: 'block4',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({'default': 'Exponential approach [temp] to [temp2] by [temp3]%', 'id': 'block.block4' }),
                        arguments: {
                            temp: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            temp2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10,
                            },
                            temp3: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 75,
                            },
                        }
                    },
                    {
                        opcode: 'block5',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({'default': 'Power approach [temp] to [temp2] by [temp3]%', 'id': 'block.block5' }),
                        arguments: {
                            temp: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            temp2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10,
                            },
                            temp3: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 90,
                            },
                        }
                    },
                    {
                        opcode: 'block6',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({'default': 'Quadratic approach [temp] to [temp2] by [temp3]%', 'id': 'block.block6' }),
                        arguments: {
                            temp: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            temp2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10,
                            },
                            temp3: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50,
                            },
                        }
                    },
                    {
                        opcode: 'block7',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({'default': 'Arcsine approach [temp] to [temp2] by [temp3]%', 'id': 'block.block7' }),
                        arguments: {
                            temp: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            temp2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10,
                            },
                            temp3: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50,
                            },
                        }
                    },
                    {
                        opcode: 'block8',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({'default': 'Tanh approach [temp] to [temp2] by [temp3]%', 'id': 'block.block8' }),
                        arguments: {
                            temp: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            temp2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10,
                            },
                            temp3: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50,
                            },
                        }
                    },
                    {
                        opcode: 'label4',
                        blockType: Scratch.BlockType.LABEL,
                        text: Scratch.translate({'default': '🔧Other Tools', 'id': 'label.tools' }),
                    },

                    {
                        opcode: 'other1',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate({'default': 'Is [temp] out of bounds?', 'id': 'block.other1' }),
                        arguments: {
                            temp: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 111111111111,
                            },
                        }
                    },
                    {
                        opcode: 'other2',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate({'default': 'Set overflow limit to [temp]', 'id': 'block.other2' }),
                        arguments: {
                            temp: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1e+20,
                            },
                        }
                    },
                    {
                        opcode: 'other3',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({'default': 'Clamp [temp3] between [temp] and [temp2]', 'id': 'block.other3' }),
                        arguments: {
                            temp: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2000,
                            },
                            temp2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 3000,
                            },
                            temp3: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 4000,
                            },
                        }
                    },
                    {
                        opcode: 'label5',
                        blockType: Scratch.BlockType.LABEL,
                        text: Scratch.translate({'default': '🔧Special', 'id': 'label.special' }),
                    },
                    {
                        opcode: 'caidan1',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({'default': 'Tetration approach [temp] to [temp2] by [temp3]%', 'id': 'block.caidan1' }),
                        arguments: {
                            temp: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1391,
                            },
                            temp2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2233,
                            },
                            temp3: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 97.8,
                            },
                        }
                    },

                ],
                menus: {
                    sanjiao: {
                        acceptReporters: false,
                        items: [
                            Scratch.translate({'default': 'Sine', 'id': 'menu.sine' }),
                            Scratch.translate({'default': 'Cosine', 'id': 'menu.cosine' })
                        ]
                    }
                }
            }
        }
        block1(args) {
            let t = Number(args.temp); let t2 = Number(args.temp2); let t3 = Number(args.temp3);
            return t + (t2 - t) / t3;
        }
        block2(args) {
            let t = Number(args.temp); let t2 = Number(args.temp2); let t3 = Number(args.temp3);

            return (t2 - t) * Math.sin(((Math.PI / 2) / 100 * t3)) + t;
        }

        blockHeyiwei(args) {
            let t = Number(args.temp); let t2 = Number(args.temp2); let t3 = Number(args.temp3);
            return (t2 - t) * (t3 / 100) + t;
        }
        block3(args) {
            let t = Number(args.temp); let t2 = Number(args.temp2); let t3 = Number(args.temp3); let t4 = 10;
            return (t2 - t) * (log(t4, 104 / 100 * t3) / log(t4, 104)) + t;

        }
        block4(args) {
            let t = Number(args.temp); let t2 = Number(args.temp2); let t3 = Number(args.temp3);
            return (t2 - t) * (2 ** (8 / 100 * t3) / (2 ** 8)) + t;
        }
        block5(args) {
            let t = Number(args.temp); let t2 = Number(args.temp2); let t3 = Number(args.temp3);
            return (t2 - t) * (((4 / 100 * t3) ** (4 / 100 * t3)) / (4 ** 4)) + t;
        }
        block6(args) {
            let t = Number(args.temp); let t2 = Number(args.temp2); let t3 = Number(args.temp3);
            return (t2 - t) * ((12 / 100 * t3) ** 2 / 12 ** 2) + t;
        }
        block7(args) {
            let t = Number(args.temp); let t2 = Number(args.temp2); let t3 = Number(args.temp3);
            return ((t2 - t) * Math.asin((1 / 100 * t3)) + t) / (Math.PI * 0.5);
        }
        block8(args) {
            let t = Number(args.temp); let t2 = Number(args.temp2); let t3 = Number(args.temp3);
            return ((t2 - t) * Math.tanh(20 / 100 * t3)) + t;
        }
        block2_1(args) {
            let t = Number(args.temp); let t2 = Number(args.temp2) / rebound_constant; let t3 = Number(args.temp3);
            return (t2 - t) * Math.sin(((Math.PI / 2) / t3)) + t;
        }
        caidan1(args) {
            let t = Number(args.temp); let t2 = Number(args.temp2); let t3 = Number(args.temp3); let t4 = 10;
            return (t2 - t) * ((nitian(2.3 / 100 * t3)) / (nitian(2.3))) + t;
        }
        other1(args) {
            if (Number(args.temp) > max_number || Number(args.temp) < (max_number * -1) || Number.isNaN(args.temp)) {
                return true;
            } else {
                return false;
            }
        }
        other2(args) {
            max_number = args.temp;
        }
        other3(args) {
            let t1 = Number(args.temp); let t2 = Number(args.temp2); let t3 = Number(args.temp3);
            if (t3 <= t2 && t3 > t1) {
                return t3;
            } else {
                if (t3 > t2) {
                    return t2;
                } else {
                    return t1;
                }
            }

        }

    }
    Scratch.extensions.register(new approaches())

})(Scratch);