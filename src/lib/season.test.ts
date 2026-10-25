import { describe, expect, test } from "bun:test";
import { isHalloweenSeason } from "./season";
import { validAge } from "./profile";

describe("Halloween only near Halloween", () => {
  test("starts October 15", () => {
    expect(isHalloweenSeason(new Date(2026, 9, 14, 23, 59))).toBe(false);
    expect(isHalloweenSeason(new Date(2026, 9, 15))).toBe(true);
  });
  test("ends after October 31", () => {
    expect(isHalloweenSeason(new Date(2026, 9, 31, 23, 59))).toBe(true);
    expect(isHalloweenSeason(new Date(2026, 10, 1))).toBe(false);
  });
  test("does not appear during other months or depend on the year", () => {
    expect(isHalloweenSeason(new Date(2027, 9, 25))).toBe(true);
    for (const month of [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11]) expect(isHalloweenSeason(new Date(2026, month, 25))).toBe(false);
  });
});
test("optional age accepts adults and rejects invalid values", () => {
  expect(validAge("")).toBe(true);
  expect(validAge("18")).toBe(true);
  expect(validAge("17")).toBe(false);
  expect(validAge("25.5")).toBe(false);
  expect(validAge("121")).toBe(false);
});