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
      <div className="fixed inset-0 -z-10 opacity-20">
        <div className="absolute top-20 left-10 text-6xl animate-float" style={{ animationDelay: "0s" }}>💕</div>
        <div className="absolute top-40 right-20 text-4xl animate-float" style={{ animationDelay: "1s" }}>💖</div>
        <div className="absolute bottom-32 left-1/4 text-5xl animate-float" style={{ animationDelay: "2s" }}>💗</div>
        <div className="absolute bottom-20 right-1/3 text-3xl animate-float" style={{ animationDelay: "1.5s" }}>✨</div>
        <div className="absolute top-1/3 right-10 text-4xl animate-float" style={{ animationDelay: "0.5s" }}>🌸</div>
        <div className="absolute bottom-40 left-20 text-5xl animate-float" style={{ animationDelay: "2.5s" }}>🎀</div>
      </div>

      {/* Romantic gradient accents */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-3xl" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-rose-300/30 to-pink-300/30 rounded-full blur-3xl" />

      {/* Command Center */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-8 relative">
          <div className="inline-block relative animate-bounce-slow">
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-30 blur-3xl animate-pulse" />
              <div className="relative w-full h-full bg-gradient-to-br from-pink-400 via-rose-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl text-6xl">
                💖
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight gradient-text animate-gradient" style={{ backgroundSize: "200% 200%" }}>
              Start Your Journey
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <p className="text-primary font-bold text-2xl tracking-wide">With Love</p>
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover perfect date spots, explore romantic destinations, and create unforgettable memories together ✨
            </p>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Places */}
          <Card
            className="group relative overflow-hidden glass-card border-2 border-primary/20 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer hover-lift"
            onClick={() => navigate("/")}
          >
            <div className="absolute top-0 left-0 w-full h-2 gradient-primary" />
            <div className="p-8 space-y-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-4xl">📍</span>
              </div>
              <div>
                <h3 className="text-3xl font-black gradient-text mb-2">Places by TLC</h3>
                <p className="text-muted-foreground">Discover perfect date spots and romantic destinations</p>
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
            className="group relative overflow-hidden glass-card border-2 border-primary/20 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer hover-lift"
            onClick={() => navigate("/quizzes")}
          >
            <div className="absolute top-0 left-0 w-full h-2 gradient-primary" />
            <div className="p-8 space-y-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-4xl">💝</span>
              </div>
              <div>
                <h3 className="text-3xl font-black gradient-text mb-2">Love Quizzes</h3>
                <p className="text-muted-foreground">Discover your personality and compatibility</p>
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
              <Card className="group relative overflow-hidden glass-card border-2 border-amber-400/30 hover:border-amber-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-400/20 cursor-pointer hover-lift">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-yellow-500" />
                <div className="p-8 space-y-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Settings className="text-3xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent mb-2">Admin Portal</h3>
                    <p className="text-muted-foreground">Manage the platform and view analytics</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="pill text-xs">Analytics</span>
                    <span className="pill text-xs">Management</span>
                    <span className="pill text-xs">Control</span>
                  </div>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="glass-card border-2 border-primary/30">
              <DialogHeader>
                <DialogTitle className="gradient-text text-2xl">Admin Access</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdminAccess} className="space-y-6 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSigningIn}
                  className="w-full h-14 gradient-primary text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  {isSigningIn ? "Signing in..." : <><LogIn className="w-5 h-5 mr-2" />Access Admin Portal</>}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => navigate("/")}
            className="h-16 px-16 gradient-primary text-white font-black text-xl shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105 rounded-full"
          >
            💖 Begin Your Love Story
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center space-y-4">
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Made with Love
            </span>
            <span>•</span>
            <span>✨ v1.0</span>
            <span>•</span>
            <span>TLC Army</span>
          </div>
        </div>
      </div>
    </div>
  );
}
