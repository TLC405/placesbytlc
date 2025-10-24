import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Heart, Scale, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
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
  onLocationModeChange?: (mode: "tlc" | "felicia" | "middle") => void;
}

type LocationMode = "tlc" | "felicia" | "middle";

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

export const SearchBar = ({
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

  const handleLocationModeChange = (mode: LocationMode) => {
    setLocationMode(mode);
    onLocationModeChange?.(mode);
  };

  return (
    <div className="space-y-3">
      {/* Compact Location Selector */}
      {onLocationModeChange && (
        <div className="flex gap-2 p-3 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
          <button
            onClick={() => handleLocationModeChange("tlc")}
            className={`flex-1 p-2 rounded-lg text-sm font-semibold transition-all ${
              locationMode === "tlc"
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-md"
                : "hover:bg-accent/20"
            }`}
          >
            <MapPin className="w-4 h-4 mx-auto mb-1" />
            TLC
          </button>
          <button
            onClick={() => handleLocationModeChange("felicia")}
            className={`flex-1 p-2 rounded-lg text-sm font-semibold transition-all ${
              locationMode === "felicia"
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-md"
                : "hover:bg-accent/20"
            }`}
          >
            <Heart className="w-4 h-4 mx-auto mb-1" />
            Felicia
          </button>
          <button
            onClick={() => handleLocationModeChange("middle")}
            className={`flex-1 p-2 rounded-lg text-sm font-semibold transition-all ${
              locationMode === "middle"
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-md"
                : "hover:bg-accent/20"
            }`}
          >
            <Scale className="w-4 h-4 mx-auto mb-1" />
            Middle
          </button>
        </div>
      )}

      {/* Main Search Controls */}
      <div className="flex gap-2">
        {onCategoryTypeChange && (
          <Select value={categoryType} onValueChange={onCategoryTypeChange} disabled={disabled || loading}>
            <SelectTrigger className="w-[140px] h-11 shadow-sm">
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
          <SelectTrigger className="w-[120px] h-11 shadow-sm">
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
            className="h-11 w-11 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        )}

        <Button 
          onClick={onSearch} 
          disabled={disabled || loading}
          className="flex-1 h-11 shadow-md hover:shadow-lg transition-all font-semibold gradient-primary"
        >
          <Search className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Advanced Filters (Collapsible) */}
      {onCategoryToggle && (
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleContent>
            <div className="p-3 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground mb-2">REFINE SEARCH</p>
              
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
