import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ActivityTracker } from "@/components/ActivityTracker";
import { DetailedCupid } from "@/components/DetailedCupid";
import { BottomTabBar } from "@/components/BottomTabBar";
import { useSessionTracker } from "@/hooks/useSessionTracker";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import HackerHome from "./pages/HackerHome";
import NotFound from "./pages/NotFound";

const Quizzes = lazy(() => import("./pages/Quizzes"));
const QuizLove = lazy(() => import("./pages/QuizLove"));
const QuizMBTI = lazy(() => import("./pages/QuizMBTI"));
const QuizRelationshipStyle = lazy(() => import("./pages/QuizRelationshipStyle"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AIRecommender = lazy(() => import("./pages/AIRecommender"));
const PlacesPage = lazy(() => import("./pages/EnhancedOKCLegend"));
const Auth = lazy(() => import("./pages/Auth"));

import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { DevModeProvider } from "@/contexts/DevModeContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { PINProvider } from "@/contexts/PINContext";

const queryClient = new QueryClient();

const AppRoutes = () => {
  useSessionTracker();
  useGoogleMaps();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<HackerHome />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quiz/love" element={<QuizLove />} />
        <Route path="/quiz/mbti" element={<QuizMBTI />} />
        <Route path="/quiz/relationship-style" element={<QuizRelationshipStyle />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/ai-recommender" element={<AIRecommender />} />
        <Route path="/places" element={<PlacesPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomTabBar />
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
                  <ActivityTracker />
                  <DetailedCupid />
                  <AppRoutes />
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
