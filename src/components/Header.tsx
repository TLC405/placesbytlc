import { useState } from "react";
import { Heart, Menu, X, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChangelogModal } from "@/components/ChangelogModal";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const location = useLocation();
  const [showChangelog, setShowChangelog] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: "/", label: "Home", icon: null },
    { path: "/explore", label: "Explore", icon: null },
    { path: "/plan", label: "Plan", icon: null },
    { path: "/quizzes", label: "Quizzes", icon: null },
    { path: "/period-tracker", label: "Peripod", icon: "📅" },
    { path: "/teefeeme", label: "TeeFee Me", icon: "🎨" },
    { path: "/install", label: "Install", icon: "📲" },
    { path: "/admin", label: "Admin", icon: "👑" },
  ];
  
  return (
    <>
      <header className="sticky top-0 z-50 glass shadow-romantic border-b border-primary/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-br from-amber-700 to-amber-900 rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-all duration-300">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white animate-pulse" />
              </div>
              <div className="leading-tight">
                <div className="text-lg sm:text-2xl font-black gradient-text">FELICIA.TLC</div>
                <div className="text-[10px] sm:text-xs text-primary/70 -mt-1 font-medium tracking-wider hidden sm:block">
                  ✨ YOUR LOVE JOURNEY ✨
                </div>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button 
                    variant={isActive(item.path) ? "default" : "outline"} 
                    size="sm"
                    className="gap-1"
                  >
                    {item.icon && <span>{item.icon}</span>}
                    {item.label}
                  </Button>
                </Link>
              ))}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowChangelog(true)}
                className="gap-1"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden xl:inline">Updates</span>
              </Button>
              <DarkModeToggle />
            </nav>

            {/* Mobile Menu */}
            <div className="flex items-center gap-2 lg:hidden">
              <DarkModeToggle />
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-card/95 backdrop-blur-xl border-primary/20">
                  <div className="flex flex-col gap-4 pt-8">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                      <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-amber-700 to-amber-900 rounded-full border-2 border-white shadow-lg">
                        <Heart className="w-6 h-6 text-white fill-white" />
                      </div>
                      <div>
                        <div className="text-xl font-black gradient-text">FELICIA.TLC</div>
                        <div className="text-xs text-muted-foreground">Your Love Journey</div>
                      </div>
                    </div>

                    {navItems.map((item) => (
                      <Link 
                        key={item.path} 
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button 
                          variant={isActive(item.path) ? "default" : "outline"} 
                          className="w-full justify-start gap-3 h-12 text-base"
                        >
                          {item.icon && <span className="text-xl">{item.icon}</span>}
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                    
                    <Button 
                      variant="outline"
                      className="w-full justify-start gap-3 h-12 text-base"
                      onClick={() => {
                        setShowChangelog(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      <Sparkles className="w-5 h-5" />
                      What's New
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <ChangelogModal open={showChangelog} onOpenChange={setShowChangelog} />
    </>
  );
};
