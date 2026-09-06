// Name:文字转html
// ID: texttohtml
// Description: 可以转换一些基本的html格式
// By: Comtbwp
// License: MPL-2.0
class TextToHtml {
  getInfo() {
    return {
      id: 'texttohtml',
      name: '文字转HTML',
      color1: '#4CAF50',
      color2: '#45a049',
      blocks: [
        {
          opcode: 'textToHtml',
          blockType: Scratch.BlockType.REPORTER,
          text: '文本转HTML [TEXT]',
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '这是一段文本'
            }
          }
        },
        {
          opcode: 'styledText',
          blockType: Scratch.BlockType.REPORTER,
          text: '样式文本 [TEXT] 颜色：[COLOR] 大小：[SIZE]',
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '样式文本'
            },
            COLOR: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '#ff0000'
            },
            SIZE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 16
            }
          }
        },
        {
          opcode: 'createLink',
          blockType: Scratch.BlockType.REPORTER,
          text: '创建链接 [TEXT] 网址：[URL]',
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '点击这里'
            },
            URL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'https://example.com'
            }
          }
        },
        {
          opcode: 'createImage',
          blockType: Scratch.BlockType.REPORTER,
          text: '创建图片 [URL] 宽度：[WIDTH]',
          arguments: {
            URL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'https://example.com/image.jpg'
            },
            WIDTH: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 100
            }
          }
        },
        {
          opcode: 'createButton',
          blockType: Scratch.BlockType.REPORTER,
          text: '创建按钮 [TEXT] 颜色：[COLOR]',
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '按钮'
            },
            COLOR: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '#007bff'
            }
          }
        },
        {
          opcode: 'createList',
          blockType: Scratch.BlockType.REPORTER,
          text: '创建[TYPE]列表 [ITEMS]',
          arguments: {
            TYPE: {
              type: Scratch.ArgumentType.STRING,
              menu: 'listTypes',
              defaultValue: 'ul'
            },
            ITEMS: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '项目1,项目2,项目3'
            }
          }
        },
        {
          opcode: 'createHeader',
          blockType: Scratch.BlockType.REPORTER,
          text: '创建[TYPE]标题 [TEXT]',
          arguments: {
            TYPE: {
              type: Scratch.ArgumentType.STRING,
              menu: 'headerTypes',
              defaultValue: 'h1'
            },
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '标题'
            }
          }
        },
        {
          opcode: 'createQuote',
          blockType: Scratch.BlockType.REPORTER,
          text: '创建引用 [TEXT]',
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '这是一段引用文字'
            }
          }
        },
        {
          opcode: 'createCode',
          blockType: Scratch.BlockType.REPORTER,
          text: '创建代码块 [CODE]',
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'console.log("Hello");'
            }
          }
        },
        {
          opcode: 'createDivider',
          blockType: Scratch.BlockType.REPORTER,
          text: '创建分割线'
        },
        {
          opcode: 'lineBreak',
          blockType: Scratch.BlockType.REPORTER,
          text: '换行'
        },
        {
          opcode: 'multipleLineBreaks',
          blockType: Scratch.BlockType.REPORTER,
          text: '[COUNT]个换行',
          arguments: {
            COUNT: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 2
            }
          }
        }
      ],
      menus: {
        listTypes: {
          acceptReporters: true,
          items: ['无序列表', '有序列表']
        },
        headerTypes: {
          acceptReporters: true,
          items: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        }
      }
    };
  }
  textToHtml(args) {
    const text = args.TEXT;
    return text.replace(/\n/g, '<br>');
  }
  styledText(args) {
    const { TEXT, COLOR, SIZE } = args;
    return `<span style="color: ${COLOR}; font-size: ${SIZE}px">${TEXT}</span>`;
  }
  createLink(args) {
    const { TEXT, URL } = args;
    return `<a href="${URL}" target="_blank">${TEXT}</a>`;
  }
  createImage(args) {
    const { URL, WIDTH } = args;
    return `<img src="${URL}" width="${WIDTH}" style="max-width: 100%">`;
  }
  createButton(args) {
    const { TEXT, COLOR } = args;
    return `<button style="background-color: ${COLOR}; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">${TEXT}</button>`;
  }
  createList(args) {
    const { TYPE, ITEMS } = args;
    const listType = TYPE === '无序列表' ? 'ul' : 'ol';
    const items = ITEMS.split(',').map(item => 
      `<li>${item.trim()}</li>`
    ).join('');
    
    return `<${listType}>${items}</${listType}>`;
  }
  createHeader(args) {
    const { TYPE, TEXT } = args;
    return `<${TYPE}>${TEXT}</${TYPE}>`;
  }
  createQuote(args) {
    const { TEXT } = args;
    return `<blockquote style="border-left: 4px solid #ccc; margin: 10px 0; padding-left: 15px; color: #666;">${TEXT}</blockquote>`;
  }
  createCode(args) {
    const { CODE } = args;
    return `<code style="background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${CODE}</code>`;
  }
  createDivider() {
    return '<hr style="border: none; border-top: 1px solid #ccc; margin: 10px 0;">';
  }
  lineBreak() {
    return '<br>';
  }
  multipleLineBreaks(args) {
    const count = Math.max(1, Math.min(10, args.COUNT));
    return '<br>'.repeat(count);
  }
}
Scratch.extensions.register(new TextToHtml());