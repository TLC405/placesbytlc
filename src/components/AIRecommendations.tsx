import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Coffee, Music, PawPrint, UtensilsCrossed, Film } from "lucide-react";

const suggestions = [
  {
    id: 1,
    icon: Coffee,
    title: "Cozy Coffee Date",
    description: "Find a local café with outdoor seating"
  },
  {
    id: 2,
    icon: Music,
    title: "Live Music Night",
    description: "Explore venues with live performances"
  },
  {
    id: 3,
    icon: UtensilsCrossed,
    title: "Dinner & Dessert",
    description: "Restaurant hopping for appetizers and sweets"
  },
  {
    id: 4,
    icon: Film,
    title: "Movie & Munchies",
    description: "Cinema followed by late night snacks"
  },
  {
    id: 5,
    icon: PawPrint,
    title: "Park Stroll",
    description: "Scenic walk or picnic at a nearby park"
  }
];

export const AIRecommendations = () => {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-4 hover:border-primary/50 hover:shadow-md transition-all duration-300 cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative space-y-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <suggestion.icon className="w-5 h-5 text-primary" />
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                {suggestion.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {suggestion.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};