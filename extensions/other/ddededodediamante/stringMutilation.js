(function (Scratch) {
  // Made by ddededodediamante

  Scratch.translate.setup({
    "es-419": {
      Hello: "Hola",
      hello: "hola",
      or: "o",
      and: "y",
      start: "comienzo",
      end: "final",
      Advanced: "Avanzado",
      encode: "codificar",
      decode: "descodificar",
      "case [string] to [menu]": "convertir [string] a [menu]",
      lowercase: "minuscula",
      UPPERCASE: "MAYUSCULA",
      "mIxEd CaSe": "cAsO mEzClAdO",
      "random case": "caso aleatorio",
      "Title Case": "Caso De Titulo",
      letters: "letras",
      numbers: "numeros",
      specials: "especiales",
      double: "doble",
      single: "una",
      triple: "triple",
      quadruple: "cuadruple",
      quintuple: "quintuple",
      "[string] exactly equals [string2]?": "es [string] exactamente igual a [string2]?",
      "[string] ends with [string2]?": "[string] termina con [string2]?",
      "[string] starts with [string2]?": "[string] comienza con [string2]?",
      "[string] starts [menu] ends with [string2]?": "[string] comienza [menu] termina con [string2]?",
      "[string] contains [menu]?": "[string] contiene [menu]?",
      "repeat [string] [number] times": "repetir [string] [number] veces",
      "length of [string] excluding [exclude]": "longitud de [string] excluyendo [exclude]",
      "unicode of letter #[number] of [string]": "unicode de la letra #[number] de [string]",
      "unicode of letter [letter]": "unicode de la letra [letter]",
      "letter from unicode [unicode]": "letra de unicode [unicode]",
      "index of [string] in [string2]": "indice de [string] en [string2]",
      "last index of [string] in [string2]": "ultimo indice de [string] en [string2]",
      "index # [number] of [string] in [string2]": "indice # [number] de [string] en [string2]",
      "in [string] replace first [string2] with [string3]": "en [string] reemplazar primer [string2] con [string3]",
      "in [string] replace all [string2] with [string3]": "en [string] reemplazar todos [string2] con [string3]",
      "in [string] replace #[number] [string2] with [string3]":
        "en [string] reemplazar #[number] [string2] con [string3]",
      "slice [string] from [number] to [number2]": "acortar [string] desde [number] hasta [number2]",
      "get [string] split by [string2]": "obtener [string] separado con [string2]",
      "amount of [string] in [string2]": "cantidad de [string] en [string2]",
      "add [string] to [string2] until length [number] from [menu]":
        "añadir [string] a [string2] hasta longitud [number] desde el [menu]",
      "in [string] remove from array [array]": "en [string] quitar desde array [array]",
      "text [string] to unicode array": "texto [string] a array unicode",
      "text from unicode array [array]": "texto desde array unicode [array]",
      "[menu] newline": "[menu] linea nueva",
      "join [string] \\n [string2]": "unir [string] \\n [string2]",
      "join [string] \\n [string2] \\n [string3]": "unir [string] \\n [string2] \\n [string3]",
      "URL [menu] [string]": "[menu] [string] para URLs",
      "value [return]": "valor [return]",
    },
  });

  class StringMutilationExt {
    constructor() {
      this.translate = (name) => {
        return Scratch.translate({ id: name, default: name });
      };
    }

    getInfo() {
      return {
        id: "ddeStringMutilation",
        name: "String Mutilation",
        color1: "#72cf94",
        blocks: [
          {
            opcode: "ChangeCase",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("case [string] to [menu]"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: this.translate("Hello"),
              },
              menu: {
                type: Scratch.ArgumentType.STRING,
                menu: "CASE_CHANGE",
              },
            },
          },
          {
            opcode: "StringExactlyEquals",
            blockType: Scratch.BlockType.BOOLEAN,
            text: this.translate("[string] exactly equals [string2]?"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: this.translate("Hello"),
              },
              string2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: this.translate("hello"),
              },
            },
          },
          {
            opcode: "StringEndsWith",
            blockType: Scratch.BlockType.BOOLEAN,
            text: this.translate("[string] ends with [string2]?"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: this.translate("Hello"),
              },
              string2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "H",
              },
            },
          },
          {
            opcode: "StringStartsWith",
            blockType: Scratch.BlockType.BOOLEAN,
            text: this.translate("[string] starts with [string2]?"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: this.translate("Hello"),
              },
              string2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "H",
              },
            },
          },
          {
            opcode: "StringStartsEndsWith",
            blockType: Scratch.BlockType.BOOLEAN,
            text: this.translate("[string] starts [menu] ends with [string2]?"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: this.translate("Hello"),
              },
              string2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "H",
              },
              menu: {
                type: Scratch.ArgumentType.STRING,
                menu: "OR_AND",
              },
            },
          },
          {
            opcode: "HasSomething",
            blockType: Scratch.BlockType.BOOLEAN,
            text: this.translate("[string] contains [menu]?"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Love 4 you :D",
              },
              menu: {
                type: Scratch.ArgumentType.STRING,
                menu: "CONTAINS",
              },
            },
          },
          {
            opcode: "RepeatString",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("repeat [string] [number] times"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "M",
              },
              number: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 5,
              },
            },
          },
          {
            opcode: "LengthExcluding",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("length of [string] excluding [exclude]"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hi_hi",
              },
              exclude: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "_",
              },
            },
          },
          {
            opcode: "UnicodeAtString",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("unicode of letter #[number] of [string]"),
            hideFromPalette: true,
            arguments: {
              number: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2,
              },
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: this.translate("Hello"),
              },
            },
          },
          {
            opcode: "UnicodeOfLetter",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("unicode of letter [letter]"),
            arguments: {
              letter: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "A",
              },
            },
          },
          {
            opcode: "CharacterFromUnicode",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("letter from unicode [unicode]"),
            arguments: {
              unicode: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 65,
              },
            },
          },
          {
            opcode: "IndexOfString",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("index of [string] in [string2]"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "e",
              },
              string2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "tea tea",
              },
            },
          },
          {
            opcode: "LastIndexOfString",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("last index of [string] in [string2]"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "e",
              },
              string2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "tea tea",
              },
            },
          },
          {
            opcode: "IndexNumberOf",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("index # [number] of [string] in [string2]"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hi",
              },
              string2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hi hi hi",
              },
              number: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2,
              },
            },
          },
          {
            opcode: "ReplaceFirst",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("in [string] replace first [string2] with [string3]"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "abc abc",
              },
              string2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "abc",
              },
              string3: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "def",
              },
            },
          },
          {
            opcode: "ReplaceAll",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("in [string] replace all [string2] with [string3]"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "papa",
              },
              string2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "p",
              },
              string3: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "m",
              },
            },
          },
          {
            opcode: "ReplaceNumber",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("in [string] replace #[number] [string2] with [string3]"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hi hi hi",
              },
              string2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hi",
              },
              string3: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hey",
              },
              number: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2,
              },
            },
          },
          {
            opcode: "SliceText",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("slice [string] from [number] to [number2]"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Heyey",
              },
              number: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
              number2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3,
              },
            },
          },
          {
            opcode: "SplitText",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("get [string] split by [string2]"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hey-hey",
              },
              string2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "-",
              },
            },
          },
          {
            opcode: "TimesStringAppears",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("amount of [string] in [string2]"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "ha",
              },
              string2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hahahaha",
              },
            },
          },
          {
            blockType: "label",
            text: this.translate("Advanced"),
          },
          {
            opcode: "AddToStringUntil",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("add [string] to [string2] until length [number] from [menu]"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "a",
              },
              string2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hh",
              },
              number: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 7,
              },
              menu: {
                type: Scratch.ArgumentType.STRING,
                menu: "STRING_PAD",
              },
            },
          },
          {
            opcode: "RemoveFromArray",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("in [string] remove from array [array]"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "abcde",
              },
              array: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '["b","d"]',
              },
            },
          },
          {
            opcode: "HasFromArray",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "does [string] contain any from array [array]?",
            hideFromPalette: true,
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "abcde",
              },
              array: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '["f","e"]',
              },
            },
          },
          {
            opcode: "ToUnicodeArray",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("text [string] to unicode array"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "abcde",
              },
            },
          },
          {
            opcode: "FromUnicodeArray",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("text from unicode array [array]"),
            arguments: {
              array: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "[97, 98, 99, 100, 101]",
              },
            },
          },
          {
            opcode: "Newline",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("[menu] newline"),
            arguments: {
              menu: {
                type: Scratch.ArgumentType.STRING,
                menu: "AMOUNT_NEWLINE",
              },
            },
          },
          {
            opcode: "NewlineJoin",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("join [string] \\n [string2]"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "123",
              },
              string2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hey",
              },
            },
          },
          {
            opcode: "NewlineJoinThree",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("join [string] \\n [string2] \\n [string3]"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "123",
              },
              string2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hey",
              },
              string3: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hmm",
              },
            },
          },
          {
            opcode: "URLcode",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("URL [menu] [string]"),
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "12345",
              },
              menu: {
                type: Scratch.ArgumentType.STRING,
                menu: "URL_CODE",
              },
            },
          },
          {
            opcode: "ValueReturn",
            blockType: Scratch.BlockType.REPORTER,
            text: this.translate("value [return]"),
            arguments: {
              return: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello",
              },
            },
          },
        ],
        menus: {
          CASE_CHANGE: {
            acceptReporters: true,
            items: [
              {
                text: this.translate("lowercase"),
                value: "lowercase",
              },
              {
                text: this.translate("UPPERCASE"),
                value: "UPPERCASE",
              },
              {
                text: this.translate("mIxEd CaSe"),
                value: "mIxEd CaSe",
              },
              {
                text: this.translate("random case"),
                value: "random case",
              },
              {
                text: this.translate("Title Case"),
                value: "Title Case",
              },
            ],
          },
          OR_AND: {
            acceptReporters: true,
            items: [
              {
                text: this.translate("or"),
                value: "or",
              },
              {
                text: this.translate("and"),
                value: "and",
              },
            ],
          },
          STRING_PAD: {
            acceptReporters: true,
            items: [
              {
                text: this.translate("start"),
                value: "start",
              },
              {
                text: this.translate("end"),
                value: "end",
              },
            ],
          },
          URL_CODE: {
            acceptReporters: true,
            items: [
              {
                text: this.translate("encode"),
                value: "encode",
              },
              {
                text: this.translate("decode"),
                value: "decode",
              },
            ],
          },
          CONTAINS: {
            acceptReporters: true,
            items: [
              {
                text: this.translate("letters"),
                value: "letters",
              },
              {
                text: this.translate("numbers"),
                value: "numbers",
              },
              {
                text: this.translate("specials"),
                value: "specials",
              },
            ],
          },
          AMOUNT_NEWLINE: {
            acceptReporters: true,
            items: [
              {
                text: this.translate("single"),
                value: "single",
              },
              {
                text: this.translate("double"),
                value: "double",
              },
              {
                text: this.translate("triple"),
                value: "triple",
              },
              {
                text: this.translate("quadruple"),
                value: "quadruple",
              },
              {
                text: this.translate("quintuple"),
                value: "quintuple",
              },
            ],
          },
        },
      };
    }
    ChangeCase(args) {
      const str = args.string;
      if (args.menu == "lowercase") {
        return str.toLowerCase();
      } else if (args.menu == "UPPERCASE") {
        return str.toUpperCase();
      } else if (args.menu == "mIxEd CaSe") {
        let returns = [];
        let state = true;

        for (let i = 0; i < str.length; i++) {
          const char = str.charAt(i);
          returns.push(state ? char.toLowerCase() : char.toUpperCase());
          state = !state;
        }

        return returns.join("");
      } else if (args.menu == "random case") {
        let returns = [];

        for (let i = 0; i < str.length; i++) {
          returns.push(Math.random() > 0.5 ? str.charAt(i).toLowerCase() : str.charAt(i).toUpperCase());
        }

        return returns.join("");
      } else if (args.menu == "Title Case") {
        const array = str.split(" ");
        const array2 = [];
        for (const element of array) {
          array2.push(element.charAt(0).toUpperCase() + element.slice(1));
        }
        return array2.join(" ");
      } else return str;
    }
    UnicodeAtString(args) {
      return args.string.codePointAt(args.number - 1);
    }
    UnicodeOfLetter(args) {
      return args.letter.codePointAt(0);
    }
    StringExactlyEquals(args) {
      return args.string === args.string2;
    }
    StringEndsWith(args) {
      return args.string.endsWith(args.string2);
    }
    StringStartsWith(args) {
      return args.string.startsWith(args.string2);
    }
    StringStartsEndsWith(args) {
      const str1 = args.string;
      const str2 = args.string2;
      const menu = args.menu;
      if (menu == "or") {
        return str1.endsWith(str2) || str1.startsWith(str2);
      } else if (menu == "and") {
        return str1.endsWith(str2) && str1.startsWith(str2);
      } else {
        return false;
      }
    }
    CharacterFromUnicode(args) {
      return String.fromCharCode(args.unicode);
    }
    IndexOfString(args) {
      return args.string2.indexOf(args.string) + 1;
    }
    LastIndexOfString(args) {
      return args.string2.lastIndexOf(args.string) + 1;
    }
    ReplaceFirst(args) {
      return args.string.replace(args.string2, args.string3);
    }
    ReplaceAll(args) {
      return args.string.replaceAll(args.string2, args.string3);
    }
    ReplaceNumber(args) {
      var count = 0;
      return args.string.replace(new RegExp(args.string2, "g"), function (match) {
        count++;
        if (count === args.number) {
          return args.string3;
        }
        return match;
      });
    }
    SliceText(args) {
      return args.string.slice(args.number - 1, args.number2);
    }
    SplitText(args) {
      const array = args.string.split(args.string2);
      return JSON.stringify(array);
    }
    AddToStringUntil(args) {
      if (args.menu == "start") {
        return args.string2.padStart(args.number, args.string);
      } else if (args.menu == "end") {
        return args.string2.padEnd(args.number, args.string);
      }
    }
    RemoveFromArray(args) {
      const array = JSON.parse(args.array);
      var string = args.string;
      array.forEach((item) => (string = string.replaceAll(item, "")));
      return string;
    }
    HasFromArray(args) {
      const array = JSON.parse(args.array);
      return array.some((v) => args.string.includes(v));
    }
    ToUnicodeArray(args) {
      const array = [];
      for (let i = 0; i < args.string.length; i++) {
        array.push(args.string.charCodeAt(i));
      }
      return JSON.stringify(array);
    }
    FromUnicodeArray(args) {
      const array = JSON.parse(args.array);
      var str = "";
      for (const element of array) {
        str += String.fromCharCode(element);
      }
      return str;
    }
    TimesStringAppears(args) {
      return args.string2.split(args.string).length - 1;
    }
    RepeatString(args) {
      return args.string.repeat(args.number);
    }
    Newline(args) {
      const amount = args.menu;
      switch (amount) {
        case "single":
          return "\n";
        case "double":
          return "\n\n";
        case "triple":
          return "\n\n\n";
        case "quadruple":
          return "\n\n\n\n";
        case "quintuple":
          return "\n\n\n\n\n";
        default:
          return "";
      }
    }
    NewlineJoin(args) {
      return `${args.string}\n${args.string2}`;
    }
    NewlineJoinThree(args) {
      return `${args.string}\n${args.string2}\n${args.string3}`;
    }
    ValueReturn(args) {
      return args.return;
    }
    LengthExcluding(args) {
      return args.string.replaceAll(args.exclude, "").length;
    }
    URLcode(args) {
      if (args.menu == "encode") {
        return encodeURIComponent(args.string);
      } else if (args.menu == "decode") {
        return decodeURIComponent(args.string);
      }
    }
    HasSomething(args) {
      if (args.menu == "letters") {
        return /[a-zA-Z]/.test(args.string);
      } else if (args.menu == "numbers") {
        return /\d/.test(args.string);
      } else if (args.menu == "specials") {
        return args.string.replace(/[a-zA-Z0-9\s]/g, "").length > 0;
      } else {
        return false;
      }
    }
    IndexNumberOf(args) {
      let index = 0;
      for (let i = 0; i < args.number; i++) {
        index = args.string2.indexOf(args.string, index + 1);
        if (index == -1) {
          return 0;
        }
      }
      return index + 1;
    }
  }
  Scratch.extensions.register(new StringMutilationExt());
})(Scratch);
