/*
   This extension was made with TurboBuilder!
   https://turbobuilder-steel.vercel.app/
*/
(function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = [];


    function doSound(ab, cd, runtime) {
        const audioEngine = runtime.audioEngine;

        const fetchAsArrayBufferWithTimeout = (url) =>
            new Promise((resolve, reject) => {
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

        const soundPlayerCache = new Map();

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

        const playWithAudioEngine = async (url, target) => {
            const soundBank = target.sprite.soundBank;

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

        const playWithAudioElement = (url, target) =>
            new Promise((resolve, reject) => {
                const mediaElement = new Audio(url);

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

        playSound(ab, cd)
    }
    class Extension {
        getInfo() {
            return {
                "id": "DataReserves",
                "name": "Data Reserves",
                "color1": "#515f6c",
                "color2": "#32383e",
                "blocks": blocks
            }
        }
    }
    blocks.push({
        opcode: `make_reserve`,
        blockType: Scratch.BlockType.COMMAND,
        text: `Create reserve [name] for [content]`,
        arguments: {
            "name": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Reserve',
            },
            "content": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Data',
            },
        }
    });
    Extension.prototype[`make_reserve`] = (args, util) => {
        variables[args["name"]] = args["content"]
    };

    blocks.push({
        opcode: `delete_reserves`,
        blockType: Scratch.BlockType.COMMAND,
        text: `Delete reserve [name]`,
        arguments: {
            "name": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Reserve',
            },
        }
    });
    Extension.prototype[`delete_reserves`] = (args, util) => {
        variables[args["name"]] = ''
    };

    blocks.push({
        opcode: `get_reserves`,
        blockType: Scratch.BlockType.REPORTER,
        text: `Get reserve data for [target]`,
        arguments: {
            "target": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Reserve',
            },
        }
    });
    Extension.prototype[`get_reserves`] = (args, util) => {
        return variables[args["target"]]
    };

    Scratch.extensions.register(new Extension());
})(Scratch);