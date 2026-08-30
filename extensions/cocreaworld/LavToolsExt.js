(function (_Scratch) {
    const {ArgumentType, BlockType, extensions, runtime} = _Scratch;

    class LavToolsExt {
        constructor (_runtime) {
            this._runtime = _runtime;
        }

        getInfo () {
            const waitBroadcastBlock = {
                opcode: 'waitUntilBroadcast',
                blockType: BlockType.COMMAND,
                text: '等待直到收到广播 [MSG]',
                arguments: {
                    MSG: {
                        type: ArgumentType.STRING,
                        defaultValue: "login_ok"
                    }
                }
            };

            const downloadFileBlock = {
                opcode: 'saveTextFile',
                blockType: BlockType.COMMAND,
                text: '下载文本 文件:[TEXT] 文件名:[NAME]',
                arguments: {
                    TEXT: {
                        type: ArgumentType.STRING,
                        defaultValue: "内容"
                    },
                    NAME: {
                        type: ArgumentType.STRING,
                        defaultValue: "config.txt"
                    }
                }
            };

            return {
                id: 'lavsaos_tools',
                color1: '#4285F4',
                color2: '#2B65C9',
                name: 'LAVSAOS工具集',
                blocks: [waitBroadcastBlock, downloadFileBlock]
            };
        }

        waitUntilBroadcast(args) {
            const targetMsg = args.MSG;
            return new Promise(resolve => {
                const handler = (broadcastName) => {
                    if(broadcastName === targetMsg){
                        this._runtime.off("BROADCAST", handler);
                        resolve();
                    }
                };
                this._runtime.on("BROADCAST", handler);
            })
        }

        saveTextFile(args) {
            const content = args.TEXT;
            const filename = args.NAME;
            const blob = new Blob([content], {type:"text/plain;charset=utf-8"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    extensions.register(new LavToolsExt(runtime));
}(Scratch));
