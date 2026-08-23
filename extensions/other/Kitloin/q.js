try {
	// =================== Scratch extension =================== 
	async function completePrompt(prompt) {
	  try {
	    const apiKey = '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'; // replace with your actual API key
	    const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions'; // API endpoint for the Davinci Codex engine

	    const response = await fetch(apiUrl, {
	      method: 'POST',
	      headers: {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${apiKey}`,
	      },
	      body: JSON.stringify({
		prompt,
		max_tokens: 100,
		n: 1,
		stop: '\n',
	      }),
	    });

	    const data = await response.json();
	    const { choices } = data?.choices?.[0] || {};

	    return choices?.[0]?.text || '';
	  } catch (error) {
	    alert(error);
	    return null;
	  }
	}

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
		}

		getInfo() {
		    return {
			id: "math",
			name: "AI",
			blocks: [
			auto_block('reporter', "completePrompt", "羊 complete [a]"),
			{
				blockType: 'command',
				opcode: 'nul',
				text: 'null',
				arguments: {
					a: {
						type: "string",
						defaultValue: " "
					},
					b: {
						type: "string",
						defaultValue:" ",
					}
				}
			'---',
			],
		    }
		}
		completePrompt({a}) {
		return generateText(a)    
	}
		nul() {
		console.log()
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
	} catch(err) { alert(err) } 
