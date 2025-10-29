import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Terminal, Zap } from "lucide-react";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          toast.success("🚀 Access Granted", {
            description: "Welcome back to the system",
          });
          navigate("/");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) throw error;

        if (data.user) {
          toast.success("✅ Account Created", {
            description: "You can now access the system",
          });
          navigate("/");
        }
      }
    } catch (error: any) {
      toast.error("Authentication Failed", {
        description: error.message || "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-primary/20 shadow-2xl relative z-10">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Terminal className="w-8 h-8 text-primary animate-pulse" />
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">
              {isLogin ? "SYSTEM ACCESS" : "CREATE ACCOUNT"}
            </h1>
            <p className="text-sm text-muted-foreground font-mono">
              {isLogin ? "Enter credentials to continue" : "Initialize new user profile"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@system.dev"
                required
                className="bg-background/50 border-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-background/50 border-primary/20 focus:border-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold shadow-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : isLogin ? (
                "LOGIN"
              ) : (
                "SIGN UP"
              )}
            </Button>
          </form>

          {/* Toggle */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              {isLogin ? (
                <>
                  Need an account? <span className="text-primary font-bold">Sign up</span>
                </>
              ) : (
                <>
                  Already registered? <span className="text-primary font-bold">Login</span>
                </>
              )}
            </button>
          </div>

          {/* System Info */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-center text-muted-foreground font-mono">
              🔒 Secure Connection • Protected by TLC Systems
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
