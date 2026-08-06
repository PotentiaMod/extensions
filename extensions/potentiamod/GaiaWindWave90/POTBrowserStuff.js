// Name: Browser Stuff
// ID: POTBrowserStuff
// Description: Some stuff for the web browser.
// By: GaiaWindWave90 <https://github.com/gaiawindwave90/>
(function (Scratch) {
	"use strict";
    
	const IsFireFox = (navigator.userAgent.includes('Firefox')) ? true : null
    const IsSafari = (navigator.userAgent.includes('Safari')) ? true : null
	
	class BrowserStuff {
	  getInfo() {
		return {
		  id: "browserstuff",
		  name: "Browser Stuff",
		  color1: "#5E3E9E",
		  blocks: [
			{
          opcode: 'isOnline',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'Online?',
          disableMonitor: true,
        },
		{
          opcode: 'cookiesEnabled',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'Cookies enabled?',
          disableMonitor: true,
        },
		{
          opcode: 'showurl',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Show full URL',
          disableMonitor: true,
        },
		{
          opcode: 'browseragent',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Show browser agent',
          disableMonitor: true,
        },
		{
          opcode: 'title',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Show page title',
          disableMonitor: true,
        },
		         {
                    opcode: 'changetitle',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Change page title to [TITLE]',
                    arguments: {
                        TITLE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'PotentiaMod.Net'
                        }
                     }
                  },
		         {
                    opcode: 'alertmsg',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Show alert: [MSG]',
                    arguments: {
                        MSG: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'PotentiaMod rocks!'
                        }
                     }
                  },
                  {
                    opcode: 'returnpromptmsg',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Show prompt: [FAQ] Value: [VALUE]',
                    arguments: {
                        FAQ: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Enter your name here:'
                        },
                        VALUE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: ''
                        }
                     }
                  },
                  {
                    opcode: 'promptmsg',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Show prompt: [FAQ] Value: [VALUE]',
                    arguments: {
                        FAQ: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Enter your name here:'
                        },
                        VALUE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: ''
                        }
                     }
                  },
                  {
                    opcode: 'confirmmsg',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'Show confirmation: [FAQ]',
                    arguments: {
                        FAQ: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Have you seen that movie?'
                        }
                     }
                  },
        {
          opcode: 'hostname',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Hostname',
          disableMonitor: true,
        },
		{
          opcode: 'language',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Language',
          disableMonitor: true,
        },
		{
          opcode: 'pathname',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Path name',
          disableMonitor: true,
        },
		{
          opcode: 'protocol',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Protocol',
          disableMonitor: true,
        },
		{
          opcode: 'port',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Port Number',
          disableMonitor: true,
        },
		{
          opcode: 'screenwidth',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Screen width',
          disableMonitor: true,
        },
		{
          opcode: 'screenheight',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Screen height',
          disableMonitor: true,
        },
			////
		  ],
		};
	  }
      ////
	  isOnline() {
        // Modern Node.js has a navigator object but does .onLine === undefined
        if (typeof navigator === 'object' && typeof navigator.onLine === 'boolean') {
            return navigator.onLine;
        }
        // We're running in some non-browser environment. We probably have internet.
        return true;
    }
  
  cookiesEnabled() {
     return navigator.cookieEnabled;
  }
  hostname() {
     return location.hostname;
  }
  title() {
     return document.title;
  }
  changetitle(args, util) {
     document.title = args.TITLE;
  }
  language() {
     return location.language;
  }
    language() {
     return navigator.language;
  }
    pathname() {
     return location.pathname;
  }
  protocol() {
     return location.protocol;
  }
  port() {
     return location.port;
  }
  screenwidth() {
     return screen.width;
  }
    screenheight() {
     return screen.height;
  }
  showurl() {
     return document.URL;
  }
  browseragent() {
     return navigator.userAgent;
  }
       alertmsg(args, util) {
            window.alert(args.MSG);
        }
       returnpromptmsg(args, util) {
            return window.prompt(args.FAQ, args.VALUE);
        }
        promptmsg(args, util) {
            window.prompt(args.FAQ, args.VALUE);
        }
        confirmmsg(args, util) {
            return window.confirm(args.FAQ);
        }
	  ////
	  
	}
	Scratch.extensions.register(new BrowserStuff());
  })(Scratch);
  