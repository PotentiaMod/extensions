// Name: GUI Theme Changer
// ID: POTGUIThemeChanger
// Description: Allow you to change GUI Themes!
// By: GaiaWindWave90 <https://scratch.mit.edu/users/kinetaV/>
// License: MPL-2.0

/* Edited version of Block Theme Changer */
(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('This extension must be run unsandboxed!');
    }
	
	const isPot = Scratch.extensions.isPotentiaMod;
	const isPM = Scratch.extensions.isPenguinMod;
	const isMW = Scratch.extensions.isMistWarp;

    class POTGUIThemeChanger {
        getInfo() {
            return {
                id: 'POTGUIThemeChanger',
                name: 'GUI Theme Changer',
				color1: '#7C97AD',
                blocks: [
                    {
                        opcode: 'setLightTheme',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set GUI theme to light'
                    },
                    {
                        opcode: 'setDarkTheme',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set GUI theme to dark'
                    },
					{
                        opcode: 'setMWMidnightTheme',
                        blockType: Scratch.BlockType.COMMAND,
						hideFromPalette: !isMW,
                        text: 'set GUI theme to midnight'
                    },
					{
                        opcode: 'setMidnightTheme',
                        blockType: Scratch.BlockType.COMMAND,
						hideFromPalette: !isPot,
                        text: 'set GUI theme to midnight'
                    },
					{
                        opcode: 'setGenesisLightTheme',
                        blockType: Scratch.BlockType.COMMAND,
						hideFromPalette: !isPot,
                        text: 'set GUI theme to Genesis Light'
                    },
					{
                        opcode: 'setGenesisDarkTheme',
                        blockType: Scratch.BlockType.COMMAND,
						hideFromPalette: !isPot,
                        text: 'set GUI theme to Genesis Dark'
                    },
					{
                        opcode: 'setModernLightTheme',
                        blockType: Scratch.BlockType.COMMAND,
						hideFromPalette: !isPot,
                        text: 'set GUI theme to PotentiaMod Light'
                    },
					{
                        opcode: 'setModernDarkTheme',
                        blockType: Scratch.BlockType.COMMAND,
						hideFromPalette: !isPot,
                        text: 'set GUI theme to PotentiaMod Dark'
                    },
					{
                        opcode: 'setHighContrastTheme',
                        blockType: Scratch.BlockType.COMMAND,
						hideFromPalette: !isPot,
                        text: 'set GUI theme to high-contrast'
                    },
					{
                        opcode: 'setAmoledTheme',
                        blockType: Scratch.BlockType.COMMAND,
						hideFromPalette: !isPM,
                        text: 'set GUI theme to amoled' //This only works on the version of PenguinMod built from the newer TurboWarp that has accents and GUI colors.
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
                    const newThemeObj = currentThemeObj.set('gui', themeMode);

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
		
		setMidnightTheme() {
            this._dispatchTheme('midnight');
        }
		
		setMWMidnightTheme() {
            this._dispatchTheme('midnight');
        }
		
		setGenesisLightTheme() {
            this._dispatchTheme('genesislight');
        }
		
		setGenesisDarkTheme() {
            this._dispatchTheme('genesisdark'); //This may cause the sprite to move to a random location. Just ignore it.
        }
		
		setModernLightTheme() {
            this._dispatchTheme('modern-light');
        }
		
		setModernDarkTheme() {
            this._dispatchTheme('modern-dark');
        }
		
		setHighContrastTheme() {
            this._dispatchTheme('high-contrast');
        }
		
		setAmoledTheme() {
            this._dispatchTheme('amoled');
        }

        setLightTheme() {
            this._dispatchTheme('light'); // default
        }
    }

    Scratch.extensions.register(new POTGUIThemeChanger());
})(Scratch);