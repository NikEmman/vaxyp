import { describe, it, expect, beforeEach } from "vitest";
import {
  getData,
  getAnakritikoiSelection,
  getState,
  saveData,
  getTheme,
  saveTheme,
} from "../stateManager.js";

let store = {};
const localStorageMock = {
  getItem: (key) => store[key] || null,
  setItem: (key, value) => {
    store[key] = value;
  },
  clear: () => {
    store = {};
  },
  get length() {
    return Object.keys(store).length;
  },
  key: (i) => Object.keys(store)[i] || null,
};
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

beforeEach(() => {
  store = {};
});

describe("saveTheme", () => {
  it("saves theme to localStorage", () => {
    saveTheme("dark");
    expect(localStorage.getItem("vaxyp-theme")).toBe("dark");
  });

  it("saves light theme", () => {
    saveTheme("light");
    expect(localStorage.getItem("vaxyp-theme")).toBe("light");
  });
});

describe("getTheme", () => {
  it("returns stored theme when present", () => {
    store["vaxyp-theme"] = "dark";
    expect(getTheme()).toBe("dark");
  });

  it("returns stored theme as light", () => {
    store["vaxyp-theme"] = "light";
    expect(getTheme()).toBe("light");
  });
});

describe("getData", () => {
  it("returns default data when localStorage is empty", () => {
    const data = getData();
    expect(data.anakritikoi).toBeDefined();
    expect(data.ypiresia).toBeDefined();
  });

  it("returns stored data when present", () => {
    const customData = { ypiresia: "Custom Department", doy: "Custom DOY" };
    store["dataObject"] = JSON.stringify(customData);
    const data = getData();
    expect(data.ypiresia).toBe("Custom Department");
    expect(data.doy).toBe("Custom DOY");
  });
});

describe("getAnakritikoiSelection", () => {
  it("returns default selection when localStorage is empty", () => {
    const selection = getAnakritikoiSelection();
    expect(selection).toEqual({ aAnakr: 0, bAnakr: 1 });
  });

  it("returns stored selection when present", () => {
    store["anakr"] = JSON.stringify({ aAnakr: 2, bAnakr: 3 });
    const selection = getAnakritikoiSelection();
    expect(selection).toEqual({ aAnakr: 2, bAnakr: 3 });
  });
});

describe("saveData", () => {
  it("merges currentData with newObject", () => {
    const currentData = { name: "John", age: 30 };
    const newObject = { age: 31, city: "Athens" };
    saveData(currentData, newObject);
    const stored = JSON.parse(store["dataObject"]);
    expect(stored.name).toBe("John");
    expect(stored.age).toBe(31);
    expect(stored.city).toBe("Athens");
  });

  it("saves to localStorage", () => {
    saveData({}, { test: "value" });
    expect(store["dataObject"]).toBe(JSON.stringify({ test: "value" }));
  });
});

describe("getState", () => {
  it("formats date as DD-MM-YYYY", () => {
    const todayDate = new Date("2024-03-15");
    const state = getState({}, todayDate);
    expect(state.formattedDate).toBe("15-03-2024");
  });

  it("sets day name from days array", () => {
    const fridayDate = new Date("2024-03-15");
    const state = getState({}, fridayDate);
    expect(state.dayName).toBe("Παρασκευή");
  });

  it("sets month from months array", () => {
    const februaryDate = new Date("2024-02-15");
    const state = getState({}, februaryDate);
    expect(state.month).toBe("Φεβρουαρίου");
  });

  it("sets year correctly", () => {
    const date = new Date("2024-06-20");
    const state = getState({}, date);
    expect(state.year).toBe(2024);
  });

  it("sets day correctly", () => {
    const date = new Date("2024-06-20");
    const state = getState({}, date);
    expect(state.day).toBe(20);
  });

  it("defaults sex to Άντρας when not provided", () => {
    const state = getState({}, new Date());
    expect(state.aAnakrSex).toBe("Άντρας");
    expect(state.bAnakrSex).toBe("Άντρας");
  });

  it("uses stored sex values when provided", () => {
    const localData = {
      anakritikoi: ["A", "B"],
      anakritikoiEnikos: ["A", "B"],
      anakrSex: ["Γυναίκα", "Άνδρας"],
    };
    store["anakr"] = JSON.stringify({ aAnakr: 0, bAnakr: 1 });
    const state = getState(localData, new Date());
    expect(state.aAnakrSex).toBe("Γυναίκα");
    expect(state.bAnakrSex).toBe("Άνδρας");
  });

  it("merges localData into state", () => {
    const localData = { customField: "customValue", ypiresia: "Test Dept" };
    const state = getState(localData, new Date());
    expect(state.customField).toBe("customValue");
    expect(state.ypiresia).toBe("Test Dept");
  });

  it("initializes default fields", () => {
    const state = getState({}, new Date());
    expect(state.victim).toBe("");
    expect(state.suspect).toBe("");
    expect(state.vehicle).toBe("");
    expect(state.victimData).toEqual({});
    expect(state.ypoptosData).toEqual({});
    expect(state.timePassed).toBe(0);
    expect(state.astynomikos).toBeDefined();
  });
});
