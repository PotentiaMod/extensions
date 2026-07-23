// Name: Easy Block+
// ID: easyblock
// Description: Make creation simpler and more convenient.
// By: DL_Grass <https://github.com/DLGrass>
// License: MIT

(function (Scratch) {
    'use strict';

    // 检查是否在非沙箱环境运行
    if (!Scratch.extensions.unsandboxed) {
        throw new Error('This extension must run unsandboxed');
    }

    class EasyBlock {
        constructor(runtime) {
            this.runtime = runtime;
        }

        getInfo() {
            return {
                id: 'easyblock',
                name: Scratch.translate({ default: 'EasyBlock+', id: 'extensionName' }),
                color1: '#36cefc',
                color2: '#3b8deb',
                color3: '#377faf',
                description: Scratch.translate({ default: 'Make creation simpler and more convenient.', id: 'extensionDescription' }),

                blocks: [
                    // ========== 布尔值操作 ==========
                    { blockType: Scratch.BlockType.LABEL, text: Scratch.translate({ default: 'Boolean Operation', id: 'groupName1' }) },

                    // 判断布尔值
                    {
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate({ default: '[Bool]', id: 'block_boolCheck' }),
                        opcode: 'boolCheck',
                        arguments: {
                            Bool: {
                                type: Scratch.ArgumentType.STRING,
                            }
                        }
                    },

                    // 返回指定布尔值
                    {
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate({ default: 'Return[TypeBool]', id: 'block_boolType' }),
                        opcode: 'boolType',
                        arguments: {
                            TypeBool: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ConstBool',
                            }
                        }
                    },

                    // 随机布尔值（概率）
                    {
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate({ default: 'Probability[num]', id: 'block_returnRandomBool' }),
                        opcode: 'returnRandomBool',
                        arguments: {
                            num: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5,
                            }
                        }
                    },

                    // 条件选择
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: 'If [Bool],then [valueA], else [valueB]', id: 'block_valueIfElse' }),
                        opcode: 'valueIfElse',
                        arguments: {
                            Bool: { type: Scratch.ArgumentType.BOOLEAN },
                            valueA: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'apple',
                            },
                            valueB: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'banana',
                            }
                        }
                    },

                    // 布尔值变化触发
                    {
                        blockType: Scratch.BlockType.HAT,
                        text: Scratch.translate({ default: 'When [Bool] come to [TypeBool]', id: 'block_whenBoolCome' }),
                        opcode: 'whenBoolCome',
                        isEdgeActivated: true,
                        arguments: {
                            Bool: { type: Scratch.ArgumentType.BOOLEAN },
                            TypeBool: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ConstBool',
                            }
                        }
                    },

                    // ========== 数值操作 & 数学运算 ==========
                    { blockType: Scratch.BlockType.LABEL, text: Scratch.translate({ default: 'Number Operation & Math Operation', id: 'groupName2' }) },

                    // 上限限制
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: '[Num], highest is [high]', id: 'block_numHighest' }),
                        opcode: 'numHighest',
                        arguments: {
                            Num: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 90,
                            },
                            high: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 60,
                            }
                        }
                    },

                    // 下限限制
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: '[Num], lowest is [low]', id: 'block_numLowest' }),
                        opcode: 'numLowest',
                        arguments: {
                            Num: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 60,
                            },
                            low: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 90,
                            }
                        }
                    },

                    // 保留小数位
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: '[Num], keep [decimal] decimal places', id: 'block_numDecimal' }),
                        opcode: 'numDecimal',
                        arguments: {
                            Num: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 11.45,
                            },
                            decimal: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2,
                            }
                        }
                    },

                    // 取最大/最小值
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: 'The [Type] value of [Num1] and [Num2]', id: 'block_numBigSmall' }),
                        opcode: 'numBigSmall',
                        arguments: {
                            Num1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100,
                            },
                            Num2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 200,
                            },
                            Type: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ConstTypeBigSmall',
                            }
                        }
                    },

                    // 大于等于比较
                    {
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate({ default: '[Num1]>=[Num2]', id: 'block_numBigEqual' }),
                        opcode: 'numBigEqual',
                        arguments: {
                            Num1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100,
                            },
                            Num2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 200,
                            }
                        }
                    },

                    // 小于等于比较
                    {
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate({ default: '[Num1]<=[Num2]', id: 'block_numSmallEqual' }),
                        opcode: 'numSmallEqual',
                        arguments: {
                            Num1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100,
                            },
                            Num2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 200,
                            }
                        }
                    },

                    // 近似相等
                    {
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate({ default: '[Num1]=[Num2], error is [Num3]', id: 'block_numNearEqual' }),
                        opcode: 'numNearEqual',
                        arguments: {
                            Num1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 30,
                            },
                            Num2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50,
                            },
                            Num3: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 25,
                            }
                        }
                    },

                    // 幂运算
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: '[Num1] to the power of [Num2]', id: 'block_numPower' }),
                        opcode: 'numPower',
                        arguments: {
                            Num1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2,
                            },
                            Num2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 3,
                            }
                        }
                    },

                    // 开方运算
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: '[Num] of [Sqrt]th root', id: 'block_numSqrt' }),
                        opcode: 'numSqrt',
                        arguments: {
                            Num: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 9,
                            },
                            Sqrt: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2,
                            }
                        }
                    },

                    // 阶乘
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: 'factorial of [Num]', id: 'block_numFactorial' }),
                        opcode: 'numFactorial',
                        arguments: {
                            Num: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5,
                            }
                        }
                    },
                    // 随机加减
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: '[Num1], random add or minus [Num2]', id: 'block_numRandomAddMinus' }),
                        opcode: 'numRandomAddMinus',
                        arguments: {
                            Num1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100,
                            },
                            Num2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 20,
                            }
                        }
                    },

                    // ========== 字符串操作 ==========
                    { blockType: Scratch.BlockType.LABEL, text: Scratch.translate({ default: 'String Operation', id: 'groupName3' }) },

                    // 默认值处理
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: '[Str], default value is [defaultValue]', id: 'block_stringDefault' }),
                        opcode: 'stringDefault',
                        arguments: {
                            Str: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            defaultValue: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'apple',
                            }
                        }
                    },

                    // 字符串相等比较
                    {
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate({ default: '[Str1]===[Str2]', id: 'block_stringEqual' }),
                        opcode: 'stringEqual',
                        arguments: {
                            Str1: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'apple',
                            },
                            Str2: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'APPLE',
                            }
                        }
                    },

                    // 字符串大小写转换
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: 'Convert[Str] to [Type]', id: 'block_stringTurn' }),
                        opcode: 'stringTurn',
                        arguments: {
                            Str: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'apple',
                            },
                            Type: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ConstStrType',
                            }
                        }
                    },

                    // Unicode转字符
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: '[Unicode] corresponds to Str', id: 'block_unicodeToString' }),
                        opcode: 'unicodeToString',
                        arguments: {
                            Unicode: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 97,
                            },
                        }
                    },

                    // 字符转Unicode
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: '[Str] corresponds to Unicode', id: 'block_stringToUnicode' }),
                        opcode: 'stringToUnicode',
                        arguments: {
                            Str: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'a',
                            },
                        }
                    },

                    // 字符串截取
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: '[Str] of [num1] to [num2]', id: 'block_returnStringRange' }),
                        opcode: 'returnStringRange',
                        arguments: {
                            Str: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'apple',
                            },
                            num1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                            num2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 4,
                            }
                        }
                    },

                    // ========== 其他操作 ==========
                    { blockType: Scratch.BlockType.LABEL, text: Scratch.translate({ default: 'Other Operation', id: 'groupName4' }) },

                    // 返回数学常数
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: 'Return[Value]', id: 'block_constNum' }),
                        opcode: 'constNum',
                        arguments: {
                            Value: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ConstNum',
                            }
                        }
                    },

                    // 返回特殊字符串
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: 'Return[Value]', id: 'block_constString' }),
                        opcode: 'constString',
                        arguments: {
                            Value: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ConstString',
                            }
                        }
                    },

                    // 返回特殊类型值
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: 'Return[Value]', id: 'block_constType' }),
                        opcode: 'constType',
                        arguments: {
                            Value: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ConstValueType',
                            }
                        }
                    },

                    // 类型转换
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: 'Convert[Value] to [Type]', id: 'block_toValue' }),
                        opcode: 'toValue',
                        arguments: {
                            Value: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                            Type: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'ConstType',
                            }
                        }
                    },

                    // 生成随机ID
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: 'Return the new id with [num] digits', id: 'block_returnNewId' }),
                        opcode: 'returnNewId',
                        arguments: {
                            num: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 6,
                            },
                        }
                    },

                    // 复制到剪贴板
                    {
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate({ default: 'Copy[Str] to Clipboard', id: 'block_copyString' }),
                        opcode: 'copyString',
                        arguments: {
                            Str: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '',
                            },
                        }
                    },

                    // 读取剪贴板
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate({ default: 'Clipboard Content', id: 'block_clipboardString' }),
                        opcode: 'clipboardString',
                    },
                ],

                menus: this._createMenus()
            };
        }

        _createMenus() {
            return {
                // 布尔值常量菜单
                ConstBool: [
                    { text: 'true', value: 'true' },
                    { text: 'false', value: 'false' },
                ],

                // 数学常数菜单
                ConstNum: [
                    { text: 'π', value: 'pi' },
                    { text: 'e', value: 'e' },
                    { text: 'φ', value: 'phi' },
                    { text: 'γ', value: 'gamma' },
                ],

                // 特殊字符串菜单
                ConstString: [
                    { text: 'Enter', value: 'newline' },
                    { text: 'Space', value: 'space' },
                    { text: 'Tab', value: 'tab' },
                ],

                // 数据类型菜单
                ConstType: [
                    { text: Scratch.translate({ default: 'Number', id: 'menu_typeNumber' }), value: 'Number' },
                    { text: Scratch.translate({ default: 'String', id: 'menu_typeString' }), value: 'String' },
                ],

                // 最大/最小类型菜单
                ConstTypeBigSmall: [
                    { text: Scratch.translate({ default: 'Highest', id: 'menu_typeBig' }), value: 'Highest' },
                    { text: Scratch.translate({ default: 'Lowest', id: 'menu_typeSmall' }), value: 'Lowest' },
                ],

                // 特殊值类型菜单
                ConstValueType: [
                    { text: 'null', value: 'null' },
                    { text: 'undefined', value: 'undefined' },
                    { text: 'NaN', value: 'NaN' },
                    { text: 'Infinity', value: 'Infinity' },
                    { text: '-Infinity', value: '-Infinity' },
                ],

                // 字符串转换类型菜单
                ConstStrType: [
                    {
                        text: Scratch.translate({ default: 'Uppercase', id: 'menu_typeStrBig' }),
                        value: 'Uppercase',
                    },
                    {
                        text: Scratch.translate({ default: 'Lowercase', id: 'menu_typeStrSmall' }),
                        value: 'Lowercase',
                    },
                ],
            };
        }

        // ==================== 布尔值操作方法 ====================

        boolCheck(args) {
            const { Bool = '' } = args;
            const boolStr = String(Bool).toLowerCase().trim();
            
            // 检查常见的真值表示
            if (boolStr === 'true' || boolStr === 'yes' || boolStr === 'y') {
                return true;
            }
            
            // 检查数值是否大于0
            const numValue = Scratch.Cast.toNumber(Bool);
            return !isNaN(numValue) && numValue > 0;
        }

        boolType(args) {
            const { TypeBool = '' } = args;
            return TypeBool === 'true';
        }

        returnRandomBool(args) {
            const { num = 0.5 } = args;
            const probability = Scratch.Cast.toNumber(num);
            
            // 边界处理
            if (probability >= 1) return true;
            if (probability <= 0) return false;
            
            return Math.random() < probability;
        }

        valueIfElse(args) {
            const { Bool = false, valueA = '', valueB = '' } = args;
            return Bool ? valueA : valueB;
        }

        whenBoolCome(args) {
            const { Bool = false, TypeBool = '' } = args;
            const targetState = TypeBool === 'true';
            const currentState = Scratch.Cast.toBoolean(Bool);
            
            return currentState === targetState;
        }

        // ==================== 数值操作方法 ====================

        numHighest(args) {
            const { Num = 0, high = 0 } = args;
            return Math.min(Scratch.Cast.toNumber(Num), Scratch.Cast.toNumber(high));
        }

        numLowest(args) {
            const { Num = 0, low = 0 } = args;
            return Math.max(Scratch.Cast.toNumber(Num), Scratch.Cast.toNumber(low));
        }

        numDecimal(args) {
            const { Num = 0, decimal = 0 } = args;
            const numValue = Scratch.Cast.toNumber(Num);
            const decimalPlaces = Math.max(0, Scratch.Cast.toNumber(decimal));
            
            return Number(numValue.toFixed(decimalPlaces));
        }

        numBigSmall(args) {
            const { Num1 = 0, Num2 = 0, Type = '' } = args;
            const num1 = Scratch.Cast.toNumber(Num1);
            const num2 = Scratch.Cast.toNumber(Num2);
            
            if (Type === 'Highest') {
                return Math.max(num1, num2);
            } else if (Type === 'Lowest') {
                return Math.min(num1, num2);
            }
            
            return 0;
        }

        numBigEqual(args) {
            const { Num1 = 0, Num2 = 0 } = args;
            return Scratch.Cast.toNumber(Num1) >= Scratch.Cast.toNumber(Num2);
        }

        numSmallEqual(args) {
            const { Num1 = 0, Num2 = 0 } = args;
            return Scratch.Cast.toNumber(Num1) <= Scratch.Cast.toNumber(Num2);
        }

        numNearEqual(args) {
            const { Num1 = 0, Num2 = 0, Num3 = 0 } = args;
            const diff = Math.abs(Scratch.Cast.toNumber(Num1) - Scratch.Cast.toNumber(Num2));
            return diff <= Scratch.Cast.toNumber(Num3);
        }

        numPower(args) {
            const { Num1 = 0, Num2 = 0 } = args;
            return Math.pow(Scratch.Cast.toNumber(Num1), Scratch.Cast.toNumber(Num2));
        }

        numSqrt(args) {
            const { Num = 0, Sqrt = 2 } = args;
            const numValue = Scratch.Cast.toNumber(Num);
            const sqrtValue = Scratch.Cast.toNumber(Sqrt);
            
            if (sqrtValue === 0) return NaN;
            return Math.pow(numValue, 1 / sqrtValue);
        }

        numFactorial(args) {
            const { Num = 0 } = args;
            const numValue = Math.floor(Scratch.Cast.toNumber(Num));
            
            // 边界处理
            if (numValue < 0) return 0;
            if (numValue === 0 || numValue === 1) return 1;
            
            // 计算阶乘
            let result = 1;
            for (let i = 2; i <= numValue; i++) {
                result *= i;
            }
            
            return result;
        }

        // ==================== 字符串操作方法 ====================

        stringDefault(args) {
            const { Str = '', defaultValue = '' } = args;
            
            // 检查是否为空
            if (!Str || Str === '' || Str === null || Str === undefined) {
                return defaultValue;
            }
            
            return Str;
        }

        stringEqual(args) {
            const { Str1 = '', Str2 = '' } = args;
            return Str1 === Str2;
        }


        stringTurn(args) {
            const { Str = '', Type = '' } = args;
            
            if (Type === 'Uppercase') {
                return Str.toUpperCase();
            } else if (Type === 'Lowercase') {
                return Str.toLowerCase();
            }
            
            return Str;
        }

        /**
         * Unicode码转字符
         * @param {object} args - 参数对象
         * @param {number} args.Unicode - Unicode码
         * @returns {string} 对应的字符
         */
        unicodeToString(args) {
            const { Unicode = 0 } = args;
            return String.fromCharCode(Scratch.Cast.toNumber(Unicode));
        }

        stringToUnicode(args) {
            const { Str = '' } = args;
            
            // 检查输入有效性
            if (!Str || Str.length !== 1) {
                return 0;
            }
            
            return Str.charCodeAt(0);
        }

        returnStringRange(args) {
            const { Str = '', num1 = 0, num2 = 0 } = args;
            const start = Math.max(0, Scratch.Cast.toNumber(num1));
            const end = Scratch.Cast.toNumber(num2);
            
            // 边界检查
            if (start >= Str.length || end <= 0 || start >= end) {
                return '';
            }
            
            return Str.substring(start, end);
        }

        // ==================== 其他操作方法 ====================

        constNum(args) {
            const { Value = '' } = args;
            
            switch (Value) {
                case 'pi':
                    return Math.PI;
                case 'e':
                    return Math.E;
                case 'phi':
                    return (1 + Math.sqrt(5)) / 2; // 黄金比例
                case 'gamma':
                    return 0.5772156649015329; // 欧拉-马歇罗尼常数
                default:
                    return 0;
            }
        }

        constString(args) {
            const { Value = '' } = args;
            
            switch (Value) {
                case 'newline':
                    return '\n';
                case 'space':
                    return ' ';
                case 'tab':
                    return '\t';
                default:
                    return '';
            }
        }

        constType(args) {
            const { Value = '' } = args;
            
            switch (Value) {
                case 'null':
                    return null;
                case 'undefined':
                    return undefined;
                case 'NaN':
                    return NaN;
                case 'Infinity':
                    return Infinity;
                case '-Infinity':
                    return -Infinity;
                default:
                    return Value;
            }
        }

        toValue(args) {
            const { Value = '', Type = '' } = args;
            
            if (Type === 'Number') {
                return Scratch.Cast.toNumber(Value);
            } else if (Type === 'String') {
                return Scratch.Cast.toString(Value);
            }
            
            return Value;
        }

        returnNewId(args) {
            const { num = 6 } = args;
            const length = Math.max(1, Math.floor(Scratch.Cast.toNumber(num)));
            
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * chars.length);
                result += chars[randomIndex];
            }
            
            return result;
        }

        copyString(args) {
            const { Str = '' } = args;
            
            // 检查输入有效性
            if (!Str || Str === '' || Str === null || Str === undefined) {
                return;
            }
            
            // 检查浏览器支持
            if (typeof navigator === 'undefined' || !navigator.clipboard) {
                return;
            }
            
            // 尝试复制
            try {
                navigator.clipboard.writeText(Str);
            } catch (error) {
                // 复制失败时不抛出异常
            }
        }

        clipboardString() {
            // 检查浏览器支持
            if (typeof navigator === 'undefined' || !navigator.clipboard) {
                return '';
            }
            
            try {
                return Scratch.Cast.toString(navigator.clipboard.readText());
            } catch (error) {
                return '';
            }
        }
        
        // 随机加减
        numRandomAddMinus(args) {
            const { Num1 = 0, Num2 = 0 } = args;
            return Num1 + (Math.random() - 0.5) * Num2;
        }
    }

    // 注册扩展
    Scratch.extensions.register(new EasyBlock());

})(Scratch);
