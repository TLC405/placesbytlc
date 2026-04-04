import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin, ChevronRight, Search, Star, Loader2, ArrowLeft, Calendar,
  Shield, ExternalLink, DollarSign, Sparkles, Globe, Clock, X, RefreshCw, Zap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PoweredByTLC } from "@/components/PoweredByTLC";
import { KhaosScoreBadge } from "@/components/KhaosScoreCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EventsTab } from "@/components/EventsTab";

interface Place {
  id: string;
  name: string;
  address: string | null;
  category: string | null;
  description: string | null;
  discovery_context: string | null;
  city: string | null;
}

interface LiveEvent {
  id: string;
  title: string;
  description: string | null;
  starts_at: string | null;
  venue_name: string | null;
  venue_address: string | null;
  venue_city: string | null;
  price_min: number | null;
  price_max: number | null;
  ticket_url: string | null;
  image_url: string | null;
  tags: string[];
  source: string;
}

interface AISuggestion {
  name: string;
  type: string;
  description: string;
  address: string;
  why: string;
}

interface SearchResults {
  places: Place[];
  events: any[];
  live_events: LiveEvent[];
  venues: any[];
  ai_suggestions: AISuggestion[];
  total: number;
  query: string;
}

const CATEGORIES = [
  { id: "all", name: "All", emoji: "✨" },
  { id: "food", name: "Food", emoji: "🍽️" },
  { id: "activity", name: "Activities", emoji: "🎯" },
  { id: "both", name: "Both", emoji: "💫" },
  { id: "entertainment", name: "Entertainment", emoji: "🎭" },
];

