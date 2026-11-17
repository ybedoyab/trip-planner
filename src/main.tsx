/// <reference types="vite/client" />

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Capacitor } from "@capacitor/core";
import App from "./App";
import { TravelProvider } from "./state/TravelProvider";
import "./styles.css";
import "./enhancements.css";

if (import.meta.env.PROD && !Capacitor.isNativePlatform() && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("/trip-worker.js").catch(() => {
    // The itinerary remains available online when storage is disabled.
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TravelProvider>
      <App />
    </TravelProvider>
  </StrictMode>,
);
