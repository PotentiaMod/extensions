(function(Scratch) {
  'use strict';

class HacksExtension {
  getInfo() {
    return {
      id: 'hackedblocks',
      name: 'Hacked Blocks',
      docsURI: 'https://en.scratch-wiki.info/wiki/Hidden_Blocks',
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
        "---",
        {
          blockType: Scratch.BlockType.XML,
          xml: '<block type="sensing_userid"></block>'
        },
        "---",
      ]
    };
  }
}
Scratch.extensions.register(new HacksExtension());
})(Scratch);
