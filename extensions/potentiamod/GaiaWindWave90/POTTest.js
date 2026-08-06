// Name: PotentiaMod Test
// ID: POTTest
// Description: Something that I will try to test on. Inspired by the AcidMod Test extension.
// By: GaiaWindWave90 <https://github.com/gaiawindwave90/>
(function (Scratch) {
	"use strict";
	
	 const vm = Scratch.vm;
  const runtime = vm.runtime
	
	 if (!Scratch.extensions.unsandboxed) {
    throw new Error('This example must run unsandboxed');
  }
	
	const BlockType = Scratch.BlockType;
    const ArgumentType = Scratch.ArgumentType;
    const Cast = Scratch.Cast;
	
	var runTimer = 0;
	var lastValues = {};
	
	 const variables = {};

  const WaitFacts = [
    '1000 Milliseconds = 1 Second',
    '60 Seconds = 1 Minute',
    '100 Seconds = 1 Minute and 40 Seconds',
    '60 Minutes = 1 Hour',
    '24 Hours = 1 Day',
    '7 Day = 1 Week',
    '4 Weeks = 1 Month',
    '12 Months = 1 Year',
    '10 Years = 1 Decade',
    '10 Decades = 1 Century',
  ];
  let DAYMENU = [
    'days',
    'weeks',
    'months'
  ];
  let MATHMENU = [
    'plus',
    'minus',
    'times',
    'divided by',
    'to the power of'
  ];
    
	class POTtest {
		constructor() {
			//Taken from 'Lily's More Events'
      runtime.shouldExecuteStopClicked = true;
      runtime.on("BEFORE_EXECUTE", () => {
        runTimer++;
        runtime.shouldExecuteStopClicked = false;

        runtime.startHats("POTtest_always");
      });
    }
		
	  getInfo() {
		return {
		  id: "POTtest",
		  name: "PotentiaMod Test Extension",
		  color1: "#4800cc",
		  color2: "#16008A",
		  color3: "#7241CC",
		  blocks: [
		  
			{
          opcode: 'daysSincePokemonScarletViolet',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Days since Pokémon Scarlet and Violet',
		  disableMonitor: true,
           },
		   
		    {
            opcode: "always",
            blockType: Scratch.BlockType.EVENT,
            text: 'Always',
            isEdgeActivated: false,
            },
			
			{
                    opcode: 'openUrl',
                    blockType: BlockType.COMMAND,
                    text: 'Open URL: [URL]',
                    arguments: {
                        URL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'https://potentiamod.github.io/'
                        }
                    }
                },
			
				
			{
                  opcode: 'waitMinutes',
                  text: 'Wait [MINS] minutes (may not work)',
                  blockType: Scratch.BlockType.COMMAND,
                  arguments: {
                    MINS: {
                      type: Scratch.ArgumentType.NUMBER,
                      defaultValue: '1'
                    }
                  }
                },
		/////
			
		  ],
		  menus: {
                DAYMENU: {
                  acceptReporters: false,
                  items: DAYMENU
                },
                MATHMENU: {
                  acceptReporters: false,
                  items: MATHMENU
                },
              }
		};
	  }
  
	  daysSincePokemonScarletViolet (args, util){
const msPerDay = 24 * 60 * 60 * 1000;
        const start = new Date(2022, 10, 18); // Months are 0-indexed.
        const today = new Date();
        const dstAdjust = today.getTimezoneOffset() - start.getTimezoneOffset();
        let mSecsSinceStart = today.valueOf() - start.valueOf();
        mSecsSinceStart += ((today.getTimezoneOffset() - dstAdjust) * 60 * 1000);
        return mSecsSinceStart / msPerDay;
      }
	  
	    waitMinutes (args, util) {
        if (util.stackTimerNeedsInit()) {
            const duration = Math.max(0, 60000 * Cast.toNumber(args.MIN));

            util.startStackTimer(duration);
            this.runtime.requestRedraw();
            util.yield();
        } else if (!util.stackTimerFinished()) {
            util.yield();
        }
    }
	
	openUrl (args) {
        window.open(args.URL, '_blank');
    }

	}
	Scratch.extensions.register(new POTtest());
  })(Scratch);
  