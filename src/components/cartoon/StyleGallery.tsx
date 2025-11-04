import { Card } from "@/components/ui/card";

interface StyleOption {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: "adult" | "kids";
}

const styles: StyleOption[] = [
  { id: "simpsons", name: "Simpsons", emoji: "🍩", description: "Yellow skin, Springfield vibes", category: "adult" },
  { id: "familyguy", name: "Family Guy", emoji: "🦆", description: "Pastel sitcom style", category: "adult" },
  { id: "southpark", name: "South Park", emoji: "🚌", description: "Flat cutout aesthetic", category: "adult" },
  { id: "rickandmorty", name: "Rick & Morty", emoji: "🌀", description: "Neon sci-fi dimension", category: "adult" },
  { id: "kingofthehill", name: "King of the Hill", emoji: "🏡", description: "Grounded realism", category: "adult" },
  { id: "renandstimpy", name: "Ren & Stimpy", emoji: "🤪", description: "Gritty grotesque", category: "adult" },
  { id: "beavisandbutt", name: "Beavis & Butthead", emoji: "🎸", description: "Crude flat style", category: "adult" },
  { id: "spongebob", name: "SpongeBob", emoji: "🧽", description: "Undersea bubbly fun", category: "kids" },
  { id: "pokemon", name: "Pokémon", emoji: "⚡", description: "Anime manga vibes", category: "kids" },
  { id: "toontown", name: "Toontown", emoji: "🎩", description: "Classic rubber-hose", category: "kids" },
  { id: "peppapig", name: "Peppa Pig", emoji: "🐷", description: "Minimal nursery", category: "kids" },
  { id: "doraemon", name: "Doraemon", emoji: "🤖", description: "Blue robo-cat", category: "kids" },
];

interface StyleGalleryProps {
  selectedStyle: string;
  onStyleSelect: (styleId: string) => void;
}

export function StyleGallery({ selectedStyle, onStyleSelect }: StyleGalleryProps) {
  const adultStyles = styles.filter(s => s.category === "adult");
  const kidsStyles = styles.filter(s => s.category === "kids");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-primary mb-3">🎭 Adult Styles (7)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {adultStyles.map((style) => (
            <Card
              key={style.id}
              onClick={() => onStyleSelect(style.id)}
              className={`p-3 cursor-pointer transition-all hover:scale-105 ${
                selectedStyle === style.id
                  ? "border-4 border-[#F7DC6F] shadow-xl bg-[#F7DC6F]/10"
                  : "border-2 border-border hover:border-[#F7DC6F]/50"
              }`}
            >
              <div className="text-center space-y-2">
                <div className="text-4xl">{style.emoji}</div>
                <div className="text-xs font-semibold text-foreground">{style.name}</div>
                <div className="text-[10px] text-muted-foreground line-clamp-2">{style.description}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-primary mb-3">🧒 Kids Styles (5)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {kidsStyles.map((style) => (
            <Card
              key={style.id}
              onClick={() => onStyleSelect(style.id)}
              className={`p-3 cursor-pointer transition-all hover:scale-105 ${
                selectedStyle === style.id
                  ? "border-4 border-[#F7DC6F] shadow-xl bg-[#F7DC6F]/10"
                  : "border-2 border-border hover:border-[#F7DC6F]/50"
              }`}
            >
              <div className="text-center space-y-2">
                <div className="text-4xl">{style.emoji}</div>
                <div className="text-xs font-semibold text-foreground">{style.name}</div>
                <div className="text-[10px] text-muted-foreground line-clamp-2">{style.description}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
