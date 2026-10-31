export type ThemeType = "spooky" | "love-letters" | "midnight-cinema" | "garden-studio";
export const THEME_KEY = "nt_theme_v1";
export const THEME_NAMES: Record<ThemeType, string> = {
  spooky: "Spooky",
  "love-letters": "Love Letters",
  "midnight-cinema": "Midnight Cinema",
  "garden-studio": "Garden Studio",
};
export function isTheme(value: unknown): value is ThemeType {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(THEME_NAMES, value);
}
export function resolveTheme(saved: string | null, legacy: string | null, returningVisitor: boolean): ThemeType {
  if (isTheme(saved)) return saved;
  if (saved !== null) return "love-letters";
  const legacyMap: Record<string, ThemeType> = { romance: "love-letters", "man-mode": "midnight-cinema", cyberpunk: "midnight-cinema", nature: "garden-studio" };
  if (legacy && Object.prototype.hasOwnProperty.call(legacyMap, legacy)) return legacyMap[legacy];
  return returningVisitor ? "spooky" : "love-letters";
}
export function getSavedTheme(): ThemeType {
  try { return resolveTheme(localStorage.getItem(THEME_KEY), localStorage.getItem("tlc_theme"), localStorage.getItem("deeper_intake_done_v1") === "true"); }
  catch { return "love-letters"; }
}
export function initializeAppearance() {
  const theme = getSavedTheme();
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.removeAttribute("data-season");
  document.documentElement.classList.remove("dark");
}