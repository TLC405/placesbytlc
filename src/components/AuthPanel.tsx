import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Heart, Mail, Lock, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const AuthPanel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            display_name: displayName,
          }
        }
      });
      if (error) throw error;
      toast.success("Welcome to Places by TLC! 💕");
      navigate("/explore");
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="relative overflow-hidden border-2 border-primary/20 shadow-2xl backdrop-blur-md bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-rose-500/5" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />
      
      <CardHeader className="relative z-10 text-center space-y-4 pb-6">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-rose-600 flex items-center justify-center shadow-2xl shadow-primary/30 ring-4 ring-primary/20 backdrop-blur">
          <Heart className="w-10 h-10 text-white animate-pulse drop-shadow-lg" />
        </div>
        <div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text text-transparent mb-2">
            Join Places by TLC
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground/80">
            Create your account to start discovering the best date spots in OKC
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 px-6 pb-6">
        <form onSubmit={handleAuth} className="space-y-5">
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
              required
              className="border-primary/20 focus:border-primary/50 transition-all h-11"
            />
          </div>

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
            <p className="text-xs text-muted-foreground">
              Minimum 6 characters
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full gap-2 shadow-xl h-11 bg-gradient-to-r from-pink-500 via-purple-500 to-rose-600 hover:from-pink-600 hover:via-purple-600 hover:to-rose-700 text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </div>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Your Account
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Secure authentication powered by Lovable Cloud
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
