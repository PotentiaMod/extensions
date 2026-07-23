(function(Scratch) {
    const variables = {};
    let ScratchVM = Scratch.vm
    let runtime = ScratchVM.runtime
    const toothlessingTargets = {};
    const toothlessVideoDivs = [];
    const GeneratedCode = Math.round(Math.random(1000, 9999));
    class Extension {
        getInfo() {
            return {
              id: "dvjf",
              name: "fleef",
              blocks: [
                {
                  opcode: 'TOOTHLESSBEDANCIN',
                  text: 'u now have to whatch 1 hourss of toofless dancing',
                  blockType: Scratch.BlockType.COMMAND,
                  arguments: {}
                },
                {
                  opcode: 'BREAKALL',
                  text: 'BREAK WORKSPACE ONCE',
                  blockType: Scratch.BlockType.COMMAND,
                  arguments: {}
                },
                {
                  opcode: 'findoutimpossibly',
                  text: 'FIND TE CORRECT CODE (RANDOMIZED) [CODE]',
                  blockType: Scratch.BlockType.REPORTER,
                  arguments: {
                    CODE: {
                      type: Scratch.ArgumentType.NUMBER,
                      defaultValue: 3434
                    }
                  }
                },
                {
                  opcode: 'whengay',
                  text: 'when someone is gay',
                  blockType: Scratch.BlockType.HAT,
                  arguments: {}
                },
              ]
            }
        }
        TOOTHLESSBEDANCIN(_, util, __, ___, options) {
          const targetId = util.target.id;
            if (toothlessingTargets[targetId]) return;
            toothlessingTargets[targetId] = true;
            const toothless = "https://www.youtube.com/embed/4xnsmyI5KMQ";
            return new Promise(resolve => {
                const div = document.createElement("div");
                div.style = "position:absolute;left:0px;top:0px;width:100%;height:100%;background:black;z-index:9999999";
                document.body.append(div);

                toothlessVideoDivs.push(div);

                const video = document.createElement("video");
                video.style = "position:absolute;left:0px;top:0px;width:100%;height:100%;";
                video.volume = 0.5;
                if (options) {
                    video.playbackRate = options.speed;
                    console.log(video.playbackRate);
                }
                video.autoplay = true;
                video.src = toothless;
                div.append(video);

                video.onerror = () => {
                    toothlessVideoDivs.splice(toothlessVideoDivs.indexOf(div), 1);
                    div.remove();
                    toothlessingTargets[targetId] = false;
                    resolve();
                };

                video.onended = () => {
                    toothlessVideoDivs.splice(toothlessVideoDivs.indexOf(div), 1);
                    div.remove();
                    toothlessingTargets[targetId] = false;
                    resolve();
                };
            });
        }
        BREAKALL() {
          return ScratchVM.refreshWorkspace();
        }
        findoutimpossibly(args) {
          switch (args.CODE) {
            case GeneratedCode: return "HOW THE HECKIN FLUFFY TARNATION OF MAC AND CHEESE, RABIES BABIES, JEANS BEANS, FLIES LIES, DID YOU GET THAT RIGHT!?!?!?!?!?!?!?!?!" 
            default: return "WRONG!! haha stinky poo poo dr bob eae ripoff bing bong doesn't know the code!";
          }
        }
        whengay() {
          return true;
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);