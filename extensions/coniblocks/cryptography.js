// Name: Cryptography
// ID: cryptography
// Description: UUID's and encryption.
// License: GPLV3

(function(Scratch) {
    'use strict';

    class Cryptography {
        getInfo() {
            return {
                id: 'cryptography',
                name: 'Cryptography',
                color1: '#FF69B4',
                color2: '#FF85C1',
                color3: '#FFB6D9',
                blocks: [
                    {
                        opcode: 'random_uuid',
                        blockType: 'reporter',
                        text: 'generate random uuid'
                    },
                    {
                        opcode: 'caesar_encrypt',
                        blockType: 'reporter',
                        text: 'caesar encrypt [text] by [shift]',
                        arguments: {
                            text: { type: 'string', defaultValue: 'hello' },
                            shift: { type: 'number', defaultValue: 3 }
                        }
                    },
                    {
                        opcode: 'caesar_decrypt',
                        blockType: 'reporter',
                        text: 'caesar decrypt [text] by [shift]',
                        arguments: {
                            text: { type: 'string', defaultValue: 'khoor' },
                            shift: { type: 'number', defaultValue: 3 }
                        }
                    },
                    {
                        opcode: 'base64_encode',
                        blockType: 'reporter',
                        text: 'base64 encode [text]',
                        arguments: {
                            text: { type: 'string', defaultValue: 'hello' }
                        }
                    },
                    {
                        opcode: 'base64_decode',
                        blockType: 'reporter',
                        text: 'base64 decode [text]',
                        arguments: {
                            text: { type: 'string', defaultValue: 'aGVsbG8=' }
                        }
                    },
                    {
                        opcode: 'sha256',
                        blockType: 'reporter',
                        text: 'sha256 hash [text]',
                        arguments: {
                            text: { type: 'string', defaultValue: 'hello' }
                        }
                    },
                    {
                        opcode: 'xor_encrypt',
                        blockType: 'reporter',
                        text: 'xor encrypt [text] with [key]',
                        arguments: {
                            text: { type: 'string', defaultValue: 'hello' },
                            key: { type: 'string', defaultValue: 'key' }
                        }
                    },
                    {
                        opcode: 'xor_decrypt',
                        blockType: 'reporter',
                        text: 'xor decrypt [text] with [key]',
                        arguments: {
                            text: { type: 'string', defaultValue: 'hello' },
                            key: { type: 'string', defaultValue: 'key' }
                        }
                    },
                    {
                        opcode: 'random_integer',
                        blockType: 'reporter',
                        text: 'random integer from [min] to [max]',
                        arguments: {
                            min: { type: 'number', defaultValue: 0 },
                            max: { type: 'number', defaultValue: 100 }
                        }
                    },
                    {
                        opcode: 'random_string',
                        blockType: 'reporter',
                        text: 'random string of length [length]',
                        arguments: {
                            length: { type: 'number', defaultValue: 8 }
                        }
                    }
                ]
            };
        }

        caesar_encrypt({ text, shift }) {
            let result = '';
            for (let i = 0; i < text.length; i++) {
                let c = text.charAt(i);
                let code = c.charCodeAt(0);

                if (c.match(/[a-z]/)) {
                    result += String.fromCharCode(((code - 97 + shift) % 26) + 97);
                } else if (c.match(/[A-Z]/)) {
                    result += String.fromCharCode(((code - 65 + shift) % 26) + 65);
                } else {
                    result += c;
                }
            }
            return result;
        }

        caesar_decrypt({ text, shift }) {
            let result = '';
            for (let i = 0; i < text.length; i++) {
                let c = text.charAt(i);
                let code = c.charCodeAt(0);

                if (c.match(/[a-z]/)) {
                    result += String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
                } else if (c.match(/[A-Z]/)) {
                    result += String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
                } else {
                    result += c;
                }
            }
            return result;
        }

        base64_encode({ text }) {
            return btoa(text);
        }

        base64_decode({ text }) {
            return atob(text);
        }

        async sha256({ text }) {
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            let hashHex = '';
            for (let i = 0; i < hashArray.length; i++) {
                hashHex += hashArray[i].toString(16).padStart(2, '0');
            }
            return hashHex;
        }

        random_uuid() {
            if (crypto.randomUUID) {
                return crypto.randomUUID();
            } else {
                const s4 = () => {
                    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                };
                return (
                    s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
                );
            }
        }

        xor_encrypt({ text, key }) {
            let result = '';
            for (let i = 0; i < text.length; i++) {
                result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            return result;
        }

        xor_decrypt({ text, key }) {
            return this.xor_encrypt({ text, key });
        }

        random_integer({ min, max }) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        random_string({ length }) {
            const chars =
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }
    }

    Scratch.extensions.register(new Cryptography());
})(Scratch);
