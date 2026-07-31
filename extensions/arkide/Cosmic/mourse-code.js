(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed');
  }

  // Morse code dictionary
  const MORSE_CODE = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
    "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
    '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
    '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
    ' ': '/'
  };

  // Reverse morse code dictionary
  const REVERSE_MORSE = {};
  for (const [char, code] of Object.entries(MORSE_CODE)) {
    REVERSE_MORSE[code] = char;
  }

  class MorseCodeExtension {
    constructor() {
      this.audioContext = null;
      this.dotDuration = 100; // milliseconds
      this.frequency = 600; // Hz
      this.volume = 0.3;
      this.waveType = 'sine';
      this.currentMorseCode = '';
      this.isPlaying = false;
      this.audioData = null;
    }

    getInfo() {
      return {
        id: 'morseCode',
        name: 'Morse Code',
        color1: '#4a90e2',
        color2: '#357abd',
        color3: '#2868a8',
        blocks: [
          {
            opcode: 'textToMorse',
            blockType: Scratch.BlockType.REPORTER,
            text: 'convert [TEXT] to morse code',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'HELLO'
              }
            }
          },
          {
            opcode: 'morseToText',
            blockType: Scratch.BlockType.REPORTER,
            text: 'convert morse [MORSE] to text',
            arguments: {
              MORSE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '.... . .-.. .-.. ---'
              }
            }
          },
          {
            opcode: 'playMorse',
            blockType: Scratch.BlockType.COMMAND,
            text: 'play morse code [MORSE]',
            arguments: {
              MORSE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '.... . .-.. .-.. ---'
              }
            }
          },
          {
            opcode: 'playText',
            blockType: Scratch.BlockType.COMMAND,
            text: 'play text as morse [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'HELLO'
              }
            }
          },
          {
            opcode: 'stopPlaying',
            blockType: Scratch.BlockType.COMMAND,
            text: 'stop morse code'
          },
          '---',
          {
            opcode: 'setSpeed',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set morse speed to [SPEED] WPM',
            arguments: {
              SPEED: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 20
              }
            }
          },
          {
            opcode: 'setDotDuration',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set dot duration to [MS] ms',
            arguments: {
              MS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              }
            }
          },
          {
            opcode: 'setFrequency',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set beep frequency to [FREQ] Hz',
            arguments: {
              FREQ: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 600
              }
            }
          },
          {
            opcode: 'setVolume',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set volume to [VOLUME]%',
            arguments: {
              VOLUME: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 30
              }
            }
          },
          {
            opcode: 'setWaveType',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set wave type to [TYPE]',
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'waveTypes'
              }
            }
          },
          '---',
          {
            opcode: 'getSpeed',
            blockType: Scratch.BlockType.REPORTER,
            text: 'morse speed (WPM)'
          },
          {
            opcode: 'getDotDuration',
            blockType: Scratch.BlockType.REPORTER,
            text: 'dot duration (ms)'
          },
          {
            opcode: 'getFrequency',
            blockType: Scratch.BlockType.REPORTER,
            text: 'frequency (Hz)'
          },
          {
            opcode: 'getVolume',
            blockType: Scratch.BlockType.REPORTER,
            text: 'volume (%)'
          },
          {
            opcode: 'isPlaying',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is playing morse?'
          },
          '---',
          {
            opcode: 'exportMorseAsDataURI',
            blockType: Scratch.BlockType.REPORTER,
            text: 'export [TEXT] as morse audio data URI',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'HELLO'
              }
            }
          },
          {
            opcode: 'getMorseDuration',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get duration of morse [MORSE] in seconds',
            arguments: {
              MORSE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '.... . .-.. .-.. ---'
              }
            }
          },
          {
            opcode: 'validateMorse',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is [MORSE] valid morse code?',
            arguments: {
              MORSE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '.... . .-.. .-.. ---'
              }
            }
          },
          {
            opcode: 'getCharacterMorse',
            blockType: Scratch.BlockType.REPORTER,
            text: 'morse code for character [CHAR]',
            arguments: {
              CHAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'A'
              }
            }
          }
        ],
        menus: {
          waveTypes: {
            acceptReporters: true,
            items: ['sine', 'square', 'sawtooth', 'triangle']
          }
        }
      };
    }

    initAudioContext() {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      return this.audioContext;
    }

    textToMorse(args) {
      const text = String(args.TEXT).toUpperCase();
      let morse = '';
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (MORSE_CODE[char]) {
          morse += MORSE_CODE[char];
          if (i < text.length - 1 && text[i + 1] !== ' ') {
            morse += ' ';
          }
        } else if (char === ' ') {
          morse += ' / ';
        }
      }
      this.currentMorseCode = morse.trim();
      return this.currentMorseCode;
    }

    morseToText(args) {
      const morse = String(args.MORSE);
      const words = morse.split(' / ');
      let text = '';
      
      for (let i = 0; i < words.length; i++) {
        const letters = words[i].split(' ');
        for (const letter of letters) {
          if (letter && REVERSE_MORSE[letter]) {
            text += REVERSE_MORSE[letter];
          }
        }
        if (i < words.length - 1) {
          text += ' ';
        }
      }
      
      return text;
    }

    async playMorse(args) {
      const morse = String(args.MORSE);
      await this.playMorseCode(morse);
    }

    async playText(args) {
      const text = String(args.TEXT);
      const morse = this.textToMorse({ TEXT: text });
      await this.playMorseCode(morse);
    }

    async playMorseCode(morse) {
      const ctx = this.initAudioContext();
      this.isPlaying = true;
      
      let currentTime = ctx.currentTime;
      
      for (const char of morse) {
        if (!this.isPlaying) break;
        
        if (char === '.') {
          this.playBeep(ctx, currentTime, this.dotDuration);
          currentTime += this.dotDuration / 1000;
        } else if (char === '-') {
          this.playBeep(ctx, currentTime, this.dotDuration * 3);
          currentTime += (this.dotDuration * 3) / 1000;
        } else if (char === ' ') {
          currentTime += this.dotDuration / 1000;
        } else if (char === '/') {
          currentTime += (this.dotDuration * 4) / 1000;
        }
        
        // Space between dots/dashes
        currentTime += this.dotDuration / 1000;
      }
      
      // Wait for audio to finish
      const totalDuration = (currentTime - ctx.currentTime) * 1000;
      await new Promise(resolve => setTimeout(resolve, totalDuration));
      this.isPlaying = false;
    }

    playBeep(ctx, startTime, duration) {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = this.waveType;
      oscillator.frequency.value = this.frequency;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(this.volume, startTime + 0.005);
      gainNode.gain.setValueAtTime(this.volume, startTime + (duration / 1000) - 0.005);
      gainNode.gain.linearRampToValueAtTime(0, startTime + (duration / 1000));
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + (duration / 1000));
    }

    stopPlaying() {
      this.isPlaying = false;
      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }
    }

    setSpeed(args) {
      // WPM to dot duration: PARIS standard = 50 dot durations per word
      const wpm = Math.max(1, Number(args.SPEED));
      this.dotDuration = 1200 / wpm;
    }

    setDotDuration(args) {
      this.dotDuration = Math.max(10, Number(args.MS));
    }

    setFrequency(args) {
      this.frequency = Math.max(20, Math.min(20000, Number(args.FREQ)));
    }

    setVolume(args) {
      this.volume = Math.max(0, Math.min(100, Number(args.VOLUME))) / 100;
    }

    setWaveType(args) {
      this.waveType = args.TYPE;
    }

    getSpeed() {
      return Math.round(1200 / this.dotDuration);
    }

    getDotDuration() {
      return this.dotDuration;
    }

    getFrequency() {
      return this.frequency;
    }

    getVolume() {
      return Math.round(this.volume * 100);
    }

    isPlaying() {
      return this.isPlaying;
    }

    exportMorseAsDataURI(args) {
      const text = String(args.TEXT);
      const morse = this.textToMorse({ TEXT: text });
      
      // Calculate total duration
      let duration = 0;
      for (const char of morse) {
        if (char === '.') duration += this.dotDuration + this.dotDuration;
        else if (char === '-') duration += this.dotDuration * 3 + this.dotDuration;
        else if (char === ' ') duration += this.dotDuration;
        else if (char === '/') duration += this.dotDuration * 4;
      }
      
      // Create offline audio context
      const sampleRate = 44100;
      const offlineCtx = new OfflineAudioContext(1, Math.ceil(duration * sampleRate / 1000), sampleRate);
      
      let currentTime = 0;
      for (const char of morse) {
        if (char === '.') {
          this.createOfflineBeep(offlineCtx, currentTime / 1000, this.dotDuration);
          currentTime += this.dotDuration + this.dotDuration;
        } else if (char === '-') {
          this.createOfflineBeep(offlineCtx, currentTime / 1000, this.dotDuration * 3);
          currentTime += this.dotDuration * 3 + this.dotDuration;
        } else if (char === ' ') {
          currentTime += this.dotDuration;
        } else if (char === '/') {
          currentTime += this.dotDuration * 4;
        }
      }
      
      // Render and convert to data URI
      return offlineCtx.startRendering().then(audioBuffer => {
        const wav = this.audioBufferToWav(audioBuffer);
        const blob = new Blob([wav], { type: 'audio/wav' });
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      });
    }

    createOfflineBeep(ctx, startTime, duration) {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = this.waveType;
      oscillator.frequency.value = this.frequency;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(this.volume, startTime + 0.005);
      gainNode.gain.setValueAtTime(this.volume, startTime + (duration / 1000) - 0.005);
      gainNode.gain.linearRampToValueAtTime(0, startTime + (duration / 1000));
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + (duration / 1000));
    }

    audioBufferToWav(buffer) {
      const length = buffer.length * buffer.numberOfChannels * 2;
      const arrayBuffer = new ArrayBuffer(44 + length);
      const view = new DataView(arrayBuffer);
      const channels = [];
      let offset = 0;
      let pos = 0;

      // Write WAV header
      const setUint16 = (data) => {
        view.setUint16(pos, data, true);
        pos += 2;
      };
      const setUint32 = (data) => {
        view.setUint32(pos, data, true);
        pos += 4;
      };

      setUint32(0x46464952); // "RIFF"
      setUint32(36 + length); // file length - 8
      setUint32(0x45564157); // "WAVE"
      setUint32(0x20746d66); // "fmt " chunk
      setUint32(16); // length = 16
      setUint16(1); // PCM (uncompressed)
      setUint16(buffer.numberOfChannels);
      setUint32(buffer.sampleRate);
      setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels); // avg. bytes/sec
      setUint16(buffer.numberOfChannels * 2); // block-align
      setUint16(16); // 16-bit
      setUint32(0x61746164); // "data" - chunk
      setUint32(length); // chunk length

      // Write audio data
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        channels.push(buffer.getChannelData(i));
      }

      while (pos < arrayBuffer.byteLength) {
        for (let i = 0; i < buffer.numberOfChannels; i++) {
          let sample = Math.max(-1, Math.min(1, channels[i][offset]));
          sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
          view.setInt16(pos, sample, true);
          pos += 2;
        }
        offset++;
      }

      return arrayBuffer;
    }

    getMorseDuration(args) {
      const morse = String(args.MORSE);
      let duration = 0;
      
      for (const char of morse) {
        if (char === '.') duration += this.dotDuration + this.dotDuration;
        else if (char === '-') duration += this.dotDuration * 3 + this.dotDuration;
        else if (char === ' ') duration += this.dotDuration;
        else if (char === '/') duration += this.dotDuration * 4;
      }
      
      return (duration / 1000).toFixed(2);
    }

    validateMorse(args) {
      const morse = String(args.MORSE);
      const validChars = /^[.\-\s\/]+$/;
      return validChars.test(morse);
    }

    getCharacterMorse(args) {
      const char = String(args.CHAR).toUpperCase()[0];
      return MORSE_CODE[char] || '';
    }
  }

  Scratch.extensions.register(new MorseCodeExtension());
})(Scratch);