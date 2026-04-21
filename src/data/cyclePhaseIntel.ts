export type CyclePhase = "MENSTRUAL" | "FOLLICULAR" | "OVULATION" | "LUTEAL";

export interface PhaseIntel {
  key: CyclePhase;
  codename: string;
  emoji: string;
  hex: string;
  oneLiner: string;
  vibe: string;
  her: string[];
  do: string[];
  dont: string[];
  dateMoves: string[];
  giftIdeas: string[];
  texts: string[];
}

export const phaseIntel: Record<CyclePhase, PhaseIntel> = {
  MENSTRUAL: {
    key: "MENSTRUAL",
    codename: "Code Red",
    emoji: "🩸",
    hex: "#C4002B",
    oneLiner: "Comfort mode. Bring snacks, lower the lights, raise the empathy.",
    vibe: "Tired, tender, low-energy. Cramps possible. She wants to feel SAFE, not impressed.",
    her: [
      "Energy dips, sleep needs spike",
      "Emotional sensitivity is high — words land harder",
      "Cramps, bloating, lower back ache likely",
    ],
    do: [
      "Volunteer chores BEFORE she asks",
      "Pre-stock her favorite snacks (chocolate, salty, hot tea)",
      "Hand her a heating pad without being asked",
      "Listen 10x more than you talk",
    ],
    dont: [
      "Plan anything that requires being 'on'",
      "Use the phrase 'are you on your period?'",
      "Start big relationship talks",
      "Suggest exercise unless she asks",
    ],
    dateMoves: [
      "Movie + blanket fort at home",
      "Order her comfort food + foot massage",
      "Quiet drive with her favorite playlist",
      "Cozy bookstore + hot drinks",
    ],
    giftIdeas: [
      "Heating pad or weighted blanket",
      "Her go-to dark chocolate",
      "Hot soup delivered to the door",
    ],
    texts: [
      "Anything I can grab on my way home?",
      "I got you. Couch tonight, no plans.",
      "You don't have to be okay today.",
    ],
  },
  FOLLICULAR: {
    key: "FOLLICULAR",
    codename: "Power Up",
    emoji: "🌱",
    hex: "#FF1F6D",
    oneLiner: "She's recharging. Energy rising. Time to plant the date-night seed.",
    vibe: "Optimistic, social, adventurous. Open to new ideas and trying things.",
    her: [
      "Energy and mood climbing daily",
      "More open to new experiences",
      "Confidence is up, libido starting to rise",
    ],
    do: [
      "Pitch a new restaurant or activity",
      "Book the date NOW for next week",
      "Suggest a workout class together",
      "Bring fresh, light energy to convos",
    ],
    dont: [
      "Default to the same old spots",
      "Underplan — she's ready for more",
      "Be passive about weekend plans",
    ],
    dateMoves: [
      "Try a new cuisine she's never had",
      "Outdoor adventure — hike, bike, kayak",
      "Cooking class or pottery date",
      "Weekend day-trip to somewhere new",
    ],
    giftIdeas: [
      "Tickets to a class or experience",
      "A book she mentioned in passing",
      "New playlist made just for her",
    ],
    texts: [
      "Booked us [thing] for Saturday — wear something cute.",
      "Found a place I think you'll love. Friday?",
      "What's something new you wanna try this month?",
    ],
  },
  OVULATION: {
    key: "OVULATION",
    codename: "Peak Mode",
    emoji: "🔥",
    hex: "#FF1F6D",
    oneLiner: "Maximum attraction window. This is THE night. Don't fumble it.",
    vibe: "Glowing, magnetic, confident. Libido peak. Wants to feel desired.",
    her: [
      "Highest energy and libido of the cycle",
      "Most social and outgoing window",
      "She wants to feel sexy and seen",
    ],
    do: [
      "Plan THE romantic night this week",
      "Dress up — she'll notice the effort",
      "Verbal compliments on her energy/look",
      "Initiate physical affection more",
    ],
    dont: [
      "Stay in for a 4th night in a row",
      "Be on your phone during the date",
      "Skip the compliment — she's glowing",
    ],
    dateMoves: [
      "Rooftop dinner with skyline views",
      "Live music + late drinks",
      "Dancing — actual dancing, not just bobbing",
      "Surprise her with a hotel night out",
    ],
    giftIdeas: [
      "Lingerie or perfume she's hinted at",
      "Surprise reservation at THE spot",
      "Flowers — yes, just because",
    ],
    texts: [
      "You looked unreal last night.",
      "Picking you up at 7. Wear the [thing].",
      "I can't stop thinking about you.",
    ],
  },
  LUTEAL: {
    key: "LUTEAL",
    codename: "Storm Watch",
    emoji: "🌙",
    hex: "#0A0A0A",
    oneLiner: "Mood may shift. Be steady, be present, lower the chaos.",
    vibe: "Inward, sometimes irritable, craving comfort + control. PMS may show up late.",
    her: [
      "Energy slowly winds down",
      "More sensitive to criticism",
      "Cravings spike, sleep gets worse",
    ],
    do: [
      "Be reliable — confirm plans early",
      "Cook for her or order in",
      "Validate feelings before fixing problems",
      "Lower the volume on everything",
    ],
    dont: [
      "Cancel plans last minute",
      "Tease her about being moody",
      "Try to logic her out of a feeling",
      "Pick now for hard conversations",
    ],
    dateMoves: [
      "Cozy at-home dinner you cooked",
      "Movie marathon in matching hoodies",
      "Sunset walk + ice cream",
      "Spa night — bath, candles, music",
    ],
    giftIdeas: [
      "Her favorite takeout, no questions asked",
      "A candle in her scent",
      "Magnesium + chamomile tea bundle",
    ],
    texts: [
      "Picking up dinner — what sounds good?",
      "Hoodie night tonight. I'll be there at 8.",
      "Whatever you're feeling, it's valid.",
    ],
  },
};

export function getPhaseFromDay(day: number, cycleLength: number, periodLength: number): CyclePhase {
  const ovulationDay = cycleLength - 14;
  if (day < periodLength) return "MENSTRUAL";
  if (day < ovulationDay - 1) return "FOLLICULAR";
  if (day <= ovulationDay + 1) return "OVULATION";
  return "LUTEAL";
}
