// DeepSeek AI Extension for Scratch/Gandi
// 支持基础问答和高级参数配置

class DeepSeekExtension {
    constructor() {
        this.apiKey = '';
        this.baseURL = 'https://api.deepseek.com';
        this.model = 'deepseek-v4-pro';
    }

    // 获取 API 密钥
    getApiKey(providedKey) {
        if (providedKey && providedKey.trim() !== '') {
            this.apiKey = providedKey.trim();
            return this.apiKey;
        }
        if (typeof GANDI !== 'undefined' && GANDI.env && GANDI.env.DEEPSEEK_API_KEY) {
            this.apiKey = GANDI.env.DEEPSEEK_API_KEY;
            return this.apiKey;
        }
        if (typeof Scratch !== 'undefined' && Scratch.env && Scratch.env.DEEPSEEK_API_KEY) {
            this.apiKey = Scratch.env.DEEPSEEK_API_KEY;
            return this.apiKey;
        }
        return null;
    }

    // 积木1: 输入问题（）API（）（默认参数）
    async askQuestion(args) {
        const question = args.QUESTION || '';
        const apiKeyInput = args.API_KEY || '';

        const apiKey = this.getApiKey(apiKeyInput);
        if (!apiKey) {
            return 'Error: Please provide a valid API Key';
        }
        if (!question || question.trim() === '') {
            return 'Error: Question cannot be empty';
        }

        try {
            const response = await this.callDeepSeek(apiKey, question, {
                model: 'deepseek-v4-pro',
                temperature: 1.0,
                maxTokens: 4096,
                reasoningEffort: 'medium'
            });
            return response;
        } catch (error) {
            console.error('DeepSeek API Error:', error);
            return 'Error: ' + error.message;
        }
    }

    // 积木2: 高级参数版本
    async askQuestionAdvanced(args) {
        const question = args.QUESTION || '';
        const apiKeyInput = args.API_KEY || '';
        const model = args.MODEL || 'deepseek-v4-pro';
        const temperature = parseFloat(args.TEMPERATURE) || 1.0;
        const maxTokens = parseInt(args.MAX_TOKENS) || 4096;
        const reasoningEffort = args.REASONING || 'medium';

        const apiKey = this.getApiKey(apiKeyInput);
        if (!apiKey) {
            return 'Error: Please provide a valid API Key';
        }
        if (!question || question.trim() === '') {
            return 'Error: Question cannot be empty';
        }
        if (temperature < 0 || temperature > 2) {
            return 'Error: Temperature must be between 0 and 2';
        }
        if (maxTokens < 1 || maxTokens > 8192) {
            return 'Error: Max tokens must be between 1 and 8192';
        }
        if (!['low', 'medium', 'high'].includes(reasoningEffort)) {
            return 'Error: Reasoning effort must be low, medium, or high';
        }

        try {
            const response = await this.callDeepSeek(apiKey, question, {
                model: model,
                temperature: temperature,
                maxTokens: maxTokens,
                reasoningEffort: reasoningEffort
            });
            return response;
        } catch (error) {
            console.error('DeepSeek API Error:', error);
            return 'Error: ' + error.message;
        }
    }

    // DeepSeek API 调用
    async callDeepSeek(apiKey, question, params) {
        const url = `${this.baseURL}/chat/completions`;

        const requestBody = {
            model: params.model,
            messages: [
                { role: 'system', content: 'You are an AI assistant in a Scratch programming environment. Please answer questions in a clear and concise manner.' },
                { role: 'user', content: question }
            ],
            stream: false,
            temperature: params.temperature,
            max_tokens: params.maxTokens,
            reasoning_effort: params.reasoningEffort
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API request failed (${response.status}): ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response content';
    }

    // 扩展注册信息
    getInfo() {
        return {
            id: 'usefulDeepseeksNormalAPI',
            name: 'DeepSeek AI',
            color1: '#4D6BFE',
            color2: '#3A56D4',
            color3: '#2A3FA8',
            blocks: [
                {
                    opcode: 'askQuestion',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '输入问题 [QUESTION] API [API_KEY]',
                    arguments: {
                        QUESTION: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Hello, please introduce yourself'
                        },
                        API_KEY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'askQuestionAdvanced',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '输入问题 [QUESTION] API [API_KEY] 模型 [MODEL] 温度 [TEMPERATURE] 最大字数 [MAX_TOKENS] 推理强度 [REASONING]',
                    arguments: {
                        QUESTION: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'What is the meaning of life?'
                        },
                        API_KEY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: ''
                        },
                        MODEL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'deepseek-v4-pro'
                        },
                        TEMPERATURE: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1.0
                        },
                        MAX_TOKENS: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 4096
                        },
                        REASONING: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'medium'
                        }
                    }
                }
            ]
        };
    }
}

// 注册扩展
if (typeof Scratch !== 'undefined' && Scratch.extensions) {
    Scratch.extensions.register(new DeepSeekExtension());
}

if (typeof GANDI !== 'undefined' && GANDI.extensions) {
    GANDI.extensions.register(new DeepSeekExtension());
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeepSeekExtension;
}