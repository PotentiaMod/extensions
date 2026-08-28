(function (Scratch) {
  const isPM = Scratch.extensions?.isPenguinMod || false;

  if (!Scratch.extensions.unsandboxed) {
    window.alert('The extension "Breakpoint" must be ran unsandboxed!');
    throw new Error('The extension "Breakpoint" must be ran unsandboxed!');
  }

  const { vm, Cast } = Scratch;

  function element(tag, text, styles = {}) {
    const element = document.createElement(tag);
    if (text != null) element.innerText = text;
    Object.assign(element.style, styles);
    return element;
  }

  const styles = {
    panel: {
      display: "none",
      userSelect: "none",
      position: "fixed",
      top: "5rem",
      right: "5rem",
      width: "20rem",
      minHeight: "10rem",
      background: "#111",
      color: "#eee",
      fontFamily: "monospace",
      fontSize: "0.8rem",
      border: "2px solid rgba(255, 255, 255, 0.15)",
      borderRadius: "0.4rem",
      zIndex: "676767",
      flexDirection: "column",
      overflow: "hidden",
    },
    titlebar: {
      background: "rgb(0, 156, 204)",
      padding: "0.4rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "grab"
    },
    title: {
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: "400",
      fontSize: "1rem",
    },
    close: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "none",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.15)",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "1rem",
      width: "1.7rem",
      height: "1.7rem",
    },
    body: {
      padding: "0.5rem",
      overflowY: "auto",
      flex: "1",
    },
    hint: {
      opacity: "0.8",
      fontSize: "0.7rem",
    },
  };

  let panel = null;
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  function createPanel() {
    if (panel) return;

    panel = document.createElement("div");
    panel.id = "breakpoint-panel";
    panel.innerHTML = `
      <div id="titlebar">
        <span id="title">Breakpoint</span>
        <button id="close">✕</button>
      </div>
      <div id="body">
        <p id="hint">Use blocks to log values here.</p>
        <div id="log"></div>
      </div>
    `;

    Object.assign(panel.style, styles.panel);

    const titlebar = panel.querySelector("#titlebar");
    Object.assign(titlebar.style, styles.titlebar);

    const title = panel.querySelector("#title");
    Object.assign(title.style, styles.title);

    const close = panel.querySelector("#close");
    Object.assign(close.style, styles.close);
    close.addEventListener("click", () => hidePanel());

    const body = panel.querySelector("#body");
    Object.assign(body.style, styles.body);

    const hint = panel.querySelector("#hint");
    Object.assign(hint.style, styles.hint);

    titlebar.addEventListener("mousedown", e => {
      isDragging = true;
      dragOffsetX = e.clientX - panel.getBoundingClientRect().left;
      dragOffsetY = e.clientY - panel.getBoundingClientRect().top;
      titlebar.style.cursor = "grabbing";
      e.preventDefault();
    });

    document.addEventListener("mousemove", e => {
      if (!isDragging) return;
      panel.style.left = e.clientX - dragOffsetX + "px";
      panel.style.top = e.clientY - dragOffsetY + "px";
      panel.style.right = "unset";
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      titlebar.style.cursor = "grab";
    });

    document.body.appendChild(panel);
  }

  function showPanel() {
    createPanel();
    panel.style.display = "flex";
  }

  function hidePanel() {
    if (panel) panel.style.display = "none";
  }

  function logToPanel(message, color = "#eee") {
    createPanel();
    const log = panel.querySelector("#log");
    const hint = panel.querySelector("#hint");
    hint.style.display = "none";

    const entry = document.createElement("span");
    entry.textContent = message;
    Object.assign(entry.style, {
      color,
      borderLeft: `2px solid ${color}`,
      paddingLeft: "2px",
      wordBreak: "break-all",
    });

    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
  }

  class ddeBreakpointLog {
    customId = "ddeBreakpoint.log";

    constructor(input) {
      this.text = input?.text || "";
      this.color = input?.color || "";
      this.owner = input?.owner || "";
    }

    toJSON() {
      return { text: this.text, color: this.color, owner: this.owner };
    }
    ownerSprite() {
      return this.owner ? vm.runtime.targets.find(i => i.id === this.owner) : null;
    }

    valueOf() {
      return this.toJSON();
    }

    toString() {
      return this.text;
    }

    toReporterContent() {
      const label = element("span", this.text || "(empty)", {
        color: this.color || "inherit",
      });
      return label;
    }

    toMonitorContent() {
      return this.toReporterContent();
    }

    toListItem() {
      return this.toReporterContent();
    }

    toListEditor() {
      return this.toJSON();
    }

    fromListEditor(edit) {
      return new ddeBreakpointLog({ ...edit });
    }

    jwArrayHandler() {
      return this.text || "";
    }
  }

  class ddeBreakpoint {
    constructor() {
      if (isPM)
        vm.runtime.registerSerializer(
          "ddeBreakpoint.log",
          i => {
            if (i instanceof ddeBreakpointLog) return i.toJSON();
          },
          i => {
            if (i.dateString) return new ddeBreakpointLog({ ...i });
          },
        );
    }

    getInfo() {
      return {
        id: "ddeBreakpoint",
        name: "Breakpoint",
        color1: "#461d8b",
        color2: "#853eff",
        color3: "#7f2fff",
        blocks: [
          {
            opcode: "showDebugger",
            blockType: Scratch.BlockType.COMMAND,
            text: "show debugger",
          },
          {
            opcode: "hideDebugger",
            blockType: Scratch.BlockType.COMMAND,
            text: "hide debugger",
          },
          "---",
          {
            opcode: "logValue",
            blockType: Scratch.BlockType.COMMAND,
            text: "log [VALUE]",
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hello",
                exemptFromNormalization: true,
              },
            },
          },
          {
            opcode: "createLabel",
            blockType: Scratch.BlockType.REPORTER,
            text: "label [LABEL] color [COLOR]",
            arguments: {
              LABEL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hi",
              },
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
              },
            },
          },
          {
            opcode: "clearLog",
            blockType: Scratch.BlockType.COMMAND,
            text: "clear log",
          },
        ],
        menus: {},
      };
    }

    showDebugger() {
      showPanel();
    }

    hideDebugger() {
      hidePanel();
    }

    logValue({ VALUE }) {
      if (VALUE instanceof ddeBreakpointLog) {
        logToPanel(VALUE.text, VALUE.color);
      } else {
        logToPanel(Cast.toString(VALUE));
      }
    }

    createLabel({ LABEL, COLOR }, utils) {
      console.log(utils, utils?.thread?.target, utils?.thread?.target?.id);
      return new ddeBreakpointLog({
        text: LABEL,
        color: COLOR,
        owner: utils?.thread?.target?.id,
      });
    }

    clearLog() {
      if (!panel) return;
      const log = panel.querySelector("#log");
      const hint = panel.querySelector("#hint");
      log.innerHTML = "";
      hint.style.display = "block";
    }
  }

  Scratch.extensions.register(new ddeBreakpoint());
})(Scratch);
