import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { TravelProvider } from "./state/TravelProvider";
import "./styles.css";
import "./enhancements.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TravelProvider>
      <App />
    </TravelProvider>
  </StrictMode>,
);
