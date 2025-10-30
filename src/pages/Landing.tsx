import { useNavigate } from "react-router-dom";
import { Shield, Heart, LogIn, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleAdminAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      toast.success("💖 Signed in successfully!");
      setIsAuthDialogOpen(false);
      setEmail("");
      setPassword("");
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      {/* Floating hearts background */}
      <div className="fixed inset-0 -z-10 opacity-20 pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 text-4xl sm:text-6xl animate-float" style={{ animationDelay: "0s" }}>💕</div>
        <div className="absolute top-40 right-20 text-3xl sm:text-4xl animate-float" style={{ animationDelay: "1s" }}>💖</div>
        <div className="absolute bottom-32 left-1/4 text-4xl sm:text-5xl animate-float" style={{ animationDelay: "2s" }}>💗</div>
        <div className="absolute bottom-20 right-1/3 text-2xl sm:text-3xl animate-float" style={{ animationDelay: "1.5s" }}>✨</div>
        <div className="absolute top-1/3 right-10 text-3xl sm:text-4xl animate-float" style={{ animationDelay: "0.5s" }}>🌸</div>
        <div className="absolute bottom-40 left-20 text-4xl sm:text-5xl animate-float" style={{ animationDelay: "2.5s" }}>🎀</div>
      </div>

      {/* Romantic gradient accents */}
      <div className="fixed top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="fixed bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-tr from-rose-300/30 to-pink-300/30 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      {/* Command Center */}
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12 sm:mb-16 space-y-6 sm:space-y-8 relative">
          <div className="inline-block relative animate-bounce-slow">
            <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-30 blur-3xl animate-pulse" aria-hidden="true" />
              <div className="relative w-full h-full bg-gradient-to-br from-pink-400 via-rose-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl text-5xl sm:text-6xl" role="img" aria-label="Heart icon">
                💖
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight gradient-text animate-gradient px-4" style={{ backgroundSize: "200% 200%" }}>
              Start Your Journey
            </h1>
            <div className="flex items-center justify-center gap-3 sm:gap-4 px-4">
              <div className="h-0.5 sm:h-1 w-16 sm:w-24 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden="true" />
              <p className="text-primary font-bold text-lg sm:text-2xl tracking-wide">With Love</p>
              <div className="h-0.5 sm:h-1 w-16 sm:w-24 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden="true" />
            </div>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
              Discover perfect date spots, explore romantic destinations, and create unforgettable memories together ✨
            </p>
          </div>
        </header>

        {/* Main grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Places */}
          <Card
            className="group relative overflow-hidden glass-card border-2 border-primary/20 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => user ? navigate("/") : toast.error("Please sign in first")}
            tabIndex={0}
            role="button"
            aria-label="Navigate to Places by TLC"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                user ? navigate("/") : toast.error("Please sign in first");
              }
            }}
          >
            <div className="absolute top-0 left-0 w-full h-2 gradient-primary" aria-hidden="true" />
            <div className="p-6 sm:p-8 space-y-4 sm:space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" aria-hidden="true">
                <span className="text-3xl sm:text-4xl">📍</span>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black gradient-text mb-2">Places by TLC</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Discover perfect date spots and romantic destinations</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="pill text-xs">Search</span>
                <span className="pill text-xs">Discovery</span>
                <span className="pill text-xs">Romance</span>
              </div>
            </div>
          </Card>

          {/* Quizzes */}
          <Card
            className="group relative overflow-hidden glass-card border-2 border-primary/20 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => user ? navigate("/quizzes") : toast.error("Please sign in first")}
            tabIndex={0}
            role="button"
            aria-label="Navigate to Love Quizzes"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                user ? navigate("/quizzes") : toast.error("Please sign in first");
              }
            }}
          >
            <div className="absolute top-0 left-0 w-full h-2 gradient-primary" aria-hidden="true" />
            <div className="p-6 sm:p-8 space-y-4 sm:space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" aria-hidden="true">
                <span className="text-3xl sm:text-4xl">💝</span>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black gradient-text mb-2">Love Quizzes</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Discover your personality and compatibility</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="pill text-xs">MBTI</span>
                <span className="pill text-xs">Love Language</span>
                <span className="pill text-xs">Compatibility</span>
              </div>
            </div>
          </Card>

          {/* Admin Access */}
          <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
            <DialogTrigger asChild>
              <Card 
                className="group relative overflow-hidden glass-card border-2 border-amber-400/30 hover:border-amber-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-400/20 cursor-pointer hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                tabIndex={0}
                role="button"
                aria-label="Open admin portal login"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-yellow-500" aria-hidden="true" />
                <div className="p-6 sm:p-8 space-y-4 sm:space-y-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" aria-hidden="true">
                    <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent mb-2">Admin Portal</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">Manage the platform and view analytics</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="pill text-xs">Analytics</span>
                    <span className="pill text-xs">Management</span>
                    <span className="pill text-xs">Control</span>
                  </div>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="glass-card border-2 border-primary/30 max-w-md mx-4 sm:mx-auto">
              <DialogHeader>
                <DialogTitle className="gradient-text text-xl sm:text-2xl">Admin Access</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdminAccess} className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <div className="space-y-2">
                  <label htmlFor="admin-email" className="text-sm font-semibold text-foreground">Email</label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="h-11 sm:h-12 rounded-xl"
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="admin-password" className="text-sm font-semibold text-foreground">Password</label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-11 sm:h-12 rounded-xl"
                    aria-required="true"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSigningIn}
                  className="w-full h-12 sm:h-14 gradient-primary text-white font-bold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  aria-label={isSigningIn ? "Signing in" : "Access admin portal"}
                >
                  {isSigningIn ? "Signing in..." : <><LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />Access Admin Portal</>}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* CTA */}
        <div className="flex justify-center px-4">
          <Button
            size="lg"
            onClick={() => user ? navigate("/") : toast.error("Please sign in to begin your journey")}
            className="h-14 sm:h-16 px-8 sm:px-16 gradient-primary text-white font-black text-lg sm:text-xl shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Begin your love story"
          >
            💖 Begin Your Love Story
          </Button>
        </div>

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground flex-wrap px-4">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" aria-hidden="true" />
              Made with Love
            </span>
            <span aria-hidden="true">•</span>
            <span>✨ v1.0</span>
            <span aria-hidden="true">•</span>
            <span>TLC Army</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
