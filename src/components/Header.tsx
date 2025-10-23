import { useState } from "react";
import { Heart, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChangelogModal } from "@/components/ChangelogModal";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export const Header = () => {
  const location = useLocation();
  const [showChangelog, setShowChangelog] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <>
      <header className="sticky top-0 z-40 glass shadow-romantic border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-amber-700 to-amber-900 rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-all duration-300">
              <Heart className="w-6 h-6 text-white fill-white animate-pulse" />
            </div>
            <div className="leading-tight">
              <div className="text-2xl font-black gradient-text">FELICIA.TLC</div>
              <div className="text-xs text-primary/70 -mt-1 font-medium tracking-wider">✨ YOUR LOVE JOURNEY ✨</div>
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
            <Link to="/period-tracker">
              <Button 
                variant={isActive("/period-tracker") ? "default" : "outline"} 
                size="sm"
                className="gap-1"
              >
                📅 Peripod
              </Button>
            </Link>
            <Link to="/teefeeme">
              <Button 
                variant={isActive("/teefeeme") || isActive("/cartoon-generator") ? "default" : "outline"} 
                size="sm"
                className="gap-1"
              >
                🎨 TeeFee Me
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
            <DarkModeToggle />
          </nav>
        </div>
      </header>

      <ChangelogModal open={showChangelog} onOpenChange={setShowChangelog} />
    </>
  );
};
