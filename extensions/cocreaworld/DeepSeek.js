// Name: DeepSeek AI
// ID: deepSeekAI
// Description: DeepSeek 探索未至之境
// By: Lumi
// Original: Lumi
// License: MPL-2.0
(function (_Scratch) {
    const { ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime } = _Scratch;

    translate.setup({
        zh: {
            'extensionName': 'DeepSeek AI',
            'askBlock': '询问 DeepSeek [QUESTION] 使用模型 [MODEL]',
            'responseBlock': 'AI 回答',
            'defaultQuestion': '你好',
            'loading': '请求中...',
            'error': '请求失败',
            'checkBalance': '查看余额',
            'balance': '余额',
            'modelDeepseekChat': 'deepseek-chat',
            'modelDeepseekReasoner': 'deepseek-reasoner',
            'modelDeepseekV1': 'deepseek-V1',
            'modelDeepseekV2': 'deepseek-V2',
            'modelDeepseekV3': 'deepseek-V3'
        },
        en: {
            'extensionName': 'DeepSeek AI',
            'askBlock': 'ask DeepSeek [QUESTION] using model [MODEL]',
            'responseBlock': 'AI response',
            'defaultQuestion': 'Hello',
            'loading': 'Loading...',
            'error': 'Request failed',
            'checkBalance': 'Check balance',
            'balance': 'Balance',
            'modelDeepseekChat': 'deepseek-chat',
            'modelDeepseekReasoner': 'deepseek-reasoner',
            'modelDeepseekV1': 'deepseek-V1',
            'modelDeepseekV2': 'deepseek-V2',
            'modelDeepseekV3': 'deepseek-V3'
        }
    });

    class DeepSeekExtension {
        constructor(runtime) {
            this.runtime = runtime;
            this.lastResponse = '';
            this.balance = 0;
        }

        getInfo() {
            return {
                id: 'deepSeekAI',
                name: translate({ id: 'extensionName' }),
                color1: '#005a9c',
                color2: '#005a9c',
                blocks: [
                    {
                        opcode: 'askQuestion',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'askBlock' }),
                        arguments: {
                            QUESTION: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({ id: 'defaultQuestion' })
                            },
                            MODEL: {
                                type: ArgumentType.STRING,
                                menu: 'modelMenu'
                            }
                        }
                    },
                    {
                        opcode: 'getResponse',
                        blockType: BlockType.REPORTER,
                        text: translate({ id: 'responseBlock' })
                    },
                    {
                        opcode: 'checkBalance',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'checkBalance' })
                    },
                    {
                        opcode: 'getBalance',
                        blockType: BlockType.REPORTER,
                        text: translate({ id: 'balance' })
                    }
                ],
                menus: {
                    modelMenu: {
                        items: [
                            translate({ id: 'modelDeepseekChat' }),
                            translate({ id: 'modelDeepseekReasoner' }),
                            translate({ id: 'modelDeepseekV1' }),
                            translate({ id: 'modelDeepseekV2' }),
                            translate({ id: 'modelDeepseekV3' })
                        ]
                    }
                }
            };
        }

        async askQuestion(args) {
            try {
                this.lastResponse = translate({ id: 'loading' });
                const question = Cast.toString(args.QUESTION);
                const model = Cast.toString(args.MODEL);

                const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer sk-a635cccf7294440b9a20cd704ba00b9f'
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [{
                            role: 'user',
                            content: question
                        }]
                    })
                });

                const data = await response.json();
                this.lastResponse = data.choices[0].message.content;
            } catch (error) {
                console.error('API Error:', error);
                this.lastResponse = translate({ id: 'error' });
            }
        }

        async checkBalance() {
            try {
                const response = await fetch('https://api.deepseek.com/user/balance', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer sk-a635cccf7294440b9a20cd704ba00b9f'
                    }
                });

                const data = await response.json();
                this.balance = data.balance;
            } catch (error) {
                console.error('Balance Check Error:', error);
                this.balance = translate({ id: 'error' });
            }
        }

        getResponse() {
            return this.lastResponse;
        }

        getBalance() {
            return this.balance;
        }
    }

    extensions.register(new DeepSeekExtension(runtime));
})(Scratch);