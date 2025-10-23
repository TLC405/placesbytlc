import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { apiKeyManager } from "./lib/apiKeyManager";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Clean up service workers in development to prevent stale cache issues
if (import.meta.env.DEV || window.location.search.includes('no-sw=1')) {
  navigator.serviceWorker?.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
  
  caches?.keys?.().then(keys => {
    keys.forEach(key => caches.delete(key));
  });
}

// Initialize Google Maps API key
apiKeyManager.initializeAPIKey("AIzaSyAmZ989l5QauVfNqpKkBW-kp3S6byTbBd0");

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
