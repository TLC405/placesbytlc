import { useState, useEffect } from "react";
import { Heart, Menu, Calendar, Brain, Palette, Download, Crown, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    { path: "/quizzes", label: "Quizzes", icon: Brain, emoji: "🧠", allowTester: false },
    { path: "/period-tracker", label: "Peripod", icon: Calendar, emoji: "📅", allowTester: false },
    { path: "/teefeeme", label: "TeeFee Me", icon: Palette, emoji: "🎨", allowTester: true },
    { path: "/install", label: "Install", icon: Download, emoji: "📲", allowTester: false },
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
                <div className="text-xl sm:text-3xl font-black text-foreground tracking-tight drop-shadow-sm">
                  FELICIA.TLC
                </div>
                <div className="text-xs sm:text-sm font-bold tracking-widest hidden sm:block text-muted-foreground">
                  <span className="inline-block animate-pulse">✨</span>
                  <span className="mx-1">
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
                        <div className="text-xl font-black text-foreground">
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
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
