// Name: PotentiaMod Blocks
// ID: POTPotentiaModBlocks
// Description: Weird new blocks, but it's a Javascript modified port of TurboWarp Blocks.
// By: GaiaWindWave90 <https://github.com/gaiawindwave90/>
(function (Scratch) {
	"use strict";
	
	const BlockType = Scratch.BlockType;
    const ArgumentType = Scratch.ArgumentType;
    const Cast = Scratch.Cast;
    const log = Scratch.log;
	
// eslint-disable-next-line max-len
const iconURI = `data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2Ny44NSIgaGVpZ2h0PSI4My40MyIgdmlld0JveD0iMCwwLDY3Ljg1LDgzLjQzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA2LC0xMzkuMDQ4KSI+PGcgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIj48cGF0aCBkPSJNMjcxLjk3LDE2Ni4zNThjLTAuMDMsMC4yOSAtMC4wNywwLjU3IC0wLjEyLDAuODVjLTEuMzMsNi45NyAtNC45OSwxMi41MyAtMTAuNTksMTYuMWMtMy4zNywyLjE2IC03LjgyLDMuNjkgLTEzLjU2LDQuNjVjLTAuMDIsMC4wMSAtMC4wNCwwLjAxIC0wLjA2LDAuMDFjMC4wMywwLjk4IDAuMDYsMi4wNyAwLjA4LDMuMjZjNS42MSwwLjIxIDguODMsMy4xMSAxMC4zNiw1LjAxYzEuMzksMS43MSAyLjk3LDQuNTYgMi45Nyw4LjY3YzAsNi41OSAtNC4yNiwxMS45NyAtMTAuNiwxMy4zOGMtMi40NywwLjU1IC01LjE2LDAuNjggLTgsMC4zN2gtMC4wNmMtMC4xNywwIC0wLjUsMC4wMSAtMS4wNiwwLjA3Yy0yLjk0LDAuMzMgLTMuODUsMC40MSAtNC40MywwLjQzYy0wLjUxLDAuMDMgLTEuODMsMC4xNSAtNC44MywwLjU5Yy0zLjQ1LDAuNTEgLTUuNzcsMC43MyAtNy41MywwLjczYy00LjQ2LDAgLTguMTYsLTEuMTkgLTExLjAxLC0zLjU1Yy00LjgxLC0zLjg4IC02LjA4LC0xMC4yNyAtMy4xNSwtMTUuNTZjMi4wNCwtMy45IDQuOTMsLTUuNzEgNy4xNiwtNi41NWMwLjk2LC0wLjM4IDIsLTAuNjggMy4xLC0wLjkxdi0wLjAxYy0wLjI5LC0xLjY2IC0wLjM5LC0zLjYzIC0wLjMzLC02LjI1di00LjE3Yy0wLjE5LC0wLjc5IC0wLjM1LC0xLjcxIC0wLjM1LC0yLjh2LTUuNWMtMC4wMiwtMC4yNiAtMC4wNCwtMC41MyAtMC4wNSwtMC44Yy0wLjA0LC0wLjcyIC0wLjA5LC0xLjgxIC0wLjE1LC0zLjI1Yy0wLjAyLC0wLjY4IC0wLjA1LC0xLjQ0IC0wLjA5LC0yLjI3Yy0zLjQ0LC0wLjYyIC02LjUxLC0yLjMzIC04Ljg0LC00Ljk3Yy0xLjQxLC0xLjYgLTIuMzMsLTMuNTkgLTIuNjMsLTUuNzFjLTAuMTQsLTAuOTIgLTAuMiwtMS44MyAtMC4yLC0yLjdjMCwtMy43NyAxLjYyLC03LjI5IDQuNDUsLTkuNjZjMC4xMiwtMC4xIDAuMjMsLTAuMTkgMC4zNSwtMC4yOGMzLjAyLC0yLjMzIDYuODMsLTMuNjcgMTEuNjQsLTQuMWMwLjEyLC0wLjAxIDAuMjQsLTAuMDIgMC4zNSwtMC4wM2w2LjI2LC0wLjM1YzAuMiwtMC4wMSAwLjQxLC0wLjAxIDAuNjEsLTAuMDFoNi4zMmMxLjk1LC0wLjA3IDMuNSwtMC4wNiA0Ljg1LDAuMDFjMC4xMSwwLjAxIDAuMjMsMC4wMiAwLjM0LDAuMDNjMy4zNCwwLjI5IDcuMzYsMS4wNSAxMi4yOSwyLjMzYzAuMjUsMC4wNyAwLjUxLDAuMTUgMC43NiwwLjIzYzAuODgsMC4zIDEuNTQsMC42MSA0LjExLDEuOTRjMi4wNSwxLjA0IDQuMDIsMi40OSA1Ljg1LDQuMzFjMy4wMiwyLjkxIDQuODIsNi4xNiA1LjM4LDkuNjdjMCwwLjA1IDAuMDEsMC4xIDAuMDIsMC4xNmMwLjQ3LDMuMjkgMC41Nyw1LjAzIDAuMzksNi42M3oiIGZpbGw9IiM0ODAwY2MiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHBhdGggZD0iTTI2MS4wNDIsMTY1LjE0OWMtMC43NiwzLjk4OCAtMi42Niw2Ljk0OSAtNS42OTcsOC44ODRjLTIuMTA0LDEuMzUgLTUuMjYsMi4zNzUgLTkuNDY2LDMuMDc5Yy01LjE0NCwwLjg4IC04LjI5OCwxLjUyNSAtOS40NjYsMS45MzZ2NC41NzNjMC4xNzUsMS44NzggMC4yOTIsNS40ODQgMC4zNSwxMC44MTljMC4wNTgsMy41NzcgMC4zNzksNi40OCAwLjk2Miw4LjcwOGMwLjA1OCwwLjExOCAwLjQ5NSwwLjExOCAxLjMxMSwwYzEuMTA2LC0wLjA1OCAyLjc5NiwtMC4yMDUgNS4wNjksLTAuNDM5YzAuNDY2LC0wLjExNyAxLjE2NSwtMC4yNjQgMi4wOTgsLTAuNDRjMS42MzEsLTAuMTc2IDIuNzM3LDAuMTE4IDMuMzIsMC44OGMwLjM0OSwwLjQxMSAwLjUyNCwwLjk5OCAwLjUyNCwxLjc2YzAsMS40NjcgLTAuNjU5LDIuMzQ2IC0xLjk3OSwyLjYzOWMtMS4zMTksMC4yOTQgLTIuODAyLDAuMzUyIC00LjQ0MiwwLjE3NmMtMC45MzgsLTAuMTE2IC0yLjE0MiwtMC4wODggLTMuNjA2LDAuMDg4Yy0yLjExMSwwLjIzNSAtMy4yODQsMC4zNTIgLTMuNTE5LDAuMzUyYy0xLjIzMSwwLjA2IC0zLjI0LDAuMjk1IC02LjAyNSwwLjcwNGMtMi43ODUsMC40MDkgLTQuNzY1LDAuNjE2IC01LjkzNywwLjYxNmMtMS44NzgsMCAtMy4yMjcsLTAuMzU5IC00LjA0NywtMS4wNzRjLTAuNzAzLC0wLjUzNyAtMC44NTEsLTEuMTM0IC0wLjQzOSwtMS43OWMwLjQwOSwtMC44MzYgMC44OCwtMS4zNDMgMS40MDcsLTEuNTIxYzEuMTczLC0wLjQ3OCAyLjgxNCwtMC43MTcgNC45MjYsLTAuNzE3YzEuNDY1LDAgMy40LC0wLjE3NCA1LjgwNiwtMC41MjZjLTAuMTE4LC0wLjk5NSAtMC4xNDcsLTIuNDU3IC0wLjA4OCwtNC4zOWMwLC0wLjQ2NyAtMC4wNiwtMS4xNzEgLTAuMTc2LC0yLjEwOGMwLC0wLjA1OCAtMC4wNDQsLTAuMjAzIC0wLjEzMywtMC40MzdjLTAuMDg4LC0wLjIzNCAtMC4xMzIsLTAuNDEgLTAuMTMyLC0wLjUyOGMwLC0yLjE2NiAtMC4wMywtMy40ODIgLTAuMDg4LC0zLjk1MWMtMC4yMzQsLTAuODE5IC0wLjMyMiwtMi4zNjkgLTAuMjY0LC00LjY1M2MwLC0zLjIxOSAwLC01LjAwMyAwLC01LjM1NWMwLC0wLjM1MiAtMC4wNTksLTAuNzE3IC0wLjE3NiwtMS4wOThjLTAuMTE4LC0wLjM3OSAtMC4xNzYsLTAuNiAtMC4xNzYsLTAuNjU4di01Ljg4M2MwLDEuMDU1IC0wLjIzNSwtNC41NjQgLTAuNzA0LC0xNi44NTZjMCwtMC40MDkgLTAuMTc2LC0wLjczMSAtMC41MjcsLTAuOTY2Yy0wLjc2MywwLjA1OSAtMS45NSwwLjI2NCAtMy41NjIsMC42MTVjLTEuNjEzLDAuMzUyIC0yLjgwMSwwLjUyNyAtMy41NjIsMC41MjdjLTEuNDY3LDAgLTIuNjM5LC0wLjQ5NyAtMy41MTksLTEuNDk1Yy0wLjA1OSwtMC40MDkgLTAuMDg4LC0wLjc5MSAtMC4wODgsLTEuMTQ0YzAsLTAuNTI3IDAuMTc2LC0wLjkzNyAwLjUyNywtMS4yMzFjMS4yOSwtMC45OTYgMy4yNTUsLTEuNjEyIDUuODk0LC0xLjg0N2MyLjA1MiwtMC4xMTcgNC4xMzUsLTAuMjMzIDYuMjQ1LC0wLjM1MmMwLjI5MywwIDAuNzA0LDAgMS4yMzEsMGMwLjUyOCwwIDAuOTA5LDAgMS4xNDQsMGMwLjQ2OSwwIDEuODQ4LDAgNC4xMzUsMGMxLjY0MSwtMC4wNTkgMi45OSwtMC4wNTkgNC4wNDYsMGMyLjY5NiwwLjIzNCA2LjE4NywwLjkwOSAxMC40NjgsMi4wMjJjMC4xNzYsMC4wNiAxLjA1NSwwLjQ5OSAyLjYzOSwxLjMxOWMxLjA1NSwwLjUyOCAyLjExMSwxLjMxOSAzLjE2NiwyLjM3NWMxLjI4OSwxLjIzMSAyLjAyMywyLjQwNSAyLjE5OSwzLjUxOWMwLjI5MywyLjA1MSAwLjQxLDMuMzQxIDAuMzUxLDMuODY4ek0yNTUuNzY1LDE2My45NTVjLTEuMDU3LC01LjAwOCAtNy4yNzEsLTcuNTQyIC0xOC42NDcsLTcuNjAyYy0wLjI5NCwwIC0wLjczNCwwLjE3OCAtMS4zMTksMC41M2MwLDAuNTkgMC4wODgsMi43NyAwLjI2NCw2LjU0MWMwLjA1OCwyLjQ3NiAwLjIwNSw2LjE4OCAwLjQzOCwxMS4xMzdjMC4xMTUsMCAwLjkzMywtMC4wODggMi40NTIsLTAuMjY2YzAuNDY2LDAgMS4xMDcsLTAuMDg4IDEuOTI1LC0wLjI2NWMyLjgwMywtMC40NzEgNS42MzQsLTAuOTcyIDguNDk1LC0xLjUwM2MzLjQ0MywtMC44MjQgNS40ODYsLTIuNjggNi4xMjksLTUuNTY4YzAuMzUxLC0xLjIzNyAwLjQzOSwtMi4yMzcgMC4yNjMsLTMuMDA0eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9nPjwvc3ZnPg==`;

/**
 * Class for PotentiaMod blocks
 * @constructor
 */
class PotentiaModBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'pot',
            name: 'PotentiaMod',
            color1: '#4800cc',
            color2: '#37009d',
            color3: '#5600f5',
            menuIconURI: iconURI,
            blockIconURI: iconURI,
            blocks: [
			// Sudden XML
               {
                    blockType: Scratch.BlockType.XML,
                    xml: '<block type="argument_reporter_boolean"><field name="VALUE">is compiled?</field></block>'
                },
				{
                    blockType: Scratch.BlockType.XML,
                    xml: '<block type="argument_reporter_boolean"><field name="VALUE">is PotentiaMod?</field></block>'
                },
		  // OK there
                {
                    opcode: 'getLastKeyPressed',
                    text: 'last key pressed',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getButtonIsDown',
                    text: '[MOUSE_BUTTON] mouse button down?',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        MOUSE_BUTTON: {
                            type: ArgumentType.NUMBER,
                            menu: 'mouseButton',
                            defaultValue: '0'
                        }
                    }
                }
            ],
            menus: {
                mouseButton: {
                    items: [
                        {
                            text: '(0) primary',
                            value: '0'
                        },
                        {
                            text: '(1) middle',
                            value: '1'
                        },
                        {
                            text: '(2) secondary',
                            value: '2'
                        }
                    ],
                    acceptReporters: true
                }
            }
        };
    }

    getLastKeyPressed (args, util) {
        return util.ioQuery('keyboard', 'getLastKeyPressed');
    }

    getButtonIsDown (args, util) {
        const button = Cast.toNumber(args.MOUSE_BUTTON);
        return util.ioQuery('mouse', 'getButtonIsDown', [button]);
    }
}

	Scratch.extensions.register(new PotentiaModBlocks());
  })(Scratch);
  