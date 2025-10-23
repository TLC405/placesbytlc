import { useState, useCallback } from "react";
import { PlaceItem } from "@/types";
import { getPlaceholder } from "@/lib/placeholders";
import { supabase } from "@/integrations/supabase/client";

interface UsePlacesSearchProps {
  onError: (message: string) => void;
}

export const usePlacesSearch = ({ onError }: UsePlacesSearchProps) => {
  const [results, setResults] = useState<PlaceItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = useCallback(
    async (query: string, location: { lat: number; lng: number }, radius: number) => {
      setIsSearching(true);
      setResults([]);

      try {
        if (!window.google?.maps?.places) {
          onError("Maps not loaded. Please refresh the page.");
          setIsSearching(false);
          return;
        }

        const service = new window.google.maps.places.PlacesService(
          document.createElement("div")
        );

        const request: any = {
          location: new window.google.maps.LatLng(location.lat, location.lng),
          radius,
          keyword: query,
        };

        service.nearbySearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
              const R = 3958.8;
              const dLat = (lat2 - lat1) * Math.PI / 180;
              const dLng = (lng2 - lng1) * Math.PI / 180;
              const a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
              return R * c;
            };

            const places: PlaceItem[] = results.map((place) => {
              const photoUrl = place.photos?.[0]?.getUrl({ maxWidth: 800 }) || getPlaceholder(place.name);
              const distance = place.geometry?.location
                ? calculateDistance(
                    location.lat,
                    location.lng,
                    place.geometry.location.lat(),
                    place.geometry.location.lng()
                  )
                : undefined;

              return {
                id: place.place_id || "",
                name: place.name || "",
                address: place.vicinity || "",
                photo: photoUrl,
                rating: place.rating,
                userRatingsTotal: place.user_ratings_total,
                priceLevel: place.price_level,
                openNow: place.opening_hours?.isOpen?.(),
                types: place.types || [],
                distance: distance ? parseFloat(distance.toFixed(1)) : undefined,
                lat: place.geometry?.location?.lat(),
                lng: place.geometry?.location?.lng(),
              };
            });

            setResults(places);
            setIsSearching(false);
          } else {
            onError("No results found. Try a different search.");
            setIsSearching(false);
          }
        });
      } catch (err) {
        setIsSearching(false);
        onError("Search failed. Please try again.");
        console.error("Search error:", err);
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
