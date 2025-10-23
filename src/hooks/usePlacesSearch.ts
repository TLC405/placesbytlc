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
        // Get city from location (simplified - using Oklahoma City as default)
        const city = "Oklahoma City";
        
        console.log('Searching with AI discovery:', { city, query });

        // Call AI discovery edge function
        const { data, error } = await supabase.functions.invoke('discover-date-spots', {
          body: { city, query, lat: location.lat, lng: location.lng }
        });

        if (error) {
          console.error('Discovery error:', error);
          onError("Search temporarily unavailable. Try again in a moment.");
          setIsSearching(false);
          return;
        }

        const discoveredPlaces = data?.places || [];
        console.log('Discovered places:', discoveredPlaces.length);

        if (discoveredPlaces.length === 0) {
          onError("No date spots found. Try a different search.");
          setIsSearching(false);
          return;
        }

        // Calculate distance using Haversine formula
        const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
          const R = 3958.8; // Earth's radius in miles
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLng = (lng2 - lng1) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          return R * c;
        };

        // Convert to PlaceItem format
        const places: PlaceItem[] = discoveredPlaces.map((place: any) => {
          const distance = place.lat && place.lng ? 
            calculateDistance(location.lat, location.lng, place.lat, place.lng) : undefined;

          return {
            id: place.place_id,
            name: place.name,
            address: place.address || "",
            photo: getPlaceholder(place.name),
            rating: undefined,
            userRatingsTotal: undefined,
            priceLevel: undefined,
            openNow: undefined,
            types: [place.category],
            distance: distance ? parseFloat(distance.toFixed(1)) : undefined,
            lat: place.lat,
            lng: place.lng,
          };
        });

        setResults(places);
        setIsSearching(false);
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
