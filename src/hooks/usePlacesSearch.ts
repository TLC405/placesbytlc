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

          const userLat = location.lat;
          const userLng = location.lng;

          const places: PlaceItem[] = res.map((place: any) => {
            const placeLat = place.geometry?.location?.lat();
            const placeLng = place.geometry?.location?.lng();
            
            // Calculate distance in miles
            let distance;
            if (placeLat && placeLng) {
              const R = 3958.8; // Earth radius in miles
              const dLat = (placeLat - userLat) * Math.PI / 180;
              const dLng = (placeLng - userLng) * Math.PI / 180;
              const a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(userLat * Math.PI / 180) * Math.cos(placeLat * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
              distance = R * c;
            }

            return {
              id: place.place_id,
              name: place.name || "Unnamed",
              address: place.formatted_address || "",
              photo: place.photos?.[0]?.getUrl?.({ maxWidth: 1000 }) || getPlaceholder(place.name),
              rating: place.rating,
              userRatingsTotal: place.user_ratings_total,
              priceLevel: place.price_level,
              openNow: place.opening_hours?.isOpen?.() ?? place.opening_hours?.open_now,
              types: place.types,
              distance: distance ? parseFloat(distance.toFixed(1)) : undefined,
              lat: placeLat,
              lng: placeLng,
            };
          });

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
