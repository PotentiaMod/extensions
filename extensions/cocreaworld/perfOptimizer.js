(function (_Scratch) {
    const {ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime} = _Scratch;

    translate.setup({
        zh: {
            'extensionName': '特效性能优化器',
            'enable': '启用特效优化（合并帧内特效变化）',
            'disable': '禁用优化',
            'status': '优化状态'
        },
        en: {
            'extensionName': 'Effect Performance Optimizer',
            'enable': 'Enable Effect Optimization (merge effect changes per frame)',
            'disable': 'Disable Optimization',
            'status': 'Optimization Status'
        }
    });

    class EffectOptimizer {
        constructor (_runtime) {
            this._runtime = _runtime;
            this._enabled = false;
            this._originalMethods = {};          // 保存每个目标的原始特效方法
            this._pending = new Map();           // 目标id -> 待应用的特效数据
            this._frameHandler = null;           // runtime 帧事件句柄
            this._targetAddedHandler = null;
            this._targetRemovedHandler = null;
        }

        _getTargets() {
            return this._runtime.targets || [];
        }

        // 获取或创建目标的待更新特效数据
        _getPending(target) {
            const id = target.id || target.name || 'unknown';
            if (!this._pending.has(id)) {
                this._pending.set(id, {
                    effects: {},    // effectType -> { set: value或null, delta: 累积增量 }
                    target: target
                });
            }
            return this._pending.get(id);
        }

        // ---------- 优化后的替代方法（只记录，不执行） ----------

        // 特效设置：记录设置值，清空增量（因为设置会覆盖之前所有变化）
        _optimizedSetEffect(effectType, value) {
            const pending = this._getPending(this);
            const eff = pending.effects[effectType] || { set: null, delta: 0 };
            eff.set = value;
            eff.delta = 0;
            pending.effects[effectType] = eff;
        }

        // 特效增加：累积增量
        _optimizedChangeEffect(effectType, value) {
            const pending = this._getPending(this);
            const eff = pending.effects[effectType] || { set: null, delta: 0 };
            eff.delta += value;
            pending.effects[effectType] = eff;
        }

        // ---------- 帧更新：在每一帧开始时应用所有待更新特效 ----------
        _applyPendingUpdates() {
            for (const [id, pending] of this._pending) {
                const target = pending.target;
                if (!target) continue;
                const orig = this._originalMethods[id];
                if (!orig) continue;

                // 应用该目标的所有待更新特效
                for (const [type, eff] of Object.entries(pending.effects)) {
                    // 如果有设置值，先应用设置
                    if (eff.set !== null) {
                        if (orig.setEffect) {
                            orig.setEffect(type, eff.set);
                        }
                        eff.set = null;
                    }
                    // 再应用增量
                    if (eff.delta !== 0) {
                        if (orig.changeEffect) {
                            orig.changeEffect(type, eff.delta);
                        }
                        eff.delta = 0;
                    }
                }
                // 清空已经应用的特效条目（可选）
                // 但我们保留空对象以便下次复用
            }
        }

        // ---------- 钩子注入与恢复 ----------
        _hookTarget(target) {
            if (!target) return;
            const id = target.id || target.name || 'unknown';
            if (this._originalMethods[id]) return; // 已钩子

            const orig = {};
            const methods = [
                { name: 'setEffect', impl: this._optimizedSetEffect },
                { name: 'changeEffect', impl: this._optimizedChangeEffect }
            ];
            for (const m of methods) {
                if (typeof target[m.name] === 'function') {
                    orig[m.name] = target[m.name].bind(target);
                    target[m.name] = m.impl.bind(target);
                }
            }
            this._originalMethods[id] = orig;
        }

        _unhookTarget(target) {
            if (!target) return;
            const id = target.id || target.name || 'unknown';
            const orig = this._originalMethods[id];
            if (!orig) return;
            const methods = ['setEffect', 'changeEffect'];
            for (const name of methods) {
                if (orig[name]) {
                    target[name] = orig[name];
                }
            }
            delete this._originalMethods[id];
            this._pending.delete(id);
        }

        _hookAllTargets() {
            for (const t of this._getTargets()) {
                this._hookTarget(t);
            }
        }

        _unhookAllTargets() {
            for (const t of this._getTargets()) {
                this._unhookTarget(t);
            }
        }

        // 事件监听：新增/删除目标
        _onTargetAdded(target) {
            if (this._enabled) {
                this._hookTarget(target);
            }
        }

        _onTargetRemoved(target) {
            const id = target.id || target.name || 'unknown';
            this._pending.delete(id);
            delete this._originalMethods[id];
        }

        // ---------- 帧事件绑定 ----------
        _startFrameListener() {
            if (this._frameHandler) return;
            this._frameHandler = () => {
                if (!this._enabled) return;
                this._applyPendingUpdates();
            };
            this._runtime.on('frame', this._frameHandler);
        }

        _stopFrameListener() {
            if (this._frameHandler) {
                this._runtime.off('frame', this._frameHandler);
                this._frameHandler = null;
            }
        }

        // ---------- 对外接口 ----------
        enableOptimization() {
            if (this._enabled) return;
            this._enabled = true;

            // 钩子所有现有目标
            this._hookAllTargets();

            // 监听新增目标
            this._targetAddedHandler = this._onTargetAdded.bind(this);
            this._targetRemovedHandler = this._onTargetRemoved.bind(this);
            this._runtime.on('targetWasAdded', this._targetAddedHandler);
            this._runtime.on('targetWasRemoved', this._targetRemovedHandler);

            // 启动帧监听（在每帧开始时应用待更新）
            this._startFrameListener();

            console.log('[EffectOptimizer] 特效优化已启用（合并帧内特效变化）');
        }

        disableOptimization() {
            if (!this._enabled) return;
            this._enabled = false;

            // 停止帧监听
            this._stopFrameListener();

            // 应用所有挂起的更新，确保最终状态正确
            this._applyPendingUpdates();

            // 恢复所有目标
            this._unhookAllTargets();

            // 移除监听
            if (this._targetAddedHandler) {
                this._runtime.off('targetWasAdded', this._targetAddedHandler);
                this._targetAddedHandler = null;
            }
            if (this._targetRemovedHandler) {
                this._runtime.off('targetWasRemoved', this._targetRemovedHandler);
                this._targetRemovedHandler = null;
            }

            this._pending.clear();

            console.log('[EffectOptimizer] 优化已禁用');
        }

        getOptimizationStatus() {
            return this._enabled;
        }

        // ---------- 积木定义 ----------
        getInfo() {
            return {
                id: 'perfOptimizer',
                color1: '#FF9800',
                color2: '#F57C00',
                name: translate({id: 'extensionName'}),
                blocks: [
                    {
                        opcode: 'enableOptimizationBlock',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'enable'})
                    },
                    {
                        opcode: 'disableOptimizationBlock',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'disable'})
                    },
                    {
                        opcode: 'getOptimizationStatus',
                        blockType: BlockType.BOOLEAN,
                        text: translate({id: 'status'})
                    }
                ]
            };
        }

        enableOptimizationBlock() {
            this.enableOptimization();
        }

        disableOptimizationBlock() {
            this.disableOptimization();
        }
    }

    extensions.register(new EffectOptimizer(runtime));
})(Scratch);