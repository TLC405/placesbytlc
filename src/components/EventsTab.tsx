import { useState, useEffect } from "react";
import { Calendar, MapPin, ExternalLink, Loader2, DollarSign, Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { KhaosScoreBadge } from "@/components/KhaosScoreCard";
import { toast } from "sonner";

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  starts_at: string | null;
  ends_at: string | null;
  ticket_url: string | null;
  event_url: string | null;
  price_min: number | null;
  price_max: number | null;
  tags: string[];
  source: string;
  status: string;
  venues: { name: string; city: string | null; address: string | null } | null;
  organizers: { id: string; name: string } | null;
}

export const EventsTab = () => {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [discovering, setDiscovering] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [khaosMap, setKhaosMap] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("events")
        .select("*, venues(name, city, address), organizers(id, name)")
        .gte("starts_at", now)
        .eq("status", "active")
        .order("starts_at", { ascending: true })
        .limit(50);

      if (error) throw error;
      setEvents((data as any) || []);

      // Fetch KHAOS scores for organizers
      const orgIds = [...new Set((data || []).map((e: any) => e.organizers?.id).filter(Boolean))];
      if (orgIds.length > 0) {
        const { data: scores } = await supabase.from("khaos_scores").select("organizer_id, score_total").in("organizer_id", orgIds);
        const map = new Map<string, number>();
        scores?.forEach((s: any) => map.set(s.organizer_id, s.score_total));
        setKhaosMap(map);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const discoverEvents = async () => {
    setDiscovering(true);
    try {
      const { data, error } = await supabase.functions.invoke("tlc-engine-discover");
      if (error) throw error;
      toast.success(`Discovered ${data?.imported || 0} events`);
      await fetchEvents();
    } catch (err) {
      console.error("Discovery error:", err);
      toast.error("Failed to discover events");
    } finally {
      setDiscovering(false);
    }
  };

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.venues?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.organizers?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search events..." className="h-12 pl-11 bg-muted border-0 rounded-xl" />
        </div>
        <button onClick={discoverEvents} disabled={discovering} className="btn-primary h-12 px-4 flex-shrink-0">
          <RefreshCw className={`w-4 h-4 ${discovering ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="card-premium p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="icon-premium w-10 h-10">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Upcoming Events</p>
              <p className="text-xs text-muted-foreground">OKC • 60mi radius</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{filtered.length}</p>
            <p className="text-caption">events</p>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-body">No upcoming events</p>
          <p className="text-caption mb-4">Tap the refresh button to discover events</p>
          <button onClick={discoverEvents} disabled={discovering} className="btn-primary">
            <RefreshCw className={`w-4 h-4 ${discovering ? "animate-spin" : ""}`} />
            Discover Events
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((event) => (
            <div key={event.id} className="feature-card">
              <div className="icon-premium w-12 h-12 flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="font-medium text-foreground text-sm line-clamp-2">{event.title}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-caption flex items-center gap-0.5">
                    <Calendar className="w-3 h-3" />
                    {formatDate(event.starts_at)} {formatTime(event.starts_at)}
                  </span>
                  <span className="chip text-[10px] py-0 px-1.5">
                    <DollarSign className="w-2.5 h-2.5" />
                    {formatPrice(event.price_min, event.price_max)}
                  </span>
                </div>
                {event.venues && (
                  <p className="text-caption flex items-center gap-0.5 truncate">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    {event.venues.name}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  {event.organizers && (
                    <span className="text-caption truncate">{event.organizers.name}</span>
                  )}
                  {event.organizers?.id && khaosMap.has(event.organizers.id) && (
                    <KhaosScoreBadge score={khaosMap.get(event.organizers.id)!} />
                  )}
                  <span className="chip text-[9px] py-0 px-1 capitalize opacity-60">{event.source.replace("_", " ")}</span>
                </div>
              </div>
              {(event.ticket_url || event.event_url) && (
                <a href={event.ticket_url || event.event_url || "#"} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 p-2 rounded-lg hover:bg-muted transition-colors" onClick={(e) => e.stopPropagation()}>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
