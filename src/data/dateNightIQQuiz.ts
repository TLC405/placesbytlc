export type DateVibe = "ROMANTIC" | "ADVENTUROUS" | "CHILL" | "SOCIAL" | "CULTURED";

export interface DateNightQuestion {
  q: string;
  options: { t: string; k: DateVibe }[];
}

export const dateNightQuestions: DateNightQuestion[] = [
  {
    q: "Your dream first-impression spot?",
    options: [
      { t: "Candlelit rooftop with skyline views", k: "ROMANTIC" },
      { t: "Hidden speakeasy you stumbled into", k: "ADVENTUROUS" },
      { t: "Quiet wine bar with great playlists", k: "CHILL" },
      { t: "Buzzy new restaurant everyone's talking about", k: "SOCIAL" },
      { t: "Indie film screening with Q&A after", k: "CULTURED" },
    ],
  },
  {
    q: "Pick a soundtrack for the night:",
    options: [
      { t: "Slow jazz and acoustic ballads", k: "ROMANTIC" },
      { t: "Indie rock and hype anthems", k: "ADVENTUROUS" },
      { t: "Lo-fi beats and ambient", k: "CHILL" },
      { t: "Pop hits and dance floor energy", k: "SOCIAL" },
      { t: "Classical, vinyl, or world music", k: "CULTURED" },
    ],
  },
  {
    q: "Mid-date, you'd rather...",
    options: [
      { t: "Slow dance in a quiet corner", k: "ROMANTIC" },
      { t: "Sneak off to explore somewhere new", k: "ADVENTUROUS" },
      { t: "Find a cozy nook and just talk", k: "CHILL" },
      { t: "Run into friends and merge plans", k: "SOCIAL" },
      { t: "Wander a museum or gallery", k: "CULTURED" },
    ],
  },
  {
    q: "Your perfect dessert moment?",
    options: [
      { t: "Sharing one fork, eyes locked", k: "ROMANTIC" },
      { t: "Trying something you've never had", k: "ADVENTUROUS" },
      { t: "Ice cream walking back to the car", k: "CHILL" },
      { t: "Group dessert at the bar with new friends", k: "SOCIAL" },
      { t: "A pastry from a chef-driven bakery", k: "CULTURED" },
    ],
  },
  {
    q: "How do you want the night to end?",
    options: [
      { t: "A long, lingering goodnight kiss", k: "ROMANTIC" },
      { t: "An impromptu late-night drive", k: "ADVENTUROUS" },
      { t: "On the couch with a movie", k: "CHILL" },
      { t: "An after-party with the crew", k: "SOCIAL" },
      { t: "Reading poetry or playing records", k: "CULTURED" },
    ],
  },
  {
    q: "Budget philosophy for date night?",
    options: [
      { t: "Splurge — make it unforgettable", k: "ROMANTIC" },
      { t: "Whatever the adventure costs", k: "ADVENTUROUS" },
      { t: "Low-key, free, and intentional", k: "CHILL" },
      { t: "Split it, share it, no rules", k: "SOCIAL" },
      { t: "Pay for quality and craftsmanship", k: "CULTURED" },
    ],
  },
  {
    q: "Conversation flows best when you're...",
    options: [
      { t: "Sharing dreams and 'what ifs'", k: "ROMANTIC" },
      { t: "Telling stories from past trips", k: "ADVENTUROUS" },
      { t: "In silence, just being together", k: "CHILL" },
      { t: "Debating with the whole table", k: "SOCIAL" },
      { t: "Discussing books, films, ideas", k: "CULTURED" },
    ],
  },
  {
    q: "Your weather wishlist?",
    options: [
      { t: "Golden hour, soft breeze", k: "ROMANTIC" },
      { t: "Bring on the rain — let's run", k: "ADVENTUROUS" },
      { t: "Cool, calm, hoodie weather", k: "CHILL" },
      { t: "Warm summer night, patio energy", k: "SOCIAL" },
      { t: "Crisp fall, scarves, golden leaves", k: "CULTURED" },
    ],
  },
];

export const dateVibeLabels: Record<DateVibe, string> = {
  ROMANTIC: "The Romantic",
  ADVENTUROUS: "The Adventurer",
  CHILL: "The Chillseeker",
  SOCIAL: "The Social Butterfly",
  CULTURED: "The Cultured Soul",
};

export const dateVibeDescriptions: Record<DateVibe, string> = {
  ROMANTIC: "You crave intimate, intentional moments. Soft lighting, slow pacing, and emotional depth define your perfect night.",
  ADVENTUROUS: "Spontaneity is your love language. The best dates surprise you both and create stories worth retelling.",
  CHILL: "Connection over chaos. You shine in low-pressure settings where conversation can breathe.",
  SOCIAL: "Energy lifts you up. The right date includes great people, lively venues, and a sense of occasion.",
  CULTURED: "Beauty, craft, and ideas captivate you. Galleries, indie cinema, and curated experiences hit different.",
};

export const dateVibeRecommendations: Record<DateVibe, string[]> = {
  ROMANTIC: [
    "Vast Restaurant — sunset skyline dinner downtown",
    "Picnic at Will Rogers Garden Exhibition Center",
    "Couples massage + late dessert at Cafe Cuvée",
    "Sunset paddleboat ride at the Boathouse District",
  ],
  ADVENTUROUS: [
    "RIVERSPORT rapids + zipline combo",
    "Late-night drive to Roman Nose State Park",
    "Escape room downtown + speakeasy chaser",
    "Try a new cuisine in the Asian District you've never had",
  ],
  CHILL: [
    "Coffee crawl through Plaza District",
    "Bookstore date at Full Circle + tea",
    "Slow walk through the Myriad Gardens",
    "Movie night at Rodeo Cinema in Stockyards",
  ],
  SOCIAL: [
    "Bricktown bar crawl with live music",
    "Trivia night at McNellie's",
    "Rooftop drinks at Skyline at the Skirvin",
    "Saturday brunch + farmers market wander",
  ],
  CULTURED: [
    "OKC Museum of Art evening hours",
    "Civic Center Music Hall performance",
    "Factory Obscura immersive experience",
    "Paseo Arts District first-Friday gallery walk",
  ],
};
