import { useNavigate } from "react-router-dom";
import { Heart, Brain, Sparkles, ArrowRight } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <div className="page-content space-y-8">
        {/* Hero */}
        <header className="text-center pt-12 animate-in">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-display text-4xl mb-3">Places by TLC</h1>
          <p className="text-body max-w-sm mx-auto">
            Your guide to perfect dates, quizzes, and couple adventures in OKC
          </p>
        </header>

        {/* Features */}
        <div className="space-y-3 animate-in-delay-1">
          <button
            onClick={() => navigate("/")}
            className="feature-card w-full"
          >
            <div className="feature-icon bg-primary/10 text-primary">
              <Heart className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-foreground">Places</h3>
              <p className="text-xs text-muted-foreground">70+ curated date spots</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </button>

          <button
            onClick={() => navigate("/quizzes")}
            className="feature-card w-full"
          >
            <div className="feature-icon bg-violet-100 dark:bg-violet-900/30 text-violet-500">
              <Brain className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-foreground">Quizzes</h3>
              <p className="text-xs text-muted-foreground">Personality & compatibility</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </button>

          <button
            onClick={() => navigate("/ai-recommender")}
            className="feature-card w-full"
          >
            <div className="feature-icon bg-amber-100 dark:bg-amber-900/30 text-amber-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-foreground">Cupid AI</h3>
              <p className="text-xs text-muted-foreground">Smart date recommendations</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* CTA */}
        <div className="animate-in-delay-2">
          <button
            onClick={() => navigate("/")}
            className="btn-primary w-full h-14 text-lg"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground animate-in-delay-3">
          Made with love for OKC couples
        </p>
      </div>
    </div>
  );
}
