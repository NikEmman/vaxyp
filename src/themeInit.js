(function () {
  const theme =
    localStorage.getItem("vaxyp-theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  if (theme === "dark") document.body.classList.add("dark");
})();
