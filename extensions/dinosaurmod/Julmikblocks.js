// Credits to Jul mik and Turbobuilder for some of the blocks.

(function (Scratch) {
    if (!Scratch.extensions.unsandboxed) {
        throw new Error("This extension needs to be unsandboxed to run!")
    }

    class Extension {
        getInfo() {
            return {
                id: "JULMIK",
                name: "Jul Mik Blocks",
                tbShow: true,
                color1: "#04ff00",
                color2: "#ffdd00",
                blocks: [
                    {
                        opcode: "JULMIK_null",
                        text: "null",
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {}
                    },
                    {
                        opcode: "JULMIK_IsLeapYear",
                        text: "is leap year?",
                        blockType: Scratch.BlockType.BOOLEAN,
                        arguments: {}
                    },
                    {
                        opcode: "JULMIK_msSince1970",
                        text: "time \(ms\) since 1970",
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {}
                    },
                    {
                        opcode: "JULMIK_ROOT",
                        text: "[VALUE1] root [VALUE2]",
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            VALUE1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: ""
                            },
                            VALUE2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: ""
                            }
                        }
                    },
                    {
                        opcode: "JULMIK_exactlyEquals",
                        text: "[VALUE1] === [VALUE2]",
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            VALUE1: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            },
                            VALUE2: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },
                    {
                        opcode: "JULMIK_LOG",
                        text: "[VALUE1] log [VALUE2]",
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            VALUE1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: ""
                            },
                            VALUE2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: ""
                            }
                        }
                    },
                ]
            }
        }
        JULMIK_null(){
            return null
        }
        JULMIK_IsLeapYear(){
            return ((new Date(new Date(Date.now()).getYear(), 1, 29)).getDate() === 29);
        }
        JULMIK_msSince1970(){
            return Date.now();
        }
        JULMIK_ROOT(args){
            return (args.VALUE1 ** (1 / args.VALUE2))
        }
        JULMIK_exactlyEquals(args){
            return (args.VALUE1 === args.VALUE2)
        }
        JULMIK_LOG(args){
            return (Math.log(args.VALUE1) / Math.log(args.VALUE2));
        }
    }
    Scratch.extensions.register(new Extension())
})(Scratch)