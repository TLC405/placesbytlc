import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, Heart, ArrowLeft } from "lucide-react";
import { PoweredByTLC } from "@/components/PoweredByTLC";

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
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          toast.success("Welcome back!", { description: "You're now signed in" });
          navigate("/");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        if (data.user) {
          toast.success("Account created!", { description: "Welcome to InPerson OKC" });
          navigate("/");
        }
      }
    } catch (error: any) {
      toast.error("Something went wrong", { description: error.message || "Please try again" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-content flex flex-col min-h-[80vh]">
        <header className="animate-in">
          <button onClick={() => navigate("/")} className="btn-ghost -ml-3 mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </header>

        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-8">
            <div className="text-center animate-in">
              <div className="icon-premium mx-auto mb-4 w-16 h-16" style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}>
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-display text-foreground">
                {isLogin ? "Welcome back" : "Create account"}
              </h1>
              <p className="text-body mt-2">
                {isLogin ? "Sign in to continue your journey" : "Start discovering amazing date spots"}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5 animate-in-delay-1">
              <div className="space-y-2">
                <label className="text-caption">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="h-12 bg-card border-border focus:border-primary rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-caption">Password</label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="h-12 bg-card border-border focus:border-primary rounded-xl pr-12" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full h-12">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Please wait...
                  </span>
                ) : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="text-center animate-in-delay-2">
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-muted-foreground">
                {isLogin ? <>Don't have an account? <span className="text-primary font-medium">Sign up</span></> : <>Already have an account? <span className="text-primary font-medium">Sign in</span></>}
              </button>
            </div>
          </div>
        </div>

        <footer className="pt-8 pb-2 text-center animate-in-delay-3">
          <PoweredByTLC />
          <p className="text-xs text-muted-foreground mt-2">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </footer>
      </div>
    </div>
  );
}
