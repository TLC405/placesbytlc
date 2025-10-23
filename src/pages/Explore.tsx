import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Search, Key, Sparkles } from "lucide-react";
import { PlaceItem } from "@/types";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { PlanSidebar } from "@/components/PlanSidebar";
import { SearchBar } from "@/components/SearchBar";
import { PlaceCard } from "@/components/PlaceCard";
import { EmptyState } from "@/components/EmptyState";
import { APIKeyDialog } from "@/components/APIKeyDialog";
import { FilterBar } from "@/components/FilterBar";
import { FloatingHearts } from "@/components/FloatingHearts";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { usePlacesSearch } from "@/hooks/usePlacesSearch";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function Explore() {
  const [query, setQuery] = useState("date night");
  const [radius, setRadius] = useState("8047"); // 5 miles in meters
  const [plan, setPlan] = useState<PlaceItem[]>([]);
  const [showAPIDialog, setShowAPIDialog] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<PlaceItem[]>([]);

  // Custom hooks
  const { isReady: mapsReady, isLoading: mapsLoading, initializeMaps } = useGoogleMaps();
  const { location, isGettingLocation, getCurrentLocation } = useGeolocation();
  const { results, isSearching, search } = usePlacesSearch({
    onError: (message) => setError(message),
  });

  useEffect(() => {
    setPlan(storage.getPlan());
    setFavorites(storage.getFavorites());
    
    // Show API dialog 3 seconds after app opens if no key is configured
    if (!mapsReady && !mapsLoading) {
      const timer = setTimeout(() => {
        setShowAPIDialog(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mapsReady, mapsLoading]);

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

  const handleSaveAPIKey = useCallback((key: string, remember: boolean) => {
    if (remember) {
      storage.saveAPIKey(key);
    }
    
    initializeMaps(key)
      .then(() => {
        toast.success("Google Maps loaded successfully!");
        setShowAPIDialog(false);
      })
      .catch(() => {
        toast.error("Failed to load Google Maps. Check your API key.");
      });
  }, [initializeMaps]);

  const handleAddToPlan = useCallback((place: PlaceItem) => {
    const existing = storage.getPlan();
    if (existing.some((p) => p.id === place.id)) {
      toast.info("Already in your plan!");
      return;
    }
    
    storage.addToPlan(place);
    setPlan(storage.getPlan());
    toast.success(`${place.name} added to plan!`);
  }, []);

  const handleFavoriteToggle = useCallback((place: PlaceItem, isFavorite: boolean) => {
    setFavorites(storage.getFavorites());
    toast.success(isFavorite ? `${place.name} added to favorites!` : `${place.name} removed from favorites`);
  }, []);

  const handleSearch = useCallback(() => {
    if (!mapsReady) {
      setShowAPIDialog(true);
      toast.error("Please configure your Google Maps API key first.");
      return;
    }

    setError("");
    search(query, location, parseInt(radius, 10));
  }, [mapsReady, query, location, radius, search]);

  const handleUseLocation = useCallback(() => {
    getCurrentLocation().then(() => {
      toast.info("Click Search to find places near you!");
    }).catch(() => {
      // Error already handled in hook
    });
  }, [getCurrentLocation]);

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
                  <CardTitle>Discover Date Spots</CardTitle>
                  <CardDescription>
                    Find restaurants, activities, and experiences nearby
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <SearchBar
                query={query}
                radius={radius}
                onQueryChange={setQuery}
                onRadiusChange={setRadius}
                onSearch={handleSearch}
                onUseLocation={handleUseLocation}
                onSettings={() => setShowAPIDialog(true)}
                disabled={!mapsReady || isSearching}
                loading={isSearching || isGettingLocation}
              />

              {!mapsReady && !mapsLoading && (
                <Alert className="border-primary/50 bg-primary/5">
                  <Key className="h-4 w-4 text-primary" />
                  <AlertDescription className="flex items-center justify-between">
                    <span className="text-sm">Google Maps API key required to search</span>
                    <Button 
                      size="sm" 
                      onClick={() => setShowAPIDialog(true)}
                      className="ml-4"
                    >
                      Configure
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="animate-in fade-in">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Results Grid */}
          {isSearching ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-muted"></div>
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent absolute top-0 left-0"></div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">Searching for amazing places...</p>
                  <p className="text-sm text-muted-foreground mt-1">This may take a few seconds</p>
                </div>
              </div>
            </div>
          ) : results.length > 0 ? (
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
                      style={{ animationDelay: `${index * 50}ms` }}
                      className="animate-fade-in"
                    >
                      <PlaceCard 
                        place={place} 
                        onAdd={handleAddToPlan}
                        onFavoriteToggle={handleFavoriteToggle}
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
          ) : mapsReady ? (
            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <EmptyState
                  icon={Search}
                  title="Start exploring"
                  description="Enter a search term and click Search to discover date night spots near you."
                />
              </CardContent>
            </Card>
          ) : null}
        </div>

        <PlanSidebar plan={plan} onUpdate={() => setPlan(storage.getPlan())} />
      </div>

      <APIKeyDialog
        open={showAPIDialog}
        onOpenChange={setShowAPIDialog}
        onSave={handleSaveAPIKey}
        currentKey={storage.getAPIKey()}
      />
    </>
  );
}
