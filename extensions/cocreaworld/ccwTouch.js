

(function(Scratch) {
    "use strict";

    class CCTouch {
        constructor() {
            this.touches = [];
            this.lastTouches = [];
            this.gyroData = {
                alpha: 0,
                beta: 0,
                gamma: 0
            };
            this.filterState = {
                blur:0,
                brightness:100,
                contrast:100
            };
            this.gyroIsInit = false;
            this.setup();
        }

        setup() {
            const update = (e) => {
                this.lastTouches = [];
                for (let i = 0; i < this.touches.length; i++) {
                    const src = this.touches[i];
                    this.lastTouches[i] = {x: src.x, y: src.y};
                }

                const canvas = document.querySelector('canvas');
                if (!canvas) return;
                const rect = canvas.getBoundingClientRect();
                // 获取画布实际宽高，计算中心点
                const cw = rect.width;
                const ch = rect.height;
                const centerX = cw / 2;
                const centerY = ch / 2;

                this.touches = [];
                for (let i = 0; i < e.touches.length; i++) {
                    const t = e.touches[i];
                    // 自动映射：画布中心作为原点(0,0)
                    let rawX = (t.clientX - rect.left) - centerX;
                    let rawY = (t.clientY - rect.top) - centerY;
                    this.touches.push({ x: rawX, y: rawY });
                }
            };
            document.addEventListener('touchstart', update);
            document.addEventListener('touchmove', update);
            document.addEventListener('touchend', update);
            document.addEventListener('touchcancel', update);
        }

        setupGyroscope() {
            if(this.gyroIsInit) return;
            const gyroEvent = 'deviceorientation';
            const handleGyroData = (e) => {
                this.gyroData.alpha = (typeof e.alpha === 'number' && !isNaN(e.alpha)) ? e.alpha : 0;
                this.gyroData.beta = (typeof e.beta === 'number' && !isNaN(e.beta)) ? e.beta : 0;
                this.gyroData.gamma = (typeof e.gamma === 'number' && !isNaN(e.gamma)) ? e.gamma : 0;
            };

            if (DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission().then(function(permission) {
                    if (permission === 'granted') {
                        window.addEventListener(gyroEvent, handleGyroData);
                        this.gyroIsInit = true;
                    }
                }.bind(this)).catch(()=>{});
            } else {
                window.addEventListener(gyroEvent, handleGyroData);
                this.gyroIsInit = true;
            }
        }

        rebuildFilter(){
            const canvas = document.querySelector('canvas');
            if(!canvas) return;
            let parts = [];
            if(this.filterState.blur>0) parts.push("blur("+this.filterState.blur+"px)");
            parts.push("brightness("+this.filterState.brightness+"%)");
            parts.push("contrast("+this.filterState.contrast+"%)");
            canvas.style.filter = parts.join(" ");
        }

        getInfo() {
            return {
                id: "ccwTouch",
                name: "多指触摸(中心原点)+特效+陀螺仪",
                color1: "#4a90e2",
                blocks: [
                    {
                        opcode: "touchCount",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "触摸点数"
                    },
                    {
                        opcode: "isDown",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "第[ID]根手指按下",
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "x",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "第[ID]根手指 X",
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "y",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "第[ID]根手指 Y",
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "vibrate",
                        blockType: Scratch.BlockType.COMMAND,
                        text:"震动 [TIME]毫秒",
                        arguments:{
                            TIME:{type:Scratch.ArgumentType.NUMBER,defaultValue:200}
                        }
                    },
                    {
                        opcode: "setBlur",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "设置模糊强度 [BLUR]",
                        arguments: {
                            BLUR: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
                        }
                    },
                    {
                        opcode: "setNoise",
                        blockType: Scratch.BlockType.COMMAND,
                        text:"设置对比度 [CONTRAST]",
                        arguments:{
                            CONTRAST:{type:Scratch.ArgumentType.NUMBER,defaultValue:120}
                        }
                    },
                    {
                        opcode: "setBrightness",
                        blockType: Scratch.BlockType.COMMAND,
                        text:"设置画面亮度 [BRIGHT]%",
                        arguments:{
                            BRIGHT:{type:Scratch.ArgumentType.NUMBER,defaultValue:100}
                        }
                    },
                    {
                        opcode: "resetEffects",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "清除全部画面特效"
                    },
                    {
                        opcode:"initGyro",
                        blockType:Scratch.BlockType.COMMAND,
                        text:"初始化陀螺仪（必须点击触发）"
                    },
                    {
                        opcode: "getGyroAlpha",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "陀螺仪 Alpha值 (绕Z轴旋转)"
                    },
                    {
                        opcode: "getGyroBeta",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "陀螺仪 Beta值 (绕X轴旋转)"
                    },
                    {
                        opcode: "getGyroGamma",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "陀螺仪 Gamma值 (绕Y轴旋转)"
                    }
                ]
            };
        }

        touchCount() {
            return this.touches.length;
        }

        isDown(args) {
            const id = Math.floor(args.ID || 0);
            return id >= 0 && id < this.touches.length;
        }

        x(args) {
            const id = Math.floor(args.ID || 0);
            if (this.touches[id] && typeof this.touches[id].x === 'number') {
                return this.touches[id].x;
            } else {
                if(this.lastTouches[id]) return this.lastTouches[id].x;
                return 0;
            }
        }

        y(args) {
            const id = Math.floor(args.ID || 0);
            if (this.touches[id] && typeof this.touches[id].y === 'number') {
                return this.touches[id].y;
            } else {
                if(this.lastTouches[id]) return this.lastTouches[id].y;
                return 0;
            }
        }

        vibrate(args) {
            try {
                if (navigator && navigator.vibrate) {
                    navigator.vibrate(Math.max(0,Number(args.TIME||200)));
                }
            } catch (e) {}
        }

        initGyro(){
            this.setupGyroscope();
        }

        setBlur(args) {
            this.filterState.blur = Math.max(0, Number(args.BLUR||0));
            this.rebuildFilter();
        }

        setNoise(args) {
            this.filterState.contrast = Number(args.CONTRAST||100);
            this.rebuildFilter();
        }

        setBrightness(args) {
            this.filterState.brightness = Number(args.BRIGHT||100);
            this.rebuildFilter();
        }

        resetEffects() {
            this.filterState = {
                blur:0,
                brightness:100,
                contrast:100
            };
            this.rebuildFilter();
        }

        getGyroAlpha() {
            return typeof this.gyroData.alpha === 'number' ? this.gyroData.alpha : 0;
        }

        getGyroBeta() {
            return typeof this.gyroData.beta === 'number' ? this.gyroData.beta : 0;
        }

        getGyroGamma() {
            return typeof this.gyroData.gamma === 'number' ? this.gyroData.gamma : 0;
        }
    }

    Scratch.extensions.register(new CCTouch());
})(Scratch);
