import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-40 glass shadow-romantic border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl gradient-primary grid place-items-center text-white shadow-glow group-hover:scale-110 transition-all duration-300">
            <Heart className="w-5 h-5 fill-white group-hover:animate-pulse" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">TLC Date Night</div>
            <div className="text-xs text-muted-foreground -mt-0.5 font-medium">Explore • Plan • Match</div>
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
        </nav>
      </div>
    </header>
  );
};
