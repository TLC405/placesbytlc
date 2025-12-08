import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ChevronRight, Search, Filter, Star, Loader2, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Place {
  id: string;
  name: string;
  address: string | null;
  category: string | null;
  description: string | null;
  discovery_context: string | null;
  city: string | null;
}

const CATEGORIES = [
  { id: "all", name: "All", emoji: "✨" },
  { id: "food", name: "Food", emoji: "🍽️" },
  { id: "activity", name: "Activities", emoji: "🎯" },
  { id: "both", name: "Both", emoji: "💫" },
  { id: "entertainment", name: "Entertainment", emoji: "🎭" },
];

const getCategoryEmoji = (category: string | null) => {
  switch (category?.toLowerCase()) {
    case "food": return "🍽️";
    case "activity": return "🎯";
    case "entertainment": return "🎭";
    case "both": return "💫";
    default: return "📍";
  }
};

export default function PlacesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("discovered_places")
        .select("id, name, address, category, description, discovery_context, city")
        .order("name");

      if (error) throw error;
      setPlaces(data || []);
    } catch (err) {
      console.error("Error fetching places:", err);
      toast.error("Failed to load places");
    } finally {
      setLoading(false);
    }
  };

  const filteredPlaces = places.filter((place) => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
      place.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-shell">
      <div className="page-content space-y-6">
        {/* Header */}
        <header className="animate-in">
          <button 
            onClick={() => navigate("/")} 
            className="btn-ghost -ml-3 mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-display text-foreground">Places</h1>
          <p className="text-body">{places.length} curated date spots in OKC</p>
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
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`chip flex-shrink-0 transition-all ${
                  selectedCategory === cat.id ? "chip-primary" : ""
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Stats Card */}
        <section className="animate-in-delay-2">
          <div className="card-highlight p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Oklahoma City</p>
                  <p className="text-xs text-muted-foreground">All spots verified by locals</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{filteredPlaces.length}</p>
                <p className="text-caption">places</p>
              </div>
            </div>
          </div>
        </section>

        {/* Places List */}
        <section className="animate-in-delay-3">
          <div className="section-header">
            <h2 className="section-title">
              {selectedCategory === "all" ? "All Spots" : CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredPlaces.map((place) => (
                <button 
                  key={place.id} 
                  onClick={() => setSelectedPlace(place)}
                  className="feature-card text-left"
                >
                  <div className="feature-icon bg-muted">
                    <span className="text-xl">{getCategoryEmoji(place.category)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{place.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="chip text-[10px] py-0.5 px-2 capitalize">
                        {place.category || "Date Spot"}
                      </span>
                      {place.city && (
                        <span className="text-caption truncate">{place.city}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>
          )}

          {!loading && filteredPlaces.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-body">No places found</p>
              <p className="text-caption">Try a different search or category</p>
            </div>
          )}
        </section>
      </div>

      {/* Place Detail Modal */}
      {selectedPlace && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedPlace(null)}
        >
          <div 
            className="bg-card rounded-2xl w-full max-w-lg max-h-[80vh] overflow-auto animate-in"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: "var(--shadow-elevated)" }}
          >
            {/* Header */}
            <div className="p-5 border-b border-border">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{getCategoryEmoji(selectedPlace.category)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-headline text-foreground">{selectedPlace.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1 capitalize">
                    {selectedPlace.category || "Date Spot"} • {selectedPlace.city || "OKC"}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {selectedPlace.address && (
                <div>
                  <p className="text-caption mb-1">Address</p>
                  <p className="text-sm text-foreground">{selectedPlace.address}</p>
                </div>
              )}

              {selectedPlace.description && (
                <div>
                  <p className="text-caption mb-1">About</p>
                  <p className="text-sm text-foreground leading-relaxed">{selectedPlace.description}</p>
                </div>
              )}

              {selectedPlace.discovery_context && (
                <div className="card-highlight">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-primary" />
                    <p className="text-xs font-semibold text-primary">Why it's great</p>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {selectedPlace.discovery_context}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-5 border-t border-border">
              <button
                onClick={() => setSelectedPlace(null)}
                className="btn-secondary w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}