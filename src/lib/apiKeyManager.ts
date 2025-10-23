// Secure API key management
// The actual Google Maps API key should be set via secure means
// and stored in localStorage with the key 'gm_api_key_secure'

export const apiKeyManager = {
  // Initialize the API key - call this once when setting up the app
  initializeAPIKey: (apiKey: string): void => {
    try {
      localStorage.setItem('gm_api_key_secure', apiKey);
    } catch (e) {
      console.warn('Failed to store API key:', e);
    }
  },

  // Get the stored API key
  getAPIKey: (): string | null => {
    try {
      return localStorage.getItem('gm_api_key_secure');
    } catch (e) {
      console.warn('Failed to retrieve API key:', e);
      return null;
    }
  },

  // Check if API key is configured
  isConfigured: (): boolean => {
    return !!apiKeyManager.getAPIKey();
  },

  // Clear the API key (for logout or reset)
  clearAPIKey: (): void => {
    try {
      localStorage.removeItem('gm_api_key_secure');
    } catch (e) {
      console.warn('Failed to clear API key:', e);
    }
  }
};

// Instructions for deployment:
// 1. Before deploying, run: apiKeyManager.initializeAPIKey('YOUR_ACTUAL_GOOGLE_MAPS_API_KEY')
// 2. Or set it directly: localStorage.setItem('gm_api_key_secure', 'YOUR_KEY')
// 3. Make sure to restrict your API key in Google Cloud Console
