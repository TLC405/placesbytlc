import { useState, useCallback } from "react";
import { PlaceItem } from "@/types";
import { getPlaceholder } from "@/lib/placeholders";

interface UsePlacesSearchProps {
  onError: (message: string) => void;
}

export const usePlacesSearch = ({ onError }: UsePlacesSearchProps) => {
  const [results, setResults] = useState<PlaceItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = useCallback(
    async (query: string, location: { lat: number; lng: number }, radius: number) => {
      if (!(window as any).google?.maps?.places) {
        onError("Google Maps not loaded. Please configure your API key.");
        return;
      }

      setIsSearching(true);
      setResults([]);

      try {
        const google = (window as any).google;
        const service = new google.maps.places.PlacesService(document.createElement("div"));
        
        const request = {
          location: new google.maps.LatLng(location.lat, location.lng),
          radius: radius,
          query: query.trim() || "date night",
        };

        service.textSearch(request, (res: any, status: any) => {
          setIsSearching(false);

          if (status !== google.maps.places.PlacesServiceStatus.OK || !res) {
            onError(`Search failed: ${status}. Please try a different search or check your API key.`);
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
        });
      } catch (err) {
        setIsSearching(false);
        onError("Search failed. Please try again.");
        console.error(err);
      }
    },
    [onError]
  );

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return {
    results,
    isSearching,
    search,
    clearResults,
  };
};
