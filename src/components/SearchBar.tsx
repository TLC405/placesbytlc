import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Heart, Scale, SlidersHorizontal } from "lucide-react";
import { useState, useCallback, memo } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SearchBarProps {
  query: string;
  radius: string;
  onQueryChange: (query: string) => void;
  onRadiusChange: (radius: string) => void;
  onSearch: () => void;
  disabled?: boolean;
  loading?: boolean;
  selectedCategories?: string[];
  onCategoryToggle?: (category: string) => void;
  categoryType?: "food" | "activity" | "both";
  onCategoryTypeChange?: (type: "food" | "activity" | "both") => void;
  onLocationModeChange?: (mode: "tlc" | "partner" | "middle") => void;
}

type LocationMode = "tlc" | "partner" | "middle";

const FOOD_CATEGORIES = [
  { label: "All Food", value: "food" },
  { label: "Restaurants", value: "restaurant" },
  { label: "Cafes", value: "cafe" },
  { label: "Bars", value: "bar" },
  { label: "Bakery", value: "bakery" },
  { label: "Pizza", value: "pizza" },
  { label: "Sushi", value: "sushi" },
];

const ACTIVITY_CATEGORIES = [
  { label: "All Activities", value: "activity" },
  { label: "Parks", value: "park" },
  { label: "Museums", value: "museum" },
  { label: "Movies", value: "movie_theater" },
  { label: "Shopping", value: "shopping_mall" },
  { label: "Art", value: "art_gallery" },
  { label: "Spa", value: "spa" },
];

const SearchBarComponent = ({
  query,
  radius,
  onQueryChange,
  onRadiusChange,
  onSearch,
  disabled,
  loading,
  selectedCategories = [],
  onCategoryToggle,
  categoryType = "both",
  onCategoryTypeChange,
  onLocationModeChange,
}: SearchBarProps) => {
  const [locationMode, setLocationMode] = useState<LocationMode>("tlc");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleLocationModeChange = useCallback((mode: LocationMode) => {
    setLocationMode(mode);
    onLocationModeChange?.(mode);
  }, [onLocationModeChange]);

  const handleSearch = useCallback(() => {
    if (!disabled && !loading) {
      onSearch();
    }
  }, [disabled, loading, onSearch]);

  return (
    <div className="space-y-4">
      {/* Compact Location Selector */}
      {onLocationModeChange && (
        <div className="flex gap-2 p-3 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-md rounded-2xl border-2 border-border/40 shadow-lg animate-fade-in">
          <button
            onClick={() => handleLocationModeChange("tlc")}
            className={`flex-1 p-3 rounded-xl text-sm font-bold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              locationMode === "tlc"
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-xl scale-105"
                : "hover:bg-accent/20 hover:scale-105"
            }`}
            aria-label="Search from TLC location"
            aria-pressed={locationMode === "tlc"}
          >
            <MapPin className="w-5 h-5 mx-auto mb-1" aria-hidden="true" />
            TLC
          </button>
          <button
            onClick={() => handleLocationModeChange("partner")}
            className={`flex-1 p-3 rounded-xl text-sm font-bold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              locationMode === "partner"
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-xl shadow-primary/30 animate-pulse scale-105"
                : "hover:bg-accent/20 hover:scale-105"
            }`}
            aria-label="Search from partner location"
            aria-pressed={locationMode === "partner"}
          >
            <Heart className="w-5 h-5 mx-auto mb-1 fill-current" aria-hidden="true" />
            💝 Partner
          </button>
          <button
            onClick={() => handleLocationModeChange("middle")}
            className={`flex-1 p-3 rounded-xl text-sm font-bold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              locationMode === "middle"
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-xl scale-105"
                : "hover:bg-accent/20 hover:scale-105"
            }`}
            aria-label="Search from middle point between locations"
            aria-pressed={locationMode === "middle"}
          >
            <Scale className="w-5 h-5 mx-auto mb-1" aria-hidden="true" />
            Middle
          </button>
        </div>
      )}

      {/* Main Search Controls */}
      <div className="flex gap-2">
        {onCategoryTypeChange && (
          <Select value={categoryType} onValueChange={onCategoryTypeChange} disabled={disabled || loading}>
            <SelectTrigger className="w-[140px] h-12 shadow-md font-semibold border-2 border-border/50 hover:border-primary/50 transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="food">🍽️ Food</SelectItem>
              <SelectItem value="activity">🎯 Activity</SelectItem>
              <SelectItem value="both">✨ Both</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Select value={radius} onValueChange={onRadiusChange} disabled={disabled || loading}>
          <SelectTrigger className="w-[120px] h-12 shadow-md font-semibold border-2 border-border/50 hover:border-primary/50 transition-all">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1609">1 mi</SelectItem>
            <SelectItem value="3219">2 mi</SelectItem>
            <SelectItem value="8047">5 mi</SelectItem>
            <SelectItem value="16093">10 mi</SelectItem>
            <SelectItem value="32187">20 mi</SelectItem>
          </SelectContent>
        </Select>

        {onCategoryToggle && (
          <Button 
            variant="outline"
            size="icon"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="h-12 w-12 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 border-2 border-border/50 hover:border-primary/50"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        )}

        <Button 
          onClick={handleSearch} 
          disabled={disabled || loading}
          className="flex-1 h-12 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 font-bold gradient-primary hover:scale-105 text-base focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={loading ? "Searching for places" : "Search for places"}
        >
          <Search className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Advanced Filters (Collapsible) */}
      {onCategoryToggle && (
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleContent>
            <div className="p-4 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-md rounded-2xl border-2 border-border/40 shadow-lg space-y-3 animate-fade-in">
              <p className="text-sm font-bold text-muted-foreground mb-2 tracking-wide">🎯 REFINE SEARCH</p>
              
              {categoryType === "both" ? (
                <div className="grid grid-cols-2 gap-2">
                  <Select 
                    value={selectedCategories.find(cat => FOOD_CATEGORIES.some(fc => fc.value === cat)) || ""} 
                    onValueChange={onCategoryToggle}
                    disabled={disabled || loading}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Food type" />
                    </SelectTrigger>
                    <SelectContent>
                      {FOOD_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value} className="text-sm">
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={selectedCategories.find(cat => ACTIVITY_CATEGORIES.some(ac => ac.value === cat)) || ""} 
                    onValueChange={onCategoryToggle}
                    disabled={disabled || loading}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVITY_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value} className="text-sm">
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <Select 
                  value={selectedCategories[0] || ""} 
                  onValueChange={onCategoryToggle}
                  disabled={disabled || loading}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder={`Select ${categoryType} type`} />
                  </SelectTrigger>
                  <SelectContent>
                    {(categoryType === "food" ? FOOD_CATEGORIES : ACTIVITY_CATEGORIES).map((cat) => (
                      <SelectItem key={cat.value} value={cat.value} className="text-sm">
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export const SearchBar = memo(SearchBarComponent);
