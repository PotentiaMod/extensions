(function(Scratch) {
  'use strict';

class HacksExtension {
  getInfo() {
    return {
      id: 'hackedblocks',
      name: 'Hacked Blocks',
      blocks: [
        {
          blockType: "label",
          text: "Working Blocks",
        },
        {
          blockType: Scratch.BlockType.XML,
          xml: '<block type="operator_join"><value name="STRING1"><shadow type="matrix"><field name="MATRIX">1111110101001000010001110</field></shadow></value><value name="STRING2"><shadow type="text"><field name="TEXT"></field></shadow></value></block>',
        },
        "---",
        {
          blockType: Scratch.BlockType.XML,
          xml: '<block type="operator_round"><value name="NUM"><shadow type="note"><field name="NOTE">60</field></shadow></value></block>',
        },
        "---",
        {
          blockType: Scratch.BlockType.XML,
          xml: '<block type="operator_join"><value name="STRING1"><shadow type="colour_picker"/></value><value name="STRING2"><shadow type="text"><field name="TEXT"></field></shadow></value></block>',
        },
        "---",
        {
          blockType: Scratch.BlockType.XML,
          filter: [Scratch.TargetType.SPRITE],
          xml: '<block type="event_whentouchingobject"><value name="TOUCHINGOBJECTMENU"><shadow type="event_touchingobjectmenu"/></value></block>',
        },
        "---",
        {
          blockType: Scratch.BlockType.XML,
          filter: [Scratch.TargetType.SPRITE],
          xml: '<block type="sensing_touchingobject"><value name="TOUCHINGOBJECTMENU"><shadow type="event_touchingobjectmenu"/></value></block>'
        },
        "---",
        {
          blockType: Scratch.BlockType.XML,
          filter: [Scratch.TargetType.SPRITE],
          xml: '<block type="motion_pointinrandomdirection"></block>'
        },/*
        "---",
        {
          blockType: Scratch.BlockType.XML,
          xml: '<block type="sensing_loud"></block>'
        },*/
        {
          blockType: "label",
          text: "Non Working Blocks",
        },
        {
          blockType: Scratch.BlockType.XML,
          xml: '<block type="motion_align_scene"></block>'
        },
        "---",
        {
          blockType: Scratch.BlockType.XML,
          xml: '<block type="motion_scroll_right"><value name="DISTANCE"><shadow type="math_positive_number"><field name="NUM"></field></shadow></value></block>'
        },
        {
          blockType: Scratch.BlockType.XML,
          xml: '<block type="motion_scroll_up"><value name="DISTANCE"><shadow type="math_positive_number"><field name="NUM"></field></shadow></value></block>'
        },
        {
          blockType: Scratch.BlockType.XML,
          xml: '<block type="motion_xscroll"></block>'
        },
        {
          blockType: Scratch.BlockType.XML,
          xml: '<block type="motion_yscroll"></block>'
        },
        "---",
        {
          blockType: Scratch.BlockType.XML,
          xml: '<block type="looks_hideallsprites"></block>'
        },
        {
          blockType: Scratch.BlockType.XML,
          xml: '<block type="looks_changestretchby"><value name="CHANGE"><shadow type="math_positive_number"><field name="NUM"></field></shadow></value></block>'
        },
        {
          blockType: Scratch.BlockType.XML,
          xml: '<block type="looks_setstretchto"><value name="STRETCH"><shadow type="math_positive_number"><field name="NUM"></field></shadow></value></block>'
        },
        "---",
        {
          blockType: Scratch.BlockType.XML,
          xml: '<block type="sensing_userid"></block>'
        },
        {
          blockType: "label",
          text: "Javascript Blocks",
        },
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
        "---",
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
        "---",
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
        {
          blockType: "label",
          text: "Unknown Blocks",
        },
        {
          blockType: Scratch.BlockType.XML,
          xml: `<block type="motion_glidedirectionstepsinseconds">
            <value name="STEPS">
              <shadow type="math_number">
                <field name="NUM">10</field>
              </shadow>
            </value>
            <value name="SECS">
              <shadow type="math_number">
                <field name="NUM">1</field>
              </shadow>
            </value>
          </block>`,
        },
        {
          blockType: Scratch.BlockType.XML,
          xml: `<block type="sound_pause">
                  <value name="SOUND_MENU">
                    <shadow type="sound_sounds_menu"></shadow>
                  </value>
                </block>`,
        },
        {
          blockType: Scratch.BlockType.XML,
          xml: `<block type="sound_pauseallsounds" />`,
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
          blockType: Scratch.BlockType.XML,
          xml: `<block type="sound_getSoundVolume">
                  <value name="SOUND_MENU">Add commentMore actions
                    <shadow type="sound_sounds_menu"></shadow>
                  </value>
                </block>`,
        },
      ]
    };
  }
}
Scratch.extensions.register(new HacksExtension());
})(Scratch);
