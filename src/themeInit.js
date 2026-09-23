// Light/dark theme for every page. Loaded as the first thing in <body>, so the
// saved theme is applied before anything paints. It also wires the header
// toggle and follows the OS setting until the user picks a theme.
(function () {
  const KEY = "vaxyp-theme";
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const apply = (theme) => {
    const dark = theme === "dark";
    document.body.classList.toggle("dark", dark);
    // pages that paint their own colours (the sketcher canvas) follow along
    document.dispatchEvent(new CustomEvent("vaxyp-theme", { detail: { dark } }));
  };

  apply(localStorage.getItem(KEY) || (media.matches ? "dark" : "light"));

  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      const theme = document.body.classList.contains("dark") ? "light" : "dark";
      localStorage.setItem(KEY, theme);
      // cross-fade the whole page instead of snapping between palettes
      const swap = () => apply(theme);
      document.startViewTransition ? document.startViewTransition(swap) : swap();
    });
  });

  media.addEventListener("change", (e) => {
    if (!localStorage.getItem(KEY)) apply(e.matches ? "dark" : "light");
  });
})();
