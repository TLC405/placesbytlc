import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, MapPin, DollarSign, Star, Clock, X, Mic, Sparkles, Map } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface SearchFacet {
  type: "price" | "distance" | "rating" | "open" | "tag";
  value: string | number;
  label: string;
}

interface EpicSearchProps {
  onSearch: (query: string, facets: SearchFacet[]) => void;
  disabled?: boolean;
}

export const EpicSearch = ({ onSearch, disabled }: EpicSearchProps) => {
  const [query, setQuery] = useState("");
  const [facets, setFacets] = useState<SearchFacet[]>([]);
  const [distance, setDistance] = useState([5]);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [rating, setRating] = useState<string>("all");
  const [openNow, setOpenNow] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("epic_recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch (e) {
        console.error("Failed to load recent searches", e);
      }
    }
  }, []);

  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("epic_recent_searches", JSON.stringify(updated));
  }, [recentSearches]);

  const handleSearch = useCallback(() => {
    const allFacets: SearchFacet[] = [];
    
    if (priceRange !== "all") {
      allFacets.push({ type: "price", value: priceRange, label: `$${priceRange}` });
    }
    
    if (rating !== "all") {
      allFacets.push({ type: "rating", value: rating, label: `${rating}+ stars` });
    }
    
    if (openNow) {
      allFacets.push({ type: "open", value: "now", label: "Open now" });
    }
    
    allFacets.push({ type: "distance", value: distance[0], label: `${distance[0]} mi` });
    
    onSearch(query, allFacets);
    saveRecentSearch(query);
  }, [query, priceRange, rating, openNow, distance, onSearch, saveRecentSearch]);

  const removeFacet = (index: number) => {
    setFacets(prev => prev.filter((_, i) => i !== index));
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error("Voice search not supported in this browser");
      return;
    }
    
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      toast.success(`Heard: "${transcript}"`);
    };
    
    recognition.onerror = () => {
      toast.error("Voice recognition failed");
    };
    
    recognition.start();
    toast.info("Listening...");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled) {
      handleSearch();
    }
  };

  return (
    <Card className="p-6 space-y-6 border-2">
      {/* Main Search Input */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Search everywhere... restaurants, activities, vibes"
              className="pl-10 pr-10 h-14 text-lg border-2"
              disabled={disabled}
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <Button
            onClick={handleVoiceSearch}
            variant="outline"
            size="icon"
            className="h-14 w-14"
            disabled={disabled}
          >
            <Mic className="w-5 h-5" />
          </Button>
          <Button
            onClick={handleSearch}
            size="lg"
            className="h-14 px-8 text-lg"
            disabled={disabled || !query.trim()}
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && !query && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Recent:</span>
            {recentSearches.map((search, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => setQuery(search)}
              >
                {search}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Facets/Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Price Range
          </label>
          <Select value={priceRange} onValueChange={setPriceRange} disabled={disabled}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Price</SelectItem>
              <SelectItem value="1">$ Budget</SelectItem>
              <SelectItem value="2">$$ Moderate</SelectItem>
              <SelectItem value="3">$$$ Upscale</SelectItem>
              <SelectItem value="4">$$$$ Luxury</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Star className="w-4 h-4" />
            Min Rating
          </label>
          <Select value={rating} onValueChange={setRating} disabled={disabled}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Rating</SelectItem>
              <SelectItem value="3">3+ ⭐</SelectItem>
              <SelectItem value="4">4+ ⭐⭐</SelectItem>
              <SelectItem value="4.5">4.5+ ⭐⭐⭐</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Distance: {distance[0]} mi
          </label>
          <Slider
            value={distance}
            onValueChange={setDistance}
            min={1}
            max={20}
            step={1}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Open Now
          </label>
          <Button
            variant={openNow ? "default" : "outline"}
            onClick={() => setOpenNow(!openNow)}
            className="w-full"
            disabled={disabled}
          >
            {openNow ? "Yes" : "No"}
          </Button>
        </div>
      </div>

      {/* Active Facets */}
      {facets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {facets.map((facet, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="flex items-center gap-2"
            >
              {facet.label}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeFacet(i)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Legend */}
      <p className="text-xs text-muted-foreground text-center italic">
        Search everywhere. Filter fast. Find perfect.
      </p>
    </Card>
  );
};
