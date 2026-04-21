export type Archetype = "KING" | "WARRIOR" | "MAGICIAN" | "LOVER";

export interface ArchetypeQuestion {
  q: string;
  options: { t: string; k: Archetype }[];
}

export const archetypeQuestions: ArchetypeQuestion[] = [
  {
    q: "When the group has no plan, you...",
    options: [
      { t: "Set the vision and call the shot", k: "KING" },
      { t: "Pick a fight or push for action", k: "WARRIOR" },
      { t: "Read the room, propose the smartest move", k: "MAGICIAN" },
      { t: "Suggest something fun and people-focused", k: "LOVER" },
    ],
  },
  {
    q: "Your dating superpower is...",
    options: [
      { t: "Making her feel chosen and protected", k: "KING" },
      { t: "Decisiveness — I lead, she relaxes", k: "WARRIOR" },
      { t: "Asking questions no one's ever asked her", k: "MAGICIAN" },
      { t: "Pure presence and emotional connection", k: "LOVER" },
    ],
  },
  {
    q: "When she's stressed, your instinct is to...",
    options: [
      { t: "Hold space and remind her she's safe", k: "KING" },
      { t: "Solve the problem causing the stress", k: "WARRIOR" },
      { t: "Help her see the pattern underneath it", k: "MAGICIAN" },
      { t: "Hold her, slow it all down", k: "LOVER" },
    ],
  },
  {
    q: "Your weakness in relationships?",
    options: [
      { t: "Carrying too much without asking for help", k: "KING" },
      { t: "Going hard when softness was needed", k: "WARRIOR" },
      { t: "Overthinking instead of acting", k: "MAGICIAN" },
      { t: "Losing myself in her world", k: "LOVER" },
    ],
  },
  {
    q: "On a Saturday morning you'd rather...",
    options: [
      { t: "Plan the next 6 months of life", k: "KING" },
      { t: "Train, lift, run, build something", k: "WARRIOR" },
      { t: "Read, study, or learn a skill", k: "MAGICIAN" },
      { t: "Stay in bed, talk, eat slowly", k: "LOVER" },
    ],
  },
  {
    q: "How do you handle a fight?",
    options: [
      { t: "Stay calm, name what we both need", k: "KING" },
      { t: "Get loud, get it on the table, move on", k: "WARRIOR" },
      { t: "Slow down, ask what's really going on", k: "MAGICIAN" },
      { t: "Hurt easily, repair through closeness", k: "LOVER" },
    ],
  },
  {
    q: "Your idea of being a good man?",
    options: [
      { t: "Provide, lead, build a legacy", k: "KING" },
      { t: "Show up, fight for what matters", k: "WARRIOR" },
      { t: "Keep growing, keep learning, stay sharp", k: "MAGICIAN" },
      { t: "Love hard, feel deeply, connect honestly", k: "LOVER" },
    ],
  },
  {
    q: "What attracts you most in a partner?",
    options: [
      { t: "Loyalty and shared vision", k: "KING" },
      { t: "Strength, drive, won't back down", k: "WARRIOR" },
      { t: "Curiosity and depth", k: "MAGICIAN" },
      { t: "Warmth, beauty, emotional honesty", k: "LOVER" },
    ],
  },
];

export const archetypeLabels: Record<Archetype, string> = {
  KING: "The King",
  WARRIOR: "The Warrior",
  MAGICIAN: "The Magician",
  LOVER: "The Lover",
};

export const archetypeDescriptions: Record<Archetype, string> = {
  KING: "Grounded, decisive, generative. You lead with vision and create safety for those around you. Your shadow: rigidity or carrying it all alone.",
  WARRIOR: "Disciplined, loyal, action-oriented. You protect what matters and don't flinch under pressure. Your shadow: aggression or skipping the soft moments.",
  MAGICIAN: "Insightful, observant, strategic. You see patterns others miss and master your craft. Your shadow: overthinking or detachment.",
  LOVER: "Present, sensual, emotionally fluent. You feel deeply and connect easily. Your shadow: losing your edge or merging with her identity.",
};

export const archetypeDatingTips: Record<Archetype, string[]> = {
  KING: [
    "Lead the date — pick the spot, make the call",
    "Be generous with vision: 'Here's what I'm building'",
    "Ask for her input AFTER you've put a stake in the ground",
    "Watch the rigidity — let plans flex when she lights up about something",
  ],
  WARRIOR: [
    "Channel intensity into protective presence, not control",
    "Initiate the date, the kiss, the hard convo",
    "Slow it down 30% in conversation — she'll feel it",
    "Train your patience as hard as you train your body",
  ],
  MAGICIAN: [
    "Get out of your head and into your body",
    "Ask one fewer question, share one more story",
    "Pay attention to physical chemistry, not just mental",
    "Decide and DO — overthinking kills the spark",
  ],
  LOVER: [
    "Stay rooted in your own life — she fell for that man",
    "Beauty, food, music, touch — these are your weapons",
    "Practice the masculine 'no' — you don't owe agreement",
    "Let her chase a little — you've been giving 100%",
  ],
};
