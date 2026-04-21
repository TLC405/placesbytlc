export type CompatDimension = "COMM" | "CONFLICT" | "INTIMACY" | "VALUES" | "GROWTH";

export interface CompatQuestion {
  q: string;
  options: { t: string; k: CompatDimension; weight: number }[];
}

export const compatibilityQuestions: CompatQuestion[] = [
  {
    q: "When something feels off in the relationship, you usually...",
    options: [
      { t: "Bring it up calmly within 24 hours", k: "COMM", weight: 3 },
      { t: "Wait to see if it resolves itself", k: "COMM", weight: 1 },
      { t: "Process it alone first, then talk", k: "COMM", weight: 2 },
      { t: "Address it immediately, even if heated", k: "CONFLICT", weight: 2 },
    ],
  },
  {
    q: "Your ideal Friday night together looks like...",
    options: [
      { t: "Deep conversation over a slow dinner", k: "INTIMACY", weight: 3 },
      { t: "An adventure you've never done before", k: "GROWTH", weight: 3 },
      { t: "Cozy on the couch, no plans", k: "INTIMACY", weight: 2 },
      { t: "Out with mutual friends", k: "VALUES", weight: 2 },
    ],
  },
  {
    q: "When you disagree about money, you...",
    options: [
      { t: "Make a shared plan and stick to it", k: "VALUES", weight: 3 },
      { t: "Each handle our own and split big stuff", k: "VALUES", weight: 2 },
      { t: "Talk through priorities together", k: "COMM", weight: 3 },
      { t: "Avoid the topic until it's urgent", k: "CONFLICT", weight: 1 },
    ],
  },
  {
    q: "Physical affection in your relationship is...",
    options: [
      { t: "Constant — touch is our love language", k: "INTIMACY", weight: 3 },
      { t: "Meaningful but reserved for private moments", k: "INTIMACY", weight: 2 },
      { t: "Tied to mood and energy", k: "INTIMACY", weight: 1 },
      { t: "Less important than emotional closeness", k: "COMM", weight: 2 },
    ],
  },
  {
    q: "When your partner achieves something big, you...",
    options: [
      { t: "Plan a celebration immediately", k: "INTIMACY", weight: 3 },
      { t: "Tell everyone how proud you are", k: "COMM", weight: 2 },
      { t: "Ask them what they want next", k: "GROWTH", weight: 3 },
      { t: "Quietly support and stay in their corner", k: "VALUES", weight: 2 },
    ],
  },
  {
    q: "Your view on personal growth in the relationship?",
    options: [
      { t: "We push each other to evolve constantly", k: "GROWTH", weight: 3 },
      { t: "We grow naturally side-by-side", k: "GROWTH", weight: 2 },
      { t: "Stability matters more than change", k: "VALUES", weight: 2 },
      { t: "We respect each other's individual paths", k: "VALUES", weight: 3 },
    ],
  },
  {
    q: "After a fight, repair looks like...",
    options: [
      { t: "Talking it through until we both understand", k: "CONFLICT", weight: 3 },
      { t: "A genuine apology and physical affection", k: "INTIMACY", weight: 2 },
      { t: "Time apart, then a fresh start", k: "CONFLICT", weight: 2 },
      { t: "Naming what we'll each do differently", k: "GROWTH", weight: 3 },
    ],
  },
  {
    q: "Your shared vision of the future...",
    options: [
      { t: "Crystal clear and we revisit it often", k: "VALUES", weight: 3 },
      { t: "We have the big things aligned", k: "VALUES", weight: 2 },
      { t: "Open-ended — we figure it out together", k: "GROWTH", weight: 2 },
      { t: "We're still discovering it", k: "COMM", weight: 1 },
    ],
  },
  {
    q: "When stressed, you most need your partner to...",
    options: [
      { t: "Listen without trying to fix it", k: "COMM", weight: 3 },
      { t: "Hold me close and be present", k: "INTIMACY", weight: 3 },
      { t: "Help me solve the problem", k: "CONFLICT", weight: 2 },
      { t: "Give me space to recharge", k: "VALUES", weight: 2 },
    ],
  },
  {
    q: "Trust in your relationship is built by...",
    options: [
      { t: "Consistent small actions over time", k: "VALUES", weight: 3 },
      { t: "Radical honesty, even when it's hard", k: "COMM", weight: 3 },
      { t: "Showing up during the hardest moments", k: "CONFLICT", weight: 2 },
      { t: "Shared experiences and memories", k: "INTIMACY", weight: 2 },
    ],
  },
];

export const compatLabels: Record<CompatDimension, string> = {
  COMM: "Communication",
  CONFLICT: "Conflict Repair",
  INTIMACY: "Intimacy & Closeness",
  VALUES: "Shared Values",
  GROWTH: "Growth Mindset",
};

export const compatDescriptions: Record<CompatDimension, string> = {
  COMM: "You prioritize open, honest dialogue. Strongest with partners who match your verbal processing style.",
  CONFLICT: "You navigate disagreements head-on. Best paired with someone who can stay regulated under pressure.",
  INTIMACY: "Emotional and physical closeness fuel your bond. Thrive with partners who reciprocate vulnerability.",
  VALUES: "Aligned principles anchor your love. Compatibility soars when life visions overlap.",
  GROWTH: "You see relationships as evolving. Best with partners who embrace change and self-development.",
};

export const compatRecommendations: Record<CompatDimension, string[]> = {
  COMM: [
    "Try a weekly 20-minute 'state of us' check-in",
    "Use 'I feel ___ when ___' statements during tough talks",
    "Read 'Hold Me Tight' by Sue Johnson together",
  ],
  CONFLICT: [
    "Agree on a timeout signal when things escalate",
    "Practice the Gottman repair attempt phrases",
    "Revisit unresolved fights within 48 hours",
  ],
  INTIMACY: [
    "Schedule a phone-free date night every week",
    "Try the 36 Questions to Fall in Love exercise",
    "Build in daily 6-second kisses and 20-second hugs",
  ],
  VALUES: [
    "Map out your top 5 life values together",
    "Plan a 5-year vision board date",
    "Discuss money, family, and lifestyle quarterly",
  ],
  GROWTH: [
    "Take on a new hobby together every season",
    "Read the same book and discuss weekly",
    "Set joint and individual goals each quarter",
  ],
};
