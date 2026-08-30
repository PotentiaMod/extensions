document.getElementById('cdmodal-styles')?.remove();
const style = document.createElement('style');
style.id = 'cdmodal-styles';
style.textContent = `:root {
    --cdmodal-primary: #6366f1;
    --cdmodal-primary-hover: #4f46e5;
    --cdmodal-overlay-bg: rgba(0, 0, 0, 0.4);
    --cdmodal-overlay-blur: 0.5rem;
    --cdmodal-modal-bg: rgba(255, 255, 255, 0.95);
    --cdmodal-modal-border: rgba(255, 255, 255, 0.3);
    --cdmodal-border-radius: 1.75rem;
    --cdmodal-title-color: #1e293b;
    --cdmodal-content-color: #475569;
    --cdmodal-input-bg: rgba(255, 255, 255, 0.9);
    --cdmodal-input-border: #e2e8f0;
    --cdmodal-input-text: #1e293b;
    --cdmodal-cancel-bg: rgba(255, 255, 255, 0.6);
    --cdmodal-cancel-border: #e2e8f0;
    --cdmodal-cancel-text: #64748b;
    --cdmodal-cancel-hover-bg: #f8fafc;
    --cdmodal-snackbar-bg: #f1f5f9;
    --cdmodal-snackbar-text: #1e293b;
    --cdmodal-snackbar-close-bg: rgba(0, 0, 0, 0.08);
    --cdmodal-snackbar-close-hover: rgba(0, 0, 0, 0.15);
    --cdmodal-user-select: none;
    --cdmodal-arrow-filter: invert(1);
    --cdmodal-settings-item-hover: rgb(0, 0, 0, .1);
}

:root[data-cdmodal-theme="dark"] {
    --cdmodal-modal-bg: rgba(30, 41, 59, 0.95);
    --cdmodal-modal-border: rgba(255, 255, 255, 0.1);
    --cdmodal-title-color: #f1f5f9;
    --cdmodal-content-color: #cbd5e1;
    --cdmodal-input-bg: rgba(51, 65, 85, 0.9);
    --cdmodal-input-border: #475569;
    --cdmodal-input-text: #f1f5f9;
    --cdmodal-cancel-bg: rgba(51, 65, 85, 0.6);
    --cdmodal-cancel-border: #475569;
    --cdmodal-cancel-text: #cbd5e1;
    --cdmodal-cancel-hover-bg: #475569;
    --cdmodal-snackbar-bg: #1e293b;
    --cdmodal-snackbar-text: #f1f5f9;
    --cdmodal-snackbar-close-bg: rgba(255, 255, 255, 0.15);
    --cdmodal-snackbar-close-hover: rgba(255, 255, 255, 0.25);
    --cdmodal-arrow-filter: none;
    --cdmodal-settings-item-hover: rgb(255, 255, 255, .1);
}

.cdmodal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    font-family: 'PingFang', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background-color: var(--cdmodal-overlay-bg);
    backdrop-filter: blur(var(--cdmodal-overlay-blur));
    animation: cdmodal-fade-in 0.2s ease
}

.cdmodal-container {
    width: 22.5rem;
    max-width: 85%;
    padding: 1.5rem 1.375rem;
    text-align: center;
    background: var(--cdmodal-modal-bg);
    backdrop-filter: blur(1.25rem);
    border-radius: var(--cdmodal-border-radius);
    box-shadow: 0 1.5625rem 2.8125rem-0.75rem rgba(0, 0, 0, 0.35), 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
    border: 0.0625rem solid var(--cdmodal-modal-border);
    animation: cdmodal-container-in 0.25s cubic-bezier(0.21, 1.11, 0.35, 1);
    white-space: break-spaces;
    word-break: break-all;
    -webkit-tap-highlight-color: transparent;
    user-select: var(--cdmodal-user-select);
}

.cdmodal-title {
    margin: 0 0 0.625rem 0;
    font-size: 1.35rem;
    font-weight: 600;
    letter-spacing: -0.01875rem;
    color: var(--cdmodal-title-color)
}

.cdmodal-content {
    margin-bottom: 1.5rem;
    line-height: 1.45;
    font-size: 0.9rem;
    padding: 0 0.25rem;
    color: var(--cdmodal-content-color)
}

.cdmodal-input {
    width: 92%;
    padding: 0.625rem 0.75rem;
    margin-bottom: 1.375rem;
    border-radius: 0.875rem;
    font-size: 0.8125rem;
    transition: all 0.2s ease;
    outline: none;
    font-family: inherit;
    box-sizing: border-box;
    background: var(--cdmodal-input-bg);
    border: 0.09375rem solid var(--cdmodal-input-border);
    color: var(--cdmodal-input-text)
}

.cdmodal-input:focus {
    border-color: var(--cdmodal-primary);
    box-shadow: 0 0 0 0.1875rem rgba(99, 102, 241, 0.2)
}

.cdmodal-buttons {
    display: flex;
    justify-content: center;
    gap: 0.625rem;
    flex-wrap: wrap;
    margin-top: 0.375rem
}

.cdmodal-btn-primary {
    padding: 0.5rem 1.125rem;
    border: none;
    border-radius: 2.5rem;
    cursor: pointer;
    font-size: 0.8125rem;
    font-weight: 500;
    transition: all 0.2s ease;
    min-width: 4.375rem;
    background: var(--cdmodal-primary);
    color: white;
    box-shadow: 0 0.125rem 0.375rem rgba(0, 0, 0, 0.2)
}

.cdmodal-btn-primary:hover {
    transform: translateY(-0.0625rem);
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.25);
    background: var(--cdmodal-primary-hover)
}

.cdmodal-btn-secondary {
    padding: 0.5rem 1.125rem;
    border-radius: 2.5rem;
    cursor: pointer;
    font-size: 0.8125rem;
    font-weight: 500;
    transition: all 0.2s ease;
    min-width: 4.375rem;
    background: var(--cdmodal-cancel-bg);
    border: 0.0625rem solid var(--cdmodal-cancel-border);
    color: var(--cdmodal-cancel-text)
}

.cdmodal-btn-secondary:hover {
    background: var(--cdmodal-cancel-hover-bg);
    transform: translateY(-0.0625rem)
}

@keyframes cdmodal-fade-in {
    from {
        opacity: 0
    }

    to {
        opacity: 1
    }
}

@keyframes cdmodal-fade-out {
    from {
        opacity: 1
    }

    to {
        opacity: 0
    }
}

@keyframes cdmodal-container-in {
    from {
        opacity: 0;
        transform: scale(0.92)translateY(-0.5rem)
    }

    to {
        opacity: 1;
        transform: scale(1)translateY(0)
    }
}

@keyframes cdmodal-container-out {
    from {
        opacity: 1;
        transform: scale(1)translateY(0)
    }

    to {
        opacity: 0;
        transform: scale(0.92)translateY(-0.5rem)
    }
}

@keyframes cdmodal-snackbar-in {
    from {
        opacity: 0;
        transform: translateY(1.25rem)
    }

    to {
        opacity: 1;
        transform: translateY(0)
    }
}

@keyframes cdmodal-snackbar-out {
    from {
        opacity: 1;
        transform: translateY(0)
    }

    to {
        opacity: 0;
        transform: translateY(-1.25rem)
    }
}

.cdmodal-snackbar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 1rem;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    backdrop-filter: blur(0.5rem);
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.15);
    pointer-events: auto;
    max-width: 18.75rem;
    word-wrap: break-word;
    animation: cdmodal-snackbar-in 0.3s ease;
    background: var(--cdmodal-snackbar-bg);
    color: var(--cdmodal-snackbar-text);
    -webkit-tap-highlight-color: transparent;
    user-select: var(--cdmodal-user-select);
}

.cdmodal-snackbar-close {
    background: var(--cdmodal-snackbar-close-bg);
    border: none;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.75rem;
    cursor: pointer;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    color: inherit
}

.cdmodal-snackbar-close:hover {
    background: var(--cdmodal-snackbar-close-hover)
}

.cdmodal-snackbar-container {
    position: fixed;
    z-index: 10001;
    display: flex;
    gap: 0.625rem;
    pointer-events: none;
    font-family: 'PingFang'
}

.cdmodal-settings {
    display: flex;
    flex-direction: column;
    background: var(--cdmodal-modal-bg);
    border-radius: var(--cdmodal-border-radius);
    overflow: hidden;
    width: 680px;
    max-width: 92%;
    height: 480px;
    max-height: 80vh;
    box-shadow: 0 25px 45px -12px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'PingFang';
    -webkit-tap-highlight-color: transparent;
    user-select: var(--cdmodal-user-select);
}

.cdmodal-settings-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    flex-shrink: 0;
}

.cdmodal-settings-title {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--cdmodal-title-color);
}

.cdmodal-settings-close {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    color: var(--cdmodal-content-color);
    opacity: 0.6;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    transition: all 0.2s;
}

.cdmodal-settings-close:hover {
    opacity: 1;
    background: var(--cdmodal-settings-item-hover);
}

/* ===== 主体（左右布局） ===== */
.cdmodal-settings-body {
    display: flex;
    flex: 1;
    overflow: hidden;
}

/* ===== 左侧菜单 ===== */
.cdmodal-settings-left {
    width: 180px;
    min-width: 180px;
    border-right: 1px solid rgba(0, 0, 0, 0.06);
    overflow-y: auto;
    padding: 0.5rem 0;
    flex-shrink: 0;
}

.cdmodal-settings-left::-webkit-scrollbar {
    width: 3px;
}

.cdmodal-settings-left::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 3px;
}

.cdmodal-settings-menu-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1rem 0.55rem 0.75rem;
    cursor: pointer;
    transition: all 0.15s;
    border-left: 3px solid transparent;
    font-size: 0.88rem;
    color: var(--cdmodal-title-color);
    border-radius: 0 0.25rem 0.25rem 0;
}

.cdmodal-settings-menu-item:hover {
    background: var(--cdmodal-settings-item-hover);
}

.cdmodal-settings-menu-item.active {
    background: rgba(99, 102, 241, 0.1);
    border-left: 3px solid var(--cdmodal-primary);
    padding-left: 0.85rem;
}

.cdmodal-settings-menu-item .label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.cdmodal-settings-menu-item .arrow {
    font-size: 1.2rem;
    color: var(--cdmodal-content-color);
    opacity: .5;
    filter: var(--cdmodal-arrow-filter);
    zoom: .7;
    transform: rotate(-90deg);
}

.cdmodal-settings-divider {
    height: 1px;
    background: rgba(0, 0, 0, 0.06);
    margin: 0.25rem 0.75rem;
}

/* ===== 右侧详情 ===== */
.cdmodal-settings-right {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 1.25rem;
}

.cdmodal-settings-right::-webkit-scrollbar {
    width: 4px;
}

.cdmodal-settings-right::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.12);
    border-radius: 4px;
}

.cdmodal-settings-group-header {
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.cdmodal-settings-group-title {
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--cdmodal-title-color);
}

.cdmodal-settings-group-desc {
    font-size: 0.8rem;
    color: var(--cdmodal-content-color);
    opacity: 0.6;
    margin-top: 0.15rem;
}

.cdmodal-settings-empty {
    text-align: center;
    color: var(--cdmodal-content-color);
    opacity: 0.4;
    padding: 2rem 0;
    font-size: 0.9rem;
}

/* ===== 设置项行 ===== */
.cdmodal-setting-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    margin-bottom: 0.25rem;
    border-radius: 0.375rem;
    transition: background 0.15s;
    min-height: 44px;
}

.cdmodal-setting-row:hover {
    background: rgba(0, 0, 0, 0.02);
}

.cdmodal-setting-row .label-wrap {
    flex: 0 0 auto;
    min-width: 100px;
}

.cdmodal-setting-row .label-wrap .main {
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--cdmodal-title-color);
}

.cdmodal-setting-row .label-wrap .desc {
    font-size: 0.7rem;
    color: var(--cdmodal-content-color);
    opacity: 0.5;
    margin-top: 0.1rem;
}

.cdmodal-setting-row .control-wrap {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

/* ===== 自定义开关 ===== */
.cdmodal-switch {
    position: relative;
    display: inline-block;
    width: 2.4rem;
    height: 1.4rem;
    cursor: pointer;
    flex-shrink: 0;
}

.cdmodal-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.cdmodal-switch .slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #aaa;
    transition: 0.25s;
    border-radius: 1.4rem;
}

.cdmodal-switch .slider .dot {
    position: absolute;
    height: 1rem;
    width: 1rem;
    left: 0.2rem;
    bottom: 0.2rem;
    background-color: white;
    transition: 0.25s;
    border-radius: 50%;
}

.cdmodal-switch input:checked+.slider {
    background-color: var(--cdmodal-primary);
}

.cdmodal-switch input:checked+.slider .dot {
    transform: translateX(1rem);
}

.cdmodal-switch input:hover+.slider {
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
}

/* ===== 自定义选择框 ===== */
.cdmodal-select-wrap {
    position: relative;
    display: inline-block;
    min-width: 120px;
}

.cdmodal-select-wrap select {
    appearance: none;
    -webkit-appearance: none;
    padding: 0.3rem 2rem 0.3rem 0.75rem;
    border-radius: 0.375rem;
    border: 1px solid var(--cdmodal-input-border);
    background: var(--cdmodal-input-bg);
    color: var(--cdmodal-input-text);
    font-size: 0.85rem;
    outline: none;
    cursor: pointer;
    width: 100%;
    font-family: inherit;
    transition: border-color 0.2s;
}

.cdmodal-select-wrap select:focus {
    border-color: var(--cdmodal-primary);
}

.cdmodal-select-wrap .arrow-down {
    position: absolute;
    right: 0.6rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--cdmodal-content-color);
    font-size: 0.7rem;
    opacity: 0.6;
}

/* ===== 自定义输入框 ===== */
.cdmodal-input-custom {
    padding: 0.3rem 0.75rem;
    border-radius: 0.375rem;
    border: 1px solid var(--cdmodal-input-border);
    background: var(--cdmodal-input-bg);
    color: var(--cdmodal-input-text);
    font-size: 0.85rem;
    outline: none;
    font-family: inherit;
    width: 180px;
    max-width: 100%;
    transition: border-color 0.2s;
}

.cdmodal-input-custom:focus {
    border-color: var(--cdmodal-primary);
}

/* ===== 自定义颜色选择器 ===== */
.cdmodal-color-wrap {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.cdmodal-color-picker {
    width: 2rem;
    height: 2rem;
    padding: 0;
    border: 2px solid var(--cdmodal-input-border);
    border-radius: 0.25rem;
    cursor: pointer;
    background: none;
    flex-shrink: 0;
    transition: border-color 0.2s;
}

.cdmodal-color-picker:focus {
    border-color: var(--cdmodal-primary);
}

.cdmodal-color-text {
    padding: 0.3rem 0.75rem;
    border-radius: 0.375rem;
    border: 1px solid var(--cdmodal-input-border);
    background: var(--cdmodal-input-bg);
    color: var(--cdmodal-input-text);
    font-size: 0.85rem;
    outline: none;
    font-family: inherit;
    width: 100px;
    transition: border-color 0.2s;
}

.cdmodal-color-text:focus {
    border-color: var(--cdmodal-primary);
}

/* ===== 自定义按钮 ===== */
.cdmodal-btn-settings {
    padding: 0.3rem 1.2rem;
    border: none;
    border-radius: 0.375rem;
    background: var(--cdmodal-primary);
    color: white;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 500;
    transition: opacity 0.2s;
}

.cdmodal-btn-settings:hover {
    opacity: 0.8;
}

/* ===== 底部按钮 ===== */
.cdmodal-settings-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.625rem;
    padding: 0.75rem 1.25rem;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    flex-shrink: 0;
}

.cdmodal-settings-footer .cdm-btn-save {
    padding: 0.4rem 1.5rem;
    border: none;
    border-radius: 2rem;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    background: var(--cdmodal-primary);
    color: white;
    transition: all 0.2s;
}

.cdmodal-settings-footer .cdm-btn-save:hover {
    background: var(--cdmodal-primary-hover);
}

.cdmodal-settings-footer .btn-cancel {
    padding: 0.4rem 1.5rem;
    border-radius: 2rem;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    background: transparent;
    border: 1px solid var(--cdmodal-cancel-border);
    color: var(--cdmodal-cancel-text);
    transition: all 0.2s;
}

.cdmodal-settings-footer .btn-cancel:hover {
    background: var(--cdmodal-cancel-hover-bg);
}

.cdmodal-custom-select {
    position: relative;
    display: inline-block;
    min-width: 120px;
    cursor: pointer;
    user-select: none;
}
.cdmodal-custom-select .select-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.3rem 0.75rem;
    border-radius: 0.375rem;
    border: 1px solid var(--cdmodal-input-border);
    background: var(--cdmodal-input-bg);
    color: var(--cdmodal-input-text);
    font-size: 0.85rem;
    transition: border-color 0.2s;
    min-height: 32px;
    gap: 0.5rem;
}
.cdmodal-custom-select .select-display:hover {
    border-color: var(--cdmodal-primary);
}
.cdmodal-custom-select .select-display .arrow {
    font-size: 0.6rem;
    opacity: 0.6;
    transition: transform 0.5s;
    filter: var(--cdmodal-arrow-filter);
    zoom: .7;
}
.cdmodal-custom-select .select-display .arrow.open {
    transform: rotateX(180deg);
}
.cdmodal-custom-select .select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.25rem;
    border-radius: 0.375rem;
    border: 1px solid var(--cdmodal-input-border);
    background: var(--cdmodal-modal-bg);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    max-height: 200px;
    overflow-y: auto;
    z-index: 100;
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
    transform-origin: top center;
    transition: opacity 0.2s ease, transform 0.2s ease;
    pointer-events: none;
}
.cdmodal-custom-select .select-dropdown.open {
    opacity: 1;
    transform: scale(1) translateY(0);
    pointer-events: auto;
}
.cdmodal-custom-select .select-option {
    padding: 0.4rem 0.75rem;
    cursor: pointer;
    font-size: 0.85rem;
    color: var(--cdmodal-input-text);
    transition: background 0.15s;
}
.cdmodal-custom-select .select-option:hover {
    background: rgba(99,102,241,0.08);
}
.cdmodal-custom-select .select-option.selected {
    background: rgba(99,102,241,0.15);
    color: var(--cdmodal-primary);
}

/* ===== 自定义 Range ===== */
.cdmodal-custom-range {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 150px;
}
.cdmodal-custom-range .track {
    position: relative;
    flex: 1;
    height: 20px;
    min-width: 80px;
    cursor: pointer;
    display: flex;
    align-items: center;
}
/* 实际轨道线 */
.cdmodal-custom-range .track::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--cdmodal-input-border);
    border-radius: 2px;
}
.cdmodal-custom-range .track .fill {
    position: absolute;
    left: 0;
    height: 4px;
    background: var(--cdmodal-primary);
    border-radius: 2px;
    pointer-events: none;
}
.cdmodal-custom-range .track .thumb {
    position: absolute;
    top: 50%;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--cdmodal-primary);
    transform: translate(-50%, -50%);
    transition: transform 0.15s;
    pointer-events: auto;
}
.cdmodal-custom-range .track .thumb:hover {
    transform: translate(-50%, -50%) scale(1.1);
}
.cdmodal-custom-range .track .thumb:active {
    cursor: grabbing;
    transform: translate(-50%, -50%) scale(1.2);
}
.cdmodal-custom-range .value {
    min-width: 2.2rem;
    text-align: center;
    font-size: 0.8rem;
    color: var(--cdmodal-title-color);
    font-weight: 500;
}
.cdmodal-text-display {
    font-size: 1.05rem;
    font-weight: 500;
    color: var(--cdmodal-title-color);
    background: rgba(0,0,0,0.02);
    border-radius: 0.25rem;
    word-break: break-all;
    max-width: 200px;
    white-space: pre-wrap;
}
.cdmodal-setting-row:has(.cdmodal-text-display) {
    padding: 0 0.75rem;
    min-height: unset;
}`;
document.head.appendChild(style);

