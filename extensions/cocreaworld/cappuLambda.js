(function (_Scratch) {
    const { Cast, translate, extensions } = _Scratch;

    if (_Scratch.runtime) {
        var runtime = _Scratch.runtime;
    } else if (_Scratch.vm && _Scratch.vm.runtime) {
        var runtime = _Scratch.vm.runtime;
    } else {
        throw new Error("Can't find runtime");
    }

    const iconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyNDIuMjQ3NjgiIGhlaWdodD0iMjQ5LjY2MDExIiB2aWV3Qm94PSIwLDAsMjQyLjI0NzY4LDI0OS42NjAxMSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE5OC44NzYxNiwtNTUuMTY5OTQpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGw9IiM1ZDY0YWQiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMzE5LjcxMDE2LDE4Ni41OTE4N2MtMC45MjE2OSwxLjMwMzIyIC0xLjY5ODQ2LDIuMzc1NzkgLTIuNDQ2MjQsMy40NTk4OWMtMTEuOTI1OTIsMTcuNDYwODkgLTIzLjg0Nzk4LDM0LjkxOTg2IC0zNS43NjYxNyw1Mi4zNzY5Yy0xMS4wODczMiwxNi4yMzg0IC0yMi4xODYyMywzMi40NjcxOCAtMzMuMjk2NzQsNDguNjg2MzZjLTAuMzcyODgsMC41MTUxIC0wLjk0ODE1LDAuODQ4MzkgLTEuNTgyNTIsMC45MTY4N2MtMTUuNjg2MSwtMC4xMzQ1NSAtMzEuMzY4MzQsLTAuMzAzNyAtNDcuMDQ2NzEsLTAuNTA3NDVjLTAuMTczOSwwIC0wLjM1MzYsLTAuMDUxOSAtMC42OTU2MSwtMC4xMDM4YzAuMTI2NjMsLTAuMzI2MDQgMC4yNzM3NywtMC42NDM4MiAwLjQ0MDU2LC0wLjk1MTQ3YzEwLjk0MDQ3LC0xNi44NzI3MSAyMS44ODA5MywtMzMuNzQxNTggMzIuODIxNCwtNTAuNjA2NmM5LjcwMzgyLC0xNC45NDY3MSAxOS40MTM0NCwtMjkuODg5NTcgMjkuMTI4ODUsLTQ0LjgyODU5YzEwLjc2NjU2LC0xNi41OTk3NiAyMS41MjczMywtMzMuMjExMDYgMzIuMjgyMywtNDkuODMzODljMS41ODgzMiwtMi40NTA3NSAzLjI0MDQsLTQuODU1MzcgNC43NDc1NywtNy4zNTIyNmMwLjM4NjQ3LC0wLjY2ODM4IDAuNTAyNTQsLTEuNDU4MDkgMC4zMjQ2MiwtMi4yMDg1NmMtMi44OTgzOSwtOS4xOTE3NiAtNS44NTQ3NSwtMTguMzYwNDYgLTguODA1MzIsLTI3LjUyOTE2Yy0xLjI2MzcsLTMuOTI2OTcgLTIuNTg1MzcsLTcuODMwODcgLTMuNzY3OTEsLTExLjc4MDkxYy0wLjM4MjU5LC0xLjI2ODYyIC0xLjAxNDQ0LC0xLjY1NDk4IC0yLjMxODcxLC0xLjY0OTIxYy05Ljg1NDU0LDAuMDQwMzcgLTE5LjY1MTEsMC4wMjg4MyAtMjkuNDc2NjYsMC4wMjg4M2MtMS44NjY1NywwIC0xLjg3MjM2LDAgLTEuODcyMzYsLTEuODMzNzRjMCwtMTIuMDE3MzQgMCwtMjQuMDM0NjcgLTAuMDM0NzgsLTM2LjA1MjAxYzAsLTEuMzM3ODIgMC40NDA1NiwtMS42Mzc2OCAxLjcwNDI2LC0xLjYzNzY4YzE5Ljc4MjUsMC4wMzQ2IDM5LjU2ODg2LDAuMDM0NiA1OS4zNTkwOSwwYzAuOTUwNzUsLTAuMTIwOTQgMS44NDQwNCwwLjQ3ODg3IDIuMDg2ODQsMS40MDEyNWMxMC40MzQyMSwyNi4xMDY3NiAyMC44Njg0Myw1Mi4yMDM5MSAzMS4zMDI2NCw3OC4yOTE0NWMxMi4xNzMyNSwzMC40MjM5MyAyNC4zNDY1LDYwLjg1MTcgMzYuNTE5NzUsOTEuMjgzMzJjMy43Nzk1LDkuNDQ1NDkgNy41ODc5OSwxOC44ODUyMSAxMS4zMjY5MiwyOC4zNTM3NmMwLjQ0NjM1LDEuMTUzMyAwLjkxMDEsMS4zNzI0MiAyLjA4MTA1LDEuMDE0OWMxMC4zNzA0NSwtMy4xODg4NiAyMC43NjQwOSwtNi4yOTEyMyAzMS4xMjg3NCwtOS40ODU4NWMxLjMwNDI4LC0wLjQwMzY1IDEuNzc5NjEsLTAuMTMyNjMgMi4xODUzOSwxLjE1MzNjMy41MzYwNCwxMS4wNTQzNCA3LjE0MTY0LDIyLjA4NTYgMTAuNzI0MDUsMzMuMTI4NDFjMC4xMjE3MywwLjM4MDU5IDAuMjE0NDgsMC43NjY5NCAwLjM1OTQsMS4yOTc0NmMtMC43NDE5OSwwLjI3MTAyIC0xLjQzNzYsMC41NzY2NSAtMi4xNTA2MSwwLjc3MjcxYy0yMy41NzM2LDcuNDMxMDcgLTQ3LjEzMzY3LDE0Ljg2NTk4IC03MC42ODAyMSwyMi4zMDQ3M2MtMS4xMjQ1OCwwLjM1MTc2IC0xLjQ2MDc5LC0wLjAyODgzIC0xLjgzNzU4LC0wLjk2ODc3Yy03LjE5MTg4LC0xOC4xMjk4IC0xNC40MDExNSwtMzYuMjUxOTEgLTIxLjYyNzgxLC01NC4zNjYzNGMtNy4wNjgyMSwtMTcuNzM3NjggLTE0LjE0MDI5LC0zNS40NzUzNiAtMjEuMjE2MjQsLTUzLjIxMzA0Yy0xLjA2MDgxLC0yLjY2NDExIC0yLjEwNDIzLC01LjMzOTc2IC0zLjE2NTA1LC04LjAwMzg3Yy0wLjE2ODExLC0wLjQ1NTU1IC0wLjM5OTk4LC0wLjg1MzQ0IC0wLjczNjE5LC0xLjU1Njk1eiIvPjwvZz48L2c+PC9zdmc+';

    translate.setup({
        zh: {
            'extensionName': 'Lambda λ',

            'block.doWithWarpMode': '运行不刷新屏幕',
            'block.returnValue': '返回值 [VALUE]',
            'block.defineLambda': '⚠️ 定义 Lambda：名为[NAME]，参数[arg]',
            'block.wrapLambda': '⚠️ 定义 Lambda [NAME]：基于[FROM]，封装类型[TYPE]，参数[ARG]',

            'block.callLambda': '调用 Lambda [NAME]，参数[ARG]',
            'block.callLambdaWithReturn': '调用 Lambda [NAME]，参数[ARG]',


            'block.doOneArgLambda': '对列表 [LIST] 每一项执行 [OPERATE]，参数[it]',
            'block.readLastResult': '读取上次执行结果',

            'tooltip.doWithWarpMode': '分支块内的积木运行期不刷新屏幕',
            'tooltip.returnValue': '返回一个值',
            'tooltip.defineLambda': '【不支持编译模式】定义一个 Lambda 块，执行逻辑放在分支里，可通过下面的调用积木进行调用',
            'tooltip.wrapLambda': `【不支持编译模式】基于已有的 Lambda 定义一个新的 Lambda，可设置封装类型，以及类型对应的参数。
1. 前执行：前[参数]次执行，后面不执行
2. 后执行：前[参数]次不执行，后面执行
3. 节流：[参数]秒期间多次调用但只会执行一次`,

            'tooltip.callLambda': '调用一个 Lambda，传入的参数将会在积木定义处作为 arg 使用',
            'tooltip.callLambdaWithReturn': '调用一个 Lambda，传入的参数将会在积木定义处作为 arg 使用，并且通过返回积木返回的值将在这里返回',

            'tooltip.doOneArgLambda': `对列表的每一项执行下面分支块，如果操作有返回结果，将会在下面"读取上次执行结果"的积木中返回（不会直接修改列表数据）。
1. 遍历：对列表的每一项执行操作
2. 遍历（逆向）：从列表的最后一项开始遍历
3. 映射：每次返回的结果组成一个新的列表
4. 过滤：返回结果为真的项组成一个新的列表
5. 拒绝：返回结果为假的项组成一个新的列表
6. 分组计数：根据返回结果进行分组计数，比如 [1, 2, 3, 4, 5]，分支逻辑是根据类型返回奇数或偶数，那最终运行结果为 '{ "奇数": 4, "偶数": 2 }'
7. 分组：根据返回结果进行分组，比如 [1, 2, 3, 4, 5]，分支逻辑是根据类型返回奇数或偶数，那最终运行结果为 '{ "奇数": [1, 4, 5], "偶数": [2, 4] }'
8. 存在：只要有一项返回结果为真，那最终运行结果为真，否则为假`,
            'tooltip.readLastResult': '读取上次遍历积木执行的结果，💡 该积木一定要保持和上面的遍历积木在同一个帽子积木下，才能读取到结果',

            'menu.wrapBefore': '前执行',
            'menu.wrapAfter': '后执行',
            'menu.wrapThrottle': '节流',

            'menu.operateForEach': '遍历',
            'menu.operateForEachRight': '遍历（逆向）',
            'menu.operateMap': '映射',
            'menu.operateFilter': '过滤',
            'menu.operateReject': '拒绝',
            'menu.operateCountBy': '分组计数',
            'menu.operateGroupBy': '分组',
            'menu.operateSome': '存在',
        },
        en: {
            'extensionName': 'Lambda λ',

            'block.doWithWarpMode': 'run without screen refresh',
            'block.returnValue': 'return value [VALUE]',
            'block.defineLambda': '⚠️ define Lambda: name[NAME], arg[arg]',
            'block.wrapLambda': '⚠️ define Lambda [NAME]: from [FROM], wrap type[TYPE], arg[ARG]',

            'block.callLambda': 'call Lambda [NAME] with arg[ARG]',
            'block.callLambdaWithReturn': 'call Lambda [NAME] with arg[ARG]',

            'block.doOneArgLambda': 'perform [OPERATE] on each item in [LIST] with arg[it]',
            'block.readLastResult': 'read last result',

            'tooltip.doWithWarpMode': 'The block runs without refreshing the screen during the branch',
            'tooltip.returnValue': 'Return a value',
            'tooltip.defineLambda': '[Not support compile mode] Define a Lambda block, the execution logic is placed in the branch, and can be called through the call block below',
            'tooltip.wrapLambda': `[Not support compile mode] Define a new Lambda based on the existing Lambda, you can set the wrap type, and the parameter corresponding to the type.
1. Before execution: execute [parameter] times before, and do not execute later
2. After execution: do not execute [parameter] times before, and execute later
3. Throttle: multiple calls during [parameter] seconds, but only execute once`,

            'tooltip.callLambda': 'Call a Lambda, the passed parameter will be used as arg at the block definition',
            'tooltip.callLambdaWithReturn': 'Call a Lambda, the passed parameter will be used as arg at the block definition, and the value returned by the return block will be returned here',

            'tooltip.doOneArgLambda': `Perform the following branch block on each item in the list, if the operation has a return result, it will be returned in the "read last result" block below (the list data will not be directly modified).
1. For each: perform the operation on each item in the list
2. For each (right): traverse from the last item in the list
3. Map: the result of each return forms a new list
4. Filter: the items that return true form a new list
5. Reject: the items that return false form a new list
6. Count by: grouping and counting according to the return result, for example [1, 2, 3, 4, 5], the branch logic returns odd or even according to the type, then the final result is '{ "odd": 3, "even": 2 }'
7. Group by: grouping according to the return result, for example [1, 2, 3, 4, 5], the branch logic returns odd or even according to the type, then the final result is '{ "odd": [1, 3, 5], "even": [2, 4] }'
8. Some: If any item returns true, the final result is true, otherwise it is false
`,
            'tooltip.readLastResult': 'Read the result of the last traversal block, 💡 The block must be kept in the same hat block as the traversal block above to read the result',

            'menu.wrapBefore': 'before',
            'menu.wrapAfter': 'after',
            'menu.wrapThrottle': 'throttle',

            'menu.operateForEach': 'for each',
            'menu.operateForEachRight': 'for each (right)',
            'menu.operateMap': 'map',
            'menu.operateFilter': 'filter',
            'menu.operateReject': 'reject',
            'menu.operateCountBy': 'count by',
            'menu.operateGroupBy': 'group by',
            'menu.operateSome': 'some',
        }
    });
    class MyExtension {
        constructor(_runtime) {
            /**
            * Store this for later communication with the Scratch VM runtime.
            * If this extension is running in a sandbox then 'runtime' is an async proxy object.
            * @type {Runtime}
            */
            this.runtime = _runtime;
            this._funcMap = {};
        }

        /**
         * @return {object} This extension's metadata.
         */
        getInfo() {
            return {
                /* Required: the machine-readable name of this extension.
                   Will be used as the extension's namespace.
                   Allowed characters are those matching the regular expression [w-]: A-Z, a-z, 0-9, and hyphen ("-"). */
                id: 'cappuLambda',

                /* Core extensions only: override the default extension block colors. */
                color1: '#FF8C1A',
                color2: '#DB6E00',

                /* Optional: the human-readable name of this extension as string.
                   This and any other string to be displayed in the Scratch UI may either be
                   a string or a call to 'translate'; a plain string will not be
                   translated whereas a call to 'translate' will connect the string
                   to the translation map (see below). The 'translate' call is
                   similar to 'translate' from 'react-intl' in form, but will actually
                   call some extension support code to do its magic. For example, we will
                   internally namespace the messages such that two extensions could have
                   messages with the same ID without colliding.
                   See also: https://github.com/yahoo/react-intl/wiki/API#translate */
                name: translate({ id: 'extensionName' }),

                /* Optional: URI for a block icon, to display at the edge of each block for this
                   extension. Data URI OK.
                   size  40x40, 1:1 aspect ratio
                */
                blockIconURI: iconURI,

                /* Optional: URI for an icon to be displayed in the blocks category menu.
                   If not present, the menu will display the block icon, if one is present.
                   Otherwise, the category menu shows its default filled circle.
                   Data URI OK.
                   size  40x40, 1:1 aspect ratio
                */
                menuIconURI: iconURI,


                /* Optional: Link to documentation content for this extension.
                   replace it with your document link */

                // docsURI: 'https://getgandi.com/',

                /* Required: the list of blocks implemented by this extension,
                   in the order intended for display. */
                blocks: [
                    {
                        opcode: 'doWithWarpMode',
                        blockType: 'conditional',
                        text: [translate({ id: 'block.doWithWarpMode' })],
                        tooltip: translate({ id: 'tooltip.doWithWarpMode' }),
                        branchCount: 1,
                        arguments: {},
                    },
                    {
                        opcode: 'defineLambda',
                        blockType: 'conditional',
                        text: [translate({ id: 'block.defineLambda' })],
                        tooltip: translate({ id: 'tooltip.defineLambda' }),
                        branchCount: 1,
                        arguments: {
                            NAME: {
                                type: 'string',
                                defaultValue: 'func1',
                            },
                            arg: {
                                type: 'ccw_hat_parameter',
                            },
                        },
                    },
                    {
                        opcode: 'returnValue',
                        blockType: 'command',
                        text: [translate({ id: 'block.returnValue' })],
                        tooltip: translate({ id: 'tooltip.returnValue' }),
                        isTerminal: true,
                        arguments: {
                            VALUE: {
                                type: 'string',
                            },
                        },
                    },
                    {
                        opcode: 'wrapLambda',
                        blockType: 'command',
                        text: [translate({ id: 'block.wrapLambda' })],
                        tooltip: translate({ id: 'tooltip.wrapLambda' }),
                        arguments: {
                            NAME: {
                                type: 'string',
                                defaultValue: 'func2',
                            },
                            FROM: {
                                type: 'string',
                                defaultValue: 'func1',
                            },
                            TYPE: {
                                type: 'string',
                                menu: 'WRAP_TYPE_MENU',
                            },
                            ARG: {
                                type: 'string',
                            },
                        },
                    },
                    {
                        opcode: 'callLambda',
                        blockType: 'command',
                        text: [translate({ id: 'block.callLambda' })],
                        tooltip: translate({ id: 'tooltip.callLambda' }),
                        arguments: {
                            NAME: {
                                type: 'string',
                                defaultValue: 'func1',
                            },
                            ARG: {
                                type: 'string',
                            },
                        },
                    },
                    {
                        opcode: 'callLambdaWithReturn',
                        blockType: 'reporter',
                        text: [translate({ id: 'block.callLambdaWithReturn' })],
                        tooltip: translate({ id: 'tooltip.callLambdaWithReturn' }),
                        arguments: {
                            NAME: {
                                type: 'string',
                                defaultValue: 'func1',
                            },
                            ARG: {
                                type: 'string',
                            },
                        },
                    },
                    {
                        // 执行一个参数的 lambda
                        opcode: 'doOneArgLambda',
                        blockType: 'conditional',
                        text: [translate({ id: 'block.doOneArgLambda' })],
                        tooltip: translate({ id: 'tooltip.doOneArgLambda' }),
                        branchCount: 1,
                        arguments: {
                            LIST: {
                                type: 'string',
                                menu: 'LIST_MENU',
                            },
                            OPERATE: {
                                type: 'string',
                                menu: 'OPERATE_MENU',
                            },
                            it: {
                                type: 'ccw_hat_parameter',
                            },
                        },
                    },
                    {
                        // 执行一个参数的 lambda
                        opcode: 'readLastResult',
                        blockType: 'reporter',
                        text: [translate({ id: 'block.readLastResult' })],
                        tooltip: translate({ id: 'tooltip.readLastResult' }),
                        arguments: {},
                        disableMonitor: true,
                    },

                ],

                /* Optional: define extension-specific menus here.*/

                menus: {
                    LIST_MENU: {
                        items: '__listMenu',
                        acceptReporters: true,
                    },
                    OPERATE_MENU: {
                        items: [
                            { text: translate({ id: 'menu.operateForEach' }), value: 'forEach' },
                            { text: translate({ id: 'menu.operateForEachRight' }), value: 'forEachRight' },
                            { text: translate({ id: 'menu.operateMap' }), value: 'map' },
                            { text: translate({ id: 'menu.operateFilter' }), value: 'filter' },
                            { text: translate({ id: 'menu.operateReject' }), value: 'reject' },
                            { text: translate({ id: 'menu.operateCountBy' }), value: 'countBy' },
                            { text: translate({ id: 'menu.operateGroupBy' }), value: 'groupBy' },
                            { text: translate({ id: 'menu.operateSome' }), value: 'some' },

                        ],
                        acceptReporters: true,
                    },
                    WRAP_TYPE_MENU: {
                        items: [
                            { text: translate({ id: 'menu.wrapBefore' }), value: 'before' },
                            { text: translate({ id: 'menu.wrapAfter' }), value: 'after' },
                            { text: translate({ id: 'menu.wrapThrottle' }), value: 'throttle' },
                        ],
                        acceptReporters: true,
                    },
                }
            };
        }


        /**
         * 获取列表的菜单
         */
        __listMenu() {
            const menus = [];
            // 放入全局列表
            if (this.runtime._stageTarget) {
                let { variables } = this.runtime._stageTarget;
                Object.keys(variables).forEach((variable) => {
                    if (variables[variable].type === 'list') {
                        menus.push({
                            text: `[GLOBAL] ${variables[variable].name}`,
                            value: variables[variable].id,
                        });
                    }
                });
            }
            // 放入私有列表
            if (this.runtime._editingTarget && this.runtime._editingTarget !== this.runtime._stageTarget) {
                let variables = this.runtime._editingTarget.variables;
                Object.keys(variables).forEach((variable) => {
                    if (variables[variable].type) {
                        menus.push({
                            text: variables[variable].name,
                            value: variables[variable].id,
                        });
                    }
                });
            }
            if (menus.length === 0) {
                menus.push({
                    text: '-',
                    value: 'empty',
                });
            }
            return menus;
        }

        defineLambda({ NAME }, util) {
            const currentBlockId = util.thread.peekStack();
            this._funcMap[NAME] = {
                id: currentBlockId,
                argKey: 'arg',
                target: util.thread.target,
                branch: 1,
            };
        }

        wrapLambda({ NAME, FROM, TYPE, ARG }, util) {
            const func = this._funcMap[FROM];
            if (!func) return;
            if (func.wrap !== undefined) {
                throw new Error('Not support multiple wrap');
            }
            const newFunc = {
                id: func.id,
                argKey: func.argKey,
                target: func.target,
                branch: func.branch,
                wrap: {
                    type: TYPE,
                    argKey: Cast.toNumber(ARG),
                    count: 0,
                    lastCallTime: 0,
                }
            };
            this._funcMap[NAME] = newFunc;
        }

        doWithWarpMode(args, util) {
            util.thread.peekStackFrame().warpMode = false;
            util.startBranch(1, false);
            util.thread.peekStackFrame().warpMode = true;
        }

        callLambdaWithReturn({ NAME, ARG }, util) {
            // console.log("xxxxxxx", NAME, this._funcMap);
            if (util.stackFrame.executed) {
                const { stackFrame } = util;
                const { returnValue } = stackFrame;
                const threadStackFrame = util.thread.peekStackFrame();
                threadStackFrame.params = null;
                delete stackFrame.returnValue;
                delete stackFrame.executed;
                const func = this._funcMap[NAME];
                if (func && func.wrap) {
                    func.wrap.lastReturnValue = returnValue;
                }
                // console.log("2222", returnValue);
                return returnValue;
            }
            const func = this._funcMap[NAME];
            if (!func) return '';
            const { id, argKey, target, branch, wrap } = func;
            const branchId = target.blocks.getBranch(id, branch);
            // console.log("branchId", branchId);
            if (branchId) {
                if (wrap) {
                    switch (wrap.type) {
                        case 'before':
                            wrap.count += 1;
                            if (wrap.count > wrap.argKey) {
                                util.thread.peekStackFrame().waitingReporter = true;
                                util.thread.peekStackFrame().isLoop = false;
                                util.stackFrame.returnValue = wrap.lastReturnValue || '';
                                util.stackFrame.executed = true;
                                return;
                            }
                            break;
                        case 'after':
                            wrap.count += 1;
                            if (wrap.count <= wrap.argKey) {
                                util.thread.peekStackFrame().waitingReporter = true;
                                util.thread.peekStackFrame().isLoop = false;
                                util.stackFrame.returnValue = '';
                                util.stackFrame.executed = true;
                                return;
                            }
                            break;
                        case 'throttle':
                            if (Date.now() - wrap.lastCallTime < wrap.argKey * 1000) {
                                util.thread.peekStackFrame().waitingReporter = true;
                                util.thread.peekStackFrame().isLoop = false;
                                util.stackFrame.returnValue = wrap.lastReturnValue || '';
                                util.stackFrame.executed = true;
                                return;
                            }
                            wrap.lastCallTime = Date.now();
                            break;
                    }
                }
                if (util.thread.hatParam == null) {
                    util.thread.hatParam = { [argKey]: ARG };
                } else {
                    util.thread.hatParam[argKey] = ARG;
                }
                util.thread.peekStackFrame().waitingReporter = true;
                util.thread.peekStackFrame().isLoop = false;
                util.stackFrame.returnValue = ''; // default return value
                util.stackFrame.executed = true;
                util.thread.pushStack(branchId, target);
                // console.log("1111", branchId, target);
            }
            return '';
        }

        callLambda(args, util) {
            this.callLambdaWithReturn(args, util);
        }


        _getItemByOperate(operate, iter, list) {
            if (['forEachRight'].includes(operate)) {
                return list[list.length - 1 - iter];
            }
            return list[iter];
        }

        _getListByIdOrName(str, target) {
            let list = target.lookupVariableById(str);
            if (!list) {
                list = target.lookupVariableByNameAndType(str, 'list');
                if (!list) return null;
            }
            return list;
        }


        doOneArgLambda({ LIST, OPERATE }, util) {
            if (util.stackFrame.__iter__ === undefined) {
                const lstStr = Cast.toString(LIST);
                if (lstStr === 'empty') return; // 未选择列表
                const list = this._getListByIdOrName(lstStr, util.target);
                if (!list) return;
                util.stackFrame.__iter__ = 0;
                util.stackFrame.__list__ = list.value;
                switch (OPERATE) {
                    case 'countBy':
                    case 'groupBy':
                        util.stackFrame.__return__ = {};
                        break;
                    case 'some':
                        util.stackFrame.__return__ = false;
                        break;
                    default:
                        util.stackFrame.__return__ = [];
                        break;
                }
            }
            if (util.stackFrame.__iter__ > util.stackFrame.__list__.length) {
                delete util.stackFrame.__iter__;
                delete util.stackFrame.__list__;
                delete util.stackFrame.__return__;
                delete util.stackFrame.returnValue;
                return;
            }
            // console.log('__iter__', util.stackFrame.__iter__, util.stackFrame.returnValue);
            if (util.stackFrame.__iter__ > 0) {
                // eslint-disable-next-line default-case
                switch (OPERATE) {
                    case 'map':
                        util.stackFrame.__return__.push(util.stackFrame.returnValue);
                        break;
                    case 'filter':
                        if (Cast.toBoolean(util.stackFrame.returnValue)) {
                            util.stackFrame.__return__.push(util.stackFrame.__list__[util.stackFrame.__iter__ - 1]);
                        }
                        break;
                    case 'reject':
                        if (!Cast.toBoolean(util.stackFrame.returnValue)) {
                            util.stackFrame.__return__.push(util.stackFrame.__list__[util.stackFrame.__iter__ - 1]);
                        }
                        break;
                    case 'countBy':
                        const key = Cast.toString(util.stackFrame.returnValue);
                        if (util.stackFrame.__return__[key] === undefined) {
                            util.stackFrame.__return__[key] = 0;
                        }
                        util.stackFrame.__return__[key] += 1;
                        break;
                    case 'groupBy':
                        const key2 = Cast.toString(util.stackFrame.returnValue);
                        if (util.stackFrame.__return__[key2] === undefined) {
                            util.stackFrame.__return__[key2] = [];
                        }
                        util.stackFrame.__return__[key2].push(util.stackFrame.__list__[util.stackFrame.__iter__ - 1]);
                        break;
                    case 'some':
                        if (Cast.toBoolean(util.stackFrame.returnValue)) {
                            util.stackFrame.__return__ = true;
                        }
                        break;
                }
            }
            if (util.stackFrame.__iter__ === util.stackFrame.__list__.length) {
                util.thread.__lambda_return__ = util.stackFrame.__return__;
                // console.log("util.thread.__lambda_return__", util.thread.__lambda_return__);
                // if (OPERATE === 'filter' || OPERATE === 'map') {
                //     const list = this._getListByIdOrName(Cast.toString(LIST), util.target);
                //     list.value = util.stackFrame.__return__;
                // }
            } else {
                util.thread.hatParam = {
                    it: this._getItemByOperate(Cast.toString(OPERATE), util.stackFrame.__iter__, util.stackFrame.__list__),
                };
                util.stackFrame.__iter__ += 1;
                util.thread.peekStackFrame().waitingReporter = true;
                util.startBranch(1, true);
            }
        }

        readLastResult(args, util) {
            // console.log("thread", util.thread);
            if (util.thread.__lambda_return__ !== undefined) {
                return JSON.stringify(util.thread.__lambda_return__);
            }
            return '';
        }

        returnValue({ VALUE }, util) {
            util.stopThisScript();
            if (util.thread.peekStackFrame()) {
                util.stackFrame.returnValue = VALUE;
            }
        }
    }

    extensions.register(new MyExtension(runtime));

}(Scratch));
