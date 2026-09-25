// Light/dark theme for every page. Loaded as the first thing in <body>, so the
// saved theme is applied before anything paints. It also wires the header
// toggle and follows the OS setting until the user picks a theme.
(function () {
  const KEY = "vaxyp-theme";
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const root = document.documentElement;

  // Stroke icons, drawn at the size of the surrounding text.
  const icon = (paths) =>
    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const SUN = icon(
    '<circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />'
  );
  const MOON = icon('<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />');

  // The toggle shows the theme you would switch to. `animated` spins the new
  // icon in, so it only fires on a real switch and not on page load.
  const drawToggle = (animated) => {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;
    const dark = document.body.classList.contains("dark");
    toggle.setAttribute(
      "aria-label",
      dark ? "Εναλλαγή σε φωτεινό θέμα" : "Εναλλαγή σε σκούρο θέμα"
    );
    toggle.innerHTML = `<span class="theme-icon${
      animated ? " is-animated" : ""
    }">${dark ? SUN : MOON}</span>`;
  };

  const apply = (theme, animated) => {
    const dark = theme === "dark";
    document.body.classList.toggle("dark", dark);
    drawToggle(animated);
    // pages that paint their own colours (the sketcher canvas) follow along
    document.dispatchEvent(new CustomEvent("vaxyp-theme", { detail: { dark } }));
  };

  apply(localStorage.getItem(KEY) || (media.matches ? "dark" : "light"));

  // Where the reveal circle starts: the toggle's centre, or the screen centre.
  const revealOrigin = (el) => {
    const rect = el && el.getBoundingClientRect && el.getBoundingClientRect();
    if (!rect) return { x: innerWidth / 2, y: innerHeight / 2 };
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;
    drawToggle(false);
    toggle.addEventListener("click", () => {
      const theme = document.body.classList.contains("dark") ? "light" : "dark";
      localStorage.setItem(KEY, theme);
      const swap = () => apply(theme, true);

      if (reducedMotion.matches) {
        swap();
        return;
      }

      // Fallback for engines without View Transitions: fade the colours.
      if (!document.startViewTransition) {
        root.classList.add("theme-fade");
        swap();
        setTimeout(() => root.classList.remove("theme-fade"), 400);
        return;
      }

      // Snapshot the page, swap the palette, then reveal the new one as a
      // circle growing out of the toggle.
      const { x, y } = revealOrigin(toggle);
      const radius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
      );

      root.classList.add("theme-switching");
      const transition = document.startViewTransition(swap);

      transition.ready
        .then(() => {
          root.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${radius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 550,
              easing: "cubic-bezier(0.4, 0, 0.2, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        })
        .catch(() => {});

      transition.finished.finally(() =>
        root.classList.remove("theme-switching")
      );
    });
  });

  media.addEventListener("change", (e) => {
    if (!localStorage.getItem(KEY)) apply(e.matches ? "dark" : "light");
  });
})();
