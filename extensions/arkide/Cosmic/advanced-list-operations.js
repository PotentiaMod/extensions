(function(Scratch) {
  'use strict';

  class AdvancedLists {
    getInfo() {
      return {
        id: 'advancedlists',
        name: 'Advanced Lists',
        color1: '#FF661A',
        color2: '#E64D00',
        color3: '#CC4400',
        blocks: [
          {
            blockType: Scratch.BlockType.LABEL,
            text: '📊 Sorting & Ordering'
          },
          {
            opcode: 'sortList',
            blockType: Scratch.BlockType.COMMAND,
            text: 'sort [LIST] [ORDER] as [TYPE]',
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: 'lists' },
              ORDER: { type: Scratch.ArgumentType.STRING, menu: 'sortOrder' },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: 'sortType' }
            }
          },
          {
            opcode: 'reverseList',
            blockType: Scratch.BlockType.COMMAND,
            text: 'reverse [LIST]',
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: 'lists' }
            }
          },
          {
            opcode: 'shuffleList',
            blockType: Scratch.BlockType.COMMAND,
            text: 'shuffle [LIST]',
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: 'lists' }
            }
          },
          
          {
            blockType: Scratch.BlockType.LABEL,
            text: '🔍 Finding & Filtering'
          },
          {
            opcode: 'findAll',
            blockType: Scratch.BlockType.REPORTER,
            text: 'all positions of [VALUE] in [LIST]',
            arguments: {
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'apple' },
              LIST: { type: Scratch.ArgumentType.STRING, menu: 'lists' }
            }
          },
          {
            opcode: 'removeDuplicates',
            blockType: Scratch.BlockType.COMMAND,
            text: 'remove duplicates from [LIST]',
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: 'lists' }
            }
          },
          {
            opcode: 'countOccurrences',
            blockType: Scratch.BlockType.REPORTER,
            text: 'count [VALUE] in [LIST]',
            arguments: {
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'apple' },
              LIST: { type: Scratch.ArgumentType.STRING, menu: 'lists' }
            }
          },
          {
            opcode: 'filterByCondition',
            blockType: Scratch.BlockType.COMMAND,
            text: 'keep only items in [LIST] that are [CONDITION] [VALUE]',
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: 'lists' },
              CONDITION: { type: Scratch.ArgumentType.STRING, menu: 'conditions' },
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '10' }
            }
          },
          
          {
            blockType: Scratch.BlockType.LABEL,
            text: '✂️ Splitting & Merging'
          },
          {
            opcode: 'copyList',
            blockType: Scratch.BlockType.COMMAND,
            text: 'copy [SOURCE] to [DEST]',
            arguments: {
              SOURCE: { type: Scratch.ArgumentType.STRING, menu: 'lists' },
              DEST: { type: Scratch.ArgumentType.STRING, menu: 'lists' }
            }
          },
          {
            opcode: 'mergeLists',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add all items from [SOURCE] to [DEST]',
            arguments: {
              SOURCE: { type: Scratch.ArgumentType.STRING, menu: 'lists' },
              DEST: { type: Scratch.ArgumentType.STRING, menu: 'lists' }
            }
          },
          {
            opcode: 'getRange',
            blockType: Scratch.BlockType.REPORTER,
            text: 'items [START] to [END] of [LIST] as text',
            arguments: {
              START: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              END: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 },
              LIST: { type: Scratch.ArgumentType.STRING, menu: 'lists' }
            }
          },
          {
            opcode: 'splitIntoList',
            blockType: Scratch.BlockType.COMMAND,
            text: 'split [TEXT] by [SEPARATOR] into [LIST]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'apple,banana,cherry' },
              SEPARATOR: { type: Scratch.ArgumentType.STRING, defaultValue: ',' },
              LIST: { type: Scratch.ArgumentType.STRING, menu: 'lists' }
            }
          },
          
          {
            blockType: Scratch.BlockType.LABEL,
            text: '📈 Math Operations'
          },
          {
            opcode: 'sumList',
            blockType: Scratch.BlockType.REPORTER,
            text: 'sum of [LIST]',
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: 'lists' }
            }
          },
          {
            opcode: 'averageList',
            blockType: Scratch.BlockType.REPORTER,
            text: 'average of [LIST]',
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: 'lists' }
            }
          },
          {
            opcode: 'minMax',
            blockType: Scratch.BlockType.REPORTER,
            text: '[OPERATION] of [LIST]',
            arguments: {
              OPERATION: { type: Scratch.ArgumentType.STRING, menu: 'minmax' },
              LIST: { type: Scratch.ArgumentType.STRING, menu: 'lists' }
            }
          },
          {
            opcode: 'transformList',
            blockType: Scratch.BlockType.COMMAND,
            text: 'multiply all items in [LIST] by [FACTOR]',
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: 'lists' },
              FACTOR: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 }
            }
          },
          
          {
            blockType: Scratch.BlockType.LABEL,
            text: '💾 Import/Export'
          },
          {
            opcode: 'listToJSON',
            blockType: Scratch.BlockType.REPORTER,
            text: '[LIST] as JSON',
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: 'lists' }
            }
          },
          {
            opcode: 'listFromJSON',
            blockType: Scratch.BlockType.COMMAND,
            text: 'load [LIST] from JSON [JSON]',
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: 'lists' },
              JSON: { type: Scratch.ArgumentType.STRING, defaultValue: '["a","b","c"]' }
            }
          },
          {
            opcode: 'fillList',
            blockType: Scratch.BlockType.COMMAND,
            text: 'fill [LIST] with [COUNT] copies of [VALUE]',
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: 'lists' },
              COUNT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '0' }
            }
          }
        ],
        menus: {
          lists: { acceptReporters: true, items: '_getLists' },
          sortOrder: ['ascending ↑', 'descending ↓'],
          sortType: ['numbers', 'text', 'auto'],
          conditions: ['greater than', 'less than', 'equal to', 'not equal to', 'contains'],
          minmax: ['minimum', 'maximum']
        }
      };
    }

    _getLists() {
      const lists = Scratch.vm.runtime.getTargetForStage().variables;
      const listNames = [];
      for (const [id, variable] of Object.entries(lists)) {
        if (variable.type === 'list') {
          listNames.push(variable.name);
        }
      }
      return listNames.length > 0 ? listNames : [''];
    }

    _getList(listName, util) {
      const target = util.target;
      const lists = target.variables;
      
      for (const [id, variable] of Object.entries(lists)) {
        if (variable.name === listName && variable.type === 'list') {
          return variable;
        }
      }
      
      // Check stage
      const stage = Scratch.vm.runtime.getTargetForStage();
      for (const [id, variable] of Object.entries(stage.variables)) {
        if (variable.name === listName && variable.type === 'list') {
          return variable;
        }
      }
      
      return null;
    }

    sortList(args, util) {
      const list = this._getList(args.LIST, util);
      if (!list) return;

      const order = args.ORDER;
      const type = args.TYPE;
      
      const items = [...list.value];
      
      items.sort((a, b) => {
        let aVal = a;
        let bVal = b;
        
        if (type === 'numbers') {
          aVal = parseFloat(a) || 0;
          bVal = parseFloat(b) || 0;
        } else if (type === 'auto') {
          const aNum = parseFloat(a);
          const bNum = parseFloat(b);
          if (!isNaN(aNum) && !isNaN(bNum)) {
            aVal = aNum;
            bVal = bNum;
          }
        }
        
        if (aVal < bVal) return order.includes('ascending') ? -1 : 1;
        if (aVal > bVal) return order.includes('ascending') ? 1 : -1;
        return 0;
      });
      
      list.value = items;
    }

    reverseList(args, util) {
      const list = this._getList(args.LIST, util);
      if (!list) return;
      list.value = list.value.reverse();
    }

    shuffleList(args, util) {
      const list = this._getList(args.LIST, util);
      if (!list) return;
      
      const items = [...list.value];
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
      list.value = items;
    }

    findAll(args, util) {
      const list = this._getList(args.LIST, util);
      if (!list) return '[]';
      
      const value = Scratch.Cast.toString(args.VALUE);
      const positions = [];
      
      list.value.forEach((item, index) => {
        if (Scratch.Cast.toString(item) === value) {
          positions.push(index + 1);
        }
      });
      
      return JSON.stringify(positions);
    }

    removeDuplicates(args, util) {
      const list = this._getList(args.LIST, util);
      if (!list) return;
      
      list.value = [...new Set(list.value)];
    }

    countOccurrences(args, util) {
      const list = this._getList(args.LIST, util);
      if (!list) return 0;
      
      const value = Scratch.Cast.toString(args.VALUE);
      let count = 0;
      
      list.value.forEach(item => {
        if (Scratch.Cast.toString(item) === value) count++;
      });
      
      return count;
    }

    filterByCondition(args, util) {
      const list = this._getList(args.LIST, util);
      if (!list) return;
      
      const condition = args.CONDITION;
      const value = args.VALUE;
      const numValue = Scratch.Cast.toNumber(value);
      
      list.value = list.value.filter(item => {
        const itemNum = Scratch.Cast.toNumber(item);
        const itemStr = Scratch.Cast.toString(item);
        const valueStr = Scratch.Cast.toString(value);
        
        switch (condition) {
          case 'greater than':
            return itemNum > numValue;
          case 'less than':
            return itemNum < numValue;
          case 'equal to':
            return itemStr === valueStr;
          case 'not equal to':
            return itemStr !== valueStr;
          case 'contains':
            return itemStr.includes(valueStr);
          default:
            return true;
        }
      });
    }

    copyList(args, util) {
      const source = this._getList(args.SOURCE, util);
      const dest = this._getList(args.DEST, util);
      if (!source || !dest) return;
      
      dest.value = [...source.value];
    }

    mergeList(args, util) {
      const source = this._getList(args.SOURCE, util);
      const dest = this._getList(args.DEST, util);
      if (!source || !dest) return;
      
      dest.value = [...dest.value, ...source.value];
    }

    getRange(args, util) {
      const list = this._getList(args.LIST, util);
      if (!list) return '';
      
      const start = Math.max(1, Scratch.Cast.toNumber(args.START));
      const end = Math.min(list.value.length, Scratch.Cast.toNumber(args.END));
      
      return list.value.slice(start - 1, end).join(', ');
    }

    splitIntoList(args, util) {
      const list = this._getList(args.LIST, util);
      if (!list) return;
      
      const text = Scratch.Cast.toString(args.TEXT);
      const separator = Scratch.Cast.toString(args.SEPARATOR);
      
      list.value = text.split(separator);
    }

    sumList(args, util) {
      const list = this._getList(args.LIST, util);
      if (!list) return 0;
      
      return list.value.reduce((sum, item) => {
        return sum + (Scratch.Cast.toNumber(item) || 0);
      }, 0);
    }

    averageList(args, util) {
      const list = this._getList(args.LIST, util);
      if (!list || list.value.length === 0) return 0;
      
      const sum = list.value.reduce((sum, item) => {
        return sum + (Scratch.Cast.toNumber(item) || 0);
      }, 0);
      
      return sum / list.value.length;
    }

    minMax(args, util) {
      const list = this._getList(args.LIST, util);
      if (!list || list.value.length === 0) return 0;
      
      const numbers = list.value.map(item => Scratch.Cast.toNumber(item));
      
      return args.OPERATION === 'minimum' 
        ? Math.min(...numbers)
        : Math.max(...numbers);
    }

    transformList(args, util) {
      const list = this._getList(args.LIST, util);
      if (!list) return;
      
      const factor = Scratch.Cast.toNumber(args.FACTOR);
      list.value = list.value.map(item => {
        const num = Scratch.Cast.toNumber(item);
        return num * factor;
      });
    }

    listToJSON(args, util) {
      const list = this._getList(args.LIST, util);
      if (!list) return '[]';
      
      return JSON.stringify(list.value);
    }

    listFromJSON(args, util) {
      const list = this._getList(args.LIST, util);
      if (!list) return;
      
      try {
        const data = JSON.parse(Scratch.Cast.toString(args.JSON));
        if (Array.isArray(data)) {
          list.value = data;
        }
      } catch (e) {
        console.error('Invalid JSON:', e);
      }
    }

    fillList(args, util) {
      const list = this._getList(args.LIST, util);
      if (!list) return;
      
      const count = Scratch.Cast.toNumber(args.COUNT);
      const value = Scratch.Cast.toString(args.VALUE);
      
      list.value = Array(count).fill(value);
    }

    mergeList(args, util) {
      const source = this._getList(args.SOURCE, util);
      const dest = this._getList(args.DEST, util);
      if (!source || !dest) return;
      
      dest.value.push(...source.value);
    }
  }

  Scratch.extensions.register(new AdvancedLists());
})(Scratch);