// =================== Scratch extension =================== 

// auto arguments is a little over complicated to deduce argument count

const letter = i => String.fromCharCode(97+i)
function getrer() {
window.SpeechRecognition = window.SpeechRecognition
                        || window.webkitSpeechRecognition;
speechRecognition = window.SpeechRecognition

recognition = new speechRecognition()

recognition.continuous = true
recognition.start()


recognition.onresult = function(event) {

 var current = event.resultIndex;

 transcript = event.results[current][0].transcript
 
 rer = content += transcript
}
return rer
}
const auto_block = (blockType, opcode, text, args) => ({
	blockType,
	opcode,
	text,
	arguments: Object.fromEntries(
		new Array(text.split('[').length-1).fill().map((_,i)=> [
			letter(i), {
				type: (args && args[i]) || "string", 
				defaultValue: " "
			}
		])
	)
})
const mat_reporter_f = f => o => to_s(f(...new Array(Object.entries(o).length).fill().map((_,i)=> from_s(o[letter(i)]))))

class ScratchMath {
	constructor(runtime) {
	}

	getInfo() {
	    return {
		// fill    
		color1: '#ff6680',
		// outline
		color2: '#ff3355',
	    	id: "math",
	    	name: "Speech",
	    	blocks: [
		auto_block('reporter', "speech", "羊 text"),
	        {
	        	blockType: 'command',
	        	opcode: 'Start',
	        	text: '羊 start/stop',
	        	arguments: {
	        	}
	        },
	        '---',

	        
	    	],
	    	
	    }
	}

	speech({}) {
	return getrer()
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
