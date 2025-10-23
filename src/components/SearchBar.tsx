import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Settings, Coffee, UtensilsCrossed, Wine, Music, ShoppingBag, Film, Heart, Sparkles } from "lucide-react";

interface SearchBarProps {
  query: string;
  radius: string;
  onQueryChange: (query: string) => void;
  onRadiusChange: (radius: string) => void;
  onSearch: () => void;
  onUseLocation: () => void;
  onSettings: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const quickSearches = [
  { label: "Romantic Dinner", query: "romantic restaurant dinner", icon: Heart },
  { label: "Coffee Date", query: "coffee shop cafe", icon: Coffee },
  { label: "Fine Dining", query: "fine dining restaurant", icon: UtensilsCrossed },
  { label: "Wine Bar", query: "wine bar", icon: Wine },
  { label: "Live Music", query: "live music venue", icon: Music },
  { label: "Shopping", query: "shopping mall boutique", icon: ShoppingBag },
  { label: "Movies", query: "movie theater cinema", icon: Film },
  { label: "Date Night", query: "date night", icon: Sparkles },
];

export const SearchBar = ({
  query,
  radius,
  onQueryChange,
  onRadiusChange,
  onSearch,
  onUseLocation,
  onSettings,
  disabled,
  loading,
}: SearchBarProps) => {
  const handleQuickSearch = (searchQuery: string) => {
    onQueryChange(searchQuery);
    setTimeout(() => onSearch(), 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search date ideas (e.g., sushi, jazz, arcade)"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !disabled && onSearch()}
          disabled={disabled || loading}
          className="flex-1 min-w-[200px] h-11 shadow-sm focus:shadow-md transition-shadow"
        />
        
        <Select value={radius} onValueChange={onRadiusChange} disabled={disabled || loading}>
          <SelectTrigger className="w-[140px] h-11 shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1609">1 mile</SelectItem>
            <SelectItem value="3219">2 miles</SelectItem>
            <SelectItem value="8047">5 miles</SelectItem>
            <SelectItem value="16093">10 miles</SelectItem>
            <SelectItem value="32187">20 miles</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          onClick={onSearch} 
          disabled={disabled || loading}
          className="h-11 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
        >
          <Search className="w-4 h-4 mr-2" />
          {loading ? "Searching..." : "Search"}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onUseLocation} 
          disabled={disabled || loading}
          className="h-11 shadow-sm hover:shadow-md transition-all"
        >
          <MapPin className="w-4 h-4 mr-2" />
          My Location
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onSettings}
          className="h-11 w-11 shadow-sm hover:shadow-md transition-all"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Search Buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-medium text-muted-foreground self-center">Quick searches:</span>
        {quickSearches.map((item) => {
          const Icon = item.icon;
          return (
            <Badge
              key={item.query}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md px-3 py-1.5"
              onClick={() => !disabled && !loading && handleQuickSearch(item.query)}
            >
              <Icon className="w-3 h-3 mr-1.5" />
              {item.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};