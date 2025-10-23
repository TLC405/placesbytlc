import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ActivityTracker } from "@/components/ActivityTracker";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Plan from "./pages/Plan";
import Quizzes from "./pages/Quizzes";
import QuizLove from "./pages/QuizLove";
import QuizMBTI from "./pages/QuizMBTI";
import TeeFeeMeCartoonifier from "./pages/TeeFeeMeCartoonifier";
import FeliciaModPanel from "./components/FeliciaModPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showLoader, setShowLoader] = useState(true);

  if (showLoader) {
    return <LoadingScreen onComplete={() => setShowLoader(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ActivityTracker />
          <Header />
          <main className="max-w-7xl mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/plan" element={<Plan />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/quiz/love" element={<QuizLove />} />
              <Route path="/quiz/mbti" element={<QuizMBTI />} />
              <Route path="/teefeeme" element={<TeeFeeMeCartoonifier />} />
              <Route path="/cartoon-generator" element={<TeeFeeMeCartoonifier />} />
              <Route path="/felicia-mod" element={<FeliciaModPanel />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
