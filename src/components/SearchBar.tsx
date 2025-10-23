import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Heart, Scale } from "lucide-react";
import { useState, useEffect } from "react";
import { getSavedLocations, saveLocation, calculateMidpoint, type Location } from "@/lib/midpointCalculator";

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
  onLocationModeChange?: (mode: "tlc" | "felicia" | "middle", location?: Location) => void;
}

type LocationMode = "tlc" | "felicia" | "middle";

const CATEGORY_OPTIONS = [
  { label: "Restaurants", value: "restaurant" },
  { label: "Cafes", value: "cafe" },
  { label: "Bars", value: "bar" },
  { label: "Parks", value: "park" },
  { label: "Museums", value: "museum" },
  { label: "Movies", value: "movie_theater" },
  { label: "Shopping", value: "shopping_mall" },
  { label: "Art Galleries", value: "art_gallery" },
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
  const [tlcAddress, setTlcAddress] = useState("");
  const [feliciaAddress, setFeliciaAddress] = useState("");
  const [savedLocations, setSavedLocations] = useState(getSavedLocations());

  useEffect(() => {
    const saved = getSavedLocations();
    setSavedLocations(saved);
  }, []);

  const handleQueryChange = (value: string) => {
    const sanitized = value.slice(0, 200);
    onQueryChange(sanitized);
  };

  const handleLocationModeChange = (mode: LocationMode) => {
    setLocationMode(mode);
    if (onLocationModeChange) {
      let location: Location | undefined;
      
      if (mode === "tlc" && savedLocations.myPlace) {
        location = savedLocations.myPlace;
      } else if (mode === "felicia" && savedLocations.partnerPlace) {
        location = savedLocations.partnerPlace;
      } else if (mode === "middle" && savedLocations.myPlace && savedLocations.partnerPlace) {
        location = calculateMidpoint(savedLocations.myPlace, savedLocations.partnerPlace);
      }
      
      onLocationModeChange(mode, location);
    }
  };

  const geocodeAddress = async (address: string): Promise<Location | null> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng, label: address };
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
    return null;
  };

  const handleSaveLocation = async (type: "tlc" | "felicia") => {
    const address = type === "tlc" ? tlcAddress : feliciaAddress;
    if (!address) return;

    const location = await geocodeAddress(address);
    if (location) {
      const storageKey = type === "tlc" ? "myPlace" : "partnerPlace";
      saveLocation(storageKey, location);
      setSavedLocations(getSavedLocations());
      
      if (locationMode === type) {
        onLocationModeChange?.(type, location);
      } else if (locationMode === "middle") {
        const updated = getSavedLocations();
        if (updated.myPlace && updated.partnerPlace) {
          const midpoint = calculateMidpoint(updated.myPlace, updated.partnerPlace);
          onLocationModeChange?.("middle", midpoint);
        }
      }
    }
  };

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
              disabled={!savedLocations.myPlace || !savedLocations.partnerPlace}
              className={`group p-4 rounded-xl font-bold text-sm transition-all ${
                locationMode === "middle"
                  ? "bg-gradient-to-br from-primary to-accent text-white shadow-glow scale-105"
                  : !savedLocations.myPlace || !savedLocations.partnerPlace
                  ? "bg-muted border-2 border-border opacity-50 cursor-not-allowed"
                  : "bg-card border-2 border-border hover:border-primary/50 hover:shadow-md"
              }`}
            >
              <Scale className={`w-6 h-6 mx-auto mb-2 ${locationMode === "middle" ? "text-white" : "text-success"}`} />
              <div className="text-center">Middle Ground</div>
            </button>
          </div>

          {/* Location Inputs */}
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">TLC's Address</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter TLC's address"
                  value={tlcAddress}
                  onChange={(e) => setTlcAddress(e.target.value)}
                  className="h-11 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleSaveLocation("tlc")}
                />
                <Button
                  size="sm"
                  onClick={() => handleSaveLocation("tlc")}
                  disabled={!tlcAddress}
                  className="h-11 px-4 text-xs font-bold"
                >
                  Save
                </Button>
              </div>
              {savedLocations.myPlace && (
                <p className="text-xs text-success font-medium">✓ Location saved</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Felicia's Address</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Felicia's address"
                  value={feliciaAddress}
                  onChange={(e) => setFeliciaAddress(e.target.value)}
                  className="h-11 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleSaveLocation("felicia")}
                />
                <Button
                  size="sm"
                  onClick={() => handleSaveLocation("felicia")}
                  disabled={!feliciaAddress}
                  className="h-11 px-4 text-xs font-bold"
                >
                  Save
                </Button>
              </div>
              {savedLocations.partnerPlace && (
                <p className="text-xs text-success font-medium">✓ Location saved</p>
              )}
            </div>
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
          <span className="text-base font-bold text-foreground">Search for date spots</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search nearby date spots..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !disabled && onSearch()}
            disabled={disabled || loading}
            className="h-14 pl-12 pr-4 text-base shadow-lg hover:shadow-xl focus:shadow-xl transition-all duration-300 border-2 border-border/50 focus:border-primary/50 rounded-2xl bg-card/80 backdrop-blur-sm"
            maxLength={200}
          />
        </div>
        
        <Select value={radius} onValueChange={onRadiusChange} disabled={disabled || loading}>
          <SelectTrigger className="w-[160px] h-14 shadow-lg rounded-xl border-2 border-border/50 hover:border-primary/30 transition-all bg-card/80 backdrop-blur-sm">
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

      {/* Step 4: Optional Categories */}
      {onCategoryToggle && categoryType && (
        <div className="space-y-3 p-5 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border-2 border-border">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center text-base font-black shadow-md">
              4
            </div>
            <span className="text-base font-bold text-foreground">Narrow it down (optional)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORY_OPTIONS.map((category) => {
              const isSelected = selectedCategories.includes(category.value);
              return (
                <Badge
                  key={category.value}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all hover:scale-105 justify-center py-2 ${
                    isSelected ? "shadow-md" : ""
                  }`}
                  onClick={() => !disabled && !loading && onCategoryToggle(category.value)}
                >
                  {category.label}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};