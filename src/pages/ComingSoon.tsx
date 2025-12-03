import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        <div className="text-center space-y-6 animate-in max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto animate-pulse-soft">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-display text-foreground">Coming Soon</h1>
            <p className="text-body">
              We're working on something special. Check back soon for updates!
            </p>
          </div>
          <button onClick={() => navigate("/")} className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
