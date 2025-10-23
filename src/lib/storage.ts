import { PlaceItem, LoveLanguageScores, MBTIScores } from "@/types";

const PLAN_KEY = "tlc_plan";
const LOVE_SCORES_KEY = "love_scores";
const MBTI_SCORES_KEY = "mbti_scores";
const GMAPS_KEY = "gmaps";

export const storage = {
  // Plan management
  getPlan: (): PlaceItem[] => {
    try {
      const data = localStorage.getItem(PLAN_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  savePlan: (plan: PlaceItem[]) => {
    localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  },

  addToPlan: (item: PlaceItem) => {
    const plan = storage.getPlan();
    plan.push(item);
    storage.savePlan(plan);
  },

  removeFromPlan: (index: number) => {
    const plan = storage.getPlan();
    plan.splice(index, 1);
    storage.savePlan(plan);
  },

  clearPlan: () => {
    localStorage.setItem(PLAN_KEY, "[]");
  },

  // Love language scores
  getLoveScores: (): LoveLanguageScores | null => {
    try {
      const data = localStorage.getItem(LOVE_SCORES_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveLoveScores: (scores: LoveLanguageScores) => {
    localStorage.setItem(LOVE_SCORES_KEY, JSON.stringify(scores));
  },

  // MBTI scores
  getMBTIScores: (): MBTIScores | null => {
    try {
      const data = localStorage.getItem(MBTI_SCORES_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveMBTIScores: (scores: MBTIScores) => {
    localStorage.setItem(MBTI_SCORES_KEY, JSON.stringify(scores));
  },

  // API key
  getAPIKey: (): string => {
    return localStorage.getItem(GMAPS_KEY) || "";
  },

  saveAPIKey: (key: string) => {
    localStorage.setItem(GMAPS_KEY, key);
  },
};
