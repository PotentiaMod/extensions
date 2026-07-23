(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("this extension must be run unsandboxed");
  }

  /**
   * @param {VM.BlockUtility} util
   * @param {unknown} targetName
   */
  const getSpriteTargetByName = (util, targetName) => {
    const nameString = Scratch.Cast.toString(targetName);
    const target = util.target;
    if (target.getName() === nameString) {
      return target;
    }
    return util.runtime.getSpriteTargetByName(nameString);
  };

  const audioEngine = Scratch.vm.runtime.audioEngine;

  /**
   * This method assumes that the caller has already requested permission to fetch the URL.
   * @param {string} url
   * @returns {Promise<ArrayBuffer>}
   */
  const fetchAsArrayBufferWithTimeout = (url) =>
    new Promise((resolve, reject) => {
      // Permission is checked in playSound()
      // eslint-disable-next-line no-restricted-syntax
      const xhr = new XMLHttpRequest();
      let timeout = setTimeout(() => {
        xhr.abort();
        reject(new Error("Timed out"));
      }, 5000);
      xhr.onload = () => {
        clearTimeout(timeout);
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(new Error(`HTTP error ${xhr.status} while fetching ${url}`));
        }
      };
      xhr.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Failed to request ${url}`));
      };
      xhr.responseType = "arraybuffer";
      xhr.open("GET", url);
      xhr.send();
    });

  /**
   * @type {Map<string, {sound: AudioEngine.SoundPlayer | null, error: unknown}>}
   */
  const soundPlayerCache = new Map();

  /**
   * @param {string} url
   * @returns {Promise<AudioEngine.SoundPlayer>}
   */
  const decodeSoundPlayer = async (url) => {
    const cached = soundPlayerCache.get(url);
    if (cached) {
      if (cached.sound) {
        return cached.sound;
      }
      throw cached.error;
    }

    try {
      const arrayBuffer = await fetchAsArrayBufferWithTimeout(url);
      const soundPlayer = await audioEngine.decodeSoundPlayer({
        data: {
          buffer: arrayBuffer,
        },
      });
      soundPlayerCache.set(url, {
        sound: soundPlayer,
        error: null,
      });
      return soundPlayer;
    } catch (e) {
      soundPlayerCache.set(url, {
        sound: null,
        error: e,
      });
      throw e;
    }
  };

  /**
   * @param {string} url
   * @param {VM.Target} target
   * @returns {Promise<boolean>} true if the sound could be played, false if the sound could not be decoded
   */
  const playWithAudioEngine = async (url, target) => {
    const soundBank = target.sprite.soundBank;

    /** @type {AudioEngine.SoundPlayer} */
    let soundPlayer;
    try {
      const originalSoundPlayer = await decodeSoundPlayer(url);
      soundPlayer = originalSoundPlayer.take();
    } catch (e) {
      console.warn(
        "Could not fetch audio; falling back to primitive approach",
        e
      );
      return false;
    }

    soundBank.addSoundPlayer(soundPlayer);
    await soundBank.playSound(target, soundPlayer.id);

    delete soundBank.soundPlayers[soundPlayer.id];
    soundBank.playerTargets.delete(soundPlayer.id);
    soundBank.soundEffects.delete(soundPlayer.id);

    return true;
  };

  /**
   * This method assumes that the caller has already requested permission to fetch the URL.
   * @param {string} url
   * @param {VM.Target} target
   * @returns {Promise<void>}
   */
  const playWithAudioElement = (url, target) =>
    new Promise((resolve, reject) => {
      // Unfortunately, we can't play all sounds with the audio engine.
      // For these sounds, fall back to a primitive <audio>-based solution that will work for all
      // sounds, even those without CORS.
      // Permission is checked in playSound()
      // eslint-disable-next-line no-restricted-syntax
      const mediaElement = new Audio(url);

      // Make a minimal effort to simulate Scratch's sound effects.
      // We can get pretty close for volumes <100%.
      // playbackRate does not have enough range for simulating pitch.
      // There is no way for us to pan left or right.
      mediaElement.volume = target.volume / 100;

      mediaElement.onended = () => {
        resolve();
      };
      mediaElement
        .play()
        .then(() => {
          // Wait for onended
        })
        .catch((err) => {
          reject(err);
        });
    });

  /**
   * @param {string} url
   * @param {VM.Target} target
   * @returns {Promise<void>}
   */
  const playSound = async (url, target) => {
    try {
      if (!(await Scratch.canFetch(url))) {
        throw new Error(`Permission to fetch ${url} denied`);
      }

      const success = await playWithAudioEngine(url, target);
      if (!success) {
        return await playWithAudioElement(url, target);
      }
    } catch (e) {
      console.warn(`All attempts to play ${url} failed`, e);
    }
  };

  const vm = Scratch.vm;
  const runtime = vm.runtime;
  const soundCategory = runtime.ext_scratch3_sound;

class SoundExtension {
  getInfo() {
    return {
      id: 'soundexample',
      name: 'Sound Expansion',
      color1: "#d65cd6",
      blocks: [
        /*{
          func: 'notify',
          blockType: Scratch.BlockType.BUTTON,
          text: 'note to this extension'
        },*/
        {
          opcode: 'SoundExp_getEffectfromTarget',
          text: 'get [EFFECT] from [TARGET]',
          blockType: Scratch.BlockType.REPORTER,
          arguments: {
            EFFECT: {
              type: Scratch.ArgumentType.STRING,
              menu: 'effects'
            },
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: 'spriteMenu'
            },
          }
        },
        {
          opcode: 'SoundExp_getVolumefromTarget',
          text: 'get volume from [TARGET]',
          blockType: Scratch.BlockType.REPORTER,
          arguments: {
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              menu: 'spriteMenu'
            },
          }
        },
        "---",
        {
          opcode: 'SoundExp_PlayURL',
          text: 'start sound from url: [path]',
          blockType: Scratch.BlockType.COMMAND,
          arguments: {
            path: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "https://extensions.turbowarp.org/meow.mp3",
            },
          }
        },
        {
          opcode: 'SoundExp_PlayUntilDoneURL',
          text: 'play sound from url: [path] until done',
          blockType: Scratch.BlockType.COMMAND,
          arguments: {
            path: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "https://extensions.turbowarp.org/meow.mp3",
            },
          }
        },
        "---",
        {
          opcode: "SoundExp_toggleSounds",
          blockType: Scratch.BlockType.COMMAND,
          text: "[smenu] sounds",
          arguments: {
            smenu: {
              type: Scratch.ArgumentType.STRING,
              menu: "smenu"
            }
          },
        },
        "---",
        {
          opcode: "SoundExp_startLooping",
          blockType: Scratch.BlockType.COMMAND,
          text: "start looping [SOUND]",
          arguments: {
            SOUND: {
              type: Scratch.ArgumentType.SOUND,
            },
            START: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
          },
        },
        {
          opcode: "SoundExp_stopLooping",
          blockType: Scratch.BlockType.COMMAND,
          text: "end looping [SOUND]",
          arguments: {
            SOUND: {
              type: Scratch.ArgumentType.SOUND,
            },
          },
        },
        {
          opcode: "SoundExp_isLooping",
          blockType: Scratch.BlockType.BOOLEAN,
          text: "is [SOUND] looping?",
          arguments: {
            SOUND: {
              type: Scratch.ArgumentType.SOUND,
            },
          },
        },
        "---",
        {
          opcode: "SoundExp_setProjectVolume",
          blockType: Scratch.BlockType.COMMAND,
          text: "set project volume to [VALUE]%",
          arguments: {
            VALUE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: "100",
            },
          },
        },
        {
          opcode: "SoundExp_changeProjectVolume",
          blockType: Scratch.BlockType.COMMAND,
          text: "change project volume by [VALUE]",
          arguments: {
            VALUE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: "-10",
            },
          },
        },
        {
          opcode: "SoundExp_getProjectVolume",
          blockType: Scratch.BlockType.REPORTER,
          text: "project volume",
        },
      ],
      menus: {
        spriteMenu: {
          acceptReporters: true,
          items: "getSprites",
        },
        effects: {
          acceptReporters: false,
          items: [
            {
              text: "pitch",
              value: "pitch",
            },
            {
              text: "pan left/right",
              value: "pan",
            },
          ]
        },
        smenu: {
          acceptReporters: true,
          items: [
            {
              text: "pause",
              value: "pause",
            },
            {
              text: "resume",
              value: "resume",
            },
          ]
        },
      },
    };
  }
  notify() {
    alert(
      `This extension is still work in progress
      `
    )
  }
  _getTargets() {
    let spriteNames = [
      { text: "this sprite", value: "_myself_" },
      { text: "Stage", value: "_stage_" },
    ];
    const targets = Scratch.vm.runtime.targets
      .filter((target) => target.isOriginal && !target.isStage)
      .map((target) => target.getName());
    spriteNames = spriteNames.concat(targets);
    return spriteNames;
  }
  getSprites() {
    const spriteNames = [];
    const targets = Scratch.vm.runtime.targets;
    const myself = Scratch.vm.runtime.getEditingTarget().getName();
    for (let index = 1; index < targets.length; index++) {
      const target = targets[index];
      if (target.isOriginal) {
        const targetName = target.getName();
        if (targetName === myself) {
          spriteNames.unshift({
            text: "this sprite",
            value: targetName,
          });
        } else {
          spriteNames.push({
            text: targetName,
            value: targetName,
          });
        }
      }
    }
    if (spriteNames.length > 0) {
      return spriteNames;
    } else {
      return [{ text: "", value: 0 }]; //this should never happen but it's a failsafe
    }
  }
  SoundExp_getEffectfromTarget(args, util) {
    const target = getSpriteTargetByName(util, args.TARGET);

    const effects = target.soundEffects;
    if (!effects) {
      return 0;
    }

    const effect = Scratch.Cast.toString(args.EFFECT).toLowerCase();
    if (!effects.hasOwnProperty(effect)) return 0;

    return Scratch.Cast.toNumber(effects[effect]);
  }
  SoundExp_getVolumefromTarget(args, util) {
    const target = getSpriteTargetByName(util, args.TARGET);
    return target.volume;
  }
  SoundExp_PlayURL({ path }, util) {
    playSound(path, util.target);
  }
  SoundExp_PlayUntilDoneURL({ path }, util) {
    return playSound(path, util.target);
  }
  SoundExp_toggleSounds(args, util) {
    if (args.smenu == 'pause') {
    this._toggleSoundState(args, util, true, util.target.sprite);
    } else if (args.smenu == 'resume') {
    this._toggleSoundState(args, util, false, util.target.sprite);
    }
  }
  SoundExp_startLooping(args, util) {
    const index = this._getSoundIndex(args.SOUND, util);
    if (index < 0) return 0;
    const target = util.target;
    const sprite = util.target.sprite;

    const soundId = sprite.sounds[index].soundId;
    const soundPlayer = sprite.soundBank.soundPlayers[soundId];

    if (!soundPlayer.isPlaying) {
      soundCategory._addWaitingSound(target.id, soundId);
      sprite.soundBank.playSound(util.target, soundId);
    }

    if (!soundPlayer.outputNode) return;
    soundPlayer.outputNode.loop = true;
  }

  SoundExp_stopLooping(args, util) {
    const index = this._getSoundIndex(args.SOUND, util);
    if (index < 0) return false;
    const sprite = util.target.sprite;

    const soundId = sprite.sounds[index].soundId;
    const soundPlayer = sprite.soundBank.soundPlayers[soundId];

    if (!soundPlayer.outputNode) return;
    soundPlayer.outputNode.loop = false;
  }

  SoundExp_isLooping(args, util) {
    const index = this._getSoundIndex(args.SOUND, util);
    if (index < 0) return false;
    const sprite = util.target.sprite;

    const soundId = sprite.sounds[index].soundId;
    const soundPlayer = sprite.soundBank.soundPlayers[soundId];

    if (!soundPlayer.outputNode) return false;
    return soundPlayer.outputNode.loop;
  }
  SoundExp_setProjectVolume(args) {
    const value = Scratch.Cast.toNumber(args.VALUE);
    const newVolume = this._wrapClamp(value / 100, 0, 1);
    runtime.audioEngine.inputNode.gain.value = newVolume;
  }
  SoundExp_changeProjectVolume(args) {
    const value = Scratch.Cast.toNumber(args.VALUE) / 100;
    const volume = runtime.audioEngine.inputNode.gain.value;
    const newVolume = Scratch.Cast.toNumber(
      this._wrapClamp(value+volume, 0, 1)
    );
    runtime.audioEngine.inputNode.gain.value = this._wrapClamp(newVolume, 0, 1);
  }
  SoundExp_getProjectVolume() {
    const volume = runtime.audioEngine.inputNode.gain.value;
    return Math.round(volume * 10000) / 100;
  }

  _toggleSoundState(args, util, state, target) {
    const sprite = target;
    const audioContext = sprite.soundBank.audioEngine.audioContext;

    if (state) {
      audioContext.suspend();
      return;
    } else {
      audioContext.resume();
      return;
    }
  }

  /* Utility Functions */

  _getSoundIndex(soundName, util) {
    const len = util.target.sprite.sounds.length;
    if (len === 0) {
      return -1;
    }
    const index = this._getSoundIndexByName(soundName, util);
    if (index !== -1) {
      return index;
    }
    const oneIndexedIndex = parseInt(soundName, 10);
    if (!isNaN(oneIndexedIndex)) {
      return this._wrapClamp(oneIndexedIndex - 1, 0, len - 1);
    }
    return -1;
  }

  _getSoundIndexByName(soundName, util) {
    const sounds = util.target.sprite.sounds;
    for (let i = 0; i < sounds.length; i++) {
      if (sounds[i].name === soundName) {
        return i;
      }
    }
    return -1;
  }
  // copied from https://extensions.turbowarp.org/Lily/LooksPlus.js
  _wrapClamp(n, min, max) {
    const range = max - min + 1;
    return n - Math.floor((n - min) / range) * range;
  }
}
Scratch.extensions.register(new SoundExtension());
})(Scratch);
