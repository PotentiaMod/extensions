let style = document.createElement("style");style.innerHTML = `[class*="blocks_blocks_"] .blocklyToolboxDiv{width:310px;height:auto !important}.scratchCategoryMenu{width:100%;columns:2;column-gap:0.5rem;padding:0.25rem}.scratchCategorySecondMenu{columns:1;display:grid;grid-template-columns:repeat(2, 1fr);padding-bottom:2.25rem}.scratchCategorySecondMenu:empty{padding-top:0;padding-bottom:2rem}.scratchCategoryMenuItem{display:inline-flex;width:100%;padding:0.25rem;border-radius:0.875rem}.scratchCategoryItemBubble,.scratchCategoryItemIcon{margin:0;margin-inline-end:0.5rem}.scratchCategoryMenuItemLabel{flex:1;display:flex;align-items:center}[class*="gui_extension-button-container_"]{top:var(--sa-add-extension-button-y);bottom:auto;margin-inline-start:0.5rem;width:calc(308px - 1rem);height:calc(1.75rem - 2px);background-color:transparent;border-color:var(--editorDarkMode-border, rgba(0, 0, 0, 0.15))}[dir] [class*="gui_extension-button-container_"]{border-radius:0.25rem}[class*="gui_extension-button-container_"]:hover{background-color:var(--editorDarkMode-accent, white)}[class*="gui_extension-button-container_"]::before{display:none}[class*="gui_extension-button_"]{display:flex;align-items:center;padding-inline:0}[class*="gui_extension-button-icon_"]{filter: var(--editorDarkMode-categoryMenu-invertedFilter, brightness(0.4))}[class*="gui_extension-button-container_"]:hover [class*="gui_extension-button-icon_"]{filter: var(--editorDarkMode-accent-invertedFilter, brightness(0.4))}.sa-add-extension-label{color:var(--editorDarkMode-categoryMenu-text, #575e75);font-size:0.65rem}[class*="gui_extension-button-container_"]:hover .sa-add-extension-label{color:var(--editorDarkMode-accent-text, #575e75);font-size:0.65rem}[class*="gui_tabs_"]{--sa-flyout-width:310px;--sa-category-width:0}.sa-flyout-placeHolder{top:calc(var(--sa-flyout-y))}`;
document.body.appendChild(style);void(0);
// =================== Scratch extension =================== 

// auto arguments is a little over complicated to deduce argument count

const letter = i => String.fromCharCode(97+i)

const auto_block = (blockType, opcode, text, args) => ({
	blockType,
	opcode,
	text,
	arguments: Object.fromEntries(
		new Array(text.split('[').length-1).fill().map((_,i)=> [
			letter(i), {
				type: (args && args[i]) || "number", 
				defaultValue: " "
			}
		])
	)
})
const mat_reporter_f = f => o => to_s(f(...new Array(Object.entries(o).length).fill().map((_,i)=> from_s(o[letter(i)]))))

class ScratchMath {

	constructor(runtime) {
		this.runtime = runtime
	/*	this.tempElem = document.createElement("link")
			this.tempElem.rel = "stylesheet"
			this.tempElem.type = "text/css"
			this.tempElem.href = "https://scratchjs.crossscar.repl.co/styles.css"
			document.head.appendChild(this.tempElem)
			
			this.consoleElem = document.createElement("div")
			this.consoleElems = {}
			this.consoleElem.classList.add("ScratchJS-console")
			this.consoleElems.clearBtn = document.createElement("button")
			this.consoleElems.clearBtn.classList.add("ScratchJS-console-clear")
			this.consoleElems.clearBtn.innerHTML = "X"
			this.consoleElems.clearBtn.title = "Clear Console"
			this.consoleElem.appendChild(this.consoleElems.clearBtn)
			document.querySelector(".stage-wrapper_stage-wrapper_2bejr").appendChild(this.consoleElem)

			this.consoleElems.clearBtn.addEventListener("click", () => {
				this.console.clear()
			}) */
	}

	getInfo() {
	    return {
	    	id: "math",
	    	name: "JS",
	    	blocks: [
		auto_block('reporter', "Fetch", "羊 fetch [a]"),
	        {
	        	blockType: 'command',
	        	opcode: 'EvalCmd',
	        	text: '羊 run [a]',
	        	arguments: {
	        		a: {
	        			type: "string",
	        			defaultValue: " "
	        		},
	        		b: {
	        			type: "string",
	        			defaultValue:" "
	        		}
	        	}
	        },

	        '---',

	        
	    	],
	    	
	    }
	}

	EvalCmd({a}) {
		try {
eval(a)
  

} catch (err) {

  alert(err)

}
	}

	Fetch({a}) {
    let file = a;
    return fetch(file)
        .then(x => x.text())
        .then(y => {
            let ans = y;
            return ans;
        });
}
	
}

// ============== globalize vm and load extension ===============

function findReactComponent(element) {
    let fiber = element[Object.keys(element).find(key => key.startsWith("__reactInternalInstance$"))];
    if (fiber == null) return null;

    const go = fiber => {
        let parent = fiber.return;
        while (typeof parent.type == "string") {
            parent = parent.return;
        }
        return parent;
    };
    fiber = go(fiber);
    while(fiber.stateNode == null) {
        fiber = go(fiber);
    }
    return fiber.stateNode;
}

window.vm = findReactComponent(document.getElementsByClassName("stage-header_stage-size-row_14N65")[0]).props.vm;

(function() {
    var extensionInstance = new ScratchMath(window.vm.extensionManager.runtime)
    var serviceName = window.vm.extensionManager._registerInternalExtension(extensionInstance)
    window.vm.extensionManager._loadedExtensions.set(extensionInstance.getInfo().id, serviceName)
})()
