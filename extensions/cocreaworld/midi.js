// name: MIDI.js
// version: 0.1.0
// author: Y_yzbt
// This extension must run only in browser with Web MIDI API support.
// It does not work in TurboWarp Desktop or other environments without Web MIDI API support.
// If you do not see any MIDI output devices, try installing MIDIMapper by CoolSoft (https://coolsoft.altervista.org/en/midimapper) and restarting your browser.
(function (Scratch) {
    'use strict';
    const { ArgumentType, BlockType } = Scratch;

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('This Extension must run unsandboxed')
    }

    class MIDI {
        constructor() {
            this.midiAccess = null;
            this.outputDevice = null;
        }
        getInfo() {
            return {
                id: 'midi',
                name: 'MIDI',
                blocks: [
                    {
                        opcode: 'supportWebMIDIAPI',
                        blockType: BlockType.BOOLEAN,
                        text: '支持 Web MIDI API ?'
                    },
                    {
                        opcode: 'requestMIDIAccess',
                        blockType: BlockType.COMMAND,
                        text: '请求 MIDI 访问'
                    },
                    {
                        opcode: 'accessed',
                        blockType: BlockType.BOOLEAN,
                        text: 'MIDI 访问已获取 ?'
                    },
                    {
                        opcode: 'availableOutputDevices',
                        blockType: BlockType.REPORTER,
                        text: '可用的 MIDI 输出设备'
                    },
                    {
                        opcode: 'indexOfAvailableOutputDevice',
                        blockType: BlockType.REPORTER,
                        text: '第 [INDEX] 个可用的 MIDI 输出设备',
                        arguments: {
                            INDEX: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'connect',
                        blockType: BlockType.COMMAND,
                        text: '连接到 [DEVICE]',
                        arguments: {
                            DEVICE: {
                                type: ArgumentType.STRING,
                                menu: 'availableOutputDevices',
                                defaultValue: '选择设备'
                            }
                        }
                    },
                    {
                        opcode: 'disconnect',
                        blockType: BlockType.COMMAND,
                        text: '断开连接'
                    },
                    {
                        opcode: 'sendNoteOn',
                        blockType: BlockType.COMMAND,
                        text: 'Note On (演奏) 通道 [CHANNEL] 音符 [NOTE] 力度 [VELOCITY]',
                        arguments: {
                            CHANNEL: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            NOTE: {
                                type: ArgumentType.NOTE,
                                defaultValue: 60
                            },
                            VELOCITY: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 127
                            }
                        }
                    },
                    {
                        opcode: 'sendNoteOff',
                        blockType: BlockType.COMMAND,
                        text: 'Note Off (释放) 通道 [CHANNEL] 音符 [NOTE] 力度 [VELOCITY]',
                        arguments: {
                            CHANNEL: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            NOTE: {
                                type: ArgumentType.NOTE,
                                defaultValue: 60
                            },
                            VELOCITY: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 127
                            }
                        }
                    },
                    {
                        opcode: 'sendProgramChange',
                        blockType: BlockType.COMMAND,
                        text: 'Program Change (换乐器) 通道 [CHANNEL] 乐器 [PROGRAM]',
                        arguments: {
                            CHANNEL: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            PROGRAM: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: '高级'
                    },
                    {
                        opcode: 'sendRaw',
                        blockType: BlockType.COMMAND,
                        text: 'send([DATA])',
                        arguments: {
                            DATA: {
                                type: ArgumentType.STRING,
                                defaultValue: '903c7f'
                            }
                        }
                    }
                ],
                menus: {
                    availableOutputDevices: {
                        acceptReporters: true,
                        items: 'getAvailableOutputDevices'
                    }
                }
            }
        }

        getAvailableOutputDevices() {
            if (!this.supportWebMIDIAPI()) return [''];
            if (!this.midiAccess) return [''];
            const list = Array.from(this.midiAccess.outputs.values()).map(o => o.name);
            if (list.length === 0) return [''];
            return list;
        }

        supportWebMIDIAPI() {
            return !!navigator.requestMIDIAccess
        }

        accessed() {
            return !!this.midiAccess
        }

        async requestMIDIAccess() {
            if (!this.supportWebMIDIAPI()) {
                console.error('不支持 Web MIDI API')
                return
            }
            try {
                this.midiAccess = await navigator.requestMIDIAccess()
                console.log('MIDI 访问已获取, 可用的输出设备:', Array.from(this.midiAccess.outputs.values()).map(output => output.name))
            } catch (error) {
                this.midiAccess = null
                console.error('请求 MIDI 访问失败', error)
            }
        }

        availableOutputDevices() {
            return JSON.stringify(this.getAvailableOutputDevices());
        }

        indexOfAvailableOutputDevice(args) {
            const index = args.INDEX - 1;
            const devices = this.getAvailableOutputDevices();
            return devices[index] || '';
        }

        connect(args) {
            if (!this.supportWebMIDIAPI()) {
                console.error('不支持 Web MIDI API')
                return
            }
            if (!this.midiAccess) {
                console.error('无 MIDI 访问权限')
                return
            }
            const deviceName = args.DEVICE
            const output = Array.from(this.midiAccess.outputs.values()).find(output => output.name === deviceName)
            if (!output) {
                console.error('未找到指定的 MIDI 输出设备:', deviceName)
                return
            }
            console.log('已连接到 MIDI 输出设备:', deviceName)
            this.outputDevice = output
        }

        disconnect() {
            if (this.outputDevice) {
                console.log('已断开连接的 MIDI 输出设备:', this.outputDevice.name)
                this.outputDevice = null
            } else {
                console.warn('没有连接的 MIDI 输出设备')
            }
        }

        sendNoteOn(args) {
            if (!this.outputDevice) {
                console.error('没有连接的 MIDI 输出设备')
                return
            }
            const channel = Math.max(1, Math.min(16, args.CHANNEL)) - 1
            const note = Math.max(0, Math.min(127, args.NOTE))
            const velocity = Math.max(0, Math.min(127, args.VELOCITY))
            this.outputDevice.send([0x90 + channel, note, velocity])
            console.log(`发送 Note On: ${note}，力度: ${velocity}`)
        }

        sendNoteOff(args) {
            if (!this.outputDevice) {
                console.error('没有连接的 MIDI 输出设备')
                return
            }
            const channel = Math.max(1, Math.min(16, args.CHANNEL)) - 1
            const note = Math.max(0, Math.min(127, args.NOTE))
            const velocity = Math.max(0, Math.min(127, args.VELOCITY))
            this.outputDevice.send([0x80 + channel, note, velocity])
            console.log(`发送 Note Off: ${note}，力度: ${velocity}`)
        }

        sendProgramChange(args) {
            if (!this.outputDevice) {
                console.error('没有连接的 MIDI 输出设备')
                return
            }
            const channel = Math.max(1, Math.min(16, args.CHANNEL)) - 1
            const program = Math.max(0, Math.min(127, args.PROGRAM))
            this.outputDevice.send([0xC0 + channel, program])
            console.log(`发送 Program Change: ${program}，通道: ${channel + 1}`)
        }

        sendRaw(args) {
            if (!this.outputDevice) { console.error('没有连接的 MIDI 输出设备'); return; }
            try {
                const raw = args.DATA.trim();
                let bytes = [];

                if (/[,\s]/.test(raw)) {
                    bytes = raw.split(/[,\s]+/).map(s => {
                        s = s.trim();
                        return s.startsWith('0x') || s.startsWith('0X')
                            ? parseInt(s, 16)
                            : parseInt(s, 10);
                    });
                } else {
                    for (let i = 0; i < raw.length; i += 2) {
                        bytes.push(parseInt(raw.substr(i, 2), 16));
                    }
                }

                bytes = bytes.filter(b => !isNaN(b) && b >= 0 && b <= 255);
                if (bytes.length === 0) { console.error('没有有效的 MIDI 数据'); return; }

                this.outputDevice.send(bytes);
                console.log('发送原始 MIDI 数据:', bytes);
            } catch (e) {
                console.error('发送失败:', e);
            }
        }
    }

    Scratch.extensions.register(new MIDI())
})(Scratch);