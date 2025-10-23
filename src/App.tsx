import { useState, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ActivityTracker } from "@/components/ActivityTracker";
import { DetailedCupid } from "@/components/DetailedCupid";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Plan from "./pages/Plan";
import NotFound from "./pages/NotFound";

// Lazy load quiz pages and special features
const Quizzes = lazy(() => import("./pages/Quizzes"));
const QuizLove = lazy(() => import("./pages/QuizLove"));
const QuizMBTI = lazy(() => import("./pages/QuizMBTI"));
const TeeFeeMeCartoonifier = lazy(() => import("./pages/TeeFeeMeCartoonifier"));
const PeriodTracker = lazy(() => import("./pages/PeriodTracker"));
const Install = lazy(() => import("./pages/Install"));
const FeliciaModPanel = lazy(() => import("./components/FeliciaModPanel"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

import { useGoogleMaps } from "@/hooks/useGoogleMaps";

const queryClient = new QueryClient();

const App = () => {
  // Show loading screen only on first app load
  const [showLoader, setShowLoader] = useState(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');
    return !hasVisited;
  });

  const handleLoadingComplete = () => {
    setShowLoader(false);
    sessionStorage.setItem('hasVisited', 'true');
  };

  if (showLoader) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  // Ensure Google Maps Places API is loaded once globally
  const { isReady: isMapsReady } = useGoogleMaps();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ActivityTracker />
          <DetailedCupid />
          <Header />
          <main className="max-w-7xl mx-auto px-4 py-6">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
              </div>
            }>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/plan" element={<Plan />} />
                <Route path="/quizzes" element={<Quizzes />} />
                <Route path="/quiz/love" element={<QuizLove />} />
                <Route path="/quiz/mbti" element={<QuizMBTI />} />
                <Route path="/period-tracker" element={<PeriodTracker />} />
                <Route path="/teefeeme" element={<TeeFeeMeCartoonifier />} />
                <Route path="/cartoon-generator" element={<TeeFeeMeCartoonifier />} />
                <Route path="/install" element={<Install />} />
                <Route path="/felicia-mod" element={<FeliciaModPanel />} />
                <Route path="/admin-1309" element={<AdminPanel />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
