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
        onError("Google Maps API not loaded. Please refresh the page or check your connection.");
        return;
      }

      setIsSearching(true);
      setResults([]);

      try {
        const google = (window as any).google;
        
        // Create a map instance (required by Places Service)
        const mapDiv = document.createElement("div");
        const map = new google.maps.Map(mapDiv);
        const service = new google.maps.places.PlacesService(map);
        
        const searchQuery = query.trim() || "date night";
        
        // Use nearbySearch for better results with type filtering
        const request = {
          location: new google.maps.LatLng(location.lat, location.lng),
          radius: radius,
          keyword: searchQuery,
          // Remove type restriction to get more results
        };

        service.nearbySearch(request, async (res: any, status: any) => {
          if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            setIsSearching(false);
            setResults([]);
            onError("No results found. Try a different search term or increase your radius.");
            return;
          }

          if (status !== google.maps.places.PlacesServiceStatus.OK || !res || res.length === 0) {
            setIsSearching(false);
            setResults([]);
            onError(`Search failed: ${status}. Please try again with different search terms.`);
            return;
          }

          const userLat = location.lat;
          const userLng = location.lng;

          // Get detailed info for each place
          const detailedPlaces = await Promise.all(
            res.slice(0, 20).map((place: any) => {
              return new Promise<PlaceItem | null>((resolve) => {
                service.getDetails(
                  { placeId: place.place_id },
                  (details: any, detailStatus: any) => {
                    if (detailStatus !== google.maps.places.PlacesServiceStatus.OK || !details) {
                      // Fallback to basic info if details fail
                      const placeLat = place.geometry?.location?.lat();
                      const placeLng = place.geometry?.location?.lng();
                      
                      let distance;
                      if (placeLat && placeLng) {
                        const R = 3958.8;
                        const dLat = (placeLat - userLat) * Math.PI / 180;
                        const dLng = (placeLng - userLng) * Math.PI / 180;
                        const a = 
                          Math.sin(dLat/2) * Math.sin(dLat/2) +
                          Math.cos(userLat * Math.PI / 180) * Math.cos(placeLat * Math.PI / 180) *
                          Math.sin(dLng/2) * Math.sin(dLng/2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                        distance = R * c;
                      }

                      resolve({
                        id: place.place_id,
                        name: place.name || "Unnamed Location",
                        address: place.vicinity || "",
                        photo: place.photos?.[0]?.getUrl?.({ maxWidth: 1000 }) || getPlaceholder(place.name),
                        rating: place.rating,
                        userRatingsTotal: place.user_ratings_total,
                        priceLevel: place.price_level,
                        openNow: place.opening_hours?.open_now,
                        types: place.types || [],
                        distance: distance ? parseFloat(distance.toFixed(1)) : undefined,
                        lat: placeLat,
                        lng: placeLng,
                      });
                      return;
                    }

                    const placeLat = details.geometry?.location?.lat();
                    const placeLng = details.geometry?.location?.lng();
                    
                    let distance;
                    if (placeLat && placeLng) {
                      const R = 3958.8;
                      const dLat = (placeLat - userLat) * Math.PI / 180;
                      const dLng = (placeLng - userLng) * Math.PI / 180;
                      const a = 
                        Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(userLat * Math.PI / 180) * Math.cos(placeLat * Math.PI / 180) *
                        Math.sin(dLng/2) * Math.sin(dLng/2);
                      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                      distance = R * c;
                    }

                    resolve({
                      id: details.place_id,
                      name: details.name || "Unnamed Location",
                      address: details.formatted_address || details.vicinity || "",
                      photo: details.photos?.[0]?.getUrl?.({ maxWidth: 1000 }) || getPlaceholder(details.name),
                      rating: details.rating,
                      userRatingsTotal: details.user_ratings_total,
                      priceLevel: details.price_level,
                      openNow: details.opening_hours?.isOpen?.() ?? details.opening_hours?.open_now,
                      types: details.types || [],
                      distance: distance ? parseFloat(distance.toFixed(1)) : undefined,
                      lat: placeLat,
                      lng: placeLng,
                      website: details.website,
                      phone: details.formatted_phone_number,
                    });
                  }
                );
              });
            })
          );

          const validPlaces = detailedPlaces.filter((p): p is PlaceItem => p !== null);
          setResults(validPlaces);
          setIsSearching(false);
        });
      } catch (err) {
        setIsSearching(false);
        onError("Search failed. Please check your internet connection and try again.");
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
