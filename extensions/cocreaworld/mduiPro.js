(function(global) {
    'use strict';

    const Scratch = global.Scratch || {};
    const { BlockType, ArgumentType, Cast, extensions } = Scratch;
    const vm = Scratch.vm || (global.vm || {});
    const runtime = vm.runtime || {};

    const UNIFIED_ICON = "data:image/png;base64,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";

    const EXTENSION_COVER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iYmdHcmFkIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI3MCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojYjM4OGZmO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjQwJSIgc3R5bGU9InN0b3AtY29sb3I6Izk5NjZmZjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNzAzZmZmO3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0idGV4dEdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmZmZmZmO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlMGQ0ZmY7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGZpbHRlciBpZD0iZ2xvdyIgeD0iLTUwJSIgeT0iLTUwJSIgd2lkdGg9IjIwMCUiIGhlaWdodD0iMjAwJSI+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjQiIHJlc3VsdD0iY29sb3JHbG93IiAvPgogICAgICA8ZmVDb21wb3NpdGUgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iY29sb3JHbG93IiBvcGVyYXRvcj0ib3ZlciIgLz4KICAgIDwvZmlsdGVyPgogICAgPGZpbHRlciBpZD0ic2hhZG93IiB4PSItNTAlIiB5PSItNTAlIiB3aWR0aD0iMjAwJSIgaGVpZ2h0PSIyMDAlIj4KICAgICAgPGZlRHJvcHNoYWRvdyBkeD0iMCIgZHk9IjgiIGJsdXI9IjIwIiBmbG9vZC1jb2xvcj0iIzk5NjZmZiIgZmxvb2Qtb3BhY2l0eT0iMC41Ii8+CiAgICA8L2ZpbHRlcj4KICAgIDxmaWx0ZXIgaWQ9InNvZnRHbG93IiB4PSItNTAlIiB5PSItNTAlIiB3aWR0aD0iMjAwJSIgaGVpZ2h0PSIyMDAlIj4KICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTUiIHJlc3VsdD0ic29mdEdsb3ciIC8+CiAgICA8L2ZpbHRlcj4KICA8L2RlZnM+CiAgCiAgPCEtLSBCYWNrZ3JvdW5kIC0tPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ1cmwoI2JnR3JhZCkiLz4KICAKICA8IS0tIEFuaW1hdGVkIGRlY29yYXRpdmUgc2hhcGVzIC0tPgogIDxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjgwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDgpIi8+CiAgPGNpcmNsZSBjeD0iMzUwIiBjeT0iODAiIHI9IjYwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDYpIi8+CiAgPGNpcmNsZSBjeD0iODAiIGN5PSIzNTAiIHI9IjcwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDYpIi8+CiAgPGNpcmNsZSBjeD0iMzIwIiBjeT0iMzIwIiByPSI1MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPgogIAogIDwhLS0gR2xvd2luZyByaW5ncyAtLT4KICA8Y2lyY2xlIGN4PSIyMDAiIGN5PSIyMDAiIHI9IjEyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iMTQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWRhc2hhcnJheT0iNSw1Ii8+CiAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMjAwIiByPSIxNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgCiAgPCEtLSBEZWNvcmF0aXZlIGdlb21ldHJpYyBzaGFwZXMgLS0+CiAgPHJlY3QgeD0iMTQwIiB5PSIxMDAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgcng9IjYiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgdHJhbnNmb3JtPSJyb3RhdGUoNDUgMTU1IDExNSkiLz4KICA8cmVjdCB4PSIyMzAiIHk9IjI4MCIgd2lkdGg9IjI1IiBoZWlnaHQ9IjI1IiByeD0iNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAyNDIgMjk1KSIvPgogIDxyZWN0IHg9IjEwMCIgeT0iMjYwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDgpIiB0cmFuc2Zvcm09InJvdGF0ZSg2MCAxMTAgMjcwKSIvPgogIAogIDwhLS0gU3BhcmtsZXMgLS0+CiAgPGNpcmNsZSBjeD0iMTIwIiBjeT0iMTUwIiByPSIzIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuNSkiLz4KICA8Y2lyY2xlIGN4PSIyODAiIGN5PSIxMjAiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC40KSIvPgogIDxjaXJjbGUgY3g9IjMwMCIgY3k9IjI2MCIgcj0iMyIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjQpIi8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMjgwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuNSkiLz4KICA8Y2lyY2xlIGN4PSIyNTAiIGN5PSIzMDAiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4zKSIvPgogIDxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjQpIi8+CiAgCiAgPCEtLSBNYWluIGNvbnRhaW5lciB3aXRoIGdsYXNzIGVmZmVjdCAtLT4KICA8cmVjdCB4PSI4MCIgeT0iMTQwIiB3aWR0aD0iMjQwIiBoZWlnaHQ9IjEyMCIgcng9IjIwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMTUpIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4zKSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWx0ZXI9InVybCgjc2hhZG93KSIvPgogIAogIDwhLS0gSW5uZXIgZ2xvdyByaW5nIC0tPgogIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIiBzdHJva2Utd2lkdGg9IjIiIGZpbHRlcj0idXJsKCNzb2Z0R2xvdykiLz4KICAKICA8IS0tIE1haW4gVGV4dCAtLT4KICA8dGV4dCB4PSIyMDAiIHk9IjE5NSIgZm9udC1mYW1pbHk9IidTZWdvZSBVSScsICdSb2JvdG8nLCAnQXJpYWwnLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjQ4IiBmb250LXdlaWdodD0iODAwIiBmaWxsPSJ1cmwoI3RleHRHcmFkKSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsdGVyPSJ1cmwoI2dsb3cpIj5tZHVpPC90ZXh0PgogIDx0ZXh0IHg9IjIwMCIgeT0iMjQ1IiBmb250LWZhbWlseT0iJ1NlZ29lIFVJJywgJ1JvYm90bycsICdBcmlhbCcsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNlMGQ0ZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbHRlcj0idXJsKCNnbG93KSI+UHJvPC90ZXh0PgogIAogIDwhLS0gRGVjb3JhdGl2ZSBsaW5lcyAtLT4KICA8bGluZSB4MT0iMTMwIiB5MT0iMjcwIiB4Mj0iMjcwIiB5Mj0iMjcwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC40KSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8bGluZSB4MT0iMTUwIiB5MT0iMjgwIiB4Mj0iMjUwIiB5Mj0iMjgwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4yKSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICAKICA8IS0tIEJvdHRvbSB0ZXh0IC0tPgogIDx0ZXh0IHg9IjIwMCIgeT0iMzIwIiBmb250LWZhbWlseT0iJ1NlZ29lIFVJJywgJ1JvYm90bycsICdBcmlhbCcsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSI1MDAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC42KSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TWF0ZXJpYWwgRGVzaWduIFVJIEZyYW1ld29yazwvdGV4dD4KICAKICA8IS0tIEJvdHRvbSBkZWNvcmF0aXZlIGRvdHMgLS0+CiAgPGNpcmNsZSBjeD0iMTgwIiBjeT0iMzUwIiByPSIzIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuNCkiLz4KICA8Y2lyY2xlIGN4PSIyMDAiIGN5PSIzNTAiIHI9IjMiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC42KSIvPgogIDxjaXJjbGUgY3g9IjIyMCIgY3k9IjM1MCIgcj0iMyIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjQpIi8+Cjwvc3ZnPg==";

    function loadResource(url, type) {
        return new Promise(function(resolve, reject) {
            if (type === 'css') {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = url;
                link.onload = function() { resolve(); };
                link.onerror = function() { reject(new Error('Failed to load CSS: ' + url)); };
                document.head.appendChild(link);
            } else if (type === 'js') {
                var script = document.createElement('script');
                script.src = url;
                script.onload = function() { resolve(); };
                script.onerror = function() { reject(new Error('Failed to load JS: ' + url)); };
                document.head.appendChild(script);
            }
        });
    }

    function parseList(str) {
        if (typeof str === 'object' && Array.isArray(str)) return str;
        try {
            return JSON.parse(str);
        } catch (e) {
            return String(str).split(',').map(function(s) { return s.trim(); });
        }
    }

    function sanitizeHTML(html) {
        if (typeof html !== 'string') return '';
        try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, 'text/html');
            var scripts = doc.querySelectorAll('script');
            scripts.forEach(function(script) { script.remove(); });
            var allElements = doc.querySelectorAll('*');
            allElements.forEach(function(el) {
                var tagName = el.tagName.toLowerCase();
                if (['iframe', 'object', 'embed', 'form', 'input', 'button', 'meta', 'link', 'style'].indexOf(tagName) !== -1) {
                    el.remove();
                    return;
                }
                var attributes = el.attributes;
                var attrsToRemove = [];
                for (var i = 0; i < attributes.length; i++) {
                    var attrName = attributes[i].name.toLowerCase();
                    if (attrName.indexOf('on') === 0) {
                        attrsToRemove.push(attrName);
                    }
                }
                attrsToRemove.forEach(function(attrName) {
                    el.removeAttribute(attrName);
                });
                if (el.hasAttribute('href')) {
                    var href = el.getAttribute('href');
                    if (href && href.toLowerCase().trim().indexOf('javascript:') === 0) {
                        el.setAttribute('href', 'about:blank');
                    }
                }
                if (el.hasAttribute('src')) {
                    var src = el.getAttribute('src');
                    if (src && src.toLowerCase().trim().indexOf('javascript:') === 0) {
                        el.setAttribute('src', 'about:blank');
                    }
                }
            });
            return doc.body.innerHTML;
        } catch (e) {
            var clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            clean = clean.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');
            clean = clean.replace(/\son\w+\s*=\s*[^\s>]+/gi, '');
            clean = clean.replace(/javascript\s*:/gi, 'blocked:');
            return clean;
        }
    }

    function sanitizeCSS(css) {
        if (typeof css !== 'string') return '';
        var clean = css;
        clean = clean.replace(/@import\s+[^;]+;/gi, '');
        clean = clean.replace(/expression\s*\([^)]*\)/gi, '/* blocked */');
        clean = clean.replace(/behavior\s*:\s*[^;]+;/gi, '/* blocked */');
        clean = clean.replace(/url\s*\(\s*["']?\s*javascript:[^"')]*["']?\s*\)/gi, 'url(/* blocked */)');
        clean = clean.replace(/url\s*\(\s*["']?\s*data:[^"')]*["']?\s*\)/gi, 'url(/* blocked */)');
        return clean;
    }

    function createMDUIDialog(options) {
        return new Promise(function(resolve) {
            if (typeof mdui === 'undefined') {
                alert('[mduiPro] MDUI库未加载');
                resolve(null);
                return;
            }
            
            var dialog = document.createElement('mdui-dialog');
            if (options.headline) dialog.headline = options.headline;
            if (options.description) dialog.description = options.description;
            if (options.fullscreen) dialog.fullscreen = true;
            if (options.closeOnOverlayClick === false) dialog.closeOnOverlayClick = false;
            if (options.closeOnEsc === false) dialog.closeOnEsc = false;
            
            var hasResolved = false;
            function finish(val) {
                if (!hasResolved) {
                    hasResolved = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    resolve(val);
                }
            }
            
            if (options.body instanceof Element) {
                dialog.appendChild(options.body);
            } else if (options.body) {
                var div = document.createElement('div');
                div.innerHTML = options.body;
                dialog.appendChild(div);
            }
            
            if (options.actions && Array.isArray(options.actions)) {
                options.actions.forEach(function(act) {
                    var btn = document.createElement('mdui-button');
                    btn.slot = 'action';
                    btn.textContent = act.text;
                    btn.variant = act.variant || 'text';
                    if (act.color) btn.color = act.color;
                    if (act.disabled) btn.disabled = true;
                    btn.addEventListener('click', function() {
                        finish(act.value !== undefined ? act.value : true);
                        dialog.open = false;
                    });
                    dialog.appendChild(btn);
                });
            }
            
            dialog.addEventListener('closed', function() {
                finish(options.cancelValue !== undefined ? options.cancelValue : null);
                dialog.remove();
            });
            
            document.body.appendChild(dialog);
            requestAnimationFrame(function() {
                dialog.open = true;
                if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
            });
        });
    }

    function createSnackbar(options) {
        if (typeof mdui === 'undefined') return;
        mdui.snackbar({
            message: options.message,
            placement: options.placement || 'bottom',
            duration: options.duration || 3000,
            action: options.action,
            onActionClick: options.onActionClick
        });
    }

    class mduiPro_ext {
        constructor(_runtime) {
            this.runtime = _runtime;
            this.isLoaded = false;
            this.loadingDialog = null;
            this.progressDialog = null;
            this.fabElement = null;
            this.drawerElement = null;
            this.bottomNavElement = null;
            this.autoLoadMDUI();
        }

        async autoLoadMDUI() {
            if (this.isLoaded) return;
            try {
                await Promise.all([
                    loadResource('https://unpkg.com/mdui@2/mdui.css', 'css'),
                    loadResource('https://unpkg.com/mdui@2/mdui.global.js', 'js')
                ]);
                this.isLoaded = true;
                console.log('[mduiPro] MDUI库加载成功');
            } catch (error) {
                console.error('[mduiPro] MDUI库加载失败:', error);
            }
        }

        applyPresetTheme(args) {
            const presets = {
                "default": { theme: "auto", primary: "#6b7fd5", name: "默认蓝" },
                "dark-purple": { theme: "dark", primary: "#d0bcff", name: "暗夜紫" },
                "ocean-blue": { theme: "light", primary: "#0061a4", name: "海洋蓝" },
                "forest-green": { theme: "light", primary: "#4f6354", name: "森林绿" },
                "sunset-orange": { theme: "light", primary: "#9c4146", name: "落日橙" },
                "cyberpunk": { theme: "dark", primary: "#fcee0a", name: "赛博朋克" },
                "rose-pink": { theme: "light", primary: "#c86478", name: "玫瑰粉" },
                "midnight-blue": { theme: "dark", primary: "#a5b4fc", name: "午夜蓝" }
            };
            
            const preset = presets[args.preset] || presets["default"];
            
            try {
                const root = document.documentElement;
                
                if (preset.theme === 'dark') {
                    root.setAttribute('data-mdui-theme', 'dark');
                } else if (preset.theme === 'light') {
                    root.setAttribute('data-mdui-theme', 'light');
                } else {
                    root.removeAttribute('data-mdui-theme');
                }
                
                root.style.setProperty('--mdui-color-primary', preset.primary);
                root.style.setProperty('--mdui-color-on-primary', '#ffffff');
                root.style.setProperty('--mdui-color-primary-container', preset.primary + '33');
                
                console.log(`[mduiPro] 已应用预设主题: ${preset.name} (${preset.theme}, ${preset.primary})`);
                return `已应用: ${preset.name}`;
            } catch (e) {
                console.error('[mduiPro] 应用主题失败:', e);
                return '应用失败';
            }
        }

        setCustomTheme(args) {
            try {
                const root = document.documentElement;
                
                if (args.mode === 'dark') {
                    root.setAttribute('data-mdui-theme', 'dark');
                } else if (args.mode === 'light') {
                    root.setAttribute('data-mdui-theme', 'light');
                } else {
                    root.removeAttribute('data-mdui-theme');
                }
                
                root.style.setProperty('--mdui-color-primary', args.primary);
                root.style.setProperty('--mdui-color-on-primary', '#ffffff');
                root.style.setProperty('--mdui-color-primary-container', args.primary + '33');
                
                console.log(`[mduiPro] 已设置自定义主题: 模式=${args.mode}, 颜色=${args.primary}`);
                return `已设置: ${args.mode}模式, ${args.primary}`;
            } catch (e) {
                console.error('[mduiPro] 设置主题失败:', e);
                return '设置失败';
            }
        }

        getCurrentThemeConfig() {
            try {
                const root = document.documentElement;
                const mode = root.getAttribute('data-mdui-theme') || 'auto';
                const primary = getComputedStyle(root).getPropertyValue('--mdui-color-primary').trim() || '#6b7fd5';
                return JSON.stringify({ mode: mode, primary: primary });
            } catch (e) {
                console.error('[mduiPro] 获取主题配置失败:', e);
                return JSON.stringify({ mode: "auto", primary: "#6b7fd5" });
            }
        }

        applyThemeConfig(args) {
            try {
                const config = JSON.parse(args.json);
                const root = document.documentElement;
                
                if (config.mode) {
                    if (config.mode === 'auto') {
                        root.removeAttribute('data-mdui-theme');
                    } else {
                        root.setAttribute('data-mdui-theme', config.mode);
                    }
                }
                
                if (config.primary) {
                    root.style.setProperty('--mdui-color-primary', config.primary);
                    root.style.setProperty('--mdui-color-on-primary', '#ffffff');
                    root.style.setProperty('--mdui-color-primary-container', config.primary + '33');
                }
                
                console.log('[mduiPro] 已应用主题配置:', config);
                return '已应用配置';
            } catch (e) {
                console.error('[mduiPro] 解析主题配置失败:', e);
                return '配置无效';
            }
        }

        async alert(args) {
            await createMDUIDialog({
                headline: args.t,
                description: args.d,
                actions: [{ text: args.c, value: true, variant: "tonal" }]
            });
        }

        async confirm(args) {
            return await createMDUIDialog({
                headline: args.t,
                description: args.d,
                actions: [
                    { text: args.c1, value: false, variant: "text" },
                    { text: args.c2, value: true, variant: "tonal" }
                ],
                cancelValue: false
            });
        }

        async prompt(args) {
            var body = document.createElement('div');
            body.style.cssText = 'padding: 8px 0;';
            
            var input = document.createElement('mdui-text-field');
            input.label = args.l;
            input.value = args.v;
            input.variant = 'outlined';
            input.style.width = '100%';
            body.appendChild(input);
            
            var result = await createMDUIDialog({
                headline: args.t,
                body: body,
                actions: [
                    { text: "取消", value: null, variant: "text" },
                    { text: "确定", value: "confirm", variant: "tonal" }
                ]
            });
            
            return result === "confirm" ? input.value : null;
        }

        async textInput(args) {
            var body = document.createElement('div');
            body.style.cssText = 'padding: 8px 0;';
            
            var textarea = document.createElement('mdui-text-field');
            textarea.label = args.l;
            textarea.value = args.v;
            textarea.variant = 'outlined';
            textarea.rows = Cast.toNumber(args.r);
            textarea.style.width = '100%';
            body.appendChild(textarea);
            
            var result = await createMDUIDialog({
                headline: args.t,
                body: body,
                actions: [
                    { text: "取消", value: null, variant: "text" },
                    { text: "确定", value: "confirm", variant: "tonal" }
                ]
            });
            
            return result === "confirm" ? textarea.value : null;
        }

        async datePicker(args) {
            return new Promise(function(resolve) {
                if (typeof mdui === 'undefined') { resolve(null); return; }
                
                var dialog = document.createElement('mdui-dialog');
                dialog.headline = args.t || '选择日期';
                
                var body = document.createElement('div');
                body.style.cssText = 'padding: 24px 16px; min-height: 350px;';
                
                var picker = document.createElement('mdui-date-picker');
                picker.setAttribute('variant', 'outlined');
                picker.setAttribute('label', '选择日期');
                picker.style.width = '100%';
                
                body.appendChild(picker);
                dialog.appendChild(body);
                
                var cancelBtn = document.createElement('mdui-button');
                cancelBtn.slot = 'action';
                cancelBtn.textContent = '取消';
                cancelBtn.variant = 'text';
                cancelBtn.addEventListener('click', function() {
                    dialog.open = false;
                    resolve(null);
                });
                dialog.appendChild(cancelBtn);
                
                var confirmBtn = document.createElement('mdui-button');
                confirmBtn.slot = 'action';
                confirmBtn.textContent = '确定';
                confirmBtn.variant = 'tonal';
                confirmBtn.addEventListener('click', function() {
                    setTimeout(function() {
                        var selectedValue = picker.value;
                        if (!selectedValue && picker.dataset && picker.dataset.value) {
                            selectedValue = picker.dataset.value;
                        }
                        dialog.open = false;
                        resolve(selectedValue || null);
                    }, 100);
                });
                dialog.appendChild(confirmBtn);
                
                dialog.addEventListener('closed', function() {
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    dialog.remove();
                });
                
                document.body.appendChild(dialog);
                requestAnimationFrame(function() {
                    dialog.open = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
                });
            });
        }

        async timePicker(args) {
            return new Promise(function(resolve) {
                if (typeof mdui === 'undefined') { resolve(null); return; }
                
                var dialog = document.createElement('mdui-dialog');
                dialog.headline = args.t || '选择时间';
                
                var body = document.createElement('div');
                body.style.cssText = 'padding: 24px 16px; min-height: 350px; display: flex; justify-content: center;';
                
                var picker = document.createElement('mdui-time-picker');
                picker.setAttribute('variant', 'outlined');
                picker.setAttribute('label', '选择时间');
                picker.setAttribute('format', args.f === "12" ? "12" : "24");
                picker.style.width = '100%';
                picker.style.maxWidth = '300px';
                
                body.appendChild(picker);
                dialog.appendChild(body);
                
                var cancelBtn = document.createElement('mdui-button');
                cancelBtn.slot = 'action';
                cancelBtn.textContent = '取消';
                cancelBtn.variant = 'text';
                cancelBtn.addEventListener('click', function() {
                    dialog.open = false;
                    resolve(null);
                });
                dialog.appendChild(cancelBtn);
                
                var confirmBtn = document.createElement('mdui-button');
                confirmBtn.slot = 'action';
                confirmBtn.textContent = '确定';
                confirmBtn.variant = 'tonal';
                confirmBtn.addEventListener('click', function() {
                    setTimeout(function() {
                        var selectedValue = picker.value;
                        if (!selectedValue && picker.querySelector('input')) {
                            selectedValue = picker.querySelector('input').value;
                        }
                        dialog.open = false;
                        resolve(selectedValue || null);
                    }, 100);
                });
                dialog.appendChild(confirmBtn);
                
                dialog.addEventListener('closed', function() {
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    dialog.remove();
                });
                
                document.body.appendChild(dialog);
                setTimeout(function() {
                    dialog.open = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
                }, 100);
            });
        }

        async dateTimePicker(args) {
            return new Promise(function(resolve) {
                if (typeof mdui === 'undefined') { resolve(null); return; }
                
                var dialog = document.createElement('mdui-dialog');
                dialog.headline = args.t || '选择日期时间';
                
                var body = document.createElement('div');
                body.style.cssText = 'padding: 24px 16px; min-height: 400px;';
                
                var dp = document.createElement('mdui-date-picker');
                dp.setAttribute('variant', 'outlined');
                dp.setAttribute('label', '选择日期');
                dp.style.cssText = 'width: 100%; margin-bottom: 16px;';
                
                var tp = document.createElement('mdui-time-picker');
                tp.setAttribute('variant', 'outlined');
                tp.setAttribute('label', '选择时间');
                tp.style.cssText = 'width: 100%;';
                
                body.appendChild(dp);
                body.appendChild(tp);
                dialog.appendChild(body);
                
                var cancelBtn = document.createElement('mdui-button');
                cancelBtn.slot = 'action';
                cancelBtn.textContent = '取消';
                cancelBtn.variant = 'text';
                cancelBtn.addEventListener('click', function() {
                    dialog.open = false;
                    resolve(null);
                });
                dialog.appendChild(cancelBtn);
                
                var confirmBtn = document.createElement('mdui-button');
                confirmBtn.slot = 'action';
                confirmBtn.textContent = '确定';
                confirmBtn.variant = 'tonal';
                confirmBtn.addEventListener('click', function() {
                    setTimeout(function() {
                        var dateValue = dp.value;
                        var timeValue = tp.value;
                        if (!dateValue && dp.querySelector('input')) dateValue = dp.querySelector('input').value;
                        if (!timeValue && tp.querySelector('input')) timeValue = tp.querySelector('input').value;
                        dialog.open = false;
                        if (dateValue && timeValue) {
                            resolve(dateValue + ' ' + timeValue);
                        } else if (dateValue) {
                            resolve(dateValue);
                        } else if (timeValue) {
                            resolve(timeValue);
                        } else {
                            resolve(null);
                        }
                    }, 100);
                });
                dialog.appendChild(confirmBtn);
                
                dialog.addEventListener('closed', function() {
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    dialog.remove();
                });
                
                document.body.appendChild(dialog);
                setTimeout(function() {
                    dialog.open = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
                }, 100);
            });
        }

        async customTimePicker(args) {
            var slots = parseList(args.s || '["09:00","10:00","11:00","14:00","15:00","16:00"]');
            var selectedValue = null;
            
            return new Promise(function(resolve) {
                if (typeof mdui === 'undefined') { resolve(null); return; }
                
                var dialog = document.createElement('mdui-dialog');
                dialog.headline = args.t || '选择时间段';
                
                var body = document.createElement('div');
                body.style.cssText = 'padding: 24px 16px; display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; min-width: 320px;';
                
                slots.forEach(function(slot) {
                    var chip = document.createElement('mdui-chip');
                    chip.textContent = slot;
                    chip.variant = 'outlined';
                    chip.style.cssText = 'cursor: pointer; transition: all 0.2s;';
                    chip.addEventListener('click', function() {
                        body.querySelectorAll('mdui-chip').forEach(function(c) {
                            c.selected = false;
                            c.variant = 'outlined';
                        });
                        chip.selected = true;
                        chip.variant = 'elevated';
                        selectedValue = slot;
                    });
                    body.appendChild(chip);
                });
                
                var hint = document.createElement('div');
                hint.textContent = '请点击上方芯片选择时间段';
                hint.style.cssText = 'width: 100%; text-align: center; font-size: 12px; color: var(--mdui-color-on-surface-variant); margin-top: 8px;';
                body.appendChild(hint);
                dialog.appendChild(body);
                
                var cancelBtn = document.createElement('mdui-button');
                cancelBtn.slot = 'action';
                cancelBtn.textContent = '取消';
                cancelBtn.variant = 'text';
                cancelBtn.addEventListener('click', function() {
                    dialog.open = false;
                    resolve(null);
                });
                dialog.appendChild(cancelBtn);
                
                var confirmBtn = document.createElement('mdui-button');
                confirmBtn.slot = 'action';
                confirmBtn.textContent = '确定';
                confirmBtn.variant = 'tonal';
                confirmBtn.addEventListener('click', function() {
                    dialog.open = false;
                    resolve(selectedValue);
                });
                dialog.appendChild(confirmBtn);
                
                dialog.addEventListener('closed', function() {
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    dialog.remove();
                });
                
                document.body.appendChild(dialog);
                requestAnimationFrame(function() {
                    dialog.open = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
                });
            });
        }

        async dateRangePicker(args) {
            return new Promise(function(resolve) {
                if (typeof mdui === 'undefined') { resolve(null); return; }
                
                var dialog = document.createElement('mdui-dialog');
                dialog.headline = args.t || '选择日期范围';
                
                var body = document.createElement('div');
                body.style.cssText = 'padding: 24px 16px; min-height: 450px;';
                
                var startContainer = document.createElement('div');
                startContainer.style.cssText = 'margin-bottom: 20px;';
                var startLabel = document.createElement('div');
                startLabel.textContent = '开始日期';
                startLabel.style.cssText = 'font-size: 12px; color: var(--mdui-color-primary); margin-bottom: 8px; font-weight: 500;';
                var startDatePicker = document.createElement('mdui-date-picker');
                startDatePicker.setAttribute('variant', 'outlined');
                startDatePicker.setAttribute('label', '开始日期');
                startDatePicker.style.width = '100%';
                startContainer.appendChild(startLabel);
                startContainer.appendChild(startDatePicker);
                body.appendChild(startContainer);
                
                var divider = document.createElement('mdui-divider');
                divider.style.cssText = 'margin: 16px 0;';
                body.appendChild(divider);
                
                var endContainer = document.createElement('div');
                endContainer.style.cssText = 'margin-bottom: 12px;';
                var endLabel = document.createElement('div');
                endLabel.textContent = '结束日期';
                endLabel.style.cssText = 'font-size: 12px; color: var(--mdui-color-primary); margin-bottom: 8px; font-weight: 500;';
                var endDatePicker = document.createElement('mdui-date-picker');
                endDatePicker.setAttribute('variant', 'outlined');
                endDatePicker.setAttribute('label', '结束日期');
                endDatePicker.style.width = '100%';
                endContainer.appendChild(endLabel);
                endContainer.appendChild(endDatePicker);
                body.appendChild(endContainer);
                
                dialog.appendChild(body);
                
                startDatePicker.addEventListener('change', function() {
                    if (startDatePicker.value) {
                        endDatePicker.setAttribute('min', startDatePicker.value);
                        if (endDatePicker.value && new Date(endDatePicker.value).getTime() < new Date(startDatePicker.value).getTime()) {
                            endDatePicker.value = startDatePicker.value;
                        }
                    }
                });
                
                var cancelBtn = document.createElement('mdui-button');
                cancelBtn.slot = 'action';
                cancelBtn.textContent = '取消';
                cancelBtn.variant = 'text';
                cancelBtn.addEventListener('click', function() {
                    dialog.open = false;
                    resolve(null);
                });
                dialog.appendChild(cancelBtn);
                
                var confirmBtn = document.createElement('mdui-button');
                confirmBtn.slot = 'action';
                confirmBtn.textContent = '确定';
                confirmBtn.variant = 'tonal';
                confirmBtn.addEventListener('click', function() {
                    setTimeout(function() {
                        if (!startDatePicker.value || !endDatePicker.value) {
                            resolve(null);
                            return;
                        }
                        var start = new Date(startDatePicker.value);
                        var end = new Date(endDatePicker.value);
                        if (end >= start) {
                            var days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
                            dialog.open = false;
                            resolve(JSON.stringify({ start: startDatePicker.value, end: endDatePicker.value, days: days }));
                        } else {
                            resolve(null);
                        }
                    }, 100);
                });
                dialog.appendChild(confirmBtn);
                
                dialog.addEventListener('closed', function() {
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    dialog.remove();
                });
                
                document.body.appendChild(dialog);
                setTimeout(function() {
                    dialog.open = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
                }, 100);
            });
        }

        async dateTimeRangePicker(args) {
            return new Promise(function(resolve) {
                if (typeof mdui === 'undefined') { resolve(null); return; }
                
                var dialog = document.createElement('mdui-dialog');
                dialog.headline = args.t || '选择日期时间范围';
                
                var body = document.createElement('div');
                body.style.cssText = 'padding: 24px 16px; min-height: 500px;';
                
                var startContainer = document.createElement('div');
                startContainer.style.cssText = 'margin-bottom: 20px;';
                var startLabel = document.createElement('div');
                startLabel.textContent = '开始日期时间';
                startLabel.style.cssText = 'font-size: 12px; color: var(--mdui-color-primary); margin-bottom: 8px; font-weight: 500;';
                var startDatePicker = document.createElement('mdui-date-picker');
                startDatePicker.setAttribute('variant', 'outlined');
                startDatePicker.style.cssText = 'width: 100%; margin-bottom: 8px;';
                var startTimePicker = document.createElement('mdui-time-picker');
                startTimePicker.setAttribute('variant', 'outlined');
                startTimePicker.style.cssText = 'width: 100%;';
                startContainer.appendChild(startLabel);
                startContainer.appendChild(startDatePicker);
                startContainer.appendChild(startTimePicker);
                body.appendChild(startContainer);
                
                var divider = document.createElement('mdui-divider');
                divider.style.cssText = 'margin: 16px 0;';
                body.appendChild(divider);
                
                var endContainer = document.createElement('div');
                endContainer.style.cssText = 'margin-bottom: 12px;';
                var endLabel = document.createElement('div');
                endLabel.textContent = '结束日期时间';
                endLabel.style.cssText = 'font-size: 12px; color: var(--mdui-color-primary); margin-bottom: 8px; font-weight: 500;';
                var endDatePicker = document.createElement('mdui-date-picker');
                endDatePicker.setAttribute('variant', 'outlined');
                endDatePicker.style.cssText = 'width: 100%; margin-bottom: 8px;';
                var endTimePicker = document.createElement('mdui-time-picker');
                endTimePicker.setAttribute('variant', 'outlined');
                endTimePicker.style.cssText = 'width: 100%;';
                endContainer.appendChild(endLabel);
                endContainer.appendChild(endDatePicker);
                endContainer.appendChild(endTimePicker);
                body.appendChild(endContainer);
                
                dialog.appendChild(body);
                
                var cancelBtn = document.createElement('mdui-button');
                cancelBtn.slot = 'action';
                cancelBtn.textContent = '取消';
                cancelBtn.variant = 'text';
                cancelBtn.addEventListener('click', function() {
                    dialog.open = false;
                    resolve(null);
                });
                dialog.appendChild(cancelBtn);
                
                var confirmBtn = document.createElement('mdui-button');
                confirmBtn.slot = 'action';
                confirmBtn.textContent = '确定';
                confirmBtn.variant = 'tonal';
                confirmBtn.addEventListener('click', function() {
                    setTimeout(function() {
                        if (!startDatePicker.value || !startTimePicker.value || !endDatePicker.value || !endTimePicker.value) {
                            resolve(null);
                            return;
                        }
                        dialog.open = false;
                        resolve(JSON.stringify({
                            start: startDatePicker.value + ' ' + startTimePicker.value,
                            end: endDatePicker.value + ' ' + endTimePicker.value
                        }));
                    }, 100);
                });
                dialog.appendChild(confirmBtn);
                
                dialog.addEventListener('closed', function() {
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    dialog.remove();
                });
                
                document.body.appendChild(dialog);
                setTimeout(function() {
                    dialog.open = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
                }, 100);
            });
        }

        async colorPicker(args) {
            return new Promise(function(resolve) {
                if (typeof mdui === 'undefined') { resolve(null); return; }
                
                var dialog = document.createElement('mdui-dialog');
                dialog.headline = args.t || '选择颜色';
                
                var body = document.createElement('div');
                body.style.cssText = 'padding: 16px 0; display: flex; justify-content: center;';
                
                var picker = document.createElement('mdui-color-picker');
                picker.value = args.c || '#6b7fd5';
                body.appendChild(picker);
                dialog.appendChild(body);
                
                var cancelBtn = document.createElement('mdui-button');
                cancelBtn.slot = 'action';
                cancelBtn.textContent = '取消';
                cancelBtn.variant = 'text';
                cancelBtn.addEventListener('click', function() {
                    dialog.open = false;
                    resolve(null);
                });
                dialog.appendChild(cancelBtn);
                
                var confirmBtn = document.createElement('mdui-button');
                confirmBtn.slot = 'action';
                confirmBtn.textContent = '确定';
                confirmBtn.variant = 'tonal';
                confirmBtn.addEventListener('click', function() {
                    var selectedValue = picker.value;
                    dialog.open = false;
                    resolve(selectedValue || null);
                });
                dialog.appendChild(confirmBtn);
                
                dialog.addEventListener('closed', function() {
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    dialog.remove();
                });
                
                document.body.appendChild(dialog);
                requestAnimationFrame(function() {
                    dialog.open = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
                });
            });
        }

        async ratingPrompt(args) {
            return new Promise(function(resolve) {
                if (typeof mdui === 'undefined') { resolve(null); return; }
                
                var dialog = document.createElement('mdui-dialog');
                dialog.headline = args.t || '请评分';
                
                var body = document.createElement('div');
                body.style.cssText = 'padding: 24px 0; text-align: center;';
                
                var rating = document.createElement('mdui-rating');
                rating.max = Cast.toNumber(args.m) || 5;
                rating.value = 0;
                body.appendChild(rating);
                dialog.appendChild(body);
                
                var cancelBtn = document.createElement('mdui-button');
                cancelBtn.slot = 'action';
                cancelBtn.textContent = '取消';
                cancelBtn.variant = 'text';
                cancelBtn.addEventListener('click', function() {
                    dialog.open = false;
                    resolve(null);
                });
                dialog.appendChild(cancelBtn);
                
                var confirmBtn = document.createElement('mdui-button');
                confirmBtn.slot = 'action';
                confirmBtn.textContent = '确定';
                confirmBtn.variant = 'tonal';
                confirmBtn.addEventListener('click', function() {
                    var selectedValue = rating.value;
                    dialog.open = false;
                    resolve(selectedValue !== undefined ? selectedValue : null);
                });
                dialog.appendChild(confirmBtn);
                
                dialog.addEventListener('closed', function() {
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    dialog.remove();
                });
                
                document.body.appendChild(dialog);
                requestAnimationFrame(function() {
                    dialog.open = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
                });
            });
        }

        async sliderPrompt(args) {
            return new Promise(function(resolve) {
                if (typeof mdui === 'undefined') { resolve(null); return; }
                
                var dialog = document.createElement('mdui-dialog');
                dialog.headline = args.t || '选择数值';
                
                var body = document.createElement('div');
                body.style.cssText = 'padding: 24px 0;';
                
                var slider = document.createElement('mdui-slider');
                slider.min = Cast.toNumber(args.min);
                slider.max = Cast.toNumber(args.max);
                slider.value = Cast.toNumber(args.val);
                
                var valueDisplay = document.createElement('div');
                valueDisplay.textContent = slider.value;
                valueDisplay.style.cssText = 'text-align: center; font-size: 24px; font-weight: bold; margin-top: 16px; color: var(--mdui-color-primary);';
                
                slider.addEventListener('input', function() {
                    valueDisplay.textContent = slider.value;
                });
                
                body.appendChild(slider);
                body.appendChild(valueDisplay);
                dialog.appendChild(body);
                
                var cancelBtn = document.createElement('mdui-button');
                cancelBtn.slot = 'action';
                cancelBtn.textContent = '取消';
                cancelBtn.variant = 'text';
                cancelBtn.addEventListener('click', function() {
                    dialog.open = false;
                    resolve(null);
                });
                dialog.appendChild(cancelBtn);
                
                var confirmBtn = document.createElement('mdui-button');
                confirmBtn.slot = 'action';
                confirmBtn.textContent = '确定';
                confirmBtn.variant = 'tonal';
                confirmBtn.addEventListener('click', function() {
                    var selectedValue = slider.value;
                    dialog.open = false;
                    resolve(selectedValue !== undefined ? selectedValue : null);
                });
                dialog.appendChild(confirmBtn);
                
                dialog.addEventListener('closed', function() {
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    dialog.remove();
                });
                
                document.body.appendChild(dialog);
                requestAnimationFrame(function() {
                    dialog.open = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
                });
            });
        }

        async switchPrompt(args) {
            return new Promise(function(resolve) {
                if (typeof mdui === 'undefined') { resolve(false); return; }
                
                var dialog = document.createElement('mdui-dialog');
                dialog.headline = args.t || '是否启用';
                
                var body = document.createElement('div');
                body.style.cssText = 'padding: 16px 0; display: flex; justify-content: center;';
                
                var switchEl = document.createElement('mdui-switch');
                switchEl.checked = Cast.toBoolean(args.d);
                body.appendChild(switchEl);
                dialog.appendChild(body);
                
                var cancelBtn = document.createElement('mdui-button');
                cancelBtn.slot = 'action';
                cancelBtn.textContent = '取消';
                cancelBtn.variant = 'text';
                cancelBtn.addEventListener('click', function() {
                    dialog.open = false;
                    resolve(false);
                });
                dialog.appendChild(cancelBtn);
                
                var confirmBtn = document.createElement('mdui-button');
                confirmBtn.slot = 'action';
                confirmBtn.textContent = '确定';
                confirmBtn.variant = 'tonal';
                confirmBtn.addEventListener('click', function() {
                    var selectedValue = switchEl.checked;
                    dialog.open = false;
                    resolve(selectedValue);
                });
                dialog.appendChild(confirmBtn);
                
                dialog.addEventListener('closed', function() {
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    dialog.remove();
                });
                
                document.body.appendChild(dialog);
                requestAnimationFrame(function() {
                    dialog.open = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
                });
            });
        }

        async checkboxGroup(args) {
            var options = parseList(args.o);
            
            return new Promise(function(resolve) {
                if (typeof mdui === 'undefined') { resolve(null); return; }
                
                var dialog = document.createElement('mdui-dialog');
                dialog.headline = args.t || '选择选项';
                
                var body = document.createElement('div');
                body.style.cssText = 'padding: 16px 0;';
                
                options.forEach(function(opt, index) {
                    var label = document.createElement('div');
                    label.style.cssText = 'margin-bottom: 12px; display: flex; align-items: center;';
                    
                    var checkbox = document.createElement('mdui-checkbox');
                    checkbox.value = typeof opt === 'object' ? opt.value : opt;
                    checkbox.innerHTML = typeof opt === 'object' ? opt.text : opt;
                    label.appendChild(checkbox);
                    body.appendChild(label);
                });
                
                dialog.appendChild(body);
                
                var cancelBtn = document.createElement('mdui-button');
                cancelBtn.slot = 'action';
                cancelBtn.textContent = '取消';
                cancelBtn.variant = 'text';
                cancelBtn.addEventListener('click', function() {
                    dialog.open = false;
                    resolve(null);
                });
                dialog.appendChild(cancelBtn);
                
                var confirmBtn = document.createElement('mdui-button');
                confirmBtn.slot = 'action';
                confirmBtn.textContent = '确定';
                confirmBtn.variant = 'tonal';
                confirmBtn.addEventListener('click', function() {
                    var checked = [];
                    body.querySelectorAll('mdui-checkbox').forEach(function(cb) {
                        if (cb.checked) {
                            checked.push(cb.value);
                        }
                    });
                    dialog.open = false;
                    resolve(JSON.stringify(checked));
                });
                dialog.appendChild(confirmBtn);
                
                dialog.addEventListener('closed', function() {
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    dialog.remove();
                });
                
                document.body.appendChild(dialog);
                requestAnimationFrame(function() {
                    dialog.open = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
                });
            });
        }

        async radioGroup(args) {
            var options = parseList(args.o);
            var groupName = 'mdui-radio-' + Date.now();
            
            return new Promise(function(resolve) {
                if (typeof mdui === 'undefined') { resolve(null); return; }
                
                var dialog = document.createElement('mdui-dialog');
                dialog.headline = args.t || '选择一项';
                
                var body = document.createElement('div');
                body.style.cssText = 'padding: 16px 0;';
                
                options.forEach(function(opt, index) {
                    var label = document.createElement('div');
                    label.style.cssText = 'margin-bottom: 12px; display: flex; align-items: center;';
                    
                    var radio = document.createElement('mdui-radio');
                    radio.name = groupName;
                    radio.value = typeof opt === 'object' ? opt.value : opt;
                    radio.innerHTML = typeof opt === 'object' ? opt.text : opt;
                    label.appendChild(radio);
                    body.appendChild(label);
                });
                
                dialog.appendChild(body);
                
                var cancelBtn = document.createElement('mdui-button');
                cancelBtn.slot = 'action';
                cancelBtn.textContent = '取消';
                cancelBtn.variant = 'text';
                cancelBtn.addEventListener('click', function() {
                    dialog.open = false;
                    resolve(null);
                });
                dialog.appendChild(cancelBtn);
                
                var confirmBtn = document.createElement('mdui-button');
                confirmBtn.slot = 'action';
                confirmBtn.textContent = '确定';
                confirmBtn.variant = 'tonal';
                confirmBtn.addEventListener('click', function() {
                    var checked = body.querySelector('mdui-radio[checked]');
                    dialog.open = false;
                    resolve(checked ? checked.value : null);
                });
                dialog.appendChild(confirmBtn);
                
                dialog.addEventListener('closed', function() {
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    dialog.remove();
                });
                
                document.body.appendChild(dialog);
                requestAnimationFrame(function() {
                    dialog.open = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
                });
            });
        }

        async singleSelect(args) {
            var options = parseList(args.o);
            
            return new Promise(function(resolve) {
                if (typeof mdui === 'undefined') { resolve(null); return; }
                
                var dialog = document.createElement('mdui-dialog');
                dialog.headline = args.t || '请选择';
                
                var body = document.createElement('div');
                body.style.cssText = 'padding: 8px 0;';
                
                var select = document.createElement('mdui-select');
                select.variant = 'outlined';
                select.style.width = '100%';
                
                options.forEach(function(opt, index) {
                    var item = document.createElement('mdui-menu-item');
                    item.value = String(index);
                    item.textContent = typeof opt === 'object' ? opt.text : opt;
                    select.appendChild(item);
                });
                
                body.appendChild(select);
                dialog.appendChild(body);
                
                var cancelBtn = document.createElement('mdui-button');
                cancelBtn.slot = 'action';
                cancelBtn.textContent = '取消';
                cancelBtn.variant = 'text';
                cancelBtn.addEventListener('click', function() {
                    dialog.open = false;
                    resolve(null);
                });
                dialog.appendChild(cancelBtn);
                
                var confirmBtn = document.createElement('mdui-button');
                confirmBtn.slot = 'action';
                confirmBtn.textContent = '确定';
                confirmBtn.variant = 'tonal';
                confirmBtn.addEventListener('click', function() {
                    var selectedIndex = parseInt(select.value);
                    var selected = options[selectedIndex];
                    dialog.open = false;
                    resolve(typeof selected === 'object' ? selected.value : selected);
                });
                dialog.appendChild(confirmBtn);
                
                dialog.addEventListener('closed', function() {
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    dialog.remove();
                });
                
                document.body.appendChild(dialog);
                requestAnimationFrame(function() {
                    dialog.open = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
                });
            });
        }

        async multiSelect(args) {
            var options = parseList(args.o);
            
            return new Promise(function(resolve) {
                if (typeof mdui === 'undefined') { resolve(null); return; }
                
                var dialog = document.createElement('mdui-dialog');
                dialog.headline = args.t || '多选';
                
                var body = document.createElement('div');
                body.style.cssText = 'padding: 8px 0;';
                
                var select = document.createElement('mdui-select');
                select.multiple = true;
                select.variant = 'outlined';
                select.style.width = '100%';
                
                options.forEach(function(opt, index) {
                    var item = document.createElement('mdui-menu-item');
                    item.value = String(index);
                    item.textContent = typeof opt === 'object' ? opt.text : opt;
                    select.appendChild(item);
                });
                
                body.appendChild(select);
                dialog.appendChild(body);
                
                var cancelBtn = document.createElement('mdui-button');
                cancelBtn.slot = 'action';
                cancelBtn.textContent = '取消';
                cancelBtn.variant = 'text';
                cancelBtn.addEventListener('click', function() {
                    dialog.open = false;
                    resolve(null);
                });
                dialog.appendChild(cancelBtn);
                
                var confirmBtn = document.createElement('mdui-button');
                confirmBtn.slot = 'action';
                confirmBtn.textContent = '确定';
                confirmBtn.variant = 'tonal';
                confirmBtn.addEventListener('click', function() {
                    var values = [];
                    select.value.forEach(function(idx) {
                        var opt = options[idx];
                        values.push(typeof opt === 'object' ? opt.value : opt);
                    });
                    dialog.open = false;
                    resolve(JSON.stringify(values));
                });
                dialog.appendChild(confirmBtn);
                
                dialog.addEventListener('closed', function() {
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    dialog.remove();
                });
                
                document.body.appendChild(dialog);
                requestAnimationFrame(function() {
                    dialog.open = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
                });
            });
        }

        async bottomNav(args) {
            var options = parseList(args.o);
            
            return new Promise(function(resolve) {
                if (typeof mdui === 'undefined') { resolve(null); return; }
                
                var dialog = document.createElement('mdui-dialog');
                dialog.headline = args.t || '导航';
                
                var body = document.createElement('div');
                body.style.cssText = 'padding: 16px 0; display: flex; justify-content: center;';
                
                var navContainer = document.createElement('div');
                navContainer.style.cssText = 'width: 100%; max-width: 400px; border-radius: 16px 16px 0 0; overflow: hidden; background: var(--mdui-color-surface-container-low);';
                
                var nav = document.createElement('mdui-navigation-bar');
                nav.style.width = '100%';
                
                options.forEach(function(opt, index) {
                    var item = document.createElement('mdui-navigation-bar-item');
                    item.value = String(index);
                    var text = typeof opt === 'object' ? opt.text : opt;
                    item.innerHTML = '<mdui-icon slot="icon" name="circle"></mdui-icon>' + text;
                    nav.appendChild(item);
                });
                
                navContainer.appendChild(nav);
                body.appendChild(navContainer);
                dialog.appendChild(body);
                
                var closeBtn = document.createElement('mdui-button');
                closeBtn.slot = 'action';
                closeBtn.textContent = '关闭';
                closeBtn.variant = 'text';
                closeBtn.addEventListener('click', function() {
                    dialog.open = false;
                    resolve(null);
                });
                dialog.appendChild(closeBtn);
                
                dialog.addEventListener('closed', function() {
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    dialog.remove();
                });
                
                document.body.appendChild(dialog);
                requestAnimationFrame(function() {
                    dialog.open = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
                });
            });
        }

        async actionSheet(args) {
            var options = parseList(args.o);
            
            return new Promise(function(resolve) {
                if (typeof mdui === 'undefined') { resolve(null); return; }
                
                var dialog = document.createElement('mdui-dialog');
                dialog.headline = args.t || '选择操作';
                
                var body = document.createElement('div');
                body.style.cssText = 'padding: 8px 0;';
                
                options.forEach(function(opt) {
                    var btn = document.createElement('mdui-button');
                    btn.textContent = typeof opt === 'object' ? opt.text : opt;
                    btn.variant = 'text';
                    btn.style.cssText = 'width: 100%; text-align: left;';
                    btn.addEventListener('click', function() {
                        dialog.open = false;
                        resolve(typeof opt === 'object' ? opt.value : opt);
                    });
                    body.appendChild(btn);
                });
                
                dialog.appendChild(body);
                
                var cancelBtn = document.createElement('mdui-button');
                cancelBtn.slot = 'action';
                cancelBtn.textContent = '取消';
                cancelBtn.variant = 'text';
                cancelBtn.addEventListener('click', function() {
                    dialog.open = false;
                    resolve(null);
                });
                dialog.appendChild(cancelBtn);
                
                dialog.addEventListener('closed', function() {
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    dialog.remove();
                });
                
                document.body.appendChild(dialog);
                requestAnimationFrame(function() {
                    dialog.open = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
                });
            });
        }

        async htmlDialog(args) {
            var buttons = parseList(args.b);
            
            return new Promise(function(resolve) {
                if (typeof mdui === 'undefined') { resolve(null); return; }
                
                var dialog = document.createElement('mdui-dialog');
                dialog.headline = args.t || '自定义';
                
                var body = document.createElement('div');
                body.innerHTML = sanitizeHTML(args.h);
                dialog.appendChild(body);
                
                var actions = buttons.map(function(btn) {
                    return {
                        text: typeof btn === 'object' ? btn.text : btn,
                        value: typeof btn === 'object' ? btn.value : btn,
                        variant: "tonal"
                    };
                });
                
                actions.forEach(function(act) {
                    var btn = document.createElement('mdui-button');
                    btn.slot = 'action';
                    btn.textContent = act.text;
                    btn.variant = act.variant;
                    btn.addEventListener('click', function() {
                        dialog.open = false;
                        resolve(act.value);
                    });
                    dialog.appendChild(btn);
                });
                
                dialog.addEventListener('closed', function() {
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    dialog.remove();
                });
                
                document.body.appendChild(dialog);
                requestAnimationFrame(function() {
                    dialog.open = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
                });
            });
        }

        async imageDialog(args) {
            var buttons = parseList(args.b);
            
            return new Promise(function(resolve) {
                if (typeof mdui === 'undefined') { resolve(null); return; }
                
                var dialog = document.createElement('mdui-dialog');
                dialog.headline = args.t || '图片';
                dialog.fullscreen = true;
                
                var body = document.createElement('div');
                body.style.cssText = 'text-align: center;';
                
                var img = document.createElement('img');
                img.src = args.u;
                img.style.cssText = 'max-width: 100%; max-height: 400px; border-radius: 8px;';
                body.appendChild(img);
                dialog.appendChild(body);
                
                var actions = buttons.map(function(btn) {
                    return {
                        text: typeof btn === 'object' ? btn.text : btn,
                        value: typeof btn === 'object' ? btn.value : btn,
                        variant: "tonal"
                    };
                });
                
                actions.forEach(function(act) {
                    var btn = document.createElement('mdui-button');
                    btn.slot = 'action';
                    btn.textContent = act.text;
                    btn.variant = act.variant;
                    btn.addEventListener('click', function() {
                        dialog.open = false;
                        resolve(act.value);
                    });
                    dialog.appendChild(btn);
                });
                
                dialog.addEventListener('closed', function() {
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    dialog.remove();
                });
                
                document.body.appendChild(dialog);
                requestAnimationFrame(function() {
                    dialog.open = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
                });
            });
        }

        async videoDialog(args) {
            return new Promise(function(resolve) {
                if (typeof mdui === 'undefined') { resolve(null); return; }
                
                var dialog = document.createElement('mdui-dialog');
                dialog.headline = args.t || '视频';
                dialog.fullscreen = true;
                
                var body = document.createElement('div');
                body.style.cssText = 'width: 100%;';
                
                var video = document.createElement('video');
                video.src = args.u;
                video.controls = true;
                video.style.cssText = 'width: 100%; max-height: 400px; border-radius: 8px;';
                body.appendChild(video);
                dialog.appendChild(body);
                
                var closeBtn = document.createElement('mdui-button');
                closeBtn.slot = 'action';
                closeBtn.textContent = '关闭';
                closeBtn.variant = 'text';
                closeBtn.addEventListener('click', function() {
                    dialog.open = false;
                    resolve('closed');
                });
                dialog.appendChild(closeBtn);
                
                dialog.addEventListener('closed', function() {
                    if (runtime) runtime.startHats('mduiPro_whenDialogClosed');
                    dialog.remove();
                });
                
                document.body.appendChild(dialog);
                requestAnimationFrame(function() {
                    dialog.open = true;
                    if (runtime) runtime.startHats('mduiPro_whenDialogOpened');
                });
            });
        }

        showLoading(args) {
            if (typeof mdui === 'undefined') return;
            this.hideLoading();
            
            var overlay = document.createElement('div');
            overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 99999; display: flex; justify-content: center; align-items: center;';
            overlay.setAttribute('data-type', 'loading');
            
            var dialog = document.createElement('div');
            dialog.style.cssText = 'background: white; padding: 32px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
            
            var spinner = document.createElement('div');
            spinner.style.cssText = 'width: 48px; height: 48px; border: 4px solid #f0f0f0; border-top: 4px solid #6b7fd5; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;';
            
            var style = document.createElement('style');
            style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
            document.head.appendChild(style);
            
            var text = document.createElement('div');
            text.textContent = args.t || '加载中...';
            text.style.cssText = 'font-size: 14px; color: #666;';
            
            dialog.appendChild(spinner);
            dialog.appendChild(text);
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
            
            this.loadingDialog = overlay;
        }

        hideLoading() {
            if (this.loadingDialog) {
                document.body.removeChild(this.loadingDialog);
                this.loadingDialog = null;
            }
        }

        showLinearProgress(args) {
            if (typeof mdui === 'undefined') return;
            this.hideProgress();
            
            var overlay = document.createElement('div');
            overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 99999; display: flex; justify-content: center; align-items: center;';
            overlay.setAttribute('data-type', 'progress');
            
            var dialog = document.createElement('div');
            dialog.style.cssText = 'background: white; padding: 24px; border-radius: 12px; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
            
            if (args.t) {
                var title = document.createElement('div');
                title.textContent = args.t;
                title.style.cssText = 'font-size: 16px; font-weight: 500; margin-bottom: 16px;';
                dialog.appendChild(title);
            }
            
            var progressBar = document.createElement('div');
            progressBar.style.cssText = 'width: 100%; height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden;';
            
            var progressFill = document.createElement('div');
            progressFill.style.cssText = 'height: 100%; background: #6b7fd5; transition: width 0.3s;';
            progressFill.style.width = Cast.toNumber(args.p) + '%';
            
            progressBar.appendChild(progressFill);
            dialog.appendChild(progressBar);
            
            if (args.d) {
                var desc = document.createElement('div');
                desc.textContent = args.d;
                desc.style.cssText = 'font-size: 12px; color: #999; margin-top: 12px;';
                dialog.appendChild(desc);
            }
            
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
            
            this.progressDialog = overlay;
            this.progressFill = progressFill;
        }

        showCircularProgress(args) {
            if (typeof mdui === 'undefined') return;
            this.hideProgress();
            
            var overlay = document.createElement('div');
            overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 99999; display: flex; justify-content: center; align-items: center;';
            overlay.setAttribute('data-type', 'progress');
            
            var dialog = document.createElement('div');
            dialog.style.cssText = 'background: white; padding: 24px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
            
            if (args.t) {
                var title = document.createElement('div');
                title.textContent = args.t;
                title.style.cssText = 'font-size: 16px; font-weight: 500; margin-bottom: 16px;';
                dialog.appendChild(title);
            }
            
            var circleContainer = document.createElement('div');
            circleContainer.style.cssText = 'position: relative; width: 64px; height: 64px; margin: 0 auto;';
            
            var circle = document.createElement('svg');
            circle.setAttribute('width', '64');
            circle.setAttribute('height', '64');
            circle.style.cssText = 'transform: rotate(-90deg);';
            
            var circleBg = document.createElement('circle');
            circleBg.setAttribute('cx', '32');
            circleBg.setAttribute('cy', '32');
            circleBg.setAttribute('r', '28');
            circleBg.setAttribute('fill', 'none');
            circleBg.setAttribute('stroke', '#f0f0f0');
            circleBg.setAttribute('stroke-width', '4');
            
            var circleFill = document.createElement('circle');
            circleFill.setAttribute('cx', '32');
            circleFill.setAttribute('cy', '32');
            circleFill.setAttribute('r', '28');
            circleFill.setAttribute('fill', 'none');
            circleFill.setAttribute('stroke', '#6b7fd5');
            circleFill.setAttribute('stroke-width', '4');
            circleFill.setAttribute('stroke-dasharray', '175.93');
            circleFill.setAttribute('stroke-dashoffset', 175.93 * (1 - Cast.toNumber(args.p) / 100));
            circleFill.style.cssText = 'transition: stroke-dashoffset 0.3s;';
            
            circle.appendChild(circleBg);
            circle.appendChild(circleFill);
            circleContainer.appendChild(circle);
            dialog.appendChild(circleContainer);
            
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
            
            this.progressDialog = overlay;
            this.progressCircle = circleFill;
        }

        updateProgress(args) {
            if (this.progressFill) {
                this.progressFill.style.width = Cast.toNumber(args.p) + '%';
            }
            if (this.progressCircle) {
                this.progressCircle.setAttribute('stroke-dashoffset', 175.93 * (1 - Cast.toNumber(args.p) / 100));
            }
        }

        hideProgress() {
            if (this.progressDialog) {
                document.body.removeChild(this.progressDialog);
                this.progressDialog = null;
                this.progressFill = null;
                this.progressCircle = null;
                if (this.runtime) this.runtime.startHats('mduiPro_whenDialogClosed');
            }
        }

        snackbar(args) {
            if (typeof mdui !== 'undefined') {
                mdui.snackbar({
                    message: args.t,
                    placement: args.p || 'bottom',
                    duration: Cast.toNumber(args.d) || 3000
                });
            }
        }

        snackbarAction(args) {
            var self = this;
            if (typeof mdui !== 'undefined') {
                mdui.snackbar({
                    message: args.t,
                    action: args.b,
                    duration: Cast.toNumber(args.d) || 5000,
                    onActionClick: function() {
                        if (self.runtime) self.runtime.startHats('mduiPro_whenSnackbarAction');
                    }
                });
            }
        }

        toast(args) {
            if (typeof mdui !== 'undefined') {
                mdui.snackbar({
                    message: args.t,
                    duration: Cast.toNumber(args.d) || 2000,
                    placement: 'top'
                });
            } else {
                alert(args.t);
            }
        }

        whenDialogOpened() { return true; }
        whenDialogClosed() { return true; }
        whenFabClicked() { return true; }
        whenDrawerClosed() { return true; }
        whenSnackbarAction() { return true; }

        showFab(args) {
            this.hideFab();
            
            var fab = document.createElement('button');
            fab.textContent = '+';
            fab.style.cssText = 'position: fixed; z-index: 1000; width: 56px; height: 56px; border-radius: 50%; background: #6b7fd5; color: white; border: none; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center;';
            
            var pos = (args.p || 'bottom-right').split('-');
            fab.style[pos[0]] = '24px';
            fab.style[pos[1]] = '24px';
            
            var self = this;
            fab.addEventListener('click', function() {
                if (self.runtime) self.runtime.startHats('mduiPro_whenFabClicked');
            });
            
            document.body.appendChild(fab);
            this.fabElement = fab;
        }

        hideFab() {
            if (this.fabElement) {
                document.body.removeChild(this.fabElement);
                this.fabElement = null;
            }
        }

        showDrawer(args) {
            this.hideDrawer();
            
            var overlay = document.createElement('div');
            overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 99998;';
            
            var drawer = document.createElement('div');
            drawer.style.cssText = 'position: fixed; top: 0; ' + (args.p === 'right' ? 'right: 0' : 'left: 0') + '; width: 280px; height: 100%; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 99999; transition: transform 0.3s;';
            
            var header = document.createElement('div');
            header.textContent = args.t || '菜单';
            header.style.cssText = 'padding: 16px; font-size: 1.2em; font-weight: bold; border-bottom: 1px solid #eee;';
            drawer.appendChild(header);
            
            var content = document.createElement('div');
            content.innerHTML = sanitizeHTML(args.c || '内容');
            content.style.cssText = 'padding: 16px; overflow-y: auto;';
            drawer.appendChild(content);
            
            var self = this;
            overlay.addEventListener('click', function() {
                drawer.style.transform = args.p === 'right' ? 'translateX(100%)' : 'translateX(-100%)';
                setTimeout(function() {
                    if (drawer.parentNode) document.body.removeChild(drawer);
                    if (overlay.parentNode) document.body.removeChild(overlay);
                    self.drawerElement = null;
                    if (self.runtime) self.runtime.startHats('mduiPro_whenDrawerClosed');
                }, 300);
            });
            
            document.body.appendChild(overlay);
            document.body.appendChild(drawer);
            this.drawerElement = drawer;
        }

        hideDrawer() {
            if (this.drawerElement) {
                var drawer = this.drawerElement;
                drawer.style.transform = 'translateX(-100%)';
                setTimeout(function() {
                    if (drawer.parentNode) document.body.removeChild(drawer);
                }, 300);
                this.drawerElement = null;
            }
        }

        showBottomNavigation(args) {
            this.hideBottomNavigation();
            
            var options = parseList(args.o);
            var nav = document.createElement('div');
            nav.style.cssText = 'position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; background: white; box-shadow: 0 -2px 8px rgba(0,0,0,0.1); display: flex; justify-content: space-around; padding: 8px 0;';
            
            options.forEach(function(opt, index) {
                var item = document.createElement('button');
                item.textContent = typeof opt === 'object' ? opt.text : opt;
                item.style.cssText = 'padding: 8px 16px; border: none; background: none; cursor: pointer; font-size: 14px; color: #666;';
                item.addEventListener('click', function() {
                    nav.querySelectorAll('button').forEach(function(b) {
                        b.style.color = '#666';
                        b.style.fontWeight = 'normal';
                    });
                    item.style.color = '#6b7fd5';
                    item.style.fontWeight = 'bold';
                });
                nav.appendChild(item);
            });
            
            document.body.appendChild(nav);
            this.bottomNavElement = nav;
        }

        hideBottomNavigation() {
            if (this.bottomNavElement) {
                document.body.removeChild(this.bottomNavElement);
                this.bottomNavElement = null;
            }
        }

        async copyToClipboard(args) {
            try {
                await navigator.clipboard.writeText(args.t);
                this.toast({ t: '✅ 已复制到剪贴板', d: 2000 });
            } catch (err) {
                var ta = document.createElement('textarea');
                ta.value = args.t;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                this.toast({ t: '✅ 已复制', d: 2000 });
            }
        }

        async getClipboard() {
            try {
                return await navigator.clipboard.readText();
            } catch (err) {
                return '';
            }
        }

        vibrate(args) {
            try {
                var pattern = String(args.p).split(',').map(Number);
                if (navigator.vibrate) navigator.vibrate(pattern.length === 1 ? pattern[0] : pattern);
            } catch (e) {
                console.warn('[mduiPro] 震动失败:', e);
            }
        }

        getDeviceType() {
            return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
        }

        isOnline() {
            return navigator.onLine;
        }

        getWindowSize(args) {
            return args.t === 'width' ? window.innerWidth : window.innerHeight;
        }

        getSystemTheme() {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        getOrientation() {
            if (window.screen.orientation) return window.screen.orientation.type;
            return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        }

        setTheme(args) {
            const root = document.documentElement;
            if (args.t === 'dark') {
                root.setAttribute('data-mdui-theme', 'dark');
            } else if (args.t === 'light') {
                root.setAttribute('data-mdui-theme', 'light');
            } else {
                root.removeAttribute('data-mdui-theme');
            }
        }

        setColorScheme(args) {
            const root = document.documentElement;
            root.style.setProperty('--mdui-color-primary', args.c);
            root.style.setProperty('--mdui-color-on-primary', '#ffffff');
            root.style.setProperty('--mdui-color-primary-container', args.c + '33');
        }

        removeColorScheme() {
            const root = document.documentElement;
            root.style.removeProperty('--mdui-color-primary');
            root.style.removeProperty('--mdui-color-on-primary');
            root.style.removeProperty('--mdui-color-primary-container');
        }

        setCustomProperty(args) {
            document.documentElement.style.setProperty(args.p, args.v);
        }

        injectCSS(args) {
            var cleanCSS = sanitizeCSS(args.c);
            if (!cleanCSS) return;
            var style = document.createElement('style');
            style.textContent = cleanCSS;
            document.head.appendChild(style);
        }

        px(args) { return Cast.toNumber(args.v) + 'px'; }
        rem(args) { return Cast.toNumber(args.v) + 'rem'; }
        rgba(args) {
            var alpha = Cast.toNumber(args.a);
            return alpha < 1 ? 'rgba(' + Cast.toNumber(args.r) + ', ' + Cast.toNumber(args.g) + ', ' + Cast.toNumber(args.b) + ', ' + alpha + ')' : 'rgb(' + Cast.toNumber(args.r) + ', ' + Cast.toNumber(args.g) + ', ' + Cast.toNumber(args.b) + ')';
        }
        hsla(args) {
            var alpha = Cast.toNumber(args.a);
            return alpha < 1 ? 'hsla(' + Cast.toNumber(args.h) + ', ' + Cast.toNumber(args.s) + '%, ' + Cast.toNumber(args.l) + '%, ' + alpha + ')' : 'hsl(' + Cast.toNumber(args.h) + ', ' + Cast.toNumber(args.s) + '%, ' + Cast.toNumber(args.l) + ')';
        }
        hexToRgba(args) {
            var hex = args.c.replace('#', '');
            var r = parseInt(hex.substring(0, 2), 16);
            var g = parseInt(hex.substring(2, 4), 16);
            var b = parseInt(hex.substring(4, 6), 16);
            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + Cast.toNumber(args.a) + ')';
        }

        closeAllDialogs() {
            document.querySelectorAll('[data-type="loading"], [data-type="progress"]').forEach(function(el) {
                if (el.parentNode) el.parentNode.removeChild(el);
            });
            if (this.runtime) this.runtime.startHats('mduiPro_whenDialogClosed');
        }

        closeAllSnackbar() {
            // Snackbar 会自动消失，无需手动关闭
        }

        getInfo() {
            return {
                id: "mduiPro",
                name: "mduiPro",
                description: "强大的 Material Design 3 UI 组件库扩展",
                color1: "#6b7fd5",
                color2: "#5463b0",
                blockIconURI: UNIFIED_ICON,
                menuIconURI: UNIFIED_ICON,
                blocks: [
                    { blockType: BlockType.LABEL, text: "──────────────────" },
                    { blockType: BlockType.LABEL, text: "🎨 主题与多风格管理（正在开发，请勿使用）" },
                    { opcode: "applyPresetTheme", blockType: BlockType.COMMAND, text: " 应用预设风格 [preset]", arguments: { preset: { type: ArgumentType.STRING, defaultValue: "default", menu: "themePresets" } } },
                    { opcode: "setCustomTheme", blockType: BlockType.COMMAND, text: "⚙️ 自定义主题 模式 [mode] 主色 [primary]", arguments: { mode: { type: ArgumentType.STRING, defaultValue: "auto", menu: "themeMode" }, primary: { type: ArgumentType.COLOR, defaultValue: "#6b7fd5" } } },
                    { opcode: "getCurrentThemeConfig", blockType: BlockType.REPORTER, text: " 获取当前主题配置 (JSON)" },
                    { opcode: "applyThemeConfig", blockType: BlockType.COMMAND, text: "📤 应用主题配置 [json]", arguments: { json: { type: ArgumentType.STRING, defaultValue: "" } } },
                    { blockType: BlockType.LABEL, text: "──────────────────" },
                    { blockType: BlockType.LABEL, text: " 基础弹窗" },
                    { opcode: "alert", blockType: BlockType.COMMAND, text: "弹窗 标题[t] 内容[d] 按钮[c]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "提示" }, d: { type: ArgumentType.STRING, defaultValue: "这是一个提示" }, c: { type: ArgumentType.STRING, defaultValue: "确定" } } },
                    { opcode: "confirm", blockType: BlockType.BOOLEAN, text: "询问 标题[t] 内容[d] 取消[c1] 确定[c2]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "确认" }, d: { type: ArgumentType.STRING, defaultValue: "确定要执行此操作吗？" }, c1: { type: ArgumentType.STRING, defaultValue: "取消" }, c2: { type: ArgumentType.STRING, defaultValue: "确定" } } },
                    { opcode: "prompt", blockType: BlockType.REPORTER, text: "输入框 标题[t] 提示[l] 默认值[v]", allowDropAnywhere: true, arguments: { t: { type: ArgumentType.STRING, defaultValue: "输入" }, l: { type: ArgumentType.STRING, defaultValue: "请输入内容" }, v: { type: ArgumentType.STRING, defaultValue: "" } } },
                    { opcode: "textInput", blockType: BlockType.REPORTER, text: "多行输入 标题[t] 提示[l] 默认值[v] 行数[r]", allowDropAnywhere: true, arguments: { t: { type: ArgumentType.STRING, defaultValue: "多行输入" }, l: { type: ArgumentType.STRING, defaultValue: "请输入" }, v: { type: ArgumentType.STRING, defaultValue: "" }, r: { type: ArgumentType.NUMBER, defaultValue: 3 } } },
                    { blockType: BlockType.LABEL, text: "📅 日期时间选择" },
                    { opcode: "datePicker", blockType: BlockType.REPORTER, text: "📅 日期选择 标题[t]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "选择日期" } } },
                    { opcode: "timePicker", blockType: BlockType.REPORTER, text: "⏰ 时间选择 标题[t] 格式[f]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "选择时间" }, f: { type: ArgumentType.STRING, defaultValue: "24", menu: "timeFormat" } } },
                    { opcode: "dateTimePicker", blockType: BlockType.REPORTER, text: " 日期时间选择 标题[t]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "选择日期时间" } } },
                    { opcode: "customTimePicker", blockType: BlockType.REPORTER, text: "⏱️ 自定义时间段 标题[t] 时间段[s]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "选择时间段" }, s: { type: ArgumentType.STRING, defaultValue: "[\"09:00\",\"10:00\",\"11:00\",\"14:00\",\"15:00\"]" } } },
                    { opcode: "dateRangePicker", blockType: BlockType.REPORTER, text: "📅 日期范围选择 标题[t]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "选择日期范围" } } },
                    { opcode: "dateTimeRangePicker", blockType: BlockType.REPORTER, text: " 日期时间范围 标题[t]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "选择日期时间范围" } } },
                    { blockType: BlockType.LABEL, text: " 高级选择器" },
                    { opcode: "colorPicker", blockType: BlockType.REPORTER, text: "🎨 颜色选择 标题[t] 默认值[c]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "选择颜色" }, c: { type: ArgumentType.COLOR, defaultValue: "#6b7fd5" } } },
                    { opcode: "ratingPrompt", blockType: BlockType.REPORTER, text: "⭐ 星级评分 标题[t] 最大星数[m]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "请评分" }, m: { type: ArgumentType.NUMBER, defaultValue: 5 } } },
                    { opcode: "sliderPrompt", blockType: BlockType.REPORTER, text: "📊 滑块选择 标题[t] 最小[min] 最大[max] 默认[val]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "选择数值" }, min: { type: ArgumentType.NUMBER, defaultValue: 0 }, max: { type: ArgumentType.NUMBER, defaultValue: 100 }, val: { type: ArgumentType.NUMBER, defaultValue: 50 } } },
                    { opcode: "switchPrompt", blockType: BlockType.BOOLEAN, text: "🔘 开关选择 标题[t] 默认[d]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "是否启用" }, d: { type: ArgumentType.STRING, defaultValue: "false", menu: "trueFalse" } } },
                    { opcode: "checkboxGroup", blockType: BlockType.REPORTER, text: "☑️ 复选框组 标题[t] 选项[o]", allowDropAnywhere: true, arguments: { t: { type: ArgumentType.STRING, defaultValue: "选择选项" }, o: { type: ArgumentType.STRING, defaultValue: "[\"选项1\",\"选项2\",\"选项3\"]" } } },
                    { opcode: "radioGroup", blockType: BlockType.REPORTER, text: " 单选框组 标题[t] 选项[o]", allowDropAnywhere: true, arguments: { t: { type: ArgumentType.STRING, defaultValue: "选择一项" }, o: { type: ArgumentType.STRING, defaultValue: "[\"选项A\",\"选项B\",\"选项C\"]" } } },
                    { blockType: BlockType.LABEL, text: "📋 选择对话框" },
                    { opcode: "singleSelect", blockType: BlockType.REPORTER, text: "单选对话框 标题[t] 选项[o]", allowDropAnywhere: true, arguments: { t: { type: ArgumentType.STRING, defaultValue: "请选择" }, o: { type: ArgumentType.STRING, defaultValue: "[\"选项1\",\"选项2\",\"选项3\"]" } } },
                    { opcode: "multiSelect", blockType: BlockType.REPORTER, text: "多选对话框 标题[t] 选项[o]", allowDropAnywhere: true, arguments: { t: { type: ArgumentType.STRING, defaultValue: "多选" }, o: { type: ArgumentType.STRING, defaultValue: "[\"选项1\",\"选项2\",\"选项3\"]" } } },
                    { opcode: "bottomNav", blockType: BlockType.REPORTER, text: "📱 底部导航 标题[t] 选项[o]", allowDropAnywhere: true, arguments: { t: { type: ArgumentType.STRING, defaultValue: "导航" }, o: { type: ArgumentType.STRING, defaultValue: "[\"首页\",\"发现\",\"我的\"]" } } },
                    { opcode: "actionSheet", blockType: BlockType.REPORTER, text: "📄 底部操作栏 标题[t] 选项[o]", allowDropAnywhere: true, arguments: { t: { type: ArgumentType.STRING, defaultValue: "选择操作" }, o: { type: ArgumentType.STRING, defaultValue: "[\"分享\",\"收藏\",\"删除\"]" } } },
                    { blockType: BlockType.LABEL, text: "🌐 HTML/媒体对话框" },
                    { opcode: "htmlDialog", blockType: BlockType.REPORTER, text: "HTML对话框 标题[t] 内容[h] 按钮[b]", allowDropAnywhere: true, arguments: { t: { type: ArgumentType.STRING, defaultValue: "自定义" }, h: { type: ArgumentType.STRING, defaultValue: "<p>安全HTML内容</p>" }, b: { type: ArgumentType.STRING, defaultValue: "[\"确定\"]" } } },
                    { opcode: "imageDialog", blockType: BlockType.COMMAND, text: "图片对话框 标题[t] 图片[u] 按钮[b]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "图片" }, u: { type: ArgumentType.STRING, defaultValue: "https://example.com/image.jpg" }, b: { type: ArgumentType.STRING, defaultValue: "[\"关闭\"]" } } },
                    { opcode: "videoDialog", blockType: BlockType.COMMAND, text: "视频对话框 标题[t] 视频[u]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "视频" }, u: { type: ArgumentType.STRING, defaultValue: "https://example.com/video.mp4" } } },
                    { blockType: BlockType.LABEL, text: "⏳ 进度和加载" },
                    { opcode: "showLoading", blockType: BlockType.COMMAND, text: "显示加载框 文本[t]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "加载中..." } } },
                    { opcode: "hideLoading", blockType: BlockType.COMMAND, text: "隐藏加载框" },
                    { opcode: "showLinearProgress", blockType: BlockType.COMMAND, text: "显示线性进度 标题[t] 进度[p] 描述[d]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "加载中" }, p: { type: ArgumentType.NUMBER, defaultValue: 0 }, d: { type: ArgumentType.STRING, defaultValue: "请稍候..." } } },
                    { opcode: "showCircularProgress", blockType: BlockType.COMMAND, text: "显示环形进度 标题[t] 进度[p]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "加载中" }, p: { type: ArgumentType.NUMBER, defaultValue: 0 } } },
                    { opcode: "updateProgress", blockType: BlockType.COMMAND, text: "更新进度 值[p]", arguments: { p: { type: ArgumentType.NUMBER, defaultValue: 50 } } },
                    { opcode: "hideProgress", blockType: BlockType.COMMAND, text: "隐藏进度" },
                    { blockType: BlockType.LABEL, text: "💬 提示消息" },
                    { opcode: "snackbar", blockType: BlockType.COMMAND, text: "底部提示 文本[t] 时长[d] 位置[p]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "提示信息" }, d: { type: ArgumentType.NUMBER, defaultValue: 3000 }, p: { type: ArgumentType.STRING, defaultValue: "bottom", menu: "snackbarPlacement" } } },
                    { opcode: "snackbarAction", blockType: BlockType.COMMAND, text: "带按钮提示 文本[t] 按钮[b] 时长[d]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "操作成功" }, b: { type: ArgumentType.STRING, defaultValue: "撤销" }, d: { type: ArgumentType.NUMBER, defaultValue: 5000 } } },
                    { opcode: "toast", blockType: BlockType.COMMAND, text: "Toast提示 文本[t] 时长[d]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "提示" }, d: { type: ArgumentType.NUMBER, defaultValue: 2000 } } },
                    { blockType: BlockType.LABEL, text: "🎪 事件（帽子积木）" },
                    { opcode: "whenDialogOpened", blockType: BlockType.HAT, text: "当弹窗被打开", isEdgeActivated: false },
                    { opcode: "whenDialogClosed", blockType: BlockType.HAT, text: "当弹窗被关闭", isEdgeActivated: false },
                    { opcode: "whenFabClicked", blockType: BlockType.HAT, text: "当悬浮按钮被点击", isEdgeActivated: false },
                    { opcode: "whenDrawerClosed", blockType: BlockType.HAT, text: "当侧边抽屉关闭", isEdgeActivated: false },
                    { opcode: "whenSnackbarAction", blockType: BlockType.HAT, text: "当Snackbar按钮被点击", isEdgeActivated: false },
                    { blockType: BlockType.LABEL, text: "🔘 悬浮按钮和抽屉" },
                    { opcode: "showFab", blockType: BlockType.COMMAND, text: "显示悬浮按钮 图标[i] 位置[p]", arguments: { i: { type: ArgumentType.STRING, defaultValue: "add", menu: "materialIcons" }, p: { type: ArgumentType.STRING, defaultValue: "bottom-right", menu: "fabPlacement" } } },
                    { opcode: "hideFab", blockType: BlockType.COMMAND, text: "隐藏悬浮按钮" },
                    { opcode: "showDrawer", blockType: BlockType.COMMAND, text: "打开侧边抽屉 标题[t] 内容[c] 位置[p]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "菜单" }, c: { type: ArgumentType.STRING, defaultValue: "内容" }, p: { type: ArgumentType.STRING, defaultValue: "left", menu: "drawerPlacement" } } },
                    { opcode: "hideDrawer", blockType: BlockType.COMMAND, text: "关闭侧边抽屉" },
                    { opcode: "showBottomNavigation", blockType: BlockType.COMMAND, text: "显示底部导航 标题[t] 选项[o]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "底部导航" }, o: { type: ArgumentType.STRING, defaultValue: "[\"首页\",\"发现\",\"我的\"]" } } },
                    { opcode: "hideBottomNavigation", blockType: BlockType.COMMAND, text: "隐藏底部导航" },
                    { blockType: BlockType.LABEL, text: "🔧 系统和设备" },
                    { opcode: "copyToClipboard", blockType: BlockType.COMMAND, text: "复制到剪贴板 文本[t]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "复制内容" } } },
                    { opcode: "getClipboard", blockType: BlockType.REPORTER, text: "获取剪贴板内容" },
                    { opcode: "vibrate", blockType: BlockType.COMMAND, text: "设备震动 模式[p]", arguments: { p: { type: ArgumentType.STRING, defaultValue: "100" } } },
                    { opcode: "getDeviceType", blockType: BlockType.REPORTER, text: "获取设备类型" },
                    { opcode: "isOnline", blockType: BlockType.BOOLEAN, text: "是否联网" },
                    { opcode: "getWindowSize", blockType: BlockType.REPORTER, text: "窗口尺寸 类型[t]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "width", menu: "windowSize" } } },
                    { opcode: "getSystemTheme", blockType: BlockType.REPORTER, text: "系统主题" },
                    { opcode: "getOrientation", blockType: BlockType.REPORTER, text: "获取屏幕方向" },
                    { blockType: BlockType.LABEL, text: " 主题和样式" },
                    { opcode: "setTheme", blockType: BlockType.COMMAND, text: "设置主题 主题[t]", arguments: { t: { type: ArgumentType.STRING, defaultValue: "auto", menu: "theme" } } },
                    { opcode: "setColorScheme", blockType: BlockType.COMMAND, text: "设置主题色 颜色[c]", arguments: { c: { type: ArgumentType.COLOR, defaultValue: "#6b7fd5" } } },
                    { opcode: "removeColorScheme", blockType: BlockType.COMMAND, text: "移除主题色" },
                    { opcode: "setCustomProperty", blockType: BlockType.COMMAND, text: "✅ 设置CSS变量 属性[p] 值[v]", arguments: { p: { type: ArgumentType.STRING, defaultValue: "--mdui-color-primary" }, v: { type: ArgumentType.STRING, defaultValue: "#6b7fd5" } } },
                    { opcode: "injectCSS", blockType: BlockType.COMMAND, text: "⚠️ 注入CSS 代码[c]", arguments: { c: { type: ArgumentType.STRING, defaultValue: "mdui-dialog { border-radius: 16px; }" } } },
                    { blockType: BlockType.LABEL, text: "🛠️ 工具函数" },
                    { opcode: "px", blockType: BlockType.REPORTER, text: "像素值 [v] px", arguments: { v: { type: ArgumentType.NUMBER, defaultValue: 16 } } },
                    { opcode: "rem", blockType: BlockType.REPORTER, text: "REM值 [v] rem", arguments: { v: { type: ArgumentType.NUMBER, defaultValue: 1 } } },
                    { opcode: "rgba", blockType: BlockType.REPORTER, text: "RGBA颜色 R[r] G[g] B[b] A[a]", arguments: { r: { type: ArgumentType.NUMBER, defaultValue: 107, min: 0, max: 255 }, g: { type: ArgumentType.NUMBER, defaultValue: 127, min: 0, max: 255 }, b: { type: ArgumentType.NUMBER, defaultValue: 213, min: 0, max: 255 }, a: { type: ArgumentType.NUMBER, defaultValue: 1, min: 0, max: 1 } } },
                    { opcode: "hsla", blockType: BlockType.REPORTER, text: "HSLA颜色 H[h] S[s] L[l] A[a]", arguments: { h: { type: ArgumentType.NUMBER, defaultValue: 250, min: 0, max: 360 }, s: { type: ArgumentType.NUMBER, defaultValue: 70, min: 0, max: 100 }, l: { type: ArgumentType.NUMBER, defaultValue: 60, min: 0, max: 100 }, a: { type: ArgumentType.NUMBER, defaultValue: 1, min: 0, max: 1 } } },
                    { opcode: "hexToRgba", blockType: BlockType.REPORTER, text: "十六进制转RGBA 颜色[c] 透明度[a]", arguments: { c: { type: ArgumentType.COLOR, defaultValue: "#6b7fd5" }, a: { type: ArgumentType.NUMBER, defaultValue: 0.8, min: 0, max: 1 } } },
                    { opcode: "closeAllDialogs", blockType: BlockType.COMMAND, text: "关闭所有弹窗" },
                    { opcode: "closeAllSnackbar", blockType: BlockType.COMMAND, text: "关闭所有Snackbar" }
                ],
                menus: {
                    themePresets: {
                        acceptReporters: true,
                        items: [
                            { text: "默认蓝", value: "default" },
                            { text: "暗夜紫", value: "dark-purple" },
                            { text: "海洋蓝", value: "ocean-blue" },
                            { text: "森林绿", value: "forest-green" },
                            { text: "落日橙", value: "sunset-orange" },
                            { text: "赛博朋克", value: "cyberpunk" },
                            { text: "玫瑰粉", value: "rose-pink" },
                            { text: "午夜蓝", value: "midnight-blue" }
                        ]
                    },
                    themeMode: {
                        acceptReporters: true,
                        items: [
                            { text: "跟随系统", value: "auto" },
                            { text: "亮色模式", value: "light" },
                            { text: "暗色模式", value: "dark" }
                        ]
                    },
                    theme: {
                        acceptReporters: true,
                        items: [
                            { text: "跟随系统", value: "auto" },
                            { text: "亮色模式", value: "light" },
                            { text: "暗色模式", value: "dark" }
                        ]
                    },
                    timeFormat: {
                        acceptReporters: true,
                        items: [
                            { text: "24小时制", value: "24" },
                            { text: "12小时制", value: "12" }
                        ]
                    },
                    trueFalse: {
                        acceptReporters: true,
                        items: [
                            { text: "开启", value: "true" },
                            { text: "关闭", value: "false" }
                        ]
                    },
                    snackbarPlacement: {
                        acceptReporters: true,
                        items: [
                            { text: "底部", value: "bottom" },
                            { text: "顶部", value: "top" },
                            { text: "左上", value: "top-left" },
                            { text: "右上", value: "top-right" },
                            { text: "左下", value: "bottom-left" },
                            { text: "右下", value: "bottom-right" }
                        ]
                    },
                    fabPlacement: {
                        acceptReporters: true,
                        items: [
                            { text: "右下", value: "bottom-right" },
                            { text: "左下", value: "bottom-left" },
                            { text: "右上", value: "top-right" },
                            { text: "左上", value: "top-left" }
                        ]
                    },
                    drawerPlacement: {
                        acceptReporters: true,
                        items: [
                            { text: "左侧", value: "left" },
                            { text: "右侧", value: "right" }
                        ]
                    },
                    windowSize: {
                        acceptReporters: true,
                        items: [
                            { text: "宽度", value: "width" },
                            { text: "高度", value: "height" }
                        ]
                    },
                    materialIcons: {
                        acceptReporters: true,
                        items: [
                            { text: "add", value: "add" },
                            { text: "close", value: "close" },
                            { text: "check", value: "check" },
                            { text: "delete", value: "delete" },
                            { text: "search", value: "search" },
                            { text: "menu", value: "menu" },
                            { text: "home", value: "home" },
                            { text: "settings", value: "settings" },
                            { text: "info", value: "info" },
                            { text: "warning", value: "warning" }
                        ]
                    }
                }
            };
        }
    }

    if (extensions) {
        extensions.register(new mduiPro_ext(runtime));
    }

    global.tempExt = {
        Extension: mduiPro_ext,
        info: {
            name: "mduiPro",
            description: "强大的 Material Design 3 UI 组件库扩展",
            extensionId: "mduiPro",
            iconURL: EXTENSION_COVER,
            insetIconURL: UNIFIED_ICON,
            featured: true,
            disabled: false,
            collaborator: "星火夜芒@CCW",
            collaboratorURL: "https://www.ccw.site/student/69573ee886bbc77f84e41ee3",
            onClick: function() {
                if (typeof window !== 'undefined') {
                    window.open("https://www.ccw.site/student/69573ee886bbc77f84e41ee3", "_blank");
                }
            }
        },
        l10n: {
            "zh-cn": {
                "mduiPro.name": "mdui Pro",
                "mduiPro.descp": "强大的 Material Design 3 UI 组件库扩展"
            },
            "en": {
                "mduiPro.name": "mdui Pro",
                "mduiPro.descp": "Powerful Material Design 3 UI components extension"
            }
        }
    };

})(typeof global !== 'undefined' ? global : (typeof window !== 'undefined' ? window : this));