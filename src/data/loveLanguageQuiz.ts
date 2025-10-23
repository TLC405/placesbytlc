export interface LoveLanguagePair {
  a: { t: string; k: "WORDS" | "ACTS" | "GIFTS" | "TIME" | "TOUCH" };
  b: { t: string; k: "WORDS" | "ACTS" | "GIFTS" | "TIME" | "TOUCH" };
}

export const loveLanguagePairs: LoveLanguagePair[] = [
  { a: { t: "I receive a sincere compliment.", k: "WORDS" }, b: { t: "My partner helps me finish a task.", k: "ACTS" } },
  { a: { t: "We spend uninterrupted time together.", k: "TIME" }, b: { t: "I get a thoughtful small surprise.", k: "GIFTS" } },
  { a: { t: "We hold hands while walking.", k: "TOUCH" }, b: { t: "They tell me why they appreciate me.", k: "WORDS" } },
  { a: { t: "They fix something I've been putting off.", k: "ACTS" }, b: { t: "We plan a quiet evening, phones away.", k: "TIME" } },
  { a: { t: "They bring my favorite snack just because.", k: "GIFTS" }, b: { t: "A long hug when I need it.", k: "TOUCH" } },
  { a: { t: "They write a short note to encourage me.", k: "WORDS" }, b: { t: "They take over a chore so I can rest.", k: "ACTS" } },
  { a: { t: "A weekend morning together with no agenda.", k: "TIME" }, b: { t: "A keepsake that shows they listen.", k: "GIFTS" } },
  { a: { t: "Cuddle on the couch.", k: "TOUCH" }, b: { t: "They brag about me in front of others.", k: "WORDS" } },
  { a: { t: "They prep my car/gear before our outing.", k: "ACTS" }, b: { t: "We take a long walk and talk.", k: "TIME" } },
  { a: { t: "Custom gift tied to an inside joke.", k: "GIFTS" }, b: { t: "A back rub after a long day.", k: "TOUCH" } },
  { a: { t: "They text me a kind message midday.", k: "WORDS" }, b: { t: "They run an errand I dislike.", k: "ACTS" } },
  { a: { t: "We cook dinner together.", k: "TIME" }, b: { t: "They bring coffee exactly how I like it.", k: "GIFTS" } },
  { a: { t: "They reach for my hand in public.", k: "TOUCH" }, b: { t: "They say what they love about me.", k: "WORDS" } },
  { a: { t: "They set up appointments I've avoided.", k: "ACTS" }, b: { t: "A full afternoon together, undistracted.", k: "TIME" } },
  { a: { t: "A souvenir from a place we mentioned.", k: "GIFTS" }, b: { t: "Lingering kiss at the door.", k: "TOUCH" } },
];

export const loveLanguageLabels: Record<string, string> = {
  WORDS: "Words of Affirmation",
  ACTS: "Acts of Service",
  GIFTS: "Gifts",
  TIME: "Quality Time",
  TOUCH: "Physical Touch",
};

export const loveLanguageIdeas: Record<string, string[]> = {
  WORDS: [
    "Write each other 3 gratitude notes and read them over dessert",
    "Record a short voice memo hyping each other before the date",
  ],
  ACTS: [
    "Prep a picnic where one cooks, the other handles setup/cleanup",
    "Do a tiny home‑improvement task together, then celebrate out",
  ],
  GIFTS: [
    "$15 surprise‑swap at a thrift/indie shop",
    "Create a memory box with small mementos from the night",
  ],
  TIME: [
    "Long walk + no phones + a weird question deck",
    "Board‑game cafe or bookstore crawl with hot drinks",
  ],
  TOUCH: [
    "Partner stretch or dance class",
    "Drive‑in movie with blankets and shared snacks",
  ],
};
