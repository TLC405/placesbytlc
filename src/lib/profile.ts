export const PROFILE_KEY = "deeper_profile_v1";
export const INTAKE_KEY = "deeper_intake_done_v1";
export interface LocalProfile {
  name: string;
  age: string;
  gender: string;
  relationship: string;
  goal: string;
}
export const EMPTY_PROFILE: LocalProfile = { name: "", age: "", gender: "", relationship: "", goal: "" };
export function readProfile(): LocalProfile {
  try {
    const value = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
    if (!value || typeof value !== "object") return { ...EMPTY_PROFILE };
    return Object.fromEntries(Object.keys(EMPTY_PROFILE).map(key => [key, typeof value[key] === "string" ? value[key] : ""])) as unknown as LocalProfile;
  } catch { return { ...EMPTY_PROFILE }; }
}
export function validAge(age: string): boolean {
  return age === "" || (/^\d+$/.test(age) && Number(age) >= 18 && Number(age) <= 120);
}