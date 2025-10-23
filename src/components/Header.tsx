import { useState } from "react";
import { Heart, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChangelogModal } from "@/components/ChangelogModal";

export const Header = () => {
  const location = useLocation();
  const [showChangelog, setShowChangelog] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <>
      <header className="sticky top-0 z-40 glass shadow-romantic border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 grid place-items-center text-white shadow-lg group-hover:scale-110 transition-all duration-300 font-bold text-base">
              T&F
            </div>
            <div className="leading-tight">
              <div className="text-lg font-bold text-foreground">TLC & Felicia's</div>
              <div className="text-xs text-rose-600 -mt-0.5 font-medium">Date Night</div>
            </div>
          </Link>
          
          <nav className="flex items-center gap-2">
            <Link to="/">
              <Button 
                variant={isActive("/") ? "default" : "outline"} 
                size="sm"
              >
                Home
              </Button>
            </Link>
            <Link to="/explore">
              <Button 
                variant={isActive("/explore") ? "default" : "outline"} 
                size="sm"
              >
                Explore
              </Button>
            </Link>
            <Link to="/plan">
              <Button 
                variant={isActive("/plan") ? "default" : "outline"} 
                size="sm"
              >
                Plan
              </Button>
            </Link>
            <Link to="/quizzes">
              <Button 
                variant={isActive("/quizzes") ? "default" : "outline"} 
                size="sm"
              >
                Quizzes
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowChangelog(true)}
              className="gap-1"
            >
              <Sparkles className="w-4 h-4" />
              Updates
            </Button>
          </nav>
        </div>
      </header>

      <ChangelogModal open={showChangelog} onOpenChange={setShowChangelog} />
    </>
  );
};
