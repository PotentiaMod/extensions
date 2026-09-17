// Name: Block Theme Changer
// ID: POTBlockThemeChanger
// Description: Allow you to change block themes!
// By: GaiaWindWave90 <https://scratch.mit.edu/users/kinetaV/>
// License: MPL-2.0

/* Generated with Google Gemini */
(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('This extension must be run unsandboxed!');
    }

    class POTBlockThemeChanger {
        getInfo() {
            return {
                id: 'POTBlockThemeChanger',
                name: 'Block Theme Changer',
				color1: '#C38500',
                blocks: [
                    {
                        opcode: 'setDarkTheme',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set block theme to dark'
                    },
                    {
                        opcode: 'setHighContrastTheme',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set block theme to high contrast'
                    },
                    {
                        opcode: 'setDefaultTheme',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set block theme to original'
                    }
                ]
            };
        }

        _dispatchTheme(themeMode) {
            try {
                const store = window.ReduxStore;
                if (!store || typeof store.dispatch !== 'function') {
                    console.error("A ReduxStore object could not be found!");
                    return;
                }

                // Get the current immutable Theme object from the Redux state
                const currentState = store.getState();
                const currentThemeObj = currentState.scratchGui && currentState.scratchGui.theme && currentState.scratchGui.theme.theme;

                if (currentThemeObj && typeof currentThemeObj.set === 'function') {
                    // Update the "blocks" layout property on the existing immutable Theme object
                    // Allowed values for blocks: 'three' (default), 'dark', 'high-contrast'
                    const newThemeObj = currentThemeObj.set('blocks', themeMode);

                    store.dispatch({
                        type: 'scratch-gui/theme/SET_THEME',
                        theme: newThemeObj
                    });
                } else {
                    console.error("Could not read the active immutable theme object from state.");
                }
            } catch (e) {
                console.error("Failed to update theme via ReduxStore:", e);
            }
        }

        setDarkTheme() {
            this._dispatchTheme('dark');
        }

        setHighContrastTheme() {
            this._dispatchTheme('high-contrast');
        }

        setDefaultTheme() {
            this._dispatchTheme('three'); // 'three' is the internal ID for the classic layout
        }
    }

    Scratch.extensions.register(new POTBlockThemeChanger());
})(Scratch);