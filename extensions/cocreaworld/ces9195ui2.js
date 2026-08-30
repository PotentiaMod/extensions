(function (_Scratch) {
    const {ArgumentType, BlockType, Cast, translate, extensions, runtime} = _Scratch;

    translate.setup({
        zh: {
            'extensionName': 'CES9195的弹窗工具 V2',

            // ===== Toast 通知 =====
            'toastWithType': '[TYPE] 顶部通知 [TEXT] 图标 [ICON] 持续 [DURATION] 秒',
            'toast.TEXT_default': '操作成功',
            'clearToasts': '清除所有通知',

            // ===== 模态弹窗 =====
            'modalAlert': '弹窗 [TITLE] 内容 [CONTENT] 图标 [ICON]',
            'modal.TITLE_default': '提示',
            'modal.CONTENT_default': '这是一条消息',
            'modalConfirm': '询问弹窗 标题 [TITLE] 内容 [CONTENT] 确认按钮 [OK_TEXT] 取消按钮 [CANCEL_TEXT]',
            'modal.OK_default': '确认',
            'modal.CANCEL_default': '取消',
            'modalConfirm.MESSAGE_default': '你确定要执行此操作吗？',
            'modalPrompt': '输入弹窗 标题 [TITLE] 占位符 [PLACEHOLDER] 默认值 [DEFAULT]',
            'modalPrompt.TITLE_default': '请输入内容',
            'modalPrompt.PLACEHOLDER_default': '在此输入...',
            'modalPrompt.DEFAULT_default': '',

            // ===== 角落通知 =====
            'cornerNotify': '在 [POSITION] 显示通知 标题 [TITLE] 内容 [CONTENT] 持续 [DURATION] 秒',
            'cornerNotify.TITLE_default': '通知',
            'cornerNotify.CONTENT_default': '这是一条角落通知',
            'clearCornerNotifys': '清除所有角落通知',

            // ===== 选择器 =====
            'selectionModal': '选择弹窗 标题 [TITLE] 选项 [OPTIONS] 布局 [LAYOUT] 用 [SEPARATOR] 分割',
            'selectionModal.TITLE_default': '请选择一项',
            'selectionModal.OPTIONS_default': '苹果,香蕉,橘子,葡萄,西瓜,草莓',

            // ===== 进度条弹窗 =====
            'progressModal': '进度弹窗 标题 [TITLE] 内容 [CONTENT]',
            'progressModal.TITLE_default': '加载中',
            'progressModal.CONTENT_default': '请稍候...',
            'updateProgress': '更新进度 [PERCENT]%',
            'closeProgressModal': '关闭进度弹窗',

            // ===== 圆环进度弹窗 =====
            'circularProgressModal': '圆环进度弹窗 标题 [TITLE] 内容 [CONTENT] 尺寸 [SIZE]',
            'updateCircularProgress': '更新圆环进度 [PERCENT]%',
            'closeCircularProgressModal': '关闭圆环进度弹窗',

            // ===== 底部抽屉 =====
            'bottomSheet': '底部抽屉 标题 [TITLE] 内容 [CONTENT] 高度 [HEIGHT]%',
            'bottomSheet.TITLE_default': '详情面板',
            'bottomSheet.CONTENT_default': '这是底部抽屉面板的内容区域。',
            'closeBottomSheet': '关闭底部抽屉',

            // ===== 主题 =====
            'setTheme': '设置主题 [THEME] 主题色 [COLOR]',
            'themeLight': '浅色',
            'themeDark': '深色',
            'themeAuto': '跟随系统',
            'themeGlass': '液态玻璃',
            'themeFrosted': '毛玻璃',
            'themeCyberpunk': '赛博朋克',
            'themeSunset': '日落暖阳',
            'themeForest': '森林清新',
            'themeOcean': '深海幽蓝',
            'themeNeon': '霓虹都市',
            'themeRose': '玫瑰金',
            'getTheme': '当前主题名称',

            // ===== 动画风格 =====
            'setAnimStyle': '设置动画风格 [STYLE]',
            'getAnimStyle': '当前动画风格',
            'animSpring': '弹性',
            'animSmooth': '平滑',
            'animBounce': '弹跳',
            'animFade': '淡入淡出',
            'animSlide': '滑动',
            'animZoom': '缩放',
            'animFlip': '翻转',

            // ===== Snackbar =====
            'snackbar': '底部消息条 [TEXT] 操作按钮 [ACTION] 持续 [DURATION] 秒',
            'snackbar.TEXT_default': '已保存到草稿',
            'snackbar.ACTION_default': '关闭',

            // ===== Loading Spinner =====
            'showSpinner': '显示加载动画 文字 [TEXT] 样式 [STYLE]',
            'spinner.TEXT_default': '加载中...',
            'closeSpinner': '关闭加载动画',

            // ===== Stepper =====
            'showStepper': '步骤指示器 标题 [TITLE] 步骤 [STEPS] 当前 [CURRENT] 用 [SEPARATOR] 分割',
            'stepper.TITLE_default': '注册流程',
            'stepper.STEPS_default': '填写信息,验证邮箱,设置密码,完成',
            'updateStepper': '更新当前步骤 [STEP]',
            'closeStepper': '关闭步骤指示器',

            // ===== Star Rating =====
            'starRating': '星级评分 标题 [TITLE] 默认 [DEFAULT] 最大 [MAX]',
            'starRating.TITLE_default': '请为本次体验评分',

            // ===== Countdown =====
            'showCountdown': '倒计时 [SECONDS] 秒 标题 [TITLE] 完成文字 [FINISH]',
            'countdown.TITLE_default': '倒计时',
            'countdown.FINISH_default': '时间到！',
            'closeCountdown': '关闭倒计时',

            // ===== Floating Badge =====
            'showBadge': '浮动徽章 文字 [TEXT] 位置 [POSITION] 颜色 [COLOR]',
            'badge.TEXT_default': 'NEW',
            'clearBadges': '清除所有浮动徽章',

            // ===== Typewriter =====
            'typewriterModal': '打字机弹窗 标题 [TITLE] 内容 [CONTENT] 速度 [SPEED]ms',
            'typewriterModal.TITLE_default': '系统消息',
            'typewriterModal.CONTENT_default': '欢迎使用CES9195的弹窗工具 V2！这是一段打字机效果的文字展示。',
            'closeTypewriter': '关闭打字机弹窗',

            // ===== Notification Sound =====
            'playSound': '播放通知音效 [TYPE]',
            'soundSuccess': '成功',
            'soundError': '错误',
            'soundWarning': '警告',
            'soundInfo': '信息',
            'soundClick': '点击',
            'soundPop': '弹出',
            'soundChime': '铃声',

            // ===== 侧边面板 =====
            'slidePanel': '侧边面板 方向 [SIDE] 标题 [TITLE] 内容 [CONTENT] 宽度 [WIDTH]%',
            'slidePanel.TITLE_default': '侧边栏',
            'slidePanel.CONTENT_default': '这是侧边面板的内容。',
            'closeSlidePanel': '关闭侧边面板',
            'sideLeft': '左侧',
            'sideRight': '右侧',

            // ===== Tooltip =====
            'showTooltip': '显示提示气泡 文字 [TEXT] 位置 [POSITION] 持续 [DURATION] 秒',
            'tooltip.TEXT_default': '这是一条提示信息',
            'clearTooltips': '清除所有提示气泡',

            // ===== Skeleton Loading =====
            'showSkeleton': '骨架屏加载 行数 [ROWS] 持续 [DURATION] 秒',
            'closeSkeleton': '关闭骨架屏',

            // ===== Confetti =====
            'confetti': '🎉 撒花特效 数量 [COUNT] 持续 [DURATION] 秒',

            // ===== Number Counter =====
            'numberCounter': '数字动画 从 [FROM] 到 [TO] 持续 [DURATION] 秒',

            // ===== Tab Panel =====
            'tabPanel': '标签面板 标题 [TITLE] 标签 [TABS] 内容 [CONTENTS] 用 [SEPARATOR] 分割',
            'tabPanel.TITLE_default': '设置面板',
            'tabPanel.TABS_default': '常规,显示,声音',
            'tabPanel.CONTENTS_default': '常规设置内容,显示设置内容,声音设置内容',

            // ===== Ripple =====
            'rippleAt': '在 [POSITION] 播放水波纹效果 颜色 [COLOR]',

            // ===== Image Lightbox =====
            'imageLightbox': '图片灯箱 地址 [URL] 标题 [TITLE]',
            'imageLightbox.TITLE_default': '图片预览',

            // ===== 图标 =====
            'iconInfo': 'ℹ️ 信息',
            'iconSuccess': '✅ 成功',
            'iconWarning': '⚠️ 警告',
            'iconError': '❌ 错误',
            'iconNone': '🚫 无图标',

            // ===== Toast类型 =====
            'typeSuccess': '成功',
            'typeWarning': '警告',
            'typeError': '错误',
            'typeInfo': '信息',

            // ===== 位置 =====
            'posTopLeft': '左上角',
            'posTopRight': '右上角',
            'posBottomLeft': '左下角',
            'posBottomRight': '右下角',
            'posTopCenter': '顶部居中',
            'posBottomCenter': '底部居中',

            // ===== 布局 =====
            'layoutList': '列表',
            'layoutGrid': '网格',

            // ===== 分割 =====
            'sepComma': '逗号',
            'sepSpace': '空格',
            'sepSlash': '顿号',
            'sepNewline': '换行',

            // ===== Spinner样式 =====
            'spinnerRing': '圆环',
            'spinnerDots': '圆点',
            'spinnerPulse': '脉冲',
            'spinnerWave': '波浪',

            // ===== 分类标签 =====
            'catToast': '🔔 通知',
            'catModal': '💬 弹窗',
            'catProgress': '📊 进度',
            'catPanel': '📋 面板',
            'catEffect': '✨ 特效',
            'catTheme': '🎨 主题'
        },
        en: {
            'extensionName': 'Glass UI V2',

            'toastWithType': '[TYPE] toast [TEXT] icon [ICON] for [DURATION]s',
            'toast.TEXT_default': 'Operation successful',
            'clearToasts': 'Clear all toasts',

            'modalAlert': 'Popup [TITLE] content [CONTENT] icon [ICON]',
            'modal.TITLE_default': 'Notice',
            'modal.CONTENT_default': 'This is a message',
            'modalConfirm': 'Confirm popup title [TITLE] content [CONTENT] OK button [OK_TEXT] cancel button [CANCEL_TEXT]',
            'modal.OK_default': 'OK',
            'modal.CANCEL_default': 'Cancel',
            'modalConfirm.MESSAGE_default': 'Are you sure?',
            'modalPrompt': 'Input popup title [TITLE] placeholder [PLACEHOLDER] default [DEFAULT]',
            'modalPrompt.TITLE_default': 'Enter text',
            'modalPrompt.PLACEHOLDER_default': 'Type here...',
            'modalPrompt.DEFAULT_default': '',

            'cornerNotify': 'Show notification at [POSITION] title [TITLE] content [CONTENT] for [DURATION]s',
            'cornerNotify.TITLE_default': 'Notification',
            'cornerNotify.CONTENT_default': 'This is a corner notification',
            'clearCornerNotifys': 'Clear all corner notifications',

            'selectionModal': 'Selection popup title [TITLE] options [OPTIONS] layout [LAYOUT] split by [SEPARATOR]',
            'selectionModal.TITLE_default': 'Please select',
            'selectionModal.OPTIONS_default': 'Apple,Banana,Orange,Grape,Watermelon,Strawberry',

            'progressModal': 'Progress popup title [TITLE] content [CONTENT]',
            'progressModal.TITLE_default': 'Loading',
            'progressModal.CONTENT_default': 'Please wait...',
            'updateProgress': 'Update progress [PERCENT]%',
            'closeProgressModal': 'Close progress popup',

            'circularProgressModal': 'Ring progress popup title [TITLE] content [CONTENT] size [SIZE]',
            'updateCircularProgress': 'Update ring progress [PERCENT]%',
            'closeCircularProgressModal': 'Close ring progress popup',

            'bottomSheet': 'Bottom sheet title [TITLE] content [CONTENT] height [HEIGHT]%',
            'bottomSheet.TITLE_default': 'Details Panel',
            'bottomSheet.CONTENT_default': 'This is the content area of the bottom sheet.',
            'closeBottomSheet': 'Close bottom sheet',

            'setTheme': 'Set theme [THEME] accent color [COLOR]',
            'themeLight': 'Light',
            'themeDark': 'Dark',
            'themeAuto': 'Auto',
            'themeGlass': 'Liquid Glass',
            'themeFrosted': 'Frosted Glass',
            'themeCyberpunk': 'Cyberpunk',
            'themeSunset': 'Sunset',
            'themeForest': 'Forest',
            'themeOcean': 'Ocean',
            'themeNeon': 'Neon City',
            'themeRose': 'Rose Gold',
            'getTheme': 'Current theme name',

            'setAnimStyle': 'Set animation style [STYLE]',
            'getAnimStyle': 'Current animation style',
            'animSpring': 'Spring',
            'animSmooth': 'Smooth',
            'animBounce': 'Bounce',
            'animFade': 'Fade',
            'animSlide': 'Slide',
            'animZoom': 'Zoom',
            'animFlip': 'Flip',

            'snackbar': 'Snackbar [TEXT] action [ACTION] for [DURATION]s',
            'snackbar.TEXT_default': 'Saved to draft',
            'snackbar.ACTION_default': 'Undo',

            'showSpinner': 'Show loading spinner text [TEXT] style [STYLE]',
            'spinner.TEXT_default': 'Loading...',
            'closeSpinner': 'Close loading spinner',

            'showStepper': 'Stepper title [TITLE] steps [STEPS] current [CURRENT] split by [SEPARATOR]',
            'stepper.TITLE_default': 'Registration',
            'stepper.STEPS_default': 'Info,Verify,Password,Done',
            'updateStepper': 'Update current step [STEP]',
            'closeStepper': 'Close stepper',

            'starRating': 'Star rating title [TITLE] default [DEFAULT] max [MAX]',
            'starRating.TITLE_default': 'Rate your experience',

            'showCountdown': 'Countdown [SECONDS]s title [TITLE] finish text [FINISH]',
            'countdown.TITLE_default': 'Countdown',
            'countdown.FINISH_default': 'Time\'s up!',
            'closeCountdown': 'Close countdown',

            'showBadge': 'Floating badge text [TEXT] position [POSITION] color [COLOR]',
            'badge.TEXT_default': 'NEW',
            'clearBadges': 'Clear all badges',

            'typewriterModal': 'Typewriter popup title [TITLE] content [CONTENT] speed [SPEED]ms',
            'typewriterModal.TITLE_default': 'System Message',
            'typewriterModal.CONTENT_default': 'Welcome to Glass UI V2! This is a typewriter effect demo.',
            'closeTypewriter': 'Close typewriter popup',

            'playSound': 'Play notification sound [TYPE]',
            'soundSuccess': 'Success',
            'soundError': 'Error',
            'soundWarning': 'Warning',
            'soundInfo': 'Info',
            'soundClick': 'Click',
            'soundPop': 'Pop',
            'soundChime': 'Chime',

            'slidePanel': 'Side panel [SIDE] title [TITLE] content [CONTENT] width [WIDTH]%',
            'slidePanel.TITLE_default': 'Side Panel',
            'slidePanel.CONTENT_default': 'This is the side panel content.',
            'closeSlidePanel': 'Close side panel',
            'sideLeft': 'Left',
            'sideRight': 'Right',

            'showTooltip': 'Show tooltip [TEXT] at [POSITION] for [DURATION]s',
            'tooltip.TEXT_default': 'This is a tooltip',
            'clearTooltips': 'Clear all tooltips',

            'showSkeleton': 'Skeleton loading rows [ROWS] for [DURATION]s',
            'closeSkeleton': 'Close skeleton',

            'confetti': '🎉 Confetti count [COUNT] for [DURATION]s',

            'numberCounter': 'Number animation from [FROM] to [TO] in [DURATION]s',

            'tabPanel': 'Tab panel title [TITLE] tabs [TABS] contents [CONTENTS] split by [SEPARATOR]',
            'tabPanel.TITLE_default': 'Settings',
            'tabPanel.TABS_default': 'General,Display,Sound',
            'tabPanel.CONTENTS_default': 'General settings,Display settings,Sound settings',

            'rippleAt': 'Ripple effect at [POSITION] color [COLOR]',

            'imageLightbox': 'Image lightbox URL [URL] title [TITLE]',
            'imageLightbox.TITLE_default': 'Image Preview',

            'iconInfo': 'ℹ️ Info',
            'iconSuccess': '✅ Success',
            'iconWarning': '⚠️ Warning',
            'iconError': '❌ Error',
            'iconNone': '🚫 None',

            'typeSuccess': 'Success',
            'typeWarning': 'Warning',
            'typeError': 'Error',
            'typeInfo': 'Info',

            'posTopLeft': 'Top Left',
            'posTopRight': 'Top Right',
            'posBottomLeft': 'Bottom Left',
            'posBottomRight': 'Bottom Right',
            'posTopCenter': 'Top Center',
            'posBottomCenter': 'Bottom Center',

            'layoutList': 'List',
            'layoutGrid': 'Grid',

            'sepComma': 'Comma',
            'sepSpace': 'Space',
            'sepSlash': 'Slash',
            'sepNewline': 'Newline',

            'spinnerRing': 'Ring',
            'spinnerDots': 'Dots',
            'spinnerPulse': 'Pulse',
            'spinnerWave': 'Wave',

            'catToast': '🔔 Notifications',
            'catModal': '💬 Popups',
            'catProgress': '📊 Progress',
            'catPanel': '📋 Panels',
            'catEffect': '✨ Effects',
            'catTheme': '🎨 Theme'
        }
    });

    // ============================
    // SVG 图标库
    // ============================
    const ICONS = {
        info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
        success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
        warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 a 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
    };

    // ============================
    // 主题预设（含新增毛玻璃、霓虹、玫瑰金）
    // ============================
    const THEME_PRESETS = {
        light: {
            '--glass-bg': 'rgba(255,255,255,0.78)',
            '--glass-bg-solid': '#f0f1f5',
            '--glass-border': 'rgba(255,255,255,0.6)',
            '--glass-shadow': 'rgba(0,0,0,0.08)',
            '--glass-text': '#1a1a2e',
            '--glass-text-secondary': '#5a5a7a',
            '--overlay-bg': 'rgba(200,200,220,0.45)',
            '--glass-blur': '24px',
            '--glass-saturate': '180%'
        },
        dark: {
            '--glass-bg': 'rgba(22,22,40,0.82)',
            '--glass-bg-solid': '#16162a',
            '--glass-border': 'rgba(255,255,255,0.08)',
            '--glass-shadow': 'rgba(0,0,0,0.4)',
            '--glass-text': '#e8e8f0',
            '--glass-text-secondary': '#9090aa',
            '--overlay-bg': 'rgba(0,0,0,0.55)',
            '--glass-blur': '24px',
            '--glass-saturate': '180%'
        },
        glass: {
            '--glass-bg': 'rgba(255,255,255,0.25)',
            '--glass-bg-solid': 'rgba(255,255,255,0.35)',
            '--glass-border': 'rgba(255,255,255,0.35)',
            '--glass-shadow': 'rgba(0,0,0,0.12)',
            '--glass-text': '#ffffff',
            '--glass-text-secondary': 'rgba(255,255,255,0.7)',
            '--overlay-bg': 'rgba(0,0,0,0.35)',
            '--glass-blur': '24px',
            '--glass-saturate': '180%'
        },
        frosted: {
            '--glass-bg': 'rgba(240,240,255,0.55)',
            '--glass-bg-solid': 'rgba(230,230,250,0.7)',
            '--glass-border': 'rgba(255,255,255,0.5)',
            '--glass-shadow': 'rgba(0,0,0,0.15)',
            '--glass-text': '#2a2a4a',
            '--glass-text-secondary': '#6a6a8a',
            '--overlay-bg': 'rgba(200,200,230,0.5)',
            '--glass-blur': '40px',
            '--glass-saturate': '250%'
        },
        cyberpunk: {
            '--glass-bg': 'rgba(10,10,30,0.88)',
            '--glass-bg-solid': '#0a0a1e',
            '--glass-border': 'rgba(0,255,255,0.2)',
            '--glass-shadow': 'rgba(0,255,255,0.1)',
            '--glass-text': '#00ffff',
            '--glass-text-secondary': '#ff00ff',
            '--overlay-bg': 'rgba(0,0,0,0.7)',
            '--glass-blur': '24px',
            '--glass-saturate': '180%'
        },
        sunset: {
            '--glass-bg': 'rgba(255,245,235,0.75)',
            '--glass-bg-solid': '#fff5eb',
            '--glass-border': 'rgba(255,180,120,0.4)',
            '--glass-shadow': 'rgba(255,120,60,0.1)',
            '--glass-text': '#3d2010',
            '--glass-text-secondary': '#8a5a30',
            '--overlay-bg': 'rgba(255,200,150,0.35)',
            '--glass-blur': '24px',
            '--glass-saturate': '180%'
        },
        forest: {
            '--glass-bg': 'rgba(240,255,245,0.75)',
            '--glass-bg-solid': '#f0fff5',
            '--glass-border': 'rgba(100,200,140,0.35)',
            '--glass-shadow': 'rgba(60,140,80,0.1)',
            '--glass-text': '#1a3d28',
            '--glass-text-secondary': '#4a7a5a',
            '--overlay-bg': 'rgba(150,220,170,0.3)',
            '--glass-blur': '24px',
            '--glass-saturate': '180%'
        },
        ocean: {
            '--glass-bg': 'rgba(230,240,255,0.75)',
            '--glass-bg-solid': '#e6f0ff',
            '--glass-border': 'rgba(100,160,255,0.35)',
            '--glass-shadow': 'rgba(40,80,180,0.1)',
            '--glass-text': '#0a1a3d',
            '--glass-text-secondary': '#3a5a8a',
            '--overlay-bg': 'rgba(130,180,255,0.3)',
            '--glass-blur': '24px',
            '--glass-saturate': '180%'
        },
        neon: {
            '--glass-bg': 'rgba(15,5,30,0.9)',
            '--glass-bg-solid': '#0f051e',
            '--glass-border': 'rgba(255,0,255,0.25)',
            '--glass-shadow': 'rgba(255,0,255,0.15)',
            '--glass-text': '#ff66ff',
            '--glass-text-secondary': '#aa44ff',
            '--overlay-bg': 'rgba(0,0,0,0.75)',
            '--glass-blur': '20px',
            '--glass-saturate': '200%'
        },
        rose: {
            '--glass-bg': 'rgba(255,240,245,0.78)',
            '--glass-bg-solid': '#fff0f5',
            '--glass-border': 'rgba(220,160,140,0.4)',
            '--glass-shadow': 'rgba(180,100,80,0.1)',
            '--glass-text': '#4a2020',
            '--glass-text-secondary': '#8a5050',
            '--overlay-bg': 'rgba(240,200,200,0.35)',
            '--glass-blur': '24px',
            '--glass-saturate': '180%'
        }
    };

    const ACCENT_PRESETS = {
        light: '#6366f1',
        dark: '#818cf8',
        glass: '#a78bfa',
        frosted: '#7c8cf5',
        cyberpunk: '#00ffff',
        sunset: '#f97316',
        forest: '#22c55e',
        ocean: '#3b82f6',
        neon: '#ff00ff',
        rose: '#e879a0'
    };

    // ============================
    // 动画风格预设
    // ============================
    const ANIM_STYLES = {
        spring: {
            '--anim-overlay-in': 'glassui-overlay-in 0.35s cubic-bezier(0.22,1,0.36,1) forwards',
            '--anim-overlay-out': 'glassui-overlay-out 0.25s ease-in forwards',
            '--anim-card-in': 'glassui-card-in 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards',
            '--anim-card-out': 'glassui-card-out 0.25s ease-in forwards',
            '--anim-toast-in': 'glassui-toast-in 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
            '--anim-toast-out': 'glassui-toast-out 0.35s cubic-bezier(0.22,1,0.36,1) forwards',
            '--anim-sheet-in': 'glassui-sheet-in 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
            '--anim-sheet-out': 'glassui-sheet-out 0.3s ease-in forwards'
        },
        smooth: {
            '--anim-overlay-in': 'glassui-overlay-in 0.4s ease forwards',
            '--anim-overlay-out': 'glassui-overlay-out 0.3s ease forwards',
            '--anim-card-in': 'glassui-card-in 0.4s ease forwards',
            '--anim-card-out': 'glassui-card-out 0.3s ease forwards',
            '--anim-toast-in': 'glassui-toast-in 0.4s ease forwards',
            '--anim-toast-out': 'glassui-toast-out 0.3s ease forwards',
            '--anim-sheet-in': 'glassui-sheet-in 0.4s ease forwards',
            '--anim-sheet-out': 'glassui-sheet-out 0.3s ease forwards'
        },
        bounce: {
            '--anim-overlay-in': 'glassui-overlay-in 0.3s ease forwards',
            '--anim-overlay-out': 'glassui-overlay-out 0.2s ease forwards',
            '--anim-card-in': 'glassui-card-in 0.6s cubic-bezier(0.68,-0.55,0.265,1.55) forwards',
            '--anim-card-out': 'glassui-card-out 0.3s ease forwards',
            '--anim-toast-in': 'glassui-toast-in 0.6s cubic-bezier(0.68,-0.55,0.265,1.55) forwards',
            '--anim-toast-out': 'glassui-toast-out 0.3s ease forwards',
            '--anim-sheet-in': 'glassui-sheet-in 0.6s cubic-bezier(0.68,-0.55,0.265,1.55) forwards',
            '--anim-sheet-out': 'glassui-sheet-out 0.3s ease forwards'
        },
        fade: {
            '--anim-overlay-in': 'glassui-fade-in 0.4s ease forwards',
            '--anim-overlay-out': 'glassui-fade-out 0.3s ease forwards',
            '--anim-card-in': 'glassui-fade-in 0.4s ease forwards',
            '--anim-card-out': 'glassui-fade-out 0.3s ease forwards',
            '--anim-toast-in': 'glassui-fade-in 0.4s ease forwards',
            '--anim-toast-out': 'glassui-fade-out 0.3s ease forwards',
            '--anim-sheet-in': 'glassui-fade-in 0.4s ease forwards',
            '--anim-sheet-out': 'glassui-fade-out 0.3s ease forwards'
        },
        slide: {
            '--anim-overlay-in': 'glassui-overlay-in 0.3s ease forwards',
            '--anim-overlay-out': 'glassui-overlay-out 0.25s ease forwards',
            '--anim-card-in': 'glassui-slide-up 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
            '--anim-card-out': 'glassui-slide-down 0.3s ease forwards',
            '--anim-toast-in': 'glassui-slide-down-sm 0.4s ease forwards',
            '--anim-toast-out': 'glassui-slide-up-sm 0.3s ease forwards',
            '--anim-sheet-in': 'glassui-sheet-in 0.45s cubic-bezier(0.22,1,0.36,1) forwards',
            '--anim-sheet-out': 'glassui-sheet-out 0.3s ease forwards'
        },
        zoom: {
            '--anim-overlay-in': 'glassui-overlay-in 0.3s ease forwards',
            '--anim-overlay-out': 'glassui-overlay-out 0.25s ease forwards',
            '--anim-card-in': 'glassui-zoom-in 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
            '--anim-card-out': 'glassui-zoom-out 0.3s ease forwards',
            '--anim-toast-in': 'glassui-zoom-in 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
            '--anim-toast-out': 'glassui-zoom-out 0.3s ease forwards',
            '--anim-sheet-in': 'glassui-sheet-in 0.45s ease forwards',
            '--anim-sheet-out': 'glassui-sheet-out 0.3s ease forwards'
        },
        flip: {
            '--anim-overlay-in': 'glassui-overlay-in 0.3s ease forwards',
            '--anim-overlay-out': 'glassui-overlay-out 0.25s ease forwards',
            '--anim-card-in': 'glassui-flip-in 0.5s ease forwards',
            '--anim-card-out': 'glassui-flip-out 0.35s ease forwards',
            '--anim-toast-in': 'glassui-flip-in 0.5s ease forwards',
            '--anim-toast-out': 'glassui-flip-out 0.35s ease forwards',
            '--anim-sheet-in': 'glassui-sheet-in 0.45s ease forwards',
            '--anim-sheet-out': 'glassui-sheet-out 0.3s ease forwards'
        }
    };

    // ============================
    // 工具函数
    // ============================
    function getSeparatorValue(sep) {
        switch (sep) {
            case 'comma': return ',';
            case 'space': return ' ';
            case 'slash': return '、';
            case 'newline': return '\n';
            default: return ',';
        }
    }

    // ============================
    // Web Audio API 音效合成
    // ============================
    let _audioCtx = null;
    function getAudioCtx() {
        if (!_audioCtx) {
            _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return _audioCtx;
    }

    function playNotificationSound(type) {
        try {
            const ctx = getAudioCtx();
            if (ctx.state === 'suspended') ctx.resume();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);

            switch (type) {
                case 'success':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(523, ctx.currentTime);
                    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
                    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.4);
                    break;
                case 'error':
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(200, ctx.currentTime);
                    osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.35);
                    break;
                case 'warning':
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(440, ctx.currentTime);
                    osc.frequency.setValueAtTime(440, ctx.currentTime + 0.12);
                    gain.gain.setValueAtTime(0.001, ctx.currentTime + 0.13);
                    gain.gain.setValueAtTime(0.15, ctx.currentTime + 0.2);
                    osc.frequency.setValueAtTime(440, ctx.currentTime + 0.2);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.4);
                    break;
                case 'info':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(600, ctx.currentTime);
                    osc.frequency.setValueAtTime(800, ctx.currentTime + 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.25);
                    break;
                case 'click':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(1000, ctx.currentTime);
                    gain.gain.setValueAtTime(0.08, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.06);
                    break;
                case 'pop':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(300, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.15);
                    break;
                case 'chime':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(880, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.6);
                    const osc2 = ctx.createOscillator();
                    const gain2 = ctx.createGain();
                    osc2.connect(gain2);
                    gain2.connect(ctx.destination);
                    osc2.type = 'sine';
                    osc2.frequency.setValueAtTime(1108, ctx.currentTime + 0.15);
                    gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.15);
                    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
                    osc2.start(ctx.currentTime + 0.15);
                    osc2.stop(ctx.currentTime + 0.7);
                    break;
                default:
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(600, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.2);
            }
        } catch (e) {
            // Audio not supported or blocked
        }
    }

    // ============================
    // 样式注入（增强版）
    // ============================
    let _styleInjected = false;
    function injectStyles() {
        if (_styleInjected) return;
        if (document.getElementById('glassui2-styles')) return;
        _styleInjected = true;
        const style = document.createElement('style');
        style.id = 'glassui2-styles';
        style.textContent = `
/* ========================================
   幻璃 UI V2 — GlassUI 增强样式系统
   ======================================== */

:root {
    --glassui-primary: #6366f1;
    --glassui-primary-hover: #4f46e5;
    --glassui-primary-glow: rgba(99,102,241,0.35);
    --glassui-success: #22c55e;
    --glassui-warning: #f59e0b;
    --glassui-error: #ef4444;
    --glassui-info: #6366f1;
    --glassui-success-bg: rgba(34,197,94,0.12);
    --glassui-warning-bg: rgba(245,158,11,0.12);
    --glassui-error-bg: rgba(239,68,68,0.12);
    --glassui-info-bg: rgba(99,102,241,0.12);
    --glass-bg: rgba(255,255,255,0.78);
    --glass-bg-solid: #f0f1f5;
    --glass-border: rgba(255,255,255,0.6);
    --glass-shadow: rgba(0,0,0,0.08);
    --glass-text: #1a1a2e;
    --glass-text-secondary: #5a5a7a;
    --overlay-bg: rgba(200,200,220,0.45);
    --glass-blur: 24px;
    --glass-saturate: 180%;
    --glass-radius: 20px;
    --glass-radius-sm: 12px;
    --spring-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
    --spring-smooth: cubic-bezier(0.22, 1, 0.36, 1);
    --spring-decel: cubic-bezier(0, 0, 0.2, 1);

    /* 动画风格变量（默认 spring） */
    --anim-overlay-in: glassui-overlay-in 0.35s cubic-bezier(0.22,1,0.36,1) forwards;
    --anim-overlay-out: glassui-overlay-out 0.25s ease-in forwards;
    --anim-card-in: glassui-card-in 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards;
    --anim-card-out: glassui-card-out 0.25s ease-in forwards;
    --anim-toast-in: glassui-toast-in 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
    --anim-toast-out: glassui-toast-out 0.35s cubic-bezier(0.22,1,0.36,1) forwards;
    --anim-sheet-in: glassui-sheet-in 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
    --anim-sheet-out: glassui-sheet-out 0.3s ease-in forwards;
}

/* ---------- 基础动画关键帧 ---------- */
@keyframes glassui-overlay-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes glassui-overlay-out { from { opacity: 1; } to { opacity: 0; } }
@keyframes glassui-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes glassui-fade-out { from { opacity: 1; } to { opacity: 0; } }

@keyframes glassui-card-in {
    from { opacity: 0; transform: translateY(30px) scale(0.92); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes glassui-card-out {
    from { opacity: 1; transform: translateY(0) scale(1); }
    to { opacity: 0; transform: translateY(20px) scale(0.95); }
}
@keyframes glassui-slide-up {
    from { opacity: 0; transform: translateY(60px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes glassui-slide-down {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(40px); }
}
@keyframes glassui-slide-down-sm {
    from { opacity: 0; transform: translateY(-30px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes glassui-slide-up-sm {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-20px); }
}
@keyframes glassui-zoom-in {
    from { opacity: 0; transform: scale(0.5); }
    to { opacity: 1; transform: scale(1); }
}
@keyframes glassui-zoom-out {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.7); }
}
@keyframes glassui-flip-in {
    from { opacity: 0; transform: perspective(600px) rotateX(-30deg); }
    to { opacity: 1; transform: perspective(600px) rotateX(0); }
}
@keyframes glassui-flip-out {
    from { opacity: 1; transform: perspective(600px) rotateX(0); }
    to { opacity: 0; transform: perspective(600px) rotateX(20deg); }
}

@keyframes glassui-toast-in {
    from { opacity: 0; transform: translateY(-30px) scale(0.88); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes glassui-toast-out {
    from { opacity: 1; transform: translateY(0) scale(1); }
    to { opacity: 0; transform: translateY(-20px) scale(0.9); }
}

@keyframes glassui-sheet-in {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}
@keyframes glassui-sheet-out {
    from { transform: translateY(0); }
    to { transform: translateY(100%); }
}

@keyframes glassui-gradient-shift {
    0%,100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

@keyframes glassui-icon-pop {
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}

@keyframes glassui-shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

@keyframes glassui-toast-countdown {
    from { width: 100%; } to { width: 0%; }
}

@keyframes glassui-slide-in-right {
    from { opacity: 0; transform: translateX(60px); }
    to { opacity: 1; transform: translateX(0); }
}
@keyframes glassui-slide-in-left {
    from { opacity: 0; transform: translateX(-60px); }
    to { opacity: 1; transform: translateX(0); }
}
@keyframes glassui-corner-out {
    to { opacity: 0; transform: scale(0.92); }
}

/* ---------- Spinner 动画 ---------- */
@keyframes glassui-spin {
    to { transform: rotate(360deg); }
}
@keyframes glassui-dot-bounce {
    0%,80%,100% { transform: scale(0); }
    40% { transform: scale(1); }
}
@keyframes glassui-pulse-ring {
    0% { transform: scale(0.5); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
}
@keyframes glassui-wave {
    0%,40%,100% { transform: scaleY(0.4); }
    20% { transform: scaleY(1); }
}

/* ---------- Skeleton 动画 ---------- */
@keyframes glassui-skeleton-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

/* ---------- Confetti 动画 ---------- */
@keyframes glassui-confetti-fall {
    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}

/* ---------- Ripple 动画 ---------- */
@keyframes glassui-ripple {
    0% { transform: scale(0); opacity: 0.5; }
    100% { transform: scale(4); opacity: 0; }
}

/* ---------- 数字计数器动画 ---------- */
@keyframes glassui-counter-pulse {
    0%,100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

/* ---------- 浮动徽章脉冲 ---------- */
@keyframes glassui-badge-pulse {
    0%,100% { box-shadow: 0 0 0 0 var(--glassui-primary-glow); }
    50% { box-shadow: 0 0 0 8px transparent; }
}

/* ---------- 打字机光标 ---------- */
@keyframes glassui-blink {
    0%,100% { opacity: 1; }
    50% { opacity: 0; }
}

/* ---------- 圆环进度动画 ---------- */
@keyframes glassui-ring-appear {
    from { opacity: 0; transform: scale(0.8) rotate(-90deg); }
    to { opacity: 1; transform: scale(1) rotate(-90deg); }
}

/* ========================================
   遮罩层
   ======================================== */
.glassui-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: var(--overlay-bg);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    z-index: 99999;
    animation: var(--anim-overlay-in);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}
.glassui-overlay.closing {
    animation: var(--anim-overlay-out);
    pointer-events: none;
}

/* ========================================
   玻璃卡片
   ======================================== */
.glassui-card {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    border: 1px solid var(--glass-border);
    border-radius: var(--glass-radius);
    box-shadow:
        0 8px 32px var(--glass-shadow),
        0 2px 8px var(--glass-shadow),
        inset 0 1px 0 rgba(255,255,255,0.15);
    width: 90%; max-width: 420px;
    padding: 0;
    position: relative;
    overflow: hidden;
    animation: var(--anim-card-in);
}
.closing .glassui-card {
    animation: var(--anim-card-out);
}

/* 卡片顶部彩色渐变线 */
.glassui-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--glassui-primary), var(--glassui-primary-hover), var(--glassui-primary));
    background-size: 200% 100%;
    animation: glassui-gradient-shift 3s ease infinite;
}
.glassui-card.accent-success::before { background: linear-gradient(90deg, #22c55e, #4ade80, #22c55e); background-size: 200% 100%; }
.glassui-card.accent-warning::before { background: linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b); background-size: 200% 100%; }
.glassui-card.accent-error::before { background: linear-gradient(90deg, #ef4444, #f87171, #ef4444); background-size: 200% 100%; }
.glassui-card.accent-info::before { background: linear-gradient(90deg, var(--glassui-primary), #818cf8, var(--glassui-primary)); background-size: 200% 100%; }

.glassui-card-body { padding: 28px 28px 24px; }

/* ========================================
   图标区域
   ======================================== */
.glassui-icon-wrap {
    width: 56px; height: 56px;
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
    animation: glassui-icon-pop 0.5s var(--spring-bounce) 0.15s both;
}
.glassui-icon-wrap svg { width: 28px; height: 28px; }
.glassui-icon-wrap.icon-success { background: var(--glassui-success-bg); color: var(--glassui-success); }
.glassui-icon-wrap.icon-warning { background: var(--glassui-warning-bg); color: var(--glassui-warning); }
.glassui-icon-wrap.icon-error { background: var(--glassui-error-bg); color: var(--glassui-error); }
.glassui-icon-wrap.icon-info { background: var(--glassui-info-bg); color: var(--glassui-info); }

/* ========================================
   文字
   ======================================== */
.glassui-title {
    font-size: 18px; font-weight: 700;
    color: var(--glass-text);
    margin: 0 0 8px; text-align: center;
    letter-spacing: -0.3px;
}
.glassui-title.left-align { text-align: left; }
.glassui-content {
    font-size: 14px; line-height: 1.65;
    color: var(--glass-text-secondary);
    margin: 0; word-wrap: break-word;
    text-align: center;
}
.glassui-content.left-align { text-align: left; }

/* ========================================
   按钮
   ======================================== */
.glassui-buttons {
    display: flex; gap: 12px; margin-top: 24px;
    justify-content: center;
}
.glassui-btn {
    flex: 1; padding: 12px 20px;
    border: none; border-radius: var(--glass-radius-sm);
    font-size: 14px; font-weight: 600;
    cursor: pointer;
    transition: all 0.2s var(--spring-smooth);
    position: relative; overflow: hidden;
    letter-spacing: 0.2px;
    max-width: 180px;
}
.glassui-btn::after {
    content: '';
    position: absolute; top: 50%; left: 50%;
    width: 0; height: 0;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.4s ease, height 0.4s ease;
}
.glassui-btn:active::after { width: 300px; height: 300px; }
.glassui-btn:active { transform: scale(0.96); }

.glassui-btn-primary {
    background: var(--glassui-primary);
    color: white;
    box-shadow: 0 4px 14px var(--glassui-primary-glow);
}
.glassui-btn-primary:hover {
    background: var(--glassui-primary-hover);
    box-shadow: 0 6px 20px var(--glassui-primary-glow);
    transform: translateY(-1px);
}
.glassui-btn-secondary {
    background: rgba(128,128,160,0.1);
    color: var(--glass-text-secondary);
    border: 1px solid rgba(128,128,160,0.15);
}
.glassui-btn-secondary:hover {
    background: rgba(128,128,160,0.18);
}
.glassui-btn-danger {
    background: var(--glassui-error);
    color: white;
    box-shadow: 0 4px 14px rgba(239,68,68,0.3);
}
.glassui-btn-danger:hover {
    background: #dc2626;
    transform: translateY(-1px);
}
.glassui-btn-small {
    flex: none; padding: 6px 14px;
    font-size: 12px; max-width: none;
}

/* ========================================
   输入框
   ======================================== */
.glassui-input-wrap { margin-top: 16px; }
.glassui-input {
    width: 100%; padding: 12px 16px;
    background: rgba(128,128,160,0.06);
    border: 1.5px solid rgba(128,128,160,0.18);
    border-radius: var(--glass-radius-sm);
    font-size: 14px; color: var(--glass-text);
    box-sizing: border-box;
    transition: all 0.25s ease;
    outline: none;
    font-family: inherit;
}
.glassui-input:focus {
    border-color: var(--glassui-primary);
    box-shadow: 0 0 0 3px var(--glassui-primary-glow);
    background: rgba(128,128,160,0.03);
}
.glassui-input::placeholder { color: rgba(128,128,160,0.5); }

/* ========================================
   Toast 通知
   ======================================== */
.glassui-toast-container {
    position: fixed; top: 16px; left: 50%;
    transform: translateX(-50%);
    z-index: 100000;
    display: flex; flex-direction: column; align-items: center;
    gap: 10px;
    pointer-events: none;
}
.glassui-toast {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    box-shadow: 0 8px 30px var(--glass-shadow), inset 0 1px 0 rgba(255,255,255,0.12);
    padding: 14px 20px;
    display: flex; align-items: center; gap: 12px;
    min-width: 260px; max-width: 400px;
    pointer-events: auto;
    position: relative; overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    animation: var(--anim-toast-in);
}
.glassui-toast.removing {
    animation: var(--anim-toast-out);
}
.glassui-toast-icon {
    width: 32px; height: 32px; min-width: 32px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
}
.glassui-toast-icon svg { width: 18px; height: 18px; }
.glassui-toast-icon.icon-success { background: var(--glassui-success-bg); color: var(--glassui-success); }
.glassui-toast-icon.icon-warning { background: var(--glassui-warning-bg); color: var(--glassui-warning); }
.glassui-toast-icon.icon-error { background: var(--glassui-error-bg); color: var(--glassui-error); }
.glassui-toast-icon.icon-info { background: var(--glassui-info-bg); color: var(--glassui-info); }
.glassui-toast-text {
    font-size: 14px; font-weight: 500;
    color: var(--glass-text);
    line-height: 1.4;
    flex: 1;
}
.glassui-toast-progress {
    position: absolute; bottom: 0; left: 0;
    height: 3px;
    border-radius: 0 0 16px 16px;
    animation: glassui-toast-countdown linear forwards;
}
.glassui-toast-progress.type-success { background: var(--glassui-success); }
.glassui-toast-progress.type-warning { background: var(--glassui-warning); }
.glassui-toast-progress.type-error { background: var(--glassui-error); }
.glassui-toast-progress.type-info { background: var(--glassui-info); }

/* ========================================
   角落通知
   ======================================== */
.glassui-corner-container {
    position: fixed; z-index: 100001;
    display: flex; flex-direction: column; gap: 10px;
    pointer-events: none;
    max-height: 80vh; overflow: hidden;
}
.glassui-corner-container.pos-top-left { top: 16px; left: 16px; }
.glassui-corner-container.pos-top-right { top: 16px; right: 16px; }
.glassui-corner-container.pos-bottom-left { bottom: 16px; left: 16px; flex-direction: column-reverse; }
.glassui-corner-container.pos-bottom-right { bottom: 16px; right: 16px; flex-direction: column-reverse; }

.glassui-corner-item {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    box-shadow: 0 8px 30px var(--glass-shadow), inset 0 1px 0 rgba(255,255,255,0.12);
    padding: 16px 20px;
    width: 300px;
    pointer-events: auto;
    position: relative; overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}
.glassui-corner-item::before {
    content: '';
    position: absolute; top: 0; left: 0; bottom: 0; width: 4px;
    background: var(--glassui-primary);
    border-radius: 16px 0 0 16px;
}
.pos-top-right .glassui-corner-item,
.pos-bottom-right .glassui-corner-item {
    animation: glassui-slide-in-right 0.5s var(--spring-bounce) forwards;
}
.pos-top-left .glassui-corner-item,
.pos-bottom-left .glassui-corner-item {
    animation: glassui-slide-in-left 0.5s var(--spring-bounce) forwards;
}
.glassui-corner-item.removing {
    animation: glassui-corner-out 0.3s ease-in forwards !important;
}
.glassui-corner-title {
    font-size: 14px; font-weight: 700;
    color: var(--glass-text);
    margin: 0 0 4px; padding-left: 8px;
}
.glassui-corner-content {
    font-size: 13px; line-height: 1.5;
    color: var(--glass-text-secondary);
    margin: 0; padding-left: 8px;
    word-wrap: break-word;
}
.glassui-corner-progress {
    position: absolute; bottom: 0; left: 0;
    height: 2px; background: var(--glassui-primary);
    border-radius: 0 0 16px 16px;
    animation: glassui-toast-countdown linear forwards;
}

/* ========================================
   选择弹窗
   ======================================== */
.glassui-select-list {
    margin-top: 16px; max-height: 300px;
    overflow-y: auto; overflow-x: hidden;
    padding: 4px;
    scrollbar-width: thin;
    scrollbar-color: rgba(128,128,160,0.3) transparent;
}
.glassui-select-list::-webkit-scrollbar { width: 6px; }
.glassui-select-list::-webkit-scrollbar-track { background: transparent; }
.glassui-select-list::-webkit-scrollbar-thumb {
    background: rgba(128,128,160,0.3); border-radius: 3px;
}
.glassui-select-item {
    padding: 12px 16px;
    border-radius: var(--glass-radius-sm);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px; color: var(--glass-text);
    border: 1.5px solid transparent;
    margin-bottom: 4px;
    user-select: none;
}
.glassui-select-item:hover { background: rgba(128,128,160,0.08); }
.glassui-select-item.selected {
    background: rgba(99,102,241,0.1);
    border-color: var(--glassui-primary);
    color: var(--glassui-primary);
    font-weight: 600;
}
.glassui-select-grid {
    margin-top: 16px; max-height: 320px;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px; padding: 4px;
}
.glassui-select-grid-item {
    padding: 16px 8px;
    border-radius: var(--glass-radius-sm);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 13px; color: var(--glass-text);
    border: 1.5px solid rgba(128,128,160,0.12);
    text-align: center;
    user-select: none;
    background: rgba(128,128,160,0.04);
}
.glassui-select-grid-item:hover {
    background: rgba(128,128,160,0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--glass-shadow);
}
.glassui-select-grid-item.selected {
    background: rgba(99,102,241,0.12);
    border-color: var(--glassui-primary);
    color: var(--glassui-primary);
    font-weight: 700;
    box-shadow: 0 4px 16px var(--glassui-primary-glow);
}

/* ========================================
   进度条
   ======================================== */
.glassui-progress-wrap { margin-top: 20px; }
.glassui-progress-bar-bg {
    width: 100%; height: 8px;
    background: rgba(128,128,160,0.12);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
}
.glassui-progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--glassui-primary), #818cf8);
    border-radius: 4px;
    transition: width 0.4s var(--spring-smooth);
    position: relative;
    min-width: 0%;
}
.glassui-progress-bar-fill::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: glassui-shimmer 1.5s ease-in-out infinite;
}
.glassui-progress-text {
    text-align: center; margin-top: 8px;
    font-size: 13px; font-weight: 600;
    color: var(--glassui-primary);
}

/* ========================================
   圆环进度
   ======================================== */
.glassui-ring-wrap {
    display: flex; flex-direction: column;
    align-items: center; margin-top: 20px;
}
.glassui-ring-svg {
    animation: glassui-ring-appear 0.5s var(--spring-bounce) forwards;
}
.glassui-ring-bg {
    fill: none;
    stroke: rgba(128,128,160,0.12);
}
.glassui-ring-fill {
    fill: none;
    stroke: var(--glassui-primary);
    stroke-linecap: round;
    transition: stroke-dashoffset 0.5s var(--spring-smooth);
    filter: drop-shadow(0 0 6px var(--glassui-primary-glow));
}
.glassui-ring-text {
    font-size: 28px; font-weight: 800;
    fill: var(--glass-text);
    text-anchor: middle;
    dominant-baseline: central;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
.glassui-ring-label {
    margin-top: 10px;
    font-size: 13px; font-weight: 600;
    color: var(--glassui-primary);
}

/* ========================================
   底部抽屉
   ======================================== */
.glassui-sheet-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: var(--overlay-bg);
    backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
    z-index: 99998;
    animation: glassui-overlay-in 0.3s ease forwards;
}
.glassui-sheet-overlay.closing {
    animation: glassui-overlay-out 0.3s ease forwards;
    pointer-events: none;
}
.glassui-sheet {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    border-top: 1px solid var(--glass-border);
    border-radius: 24px 24px 0 0;
    box-shadow: 0 -8px 40px var(--glass-shadow);
    z-index: 99999;
    padding: 0 28px 28px;
    overflow-y: auto;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    animation: var(--anim-sheet-in);
}
.glassui-sheet.closing {
    animation: var(--anim-sheet-out);
}
.glassui-sheet-handle {
    width: 40px; height: 4px;
    background: rgba(128,128,160,0.3);
    border-radius: 2px;
    margin: 12px auto 20px;
}
.glassui-sheet-title {
    font-size: 18px; font-weight: 700;
    color: var(--glass-text);
    margin: 0 0 12px;
}
.glassui-sheet-content {
    font-size: 14px; line-height: 1.7;
    color: var(--glass-text-secondary);
    margin: 0; word-wrap: break-word;
}
.glassui-sheet-close {
    position: absolute; top: 16px; right: 20px;
    width: 32px; height: 32px;
    border-radius: 50%;
    background: rgba(128,128,160,0.1);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s ease;
    color: var(--glass-text-secondary);
    font-size: 18px;
}
.glassui-sheet-close:hover {
    background: rgba(128,128,160,0.2);
    transform: rotate(90deg);
}

/* ========================================
   Snackbar 底部消息条
   ======================================== */
.glassui-snackbar-container {
    position: fixed; bottom: 24px; left: 50%;
    transform: translateX(-50%);
    z-index: 100002;
    display: flex; flex-direction: column; align-items: center;
    gap: 8px;
    pointer-events: none;
}
.glassui-snackbar {
    background: var(--glass-bg-solid);
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    box-shadow: 0 8px 30px var(--glass-shadow);
    padding: 14px 20px;
    display: flex; align-items: center; gap: 16px;
    min-width: 280px; max-width: 480px;
    pointer-events: auto;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    animation: glassui-snackbar-in 0.4s var(--spring-bounce) forwards;
}
.glassui-snackbar.removing {
    animation: glassui-snackbar-out 0.3s ease forwards;
}
@keyframes glassui-snackbar-in {
    from { opacity: 0; transform: translateY(30px) scale(0.9); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes glassui-snackbar-out {
    from { opacity: 1; transform: translateY(0) scale(1); }
    to { opacity: 0; transform: translateY(20px) scale(0.9); }
}
.glassui-snackbar-text {
    font-size: 14px; font-weight: 500;
    color: var(--glass-text);
    flex: 1;
}
.glassui-snackbar-action {
    background: none; border: none;
    color: var(--glassui-primary);
    font-size: 13px; font-weight: 700;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: background 0.2s ease;
    white-space: nowrap;
    letter-spacing: 0.3px;
    text-transform: uppercase;
}
.glassui-snackbar-action:hover {
    background: rgba(99,102,241,0.1);
}

/* ========================================
   Loading Spinner 加载动画
   ======================================== */
.glassui-spinner-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: var(--overlay-bg);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    z-index: 100003;
    animation: glassui-overlay-in 0.3s ease forwards;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}
.glassui-spinner-overlay.closing {
    animation: glassui-overlay-out 0.25s ease forwards;
    pointer-events: none;
}

/* 圆环旋转 */
.glassui-spinner-ring {
    width: 48px; height: 48px;
    border: 3px solid rgba(128,128,160,0.15);
    border-top-color: var(--glassui-primary);
    border-radius: 50%;
    animation: glassui-spin 0.8s linear infinite;
}
/* 三点跳动 */
.glassui-spinner-dots {
    display: flex; gap: 8px;
}
.glassui-spinner-dots span {
    width: 12px; height: 12px;
    background: var(--glassui-primary);
    border-radius: 50%;
    animation: glassui-dot-bounce 1.4s ease-in-out infinite;
}
.glassui-spinner-dots span:nth-child(2) { animation-delay: 0.16s; }
.glassui-spinner-dots span:nth-child(3) { animation-delay: 0.32s; }
/* 脉冲 */
.glassui-spinner-pulse {
    width: 48px; height: 48px;
    background: var(--glassui-primary);
    border-radius: 50%;
    animation: glassui-pulse-ring 1.2s ease-out infinite;
}
/* 波浪 */
.glassui-spinner-wave {
    display: flex; gap: 4px; align-items: center; height: 48px;
}
.glassui-spinner-wave span {
    width: 6px; height: 100%;
    background: var(--glassui-primary);
    border-radius: 3px;
    animation: glassui-wave 1.2s ease-in-out infinite;
}
.glassui-spinner-wave span:nth-child(2) { animation-delay: 0.1s; }
.glassui-spinner-wave span:nth-child(3) { animation-delay: 0.2s; }
.glassui-spinner-wave span:nth-child(4) { animation-delay: 0.3s; }
.glassui-spinner-wave span:nth-child(5) { animation-delay: 0.4s; }

.glassui-spinner-text {
    margin-top: 20px;
    font-size: 15px; font-weight: 600;
    color: var(--glass-text);
}

/* ========================================
   Stepper 步骤指示器
   ======================================== */
.glassui-stepper {
    display: flex; align-items: center;
    margin-top: 20px; padding: 0 8px;
    overflow-x: auto;
}
.glassui-step {
    display: flex; flex-direction: column;
    align-items: center; position: relative;
    flex: 1; min-width: 80px;
}
.glassui-step-circle {
    width: 36px; height: 36px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700;
    border: 2px solid rgba(128,128,160,0.2);
    color: var(--glass-text-secondary);
    background: rgba(128,128,160,0.06);
    transition: all 0.4s var(--spring-smooth);
    position: relative; z-index: 2;
}
.glassui-step.completed .glassui-step-circle {
    background: var(--glassui-success);
    border-color: var(--glassui-success);
    color: white;
}
.glassui-step.active .glassui-step-circle {
    background: var(--glassui-primary);
    border-color: var(--glassui-primary);
    color: white;
    box-shadow: 0 0 0 4px var(--glassui-primary-glow);
    transform: scale(1.1);
}
.glassui-step-label {
    margin-top: 8px;
    font-size: 12px; font-weight: 500;
    color: var(--glass-text-secondary);
    text-align: center;
    max-width: 80px;
    word-wrap: break-word;
}
.glassui-step.active .glassui-step-label {
    color: var(--glassui-primary);
    font-weight: 700;
}
.glassui-step.completed .glassui-step-label {
    color: var(--glassui-success);
}
.glassui-step-line {
    flex: 1; height: 2px;
    background: rgba(128,128,160,0.15);
    margin: 0 -4px;
    margin-bottom: 28px;
    transition: background 0.4s ease;
    position: relative; z-index: 1;
}
.glassui-step-line.completed {
    background: var(--glassui-success);
}

/* ========================================
   Star Rating 星级评分
   ======================================== */
.glassui-stars {
    display: flex; gap: 8px;
    justify-content: center;
    margin: 20px 0 8px;
}
.glassui-star {
    width: 40px; height: 40px;
    cursor: pointer;
    transition: all 0.2s var(--spring-bounce);
    color: rgba(128,128,160,0.25);
}
.glassui-star:hover { transform: scale(1.25); }
.glassui-star.active {
    color: #fbbf24;
    filter: drop-shadow(0 0 6px rgba(251,191,36,0.4));
}
.glassui-star svg {
    width: 100%; height: 100%;
}
.glassui-star-label {
    text-align: center;
    font-size: 14px; font-weight: 600;
    color: var(--glass-text-secondary);
    margin-bottom: 4px;
}

/* ========================================
   Countdown 倒计时
   ======================================== */
.glassui-countdown-wrap {
    display: flex; flex-direction: column;
    align-items: center; margin-top: 16px;
}
.glassui-countdown-circle {
    position: relative;
    width: 120px; height: 120px;
}
.glassui-countdown-svg {
    transform: rotate(-90deg);
}
.glassui-countdown-bg {
    fill: none;
    stroke: rgba(128,128,160,0.12);
}
.glassui-countdown-fill {
    fill: none;
    stroke: var(--glassui-primary);
    stroke-linecap: round;
    transition: stroke-dashoffset 1s linear;
}
.glassui-countdown-number {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-size: 36px; font-weight: 800;
    color: var(--glass-text);
    font-variant-numeric: tabular-nums;
}
.glassui-countdown-finish {
    margin-top: 12px;
    font-size: 16px; font-weight: 700;
    color: var(--glassui-primary);
    animation: glassui-icon-pop 0.4s var(--spring-bounce);
}

/* ========================================
   Floating Badge 浮动徽章
   ======================================== */
.glassui-badge {
    position: fixed;
    z-index: 100004;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px; font-weight: 700;
    color: white;
    pointer-events: auto;
    cursor: default;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    animation: glassui-badge-appear 0.4s var(--spring-bounce) forwards, glassui-badge-pulse 2s ease infinite 0.5s;
    letter-spacing: 0.5px;
}
@keyframes glassui-badge-appear {
    from { opacity: 0; transform: scale(0.5); }
    to { opacity: 1; transform: scale(1); }
}
.glassui-badge.pos-top-left { top: 60px; left: 16px; }
.glassui-badge.pos-top-right { top: 60px; right: 16px; }
.glassui-badge.pos-bottom-left { bottom: 60px; left: 16px; }
.glassui-badge.pos-bottom-right { bottom: 60px; right: 16px; }
.glassui-badge.pos-top-center { top: 60px; left: 50%; transform: translateX(-50%); }
.glassui-badge.pos-bottom-center { bottom: 60px; left: 50%; transform: translateX(-50%); }

/* ========================================
   Typewriter 打字机
   ======================================== */
.glassui-typewriter-text {
    font-size: 15px; line-height: 1.8;
    color: var(--glass-text);
    margin: 16px 0;
    min-height: 60px;
    word-wrap: break-word;
}
.glassui-typewriter-cursor {
    display: inline-block;
    width: 2px; height: 1.1em;
    background: var(--glassui-primary);
    margin-left: 2px;
    vertical-align: text-bottom;
    animation: glassui-blink 0.8s step-end infinite;
}

/* ========================================
   Tooltip 提示气泡
   ======================================== */
.glassui-tooltip {
    position: fixed;
    z-index: 100005;
    background: var(--glass-bg-solid);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    border-radius: 10px;
    padding: 10px 16px;
    font-size: 13px; font-weight: 500;
    color: var(--glass-text);
    box-shadow: 0 6px 24px var(--glass-shadow);
    pointer-events: none;
    max-width: 280px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
    animation: glassui-tooltip-in 0.3s var(--spring-bounce) forwards;
}
.glassui-tooltip.removing {
    animation: glassui-tooltip-out 0.2s ease forwards;
}
@keyframes glassui-tooltip-in {
    from { opacity: 0; transform: scale(0.9) translateY(4px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes glassui-tooltip-out {
    to { opacity: 0; transform: scale(0.9); }
}
.glassui-tooltip.pos-top-center { top: 16px; left: 50%; transform: translateX(-50%); }
.glassui-tooltip.pos-bottom-center { bottom: 16px; left: 50%; transform: translateX(-50%); }
.glassui-tooltip.pos-top-left { top: 16px; left: 16px; }
.glassui-tooltip.pos-top-right { top: 16px; right: 16px; }
.glassui-tooltip.pos-bottom-left { bottom: 16px; left: 16px; }
.glassui-tooltip.pos-bottom-right { bottom: 16px; right: 16px; }

/* ========================================
   Skeleton Loading 骨架屏
   ======================================== */
.glassui-skeleton-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: var(--overlay-bg);
    backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
    z-index: 100003;
    display: flex; align-items: center; justify-content: center;
    animation: glassui-overlay-in 0.3s ease forwards;
}
.glassui-skeleton-overlay.closing {
    animation: glassui-overlay-out 0.25s ease forwards;
    pointer-events: none;
}
.glassui-skeleton-card {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    border-radius: var(--glass-radius);
    padding: 28px;
    width: 90%; max-width: 400px;
    box-shadow: 0 8px 32px var(--glass-shadow);
}
.glassui-skeleton-line {
    height: 14px;
    border-radius: 7px;
    background: linear-gradient(90deg, rgba(128,128,160,0.08) 25%, rgba(128,128,160,0.15) 50%, rgba(128,128,160,0.08) 75%);
    background-size: 200% 100%;
    animation: glassui-skeleton-shimmer 1.5s ease-in-out infinite;
    margin-bottom: 14px;
}
.glassui-skeleton-line:first-child {
    height: 20px; width: 60%;
    border-radius: 10px;
    margin-bottom: 20px;
}
.glassui-skeleton-line:last-child { width: 75%; }

/* ========================================
   Confetti 撒花
   ======================================== */
.glassui-confetti-container {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    z-index: 100006;
    pointer-events: none;
    overflow: hidden;
}
.glassui-confetti-piece {
    position: absolute;
    width: 10px; height: 10px;
    top: -20px;
    animation: glassui-confetti-fall linear forwards;
}

/* ========================================
   Number Counter 数字动画
   ======================================== */
.glassui-counter-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: var(--overlay-bg);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    z-index: 99999;
    animation: var(--anim-overlay-in);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
}
.glassui-counter-overlay.closing {
    animation: var(--anim-overlay-out);
    pointer-events: none;
}
.glassui-counter-card {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    border: 1px solid var(--glass-border);
    border-radius: var(--glass-radius);
    box-shadow: 0 8px 32px var(--glass-shadow);
    padding: 40px 60px;
    text-align: center;
    animation: var(--anim-card-in);
}
.glassui-counter-number {
    font-size: 64px; font-weight: 800;
    color: var(--glassui-primary);
    font-variant-numeric: tabular-nums;
    text-shadow: 0 0 30px var(--glassui-primary-glow);
}
.glassui-counter-done {
    animation: glassui-counter-pulse 0.3s ease;
}

/* ========================================
   Tab Panel 标签面板
   ======================================== */
.glassui-tabs {
    display: flex; gap: 0;
    border-bottom: 1px solid rgba(128,128,160,0.15);
    margin-bottom: 16px;
    overflow-x: auto;
}
.glassui-tab {
    padding: 10px 20px;
    font-size: 13px; font-weight: 600;
    color: var(--glass-text-secondary);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
    white-space: nowrap;
    user-select: none;
}
.glassui-tab:hover {
    color: var(--glass-text);
    background: rgba(128,128,160,0.05);
}
.glassui-tab.active {
    color: var(--glassui-primary);
    border-bottom-color: var(--glassui-primary);
}
.glassui-tab-content {
    font-size: 14px; line-height: 1.7;
    color: var(--glass-text-secondary);
    padding: 8px 0;
    animation: glassui-fade-in 0.3s ease;
    min-height: 60px;
}

/* ========================================
   Ripple 水波纹
   ======================================== */
.glassui-ripple {
    position: fixed;
    z-index: 100007;
    pointer-events: none;
    width: 50px; height: 50px;
    border-radius: 50%;
    animation: glassui-ripple 0.7s ease-out forwards;
}

/* ========================================
   Image Lightbox 图片灯箱
   ======================================== */
.glassui-lightbox-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    z-index: 100008;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    animation: glassui-overlay-in 0.3s ease forwards;
    cursor: pointer;
}
.glassui-lightbox-overlay.closing {
    animation: glassui-overlay-out 0.25s ease forwards;
    pointer-events: none;
}
.glassui-lightbox-img {
    max-width: 85%; max-height: 75%;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    object-fit: contain;
    animation: glassui-zoom-in 0.4s cubic-bezier(0.22,1,0.36,1) forwards;
    cursor: default;
}
.glassui-lightbox-title {
    margin-top: 16px;
    font-size: 15px; font-weight: 600;
    color: rgba(255,255,255,0.85);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
}
.glassui-lightbox-close {
    position: absolute; top: 20px; right: 20px;
    width: 40px; height: 40px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: white; font-size: 20px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s ease;
}
.glassui-lightbox-close:hover {
    background: rgba(255,255,255,0.2);
    transform: rotate(90deg);
}

/* ========================================
   侧边面板
   ======================================== */
.glassui-side-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: var(--overlay-bg);
    backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
    z-index: 99997;
    animation: glassui-overlay-in 0.3s ease forwards;
}
.glassui-side-overlay.closing {
    animation: glassui-overlay-out 0.3s ease forwards;
    pointer-events: none;
}
.glassui-side-panel {
    position: fixed; top: 0; height: 100%;
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    border: 1px solid var(--glass-border);
    box-shadow: 0 8px 40px var(--glass-shadow);
    z-index: 99998;
    padding: 28px;
    overflow-y: auto;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}
.glassui-side-panel.side-left {
    left: 0;
    border-radius: 0 20px 20px 0;
    animation: glassui-side-in-left 0.45s var(--spring-smooth) forwards;
}
.glassui-side-panel.side-right {
    right: 0;
    border-radius: 20px 0 0 20px;
    animation: glassui-side-in-right 0.45s var(--spring-smooth) forwards;
}
.glassui-side-panel.closing.side-left {
    animation: glassui-side-out-left 0.3s ease forwards;
}
.glassui-side-panel.closing.side-right {
    animation: glassui-side-out-right 0.3s ease forwards;
}
@keyframes glassui-side-in-left {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
}
@keyframes glassui-side-in-right {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}
@keyframes glassui-side-out-left {
    to { transform: translateX(-100%); }
}
@keyframes glassui-side-out-right {
    to { transform: translateX(100%); }
}
.glassui-side-close {
    position: absolute; top: 16px; right: 16px;
    width: 32px; height: 32px;
    border-radius: 50%;
    background: rgba(128,128,160,0.1);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s ease;
    color: var(--glass-text-secondary);
    font-size: 18px;
}
.glassui-side-close:hover {
    background: rgba(128,128,160,0.2);
    transform: rotate(90deg);
}
.glassui-side-title {
    font-size: 18px; font-weight: 700;
    color: var(--glass-text);
    margin: 0 0 16px;
}
.glassui-side-content {
    font-size: 14px; line-height: 1.7;
    color: var(--glass-text-secondary);
    margin: 0; word-wrap: break-word;
}

/* ========================================
   毛玻璃主题增强 - 额外噪声纹理
   ======================================== */
.glassui-frosted-noise::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    border-radius: inherit;
    pointer-events: none;
    z-index: 0;
}
        `;
        document.head.appendChild(style);
    }

    // ============================
    // 主扩展类
    // ============================
    class GlassUI2 {
        constructor(_runtime) {
            this._runtime = _runtime;
            this._currentTheme = 'light';
            this._currentAnimStyle = 'spring';
            this._toasts = [];
            this._toastContainer = null;
            this._cornerContainers = {};
            this._progressOverlay = null;
            this._progressFill = null;
            this._progressText = null;
            this._circularOverlay = null;
            this._circularFill = null;
            this._circularText = null;
            this._circularLabel = null;
            this._sheetOverlay = null;
            this._sheetEl = null;
            this._snackbarContainer = null;
            this._snackbars = [];
            this._spinnerOverlay = null;
            this._stepperOverlay = null;
            this._stepperEl = null;
            this._stepperSteps = [];
            this._countdownOverlay = null;
            this._countdownTimer = null;
            this._badges = [];
            this._typewriterOverlay = null;
            this._typewriterTimer = null;
            this._tooltips = [];
            this._skeletonOverlay = null;
            this._sideOverlay = null;
            this._sidePanel = null;
            this._lightboxOverlay = null;
            this._timers = [];

            injectStyles();
            this._applyTheme('light', '#6366f1');
        }

        // ---------- 清理 ----------
        dispose() {
            this._timers.forEach(id => clearTimeout(id));
            this._timers = [];
            if (this._countdownTimer) clearInterval(this._countdownTimer);
            if (this._typewriterTimer) clearInterval(this._typewriterTimer);
            document.querySelectorAll('.glassui-overlay, .glassui-toast-container, .glassui-corner-container, .glassui-sheet-overlay, .glassui-sheet, .glassui-snackbar-container, .glassui-spinner-overlay, .glassui-skeleton-overlay, .glassui-confetti-container, .glassui-counter-overlay, .glassui-side-overlay, .glassui-side-panel, .glassui-lightbox-overlay, .glassui-badge, .glassui-tooltip, .glassui-ripple')
                .forEach(el => el.remove());
            this._toasts = [];
            this._cornerContainers = {};
            this._snackbars = [];
            this._badges = [];
            this._tooltips = [];
            this._progressOverlay = null;
            this._circularOverlay = null;
            this._spinnerOverlay = null;
            this._stepperOverlay = null;
            this._countdownOverlay = null;
            this._sheetOverlay = null;
            this._sheetEl = null;
            this._sideOverlay = null;
            this._sidePanel = null;
            this._lightboxOverlay = null;
            this._skeletonOverlay = null;
            this._typewriterOverlay = null;
        }

        // ---------- 主题系统 ----------
        _applyTheme(themeName, accentColor) {
            const preset = THEME_PRESETS[themeName] || THEME_PRESETS.light;
            const root = document.documentElement;
            Object.entries(preset).forEach(([k, v]) => root.style.setProperty(k, v));

            const accent = accentColor || ACCENT_PRESETS[themeName] || '#6366f1';
            root.style.setProperty('--glassui-primary', accent);
            root.style.setProperty('--glassui-primary-hover', this._darkenColor(accent, 15));
            root.style.setProperty('--glassui-primary-glow', this._hexToRgba(accent, 0.35));
            root.style.setProperty('--glassui-info', accent);
            root.style.setProperty('--glassui-info-bg', this._hexToRgba(accent, 0.12));

            this._currentTheme = themeName;

            // 毛玻璃增强：给卡片添加噪声纹理class
            if (themeName === 'frosted') {
                document.querySelectorAll('.glassui-card, .glassui-toast, .glassui-corner-item').forEach(el => {
                    el.classList.add('glassui-frosted-noise');
                });
            }
        }

        _darkenColor(hex, percent) {
            hex = hex.replace('#', '');
            if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
            const num = parseInt(hex, 16);
            const r = Math.max(0, (num >> 16) - Math.round(255 * percent / 100));
            const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(255 * percent / 100));
            const b = Math.max(0, (num & 0x0000FF) - Math.round(255 * percent / 100));
            return '#' + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
        }

        _hexToRgba(hex, alpha) {
            hex = hex.replace('#', '');
            if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r},${g},${b},${alpha})`;
        }

        // ---------- 动画风格 ----------
        _applyAnimStyle(styleName) {
            const preset = ANIM_STYLES[styleName] || ANIM_STYLES.spring;
            const root = document.documentElement;
            Object.entries(preset).forEach(([k, v]) => root.style.setProperty(k, v));
            this._currentAnimStyle = styleName;
        }

        // ---------- Toast 容器管理 ----------
        _ensureToastContainer() {
            if (this._toastContainer && this._toastContainer.parentNode) return;
            this._toastContainer = document.createElement('div');
            this._toastContainer.className = 'glassui-toast-container';
            document.body.appendChild(this._toastContainer);
        }

        // ---------- Toast ----------
        _showToast(type, text, icon, duration) {
            this._ensureToastContainer();
            const toast = document.createElement('div');
            toast.className = 'glassui-toast';
            if (this._currentTheme === 'frosted') toast.classList.add('glassui-frosted-noise');

            if (icon && icon !== 'none' && ICONS[icon]) {
                const iconWrap = document.createElement('div');
                iconWrap.className = `glassui-toast-icon icon-${icon}`;
                iconWrap.innerHTML = ICONS[icon];
                toast.appendChild(iconWrap);
            }

            const textEl = document.createElement('div');
            textEl.className = 'glassui-toast-text';
            textEl.textContent = text;
            toast.appendChild(textEl);

            const progressBar = document.createElement('div');
            progressBar.className = `glassui-toast-progress type-${type}`;
            progressBar.style.animationDuration = duration + 's';
            toast.appendChild(progressBar);

            this._toastContainer.appendChild(toast);
            this._toasts.push(toast);

            const timerId = setTimeout(() => this._removeToast(toast), duration * 1000);
            this._timers.push(timerId);
        }

        _removeToast(toast) {
            if (!toast || !toast.parentNode) return;
            toast.classList.add('removing');
            const handler = () => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
                const idx = this._toasts.indexOf(toast);
                if (idx !== -1) this._toasts.splice(idx, 1);
            };
            toast.addEventListener('animationend', handler, {once: true});
            const fallback = setTimeout(handler, 500);
            this._timers.push(fallback);
        }

        // ---------- 遮罩弹窗通用 ----------
        _createOverlay(closable = true) {
            const existing = document.querySelector('.glassui-overlay:not(.closing)');
            if (existing) existing.remove();

            const overlay = document.createElement('div');
            overlay.className = 'glassui-overlay';

            if (closable) {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) this._closeOverlay(overlay);
                });
            }
            document.body.appendChild(overlay);
            return overlay;
        }

        _closeOverlay(overlay) {
            if (!overlay || overlay.classList.contains('closing')) return;
            overlay.classList.add('closing');
            const handler = () => { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); };
            overlay.addEventListener('animationend', handler, {once: true});
            const fallback = setTimeout(handler, 400);
            this._timers.push(fallback);
        }

        _createCard(type) {
            const card = document.createElement('div');
            card.className = 'glassui-card';
            if (type && type !== 'none') card.classList.add('accent-' + type);
            if (this._currentTheme === 'frosted') card.classList.add('glassui-frosted-noise');
            return card;
        }

        _createIconElement(iconType) {
            if (!iconType || iconType === 'none' || !ICONS[iconType]) return null;
            const wrap = document.createElement('div');
            wrap.className = `glassui-icon-wrap icon-${iconType}`;
            wrap.innerHTML = ICONS[iconType];
            return wrap;
        }

        _createButton(text, className, onClick) {
            const btn = document.createElement('button');
            btn.className = `glassui-btn ${className}`;
            btn.textContent = text;
            btn.addEventListener('click', onClick);
            return btn;
        }

        _isZh() {
            return (navigator.language || '').startsWith('zh');
        }

        // ---------- 角落通知 ----------
        _ensureCornerContainer(position) {
            if (this._cornerContainers[position] && this._cornerContainers[position].parentNode) return;
            const container = document.createElement('div');
            container.className = `glassui-corner-container pos-${position}`;
            document.body.appendChild(container);
            this._cornerContainers[position] = container;
        }

        _showCornerNotify(position, title, content, duration) {
            this._ensureCornerContainer(position);
            const container = this._cornerContainers[position];

            const item = document.createElement('div');
            item.className = 'glassui-corner-item';
            if (this._currentTheme === 'frosted') item.classList.add('glassui-frosted-noise');

            const titleEl = document.createElement('div');
            titleEl.className = 'glassui-corner-title';
            titleEl.textContent = title;

            const contentEl = document.createElement('div');
            contentEl.className = 'glassui-corner-content';
            contentEl.textContent = content;

            const progressBar = document.createElement('div');
            progressBar.className = 'glassui-corner-progress';
            progressBar.style.animationDuration = duration + 's';

            item.appendChild(titleEl);
            item.appendChild(contentEl);
            item.appendChild(progressBar);
            container.appendChild(item);

            const timerId = setTimeout(() => this._removeCornerItem(item), duration * 1000);
            this._timers.push(timerId);
        }

        _removeCornerItem(item) {
            if (!item || !item.parentNode) return;
            item.classList.add('removing');
            const handler = () => { if (item.parentNode) item.parentNode.removeChild(item); };
            item.addEventListener('animationend', handler, {once: true});
            const fallback = setTimeout(handler, 400);
            this._timers.push(fallback);
        }

        // ---------- 进度弹窗 ----------
        _showProgressModal(title, content) {
            this._closeProgressModal();
            const overlay = this._createOverlay(false);
            this._progressOverlay = overlay;

            const card = this._createCard('info');
            const body = document.createElement('div');
            body.className = 'glassui-card-body';

            const titleEl = document.createElement('div');
            titleEl.className = 'glassui-title';
            titleEl.textContent = title;

            const contentEl = document.createElement('div');
            contentEl.className = 'glassui-content';
            contentEl.textContent = content;

            const progressWrap = document.createElement('div');
            progressWrap.className = 'glassui-progress-wrap';

            const barBg = document.createElement('div');
            barBg.className = 'glassui-progress-bar-bg';

            this._progressFill = document.createElement('div');
            this._progressFill.className = 'glassui-progress-bar-fill';
            this._progressFill.style.width = '0%';

            this._progressText = document.createElement('div');
            this._progressText.className = 'glassui-progress-text';
            this._progressText.textContent = '0%';

            barBg.appendChild(this._progressFill);
            progressWrap.appendChild(barBg);
            progressWrap.appendChild(this._progressText);

            body.appendChild(titleEl);
            body.appendChild(contentEl);
            body.appendChild(progressWrap);
            card.appendChild(body);
            overlay.appendChild(card);
        }

        _updateProgress(percent) {
            percent = Math.max(0, Math.min(100, percent));
            if (this._progressFill) this._progressFill.style.width = percent + '%';
            if (this._progressText) this._progressText.textContent = Math.round(percent) + '%';
        }

        _closeProgressModal() {
            if (this._progressOverlay) {
                this._closeOverlay(this._progressOverlay);
                this._progressOverlay = null;
                this._progressFill = null;
                this._progressText = null;
            }
        }

        // ---------- 圆环进度弹窗 ----------
        _showCircularProgressModal(title, content, size) {
            this._closeCircularProgressModal();
            const overlay = this._createOverlay(false);
            this._circularOverlay = overlay;

            const card = this._createCard('info');
            const body = document.createElement('div');
            body.className = 'glassui-card-body';

            const titleEl = document.createElement('div');
            titleEl.className = 'glassui-title';
            titleEl.textContent = title;

            const contentEl = document.createElement('div');
            contentEl.className = 'glassui-content';
            contentEl.textContent = content;

            const ringWrap = document.createElement('div');
            ringWrap.className = 'glassui-ring-wrap';

            const svgSize = Math.max(80, Math.min(200, size));
            const radius = (svgSize - 16) / 2;
            const circumference = 2 * Math.PI * radius;

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', svgSize);
            svg.setAttribute('height', svgSize);
            svg.setAttribute('viewBox', `0 0 ${svgSize} ${svgSize}`);
            svg.classList.add('glassui-ring-svg');
            svg.style.transform = 'rotate(-90deg)';

            const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            bgCircle.setAttribute('cx', svgSize / 2);
            bgCircle.setAttribute('cy', svgSize / 2);
            bgCircle.setAttribute('r', radius);
            bgCircle.setAttribute('stroke-width', '8');
            bgCircle.classList.add('glassui-ring-bg');

            this._circularFill = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            this._circularFill.setAttribute('cx', svgSize / 2);
            this._circularFill.setAttribute('cy', svgSize / 2);
            this._circularFill.setAttribute('r', radius);
            this._circularFill.setAttribute('stroke-width', '8');
            this._circularFill.setAttribute('stroke-dasharray', circumference);
            this._circularFill.setAttribute('stroke-dashoffset', circumference);
            this._circularFill.classList.add('glassui-ring-fill');
            this._circularCircumference = circumference;

            // 中心文字需要反转rotate
            const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textEl.setAttribute('x', svgSize / 2);
            textEl.setAttribute('y', svgSize / 2);
            textEl.classList.add('glassui-ring-text');
            textEl.textContent = '0%';
            textEl.style.transform = 'rotate(90deg)';
            textEl.style.transformOrigin = 'center';
            this._circularText = textEl;

            svg.appendChild(bgCircle);
            svg.appendChild(this._circularFill);
            svg.appendChild(textEl);

            const label = document.createElement('div');
            label.className = 'glassui-ring-label';
            label.textContent = '0%';
            this._circularLabel = label;

            ringWrap.appendChild(svg);
            ringWrap.appendChild(label);

            body.appendChild(titleEl);
            body.appendChild(contentEl);
            body.appendChild(ringWrap);
            card.appendChild(body);
            overlay.appendChild(card);
        }

        _updateCircularProgress(percent) {
            percent = Math.max(0, Math.min(100, percent));
            if (this._circularFill && this._circularCircumference) {
                const offset = this._circularCircumference - (percent / 100) * this._circularCircumference;
                this._circularFill.setAttribute('stroke-dashoffset', offset);
            }
            if (this._circularText) this._circularText.textContent = Math.round(percent) + '%';
            if (this._circularLabel) this._circularLabel.textContent = Math.round(percent) + '%';
        }

        _closeCircularProgressModal() {
            if (this._circularOverlay) {
                this._closeOverlay(this._circularOverlay);
                this._circularOverlay = null;
                this._circularFill = null;
                this._circularText = null;
                this._circularLabel = null;
                this._circularCircumference = null;
            }
        }

        // ---------- 底部抽屉 ----------
        _showBottomSheet(title, content, heightPercent) {
            this._closeBottomSheet();

            const overlay = document.createElement('div');
            overlay.className = 'glassui-sheet-overlay';
            overlay.addEventListener('click', () => this._closeBottomSheet());
            document.body.appendChild(overlay);
            this._sheetOverlay = overlay;

            const sheet = document.createElement('div');
            sheet.className = 'glassui-sheet';
            sheet.style.height = heightPercent + '%';
            sheet.style.maxHeight = '85%';

            const handle = document.createElement('div');
            handle.className = 'glassui-sheet-handle';

            const closeBtn = document.createElement('button');
            closeBtn.className = 'glassui-sheet-close';
            closeBtn.innerHTML = '✕';
            closeBtn.addEventListener('click', () => this._closeBottomSheet());

            const titleEl = document.createElement('div');
            titleEl.className = 'glassui-sheet-title';
            titleEl.textContent = title;

            const contentEl = document.createElement('div');
            contentEl.className = 'glassui-sheet-content';
            contentEl.textContent = content;

            sheet.appendChild(handle);
            sheet.appendChild(closeBtn);
            sheet.appendChild(titleEl);
            sheet.appendChild(contentEl);
            document.body.appendChild(sheet);
            this._sheetEl = sheet;
        }

        _closeBottomSheet() {
            if (this._sheetOverlay) {
                this._sheetOverlay.classList.add('closing');
                const o = this._sheetOverlay;
                const removeO = () => { if (o.parentNode) o.parentNode.removeChild(o); };
                o.addEventListener('animationend', removeO, {once: true});
                const t1 = setTimeout(removeO, 400);
                this._timers.push(t1);
                this._sheetOverlay = null;
            }
            if (this._sheetEl) {
                this._sheetEl.classList.add('closing');
                const s = this._sheetEl;
                const removeS = () => { if (s.parentNode) s.parentNode.removeChild(s); };
                s.addEventListener('animationend', removeS, {once: true});
                const t2 = setTimeout(removeS, 400);
                this._timers.push(t2);
                this._sheetEl = null;
            }
        }

        // ---------- Snackbar ----------
        _ensureSnackbarContainer() {
            if (this._snackbarContainer && this._snackbarContainer.parentNode) return;
            this._snackbarContainer = document.createElement('div');
            this._snackbarContainer.className = 'glassui-snackbar-container';
            document.body.appendChild(this._snackbarContainer);
        }

        _showSnackbar(text, actionText, duration) {
            this._ensureSnackbarContainer();

            const sb = document.createElement('div');
            sb.className = 'glassui-snackbar';

            const textEl = document.createElement('div');
            textEl.className = 'glassui-snackbar-text';
            textEl.textContent = text;
            sb.appendChild(textEl);

            if (actionText) {
                const actionBtn = document.createElement('button');
                actionBtn.className = 'glassui-snackbar-action';
                actionBtn.textContent = actionText;
                actionBtn.addEventListener('click', () => this._removeSnackbar(sb));
                sb.appendChild(actionBtn);
            }

            this._snackbarContainer.appendChild(sb);
            this._snackbars.push(sb);

            const timerId = setTimeout(() => this._removeSnackbar(sb), duration * 1000);
            this._timers.push(timerId);
        }

        _removeSnackbar(sb) {
            if (!sb || !sb.parentNode) return;
            sb.classList.add('removing');
            const handler = () => {
                if (sb.parentNode) sb.parentNode.removeChild(sb);
                const idx = this._snackbars.indexOf(sb);
                if (idx !== -1) this._snackbars.splice(idx, 1);
            };
            sb.addEventListener('animationend', handler, {once: true});
            const fallback = setTimeout(handler, 400);
            this._timers.push(fallback);
        }

        // ---------- Loading Spinner ----------
        _showSpinner(text, spinnerStyle) {
            this._closeSpinner();

            const overlay = document.createElement('div');
            overlay.className = 'glassui-spinner-overlay';
            overlay.addEventListener('click', () => this._closeSpinner());

            let spinnerEl;
            switch (spinnerStyle) {
                case 'dots':
                    spinnerEl = document.createElement('div');
                    spinnerEl.className = 'glassui-spinner-dots';
                    for (let i = 0; i < 3; i++) {
                        spinnerEl.appendChild(document.createElement('span'));
                    }
                    break;
                case 'pulse':
                    spinnerEl = document.createElement('div');
                    spinnerEl.className = 'glassui-spinner-pulse';
                    break;
                case 'wave':
                    spinnerEl = document.createElement('div');
                    spinnerEl.className = 'glassui-spinner-wave';
                    for (let i = 0; i < 5; i++) {
                        spinnerEl.appendChild(document.createElement('span'));
                    }
                    break;
                default: // ring
                    spinnerEl = document.createElement('div');
                    spinnerEl.className = 'glassui-spinner-ring';
            }

            overlay.appendChild(spinnerEl);

            if (text) {
                const textEl = document.createElement('div');
                textEl.className = 'glassui-spinner-text';
                textEl.textContent = text;
                overlay.appendChild(textEl);
            }

            document.body.appendChild(overlay);
            this._spinnerOverlay = overlay;
        }

        _closeSpinner() {
            if (this._spinnerOverlay) {
                this._spinnerOverlay.classList.add('closing');
                const el = this._spinnerOverlay;
                const handler = () => { if (el.parentNode) el.parentNode.removeChild(el); };
                el.addEventListener('animationend', handler, {once: true});
                const fallback = setTimeout(handler, 400);
                this._timers.push(fallback);
                this._spinnerOverlay = null;
            }
        }

        // ---------- Stepper ----------
        _showStepper(title, steps, current) {
            this._closeStepper();
            this._stepperSteps = steps;

            const overlay = this._createOverlay(false);
            this._stepperOverlay = overlay;

            const card = this._createCard('info');
            card.style.maxWidth = '560px';
            const body = document.createElement('div');
            body.className = 'glassui-card-body';

            const titleEl = document.createElement('div');
            titleEl.className = 'glassui-title';
            titleEl.textContent = title;
            body.appendChild(titleEl);

            const stepperEl = document.createElement('div');
            stepperEl.className = 'glassui-stepper';
            this._stepperEl = stepperEl;

            this._renderStepper(stepperEl, steps, current);

            body.appendChild(stepperEl);
            card.appendChild(body);
            overlay.appendChild(card);
        }

        _renderStepper(container, steps, current) {
            container.innerHTML = '';
            steps.forEach((step, i) => {
                const stepEl = document.createElement('div');
                stepEl.className = 'glassui-step';
                if (i < current) stepEl.classList.add('completed');
                if (i === current) stepEl.classList.add('active');

                const circle = document.createElement('div');
                circle.className = 'glassui-step-circle';
                circle.textContent = i < current ? '✓' : (i + 1);

                const label = document.createElement('div');
                label.className = 'glassui-step-label';
                label.textContent = step;

                stepEl.appendChild(circle);
                stepEl.appendChild(label);
                container.appendChild(stepEl);

                if (i < steps.length - 1) {
                    const line = document.createElement('div');
                    line.className = 'glassui-step-line';
                    if (i < current) line.classList.add('completed');
                    container.appendChild(line);
                }
            });
        }

        _updateStepper(step) {
            if (this._stepperEl && this._stepperSteps.length > 0) {
                this._renderStepper(this._stepperEl, this._stepperSteps, step);
            }
        }

        _closeStepper() {
            if (this._stepperOverlay) {
                this._closeOverlay(this._stepperOverlay);
                this._stepperOverlay = null;
                this._stepperEl = null;
                this._stepperSteps = [];
            }
        }

        // ---------- Countdown ----------
        _showCountdown(seconds, title, finishText) {
            this._closeCountdown();

            const overlay = this._createOverlay(false);
            this._countdownOverlay = overlay;

            const card = this._createCard('info');
            const body = document.createElement('div');
            body.className = 'glassui-card-body';

            const titleEl = document.createElement('div');
            titleEl.className = 'glassui-title';
            titleEl.textContent = title;

            const wrap = document.createElement('div');
            wrap.className = 'glassui-countdown-wrap';

            const circleSize = 120;
            const radius = 52;
            const circumference = 2 * Math.PI * radius;

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', circleSize);
            svg.setAttribute('height', circleSize);
            svg.classList.add('glassui-countdown-svg');

            const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            bgCircle.setAttribute('cx', circleSize / 2);
            bgCircle.setAttribute('cy', circleSize / 2);
            bgCircle.setAttribute('r', radius);
            bgCircle.setAttribute('stroke-width', '6');
            bgCircle.classList.add('glassui-countdown-bg');

            const fillCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            fillCircle.setAttribute('cx', circleSize / 2);
            fillCircle.setAttribute('cy', circleSize / 2);
            fillCircle.setAttribute('r', radius);
            fillCircle.setAttribute('stroke-width', '6');
            fillCircle.setAttribute('stroke-dasharray', circumference);
            fillCircle.setAttribute('stroke-dashoffset', '0');
            fillCircle.classList.add('glassui-countdown-fill');

            svg.appendChild(bgCircle);
            svg.appendChild(fillCircle);

            const circleWrap = document.createElement('div');
            circleWrap.className = 'glassui-countdown-circle';
            circleWrap.appendChild(svg);

            const numEl = document.createElement('div');
            numEl.className = 'glassui-countdown-number';
            numEl.textContent = seconds;
            circleWrap.appendChild(numEl);

            wrap.appendChild(circleWrap);
            body.appendChild(titleEl);
            body.appendChild(wrap);
            card.appendChild(body);
            overlay.appendChild(card);

            let remaining = seconds;
            this._countdownTimer = setInterval(() => {
                remaining--;
                numEl.textContent = Math.max(0, remaining);
                const offset = ((seconds - remaining) / seconds) * circumference;
                fillCircle.setAttribute('stroke-dashoffset', offset);

                if (remaining <= 0) {
                    clearInterval(this._countdownTimer);
                    this._countdownTimer = null;
                    numEl.textContent = '🎉';
                    const finishEl = document.createElement('div');
                    finishEl.className = 'glassui-countdown-finish';
                    finishEl.textContent = finishText;
                    wrap.appendChild(finishEl);
                }
            }, 1000);
        }

        _closeCountdown() {
            if (this._countdownTimer) {
                clearInterval(this._countdownTimer);
                this._countdownTimer = null;
            }
            if (this._countdownOverlay) {
                this._closeOverlay(this._countdownOverlay);
                this._countdownOverlay = null;
            }
        }

        // ---------- Floating Badge ----------
        _showBadge(text, position, color) {
            const badge = document.createElement('div');
            badge.className = `glassui-badge pos-${position}`;
            badge.style.background = color || 'var(--glassui-primary)';
            badge.textContent = text;
            document.body.appendChild(badge);
            this._badges.push(badge);
        }

        _clearBadges() {
            this._badges.forEach(b => { if (b.parentNode) b.parentNode.removeChild(b); });
            this._badges = [];
        }

        // ---------- Typewriter ----------
        _showTypewriter(title, content, speed) {
            this._closeTypewriter();

            const overlay = this._createOverlay(true);
            this._typewriterOverlay = overlay;

            const card = this._createCard('info');
            const body = document.createElement('div');
            body.className = 'glassui-card-body';

            const titleEl = document.createElement('div');
            titleEl.className = 'glassui-title left-align';
            titleEl.textContent = title;

            const textEl = document.createElement('div');
            textEl.className = 'glassui-typewriter-text';

            const cursor = document.createElement('span');
            cursor.className = 'glassui-typewriter-cursor';

            textEl.appendChild(cursor);
            body.appendChild(titleEl);
            body.appendChild(textEl);

            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'glassui-buttons';
            buttonsDiv.appendChild(this._createButton(
                this._isZh() ? '关闭' : 'Close',
                'glassui-btn-primary',
                () => { this._closeTypewriter(); this._closeOverlay(overlay); }
            ));
            body.appendChild(buttonsDiv);

            card.appendChild(body);
            overlay.appendChild(card);

            let idx = 0;
            const chars = [...content]; // handle emoji/surrogate pairs
            this._typewriterTimer = setInterval(() => {
                if (idx < chars.length) {
                    const charNode = document.createTextNode(chars[idx]);
                    textEl.insertBefore(charNode, cursor);
                    idx++;
                } else {
                    clearInterval(this._typewriterTimer);
                    this._typewriterTimer = null;
                    // Remove cursor after typing done
                    const t = setTimeout(() => {
                        if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
                    }, 2000);
                    this._timers.push(t);
                }
            }, Math.max(10, speed));
        }

        _closeTypewriter() {
            if (this._typewriterTimer) {
                clearInterval(this._typewriterTimer);
                this._typewriterTimer = null;
            }
            this._typewriterOverlay = null;
        }

        // ---------- Tooltip ----------
        _showTooltip(text, position, duration) {
            const tip = document.createElement('div');
            tip.className = `glassui-tooltip pos-${position}`;
            tip.textContent = text;
            document.body.appendChild(tip);
            this._tooltips.push(tip);

            const timerId = setTimeout(() => this._removeTooltip(tip), duration * 1000);
            this._timers.push(timerId);
        }

        _removeTooltip(tip) {
            if (!tip || !tip.parentNode) return;
            tip.classList.add('removing');
            const handler = () => {
                if (tip.parentNode) tip.parentNode.removeChild(tip);
                const idx = this._tooltips.indexOf(tip);
                if (idx !== -1) this._tooltips.splice(idx, 1);
            };
            tip.addEventListener('animationend', handler, {once: true});
            const fallback = setTimeout(handler, 300);
            this._timers.push(fallback);
        }

        _clearTooltips() {
            const tips = [...this._tooltips];
            tips.forEach(t => this._removeTooltip(t));
        }

        // ---------- Skeleton ----------
        _showSkeleton(rows, duration) {
            this._closeSkeleton();

            const overlay = document.createElement('div');
            overlay.className = 'glassui-skeleton-overlay';

            const card = document.createElement('div');
            card.className = 'glassui-skeleton-card';

            const numRows = Math.max(1, Math.min(10, rows));
            for (let i = 0; i < numRows; i++) {
                const line = document.createElement('div');
                line.className = 'glassui-skeleton-line';
                // Vary widths for visual interest
                if (i > 0) line.style.width = (60 + Math.random() * 35) + '%';
                card.appendChild(line);
            }

            overlay.appendChild(card);
            document.body.appendChild(overlay);
            this._skeletonOverlay = overlay;

            if (duration > 0) {
                const timerId = setTimeout(() => this._closeSkeleton(), duration * 1000);
                this._timers.push(timerId);
            }
        }

        _closeSkeleton() {
            if (this._skeletonOverlay) {
                this._skeletonOverlay.classList.add('closing');
                const el = this._skeletonOverlay;
                const handler = () => { if (el.parentNode) el.parentNode.removeChild(el); };
                el.addEventListener('animationend', handler, {once: true});
                const fallback = setTimeout(handler, 400);
                this._timers.push(fallback);
                this._skeletonOverlay = null;
            }
        }

        // ---------- Confetti ----------
        _showConfetti(count, duration) {
            const container = document.createElement('div');
            container.className = 'glassui-confetti-container';

            const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6bff','#ff9f43','#a855f7','#06d6a0'];
            const shapes = ['circle','square','triangle'];
            const numPieces = Math.max(10, Math.min(200, count));

            for (let i = 0; i < numPieces; i++) {
                const piece = document.createElement('div');
                piece.className = 'glassui-confetti-piece';
                const color = colors[Math.floor(Math.random() * colors.length)];
                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                const left = Math.random() * 100;
                const delay = Math.random() * (duration * 0.5);
                const animDur = duration * 0.5 + Math.random() * duration * 0.5;
                const size = 6 + Math.random() * 10;

                piece.style.left = left + '%';
                piece.style.width = size + 'px';
                piece.style.height = size + 'px';
                piece.style.background = color;
                piece.style.animationDuration = animDur + 's';
                piece.style.animationDelay = delay + 's';

                if (shape === 'circle') {
                    piece.style.borderRadius = '50%';
                } else if (shape === 'triangle') {
                    piece.style.background = 'transparent';
                    piece.style.width = '0';
                    piece.style.height = '0';
                    piece.style.borderLeft = (size/2) + 'px solid transparent';
                    piece.style.borderRight = (size/2) + 'px solid transparent';
                    piece.style.borderBottom = size + 'px solid ' + color;
                }

                container.appendChild(piece);
            }

            document.body.appendChild(container);

            const timerId = setTimeout(() => {
                if (container.parentNode) container.parentNode.removeChild(container);
            }, (duration + 1) * 1000);
            this._timers.push(timerId);
        }

        // ---------- Number Counter ----------
        _showNumberCounter(from, to, duration) {
            return new Promise((resolve) => {
                const overlay = document.createElement('div');
                overlay.className = 'glassui-counter-overlay';
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        overlay.classList.add('closing');
                        const handler = () => { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); };
                        overlay.addEventListener('animationend', handler, {once: true});
                        const fallback = setTimeout(handler, 400);
                        this._timers.push(fallback);
                        resolve(to);
                    }
                });

                const card = document.createElement('div');
                card.className = 'glassui-counter-card';

                const numEl = document.createElement('div');
                numEl.className = 'glassui-counter-number';
                numEl.textContent = from;

                card.appendChild(numEl);
                overlay.appendChild(card);
                document.body.appendChild(overlay);

                const startTime = performance.now();
                const durationMs = duration * 1000;
                const diff = to - from;

                const animate = (now) => {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / durationMs, 1);
                    // easeOutExpo
                    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const current = Math.round(from + diff * eased);
                    numEl.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        numEl.classList.add('glassui-counter-done');
                        const t = setTimeout(() => {
                            overlay.classList.add('closing');
                            const handler = () => { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); };
                            overlay.addEventListener('animationend', handler, {once: true});
                            const fallback = setTimeout(handler, 400);
                            this._timers.push(fallback);
                            resolve(to);
                        }, 1500);
                        this._timers.push(t);
                    }
                };
                requestAnimationFrame(animate);
            });
        }

        // ---------- Tab Panel ----------
        _showTabPanel(title, tabs, contents) {
            const overlay = this._createOverlay(true);

            const card = this._createCard('info');
            card.style.maxWidth = '500px';
            const body = document.createElement('div');
            body.className = 'glassui-card-body';

            const titleEl = document.createElement('div');
            titleEl.className = 'glassui-title left-align';
            titleEl.textContent = title;
            body.appendChild(titleEl);

            const tabsEl = document.createElement('div');
            tabsEl.className = 'glassui-tabs';

            const contentEl = document.createElement('div');
            contentEl.className = 'glassui-tab-content';

            tabs.forEach((tab, i) => {
                const tabBtn = document.createElement('div');
                tabBtn.className = 'glassui-tab';
                tabBtn.textContent = tab;
                tabBtn.addEventListener('click', () => {
                    tabsEl.querySelectorAll('.glassui-tab').forEach(t => t.classList.remove('active'));
                    tabBtn.classList.add('active');
                    contentEl.textContent = contents[i] || '';
                    contentEl.style.animation = 'none';
                    contentEl.offsetHeight; // trigger reflow
                    contentEl.style.animation = 'glassui-fade-in 0.3s ease';
                });
                if (i === 0) tabBtn.classList.add('active');
                tabsEl.appendChild(tabBtn);
            });

            contentEl.textContent = contents[0] || '';

            body.appendChild(tabsEl);
            body.appendChild(contentEl);

            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'glassui-buttons';
            buttonsDiv.appendChild(this._createButton(
                this._isZh() ? '关闭' : 'Close',
                'glassui-btn-primary',
                () => this._closeOverlay(overlay)
            ));
            body.appendChild(buttonsDiv);

            card.appendChild(body);
            overlay.appendChild(card);
        }

        // ---------- Ripple ----------
        _showRipple(position, color) {
            const ripple = document.createElement('div');
            ripple.className = 'glassui-ripple';
            ripple.style.background = color || 'var(--glassui-primary-glow)';

            let x, y;
            switch (position) {
                case 'top-left': x = 80; y = 80; break;
                case 'top-right': x = window.innerWidth - 80; y = 80; break;
                case 'bottom-left': x = 80; y = window.innerHeight - 80; break;
                case 'bottom-right': x = window.innerWidth - 80; y = window.innerHeight - 80; break;
                case 'top-center': x = window.innerWidth / 2; y = 80; break;
                case 'bottom-center': x = window.innerWidth / 2; y = window.innerHeight - 80; break;
                default: x = window.innerWidth / 2; y = window.innerHeight / 2;
            }

            ripple.style.left = (x - 25) + 'px';
            ripple.style.top = (y - 25) + 'px';
            document.body.appendChild(ripple);

            const t = setTimeout(() => {
                if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
            }, 800);
            this._timers.push(t);
        }

        // ---------- Image Lightbox ----------
        _showImageLightbox(url, title) {
            this._closeLightbox();

            const overlay = document.createElement('div');
            overlay.className = 'glassui-lightbox-overlay';
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) this._closeLightbox();
            });

            const closeBtn = document.createElement('button');
            closeBtn.className = 'glassui-lightbox-close';
            closeBtn.innerHTML = '✕';
            closeBtn.addEventListener('click', () => this._closeLightbox());

            const img = document.createElement('img');
            img.className = 'glassui-lightbox-img';
            img.src = url;
            img.alt = title;
            img.addEventListener('click', (e) => e.stopPropagation());

            const titleEl = document.createElement('div');
            titleEl.className = 'glassui-lightbox-title';
            titleEl.textContent = title;

            overlay.appendChild(closeBtn);
            overlay.appendChild(img);
            overlay.appendChild(titleEl);
            document.body.appendChild(overlay);
            this._lightboxOverlay = overlay;

            // ESC to close
            const keyHandler = (e) => {
                if (e.key === 'Escape') {
                    document.removeEventListener('keydown', keyHandler);
                    this._closeLightbox();
                }
            };
            document.addEventListener('keydown', keyHandler);
        }

        _closeLightbox() {
            if (this._lightboxOverlay) {
                this._lightboxOverlay.classList.add('closing');
                const el = this._lightboxOverlay;
                const handler = () => { if (el.parentNode) el.parentNode.removeChild(el); };
                el.addEventListener('animationend', handler, {once: true});
                const fallback = setTimeout(handler, 400);
                this._timers.push(fallback);
                this._lightboxOverlay = null;
            }
        }

        // ---------- Slide Panel ----------
        _showSlidePanel(side, title, content, widthPercent) {
            this._closeSlidePanel();

            const overlay = document.createElement('div');
            overlay.className = 'glassui-side-overlay';
            overlay.addEventListener('click', () => this._closeSlidePanel());
            document.body.appendChild(overlay);
            this._sideOverlay = overlay;

            const panel = document.createElement('div');
            panel.className = `glassui-side-panel side-${side}`;
            panel.style.width = widthPercent + '%';
            panel.style.maxWidth = '480px';

            const closeBtn = document.createElement('button');
            closeBtn.className = 'glassui-side-close';
            closeBtn.innerHTML = '✕';
            closeBtn.addEventListener('click', () => this._closeSlidePanel());

            const titleEl = document.createElement('div');
            titleEl.className = 'glassui-side-title';
            titleEl.textContent = title;

            const contentEl = document.createElement('div');
            contentEl.className = 'glassui-side-content';
            contentEl.textContent = content;

            panel.appendChild(closeBtn);
            panel.appendChild(titleEl);
            panel.appendChild(contentEl);
            document.body.appendChild(panel);
            this._sidePanel = panel;
        }

        _closeSlidePanel() {
            if (this._sideOverlay) {
                this._sideOverlay.classList.add('closing');
                const o = this._sideOverlay;
                const removeO = () => { if (o.parentNode) o.parentNode.removeChild(o); };
                o.addEventListener('animationend', removeO, {once: true});
                const t1 = setTimeout(removeO, 400);
                this._timers.push(t1);
                this._sideOverlay = null;
            }
            if (this._sidePanel) {
                this._sidePanel.classList.add('closing');
                const p = this._sidePanel;
                const removeP = () => { if (p.parentNode) p.parentNode.removeChild(p); };
                p.addEventListener('animationend', removeP, {once: true});
                const t2 = setTimeout(removeP, 500);
                this._timers.push(t2);
                this._sidePanel = null;
            }
        }

        // ============================
        // getInfo — 积木定义
        // ============================
        getInfo() {
            return {
                id: 'ces9195ui2',
                name: translate({id: 'extensionName'}),
                color1: '#6366f1',
                color2: '#4f46e5',
                color3: '#818cf8',
                blocks: [
                    // ===== Toast 通知 =====
                    {
                        opcode: 'toastWithType',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'toastWithType'}),
                        arguments: {
                            TYPE: { type: ArgumentType.STRING, menu: 'toastTypeMenu', defaultValue: 'success' },
                            TEXT: { type: ArgumentType.STRING, defaultValue: translate({id: 'toast.TEXT_default'}) },
                            ICON: { type: ArgumentType.STRING, menu: 'iconMenu', defaultValue: 'success' },
                            DURATION: { type: ArgumentType.NUMBER, defaultValue: 3 }
                        }
                    },
                    {
                        opcode: 'clearToasts',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'clearToasts'})
                    },
                    '---',
                    // ===== Snackbar =====
                    {
                        opcode: 'snackbar',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'snackbar'}),
                        arguments: {
                            TEXT: { type: ArgumentType.STRING, defaultValue: translate({id: 'snackbar.TEXT_default'}) },
                            ACTION: { type: ArgumentType.STRING, defaultValue: translate({id: 'snackbar.ACTION_default'}) },
                            DURATION: { type: ArgumentType.NUMBER, defaultValue: 4 }
                        }
                    },
                    '---',
                    // ===== 角落通知 =====
                    {
                        opcode: 'cornerNotify',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'cornerNotify'}),
                        arguments: {
                            POSITION: { type: ArgumentType.STRING, menu: 'positionMenu', defaultValue: 'top-right' },
                            TITLE: { type: ArgumentType.STRING, defaultValue: translate({id: 'cornerNotify.TITLE_default'}) },
                            CONTENT: { type: ArgumentType.STRING, defaultValue: translate({id: 'cornerNotify.CONTENT_default'}) },
                            DURATION: { type: ArgumentType.NUMBER, defaultValue: 4 }
                        }
                    },
                    {
                        opcode: 'clearCornerNotifys',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'clearCornerNotifys'})
                    },
                    '---',
                    // ===== 通知音效 =====
                    {
                        opcode: 'playSound',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'playSound'}),
                        arguments: {
                            TYPE: { type: ArgumentType.STRING, menu: 'soundMenu', defaultValue: 'success' }
                        }
                    },
                    '---',
                    // ===== 模态弹窗 =====
                    {
                        opcode: 'modalAlert',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'modalAlert'}),
                        arguments: {
                            TITLE: { type: ArgumentType.STRING, defaultValue: translate({id: 'modal.TITLE_default'}) },
                            CONTENT: { type: ArgumentType.STRING, defaultValue: translate({id: 'modal.CONTENT_default'}) },
                            ICON: { type: ArgumentType.STRING, menu: 'iconMenu', defaultValue: 'info' }
                        }
                    },
                    {
                        opcode: 'modalConfirm',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'modalConfirm'}),
                        arguments: {
                            TITLE: { type: ArgumentType.STRING, defaultValue: translate({id: 'modal.TITLE_default'}) },
                            CONTENT: { type: ArgumentType.STRING, defaultValue: translate({id: 'modalConfirm.MESSAGE_default'}) },
                            OK_TEXT: { type: ArgumentType.STRING, defaultValue: translate({id: 'modal.OK_default'}) },
                            CANCEL_TEXT: { type: ArgumentType.STRING, defaultValue: translate({id: 'modal.CANCEL_default'}) }
                        }
                    },
                    {
                        opcode: 'modalPrompt',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'modalPrompt'}),
                        arguments: {
                            TITLE: { type: ArgumentType.STRING, defaultValue: translate({id: 'modalPrompt.TITLE_default'}) },
                            PLACEHOLDER: { type: ArgumentType.STRING, defaultValue: translate({id: 'modalPrompt.PLACEHOLDER_default'}) },
                            DEFAULT: { type: ArgumentType.STRING, defaultValue: translate({id: 'modalPrompt.DEFAULT_default'}) }
                        }
                    },
                    {
                        opcode: 'selectionModal',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'selectionModal'}),
                        arguments: {
                            TITLE: { type: ArgumentType.STRING, defaultValue: translate({id: 'selectionModal.TITLE_default'}) },
                            OPTIONS: { type: ArgumentType.STRING, defaultValue: translate({id: 'selectionModal.OPTIONS_default'}) },
                            LAYOUT: { type: ArgumentType.STRING, menu: 'layoutMenu', defaultValue: 'list' },
                            SEPARATOR: { type: ArgumentType.STRING, menu: 'separatorMenu', defaultValue: 'comma' }
                        }
                    },
                    {
                        opcode: 'starRating',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'starRating'}),
                        arguments: {
                            TITLE: { type: ArgumentType.STRING, defaultValue: translate({id: 'starRating.TITLE_default'}) },
                            DEFAULT: { type: ArgumentType.NUMBER, defaultValue: 0 },
                            MAX: { type: ArgumentType.NUMBER, defaultValue: 5 }
                        }
                    },
                    {
                        opcode: 'tabPanel',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'tabPanel'}),
                        arguments: {
                            TITLE: { type: ArgumentType.STRING, defaultValue: translate({id: 'tabPanel.TITLE_default'}) },
                            TABS: { type: ArgumentType.STRING, defaultValue: translate({id: 'tabPanel.TABS_default'}) },
                            CONTENTS: { type: ArgumentType.STRING, defaultValue: translate({id: 'tabPanel.CONTENTS_default'}) },
                            SEPARATOR: { type: ArgumentType.STRING, menu: 'separatorMenu', defaultValue: 'comma' }
                        }
                    },
                    '---',
                    // ===== 打字机 =====
                    {
                        opcode: 'typewriterModal',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'typewriterModal'}),
                        arguments: {
                            TITLE: { type: ArgumentType.STRING, defaultValue: translate({id: 'typewriterModal.TITLE_default'}) },
                            CONTENT: { type: ArgumentType.STRING, defaultValue: translate({id: 'typewriterModal.CONTENT_default'}) },
                            SPEED: { type: ArgumentType.NUMBER, defaultValue: 60 }
                        }
                    },
                    {
                        opcode: 'closeTypewriter',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'closeTypewriter'})
                    },
                    '---',
                    // ===== 进度条 =====
                    {
                        opcode: 'progressModal',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'progressModal'}),
                        arguments: {
                            TITLE: { type: ArgumentType.STRING, defaultValue: translate({id: 'progressModal.TITLE_default'}) },
                            CONTENT: { type: ArgumentType.STRING, defaultValue: translate({id: 'progressModal.CONTENT_default'}) }
                        }
                    },
                    {
                        opcode: 'updateProgress',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'updateProgress'}),
                        arguments: {
                            PERCENT: { type: ArgumentType.NUMBER, defaultValue: 50 }
                        }
                    },
                    {
                        opcode: 'closeProgressModal',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'closeProgressModal'})
                    },
                    '---',
                    // ===== 圆环进度 =====
                    {
                        opcode: 'circularProgressModal',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'circularProgressModal'}),
                        arguments: {
                            TITLE: { type: ArgumentType.STRING, defaultValue: translate({id: 'progressModal.TITLE_default'}) },
                            CONTENT: { type: ArgumentType.STRING, defaultValue: translate({id: 'progressModal.CONTENT_default'}) },
                            SIZE: { type: ArgumentType.NUMBER, defaultValue: 120 }
                        }
                    },
                    {
                        opcode: 'updateCircularProgress',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'updateCircularProgress'}),
                        arguments: {
                            PERCENT: { type: ArgumentType.NUMBER, defaultValue: 50 }
                        }
                    },
                    {
                        opcode: 'closeCircularProgressModal',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'closeCircularProgressModal'})
                    },
                    '---',
                    // ===== Loading Spinner =====
                    {
                        opcode: 'showSpinner',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'showSpinner'}),
                        arguments: {
                            TEXT: { type: ArgumentType.STRING, defaultValue: translate({id: 'spinner.TEXT_default'}) },
                            STYLE: { type: ArgumentType.STRING, menu: 'spinnerStyleMenu', defaultValue: 'ring' }
                        }
                    },
                    {
                        opcode: 'closeSpinner',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'closeSpinner'})
                    },
                    '---',
                    // ===== Stepper =====
                    {
                        opcode: 'showStepper',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'showStepper'}),
                        arguments: {
                            TITLE: { type: ArgumentType.STRING, defaultValue: translate({id: 'stepper.TITLE_default'}) },
                            STEPS: { type: ArgumentType.STRING, defaultValue: translate({id: 'stepper.STEPS_default'}) },
                            CURRENT: { type: ArgumentType.NUMBER, defaultValue: 0 },
                            SEPARATOR: { type: ArgumentType.STRING, menu: 'separatorMenu', defaultValue: 'comma' }
                        }
                    },
                    {
                        opcode: 'updateStepper',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'updateStepper'}),
                        arguments: {
                            STEP: { type: ArgumentType.NUMBER, defaultValue: 1 }
                        }
                    },
                    {
                        opcode: 'closeStepper',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'closeStepper'})
                    },
                    '---',
                    // ===== Countdown =====
                    {
                        opcode: 'showCountdown',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'showCountdown'}),
                        arguments: {
                            SECONDS: { type: ArgumentType.NUMBER, defaultValue: 10 },
                            TITLE: { type: ArgumentType.STRING, defaultValue: translate({id: 'countdown.TITLE_default'}) },
                            FINISH: { type: ArgumentType.STRING, defaultValue: translate({id: 'countdown.FINISH_default'}) }
                        }
                    },
                    {
                        opcode: 'closeCountdown',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'closeCountdown'})
                    },
                    '---',
                    // ===== 底部抽屉 =====
                    {
                        opcode: 'bottomSheet',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'bottomSheet'}),
                        arguments: {
                            TITLE: { type: ArgumentType.STRING, defaultValue: translate({id: 'bottomSheet.TITLE_default'}) },
                            CONTENT: { type: ArgumentType.STRING, defaultValue: translate({id: 'bottomSheet.CONTENT_default'}) },
                            HEIGHT: { type: ArgumentType.NUMBER, defaultValue: 50 }
                        }
                    },
                    {
                        opcode: 'closeBottomSheet',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'closeBottomSheet'})
                    },
                    '---',
                    // ===== 侧边面板 =====
                    {
                        opcode: 'slidePanel',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'slidePanel'}),
                        arguments: {
                            SIDE: { type: ArgumentType.STRING, menu: 'sideMenu', defaultValue: 'right' },
                            TITLE: { type: ArgumentType.STRING, defaultValue: translate({id: 'slidePanel.TITLE_default'}) },
                            CONTENT: { type: ArgumentType.STRING, defaultValue: translate({id: 'slidePanel.CONTENT_default'}) },
                            WIDTH: { type: ArgumentType.NUMBER, defaultValue: 30 }
                        }
                    },
                    {
                        opcode: 'closeSlidePanel',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'closeSlidePanel'})
                    },
                    '---',
                    // ===== Floating Badge =====
                    {
                        opcode: 'showBadge',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'showBadge'}),
                        arguments: {
                            TEXT: { type: ArgumentType.STRING, defaultValue: translate({id: 'badge.TEXT_default'}) },
                            POSITION: { type: ArgumentType.STRING, menu: 'positionMenu6', defaultValue: 'top-right' },
                            COLOR: { type: ArgumentType.COLOR, defaultValue: '#6366f1' }
                        }
                    },
                    {
                        opcode: 'clearBadges',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'clearBadges'})
                    },
                    '---',
                    // ===== Tooltip =====
                    {
                        opcode: 'showTooltip',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'showTooltip'}),
                        arguments: {
                            TEXT: { type: ArgumentType.STRING, defaultValue: translate({id: 'tooltip.TEXT_default'}) },
                            POSITION: { type: ArgumentType.STRING, menu: 'positionMenu6', defaultValue: 'top-center' },
                            DURATION: { type: ArgumentType.NUMBER, defaultValue: 3 }
                        }
                    },
                    {
                        opcode: 'clearTooltips',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'clearTooltips'})
                    },
                    '---',
                    // ===== Skeleton =====
                    {
                        opcode: 'showSkeleton',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'showSkeleton'}),
                        arguments: {
                            ROWS: { type: ArgumentType.NUMBER, defaultValue: 5 },
                            DURATION: { type: ArgumentType.NUMBER, defaultValue: 3 }
                        }
                    },
                    {
                        opcode: 'closeSkeleton',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'closeSkeleton'})
                    },
                    '---',
                    // ===== Image Lightbox =====
                    {
                        opcode: 'imageLightbox',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'imageLightbox'}),
                        arguments: {
                            URL: { type: ArgumentType.STRING, defaultValue: 'https://picsum.photos/800/600' },
                            TITLE: { type: ArgumentType.STRING, defaultValue: translate({id: 'imageLightbox.TITLE_default'}) }
                        }
                    },
                    '---',
                    // ===== Confetti =====
                    {
                        opcode: 'confetti',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'confetti'}),
                        arguments: {
                            COUNT: { type: ArgumentType.NUMBER, defaultValue: 80 },
                            DURATION: { type: ArgumentType.NUMBER, defaultValue: 3 }
                        }
                    },
                    '---',
                    // ===== Number Counter =====
                    {
                        opcode: 'numberCounter',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'numberCounter'}),
                        arguments: {
                            FROM: { type: ArgumentType.NUMBER, defaultValue: 0 },
                            TO: { type: ArgumentType.NUMBER, defaultValue: 100 },
                            DURATION: { type: ArgumentType.NUMBER, defaultValue: 2 }
                        }
                    },
                    '---',
                    // ===== Ripple =====
                    {
                        opcode: 'rippleAt',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'rippleAt'}),
                        arguments: {
                            POSITION: { type: ArgumentType.STRING, menu: 'positionMenu6', defaultValue: 'top-center' },
                            COLOR: { type: ArgumentType.COLOR, defaultValue: '#6366f1' }
                        }
                    },
                    '---',
                    // ===== 主题 =====
                    {
                        opcode: 'setTheme',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'setTheme'}),
                        arguments: {
                            THEME: { type: ArgumentType.STRING, menu: 'themeMenu', defaultValue: 'light' },
                            COLOR: { type: ArgumentType.COLOR, defaultValue: '#6366f1' }
                        }
                    },
                    {
                        opcode: 'getTheme',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'getTheme'})
                    },
                    '---',
                    // ===== 动画风格 =====
                    {
                        opcode: 'setAnimStyle',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'setAnimStyle'}),
                        arguments: {
                            STYLE: { type: ArgumentType.STRING, menu: 'animStyleMenu', defaultValue: 'spring' }
                        }
                    },
                    {
                        opcode: 'getAnimStyle',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'getAnimStyle'})
                    }
                ],
                menus: {
                    toastTypeMenu: {
                        acceptReporters: false,
                        items: [
                            { text: translate({id: 'typeSuccess'}), value: 'success' },
                            { text: translate({id: 'typeWarning'}), value: 'warning' },
                            { text: translate({id: 'typeError'}), value: 'error' },
                            { text: translate({id: 'typeInfo'}), value: 'info' }
                        ]
                    },
                    iconMenu: {
                        acceptReporters: true,
                        items: [
                            { text: translate({id: 'iconInfo'}), value: 'info' },
                            { text: translate({id: 'iconSuccess'}), value: 'success' },
                            { text: translate({id: 'iconWarning'}), value: 'warning' },
                            { text: translate({id: 'iconError'}), value: 'error' },
                            { text: translate({id: 'iconNone'}), value: 'none' }
                        ]
                    },
                    positionMenu: {
                        acceptReporters: false,
                        items: [
                            { text: translate({id: 'posTopLeft'}), value: 'top-left' },
                            { text: translate({id: 'posTopRight'}), value: 'top-right' },
                            { text: translate({id: 'posBottomLeft'}), value: 'bottom-left' },
                            { text: translate({id: 'posBottomRight'}), value: 'bottom-right' }
                        ]
                    },
                    positionMenu6: {
                        acceptReporters: false,
                        items: [
                            { text: translate({id: 'posTopLeft'}), value: 'top-left' },
                            { text: translate({id: 'posTopRight'}), value: 'top-right' },
                            { text: translate({id: 'posTopCenter'}), value: 'top-center' },
                            { text: translate({id: 'posBottomLeft'}), value: 'bottom-left' },
                            { text: translate({id: 'posBottomRight'}), value: 'bottom-right' },
                            { text: translate({id: 'posBottomCenter'}), value: 'bottom-center' }
                        ]
                    },
                    layoutMenu: {
                        acceptReporters: false,
                        items: [
                            { text: translate({id: 'layoutList'}), value: 'list' },
                            { text: translate({id: 'layoutGrid'}), value: 'grid' }
                        ]
                    },
                    separatorMenu: {
                        acceptReporters: false,
                        items: [
                            { text: translate({id: 'sepComma'}), value: 'comma' },
                            { text: translate({id: 'sepSpace'}), value: 'space' },
                            { text: translate({id: 'sepSlash'}), value: 'slash' },
                            { text: translate({id: 'sepNewline'}), value: 'newline' }
                        ]
                    },
                    themeMenu: {
                        acceptReporters: false,
                        items: [
                            { text: translate({id: 'themeLight'}), value: 'light' },
                            { text: translate({id: 'themeDark'}), value: 'dark' },
                            { text: translate({id: 'themeGlass'}), value: 'glass' },
                            { text: translate({id: 'themeFrosted'}), value: 'frosted' },
                            { text: translate({id: 'themeCyberpunk'}), value: 'cyberpunk' },
                            { text: translate({id: 'themeSunset'}), value: 'sunset' },
                            { text: translate({id: 'themeForest'}), value: 'forest' },
                            { text: translate({id: 'themeOcean'}), value: 'ocean' },
                            { text: translate({id: 'themeNeon'}), value: 'neon' },
                            { text: translate({id: 'themeRose'}), value: 'rose' }
                        ]
                    },
                    animStyleMenu: {
                        acceptReporters: false,
                        items: [
                            { text: translate({id: 'animSpring'}), value: 'spring' },
                            { text: translate({id: 'animSmooth'}), value: 'smooth' },
                            { text: translate({id: 'animBounce'}), value: 'bounce' },
                            { text: translate({id: 'animFade'}), value: 'fade' },
                            { text: translate({id: 'animSlide'}), value: 'slide' },
                            { text: translate({id: 'animZoom'}), value: 'zoom' },
                            { text: translate({id: 'animFlip'}), value: 'flip' }
                        ]
                    },
                    soundMenu: {
                        acceptReporters: false,
                        items: [
                            { text: translate({id: 'soundSuccess'}), value: 'success' },
                            { text: translate({id: 'soundError'}), value: 'error' },
                            { text: translate({id: 'soundWarning'}), value: 'warning' },
                            { text: translate({id: 'soundInfo'}), value: 'info' },
                            { text: translate({id: 'soundClick'}), value: 'click' },
                            { text: translate({id: 'soundPop'}), value: 'pop' },
                            { text: translate({id: 'soundChime'}), value: 'chime' }
                        ]
                    },
                    spinnerStyleMenu: {
                        acceptReporters: false,
                        items: [
                            { text: translate({id: 'spinnerRing'}), value: 'ring' },
                            { text: translate({id: 'spinnerDots'}), value: 'dots' },
                            { text: translate({id: 'spinnerPulse'}), value: 'pulse' },
                            { text: translate({id: 'spinnerWave'}), value: 'wave' }
                        ]
                    },
                    sideMenu: {
                        acceptReporters: false,
                        items: [
                            { text: translate({id: 'sideLeft'}), value: 'left' },
                            { text: translate({id: 'sideRight'}), value: 'right' }
                        ]
                    }
                }
            };
        }

        // ============================
        // 积木实现
        // ============================

        // --- Toast ---
        toastWithType(args) {
            const type = Cast.toString(args.TYPE || 'info');
            const text = Cast.toString(args.TEXT || '');
            const icon = Cast.toString(args.ICON || 'none');
            const duration = Math.max(1, Math.min(30, Cast.toNumber(args.DURATION || 3)));
            if (!text) return;
            this._showToast(type, text, icon, duration);
        }

        clearToasts() {
            const toastsCopy = [...this._toasts];
            toastsCopy.forEach(t => this._removeToast(t));
        }

        // --- Snackbar ---
        snackbar(args) {
            const text = Cast.toString(args.TEXT || '');
            const action = Cast.toString(args.ACTION || '');
            const duration = Math.max(1, Math.min(30, Cast.toNumber(args.DURATION || 4)));
            if (!text) return;
            this._showSnackbar(text, action, duration);
        }

        // --- 模态弹窗 ---
        modalAlert(args) {
            const title = Cast.toString(args.TITLE || translate({id: 'modal.TITLE_default'}));
            const content = Cast.toString(args.CONTENT || '');
            const icon = Cast.toString(args.ICON || 'info');

            const overlay = this._createOverlay(true);
            const card = this._createCard(icon !== 'none' ? icon : 'info');
            const body = document.createElement('div');
            body.className = 'glassui-card-body';

            const iconEl = this._createIconElement(icon);
            if (iconEl) body.appendChild(iconEl);

            const titleEl = document.createElement('div');
            titleEl.className = 'glassui-title';
            titleEl.textContent = title;

            const contentEl = document.createElement('div');
            contentEl.className = 'glassui-content';
            contentEl.textContent = content;

            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'glassui-buttons';
            buttonsDiv.appendChild(this._createButton(
                this._isZh() ? '确定' : 'OK',
                'glassui-btn-primary',
                () => this._closeOverlay(overlay)
            ));

            body.appendChild(titleEl);
            body.appendChild(contentEl);
            body.appendChild(buttonsDiv);
            card.appendChild(body);
            overlay.appendChild(card);
        }

        modalConfirm(args) {
            const title = Cast.toString(args.TITLE || translate({id: 'modal.TITLE_default'}));
            const content = Cast.toString(args.CONTENT || '');
            const okText = Cast.toString(args.OK_TEXT || translate({id: 'modal.OK_default'}));
            const cancelText = Cast.toString(args.CANCEL_TEXT || translate({id: 'modal.CANCEL_default'}));

            return new Promise((resolve) => {
                let resolved = false;
                const safeResolve = (val) => {
                    if (resolved) return;
                    resolved = true;
                    resolve(val);
                };

                const overlay = this._createOverlay(true);
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        this._closeOverlay(overlay);
                        safeResolve(false);
                    }
                });

                const card = this._createCard('info');
                const body = document.createElement('div');
                body.className = 'glassui-card-body';

                const iconEl = this._createIconElement('info');
                if (iconEl) body.appendChild(iconEl);

                const titleEl = document.createElement('div');
                titleEl.className = 'glassui-title';
                titleEl.textContent = title;

                const contentEl = document.createElement('div');
                contentEl.className = 'glassui-content';
                contentEl.textContent = content;

                const buttonsDiv = document.createElement('div');
                buttonsDiv.className = 'glassui-buttons';

                buttonsDiv.appendChild(this._createButton(cancelText, 'glassui-btn-secondary', () => {
                    this._closeOverlay(overlay);
                    safeResolve(false);
                }));
                buttonsDiv.appendChild(this._createButton(okText, 'glassui-btn-primary', () => {
                    this._closeOverlay(overlay);
                    safeResolve(true);
                }));

                body.appendChild(titleEl);
                body.appendChild(contentEl);
                body.appendChild(buttonsDiv);
                card.appendChild(body);
                overlay.appendChild(card);

                const keyHandler = (e) => {
                    if (e.key === 'Enter') {
                        document.removeEventListener('keydown', keyHandler);
                        this._closeOverlay(overlay);
                        safeResolve(true);
                    } else if (e.key === 'Escape') {
                        document.removeEventListener('keydown', keyHandler);
                        this._closeOverlay(overlay);
                        safeResolve(false);
                    }
                };
                document.addEventListener('keydown', keyHandler);
            });
        }

        modalPrompt(args) {
            const title = Cast.toString(args.TITLE || translate({id: 'modalPrompt.TITLE_default'}));
            const placeholder = Cast.toString(args.PLACEHOLDER || '');
            const defaultVal = Cast.toString(args.DEFAULT || '');

            return new Promise((resolve) => {
                let resolved = false;
                const safeResolve = (val) => {
                    if (resolved) return;
                    resolved = true;
                    resolve(val);
                };

                const overlay = this._createOverlay(true);
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        this._closeOverlay(overlay);
                        safeResolve('');
                    }
                });

                const card = this._createCard('info');
                const body = document.createElement('div');
                body.className = 'glassui-card-body';

                const iconEl = this._createIconElement('info');
                if (iconEl) body.appendChild(iconEl);

                const titleEl = document.createElement('div');
                titleEl.className = 'glassui-title';
                titleEl.textContent = title;

                const inputWrap = document.createElement('div');
                inputWrap.className = 'glassui-input-wrap';
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'glassui-input';
                input.placeholder = placeholder;
                input.value = defaultVal;
                inputWrap.appendChild(input);

                const buttonsDiv = document.createElement('div');
                buttonsDiv.className = 'glassui-buttons';

                const cancelBtn = this._createButton(
                    this._isZh() ? '取消' : 'Cancel',
                    'glassui-btn-secondary',
                    () => { this._closeOverlay(overlay); safeResolve(''); }
                );
                const okBtn = this._createButton(
                    this._isZh() ? '确定' : 'OK',
                    'glassui-btn-primary',
                    () => { this._closeOverlay(overlay); safeResolve(input.value); }
                );

                buttonsDiv.appendChild(cancelBtn);
                buttonsDiv.appendChild(okBtn);

                body.appendChild(titleEl);
                body.appendChild(inputWrap);
                body.appendChild(buttonsDiv);
                card.appendChild(body);
                overlay.appendChild(card);

                setTimeout(() => { input.focus(); input.select(); }, 100);

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this._closeOverlay(overlay);
                        safeResolve(input.value);
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        this._closeOverlay(overlay);
                        safeResolve('');
                    }
                });
            });
        }

        // --- 角落通知 ---
        cornerNotify(args) {
            const position = Cast.toString(args.POSITION || 'top-right');
            const title = Cast.toString(args.TITLE || translate({id: 'cornerNotify.TITLE_default'}));
            const content = Cast.toString(args.CONTENT || '');
            const duration = Math.max(1, Math.min(60, Cast.toNumber(args.DURATION || 4)));
            this._showCornerNotify(position, title, content, duration);
        }

        clearCornerNotifys() {
            Object.values(this._cornerContainers).forEach(container => {
                if (container && container.parentNode) {
                    const items = [...container.children];
                    items.forEach(item => {
                        item.classList.add('removing');
                        const handler = () => { if (item.parentNode) item.parentNode.removeChild(item); };
                        item.addEventListener('animationend', handler, {once: true});
                        const fallback = setTimeout(handler, 400);
                        this._timers.push(fallback);
                    });
                }
            });
        }

        // --- 通知音效 ---
        playSound(args) {
            const type = Cast.toString(args.TYPE || 'info');
            playNotificationSound(type);
        }

        // --- 选择弹窗 ---
        selectionModal(args) {
            const title = Cast.toString(args.TITLE || translate({id: 'selectionModal.TITLE_default'}));
            const optionsStr = Cast.toString(args.OPTIONS || '');
            const layout = Cast.toString(args.LAYOUT || 'list');
            const sepKey = Cast.toString(args.SEPARATOR || 'comma');
            const separator = getSeparatorValue(sepKey);

            const options = optionsStr.split(separator).map(s => s.trim()).filter(s => s !== '');

            return new Promise((resolve) => {
                let resolved = false;
                const safeResolve = (val) => {
                    if (resolved) return;
                    resolved = true;
                    resolve(val);
                };

                if (options.length === 0) {
                    safeResolve('');
                    return;
                }

                let selectedValue = '';

                const overlay = this._createOverlay(true);
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        this._closeOverlay(overlay);
                        safeResolve('');
                    }
                });

                const card = this._createCard('info');
                card.style.maxWidth = layout === 'grid' ? '480px' : '420px';
                const body = document.createElement('div');
                body.className = 'glassui-card-body';

                const titleEl = document.createElement('div');
                titleEl.className = 'glassui-title left-align';
                titleEl.textContent = title;
                body.appendChild(titleEl);

                if (layout === 'grid') {
                    const grid = document.createElement('div');
                    grid.className = 'glassui-select-grid';
                    options.forEach(opt => {
                        const item = document.createElement('div');
                        item.className = 'glassui-select-grid-item';
                        item.textContent = opt;
                        item.addEventListener('click', () => {
                            grid.querySelectorAll('.glassui-select-grid-item').forEach(el => el.classList.remove('selected'));
                            item.classList.add('selected');
                            selectedValue = opt;
                        });
                        item.addEventListener('dblclick', () => {
                            selectedValue = opt;
                            this._closeOverlay(overlay);
                            safeResolve(opt);
                        });
                        grid.appendChild(item);
                    });
                    body.appendChild(grid);
                } else {
                    const list = document.createElement('div');
                    list.className = 'glassui-select-list';
                    options.forEach(opt => {
                        const item = document.createElement('div');
                        item.className = 'glassui-select-item';
                        item.textContent = opt;
                        item.addEventListener('click', () => {
                            list.querySelectorAll('.glassui-select-item').forEach(el => el.classList.remove('selected'));
                            item.classList.add('selected');
                            selectedValue = opt;
                        });
                        item.addEventListener('dblclick', () => {
                            selectedValue = opt;
                            this._closeOverlay(overlay);
                            safeResolve(opt);
                        });
                        list.appendChild(item);
                    });
                    body.appendChild(list);
                }

                const buttonsDiv = document.createElement('div');
                buttonsDiv.className = 'glassui-buttons';
                buttonsDiv.appendChild(this._createButton(
                    this._isZh() ? '取消' : 'Cancel',
                    'glassui-btn-secondary',
                    () => { this._closeOverlay(overlay); safeResolve(''); }
                ));
                buttonsDiv.appendChild(this._createButton(
                    this._isZh() ? '确认选择' : 'Confirm',
                    'glassui-btn-primary',
                    () => { this._closeOverlay(overlay); safeResolve(selectedValue); }
                ));

                body.appendChild(buttonsDiv);
                card.appendChild(body);
                overlay.appendChild(card);
            });
        }

        // --- 星级评分 ---
        starRating(args) {
            const title = Cast.toString(args.TITLE || translate({id: 'starRating.TITLE_default'}));
            const defaultStars = Math.max(0, Math.min(10, Cast.toNumber(args.DEFAULT || 0)));
            const maxStars = Math.max(1, Math.min(10, Cast.toNumber(args.MAX || 5)));

            return new Promise((resolve) => {
                let resolved = false;
                const safeResolve = (val) => {
                    if (resolved) return;
                    resolved = true;
                    resolve(val);
                };

                let currentRating = defaultStars;

                const overlay = this._createOverlay(true);
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        this._closeOverlay(overlay);
                        safeResolve(0);
                    }
                });

                const card = this._createCard('info');
                const body = document.createElement('div');
                body.className = 'glassui-card-body';

                const titleEl = document.createElement('div');
                titleEl.className = 'glassui-title';
                titleEl.textContent = title;

                const labelEl = document.createElement('div');
                labelEl.className = 'glassui-star-label';
                labelEl.textContent = currentRating > 0 ? `${currentRating} / ${maxStars}` : (this._isZh() ? '点击星星评分' : 'Click to rate');

                const starsEl = document.createElement('div');
                starsEl.className = 'glassui-stars';

                const starSvg = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;

                const starEls = [];
                for (let i = 1; i <= maxStars; i++) {
                    const star = document.createElement('div');
                    star.className = 'glassui-star';
                    if (i <= currentRating) star.classList.add('active');
                    star.innerHTML = starSvg;

                    star.addEventListener('click', () => {
                        currentRating = i;
                        starEls.forEach((s, idx) => {
                            s.classList.toggle('active', idx < i);
                        });
                        labelEl.textContent = `${i} / ${maxStars}`;
                    });

                    star.addEventListener('mouseenter', () => {
                        starEls.forEach((s, idx) => {
                            s.style.opacity = idx < i ? '1' : '0.4';
                        });
                    });
                    star.addEventListener('mouseleave', () => {
                        starEls.forEach(s => { s.style.opacity = '1'; });
                    });

                    starsEl.appendChild(star);
                    starEls.push(star);
                }

                body.appendChild(titleEl);
                body.appendChild(labelEl);
                body.appendChild(starsEl);

                const buttonsDiv = document.createElement('div');
                buttonsDiv.className = 'glassui-buttons';
                buttonsDiv.appendChild(this._createButton(
                    this._isZh() ? '取消' : 'Cancel',
                    'glassui-btn-secondary',
                    () => { this._closeOverlay(overlay); safeResolve(0); }
                ));
                buttonsDiv.appendChild(this._createButton(
                    this._isZh() ? '确认' : 'Confirm',
                    'glassui-btn-primary',
                    () => { this._closeOverlay(overlay); safeResolve(currentRating); }
                ));
                body.appendChild(buttonsDiv);

                card.appendChild(body);
                overlay.appendChild(card);
            });
        }

        // --- Tab Panel ---
        tabPanel(args) {
            const title = Cast.toString(args.TITLE || translate({id: 'tabPanel.TITLE_default'}));
            const sepKey = Cast.toString(args.SEPARATOR || 'comma');
            const separator = getSeparatorValue(sepKey);
            const tabs = Cast.toString(args.TABS || '').split(separator).map(s => s.trim()).filter(s => s);
            const contents = Cast.toString(args.CONTENTS || '').split(separator).map(s => s.trim());
            if (tabs.length === 0) return;
            this._showTabPanel(title, tabs, contents);
        }

        // --- 打字机 ---
        typewriterModal(args) {
            const title = Cast.toString(args.TITLE || translate({id: 'typewriterModal.TITLE_default'}));
            const content = Cast.toString(args.CONTENT || '');
            const speed = Math.max(10, Math.min(500, Cast.toNumber(args.SPEED || 60)));
            this._showTypewriter(title, content, speed);
        }

        closeTypewriter() {
            this._closeTypewriter();
            if (this._typewriterOverlay) {
                this._closeOverlay(this._typewriterOverlay);
            }
        }

        // --- 进度弹窗 ---
        progressModal(args) {
            const title = Cast.toString(args.TITLE || translate({id: 'progressModal.TITLE_default'}));
            const content = Cast.toString(args.CONTENT || translate({id: 'progressModal.CONTENT_default'}));
            this._showProgressModal(title, content);
        }

        updateProgress(args) {
            const percent = Cast.toNumber(args.PERCENT || 0);
            this._updateProgress(percent);
        }

        closeProgressModal() {
            this._closeProgressModal();
        }

        // --- 圆环进度 ---
        circularProgressModal(args) {
            const title = Cast.toString(args.TITLE || translate({id: 'progressModal.TITLE_default'}));
            const content = Cast.toString(args.CONTENT || translate({id: 'progressModal.CONTENT_default'}));
            const size = Math.max(60, Math.min(250, Cast.toNumber(args.SIZE || 120)));
            this._showCircularProgressModal(title, content, size);
        }

        updateCircularProgress(args) {
            const percent = Cast.toNumber(args.PERCENT || 0);
            this._updateCircularProgress(percent);
        }

        closeCircularProgressModal() {
            this._closeCircularProgressModal();
        }

        // --- Loading Spinner ---
        showSpinner(args) {
            const text = Cast.toString(args.TEXT || '');
            const spinnerStyle = Cast.toString(args.STYLE || 'ring');
            this._showSpinner(text, spinnerStyle);
        }

        closeSpinner() {
            this._closeSpinner();
        }

        // --- Stepper ---
        showStepper(args) {
            const title = Cast.toString(args.TITLE || translate({id: 'stepper.TITLE_default'}));
            const sepKey = Cast.toString(args.SEPARATOR || 'comma');
            const separator = getSeparatorValue(sepKey);
            const steps = Cast.toString(args.STEPS || '').split(separator).map(s => s.trim()).filter(s => s);
            const current = Math.max(0, Cast.toNumber(args.CURRENT || 0));
            if (steps.length === 0) return;
            this._showStepper(title, steps, current);
        }

        updateStepper(args) {
            const step = Math.max(0, Cast.toNumber(args.STEP || 0));
            this._updateStepper(step);
        }

        closeStepper() {
            this._closeStepper();
        }

        // --- Countdown ---
        showCountdown(args) {
            const seconds = Math.max(1, Math.min(3600, Cast.toNumber(args.SECONDS || 10)));
            const title = Cast.toString(args.TITLE || translate({id: 'countdown.TITLE_default'}));
            const finish = Cast.toString(args.FINISH || translate({id: 'countdown.FINISH_default'}));
            this._showCountdown(seconds, title, finish);
        }

        closeCountdown() {
            this._closeCountdown();
        }

        // --- 底部抽屉 ---
        bottomSheet(args) {
            const title = Cast.toString(args.TITLE || translate({id: 'bottomSheet.TITLE_default'}));
            const content = Cast.toString(args.CONTENT || '');
            const height = Math.max(20, Math.min(90, Cast.toNumber(args.HEIGHT || 50)));
            this._showBottomSheet(title, content, height);
        }

        closeBottomSheet() {
            this._closeBottomSheet();
        }

        // --- 侧边面板 ---
        slidePanel(args) {
            const side = Cast.toString(args.SIDE || 'right');
            const title = Cast.toString(args.TITLE || translate({id: 'slidePanel.TITLE_default'}));
            const content = Cast.toString(args.CONTENT || '');
            const width = Math.max(15, Math.min(80, Cast.toNumber(args.WIDTH || 30)));
            this._showSlidePanel(side, title, content, width);
        }

        closeSlidePanel() {
            this._closeSlidePanel();
        }

        // --- Floating Badge ---
        showBadge(args) {
            const text = Cast.toString(args.TEXT || translate({id: 'badge.TEXT_default'}));
            const position = Cast.toString(args.POSITION || 'top-right');
            const color = Cast.toString(args.COLOR || '');
            this._showBadge(text, position, color || undefined);
        }

        clearBadges() {
            this._clearBadges();
        }

        // --- Tooltip ---
        showTooltip(args) {
            const text = Cast.toString(args.TEXT || translate({id: 'tooltip.TEXT_default'}));
            const position = Cast.toString(args.POSITION || 'top-center');
            const duration = Math.max(1, Math.min(30, Cast.toNumber(args.DURATION || 3)));
            this._showTooltip(text, position, duration);
        }

        clearTooltips() {
            this._clearTooltips();
        }

        // --- Skeleton ---
        showSkeleton(args) {
            const rows = Math.max(1, Math.min(10, Cast.toNumber(args.ROWS || 5)));
            const duration = Math.max(0, Math.min(60, Cast.toNumber(args.DURATION || 3)));
            this._showSkeleton(rows, duration);
        }

        closeSkeleton() {
            this._closeSkeleton();
        }

        // --- Image Lightbox ---
        imageLightbox(args) {
            const url = Cast.toString(args.URL || '');
            const title = Cast.toString(args.TITLE || translate({id: 'imageLightbox.TITLE_default'}));
            if (!url) return;
            this._showImageLightbox(url, title);
        }

        // --- Confetti ---
        confetti(args) {
            const count = Math.max(10, Math.min(200, Cast.toNumber(args.COUNT || 80)));
            const duration = Math.max(1, Math.min(10, Cast.toNumber(args.DURATION || 3)));
            this._showConfetti(count, duration);
        }

        // --- Number Counter ---
        numberCounter(args) {
            const from = Cast.toNumber(args.FROM || 0);
            const to = Cast.toNumber(args.TO || 100);
            const duration = Math.max(0.5, Math.min(30, Cast.toNumber(args.DURATION || 2)));
            return this._showNumberCounter(from, to, duration);
        }

        // --- Ripple ---
        rippleAt(args) {
            const position = Cast.toString(args.POSITION || 'top-center');
            const color = Cast.toString(args.COLOR || '');
            this._showRipple(position, color || undefined);
        }

        // --- 主题 ---
        setTheme(args) {
            const theme = Cast.toString(args.THEME || 'light');
            const color = Cast.toString(args.COLOR || '');
            this._applyTheme(theme, color || undefined);
        }

        getTheme() {
            return this._currentTheme;
        }

        // --- 动画风格 ---
        setAnimStyle(args) {
            const style = Cast.toString(args.STYLE || 'spring');
            this._applyAnimStyle(style);
        }

        getAnimStyle() {
            return this._currentAnimStyle;
        }
    }

    extensions.register(new GlassUI2(runtime));
}(Scratch));