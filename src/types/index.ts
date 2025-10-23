export type Category = "food" | "activity" | "both";

export interface PlaceItem {
  id: string;
  name: string;
  address: string;
  photo: string;
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  openNow?: boolean;
  types?: string[];
  distance?: number;
  lat?: number;
  lng?: number;
  phone?: string;
  website?: string;
  category?: Category;
}

export interface LoveLanguageScores {
  WORDS: number;
  ACTS: number;
  GIFTS: number;
  TIME: number;
  TOUCH: number;
}

export interface MBTIScores {
  EI: number;
  SN: number;
  TF: number;
  JP: number;
}
