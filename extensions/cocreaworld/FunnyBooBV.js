// 图片来自于 https://assets.ccw.site/extension/BilibiliVideoEXT
// 其它代码使用 MIT 开源协议
// 作者：FunnyBoo


(function (Scratch) {
    if (!Scratch.extensions.unsandboxed) {
        return;
    }
    const { BlockType, ArgumentType, extensions } = Scratch;
    const runtime = Scratch.vm.runtime;
    const vm = runtime.extensionManager.vm;
    class BilibiliVideoExtension {
        parentDomSelector = ".ccw-stage-wrapper div:first-child";
        constructor() {
            this.videoElement = null;
            this.videos = {};
            this.current = null;
        }
        try(func) {
            try {
                var ran = func.call(this);
                if (ran instanceof Promise) {
                    return ran.catch(err => {
                        console.error(err)
                        return err;
                    })
                }
                return ran;
            } catch (err) {
                console.error(err)
                return err;
            }
        }
        refreshDom() {
            debugger;
            this.parentDom = document.querySelector(this.parentDomSelector);
            if (!this.parentDom) throw new Error("舞台异常")
        }

        getInfo() {
            return {
                "blockIconURI": "https://m.ccw.site/user_projects_assets/4ba7d3eea5c5846e8fd3e6ef6ff43056.png",
                "id": "FunnyBooBV",
                "name": "B站视频扩展",
                "color1": "#FF69B4",
                "color2": "#EE5E85",
                "docsURI": "https://learn.ccw.site/article/ae1df28c-9c3b-4cba-a8d2-c48dc38f8aa7",
                "blocks": [
                    {
                        "opcode": "playBilibiliVideo",
                        "blockType": BlockType.COMMAND,
                        "text": "加载视频 [BILIBILI_ID] 并命名为 [NEW_ID]",
                        "arguments": {
                            "BILIBILI_ID": {
                                "type": ArgumentType.STRING,
                                "defaultValue": "BV16dMyzwEQ6"
                            },
                            "NEW_ID": {
                                "type": ArgumentType.STRING,
                                "defaultValue": "video1"
                            }
                        }
                    },
                    {
                        "opcode": "playVideoById",
                        "blockType": BlockType.COMMAND,
                        "text": "显示并播放视频ID [VIDEO_ID]",
                        "arguments": {
                            "VIDEO_ID": {
                                "type": ArgumentType.STRING,
                                "defaultValue": "video1"
                            }
                        }
                    },
                    {
                        "opcode": "stopVideo",
                        "blockType": BlockType.COMMAND,
                        "text": "停止播放视频"
                    },
                    {
                        "opcode": "removeVideo",
                        "blockType": BlockType.COMMAND,
                        "text": "释放播放 ID [VIDEO_ID]",
                        "arguments": {
                            "VIDEO_ID": {
                                "type": ArgumentType.STRING,
                                "defaultValue": "video1"
                            }
                        }
                    },
                    {
                        "opcode": "currentVideo",
                        "blockType": BlockType.REPORTER,
                        "text": "当前播放视频"
                    },
                    {
                        "opcode": "allVideo",
                        "blockType": BlockType.REPORTER,
                        "text": "所有已加载的视频"
                    },
                    "---",
                    {
                        "text": "*关于此扩展",
                        "blockType": BlockType.LABEL
                    },
                    {
                        "text": "原扩展",
                        "blockType": BlockType.BUTTON,
                        "func": "source"
                    },
                    {
                        "text": "FunnyBoo的B站空间",
                        "blockType": BlockType.BUTTON,
                        "func": "funnybooBili"
                    },
                ]
            };
        }

        source() {
            window.open("https://assets.ccw.site/extension/BilibiliVideoEXT")
        }

        funnybooBili() {
            window.open("https://space.bilibili.com/1231794539")
        }
        closeIframe() {
            return this.try(() => {
                this.refreshDom();
                document.querySelectorAll("#FunnyBooBV-Iframe").forEach(e => e.remove())
            })
        }
        playBilibiliVideo(args) {
            const videoID = String(args.BILIBILI_ID);
            if (videoID == "") return;
            const videoId = videoID.match(/BV([a-zA-Z0-9]+)/)[1];
            if (videoId) {
                this.videos[args.NEW_ID] = videoID;
                return this.playVideoById({ VIDEO_ID: args.NEW_ID });
            }
        }

        stopVideo() {
            if (this.videoElement) {
                this.closeIframe();
                this.videoElement = null;
                this.current = null;
            }
        }

        removeVideo({ VIDEO_ID }) {
            if (!this.videos[VIDEO_ID]) return;
            if (this.current == VIDEO_ID) {
                this.stopVideo();
            }
            delete this.videos[VIDEO_ID];
        }

        currentVideo() {
            return this.current ? this.current : ""
        }

        allVideo() {
            return JSON.stringify(Object.keys(this.videos))
        }
        playVideoById({ VIDEO_ID }) {
            debugger;
            if (this.current == VIDEO_ID) return;
            if (!this.videos[VIDEO_ID]) return;
            if (this.videoElement) {
                this.stopVideo()
            }
            return this.try(function () {
                this.closeIframe();
                this.refreshDom();
                this.videoElement = document.createElement('iframe');
                this.videoElement.id = "FunnyBooBV-Iframe"
                this.videoElement.style.cssText = `
display: flex;
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
flex-direction: column;
                `
                this.videoElement.sandbox = "allow-scripts allow-same-origin allow-popups allow-modals"
                this.parentDom.appendChild(this.videoElement);
                const videoID = this.videos[VIDEO_ID];
                if (!videoID) return;
                this.current = VIDEO_ID;
                const videoId = videoID.match(/BV([a-zA-Z0-9]+)/)[1];
                const embedUrl = `https://player.bilibili.com/player.html?bvid=${videoId}&autoplay=1&muted=0`;
                this.videoElement.src = embedUrl;
            })
        }
    }

    Scratch.extensions.register(new BilibiliVideoExtension());
})(Scratch);    