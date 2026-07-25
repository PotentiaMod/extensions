if (window.location.href.includes("snail-ide.com")) {
    const currentPath = window.location.pathname;
    window.location.href = `https://snail-ide.js.org${currentPath}`;
}
