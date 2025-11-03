import { Heart, Sparkles, Palette, Shield, LogOut, User, Settings, LogIn } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { ThemeSelector } from "@/components/ThemeSelector";
import { DevModeBadge } from "@/components/DevModeBadge";
import { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
  const { hasRole, isLoading } = useUserRole();
  const { user, showLogin } = useAuth();
  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLocalUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLocalUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAdminClick = () => {
    if (!isLoading && hasRole('admin')) {
      navigate('/admin');
    } else if (!localUser) {
      toast.error("Please sign in to access admin features");
      showLogin();
    } else {
      toast.error("Admin access required");
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("✨ Signed out successfully");
      window.location.href = "/";
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Failed to sign out");
    }
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  const allNavItems = [
    { path: "/", label: "Places", icon: Heart, emoji: "📍" },
    { path: "/couple-mode", label: "Couple", icon: User, emoji: "💑" },
    { path: "/cartoonifier", label: "TeeFeeMe", icon: Palette, emoji: "🎨" },
    { path: "/quizzes", label: "Quizzes", icon: Sparkles, emoji: "✨" },
  ];
  
  // Hide header on hacker page
  if (location.pathname === '/hacker') return null;
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#964B00]/90 backdrop-blur-xl border-b-2 border-[#8BC34A]/30 shadow-lg"
        style={{ overflowX: 'hidden', overflowY: 'visible' }}>
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#8BC34A]/10 via-[#F7DC6F]/10 to-[#8BC34A]/10 opacity-50 animate-gradient-shift" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo with Admin Icon */}
            <div className="flex items-center gap-4">
              {/* Admin Icon - Always Visible (Top Left) */}
              <Button
                onClick={handleAdminClick}
                variant="outline"
                size="sm"
                className="flex-shrink-0 gap-2 hover:bg-[#F7DC6F] hover:border-[#8BC34A] transition-all border-[#8BC34A] text-[#03A9F4] hover:text-[#964B00]"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline font-mono">[ADMIN]</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 sm:gap-4 group relative hover:scale-105 transition-transform duration-300">
                    {/* Pulsing glow effect */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#8BC34A]/20 to-[#F7DC6F]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
                    
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-[#8BC34A] via-[#F7DC6F] to-[#8BC34A] rounded-2xl shadow-lg group-hover:shadow-[0_0_40px_#F7DC6F] transition-all duration-300 group-hover:rotate-12 border-2 border-white/20">
                      <span className="text-3xl">🍄</span>
                      <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-[#F7DC6F] animate-pulse" />
                    </div>
                    
                    <div className="leading-tight">
                      <div className="text-xl sm:text-3xl font-black text-[#03A9F4] tracking-tight drop-shadow-lg">
                        ✨ TEEFEEME ✨
                      </div>
                      <div className="text-xs sm:text-sm font-bold tracking-widest hidden sm:block text-[#F7DC6F]">
                        <span className="inline-block animate-pulse">🍄</span>
                        <span className="mx-1">
                          IDENTITY-LOCKED CARTOON MAGIC
                        </span>
                        <span className="inline-block animate-pulse delay-75">🍄</span>
                      </div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 bg-white dark:bg-[#964B00] border-[#8BC34A]/30">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-[#03A9F4]">Quick Actions</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleAdminClick} className="text-[#03A9F4]">
                    <Settings className="w-4 h-4 mr-2" />
                    Admin Panel
                  </DropdownMenuItem>
                  {!localUser ? (
                    <DropdownMenuItem onClick={showLogin} className="text-[#03A9F4]">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={handleLogout} className="text-[#03A9F4]">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* All-Screen Navigation - Horizontal scroll on mobile */}
            <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide max-w-[calc(100vw-300px)] sm:max-w-none">
              <DevModeBadge />
              {allNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    className="flex-shrink-0"
                  >
                    <Button 
                      variant={isActive(item.path) ? "secondary" : "outline"} 
                      size="sm"
                      className={`gap-1 sm:gap-2 font-semibold transition-all duration-300 text-xs sm:text-sm border-[#8BC34A] text-[#03A9F4] hover:bg-[#F7DC6F] hover:text-[#964B00] ${
                        isActive(item.path) 
                          ? "bg-[#F7DC6F] text-[#964B00] shadow-lg scale-105" 
                          : "hover:scale-105"
                      }`}
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden md:inline">{item.label}</span>
                      <span className="md:hidden">{item.emoji}</span>
                    </Button>
                  </Link>
                );
              })}
              <div className="flex-shrink-0 flex items-center gap-2">
                <ThemeSelector />
                <DarkModeToggle />
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};