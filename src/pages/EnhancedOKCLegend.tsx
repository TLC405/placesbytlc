import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin, ChevronRight, Search, Star, Loader2, ArrowLeft, Calendar,
  Shield, ExternalLink, DollarSign, Sparkles, Globe, Clock, X, RefreshCw, Zap,
  Heart, Music, Dumbbell, ShoppingBag, Palette, TreePine, Laugh, Users,
  Wine, Gem, Activity, Flame, Send
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PoweredByTLC } from "@/components/PoweredByTLC";
import { KhaosScoreBadge } from "@/components/KhaosScoreCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  vibe_match?: number;
}

interface HiddenGem {
  name: string;
  type: string;
  description: string;
  address: string;
  why_hidden: string;
  insider_tip: string;
}

interface DateStop {
  order: number;
  name: string;
  type: string;
  description: string;
  address: string;
  estimated_cost: string;
  duration: string;
  tip: string;
}

interface LivePulseItem {
  venue: string;
  count: number;
}

interface SearchResults {
  places: Place[];
  events: any[];
  live_events: LiveEvent[];
  venues: any[];
  ai_suggestions: AISuggestion[];
  hidden_gems: HiddenGem[];
  date_itinerary: { itinerary: DateStop[]; total_estimated_cost: string; theme: string } | null;
  live_pulse: LivePulseItem[];
  total: number;
  query: string;
  mode: string;
}

const CATEGORIES = [
  { id: "music", name: "Music", emoji: "🎵", icon: Music },
  { id: "sports", name: "Sports", emoji: "⚽", icon: Activity },
  { id: "food", name: "Food & Drink", emoji: "🍽️", icon: Wine },
  { id: "nightlife", name: "Nightlife", emoji: "🌙", icon: Wine },
  { id: "arts", name: "Arts & Culture", emoji: "🎨", icon: Palette },
  { id: "outdoor", name: "Outdoor", emoji: "🌿", icon: TreePine },
  { id: "comedy", name: "Comedy", emoji: "😂", icon: Laugh },
  { id: "family", name: "Family", emoji: "👨‍👩‍👧", icon: Users },
  { id: "fitness", name: "Fitness", emoji: "💪", icon: Dumbbell },
  { id: "shopping", name: "Shopping", emoji: "🛍️", icon: ShoppingBag },
  { id: "wellness", name: "Wellness", emoji: "🧘", icon: Sparkles },
  { id: "datenight", name: "Date Night", emoji: "💕", icon: Heart },
];

