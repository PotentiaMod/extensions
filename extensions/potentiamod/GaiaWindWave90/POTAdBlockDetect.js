// Name: AdBlock Detection
// ID: POTAdBlockDetect
// Description: A block that detects ad-blocking browser extensions.
// By: GaiaWindWave90 <https://scratch.mit.edu/users/kinetaV/>
// License: MPL-2.0

/* Edited by Gaiamod Extension Editor */
/* Also generated with Google Gemini */
Scratch.translate.setup({});
(function (Scratch) {
    'use strict';
    if (!Scratch.extensions.unsandboxed) {
        throw new Error('AdBlock Detection must be run unsandboxed');
    }
    const VM = Scratch.vm;

    // opcode constants for all blocks
    const POTAdBlockDetect_checkAdBlocker = 'POTAdBlockDetect_checkAdBlocker';

    // Public JS
    const BlockType = Scratch.BlockType;
    const ArgumentType = Scratch.ArgumentType;
    const Cast = Scratch.Cast;

    class POTAdBlockDetect {
        getInfo() {
            return {
                name: 'AdBlock Detection',
                id: 'POTAdBlockDetect',
                color1: '#c30000',
                blocks: [
                    {
                        opcode: 'checkAdBlocker',
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate('Check AdBlocker'),
                        isTerminal: false,
                        arguments: {},
                    },
					{
                        opcode: 'checkAdBlockerCheck',
                        // CHANGED: Turned this into a BOOLEAN block so it fits inside IF blocks
                        blockType: Scratch.BlockType.BOOLEAN, 
                        text: Scratch.translate('is AdBlocker active?'),
                        disableMonitor: true,
                        arguments: {},
                    },
                ],
                menus: {},
            };
        }
        async checkAdBlocker(args) {
            try {
                // Using an official Google Ad URL that is blacklisted by all adblockers
                const targetUrl = 'https://googlesyndication.com';

                try {
                    // We send a lightweight HEAD request just to check the connection status
                    const response = await fetch(targetUrl, {
                        method: 'HEAD',
                        mode: 'no-cors',
                    });

                    // Modern adblockers fake a "200 OK" redirect, but Google never redirects this JS path.
                    // If it was redirected or manipulated, an adblocker is present.
                    if (response.redirected) {
                        alert("Adblocker detected!");
                        console.log('Adblocker detected!');
                        return true;
                    }

                    alert("No adblocker detected.");
                    console.log('No adblocker detected.');
                    return false;
                } catch (error) {
                    // If the browser blocks the connection entirely, catch triggers.
                    alert("Adblocker detected!");
                    console.log('Adblocker detected!');
                    return true;
                }
            } catch (e) {
                console.error(`checkAdBlocker error: e`);
                return e;
            }
        }
		
		async checkAdBlockerCheck(args) {
            // BEST PRACTICE: Use the specific script URL that adblockers hate
            const targetUrl = 'https://googlesyndication.com';
            
            try {
                const response = await fetch(targetUrl, {
                    method: 'HEAD',
                    mode: 'no-cors',
                });

                if (response.redirected) {
                    return true;
                }

                console.log('No adblocker detected.');
                return false;
            } catch (error) {
                return true;
            }
        }
    }
    Scratch.extensions.register(new POTAdBlockDetect());
})(Scratch);
