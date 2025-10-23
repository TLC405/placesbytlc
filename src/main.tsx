import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { apiKeyManager } from "./lib/apiKeyManager";

// Initialize Google Maps API key
apiKeyManager.initializeAPIKey("AIzaSyAmZ989l5QauVfNqpKkBW-kp3S6byTbBd0");

createRoot(document.getElementById("root")!).render(<App />);
