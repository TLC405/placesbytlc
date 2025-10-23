import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Search, Key } from "lucide-react";
import { PlaceItem } from "@/types";
import { storage } from "@/lib/storage";
import { getPlaceholder } from "@/lib/placeholders";
import { loadGoogleMapsScript, isGoogleMapsLoaded } from "@/lib/googleMaps";
import { toast } from "sonner";
import { PlanSidebar } from "@/components/PlanSidebar";
import { SearchBar } from "@/components/SearchBar";
import { PlaceCard } from "@/components/PlaceCard";
import { EmptyState } from "@/components/EmptyState";
import { APIKeyDialog } from "@/components/APIKeyDialog";

export default function Explore() {
  const [query, setQuery] = useState("date night");
  const [radius, setRadius] = useState("5000");
  const [results, setResults] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentLocation, setCurrentLocation] = useState({ lat: 35.4676, lng: -97.5164 });
  const [plan, setPlan] = useState<PlaceItem[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [showAPIDialog, setShowAPIDialog] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);

  useEffect(() => {
    setPlan(storage.getPlan());
    const savedKey = storage.getAPIKey();
    setApiKey(savedKey);
    
    if (savedKey) {
      loadGoogleMapsScript(savedKey)
        .then(() => {
          setMapsReady(true);
        })
        .catch((err) => {
          console.error("Failed to load Google Maps:", err);
          setShowAPIDialog(true);
        });
    } else {
      setShowAPIDialog(true);
    }
  }, []);

  const handleSaveAPIKey = (key: string, remember: boolean) => {
    if (remember) {
      storage.saveAPIKey(key);
    }
    setApiKey(key);
    
    loadGoogleMapsScript(key)
      .then(() => {
        setMapsReady(true);
        toast.success("Google Maps loaded successfully!");
      })
      .catch((err) => {
        toast.error("Failed to load Google Maps. Check your API key.");
        console.error(err);
      });
  };

  const handleAddToPlan = (place: PlaceItem) => {
    // Check if already in plan
    const existing = storage.getPlan();
    if (existing.some(p => p.id === place.id)) {
      toast.info("Already in your plan!");
      return;
    }
    
    storage.addToPlan(place);
    setPlan(storage.getPlan());
    toast.success(`${place.name} added to plan!`);
  };

  const handleSearch = async () => {
    if (!mapsReady || !isGoogleMapsLoaded()) {
      setShowAPIDialog(true);
      toast.error("Please configure your Google Maps API key first.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const googleMaps = (window as any).google;
      const service = new googleMaps.maps.places.PlacesService(document.createElement("div"));
      const request = {
        location: new googleMaps.maps.LatLng(currentLocation.lat, currentLocation.lng),
        radius: parseInt(radius, 10),
        query: query.trim() || "date night",
      };

      service.textSearch(request, (res: any, status: any) => {
        if (status !== googleMaps.maps.places.PlacesServiceStatus.OK || !res) {
          setError(`Search failed: ${status}. Please try again or check your API key.`);
          setLoading(false);
          return;
        }

        const places: PlaceItem[] = res.map((place: any) => ({
          id: place.place_id,
          name: place.name || "Unnamed",
          address: place.formatted_address || "",
          photo: place.photos?.[0]?.getUrl?.({ maxWidth: 1000 }) || getPlaceholder(place.name),
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
        }));

        setResults(places);
        setLoading(false);
        
        if (places.length === 0) {
          toast.info("No results found. Try a different search term.");
        }
      });
    } catch (err) {
      setError("Failed to search. Please try again.");
      setLoading(false);
      console.error(err);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not available in your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success("Location updated! Click Search to find nearby places.");
      },
      (err) => {
        console.error(err);
        toast.error("Unable to access location. Using default location.");
      }
    );
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle>Find Date Spots</CardTitle>
              <CardDescription>
                Search for restaurants, activities, and experiences nearby
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SearchBar
                query={query}
                radius={radius}
                onQueryChange={setQuery}
                onRadiusChange={setRadius}
                onSearch={handleSearch}
                onUseLocation={handleUseLocation}
                onSettings={() => setShowAPIDialog(true)}
                disabled={!mapsReady}
                loading={loading}
              />

              {!mapsReady && (
                <Alert className="mt-4 border-primary/50 bg-primary/5">
                  <Key className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>Google Maps API key required to search</span>
                    <Button size="sm" onClick={() => setShowAPIDialog(true)}>
                      Configure
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Results Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[400px]">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">Searching for amazing places...</p>
                </div>
              </div>
            ) : results.length === 0 && mapsReady ? (
              <EmptyState
                icon={Search}
                title="Start exploring"
                description="Enter a search term and click Search to discover date night spots near you."
              />
            ) : (
              results.map((place) => (
                <PlaceCard key={place.id} place={place} onAdd={handleAddToPlan} />
              ))
            )}
          </div>
        </div>

        <PlanSidebar plan={plan} onUpdate={() => setPlan(storage.getPlan())} />
      </div>

      <APIKeyDialog
        open={showAPIDialog}
        onOpenChange={setShowAPIDialog}
        onSave={handleSaveAPIKey}
        currentKey={apiKey}
      />
    </>
  );
}
