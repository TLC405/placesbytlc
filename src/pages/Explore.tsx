import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Search, AlertCircle } from "lucide-react";
import { PlaceItem } from "@/types";
import { storage } from "@/lib/storage";
import { getPlaceholder } from "@/lib/placeholders";
import { toast } from "sonner";
import { PlanSidebar } from "@/components/PlanSidebar";

export default function Explore() {
  const [query, setQuery] = useState("date night");
  const [radius, setRadius] = useState("5000");
  const [results, setResults] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentLocation, setCurrentLocation] = useState({ lat: 35.4676, lng: -97.5164 });
  const [plan, setPlan] = useState<PlaceItem[]>([]);

  useEffect(() => {
    setPlan(storage.getPlan());
  }, []);

  const handleAddToPlan = (place: PlaceItem) => {
    storage.addToPlan(place);
    setPlan(storage.getPlan());
    toast.success(`${place.name} added to plan!`);
  };

  const handleSearch = async () => {
    const googleMaps = (window as any).google;
    if (!googleMaps || !googleMaps.maps?.places) {
      toast.error("Google Maps not loaded. Please set your API key.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const service = new googleMaps.maps.places.PlacesService(document.createElement("div"));
      const request = {
        location: new googleMaps.maps.LatLng(currentLocation.lat, currentLocation.lng),
        radius: parseInt(radius, 10),
        query: query.trim() || "date night",
      };

      service.textSearch(request, (res: any, status: any) => {
        if (status !== googleMaps.maps.places.PlacesServiceStatus.OK || !res) {
          setError(`Search error: ${status}`);
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
      });
    } catch (err) {
      setError("Failed to search. Please try again.");
      setLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation unavailable.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.info("Location updated! Searching near you.");
        setTimeout(handleSearch, 500);
      },
      () => {
        toast.info("Location denied. Using default (OKC).");
      }
    );
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      <div className="lg:col-span-2 space-y-4">
        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle>Find Date Spots</CardTitle>
            <CardDescription>Search for restaurants, activities, and experiences nearby</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Input
                placeholder="Search date ideas (e.g., sushi, jazz, arcade)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 min-w-[200px]"
              />
              <Select value={radius} onValueChange={setRadius}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2000">2 km</SelectItem>
                  <SelectItem value="5000">5 km</SelectItem>
                  <SelectItem value="10000">10 km</SelectItem>
                  <SelectItem value="20000">20 km</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" onClick={handleUseLocation}>
                <MapPin className="w-4 h-4 mr-2" />
                Use My Location
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[300px]">
          {loading ? (
            <div className="col-span-full flex items-center justify-center p-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="col-span-full text-center p-10 text-muted-foreground">
              <Search className="mx-auto h-12 w-12 text-muted mb-2" />
              <h3 className="text-lg font-semibold text-foreground">Find your date night</h3>
              <p className="text-sm">Results will appear here once you search.</p>
            </div>
          ) : (
            results.map((place) => (
              <Card key={place.id} className="shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={place.photo}
                  alt={place.name}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{place.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">{place.address}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  {place.rating && (
                    <span className="text-xs text-muted-foreground">
                      ⭐ {place.rating} ({place.userRatingsTotal || 0})
                    </span>
                  )}
                  <Button size="sm" onClick={() => handleAddToPlan(place)}>
                    ➕ Add
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <PlanSidebar plan={plan} onUpdate={() => setPlan(storage.getPlan())} />
    </div>
  );
}
