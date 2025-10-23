import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Search, Sparkles } from "lucide-react";
import { PlaceItem } from "@/types";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { Save, Trash2, X, Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { PlaceCard } from "@/components/PlaceCard";
import { EmptyState } from "@/components/EmptyState";
import { FilterBar } from "@/components/FilterBar";
import { usePlacesSearch } from "@/hooks/usePlacesSearch";
import { useGeolocation } from "@/hooks/useGeolocation";
import { LocationPresets } from "@/components/LocationPresets";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EventsFeed } from "@/components/EventsFeed";
import { UpdatesPanel } from "@/components/UpdatesPanel";
import { trackPlaceView, trackPlaceSave, trackSearch } from "@/components/ActivityTracker";
import { WeatherWidget } from "@/components/WeatherWidget";
import { useWeather } from "@/hooks/useWeather";

export default function Explore() {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState("8047"); // 5 miles in meters
  const [plan, setPlan] = useState<PlaceItem[]>([]);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<PlaceItem[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryType, setCategoryType] = useState<"food" | "activity" | "both">("both");
  const [showUpdates, setShowUpdates] = useState(false);

  // Custom hooks
  const { location, setCustomLocation } = useGeolocation();
  const { results, isSearching, search } = usePlacesSearch({
    onError: (message) => setError(message),
  });
  const { weather, isLoading: isWeatherLoading } = useWeather(location);

  useEffect(() => {
    setPlan(storage.getPlan());
    setFavorites(storage.getFavorites());
  }, []);

  // Sort and filter results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results];

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter(place => storage.isFavorite(place.id));
    }

    // Sort
    if (sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "reviews") {
      filtered.sort((a, b) => (b.userRatingsTotal || 0) - (a.userRatingsTotal || 0));
    } else if (sortBy === "distance") {
      filtered.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }

    return filtered;
  }, [results, sortBy, showFavoritesOnly]);

  const handleAddToPlan = useCallback((place: PlaceItem) => {
    const existing = storage.getPlan();
    if (existing.some((p) => p.id === place.id)) {
      toast.info("Already in your plan!");
      return;
    }
    
    storage.addToPlan(place);
    setPlan(storage.getPlan());
    trackPlaceSave(place);
    toast.success(`${place.name} added to plan!`);
  }, []);

  const handleFavoriteToggle = useCallback((place: PlaceItem, isFavorite: boolean) => {
    setFavorites(storage.getFavorites());
    toast.success(isFavorite ? `${place.name} added to favorites!` : `${place.name} removed from favorites`);
  }, []);

  const handleCategoryToggle = useCallback((category: string) => {
    // Single selection instead of multi-select
    setSelectedCategories([category]);
  }, []);

  const handleLocationModeChange = (mode: "tlc" | "felicia" | "middle") => {
    const modeLabels = {
      tlc: "TLC Place",
      felicia: "Felicia Place", 
      middle: "Middle Ground"
    };
    toast.success(`🎯 Searching from ${modeLabels[mode]}!`);
  };

  const handleSearch = useCallback(() => {
    // Require category type selection first
    if (!categoryType || categoryType === "both" && !query.trim() && selectedCategories.length === 0) {
      toast.error("Pick Food, Activity, or Both first! 👆", {
        duration: 3000,
      });
      return;
    }

    const locationToUse = location;
    
    if (!locationToUse) {
      toast.error("Location not available. Please enable location services.");
      return;
    }

    const searchQuery = selectedCategories.length > 0 
      ? selectedCategories[0] 
      : categoryType;

    if (!searchQuery) {
      toast.info("Enter a search term or select categories!");
      return;
    }

    setError("");
    search(searchQuery, locationToUse, parseInt(radius, 10));
    trackSearch(searchQuery, { radius, location: locationToUse, categoryType });
    setSortBy("distance");
  }, [query, selectedCategories, location, radius, search, categoryType]);

  const handleLocationPreset = useCallback((loc: { lat: number; lng: number; name: string }) => {
    setCustomLocation({ lat: loc.lat, lng: loc.lng });
    toast.success(`Searching near ${loc.name}...`, { duration: 2000 });
  }, [setCustomLocation]);

  const handleClearPlan = useCallback(() => {
    setShowClearConfirm(true);
  }, []);

  const confirmClearPlan = useCallback(() => {
    storage.clearPlan();
    setPlan([]);
    toast.success("Plan cleared!");
  }, []);

  return (
    <>
      <div className="space-y-6 animate-fade-in relative z-10">
        {/* Top Tab Bar with Plan */}
        <Card className="shadow-glow border-primary/20 overflow-hidden sticky top-16 z-40 backdrop-blur-xl bg-card/95">
          <div className="gradient-primary h-1" />
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                    <Heart className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold gradient-text leading-tight">Date Plan</h3>
                    {plan.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {plan.length} {plan.length === 1 ? 'spot' : 'spots'}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Horizontal scrollable plan items */}
                {plan.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 flex-1 min-w-0 scrollbar-thin">
                    {plan.map((item, index) => (
                      <div
                        key={index}
                        className="relative group shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 border-primary/30 hover:border-primary transition-all hover:scale-105 shadow-md hover:shadow-glow"
                      >
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <p className="text-white text-xs font-semibold line-clamp-2 leading-tight">{item.name}</p>
                        </div>
                        {item.rating && (
                          <Badge className="absolute top-1 left-1 bg-white/95 text-foreground px-1.5 py-0 text-xs shadow-md">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 mr-0.5" />
                            {item.rating}
                          </Badge>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            storage.removeFromPlan(index);
                            setPlan(storage.getPlan());
                            toast.success("Removed from plan");
                          }}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-all h-6 w-6 bg-destructive/90 hover:bg-destructive text-white"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 shrink-0">
                {plan.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic px-4">
                    Add places to start planning! 💕
                  </div>
                ) : (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        toast.success("Your perfect date plan is saved! 💕");
                      }}
                      className="shadow-sm hover:shadow-md transition-all hover:scale-105"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleClearPlan}
                      className="shadow-sm hover:shadow-md transition-all hover:scale-105 hover:border-destructive/50 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Card */}
        <Card className="shadow-soft border-border/50 overflow-hidden">
          <div className="gradient-primary h-1" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Discover Love Spots — FELICIA.TLC</CardTitle>
                <CardDescription>
                  Curated romantic destinations near you
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <SearchBar
              query={query}
              radius={radius}
              onQueryChange={setQuery}
              onRadiusChange={setRadius}
              onSearch={handleSearch}
              disabled={isSearching}
              loading={isSearching}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              categoryType={categoryType}
              onCategoryTypeChange={setCategoryType}
              onLocationModeChange={handleLocationModeChange}
            />

            <LocationPresets 
              onSelectLocation={handleLocationPreset}
              disabled={isSearching}
              currentLocation={location}
            />

            <WeatherWidget weather={weather} isLoading={isWeatherLoading} />

            <button
              onClick={() => setShowUpdates(true)}
              className="pill flex items-center gap-2 hover:shadow-lg transition-all mx-auto"
            >
              <Sparkles className="h-4 w-4 text-rose" />
              <span className="text-sm font-medium">What's New</span>
            </button>

            {error && (
              <Alert variant="destructive" className="animate-in fade-in">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results Grid */}
        {!isSearching && results.length > 0 && (
          <div className="space-y-4">
            <FilterBar
              sortBy={sortBy}
              onSortChange={setSortBy}
              showFavoritesOnly={showFavoritesOnly}
              onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
              resultCount={filteredAndSortedResults.length}
            />
            {filteredAndSortedResults.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredAndSortedResults.map((place, index) => (
                  <div
                    key={place.id}
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                    className="animate-fade-in animate-scale-in"
                  >
                    <PlaceCard
                      place={place}
                      onAdd={handleAddToPlan}
                      onFavoriteToggle={handleFavoriteToggle}
                      onView={() => trackPlaceView(place)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <EmptyState
                    icon={Search}
                    title="No results"
                    description={showFavoritesOnly ? "No favorites found in these results." : "Try adjusting your filters."}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        title="Clear Your Plan?"
        description="Are you sure you want to remove all places from your date plan? This action cannot be undone."
        onConfirm={confirmClearPlan}
        confirmText="Yes, Clear Plan"
        cancelText="Keep Plan"
      />

      <UpdatesPanel isOpen={showUpdates} onClose={() => setShowUpdates(false)} />
    </>
  );
}