let globalSettings = {
    theme: 'light',
    overlayBlur: 8,
    modalBorderRadius: 28,
    primaryColor: '#6366f1',
    titleColor: null,
    contentColor: null,
    overlayBgColor: 'rgba(0, 0, 0, 0.4)',
    modalBgColor: null,
    confirmBtnColor: null,
    cancelBtnColor: null,
    snackbarBgColor: null,
    snackbarTextColor: null,
    closeOnOverlay: true,
    closeOnEsc: true,
    enterok: true,
};

function showModal(options) {
    return new Promise((resolve) => {
        const closeOnOverlay = options.closeOnOverlay !== undefined ? options.closeOnOverlay : globalSettings.closeOnOverlay;
        const closeOnEsc = options.closeOnEsc !== undefined ? options.closeOnEsc : globalSettings.closeOnEsc;
        const overlay = document.createElement('div');
        overlay.className = 'cdmodal-overlay';
        const container = document.createElement('div');
        container.className = 'cdmodal-container';
        overlay.appendChild(container);
        document.body.appendChild(overlay);
        let isResolved = false;
        let escHandler = null;
        const cleanup = () => {
            if (isResolved) return;
            isResolved = true;
            if (escHandler) document.removeEventListener('keydown', escHandler);
            overlay.style.animation = 'cdmodal-fade-out 0.2s ease forwards';
            container.style.animation = 'cdmodal-container-out 0.2s ease forwards';
            setTimeout(() => overlay.remove(), 200);
        };
        const finalize = (value) => {
            if (isResolved) return;
            cleanup();
            resolve(value);
        };
        if (options.title) {
            const titleEl = document.createElement('h3');
            titleEl.textContent = options.title;
            titleEl.className = 'cdmodal-title';
            if (options.titleColor) titleEl.style.color = options.titleColor;
            container.appendChild(titleEl);
        }
        const contentEl = document.createElement('div');
        contentEl.textContent = options.content || '';
        contentEl.className = 'cdmodal-content';
        if (options.contentColor) contentEl.style.color = options.contentColor;
        container.appendChild(contentEl);
        let inputEl = null;
        if (options.input) {
            inputEl = document.createElement('input');
            inputEl.type = 'text';
            inputEl.placeholder = options.inputPlaceholder || '';
            inputEl.value = options.value ?? '';
            inputEl.className = 'cdmodal-input';
            container.appendChild(inputEl);
            setTimeout(() => inputEl.focus(), 50);
        }
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'cdmodal-buttons';
        if (options.choices && Array.isArray(options.choices) && options.choices.length > 0) {
            options.choices.forEach((choice) => {
                const btn = document.createElement('button');
                btn.textContent = choice.label || choice;
                btn.className = 'cdmodal-btn-primary';
                btn.addEventListener('click', () => finalize(choice.value !== undefined ? choice.value : choice));
                buttonsDiv.appendChild(btn);
            });
        } else {
            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = options.confirmText || '确定';
            confirmBtn.className = 'cdmodal-btn-primary';
            let cancelBtn = null;
            if (options.showCancel) {
                cancelBtn = document.createElement('button');
                cancelBtn.textContent = options.cancelText || '取消';
                cancelBtn.className = 'cdmodal-btn-secondary';
                cancelBtn.addEventListener('click', () => finalize(options.input ? null : false));
            }
            confirmBtn.addEventListener('click', () => {
                finalize(options.input ? (inputEl?.value || '') : true);
            });
            buttonsDiv.appendChild(confirmBtn);
            if (cancelBtn) buttonsDiv.appendChild(cancelBtn);
            if (inputEl && (options.enterok ?? globalSettings.enterok)) inputEl.onkeydown = e => e.key === "Enter" && confirmBtn.click() || 1;
        }
        container.appendChild(buttonsDiv);
        if (closeOnOverlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    finalize(options.input ? null : (options.choices ? null : false));
                }
            });
        }
        if (closeOnEsc) {
            escHandler = (e) => {
                if (e.key === 'Escape') {
                    finalize(options.input ? null : (options.choices ? null : false));
                }
            };
            document.addEventListener('keydown', escHandler);
        }
    });
}

