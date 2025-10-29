import React, { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppAuthGate } from "@/components/AppAuthGate";
import { EntryGate } from "@/components/EntryGate";
import { ActivityTracker } from "@/components/ActivityTracker";
import { DetailedCupid } from "@/components/DetailedCupid";
import { FloatingEmoji } from "@/components/FloatingEmoji";
import { useSessionTracker } from "@/hooks/useSessionTracker";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import HackerHome from "./pages/HackerHome";
import NotFound from "./pages/NotFound";

// Lazy load quiz pages and special features
const HackerScreen = lazy(() => import("./pages/HackerScreen"));
const Quizzes = lazy(() => import("./pages/Quizzes"));
const QuizLove = lazy(() => import("./pages/QuizLove"));
const QuizMBTI = lazy(() => import("./pages/QuizMBTI"));
const QuizRelationshipStyle = lazy(() => import("./pages/QuizRelationshipStyle"));
const PeriodTracker = lazy(() => import("./pages/PeriodTracker"));
const FeliciaModPanel = lazy(() => import("./components/FeliciaModPanel"));
const CodeViewer = lazy(() => import("./pages/CodeViewer"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const TesterDashboard = lazy(() => import("./components/TesterDashboard"));
const AIRecommender = lazy(() => import("./pages/AIRecommender"));
const CoupleMode = lazy(() => import("./pages/CoupleMode"));
const Gamification = lazy(() => import("./pages/Gamification"));
const OKCLegendForge = lazy(() => import("./pages/EnhancedOKCLegend"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const CartoonifierNew = lazy(() => import("./pages/CartoonifierNew"));
const Auth = lazy(() => import("./pages/Auth"));

import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { DevModeProvider } from "@/contexts/DevModeContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { PINProvider } from "@/contexts/PINContext";

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
        <Route path="/hacker" element={<HackerScreen />} />
        <Route path="/" element={<HackerHome />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quiz/love" element={<QuizLove />} />
        <Route path="/quiz/mbti" element={<QuizMBTI />} />
        <Route path="/quiz/relationship-style" element={<QuizRelationshipStyle />} />
        <Route path="/period-tracker" element={<PeriodTracker />} />
        <Route path="/code" element={<CodeViewer />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/tester" element={<TesterDashboard />} />
        <Route path="/ai-recommender" element={<AIRecommender />} />
        <Route path="/couple-mode" element={<CoupleMode />} />
        <Route path="/gamification" element={<Gamification />} />
        <Route path="/okc-legend" element={<OKCLegendForge />} />
        <Route path="/boo-mode" element={<ComingSoon />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/cartoonifier" element={<CartoonifierNew />} />
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
              <PINProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <EntryGate>
                      <AppAuthGate>
                        <ActivityTracker />
                        <DetailedCupid />
                        <FloatingEmoji />
                        <main className="max-w-7xl mx-auto px-4 py-6">
                          <AppRoutes />
                        </main>
                      </AppAuthGate>
                    </EntryGate>
                  </BrowserRouter>
                </TooltipProvider>
              </PINProvider>
            </AuthProvider>
          </DevModeProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
