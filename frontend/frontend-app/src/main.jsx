import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import "./index.css";
import App from "./App.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <Toaster />
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