const snackbarContainers = {};

function getSnackbarContainer(position) {
    if (!snackbarContainers[position]) {
        const container = document.createElement('div');
        container.className = 'cdmodal-snackbar-container';
        const posMap = {
            '左上角': { top: '1rem', left: '1rem', alignItems: 'flex-start' },
            '顶部居中': { top: '1rem', left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
            '右上角': { top: '1rem', right: '1rem', alignItems: 'flex-end' },
            '左下角': { bottom: '1rem', left: '1rem', alignItems: 'flex-start', flexDirection: 'column-reverse' },
            '底部居中': { bottom: '1rem', left: '50%', transform: 'translateX(-50%)', alignItems: 'center', flexDirection: 'column-reverse' },
            '右下角': { bottom: '1rem', right: '1rem', alignItems: 'flex-end', flexDirection: 'column-reverse' }
        };
        const config = posMap[position] || posMap['底部居中'];
        Object.assign(container.style, config);
        document.body.appendChild(container);
        snackbarContainers[position] = container;
    }
    return snackbarContainers[position];
}

function removeSnackbar(snackbar) {
    if (!snackbar.parentNode) return;
    snackbar.style.animation = 'cdmodal-snackbar-out 0.3s ease forwards';
    setTimeout(() => snackbar.remove(), 300);
}

function showSnackbarInternal(text, durationSec, position, bgColor, textColor) {
    return new Promise((resolve) => {
        const container = getSnackbarContainer(position);
        let timer = null;
        let isRemoved = false;
        const removeAndResolve = () => {
            if (isRemoved) return;
            isRemoved = true;
            if (timer) clearTimeout(timer);
            removeSnackbar(snackbar);
            resolve();
        };
        const snackbar = document.createElement('div');
        snackbar.className = 'cdmodal-snackbar';
        if (bgColor) {
            snackbar.style.background = bgColor;
        } else if (globalSettings.snackbarBgColor) {
            snackbar.style.background = globalSettings.snackbarBgColor;
        }
        if (textColor) {
            snackbar.style.color = textColor;
        } else if (globalSettings.snackbarTextColor) {
            snackbar.style.color = globalSettings.snackbarTextColor;
        }
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        textSpan.style.flex = '1';
        snackbar.appendChild(textSpan);
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.className = 'cdmodal-snackbar-close';
        closeBtn.onclick = () => removeAndResolve();
        snackbar.appendChild(closeBtn);
        container.appendChild(snackbar);
        if (durationSec > 0) {
            timer = setTimeout(() => removeAndResolve(), durationSec * 1000);
        }
    });
}
const settingStore = {
    groups: {},
    selectedIndex: -1,
    
    addGroup(label, items = []) {
        if (this.groups[label]) {
            console.warn(`分组 "${label}" 已存在，跳过添加`);
            return false;
        }
        this.groups[label] = {
            type: 'group',
            label: label,
            items: items,
            description: ''
        };
        return true;
    },
    
    getGroup(label) {
        return this.groups[label] || null;
    },
    
    hasGroup(label) {
        return !!this.groups[label];
    },
    
    getAllGroups() {
        return Object.values(this.groups);
    },
    
    getGroupNames() {
        return Object.keys(this.groups);
    },
    
    hasSetting(label) {
        for (const group of Object.values(this.groups)) {
            if (group.items) {
                const found = group.items.find(sub => sub.label === label);
                if (found) return true;
            }
        }
        return false;
    },
    
    getSetting(label) {
        for (const group of Object.values(this.groups)) {
            if (group.items) {
                const found = group.items.find(sub => sub.label === label);
                if (found) return found;
            }
        }
        return null;
    },
    
    getValue(label) {
        const item = this.getSetting(label);
        if (item && item.type !== 'group') {
            return item.default;
        }
        return null;
    },
    
    setValue(label, value) {
        const item = this.getSetting(label);
        if (item && item.type !== 'group') {
            item.default = value;
            runtime.startHats(
                'cdmodal_whenschange', 
                { TEXT: label },
                null,
                { '值': value }
            );
            return true;
        }
        return false;
    },
    
    getValues() {
        const result = {};
        for (const group of Object.values(this.groups)) {
            if (group.items) {
                group.items.forEach(subItem => {
                    if (subItem.type !== 'group') {
                        result[subItem.label] = subItem.default;
                    }
                });
            }
        }
        return result;
    },
    
    getSettingsJSON() {
        return this.groups;
    },
    
    importSettings(jsonData) {
        if (!jsonData || typeof jsonData !== 'object') return false;
        this.groups = jsonData;
        return true;
    },
    
    clear() {
        this.groups = {};
        this.selectedIndex = -1;
    },

    removeGroup(label) {
        if (!this.groups[label]) {
            console.warn(`分组 "${label}" 不存在，删除失败`);
            return false;
        }
        delete this.groups[label];
        this.selectedIndex = -1;
        return true;
    },
    
    removeSetting(label) {
        for (const group of Object.values(this.groups)) {
            if (group.items) {
                const index = group.items.findIndex(sub => sub.label === label);
                if (index !== -1) {
                    group.items.splice(index, 1);
                    return true;
                }
            }
        }
        console.warn(`设置项 "${label}" 不存在，删除失败`);
        return false;
    },
    
    addTextLabel(groupName, label, description = '') {
        const group = this.getGroup(groupName);
        if (!group) {
            console.warn(`分组 "${groupName}" 不存在，添加标签失败`);
            return false;
        }
        
        // 检查是否已存在
        if (this.hasSetting(label)) {
            console.warn(`设置项 "${label}" 已存在，跳过添加`);
            return false;
        }
        
        group.items.push({
            type: 'text',
            label: label,
            description: description || undefined
        });
        return true;
    },
};

function showSettingsUI(options = {}) {
    return new Promise((resolve) => {
        const {
            title = '设置',
            onSave = null,
            onCancel = null,
            showCancel = true,
            saveText = '保存设置',
            cancelText = '取消'
        } = options;

        // 创建弹窗
        const overlay = document.createElement('div');
        overlay.className = 'cdmodal-overlay';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.padding = '1rem';
        
        const container = document.createElement('div');
        container.className = 'cdmodal-settings';
        overlay.appendChild(container);
        document.body.appendChild(overlay);

        let isResolved = false;
        const settingsState = {};

        const cleanup = () => {
            if (isResolved) return;
            isResolved = true;
            overlay.style.animation = 'cdmodal-fade-out 0.2s ease forwards';
            container.style.animation = 'cdmodal-container-out 0.2s ease forwards';
            setTimeout(() => overlay.remove(), 200);
        };

        const finalize = (value) => {
            if (isResolved) return;
            cleanup();
            resolve(value);
        };

        // ===== 标题栏 =====
        const header = document.createElement('div');
        header.className = 'cdmodal-settings-header';
        
        const titleEl = document.createElement('span');
        titleEl.className = 'cdmodal-settings-title';
        titleEl.textContent = title;
        header.appendChild(titleEl);
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'cdmodal-settings-close';
        closeBtn.textContent = '✕';
        closeBtn.onclick = () => {
            if (onCancel) onCancel();
            finalize(null);
        };
        header.appendChild(closeBtn);
        container.appendChild(header);

        // ===== 主体 =====
        const body = document.createElement('div');
        body.className = 'cdmodal-settings-body';

        const leftPanel = document.createElement('div');
        leftPanel.className = 'cdmodal-settings-left';

        const rightPanel = document.createElement('div');
        rightPanel.className = 'cdmodal-settings-right';

        body.appendChild(leftPanel);
        body.appendChild(rightPanel);
        container.appendChild(body);

        const footer = document.createElement('div');
        footer.className = 'cdmodal-settings-footer';

        const closeBtnFooter = document.createElement('button');
        closeBtnFooter.className = 'btn-cancel';
        closeBtnFooter.textContent = '关闭';
        closeBtnFooter.onclick = () => {
            onSave && onSave(settingStore.getValues())
            finalize(settingStore.getValues());
        };
        footer.appendChild(closeBtnFooter);
        container.appendChild(footer);

        // ===== 渲染左侧菜单 =====
        let selectedIndex = settingStore.selectedIndex >= 0 ? settingStore.selectedIndex : 0;
        let currentGroup = null;

        function renderLeftMenu() {
            leftPanel.innerHTML = '';
            const groups = settingStore.getAllGroups();

            // 只渲染分组
            groups.forEach((group, idx) => {
                const menuItem = createMenuItem(group, idx);
                leftPanel.appendChild(menuItem);
            });

            // 选中状态
            const children = leftPanel.children;
            if (selectedIndex >= 0 && selectedIndex < children.length) {
                const target = children[selectedIndex];
                if (target) {
                    target.classList.add('active');
                    const group = settingStore.getAllGroups()[selectedIndex];
                    if (group) {
                        currentGroup = group;
                        renderRightPanel(selectedIndex);
                    }
                }
            } else if (children.length > 0) {
                children[0].classList.add('active');
                const group = settingStore.getAllGroups()[0];
                if (group) {
                    currentGroup = group;
                    renderRightPanel(0);
                }
            }
        }

        function createMenuItem(group, index) {
            const div = document.createElement('div');
            div.className = 'cdmodal-settings-menu-item';
            
            const labelSpan = document.createElement('span');
            labelSpan.className = 'label';
            labelSpan.textContent = group.label;
            div.appendChild(labelSpan);
            
            if (group.type === 'group') {
                const arrow = document.createElement('img');
                arrow.className = 'arrow';
                arrow.src = '//m.ccw.site/works-covers/cdm-dropdown.svg';
                div.appendChild(arrow);
            }
            
            div.onclick = () => {
                const children = leftPanel.children;
                for (let i = 0; i < children.length; i++) {
                    children[i].classList.remove('active');
                }
                div.classList.add('active');
                
                selectedIndex = index;
                settingStore.selectedIndex = index;
                
                const groups = settingStore.getAllGroups();
                const targetGroup = groups[index];
                if (targetGroup) {
                    currentGroup = targetGroup;
                    renderRightPanel(index);
                }
            };
            
            return div;
        }

        // ===== 渲染右侧详情 =====
        function renderRightPanel(index) {
            rightPanel.innerHTML = '';
            const groups = settingStore.getAllGroups();
            const targetGroup = groups[index];
            
            if (!targetGroup) {
                const empty = document.createElement('div');
                empty.className = 'cdmodal-settings-empty';
                empty.textContent = '请选择一个设置项';
                rightPanel.appendChild(empty);
                return;
            }

            // 分组标题
            const groupHeader = document.createElement('div');
            groupHeader.className = 'cdmodal-settings-group-header';
            
            const groupTitle = document.createElement('div');
            groupTitle.className = 'cdmodal-settings-group-title';
            groupTitle.textContent = targetGroup.label;
            groupHeader.appendChild(groupTitle);
            
            if (targetGroup.description) {
                const desc = document.createElement('div');
                desc.className = 'cdmodal-settings-group-desc';
                desc.textContent = targetGroup.description;
                groupHeader.appendChild(desc);
            }
            
            rightPanel.appendChild(groupHeader);
            
            // 子项
            const subItems = targetGroup.items || [];
            subItems.forEach((item) => {
                const wrapper = createSettingRow(item);
                rightPanel.appendChild(wrapper);
            });
            
            if (subItems.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'cdmodal-settings-empty';
                empty.textContent = '此分组暂无设置项';
                rightPanel.appendChild(empty);
            }
        }

        // ===== 创建设置项行 =====
        function createSettingRow(item) {
            const wrapper = document.createElement('div');
            wrapper.className = 'cdmodal-setting-row';

            const labelWrap = document.createElement('div');
            labelWrap.className = 'label-wrap';
            
            const main = document.createElement('div');
            main.className = 'main';
            main.textContent = item.label;
            labelWrap.appendChild(main);
            
            if (item.description) {
                const desc = document.createElement('div');
                desc.className = 'desc';
                desc.textContent = item.description;
                labelWrap.appendChild(desc);
            }
            
            wrapper.appendChild(labelWrap);

            const controlWrap = document.createElement('div');
            controlWrap.className = 'control-wrap';

            let control = null, value = settingStore.getValue(item.label);
            switch (item.type) {
                case 'switch':
                    control = createSwitchControl(item, value);
                    break;
                case 'select':
                    control = createSelectControl(item, value);
                    break;
                case 'input':
                    control = createInputControl(item, value);
                    break;
                case 'color':
                    control = createColorControl(item, value);
                    break;
                case 'range':
                    control = createRangeControl(item, value);
                    break;
                case 'button':
                    control = createButtonControl(item, value);
                    break;
                case 'text':
                    main.className = "cdmodal-text-display";
                    break;
                default:
                    const textSpan = document.createElement('span');
                    textSpan.textContent = item.default || '';
                    textSpan.style.color = 'var(--cdmodal-content-color)';
                    control = textSpan;
            }
            
            if (control) {
                controlWrap.appendChild(control);
                wrapper.appendChild(controlWrap);
            }

            // 存储状态
            if (item.default !== undefined && item.type !== 'group' && !(item.label in settingsState)) {
                settingsState[item.label] = item.default;
            }

            return wrapper;
        }

        // ===== 控件创建函数 =====
        function createSwitchControl(item, initialValue) {
            const label = document.createElement('label');
            label.className = 'cdmodal-switch';
            
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = initialValue || false;
            
            const slider = document.createElement('span');
            slider.className = 'slider';
            const dot = document.createElement('span');
            dot.className = 'dot';
            slider.appendChild(dot);
            
            input.onchange = () => {
                settingStore.setValue(item.label, input.checked);
                if (item.onChange) item.onChange(input.checked);
            };
            
            label.appendChild(input);
            label.appendChild(slider);
            return label;
        }

        function createSelectControl(item, initialValue) {
            const container = document.createElement('div');
            container.className = 'cdmodal-custom-select';
            
            const display = document.createElement('div');
            display.className = 'select-display';
            
            const textSpan = document.createElement('span');
            textSpan.className = 'select-text';
            const currentOption = (item.options || []).find(opt => {
                const val = opt.value !== undefined ? opt.value : opt;
                return String(val) === String(initialValue);
            });
            textSpan.textContent = currentOption ? (currentOption.label || currentOption) : '未选择';
            display.appendChild(textSpan);
            
            const arrow = document.createElement('span');
            arrow.className = 'arrow';
            arrow.textContent = '▼';
            display.appendChild(arrow);
            container.appendChild(display);
            
            const dropdown = document.createElement('div');
            dropdown.className = 'select-dropdown';
            
            (item.options || []).forEach(opt => {
                const optionValue = opt.value !== undefined ? opt.value : opt;
                const optionLabel = opt.label || opt;
                
                const optionEl = document.createElement('div');
                optionEl.className = 'select-option';
                if (String(optionValue) === String(initialValue)) {
                    optionEl.classList.add('selected');
                }
                optionEl.textContent = optionLabel;
                optionEl.dataset.value = optionValue;
                
                optionEl.addEventListener('pointerdown', (e) => {
                    e.stopPropagation();
                    dropdown.querySelectorAll('.select-option').forEach(el => el.classList.remove('selected'));
                    optionEl.classList.add('selected');
                    textSpan.textContent = optionLabel;
                    closeDropdown();
                    settingStore.setValue(item.label, optionValue);
                    if (item.onChange) item.onChange(optionValue);
                });
                
                dropdown.appendChild(optionEl);
            });
            
            container.appendChild(dropdown);
            
            function openDropdown() {
                dropdown.classList.add('open');
                arrow.classList.add('open');
            }
            
            function closeDropdown() {
                dropdown.classList.remove('open');
                arrow.classList.remove('open');
            }
            
            display.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                const isOpen = dropdown.classList.contains('open');
                document.querySelectorAll('.cdmodal-custom-select .select-dropdown').forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('open');
                        d.parentElement.querySelector('.arrow')?.classList.remove('open');
                    }
                });
                if (isOpen) {
                    closeDropdown();
                } else {
                    openDropdown();
                }
            });
            
            document.addEventListener('pointerdown', (e) => {
                if (!container.contains(e.target)) {
                    closeDropdown();
                }
            });
            
            dropdown.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
            });
            
            return container;
        }

        function createInputControl(item, initialValue) {
            const input = document.createElement('input');
            input.className = 'cdmodal-input-custom';
            input.type = 'text';
            input.placeholder = item.placeholder || '';
            input.value = initialValue || '';
            
            if (item.inputType === 'number') {
                input.inputMode = 'numeric';
                input.pattern = '[0-9]*';
            }
            
            input.oninput = () => {
                let value = input.value;
                if (item.inputType === 'number') {
                    value = value.replace(/[^0-9.]/g, '');
                    input.value = value;
                }
                settingStore.setValue(item.label, value);
                if (item.onChange) item.onChange(value);
            };
            
            input.onkeydown = e => e.key === "Enter" && input.blur() || 1;

            return input;
        }

        function createColorControl(item, initialValue) {
            const wrap = document.createElement('div');
            wrap.className = 'cdmodal-color-wrap';
            
            let colorValue = initialValue || item.default || '#6366f1';
            
            function isValidAndConvert(color) {
                if (!color || typeof color !== 'string') return null;
                try {
                    const div = document.createElement('div');
                    div.style.color = color.trim();
                    document.body.appendChild(div);
                    const computed = getComputedStyle(div).color;
                    document.body.removeChild(div);
                    
                    if (!computed || computed === 'rgba(0, 0, 0, 0)') return null;
                    
                    // 转 Hex
                    const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                    if (match) {
                        const r = parseInt(match[1]);
                        const g = parseInt(match[2]);
                        const b = parseInt(match[3]);
                        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                    }
                } catch (e) {}
                return null;
            }
            
            // 验证初始值
            const validated = isValidAndConvert(colorValue);
            if (validated) colorValue = validated;
            else colorValue = '#6366f1';
            
            const picker = document.createElement('input');
            picker.className = 'cdmodal-color-picker';
            picker.type = 'color';
            picker.value = colorValue;
            
            const text = document.createElement('input');
            text.className = 'cdmodal-color-text';
            text.type = 'text';
            text.value = colorValue;
            text.placeholder = '#6366f1';
            text.spellcheck = false;
            
            function updateColor(value) {
                const hex = isValidAndConvert(value);
                if (hex) {
                    picker.value = hex;
                    text.value = hex;
                    settingStore.setValue(item.label, hex);
                    if (item.onChange) item.onChange(hex);
                    return true;
                }
                return false;
            }
            
            picker.oninput = () => {
                const value = picker.value;
                text.value = value;
                settingStore.setValue(item.label, value);
                if (item.onChange) item.onChange(value);
            };
            
            text.onblur = () => {
                const value = text.value.trim();
                if (!value || !updateColor(value)) {
                    const stored = settingStore.getValue(item.label) || item.default || '#6366f1';
                    text.value = stored;
                    picker.value = stored;
                }
            };

            text.onkeydown = e => e.key === 'Enter' && text.blur() || 1;
            
            wrap.appendChild(picker);
            wrap.appendChild(text);
            
            return wrap;
        }

        function createRangeControl(item, initialValue) {
            const container = document.createElement('div');
            container.className = 'cdmodal-custom-range';
            
            const min = item.min || 0;
            const max = item.max || 100;
            const step = item.step || 1;
            const defaultValue = initialValue || Math.round((item.max - item.min) / 2);
            
            let initialPercent = ((defaultValue - min) / (max - min)) * 100;
            initialPercent = Math.max(0, Math.min(100, initialPercent));
            
            // 轨道
            const track = document.createElement('div');
            track.className = 'track';
            
            // 填充条
            const fill = document.createElement('div');
            fill.className = 'fill';
            fill.style.width = initialPercent + '%';
            track.appendChild(fill);
            
            // 滑块
            const thumb = document.createElement('div');
            thumb.className = 'thumb';
            thumb.style.left = initialPercent + '%';
            track.appendChild(thumb);
            container.appendChild(track);
            
            // 数值显示
            const valueDisplay = document.createElement('span');
            valueDisplay.className = 'value';
            valueDisplay.textContent = defaultValue;
            container.appendChild(valueDisplay);
            
            settingsState[item.label] = defaultValue;
            
            // 更新函数
            function updateValue(clientX) {
                const rect = track.getBoundingClientRect();
                let percent = (clientX - rect.left) / rect.width;
                percent = Math.max(0, Math.min(1, percent));
                
                const rawValue = min + percent * (max - min);
                const steppedValue = Math.round(rawValue / step) * step;
                const clampedValue = Math.max(min, Math.min(max, steppedValue));
                
                const newPercent = ((clampedValue - min) / (max - min)) * 100;
                
                fill.style.width = newPercent + '%';
                thumb.style.left = newPercent + '%';
                valueDisplay.textContent = clampedValue;
                settingStore.setValue(item.label, clampedValue);
                if (item.onChange) item.onChange(clampedValue);
            }
            
            // 统一的 pointer 事件处理
            function onPointerDown(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // 如果是点击轨道（不是 thumb），直接更新值
                if (e.target === track || e.target === fill) {
                    updateValue(e.clientX);
                }
                
                // 捕获指针，确保拖拽时不会丢失
                track.setPointerCapture(e.pointerId);
                
                function onPointerMove(e) {
                    updateValue(e.clientX);
                }
                
                function onPointerUp() {
                    track.releasePointerCapture(e.pointerId);
                    track.removeEventListener('pointermove', onPointerMove);
                    track.removeEventListener('pointerup', onPointerUp);
                }
                
                track.addEventListener('pointermove', onPointerMove);
                track.addEventListener('pointerup', onPointerUp, { once: true });
            }
            
            // 使用 pointerdown 统一处理
            track.addEventListener('pointerdown', onPointerDown);
            thumb.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // 直接调用 track 的 pointerdown 处理
                onPointerDown(e);
            });
            
            return container;
        }
        function createButtonControl(item) {
            const btn = document.createElement('button');
            btn.className = 'cdmodal-btn-settings';
            btn.textContent = item.text;
            btn.onclick = () => {
                if (item.onClick) item.onClick(settingsState);
            };
            return btn;
        }
        renderLeftMenu();
    });
}


