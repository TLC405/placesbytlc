import { expect, test } from "bun:test";
import { resolveTheme } from "./themes";
test("Spooky is manual and persists without a calendar", () => {
  expect(resolveTheme("spooky", null, false)).toBe("spooky");
});
test("new visitors start in Love Letters", () => {
  expect(resolveTheme(null, null, false)).toBe("love-letters");
});
test("existing visitors retain the spooky upgrade", () => {
  expect(resolveTheme(null, null, true)).toBe("spooky");
});
test("legacy choices safely map to new visual worlds", () => {
  expect(resolveTheme(null, "romance", false)).toBe("love-letters");
  expect(resolveTheme(null, "cyberpunk", false)).toBe("midnight-cinema");
  expect(resolveTheme(null, "man-mode", false)).toBe("midnight-cinema");
  expect(resolveTheme(null, "nature", false)).toBe("garden-studio");
});
test("invalid choices fall back and manual selections win", () => {
  expect(resolveTheme("unknown", "nature", true)).toBe("love-letters");
  expect(resolveTheme("garden-studio", "cyberpunk", true)).toBe("garden-studio");
});