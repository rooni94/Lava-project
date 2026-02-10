import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/globals.css";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import Analytics from "./components/Analytics";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import "./i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Avoid request storms in production when the API returns 429s or is briefly unavailable.
      // Most of our public content endpoints are effectively static during a session.
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: (failureCount, err: unknown) => {
        const status = axios.isAxiosError(err) ? err.response?.status : undefined;
        if (status === 429) return false;
        return failureCount < 1;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 15000),
      staleTime: 15_000,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <HelmetProvider>
          <ErrorBoundary>
            <Analytics />
            <Toaster position="top-center" />
            <App />
          </ErrorBoundary>
        </HelmetProvider>
      </BrowserRouter>
    </QueryClientProvider>
);