const { runtime } = Scratch;
class CDModalExtension {
    constructor() {
        this.whenButtonClick = () => 1;
        this.whenschange = () => 1;
    }
    getInfo() {
        return {
            id: 'cdmodal',
            name: 'CDModal',
            color1: '#6366f1',
            color2: '#8b5cf6',
            menuIconURI: 'https://m.ccw.site/post/692538ef86bbc77f84e3b259/3ca07cba-7a07-4f9d-92a6-2177b53a84b2.png',
            blocks: [
                {
                    opcode: 'showAlert',
                    blockType: 'command',
                    text: '显示提示 [MESSAGE] 并 [wait]',
                    arguments: {
                        MESSAGE: { type: 'string', defaultValue: 'CDModal' },
                        wait: { menu: 'wait' }
                    }
                },
                {
                    opcode: 'showConfirm',
                    blockType: 'Boolean',
                    text: '询问 [MESSAGE] 按钮文本 [yt] [ct]',
                    arguments: {
                        MESSAGE: { type: 'string', defaultValue: '你确定吗？' },
                        yt: { type: 'string', defaultValue: '确认' },
                        ct: { type: 'string', defaultValue: '取消' },
                    }
                },
                {
                    opcode: 'showPrompt',
                    blockType: 'reporter',
                    text: '输入框 [MESSAGE] 占位文本 [DEFAULT] 默认值 [VALUE] 按钮文本 [yt] [ct] 且 [sc] 取消',
                    arguments: {
                        MESSAGE: { type: 'string', defaultValue: '请输入：' },
                        VALUE: { type: 'string' },
                        DEFAULT: { type: 'string', defaultValue: '' },
                        sc: { menu: 'enabled' },
                        yt: { type: 'string', defaultValue: '确认' },
                        ct: { type: 'string', defaultValue: '取消' },
                    }
                },
                {
                    opcode: 'showChoice',
                    blockType: 'reporter',
                    text: '选择框 [TITLE] [CONTENT] 选项 [CHOICES] 默认返回值 [dv]',
                    arguments: {
                        TITLE: { type: 'string', defaultValue: '请选择' },
                        CONTENT: { type: 'string', defaultValue: '选择一个选项' },
                        CHOICES: { type: 'string', defaultValue: '["选项A","选项B","选项C"]' },
                        dv: { type: 'string' }
                    }
                },
                {
                    opcode: 'showCustomModal',
                    blockType: 'command',
                    text: '显示自定义对话框 标题 [TITLE] 内容 [CONTENT] 确认按钮 [CONFIRM] 取消按钮 [CANCEL] 并 [wait]',
                    arguments: {
                        TITLE: { type: 'string', defaultValue: '提示' },
                        CONTENT: { type: 'string', defaultValue: '自定义内容' },
                        CONFIRM: { type: 'string', defaultValue: '确定' },
                        CANCEL: { type: 'string', defaultValue: '' },
                        wait: { menu: 'wait' }
                    }
                },
                {
                    opcode: 'showSnackbar',
                    blockType: 'command',
                    text: '显示消息条 [TEXT] 持续时间 [DURATION] 秒 位置 [POSITION] 并 [wait]',
                    arguments: {
                        TEXT: { type: 'string', defaultValue: '这是一条消息' },
                        DURATION: { type: 'number', defaultValue: 2 },
                        POSITION: { type: 'string', defaultValue: '底部居中', menu: 'positionMenu' },
                        wait: { menu: 'wait' }
                    }
                },
                {
                    blockType: 'label',
                    text: '设置'
                },
                {
                    opcode: 'showSettings',
                    blockType: 'command',
                    text: '显示设置界面 [TITLE] 并 [w]',
                    arguments: {
                        TITLE: { type: 'string', defaultValue: '设置' },
                        w: { menu: 'wait' }
                    }
                },
                {
                    opcode: 'addSettingGroup',
                    blockType: 'command',
                    text: '添加设置分组 [LABEL]',
                    arguments: {
                        LABEL: { type: 'string', defaultValue: '默认分组' }
                    }
                },
                {
                    opcode: 'addSettingText',
                    blockType: 'command',
                    text: '添加标签 分组 [GROUP] 标签 [LABEL] 描述 [DESC]',
                    arguments: {
                        GROUP: { type: 'string', defaultValue: '默认分组' },
                        LABEL: { type: 'string', defaultValue: '新标签' },
                        DESC: { type: 'string', defaultValue: '' }
                    }
                },
                {
                    opcode: 'addSettingSwitch',
                    blockType: 'command',
                    text: '添加开关设置 分组 [GROUP] 标签 [LABEL] 默认值 [DEFAULT] 描述 [DESC]',
                    arguments: {
                        GROUP: { type: 'string', defaultValue: '默认分组' },
                        LABEL: { type: 'string', defaultValue: '新开关' },
                        DEFAULT: { type: 'string', menu: 'enabled' },
                        DESC: { type: 'string', defaultValue: '' }
                    }
                },
                {
                    opcode: 'addSettingSelect',
                    blockType: 'command',
                    text: '添加选择设置 分组 [GROUP] 标签 [LABEL] 默认值 [DEFAULT] 选项 [OPTIONS] 描述 [DESC]',
                    arguments: {
                        GROUP: { type: 'string', defaultValue: '默认分组' },
                        LABEL: { type: 'string', defaultValue: '新选择' },
                        DEFAULT: { type: 'string', defaultValue: '' },
                        OPTIONS: { type: 'string', defaultValue: '["选项1","选项2","选项3"]' },
                        DESC: { type: 'string', defaultValue: '' }
                    }
                },
                {
                    opcode: 'addSettingInput',
                    blockType: 'command',
                    text: '添加输入设置 分组 [GROUP] 标签 [LABEL] 默认值 [DEFAULT] 占位符 [PLACEHOLDER] 描述 [DESC]',
                    arguments: {
                        GROUP: { type: 'string', defaultValue: '默认分组' },
                        LABEL: { type: 'string', defaultValue: '新输入' },
                        DEFAULT: { type: 'string', defaultValue: '' },
                        PLACEHOLDER: { type: 'string', defaultValue: '请输入...' },
                        DESC: { type: 'string', defaultValue: '' }
                    }
                },
                {
                    opcode: 'addSettingColor',
                    blockType: 'command',
                    text: '添加颜色设置 分组 [GROUP] 标签 [LABEL] 默认值 [DEFAULT] 描述 [DESC]',
                    arguments: {
                        GROUP: { type: 'string', defaultValue: '默认分组' },
                        LABEL: { type: 'string', defaultValue: '新颜色' },
                        DEFAULT: { type: 'string', defaultValue: '#6366f1' },
                        DESC: { type: 'string', defaultValue: '' }
                    }
                },
                {
                    opcode: 'addSettingRange',
                    blockType: 'command',
                    text: '添加滑块设置 分组 [GROUP] 标签 [LABEL] 默认值 [DEFAULT] 最小值 [MIN] 最大值 [MAX] 步长 [STEP] 描述 [DESC]',
                    arguments: {
                        GROUP: { type: 'string', defaultValue: '默认分组' },
                        LABEL: { type: 'string', defaultValue: '新滑块' },
                        DEFAULT: { type: 'number', defaultValue: 50 },
                        MIN: { type: 'number', defaultValue: 0 },
                        MAX: { type: 'number', defaultValue: 100 },
                        STEP: { type: 'number', defaultValue: 1 },
                        DESC: { type: 'string', defaultValue: '' }
                    }
                },
                {
                    opcode: 'addSettingButton',
                    blockType: 'command',
                    text: '添加按钮设置 分组 [GROUP] 标签 [LABEL] 描述 [DESC] 文本 [TEXT]',
                    arguments: {
                        GROUP: { type: 'string', defaultValue: '默认分组' },
                        LABEL: { type: 'string', defaultValue: '新按钮' },
                        DESC: { type: 'string', defaultValue: '' },
                        TEXT: { type: 'string', defaultValue: '按钮文本' }
                    }
                },
                '---',
                {
                    opcode: 'removeSettingGroup',
                    blockType: 'command',
                    text: '删除设置分组 [LABEL]',
                    arguments: {
                        LABEL: { type: 'string', defaultValue: '默认分组' }
                    }
                },                
                {
                    opcode: 'removeSettingItem',
                    blockType: 'command',
                    text: '删除设置项 [LABEL]',
                    arguments: {
                        LABEL: { type: 'string', defaultValue: '新开关' }
                    }
                },
                '---',
                {
                    opcode: 'getSettingValue',
                    blockType: 'reporter',
                    text: '读取设置值 [LABEL]',
                    allowDropAnywhere: 1,
                    arguments: {
                        LABEL: { type: 'string', defaultValue: '新开关' }
                    }
                },
                {
                    opcode: 'hasSettingGroup',
                    blockType: 'Boolean',
                    text: '分组 [LABEL] 是否存在',
                    arguments: {
                        LABEL: { type: 'string', defaultValue: '默认分组' }
                    }
                },
                {
                    opcode: 'hasSettingItem',
                    blockType: 'Boolean',
                    text: '设置项 [LABEL] 是否存在',
                    arguments: {
                        LABEL: { type: 'string', defaultValue: '新开关' }
                    }
                },
                {
                    opcode: 'whenschange',
                    blockType: 'hat',
                    text: '当设置项 [s] 变化 值 [值]',
                    isEdgeActivated: 0,
                    arguments: {
                        s: { type: 'string', defaultValue: '新开关' },
                        '值': { type: 'ccw_hat_parameter' },
                    }
                },
                '---',
                {
                    opcode: 'whenButtonClick',
                    blockType: 'hat',
                    isEdgeActivated: 0,
                    text: '当按钮被点击 标签 [btn]',
                    arguments: {
                        btn: { type: 'string', defaultValue: '新按钮' },
                    }
                },
                '---',
                {
                    opcode: 'getAllGroups',
                    blockType: 'reporter',
                    text: '当前所有分组名',
                    disableMonitor: 1,
                },
                {
                    opcode: 'exportJSON',
                    blockType: 'reporter',
                    text: '导出所有设置为 JSON，空格数 [space]',
                    arguments: {
                        space: { type: 'number', defaultValue: 0 }
                    }
                },
                {
                    opcode: 'importJSON',
                    blockType: 'command',
                    text: '从 JSON [json] 中导入设置',
                    arguments: {
                        json: { type: 'string', defaultValue: `{"默认分组":{"type":"group","label":"默认分组","items":[{"type":"switch","label":"新开关","default":true},{"type":"select","label":"新选择","default":"","options":["选项1","选项2","选项3"]},{"type":"input","label":"新输入","default":"","placeholder":"请输入..."},{"type":"color","label":"新颜色","default":"#6366f1"},{"type":"range","label":"新滑块","default":50,"min":0,"max":100,"step":1},{"type":"button","label":"按钮","text":"按钮"}],"description":""}}` }
                    }
                },
                {
                    opcode: 'clearSettings',
                    blockType: 'command',
                    text: '清空所有设置项'
                },
                {
                    blockType: 'label',
                    text: '配置'
                },
                {
                    opcode: 'setTheme',
                    blockType: 'command',
                    text: '设置主题 [THEME]',
                    arguments: {
                        THEME: { type: 'string', defaultValue: '深色', menu: 'themeMenu' }
                    }
                },
                {
                    opcode: 'setPrimaryColor',
                    blockType: 'command',
                    text: '设置主色调 [COLOR] 悬停颜色 [hover]',
                    arguments: {
                        COLOR: { type: 'string', defaultValue: '#6366f1' },
                        hover: { type: 'string', defaultValue: '#4f46e5' },
                    }
                },
                {
                    opcode: 'setTitleColor',
                    blockType: 'command',
                    text: '设置标题颜色 [COLOR]',
                    arguments: {
                        COLOR: { type: 'string', defaultValue: '#000000' }
                    }
                },
                {
                    opcode: 'setContentColor',
                    blockType: 'command',
                    text: '设置内容颜色 [COLOR]',
                    arguments: {
                        COLOR: { type: 'string', defaultValue: '#000000' }
                    }
                },
                {
                    opcode: 'setOverlayColor',
                    blockType: 'command',
                    text: '设置遮罩颜色 [COLOR]',
                    arguments: {
                        COLOR: { type: 'string', defaultValue: '#fffff30' }
                    }
                },
                {
                    opcode: 'setModalBgColor',
                    blockType: 'command',
                    text: '设置模态框背景色 [COLOR]',
                    arguments: {
                        COLOR: { type: 'string', defaultValue: '#ffffffee' }
                    }
                },
                {
                    opcode: 'setSnackbarBgColor',
                    blockType: 'command',
                    text: '设置消息条背景色 [COLOR]',
                    arguments: {
                        COLOR: { type: 'string', defaultValue: '#ffffffee' }
                    }
                },
                {
                    opcode: 'setSnackbarTextColor',
                    blockType: 'command',
                    text: '设置消息条文字颜色 [COLOR]',
                    arguments: {
                        COLOR: { type: 'string', defaultValue: '#000000' }
                    }
                },
                {
                    opcode: 'setOverlayBlur',
                    blockType: 'command',
                    text: '设置遮罩模糊半径 [PIXELS]',
                    arguments: {
                        PIXELS: { type: 'number', defaultValue: 8 }
                    }
                },
                {
                    opcode: 'setModalBorderRadius',
                    blockType: 'command',
                    text: '设置弹窗圆角半径 [PIXELS]',
                    arguments: {
                        PIXELS: { type: 'number', defaultValue: 28 }
                    }
                },
                {
                    opcode: 'setCloseOnOverlay',
                    blockType: 'command',
                    text: '[ENABLED] 点击遮罩关闭',
                    arguments: {
                        ENABLED: { menu: 'enabled' }
                    }
                },
                {
                    opcode: 'setCloseOnEsc',
                    blockType: 'command',
                    text: '[ENABLED] ESC 关闭 ',
                    arguments: {
                        ENABLED: { menu: 'enabled' }
                    }
                },
                {
                    opcode: 'setEnterOK',
                    blockType: 'command',
                    text: '[ENABLED] 输入框按下 Enter 确认',
                    arguments: {
                        ENABLED: { menu: 'enabled' }
                    }
                },
                {
                    opcode: 'setus',
                    blockType: 'command',
                    text: '[enabled] 弹窗文本可选择',
                    arguments: {
                        enabled: { menu: 'enabled', defaultValue: 'false' }
                    }
                },
                {
                    opcode: 'resetAll',
                    blockType: 'command',
                    text: '重置配置'
                },
                {
                    blockType: 'label',
                    text: '其他'
                },
                {
                    opcode: 'hex',
                    blockType: 'reporter',
                    text: '颜色 [color]',
                    arguments: {
                        color: { type: 'color', defaultValue: '#6366f1' }
                    }
                },
            ],
            menus: {
                themeMenu: { items: ['浅色', '深色'] },
                positionMenu: { items: ['左上角', '顶部居中', '右上角', '左下角', '底部居中', '右下角'] },
                enabled: {
                    items: [
                        { text: '启用', value: 'true' },
                        { text: '禁用', value: 'false' }
                    ]
                },
                wait: {
                    items: [
                        { text: '等待', value: 'y' },
                        { text: '不等待', value: 'n' }
                    ]
                },
                settingTypeMenu: {
                    items: ['switch', 'select', 'input', 'color', 'range', 'button']
                }
            }
        };
    }

