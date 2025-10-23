import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Heart, Scale } from "lucide-react";
import { useState } from "react";

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
  { label: "All Food Places", value: "food" },
  { label: "Restaurants", value: "restaurant" },
  { label: "Cafes & Coffee", value: "cafe" },
  { label: "Bars & Lounges", value: "bar" },
  { label: "Bakery", value: "bakery" },
  { label: "Ice Cream", value: "ice_cream" },
  { label: "Pizza", value: "pizza" },
  { label: "Sushi", value: "sushi" },
  { label: "Dessert", value: "dessert" },
];

const ACTIVITY_CATEGORIES = [
  { label: "All Activities", value: "activity" },
  { label: "Parks & Nature", value: "park" },
  { label: "Museums", value: "museum" },
  { label: "Movies & Theater", value: "movie_theater" },
  { label: "Shopping", value: "shopping_mall" },
  { label: "Art Galleries", value: "art_gallery" },
  { label: "Bowling", value: "bowling_alley" },
  { label: "Arcade & Games", value: "amusement_park" },
  { label: "Spa & Wellness", value: "spa" },
  { label: "Live Music", value: "night_club" },
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

  const handleLocationModeChange = (mode: LocationMode) => {
    setLocationMode(mode);
    if (onLocationModeChange) {
      onLocationModeChange(mode);
    }
  };

  // Get relevant categories based on type
  const getCategories = () => {
    if (categoryType === "food") return FOOD_CATEGORIES;
    if (categoryType === "activity") return ACTIVITY_CATEGORIES;
    return [...FOOD_CATEGORIES, ...ACTIVITY_CATEGORIES];
  };

  const categories = getCategories();

  return (
    <div className="space-y-5">
      {/* Step 1: Choose Location Mode */}
      {onLocationModeChange && (
        <div className="space-y-4 p-5 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border-2 border-primary/30">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center text-base font-black shadow-md">
              1
            </div>
            <span className="text-base font-bold text-foreground">Whose location should we search?</span>
          </div>
          
          {/* Location Mode Pills */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleLocationModeChange("tlc")}
              className={`group p-4 rounded-xl font-bold text-sm transition-all ${
                locationMode === "tlc"
                  ? "bg-gradient-to-br from-primary to-accent text-white shadow-glow scale-105"
                  : "bg-card border-2 border-border hover:border-primary/50 hover:shadow-md"
              }`}
            >
              <MapPin className={`w-6 h-6 mx-auto mb-2 ${locationMode === "tlc" ? "text-white" : "text-primary"}`} />
              <div className="text-center">TLC Place</div>
            </button>
            
            <button
              onClick={() => handleLocationModeChange("felicia")}
              className={`group p-4 rounded-xl font-bold text-sm transition-all ${
                locationMode === "felicia"
                  ? "bg-gradient-to-br from-primary to-accent text-white shadow-glow scale-105"
                  : "bg-card border-2 border-border hover:border-primary/50 hover:shadow-md"
              }`}
            >
              <Heart className={`w-6 h-6 mx-auto mb-2 ${locationMode === "felicia" ? "text-white" : "text-accent"}`} />
              <div className="text-center">Felicia Place</div>
            </button>
            
            <button
              onClick={() => handleLocationModeChange("middle")}
              className={`group p-4 rounded-xl font-bold text-sm transition-all ${
                locationMode === "middle"
                  ? "bg-gradient-to-br from-primary to-accent text-white shadow-glow scale-105"
                  : "bg-card border-2 border-border hover:border-primary/50 hover:shadow-md"
              }`}
            >
              <Scale className={`w-6 h-6 mx-auto mb-2 ${locationMode === "middle" ? "text-white" : "text-success"}`} />
              <div className="text-center">Middle Ground</div>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Choose Type - REQUIRED FIRST */}
      {onCategoryTypeChange && (
        <div className="space-y-3 p-5 bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl border-2 border-primary/20">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center text-base font-black shadow-md">
              2
            </div>
            <span className="text-base font-bold text-foreground">What are you looking for?</span>
          </div>
          <div className="flex gap-3 flex-wrap">
            {(["food", "activity", "both"] as const).map((type) => (
              <button
                key={type}
                onClick={() => onCategoryTypeChange(type)}
                className={`flex-1 min-w-[100px] py-3 px-5 rounded-xl font-bold text-sm transition-all ${
                  categoryType === type
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-glow scale-105"
                    : "bg-card border-2 border-border hover:border-primary/50 hover:shadow-md"
                }`}
              >
                {type === "food" && "🍽️ Food"}
                {type === "activity" && "🎯 Activity"}
                {type === "both" && "✨ Both"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Search - Only available after picking type */}
      <div className={`space-y-3 transition-all ${categoryType === "both" ? "opacity-100" : categoryType ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center text-base font-black shadow-md">
            3
          </div>
          <span className="text-base font-bold text-foreground">Choose search radius</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
        <Select value={radius} onValueChange={onRadiusChange} disabled={disabled || loading}>
          <SelectTrigger className="flex-1 h-14 shadow-lg rounded-xl border-2 border-border/50 hover:border-primary/30 transition-all bg-card/80 backdrop-blur-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
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
          size="lg"
          className="h-14 px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl text-base font-semibold gradient-primary"
        >
          <Search className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? "Searching..." : "Search"}
        </Button>
        </div>
      </div>

      {/* Step 4: Optional Category Filter */}
      {onCategoryToggle && categoryType && categoryType !== "both" && (
        <div className="space-y-3 p-5 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border-2 border-border">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center text-base font-black shadow-md">
              4
            </div>
            <span className="text-base font-bold text-foreground">Narrow it down (optional)</span>
          </div>
          <Select 
            value={selectedCategories[0] || ""} 
            onValueChange={(value) => onCategoryToggle(value)}
            disabled={disabled || loading}
          >
            <SelectTrigger className="h-12 shadow-md rounded-xl border-2 border-border/50 hover:border-primary/30 transition-all bg-card">
              <SelectValue placeholder={`Select ${categoryType} type...`} />
            </SelectTrigger>
            <SelectContent className="rounded-xl max-h-[300px]">
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};