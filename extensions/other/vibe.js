class UtilitiesExtension {
    getInfo() {
        return {
            id: 'vibeaiutilities',
            name: 'Vibe Coded Utilities',
            color1: '#3e1061',
            color2: '#69057d',
            blocks: [
                {
                    opcode: 'splitText',
                    blockType: 'reporter',
                    text: 'split [TEXT] by [DELIM]',
                    arguments: {
                        TEXT: { type: 'string', defaultValue: 'Hello world' },
                        DELIM: { type: 'string', defaultValue: ' ' }
                    }
                },
                {
                    opcode: 'toLowerCase',
                    blockType: 'reporter',
                    text: 'lowercase [TEXT]',
                    arguments: {
                        TEXT: { type: 'string', defaultValue: 'HELLO' }
                    }
                },
                {
                    opcode: 'toUpperCase',
                    blockType: 'reporter',
                    text: 'uppercase [TEXT]',
                    arguments: {
                        TEXT: { type: 'string', defaultValue: 'hello' }
                    }
                },
                {
                    opcode: 'toReverse',
                    blockType: 'reporter',
                    text: 'reverse [TEXT]',
                    arguments: {
                        TEXT: { type: 'string', defaultValue: 'hello' }
                    }
                },
                {
                    opcode: 'replaceText',
                    blockType: 'reporter',
                    text: 'replace [FROM] with [TO] in [TEXT]',
                    arguments: {
                        TEXT: { type: 'string', defaultValue: 'one two one' },
                        FROM: { type: 'string', defaultValue: 'one' },
                        TO: { type: 'string', defaultValue: '1' }
                    }
                },
                {
                    opcode: 'minOf',
                    blockType: 'reporter',
                    text: 'min of [A] and [B]',
                    arguments: {
                        A: { type: 'number', defaultValue: 1 },
                        B: { type: 'number', defaultValue: 2 }
                    }
                },
                {
                    opcode: 'maxOf',
                    blockType: 'reporter',
                    text: 'max of [A] and [B]',
                    arguments: {
                        A: { type: 'number', defaultValue: 1 },
                        B: { type: 'number', defaultValue: 2 }
                    }
                },
                {
                    opcode: 'powerOf',
                    blockType: 'reporter',
                    text: '[BASE] ^ [EXP]',
                    arguments: {
                        BASE: { type: 'number', defaultValue: 2 },
                        EXP: { type: 'number', defaultValue: 3 }
                    }
                },
                {
                    opcode: 'compareThreeValues',
                    blockType: 'Boolean',
                    text: '[A] [OP] [B]',
                    arguments: {
                        A: { type: 'number', defaultValue: 1 },
                        OP: { type: 'string', defaultValue: '>' },
                        B: { type: 'number', defaultValue: 3 }
                    }
                },
                {
                    opcode: 'isNegative',
                    blockType: 'Boolean',
                    text: 'is [NUM] negative?',
                    arguments: {
                        NUM: { type: 'number', defaultValue: -1 }
                    }
                },
                {
                    opcode: 'isPositive',
                    blockType: 'Boolean',
                    text: 'is [NUM] positive?',
                    arguments: {
                        NUM: { type: 'number', defaultValue: 1 }
                    }
                },
                {
                    opcode: 'trueBoolean',
                    blockType: 'Boolean',
                    text: 'true'
                },
                {
                    opcode: 'falseBoolean',
                    blockType: 'Boolean',
                    text: 'false'
                },
                {
                    opcode: 'millisecondsNow',
                    blockType: 'reporter',
                    text: 'milliseconds now'
                },
                {
                    opcode: 'formatDate',
                    blockType: 'reporter',
                    text: 'format date [DATE] as [FORMAT]',
                    arguments: {
                        DATE: { type: 'string', defaultValue: '2026-01-01T12:00:00Z' },
                        FORMAT: { type: 'string', defaultValue: 'MM/DD/YYYY' }
                    }
                }
            ]
        };
    }

    splitText(args) {
        return String(args.TEXT ?? '').split(String(args.DELIM ?? ' ')).join(',');
    }

    toLowerCase(args) {
        return String(args.TEXT ?? '').toLowerCase();
    }

    toUpperCase(args) {
        return String(args.TEXT ?? '').toUpperCase();
    }

    toReverse(args) {
        return String(args.TEXT ?? '').split('').reverse().join('');
    }

    replaceText(args) {
        return String(args.TEXT ?? '').split(String(args.FROM ?? '')).join(String(args.TO ?? ''));
    }

    minOf(args) {
        return Math.min(Number(args.A), Number(args.B));
    }

    maxOf(args) {
        return Math.max(Number(args.A), Number(args.B));
    }

    powerOf(args) {
        return Math.pow(Number(args.BASE), Number(args.EXP));
    }

    compareThreeValues(args) {
        const a = Number(args.A);
        const b = Number(args.B);
        const op = String(args.OP ?? '==').trim();

        if (op === '>') return a > b;
        if (op === '<') return a < b;
        if (op === '>=') return a >= b;
        if (op === '<=') return a <= b;
        if (op === '!=') return a !== b;
        return a === b;
    }

    isNegative(args) {
        return Number(args.NUM) < 0;
    }

    isPositive(args) {
        return Number(args.NUM) > 0;
    }

    trueBoolean() {
        return true;
    }

    falseBoolean() {
        return false;
    }

    millisecondsNow() {
        return Date.now();
    }

    formatDate(args) {
        const date = new Date(args.DATE);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yyyy = date.getFullYear();
        return String(args.FORMAT ?? 'MM/DD/YYYY')
            .replace(/MM/g, mm)
            .replace(/DD/g, dd)
            .replace(/YYYY/g, yyyy);
    }
}

if (typeof Scratch !== 'undefined') {
    Scratch.extensions.register(new UtilitiesExtension());
}