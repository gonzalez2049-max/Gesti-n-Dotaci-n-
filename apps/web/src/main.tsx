import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { AppProvider } from "./app/store";
import { ToastProvider } from "./components/Toast";
import { queryClient } from "./app/queryClient";
import "./styles/global.css";

// Preview estático (Artifact): enrutado por hash, sin servidor. En dev normal
// se usa BrowserRouter. Se activa con VITE_HASH_ROUTER=1 en el build.
const Router = import.meta.env.VITE_HASH_ROUTER ? HashRouter : BrowserRouter;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AppProvider>
      </Router>
    </QueryClientProvider>
  </StrictMode>,
);
