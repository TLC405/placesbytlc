import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Search, Sparkles } from "lucide-react";
import { PlaceItem } from "@/types";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { PlanSidebar } from "@/components/PlanSidebar";
import { SearchBar } from "@/components/SearchBar";
import { PlaceCard } from "@/components/PlaceCard";
import { EmptyState } from "@/components/EmptyState";
import { FilterBar } from "@/components/FilterBar";
import { FloatingHearts } from "@/components/FloatingHearts";
import { usePlacesSearch } from "@/hooks/usePlacesSearch";
import { useGeolocation } from "@/hooks/useGeolocation";
import { LocationPresets } from "@/components/LocationPresets";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EventsFeed } from "@/components/EventsFeed";
import { trackPlaceView, trackPlaceSave, trackSearch } from "@/components/ActivityTracker";

export default function Explore() {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState("8047"); // 5 miles in meters
  const [plan, setPlan] = useState<PlaceItem[]>([]);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<PlaceItem[]>([]);

  // Custom hooks
  const { location, setCustomLocation } = useGeolocation();
  const { results, isSearching, search } = usePlacesSearch({
    onError: (message) => setError(message),
  });

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

  const handleSearch = useCallback(() => {
    if (!query.trim()) {
      toast.info("Enter a search term or use quick searches below!");
      return;
    }

    setError("");
    search(query, location, parseInt(radius, 10));
    trackSearch(query, { radius, location });
    setSortBy("distance");
  }, [query, location, radius, search]);

  const handleLocationPreset = useCallback((loc: { lat: number; lng: number; name: string }) => {
    setCustomLocation({ lat: loc.lat, lng: loc.lng });
    toast.success(`📍 Searching near ${loc.name}...`, { duration: 2000 });
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
      <FloatingHearts />
      <div className="grid lg:grid-cols-3 gap-6 animate-fade-in relative z-10">
        <div className="lg:col-span-2 space-y-6">
          {/* Search Card */}
          <Card className="shadow-soft border-border/50 overflow-hidden">
            <div className="gradient-primary h-1" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle>✨ Discover Love Spots — FELICIA.TLC ✨</CardTitle>
                  <CardDescription>
                    AI-powered romantic destinations curated just for you
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
              />

              <LocationPresets 
                onSelectLocation={handleLocationPreset}
                disabled={isSearching}
                currentLocation={location}
              />

              {error && (
                <Alert variant="destructive" className="animate-in fade-in">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Events Feed */}
          <EventsFeed />

          {/* Results Grid */}
          
          {!isSearching && results.length > 0 ? (
            <div className="space-y-4">
              <FilterBar
                sortBy={sortBy}
                onSortChange={setSortBy}
                showFavoritesOnly={showFavoritesOnly}
                onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
                resultCount={filteredAndSortedResults.length}
              />
              
              {filteredAndSortedResults.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredAndSortedResults.map((place, index) => (
                    <div 
                      key={place.id}
                      style={{ 
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: 'backwards'
                      }}
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
          ) : (
            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <EmptyState
                  icon={Search}
                  title="Start exploring"
                  description="Enter a search term and click Search to discover date night spots near you."
                />
              </CardContent>
            </Card>
          )}
        </div>

        <PlanSidebar 
          plan={plan} 
          onUpdate={() => setPlan(storage.getPlan())}
          onClearPlan={handleClearPlan}
        />
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
    </>
  );
}
