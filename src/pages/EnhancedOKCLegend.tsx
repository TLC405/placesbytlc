import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ChevronRight, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  { id: "dining", name: "Dining", emoji: "🍽️" },
  { id: "outdoors", name: "Outdoors", emoji: "🌳" },
  { id: "entertainment", name: "Entertainment", emoji: "🎭" },
  { id: "nightlife", name: "Nightlife", emoji: "🌙" },
  { id: "culture", name: "Culture", emoji: "🎨" },
  { id: "adventure", name: "Adventure", emoji: "🎢" },
];

const FEATURED_SPOTS = [
  { id: 1, name: "Paseo Arts District", type: "Culture", emoji: "🎨", rating: 4.8 },
  { id: 2, name: "Bricktown", type: "Entertainment", emoji: "🌃", rating: 4.7 },
  { id: 3, name: "Automobile Alley", type: "Dining", emoji: "🍽️", rating: 4.6 },
  { id: 4, name: "Myriad Gardens", type: "Outdoors", emoji: "🌳", rating: 4.9 },
  { id: 5, name: "Plaza District", type: "Nightlife", emoji: "🌙", rating: 4.5 },
  { id: 6, name: "Science Museum", type: "Culture", emoji: "🔬", rating: 4.8 },
];

export default function PlacesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredSpots = FEATURED_SPOTS.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || spot.type.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-shell">
      <div className="page-content space-y-6">
        {/* Header */}
        <header className="animate-in">
          <button 
            onClick={() => navigate("/")} 
            className="text-muted-foreground mb-2 flex items-center gap-1 text-sm hover:text-foreground transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-display">Places</h1>
          <p className="text-body">70+ curated date spots in OKC</p>
        </header>

        {/* Search */}
        <section className="animate-in-delay-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places..."
              className="h-12 pl-11 bg-muted border-0 rounded-xl"
            />
          </div>
        </section>

        {/* Categories */}
        <section className="animate-in-delay-1">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`chip flex-shrink-0 ${!selectedCategory ? "chip-primary" : ""}`}
            >
              <Filter className="w-3 h-3" />
              <span>All</span>
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                className={`chip flex-shrink-0 ${
                  selectedCategory === cat.id ? "chip-primary" : ""
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Map Preview Card */}
        <section className="animate-in-delay-2">
          <div className="card-highlight p-0 overflow-hidden">
            <div className="h-40 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
              <div className="text-center z-10">
                <MapPin className="w-10 h-10 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Oklahoma City</p>
                <p className="text-xs text-muted-foreground">Tap a spot below to explore</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Spots */}
        <section className="animate-in-delay-3">
          <div className="section-header">
            <h2 className="section-title">
              {selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.name : "All Spots"}
            </h2>
            <span className="text-caption">{filteredSpots.length} places</span>
          </div>
          
          <div className="grid gap-3">
            {filteredSpots.map((spot) => (
              <button key={spot.id} className="feature-card">
                <div className="feature-icon bg-muted">
                  <span className="text-xl">{spot.emoji}</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-foreground">{spot.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-caption">{spot.type}</span>
                    <span className="text-caption">•</span>
                    <span className="text-caption">⭐ {spot.rating}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>

          {filteredSpots.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-body">No places found</p>
              <p className="text-caption">Try a different search or category</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
