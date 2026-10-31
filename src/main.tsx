import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { initializeAppearance } from "./lib/themes";
initializeAppearance();

// Clean up service workers in development to prevent stale cache issues
if (import.meta.env.DEV || window.location.search.includes('no-sw=1')) {
  navigator.serviceWorker?.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  }).catch(() => undefined);
  
  window.caches?.keys?.().then(keys => {
    keys.forEach(key => caches.delete(key));
  }).catch(() => undefined);
}

// Google Maps API key should be provided by users via APIKeyDialog

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("App root is missing");
createRoot(rootElement).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
