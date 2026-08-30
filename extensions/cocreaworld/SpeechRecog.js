(function (_Scratch) {
    const { ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime } = _Scratch;

    translate.setup({
        zh: {
            'speech_recognition_extensionName': '实时语音转文字扩展',
            'startListeningBlock': '开始监听语音',
            'stopListeningBlock': '停止监听语音',
            'getTranscriptBlock': '获取转录文本',
            'isListeningBlock': '是否正在监听语音',
            'clearTranscriptBlock': '清空识别结果'
        },
        en: {
            'speech_recognition_extensionName': 'Real-time Speech to Text Extension',
            'startListeningBlock': 'Start Listening',
            'stopListeningBlock': 'Stop Listening',
            'getTranscriptBlock': 'Get Transcript',
            'isListeningBlock': 'Is Listening',
            'clearTranscriptBlock': 'Clear Transcript'
        }
    });

    class SpeechRecognitionExtension {
        constructor(_runtime) {
            this._runtime = _runtime;
            this.recognition = null;
            this.transcript = '';
            this.listening = false;
            this.initSpeechRecognition();
        }

        initSpeechRecognition() {
            if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
                this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
                this.recognition.continuous = true;
                this.recognition.interimResults = true;
                this.recognition.lang = 'zh-CN'; // 可根据需要修改语言
                this.recognition.onresult = this.handleSpeechRecognitionResult.bind(this);
                this.recognition.onerror = this.handleSpeechRecognitionError.bind(this);
            } else {
                console.error('Speech recognition not supported in this browser.');
            }
        }

        handleSpeechRecognitionResult(event) {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    this.transcript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
        }

        handleSpeechRecognitionError(event) {
            console.error('Speech recognition error:', event.error);
        }

        getInfo() {
            const startListening = {
                opcode: 'startListening',
                blockType: BlockType.COMMAND,
                text: translate({ id: 'startListeningBlock' }),
                blockIconURI: 'https://example.com/start_listening_icon.png'
            };

            const stopListening = {
                opcode: 'stopListening',
                blockType: BlockType.COMMAND,
                text: translate({ id: 'stopListeningBlock' }),
                blockIconURI: 'https://example.com/stop_listening_icon.png'
            };

            const getTranscript = {
                opcode: 'getTranscript',
                blockType: BlockType.REPORTER,
                text: translate({ id: 'getTranscriptBlock' }),
                blockIconURI: 'https://example.com/get_transcript_icon.png'
            };

            const isListening = {
                opcode: 'isListening',
                blockType: BlockType.BOOLEAN,
                text: translate({ id: 'isListeningBlock' }),
                blockIconURI: 'https://example.com/is_listening_icon.png'
            };

            const clearTranscript = {
                opcode: 'clearTranscript',
                blockType: BlockType.COMMAND,
                text: translate({ id: 'clearTranscriptBlock' }),
                blockIconURI: 'https://example.com/clear_transcript_icon.png'
            };

            return {
                id: 'speechRecognition',
                name: translate({ id: 'speech_recognition_extensionName' }),
                color1: '#4CAF50',
                color2: '#388E3C',
                blocks: [startListening, stopListening, getTranscript, isListening, clearTranscript],
                menus: {}
            };
        }

        startListening() {
            if (this.recognition) {
                this.recognition.start();
                this.listening = true;
            } else {
                console.error('Speech recognition not initialized.');
            }
        }

        stopListening() {
            if (this.recognition) {
                this.recognition.stop();
                this.listening = false;
            } else {
                console.error('Speech recognition not initialized.');
            }
        }

        getTranscript() {
            return this.transcript;
        }

        isListening() {
            return this.listening;
        }

        clearTranscript() {
            this.transcript = '';
        }
    }

    extensions.register(new SpeechRecognitionExtension(runtime));
}(Scratch));