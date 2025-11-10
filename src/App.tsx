import React, { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ActivityTracker } from "@/components/ActivityTracker";
import { DetailedCupid } from "@/components/DetailedCupid";
import { FloatingEmoji } from "@/components/FloatingEmoji";
import { useSessionTracker } from "@/hooks/useSessionTracker";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NotFound from "./pages/NotFound";

// Lazy load pages
const UnifiedHome = lazy(() => import("./pages/UnifiedHome"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const TesterDashboard = lazy(() => import("./components/TesterDashboard"));
const ComprehensiveCartoonifier = lazy(() => import("./pages/ComprehensiveCartoonifier"));
const Auth = lazy(() => import("./pages/Auth"));

import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { DevModeProvider } from "@/contexts/DevModeContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthRedirect } from "@/components/AuthRedirect";

const queryClient = new QueryClient();

const AppRoutes = () => {
  useSessionTracker();
  // Ensure Google Maps Places API is loaded once globally
  const { isReady: isMapsReady } = useGoogleMaps();
  
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    }>
      <Routes>
        <Route path="/" element={<UnifiedHome />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminPanel /></ProtectedRoute>} />
        <Route path="/tester" element={<TesterDashboard />} />
        <Route path="/cartoonifier" element={<ProtectedRoute><CartoonifierNew /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <DevModeProvider>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ActivityTracker />
                  <AuthRedirect />
                  <DetailedCupid />
                  <FloatingEmoji />
                  <main className="max-w-7xl mx-auto px-4 py-6">
                    <AppRoutes />
                  </main>
                </BrowserRouter>
              </TooltipProvider>
            </AuthProvider>
          </DevModeProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
