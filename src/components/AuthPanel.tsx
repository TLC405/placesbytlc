import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Heart, Mail, Lock, UserPlus, LogIn, Key } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const AuthPanel = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [testerCode, setTesterCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back! 💕");
        navigate("/");
      } else {
        // Sign up - check for tester code
        const role = testerCode === "405" ? "tester" : "user";
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              display_name: displayName,
              role: role,
            }
          }
        });
        if (error) throw error;
        toast.success(role === "tester" ? "Tester Account Created! Welcome to testing 🧪" : "Welcome to Places by TLC! 💕");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="relative overflow-hidden border-4 border-primary/30 shadow-2xl backdrop-blur-xl bg-gradient-to-br from-background via-background/95 to-background/90 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-rose-500/10 animate-pulse" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/80" />
      
      <CardHeader className="relative z-10 text-center space-y-6 pb-8 pt-8">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500 via-purple-500 to-rose-600 flex items-center justify-center shadow-2xl shadow-primary/50 ring-8 ring-primary/20 backdrop-blur-xl animate-float">
            <Heart className="w-12 h-12 text-white animate-pulse drop-shadow-2xl" fill="currentColor" />
          </div>
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-rose-600 opacity-20 blur-xl animate-pulse" />
        </div>
        <div className="space-y-3">
          <CardTitle className="text-5xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text text-transparent mb-2 tracking-tight animate-gradient bg-[length:200%_auto]">
            {isLogin ? "👑 Welcome Back" : "✨ Join FELICIA.TLC"}
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground/90 font-medium max-w-md mx-auto leading-relaxed">
            {isLogin 
              ? "Sign in to access your saved places and continue your romantic journey through OKC" 
              : "Create your account to unlock AI-powered date planning and exclusive features"}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 px-8 pb-8">
        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="displayName" className="flex items-center gap-2 text-sm font-medium">
                  <UserPlus className="w-4 h-4 text-primary" />
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={!isLogin}
                  className="border-primary/20 focus:border-primary/50 transition-all h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="testerCode" className="flex items-center gap-2 text-sm font-medium">
                  <Key className="w-4 h-4 text-purple-600" />
                  Tester Code (Optional)
                </Label>
                <Input
                  id="testerCode"
                  type="text"
                  placeholder="Enter 405 for tester access"
                  value={testerCode}
                  onChange={(e) => setTesterCode(e.target.value)}
                  className="border-primary/20 focus:border-primary/50 transition-all h-11"
                />
                {testerCode === "405" && (
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    ✅ Tester Access: Search, Explore, Plan & Cartoon Editor
                  </p>
                )}
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="w-4 h-4 text-primary" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-primary/20 focus:border-primary/50 transition-all h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
              <Lock className="w-4 h-4 text-primary" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="border-primary/20 focus:border-primary/50 transition-all h-11"
            />
            {!isLogin && (
              <p className="text-xs text-muted-foreground">
                Minimum 6 characters
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full gap-2 shadow-2xl h-14 text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-rose-600 hover:from-pink-600 hover:via-purple-600 hover:to-rose-700 text-white font-bold transition-all hover:scale-105 active:scale-95 animate-gradient bg-[length:200%_auto]" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isLogin ? "Signing in..." : "Creating Account..."}
              </div>
            ) : isLogin ? (
              <>
                <LogIn className="w-5 h-5" />
                Sign In to Your Account
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Your Account
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="w-full hover:bg-primary/5 transition-colors"
            onClick={() => {
              setIsLogin(!isLogin);
              setDisplayName("");
            }}
          >
            {isLogin 
              ? "Need an account? Sign up →" 
              : "Already have an account? Sign in →"}
          </Button>

          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-center text-muted-foreground/70">
              🔒 Enterprise-grade security powered by Lovable Cloud
            </p>
            <p className="text-xs text-center text-muted-foreground/60 mt-1">
              Your data is encrypted and protected
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
