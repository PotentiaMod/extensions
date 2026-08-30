(function (Scratch) {
  const { vm, runtime, BlockType, translate } = Scratch;

  translate.setup({
    zh: {
      'extName': '扩展积木管理',
      'btn.generate': '生成自定义扩展全部积木',
      'btn.delete': '删除自定义扩展全部积木',
      'modal.title.generate': '生成自定义扩展全部积木',
      'modal.title.delete': '删除自定义扩展全部积木',
      'modal.label': '请点击选择一个扩展：',
      'btn.cancel': '取消',
      'btn.confirm': '确定',
      'toast.noExt': '未找到该扩展，请检查扩展ID。',
      'toast.success.generate': '已在当前角色生成 #COUNT# 个积木！',
      'toast.success.delete': '已从所有角色中删除 #COUNT# 个积木！',
      'toast.error': '操作失败：#MSG#',
      'toast.noWorkspace': '无法获取工作区，请确保在代码编辑器界面使用。',
      'toast.noBlocks': '该扩展没有可生成的积木。',
      'toast.noCustomExt': '没有找到已加载的自定义扩展。',
      'toast.noBlocksToDelete': '没有找到该扩展的积木。',
    },
    en: {
      'extName': 'Ext Block Manager',
      'btn.generate': 'Generate All Blocks',
      'btn.delete': 'Delete All Blocks',
      'modal.title.generate': 'Generate All Blocks',
      'modal.title.delete': 'Delete All Blocks',
      'modal.label': 'Click to select an extension:',
      'btn.cancel': 'Cancel',
      'btn.confirm': 'Confirm',
      'toast.noExt': 'Extension not found.',
      'toast.success.generate': 'Generated #COUNT# blocks!',
      'toast.success.delete': 'Deleted #COUNT# blocks!',
      'toast.error': 'Error: #MSG#',
      'toast.noWorkspace': 'Workspace not found.',
      'toast.noBlocks': 'No blocks to generate.',
      'toast.noCustomExt': 'No custom extensions loaded.',
      'toast.noBlocksToDelete': 'No blocks found for this extension.',
    },
  });

  class ExtensionBlockManager {
    constructor(_runtime) {
      this._runtime = _runtime;
      this.injectStyles();
    }

    injectStyles() {
      if (typeof document === 'undefined') return;
      const styleId = 'ext-mgr-global-styles';
      if (document.getElementById(styleId)) return;

      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .ext-mgr-toast {
          position: fixed; top: 24px; left: 50%; transform: translateX(-50%); z-index: 9999999;
          padding: 12px 24px; border-radius: 8px; color: #fff; font-weight: 500; font-size: 14px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 8px;
          animation: extMgrToastIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .ext-mgr-toast.out { animation: extMgrToastOut 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .ext-mgr-toast.success { background: #4CAF50; }
        .ext-mgr-toast.error { background: #f44336; }
        .ext-mgr-toast.info { background: #2196F3; }
        @keyframes extMgrToastIn { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }
        @keyframes extMgrToastOut { from { opacity: 1; transform: translate(-50%, 0); } to { opacity: 0; transform: translate(-50%, -20px); } }

        .ext-mgr-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.45); z-index: 9999998;
          display: flex; justify-content: center; align-items: center;
          backdrop-filter: blur(3px); animation: extMgrFadeIn 0.2s ease-out;
        }
        
        /* 优化弹窗宽度：最小400px，最大90vw，默认600px */
        .ext-mgr-modal {
          background: #ffffff; border-radius: 16px; padding: 28px 32px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2); 
          min-width: 400px; max-width: 90vw; width: 600px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          animation: extMgrScaleIn 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes extMgrFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes extMgrScaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        
        .ext-mgr-title { margin: 0 0 8px 0; font-size: 20px; color: #111; font-weight: 700; text-align: center; }
        .ext-mgr-label { margin: 0 0 20px 0; font-size: 14px; color: #666; text-align: center; }
        
        /* 优化网格：自适应列宽，保证每列至少有 240px */
        .ext-mgr-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 12px; max-height: 400px; overflow-y: auto; padding: 6px; margin-bottom: 24px;
          border: 1px solid #f0f0f0; border-radius: 10px; background: #fafafa;
        }
        
        .ext-mgr-card {
          padding: 16px; background: #fff; border: 2px solid #e8e8e8; border-radius: 10px;
          cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; 
          min-height: 60px; /* 保证基础高度一致 */
          box-sizing: border-box; position: relative; user-select: none;
        }
        .ext-mgr-card:hover { 
          border-color: #b3d4ff; background: #f5faff; 
          z-index: 10; /* 悬浮时提升层级，防止被其他卡片遮挡 */
          box-shadow: 0 8px 24px rgba(76,151,255,0.2); 
        }
        .ext-mgr-card.selected { border-color: #4C97FF; background: #eef6ff; box-shadow: 0 0 0 3px rgba(76,151,255,0.15); }
        
        /* 默认状态：单行显示，超出省略 */
        .ext-mgr-card-name { 
          font-size: 14px; font-weight: 600; color: #222; 
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; 
          transition: all 0.2s ease;
          word-break: break-all; /* 防止超长无空格英文单词撑破布局 */
        }
        .ext-mgr-card-id { 
          font-size: 12px; color: #888; margin-top: 4px; 
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; 
          transition: all 0.2s ease;
          word-break: break-all;
        }

        /* Hover 状态：允许换行，完整显示内容 */
        .ext-mgr-card:hover .ext-mgr-card-name,
        .ext-mgr-card:hover .ext-mgr-card-id {
          white-space: normal;
          overflow: visible;
        }

        .ext-mgr-btn-group { display: flex; justify-content: flex-end; gap: 12px; }
        .ext-mgr-btn {
          padding: 10px 24px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600;
          transition: all 0.2s ease; border: none; outline: none;
        }
        .ext-mgr-btn:active { transform: scale(0.96); }
        .ext-mgr-btn-cancel { background: #f5f5f5; color: #555; }
        .ext-mgr-btn-cancel:hover { background: #ebebeb; }
        .ext-mgr-btn-confirm { background: #4C97FF; color: #fff; box-shadow: 0 4px 12px rgba(76,151,255,0.3); }
        .ext-mgr-btn-confirm:hover { background: #3b8cf0; }
        .ext-mgr-btn-confirm:disabled { background: #d9d9d9; color: #8c8c8c; cursor: not-allowed; box-shadow: none; }
      `;
      document.head.appendChild(style);
    }

    showToast(message, type = 'info', duration = 3000) {
      if (typeof document === 'undefined') {
        console.log(`[${type}] ${message}`);
        return;
      }

      const toast = document.createElement('div');
      toast.className = `ext-mgr-toast ${type}`;
      
      let icon = '💡';
      if (type === 'success') icon = '✅';
      if (type === 'error') icon = '❌';
      
      toast.innerHTML = `<span style="font-size: 18px;">${icon}</span><span>${message}</span>`;
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('out');
        setTimeout(() => {
          if (document.body.contains(toast)) document.body.removeChild(toast);
        }, 300);
      }, duration);
    }

    getInfo() {
      return {
        id: 'extBlockManager',
        name: translate({ id: 'extName' }),
        color1: '#FF6680',
        color2: '#FF4D6A',
        blocks: [
          {
            blockType: BlockType.BUTTON,
            text: translate({ id: 'btn.generate' }),
            onClick: () => this.generateAllBlocks(),
          },
          {
            blockType: BlockType.BUTTON,
            text: translate({ id: 'btn.delete' }),
            onClick: () => this.deleteAllBlocks(),
          },
        ],
      };
    }

    getExtensionInfo(extensionId) {
      if (!this._runtime._blockInfo) return null;
      return this._runtime._blockInfo.find(ext => ext.id === extensionId);
    }

    getCustomExtensions() {
      if (!this._runtime._blockInfo) return [];
      const builtinIds = ['motion', 'looks', 'sound', 'event', 'control', 'sensing', 'operators', 'data', 'data-lists', 'procedures', 'extBlockManager'];
      return this._runtime._blockInfo.filter(ext => !builtinIds.includes(ext.id));
    }

    showCustomModal(actionType, exts) {
      return new Promise((resolve) => {
        let selectedId = null;

        const overlay = document.createElement('div');
        overlay.className = 'ext-mgr-overlay';

        const modal = document.createElement('div');
        modal.className = 'ext-mgr-modal';

        const title = document.createElement('h3');
        title.className = 'ext-mgr-title';
        title.textContent = translate({ id: `modal.title.${actionType}` });
        modal.appendChild(title);

        const label = document.createElement('p');
        label.className = 'ext-mgr-label';
        label.textContent = translate({ id: 'modal.label' });
        modal.appendChild(label);

        const listContainer = document.createElement('div');
        listContainer.className = 'ext-mgr-grid';

        exts.forEach(ext => {
          const card = document.createElement('div');
          card.className = 'ext-mgr-card';
          
          const nameEl = document.createElement('div');
          nameEl.className = 'ext-mgr-card-name';
          nameEl.textContent = ext.name;
          
          const idEl = document.createElement('div');
          idEl.className = 'ext-mgr-card-id';
          idEl.textContent = ext.id;

          card.appendChild(nameEl);
          card.appendChild(idEl);

          card.onclick = () => {
            listContainer.querySelectorAll('.ext-mgr-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedId = ext.id.trim();
            confirmBtn.disabled = false;
          };

          listContainer.appendChild(card);
        });
        
        modal.appendChild(listContainer);

        const btnGroup = document.createElement('div');
        btnGroup.className = 'ext-mgr-btn-group';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'ext-mgr-btn ext-mgr-btn-cancel';
        cancelBtn.textContent = translate({ id: 'btn.cancel' });

        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'ext-mgr-btn ext-mgr-btn-confirm';
        confirmBtn.textContent = translate({ id: 'btn.confirm' });
        confirmBtn.disabled = true; 

        btnGroup.appendChild(cancelBtn);
        btnGroup.appendChild(confirmBtn);
        modal.appendChild(btnGroup);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        let cleanedUp = false;
        const cleanup = (result) => {
          if (cleanedUp) return;
          cleanedUp = true;
          window.removeEventListener('keydown', handleKeyDown);
          if (document.body.contains(overlay)) document.body.removeChild(overlay);
          resolve(result);
        };

        const handleKeyDown = (e) => {
          if (e.key === 'Escape') cleanup(null);
          else if (e.key === 'Enter' && selectedId) cleanup(selectedId);
        };
        window.addEventListener('keydown', handleKeyDown);

        cancelBtn.onclick = () => cleanup(null);
        confirmBtn.onclick = () => {
            if (selectedId) cleanup(selectedId);
        };
        overlay.onclick = (e) => { if (e.target === overlay) cleanup(null); };
      });
    }

    async promptExtensionId(actionType) {
      const exts = this.getCustomExtensions();
      if (exts.length === 0) {
        this.showToast(translate({ id: 'toast.noCustomExt' }), 'error');
        return null;
      }

      if (typeof document !== 'undefined' && document.body && document.head) {
        try {
          return await this.showCustomModal(actionType, exts);
        } catch (e) {
          console.warn('自定义弹窗失败，降级处理', e);
        }
      }

      let message = `${translate({ id: `modal.title.${actionType}` })} - 请输入要操作的扩展ID：\n\n`;
      exts.forEach(ext => {
        message += `👉 ${ext.id}  (${ext.name})\n`;
      });
      const extId = prompt(message);
      return extId ? extId.trim() : null;
    }

    escapeXml(s) {
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }

    async generateAllBlocks() {
      const extId = await this.promptExtensionId('generate');
      if (!extId) return;

      const extInfo = this.getExtensionInfo(extId);
      if (!extInfo || !extInfo.blocks) {
        this.showToast(translate({ id: 'toast.noExt' }), 'error');
        return;
      }

      try {
        const BlocklyRef = typeof Blockly !== 'undefined' ? Blockly : (typeof ScratchBlocks !== 'undefined' ? ScratchBlocks : null);
        if (!BlocklyRef || !BlocklyRef.getMainWorkspace) {
          this.showToast(translate({ id: 'toast.noWorkspace' }), 'error');
          return;
        }

        const workspace = BlocklyRef.getMainWorkspace();
        let yOffset = 50;
        let xmlStr = `<xml xmlns="https://developers.google.com/blockly/xml">`;
        let count = 0;

        for (const blockDef of extInfo.blocks) {
          if (typeof blockDef === 'string') continue;
          const info = blockDef.info || blockDef;
          if (!info || !info.opcode) continue;
          if (info.blockType === 'button' || info.blockType === BlockType.BUTTON || info.hideFromPalette) continue;

          const fullOpcode = `${extId}_${info.opcode}`;
          xmlStr += `<block type="${fullOpcode}" x="20" y="${yOffset}">`;
          
          if (info.arguments) {
            for (const argName in info.arguments) {
              const arg = info.arguments[argName];
              let val = '';
              if (arg.defaultValue !== undefined) {
                 val = arg.defaultValue;
                 if (typeof val === 'object' && val !== null) val = val.value || Object.values(val)[0] || '';
              } else if (arg.menu && extInfo.menus && extInfo.menus[arg.menu]) {
                 const menu = extInfo.menus[arg.menu];
                 if (Array.isArray(menu) && menu.length > 0) {
                     val = typeof menu[0] === 'object' ? (menu[0].value || '') : menu[0];
                 } else if (typeof menu === 'function') {
                     const items = menu();
                     if (items && items.length > 0) val = typeof items[0] === 'object' ? (items[0].value || '') : items[0];
                 }
              }

              let shadowType = 'text';
              let fieldName = 'TEXT';
              if (['number', 'angle', 'int', 'matrix'].includes(arg.type)) {
                  shadowType = 'math_number'; fieldName = 'NUM';
              } else if (arg.type === 'color') {
                  shadowType = 'colour_picker'; fieldName = 'COLOUR';
              } else if (arg.type === 'note') {
                  shadowType = 'note'; fieldName = 'NOTE';
              }
              
              xmlStr += `<value name="${argName}"><shadow type="${shadowType}"><field name="${fieldName}">${this.escapeXml(val)}</field></shadow></value>`;
            }
          }
          xmlStr += `</block>`;
          yOffset += 80;
          count++;
        }
        xmlStr += `</xml>`;

        if (count === 0) {
            this.showToast(translate({ id: 'toast.noBlocks' }), 'info');
            return;
        }

        const dom = BlocklyRef.Xml.textToDom(xmlStr);
        BlocklyRef.Xml.domToWorkspace(dom, workspace);
        
        if (this._runtime.requestUpdateTarget) {
            const target = this._runtime.getEditingTarget();
            if (target) this._runtime.requestUpdateTarget(target.id);
        }
        
        this.showToast(translate({ id: 'toast.success.generate' }).replace('#COUNT#', count), 'success');
      } catch (error) {
        console.error(error);
        this.showToast(translate({ id: 'toast.error' }).replace('#MSG#', error.message), 'error');
      }
    }

    async deleteAllBlocks() {
      const extId = await this.promptExtensionId('delete');
      if (!extId) return;

      if (!this.getExtensionInfo(extId)) {
        this.showToast(translate({ id: 'toast.noExt' }), 'error');
        return;
      }

      let totalDeleted = 0;
      const targets = this._runtime.targets;

      for (const target of targets) {
        const blocks = target.blocks;
        if (!blocks || !blocks._blocks) continue;

        const topLevelBlocksToDelete = [];
        for (const blockId in blocks._blocks) {
          const block = blocks._blocks[blockId];
          if (block.opcode && block.opcode.startsWith(`${extId}_`) && !block.parent) {
            topLevelBlocksToDelete.push(blockId);
          }
        }

        let targetDeletedCount = 0;
        for (const blockId of topLevelBlocksToDelete) {
          try {
            if (blocks._blocks[blockId]) {
              blocks.deleteBlock(blockId);
              targetDeletedCount++;
            }
          } catch (e) {
            console.warn(`删除 VM 积木 ${blockId} 时发生警告:`, e);
          }
        }
        
        totalDeleted += targetDeletedCount;
        
        if (targetDeletedCount > 0 && this._runtime.requestUpdateTarget) {
           this._runtime.requestUpdateTarget(target.id);
        }
      }

      try {
        const BlocklyRef = typeof Blockly !== 'undefined' ? Blockly : (typeof ScratchBlocks !== 'undefined' ? ScratchBlocks : null);
        if (BlocklyRef && BlocklyRef.getMainWorkspace) {
          const workspace = BlocklyRef.getMainWorkspace();
          if (workspace) {
            const allBlocks = workspace.getAllBlocks().slice(); 
            for (const block of allBlocks) {
              if (block && block.type && block.type.startsWith(`${extId}_`)) {
                try {
                  if (!block.disposed) {
                    block.dispose(false, true);
                  }
                } catch (e) {
                  console.warn(`清理 UI 积木 ${block.type} 时发生警告:`, e);
                }
              }
            }
            try {
              if (workspace.refreshToolboxSelection) workspace.refreshToolboxSelection();
              if (workspace.render) workspace.render();
            } catch (e) {
              console.warn('刷新工作区时发生警告:', e);
            }
          }
        }
      } catch (e) {
        console.warn('清理 Blockly 工作区时发生警告:', e);
      }

      if (totalDeleted > 0) {
        this.showToast(translate({ id: 'toast.success.delete' }).replace('#COUNT#', totalDeleted), 'success');
      } else {
        this.showToast(translate({ id: 'toast.noBlocksToDelete' }), 'info');
      }
    }
  }

  Scratch.extensions.register(new ExtensionBlockManager(runtime));
})(Scratch);