import { PlaceItem, LoveLanguageScores, MBTIScores } from "@/types";

const PLAN_KEY = "tlc_plan";
const FAVORITES_KEY = "tlc_favorites";
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

  // Favorites management
  getFavorites: (): PlaceItem[] => {
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveFavorites: (favorites: PlaceItem[]) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  },

  addToFavorites: (item: PlaceItem) => {
    const favorites = storage.getFavorites();
    if (!favorites.some(f => f.id === item.id)) {
      favorites.push(item);
      storage.saveFavorites(favorites);
      return true;
    }
    return false;
  },

  removeFromFavorites: (id: string) => {
    const favorites = storage.getFavorites();
    const filtered = favorites.filter(f => f.id !== id);
    storage.saveFavorites(filtered);
  },

  isFavorite: (id: string): boolean => {
    return storage.getFavorites().some(f => f.id === id);
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
