// Inlined in <head> so the correct theme is applied before first paint (no flash).
export const THEME_SCRIPT = `(function(){try{var d=document.documentElement;var s=localStorage.getItem("rx-theme");var m=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;d.dataset.theme=s||(m?"dark":"light");}catch(e){document.documentElement.dataset.theme="light";}})();`;
