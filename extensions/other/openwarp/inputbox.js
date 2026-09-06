// Name: 输入框
// ID: inputbox
// Description: 添加输入框
// By: Yesshape <https://scratch.mit.edu/users/yesshape/>
(function (Scratch) {
  "use strict";

  class InputBoxExtension {
    constructor() {
      this.inputBoxes = new Map();
      this.lastValues = new Map();
      this.stageObserver = null;

      this.initStageObserver();
    }

    getInfo() {
      return {
        id: "inputbox",
        name: "输入框",
        color1: "#FF8C1A",
        color2: "#DB6E00",
        blocks: [
          {
            opcode: "createInputBox",
            blockType: Scratch.BlockType.COMMAND,
            text: "创建输入框ID [ID] 名称 [NAME] 默认值 [DEFAULT]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "输入框1",
              },
              DEFAULT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "setInputBoxName",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置输入框 [ID] 的名称为 [NAME]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "新名称",
              },
            },
          },
          {
            opcode: "setInputBoxNamePosition",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置输入框 [ID] 的名称位置为 [POSITION]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
              POSITION: {
                type: Scratch.ArgumentType.STRING,
                menu: "namePosition",
                defaultValue: "top",
              },
            },
          },
          {
            opcode: "setInputBoxNameSize",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置输入框 [ID] 的名称大小为 [SIZE]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
              SIZE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 14,
              },
            },
          },
          {
            opcode: "setInputBoxNameFontColor",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置输入框 [ID] 的名称字体颜色为 [COLOR]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
              COLOR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "#000000",
              },
            },
          },
          {
            opcode: "setInputBoxTextSize",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置输入框 [ID] 的文字大小为 [SIZE]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
              SIZE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 14,
              },
            },
          },
          {
            opcode: "setInputBoxPlaceholder",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置输入框 [ID] 的提示文本为 [TEXT]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "请输入...",
              },
            },
          },
          {
            opcode: "setInputBoxType",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置输入框 [ID] 的类型为 [TYPE]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "inputType",
                defaultValue: "text",
              },
            },
          },
          {
            opcode: "showInputBoxName",
            blockType: Scratch.BlockType.COMMAND,
            text: "显示输入框 [ID] 的名称",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "hideInputBoxName",
            blockType: Scratch.BlockType.COMMAND,
            text: "隐藏输入框 [ID] 的名称",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "setInputBoxPositionMode",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置输入框 [ID] 坐标方式为 [MODE]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
              MODE: {
                type: Scratch.ArgumentType.STRING,
                menu: "positionMode",
                defaultValue: "stage",
              },
            },
          },
          {
            opcode: "setInputBoxPosition",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置输入框 [ID] 为 [COORD_TYPE] 坐标 x: [X] y: [Y]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
              COORD_TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "coordType",
                defaultValue: "stage",
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            opcode: "setInputBoxBackgroundColor",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置输入框 [ID] 的背景颜色为 [COLOR]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
              COLOR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "#ffffff",
              },
            },
          },
          {
            opcode: "setInputBoxBackgroundURL",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置输入框 [ID] 的背景为URL: [URL]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "setInputBoxFont",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置输入框 [ID] 的字体为 [FONT]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
              FONT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Sans Serif",
              },
            },
          },
          {
            opcode: "setInputBoxFontColor",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置输入框 [ID] 的字体颜色为 [COLOR]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
              COLOR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "#000000",
              },
            },
          },
          {
            opcode: "setInputBoxWidth",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置输入框 [ID] 的宽度为: [WIDTH]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 200,
              },
            },
          },
          {
            opcode: "setInputBoxHeight",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置输入框 [ID] 的高度为: [HEIGHT]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 35,
              },
            },
          },
          {
            opcode: "setInputBoxValue",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置输入框 [ID] 的值为 [VALUE]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "新值",
              },
            },
          },
          {
            opcode: "hideInputBox",
            blockType: Scratch.BlockType.COMMAND,
            text: "隐藏输入框 [ID]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "showInputBox",
            blockType: Scratch.BlockType.COMMAND,
            text: "显示输入框 [ID]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "getInputBoxCount",
            blockType: Scratch.BlockType.REPORTER,
            text: "输入框数量",
          },
          {
            opcode: "getAllInputBoxNames",
            blockType: Scratch.BlockType.REPORTER,
            text: "所有输入框名称",
          },
          {
            opcode: "getInputBoxValue",
            blockType: Scratch.BlockType.REPORTER,
            text: "输入框 [ID] 的值",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "getInputBoxName",
            blockType: Scratch.BlockType.REPORTER,
            text: "输入框 [ID] 的名称",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "getInputBoxNamePosition",
            blockType: Scratch.BlockType.REPORTER,
            text: "输入框 [ID] 的名称位置",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "getInputBoxNameFontColor",
            blockType: Scratch.BlockType.REPORTER,
            text: "输入框 [ID] 的名称字体颜色",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "getInputBoxTextSize",
            blockType: Scratch.BlockType.REPORTER,
            text: "输入框 [ID] 的文字大小",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "getInputBoxPlaceholder",
            blockType: Scratch.BlockType.REPORTER,
            text: "输入框 [ID] 的提示文本",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "getInputBoxType",
            blockType: Scratch.BlockType.REPORTER,
            text: "输入框 [ID] 的类型",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "getInputBoxStageX",
            blockType: Scratch.BlockType.REPORTER,
            text: "输入框 [ID] 的舞台x坐标",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "getInputBoxStageY",
            blockType: Scratch.BlockType.REPORTER,
            text: "输入框 [ID] 的舞台y坐标",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "getInputBoxWorldX",
            blockType: Scratch.BlockType.REPORTER,
            text: "输入框 [ID] 的世界x坐标",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "getInputBoxWorldY",
            blockType: Scratch.BlockType.REPORTER,
            text: "输入框 [ID] 的世界y坐标",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "getInputBoxPositionMode",
            blockType: Scratch.BlockType.REPORTER,
            text: "输入框 [ID] 的坐标方式",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "getInputBoxFont",
            blockType: Scratch.BlockType.REPORTER,
            text: "输入框 [ID] 的字体",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "getInputBoxFontColor",
            blockType: Scratch.BlockType.REPORTER,
            text: "输入框 [ID] 的字体颜色",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "getInputBoxWidth",
            blockType: Scratch.BlockType.REPORTER,
            text: "输入框 [ID] 的宽度",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "getInputBoxHeight",
            blockType: Scratch.BlockType.REPORTER,
            text: "输入框 [ID] 的高度",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "hasInputBox",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "有 [ID] 这个输入框吗？",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "deleteInputBox",
            blockType: Scratch.BlockType.COMMAND,
            text: "删除输入框 [ID]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: "clearAllInputBoxes",
            blockType: Scratch.BlockType.COMMAND,
            text: "清除所有输入框",
          },
        ],
        menus: {
          positionMode: {
            acceptReporters: true,
            items: ["舞台坐标", "世界坐标"],
          },
          coordType: {
            acceptReporters: true,
            items: ["舞台坐标", "世界坐标"],
          },
          namePosition: {
            acceptReporters: true,
            items: ["居左", "居右", "居上", "居下"],
          },
          inputType: {
            acceptReporters: true,
            items: ["text", "password", "number", "email", "url"],
          },
        },
      };
    }

    // 初始化舞台大小变化监听
    initStageObserver() {
      const checkStage = () => {
        const stage = this.getStageElement();
        if (stage) {
          if (this.stageObserver) {
            this.stageObserver.disconnect();
          }

          this.stageObserver = new ResizeObserver(() => {
            this.onStageResize();
          });

          this.stageObserver.observe(stage);
          return true;
        }
        return false;
      };

      if (!checkStage()) {
        setTimeout(() => {
          if (!checkStage()) {
            const domObserver = new MutationObserver(() => {
              if (checkStage()) {
                domObserver.disconnect();
              }
            });
            domObserver.observe(document.body, {
              childList: true,
              subtree: true,
            });
          }
        }, 100);
      }
    }

    // 舞台大小变化时的回调
    onStageResize() {
      for (const [id, inputBoxData] of this.inputBoxes) {
        if (inputBoxData.positionMode === "舞台坐标") {
          this.updateInputBoxStagePosition(id);
        }
      }
    }

    // 创建输入框
    createInputBox(args) {
      const id = args.ID;
      const name = args.NAME;
      const defaultValue = args.DEFAULT;

      if (this.inputBoxes.has(id)) {
        this.deleteInputBox({ ID: id });
      }

      // 创建容器
      const container = document.createElement("div");
      container.id = `inputbox-container-${id}`;
      container.style.position = "absolute";
      container.style.zIndex = "9999";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.alignItems = "flex-start";
      container.style.gap = "5px";

      // 创建名称标签
      const nameLabel = document.createElement("label");
      nameLabel.id = `inputbox-label-${id}`;
      nameLabel.textContent = name;
      nameLabel.style.fontFamily = "Sans Serif";
      nameLabel.style.fontSize = "14px";
      nameLabel.style.color = "#000000";
      nameLabel.style.fontWeight = "bold";
      nameLabel.style.marginBottom = "2px";
      nameLabel.style.cursor = "default";
      nameLabel.htmlFor = `inputbox-${id}`;
      nameLabel.style.display = "block";

      // 创建输入框
      const inputBox = document.createElement("input");
      inputBox.id = `inputbox-${id}`;
      inputBox.type = "text";
      inputBox.value = defaultValue;
      inputBox.placeholder = "请输入...";
      inputBox.style.width = "200px";
      inputBox.style.height = "35px";
      inputBox.style.fontFamily = "Sans Serif";
      inputBox.style.fontSize = "14px";
      inputBox.style.color = "#000000";
      inputBox.style.backgroundColor = "#ffffff";
      inputBox.style.border = "1px solid #cccccc";
      inputBox.style.borderRadius = "4px";
      inputBox.style.padding = "4px 8px";
      inputBox.style.boxSizing = "border-box";

      // 组装容器
      container.appendChild(nameLabel);
      container.appendChild(inputBox);
      document.body.appendChild(container);

      // 存储输入框信息
      this.inputBoxes.set(id, {
        container: container,
        nameLabel: nameLabel,
        element: inputBox,
        name: name,
        value: defaultValue,
        placeholder: "请输入...",
        type: "text",
        stageX: 0,
        stageY: 0,
        worldX: 0,
        worldY: 0,
        positionMode: "舞台坐标",
        namePosition: "居上",
        nameSize: 14,
        nameFontColor: "#000000",
        nameVisible: true,
        textSize: 14,
        font: "Sans Serif",
        fontColor: "#000000",
        backgroundColor: "#ffffff",
        backgroundURL: "",
        width: 200,
        height: 35,
        visible: true,
      });

      this.lastValues.set(id, defaultValue);

      this.updateInputBoxPosition(id);
    }

    // 设置输入框名称
    setInputBoxName(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBoxData = this.inputBoxes.get(id);
      const newName = args.NAME;

      inputBoxData.name = newName;
      inputBoxData.nameLabel.textContent = newName;
    }

    // 设置名称位置
    setInputBoxNamePosition(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBoxData = this.inputBoxes.get(id);
      const position = args.POSITION;

      inputBoxData.namePosition = position;
      this.updateNamePosition(id, position);
    }

    // 更新名称位置
    updateNamePosition(id, position) {
      const inputBoxData = this.inputBoxes.get(id);
      if (!inputBoxData) return;

      const container = inputBoxData.container;
      const nameLabel = inputBoxData.nameLabel;
      const inputBox = inputBoxData.element;

      // 先移除所有子元素
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      // 根据位置重新排列
      switch (position) {
        case "居左":
          container.style.flexDirection = "row";
          container.style.alignItems = "center";
          container.style.gap = "8px";
          container.appendChild(nameLabel);
          container.appendChild(inputBox);
          break;
        case "居右":
          container.style.flexDirection = "row";
          container.style.alignItems = "center";
          container.style.gap = "8px";
          container.appendChild(inputBox);
          container.appendChild(nameLabel);
          break;
        case "居上":
          container.style.flexDirection = "column";
          container.style.alignItems = "flex-start";
          container.style.gap = "5px";
          container.appendChild(nameLabel);
          container.appendChild(inputBox);
          break;
        case "居下":
          container.style.flexDirection = "column";
          container.style.alignItems = "flex-start";
          container.style.gap = "5px";
          container.appendChild(inputBox);
          container.appendChild(nameLabel);
          break;
      }
    }

    // 设置名称大小
    setInputBoxNameSize(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBoxData = this.inputBoxes.get(id);
      const size = args.SIZE;

      inputBoxData.nameSize = size;
      inputBoxData.nameLabel.style.fontSize = `${size}px`;
    }

    // 设置名称字体颜色
    setInputBoxNameFontColor(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBoxData = this.inputBoxes.get(id);
      const color = args.COLOR;

      inputBoxData.nameFontColor = color;
      inputBoxData.nameLabel.style.color = color;
    }

    // 设置输入框文字大小
    setInputBoxTextSize(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBoxData = this.inputBoxes.get(id);
      const size = args.SIZE;

      inputBoxData.textSize = size;
      inputBoxData.element.style.fontSize = `${size}px`;
    }

    // 设置提示文本
    setInputBoxPlaceholder(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBoxData = this.inputBoxes.get(id);
      const text = args.TEXT;

      inputBoxData.placeholder = text;
      inputBoxData.element.placeholder = text;
    }

    // 设置输入框类型
    setInputBoxType(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBoxData = this.inputBoxes.get(id);
      const type = args.TYPE;

      inputBoxData.type = type;
      inputBoxData.element.type = type;
    }

    // 设置输入框值
    setInputBoxValue(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBoxData = this.inputBoxes.get(id);
      const value = args.VALUE;

      inputBoxData.value = value;
      inputBoxData.element.value = value;
      this.lastValues.set(id, value);
    }

    // 显示名称
    showInputBoxName(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBoxData = this.inputBoxes.get(id);

      inputBoxData.nameVisible = true;
      inputBoxData.nameLabel.style.display = "block";
    }

    // 隐藏名称
    hideInputBoxName(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBoxData = this.inputBoxes.get(id);

      inputBoxData.nameVisible = false;
      inputBoxData.nameLabel.style.display = "none";
    }

    // 设置坐标方式
    setInputBoxPositionMode(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBoxData = this.inputBoxes.get(id);
      const mode = args.MODE;

      inputBoxData.positionMode = mode;
      this.updateInputBoxPosition(id);
    }

    // 设置坐标位置
    setInputBoxPosition(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBoxData = this.inputBoxes.get(id);
      const coordType = args.COORD_TYPE;
      const x = args.X;
      const y = args.Y;

      if (coordType === "舞台坐标") {
        inputBoxData.stageX = x;
        inputBoxData.stageY = y;
      } else if (coordType === "世界坐标") {
        inputBoxData.worldX = x;
        inputBoxData.worldY = y;
      }

      this.updateInputBoxPosition(id);
    }

    // 更新输入框位置
    updateInputBoxPosition(id) {
      const inputBoxData = this.inputBoxes.get(id);
      if (!inputBoxData) return;

      const mode = inputBoxData.positionMode;

      if (mode === "舞台坐标") {
        this.updateInputBoxStagePosition(id);
      } else if (mode === "世界坐标") {
        this.updateInputBoxWorldPosition(id);
      }
    }

    // 更新舞台坐标位置
    updateInputBoxStagePosition(id) {
      const inputBoxData = this.inputBoxes.get(id);
      if (!inputBoxData) return;

      const stage = this.getStageElement();
      if (!stage) {
        this.updateInputBoxWorldPosition(id);
        return;
      }

      const stageRect = stage.getBoundingClientRect();
      const stageWidth = stageRect.width;
      const stageHeight = stageRect.height;

      const scaleX = stageWidth / 480;
      const scaleY = stageHeight / 360;

      const pixelX = inputBoxData.stageX * scaleX + stageWidth / 2;
      const pixelY = stageHeight / 2 - inputBoxData.stageY * scaleY;

      const absoluteX = stageRect.left + pixelX;
      const absoluteY = stageRect.top + pixelY;

      inputBoxData.container.style.left = `${absoluteX}px`;
      inputBoxData.container.style.top = `${absoluteY}px`;
      inputBoxData.container.style.transform = "none";
    }

    // 更新世界坐标位置
    updateInputBoxWorldPosition(id) {
      const inputBoxData = this.inputBoxes.get(id);
      if (!inputBoxData) return;

      inputBoxData.container.style.left = `${inputBoxData.worldX}px`;
      inputBoxData.container.style.top = `${inputBoxData.worldY}px`;
      inputBoxData.container.style.transform = "none";
    }

    // 获取舞台元素
    getStageElement() {
      return (
        document.querySelector('div[class*="stage-wrapper"]') ||
        document.querySelector("canvas") ||
        document.querySelector('div[class*="stage"]') ||
        document.querySelector('div[class*="player_stage-wrapper"]')
      );
    }

    // 设置背景颜色
    setInputBoxBackgroundColor(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBox = this.inputBoxes.get(id);
      const color = args.COLOR;

      inputBox.element.style.backgroundColor = color;
      inputBox.backgroundColor = color;
    }

    // 设置背景URL
    setInputBoxBackgroundURL(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBox = this.inputBoxes.get(id);
      const url = args.URL;

      if (url) {
        inputBox.element.style.backgroundImage = `url(${url})`;
        inputBox.element.style.backgroundSize = "cover";
        inputBox.backgroundURL = url;
      } else {
        inputBox.element.style.backgroundImage = "";
        inputBox.backgroundURL = "";
      }
    }

    // 设置字体
    setInputBoxFont(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBox = this.inputBoxes.get(id);
      const font = args.FONT;

      inputBox.element.style.fontFamily = font;
      inputBox.nameLabel.style.fontFamily = font;
      inputBox.font = font;
    }

    // 设置字体颜色
    setInputBoxFontColor(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBox = this.inputBoxes.get(id);
      const color = args.COLOR;

      inputBox.element.style.color = color;
      inputBox.nameLabel.style.color = color;
      inputBox.fontColor = color;
    }

    // 设置宽度
    setInputBoxWidth(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBox = this.inputBoxes.get(id);
      const width = args.WIDTH;

      inputBox.element.style.width = `${width}px`;
      inputBox.width = width;
    }

    // 设置高度
    setInputBoxHeight(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBox = this.inputBoxes.get(id);
      const height = args.HEIGHT;

      inputBox.element.style.height = `${height}px`;
      inputBox.height = height;
    }

    // 隐藏输入框
    hideInputBox(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBox = this.inputBoxes.get(id);
      inputBox.container.style.display = "none";
      inputBox.visible = false;
    }

    // 显示输入框
    showInputBox(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBox = this.inputBoxes.get(id);
      inputBox.container.style.display = "flex";
      inputBox.visible = true;
    }

    // 获取输入框数量
    getInputBoxCount() {
      return this.inputBoxes.size;
    }

    // 获取所有输入框名称
    getAllInputBoxNames() {
      return Array.from(this.inputBoxes.keys()).join(", ");
    }

    // 获取输入框值
    getInputBoxValue(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return "";

      const inputBoxData = this.inputBoxes.get(id);
      // 实时获取输入框的值
      return inputBoxData.element.value;
    }

    // 获取输入框显示名称
    getInputBoxName(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return "";

      return this.inputBoxes.get(id).name;
    }

    // 获取名称位置
    getInputBoxNamePosition(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return "居上";

      return this.inputBoxes.get(id).namePosition;
    }

    // 获取名称字体颜色
    getInputBoxNameFontColor(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return "#000000";

      return this.inputBoxes.get(id).nameFontColor;
    }

    // 获取输入框文字大小
    getInputBoxTextSize(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return 14;

      return this.inputBoxes.get(id).textSize;
    }

    // 获取提示文本
    getInputBoxPlaceholder(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return "";

      return this.inputBoxes.get(id).placeholder;
    }

    // 获取输入框类型
    getInputBoxType(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return "text";

      return this.inputBoxes.get(id).type;
    }

    // 获取舞台X坐标
    getInputBoxStageX(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return 0;

      return this.inputBoxes.get(id).stageX;
    }

    // 获取舞台Y坐标
    getInputBoxStageY(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return 0;

      return this.inputBoxes.get(id).stageY;
    }

    // 获取世界X坐标
    getInputBoxWorldX(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return 0;

      return this.inputBoxes.get(id).worldX;
    }

    // 获取世界Y坐标
    getInputBoxWorldY(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return 0;

      return this.inputBoxes.get(id).worldY;
    }

    // 获取坐标方式
    getInputBoxPositionMode(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return "舞台坐标";

      return this.inputBoxes.get(id).positionMode;
    }

    // 获取字体
    getInputBoxFont(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return "Sans Serif";

      return this.inputBoxes.get(id).font;
    }

    // 获取字体颜色
    getInputBoxFontColor(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return "#000000";

      return this.inputBoxes.get(id).fontColor;
    }

    // 获取宽度
    getInputBoxWidth(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return 200;

      return this.inputBoxes.get(id).width;
    }

    // 获取高度
    getInputBoxHeight(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return 35;

      return this.inputBoxes.get(id).height;
    }

    // 检查是否有输入框
    hasInputBox(args) {
      const id = args.ID;
      return this.inputBoxes.has(id);
    }

    // 删除输入框
    deleteInputBox(args) {
      const id = args.ID;
      if (!this.inputBoxes.has(id)) return;

      const inputBox = this.inputBoxes.get(id);
      if (inputBox.container.parentNode) {
        inputBox.container.parentNode.removeChild(inputBox.container);
      }

      this.inputBoxes.delete(id);
      this.lastValues.delete(id);
    }

    // 清除所有输入框
    clearAllInputBoxes() {
      for (const [id, inputBox] of this.inputBoxes) {
        if (inputBox.container.parentNode) {
          inputBox.container.parentNode.removeChild(inputBox.container);
        }
      }

      this.inputBoxes.clear();
      this.lastValues.clear();
    }
  }

  // 注册扩展
  Scratch.extensions.register(new InputBoxExtension());
})(window.Scratch);
