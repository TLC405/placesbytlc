import { useState, useCallback } from "react";
import { toast } from "sonner";

const DEFAULT_LOCATION = { lat: 35.5602, lng: -97.4973 }; // Perfect midpoint between South OKC and Edmond

export const useGeolocation = () => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const setCustomLocation = useCallback((newLocation: { lat: number; lng: number }) => {
    setLocation(newLocation);
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return Promise.reject();
    }

    setIsGettingLocation(true);

    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          setIsGettingLocation(false);
          toast.success("Location updated!");
          resolve(newLocation);
        },
        (error) => {
          setIsGettingLocation(false);
          toast.error("Could not get your location. Using default.");
          console.error(error);
          reject(error);
        }
      );
    });
  }, []);

  return {
    location,
    isGettingLocation,
    getCurrentLocation,
    setCustomLocation,
  };
};
