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
      // Check if Google Maps is loaded
      if (!(window as any).google?.maps?.places) {
        onError("Google Maps API not loaded. Please check your API key and refresh the page.");
        return;
      }

      setIsSearching(true);
      setResults([]);

      try {
        const google = (window as any).google;
        
        // Create a map instance (required by Places Service)
        const mapDiv = document.createElement("div");
        const map = new google.maps.Map(mapDiv, {
          center: { lat: location.lat, lng: location.lng },
          zoom: 15
        });
        const service = new google.maps.places.PlacesService(map);
        
        const searchQuery = query.trim() || "restaurant";
        
        // Use nearbySearch with keyword for better results
        const request = {
          location: new google.maps.LatLng(location.lat, location.lng),
          radius: radius,
          keyword: searchQuery,
          rankBy: google.maps.places.RankBy.PROMINENCE
        };

        service.nearbySearch(request, async (res: any, status: any) => {
          if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            setIsSearching(false);
            setResults([]);
            onError("No results found. Try different search terms or a larger radius.");
            return;
          }

          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            setIsSearching(false);
            setResults([]);
            onError(`Search failed. Please try again.`);
            return;
          }

          if (!res || res.length === 0) {
            setIsSearching(false);
            setResults([]);
            onError("No results found.");
            return;
          }

          const userLat = location.lat;
          const userLng = location.lng;

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

          // Process results
          const places: PlaceItem[] = res.slice(0, 20).map((place: any) => {
            const placeLat = place.geometry?.location?.lat();
            const placeLng = place.geometry?.location?.lng();
            
            let distance;
            if (placeLat && placeLng) {
              distance = calculateDistance(userLat, userLng, placeLat, placeLng);
            }

            return {
              id: place.place_id,
              name: place.name || "Unnamed Location",
              address: place.vicinity || place.formatted_address || "",
              photo: place.photos?.[0]?.getUrl?.({ maxWidth: 1000 }) || getPlaceholder(place.name),
              rating: place.rating,
              userRatingsTotal: place.user_ratings_total,
              priceLevel: place.price_level,
              openNow: place.opening_hours?.open_now,
              types: place.types || [],
              distance: distance ? parseFloat(distance.toFixed(1)) : undefined,
              lat: placeLat,
              lng: placeLng,
            };
          });

          setResults(places);
          setIsSearching(false);
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
