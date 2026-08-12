// Name: Leishen Pro
// ID: leishen
// Description: Fullscreen post-processing effects: blur, glitch, bloom, presets and custom shaders.
// By: 勇敢的菠萝🍍 <https://space.bilibili.com/521949499>
// License: MIT

(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    // 注意：这里位于文件顶部，必须直接调 Scratch.translate（参数须为字面量，构建器会静态提取）
    throw new Error(Scratch.translate({
      id: 'errorNoSandbox',
      default: 'LeiShen FX must be run unsandboxed: check "Run without sandbox" in the custom extension window.'
    }));
  }

  const Cast = Scratch.Cast;
  const vm = Scratch.vm;
  const runtime = vm.runtime;

  /* ==========================================================================
   * 一、着色器源码（GLSL ES 1.00 / WebGL1）
   * ========================================================================== */

  const MAX_SHOCKS = 4;  // 同时存在的冲击波上限（也用于着色器数组长度）


  const VERT = [
    'attribute vec2 a_position;',
    'varying vec2 v_uv;',
    'void main() {',
    '  v_uv = a_position * 0.5 + 0.5;',
    '  gl_Position = vec4(a_position, 0.0, 1.0);',
    '}'
  ].join('\n');

  // 直接拷贝
  const FRAG_BLIT = [
    'precision mediump float;',
    'varying vec2 v_uv;',
    'uniform sampler2D u_tex;',
    'void main() { gl_FragColor = vec4(texture2D(u_tex, v_uv).rgb, 1.0); }'
  ].join('\n');

  // 可分离高斯模糊（jitter > 0 时变成"噪点模糊"）
  const FRAG_BLUR = [
    'precision highp float;',
    'varying vec2 v_uv;',
    'uniform sampler2D u_tex;',
    'uniform vec4 u_cfg;',   // texelX, texelY, radius(px), jitter
    'uniform vec2 u_dir;',
    'uniform float u_time;',
    'float hash12(vec2 p) {',
    '  vec3 p3 = fract(vec3(p.xyx) * 0.1031);',
    '  p3 += dot(p3, p3.yzx + 33.33);',
    '  return fract((p3.x + p3.y) * p3.z);',
    '}',
    'void main() {',
    '  float r = hash12(gl_FragCoord.xy + fract(u_time) * 311.7) - 0.5;',
    '  vec2 off = u_dir * u_cfg.xy * u_cfg.z * (1.0 + r * u_cfg.w * 2.0);',
    '  vec3 c  = texture2D(u_tex, v_uv).rgb * 0.2270270;',
    '  c += texture2D(u_tex, v_uv + off * 1.3846154).rgb * 0.3162162;',
    '  c += texture2D(u_tex, v_uv - off * 1.3846154).rgb * 0.3162162;',
    '  c += texture2D(u_tex, v_uv + off * 3.2307692).rgb * 0.0702703;',
    '  c += texture2D(u_tex, v_uv - off * 3.2307692).rgb * 0.0702703;',
    '  gl_FragColor = vec4(c, 1.0);',
    '}'
  ].join('\n');

  // 泛光：亮部提取
  const FRAG_BRIGHT = [
    'precision highp float;',
    'varying vec2 v_uv;',
    'uniform sampler2D u_tex;',
    'uniform float u_threshold;',
    'void main() {',
    '  vec3 c = texture2D(u_tex, v_uv).rgb;',
    '  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));',
    '  float k = max(l - u_threshold, 0.0) / max(1.0 - u_threshold, 0.001);',
    '  gl_FragColor = vec4(c * k, 1.0);',
    '}'
  ].join('\n');

  // 泛光：叠加
  const FRAG_BLOOM = [
    'precision highp float;',
    'varying vec2 v_uv;',
    'uniform sampler2D u_tex;',
    'uniform sampler2D u_bloom;',
    'uniform float u_amount;',
    'void main() {',
    '  vec3 base = texture2D(u_tex, v_uv).rgb;',
    '  vec3 glow = texture2D(u_bloom, v_uv).rgb;',
    '  gl_FragColor = vec4(base + glow * u_amount, 1.0);',
    '}'
  ].join('\n');

  // 拖影 / 残影
  const FRAG_TRAIL = [
    'precision highp float;',
    'varying vec2 v_uv;',
    'uniform sampler2D u_tex;',
    'uniform sampler2D u_prev;',
    'uniform float u_amount;',
    'void main() {',
    '  vec3 cur = texture2D(u_tex, v_uv).rgb;',
    '  vec3 prv = texture2D(u_prev, v_uv).rgb;',
    '  gl_FragColor = vec4(max(cur, prv * u_amount), 1.0);',
    '}'
  ].join('\n');

  // 主特效（Uber Shader）
  const FRAG_UBER = [
    'precision highp float;',
    '#define MAX_SHOCKS 4',
    'varying vec2 v_uv;',
    'uniform sampler2D u_tex;',
    'uniform vec4 u_res;',    // w, h, 1/w, 1/h
    'uniform vec4 u_p0;',     // pixelate, fisheye, swirl, zoomBlur
    'uniform vec4 u_p1;',     // rgbSplit, glitch, noise, scanline
    'uniform vec4 u_p2;',     // vignette, brightness, contrast, saturation
    'uniform vec4 u_p3;',     // hue, invert, waveAmp, waveFreq
    'uniform vec4 u_p4;',     // waveSpeed, shakeX, shakeY, time
    'uniform vec4 u_p5;',     // glitchSpeed, -, -, -
    'uniform vec4 u_shocks[MAX_SHOCKS];',  // 多个冲击波：cx, cy, radius, amp
    'uniform vec4 u_fx;',     // x=万花筒 y=液态 z=棱镜 w=故障色块
    'uniform vec4 u_tint;',   // r, g, b, amount
    'uniform vec4 u_flash;',  // r, g, b, amount
    '#define KALEIDO_AMP u_fx.x',
    '#define LIQUID_AMP  u_fx.y',
    '#define PRISM_AMP   u_fx.z',
    '#define BLOCK_AMP   u_fx.w',
    '#define PIXELATE u_p0.x',
    '#define FISHEYE  u_p0.y',
    '#define SWIRL    u_p0.z',
    '#define ZOOMBLUR u_p0.w',
    '#define RGBSPLIT u_p1.x',
    '#define GLITCH   u_p1.y',
    '#define NOISE    u_p1.z',
    '#define SCANLINE u_p1.w',
    '#define VIGNETTE u_p2.x',
    '#define BRIGHT   u_p2.y',
    '#define CONTRAST u_p2.z',
    '#define SAT      u_p2.w',
    '#define HUE      u_p3.x',
    '#define INVERT   u_p3.y',
    '#define WAVEAMP  u_p3.z',
    '#define WAVEFREQ u_p3.w',
    '#define WAVESPD  u_p4.x',
    '#define SHAKE    u_p4.yz',
    '#define TIME     u_p4.w',
    '#define GLSPEED  u_p5.x',
    'float hash11(float p) {',
    '  p = fract(p * 0.1031);',
    '  p *= p + 33.33;',
    '  p *= p + p;',
    '  return fract(p);',
    '}',
    'float hash12(vec2 p) {',
    '  vec3 p3 = fract(vec3(p.xyx) * 0.1031);',
    '  p3 += dot(p3, p3.yzx + 33.33);',
    '  return fract((p3.x + p3.y) * p3.z);',
    '}',
    'vec3 hueRotate(vec3 c, float a) {',
    '  vec3 k = vec3(0.57735027);',
    '  float cs = cos(a);',
    '  float sn = sin(a);',
    '  return c * cs + cross(k, c) * sn + k * dot(k, c) * (1.0 - cs);',
    '}',
    'void main() {',
    '  float asp = u_res.x / max(u_res.y, 1.0);',
    '  vec2 uv = v_uv;',
    '',
    '  // 1 颤抖',
    '  uv += SHAKE;',
    '',
    '  // 2 鱼眼 / 桶形畸变',
    '  if (abs(FISHEYE) > 0.0001) {',
    '    vec2 d = uv - 0.5;',
    '    uv = 0.5 + d * (1.0 + FISHEYE * dot(d, d) * 2.5);',
    '  }',
    '',
    '  // 3 漩涡',
    '  if (abs(SWIRL) > 0.0001) {',
    '    vec2 d = (uv - 0.5) * vec2(asp, 1.0);',
    '    float r = length(d);',
    '    float a = SWIRL * (1.0 - smoothstep(0.0, 0.72, r));',
    '    float s = sin(a);',
    '    float co = cos(a);',
    '    d = mat2(co, -s, s, co) * d;',
    '    uv = d / vec2(asp, 1.0) + 0.5;',
    '  }',
    '',
    '  // 4 冲击波（支持多个同时存在）',
    '  for (int i = 0; i < MAX_SHOCKS; i++) {',
    '    vec4 s = u_shocks[i];',
    '    if (s.w > 0.0001) {',
    '      vec2 d = (uv - s.xy) * vec2(asp, 1.0);',
    '      float r = length(d) + 0.00001;',
    '      float dd = r - s.z;',
    '      float ring = exp(-dd * dd * 260.0);',
    '      uv += (d / r) * ring * s.w * 0.12 / vec2(asp, 1.0);',
    '    }',
    '  }',
    '',
    '  // 4b 万花筒',
    '  if (KALEIDO_AMP > 0.0001) {',
    '    vec2 c = (uv - 0.5) * vec2(asp, 1.0);',
    '    float a = atan(c.y, c.x) + TIME * 0.25;',
    '    float rad = length(c);',
    '    float seg = 6.2831853 / max(2.0, floor(3.0 + KALEIDO_AMP * 26.0));',
    '    a = abs(mod(a, seg) - seg * 0.5);',
    '    vec2 k = vec2(cos(a), sin(a)) * rad;',
    '    uv = mix(uv, k / vec2(asp, 1.0) + 0.5, min(1.0, KALEIDO_AMP));',
    '  }',
    '',
    '  // 4c 液态扭曲',
    '  if (LIQUID_AMP > 0.0001) {',
    '    float t = TIME;',
    '    vec2 q = uv * (6.0 + LIQUID_AMP * 18.0);',
    '    uv.x += sin(q.y + t) * LIQUID_AMP * 0.025;',
    '    uv.y += cos(q.x + t * 1.3) * LIQUID_AMP * 0.025;',
    '  }',
    '',
    '  // 5 波纹',
    '  if (WAVEAMP > 0.0001) {',
    '    uv.x += sin(uv.y * WAVEFREQ + TIME * WAVESPD) * WAVEAMP * u_res.z;',
    '    uv.y += cos(uv.x * WAVEFREQ * 0.8 + TIME * WAVESPD * 1.17) * WAVEAMP * u_res.w;',
    '  }',
    '',
    '  // 6 错位闪烁',
    '  float shift = 0.0;',
    '  if (GLITCH > 0.0001) {',
    '    float t = floor(TIME * GLSPEED);',
    '    float band = floor(uv.y * (6.0 + hash11(t) * 26.0));',
    '    float r1 = hash12(vec2(band, t));',
    '    float r2 = hash12(vec2(band * 1.73 + 5.0, t * 1.31 + 9.0));',
    '    if (r1 < GLITCH * 0.75) {',
    '      shift = (r2 - 0.5) * GLITCH;',
    '      uv.x += shift * 0.28;',
    '    }',
    '    if (hash11(t * 0.77 + 2.0) < GLITCH * 0.22) {',
    '      uv += vec2(hash11(t * 3.1) - 0.5, hash11(t * 7.3) - 0.5) * GLITCH * 0.07;',
    '    }',
    '  }',
    '',
    '  // 7 像素化',
    '  if (PIXELATE > 0.5) {',
    '    vec2 px = PIXELATE * u_res.zw;',
    '    uv = (floor(uv / px) + 0.5) * px;',
    '  }',
    '',
    '  // 8 采样 + 色差',
    '  vec3 col;',
    '  float split = RGBSPLIT + abs(shift) * 3.0;',
    '  if (split > 0.0001) {',
    '    vec2 dir = normalize(uv - 0.5 + 0.00001);',
    '    vec2 o = dir * split * 0.035;',
    '    col = vec3(',
    '      texture2D(u_tex, uv + o).r,',
    '      texture2D(u_tex, uv).g,',
    '      texture2D(u_tex, uv - o).b);',
    '  } else {',
    '    col = texture2D(u_tex, uv).rgb;',
    '  }',
    '',
    '  // 8b 棱镜色散（径向 RGB 分离）',
    '  if (PRISM_AMP > 0.0001) {',
    '    vec2 dir = (uv - 0.5) * vec2(asp, 1.0);',
    '    float amt = PRISM_AMP * 0.04;',
    '    col = vec3(',
    '      texture2D(u_tex, uv + dir * amt).r,',
    '      texture2D(u_tex, uv).g,',
    '      texture2D(u_tex, uv - dir * amt).b);',
    '  }',
    '',
    '  // 8c 故障色块（datamosh）',
    '  if (BLOCK_AMP > 0.0001) {',
    '    float t = floor(TIME * GLSPEED * 2.0);',
    '    vec2 grid = vec2(24.0, 18.0);',
    '    vec2 id = floor(uv * grid);',
    '    float r = hash12(id + t * 1.7);',
    '    if (r < BLOCK_AMP * 0.5) {',
    '      float rx = (hash12(id * 2.3 + t) - 0.5) * BLOCK_AMP * 0.35;',
    '      uv.x = fract(uv.x + rx);',
    '      col.r = texture2D(u_tex, uv).r;',
    '      col.b = texture2D(u_tex, fract(uv - vec2(0.02 * BLOCK_AMP, 0.0))).b;',
    '    }',
    '  }',
    '',
    '  // 9 径向模糊',
    '  if (ZOOMBLUR > 0.0001) {',
    '    vec2 dir = (0.5 - uv) * ZOOMBLUR * 0.09;',
    '    vec3 acc = col;',
    '    for (int i = 1; i < 10; i++) {',
    '      acc += texture2D(u_tex, uv + dir * (float(i) / 9.0)).rgb;',
    '    }',
    '    col = acc / 10.0;',
    '  }',
    '',
    '  vec3 c = col;',
    '',
    '  // 10 调色',
    '  c = (c - 0.5) * (1.0 + CONTRAST) + 0.5 + BRIGHT;',
    '  float lum = dot(c, vec3(0.2126, 0.7152, 0.0722));',
    '  c = mix(vec3(lum), c, 1.0 + SAT);',
    '  if (abs(HUE) > 0.0001) c = hueRotate(c, HUE);',
    '  c = mix(c, 1.0 - c, INVERT);',
    '  if (u_tint.a > 0.0001) {',
    '    float l2 = dot(clamp(c, 0.0, 1.0), vec3(0.299, 0.587, 0.114));',
    '    c = mix(c, u_tint.rgb * (0.12 + l2 * 1.05), u_tint.a);',
    '  }',
    '',
    '  // 11 扫描线 / CRT',
    '  if (SCANLINE > 0.0001) {',
    '    float s = sin(v_uv.y * u_res.y * 1.6) * 0.5 + 0.5;',
    '    c *= 1.0 - SCANLINE * 0.55 * s;',
    '    float roll = abs(fract(v_uv.y - TIME * 0.12) - 0.5) * 2.0;',
    '    c *= mix(1.0, 0.86 + 0.14 * roll, SCANLINE * 0.8);',
    '  }',
    '',
    '  // 12 噪点',
    '  if (NOISE > 0.0001) {',
    '    float n = hash12(gl_FragCoord.xy + fract(TIME) * 443.7);',
    '    c += (n - 0.5) * NOISE;',
    '  }',
    '',
    '  // 13 暗角',
    '  if (VIGNETTE > 0.0001) {',
    '    vec2 d = (v_uv - 0.5) * vec2(asp, 1.0);',
    '    float v = smoothstep(0.85, 0.22, length(d));',
    '    c *= mix(1.0, v, VIGNETTE);',
    '  }',
    '',
    '  // 14 闪光',
    '  c = mix(c, u_flash.rgb, clamp(u_flash.a, 0.0, 1.0));',
    '',
    '  gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);',
    '}'
  ].join('\n');

  /* ==========================================================================
   * 二、参数表 / 预设
   * ========================================================================== */

  const EFFECT_LIST = [
    ['模糊', 'blur', 0, 100],
    ['噪点模糊', 'noiseBlur', 0, 100],
    ['噪点', 'noise', 0, 100],
    ['颤抖', 'shake', 0, 100],
    ['错位闪烁', 'glitch', 0, 100],
    ['色差', 'rgbSplit', 0, 100],
    ['像素化', 'pixelate', 0, 100],
    ['扫描线', 'scanline', 0, 100],
    ['暗角', 'vignette', 0, 100],
    ['波纹', 'wave', 0, 100],
    ['径向模糊', 'zoomBlur', 0, 100],
    ['泛光', 'bloom', 0, 100],
    ['鱼眼', 'fisheye', -100, 100],
    ['漩涡', 'swirl', -100, 100],
    ['拖影', 'trail', 0, 100],
    ['亮度', 'brightness', -100, 100],
    ['对比度', 'contrast', -100, 100],
    ['饱和度', 'saturation', -100, 100],
    ['色相', 'hue', 0, 360],
    ['反色', 'invert', 0, 100],
    ['染色浓度', 'tintAmount', 0, 100],
    ['万花筒', 'kaleido', 0, 100],
    ['液态扭曲', 'liquid', 0, 100],
    ['棱镜色散', 'prism', 0, 100],
    ['故障色块', 'blockGlitch', 0, 100]
  ];
  const EFFECT_KEY = {};
  const EFFECT_RANGE = {};
  EFFECT_LIST.forEach(function (e) {
    EFFECT_KEY[e[0]] = e[1];
    EFFECT_KEY[e[1]] = e[1];
    EFFECT_RANGE[e[1]] = [e[2], e[3]];
  });

  // label, key, min, max, default, 是否属于"风格类"(会被预设重置)
  const ADV_LIST = [
    ['模糊质量', 'blurQuality', 1, 4, 2, false],
    ['特效分辨率倍率', 'renderScale', 0.2, 1, 1, false],
    ['平滑刷新', 'smooth', 0, 1, 1, false],
    ['泛光阈值', 'bloomThreshold', 0, 100, 55, true],
    ['波纹频率', 'waveFreq', 1, 300, 26, true],
    ['波纹速度', 'waveSpeed', 0, 50, 3, true],
    ['错位频率', 'glitchSpeed', 1, 60, 18, true]
  ];
  const ADV_KEY = {};
  const ADV_RANGE = {};
  ADV_LIST.forEach(function (e) {
    ADV_KEY[e[0]] = e[1];
    ADV_KEY[e[1]] = e[1];
    ADV_RANGE[e[1]] = [e[2], e[3], e[4], e[5]];
  });

  const PRESETS = {
    '无': {},
    '复古CRT': { scanline: 72, vignette: 62, rgbSplit: 10, noise: 12, fisheye: 14, contrast: 12 },
    '水下世界': { wave: 48, blur: 9, tintAmount: 38, tintColor: '#2ea8ff', saturation: -8, vignette: 32, waveFreq: 22, waveSpeed: 2.4 },
    '梦境': { bloom: 72, blur: 20, saturation: 26, brightness: 8, vignette: 26 },
    '醉酒': { swirl: 16, wave: 28, blur: 11, rgbSplit: 9, waveFreq: 9, waveSpeed: 1.6 },
    '末日废土': { saturation: -55, contrast: 26, noise: 20, vignette: 70, tintAmount: 26, tintColor: '#ffb066' },
    '黑客帝国': { tintAmount: 82, tintColor: '#31ff7a', scanline: 46, noise: 14, bloom: 38, contrast: 16 },
    '默片老电影': { saturation: -100, noise: 32, vignette: 56, contrast: 22, scanline: 18 },
    '霓虹赛博': { bloom: 85, rgbSplit: 16, saturation: 42, tintAmount: 16, tintColor: '#ff2fd0', vignette: 36 },
    '灵魂出窍': { trail: 90, bloom: 46, blur: 7, rgbSplit: 8 },
    '濒死': { rgbSplit: 22, vignette: 74, tintAmount: 40, tintColor: '#ff2020', blur: 8, saturation: -30 },
    '像素游戏': { pixelate: 22, contrast: 12, saturation: 16 },
    '信号故障': { glitch: 55, rgbSplit: 24, noise: 22, scanline: 30, glitchSpeed: 24 },
    '雷神降临': { bloom: 60, rgbSplit: 12, tintAmount: 22, tintColor: '#7cc7ff', contrast: 18, vignette: 40, noise: 8 }
  };

  const DEFAULT_SHADER = [
    '// 「雷神」自定义着色器示例：能量护盾',
    '// 可用变量: v_uv(0~1) u_tex(舞台画面) u_time(秒) u_resolution u_mouse',
    '// 自己声明的 uniform 可以用「设置着色器变量」积木赋值',
    'uniform float 强度;   // 用积木赋值 0~1',
    '',
    'void main() {',
    '  vec2 uv = v_uv;',
    '  float t = u_time;',
    '  float d = distance(uv, vec2(0.5));',
    '  uv += normalize(uv - 0.5 + 0.0001) * sin(d * 40.0 - t * 6.0) * 0.006 * 强度;',
    '  vec3 col = texture2D(u_tex, uv).rgb;',
    '  vec2 g = fract(uv * vec2(u_resolution.x / u_resolution.y, 1.0) * 26.0) - 0.5;',
    '  float grid = smoothstep(0.44, 0.5, max(abs(g.x), abs(g.y)));',
    '  col += vec3(0.25, 0.7, 1.0) * grid * 0.55 * 强度 * (0.5 + 0.5 * sin(t * 3.0));',
    '  col += vec3(0.2, 0.6, 1.0) * smoothstep(0.35, 0.72, d) * 0.6 * 强度;',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  const BUILTIN_UNIFORMS = [
    'u_tex', 'u_resolution', 'u_texel', 'u_time', 'u_mouse',
    'iChannel0', 'iResolution', 'iTime', 'iTimeDelta', 'iFrame', 'iMouse', 'iDate'
  ];

  function hexToRGB(hex) {
    let s = String(hex == null ? '#ffffff' : hex).trim().replace('#', '');
    if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
    const n = parseInt(s.slice(0, 6), 16);
    if (isNaN(n)) return [1, 1, 1];
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  /**
   * WebGL 规范要求着色器源码必须落在 GLSL ES 的 ASCII 字符集内，
   * 直接写「uniform float 强度;」会被驱动判成语法错误（报 '?' : syntax error）。
   * 这里做一层标识符转译：把含非 ASCII 的标识符换成合法的 _ls_uN，
   * 同时记录映射，让积木里依然可以用中文名字给变量赋值。
   */
  function mangleUnicode(src) {
    const NON_ASCII = /[^\x00-\x7F]/;
    const forward = Object.create(null); // 原名 -> 安全名
    const backward = Object.create(null); // 安全名 -> 原名
    const isStart = (c) => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_' || c.charCodeAt(0) > 127;
    const isPart = (c) => isStart(c) || (c >= '0' && c <= '9');
    // 注释里的非 ASCII 同样违规，换成 '.' 但保留换行以免错乱行号
    const scrub = (s) => s.replace(/[^\x00-\x7F]/g, (ch) => (ch === '\n' ? '\n' : '.'));

    let out = '';
    let i = 0;
    let n = 0;
    const len = src.length;
    while (i < len) {
      const c = src[i];
      if (c === '/' && src[i + 1] === '/') {
        let j = src.indexOf('\n', i);
        if (j < 0) j = len;
        out += scrub(src.slice(i, j));
        i = j;
      } else if (c === '/' && src[i + 1] === '*') {
        let j = src.indexOf('*/', i + 2);
        j = j < 0 ? len : j + 2;
        out += scrub(src.slice(i, j));
        i = j;
      } else if (isStart(c)) {
        let j = i + 1;
        while (j < len && isPart(src[j])) j++;
        const tok = src.slice(i, j);
        if (NON_ASCII.test(tok)) {
          let safe = forward[tok];
          if (!safe) {
            safe = '_ls_u' + (n++);
            forward[tok] = safe;
            backward[safe] = tok;
          }
          out += safe;
        } else {
          out += tok;
        }
        i = j;
      } else {
        // 落单的非 ASCII 符号（全角标点等）直接吃掉，避免整份源码被拒
        out += c.charCodeAt(0) > 127 ? ' ' : c;
        i++;
      }
    }
    return { source: out, forward, backward };
  }

  /** 编译报错里出现的安全名换回用户写的中文名 */
  function demangleLog(log, backward) {
    if (!log) return log;
    return String(log).replace(/_ls_u\d+/g, (m) => backward[m] || m);
  }

  /** 把用户代码拼成完整的 fragment shader，返回 { source, nameMap } */
  function buildCustomSource(rawSrc) {
    const mangled = mangleUnicode(String(rawSrc == null ? '' : rawSrc));
    const src = mangled.source;
    const isShadertoy = /\bmainImage\s*\(/.test(src) && !/\bvoid\s+main\s*\(/.test(src);
    const has = function (name) { return new RegExp('uniform[^;]*\\b' + name + '\\b').test(src); };
    let head = '';
    if (!/precision\s+(lowp|mediump|highp)\s+float/.test(src)) head += 'precision highp float;\n';
    head += 'varying vec2 v_uv;\n';
    if (!has('u_tex')) head += 'uniform sampler2D u_tex;\n';
    if (!has('u_resolution')) head += 'uniform vec2 u_resolution;\n';
    if (!has('u_texel')) head += 'uniform vec2 u_texel;\n';
    if (!has('u_time')) head += 'uniform float u_time;\n';
    if (!has('u_mouse')) head += 'uniform vec2 u_mouse;\n';
    if (!isShadertoy) {
      return { source: head + src, nameMap: mangled.backward };
    }

    head += '#define texture texture2D\n';
    if (!has('iResolution')) head += 'uniform vec3 iResolution;\n';
    if (!has('iTime')) head += 'uniform float iTime;\n';
    if (!has('iTimeDelta')) head += 'uniform float iTimeDelta;\n';
    if (!has('iFrame')) head += 'uniform float iFrame;\n';
    if (!has('iMouse')) head += 'uniform vec4 iMouse;\n';
    if (!has('iChannel0')) head += 'uniform sampler2D iChannel0;\n';
    const tail = '\nvoid main() {\n  vec4 fc = vec4(0.0, 0.0, 0.0, 1.0);\n' +
      '  mainImage(fc, gl_FragCoord.xy);\n  gl_FragColor = vec4(fc.rgb, 1.0);\n}\n';
    return { source: head + src + tail, nameMap: mangled.backward };
  }

  /* ==========================================================================
   * 三、后期处理引擎
   * ========================================================================== */

  class FXEngine {
    constructor() {
      this.renderer = vm.renderer || (runtime && runtime.renderer) || null;
      this.gl = this.renderer ? (this.renderer.gl || this.renderer._gl) : null;

      this.ready = false;
      this.enabled = true;
      this.failed = false;

      this.params = {};
      EFFECT_LIST.forEach((e) => { this.params[e[1]] = 0; });
      this.adv = {};
      ADV_LIST.forEach((e) => { this.adv[e[1]] = e[4]; });

      this.tintColor = [1, 1, 1];
      this.transients = [];
      this.startTime = performance.now();

      this.customEnabled = false;
      this.customSource = '';
      this.customError = '';
      this.customProgram = null;
      this.uniformValues = new Map();

      this.programs = {};
      this.rt = {};
      this.capture = null;
      this.captureValid = false;
      this.captureBroken = false;
      this.captureActive = false;
      this.W = 0;
      this.H = 0;
      this.rafId = 0;
      this._rtDirty = true;
      this._pending = null;
      // 诊断用：很多编辑器（如 AstraEditor / 手机端）没有 F12 控制台，
      // 这些字段会通过"引擎状态"积木直接显示出来。
      this.frames = 0;        // 成功捕获到干净舞台的帧数
      this._bindHits = 0;     // 本帧 scratch-render 绑定屏幕的次数（0 = 它跳过了绘制）
      this.lastError = '';
      this.hasDirtyFlag = false;

      if (!this.gl) {
        console.error('[雷神] 找不到 WebGL 渲染器，扩展无法工作。');
        return;
      }
      this._initGL();
      this._hookRenderer();
      this._watchContext();
    }

    /* ---------------- GL 资源 ---------------- */

    _initGL() {
      const gl = this.gl;
      this.quad = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);

      this.programs = {
        blit: this._program(VERT, FRAG_BLIT, 'blit'),
        blur: this._program(VERT, FRAG_BLUR, 'blur'),
        bright: this._program(VERT, FRAG_BRIGHT, 'bright'),
        bloom: this._program(VERT, FRAG_BLOOM, 'bloom'),
        trail: this._program(VERT, FRAG_TRAIL, 'trail'),
        uber: this._program(VERT, FRAG_UBER, 'uber')
      };
      this._rtDirty = true;
      this.captureValid = false;
      // 保存原始 bindFramebuffer（在覆盖之前），后期 blit 到真实屏幕时用它绕过重定向
      this._realBind = gl.bindFramebuffer.bind(gl);
      this.ready = !!(this.programs.uber && this.programs.blit);
      if (!this.ready) console.error('[雷神] 内置着色器初始化失败。');
    }

    _watchContext() {
      const canvas = this.gl.canvas;
      if (!canvas || !canvas.addEventListener) return;
      canvas.addEventListener('webglcontextlost', () => { this.ready = false; });
      canvas.addEventListener('webglcontextrestored', () => {
        this.rt = {};
        this.capture = null;
        this.customProgram = null;
        this._initGL();
        if (this.customSource) this.compileCustom(this.customSource);
      });
    }

    _shader(type, src) {
      const gl = this.gl;
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        this._lastError = gl.getShaderInfoLog(sh) || '编译失败';
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    }

    _program(vsSrc, fsSrc, name, nameMap) {
      const gl = this.gl;
      const say = (log) => demangleLog(log, nameMap || {});
      this._lastError = '';
      const vs = this._shader(gl.VERTEX_SHADER, vsSrc);
      if (!vs) { console.error('[雷神] 顶点着色器失败 (' + name + '):\n' + say(this._lastError)); return null; }
      const fs = this._shader(gl.FRAGMENT_SHADER, fsSrc);
      if (!fs) {
        gl.deleteShader(vs);
        console.error('[雷神] 片元着色器失败 (' + name + '):\n' + say(this._lastError));
        return null;
      }
      const p = gl.createProgram();
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        this._lastError = say(gl.getProgramInfoLog(p) || '链接失败');
        console.error('[雷神] 着色器链接失败 (' + name + '):\n' + this._lastError);
        gl.deleteProgram(p);
        return null;
      }
      const obj = { program: p, loc: {}, uniforms: [], nameMap: nameMap || {}, aPos: gl.getAttribLocation(p, 'a_position') };
      const count = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const info = gl.getActiveUniform(p, i);
        if (!info) continue;
        const uname = info.name.replace(/\[0\]$/, '');
        obj.loc[uname] = gl.getUniformLocation(p, uname);
        obj.uniforms.push({ name: uname, type: info.type });
      }
      return obj;
    }

    _makeRT(w, h, withStencil) {
      const gl = this.gl;
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fb = gl.createFramebuffer();
      this._realBind(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      let rb = null;
      if (withStencil) {
        const isGL2 = (typeof WebGL2RenderingContext !== 'undefined') && (gl instanceof WebGL2RenderingContext);
        rb = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
        // WebGL2 已移除 DEPTH_STENCIL 作为 renderbuffer 存储格式，须用带尺寸的 DEPTH24_STENCIL8；
        // WebGL1 才接受 UNSIZED 的 DEPTH_STENCIL。
        gl.renderbufferStorage(gl.RENDERBUFFER, isGL2 ? gl.DEPTH24_STENCIL8 : gl.DEPTH_STENCIL, w, h);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, rb);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        // 兜底：万一该驱动不支持带模板的帧缓冲，去掉模板附件也能正常接收舞台画面（)
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
          gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, null);
          gl.deleteRenderbuffer(rb);
          rb = null;
        }
      }
      this._realBind(gl.FRAMEBUFFER, null);
      gl.bindTexture(gl.TEXTURE_2D, null);
      return { tex, fb, rb, w, h };
    }

    _freeRT(r) {
      if (!r) return;
      const gl = this.gl;
      gl.deleteTexture(r.tex);
      gl.deleteFramebuffer(r.fb);
      if (r.rb) gl.deleteRenderbuffer(r.rb);
    }

    /**
     * 舞台画面接收缓冲：一个带颜色+模板的离屏帧缓冲（FBO）。
     * scratch-render 被重定向到这里渲染（见 _hookRenderer），我们再从它的颜色纹理做后期处理。
     * stencil 与 scratch-render 的 contextAttribs {stencil:true} 对齐，避免角色裁剪错乱。
     */
    _ensureCapture(w, h) {
      if (this.capture && this.capture.w === w && this.capture.h === h) return;
      this._freeRT(this.capture);
      this.capture = this._makeRT(w, h, true);
      const gl = this.gl;
      const st = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      this.capture.ok = (st === gl.FRAMEBUFFER_COMPLETE);
      if (!this.capture.ok) {
        this.captureBroken = true;
        console.error('[雷神] 捕获帧缓冲不完整(0x' + st.toString(16) + ')，已停用特效以免黑屏。');
      }
    }

    /** 记录一条错误：既打控制台，也存下来供"引擎状态"积木显示（很多编辑器没有 F12 控制台）。 */
    _report(msg, err) {
      this.lastError = msg + (err ? ('：' + (err && err.message ? err.message : err)) : '');
      try { console.error('[雷神] ' + this.lastError); } catch (e) { /* 无控制台 */ }
    }

    /** 后期处理用的中间缓冲，可按倍率缩放 */
    _ensureTargets(w, h) {
      const scale = Math.max(0.2, Math.min(1, this.adv.renderScale));
      const tw = Math.max(2, Math.floor(w * scale));
      const th = Math.max(2, Math.floor(h * scale));
      if (!this._rtDirty && this.rt.a && this.rt.a.w === tw && this.rt.a.h === th) return;
      Object.keys(this.rt).forEach((k) => this._freeRT(this.rt[k]));
      const half = (n) => Math.max(2, n >> 1);
      this.rt = {
        a: this._makeRT(tw, th, false),
        b: this._makeRT(tw, th, false),
        c: this._makeRT(half(tw), half(th), false),
        d: this._makeRT(half(tw), half(th), false),
        t0: this._makeRT(tw, th, false),
        t1: this._makeRT(tw, th, false)
      };
      this.trailFlip = false;
      this._rtDirty = false;
    }

    invalidateTargets() { this._rtDirty = true; }

    /* ---------------- 渲染器挂钩 ---------------- */

    /**
     * 挂钩 scratch-render 的 draw —— 全屏后期特效的入口。
     *
     * ★ 所有黑屏 Bug 的总根源：Scratch / TurboWarp 的 RenderWebGL.draw() 第一行是
     *       draw () { if (!this.dirty) { return; } ... }
     *   ——舞台内容没变化时，整帧跳过绘制，什么都不画。由此派生两种黑屏：
     *
     *   (a)「一开特效就黑屏」：若我们从屏幕 readPixels 取画面，而 WebGL 上下文是
     *       preserveDrawingBuffer:false，屏幕在被合成后内容即为未定义（通常全黑）；
     *       此时 draw 又因为不脏而跳过重绘，于是读到黑 → 后期管线把黑糊满屏幕 →
     *       下一帧依旧不脏 → 永久黑屏。
     *
     *   (b)「加载扩展后黑屏」：若我们重定向到离屏 FBO 却不管 dirty，刚加载时这个
     *       FBO 是全新的空白（黑），而舞台不脏没人去填它 → 屏幕黑；直到点绿旗让
     *       舞台变脏、真正重绘一次才恢复。
     *
     * 因此本实现同时做三件事：
     *   1) 把 scratch-render 的"屏幕输出"重定向到我们的离屏 capture FBO。
     *      FBO 内容会一直保留，比读屏可靠得多（屏幕缓冲随时可能被清空）。
     *   2) 每个需要特效的帧，先把 renderer.dirty 置 true，强制 scratch-render
     *      真正重绘一遍到 capture —— 根治上面的 (a) 与 (b)。
     *   3) 按需捕获：没有特效时完全不介入，scratch-render 保持 100% 原生行为
     *      （连它自己的 dirty 跳帧优化都不打扰），所以不可能因为我们而黑屏。
     */
    _hookRenderer() {
      const renderer = this.renderer;
      // __leishenHooked 是我们自己挂的属性，RenderWebGL 类型上没有，这里做局部断言
      if (!renderer || /** @type {any} */ (renderer).__leishenHooked) return;
      const self = this;
      const gl = this.gl;
      const realBind = this._realBind;
      const originalDraw = renderer.draw;
      if (typeof originalDraw !== 'function') {
        this._report('渲染器没有 draw 方法，无法挂钩');
        return;
      }

      // 重定向：捕获模式下，scratch-render 绑定"屏幕(null)"时实际绑到 capture FBO。
      // 顺带统计命中次数——用来判断 originalDraw 究竟有没有真的画
      //（被 dirty 优化跳过时它一次帧缓冲都不会绑）。
      const wrapped = function (t, fb) {
        if (fb === null && self.captureActive && self.capture && self.capture.ok) {
          self._bindHits++;
          realBind(t, self.capture.fb);
        } else {
          realBind(t, fb);
        }
      };
      gl.bindFramebuffer = wrapped;

      // 强制 scratch-render 下一次 draw 真正重绘，绕过它的 dirty 跳帧优化。
      // 原版 scratch-render 没有 dirty 字段时，这里只是加了个无害的属性。
      const markDirty = function () {
        try { renderer.dirty = true; } catch (e) { /* 只读则忽略 */ }
      };
      this._markDirty = markDirty;
      this.hasDirtyFlag = (typeof renderer.dirty !== 'undefined');

      renderer.draw = function () {
        const p = self._resolve();
        const engineMode = self.ready && !self.failed && !self.captureBroken;
        const wantEffects = engineMode && self.enabled && self._isActive(p);

        if (!wantEffects) {
          // —— 无特效：一点都不介入，舞台完全交还 scratch-render ——
          const wasActive = self.captureActive;
          self.captureActive = false;
          self._stopLoop();
          if (wasActive) {
            // 特效刚结束。此刻屏幕上还留着最后一帧特效画面，而 scratch 很可能
            // 因为"不脏"而不重绘 → 会卡住。所以先把干净舞台直出到屏幕立即恢复，
            // 再置脏让 scratch 下一帧自己接管。
            if (self.captureValid && self.capture && self.capture.ok) {
              try { self._passBlit(self.capture.tex, null); } catch (e) { /* 无能为力 */ }
            }
            markDirty();
          }
          // 把帧缓冲/视口/裁剪等 GL 状态复位成屏幕默认，避免后期管线的残留状态
          // 让 scratch 把舞台画到错误区域。
          realBind(gl.FRAMEBUFFER, null);
          gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
          gl.disable(gl.SCISSOR_TEST);
          gl.disable(gl.STENCIL_TEST);
          gl.disable(gl.DEPTH_TEST);
          gl.disable(gl.BLEND);
          return originalDraw.apply(this, arguments);
        }

        // —— 有特效：捕获干净舞台 → 跑后期管线 → 输出到屏幕 ——
        const w = gl.drawingBufferWidth;
        const h = gl.drawingBufferHeight;
        if (w < 2 || h < 2) {
          self.captureActive = false;
          realBind(gl.FRAMEBUFFER, null);
          return originalDraw.apply(this, arguments);
        }
        self.W = w;
        self.H = h;
        self._ensureCapture(w, h);
        if (!self.capture || !self.capture.ok) {
          // 捕获缓冲建不出来：降级为原生绘制，宁可没特效也绝不黑屏。
          self.captureBroken = true;
          self.captureActive = false;
          realBind(gl.FRAMEBUFFER, null);
          return originalDraw.apply(this, arguments);
        }

        self.captureActive = true;
        // ★ 关键一行：强制置脏。否则 draw() 会因为"画面没变化"整帧跳过，
        //   capture 里留着空白/过期内容，特效叠上去就是黑屏。
        markDirty();
        self._bindHits = 0;
        realBind(gl.FRAMEBUFFER, self.capture.fb);
        const ret = originalDraw.apply(this, arguments);
        if (self._bindHits > 0) {
          // originalDraw 确实画了（至少绑过一次帧缓冲），capture 内容是新鲜的
          self.captureValid = true;
          self.frames++;
        }

        if (!self.captureValid) {
          // 兜底：capture 从未被真正填过，绝不能把空白糊到屏幕上。
          // 退出捕获，让 scratch 下一帧正常画屏幕。
          self.captureActive = false;
          realBind(gl.FRAMEBUFFER, null);
          markDirty();
          return ret;
        }

        try {
          self._runPipeline(p);
          self._startLoop();
        } catch (e) {
          self.failed = true;
          self._report('后期处理出错，已停用引擎', e);
          // 出错也要把干净舞台还给屏幕，绝不留黑屏
          try { self._passBlit(self.capture.tex, null); } catch (e2) { /* 无能为力 */ }
          self.captureActive = false;
          markDirty();
        }
        return ret;
      };
      /** @type {any} */ (renderer).__leishenHooked = true;
      this._originalDraw = originalDraw;
    }

    /* ---------------- 参数解析 ---------------- */

    now() { return (performance.now() - this.startTime) / 1000; }

    _resolve() {
      const p = {};
      EFFECT_LIST.forEach((e) => { p[e[1]] = this.params[e[1]]; });
      const t = performance.now();
      let flash = null;
      const shocks = [];
      const keep = [];

      for (let i = 0; i < this.transients.length; i++) {
        const tr = this.transients[i];
        const prog = (t - tr.t0) / (tr.dur * 1000);
        if (prog >= 1) continue;
        keep.push(tr);
        const k = 1 - prog;
        const kk = k * k;
        const s = tr.power;
        if (tr.kind === 'shake') {
          p.shake += s * k;
        } else if (tr.kind === 'glitch') {
          p.glitch += s * k;
          p.rgbSplit += s * 0.4 * k;
        } else if (tr.kind === 'flash') {
          const a = Math.min(1, (s / 100) * kk);
          if (!flash || a > flash[3]) flash = [tr.color[0], tr.color[1], tr.color[2], a];
        } else if (tr.kind === 'hit') {
          p.shake += s * k;
          p.glitch += s * 0.55 * kk;
          p.rgbSplit += s * 0.5 * kk;
          p.zoomBlur += s * 0.45 * kk;
          p.vignette += s * 0.5 * kk;
          const a = Math.min(0.7, (s / 100) * kk * 0.75);
          if (!flash || a > flash[3]) flash = [1, 0.12, 0.1, a];
        } else if (tr.kind === 'shock') {
          shocks.push([tr.x, tr.y, prog * 1.1, (s / 100) * (1 - prog)]);
        }
      }
      this.transients = keep;
      p.__flash = flash || [0, 0, 0, 0];
      p.__shocks = shocks;
      return p;
    }

    _isActive(p) {
      if (this.customEnabled && this.customProgram) return true;
      for (let i = 0; i < EFFECT_LIST.length; i++) {
        if (Math.abs(p[EFFECT_LIST[i][1]]) > 0.001) return true;
      }
      if (p.__flash[3] > 0.001) return true;
      const shks = p.__shocks || [];
      for (let i = 0; i < shks.length; i++) {
        if (shks[i][3] > 0.001) return true;
      }
      return false;
    }

    /* ---------------- 帧流程 ---------------- */

    /** 返回 true 表示这一帧需要走后期处理 */
    beginFrame() {
      if (!this.ready || !this.enabled || this.failed) return false;
      if (this.captureBroken) return false; // 降级：不后处理，画面照常显示
      const gl = this.gl;
      const w = gl.drawingBufferWidth;
      const h = gl.drawingBufferHeight;
      if (w < 2 || h < 2) return false;
      const p = this._resolve();
      if (!this._isActive(p)) {
        this.captureValid = false;
        this._stopLoop();
        return false;
      }
      this.W = w;
      this.H = h;
      this._ensureCapture(w, h);
      this._pending = p;
      return true;
    }

    endFrame() {
      this.captureValid = true;
      try {
        this._runPipeline(this._pending);
      } catch (e) {
        this.failed = true;
        console.error('[雷神] 后期处理出错，已停用引擎：', e);
        try { this._passBlit(this.capture.tex, null); } catch (e2) { /* 无能为力 */ }
        return;
      }
      this._startLoop();
    }

    /** 舞台是 30fps 时也让特效以 60fps 刷新 */
    _startLoop() {
      // 只在需要 60fps 平滑刷新时启动。特效停止的那一帧会由本循环
      // 把干净舞台直出到屏幕并退出捕获模式，随后循环结束。
      if (!this.adv.smooth) return;
      if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = 0; }
      if (!this.ready || !this.enabled || this.failed) return;
      if (!this.captureValid || !this.capture) return;
      const tick = () => {
        this.rafId = 0;
        if (!this.ready || !this.enabled || this.failed) return;
        if (!this.captureValid || !this.capture) return;
        const p = this._resolve();
        if (!this._isActive(p)) {
          // 特效停止：把最后一帧干净舞台直出到屏幕，退出捕获模式，
          // 并置脏让 scratch-render 下一帧真正重绘接管屏幕
          //（不置脏的话它会因为"画面没变化"而不重绘，屏幕就卡住了）。
          this.captureActive = false;
          if (this.captureValid && this.capture && this.capture.ok) {
            try { this._passBlit(this.capture.tex, null); } catch (e) { /* 无能为力 */ }
          }
          this._realBind(this.gl.FRAMEBUFFER, null);
          if (this._markDirty) this._markDirty();
          return;
        }
        try {
          this._runPipeline(p);
        } catch (e) {
          this.failed = true;
          this._report('平滑刷新出错', e);
          // 出错兜底：把干净舞台还给屏幕，绝不留黑屏
          try { this._passBlit(this.capture.tex, null); } catch (e2) { /* 无能为力 */ }
          this.captureActive = false;
          if (this._markDirty) this._markDirty();
          return;
        }
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);
    }

    _stopLoop() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = 0;
      }
    }

    /* ---------------- 管线 ---------------- */

    _bind(rt) {
      const gl = this.gl;
      if (rt) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, rt.fb);
        gl.viewport(0, 0, rt.w, rt.h);
      } else {
        // 屏幕目标必须用 _realBind 绕过重定向，否则会被转到 capture FBO，
        // 特效结果就写不到屏幕上 → 黑屏。
        this._realBind(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.W, this.H);
      }
    }

    _use(prog) {
      const gl = this.gl;
      gl.useProgram(prog.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
      const a = prog.aPos < 0 ? 0 : prog.aPos;
      gl.enableVertexAttribArray(a);
      gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    }

    _tex(prog, name, tex, unit) {
      const gl = this.gl;
      const loc = prog.loc[name];
      if (!loc) return;
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(loc, unit);
    }

    _u1f(prog, n, a) { const l = prog.loc[n]; if (l) this.gl.uniform1f(l, a); }
    _u2f(prog, n, a, b) { const l = prog.loc[n]; if (l) this.gl.uniform2f(l, a, b); }
    _u3f(prog, n, a, b, c) { const l = prog.loc[n]; if (l) this.gl.uniform3f(l, a, b, c); }
    _u4f(prog, n, a, b, c, d) { const l = prog.loc[n]; if (l) this.gl.uniform4f(l, a, b, c, d); }
    _draw() { this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4); }

    _runPipeline(p) {
      const gl = this.gl;
      if (!p || this.W < 2 || this.H < 2) return;
      this._ensureTargets(this.W, this.H);

      gl.disable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.STENCIL_TEST);
      gl.disable(gl.SCISSOR_TEST);
      gl.disable(gl.CULL_FACE);
      gl.colorMask(true, true, true, true);

      const chain = [];
      const blurAmt = Math.max(p.blur, p.noiseBlur);
      if (blurAmt > 0.001) chain.push('blur');
      if (p.bloom > 0.001) chain.push('bloom');
      chain.push('uber');
      if (p.trail > 0.001) chain.push('trail');
      if (this.customEnabled && this.customProgram) chain.push('custom');
      // 末尾必须有一次 blit 到屏幕（屏幕目标 dst = null）
      if (chain[chain.length - 1] !== 'blit') chain.push('blit');

      let src = this.capture.tex;
      for (let i = 0; i < chain.length; i++) {
        const isLast = i === chain.length - 1;
        const dst = isLast ? null : (src === this.rt.a.tex ? this.rt.b : this.rt.a);
        const kind = chain[i];
        if (kind === 'blur') {
          src = this._passBlur(src, blurAmt, p.noiseBlur / 100);
        } else if (kind === 'bloom') {
          this._passBloom(src, dst, p.bloom / 100);
          src = dst ? dst.tex : null;
        } else if (kind === 'uber') {
          this._passUber(src, dst, p);
          src = dst ? dst.tex : null;
        } else if (kind === 'trail') {
          src = this._passTrail(src, p.trail / 100);
        } else if (kind === 'custom') {
          this._passCustom(src, dst);
          src = dst ? dst.tex : null;
        } else if (kind === 'blit') {
          this._passBlit(src, dst);
          src = dst ? dst.tex : null;
        }
      }

      // 清理：管线末尾的 blit 已经把真实绑定停在屏幕（null），供 scratch 下一帧正常画屏幕；
      // 这里只解绑顶点/纹理/着色器，不要动 FRAMEBUFFER 绑定与 viewport（scratch 会重设）。
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.useProgram(null);
    }

    _passBlit(src, dst) {
      const gl = this.gl;
      const prog = this.programs.blit;
      if (!prog) return;
      // 全屏拷贝不需要任何混合/深度/模板——关掉它们，避免 scratch 残留的 GL 状态
      // 把拷贝结果污染成黑。
      gl.disable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.STENCIL_TEST);
      gl.disable(gl.SCISSOR_TEST);
      gl.colorMask(true, true, true, true);
      if (!dst) {
        // 屏幕目标：直接画到真正的默认帧缓冲（本方案里 scratch 本来就画在屏幕上）。
        this._realBind(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.W, this.H);
      } else {
        this._bind(dst);
      }
      this._use(prog);
      this._tex(prog, 'u_tex', src, 0);
      this._draw();
    }

    /** 返回模糊结果所在的纹理（可能是 rt.a 或 rt.b） */
    _passBlur(src, amount, jitter) {
      const prog = this.programs.blur;
      if (!prog) return src;
      const rt = this.rt;
      const quality = Math.max(1, Math.min(4, Math.round(this.adv.blurQuality)));
      const tx = 1 / rt.a.w;
      const ty = 1 / rt.a.h;
      let input = src;
      for (let i = 0; i < quality; i++) {
        const radius = (amount / 100) * 9 * Math.pow(1.85, i);
        const tmp = input === rt.a.tex ? rt.b : rt.a;
        this._bind(tmp);
        this._use(prog);
        this._tex(prog, 'u_tex', input, 0);
        this._u4f(prog, 'u_cfg', tx, ty, radius, jitter);
        this._u2f(prog, 'u_dir', 1, 0);
        this._u1f(prog, 'u_time', this.now());
        this._draw();

        const out = tmp === rt.a ? rt.b : rt.a;
        this._bind(out);
        this._use(prog);
        this._tex(prog, 'u_tex', tmp.tex, 0);
        this._u4f(prog, 'u_cfg', tx, ty, radius, jitter);
        this._u2f(prog, 'u_dir', 0, 1);
        this._u1f(prog, 'u_time', this.now() + 0.37);
        this._draw();
        input = out.tex;
      }
      return input;
    }

    _passBloom(src, dst, amount) {
      const rt = this.rt;
      const bright = this.programs.bright;
      const blur = this.programs.blur;
      const combine = this.programs.bloom;
      if (!bright || !blur || !combine) { this._passBlit(src, dst); return; }

      const th = Math.max(0, Math.min(0.99, this.adv.bloomThreshold / 100));
      this._bind(rt.c);
      this._use(bright);
      this._tex(bright, 'u_tex', src, 0);
      this._u1f(bright, 'u_threshold', th);
      this._draw();

      const tx = 1 / rt.c.w;
      const ty = 1 / rt.c.h;
      for (let i = 0; i < 2; i++) {
        const r = 2.5 + i * 4.5;
        this._bind(rt.d);
        this._use(blur);
        this._tex(blur, 'u_tex', rt.c.tex, 0);
        this._u4f(blur, 'u_cfg', tx, ty, r, 0);
        this._u2f(blur, 'u_dir', 1, 0);
        this._u1f(blur, 'u_time', 0);
        this._draw();

        this._bind(rt.c);
        this._use(blur);
        this._tex(blur, 'u_tex', rt.d.tex, 0);
        this._u4f(blur, 'u_cfg', tx, ty, r, 0);
        this._u2f(blur, 'u_dir', 0, 1);
        this._u1f(blur, 'u_time', 0);
        this._draw();
      }

      this._bind(dst);
      this._use(combine);
      this._tex(combine, 'u_tex', src, 0);
      this._tex(combine, 'u_bloom', rt.c.tex, 1);
      this._u1f(combine, 'u_amount', amount * 1.7);
      this._draw();
    }

    /** 返回拖影结果纹理 */
    _passTrail(src, amount) {
      const prog = this.programs.trail;
      if (!prog) return src;
      const rt = this.rt;
      const prev = this.trailFlip ? rt.t1 : rt.t0;
      const next = this.trailFlip ? rt.t0 : rt.t1;
      this.trailFlip = !this.trailFlip;
      this._bind(next);
      this._use(prog);
      this._tex(prog, 'u_tex', src, 0);
      this._tex(prog, 'u_prev', prev.tex, 1);
      this._u1f(prog, 'u_amount', 0.55 + amount * 0.44);
      this._draw();
      return next.tex;
    }

    _passUber(src, dst, p) {
      const prog = this.programs.uber;
      if (!prog) { this._passBlit(src, dst); return; }
      const W = dst ? dst.w : this.W;
      const H = dst ? dst.h : this.H;
      this._bind(dst);
      this._use(prog);
      this._tex(prog, 'u_tex', src, 0);

      let sx = 0;
      let sy = 0;
      if (p.shake > 0.001) {
        const amp = Math.min(p.shake, 200) / 100 * 0.055;
        sx = (Math.random() * 2 - 1) * amp;
        sy = (Math.random() * 2 - 1) * amp;
      }

      this._u4f(prog, 'u_res', W, H, 1 / W, 1 / H);
      this._u4f(prog, 'u_p0',
        (p.pixelate / 100) * 48,
        p.fisheye / 100,
        (p.swirl / 100) * 6,
        p.zoomBlur / 100);
      this._u4f(prog, 'u_p1',
        p.rgbSplit / 100,
        Math.min(1, p.glitch / 100),
        (p.noise / 100) * 0.75,
        Math.min(1, p.scanline / 100));
      this._u4f(prog, 'u_p2',
        Math.min(1, p.vignette / 100),
        p.brightness / 100,
        p.contrast / 100,
        p.saturation / 100);
      this._u4f(prog, 'u_p3',
        (p.hue % 360) * Math.PI / 180,
        Math.min(1, p.invert / 100),
        (p.wave / 100) * 55,
        this.adv.waveFreq);
      this._u4f(prog, 'u_p4', this.adv.waveSpeed, sx, sy, this.now());
      this._u4f(prog, 'u_p5', this.adv.glitchSpeed, 0, 0, 0);
      // 多个冲击波：一次性上传整个数组（u_shocks 基址 = 8 个 vec4）
      const shks = p.__shocks || [];
      const shockArr = new Float32Array(MAX_SHOCKS * 4);
      for (let i = 0; i < MAX_SHOCKS; i++) {
        const s = shks[i] || [0.5, 0.5, 0, 0];
        shockArr[i * 4] = s[0];
        shockArr[i * 4 + 1] = s[1];
        shockArr[i * 4 + 2] = s[2];
        shockArr[i * 4 + 3] = s[3];
      }
      const shockLoc = this.programs.uber.loc['u_shocks'];
      if (shockLoc) this.gl.uniform4fv(shockLoc, shockArr);
      // 四个新特效打包进 u_fx（x=万花筒 y=液态 z=棱镜 w=故障色块）
      this._u4f(prog, 'u_fx',
        Math.min(1, p.kaleido / 100),
        Math.min(1, p.liquid / 100),
        Math.min(1, p.prism / 100),
        Math.min(1, p.blockGlitch / 100));
      this._u4f(prog, 'u_tint', this.tintColor[0], this.tintColor[1], this.tintColor[2], Math.min(1, p.tintAmount / 100));
      this._u4f(prog, 'u_flash', p.__flash[0], p.__flash[1], p.__flash[2], p.__flash[3]);
      this._draw();
    }

    _passCustom(src, dst) {
      const gl = this.gl;
      const prog = this.customProgram;
      if (!prog) { this._passBlit(src, dst); return; }
      const W = dst ? dst.w : this.W;
      const H = dst ? dst.h : this.H;
      this._bind(dst);
      this._use(prog);
      this._tex(prog, 'u_tex', src, 0);
      this._tex(prog, 'iChannel0', src, 0);

      const t = this.now();
      let mx = 0.5;
      let my = 0.5;
      try {
        const mouse = runtime.ioDevices && runtime.ioDevices.mouse;
        if (mouse && mouse.getScratchX) {
          mx = (mouse.getScratchX() + 240) / 480;
          my = (mouse.getScratchY() + 180) / 360;
        }
      } catch (e) { /* 忽略 */ }

      this._u2f(prog, 'u_resolution', W, H);
      this._u2f(prog, 'u_texel', 1 / W, 1 / H);
      this._u1f(prog, 'u_time', t);
      this._u2f(prog, 'u_mouse', mx, my);
      this._u3f(prog, 'iResolution', W, H, 1);
      this._u1f(prog, 'iTime', t);
      this._u1f(prog, 'iTimeDelta', 1 / 60);
      this._u1f(prog, 'iFrame', Math.floor(t * 60));
      this._u4f(prog, 'iMouse', mx * W, my * H, 0, 0);

      const nameMap = prog.nameMap || {};
      for (let i = 0; i < prog.uniforms.length; i++) {
        const info = prog.uniforms[i];
        if (BUILTIN_UNIFORMS.indexOf(info.name) >= 0) continue;
        // 中文变量名在编译时被换成了安全名，这里换回去查用户设的值
        const userName = nameMap[info.name] || info.name;
        let raw = this.uniformValues.get(userName);
        if (raw === undefined && userName !== info.name) raw = this.uniformValues.get(info.name);
        if (raw === undefined) continue;
        const loc = prog.loc[info.name];
        if (!loc) continue;
        const nums = String(raw).split(/[,\s]+/).filter((s) => s.length)
          .map((s) => { const n = Number(s); return isNaN(n) ? 0 : n; });
        const g = (i2) => nums[i2] || 0;
        if (info.type === gl.FLOAT) gl.uniform1f(loc, g(0));
        else if (info.type === gl.FLOAT_VEC2) gl.uniform2f(loc, g(0), g(1));
        else if (info.type === gl.FLOAT_VEC3) gl.uniform3f(loc, g(0), g(1), g(2));
        else if (info.type === gl.FLOAT_VEC4) gl.uniform4f(loc, g(0), g(1), g(2), g(3));
        else if (info.type === gl.INT || info.type === gl.BOOL) gl.uniform1i(loc, Math.round(g(0)));
      }
      this._draw();
    }

    /* ---------------- 自定义着色器 ---------------- */

    compileCustom(source) {
      this.customSource = String(source == null ? '' : source);
      this.customError = '';
      if (this.customProgram) {
        this.gl.deleteProgram(this.customProgram.program);
        this.customProgram = null;
      }
      const src = this.customSource.trim();
      if (!src) {
        this.customError = Scratch.translate({ id: 'err.empty', default: 'Shader code is empty' });
        return false;
      }
      this._lastError = '';
      const built = buildCustomSource(src);
      const prog = this._program(VERT, built.source, 'custom', built.nameMap);
      if (!prog) {
        this.customError = demangleLog(this._lastError, built.nameMap) || Scratch.translate({ id: 'err.unknown', default: 'Unknown error' });
        return false;
      }
      prog.nameMap = built.nameMap;
      this.customProgram = prog;
      return true;
    }

    resetAll() {
      EFFECT_LIST.forEach((e) => { this.params[e[1]] = 0; });
      this.transients.length = 0;
      this.customEnabled = false;
      this._stopLoop();
    }
  }

  const fx = new FXEngine();

  /* ==========================================================================
   * 四、着色器编辑器弹窗
   * ========================================================================== */

  let editorEl = null;
  let editorMsg = null;
  let editorArea = null;

  function openShaderEditor() {
    if (editorEl) {
      editorEl.style.display = 'flex';
      editorArea.value = fx.customSource || DEFAULT_SHADER;
      return;
    }
    const wrap = document.createElement('div');
    wrap.id = 'leishen-shader-editor';
    wrap.style.cssText = 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483600;' +
      'background:rgba(10,8,24,.62);display:flex;align-items:center;justify-content:center;' +
      'font-family:"Microsoft YaHei",system-ui,sans-serif;';

    const panel = document.createElement('div');
    panel.style.cssText = 'width:min(900px,92vw);height:min(660px,88vh);background:#181528;color:#e9e6ff;' +
      'border:1px solid #6a2ce0;border-radius:14px;box-shadow:0 18px 60px rgba(0,0,0,.55);' +
      'display:flex;flex-direction:column;overflow:hidden;';

    const head = document.createElement('div');
    head.style.cssText = 'padding:12px 16px;background:linear-gradient(90deg,#6a2ce0,#9b45f0);font-weight:700;';
    head.textContent = Scratch.translate({ id: 'editor.title', default: '⚡ LeiShen · Custom Shader Editor' });

    const ta = document.createElement('textarea');
    ta.spellcheck = false;
    ta.style.cssText = 'flex:1;padding:14px;background:#100e1c;color:#c8f7ff;border:0;outline:none;resize:none;' +
      'font-family:Consolas,"Cascadia Code",monospace;font-size:13px;line-height:1.55;white-space:pre;';
    ta.value = fx.customSource || DEFAULT_SHADER;

    const msg = document.createElement('div');
    msg.style.cssText = 'padding:8px 14px;font-size:12px;min-height:20px;white-space:pre-wrap;' +
      'max-height:140px;overflow:auto;color:#9ad9ff;background:#12101f;';
    msg.textContent = Scratch.translate({ id: 'editor.hint', default: 'Available: v_uv / u_tex / u_time / u_resolution / u_mouse; you can also paste Shadertoy mainImage code directly.' });

    const bar = document.createElement('div');
    bar.style.cssText = 'padding:10px 14px;display:flex;gap:10px;justify-content:flex-end;background:#1d1930;';
    const mkBtn = function (text, bg) {
      const b = document.createElement('button');
      b.textContent = text;
      b.style.cssText = 'padding:8px 18px;border:0;border-radius:8px;cursor:pointer;font-size:13px;' +
        'font-weight:600;color:#fff;background:' + bg + ';';
      return b;
    };
    const bDemo = mkBtn(Scratch.translate({ id: 'editor.demo', default: 'Demo' }), '#3d3760');
    const bApply = mkBtn(Scratch.translate({ id: 'editor.apply', default: 'Apply & Enable' }), '#6a2ce0');
    const bOff = mkBtn(Scratch.translate({ id: 'editor.off', default: 'Disable Shader' }), '#3d3760');
    const bClose = mkBtn(Scratch.translate({ id: 'editor.close', default: 'Close' }), '#3d3760');

    bDemo.onclick = function () { ta.value = DEFAULT_SHADER; };
    bApply.onclick = function () {
      if (fx.compileCustom(ta.value)) {
        fx.customEnabled = true;
        msg.style.color = '#8ef7a8';
        msg.textContent = Scratch.translate({ id: 'editor.ok', default: '✅ Compiled successfully, custom shader enabled.' });
      } else {
        msg.style.color = '#ff8b8b';
        msg.textContent = Scratch.translate({ id: 'editor.fail', default: '❌ Compilation failed:\n' }) + fx.customError;
      }
    };
    bOff.onclick = function () {
      fx.customEnabled = false;
      msg.style.color = '#9ad9ff';
      msg.textContent = Scratch.translate({ id: 'editor.disabled', default: 'Custom shader disabled.' });
    };
    bClose.onclick = function () { wrap.style.display = 'none'; };

    bar.appendChild(bDemo);
    bar.appendChild(bApply);
    bar.appendChild(bOff);
    bar.appendChild(bClose);
    panel.appendChild(head);
    panel.appendChild(ta);
    panel.appendChild(msg);
    panel.appendChild(bar);
    wrap.appendChild(panel);
    wrap.addEventListener('mousedown', function (e) { if (e.target === wrap) wrap.style.display = 'none'; });
    document.body.appendChild(wrap);
    editorEl = wrap;
    editorMsg = msg;
    editorArea = ta;
  }

  /* ==========================================================================
   * 五、积木
   * ========================================================================== */

  const AT = Scratch.ArgumentType;
  const BT = Scratch.BlockType;
  // 注意：构建脚本(development/builder.js)会静态提取所有 Scratch.translate({...}) 调用，
  // 因此每个调用的 id 和 default 都必须是字符串字面量，不能用变量或字符串拼接。

  class LeiShen {
    getInfo() {
      return {
        id: 'leishen',
        name: Scratch.translate({ id: 'extensionName', default: 'LeiShen FX' }),
        color1: '#6a2ce0',
        color2: '#5423b8',
        color3: '#41198f',
        description: Scratch.translate({ id: 'extensionDescription', default: 'Fullscreen post-processing effects: blur, glitch, bloom, presets and custom shaders.' }),
        blocks: [
          { blockType: BT.LABEL, text: Scratch.translate({ id: 'label.basic', default: 'Basic Effects' }) },
          {
            opcode: 'setEffect',
            blockType: BT.COMMAND,
            text: Scratch.translate({ id: 'setEffect', default: 'set fullscreen effect [EFFECT] to [VALUE]' }),
            arguments: {
              EFFECT: { type: AT.STRING, menu: 'EFFECT' },
              VALUE: { type: AT.NUMBER, defaultValue: 50 }
            }
          },
          {
            opcode: 'changeEffect',
            blockType: BT.COMMAND,
            text: Scratch.translate({ id: 'changeEffect', default: 'change fullscreen effect [EFFECT] by [VALUE]' }),
            arguments: {
              EFFECT: { type: AT.STRING, menu: 'EFFECT' },
              VALUE: { type: AT.NUMBER, defaultValue: 10 }
            }
          },
          {
            opcode: 'getEffect',
            blockType: BT.REPORTER,
            text: Scratch.translate({ id: 'getEffect', default: 'value of fullscreen effect [EFFECT]' }),
            arguments: { EFFECT: { type: AT.STRING, menu: 'EFFECT' } }
          },
          {
            opcode: 'setTint',
            blockType: BT.COMMAND,
            text: Scratch.translate({ id: 'setTint', default: 'set tint color to [COLOR] intensity [VALUE]' }),
            arguments: {
              COLOR: { type: AT.COLOR, defaultValue: '#ff3366' },
              VALUE: { type: AT.NUMBER, defaultValue: 50 }
            }
          },
          { opcode: 'clearAll', blockType: BT.COMMAND, text: Scratch.translate({ id: 'clearAll', default: 'clear all effects' }) },
          {
            opcode: 'setEnabled',
            blockType: BT.COMMAND,
            text: Scratch.translate({ id: 'setEnabled', default: '[ONOFF] effect engine' }),
            arguments: { ONOFF: { type: AT.STRING, menu: 'ONOFF' } }
          },
          { opcode: 'isEnabled', blockType: BT.BOOLEAN, text: Scratch.translate({ id: 'isEnabled', default: 'is effect engine on?' }) },

          '---',
          { blockType: BT.LABEL, text: Scratch.translate({ id: 'label.hit', default: 'Impact FX (auto fade)' }) },
          {
            opcode: 'hit',
            blockType: BT.COMMAND,
            text: Scratch.translate({ id: 'hit', default: 'hit effect strength [POWER] duration [SEC] sec' }),
            arguments: {
              POWER: { type: AT.NUMBER, defaultValue: 70 },
              SEC: { type: AT.NUMBER, defaultValue: 0.35 }
            }
          },
          {
            opcode: 'shakeOnce',
            blockType: BT.COMMAND,
            text: Scratch.translate({ id: 'shakeOnce', default: 'shake screen strength [POWER] duration [SEC] sec' }),
            arguments: {
              POWER: { type: AT.NUMBER, defaultValue: 60 },
              SEC: { type: AT.NUMBER, defaultValue: 0.4 }
            }
          },
          {
            opcode: 'glitchOnce',
            blockType: BT.COMMAND,
            text: Scratch.translate({ id: 'glitchOnce', default: 'glitch once strength [POWER] duration [SEC] sec' }),
            arguments: {
              POWER: { type: AT.NUMBER, defaultValue: 80 },
              SEC: { type: AT.NUMBER, defaultValue: 0.25 }
            }
          },
          {
            opcode: 'flashOnce',
            blockType: BT.COMMAND,
            text: Scratch.translate({ id: 'flashOnce', default: 'flash color [COLOR] strength [POWER] duration [SEC] sec' }),
            arguments: {
              COLOR: { type: AT.COLOR, defaultValue: '#ffffff' },
              POWER: { type: AT.NUMBER, defaultValue: 90 },
              SEC: { type: AT.NUMBER, defaultValue: 0.3 }
            }
          },
          {
            opcode: 'shockwave',
            blockType: BT.COMMAND,
            text: Scratch.translate({ id: 'shockwave', default: 'shockwave from x [X] y [Y] strength [POWER] duration [SEC] sec' }),
            arguments: {
              X: { type: AT.NUMBER, defaultValue: 0 },
              Y: { type: AT.NUMBER, defaultValue: 0 },
              POWER: { type: AT.NUMBER, defaultValue: 80 },
              SEC: { type: AT.NUMBER, defaultValue: 0.7 }
            }
          },
          { opcode: 'stopTransients', blockType: BT.COMMAND, text: Scratch.translate({ id: 'stopTransients', default: 'stop all one-time effects' }) },

          '---',
          { blockType: BT.LABEL, text: Scratch.translate({ id: 'label.preset', default: 'Presets' }) },
          {
            opcode: 'applyPreset',
            blockType: BT.COMMAND,
            text: Scratch.translate({ id: 'applyPreset', default: 'apply preset [PRESET]' }),
            arguments: { PRESET: { type: AT.STRING, menu: 'PRESET' } }
          },

          '---',
          { blockType: BT.LABEL, text: Scratch.translate({ id: 'label.shader', default: 'Custom Shader' }) },
          { blockType: BT.BUTTON, text: Scratch.translate({ id: 'openEditor', default: '⚡ Open shader editor' }), func: 'openEditor' },
          { opcode: 'openEditorBlock', blockType: BT.COMMAND, text: Scratch.translate({ id: 'openEditorBlock', default: 'open shader editor' }) },
          {
            opcode: 'setShader',
            blockType: BT.COMMAND,
            text: Scratch.translate({ id: 'setShader', default: 'set custom shader to [CODE]' }),
            arguments: {
              CODE: {
                type: AT.STRING,
                defaultValue: 'void main(){ gl_FragColor = vec4(1.0 - texture2D(u_tex, v_uv).rgb, 1.0); }'
              }
            }
          },
          {
            opcode: 'shaderOnOff',
            blockType: BT.COMMAND,
            text: Scratch.translate({ id: 'shaderOnOff', default: '[ONOFF] custom shader' }),
            arguments: { ONOFF: { type: AT.STRING, menu: 'ONOFF' } }
          },
          {
            opcode: 'setUniform',
            blockType: BT.COMMAND,
            text: Scratch.translate({ id: 'setUniform', default: 'set shader uniform [NAME] to [VALUE]' }),
            arguments: {
              NAME: { type: AT.STRING, defaultValue: '强度' },
              VALUE: { type: AT.STRING, defaultValue: '1' }
            }
          },
          {
            opcode: 'setUniformColor',
            blockType: BT.COMMAND,
            text: Scratch.translate({ id: 'setUniformColor', default: 'set shader color uniform [NAME] to [COLOR]' }),
            arguments: {
              NAME: { type: AT.STRING, defaultValue: 'myColor' },
              COLOR: { type: AT.COLOR, defaultValue: '#00ffcc' }
            }
          },
          { opcode: 'shaderOK', blockType: BT.BOOLEAN, text: Scratch.translate({ id: 'shaderOK', default: 'shader compiled successfully?' }) },
          { opcode: 'shaderError', blockType: BT.REPORTER, text: Scratch.translate({ id: 'shaderError', default: 'shader error message' }) },
          { opcode: 'getTime', blockType: BT.REPORTER, text: Scratch.translate({ id: 'getTime', default: 'shader time (sec)' }) },
          { opcode: 'resetTime', blockType: BT.COMMAND, text: Scratch.translate({ id: 'resetTime', default: 'reset shader time' }) },

          '---',
          { blockType: BT.LABEL, text: Scratch.translate({ id: 'label.adv', default: 'Advanced Settings' }) },
          {
            opcode: 'setAdv',
            blockType: BT.COMMAND,
            text: Scratch.translate({ id: 'setAdv', default: 'set [ADV] to [VALUE]' }),
            arguments: {
              ADV: { type: AT.STRING, menu: 'ADV' },
              VALUE: { type: AT.NUMBER, defaultValue: 2 }
            }
          },
          {
            opcode: 'getAdv',
            blockType: BT.REPORTER,
            text: Scratch.translate({ id: 'getAdv', default: 'value of [ADV]' }),
            arguments: { ADV: { type: AT.STRING, menu: 'ADV' } }
          },
          { opcode: 'engineInfo', blockType: BT.REPORTER, text: Scratch.translate({ id: 'engineInfo', default: 'engine status' }) }
        ],
        menus: {
          EFFECT: {
            acceptReporters: true,
            items: [
              { text: Scratch.translate({ id: 'effect.blur', default: 'Blur' }), value: 'blur' },
              { text: Scratch.translate({ id: 'effect.noiseBlur', default: 'Noise Blur' }), value: 'noiseBlur' },
              { text: Scratch.translate({ id: 'effect.noise', default: 'Noise' }), value: 'noise' },
              { text: Scratch.translate({ id: 'effect.shake', default: 'Shake' }), value: 'shake' },
              { text: Scratch.translate({ id: 'effect.glitch', default: 'Glitch' }), value: 'glitch' },
              { text: Scratch.translate({ id: 'effect.rgbSplit', default: 'RGB Split' }), value: 'rgbSplit' },
              { text: Scratch.translate({ id: 'effect.pixelate', default: 'Pixelate' }), value: 'pixelate' },
              { text: Scratch.translate({ id: 'effect.scanline', default: 'Scanlines' }), value: 'scanline' },
              { text: Scratch.translate({ id: 'effect.vignette', default: 'Vignette' }), value: 'vignette' },
              { text: Scratch.translate({ id: 'effect.wave', default: 'Wave' }), value: 'wave' },
              { text: Scratch.translate({ id: 'effect.zoomBlur', default: 'Radial Blur' }), value: 'zoomBlur' },
              { text: Scratch.translate({ id: 'effect.bloom', default: 'Bloom' }), value: 'bloom' },
              { text: Scratch.translate({ id: 'effect.fisheye', default: 'Fisheye' }), value: 'fisheye' },
              { text: Scratch.translate({ id: 'effect.swirl', default: 'Swirl' }), value: 'swirl' },
              { text: Scratch.translate({ id: 'effect.trail', default: 'Trail' }), value: 'trail' },
              { text: Scratch.translate({ id: 'effect.brightness', default: 'Brightness' }), value: 'brightness' },
              { text: Scratch.translate({ id: 'effect.contrast', default: 'Contrast' }), value: 'contrast' },
              { text: Scratch.translate({ id: 'effect.saturation', default: 'Saturation' }), value: 'saturation' },
              { text: Scratch.translate({ id: 'effect.hue', default: 'Hue' }), value: 'hue' },
              { text: Scratch.translate({ id: 'effect.invert', default: 'Invert' }), value: 'invert' },
              { text: Scratch.translate({ id: 'effect.tintAmount', default: 'Tint Amount' }), value: 'tintAmount' },
              { text: Scratch.translate({ id: 'effect.kaleido', default: 'Kaleidoscope' }), value: 'kaleido' },
              { text: Scratch.translate({ id: 'effect.liquid', default: 'Liquid' }), value: 'liquid' },
              { text: Scratch.translate({ id: 'effect.prism', default: 'Prism' }), value: 'prism' },
              { text: Scratch.translate({ id: 'effect.blockGlitch', default: 'Block Glitch' }), value: 'blockGlitch' }
            ]
          },
          ADV: {
            acceptReporters: true,
            items: [
              { text: Scratch.translate({ id: 'adv.blurQuality', default: 'Blur Quality' }), value: 'blurQuality' },
              { text: Scratch.translate({ id: 'adv.renderScale', default: 'Render Scale' }), value: 'renderScale' },
              { text: Scratch.translate({ id: 'adv.smooth', default: 'Smooth' }), value: 'smooth' },
              { text: Scratch.translate({ id: 'adv.bloomThreshold', default: 'Bloom Threshold' }), value: 'bloomThreshold' },
              { text: Scratch.translate({ id: 'adv.waveFreq', default: 'Wave Frequency' }), value: 'waveFreq' },
              { text: Scratch.translate({ id: 'adv.waveSpeed', default: 'Wave Speed' }), value: 'waveSpeed' },
              { text: Scratch.translate({ id: 'adv.glitchSpeed', default: 'Glitch Speed' }), value: 'glitchSpeed' }
            ]
          },
          PRESET: {
            acceptReporters: true,
            // value 保持中文原名（applyPreset 用它查 PRESETS），text 走翻译
            items: [
              { text: Scratch.translate({ id: 'preset.0', default: 'None' }), value: '无' },
              { text: Scratch.translate({ id: 'preset.1', default: 'Retro CRT' }), value: '复古CRT' },
              { text: Scratch.translate({ id: 'preset.2', default: 'Underwater' }), value: '水下世界' },
              { text: Scratch.translate({ id: 'preset.3', default: 'Dream' }), value: '梦境' },
              { text: Scratch.translate({ id: 'preset.4', default: 'Drunk' }), value: '醉酒' },
              { text: Scratch.translate({ id: 'preset.5', default: 'Wasteland' }), value: '末日废土' },
              { text: Scratch.translate({ id: 'preset.6', default: 'Matrix' }), value: '黑客帝国' },
              { text: Scratch.translate({ id: 'preset.7', default: 'Silent Film' }), value: '默片老电影' },
              { text: Scratch.translate({ id: 'preset.8', default: 'Cyber Neon' }), value: '霓虹赛博' },
              { text: Scratch.translate({ id: 'preset.9', default: 'Astral Projection' }), value: '灵魂出窍' },
              { text: Scratch.translate({ id: 'preset.10', default: 'Dying' }), value: '濒死' },
              { text: Scratch.translate({ id: 'preset.11', default: 'Pixel Game' }), value: '像素游戏' },
              { text: Scratch.translate({ id: 'preset.12', default: 'Signal Glitch' }), value: '信号故障' },
              { text: Scratch.translate({ id: 'preset.13', default: 'Thunder God' }), value: '雷神降临' }
            ]
          },
          ONOFF: {
            acceptReporters: true,
            items: [
              { text: Scratch.translate({ id: 'menu.on', default: 'On' }), value: 'on' },
              { text: Scratch.translate({ id: 'menu.off', default: 'Off' }), value: 'off' }
            ]
          }
        }
      };
    }

    _key(raw) { return EFFECT_KEY[Cast.toString(raw)] || null; }

    _clamp(key, v) {
      if (!isFinite(v)) v = 0;
      if (key === 'hue') return ((v % 360) + 360) % 360;
      const r = EFFECT_RANGE[key];
      return Math.max(r[0], Math.min(r[1], v));
    }

    setEffect(args) {
      const key = this._key(args.EFFECT);
      if (key) fx.params[key] = this._clamp(key, Cast.toNumber(args.VALUE));
    }

    changeEffect(args) {
      const key = this._key(args.EFFECT);
      if (key) fx.params[key] = this._clamp(key, fx.params[key] + Cast.toNumber(args.VALUE));
    }

    getEffect(args) {
      const key = this._key(args.EFFECT);
      return key ? fx.params[key] : 0;
    }

    setTint(args) {
      fx.tintColor = hexToRGB(Cast.toString(args.COLOR));
      fx.params.tintAmount = Math.max(0, Math.min(100, Cast.toNumber(args.VALUE)));
    }

    clearAll() { fx.resetAll(); }

    setEnabled(args) {
      fx.enabled = Cast.toString(args.ONOFF) === 'on';
      if (!fx.enabled) fx._stopLoop();
    }

    isEnabled() { return !!fx.enabled && !fx.failed && fx.ready; }

    _push(kind, power, sec, extra) {
      const tr = {
        kind: kind,
        power: Math.max(0, Cast.toNumber(power)),
        dur: Math.max(0.02, Cast.toNumber(sec)),
        t0: performance.now()
      };
      if (extra) Object.keys(extra).forEach(function (k) { tr[k] = extra[k]; });
      fx.transients.push(tr);
      if (fx.transients.length > 32) fx.transients.shift();
    }

    hit(args) { this._push('hit', args.POWER, args.SEC); }
    shakeOnce(args) { this._push('shake', args.POWER, args.SEC); }
    glitchOnce(args) { this._push('glitch', args.POWER, args.SEC); }
    flashOnce(args) { this._push('flash', args.POWER, args.SEC, { color: hexToRGB(Cast.toString(args.COLOR)) }); }
    shockwave(args) {
      this._push('shock', args.POWER, args.SEC, {
        x: (Cast.toNumber(args.X) + 240) / 480,
        y: (Cast.toNumber(args.Y) + 180) / 360
      });
    }
    stopTransients() { fx.transients.length = 0; }

    applyPreset(args) {
      const preset = PRESETS[Cast.toString(args.PRESET)];
      if (!preset) return;
      EFFECT_LIST.forEach(function (e) { fx.params[e[1]] = 0; });
      ADV_LIST.forEach(function (e) { if (e[5]) fx.adv[e[1]] = e[4]; });
      fx.tintColor = [1, 1, 1];
      Object.keys(preset).forEach(function (k) {
        if (k === 'tintColor') fx.tintColor = hexToRGB(preset[k]);
        else if (Object.prototype.hasOwnProperty.call(fx.adv, k)) fx.adv[k] = preset[k];
        else if (Object.prototype.hasOwnProperty.call(fx.params, k)) fx.params[k] = preset[k];
      });
    }

    openEditor() { openShaderEditor(); }
    openEditorBlock() { openShaderEditor(); }

    setShader(args) {
      if (fx.compileCustom(Cast.toString(args.CODE))) fx.customEnabled = true;
    }

    shaderOnOff(args) {
      const on = Cast.toString(args.ONOFF) === 'on';
      if (on && !fx.customProgram && fx.customSource) fx.compileCustom(fx.customSource);
      fx.customEnabled = on;
    }

    setUniform(args) { fx.uniformValues.set(Cast.toString(args.NAME), Cast.toString(args.VALUE)); }
    setUniformColor(args) {
      fx.uniformValues.set(Cast.toString(args.NAME), hexToRGB(Cast.toString(args.COLOR)).join(','));
    }

    shaderError() { return fx.customError || ''; }
    shaderOK() { return !!fx.customProgram && !fx.customError; }
    getTime() { return Math.round(fx.now() * 1000) / 1000; }
    resetTime() { fx.startTime = performance.now(); }

    setAdv(args) {
      const key = ADV_KEY[Cast.toString(args.ADV)];
      if (!key) return;
      const r = ADV_RANGE[key];
      let v = Cast.toNumber(args.VALUE);
      if (!isFinite(v)) v = r[2];
      fx.adv[key] = Math.max(r[0], Math.min(r[1], v));
      if (key === 'renderScale') fx.invalidateTargets();
      if (key === 'smooth' && !fx.adv.smooth) fx._stopLoop();
    }

    getAdv(args) {
      const key = ADV_KEY[Cast.toString(args.ADV)];
      return key ? fx.adv[key] : 0;
    }

    engineInfo() {
      // 注意：很多编辑器没有 F12 控制台，这个积木就是"控制台"——
      // 把它拖到舞台上勾选显示，出问题时一眼能看出卡在哪一步。
      if (!fx.gl) return Scratch.translate({ id: 'engine.noRenderer', default: 'WebGL renderer not found' });
      if (!fx.ready) return Scratch.translate({ id: 'engine.notReady', default: 'Not ready' }) + (fx.lastError ? '｜' + fx.lastError : '');
      if (fx.failed) return Scratch.translate({ id: 'engine.failed', default: 'Disabled due to error' }) + (fx.lastError ? '｜' + fx.lastError : '');
      const cap = fx.captureBroken ? Scratch.translate({ id: 'engine.capBroken', default: 'Capture buffer unavailable' })
        : (fx.captureValid ? Scratch.translate({ id: 'engine.capOK', default: 'Capture OK' }) : Scratch.translate({ id: 'engine.capWait', default: 'Waiting for first frame' }));
      return Scratch.translate({ id: 'engine.ok', default: 'OK' }) + ' ' + fx.W + 'x' + fx.H
        + '｜' + Scratch.translate({ id: 'engine.scale', default: 'scale' }) + fx.adv.renderScale
        + '｜' + cap
        + '｜' + Scratch.translate({ id: 'engine.frames', default: 'captured' }) + fx.frames + Scratch.translate({ id: 'engine.framesUnit', default: ' frames' })
        + '｜' + (fx.hasDirtyFlag ? Scratch.translate({ id: 'engine.dirtyYes', default: 'can force redraw' }) : Scratch.translate({ id: 'engine.dirtyNo', default: 'no dirty flag' }))
        + (fx.lastError ? '｜' + fx.lastError : '');
    }
  }

  // 绿旗 / 项目卸载时清空，避免上一次运行的残留
  try {
    if (runtime && typeof runtime.on === 'function') {
      runtime.on('PROJECT_START', function () { fx.resetAll(); });
      runtime.on('RUNTIME_DISPOSED', function () { fx.resetAll(); });
    }
  } catch (e) { /* 忽略 */ }

  Scratch.extensions.register(new LeiShen());
})(Scratch);
