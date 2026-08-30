(function (_Scratch) {
  const { ArgumentType, BlockType, Cast, translate, extensions, runtime } = _Scratch;
  'use strict';

  translate.setup({
    zh: {
      'n': 'Komii的音频播放器2.0',
      'load': '加载 [URL] 并命名为 [NAME]',
      'play': '播放音频 [NAME]',
      'playWithWait': '播放 [NAME] 并 [MODE]',
      'volume': '设置音频 [NAME] 音量为 [VOLUME]%',
      'playing?': '音频 [NAME] 正在播放?',
      'control': '[ACTION] 音频 [NAME]',
      'controlAll': '[ACTION] 所有音频',
      'getInfo': '音频 [NAME] 的 [INFO]',
      'setPlaybackRate': '设置音频 [NAME] 倍速为 [SPEED]x',
      'seekTo': '音频 [NAME] 跳转到 [TIME] 秒',
      'getFrequencyData': '获取音频 [NAME] [NUM] 项频率数据',
      'getFrequencyAtIndex': '音频 [NAME] 第 [INDEX] 项频率值',
      'getAverageVolume': '音频 [NAME] 平均音量',
      'onLoaded': '当音频 [NAME] 加载完成',
      'notFound': '未找到',
      'action.stop': '停止',
      'action.pause': '暂停',
      'action.resume': '恢复',
      'info.volume': '音量',
      'info.duration': '总时长(s)',
      'info.currentTime': '当前时长(s)',
      'info.playbackRate': '倍速',
      'sep.control': '控制',
      'sep.settings': '设置',
      'sep.info': '信息',
      'sep.spectrum': '频谱',
      'sep.events': '加载',
      'audioInfo.names': '名称列表',
      'audioInfo.count': '数量',
      'audioInfo.urls': 'URL列表',
      'audioInfo.status': '状态列表',
      'audioInfo.volumes': '音量列表',
      'audioInfo.durations': '时长列表',
      'audioInfo.json': '完整信息(JSON)',
      'getAllAudioInfo': '获取所有音频的 [INFO]',
      'wait.nowait': '不等待',
      'wait.wait': '等待播放完成'
    },
    en: {
      'n': "Komii's Audio Player2.0",
      'load': 'Load [URL] and name it [NAME]',
      'play': 'Play audio [NAME]',
      'playWithWait': 'Play [NAME] and [MODE]',
      'volume': 'Set audio [NAME] volume to [VOLUME]%',
      'playing?': 'Is audio [NAME] playing?',
      'control': '[ACTION] audio [NAME]',
      'controlAll': '[ACTION] all audio',
      'getInfo': '[INFO] of audio [NAME]',
      'setPlaybackRate': 'Set audio [NAME] speed to [SPEED]x',
      'seekTo': 'Audio [NAME] seek to [TIME] sec',
      'getFrequencyData': 'Get [NUM] frequency data of audio [NAME]',
      'getFrequencyAtIndex': 'Audio [NAME] frequency at [INDEX]',
      'getAverageVolume': 'Audio [NAME] average volume',
      'onLoaded': 'When audio [NAME] loaded',
      'notFound': 'not found',
      'action.stop': 'Stop',
      'action.pause': 'Pause',
      'action.resume': 'Resume',
      'info.volume': 'volume',
      'info.duration': 'duration(s)',
      'info.currentTime': 'current time(s)',
      'info.playbackRate': 'playback rate',
      'sep.control': 'Control',
      'sep.settings': 'Settings',
      'sep.info': 'Info',
      'sep.spectrum': 'Spectrum',
      'sep.events': 'Load',
      'audioInfo.names': 'name list',
      'audioInfo.count': 'count',
      'audioInfo.urls': 'URL list',
      'audioInfo.status': 'status list',
      'audioInfo.volumes': 'volume list',
      'audioInfo.durations': 'duration list',
      'audioInfo.json': 'full info (JSON)',
      'getAllAudioInfo': 'Get [INFO] of all audios',
      'wait.nowait': 'do not wait',
      'wait.wait': 'wait until finished'
    }
  });

  class AudioPlayerExtension {
    constructor() {
      this.audioElements = new Map();
      this.audioNames = new Map();
      this.audioContexts = new Map();
      this.analysers = new Map();
      this.gainNodes = new Map();
      this.sourceNodes = new Map();
      this.loadedCallbacks = new Map();
      this.runtime = null;
      this.audioUrls = new Map();
    }

    getInfo() {
      return {
        id: 'komiiAP',
        name: translate({ id: 'n' }),
        blockIconURI: "data:image/svg+xml;charset=utf-8;base64,CjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzc0IiBoZWlnaHQ9IjM3NCIgdmlld0JveD0iMCwwLDM3NCwzNzQiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMzMsNykiPjxnIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIj48cGF0aCBkPSJNMjEzLjUsMjU3LjV2LTcyLjEyNWMwLC01OC44MTgzMyA0Ny42ODE2NywtMTA2LjUgMTA2LjUsLTEwNi41YzU4LjgxODMzLDAgMTA2LjUsNDcuNjgxNjcgMTA2LjUsMTA2LjV2NzIuMTI1YzAsMTQuNzA0NTggLTExLjkyMDQyLDI2LjYyNSAtMjYuNjI1LDI2LjYyNWgtMjYuNjI1Yy0xNC43MDQ1OCwwIC0yNi42MjUsLTExLjkyMDQyIC0yNi42MjUsLTI2LjYyNXYtMjYuMTg3NWMwLC0xNC43MDQ1OCAxMS45MjA0MiwtMjYuNjI1IDI2LjYyNSwtMjYuNjI1aDI2LjYyNXYtMTkuMzEyNWMwLC00NC4xMTM3NCAtMzUuNzYxMjYsLTc5Ljg3NSAtNzkuODc1LC03OS44NzVjLTQ0LjExMzc0LDAgLTc5Ljg3NSwzNS43NjEyNiAtNzkuODc1LDc5Ljg3NXYxOS4zMTI1aDI2LjYyNWMxNC43MDQ1OCwwIDI2LjYyNSwxMS45MjA0MiAyNi42MjUsMjYuNjI1djI2LjE4NzVjMCwxNC43MDQ1OCAtMTEuOTIwNDIsMjYuNjI1IC0yNi42MjUsMjYuNjI1aC0yNi42MjVjLTE0LjcwNDU4LDAgLTI2LjYyNSwtMTEuOTIwNDIgLTI2LjYyNSwtMjYuNjI1eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTEzMywzNjd2LTM3NGgzNzR2Mzc0eiIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIi8+PC9nPjwvZz48L3N2Zz4=",
        color1: "#63C5DA",
        color2: "#2874A6",
        blocks: [
          "---" + translate({ id: 'sep.events' }),
          { opcode: 'loadAudio', blockType: BlockType.COMMAND, text: translate({ id: 'load' }), arguments: { URL: { type: ArgumentType.STRING, defaultValue: "https://m.ccw.site/user_projects_assets/7b58df7b63d19a1a67b1ddcd050c25bb.mp3" }, NAME: { type: ArgumentType.STRING, defaultValue: "我的音频" } } },
          { opcode: 'onLoaded', blockType: BlockType.HAT, text: translate({ id: 'onLoaded' }), arguments: { NAME: { type: ArgumentType.STRING, defaultValue: "我的音频" } } },
          "---" + translate({ id: 'sep.control' }),
          { opcode: 'play', blockType: BlockType.COMMAND, text: translate({ id: 'play' }), arguments: { NAME: { type: ArgumentType.STRING, defaultValue: "我的音频" } } },
          { opcode: 'playWithWait', blockType: BlockType.COMMAND, text: translate({ id: 'playWithWait' }), arguments: { NAME: { type: ArgumentType.STRING, defaultValue: "我的音频" }, MODE: { type: ArgumentType.STRING, menu: 'waitMenu', defaultValue: 'nowait' } } },
          { opcode: 'control', blockType: BlockType.COMMAND, text: translate({ id: 'control' }), arguments: { ACTION: { type: ArgumentType.STRING, menu: 'actionMenu', defaultValue: 'stop' }, NAME: { type: ArgumentType.STRING, defaultValue: "我的音频" } } },
          { opcode: 'controlAll', blockType: BlockType.COMMAND, text: translate({ id: 'controlAll' }), arguments: { ACTION: { type: ArgumentType.STRING, menu: 'actionMenu', defaultValue: 'stop' } } },
          "---" + translate({ id: 'sep.settings' }),
          { opcode: 'setVolume', blockType: BlockType.COMMAND, text: translate({ id: 'volume' }), arguments: { NAME: { type: ArgumentType.STRING, defaultValue: "我的音频" }, VOLUME: { type: ArgumentType.NUMBER, defaultValue: 50, min: 0, max: 100 } } },
          { opcode: 'setPlaybackRate', blockType: BlockType.COMMAND, text: translate({ id: 'setPlaybackRate' }), arguments: { NAME: { type: ArgumentType.STRING, defaultValue: "我的音频" }, SPEED: { type: ArgumentType.NUMBER, defaultValue: 1, min: 0.25, max: 4 } } },
          { opcode: 'seekTo', blockType: BlockType.COMMAND, text: translate({ id: 'seekTo' }), arguments: { NAME: { type: ArgumentType.STRING, defaultValue: "我的音频" }, TIME: { type: ArgumentType.NUMBER, defaultValue: 0 } } },
          "---" + translate({ id: 'sep.info' }),
          { opcode: 'info', blockType: BlockType.REPORTER, text: translate({ id: 'getInfo' }), arguments: { INFO: { type: ArgumentType.STRING, menu: 'infoMenu', defaultValue: 'volume' }, NAME: { type: ArgumentType.STRING, defaultValue: "我的音频" } } },
          { opcode: 'isPlaying', blockType: BlockType.BOOLEAN, text: translate({ id: 'playing?' }), arguments: { NAME: { type: ArgumentType.STRING, defaultValue: "我的音频" } } },
          { opcode: 'getAllAudioInfo', blockType: BlockType.REPORTER, text: translate({ id: 'getAllAudioInfo' }), arguments: { INFO: { type: ArgumentType.STRING, menu: 'audioInfoMenu', defaultValue: 'names' } } },
          "---" + translate({ id: 'sep.spectrum' }),
          { opcode: 'getFrequencyData', blockType: BlockType.REPORTER, text: translate({ id: 'getFrequencyData' }), arguments: { NAME: { type: ArgumentType.STRING, defaultValue: "我的音频" }, NUM: { type: ArgumentType.NUMBER, defaultValue: 128, min: 1, max: 32768 } } },
          { opcode: 'getFrequencyAtIndex', blockType: BlockType.REPORTER, text: translate({ id: 'getFrequencyAtIndex' }), arguments: { NAME: { type: ArgumentType.STRING, defaultValue: "我的音频" }, INDEX: { type: ArgumentType.NUMBER, defaultValue: 0, min: 0 } } },
          { opcode: 'getAverageVolume', blockType: BlockType.REPORTER, text: translate({ id: 'getAverageVolume' }), arguments: { NAME: { type: ArgumentType.STRING, defaultValue: "我的音频" } } }
        ],
        menus: {
          actionMenu: { items: [{ text: translate({ id: 'action.stop' }), value: 'stop' }, { text: translate({ id: 'action.pause' }), value: 'pause' }, { text: translate({ id: 'action.resume' }), value: 'resume' }] },
          infoMenu: { items: [{ text: translate({ id: 'info.volume' }), value: 'volume' }, { text: translate({ id: 'info.duration' }), value: 'duration' }, { text: translate({ id: 'info.currentTime' }), value: 'currentTime' }, { text: translate({ id: 'info.playbackRate' }), value: 'playbackRate' }] },
          audioInfoMenu: {
            items: [
              { text: translate({ id: 'audioInfo.names' }), value: 'names' },
              { text: translate({ id: 'audioInfo.count' }), value: 'count' },
              { text: translate({ id: 'audioInfo.urls' }), value: 'urls' },
              { text: translate({ id: 'audioInfo.status' }), value: 'status' },
              { text: translate({ id: 'audioInfo.volumes' }), value: 'volumes' },
              { text: translate({ id: 'audioInfo.durations' }), value: 'durations' },
              { text: translate({ id: 'audioInfo.json' }), value: 'json' }
            ]
          },
          waitMenu: {
            items: [
              { text: translate({ id: 'wait.nowait' }), value: 'nowait' },
              { text: translate({ id: 'wait.wait' }), value: 'wait' }
            ]
          }
        }
      };
    }

    _getAudio(name) { return this.audioElements.get(name) || null; }
    _getAnalyser(name) { return this.analysers.get(name) || null; }
    
    _ensureFftSize(name, targetBins) { 
      const analyser = this._getAnalyser(name); 
      if (!analyser) return; 
      const requiredFft = targetBins * 2; 
      if (analyser.fftSize < requiredFft) { 
        let fft = 32; 
        while (fft < requiredFft) fft *= 2; 
        fft = Math.min(fft, 32768); 
        analyser.fftSize = fft; 
      } 
    }
    
    _cleanupAudio(name) { 
      const audio = this.audioElements.get(name); 
      if (audio) { 
        audio.pause(); 
        audio.currentTime = 0; 
      } 
      const source = this.sourceNodes.get(name);
      const gain = this.gainNodes.get(name);
      const analyser = this.analysers.get(name);
      if (source) { try { source.disconnect(); } catch(e) {} }
      if (gain) { try { gain.disconnect(); } catch(e) {} }
      if (analyser) { try { analyser.disconnect(); } catch(e) {} }
      this.audioElements.delete(name); 
      this.audioNames.delete(name); 
      this.audioContexts.delete(name); 
      this.analysers.delete(name); 
      this.gainNodes.delete(name); 
      this.sourceNodes.delete(name); 
      this.loadedCallbacks.delete(name);
      this.audioUrls.delete(name);
    }

    loadAudio(args) { 
      const url = Cast.toString(args.URL); 
      const name = Cast.toString(args.NAME) || '我的音频'; 
      if (!url) return; 
      if (this.audioElements.has(name)) this._cleanupAudio(name); 
      const audio = new Audio(url); 
      audio.crossOrigin = 'anonymous'; 
      audio.preload = 'auto'; 
      this.audioElements.set(name, audio); 
      this.audioNames.set(name, name);
      this.audioUrls.set(name, url);
      try { 
        const audioContext = new (window.AudioContext || window.webkitAudioContext)(); 
        const analyser = audioContext.createAnalyser(); 
        analyser.fftSize = 256; 
        analyser.smoothingTimeConstant = 0.8; 
        const gainNode = audioContext.createGain(); 
        const sourceNode = audioContext.createMediaElementSource(audio); 
        sourceNode.connect(gainNode); 
        gainNode.connect(analyser); 
        analyser.connect(audioContext.destination); 
        this.audioContexts.set(name, audioContext); 
        this.analysers.set(name, analyser); 
        this.gainNodes.set(name, gainNode); 
        this.sourceNodes.set(name, sourceNode); 
      } catch (e) {} 
      const onLoaded = () => { 
        this.loadedCallbacks.set(name, true); 
        if (this.runtime) { 
          this.runtime.startHats('komiiAP_onLoaded', { NAME: name }); 
        } 
      }; 
      if (audio.readyState >= 2) { 
        setTimeout(onLoaded, 0); 
      } else { 
        audio.addEventListener('loadedmetadata', onLoaded); 
      } 
      audio.addEventListener('ended', () => { 
        this._cleanupAudio(name); 
      }); 
      audio.addEventListener('error', () => { 
        this._cleanupAudio(name); 
      }); 
    }

    play(args) { 
      const name = Cast.toString(args.NAME); 
      const audio = this._getAudio(name); 
      if (!audio) return; 
      audio.play().catch(() => {}); 
    }

    playWithWait(args) {
      const name = Cast.toString(args.NAME);
      const mode = Cast.toString(args.MODE);
      const audio = this._getAudio(name);
      if (!audio) return;
      
      if (mode === 'nowait') {
        audio.play().catch(() => {});
        return;
      }
      
      return new Promise((resolve) => {
        audio.play().catch(() => resolve());
        if (audio.ended) { resolve(); return; }
        const onEnded = () => { audio.removeEventListener('ended', onEnded); resolve(); };
        audio.addEventListener('ended', onEnded);
      });
    }

    control(args) { 
      const name = Cast.toString(args.NAME); 
      const action = Cast.toString(args.ACTION); 
      const audio = this._getAudio(name); 
      if (!audio) return; 
      if (action === 'stop') { 
        audio.pause(); 
        audio.currentTime = 0; 
        this._cleanupAudio(name); 
      } else if (action === 'pause') { 
        audio.pause(); 
      } else if (action === 'resume') { 
        audio.play().catch(() => {}); 
      } 
    }

    controlAll(args) { 
      const action = Cast.toString(args.ACTION); 
      const names = Array.from(this.audioElements.keys()); 
      names.forEach(name => { 
        const audio = this.audioElements.get(name); 
        if (!audio) return; 
        if (action === 'stop') { 
          audio.pause(); 
          audio.currentTime = 0; 
          this._cleanupAudio(name); 
        } else if (action === 'pause') { 
          audio.pause(); 
        } else if (action === 'resume') { 
          audio.play().catch(() => {}); 
        } 
      }); 
    }

    setVolume(args) { 
      const name = Cast.toString(args.NAME); 
      const audio = this._getAudio(name); 
      if (!audio) return; 
      const volume = Math.min(1, Math.max(0, Cast.toNumber(args.VOLUME) / 100)); 
      const gainNode = this.gainNodes.get(name); 
      if (gainNode) gainNode.gain.value = volume; 
      audio.volume = volume; 
    }

    setPlaybackRate(args) { 
      const name = Cast.toString(args.NAME); 
      const audio = this._getAudio(name); 
      if (!audio) return; 
      let speed = Cast.toNumber(args.SPEED); 
      if (isNaN(speed)) speed = 1; 
      speed = Math.max(0.25, Math.min(4, speed)); 
      audio.playbackRate = speed; 
    }

    seekTo(args) { 
      const name = Cast.toString(args.NAME); 
      const audio = this._getAudio(name); 
      if (!audio) return; 
      let time = Cast.toNumber(args.TIME); 
      if (isNaN(time)) time = 0; 
      time = Math.max(0, Math.min(time, audio.duration || 0)); 
      audio.currentTime = time; 
    }

    isPlaying(args) { 
      const name = Cast.toString(args.NAME); 
      const audio = this._getAudio(name); 
      if (!audio) return false; 
      return !audio.paused; 
    }

    info(args) { 
      const name = Cast.toString(args.NAME); 
      const audio = this._getAudio(name); 
      if (!audio) return translate({ id: 'notFound' }); 
      const info = Cast.toString(args.INFO); 
      if (info === 'volume') return Math.round(audio.volume * 100); 
      if (info === 'duration') { 
        const dur = audio.duration || 0; 
        return Number(dur.toFixed(2)); 
      } 
      if (info === 'currentTime') { 
        const time = audio.currentTime || 0; 
        return Number(time.toFixed(2)); 
      } 
      if (info === 'playbackRate') return audio.playbackRate; 
      return translate({ id: 'notFound' }); 
    }

    getAllAudioInfo(args) {
      const infoType = Cast.toString(args.INFO);
      const names = Array.from(this.audioElements.keys());
      
      if (names.length === 0) {
        switch (infoType) {
          case 'count': return 0;
          case 'names':
          case 'urls':
          case 'status':
          case 'volumes':
          case 'durations':
            return JSON.stringify([]);
          case 'json': return JSON.stringify({ total: 0, audios: [] });
          default: return JSON.stringify([]);
        }
      }

      switch (infoType) {
        case 'names':
          return JSON.stringify(names);
        case 'count':
          return names.length;
        case 'urls':
          return JSON.stringify(names.map(name => this.audioUrls.get(name) || ''));
        case 'status':
          return JSON.stringify(names.map(name => ({
            name: name,
            playing: !this.audioElements.get(name).paused,
            loaded: this.loadedCallbacks.get(name) || false
          })));
        case 'volumes':
          return JSON.stringify(names.map(name => Math.round(this.audioElements.get(name).volume * 100)));
        case 'durations':
          return JSON.stringify(names.map(name => {
            const dur = this.audioElements.get(name).duration || 0;
            return Number(dur.toFixed(2));
          }));
        case 'json':
          return JSON.stringify({
            total: names.length,
            audios: names.map(name => ({
              name: name,
              url: this.audioUrls.get(name) || '',
              playing: !this.audioElements.get(name).paused,
              volume: Math.round(this.audioElements.get(name).volume * 100),
              duration: Number((this.audioElements.get(name).duration || 0).toFixed(2)),
              currentTime: Number((this.audioElements.get(name).currentTime || 0).toFixed(2)),
              playbackRate: this.audioElements.get(name).playbackRate,
              loaded: this.loadedCallbacks.get(name) || false
            }))
          });
        default:
          return JSON.stringify([]);
      }
    }

    getFrequencyData(args) { 
      const name = Cast.toString(args.NAME); 
      const analyser = this._getAnalyser(name); 
      if (!analyser) return JSON.stringify([]); 
      let num = Math.floor(Cast.toNumber(args.NUM)); 
      if (isNaN(num) || num < 1) num = 1; 
      num = Math.min(num, 16384); 
      this._ensureFftSize(name, num); 
      const dataArray = new Uint8Array(analyser.frequencyBinCount); 
      analyser.getByteFrequencyData(dataArray); 
      const result = Array.from(dataArray.slice(0, num)); 
      return JSON.stringify(result); 
    }

    getFrequencyAtIndex(args) { 
      const name = Cast.toString(args.NAME); 
      const analyser = this._getAnalyser(name); 
      if (!analyser) return 0; 
      let index = Math.floor(Cast.toNumber(args.INDEX)); 
      if (isNaN(index) || index < 0) index = 0; 
      this._ensureFftSize(name, index + 1); 
      const dataArray = new Uint8Array(analyser.frequencyBinCount); 
      analyser.getByteFrequencyData(dataArray); 
      if (index >= dataArray.length) return 0; 
      return dataArray[index]; 
    }

    getAverageVolume(args) { 
      const name = Cast.toString(args.NAME); 
      const analyser = this._getAnalyser(name); 
      if (!analyser) return 0; 
      this._ensureFftSize(name, 64); 
      const count = Math.min(64, analyser.frequencyBinCount); 
      const dataArray = new Uint8Array(count); 
      analyser.getByteFrequencyData(dataArray); 
      let sum = 0; 
      for (let i = 0; i < count; i++) sum += dataArray[i]; 
      return Math.round(sum / count); 
    }

    onLoaded() {}
  }

  extensions.register(new AudioPlayerExtension());
})(Scratch);