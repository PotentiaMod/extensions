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
                "blockIconURI": "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxMDcuOTQwNTQiIGhlaWdodD0iMTA2LjEyODgxIiB2aWV3Qm94PSIwLDAsMTA3Ljk0MDU0LDEwNi4xMjg4MSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE4Ni4wMjk3MywtMTI2LjkzNTYpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGw9IiNmZmZmZmYiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2luZGV4JnF1b3Q7Om51bGx9IiBzdHJva2UtbGluZWNhcD0iYnV0dCI+PHBhdGggZD0iTTI2OC41NzIzNywxNjYuNjg2bDcuMTcxNjIsLTIuOTYwODFsMi41MTgwOSw1LjQzNTY1bC03LjE3MTYzLDIuOTYwOHoiLz48cGF0aCBkPSJNMjcxLjQ1MDM1LDE2My45OTk2NWMtMC4wMTcxLC0wLjEwMDIxIC0xLjI1MjU1LC02LjM3NjE1IDEuMDU1NDgsLTguMjk2OTVjMS40ODAxNSwtMS4yMzE4MSA0LjgzMTcxLC0yLjc2NzMyIDguNTYzMzYsLTIuOTY4ODRjMi43MjU3MywtMC4xNDcyIDUuNzMyOSwwLjY1MzIzIDcuOTcxNzgsMS42MzM5YzMuODAzNTcsMS42NjYwNCA1LjA0MjY4LDYuODIxMTUgNC45MjEyOCw4LjE1NjE4Yy0wLjE1NDc2LDEuNzAxODUgLTAuNDI0NTgsNS4xMDczNSAtMi4zMzIwNyw3Ljk5MzYzYy0xLjI0ODg5LDEuODg5NzQgLTMuNzc3NjUsMy40NjA1OCAtNS40MjMwNSw0LjUyMDQzYy0xLjk5ODk5LDEuMjg3NjEgLTYuMjEzNCwtMC4xMzgyNiAtNi41MzUxNywtMC4yODM1OGMtMy42MTYxNSwtMS42MzMxMiAtNy41MjIzMiwtNi42NTcyNyAtOC4yMjE2MywtMTAuNzU0NzZ6Ii8+PHBhdGggZD0iTTI3Ni41Mjg5NCwxNjQuMTMwN2MtMC4wMDk0MiwtMC4wNTUyMyAtMC42OTAzNCwtMy41MTQyMyAwLjU4MTczLC00LjU3Mjg4YzAuNzI2MDYsLTAuNjA0MjQgMi4zNDI3LC0xLjYyNTk5IDQuMTM5NDksLTEuODEwNWMxLjY5NjczLC0wLjE3NDI0IDMuNTU0MDksMC40NTI4NiA0Ljk3Mzg4LDEuMDc0NzZjMi4wOTYzNCwwLjkxODI0IDIuNzc5MjgsMy43NTk0OCAyLjcxMjM3LDQuNDk1MjljLTAuMDg0ODgsMC45MzMzNSAtMC4xMTAyMiwyLjg3Mjk4IC0xLjE1Mjk0LDQuNDU3NzdjLTAuNjkxMjYsMS4wNTA2MiAtMi4yMDc2LDEuODUwODEgLTMuMTIxMywyLjQzOTM1Yy0xLjEwMTc0LDAuNzA5NjcgLTMuNDI0NTMsLTAuMDc2MiAtMy42MDE4NywtMC4xNTYzYy0xLjk5MzA1LC0wLjkwMDEgLTQuMTQ1OTQsLTMuNjY5MTYgLTQuNTMxMzYsLTUuOTI3NXoiLz48L2c+PGcgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiPjxwYXRoIGQ9Ik0yMDguOTA5NTQsMTczLjAyMTYzbC03LjE3MTYzLC0yLjk2MDhsMi41MTgwOCwtNS40MzU2NWw3LjE3MTYzLDIuOTYwODF6Ii8+PHBhdGggZD0iTTIwOC41NDk2NywxNjQuODk5NjRjLTAuNjk5MzEsNC4wOTc1IC00LjYwNTQ5LDkuMTIxNjQgLTguMjIxNjMsMTAuNzU0NzdjLTAuMzIxNzgsMC4xNDUzMiAtNC41MzYxOSwxLjU3MTE5IC02LjUzNTE4LDAuMjgzNThjLTEuNjQ1MzksLTEuMDU5ODUgLTQuMTc0MTYsLTIuNjMwNjkgLTUuNDIzMDUsLTQuNTIwNDNjLTEuOTA3NDksLTIuODg2MjcgLTIuMTc3MzEsLTYuMjkxNzggLTIuMzMyMDYsLTcuOTkzNjNjLTAuMTIxNCwtMS4zMzUwMyAxLjExNzcxLC02LjQ5MDE0IDQuOTIxMjgsLTguMTU2MThjMi4yMzg4OCwtMC45ODA2OCA1LjI0NjA1LC0xLjc4MTExIDcuOTcxNzgsLTEuNjMzOWMzLjczMTY1LDAuMjAxNTIgNy4wODMyMSwxLjczNzAzIDguNTYzMzcsMi45Njg4NGMyLjMwODAzLDEuOTIwOCAxLjA3MjU4LDguMTk2NzQgMS4wNTU0OCw4LjI5Njk1eiIvPjxwYXRoIGQ9Ik0yMDMuNDcxMDYsMTY1LjAzMDY4Yy0wLjM4NTQyLDIuMjU4MzQgLTIuNTM4MzIsNS4wMjc0IC00LjUzMTM2LDUuOTI3NWMtMC4xNzczNSwwLjA4MDEgLTIuNTAwMTIsMC44NjU5NyAtMy42MDE4NywwLjE1NjNjLTAuOTEzNjksLTAuNTg4NTQgLTIuNDMwMDQsLTEuMzg4NzMgLTMuMTIxMywtMi40MzkzNWMtMS4wNDI3MiwtMS41ODQ3OSAtMS4wNjgwNiwtMy41MjQ0MyAtMS4xNTI5NCwtNC40NTc3N2MtMC4wNjY5MSwtMC43MzU4IDAuNjE2MDIsLTMuNTc3MDUgMi43MTIzNywtNC40OTUyOWMxLjQxOTc4LC0wLjYyMTkgMy4yNzcxNSwtMS4yNDkgNC45NzM4NywtMS4wNzQ3NmMxLjc5NjgsMC4xODQ1MSAzLjQxMzQ0LDEuMjA2MjcgNC4xMzk0OSwxLjgxMDVjMS4yNzIwOCwxLjA1ODY1IDAuNTkxMTYsNC41MTc2NSAwLjU4MTczLDQuNTcyODh6Ii8+PC9nPjxwYXRoIGQ9Ik0yNzcuODE2NywyMDMuMDc2MzZjMCwyLjM0MTggLTEuOTE2MjMsNi4xOTUxMyAtNS41MjY0NSw5LjIyMzNjLTYuNjkxODMsNS42MTI5NSAtMTguODMyNjYsMTAuMjQ2NDYgLTMyLjc2MTc3LDEwLjI0NjQ2Yy0xNC42NDc1NiwwIC0yOC4yMTk0NywtNi44MDYwOCAtMzQuNTEzLC0xMy4yNDkyOGMtMi45MjAxMiwtMi45ODk1NiAtMy4yMzU5NSwtNS45MDAxNCAtMy4yMzU5NSwtOC4wMTgwNWMwLC02LjY4MjUgMTYuMzA1MTIsLTIuOTMyMTMgMzcuNzQ4OTUsLTIuOTMyMTNjMjEuNDQzODMsMCAzOC4yODgyMiwtMS45NTI4IDM4LjI4ODIyLDQuNzI5N3oiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIxNC4zMTQ0MSwyMTcuNTY1ODF2LTEwLjU3NzcyaDUxLjgzMDgydjEwLjU3NzcyYzAsMCAtMTkuMTMwMjEsMi4xMTU1NCAtMjguMTYzMTcsMi4xMTU1NGMtOC4xNTM3OSwwIC0yMy42Njc2NCwtMi4xMTU1NCAtMjMuNjY3NjQsLTIuMTE1NTR6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNTIuODc0MjcsMjE4LjcwNjk2YzAsMCAwLC0yLjc4OTU4IDAsLTMuNjU0MTJjMCwtMC40NzU2IDEuMDQ3MTgsLTEuMTA1ODUgMS43MTA4NiwtMS4xMDU4NWMwLjUzMTM1LDAgMS41NDc5OSwwIDIuMzE1NywwYzAuNTY2NzcsMCAwLjk5Nzg3LDAuNDk4MjYgMC45OTc4NywwLjkwNDQ5YzAsMC44Mzg3MSAwLDMuODU1NDggMCwzLjg1NTQ4eiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjQ5LjU5MzE0LDIxOC45OTU4M3YtNC43NTk5N2g1LjAyNDQydjQuNzU5OTd6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMjEuNDI5OTcsMjE4LjIwMjVjMCwwIDAsLTIuNzg4NDQgMCwtMy42NTMwN2MwLC0wLjQ3NTk1IDAuNTE0NDQsLTEuMTA2OSAwLjkzNjc4LC0xLjEwNjljMC41Njg2NywwIDIuMTAyNjIsMCAzLjEyMTE2LDBjMC41NjE1OSwwIDAuOTY2NDksMC42MzA5NiAwLjk2NjQ5LDEuMTA2OWMwLDAuODY0NjMgMCwzLjY1MzA3IDAsMy42NTMwN3oiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIyNS40MjEwMiwyMTguNDkxMzZjMCwwIDAsLTIuNjY2MTkgMCwtMy41MzkyYzAsLTAuNTEyNzIgMC45NDk5MywtMS4yMjA3NyAxLjU3NzEyLC0xLjIyMDc3YzAuNDkzNzMsMCAxLjQzOTAxLDAgMi4yMTUwMSwwYzAuNjgxNDEsMCAxLjIzMjI5LDAuNTcyOSAxLjIzMjI5LDEuMDE5NDFjMCwwLjg1NTMxIDAsMy43NDA1NiAwLDMuNzQwNTZ6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMzIuMDMyMDgsMjE5Ljk0NTc5YzAsMCAwLC0zLjQzNDEgMCwtNC4zODk1M2MwLC0wLjQ2MzE3IDAuODI3MjIsLTEuMDMxNTUgMS40MDk3MywtMS4wMzE1NWMwLjUxMTQ0LDAgMS41NTg3MywwIDIuNDE2MzgsMGMwLjczNDg4LDAgMS4zMzA1MywwLjYzMzYgMS4zMzA1MywxLjEzMjIzYzAsMC45NzA0NiAwLDQuMjg4ODUgMCw0LjI4ODg1eiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjQyLjM4NDAyLDIyMC4xMjI3NGMwLDAgMCwtMy4xNzkzNCAwLC00LjE2Mzc2YzAsLTAuNTQwOTUgMC45MTA3NiwtMS4yNTczMiAxLjUyODc2LC0xLjI1NzMyYzAuNDg0OTEsMCAxLjQxNzA0LDAgMi4yMTUwMSwwYzAuNzY4NjgsMCAxLjQxMjg1LDAuNTE5ODIgMS40MTI4NSwwLjk1NTI3YzAsMC45NDE1MSAwLDQuNDY1ODEgMCw0LjQ2NTgxeiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjEwLjAwNzc4LDIxNC4wMDE1NmwwLjExMjA3LC04LjgzODUybDUuMTgwNSwyLjI4NTUyYzAsMCAwLjE4MjMyLDQuOTg3OTMgMC4yMDc1OCw3LjIzNTY1YzAuMDAwMzQsMC4wMzA2NSAyLjM3NzM2LDAuNDM2MjYgNS4zNjMxNywxLjIzNDIyYzAuNzA1MTksMC4xODg0NiAxLjU5MjkxLDAuOTE5NTIgMi4zOTM1MiwxLjEyNjU4YzIuNDk5ODgsMC42NDY1NSA1LjM5NDM5LDEuNDI0NjkgOC41Nzc2NSwxLjc0ODM5YzIuMjY0MjIsMC4yMzAyNCAxMy4xNzY3MSwwLjI5Mjg0IDE1LjQwNzM5LDAuMTFjNC45Njc2MiwtMC40MDcxOCA4LjI2NTU3LC0xLjQ3NDUxIDExLjQ5MTg5LC0yLjI2MDE4YzAuNjY2MDksLTAuMTYyMjEgMS41MTQ2NCwtMC44MjU2IDIuMzYzNzIsLTEuMTE0NTZjMS44MzY3NCwtMC42MjUwOCAzLjY3NTk1LC0wLjk1NzUgMy42NzU5NSwtMC45NTc1YzAsMCAtMC4yNTA1MywtOC45NDIxOSAwLjI4MDc4LC05LjEyNjYyYzAuMjg4NjEsLTAuMTAwMTkgNC4yNjEwNCwtMS4zNjI4NiA1LjIyMTMxLDAuOTk4NzFjMC42OTY2MiwxLjcxMzE5IDAuOTIxMywxMS4yMzIxNyAtMC45OTM1OCwxNy40NTAyNGMtMC44NDI0NywyLjczNTcgLTMuNjk4NTEsNS4wNDU3IC00LjQwNTY4LDUuNDEwMjZjLTMuMTQxMjgsMS42MTkzNyAtOC4yODY5LDIuNjAyNjMgLTEzLjU5NjgxLDMuMjM2OTVjLTEyLjAxOTA2LDEuNDM1NzkgLTI3Ljk5MDUxLC0wLjQ2MTUxIC0yOS44NjQyMywtMS4xNTYzMmMtMC4xMjcyMiwtMC4wNDcxOCAtNS4xMDc4MiwtMS4zMTk1OSAtNy41MTE0NCwtMy44ODc3MWMtMi45ODc2NCwtMy4xOTIxMSAtMy41MDcxMiwtNy44MDk2IC0zLjUwNzEyLC03LjgwOTZ6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNDQuMjk1NzksMTc3Ljk1NDljMS41NjI2OCwtMi41MDk3MiA0LjUzMjc5LC0yLjYzOTg0IDcuOTkxNjEsLTIuNjM5ODRjNS42NjA3NCwwIDkuODE2NTgsMy41OTEzNyA5LjgxNjU4LDguNzMzODdjMCwxLjk1Mjg4IC0wLjc0MzY5LDQuMjU5NTIgLTEuNzk3MTYsNS42NTMyOGMtMS43MjA2MiwyLjI3NjQyIC00LjUwODM4LDMuMDgwNTkgLTguMDE5NDIsMy4wODA1OWMtNS42NjA3MywwIC05LjIzOTEzLC0zLjczNTczIC05LjIzOTEzLC04Ljg3ODIzYzAsLTIuMDAwMzMgMC4yNTI3MSwtNC4zNTE5NSAxLjI0NzUyLC01Ljk0OTY2eiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjUxLjU4MjI0LDE3Ni45MDg1OWM0LjE5NDk2LDAgNy41OTU2MywzLjM4MDc5IDcuNTk1NjMsNy41NTEyMWMwLDQuMTcwNDIgLTMuNDAwNjcsNy41NTEyMSAtNy41OTU2Myw3LjU1MTIxYy00LjE5NDk1LDAgLTcuNTk1NjMsLTMuMzgwNzkgLTcuNTk1NjMsLTcuNTUxMjFjMCwtNC4xNzA0MiAzLjQwMDY3LC03LjU1MTIxIDcuNTk1NjMsLTcuNTUxMjF6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNTIuNjE0ODcsMTc5LjE1OWMtMC42ODc5OSwwLjAxOTcgLTMuMDY3NjMsLTAuMDg4OTIgLTQuODc2OTYsMC40MzUzOWMtMi40ODcxOCwwLjcyMDc1IC00LjQ0OTg4LDIuMDg0MjggLTQuNDg2OCwxLjU5MzYzYy0wLjA5NjE5LC0xLjI3ODEgMS4zOTgzOSwtNC4yMzc1NSAyLjI2MDU4LC00Ljg4MTQzYzEuMDYzODMsLTAuNzk0NDYgNC4wMzAwNiwtMS43Njc0MSA2LjkxMzM5LC0xLjc1MjkxYzEuMjI3ODUsMC4wMDYxNyAzLjEzNjIyLDAuMDY4NDQgNC44NDIxOSwwLjg1MzZjMS4zNDMxMiwwLjYxODE2IDIuNTk0NTcsMS44ODcwMSAzLjA1OTExLDIuNTQ1NjdjMC41OTQyMSwwLjg0MjUxIDEuNTA1NzUsNC4wMjI0IDEuNTE5NDcsNC4xMzA0MmMwLjAyMDE2LDAuMTU4NzIgLTEuNTYxMDgsLTAuNjA2MDEgLTMuNTE4NzUsLTEuMzkzM2MtMS45MjkzMiwtMC43NzU4OSAtNC4yMjQyNSwtMS41NzM2OSAtNS43MTIyMSwtMS41MzEwN3oiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI1MC44NzEwMiwxODYuNDU1NTNjMC45NjIzNSwwIDIuMTkxMTksMC4zNjc0OSAyLjQzNDMzLDAuOTE5MTljMC4zMTE0MSwwLjcwNjU5IC0wLjYyNDM1LDEuNjM2MTQgLTEuODU2ODksMS42MzYxNGMtMi4xOTQ4OCwwIC0zLjk3NDE5LC0xLjcyNjE4IC0zLjk3NDE5LC0zLjg1NTU1YzAsLTAuNTQ2MTIgMS43NjQ3OSwxLjMwMDIxIDMuMzk2NzUsMS4zMDAyMXoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI1MS40NDg0NywxODEuMjU4NTFjMi4xOTQ4OCwwIDMuOTc0MTksMS43MjYxOSAzLjk3NDE5LDMuODU1NTVjMCwyLjEyOTM3IC0xLjc3OTMxLDMuODU1NTUgLTMuOTc0MTksMy44NTU1NWMtMi4xOTQ4OCwwIC0zLjk3NDE5LC0xLjcyNjE4IC0zLjk3NDE5LC0zLjg1NTU1YzAsLTIuMTI5MzYgMS43NzkzLC0zLjg1NTU1IDMuOTc0MTksLTMuODU1NTV6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNTIuNDc0MjEsMTg2LjY1MzA5YzAuOTU0MjEsMC4yNTkwMiAyLjczNjQsMC4wNTY5MiAyLjI3Mjg1LDAuNjg3NTZjLTAuMjA1MDUsMC4yNzg5NiAtMC40NDc0NSwwLjUzMDMyIC0wLjcyMDEyLDAuNzQ3MTZjLTAuNjg1NSwwLjU0NTE2IC0xLjU2MjI5LDAuODcyMzUgLTIuNTE3ODQsMC44NzIzNWMtMi4xOTQ4OCwwIC0zLjk3NDE5LC0xLjcyNjE4IC0zLjk3NDE5LC0zLjg1NTU1YzAsLTEuNTA5ODIgMi42MTM5OSwwLjkxNzI2IDQuOTM5MywxLjU0ODQ5eiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjUxLjUxNjQsMTgzLjE2MDY5YzEuMTQ0MzQsMCAyLjA3MjAxLDAuODYyNTcgMi4wNzIwMSwxLjkyNjZjMCwxLjA2NDAzIC0wLjkyNzY2LDEuOTI2NjIgLTIuMDcyMDEsMS45MjY2MmMtMS4xNDQzNCwwIC0yLjA3MjAxLC0wLjg2MjU4IC0yLjA3MjAxLC0xLjkyNjYyYzAsLTEuMDY0MDMgMC45Mjc2NiwtMS45MjY2IDIuMDcyMDEsLTEuOTI2NnoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI1MS43MjAyMSwxODMuMjI4NjJjMC44MDY2NiwwIDEuNDYwNTksMC42MDgzIDEuNDYwNTksMS4zNTg2OWMwLDAuNzUwMzkgLTAuNjUzOTIsMS4zNTg3IC0xLjQ2MDU5LDEuMzU4N2MtMC44MDY2NywwIC0xLjQ2MDYxLC0wLjYwODMxIC0xLjQ2MDYxLC0xLjM1ODdjMCwtMC43NTAzOSAwLjY1Mzk0LC0xLjM1ODY5IDEuNDYwNjEsLTEuMzU4Njl6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNTIuNzYyNTEsMTgyLjU4NDY5YzAsMCAwLjY2ODgxLDAuMTg4ODYgMC45NjM0MywwLjQwODFjMC4yOTY1OCwwLjIyMDcgMC42ODY0MiwwLjk5NDI3IDAuNjg2NDIsMC45OTQyNyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTI0OS4wNjQ4OSwxODMuNjE2OTNjLTAuNDMxOTIsLTAuNDMxOTIgLTAuMDY4ODUsLTAuOTQyMjQgMC40NjU0OSwtMS4wOTU3NWMwLjA5NzIxLC0wLjE4MTkxIDAuMjg4OTYsLTAuMzA1NjggMC41MDk2MiwtMC4zMDU2OGMwLjMxODkxLDAgMC41Nzc0NSwwLjI1ODUzIDAuNTc3NDUsMC41Nzc0NGMwLDAuMDQ5OTggLTAuMDA2MzYsMC4wOTg0OSAtMC4wMTgzLDAuMTQ0NzZjMC4xNTYzOSwwLjU3MzQxIC0xLjM4OTgyLDAuODIzNjcgLTEuNTM0MjcsMC42NzkyMXoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI0MC44NzY4NiwyMDQuMzA3NTFjLTAuNTg1ODUsMCAtMS4wMzk1NCwtNTAuMzYwMjIgLTAuNTUyNTgsLTUwLjM1ODNjMC41ODc0LDAuMDAyMzIgMS4xNzI3OSwwLjAwNyAxLjc1NDA5LDAuMDEzNjhjOC4zMTkzMiwwLjA5NTY1IDE1LjgwMzcyLDAuNjAyMTkgMTYuNDUyLDAuNDgzNjVjMC4yMjgwNCwtMC4wNDE2OSA3LjUxOTIyLDUuMjE3OTUgMTAuMjExMjMsOS4wOTAyNmM0LjM0MDA5LDYuMjQyOTkgNC45OTYyMiwyNC40NDg2OCA1LjE0Mzc4LDI0LjUwOTA4YzAuNTA5MjUsMC4yMDg0NyA0LjU5NTY0LDIuMDQxNzIgNS44NDE4Myw2LjE3MzYzYzAuODI5MDIsMi43NDg2OSAwLjgzMzYzLDcuMDk3NzEgMC40MDQ2OSw5Ljc4NjMzYy0wLjE0NjcsMC45MTk1NSAtMS4yMzg3OSwzLjQ3ODYxIC0yLjk4Myw1LjQwMzgzYy0xLjU4MDkyLDEuNzQ0OTcgLTMuNzg3ODIsMi44Nzg5OSAtNC42Mzc4MywzLjQ3Mzg0Yy0wLjE3OCwwLjEyNDU3IC0xMy4xNzQzMSwtMS4yMDIzIC0xNC45MDAzMiwtMS45OTc4NGMtMS45OTU1MywtMC45MTk3OCA3LjE1NzY1LC0xLjM1NjM3IDUuNDczLC0xLjY3ODI2Yy03Ljg0NDA5LC0xLjQ5ODc5IC0xMy43Njk2MSwtNC44OTk4OCAtMjIuMjA2ODYsLTQuODk5ODh6IiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpbmRleCZxdW90OzpudWxsfSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjM5LjgzMDQzLDIwNC4xMzkzOWMtNy43MTkxNCwwIC04LjI5ODg3LDIuODQ0MjkgLTE2LjQ3ODc4LDQuNDU3Yy0xLjM5MTUsMC4yNzQzNCAtMy40MjIzNywyLjg2MTMzIC01LjY3MTU3LDQuMTY4MTRjLTEuNDgyNDUsMC44NjEzMiAtMy42MzE4MSwwLjY4OTgyIC0zLjcyNTQ3LDAuNjI1MTNjLTAuNjYzNDgsLTAuNDU4MjIgLTcuMzUyNiwwLjY3NTU1IC05LjM4MjI3LC0wLjk5NDQzYy0zLjUxMjI0LC0yLjg4OTgxIC00LjMzOTEzLC03LjQ0NjU0IC00LjUxODczLC04LjU1NzUyYy0wLjQzNDY0LC0yLjY4ODYyIC0wLjQyOTk2LC03LjAzNzYzIDAuNDEwMDcsLTkuNzg2MzNjMS4yNjI3NiwtNC4xMzE5MSA1LjQ0NzYxLC01Ljc5NjU5IDUuOTYzNjMsLTYuMDA1MDVjMC4xNDk1MiwtMC4wNjA0IDAuMjUxNTgsLTE3LjE2MzEyIDQuNjQ5MzYsLTIzLjQwNjExYzIuNzI3NzksLTMuODcyMzEgMTAuNjM0NTMsLTEwLjQwMzUgMTAuODY1NjEsLTEwLjM2MTgxYzAuNjU2ODksMC4xMTg1NCA4LjI0MDc4LC0wLjM4OCAxNi42NzA2OSwtMC40ODM2NWMwLjU4OTAyLC0wLjAwNjY4IDEuMTgyMTksLTAuMDExMzYgMS43Nzc0MSwtMC4wMTM2OGMwLjQ5MzQzLC0wLjAwMTkyIDAuMDMzNzIsNTAuMzU4MyAtMC41NTk5Miw1MC4zNTgzeiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjQ1LjI3NTg1LDE3OS4wMDc4OGMxLjM1MzEsLTIuMTczMTIgMy45MjQ4NiwtMi4yODU3OSA2LjkxOTc5LC0yLjI4NTc5YzQuOTAxNTMsMCA4LjUsMy4xMDk3IDguNSw3LjU2MjVjMCwxLjY5MDk2IC0wLjY0Mzk1LDMuNjg4MjQgLTEuNTU2MTMsNC44OTUwN2MtMS40ODk4NSwxLjk3MTExIC0zLjkwMzcyLDIuNjY3NDMgLTYuOTQzODcsMi42Njc0M2MtNC45MDE1MywwIC04LC0zLjIzNDcgLTgsLTcuNjg3NWMwLC0xLjczMjA1IDAuMjE4ODIsLTMuNzY4MjggMS4wODAyMSwtNS4xNTE3MXoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI1MS41ODUwNSwxNzguMTAxOWMzLjYzMjM0LDAgNi41NzY5MiwyLjkyNzM3IDYuNTc2OTIsNi41Mzg0NmMwLDMuNjExMDkgLTIuOTQ0NTgsNi41Mzg0NiAtNi41NzY5Miw2LjUzODQ2Yy0zLjYzMjMzLDAgLTYuNTc2OTIsLTIuOTI3MzcgLTYuNTc2OTIsLTYuNTM4NDZjMCwtMy42MTEwOSAyLjk0NDU4LC02LjUzODQ2IDYuNTc2OTIsLTYuNTM4NDZ6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNTIuNDc5MTksMTgwLjA1MDQ5Yy0wLjU5NTcyLDAuMDE3MDYgLTIuNjU2MjEsLTAuMDc2OTkgLTQuMjIyODcsMC4zNzdjLTIuMTUzNiwwLjYyNDA4IC0zLjg1MzA3LDEuODA0NzQgLTMuODg1MDQsMS4zNzk5Yy0wLjA4MzI5LC0xLjEwNjY4IDEuMjEwODQsLTMuNjY5MjEgMS45NTc0LC00LjIyNjc0YzAuOTIxMTUsLTAuNjg3OTEgMy40ODk1NiwtMS41MzAzNyA1Ljk4NjE4LC0xLjUxNzgyYzEuMDYzMTcsMC4wMDUzNCAyLjcxNTU5LDAuMDU5MjYgNC4xOTI3NiwwLjczOTEyYzEuMTYyOTgsMC41MzUyNSAyLjI0NjU5LDEuNjMzOTMgMi42NDg4MywyLjIwNDI1YzAuNTE0NTIsMC43Mjk1MSAxLjMwMzgsMy40ODI5MyAxLjMxNTY4LDMuNTc2NDZjMC4wMzQ2NiwwLjI3Mjg4IC01LjM5NzIsLTIuNjA2NSAtNy45OTI5MiwtMi41MzIxNnoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI1MC45NjkyMiwxODYuMzY4NDJjMC44MzMyOCwwIDEuODk3MzIsMC4zMTgyIDIuMTA3ODUsMC43OTU5MWMwLjI2OTY0LDAuNjExODMgLTAuNTQwNjEsMS40MTY3MSAtMS42MDc4NSwxLjQxNjcxYy0xLjkwMDUxLDAgLTMuNDQxMTgsLTEuNDk0NjcgLTMuNDQxMTgsLTMuMzM4NDVjMCwtMC40NzI4OCAxLjUyODEsMS4xMjU4MyAyLjk0MTE4LDEuMTI1ODN6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNTEuNDY5MjIsMTgxLjg2ODQyYzEuOTAwNTEsMCAzLjQ0MTE4LDEuNDk0NjcgMy40NDExOCwzLjMzODQ1YzAsMS44NDM3OCAtMS41NDA2NywzLjMzODQ1IC0zLjQ0MTE4LDMuMzM4NDVjLTEuOTAwNTEsMCAtMy40NDExOCwtMS40OTQ2NyAtMy40NDExOCwtMy4zMzg0NWMwLC0xLjg0Mzc4IDEuNTQwNjcsLTMuMzM4NDUgMy40NDExOCwtMy4zMzg0NXoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI1Mi4zNTc0LDE4Ni41Mzk1YzAuODI2MjIsMC4yMjQyOSAyLjM2OTQsMC4wNDkyOCAxLjk2ODAyLDAuNTk1MzVjLTAuMTc3NTUsMC4yNDE1NSAtMC4zODc0NCwwLjQ1OTE4IC0wLjYyMzU0LDAuNjQ2OTRjLTAuNTkzNTYsMC40NzIwNSAtMS4zNTI3NSwwLjc1NTM1IC0yLjE4MDE1LDAuNzU1MzVjLTEuOTAwNTEsMCAtMy40NDExOCwtMS40OTQ2NyAtMy40NDExOCwtMy4zMzg0NWMwLC0xLjMwNzMyIDIuMjYzNCwwLjc5NDI0IDQuMjc2ODUsMS4zNDA4MXoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI1MS41MjgwNCwxODMuNTE1NDhjMC45OTA4NiwwIDEuNzk0MTIsMC43NDY4OCAxLjc5NDEyLDEuNjY4MjFjMCwwLjkyMTMzIC0wLjgwMzI1LDEuNjY4MjIgLTEuNzk0MTIsMS42NjgyMmMtMC45OTA4NiwwIC0xLjc5NDExLC0wLjc0Njg5IC0xLjc5NDExLC0xLjY2ODIyYzAsLTAuOTIxMzMgMC44MDMyNCwtMS42NjgyMSAxLjc5NDExLC0xLjY2ODIxeiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjUxLjcwNDUyLDE4My41NzQzYzAuNjk4NDcsMCAxLjI2NDcsMC41MjY3MiAxLjI2NDcsMS4xNzY0N2MwLDAuNjQ5NzUgLTAuNTY2MjIsMS4xNzY0NyAtMS4yNjQ3LDEuMTc2NDdjLTAuNjk4NDgsMCAtMS4yNjQ3MSwtMC41MjY3MiAtMS4yNjQ3MSwtMS4xNzY0N2MwLC0wLjY0OTc1IDAuNTY2MjMsLTEuMTc2NDcgMS4yNjQ3MSwtMS4xNzY0N3oiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI1Mi42MDcwMywxODMuMDE2NzNjMCwwIDAuNTc5MTEsMC4xNjM1MyAwLjgzNDIxLDAuMzUzMzdjMC4yNTY4LDAuMTkxMSAwLjU5NDM2LDAuODYwOTIgMC41OTQzNiwwLjg2MDkyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjQ5LjgwODM4LDE4Mi45NjE3NGMwLjA4NDE3LC0wLjE1NzUxIDAuMjUwMjEsLTAuMjY0NjggMC40NDEyNywtMC4yNjQ2OGMwLjI3NjE0LDAgMC41LDAuMjIzODYgMC41LDAuNWMwLDAuMDQzMjggLTAuMDA1NSwwLjA4NTI4IC0wLjAxNTg0LDAuMTI1MzRjMC4xMzU0MSwwLjQ5NjUgLTEuMjAzNDIsMC43MTMyMSAtMS4zMjg1LDAuNTg4MTNjLTAuMzczOTksLTAuMzczOTkgLTAuMDU5NjEsLTAuODE1ODcgMC40MDMwNiwtMC45NDg3OXoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIzNi41MTAyLDE4NC42NDAzMWMwLDQuMTcwNDIgLTMuNDAwNjgsNy41NTEyMSAtNy41OTU2Myw3LjU1MTIxYy00LjE5NDk2LDAgLTcuNTk1NjMsLTMuMzgwOCAtNy41OTU2MywtNy41NTEyMWMwLC00LjE3MDQyIDMuNDAwNjcsLTcuNTUxMjEgNy41OTU2MywtNy41NTEyMWM0LjE5NDk2LDAgNy41OTU2MywzLjM4MDggNy41OTU2Myw3LjU1MTIxeiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjMzLjAyMjUzLDE4NS4zMzU4MmMwLDIuMTI5MzcgLTEuNzc5MzEsMy44NTU1NSAtMy45NzQxOSwzLjg1NTU1Yy0xLjIzMjU1LDAgLTIuMTY4MywtMC45Mjk1NSAtMS44NTY4OSwtMS42MzYxNWMwLjI0MzE0LC0wLjU1MTcgMS40NzE5OSwtMC45MTkxOSAyLjQzNDM0LC0wLjkxOTE5YzEuNjMxOTUsMCAzLjM5Njc0LC0xLjg0NjM0IDMuMzk2NzQsLTEuMzAwMjF6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMzMuMDIyNTMsMTg1LjI5NDU2YzAsMi4xMjkzNyAtMS43NzkzMSwzLjg1NTU1IC0zLjk3NDE5LDMuODU1NTVjLTIuMTk0ODgsMCAtMy45NzQxOSwtMS43MjYxOCAtMy45NzQxOSwtMy44NTU1NWMwLC0yLjEyOTM3IDEuNzc5MzEsLTMuODU1NTUgMy45NzQxOSwtMy44NTU1NWMyLjE5NDg4LDAgMy45NzQxOSwxLjcyNjE4IDMuOTc0MTksMy44NTU1NXoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIzMi45NjE5LDE4NS4yODUxMWMwLDIuMTI5MzcgLTEuNzc5MzEsMy44NTU1NSAtMy45NzQxOSwzLjg1NTU1Yy0wLjk1NTU2LDAgLTEuODMyMzQsLTAuMzI3MTggLTIuNTE3ODQsLTAuODcyMzVjLTAuMjcyNjcsLTAuMjE2ODQgLTAuNTE1MDcsLTAuNDY4MTkgLTAuNzIwMTIsLTAuNzQ3MTZjLTAuNDYzNTUsLTAuNjMwNjQgMS4zMTg2NCwtMC40Mjg1MyAyLjI3Mjg1LC0wLjY4NzU1YzIuMzI1MzIsLTAuNjMxMjMgNC45MzkzLC0zLjA1ODMgNC45MzkzLC0xLjU0ODQ5eiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjMxLjA1MjQxLDE4NS4yNjc3OWMwLDEuMDY0MDQgLTAuOTI3NjcsMS45MjY2MSAtMi4wNzIsMS45MjY2MWMtMS4xNDQzNSwwIC0yLjA3MjAxLC0wLjg2MjU4IC0yLjA3MjAxLC0xLjkyNjYxYzAsLTEuMDY0MDQgMC45Mjc2OCwtMS45MjY2IDIuMDcyMDEsLTEuOTI2NmMxLjE0NDM1LDAgMi4wNzIsMC44NjI1NyAyLjA3MiwxLjkyNjZ6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMzAuMjM3MiwxODQuNzY3ODJjMCwwLjc1MDM5IC0wLjY1MzkzLDEuMzU4NyAtMS40NjA2LDEuMzU4N2MtMC44MDY2NywwIC0xLjQ2MDU5LC0wLjYwODMgLTEuNDYwNTksLTEuMzU4N2MwLC0wLjc1MDM5IDAuNjUzOTMsLTEuMzU4NyAxLjQ2MDU5LC0xLjM1ODdjMC44MDY2NywwIDEuNDYwNiwwLjYwODMgMS40NjA2LDEuMzU4N3oiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIyNi4wODQ0NSwxODQuMTY3NTZjMCwwIDAuMzg5ODUsLTAuNzczNTcgMC42ODY0MiwtMC45OTQyN2MwLjI5NDYxLC0wLjIxOTI0IDAuOTYzNDIsLTAuNDA4MSAwLjk2MzQyLC0wLjQwODEiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yMzEuNDMxOTMsMTgzLjc5NzQyYy0wLjE0NDQ1LDAuMTQ0NDUgLTEuNjkwNjYsLTAuMTA1ODEgLTEuNTM0MjcsLTAuNjc5MjFjLTAuMDExOTQsLTAuMDQ2MjYgLTAuMDE4MjksLTAuMDk0NzcgLTAuMDE4MjksLTAuMTQ0NzVjMCwtMC4zMTg5MSAwLjI1ODUzLC0wLjU3NzQ1IDAuNTc3NDUsLTAuNTc3NDVjMC4yMjA2NywwIDAuNDEyNDEsMC4xMjM3NyAwLjUwOTYyLDAuMzA1NjhjMC41MzQzMywwLjE1MzUxIDAuODk3NDEsMC42NjM4MyAwLjQ2NTQ5LDEuMDk1NzV6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMzYuNDEwMSwxODQuNjk0NDZjMCw0LjQ1MjggLTMuMDk4NDcsNy42ODc1IC04LDcuNjg3NWMtMy4wNDAxNSwwIC01LjQ1NDAyLC0wLjY5NjMyIC02Ljk0Mzg3LC0yLjY2NzQzYy0wLjkxMjE4LC0xLjIwNjgzIC0xLjU1NjEzLC0zLjIwNDExIC0xLjU1NjEzLC00Ljg5NTA3YzAsLTQuNDUyOCAzLjU5ODQ3LC03LjU2MjUgOC41LC03LjU2MjVjMi45OTQ5MywwIDUuNTY2NjksMC4xMTI2NyA2LjkxOTc5LDIuMjg1NzljMC44NjEzOSwxLjM4MzQzIDEuMDgwMjEsMy40MTk2NiAxLjA4MDIxLDUuMTUxNzF6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMzUuNTk3NjEsMTg1LjE3NTIzYzAsMy42MTEwOSAtMi45NDQ1OSw2LjUzODQ2IC02LjU3NjkyLDYuNTM4NDZjLTMuNjMyMzQsMCAtNi41NzY5MiwtMi45MjczNyAtNi41NzY5MiwtNi41Mzg0NmMwLC0zLjYxMTA5IDIuOTQ0NTgsLTYuNTM4NDYgNi41NzY5MiwtNi41Mzg0NmMzLjYzMjM0LDAgNi41NzY5MiwyLjkyNzM3IDYuNTc2OTIsNi41Mzg0NnoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIyOC4xMjY1MywxODAuNTg1MzdjLTEuMjg4NCwtMC4wMzY5IC0zLjI3NTUzLDAuNjUzOSAtNC45NDYxLDEuMzI1NzNjLTEuNjk1MTEsMC42ODE2OSAtMy4wNjQyOCwxLjM0Mzg2IC0zLjA0NjgyLDEuMjA2NDNjMC4wMTE4OCwtMC4wOTM1MyAwLjgwMTE2LC0yLjg0Njk1IDEuMzE1NjgsLTMuNTc2NDZjMC40MDIyNCwtMC41NzAzMiAxLjQ4NTg1LC0xLjY2OSAyLjY0ODgzLC0yLjIwNDI1YzEuNDc3MTcsLTAuNjc5ODYgMy4xMjk1OSwtMC43MzM3OCA0LjE5Mjc2LC0wLjczOTEyYzIuNDk2NjIsLTAuMDEyNTUgNS4wNjUwMywwLjgyOTkxIDUuOTg2MTgsMS41MTc4MmMwLjc0NjU2LDAuNTU3NTMgMi4wNDA2OSwzLjEyMDA2IDEuOTU3NCw0LjIyNjc0Yy0wLjAzMTk3LDAuNDI0ODQgLTEuNzMxNDQsLTAuNzU1ODIgLTMuODg1MDQsLTEuMzc5OWMtMS41NjY2NiwtMC40NTM5OSAtMy42MjcxNSwtMC4zNTk5NCAtNC4yMjI4NywtMC4zNzd6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMzIuNTc3NywxODUuNzc3NDZjMCwxLjg0Mzc4IC0xLjU0MDY3LDMuMzM4NDUgLTMuNDQxMTgsMy4zMzg0NWMtMS4wNjcyNCwwIC0xLjg3NzQ5LC0wLjgwNDg4IC0xLjYwNzg1LC0xLjQxNjcxYzAuMjEwNTMsLTAuNDc3NzEgMS4yNzQ1NywtMC43OTU5MSAyLjEwNzg1LC0wLjc5NTkxYzEuNDEzMDgsMCAyLjk0MTE4LC0xLjU5ODcxIDIuOTQxMTgsLTEuMTI1ODN6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMzIuNTc3NywxODUuNzQxNzRjMCwxLjg0Mzc4IC0xLjU0MDY3LDMuMzM4NDUgLTMuNDQxMTgsMy4zMzg0NWMtMS45MDA1MSwwIC0zLjQ0MTE4LC0xLjQ5NDY3IC0zLjQ0MTE4LC0zLjMzODQ1YzAsLTEuODQzNzggMS41NDA2NywtMy4zMzg0NSAzLjQ0MTE4LC0zLjMzODQ1YzEuOTAwNTEsMCAzLjQ0MTE4LDEuNDk0NjcgMy40NDExOCwzLjMzODQ1eiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjMyLjUyNTIsMTg1LjczMzU1YzAsMS44NDM3OCAtMS41NDA2NywzLjMzODQ1IC0zLjQ0MTE4LDMuMzM4NDVjLTAuODI3NCwwIC0xLjU4NjU5LC0wLjI4MzMgLTIuMTgwMTUsLTAuNzU1MzVjLTAuMjM2MSwtMC4xODc3NiAtMC40NDU5OSwtMC40MDU0IC0wLjYyMzU0LC0wLjY0Njk1Yy0wLjQwMTM4LC0wLjU0NjA2IDEuMTQxNzksLTAuMzcxMDYgMS45NjgwMiwtMC41OTUzNGMyLjAxMzQ1LC0wLjU0NjU3IDQuMjc2ODUsLTIuNjQ4MTMgNC4yNzY4NSwtMS4zNDA4MXoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIzMC44NzE4MSwxODUuNzE4NTZjMCwwLjkyMTMzIC0wLjgwMzI1LDEuNjY4MjIgLTEuNzk0MTEsMS42NjgyMmMtMC45OTA4NywwIC0xLjc5NDEyLC0wLjc0Njg5IC0xLjc5NDEyLC0xLjY2ODIyYzAsLTAuOTIxMzMgMC44MDMyNiwtMS42NjgyMSAxLjc5NDEyLC0xLjY2ODIxYzAuOTkwODcsMCAxLjc5NDExLDAuNzQ2ODggMS43OTQxMSwxLjY2ODIxeiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjMwLjE2NTkzLDE4NS4yODU2NGMwLDAuNjQ5NzUgLTAuNTY2MjMsMS4xNzY0NyAtMS4yNjQ3MSwxLjE3NjQ3Yy0wLjY5ODQ4LDAgLTEuMjY0NywtMC41MjY3MiAtMS4yNjQ3LC0xLjE3NjQ3YzAsLTAuNjQ5NzUgMC41NjYyMywtMS4xNzY0NyAxLjI2NDcsLTEuMTc2NDdjMC42OTg0OCwwIDEuMjY0NzEsMC41MjY3MiAxLjI2NDcxLDEuMTc2NDd6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMjYuNTcwMTQsMTg0Ljc2NTg5YzAsMCAwLjMzNzU2LC0wLjY2OTgyIDAuNTk0MzYsLTAuODYwOTJjMC4yNTUxLC0wLjE4OTg0IDAuODM0MjEsLTAuMzUzMzcgMC44MzQyMSwtMC4zNTMzNyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTIzMS4yMDA0MywxODQuNDQ1MzljLTAuMTI1MDgsMC4xMjUwOCAtMS40NjM5MSwtMC4wOTE2MiAtMS4zMjg1LC0wLjU4ODEyYy0wLjAxMDM0LC0wLjA0MDA2IC0wLjAxNTg0LC0wLjA4MjA2IC0wLjAxNTg0LC0wLjEyNTM0YzAsLTAuMjc2MTQgMC4yMjM4NiwtMC41IDAuNSwtMC41YzAuMTkxMDcsMCAwLjM1NzEsMC4xMDcxNyAwLjQ0MTI3LDAuMjY0NjhjMC40NjI2NywwLjEzMjkyIDAuNzc3MDUsMC41NzQ4IDAuNDAzMDYsMC45NDg3OXoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIxNC40Mzg2MywyMDkuOTExMjNjLTIuNjk5NjksLTEuNjg1MjcgLTIuMjQ2MywtNS44ODU2NyAtMi4yNDYzLC04LjQwNTk5YzAsLTEuODYzNjUgMC41Mjc5MywtNC4zOTA0MiAyLjE1NTE0LC02LjIwMzA3YzMuMDU3OTcsLTMuNDA2NSA4LjczMjM4LC01LjYzMjcyIDEzLjE3ODIsLTUuNjMyNzJjMS4yNzY5NSwwIDguODUxMzMsMC4yNTc3NiAxMi40NzUzMywxLjY2MTM5YzIuNDE2MDcsMC45MzU3OCAxLjUwMjMyLDMuMDY3ODIgMS41Njc5NCwzLjQ1MzI4YzAuMDIwNzQsMC4xMjE4NSAtMC4wNDk5MSwxNS44MjkyNyAtMC4xNjc5MSwxNS45MTY0M2MwLDAgLTIuMDE2NDksMC40OTU4OSAtMy4zODMwNCwwLjU0NjM2Yy01Ljk4MDM5LDAuMjIwODggLTIxLjA5ODEzLDAuMjEzMjIgLTIzLjU3OTM2LC0xLjMzNTY4eiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjM4LjM2NzQzLDIwOS41OTM3MWMtMC4xMTgsLTAuMDg2MDkgMC4wODU3NywtMTQuNDk3MzUgMC4xMDY1MSwtMTQuNjE3NzFjMC4wNjU2MiwtMC4zODA3NiAtMC44NDgxMywtMi40ODY3NiAxLjU2Nzk0LC0zLjQxMTEyYzMuNjI0LC0xLjM4NjQ5IDExLjE5ODM4LC0xLjY0MTExIDEyLjQ3NTMzLC0xLjY0MTExYzQuNDQ1ODIsMCAxMC4xMjAyMywyLjE5OTAyIDEzLjE3ODIsNS41NjM5M2MxLjYyNzIxLDEuNzkwNTMgMi4xNTUxNCw0LjI4NjQ0IDIuMTU1MTQsNi4xMjczNWMwLDIuNDg5NTUgMC40NTMzOSw2LjYzODY2IC0yLjI0NjMsOC4zMDMzNWMtMi42MDczNywxLjYwNzc2IC0yMC44NjU1MiwxLjIzMzY3IC0yNi4wMzkxMywwLjgwMDhjLTAuODc0NzIsLTAuMDczMTggLTEuMTk3NjksLTEuMTI1NDkgLTEuMTk3NjksLTEuMTI1NDl6IiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpbmRleCZxdW90OzpudWxsfSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjUxLjA5MzQ0LDE5MS4wNTg1M2MwLDEuNTM3NTkgLTIuMzAxMiwxLjk5NzMgLTUuMTM3NSwyLjQxNTQ4Yy0xLjU3ODM1LDAuMjMyNzIgLTMuMDQ2MjgsMC43Mjg3MSAtNS4wMzczLDAuNzI4NzFjLTEuOTA5MDMsMCAtMy4yODM0MSwtMC40ODgyNSAtNC43OTExMSwtMC43MDA2NWMtMi44OTA0MywtMC40MDcyIC01LjIwMDc1LC0wLjg3MDcxIC01LjIwMDc1LC0yLjQ0MzU0YzAsLTIuMzkzMjQgNC41MTQ0NiwtNC4zMzMzNCAxMC4wODMzMywtNC4zMzMzNGM1LjU2ODg3LDAgMTAuMDgzMzMsMS45NDAxIDEwLjA4MzMzLDQuMzMzMzR6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMjAuNTE0MzUsMTczLjI1NjkzYy0wLjM1MzQxLC0xLjI3MjI3IC0wLjQ0MDA0LC0yLjE0MDYyIC0wLjA1NDY0LC0yLjk0Njg0YzAuNDY5NDYsLTAuOTgyMDYgMi4yMTg1NiwtMS40MDk0NCA0LjA3NzY0LC0xLjQ4ODEzYzEuNTU5NDksLTAuMDY2MDEgNi45ODU2OCwwLjY1NSA5LjkyODMxLDEuNjY3NzRjMS4wMzg4NCwwLjM1NzUzIDEuNDYwNzgsMi4zNTc3MiAwLjQ0MDgzLDIuNDg2OTljLTIuNjI3MTYsMC4zMzI5OCAtNy42NDAwOSwwLjA4MjM1IC05LjU2NTg1LDAuNDkwOTNjLTIuMjgwNjYsMC40ODM4OCAtMy44NDY5MSwxLjQ2OTA1IC00LjE0MDIsMS4zNjVjLTAuNDU3NDgsLTAuMTYyMyAtMC41NjU0OCwtMS4xNDE0NiAtMC42ODYxLC0xLjU3NTY5eiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjE5Ljg1NDM0LDE5NC44OTI2NmMwLDAuNTI1MzkgLTAuNDY0NjMsMC45NTEzIC0xLjAzNzc5LDAuOTUxM2MtMC41NzMxNSwwIC0xLjAzNzc5LC0wLjQyNTkxIC0xLjAzNzc5LC0wLjk1MTNjMCwtMC41MjUzOSAwLjQ2NDYzLC0wLjk1MTMgMS4wMzc3OSwtMC45NTEzYzAuNTczMTUsMCAxLjAzNzc5LDAuNDI1OTEgMS4wMzc3OSwwLjk1MTN6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMjEuMTM1NiwxOTkuMDI3ODJjMCwwLjUyNTM5IC0wLjQ2NDYzLDAuOTUxMzEgLTEuMDM3NzksMC45NTEzMWMtMC41NzMxNiwwIC0xLjAzNzc5LC0wLjQyNTkyIC0xLjAzNzc5LC0wLjk1MTMxYzAsLTAuNTI1MzkgMC40NjQ2MywtMC45NTEzMSAxLjAzNzc5LC0wLjk1MTMxYzAuNTczMTYsMCAxLjAzNzc5LDAuNDI1OTIgMS4wMzc3OSwwLjk1MTMxeiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjI0LjIzMjk5LDE5NS4xMjAxNGMwLDAuNTI1MzkgLTAuNDY0NjMsMC45NTEzMSAtMS4wMzc3OSwwLjk1MTMxYy0wLjU3MzE2LDAgLTEuMDM3NzksLTAuNDI1OTIgLTEuMDM3NzksLTAuOTUxMzFjMCwtMC41MjUzOSAwLjQ2NDYzLC0wLjk1MTMxIDEuMDM3NzksLTAuOTUxMzFjMC41NzMxNiwwIDEuMDM3NzksMC40MjU5MiAxLjAzNzc5LDAuOTUxMzF6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNjEuNDA0MzUsMTk4LjgyMjkxYzAsMC41MjUzOSAtMC40NjQ2MywwLjk1MTMxIC0xLjAzNzc5LDAuOTUxMzFjLTAuNTczMTYsMCAtMS4wMzc3OCwtMC40MjU5MiAtMS4wMzc3OCwtMC45NTEzMWMwLC0wLjUyNTM5IDAuNDY0NjMsLTAuOTUxMzEgMS4wMzc3OCwtMC45NTEzMWMwLjU3MzE2LDAgMS4wMzc3OSwwLjQyNTkyIDEuMDM3NzksMC45NTEzMXoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI1Ny45OTYxNCwxOTUuMDY0MzZjMCwwLjUyNTM5IC0wLjQ2NDYzLDAuOTUxMzEgLTEuMDM3NzksMC45NTEzMWMtMC41NzMxNiwwIC0xLjAzNzc4LC0wLjQyNTkyIC0xLjAzNzc4LC0wLjk1MTMxYzAsLTAuNTI1MzkgMC40NjQ2MywtMC45NTEzMSAxLjAzNzc4LC0wLjk1MTMxYzAuNTczMTYsMCAxLjAzNzc5LDAuNDI1OTIgMS4wMzc3OSwwLjk1MTMxeiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjYyLjUyOTAxLDE5NS4yNzYzOWMwLDAuNTI1MzkgLTAuNDY0NjMsMC45NTEzMSAtMS4wMzc3OSwwLjk1MTMxYy0wLjU3MzE2LDAgLTEuMDM3NzgsLTAuNDI1OTIgLTEuMDM3NzgsLTAuOTUxMzFjMCwtMC41MjUzOSAwLjQ2NDYzLC0wLjk1MTMxIDEuMDM3NzgsLTAuOTUxMzFjMC41NzMxNiwwIDEuMDM3NzksMC40MjU5MiAxLjAzNzc5LDAuOTUxMzF6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMjQuNDg0MzMsMTUxLjQyMDMxYzAsMCAxLjg2ODQ5LC00LjQxMzI3IDEuODY4NDksLTcuMzU3MThjMCwtNC40MTk3NSAtMC41MzMyMywtOS4yODY5IC0xLjc1MTcxLC0xNC4zNjQwMWMtMC40OTIxNSwtMi4wNTA2OCA3LjkyNjI0LC0yLjY2MDY0IDE2LjIzNzc4LC0yLjc0OTkyYzcuNTA1MjksLTAuMDgwNjIgMTQuOTg4MTIsMC4xMzM5OSAxNC41OTIzLDIuMzk5NThjLTMuMDkwNzUsMTcuNjkwNjggMC4yMzM1NiwyMi4wNzE1MyAwLjIzMzU2LDIyLjA3MTUzeiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjI0LjQ1NjE5LDE1MS4yMzk4YzAsMCAwLjk1NjY2LC0yLjI1OTU5IDEuNTAwOTMsLTQuNjIzNjJjMC4wNDUxNSwtMC4xOTYxMiAyOC4yMDUyOSwtMS41Nzg5MiAyOC4zMDgxNiwtMC41ODM4OGMwLjQwNywzLjkzNjY5IDEuMzcxMzMsNS4yMDc1MSAxLjM3MTMzLDUuMjA3NTF6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMjAuNzE0MjYsMTU1LjAwNDE3YzAsMCAtMS4yNzg4MiwtNS41NzQ3NCAwLjgxNzQ2LC01LjkwMjY1YzIuMDk2MjgsLTAuMzI3OTEgMjEuOTU3ODIsLTIuMjc3MDkgMzYuNzc1NiwwYzIuNjMzOTMsMC40MDQ3NiAxLjYzNDkzLDUuOTAyNjYgMS42MzQ5Myw1LjkwMjY2YzAsMCAtMTMuNDM0OTgsLTAuNzAwNjggLTIwLjA0Mjg4LC0wLjcwMDY4Yy02LjQ2NDk2LDAgLTE5LjE4NTExLDAuNzAwNjggLTE5LjE4NTExLDAuNzAwNjh6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNTkuOTIyNjYsMTcyLjg3MzcyYy0wLjEyMDYyLDAuNDM0MjMgLTAuMjI4NjIsMS40MTMzOSAtMC42ODYxLDEuNTc1NjljLTAuMjkzMjksMC4xMDQwNiAtMS44NTk1NSwtMC44ODExMiAtNC4xNDAyLC0xLjM2NWMtMS45MjU3NiwtMC40MDg1OCAtNi45Mzg2OCwtMC4xNTc5NiAtOS41NjU4NCwtMC40OTA5M2MtMS4wMTk5NiwtMC4xMjkyNyAtMC41OTgwMSwtMi4xMjk0NiAwLjQ0MDgyLC0yLjQ4Njk5YzIuOTQyNjIsLTEuMDEyNzUgOC4zNjg4MiwtMS43MzM3NSA5LjkyODMxLC0xLjY2Nzc0YzEuODU5MDgsMC4wNzg2OSAzLjYwODE4LDAuNTA2MDcgNC4wNzc2NCwxLjQ4ODEzYzAuMzg1NCwwLjgwNjIyIDAuMjk4NzcsMS42NzQ1NyAtMC4wNTQ2NCwyLjk0Njg0eiIgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aW5kZXgmcXVvdDs6bnVsbH0iIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6NTMuOTcwMjY5NTA3MTI0Mzo1My4wNjQ0MDEzNjI1NDM1OS0tPg==",
                "id": "FNAFEngine",
                "name": "FNAF Utilities",
                "color1": "#000000",
                "color2": "#757575",
                "color3": "#b3b3b3",
                "blocks": blocks
            }
        }
    }
    blocks.push({
        opcode: `game_night`,
        blockType: Scratch.BlockType.COMMAND,
        text: `Set current Night to [g_night]`,
        arguments: {
            "g_night": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1',
            },
        }
    });
    Extension.prototype[`game_night`] = (args, util) => {
        variables['g_night'] = args["g_night"]
    };

    blocks.push({
        opcode: `night`,
        blockType: Scratch.BlockType.REPORTER,
        text: `Current Night`,
        arguments: {}
    });
    Extension.prototype[`night`] = (args, util) => {
        return variables['g_night']
    };

    blocks.push({
        opcode: `set_AM`,
        blockType: Scratch.BlockType.COMMAND,
        text: `Set time to [time]AM`,
        arguments: {
            "time": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 12,
            },
        }
    });
    Extension.prototype[`set_AM`] = (args, util) => {
        variables['game_time'] = args["time"]
    };

    blocks.push({
        opcode: `gettime`,
        blockType: Scratch.BlockType.REPORTER,
        text: `Current Game Time`,
        arguments: {}
    });
    Extension.prototype[`gettime`] = (args, util) => {
        return variables['game_time']
    };

    blocks.push({
        opcode: `night_check`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `is current night [require]`,
        arguments: {
            "require": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
            },
        }
    });
    Extension.prototype[`night_check`] = (args, util) => {
        if (Boolean((variables['g_night'] == args["require"]))) {
            return true

        } else {
            return false

        };
    };

    blocks.push({
        opcode: `animatronic_create`,
        blockType: Scratch.BlockType.COMMAND,
        text: `create animatronic named [A_Name]`,
        arguments: {
            "A_Name": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '',
            },
        }
    });
    Extension.prototype[`animatronic_create`] = (args, util) => {
        variables[('A_' + args["A_Name"])] = args["A_Name"]
        variables[('A_' + (args["A_Name"] + '_D'))] = 0
        variables[('A_' + (args["A_Name"] + '_L'))] = 1
        console.log(('tried to create ' + args["A_Name"]));
        console.log(('tried to create difficulty for ' + args["A_Name"]));
        console.log(('tried to set location 1 for ' + args["A_Name"]));
    };

    blocks.push({
        opcode: `setAI`,
        blockType: Scratch.BlockType.COMMAND,
        text: `set [A_DefineAI]'s difficulty number to [A_AIset]`,
        arguments: {
            "A_DefineAI": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '',
            },
            "A_AIset": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '20',
            },
        }
    });
    Extension.prototype[`setAI`] = (args, util) => {
        variables[('A_' + (args["A_DefineAI"] + '_D'))] = args["A_AIset"]
    };

    blocks.push({
        opcode: `animatronic_view`,
        blockType: Scratch.BlockType.REPORTER,
        text: `get animatronic [recieveA]`,
        arguments: {
            "recieveA": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '',
            },
        }
    });
    Extension.prototype[`animatronic_view`] = (args, util) => {
        return (variables[('A_' + args["recieveA"])] + (', AI: ' + variables[('A_' + (args["recieveA"] + '_D'))]))
    };

    blocks.push({
        opcode: `animatronic_ai_view`,
        blockType: Scratch.BlockType.REPORTER,
        text: `get Animatronic AI for [AIView]`,
        arguments: {
            "AIView": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '',
            },
        }
    });
    Extension.prototype[`animatronic_ai_view`] = (args, util) => {
        return variables[('A_' + (args["AIView"] + '_D'))]
    };

    blocks.push({
        opcode: `Location_Set`,
        blockType: Scratch.BlockType.COMMAND,
        text: `set [A_Define]'s location number to [A_Location]`,
        arguments: {
            "A_Define": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '',
            },
            "A_Location": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
            },
        }
    });
    Extension.prototype[`Location_Set`] = (args, util) => {
        variables[('A_' + (args["A_Define"] + '_L'))] = args["A_Location"]
    };

    // just for assigning move times so you don't need a variable for it
    blocks.push({
        opcode: `timer_set`,
        blockType: Scratch.BlockType.COMMAND,
        text: `set [A_Target] total movement time to [A_Time] seconds`,
        arguments: {
            "A_Target": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '',
            },
            "A_Time": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 30,
            },
        }
    });
    Extension.prototype[`timer_set`] = (args, util) => {
        variables[('A_' + (args["A_Target"] + '_MT'))] = args["A_Time"]
    };

    blocks.push({
        opcode: `getmovetime`,
        blockType: Scratch.BlockType.REPORTER,
        text: `get move timer of [A_Target]`,
        arguments: {
            "A_Target": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '',
            },
        }
    });
    Extension.prototype[`getmovetime`] = (args, util) => {
        return variables[('A_' + (args["A_Target"] + '_MT'))]
    };

    blocks.push({
        opcode: `Animatronic_getlocation`,
        blockType: Scratch.BlockType.REPORTER,
        text: `get location of [A_RecievelocationAN]`,
        arguments: {
            "A_RecievelocationAN": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '',
            },
        }
    });
    Extension.prototype[`Animatronic_getlocation`] = (args, util) => {
        return ('Animatronic ' + (args["A_RecievelocationAN"] + (' is at ' + variables[('A_' + (args["A_RecievelocationAN"] + '_L'))])))
    };

    blocks.push({
        opcode: `animatronic_Jumpscare_Sound`,
        blockType: Scratch.BlockType.COMMAND,
        text: `Set [animatronic] jumpscare sound to [sound]`,
        arguments: {
            "animatronic": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '',
            },
            "sound": {
                type: Scratch.ArgumentType.SOUND,
            },
        }
    });
    Extension.prototype[`animatronic_Jumpscare_Sound`] = (args, util) => {
        variables[('A_' + (args["animatronic"] + '_J'))] = args["sound"]
    };

    blocks.push({
        opcode: `Animatronic_J_Get`,
        blockType: Scratch.BlockType.REPORTER,
        text: `Jumpscare sound of [animatronic]`,
        arguments: {
            "animatronic": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '',
            },
        }
    });
    Extension.prototype[`Animatronic_J_Get`] = (args, util) => {
        return variables[('A_' + (args["animatronic"] + '_J'))]
    };

    blocks.push({
        opcode: `doorMake`,
        blockType: Scratch.BlockType.COMMAND,
        text: `Create door with ID [door]`,
        arguments: {
            "door": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'door',
            },
        }
    });
    Extension.prototype[`doorMake`] = (args, util) => {
        variables[args["doortarget"]] = 'open'
        variables[(args["doortarget"] + '_State')] = 'open'
    };

    blocks.push({
        opcode: `doorSwitch`,
        blockType: Scratch.BlockType.COMMAND,
        text: `set door [doortarget]'s state to [state]`,
        arguments: {
            "doortarget": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'door',
            },
            "state": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'open',
            },
        }
    });
    Extension.prototype[`doorSwitch`] = (args, util) => {
        variables[(args["doortarget"] + '_State')] = args["state"]
    };

    blocks.push({
        opcode: `door_state`,
        blockType: Scratch.BlockType.REPORTER,
        text: `get state of [door]`,
        arguments: {
            "door": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'door',
            },
        }
    });
    Extension.prototype[`door_state`] = (args, util) => {
        return variables[(args["door"] + '_State')]
    };

    blocks.push({
        opcode: `state_closed`,
        blockType: Scratch.BlockType.REPORTER,
        text: `open`,
        arguments: {}
    });
    Extension.prototype[`state_closed`] = (args, util) => {
        return 'open'
    };

    blocks.push({
        opcode: `state_open`,
        blockType: Scratch.BlockType.REPORTER,
        text: `closed`,
        arguments: {}
    });
    Extension.prototype[`state_open`] = (args, util) => {
        return 'closed'
    };

    blocks.push({
        opcode: `camera_up`,
        blockType: Scratch.BlockType.COMMAND,
        text: `Set player's camera monitor to [state]`,
        arguments: {
            "state": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'on',
            },
        }
    });
    Extension.prototype[`camera_up`] = (args, util) => {
        variables['P_Camera'] = args["state"]
    };

    blocks.push({
        opcode: `P_camera_get`,
        blockType: Scratch.BlockType.REPORTER,
        text: `Player's monitor state`,
        arguments: {}
    });
    Extension.prototype[`P_camera_get`] = (args, util) => {
        return variables['P_Camera']
    };

    blocks.push({
        opcode: `camera_set`,
        blockType: Scratch.BlockType.COMMAND,
        text: `Set player's current camera to [cam]`,
        arguments: {
            "cam": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 1,
            },
        }
    });
    Extension.prototype[`camera_set`] = (args, util) => {
        variables['game_camera'] = args["cam"]
    };

    blocks.push({
        opcode: `camera_get`,
        blockType: Scratch.BlockType.REPORTER,
        text: `Player's current camera`,
        arguments: {}
    });
    Extension.prototype[`camera_get`] = (args, util) => {
        return variables['game_camera']
    };

    blocks.push({
        opcode: `power_set`,
        blockType: Scratch.BlockType.COMMAND,
        text: `Set power to [power]%`,
        arguments: {
            "power": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 100,
            },
        }
    });
    Extension.prototype[`power_set`] = (args, util) => {
        variables['game_power'] = args["power"]
    };

    blocks.push({
        opcode: `power_change`,
        blockType: Scratch.BlockType.COMMAND,
        text: `change power by -[power]%`,
        arguments: {
            "power": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 1,
            },
        }
    });
    Extension.prototype[`power_change`] = (args, util) => {
        variables['game_power'] = (variables['game_power'] - args["power"])
    };

    blocks.push({
        opcode: `power_get`,
        blockType: Scratch.BlockType.REPORTER,
        text: `Player's Power`,
        arguments: {}
    });
    Extension.prototype[`power_get`] = (args, util) => {
        return variables['game_power']
    };

    Scratch.extensions.register(new Extension());
})(Scratch);