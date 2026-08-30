!function(Scratch) {
    'use strict';

    const vm = Scratch.vm;
    const runtime = vm.runtime;

    // ============================================================
    // 0. 辅助函数（参考模拟方向积木）
    // ============================================================
    function normalizeAngle(deg) {
        deg = deg % 360;
        if (deg > 180) deg -= 360;
        if (deg < -180) deg += 360;
        return deg;
    }

    function findTargetByName(name, runtime) {
        if (name === "_stage_") {
            return runtime.getTargetForStage();
        }
        for (const target of runtime.targets) {
            if (!target.isStage) {
                const targetName = target.getName ? target.getName() : target.name;
                if (targetName === name) {
                    return target;
                }
            }
        }
        return null;
    }

    function calcPointTowards(targetStr, target, runtime) {
        let tX, tY;

        if (targetStr === "_mouse_") {
            tX = runtime.ioDevices.mouse.getScratchX();
            tY = runtime.ioDevices.mouse.getScratchY();
        } else if (targetStr === "_random_") {
            return normalizeAngle(Math.random() * 360 - 180);
        } else {
            const t = findTargetByName(targetStr, runtime);
            if (!t) {
                console.warn('[通用积木执行器] 未找到目标角色:', targetStr);
                return target.direction; // 保持原方向
            }
            tX = t.x;
            tY = t.y;
        }

        const dx = tX - target.x;
        const dy = tY - target.y;
        const mathDeg = Math.atan2(dy, dx) * 180 / Math.PI;
        const scratchDeg = 90 - mathDeg;
        return normalizeAngle(scratchDeg);
    }

    // ============================================================
    // 1. 安全警告系统
    // ============================================================
    let hasWarned = false;

    function showFirstRunWarning() {
        if (hasWarned) return true;
        const userConfirmed = confirm(
            '⚠️ 安全提示（仅首次运行提醒）\n\n' +
            '您正在使用“通用积木执行器”扩展。\n' +
            '该积木可以执行任意 Scratch/扩展积木（opcode），可能会修改项目数据、控制角色或调用网络请求。\n\n' +
            '请确保您理解其功能，并仅运行来自可信来源的代码。\n\n' +
            '点击“确定”表示您已知晓并继续执行。'
        );
        if (userConfirmed) {
            hasWarned = true;
            return true;
        }
        return false;
    }

    // ============================================================
    // 2. 辅助：获取当前目标（用于变量查找）
    // ============================================================
    function getCurrentTarget() {
        let editingTarget = runtime.getEditingTarget ? runtime.getEditingTarget() : null;
        if (editingTarget && !editingTarget.isStage) {
            return editingTarget;
        }
        for (const t of runtime.targets) {
            if (!t.isStage) {
                return t;
            }
        }
        return runtime.getTargetForStage();
    }

    // ============================================================
    // 3. 解析参数中的变量引用
    // ============================================================
    function resolveArgs(args, target) {
        if (!args || typeof args !== 'object') return args;
        const resolved = {};
        for (const key in args) {
            const val = args[key];
            if (val && typeof val === 'object' && val.type === 'variable') {
                // 从 VM 获取变量值
                const varName = val.name;
                let value = null;
                // 优先从目标 target 查找，否则从所有目标查找
                const targets = target ? [target, ...runtime.targets] : runtime.targets;
                for (const t of targets) {
                    if (t.variables) {
                        for (const id in t.variables) {
                            const v = t.variables[id];
                            if (v.name === varName) {
                                value = v.value;
                                break;
                            }
                        }
                    }
                    if (value !== null) break;
                }
                resolved[key] = value !== null ? value : 0; // 默认0
            } else if (Array.isArray(val)) {
                resolved[key] = val.map(item => resolveArgs(item, target));
            } else if (typeof val === 'object') {
                resolved[key] = resolveArgs(val, target);
            } else {
                resolved[key] = val;
            }
        }
        return resolved;
    }

    // ============================================================
    // 4. 收集所有可用 opcode
    // ============================================================
    function collectAllOpcodes() {
        const opcodeSet = new Set();
        const sources = [
            runtime.flyweightBlockFunctions,
            runtime._flyweightBlockFunctions,
            runtime._primitives,
            runtime._blockPrimitives,
            runtime._customBlockPrimitives,
            runtime.blocks,
            runtime._blocks
        ];
        for (const src of sources) {
            if (src && typeof src === 'object') {
                for (const key in src) {
                    if (typeof src[key] === 'function') {
                        opcodeSet.add(key);
                    }
                }
            }
        }
        const extManager = runtime.extensionManager;
        if (extManager) {
            const extObjects = extManager.extensionObjects || extManager._extensionObjects || extManager.extensionList;
            if (extObjects) {
                for (const extId in extObjects) {
                    const ext = extObjects[extId];
                    if (ext && typeof ext === 'object') {
                        for (const key in ext) {
                            if (typeof ext[key] === 'function' && key !== 'getInfo') {
                                opcodeSet.add(key);
                            }
                        }
                    }
                }
            }
        }
        const blocksContainer = getBlockDefinitions();
        if (blocksContainer) {
            if (blocksContainer instanceof Map) {
                for (const [id, def] of blocksContainer) {
                    if (def && def.opcode) opcodeSet.add(def.opcode);
                }
            } else {
                for (const id in blocksContainer) {
                    const def = blocksContainer[id];
                    if (def && def.opcode) opcodeSet.add(def.opcode);
                }
            }
        }
        return opcodeSet;
    }

    function getBlockDefinitions() {
        let container = null;
        if (runtime._blocks) {
            if (runtime._blocks._blocks) {
                container = runtime._blocks._blocks;
            } else if (typeof runtime._blocks === 'object') {
                container = runtime._blocks;
            }
        }
        if (!container && runtime._blockInfo) container = runtime._blockInfo;
        if (!container && runtime.monitorBlockInfo) container = runtime.monitorBlockInfo;
        return container;
    }

    // ============================================================
    // 5. 核心执行函数（已修复 motion_pointtowards）
    // ============================================================
    function runBlockByOpcode(opcode, args, target) {
        return new Promise((resolve, reject) => {
            // ---- 特殊处理：motion_pointtowards（使用自定义实现） ----
            if (opcode === 'motion_pointtowards') {
                try {
                    const t = target || getCurrentTarget();
                    const towards = args.TOWARDS; // 已解析过的参数
                    const deg = calcPointTowards(towards, t, runtime);
                    t.setDirection(deg);
                    resolve();
                } catch (e) {
                    reject(e);
                }
                return;
            }

            let func = null;
            let context = null;

            const sources = [
                runtime.flyweightBlockFunctions,
                runtime._flyweightBlockFunctions,
                runtime._primitives,
                runtime._blockPrimitives,
                runtime._customBlockPrimitives,
                runtime.blocks,
                runtime._blocks
            ];
            for (const src of sources) {
                if (src && typeof src === 'object' && src[opcode] && typeof src[opcode] === 'function') {
                    func = src[opcode];
                    context = runtime;
                    break;
                }
            }

            if (!func) {
                const extManager = runtime.extensionManager;
                if (extManager) {
                    const extObjects = extManager.extensionObjects || extManager._extensionObjects || extManager.extensionList;
                    if (extObjects) {
                        for (const extId in extObjects) {
                            const ext = extObjects[extId];
                            if (ext && typeof ext === 'object') {
                                if (ext[opcode] && typeof ext[opcode] === 'function') {
                                    func = ext[opcode];
                                    context = ext;
                                    break;
                                }
                                if (!opcode.includes('_')) {
                                    const prefixed = extId + '_' + opcode;
                                    if (ext[prefixed] && typeof ext[prefixed] === 'function') {
                                        func = ext[prefixed];
                                        context = ext;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (!func) {
                reject(new Error(`未找到 opcode: ${opcode}`));
                return;
            }

            if (!target) {
                target = getCurrentTarget();
            }

            const blockContext = {
                target: target,
                runtime: runtime
            };

            try {
                const result = func.call(context || blockContext, args, blockContext);
                if (result && typeof result.then === 'function') {
                    result.then(resolve).catch(reject);
                } else {
                    resolve(result);
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    // ============================================================
    // 6. 递归执行积木树（包含变量解析）
    // ============================================================
    async function executeTree(node, target) {
        if (!node || !node.opcode) return;

        const op = node.opcode;
        const args = node.args || {};
        const children = node.children || [];
        const ctxTarget = target || getCurrentTarget();

        // ---- 特殊处理控制流积木 ----
        if (op === 'control_wait') {
            const duration = Number(args.DURATION) || 0;
            if (duration > 0) {
                await new Promise(resolve => setTimeout(resolve, duration * 1000));
            }
            return;
        }

        if (op === 'control_repeat') {
            const times = Number(args.TIMES) || 0;
            const body = children.filter(c => c.inputName === 'SUBSTACK');
            for (let i = 0; i < times; i++) {
                for (const child of body) {
                    await executeTree(child, ctxTarget);
                }
                await new Promise(resolve => requestAnimationFrame(resolve));
            }
            return;
        }

        if (op === 'control_forever') {
            const body = children.filter(c => c.inputName === 'SUBSTACK');
            let iteration = 0;
            const MAX_SAFE = Number.MAX_SAFE_INTEGER;
            while (iteration < MAX_SAFE) {
                for (const child of body) {
                    await executeTree(child, ctxTarget);
                }
                iteration++;
                await new Promise(resolve => requestAnimationFrame(resolve));
            }
            console.warn('无限循环达到安全上限');
            return;
        }

        if (op === 'control_repeat_until') {
            const conditionNode = children.find(c => c.inputName === 'CONDITION');
            const body = children.filter(c => c.inputName === 'SUBSTACK');
            let conditionMet = false;
            let iteration = 0;
            const MAX_SAFE = Number.MAX_SAFE_INTEGER;
            while (!conditionMet && iteration < MAX_SAFE) {
                if (conditionNode) {
                    const resolvedArgs = resolveArgs(conditionNode.args, ctxTarget);
                    try {
                        const result = await runBlockByOpcode(conditionNode.opcode, resolvedArgs, ctxTarget);
                        conditionMet = (result === true || result === 'true' || result === 1);
                    } catch (e) {
                        console.warn('条件执行失败:', e.message);
                        conditionMet = false;
                    }
                } else {
                    conditionMet = false;
                }
                if (conditionMet) break;
                for (const child of body) {
                    await executeTree(child, ctxTarget);
                }
                iteration++;
                await new Promise(resolve => requestAnimationFrame(resolve));
            }
            if (iteration >= MAX_SAFE) {
                console.warn('repeat until 循环达到安全上限');
            }
            return;
        }

        if (op === 'control_if') {
            const conditionNode = children.find(c => c.inputName === 'CONDITION');
            const body = children.filter(c => c.inputName === 'SUBSTACK');
            let condResult = false;
            if (conditionNode) {
                const resolvedArgs = resolveArgs(conditionNode.args, ctxTarget);
                try {
                    const result = await runBlockByOpcode(conditionNode.opcode, resolvedArgs, ctxTarget);
                    condResult = (result === true || result === 'true' || result === 1);
                } catch (e) {
                    console.warn('条件执行失败:', e.message);
                    condResult = false;
                }
            }
            if (condResult) {
                for (const child of body) {
                    await executeTree(child, ctxTarget);
                }
            }
            return;
        }

        if (op === 'control_if_else') {
            const conditionNode = children.find(c => c.inputName === 'CONDITION');
            const ifBody = children.filter(c => c.inputName === 'SUBSTACK');
            const elseBody = children.filter(c => c.inputName === 'SUBSTACK2');
            let condResult = false;
            if (conditionNode) {
                const resolvedArgs = resolveArgs(conditionNode.args, ctxTarget);
                try {
                    const result = await runBlockByOpcode(conditionNode.opcode, resolvedArgs, ctxTarget);
                    condResult = (result === true || result === 'true' || result === 1);
                } catch (e) {
                    console.warn('条件执行失败:', e.message);
                    condResult = false;
                }
            }
            if (condResult) {
                for (const child of ifBody) {
                    await executeTree(child, ctxTarget);
                }
            } else {
                for (const child of elseBody) {
                    await executeTree(child, ctxTarget);
                }
            }
            return;
        }

        if (op === 'control_wait_until') {
            const conditionNode = children.find(c => c.inputName === 'CONDITION');
            let conditionMet = false;
            let iteration = 0;
            const MAX_SAFE = 10000;
            while (!conditionMet && iteration < MAX_SAFE) {
                if (conditionNode) {
                    const resolvedArgs = resolveArgs(conditionNode.args, ctxTarget);
                    try {
                        const result = await runBlockByOpcode(conditionNode.opcode, resolvedArgs, ctxTarget);
                        conditionMet = (result === true || result === 'true' || result === 1);
                    } catch (e) {
                        console.warn('条件执行失败:', e.message);
                        conditionMet = false;
                    }
                } else {
                    conditionMet = false;
                }
                if (!conditionMet) {
                    await new Promise(resolve => requestAnimationFrame(resolve));
                }
                iteration++;
            }
            if (iteration >= MAX_SAFE) {
                console.warn('wait until 达到安全上限');
            }
            return;
        }

        // 其他普通积木：解析参数并执行
        const resolvedArgs = resolveArgs(args, ctxTarget);
        try {
            await runBlockByOpcode(op, resolvedArgs, ctxTarget);
        } catch (e) {
            console.warn('执行积木失败:', e.message);
        }
    }

    // ============================================================
    // 7. 扩展主类
    // ============================================================
    class RunAnyBlockExtension {
        getInfo() {
            return {
                id: 'runanyblockNext',
                name: '通用积木执行器',
                color1: '#FF8C00',
                color2: '#E67E22',
                color3: '#D35400',
                blocks: [
                    // 原有积木...
                    {
                        opcode: 'runBlock',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '执行积木 [OPCODE] 参数 [ARGS]',
                        arguments: {
                            OPCODE: { type: Scratch.ArgumentType.STRING, defaultValue: 'motion_movesteps' },
                            ARGS: { type: Scratch.ArgumentType.STRING, defaultValue: '{"STEPS":10}' }
                        }
                    },
                    {
                        opcode: 'runBlockOnTarget',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '对角色 [TARGET] 执行积木 [OPCODE] 参数 [ARGS]',
                        arguments: {
                            TARGET: { type: Scratch.ArgumentType.STRING, defaultValue: '角色1', menu: 'targetMenu' },
                            OPCODE: { type: Scratch.ArgumentType.STRING, defaultValue: 'motion_movesteps' },
                            ARGS: { type: Scratch.ArgumentType.STRING, defaultValue: '{"STEPS":10}' }
                        }
                    },
                    {
                        opcode: 'runBlockNoReturn',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '执行积木无返回值 [OPCODE] 参数 [ARGS]',
                        arguments: {
                            OPCODE: { type: Scratch.ArgumentType.STRING, defaultValue: 'motion_movesteps' },
                            ARGS: { type: Scratch.ArgumentType.STRING, defaultValue: '{"STEPS":10}' }
                        }
                    },
                    {
                        opcode: 'runBlockNoReturnOnTarget',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '对角色 [TARGET] 执行积木无返回值 [OPCODE] 参数 [ARGS]',
                        arguments: {
                            TARGET: { type: Scratch.ArgumentType.STRING, defaultValue: '角色1', menu: 'targetMenu' },
                            OPCODE: { type: Scratch.ArgumentType.STRING, defaultValue: 'motion_movesteps' },
                            ARGS: { type: Scratch.ArgumentType.STRING, defaultValue: '{"STEPS":10}' }
                        }
                    },
                    {
                        opcode: 'runLoop',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '执行循环体：循环类型 [LOOP_TYPE] 循环参数 [LOOP_ARGS] 内部积木 [BLOCK_LIST] 参数 [ARGS_LIST]',
                        arguments: {
                            LOOP_TYPE: { type: Scratch.ArgumentType.STRING, defaultValue: 'control_repeat' },
                            LOOP_ARGS: { type: Scratch.ArgumentType.STRING, defaultValue: '{"TIMES":10}' },
                            BLOCK_LIST: { type: Scratch.ArgumentType.STRING, defaultValue: '["motion_movesteps"]' },
                            ARGS_LIST: { type: Scratch.ArgumentType.STRING, defaultValue: '[{"STEPS":10}]' }
                        }
                    },
                    {
                        opcode: 'executeTree',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '执行组合积木 [TREE]',
                        arguments: {
                            TREE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{"opcode":"control_repeat","args":{"TIMES":10},"children":[{"opcode":"motion_movesteps","args":{"STEPS":5},"inputName":"SUBSTACK"}]}'
                            }
                        }
                    },
                    {
                        opcode: 'listOpcode',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '当前所有可用 opcode（JSON）'
                    },
                    {
                        opcode: 'help',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '帮助：常见 opcode 示例'
                    },
                    {
                        opcode: 'debugInfo',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '调试信息（runtime 属性列表）'
                    }
                ],
                menus: {
                    targetMenu: {
                        acceptReporters: true,
                        items: 'getTargetNames'
                    }
                }
            };
        }

        getTargetNames() {
            const names = [];
            for (const target of runtime.targets) {
                if (!target.isStage) {
                    names.push(target.getName ? target.getName() : target.name);
                }
            }
            return names;
        }

        // ---- 执行单个积木（有返回值） ----
        runBlock(args) {
            if (!showFirstRunWarning()) return '⛔ 用户取消了执行（安全提醒）';
            const opcode = String(args.OPCODE);
            let blockArgs;
            try {
                blockArgs = JSON.parse(String(args.ARGS));
            } catch (e) {
                blockArgs = String(args.ARGS);
            }
            if (opcode === 'control_wait') {
                const duration = Number(blockArgs.DURATION) || 0;
                return new Promise(resolve => {
                    setTimeout(() => resolve('等待完成'), duration * 1000);
                });
            }
            const target = getCurrentTarget();
            const resolvedArgs = resolveArgs(blockArgs, target);
            return runBlockByOpcode(opcode, resolvedArgs, target)
                .then(result => {
                    if (result === undefined) return '执行成功（无返回值）';
                    if (typeof result === 'object' && result !== null) return JSON.stringify(result);
                    return String(result);
                })
                .catch(err => '错误：' + err.message);
        }

        runBlockOnTarget(args) {
            if (!showFirstRunWarning()) return '⛔ 用户取消了执行（安全提醒）';
            const targetName = String(args.TARGET);
            const opcode = String(args.OPCODE);
            let blockArgs;
            try {
                blockArgs = JSON.parse(String(args.ARGS));
            } catch (e) {
                blockArgs = String(args.ARGS);
            }
            let target = null;
            for (const t of runtime.targets) {
                if (!t.isStage && (t.getName ? t.getName() : t.name) === targetName) {
                    target = t;
                    break;
                }
            }
            if (!target) return '错误：未找到角色 ' + targetName;
            if (opcode === 'control_wait') {
                const duration = Number(blockArgs.DURATION) || 0;
                return new Promise(resolve => {
                    setTimeout(() => resolve('等待完成'), duration * 1000);
                });
            }
            const resolvedArgs = resolveArgs(blockArgs, target);
            return runBlockByOpcode(opcode, resolvedArgs, target)
                .then(result => {
                    if (result === undefined) return '执行成功（无返回值）';
                    if (typeof result === 'object' && result !== null) return JSON.stringify(result);
                    return String(result);
                })
                .catch(err => '错误：' + err.message);
        }

        // ---- 无返回值 ----
        runBlockNoReturn(args) {
            if (!showFirstRunWarning()) return;
            const opcode = String(args.OPCODE);
            let blockArgs;
            try {
                blockArgs = JSON.parse(String(args.ARGS));
            } catch (e) {
                blockArgs = String(args.ARGS);
            }
            const target = getCurrentTarget();
            const resolvedArgs = resolveArgs(blockArgs, target);
            if (opcode === 'control_wait') {
                const duration = Number(resolvedArgs.DURATION) || 0;
                return new Promise(resolve => setTimeout(resolve, duration * 1000));
            }
            return runBlockByOpcode(opcode, resolvedArgs, target)
                .then(() => {})
                .catch(err => console.warn('[通用积木执行器] 执行出错:', err.message));
        }

        runBlockNoReturnOnTarget(args) {
            if (!showFirstRunWarning()) return;
            const targetName = String(args.TARGET);
            const opcode = String(args.OPCODE);
            let blockArgs;
            try {
                blockArgs = JSON.parse(String(args.ARGS));
            } catch (e) {
                blockArgs = String(args.ARGS);
            }
            let target = null;
            for (const t of runtime.targets) {
                if (!t.isStage && (t.getName ? t.getName() : t.name) === targetName) {
                    target = t;
                    break;
                }
            }
            if (!target) {
                console.warn('[通用积木执行器] 未找到角色:', targetName);
                return;
            }
            const resolvedArgs = resolveArgs(blockArgs, target);
            if (opcode === 'control_wait') {
                const duration = Number(resolvedArgs.DURATION) || 0;
                return new Promise(resolve => setTimeout(resolve, duration * 1000));
            }
            return runBlockByOpcode(opcode, resolvedArgs, target)
                .then(() => {})
                .catch(err => console.warn('[通用积木执行器] 执行出错:', err.message));
        }

        // ---- 循环体 ----
        async runLoop(args) {
            if (!showFirstRunWarning()) return;
            const loopType = String(args.LOOP_TYPE);
            let loopArgs;
            try {
                loopArgs = JSON.parse(String(args.LOOP_ARGS));
            } catch (e) {
                loopArgs = {};
            }

            let blockList, argsList;
            try {
                blockList = JSON.parse(String(args.BLOCK_LIST));
                if (!Array.isArray(blockList)) blockList = [];
            } catch (e) {
                blockList = [];
            }
            try {
                argsList = JSON.parse(String(args.ARGS_LIST));
                if (!Array.isArray(argsList)) argsList = [];
            } catch (e) {
                argsList = [];
            }

            const minLen = Math.min(blockList.length, argsList.length);
            if (blockList.length !== argsList.length) {
                console.warn('[执行循环] 内部积木数量与参数数量不匹配，将按短者执行');
                blockList = blockList.slice(0, minLen);
                argsList = argsList.slice(0, minLen);
            }

            const children = blockList.map((op, idx) => ({
                opcode: op,
                args: argsList[idx] || {},
                inputName: 'SUBSTACK'
            }));

            const fakeNode = {
                opcode: loopType,
                args: loopArgs,
                children: children
            };

            try {
                await executeTree(fakeNode);
            } catch (e) {
                console.warn('[执行循环] 循环执行出错:', e.message);
            }
        }

        // ---- 执行组合积木（树） ----
        executeTree(args) {
            if (!showFirstRunWarning()) return;
            let tree;
            try {
                tree = JSON.parse(String(args.TREE));
            } catch (e) {
                console.warn('[执行组合积木] JSON 解析失败:', e.message);
                return;
            }
            return executeTree(tree)
                .catch(err => console.warn('[执行组合积木] 执行出错:', err.message));
        }

        // ---- 辅助 ----
        getOpcodeArgs(args) {
            const opcode = String(args.OPCODE);
            return JSON.stringify({ paramNames: [] });
        }

        listOpcode() {
            const opcodes = collectAllOpcodes();
            const filtered = [...opcodes].filter(name =>
                typeof name === 'string' &&
                !name.startsWith('get') &&
                !name.startsWith('set') &&
                !name.startsWith('_') &&
                name !== 'getInfo' &&
                name !== 'constructor'
            );
            return JSON.stringify(filtered);
        }

        help() {
            return `📖 通用积木执行器 - 帮助

        【执行单个积木】
        执行积木 [opcode] 参数 [JSON]          → 有返回值
        执行积木无返回值 [opcode] 参数 [JSON]   → 无返回值
        对角色 [名字] 执行积木 ...              → 指定目标角色

        【执行组合积木（树）】
        执行组合积木 [JSON树]   → 执行一个完整的积木树（包含循环、条件、等待等）
        树格式: {"opcode":"...", "args":{...}, "children":[{"opcode":"...","args":{...},"inputName":"..."}]}
        inputName 用于区分 CONDITION, SUBSTACK, SUBSTACK2 等。

        【变量支持】
        变量引用会被自动解析为当前值，支持条件判断。`;
        }

        debugInfo() {
            const keys = Object.keys(runtime).filter(k => typeof runtime[k] !== 'function');
            const funcs = Object.keys(runtime).filter(k => typeof runtime[k] === 'function').slice(0, 20);
            return JSON.stringify({ properties: keys.slice(0, 30), functions: funcs });
        }
    }

    // ============================================================
    // 8. 注册扩展
    // ============================================================
    Scratch.extensions.register(new RunAnyBlockExtension());
}(Scratch);