(function (Scratch) {
    if (!Scratch.extensions.unsandboxed) {
        throw new Error('此扩展需要非沙盒环境');
    }

    class AdvancedInputExtension {
        getInfo() {
            return {
                id: 'advancecol',
                name: 'Gandi编辑器button颜色设置',
                color1: '#4C97FF',
                color2: '#3373CC',
                blocks: [
                    {
                        opcode: 'showAdvancedInput',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '设置样式，背景:[BG_COLOR] 文字:[TEXT_COLOR] 边框:[BORDER_COLOR] 按钮背景:[BTN_BG] 按钮文字:[BTN_TEXT]',
                        arguments: {
                            BG_COLOR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '#ffffff'
                            },
                            TEXT_COLOR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '#000000'
                            },
                            BORDER_COLOR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '#cccccc'
                            },
                            BTN_BG: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '#e0e0e0'
                            },
                            BTN_TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '#000000'
                            }
                        }
                    }
                ]
            };
        }

        showAdvancedInput(args) {
            const bg = args.BG_COLOR;
            const text = args.TEXT_COLOR;
            const border = args.BORDER_COLOR;
            const btnBg = args.BTN_BG;
            const btnText = args.BTN_TEXT;

            let style = document.getElementById('scratch-dialog-style');
            if (!style) {
                style = document.createElement('style');
                style.id = 'scratch-dialog-style';
                document.head.appendChild(style);
            }

            // 
            style.textContent = `
                dialog {
                    background: ${bg} !important;
                    color: ${text} !important;
                    border: 1px solid ${border} !important;
                    border-radius: 8px !important;
                    padding: 20px !important;
                }
                input {
                    background: ${bg} !important;
                    color: ${text} !important;
                    border: 1px solid ${border} !important;
                    padding: 6px !important;
                    margin: 10px 0 !important;
                    border-radius: 4px !important;
                }
                button {
                    background: ${btnBg} !important;
                    color: ${btnText} !important;
                    border: 1px solid ${border} !important;
                    padding: 6px 12px !important;
                    border-radius: 4px !important;
                    margin: 0 4px !important;
                }
                button:hover {
                    opacity: 0.9 !important;
                }
            `;

            return "样式已应用";
        }
    }

    Scratch.extensions.register(new AdvancedInputExtension());
})(Scratch);