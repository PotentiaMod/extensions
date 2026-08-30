class UnicodeExt {
    getInfo() {
        return {
            id: 'unicodeCrypto',
            name: 'Unicode编解码拓展',
            color1: '#3388dd',
            color2: '#2266bb',
            color3: '#114499',
            blocks: [
                // 改成命令积木，运行就打开网页，绕过BUTTON安全限制
                {
                    opcode: 'openUnicodeChart',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '打开Unicode官方对照表网页'
                },
                {
                    opcode: 'charToCode',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '字符[CHAR]转十进制码点',
                    arguments: {
                        CHAR: { type: Scratch.ArgumentType.STRING, defaultValue: '你' }
                    }
                },
                {
                    opcode: 'codeToChar',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '十进制码点[NUM]转为字符',
                    arguments: {
                        NUM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 20320 }
                    }
                },
                {
                    opcode: 'hexToChar',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '十六进制编码[HEX]转字符',
                    arguments: {
                        HEX: { type: Scratch.ArgumentType.STRING, defaultValue: 'U+200B' }
                    }
                },
                {
                    opcode: 'copyText',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '复制文本[TXT]到剪贴板',
                    arguments: {
                        TXT: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
                    }
                },
                {
                    opcode: 'codeToEscape',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '码点[CODE]转为\\u转义文本',
                    arguments: {
                        CODE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 8203 }
                    }
                },
                {
                    opcode: 'charToHex',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '字符[C]查看十六进制Unicode',
                    arguments: {
                        C: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
                    }
                },
                {
                    opcode: 'strToEscape',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '文本[STR]转为\\u转义字符串',
                    arguments: {
                        STR: { type: Scratch.ArgumentType.STRING, defaultValue: '你好#@￥' }
                    }
                },
                {
                    opcode: 'escapeToStr',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '解析\\u转义文本[ESC]',
                    arguments: {
                        ESC: { type: Scratch.ArgumentType.STRING, defaultValue: '\\u4f60\\u597d\\u200B' }
                    }
                }
            ]
        };
    }

    openUnicodeChart() {
        // 用户运行积木，属于真实用户手势，允许打开窗口
        try {
            if (typeof Scratch.openWindow === "function") {
                Scratch.openWindow("https://www.unicode.org/charts/");
            } else {
                window.open("https://www.unicode.org/charts/", "_blank");
            }
        } catch(e) {
            alert("无法自动打开网页，请手动复制访问：\nhttps://www.unicode.org/charts/");
        }
    }

    charToCode(args) {
        const c = args.CHAR;
        return c.codePointAt(0) || 0;
    }

    codeToChar(args) {
        return String.fromCodePoint(args.NUM);
    }

    hexToChar(args) {
        let hexStr = args.HEX.trim().toUpperCase();
        if (hexStr.startsWith('U+')) hexStr = hexStr.slice(2);
        if (hexStr.startsWith('0X')) hexStr = hexStr.slice(2);
        let num = parseInt(hexStr, 16);
        if (isNaN(num)) return "格式错误";
        return String.fromCodePoint(num);
    }

    copyText(args) {
        const content = args.TXT;
        if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(content).catch(() => {});
        }
    }

    codeToEscape(args){
        let cp = args.CODE;
        if(cp>0xFFFF){
            return "\\U"+cp.toString(16).padStart(8,'0');
        }else{
            return "\\u"+cp.toString(16).padStart(4,'0');
        }
    }

    charToHex(args){
        const str = args.C;
        let res = '';
        for(let i=0;i<str.length;i++){
            let cp = str.codePointAt(i);
            res += "U+"+cp.toString(16).toUpperCase().padStart(4,'0')+" ";
            if(cp>0xFFFF)i++;
        }
        return res;
    }

    strToEscape(args) {
        let res = '';
        const str = args.STR;
        for (let i = 0; i < str.length; i++) {
            const cp = str.codePointAt(i);
            if (cp > 0xFFFF) {
                res += '\\U' + cp.toString(16).padStart(8, '0');
                i++;
            } else {
                res += '\\u' + cp.toString(16).padStart(4, '0');
            }
        }
        return res;
    }

    escapeToStr(args) {
        try {
            return JSON.parse(`"${args.ESC}"`);
        } catch (e) {
            return '格式错误';
        }
    }
}
Scratch.extensions.register(new UnicodeExt());