(function(Scratch) {
    if (!Scratch.extensions.unsandboxed) {
        throw new Error("Blockly extension must be run unsandboxed");
    }

    const variables = {}

    let Blockly = null;

    const loadBlocklyOnce = async () => {
        if (window.Blockly && window.Blockly.Blocks) {
            Blockly = window.Blockly;
            console.log("Blockly already loaded.");
            return;
        }
    
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://unpkg.com/blockly/blockly.min.js";
            script.onload = () => {
                Blockly = window.Blockly;
                const waitUntilBlocksAvailable = setInterval(() => {
                    if (Blockly.Blocks) {
                        clearInterval(waitUntilBlocksAvailable);
                        console.log("Blockly is fully ready!");
                        resolve();
                    }
                }, 10);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    // dynamic toolbox implementation by Xeltalliv
    // https://github.com/Xeltalliv/extensions/blob/examples/examples/custom-dynamic-toolbox.js
    // Adding support for 'custom' property to all extensions
    // Probably needs to be sanitized
    const runtime = Scratch.vm.runtime;
    const fec = runtime._fillExtensionCategory.bind(runtime);
    runtime._fillExtensionCategory = function(categoryInfo, extensionInfo) {
        if(extensionInfo.custom) categoryInfo.custom = extensionInfo.custom;
        fec(categoryInfo, extensionInfo);
    }
    const gbx = runtime.getBlocksXML.bind(runtime);
    runtime.getBlocksXML = function(target) {
        const categoryInfo = this._blockInfo;
        const res = gbx(target);
        res.forEach((elem, idx) => {
            const custom = categoryInfo[idx].custom;
            if (custom) {
                elem.xml = `${elem.xml.substr(0,10)} custom='${custom}' ${elem.xml.substr(9)}`
            }
        });
        return res;
    }

    const categoryPrefix = 'BLOCKLY_extendable_';

    function modify(block, change) {
        let mutation = block.mutationToDom();
        let bi = JSON.parse(mutation.getAttribute('blockInfo'));
        change(bi);
        mutation.setAttribute('blockInfo', JSON.stringify(bi));
        block.needsBlockInfoUpdate = true;
        for (let input of block.inputList) {
            block.removeInput(input.name, true);
        }
        updateMutation(block, mutation);
    }

    function updateMutation(block, mutation) {
        var oldMutationDom = block.mutationToDom();
        var oldMutation = oldMutationDom && ScratchBlocks.Xml.domToText(oldMutationDom);
        block.domToMutation(mutation);
        var newMutationDom = block.mutationToDom();
        var newMutation = newMutationDom && ScratchBlocks.Xml.domToText(newMutationDom);
        ScratchBlocks.Events.fire(new ScratchBlocks.Events.BlockChange(block, 'mutation', null, oldMutation, newMutation));
    }

    const extendable_join_mutator = {
        itemCount_: 0,

        mutationToDom: function () {
            const container = document.createElement('mutation');
            container.setAttribute('item', String(this.itemCount_));
            return container;
        },

        domToMutation: function (xmlElement) {
            this.itemCount_ = parseInt(xmlElement.getAttribute('item'));
            this.rebuildShape_();
        },

        decompose: function (workspace) {
            const containerBlock = workspace.newBlock(`${categoryPrefix}join_mutator_join`);
            containerBlock.initSvg();
            let connection = containerBlock.nextConnection;

            for (let i = 1; i <= this.itemCount_; i++) {
                const itemBlock = workspace.newBlock(`${categoryPrefix}join_mutator_item`);
                itemBlock.initSvg();
                connection.connect(itemBlock.previousConnection);
                connection = itemBlock.nextConnection;
            }

            return containerBlock;
        },

        compose: function (containerBlock) {
            let clauseBlock = containerBlock.nextConnection.targetBlock();
            this.itemCount_ = 0;
            const valueConnections = [null];

            while (clauseBlock) {
                if (clauseBlock.isInsertionMarker()) {
                    clauseBlock = clauseBlock.getNextBlock();
                    continue;
                }
                if (clauseBlock.type === `${categoryPrefix}join_mutator_item`) {
                    this.itemCount_++;
                    valueConnections.push(clauseBlock.valueConnection_);
                }
                clauseBlock = clauseBlock.getNextBlock();
            }

            this.updateShape_();
            this.reconnectChildBlocks_(valueConnections);
        },

        saveConnections: function (containerBlock) {
            let clauseBlock = containerBlock.nextConnection.targetBlock();
            let i = 1;
            while (clauseBlock) {
                if (clauseBlock.isInsertionMarker()) {
                    clauseBlock = clauseBlock.getNextBlock();
                    continue;
                }
                if (clauseBlock.type === `${categoryPrefix}join_mutator_item`) {
                    const input = this.getInput(`ITEM${i}`);
                    clauseBlock.valueConnection_ = input && input.connection.targetConnection;
                    i++;
                }
                clauseBlock = clauseBlock.getNextBlock();
            }
        },

        rebuildShape_: function () {
            const valueConnections = [null];
            for (let i = 1; this.getInput(`ITEM${i}`); i++) {
                valueConnections.push(this.getInput(`ITEM${i}`).connection.targetConnection);
            }
            this.updateShape_();
            this.reconnectChildBlocks_(valueConnections);
        },

        updateShape_: function () {
            for (let i = 1; this.getInput(`ITEM${i}`); i++) {
                this.removeInput(`ITEM${i}`);
            }
            if (this.getInput('DUMMY')) {
                this.removeInput('DUMMY');
            }

            const block = this;

            modify(block, function() {
                const blockRef = block;
                blockRef.appendDummyInput('DUMMY')
                    .appendField(String('join'))
                    .appendField(new ScratchBlocks.FieldImage(
                        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' height='16' width='16' viewBox='0 0 16 16'><g><rect rx='4' ry='4' height='16' width='16' fill='%23ccc'/><path d='m4.203,7.296 0,1.368 -0.92,0.677 -0.11,0.41 0.9,1.559 0.41,0.11 1.043,-0.457 1.187,0.683 0.127,1.134 0.3,0.3 1.8,0 0.3,-0.299 0.127,-1.138 1.185,-0.682 1.046,0.458 0.409,-0.11 0.9,-1.559 -0.11,-0.41 -0.92,-0.677 0,-1.366 0.92,-0.677 0.11,-0.41 -0.9,-1.559 -0.409,-0.109 -1.046,0.458 -1.185,-0.682 -0.127,-1.138 -0.3,-0.299 -1.8,0 -0.3,0.3 -0.126,1.135 -1.187,0.682 -1.043,-0.457 -0.41,0.11 -0.899,1.559 0.108,0.409z' fill='%23000'/></g></svg>",
                        16, 16, "*", () => {
                            if (typeof blockRef.openMutatorModal === 'function') {
                                blockRef.openMutatorModal();
                            }
                        }
                    ));

                for (let i = 1; i <= this.itemCount_; i++) {
                    this.appendValueInput(`ITEM${i}`)
                        .appendField(String('some dummy text'));
                }
            });
        },

        reconnectChildBlocks_: function (valueConnections) {
            for (let i = 1; i <= this.itemCount_; i++) {
                ScratchBlocks.Mutator.reconnect(valueConnections[i], this, `ITEM${i}`);
            }
        }
    };

    window.applyMutatorChanges = () => {
        const block = window.currentEditingBlock;
        if (!block || !window.mutatorWorkspace) return;
        const containerBlock = window.mutatorWorkspace.getTopBlocks(false)[0];
        block.compose(containerBlock);
        document.getElementById('mutatorModal').style.display = 'none';
        window.mutatorWorkspace.dispose();
        window.mutatorWorkspace = null;
    };

    variables["hasExtendableJoinloaded"] = false

    class Extension {
        constructor() {
            loadBlocklyOnce().then(() => {
                this.injectMutatorModal();
                this.setupBlockly();
            });
        }

        injectMutatorModal() {
            if (document.getElementById('mutatorModal')) return;

            const modalHTML = `
                <div id="mutatorModal" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:400px; height:300px; background:white; border:2px solid #888; z-index:1000; padding:10px; box-shadow:0 4px 16px rgba(0,0,0,0.25);">
                    <div id="mutatorWorkspace" style="width:100%; height:240px;"></div>
                    <div style="text-align:right; margin-top:5px;">
                        <button onclick="window.applyMutatorChanges()">Apply</button>
                        <button onclick="document.getElementById('mutatorModal').style.display='none'">Cancel</button>
                    </div>
                </div>
            `;
            const div = document.createElement('div');
            div.innerHTML = modalHTML;
            document.body.appendChild(div);
        }

        defineExtendableJoin() {
            if (!this.hasBlocklyLoaded()) {
                console.error("Blockly not loaded properly.");
                return;
            }

            if (variables["hasExtendableJoinloaded"]) return;
            variables["hasExtendableJoinloaded"] = true;

            ScratchBlocks.Blocks[`${categoryPrefix}join`] = {
                /**
                 * An Operator block that can be extended to an infinite amount.
                 * @this ScratchBlocks.Block
                 */
                init: function () {
                    this.appendDummyInput()
                        .appendField("join");
                    this.setOutput(true, 'String');
                    this.setColour(120);
                    this.setMutator(new ScratchBlocks.Mutator([`${categoryPrefix}join_mutator_item`]));
                },

                mutationToDom: extendable_join_mutator.mutationToDom,
                domToMutation: extendable_join_mutator.domToMutation,
                decompose: extendable_join_mutator.decompose,
                compose: extendable_join_mutator.compose,
                saveConnections: extendable_join_mutator.saveConnections,
                updateShape_: extendable_join_mutator.updateShape_,
                rebuildShape_: extendable_join_mutator.rebuildShape_,
                reconnectChildBlocks_: extendable_join_mutator.reconnectChildBlocks_
            };

            ScratchBlocks.Blocks[`${categoryPrefix}join_mutator_join`] = {
                /**
                 * Block for join container
                 * @this ScratchBlocks.Block
                 */
                init: function () {
                    this.appendDummyInput()
                        .appendField("join container");
                    this.setNextStatement(true);
                    this.setColour(120);
                }
            };

            ScratchBlocks.Blocks[`${categoryPrefix}join_mutator_item`] = {
                /**
                 * Block for join item
                 * @this ScratchBlocks.Block
                 */
                init: function () {
                    this.appendDummyInput()
                        .appendField("item");
                    this.setPreviousStatement(true);
                    this.setNextStatement(true);
                    this.setColour(120);
                }
            };
        }

        getInfo() {
            return {
                id: "BLOCKLY",
                name: "Extendable Blocks",
                custom: 'BLOCKLY_TOOLBOX',
                blocks: [
                    {
                        opcode: 'extendable_join',
                        text: 'join',
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        isDynamic: true
                    }
                ]
            };
        }

        extendable_join(args) {}

        hasBlocklyLoaded() {
            return !!(window.Blockly && window.Blockly.Blocks && ScratchBlocks && ScratchBlocks.Blocks);
        }

        setupBlockly() {
            this.defineExtendableJoin();

            ScratchBlocks.Mutator.prototype.openMutatorModal = () => {
                window.currentEditingBlock = this;
                if (window.mutatorWorkspace) {
                    window.mutatorWorkspace.dispose();
                }
                window.mutatorWorkspace = ScratchBlocks.inject('mutatorWorkspace', {
                    toolbox: '<xml></xml>',
                    collapse: false,
                    comments: false,
                    disable: false,
                    maxBlocks: Infinity,
                    trashcan: false,
                    zoom: {
                        controls: true,
                        wheel: true,
                        startScale: 1.0,
                        maxScale: 3,
                        minScale: 0.3,
                        scaleSpeed: 1.2
                    }
                });
                this.decompose(window.mutatorWorkspace);
                document.getElementById('mutatorModal').style.display = 'block';
            };
        }
    }

    const vm = Scratch.vm;
    vm.addListener('EXTENSION_ADDED', tryRegisterToolboxCategory);
    vm.addListener('BLOCKSINFO_UPDATE', tryRegisterToolboxCategory);
    // tryUseBlockly();

    function tryUseBlockly() {
        if (!window.Blockly && !variables["hasExtendableJoinloaded"]) return;

        if (!ScratchBlocks && !ScratchBlocks.Blocks['BLOCKLY_extendable_join']) {
            console.warn("Block not yet defined, delaying toolbox registration...");
            return;
        }

        if (!ScratchBlocks.mainWorkspace) {
            console.warn("Workspace not ready yet.");
            return;
        }

        vm.removeListener('EXTENSION_ADDED', tryUseBlockly);
        vm.removeListener('BLOCKSINFO_UPDATE', tryUseBlockly);

        ScratchBlocks.mainWorkspace.registerToolboxCategoryCallback('BLOCKLY_TOOLBOX', () => {
            const block1 = document.createElement('block');
            block1.setAttribute('type', 'BLOCKLY_extendable_join');
            return [block1];
        })
    }

    function tryRegisterToolboxCategory() {
        if (
            !ScratchBlocks &&
            !ScratchBlocks.Blocks &&
            !ScratchBlocks.Blocks['BLOCKLY_extendable_join']
        ) {
            console.warn('BLOCKLY_extendable_join not ready yet. Retrying...');
            setTimeout(tryRegisterToolboxCategory, 100);
            return;
        }

        tryUseBlockly();

        console.log('Toolbox callback registered!');
    }

    Scratch.extensions.register(new Extension());
})(Scratch);
