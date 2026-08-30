class BilupAllInOne {
    constructor(runtime) {
        this.runtime = runtime;
    }
    getInfo() {
        return {
            id: 'biluptwccw',
            name: 'bilup积木-TW ccw兼容版',
            description:
`【使用操作说明】
1. 先拖出"对于 [value]"开关判断积木，填入需要检测的值；
2. 把多个「情况」积木放进"对于"的缺口内部；
3. 情况积木条件匹配成功后自动开启命中标记；
4. "终止"：跳出当前对于‑情况判断结构；
5. "继续"：跳过当前分支，直接检测下一条情况；
6. "默认"：放在所有情况最后，前面全部条件不匹配时执行；
7. π：获取圆周率；换行：输出文本换行符。
注意："继续"功能受Scratch引擎限制暂未生效。`,
            color1: '#ff952e',
            color2: '#e88422',
            color3: '#cc7018',
            blocks: [
                {
                    opcode: 'switchStart',
                    blockType: Scratch.BlockType.CONDITIONAL,
                    text: '对于 [value]',
                    arguments: {
                        value: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'caseA',
                    blockType: Scratch.BlockType.CONDITIONAL,
                    text: '情况 [target]',
                    arguments: {
                        target: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'caseEndText',
                    blockType: Scratch.BlockType.CONDITIONAL,
                    text: '情况 [target]  ——终止',
                    arguments: {
                        target: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'caseB',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '情况 [num]',
                    arguments: {
                        num: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'defaultBlock',
                    blockType: Scratch.BlockType.CONDITIONAL,
                    text: '默认'
                },
                {
                    opcode: 'breakB',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '终止'
                },
                {
                    opcode: 'continueBlock',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '继续'
                },
                {
                    opcode: 'getPi',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'π'
                },
                {
                    opcode: 'newLine',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '换行'
                }
            ]
        };
    }

    switchStart({value}, util) {
        util.stackFrame.switchValue = value;
        util.stackFrame.switchBreak = false;
    }

    caseA({target}, util) {
        const frame = util.stackFrame;
        if (!frame.switchBreak && frame.switchValue === target) {
            frame.switchBreak = true;
        }
    }

    caseEndText({target}, util) {
        const frame = util.stackFrame;
        if (!frame.switchBreak && frame.switchValue === target) {
            frame.switchBreak = true;
        }
    }

    caseB({num}, util) {
        const frame = util.stackFrame;
        if (!frame.switchBreak && frame.switchValue === num) {
            frame.switchBreak = true;
        }
    }

    defaultBlock(_, util) {
        const frame = util.stackFrame;
        if (!frame.switchBreak) {
            frame.switchBreak = true;
        }
    }

    breakB(_, util) {
        util.stackFrame.switchBreak = true;
    }

    continueBlock() {
        console.warn("【继续】内核跳转功能，TW/CCW沙盒环境无法生效");
    }

    getPi() {
        return Math.PI;
    }

    newLine() {
        return "\n";
    }
}
Scratch.extensions.register(new BilupAllInOne());