    showAlert(args) {
        const r = showModal({ title: '提示', content: String(args.MESSAGE), confirmText: '确定', showCancel: false });
        return args.wait === "y" && r;
    }

    async showConfirm(args) {
        const r = await showModal({ title: '确认', content: String(args.MESSAGE), confirmText: args.yt, cancelText: args.ct, showCancel: true });
        return r === true;
    }

    async showPrompt(args) {
        const r = await showModal({ title: '输入', content: String(args.MESSAGE), confirmText: args.yt, cancelText: args.ct,
            showCancel: args.sc === "true" ? 1 : 0, input: true, inputPlaceholder: String(args.DEFAULT), value: String(args.VALUE) });
        return r === null ? '' : String(r);
    }

    async showChoice(args) {
        let choices = [];
        try {
            const p = JSON.parse(args.CHOICES);
            if (Array.isArray(p)) choices = p.map(i => typeof i === 'string' ? { label: i, value: i } : i);
        } catch (e) {
            choices = String(args.CHOICES).split(',').map(s => ({ label: s.trim(), value: s.trim() }));
        }
        if (!choices.length) choices = [{ label: '确定', value: '确定' }];
        const r = await showModal({ title: String(args.TITLE), content: String(args.CONTENT), choices, closeOnOverlay: args.dv });
        return r !== null ? String(r) : '';
    }

