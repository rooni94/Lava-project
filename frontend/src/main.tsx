import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/globals.css";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import Analytics from "./components/Analytics";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import "./i18n";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <HelmetProvider>
          <ErrorBoundary>
            <Analytics />
            <Toaster position="top-center" />
            <App />
          </ErrorBoundary>
        </HelmetProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
