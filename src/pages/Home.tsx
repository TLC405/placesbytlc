import { useNavigate } from "react-router-dom";
import { Heart, Brain } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <div className="page-content space-y-8 animate-in">
        {/* Header */}
        <header className="text-center pt-8">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-display">Places by TLC</h1>
          <p className="text-body mt-2">
            Explore date spots, quizzes, and adventures
          </p>
        </header>

        {/* Actions */}
        <div className="grid gap-4 animate-in-delay-1">
          <button
            onClick={() => navigate("/okc-legend")}
            className="card-luxury p-6 text-left"
          >
            <div className="feature-icon bg-primary/10 text-primary mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-headline text-foreground mb-1">Places</h3>
            <p className="text-body text-sm">Discover great OKC date spots</p>
          </button>

          <button
            onClick={() => navigate("/quizzes")}
            className="card-luxury p-6 text-left"
          >
            <div className="feature-icon bg-secondary/30 text-foreground mb-3">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-headline text-foreground mb-1">Quizzes</h3>
            <p className="text-body text-sm">Find compatibility and love language</p>
          </button>
        </div>
      </div>
    </div>
  );
}
