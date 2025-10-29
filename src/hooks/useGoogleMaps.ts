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

    if (savedKey) {
      loadGoogleMapsScript(savedKey)
        .then(() => {
          setIsReady(true);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else {
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
