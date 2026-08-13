// Name: Inputer
// ID: kmsinputer
// Description: Input box extension produced by 0.2 Studio.
// By: Kimos Frontender <https://scratch.mit.edu/users/Kimos-Frontender/>
// License: AGPL-3.0

(function (Scratch) {
  /* --------------------- DO NOT TOUCH 不要碰--------------------- */
  const CURRENT_EXTENSION_ID = "kmsinputer";

  const BLOCK_ICON_URI =
    // $ICON
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJf5Zu+5bGCXzEiIGRhdGEtbmFtZT0i5Zu+5bGCIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDYyLjkgNjIuMzIiPjxyZWN0IHdpZHRoPSI2Mi45IiBoZWlnaHQ9IjYyLjMyIiBzdHlsZT0iZmlsbDogI2VhZWFlYTsgb3BhY2l0eTogMDsiLz48Zz48cGF0aCBkPSJNNTIuNzksNDguMTljLTE0LjQ5LTEuMjctMjkuMDYtMS4yMi00My41NC4xNSwyLjg1LTEwLjkxLDUuNy0yMS44Myw4LjU1LTMyLjc0LDktLjg1LDE4LjA3LS44OCwyNy4wOC0uMDksMi42NCwxMC45LDUuMjgsMjEuNzksNy45MiwzMi42OVoiIHN0eWxlPSJmaWxsOiAjZDhkOGQ4OyIvPjxwYXRoIGQ9Ik0yMi42MiwzOS4yOWMzLjItNS42MSw1Ljg2LTExLjE1LDcuOTgtMTYuNjUuNzQsMCwxLjQ5LDAsMi4yMywwLDIuMjIsNS41LDUuMDMsMTEuMDQsOC40MSwxNi42Ni0xLS4wNC0yLS4wOC0zLS4xMS0uOTEtMS42OS0xLjc3LTMuMzctMi41OC01LjA0LTIuNTktLjA1LTUuMTktLjA1LTcuNzgsMC0uNzcsMS42OC0xLjU5LDMuMzYtMi40Niw1LjA0LS45My4wMy0xLjg2LjA2LTIuNzkuMVpNMjguNjcsMzIuMzZjMi4wNS0uMDMsNC4xLS4wMyw2LjE1LDAtLjctMS41My0xLjM1LTMuMDYtMS45Ni00LjU4LS41Ni0xLjM5LS45NS0yLjUzLTEuMTktMy40Mi0uMjEsMS4wNi0uNTEsMi4xLS45MiwzLjE1LS42NSwxLjYxLTEuMzQsMy4yMy0yLjA4LDQuODVaIi8+PHBhdGggZD0iTTU0Ljc2LDQ5LjQ5Yy0xLjEzLS4xMS0yLjI1LS4yLTMuMzgtLjMtMi42LTExLjY0LTUuMi0yMy4yOC03LjgtMzQuOTIuNjguMDUsMS4zNS4xMSwyLjAzLjE4LDMuMDUsMTEuNjgsNi4xLDIzLjM2LDkuMTUsMzUuMDRaIiBzdHlsZT0iZmlsbDogI2VkZWRlZDsiLz48L2c+PC9zdmc+"
  
    /* --------------------- 事件 --------------------- */
  const EVENT_FOCUS = "whenFocus";
  const EVENT_BLUR = "whenBlur";
  const EVENT_INPUT = "whenInput";
  const EVENT_FOCUS_ID = "whenFocusId";
  const EVENT_BLUR_ID = "whenBlurId";

  /** @typedef {HTMLInputElement | HTMLTextAreaElement} InputElement */
  /** @typedef {typeof INPUT_TRANSLATES[keyof typeof INPUT_TRANSLATES]} TranslateModel */
  const TYPE_INPUT = 0;
  const TYPE_TEXT_AREA = 1;
  const TYPE_PLACEHOLDER = 2;
  const TYPE_VALUE = 3;
  const TYPE_DIRECT_FRONT = 4;
  const TYPE_DIRECT_BACK = 5;
  const TYPE_READONLY = 6;
  const TYPE_ENABLE = 7;
  const TYPE_DISABLE = 8;
  const TYPE_DISABLED = 9;

  const FOCUS_TYPES = Object.freeze({
    GAIN: "focus",
    LOSE: "blur",
  });
  const COORDINATE_TYPES = Object.freeze({
    X: "x",
    Y: "y",
  });

  const INPUT_FONT_WEIGHT = Object.freeze({
    NORMAL: "normal",
    BOLD: "bold",
    LIGHT: "light",
    THIN: "thin",
    50: "50",
    100: "100",
    200: "200",
    300: "300",
    400: "400",
    500: "500",
    600: "600",
    700: "700",
    800: "800",
    900: "900",
    1000: "1000",
  });

  const INPUT_TEXT_ALIGN = Object.freeze({
    LEFT: "left",
    CENTER: "center",
    RIGHT: "right",
  });

  const INPUT_TRANSLATES = Object.freeze({
    LEFT_TOP: "translate(0%, 0%)",
    LEFT_CENTER: "translate(0%, -50%)",
    LEFT_BOTTOM: "translate(0%, -100%)",
    CENTER_TOP: "translate(-50%, 0%)",
    CENTER_CENTER: "translate(-50%, -50%)",
    CENTER_BOTTOM: "translate(-50%, -100%)",
    RIGHT_TOP: "translate(-100%, 0%)",
    RIGHT_CENTER: "translate(-100%, -50%)",
    RIGHT_BOTTOM: "translate(-100%, -100%)",
  });

  const INPUT_BG_FITS = Object.freeze({
    COVER: "cover",
    CONTAIN: "contain",
    STRETCH: "stretch",
    REPEAT: "repeat",
  });
  const INPUT_BG_FIT_STYLES = Object.freeze({
    [INPUT_BG_FITS.COVER]: Object.freeze({
      SIZE: "cover",
      REPEAT: "no-repeat",
    }),
    [INPUT_BG_FITS.CONTAIN]: Object.freeze({
      SIZE: "contain",
      REPEAT: "no-repeat",
    }),
    [INPUT_BG_FITS.STRETCH]: Object.freeze({
      SIZE: "100% 100%",
      REPEAT: "no-repeat",
    }),
    [INPUT_BG_FITS.REPEAT]: Object.freeze({
      SIZE: "auto",
      REPEAT: "repeat",
    }),
  });

  const CONTAINER_ID = "kms-inputer-container-element";
  const CONTAINER_VARS = Object.freeze({
    TOP: "--container-top",
    LEFT: "--container-left",
    WIDTH: "--container-width",
    HEIGHT: "--container-height",
    SCALE: "--container-scale",
    BORDER_WIDTH: "--container-border-width",
  });
  const INPUT_DEFAULTS = Object.freeze({
    BORDER_WIDTH: "0",
    X: "0",
    Y: "0",
    WIDTH: "100px",
    HEIGHT: "30px",
    TEXT_ALIGN: INPUT_TEXT_ALIGN.LEFT,
    BG_COLOR: "transparent",
    FONT_WEIGHT: INPUT_FONT_WEIGHT.NORMAL,
    BORDER_STYLE: "solid",
    FONT_FAMILY: '"Microsoft YaHei UI",Arial, sans-serif',
    FONT_SIZE: "16px",
    FONT_COLOR: "black",
    PADDING: "0",
    OPACITY: 1,
    LINE_HEIGHT: "auto",
    BG_IMAGE: "none",
    BG_SIZE: "cover",
    BG_REPEAT: "no-repeat",
    BG_FIT: INPUT_BG_FITS.COVER,
  });
  const INPUT_VARS = Object.freeze({
    TEXT_ALIGN: "--input-text-align",
    X: "--input-x",
    Y: "--input-y",
    WIDTH: "--input-width",
    HEIGHT: "--input-height",
    BG_COLOR: "--input-bg-color",
    FONT_WEIGHT: "--input-font-weight",
    BORDER_WIDTH: "--input-border-width",
    BORDER_COLOR: "--input-border-color",
    BORDER_STYLE: "--input-border-style",
    FONT_FAMILY: "--input-font-family",
    FONT_SIZE: "--input-font-size",
    FONT_COLOR: "--input-font-color",
    PADDING: "--input-padding",
    OPACITY: "--input-opacity",
    LINE_HEIGHT: "--input-line-height",
    TRANSLATE: "--input-translate",
    BG_IMAGE: "--input-bg-image",
    BG_SIZE: "--input-bg-size",
    BG_REPEAT: "--input-bg-repeat",
    BG_FIT: "--input-bg-fit",
  });
  const SCROLL_TYPES = Object.freeze({
    X: "x",
    Y: "y",
  });

  const CONTAINER_CSS = `
#${CONTAINER_ID}{
    position: fixed;
    top: var(${CONTAINER_VARS.TOP});
    left: var(${CONTAINER_VARS.LEFT});
    width: var(${CONTAINER_VARS.WIDTH});
    height: var(${CONTAINER_VARS.HEIGHT});
    transform: scale(var(${CONTAINER_VARS.SCALE})) translateZ(0); /* TranslateZ的意义是强制开启GPU加速 */
    background-color: transparent;
    z-index: 9999;
    display: inline-block;
    transform-origin: top left;
    overflow: hidden;
    backface-visibility: hidden; /* 防止3D变换导致的背面隐藏 */
}
#${CONTAINER_ID}>*{
    --input-line-height-px: calc(var(${INPUT_VARS.LINE_HEIGHT}) * 1px);
    margin: 0;
    padding: calc(var(${INPUT_VARS.PADDING}, ${INPUT_DEFAULTS.PADDING}) * 1px);
    position: absolute;
    font-weight: var(${INPUT_VARS.FONT_WEIGHT}, ${INPUT_DEFAULTS.FONT_WEIGHT});
    left: calc(50% + var(${INPUT_VARS.X}) * 1px);
    top: calc(50% - var(${INPUT_VARS.Y}) * 1px);
    width: calc(var(${INPUT_VARS.WIDTH}) * 1px);
    height: calc(var(${INPUT_VARS.HEIGHT}) * 1px);
    background-color: var(${INPUT_VARS.BG_COLOR}, transparent);
    background-image: var(${INPUT_VARS.BG_IMAGE}, none);
    background-size: var(${INPUT_VARS.BG_SIZE}, cover);
    background-position: center;
    background-repeat: var(${INPUT_VARS.BG_REPEAT}, no-repeat);
    border-width: calc(var(${CONTAINER_VARS.BORDER_WIDTH}, 0) * 1px);
    border-color: var(${INPUT_VARS.BORDER_COLOR}, transparent);
    border-style: var(${INPUT_VARS.BORDER_STYLE}, ${INPUT_DEFAULTS.BORDER_STYLE});
    font-family: var(${INPUT_VARS.FONT_FAMILY}, ${INPUT_DEFAULTS.FONT_FAMILY});
    font-size: var(${INPUT_VARS.FONT_SIZE}, ${INPUT_DEFAULTS.FONT_SIZE});
    color: var(${INPUT_VARS.FONT_COLOR}, ${INPUT_DEFAULTS.FONT_COLOR});
    opacity: var(${INPUT_VARS.OPACITY}, ${INPUT_DEFAULTS.OPACITY});
    line-height: var(--input-line-height-px, ${INPUT_DEFAULTS.LINE_HEIGHT});
    transform: translateZ(0) var(${INPUT_VARS.TRANSLATE});
    text-align: var(${INPUT_VARS.TEXT_ALIGN}, ${INPUT_TEXT_ALIGN.LEFT});
}
#${CONTAINER_ID}>*:focus{
    outline: none;
}
#${CONTAINER_ID}>textarea{
    resize: none;
}
    `;

  const vm = Scratch.vm;
  const runtime = vm.runtime;
  const renderer = runtime.renderer;
  /** @type {HTMLCanvasElement} */
  const stage = renderer.canvas;
  const container = document.createElement("div");

  /**
   * 获取指定元素在容器中的索引位置（基于前兄弟元素遍历）
   *
   * 该函数利用 DOM 原生指针 `previousElementSibling` 向前计数，
   * 时间复杂度 O(n) 但实际运行极快，且不产生任何临时数组或集合。
   *
   * @param {InputElement} input - 需要查询索引的元素，必须为 `container` 的直接子元素
   * @returns {number}
   */
  function getElementIndex(input) {
    if (!container || !input || input.parentNode !== container) {
      return -1;
    }

    let index = 0;
    let current = input;

    while (current.previousElementSibling) {
      current = current.previousElementSibling;
      index++;
    }

    return index;
  }
  function getVmStageInfo() {
    return {
      width: runtime.stageWidth,
      height: runtime.stageHeight,
    };
  }

  /**
   * @param {readonly { text: string, value: string }[]} items
   * @returns {{
   *   acceptReporters: boolean,
   *   items: readonly { text: string, value: string }[]
   * }}
   */
  function generateMenu(items) {
    return Object.freeze({
      acceptReporters: false,
      items: Object.freeze(items), // 运行时冻结，确保真正不可变
    });
  }
  const PIXELS_MENU_ITEMS = Object.freeze([
    {
      text: "x",
      value: INPUT_VARS.X,
    },
    {
      text: "y",
      value: INPUT_VARS.Y,
    },
    {
      text: Scratch.translate({ id: "menu.width", default: "width" }),
      value: INPUT_VARS.WIDTH,
    },
    {
      text: Scratch.translate({ id: "menu.height", default: "height" }),
      value: INPUT_VARS.HEIGHT,
    },
    {
      text: Scratch.translate({ id: "menu.borderWidth", default: "border width" }),
      value: INPUT_VARS.BORDER_WIDTH,
    },
    {
      text: Scratch.translate({ id: "menu.fontSize", default: "font size" }),
      value: INPUT_VARS.FONT_SIZE,
    },
    {
      text: Scratch.translate({ id: "menu.lineHeight", default: "line height" }),
      value: INPUT_VARS.LINE_HEIGHT,
    },
    {
      text: Scratch.translate({ id: "menu.padding", default: "padding" }),
      value: INPUT_VARS.PADDING,
    },
  ]);
  const STYLES_VARS_MENU_ITEMS = Object.freeze([
    {
      text: Scratch.translate({ id: "menu.bgColor", default: "background color" }),
      value: INPUT_VARS.BG_COLOR,
    },
    {
      text: Scratch.translate({ id: "menu.borderColor", default: "border color" }),
      value: INPUT_VARS.BORDER_COLOR,
    },
    {
      text: Scratch.translate({ id: "menu.fontColor", default: "text color" }),
      value: INPUT_VARS.FONT_COLOR,
    },
    {
      text: Scratch.translate({ id: "menu.fontFamily", default: "font" }),
      value: INPUT_VARS.FONT_FAMILY,
    },
    {
      text: Scratch.translate({ id: "menu.opacity", default: "opacity" }),
      value: INPUT_VARS.OPACITY,
    },
    {
      text: Scratch.translate({ id: "menu.textAlign", default: "text alignment" }),
      value: INPUT_VARS.TEXT_ALIGN,
    },
  ]);
  const TOGGLE_MENU_OPTIONS = Object.freeze([
    {
      text: Scratch.translate({ id: "menu.enable", default: "enable" }),
      value: TYPE_ENABLE,
    },
    {
      text: Scratch.translate({ id: "menu.disable", default: "disable" }),
      value: TYPE_DISABLE,
    },
  ]);
  const TOGGLE_MENU_ITEMS = Object.freeze([
    {
      text: Scratch.translate({ id: "menu.readonly", default: "read-only" }),
      value: TYPE_READONLY,
    },
    {
      text: Scratch.translate({ id: "menu.disabled", default: "disabled" }),
      value: TYPE_DISABLED,
    },
  ]);
  const INPUT_TRANSLATES_MENU_ITEMS = Object.freeze([
    {
      text: Scratch.translate({ id: "menu.translateCenter", default: "center" }),
      value: INPUT_TRANSLATES.CENTER_CENTER,
    },
    {
      text: Scratch.translate({ id: "menu.translateLeftTop", default: "top left" }),
      value: INPUT_TRANSLATES.LEFT_TOP,
    },
    {
      text: Scratch.translate({ id: "menu.translateRightTop", default: "top right" }),
      value: INPUT_TRANSLATES.RIGHT_TOP,
    },
    {
      text: Scratch.translate({ id: "menu.translateLeftBottom", default: "bottom left" }),
      value: INPUT_TRANSLATES.LEFT_BOTTOM,
    },
    {
      text: Scratch.translate({ id: "menu.translateRightBottom", default: "bottom right" }),
      value: INPUT_TRANSLATES.RIGHT_BOTTOM,
    },
    {
      text: Scratch.translate({ id: "menu.translateLeftCenter", default: "left center" }),
      value: INPUT_TRANSLATES.LEFT_CENTER,
    },
    {
      text: Scratch.translate({ id: "menu.translateRightCenter", default: "right center" }),
      value: INPUT_TRANSLATES.RIGHT_CENTER,
    },
    {
      text: Scratch.translate({ id: "menu.translateCenterTop", default: "center top" }),
      value: INPUT_TRANSLATES.CENTER_TOP,
    },
    {
      text: Scratch.translate({ id: "menu.translateCenterBottom", default: "center bottom" }),
      value: INPUT_TRANSLATES.CENTER_BOTTOM,
    },
  ]);
  const INPUT_TEXT_ALIGN_MENU_ITEMS = Object.freeze([
    {
      text: Scratch.translate({ id: "menu.alignLeft", default: "align left" }),
      value: INPUT_TEXT_ALIGN.LEFT,
    },
    {
      text: Scratch.translate({ id: "menu.alignCenter", default: "align center" }),
      value: INPUT_TEXT_ALIGN.CENTER,
    },
    {
      text: Scratch.translate({ id: "menu.alignRight", default: "align right" }),
      value: INPUT_TEXT_ALIGN.RIGHT,
    },
  ]);
  const INPUT_FONT_WEIGHT_MENU_ITEMS = Object.freeze([
    {
      text: Scratch.translate({ id: "menu.weightNormal", default: "normal" }),
      value: INPUT_FONT_WEIGHT.NORMAL,
    },
    {
      text: Scratch.translate({ id: "menu.weightBold", default: "bold" }),
      value: INPUT_FONT_WEIGHT.BOLD,
    },
    {
      text: Scratch.translate({ id: "menu.weightLight", default: "light" }),
      value: INPUT_FONT_WEIGHT.LIGHT,
    },
    {
      text: Scratch.translate({ id: "menu.weightThin", default: "thin" }),
      value: INPUT_FONT_WEIGHT.THIN,
    },
    {
      text: "50",
      value: INPUT_FONT_WEIGHT[50],
    },
    {
      text: "100",
      value: INPUT_FONT_WEIGHT[100],
    },
    {
      text: "200",
      value: INPUT_FONT_WEIGHT[200],
    },
    {
      text: "300",
      value: INPUT_FONT_WEIGHT[300],
    },
    {
      text: "400",
      value: INPUT_FONT_WEIGHT[400],
    },
    {
      text: "500",
      value: INPUT_FONT_WEIGHT[500],
    },
    {
      text: "600",
      value: INPUT_FONT_WEIGHT[600],
    },
    {
      text: "700",
      value: INPUT_FONT_WEIGHT[700],
    },
    {
      text: "800",
      value: INPUT_FONT_WEIGHT[800],
    },
    {
      text: "900",
      value: INPUT_FONT_WEIGHT[900],
    },
    {
      text: "1000",
      value: INPUT_FONT_WEIGHT[1000],
    },
  ]);
  const INPUT_SCROLL_POSITION_TYPES_MENU_ITEMS = Object.freeze([
    {
      text: "x",
      value: SCROLL_TYPES.X,
    },
    {
      text: "y",
      value: SCROLL_TYPES.Y,
    },
  ]);
  const INPUT_BACKGROUND_FIT_MENU_ITEMS = Object.freeze([
    {
      text: Scratch.translate({ id: "menu.bgFitCover", default: "fill (cover)" }),
      value: INPUT_BG_FITS.COVER,
    },
    {
      text: Scratch.translate({ id: "menu.bgFitContain", default: "fit (contain)" }),
      value: INPUT_BG_FITS.CONTAIN,
    },
    {
      text: Scratch.translate({ id: "menu.bgFitStretch", default: "stretch" }),
      value: INPUT_BG_FITS.STRETCH,
    },
    {
      text: Scratch.translate({ id: "menu.bgFitRepeat", default: "tile" }),
      value: INPUT_BG_FITS.REPEAT,
    },
  ]);
  const FOCUS_OPTIONS_MENU_ITEMS = Object.freeze([
    {
      text: Scratch.translate({ id: "menu.focusGain", default: "gain focus" }),
      value: FOCUS_TYPES.GAIN,
    },
    {
      text: Scratch.translate({ id: "menu.focusLose", default: "lose focus" }),
      value: FOCUS_TYPES.LOSE,
    },
  ]);
  const COORDINATE_TYPES_MENU_ITEMS = Object.freeze([
    {
      text: "x",
      value: COORDINATE_TYPES.X,
    },
    {
      text: "y",
      value: COORDINATE_TYPES.Y,
    },
  ]);
  const ATTRS_MENU_ITEMS = Object.freeze([...PIXELS_MENU_ITEMS, ...STYLES_VARS_MENU_ITEMS]);

  const PIXELS_VARS_MENU = generateMenu(PIXELS_MENU_ITEMS);
  const STYLES_VARS_MENU = generateMenu(STYLES_VARS_MENU_ITEMS);
  const ATTRS_MENU = generateMenu(ATTRS_MENU_ITEMS);
  const TOGGLE_OPTIONS_MENU = generateMenu(TOGGLE_MENU_OPTIONS);
  const TOGGLE_MENU = generateMenu(TOGGLE_MENU_ITEMS);
  const INPUT_TRANSLATES_MENU = generateMenu(INPUT_TRANSLATES_MENU_ITEMS);
  const INPUT_TEXT_ALIGN_MENU = generateMenu(INPUT_TEXT_ALIGN_MENU_ITEMS);
  const INPUT_FONT_WEIGHT_MENU = generateMenu(INPUT_FONT_WEIGHT_MENU_ITEMS);
  const INPUT_SCROLL_POSITION_TYPES_MENU = generateMenu(INPUT_SCROLL_POSITION_TYPES_MENU_ITEMS);
  const INPUT_BACKGROUND_FIT_MENU = generateMenu(INPUT_BACKGROUND_FIT_MENU_ITEMS);
  const FOCUS_OPTIONS_MENU = generateMenu(FOCUS_OPTIONS_MENU_ITEMS);
  const COORDINATE_TYPES_MENU = generateMenu(COORDINATE_TYPES_MENU_ITEMS);
  class FontManager {
    constructor() {
      /** @type { Map<string, FontFace> } */
      this._fonts = new Map();
    }
    /**
     * @param {string} NAME
     * @param {string} URL
     */
    async loadFont(NAME, URL) {
      if (this._fonts.has(NAME)) return;
      const fontFace = new FontFace(NAME, `url(${URL})`);
      this._fonts.set(NAME, fontFace);
      await fontFace.load();
      this.addFont(fontFace);
    }
    /**
     * @param {FontFace} fontFace
     * @returns {boolean}
     */
    isFontLoaded(fontFace) {
      return fontFace.status === "loaded";
    }
    /**
     * @param {FontFace} fontFace
     * @returns {boolean}
     */
    isFontError(fontFace) {
      return fontFace.status === "error" || fontFace.status === "failed";
    }
    isFontLoading(fontFace) {
      return fontFace.status === "loading";
    }
    /**
     *
     * @param {FontFace} fontFace
     */
    addFont(fontFace) {
      document.fonts.add(fontFace);
    }
    /**
     * @param {string} NAME
     * @returns {boolean}
     */
    hasFont(NAME) {
      return this._fonts.has(NAME);
    }
    deleteFont(NAME) {
      if (!this.hasFont(NAME)) return;
      document.fonts.delete(this._fonts.get(NAME));
      this._fonts.delete(NAME);
    }
    /**
     * @param {number} INDEX
     * @returns {string | void}
     */
    getFontNameByIndex(index = 0) {
      if (index < 0 || index >= this._fonts.size) return;

      const iter = this._fonts.keys();
      let fontName;
      for (let i = 0; i <= index; i++) {
        fontName = iter.next().value;
      }
      return fontName;
    }
  }
  class Inputer {
    constructor() {
      /** @type {Map<string,InputElement>} */
      this._inputs = new Map();
      this._listenContainerHandles();
      this._initContainer();
      /** @type {InputElement | null} */
      this._focus = null;
      /** @type {typeof this["_focus"]} */
      this._blur = null;
      this._fontManager = new FontManager();
      /** @type {string} */
      this._inputValue = "";
      /** @type {HTMLSpanElement | null} */
      this._caretMirror = null;
      this._bindClearHandle();
      this._listenInputFocus();
    }
    _bindClearHandle() {
      runtime.on("PROJECT_STOP_ALL", this.clear.bind(this));
    }
    getInfo() {
      return {
        id: CURRENT_EXTENSION_ID,
        name: Scratch.translate({ id: "extensionName", default: "Inputer" }),
        color1: "#222222",
        color2: "#ffffff",
        color3: "#ffffff",
        description: Scratch.translate({ id: "extensionDescription", default: "Input box extension produced by 0.2 Studio." }),
        blockIconURI: BLOCK_ICON_URI,
        blocks: [
          {
            opcode: "addInputElement",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "addInputElement", default: "create a new [TYPE] input box with id [ID]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
              TYPE: {
                type: Scratch.ArgumentType.NUMBER,
                menu: "INPUT_ELEMENT_TYPES",
                defaultValue: TYPE_INPUT,
              },
            },
          },
          {
            opcode: "setInputText",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "setInputText", default: "set [TYPE] of input box with id [ID] to [TEXT]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
              TYPE: {
                type: Scratch.ArgumentType.NUMBER,
                menu: "INPUT_TEXT_TYPES",
                defaultValue: TYPE_VALUE,
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "getInputText",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getInputText", default: "get [TYPE] of input box with id [ID]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
              TYPE: {
                type: Scratch.ArgumentType.NUMBER,
                menu: "INPUT_TEXT_TYPES",
                defaultValue: TYPE_VALUE,
              },
            },
          },
          {
            opcode: "getScrollPosition",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getScrollPosition", default: "get [TYPE] of scroll position of input box with id [ID]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
              TYPE: {
                type: Scratch.ArgumentType.NUMBER,
                menu: "INPUT_SCROLL_POSITION_TYPES",
                defaultValue: INPUT_VARS.X,
              },
            },
          },
          {
            opcode: "changeInputBoxType",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "changeInputBoxType", default: "set input box with id [ID] to be a [TYPE] input box" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
              TYPE: {
                type: Scratch.ArgumentType.NUMBER,
                menu: "INPUT_ELEMENT_TYPES",
                defaultValue: TYPE_INPUT,
              },
            },
          },
          {
            opcode: "setPixelsVars",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "setPixelsVars", default: "set [TYPE] of input box with id [ID] to [VALUE] pixels" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
              TYPE: {
                type: Scratch.ArgumentType.NUMBER,
                menu: "INPUT_PIXELS_VARS",
                defaultValue: INPUT_VARS.X,
              },
              VALUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            opcode: "setStylesVars",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "setStylesVars", default: "set [TYPE] of input box with id [ID] to [VALUE]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
              TYPE: {
                type: Scratch.ArgumentType.NUMBER,
                menu: "INPUT_STYLES_VARS",
                defaultValue: INPUT_VARS.BG_COLOR,
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "#01b8ac",
              },
            },
          },
          {
            opcode: "setFontWeight",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "setFontWeight", default: "set font weight of input box with id [ID] to [WEIGHT]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
              WEIGHT: {
                type: Scratch.ArgumentType.STRING,
                menu: "INPUT_FONT_WEIGHT",
                defaultValue: INPUT_FONT_WEIGHT.NORMAL,
              },
            },
          },
          {
            opcode: "getInputsCount",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getInputsCount", default: "number of all input boxes" }),
          },
          {
            opcode: "getInputIdByIndex",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getInputIdByIndex", default: "id of the [INDEX]th input box among all input boxes" }),
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
          {
            opcode: "toggle",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "toggle", default: "[TOGGLE_OPTION] [ATTR] of input box with id [ID]" }),
            arguments: {
              TOGGLE_OPTION: {
                type: Scratch.ArgumentType.NUMBER,
                menu: "INPUT_TOGGLE_OPTIONS",
                defaultValue: TYPE_ENABLE,
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
              ATTR: {
                type: Scratch.ArgumentType.NUMBER,
                menu: "INPUT_TOGGLE_MENU",
                defaultValue: TYPE_READONLY,
              },
            },
          },
          {
            opcode: "setTextAlign",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "setTextAlign", default: "set text alignment of input box with id [ID] to [ALIGN]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
              ALIGN: {
                type: Scratch.ArgumentType.STRING,
                menu: "INPUT_TEXT_ALIGN",
                defaultValue: INPUT_TEXT_ALIGN.LEFT,
              },
            },
          },
          {
            opcode: "setTranslate",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "setTranslate", default: "set centering style of input box with id [ID] to [TYPESLATE]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
              TYPESLATE: {
                type: Scratch.ArgumentType.STRING,
                menu: "INPUT_TRANSLATES",
                defaultValue: INPUT_TRANSLATES.LEFT_TOP,
              },
            },
          },
          {
            opcode: "clear",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "clear", default: "clear all input boxes" }),
          },
          {
            opcode: "deleteInput",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "deleteInput", default: "delete input box with id [ID]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "getStyleAttribute",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getStyleAttribute", default: "get [ATTR] attribute of input box with id [ID]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
              ATTR: {
                type: Scratch.ArgumentType.STRING,
                menu: "INPUT_ATTRS_VARS",
                defaultValue: INPUT_VARS.X,
              },
            },
          },
          {
            opcode: "isInputExists",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate({ id: "isInputExists", default: "does input box with id [ID] exist?" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "isEnableAttr",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate({ id: "isEnableAttr", default: "is [ATTR] of input box with id [ID] enabled?" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
              ATTR: {
                type: Scratch.ArgumentType.STRING,
                menu: "INPUT_TOGGLE_MENU",
                defaultValue: TYPE_READONLY,
              },
            },
          },
          {
            opcode: "isSingleLineInput",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate({ id: "isSingleLineInput", default: "is input box with id [ID] a single-line input box?" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "isTextAreaInput",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate({ id: "isTextAreaInput", default: "is input box with id [ID] a multi-line input box?" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
            },
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: Scratch.translate({ id: "label.focus", default: "Focus" }),
          },
          {
            opcode: EVENT_FOCUS,
            blockType: Scratch.BlockType.EVENT,
            text: Scratch.translate({ id: "whenFocus", default: "when any input box gains focus" }),
            isEdgeActivated: false,
          },
          {
            opcode: EVENT_BLUR,
            blockType: Scratch.BlockType.EVENT,
            text: Scratch.translate({ id: "whenBlur", default: "when any input box loses focus" }),
            isEdgeActivated: false,
          },
          {
            opcode: EVENT_FOCUS_ID,
            blockType: Scratch.BlockType.EVENT,
            text: Scratch.translate({ id: "whenFocusId", default: "when input box with id [ID] gains focus" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
            },
            isEdgeActivated: false,
          },
          {
            opcode: EVENT_BLUR_ID,
            blockType: Scratch.BlockType.EVENT,
            text: Scratch.translate({ id: "whenBlurId", default: "when input box with id [ID] loses focus" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
            },
            isEdgeActivated: false,
          },
          {
            opcode: EVENT_INPUT,
            blockType: Scratch.BlockType.EVENT,
            text: Scratch.translate({ id: "whenInput", default: "when user types in any input box" }),
            isEdgeActivated: false,
          },
          {
            opcode: "getInputValue",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getInputValue", default: "content typed by user in one go" }),
          },
          {
            opcode: "getFocusId",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getFocusId", default: "id of the currently focused input box" }),
          },
          {
            opcode: "getBlurId",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getBlurId", default: "id of the input box that just lost focus" }),
          },
          {
            opcode: "focusInput",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "focusInput", default: "give focus to input box with id [ID]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "blurInput",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "blurInput", default: "remove focus from input box with id [ID]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "selectInputText",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "selectInputText", default: "select all text of input box with id [ID]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "isInputFocused",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate({ id: "isInputFocused", default: "is input box with id [ID] focused?" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "getSelectedText",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getSelectedText", default: "selected text of input box with id [ID]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "setInputFocus",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "setInputFocus", default: "make input box with id [ID] [FOCUS_OPTION]" }),
            arguments: {
              FOCUS_OPTION: {
                type: Scratch.ArgumentType.STRING,
                menu: "INPUT_FOCUS_OPTIONS",
                defaultValue: FOCUS_TYPES.GAIN,
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
            },
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: Scratch.translate({ id: "label.layer", default: "Layer" }),
          },
          {
            opcode: "getIndex",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getIndex", default: "layer of input box with id [ID]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "getIdFromIndex",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getIdFromIndex", default: "id of the element at layer [INDEX]" }),
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
          {
            opcode: "changeIndex",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "changeIndex", default: "move element with id [ID] [INDEX] layers [DIRECT]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
              DIRECT: {
                type: Scratch.ArgumentType.NUMBER,
                menu: "INPUT_DIRECT",
                defaultValue: TYPE_DIRECT_FRONT,
              },
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: Scratch.translate({ id: "label.utility", default: "Utilities" }),
          },
          {
            opcode: "clearInputText",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "clearInputText", default: "clear value of input box with id [ID]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "getInputCharCount",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getInputCharCount", default: "number of characters in input box with id [ID]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "getFocusCharCount",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getFocusCharCount", default: "number of characters in the currently focused input box" }),
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: Scratch.translate({ id: "label.coordinate", default: "Coordinates" }),
          },
          {
            opcode: "getFocusCoordinate",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getFocusCoordinate", default: "[TYPE] coordinate of the currently focused input box" }),
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "COORDINATE_TYPES",
                defaultValue: COORDINATE_TYPES.X,
              },
            },
          },
          {
            opcode: "getInputCoordinate",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getInputCoordinate", default: "[TYPE] coordinate of input box with id [ID]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "COORDINATE_TYPES",
                defaultValue: COORDINATE_TYPES.X,
              },
            },
          },
          {
            opcode: "getFocusCaretCoordinate",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getFocusCaretCoordinate", default: "[TYPE] coordinate of the caret in the currently focused input box" }),
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "COORDINATE_TYPES",
                defaultValue: COORDINATE_TYPES.X,
              },
            },
          },
          {
            opcode: "getInputCaretCoordinate",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getInputCaretCoordinate", default: "[TYPE] coordinate of the caret in input box with id [ID]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "COORDINATE_TYPES",
                defaultValue: COORDINATE_TYPES.X,
              },
            },
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: Scratch.translate({ id: "label.background", default: "Background" }),
          },
          {
            opcode: "setInputBackgroundImage",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "setInputBackgroundImage", default: "set background image of input box with id [ID] to [URL]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "clearInputBackgroundImage",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "clearInputBackgroundImage", default: "clear background image of input box with id [ID]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "getInputBackgroundImage",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getInputBackgroundImage", default: "background image of input box with id [ID]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "setInputBackgroundFit",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "setInputBackgroundFit", default: "set background fill mode of input box with id [ID] to [FIT]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
              FIT: {
                type: Scratch.ArgumentType.STRING,
                menu: "INPUT_BACKGROUND_FIT",
                defaultValue: INPUT_BG_FITS.COVER,
              },
            },
          },
          {
            opcode: "getInputBackgroundFit",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getInputBackgroundFit", default: "background fill mode of input box with id [ID]" }),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
            },
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: Scratch.translate({ id: "label.font", default: "Font" }),
          },
          {
            opcode: "loadFonts",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: "loadFonts", default: "load font from URL [URL] and name it [NAME]" }),
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue:
                  "https://cdn.jsdelivr.net/gh/irozhi/HarmonyOS-Sans/HarmonyOS_Sans_SC/HarmonyOS_Sans_SC_Medium.woff2",
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Harmony OS Sans SC Medium",
              },
            },
          },
          {
            opcode: "isFontLoaded",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate({ id: "isFontLoaded", default: "did font [NAME] load successfully?" }),
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Harmony OS Sans SC Medium",
              },
            },
          },
          {
            opcode: "isFontError",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate({ id: "isFontError", default: "did font [NAME] fail to load?" }),
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Harmony OS Sans SC Medium",
              },
            },
          },
          {
            opcode: "isFontLoading",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate({ id: "isFontLoading", default: "is font [NAME] still loading?" }),
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Harmony OS Sans SC Medium",
              },
            },
          },
          {
            opcode: "fontsCount",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "fontsCount", default: "number of fonts" }),
          },
          {
            opcode: "hasFont",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate({ id: "hasFont", default: "does font [NAME] exist?" }), // 判断 Font Manager 的 Kv Cache 表里是否有这个字体，而不是判断状态是否为已加载
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Harmony OS Sans SC Medium",
              },
            },
          },
          {
            opcode: "getFontName",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: "getFontName", default: "name of the [INDEX]th font among all fonts" }),
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
        ],
        menus: {
          INPUT_ELEMENT_TYPES: {
            acceptReporters: false,
            items: [
              {
                text: Scratch.translate({ id: "menu.singleLine", default: "single line" }),
                value: TYPE_INPUT.toString(),
              },
              {
                text: Scratch.translate({ id: "menu.multiLine", default: "multi line" }),
                value: TYPE_TEXT_AREA.toString(),
              },
            ],
          },
          INPUT_TEXT_TYPES: {
            acceptReporters: false,
            items: [
              {
                text: Scratch.translate({ id: "menu.placeholder", default: "placeholder" }),
                value: TYPE_PLACEHOLDER.toString(),
              },
              {
                text: Scratch.translate({ id: "menu.value", default: "value" }),
                value: TYPE_VALUE.toString(),
              },
            ],
          },
          INPUT_PIXELS_VARS: PIXELS_VARS_MENU,
          INPUT_STYLES_VARS: STYLES_VARS_MENU,
          INPUT_ATTRS_VARS: ATTRS_MENU,
          INPUT_TOGGLE_OPTIONS: TOGGLE_OPTIONS_MENU,
          INPUT_TOGGLE_MENU: TOGGLE_MENU,
          INPUT_TRANSLATES: INPUT_TRANSLATES_MENU,
          INPUT_TEXT_ALIGN: INPUT_TEXT_ALIGN_MENU,
          INPUT_FONT_WEIGHT: INPUT_FONT_WEIGHT_MENU,
          INPUT_SCROLL_POSITION_TYPES: INPUT_SCROLL_POSITION_TYPES_MENU,
          INPUT_BACKGROUND_FIT: INPUT_BACKGROUND_FIT_MENU,
          INPUT_FOCUS_OPTIONS: FOCUS_OPTIONS_MENU,
          COORDINATE_TYPES: COORDINATE_TYPES_MENU,
          INPUT_DIRECT: {
            acceptReporters: false,
            items: [
              {
                text: Scratch.translate({ id: "menu.front", default: "front" }),
                value: TYPE_DIRECT_FRONT.toString(),
              },
              {
                text: Scratch.translate({ id: "menu.back", default: "back" }),
                value: TYPE_DIRECT_BACK.toString(),
              },
            ],
          },
        },
      };
    }
    _listenInputFocus() {
      container.addEventListener(
        "focus",
        (e) => {
          this._focus = e?.target;
          const id = e?.target?.dataset?.id || "";
          runtime.startHats(`${CURRENT_EXTENSION_ID}_${EVENT_FOCUS}`);
          runtime.startHats(`${CURRENT_EXTENSION_ID}_${EVENT_FOCUS_ID}`, [id]);
        },
        true,
      );
      container.addEventListener(
        "blur",
        (e) => {
          if (this._focus === e?.target) {
            this._focus = null;
            this._blur = e?.target;
            const id = e?.target?.dataset?.id || "";
            runtime.startHats(`${CURRENT_EXTENSION_ID}_${EVENT_BLUR}`);
            runtime.startHats(`${CURRENT_EXTENSION_ID}_${EVENT_BLUR_ID}`, [id]);
          }
        },
        true,
      );
      container.addEventListener(
        "input",
        /** @type {(e: InputEvent)=>void} */
        (e) => {
          if (this._focus === e?.target) {
            this._inputValue = e.data || "";
            runtime.startHats(`${CURRENT_EXTENSION_ID}_${EVENT_INPUT}`);
          }
        },
        true,
      );
    }
    /**
     * @param {InputElement} input
     */
    _focusInput(input) {
      input.focus();
    }
    /**
     * @param {InputElement} input
     */
    _blurInput(input) {
      input.blur();
    }
    /**
     * @param {InputElement} input
     */
    _selectInputText(input) {
      input.select();
    }
    /**
     * @param {InputElement} input
     * @returns {boolean}
     */
    _isInputFocused(input) {
      return this._focus === input;
    }
    /**
     * @param {typeof TYPE_INPUT | typeof TYPE_TEXT_AREA} TYPE 输入框类型
     * @returns {InputElement | undefined}
     */
    _createNormalInputElement(TYPE) {
      if (TYPE === TYPE_INPUT) {
        return document.createElement("input");
      } else if (TYPE === TYPE_TEXT_AREA) {
        return document.createElement("textarea");
      } else return;
    }
    /**
     * @param {string} ID
     * @param {typeof TYPE_INPUT | typeof TYPE_TEXT_AREA} TYPE 输入框类型
     * @param {boolean} allowDuplicate 是否允许重复创建
     * @returns {InputElement | undefined}
     */
    _createInput(ID, type = TYPE_INPUT, allowDuplicate = false) {
      if (this._inputs.has(ID) && !allowDuplicate) return;
      /** @type {InputElement | void} */
      let input = this._createNormalInputElement(type);
      if (!input) return;
      this._setInputId(input, ID);
      container.appendChild(input);
      this._initStyles(input);
      return input;
    }
    /**
     * @param {InputElement} input
     * @param {string} ID
     */
    _setInputId(input, ID) {
      input.dataset.id = ID;
      this._inputs.set(ID, input);
    }
    /**
     * @param {InputElement} input
     * @returns {string | void}
     */
    _getInputId(input) {
      return input.dataset.id;
    }
    /**
     * @param {string} ID
     * @returns {InputElement | undefined}
     */
    _getInput(ID) {
      let input = this._inputs.get(ID);
      //   if (!input) {
      //     this._fixInputKvMap(ID);
      //     input = this._inputs.get(ID);
      //   } // 以上代码因性能原因废弃

      return input;
    }
    /**
     * @param {number} INDEX
     * @returns {string | void}
     */
    _getInputIdFromIndex(index = 0) {
      if (index < 0 || index >= this._inputs.size) return undefined;
      const iter = this._inputs.keys();
      let inputId;
      for (let i = 0; i <= index; i++) {
        inputId = iter.next().value;
      }
      return inputId;
    }
    /**
     * @param {InputElement} input
     * @param {number} count
     * @returns {InputElement}
     */
    _getPrevElement(input, count = 1) {
      let ele = input;
      for (let i = 0; i < count; i++) {
        if (!ele.previousElementSibling) break;
        ele = ele.previousElementSibling;
      }
      return ele;
    }
    /**
     * @param {InputElement} input
     * @param {typeof TYPE_ENABLE | typeof TYPE_DISABLE} ENABLE 是否启用
     */
    _setReadonly(input, ENABLE) {
      input.readOnly = ENABLE === TYPE_ENABLE;
    }
    /**
     * @param {InputElement} input
     * @returns {boolean}
     */
    _getReadonly(input) {
      return input.readOnly;
    }
    /**
     * @param {InputElement} input
     * @param {typeof TYPE_ENABLE | typeof TYPE_DISABLE} ENABLE 是否禁用
     */
    _setDisabled(input, ENABLE) {
      input.disabled = ENABLE === TYPE_ENABLE;
    }
    /**
     * @param {InputElement} input
     * @returns {boolean}
     */
    _getDisabled(input) {
      return input.disabled;
    }
    /**
     * @param {InputElement} input
     * @param {number} count
     * @returns {InputElement}
     */
    _getNextElement(input, count = 1) {
      let ele = input;
      for (let i = 0; i < count; i++) {
        if (!ele.nextElementSibling) break;
        ele = ele.nextElementSibling;
      }
      return ele;
    }
    /**
     * @param {InputElement} input
     * @param {typeof INPUT_FONT_WEIGHT} WEIGHT
     */
    _setFontWeight(input, WEIGHT) {
      input.style.setProperty(INPUT_VARS.FONT_WEIGHT, WEIGHT);
    }
    /**
     * @param {InputElement} input
     * @param {number} INDEX
     * @param {typeof TYPE_DIRECT_FRONT | typeof TYPE_DIRECT_BACK} DIRECT
     */
    _changeElementIndex(input, INDEX, DIRECT) {
      /** @type {InputElement | null} */
      let anchorElement = input;
      if (INDEX === 0) return;
      switch (DIRECT) {
        case TYPE_DIRECT_FRONT:
          anchorElement = this._getNextElement(input, INDEX).nextElementSibling;
          break;
        case TYPE_DIRECT_BACK:
          anchorElement = this._getPrevElement(input, INDEX);
          break;
      }
      if (anchorElement === input) return;
      input.remove();

      if (anchorElement === null && DIRECT === TYPE_DIRECT_BACK) {
        container.appendChild(input);
        return;
      }
      container.insertBefore(input, anchorElement);
      if (this._focus === input) input.focus();
    }
    /**
     * @param {string} ID
     * @returns {boolean} 表示修复是否成功
     */
    _fixInputKvMap(ID) {
      const inputFromDom = container.querySelector(`[data-id="${ID}"]`);
      const inputFromMap = this._inputs.get(ID);
      if (!inputFromMap) {
        if (!inputFromDom) return false;
        this._inputs.set(ID, inputFromDom);
      }
      if (!inputFromDom) {
        if (!inputFromMap) return false; // 不存在
        container.appendChild(inputFromMap);
      }
      return true;
    }
    _initContainer() {
      const styleElement = document.createElement("style");
      styleElement.innerHTML = CONTAINER_CSS;
      document.head.appendChild(styleElement);
      container.id = CONTAINER_ID;
      document.body.appendChild(container);
      this._updateContainerStyles();
    }
    _updateContainerStyles() {
      const box = stage.getBoundingClientRect();
      const stageInfo = getVmStageInfo();
      /** @type {number} */
      const scale = this._getStageScale(); // 1 or ...
      container.style.setProperty(CONTAINER_VARS.TOP, `${box.top}px`);
      container.style.setProperty(CONTAINER_VARS.LEFT, `${box.left}px`);
      container.style.setProperty(CONTAINER_VARS.WIDTH, `${stageInfo.width}px`);
      container.style.setProperty(CONTAINER_VARS.HEIGHT, `${stageInfo.height}px`);
      container.style.setProperty(CONTAINER_VARS.SCALE, `${scale}`);
    }
    /**
     * 计算舞台逻辑尺寸与屏幕像素之间的缩放比例
     * @returns {number}
     */
    _getStageScale() {
      const box = stage.getBoundingClientRect();
      const stageInfo = getVmStageInfo();
      return (box.width / stageInfo.width + box.height / stageInfo.height) * 0.5;
    }
    /**
     * 获取输入框中心点在 Scratch 坐标系中的位置
     * @param {InputElement} input
     * @returns {{ x: number, y: number }}
     */
    _getScratchPosition(input) {
      const box = stage.getBoundingClientRect();
      const stageInfo = getVmStageInfo();
      const rect = input.getBoundingClientRect();
      const scale = this._getStageScale();
      return {
        x: (rect.left + rect.width / 2 - box.left) / scale - stageInfo.width / 2,
        y: stageInfo.height / 2 - (rect.top + rect.height / 2 - box.top) / scale,
      };
    }
    /**
     * 获取输入框某方向的 Scratch 坐标
     * @param {InputElement} input
     * @param {ItemType<typeof COORDINATE_TYPES_MENU_ITEMS>} TYPE
     * @returns {number | string}
     */
    _getCoordinateByType(input, TYPE) {
      const position = this._getScratchPosition(input);
      switch (TYPE) {
        case COORDINATE_TYPES.X:
          return position.x;
        case COORDINATE_TYPES.Y:
          return position.y;
        default:
          return "";
      }
    }
    /**
     * 测量输入框光标在 Scratch 坐标系中的位置
     *
     * 通过隐藏 span 按相同字体测量光标前的文本宽度，
     * 再结合输入框的屏幕位置与舞台缩放换算成 Scratch 坐标。
     * @param {InputElement} input
     * @returns {{ x: number, y: number }}
     */
    _measureCaretPosition(input) {
      const box = stage.getBoundingClientRect();
      const stageInfo = getVmStageInfo();
      const rect = input.getBoundingClientRect();
      const scale = this._getStageScale();
      const cs = getComputedStyle(input);
      /** @type {HTMLSpanElement} */
      const mirror = this._caretMirror || (this._caretMirror = document.createElement("span"));
      mirror.style.cssText = `
        position: fixed;
        left: -99999px;
        top: -99999px;
        visibility: hidden;
        white-space: pre;
        font: ${cs.font};
        letter-spacing: ${cs.letterSpacing};
      `;
      const start = input.selectionStart ?? input.value.length;
      const before = input.value.substring(0, start);
      const lastLine = before.split("\n").pop() || "";
      mirror.textContent = lastLine;
      document.body.appendChild(mirror);
      const textWidth = mirror.getBoundingClientRect().width || 0;
      mirror.remove();
      const lineIndex = (before.match(/\n/g) || []).length;
      const fontSize = parseFloat(cs.fontSize) || 16;
      const lineHeight = parseFloat(cs.lineHeight) || fontSize * 1.2;
      const borderLeft = parseFloat(cs.borderLeftWidth) || 0;
      const borderTop = parseFloat(cs.borderTopWidth) || 0;
      const paddingLeft = parseFloat(cs.paddingLeft) || 0;
      const paddingTop = parseFloat(cs.paddingTop) || 0;
      const caretX =
        (rect.left - box.left) / scale +
        borderLeft +
        paddingLeft +
        textWidth -
        (input.scrollLeft || 0);
      const caretY =
        (rect.top - box.top) / scale +
        borderTop +
        paddingTop +
        lineIndex * lineHeight +
        lineHeight / 2 -
        (input.scrollTop || 0);
      return {
        x: caretX - stageInfo.width / 2,
        y: stageInfo.height / 2 - caretY,
      };
    }
    _listenContainerHandles() {
      const observer = new ResizeObserver(this._updateContainerStyles.bind(this));
      observer.observe(stage);
      window.addEventListener("resize", this._updateContainerStyles.bind(this));
    }
    /**
     * @param {InputElement} input
     * @param {number} TYPE
     * @param {string} TEXT
     */
    _setInputText(input, TYPE, TEXT) {
      if (TYPE === TYPE_PLACEHOLDER) {
        input.placeholder = TEXT;
      } else if (TYPE === TYPE_VALUE) {
        input.value = TEXT;
      }
    }
    /**
     * @param {InputElement | void} input
     * @param {number} TYPE
     * @returns {string}
     */
    _getInputText(input, TYPE) {
      if (!input) return "";
      if (TYPE === TYPE_PLACEHOLDER) {
        return String(input.placeholder);
      } else if (TYPE === TYPE_VALUE) {
        return String(input.value);
      }
      return "";
    }
    /**
     * @param {InputElement} input
     * @returns {string}
     */
    _getSelectedText(input) {
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      return input.value.substring(start, end);
    }
    /**
     * @param {InputElement} input
     * @returns {number}
     */
    _getInputCharCount(input) {
      return input.value.length;
    }
    /**
     * @param {InputElement} input
     */
    _clearInputText(input) {
      input.value = "";
    }
    /**
     * @param {InputElement} source
     * @param {InputElement} result
     */
    _generalChangeInputBoxType(source, result) {
      const text = this._getInputText(source, TYPE_VALUE);
      const placeholder = this._getInputText(source, TYPE_PLACEHOLDER);
      this._setInputText(result, TYPE_VALUE, text);
      this._setInputText(result, TYPE_PLACEHOLDER, placeholder);
      result.style.cssText = source.style.cssText;
    }
    _hasInput(ID) {
      return this._inputs.has(ID);
    }
    /**
     * @param {HTMLTextAreaElement} textArea
     * @returns {HTMLInputElement | void} 输入框
     */
    _getInputFromTextArea(textArea) {
      const input = this._createNormalInputElement(TYPE_INPUT);
      if (!input) return;
      this._generalChangeInputBoxType(textArea, input);
      return input;
    }
    /**
     * @param {HTMLInputElement} input
     * @returns {HTMLTextAreaElement | void} 文本域
     */
    _getTextAreaFromInput(input) {
      const textArea = this._createNormalInputElement(TYPE_TEXT_AREA);
      if (!textArea) return;
      this._generalChangeInputBoxType(input, textArea);
      return textArea;
    }
    /**
     * @param {InputElement} input
     * @param {TranslateModel} TRANSLATE_VALUE
     */
    _setTranslate(input, TRANSLATE_VALUE) {
      input.style.setProperty(INPUT_VARS.TRANSLATE, TRANSLATE_VALUE);
    }
    /**
     * @param {InputElement} input
     * @param {string} URL 背景图片地址，为空则清除背景
     */
    _setBackgroundImage(input, URL) {
      input.style.setProperty(INPUT_VARS.BG_IMAGE, URL ? `url("${URL}")` : "none");
    }
    /**
     * @param {InputElement} input
     * @returns {string}
     */
    _getBackgroundImage(input) {
      const value = input.style.getPropertyValue(INPUT_VARS.BG_IMAGE);
      if (!value || value === "none") return "";
      const match = value.match(/url\(["']?(.*?)["']?\)/);
      return match?.[1] || value;
    }
    /**
     * @param {InputElement} input
     * @param {ItemType<typeof INPUT_BACKGROUND_FIT_MENU_ITEMS>} FIT
     */
    _setBackgroundFit(input, FIT) {
      const fitStyle = INPUT_BG_FIT_STYLES[FIT] || INPUT_BG_FIT_STYLES[INPUT_BG_FITS.COVER];
      input.style.setProperty(INPUT_VARS.BG_FIT, FIT);
      input.style.setProperty(INPUT_VARS.BG_SIZE, fitStyle.SIZE);
      input.style.setProperty(INPUT_VARS.BG_REPEAT, fitStyle.REPEAT);
    }
    /**
     * @param {InputElement} input
     * @returns {string}
     */
    _getBackgroundFit(input) {
      return input.style.getPropertyValue(INPUT_VARS.BG_FIT) || "";
    }
    /**
     * 无损转换输入框的类型
     * @param {string} ID
     * @param {typeof TYPE_INPUT | typeof TYPE_TEXT_AREA} TYPE 需要转换的目标类型
     * @param {InputElement} originalInput
     */
    _changeInputBoxType(originalInput, TYPE, ID) {
      /** @type {InputElement | void} */
      let resultInput;
      if (TYPE === TYPE_INPUT && originalInput instanceof HTMLTextAreaElement) {
        resultInput = this._getInputFromTextArea(originalInput);
      } else if (TYPE === TYPE_TEXT_AREA && originalInput instanceof HTMLInputElement) {
        resultInput = this._getTextAreaFromInput(originalInput);
      } else return;
      if (!resultInput) return;

      container.insertBefore(resultInput, originalInput); // 在旧的输入框之前插入新的输入框，此时新的输入框的id为空字符串
      if (this._focus === originalInput) resultInput.focus();
      this.deleteInput(ID); // 删除旧的输入框
      this._setInputId(resultInput, ID);
    }
    /**
     * @param {InputElement} input
     */
    _initStyles(input) {
      input.style.setProperty(INPUT_VARS.X, INPUT_DEFAULTS.X);
      input.style.setProperty(INPUT_VARS.Y, INPUT_DEFAULTS.Y);
      input.style.setProperty(INPUT_VARS.WIDTH, INPUT_DEFAULTS.WIDTH);
      input.style.setProperty(INPUT_VARS.HEIGHT, INPUT_DEFAULTS.HEIGHT);
      input.style.setProperty(INPUT_VARS.BG_COLOR, INPUT_DEFAULTS.BG_COLOR);
      input.style.setProperty(INPUT_VARS.TEXT_ALIGN, INPUT_DEFAULTS.TEXT_ALIGN);
      input.style.setProperty(INPUT_VARS.BORDER_STYLE, INPUT_DEFAULTS.BORDER_STYLE);
      input.style.setProperty(INPUT_VARS.FONT_FAMILY, INPUT_DEFAULTS.FONT_FAMILY);
      input.style.setProperty(INPUT_VARS.FONT_SIZE, INPUT_DEFAULTS.FONT_SIZE);
      input.style.setProperty(INPUT_VARS.BORDER_WIDTH, INPUT_DEFAULTS.BORDER_WIDTH);
      input.style.setProperty(INPUT_VARS.BG_IMAGE, INPUT_DEFAULTS.BG_IMAGE);
      input.style.setProperty(INPUT_VARS.BG_SIZE, INPUT_DEFAULTS.BG_SIZE);
      input.style.setProperty(INPUT_VARS.BG_REPEAT, INPUT_DEFAULTS.BG_REPEAT);
      input.style.setProperty(INPUT_VARS.BG_FIT, INPUT_DEFAULTS.BG_FIT);
    }
    addInputElement(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {number} */
      const TYPE = Scratch.Cast.toNumber(args.TYPE);
      /** @type {InputElement | void} */
      const input = this._createInput(ID, TYPE);
      if (!input) return;
    }

    setInputText(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {number} */
      const TYPE = Scratch.Cast.toNumber(args.TYPE);
      /** @type {string} */
      const TEXT = Scratch.Cast.toString(args.TEXT);
      /** @type {InputElement | void} */
      const input = this._getInput(ID);
      if (!input) return;
      this._setInputText(input, TYPE, TEXT);
    }
    getInputText(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {typeof TYPE_PLACEHOLDER | typeof TYPE_VALUE} */
      const TYPE = Scratch.Cast.toNumber(args.TYPE);
      /** @type {InputElement | void} */
      const input = this._getInput(ID);
      return this._getInputText(input, TYPE);
    }
    clearInputText(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {InputElement | void} */
      const input = this._getInput(ID);
      if (!input) return;
      this._clearInputText(input);
    }
    getInputCharCount(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {InputElement | void} */
      const input = this._getInput(ID);
      if (!input) return 0;
      return this._getInputCharCount(input);
    }
    getFocusCharCount() {
      if (!this._focus) return 0;
      return this._getInputCharCount(this._focus);
    }
    changeInputBoxType(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {number} */
      const TYPE = Scratch.Cast.toNumber(args.TYPE);
      /** @type {InputElement | void} */
      const input = this._getInput(ID);
      if (!input) return;
      this._changeInputBoxType(input, TYPE, ID);
    }
    setPixelsVars(args) {
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {ItemType<typeof PIXELS_MENU_ITEMS>} */
      const TYPE = Scratch.Cast.toString(args.TYPE);
      const VALUE = Scratch.Cast.toNumber(args.VALUE);
      const input = this._getInput(ID);
      if (!input) return;
      input.style.setProperty(TYPE, `${VALUE}`);
    }
    getStyleAttribute(args) {
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {ItemType<typeof ATTRS_MENU_ITEMS>} */
      const ATTR = Scratch.Cast.toString(args.ATTR);
      const input = this._getInput(ID);
      if (!input) return "";
      return input.style.getPropertyValue(ATTR) || "";
    }
    setStylesVars(args) {
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {ItemType<typeof STYLES_VARS_MENU_ITEMS>} */
      const TYPE = Scratch.Cast.toString(args.TYPE);
      const VALUE = Scratch.Cast.toString(args.VALUE);
      const input = this._getInput(ID);
      if (!input) return;
      input.style.setProperty(TYPE, VALUE);
    }
    setInputBackgroundImage(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {string} */
      const URL = Scratch.Cast.toString(args.URL);
      /** @type {InputElement | void} */
      const input = this._getInput(ID);
      if (!input) return;
      this._setBackgroundImage(input, URL);
    }
    clearInputBackgroundImage(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {InputElement | void} */
      const input = this._getInput(ID);
      if (!input) return;
      this._setBackgroundImage(input, "");
    }
    getInputBackgroundImage(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {InputElement | void} */
      const input = this._getInput(ID);
      if (!input) return "";
      return this._getBackgroundImage(input);
    }
    setInputBackgroundFit(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {ItemType<typeof INPUT_BACKGROUND_FIT_MENU_ITEMS>} */
      const FIT = Scratch.Cast.toString(args.FIT);
      const input = this._getInput(ID);
      if (!input) return;
      this._setBackgroundFit(input, FIT);
    }
    getInputBackgroundFit(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      const input = this._getInput(ID);
      if (!input) return "";
      return this._getBackgroundFit(input);
    }
    isSingleLineInput(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {InputElement | void} */
      const input = this._getInput(ID);
      if (!input) return false;
      return input instanceof HTMLInputElement;
    }
    setTextAlign(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {ItemType<typeof INPUT_TEXT_ALIGN_MENU_ITEMS>} */
      const ALIGN = Scratch.Cast.toString(args.ALIGN);
      const input = this._getInput(ID);
      if (!input) return;
      input.style.setProperty(INPUT_VARS.TEXT_ALIGN, ALIGN);
    }
    isEnableAttr(args) {
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {ItemType<typeof TOGGLE_MENU_ITEMS>} */
      const ATTR = Scratch.Cast.toNumber(args.ATTR);
      const input = this._getInput(ID);
      if (!input) return false;
      switch (ATTR) {
        case TYPE_READONLY:
          return this._getReadonly(input);
        case TYPE_DISABLED:
          return this._getDisabled(input);
        default:
          return false;
      }
    }
    isTextAreaInput(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {InputElement | void} */
      const input = this._getInput(ID);
      if (!input) return false;
      return input instanceof HTMLTextAreaElement;
    }
    isInputExists(args) {
      const ID = Scratch.Cast.toString(args.ID);
      return this._hasInput(ID);
    }
    getIndex(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {InputElement | void} */
      const input = this._getInput(ID);
      if (!input) return -1;
      return getElementIndex(input) + 1;
    }
    getIdFromIndex(args) {
      /** @type {number} */
      const INDEX = Math.abs(Math.floor(Scratch.Cast.toNumber(args.INDEX)));
      const input = container.children[INDEX - 1];
      return input?.dataset?.id || "";
    }
    changeIndex(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {InputElement | void} */
      const input = this._getInput(ID);
      if (!input) return;
      /** @type {number} */
      const INDEX = Math.abs(Math.floor(Scratch.Cast.toNumber(args.INDEX)));
      /** @type {typeof TYPE_DIRECT_FRONT | typeof TYPE_DIRECT_BACK} */
      const DIRECT = Scratch.Cast.toNumber(args.DIRECT);
      this._changeElementIndex(input, INDEX, DIRECT);
    }
    clear() {
      container.innerHTML = "";
      this._inputs.clear();
      this._focus = null;
      this._blur = null;
      this._inputValue = "";
    }
    deleteInput(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {InputElement | void} */
      const input = this._getInput(ID);
      if (!input) return;
      input.remove();
      if (this._focus === input) {
        this._focus = null;
      }
      this._inputs.delete(ID);
    }
    toggle(args) {
      /** @type {ItemType<typeof TOGGLE_MENU_OPTIONS>} */
      const OPTION = Scratch.Cast.toNumber(args.TOGGLE_OPTION);
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {ItemType<typeof TOGGLE_MENU_ITEMS>} */
      const ATTR = Scratch.Cast.toNumber(args.ATTR);
      const input = this._getInput(ID);
      if (!input) return;
      switch (ATTR) {
        case TYPE_READONLY:
          if (OPTION === TYPE_ENABLE) {
            this._setReadonly(input, TYPE_ENABLE);
          } else if (OPTION === TYPE_DISABLE) {
            this._setReadonly(input, TYPE_DISABLE);
          }
          break;
        case TYPE_DISABLED:
          if (OPTION === TYPE_ENABLE) {
            this._setDisabled(input, TYPE_ENABLE);
          } else if (OPTION === TYPE_DISABLE) {
            this._setDisabled(input, TYPE_DISABLE);
          }
          break;
        default:
          break;
      }
    }
    getInputsCount() {
      return this._inputs.size;
    }
    loadFonts(args) {
      /** @type {string} */
      const URL = Scratch.Cast.toString(args.URL);
      /** @type {string} */
      const NAME = Scratch.Cast.toString(args.NAME);
      this._fontManager.loadFont(NAME, URL);
    }
    isFontLoaded(args) {
      /** @type {string} */
      const NAME = Scratch.Cast.toString(args.NAME);
      /** @type {FontFace | void} */
      const font = this._fontManager._fonts.get(NAME);
      if (!font) return false;
      return this._fontManager.isFontLoaded(font);
    }
    isFontError(args) {
      /** @type {string} */
      const NAME = Scratch.Cast.toString(args.NAME);
      /** @type {FontFace | void} */
      const font = this._fontManager._fonts.get(NAME);
      if (!font) return false;
      return this._fontManager.isFontError(font);
    }
    isFontLoading(args) {
      /** @type {string} */
      const NAME = Scratch.Cast.toString(args.NAME);
      /** @type {FontFace | void} */
      const font = this._fontManager._fonts.get(NAME);
      if (!font) return false;
      return this._fontManager.isFontLoading(font);
    }
    hasFont(args) {
      /** @type {string} */
      const NAME = Scratch.Cast.toString(args.NAME);
      /** @type {FontFace | void} */
      return this._fontManager._fonts.has(NAME);
    }

    fontsCount() {
      return this._fontManager._fonts.size;
    }

    getFontName(args) {
      /** @type {number} */
      const INDEX = Math.abs(Math.floor(Scratch.Cast.toNumber(args.INDEX)));
      return this._fontManager.getFontNameByIndex(INDEX - 1) || "";
    }
    getInputIdByIndex(args) {
      /** @type {number} */
      const INDEX = Math.abs(Math.floor(Scratch.Cast.toNumber(args.INDEX))) - 1;
      const children = container.children;
      return children[INDEX]?.dataset?.id || "";
    }
    setTranslate(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {TranslateModel} */
      const TRANSLATE = Scratch.Cast.toString(args.TYPESLATE);
      const input = this._getInput(ID);
      if (!input) return;
      this._setTranslate(input, TRANSLATE);
    }
    getScrollPosition(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {typeof SCROLL_TYPES.X | typeof SCROLL_TYPES.Y} */
      const TYPE = Scratch.Cast.toString(args.TYPE);
      const input = this._getInput(ID);
      if (!input) return "";
      switch (TYPE) {
        case SCROLL_TYPES.X:
          return input.scrollLeft;
        case SCROLL_TYPES.Y:
          return input.scrollTop;
        default:
          return "";
      }
    }
    setFontWeight(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {string} */
      const WEIGHT = Scratch.Cast.toString(args.WEIGHT);
      const input = this._getInput(ID);
      if (!input) return;
      this._setFontWeight(input, WEIGHT);
    }
    getInputValue() {
      return this._inputValue;
    }
    getFocusId() {
      return this._focus?.dataset?.id || "";
    }
    getBlurId() {
      return this._blur?.dataset?.id || "";
    }
    focusInput(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {InputElement | void} */
      const input = this._getInput(ID);
      if (!input) return;
      this._focusInput(input);
    }
    blurInput(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {InputElement | void} */
      const input = this._getInput(ID);
      if (!input) return;
      this._blurInput(input);
    }
    setInputFocus(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {ItemType<typeof FOCUS_OPTIONS_MENU_ITEMS>} */
      const FOCUS_OPTION = Scratch.Cast.toString(args.FOCUS_OPTION);
      const input = this._getInput(ID);
      if (!input) return;
      switch (FOCUS_OPTION) {
        case FOCUS_TYPES.GAIN:
          this._focusInput(input);
          break;
        case FOCUS_TYPES.LOSE:
          this._blurInput(input);
          break;
      }
    }
    selectInputText(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {InputElement | void} */
      const input = this._getInput(ID);
      if (!input) return;
      this._selectInputText(input);
    }
    isInputFocused(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {InputElement | void} */
      const input = this._getInput(ID);
      if (!input) return false;
      return this._isInputFocused(input);
    }
    getSelectedText(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {InputElement | void} */
      const input = this._getInput(ID);
      if (!input) return "";
      return this._getSelectedText(input);
    }
    getFocusCoordinate(args) {
      /** @type {ItemType<typeof COORDINATE_TYPES_MENU_ITEMS>} */
      const TYPE = Scratch.Cast.toString(args.TYPE);
      if (!this._focus) return "";
      return this._getCoordinateByType(this._focus, TYPE);
    }
    getInputCoordinate(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {ItemType<typeof COORDINATE_TYPES_MENU_ITEMS>} */
      const TYPE = Scratch.Cast.toString(args.TYPE);
      const input = this._getInput(ID);
      if (!input) return "";
      return this._getCoordinateByType(input, TYPE);
    }
    getFocusCaretCoordinate(args) {
      /** @type {ItemType<typeof COORDINATE_TYPES_MENU_ITEMS>} */
      const TYPE = Scratch.Cast.toString(args.TYPE);
      if (!this._focus) return "";
      const position = this._measureCaretPosition(this._focus);
      switch (TYPE) {
        case COORDINATE_TYPES.X:
          return position.x;
        case COORDINATE_TYPES.Y:
          return position.y;
        default:
          return "";
      }
    }
    getInputCaretCoordinate(args) {
      /** @type {string} */
      const ID = Scratch.Cast.toString(args.ID);
      /** @type {ItemType<typeof COORDINATE_TYPES_MENU_ITEMS>} */
      const TYPE = Scratch.Cast.toString(args.TYPE);
      const input = this._getInput(ID);
      if (!input) return "";
      const position = this._measureCaretPosition(input);
      switch (TYPE) {
        case COORDINATE_TYPES.X:
          return position.x;
        case COORDINATE_TYPES.Y:
          return position.y;
        default:
          return "";
      }
    }
  }

  Scratch.extensions.register(new Inputer());
})(Scratch);
