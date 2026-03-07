import { describe, it, expect, beforeEach, vi } from "vitest";
import { JSDOM } from "jsdom";
import * as fs from "fs";
import * as path from "path";
import { buildFormData } from "../form/userDataScript.js";

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

beforeEach(async () => {
  store = {};

  const htmlPath = path.resolve("form/index.html");
  const html = fs.readFileSync(htmlPath, "utf-8");
  const dom = new JSDOM(html);

  globalThis.document = dom.window.document;
  globalThis.window = dom.window;
  globalThis.localStorage = localStorageMock;
  globalThis.matchMedia = vi.fn((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  const { default: init } = await import("../form/userDataScript.js");

  dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));
});

describe("buildFormData", () => {
  it("returns all form fields", () => {
    document.getElementById("ypiresia").value = "Test Department";
    document.getElementById("dAstynomias").value = "Test Police";
    document.getElementById("doy").value = "Test DOY";

    const result = buildFormData();

    expect(result.ypiresia).toBeDefined();
    expect(result.dAstynomias).toBeDefined();
    expect(result.doy).toBeDefined();
    expect(result.anakritikoi).toBeDefined();
    expect(result.anakritikoiEnikos).toBeDefined();
    expect(result.anakrSex).toBeDefined();
    expect(result.geniki).toBeDefined();
    expect(result.iatro).toBeDefined();
    expect(result.arthro).toBeDefined();
    expect(result.merosSyntaksisEkthesis).toBeDefined();
    expect(result.xronosPeratosis).toBeDefined();
    expect(result.eisaggeleiaProtodikon).toBeDefined();
    expect(result.dieuthynsiYpiresias).toBeDefined();
    expect(result.tilefono).toBeDefined();
    expect(result.email).toBeDefined();
    expect(result.amy).toBeDefined();
  });

  it("uppercases ypiresia, dAstynomias, geniki, iatro", () => {
    document.getElementById("ypiresia").value = "lowercase";
    document.getElementById("dAstynomias").value = "lowercase";
    document.getElementById("geniki").value = "lowercase";
    document.getElementById("iatro").value = "lowercase";

    const result = buildFormData();

    expect(result.ypiresia).toBe("LOWERCASE");
    expect(result.dAstynomias).toBe("LOWERCASE");
    expect(result.geniki).toBe("LOWERCASE");
    expect(result.iatro).toBe("LOWERCASE");
  });

  it("handles empty fields with null", () => {
    const result = buildFormData();

    expect(result.ypiresia).toBe("");
    expect(result.dAstynomias).toBe("");
    expect(result.geniki).toBe("");
    expect(result.iatro).toBe("");
  });

  it("handles NaN for xronosPeratosis", () => {
    document.getElementById("xronosPeratosis").value = "";

    const result = buildFormData();

    expect(result.xronosPeratosis).toBe(0);
  });

  it("handles numeric xronosPeratosis", () => {
    document.getElementById("xronosPeratosis").value = "15";

    const result = buildFormData();

    expect(result.xronosPeratosis).toBe(15);
  });

  it("preserves astynomikoi from localStorage", () => {
    store["dataObject"] = JSON.stringify({
      astynomikoi: ["Officer 1", "Officer 2"],
    });

    const result = buildFormData();

    expect(result.astynomikoi).toEqual(["Officer 1", "Officer 2"]);
  });

  it("returns empty array for astynomikoi when not in localStorage", () => {
    const result = buildFormData();

    expect(result.astynomikoi).toEqual([]);
  });

  it("gets anakritikoi arrays via formData.getAll", () => {
    const container = document.getElementById("anakritikoiList");
    const row = container.querySelector(".anakritikoi-row");
    row.querySelector("input[name='anakritikoi[]']").value = "Test Investigator";
    row.querySelector("input[name='anakritikoiEnikos[]']").value = "Test Inv Enikos";
    row.querySelector("select[name='anakrSex[]']").value = "Άντρας";

    const result = buildFormData();

    expect(result.anakritikoi).toContain("Test Investigator");
    expect(result.anakritikoiEnikos).toContain("Test Inv Enikos");
    expect(result.anakrSex).toContain("Άντρας");
  });
});


