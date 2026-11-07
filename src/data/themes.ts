import { Heart, Flower2, Clapperboard, Brain, CalendarHeart, Droplets, Link2, Home, Ghost, Moon, Ticket, Film, Leaf, Sprout } from "lucide-react";
import { PumpkinIcon, BatIcon } from "@/components/HalloweenIcon";
import spooky from "@/assets/halloween-still-life.jpg";
import letters from "@/assets/love-letters.jpg";
import cinema from "@/assets/midnight-cinema.jpg";
import garden from "@/assets/garden-studio.jpg";
import { THEME_NAMES, type ThemeType } from "@/lib/themes";

const typography = {
  spooky: { heading: '"Playfair Display", Georgia, serif', body: '"Work Sans", sans-serif', fonts: "Playfair+Display:wght@400;500;600;700&family=Work+Sans:wght@400;500;600;700" },
  "love-letters": { heading: '"Instrument Serif", Georgia, serif', body: '"Work Sans", sans-serif', fonts: "Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600;700" },
  "midnight-cinema": { heading: '"Sora", sans-serif', body: '"Manrope", sans-serif', fonts: "Sora:wght@400;500;600;700&family=Manrope:wght@400;500;600;700" },
  "garden-studio": { heading: '"Lora", Georgia, serif', body: '"Nunito Sans", sans-serif', fonts: "Lora:wght@400;500;600;700&family=Nunito+Sans:wght@400;500;600;700" },
} satisfies Record<ThemeType, { heading: string; body: string; fonts: string }>;

export const THEMES = {
  spooky: { typography: typography.spooky, name: THEME_NAMES.spooky, description: "A little spooky. A lot of heart.", image: spooky, alt: "A smiling ceramic pumpkin, a tiny ghost and velvet ribbons", icon: PumpkinIcon, navIcons: [PumpkinIcon, Ghost, BatIcon, Moon, Heart], headline: "Date night,\nmade easy.", supporting: "Pick a plan, grab your person, go. Spooky optional." },
  "love-letters": { typography: typography["love-letters"], name: THEME_NAMES["love-letters"], description: "The little things, beautifully written.", image: letters, alt: "Love letters with pink heart seals and silk ribbon", icon: Heart, navIcons: [Home, Brain, CalendarHeart, Droplets, Link2], headline: "Good dates.\nLess guessing.", supporting: "Date ideas, little notes, and plans for the two of you." },
  "midnight-cinema": { typography: typography["midnight-cinema"], name: THEME_NAMES["midnight-cinema"], description: "Your favorite person. Your next scene.", image: cinema, alt: "A silver film reel, blank tickets and a glass heart", icon: Clapperboard, navIcons: [Film, Brain, Ticket, Moon, Link2], headline: "Tonight’s plan.\nSorted.", supporting: "Dinner, a movie, or something new — you pick." },
  "garden-studio": { typography: typography["garden-studio"], name: THEME_NAMES["garden-studio"], description: "Room to grow, together.", image: garden, alt: "Fresh green eucalyptus and a pink peony in a white vase", icon: Flower2, navIcons: [Leaf, Sprout, Flower2, Droplets, Link2], headline: "Plan it.\nEnjoy it.", supporting: "Simple date ideas and check-ins for the two of you." },
} satisfies Record<ThemeType, { typography: { heading: string; body: string; fonts: string }; name: string; description: string; image: string; alt: string; icon: typeof Heart | typeof PumpkinIcon; navIcons: Array<typeof Heart | typeof PumpkinIcon>; headline: string; supporting: string }>;