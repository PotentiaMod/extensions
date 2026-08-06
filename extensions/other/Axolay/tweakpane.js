const icon = "data:image/png;base64,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"

class Tweakpane {
  constructor(runtime) {
    this.runtime = runtime;
    this.panes = {};
    this.tweakpaneReady = false;
    this.eventValues = {}; // Store event values
    this.buttonPressQueue = []; // Queue of button labels that were pressed
    this.inputs = []; // List of changeable inputs
    this.selectedFolder = "none";

    this.loadTweakpane();
  }

  loadTweakpane() {
    if (window.Tweakpane) {
      this.tweakpaneReady = true;
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js';
    script.onload = () => {
      console.log('Tweakpane loaded!');
      this.tweakpaneReady = true;
    };
    script.onerror = () => {
      console.error('Failed to load Tweakpane');
    };
    const font = document.createElement('style')
    font.src = `https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&display=swap`
    document.head.appendChild(script);
    document.head.appendChild(font);

  }

  getInfo() {
    return {
      id: 'tweakpane',
      name: 'Tweakpane UI',
      color1: '#28292e', // pure red
      color2: '#28292e', // pure green
      color3: '#bbbdc4', // pure blue
      menuIconURL: icon,
      blockIconURI: icon,
      blocks: [
        {
          opcode: 'text1',
          blockType: Scratch.BlockType.LABEL,
          text: 'Element Setup',
        },
        {
          opcode: 'createPanel',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Create expandable panel [ID] with title [TITLE] at X: [X] Y: [Y]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'myPanel' },
            TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: 'Settings' },
            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
          },
        },
        {
          opcode: 'removeAllPanels',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Remove all panels',
        },
        {
          opcode: 'addSeparator',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Add separator to [ID]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'myPanel' },
          },
        },
        {
          opcode: 'text2',
          blockType: Scratch.BlockType.LABEL,
          text: 'Values',
        },
        {
          opcode: 'addNumber',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Add number input to [ID] labeled [LABEL] default [VALUE]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'myPanel' },
            LABEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'Count' },
            VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
          },
        },
        {
          opcode: 'addString',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Add string input to [ID] labeled [LABEL] default [VALUE]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'myPanel' },
            LABEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'Text' },
            VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '' },
          },
        },
        {
          opcode: 'addBoolean',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Add boolean to [ID] labeled [LABEL] default [VALUE]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'myPanel' },
            LABEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'Enabled' },
            VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'false' },
          },
        },
        {
          opcode: 'addSlider',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Add slider to [ID] labeled [LABEL] min [MIN] max [MAX]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'myPanel' },
            LABEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'Speed' },
            MIN: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            MAX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
          },
        },
        {
          opcode: 'text3',
          blockType: Scratch.BlockType.LABEL,
          text: 'Graphical Interface',
        },
        {
          opcode: 'addButton',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Add button to [ID] labeled [LABEL]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'myPanel' },
            LABEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'Click Me' },
          },
        },
        {
          opcode: 'addDropdown',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Add dropdown to [ID] labeled [LABEL] options [OPTIONS] default [VALUE]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'myPanel' },
            LABEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'scene' },
            OPTIONS: { type: Scratch.ArgumentType.STRING, defaultValue: 'hello:foo,world:bar' },
            VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'LDG' },
          },
        },
        {
          opcode: 'addColor',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Add color picker to [ID] labeled [LABEL] default [VALUE]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'myPanel' },
            LABEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'Tint' },
            VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '#ffffff' },
          },
        },
        {
          opcode: 'addPoint',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Add 2D point picker to [ID] labeled [LABEL] default X [X] Y [Y]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'myPanel' },
            LABEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'Point' },
            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
          },
        },
        '---',
        {
          opcode: 'text5',
          blockType: Scratch.BlockType.LABEL,
          text: 'Value Retrieval',
        },
        {
          opcode: 'getColorValue',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Value of color [LABEL]',
          arguments: {
            LABEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'Tint' },
          },
        },
        {
          opcode: 'getPointX',
          blockType: Scratch.BlockType.REPORTER,
          text: 'X of point [LABEL]',
          arguments: {
            LABEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'Point' },
          },
        },
        {
          opcode: 'getPointY',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Y of point [LABEL]',
          arguments: {
            LABEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'Point' },
          },
        },

        {
          opcode: 'getSliderValue',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Value of slider [LABEL]',
          arguments: {
            LABEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'Speed' },
          },
        },
        {
          opcode: 'getDropdownValue',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Value of dropdown [LABEL]',
          arguments: {
            LABEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'scene' },
          },
        },
        {
          opcode: 'getNumberValue',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Value of number [LABEL]',
          arguments: {
            LABEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'Count' },
          },
        },
        {
          opcode: 'getStringValue',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Value of string [LABEL]',
          arguments: {
            LABEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'Text' },
          },
        },
        {
          opcode: 'getBooleanValue',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Value of boolean [LABEL]',
          arguments: {
            LABEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'Enabled' },
          },
        },
        '---',
        {
          opcode: 'text10',
          blockType: Scratch.BlockType.LABEL,
          text: 'Hats',
        },
        {
          opcode: 'whenButtonPressed',
          blockType: Scratch.BlockType.HAT,
          text: 'When button [LABEL] is pressed',
          arguments: {
            LABEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'Click Me' },
          },
        },
        {
          opcode: 'text10',
          blockType: Scratch.BlockType.LABEL,
          text: 'Debug',
        },
        {
          opcode: 'setStringValue',
          blockType: Scratch.BlockType.COMMAND,
          text: 'set value of [ID] to [VALUE]',
          arguments: {
            VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'cat' },
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'Text' },
          },
        },
        {
          opcode: 'getInputs',
          blockType: Scratch.BlockType.REPORTER,
          text: 'get inputs',
        },
      ],
    };
  }
  createPanel(args) {
    if (!this.tweakpaneReady || !window.Tweakpane) {
      console.warn('Tweakpane is not ready yet!');
      return;
    }

    const { ID, TITLE, X, Y } = args;
    if (this.panes[ID]) return; 

    const pane = new window.Tweakpane.Pane();
    pane.element.style.position = 'absolute';
    pane.element.style.left = `${X}px`;
    pane.element.style.top = `${Y}px`;
    pane.element.style.fontFamily = `archivo, sans-serif`;

    const stage = document.querySelector('.stage_stage_1fD7k');
    if (stage) {
      Scratch.renderer.addOverlay(pane.element, "scale");
      pane.element.style.pointerEvents = "auto";
    } else {
      document.body.appendChild(pane.element);
    }

    const folder = pane.addFolder({
      title: TITLE,
    });

    this.panes[ID] = { pane, folder };
  }

  setStringValue(args) {
    const {ID, VALUE} = args;
    this.input[ID].value = VALUE
  }

  setFolder(args) {
    const {ID, NAME} = args;
    this.input[ID].value = VALUE
  }

  addSlider(args) {
    const { ID, LABEL, MIN, MAX } = args;
    const panel = this.panes[ID];
    if (!panel) return;

    const initial = (MIN + MAX) / 2;
    this.eventValues[LABEL] = initial;

    const tmp = { value: initial };
    const slider = panel.folder.addInput(tmp, 'value', {
      label: LABEL,
      min: MIN,
      max: MAX,
    });

    slider.on('change', () => {
      this.eventValues[LABEL] = Number(tmp.value) || 0;
    });
  }

  addDropdown(args) {
    const { ID, LABEL, OPTIONS, VALUE } = args;
    const panel = this.panes[ID];
    if (!panel) return;

    const optionsArr = [];
    if (typeof OPTIONS === 'string') {
      const parts = OPTIONS.split(',').map((s) => s.trim()).filter(Boolean);
      parts.forEach((p) => {
        const [textPart, valuePart] = p.split(':').map((s) => s.trim());
        if (valuePart === undefined) {
          optionsArr.push({ text: textPart, value: textPart });
        } else {
          optionsArr.push({ text: textPart, value: valuePart });
        }
      });
    }

    const initialValue = VALUE || (optionsArr[0] && optionsArr[0].value) || '';
    this.eventValues[LABEL] = initialValue;

    const tmp = { value: initialValue };
    const dropdown = panel.folder.addInput(tmp, 'value', {
      label: LABEL,
      options: optionsArr,
    });

    dropdown.on('change', () => {
      this.eventValues[LABEL] = String(tmp.value || '');
    });
  }

  addColor(args) {
    const { ID, LABEL, VALUE } = args;
    const panel = this.panes[ID];
    if (!panel) return;

    const initialValue = VALUE || '#ffffff';
    this.eventValues[LABEL] = initialValue;

    const tmp = { value: initialValue };
    const input = panel.folder.addInput(tmp, 'value', { label: LABEL });

    input.on('change', (event) => {
      let v = tmp.value;
      if (v && typeof v === 'object' && 'r' in v && 'g' in v && 'b' in v) {
        const r = Math.max(0, Math.min(255, Math.round(v.r)));
        const g = Math.max(0, Math.min(255, Math.round(v.g)));
        const b = Math.max(0, Math.min(255, Math.round(v.b)));
        v = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      }
      this.eventValues[LABEL] = v;
    });
  }

  addPoint(args) {
    const { ID, LABEL, X, Y } = args;
    const panel = this.panes[ID];
    if (!panel) return;

    const initial = { x: typeof X === 'number' ? X : 0, y: typeof Y === 'number' ? Y : 0 };
    this.eventValues[LABEL] = { x: initial.x, y: initial.y };

    const tmp = { value: { x: initial.x, y: initial.y } };
    const input = panel.folder.addInput(tmp, 'value', { label: LABEL });

    input.on('change', () => {
      const v = tmp.value || { x: 0, y: 0 };
      this.eventValues[LABEL] = { x: Number(v.x) || 0, y: Number(v.y) || 0 };
    });
  }

  addBoolean(args) {
    const { ID, LABEL, VALUE } = args;
    const panel = this.panes[ID];
    if (!panel) return;

    const initialValue = (VALUE === 'true' || VALUE === true) ? true : false;
    this.eventValues[LABEL] = initialValue;

    const tmp = { value: initialValue };
    const input = panel.folder.addInput(tmp, 'value', { label: LABEL });

    input.on('change', (event) => {
      this.eventValues[LABEL] = !!tmp.value;
    });
  }

  addNumber(args) {
    const { ID, LABEL, VALUE } = args;
    const panel = this.panes[ID];
    if (!panel) return;

    const initial = typeof VALUE === 'number' ? VALUE : Number(VALUE) || 0;
    this.eventValues[LABEL] = initial;

    const tmp = { value: initial };
    const input = panel.folder.addInput(tmp, 'value', { label: LABEL });

    input.on('change', () => {
      this.eventValues[LABEL] = Number(tmp.value) || 0;
    });
  }

  addString(args) {
    const { ID, LABEL, VALUE } = args;
    const panel = this.panes[ID];
    if (!panel) return;

    const initial = (VALUE != null) ? String(VALUE) : '';
    this.eventValues[LABEL] = initial;

    const tmp = { value: initial };
    const input = panel.folder.addInput(tmp, 'value', { label: LABEL });

    input.on('change', () => {
      this.eventValues[LABEL] = String(tmp.value || '');
    });

    this.inputs.push(input)
  }

  addButton(args) {
    const { ID, LABEL } = args;
    const panel = this.panes[ID];
    if (!panel) return;

    const button = panel.folder.addButton({
      title: LABEL,
    });

    button.on('click', () => {
      // Add to queue for hat block to check
      this.buttonPressQueue.push(LABEL);
      if (Scratch && Scratch.vm && Scratch.vm.runtime) {
        setTimeout(() => {
          Scratch.vm.runtime.startHats('tweakpane_whenButtonPressed');
        }, 0);
      }
    });
  }

  addSeparator(args) {
    const { ID } = args;
    const panel = this.panes[ID];
    if (!panel) return;

    panel.folder.addBlade({
      view: 'separator',
    });
  }

  whenButtonPressed(args) {
    // Check if the button that was pressed matches this block's label
    if (this.buttonPressQueue.length === 0) {
      return false;
    }
    
    const pressedLabel = this.buttonPressQueue[0];
    
    if (pressedLabel === args.LABEL) {
      this.buttonPressQueue.shift(); // Remove from queue
      return true;
    }
    
    return false;
  }

  removeAllPanels() {
    Object.keys(this.panes).forEach((panelID) => {
      const { pane } = this.panes[panelID];
      if (pane) {
        pane.element.remove();
      }
    });
    this.panes = {};
    console.log('All panels removed!');
  }

  getSliderValue(args) {
    return this.eventValues[args.LABEL] || 0;
  }

  getNumberValue(args) {
    const v = this.eventValues[args.LABEL];
    return typeof v === 'number' ? v : Number(v) || 0;
  }

  getDropdownValue(args) {
    return this.eventValues[args.LABEL] || '';
  }

  getColorValue(args) {
    return this.eventValues[args.LABEL] || '#ffffff';
  }

  getStringValue(args) {
    const v = this.eventValues[args.LABEL];
    return v != null ? String(v) : '';
  }

  getBooleanValue(args) {
    const v = this.eventValues[args.LABEL];
    return !!v;
  }

  getPointValue(args) {
    const v = this.eventValues[args.LABEL] || { x: 0, y: 0 };
    return `${v.x},${v.y}`;
  }

  getPointX(args) {
    const v = this.eventValues[args.LABEL];
    return v && typeof v.x === 'number' ? v.x : 0;
  }

  getPointY(args) {
    const v = this.eventValues[args.LABEL];
    return v && typeof v.y === 'number' ? v.y : 0;
  }

  getInputs() {
    let output = []
    this.inputs.forEach(element => {
      output.push(element)
    });
    return JSON.stringify(output)
  }
}

Scratch.extensions.register(new Tweakpane());