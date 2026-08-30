(function(Scratch, vm, runtime) {
	function count(id) {
		let count=0;
		for (const target of runtime.targets) {
			for (const block of Object.values(target.blocks._blocks)) {
				if (block.opcode.startsWith(id+"_")){
					count++;
				}
			}
		}
		return count;
	}
	function removeExtension(id) {
		let count=0;
		for (const target of runtime.targets) {
			for (const block of Object.values(target.blocks._blocks)) {
				if (block.opcode.startsWith(id+"_")){
					deleteBlock(target, block.id);
					count++;
				}
			}
		}
		return count;
	}
	function deleteBlock(target, blockId) {
		if (target === vm.editingTarget && Scratch.gui) {
			Scratch.gui.getBlockly().then(ScratchBlocks => {
				ScratchBlocks.getMainWorkspace().getBlockById(blockId)?.dispose(true, false);
			});
		} else {
			target.blocks.deleteBlock(blockId);
		}
	}
	class ExtensionsManager {
		constructor(_runtime){
			runtime=_runtime;
			if(!runtime) throw new Error();
			vm=runtime.extensionManager.vm;
			if(!vm) throw new Error();
			this._blocks=[];
			this._blocks2=[];
			this.show_ext=null;
			this.show_taggedExt=null;
			this.search_value=null;
			this.loading=false;
			runtime.on("EXTENSION_ADDED", ()=>setTimeout(this.update_blocks.bind(this),500));
			const _getSandboxMode=runtime.extensionManager.securityManager.getSandboxMode;
			runtime.extensionManager.securityManager.getSandboxMode=function(url){
				let mode=prompt(`Choose from three loading modes: unsandboxed, worker, or iframe. Unsandboxed (non-sandboxed) is recommended.）${url}`,"unsandboxed");
				if(mode===null) return _getSandboxMode.call(runtime.extensionManager,url);
				return mode;
			};
			this._getSandboxMode=_getSandboxMode;
			const _loadExtensionURL=runtime.extensionManager.loadExtensionURL;
			runtime.extensionManager.loadExtensionURL=function(url){
				return _loadExtensionURL.call(this,url).catch(e=>{
					alert(`Extension failed to load. ${e}\n${url}`);
					throw e;
				});
			};
			this._loadExtensionURL=_loadExtensionURL;
		}
		getInfo() {
			return {
				id: 'ExtensionsManager',
				name: 'Extension Management',
				docsURI: 'https://assets.ccw.site/extension/ExtensionsManager',
				blocks:[
					{
						opcode: 'saveProjectSb3',
						blockType: Scratch.BlockType.COMMAND,
						text: 'Save work',
					},
					{
						func: 'load',
						blockType: Scratch.BlockType.BUTTON,
						text: this.loading===true?'loading':this.loading?String(this.loading):'Load extension',
					},
					{
						func: 'remove',
						blockType: Scratch.BlockType.BUTTON,
						text: 'Remove extension',
					},
					{
						func: 'update',
						blockType: Scratch.BlockType.BUTTON,
						text: 'Update Extensions',
					},
					{
						func: 'geturl',
						blockType: Scratch.BlockType.BUTTON,
						text: 'Get the URL of a loaded extension.',
					},
					{
						func: 'geturl2',
						blockType: Scratch.BlockType.BUTTON,
						text: 'Get the URL for the CCW extension marketplace extension.',
					},
					{
						func: 'count',
						blockType: Scratch.BlockType.BUTTON,
						text: 'Get the number of blocks used',
					},
					{
						blockType: Scratch.BlockType.LABEL,
						text: 'Loaded extensions',
					},
					{
						func: 'update_blocks',
						blockType: Scratch.BlockType.BUTTON,
						text: 'refresh',
					},
					{
						func: 'search',
						blockType: Scratch.BlockType.BUTTON,
						text: 'search',
					},
					{
						blockType: Scratch.BlockType.LABEL,
						text: '↓↓↓',
					},
					...this._blocks,
					{
						blockType: Scratch.BlockType.LABEL,
						text: '↑↑↑',
					},
					{
						blockType: Scratch.BlockType.LABEL,
						text: 'Markup extensions',
					},
					{
						func: 'push',
						blockType: Scratch.BlockType.BUTTON,
						text: 'Add to',
					},
					{
						func: 'search',
						blockType: Scratch.BlockType.BUTTON,
						text: 'search',
					},
					{
						blockType: Scratch.BlockType.LABEL,
						text: '↓↓↓',
					},
					...this._blocks2,
					{
						blockType: Scratch.BlockType.LABEL,
						text: '↑↑↑',
					},
				]
			}
		}
		load(url,mode){
			url=url??prompt("Enter extended URL");
			if(url===null) return null;
			mode=mode??prompt("Choose from three loading modes: unsandboxed, worker, or iframe. Unsandboxed (non-sandboxed) is recommended.","unsandboxed");
			if(mode===null) return null;
			this.loading=true;
			runtime.emit("TOOLBOX_EXTENSIONS_NEED_UPDATE");
			return runtime.extensionManager.loadExtensionURL.call(
				new Proxy(runtime.extensionManager, {
					get(target, property) {
						if(property==="securityManager"){
							return new Proxy(Reflect.get(target, property), {
								get(target2, property2) {
									if(property2==="getSandboxMode") return url=>mode;
									return Reflect.get(target2, property2);
								}
							});
						}
						return Reflect.get(target, property);
					}
				}),
				url
			).then(()=>{
				this.loading=false;
				runtime.emit("TOOLBOX_EXTENSIONS_NEED_UPDATE");
			}).catch((e)=>{
				this.loading=e;
				runtime.emit("TOOLBOX_EXTENSIONS_NEED_UPDATE");
				setTimeout(()=>{
					this.loading=false;
					runtime.emit("TOOLBOX_EXTENSIONS_NEED_UPDATE");
				}, 5000);
			});
		}
		copy(text){
			return navigator.clipboard.writeText(text).then(e=>alert("Copied successfully.")).catch(e=>prompt("copy",text));
		}
		remove(id){
			id=id??prompt("Enter extension ID");
			if(id===null) return null;
			alert(`Successfully removed ${removeExtension(id)}个积木`);
			vm.refreshWorkspace();
		}
		update(id,url){
			id=id??prompt("Enter extension ID");
			if(id===null) return null;
			url=url??prompt("Enter extended URL",JSON.parse(vm.toJSON())["extensionURLs"]?.[id]??"");
			if(url===null) return null;
			const _toJSON=vm.toJSON;
			vm.toJSON=function(){
				let json=JSON.parse(_toJSON.call(this));
				json["extensionURLs"][id]=url;
				return JSON.stringify(json);
			}
			alert("Update successful; please save and refresh the page.");
		}
		geturl(id){
			try{
				id=id??prompt("Enter extension ID");
				if(id===null) return null;
				prompt(id,JSON.parse(vm.toJSON())["extensionURLs"]?.[id]??"Retrieval failed; please check if the ID is correct and drag out a block.");
			}catch(e){
				alert(e);
			}
		}
		async geturl2(id,version,url){
			try{
				id=id??prompt("Enter extension ID");
				if(id===null) return null;
				let res=await fetch("https://bfs-web.ccw.site/extensions/"+id);
				if(!res.ok) throw"Retrieval failed";
				let json=await res.json();
				let versions=json.body.versions;
				version=version??prompt("Enter the version to retrieve.",versions[0].version);
				if(version===null) return null;
				let assets=versions.filter(asset=>asset.version===version);
				if(assets.length!=1) if(confirm("Search failed")) return await this.geturl2.call(this,id);
				url=url??prompt("Load immediately?",assets[0].assetUri);
				if(url===null) return null;
				return this.load.call(this, url);
			}
			catch(e){
				if(confirm(e.message)) return await this.geturl2.call(this);
			}
		}
		count(id) {
			id=id??prompt("Enter extension ID");
			if(id===null) return null;
			alert(`total${count(id)} building blocks`);
		}
		search(value){
			value=value??prompt("search", this.search_value??"");
			this.search_value=value || null;
			this.update_blocks.call(this,true);
		}
		update_blocks(search){
			this._blocks=[];
			if(!search) this.search_value=null;
			for(let info of runtime._blockInfo) if(
				(this.search_value===null) ||
				info.id.toLowerCase().includes(this.search_value.toLowerCase()) ||
				info.name.toLowerCase().includes(this.search_value.toLowerCase())
			){
				this._blocks.push({	
					func: 'loadedext_'+info.id,
					blockType: Scratch.BlockType.BUTTON,
					text: `${this.show_ext===info.id?"▽":"▷"} ${info.name}(${info.id})`,
				});
				ExtensionsManager.prototype['loadedext_'+info.id]=()=>{
					if(this.show_ext===info.id) this.show_ext=null;
					else this.show_ext=info.id;
					this.update_blocks.call(this);
				};
				if(this.show_ext===info.id) ["copy","remove","update","geturl","count"].forEach((value, index)=>{
					this._blocks.push({	
						func: `loadedext_${value}`,
						blockType: Scratch.BlockType.BUTTON,
						text: `${["Copy ID, Remove, Update, Get URL, Get number of blocks used"][index]}`,
					});
					ExtensionsManager.prototype[`loadedext_${value}`]=()=>{
						return this[value].call(this, info.id);
					};
				});
				this._blocks.push(false ? "---" : this.XML("sep", `<sep gap="20"/>`));
			}
			this._blocks2=[];
			for(let [name, url] of Object.entries(this.getTaggedExtensions())) if(
				(this.search_value===null) ||
				name.toLowerCase().includes(this.search_value.toLowerCase())
			){
				this._blocks2.push({	
					func: 'taggedExt_'+name,
					blockType: Scratch.BlockType.BUTTON,
					text: `${this.show_taggedExt===name?"▽":"▷"} ${name}`,
				});
				ExtensionsManager.prototype['taggedExt_'+name]=()=>{
					if(this.show_taggedExt===name) this.show_taggedExt=null;
					else this.show_taggedExt=name;
					this.update_blocks.call(this);
				};
				if(this.show_taggedExt===name) ["load","rename","update","delete","download","copy"].forEach((value, index)=>{
					this._blocks2.push({	
						func: `loadedext_${value}`,
						blockType: Scratch.BlockType.BUTTON,
						text: `${["Load","Rename","Update","Delete","Download","Copy"][index]}`,
					});
					ExtensionsManager.prototype[`loadedext_${value}`]=()=>{
						this[`taggedExt_${value}`].call(this, name, url);
						this.update_blocks.call(this);
					};
				});
				this._blocks2.push(false ? "---" : this.XML("sep", `<sep gap="20"/>`));
			}
			runtime.emit("TOOLBOX_EXTENSIONS_NEED_UPDATE");
			return [this._blocks,this._blocks2];
		}
		async push(name){
			let storage=this.getTaggedExtensions();
			if(confirm("Select mode: choose Cancel to load from a URL, or Confirm to load from a file.")){
				let defaultvalue;
				await new Promise((resolve, reject) => {
					const input = document.createElement('input');
					input.type = 'file';
					input.accept = ".js";
					input.style.display = 'none';
					input.click();
					input.addEventListener('change',(e) => {
						if (!e.target.files) reject(null);
						else resolve(e.target.files[0]);
					},{ once: true });
					input.addEventListener("cancel",(e)=>reject(null),{once:true});
				}).then(file=>new Promise((resolve, reject)=>{
					defaultvalue=file.name;
					const reader=new FileReader();
					reader.onload=()=>resolve(reader.result);
					reader.onerror=reject;
					reader.readAsText(file);
				})).then(text=>new Promise((resolve, reject)=>{
					const reader=new FileReader();
					reader.onload=()=>resolve(reader.result);
					reader.onerror=reject;
					reader.readAsDataURL(new Blob([text], {type:"application/javascript"}));
				})).then(url=>{
					name=name??prompt("Enter file extension", defaultvalue);
					if(name===null) return null;
					storage[name]=url;
				}).catch(e=>{
					if(e!==null) alert(e);
					throw e;
				});
			}
			else{
				name=name??prompt("Enter file extension")
				if(name===null) return null;
				Promise.resolve(storage[name]=prompt("Enter extended URL", storage[name])??storage[name]);
			}
			localStorage.setItem('ExtensionsManager_TaggedExtensions', JSON.stringify(storage));
			this.update_blocks.call(this);
		}
		getTaggedExtensions(){
			try{
				let storage=JSON.parse(localStorage.getItem('ExtensionsManager_TaggedExtensions'));
				return storage??{};
			}
			catch{
				return {};
			}
		}
		taggedExt_load(name, url){
			return this.load.call(this, url);
		}
		taggedExt_rename(name, url, name2){
			let storage=this.getTaggedExtensions();
			name2=name2??prompt("Enter a new extension", name)
			if(name2===null) return null;
			if(name2!==name){
				storage[name2]=storage[name];
				delete storage[name];
			}
			localStorage.setItem('ExtensionsManager_TaggedExtensions', JSON.stringify(storage));
		}
		taggedExt_update(name, url){
			return this.push(name);
		}
		taggedExt_delete(name, url){
			let storage=this.getTaggedExtensions();
			if(confirm("Are you sure you want to delete this?")){
				delete storage[name];
			}
			localStorage.setItem('ExtensionsManager_TaggedExtensions', JSON.stringify(storage));
		}
		taggedExt_download(name, url){
			const link = document.createElement("a");
			link.href = url;
			link.download = name;
			document.body.appendChild(link);
			link.click();
			link.remove();
		}
		taggedExt_copy(name, url){
			this.copy(name);
		}
		saveProjectSb3(){
			return vm.saveProjectSb3().then(URL.createObjectURL).then(open).catch(e=>"不支持");
		}
		XML(opcode, xml){
			return {
				opcode: opcode??"xml",
				blockType: Scratch.BlockType.XML,
				xml,
			};
		}
	}
	if(Scratch?.vm?.runtime) Scratch.extensions.register(new ExtensionsManager(Scratch.vm.runtime));
	else window.tempExt = {
		Extension: ExtensionsManager,
		info: {
			name: "Extension Manager",
			extensionId: 'ExtensionsManager',
			featured: true,
			disabled: false,
		},
	};
})(Scratch);