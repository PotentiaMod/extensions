(function (Scratch){
    'use strict';
    const variables = {};

    class Extension {
        getInfo() {
            return {
                id: "VARIABLES",
                name: "Variables Expansion",
                blocks: [
                    {
                        opcode: "SetVarToVar",
                        text: "set temporary [var1] variable to [var2]",
                        blockType: Scratch.BlockType.COMMAND,
                        extensions: ['colours_data'],
                        arguments: {
                            var1: {
                                type: Scratch.ArgumentType.STRING
                            },
                            var2: {
                                type: Scratch.ArgumentType.STRING
                            }
                        }
                    },
                    {
                        opcode: "GetVar",
                        text: "get temporary [var1] variable",
                        blockType: Scratch.BlockType.REPORTER,
                        extensions: ['colours_data'],
                        arguments: {
                            var1: {
                                type: Scratch.ArgumentType.STRING
                            }
                        }
                    },
                    {
                        opcode: "DeleteVar",
                        text: "delete temporary [var1]",
                        blockType: Scratch.BlockType.COMMAND,
                        extensions: ['colours_data'],
                        arguments: {
                            var1: {
                                type: Scratch.ArgumentType.STRING
                            }
                        }
                    },
                ]
            }
        }
        SetVarToVar(args, util){
            variables[args.var1] = args.var2
        }
        GetVar(args, util){
            return variables[args.var1] !== undefined ? variables[args.var1] : `${args.var1} is not defined.`;
        }
        DeleteVar(args, util){
            delete(variables[args.var1]);
        }
    }

    // 'extensions' reimplementation by Xeltalliv
    // https://github.com/Xeltalliv/extensions/blob/examples/examples/extension-colors.js
    const runtime = Scratch.vm.runtime;
    const cbfsb = runtime._convertBlockForScratchBlocks.bind(runtime);
    runtime._convertBlockForScratchBlocks = function(blockInfo, categoryInfo) {
        const res = cbfsb(blockInfo, categoryInfo);
        if (blockInfo.extensions) {
            if (!res.json.extensions) res.json.extensions = [];
            res.json.extensions.push(...blockInfo.extensions);
        }
        return res;
    }
    Scratch.extensions.register(new Extension())
})(Scratch)