    showCustomModal(args) {
        const showCancel = String(args.CANCEL).trim().length > 0;
        const r = showModal({ title: String(args.TITLE), content: String(args.CONTENT), confirmText: String(args.CONFIRM), cancelText: showCancel ? String(args.CANCEL) : '', showCancel });
        return args.wait === "y" && r;
    }

    showSnackbar(args) {
        const r = showSnackbarInternal(String(args.TEXT), args.DURATION || 2, String(args.POSITION), null, null);
        return args.wait === "y" && r;
    }

    setSnackbarBgColor(args) {
        const root = document.documentElement;
        if (args.COLOR) {
            root.style.setProperty('--cdmodal-snackbar-bg', args.COLOR);
            globalSettings.snackbarBgColor = args.COLOR;
        } else {
            root.style.removeProperty('--cdmodal-snackbar-bg');
            globalSettings.snackbarBgColor = null;
        }
    }

    setSnackbarTextColor(args) {
        const root = document.documentElement;
        if (args.COLOR) {
            root.style.setProperty('--cdmodal-snackbar-text', args.COLOR);
            globalSettings.snackbarTextColor = args.COLOR;
        } else {
            root.style.removeProperty('--cdmodal-snackbar-text');
            globalSettings.snackbarTextColor = null;
        }
    }

