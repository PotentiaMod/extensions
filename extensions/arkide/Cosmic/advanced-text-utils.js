(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed');
  }

  class AdvancedTextExtension {
    constructor() {
      this.lastMatch = '';
      this.lastMatches = [];
    }

    getInfo() {
      return {
        id: 'advancedText',
        name: 'Advanced Text',
        color1: '#9966ff',
        color2: '#855cd6',
        color3: '#774ebd',
        blocks: [
          {
            blockType: Scratch.BlockType.LABEL,
            text: '📝 String Operations'
          },
          {
            opcode: 'reverse',
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
            opcode: 'replaceAll',
            blockType: Scratch.BlockType.REPORTER,
            text: 'replace all [FIND] with [REPLACE] in [TEXT]',
            arguments: {
              FIND: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'old'
              },
              REPLACE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'new'
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'old text old'
              }
            }
          },
          {
            opcode: 'substring',
            blockType: Scratch.BlockType.REPORTER,
            text: 'substring of [TEXT] from [START] to [END]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello world'
              },
              START: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              END: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 5
              }
            }
          },
          {
            opcode: 'repeat',
            blockType: Scratch.BlockType.REPORTER,
            text: 'repeat [TEXT] [TIMES] times',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'abc'
              },
              TIMES: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              }
            }
          },
          {
            opcode: 'padStart',
            blockType: Scratch.BlockType.REPORTER,
            text: 'pad [TEXT] to length [LENGTH] with [CHAR] at start',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '5'
              },
              LENGTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              },
              CHAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0'
              }
            }
          },
          {
            opcode: 'padEnd',
            blockType: Scratch.BlockType.REPORTER,
            text: 'pad [TEXT] to length [LENGTH] with [CHAR] at end',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'test'
              },
              LENGTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 8
              },
              CHAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '.'
              }
            }
          },
          {
            opcode: 'trim',
            blockType: Scratch.BlockType.REPORTER,
            text: 'trim [MODE] from [TEXT]',
            arguments: {
              MODE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'trimModes'
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '  hello  '
              }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: '🔤 Case & Format'
          },
          {
            opcode: 'changeCase',
            blockType: Scratch.BlockType.REPORTER,
            text: 'convert [TEXT] to [CASE]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello World'
              },
              CASE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'caseTypes'
              }
            }
          },
          {
            opcode: 'titleCase',
            blockType: Scratch.BlockType.REPORTER,
            text: 'title case [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'the quick brown fox'
              }
            }
          },
          {
            opcode: 'camelCase',
            blockType: Scratch.BlockType.REPORTER,
            text: 'camel case [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello world'
              }
            }
          },
          {
            opcode: 'snakeCase',
            blockType: Scratch.BlockType.REPORTER,
            text: 'snake case [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello world'
              }
            }
          },
          {
            opcode: 'kebabCase',
            blockType: Scratch.BlockType.REPORTER,
            text: 'kebab case [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello world'
              }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: '🔍 Search & Match'
          },
          {
            opcode: 'contains',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[TEXT] contains [SEARCH]?',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello world'
              },
              SEARCH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'world'
              }
            }
          },
          {
            opcode: 'startsWith',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[TEXT] starts with [SEARCH]?',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello world'
              },
              SEARCH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello'
              }
            }
          },
          {
            opcode: 'endsWith',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[TEXT] ends with [SEARCH]?',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello world'
              },
              SEARCH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'world'
              }
            }
          },
          {
            opcode: 'indexOf',
            blockType: Scratch.BlockType.REPORTER,
            text: 'index of [SEARCH] in [TEXT]',
            arguments: {
              SEARCH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'world'
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello world'
              }
            }
          },
          {
            opcode: 'lastIndexOf',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last index of [SEARCH] in [TEXT]',
            arguments: {
              SEARCH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'l'
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello world'
              }
            }
          },
          {
            opcode: 'countOccurrences',
            blockType: Scratch.BlockType.REPORTER,
            text: 'count [SEARCH] in [TEXT]',
            arguments: {
              SEARCH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'l'
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello world'
              }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: '✂️ Split & Join'
          },
          {
            opcode: 'split',
            blockType: Scratch.BlockType.REPORTER,
            text: 'split [TEXT] by [DELIMITER]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'apple,banana,orange'
              },
              DELIMITER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ','
              }
            }
          },
          {
            opcode: 'getLine',
            blockType: Scratch.BlockType.REPORTER,
            text: 'line [LINE] of [TEXT]',
            arguments: {
              LINE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'line 1\nline 2\nline 3'
              }
            }
          },
          {
            opcode: 'lineCount',
            blockType: Scratch.BlockType.REPORTER,
            text: 'number of lines in [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'line 1\nline 2\nline 3'
              }
            }
          },
          {
            opcode: 'wordCount',
            blockType: Scratch.BlockType.REPORTER,
            text: 'number of words in [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'The quick brown fox'
              }
            }
          },
          {
            opcode: 'charCount',
            blockType: Scratch.BlockType.REPORTER,
            text: 'number of characters in [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello'
              }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: '🎯 Regex'
          },
          {
            opcode: 'regexMatch',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[TEXT] matches regex [PATTERN]?',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello123'
              },
              PATTERN: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '[a-z]+'
              }
            }
          },
          {
            opcode: 'regexTest',
            blockType: Scratch.BlockType.REPORTER,
            text: 'test [TEXT] with regex [PATTERN] flags [FLAGS]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello World'
              },
              PATTERN: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello'
              },
              FLAGS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'i'
              }
            }
          },
          {
            opcode: 'regexReplace',
            blockType: Scratch.BlockType.REPORTER,
            text: 'replace regex [PATTERN] with [REPLACE] in [TEXT]',
            arguments: {
              PATTERN: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '\\d+'
              },
              REPLACE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'X'
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'abc123def456'
              }
            }
          },
          {
            opcode: 'regexExtract',
            blockType: Scratch.BlockType.REPORTER,
            text: 'extract first match of regex [PATTERN] from [TEXT]',
            arguments: {
              PATTERN: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '\\d+'
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'abc123def456'
              }
            }
          },
          {
            opcode: 'regexExtractAll',
            blockType: Scratch.BlockType.REPORTER,
            text: 'extract all matches of regex [PATTERN] from [TEXT]',
            arguments: {
              PATTERN: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '\\d+'
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'abc123def456'
              }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: '🧹 Clean & Filter'
          },
          {
            opcode: 'removeWhitespace',
            blockType: Scratch.BlockType.REPORTER,
            text: 'remove [TYPE] whitespace from [TEXT]',
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'whitespaceTypes'
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '  hello   world  '
              }
            }
          },
          {
            opcode: 'removeDuplicates',
            blockType: Scratch.BlockType.REPORTER,
            text: 'remove duplicate [TYPE] from [TEXT]',
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'duplicateTypes'
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello'
              }
            }
          },
          {
            opcode: 'keepOnly',
            blockType: Scratch.BlockType.REPORTER,
            text: 'keep only [TYPE] from [TEXT]',
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'filterTypes'
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello123world'
              }
            }
          },
          {
            opcode: 'removeCharacters',
            blockType: Scratch.BlockType.REPORTER,
            text: 'remove [CHARS] from [TEXT]',
            arguments: {
              CHARS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'aeiou'
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello world'
              }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: '🔢 Encoding & Special'
          },
          {
            opcode: 'base64Encode',
            blockType: Scratch.BlockType.REPORTER,
            text: 'base64 encode [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello'
              }
            }
          },
          {
            opcode: 'base64Decode',
            blockType: Scratch.BlockType.REPORTER,
            text: 'base64 decode [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'aGVsbG8='
              }
            }
          },
          {
            opcode: 'urlEncode',
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
            opcode: 'urlDecode',
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
            opcode: 'escapeHTML',
            blockType: Scratch.BlockType.REPORTER,
            text: 'escape HTML in [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '<div>hello</div>'
              }
            }
          },
          {
            opcode: 'unescapeHTML',
            blockType: Scratch.BlockType.REPORTER,
            text: 'unescape HTML in [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '&lt;div&gt;hello&lt;/div&gt;'
              }
            }
          },
          {
            opcode: 'toCharCodes',
            blockType: Scratch.BlockType.REPORTER,
            text: 'character codes of [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'ABC'
              }
            }
          },
          {
            opcode: 'fromCharCodes',
            blockType: Scratch.BlockType.REPORTER,
            text: 'text from character codes [CODES]',
            arguments: {
              CODES: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '65,66,67'
              }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: '🎲 Generation'
          },
          {
            opcode: 'randomString',
            blockType: Scratch.BlockType.REPORTER,
            text: 'random [TYPE] string length [LENGTH]',
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'randomTypes'
              },
              LENGTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              }
            }
          },
          {
            opcode: 'shuffle',
            blockType: Scratch.BlockType.REPORTER,
            text: 'shuffle [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello'
              }
            }
          }
        ],
        menus: {
          caseTypes: {
            acceptReporters: true,
            items: ['uppercase', 'lowercase', 'alternating']
          },
          trimModes: {
            acceptReporters: true,
            items: ['both sides', 'start', 'end']
          },
          whitespaceTypes: {
            acceptReporters: true,
            items: ['all', 'extra', 'leading', 'trailing']
          },
          duplicateTypes: {
            acceptReporters: true,
            items: ['characters', 'words', 'lines']
          },
          filterTypes: {
            acceptReporters: true,
            items: ['letters', 'numbers', 'alphanumeric', 'lowercase', 'uppercase']
          },
          randomTypes: {
            acceptReporters: true,
            items: ['alphanumeric', 'letters', 'numbers', 'lowercase', 'uppercase', 'hex']
          }
        }
      };
    }

    // String Operations
    reverse(args) {
      return String(args.TEXT).split('').reverse().join('');
    }

    replaceAll(args) {
      const text = String(args.TEXT);
      const find = String(args.FIND);
      const replace = String(args.REPLACE);
      return text.split(find).join(replace);
    }

    substring(args) {
      const text = String(args.TEXT);
      const start = Math.max(0, Number(args.START) - 1);
      const end = Number(args.END);
      return text.substring(start, end);
    }

    repeat(args) {
      const text = String(args.TEXT);
      const times = Math.max(0, Math.floor(Number(args.TIMES)));
      return text.repeat(times);
    }

    padStart(args) {
      const text = String(args.TEXT);
      const length = Math.floor(Number(args.LENGTH));
      const char = String(args.CHAR)[0] || ' ';
      return text.padStart(length, char);
    }

    padEnd(args) {
      const text = String(args.TEXT);
      const length = Math.floor(Number(args.LENGTH));
      const char = String(args.CHAR)[0] || ' ';
      return text.padEnd(length, char);
    }

    trim(args) {
      const text = String(args.TEXT);
      const mode = args.MODE;
      
      if (mode === 'start') return text.trimStart();
      if (mode === 'end') return text.trimEnd();
      return text.trim();
    }

    // Case & Format
    changeCase(args) {
      const text = String(args.TEXT);
      const caseType = args.CASE;
      
      if (caseType === 'uppercase') return text.toUpperCase();
      if (caseType === 'lowercase') return text.toLowerCase();
      if (caseType === 'alternating') {
        return text.split('').map((c, i) => 
          i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()
        ).join('');
      }
      return text;
    }

    titleCase(args) {
      const text = String(args.TEXT);
      return text.replace(/\w\S*/g, word => 
        word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
      );
    }

    camelCase(args) {
      const text = String(args.TEXT);
      return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      ).replace(/\s+/g, '');
    }

    snakeCase(args) {
      const text = String(args.TEXT);
      return text.toLowerCase().replace(/\s+/g, '_');
    }

    kebabCase(args) {
      const text = String(args.TEXT);
      return text.toLowerCase().replace(/\s+/g, '-');
    }

    // Search & Match
    contains(args) {
      const text = String(args.TEXT);
      const search = String(args.SEARCH);
      return text.includes(search);
    }

    startsWith(args) {
      const text = String(args.TEXT);
      const search = String(args.SEARCH);
      return text.startsWith(search);
    }

    endsWith(args) {
      const text = String(args.TEXT);
      const search = String(args.SEARCH);
      return text.endsWith(search);
    }

    indexOf(args) {
      const text = String(args.TEXT);
      const search = String(args.SEARCH);
      return text.indexOf(search) + 1; // +1 for Scratch 1-indexing
    }

    lastIndexOf(args) {
      const text = String(args.TEXT);
      const search = String(args.SEARCH);
      return text.lastIndexOf(search) + 1;
    }

    countOccurrences(args) {
      const text = String(args.TEXT);
      const search = String(args.SEARCH);
      if (!search) return 0;
      return (text.match(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    }

    // Split & Join
    split(args) {
      const text = String(args.TEXT);
      const delimiter = String(args.DELIMITER);
      return JSON.stringify(text.split(delimiter));
    }

    getLine(args) {
      const text = String(args.TEXT);
      const line = Math.floor(Number(args.LINE)) - 1;
      const lines = text.split('\n');
      return lines[line] || '';
    }

    lineCount(args) {
      const text = String(args.TEXT);
      return text.split('\n').length;
    }

    wordCount(args) {
      const text = String(args.TEXT).trim();
      if (!text) return 0;
      return text.split(/\s+/).length;
    }

    charCount(args) {
      return String(args.TEXT).length;
    }

    // Regex
    regexMatch(args) {
      try {
        const text = String(args.TEXT);
        const pattern = String(args.PATTERN);
        const regex = new RegExp(pattern);
        return regex.test(text);
      } catch (e) {
        return false;
      }
    }

    regexTest(args) {
      try {
        const text = String(args.TEXT);
        const pattern = String(args.PATTERN);
        const flags = String(args.FLAGS);
        const regex = new RegExp(pattern, flags);
        return regex.test(text) ? 'true' : 'false';
      } catch (e) {
        return 'error: ' + e.message;
      }
    }

    regexReplace(args) {
      try {
        const text = String(args.TEXT);
        const pattern = String(args.PATTERN);
        const replace = String(args.REPLACE);
        const regex = new RegExp(pattern, 'g');
        return text.replace(regex, replace);
      } catch (e) {
        return text;
      }
    }

    regexExtract(args) {
      try {
        const text = String(args.TEXT);
        const pattern = String(args.PATTERN);
        const regex = new RegExp(pattern);
        const match = text.match(regex);
        this.lastMatch = match ? match[0] : '';
        return this.lastMatch;
      } catch (e) {
        return '';
      }
    }

    regexExtractAll(args) {
      try {
        const text = String(args.TEXT);
        const pattern = String(args.PATTERN);
        const regex = new RegExp(pattern, 'g');
        const matches = text.match(regex) || [];
        this.lastMatches = matches;
        return JSON.stringify(matches);
      } catch (e) {
        return '[]';
      }
    }

    // Clean & Filter
    removeWhitespace(args) {
      const text = String(args.TEXT);
      const type = args.TYPE;
      
      if (type === 'all') return text.replace(/\s/g, '');
      if (type === 'extra') return text.replace(/\s+/g, ' ');
      if (type === 'leading') return text.trimStart();
      if (type === 'trailing') return text.trimEnd();
      return text;
    }

    removeDuplicates(args) {
      const text = String(args.TEXT);
      const type = args.TYPE;
      
      if (type === 'characters') {
        return [...new Set(text)].join('');
      } else if (type === 'words') {
        const words = text.split(/\s+/);
        return [...new Set(words)].join(' ');
      } else if (type === 'lines') {
        const lines = text.split('\n');
        return [...new Set(lines)].join('\n');
      }
      return text;
    }

    keepOnly(args) {
      const text = String(args.TEXT);
      const type = args.TYPE;
      
      if (type === 'letters') return text.replace(/[^a-zA-Z]/g, '');
      if (type === 'numbers') return text.replace(/[^0-9]/g, '');
      if (type === 'alphanumeric') return text.replace(/[^a-zA-Z0-9]/g, '');
      if (type === 'lowercase') return text.replace(/[^a-z]/g, '');
      if (type === 'uppercase') return text.replace(/[^A-Z]/g, '');
      return text;
    }

    removeCharacters(args) {
      const text = String(args.TEXT);
      const chars = String(args.CHARS);
      const regex = new RegExp('[' + chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ']', 'g');
      return text.replace(regex, '');
    }

    // Encoding & Special
    base64Encode(args) {
      try {
        return btoa(String(args.TEXT));
      } catch (e) {
        return '';
      }
    }

    base64Decode(args) {
      try {
        return atob(String(args.TEXT));
      } catch (e) {
        return '';
      }
    }

    urlEncode(args) {
      return encodeURIComponent(String(args.TEXT));
    }

    urlDecode(args) {
      try {
        return decodeURIComponent(String(args.TEXT));
      } catch (e) {
        return args.TEXT;
      }
    }

    escapeHTML(args) {
      const text = String(args.TEXT);
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    unescapeHTML(args) {
      const text = String(args.TEXT);
      const div = document.createElement('div');
      div.innerHTML = text;
      return div.textContent;
    }

    toCharCodes(args) {
      const text = String(args.TEXT);
      return text.split('').map(c => c.charCodeAt(0)).join(',');
    }

    fromCharCodes(args) {
      try {
        const codes = String(args.CODES).split(',').map(c => parseInt(c.trim()));
        return String.fromCharCode(...codes);
      } catch (e) {
        return '';
      }
    }

    // Generation
    randomString(args) {
      const type = args.TYPE;
      const length = Math.max(0, Math.floor(Number(args.LENGTH)));
      
      let chars = '';
      if (type === 'alphanumeric') chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      else if (type === 'letters') chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      else if (type === 'numbers') chars = '0123456789';
      else if (type === 'lowercase') chars = 'abcdefghijklmnopqrstuvwxyz';
      else if (type === 'uppercase') chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      else if (type === 'hex') chars = '0123456789abcdef';
      
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    shuffle(args) {
      const text = String(args.TEXT);
      const arr = text.split('');
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.join('');
    }
  }

  Scratch.extensions.register(new AdvancedTextExtension());
})(Scratch);