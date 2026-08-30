class WebPingExtension {
    constructor() {
        this.lastDelay = 0;
        this.isLoading = false;
    }

    getInfo() {
        return {
            id: 'webping',
            name: '网站延迟检测',
            color1: '#2980b9',
            color2: '#1f618d',
            color3: '#154360',
            blocks: [
                {
                    opcode: "measureWebsiteDelay",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "检测 [URL] 的延迟",
                    arguments: {
                        URL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "https://example.com"
                        }
                    }
                },
                {
                    opcode: "getLastDelay",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "上次延迟(毫秒)"
                },
                {
                    opcode: "isTesting",
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: "正在检测中?"
                }
            ]
        };
    }

    async measureWebsiteDelay(args) {
        const url = args.URL;
        this.isLoading = true;
        const startTime = performance.now();
        try {
            // 添加随机参数，避免浏览器缓存
            const nocacheUrl = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
            const controller = new AbortController();
            // 5秒超时
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            await fetch(nocacheUrl, {
                mode: 'no-cors',
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            const endTime = performance.now();
            this.lastDelay = Math.round(endTime - startTime);
        } catch (err) {
            // 超时 / 跨域错误 → 设置为 -1 代表失败
            this.lastDelay = -1;
        }
        this.isLoading = false;
    }

    getLastDelay() {
        return this.lastDelay;
    }

    isTesting() {
        return this.isLoading;
    }
}

Scratch.extensions.register(new WebPingExtension());
