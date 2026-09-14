import {
  defaultData,
  months,
  days,
  defaultAstynomikos,
} from "./defaultData.js";

export const getData = () => {
  const localStorageData = JSON.parse(localStorage.getItem("dataObject"));
  if (!localStorageData) return defaultData;
  const merged = { ...defaultData, ...localStorageData };
  // Stored value may be 0/null/""/string (empty form field, imported JSON);
  // anything but a positive number breaks the time arithmetic.
  const xronos = Number(merged.xronosPeratosis);
  merged.xronosPeratosis =
    Number.isFinite(xronos) && xronos > 0 ? xronos : defaultData.xronosPeratosis;
  return merged;
};
export function getAnakritikoiSelection() {
  const localStorageData = JSON.parse(localStorage.getItem("anakr"));
  return localStorageData ? localStorageData : { aAnakr: 0, bAnakr: 1 };
}

export const getState = (localData, todayDate) => {
  const stringYear = todayDate.getFullYear();
  const stringMonth = String(todayDate.getMonth() + 1).padStart(2, "0");
  const stringDay = String(todayDate.getDate()).padStart(2, "0");
  const formattedDate = `${stringYear}-${stringMonth}-${stringDay}`;
  const specificDate = new Date(formattedDate);
  const aAnakrSex = localData.anakrSex
    ? localData.anakrSex[getAnakritikoiSelection().aAnakr]
    : "Άντρας";
  const bAnakrSex = localData.anakrSex
    ? localData.anakrSex[getAnakritikoiSelection().bAnakr]
    : "Άντρας";
  const dataObject = {
    victim: "",
    suspect: "",
    vehicle: "",
    formattedDate: `${stringDay}-${stringMonth}-${stringYear}`,
    dayName: days[specificDate.getDay()],
    year: todayDate.getFullYear(),
    month: months[todayDate.getMonth()],
    day: todayDate.getDate(),
    victimData: {},
    ypoptosData: {},
    timePassed: 0,
    apolesthen: "",
    protokolo: "",
    protokoloEndo: "",
    apodexetai: "",
    enMeri: "",
    astynomikoi: [],
    suspects: [],
    aAnakrSex: aAnakrSex,
    bAnakrSex: bAnakrSex,
    astynomikos: defaultAstynomikos,
  };

  Object.assign(dataObject, { ...localData });
  return dataObject;
};
export function saveData(currentData, newObject) {
  const mergedData = Object.assign({ ...currentData }, { ...newObject });
  localStorage.setItem("dataObject", JSON.stringify(mergedData));
}

export const getTheme = () => {
  const stored = localStorage.getItem("vaxyp-theme");
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const saveTheme = (theme) => {
  localStorage.setItem("vaxyp-theme", theme);
};

const applyTheme = (theme) => {
  if (theme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
};

export const initTheme = () => {
  applyTheme(getTheme());

  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const currentTheme = document.body.classList.contains("dark")
        ? "dark"
        : "light";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      saveTheme(newTheme);
      applyTheme(newTheme);
    });
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("vaxyp-theme")) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
};

export function openNavMenu() {
  const toggleBtn = document.getElementById("nav-toggle");
  const navButtons = document.getElementById("navButtons");
  if (!toggleBtn || !navButtons) return;
  toggleBtn.classList.add("open");
  navButtons.classList.add("open");
  toggleBtn.setAttribute("aria-expanded", "true");
}

export function closeNavMenu() {
  const toggleBtn = document.getElementById("nav-toggle");
  const navButtons = document.getElementById("navButtons");
  if (!toggleBtn || !navButtons) return;
  toggleBtn.classList.remove("open");
  navButtons.classList.remove("open");
  toggleBtn.setAttribute("aria-expanded", "false");
}

export function initNavMenu() {
  const toggleBtn = document.getElementById("nav-toggle");
  const navButtons = document.getElementById("navButtons");
  if (!toggleBtn || !navButtons) return;

  toggleBtn.addEventListener("click", () => {
    if (navButtons.classList.contains("open")) {
      closeNavMenu();
    } else {
      openNavMenu();
    }
  });

  navButtons.addEventListener("click", (e) => {
    if (e.target.closest("a, button, p")) closeNavMenu();
  });

  document.addEventListener("click", (e) => {
    if (!navButtons.classList.contains("open")) return;
    // Tour popover/nav buttons live outside navButtons, so their clicks
    // would otherwise register as "outside clicks" and close the menu
    // mid-tour. Let tourGuide.js manage open/close during an active tour.
    if (document.body.classList.contains("driver-active")) return;
    if (e.target === toggleBtn || toggleBtn.contains(e.target)) return;
    if (navButtons.contains(e.target)) return;
    closeNavMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNavMenu();
  });
}

export function getPendingTour() {
  return sessionStorage.getItem("vaxyp-pending-tour");
}
export function setPendingTour(key) {
  sessionStorage.setItem("vaxyp-pending-tour", key);
}
export function clearPendingTour() {
  sessionStorage.removeItem("vaxyp-pending-tour");
}
