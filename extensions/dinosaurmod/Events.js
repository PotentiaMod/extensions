(function(Scratch) {
    const variables = {};
    class Extension {
        getInfo() {
            return {
              id: "EVENT",
              name: "Events Category",
              color1: '#ffbf00',
              color2: '#cc9900',
              blocks: [
                {
                    blockType: Scratch.BlockType.XML,
                    xml: `<block type="event_whenjavascript">
                    <value name="JS">
                        <shadow type="text">
                            <field name="TEXT">false</field>
                        </shadow>
                    </value>
                </block>`,
                },
                /*
                {
                  opcode: 'a',
                  text: 'command',
                  blockType: Scratch.BlockType.COMMAND,
                  arguments: {}
                },
                {
                  opcode: 'b',
                  text: 'reporter',
                  blockType: Scratch.BlockType.REPORTER,
                  arguments: {}
                }, 
                {
                  opcode: 'c',
                  text: 'boolean',
                  blockType: Scratch.BlockType.BOOLEAN,
                  arguments: {}
                },
                {
                  opcode: 'd',
                  text: 'hat',
                  blockType: Scratch.BlockType.HAT,
                  arguments: {}
                },
                */
              ]
            }
        }
        a() {
          
        }
        b() {
          
        }
        c() {
          
        }
        d() {
          
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);