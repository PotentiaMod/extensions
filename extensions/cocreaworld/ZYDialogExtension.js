class ZYDialogExtension {
    constructor() {
        this.lastResults = {
            text: '',
            number: 0,
            password: '',
            multiSelect: [],
            select: ''
        };
        this.optionCache = {
            select: ['Option1', 'Option2', 'Option3'],
            multiSelect: ['OptionA', 'OptionB', 'OptionC']
        };
    }

    getInfo() {
        return {
            id: 'zlpopup',
            name: 'A Window of Pure Bliss',
            color1: '#FF6B6B',
            color2: '#FF5252',
            blocks: [
                // Text Input
                {
                    opcode: 'showTextDialog',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Show text input dialog with title [title] and prompt [prompt]',
                    arguments: {
                        title: { type: Scratch.ArgumentType.STRING, defaultValue: 'Text Input' },
                        prompt: { type: Scratch.ArgumentType.STRING, defaultValue: 'Please enter the content....' }
                    }
                },
                {
                    opcode: 'getTextResult',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Text input result'
                },

                // Digital input
                {
                    opcode: 'showNumberDialog',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Show numeric input dialog: Title [title], Prompt [prompt]',
                    arguments: {
                        title: { type: Scratch.ArgumentType.STRING, defaultValue: 'Digital input' },
                        prompt: { type: Scratch.ArgumentType.STRING, defaultValue: 'Please enter a number....' }
                    }
                },
                {
                    opcode: 'getNumberResult',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Digital input result'
                },

                // Enter password
                {
                    opcode: 'showPasswordDialog',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Show password input popup with title [title]',
                    arguments: {
                        title: { type: Scratch.ArgumentType.STRING, defaultValue: 'Enter password' }
                    }
                },
                {
                    opcode: 'getPasswordResult',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Password entry result'
                },

                // Multi-select popup
                {
                    opcode: 'showMultiSelectDialog',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Show multi-select popup title [title]',
                    arguments: {
                        title: { type: Scratch.ArgumentType.STRING, defaultValue: 'Feature-rich / Packed with options' }
                    }
                },
                {
                    opcode: 'getMultiSelectResult',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Multiple-choice results'
                },

                // Dynamic Option Popup
                {
                    opcode: 'showSelectDialog',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Display Options Popup Title [title]',
                    arguments: {
                        title: { type: Scratch.ArgumentType.STRING, defaultValue: 'Please select' }
                    }
                },
                {
                    opcode: 'getSelectResult',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Option Results'
                },
                {
                    opcode: 'updateSelectOptions',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'The update options are[options]',
                    arguments: {
                        options: { 
                            type: Scratch.ArgumentType.STRING, 
                            defaultValue: 'Option 1, Option 2, Option 3' 
                        }
                    }
                }
            ]
        };
    }

    // 公共对话框基类
    createDialog(title) {
        const overlay = document.createElement('div');
        overlay.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            backdrop-filter: blur(3px);
            animation: fadeIn 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.style = `
            background: linear-gradient(145deg, #ffffff, #f8f9fa);
            padding: 24px;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            min-width: 400px;
            max-width: 80%;
            transform: scale(0.9);
            animation: zoomIn 0.3s ease forwards;
        `;

        const titleEl = document.createElement('h3');
        titleEl.textContent = title;
        titleEl.style = `
            margin: 0 0 20px 0;
            color: #2c3e50;
            font-size: 1.4em;
            font-weight: 600;
            padding-bottom: 12px;
            border-bottom: 2px solid #eee;
        `;

        dialog.appendChild(titleEl);
        overlay.appendChild(dialog);

        // 添加动画关键帧
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes zoomIn {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        return { overlay, dialog, titleEl };
    }

    // 创建按钮
    createButton(text, color, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style = `
            padding: 12px 28px;
            border: none;
            border-radius: 8px;
            background: ${color};
            color: white;
            cursor: pointer;
            transition: 0.3s;
            font-size: 14px;
            font-weight: 500;
        `;
        btn.addEventListener('mouseover', () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.transform = 'none';
            btn.style.boxShadow = 'none';
        });
        btn.addEventListener('click', onClick);
        return btn;
    }

    // Text Input弹窗
    showTextDialog(args) {
        return new Promise(resolve => {
            const { overlay, dialog } = this.createDialog(args.title);

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = args.prompt;
            input.style = `
                width: 100%;
                padding: 14px;
                border: 2px solid #ddd;
                border-radius: 8px;
                font-size: 16px;
                margin-bottom: 20px;
                transition: 0.3s;
            `;
            input.addEventListener('focus', () => {
                input.style.borderColor = '#4CAF50';
            });
            input.addEventListener('blur', () => {
                input.style.borderColor = '#ddd';
            });

            const buttonContainer = document.createElement('div');
            buttonContainer.style = 'display: flex; gap: 12px; justify-content: flex-end;';

            const confirmBtn = this.createButton('confirm', '#4CAF50', () => {
                this.lastResults.text = input.value;
                document.body.removeChild(overlay);
                resolve();
            });

            const cancelBtn = this.createButton('Cancel', '#f44336', () => {
                this.lastResults.text = null;
                document.body.removeChild(overlay);
                resolve();
            });

            buttonContainer.appendChild(cancelBtn);
            buttonContainer.appendChild(confirmBtn);
            
            dialog.appendChild(input);
            dialog.appendChild(buttonContainer);
            document.body.appendChild(overlay);
        });
    }

    // Digital input弹窗
    showNumberDialog(args) {
        return new Promise(resolve => {
            const { overlay, dialog } = this.createDialog(args.title);

            const input = document.createElement('input');
            input.type = 'number';
            input.placeholder = args.prompt;
            input.style = `
                width: 100%;
                padding: 14px;
                border: 2px solid #ddd;
                border-radius: 8px;
                font-size: 16px;
                margin-bottom: 20px;
            `;

            const buttonContainer = document.createElement('div');
            buttonContainer.style = 'display: flex; gap: 12px; justify-content: flex-end;';

            const confirmBtn = this.createButton('confirm', '#4CAF50', () => {
                this.lastResults.number = Number(input.value) || 0;
                document.body.removeChild(overlay);
                resolve();
            });

            const cancelBtn = this.createButton('cancel', '#f44336', () => {
                this.lastResults.number = 0;
                document.body.removeChild(overlay);
                resolve();
            });

            buttonContainer.appendChild(cancelBtn);
            buttonContainer.appendChild(confirmBtn);
            
            dialog.appendChild(input);
            dialog.appendChild(buttonContainer);
            document.body.appendChild(overlay);
        });
    }

    // Enter password弹窗
    showPasswordDialog(args) {
        return new Promise(resolve => {
            const { overlay, dialog } = this.createDialog(args.title);

            const input = document.createElement('input');
            input.type = 'password';
            input.placeholder = '请输入密码...';
            input.style = `
                width: 100%;
                padding: 14px;
                border: 2px solid #ddd;
                border-radius: 8px;
                font-size: 16px;
                margin-bottom: 20px;
                letter-spacing: 2px;
            `;

            const buttonContainer = document.createElement('div');
            buttonContainer.style = 'display: flex; gap: 12px; justify-content: flex-end;';

            const confirmBtn = this.createButton('confirm', '#4CAF50', () => {
                this.lastResults.password = input.value;
                document.body.removeChild(overlay);
                resolve();
            });

            const cancelBtn = this.createButton('cancel', '#f44336', () => {
                this.lastResults.password = '';
                document.body.removeChild(overlay);
                resolve();
            });

            buttonContainer.appendChild(cancelBtn);
            buttonContainer.appendChild(confirmBtn);
            
            dialog.appendChild(input);
            dialog.appendChild(buttonContainer);
            document.body.appendChild(overlay);
        });
    }

    // 多选弹窗
    showMultiSelectDialog(args) {
        return new Promise(resolve => {
            const { overlay, dialog } = this.createDialog(args.title);
            
            const optionsContainer = document.createElement('div');
            optionsContainer.style = `
                max-height: 300px;
                overflow-y: auto;
                margin-bottom: 20px;
            `;

            this.optionCache.multiSelect.forEach(option => {
                const label = document.createElement('label');
                label.style = 'display: flex; align-items: center; padding: 12px; transition: 0.2s; border-radius: 6px;';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = option;
                checkbox.style = `
                    width: 18px;
                    height: 18px;
                    margin-right: 12px;
                `;

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(option));
                
                label.addEventListener('mouseover', () => {
                    label.style.background = '#f8f9fa';
                });
                label.addEventListener('mouseout', () => {
                    label.style.background = 'transparent';
                });

                optionsContainer.appendChild(label);
            });

            const buttonContainer = document.createElement('div');
            buttonContainer.style = 'display: flex; gap: 12px; justify-content: flex-end;';

            const confirmBtn = this.createButton('confirm', '#4CAF50', () => {
                this.lastResults.multiSelect = Array.from(optionsContainer.querySelectorAll('input:checked'))
                    .map(input => input.value);
                document.body.removeChild(overlay);
                resolve();
            });

            const cancelBtn = this.createButton('cancel', '#f44336', () => {
                this.lastResults.multiSelect = [];
                document.body.removeChild(overlay);
                resolve();
            });

            buttonContainer.appendChild(cancelBtn);
            buttonContainer.appendChild(confirmBtn);
            
            dialog.appendChild(optionsContainer);
            dialog.appendChild(buttonContainer);
            document.body.appendChild(overlay);
        });
    }

    // 动态Option弹窗
    showSelectDialog(args) {
        return new Promise(resolve => {
            const { overlay, dialog } = this.createDialog(args.title);
            
            const optionsContainer = document.createElement('div');
            optionsContainer.style = 'display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;';

            this.optionCache.select.forEach((option, index) => {
                const btn = document.createElement('button');
                btn.textContent = option;
                btn.style = `
                    padding: 14px;
                    border: none;
                    border-radius: 8px;
                    background: #f8f9fa;
                    color: #2c3e50;
                    cursor: pointer;
                    transition: 0.3s;
                    text-align: left;
                `;
                btn.addEventListener('click', () => {
                    this.lastResults.select = option;
                    document.body.removeChild(overlay);
                    resolve();
                });
                btn.addEventListener('mouseover', () => {
                    btn.style.background = '#4CAF50';
                    btn.style.color = 'white';
                });
                btn.addEventListener('mouseout', () => {
                    btn.style.background = '#f8f9fa';
                    btn.style.color = '#2c3e50';
                });
                optionsContainer.appendChild(btn);
            });

            dialog.appendChild(optionsContainer);
            document.body.appendChild(overlay);
        });
    }

    // 更新Option
    updateSelectOptions(args) {
        this.optionCache.select = args.options.split(',').map(s => s.trim());
    }

    // 结果获取方法
    getTextResult() { return this.lastResults.text || ''; }
    getNumberResult() { return this.lastResults.number || 0; }
    getPasswordResult() { return this.lastResults.password || ''; }
    getMultiSelectResult() { return this.lastResults.multiSelect.join(', ') || ''; }
    getSelectResult() { return this.lastResults.select || ''; }
}

Scratch.extensions.register(new ZYDialogExtension());