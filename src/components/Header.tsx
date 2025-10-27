import { useState, useEffect } from "react";
import { Heart, Calendar, Brain, Palette, Download, Crown, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const location = useLocation();
  const [isTester, setIsTester] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsTester(false);
        setIsAdmin(false);
        return;
      }
      
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      const hasAdminRole = roles?.some(r => (r.role as string) === 'admin') ?? false;
      const hasTesterRole = roles?.some(r => (r.role as string) === 'tester') ?? false;
      
      setIsAdmin(hasAdminRole);
      setIsTester(hasTesterRole);
    };
    
    checkUserRole();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUserRole();
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  const isActive = (path: string) => location.pathname === path;
  
  const allNavItems = [
    { path: "/", label: "Home", icon: Heart, emoji: "💝", allowTester: true },
    { path: "/okc-legend", label: "Legend Forge", icon: Brain, emoji: "🔥", allowTester: true },
    { path: "/quizzes", label: "Quizzes", icon: Brain, emoji: "🧠", allowTester: false },
    { path: "/period-tracker", label: "Peripod", icon: Calendar, emoji: "📅", allowTester: false },
    { path: "/teefeeme", label: "TeeFee Me", icon: Palette, emoji: "🎨", allowTester: true },
    { path: "/admin", label: "Admin", icon: Crown, emoji: "👑", allowTester: false, adminOnly: true },
  ];
  
  const navItems = allNavItems.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    if (isTester && !item.allowTester) return false;
    return true;
  });
  
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
                <div className="text-xl sm:text-3xl font-black gradient-text tracking-tight drop-shadow-lg animate-pulse">
                  ✨ FELICIA.TLC ✨
                </div>
                <div className="text-xs sm:text-sm font-bold tracking-widest hidden sm:block bg-gradient-to-r from-amber-400 via-rose-400 to-amber-400 bg-clip-text text-transparent animate-gradient-shift" style={{ backgroundSize: '200% 200%' }}>
                  <span className="inline-block animate-pulse">👑</span>
                  <span className="mx-1">
                    QUEEN FELICIA'S LOVE HUB
                  </span>
                  <span className="inline-block animate-pulse delay-75">👑</span>
                </div>
              </div>
            </Link>
            
            {/* All-Screen Navigation - Horizontal scroll on mobile */}
            <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide max-w-[calc(100vw-300px)] sm:max-w-none">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path} className="flex-shrink-0">
                    <Button 
                      variant={isActive(item.path) ? "default" : "outline"} 
                      size="sm"
                      className={`gap-1 sm:gap-2 font-semibold transition-all duration-300 text-xs sm:text-sm ${
                        isActive(item.path) 
                          ? "shadow-glow scale-105" 
                          : "hover:scale-105 hover:shadow-soft"
                      }`}
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden md:inline">{item.label}</span>
                      <span className="md:hidden">{item.emoji}</span>
                    </Button>
                  </Link>
                );
              })}
              <div className="flex-shrink-0">
                <DarkModeToggle />
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};
