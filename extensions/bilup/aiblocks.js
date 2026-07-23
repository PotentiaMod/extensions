// Name: AI in Blocks
// ID: aiblocks
// Description: Create AI instances and interact with them using streaming responses
// By: RyaninCn11 <https://github.com/RyaninCn11>
// License: MIT

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('AI in Blocks extension must be run unsandboxed');
    }

    const templates = {};
    const instances = {};

    function getInstanceMenu() {
        const keys = Object.keys(instances);
        if (keys.length === 0) {
            return [''];
        }
        return keys;
    }

    class DeepSeekDynamicInstanceStream {
        getInfo() {
            return {
                id: 'aiblocks',
                name: Scratch.translate({
                    id: "extensionName",
                    default: "AI in Blocks"
                }),
                description: Scratch.translate({
                    id: "description",
                    default: "Create AI instances and interact with them using streaming responses"
                }),
                color1: '#4D61E2',
                color2: '#3B4CB8',
                color3: '#283593',
                blocks: [
                    {
                        opcode: 'createInstance',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate({
                            id: "createInstance",
                            default: "create AI instance [INSTANCE]"
                        }),
                        arguments: {
                            INSTANCE: { type: Scratch.ArgumentType.STRING, defaultValue: Scratch.translate({
                                id: "defaultInstanceName",
                                default: "My AI Assistant"
                            }) }
                        }
                    },
                    {
                        opcode: 'deleteInstance',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate({
                            id: "deleteInstance",
                            default: "delete AI instance [INSTANCE]"
                        }),
                        arguments: {
                            INSTANCE: { 
                                type: Scratch.ArgumentType.STRING, 
                                menu: 'dynamicInstancesMenu'
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'createTemplate',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate({
                            id: "createTemplate",
                            default: "create config template [NAME] URL: [URL] Key: [KEY] Model: [MODEL]"
                        }),
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: Scratch.translate({
                                id: "defaultTemplateName",
                                default: "My Custom Config"
                            }) },
                            URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://api.deepseek.com' },
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'sk-...' },
                            MODEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'deepseek-chat' }
                        }
                    },
                    {
                        opcode: 'bindInstanceToTemplate',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate({
                            id: "bindInstanceToTemplate",
                            default: "make instance [INSTANCE] use template [TEMPLATE]"
                        }),
                        arguments: {
                            INSTANCE: { type: Scratch.ArgumentType.STRING, menu: 'dynamicInstancesMenu' },
                            TEMPLATE: { type: Scratch.ArgumentType.STRING, defaultValue: Scratch.translate({
                                id: "defaultTemplateName",
                                default: "My Custom Config"
                            }) }
                        }
                    },
                    {
                        opcode: 'askAIInstance',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate({
                            id: "askAIInstance",
                            default: "ask instance [INSTANCE] [PROMPT]"
                        }),
                        arguments: {
                            INSTANCE: { type: Scratch.ArgumentType.STRING, menu: 'dynamicInstancesMenu' },
                            PROMPT: { type: Scratch.ArgumentType.STRING, defaultValue: Scratch.translate({
                                id: "defaultPrompt",
                                default: "Hello!"
                            }) }
                        }
                    },
                    '---',
                    {
                        opcode: 'whenInstanceStreaming',
                        blockType: Scratch.BlockType.HAT,
                        text: Scratch.translate({
                            id: "whenInstanceStreaming",
                            default: "when instance [INSTANCE] is typing"
                        }),
                        isEdgeActivated: false,
                        arguments: {
                            INSTANCE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'dynamicInstancesMenu'
                            }
                        }
                    },
                    {
                        opcode: 'whenInstanceCompleted',
                        blockType: Scratch.BlockType.HAT,
                        text: Scratch.translate({
                            id: "whenInstanceCompleted",
                            default: "when instance [INSTANCE] finished speaking"
                        }),
                        isEdgeActivated: false,
                        arguments: {
                            INSTANCE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'dynamicInstancesMenu'
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'getInstanceDisplayContent',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({
                            id: "getInstanceDisplayContent",
                            default: "instance [INSTANCE] current text"
                        }),
                        arguments: {
                            INSTANCE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'dynamicInstancesMenu'
                            }
                        }
                    },
                    {
                        opcode: 'getInstanceStatus',
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({
                            id: "getInstanceStatus",
                            default: "instance [INSTANCE] current status"
                        }),
                        arguments: {
                            INSTANCE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'dynamicInstancesMenu'
                            }
                        }
                    }
                ],
                menus: {
                    dynamicInstancesMenu: {
                        acceptReporters: false,
                        items: 'getInstanceMenuItems'
                    }
                }
            };
        }

        getInstanceMenuItems() {
            return getInstanceMenu();
        }

        createInstance(args) {
            const instanceId = Scratch.Cast.toString(args.INSTANCE).trim();
            if (!instanceId || instanceId === '') return;

            if (instances[instanceId]) {
                console.log(`Instance [${instanceId}] already exists.`);
                return;
            }

            instances[instanceId] = {
                templateName: '',
                rawBuffer: '',
                displayBuffer: '',
                status: 'idle',
                abortController: null,
                updateInterval: null
            };
            console.log(`Instance [${instanceId}] created successfully.`);
        }

        deleteInstance(args) {
            const instanceId = Scratch.Cast.toString(args.INSTANCE).trim();
            
            if (instances[instanceId]) {
                if (instances[instanceId].abortController) instances[instanceId].abortController.abort();
                if (instances[instanceId].updateInterval) clearInterval(instances[instanceId].updateInterval);
                
                delete instances[instanceId];
                console.log(`Instance [${instanceId}] deleted successfully.`);
            }
        }

        createTemplate(args) {
            const name = Scratch.Cast.toString(args.NAME).trim();
            let url = Scratch.Cast.toString(args.URL).trim();
            const key = Scratch.Cast.toString(args.KEY).trim();
            const model = Scratch.Cast.toString(args.MODEL).trim();

            if (url.endsWith('/')) url = url.slice(0, -1);
            if (!url.includes('/chat/completions')) {
                url = url.endsWith('/v1') ? url + '/chat/completions' : url + '/v1/chat/completions';
            }

            templates[name] = { endpoint: url, apiKey: key, model: model };
        }

        bindInstanceToTemplate(args) {
            const instanceId = Scratch.Cast.toString(args.INSTANCE).trim();
            const templateName = Scratch.Cast.toString(args.TEMPLATE).trim();

            if (!instances[instanceId]) return;
            
            if (templates[templateName]) instances[instanceId].templateName = templateName;
        }

        getInstanceDisplayContent(args) {
            const instanceId = Scratch.Cast.toString(args.INSTANCE).trim();
            return instances[instanceId] ? instances[instanceId].displayBuffer : '';
        }

        getInstanceStatus(args) {
            const instanceId = Scratch.Cast.toString(args.INSTANCE).trim();
            return instances[instanceId] ? instances[instanceId].status : 'idle';
        }

        askAIInstance(args) {
            const instanceId = Scratch.Cast.toString(args.INSTANCE).trim();
            const prompt = Scratch.Cast.toString(args.PROMPT);

            const inst = instances[instanceId];
            if (!inst) return;

            if (inst.abortController) inst.abortController.abort();
            if (inst.updateInterval) clearInterval(inst.updateInterval);

            inst.rawBuffer = '';
            inst.displayBuffer = '';
            inst.status = 'connecting';
            inst.abortController = new AbortController();

            this._startInstanceTypingTimer(instanceId);
            this._fetchInstanceStream(instanceId, prompt);
        }

        async _fetchInstanceStream(instanceId, prompt) {
            const inst = instances[instanceId];
            if (!inst) return;
            if(!templates[inst.templateName]) return;
            const tpl = templates[inst.templateName];

            try {
                const response = await fetch(tpl.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tpl.apiKey}`
                    },
                    body: JSON.stringify({
                        model: tpl.model,
                        messages: [{ role: 'user', content: prompt }],
                        stream: true
                    }),
                    signal: inst.abortController.signal
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                inst.status = 'streaming';
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');
                    
                    for (const line of lines) {
                        const cleanedLine = line.trim();
                        if (!cleanedLine || cleanedLine === 'data: [DONE]') continue;
                        
                        if (cleanedLine.startsWith('data:')) {
                            try {
                                const parsed = JSON.parse(cleanedLine.slice(5));
                                const content = parsed.choices[0]?.delta?.content || '';
                                inst.rawBuffer += content;
                            } catch (e) {}
                        }
                    }
                }
                inst.status = 'completed';

            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log(`Instance [${instanceId}] request aborted.`);
                } else {
                    console.error(`Instance [${instanceId}] error:`, error);
                    inst.rawBuffer += `\n[Error: ${error.message}]`;
                    inst.status = 'completed';
                }
            }
        }

        _startInstanceTypingTimer(instanceId) {
            const runtime = Scratch.vm.runtime;
            const inst = instances[instanceId];

            inst.updateInterval = setInterval(() => {
                if (!instances[instanceId]) { 
                    clearInterval(inst.updateInterval);
                    return;
                }

                if (inst.rawBuffer.length > 0) {
                    const speed = Math.ceil(inst.rawBuffer.length / 4);
                    const chunk = inst.rawBuffer.substring(0, speed);
                    
                    inst.displayBuffer += chunk;
                    inst.rawBuffer = inst.rawBuffer.substring(speed);

                    runtime.startHats('aiblocks_whenInstanceStreaming', {
                        INSTANCE: instanceId
                    });

                } else if (inst.status === 'completed' && inst.rawBuffer.length === 0) {
                    inst.status = 'idle';
                    clearInterval(inst.updateInterval);
                    
                    runtime.startHats('aiblocks_whenInstanceCompleted', {
                        INSTANCE: instanceId
                    });
                }
            }, 40);
        }
    }

    Scratch.extensions.register(new DeepSeekDynamicInstanceStream());
})(Scratch);