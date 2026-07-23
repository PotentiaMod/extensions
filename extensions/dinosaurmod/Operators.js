(function(Scratch) {
    const variables = {};
    class Extension {
        getInfo() {
            return {
              id: "OPERATORS",
              name: "Operators Category",
              color1: '#59c059',
              color2: '#389438',
              blocks: [
                {
                    blockType: Scratch.BlockType.XML,
                    xml: `<block type="operator_javascript_output">
                    <value name="JS">
                        <shadow type="text">
                            <field name="TEXT">Math.random()</field>
                        </shadow>
                    </value>
                </block>`,
                },
                {
                    blockType: Scratch.BlockType.XML,
                    xml: `<block type="operator_javascript_boolean">
                    <value name="JS">
                        <shadow type="text">
                            <field name="TEXT">Math.round(Math.random()) === 1</field>
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