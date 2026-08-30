(Scratch => {
    const { BlockType, ArgumentType, extensions } = Scratch;
    const disableMonitor = true;
    class Extension {
        预设 = {
            "Gandi": "https://m.ccw.site/gandi/GandiIDE.png",
            "GandiExt": "https://m.ccw.site/gandi/GandiIDE_Ext.png",
            "甘地IDE": "https://zhishi.oss-cn-beijing.aliyuncs.com/user_projects_assets/bc4bfd7384cf49a9e2cdb9df024d0155.png",
        }
        getInfo() {
            return {
                id: "FunnyBooGandiIconEditor",
                name: "Gandi 图标编辑器",
                color1: "#000000",
                color2: "#000000",
                color3: "#ffffff",
                blocks: [
                    {
                        opcode: "图标DOM",
                        blockType: BlockType.REPORTER,
                        text: "Gandi 图标 DOM",
                        disableMonitor,
                    },
                    {
                        opcode: "当前图标链接",
                        blockType: BlockType.REPORTER,
                        text: "Gandi 当前图标链接",
                    },
                    {
                        opcode: "图标显示",
                        blockType: BlockType.COMMAND,
                        text: "[show] Gandi 图标",
                        arguments: {
                            show: {
                                defaultValue: "show",
                                menu: "show"
                            }
                        },
                        disableMonitor,
                    },
                    {
                        opcode: "修改图标",
                        blockType: BlockType.COMMAND,
                        text: "修改 Gandi 图标为 [src]",
                        arguments: {
                            src: {
                                type: ArgumentType.STRING,
                                defaultValue: "https://zhishi.oss-cn-beijing.aliyuncs.com/user_projects_assets/bc4bfd7384cf49a9e2cdb9df024d0155.png",
                            }
                        },
                    },
                    {
                        opcode: "预设图标",
                        blockType: BlockType.COMMAND,
                        text: "修改 Gandi 图标为 [预设]",
                        arguments: {
                            预设: {
                                defaultValue: "Gandi",
                                menu: "预设"
                            }
                        },
                    },
                ],
                menus: {
                    show: {
                        acceptReporters: false,
                        items: [
                            {
                                text: "显示",
                                value: "show"
                            },
                            {
                                text: "隐藏",
                                value: "hide"
                            },
                        ]
                    },
                    预设: {
                        acceptReporters: false,
                        items: Object.keys(this.预设)
                    },
                },
            }
        }


        图标DOM() {
            return document.querySelector("img.gandi_menu-bar_logo_1IULC")
        }
        当前图标链接() {
            return this.图标DOM()?.src
        }
        图标显示({ show }) {
            if (!this.图标DOM()) return;
            switch (show) {
                case "show": {
                    this.图标DOM().style.display = "unset";
                    return;
                };
                case "hide": {
                    this.图标DOM().style.display = "none";
                    return;
                };
            }
        }
        修改图标({ src }) {
            if (!this.图标DOM()) return;
            this.图标DOM().src = String(src);
        }
        预设图标({ 预设 }) {
            if (!this.图标DOM() || !this.预设[预设]) return;
            this.图标DOM().src = this.预设[预设];
        }
    }
    extensions.register(new Extension())
})(Scratch)