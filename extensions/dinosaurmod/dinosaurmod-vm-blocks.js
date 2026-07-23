(function(Scratch) {
  'use strict';

  const newLine = `\n`

class HacksExtension {
  getInfo() {
    return {
      id: 'dinosaurmodblocksspecial',
      name: 'DinosaurMod Blocks 2',
      blocks: [
        {
          blockType: "label",
          text: "Warning:",
        },
        {
          blockType: "label",
          text: "These blocks don't work in Penguinmod.",
        },
        {
          blockType: "label",
          text: "Motion",
        },
        {
          blockType: Scratch.BlockType.XML,
          xml: `<block type="motion_rotationstyle"/>`,
        },
        {
          blockType: "label",
          text: "Looks",
        },
        {
          blockType: Scratch.BlockType.XML,
          xml: `<block type="looks_showallsprites"/>`,
        },
        {
          blockType: Scratch.BlockType.XML,
          xml: `<block type="looks_hideallsprites"/>`,
        },
        {
          blockType: "label",
          text: "Sound",
        },
        {
          blockType: Scratch.BlockType.XML,
          xml: `<block type="sound_getTimePosition">
                  <value name="SOUND_MENU">
                    <shadow type="sound_sounds_menu"></shadow>
                  </value>
                </block>`,
        },
        {
          blockType: "label",
          text: "Sensing",
        },
        {
          blockType: Scratch.BlockType.XML,
          xml: `<block type="sensing_dayssince">
            <value name="year">
                <shadow type="math_number">
                    <field name="NUM">2000</field>
                </shadow>
            </value>
        </block>`,
        },
        {
          blockType: "label",
          text: "Operators",
        },
        {
          blockType: Scratch.BlockType.XML,
          xml: `<block type="operator_percentage">
            <value name="PER">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>`,
        },
      ]
    };
  }
}
Scratch.extensions.register(new HacksExtension());
})(Scratch);
