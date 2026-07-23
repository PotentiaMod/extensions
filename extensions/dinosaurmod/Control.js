(function(Scratch) {
    const variables = {};
    class Extension {
        getInfo() {
            return {
              id: "CONTROL",
              name: "Control Category",
              color1: '#ffab19',
              color2: '#cf8b17',
              blocks: [
                {
                    blockType: Scratch.BlockType.XML,
                    xml: `<block type="control_javascript_command">
                    <value name="JS">
                        <shadow type="text">
                            <field name="TEXT">alert('hello!')</field>
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