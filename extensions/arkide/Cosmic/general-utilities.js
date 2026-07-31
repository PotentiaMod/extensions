(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed');
  }

  class UltimateUtilities {
    constructor() {
      this.clipboardText = '';
      this.batteryLevel = 0;
      this.batteryCharging = false;
      this.frameCount = 0;
      this.lastFrameTime = performance.now();
      this.fps = 60;
      this.initializeBattery();
      this.startFPSCounter();
    }

    async initializeBattery() {
      if ('getBattery' in navigator) {
        try {
          const battery = await navigator.getBattery();
          this.batteryLevel = Math.round(battery.level * 100);
          this.batteryCharging = battery.charging;
          
          battery.addEventListener('levelchange', () => {
            this.batteryLevel = Math.round(battery.level * 100);
          });
          
          battery.addEventListener('chargingchange', () => {
            this.batteryCharging = battery.charging;
          });
        } catch (e) {
          console.warn('Battery API not available');
        }
      }
    }

    startFPSCounter() {
      const measureFPS = () => {
        this.frameCount++;
        const now = performance.now();
        const delta = now - this.lastFrameTime;
        
        if (delta >= 1000) {
          this.fps = Math.round((this.frameCount * 1000) / delta);
          this.frameCount = 0;
          this.lastFrameTime = now;
        }
        
        requestAnimationFrame(measureFPS);
      };
      measureFPS();
    }

    getInfo() {
      return {
        id: 'ultimateutilities',
        name: 'Ultimate Utilities',
        color1: '#4a90e2',
        color2: '#357abd',
        color3: '#2868a8',
        blocks: [
          {
            blockType: Scratch.BlockType.LABEL,
            text: '🖥️ System Info'
          },
          {
            opcode: 'getOS',
            blockType: Scratch.BlockType.REPORTER,
            text: 'operating system'
          },
          {
            opcode: 'getBrowser',
            blockType: Scratch.BlockType.REPORTER,
            text: 'browser'
          },
          {
            opcode: 'getScreenWidth',
            blockType: Scratch.BlockType.REPORTER,
            text: 'screen width'
          },
          {
            opcode: 'getScreenHeight',
            blockType: Scratch.BlockType.REPORTER,
            text: 'screen height'
          },
          {
            opcode: 'getCPUCores',
            blockType: Scratch.BlockType.REPORTER,
            text: 'CPU cores'
          },
          {
            opcode: 'getLanguage',
            blockType: Scratch.BlockType.REPORTER,
            text: 'system language'
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: '🔋 Battery & Network'
          },
          {
            opcode: 'getBatteryLevel',
            blockType: Scratch.BlockType.REPORTER,
            text: 'battery level %'
          },
          {
            opcode: 'isCharging',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'charging?'
          },
          {
            opcode: 'isOnline',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'online?'
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: '📋 Clipboard'
          },
          {
            opcode: 'copyToClipboard',
            blockType: Scratch.BlockType.COMMAND,
            text: 'copy [TEXT] to clipboard',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello!'
              }
            }
          },
          {
            opcode: 'pasteFromClipboard',
            blockType: Scratch.BlockType.REPORTER,
            text: 'paste from clipboard'
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: '⏰ Time & Date'
          },
          {
            opcode: 'getCurrentTime',
            blockType: Scratch.BlockType.REPORTER,
            text: 'current time'
          },
          {
            opcode: 'getCurrentDate',
            blockType: Scratch.BlockType.REPORTER,
            text: 'current date'
          },
          {
            opcode: 'getTimestamp',
            blockType: Scratch.BlockType.REPORTER,
            text: 'unix timestamp'
          },
          {
            opcode: 'getDayOfWeek',
            blockType: Scratch.BlockType.REPORTER,
            text: 'day of week'
          },
          {
            opcode: 'getYear',
            blockType: Scratch.BlockType.REPORTER,
            text: 'year'
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: '📝 Text Utilities'
          },
          {
            opcode: 'reverseText',
            blockType: Scratch.BlockType.REPORTER,
            text: 'reverse [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello'
              }
            }
          },
          {
            opcode: 'toUpperCase',
            blockType: Scratch.BlockType.REPORTER,
            text: '[TEXT] to uppercase',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello'
              }
            }
          },
          {
            opcode: 'toLowerCase',
            blockType: Scratch.BlockType.REPORTER,
            text: '[TEXT] to lowercase',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'HELLO'
              }
            }
          },
          {
            opcode: 'countWords',
            blockType: Scratch.BlockType.REPORTER,
            text: 'count words in [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello world'
              }
            }
          },
          {
            opcode: 'replaceText',
            blockType: Scratch.BlockType.REPORTER,
            text: 'replace [FIND] with [REPLACE] in [TEXT]',
            arguments: {
              FIND: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              },
              REPLACE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'dog'
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'I have a cat'
              }
            }
          },
          {
            opcode: 'repeatText',
            blockType: Scratch.BlockType.REPORTER,
            text: 'repeat [TEXT] [TIMES] times',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'ha'
              },
              TIMES: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              }
            }
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: '🔢 Math Utilities'
          },
          {
            opcode: 'clamp',
            blockType: Scratch.BlockType.REPORTER,
            text: 'clamp [NUM] between [MIN] and [MAX]',
            arguments: {
              NUM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 5
              },
              MIN: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              MAX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              }
            }
          },
          {
            opcode: 'mapRange',
            blockType: Scratch.BlockType.REPORTER,
            text: 'map [NUM] from [MIN1]-[MAX1] to [MIN2]-[MAX2]',
            arguments: {
              NUM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 5
              },
              MIN1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              MAX1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              },
              MIN2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              MAX2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              }
            }
          },
          {
            opcode: 'randomFloat',
            blockType: Scratch.BlockType.REPORTER,
            text: 'random decimal from [MIN] to [MAX]',
            arguments: {
              MIN: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              MAX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'isPrime',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[NUM] is prime?',
            arguments: {
              NUM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 7
              }
            }
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: '🎨 Color Utilities'
          },
          {
            opcode: 'rgbToHex',
            blockType: Scratch.BlockType.REPORTER,
            text: 'RGB [R] [G] [B] to hex',
            arguments: {
              R: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 255
              },
              G: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              B: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'randomColor',
            blockType: Scratch.BlockType.REPORTER,
            text: 'random hex color'
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: '🌐 URL & Encoding'
          },
          {
            opcode: 'getCurrentURL',
            blockType: Scratch.BlockType.REPORTER,
            text: 'current URL'
          },
          {
            opcode: 'encodeURL',
            blockType: Scratch.BlockType.REPORTER,
            text: 'URL encode [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello world'
              }
            }
          },
          {
            opcode: 'decodeURL',
            blockType: Scratch.BlockType.REPORTER,
            text: 'URL decode [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello%20world'
              }
            }
          },
          {
            opcode: 'toBase64',
            blockType: Scratch.BlockType.REPORTER,
            text: 'encode [TEXT] to base64',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello'
              }
            }
          },
          {
            opcode: 'fromBase64',
            blockType: Scratch.BlockType.REPORTER,
            text: 'decode [TEXT] from base64',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'aGVsbG8='
              }
            }
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: '⚡ Performance'
          },
          {
            opcode: 'getFPS',
            blockType: Scratch.BlockType.REPORTER,
            text: 'current FPS'
          },
          {
            opcode: 'getMemoryUsage',
            blockType: Scratch.BlockType.REPORTER,
            text: 'memory usage (MB)'
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: '📱 Device'
          },
          {
            opcode: 'isTouchDevice',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is touch device?'
          },
          {
            opcode: 'vibrate',
            blockType: Scratch.BlockType.COMMAND,
            text: 'vibrate for [MS] ms',
            arguments: {
              MS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 200
              }
            }
          },
          {
            opcode: 'openURL',
            blockType: Scratch.BlockType.COMMAND,
            text: 'open [URL] in new tab',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://scratch.mit.edu'
              }
            }
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: '🎲 Random & Arrays'
          },
          {
            opcode: 'shuffleText',
            blockType: Scratch.BlockType.REPORTER,
            text: 'shuffle letters in [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello'
              }
            }
          },
          {
            opcode: 'randomChoice',
            blockType: Scratch.BlockType.REPORTER,
            text: 'pick random from [LIST]',
            arguments: {
              LIST: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'apple,banana,orange'
              }
            }
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: '🔧 Misc'
          },
          {
            opcode: 'wait',
            blockType: Scratch.BlockType.COMMAND,
            text: 'wait [MS] milliseconds',
            arguments: {
              MS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1000
              }
            }
          },
          {
            opcode: 'consoleLog',
            blockType: Scratch.BlockType.COMMAND,
            text: 'log [TEXT] to console',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello Console!'
              }
            }
          },
          {
            opcode: 'alert',
            blockType: Scratch.BlockType.COMMAND,
            text: 'alert [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello!'
              }
            }
          },
          {
            opcode: 'confirm',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'confirm [TEXT]?',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Are you sure?'
              }
            }
          }
        ]
      };
    }

    // System Info
    getOS() {
      const ua = navigator.userAgent;
      if (ua.indexOf('Win') !== -1) return 'Windows';
      if (ua.indexOf('Mac') !== -1) return 'MacOS';
      if (ua.indexOf('Linux') !== -1) return 'Linux';
      if (ua.indexOf('Android') !== -1) return 'Android';
      if (ua.indexOf('iOS') !== -1 || ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) return 'iOS';
      return 'Unknown';
    }

    getBrowser() {
      const ua = navigator.userAgent;
      if (ua.indexOf('Firefox') !== -1) return 'Firefox';
      if (ua.indexOf('Edg') !== -1) return 'Edge';
      if (ua.indexOf('Chrome') !== -1) return 'Chrome';
      if (ua.indexOf('Safari') !== -1) return 'Safari';
      if (ua.indexOf('Opera') !== -1 || ua.indexOf('OPR') !== -1) return 'Opera';
      return 'Unknown';
    }

    getScreenWidth() {
      return screen.width;
    }

    getScreenHeight() {
      return screen.height;
    }

    getCPUCores() {
      return navigator.hardwareConcurrency || 'Unknown';
    }

    getLanguage() {
      return navigator.language || 'Unknown';
    }

    // Battery & Network
    getBatteryLevel() {
      return this.batteryLevel;
    }

    isCharging() {
      return this.batteryCharging;
    }

    isOnline() {
      return navigator.onLine;
    }

    // Clipboard
    async copyToClipboard(args) {
      try {
        await navigator.clipboard.writeText(args.TEXT);
        this.clipboardText = args.TEXT;
      } catch (e) {
        this.clipboardText = args.TEXT;
        console.warn('Clipboard write failed, stored internally');
      }
    }

    async pasteFromClipboard() {
      try {
        const text = await navigator.clipboard.readText();
        return text;
      } catch (e) {
        return this.clipboardText;
      }
    }

    // Time & Date
    getCurrentTime() {
      const now = new Date();
      return now.toLocaleTimeString();
    }

    getCurrentDate() {
      const now = new Date();
      return now.toLocaleDateString();
    }

    getTimestamp() {
      return Date.now();
    }

    getDayOfWeek() {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[new Date().getDay()];
    }

    getYear() {
      return new Date().getFullYear();
    }

    // Text Utilities
    reverseText(args) {
      return String(args.TEXT).split('').reverse().join('');
    }

    toUpperCase(args) {
      return String(args.TEXT).toUpperCase();
    }

    toLowerCase(args) {
      return String(args.TEXT).toLowerCase();
    }

    countWords(args) {
      return String(args.TEXT).trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    replaceText(args) {
      return String(args.TEXT).replace(new RegExp(args.FIND, 'g'), args.REPLACE);
    }

    repeatText(args) {
      return String(args.TEXT).repeat(Math.max(0, Math.floor(args.TIMES)));
    }

    // Math Utilities
    clamp(args) {
      const num = Number(args.NUM);
      const min = Number(args.MIN);
      const max = Number(args.MAX);
      return Math.min(Math.max(num, min), max);
    }

    mapRange(args) {
      const num = Number(args.NUM);
      const inMin = Number(args.MIN1);
      const inMax = Number(args.MAX1);
      const outMin = Number(args.MIN2);
      const outMax = Number(args.MAX2);
      return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    randomFloat(args) {
      const min = Number(args.MIN);
      const max = Number(args.MAX);
      return Math.random() * (max - min) + min;
    }

    isPrime(args) {
      const num = Math.floor(Number(args.NUM));
      if (num < 2) return false;
      if (num === 2) return true;
      if (num % 2 === 0) return false;
      for (let i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) return false;
      }
      return true;
    }

    // Color Utilities
    rgbToHex(args) {
      const r = Math.max(0, Math.min(255, Math.floor(Number(args.R))));
      const g = Math.max(0, Math.min(255, Math.floor(Number(args.G))));
      const b = Math.max(0, Math.min(255, Math.floor(Number(args.B))));
      return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    }

    randomColor() {
      return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    // URL & Encoding
    getCurrentURL() {
      return window.location.href;
    }

    encodeURL(args) {
      return encodeURIComponent(String(args.TEXT));
    }

    decodeURL(args) {
      try {
        return decodeURIComponent(String(args.TEXT));
      } catch (e) {
        return args.TEXT;
      }
    }

    toBase64(args) {
      try {
        return btoa(String(args.TEXT));
      } catch (e) {
        return '';
      }
    }

    fromBase64(args) {
      try {
        return atob(String(args.TEXT));
      } catch (e) {
        return '';
      }
    }

    // Performance
    getFPS() {
      return this.fps;
    }

    getMemoryUsage() {
      if (performance.memory) {
        return Math.round(performance.memory.usedJSHeapSize / 1048576);
      }
      return 'Unknown';
    }

    // Device
    isTouchDevice() {
      return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    }

    vibrate(args) {
      if (navigator.vibrate) {
        navigator.vibrate(Math.floor(Number(args.MS)));
      }
    }

    openURL(args) {
      window.open(String(args.URL), '_blank');
    }

    // Random & Arrays
    shuffleText(args) {
      const arr = String(args.TEXT).split('');
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.join('');
    }

    randomChoice(args) {
      const items = String(args.LIST).split(',').map(item => item.trim());
      if (items.length === 0) return '';
      return items[Math.floor(Math.random() * items.length)];
    }

    // Misc
    wait(args) {
      return new Promise(resolve => {
        setTimeout(resolve, Math.max(0, Number(args.MS)));
      });
    }

    consoleLog(args) {
      console.log(String(args.TEXT));
    }

    alert(args) {
      alert(String(args.TEXT));
    }

    confirm(args) {
      return confirm(String(args.TEXT));
    }
  }

  Scratch.extensions.register(new UltimateUtilities());
})(Scratch);