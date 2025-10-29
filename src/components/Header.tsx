import { useState, useEffect } from "react";
import { Heart, Sparkles, Palette, Shield, LogOut, User, Settings } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { getStoredRole, type AppRole } from "@/utils/rbac";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleLogout = () => {
    localStorage.removeItem('pin_role');
    localStorage.removeItem('pin_expiry');
    toast.success('👋 Logged out successfully');
    navigate('/');
    window.location.reload();
  };
  
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
            {/* Enhanced Logo with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 sm:gap-4 group relative hover:scale-105 transition-transform duration-300">
                  {/* Pulsing glow effect */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
                  
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-primary via-accent to-primary-glow rounded-2xl shadow-glow group-hover:shadow-[0_0_40px_hsl(var(--primary)/0.6)] transition-all duration-300 group-hover:rotate-12 border-2 border-white/20">
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
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 glass border-primary/30">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold">Quick Actions</p>
                  <p className="text-xs text-muted-foreground">
                    {role === 'admin' || role === 'warlord' ? 'Admin' : 'Tester'} • {role}
                  </p>
                </div>
                <DropdownMenuSeparator />
                {(role === 'admin' || role === 'warlord') && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => toast.info('Profile features coming soon! 🚀')}>
                  <User className="w-4 h-4 mr-2" />
                  Save Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* All-Screen Navigation - Horizontal scroll on mobile */}
            <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide max-w-[calc(100vw-300px)] sm:max-w-none">
              {/* Admin Login Button - Always Visible */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (role === 'tester') {
                    toast.error("🚫 ADMIN ACCESS RESTRICTED", {
                      description: "Contact administrator for access upgrade.",
                      duration: 4000,
                    });
                  } else {
                    navigate('/');
                    window.location.reload();
                  }
                }}
                className={`gap-1 sm:gap-2 font-semibold transition-all duration-300 text-xs sm:text-sm ${
                  role === 'tester' ? "opacity-60 cursor-not-allowed" : "hover:scale-105 hover:shadow-soft"
                }`}
              >
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden md:inline">Admin</span>
                <span className="md:hidden">🔐</span>
              </Button>
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
