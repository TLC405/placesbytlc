import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
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

// Google Maps API key should be provided by users via APIKeyDialog

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
