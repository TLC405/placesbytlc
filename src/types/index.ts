export interface PlaceItem {
  id: string;
  name: string;
  address: string;
  photo: string;
  rating?: number;
  userRatingsTotal?: number;
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
