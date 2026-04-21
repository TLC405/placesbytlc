export interface ConfidenceQuestion {
  q: string;
  options: { t: string; score: number }[];
}

export const confidenceQuestions: ConfidenceQuestion[] = [
  {
    q: "You see someone you're attracted to in public. You...",
    options: [
      { t: "Walk over and start a conversation", score: 4 },
      { t: "Make eye contact, smile, see what happens", score: 3 },
      { t: "Notice them, do nothing", score: 2 },
      { t: "Avoid eye contact entirely", score: 1 },
    ],
  },
  {
    q: "She's quieter than usual on the date. You...",
    options: [
      { t: "Stay grounded and ask her what's up", score: 4 },
      { t: "Lighten the mood with a story or joke", score: 3 },
      { t: "Quietly start scanning for what I did wrong", score: 2 },
      { t: "Internally panic and over-talk to fill space", score: 1 },
    ],
  },
  {
    q: "You like her. You text her. She doesn't reply for a day. You...",
    options: [
      { t: "Live my life. Reply when she does.", score: 4 },
      { t: "Notice it, but stay busy", score: 3 },
      { t: "Check the phone way too much", score: 2 },
      { t: "Send a follow-up to make sure she saw it", score: 1 },
    ],
  },
  {
    q: "How often do you initiate plans?",
    options: [
      { t: "Almost always — I lead", score: 4 },
      { t: "Roughly 50/50", score: 3 },
      { t: "She usually drives the schedule", score: 2 },
      { t: "I wait for her to ask", score: 1 },
    ],
  },
  {
    q: "You disagree with her on something important. You...",
    options: [
      { t: "Say it kindly but clearly", score: 4 },
      { t: "Push back, may get a little heated", score: 3 },
      { t: "Mention it once, then drop it", score: 2 },
      { t: "Agree out loud, disagree silently", score: 1 },
    ],
  },
  {
    q: "How comfortable are you with silence on a date?",
    options: [
      { t: "Love it — silence is intimacy", score: 4 },
      { t: "Comfortable, mostly", score: 3 },
      { t: "It makes me a little tense", score: 2 },
      { t: "I rush to fill it every time", score: 1 },
    ],
  },
  {
    q: "Your phone is...",
    options: [
      { t: "Face-down, do not disturb on dates", score: 4 },
      { t: "In my pocket, rarely checked", score: 3 },
      { t: "Out, occasionally glanced at", score: 2 },
      { t: "Open in front of me a lot", score: 1 },
    ],
  },
  {
    q: "She gives you a real compliment. You...",
    options: [
      { t: "Look her in the eye, say thank you, mean it", score: 4 },
      { t: "Smile, deflect a little, return one", score: 3 },
      { t: "Get awkward and change the subject", score: 2 },
      { t: "Brush it off — 'Nah it's nothing'", score: 1 },
    ],
  },
  {
    q: "Your dating life over the last 6 months has been...",
    options: [
      { t: "Intentional, abundant, on my terms", score: 4 },
      { t: "Decent — some hits, some misses", score: 3 },
      { t: "A few false starts, mostly quiet", score: 2 },
      { t: "Pretty much nonexistent", score: 1 },
    ],
  },
  {
    q: "How often do you do something that scares you?",
    options: [
      { t: "Weekly — that's how I grow", score: 4 },
      { t: "Monthly", score: 3 },
      { t: "A couple times a year", score: 2 },
      { t: "Almost never", score: 1 },
    ],
  },
];

export interface ConfidenceTier {
  min: number;
  label: string;
  emoji: string;
  oneLiner: string;
  focus: string[];
}

export const confidenceTiers: ConfidenceTier[] = [
  {
    min: 36,
    label: "Sovereign",
    emoji: "👑",
    oneLiner: "You operate from a grounded, magnetic place. Stay sharp.",
    focus: [
      "Mentor a younger guy through dating",
      "Watch for arrogance — keep curiosity alive",
      "Set bigger goals — relationship + life",
    ],
  },
  {
    min: 28,
    label: "Operator",
    emoji: "🎯",
    oneLiner: "Solid foundation. Now polish the edges.",
    focus: [
      "Initiate one harder conversation this week",
      "Cut one comfort behavior (phone, junk food, snooze)",
      "Lift heavier or push your training tier",
    ],
  },
  {
    min: 20,
    label: "Building",
    emoji: "🔨",
    oneLiner: "You're showing up. The reps are stacking. Keep going.",
    focus: [
      "Approach 1 stranger this week — anywhere, anything",
      "Plan + lead the next date completely",
      "Read 'Models' by Mark Manson",
    ],
  },
  {
    min: 0,
    label: "Reset",
    emoji: "🌱",
    oneLiner: "No shame. This is the most important quiz you'll take. Start small.",
    focus: [
      "Daily: 1 cold shower + 10 min walk outside",
      "Weekly: 1 social interaction outside your routine",
      "Pick ONE quiz from this app and act on it",
    ],
  },
];

export function tierFor(score: number) {
  return confidenceTiers.find((t) => score >= t.min) || confidenceTiers[confidenceTiers.length - 1];
}
