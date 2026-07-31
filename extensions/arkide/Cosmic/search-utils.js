(function(Scratch) {
  'use strict';

  class SearchExtension {
    constructor() {
      // Store a list of names for searching
      this.namesList = [];
    }

    getInfo() {
      return {
        id: 'searchextension',
        name: 'Search Algorithm',
        blocks: [
          {
            opcode: 'exactMatch',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[NAME] exactly matches [VALUE]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'apple'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'apple'
              }
            }
          },
          {
            opcode: 'closeMatch',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[NAME] closely matches [VALUE]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'apple'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'aple'
              }
            }
          },
          {
            opcode: 'containsMatch',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[NAME] contains [VALUE]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'pineapple'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'apple'
              }
            }
          },
          {
            opcode: 'startsWithMatch',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[NAME] starts with [VALUE]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'apple pie'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'apple'
              }
            }
          },
          {
            opcode: 'addToList',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add [NAME] to search list',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'apple'
              }
            }
          },
          {
            opcode: 'searchInList',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'search list for [VALUE]',
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'apple'
              }
            }
          },
          {
            opcode: 'clearList',
            blockType: Scratch.BlockType.COMMAND,
            text: 'clear search list'
          },
          {
            opcode: 'getListSize',
            blockType: Scratch.BlockType.REPORTER,
            text: 'number of items in search list'
          },
          {
            opcode: 'getSimilarity',
            blockType: Scratch.BlockType.REPORTER,
            text: 'similarity % between [NAME] and [VALUE]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'apple'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'aple'
              }
            }
          }
        ]
      };
    }

    // Exact match - case insensitive
    exactMatch(args) {
      return args.NAME.toLowerCase() === args.VALUE.toLowerCase();
    }

    // Close match using Levenshtein distance
    closeMatch(args) {
      const name = args.NAME.toLowerCase();
      const value = args.VALUE.toLowerCase();
      
      // If exact match, return true
      if (name === value) return true;
      
      // Calculate Levenshtein distance
      const distance = this.levenshteinDistance(name, value);
      const maxLength = Math.max(name.length, value.length);
      
      // Consider it a close match if distance is less than 30% of the longer string
      return distance <= maxLength * 0.3;
    }

    // Check if name contains value
    containsMatch(args) {
      return args.NAME.toLowerCase().includes(args.VALUE.toLowerCase());
    }

    // Check if name starts with value
    startsWithMatch(args) {
      return args.NAME.toLowerCase().startsWith(args.VALUE.toLowerCase());
    }

    // Add name to internal list
    addToList(args) {
      if (args.NAME && args.NAME.trim() !== '') {
        this.namesList.push(args.NAME);
      }
    }

    // Search through the internal list for close matches
    searchInList(args) {
      const value = args.VALUE.toLowerCase();
      
      for (let i = 0; i < this.namesList.length; i++) {
        const name = this.namesList[i].toLowerCase();
        
        // Check for exact match or close match
        if (name === value || 
            name.includes(value) || 
            this.levenshteinDistance(name, value) <= Math.max(name.length, value.length) * 0.3) {
          return true;
        }
      }
      
      return false;
    }

    // Clear the search list
    clearList() {
      this.namesList = [];
    }

    // Get the size of the search list
    getListSize() {
      return this.namesList.length;
    }

    // Get similarity percentage between two strings
    getSimilarity(args) {
      const name = args.NAME.toLowerCase();
      const value = args.VALUE.toLowerCase();
      
      if (name === value) return 100;
      
      const distance = this.levenshteinDistance(name, value);
      const maxLength = Math.max(name.length, value.length);
      
      if (maxLength === 0) return 100;
      
      const similarity = ((maxLength - distance) / maxLength) * 100;
      return Math.round(similarity);
    }

    // Levenshtein distance algorithm for string similarity
    levenshteinDistance(str1, str2) {
      const len1 = str1.length;
      const len2 = str2.length;
      const matrix = [];

      // Initialize matrix
      for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
      }
      for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
      }

      // Fill matrix
      for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
          if (str1[i - 1] === str2[j - 1]) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1, // substitution
              matrix[i][j - 1] + 1,     // insertion
              matrix[i - 1][j] + 1      // deletion
            );
          }
        }
      }

      return matrix[len1][len2];
    }
  }

  Scratch.extensions.register(new SearchExtension());
})(Scratch);