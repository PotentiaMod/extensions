// Name: PotentiaMod Stuff
// ID: POTStuff
// Description: Something that I will try to do stuff on. Inspired by the AcidMod Test extension.
// By: GaiaWindWave90 <https://github.com/gaiawindwave90/>
(function (Scratch) {
	"use strict";
	
	 const vm = Scratch.vm;
  const runtime = vm.runtime
 
  
  const stopIcon =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAQlBMVEUAAAC/UFC8Q0OzTU24SEi4SEi3SEi4R0e4SEi4SEi4SEi4SEi7SUm8SUnMTk7MT0/OT0/PT0/gVVXiVVXsWVn///+CoOd2AAAAC3RSTlMAEBMUu7zLz9D8/dIXnJwAAAABYktHRBXl2PmjAAAAxklEQVRIx+3WwRKDIBAD0JWqVEOtWv7/W3twOqKwELzW3N9wYhORMMYiztgZUZMUAKxqmh5Kno/MG256nzI59Z2mB+BWH+XzUt5RhWoyQjFZkTQFkTBFERlCnAwlDoYUgaHFblpaeL86AK0MvNjMIABmT2cGIAAWniw3ucm/k9ovduEjXzgXtUfJmtrTt9VZzYH9FSB/xvfKZMsiLFmuko61zBTfucjL9RpXf6nEU2MhPxXS86J+kORmjz6V6seViOnG8oT7ApMcjsYZwhXCAAAAAElFTkSuQmCC";
	
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
    
	class POTStuff {
		constructor() {
			//Taken from 'Lily's More Events'
      runtime.shouldExecuteStopClicked = true;
      runtime.on("BEFORE_EXECUTE", () => {
        runTimer++;
        runtime.shouldExecuteStopClicked = false;

        runtime.startHats("POTStuff_always");
      });
	  runtime.on("PROJECT_START", () => {
        runTimer = 0;
      });
      runtime.on("PROJECT_STOP_ALL", () => {
        runTimer = 0;
        if (runtime.shouldExecuteStopClicked)
          queueMicrotask(() =>
            runtime.startHats("POTStuff_whenstopclicked")
          );
      });
      runtime.on("AFTER_EXECUTE", () => {
        runtime.shouldExecuteStopClicked = true;
      });
      const originalGreenFlag = vm.greenFlag;
      vm.greenFlag = function () {
        runtime.shouldExecuteStopClicked = false;
        originalGreenFlag.call(this);
      };
    }
		
	  getInfo() {
		return {
		  id: "POTStuff",
		  name: "PotentiaMod Stuff Extension",
		  color1: "#4800cc",
		  color2: "#16008A",
		  color3: "#7241CC",
		  blocks: [
		  
			{
          opcode: 'daysSincePokemonScarletViolet',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Days since Pokémon Scarlet and Violet',
		  disableMonitor: true,
		  extensions: ["colours_sensing"],
           },
		   
		    {
            opcode: "always",
            blockType: Scratch.BlockType.EVENT,
            text: 'Always',
            isEdgeActivated: false,
			extensions: ["colours_event"],
            },
			
			{
          opcode: 'showAllsprites',
          text: 'show all sprites',
          blockType: Scratch.BlockType.COMMAND,
		  extensions: ["colours_looks"],
          arguments: {}
        },
        {
          opcode: 'hideAllsprites',
          text: 'hide all sprites',
          blockType: Scratch.BlockType.COMMAND,
		  extensions: ["colours_looks"],
          arguments: {}
        },
			
			{
                    opcode: 'projectURL',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Project URL',
                    disableMonitor: true,
					extensions: ["colours_sensing"],
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
                    },
					extensions: ['colours_sensing']
                },
			
			{
                    opcode: 'executeJavascript',
                    blockType: BlockType.COMMAND,
                    text: 'Execute Javascript: [SCRIPT]',
                    arguments: {
                        SCRIPT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'alert("It\'s not what you think!");'
                        }
                    },
					extensions: ['colours_sensing']
                },
				
				 {
                    opcode: 'middle',
                    text: 'Go to the middle',
					extensions: ['colours_motion'],
                    blockType: BlockType.COMMAND,
                    disableMonitor: false
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
                  },
				  extensions: ["colours_control"],
                },
				
			{
            opcode: "whenstopclicked",
            blockType: Scratch.BlockType.EVENT,
            text: 'When [STOP] clicked',
            isEdgeActivated: false,
			arguments: {
              STOP: {
                type: Scratch.ArgumentType.IMAGE,
                dataURI: stopIcon,
              },
            },
			extensions: ["colours_event"],
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
	
	executeJavascript (args) {
        new Function(args.SCRIPT)();
    }
	
	projectURL() {
        return window.location.href;
    }
	
	showAllsprites (args, util) {
    const targets = Scratch.vm.runtime.targets;
    for (const target of targets) {
      if (!target.isStage) {
        target.setVisible(true)
      }
    }
  }
  hideAllsprites (args, util) {
    const targets = Scratch.vm.runtime.targets;
    for (const target of targets) {
      if (!target.isStage) {
        target.setVisible(false)
      }
    }
  }
  
  middle(args, util) {
        util.target.setXY(0, 0);
    }

	}
	Scratch.extensions.register(new POTStuff());
  })(Scratch);
  