    setTheme(args) {
        const root = document.documentElement;
        if (args.THEME === '深色') {
            root.setAttribute('data-cdmodal-theme', 'dark');
        } else {
            root.setAttribute('data-cdmodal-theme', 'light');
        }
        globalSettings.theme = args.THEME === '深色' ? 'dark' : 'light';
    }

    setPrimaryColor(args) {
        const root = document.documentElement;
        if (args.COLOR) {
            root.style.setProperty('--cdmodal-primary', args.COLOR);
            root.style.setProperty('--cdmodal-primary-hover', args.hover);
            globalSettings.primaryColor = args.COLOR;
        }
    }
    
    showSettings(args) {
        const result = showSettingsUI({
            title: String(args.TITLE)
        });
        return args.w === "y" ? result : 0;
    }

    addSettingToGroup(groupName, config, typeName) {
        if (!groupName) {
            console.warn(`${typeName}设置需要指定分组`);
            return false;
        }
        if (!config.label) {
            console.warn(`${typeName}设置需要指定标签`);
            return false;
        }
        
        // 检查分组是否存在
        const group = settingStore.getGroup(groupName);
        if (!group) {
            console.warn(`分组 "${groupName}" 不存在，${typeName} "${config.label}" 添加失败`);
            return false;
        }
        
        // 检查设置项是否已存在
        if (settingStore.hasSetting(config.label)) {
            console.warn(`设置项 "${config.label}" 已存在，跳过添加`);
            return false;
        }
        
        group.items.push(config);
        return true;
    }

