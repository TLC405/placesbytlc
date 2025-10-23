import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ExternalLink, Loader2, Music, Palette, Utensils, Trophy, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const eventIcons: Record<string, any> = {
  concert: Music,
  art: Palette,
  food: Utensils,
  sports: Trophy,
  default: Sparkles,
};

interface Event {
  id: string;
  event_name: string;
  event_type: string;
  venue_name: string;
  event_date: string;
  event_time: string;
  description: string;
  price_range: string;
  url: string;
}

export const EventsFeed = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Try to get cached events first
      const { data: cached } = await supabase
        .from('okc_events_cache')
        .select('*')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(6);

      if (cached && cached.length > 0) {
        setEvents(cached);
        setLoading(false);
        return;
      }

      // If no cached events, trigger discovery
      const { data } = await supabase.functions.invoke('event-discovery');
      
      if (data?.events) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p className="text-sm text-muted-foreground">Discovering OKC events...</p>
        </div>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground text-center">
          No upcoming events found. Check back soon!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        <h3 className="font-semibold">Upcoming in OKC</h3>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const Icon = eventIcons[event.event_type] || eventIcons.default;
          return (
            <Card key={event.id} className="p-4">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {event.event_type}
                      </Badge>
                      {event.price_range && (
                        <Badge variant="outline" className="text-xs">
                          {event.price_range}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

              <h4 className="font-medium text-sm line-clamp-2">
                {event.event_name}
              </h4>

              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(event.event_date)}</span>
                  {event.event_time && <span>• {event.event_time}</span>}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className="line-clamp-1">{event.venue_name}</span>
                </div>
              </div>

              {event.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
              )}

              {event.url && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2"
                  asChild
                >
                  <a href={event.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3" />
                    Details
                  </a>
                </Button>
              )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
