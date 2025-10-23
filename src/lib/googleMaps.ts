let isLoading = false;
let isLoaded = false;

export const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isLoaded) {
      resolve();
      return;
    }

    if (isLoading) {
      // Wait for existing load
      const checkInterval = setInterval(() => {
        if (isLoaded) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      return;
    }

    if (!apiKey) {
      reject(new Error("API key is required"));
      return;
    }

    // Check if already in DOM
    if (document.getElementById("google-maps-script")) {
      isLoaded = true;
      resolve();
      return;
    }

    isLoading = true;

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isLoading = false;
      isLoaded = true;
      resolve();
    };

    script.onerror = () => {
      isLoading = false;
      document.getElementById("google-maps-script")?.remove();
      reject(new Error("Failed to load Google Maps"));
    };

    document.head.appendChild(script);
  });
};

export const isGoogleMapsLoaded = (): boolean => {
  return isLoaded && !!(window as any).google?.maps?.places;
};
