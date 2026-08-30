(function() {
	//#region \0rolldown/runtime.js
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __esmMin = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
	var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
		return target;
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toCommonJS = (mod) => __hasOwnProp.call(mod, "module.exports") ? mod["module.exports"] : __copyProps(__defProp({}, "__esModule", { value: true }), mod);
	//#endregion
	//#region src/blocks/Engine_b.js
	var EngineMenus = {
		drawMode: [
			"TRIANGLES",
			"TRIANGLE_STRIP",
			"LINES",
			"POINTS"
		],
		pbrTexMenu: [
			"albedoTex",
			"normalTex",
			"ormTex",
			"emissiveTex"
		],
		pbrParamMenu: [
			"roughness",
			"metalness",
			"baseColor"
		],
		boolMenu: ["true", "false"],
		faceMenu: [
			"FRONT",
			"BACK",
			"FRONT_AND_BACK"
		],
		clearMenu: [
			"COLOR_BUFFER_BIT",
			"DEPTH_BUFFER_BIT",
			"STENCIL_BUFFER_BIT",
			"ALL"
		],
		drawMode: [
			"TRIANGLES",
			"TRIANGLE_STRIP",
			"LINES",
			"POINTS"
		],
		capMenu: [
			"DEPTH_TEST",
			"STENCIL_TEST",
			"BLEND",
			"CULL_FACE"
		],
		axisMenu: [
			"X",
			"Y",
			"Z"
		],
		v3OpMenu: [
			"+",
			"-",
			"mul"
		],
		v3CompMenu: [
			"X",
			"Y",
			"Z"
		],
		v4CompMenu: [
			"X",
			"Y",
			"Z",
			"W"
		],
		costumeMenu: {
			acceptReporters: true,
			items: "tex_getCostumes"
		},
		listMenu: {
			acceptReporters: true,
			items: "getAllLists"
		},
		texTypeMenu: [
			"RGB16F",
			"RGBA16F",
			"RGB32F",
			"RGB8",
			"RGBA8",
			"R11G11B10F",
			"R16F",
			"RG16F",
			"DEPTH24_STENCIL8",
			"DEPTH_COMPONENT24"
		],
		fboSlotMenu: [
			"COLOR_ATTACHMENT0",
			"COLOR_ATTACHMENT1",
			"COLOR_ATTACHMENT2",
			"COLOR_ATTACHMENT3",
			"COLOR_ATTACHMENT4",
			"COLOR_ATTACHMENT5",
			"DEPTH_STENCIL_ATTACHMENT",
			"DEPTH_ATTACHMENT"
		],
		depthMenu: [
			"RBO",
			"TEXTURE",
			"NONE"
		],
		filterMode: [
			"NEAREST",
			"LINEAR",
			"NEAREST_MIPMAP_NEAREST",
			"LINEAR_MIPMAP_NEAREST",
			"NEAREST_MIPMAP_LINEAR",
			"LINEAR_MIPMAP_LINEAR"
		],
		wrapMode: [
			"REPEAT",
			"CLAMP_TO_EDGE",
			"MIRRORED_REPEAT"
		],
		funcMenu: [
			"NEVER",
			"LESS",
			"EQUAL",
			"LEQUAL",
			"GREATER",
			"NOTEQUAL",
			"GEQUAL",
			"ALWAYS"
		],
		opMenu: {
			acceptReporters: true,
			items: [
				{
					text: "KEEP",
					value: "KEEP"
				},
				{
					text: "ZERO",
					value: "ZERO"
				},
				{
					text: "REPLACE",
					value: "REPLACE"
				},
				{
					text: "INCR",
					value: "INCR"
				},
				{
					text: "DECR",
					value: "DECR"
				},
				{
					text: "INVERT",
					value: "INVERT"
				},
				{
					text: "INCR_WRAP",
					value: "INCR_WRAP"
				},
				{
					text: "DECR_WRAP",
					value: "DECR_WRAP"
				}
			]
		},
		faceMenu: {
			acceptReporters: true,
			items: [
				{
					text: "FRONT",
					value: "FRONT"
				},
				{
					text: "BACK",
					value: "BACK"
				},
				{
					text: "FRONT_AND_BACK",
					value: "FRONT_AND_BACK"
				}
			]
		},
		blendMenu: [
			"ZERO",
			"ONE",
			"SRC_COLOR",
			"ONE_MINUS_SRC_COLOR",
			"DST_COLOR",
			"ONE_MINUS_DST_COLOR",
			"SRC_ALPHA",
			"ONE_MINUS_SRC_ALPHA",
			"DST_ALPHA",
			"ONE_MINUS_DST_ALPHA",
			"CONSTANT_COLOR",
			"ONE_MINUS_CONSTANT_COLOR"
		],
		attrMenu: [
			{
				text: "position",
				value: "position"
			},
			{
				text: "normal",
				value: "normal"
			},
			{
				text: "v",
				value: "uv"
			},
			{
				text: "tangent",
				value: "tangent"
			},
			{
				text: "color",
				value: "color"
			}
		],
		TRSTypeMenu: {
			acceptReporters: true,
			items: [
				{
					text: "position",
					value: "Pos"
				},
				{
					text: "rotation",
					value: "Rot"
				},
				{
					text: "scale",
					value: "Scale"
				}
			]
		},
		AxisMenu: {
			acceptReporters: true,
			items: [
				{
					text: "X",
					value: "X"
				},
				{
					text: "Y",
					value: "Y"
				},
				{
					text: "Z",
					value: "Z"
				}
			]
		},
		playModeMenu: {
			acceptReporters: true,
			items: ["loop", "play once"]
		},
		animInfoMenu: {
			acceptReporters: true,
			items: [
				"current animation name",
				"current time",
				"duration",
				"is playing",
				"animation names"
			]
		},
		yesNoMenu: {
			acceptReporters: true,
			items: [{
				text: "on",
				value: "true"
			}, {
				text: "off",
				value: "false"
			}]
		},
		clipPropMenu: {
			acceptReporters: true,
			items: [
				{
					text: "start time",
					value: "startTime"
				},
				{
					text: "duration",
					value: "duration"
				},
				{
					text: "mix weight",
					value: "weight"
				}
			]
		},
		lightmapParamMenu: {
			acceptReporters: true,
			items: ["hasLightmap", "lightmapIndex"]
		}
	};
	var EngineBlocks = [
		{
			blockType: "label",
			text: "Core"
		},
		{
			opcode: "gl_Init",
			blockType: "command",
			text: "Core.init()"
		},
		{
			opcode: "gl_ResetResources",
			blockType: "command",
			text: "Core.resetAll()"
		},
		{
			opcode: "gl_Present",
			blockType: "command",
			text: "Core.updateLayer()"
		},
		{
			blockType: "label",
			text: "Shader"
		},
		{
			opcode: "Shader_Create",
			blockType: "command",
			text: "new Shader [ID] ([VS], [FS])",
			arguments: {
				ID: { type: "string" },
				VS: { type: "string" },
				FS: { type: "string" }
			}
		},
		{
			opcode: "Shader_Use",
			blockType: "command",
			text: "Shader [ID] .use()",
			arguments: { ID: { type: "string" } }
		},
		{
			opcode: "Shader_SetVec2",
			blockType: "command",
			text: "Shader [ID] .setVec2([NAME], [X] [Y])",
			arguments: {
				ID: { type: "string" },
				NAME: { type: "string" },
				X: { type: "number" },
				Y: { type: "number" }
			}
		},
		{
			opcode: "Shader_SetVec3",
			blockType: "command",
			text: "Shader [ID] .setVec3([NAME], [X] [Y] [Z])",
			arguments: {
				ID: { type: "string" },
				NAME: { type: "string" },
				X: { type: "number" },
				Y: { type: "number" },
				Z: { type: "number" }
			}
		},
		{
			opcode: "Shader_SetVec4",
			blockType: "command",
			text: "Shader [ID] .setVec4([NAME], [X], [Y], [Z], [W])",
			arguments: {
				ID: { type: "string" },
				NAME: { type: "string" },
				X: {
					type: "number",
					defaultValue: 0
				},
				Y: {
					type: "number",
					defaultValue: 0
				},
				Z: {
					type: "number",
					defaultValue: 0
				},
				W: {
					type: "number",
					defaultValue: 0
				}
			}
		},
		{
			opcode: "Shader_SetMat4",
			blockType: "command",
			text: "Shader [ID] .setMat4([NAME], [VAL])",
			arguments: {
				ID: { type: "string" },
				NAME: { type: "string" },
				VAL: { type: "string" }
			}
		},
		{
			opcode: "Shader_SetFloat",
			blockType: "command",
			text: "Shader [ID] .setFloat([NAME], [V])",
			arguments: {
				ID: { type: "string" },
				NAME: { type: "string" },
				V: { type: "number" }
			}
		},
		{
			opcode: "Shader_SetInt",
			blockType: "command",
			text: "Shader [ID] .setInt([NAME], [V])",
			arguments: {
				ID: { type: "string" },
				NAME: { type: "string" },
				V: { type: "number" }
			}
		},
		{
			opcode: "Shader_SetBool",
			blockType: "command",
			text: "Shader [ID] .setBool([NAME], [V])",
			arguments: {
				ID: { type: "string" },
				NAME: { type: "string" },
				V: {
					type: "number",
					defaultValue: 0
				}
			}
		},
		{
			blockType: "label",
			text: "Framebuffer"
		},
		{
			opcode: "FBO_Create",
			blockType: "command",
			text: "new FBO [ID] ()",
			arguments: { ID: { type: "string" } }
		},
		{
			opcode: "FBO_AttachTexture",
			blockType: "command",
			text: "FBO [ID] .attachTexture([TEX], [SLOT])",
			arguments: {
				ID: { type: "string" },
				TEX: { type: "string" },
				SLOT: {
					type: "string",
					menu: "fboSlotMenu"
				}
			}
		},
		{
			opcode: "FBO_AttachCubeTexture",
			blockType: "command",
			text: "FBO [ID] .attachCubemap([TEX], Face:[FACE_INDEX], [SLOT])",
			arguments: {
				ID: { type: "string" },
				TEX: { type: "string" },
				FACE_INDEX: { type: "number" },
				SLOT: {
					type: "string",
					menu: "fboSlotMenu"
				}
			}
		},
		{
			opcode: "Stencil_Create",
			blockType: "command",
			text: "new StencilBuffer [ID] ([W], [H])",
			arguments: {
				NAME: { type: "string" },
				W: { type: "number" },
				H: { type: "number" }
			}
		},
		{
			opcode: "FBO_AttachStencil",
			blockType: "command",
			text: "FBO [ID] .attachStencil([STENCIL_NAME])",
			arguments: {
				ID: { type: "string" },
				STENCIL_NAME: { type: "string" }
			}
		},
		{
			opcode: "FBO_Bind",
			blockType: "command",
			text: "FBO [ID] .bind()",
			arguments: { ID: {
				type: "string",
				defaultValue: "null"
			} }
		},
		{
			blockType: "label",
			text: "Vertex Array Object"
		},
		{
			opcode: "VAO_CreateScreenQuad",
			blockType: "command",
			text: "VAO [ID] .setupQuad()",
			arguments: { ID: {
				type: "string",
				defaultValue: "screenQuad"
			} }
		},
		{
			opcode: "VAO_CreateCube",
			blockType: "command",
			text: "VAO [ID] .setupCube()",
			arguments: { ID: {
				type: "string",
				defaultValue: "cube"
			} }
		},
		{
			opcode: "VAO_CreateSphere",
			blockType: "command",
			text: "VAO [ID] .setupSphere([LAT], [LON])",
			arguments: {
				ID: {
					type: "string",
					defaultValue: "Sphere"
				},
				LAT: {
					type: "number",
					defaultValue: 16
				},
				LON: {
					type: "number",
					defaultValue: 16
				}
			}
		},
		{
			opcode: "VAO_Draw",
			blockType: "command",
			text: "VAO [ID] .draw(Count:[COUNT], [MODE])",
			arguments: {
				ID: { type: "string" },
				COUNT: {
					type: "number",
					defaultValue: -1
				},
				MODE: {
					type: "string",
					menu: "drawMode"
				}
			}
		},
		{
			opcode: "VAO_Destroy",
			blockType: "command",
			text: "VAO [ID] .destroy()",
			arguments: { ID: { type: "string" } }
		},
		{
			blockType: "label",
			text: "Texture"
		},
		{
			opcode: "Texture_CreateEmpty",
			blockType: "command",
			text: "new Texture2D [NAME] ([W], [H], [FORMAT])",
			arguments: {
				NAME: {
					type: "string",
					defaultValue: "texture2D"
				},
				W: {
					type: "number",
					defaultValue: 256
				},
				H: {
					type: "number",
					defaultValue: 256
				},
				FORMAT: {
					type: "string",
					menu: "texTypeMenu"
				}
			}
		},
		{
			opcode: "Texture_CreateEmptyCubemap",
			blockType: "command",
			text: "new TextureCube [NAME] ([SIZE], [FORMAT])",
			arguments: {
				NAME: {
					type: "string",
					defaultValue: "cubemap"
				},
				SIZE: {
					type: "number",
					defaultValue: 256
				},
				FORMAT: {
					type: "string",
					menu: "texTypeMenu"
				}
			}
		},
		{
			opcode: "Texture_SetFilter",
			blockType: "command",
			text: "Texture [NAME] .setFilter([MIN_MODE], [MAG_MODE])",
			arguments: {
				NAME: { type: "string" },
				MIN_MODE: {
					type: "string",
					menu: "filterMode",
					defaultValue: "LINEAR"
				},
				MAG_MODE: {
					type: "string",
					menu: "filterMode",
					defaultValue: "LINEAR"
				}
			}
		},
		{
			opcode: "Texture_SetWrap",
			blockType: "command",
			text: "Texture [NAME] .setWrap([MODE])",
			arguments: {
				NAME: { type: "string" },
				MODE: {
					type: "string",
					menu: "wrapMode",
					defaultValue: "REPEAT"
				}
			}
		},
		{
			opcode: "Texture_GenerateMipmap",
			blockType: "command",
			text: "Texture [NAME] .generateMipmap()",
			arguments: { NAME: { type: "string" } }
		},
		{
			opcode: "Texture_Bind",
			blockType: "command",
			text: "Texture [NAME] .bind([UNIT])",
			arguments: {
				NAME: { type: "string" },
				UNIT: { type: "number" }
			}
		},
		{
			opcode: "Texture_BindCube",
			blockType: "command",
			text: "TextureCube [NAME] .bind([UNIT])",
			arguments: {
				NAME: { type: "string" },
				UNIT: { type: "number" }
			}
		},
		{
			blockType: "label",
			text: "GL States"
		},
		{
			opcode: "gl_Clear",
			blockType: "command",
			text: "gl.clear([BIT])",
			arguments: { BIT: {
				type: "string",
				menu: "clearMenu"
			} }
		},
		{
			opcode: "gl_SetClearColor",
			blockType: "command",
			text: "gl.clearColor([R] [G] [B] [A])",
			arguments: {
				R: { type: "number" },
				G: { type: "number" },
				B: { type: "number" },
				A: { type: "number" }
			}
		},
		{
			opcode: "ST_Enable",
			blockType: "command",
			text: "gl.enable([CAP])",
			arguments: { CAP: {
				type: "string",
				menu: "capMenu"
			} }
		},
		{
			opcode: "ST_Disable",
			blockType: "command",
			text: "gl.disable([CAP])",
			arguments: { CAP: {
				type: "string",
				menu: "capMenu"
			} }
		},
		{
			opcode: "ST_CullFace",
			blockType: "command",
			text: "gl.cullFace [MODE]",
			arguments: { MODE: {
				type: "string",
				menu: "faceMenu",
				defaultValue: "BACK"
			} }
		},
		{
			opcode: "ST_ColorMask",
			blockType: "command",
			text: "gl.colorMask [STATE]",
			arguments: { STATE: {
				type: "string",
				menu: "boolMenu"
			} }
		},
		{
			opcode: "ST_BlendFuncSeparate",
			blockType: "command",
			text: "gl.blendFuncSeparate [SRGB] [DRGB] [SA] [DA]",
			arguments: {
				SRGB: {
					type: "string",
					menu: "blendMenu",
					defaultValue: "ONE"
				},
				DRGB: {
					type: "string",
					menu: "blendMenu",
					defaultValue: "ONE"
				},
				SA: {
					type: "string",
					menu: "blendMenu",
					defaultValue: "ZERO"
				},
				DA: {
					type: "string",
					menu: "blendMenu",
					defaultValue: "ONE"
				}
			}
		},
		{
			opcode: "ST_DepthMask",
			blockType: "command",
			text: "gl.depthMask [STATE]",
			arguments: { STATE: {
				type: "string",
				menu: "boolMenu",
				defaultValue: "true"
			} }
		},
		{
			opcode: "ST_DepthFunc",
			blockType: "command",
			text: "gl.depthFunc [FUNC]",
			arguments: { FUNC: {
				type: "string",
				menu: "funcMenu",
				defaultValue: "LESS"
			} }
		},
		{
			opcode: "ST_StencilMask",
			blockType: "command",
			text: "gl.stencilMask [MASK]",
			arguments: { MASK: {
				type: "number",
				defaultValue: 255
			} }
		},
		{
			opcode: "ST_StencilOp",
			blockType: "command",
			text: "gl.stencilOp [FACE] fail [SF] zfail [DF] zpass [DP]",
			arguments: {
				FACE: {
					type: "string",
					menu: "faceMenu",
					defaultValue: "FRONT_AND_BACK"
				},
				SF: {
					type: "string",
					menu: "opMenu",
					defaultValue: "KEEP"
				},
				DF: {
					type: "string",
					menu: "opMenu",
					defaultValue: "KEEP"
				},
				DP: {
					type: "string",
					menu: "opMenu",
					defaultValue: "KEEP"
				}
			}
		},
		{
			opcode: "ST_StencilFunc",
			blockType: "command",
			text: "gl.stencilFunc [FACE] [FUNC] ref [REF] mask [MASK]",
			arguments: {
				FACE: {
					type: "string",
					menu: "faceMenu",
					defaultValue: "FRONT_AND_BACK"
				},
				FUNC: {
					type: "string",
					menu: "funcMenu",
					defaultValue: "ALWAYS"
				},
				REF: {
					type: "number",
					defaultValue: 0
				},
				MASK: {
					type: "number",
					defaultValue: 255
				}
			}
		},
		"---",
		"---"
	];
	//#endregion
	//#region src/blocks/Scene_b.js
	var SceneBlocks = [
		{
			opcode: "Scene_Create",
			blockType: "command",
			text: "new Scene [ID] ()",
			arguments: { ID: {
				type: "string",
				defaultValue: "Main"
			} }
		},
		{
			opcode: "Scene_Destroy",
			blockType: "command",
			text: "Scene [ID] .destroy()",
			arguments: { ID: {
				type: "string",
				defaultValue: "Main"
			} }
		},
		{
			opcode: "Scene_Clear",
			blockType: "command",
			text: "Scene [SCENE_ID] .clear()",
			arguments: { SCENE_ID: {
				type: "string",
				defaultValue: "Main"
			} }
		},
		{
			blockType: "label",
			text: "Node"
		},
		{
			opcode: "Scene_NodeSetTRS",
			blockType: "command",
			text: "Scene [SCENE_ID] node index [NODE_IDX] set transform [TRS]",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				NODE_IDX: {
					type: "number",
					defaultValue: 0
				},
				TRS: {
					type: "string",
					defaultValue: "[0,0,0, 0,0,0, 1,1,1]"
				}
			}
		},
		{
			opcode: "Scene_NodeSetParent",
			blockType: "command",
			text: "Scene [SCENE_ID] node index [CHILD_IDX] set parent to index [PARENT_IDX]",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				CHILD_IDX: {
					type: "number",
					defaultValue: 0
				},
				PARENT_IDX: {
					type: "number",
					defaultValue: -1
				}
			}
		},
		{
			opcode: "Scene_GetNodeMatrix",
			blockType: "reporter",
			text: "Scene [SCENE_ID] node index [NODE_IDX] .worldMatrix",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				NODE_IDX: {
					type: "number",
					defaultValue: 0
				}
			}
		},
		{
			opcode: "Scene_GetNodeTRS",
			blockType: "reporter",
			text: "Scene [SCENE_ID] node index [NODE_IDX] .TRS",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				NODE_IDX: {
					type: "number",
					defaultValue: 0
				}
			}
		},
		{
			opcode: "Scene_UpdateWorldMatrix",
			blockType: "command",
			text: "Scene [SCENE_ID] .updateWorldMatrix()",
			arguments: { SCENE_ID: {
				type: "string",
				defaultValue: "Main"
			} }
		},
		{
			blockType: "label",
			text: "Model"
		},
		{
			opcode: "Scene_GetModelRootIndex",
			blockType: "reporter",
			text: "Scene [SCENE_ID] get model [MODEL] root index",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "sample"
				}
			}
		},
		{
			blockType: "label",
			text: "Joint"
		},
		{
			opcode: "Scene_GetJointNodeIndex",
			blockType: "reporter",
			text: "Scene [SCENE_ID] get model [MODEL] joint [IDX] index",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "animation"
				},
				IDX: {
					type: "number",
					defaultValue: 0
				}
			}
		},
		{
			opcode: "Scene_GetJointCount",
			blockType: "reporter",
			text: "Scene [SCENE_ID] model [MODEL] .jointCount",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "animation"
				}
			}
		},
		{
			opcode: "Scene_ModelSetJointTRS",
			blockType: "command",
			text: "Scene [SCENE_ID] model [MODEL] .joints [IDX] .setTRS [TRS]",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "animation"
				},
				IDX: {
					type: "number",
					defaultValue: 0
				},
				TRS: {
					type: "string",
					defaultValue: "[0,0,0, 0,0,0, 1,1,1]"
				}
			}
		},
		{
			opcode: "Scene_ModelJointIndexToName",
			blockType: "reporter",
			text: "Scene [SCENE_ID] model [MODEL] joint index [IDX] -> name",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "animation"
				},
				IDX: {
					type: "number",
					defaultValue: 0
				}
			}
		},
		{
			opcode: "Scene_ModelJointNameToIndex",
			blockType: "reporter",
			text: "Scene [SCENE_ID] model [MODEL] joint name [NAME] -> index",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "animation"
				},
				NAME: {
					type: "string",
					defaultValue: "Hips"
				}
			}
		},
		{
			opcode: "Scene_ModelBindSkeletonTex",
			blockType: "command",
			text: "Scene [SCENE_ID] model [MODEL] .bindSkeletonTexture ( [UNIT] )",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "animation"
				},
				UNIT: {
					type: "number",
					defaultValue: 1
				}
			}
		},
		{
			blockType: "label",
			text: "Mesh"
		},
		{
			opcode: "Scene_GetMeshNodeIndex",
			blockType: "reporter",
			text: "Scene [SCENE_ID] get model [MODEL] mesh [IDX] index",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "sample"
				},
				IDX: {
					type: "number",
					defaultValue: 0
				}
			}
		},
		{
			opcode: "Scene_GetMeshCount",
			blockType: "reporter",
			text: "Scene [SCENE_ID] model [MODEL] .meshCount",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "sample"
				}
			}
		},
		{
			opcode: "Scene_MeshBindTex",
			blockType: "command",
			text: "Scene [SCENE_ID] model [MODEL] .meshes [IDX] .material .bind([TEX_TYPE], [UNIT])",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "sample"
				},
				IDX: {
					type: "number",
					defaultValue: 0
				},
				TEX_TYPE: {
					type: "string",
					menu: "pbrTexMenu"
				},
				UNIT: {
					type: "number",
					defaultValue: 0
				}
			}
		},
		{
			opcode: "Scene_MeshTex_SetFilter",
			blockType: "command",
			text: "Scene [SCENE_ID] model [MODEL] .meshes [IDX] .material .setFilter([NAME], [MIN_MODE], [MAG_MODE])",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "sample"
				},
				IDX: {
					type: "number",
					defaultValue: 0
				},
				NAME: {
					type: "string",
					menu: "pbrTexMenu"
				},
				MIN_MODE: {
					type: "string",
					menu: "filterMode"
				},
				MAG_MODE: {
					type: "string",
					menu: "filterMode"
				}
			}
		},
		{
			opcode: "Scene_MeshTex_SetWrap",
			blockType: "command",
			text: "Scene [SCENE_ID] model [MODEL] .meshes [IDX] .material .setWrap([NAME], [MODE])",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "sample"
				},
				IDX: {
					type: "number",
					defaultValue: 0
				},
				NAME: {
					type: "string",
					menu: "pbrTexMenu"
				},
				MODE: {
					type: "string",
					menu: "wrapMode"
				}
			}
		},
		{
			opcode: "Scene_MeshGetParam",
			blockType: "reporter",
			text: "Scene [SCENE_ID] model [MODEL] .meshes[IDX] .material .get([PARAM])",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "sample"
				},
				IDX: {
					type: "number",
					defaultValue: 0
				},
				PARAM: {
					type: "string",
					menu: "pbrParamMenu"
				}
			}
		},
		{
			opcode: "Scene_MeshGetLightmapParam",
			blockType: "reporter",
			text: "Scene [SCENE_ID] model [MODEL] .meshes[IDX] .getLightmap([PARAM])",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "sample"
				},
				IDX: {
					type: "number",
					defaultValue: 0
				},
				PARAM: {
					type: "string",
					menu: "lightmapParamMenu"
				}
			}
		},
		{
			opcode: "Scene_MeshGetLightmapScaleOffsetComp",
			blockType: "reporter",
			text: "Scene [SCENE_ID] model [MODEL] .meshes[IDX] .material .lightmapScaleOffset .[COMP]",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "sample"
				},
				IDX: {
					type: "number",
					defaultValue: 0
				},
				COMP: {
					type: "string",
					menu: "v4CompMenu"
				}
			}
		},
		{
			opcode: "Scene_MeshDraw",
			blockType: "command",
			text: "Scene [SCENE_ID] model [MODEL] .meshes[IDX] .vao .draw([MODE])",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "sample"
				},
				IDX: {
					type: "number",
					defaultValue: 0
				},
				MODE: {
					type: "string",
					menu: "drawMode"
				}
			}
		},
		"---",
		"---"
	];
	//#endregion
	//#region src/blocks/Loader_b.js
	var LoaderBlocks = [
		{
			blockType: "label",
			text: "GLB Loader"
		},
		{
			opcode: "Loader_load_glb",
			blockType: "command",
			text: "Loader.loadGLB([U]) to Scene [SCENE_ID] as [NAME]",
			arguments: {
				U: {
					type: "string",
					defaultValue: "https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@main/Models/WaterBottle/glTF-Binary/WaterBottle.glb"
				},
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				NAME: {
					type: "string",
					defaultValue: "sample"
				}
			}
		},
		{
			opcode: "Loader_apply_lightmap_metadata",
			blockType: "command",
			text: "Loader.applyLightmapMeta([JSON]) to Model [NAME] in Scene [SCENE_ID]",
			arguments: {
				JSON: {
					type: "string",
					defaultValue: "{\"items\":[]}"
				},
				NAME: {
					type: "string",
					defaultValue: "sample"
				},
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				}
			}
		},
		{
			blockType: "label",
			text: "Texture Loader"
		},
		{
			opcode: "Loader_load_texture_url",
			blockType: "command",
			text: "Loader.loadTexture( [U] , [NAME] )",
			arguments: {
				U: {
					type: "string",
					defaultValue: "https://..."
				},
				NAME: {
					type: "string",
					defaultValue: "texURL1"
				}
			}
		},
		{
			opcode: "Loader_load_texture_costume",
			blockType: "command",
			text: "Loader.loadTextureFromCostume( [C], [NAME] )",
			arguments: {
				C: {
					type: "string",
					menu: "costumeMenu"
				},
				NAME: {
					type: "string",
					defaultValue: "texCostume1"
				}
			}
		},
		{
			opcode: "Loader_load_ktx_url",
			blockType: "command",
			text: "Loader.loadKTX( [U] , [NAME] )",
			arguments: {
				U: {
					type: "string",
					defaultValue: "https://..."
				},
				NAME: {
					type: "string",
					defaultValue: "envMap1"
				}
			}
		},
		{
			opcode: "Loader_load_hdr_url",
			blockType: "command",
			text: "Loader.loadHDR( [U] , [NAME] )",
			arguments: {
				U: {
					type: "string",
					defaultValue: "https://..."
				},
				NAME: {
					type: "string",
					defaultValue: "lightmap1"
				}
			}
		},
		"---",
		"---"
	];
	//#endregion
	//#region src/blocks/Math3D_b.js
	var Math3DBlocks = [
		{
			blockType: "label",
			text: "Vector"
		},
		{
			opcode: "v3_Init",
			blockType: "command",
			text: "vec3 [ID] = X [X] Y [Y] Z [Z]",
			arguments: {
				ID: {
					type: "string",
					defaultValue: "v1"
				},
				X: { type: "number" },
				Y: { type: "number" },
				Z: { type: "number" }
			}
		},
		{
			opcode: "v3_Modify",
			blockType: "command",
			text: "vec3 [ID] [OP] [OTHER]",
			arguments: {
				ID: {
					type: "string",
					defaultValue: "v1"
				},
				OP: {
					type: "string",
					menu: "v3OpMenu"
				},
				OTHER: {
					type: "string",
					defaultValue: "v2"
				}
			}
		},
		{
			opcode: "v3_ApplyMatrix",
			blockType: "command",
			text: "vec3 [ID] apply mat4 [M]",
			arguments: {
				ID: {
					type: "string",
					defaultValue: "v1"
				},
				M: { type: "string" }
			}
		},
		{
			opcode: "v3_Get",
			blockType: "reporter",
			text: "vec3 [ID] 's [COMP]",
			arguments: {
				ID: {
					type: "string",
					defaultValue: "v1"
				},
				COMP: {
					type: "string",
					menu: "v3CompMenu"
				}
			}
		},
		{
			blockType: "label",
			text: "Matrix"
		},
		{
			opcode: "m4_Identity",
			blockType: "reporter",
			text: "glm::mat4"
		},
		{
			opcode: "m4_Perspective",
			blockType: "reporter",
			text: "glm::perspective [F] [A] [N] [F2]",
			arguments: {
				F: {
					type: "number",
					defaultValue: 45
				},
				A: {
					type: "number",
					defaultValue: 1.33
				},
				N: {
					type: "number",
					defaultValue: .1
				},
				F2: {
					type: "number",
					defaultValue: 100
				}
			}
		},
		{
			opcode: "m4_LookAt",
			blockType: "reporter",
			text: "glm::lookAt Eye[EX],[EY],[EZ] Target[TX],[TY],[TZ] Up[UX],[UY],[UZ]",
			arguments: {
				EX: {
					type: "number",
					defaultValue: 0
				},
				EY: {
					type: "number",
					defaultValue: 0
				},
				EZ: {
					type: "number",
					defaultValue: 5
				},
				TX: {
					type: "number",
					defaultValue: 0
				},
				TY: {
					type: "number",
					defaultValue: 0
				},
				TZ: {
					type: "number",
					defaultValue: 0
				},
				UX: {
					type: "number",
					defaultValue: 0
				},
				UY: {
					type: "number",
					defaultValue: 1
				},
				UZ: {
					type: "number",
					defaultValue: 0
				}
			}
		},
		{
			opcode: "m4_Translate",
			blockType: "reporter",
			text: "glm::translate [M] [X] [Y] [Z]",
			arguments: {
				M: { type: "string" },
				X: { type: "number" },
				Y: { type: "number" },
				Z: { type: "number" }
			}
		},
		{
			opcode: "m4_Rotate",
			blockType: "reporter",
			text: "glm::rotate [M] [AXIS] [DEG]",
			arguments: {
				M: { type: "string" },
				AXIS: {
					type: "string",
					menu: "axisMenu"
				},
				DEG: { type: "number" }
			}
		},
		{
			opcode: "m4_Scale",
			blockType: "reporter",
			text: "glm::scale [M] X[X] Y[Y] Z[Z]",
			arguments: {
				M: { type: "string" },
				X: {
					type: "number",
					defaultValue: 1
				},
				Y: {
					type: "number",
					defaultValue: 1
				},
				Z: {
					type: "number",
					defaultValue: 1
				}
			}
		},
		{
			opcode: "m4_Multiply",
			blockType: "reporter",
			text: "glm:: [A] * [B]",
			arguments: {
				A: { type: "string" },
				B: { type: "string" }
			}
		},
		{
			opcode: "m4_Inverse",
			blockType: "reporter",
			text: "glm::inverse [M]",
			arguments: { M: { type: "string" } }
		},
		{
			blockType: "label",
			text: "TRS"
		},
		{
			opcode: "TRS_Create",
			blockType: "reporter",
			text: "TRS Pos[PX][PY][PZ] Rot[RX][RY][RZ] Scale[SX][SY][SZ]",
			arguments: {
				PX: {
					type: "number",
					defaultValue: 0
				},
				PY: {
					type: "number",
					defaultValue: 0
				},
				PZ: {
					type: "number",
					defaultValue: 0
				},
				RX: {
					type: "number",
					defaultValue: 0
				},
				RY: {
					type: "number",
					defaultValue: 0
				},
				RZ: {
					type: "number",
					defaultValue: 0
				},
				SX: {
					type: "number",
					defaultValue: 1
				},
				SY: {
					type: "number",
					defaultValue: 1
				},
				SZ: {
					type: "number",
					defaultValue: 1
				}
			}
		},
		{
			opcode: "TRS_Decompose",
			blockType: "reporter",
			text: "decompose [TRS] : [TYPE] [AXIS]",
			arguments: {
				TRS: {
					type: "string",
					defaultValue: "[0,0,0, 0,0,0, 1,1,1]"
				},
				TYPE: {
					type: "string",
					menu: "TRSTypeMenu"
				},
				AXIS: {
					type: "string",
					menu: "AxisMenu"
				}
			}
		},
		{
			opcode: "TRS_Add",
			blockType: "reporter",
			text: "combine TRS [TRSA] with [TRSB]",
			arguments: {
				TRSA: {
					type: "string",
					defaultValue: "[0,0,0, 0,0,0, 1,1,1]"
				},
				TRSB: {
					type: "string",
					defaultValue: "[0,0,0, 0,0,0, 1,1,1]"
				}
			}
		},
		{
			opcode: "TRS_Lerp",
			blockType: "reporter",
			text: "interpolate TRS from [A] to [B] t:[T]",
			arguments: {
				A: {
					type: "string",
					defaultValue: "[0,0,0, 0,0,0, 1,1,1]"
				},
				B: {
					type: "string",
					defaultValue: "[0,0,0, 0,0,0, 1,1,1]"
				},
				T: {
					type: "number",
					defaultValue: .5
				}
			}
		},
		"---",
		"---"
	];
	//#endregion
	//#region src/blocks/CubeCamera_b.js
	var CubeCameraBlocks = [{
		opcode: "CubeCam_GetViewMatrix",
		blockType: "reporter",
		text: "CubeCam.viewMatrix([X] [Y] [Z], [FACE])",
		arguments: {
			X: {
				type: "number",
				defaultValue: 0
			},
			Y: {
				type: "number",
				defaultValue: 0
			},
			Z: {
				type: "number",
				defaultValue: 0
			},
			FACE: {
				type: "number",
				defaultValue: 0
			}
		}
	}, {
		opcode: "CubeCam_GetProjection",
		blockType: "reporter",
		text: "CubeCam.projectionMatrix()"
	}];
	//#endregion
	//#region src/blocks/Text_b.js
	var TextBlocks = [
		{
			opcode: "Text_Create",
			blockType: "command",
			text: "new Text([NAME], [TEXT], [FONT], [COLOR], [B_COLOR], [SIZE])",
			arguments: {
				NAME: {
					type: "string",
					defaultValue: "text1"
				},
				TEXT: {
					type: "string",
					defaultValue: "Hello!"
				},
				FONT: {
					type: "string",
					defaultValue: "32px sans-serif"
				},
				COLOR: {
					type: "color",
					defaultValue: "#ffffff"
				},
				SIZE: {
					type: "number",
					defaultValue: 0
				},
				B_COLOR: {
					type: "color",
					defaultValue: "#000000"
				}
			}
		},
		{
			opcode: "Text_GetWidth",
			blockType: "reporter",
			text: "width of text [TEXT] font [FONT] size [BORDER_SIZE]",
			arguments: {
				TEXT: {
					type: "string",
					defaultValue: "Hello!"
				},
				FONT: {
					type: "string",
					defaultValue: "32px sans-serif"
				},
				BORDER_SIZE: {
					type: "number",
					defaultValue: 0
				}
			}
		},
		{
			opcode: "Text_GetHeight",
			blockType: "reporter",
			text: "height of text [TEXT] font [FONT] size [BORDER_SIZE]",
			arguments: {
				TEXT: {
					type: "string",
					defaultValue: "Hello!"
				},
				FONT: {
					type: "string",
					defaultValue: "32px sans-serif"
				},
				BORDER_SIZE: {
					type: "number",
					defaultValue: 0
				}
			}
		}
	];
	//#endregion
	//#region src/blocks/AnimationPlayer_b.js
	var AnimationPlayerBlocks = [
		{
			blockType: "label",
			text: "Clip"
		},
		{
			opcode: "Animation_AddClip",
			blockType: "command",
			text: "Scene [SCENE_ID] model [MODEL] create clip [CLIP_ID] ( [ANIM_NAME] )",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "animation"
				},
				CLIP_ID: {
					type: "string",
					defaultValue: "walk_layer"
				},
				ANIM_NAME: {
					type: "string",
					defaultValue: "Walk"
				}
			}
		},
		{
			opcode: "Animation_SetClipProperty",
			blockType: "command",
			text: "Scene [SCENE_ID] model [MODEL] clips [CLIP_ID] .set([PROP], [VALUE])",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "animation"
				},
				CLIP_ID: {
					type: "string",
					defaultValue: "walk_layer"
				},
				PROP: {
					type: "string",
					menu: "clipPropMenu"
				},
				VALUE: {
					type: "number",
					defaultValue: 0
				}
			}
		},
		{
			opcode: "Animation_RemoveClip",
			blockType: "command",
			text: "Scene [SCENE_ID] model [MODEL] clips [CLIP_ID] .remove()",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "animation"
				},
				CLIP_ID: {
					type: "string",
					defaultValue: "walk_layer"
				}
			}
		},
		{
			opcode: "Animation_ClearClips",
			blockType: "command",
			text: "Scene [SCENE_ID] .models [MODEL] .clearAllClips()",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "sample"
				}
			}
		},
		{
			opcode: "Animation_SetClipBoneWeight",
			blockType: "command",
			text: "Scene [SCENE_ID] model [MODEL] clips [CLIP_ID] .setBoneWeight([BONE_NAME], [WEIGHT], [RECURSIVE])",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "animation"
				},
				CLIP_ID: {
					type: "string",
					defaultValue: "walk_layer"
				},
				BONE_NAME: {
					type: "string",
					defaultValue: "Spine"
				},
				WEIGHT: {
					type: "number",
					defaultValue: 0
				},
				RECURSIVE: {
					type: "string",
					menu: "yesNoMenu"
				}
			}
		},
		{
			opcode: "Animation_ApplyTime",
			blockType: "command",
			text: "Scene [SCENE_ID] .animationTime = [TIME]",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				TIME: {
					type: "number",
					defaultValue: 0
				}
			}
		},
		"---",
		{
			opcode: "Animation_GetNodeTRS",
			blockType: "reporter",
			text: "Scene [SCENE_ID] node [MODEL] get current TRS",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "animation"
				}
			}
		},
		{
			opcode: "Animation_GetModelJointTRS",
			blockType: "reporter",
			text: "Scene [SCENE_ID] model [MODEL] .joints [IDX] get current TRS",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "animation"
				},
				IDX: {
					type: "number",
					defaultValue: 0
				}
			}
		},
		{
			opcode: "Animation_GetTrackCount",
			blockType: "reporter",
			text: "Scene [SCENE_ID] model [MODEL] get tracks count",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "animation"
				}
			}
		},
		{
			opcode: "Animation_IsTimelineActive",
			blockType: "reporter",
			text: "Scene [SCENE_ID] model [MODEL] is timeline active?",
			arguments: {
				SCENE_ID: {
					type: "string",
					defaultValue: "Main"
				},
				MODEL: {
					type: "string",
					defaultValue: "animation"
				}
			}
		}
	];
	//#endregion
	//#region src/lib/Tools/Utils.js
	var Utils;
	var init_Utils = __esmMin((() => {
		Utils = class {
			static parseInput(input, util) {
				if (typeof input === "string" && input.startsWith("[")) try {
					return JSON.parse(input);
				} catch (e) {
					return null;
				}
				const list = util.target.lookupVariableByNameAndType(input, "list");
				return list ? list.value.map(Number) : null;
			}
			static async fetchBinary(url) {
				if (url.startsWith("data:")) {
					const b64 = url.split(",").pop();
					const binStr = atob(b64);
					const bytes = new Uint8Array(binStr.length);
					for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
					return bytes;
				}
				const response = await fetch(url);
				if (!response.ok) throw new Error(`Vapor3D: HTTP error! status: ${response.status}`);
				return new Uint8Array(await response.arrayBuffer());
			}
			static getFormatConfig(gl, formatStr) {
				if (!gl) return null;
				const key = String(formatStr).toUpperCase().trim();
				const map = {
					"RGB16F": {
						internal: gl.RGB16F,
						format: gl.RGB,
						type: gl.HALF_FLOAT
					},
					"RGBA16F": {
						internal: gl.RGBA16F,
						format: gl.RGBA,
						type: gl.HALF_FLOAT
					},
					"RGB32F": {
						internal: gl.RGB32F,
						format: gl.RGB,
						type: gl.FLOAT
					},
					"RGB8": {
						internal: gl.RGB8,
						format: gl.RGB,
						type: gl.UNSIGNED_BYTE
					},
					"RGBA8": {
						internal: gl.RGBA8,
						format: gl.RGBA,
						type: gl.UNSIGNED_BYTE
					},
					"R11G11B10F": {
						internal: gl.R11F_G11F_B10F,
						format: gl.RGB,
						type: gl.FLOAT
					},
					"R16F": {
						internal: gl.R16F,
						format: gl.RED,
						type: gl.HALF_FLOAT
					},
					"RG16F": {
						internal: gl.RG16F,
						format: gl.RG,
						type: gl.HALF_FLOAT
					},
					"DEPTH24_STENCIL8": {
						internal: gl.DEPTH24_STENCIL8,
						format: gl.DEPTH_STENCIL,
						type: gl.UNSIGNED_INT_24_8
					},
					"DEPTH_COMPONENT24": {
						internal: gl.DEPTH_COMPONENT24,
						format: gl.DEPTH_COMPONENT,
						type: gl.UNSIGNED_INT
					}
				};
				return map[key] || map["RGBA8"];
			}
			static parseKTX(buffer) {
				const bytes = new Uint8Array(buffer);
				const identifier = [
					171,
					75,
					84,
					88,
					32,
					49,
					49,
					187,
					13,
					10,
					26,
					10
				];
				for (let i = 0; i < 12; i++) if (bytes[i] !== identifier[i]) throw new Error("Vapor3D: Not a valid KTX 1.0 file");
				const dv = new DataView(buffer);
				const littleEndian = dv.getUint32(12, true) === 67305985;
				const glType = dv.getUint32(16, littleEndian);
				const glFormat = dv.getUint32(24, littleEndian);
				const glInternalFormat = dv.getUint32(28, littleEndian);
				const pixelWidth = dv.getUint32(36, littleEndian);
				const pixelHeight = dv.getUint32(40, littleEndian);
				const numberOfFaces = dv.getUint32(52, littleEndian);
				let numberOfMipmapLevels = dv.getUint32(56, littleEndian);
				const bytesOfKeyValueData = dv.getUint32(60, littleEndian);
				if (numberOfFaces !== 6) throw new Error("Vapor3D: KTX must be a Cubemap");
				if (numberOfMipmapLevels === 0) numberOfMipmapLevels = 1;
				let offset = 64 + bytesOfKeyValueData;
				const mipmaps = [];
				for (let mip = 0; mip < numberOfMipmapLevels; mip++) {
					const imageSize = dv.getUint32(offset, littleEndian);
					offset += 4;
					for (let face = 0; face < numberOfFaces; face++) {
						const faceBuffer = buffer.slice(offset, offset + imageSize);
						let dataArray;
						if (glType === 5126) dataArray = new Float32Array(faceBuffer);
						else if (glType === 5131 || glType === 36193) dataArray = new Uint16Array(faceBuffer);
						else dataArray = new Uint8Array(faceBuffer);
						mipmaps.push({
							level: mip,
							face,
							width: Math.max(1, pixelWidth >> mip),
							height: Math.max(1, pixelHeight >> mip),
							data: dataArray
						});
						offset += imageSize;
						offset = offset + 3 & -4;
					}
					offset = offset + 3 & -4;
				}
				return {
					glInternalFormat,
					glFormat,
					glType,
					numberOfMipmapLevels,
					mipmaps
				};
			}
			static parseHDR(buffer) {
				const view = new DataView(buffer);
				let pos = 0;
				const readLine = () => {
					let str = "";
					while (pos < buffer.byteLength) {
						const char = String.fromCharCode(view.getUint8(pos++));
						if (char === "\n") break;
						str += char;
					}
					return str;
				};
				let line = readLine();
				if (!line.startsWith("#?")) throw new Error("Vapor3D: Invalid HDR format");
				while (pos < buffer.byteLength) {
					line = readLine();
					if (line.startsWith("-Y") || line.startsWith("+Y")) break;
				}
				const parts = line.split(/\s+/);
				const height = parseInt(parts[1]);
				const width = parseInt(parts[3]);
				const floatData = new Float32Array(width * height * 3);
				let floatOffset = 0;
				for (let y = 0; y < height; y++) {
					const rgbe = new Uint8Array(4);
					rgbe[0] = view.getUint8(pos++);
					rgbe[1] = view.getUint8(pos++);
					rgbe[2] = view.getUint8(pos++);
					rgbe[3] = view.getUint8(pos++);
					if (!(rgbe[0] === 2 && rgbe[1] === 2 && !(rgbe[2] & 128))) {
						const convertToFloat = (r, g, b, e) => {
							if (e === 0) return [
								0,
								0,
								0
							];
							const f = Math.pow(2, e - 128) / 256;
							return [
								r * f,
								g * f,
								b * f
							];
						};
						let res = convertToFloat(rgbe[0], rgbe[1], rgbe[2], rgbe[3]);
						floatData[floatOffset++] = res[0];
						floatData[floatOffset++] = res[1];
						floatData[floatOffset++] = res[2];
						for (let x = 1; x < width; x++) {
							res = convertToFloat(view.getUint8(pos++), view.getUint8(pos++), view.getUint8(pos++), view.getUint8(pos++));
							floatData[floatOffset++] = res[0];
							floatData[floatOffset++] = res[1];
							floatData[floatOffset++] = res[2];
						}
					} else {
						const scanline = new Uint8Array(4 * width);
						let scanOffset = 0;
						for (let channel = 0; channel < 4; channel++) {
							const channelEnd = (channel + 1) * width;
							while (scanOffset < channelEnd) {
								let code = view.getUint8(pos++);
								if (code > 128) {
									let count = code - 128;
									let val = view.getUint8(pos++);
									while (count-- > 0) scanline[scanOffset++] = val;
								} else {
									let count = code;
									while (count-- > 0) scanline[scanOffset++] = view.getUint8(pos++);
								}
							}
						}
						for (let x = 0; x < width; x++) {
							const r = scanline[x];
							const g = scanline[x + width];
							const b = scanline[x + 2 * width];
							const e = scanline[x + 3 * width];
							if (e > 0) {
								const f = Math.pow(2, e - 136);
								floatData[floatOffset++] = r * f;
								floatData[floatOffset++] = g * f;
								floatData[floatOffset++] = b * f;
							} else {
								floatData[floatOffset++] = 0;
								floatData[floatOffset++] = 0;
								floatData[floatOffset++] = 0;
							}
						}
					}
				}
				return {
					width,
					height,
					data: floatData
				};
			}
		};
	}));
	//#endregion
	//#region src/lib/Engine/Core.js
	var Core_exports = /* @__PURE__ */ __exportAll({ Core: () => Core });
	var Core;
	var init_Core = __esmMin((() => {
		Core = class {
			constructor() {
				this.canvas = document.createElement("canvas");
				this.canvas.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;image-rendering:pixelated;z-index:0;";
				this.gl = this.canvas.getContext("webgl2", {
					alpha: true,
					depth: true,
					stencil: true,
					antialias: false,
					preserveDrawingBuffer: true,
					powerPreference: "high-performance"
				});
				if (!this.gl) throw new Error("WebGL2 not supported");
				this.gl.getExtension("OES_texture_float_linear");
				this.gl.getExtension("OES_texture_half_float_linear");
				this.gl.getExtension("EXT_color_buffer_float");
			}
			resize(width, height) {
				if (this.canvas.width !== width || this.canvas.height !== height) {
					this.canvas.width = width;
					this.canvas.height = height;
					this.gl.viewport(0, 0, width, height);
				}
			}
			destroy() {
				if (this.canvas.parentElement) this.canvas.remove();
				const ext = this.gl.getExtension("WEBGL_lose_context");
				if (ext) ext.loseContext();
			}
			clear(maskMode) {
				const gl = this.gl;
				const mask = maskMode === "ALL" ? gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT : gl[maskMode];
				gl.clear(mask);
			}
			setClearColor(r, g, b, a) {
				this.gl.clearColor(r, g, b, a);
			}
			enable(cap) {
				this.gl.enable(this.gl[cap]);
			}
			disable(cap) {
				this.gl.disable(this.gl[cap]);
			}
			cullFace(mode) {
				this.gl.cullFace(this.gl[mode]);
			}
			depthMask(state) {
				this.gl.depthMask(state);
			}
			depthFunc(func) {
				this.gl.depthFunc(this.gl[func]);
			}
			colorMask(r, g, b, a) {
				this.gl.colorMask(r, g, b, a);
			}
			blendFuncSeparate(srgb, drgb, sa, da) {
				this.gl.blendFuncSeparate(this.gl[srgb], this.gl[drgb], this.gl[sa], this.gl[da]);
			}
			stencilOp(face, sf, zf, zp) {
				this.gl.stencilOpSeparate(this.gl[face], this.gl[sf], this.gl[zf], this.gl[zp]);
			}
			stencilFunc(face, func, ref, mask) {
				this.gl.stencilFuncSeparate(this.gl[face], this.gl[func], ref, mask);
			}
			stencilMask(mask) {
				this.gl.stencilMask(mask);
			}
		};
	}));
	//#endregion
	//#region src/lib/Engine/Shader.js
	var Shader;
	var init_Shader = __esmMin((() => {
		Shader = class {
			constructor(gl, vsSource, fsSource) {
				this.gl = gl;
				this.program = gl.createProgram();
				this.locationCache = /* @__PURE__ */ new Map();
				const vSrc = this._fixGLSL(vsSource);
				const fSrc = this._fixGLSL(fsSource);
				const vShader = this._compile(gl.VERTEX_SHADER, vSrc);
				const fShader = this._compile(gl.FRAGMENT_SHADER, fSrc);
				if (!vShader || !fShader) return;
				gl.attachShader(this.program, vShader);
				gl.attachShader(this.program, fShader);
				gl.linkProgram(this.program);
				if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) console.error("Shader Link Error:", gl.getProgramInfoLog(this.program));
			}
			_fixGLSL(src) {
				if (!src) return "";
				let s = src.trim().replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, (m) => m + "\n");
				if (s.includes("#version")) s = s.replace(/(#version\s+300\s+es)\s*/, "$1\n");
				if ((s.match(/\n/g) || []).length < 3) s = s.replace(/;/g, ";\n").replace(/{/g, "{\n").replace(/}/g, "}\n");
				return s.split("\n").map((line) => line.trim()).filter((line) => line.length > 0).join("\n");
			}
			_compile(type, source) {
				const shader = this.gl.createShader(type);
				this.gl.shaderSource(shader, source);
				this.gl.compileShader(shader);
				if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
					console.error(`Shader Error:`, this.gl.getShaderInfoLog(shader));
					return null;
				}
				return shader;
			}
			destroy() {
				this.gl.deleteProgram(this.program);
			}
			use() {
				this.gl.useProgram(this.program);
			}
			getUniformLocation(name) {
				if (!this.locationCache.has(name)) this.locationCache.set(name, this.gl.getUniformLocation(this.program, name));
				return this.locationCache.get(name);
			}
			setMat4(name, matArray) {
				const loc = this.getUniformLocation(name);
				if (loc) this.gl.uniformMatrix4fv(loc, false, matArray);
			}
			setVec4(name, x, y, z, w) {
				const loc = this.getUniformLocation(name);
				if (loc) this.gl.uniform4f(loc, x, y, z, w);
			}
			setVec3(name, x, y, z) {
				const loc = this.getUniformLocation(name);
				if (loc) this.gl.uniform3f(loc, x, y, z);
			}
			setVec2(name, x, y) {
				const loc = this.getUniformLocation(name);
				if (loc) this.gl.uniform2f(loc, x, y);
			}
			setFloat(name, val) {
				const loc = this.getUniformLocation(name);
				if (loc) this.gl.uniform1f(loc, val);
			}
			setInt(name, val) {
				const loc = this.getUniformLocation(name);
				if (loc) this.gl.uniform1i(loc, val);
			}
		};
	}));
	//#endregion
	//#region src/lib/Engine/Framebuffer.js
	var Framebuffer;
	var init_Framebuffer = __esmMin((() => {
		Framebuffer = class {
			constructor(gl) {
				this.gl = gl;
				this.id = gl.createFramebuffer();
				this.width = 0;
				this.height = 0;
				this.activeSlots = [];
			}
			attachTexture(texture, slotPointName) {
				this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.id);
				const point = this.gl[slotPointName];
				this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, point, texture.target, texture.id, 0);
				if (texture.width && texture.height) {
					this.width = texture.width;
					this.height = texture.height;
				}
				if (slotPointName.startsWith("COLOR_ATTACHMENT")) {
					if (!this.activeSlots.includes(point)) {
						this.activeSlots.push(point);
						this.activeSlots.sort((a, b) => a - b);
						this.gl.drawBuffers(this.activeSlots);
					}
				}
				this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
			}
			attachCubeFace(textureCube, faceIndex, slotPointName) {
				this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.id);
				const targetFace = this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + Number(faceIndex);
				const point = this.gl[slotPointName];
				this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, point, targetFace, textureCube.id, 0);
				this.width = textureCube.width;
				this.height = textureCube.height;
				if (slotPointName.startsWith("COLOR_ATTACHMENT")) {
					if (!this.activeSlots.includes(point)) {
						this.activeSlots.push(point);
						this.activeSlots.sort((a, b) => a - b);
						this.gl.drawBuffers(this.activeSlots);
					}
				}
				this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
			}
			attachStencilBuffer(stencilObj) {
				this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.id);
				this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.STENCIL_ATTACHMENT, this.gl.RENDERBUFFER, stencilObj.id);
				this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
			}
			bind(fallbackW, fallbackH) {
				this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.id);
				this.gl.viewport(0, 0, this.width || fallbackW, this.height || fallbackH);
			}
			static bindScreen(gl, canvasW, canvasH) {
				gl.bindFramebuffer(gl.FRAMEBUFFER, null);
				gl.viewport(0, 0, canvasW, canvasH);
			}
			destroy() {
				this.gl.deleteFramebuffer(this.id);
			}
		};
	}));
	//#endregion
	//#region src/lib/Engine/VAO.js
	var VAO;
	var init_VAO = __esmMin((() => {
		VAO = class VAO {
			constructor(gl) {
				this.gl = gl;
				this.id = gl.createVertexArray();
				this.vbos = [];
				this.ebo = null;
				this.hasElements = false;
				this.defaultCount = 0;
				this.elementType = gl.UNSIGNED_SHORT;
			}
			bind() {
				this.gl.bindVertexArray(this.id);
			}
			unbind() {
				this.gl.bindVertexArray(null);
			}
			addBuffer(dataArray, location, size, type = this.gl.FLOAT) {
				this.bind();
				const vbo = this.gl.createBuffer();
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
				this.gl.bufferData(this.gl.ARRAY_BUFFER, dataArray, this.gl.STATIC_DRAW);
				this.gl.enableVertexAttribArray(location);
				this.gl.vertexAttribPointer(location, size, type, false, 0, 0);
				this.vbos.push(vbo);
				if (!this.hasElements && location === 0) this.defaultCount = dataArray.length / size;
				this.unbind();
			}
			setIndices(indicesArray, isUint32 = false) {
				this.bind();
				this.ebo = this.gl.createBuffer();
				this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ebo);
				this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indicesArray, this.gl.STATIC_DRAW);
				this.hasElements = true;
				this.defaultCount = indicesArray.length;
				this.elementType = isUint32 ? this.gl.UNSIGNED_INT : this.gl.UNSIGNED_SHORT;
				this.unbind();
			}
			draw(modeName, count = -1) {
				if (this.defaultCount === 0) return;
				this.bind();
				const drawCount = count <= 0 ? this.defaultCount : count;
				const glMode = this.gl[modeName] || this.gl.TRIANGLES;
				if (this.hasElements) this.gl.drawElements(glMode, drawCount, this.elementType, 0);
				else this.gl.drawArrays(glMode, 0, drawCount);
				this.unbind();
			}
			destroy() {
				this.vbos.forEach((b) => this.gl.deleteBuffer(b));
				if (this.ebo) this.gl.deleteBuffer(this.ebo);
				this.gl.deleteVertexArray(this.id);
			}
			static createScreenQuad(gl) {
				const vao = new VAO(gl);
				vao.addBuffer(new Float32Array([
					-1,
					1,
					0,
					-1,
					-1,
					0,
					1,
					1,
					0,
					1,
					1,
					0,
					-1,
					-1,
					0,
					1,
					-1,
					0
				]), 0, 3);
				vao.addBuffer(new Float32Array([
					0,
					1,
					0,
					0,
					1,
					1,
					1,
					1,
					0,
					0,
					1,
					0
				]), 1, 2);
				vao.defaultCount = 6;
				return vao;
			}
			static createCube(gl) {
				const vao = new VAO(gl);
				const v = [
					-1,
					-1,
					1,
					1,
					-1,
					1,
					1,
					1,
					1,
					-1,
					1,
					1,
					-1,
					-1,
					-1,
					1,
					-1,
					-1,
					1,
					1,
					-1,
					-1,
					1,
					-1
				];
				const i = [
					0,
					1,
					2,
					2,
					3,
					0,
					1,
					5,
					6,
					6,
					2,
					1,
					5,
					4,
					7,
					7,
					6,
					5,
					4,
					0,
					3,
					3,
					7,
					4,
					3,
					2,
					6,
					6,
					7,
					3,
					4,
					5,
					1,
					1,
					0,
					4
				];
				vao.addBuffer(new Float32Array(v), 0, 3);
				vao.setIndices(new Uint16Array(i));
				vao.defaultCount = 36;
				return vao;
			}
			static createSphere(gl, lat = 16, lon = 16) {
				const latBands = Math.max(3, parseInt(lat) || 16);
				const lonBands = Math.max(3, parseInt(lon) || 16);
				const pos = [];
				const indices = [];
				for (let i = 0; i <= latBands; i++) {
					const theta = i * Math.PI / latBands;
					const sinTheta = Math.sin(theta);
					const cosTheta = Math.cos(theta);
					for (let j = 0; j <= lonBands; j++) {
						const phi = j * 2 * Math.PI / lonBands;
						pos.push(Math.cos(phi) * sinTheta, cosTheta, Math.sin(phi) * sinTheta);
					}
				}
				for (let i = 0; i < latBands; i++) for (let j = 0; j < lonBands; j++) {
					const first = i * (lonBands + 1) + j;
					const second = first + lonBands + 1;
					indices.push(first, first + 1, second, second, first + 1, second + 1);
				}
				const vao = new VAO(gl);
				vao.addBuffer(new Float32Array(pos), 0, 3);
				vao.setIndices(new Uint16Array(indices));
				vao.defaultCount = indices.length;
				return vao;
			}
		};
	}));
	//#endregion
	//#region src/lib/Engine/Textures.js
	var Texture, Texture2D, TextureCube;
	var init_Textures = __esmMin((() => {
		Texture = class {
			constructor(gl) {
				this.gl = gl;
				this.id = gl.createTexture();
				this.target = gl.TEXTURE_2D;
				this.width = 0;
				this.height = 0;
			}
			bind(unit = 0) {
				this.gl.activeTexture(this.gl.TEXTURE0 + unit);
				this.gl.bindTexture(this.target, this.id);
			}
			setFilter(minMode, magMode) {
				this.bind();
				this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, this.gl[minMode]);
				this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, this.gl[magMode]);
			}
			setWrap(axis, mode) {
				this.bind();
				const axisMap = {
					"S": this.gl.TEXTURE_WRAP_S,
					"T": this.gl.TEXTURE_WRAP_T,
					"R": this.gl.TEXTURE_WRAP_R
				};
				const modeMap = {
					"REPEAT": this.gl.REPEAT,
					"CLAMP_TO_EDGE": this.gl.CLAMP_TO_EDGE,
					"MIRRORED_REPEAT": this.gl.MIRRORED_REPEAT
				};
				this.gl.texParameteri(this.target, axisMap[axis], modeMap[mode]);
			}
			generateMipmap() {
				this.bind();
				this.gl.generateMipmap(this.target);
			}
			destroy() {
				this.gl.deleteTexture(this.id);
			}
		};
		Texture2D = class extends Texture {
			constructor(gl) {
				super(gl);
				this.target = gl.TEXTURE_2D;
			}
			uploadEmpty(w, h, internalFormat, format, type) {
				this.bind();
				this.gl.texImage2D(this.target, 0, internalFormat, w, h, 0, format, type, null);
				this.width = w;
				this.height = h;
				this.setFilter("LINEAR", "LINEAR");
				this.setWrap("S", "CLAMP_TO_EDGE");
				this.setWrap("T", "CLAMP_TO_EDGE");
			}
			uploadImageBitmap(bitmap) {
				this.bind();
				this.gl.texImage2D(this.target, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, bitmap);
				this.width = bitmap.width;
				this.height = bitmap.height;
				this.setFilter("LINEAR", "LINEAR");
				this.setWrap("S", "REPEAT");
				this.setWrap("T", "REPEAT");
			}
			uploadData(width, height, data, internalFormat = this.gl.RGBA, format = this.gl.RGBA, type = this.gl.UNSIGNED_BYTE) {
				this.bind();
				const gl = this.gl;
				if (width === 1 && height === 1) gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
				gl.texImage2D(this.target, 0, internalFormat, width, height, 0, format, type, data);
				this.width = width;
				this.height = height;
				if (width === 1 && height === 1) gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
				this.setFilter("NEAREST", "NEAREST");
				this.setWrap("S", "CLAMP_TO_EDGE");
				this.setWrap("T", "CLAMP_TO_EDGE");
			}
			uploadHDR(hdr) {
				this.bind();
				const gl = this.gl;
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB16F, hdr.width, hdr.height, 0, gl.RGB, gl.FLOAT, hdr.data);
				this.width = hdr.width;
				this.height = hdr.height;
				this.setFilter("LINEAR", "LINEAR");
				this.setWrap("S", "CLAMP_TO_EDGE");
				this.setWrap("T", "CLAMP_TO_EDGE");
			}
		};
		TextureCube = class extends Texture {
			constructor(gl) {
				super(gl);
				this.target = gl.TEXTURE_CUBE_MAP;
			}
			uploadEmpty(size, internalFormat, format, type) {
				this.bind();
				for (let i = 0; i < 6; i++) this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, internalFormat, size, size, 0, format, type, null);
				this.width = size;
				this.height = size;
				this.setFilter("NEAREST", "NEAREST");
				this.setWrap("S", "CLAMP_TO_EDGE");
				this.setWrap("T", "CLAMP_TO_EDGE");
				this.setWrap("R", "CLAMP_TO_EDGE");
			}
			uploadKTX(ktx) {
				this.bind();
				this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 4);
				ktx.mipmaps.forEach((mip) => {
					this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + mip.face, mip.level, ktx.glInternalFormat, mip.width, mip.height, 0, ktx.glFormat, ktx.glType, mip.data);
				});
				const mipCount = ktx.numberOfMipmapLevels;
				this.gl.texParameteri(this.target, this.gl.TEXTURE_MAX_LEVEL, mipCount - 1);
				this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, mipCount > 1 ? this.gl.LINEAR_MIPMAP_LINEAR : this.gl.LINEAR);
				this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
				this.setWrap("S", "CLAMP_TO_EDGE");
				this.setWrap("T", "CLAMP_TO_EDGE");
				this.setWrap("R", "CLAMP_TO_EDGE");
			}
		};
	}));
	//#endregion
	//#region src/lib/Tools/Math3D.js
	var DEG2RAD, RAD2DEG, Math3D;
	var init_Math3D = __esmMin((() => {
		DEG2RAD = Math.PI / 180;
		RAD2DEG = 180 / Math.PI;
		Math3D = class {
			static vec3_create(x = 0, y = 0, z = 0) {
				return [
					x,
					y,
					z
				];
			}
			static vec3_add(a, b) {
				return [
					a[0] + b[0],
					a[1] + b[1],
					a[2] + b[2]
				];
			}
			static vec3_sub(a, b) {
				return [
					a[0] - b[0],
					a[1] - b[1],
					a[2] - b[2]
				];
			}
			static vec3_mul(a, b) {
				return [
					a[0] * b[0],
					a[1] * b[1],
					a[2] * b[2]
				];
			}
			static vec3_normalize(v) {
				const l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
				return l > 0 ? [
					v[0] / l,
					v[1] / l,
					v[2] / l
				] : [
					0,
					0,
					0
				];
			}
			static vec3_transform(v, m) {
				return [
					v[0] * m[0] + v[1] * m[4] + v[2] * m[8] + m[12],
					v[0] * m[1] + v[1] * m[5] + v[2] * m[9] + m[13],
					v[0] * m[2] + v[1] * m[6] + v[2] * m[10] + m[14]
				];
			}
			static vec3_lerp(a, b, t) {
				return [
					a[0] + (b[0] - a[0]) * t,
					a[1] + (b[1] - a[1]) * t,
					a[2] + (b[2] - a[2]) * t
				];
			}
			static mat4_identity() {
				return [
					1,
					0,
					0,
					0,
					0,
					1,
					0,
					0,
					0,
					0,
					1,
					0,
					0,
					0,
					0,
					1
				];
			}
			static mat4_perspective(fovy, aspect, near, far) {
				const f = Math.tan(Math.PI * .5 - .5 * fovy);
				const rangeInv = 1 / (near - far);
				return [
					f / aspect,
					0,
					0,
					0,
					0,
					f,
					0,
					0,
					0,
					0,
					(near + far) * rangeInv,
					-1,
					0,
					0,
					near * far * rangeInv * 2,
					0
				];
			}
			static mat4_translate(m, tx, ty, tz) {
				const out = [...m];
				out[12] = m[0] * tx + m[4] * ty + m[8] * tz + m[12];
				out[13] = m[1] * tx + m[5] * ty + m[9] * tz + m[13];
				out[14] = m[2] * tx + m[6] * ty + m[10] * tz + m[14];
				out[15] = m[3] * tx + m[7] * ty + m[11] * tz + m[15];
				return out;
			}
			static mat4_scale(m, sx, sy, sz) {
				return [
					(sx || 1) * m[0],
					(sx || 1) * m[1],
					(sx || 1) * m[2],
					(sx || 1) * m[3],
					(sy || 1) * m[4],
					(sy || 1) * m[5],
					(sy || 1) * m[6],
					(sy || 1) * m[7],
					(sz || 1) * m[8],
					(sz || 1) * m[9],
					(sz || 1) * m[10],
					(sz || 1) * m[11],
					m[12],
					m[13],
					m[14],
					m[15]
				];
			}
			static mat4_rotateX(m, rad) {
				const c = Math.cos(rad), s = Math.sin(rad);
				const out = [...m];
				const m4 = m[4], m5 = m[5], m6 = m[6], m7 = m[7];
				const m8 = m[8], m9 = m[9], m10 = m[10], m11 = m[11];
				out[4] = m4 * c + m8 * s;
				out[5] = m5 * c + m9 * s;
				out[6] = m6 * c + m10 * s;
				out[7] = m7 * c + m11 * s;
				out[8] = m8 * c - m4 * s;
				out[9] = m9 * c - m5 * s;
				out[10] = m10 * c - m6 * s;
				out[11] = m11 * c - m7 * s;
				return out;
			}
			static mat4_rotateY(m, rad) {
				const c = Math.cos(rad), s = Math.sin(rad);
				return [
					c * m[0] - s * m[8],
					c * m[1] - s * m[9],
					c * m[2] - s * m[10],
					c * m[3] - s * m[11],
					m[4],
					m[5],
					m[6],
					m[7],
					s * m[0] + c * m[8],
					s * m[1] + c * m[9],
					s * m[2] + c * m[10],
					s * m[3] + c * m[11],
					m[12],
					m[13],
					m[14],
					m[15]
				];
			}
			static mat4_rotateZ(m, rad) {
				const c = Math.cos(rad), s = Math.sin(rad);
				return [
					c * m[0] + s * m[4],
					c * m[1] + s * m[5],
					c * m[2] + s * m[6],
					c * m[3] + s * m[7],
					c * m[4] - s * m[0],
					c * m[5] - s * m[1],
					c * m[6] - s * m[2],
					c * m[7] - s * m[3],
					m[8],
					m[9],
					m[10],
					m[11],
					m[12],
					m[13],
					m[14],
					m[15]
				];
			}
			static mat4_lookAt(eye, target, up) {
				const [ex, ey, ez] = eye, [tx, ty, tz] = target, [ux, uy, uz] = up;
				let zx = ex - tx, zy = ey - ty, zz = ez - tz;
				let len = 1 / (Math.sqrt(zx * zx + zy * zy + zz * zz) || 1);
				zx *= len;
				zy *= len;
				zz *= len;
				let xx = uy * zz - uz * zy, xy = uz * zx - ux * zz, xz = ux * zy - uy * zx;
				len = 1 / (Math.sqrt(xx * xx + xy * xy + xz * xz) || 1);
				xx *= len;
				xy *= len;
				xz *= len;
				let yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
				return [
					xx,
					yx,
					zx,
					0,
					xy,
					yy,
					zy,
					0,
					xz,
					yz,
					zz,
					0,
					-(xx * ex + xy * ey + xz * ez),
					-(yx * ex + yy * ey + yz * ez),
					-(zx * ex + zy * ey + zz * ez),
					1
				];
			}
			static mat4_fromRTS(q, t, s) {
				const [x, y, z, w] = q, [sx, sy, sz] = s, [tx, ty, tz] = t;
				const x2 = x + x, y2 = y + y, z2 = z + z;
				const xx = x * x2, xy = x * y2, xz = x * z2;
				const yy = y * y2, yz = y * z2, zz = z * z2;
				const wx = w * x2, wy = w * y2, wz = w * z2;
				return [
					(1 - (yy + zz)) * sx,
					(xy + wz) * sx,
					(xz - wy) * sx,
					0,
					(xy - wz) * sy,
					(1 - (xx + zz)) * sy,
					(yz + wx) * sy,
					0,
					(xz + wy) * sz,
					(yz - wx) * sz,
					(1 - (xx + yy)) * sz,
					0,
					tx,
					ty,
					tz,
					1
				];
			}
			static mat4_decompose(m) {
				const sx = Math.hypot(m[0], m[1], m[2]);
				const sy = Math.hypot(m[4], m[5], m[6]);
				const sz = Math.hypot(m[8], m[9], m[10]);
				const r = [
					m[0] / sx,
					m[1] / sx,
					m[2] / sx,
					m[4] / sy,
					m[5] / sy,
					m[6] / sy,
					m[8] / sz,
					m[9] / sz,
					m[10] / sz
				];
				const trace = r[0] + r[4] + r[8];
				let q = [
					0,
					0,
					0,
					1
				];
				if (trace > 0) {
					const s = Math.sqrt(trace + 1) * 2;
					q = [
						(r[5] - r[7]) / s,
						(r[6] - r[2]) / s,
						(r[1] - r[3]) / s,
						.25 * s
					];
				} else if (r[0] > r[4] && r[0] > r[8]) {
					const s = Math.sqrt(1 + r[0] - r[4] - r[8]) * 2;
					q = [
						.25 * s,
						(r[1] + r[3]) / s,
						(r[6] + r[2]) / s,
						(r[5] - r[7]) / s
					];
				} else if (r[4] > r[8]) {
					const s = Math.sqrt(1 + r[4] - r[0] - r[8]) * 2;
					q = [
						(r[1] + r[3]) / s,
						.25 * s,
						(r[5] + r[7]) / s,
						(r[6] - r[2]) / s
					];
				} else {
					const s = Math.sqrt(1 + r[8] - r[0] - r[4]) * 2;
					q = [
						(r[6] + r[2]) / s,
						(r[5] + r[7]) / s,
						.25 * s,
						(r[1] - r[3]) / s
					];
				}
				return {
					t: [
						m[12],
						m[13],
						m[14]
					],
					q,
					s: [
						sx,
						sy,
						sz
					]
				};
			}
			static mat4_multiply(a, b) {
				const out = new Array(16);
				const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
				const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
				const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
				const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
				let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
				out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
				out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
				out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
				out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
				b0 = b[4];
				b1 = b[5];
				b2 = b[6];
				b3 = b[7];
				out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
				out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
				out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
				out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
				b0 = b[8];
				b1 = b[9];
				b2 = b[10];
				b3 = b[11];
				out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
				out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
				out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
				out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
				b0 = b[12];
				b1 = b[13];
				b2 = b[14];
				b3 = b[15];
				out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
				out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
				out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
				out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
				return out;
			}
			static mat4_inverse(m) {
				const [m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15] = m;
				const b00 = m0 * m5 - m1 * m4, b01 = m0 * m6 - m2 * m4, b02 = m0 * m7 - m3 * m4;
				const b03 = m1 * m6 - m2 * m5, b04 = m1 * m7 - m3 * m5, b05 = m2 * m7 - m3 * m6;
				const b06 = m8 * m13 - m9 * m12, b07 = m8 * m14 - m10 * m12, b08 = m8 * m15 - m11 * m12;
				const b09 = m9 * m14 - m10 * m13, b10 = m9 * m15 - m11 * m13, b11 = m10 * m15 - m11 * m14;
				const det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
				if (!det) return this.mat4_identity();
				const invDet = 1 / det;
				return [
					(m5 * b11 - m6 * b10 + m7 * b09) * invDet,
					(m2 * b10 - m1 * b11 - m3 * b09) * invDet,
					(m13 * b05 - m14 * b04 + m15 * b03) * invDet,
					(m10 * b04 - m9 * b05 - m11 * b03) * invDet,
					(m6 * b08 - m4 * b11 - m7 * b07) * invDet,
					(m0 * b11 - m2 * b08 + m3 * b07) * invDet,
					(m14 * b02 - m12 * b05 - m15 * b01) * invDet,
					(m8 * b05 - m10 * b02 + m11 * b01) * invDet,
					(m4 * b10 - m5 * b08 + m7 * b06) * invDet,
					(m1 * b08 - m0 * b10 - m3 * b06) * invDet,
					(m12 * b04 - m13 * b02 + m15 * b00) * invDet,
					(m9 * b02 - m8 * b04 - m11 * b00) * invDet,
					(m5 * b07 - m4 * b09 - m6 * b06) * invDet,
					(m0 * b09 - m1 * b07 + m2 * b06) * invDet,
					(m13 * b01 - m12 * b03 - m14 * b00) * invDet,
					(m8 * b03 - m9 * b01 + m10 * b00) * invDet
				];
			}
			static v3_add(a, b) {
				return this.vec3_add(a, b);
			}
			static v3_sub(a, b) {
				return this.vec3_sub(a, b);
			}
			static v3_mul(a, b) {
				return this.vec3_mul(a, b);
			}
			static v3_normalize(v) {
				return this.vec3_normalize(v);
			}
			static v3_transform(v, m) {
				return this.vec3_transform(v, m);
			}
			static TRS_create(px, py, pz, rx, ry, rz, sx, sy, sz) {
				return JSON.stringify([
					Number(px),
					Number(py),
					Number(pz),
					Number(rx),
					Number(ry),
					Number(rz),
					Number(sx),
					Number(sy),
					Number(sz)
				]);
			}
			static TRS_decompose(trsString, type, axis) {
				const d = JSON.parse(trsString);
				if (!Array.isArray(d)) return 0;
				return d[({
					"Pos": 0,
					"Rot": 3,
					"Scale": 6
				}[type] ?? 0) + ({
					"X": 0,
					"Y": 1,
					"Z": 2
				}[axis] ?? 0)] ?? 0;
			}
			static TRS_add(trsA, trsB) {
				const a = this.TRS_parse(trsA);
				const b = this.TRS_parse(trsB);
				if (!a || !b) return trsA;
				const newPos = this.vec3_add(a.position, b.position);
				const qA = this.quat_fromEuler(...a.euler);
				const qB = this.quat_fromEuler(...b.euler);
				const newQuat = this.quat_multiply(qB, qA);
				const newEuler = this.quat_toEuler(newQuat);
				const newScale = [
					a.scale[0] * b.scale[0],
					a.scale[1] * b.scale[1],
					a.scale[2] * b.scale[2]
				];
				return this.TRS_create(newPos[0], newPos[1], newPos[2], newEuler[0], newEuler[1], newEuler[2], newScale[0], newScale[1], newScale[2]);
			}
			static TRS_lerp(trsStart, trsEnd, t) {
				const s = this.TRS_parse(trsStart);
				const e = this.TRS_parse(trsEnd);
				if (!s || !e) return trsStart;
				const p = [
					s.position[0] + (e.position[0] - s.position[0]) * t,
					s.position[1] + (e.position[1] - s.position[1]) * t,
					s.position[2] + (e.position[2] - s.position[2]) * t
				];
				const qS = this.quat_fromEuler(...s.euler);
				const qE = this.quat_fromEuler(...e.euler);
				const qResult = this.quat_slerp(qS, qE, t);
				const r = this.quat_toEuler(qResult);
				const sc = [
					s.scale[0] + (e.scale[0] - s.scale[0]) * t,
					s.scale[1] + (e.scale[1] - s.scale[1]) * t,
					s.scale[2] + (e.scale[2] - s.scale[2]) * t
				];
				return this.TRS_create(p[0], p[1], p[2], r[0], r[1], r[2], sc[0], sc[1], sc[2]);
			}
			static TRS_parse(trsString) {
				try {
					const d = JSON.parse(trsString);
					if (!Array.isArray(d) || d.length < 9) return null;
					return {
						position: [
							d[0],
							d[1],
							d[2]
						],
						euler: [
							d[3],
							d[4],
							d[5]
						],
						scale: [
							d[6],
							d[7],
							d[8]
						]
					};
				} catch (e) {
					return null;
				}
			}
			static quat_identity() {
				return [
					0,
					0,
					0,
					1
				];
			}
			static quat_fromEuler(x, y, z) {
				const ax = x * DEG2RAD * .5, ay = y * DEG2RAD * .5, az = z * DEG2RAD * .5;
				const sx = Math.sin(ax), cx = Math.cos(ax);
				const sy = Math.sin(ay), cy = Math.cos(ay);
				const sz = Math.sin(az), cz = Math.cos(az);
				return [
					sx * cy * cz + cx * sy * sz,
					cx * sy * cz - sx * cy * sz,
					cx * cy * sz - sx * sy * cz,
					cx * cy * cz + sx * sy * sz
				];
			}
			static quat_toEuler(q) {
				const [x, y, z, w] = q;
				const sinp = 2 * (w * x - y * z);
				let ex, ey, ez;
				if (Math.abs(sinp) >= 1) ex = Math.PI / 2 * Math.sign(sinp);
				else ex = Math.asin(sinp);
				ey = Math.atan2(2 * (w * y + z * x), 1 - 2 * (x * x + y * y));
				ez = Math.atan2(2 * (w * z + x * y), 1 - 2 * (x * x + z * z));
				return [
					ex * RAD2DEG,
					ey * RAD2DEG,
					ez * RAD2DEG
				];
			}
			static quat_multiply(a, b) {
				const [ax, ay, az, aw] = a, [bx, by, bz, bw] = b;
				return [
					ax * bw + aw * bx + ay * bz - az * by,
					ay * bw + aw * by + az * bx - ax * bz,
					az * bw + aw * bz + ax * by - ay * bx,
					aw * bw - ax * bx - ay * by - az * bz
				];
			}
			static quat_slerp(a, b, t) {
				let ax = a[0], ay = a[1], az = a[2], aw = a[3];
				let bx = b[0], by = b[1], bz = b[2], bw = b[3];
				let cosHalfTheta = ax * bx + ay * by + az * bz + aw * bw;
				if (cosHalfTheta < 0) {
					bx = -bx;
					by = -by;
					bz = -bz;
					bw = -bw;
					cosHalfTheta = -cosHalfTheta;
				}
				if (Math.abs(cosHalfTheta) >= 1) return [
					ax,
					ay,
					az,
					aw
				];
				const halfTheta = Math.acos(cosHalfTheta);
				const sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);
				if (Math.abs(sinHalfTheta) < .001) return [
					ax * .5 + bx * .5,
					ay * .5 + by * .5,
					az * .5 + bz * .5,
					aw * .5 + bw * .5
				];
				const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
				const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
				return [
					ax * ratioA + bx * ratioB,
					ay * ratioA + by * ratioB,
					az * ratioA + bz * ratioB,
					aw * ratioA + bw * ratioB
				];
			}
		};
	}));
	//#endregion
	//#region src/lib/Scene/Model/Mesh.js
	var Material, Mesh;
	var init_Mesh = __esmMin((() => {
		Material = class {
			constructor() {
				this.albedoTex = null;
				this.normalTex = null;
				this.ormTex = null;
				this.emissiveTex = null;
				this.baseColor = [
					1,
					1,
					1,
					1
				];
				this.roughness = 1;
				this.metalness = 1;
				this.hasUV2 = false;
			}
		};
		Mesh = class {
			constructor(name, vao) {
				this.name = name;
				this.vao = vao;
				this.material = new Material();
				this.isSkinned = false;
				this.skeleton = null;
			}
			destroy() {
				if (this.vao) this.vao.destroy();
				this.skeleton = null;
			}
		};
	}));
	//#endregion
	//#region node_modules/gltf-loader-ts/lib/gltf-loader.js
	var require_gltf_loader = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = function(e) {
			var t = {};
			function r(i) {
				if (t[i]) return t[i].exports;
				var s = t[i] = {
					i,
					l: !1,
					exports: {}
				};
				return e[i].call(s.exports, s, s.exports, r), s.l = !0, s.exports;
			}
			return r.m = e, r.c = t, r.d = function(e, t, i) {
				r.o(e, t) || Object.defineProperty(e, t, {
					enumerable: !0,
					get: i
				});
			}, r.r = function(e) {
				"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });
			}, r.t = function(e, t) {
				if (1 & t && (e = r(e)), 8 & t) return e;
				if (4 & t && "object" == typeof e && e && e.__esModule) return e;
				var i = Object.create(null);
				if (r.r(i), Object.defineProperty(i, "default", {
					enumerable: !0,
					value: e
				}), 2 & t && "string" != typeof e) for (var s in e) r.d(i, s, function(t) {
					return e[t];
				}.bind(null, s));
				return i;
			}, r.n = function(e) {
				var t = e && e.__esModule ? function() {
					return e.default;
				} : function() {
					return e;
				};
				return r.d(t, "a", t), t;
			}, r.o = function(e, t) {
				return Object.prototype.hasOwnProperty.call(e, t);
			}, r.p = "", r(r.s = 7);
		}([
			function(e, t, r) {
				"use strict";
				Object.defineProperty(t, "__esModule", { value: !0 });
				t.LoadingManager = class {
					constructor() {
						this.urlModifier = void 0, this.onStart = void 0, this.onProgress = void 0, this.onLoad = void 0, this.onError = void 0, this.isLoading = !1, this.itemsLoaded = 0, this.itemsTotal = 0;
					}
					itemStart(e) {
						this.itemsTotal++, !this.isLoading && this.onStart && this.onStart(e, this.itemsLoaded, this.itemsTotal), this.isLoading = !0;
					}
					itemEnd(e) {
						this.itemsLoaded++, this.onProgress && this.onProgress(e, this.itemsLoaded, this.itemsTotal), this.itemsLoaded === this.itemsTotal && (this.isLoading = !1, this.onLoad && this.onLoad());
					}
					itemError(e) {
						this.onError && this.onError(e);
					}
					resolveURL(e) {
						return this.urlModifier ? this.urlModifier(e) : e;
					}
				};
			},
			function(e, t, r) {
				"use strict";
				var i = this && this.__awaiter || function(e, t, r, i) {
					return new (r || (r = Promise))(function(s, n) {
						function o(e) {
							try {
								u(i.next(e));
							} catch (e) {
								n(e);
							}
						}
						function a(e) {
							try {
								u(i.throw(e));
							} catch (e) {
								n(e);
							}
						}
						function u(e) {
							e.done ? s(e.value) : new r(function(t) {
								t(e.value);
							}).then(o, a);
						}
						u((i = i.apply(e, t || [])).next());
					});
				};
				Object.defineProperty(t, "__esModule", { value: !0 });
				const s = r(3), n = r(0);
				t.GLTF_COMPONENT_TYPE_ARRAYS = {
					5120: Int8Array,
					5121: Uint8Array,
					5122: Int16Array,
					5123: Uint16Array,
					5125: Uint32Array,
					5126: Float32Array
				}, t.GLTF_ELEMENTS_PER_TYPE = {
					SCALAR: 1,
					VEC2: 2,
					VEC3: 3,
					VEC4: 4,
					MAT2: 4,
					MAT3: 9,
					MAT4: 16
				};
				t.GltfAsset = class {
					constructor(e, t, r, i = new n.LoadingManager()) {
						this.gltf = e, this.glbData = r, this.bufferData = new o(this, t, i), this.imageData = new a(this, t, i);
					}
					bufferViewData(e) {
						return i(this, void 0, void 0, function* () {
							if (!this.gltf.bufferViews) throw new Error("No buffer views found.");
							const t = this.gltf.bufferViews[e], r = yield this.bufferData.get(t.buffer), i = t.byteLength || 0, s = t.byteOffset || 0, n = r.buffer, o = r.byteOffset;
							return new Uint8Array(n, o + s, i);
						});
					}
					accessorData(e) {
						return i(this, void 0, void 0, function* () {
							if (!this.gltf.accessors) throw new Error("No accessors views found.");
							const r = this.gltf.accessors[e], i = t.GLTF_ELEMENTS_PER_TYPE[r.type];
							let s;
							if (void 0 !== r.bufferView) s = yield this.bufferViewData(r.bufferView);
							else {
								const e = t.GLTF_COMPONENT_TYPE_ARRAYS[r.componentType].BYTES_PER_ELEMENT * i * r.count;
								s = new Uint8Array(e);
							}
							if (r.sparse) {
								const { count: e, indices: n, values: o } = r.sparse;
								let a = t.GLTF_COMPONENT_TYPE_ARRAYS[n.componentType], u = yield this.bufferViewData(n.bufferView);
								const f = new a(u.buffer, u.byteOffset + (n.byteOffset || 0), e);
								a = t.GLTF_COMPONENT_TYPE_ARRAYS[r.componentType], u = yield this.bufferViewData(o.bufferView);
								const c = new a((yield this.bufferViewData(o.bufferView)).buffer, u.byteOffset + (o.byteOffset || 0), e * i);
								r.bufferView && (s = new Uint8Array(s));
								const h = new t.GLTF_COMPONENT_TYPE_ARRAYS[r.componentType](s.buffer);
								for (let t = 0; t < e; t++) for (let e = 0; e < i; e++) h[i * f[t] + e] = c[i * t + e];
							}
							return s;
						});
					}
					preFetchAll() {
						return i(this, void 0, void 0, function* () {
							return Promise.all([this.bufferData.preFetchAll(), this.imageData.preFetchAll()]);
						});
					}
				};
				class o {
					constructor(e, t, r) {
						this.bufferCache = [], this.asset = e, this.baseUri = t, this.manager = r, this.loader = new s.FileLoader(r), this.loader.responseType = "arraybuffer";
					}
					get(e) {
						return i(this, void 0, void 0, function* () {
							if (void 0 !== this.bufferCache[e]) return this.bufferCache[e];
							const t = this.asset.gltf;
							if (!t.buffers) throw new Error("No buffers found.");
							const r = t.buffers[e];
							if (void 0 === r.uri) {
								if (0 !== e) throw new Error("GLB container is required to be the first buffer");
								if (void 0 === this.asset.glbData) throw new Error("invalid gltf: buffer has no uri nor is there a GLB buffer");
								return this.asset.glbData.binaryChunk;
							}
							const i = u(r.uri, this.baseUri), s = yield this.loader.load(i), n = new Uint8Array(s);
							return this.bufferCache[e] = n, n;
						});
					}
					preFetchAll() {
						return i(this, void 0, void 0, function* () {
							const e = this.asset.gltf.buffers;
							return e ? Promise.all(e.map((e, t) => this.get(t))) : [];
						});
					}
				}
				t.BufferData = o;
				class a {
					constructor(e, t, r) {
						this.crossOrigin = "anonymous", this.imageCache = [], this.asset = e, this.baseUri = t, this.manager = r;
					}
					get(e) {
						return i(this, void 0, void 0, function* () {
							if (void 0 !== this.imageCache[e]) return this.imageCache[e];
							const t = this.asset.gltf;
							if (!t.images) throw new Error("No images found.");
							const r = t.images[e];
							let i, s = !1;
							if (void 0 !== r.bufferView) {
								const e = yield this.asset.bufferViewData(r.bufferView);
								s = !0;
								const t = new Blob([e], { type: r.mimeType });
								i = URL.createObjectURL(t);
							} else {
								if (void 0 === r.uri) throw new Error("Invalid glTF: image must either have a `uri` or a `bufferView`");
								i = this.manager.resolveURL(u(r.uri, this.baseUri));
							}
							const n = new Image();
							return n.crossOrigin = this.crossOrigin, new Promise((t, r) => {
								n.onerror = (() => {
									r(`Failed to load ${i}`), this.manager.itemEnd(i), this.manager.itemError(i);
								}), n.onload = (() => {
									s && URL.revokeObjectURL(i), this.imageCache[e] = n, t(n), this.manager.itemEnd(i);
								}), n.src = i, this.manager.itemStart(i);
							});
						});
					}
					preFetchAll() {
						return i(this, void 0, void 0, function* () {
							const e = this.asset.gltf.images;
							return e ? Promise.all(e.map((e, t) => this.get(t))) : [];
						});
					}
				}
				function u(e, t) {
					return "string" != typeof e || "" === e ? "" : /^(https?:)?\/\//i.test(e) ? e : /^data:.*,.*$/i.test(e) ? e : /^blob:.*$/i.test(e) ? e : t + e;
				}
				t.ImageData = a, t.resolveURL = u;
			},
			function(e, t, r) {
				"use strict";
				Object.defineProperty(t, "__esModule", { value: !0 });
				t.LoaderUtils = class {
					static decodeText(e) {
						if ("undefined" != typeof TextDecoder) return new TextDecoder().decode(e);
						let t = "";
						for (const r of e) t += String.fromCharCode(r);
						return decodeURIComponent(escape(t));
					}
					static extractUrlBase(e) {
						const t = e.split("/");
						return 1 === t.length ? "./" : (t.pop(), t.join("/") + "/");
					}
				};
			},
			function(e, t, r) {
				"use strict";
				Object.defineProperty(t, "__esModule", { value: !0 });
				t.FileLoader = class {
					constructor(e) {
						this.runningRequests = {}, this.manager = e;
					}
					load(e, t) {
						if (void 0 !== this.path && (e = this.path + e), e = this.manager.resolveURL(e), this.runningRequests[e]) return this.runningRequests[e];
						const r = new Promise((r, i) => {
							const s = new XMLHttpRequest();
							s.open("GET", e, !0);
							const n = this;
							s.onload = function(t) {
								const o = this.response;
								0 === this.status ? (console.warn("FileLoader: HTTP Status 0 received."), r(o), n.manager.itemEnd(e)) : 200 === this.status ? (r(o), n.manager.itemEnd(e)) : (i({
									url: e,
									status: this.status,
									statusText: s.statusText
								}), n.manager.itemEnd(e), n.manager.itemError(e)), delete n.runningRequests[e];
							}, s.onprogress = ((e) => {
								t && t(e);
							}), s.onerror = function(t) {
								i({
									url: e,
									status: this.status,
									statusText: s.statusText
								}), n.manager.itemEnd(e), n.manager.itemError(e), delete n.runningRequests[e];
							}, this.responseType && (s.responseType = this.responseType), this.withCredentials && (s.withCredentials = this.withCredentials), this.mimeType && s.overrideMimeType && s.overrideMimeType(void 0 !== this.mimeType ? this.mimeType : "text/plain");
							for (const e in this.requestHeaders) s.setRequestHeader(e, this.requestHeaders[e]);
							s.send(null), this.manager.itemStart(e);
						});
						return this.runningRequests[e] = r, r;
					}
					setRequestHeader(e, t) {
						return this.requestHeaders[e] = t, this;
					}
				};
			},
			function(e, t, r) {
				"use strict";
				Object.defineProperty(t, "__esModule", { value: !0 });
			},
			function(e, t, r) {
				"use strict";
				Object.defineProperty(t, "__esModule", { value: !0 });
				const i = r(2);
				t.BINARY_HEADER_MAGIC = "glTF";
				const s = 12, n = {
					JSON: 1313821514,
					BIN: 5130562
				};
				t.GLTFBinaryData = class {
					constructor(e) {
						const r = new DataView(e, 0, s), o = i.LoaderUtils.decodeText(new Uint8Array(e, 0, 4)), a = r.getUint32(4, !0);
						if (r.getUint32(8, !0), o !== t.BINARY_HEADER_MAGIC) throw new Error("Unsupported glTF-Binary header.");
						if (a < 2) throw new Error("Unsupported legacy binary file detected.");
						const u = new DataView(e, s);
						let f = 0;
						for (; f < u.byteLength;) {
							const t = u.getUint32(f, !0);
							f += 4;
							const r = u.getUint32(f, !0);
							if (f += 4, r === n.JSON) {
								const r = new Uint8Array(e, s + f, t);
								this.json = i.LoaderUtils.decodeText(r);
							} else if (r === n.BIN) {
								const r = s + f;
								this.binaryChunk = new Uint8Array(e, r, t);
							}
							f += t;
						}
						if (null === this.json) throw new Error("glTF-Binary: JSON content not found.");
					}
				};
			},
			function(e, t, r) {
				"use strict";
				var i = this && this.__awaiter || function(e, t, r, i) {
					return new (r || (r = Promise))(function(s, n) {
						function o(e) {
							try {
								u(i.next(e));
							} catch (e) {
								n(e);
							}
						}
						function a(e) {
							try {
								u(i.throw(e));
							} catch (e) {
								n(e);
							}
						}
						function u(e) {
							e.done ? s(e.value) : new r(function(t) {
								t(e.value);
							}).then(o, a);
						}
						u((i = i.apply(e, t || [])).next());
					});
				};
				function s(e) {
					for (var r in e) t.hasOwnProperty(r) || (t[r] = e[r]);
				}
				Object.defineProperty(t, "__esModule", { value: !0 });
				const n = r(3), o = r(5), a = r(1), u = r(2), f = r(0);
				t.gltf = r(4), s(r(1)), s(r(0));
				t.GltfLoader = class {
					constructor(e) {
						this.manager = e || new f.LoadingManager();
					}
					load(e, t) {
						return i(this, void 0, void 0, function* () {
							const r = u.LoaderUtils.extractUrlBase(e), i = new n.FileLoader(this.manager);
							i.responseType = "arraybuffer";
							const s = yield i.load(e, t);
							return yield this.parse(s, r);
						});
					}
					loadFromFiles(e) {
						return i(this, void 0, void 0, function* () {
							let t, r;
							for (const [i, s] of e) s.name.match(/\.(gltf|glb)$/) && (t = s, r = i.replace(s.name, ""));
							if (!t) throw new Error("No .gltf or .glb asset found.");
							const i = "string" == typeof t ? t : URL.createObjectURL(t), s = u.LoaderUtils.extractUrlBase(i), n = [];
							this.manager.urlModifier = ((t) => {
								const i = r + t.replace(s, "").replace(/^(\.?\/)/, "");
								if (e.has(i)) {
									const t = e.get(i), r = URL.createObjectURL(t);
									return n.push(r), r;
								}
								return t;
							});
							const o = yield this.load(i);
							return yield o.preFetchAll(), URL.revokeObjectURL(i), n.forEach(URL.revokeObjectURL), o;
						});
					}
					parse(e, t) {
						return i(this, void 0, void 0, function* () {
							let r, i = void 0;
							r = "string" == typeof e ? e : u.LoaderUtils.decodeText(new Uint8Array(e, 0, 4)) === o.BINARY_HEADER_MAGIC ? (i = new o.GLTFBinaryData(e)).json : u.LoaderUtils.decodeText(new Uint8Array(e));
							const s = JSON.parse(r);
							if (void 0 === s.asset || s.asset.version[0] < 2) throw new Error("Unsupported asset. glTF versions >=2.0 are supported.");
							return new a.GltfAsset(s, t, i, this.manager);
						});
					}
				};
			},
			function(e, t, r) {
				e.exports = r(6);
			}
		]);
	}));
	//#endregion
	//#region src/lib/Loader/Loader.js
	var Loader_exports = /* @__PURE__ */ __exportAll({ Loader: () => Loader });
	var import_gltf_loader, Loader;
	var init_Loader = __esmMin((() => {
		import_gltf_loader = require_gltf_loader();
		init_lib();
		Loader = class {
			constructor(gl) {
				this.gl = gl;
				this.gltfLoader = new import_gltf_loader.GltfLoader();
			}
			async loadGLB(url, targetScene, modelID) {
				try {
					const asset = await this.gltfLoader.load(url);
					await asset.preFetchAll();
					const meshNodesList = [];
					const vaoLibrary = /* @__PURE__ */ new Map();
					const textureCache = /* @__PURE__ */ new Map();
					const sourceID = `MODEL_${modelID}`;
					const valueTextureCache = /* @__PURE__ */ new Map();
					const getOrCreateValueTexture = (key, r, g, b, a = 255) => {
						if (valueTextureCache.has(key)) return valueTextureCache.get(key);
						const tex = new Texture2D(this.gl);
						tex.uploadData(1, 1, new Uint8Array([
							r,
							g,
							b,
							a
						]));
						valueTextureCache.set(key, tex);
						return tex;
					};
					if (asset.gltf.textures) for (let i = 0; i < asset.gltf.textures.length; i++) {
						const resId = `${sourceID}:TEX:${i}`;
						const tex = await targetScene.getOrCreateTexture(resId, async () => {
							const texDef = asset.gltf.textures[i];
							if (!texDef) return null;
							let imgIdx = texDef.source;
							if (imgIdx === void 0 && texDef.extensions) {
								for (const k in texDef.extensions) if (texDef.extensions[k].source !== void 0) {
									imgIdx = texDef.extensions[k].source;
									break;
								}
							}
							if (imgIdx === void 0) return null;
							const rawImg = await asset.imageData.get(imgIdx);
							const img = rawImg && rawImg.image ? rawImg.image : rawImg;
							if (!img || img.width === 0) return null;
							const t = new Texture2D(this.gl);
							t.uploadImageBitmap(img);
							t.generateMipmap();
							t.setFilter("LINEAR_MIPMAP_LINEAR", "LINEAR");
							return t;
						});
						textureCache.set(i, tex);
					}
					if (asset.gltf.meshes) for (let mIdx = 0; mIdx < asset.gltf.meshes.length; mIdx++) {
						const gltfMesh = asset.gltf.meshes[mIdx];
						const meshInstances = [];
						for (let pIdx = 0; pIdx < gltfMesh.primitives.length; pIdx++) {
							const prim = gltfMesh.primitives[pIdx];
							const posIdx = prim.attributes.POSITION;
							const vaoResId = `${sourceID}:ACC:${posIdx}`;
							const vao = await targetScene.getOrCreateVAO(vaoResId, async () => {
								const v = new VAO(this.gl);
								if (posIdx !== void 0) {
									const raw = await asset.accessorData(posIdx);
									v.addBuffer(new Float32Array(raw.buffer, raw.byteOffset, raw.byteLength / 4).slice(), 0, 3);
								}
								const normIdx = prim.attributes.NORMAL;
								if (normIdx !== void 0) {
									const raw = await asset.accessorData(normIdx);
									v.addBuffer(new Float32Array(raw.buffer, raw.byteOffset, raw.byteLength / 4).slice(), 1, 3);
								}
								const uvIdx = prim.attributes.TEXCOORD_0;
								if (uvIdx !== void 0) {
									const raw = await asset.accessorData(uvIdx);
									v.addBuffer(new Float32Array(raw.buffer, raw.byteOffset, raw.byteLength / 4).slice(), 2, 2);
								}
								const uv2Idx = prim.attributes.TEXCOORD_1;
								if (uv2Idx !== void 0) {
									const raw = await asset.accessorData(uv2Idx);
									v.addBuffer(new Float32Array(raw.buffer, raw.byteOffset, raw.byteLength / 4).slice(), 3, 2);
								}
								const jIdx = prim.attributes.JOINTS_0;
								if (jIdx !== void 0) {
									const raw = await asset.accessorData(jIdx);
									const accessor = asset.gltf.accessors[jIdx];
									let jointsData;
									switch (accessor.componentType) {
										case 5121:
											jointsData = new Uint8Array(raw.buffer, raw.byteOffset, raw.byteLength);
											break;
										case 5123:
											jointsData = new Uint16Array(raw.buffer, raw.byteOffset, raw.byteLength / 2);
											break;
										default:
											console.error(`Vapor3D: Unsupported joint component type: ${accessor.componentType}`);
											jointsData = new Uint8Array(0);
											break;
									}
									const jointsFloat = new Float32Array(jointsData);
									v.addBuffer(jointsFloat, 4, 4);
								}
								const wIdx = prim.attributes.WEIGHTS_0;
								if (wIdx !== void 0) {
									const raw = await asset.accessorData(wIdx);
									const accessor = asset.gltf.accessors[wIdx];
									let weightsFloat;
									if (accessor.componentType === 5126) weightsFloat = new Float32Array(raw.buffer, raw.byteOffset, raw.byteLength / 4).slice();
									else if (accessor.componentType === 5121) {
										const arr = new Uint8Array(raw.buffer, raw.byteOffset, raw.byteLength);
										weightsFloat = new Float32Array(arr.length);
										for (let i = 0; i < arr.length; i++) weightsFloat[i] = arr[i] / 255;
									} else if (accessor.componentType === 5123) {
										const arr = new Uint16Array(raw.buffer, raw.byteOffset, raw.byteLength / 2);
										weightsFloat = new Float32Array(arr.length);
										for (let i = 0; i < arr.length; i++) weightsFloat[i] = arr[i] / 65535;
									} else {
										console.error(`Vapor3D: Unsupported weights component type: ${accessor.componentType}`);
										weightsFloat = new Float32Array(0);
									}
									for (let i = 0; i < weightsFloat.length; i += 4) {
										let sum = weightsFloat[i] + weightsFloat[i + 1] + weightsFloat[i + 2] + weightsFloat[i + 3];
										if (sum > 1e-4) {
											weightsFloat[i] /= sum;
											weightsFloat[i + 1] /= sum;
											weightsFloat[i + 2] /= sum;
											weightsFloat[i + 3] /= sum;
										} else {
											weightsFloat[i] = 1;
											weightsFloat[i + 1] = 0;
											weightsFloat[i + 2] = 0;
											weightsFloat[i + 3] = 0;
										}
									}
									v.addBuffer(weightsFloat, 5, 4);
								}
								if (prim.indices !== void 0) {
									const raw = await asset.accessorData(prim.indices);
									const is32 = asset.gltf.accessors[prim.indices].componentType === 5125;
									const arr = is32 ? new Uint32Array(raw.buffer, raw.byteOffset, raw.byteLength / 4).slice() : new Uint16Array(raw.buffer, raw.byteOffset, raw.byteLength / 2).slice();
									v.setIndices(arr, is32);
								} else v.defaultCount = v.vbos.length > 0 ? (await asset.accessorData(posIdx)).byteLength / 12 : 0;
								return v;
							});
							const meshInstance = new Mesh(gltfMesh.name || `m${mIdx}_p${pIdx}`, vao);
							meshInstance.material.hasUV2 = prim.attributes.TEXCOORD_1 !== void 0;
							const mat = meshInstance.material;
							const matIdx = prim.material;
							if (matIdx !== void 0 && asset.gltf.materials && asset.gltf.materials[matIdx]) {
								const matData = asset.gltf.materials[matIdx];
								let baseColor = matData.pbrMetallicRoughness?.baseColorFactor || [
									1,
									1,
									1,
									1
								];
								let roughness = matData.pbrMetallicRoughness?.roughnessFactor !== void 0 ? matData.pbrMetallicRoughness.roughnessFactor : 1;
								let metallic = matData.pbrMetallicRoughness?.metallicFactor !== void 0 ? matData.pbrMetallicRoughness.metallicFactor : 1;
								mat.baseColor = baseColor;
								if (matData.pbrMetallicRoughness?.baseColorTexture) mat.albedoTex = textureCache.get(matData.pbrMetallicRoughness.baseColorTexture.index);
								else {
									const r = Math.round(baseColor[0] * 255);
									const g = Math.round(baseColor[1] * 255);
									const b = Math.round(baseColor[2] * 255);
									const a = Math.round(baseColor[3] * 255);
									mat.albedoTex = getOrCreateValueTexture(`col_${r}_${g}_${b}_${a}`, r, g, b, a);
								}
								if (matData.pbrMetallicRoughness?.metallicRoughnessTexture) mat.ormTex = textureCache.get(matData.pbrMetallicRoughness.metallicRoughnessTexture.index);
								else if (!mat.ormTex && matData.occlusionTexture) mat.ormTex = textureCache.get(matData.occlusionTexture.index);
								else {
									const r = 255;
									const g = Math.round(roughness * 255);
									const b = Math.round(metallic * 255);
									mat.ormTex = getOrCreateValueTexture(`orm_${g}_${b}`, r, g, b);
								}
								if (matData.normalTexture && matData.normalTexture.index !== void 0) mat.normalTex = textureCache.get(matData.normalTexture.index);
								else mat.normalTex = getOrCreateValueTexture("default_normal", 128, 128, 255);
								if (matData.emissiveTexture && matData.emissiveTexture.index !== void 0) mat.emissiveTex = textureCache.get(matData.emissiveTexture.index);
								else mat.emissiveTex = getOrCreateValueTexture("default_emissive", 0, 0, 0);
							} else {
								mat.baseColor = [
									1,
									1,
									1,
									1
								];
								mat.albedoTex = getOrCreateValueTexture("default_white", 255, 255, 255);
								mat.ormTex = getOrCreateValueTexture("default_orm", 255, 255, 0);
								mat.normalTex = getOrCreateValueTexture("default_normal", 128, 128, 255);
								mat.emissiveTex = getOrCreateValueTexture("default_emissive", 0, 0, 0);
							}
							meshInstances.push(meshInstance);
						}
						vaoLibrary.set(mIdx, meshInstances);
					}
					const vNodes = asset.gltf.nodes.map((n, i) => {
						const vNode = new TransformNode(n.name || `${modelID}_n${i}`);
						if (n.matrix) {
							const { t, q, s } = Math3D.mat4_decompose(n.matrix);
							vNode.position = t;
							vNode.quaternion = q;
							vNode.scale = s;
						} else {
							vNode.position = n.translation ? [...n.translation] : [
								0,
								0,
								0
							];
							vNode.quaternion = n.rotation ? [...n.rotation] : [
								0,
								0,
								0,
								1
							];
							vNode.scale = n.scale ? [...n.scale] : [
								1,
								1,
								1
							];
						}
						return vNode;
					});
					const skeletons = [];
					if (asset.gltf.skins) for (let sDef of asset.gltf.skins) {
						const jointNodes = sDef.joints.map((idx) => vNodes[idx]);
						let ibms = null;
						if (sDef.inverseBindMatrices !== void 0) {
							const rawIbm = await asset.accessorData(sDef.inverseBindMatrices);
							ibms = new Float32Array(rawIbm.buffer, rawIbm.byteOffset, rawIbm.byteLength / 4).slice();
						}
						const skel = new Skeleton(this.gl, `${modelID}_skel`, jointNodes, ibms);
						skeletons.push(skel);
					}
					asset.gltf.nodes.forEach((nDef, i) => {
						const vNode = vNodes[i];
						if (nDef.children) nDef.children.forEach((cIdx) => vNode.addChild(vNodes[cIdx]));
						if (nDef.mesh !== void 0) {
							const meshInsts = vaoLibrary.get(nDef.mesh);
							if (meshInsts) meshInsts.forEach((mInst, pIdx) => {
								const meshNode = new MeshNode(`${vNode.name}_p${pIdx}`, mInst.vao);
								meshNode.material = mInst.material;
								if (nDef.skin !== void 0) {
									meshNode.skeleton = skeletons[nDef.skin];
									meshNode.isSkinned = true;
								}
								vNode.addChild(meshNode);
								meshNodesList.push(meshNode);
							});
						}
					});
					const animations = /* @__PURE__ */ new Map();
					if (asset.gltf.animations) for (const animDef of asset.gltf.animations) {
						const samplers = [];
						for (const samplerDef of animDef.samplers) {
							const inputData = await asset.accessorData(samplerDef.input);
							const outputData = await asset.accessorData(samplerDef.output);
							samplers.push({
								input: new Float32Array(inputData.buffer, inputData.byteOffset, inputData.byteLength / 4).slice(),
								output: new Float32Array(outputData.buffer, outputData.byteOffset, outputData.byteLength / 4).slice(),
								interpolation: samplerDef.interpolation || "LINEAR"
							});
						}
						const channels = animDef.channels.map((channelDef) => {
							return {
								sampler: channelDef.sampler,
								targetNode: vNodes[channelDef.target.node],
								path: channelDef.target.path
							};
						});
						const animName = animDef.name || `anim_${animations.size}`;
						animations.set(animName, new Animation(animName, channels, samplers));
					}
					const modelRoot = new TransformNode(modelID);
					const defaultScene = asset.gltf.scenes[asset.gltf.scene || 0];
					if (defaultScene && defaultScene.nodes) defaultScene.nodes.forEach((idx) => modelRoot.addChild(vNodes[idx]));
					const container = new AssetContainer(modelID);
					container.rootNode = modelRoot;
					container.meshes = meshNodesList;
					container.skeletons = skeletons;
					container.animations = animations;
					return container;
				} catch (error) {
					console.error(`\n[Vapor3D: Failed to load GLB : "${modelID}"`);
					console.error(error);
					return null;
				}
			}
			applyLightmapMetadata(container, json) {
				if (!container || !container.meshes) {
					console.error("Vapor3D [Error]: Invalid container or no meshes found to apply lightmap.");
					return 0;
				}
				const metadata = typeof json === "string" ? JSON.parse(json) : json;
				if (!metadata || !metadata.items) {
					console.error("Vapor3D [Error]: Lightmap metadata is empty or has no 'items' array.");
					return 0;
				}
				const metaMap = /* @__PURE__ */ new Map();
				metadata.items.forEach((item) => {
					metaMap.set(item.name, item);
				});
				let appliedCount = 0;
				let missingCount = 0;
				const missingNames = [];
				container.meshes.forEach((meshNode) => {
					let searchName = meshNode.name;
					const meta = metaMap.get(searchName);
					if (meta) {
						meshNode.hasLightmap = true;
						meshNode.lightmapIndex = meta.lightmapIndex;
						meshNode.lightmapScaleOffset = [
							meta.scaleOffset[0],
							meta.scaleOffset[1],
							meta.scaleOffset[2],
							meta.scaleOffset[3]
						];
						appliedCount++;
					} else {
						meshNode.hasLightmap = false;
						meshNode.lightmapIndex = -1;
						missingCount++;
						if (missingNames.length < 10) missingNames.push(`- ${meshNode.name}`);
					}
				});
				if (missingCount > 0) console.warn(`Vapor3D : Lightmap apply completed with warnings.\nMissing Metadata: ${missingCount} meshes have NO lightmap data!\nFirst few missing meshes:\n${missingNames.join("\n")}${missingCount > 10 ? "\n...and more." : ""}`);
				else console.log(`Vapor3D: All ${appliedCount} meshes successfully mapped.`);
				return appliedCount;
			}
			async loadTexture(url) {
				const data = await Utils.fetchBinary(url);
				const blob = new Blob([data]);
				const bitmap = await createImageBitmap(blob);
				const tex = new Texture2D(this.gl);
				tex.uploadImageBitmap(bitmap);
				return tex;
			}
			async loadTextureFromSource(source) {
				const bitmap = await createImageBitmap(source);
				const tex = new Texture2D(this.gl);
				tex.uploadImageBitmap(bitmap);
				return tex;
			}
			async loadTextureKTX(url) {
				const data = await Utils.fetchBinary(url);
				const ktxData = Utils.parseKTX(data.buffer);
				const tex = new TextureCube(this.gl);
				tex.uploadKTX(ktxData);
				return tex;
			}
			async loadHDRTexture(url) {
				const data = await Utils.fetchBinary(url);
				const hdrData = Utils.parseHDR(data.buffer);
				const tex = new Texture2D(this.gl);
				tex.uploadHDR(hdrData);
				return tex;
			}
		};
	}));
	//#endregion
	//#region src/lib/Tools/CubeCamera.js
	var CubeCamera;
	var init_CubeCamera = __esmMin((() => {
		init_lib();
		CubeCamera = class {
			static PROJ = Math3D.mat4_perspective(Math.PI / 2, 1, .1, 100);
			static DIRECTIONS = [
				{
					target: [
						1,
						0,
						0
					],
					up: [
						0,
						-1,
						0
					]
				},
				{
					target: [
						-1,
						0,
						0
					],
					up: [
						0,
						-1,
						0
					]
				},
				{
					target: [
						0,
						1,
						0
					],
					up: [
						0,
						0,
						1
					]
				},
				{
					target: [
						0,
						-1,
						0
					],
					up: [
						0,
						0,
						-1
					]
				},
				{
					target: [
						0,
						0,
						1
					],
					up: [
						0,
						-1,
						0
					]
				},
				{
					target: [
						0,
						0,
						-1
					],
					up: [
						0,
						-1,
						0
					]
				}
			];
			static getViewMatrix(x, y, z, faceIndex) {
				const pos = [
					x,
					y,
					z
				];
				const dir = this.DIRECTIONS[faceIndex % 6];
				return Math3D.mat4_lookAt(pos, Math3D.v3_add(pos, dir.target), dir.up);
			}
			static getProjectionMatrix() {
				return this.PROJ;
			}
		};
	}));
	//#endregion
	//#region src/lib/Scene/Scene.js
	var Scene;
	var init_Scene = __esmMin((() => {
		init_lib();
		Scene = class {
			constructor(name = "Main", maxNodes = 8192) {
				this.name = name;
				this.worldMatrixBuffer = new Float32Array(maxNodes * 16);
				this.nodes = [];
				this._freeIndices = [];
				this._nextIndex = 0;
				this.root = new TransformNode(name + "_Root");
				this.registerNode(this.root);
				this.containers = /* @__PURE__ */ new Map();
				this.registry = {
					vaos: /* @__PURE__ */ new Map(),
					textures: /* @__PURE__ */ new Map()
				};
			}
			getNodeByIndex(idx) {
				const i = parseInt(idx);
				if (i < 0 || i >= this.nodes.length) return null;
				return this.nodes[i] || null;
			}
			registerNode(node) {
				if (node.worldMatrixIndex !== -1) return;
				let index;
				if (this._freeIndices.length > 0) index = this._freeIndices.pop();
				else index = this._nextIndex++;
				node.worldMatrixIndex = index;
				this.nodes[index] = node;
				for (let child of node.children) this.registerNode(child);
			}
			unregisterNode(node) {
				if (node.worldMatrixIndex === -1) return;
				this._freeIndices.push(node.worldMatrixIndex);
				this.nodes[node.worldMatrixIndex] = null;
				node.worldMatrixIndex = -1;
				for (let child of node.children) this.unregisterNode(child);
			}
			addContainer(id, container) {
				if (this.containers.has(id)) this.removeContainer(id);
				this.containers.set(id, container);
				this.root.addChild(container.rootNode);
				this.registerNode(container.rootNode);
			}
			removeContainer(id) {
				const container = this.containers.get(id);
				if (!container) return;
				this.root.removeChild(container.rootNode);
				this.unregisterNode(container.rootNode);
				container.dispose();
				this.containers.delete(id);
			}
			update(dt) {
				this.root.updateWorldMatrix([
					1,
					0,
					0,
					0,
					0,
					1,
					0,
					0,
					0,
					0,
					1,
					0,
					0,
					0,
					0,
					1
				], false, this.worldMatrixBuffer);
				for (const container of this.containers.values()) for (const skel of container.skeletons) {
					skel.updateCPU(this.worldMatrixBuffer);
					skel.updateGPU();
				}
			}
			async getOrCreateTexture(id, creator) {
				let promise = this.registry.textures.get(id);
				if (!promise) {
					promise = creator();
					this.registry.textures.set(id, promise);
				}
				return promise;
			}
			async getOrCreateVAO(id, creator) {
				let promise = this.registry.vaos.get(id);
				if (!promise) {
					promise = creator();
					this.registry.vaos.set(id, promise);
				}
				return promise;
			}
			async destroy() {
				(await Promise.all(this.registry.textures.values())).forEach((t) => t && t.destroy());
				(await Promise.all(this.registry.vaos.values())).forEach((v) => v && v.destroy());
				this.registry.textures.clear();
				this.registry.vaos.clear();
			}
		};
	}));
	//#endregion
	//#region src/lib/Scene/Node.js
	var Node, TransformNode, MeshNode;
	var init_Node = __esmMin((() => {
		init_lib();
		Node = class {
			constructor(name = "unnamed") {
				this.name = name;
				this.parent = null;
				this.children = [];
			}
			addChild(child) {
				if (child === this) return;
				if (child.parent) child.parent.removeChild(child);
				child.parent = this;
				this.children.push(child);
			}
			removeChild(child) {
				const index = this.children.indexOf(child);
				if (index !== -1) {
					this.children.splice(index, 1);
					child.parent = null;
				}
			}
		};
		TransformNode = class TransformNode extends Node {
			constructor(name) {
				super(name);
				this.position = [
					0,
					0,
					0
				];
				this.quaternion = [
					0,
					0,
					0,
					1
				];
				this.scale = [
					1,
					1,
					1
				];
				this.worldMatrixIndex = -1;
				this._dirty = true;
			}
			setDirty() {
				if (this._dirty) return;
				this._dirty = true;
				for (let i = 0; i < this.children.length; i++) if (this.children[i] instanceof TransformNode) this.children[i].setDirty();
			}
			updateWorldMatrix(parentMatrix, parentDirty, globalBuffer) {
				const isDirty = this._dirty || parentDirty;
				if (isDirty && this.worldMatrixIndex !== -1) {
					const local = Math3D.mat4_fromRTS(this.quaternion, this.position, this.scale);
					const world = Math3D.mat4_multiply(parentMatrix, local);
					globalBuffer.set(world, this.worldMatrixIndex * 16);
					this._dirty = false;
				}
				const myWorld = this.worldMatrixIndex !== -1 ? globalBuffer.subarray(this.worldMatrixIndex * 16, this.worldMatrixIndex * 16 + 16) : parentMatrix;
				for (let i = 0; i < this.children.length; i++) if (this.children[i] instanceof TransformNode) this.children[i].updateWorldMatrix(myWorld, isDirty, globalBuffer);
			}
		};
		MeshNode = class extends TransformNode {
			constructor(name, vao) {
				super(name);
				this.vao = vao;
				this.material = new Material();
				this.visible = true;
				this.isSkinned = false;
				this.skeleton = null;
				this.hasLightmap = false;
				this.lightmapIndex = -1;
				this.lightmapScaleOffset = [
					1,
					1,
					0,
					0
				];
				this.lightmapTex = null;
			}
			draw(mode) {
				if (this.visible && this.vao) this.vao.draw(mode);
			}
		};
	}));
	//#endregion
	//#region src/lib/Scene/Model/AssetContainer.js
	var AssetContainer;
	var init_AssetContainer = __esmMin((() => {
		init_lib();
		AssetContainer = class {
			constructor(id) {
				this.id = id;
				this.rootNode = null;
				this.meshes = [];
				this.skeletons = [];
				this.animations = /* @__PURE__ */ new Map();
				this.timeline = new Timeline();
			}
			dispose() {
				this.rootNode.destroy();
				this.meshes = [];
				this.skeletons = [];
			}
		};
	}));
	//#endregion
	//#region src/lib/Scene/Model/Skeleton.js
	var Skeleton;
	var init_Skeleton = __esmMin((() => {
		init_lib();
		Skeleton = class {
			constructor(gl, id, joints, ibms) {
				this.gl = gl;
				this.id = id;
				this.joints = joints;
				this.inverseBindMatrices = ibms;
				this.numJoints = joints.length;
				this.matrixPalette = new Float32Array(this.numJoints * 16);
				this.texture = gl.createTexture();
				const gl2 = this.gl;
				gl2.bindTexture(gl2.TEXTURE_2D, this.texture);
				gl2.texImage2D(gl2.TEXTURE_2D, 0, gl2.RGBA32F, 4, this.numJoints, 0, gl2.RGBA, gl2.FLOAT, null);
				gl2.pixelStorei(gl2.UNPACK_FLIP_Y_WEBGL, false);
				gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_MIN_FILTER, gl2.NEAREST);
				gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_MAG_FILTER, gl2.NEAREST);
				gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_WRAP_S, gl2.CLAMP_TO_EDGE);
				gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_WRAP_T, gl2.CLAMP_TO_EDGE);
				gl2.bindTexture(gl2.TEXTURE_2D, null);
			}
			updateCPU(globalWorldMatrixBuffer) {
				for (let i = 0; i < this.numJoints; i++) {
					const offset = this.joints[i].worldMatrixIndex * 16;
					if (offset < 0) continue;
					const worldMat = globalWorldMatrixBuffer.subarray(offset, offset + 16);
					const ibm = this.inverseBindMatrices.subarray(i * 16, i * 16 + 16);
					const skinMat = Math3D.mat4_multiply(worldMat, ibm);
					this.matrixPalette.set(skinMat, i * 16);
				}
			}
			updateGPU() {
				const gl = this.gl;
				gl.bindTexture(gl.TEXTURE_2D, this.texture);
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
				gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 4, this.numJoints, gl.RGBA, gl.FLOAT, this.matrixPalette);
				gl.bindTexture(gl.TEXTURE_2D, null);
			}
			destroy() {
				if (this.texture) {
					this.gl.deleteTexture(this.texture);
					this.texture = null;
				}
				this.joints = [];
				this.inverseBindMatrices = null;
				this.matrixPalette = null;
			}
		};
	}));
	//#endregion
	//#region src/lib/Animation/Animation.js
	var Animation;
	var init_Animation = __esmMin((() => {
		init_lib();
		Animation = class {
			constructor(name, channels, samplers) {
				this.name = name;
				this.channels = channels;
				this.samplers = samplers;
				this.duration = 0;
				if (this.samplers.length > 0) for (const sampler of this.samplers) {
					const lastTime = sampler.input[sampler.input.length - 1];
					if (lastTime > this.duration) this.duration = lastTime;
				}
			}
			_getFrameIndices(times, time) {
				if (time <= times[0]) return {
					prev: 0,
					next: 0,
					t: 0
				};
				if (time >= times[times.length - 1]) return {
					prev: times.length - 1,
					next: times.length - 1,
					t: 0
				};
				let prev = 0;
				for (let i = 1; i < times.length; i++) if (times[i] >= time) {
					prev = i - 1;
					break;
				}
				const next = prev + 1;
				const frameDuration = times[next] - times[prev];
				const t = frameDuration > 0 ? (time - times[prev]) / frameDuration : 0;
				return {
					prev,
					next,
					t
				};
			}
			/**
			* 在特定时间点采样整个动画的所有节点状态
			* @returns {Map<string, {position, quaternion, scale}>}
			*/
			sample(time) {
				const results = /* @__PURE__ */ new Map();
				for (const channel of this.channels) {
					const sampler = this.samplers[channel.sampler];
					const nodeName = channel.targetNode.name;
					if (!results.has(nodeName)) results.set(nodeName, {
						position: null,
						quaternion: null,
						scale: null
					});
					const state = results.get(nodeName);
					const { prev, next, t } = this._getFrameIndices(sampler.input, time);
					if (channel.path === "translation") {
						const prevVal = sampler.output.subarray(prev * 3, prev * 3 + 3);
						const nextVal = sampler.output.subarray(next * 3, next * 3 + 3);
						state.position = sampler.interpolation === "STEP" ? [...prevVal] : Math3D.vec3_lerp(prevVal, nextVal, t);
					} else if (channel.path === "rotation") {
						const prevVal = sampler.output.subarray(prev * 4, prev * 4 + 4);
						const nextVal = sampler.output.subarray(next * 4, next * 4 + 4);
						state.quaternion = sampler.interpolation === "STEP" ? [...prevVal] : Math3D.quat_slerp(prevVal, nextVal, t);
					} else if (channel.path === "scale") {
						const prevVal = sampler.output.subarray(prev * 3, prev * 3 + 3);
						const nextVal = sampler.output.subarray(next * 3, next * 3 + 3);
						state.scale = sampler.interpolation === "STEP" ? [...prevVal] : Math3D.vec3_lerp(prevVal, nextVal, t);
					}
				}
				return results;
			}
		};
	}));
	//#endregion
	//#region src/lib/Animation/Mixer.js
	var Mixer;
	var init_Mixer = __esmMin((() => {
		init_lib();
		Mixer = class {
			static blendMultiple(activeTracks, globalTime) {
				const finalPose = /* @__PURE__ */ new Map();
				for (const track of activeTracks) {
					const localTime = globalTime - track.startTime;
					const sampledPose = track.animation.sample(localTime);
					for (const [nodeName, trs] of sampledPose) {
						const bWeight = track.boneWeights && track.boneWeights.has(nodeName) ? track.boneWeights.get(nodeName) : 1;
						const effectiveWeight = track.weight * bWeight;
						if (effectiveWeight <= 0) continue;
						let isIdentity = true;
						if (trs.position) {
							if (Math.abs(trs.position[0]) > .001 || Math.abs(trs.position[1]) > .001 || Math.abs(trs.position[2]) > .001) isIdentity = false;
						}
						if (isIdentity && trs.quaternion) {
							if (Math.abs(Math.abs(trs.quaternion[3]) - 1) > .001) isIdentity = false;
						}
						if (isIdentity) continue;
						if (!finalPose.has(nodeName)) finalPose.set(nodeName, {
							pos: trs.position ? [...trs.position] : [
								0,
								0,
								0
							],
							quat: trs.quaternion ? [...trs.quaternion] : [
								0,
								0,
								0,
								1
							],
							scale: trs.scale ? [...trs.scale] : [
								1,
								1,
								1
							],
							weightSum: effectiveWeight
						});
						else {
							const current = finalPose.get(nodeName);
							const totalWeight = current.weightSum + effectiveWeight;
							const alpha = effectiveWeight / totalWeight;
							if (trs.position) current.pos = Math3D.vec3_lerp(current.pos, trs.position, alpha);
							if (trs.quaternion) current.quat = Math3D.quat_slerp(current.quat, trs.quaternion, alpha);
							if (trs.scale) current.scale = Math3D.vec3_lerp(current.scale, trs.scale, alpha);
							current.weightSum = totalWeight;
						}
					}
				}
				return finalPose;
			}
		};
	}));
	//#endregion
	//#region src/lib/Animation/Timeline.js
	var Timeline;
	var init_Timeline = __esmMin((() => {
		init_Mixer();
		Timeline = class {
			constructor() {
				this.clips = /* @__PURE__ */ new Map();
				this.currentTime = 0;
			}
			addClip(clipID, animation) {
				const clip = {
					id: clipID,
					animation,
					startTime: 0,
					duration: animation.duration,
					weight: 1,
					boneWeights: /* @__PURE__ */ new Map()
				};
				this.clips.set(clipID, clip);
			}
			removeClip(clipID) {
				this.clips.delete(clipID);
			}
			applyAt(time, rootNode) {
				this.currentTime = time;
				const activeClips = [];
				for (const clip of this.clips.values()) if (time >= clip.startTime && time < clip.startTime + clip.duration) activeClips.push(clip);
				if (activeClips.length === 0) return;
				const finalPose = Mixer.blendMultiple(activeClips, time);
				this._applyToNodes(rootNode, finalPose);
			}
			_applyToNodes(node, finalPose) {
				if (finalPose.has(node.name)) {
					const trs = finalPose.get(node.name);
					if (trs.pos) node.position = trs.pos;
					if (trs.quat) node.quaternion = trs.quat;
					if (trs.scale) node.scale = trs.scale;
					node.setDirty();
				}
				for (const child of node.children) this._applyToNodes(child, finalPose);
			}
		};
	}));
	//#endregion
	//#region src/lib/index.js
	var init_lib = __esmMin((() => {
		init_Utils();
		init_Core();
		init_Shader();
		init_Framebuffer();
		init_VAO();
		init_Textures();
		init_Math3D();
		init_Mesh();
		init_Loader();
		init_CubeCamera();
		init_Scene();
		init_Node();
		init_AssetContainer();
		init_Skeleton();
		init_Animation();
		init_Mixer();
		init_Timeline();
	}));
	//#endregion
	//#region src/handlers/Engine_h.js
	init_lib();
	var EngineHandlers = class {
		constructor(Scratch) {
			this.vm = Scratch.vm;
			this.core = null;
			this.shaders = /* @__PURE__ */ new Map();
			this.vaos = /* @__PURE__ */ new Map();
			this.textures = /* @__PURE__ */ new Map();
			this.fbos = /* @__PURE__ */ new Map();
			this.stencilBuffers = /* @__PURE__ */ new Map();
			this.activeShader = null;
		}
		tex_getCostumes() {
			try {
				const target = this.vm.runtime.getEditingTarget();
				if (!target || !target.getCostumes) return ["NONE"];
				return target.getCostumes().map((c) => c.name);
			} catch (e) {
				return ["NONE"];
			}
		}
		getAllLists() {
			try {
				const stage = this.vm.runtime.getTargetForStage();
				const editingTarget = this.vm.editingTarget || stage;
				const lists = ["NONE"];
				if (editingTarget && editingTarget.variables) Object.values(editingTarget.variables).filter((v) => v.type === "list").forEach((v) => lists.push(v.name));
				if (stage && stage !== editingTarget && stage.variables) Object.values(stage.variables).filter((v) => v.type === "list").forEach((v) => {
					if (!lists.includes(v.name)) lists.push(v.name);
				});
				return lists;
			} catch (e) {
				return ["NONE"];
			}
		}
		gl_Init() {
			if (this.core) return;
			const { Core } = (init_Core(), __toCommonJS(Core_exports));
			this.core = new Core();
			const mainCanvas = this.vm.renderer.canvas;
			if (mainCanvas && mainCanvas.parentElement) {
				mainCanvas.after(this.core.canvas);
				this.core.resize(mainCanvas.width, mainCanvas.height);
			}
		}
		gl_ResetResources() {
			[
				this.shaders,
				this.vaos,
				this.textures,
				this.fbos
			].forEach((map) => {
				map.forEach((obj) => {
					if (obj && obj.destroy) obj.destroy();
				});
				map.clear();
			});
		}
		gl_Present() {
			if (!this.core) return;
			this.core.resize(this.vm.renderer.canvas.width, this.vm.renderer.canvas.height);
		}
		Shader_Create({ ID, VS, FS }) {
			const shader = new Shader(this.core.gl, VS, FS);
			if (shader.program) this.shaders.set(ID, shader);
		}
		Shader_Use({ ID }) {
			const shader = this.shaders.get(ID);
			if (shader) {
				shader.use();
				this.activeShader = shader;
			}
		}
		Shader_SetMat4({ ID, NAME, VAL }, util) {
			const mat = Utils.parseInput(VAL, util);
			if (mat) {
				const arrayData = ArrayBuffer.isView(mat) ? mat : new Float32Array(mat);
				this.shaders.get(ID)?.setMat4(NAME, arrayData);
			}
		}
		Shader_SetVec4({ ID, NAME, X, Y, Z, W }) {
			this.shaders.get(ID)?.setVec4(NAME, X, Y, Z, W);
		}
		Shader_SetVec3({ ID, NAME, X, Y, Z }) {
			this.shaders.get(ID)?.setVec3(NAME, X, Y, Z);
		}
		Shader_SetVec2({ ID, NAME, X, Y }) {
			this.shaders.get(ID)?.setVec2(NAME, X, Y);
		}
		Shader_SetFloat({ ID, NAME, V }) {
			this.shaders.get(ID)?.setFloat(NAME, V);
		}
		Shader_SetInt({ ID, NAME, V }) {
			this.shaders.get(ID)?.setInt(NAME, V);
		}
		Shader_SetBool({ ID, NAME, V }) {
			this.shaders.get(ID)?.setInt(NAME, Boolean(Number(V)) ? 1 : 0);
		}
		FBO_Create({ ID }) {
			this.fbos.set(ID, new Framebuffer(this.core.gl));
		}
		FBO_AttachTexture({ ID, TEX, SLOT }) {
			const fbo = this.fbos.get(ID);
			const tex = this.textures.get(TEX);
			if (fbo && tex) fbo.attachTexture(tex, SLOT);
		}
		FBO_AttachCubeTexture({ ID, TEX, FACE_INDEX, SLOT }) {
			const fbo = this.fbos.get(ID);
			const tex = this.textures.get(TEX);
			if (fbo && tex instanceof TextureCube) fbo.attachCubeFace(tex, FACE_INDEX, SLOT);
		}
		Stencil_Create({ NAME, W, H }) {
			const gl = this.core.gl;
			const rb = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.STENCIL_INDEX8, W, H);
			gl.bindRenderbuffer(gl.RENDERBUFFER, null);
			this.stencilBuffers.set(NAME, {
				id: rb,
				width: W,
				height: H
			});
		}
		FBO_AttachStencil({ ID, STENCIL_NAME }) {
			const fbo = this.fbos.get(ID);
			const stencil = this.stencilBuffers.get(STENCIL_NAME);
			if (fbo && stencil) fbo.attachStencilBuffer(stencil);
		}
		FBO_Bind({ ID }) {
			const fbo = this.fbos.get(ID);
			if (fbo) fbo.bind(this.core.canvas.width, this.core.canvas.height);
			else Framebuffer.bindScreen(this.core.gl, this.core.canvas.width, this.core.canvas.height);
		}
		VAO_CreateScreenQuad({ ID }) {
			this.vaos.set(ID, VAO.createScreenQuad(this.core.gl));
		}
		VAO_CreateCube({ ID }) {
			this.vaos.set(ID, VAO.createCube(this.core.gl));
		}
		VAO_CreateSphere({ ID, LAT, LON }) {
			this.vaos.set(ID, VAO.createSphere(this.core.gl, LAT, LON));
		}
		VAO_CreateEmpty({ ID }) {
			this.vaos.set(ID, new VAO(this.core.gl));
		}
		VAO_Draw({ ID, COUNT, MODE }) {
			this.vaos.get(ID)?.draw(MODE, COUNT);
		}
		VAO_Destroy({ ID }) {
			this.vaos.get(ID)?.destroy();
			this.vaos.delete(ID);
		}
		Texture_CreateEmpty({ NAME, W, H, FORMAT }) {
			const conf = Utils.getFormatConfig(this.core.gl, FORMAT);
			const tex = new Texture2D(this.core.gl);
			tex.uploadEmpty(W, H, conf.internal, conf.format, conf.type);
			this.textures.set(NAME, tex);
		}
		Texture_CreateEmptyCubemap({ NAME, SIZE, FORMAT }) {
			const conf = Utils.getFormatConfig(this.core.gl, FORMAT);
			const tex = new TextureCube(this.core.gl);
			tex.uploadEmpty(SIZE, conf.internal, conf.format, conf.type);
			this.textures.set(NAME, tex);
		}
		Texture_Bind({ NAME, UNIT }) {
			this.textures.get(NAME)?.bind(UNIT);
		}
		Texture_BindCube({ NAME, UNIT }) {
			this.textures.get(NAME)?.bind(UNIT);
		}
		Texture_SetFilter({ NAME, MIN_MODE, MAG_MODE }) {
			const tex = this.textures.get(NAME);
			if (tex) tex.setFilter(MIN_MODE, MAG_MODE);
		}
		Texture_SetWrap({ NAME, MODE }) {
			const tex = this.textures.get(NAME);
			if (tex) {
				tex.setWrap("S", MODE);
				tex.setWrap("T", MODE);
			}
		}
		Texture_GenerateMipmap({ NAME }) {
			this.textures.get(NAME)?.generateMipmap();
		}
		gl_Clear({ BIT }) {
			this.core?.clear(BIT);
		}
		gl_SetClearColor({ R, G, B, A }) {
			this.core?.setClearColor(R, G, B, A);
		}
		ST_Enable({ CAP }) {
			this.core?.enable(CAP);
		}
		ST_Disable({ CAP }) {
			this.core?.disable(CAP);
		}
		ST_CullFace({ MODE }) {
			this.core?.cullFace(MODE);
		}
		ST_ColorMask({ STATE }) {
			const b = STATE === "true";
			this.core?.colorMask(b, b, b, b);
		}
		ST_BlendFuncSeparate({ SRGB, DRGB, SA, DA }) {
			this.core?.blendFuncSeparate(SRGB, DRGB, SA, DA);
		}
		ST_DepthMask({ STATE }) {
			this.core?.depthMask(STATE === "true");
		}
		ST_DepthFunc({ FUNC }) {
			this.core?.depthFunc(FUNC);
		}
		ST_StencilMask({ MASK }) {
			this.core?.stencilMask(parseInt(MASK) || 255);
		}
		ST_StencilOp({ FACE, SF, DF, DP }) {
			this.core?.stencilOp(FACE, SF, DF, DP);
		}
		ST_StencilFunc({ FACE, FUNC, REF, MASK }) {
			this.core?.stencilFunc(FACE, FUNC, parseInt(REF) || 0, parseInt(MASK) || 255);
		}
	};
	//#endregion
	//#region src/handlers/Scene_h.js
	init_lib();
	init_Math3D();
	var SceneHandlers = class {
		constructor(engineHandlers) {
			this.engine = engineHandlers;
			this.scenes = /* @__PURE__ */ new Map();
		}
		Scene_Create({ ID }) {
			if (this.scenes.has(ID)) this.scenes.get(ID).destroy();
			this.scenes.set(ID, new Scene(ID, 8192));
		}
		Scene_Destroy({ ID }) {
			const scene = this.scenes.get(ID);
			if (scene) {
				scene.destroy();
				this.scenes.delete(ID);
			}
		}
		Scene_Clear(args) {
			const { SCENE_ID } = args || {};
			if (SCENE_ID) {
				const scene = this.scenes.get(SCENE_ID);
				if (scene) scene.destroy();
			} else {
				this.scenes.forEach((scene) => scene?.destroy());
				this.scenes.clear();
			}
		}
		Scene_NodeSetTRS({ SCENE_ID, NODE_IDX, TRS }) {
			const node = this.scenes.get(SCENE_ID).getNodeByIndex(NODE_IDX);
			if (!node) return;
			const data = Math3D.TRS_parse(TRS);
			if (!data) return;
			node.position = data.position;
			node.quaternion = Math3D.quat_fromEuler(...data.euler);
			node.scale = data.scale;
			node.setDirty();
		}
		Scene_NodeSetParent({ SCENE_ID, CHILD_NODE_IDX, PARENT_NODE_IDX }) {
			const scene = this.scenes.get(SCENE_ID);
			if (!scene) return;
			const childNode = scene.getNodeByIndex(CHILD_NODE_IDX);
			const parentNode = PARENT_NODE_IDX === -1 ? scene.root : scene.getNodeByIndex(PARENT_NODE_IDX);
			if (childNode && parentNode) {
				parentNode.addChild(childNode);
				childNode.setDirty();
			}
		}
		Scene_GetNodeMatrix({ SCENE_ID, NODE_IDX }) {
			const scene = this.scenes.get(SCENE_ID);
			const node = scene?.getNodeByIndex(NODE_IDX);
			if (!node || node.worldMatrixIndex === -1) return "[]";
			const offset = node.worldMatrixIndex * 16;
			const mat = scene.worldMatrixBuffer.subarray(offset, offset + 16);
			return JSON.stringify(Array.from(mat));
		}
		_getFlatTRS(node) {
			return [
				...node.position,
				...node.quaternion,
				...node.scale
			];
		}
		Scene_GetNodeTRS({ SCENE_ID, NODE_IDX }) {
			const node = this.scenes.get(SCENE_ID)?.getNodeByIndex(NODE_IDX);
			return node ? JSON.stringify(this._getFlatTRS(node)) : "[]";
		}
		Scene_UpdateWorldMatrix({ SCENE_ID }) {
			this.scenes.get(SCENE_ID)?.update();
		}
		_getContainer(scene, modelID) {
			return scene?.containers.get(modelID);
		}
		Scene_GetModelRootIndex({ SCENE_ID, MODEL }) {
			const container = this._getContainer(this.scenes.get(SCENE_ID), MODEL);
			return container ? container.rootNode.worldMatrixIndex : -1;
		}
		Scene_GetJointNodeIndex({ SCENE_ID, MODEL, IDX }) {
			const joint = this._getContainer(this.scenes.get(SCENE_ID), MODEL)?.skeletons[0]?.joints[Number(IDX)];
			return joint ? joint.worldMatrixIndex : -1;
		}
		Scene_GetJointCount({ SCENE_ID, MODEL }) {
			return this._getContainer(this.scenes.get(SCENE_ID), MODEL)?.skeletons[0]?.numJoints || 0;
		}
		Scene_ModelSetJointTRS({ SCENE_ID, MODEL, IDX, TRS }) {
			const jointNode = this._getContainer(this.scenes.get(SCENE_ID), MODEL)?.skeletons[0]?.joints[Number(IDX)];
			if (jointNode) {
				const data = Math3D.TRS_parse(TRS);
				if (!data) return;
				jointNode.position = data.position;
				jointNode.quaternion = Math3D.quat_fromEuler(...data.euler);
				jointNode.scale = data.scale;
				jointNode.setDirty();
			}
		}
		Scene_ModelJointIndexToName({ SCENE_ID, MODEL, IDX }) {
			const joint = this._getContainer(this.scenes.get(SCENE_ID), MODEL)?.skeletons[0]?.joints[Number(IDX)];
			return joint ? joint.name : "Null";
		}
		Scene_ModelJointNameToIndex({ SCENE_ID, MODEL, NAME }) {
			const joints = this._getContainer(this.scenes.get(SCENE_ID), MODEL)?.skeletons[0]?.joints;
			if (!joints) return -1;
			const targetName = String(NAME).trim();
			return joints.findIndex((j) => j.name.trim() === targetName);
		}
		Scene_ModelBindSkeletonTex({ SCENE_ID, MODEL, UNIT }) {
			const skel = this._getContainer(this.scenes.get(SCENE_ID), MODEL)?.skeletons[0];
			const gl = this.engine.core.gl;
			gl.activeTexture(gl.TEXTURE0 + Number(UNIT));
			gl.bindTexture(gl.TEXTURE_2D, skel ? skel.texture : null);
		}
		Scene_GetMeshNodeIndex({ SCENE_ID, MODEL, IDX }) {
			const meshNode = this._getContainer(this.scenes.get(SCENE_ID), MODEL)?.meshes[Number(IDX)];
			return meshNode ? meshNode.worldMatrixIndex : -1;
		}
		Scene_GetMeshCount({ SCENE_ID, MODEL }) {
			const container = this._getContainer(this.scenes.get(SCENE_ID), MODEL);
			return container ? container.meshes.length : 0;
		}
		Scene_MeshGetName({ SCENE_ID, MODEL, IDX }) {
			return this._getContainer(this.scenes.get(SCENE_ID), MODEL)?.meshes[Number(IDX)]?.name || "Null";
		}
		Scene_MeshDraw({ SCENE_ID, MODEL, IDX, MODE }) {
			const scene = this.scenes.get(SCENE_ID);
			const meshNode = this._getContainer(scene, MODEL)?.meshes[Number(IDX)];
			const shader = this.engine.activeShader;
			if (meshNode && shader && meshNode.worldMatrixIndex !== -1) {
				const offset = meshNode.worldMatrixIndex * 16;
				const mat = scene.worldMatrixBuffer.subarray(offset, offset + 16);
				shader.setMat4("uModel", mat);
				meshNode.draw(MODE);
			}
		}
		Scene_MeshBindTex({ SCENE_ID, MODEL, IDX, TEX_TYPE, UNIT }) {
			const meshNode = this._getContainer(this.scenes.get(SCENE_ID), MODEL)?.meshes[Number(IDX)];
			if (meshNode) {
				const tex = meshNode.material[TEX_TYPE];
				if (tex) tex.bind(UNIT);
				else {
					const gl = this.engine.core.gl;
					gl.activeTexture(gl.TEXTURE0 + Number(UNIT));
					gl.bindTexture(gl.TEXTURE_2D, null);
				}
			}
		}
		Scene_MeshTex_SetFilter({ SCENE_ID, MODEL, IDX, NAME, MIN_MODE, MAG_MODE }) {
			const tex = (this._getContainer(this.scenes.get(SCENE_ID), MODEL)?.meshes[Number(IDX)])?.material[NAME];
			if (tex) tex.setFilter(MIN_MODE, MAG_MODE);
		}
		Scene_MeshTex_SetWrap({ SCENE_ID, MODEL, IDX, NAME, MODE }) {
			const tex = (this._getContainer(this.scenes.get(SCENE_ID), MODEL)?.meshes[Number(IDX)])?.material[NAME];
			if (tex) {
				tex.setWrap("S", MODE);
				tex.setWrap("T", MODE);
			}
		}
		Scene_MeshGetParam({ SCENE_ID, MODEL, IDX, PARAM }) {
			const meshNode = this._getContainer(this.scenes.get(SCENE_ID), MODEL)?.meshes[Number(IDX)];
			if (!meshNode) return "";
			const val = meshNode.material[PARAM];
			return Array.isArray(val) ? JSON.stringify(val) : val;
		}
		Scene_MeshGetLightmapParam({ SCENE_ID, MODEL, IDX, PARAM }) {
			const meshNode = this._getContainer(this.scenes.get(SCENE_ID), MODEL)?.meshes[Number(IDX)];
			if (!meshNode) return PARAM === "hasLightmap" ? "false" : -1;
			switch (PARAM) {
				case "hasLightmap": return meshNode.hasLightmap ? "1" : "0";
				case "lightmapIndex": return meshNode.lightmapIndex !== void 0 ? meshNode.lightmapIndex : -1;
				default: return "";
			}
		}
		Scene_MeshGetLightmapScaleOffsetComp({ SCENE_ID, MODEL, IDX, COMP }) {
			const so = (this._getContainer(this.scenes.get(SCENE_ID), MODEL)?.meshes[Number(IDX)])?.lightmapScaleOffset ?? [
				0,
				0,
				0,
				0
			];
			switch (COMP) {
				case "X": return so[0];
				case "Y": return so[1];
				case "Z": return so[2];
				case "W": return so[3];
			}
		}
	};
	//#endregion
	//#region src/handlers/Loader_h.js
	var LoaderHandlers = class {
		constructor(engineHandlers, sceneHandlers) {
			this.engine = engineHandlers;
			this.sceneHandlers = sceneHandlers;
			this._loader = null;
		}
		_getLoader() {
			if (!this._loader) {
				const { Loader } = (init_Loader(), __toCommonJS(Loader_exports));
				this._loader = new Loader(this.engine.core.gl);
			}
			return this._loader;
		}
		async Loader_load_glb({ SCENE_ID, NAME, U }) {
			const loader = this._getLoader();
			const targetScene = this.sceneHandlers.scenes.get(SCENE_ID);
			if (!loader || !targetScene) return;
			try {
				const container = await loader.loadGLB(U, targetScene, NAME);
				if (container && container.rootNode) {
					targetScene.addContainer(NAME, container);
					console.log(`Vapor3D: AssetContainer "${NAME}" plugged into Scene:`, container);
				}
			} catch (e) {
				console.error("Vapor3D: GLB Load Error:", e);
			}
		}
		async Loader_apply_lightmap_metadata({ SCENE_ID, NAME, JSON }) {
			const loader = this._getLoader();
			const targetScene = this.sceneHandlers.scenes.get(SCENE_ID);
			if (!loader || !targetScene) return;
			const container = targetScene.containers ? targetScene.containers.get(NAME) : null;
			const count = loader.applyLightmapMetadata(container, JSON);
			if (count > 0) console.log(`Vapor3D: Loader applied lightmap metadata to ${count} meshes in "${NAME}".`);
		}
		async Loader_load_texture_url({ NAME, U }) {
			const loader = this._getLoader();
			if (!loader) return;
			try {
				const tex = await loader.loadTexture(U);
				this.engine.textures.set(NAME, tex);
			} catch (e) {
				console.error("Vapor3D: Texture Load Error:", e);
			}
		}
		async Loader_load_texture_costume({ NAME, C }, util) {
			const loader = this._getLoader();
			if (!loader) return;
			const costume = util.target.sprite.costumes.find((c) => c.name === C);
			if (costume) try {
				const blob = new Blob([costume.asset.data]);
				const tex = await loader.loadTextureFromSource(blob);
				this.engine.textures.set(NAME, tex);
			} catch (e) {
				console.error("Vapor3D: Costume Load Error:", e);
			}
		}
		async Loader_load_ktx_url({ NAME, U }) {
			const loader = this._getLoader();
			if (!loader) return;
			try {
				const tex = await loader.loadTextureKTX(U);
				this.engine.textures.set(NAME, tex);
			} catch (e) {
				console.error("Vapor3D: KTX Load Error:", e);
			}
		}
		async Loader_load_hdr_url({ NAME, U }) {
			const loader = this._getLoader();
			if (!loader) return;
			try {
				const tex = await loader.loadHDRTexture(U);
				this.engine.textures.set(NAME, tex);
			} catch (e) {
				console.error("Vapor3D: HDR Load Error:", e);
			}
		}
		Loader_get_status() {
			return this._loader ? "ready" : "idle";
		}
	};
	//#endregion
	//#region src/handlers/Math3D_h.js
	init_Math3D();
	init_Utils();
	var Math3DHandlers = class {
		constructor(coreState) {
			this.vectors = /* @__PURE__ */ new Map();
		}
		v3_Init({ ID, X, Y, Z }) {
			this.vectors.set(ID, [
				Number(X),
				Number(Y),
				Number(Z)
			]);
		}
		v3_Modify({ ID, OP, OTHER }) {
			const a = this.vectors.get(ID);
			const b = this.vectors.get(OTHER);
			if (!a || !b) return;
			if (OP === "+") this.vectors.set(ID, Math3D.v3_add(a, b));
			else if (OP === "-") this.vectors.set(ID, Math3D.v3_sub(a, b));
			else if (OP === "mul") this.vectors.set(ID, Math3D.v3_mul(a, b));
		}
		v3_ApplyMatrix({ ID, M }, util) {
			const v = this.vectors.get(ID);
			const mat = Utils.parseInput(M, util) || Math3D.mat4_identity();
			if (v) this.vectors.set(ID, Math3D.v3_transform(v, mat));
		}
		v3_Get({ ID, COMP }) {
			const v = this.vectors.get(ID);
			return v ? v[{
				X: 0,
				Y: 1,
				Z: 2
			}[COMP.toUpperCase()]] ?? 0 : 0;
		}
		m4_Identity() {
			return JSON.stringify(Math3D.mat4_identity());
		}
		m4_Perspective({ F, A, N, F2 }) {
			return JSON.stringify(Math3D.mat4_perspective(F * Math.PI / 180, A, N, F2));
		}
		m4_LookAt({ EX, EY, EZ, TX, TY, TZ, UX, UY, UZ }) {
			return JSON.stringify(Math3D.mat4_lookAt([
				EX,
				EY,
				EZ
			], [
				TX,
				TY,
				TZ
			], [
				UX,
				UY,
				UZ
			]));
		}
		m4_Translate({ M, X, Y, Z }, util) {
			const mat = Utils.parseInput(M, util) || Math3D.mat4_identity();
			return JSON.stringify(Math3D.mat4_translate(mat, X, Y, Z));
		}
		m4_Rotate({ M, AXIS, DEG }, util) {
			const mat = Utils.parseInput(M, util) || Math3D.mat4_identity();
			const rad = DEG * Math.PI / 180;
			const axis = AXIS.toUpperCase();
			let result;
			if (axis === "X") result = Math3D.mat4_rotateX(mat, rad);
			else if (axis === "Y") result = Math3D.mat4_rotateY(mat, rad);
			else result = Math3D.mat4_rotateZ(mat, rad);
			return JSON.stringify(result);
		}
		m4_Scale({ M, X, Y, Z }, util) {
			const mat = Utils.parseInput(M, util) || Math3D.mat4_identity();
			return JSON.stringify(Math3D.mat4_scale(mat, X, Y, Z));
		}
		m4_Multiply({ A, B }, util) {
			const matA = Utils.parseInput(A, util) || Math3D.mat4_identity();
			const matB = Utils.parseInput(B, util) || Math3D.mat4_identity();
			return JSON.stringify(Math3D.mat4_multiply(matA, matB));
		}
		m4_Inverse({ M }, util) {
			const baseMat = Utils.parseInput(M, util) || Math3D.mat4_identity();
			const mat = Math3D.mat4_inverse(baseMat);
			if (!mat) {
				console.warn("Vapor3D: Invalid mat");
				return JSON.stringify(Math3D.mat4_identity());
			}
			return JSON.stringify(mat);
		}
		TRS_Create(args) {
			return Math3D.TRS_create(args.PX, args.PY, args.PZ, args.RX, args.RY, args.RZ, args.SX, args.SY, args.SZ);
		}
		TRS_Decompose(args) {
			return Math3D.TRS_decompose(args.TRS, args.TYPE, args.AXIS);
		}
		TRS_Add(args) {
			return Math3D.TRS_add(args.TRSA, args.TRSB);
		}
		TRS_Lerp(args) {
			const t = Math.max(0, Math.min(1, Number(args.T) || 0));
			return Math3D.TRS_lerp(args.A, args.B, t);
		}
	};
	//#endregion
	//#region src/handlers/CubeCamera_h.js
	init_CubeCamera();
	var CubeCameraHandlers = class {
		CubeCam_GetViewMatrix({ X, Y, Z, FACE }) {
			return JSON.stringify(CubeCamera.getViewMatrix(X, Y, Z, FACE));
		}
		CubeCam_GetProjection() {
			return JSON.stringify(CubeCamera.getProjectionMatrix());
		}
	};
	//#endregion
	//#region src/lib/Text/Text.js
	init_Textures();
	var Text = class {
		static canvas = document.createElement("canvas");
		static ctx = this.canvas.getContext("2d", { willReadFrequently: true });
		static createFromText(gl, text, font, color, borderSize, borderColor) {
			const ctx = this.ctx;
			ctx.font = font;
			const m = ctx.measureText(text);
			const b = borderSize > 0 ? Math.ceil(borderSize) : 0;
			const w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight + 2 * b;
			const h = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent + 2 * b;
			this.canvas.width = w;
			this.canvas.height = h;
			ctx.font = font;
			ctx.textBaseline = "alphabetic";
			ctx.clearRect(0, 0, w, h);
			if (borderSize > 0) {
				ctx.lineWidth = borderSize;
				ctx.strokeStyle = borderColor;
				ctx.strokeText(text, m.actualBoundingBoxLeft + b, m.fontBoundingBoxAscent + b);
			}
			ctx.fillStyle = color;
			ctx.fillText(text, m.actualBoundingBoxLeft + b, m.fontBoundingBoxAscent + b);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			const tex = new Texture2D(gl);
			tex.uploadImageBitmap(this.canvas);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
			return tex;
		}
		static getBounds(text, font, borderSize) {
			const ctx = this.ctx;
			ctx.font = font;
			const m = ctx.measureText(text);
			const b = borderSize > 0 ? Math.ceil(borderSize) : 0;
			return {
				width: m.actualBoundingBoxLeft + m.actualBoundingBoxRight + 2 * b,
				height: m.fontBoundingBoxAscent + m.fontBoundingBoxDescent + 2 * b
			};
		}
	};
	//#endregion
	//#region src/handlers/Text_h.js
	var TextHandlers = class {
		constructor(engine, Cast) {
			this.engine = engine;
			this.Cast = Cast;
		}
		Text_Create({ NAME, TEXT, FONT, COLOR, BORDER_SIZE, BORDER_COLOR }, util) {
			const colorObj = this.Cast.toRgbColorObject(COLOR);
			const borderColorObj = this.Cast.toRgbColorObject(BORDER_COLOR);
			const colorStr = `rgba(${colorObj.r},${colorObj.g},${colorObj.b},${(colorObj.a ?? 255) / 255})`;
			const bColorStr = `rgba(${borderColorObj.r},${borderColorObj.g},${borderColorObj.b},${(borderColorObj.a ?? 255) / 255})`;
			const tex = Text.createFromText(this.engine.core.gl, this.Cast.toString(TEXT), this.Cast.toString(FONT), colorStr, this.Cast.toNumber(BORDER_SIZE), bColorStr);
			this.engine.textures.set(this.Cast.toString(NAME), tex);
		}
		Text_GetWidth({ TEXT, FONT, BORDER_SIZE }, util) {
			return Text.getBounds(this.Cast.toString(TEXT), this.Cast.toString(FONT), this.Cast.toNumber(BORDER_SIZE)).width;
		}
		Text_GetHeight({ TEXT, FONT, BORDER_SIZE }, util) {
			return Text.getBounds(this.Cast.toString(TEXT), this.Cast.toString(FONT), this.Cast.toNumber(BORDER_SIZE)).height;
		}
	};
	//#endregion
	//#region src/handlers/AnimationPlayer_h.js
	var AnimationPlayerHandlers = class {
		constructor(engineHandlers, sceneHandlers) {
			this.engine = engineHandlers;
			this.sceneHandlers = sceneHandlers;
		}
		_getTimeline(sceneId, path) {
			const scene = this.sceneHandlers.scenes.get(sceneId);
			if (!scene) return null;
			const containerID = path.split("/")[0].trim();
			return scene.containers.get(containerID)?.timeline || null;
		}
		Animation_ClearClips({ SCENE_ID, MODEL }) {
			const container = this.sceneHandlers.scenes.get(SCENE_ID)?.containers.get(MODEL);
			if (container && container.timeline) container.timeline.clips.clear();
		}
		Animation_AddClip({ SCENE_ID, MODEL, CLIP_ID, ANIM_NAME }) {
			const container = this.sceneHandlers.scenes.get(SCENE_ID)?.containers.get(MODEL);
			const anim = container?.animations.get(ANIM_NAME);
			if (container && anim) container.timeline.addClip(CLIP_ID, anim);
		}
		Animation_RemoveClip({ SCENE_ID, MODEL, CLIP_ID }) {
			(this.sceneHandlers.scenes.get(SCENE_ID)?.containers.get(MODEL))?.timeline.removeClip(CLIP_ID);
		}
		Animation_SetClipProperty({ SCENE_ID, MODEL, CLIP_ID, PROP, VALUE }) {
			const clip = (this.sceneHandlers.scenes.get(SCENE_ID)?.containers.get(MODEL))?.timeline.clips.get(CLIP_ID);
			if (clip) clip[PROP] = Number(VALUE);
		}
		Animation_SetClipBoneWeight({ SCENE_ID, MODEL, CLIP_ID, BONE_NAME, WEIGHT, RECURSIVE }) {
			const container = this.sceneHandlers.scenes.get(SCENE_ID)?.containers.get(MODEL);
			const clip = container?.timeline.clips.get(CLIP_ID);
			if (!container || !clip) return;
			let targetJoint = null;
			for (const skel of container.skeletons) {
				targetJoint = skel.joints.find((j) => j.name === BONE_NAME);
				if (targetJoint) break;
			}
			if (targetJoint) if (RECURSIVE === "true") this._setBoneWeightRecursive(targetJoint, clip.boneWeights, Number(WEIGHT));
			else clip.boneWeights.set(targetJoint.name, Number(WEIGHT));
		}
		_setBoneWeightRecursive(node, weightMap, weight) {
			weightMap.set(node.name, weight);
			for (const child of node.children) this._setBoneWeightRecursive(child, weightMap, weight);
		}
		Animation_ApplyTime({ SCENE_ID, TIME }) {
			const scene = this.sceneHandlers.scenes.get(SCENE_ID);
			if (!scene) return;
			for (const container of scene.containers.values()) container.timeline?.applyAt(Number(TIME), container.rootNode);
		}
		_getFlatTRS(node) {
			return [
				...node.position,
				...node.quaternion,
				...node.scale
			];
		}
		Animation_GetModelJointTRS({ SCENE_ID, MODEL, IDX }) {
			const container = this.sceneHandlers.scenes.get(SCENE_ID)?.containers.get(MODEL);
			if (!container || !container.skeletons || container.skeletons.length === 0) return "[]";
			const jointNode = container.skeletons[0].joints[Number(IDX)];
			return jointNode ? JSON.stringify(this._getFlatTRS(jointNode)) : "[]";
		}
		Animation_GetTrackCount({ SCENE_ID, MODEL }) {
			const timeline = this._getTimeline(SCENE_ID, MODEL);
			return timeline ? timeline.tracks.length : 0;
		}
		Animation_IsTimelineActive({ SCENE_ID, MODEL }) {
			const timeline = this._getTimeline(SCENE_ID, MODEL);
			return timeline ? Array.from(timeline.clips.values()).some((t) => timeline.currentTime >= t.startTime && timeline.currentTime < t.startTime + t.duration) : false;
		}
	};
	//#endregion
	//#region src/index.js
	(function(Scratch) {
		"use strict";
		if (!Scratch.extensions.unsandboxed) throw new Error("Vapor3D must run unsandboxed");
		const vm = Scratch.vm;
		const runtime = vm.runtime || Scratch.runtime;
		const Cast = Scratch.Cast;
		if (vm && !vm.renderer && runtime.renderer) {
			console.log("Vapor3D CCW Environment Detected. Applying Shims...");
			vm.renderer = runtime.renderer;
			if (!vm.renderer.canvas) Object.defineProperty(vm.renderer, "canvas", {
				get: function() {
					return this._gl?.canvas || runtime._gl?.canvas || document.querySelector("canvas");
				},
				enumerable: true,
				configurable: true
			});
		} else console.log("Vapor3D Standard TurboWarp Environment Detected.");
		class Vapor3DExtension {
			constructor() {
				this.engineHandlers = new EngineHandlers(Scratch);
				this.sceneHandlers = new SceneHandlers(this.engineHandlers);
				this.loaderHandlers = new LoaderHandlers(this.engineHandlers, this.sceneHandlers);
				this.mathHandlers = new Math3DHandlers();
				this.cubeCameraHandlers = new CubeCameraHandlers();
				this.testHandlers = new TextHandlers(this.engineHandlers, Cast);
				this.animationPlayerHandlers = new AnimationPlayerHandlers(this.engineHandlers, this.sceneHandlers);
				runtime.on("PROJECT_STOP_ALL", () => {
					console.log("Vapor3D: Project stopped. releasing all resources...");
					this.sceneHandlers.Scene_Clear();
					this.engineHandlers.gl_ResetResources();
				});
				const bindMethods = (instance) => {
					Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).forEach((method) => {
						if (method !== "constructor" && typeof instance[method] === "function") this[method] = instance[method].bind(instance);
					});
				};
				bindMethods(this.engineHandlers);
				bindMethods(this.sceneHandlers);
				bindMethods(this.loaderHandlers);
				bindMethods(this.mathHandlers);
				bindMethods(this.cubeCameraHandlers);
				bindMethods(this.testHandlers);
				bindMethods(this.animationPlayerHandlers);
			}
			getInfo() {
				return {
					id: "vapor3D",
					name: "Vapor 3D",
					color1: "#2f2f36",
					hideFromPalette: true,
					blocks: [
						...EngineBlocks,
						"---",
						...SceneBlocks,
						"---",
						...AnimationPlayerBlocks,
						"---",
						...LoaderBlocks,
						"---",
						...Math3DBlocks,
						"---",
						...CubeCameraBlocks,
						"---",
						...TextBlocks
					],
					menus: { ...EngineMenus }
				};
			}
		}
		const originalGetBlocksXML = vm.runtime.getBlocksXML;
		vm.runtime.getBlocksXML = function(target) {
			const res = originalGetBlocksXML.call(this, target);
			try {
				if (!this._blockInfo || !Array.isArray(this._blockInfo)) return res;
				const ext = this._blockInfo.find((info) => info && info.id === "vapor3D");
				if (!ext || !ext.blocks) return res;
				const allBlocks = ext.blocks;
				[
					{
						name: "Engine",
						data: EngineBlocks,
						color: "#2f2f36"
					},
					{
						name: "Scene",
						data: SceneBlocks,
						color: "#36363d"
					},
					{
						name: "AnimPlayer",
						data: AnimationPlayerBlocks,
						color: "#3d3d45"
					},
					{
						name: "Loader",
						data: LoaderBlocks,
						color: "#45454d"
					},
					{
						name: "CubeCamera",
						data: CubeCameraBlocks,
						color: "#4d4d55"
					},
					{
						name: "Math",
						data: Math3DBlocks,
						color: "#54545c"
					},
					{
						name: "Text",
						data: TextBlocks,
						color: "#5a5a63"
					}
				].forEach((group) => {
					const groupXml = group.data.map((def) => {
						if (def === "---") return "<sep gap=\"36\"/>";
						if (typeof def === "object" && def.blockType === "label") return `<label text="${def.text}"/>`;
						if (def.opcode) {
							const b = allBlocks.find((ab) => ab && ab.info && ab.info.opcode === def.opcode);
							if (!b) return "";
							return b.xml || "";
						}
						return "";
					}).join("");
					if (groupXml) res.push({
						id: `v3d_cat_${group.name.toLowerCase()}`,
						xml: `<category name="${group.name}" id="v3d_cat_${group.name.toLowerCase()}" colour="${group.color}" secondaryColour="${group.color}">${groupXml}</category>`
					});
				});
				return res.map((item) => {
					if (item.id === "vapor3D") return {
						id: "vapor3D",
						xml: `<category name="Vapor 3D" id="vapor3D" colour="#2f2f36" secondaryColour="#2f2f36"></category>`
					};
					return item;
				});
			} catch (e) {
				return res;
			}
		};
		Scratch.extensions.register(new Vapor3DExtension());
	})(Scratch);
	//#endregion
})();

//# sourceMappingURL=vapor3d.iife.js.map