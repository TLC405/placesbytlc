import { useState, useEffect } from "react";
import { loadGoogleMapsScript, isGoogleMapsLoaded } from "@/lib/googleMaps";
import { storage } from "@/lib/storage";

export const useGoogleMaps = () => {
  const [isReady, setIsReady] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedKey = storage.getAPIKey();
    setApiKey(savedKey);

    if (savedKey && savedKey.trim()) {
      console.log('Loading Google Maps with API key');
      loadGoogleMapsScript(savedKey)
        .then(() => {
          console.log('Google Maps loaded successfully');
          setIsReady(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load Google Maps:', err);
          setIsLoading(false);
        });
    } else {
      console.log('No API key found');
      setIsLoading(false);
    }
  }, []);

  const initializeMaps = (key: string) => {
    setIsLoading(true);
    return loadGoogleMapsScript(key)
      .then(() => {
        setIsReady(true);
        setApiKey(key);
        setIsLoading(false);
        return true;
      })
      .catch((err) => {
        setIsLoading(false);
        throw err;
      });
  };

  return {
    isReady,
    isLoading,
    apiKey,
    initializeMaps,
    isGoogleMapsLoaded,
  };
};