const getCategoryEmoji = (category: string | null) => {
  const found = CATEGORIES.find(c => c.id === category?.toLowerCase());
  return found?.emoji || "📍";
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
  const [vibeQuery, setVibeQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [activeSection, setActiveSection] = useState<"discover" | "date-builder" | "hidden-gems">("discover");
  const [dateBuilderLoading, setDateBuilderLoading] = useState(false);
  const [hiddenGemsLoading, setHiddenGemsLoading] = useState(false);

  // Auto-load on mount — browse mode, no keyword
  useEffect(() => { loadEverything(); }, []);

  const loadEverything = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("search-everything", {
        body: { query: "", mode: "browse" },
      });
      if (error) throw error;
      setResults(data as SearchResults);
    } catch (err) {
      console.error("Auto-load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(async (query?: string, cat?: string) => {
    const q = query ?? searchQuery;
    const c = cat ?? selectedCategory;
    setSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke("search-everything", {
        body: { query: q || "", category: c || undefined, mode: q ? "search" : "browse" },
      });
      if (error) throw error;
      setResults(data as SearchResults);
      if (data.total === 0 && q) {
        toast("No exact matches — AI suggestions below", { icon: "🔍" });
      }
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Search failed");
    } finally {
      setSearching(false);
    }
  }, [searchQuery, selectedCategory]);

  const handleCategoryTap = (catId: string) => {
    const newCat = selectedCategory === catId ? null : catId;
    setSelectedCategory(newCat);
    handleSearch("", newCat || undefined);
  };

  const handleVibeMatch = async () => {
    if (!vibeQuery.trim()) return;
    setSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke("search-everything", {
        body: { query: vibeQuery, mode: "vibe", vibe: vibeQuery },
      });
      if (error) throw error;
      setResults(data as SearchResults);
      setActiveSection("discover");
    } catch (err) {
      toast.error("Vibe match failed");
    } finally {
      setSearching(false);
    }
  };

  const handleDateBuilder = async () => {
    setDateBuilderLoading(true);
    setActiveSection("date-builder");
    try {
      const { data, error } = await supabase.functions.invoke("search-everything", {
        body: { mode: "date-builder", vibe: "romantic", budget: "moderate", time_of_day: "evening" },
      });
      if (error) throw error;
      setResults(data as SearchResults);
    } catch (err) {
      toast.error("Date builder failed");
    } finally {
      setDateBuilderLoading(false);
    }
  };

  const handleHiddenGems = async () => {
    setHiddenGemsLoading(true);
    setActiveSection("hidden-gems");
    try {
      const { data, error } = await supabase.functions.invoke("search-everything", {
        body: { mode: "hidden-gems" },
      });
      if (error) throw error;
      setResults(data as SearchResults);
    } catch (err) {
      toast.error("Hidden gems failed");
    } finally {
      setHiddenGemsLoading(false);
    }
  };

  const totalEvents = (results?.events?.length || 0) + (results?.live_events?.length || 0);
  const totalPlaces = results?.places?.length || 0;

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
          <p className="text-body">Discover everything OKC — powered by AI + live data</p>
        </header>

        {/* Vibe Match */}
        <div className="animate-in-delay-1">
          <div className="card-highlight p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary tracking-wide uppercase">Vibe Match</span>
            </div>
            <div className="flex gap-2">
              <Input
                value={vibeQuery}
                onChange={(e) => setVibeQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVibeMatch()}
                placeholder="chill sunset drinks, hype night out..."
                className="h-10 bg-background border-0 rounded-xl text-sm flex-1"
              />
              <button onClick={handleVibeMatch} disabled={searching || !vibeQuery.trim()} className="btn-primary h-10 px-4 flex-shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="animate-in-delay-1">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search places, events..."
                className="h-12 pl-11 pr-10 bg-muted border-0 rounded-xl text-base"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setSelectedCategory(null); loadEverything(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button onClick={() => handleSearch()} disabled={searching} className="btn-primary h-12 px-5 flex-shrink-0">
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Category Grid */}
        <div className="animate-in-delay-2">
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryTap(cat.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all text-center
                    ${isActive
                      ? "bg-primary text-primary-foreground shadow-lg scale-105"
                      : "bg-muted/50 hover:bg-muted text-foreground"
                    }`}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="text-[10px] font-medium leading-tight">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions: Date Builder + Hidden Gems */}
        <div className="flex gap-2 animate-in-delay-2">
          <button onClick={handleDateBuilder} disabled={dateBuilderLoading}
            className={`flex-1 p-3 rounded-xl border-2 transition-all flex items-center gap-2 text-left
              ${activeSection === "date-builder" ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"}`}>
            <Heart className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground">Date Builder</p>
              <p className="text-[10px] text-muted-foreground">AI itinerary</p>
            </div>
          </button>
          <button onClick={handleHiddenGems} disabled={hiddenGemsLoading}
            className={`flex-1 p-3 rounded-xl border-2 transition-all flex items-center gap-2 text-left
              ${activeSection === "hidden-gems" ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"}`}>
            <Gem className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground">Hidden Gems</p>
              <p className="text-[10px] text-muted-foreground">Underrated spots</p>
            </div>
          </button>
        </div>

        {/* Live Pulse */}
        {results?.live_pulse && results.live_pulse.length > 0 && (
          <div className="animate-in space-y-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-foreground tracking-wide uppercase">Live Pulse</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {results.live_pulse.slice(0, 6).map((p, i) => (
                <div key={i} className="chip flex-shrink-0 gap-1.5">
                  <Flame className={`w-3 h-3 ${p.count > 3 ? "text-orange-500" : "text-muted-foreground"}`} />
                  <span className="truncate max-w-[120px]">{p.venue}</span>
                  <span className="font-bold text-primary">{p.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {(loading || searching) && (
          <div className="flex items-center justify-center py-16 animate-in">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
              <p className="text-body">{loading ? "Loading OKC..." : "Searching everywhere..."}</p>
              <p className="text-caption">Database • Ticketmaster • AI</p>
            </div>
          </div>
        )}

        {/* Date Builder Results */}
        {activeSection === "date-builder" && results?.date_itinerary && !dateBuilderLoading && (
          <div className="space-y-3 animate-in">
            <div className="card-premium p-4">
              <div className="flex items-center gap-3">
                <div className="icon-premium w-10 h-10"><Heart className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="font-semibold text-foreground">{results.date_itinerary.theme || "Date Night Plan"}</p>
                  <p className="text-xs text-muted-foreground">Est. {results.date_itinerary.total_estimated_cost}</p>
                </div>
              </div>
            </div>
            {results.date_itinerary.itinerary?.map((stop, i) => (
              <div key={i} className="feature-card">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {stop.order}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <h4 className="font-medium text-foreground text-sm">{stop.name}</h4>
                  <p className="text-caption">{stop.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="chip text-[10px] py-0 px-1.5 capitalize">{stop.type}</span>
                    <span className="text-caption">{stop.estimated_cost}</span>
                    <span className="text-caption">~{stop.duration}</span>
                  </div>
                  {stop.tip && <p className="text-xs text-primary italic">💡 {stop.tip}</p>}
                  {stop.address && <p className="text-caption flex items-center gap-0.5"><MapPin className="w-3 h-3" />{stop.address}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hidden Gems Results */}
        {activeSection === "hidden-gems" && results?.hidden_gems && results.hidden_gems.length > 0 && !hiddenGemsLoading && (
          <div className="space-y-3 animate-in">
            <div className="card-premium p-4">
              <div className="flex items-center gap-3">
                <div className="icon-premium w-10 h-10"><Gem className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="font-semibold text-foreground">Hidden Gems</p>
                  <p className="text-xs text-muted-foreground">{results.hidden_gems.length} underrated OKC spots</p>
                </div>
              </div>
            </div>
            {results.hidden_gems.map((gem, i) => (
              <div key={i} className="card-highlight p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Gem className="w-4 h-4 text-primary" />
                  <h4 className="font-medium text-foreground text-sm">{gem.name}</h4>
                  <span className="chip text-[10px] py-0 px-1.5 capitalize">{gem.type}</span>
                </div>
                <p className="text-caption">{gem.description}</p>
                {gem.address && <p className="text-caption flex items-center gap-0.5"><MapPin className="w-3 h-3" />{gem.address}</p>}
                <p className="text-xs text-primary italic">🤫 {gem.why_hidden}</p>
                {gem.insider_tip && <p className="text-xs text-muted-foreground">💡 {gem.insider_tip}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Main Discovery Feed */}
        {activeSection === "discover" && !loading && !searching && results && (
          <div className="space-y-5 animate-in">
            {/* Summary */}
            <div className="card-premium p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="icon-premium w-10 h-10"><Globe className="w-5 h-5 text-primary" /></div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {results.query ? `"${results.query}"` : selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.name : "Everything OKC"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {totalPlaces} places • {totalEvents} events
                    </p>
                  </div>
                </div>
                <button onClick={loadEverything} className="btn-ghost text-xs"><RefreshCw className="w-3 h-3" /></button>
              </div>
            </div>

            {/* Live Ticketmaster Events */}
            {results.live_events.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" /> Live Events ({results.live_events.length})
                  <span className="chip text-[10px] py-0 px-1.5 bg-amber-500/10 text-amber-600">Live</span>
                </h3>
                <div className="grid gap-2">
                  {results.live_events.slice(0, 20).map((event) => (
                    <div key={event.id} className="feature-card group">
                      {event.image_url ? (
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      ) : (
                        <div className="icon-premium w-12 h-12 flex-shrink-0">
                          <Zap className="w-5 h-5 text-amber-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h4 className="font-medium text-foreground text-sm line-clamp-2">{event.title}</h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-caption flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />{formatDate(event.starts_at)} {formatTime(event.starts_at)}
                          </span>
                          <span className="chip text-[10px] py-0 px-1.5">{formatPrice(event.price_min, event.price_max)}</span>
                        </div>
                        {event.venue_name && (
                          <p className="text-caption flex items-center gap-0.5 truncate">
                            <MapPin className="w-3 h-3 flex-shrink-0" />{event.venue_name}
                          </p>
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

            {/* DB Events */}
            {results.events.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Events ({results.events.length})
                </h3>
                <div className="grid gap-2">
                  {results.events.slice(0, 15).map((event: any) => (
                    <div key={event.id} className="feature-card">
                      <div className="icon-premium w-10 h-10"><Calendar className="w-4 h-4 text-primary" /></div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h4 className="font-medium text-foreground text-sm line-clamp-1">{event.title}</h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-caption flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />{formatDate(event.starts_at)} {formatTime(event.starts_at)}
                          </span>
                          <span className="chip text-[10px] py-0 px-1.5">{formatPrice(event.price_min, event.price_max)}</span>
                        </div>
                        {event.venues && <p className="text-caption truncate">{event.venues.name}</p>}
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

            {/* Places */}
            {results.places.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Places ({results.places.length})
                </h3>
                <div className="grid gap-2">
                  {results.places.slice(0, 20).map((place) => (
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

            {/* AI Suggestions — always shown */}
            {results.ai_suggestions.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-500" /> Recommended
                </h3>
                <div className="grid gap-2">
                  {results.ai_suggestions.map((s, i) => (
                    <div key={i} className="card-highlight p-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground text-sm">{s.name}</h4>
                        <span className="chip text-[10px] py-0 px-1.5 capitalize">{s.type}</span>
                        {s.vibe_match && <span className="chip text-[10px] py-0 px-1.5 bg-primary/10 text-primary">{s.vibe_match}% match</span>}
                      </div>
                      <p className="text-caption">{s.description}</p>
                      {s.address && <p className="text-caption flex items-center gap-1"><MapPin className="w-3 h-3" /> {s.address}</p>}
                      <p className="text-xs text-primary italic">{s.why}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KHAOS Organizers */}
            <OrganizersSection />
          </div>
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

function OrganizersSection() {
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: orgs } = await supabase.from("organizers").select("*").order("name");
        const { data: scores } = await supabase.from("khaos_scores").select("*");
        const scoreMap = new Map();
        scores?.forEach((s: any) => scoreMap.set(s.organizer_id, s));
        const merged = (orgs || []).map((o: any) => ({ ...o, khaos: scoreMap.get(o.id) || null }));
        merged.sort((a: any, b: any) => (b.khaos?.score_total || 0) - (a.khaos?.score_total || 0));
        setOrganizers(merged);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || organizers.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Shield className="w-4 h-4 text-primary" /> KHAOS Scores ({organizers.length})
      </h3>
      <div className="grid gap-2">
        {organizers.slice(0, 8).map((org: any) => (
          <div key={org.id} className="feature-card">
            <div className="icon-premium w-10 h-10"><span className="text-lg">🏢</span></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-foreground text-sm truncate">{org.name}</h4>
                {org.claimed && <span className="chip text-[10px] py-0 px-1.5 bg-primary/10 text-primary">✓</span>}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {org.khaos ? <KhaosScoreBadge score={org.khaos.score_total} /> : <span className="text-caption">Unscored</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