const QUICK_SEARCHES = [
  "Date night", "Live music", "Brunch", "Outdoor", "Comedy",
  "Happy hour", "Art", "Sports", "Dance", "Karaoke"
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

const formatDate = (d: string | null) => {
  if (!d) return "TBD";
  return new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

const formatTime = (d: string | null) => {
  if (!d) return "";
  return new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const formatPrice = (min: number | null, max: number | null) => {
  if (!min && !max) return "Free";
  if (min && max && min !== max) return `$${min}–$${max}`;
  return `$${min || max}`;
};

export default function PlacesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [activeTab, setActiveTab] = useState("search");

  useEffect(() => { fetchPlaces(); }, []);

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

  const handleSearch = useCallback(async (query?: string) => {
    const q = query || searchQuery;
    if (!q.trim()) return;
    
    setSearching(true);
    setActiveTab("search");
    try {
      const { data, error } = await supabase.functions.invoke("search-everything", {
        body: { query: q, category: selectedCategory !== "all" ? selectedCategory : undefined },
      });
      if (error) throw error;
      setSearchResults(data as SearchResults);
      if (data.total === 0) {
        toast("No results found — try different keywords", { icon: "🔍" });
      } else {
        toast.success(`Found ${data.total} results`);
      }
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }, [searchQuery, selectedCategory]);

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
    handleSearch(term);
  };

  const filteredPlaces = places.filter((place) => {
    const matchesCategory = selectedCategory === "all" ||
      place.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesCategory;
  });

  const hasSearchResults = searchResults && searchResults.total > 0;

  return (
    <div className="page-shell">
      <div className="page-content space-y-5">
        {/* Header */}
        <header className="animate-in">
          <button onClick={() => navigate("/")} className="btn-ghost -ml-3 mb-3">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-display text-foreground">
            <span className="text-brand">TLC</span> Engine
          </h1>
          <p className="text-body">Search everything in OKC — places, events, live results</p>
        </header>

        {/* Universal Search Bar */}
        <div className="animate-in-delay-1 space-y-3">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search places, events, anything..."
                className="h-12 pl-11 pr-10 bg-muted border-0 rounded-xl text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setSearchResults(null); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={searching || !searchQuery.trim()}
              className="btn-primary h-12 px-5 flex-shrink-0"
            >
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Search Tags */}
          {!searchResults && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {QUICK_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handleQuickSearch(term)}
                  className="chip flex-shrink-0 hover:bg-primary/10 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Results */}
        {searching && (
          <div className="flex items-center justify-center py-16 animate-in">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
              <p className="text-body">Searching everywhere...</p>
              <p className="text-caption">Database • Ticketmaster • AI</p>
            </div>
          </div>
        )}

        {hasSearchResults && !searching && (
          <div className="space-y-4 animate-in">
            <div className="card-premium p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="icon-premium w-10 h-10">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Search: "{searchResults!.query}"</p>
                    <p className="text-xs text-muted-foreground">
                      {searchResults!.places.length} places • {searchResults!.events.length + searchResults!.live_events.length} events
                    </p>
                  </div>
                </div>
                <button onClick={() => setSearchResults(null)} className="btn-ghost text-xs">Clear</button>
              </div>
            </div>

            {/* Places Results */}
            {searchResults!.places.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Places ({searchResults!.places.length})
                </h3>
                <div className="grid gap-2">
                  {searchResults!.places.map((place) => (
                    <button key={place.id} onClick={() => setSelectedPlace(place)} className="feature-card text-left">
                      <div className="icon-premium w-10 h-10">
                        <span className="text-lg">{getCategoryEmoji(place.category)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm truncate">{place.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="chip text-[10px] py-0 px-1.5 capitalize">{place.category || "Spot"}</span>
                          {place.city && <span className="text-caption truncate">{place.city}</span>}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DB Events */}
            {searchResults!.events.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Database Events ({searchResults!.events.length})
                </h3>
                <div className="grid gap-2">
                  {searchResults!.events.map((event: any) => (
                    <div key={event.id} className="feature-card">
                      <div className="icon-premium w-10 h-10">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h4 className="font-medium text-foreground text-sm line-clamp-1">{event.title}</h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-caption flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {formatDate(event.starts_at)} {formatTime(event.starts_at)}
                          </span>
                          <span className="chip text-[10px] py-0 px-1.5">
                            {formatPrice(event.price_min, event.price_max)}
                          </span>
                        </div>
                        {event.venues && (
                          <p className="text-caption truncate">{event.venues.name}</p>
                        )}
                      </div>
                      {(event.ticket_url || event.event_url) && (
                        <a href={event.ticket_url || event.event_url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 p-2 rounded-lg hover:bg-muted">
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Ticketmaster Events */}
            {searchResults!.live_events.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" /> Live Results ({searchResults!.live_events.length})
                  <span className="chip text-[10px] py-0 px-1.5 bg-amber-500/10 text-amber-600">Ticketmaster</span>
                </h3>
                <div className="grid gap-2">
                  {searchResults!.live_events.map((event) => (
                    <div key={event.id} className="feature-card group">
                      {event.image_url && (
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      )}
                      {!event.image_url && (
                        <div className="icon-premium w-12 h-12 flex-shrink-0">
                          <Zap className="w-5 h-5 text-amber-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h4 className="font-medium text-foreground text-sm line-clamp-2">{event.title}</h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-caption flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {formatDate(event.starts_at)} {formatTime(event.starts_at)}
                          </span>
                          <span className="chip text-[10px] py-0 px-1.5">
                            {formatPrice(event.price_min, event.price_max)}
                          </span>
                        </div>
                        {event.venue_name && (
                          <p className="text-caption flex items-center gap-0.5 truncate">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            {event.venue_name}{event.venue_city ? `, ${event.venue_city}` : ""}
                          </p>
                        )}
                        {event.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {event.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="chip text-[9px] py-0 px-1 opacity-60">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      {event.ticket_url && (
                        <a href={event.ticket_url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 p-2 rounded-lg hover:bg-muted">
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Suggestions */}
            {searchResults!.ai_suggestions.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-500" /> AI Suggestions
                </h3>
                <div className="grid gap-2">
                  {searchResults!.ai_suggestions.map((s, i) => (
                    <div key={i} className="card-highlight p-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground text-sm">{s.name}</h4>
                        <span className="chip text-[10px] py-0 px-1.5 capitalize">{s.type}</span>
                      </div>
                      <p className="text-caption">{s.description}</p>
                      {s.address && <p className="text-caption flex items-center gap-1"><MapPin className="w-3 h-3" /> {s.address}</p>}
                      <p className="text-xs text-primary italic">{s.why}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Tabs (when not showing search results) */}
        {!hasSearchResults && !searching && (
          <Tabs defaultValue="places" className="animate-in-delay-1">
            <TabsList className="w-full">
              <TabsTrigger value="places" className="flex-1 gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Places
              </TabsTrigger>
              <TabsTrigger value="events" className="flex-1 gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Events
              </TabsTrigger>
              <TabsTrigger value="organizers" className="flex-1 gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                KHAOS
              </TabsTrigger>
            </TabsList>

            <TabsContent value="places" className="space-y-4 mt-4">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`chip flex-shrink-0 transition-all ${selectedCategory === cat.id ? "chip-primary" : ""}`}>
                    <span>{cat.emoji}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>

              <div className="card-premium p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="icon-premium w-10 h-10">
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

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredPlaces.map((place) => (
                    <button key={place.id} onClick={() => setSelectedPlace(place)} className="feature-card text-left">
                      <div className="icon-premium w-12 h-12">
                        <span className="text-xl">{getCategoryEmoji(place.category)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{place.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="chip text-[10px] py-0.5 px-2 capitalize">{place.category || "Date Spot"}</span>
                          {place.city && <span className="text-caption truncate">{place.city}</span>}
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
                  <p className="text-caption">Try a different category</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="events" className="mt-4">
              <EventsTab />
            </TabsContent>

            <TabsContent value="organizers" className="mt-4">
              <OrganizersTab />
            </TabsContent>
          </Tabs>
        )}

        <PoweredByTLC />
      </div>

      {/* Place Detail Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setSelectedPlace(null)}>
          <div className="bg-card rounded-2xl w-full max-w-lg max-h-[80vh] overflow-auto animate-in" onClick={(e) => e.stopPropagation()} style={{ boxShadow: "var(--shadow-elevated)" }}>
            <div className="p-5 border-b border-border">
              <div className="flex items-start gap-4">
                <div className="icon-premium flex-shrink-0">
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
                  <p className="text-sm text-foreground leading-relaxed">{selectedPlace.discovery_context}</p>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-border">
              <button onClick={() => setSelectedPlace(null)} className="btn-secondary w-full">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrganizersTab() {
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrganizers(); }, []);

  const fetchOrganizers = async () => {
    try {
      const { data: orgs } = await supabase.from("organizers").select("*").order("name");
      const { data: scores } = await supabase.from("khaos_scores").select("*");
      const scoreMap = new Map();
      scores?.forEach((s: any) => scoreMap.set(s.organizer_id, s));
      const merged = (orgs || []).map((o: any) => ({ ...o, khaos: scoreMap.get(o.id) || null }));
      merged.sort((a: any, b: any) => (b.khaos?.score_total || 0) - (a.khaos?.score_total || 0));
      setOrganizers(merged);
    } catch (err) {
      console.error("Error fetching organizers:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  if (organizers.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
        <p className="text-body">No organizers yet</p>
        <p className="text-caption">Organizer data appears as events are discovered</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card-premium p-4">
        <div className="flex items-center gap-3">
          <div className="icon-premium w-10 h-10"><Shield className="w-5 h-5 text-primary" /></div>
          <div>
            <p className="font-semibold text-foreground">KHAOS Scoring</p>
            <p className="text-xs text-muted-foreground">Organizer trust & reputation rankings</p>
          </div>
        </div>
      </div>
      <div className="grid gap-3">
        {organizers.map((org: any) => (
          <div key={org.id} className="feature-card">
            <div className="icon-premium w-12 h-12"><span className="text-lg">🏢</span></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-foreground truncate">{org.name}</h3>
                {org.claimed && <span className="chip text-[10px] py-0 px-1.5 bg-primary/10 text-primary">Verified</span>}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {org.khaos ? <KhaosScoreBadge score={org.khaos.score_total} /> : <span className="text-caption">No score yet</span>}
                {org.website && <span className="text-caption truncate">{org.website}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
