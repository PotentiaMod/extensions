(function(Scratch) {
    'use strict';

    const vm = Scratch.vm;
    const runtime = vm.runtime;
    const renderer = runtime.renderer;

    const gl = renderer._gl || renderer.gl || (renderer.canvas && renderer.canvas.getContext('webgl'));
    if (!gl) {
        console.error('[GBShader] WebGL context not found. Extension aborted.');
        return;
    }

    const DEFAULT_PALETTE = [
        [0.608, 0.737, 0.059, 1.0],
        [0.545, 0.675, 0.059, 1.0],
        [0.188, 0.384, 0.188, 1.0],
        [0.059, 0.220, 0.059, 1.0]
    ];

    let currentPalette = [
        [...DEFAULT_PALETTE[0]],
        [...DEFAULT_PALETTE[1]],
        [...DEFAULT_PALETTE[2]],
        [...DEFAULT_PALETTE[3]]
    ];
    let enabled = false;

    const VERT = `
        attribute vec2 a_position;
        varying vec2 v_uv;
        void main() {
            v_uv = a_position * 0.5 + 0.5;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    const FRAG = `
        precision mediump float;
        varying vec2 v_uv;
        uniform sampler2D u_texture;
        uniform vec4 u_c0;
        uniform vec4 u_c1;
        uniform vec4 u_c2;
        uniform vec4 u_c3;

        float lum(vec3 c) {
            return dot(c, vec3(0.299, 0.587, 0.114));
        }

        void main() {
            vec4 t = texture2D(u_texture, v_uv);
            float l = lum(t.rgb);

            vec4 outColor;
            if (l > 0.66) {
                outColor = u_c0;
            } else if (l > 0.33) {
                outColor = u_c1;
            } else if (l > 0.1) {
                outColor = u_c2;
            } else {
                outColor = u_c3;
            }
            gl_FragColor = outColor;
        }
    `;

    function compile(src, type) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.error('[GBShader] Shader compile error:', gl.getShaderInfoLog(s));
            gl.deleteShader(s);
            return null;
        }
        return s;
    }

    function createProgram(vsSrc, fsSrc) {
        const vs = compile(vsSrc, gl.VERTEX_SHADER);
        const fs = compile(fsSrc, gl.FRAGMENT_SHADER);
        if (!vs || !fs) return null;
        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error('[GBShader] Program link error:', gl.getProgramInfoLog(prog));
            return null;
        }
        return prog;
    }

    const program = createProgram(VERT, FRAG);
    if (!program) {
        console.error('[GBShader] Failed to create shader program.');
        return;
    }

    const aPos = gl.getAttribLocation(program, 'a_position');
    const uTex = gl.getUniformLocation(program, 'u_texture');
    const uC0  = gl.getUniformLocation(program, 'u_c0');
    const uC1  = gl.getUniformLocation(program, 'u_c1');
    const uC2  = gl.getUniformLocation(program, 'u_c2');
    const uC3  = gl.getUniformLocation(program, 'u_c3');

    const quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,   1, -1,   -1, 1,
        -1,  1,   1, -1,    1, 1
    ]), gl.STATIC_DRAW);

    let fbo = null, fboTex = null, fboDepth = null;
    let fboW = 0, fboH = 0;

    function deleteFBO() {
        if (fbo) { gl.deleteFramebuffer(fbo); fbo = null; }
        if (fboTex) { gl.deleteTexture(fboTex); fboTex = null; }
        if (fboDepth) { gl.deleteRenderbuffer(fboDepth); fboDepth = null; }
    }

    function initFBO() {
        deleteFBO();

        const w = gl.canvas.width;
        const h = gl.canvas.height;

        fbo = gl.createFramebuffer();
        fboTex = gl.createTexture();
        fboDepth = gl.createRenderbuffer();

        gl.bindTexture(gl.TEXTURE_2D, fboTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.bindRenderbuffer(gl.RENDERBUFFER, fboDepth);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);

        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fboTex, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, fboDepth);

        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status !== gl.FRAMEBUFFER_COMPLETE) {
            console.error('[GBShader] FBO incomplete, status:', status);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        fboW = w;
        fboH = h;
    }

    initFBO();

    function renderPost() {
        const prevProg   = gl.getParameter(gl.CURRENT_PROGRAM);
        const prevBuf    = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
        const prevViewport = gl.getParameter(gl.VIEWPORT);
        const prevActive = gl.getParameter(gl.ACTIVE_TEXTURE);
        const prevTex    = gl.getParameter(gl.TEXTURE_BINDING_2D);
        const prevBlend  = gl.getParameter(gl.BLEND);
        const prevDepth  = gl.getParameter(gl.DEPTH_TEST);
        const prevCull   = gl.getParameter(gl.CULL_FACE);
        const prevScissor= gl.getParameter(gl.SCISSOR_TEST);

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.SCISSOR_TEST);
        gl.disable(gl.BLEND);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.useProgram(program);

        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, fboTex);
        gl.uniform1i(uTex, 0);

        gl.uniform4f(uC0, currentPalette[0][0], currentPalette[0][1], currentPalette[0][2], currentPalette[0][3]);
        gl.uniform4f(uC1, currentPalette[1][0], currentPalette[1][1], currentPalette[1][2], currentPalette[1][3]);
        gl.uniform4f(uC2, currentPalette[2][0], currentPalette[2][1], currentPalette[2][2], currentPalette[2][3]);
        gl.uniform4f(uC3, currentPalette[3][0], currentPalette[3][1], currentPalette[3][2], currentPalette[3][3]);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        gl.useProgram(prevProg);
        gl.bindBuffer(gl.ARRAY_BUFFER, prevBuf);
        gl.disableVertexAttribArray(aPos);

        gl.activeTexture(prevActive);
        gl.bindTexture(gl.TEXTURE_2D, prevTex);

        gl.viewport(prevViewport[0], prevViewport[1], prevViewport[2], prevViewport[3]);
        prevBlend ? gl.enable(gl.BLEND) : gl.disable(gl.BLEND);
        prevDepth ? gl.enable(gl.DEPTH_TEST) : gl.disable(gl.DEPTH_TEST);
        prevCull ? gl.enable(gl.CULL_FACE) : gl.disable(gl.CULL_FACE);
        prevScissor ? gl.enable(gl.SCISSOR_TEST) : gl.disable(gl.SCISSOR_TEST);
    }

    const originalDraw = renderer.draw.bind(renderer);

    renderer.draw = function(...args) {
        if (!enabled) {
            originalDraw(...args);
            return;
        }

        const w = gl.canvas.width;
        const h = gl.canvas.height;
        if (!fbo || w !== fboW || h !== fboH) {
            initFBO();
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.viewport(0, 0, w, h);
        gl.clearColor(currentPalette[3][0], currentPalette[3][1], currentPalette[3][2], 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const origBindFB = gl.bindFramebuffer;
        gl.bindFramebuffer = function(target, framebuffer) {
            if (target === gl.FRAMEBUFFER && framebuffer === null) {
                framebuffer = fbo;
            }
            origBindFB.call(gl, target, framebuffer);
        };

        try {
            originalDraw(...args);
        } catch (e) {
            console.error('[GBShader] Error during originalDraw:', e);
        } finally {
            gl.bindFramebuffer = origBindFB;
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, w, h);
        renderPost();
    };

    function parseColor(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return [r, g, b, 1.0];
    }

    class GameBoyShader {
        getInfo() {
            return {
                id: 'gameboyshader',
                name: '陆鱼的Game Boy着色器',
                color1: '#9bbc0f',
                color2: '#306230',
                blocks: [
                    // ========== 灰色提示积木 ==========
                    {
                        opcode: 'renderTip',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '❗必须让角色移动才渲染❗',
                        disableMonitor: true,
                        color1: '#888888',
                        color2: '#666666',
                        color3: '#444444'
                    },
                    '---',
                    // =================================
                    {
                        opcode: 'setEnabled',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '[STATE] Game Boy 调色板效果',
                        arguments: {
                            STATE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'stateMenu',
                                defaultValue: '启用'
                            }
                        }
                    },
                    {
                        opcode: 'setPalette',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置调色板 亮:[C1] 中:[C2] 暗:[C3] 黑:[C4]',
                        arguments: {
                            C1: { type: Scratch.ArgumentType.COLOR, defaultValue: '#9bbc0f' },
                            C2: { type: Scratch.ArgumentType.COLOR, defaultValue: '#8bac0f' },
                            C3: { type: Scratch.ArgumentType.COLOR, defaultValue: '#306230' },
                            C4: { type: Scratch.ArgumentType.COLOR, defaultValue: '#0f380f' }
                        }
                    },
                    {
                        opcode: 'resetPalette',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '重置为默认 Game Boy 调色板'
                    }
                ],
                menus: {
                    stateMenu: {
                        acceptReporters: false,
                        items: ['启用', '禁用']
                    }
                }
            };
        }

        renderTip() {
            return '';
        }

        setEnabled(args) {
            enabled = (args.STATE === '启用');
            console.log('[GBShader] Enabled =', enabled);
        }

        setPalette(args) {
            currentPalette[0] = parseColor(args.C1);
            currentPalette[1] = parseColor(args.C2);
            currentPalette[2] = parseColor(args.C3);
            currentPalette[3] = parseColor(args.C4);
        }

        resetPalette() {
            for (let i = 0; i < 4; i++) {
                currentPalette[i] = [...DEFAULT_PALETTE[i]];
            }
        }
    }

    Scratch.extensions.register(new GameBoyShader());
    console.log('[GBShader] Extension loaded successfully.');

})(Scratch);
