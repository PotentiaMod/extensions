(function(Scratch) {
    'use strict';

    class ShakeEffect {
        constructor() {
            this.shakeData = new Map(); // 存储抖动数据
        }

        getInfo() {
            return {
                id: 'shakeeffect',
                name: '角色抖动效果',
                blocks: [
                    {
                        opcode: 'startShake',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '开始抖动 范围 [RANGE] 速度 [SPEED]',
                        arguments: {
                            RANGE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5
                            },
                            SPEED: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            }
                        }
                    },
                    {
                        opcode: 'stopShake',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '停止抖动'
                    },
                    {
                        opcode: 'stopAllShakes',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '停止所有角色抖动'
                    },
                    {
                        opcode: 'isShaking',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '正在抖动？'
                    },
                    {
                        opcode: 'setShakeRange',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置抖动范围 [RANGE]',
                        arguments: {
                            RANGE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5
                            }
                        }
                    },
                    {
                        opcode: 'setShakeSpeed',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置抖动速度 [SPEED]',
                        arguments: {
                            SPEED: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            }
                        }
                    }
                ]
            };
        }

        // 开始抖动
        startShake(args, util) {
            const target = util.target;
            if (!target || target.isStage) return;
            
            const range = Math.max(0, Math.min(500, Number(args.RANGE) || 5));
            const speed = Math.max(1, Math.min(30, Number(args.SPEED) || 10));
            
            // 如果已经有抖动数据，先清除
            if (this.shakeData.has(target)) {
                this.stopShake(args, util);
            }
            
            // 保存抖动数据
            this.shakeData.set(target, {
                originalX: target.x,
                originalY: target.y,
                range: range,
                speed: speed,
                timer: null
            });
            
            // 启动抖动循环
            this.startShakeLoop(target);
        }

        // 抖动循环
        startShakeLoop(target) {
            const data = this.shakeData.get(target);
            if (!data) return;
            
            const shake = () => {
                // 检查数据是否还存在
                const currentData = this.shakeData.get(target);
                if (!currentData) return;
                
                try {
                    // 检查目标是否还有效
                    if (!target.isOriginal && !target.isClone) {
                        this.shakeData.delete(target);
                        return;
                    }
                    
                    // 计算随机偏移
                    const offsetX = (Math.random() * 2 - 1) * currentData.range;
                    const offsetY = (Math.random() * 2 - 1) * currentData.range;
                    
                    // 更新位置
                    target.setXY(currentData.originalX + offsetX, currentData.originalY + offsetY);
                    
                    // 设置下一次抖动
                    const delay = Math.floor(1000 / currentData.speed);
                    currentData.timer = setTimeout(shake, delay);
                } catch (e) {
                    // 如果出错（如克隆体被删除），清理数据
                    this.shakeData.delete(target);
                }
            };
            
            // 立即开始第一次抖动
            shake();
        }

        // 停止抖动
        stopShake(args, util) {
            const target = util.target;
            if (!target || target.isStage) return;
            
            const data = this.shakeData.get(target);
            if (data) {
                // 清除定时器
                if (data.timer) {
                    clearTimeout(data.timer);
                }
                
                // 恢复原始位置
                try {
                    target.setXY(data.originalX, data.originalY);
                } catch (e) {
                    // 忽略错误
                }
                
                // 删除数据
                this.shakeData.delete(target);
            }
        }

        // 停止所有抖动
        stopAllShakes() {
            // 遍历所有抖动数据并停止
            for (const [target, data] of this.shakeData) {
                if (data.timer) {
                    clearTimeout(data.timer);
                }
                try {
                    target.setXY(data.originalX, data.originalY);
                } catch (e) {
                    // 忽略错误
                }
            }
            
            // 清空所有数据
            this.shakeData.clear();
        }

        // 检查是否正在抖动
        isShaking(args, util) {
            const target = util.target;
            if (!target || target.isStage) return false;
            
            return this.shakeData.has(target);
        }

        // 设置抖动范围
        setShakeRange(args, util) {
            const target = util.target;
            if (!target || target.isStage) return;
            
            const range = Math.max(0, Math.min(500, Number(args.RANGE) || 5));
            const data = this.shakeData.get(target);
            
            if (data) {
                data.range = range;
            }
        }

        // 设置抖动速度
        setShakeSpeed(args, util) {
            const target = util.target;
            if (!target || target.isStage) return;
            
            const speed = Math.max(1, Math.min(30, Number(args.SPEED) || 10));
            const data = this.shakeData.get(target);
            
            if (data) {
                data.speed = speed;
            }
        }
    }

    Scratch.extensions.register(new ShakeEffect());
})(Scratch);