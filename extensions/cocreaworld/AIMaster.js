// Name: AI Master
// ID: AIMaster
// Description: Uses Pollinations API.
// By: 北海智造
// Original: 北海智造
// License: MPL-2.0
(function(Scratch) {
  'use strict';

  class AIAssistant {
    constructor() {
      this.textApiBaseUrl = 'https://text.pollinations.ai';
      this.imageApiBaseUrl = 'https://image.pollinations.ai';
      this.isLoading = false;
      this.lastResponse = '';
      this.lastError = '';
      this.lastImageUrl = '';
      this.lastAudioUrl = '';
      this.vm = null;
      this.conversationHistory = [];
      this.systemPrompt = '你是一个有帮助的AI助手。';
      this.randomSeed = null; // 随机种子，null表示随机
      this.defaultImageWidth = 1024;
      this.defaultImageHeight = 1024;
      this.defaultImageModel = 'flux';
    }

    getInfo() {
      return {
        id: 'aiassistant',
        name: 'AI助手 Pro',
        color1: '#00D4AA',
        color2: '#00B894',
        color3: '#00A885',
        blockIconURI: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="white"/>
            <path d="M21 9V7H3V9H21Z" fill="white"/>
            <path d="M18 14V12H6V14H18Z" fill="white"/>
            <path d="M15 19V17H9V19H15Z" fill="white"/>
            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="white"/>
          </svg>
        `),
        menuIconURI: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="white"/>
            <path d="M21 9V7H3V9H21Z" fill="white"/>
            <path d="M18 14V12H6V14H18Z" fill="white"/>
            <path d="M15 19V17H9V19H15Z" fill="white"/>
            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="white"/>
          </svg>
        `),
        blocks: [
          {
            opcode: 'setRandomSeed',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置随机种子为 [SEED]',
            arguments: {
              SEED: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 42
              }
            }
          },
          {
            opcode: 'clearRandomSeed',
            blockType: Scratch.BlockType.COMMAND,
            text: '清除随机种子（恢复随机）'
          },
          "---",
          {
            opcode: 'generateImage',
            blockType: Scratch.BlockType.REPORTER,
            text: '生成图片 [PROMPT]',
            arguments: {
              PROMPT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'a beautiful sunset over the ocean'
              }
            }
          },
          {
            opcode: 'generateImageAdvanced',
            blockType: Scratch.BlockType.REPORTER,
            text: '生成图片 [PROMPT] 尺寸 [WIDTH] x [HEIGHT] 模型 [MODEL]',
            arguments: {
              PROMPT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'a magical forest with glowing mushrooms'
              },
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1024
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1024
              },
              MODEL: {
                type: Scratch.ArgumentType.STRING,
                menu: 'imageModels'
              }
            }
          },
          {
            opcode: 'generateImageWithStyle',
            blockType: Scratch.BlockType.REPORTER,
            text: '生成 [STYLE] 风格图片 [PROMPT]',
            arguments: {
              STYLE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'imageStyles'
              },
              PROMPT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'a dragon flying over mountains'
              }
            }
          },
          "---",
          {
            opcode: 'generateAudio',
            blockType: Scratch.BlockType.REPORTER,
            text: '生成语音 [TEXT] 使用声音 [VOICE]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello, welcome to AI assistant'
              },
              VOICE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'voices'
              }
            }
          },
          {
            opcode: 'generateAudioSimple',
            blockType: Scratch.BlockType.REPORTER,
            text: '生成语音 [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '你好，欢迎使用AI助手'
              }
            }
          },
          "---",
          {
            opcode: 'sendMessage',
            blockType: Scratch.BlockType.REPORTER,
            text: '向AI发送消息 [MESSAGE]',
            arguments: {
              MESSAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '你好，请介绍一下你自己'
              }
            }
          },
          {
            opcode: 'sendMessageWithModel',
            blockType: Scratch.BlockType.REPORTER,
            text: '向AI发送消息 [MESSAGE] 使用模型 [MODEL]',
            arguments: {
              MESSAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '写一个简短的故事'
              },
              MODEL: {
                type: Scratch.ArgumentType.STRING,
                menu: 'textModels'
              }
            }
          },
          {
            opcode: 'sendMessageAsync',
            blockType: Scratch.BlockType.COMMAND,
            text: '异步发送消息 [MESSAGE]',
            arguments: {
              MESSAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '帮我写一首诗'
              }
            }
          },
          "---",
          {
            opcode: 'conversationChat',
            blockType: Scratch.BlockType.REPORTER,
            text: '对话式聊天 [MESSAGE]',
            arguments: {
              MESSAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '你好'
              }
            }
          },
          {
            opcode: 'clearConversation',
            blockType: Scratch.BlockType.COMMAND,
            text: '清空对话历史'
          },
          {
            opcode: 'setSystemPrompt',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置系统提示词 [PROMPT]',
            arguments: {
              PROMPT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '你是一个乐于助人的AI助手。'
              }
            }
          },
          "---",
          {
            opcode: 'isLoading',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'AI是否正在加载？'
          },
          {
            opcode: 'getLastResponse',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取最后AI回复'
          },
          {
            opcode: 'getLastImageUrl',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取最后图片URL'
          },
          {
            opcode: 'getLastAudioUrl',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取最后音频URL'
          },
          {
            opcode: 'getLastError',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取最后错误信息'
          },
          {
            opcode: 'clearHistory',
            blockType: Scratch.BlockType.COMMAND,
            text: '清空历史记录'
          },
          "---",
          {
            opcode: 'onResponseReceived',
            blockType: Scratch.BlockType.HAT,
            text: '当收到AI回复时'
          },
          {
            opcode: 'onErrorOccurred',
            blockType: Scratch.BlockType.HAT,
            text: '当发生错误时'
          },
          "---",
          {
            opcode: 'askQuestion',
            blockType: Scratch.BlockType.REPORTER,
            text: '提问 [QUESTION]',
            arguments: {
              QUESTION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '什么是人工智能？'
              }
            }
          },
          {
            opcode: 'translateText',
            blockType: Scratch.BlockType.REPORTER,
            text: '翻译文本 [TEXT] 到 [LANGUAGE]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello world'
              },
              LANGUAGE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'languages'
              }
            }
          },
          {
            opcode: 'summarizeText',
            blockType: Scratch.BlockType.REPORTER,
            text: '总结文本 [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '这是一段需要总结的长文本...'
              }
            }
          },
          {
            opcode: 'generateStory',
            blockType: Scratch.BlockType.REPORTER,
            text: '生成故事 主题 [TOPIC]',
            arguments: {
              TOPIC: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '太空冒险'
              }
            }
          },
          {
            opcode: 'createPoem',
            blockType: Scratch.BlockType.REPORTER,
            text: '创作诗歌 关于 [SUBJECT]',
            arguments: {
              SUBJECT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '春天'
              }
            }
          },
          {
            opcode: 'writeCode',
            blockType: Scratch.BlockType.REPORTER,
            text: '编写代码 [DESCRIPTION] 语言 [LANGUAGE_CODE]',
            arguments: {
              DESCRIPTION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '计算斐波那契数列'
              },
              LANGUAGE_CODE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'programmingLanguages'
              }
            }
          },
          {
            opcode: 'mathSolver',
            blockType: Scratch.BlockType.REPORTER,
            text: '解决数学问题 [PROBLEM]',
            arguments: {
              PROBLEM: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '解方程：2x + 5 = 15'
              }
            }
          },
          {
            opcode: 'explainConcept',
            blockType: Scratch.BlockType.REPORTER,
            text: '解释概念 [CONCEPT] 适合年龄 [AGE_LEVEL]',
            arguments: {
              CONCEPT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '光合作用'
              },
              AGE_LEVEL: {
                type: Scratch.ArgumentType.STRING,
                menu: 'ageLevels'
              }
            }
          },
          {
            opcode: 'brainstormIdeas',
            blockType: Scratch.BlockType.REPORTER,
            text: '头脑风暴 [TOPIC] 生成 [COUNT] 个想法',
            arguments: {
              TOPIC: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '环保项目'
              },
              COUNT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 5
              }
            }
          },
          "---",
          {
            opcode: 'getWordCount',
            blockType: Scratch.BlockType.REPORTER,
            text: '文本 [TEXT] 的字数',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '这是一个测试文本'
              }
            }
          },
          {
            opcode: 'extractKeywords',
            blockType: Scratch.BlockType.REPORTER,
            text: '提取关键词 [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '人工智能和机器学习是当今热门的技术'
              }
            }
          },
          {
            opcode: 'sentimentAnalysis',
            blockType: Scratch.BlockType.REPORTER,
            text: '情感分析 [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '今天天气真好，我很开心'
              }
            }
          },
          {
            opcode: 'checkGrammar',
            blockType: Scratch.BlockType.REPORTER,
            text: '语法检查 [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'I go to school yesterday.'
              }
            }
          },
          {
            opcode: 'generateRandomName',
            blockType: Scratch.BlockType.REPORTER,
            text: '生成随机名称 [CATEGORY]',
            arguments: {
              CATEGORY: {
                type: Scratch.ArgumentType.STRING,
                menu: 'nameCategories'
              }
            }
          },
          {
            opcode: 'calculateReadingTime',
            blockType: Scratch.BlockType.REPORTER,
            text: '阅读时间 [TEXT] 分钟',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '这是一段需要计算阅读时间的文本。'
              }
            }
          },
          {
            opcode: 'textToEmoji',
            blockType: Scratch.BlockType.REPORTER,
            text: '文本转表情 [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'I love pizza'
              }
            }
          },
          {
            opcode: 'findSimilarity',
            blockType: Scratch.BlockType.REPORTER,
            text: '文本相似度 [TEXT1] 和 [TEXT2]',
            arguments: {
              TEXT1: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'The cat sits on the mat'
              },
              TEXT2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'A cat is sitting on a mat'
              }
            }
          }
        ],
        menus: {
          textModels: {
            acceptReporters: true,
            items: ['openai', 'claude', 'gemini', 'llama', 'mistral']
          },
          imageModels: {
            acceptReporters: true,
            items: ['flux', 'dreamshaper', 'anything', 'openjourney', 'realistic']
          },
          imageStyles: {
            acceptReporters: true,
            items: ['动漫', '写实', '梦幻', '科幻', '油画', '水彩', '素描', '像素']
          },
          voices: {
            acceptReporters: true,
            items: ['nova', 'alloy', 'echo', 'fable', 'onyx', 'shimmer']
          },
          languages: {
            acceptReporters: true,
            items: ['中文', '英文', '日文', '韩文', '法文', '德文', '西班牙文', '俄文', '意大利文', '葡萄牙文']
          },
          programmingLanguages: {
            acceptReporters: true,
            items: ['Python', 'JavaScript', 'Java', 'C++', 'HTML/CSS', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin']
          },
          ageLevels: {
            acceptReporters: true,
            items: ['儿童(5-8岁)', '少年(9-12岁)', '青少年(13-17岁)', '成年人', '专家']
          },
          nameCategories: {
            acceptReporters: true,
            items: ['人物', '宠物', '品牌', '科幻', '奇幻', '可爱', '专业']
          }
        }
      };
    }

    onInit(vm) {
      this.vm = vm;
    }

    // 设置随机种子
    setRandomSeed(args) {
      this.randomSeed = Math.floor(args.SEED);
    }

    clearRandomSeed() {
      this.randomSeed = null;
    }

    // 构建图像生成URL
    buildImageUrl(prompt, width = null, height = null, model = null, style = null) {
      let finalPrompt = prompt;
      
      // 如果指定了风格，添加到提示词中
      if (style) {
        const styleMap = {
          '动漫': 'anime style',
          '写实': 'realistic style',
          '梦幻': 'dreamy ethereal style',
          '科幻': 'sci-fi futuristic style',
          '油画': 'oil painting style',
          '水彩': 'watercolor painting style',
          '素描': 'sketch drawing style',
          '像素': 'pixel art style'
        };
        if (styleMap[style]) {
          finalPrompt = `${prompt}, ${styleMap[style]}`;
        }
      }
      
      const encodedPrompt = encodeURIComponent(finalPrompt);
      let url = `${this.imageApiBaseUrl}/prompt/${encodedPrompt}`;
      
      const params = new URLSearchParams();
      
      // 添加尺寸参数
      const finalWidth = width || this.defaultImageWidth;
      const finalHeight = height || this.defaultImageHeight;
      params.append('width', finalWidth);
      params.append('height', finalHeight);
      
      // 添加模型参数
      const finalModel = model || this.defaultImageModel;
      params.append('model', finalModel);
      
      // 无水印
      params.append('nologo', 'true');
      
      // 启用质量增强
      params.append('enhance', 'true');
      
      // 添加安全过滤
      params.append('safe', 'true');
      
      // 添加随机种子（如果设置了）
      if (this.randomSeed !== null) {
        params.append('seed', this.randomSeed);
      }
      
      const queryString = params.toString();
      if (queryString) {
        url += '?' + queryString;
      }
      
      return url;
    }

    // 构建音频生成URL
    buildAudioUrl(text, voice = 'nova') {
      const encodedText = encodeURIComponent(text);
      return `${this.textApiBaseUrl}/${encodedText}?model=openai-audio&voice=${voice}`;
    }

    // 图像生成
    async generateImage(args) {
      this.isLoading = true;
      this.lastError = '';
      
      try {
        const url = this.buildImageUrl(args.PROMPT);
        this.lastImageUrl = url;
        console.log('生成图片URL:', url);
        
        // 验证图片是否可访问（可选）
        // 直接返回URL，Scratch用户可以将其用于"将URL设置为..."积木
        
        if (this.vm && this.vm.runtime) {
          this.vm.runtime.startHats('aiassistant_onResponseReceived');
        }
        
        return url;
      } catch (error) {
        this.lastError = error.message;
        console.error('图片生成错误:', error);
        
        if (this.vm && this.vm.runtime) {
          this.vm.runtime.startHats('aiassistant_onErrorOccurred');
        }
        
        return `错误: ${error.message}`;
      } finally {
        this.isLoading = false;
      }
    }

    async generateImageAdvanced(args) {
      this.isLoading = true;
      this.lastError = '';
      
      try {
        const url = this.buildImageUrl(
          args.PROMPT, 
          args.WIDTH, 
          args.HEIGHT, 
          args.MODEL
        );
        this.lastImageUrl = url;
        console.log('生成图片URL (高级):', url);
        
        if (this.vm && this.vm.runtime) {
          this.vm.runtime.startHats('aiassistant_onResponseReceived');
        }
        
        return url;
      } catch (error) {
        this.lastError = error.message;
        console.error('图片生成错误:', error);
        
        if (this.vm && this.vm.runtime) {
          this.vm.runtime.startHats('aiassistant_onErrorOccurred');
        }
        
        return `错误: ${error.message}`;
      } finally {
        this.isLoading = false;
      }
    }

    async generateImageWithStyle(args) {
      this.isLoading = true;
      this.lastError = '';
      
      try {
        const url = this.buildImageUrl(
          args.PROMPT, 
          null, 
          null, 
          null, 
          args.STYLE
        );
        this.lastImageUrl = url;
        console.log('生成图片URL (带风格):', url);
        
        if (this.vm && this.vm.runtime) {
          this.vm.runtime.startHats('aiassistant_onResponseReceived');
        }
        
        return url;
      } catch (error) {
        this.lastError = error.message;
        console.error('图片生成错误:', error);
        
        if (this.vm && this.vm.runtime) {
          this.vm.runtime.startHats('aiassistant_onErrorOccurred');
        }
        
        return `错误: ${error.message}`;
      } finally {
        this.isLoading = false;
      }
    }

    // 音频生成
    async generateAudio(args) {
      this.isLoading = true;
      this.lastError = '';
      
      try {
        const url = this.buildAudioUrl(args.TEXT, args.VOICE);
        this.lastAudioUrl = url;
        console.log('生成音频URL:', url);
        
        if (this.vm && this.vm.runtime) {
          this.vm.runtime.startHats('aiassistant_onResponseReceived');
        }
        
        return url;
      } catch (error) {
        this.lastError = error.message;
        console.error('音频生成错误:', error);
        
        if (this.vm && this.vm.runtime) {
          this.vm.runtime.startHats('aiassistant_onErrorOccurred');
        }
        
        return `错误: ${error.message}`;
      } finally {
        this.isLoading = false;
      }
    }

    async generateAudioSimple(args) {
      this.isLoading = true;
      this.lastError = '';
      
      try {
        const url = this.buildAudioUrl(args.TEXT, 'nova');
        this.lastAudioUrl = url;
        console.log('生成音频URL:', url);
        
        if (this.vm && this.vm.runtime) {
          this.vm.runtime.startHats('aiassistant_onResponseReceived');
        }
        
        return url;
      } catch (error) {
        this.lastError = error.message;
        console.error('音频生成错误:', error);
        
        if (this.vm && this.vm.runtime) {
          this.vm.runtime.startHats('aiassistant_onErrorOccurred');
        }
        
        return `错误: ${error.message}`;
      } finally {
        this.isLoading = false;
      }
    }

    // 文本生成API请求
    async makeTextRequest(message, model = 'openai') {
      if (this.isLoading) {
        throw new Error('上一个请求还在处理中，请稍后再试');
      }

      this.isLoading = true;
      this.lastError = '';

      try {
        const encodedMessage = encodeURIComponent(message);
        const url = `${this.textApiBaseUrl}/${encodedMessage}?model=${model}`;
        
        console.log('发送文本请求:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'text/plain',
            'Content-Type': 'text/plain'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP错误: ${response.status}`);
        }

        const text = await response.text();
        this.lastResponse = text.trim();
        
        console.log('文本回复:', this.lastResponse);
        
        if (this.vm && this.vm.runtime) {
          this.vm.runtime.startHats('aiassistant_onResponseReceived');
        }
        
        return this.lastResponse;
      } catch (error) {
        this.lastError = error.message;
        console.error('文本请求错误:', error);
        
        if (this.vm && this.vm.runtime) {
          this.vm.runtime.startHats('aiassistant_onErrorOccurred');
        }
        
        throw error;
      } finally {
        this.isLoading = false;
      }
    }

    // 对话式聊天
    async conversationChat(args) {
      this.conversationHistory.push({ role: 'user', content: args.MESSAGE });
      
      let fullPrompt = this.systemPrompt + '\n\n对话历史：\n';
      const recentHistory = this.conversationHistory.slice(-10);
      recentHistory.forEach(msg => {
        fullPrompt += `${msg.role === 'user' ? '用户' : 'AI'}: ${msg.content}\n`;
      });
      fullPrompt += `\nAI: `;
      
      try {
        const response = await this.makeTextRequest(fullPrompt);
        this.conversationHistory.push({ role: 'assistant', content: response });
        return response;
      } catch (error) {
        return `错误: ${error.message}`;
      }
    }

    clearConversation() {
      this.conversationHistory = [];
      this.systemPrompt = '你是一个有帮助的AI助手。';
    }

    setSystemPrompt(args) {
      this.systemPrompt = args.PROMPT;
    }

    // 原有文本功能
    async sendMessage(args) {
      try {
        return await this.makeTextRequest(args.MESSAGE);
      } catch (error) {
        return `错误: ${error.message}`;
      }
    }

    async sendMessageWithModel(args) {
      try {
        return await this.makeTextRequest(args.MESSAGE, args.MODEL);
      } catch (error) {
        return `错误: ${error.message}`;
      }
    }

    async sendMessageAsync(args) {
      try {
        await this.makeTextRequest(args.MESSAGE);
      } catch (error) {
        console.error('异步请求错误:', error);
      }
    }

    isLoading() {
      return this.isLoading;
    }

    getLastResponse() {
      return this.lastResponse || '暂无回复';
    }

    getLastImageUrl() {
      return this.lastImageUrl || '';
    }

    getLastAudioUrl() {
      return this.lastAudioUrl || '';
    }

    getLastError() {
      return this.lastError || '暂无错误';
    }

    clearHistory() {
      this.lastResponse = '';
      this.lastError = '';
      this.lastImageUrl = '';
      this.lastAudioUrl = '';
    }

    onResponseReceived() {}
    onErrorOccurred() {}

    async askQuestion(args) {
      const prompt = `请详细回答以下问题：${args.QUESTION}`;
      try {
        return await this.makeTextRequest(prompt);
      } catch (error) {
        return `错误: ${error.message}`;
      }
    }

    async translateText(args) {
      const langMap = {
        '中文': 'Chinese', '英文': 'English', '日文': 'Japanese',
        '韩文': 'Korean', '法文': 'French', '德文': 'German',
        '西班牙文': 'Spanish', '俄文': 'Russian', '意大利文': 'Italian',
        '葡萄牙文': 'Portuguese'
      };
      const prompt = `请将以下文本准确翻译成${args.LANGUAGE}（${langMap[args.LANGUAGE]}），只返回翻译结果：\n${args.TEXT}`;
      try {
        return await this.makeTextRequest(prompt);
      } catch (error) {
        return `错误: ${error.message}`;
      }
    }

    async summarizeText(args) {
      const prompt = `请用3-5句话总结以下文本的核心内容：\n${args.TEXT}`;
      try {
        return await this.makeTextRequest(prompt);
      } catch (error) {
        return `错误: ${error.message}`;
      }
    }

    async generateStory(args) {
      const prompt = `请根据主题"${args.TOPIC}"创作一个吸引人的短篇故事：`;
      try {
        return await this.makeTextRequest(prompt);
      } catch (error) {
        return `错误: ${error.message}`;
      }
    }

    async createPoem(args) {
      const prompt = `请以"${args.SUBJECT}"为主题创作一首优美的诗歌：`;
      try {
        return await this.makeTextRequest(prompt);
      } catch (error) {
        return `错误: ${error.message}`;
      }
    }

    async writeCode(args) {
      const prompt = `请用${args.LANGUAGE_CODE}编写代码实现：${args.DESCRIPTION}。只返回代码，不要解释：`;
      try {
        return await this.makeTextRequest(prompt);
      } catch (error) {
        return `错误: ${error.message}`;
      }
    }

    async mathSolver(args) {
      const prompt = `请解决以下数学问题，并展示解题步骤：${args.PROBLEM}`;
      try {
        return await this.makeTextRequest(prompt);
      } catch (error) {
        return `错误: ${error.message}`;
      }
    }

    async explainConcept(args) {
      const prompt = `请用${args.AGE_LEVEL}能理解的方式解释：${args.CONCEPT}`;
      try {
        return await this.makeTextRequest(prompt);
      } catch (error) {
        return `错误: ${error.message}`;
      }
    }

    async brainstormIdeas(args) {
      const prompt = `请针对主题"${args.TOPIC}"生成${args.COUNT}个创意想法，用列表形式呈现：`;
      try {
        return await this.makeTextRequest(prompt);
      } catch (error) {
        return `错误: ${error.message}`;
      }
    }

    async checkGrammar(args) {
      const prompt = `请检查以下文本的语法错误并提供修正版本：\n${args.TEXT}\n\n返回格式：错误列表和修正后的文本`;
      try {
        return await this.makeTextRequest(prompt);
      } catch (error) {
        return `错误: ${error.message}`;
      }
    }

    async textToEmoji(args) {
      const prompt = `请将以下文本转换为表情符号版本，保持原意：${args.TEXT}`;
      try {
        return await this.makeTextRequest(prompt);
      } catch (error) {
        // 备用方案：简单替换
        const emojiMap = {
          'love': '❤️', 'happy': '😊', 'sad': '😢', 'good': '👍',
          'pizza': '🍕', 'cat': '🐱', 'dog': '🐶', 'sun': '☀️'
        };
        let result = args.TEXT.toLowerCase();
        for (let [word, emoji] of Object.entries(emojiMap)) {
          result = result.replace(new RegExp(word, 'g'), emoji);
        }
        return result;
      }
    }

    // 本地文本处理功能
    getWordCount(args) {
      const text = args.TEXT;
      if (!text) return 0;
      const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
      const englishWords = text.split(/\s+/).filter(word => 
        word.length > 0 && !word.match(/[\u4e00-\u9fa5]/)
      );
      return chineseChars.length + englishWords.length;
    }

    extractKeywords(args) {
      const text = args.TEXT;
      if (!text) return '';
      const words = text.split(/\s+/).filter(word => word.length > 2);
      const uniqueWords = [...new Set(words)];
      return uniqueWords.slice(0, 5).join(', ');
    }

    sentimentAnalysis(args) {
      const text = args.TEXT;
      if (!text) return '未知';
      const positiveWords = ['好', '开心', '高兴', '喜欢', '爱', '棒', '优秀', '完美', '美丽', '伟大', 'good', 'happy', 'love', 'great', 'excellent'];
      const negativeWords = ['坏', '伤心', '难过', '讨厌', '恨', '差', '糟糕', '失败', 'bad', 'sad', 'hate', 'terrible', 'awful'];
      
      let positiveCount = 0;
      let negativeCount = 0;
      
      positiveWords.forEach(word => {
        const regex = new RegExp(word, 'gi');
        const matches = text.match(regex);
        if (matches) positiveCount += matches.length;
      });
      
      negativeWords.forEach(word => {
        const regex = new RegExp(word, 'gi');
        const matches = text.match(regex);
        if (matches) negativeCount += matches.length;
      });
      
      if (positiveCount > negativeCount) return '积极 😊';
      if (negativeCount > positiveCount) return '消极 😔';
      return '中性 😐';
    }

    generateRandomName(args) {
      const categories = {
        '人物': ['小明', '小红', '小华', '李华', '张伟', '王芳', '刘强', '陈静'],
        '宠物': ['旺财', '咪咪', '豆豆', '球球', '毛毛', '点点', '花花', '小黑'],
        '品牌': ['智创', '星云', '飞跃', '创新者', '未来科技', '梦想家', '卓越', '先锋'],
        '科幻': ['星尘', '银河', '新星', '泰坦', '奥德赛', '猎户座', '仙女座', '天狼星'],
        '奇幻': ['霜刃', '星光', '暮光', '风暴', '龙翼', '月影', '火焰', '冰心'],
        '可爱': ['布丁', '棉花糖', '小糯米', '汤圆', '奶茶', '果冻', '泡泡', '糖糖'],
        '专业': ['智研', '卓越', '宏图', '致远', '博达', '信诚', '华威', '恒通']
      };
      
      const categoryList = categories[args.CATEGORY] || categories['人物'];
      return categoryList[Math.floor(Math.random() * categoryList.length)];
    }

    calculateReadingTime(args) {
      const text = args.TEXT;
      if (!text) return 0;
      const wordCount = this.getWordCount({ TEXT: text });
      const minutes = Math.ceil(wordCount / 200);
      return minutes;
    }

    findSimilarity(args) {
      const text1 = args.TEXT1.toLowerCase();
      const text2 = args.TEXT2.toLowerCase();
      
      const words1 = new Set(text1.split(/\s+/));
      const words2 = new Set(text2.split(/\s+/));
      
      const intersection = new Set([...words1].filter(x => words2.has(x)));
      const union = new Set([...words1, ...words2]);
      
      const similarity = intersection.size / union.size;
      const percentage = Math.round(similarity * 100);
      
      if (percentage > 70) return '非常相似 (' + percentage + '%)';
      if (percentage > 40) return '比较相似 (' + percentage + '%)';
      return '不太相似 (' + percentage + '%)';
    }
  }

  const extension = new AIAssistant();
  Scratch.extensions.register(extension);
})(Scratch);