export interface MBTIQuestion {
  k: "EI" | "SN" | "TF" | "JP";
  dir: 1 | -1;
  t: string;
}

export const mbtiQuestions: MBTIQuestion[] = [
  // E/I — how you recharge & date energy
  { k: "EI", dir: 1, t: "On dates, I feel energized by lively places and spontaneous plans." },
  { k: "EI", dir: -1, t: "On dates, I prefer quiet spaces and depth over crowd energy." },
  { k: "EI", dir: 1, t: "I speak my thoughts easily; silence feels awkward to me." },
  { k: "EI", dir: -1, t: "I warm up slowly; I enjoy comfortable silences." },
  // S/N — info preference
  { k: "SN", dir: 1, t: "I like concrete details: menus, logistics, and what's practical." },
  { k: "SN", dir: -1, t: "I chase themes and ideas: symbolism, future dreams, meaning." },
  { k: "SN", dir: 1, t: "I notice facts and small physical details on dates." },
  { k: "SN", dir: -1, t: "I connect dots and imagine possibilities more than details." },
  // T/F — decision in relationships
  { k: "TF", dir: 1, t: "I value fairness and consistency over 'vibes' when resolving issues." },
  { k: "TF", dir: -1, t: "I prioritize feelings and harmony over strict logic in tough calls." },
  { k: "TF", dir: 1, t: "Direct feedback is caring, even if blunt." },
  { k: "TF", dir: -1, t: "Tone matters more than being technically right." },
  // J/P — structure vs spontaneity
  { k: "JP", dir: 1, t: "I prefer a plan with times and backups." },
  { k: "JP", dir: -1, t: "I prefer to 'see how it flows' and keep plans flexible." },
  { k: "JP", dir: 1, t: "I feel best when commitments are clear and scheduled." },
  { k: "JP", dir: -1, t: "I feel best when we can pivot and play it by ear." },
];

interface TypeTraits {
  pros: string[];
  cons: string[];
  ideas: string[];
}

const typeTraits: Record<string, TypeTraits> = {
  E: {
    pros: ["Brings energy and momentum", "Easily breaks the ice"],
    cons: ["May overbook the night", "Can talk over quiet partners"],
    ideas: ["Trivia night or live music", "Group class then dessert"],
  },
  I: {
    pros: ["Deep listener", "Creates cozy intimacy"],
    cons: ["May under‑suggest activities", "Energy dips if overstimulated"],
    ideas: ["Quiet cafe + bookshop", "Stargazing with cocoa"],
  },
  S: {
    pros: ["Grounded, reliable plans", "Notices practical needs"],
    cons: ["Can miss novelty", "Over‑optimize logistics"],
    ideas: ["Cooking class with step-by-step", "Museum with audio tour"],
  },
  N: {
    pros: ["Imaginative and future‑oriented", "Great at meaningful talk"],
    cons: ["Can drift from details", "Plans may be vague"],
    ideas: ["Creative workshop", "Theme night with costumes"],
  },
  T: {
    pros: ["Direct and honest", "Great problem‑solver"],
    cons: ["Tone may feel blunt", "Feels 'cold' under stress"],
    ideas: ["Escape room challenge", "Strategy board games"],
  },
  F: {
    pros: ["Empathic and caring", "Creates harmony"],
    cons: ["Avoids conflict too long", "Decision fatigue"],
    ideas: ["Volunteer date", "Cozy dinner + gratitude notes"],
  },
  J: {
    pros: ["Organized and dependable", "Follows through"],
    cons: ["Rigidity if plans change", "Over‑schedule"],
    ideas: ["Itinerary with surprise buffer", "Matinee + planned walk"],
  },
  P: {
    pros: ["Flexible and playful", "Great with serendipity"],
    cons: ["Last‑minute chaos", "Hard to commit"],
    ideas: ["Food truck hop", "Neighborhood art crawl"],
  },
};

export const getMBTITraits = (type: string): TypeTraits => {
  const parts = [typeTraits[type[0]], typeTraits[type[1]], typeTraits[type[2]], typeTraits[type[3]]];
  return {
    pros: [...new Set(parts.flatMap((x) => x.pros))],
    cons: [...new Set(parts.flatMap((x) => x.cons))],
    ideas: [...new Set(parts.flatMap((x) => x.ideas))].slice(0, 6),
  };
};
