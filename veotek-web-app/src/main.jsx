import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "remixicon/fonts/remixicon.css";
import "./index.css";

import App from "./App";
import AppErrorBoundary from "./components/common/AppErrorBoundary";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Root element "#root" was not found.');
}

const root = createRoot(rootElement, {
  onUncaughtError(error, errorInfo) {
    console.error("Uncaught React error:", error);
    console.error(errorInfo);
  },

  onCaughtError(error, errorInfo) {
    console.error("Caught React error:", error);
    console.error(errorInfo);
  },
});

root.render(
  <StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppErrorBoundary>
  </StrictMode>
);