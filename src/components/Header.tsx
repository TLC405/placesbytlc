import { useState } from "react";
import { Heart, Menu, Sparkles, Compass, Calendar, Brain, Palette, Download, Crown } from "lucide-react";
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
    { path: "/", label: "Home", icon: Heart, emoji: "💝" },
    { path: "/explore", label: "Explore", icon: Compass, emoji: "🗺️" },
    { path: "/plan", label: "Plan", icon: Calendar, emoji: "📋" },
    { path: "/quizzes", label: "Quizzes", icon: Brain, emoji: "🧠" },
    { path: "/period-tracker", label: "Peripod", icon: Calendar, emoji: "📅" },
    { path: "/teefeeme", label: "TeeFee Me", icon: Palette, emoji: "🎨" },
    { path: "/install", label: "Install", icon: Download, emoji: "📲" },
    { path: "/admin", label: "Admin", icon: Crown, emoji: "👑" },
  ];
  
  return (
    <>
      <header className="sticky top-0 z-50 glass shadow-glow border-b-2 border-primary/30 backdrop-blur-xl overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-50 animate-gradient-shift" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo */}
            <Link to="/" className="flex items-center gap-3 sm:gap-4 group relative">
              {/* Pulsing glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
              
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-primary via-accent to-primary-glow rounded-2xl shadow-glow group-hover:shadow-[0_0_40px_hsl(var(--primary)/0.6)] transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 border-2 border-white/20">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white heart-pulse" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
              </div>
              
              <div className="leading-tight">
                <div className="text-xl sm:text-3xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight drop-shadow-sm">
                  FELICIA.TLC
                </div>
                <div className="text-xs sm:text-sm font-bold tracking-widest hidden sm:block">
                  <span className="inline-block animate-pulse">✨</span>
                  <span className="bg-gradient-to-r from-primary/90 to-accent/90 bg-clip-text text-transparent mx-1">
                    YOUR LOVE JOURNEY
                  </span>
                  <span className="inline-block animate-pulse delay-75">✨</span>
                </div>
              </div>
            </Link>
            
            {/* Enhanced Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button 
                      variant={isActive(item.path) ? "default" : "outline"} 
                      size="sm"
                      className={`gap-2 font-semibold transition-all duration-300 ${
                        isActive(item.path) 
                          ? "shadow-glow scale-105" 
                          : "hover:scale-105 hover:shadow-soft"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden xl:inline">{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowChangelog(true)}
                className="gap-2 font-semibold hover:scale-105 transition-all duration-300 hover:shadow-soft"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="hidden xl:inline">Updates</span>
              </Button>
              <DarkModeToggle />
            </nav>

            {/* Enhanced Mobile Menu */}
            <div className="flex items-center gap-2 lg:hidden">
              <DarkModeToggle />
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 hover:scale-110 transition-transform">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[340px] bg-gradient-to-b from-card/98 to-background/98 backdrop-blur-xl border-l-2 border-primary/30 shadow-glow">
                  <div className="flex flex-col gap-3 pt-8">
                    {/* Enhanced mobile logo */}
                    <div className="flex items-center gap-3 mb-4 pb-5 border-b-2 border-primary/20">
                      <div className="relative w-14 h-14 flex items-center justify-center bg-gradient-to-br from-primary via-accent to-primary-glow rounded-2xl shadow-glow border-2 border-white/20">
                        <Heart className="w-7 h-7 text-white fill-white heart-pulse" />
                        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
                      </div>
                      <div>
                        <div className="text-xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          FELICIA.TLC
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                          <span className="animate-pulse">✨</span>
                          Your Love Journey
                          <span className="animate-pulse">✨</span>
                        </div>
                      </div>
                    </div>

                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link 
                          key={item.path} 
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Button 
                            variant={isActive(item.path) ? "default" : "outline"} 
                            className={`w-full justify-start gap-3 h-13 text-base font-semibold transition-all ${
                              isActive(item.path) ? "shadow-glow scale-105" : "hover:scale-105 hover:shadow-soft"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                            <span className="ml-auto text-lg">{item.emoji}</span>
                          </Button>
                        </Link>
                      );
                    })}
                    
                    <Button 
                      variant="outline"
                      className="w-full justify-start gap-3 h-13 text-base font-semibold hover:scale-105 hover:shadow-soft transition-all"
                      onClick={() => {
                        setShowChangelog(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      <Sparkles className="w-5 h-5 animate-pulse" />
                      <span>What's New</span>
                      <span className="ml-auto text-lg">🎉</span>
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
