import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import SettingsContext from "./components/SettingsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SettingsContext>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </SettingsContext>
  </StrictMode>
);
