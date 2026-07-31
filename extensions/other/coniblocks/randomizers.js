// Name: Randomizers
// ID: randomizers
// Description: Use seeds and weights.
// License: GPLV3

(function (Scratch) {
    'use strict';

    class Randomizers {
        constructor() {
            this._seed = null;
        }

        getInfo() {
            return {
                id: 'randomizers',
                name: 'Randomizers',
                color1: '#ff0000',
                color2: '#cc0000',
                color3: '#990000',
                blocks: [
                    {
                        opcode: 'random_integer',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'random integer from [MIN] to [MAX]',
                        arguments: {
                            MIN: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            MAX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
                        }
                    },
                    {
                        opcode: 'random_float',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'random float from [MIN] to [MAX]',
                        arguments: {
                            MIN: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            MAX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
                        }
                    },
                    {
                        opcode: 'random_integer_seeded',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'random integer from [MIN] to [MAX] with seed [SEED]',
                        arguments: {
                            MIN: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            MAX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
                            SEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 12345 }
                        }
                    },
                    {
                        opcode: 'random_float_seeded',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'random float from [MIN] to [MAX] with seed [SEED]',
                        arguments: {
                            MIN: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            MAX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            SEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 12345 }
                        }
                    },
                    {
                        opcode: 'random_choice',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'pick random from [ITEMS]',
                        arguments: {
                            ITEMS: { type: Scratch.ArgumentType.STRING, defaultValue: 'apple,banana,cherry' }
                        }
                    },
                    {
                        opcode: 'shuffle_list',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'shuffle list [LIST]',
                        arguments: {
                            LIST: { type: Scratch.ArgumentType.LIST, defaultValue: null }
                        }
                    },
                    {
                        opcode: 'weighted_choice',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'pick weighted random from [ITEMS] with weights [WEIGHTS]',
                        arguments: {
                            ITEMS: { type: Scratch.ArgumentType.STRING, defaultValue: 'apple,banana,cherry' },
                            WEIGHTS: { type: Scratch.ArgumentType.STRING, defaultValue: '1,2,1' }
                        }
                    },
                    {
                        opcode: 'random_boolean',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'random true/false'
                    },
                    {
                        opcode: 'random_sign',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'random sign'
                    },
                    {
                        opcode: 'random_hex_color',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'random hex color'
                    }
                ]
            };
        }

        _rand(seedObj = null) {
            if (seedObj !== null) {
                seedObj.value = (1664525 * seedObj.value + 1013904223) % 0x100000000;
                return seedObj.value / 0x100000000;
            }
            if (this._seed !== null) {
                this._seed = (1664525 * this._seed + 1013904223) % 0x100000000;
                return this._seed / 0x100000000;
            }
            if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
                const arr = new Uint32Array(1);
                crypto.getRandomValues(arr);
                return (arr[0] / 0xFFFFFFFF) || Math.random();
            }
            return Math.random();
        }

        // Normal random blocks
        random_integer(args) {
            const min = Math.round(Number(args.MIN));
            const max = Math.round(Number(args.MAX));
            if (!isFinite(min) || !isFinite(max)) return 0;
            const lo = Math.min(min, max);
            const hi = Math.max(min, max);
            return Math.floor(this._rand() * (hi - lo + 1)) + lo;
        }

        random_float(args) {
            const min = Number(args.MIN);
            const max = Number(args.MAX);
            if (!isFinite(min) || !isFinite(max)) return 0;
            const lo = Math.min(min, max);
            const hi = Math.max(min, max);
            return (this._rand() * (hi - lo)) + lo;
        }

        random_integer_seeded(args) {
            const min = Math.round(Number(args.MIN));
            const max = Math.round(Number(args.MAX));
            const seed = Math.floor(Number(args.SEED)) >>> 0;
            let seedObj = { value: seed };
            const lo = Math.min(min, max);
            const hi = Math.max(min, max);
            return Math.floor(this._rand(seedObj) * (hi - lo + 1)) + lo;
        }

        random_float_seeded(args) {
            const min = Number(args.MIN);
            const max = Number(args.MAX);
            const seed = Math.floor(Number(args.SEED)) >>> 0;
            let seedObj = { value: seed };
            const lo = Math.min(min, max);
            const hi = Math.max(min, max);
            return (this._rand(seedObj) * (hi - lo)) + lo;
        }

        random_choice(args) {
            const raw = String(args.ITEMS || '');
            let items = null;
            try {
                if (/^\s*\[.*\]\s*$/.test(raw)) {
                    items = JSON.parse(raw);
                }
            } catch (e) {
                items = null;
            }
            if (!Array.isArray(items)) {
                items = raw.split(/\s*,\s*/).filter(s => s.length > 0);
            }
            if (items.length === 0) return '';
            const i = Math.floor(this._rand() * items.length);
            return items[i];
        }

        shuffle_list(args) {
            const list = args.LIST;
            if (!Array.isArray(list)) return '';
            const out = list.slice();
            for (let i = out.length - 1; i > 0; i--) {
                const j = Math.floor(this._rand() * (i + 1));
                [out[i], out[j]] = [out[j], out[i]];
            }
            return out;
        }

        weighted_choice(args) {
            const items = String(args.ITEMS || '').split(/\s*,\s*/).filter(s => s.length > 0);
            const weights = String(args.WEIGHTS || '').split(/\s*,\s*/).map(Number);
            if (items.length === 0 || weights.length !== items.length) return '';
            const total = weights.reduce((a, b) => a + (isFinite(b) ? b : 0), 0);
            if (total <= 0) return '';
            let r = this._rand() * total;
            for (let i = 0; i < items.length; i++) {
                const w = isFinite(weights[i]) ? weights[i] : 0;
                if (r < w) return items[i];
                r -= w;
            }
            return items[items.length - 1];
        }

        random_boolean() {
            return this._rand() < 0.5;
        }

        random_sign() {
            return this._rand() < 0.5 ? -1 : 1;
        }

        random_hex_color() {
            const n = Math.floor(this._rand() * 0x1000000);
            return '#' + ('000000' + n.toString(16)).slice(-6).toUpperCase();
        }
    }

    Scratch.extensions.register(new Randomizers());
})(Scratch);