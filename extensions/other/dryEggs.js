(function (Scratch) {
	"use strict";
	
	const BlockType = Scratch.BlockType;
    const ArgumentType = Scratch.ArgumentType;
    const Cast = Scratch.Cast;
    const log = Scratch.log;
	const m = Scratch.vm.runtime.extensionManager;
	const STORAGE_PREFIX = 'dry-eggs:';
    
	class DryEggsUtilities {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'dryEggs',
            name: 'Dry Eggs Utilities',
            color1: '#286fe5',
            color2: '#1d63d8',
            color3: '#174fae',
            blocks: [
                {
                    opcode: 'copyText',
                    blockType: BlockType.COMMAND,
                    text: 'copy [TEXT] to clipboard',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello from Dry Eggs'
                        }
                    }
                },
                {
                    opcode: 'readClipboard',
                    blockType: BlockType.REPORTER,
                    text: 'clipboard text',
                    disableMonitor: true
                },
                '---',
                {
                    opcode: 'setStoredValue',
                    blockType: BlockType.COMMAND,
                    text: 'store [VALUE] as [KEY]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'value'
                        },
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'key'
                        }
                    }
                },
                {
                    opcode: 'getStoredValue',
                    blockType: BlockType.REPORTER,
                    text: 'stored value [KEY]',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'key'
                        }
                    }
                },
                {
                    opcode: 'removeStoredValue',
                    blockType: BlockType.COMMAND,
                    text: 'remove stored value [KEY]',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'key'
                        }
                    }
                },
                '---',
                {
                    opcode: 'encodeURLPart',
                    blockType: BlockType.REPORTER,
                    text: 'URL encode [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Dry Eggs!'
                        }
                    }
                },
                {
                    opcode: 'decodeURLPart',
                    blockType: BlockType.REPORTER,
                    text: 'URL decode [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Dry%20Eggs%21'
                        }
                    }
                },
                {
                    opcode: 'pageURL',
                    blockType: BlockType.REPORTER,
                    text: 'page URL',
                    disableMonitor: true
                },
                {
                    opcode: 'isOnline',
                    blockType: BlockType.BOOLEAN,
                    text: 'browser online?'
                },
                {
                    opcode: 'userAgent',
                    blockType: BlockType.REPORTER,
                    text: 'browser user agent',
                    disableMonitor: true
                },
                '---',
                {
                    opcode: 'randomUUID',
                    blockType: BlockType.REPORTER,
                    text: 'random UUID'
                },
                {
                    opcode: 'isoTime',
                    blockType: BlockType.REPORTER,
                    text: 'current ISO time'
                },
                {
                    opcode: 'vibrate',
                    blockType: BlockType.COMMAND,
                    text: 'vibrate for [MILLISECONDS] ms',
                    arguments: {
                        MILLISECONDS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                }
            ]
        };
    }

    _string (value) {
        if (value === null || typeof value === 'undefined') return '';
        return String(value);
    }

    _storageKey (key) {
        return `${STORAGE_PREFIX}${this._string(key)}`;
    }

    async copyText (args) {
        const text = this._string(args.TEXT);
        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return;
            }
            if (typeof document !== 'undefined') {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                textarea.remove();
            }
        } catch (e) {
            // Clipboard permissions are controlled by the browser. A denied write is a no-op.
        }
    }

    async readClipboard () {
        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
                return await navigator.clipboard.readText();
            }
        } catch (e) {
            // Reading the clipboard may require an explicit permission or user gesture.
        }
        return '';
    }

    setStoredValue (args) {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(this._storageKey(args.KEY), this._string(args.VALUE));
            }
        } catch (e) {
            // Storage may be disabled by browser privacy settings.
        }
    }

    getStoredValue (args) {
        try {
            if (typeof localStorage !== 'undefined') {
                return localStorage.getItem(this._storageKey(args.KEY)) || '';
            }
        } catch (e) {
            // Storage may be disabled by browser privacy settings.
        }
        return '';
    }

    removeStoredValue (args) {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(this._storageKey(args.KEY));
            }
        } catch (e) {
            // Storage may be disabled by browser privacy settings.
        }
    }

    encodeURLPart (args) {
        return encodeURIComponent(this._string(args.TEXT));
    }

    decodeURLPart (args) {
        try {
            return decodeURIComponent(this._string(args.TEXT));
        } catch (e) {
            return this._string(args.TEXT);
        }
    }

    pageURL () {
        return typeof location === 'undefined' ? '' : location.href;
    }

    isOnline () {
        return typeof navigator === 'undefined' ? true : navigator.onLine;
    }

    userAgent () {
        return typeof navigator === 'undefined' ? '' : navigator.userAgent;
    }

    randomUUID () {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, character => {
            const random = Math.floor(Math.random() * 16);
            const value = character === 'x' ? random : ((random & 3) | 8);
            return value.toString(16);
        });
    }

    isoTime () {
        return new Date().toISOString();
    }

    vibrate (args) {
        if (typeof navigator === 'undefined' || !navigator.vibrate) return;
        const milliseconds = Math.max(0, Math.min(10000, Number(args.MILLISECONDS) || 0));
        navigator.vibrate(milliseconds);
    }
}
	
	Scratch.extensions.register(new DryEggsUtilities());
  })(Scratch);
  