    // 添加开关设置
    addSettingSwitch(args) {
        const config = {
            type: 'switch',
            label: String(args.LABEL),
            default: args.DEFAULT === 'true' || args.DEFAULT === true,
            description: String(args.DESC) || undefined
        };
        return this.addSettingToGroup(String(args.GROUP), config, '开关');
    }

    // 添加选择设置
    addSettingSelect(args) {
        let options = [];
        try {
            const parsed = JSON.parse(args.OPTIONS);
            if (Array.isArray(parsed)) options = parsed;
        } catch (e) {
            options = String(args.OPTIONS).split(',').map(s => s.trim());
        }
        const config = {
            type: 'select',
            label: String(args.LABEL),
            default: String(args.DEFAULT),
            options: options,
            description: String(args.DESC) || undefined
        };
        return this.addSettingToGroup(String(args.GROUP), config, '选择');
    }

    // 添加输入设置
    addSettingInput(args) {
        const config = {
            type: 'input',
            label: String(args.LABEL),
            default: String(args.DEFAULT),
            placeholder: String(args.PLACEHOLDER),
            description: String(args.DESC) || undefined
        };
        return this.addSettingToGroup(String(args.GROUP), config, '输入');
    }

    // 添加颜色设置
    addSettingColor(args) {
        const config = {
            type: 'color',
            label: String(args.LABEL),
            default: String(args.DEFAULT) || '#6366f1',
            description: String(args.DESC) || undefined
        };
        return this.addSettingToGroup(String(args.GROUP), config, '颜色');
    }

    // 添加滑块设置
    addSettingRange(args) {
        const config = {
            type: 'range',
            label: String(args.LABEL),
            default: Number(args.DEFAULT) || 50,
            min: Number(args.MIN) || 0,
            max: Number(args.MAX) || 100,
            step: Number(args.STEP) || 1,
            description: String(args.DESC) || undefined
        };
        return this.addSettingToGroup(String(args.GROUP), config, '滑块');
    }

    // 添加按钮设置
    addSettingButton(args) {
        const label = String(args.LABEL),
            config = {
                type: 'button',
                label,
                description: String(args.DESC) || undefined,
                text: String(args.TEXT || label),
                onClick: () => rt.startHats('cdmodal_whenButtonClick', { TEXT: label })
            };
        return this.addSettingToGroup(String(args.GROUP), config, '按钮');
    }

    // 添加设置分组
    addSettingGroup(args) {
        const label = String(args.LABEL);
        if (!label) {
            console.warn('分组名称不能为空');
            return false;
        }
        return settingStore.addGroup(label, []);
    }

    // 读取设置值
    getSettingValue(args) {
        const label = String(args.LABEL);
        if (!label) return '';
        const value = settingStore.getValue(label);
        return value !== null && value !== undefined ? String(value) : '';
    }

    clearSettings() {
        settingStore.clear();
    }

    setTitleColor(args) {
        const root = document.documentElement;
        if (args.COLOR) {
            root.style.setProperty('--cdmodal-title-color', args.COLOR);
            globalSettings.titleColor = args.COLOR;
        } else {
            root.style.removeProperty('--cdmodal-title-color');
            globalSettings.titleColor = null;
        }
    }

    setContentColor(args) {
        const root = document.documentElement;
        if (args.COLOR) {
            root.style.setProperty('--cdmodal-content-color', args.COLOR);
            globalSettings.contentColor = args.COLOR;
        } else {
            root.style.removeProperty('--cdmodal-content-color');
            globalSettings.contentColor = null;
        }
    }

    setOverlayColor(args) {
        const root = document.documentElement;
        if (args.COLOR) {
            root.style.setProperty('--cdmodal-overlay-bg', args.COLOR);
            globalSettings.overlayBgColor = args.COLOR;
        }
    }

    setModalBgColor(args) {
        const root = document.documentElement;
        if (args.COLOR) {
            root.style.setProperty('--cdmodal-modal-bg', args.COLOR);
            globalSettings.modalBgColor = args.COLOR;
        } else {
            root.style.removeProperty('--cdmodal-modal-bg');
            globalSettings.modalBgColor = null;
        }
    }

    setOverlayBlur(args) {
        const root = document.documentElement;
        const pixels = args.PIXELS || 8;
        root.style.setProperty('--cdmodal-overlay-blur', `${pixels / 16}rem`);
        globalSettings.overlayBlur = pixels;
    }

    setModalBorderRadius(args) {
        const root = document.documentElement;
        const pixels = args.PIXELS || 28;
        root.style.setProperty('--cdmodal-border-radius', `${pixels / 16}rem`);
        globalSettings.modalBorderRadius = pixels;
    }

    setCloseOnOverlay(args) {
        globalSettings.closeOnOverlay = args.ENABLED === "true";
    }

    setCloseOnEsc(args) {
        globalSettings.closeOnEsc = args.ENABLED === "true";
    }

    setEnterOK(args) {
        globalSettings.enterok = args.ENABLED === "true";
    }

    setus({ enabled }) {
        document.documentElement.style.setProperty('--cdmodal-user-select', enabled === "true" ? 'text' : 'none');
    }

    resetAll() {
        const root = document.documentElement;
        root.setAttribute('data-cdmodal-theme', 'light');
        root.style.removeProperty('--cdmodal-primary');
        root.style.removeProperty('--cdmodal-primary-hover');
        root.style.removeProperty('--cdmodal-title-color');
        root.style.removeProperty('--cdmodal-content-color');
        root.style.removeProperty('--cdmodal-overlay-bg');
        root.style.removeProperty('--cdmodal-modal-bg');
        root.style.removeProperty('--cdmodal-overlay-blur');
        root.style.removeProperty('--cdmodal-border-radius');
        root.style.removeProperty('--cdmodal-snackbar-bg');
        root.style.removeProperty('--cdmodal-snackbar-text');
        root.style.removeProperty('--cdmodal-user-select');
        globalSettings = {
            theme: 'light',
            overlayBlur: 8,
            modalBorderRadius: 28,
            primaryColor: '#6366f1',
            titleColor: null,
            contentColor: null,
            overlayBgColor: 'rgba(0, 0, 0, 0.4)',
            modalBgColor: null,
            confirmBtnColor: null,
            cancelBtnColor: null,
            snackbarBgColor: null,
            snackbarTextColor: null,
            closeOnOverlay: true,
            closeOnEsc: true,
            enterok: true,
        };
    }

    hex({ color }) {
        return color;
    }

    exportJSON({ space }) {
        try {
            const data = settingStore.getSettingsJSON();
            return JSON.stringify(data, null, space);
        } catch (e) {
            console.error('导出设置失败:', e);
            return '{}';
        }
    }

    importJSON({ json }) {
        try {
            if (!json || typeof json !== 'string') return 0;
            const data = JSON.parse(json);
            const result = settingStore.importSettings(data);
            return result;
        } catch (e) {
            console.error('导入设置失败:', e);
            return false;
        }
    }

    addSettingGroup(args) {
        const label = String(args.LABEL);
        if (!label) {
            console.warn('分组名称不能为空');
            return false;
        }
        return settingStore.addGroup(label, []);
    }

    removeSettingGroup(args) {
        const label = String(args.LABEL);
        if (!label) {
            console.warn('分组名称不能为空');
            return false;
        }
        const result = settingStore.removeGroup(label);
        if (result) {
            this.refreshSettingsUI?.();
        }
        return result;
    }

    addSettingText(args) {
        const group = String(args.GROUP);
        const label = String(args.LABEL);
        const desc = String(args.DESC);
        
        if (!group || !label) {
            console.warn('分组和标签名称不能为空');
            return false;
        }
        
        const result = settingStore.addTextLabel(group, label, desc);
        if (result) {
            this.refreshSettingsUI?.();
        }
        return result;
    }

    removeSettingItem(args) {
        const label = String(args.LABEL);
        if (!label) {
            console.warn('设置项名称不能为空');
            return false;
        }
        const result = settingStore.removeSetting(label);
        if (result) {
            this.refreshSettingsUI?.();
        }
        return result;
    }
    
    hasSettingGroup(args) {
        const label = String(args.LABEL);
        if (!label) return false;
        return settingStore.hasGroup(label);
    }

    hasSettingItem(args) {
        const label = String(args.LABEL);
        if (!label) return false;
        return settingStore.hasSetting(label);
    }

    getAllGroups() {
        const names = settingStore.getGroupNames();
        return JSON.stringify(names);
    }
}

window.tempExt = {
    Extension: CDModalExtension,
    info: {
        extensionId: 'cdmodal',
        iconURL: 'https://m.ccw.site/works-covers/cjcmtpmt5wvczmgvr.png',
        insetIconURL: 'https://m.ccw.site/post/692538ef86bbc77f84e3b259/3ca07cba-7a07-4f9d-92a6-2177b53a84b2.png',
        name: 'CDModal',
        description: '一个弹窗扩展',
        collaboratorList: [
            { collaborator: 'Chen-Jin @ CCW', collaboratorURL: 'https://www.ccw.site/student/692538ef86bbc77f84e3b259' },
            { collaborator: '[Blank] @ CCW', collaboratorURL: 'https://www.ccw.site/student/692aaebc86bbc77f84e3bdb0' }
        ]
    }
};