(function (Scratch) {
    'use strict';

    if (!Scratch.extensions) return;

    const { ArgumentType, BlockType, Cast, translate, runtime } = Scratch;

    translate.setup({
        zh: {
            'extensionName': 'AI Pro',
            'createAndConfigAI': '创建一个AI，命名为 [NAME]，模型为 [MODEL]，APIKey设为 [KEY]',
            'getAIProperty': '[TARGET] 为 [VALUE] 的AI的 [PROPERTY]',
            'sendMessageAndGetReply': '向 [TARGET] 为 [VALUE] 的AI发送消息 [MESSAGE]',
            'lastAccessSuccess': '最近一次访问是否成功',
            'lastAccessError': '最近一次访问的错误',
            'lastAccessResult': '最近一次访问的结果',
            'allAIs': '所有AI列表',
            'defaultModel': '千问'
        },
        en: {
            'extensionName': 'AI Pro',
            'createAndConfigAI': 'create an AI named [NAME] with model [MODEL] and APIKey [KEY]',
            'getAIProperty': 'AI with [TARGET] [VALUE]\'s [PROPERTY]',
            'sendMessageAndGetReply': 'send message [MESSAGE] to AI with [TARGET] [VALUE]',
            'lastAccessSuccess': 'last access success',
            'lastAccessError': 'last access error',
            'lastAccessResult': 'last access result',
            'allAIs': 'all AIs list',
            'defaultModel': 'Qwen'
        }
    });

    function AIProExtension(runtime) {
        this.runtime = runtime;
        this.aiInstances = {};
        this.lastAccessSuccess = false;
        this.lastAccessResult = '';
        this.lastAccessError = '';

        // 1. API 请求地址映射
        this.apiConfigs = {
            '千问': 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            'DeepSeek': 'https://api.deepseek.com/v1/chat/completions',
            '豆包': 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
            'ChatGPT': 'https://api.openai.com/v1/chat/completions'
        };

        // 2. 模型名称映射表
        this.modelMapping = {
            '千问': 'qwen-turbo',
            'DeepSeek': 'deepseek-chat',
            '豆包': 'doubao-pro-32k',
            'ChatGPT': 'gpt-3.5-turbo'
        };
    }

    AIProExtension.prototype.getInfo = function () {
        return {
            id: 'aiProExt',
            name: translate({id: 'extensionName'}),
            color1: '#4C97FF',
            color2: '#3373CC',
            blockIconURI: 'data:image/svg+xml;base64,' + btoa(`<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#4C97FF"/><circle cx="20" cy="16" r="6" fill="white"/><path d="M12 30 C12 24 28 24 28 30" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="20" cy="16" r="2" fill="#4C97FF"/></svg>`),
            blocks: [
                // 1. 三合一创建积木
                {
                    opcode: 'createAndConfigAI',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'createAndConfigAI'}),
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: 'MyAI' },
                        MODEL: { type: ArgumentType.STRING, menu: 'modelMenu', defaultValue: translate({id: 'defaultModel'}) },
                        KEY: { type: ArgumentType.STRING, defaultValue: 'sk-xxxxxxxx' }
                    }
                },
                '---',
                // 2. 获取AI属性
                {
                    opcode: 'getAIProperty',
                    blockType: BlockType.REPORTER,
                    text: translate({id: 'getAIProperty'}),
                    arguments: {
                        TARGET: { type: ArgumentType.STRING, menu: 'targetMenu', defaultValue: '名称' },
                        VALUE: { type: ArgumentType.STRING, defaultValue: 'MyAI' },
                        PROPERTY: { type: ArgumentType.STRING, menu: 'propertyMenu', defaultValue: '名称' }
                    }
                },
                '---',
                // 3. 向AI发送消息并获取回复
                {
                    opcode: 'sendMessageAndGetReply',
                    blockType: BlockType.REPORTER,
                    text: translate({id: 'sendMessageAndGetReply'}),
                    arguments: {
                        TARGET: { type: ArgumentType.STRING, menu: 'targetMenu', defaultValue: '名称' },
                        VALUE: { type: ArgumentType.STRING, defaultValue: 'MyAI' },
                        MESSAGE: { type: ArgumentType.STRING, defaultValue: '你好，AI！' }
                    }
                },
                '---',
                // 4. 【核心找回】最近一次访问是否成功 (布尔值积木)
                {
                    opcode: 'getLastAccessSuccess',
                    blockType: BlockType.BOOLEAN,
                    text: translate({id: 'lastAccessSuccess'})
                },
                // 5. 最近一次访问的错误
                {
                    opcode: 'getLastAccessError',
                    blockType: BlockType.REPORTER,
                    text: translate({id: 'lastAccessError'})
                },
                // 6. 最近一次访问的结果
                {
                    opcode: 'getLastAccessResult',
                    blockType: BlockType.REPORTER,
                    text: translate({id: 'lastAccessResult'})
                },
                '---',
                // 7. 所有AI列表
                {
                    opcode: 'getAllAIs',
                    blockType: BlockType.REPORTER,
                    text: translate({id: 'allAIs'})
                }
            ],
            menus: {
                modelMenu: { acceptReporters: true, items: ['千问', 'DeepSeek', '豆包', 'ChatGPT'] },
                targetMenu: { acceptReporters: true, items: ['id', '名称'] },
                propertyMenu: { acceptReporters: true, items: ['名称', 'ID', '最近的错误', '最近回复'] }
            }
        };
    };

    // 1. 三合一创建逻辑
    AIProExtension.prototype.createAndConfigAI = function (args) {
        const name = Cast.toString(args.NAME).trim();
        const model = Cast.toString(args.MODEL);
        const apiKey = Cast.toString(args.KEY).trim();

        this.aiInstances[name] = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            name: name,
            model: model,
            apiKey: apiKey,
            history: [],
            lastReply: '',
            lastError: ''
        };
    };

    // 2. 获取AI属性逻辑
    AIProExtension.prototype.getAIProperty = function (args) {
        const target = Cast.toString(args.TARGET);
        const value = Cast.toString(args.VALUE).trim();
        const property = Cast.toString(args.PROPERTY);

        let instance = null;
        for (const key in this.aiInstances) {
            const ai = this.aiInstances[key];
            if ((target === 'id' && ai.id === value) || (target === '名称' && ai.name === value)) {
                instance = ai;
                break;
            }
        }

        if (!instance) return '错误: 未找到该AI';

        switch (property) {
            case '名称': return instance.name;
            case 'ID': return instance.id;
            case '最近的错误': return instance.lastError || '无';
            case '最近回复': return instance.lastReply || '无';
            default: return '未知属性';
        }
    };

    // 3. 向AI发送消息并获取回复
    AIProExtension.prototype.sendMessageAndGetReply = async function (args) {
        const target = Cast.toString(args.TARGET);
        const value = Cast.toString(args.VALUE).trim();
        const message = Cast.toString(args.MESSAGE);

        let instance = null;
        for (const key in this.aiInstances) {
            const ai = this.aiInstances[key];
            if ((target === 'id' && ai.id === value) || (target === '名称' && ai.name === value)) {
                instance = ai;
                break;
            }
        }

        if (!instance) {
            this.lastAccessSuccess = false;
            this.lastAccessError = '错误: 未找到该AI';
            this.lastAccessResult = '';
            return '错误: 未找到该AI';
        }

        const apiUrl = this.apiConfigs[instance.model];
        const realModelName = this.modelMapping[instance.model] || instance.model; 

        if (!apiUrl) {
            this.lastAccessSuccess = false;
            this.lastAccessError = `错误: 不支持的模型 ${instance.model}`;
            this.lastAccessResult = '';
            return this.lastAccessError;
        }

        try {
            instance.history.push({ role: 'user', content: message });

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${instance.apiKey}`
                },
                body: JSON.stringify({
                    model: realModelName,
                    messages: instance.history
                })
            });

            const data = await response.json();

            if (data.choices && data.choices.length > 0) {
                const reply = data.choices[0].message.content;
                instance.history.push({ role: 'assistant', content: reply });
                instance.lastReply = reply;
                instance.lastError = '';

                this.lastAccessSuccess = true; // 成功时设为 true
                this.lastAccessResult = reply;
                this.lastAccessError = '';
                return reply;
            } else {
                const errMsg = data.error?.message || '未知API错误';
                instance.lastError = errMsg;
                instance.lastReply = '';

                this.lastAccessSuccess = false; // 失败时设为 false
                this.lastAccessResult = '';
                this.lastAccessError = errMsg;
                return errMsg;
            }
        } catch (error) {
            instance.lastError = error.message;
            instance.lastReply = '';

            this.lastAccessSuccess = false; // 发生异常时设为 false
            this.lastAccessResult = '';
            this.lastAccessError = error.message;
            return error.message;
        }
    };

    // 4. 【核心找回】最近一次访问是否成功
    AIProExtension.prototype.getLastAccessSuccess = function () {
        return this.lastAccessSuccess;
    };

    // 5. 最近一次访问的错误
    AIProExtension.prototype.getLastAccessError = function () {
        return this.lastAccessError || '无';
    };

    // 6. 最近一次访问的结果
    AIProExtension.prototype.getLastAccessResult = function () {
        return this.lastAccessResult || '无';
    };

    // 7. 获取所有AI列表
    AIProExtension.prototype.getAllAIs = function () {
        const list = [];
        for (const key in this.aiInstances) {
            const ai = this.aiInstances[key];
            list.push(`'${ai.name},${ai.model},${ai.id}'`);
        }
        return `[${list.join(',')}]`;
    };

    Scratch.extensions.register(new AIProExtension(runtime));

})(Scratch);