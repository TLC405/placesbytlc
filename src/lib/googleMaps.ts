let isLoading = false;
let isLoaded = false;

export const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isLoaded && (window as any).google?.maps?.places) {
      resolve();
      return;
    }

    if (isLoading) {
      // Wait for existing load with timeout
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (isLoaded && (window as any).google?.maps?.places) {
          clearInterval(checkInterval);
          resolve();
        } else if (Date.now() - startTime > 10000) {
          clearInterval(checkInterval);
          reject(new Error("Google Maps loading timeout"));
        }
      }, 100);
      return;
    }

    if (!apiKey) {
      reject(new Error("API key is required"));
      return;
    }

    // Check if already in DOM
    const existingScript = document.getElementById("google-maps-script");
    if (existingScript && (window as any).google?.maps?.places) {
      isLoaded = true;
      resolve();
      return;
    }

    isLoading = true;

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;

    // Fallback in case callback doesn't fire
    script.onload = () => {
      if (!isLoaded && (window as any).google?.maps?.places) {
        isLoading = false;
        isLoaded = true;
        resolve();
      }
    };

    // Add global callback
    (window as any).initMap = () => {
      isLoading = false;
      isLoaded = true;
      resolve();
    };

    script.onerror = () => {
      isLoading = false;
      const scriptEl = document.getElementById("google-maps-script");
      if (scriptEl) scriptEl.remove();
      reject(new Error("Failed to load Google Maps"));
    };

    document.head.appendChild(script);
  });
};

export const isGoogleMapsLoaded = (): boolean => {
  return isLoaded && !!(window as any).google?.maps?.places;
};
