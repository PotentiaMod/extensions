// Name: Nostalgist - 游戏机模拟器
// ID: nostalgist
// Description: 支持 FC、GBA 等平台上的游戏
// By: 酷可mc
// Original: 酷可mc
// License: MPL-2.0
(async function (_Scratch) {
    class NostalgistScratchExtension {
        constructor(runtime) {
            this.runtime = runtime;
            this.rom = null; // 存储加载的 ROM
            this.fullScreenCanvas = null; // 存储模拟器的 canvas 元素
            this.nostalgist = null; // Nostalgist 实例
            this.styleObserver = null; // 观察器
            this.FS = null
            this.Module = null
            this.Archive = null
        }

        getInfo() {
            return {
                id: 'nostalgist',
                name: 'Nostalgist',
                color1: '#A52532',
                color2: '#FFFFFF',
                blockIconURI: 'data:image/png;base64,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',
                blocks: [
                    `--- 🖥️游戏ROM`,
                    {
                        opcode: 'loadRom',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '加载 ROM 文件 [URL] 🖥️',
                        arguments: {
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://example.com/rom.nes'
                            }
                        }
                    },
                    {
                        opcode: 'selectRom',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '选择 ROM 文件 📂',
                    },
                    `--- 🚀启动`,
                    {
                        opcode: 'startEmulator',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '启动 模拟器 🚀',
                    },
                    {
                        opcode: 'advancedstartEmulator',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '✨启动模拟器并传入配置参数 [JSON] 🚀',
                        arguments: {
                            JSON: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{"input_player1_up": "w","input_player1_down": "s","input_player1_left": "a","input_player1_right": "d","input_player1_a": "j","input_player1_b": "k","input_player1_x": "i","input_player1_y": "u","input_player1_l": "u","input_player1_r": "p"}'
                            }
                        }
                    },
                    `--- 💾游戏存档[仅GBA]`,
                    {
                        opcode: 'getGameArchive',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '获取游戏内存档Blob 💾',
                    },
                    {
                        opcode: 'loadGameArchive',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '从 [BLOB] 预加载游戏存档 🚀💾',
                        arguments: {
                            BLOB: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'blob'
                            }
                        }
                    },
                    `--- 📥即时存档[通用]`,
                    {
                        opcode: 'saveGame',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '保存游戏状态到 [ID] 💾',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'save1'
                            }
                        }
                    },
                    {
                        opcode: 'loadGame',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '加载游戏状态从 [ID] 📥',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'save1'
                            }
                        }
                    },
                    {
                        opcode: 'getSavedGame',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '获取保存的游戏状态 [ID] 🔑',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'save1'
                            }
                        }
                    },
                    {
                        opcode: 'importSaveGame',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '导入游戏状态 [TEXT] 并覆写 [ID] 📥⚠️',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'base64'
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'save1'
                            }
                        }
                    },
                    `--- ⚙️模拟器操作`,
                    {
                        opcode: 'restartGame',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '重载游戏 🔄',
                    },
                    {
                        opcode: 'hideGameScreen',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '隐藏游戏 👀❌',
                        func: 'hideGameScreen'
                    },
                    {
                        opcode: 'showGameScreen',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '显示游戏 👀✅',
                        func: 'showGameScreen'
                    },
                    {
                        opcode: 'pauseGame',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '暂停游戏 ⏸️',
                    },
                    {
                        opcode: 'resumeGame',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '恢复游戏 ▶️',
                    },
                    {
                        opcode: 'exitGame',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '关闭游戏 ❌',
                    },
                    `--- 🎮模拟按键`,
                    {
                        opcode: 'press',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '模拟按下 [KEY] 键 🟢',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'start'
                            },
                            TIME: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '100'
                            }
                        }
                    },
                    {
                        opcode: 'timepress',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '模拟按下 [KEY] 键并持续 [TIME] ms ⏱️🟢',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'start'
                            },
                            TIME: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '100'
                            }
                        }
                    },
                    `--- ✨游戏画面`,
                    {
                        opcode: 'screenshot',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '截图画面并返回Blob 📸',
                    },
                    `--- 🔧额外工具`,
                    {
                        opcode: 'blobtobase64',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '将[BLOB]转换为Base64 ➡️',
                        arguments: {
                            BLOB: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Blob'
                            },
                        }
                    },
                    {
                        opcode: 'base64toblob',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '将[BASE64]转换为Blob ⬅️',
                        arguments: {
                            BASE64: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Base64'
                            }
                        }
                    }
                ]
            };
        }

        async loadRom(args) {
            const romUrl = args.URL;
            try {
                const response = await fetch(romUrl);
                if (!response.ok) {
                    throw new Error('加载 ROM 文件失败');
                }
                const romData = await response.blob();

                // 检查扩展名
                const extension = romUrl.split('.').pop().toLowerCase();
                this.romextension = extension
                this.rom = romData;
                this.romType = this.detectRomType(extension); // 识别 ROM 类型
                console.log(`ROM 从 URL 加载成功，类型: ${this.romType}`);
            } catch (error) {
                console.error('加载 ROM 文件失败:', error);
            }
        }

        async selectRom() {
            try {
                const [fileHandle] = await window.showOpenFilePicker();
                const file = await fileHandle.getFile();

                // 检查扩展名
                const extension = file.name.split('.').pop().toLowerCase();
                this.rom = file;
                this.romType = this.detectRomType(extension); // 识别 ROM 类型
                console.log(`本地 ROM 文件加载成功，类型: ${this.romType}`);
            } catch (error) {
                console.error('加载本地 ROM 文件失败:', error);
            }
        }

        // 根据扩展名检测 ROM 类型
        detectRomType(extension) {
            const romTypes = {
                nes: 'fceumm', // NES 格式使用 fceumm 核心
                sfc: 'snes9x',
                bin: 'genesis_plus_gx',
                gb: 'mgba',
                gbc: 'mgba',
                gba: 'mgba',   // GBA 格式使用 mgba 核心
                // 可扩展其他格式和核心
            };
            return romTypes[extension] || 'unknown'; // 如果未知格式，返回 'unknown'
        }

        // 启动 模拟器并渲染到指定的 <div> 内
        async startEmulator() {
            if (!this.rom) {
                console.error('没有加载任何 ROM 文件');
                return;
            }

            if (!this.romType || this.romType === 'unknown') {
                console.error('无法识别的 ROM 类型');
                return;
            }

            try {
                const { Nostalgist } = await import('https://m.ccw.site/gandi_application/user_assets/11d179197c35398db40e5061b9f77a8d.js');

                if (!this.Archive && this.romextension !== "GBA") {
                    this.nostalgist = await Nostalgist.launch({ rom: { fileName: `rom.${this.romextension}`, fileContent: this.rom }, autoSaveState: true, savestate_thumbnail_enable: true });
                } else {
                    const self = this; // 保存当前 this 的引用
                    this.nostalgist = await Nostalgist.gba({
                        core: this.romType,
                        rom: { fileName: `rom.${this.romextension}`, fileContent: this.rom },
                        autoSaveState: true,
                        savestate_thumbnail_enable: true,
                        async beforeLaunch(nostalgist) {
                            const FS = nostalgist.getEmscriptenFS();
                            // 使用 self 引用正确的上下文
                            // 确保路径存在
                            const saveDir = '/home/web_user/retroarch/userdata/saves/mGBA';
                            if (!FS.analyzePath(saveDir).exists) {
                                FS.mkdirTree(saveDir);
                            }
                            
                            const sramContent = new Uint8Array(await self.Archive.arrayBuffer())
                            // 确保存档数据正确
                            if (!(sramContent instanceof Uint8Array)) {
                                throw new Error("Archive is not a valid Uint8Array");
                            }

                            FS.writeFile('/home/web_user/retroarch/userdata/saves/mGBA/rom.srm', sramContent)

                            self.Archive = null
                        }
                    });
                }


                this.FS = this.nostalgist.getEmscriptenFS();
                this.Module = this.nostalgist.getEmscriptenModule();

                // 查找全屏的 <canvas> 元素
                this.fullScreenCanvas = document.getElementById('canvas');
                if (!this.fullScreenCanvas) {
                    console.error('全屏 canvas 元素未找到');
                    return;
                }

                // 获取 Scratch 舞台的父元素
                const stageContainer = this.canvas().parentElement; // 获取 Scratch 舞台的容器
                stageContainer.appendChild(this.fullScreenCanvas); // 将 <canvas> 添加到舞台中

                this.updateCanvasStyle();

                setTimeout(() => {
                    this.updateCanvasStyle();

                    this.observeCanvasStyle();

                    console.log('模拟器启动并显示在舞台上');
                }, 100);

            } catch (error) {
                console.error('启动 模拟器失败:', error);
            }
        }

        async advancedstartEmulator(args) {
            if (!this.rom) {
                console.error('没有加载任何 ROM 文件');
                return;
            }

            if (!this.romType || this.romType === 'unknown') {
                console.error('无法识别的 ROM 类型');
                return;
            }

            try {
                console.log(`rom.${this.romextension}`);
                const { Nostalgist } = await import('https://m.ccw.site/gandi_application/user_assets/11d179197c35398db40e5061b9f77a8d.js');
                
                if (!this.Archive && this.romextension !== "GBA") {
                    this.nostalgist = await Nostalgist.launch({ core: this.romType, rom: { fileName: `rom.${this.romextension}`, fileContent: this.rom }, retroarchConfig: JSON.parse(args.JSON), autoSaveState: true, savestate_thumbnail_enable: true });
                } else {
                    const self = this; // 保存当前 this 的引用
                    this.nostalgist = await Nostalgist.launch({
                        core: this.romType,
                        rom: { fileName: `rom.${this.romextension}`, fileContent: this.rom },
                        retroarchConfig: JSON.parse(args.JSON),
                        autoSaveState: true,
                        savestate_thumbnail_enable: true,
                        async beforeLaunch(nostalgist) {
                            const FS = nostalgist.getEmscriptenFS();
                            // 使用 self 引用正确的上下文
                            // 确保路径存在
                            const saveDir = '/home/web_user/retroarch/userdata/saves/mGBA';
                            if (!FS.analyzePath(saveDir).exists) {
                                FS.mkdirTree(saveDir);
                            }
                            
                            const sramContent = new Uint8Array(await self.Archive.arrayBuffer())
                            // 确保存档数据正确
                            if (!(sramContent instanceof Uint8Array)) {
                                throw new Error("Archive is not a valid Uint8Array");
                            }

                            FS.writeFile('/home/web_user/retroarch/userdata/saves/mGBA/rom.srm', sramContent)

                            self.Archive = null
                        }
                    });
                }

                this.FS = this.nostalgist.getEmscriptenFS();
                this.Module = this.nostalgist.getEmscriptenModule();

                // 查找全屏的 <canvas> 元素
                this.fullScreenCanvas = document.getElementById('canvas');
                if (!this.fullScreenCanvas) {
                    console.error('全屏 canvas 元素未找到');
                    return;
                }

                // 获取 Scratch 舞台的父元素
                const stageContainer = this.canvas().parentElement; // 获取 Scratch 舞台的容器
                stageContainer.appendChild(this.fullScreenCanvas); // 将 <canvas> 添加到舞台中

                this.updateCanvasStyle();

                setTimeout(() => {
                    this.updateCanvasStyle();

                    this.observeCanvasStyle();

                    console.log('模拟器启动并显示在舞台上');
                }, 100);

            } catch (error) {
                console.error('启动 模拟器失败:', error);
            }
        }

        // 获取 Scratch 当前舞台的画布元素
        canvas() {
            return this.runtime.renderer.canvas;
        }

        // 更新 canvas 的样式以适应舞台的变化
        updateCanvasStyle() {
            // 获取父容器的尺寸
            const parent = this.fullScreenCanvas.parentNode;
            const rect = parent.getBoundingClientRect();

            // 设置 canvas 样式使其适应舞台
            const sstyle = this.fullScreenCanvas.style;
            sstyle.position = 'absolute';
            sstyle.left = '0';
            sstyle.top = '0';
            sstyle.zIndex = '0'; // 确保它位于正确的层级

            // 动态设置 canvas 的实际宽高
            this.fullScreenCanvas.width = rect.width;
            this.fullScreenCanvas.height = rect.height;
        }

        // 使用 MutationObserver 监听 canvas 样式变化
        observeCanvasStyle() {
            if (this.styleObserver) {
                this.styleObserver.disconnect(); // 确保旧的观察器已清除
            }

            const canvas = this.canvas();
            this.styleObserver = new MutationObserver(() => {
                // 触发样式更新时重新调整
                this.updateCanvasStyle();
            });

            // 开始观察舞台 canvas 的 style 属性
            this.styleObserver.observe(canvas, {
                attributes: true, // 观察属性变化
                attributeFilter: ['style'] // 只监听 style 属性
            });
        }

        blobToBase64(blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result.split(',')[1]); // 去掉 `data:...` 前缀
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        }

        base64ToBlob(base64, type = 'application/octet-stream') {
            const binary = atob(base64);
            const array = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                array[i] = binary.charCodeAt(i);
            }
            return new Blob([array], { type });
        }


        async saveGame(args) {
            const id = args.ID;
            if (!this.nostalgist) {
                console.error('模拟器未启动');
                return;
            }

            try {
                // 调用 saveState 获取状态对象
                const { state } = await this.nostalgist.saveState();

                if (!state) {
                    console.error('保存状态失败，state 为 null 或 undefined');
                    return;
                }

                console.log('保存的游戏状态 Blob:', state);

                // 使用 FileReader 将 Blob 转换为 Base64
                const stateBase64 = await this.blobToBase64(state);
                localStorage.setItem(`nes-save-${id}`, stateBase64);
                console.log(`游戏进度已保存到 ${id}`);
            } catch (error) {
                console.error('保存游戏进度失败:', error);
            }
        }

        async loadGame(args) {
            const id = args.ID;
            if (!this.nostalgist) {
                console.error('模拟器未启动');
                return;
            }

            try {
                // 从存储中获取 Base64 字符串
                const stateBase64 = localStorage.getItem(`nes-save-${id}`);
                if (!stateBase64) {
                    console.error(`未找到存储的游戏进度: ${id}`);
                    return;
                }

                console.log(`加载的游戏状态（Base64）: ${stateBase64}`);

                // 将 Base64 转换回 Blob
                const stateBlob = this.base64ToBlob(stateBase64);
                await this.nostalgist.loadState(stateBlob);
                console.log(`游戏进度已加载: ${id}`);
            } catch (error) {
                console.error('加载游戏进度失败:', error);
            }
        }

        getSavedGame(args) {
            const saveId = args.ID;

            // 从 localStorage 中获取存档数据
            const savedData = localStorage.getItem(`nes-save-${saveId}`);

            if (savedData) {
                // 如果存档存在，返回存档数据（比如 base64 编码的字符串）
                return savedData;
            } else {
                // 如果存档不存在，返回一个空字符串或提示信息
                console.log(`没有找到存档 ID: ${saveId}`);
                return ''; // 返回空字符串
            }
        }

        async importSaveGame(args) {
            const saveDataText = args.TEXT;  // 获取传入的存档数据文本（例如 base64 编码）
            const saveId = args.ID;          // 获取存档 ID

            try {
                // 检查传入的数据是否有效
                if (!saveDataText) {
                    throw new Error('无效的存档数据');
                }

                // 保存到 localStorage 中，覆盖原有存档
                localStorage.setItem(`nes-save-${saveId}`, saveDataText);

                // 提示存档已成功导入
                console.log(`存档 ID: ${saveId} 已成功导入`);

                // 这里可以根据需要执行其他的操作，比如通知界面更新等
            } catch (error) {
                console.error('导入存档失败:', error);
            }
        }

        getGameArchive() {
            try {
                const archivePath = "/home/web_user/retroarch/userdata/saves/mGBA/rom.srm"

                this.FS = this.nostalgist.getEmscriptenFS();
                this.Module = this.nostalgist.getEmscriptenModule();

                this.Module._cmd_savefiles();
                // 读取存档文件
                const archiveData = this.FS.readFile(archivePath);
                // 将存档文件转换为 Base64 格式
                const base64Data = archiveData.toString('base64');

                // 将存档数据转换为 Blob 对象
                const blob = new Blob([archiveData], { type: "application/octet-stream" });

                const url = URL.createObjectURL(blob);

                return url;
            } catch (error) {
                console.error('读取存档文件失败:', error);
                return null; // 如果发生错误返回 null
            }
        }

        async loadGameArchive(args) {
            try {
                // 1. 使用 fetch 获取 Blob 数据
                const response = await fetch(args.BLOB);

                // 检查是否成功获取
                if (!response.ok) {
                    throw new Error(`Failed to fetch Blob from URL: ${response.status}`);
                }

                // 2. 将响应内容转换为 Blob
                const blob = await response.blob();

                this.Archive = blob
            } catch (error) {
                console.error("Error parsing Blob URL:", error);
                throw error; // 如果需要，可以重新抛出错误
            }
        }

        async restartGame() {
            if (!this.nostalgist) {
                console.error('模拟器未启动');
                return;
            }

            try {
                await this.nostalgist.restart();
                console.log('游戏已重载');
            } catch (error) {
                console.error('重载游戏失败:', error);
            }
        }

        async pauseGame() {
            if (!this.nostalgist) {
                console.error('模拟器未启动');
                return;
            }

            try {
                await this.nostalgist.pause();
                console.log('游戏已暂停');
            } catch (error) {
                console.error('暂停游戏失败:', error);
            }
        }

        async resumeGame() {
            if (!this.nostalgist) {
                console.error('模拟器未启动');
                return;
            }

            try {
                await this.nostalgist.resume();
                console.log('游戏已恢复');
            } catch (error) {
                console.error('恢复游戏失败:', error);
            }
        }

        async exitGame() {
            if (!this.nostalgist) {
                console.error('模拟器未启动');
                return;
            }

            try {
                this.fullScreenCanvas.remove();
                await this.nostalgist.exit();
            } catch (error) {
                console.error('关闭游戏失败:', error);
            }
        }

        async press(args) {
            if (!this.nostalgist) {
                console.error('模拟器未启动');
                return;
            }

            try {
                await this.nostalgist.press(args.KEY)
            } catch (error) {
                console.error('模拟按键失败:', error);
            }
        }

        async timepress(args) {
            if (!this.nostalgist) {
                console.error('模拟器未启动');
                return;
            }

            try {
                await this.nostalgist.press({ button: args.KEY, time: args.TIME })
            } catch (error) {
                console.error('模拟按键失败:', error);
            }
        }

        async screenshot() {
            if (!this.nostalgist) {
                console.error('模拟器未启动');
                return;
            }

            try {
                const blob = await this.nostalgist.screenshot();
                const blobUrl = URL.createObjectURL(blob);
                return blobUrl;
            } catch (error) {
                console.error('截图失败:', error);
            }
        }

        hideGameScreen() {
            if (this.fullScreenCanvas) {
                this.fullScreenCanvas.style.display = 'none'; // 隐藏游戏画面
                console.log('游戏画面已隐藏');
            } else {
                console.error('无法找到游戏画面元素');
            }
        }

        showGameScreen() {
            if (this.fullScreenCanvas) {
                this.fullScreenCanvas.style.display = 'block'; // 显示游戏画面
                console.log('游戏画面已显示');
            } else {
                console.error('无法找到游戏画面元素');
            }
        }

        blobtobase64(args) {
            return new Promise((resolve, reject) => {
                // 通过 URL 创建一个 Blob 对象
                fetch(args.BLOB)
                .then(response => response.blob())  // 获取 Blob 数据
                .then(blob => {
                    const reader = new FileReader();
                    
                    reader.onloadend = () => {
                    resolve(reader.result.split(',')[1]);  // 获取 Base64 字符串部分（去掉前缀）
                    };
                    
                    reader.onerror = reject;  // 读取失败时触发 reject
                    
                    reader.readAsDataURL(blob);  // 开始读取 Blob
                })
                .catch(reject);  // 处理 fetch 错误
            });
        }

        base64toblob(args, mimeType = 'application/octet-stream') {
            // 解码 Base64 字符串为二进制字符串
            const binaryString = atob(args.BASE64);
            const length = binaryString.length;
            const buffer = new ArrayBuffer(length);
            const view = new Uint8Array(buffer);

            // 将二进制字符串转换为字节数组
            for (let i = 0; i < length; i++) {
                view[i] = binaryString.charCodeAt(i);
            }

            // 创建 Blob 对象
            const blob = new Blob([view], { type: mimeType });

            // 创建 Blob URL
            return URL.createObjectURL(blob);
        }
    }
    Scratch.extensions.register(new NostalgistScratchExtension(Scratch.runtime));
}(Scratch));
