import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Sparkles,
  Download,
  Heart,
  Palette,
  Users2,
  Film,
  Music2,
} from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { PlaceCard } from "@/components/PlaceCard";
import { EmptyState } from "@/components/EmptyState";
import { usePlacesSearch } from "@/hooks/usePlacesSearch";
import { useGeolocation } from "@/hooks/useGeolocation";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { PlaceItem } from "@/types";
import {
  trackPlaceView,
  trackPlaceSave,
  trackSearch,
} from "@/components/ActivityTracker";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { StyleGallery } from "@/components/cartoon/StyleGallery";
import { CartoonToHumanGenerator } from "@/components/cartoon/CartoonToHumanGenerator";
import { useAuth } from "@/contexts/AuthContext";
import { NavigationBar } from "@/components/organisms/NavigationBar";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { AppLogo } from "@/components/AppLogo";

export default function UnifiedHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState("8047");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryType, setCategoryType] = useState<"food" | "activity" | "both">("both");

  const { location } =          >
            <Heart className="w-5 h-5 mx-auto mb-1 fill-current" aria-hidden="true" />
            💝 Partner
          </button>
          <button
            onClick={() => handleLocationModeChange("middle")}
            className={`flex-1 p-3 rounded-xl text-sm font-bold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-shroomGreen focus-visible:ring-offset-2 ${
              locationMode === "middle"
                ? "bg-gradient-to-r from-shroomGreen to-shroomYellow text-shroomBrown shadow-xl scale-105"
                : "hover:bg-shroomYellow/20 hover:scale-105"
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
            <SelectTrigger className="w-[140px] h-12 shadow-md font-semibold border-2 border-shroomGreen/30 hover:border-shroomGreen/50 transition-all">
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
          <SelectTrigger className="w-[120px] h-12 shadow-md font-semibold border-2 border-shroomGreen/30 hover:border-shroomGreen/50 transition-all">
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
            className="h-12 w-12 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 border-2 border-shroomGreen/30 hover:border-shroomGreen/50"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        )}

        <Button 
          onClick={handleSearch} 
          disabled={disabled || loading}
          className="flex-1 h-12 shadow-xl hover:shadow-2xl hover:shadow-shroomYellow/20 transition-all duration-300 font-bold bg-shroomYellow text-shroomBrown hover:bg-shroomYellow/90 hover:scale-105 text-base focus-visible:ring-2 focus-visible:ring-shroomGreen focus-visible:ring-offset-2"
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
