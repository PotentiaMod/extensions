// Name: 鼠标+
// ID: mouseplus
// Description: 控制鼠标位置、自定义光标样式、显示虚拟指针，并支持指针锁定功能。指针锁定后鼠标移动将报告相对位移。
// By: Yesshape <https://scratch.mit.edu/users/yesshape/>
(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("鼠标+扩展必须以unsandboxed模式运行");
  }

  const vm = Scratch.vm;
  const canvas = vm.runtime.renderer.canvas;
  const mouse = vm.runtime.ioDevices.mouse;

  // ==================== 基础变量 ====================
  let rect = canvas.getBoundingClientRect();
  window.addEventListener("resize", () => {
    rect = canvas.getBoundingClientRect();
  });

  // ==================== 指针锁定相关 (移植自 pointerlock.js) ====================
  let isLocked = false;
  let isPointerLockEnabled = false;

  const postMouseData = (e, isDown) => {
    const { movementX, movementY } = e;
    const { width, height } = rect;
    const x = mouse._clientX + movementX;
    const y = mouse._clientY - movementY;
    mouse._clientX = x;
    mouse._scratchX = mouse.runtime.stageWidth * (x / width - 0.5);
    mouse._clientY = y;
    mouse._scratchY = mouse.runtime.stageHeight * (y / height - 0.5);
    if (typeof isDown === "boolean") {
      const data = {
        button: e.button,
        isDown,
      };
      originalPostIOData(data);
    }
  };

  const mouseDevice = vm.runtime.ioDevices.mouse;
  const originalPostIOData = mouseDevice.postData.bind(mouseDevice);
  mouseDevice.postData = (data) => {
    if (!isPointerLockEnabled) {
      return originalPostIOData(data);
    }
  };

  document.addEventListener(
    "mousedown",
    (e) => {
      if (canvas.contains(e.target)) {
        if (isLocked) {
          postMouseData(e, true);
        } else if (isPointerLockEnabled) {
          canvas.requestPointerLock();
        }
      }
    },
    true
  );
  document.addEventListener(
    "mouseup",
    (e) => {
      if (isLocked) {
        postMouseData(e, false);
      } else if (isPointerLockEnabled && canvas.contains(e.target)) {
        canvas.requestPointerLock();
      }
    },
    true
  );
  document.addEventListener(
    "mousemove",
    (e) => {
      if (isLocked) {
        postMouseData(e);
      }
    },
    true
  );

  document.addEventListener("pointerlockchange", () => {
    isLocked = document.pointerLockElement === canvas;
  });
  document.addEventListener("pointerlockerror", (e) => {
    console.error("指针锁定错误", e);
  });

  vm.runtime.on("PROJECT_LOADED", () => {
    isPointerLockEnabled = false;
    if (isLocked) {
      document.exitPointerLock();
    }
  });

  // ==================== 虚拟鼠标指针相关 ====================
  let virtualCursorVisible = false;
  let virtualCursorElement = null;
  let virtualCursorImg = null;
  let customCursorSize = { width: 32, height: 32 };

  const DEFAULT_CURSOR_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.5)"/>
        </filter>
      </defs>
      <path d="M5 3 L5 27 L13 19 L19 29 L23 27 L17 17 L27 15 Z" 
            fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round" filter="url(#shadow)"/>
    </svg>`;

  // 积木栏图标SVG（黑白两色，适配亮色/暗色主题）
  const BLOCK_ICON_SVG = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <path d="M8 5 L8 32 L17 24 L25 36 L30 34 L22 22 L35 20 Z" 
            fill="white" stroke="black" stroke-width="2.5" stroke-linejoin="round"/>
    </svg>
  `)}`;

  const CURSOR_RENDERERS = {
    default: { svg: () => DEFAULT_CURSOR_SVG, hotspotX: 5, hotspotY: 3 },
    pointer: {
      svg: () => `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.5)"/>
            </filter>
          </defs>
          <path d="M5 3 L5 25 L13 18 L22 28 L27 26 L17 16 L27 14 Z" 
                fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round" filter="url(#shadow)"/>
        </svg>`,
      hotspotX: 5,
      hotspotY: 3,
    },
    text: {
      svg: () => `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <rect x="10" y="3" width="4" height="20" fill="black"/>
          <rect x="6" y="23" width="12" height="4" fill="black"/>
          <rect x="14" y="3" width="4" height="6" fill="black"/>
          <rect x="6" y="3" width="4" height="6" fill="black"/>
        </svg>`,
      hotspotX: 12,
      hotspotY: 16,
    },
    crosshair: {
      svg: () => `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="10" fill="none" stroke="black" stroke-width="2"/>
          <line x1="16" y1="2" x2="16" y2="12" stroke="black" stroke-width="2"/>
          <line x1="16" y1="20" x2="16" y2="30" stroke="black" stroke-width="2"/>
          <line x1="2" y1="16" x2="12" y2="16" stroke="black" stroke-width="2"/>
          <line x1="20" y1="16" x2="30" y2="16" stroke="black" stroke-width="2"/>
        </svg>`,
      hotspotX: 16,
      hotspotY: 16,
    },
    move: {
      svg: () => `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <path d="M16 4 L16 28 M4 16 L28 16 M8 8 L12 4 L16 8 L12 12 Z M24 8 L28 12 L24 16 L20 12 Z M8 24 L12 20 L16 24 L12 28 Z M24 24 L28 20 L24 16 L20 20 Z" 
                stroke="black" stroke-width="2" fill="none"/>
        </svg>`,
      hotspotX: 16,
      hotspotY: 16,
    },
    grab: {
      svg: () => `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <path d="M10 12 L10 24 C10 26 12 28 14 28 L22 28 C24 28 26 26 26 24 L26 14 L22 10 L18 14 L14 10 L10 12 Z" 
                fill="white" stroke="black" stroke-width="2"/>
        </svg>`,
      hotspotX: 14,
      hotspotY: 12,
    },
    grabbing: {
      svg: () => `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <path d="M8 12 L8 24 C8 26 10 28 12 28 L20 28 C22 28 24 26 24 24 L24 12 L20 8 L16 12 L12 8 L8 12 Z" 
                fill="white" stroke="black" stroke-width="2"/>
        </svg>`,
      hotspotX: 12,
      hotspotY: 10,
    },
    wait: {
      svg: () => `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="12" fill="white" stroke="black" stroke-width="2"/>
          <line x1="16" y1="16" x2="22" y2="10" stroke="black" stroke-width="2"/>
          <line x1="16" y1="16" x2="16" y2="8" stroke="black" stroke-width="2"/>
        </svg>`,
      hotspotX: 16,
      hotspotY: 16,
    },
    "not-allowed": {
      svg: () => `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="12" fill="none" stroke="black" stroke-width="2"/>
          <line x1="8" y1="8" x2="24" y2="24" stroke="red" stroke-width="3"/>
        </svg>`,
      hotspotX: 16,
      hotspotY: 16,
    },
  };

  const createVirtualCursor = () => {
    if (virtualCursorElement) return;

    const el = document.createElement("div");
    el.id = "virtual-mouse-cursor";
    el.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 99999;
      display: none;
    `;

    const img = document.createElement("img");
    img.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
    `;
    img.src = "data:image/svg+xml," + encodeURIComponent(DEFAULT_CURSOR_SVG);
    el.appendChild(img);

    document.body.appendChild(el);
    virtualCursorElement = el;
    virtualCursorImg = img;
  };

  const updateVirtualCursorIcon = () => {
    if (!virtualCursorImg || !virtualCursorElement) return;

    const canvasCursor = getComputedStyle(canvas).cursor;

    if (canvasCursor === "none") {
      virtualCursorElement.style.display = "none";
      return;
    }

    let offsetX = 0;
    let offsetY = 0;

    if (canvasCursor.includes("url(")) {
      const urlMatch = canvasCursor.match(
        /url\("([^"]+)"\)\s*(-?\d+\.?\d*)\s*(-?\d+\.?\d*)/
      );
      if (urlMatch) {
        virtualCursorImg.src = urlMatch[1];
        offsetX = parseFloat(urlMatch[2]) || 0;
        offsetY = parseFloat(urlMatch[3]) || 0;

        virtualCursorImg.style.width = customCursorSize.width + "px";
        virtualCursorImg.style.height = customCursorSize.height + "px";
      }
    } else {
      const cursorType = canvasCursor.split(",")[0].trim();
      const renderer = CURSOR_RENDERERS[cursorType];
      const defaultRenderer = CURSOR_RENDERERS["default"];
      const svgContent = renderer ? renderer.svg() : defaultRenderer.svg();
      virtualCursorImg.src =
        "data:image/svg+xml," + encodeURIComponent(svgContent);
      virtualCursorImg.style.width = "32px";
      virtualCursorImg.style.height = "32px";

      if (renderer) {
        offsetX = renderer.hotspotX;
        offsetY = renderer.hotspotY;
      } else {
        offsetX = defaultRenderer.hotspotX;
        offsetY = defaultRenderer.hotspotY;
      }
    }

    virtualCursorElement.style.marginLeft = -offsetX + "px";
    virtualCursorElement.style.marginTop = -offsetY + "px";
  };

  const updateVirtualCursorPosition = () => {
    if (!virtualCursorElement || !virtualCursorVisible) return;
    const { width, height } = rect;
    const stageWidth = mouse.runtime.stageWidth;
    const stageHeight = mouse.runtime.stageHeight;
    const pixelX = rect.left + (mouse._scratchX / stageWidth + 0.5) * width;
    const pixelY = rect.top + (0.5 - mouse._scratchY / stageHeight) * height;
    virtualCursorElement.style.left = pixelX + "px";
    virtualCursorElement.style.top = pixelY + "px";
  };

  // ==================== 鼠标光标样式相关 ====================
  const lazilyCreatedCanvas = () => {
    let canvasEl = null;
    let ctx = null;
    return (width, height) => {
      if (!canvasEl) {
        canvasEl = document.createElement("canvas");
        ctx = canvasEl.getContext("2d");
        if (!ctx) {
          throw new Error("无法获取2d渲染上下文");
        }
      }
      canvasEl.width = width;
      canvasEl.height = height;
      return [canvasEl, ctx];
    };
  };
  const getRawSkinCanvas = lazilyCreatedCanvas();

  const encodeSkinToURL = (skin) => {
    const svgSkin = skin;
    if (svgSkin._svgImage) {
      return svgSkin._svgImage.src;
    }
    const silhouette = skin._silhouette;
    if (silhouette.unlazy) {
      silhouette.unlazy();
    }
    const colorData = silhouette._colorData;
    const width = silhouette._width;
    const height = silhouette._height;
    const imageData = new ImageData(colorData, width, height);
    const [canvasEl, ctx] = getRawSkinCanvas(width, height);
    ctx.putImageData(imageData, 0, 0);
    return canvasEl.toDataURL();
  };

  const costumeToCursor = (costume, maxWidth, maxHeight) => {
    const skin = Scratch.vm.renderer._allSkins[costume.skinId];
    const imageURI = encodeSkinToURL(skin);

    const originalWidth = skin.size[0];
    const originalHeight = skin.size[1];
    let width = originalWidth;
    let height = originalHeight;

    let scale = 1;
    if (maxWidth > 0 && width > maxWidth) {
      scale = Math.min(scale, maxWidth / width);
    }
    if (maxHeight > 0 && height > maxHeight) {
      scale = Math.min(scale, maxHeight / height);
    }

    width = Math.round(width * scale);
    height = Math.round(height * scale);

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${originalWidth} ${originalHeight}">`;
    svg += `<image href="${imageURI}" width="${originalWidth}" height="${originalHeight}" preserveAspectRatio="xMidYMid meet"/>`;
    svg += "</svg>";
    const svgURI = `data:image/svg+xml,${encodeURIComponent(svg)}`;

    return {
      uri: svgURI,
      width: width,
      height: height,
    };
  };

  let nativeCursor = "default";
  let customCursorImageName = null;
  let currentCanvasCursor = nativeCursor;

  const updateCanvasCursor = () => {
    if (canvas.style.cursor !== currentCanvasCursor) {
      canvas.style.cursor = currentCanvasCursor;
    }
    setTimeout(updateVirtualCursorIcon, 0);
  };

  new MutationObserver(updateCanvasCursor).observe(canvas, {
    attributeFilter: ["style"],
    attributes: true,
  });

  const parseTuple = (string) => {
    const [a, b] = ("" + string).split(/[ ,x]/);
    return [+a || 0, +b || 0];
  };

  const ALL_ALLOWED_CURSORS = [
    "none",
    "default",
    "pointer",
    "move",
    "grab",
    "grabbing",
    "text",
    "vertical-text",
    "wait",
    "progress",
    "help",
    "context-menu",
    "zoom-in",
    "zoom-out",
    "crosshair",
    "cell",
    "not-allowed",
    "copy",
    "alias",
    "no-drop",
    "all-scroll",
    "col-resize",
    "row-resize",
    "n-resize",
    "e-resize",
    "s-resize",
    "w-resize",
    "ne-resize",
    "nw-resize",
    "se-resize",
    "sw-resize",
    "ew-resize",
    "ns-resize",
    "nesw-resize",
    "nwse-resize",
  ];

  // ==================== 主循环钩子 ====================
  const oldStep = vm.runtime._step;
  vm.runtime._step = function (...args) {
    const ret = oldStep.call(this, ...args);

    if (isPointerLockEnabled) {
      const { width, height } = rect;
      mouse._clientX = width / 2;
      mouse._clientY = height / 2;
      mouse._scratchX = 0;
      mouse._scratchY = 0;
    }

    if (virtualCursorVisible) {
      updateVirtualCursorPosition();
    }
    return ret;
  };

  // ==================== 扩展类 ====================
  class MousePlus {
    constructor() {
      vm.runtime.on("RUNTIME_DISPOSED", () => {
        this.setCur({ cur: "default" });
      });
    }

    getInfo() {
      return {
        id: "mouseplus",
        name: "鼠标+",
        blockIconURI: BLOCK_ICON_SVG,
        menuIconURI: BLOCK_ICON_SVG,
        blocks: [
          // ---- 指针锁定积木 ----
          {
            opcode: "setLocked",
            blockType: Scratch.BlockType.COMMAND,
            text: "将指针锁定设为 [enabled]",
            arguments: {
              enabled: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "true",
                menu: "enabled",
              },
            },
          },
          {
            opcode: "isLocked",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "指针已锁定？",
          },
          "---",
          // ---- 原有鼠标位置控制积木 ----
          {
            opcode: "setMouseX",
            blockType: Scratch.BlockType.COMMAND,
            text: "将鼠标x坐标设为 [X]",
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            },
          },
          {
            opcode: "setMouseY",
            blockType: Scratch.BlockType.COMMAND,
            text: "将鼠标y坐标设为 [Y]",
            arguments: {
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            },
          },
          {
            opcode: "setMouseXY",
            blockType: Scratch.BlockType.COMMAND,
            text: "将鼠标移动到 x: [X] y: [Y]",
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            },
          },
          {
            opcode: "changeMouseX",
            blockType: Scratch.BlockType.COMMAND,
            text: "将鼠标x坐标增加 [DX]",
            arguments: {
              DX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
            },
          },
          {
            opcode: "changeMouseY",
            blockType: Scratch.BlockType.COMMAND,
            text: "将鼠标y坐标增加 [DY]",
            arguments: {
              DY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
            },
          },
          "---",
          // ---- 虚拟鼠标指针显示控制 ----
          {
            opcode: "showVirtualCursor",
            blockType: Scratch.BlockType.COMMAND,
            text: "显示虚拟鼠标指针",
          },
          {
            opcode: "hideVirtualCursor",
            blockType: Scratch.BlockType.COMMAND,
            text: "隐藏虚拟鼠标指针",
          },
          {
            opcode: "isVirtualCursorVisible",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "虚拟鼠标指针可见？",
          },
          "---",
          // ---- 光标控制积木 ----
          {
            opcode: "setCur",
            blockType: Scratch.BlockType.COMMAND,
            text: "将光标样式设为 [cur]",
            arguments: {
              cur: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "default",
                menu: "cursors",
              },
            },
          },
          {
            opcode: "setCursorImage",
            blockType: Scratch.BlockType.COMMAND,
            text: "将光标设为当前造型 中心点: [position] 最大尺寸: [size]",
            arguments: {
              position: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "50,50",
                menu: "imagePositions",
              },
              size: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "32x32",
                menu: "imageSizes",
              },
            },
          },
          {
            opcode: "getCur",
            blockType: Scratch.BlockType.REPORTER,
            text: "当前光标样式",
          },
        ],
        menus: {
          enabled: {
            acceptReporters: true,
            items: [
              { text: "启用", value: "true" },
              { text: "禁用", value: "false" },
            ],
          },
          cursors: {
            acceptReporters: true,
            items: [
              { text: "默认", value: "default" },
              { text: "隐藏", value: "none" },
              { text: "可点击", value: "pointer" },
              { text: "移动", value: "move" },
              { text: "抓手", value: "grab" },
              { text: "抓取中", value: "grabbing" },
              { text: "输入文本", value: "text" },
              { text: "繁忙", value: "wait" },
              { text: "加载中", value: "progress" },
              { text: "帮助", value: "help" },
              { text: "可右键", value: "context-menu" },
              { text: "放大", value: "zoom-in" },
              { text: "缩小", value: "zoom-out" },
              { text: "十字准星", value: "crosshair" },
              { text: "不可用", value: "not-allowed" },
              { text: "复制", value: "copy" },
              { text: "创建快捷方式", value: "alias" },
            ],
          },
          imagePositions: {
            acceptReporters: true,
            items: [
              { text: "顶部左侧", value: "0,0" },
              { text: "顶部右侧", value: "100,0" },
              { text: "底部左侧", value: "0,100" },
              { text: "底部右侧", value: "100,100" },
              { text: "居中", value: "50,50" },
            ],
          },
          imageSizes: {
            acceptReporters: true,
            items: [
              { text: "16x16", value: "16x16" },
              { text: "32x32", value: "32x32" },
              { text: "48x48", value: "48x48" },
              { text: "64x64", value: "64x64" },
              { text: "128x128 (实验性)", value: "128x128" },
            ],
          },
        },
      };
    }

    // ---- 指针锁定方法 ----
    setLocked(args) {
      isPointerLockEnabled = Scratch.Cast.toBoolean(args.enabled) === true;
      if (!isPointerLockEnabled && isLocked) {
        document.exitPointerLock();
      }
    }

    isLocked() {
      return isLocked;
    }

    // ---- 位置控制方法 ----
    setMouseX(args) {
      const x = Scratch.Cast.toNumber(args.X);
      mouse._clientX = (x / mouse.runtime.stageWidth + 0.5) * rect.width;
      mouse._scratchX = x;
    }
    setMouseY(args) {
      const y = Scratch.Cast.toNumber(args.Y);
      mouse._clientY = (0.5 - y / mouse.runtime.stageHeight) * rect.height;
      mouse._scratchY = y;
    }
    setMouseXY(args) {
      this.setMouseX(args);
      this.setMouseY(args);
    }
    changeMouseX(args) {
      mouse._scratchX += Scratch.Cast.toNumber(args.DX);
      mouse._clientX =
        (mouse._scratchX / mouse.runtime.stageWidth + 0.5) * rect.width;
    }
    changeMouseY(args) {
      mouse._scratchY += Scratch.Cast.toNumber(args.DY);
      mouse._clientY =
        (0.5 - mouse._scratchY / mouse.runtime.stageHeight) * rect.height;
    }

    // ---- 虚拟指针方法 ----
    showVirtualCursor() {
      createVirtualCursor();
      virtualCursorVisible = true;
      virtualCursorElement.style.display = "";
      updateVirtualCursorIcon();
      updateVirtualCursorPosition();
    }
    hideVirtualCursor() {
      virtualCursorVisible = false;
      if (virtualCursorElement) {
        virtualCursorElement.style.display = "none";
      }
    }
    isVirtualCursorVisible() {
      return virtualCursorVisible;
    }

    // ---- 光标样式方法 ----
    setCur(args) {
      const newCursor = Scratch.Cast.toString(args.cur);
      if (ALL_ALLOWED_CURSORS.includes(newCursor)) {
        nativeCursor = newCursor;
        customCursorImageName = null;
        currentCanvasCursor = newCursor;
        updateCanvasCursor();
      }
    }
    setCursorImage(args, util) {
      const [maxWidth, maxHeight] = parseTuple(args.size).map((i) =>
        Math.max(0, i)
      );
      const currentCostume =
        util.target.getCostumes()[util.target.currentCostume];
      const costumeName = currentCostume.name;
      let encodedCostume;
      try {
        encodedCostume = costumeToCursor(
          currentCostume,
          maxWidth || Infinity,
          maxHeight || Infinity
        );
      } catch (e) {
        console.error(e);
      }
      if (encodedCostume) {
        customCursorSize.width = encodedCostume.width;
        customCursorSize.height = encodedCostume.height;

        const [percentX, percentY] = parseTuple(args.position).map(
          (i) => Math.max(0, Math.min(100, i)) / 100
        );
        const x = Math.round(percentX * encodedCostume.width);
        const y = Math.round(percentY * encodedCostume.height);

        currentCanvasCursor = `url("${encodedCostume.uri}") ${x} ${y}, ${nativeCursor}`;
        updateCanvasCursor();
      }
      customCursorImageName = costumeName;
    }
    getCur() {
      if (customCursorImageName !== null) {
        return customCursorImageName;
      }
      return nativeCursor;
    }
  }

  Scratch.extensions.register(new MousePlus());
})(Scratch);
