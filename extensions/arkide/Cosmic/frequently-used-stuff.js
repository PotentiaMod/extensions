(function(Scratch) {
  'use strict';

  class CodeSnippets {
    constructor() {
      this.customTemplates = {};
      this.activeControllers = {}; // Track active controllers for each sprite
    }

    getInfo() {
      return {
        id: 'codesnippets',
        name: 'Code Templates',
        color1: '#4CAF50',
        color2: '#45a049',
        color3: '#3d8b40',
        blocks: [
          {
            blockType: Scratch.BlockType.LABEL,
            text: '🎮 Character Controllers'
          },
          {
            opcode: 'basicMovement',
            blockType: Scratch.BlockType.COMMAND,
            text: 'basic movement: [UP][DOWN][LEFT][RIGHT] speed [SPEED]',
            arguments: {
              UP: { type: Scratch.ArgumentType.STRING, defaultValue: 'w' },
              DOWN: { type: Scratch.ArgumentType.STRING, defaultValue: 's' },
              LEFT: { type: Scratch.ArgumentType.STRING, defaultValue: 'a' },
              RIGHT: { type: Scratch.ArgumentType.STRING, defaultValue: 'd' },
              SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
            }
          },
          {
            opcode: 'platformerMovement',
            blockType: Scratch.BlockType.COMMAND,
            text: 'platformer: left[LEFT] right[RIGHT] jump[JUMP] speed[SPEED] jump[JHEIGHT]',
            arguments: {
              LEFT: { type: Scratch.ArgumentType.STRING, defaultValue: 'a' },
              RIGHT: { type: Scratch.ArgumentType.STRING, defaultValue: 'd' },
              JUMP: { type: Scratch.ArgumentType.STRING, defaultValue: 'w' },
              SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
              JHEIGHT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 15 }
            }
          },
          {
            opcode: 'topDownMovement',
            blockType: Scratch.BlockType.COMMAND,
            text: 'top-down smooth: up[UP] down[DOWN] left[LEFT] right[RIGHT] speed[SPEED]',
            arguments: {
              UP: { type: Scratch.ArgumentType.STRING, defaultValue: 'w' },
              DOWN: { type: Scratch.ArgumentType.STRING, defaultValue: 's' },
              LEFT: { type: Scratch.ArgumentType.STRING, defaultValue: 'a' },
              RIGHT: { type: Scratch.ArgumentType.STRING, defaultValue: 'd' },
              SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 }
            }
          },
          {
            opcode: 'mouseFollower',
            blockType: Scratch.BlockType.COMMAND,
            text: 'follow mouse at speed [SPEED]',
            arguments: {
              SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.1 }
            }
          },
          {
            opcode: 'rotationControls',
            blockType: Scratch.BlockType.COMMAND,
            text: 'rotation: left[LEFT] right[RIGHT] degrees[DEGREES]',
            arguments: {
              LEFT: { type: Scratch.ArgumentType.STRING, defaultValue: 'a' },
              RIGHT: { type: Scratch.ArgumentType.STRING, defaultValue: 'd' },
              DEGREES: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
            }
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: '🎯 Game Mechanics'
          },
          {
            opcode: 'clickerGame',
            blockType: Scratch.BlockType.COMMAND,
            text: 'clicker: var[VAR] increment[INC] when clicked',
            arguments: {
              VAR: { type: Scratch.ArgumentType.STRING, defaultValue: 'score' },
              INC: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'healthSystem',
            blockType: Scratch.BlockType.COMMAND,
            text: 'health system: var[VAR] max[MAX] damage[DMG] on touch[COLOR]',
            arguments: {
              VAR: { type: Scratch.ArgumentType.STRING, defaultValue: 'health' },
              MAX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              DMG: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
              COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#ff0000' }
            }
          },
          {
            opcode: 'autoClicker',
            blockType: Scratch.BlockType.COMMAND,
            text: 'auto increment [VAR] by [AMOUNT] every [SECONDS] seconds',
            arguments: {
              VAR: { type: Scratch.ArgumentType.STRING, defaultValue: 'coins' },
              AMOUNT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              SECONDS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'collectible',
            blockType: Scratch.BlockType.COMMAND,
            text: 'collectible: increase[VAR] by[AMT] hide & respawn when touched',
            arguments: {
              VAR: { type: Scratch.ArgumentType.STRING, defaultValue: 'score' },
              AMT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: '✨ Visual Effects'
          },
          {
            opcode: 'fadeInOut',
            blockType: Scratch.BlockType.COMMAND,
            text: 'fade [TYPE] in [SECONDS] seconds',
            arguments: {
              TYPE: { type: Scratch.ArgumentType.STRING, menu: 'fadeType' },
              SECONDS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'smoothGlide',
            blockType: Scratch.BlockType.COMMAND,
            text: 'smooth glide to x:[X] y:[Y] in [SECONDS]s with easing',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              SECONDS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'shake',
            blockType: Scratch.BlockType.COMMAND,
            text: 'shake [INTENSITY] for [DURATION] seconds',
            arguments: {
              INTENSITY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
              DURATION: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.5 }
            }
          },
          {
            opcode: 'pulse',
            blockType: Scratch.BlockType.COMMAND,
            text: 'pulse size from [MIN]% to [MAX]% [TIMES] times',
            arguments: {
              MIN: { type: Scratch.ArgumentType.NUMBER, defaultValue: 90 },
              MAX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 110 },
              TIMES: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 }
            }
          },
          {
            opcode: 'easeSize',
            blockType: Scratch.BlockType.COMMAND,
            text: 'ease size to [SIZE]% over [SECONDS] seconds',
            arguments: {
              SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 150 },
              SECONDS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: '🔄 Clone Management'
          },
          {
            opcode: 'cloneGrid',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create grid [ROWS]×[COLS] spacing[SPACE] starting x:[X] y:[Y]',
            arguments: {
              ROWS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 },
              COLS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 },
              SPACE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: -100 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
            }
          },
          {
            opcode: 'cloneCircle',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create [COUNT] clones in circle radius[RADIUS]',
            arguments: {
              COUNT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 8 },
              RADIUS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
            }
          },
          {
            opcode: 'deleteCloneAfter',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete this clone after [SECONDS] seconds',
            arguments: {
              SECONDS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 }
            }
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: '💾 Custom Templates'
          },
          {
            opcode: 'saveTemplate',
            blockType: Scratch.BlockType.COMMAND,
            text: 'save custom template [NAME]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'myTemplate' }
            }
          },
          {
            opcode: 'loadTemplate',
            blockType: Scratch.BlockType.COMMAND,
            text: 'run custom template [NAME]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'myTemplate' }
            }
          },
          {
            opcode: 'exportTemplate',
            blockType: Scratch.BlockType.REPORTER,
            text: 'export template [NAME] as JSON',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'myTemplate' }
            }
          },
          {
            opcode: 'importTemplate',
            blockType: Scratch.BlockType.COMMAND,
            text: 'import template from JSON [JSON]',
            arguments: {
              JSON: { type: Scratch.ArgumentType.STRING, defaultValue: '{}' }
            }
          },
          {
            opcode: 'listTemplates',
            blockType: Scratch.BlockType.REPORTER,
            text: 'all custom templates'
          },
          {
            opcode: 'deleteTemplate',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete template [NAME]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'myTemplate' }
            }
          }
        ],
        menus: {
          fadeType: ['in', 'out'],
        }
      };
    }

    // CHARACTER CONTROLLERS

    basicMovement(args, util) {
      const target = util.target;
      const speed = Scratch.Cast.toNumber(args.SPEED);
      const up = args.UP.toLowerCase();
      const down = args.DOWN.toLowerCase();
      const left = args.LEFT.toLowerCase();
      const right = args.RIGHT.toLowerCase();

      if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(up)) {
        target.setXY(target.x, target.y + speed);
      }
      if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(down)) {
        target.setXY(target.x, target.y - speed);
      }
      if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(left)) {
        target.setXY(target.x - speed, target.y);
      }
      if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(right)) {
        target.setXY(target.x + speed, target.y);
      }
    }

    platformerMovement(args, util) {
      const target = util.target;
      const speed = Scratch.Cast.toNumber(args.SPEED);
      const jumpHeight = Scratch.Cast.toNumber(args.JHEIGHT);
      const left = args.LEFT.toLowerCase();
      const right = args.RIGHT.toLowerCase();
      const jump = args.JUMP.toLowerCase();

      // Initialize velocity if not exists
      if (!target.platformerVelocity) {
        target.platformerVelocity = { x: 0, y: 0 };
      }

      // Horizontal movement
      if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(left)) {
        target.platformerVelocity.x = -speed;
      } else if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(right)) {
        target.platformerVelocity.x = speed;
      } else {
        target.platformerVelocity.x *= 0.8; // Friction
      }

      // Jump (simple ground check at y = -130)
      if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(jump) && target.y <= -130) {
        target.platformerVelocity.y = jumpHeight;
      }

      // Gravity
      target.platformerVelocity.y -= 1;
      
      // Apply movement
      target.setXY(
        target.x + target.platformerVelocity.x,
        target.y + target.platformerVelocity.y
      );

      // Simple ground collision
      if (target.y < -130) {
        target.setXY(target.x, -130);
        target.platformerVelocity.y = 0;
      }
    }

    topDownMovement(args, util) {
      const target = util.target;
      const speed = Scratch.Cast.toNumber(args.SPEED);
      const up = args.UP.toLowerCase();
      const down = args.DOWN.toLowerCase();
      const left = args.LEFT.toLowerCase();
      const right = args.RIGHT.toLowerCase();

      // Initialize velocity if not exists
      if (!target.topDownVelocity) {
        target.topDownVelocity = { x: 0, y: 0 };
      }

      // Acceleration based
      let targetVelX = 0;
      let targetVelY = 0;

      if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(up)) targetVelY += speed;
      if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(down)) targetVelY -= speed;
      if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(left)) targetVelX -= speed;
      if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(right)) targetVelX += speed;

      // Smooth acceleration
      target.topDownVelocity.x += (targetVelX - target.topDownVelocity.x) * 0.3;
      target.topDownVelocity.y += (targetVelY - target.topDownVelocity.y) * 0.3;

      target.setXY(
        target.x + target.topDownVelocity.x,
        target.y + target.topDownVelocity.y
      );
    }

    mouseFollower(args, util) {
      const target = util.target;
      const speed = Scratch.Cast.toNumber(args.SPEED);
      
      const mouseX = Scratch.vm.runtime.ioDevices.mouse.getScratchX();
      const mouseY = Scratch.vm.runtime.ioDevices.mouse.getScratchY();

      const newX = target.x + (mouseX - target.x) * speed;
      const newY = target.y + (mouseY - target.y) * speed;

      target.setXY(newX, newY);
    }

    rotationControls(args, util) {
      const target = util.target;
      const degrees = Scratch.Cast.toNumber(args.DEGREES);
      const left = args.LEFT.toLowerCase();
      const right = args.RIGHT.toLowerCase();

      if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(left)) {
        target.setDirection(target.direction - degrees);
      }
      if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(right)) {
        target.setDirection(target.direction + degrees);
      }
    }

    // GAME MECHANICS

    clickerGame(args, util) {
      const varName = Scratch.Cast.toString(args.VAR);
      const increment = Scratch.Cast.toNumber(args.INC);
      const target = util.target;

      const mouseDown = Scratch.vm.runtime.ioDevices.mouse.getIsDown();
      
      if (mouseDown && target.isTouchingObject('_mouse_')) {
        if (!target.clickerLastClick || Date.now() - target.clickerLastClick > 100) {
          this._changeVariable(varName, increment, util);
          target.clickerLastClick = Date.now();
        }
      }
    }

    healthSystem(args, util) {
      const varName = Scratch.Cast.toString(args.VAR);
      const maxHealth = Scratch.Cast.toNumber(args.MAX);
      const damage = Scratch.Cast.toNumber(args.DMG);
      const color = args.COLOR;
      const target = util.target;

      // Initialize health if needed
      let currentHealth = this._getVariable(varName, util);
      if (currentHealth === undefined || currentHealth === '' || currentHealth === 0) {
        this._setVariable(varName, maxHealth, util);
        currentHealth = maxHealth;
      }

      // Check collision with color
      if (target.isTouchingColor(color)) {
        if (!target.healthLastHit || Date.now() - target.healthLastHit > 500) {
          const newHealth = Math.max(0, currentHealth - damage);
          this._setVariable(varName, newHealth, util);
          target.healthLastHit = Date.now();
          
          // Flash effect
          target.setEffect('ghost', 50);
          setTimeout(() => target.setEffect('ghost', 0), 100);
        }
      }
    }

    autoClicker(args, util) {
      const varName = Scratch.Cast.toString(args.VAR);
      const amount = Scratch.Cast.toNumber(args.AMOUNT);
      const seconds = Scratch.Cast.toNumber(args.SECONDS);
      const target = util.target;

      const key = `autoClicker_${varName}`;
      
      if (!target[key] || Date.now() - target[key] >= seconds * 1000) {
        this._changeVariable(varName, amount, util);
        target[key] = Date.now();
      }
    }

    collectible(args, util) {
      const varName = Scratch.Cast.toString(args.VAR);
      const amount = Scratch.Cast.toNumber(args.AMT);
      const target = util.target;

      // Check if touching any other sprite
      const sprites = util.runtime.targets.filter(t => t.isOriginal && !t.isStage);
      
      for (const sprite of sprites) {
        if (sprite !== target && sprite.visible) {
          try {
            if (target.isTouchingObject(sprite.sprite.name)) {
              this._changeVariable(varName, amount, util);
              target.setVisible(false);
              
              // Respawn after delay
              setTimeout(() => {
                target.setXY(
                  Math.random() * 400 - 200,
                  Math.random() * 300 - 150
                );
                target.setVisible(true);
              }, 3000);
              break;
            }
          } catch (e) {
            // Skip if collision detection fails
          }
        }
      }
    }

    // VISUAL EFFECTS

    async fadeInOut(args, util) {
      const type = args.TYPE;
      const seconds = Scratch.Cast.toNumber(args.SECONDS);
      const target = util.target;
      
      const steps = 20;
      const delay = (seconds * 1000) / steps;
      
      if (type === 'in') {
        for (let i = 0; i <= steps; i++) {
          const ghost = 100 - (i / steps) * 100;
          target.setEffect('ghost', ghost);
          await this._wait(delay);
        }
      } else {
        for (let i = 0; i <= steps; i++) {
          const ghost = (i / steps) * 100;
          target.setEffect('ghost', ghost);
          await this._wait(delay);
        }
      }
    }

    async smoothGlide(args, util) {
      const targetX = Scratch.Cast.toNumber(args.X);
      const targetY = Scratch.Cast.toNumber(args.Y);
      const seconds = Scratch.Cast.toNumber(args.SECONDS);
      const target = util.target;

      const startX = target.x;
      const startY = target.y;
      const startTime = Date.now();
      const duration = seconds * 1000;

      while (Date.now() - startTime < duration) {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        // Ease in-out cubic
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        target.setXY(
          startX + (targetX - startX) * eased,
          startY + (targetY - startY) * eased
        );

        await this._wait(16); // ~60fps
      }

      target.setXY(targetX, targetY);
    }

    async shake(args, util) {
      const intensity = Scratch.Cast.toNumber(args.INTENSITY);
      const duration = Scratch.Cast.toNumber(args.DURATION);
      const target = util.target;

      const startX = target.x;
      const startY = target.y;
      const startTime = Date.now();

      while (Date.now() - startTime < duration * 1000) {
        const offsetX = (Math.random() - 0.5) * intensity;
        const offsetY = (Math.random() - 0.5) * intensity;
        target.setXY(startX + offsetX, startY + offsetY);
        await this._wait(16);
      }

      target.setXY(startX, startY);
    }

    async pulse(args, util) {
      const min = Scratch.Cast.toNumber(args.MIN);
      const max = Scratch.Cast.toNumber(args.MAX);
      const times = Scratch.Cast.toNumber(args.TIMES);
      const target = util.target;

      const originalSize = target.size;

      for (let i = 0; i < times; i++) {
        // Grow
        for (let s = min; s <= max; s += (max - min) / 10) {
          target.setSize(s);
          await this._wait(20);
        }
        // Shrink
        for (let s = max; s >= min; s -= (max - min) / 10) {
          target.setSize(s);
          await this._wait(20);
        }
      }

      target.setSize(originalSize);
    }

    async easeSize(args, util) {
      const targetSize = Scratch.Cast.toNumber(args.SIZE);
      const seconds = Scratch.Cast.toNumber(args.SECONDS);
      const target = util.target;

      const startSize = target.size;
      const startTime = Date.now();
      const duration = seconds * 1000;

      while (Date.now() - startTime < duration) {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        // Ease in-out cubic
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        target.setSize(startSize + (targetSize - startSize) * eased);
        await this._wait(16);
      }

      target.setSize(targetSize);
    }

    // CLONE MANAGEMENT

    cloneGrid(args, util) {
      const rows = Scratch.Cast.toNumber(args.ROWS);
      const cols = Scratch.Cast.toNumber(args.COLS);
      const spacing = Scratch.Cast.toNumber(args.SPACE);
      const startX = Scratch.Cast.toNumber(args.X);
      const startY = Scratch.Cast.toNumber(args.Y);
      const target = util.target;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const clone = target.makeClone();
          if (clone) {
            clone.setXY(
              startX + col * spacing,
              startY - row * spacing
            );
          }
        }
      }
    }

    cloneCircle(args, util) {
      const count = Scratch.Cast.toNumber(args.COUNT);
      const radius = Scratch.Cast.toNumber(args.RADIUS);
      const target = util.target;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 360;
        const clone = target.makeClone();
        if (clone) {
          const x = target.x + radius * Math.cos(angle * Math.PI / 180);
          const y = target.y + radius * Math.sin(angle * Math.PI / 180);
          clone.setXY(x, y);
        }
      }
    }

    async deleteCloneAfter(args, util) {
      const seconds = Scratch.Cast.toNumber(args.SECONDS);
      await this._wait(seconds * 1000);
      util.target.dispose();
    }

    // CUSTOM TEMPLATES

    saveTemplate(args) {
      const name = Scratch.Cast.toString(args.NAME);
      this.customTemplates[name] = {
        name: name,
        created: Date.now(),
        actions: []
      };
    }

    loadTemplate(args, util) {
      const name = Scratch.Cast.toString(args.NAME);
      const template = this.customTemplates[name];
      
      if (template && template.actions) {
        template.actions.forEach(action => {
          // Execute the action
        });
      }
    }

    exportTemplate(args) {
      const name = Scratch.Cast.toString(args.NAME);
      const template = this.customTemplates[name];
      return template ? JSON.stringify(template) : '{}';
    }

    importTemplate(args) {
      try {
        const data = JSON.parse(Scratch.Cast.toString(args.JSON));
        if (data.name) {
          this.customTemplates[data.name] = data;
        }
      } catch (e) {
        console.error('Failed to import template:', e);
      }
    }

    listTemplates() {
      return JSON.stringify(Object.keys(this.customTemplates));
    }

    deleteTemplate(args) {
      const name = Scratch.Cast.toString(args.NAME);
      delete this.customTemplates[name];
    }

    // HELPER FUNCTIONS

    _getVariable(name, util) {
      const target = util.target;
      const stage = util.runtime.getTargetForStage();
      
      // Try sprite variables first
      for (const variable of Object.values(target.variables)) {
        if (variable.name === name && variable.type === '') {
          return variable.value;
        }
      }
      
      // Try stage variables
      for (const variable of Object.values(stage.variables)) {
        if (variable.name === name && variable.type === '') {
          return variable.value;
        }
      }
      
      return 0;
    }

    _setVariable(name, value, util) {
      const target = util.target;
      const stage = util.runtime.getTargetForStage();
      
      // Try sprite variables first
      for (const variable of Object.values(target.variables)) {
        if (variable.name === name && variable.type === '') {
          variable.value = value;
          return;
        }
      }
      
      // Try stage variables
      for (const variable of Object.values(stage.variables)) {
        if (variable.name === name && variable.type === '') {
          variable.value = value;
          return;
        }
      }
    }

    _changeVariable(name, amount, util) {
      const current = this._getVariable(name, util);
      this._setVariable(name, Scratch.Cast.toNumber(current) + amount, util);
    }

    _wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  Scratch.extensions.register(new CodeSnippets());
})(Scratch);