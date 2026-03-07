import { describe, it, expect } from "vitest";
import {
  roundDownMinutes,
  formatTime,
  getNextDay,
  capitalize,
  shortenFormattedPerson,
  shortenFormattedOfficer,
  getOfficerSurname,
  getSuspectSurname,
} from "../formatters.js";

describe("roundDownMinutes", () => {
  it("rounds down to nearest downwards multiple of 5", () => {
    expect(roundDownMinutes(39)).toBe(35);
    expect(roundDownMinutes(41)).toBe(40);
    expect(roundDownMinutes(0)).toBe(0);
    expect(roundDownMinutes(5)).toBe(5);
    expect(roundDownMinutes(59)).toBe(55);
  });
});

describe("formatTime", () => {
  it("formats time correctly", () => {
    const date = new Date("2024-01-15T14:35:00");
    expect(formatTime(date)).toBe("14:35");
  });

  it("adds extra time", () => {
    const date = new Date("2024-01-15T14:00:00");
    expect(formatTime(date, 30)).toBe("14:30");
  });

  it("handles midnight wraparound", () => {
    const date = new Date("2024-01-15T23:55:00");
    expect(formatTime(date, 10)).toBe("00:05");
  });

  it("rounds down minutes", () => {
    const date = new Date("2024-01-15T14:37:00");
    expect(formatTime(date)).toBe("14:35");
  });
});

describe("getNextDay", () => {
  it("returns next day correctly", () => {
    expect(getNextDay("15-01-2024")).toBe("16-01-2024");
    expect(getNextDay("31-01-2024")).toBe("01-02-2024");
    expect(getNextDay("28-02-2024")).toBe("29-02-2024");
    expect(getNextDay("31-12-2024")).toBe("01-01-2025");
  });
});

describe("capitalize", () => {
  it("capitalizes first letter of each word", () => {
    expect(capitalize("αλεξανδρος")).toBe("Αλεξανδρος");
    expect(capitalize("αλεξανδρος παπαδοπουλος")).toBe(
      "Αλεξανδρος Παπαδοπουλος",
    );
  });

  it("handles empty string", () => {
    expect(capitalize("")).toBe("");
  });

  it("handles single word", () => {
    expect(capitalize("γιωργος")).toBe("Γιωργος");
  });
});

describe("shortenFormattedPerson", () => {
  it("removes everything after Α.Φ.Μ", () => {
    const input =
      "Γεωργιος Παπαδοπουλος, με Α.Φ.Μ. 123456789, Δ.Ο.Υ. Αλεξανδρουπολης";
    expect(shortenFormattedPerson(input)).toBe("Γεωργιος Παπαδοπουλος");
  });

  it("returns same string if no Α.Φ.Μ", () => {
    const input = "Γεωργιος Παπαδοπουλος";
    expect(shortenFormattedPerson(input)).toBe("Γεωργιος Παπαδοπουλος");
  });
});

describe("shortenFormattedOfficer", () => {
  it("returns first 3 elements", () => {
    const input =
      "Αστυφύλακας Παπαδόπουλος Ιωάννης, υπηρετών στο Τ.Α. Κομοτηνής";
    expect(shortenFormattedOfficer(input)).toBe(
      "Αστυφύλακας Παπαδόπουλος Ιωάννης",
    );
  });
});

describe("getOfficerSurname", () => {
  it("returns second word", () => {
    expect(getOfficerSurname("Αστυφύλακας Παπαδόπουλος Ιωάννης")).toBe(
      "Παπαδόπουλος",
    );
  });
});

describe("getSuspectSurname", () => {
  it("returns first word", () => {
    expect(getSuspectSurname("Παπαδόπουλος Ιωάννης")).toBe("Παπαδόπουλος");
  });
});
