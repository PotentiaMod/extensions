// Name: 选择框
// ID: selectbox
// Description: 添加选择框
// By: Yesshape <https://scratch.mit.edu/users/yesshape/>
(function (Scratch) {
  "use strict";

  class SelectBoxExtension {
    constructor() {
      this.selectBoxes = new Map();
      this.lastValues = new Map();
      this.stageObserver = null;

      this.initStageObserver();
    }

    getInfo() {
      return {
        id: "selectbox",
        name: "选择框",
        color1: "#4C97FF",
        color2: "#3373CC",
        blocks: [
          {
            opcode: "createSelectBox",
            blockType: Scratch.BlockType.COMMAND,
            text: "创建选择框ID [ID] 名称 [NAME] 选项 [OPTIONS] 默认 [DEFAULT]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "选择框1",
              },
              OPTIONS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "选项1,选项2,选项3",
              },
              DEFAULT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "选项1",
              },
            },
          },
          {
            opcode: "setSelectBoxName",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置选择框 [ID] 的名称为 [NAME]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "新名称",
              },
            },
          },
          {
            opcode: "setSelectBoxNamePosition",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置选择框 [ID] 的名称位置为 [POSITION]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
              POSITION: {
                type: Scratch.ArgumentType.STRING,
                menu: "namePosition",
                defaultValue: "top",
              },
            },
          },
          {
            opcode: "setSelectBoxNameSize",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置选择框 [ID] 的名称大小为 [SIZE]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
              SIZE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 14,
              },
            },
          },
          {
            opcode: "setSelectBoxNameFontColor",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置选择框 [ID] 的名称字体颜色为 [COLOR]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
              COLOR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "#000000",
              },
            },
          },
          {
            opcode: "setSelectBoxTextSize",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置选择框 [ID] 的文字大小为 [SIZE]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
              SIZE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 14,
              },
            },
          },
          {
            opcode: "showSelectBoxName",
            blockType: Scratch.BlockType.COMMAND,
            text: "显示选择框 [ID] 的名称",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "hideSelectBoxName",
            blockType: Scratch.BlockType.COMMAND,
            text: "隐藏选择框 [ID] 的名称",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "setSelectBoxOptions",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置选择框 [ID] 的选项为 [OPTIONS]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
              OPTIONS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "新选项1,新选项2,新选项3",
              },
            },
          },
          {
            opcode: "setSelectBoxPositionMode",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置选择框 [ID] 坐标方式为 [MODE]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
              MODE: {
                type: Scratch.ArgumentType.STRING,
                menu: "positionMode",
                defaultValue: "stage",
              },
            },
          },
          {
            opcode: "setSelectBoxPosition",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置选择框 [ID] 为 [COORD_TYPE] 坐标 x: [X] y: [Y]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
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
            opcode: "setSelectBoxBackgroundColor",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置选择框 [ID] 的背景颜色为 [COLOR]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
              COLOR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "#ffffff",
              },
            },
          },
          {
            opcode: "setSelectBoxBackgroundURL",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置选择框 [ID] 的背景为URL: [URL]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "setSelectBoxFont",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置选择框 [ID] 的字体为 [FONT]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
              FONT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Sans Serif",
              },
            },
          },
          {
            opcode: "setSelectBoxFontColor",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置选择框 [ID] 的字体颜色为 [COLOR]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
              COLOR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "#000000",
              },
            },
          },
          {
            opcode: "setSelectBoxWidth",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置选择框 [ID] 的宽度为: [WIDTH]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 150,
              },
            },
          },
          {
            opcode: "setSelectBoxHeight",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置选择框 [ID] 的高度为: [HEIGHT]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 80,
              },
            },
          },
          {
            opcode: "hideSelectBox",
            blockType: Scratch.BlockType.COMMAND,
            text: "隐藏选择框 [ID]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "showSelectBox",
            blockType: Scratch.BlockType.COMMAND,
            text: "显示选择框 [ID]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "getSelectBoxCount",
            blockType: Scratch.BlockType.REPORTER,
            text: "选择框数量",
          },
          {
            opcode: "getAllSelectBoxNames",
            blockType: Scratch.BlockType.REPORTER,
            text: "所有选择框名称",
          },
          {
            opcode: "getSelectBoxValue",
            blockType: Scratch.BlockType.REPORTER,
            text: "选择框 [ID] 的值",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "getSelectBoxName",
            blockType: Scratch.BlockType.REPORTER,
            text: "选择框 [ID] 的名称",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "getSelectBoxNamePosition",
            blockType: Scratch.BlockType.REPORTER,
            text: "选择框 [ID] 的名称位置",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "getSelectBoxNameFontColor",
            blockType: Scratch.BlockType.REPORTER,
            text: "选择框 [ID] 的名称字体颜色",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "getSelectBoxTextSize",
            blockType: Scratch.BlockType.REPORTER,
            text: "选择框 [ID] 的文字大小",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "getSelectBoxStageX",
            blockType: Scratch.BlockType.REPORTER,
            text: "选择框 [ID] 的舞台x坐标",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "getSelectBoxStageY",
            blockType: Scratch.BlockType.REPORTER,
            text: "选择框 [ID] 的舞台y坐标",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "getSelectBoxWorldX",
            blockType: Scratch.BlockType.REPORTER,
            text: "选择框 [ID] 的世界x坐标",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "getSelectBoxWorldY",
            blockType: Scratch.BlockType.REPORTER,
            text: "选择框 [ID] 的世界y坐标",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "getSelectBoxPositionMode",
            blockType: Scratch.BlockType.REPORTER,
            text: "选择框 [ID] 的坐标方式",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "getSelectBoxFont",
            blockType: Scratch.BlockType.REPORTER,
            text: "选择框 [ID] 的字体",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "getSelectBoxFontColor",
            blockType: Scratch.BlockType.REPORTER,
            text: "选择框 [ID] 的字体颜色",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "getSelectBoxWidth",
            blockType: Scratch.BlockType.REPORTER,
            text: "选择框 [ID] 的宽度",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "getSelectBoxHeight",
            blockType: Scratch.BlockType.REPORTER,
            text: "选择框 [ID] 的高度",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "hasSelectBox",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "有 [ID] 这个选择框吗？",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "deleteSelectBox",
            blockType: Scratch.BlockType.COMMAND,
            text: "删除选择框 [ID]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "select1",
              },
            },
          },
          {
            opcode: "clearAllSelectBoxes",
            blockType: Scratch.BlockType.COMMAND,
            text: "清除所有选择框",
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
      for (const [id, selectBoxData] of this.selectBoxes) {
        if (selectBoxData.positionMode === "舞台坐标") {
          this.updateSelectBoxStagePosition(id);
        }
      }
    }

    // 创建选择框
    createSelectBox(args) {
      const id = args.ID;
      const name = args.NAME;
      const options = args.OPTIONS.split(",").map((opt) => opt.trim());
      const defaultValue = args.DEFAULT;

      if (this.selectBoxes.has(id)) {
        this.deleteSelectBox({ ID: id });
      }

      // 创建容器
      const container = document.createElement("div");
      container.id = `selectbox-container-${id}`;
      container.style.position = "absolute";
      container.style.zIndex = "9999";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.alignItems = "flex-start";
      container.style.gap = "5px";

      // 创建名称标签
      const nameLabel = document.createElement("label");
      nameLabel.id = `selectbox-label-${id}`;
      nameLabel.textContent = name;
      nameLabel.style.fontFamily = "Sans Serif";
      nameLabel.style.fontSize = "14px";
      nameLabel.style.color = "#000000";
      nameLabel.style.fontWeight = "bold";
      nameLabel.style.marginBottom = "2px";
      nameLabel.style.cursor = "default";
      nameLabel.htmlFor = `selectbox-${id}`;
      nameLabel.style.display = "block";

      // 创建选择框
      const selectBox = document.createElement("select");
      selectBox.id = `selectbox-${id}`;
      selectBox.style.width = "150px";
      selectBox.style.height = "30px";
      selectBox.style.fontFamily = "Sans Serif";
      selectBox.style.fontSize = "14px";
      selectBox.style.color = "#000000";
      selectBox.style.backgroundColor = "#ffffff";
      selectBox.style.border = "1px solid #cccccc";
      selectBox.style.borderRadius = "4px";
      selectBox.style.padding = "4px";

      // 添加选项
      options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = option;
        if (option === defaultValue) {
          optionElement.selected = true;
        }
        selectBox.appendChild(optionElement);
      });

      // 组装容器
      container.appendChild(nameLabel);
      container.appendChild(selectBox);
      document.body.appendChild(container);

      // 存储选择框信息
      this.selectBoxes.set(id, {
        container: container,
        nameLabel: nameLabel,
        element: selectBox,
        name: name,
        value: defaultValue,
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
        width: 150,
        height: 30,
        visible: true,
      });

      this.lastValues.set(id, defaultValue);

      // 事件监听器
      selectBox.addEventListener("change", async () => {
        let value = selectBox.value;
        const selectBoxData = this.selectBoxes.get(id);
        const oldValue = this.lastValues.get(id);

        if (value === oldValue) return;

        // 处理特殊选项
        if (value.includes("输入值")) {
          const input = prompt("请输入文本:");
          if (input !== null) {
            value = input;
          } else {
            selectBox.value = oldValue;
            return;
          }
        } else if (value.includes("导入URL")) {
          try {
            const fileUrl = await this.handleFileImport();
            if (fileUrl) {
              value = fileUrl;
            } else {
              selectBox.value = oldValue;
              return;
            }
          } catch (error) {
            console.error("文件导入错误:", error);
            selectBox.value = oldValue;
            return;
          }
        }

        // 更新值
        selectBoxData.value = value;
        this.lastValues.set(id, value);
      });

      this.updateSelectBoxPosition(id);
    }

    // 设置选择框名称
    setSelectBoxName(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return;

      const selectBoxData = this.selectBoxes.get(id);
      const newName = args.NAME;

      selectBoxData.name = newName;
      selectBoxData.nameLabel.textContent = newName;
    }

    // 设置名称位置
    setSelectBoxNamePosition(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return;

      const selectBoxData = this.selectBoxes.get(id);
      const position = args.POSITION;

      selectBoxData.namePosition = position;
      this.updateNamePosition(id, position);
    }

    // 更新名称位置
    updateNamePosition(id, position) {
      const selectBoxData = this.selectBoxes.get(id);
      if (!selectBoxData) return;

      const container = selectBoxData.container;
      const nameLabel = selectBoxData.nameLabel;
      const selectBox = selectBoxData.element;

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
          container.appendChild(selectBox);
          break;
        case "居右":
          container.style.flexDirection = "row";
          container.style.alignItems = "center";
          container.style.gap = "8px";
          container.appendChild(selectBox);
          container.appendChild(nameLabel);
          break;
        case "居上":
          container.style.flexDirection = "column";
          container.style.alignItems = "flex-start";
          container.style.gap = "5px";
          container.appendChild(nameLabel);
          container.appendChild(selectBox);
          break;
        case "居下":
          container.style.flexDirection = "column";
          container.style.alignItems = "flex-start";
          container.style.gap = "5px";
          container.appendChild(selectBox);
          container.appendChild(nameLabel);
          break;
      }
    }

    // 设置名称大小
    setSelectBoxNameSize(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return;

      const selectBoxData = this.selectBoxes.get(id);
      const size = args.SIZE;

      selectBoxData.nameSize = size;
      selectBoxData.nameLabel.style.fontSize = `${size}px`;
    }

    // 设置名称字体颜色
    setSelectBoxNameFontColor(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return;

      const selectBoxData = this.selectBoxes.get(id);
      const color = args.COLOR;

      selectBoxData.nameFontColor = color;
      selectBoxData.nameLabel.style.color = color;
    }

    // 设置选择框文字大小
    setSelectBoxTextSize(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return;

      const selectBoxData = this.selectBoxes.get(id);
      const size = args.SIZE;

      selectBoxData.textSize = size;
      selectBoxData.element.style.fontSize = `${size}px`;
    }

    // 显示名称
    showSelectBoxName(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return;

      const selectBoxData = this.selectBoxes.get(id);

      selectBoxData.nameVisible = true;
      selectBoxData.nameLabel.style.display = "block";
    }

    // 隐藏名称
    hideSelectBoxName(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return;

      const selectBoxData = this.selectBoxes.get(id);

      selectBoxData.nameVisible = false;
      selectBoxData.nameLabel.style.display = "none";
    }

    // 设置坐标方式
    setSelectBoxPositionMode(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return;

      const selectBoxData = this.selectBoxes.get(id);
      const mode = args.MODE;

      selectBoxData.positionMode = mode;
      this.updateSelectBoxPosition(id);
    }

    // 设置坐标位置
    setSelectBoxPosition(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return;

      const selectBoxData = this.selectBoxes.get(id);
      const coordType = args.COORD_TYPE;
      const x = args.X;
      const y = args.Y;

      if (coordType === "舞台坐标") {
        selectBoxData.stageX = x;
        selectBoxData.stageY = y;
      } else if (coordType === "世界坐标") {
        selectBoxData.worldX = x;
        selectBoxData.worldY = y;
      }

      this.updateSelectBoxPosition(id);
    }

    // 更新选择框位置
    updateSelectBoxPosition(id) {
      const selectBoxData = this.selectBoxes.get(id);
      if (!selectBoxData) return;

      const mode = selectBoxData.positionMode;

      if (mode === "舞台坐标") {
        this.updateSelectBoxStagePosition(id);
      } else if (mode === "世界坐标") {
        this.updateSelectBoxWorldPosition(id);
      }
    }

    // 更新舞台坐标位置
    updateSelectBoxStagePosition(id) {
      const selectBoxData = this.selectBoxes.get(id);
      if (!selectBoxData) return;

      const stage = this.getStageElement();
      if (!stage) {
        this.updateSelectBoxWorldPosition(id);
        return;
      }

      const stageRect = stage.getBoundingClientRect();
      const stageWidth = stageRect.width;
      const stageHeight = stageRect.height;

      const scaleX = stageWidth / 480;
      const scaleY = stageHeight / 360;

      const pixelX = selectBoxData.stageX * scaleX + stageWidth / 2;
      const pixelY = stageHeight / 2 - selectBoxData.stageY * scaleY;

      const absoluteX = stageRect.left + pixelX;
      const absoluteY = stageRect.top + pixelY;

      selectBoxData.container.style.left = `${absoluteX}px`;
      selectBoxData.container.style.top = `${absoluteY}px`;
      selectBoxData.container.style.transform = "none";
    }

    // 更新世界坐标位置
    updateSelectBoxWorldPosition(id) {
      const selectBoxData = this.selectBoxes.get(id);
      if (!selectBoxData) return;

      selectBoxData.container.style.left = `${selectBoxData.worldX}px`;
      selectBoxData.container.style.top = `${selectBoxData.worldY}px`;
      selectBoxData.container.style.transform = "none";
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

    // 处理文件导入
    handleFileImport() {
      return new Promise((resolve, reject) => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "*/*";
        fileInput.style.display = "none";
        document.body.appendChild(fileInput);

        fileInput.addEventListener("change", () => {
          if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = function (e) {
              resolve(e.target.result);
            };

            reader.onerror = function (e) {
              reject(new Error("文件读取失败"));
            };

            reader.readAsDataURL(file);
          } else {
            resolve(null);
          }

          setTimeout(() => {
            if (fileInput.parentNode) {
              fileInput.parentNode.removeChild(fileInput);
            }
          }, 1000);
        });

        fileInput.addEventListener("cancel", () => {
          resolve(null);
          setTimeout(() => {
            if (fileInput.parentNode) {
              fileInput.parentNode.removeChild(fileInput);
            }
          }, 1000);
        });

        fileInput.click();
      });
    }

    // 设置选择框选项
    setSelectBoxOptions(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return;

      const selectBox = this.selectBoxes.get(id).element;
      const options = args.OPTIONS.split(",").map((opt) => opt.trim());

      while (selectBox.firstChild) {
        selectBox.removeChild(selectBox.firstChild);
      }

      options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = option;
        selectBox.appendChild(optionElement);
      });
    }

    // 设置背景颜色
    setSelectBoxBackgroundColor(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return;

      const selectBox = this.selectBoxes.get(id);
      const color = args.COLOR;

      selectBox.element.style.backgroundColor = color;
      selectBox.backgroundColor = color;
    }

    // 设置背景URL
    setSelectBoxBackgroundURL(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return;

      const selectBox = this.selectBoxes.get(id);
      const url = args.URL;

      if (url) {
        selectBox.element.style.backgroundImage = `url(${url})`;
        selectBox.element.style.backgroundSize = "cover";
        selectBox.backgroundURL = url;
      } else {
        selectBox.element.style.backgroundImage = "";
        selectBox.backgroundURL = "";
      }
    }

    // 设置字体
    setSelectBoxFont(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return;

      const selectBox = this.selectBoxes.get(id);
      const font = args.FONT;

      selectBox.element.style.fontFamily = font;
      selectBox.nameLabel.style.fontFamily = font;
      selectBox.font = font;
    }

    // 设置字体颜色
    setSelectBoxFontColor(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return;

      const selectBox = this.selectBoxes.get(id);
      const color = args.COLOR;

      selectBox.element.style.color = color;
      selectBox.nameLabel.style.color = color;
      selectBox.fontColor = color;
    }

    // 设置宽度
    setSelectBoxWidth(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return;

      const selectBox = this.selectBoxes.get(id);
      const width = args.WIDTH;

      selectBox.element.style.width = `${width}px`;
      selectBox.width = width;
    }

    // 设置高度
    setSelectBoxHeight(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return;

      const selectBox = this.selectBoxes.get(id);
      const height = args.HEIGHT;

      selectBox.element.style.height = `${height}px`;
      selectBox.height = height;
    }

    // 隐藏选择框
    hideSelectBox(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return;

      const selectBox = this.selectBoxes.get(id);
      selectBox.container.style.display = "none";
      selectBox.visible = false;
    }

    // 显示选择框
    showSelectBox(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return;

      const selectBox = this.selectBoxes.get(id);
      selectBox.container.style.display = "flex";
      selectBox.visible = true;
    }

    // 获取选择框数量
    getSelectBoxCount() {
      return this.selectBoxes.size;
    }

    // 获取所有选择框名称
    getAllSelectBoxNames() {
      return Array.from(this.selectBoxes.keys()).join(", ");
    }

    // 获取选择框值
    getSelectBoxValue(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return "";

      return this.selectBoxes.get(id).value;
    }

    // 获取选择框显示名称
    getSelectBoxName(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return "";

      return this.selectBoxes.get(id).name;
    }

    // 获取名称位置
    getSelectBoxNamePosition(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return "居上";

      return this.selectBoxes.get(id).namePosition;
    }

    // 获取名称字体颜色
    getSelectBoxNameFontColor(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return "#000000";

      return this.selectBoxes.get(id).nameFontColor;
    }

    // 获取选择框文字大小
    getSelectBoxTextSize(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return 14;

      return this.selectBoxes.get(id).textSize;
    }

    // 获取舞台X坐标
    getSelectBoxStageX(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return 0;

      return this.selectBoxes.get(id).stageX;
    }

    // 获取舞台Y坐标
    getSelectBoxStageY(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return 0;

      return this.selectBoxes.get(id).stageY;
    }

    // 获取世界X坐标
    getSelectBoxWorldX(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return 0;

      return this.selectBoxes.get(id).worldX;
    }

    // 获取世界Y坐标
    getSelectBoxWorldY(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return 0;

      return this.selectBoxes.get(id).worldY;
    }

    // 获取坐标方式
    getSelectBoxPositionMode(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return "舞台坐标";

      return this.selectBoxes.get(id).positionMode;
    }

    // 获取字体
    getSelectBoxFont(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return "Sans Serif";

      return this.selectBoxes.get(id).font;
    }

    // 获取字体颜色
    getSelectBoxFontColor(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return "#000000";

      return this.selectBoxes.get(id).fontColor;
    }

    // 获取宽度
    getSelectBoxWidth(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return 150;

      return this.selectBoxes.get(id).width;
    }

    // 获取高度
    getSelectBoxHeight(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return 30;

      return this.selectBoxes.get(id).height;
    }

    // 检查是否有选择框
    hasSelectBox(args) {
      const id = args.ID;
      return this.selectBoxes.has(id);
    }

    // 删除选择框
    deleteSelectBox(args) {
      const id = args.ID;
      if (!this.selectBoxes.has(id)) return;

      const selectBox = this.selectBoxes.get(id);
      if (selectBox.container.parentNode) {
        selectBox.container.parentNode.removeChild(selectBox.container);
      }

      this.selectBoxes.delete(id);
      this.lastValues.delete(id);
    }

    // 清除所有选择框
    clearAllSelectBoxes() {
      for (const [id, selectBox] of this.selectBoxes) {
        if (selectBox.container.parentNode) {
          selectBox.container.parentNode.removeChild(selectBox.container);
        }
      }

      this.selectBoxes.clear();
      this.lastValues.clear();
    }
  }

  // 注册扩展
  Scratch.extensions.register(new SelectBoxExtension());
})(window.Scratch);
