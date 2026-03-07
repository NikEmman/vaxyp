import { describe, it, expect } from "vitest";
import { applyAllGrammar } from "../grammar.js";

describe("applyAllGrammar", () => {
  it('applies male grammar rules when gender is "Άνδρας"', () => {
    const state = {
      ypoptosData: { sex: "Άνδρας" },
      victimData: { sex: "Άνδρας" },
    };
    applyAllGrammar(state);
    expect(state.oS).toBe("ο");
    expect(state.touS).toBe("του");
    expect(state.osS).toBe("ος");
  });

  it('applies female grammar rules when gender is "Γυναίκα"', () => {
    const state = {
      ypoptosData: { sex: "Γυναίκα" },
      victimData: { sex: "Γυναίκα" },
    };
    applyAllGrammar(state);
    expect(state.oV).toBe("η");
    expect(state.touV).toBe("της");
    expect(state.osV).toBe("η");
  });

  it("clears state when sex is undefined", () => {
    const state = {
      ypoptosData: { sex: undefined },
      victimData: { sex: undefined },
      oS: "old",
      touS: "old",
    };
    applyAllGrammar(state);
    expect(state.oS).toBe("");
    expect(state.touS).toBe("");
  });
});
