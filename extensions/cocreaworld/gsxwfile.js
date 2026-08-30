/*
GSXW多文本容器扩展
ID: gsxwfile
支持：网页版 + NW.js打包EXE
功能：.gsxw自定义格式，多文本块，按行读写（取第N行、改第N行、插入、删除行）
行号：文本块从1开始；JSON数组下标从0开始
网页模式：path参数提供下载文件名；NW模式：path为磁盘路径
新增：JSON对象路径、数组追加/插入/删除行、按键查找下标
*/
class GSXWFile {
    constructor() {
        this.isNW = !!window.nw;
        this.fs = null;
        this.dialog = null;
        this.doc = { blocks: {} };
        this.lastError = "";
        if (this.isNW) {
            this.fs = window.nw.require("fs");
            this.dialog = window.nw.require("dialog");
        }
    }

    getInfo() {
        return {
            id: "gsxwfile",
            name: "GSXW多文本(.gsxw)",
            color1: "#7B1FA2",
            color2: "#512DA8",
            color3: "#4527A0",
            blocks: [
                { opcode: "newDoc", blockType: Scratch.BlockType.COMMAND, text: "新建空GSXW文档" },
                { opcode: "openGsxw", blockType: Scratch.BlockType.COMMAND, text: "打开 .gsxw 文件" },
                { opcode: "saveGsxw", blockType: Scratch.BlockType.COMMAND, text: "保存GSXW到 [path]",
                    arguments: { path: { type: Scratch.ArgumentType.STRING, defaultValue: "data.gsxw" } } },

                //===== 原有文本块全部保留 =====
                { opcode: "setBlockFull", blockType: Scratch.BlockType.COMMAND, text: "文本块 [name] 设置全部内容 [txt]",
                    arguments: {
                        name: { type: Scratch.ArgumentType.STRING, defaultValue: "文本A" },
                        txt: { type: Scratch.ArgumentType.STRING, defaultValue: "" }
                    } },
                { opcode: "getBlockFull", blockType: Scratch.BlockType.REPORTER, text: "文本块 [name] 全部内容",
                    arguments: { name: { type: Scratch.ArgumentType.STRING, defaultValue: "文本A" } } },
                { opcode: "deleteBlock", blockType: Scratch.BlockType.COMMAND, text: "删除文本块 [name]",
                    arguments: { name: { type: Scratch.ArgumentType.STRING, defaultValue: "文本A" } } },
                { opcode: "existsBlock", blockType: Scratch.BlockType.BOOLEAN, text: "存在文本块 [name]",
                    arguments: { name: { type: Scratch.ArgumentType.STRING, defaultValue: "文本A" } } },
                { opcode: "getOneLine", blockType: Scratch.BlockType.REPORTER, text: "文本块 [name] 第 [row] 行",
                    arguments: {
                        name: { type: Scratch.ArgumentType.STRING, defaultValue: "文本A" },
                        row: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 }
                    } },
                { opcode: "setOneLine", blockType: Scratch.BlockType.COMMAND, text: "文本块 [name] 第 [row] 行改为 [txt]",
                    arguments: {
                        name: { type: Scratch.ArgumentType.STRING, defaultValue: "文本A" },
                        row: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 },
                        txt: { type: Scratch.ArgumentType.STRING, defaultValue: "修改后的内容" }
                    } },
                { opcode: "insertOneLine", blockType: Scratch.BlockType.COMMAND, text: "文本块 [name] 在第 [row] 行插入 [txt]",
                    arguments: {
                        name: { type: Scratch.ArgumentType.STRING, defaultValue: "文本A" },
                        row: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 },
                        txt: { type: Scratch.ArgumentType.STRING, defaultValue: "插入行" }
                    } },
                { opcode: "removeOneLine", blockType: Scratch.BlockType.COMMAND, text: "文本块 [name] 删除第 [row] 行",
                    arguments: {
                        name: { type: Scratch.ArgumentType.STRING, defaultValue: "文本A" },
                        row: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 }
                    } },
                { opcode: "getTotalRows", blockType: Scratch.BlockType.REPORTER, text: "文本块 [name] 总行数",
                    arguments: { name: { type: Scratch.ArgumentType.STRING, defaultValue: "文本A" } } },

                //===== 新增 JSON 对象路径积木 =====
                { opcode: "setPathValue", blockType: Scratch.BlockType.COMMAND, text: "设置路径 [PATH] 值为 [VALUE]",
                    arguments: {
                        PATH: { type: Scratch.ArgumentType.STRING, defaultValue: "project.name" },
                        VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "新项目" }
                    } },
                { opcode: "getPathValue", blockType: Scratch.BlockType.REPORTER, text: "读取路径 [PATH]",
                    arguments: { PATH: { type: Scratch.ArgumentType.STRING, defaultValue: "project.name" } } },
                { opcode: "deletePath", blockType: Scratch.BlockType.COMMAND, text: "删除路径 [PATH]",
                    arguments: { PATH: { type: Scratch.ArgumentType.STRING, defaultValue: "tracks" } } },

                { opcode: "getArrayLength", blockType: Scratch.BlockType.REPORTER, text: "数组 [PATH] 长度",
                    arguments: { PATH: { type: Scratch.ArgumentType.STRING, defaultValue: "tracks" } } },
                { opcode: "getArrayItemJson", blockType: Scratch.BlockType.REPORTER, text: "数组 [PATH] 下标 [IDX] 的JSON",
                    arguments: {
                        PATH: { type: Scratch.ArgumentType.STRING, defaultValue: "tracks" },
                        IDX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
                    } },

                { opcode: "appendArrayRow", blockType: Scratch.BlockType.COMMAND, text: "向数组 [PATH] 追加对象行 对象JSON [OBJ]",
                    arguments: {
                        PATH: { type: Scratch.ArgumentType.STRING, defaultValue: "tracks" },
                        OBJ: { type: Scratch.ArgumentType.STRING, defaultValue: "{\"id\":\"new_track\"}" }
                    } },
                { opcode: "insertArrayRowAtIndex", blockType: Scratch.BlockType.COMMAND, text: "向数组 [PATH] 下标 [IDX] 插入对象行 对象JSON [OBJ]",
                    arguments: {
                        PATH: { type: Scratch.ArgumentType.STRING, defaultValue: "tracks" },
                        IDX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                        OBJ: { type: Scratch.ArgumentType.STRING, defaultValue: "{\"id\":\"new_track\"}" }
                    } },
                { opcode: "deleteArrayIndexRow", blockType: Scratch.BlockType.COMMAND, text: "删除数组 [PATH] 下标 [IDX] 的行",
                    arguments: {
                        PATH: { type: Scratch.ArgumentType.STRING, defaultValue: "tracks" },
                        IDX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
                    } },
                { opcode: "findArrayIndexByKeyValue", blockType: Scratch.BlockType.REPORTER, text: "数组 [PATH] 查找键 [KEY] = [VAL] 返回下标",
                    arguments: {
                        PATH: { type: Scratch.ArgumentType.STRING, defaultValue: "tracks" },
                        KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "id" },
                        VAL: { type: Scratch.ArgumentType.STRING, defaultValue: "vocal" }
                    } },

                { opcode: "getError", blockType: Scratch.BlockType.REPORTER, text: "最后错误信息" }
            ]
        }
    }

    clearErr() { this.lastError = ""; }
    setErr(m) { this.lastError = m; }

    _splitPath(pathStr) {
        return String(pathStr || "")
            .split(".")
            .map(s => s.trim())
            .filter(s => s !== "");
    }

    _getTargetAndKey(root, pathParts) {
        if (pathParts.length === 0) return { parent: null, key: null };
        let ptr = root;
        for (let i = 0; i < pathParts.length - 1; i++) {
            const k = pathParts[i];
            if (ptr[k] === undefined || ptr[k] === null || typeof ptr[k] !== "object") {
                ptr[k] = {};
            }
            ptr = ptr[k];
        }
        return { parent: ptr, key: pathParts[pathParts.length - 1] };
    }

    _getOrCreateArrayByPath(root, pathStr) {
        const parts = this._splitPath(pathStr);
        let ptr = root;
        for (let i = 0; i < parts.length; i++) {
            const key = parts[i];
            if (i === parts.length - 1) {
                if (!Array.isArray(ptr[key])) {
                    ptr[key] = [];
                }
                return ptr[key];
            } else {
                if (typeof ptr[key] !== "object" || ptr[key] === null) {
                    ptr[key] = {};
                }
                ptr = ptr[key];
            }
        }
        return [];
    }

    setPathValue(args) {
        this.clearErr();
        const parts = this._splitPath(args.PATH);
        const { parent, key } = this._getTargetAndKey(this.doc, parts);
        if (parent && key !== null) {
            parent[key] = args.VALUE;
        }
    }

    getPathValue(args) {
        this.clearErr();
        const parts = this._splitPath(args.PATH);
        let ptr = this.doc;
        for (const k of parts) {
            if (ptr === null || ptr === undefined) return "";
            ptr = ptr[k];
        }
        if (ptr === null || ptr === undefined) return "";
        if (typeof ptr === "object") return JSON.stringify(ptr);
        return ptr;
    }

    deletePath(args) {
        this.clearErr();
        const parts = this._splitPath(args.PATH);
        const { parent, key } = this._getTargetAndKey(this.doc, parts);
        if (parent && key !== null) {
            delete parent[key];
        }
    }

    getArrayLength(args) {
        this.clearErr();
        const parts = this._splitPath(args.PATH);
        let ptr = this.doc;
        for (const k of parts) {
            if (ptr === null || ptr === undefined) return 0;
            ptr = ptr[k];
        }
        if (!Array.isArray(ptr)) return 0;
        return ptr.length;
    }

    getArrayItemJson(args) {
        this.clearErr();
        const parts = this._splitPath(args.PATH);
        const idx = Number(args.IDX || 0);
        let ptr = this.doc;
        for (const k of parts) {
            if (ptr === null || ptr === undefined) return "";
            ptr = ptr[k];
        }
        if (!Array.isArray(ptr)) return "";
        const item = ptr[idx];
        if (item === undefined || item === null) return "";
        return JSON.stringify(item);
    }

    appendArrayRow(args) {
        this.clearErr();
        const path = String(args.PATH || "");
        const objJson = String(args.OBJ || "{}");
        let target;
        try {
            target = JSON.parse(objJson);
        } catch (e) {
            this.setErr("追加行JSON解析失败:" + e.message);
            return;
        }
        const arr = this._getOrCreateArrayByPath(this.doc, path);
        arr.push(target);
    }

    insertArrayRowAtIndex(args) {
        this.clearErr();
        const path = String(args.PATH || "");
        const index = Number(args.IDX || 0);
        const objJson = String(args.OBJ || "{}");
        let target;
        try {
            target = JSON.parse(objJson);
        } catch (e) {
            this.setErr("插入行JSON解析失败:" + e.message);
            return;
        }
        const arr = this._getOrCreateArrayByPath(this.doc, path);
        const safeIdx = Math.max(0, Math.min(index, arr.length));
        arr.splice(safeIdx, 0, target);
    }

    deleteArrayIndexRow(args) {
        this.clearErr();
        const path = String(args.PATH || "");
        const index = Number(args.IDX || 0);
        const arr = this._getOrCreateArrayByPath(this.doc, path);
        if (index >= 0 && index < arr.length) {
            arr.splice(index, 1);
        } else {
            this.setErr("数组下标越界");
        }
    }

    findArrayIndexByKeyValue(args) {
        this.clearErr();
        const path = String(args.PATH || "");
        const keyName = String(args.KEY || "id");
        const expectVal = args.VAL;
        const arr = this._getOrCreateArrayByPath(this.doc, path);
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            if (item && item[keyName] === expectVal) {
                return i;
            }
        }
        return -1;
    }

    //===== 原版文件、文本块逻辑完全不动 =====
    _sanitizeFilename(rawPath) {
        let name = rawPath.replace(/.*[\\/]/, "");
        name = name.replace(/[<>:"|?*]/g, "_");
        if (!name.toLowerCase().endsWith(".gsxw")) {
            name += ".gsxw";
        }
        return name || "doc.gsxw";
    }

    newDoc() {
        this.clearErr();
        this.doc = { blocks: {} };
    }

    openGsxw() {
        return new Promise(resolve => {
            this.clearErr();
            if (this.isNW) {
                this.dialog.showOpenDialog({
                    filters: [{ name: "GSXW文档", extensions: ["gsxw"] }]
                }, (paths) => {
                    if (!paths || paths.length === 0) return resolve();
                    try {
                        const raw = this.fs.readFileSync(paths[0], "utf-8");
                        const obj = JSON.parse(raw);
                        if (!obj.blocks) obj.blocks = {};
                        this.doc = obj;
                    } catch (e) {
                        this.setErr("读取失败：" + e.message);
                    }
                    resolve();
                })
            } else {
                const inp = document.createElement("input");
                inp.type = "file";
                inp.accept = ".gsxw";
                inp.onchange = ev => {
                    const f = ev.target.files[0];
                    if (!f) return resolve();
                    const r = new FileReader();
                    r.onload = e => {
                        try {
                            const obj = JSON.parse(e.target.result);
                            if (!obj.blocks) obj.blocks = {};
                            this.doc = obj;
                        } catch (err) {
                            this.setErr("解析gsxw失败：" + err.message);
                        }
                        resolve();
                    };
                    r.readAsText(f);
                };
                inp.click();
            }
        })
    }

    saveGsxw(args) {
        return new Promise(resolve => {
            this.clearErr();
            const jsonText = JSON.stringify(this.doc, null, 2);
            const rawPath = String(args.path);
            if (this.isNW) {
                try {
                    this.fs.writeFileSync(rawPath, jsonText, "utf-8");
                } catch (e) {
                    this.setErr("保存失败：" + e.message);
                }
                resolve();
            } else {
                const downloadName = this._sanitizeFilename(rawPath);
                const blob = new Blob([jsonText], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = downloadName;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                resolve();
            }
        })
    }

    setBlockFull(args) {
        this.clearErr();
        this.doc.blocks[args.name] = args.txt;
    }

    getBlockFull(args) {
        return this.doc.blocks[args.name] ?? "";
    }

    deleteBlock(args) {
        this.clearErr();
        delete this.doc.blocks[args.name];
    }

    existsBlock(args) {
        return !!this.doc.blocks[args.name];
    }

    _getLines(name) {
        const s = this.doc.blocks[name] ?? "";
        return s.split(/\r?\n/);
    }

    _setLines(name, lines) {
        this.doc.blocks[name] = lines.join("\n");
    }

    getOneLine(args) {
        this.clearErr();
        const name = args.name;
        const row = Number(args.row);
        const lines = this._getLines(name);
        const idx = row - 1;
        if (idx < 0 || idx >= lines.length) {
            this.setErr(`行号${row}越界`);
            return "";
        }
        return lines[idx];
    }

    setOneLine(args) {
        this.clearErr();
        const name = args.name;
        const row = Number(args.row);
        const lines = this._getLines(name);
        const idx = row - 1;
        if (idx < 0 || idx >= lines.length) {
            this.setErr(`行号${row}越界，无法修改`);
            return;
        }
        lines[idx] = args.txt;
        this._setLines(name, lines);
    }

    insertOneLine(args) {
        this.clearErr();
        const name = args.name;
        const row = Number(args.row);
        const lines = this._getLines(name);
        const idx = row - 1;
        if (idx < 0 || idx > lines.length) {
            this.setErr(`行号${row}越界，无法插入`);
            return;
        }
        lines.splice(idx, 0, args.txt);
        this._setLines(name, lines);
    }

    removeOneLine(args) {
        this.clearErr();
        const name = args.name;
        const row = Number(args.row);
        const lines = this._getLines(name);
        const idx = row - 1;
        if (idx < 0 || idx >= lines.length) {
            this.setErr(`行号${row}越界，无法删除`);
            return;
        }
        lines.splice(idx, 1);
        this._setLines(name, lines);
    }

    getTotalRows(args) {
        this.clearErr();
        const lines = this._getLines(args.name);
        return lines.length;
    }

    getError() {
        return this.lastError;
    }
}
Scratch.extensions.register(new GSXWFile());
