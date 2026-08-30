(function (Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('充值神的骨骼动画插件(Skeleton2D)必须以"非沙盒(unsandboxed)"模式加载！');
    }

    const vm = Scratch.vm;
    const runtime = vm.runtime;
    const D2R = Math.PI / 180, R2D = 180 / Math.PI;

    /* =========================================================
     *  更新日志 / 新增功能一览：
     *  1. 多选（Shift+点击）与框选（按B后拖拽）
     *  2. Blender式模态变换：G 移动 / R 旋转 / S 缩放 / E 挤出
     *  3. 变换中可按 X / Y 锁定坐标轴，可直接输入数字精确赋值，
     *     变换过程中视口会显示实时HUD提示（类型/轴向/数值）
     *  4. Enter/左键 确认变换，Esc/右键 取消变换
     *  5. Shift+D 复制骨骼；Ctrl+P 设置父级；Alt+P 清除父级
     *  6. 骨骼缩放 (scaleX/scaleY)，可动画，可用于挤压拉伸表现
     *  7. IK 反向动力学（CCD算法），可设置目标骨骼与链长
     *  8. 结构镜像（Ctrl+M，编辑模式）与姿态镜像（Ctrl+M，姿态/动画模式）
     *  9. 撤销/重做 (Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z)
     *  10. 骨骼锁定，防止误操作
     *  11. 权重平滑、清除单根骨骼权重
     *  12. 动画时间轴洋葱皮预览（显示前后关键帧的半透明骨架）
     *  13. 绑定/解绑骨骼到当前造型（未绑定时运行时不改变外观）
     *  14. 正式接入 .sb3 工程保存/加载流程：数据写入目标的隐藏工作区注释
     *      (target.comments 会被 scratch-vm 的 sb3 序列化器保存/加载)，
     *      并额外用 localStorage 做本地缓存兜底
     *  15. 渲染更新更健壮：优先使用 updateBitmapSkin，若未来
     *      scratch-render 版本调整/移除该接口，会自动尝试
     *      createBitmapSkin + updateDrawableSkinId 作为后备方案
     *  16. 修复"姿态模式旋转骨骼角色不跟着动"的问题
     *  17. 导出/导入骨骼JSON（可在不同精灵间迁移）
     *  18. 新增多个积木：绑定/解绑/查询绑定状态、直接读写骨骼姿态、
     *      设置IK、镜像姿态、获取动画名称列表
     *  19. [新增] 修复姿态/动画模式下骨骼旋转/位移幅度较大时，
     *      角色形变超出原图边界的部分会被"裁切消失"的问题：
     *      renderDeformedCanvas 现在会根据形变后网格顶点的实际
     *      包围盒动态扩展输出画布尺寸，并联动调整旋转中心偏移。
     *  20. [新增] 全新底部动画时间轴(Dope Sheet)：每个动画拥有
     *      独立的时间轴/当前播放时间，逐骨骼显示关键帧菱形标记，
     *      支持拖动/点击/双击直接操作关键帧。
     *  21. [新增] Blender式模式切换快捷键：
     *      Tab=编辑 / Ctrl+Tab=姿态 / Shift+Tab=权重 / Alt+Tab=动画
     *  22. [新增] X 删除所选骨骼(编辑模式)、I 插入关键帧(动画模式)、
     *      A 全选 / Alt+A 取消全选、Home 适配视图
     *  23. [新增] 更接近 Blender 的视觉风格：视口网格与坐标轴、
     *      模式徽章、骨骼配色方案(未选中/多选/活动)、状态栏、
     *      变换过程HUD提示、按钮hover效果
     *  24. [新增/修复] 弹窗系统完全重写为HTML自绘模态框，不再使用
     *      浏览器原生 alert/confirm/prompt。原生对话框会阻塞整个
     *      页面的渲染与事件循环、样式无法定制，且视觉上与编辑器
     *      割裂（必须关闭骨骼编辑器才能真正与其交互）。现在所有
     *      弹窗都以Promise异步方式呈现在编辑器同一套UI风格中，
     *      支持单行/多行输入、多字段表单、一键复制JSON、
     *      点击遮罩/Esc取消、Enter确认，不阻塞任何渲染。
     *      同时对整体UI（工具栏/面板/状态栏/时间轴）做了更精美的
     *      视觉打磨（渐变、阴影、圆角）。骨骼数据仍然直接保存进
     *      .sb3 工程（写入 target.comments，由 scratch-vm 的 sb3
     *      序列化器持久化），localStorage 仅作为本地兜底缓存。
     *  ========================================================= */

    /* =========================================================
     *  2D 仿射矩阵工具
     * ========================================================= */
    const M = {
        translate(x, y) { return [1, 0, 0, 1, x, y]; },
        rotate(rad) {
            const c = Math.cos(rad), s = Math.sin(rad);
            return [c, s, -s, c, 0, 0];
        },
        scale(sx, sy) { return [sx, 0, 0, sy, 0, 0]; },
        mul(A, B) {
            return [
                A[0] * B[0] + A[2] * B[1],
                A[1] * B[0] + A[3] * B[1],
                A[0] * B[2] + A[2] * B[3],
                A[1] * B[2] + A[3] * B[3],
                A[0] * B[4] + A[2] * B[5] + A[4],
                A[1] * B[4] + A[3] * B[5] + A[5]
            ];
        },
        apply(m, p) { return { x: m[0] * p.x + m[2] * p.y + m[4], y: m[1] * p.x + m[3] * p.y + m[5] }; },
        invert(m) {
            const [a, b, c, d, e, f] = m;
            const det = (a * d - b * c) || 1e-9;
            return [d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det];
        }
    };

    /* =========================================================
     *  数据模型：骨骼 / 骨架 / 动画
     * ========================================================= */
    let boneUID = 1;
    class Bone {
        constructor(name, parent) {
            this.id = boneUID++;
            this.name = name || ('bone' + this.id);
            this.parent = parent || null;
            // 绑定姿态(Setup / Edit Mode 编辑)
            this.setupX = 0; this.setupY = 0; this.setupRotation = 0; this.length = 60;
            this.setupScaleX = 1; this.setupScaleY = 1;
            // 当前姿态(Pose Mode / 动画播放)
            this.x = 0; this.y = 0; this.rotation = 0;
            this.scaleX = 1; this.scaleY = 1;
            // IK（反向动力学）
            this.ikEnabled = false;
            this.ikTarget = null;      // 目标骨骼的 id
            this.ikChainLength = 2;    // 参与解算的链长（含自身向上追溯的骨骼数）
            // 其它
            this.locked = false;       // 锁定后编辑/姿态模式下禁止对其变换
        }
        resetPose() {
            this.x = this.setupX; this.y = this.setupY; this.rotation = this.setupRotation;
            this.scaleX = this.setupScaleX; this.scaleY = this.setupScaleY;
        }
    }

    class SkeletonData {
        constructor() {
            this.bones = [];
            this.mesh = null; // {vertices:[{x,y,u,v,weights:[{boneId,w}]}], tris:[[i,j,k]], width, height}
            this.animations = {}; // name -> {duration, tracks:{boneId:[{t,x,y,rotation,scaleX,scaleY}]}}
            this.bound = false; // 是否已将骨骼"绑定"到该角色（供积木/运行时使用）
        }
    }

    const skeletonStore = new Map(); // target.id -> SkeletonData

    function storageKey(target) { return 'sk2d_' + (target.sprite ? target.sprite.name : target.id); }

    /* =========================================================
     *  正式接入 .sb3 工程保存/加载流程
     *  （骨骼数据的唯一权威来源：写入 target.comments，
     *   由 scratch-vm 的 sb3 序列化器随工程一起保存/加载。
     *   localStorage 只是加载时的本地兜底缓存，不是主存储。）
     * ========================================================= */
    const COMMENT_TAG = '\u0000SKELETON2D_DATA\u0000:';

    function getCommentsContainer(target) {
        if (!target.comments) {
            try { target.comments = new Map(); } catch (e) { return null; }
        }
        return target.comments;
    }
    function findDataComment(target) {
        const c = target.comments;
        if (!c) return null;
        try {
            const list = (typeof c.values === 'function') ? Array.from(c.values()) : Object.values(c);
            return list.find(cm => cm && typeof cm.text === 'string' && cm.text.indexOf(COMMENT_TAG) === 0) || null;
        } catch (e) { return null; }
    }
    function writeDataComment(target, jsonStr) {
        try {
            const container = getCommentsContainer(target);
            if (!container) return false;
            const text = COMMENT_TAG + jsonStr;
            const existing = findDataComment(target);
            if (existing) { existing.text = text; return true; }
            const id = 'skeleton2d_data_' + target.id;
            const comment = { blockId: null, x: 0, y: 0, width: 200, height: 200, minimized: true, text };
            if (typeof container.set === 'function') container.set(id, comment);
            else container[id] = comment;
            return true;
        } catch (e) {
            console.warn('充值神2D: 写入工程注释失败，本次将只使用本地存储兜底', e);
            return false;
        }
    }
    function readDataComment(target) {
        try {
            const cm = findDataComment(target);
            if (!cm) return null;
            return cm.text.slice(COMMENT_TAG.length);
        } catch (e) { return null; }
    }

    function serializeSkeleton(data) {
        return {
            bound: !!data.bound,
            bones: data.bones.map(b => ({
                id: b.id, name: b.name, parent: b.parent ? b.parent.id : null,
                setupX: b.setupX, setupY: b.setupY, setupRotation: b.setupRotation, length: b.length,
                setupScaleX: b.setupScaleX, setupScaleY: b.setupScaleY,
                ikEnabled: b.ikEnabled, ikTarget: b.ikTarget, ikChainLength: b.ikChainLength,
                locked: b.locked
            })),
            mesh: data.mesh,
            animations: data.animations
        };
    }
    function deserializeSkeleton(obj) {
        const data = new SkeletonData();
        data.bound = !!obj.bound;
        const map = new Map();
        (obj.bones || []).forEach(bd => {
            const b = new Bone(bd.name, null);
            b.id = bd.id; b.setupX = bd.setupX; b.setupY = bd.setupY;
            b.setupRotation = bd.setupRotation; b.length = bd.length;
            b.setupScaleX = (bd.setupScaleX != null) ? bd.setupScaleX : 1;
            b.setupScaleY = (bd.setupScaleY != null) ? bd.setupScaleY : 1;
            b.ikEnabled = !!bd.ikEnabled;
            b.ikTarget = (bd.ikTarget != null) ? bd.ikTarget : null;
            b.ikChainLength = bd.ikChainLength || 2;
            b.locked = !!bd.locked;
            b.resetPose();
            map.set(bd.id, b);
            data.bones.push(b);
            if (bd.id >= boneUID) boneUID = bd.id + 1;
        });
        (obj.bones || []).forEach(bd => { if (bd.parent != null) map.get(bd.id).parent = map.get(bd.parent); });
        data.mesh = obj.mesh || null;
        data.animations = obj.animations || {};
        return data;
    }
    function loadSkeleton(target) {
        if (skeletonStore.has(target.id)) return skeletonStore.get(target.id);
        let data = new SkeletonData();
        let raw = null;
        try { raw = readDataComment(target); } catch (e) { /* 忽略 */ }

        if (raw) {
            try { data = deserializeSkeleton(JSON.parse(raw)); } catch (e) { console.warn('Skeleton2D: 骨骼数据解析失败', e); }
        }
        skeletonStore.set(target.id, data);
        return data;
    }
    function saveSkeleton(target) {
        const data = skeletonStore.get(target.id);
        if (!data) return;
        const str = JSON.stringify(serializeSkeleton(data));
        writeDataComment(target, str);
        try { localStorage.setItem(storageKey(target), str); } catch (e) { /* 本地缓存兜底，失败忽略 */ }
    }

    // 工程重新加载后，之前缓存的 target 已失效，清空缓存并关闭已开启的编辑器
    try {
        runtime.on('PROJECT_LOADED', () => {
            skeletonStore.clear();
            sourceCache.forEach && sourceCache.clear();
            openEditors.forEach(ed => { try { ed._closed = true; ed.overlay.remove(); } catch (e) { /* 忽略 */ } });
            openEditors.clear();
            activePlayers.forEach(p => cancelAnimationFrame(p.raf));
            activePlayers.clear();
        });
    } catch (e) { /* 某些运行时可能没有该事件，忽略即可 */ }

    /* =========================================================
     *  骨骼世界变换（支持缩放）
     * ========================================================= */
    function computeWorldTransforms(bones, useSetup) {
        const cache = new Map();
        function comp(bone) {
            if (cache.has(bone)) return cache.get(bone);
            const x = useSetup ? bone.setupX : bone.x;
            const y = useSetup ? bone.setupY : bone.y;
            const rot = useSetup ? bone.setupRotation : bone.rotation;
            const sx = useSetup ? (bone.setupScaleX != null ? bone.setupScaleX : 1) : (bone.scaleX != null ? bone.scaleX : 1);
            const sy = useSetup ? (bone.setupScaleY != null ? bone.setupScaleY : 1) : (bone.scaleY != null ? bone.scaleY : 1);
            const local = M.mul(M.mul(M.translate(x, y), M.rotate(rot * D2R)), M.scale(sx, sy));
            let world, angle;
            if (bone.parent) {
                const p = comp(bone.parent);
                world = M.mul(p.matrix, local);
                angle = p.angle + rot;
            } else { world = local; angle = rot; }
            const head = M.apply(world, { x: 0, y: 0 });
            const tail = M.apply(world, { x: bone.length, y: 0 });
            const res = { matrix: world, angle, head, tail };
            cache.set(bone, res);
            return res;
        }
        bones.forEach(comp);
        return cache;
    }

    /* =========================================================
     *  IK 反向动力学（CCD算法）
     * ========================================================= */
    function solveIK(skeleton) {
        skeleton.bones.forEach(bone => {
            if (!bone.ikEnabled || bone.ikTarget == null || bone.locked) return;
            const targetBone = skeleton.bones.find(b => b.id === bone.ikTarget);
            if (!targetBone) return;
            const chain = [];
            let cur = bone;
            const chainLen = Math.max(1, bone.ikChainLength || 2);
            for (let i = 0; i < chainLen && cur; i++) { chain.unshift(cur); cur = cur.parent; }
            if (!chain.length) return;
            const iterations = 8;
            for (let iter = 0; iter < iterations; iter++) {
                for (let i = chain.length - 1; i >= 0; i--) {
                    const b = chain[i];
                    if (b.locked) continue;
                    const wt = computeWorldTransforms(skeleton.bones, false);
                    const targetWorld = wt.get(targetBone).head;
                    const bt = wt.get(b);
                    const endWorld = wt.get(chain[chain.length - 1]).tail;
                    const curAngle = Math.atan2(endWorld.y - bt.head.y, endWorld.x - bt.head.x);
                    const wantAngle = Math.atan2(targetWorld.y - bt.head.y, targetWorld.x - bt.head.x);
                    let delta = (wantAngle - curAngle) * R2D;
                    delta = ((delta + 540) % 360) - 180;
                    b.rotation += delta;
                }
            }
        });
    }

    /* =========================================================
     *  镜像功能
     * ========================================================= */
    function mirrorName(name) {
        const pairs = [
            [/\.L$/i, '.R'], [/\.R$/i, '.L'],
            [/_L$/i, '_R'], [/_R$/i, '_L'],
            [/^left_/i, 'right_'], [/^right_/i, 'left_'],
            [/左$/, '右'], [/右$/, '左']
        ];
        for (const [re, rep] of pairs) { if (re.test(name)) return name.replace(re, rep); }
        return name + '.mirror';
    }
    function mirrorStructural(skeleton, bones) {
        const map = new Map();
        const created = bones.map(b => {
            const nb = new Bone(mirrorName(b.name), null);
            nb.setupX = -b.setupX; nb.setupY = b.setupY;
            nb.setupRotation = (180 - b.setupRotation);
            nb.length = b.length;
            nb.setupScaleX = b.setupScaleX; nb.setupScaleY = b.setupScaleY;
            nb.resetPose();
            map.set(b, nb);
            return nb;
        });
        created.forEach((nb, i) => {
            const original = bones[i];
            nb.parent = (original.parent && map.has(original.parent)) ? map.get(original.parent) : original.parent;
        });
        skeleton.bones.push(...created);
        return created;
    }
    function mirrorPose(skeleton) {
        const byName = new Map(skeleton.bones.map(b => [b.name, b]));
        const done = new Set();
        skeleton.bones.forEach(b => {
            if (done.has(b.id) || b.locked) return;
            const mName = mirrorName(b.name);
            const partner = byName.get(mName);
            if (partner && partner !== b && !done.has(partner.id) && !partner.locked) {
                const tx = b.x, ty = b.y, tr = b.rotation;
                b.x = -partner.x; b.y = partner.y; b.rotation = -partner.rotation;
                partner.x = -tx; partner.y = ty; partner.rotation = -tr;
                done.add(b.id); done.add(partner.id);
            } else {
                b.x = -b.x; b.rotation = -b.rotation;
                done.add(b.id);
            }
        });
    }

    /* =========================================================
     *  网格生成 / 自动权重 / 权重平滑 / 蒙皮变形
     * ========================================================= */
    function generateMesh(skeleton, width, height, cols, rows) {
        const verts = [];
        for (let r = 0; r <= rows; r++) {
            for (let c = 0; c <= cols; c++) {
                verts.push({ x: (c / cols) * width, y: (r / rows) * height, u: c / cols, v: r / rows, weights: [] });
            }
        }
        const tris = [];
        const stride = cols + 1;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const i0 = r * stride + c, i1 = i0 + 1, i2 = i0 + stride, i3 = i2 + 1;
                tris.push([i0, i2, i1], [i1, i2, i3]);
            }
        }
        skeleton.mesh = { vertices: verts, tris, width, height };
        autoWeightMesh(skeleton);
    }

    function pointSegDist(p, a, b) {
        const abx = b.x - a.x, aby = b.y - a.y;
        const len2 = abx * abx + aby * aby || 1e-6;
        let t = ((p.x - a.x) * abx + (p.y - a.y) * aby) / len2;
        t = Math.max(0, Math.min(1, t));
        const cx = a.x + abx * t, cy = a.y + aby * t;
        return Math.hypot(p.x - cx, p.y - cy);
    }

    function autoWeightMesh(skeleton) {
        if (!skeleton.mesh || !skeleton.bones.length) return;
        const mesh = skeleton.mesh;
        const wt = computeWorldTransforms(skeleton.bones, true);
        const numVerts = mesh.vertices.length;

        // 1. 构建网格图邻接表（用于计算沿着网格表面的拓扑路径距离）
        const adj = Array.from({ length: numVerts }, () => []);
        mesh.tris.forEach(([i, j, k]) => {
            const addEdge = (u, v) => {
                const p1 = mesh.vertices[u], p2 = mesh.vertices[v];
                const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                adj[u].push({ node: v, dist: d });
                adj[v].push({ node: u, dist: d });
            };
            addEdge(i, j); addEdge(j, k); addEdge(k, i);
        });

        // 2. 对每根骨骼，使用 Dijkstra 算法计算网格顶点的拓扑连通距离
        const boneGraphDists = new Map();
        skeleton.bones.forEach(b => {
            const t = wt.get(b);
            // 找到距离骨骼线段最近的网格顶点作为拓扑起点
            let minDist = Infinity;
            let startVert = 0;
            mesh.vertices.forEach((v, idx) => {
                const d = pointSegDist(v, t.head, t.tail);
                if (d < minDist) {
                    minDist = d;
                    startVert = idx;
                }
            });

            // Dijkstra 测地距离
            const dists = new Float64Array(numVerts).fill(Infinity);
            dists[startVert] = 0;
            const visited = new Uint8Array(numVerts);

            for (let iter = 0; iter < numVerts; iter++) {
                let u = -1;
                let dMin = Infinity;
                for (let i = 0; i < numVerts; i++) {
                    if (!visited[i] && dists[i] < dMin) {
                        dMin = dists[i];
                        u = i;
                    }
                }
                if (u === -1 || dMin === Infinity) break;
                visited[u] = 1;

                for (const edge of adj[u]) {
                    if (!visited[edge.node]) {
                        const alt = dists[u] + edge.dist;
                        if (alt < dists[edge.node]) {
                            dists[edge.node] = alt;
                        }
                    }
                }
            }
            boneGraphDists.set(b.id, { dists, minDist });
        });

        // 3. 赋予权重：隔离无连通路径的间隔区域
        mesh.vertices.forEach((v, vIdx) => {
            const candidateBones = [];

            skeleton.bones.forEach(b => {
                const t = wt.get(b);
                const segD = pointSegDist(v, t.head, t.tail) + 1e-3;
                const bg = boneGraphDists.get(b.id);
                const gD = bg ? bg.dists[vIdx] : Infinity;

                // 若网格间存在间隔断开，gD 为 Infinity，直接排除该骨骼
                if (gD !== Infinity) {
                    const effectiveDist = segD + gD * 0.6;
                    candidateBones.push({ bone: b, d: effectiveDist });
                }
            });

            // 兜底方案：如果未找到连通顶点，退回到直接线性距离
            if (candidateBones.length === 0) {
                skeleton.bones.forEach(b => {
                    const t = wt.get(b);
                    candidateBones.push({ bone: b, d: pointSegDist(v, t.head, t.tail) + 1e-3 });
                });
            }

            candidateBones.sort((a, b) => a.d - b.d);
            const top = candidateBones.slice(0, Math.min(2, candidateBones.length));
            const invs = top.map(t => 1 / Math.pow(t.d, 2.5)); // 使用次方递减增强局部权重绑定
            const sum = invs.reduce((a, b) => a + b, 0) || 1;
            v.weights = top.map((t, i) => ({ boneId: t.bone.id, w: invs[i] / sum }));
        });
    }

    function buildAdjacency(mesh) {
        const adj = mesh.vertices.map(() => new Set());
        mesh.tris.forEach(([i, j, k]) => {
            adj[i].add(j); adj[i].add(k);
            adj[j].add(i); adj[j].add(k);
            adj[k].add(i); adj[k].add(j);
        });
        return adj;
    }
    function smoothWeights(skeleton) {
        if (!skeleton.mesh) return;
        const mesh = skeleton.mesh;
        const adj = buildAdjacency(mesh);
        const newWeights = mesh.vertices.map((v, idx) => {
            const acc = new Map();
            const addW = (arr, factor) => arr.forEach(w => acc.set(w.boneId, (acc.get(w.boneId) || 0) + w.w * factor));
            addW(v.weights, 0.5);
            const neighbors = Array.from(adj[idx]);
            const nf = neighbors.length ? (0.5 / neighbors.length) : 0;
            neighbors.forEach(n => addW(mesh.vertices[n].weights, nf));
            const total = Array.from(acc.values()).reduce((a, b) => a + b, 0) || 1;
            return Array.from(acc.entries())
                .map(([boneId, w]) => ({ boneId, w: w / total }))
                .sort((a, b) => b.w - a.w).slice(0, 4);
        });
        mesh.vertices.forEach((v, idx) => v.weights = newWeights[idx]);
    }

    function deformVertices(skeleton) {
        if (!skeleton.mesh) return [];
        const setup = computeWorldTransforms(skeleton.bones, true);
        const pose = computeWorldTransforms(skeleton.bones, false);
        const deform = new Map();
        skeleton.bones.forEach(b => deform.set(b.id, M.mul(pose.get(b).matrix, M.invert(setup.get(b).matrix))));
        return skeleton.mesh.vertices.map(v => {
            if (!v.weights.length) return { x: v.x, y: v.y };
            let x = 0, y = 0;
            v.weights.forEach(w => {
                const mat = deform.get(w.boneId);
                if (!mat) return;
                const p = M.apply(mat, { x: v.x, y: v.y });
                x += p.x * w.w; y += p.y * w.w;
            });
            return { x, y };
        });
    }

    /* =========================================================
     *  三角形仿射贴图（把原图按网格三角形warp成新形状）
     * ========================================================= */
    function affineFromTriangles(src, dst) {
        const x0 = src[0].x, y0 = src[0].y, x1 = src[1].x, y1 = src[1].y, x2 = src[2].x, y2 = src[2].y;
        const X0 = dst[0].x, Y0 = dst[0].y, X1 = dst[1].x, Y1 = dst[1].y, X2 = dst[2].x, Y2 = dst[2].y;
        const denom = x0 * (y1 - y2) + x1 * (y2 - y0) + x2 * (y0 - y1);
        if (Math.abs(denom) < 1e-9) return null;
        const a = (X0 * (y1 - y2) + X1 * (y2 - y0) + X2 * (y0 - y1)) / denom;
        const b = (Y0 * (y1 - y2) + Y1 * (y2 - y0) + Y2 * (y0 - y1)) / denom;
        const c = (X0 * (x2 - x1) + X1 * (x0 - x2) + X2 * (x1 - x0)) / denom;
        const d = (Y0 * (x2 - x1) + Y1 * (x0 - x2) + Y2 * (x1 - x0)) / denom;
        const e = X0 - a * x0 - c * y0;
        const f = Y0 - b * x0 - d * y0;
        return [a, b, c, d, e, f];
    }

    function drawWarpedTriangle(ctx, img, srcTri, dstTri) {
        const m = affineFromTriangles(srcTri, dstTri);
        if (!m) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(dstTri[0].x, dstTri[0].y);
        ctx.lineTo(dstTri[1].x, dstTri[1].y);
        ctx.lineTo(dstTri[2].x, dstTri[2].y);
        ctx.closePath();
        ctx.clip();
        ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
    }

    /* =========================================================
     *  [修复#19] 动态包围盒渲染：解决大幅旋转/位移后
     *  形变部分被裁切消失的问题。
     *  返回 {canvas, offsetX, offsetY}；offsetX/offsetY 是输出画布
     *  左上角相对于"原图(0,0)"在位图像素坐标系下的偏移量，
     *  调用方需要用它来修正传给渲染器的旋转中心(rotationCenter)。
     * ========================================================= */
    const MAX_CANVAS_DIM = 4096; // 安全上限，避免极端情况下画布无限增大
    function renderDeformedCanvas(skeleton, sourceCanvas, scale) {
        if (!skeleton.mesh) {
            const out = document.createElement('canvas');
            out.width = sourceCanvas.width; out.height = sourceCanvas.height;
            out.getContext('2d').drawImage(sourceCanvas, 0, 0);
            return { canvas: out, offsetX: 0, offsetY: 0 };
        }
        const deformed = deformVertices(skeleton);
        // 初始包围盒至少覆盖原图区域，再根据形变后的顶点扩展
        let minX = 0, minY = 0, maxX = sourceCanvas.width, maxY = sourceCanvas.height;
        deformed.forEach(p => {
            const x = p.x * scale, y = p.y * scale;
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
        });
        const PAD = 8; // 留白，避免边缘抗锯齿缺口
        minX -= PAD; minY -= PAD; maxX += PAD; maxY += PAD;
        let outW = Math.max(1, Math.ceil(maxX - minX));
        let outH = Math.max(1, Math.ceil(maxY - minY));
        if (outW > MAX_CANVAS_DIM) outW = MAX_CANVAS_DIM;
        if (outH > MAX_CANVAS_DIM) outH = MAX_CANVAS_DIM;
        const out = document.createElement('canvas');
        out.width = outW; out.height = outH;
        const ctx = out.getContext('2d');
        ctx.translate(-minX, -minY);
        const verts = skeleton.mesh.vertices;
        skeleton.mesh.tris.forEach(([i, j, k]) => {
            const src = [verts[i], verts[j], verts[k]].map(v => ({ x: v.x * scale, y: v.y * scale }));
            const dst = [deformed[i], deformed[j], deformed[k]].map(v => ({ x: v.x * scale, y: v.y * scale }));
            drawWarpedTriangle(ctx, sourceCanvas, src, dst);
        });
        return { canvas: out, offsetX: minX, offsetY: minY };
    }

    /* =========================================================
     *  造型资源 / 渲染到舞台
     * ========================================================= */
    function getCostumeInfo(target) {
        try { return target.sprite.costumes_[target.currentCostume]; } catch (e) { return null; }
    }

    function loadCostumeImage(target) {
        return new Promise((resolve, reject) => {
            const costume = getCostumeInfo(target);
            if (!costume) return reject('no costume');
            const img = new Image();
            img.onload = () => resolve({ img, costume });
            img.onerror = reject;
            img.src = costume.asset.encodeDataURI();
        });
    }
    function buildSourceCanvas(img, costume) {
        const res = costume.bitmapResolution || 1;
        const w = costume.size[0] * res, h = costume.size[1] * res;
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        return c;
    }

    // [修复#19联动] applyCanvasToTarget 现在接收 offsetX/offsetY，
    // 用于修正旋转中心，使动态扩展后的画布依然对齐在正确位置上。
    function applyCanvasToTarget(target, canvas, costume, offsetX, offsetY) {
        if (!runtime.renderer || !costume) return;
        const renderer = runtime.renderer;
        const resolution = costume.bitmapResolution || 1;
        const center = [costume.rotationCenterX - (offsetX || 0), costume.rotationCenterY - (offsetY || 0)];
        try {
            if (typeof renderer.updateBitmapSkin === 'function') {
                renderer.updateBitmapSkin(costume.skinId, canvas, resolution, center);
            } else if (typeof renderer.createBitmapSkin === 'function' && typeof renderer.updateDrawableSkinId === 'function') {
                const newSkinId = renderer.createBitmapSkin(canvas, resolution, center);
                const oldSkinId = costume.skinId;
                if (target.drawableID !== undefined) renderer.updateDrawableSkinId(target.drawableID, newSkinId);
                costume.skinId = newSkinId;
                if (typeof renderer.destroySkin === 'function' && oldSkinId !== undefined && oldSkinId !== newSkinId) {
                    try { renderer.destroySkin(oldSkinId); } catch (e2) { /* 忽略 */ }
                }
            } else {
                console.warn('Skeleton2D: 当前 scratch-render 版本没有可用的皮肤更新接口，蒙皮变形暂时无法显示，请检查/更新本插件。');
                return;
            }
            if (typeof runtime.requestRedraw === 'function') runtime.requestRedraw();
        } catch (e) {
            console.warn('Skeleton2D: 更新贴图失败（scratch-render 内部 API 可能已变化，请检查/更新本插件）', e);
        }
    }

    const sourceCache = new Map();
    async function ensureSource(target) {
        const costume = getCostumeInfo(target);
        if (!costume) throw new Error('no costume');
        const cached = sourceCache.get(target.id);
        if (cached && cached.costumeId === costume.assetId) return cached;
        const { img } = await loadCostumeImage(target);
        const canvas = buildSourceCanvas(img, costume);
        const entry = {
            canvas, costume, costumeId: costume.assetId,
            width: costume.size[0], height: costume.size[1], scale: costume.bitmapResolution || 1
        };
        sourceCache.set(target.id, entry);
        return entry;
    }

    async function updateTargetDeform(target, force) {
        const skeleton = loadSkeleton(target);
        let src;
        try { src = await ensureSource(target); } catch (e) { return; }
        if (!skeleton.mesh && skeleton.bones.length) {
            generateMesh(skeleton, src.width, src.height, 8, 8);
            saveSkeleton(target);
        }
        if (!skeleton.bound && !force) return;
        solveIK(skeleton);
        const { canvas: outCanvas, offsetX, offsetY } = renderDeformedCanvas(skeleton, src.canvas, src.scale);
        applyCanvasToTarget(target, outCanvas, src.costume, offsetX, offsetY);
    }

    /* =========================================================
     *  动画采样与播放（支持缩放关键帧）
     * ========================================================= */
    function sampleTrack(track, t) {
        if (!track || !track.length) return null;
        if (t <= track[0].t) return track[0];
        if (t >= track[track.length - 1].t) return track[track.length - 1];
        let a = track[0], b = track[track.length - 1];
        for (let i = 0; i < track.length - 1; i++) {
            if (t >= track[i].t && t <= track[i + 1].t) { a = track[i]; b = track[i + 1]; break; }
        }
        const span = (b.t - a.t) || 1e-6;
        const f = (t - a.t) / span;
        const dRot = ((b.rotation - a.rotation + 540) % 360) - 180;
        return {
            x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f,
            rotation: a.rotation + dRot * f,
            scaleX: (a.scaleX != null && b.scaleX != null) ? a.scaleX + (b.scaleX - a.scaleX) * f : 1,
            scaleY: (a.scaleY != null && b.scaleY != null) ? a.scaleY + (b.scaleY - a.scaleY) * f : 1
        };
    }
    function applyAnimationAtTime(skeleton, anim, t) {
        skeleton.bones.forEach(b => {
            const s = sampleTrack(anim.tracks[b.id], t);
            if (s) { b.x = s.x; b.y = s.y; b.rotation = s.rotation; b.scaleX = s.scaleX; b.scaleY = s.scaleY; }
            else b.resetPose();
        });
        solveIK(skeleton);
    }

    const activePlayers = new Map();
    function stopAnimationOn(target, name) {
        const p = activePlayers.get(target.id);
        if (p && (!name || p.name === name)) { cancelAnimationFrame(p.raf); activePlayers.delete(target.id); }
    }
    function playAnimationOn(target, name) {
        const skeleton = loadSkeleton(target);
        const anim = skeleton.animations[name];
        if (!anim) { console.warn('Skeleton2D: 找不到动画 "' + name + '"'); return; }
        stopAnimationOn(target);
        const state = { name, raf: 0, start: performance.now() };
        activePlayers.set(target.id, state);
        const duration = anim.duration || 1;
        function step(now) {
            if (activePlayers.get(target.id) !== state) return;
            const t = ((now - state.start) / 1000) % duration;
            applyAnimationAtTime(skeleton, anim, t);
            updateTargetDeform(target);
            state.raf = requestAnimationFrame(step);
        }
        state.raf = requestAnimationFrame(step);
    }

    /* =========================================================
     *  DOM 小工具
     * ========================================================= */
    function el(tag, props = {}, children = []) {
        const e = document.createElement(tag);
        Object.entries(props).forEach(([k, v]) => {
            if (k === 'style') Object.assign(e.style, v);
            else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
            else e.setAttribute(k, v);
        });
        (Array.isArray(children) ? children : [children]).forEach(c => {
            if (typeof c === 'string') e.appendChild(document.createTextNode(c));
            else if (c) e.appendChild(c);
        });
        return e;
    }

    /* =========================================================
     *  [新增/修复] 自绘HTML弹窗系统 —— 替代原生 alert/confirm/prompt
     *
     *  原生对话框存在的问题：
     *  ① 会阻塞浏览器主线程渲染（包括Scratch舞台/编辑器canvas的RAF循环），
     *     导致画面卡死，视觉上必须等对话框关闭（甚至部分环境下需要先
     *     关闭骨骼编辑器窗口）才能继续操作；
     *  ② 样式完全由浏览器决定，无法与编辑器的深色/Blender风格统一。
     *
     *  这里改为纯HTML/CSS实现、基于Promise的异步模态框：不阻塞任何
     *  渲染循环，样式与编辑器保持一致，支持单行/多行文本输入、
     *  多字段表单（用于"生成网格"的列数/行数等）、一键复制到剪贴板
     *  （用于导出JSON），并支持 Enter 确认 / Esc 取消 / 点击遮罩取消。
     * ========================================================= */
    function sk2dDialog(opts) {
        return new Promise((resolve) => {
            let finished = false;
            const fieldEls = {};
            const cancelVal = (opts.type === 'confirm') ? false : null;

            const finish = (val) => {
                if (finished) return;
                finished = true;
                document.removeEventListener('keydown', onEsc, true);
                box.style.transform = 'scale(.96)';
                backdrop.style.opacity = '0';
                setTimeout(() => { try { backdrop.remove(); } catch (e) { /* 忽略 */ } }, 130);
                resolve(val);
            };

            const backdrop = el('div', {
                style: {
                    position: 'fixed', left: '0', top: '0', right: '0', bottom: '0', zIndex: '1000050',
                    background: 'rgba(8,8,11,0.62)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontFamily: '"Segoe UI","Microsoft YaHei",sans-serif',
                    transition: 'opacity .14s ease', opacity: '0'
                }
            });
            const box = el('div', {
                style: {
                    minWidth: '340px', maxWidth: '92vw', width: opts.wide ? '540px' : 'auto',
                    background: 'linear-gradient(180deg,#302f36,#242327)',
                    border: '1px solid #4d4d56', borderRadius: '12px',
                    boxShadow: '0 18px 50px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.04)',
                    padding: '18px 20px', color: '#eee', transform: 'scale(.96)',
                    transition: 'transform .14s ease'
                }
            });
            backdrop.appendChild(box);

            if (opts.title) {
                box.appendChild(el('div', {
                    style: {
                        fontWeight: 'bold', fontSize: '15px', marginBottom: '10px', color: '#ffcc66',
                        borderBottom: '1px solid #3f3f46', paddingBottom: '9px', letterSpacing: '.2px'
                    }
                }, [opts.title]));
            }
            if (opts.message) {
                box.appendChild(el('div', {
                    class: 'sk2d-scroll',
                    style: {
                        fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-wrap',
                        marginBottom: '12px', color: '#cfcfd2', maxHeight: '46vh', overflowY: 'auto'
                    }
                }, [opts.message]));
            }

            const inputStyle = {
                width: '100%', boxSizing: 'border-box', background: '#17171a', color: '#eaeaea',
                border: '1px solid #55555e', borderRadius: '7px', padding: '8px 10px',
                fontSize: '13px', outline: 'none'
            };

            let mainInput = null;
            if (opts.type === 'prompt') {
                mainInput = opts.multiline
                    ? el('textarea', { rows: String(opts.rows || 4), style: Object.assign({}, inputStyle, { fontFamily: 'Consolas,monospace', fontSize: '12px', resize: 'vertical' }) })
                    : el('input', { type: 'text', style: inputStyle });
                mainInput.value = (opts.defaultValue != null) ? String(opts.defaultValue) : '';
                box.appendChild(mainInput);
                box.appendChild(el('div', { style: { height: '12px' } }));
            }

            if (opts.fields && opts.fields.length) {
                const grid = el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' } });
                opts.fields.forEach(f => {
                    const wrap = el('div', {});
                    wrap.appendChild(el('div', { style: { fontSize: '12px', color: '#aaa', marginBottom: '3px' } }, [f.label]));
                    const inp = el('input', { type: f.type || 'text', step: f.step || '1', style: inputStyle });
                    inp.value = (f.defaultValue != null) ? String(f.defaultValue) : '';
                    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
                    fieldEls[f.key] = inp;
                    wrap.appendChild(inp);
                    grid.appendChild(wrap);
                });
                box.appendChild(grid);
            }

            const collect = () => {
                if (opts.type === 'prompt') return mainInput.value;
                if (opts.fields && opts.fields.length) {
                    const out = {};
                    opts.fields.forEach(f => out[f.key] = fieldEls[f.key].value);
                    return out;
                }
                return true;
            };
            function submit() { finish(collect()); }

            if (mainInput) {
                if (!opts.multiline) {
                    mainInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
                } else {
                    mainInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); submit(); } });
                }
            }

            const btnRow = el('div', { style: { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' } });
            if (opts.showCopy && mainInput) {
                const copyBtn = el('button', {
                    class: 'sk2d-btn', style: {
                        background: '#3d3d44', color: '#eee', border: '1px solid #55555a', borderRadius: '6px',
                        padding: '7px 14px', cursor: 'pointer', fontSize: '13px'
                    }, onclick: async () => {
                        try {
                            await navigator.clipboard.writeText(mainInput.value);
                            copyBtn.textContent = '✓ 已复制';
                            setTimeout(() => { copyBtn.textContent = '📋 复制'; }, 1200);
                        } catch (e) {
                            mainInput.focus(); mainInput.select();
                        }
                    }
                }, ['📋 复制']);
                btnRow.appendChild(copyBtn);
            }
            if (opts.type !== 'alert' && !opts.hideCancel) {
                btnRow.appendChild(el('button', {
                    class: 'sk2d-btn', style: {
                        background: '#3d3d44', color: '#eee', border: '1px solid #55555a', borderRadius: '6px',
                        padding: '7px 14px', cursor: 'pointer', fontSize: '13px'
                    }, onclick: () => finish(cancelVal)
                }, [opts.cancelText || '取消']));
            }
            const okBtn = el('button', {
                class: 'sk2d-btn', style: {
                    background: 'linear-gradient(180deg,#ffd479,#f0a830)', color: '#1a1a1a', border: '1px solid #d89020',
                    borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold'
                }, onclick: submit
            }, [opts.okText || '确定']);
            btnRow.appendChild(okBtn);
            box.appendChild(btnRow);

            const onEsc = (e) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(cancelVal); } };
            document.addEventListener('keydown', onEsc, true);
            backdrop.addEventListener('mousedown', (e) => { if (e.target === backdrop) finish(cancelVal); });

            document.body.appendChild(backdrop);
            requestAnimationFrame(() => {
                backdrop.style.opacity = '1';
                box.style.transform = 'scale(1)';
                if (mainInput) { mainInput.focus(); if (mainInput.select) mainInput.select(); }
                else if (opts.fields && opts.fields.length) fieldEls[opts.fields[0].key].focus();
                else okBtn.focus();
            });
        });
    }
    const Sk2dDialog = {
        alert(message, title) { return sk2dDialog({ type: 'alert', message, title: title || '提示' }); },
        confirm(message, title) { return sk2dDialog({ type: 'confirm', message, title: title || '确认' }); },
        prompt(message, defaultValue, extra) { return sk2dDialog(Object.assign({ type: 'prompt', message, defaultValue, title: '输入' }, extra || {})); },
        fields(title, message, fieldsList) { return sk2dDialog({ type: 'fields', title, message, fields: fieldsList, wide: true }); }
    };

    /* =========================================================
     *  骨骼编辑器 UI（类 Blender）
     * ========================================================= */
    class SkeletonEditor {
        constructor(target) {
            this.target = target;
            this.skeleton = loadSkeleton(target);
            this.mode = 'edit';
            this.selected = null;
            this.selectedSet = new Set(); // 多选集合
            this.view = { scale: 1, ox: 0, oy: 0 };
            this.brush = { radius: 30, strength: 0.5 };
            this.currentAnim = null;
            this.currentTime = 0;
            this.animTimes = {};      // [新增] 每个动画独立记录当前播放时间
            this.selectedKeyframe = null; // [新增] 时间轴上被选中的关键帧 {boneId, t}
            this.dragging = null;
            this.modal = null; // 当前进行中的模态变换(G/R/S/E)
            this.sourceEntry = null;
            this._closed = false;
            this._previewPlaying = false;
            this._shiftDown = false;
            this._ctrlDown = false;
            this._boxSelectArmed = false;
            this._undoStack = [];
            this._redoStack = [];
            this._buildDOM();
            this._loadSource();
            requestAnimationFrame((t) => this._loop(t));
        }

        async _loadSource() {
            this.sourceEntry = await ensureSource(this.target).catch(() => null);
            this._fitView();
            this._refreshBoneList();
        }
        _fitView() {
            if (!this.sourceEntry) return;
            const vw = this.canvas.width, vh = this.canvas.height;
            const s = Math.min(vw / this.sourceEntry.width, vh / this.sourceEntry.height) * 0.9;
            this.view.scale = s || 1;
            this.view.ox = vw / 2 - (this.sourceEntry.width * this.view.scale) / 2;
            this.view.oy = vh / 2 - (this.sourceEntry.height * this.view.scale) / 2;
        }
        toLogical(p) { return { x: (p.x - this.view.ox) / this.view.scale, y: (p.y - this.view.oy) / this.view.scale }; }

        _btnStyle(small) {
            return {
                background: '#3d3d44', color: '#eee', border: '1px solid #55555a', borderRadius: '6px',
                padding: small ? '4px 8px' : '6px 12px', cursor: 'pointer', fontSize: small ? '12px' : '13px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.4)'
            };
        }
        _mkBtn(label, onclick, small) {
            return el('button', { class: 'sk2d-btn', style: this._btnStyle(small), onclick, title: label }, [label]);
        }
        _modeColor(id) {
            return { edit: '#ff8000', pose: '#3fa9f5', weight: '#e05fd0', animation: '#5cd65c' }[id] || '#4caf50';
        }
        _modeLabel(id) {
            return { edit: '编辑模式', pose: '姿态模式', weight: '权重绘制', animation: '动画模式' }[id] || id;
        }

        /* ---------- 选择相关 ---------- */
        getSelectedBones() {
            if (this.selectedSet && this.selectedSet.size) {
                return Array.from(this.selectedSet).filter(b => this.skeleton.bones.includes(b));
            }
            return this.selected ? [this.selected] : [];
        }
        _selectClick(bone, additive) {
            if (!this.selectedSet) this.selectedSet = new Set();
            if (additive) {
                if (this.selectedSet.has(bone)) this.selectedSet.delete(bone); else this.selectedSet.add(bone);
            } else if (!this.selectedSet.has(bone) || this.selectedSet.size === 1) {
                this.selectedSet = new Set([bone]);
            }
            this.selected = bone;
            this._refreshBoneList();
            this._refreshProps();
        }
        _selectAllBones(selectAll) {
            if (selectAll) {
                this.selectedSet = new Set(this.skeleton.bones);
                this.selected = this.skeleton.bones[this.skeleton.bones.length - 1] || null;
            } else {
                this.selectedSet = new Set();
                this.selected = null;
            }
            this._refreshBoneList();
            this._refreshProps();
        }

        /* ---------- 撤销/重做 ---------- */
        _snapshot() {
            try {
                this._undoStack.push(JSON.stringify(serializeSkeleton(this.skeleton)));
                if (this._undoStack.length > 60) this._undoStack.shift();
                this._redoStack = [];
            } catch (e) { /* 忽略 */ }
        }
        _restore(jsonStr) {
            const data = deserializeSkeleton(JSON.parse(jsonStr));
            this.skeleton.bones = data.bones;
            this.skeleton.mesh = data.mesh;
            this.skeleton.animations = data.animations;
            this.skeleton.bound = data.bound;
            this.selected = null; this.selectedSet = new Set();
            this.selectedKeyframe = null;
            this.animTimes = {};
            this._refreshBoneList(); this._refreshProps(); this._syncTimeline();
            if (this.bindBtn) { this.bindBtn.textContent = this.skeleton.bound ? '已绑定 ✓' : '绑定骨骼'; }
            saveSkeleton(this.target);
        }
        _undo() {
            if (!this._undoStack.length) return;
            const cur = JSON.stringify(serializeSkeleton(this.skeleton));
            const prev = this._undoStack.pop();
            this._redoStack.push(cur);
            this._restore(prev);
        }
        _redo() {
            if (!this._redoStack.length) return;
            const cur = JSON.stringify(serializeSkeleton(this.skeleton));
            const next = this._redoStack.pop();
            this._undoStack.push(cur);
            this._restore(next);
        }

        _buildDOM() {
            const self = this;

            // 全局样式（hover效果/滚动条美化/整体视觉打磨等）
            if (!document.getElementById('sk2d-style')) {
                const style = document.createElement('style');
                style.id = 'sk2d-style';
                style.textContent = `
                    .sk2d-btn { transition: filter .15s, transform .05s, box-shadow .15s; }
                    .sk2d-btn:hover { filter: brightness(1.25); box-shadow: 0 2px 6px rgba(0,0,0,0.5); }
                    .sk2d-btn:active { transform: translateY(1px); }
                    .sk2d-btn:focus { outline: 2px solid rgba(255,204,102,0.6); }
                    .sk2d-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
                    .sk2d-scroll::-webkit-scrollbar-thumb { background: #555; border-radius: 4px; }
                    .sk2d-scroll::-webkit-scrollbar-track { background: #1a1a1d; }
                `;
                document.head.appendChild(style);
            }

            this.overlay = el('div', {
                style: {
                    position: 'fixed', left: 0, top: 0, width: '100%', height: '100%',
                    background: 'rgba(20,20,24,0.97)', zIndex: 999999, display: 'flex',
                    flexDirection: 'column', fontFamily: 'sans-serif', color: '#eee'
                }
            });

            const toolbar = el('div', {
                style: {
                    display: 'flex', alignItems: 'center', padding: '7px 12px',
                    background: 'linear-gradient(180deg,#313136,#26262a)', gap: '8px', flexWrap: 'wrap',
                    borderBottom: '1px solid #050505', boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                }
            });
            toolbar.appendChild(el('b', {}, ['🦴 骨骼编辑器 - ' + (this.target.getName ? this.target.getName() : this.target.sprite.name)]));
            this.modeBadge = el('span', { style: { padding: '3px 10px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', color: '#111', background: this._modeColor('edit'), boxShadow: '0 1px 3px rgba(0,0,0,0.5)' } }, [this._modeLabel('edit')]);
            toolbar.appendChild(this.modeBadge);
            const modes = [['edit', '编辑模式', 'Tab'], ['pose', '姿态模式', 'Ctrl+Tab'], ['weight', '权重绘制', 'Shift+Tab'], ['animation', '动画模式', 'Alt+Tab']];
            this.modeBtns = {};
            modes.forEach(([id, label, hint]) => {
                const b = el('button', { class: 'sk2d-btn', title: hint, style: this._btnStyle(), onclick: () => self.setMode(id) }, [label + '(' + hint + ')']);
                this.modeBtns[id] = b;
                toolbar.appendChild(b);
            });
            this.bindBtn = this._mkBtn(this.skeleton.bound ? '已绑定 ✓' : '绑定骨骼', () => self._toggleBind(), false);
            toolbar.appendChild(this.bindBtn);
            toolbar.appendChild(this._mkBtn('↩ 撤销', () => self._undo(), false));
            toolbar.appendChild(this._mkBtn('↪ 重做', () => self._redo(), false));
            toolbar.appendChild(this._mkBtn('快捷键?', () => self._showShortcuts(), false));
            toolbar.appendChild(el('div', { style: { flex: '1' } }));
            toolbar.appendChild(this._mkBtn('关闭 ✕', () => self.close(), false));
            this.overlay.appendChild(toolbar);

            const main = el('div', { style: { flex: '1', display: 'flex', minHeight: 0 } });

            const left = el('div', { style: { width: '230px', background: 'linear-gradient(180deg,#26262a,#202024)', padding: '10px', overflowY: 'auto', boxSizing: 'border-box', borderRight: '1px solid #060606' }, class: 'sk2d-scroll' });
            left.appendChild(el('div', { style: { fontWeight: 'bold', marginBottom: '6px' } }, ['骨骼层级 (点击空白处创建骨骼，Shift+点击可多选)']));
            this.boneListEl = el('div', {});
            left.appendChild(this.boneListEl);
            left.appendChild(el('hr', { style: { borderColor: '#3a3a40' } }));
            left.appendChild(this._mkBtn('生成网格', () => self._promptGenMesh(), true));
            left.appendChild(el('div', { style: { height: '6px' } }));
            left.appendChild(this._mkBtn('自动绑定权重', () => { self._snapshot(); autoWeightMesh(self.skeleton); saveSkeleton(self.target); }, true));
            left.appendChild(el('div', { style: { height: '6px' } }));
            left.appendChild(this._mkBtn('镜像所选骨骼(结构)', () => self._mirrorSelected(), true));
            left.appendChild(el('div', { style: { height: '6px' } }));
            left.appendChild(this._mkBtn('镜像当前姿态', () => self._mirrorCurrentPoseAction(), true));
            left.appendChild(el('div', { style: { height: '6px' } }));
            left.appendChild(this._mkBtn('导出骨骼JSON', () => self._exportJSON(), true));
            left.appendChild(el('div', { style: { height: '6px' } }));
            left.appendChild(this._mkBtn('导入骨骼JSON', () => self._importJSON(), true));
            main.appendChild(left);

            const viewportWrap = el('div', { style: { flex: '1', position: 'relative', background: '#3a3a40', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.35)' } });
            this.canvas = el('canvas', { style: { width: '100%', height: '100%', display: 'block', cursor: 'crosshair' } });
            viewportWrap.appendChild(this.canvas);
            this.statusBar = el('div', {
                style: {
                    position: 'absolute', left: 0, right: 0, bottom: 0, padding: '4px 10px',
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)', fontSize: '11px', color: '#ccc',
                    fontFamily: 'monospace', pointerEvents: 'none', borderTop: '1px solid rgba(255,255,255,0.06)'
                }
            }, ['']);
            viewportWrap.appendChild(this.statusBar);
            main.appendChild(viewportWrap);

            const right = el('div', { style: { width: '240px', background: 'linear-gradient(180deg,#26262a,#202024)', padding: '10px', overflowY: 'auto', boxSizing: 'border-box', borderLeft: '1px solid #060606' }, class: 'sk2d-scroll' });
            right.appendChild(el('div', { style: { fontWeight: 'bold', marginBottom: '6px' } }, ['⚙ 属性']));
            this.propsEl = el('div', {});
            right.appendChild(this.propsEl);
            main.appendChild(right);

            this.overlay.appendChild(main);

            this._buildTimelinePanel();

            document.body.appendChild(this.overlay);

            const resize = () => {
                this.canvas.width = viewportWrap.clientWidth; this.canvas.height = viewportWrap.clientHeight;
                this._fitView();
                this._drawDopeSheet();
            };
            window.addEventListener('resize', resize);
            this._resizeHandler = resize;
            setTimeout(resize, 0);

            this._bindCanvasEvents();

            this._keyDown = (e) => {
                if (self.modal) { self._modalKey(e); return; }
                const activeTag = document.activeElement && document.activeElement.tagName;
                if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') {
                    if (e.key === 'Escape') document.activeElement.blur();
                    return; // 避免在输入框里打字触发快捷键
                }
                const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
                if (e.key === 'Shift') self._shiftDown = true;
                if (e.key === 'Control' || e.key === 'Meta') self._ctrlDown = true;
                if (e.key === 'Escape') { self.close(); return; }
                if (e.key === 'Home') { self._fitView(); return; }

                // Blender式模式切换
                if (e.key === 'Tab') {
                    e.preventDefault();
                    if (e.ctrlKey) self.setMode('pose');
                    else if (e.shiftKey) self.setMode('weight');
                    else if (e.altKey) self.setMode('animation');
                    else self.setMode('edit');
                    return;
                }

                if (k === 'z' && e.ctrlKey && !e.shiftKey) { e.preventDefault(); self._undo(); return; }
                if ((k === 'y' && e.ctrlKey) || (k === 'z' && e.ctrlKey && e.shiftKey)) { e.preventDefault(); self._redo(); return; }

                if ((e.key === 'Delete' || e.key === 'Backspace' || k === 'x') && self.mode === 'edit' && !e.ctrlKey && !e.metaKey) {
                    const sel = self.getSelectedBones();
                    if (sel.length) { self._snapshot(); sel.slice().forEach(b => self._deleteBone(b)); }
                    return;
                }

                if (k === 'b' && (self.mode === 'edit' || self.mode === 'pose' || self.mode === 'animation')) { self._boxSelectArmed = true; return; }
                if (k === 'a' && !e.ctrlKey && (self.mode === 'edit' || self.mode === 'pose' || self.mode === 'animation')) {
                    self._selectAllBones(!e.altKey);
                    return;
                }

                if (self.mode === 'edit' || self.mode === 'pose' || self.mode === 'animation') {
                    if (k === 'g' && self.getSelectedBones().length) { self._startModal('grab'); return; }
                    if (k === 'r' && self.getSelectedBones().length) { self._startModal('rotate'); return; }
                    if (k === 's' && self.getSelectedBones().length) { self._startModal('scale'); return; }
                    if (k === 'e' && self.mode === 'edit' && self.getSelectedBones().length) { self._startModal('extrude'); return; }
                    if (k === 'd' && e.shiftKey && self.mode === 'edit') { self._duplicateSelected(); return; }
                    if (k === 'p' && e.ctrlKey && self.mode === 'edit') { e.preventDefault(); self._parentSelectedToActive(); return; }
                    if (k === 'p' && e.altKey && self.mode === 'edit') { self._clearParentSelected(); return; }
                    if (k === 'm' && e.ctrlKey) {
                        e.preventDefault();
                        if (self.mode === 'edit') self._mirrorSelected(); else self._mirrorCurrentPoseAction();
                        return;
                    }
                    if (k === 'i' && self.mode === 'animation') { self._addKeyframe(); return; }
                }
            };
            this._keyUp = (e) => {
                if (e.key === 'Shift') self._shiftDown = false;
                if (e.key === 'Control' || e.key === 'Meta') self._ctrlDown = false;
            };
            window.addEventListener('keydown', this._keyDown);
            window.addEventListener('keyup', this._keyUp);

            this.setMode('edit');
        }

        _toggleBind() {
            this.skeleton.bound = !this.skeleton.bound;
            this.bindBtn.textContent = this.skeleton.bound ? '已绑定 ✓' : '绑定骨骼';
            this.bindBtn.style.background = this.skeleton.bound ? '#4caf50' : '#3d3d44';
            saveSkeleton(this.target);
            updateTargetDeform(this.target, true);
        }
        _showShortcuts() {
            Sk2dDialog.alert(
                'Tab 编辑模式   Ctrl+Tab 姿态模式   Shift+Tab 权重绘制   Alt+Tab 动画模式\n' +
                'G 移动   R 旋转   S 缩放   E 挤出(仅编辑模式)\n' +
                '变换中按 X / Y 锁定坐标轴（如 G 后按 X 只在X轴移动），可直接输入数字精确赋值\n' +
                'Enter 或 左键 确认变换，Esc 或 右键 取消变换\n' +
                'X / Delete / Backspace 删除所选骨骼(编辑模式)\n' +
                'A 全选骨骼   Alt+A 取消全选\n' +
                'Shift+点击 加选/取消选中，B 后拖拽为框选\n' +
                'Shift+D 复制所选骨骼(编辑模式)\n' +
                'Ctrl+P 设置父级(编辑模式)   Alt+P 清除父级(编辑模式)\n' +
                'Ctrl+M 镜像(编辑模式=结构镜像，姿态/动画模式=镜像姿态)\n' +
                'I 插入关键帧(动画模式，对所选骨骼；未选中则对全部骨骼)\n' +
                'Ctrl+Z 撤销   Ctrl+Y / Ctrl+Shift+Z 重做\n' +
                'Home 重置/适配视图\n' +
                '底部时间轴：拖动可直接跳转时间；点击菱形关键帧可选中并跳转；\n' +
                '双击某行空白处可在该时间为该骨骼插入关键帧',
                '⌨ Blender风格快捷键说明'
            );
        }
        async _exportJSON() {
            const str = JSON.stringify(serializeSkeleton(this.skeleton));
            await Sk2dDialog.prompt(
                '以下为骨骼数据(JSON)，可点击"复制"后粘贴到其他精灵中导入：',
                str,
                { title: '📤 导出骨骼JSON', multiline: true, rows: 12, okText: '关闭', hideCancel: true, showCopy: true, wide: true }
            );
        }
        async _importJSON() {
            const str = await Sk2dDialog.prompt(
                '粘贴要导入的骨骼数据(JSON)：',
                '',
                { title: '📥 导入骨骼JSON', multiline: true, rows: 12, wide: true }
            );
            if (!str) return;
            try {
                this._snapshot();
                const data = deserializeSkeleton(JSON.parse(str));
                this.skeleton.bones = data.bones;
                this.skeleton.mesh = data.mesh;
                this.skeleton.animations = data.animations;
                this.skeleton.bound = data.bound;
                this.selected = null; this.selectedSet = new Set();
                this.selectedKeyframe = null;
                this.animTimes = {};
                this._refreshBoneList(); this._refreshProps(); this._syncTimeline();
                this.bindBtn.textContent = this.skeleton.bound ? '已绑定 ✓' : '绑定骨骼';
                saveSkeleton(this.target);
            } catch (e) {
                await Sk2dDialog.alert('导入失败：JSON 格式不正确', '❌ 错误');
            }
        }

        /* =========================================================
         *  [新增] 底部动画时间轴 / Dope Sheet
         * ========================================================= */
        _buildTimelinePanel() {
            const self = this;
            const panel = el('div', { style: { display: 'none', flexDirection: 'column', background: '#232327', borderTop: '2px solid #050505' } });
            this.timelineEl = panel;

            const bar = el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', flexWrap: 'wrap', background: 'linear-gradient(180deg,#2d2d32,#242428)' } });
            bar.appendChild(el('span', { style: { color: '#ffae42', fontWeight: 'bold' } }, ['⏱ 动画:']));
            this.animSelect = el('select', { class: 'sk2d-btn', onchange: () => self._switchAnimation(self.animSelect.value || null) });
            bar.appendChild(this.animSelect);
            bar.appendChild(this._mkBtn('+ 新建', () => self._newAnimation(), true));
            bar.appendChild(this._mkBtn('🗑 删除动画', () => self._deleteAnimation(), true));
            bar.appendChild(el('span', {}, ['时长(秒):']));
            this.durationInput = el('input', {
                type: 'number', step: '0.1', style: { width: '60px' }, onchange: () => {
                    const a = self.skeleton.animations[self.currentAnim];
                    if (a) { a.duration = Math.max(0.1, parseFloat(self.durationInput.value) || 1); saveSkeleton(self.target); self._drawDopeSheet(); }
                }
            });
            bar.appendChild(this.durationInput);
            this.timeLabel = el('span', { style: { minWidth: '54px', display: 'inline-block', fontFamily: 'monospace' } }, ['0.00s']);
            bar.appendChild(this.timeLabel);
            this.playBtn = this._mkBtn('▶ 预览播放', () => self._togglePreview(), true);
            bar.appendChild(this.playBtn);
            bar.appendChild(this._mkBtn('➕ 插入关键帧 (I)', () => self._addKeyframe(), true));
            bar.appendChild(this._mkBtn('🗑 删除关键帧', () => self._removeKeyframe(), true));
            bar.appendChild(this._mkBtn('镜像姿态 (Ctrl+M)', () => self._mirrorCurrentPoseAction(), true));
            panel.appendChild(bar);

            const scroller = el('div', { class: 'sk2d-scroll', style: { maxHeight: '190px', overflowY: 'auto', overflowX: 'hidden', position: 'relative', borderTop: '1px solid #050505' } });
            this.dopeCanvas = el('canvas', { style: { display: 'block', width: '100%', cursor: 'text' } });
            scroller.appendChild(this.dopeCanvas);
            panel.appendChild(scroller);
            this._dopeScroller = scroller;

            this.overlay.appendChild(panel);
            this._bindDopeSheetEvents();
        }

        _dopeLayout() {
            this.rulerHeight = 22;
            this.rowHeight = 20;
            this.labelWidth = 110;
        }
        _drawDopeSheet() {
            if (!this.dopeCanvas) return;
            this._dopeLayout();
            const bones = this.skeleton.bones;
            const width = (this._dopeScroller && this._dopeScroller.clientWidth) || 400;
            const height = this.rulerHeight + Math.max(1, bones.length) * this.rowHeight;
            if (this.dopeCanvas.width !== width) this.dopeCanvas.width = width;
            if (this.dopeCanvas.height !== height) this.dopeCanvas.height = height;
            this.dopeCanvas.style.height = height + 'px';
            const ctx = this.dopeCanvas.getContext('2d');
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#1c1c1f';
            ctx.fillRect(0, 0, width, height);

            const anim = this.currentAnim ? this.skeleton.animations[this.currentAnim] : null;
            const duration = anim ? (anim.duration || 1) : 1;
            const trackW = Math.max(10, width - this.labelWidth - 8);
            const timeToX = (t) => this.labelWidth + (t / duration) * trackW;

            // 标尺背景
            ctx.fillStyle = '#28282c';
            ctx.fillRect(this.labelWidth, 0, trackW + 8, this.rulerHeight);
            ctx.strokeStyle = '#444';
            ctx.beginPath(); ctx.moveTo(0, this.rulerHeight); ctx.lineTo(width, this.rulerHeight); ctx.stroke();

            // 刻度
            ctx.fillStyle = '#aaa';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            const tickCount = 10;
            for (let i = 0; i <= tickCount; i++) {
                const t = (duration * i) / tickCount;
                const x = timeToX(t);
                ctx.strokeStyle = '#555';
                ctx.beginPath(); ctx.moveTo(x, this.rulerHeight - 6); ctx.lineTo(x, this.rulerHeight); ctx.stroke();
                ctx.fillText(t.toFixed(2), x, this.rulerHeight - 9);
            }

            // 每根骨骼一行
            bones.forEach((b, i) => {
                const y = this.rulerHeight + i * this.rowHeight;
                const isSelRow = (this.selected === b);
                ctx.fillStyle = isSelRow ? '#3a3d22' : (i % 2 === 0 ? '#202024' : '#232327');
                ctx.fillRect(0, y, width, this.rowHeight);
                ctx.fillStyle = b.locked ? '#888' : (isSelRow ? '#ffe066' : '#ddd');
                ctx.textAlign = 'left';
                ctx.font = '11px sans-serif';
                ctx.fillText((b.locked ? '🔒 ' : '') + b.name, 6, y + this.rowHeight / 2 + 4);
                ctx.strokeStyle = '#333';
                ctx.beginPath(); ctx.moveTo(0, y + this.rowHeight); ctx.lineTo(width, y + this.rowHeight); ctx.stroke();

                if (anim && anim.tracks[b.id]) {
                    anim.tracks[b.id].forEach(kf => {
                        const x = timeToX(kf.t);
                        const cy = y + this.rowHeight / 2;
                        const isSelKey = this.selectedKeyframe && this.selectedKeyframe.boneId === b.id && Math.abs(this.selectedKeyframe.t - kf.t) < 1e-4;
                        ctx.save();
                        ctx.translate(x, cy);
                        ctx.rotate(Math.PI / 4);
                        ctx.fillStyle = isSelKey ? '#ff8000' : '#ffe066';
                        ctx.strokeStyle = '#000';
                        const r = 4.2;
                        ctx.fillRect(-r, -r, r * 2, r * 2);
                        ctx.strokeRect(-r, -r, r * 2, r * 2);
                        ctx.restore();
                    });
                }
            });

            // 播放头
            const px = timeToX(this.currentTime || 0);
            ctx.strokeStyle = '#00e5ff';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, height); ctx.stroke();
            ctx.fillStyle = '#00e5ff';
            ctx.beginPath(); ctx.moveTo(px - 5, 0); ctx.lineTo(px + 5, 0); ctx.lineTo(px, 8); ctx.closePath(); ctx.fill();
        }
        _timeToXLocal(t, duration, trackW) { return this.labelWidth + (t / duration) * trackW; }
        _bindDopeSheetEvents() {
            const self = this;
            const c = this.dopeCanvas;
            let dragMode = null;
            const xToTime = (x) => {
                const anim = self.currentAnim ? self.skeleton.animations[self.currentAnim] : null;
                const duration = anim ? (anim.duration || 1) : 1;
                const trackW = Math.max(10, c.width - self.labelWidth - 8);
                return Math.max(0, Math.min(duration, ((x - self.labelWidth) / trackW) * duration));
            };
            c.addEventListener('mousedown', (e) => {
                const rect = c.getBoundingClientRect();
                const x = e.clientX - rect.left, y = e.clientY - rect.top;
                self._dopeLayout();
                const anim = self.currentAnim ? self.skeleton.animations[self.currentAnim] : null;
                if (y < self.rulerHeight || !anim) {
                    dragMode = 'scrub';
                    self.currentTime = xToTime(x);
                    self._applyTimelinePreview();
                    return;
                }
                const rowIndex = Math.floor((y - self.rulerHeight) / self.rowHeight);
                const bone = self.skeleton.bones[rowIndex];
                if (!bone) { dragMode = 'scrub'; self.currentTime = xToTime(x); self._applyTimelinePreview(); return; }
                const duration = anim.duration || 1;
                const trackW = Math.max(10, c.width - self.labelWidth - 8);
                const track = anim.tracks[bone.id] || [];
                const hit = track.find(k => Math.abs(self._timeToXLocal(k.t, duration, trackW) - x) < 6);
                self.selected = bone; self.selectedSet = new Set([bone]);
                self._refreshBoneList();
                if (hit) {
                    self.selectedKeyframe = { boneId: bone.id, t: hit.t };
                    self.currentTime = hit.t;
                    self._applyTimelinePreview();
                } else {
                    self.selectedKeyframe = null;
                    self.currentTime = xToTime(x);
                    self._applyTimelinePreview();
                    dragMode = 'scrub';
                }
            });
            window.addEventListener('mousemove', (e) => {
                if (!dragMode) return;
                const rect = c.getBoundingClientRect();
                const x = e.clientX - rect.left;
                self.currentTime = xToTime(x);
                self._applyTimelinePreview();
            });
            window.addEventListener('mouseup', () => { dragMode = null; });
            c.addEventListener('dblclick', (e) => {
                const rect = c.getBoundingClientRect();
                const x = e.clientX - rect.left, y = e.clientY - rect.top;
                self._dopeLayout();
                if (y < self.rulerHeight || !self.currentAnim) return;
                const rowIndex = Math.floor((y - self.rulerHeight) / self.rowHeight);
                const bone = self.skeleton.bones[rowIndex];
                if (!bone) return;
                const anim = self.skeleton.animations[self.currentAnim];
                const t = xToTime(x);
                self._snapshot();
                if (!anim.tracks[bone.id]) anim.tracks[bone.id] = [];
                const track = anim.tracks[bone.id];
                const existing = track.find(k => Math.abs(k.t - t) < 1e-3);
                const kf = { t, x: bone.x, y: bone.y, rotation: bone.rotation, scaleX: bone.scaleX, scaleY: bone.scaleY };
                if (existing) Object.assign(existing, kf); else track.push(kf);
                track.sort((a, bb) => a.t - bb.t);
                saveSkeleton(self.target);
                self._drawDopeSheet();
            });
        }

        _syncTimeline() {
            this.animSelect.innerHTML = '';
            const names = Object.keys(this.skeleton.animations);
            names.forEach(name => this.animSelect.appendChild(el('option', { value: name }, [name])));
            if (!names.includes(this.currentAnim)) this.currentAnim = names[0] || null;
            if (this.currentAnim) this.animSelect.value = this.currentAnim;
            const anim = this.skeleton.animations[this.currentAnim];
            if (anim) this.durationInput.value = anim.duration;
            if (!this.currentAnim) this.currentTime = 0;
            else if (this.animTimes[this.currentAnim] == null) this.animTimes[this.currentAnim] = this.currentTime || 0;
            else this.currentTime = this.animTimes[this.currentAnim];
            this.timeLabel.textContent = (this.currentTime || 0).toFixed(2) + 's';
            this._drawDopeSheet();
        }
        _switchAnimation(name) {
            if (this.currentAnim) this.animTimes[this.currentAnim] = this.currentTime;
            this.currentAnim = name || null;
            this.currentTime = (this.currentAnim && this.animTimes[this.currentAnim] != null) ? this.animTimes[this.currentAnim] : 0;
            this.selectedKeyframe = null;
            this._syncTimeline();
            this._applyTimelinePreview();
        }
        async _newAnimation() {
            const name = await Sk2dDialog.prompt(
                '请输入新动画的名称：',
                '动画' + (Object.keys(this.skeleton.animations).length + 1),
                { title: '✨ 新建动画' }
            );
            if (!name) return;
            this._snapshot();
            this.skeleton.animations[name] = { duration: 1, tracks: {} };
            this.animTimes[name] = 0;
            this._switchAnimation(name);
            saveSkeleton(this.target);
        }
        async _deleteAnimation() {
            if (!this.currentAnim) return;
            const ok = await Sk2dDialog.confirm('确定要删除动画 "' + this.currentAnim + '" 吗？此操作不可恢复。', '🗑 删除动画');
            if (!ok) return;
            this._snapshot();
            delete this.skeleton.animations[this.currentAnim];
            delete this.animTimes[this.currentAnim];
            this.currentAnim = null;
            this.selectedKeyframe = null;
            this._syncTimeline();
            saveSkeleton(this.target);
        }
        async _addKeyframe() {
            const anim = this.skeleton.animations[this.currentAnim];
            if (!anim) { await Sk2dDialog.alert('请先新建/选择一个动画', '⚠ 提示'); return; }
            this._snapshot();
            const sel = this.getSelectedBones();
            const targets = sel.length ? sel : this.skeleton.bones;
            targets.forEach(b => {
                if (!anim.tracks[b.id]) anim.tracks[b.id] = [];
                const track = anim.tracks[b.id];
                const existing = track.find(k => Math.abs(k.t - this.currentTime) < 1e-4);
                const kf = { t: this.currentTime, x: b.x, y: b.y, rotation: b.rotation, scaleX: b.scaleX, scaleY: b.scaleY };
                if (existing) Object.assign(existing, kf); else track.push(kf);
                track.sort((a, c) => a.t - c.t);
            });
            saveSkeleton(this.target);
            this._drawDopeSheet();
        }
        _removeKeyframe() {
            const anim = this.skeleton.animations[this.currentAnim];
            if (!anim) return;
            this._snapshot();
            if (this.selectedKeyframe) {
                const track = anim.tracks[this.selectedKeyframe.boneId];
                if (track) {
                    const idx = track.findIndex(k => Math.abs(k.t - this.selectedKeyframe.t) < 1e-4);
                    if (idx >= 0) track.splice(idx, 1);
                }
                this.selectedKeyframe = null;
            } else {
                const sel = this.getSelectedBones();
                const targets = sel.length ? sel : this.skeleton.bones;
                targets.forEach(b => {
                    const track = anim.tracks[b.id];
                    if (!track) return;
                    const idx = track.findIndex(k => Math.abs(k.t - this.currentTime) < 1e-4);
                    if (idx >= 0) track.splice(idx, 1);
                });
            }
            saveSkeleton(this.target);
            this._drawDopeSheet();
        }
        _applyTimelinePreview() {
            this.timeLabel.textContent = (this.currentTime || 0).toFixed(2) + 's';
            const anim = this.skeleton.animations[this.currentAnim];
            if (anim) applyAnimationAtTime(this.skeleton, anim, this.currentTime);
            if (this.currentAnim) this.animTimes[this.currentAnim] = this.currentTime;
            this._refreshProps();
            this._drawDopeSheet();
        }
        _togglePreview() {
            this._previewPlaying = !this._previewPlaying;
            if (this._previewPlaying) { this._previewStart = performance.now() - this.currentTime * 1000; this.playBtn.textContent = '⏸ 停止预览'; }
            else this.playBtn.textContent = '▶ 预览播放';
        }

        setMode(mode) {
            this.mode = mode;
            Object.entries(this.modeBtns).forEach(([id, btn]) => {
                const active = id === mode;
                btn.style.outline = active ? ('2px solid ' + this._modeColor(id)) : 'none';
                btn.style.background = active ? this._modeColor(id) : '#3d3d44';
                btn.style.color = active ? '#111' : '#eee';
            });
            if (this.modeBadge) { this.modeBadge.textContent = this._modeLabel(mode); this.modeBadge.style.background = this._modeColor(mode); }
            this.timelineEl.style.display = mode === 'animation' ? 'flex' : 'none';
            if (mode === 'animation') this._syncTimeline();
            this._refreshProps();
        }

        _refreshBoneList() {
            this.boneListEl.innerHTML = '';
            const self = this;
            const addNode = (bone, depth) => {
                const isActive = self.selected === bone;
                const isMulti = self.selectedSet && self.selectedSet.has(bone);
                const row = el('div', {
                    style: {
                        paddingLeft: (depth * 14 + 4) + 'px', cursor: 'pointer', padding: '3px 4px', borderRadius: '4px',
                        marginBottom: '1px', fontSize: '12px',
                        background: isActive ? '#ffcc00' : (isMulti ? '#a85c00' : 'transparent'),
                        color: isActive ? '#111' : '#ddd'
                    },
                    onclick: (ev) => self._selectClick(bone, ev.shiftKey)
                }, ['🦴 ' + bone.name + (bone.locked ? ' 🔒' : '') + (bone.ikEnabled ? ' 🔗' : '')]);
                self.boneListEl.appendChild(row);
                self.skeleton.bones.filter(b => b.parent === bone).forEach(c => addNode(c, depth + 1));
            };
            this.skeleton.bones.filter(b => !b.parent).forEach(b => addNode(b, 0));
            this._drawDopeSheet();
        }

        _refreshProps() {
            const self = this;
            this.propsEl.innerHTML = '';
            const bone = this.selected;
            const multi = this.getSelectedBones();
            if (multi.length > 1) {
                this.propsEl.appendChild(el('div', { style: { marginBottom: '6px', color: '#8f8' } }, ['已选中 ' + multi.length + ' 根骨骼（可用 G/R/S 批量变换，下方属性针对活动骨骼）']));
            }
            if (this.mode === 'weight') {
                this.propsEl.appendChild(el('div', {}, ['画笔半径']));
                this.propsEl.appendChild(el('input', {
                    type: 'range', min: '5', max: '200', value: String(this.brush.radius),
                    oninput: (e) => self.brush.radius = parseFloat(e.target.value)
                }));
                this.propsEl.appendChild(el('div', {}, ['画笔强度']));
                this.propsEl.appendChild(el('input', {
                    type: 'range', min: '0', max: '1', step: '0.05', value: String(this.brush.strength),
                    oninput: (e) => self.brush.strength = parseFloat(e.target.value)
                }));
                this.propsEl.appendChild(el('div', { style: { marginTop: '6px', fontSize: '12px', color: '#aaa' } },
                    ['当前笔刷绘制骨骼: ' + (bone ? bone.name : '(请在左侧列表选择)') + '  [Shift=擦除]']));
                this.propsEl.appendChild(el('div', { style: { height: '6px' } }));
                this.propsEl.appendChild(this._mkBtn('平滑权重', () => { self._snapshot(); smoothWeights(self.skeleton); saveSkeleton(self.target); }, true));
                this.propsEl.appendChild(el('div', { style: { height: '4px' } }));
                this.propsEl.appendChild(this._mkBtn('清除该骨骼权重', () => {
                    if (!bone || !self.skeleton.mesh) return;
                    self._snapshot();
                    self.skeleton.mesh.vertices.forEach(v => v.weights = v.weights.filter(w => w.boneId !== bone.id));
                    saveSkeleton(self.target);
                }, true));
                return;
            }
            if (!bone) { this.propsEl.appendChild(el('div', {}, ['未选择骨骼'])); return; }
            const editingSetup = this.mode === 'edit';
            const mk = (label, key) => {
                const wrap = el('div', { style: { marginBottom: '4px' } });
                wrap.appendChild(el('div', { style: { fontSize: '12px' } }, [label]));
                wrap.appendChild(el('input', {
                    type: 'number', step: '1', value: String(bone[key]), style: { width: '100%' },
                    onchange: (e) => { bone[key] = parseFloat(e.target.value) || 0; saveSkeleton(self.target); }
                }));
                return wrap;
            };
            this.propsEl.appendChild(el('input', {
                type: 'text', value: bone.name, style: { width: '100%', marginBottom: '6px' },
                onchange: (e) => { bone.name = e.target.value; self._refreshBoneList(); saveSkeleton(self.target); }
            }));
            if (editingSetup) {
                this.propsEl.appendChild(mk('X', 'setupX'));
                this.propsEl.appendChild(mk('Y', 'setupY'));
                this.propsEl.appendChild(mk('角度', 'setupRotation'));
                this.propsEl.appendChild(mk('长度', 'length'));
                this.propsEl.appendChild(mk('X缩放', 'setupScaleX'));
                this.propsEl.appendChild(mk('Y缩放', 'setupScaleY'));
                this.propsEl.appendChild(el('label', {}, [
                    el('input', Object.assign({ type: 'checkbox', onchange: (e) => { bone.locked = e.target.checked; saveSkeleton(self.target); } }, bone.locked ? { checked: 'checked' } : {})),
                    ' 锁定骨骼(防止误操作)'
                ]));
                this.propsEl.appendChild(el('div', { style: { height: '6px' } }));
                this.propsEl.appendChild(this._mkBtn('删除骨骼 (X)', () => { self._snapshot(); self._deleteBone(bone); }, true));
            } else {
                this.propsEl.appendChild(mk('X', 'x'));
                this.propsEl.appendChild(mk('Y', 'y'));
                this.propsEl.appendChild(mk('角度', 'rotation'));
                this.propsEl.appendChild(mk('X缩放', 'scaleX'));
                this.propsEl.appendChild(mk('Y缩放', 'scaleY'));
                this.propsEl.appendChild(this._mkBtn('重置姿态', () => { bone.resetPose(); saveSkeleton(self.target); self._refreshProps(); }, false));
                this.propsEl.appendChild(el('hr', {}));
                this.propsEl.appendChild(el('div', { style: { fontWeight: 'bold', marginBottom: '4px' } }, ['IK 反向动力学']));
                this.propsEl.appendChild(el('label', {}, [
                    el('input', Object.assign({ type: 'checkbox', onchange: (e) => { bone.ikEnabled = e.target.checked; saveSkeleton(self.target); } }, bone.ikEnabled ? { checked: 'checked' } : {})),
                    ' 启用IK'
                ]));
                const targetSelect = el('select', {
                    style: { width: '100%', margin: '4px 0' },
                    onchange: (e) => { bone.ikTarget = e.target.value ? parseInt(e.target.value) : null; saveSkeleton(self.target); }
                }, [el('option', { value: '' }, ['(选择IK目标骨骼)'])].concat(
                    self.skeleton.bones.filter(b => b !== bone).map(b =>
                        el('option', Object.assign({ value: String(b.id) }, (bone.ikTarget === b.id ? { selected: 'selected' } : {})), [b.name])
                    )
                ));
                this.propsEl.appendChild(targetSelect);
                this.propsEl.appendChild(mk('IK链长', 'ikChainLength'));
            }
        }

        _deleteBone(bone) {
            this.skeleton.bones.forEach(b => {
                if (b.parent === bone) b.parent = bone.parent;
                if (b.ikTarget === bone.id) { b.ikTarget = null; b.ikEnabled = false; }
            });
            this.skeleton.bones = this.skeleton.bones.filter(b => b !== bone);
            Object.values(this.skeleton.animations).forEach(anim => { delete anim.tracks[bone.id]; });
            if (this.selected === bone) this.selected = null;
            if (this.selectedSet) this.selectedSet.delete(bone);
            if (this.skeleton.mesh) {
                this.skeleton.mesh.vertices.forEach(v => { v.weights = v.weights.filter(w => w.boneId !== bone.id); });
            }
            this._refreshBoneList(); this._refreshProps();
            saveSkeleton(this.target);
        }

        _isAncestor(bone, maybeAncestor) {
            let p = bone.parent;
            while (p) { if (p === maybeAncestor) return true; p = p.parent; }
            return false;
        }
        async _parentSelectedToActive() {
            const active = this.selected;
            const bones = this.getSelectedBones().filter(b => b !== active);
            if (!active || !bones.length) {
                await Sk2dDialog.alert('请先多选要设置父级的骨骼，并确保最后点击的是目标父骨骼(活动骨骼)', '⚠ 提示');
                return;
            }
            this._snapshot();
            bones.forEach(b => { if (!this._isAncestor(active, b)) b.parent = active; });
            this._refreshBoneList();
            saveSkeleton(this.target);
        }
        _clearParentSelected() {
            const bones = this.getSelectedBones();
            if (!bones.length) return;
            this._snapshot();
            bones.forEach(b => b.parent = null);
            this._refreshBoneList();
            saveSkeleton(this.target);
        }
        _duplicateSelected() {
            const bones = this.getSelectedBones().filter(b => !b.locked);
            if (!bones.length) return;
            this._snapshot();
            const map = new Map();
            const created = bones.map(b => {
                const nb = new Bone(b.name + '_copy', null);
                nb.setupX = b.setupX; nb.setupY = b.setupY; nb.setupRotation = b.setupRotation; nb.length = b.length;
                nb.setupScaleX = b.setupScaleX; nb.setupScaleY = b.setupScaleY; nb.resetPose();
                map.set(b, nb);
                return nb;
            });
            created.forEach((nb, i) => {
                const orig = bones[i];
                nb.parent = map.has(orig.parent) ? map.get(orig.parent) : orig.parent;
            });
            this.skeleton.bones.push(...created);
            this.selectedSet = new Set(created);
            this.selected = created[created.length - 1];
            this._refreshBoneList(); this._refreshProps();
            saveSkeleton(this.target);
        }
        async _mirrorSelected() {
            const bones = this.getSelectedBones();
            if (!bones.length) { await Sk2dDialog.alert('请先选择要镜像的骨骼', '⚠ 提示'); return; }
            this._snapshot();
            const created = mirrorStructural(this.skeleton, bones);
            if (this.skeleton.mesh) autoWeightMesh(this.skeleton);
            this.selectedSet = new Set(created);
            this.selected = created[created.length - 1];
            this._refreshBoneList(); this._refreshProps();
            saveSkeleton(this.target);
        }
        _mirrorCurrentPoseAction() {
            this._snapshot();
            mirrorPose(this.skeleton);
            this._refreshProps();
            saveSkeleton(this.target);
        }

        async _promptGenMesh() {
            if (!this.sourceEntry) { await Sk2dDialog.alert('资源尚未加载完成', '⚠ 提示'); return; }
            const result = await Sk2dDialog.fields(
                '🕸 生成网格',
                '设置蒙皮变形所使用的网格划分列数与行数（数值越大，形变越细腻，但计算量也越大）：',
                [
                    { key: 'cols', label: '列数', defaultValue: 10, type: 'number' },
                    { key: 'rows', label: '行数', defaultValue: 10, type: 'number' }
                ]
            );
            if (!result) return;
            const cols = parseInt(result.cols) || 10;
            const rows = parseInt(result.rows) || 10;
            this._snapshot();
            generateMesh(this.skeleton, this.sourceEntry.width, this.sourceEntry.height, cols, rows);
            saveSkeleton(this.target);
        }

        _findBoneAt(lp, useSetup) {
            const wt = computeWorldTransforms(this.skeleton.bones, useSetup);
            let best = null, bestD = 14 / this.view.scale;
            this.skeleton.bones.forEach(b => {
                const t = wt.get(b);
                const d = pointSegDist(lp, t.head, t.tail);
                if (d < bestD) { bestD = d; best = b; }
            });
            return best;
        }
        _tailHandleAt(lp) {
            const wt = computeWorldTransforms(this.skeleton.bones, true);
            let best = null, bestD = 10 / this.view.scale;
            this.skeleton.bones.forEach(b => {
                const t = wt.get(b);
                const d = Math.hypot(lp.x - t.tail.x, lp.y - t.tail.y);
                if (d < bestD) { bestD = d; best = b; }
            });
            return best;
        }

        /* ---------- 模态变换 (G/R/S/E)，参照 Blender 交互 ---------- */
        _startModal(type) {
            const bones = this.getSelectedBones().filter(b => !b.locked);
            if (!bones.length) return;
            this._snapshot();
            const useSetup = (this.mode === 'edit');
            const wt = computeWorldTransforms(this.skeleton.bones, useSetup);
            const pivot = { x: 0, y: 0 };
            bones.forEach(b => { const h = wt.get(b).head; pivot.x += h.x; pivot.y += h.y; });
            pivot.x /= bones.length; pivot.y /= bones.length;
            const startLp = this._lastLogical || pivot;
            this.modal = {
                type, bones, useSetup, pivot,
                startMouse: startLp,
                startAngle: Math.atan2(startLp.y - pivot.y, startLp.x - pivot.x),
                startDist: Math.max(1e-3, Math.hypot(startLp.x - pivot.x, startLp.y - pivot.y)),
                axis: null, numeric: '',
                initial: bones.map(b => ({
                    bone: b,
                    x: useSetup ? b.setupX : b.x, y: useSetup ? b.setupY : b.y,
                    rotation: useSetup ? b.setupRotation : b.rotation,
                    length: b.length,
                    scaleX: useSetup ? b.setupScaleX : b.scaleX,
                    scaleY: useSetup ? b.setupScaleY : b.scaleY
                }))
            };
            if (type === 'extrude') {
                const created = bones.map(b => {
                    const child = new Bone(b.name + '_ext', b);
                    child.setupX = b.length; child.setupY = 0; child.setupRotation = 0;
                    child.length = Math.max(10, b.length * 0.6);
                    child.resetPose();
                    this.skeleton.bones.push(child);
                    return child;
                });
                this.selectedSet = new Set(created);
                this.selected = created[created.length - 1];
                this.modal.type = 'extrudeAim';
                this.modal.bones = created;
                this._refreshBoneList();
            }
        }
        _worldDeltaToLocal(bone, dx, dy) {
            if (!bone.parent) return { x: dx, y: dy };
            const wt = computeWorldTransforms(this.skeleton.bones, this.mode === 'edit');
            const pAngle = wt.get(bone.parent).angle * D2R;
            const c = Math.cos(-pAngle), s = Math.sin(-pAngle);
            return { x: dx * c - dy * s, y: dx * s + dy * c };
        }
        _updateModal(lp) {
            const m = this.modal;
            if (!m) return;
            this._lastLogical = lp;
            if (m.type === 'extrudeAim') {
                m.bones.forEach(b => {
                    const wt = computeWorldTransforms(this.skeleton.bones, true);
                    const parentT = wt.get(b.parent);
                    const headWorld = M.apply(parentT.matrix, { x: b.setupX, y: b.setupY });
                    let dx = lp.x - headWorld.x, dy = lp.y - headWorld.y;
                    if (m.axis === 'x') dy = 0; if (m.axis === 'y') dx = 0;
                    const ang = Math.atan2(dy, dx) * R2D;
                    b.setupRotation = ang - parentT.angle;
                    let len = Math.hypot(dx, dy);
                    if (m.numeric) len = parseFloat(m.numeric) || len;
                    b.length = Math.max(2, len);
                    b.resetPose();
                });
                this._refreshProps();
                return;
            }
            let dx = lp.x - m.startMouse.x, dy = lp.y - m.startMouse.y;
            if (m.axis === 'x') dy = 0;
            if (m.axis === 'y') dx = 0;
            const numericVal = m.numeric ? parseFloat(m.numeric) : null;

            if (m.type === 'grab') {
                m.initial.forEach(rec => {
                    const b = rec.bone;
                    let ddx = dx, ddy = dy;
                    if (numericVal !== null) {
                        if (m.axis === 'y') { ddx = 0; ddy = numericVal; }
                        else { ddx = numericVal; ddy = m.axis === 'x' ? 0 : dy; }
                    }
                    if (this._ctrlDown) { ddx = Math.round(ddx / 10) * 10; ddy = Math.round(ddy / 10) * 10; }
                    const local = this._worldDeltaToLocal(b, ddx, ddy);
                    if (m.useSetup) { b.setupX = rec.x + local.x; b.setupY = rec.y + local.y; b.resetPose(); }
                    else { b.x = rec.x + local.x; b.y = rec.y + local.y; }
                });
            } else if (m.type === 'rotate') {
                let angle = Math.atan2(lp.y - m.pivot.y, lp.x - m.pivot.x);
                let deltaDeg = (angle - m.startAngle) * R2D;
                if (numericVal !== null) deltaDeg = numericVal;
                if (this._ctrlDown) deltaDeg = Math.round(deltaDeg / 15) * 15;
                m.initial.forEach(rec => {
                    const b = rec.bone;
                    if (m.useSetup) { b.setupRotation = rec.rotation + deltaDeg; b.resetPose(); }
                    else b.rotation = rec.rotation + deltaDeg;
                });
            } else if (m.type === 'scale') {
                let dist = Math.hypot(lp.x - m.pivot.x, lp.y - m.pivot.y);
                let ratio = dist / m.startDist;
                if (numericVal !== null) ratio = numericVal;
                m.initial.forEach(rec => {
                    const b = rec.bone;
                    if (m.useSetup) {
                        if (m.axis !== 'y') b.setupScaleX = rec.scaleX * ratio;
                        if (m.axis !== 'x') b.setupScaleY = rec.scaleY * ratio;
                        if (!m.axis) b.length = rec.length * ratio;
                        b.resetPose();
                    } else {
                        if (m.axis !== 'y') b.scaleX = rec.scaleX * ratio;
                        if (m.axis !== 'x') b.scaleY = rec.scaleY * ratio;
                    }
                });
            }
            this._refreshProps();
        }
        _modalKey(e) {
            const m = this.modal;
            if (!m) return;
            if (e.key === 'Escape') { e.preventDefault(); this._cancelModal(); return; }
            if (e.key === 'Enter') { e.preventDefault(); this._confirmModal(); return; }
            const k = e.key.toLowerCase();
            if (k === 'x' || k === 'y') { m.axis = (m.axis === k) ? null : k; }
            else if (/^[0-9.\-]$/.test(e.key)) { m.numeric += e.key; }
            else if (e.key === 'Backspace') { m.numeric = m.numeric.slice(0, -1); }
            this._updateModal(this._lastLogical || m.startMouse);
            e.preventDefault();
        }
        _confirmModal() {
            const m = this.modal;
            if (!m) return;
            this.modal = null;
            if (this.skeleton.mesh) autoWeightMesh(this.skeleton);
            this._refreshProps();
            saveSkeleton(this.target);
        }
        _cancelModal() {
            const m = this.modal;
            if (!m) return;
            if (m.type === 'extrudeAim') {
                m.bones.slice().forEach(b => this._deleteBone(b));
            } else {
                m.initial.forEach(rec => {
                    const b = rec.bone;
                    if (m.useSetup) {
                        b.setupX = rec.x; b.setupY = rec.y; b.setupRotation = rec.rotation; b.length = rec.length;
                        b.setupScaleX = rec.scaleX; b.setupScaleY = rec.scaleY; b.resetPose();
                    } else {
                        b.x = rec.x; b.y = rec.y; b.rotation = rec.rotation; b.scaleX = rec.scaleX; b.scaleY = rec.scaleY;
                    }
                });
            }
            this.modal = null;
            this._refreshProps();
        }

        _bindCanvasEvents() {
            const self = this;
            const c = this.canvas;
            c.addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = e.deltaY < 0 ? 1.1 : 0.9;
                const rect = c.getBoundingClientRect();
                const mx = e.clientX - rect.left, my = e.clientY - rect.top;
                const before = self.toLogical({ x: mx, y: my });
                self.view.scale *= delta;
                const after = M.apply([self.view.scale, 0, 0, self.view.scale, self.view.ox, self.view.oy], before);
                self.view.ox += mx - after.x; self.view.oy += my - after.y;
            }, { passive: false });

            c.addEventListener('mousedown', (e) => {
                const rect = c.getBoundingClientRect();
                const sp = { x: e.clientX - rect.left, y: e.clientY - rect.top };
                const lp = self.toLogical(sp);
                self._lastClientMouse = sp; self._lastLogical = lp;
                if (self.modal) {
                    if (e.button === 2) self._cancelModal(); else self._confirmModal();
                    e.preventDefault();
                    return;
                }
                if (e.button === 2 || e.button === 1) { self.dragging = { type: 'pan', last: sp }; return; }
                if (self._boxSelectArmed) {
                    const hit = (self.mode === 'edit') ? self._findBoneAt(lp, true) : self._findBoneAt(lp, false);
                    if (!hit) { self.dragging = { type: 'box', startSp: sp, curSp: sp }; return; }
                }
                self._onLeftDown(lp);
            });
            c.addEventListener('contextmenu', (e) => e.preventDefault());
            window.addEventListener('mousemove', (e) => {
                const rect = c.getBoundingClientRect();
                const sp = { x: e.clientX - rect.left, y: e.clientY - rect.top };
                const lp = self.toLogical(sp);
                self._lastClientMouse = sp; self._lastLogical = lp;
                if (self.modal) { self._updateModal(lp); return; }
                if (!self.dragging) return;
                if (self.dragging.type === 'pan') {
                    self.view.ox += sp.x - self.dragging.last.x;
                    self.view.oy += sp.y - self.dragging.last.y;
                    self.dragging.last = sp;
                    return;
                }
                if (self.dragging.type === 'box') { self.dragging.curSp = sp; return; }
                self._onLeftMove(lp);
            });
            window.addEventListener('mouseup', () => { self._onLeftUp(); self.dragging = null; });
        }

        _onLeftDown(lp) {
            if (this.mode === 'edit') {
                const handleBone = this._tailHandleAt(lp);
                if (handleBone) {
                    this._selectClick(handleBone, this._shiftDown);
                    if (!handleBone.locked) this.dragging = { type: 'editTail', bone: handleBone };
                    return;
                }
                const hit = this._findBoneAt(lp, true);
                if (hit) { this._selectClick(hit, this._shiftDown); return; }
                if (this._boxSelectArmed) return; // 已在mousedown中处理框选
                this._snapshot();
                const parent = this.selected;
                const bone = new Bone('bone' + boneUID, parent);
                const wt = parent ? computeWorldTransforms(this.skeleton.bones, true).get(parent) : null;
                const localPos = wt ? M.apply(M.invert(wt.matrix), lp) : lp;
                bone.setupX = localPos.x; bone.setupY = localPos.y; bone.setupRotation = 0; bone.length = 1;
                bone.resetPose();
                this.skeleton.bones.push(bone);
                this.selectedSet = new Set([bone]);
                this.selected = bone;
                this.dragging = { type: 'newBone', bone };
                this._refreshBoneList();
            } else if (this.mode === 'pose' || this.mode === 'animation') {
                const hit = this._findBoneAt(lp, false);
                if (hit) {
                    this._selectClick(hit, this._shiftDown);
                    if (!hit.locked) {
                        const wt = computeWorldTransforms(this.skeleton.bones, false);
                        const parentAngle = hit.parent ? wt.get(hit.parent).angle : 0;
                        this.dragging = { type: 'rotate', bone: hit, parentAngle };
                    }
                }
            } else if (this.mode === 'weight') {
                if (this.selected) {
                    this._snapshot();
                    this.dragging = { type: 'paint', erase: !!this._shiftDown };
                    this._paintAt(lp);
                }
            }
        }

        _onLeftMove(lp) {
            if (!this.dragging) return;
            if (this.dragging.type === 'newBone' || this.dragging.type === 'editTail') {
                const bone = this.dragging.bone;
                const wt = bone.parent ? computeWorldTransforms(this.skeleton.bones, true).get(bone.parent) : null;
                const parentAngle = wt ? wt.angle : 0;
                const headWorld = wt ? M.apply(wt.matrix, { x: bone.setupX, y: bone.setupY }) : { x: bone.setupX, y: bone.setupY };
                const ang = Math.atan2(lp.y - headWorld.y, lp.x - headWorld.x) * R2D;
                bone.setupRotation = ang - parentAngle;
                bone.length = Math.max(2, Math.hypot(lp.x - headWorld.x, lp.y - headWorld.y));
                bone.resetPose();
            } else if (this.dragging.type === 'rotate') {
                const bone = this.dragging.bone;
                const wt = computeWorldTransforms(this.skeleton.bones, false);
                const head = wt.get(bone).head;
                const mouseAngle = Math.atan2(lp.y - head.y, lp.x - head.x) * R2D;
                bone.rotation = mouseAngle - this.dragging.parentAngle;
                this._refreshProps();
            } else if (this.dragging.type === 'paint') {
                this._paintAt(lp);
            }
        }

        _onLeftUp() {
            if (this.dragging && this.dragging.type === 'box') {
                const a = this.toLogical(this.dragging.startSp);
                const b = this.toLogical(this.dragging.curSp || this.dragging.startSp);
                const minX = Math.min(a.x, b.x), maxX = Math.max(a.x, b.x);
                const minY = Math.min(a.y, b.y), maxY = Math.max(a.y, b.y);
                const useSetup = this.mode === 'edit';
                const wt = computeWorldTransforms(this.skeleton.bones, useSetup);
                const picked = this.skeleton.bones.filter(bo => {
                    const h = wt.get(bo).head;
                    return h.x >= minX && h.x <= maxX && h.y >= minY && h.y <= maxY;
                });
                if (!this._shiftDown) this.selectedSet = new Set();
                picked.forEach(p => this.selectedSet.add(p));
                if (picked.length) this.selected = picked[picked.length - 1];
                this._boxSelectArmed = false;
                this._refreshBoneList(); this._refreshProps();
                return;
            }
            if (this.dragging && this.dragging.type === 'newBone' && this.dragging.bone.length < 5) {
                this._deleteBone(this.dragging.bone);
            } else if (this.dragging && (this.dragging.type === 'newBone' || this.dragging.type === 'editTail')) {
                if (this.skeleton.mesh) autoWeightMesh(this.skeleton);
            }
            if (this.dragging) saveSkeleton(this.target);
        }

        _paintAt(lp) {
            if (!this.skeleton.mesh || !this.selected) return;
            const boneId = this.selected.id;
            const r = this.brush.radius, s = this.brush.strength;
            const erase = this.dragging && this.dragging.erase;
            this.skeleton.mesh.vertices.forEach(v => {
                const d = Math.hypot(v.x - lp.x, v.y - lp.y);
                if (d > r) return;
                const influence = (1 - d / r) * s * (erase ? -1 : 1);
                let entry = v.weights.find(w => w.boneId === boneId);
                if (!entry) { entry = { boneId, w: 0 }; v.weights.push(entry); }
                entry.w = Math.max(0, Math.min(1, entry.w + influence));
                const total = v.weights.reduce((a, w) => a + w.w, 0);
                if (total > 0) v.weights.forEach(w => w.w /= total);
            });
        }

        _loop(now) {
            if (this._closed) return;
            if (this._previewPlaying && this.currentAnim) {
                const anim = this.skeleton.animations[this.currentAnim];
                if (anim) {
                    const t = ((now - this._previewStart) / 1000) % (anim.duration || 1);
                    this.currentTime = t;
                    this.timeLabel.textContent = t.toFixed(2) + 's';
                    applyAnimationAtTime(this.skeleton, anim, t);
                    this._drawDopeSheet();
                }
            }
            solveIK(this.skeleton);
            this._render();
            updateTargetDeform(this.target, true); // 编辑器内始终强制预览
            requestAnimationFrame((t) => this._loop(t));
        }

        _niceGridStep() {
            const target = 50 / this.view.scale;
            const pow = Math.pow(10, Math.floor(Math.log10(target)));
            const n = target / pow;
            let step;
            if (n < 2) step = pow; else if (n < 5) step = 2 * pow; else step = 5 * pow;
            return step || 10;
        }
        _drawGrid(ctx) {
            if (!this.canvas.width || !this.canvas.height) return;
            const topLeft = this.toLogical({ x: 0, y: 0 });
            const bottomRight = this.toLogical({ x: this.canvas.width, y: this.canvas.height });
            const step = this._niceGridStep();
            const startX = Math.floor(topLeft.x / step) * step;
            const endX = Math.ceil(bottomRight.x / step) * step;
            const startY = Math.floor(topLeft.y / step) * step;
            const endY = Math.ceil(bottomRight.y / step) * step;
            ctx.save();
            ctx.lineWidth = 1 / this.view.scale;
            ctx.strokeStyle = 'rgba(255,255,255,0.07)';
            ctx.beginPath();
            for (let x = startX; x <= endX; x += step) { ctx.moveTo(x, startY); ctx.lineTo(x, endY); }
            for (let y = startY; y <= endY; y += step) { ctx.moveTo(startX, y); ctx.lineTo(endX, y); }
            ctx.stroke();
            ctx.strokeStyle = 'rgba(255,90,90,0.55)';
            ctx.beginPath(); ctx.moveTo(startX, 0); ctx.lineTo(endX, 0); ctx.stroke();
            ctx.strokeStyle = 'rgba(100,255,140,0.55)';
            ctx.beginPath(); ctx.moveTo(0, startY); ctx.lineTo(0, endY); ctx.stroke();
            ctx.restore();
        }
        _modalHint() {
            const m = this.modal;
            if (!m) return '';
            const typeLabel = { grab: '移动 G', rotate: '旋转 R', scale: '缩放 S', extrudeAim: '挤出 E' }[m.type] || m.type;
            const axisLabel = m.axis ? (' 轴:' + m.axis.toUpperCase()) : '';
            const numLabel = m.numeric ? (' 输入:' + m.numeric) : '';
            return typeLabel + axisLabel + numLabel;
        }
        _drawModalHUD(ctx) {
            const m = this.modal;
            if (!m || !this._lastClientMouse) return;
            ctx.save();
            ctx.font = 'bold 13px monospace';
            ctx.fillStyle = '#ffe066';
            ctx.strokeStyle = 'rgba(0,0,0,0.8)';
            ctx.lineWidth = 3;
            const label = this._modalHint();
            const x = this._lastClientMouse.x + 14, y = this._lastClientMouse.y - 14;
            ctx.strokeText(label, x, y);
            ctx.fillText(label, x, y);
            ctx.restore();
        }

        _render() {
            const ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.fillStyle = '#3a3a40';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.save();
            ctx.translate(this.view.ox, this.view.oy);
            ctx.scale(this.view.scale, this.view.scale);
            this._drawGrid(ctx);
            if (this.sourceEntry) {
                const { canvas: deformedCanvas, offsetX, offsetY } = renderDeformedCanvas(this.skeleton, this.sourceEntry.canvas, this.sourceEntry.scale);
                const scale = this.sourceEntry.scale;
                ctx.drawImage(deformedCanvas, offsetX / scale, offsetY / scale, deformedCanvas.width / scale, deformedCanvas.height / scale);
            }
            if (this.mode === 'weight' && this.skeleton.mesh && this.selected) this._drawWeightOverlay(ctx);
            if (this.mode === 'animation') this._drawOnionSkin(ctx);
            if (this.mode === 'edit' || this.mode === 'pose' || this.mode === 'animation') this._drawBones(ctx, this.mode === 'edit');
            ctx.restore();
            if (this.dragging && this.dragging.type === 'box' && this.dragging.curSp) {
                ctx.save();
                ctx.strokeStyle = '#ff8000';
                ctx.fillStyle = 'rgba(255,128,0,0.08)';
                ctx.setLineDash([4, 2]);
                const { startSp, curSp } = this.dragging;
                const rx = Math.min(startSp.x, curSp.x), ry = Math.min(startSp.y, curSp.y);
                const rw = Math.abs(curSp.x - startSp.x), rh = Math.abs(curSp.y - startSp.y);
                ctx.fillRect(rx, ry, rw, rh);
                ctx.strokeRect(rx, ry, rw, rh);
                ctx.restore();
            }
            if (this.modal) this._drawModalHUD(ctx);
            if (this.statusBar) {
                const b = this.selected;
                let status = '模式:' + this._modeLabel(this.mode) + '  选中:' + (b ? b.name : '-') +
                    '  缩放:' + Math.round(this.view.scale * 100) + '%  骨骼数:' + this.skeleton.bones.length;
                if (this.modal) status += '   ' + this._modalHint();
                this.statusBar.textContent = status;
            }
        }
        _drawWeightOverlay(ctx) {
            const boneId = this.selected.id;
            const deformed = deformVertices(this.skeleton);
            this.skeleton.mesh.vertices.forEach((v, idx) => {
                const w = (v.weights.find(x => x.boneId === boneId) || { w: 0 }).w;
                const p = deformed[idx];
                ctx.fillStyle = `rgba(255,${Math.round(255 * (1 - w))},0,0.85)`;
                ctx.beginPath(); ctx.arc(p.x, p.y, 3 / this.view.scale, 0, Math.PI * 2); ctx.fill();
            });
        }
        _drawOnionSkin(ctx) {
            const anim = this.skeleton.animations[this.currentAnim];
            if (!anim) return;
            const times = new Set();
            Object.values(anim.tracks).forEach(track => track.forEach(k => times.add(k.t)));
            const sorted = Array.from(times).sort((a, b) => a - b);
            if (!sorted.length) return;
            let prev = null, next = null;
            for (const t of sorted) { if (t < this.currentTime) prev = t; if (t > this.currentTime && next === null) next = t; }
            const backup = this.skeleton.bones.map(b => ({ b, x: b.x, y: b.y, rotation: b.rotation, scaleX: b.scaleX, scaleY: b.scaleY }));
            const drawAt = (t, color) => {
                applyAnimationAtTime(this.skeleton, anim, t);
                const wt = computeWorldTransforms(this.skeleton.bones, false);
                ctx.save();
                ctx.globalAlpha = 0.35;
                this.skeleton.bones.forEach(bo => {
                    const tt = wt.get(bo);
                    ctx.strokeStyle = color; ctx.lineWidth = 2 / this.view.scale;
                    ctx.beginPath(); ctx.moveTo(tt.head.x, tt.head.y); ctx.lineTo(tt.tail.x, tt.tail.y); ctx.stroke();
                });
                ctx.restore();
            };
            if (prev !== null) drawAt(prev, '#3399ff');
            if (next !== null) drawAt(next, '#ff66cc');
            backup.forEach(rec => { rec.b.x = rec.x; rec.b.y = rec.y; rec.b.rotation = rec.rotation; rec.b.scaleX = rec.scaleX; rec.b.scaleY = rec.scaleY; });
        }
        _drawBones(ctx, useSetup) {
            const wt = computeWorldTransforms(this.skeleton.bones, useSetup);
            this.skeleton.bones.forEach(b => {
                const t = wt.get(b);
                const isActive = this.selected === b;
                const isMulti = this.selectedSet && this.selectedSet.has(b);
                let color = '#5fb0ff'; // 默认（未选中）浅蓝色
                if (isMulti) color = '#ff8000'; // 已选中（非活动）橙色
                if (isActive) color = '#ffe066'; // 活动骨骼 亮黄色
                if (b.locked) color = '#777';
                ctx.save();
                // 父子连接虚线（更像Blender骨架层级示意）
                if (b.parent) {
                    const pt = wt.get(b.parent);
                    ctx.setLineDash([2 / this.view.scale, 2 / this.view.scale]);
                    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
                    ctx.lineWidth = 1 / this.view.scale;
                    ctx.beginPath(); ctx.moveTo(pt.tail.x, pt.tail.y); ctx.lineTo(t.head.x, t.head.y); ctx.stroke();
                    ctx.setLineDash([]);
                }
                ctx.strokeStyle = color;
                ctx.lineWidth = (isActive ? 3 : 2) / this.view.scale;
                ctx.beginPath(); ctx.moveTo(t.head.x, t.head.y); ctx.lineTo(t.tail.x, t.tail.y); ctx.stroke();
                ctx.fillStyle = color;
                ctx.beginPath(); ctx.arc(t.head.x, t.head.y, 5 / this.view.scale, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(t.tail.x, t.tail.y, 3 / this.view.scale, 0, Math.PI * 2); ctx.fill();
                if (b.ikEnabled) {
                    ctx.strokeStyle = '#00e5ff';
                    ctx.lineWidth = 1.5 / this.view.scale;
                    ctx.beginPath(); ctx.arc(t.head.x, t.head.y, 8 / this.view.scale, 0, Math.PI * 2); ctx.stroke();
                }
                ctx.restore();
            });
        }

        close() {
            this._closed = true;
            window.removeEventListener('resize', this._resizeHandler);
            window.removeEventListener('keydown', this._keyDown);
            window.removeEventListener('keyup', this._keyUp);
            this.overlay.remove();
            this.skeleton.bones.forEach(b => b.resetPose());
            saveSkeleton(this.target);
            updateTargetDeform(this.target, true);
        }
    }

    /* =========================================================
     *  扩展定义（积木）
     * ========================================================= */
    const openEditors = new Map();

    class Skeleton2DExtension {
        getInfo() {
            return {
                id: 'skeleton2d',
                name: '充值神2D骨骼动画',
                color1: '#ff6680',
                color2: '#ff4d6d',
                blocks: [
                    { opcode: 'openEditor', blockType: Scratch.BlockType.COMMAND, text: '打开骨骼编辑器' },
                    { opcode: 'closeEditor', blockType: Scratch.BlockType.COMMAND, text: '关闭骨骼编辑器' },
                    '---',
                    { opcode: 'bindSkeleton', blockType: Scratch.BlockType.COMMAND, text: '绑定骨骼到当前角色' },
                    { opcode: 'unbindSkeleton', blockType: Scratch.BlockType.COMMAND, text: '解除骨骼绑定' },
                    { opcode: 'isBound', blockType: Scratch.BlockType.BOOLEAN, text: '骨骼已绑定？' },
                    '---',
                    {
                        opcode: 'playAnimation', blockType: Scratch.BlockType.COMMAND, text: '播放动画 [NAME]',
                        arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '走路' } }
                    },
                    {
                        opcode: 'stopAnimation', blockType: Scratch.BlockType.COMMAND, text: '停止动画 [NAME]',
                        arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '走路' } }
                    },
                    {
                        opcode: 'isPlaying', blockType: Scratch.BlockType.BOOLEAN, text: '正在播放动画 [NAME]？',
                        arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '走路' } }
                    },
                    { opcode: 'getAnimationNames', blockType: Scratch.BlockType.REPORTER, text: '所有动画名称(JSON数组)' },
                    '---',
                    {
                        opcode: 'setBoneTransform', blockType: Scratch.BlockType.COMMAND,
                        text: '设置骨骼 [BONE] 位置 x:[X] y:[Y] 角度:[ANGLE]',
                        arguments: {
                            BONE: { type: Scratch.ArgumentType.STRING, defaultValue: 'bone1' },
                            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            ANGLE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
                        }
                    },
                    {
                        opcode: 'getBoneX', blockType: Scratch.BlockType.REPORTER, text: '骨骼 [BONE] 的X',
                        arguments: { BONE: { type: Scratch.ArgumentType.STRING, defaultValue: 'bone1' } }
                    },
                    {
                        opcode: 'getBoneY', blockType: Scratch.BlockType.REPORTER, text: '骨骼 [BONE] 的Y',
                        arguments: { BONE: { type: Scratch.ArgumentType.STRING, defaultValue: 'bone1' } }
                    },
                    {
                        opcode: 'getBoneAngle', blockType: Scratch.BlockType.REPORTER, text: '骨骼 [BONE] 的角度',
                        arguments: { BONE: { type: Scratch.ArgumentType.STRING, defaultValue: 'bone1' } }
                    },
                    '---',
                    {
                        opcode: 'setIK', blockType: Scratch.BlockType.COMMAND,
                        text: '设置骨骼 [BONE] 的IK目标为 [TARGET] 链长 [LEN] 状态 [ON]',
                        arguments: {
                            BONE: { type: Scratch.ArgumentType.STRING, defaultValue: 'bone2' },
                            TARGET: { type: Scratch.ArgumentType.STRING, defaultValue: 'target1' },
                            LEN: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 },
                            ON: { type: Scratch.ArgumentType.STRING, defaultValue: '开' }
                        }
                    },
                    { opcode: 'mirrorPoseBlock', blockType: Scratch.BlockType.COMMAND, text: '镜像当前姿态' }
                ]
            };
        }
        openEditor(args, util) {
            const target = util.target;
            if (openEditors.has(target.id)) return;
            const editor = new SkeletonEditor(target);
            const originalClose = editor.close.bind(editor);
            editor.close = () => { originalClose(); openEditors.delete(target.id); };
            openEditors.set(target.id, editor);
        }
        closeEditor(args, util) {
            const editor = openEditors.get(util.target.id);
            if (editor) editor.close();
        }
        bindSkeleton(args, util) {
            const sk = loadSkeleton(util.target);
            sk.bound = true;
            saveSkeleton(util.target);
            updateTargetDeform(util.target, true);
        }
        unbindSkeleton(args, util) {
            const sk = loadSkeleton(util.target);
            sk.bound = false;
            sk.bones.forEach(b => b.resetPose());
            saveSkeleton(util.target);
            updateTargetDeform(util.target, true);
        }
        isBound(args, util) {
            const sk = loadSkeleton(util.target);
            return !!sk.bound;
        }
        playAnimation(args, util) { playAnimationOn(util.target, String(args.NAME)); }
        stopAnimation(args, util) {
            stopAnimationOn(util.target, String(args.NAME));
            const skeleton = loadSkeleton(util.target);
            skeleton.bones.forEach(b => b.resetPose());
            updateTargetDeform(util.target, true);
        }
        isPlaying(args, util) {
            const p = activePlayers.get(util.target.id);
            return !!(p && p.name === String(args.NAME));
        }
        getAnimationNames(args, util) {
            const sk = loadSkeleton(util.target);
            try { return JSON.stringify(Object.keys(sk.animations)); } catch (e) { return '[]'; }
        }
        setBoneTransform(args, util) {
            const sk = loadSkeleton(util.target);
            const b = sk.bones.find(bo => bo.name === String(args.BONE));
            if (!b) return;
            b.x = Number(args.X) || 0; b.y = Number(args.Y) || 0; b.rotation = Number(args.ANGLE) || 0;
            updateTargetDeform(util.target);
        }
        getBoneX(args, util) {
            const sk = loadSkeleton(util.target);
            const b = sk.bones.find(bo => bo.name === String(args.BONE));
            return b ? b.x : 0;
        }
        getBoneY(args, util) {
            const sk = loadSkeleton(util.target);
            const b = sk.bones.find(bo => bo.name === String(args.BONE));
            return b ? b.y : 0;
        }
        getBoneAngle(args, util) {
            const sk = loadSkeleton(util.target);
            const b = sk.bones.find(bo => bo.name === String(args.BONE));
            return b ? b.rotation : 0;
        }
        setIK(args, util) {
            const sk = loadSkeleton(util.target);
            const b = sk.bones.find(bo => bo.name === String(args.BONE));
            if (!b) return;
            const t = sk.bones.find(bo => bo.name === String(args.TARGET));
            b.ikEnabled = (String(args.ON) === '开');
            b.ikTarget = t ? t.id : null;
            b.ikChainLength = Math.max(1, Number(args.LEN) || 2);
            saveSkeleton(util.target);
        }
        mirrorPoseBlock(args, util) {
            const sk = loadSkeleton(util.target);
            mirrorPose(sk);
            updateTargetDeform(util.target);
        }
    }

    Scratch.extensions.register(new Skeleton2DExtension());
})(Scratch);