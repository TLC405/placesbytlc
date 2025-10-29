export interface RelationshipStylePair {
  a: { t: string; k: "ADVENTURER" | "NURTURER" | "INTELLECTUAL" | "ROMANTIC" | "PRAGMATIC" };
  b: { t: string; k: "ADVENTURER" | "NURTURER" | "INTELLECTUAL" | "ROMANTIC" | "PRAGMATIC" };
}

export const relationshipStylePairs: RelationshipStylePair[] = [
  { a: { t: "I prefer spontaneous weekend adventures", k: "ADVENTURER" }, b: { t: "I enjoy cozy nights planning our future", k: "NURTURER" } },
  { a: { t: "Deep philosophical conversations excite me", k: "INTELLECTUAL" }, b: { t: "Candlelit dinners and love notes thrill me", k: "ROMANTIC" } },
  { a: { t: "I value practical solutions to problems", k: "PRAGMATIC" }, b: { t: "I love trying extreme activities together", k: "ADVENTURER" } },
  { a: { t: "Taking care of my partner's needs comes first", k: "NURTURER" }, b: { t: "Debating ideas together energizes me", k: "INTELLECTUAL" } },
  { a: { t: "Grand romantic gestures make my heart race", k: "ROMANTIC" }, b: { t: "Creating stable routines brings me peace", k: "PRAGMATIC" } },
  { a: { t: "Road trips with no fixed destination", k: "ADVENTURER" }, b: { t: "Cooking comfort food for my partner", k: "NURTURER" } },
  { a: { t: "Attending lectures or museums together", k: "INTELLECTUAL" }, b: { t: "Surprise love letters and poetry", k: "ROMANTIC" } },
  { a: { t: "Budgeting and planning finances as a team", k: "PRAGMATIC" }, b: { t: "Skydiving or bungee jumping together", k: "ADVENTURER" } },
  { a: { t: "Listening and offering emotional support", k: "NURTURER" }, b: { t: "Reading and discussing books together", k: "INTELLECTUAL" } },
  { a: { t: "Recreating our first date anniversary", k: "ROMANTIC" }, b: { t: "Fixing household issues efficiently", k: "PRAGMATIC" } },
  { a: { t: "Backpacking through foreign countries", k: "ADVENTURER" }, b: { t: "Creating a warm, welcoming home", k: "NURTURER" } },
  { a: { t: "Learning new skills together", k: "INTELLECTUAL" }, b: { t: "Stargazing and sharing dreams", k: "ROMANTIC" } },
  { a: { t: "Meal planning and grocery shopping", k: "PRAGMATIC" }, b: { t: "Trying extreme sports or thrilling activities", k: "ADVENTURER" } },
  { a: { t: "Anticipating needs before being asked", k: "NURTURER" }, b: { t: "Solving puzzles or strategy games", k: "INTELLECTUAL" } },
  { a: { t: "Dancing in the rain together", k: "ROMANTIC" }, b: { t: "Setting and achieving relationship goals", k: "PRAGMATIC" } },
];

export const relationshipStyleLabels: Record<string, string> = {
  ADVENTURER: "The Adventurer",
  NURTURER: "The Nurturer",
  INTELLECTUAL: "The Intellectual",
  ROMANTIC: "The Romantic",
  PRAGMATIC: "The Pragmatic",
};

export const relationshipStyleDescriptions: Record<string, string> = {
  ADVENTURER: "You thrive on spontaneity, new experiences, and pushing boundaries together. Your relationship is fueled by excitement and shared adventures.",
  NURTURER: "You express love through care, support, and creating emotional safety. You find joy in making your partner's life comfortable and happy.",
  INTELLECTUAL: "You connect through ideas, learning, and deep conversations. Mental stimulation and growth together are what keep your relationship vibrant.",
  ROMANTIC: "You believe in grand gestures, emotional expressions, and keeping the spark alive. Love is an art form you actively cultivate.",
  PRAGMATIC: "You show love through practical actions, stability, and building a secure future together. Reliability and teamwork define your relationship.",
};

export const relationshipStyleIdeas: Record<string, string[]> = {
  ADVENTURER: [
    "Try a new extreme sport together",
    "Spontaneous road trip to an unexplored place",
    "Escape room or adventure park challenge",
  ],
  NURTURER: [
    "Cook a comfort meal together and share stories",
    "Create a cozy movie marathon with homemade treats",
    "Volunteer together at a local charity",
  ],
  INTELLECTUAL: [
    "Attend a workshop or lecture on a new topic",
    "Start a book club for two",
    "Visit a museum and discuss the exhibits",
  ],
  ROMANTIC: [
    "Recreate your first date with added romantic touches",
    "Write love letters and read them by candlelight",
    "Sunset picnic at a scenic location",
  ],
  PRAGMATIC: [
    "Plan next year's goals together over dinner",
    "DIY home improvement project as a team",
    "Organize a budget-friendly but special date",
  ],
};
