(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed! Please check the "Run extension without sandbox" box.');
  }

  const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

  // Scratch / PenguinMod 公式翻訳システムへの登録
  Scratch.translate.setup({
    zh: {}, 
    en: {
      'name': 'Ultimate 3D Mega Engine',
      'init': 'initialize 3D space',
      'create': 'create [SHAPE] [ID] color:[COLOR]',
      'deleteObj': 'delete object [ID]',
      'light': 'point light [ID] color:[COLOR] intensity:[INTENSITY] distance:[DISTANCE] decay:[DECAY]',
      'ambient': 'set ambient light intensity to [INTENSITY]',
      'deleteLgt': 'delete light [ID]',
      'setPos': 'set position of [TARGET] [ID] to X:[X] Y:[Y] Z:[Z]',
      'changePos': 'change position of [TARGET] [ID] by X:[X] Y:[Y] Z:[Z]',
      'scale': 'set size of object [ID] to X:[X] Y:[Y] Z:[Z]',
      'rot': 'set rotation of object [ID] to X:[X] Y:[Y] Z:[Z]',
      'rotRel': 'turn object [ID] by X:[X] Y:[Y] Z:[Z]',
      'look': 'point object [ID] towards X:[X] Y:[Y] Z:[Z]',
      'material': 'set texture of object [ID] to [MAT]',
      'layer': 'set layer (render order) of object [ID] to [ORDER]',
      'get': '[COORD] coordinate of [TARGET] [ID]'
    },
    ja: {
      'name': 'Ultimate 3D メガエンジン',
      'init': '3D空間を初期化する',
      'create': '[SHAPE] [ID] を作成 色:[COLOR]',
      'deleteObj': 'オブジェクト [ID] を削除',
      'light': '点光源 [ID] 色:[COLOR] 強さ:[INTENSITY] 距離:[DISTANCE] 減衰:[DECAY]',
      'ambient': '全体の基本の明るさ(環境光)を [INTENSITY] にする',
      'deleteLgt': 'ライト [ID] を削除',
      'setPos': '[TARGET] [ID] の位置を X:[X] Y:[Y] Z:[Z] にする',
      'changePos': '[TARGET] [ID] の座標を X:[X] Y:[Y] Z:[Z] ずつ変える',
      'scale': 'オブジェクト [ID] のサイズを X:[X] Y:[Y] Z:[Z] にする',
      'rot': 'オブジェクト [ID] の向きを X:[X] Y:[Y] Z:[Z] にする',
      'rotRel': 'オブジェクト [ID] を X:[X] Y:[Y] Z:[Z] ずつ回す',
      'look': 'オブジェクト [ID] を X:[X] Y:[Y] Z:[Z] に向ける',
      'material': 'オブジェクト [ID] の質感を [MAT] にする',
      'layer': 'オブジェクト [ID] のレイヤー (描画順) を [ORDER] にする',
      'get': '[TARGET] [ID] の [COORD] 座標'
    }
  });

  class Ultimate3DMegaEngine {
    constructor() {
      this.threeLoaded = false;
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.objects = {}; 
      this.lights = {};  
      this.isRendering = false;
      this.ambientLight = null;
    }

    getInfo() {
      return {
        id: 'ultimate3dmegaV4',
        name: Scratch.translate({ id: 'name', default: 'Ultimate 3D Mega Engine' }),
        color1: '#0f172a',
        color2: '#1e293b',
        blocks: [
          { opcode: 'init3D', blockType: Scratch.BlockType.COMMAND, text: Scratch.translate({ id: 'init', default: 'initialize 3D space' }) },
          '---',
          {
            opcode: 'createShape',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: 'create', default: 'create [SHAPE] [ID] color:[COLOR]' }),
            arguments: {
              SHAPE: { type: Scratch.ArgumentType.STRING, menu: 'shapes', defaultValue: 'Box' },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' },
              COLOR: { type: Scratch.ArgumentType.STRING, defaultValue: '#00f3ff' }
            }
          },
          {
            opcode: 'setMaterial',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: 'material', default: 'set texture of object [ID] to [MAT]' }),
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' },
              MAT: { type: Scratch.ArgumentType.STRING, menu: 'materials', defaultValue: 'Plastic' }
            }
          },
          {
            opcode: 'setLayer',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: 'layer', default: 'set layer (render order) of object [ID] to [ORDER]' }),
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' },
              ORDER: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'deleteObject',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: 'deleteObj', default: 'delete object [ID]' }),
            arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' } }
          },
          '---',
          {
            opcode: 'addPointLightPro',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: 'light', default: 'point light [ID] color:[COLOR] intensity:[INTENSITY] distance:[DISTANCE] decay:[DECAY]' }),
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'light1' },
              COLOR: { type: Scratch.ArgumentType.STRING, defaultValue: '#ffffff' },
              INTENSITY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 },
              DISTANCE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, 
              DECAY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }     
            }
          },
          {
            opcode: 'setAmbientLight',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: 'ambient', default: 'set ambient light intensity to [INTENSITY]' }),
            arguments: { INTENSITY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.5 } }
          },
          {
            opcode: 'deleteLight',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: 'deleteLgt', default: 'delete light [ID]' }),
            arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'light1' } }
          },
          '---',
          {
            opcode: 'setPos',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: 'setPos', default: 'set position of [TARGET] [ID] to X:[X] Y:[Y] Z:[Z]' }),
            arguments: {
              TARGET: { type: Scratch.ArgumentType.STRING, menu: 'targets', defaultValue: 'オブジェクト' },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'changePos',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: 'changePos', default: 'change position of [TARGET] [ID] by X:[X] Y:[Y] Z:[Z]' }),
            arguments: {
              TARGET: { type: Scratch.ArgumentType.STRING, menu: 'targets', defaultValue: 'オブジェクト' },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          '---',
          {
            opcode: 'setScale',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: 'scale', default: 'set size of object [ID] to X:[X] Y:[Y] Z:[Z]' }),
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          '---',
          {
            opcode: 'setRotation',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: 'rot', default: 'set rotation of object [ID] to X:[X] Y:[Y] Z:[Z]' }),
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'rotateRel',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: 'rotRel', default: 'turn object [ID] by X:[X] Y:[Y] Z:[Z]' }),
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'pointAt',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({ id: 'look', default: 'point object [ID] towards X:[X] Y:[Y] Z:[Z]' }),
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          '---',
          {
            opcode: 'getCoord',
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({ id: 'get', default: '[COORD] coordinate of [TARGET] [ID]' }),
            arguments: {
              TARGET: { type: Scratch.ArgumentType.STRING, menu: 'targets', defaultValue: 'オブジェクト' },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' },
              COORD: { type: Scratch.ArgumentType.STRING, menu: 'coords', defaultValue: 'X' }
            }
          }
        ],
        menus: {
          shapes: {
            acceptReporters: true,
            // 【修正】メニューの文字列を完全網羅し内部処理と完全一致させました
            items: [
              'Box', 'Sphere', 'Cone', 'Cylinder', 'Torus', 'Plane', 
              'Capsule', 'TorusKnot', 'Ring', 'Circle',
              'Icosahedron', 'Octahedron', 'Tetrahedron', 'Dodecahedron',
              'ConeFrustum', 'Tube', 'Pyramid', 'Gem', 'Knot', 'Wedge'
            ]
          },
          materials: {
            acceptReporters: true,
            items: ['Plastic', 'Metal', 'Glass', 'Neon', 'Rough', 'Matte', 'Gold', 'Rubber', 'Grid', 'Normal']
          },
          targets: {
            acceptReporters: true,
            items: ['オブジェクト', 'ライト', 'カメラ']
          },
          coords: {
            items: ['X', 'Y', 'Z']
          }
        }
      };
    }

    async init3D() {
      if (!this.threeLoaded) {
        await this._loadScript(THREE_URL);
        this.threeLoaded = true;
      }
      const stage = Scratch.vm.runtime.renderer.canvas.parentElement;
      if (!stage) return;

      const old = document.getElementById('engine-mega-canvas');
      if (old) old.remove();

      const canvas = document.createElement('canvas');
      canvas.id = 'engine-mega-canvas';
      Object.assign(canvas.style, {
        position: 'absolute', left: 0, top: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 1
      });
      stage.appendChild(canvas);

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, stage.clientWidth / stage.clientHeight, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      this.renderer.setSize(stage.clientWidth, stage.clientHeight);

      this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(this.ambientLight);

      this.camera.position.z = 5;
      this.objects = {};
      this.lights = {};

      if (!this.isRendering) {
        this.isRendering = true;
        const tick = () => {
          requestAnimationFrame(tick);
          this.renderer.render(this.scene, this.camera);
        };
        tick();
      }
    }

    createShape(args) {
      if (!this.scene) return;
      const id = args.ID;
      this.deleteObject({ ID: id });

      let geo;
      const s = args.SHAPE;

      // 【修正】r128で完全に動作する20種類の形状分岐を完全固定
      if (s === 'Box') geo = new THREE.BoxGeometry(1, 1, 1);
      else if (s === 'Sphere') geo = new THREE.SphereGeometry(0.5, 32, 32);
      else if (s === 'Cone') geo = new THREE.ConeGeometry(0.5, 1, 32);
      else if (s === 'Cylinder') geo = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
      else if (s === 'Torus') geo = new THREE.TorusGeometry(0.4, 0.15, 16, 100);
      else if (s === 'Plane') geo = new THREE.PlaneGeometry(1, 1);
      else if (s === 'Capsule') geo = new THREE.CylinderGeometry(0.3, 0.8, 32, 1, false); // カプセル用シリンダー
      else if (s === 'TorusKnot') geo = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 8);
      else if (s === 'Ring') geo = new THREE.RingGeometry(0.2, 0.5, 32);
      else if (s === 'Circle') geo = new THREE.CircleGeometry(0.5, 32);
      else if (s === 'Icosahedron') geo = new THREE.IcosahedronGeometry(0.5);
      else if (s === 'Octahedron') geo = new THREE.OctahedronGeometry(0.5);
      else if (s === 'Tetrahedron') geo = new THREE.TetrahedronGeometry(0.5);
      else if (s === 'Dodecahedron') geo = new THREE.DodecahedronGeometry(0.5);
      else if (s === 'ConeFrustum') geo = new THREE.CylinderGeometry(0.2, 0.6, 1, 32); 
      else if (s === 'Tube') geo = new THREE.CylinderGeometry(0.4, 0.4, 1, 32, 1, true); 
      else if (s === 'Pyramid') geo = new THREE.ConeGeometry(0.6, 1, 4); 
      else if (s === 'Gem') geo = new THREE.OctahedronGeometry(0.5, 1); 
      else if (s === 'Knot') geo = new THREE.TorusKnotGeometry(0.2, 0.08, 100, 16, 3, 4); 
      else if (s === 'Wedge') geo = new THREE.CylinderGeometry(0.01, 0.5, 1, 3); // 楔形（三角柱）
      else geo = new THREE.BoxGeometry(1, 1, 1);

      const mat = new THREE.MeshStandardMaterial({ color: args.COLOR, roughness: 0.5, metalness: 0.1 });
      const mesh = new THREE.Mesh(geo, mat);
      
      mesh.renderOrder = 0; // デフォルトレイヤー

      this.scene.add(mesh);
      this.objects[id] = mesh;
    }

    setMaterial(args) {
      const mesh = this.objects[args.ID];
      if (!mesh) return;
      const m = args.MAT;
      
      // 現在オブジェクトが持っている色を確実に取得
      const originalColor = mesh.material.color.getHex();

      let newMat;
      // 【修正】マテリアルのプロパティ適用と描画更新を100%強制
      if (m === 'Plastic') {
        newMat = new THREE.MeshStandardMaterial({ color: originalColor, roughness: 0.2, metalness: 0.0 });
      } else if (m === 'Metal') {
        newMat = new THREE.MeshStandardMaterial({ color: originalColor, roughness: 0.1, metalness: 0.9 });
      } else if (m === 'Glass') {
        newMat = new THREE.MeshStandardMaterial({ color: originalColor, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.5 });
      } else if (m === 'Neon') {
        newMat = new THREE.MeshBasicMaterial({ color: originalColor }); 
      } else if (m === 'Rough') {
        newMat = new THREE.MeshStandardMaterial({ color: originalColor, roughness: 0.95, metalness: 0.0 });
      } else if (m === 'Matte') {
        newMat = new THREE.MeshStandardMaterial({ color: originalColor, roughness: 0.8, metalness: 0.0 });
      } else if (m === 'Gold') {
        newMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.15, metalness: 0.9 });
      } else if (m === 'Rubber') {
        newMat = new THREE.MeshStandardMaterial({ color: originalColor, roughness: 0.9, metalness: 0.0 });
      } else if (m === 'Grid') {
        newMat = new THREE.MeshStandardMaterial({ color: originalColor, wireframe: true });
      } else if (m === 'Normal') {
        newMat = new THREE.MeshNormalMaterial();
      } else {
        newMat = new THREE.MeshStandardMaterial({ color: originalColor, roughness: 0.5, metalness: 0.1 });
      }

      // 古いマテリアルのメモリ解放と強制アップデート
      mesh.material.dispose();
      mesh.material = newMat;
      mesh.material.needsUpdate = true;
    }

    // 【新機能】重なり順（レイヤー）を指定する
    setLayer(args) {
      const mesh = this.objects[args.ID];
      if (!mesh) return;
      
      const order = Number(args.ORDER);
      mesh.renderOrder = order;
      
      // 透明オブジェクトなどの前後関係を正常化するために深度テストを調整
      if (mesh.material) {
        mesh.material.depthTest = true;
        mesh.material.needsUpdate = true;
      }
    }

    deleteObject(args) {
      const obj = this.objects[args.ID];
      if (obj) {
        this.scene.remove(obj);
        obj.geometry.dispose();
        obj.material.dispose();
        delete this.objects[args.ID];
      }
    }

    addPointLightPro(args) {
      if (!this.scene) return;
      this.deleteLight({ ID: args.ID });
      
      const intensity = Number(args.INTENSITY);
      const distance = Number(args.DISTANCE);
      const decay = Number(args.DECAY);

      const light = new THREE.PointLight(args.COLOR, intensity, distance, decay);
      light.position.set(0, 2, 2); 
      
      this.scene.add(light);
      this.lights[args.ID] = light;
    }

    setAmbientLight(args) {
      if (this.ambientLight) this.ambientLight.intensity = Number(args.INTENSITY);
    }

    deleteLight(args) {
      const light = this.lights[args.ID];
      if (light) {
        this.scene.remove(light);
        delete this.lights[args.ID];
      }
    }

    _getEntity(target, id) {
      const t = target;
      if (t === 'カメラ' || t === 'camera') return this.camera;
      if (t === 'ライト' || t === 'light') return this.lights[id];
      return this.objects[id];
    }

    setPos(args) {
      const ent = this._getEntity(args.TARGET, args.ID);
      if (ent) ent.position.set(Number(args.X), Number(args.Y), Number(args.Z));
    }

    changePos(args) {
      const ent = this._getEntity(args.TARGET, args.ID);
      if (ent) {
        ent.position.x += Number(args.X);
        ent.position.y += Number(args.Y);
        ent.position.z += Number(args.Z);
      }
    }

    setScale(args) {
      const obj = this.objects[args.ID];
      if (obj) obj.scale.set(Number(args.X), Number(args.Y), Number(args.Z));
    }

    setRotation(args) {
      const obj = this.objects[args.ID];
      if (obj) {
        const r = Math.PI / 180;
        obj.rotation.set(Number(args.X) * r, Number(args.Y) * r, Number(args.Z) * r);
      }
    }

    rotateRel(args) {
      const obj = this.objects[args.ID];
      if (obj) {
        const r = Math.PI / 180;
        obj.rotation.x += Number(args.X) * r;
        obj.rotation.y += Number(args.Y) * r;
        obj.rotation.z += Number(args.Z) * r;
      }
    }

    pointAt(args) {
      const obj = this.objects[args.ID];
      if (obj) obj.lookAt(new THREE.Vector3(Number(args.X), Number(args.Y), Number(args.Z)));
    }

    getCoord(args) {
      const ent = this._getEntity(args.TARGET, args.ID);
      if (!ent) return 0;
      const c = args.COORD;
      if (c === 'X') return ent.position.x;
      if (c === 'Y') return ent.position.y;
      return ent.position.z;
    }

    _loadScript(url) {
      return new Promise((res) => {
        if (window.THREE) return res();
        const s = document.createElement('script');
        s.src = url; s.onload = res; document.head.appendChild(s);
      });
    }
  }

  Scratch.extensions.register(new Ultimate3DMegaEngine());
})(Scratch);