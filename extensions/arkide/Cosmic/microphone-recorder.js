// This is a Scratch Extension for Penguinmod and Turbowarp.
// It allows recording audio from the microphone and getting its Data URI.

class MicrophoneRecorderExtension {
    constructor() {
        /** @type {MediaRecorder|null} */
        this.mediaRecorder = null;
        /** @type {Blob[]} */
        this.audioChunks = [];
        /** @type {string} */
        this.recordedAudioDataURI = '';
        /** @type {boolean} */
        this.isRecording = false;
        this.dataURIGenerationPromise = null;

        // Bind 'this' to methods that will be called by Scratch runtime
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
        this.getRecordedAudioURI = this.getRecordedAudioURI.bind(this);
    }

    getInfo() {
        return {
            id: 'microphoneRecorder',
            name: 'Microphone Recorder',
            color1: '#8A2BE2', // A vibrant purple for the blocks
            color2: '#6A1BC2', // A darker purple for block outlines
            blocks: [
                {
                    opcode: 'startRecording',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'start recording audio',
                },
                {
                    opcode: 'stopRecording',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'stop recording audio',
                },
                {
                    opcode: 'getRecordedAudioURI',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'recorded audio dataURI',
                    disableMonitor: true, // Prevents showing a monitor for this potentially very long string
                },
            ],
            // No menus are needed for this simple extension
            menus: {},
        };
    }

    audioBufferToWav(audioBuffer) {
        const numOfChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const format = 1; // PCM
        const bitDepth = 16;

        let result;
        if (numOfChannels === 2) {
            result = this.interleave(audioBuffer.getChannelData(0), audioBuffer.getChannelData(1));
        } else {
            result = audioBuffer.getChannelData(0);
        }

        const buffer = new ArrayBuffer(44 + result.length * 2);
        const view = new DataView(buffer);

        // Write WAV header
        this.writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + result.length * 2, true);
        this.writeString(view, 8, 'WAVE');
        this.writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, format, true);
        view.setUint16(22, numOfChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numOfChannels * bitDepth / 8, true);
        view.setUint16(32, numOfChannels * bitDepth / 8, true);
        view.setUint16(34, bitDepth, true);
        this.writeString(view, 36, 'data');
        view.setUint32(40, result.length * 2, true);

        // Write PCM samples
        this.floatTo16BitPCM(view, 44, result);

        return new Blob([view], { type: 'audio/wav' });
    }

    writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    floatTo16BitPCM(view, offset, input) {
        for (let i = 0; i < input.length; i++, offset += 2) {
            const s = Math.max(-1, Math.min(1, input[i]));
            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
    }

    interleave(leftChannel, rightChannel) {
        const length = leftChannel.length + rightChannel.length;
        const result = new Float32Array(length);

        let inputIndex = 0;
        for (let index = 0; index < length;) {
            result[index++] = leftChannel[inputIndex];
            result[index++] = rightChannel[inputIndex];
            inputIndex++;
        }
        return result;
    }

    async startRecording() {
        if (this.isRecording) {
            console.warn("Microphone Recorder: Already recording. Please stop the current recording first.");
            return;
        }

        try {
            // Request access to the user's microphone.
            // The user will see a browser permission prompt.
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = []; // Clear previous audio chunks
            this.recordedAudioDataURI = ''; // Clear previous Data URI

            // Event handler for when audio data is available
            this.mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            // This promise will resolve when the 'onstop' event finishes
            // processing the audio data into a Data URI.
            this.dataURIGenerationPromise = new Promise((resolve, reject) => {
                this.mediaRecorder.onstop = async () => {
                    if (this.audioChunks.length === 0) {
                        console.warn("Microphone Recorder: No audio data was recorded during this session.");
                        this.recordedAudioDataURI = '';
                        resolve(''); // Resolve with an empty string if no data
                        // Ensure microphone stream tracks are stopped
                        stream.getTracks().forEach(track => track.stop());
                        return;
                    }

                    try {
                        // Combine all recorded chunks into a single Blob
                        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });

                        // Decode the audio to get an AudioBuffer
                        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        const arrayBuffer = await audioBlob.arrayBuffer();
                        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

                        // Convert AudioBuffer to WAV
                        const wavBlob = this.audioBufferToWav(audioBuffer);

                        // Use FileReader to convert the WAV Blob into a Data URL
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            this.recordedAudioDataURI = reader.result;
                            resolve(reader.result); // Resolve the promise with the Data URI
                        };
                        reader.onerror = error => {
                            console.error("Microphone Recorder: Error reading audio Blob into Data URI:", error);
                            reject(error); // Reject the promise on FileReader error
                        };
                        reader.readAsDataURL(wavBlob); // Start reading the WAV Blob
                    } catch (error) {
                        console.error("Microphone Recorder: Error converting audio to WAV:", error);
                        reject(error);
                    } finally {
                        // After recording stops, release the microphone by stopping its tracks
                        stream.getTracks().forEach(track => track.stop());
                    }
                };
            });

            this.mediaRecorder.start();
            this.isRecording = true;
            console.log("Microphone Recorder: Recording started.");
        } catch (err) {
            console.error('Microphone Recorder: Error accessing microphone:', err);
            // Provide a user-friendly alert for common errors
            if (err.name === 'NotAllowedError') {
                alert('Microphone Recorder: Access to the microphone was denied. Please grant permission in your browser settings.');
            } else if (err.name === 'NotFoundError' || err.name === 'NotReadableError') {
                alert('Microphone Recorder: No microphone found or it is currently in use by another application. Please check your device.');
            } else {
                alert(`Microphone Recorder: Could not start recording. Error: ${err.message}`);
            }
            this.isRecording = false; 
            this.dataURIGenerationPromise = Promise.resolve(''); 
        }
    }

    async stopRecording() {
        if (!this.isRecording || !this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
            console.warn("Microphone Recorder: No active recording to stop.");
            if (this.dataURIGenerationPromise) {
                this.dataURIGenerationPromise = null; 
            }
            return;
        }

        this.isRecording = false;
        this.mediaRecorder.stop();
        console.log("Microphone Recorder: Recording stopped. Processing audio data into Data URI...");


        try {
            await this.dataURIGenerationPromise;
            console.log("Microphone Recorder: Audio processing complete. Data URI is ready.");
        } catch (error) {
            console.error("Microphone Recorder: Error during audio processing after stop:", error);
            alert('Microphone Recorder: An error occurred while processing the recorded audio.');
        } finally {
            this.dataURIGenerationPromise = null;
        }
    }

    getRecordedAudioURI() {
        return this.recordedAudioDataURI;
    }
}

(function() {
    if (typeof Scratch === 'undefined') {
        console.error("Scratch object not found. This extension must be loaded within a Scratch-compatible environment (e.g., Turbowarp, Penguinmod).");
    } else {
        Scratch.extensions.register(new MicrophoneRecorderExtension());
    }
})();