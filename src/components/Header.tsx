import { useState, useEffect } from "react";
import { Heart, Sparkles, Palette, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { getStoredRole, type AppRole } from "@/utils/rbac";
import { toast } from "sonner";

export const Header = () => {
  const location = useLocation();
  const [role, setRole] = useState<AppRole | null>(null);
  
  useEffect(() => {
    // Check role from localStorage
    const currentRole = getStoredRole();
    setRole(currentRole);
    
    // Listen for role changes
    const handleStorageChange = () => {
      setRole(getStoredRole());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const isActive = (path: string) => location.pathname === path;
  
  const allNavItems = [
    { path: "/", label: "Places by TLC", icon: Heart, emoji: "📍", requiredRole: ['tester', 'admin', 'warlord'] },
    { path: "/teefeeme", label: "TeeFee Me", icon: Palette, emoji: "🎨", requiredRole: ['tester', 'admin', 'warlord'] },
    { path: "/admin", label: "Admin", icon: Shield, emoji: "⚙️", requiredRole: ['admin', 'warlord'] },
  ];
  
  // Show all tabs but mark some as disabled for testers
  const navItems = allNavItems.map(item => ({
    ...item,
    disabled: role === 'tester' && !['/', '/teefeeme'].includes(item.path)
  }));
  
  // Hide header on hacker page
  if (location.pathname === '/hacker') return null;
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass shadow-glow border-b-2 border-primary/30 backdrop-blur-xl"
        style={{ overflowX: 'hidden', overflowY: 'visible' }}>
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
                  ✨ INPERSON.TLC ✨
                </div>
                <div className="text-xs sm:text-sm font-bold tracking-widest hidden sm:block bg-gradient-to-r from-amber-400 via-rose-400 to-amber-400 bg-clip-text text-transparent animate-gradient-shift" style={{ backgroundSize: '200% 200%' }}>
                  <span className="inline-block animate-pulse">💕</span>
                  <span className="mx-1">
                    TOGETHER OR AWAY, YOU TWO SHALL PLAY
                  </span>
                  <span className="inline-block animate-pulse delay-75">💕</span>
                </div>
              </div>
            </Link>
            
            {/* All-Screen Navigation - Horizontal scroll on mobile */}
            <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide max-w-[calc(100vw-300px)] sm:max-w-none">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    className="flex-shrink-0"
                    onClick={(e) => {
                      if (item.disabled) {
                        e.preventDefault();
                        e.stopPropagation();
                        toast.info("🚫 OPERATION RESTRICTED", {
                          description: `Access Level: TESTER. Upgrade required for ${item.label}.`,
                          duration: 4000,
                        });
                        return false;
                      }
                    }}
                  >
                    <Button 
                      variant={isActive(item.path) ? "default" : "outline"} 
                      size="sm"
                      disabled={item.disabled}
                      className={`gap-1 sm:gap-2 font-semibold transition-all duration-300 text-xs sm:text-sm ${
                        item.disabled ? "opacity-50 cursor-not-allowed" : ""
                      } ${
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
