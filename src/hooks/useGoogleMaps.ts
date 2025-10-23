import { useState, useEffect } from "react";
import { loadGoogleMapsScript, isGoogleMapsLoaded } from "@/lib/googleMaps";
import { storage } from "@/lib/storage";
import { apiKeyManager } from "@/lib/apiKeyManager";

export const useGoogleMaps = () => {
  const [isReady, setIsReady] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedKey = storage.getAPIKey();
    const managerKey = (apiKeyManager.getAPIKey && apiKeyManager.getAPIKey()) || null;
    const key = storedKey && storedKey.trim()
      ? storedKey.trim()
      : managerKey && managerKey.trim()
        ? managerKey.trim()
        : "";

    if (key) {
      console.log('Loading Google Maps with API key');
      loadGoogleMapsScript(key)
        .then(() => {
          console.log('Google Maps loaded successfully');
          setIsReady(true);
          setApiKey(key);
          setIsLoading(false);
          // Persist key to our storage for future loads
          if (!storedKey && managerKey) {
            storage.saveAPIKey(key);
          }
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
    const k = key.trim();
    return loadGoogleMapsScript(k)
      .then(() => {
        setIsReady(true);
        setApiKey(k);
        storage.saveAPIKey(k);
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
