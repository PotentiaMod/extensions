// Name: Color Toolset
// ID: colortools
// Description: Tons of color-related tools, meow. you can mix colors, invert them, find complementary colors, convert formats, and more — super useful tools, meow
// By: MR醉诗 <https://space.bilibili.com/3546960701163977>
// License: MIT

(function (Scratch) {
    'use strict';

    class ColorTools {
        getInfo() {
            return {
                id: 'colortools',
                name: Scratch.translate({
                    id: "extensionName",
                    default: "Color Toolset"
                }),
                description: Scratch.translate({
                    id: "extensionDecp",
                    default: "tons of color-related tools, meow, you can mix colors, invert them, find complementary colors, convert formats, and more — super useful tools, meow"
                }),
                color1: '#FF6B6B',
                color2: '#4ECDC4',
                color3: '#45B7D1',
                blocks: [
                    {
                        opcode: 'mixHex',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({
                            id: "mixHex",
                            default: "mix hex colors [COLOR1] [COLOR2]"
                        }),
                        arguments: {
                            COLOR1: { type: Scratch.ArgumentType.STRING, defaultValue: '#FF0000' },
                            COLOR2: { type: Scratch.ArgumentType.STRING, defaultValue: '#0000FF' }
                        }
                    },
                    {
                        opcode: 'mixRgb',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({
                            id: "mixRgb",
                            default: "mix rgb colors [R1] [G1] [B1] [R2] [G2] [B2]"
                        }),
                        arguments: {
                            R1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 255 },
                            G1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            B1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            R2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            G2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            B2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 255 }
                        }
                    },
                    {
                        opcode: 'hexToRgb',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({
                            id: "hexToRgb",
                            default: "hex to rgb colors [COLOR]"
                        }),
                        arguments: {
                            COLOR: { type: Scratch.ArgumentType.STRING, defaultValue: '#FF0000' }
                        }
                    },
                    {
                        opcode: 'rgbToHex',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({
                            id: "rgbToHex",
                            default: "rgb to hex colors [R] [G] [B]"
                        }),
                        arguments: {
                            R: { type: Scratch.ArgumentType.NUMBER, defaultValue: 255 },
                            G: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            B: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
                        }
                    },
                    {
                        opcode: 'brighten',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({
                            id: "brighten",
                            default: "brighten color [COLOR] amount [AMOUNT]%"
                        }),
                        arguments: {
                            COLOR: { type: Scratch.ArgumentType.STRING, defaultValue: '#FF0000' },
                            AMOUNT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 20 }
                        }
                    },
                    {
                        opcode: 'darken',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({
                            id: "darken",
                            default: "darken color [COLOR] amount [AMOUNT]%"
                        }),
                        arguments: {
                            COLOR: { type: Scratch.ArgumentType.STRING, defaultValue: '#FF0000' },
                            AMOUNT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 20 }
                        }
                    },
                    {
                        opcode: 'invert',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({
                            id: "invert",
                            default: "invert color [COLOR]"
                        }),
                        arguments: {
                            COLOR: { type: Scratch.ArgumentType.STRING, defaultValue: '#FF0000' }
                        }
                    },
                    {
                        opcode: 'randomColor',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({
                            id: "randomColor",
                            default: "random color"
                        }),
                        arguments: {}
                    },
                    {
                        opcode: 'gradient',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({
                            id: "gradient",
                            default: "gradient [COLOR1] [COLOR2] position [POS]%"
                        }),
                        arguments: {
                            COLOR1: { type: Scratch.ArgumentType.STRING, defaultValue: '#FF0000' },
                            COLOR2: { type: Scratch.ArgumentType.STRING, defaultValue: '#0000FF' },
                            POS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 }
                        }
                    },
                    {
                        opcode: 'complementary',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({
                            id: "complementary",
                            default: "complementary color [COLOR]"
                        }),
                        arguments: {
                            COLOR: { type: Scratch.ArgumentType.STRING, defaultValue: '#FF0000' }
                        }
                    }
                ]
            };
        }

        _hexToRgb(hex) {
            let h = String(hex).replace('#', '');
            if (h.length === 3) {
                h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
            }
            return {
                r: parseInt(h.substring(0, 2), 16),
                g: parseInt(h.substring(2, 4), 16),
                b: parseInt(h.substring(4, 6), 16)
            };
        }

        _rgbToHex(r, g, b) {
            let red = Math.min(255, Math.max(0, parseInt(r) || 0));
            let green = Math.min(255, Math.max(0, parseInt(g) || 0));
            let blue = Math.min(255, Math.max(0, parseInt(b) || 0));
            return '#' + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
        }

        mixHex(args) {
            try {
                let c1 = this._hexToRgb(args.COLOR1);
                let c2 = this._hexToRgb(args.COLOR2);
                let r = Math.round((c1.r + c2.r) / 2);
                let g = Math.round((c1.g + c2.g) / 2);
                let b = Math.round((c1.b + c2.b) / 2);
                return this._rgbToHex(r, g, b);
            } catch (e) {
                return '#000000';
            }
        }

        mixRgb(args) {
            try {
                let r = Math.round((Number(args.R1) + Number(args.R2)) / 2);
                let g = Math.round((Number(args.G1) + Number(args.G2)) / 2);
                let b = Math.round((Number(args.B1) + Number(args.B2)) / 2);
                return r + ',' + g + ',' + b;
            } catch (e) {
                return '0,0,0';
            }
        }

        hexToRgb(args) {
            try {
                let rgb = this._hexToRgb(args.COLOR);
                return rgb.r + ',' + rgb.g + ',' + rgb.b;
            } catch (e) {
                return '0,0,0';
            }
        }

        rgbToHex(args) {
            try {
                return this._rgbToHex(args.R, args.G, args.B);
            } catch (e) {
                return '#000000';
            }
        }

        brighten(args) {
            try {
                let c = this._hexToRgb(args.COLOR);
                let amount = Number(args.AMOUNT) / 100;
                let r = Math.min(255, Math.round(c.r + (255 - c.r) * amount));
                let g = Math.min(255, Math.round(c.g + (255 - c.g) * amount));
                let b = Math.min(255, Math.round(c.b + (255 - c.b) * amount));
                return this._rgbToHex(r, g, b);
            } catch (e) {
                return '#000000';
            }
        }

        darken(args) {
            try {
                let c = this._hexToRgb(args.COLOR);
                let amount = Number(args.AMOUNT) / 100;
                let r = Math.max(0, Math.round(c.r - c.r * amount));
                let g = Math.max(0, Math.round(c.g - c.g * amount));
                let b = Math.max(0, Math.round(c.b - c.b * amount));
                return this._rgbToHex(r, g, b);
            } catch (e) {
                return '#000000';
            }
        }

        invert(args) {
            try {
                let c = this._hexToRgb(args.COLOR);
                return this._rgbToHex(255 - c.r, 255 - c.g, 255 - c.b);
            } catch (e) {
                return '#000000';
            }
        }

        randomColor() {
            let r = Math.floor(Math.random() * 256);
            let g = Math.floor(Math.random() * 256);
            let b = Math.floor(Math.random() * 256);
            return this._rgbToHex(r, g, b);
        }

        gradient(args) {
            try {
                let c1 = this._hexToRgb(args.COLOR1);
                let c2 = this._hexToRgb(args.COLOR2);
                let pos = Number(args.POS) / 100;
                let r = Math.round(c1.r + (c2.r - c1.r) * pos);
                let g = Math.round(c1.g + (c2.g - c1.g) * pos);
                let b = Math.round(c1.b + (c2.b - c1.b) * pos);
                return this._rgbToHex(r, g, b);
            } catch (e) {
                return '#000000';
            }
        }

        complementary(args) {
            try {
                let c = this._hexToRgb(args.COLOR);
                return this._rgbToHex(255 - c.r, 255 - c.g, 255 - c.b);
            } catch (e) {
                return '#000000';
            }
        }
    }

    Scratch.extensions.register(new ColorTools());
})(Scratch);