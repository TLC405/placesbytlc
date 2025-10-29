import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Terminal, Mail, Lock, LogIn, User, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Preset test users
const TEST_USERS = [
  { id: "alp", email: "alp@test.com", name: "Alpha Tester", icon: "🔵" },
  { id: "btea", email: "btea@test.com", name: "Beta Tester", icon: "🟢" },
  { id: "tester", email: "tester@test.com", name: "QA Tester", icon: "🟡" },
];

export const AuthPanel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: selectedUser ? TEST_USERS.find(u => u.id === selectedUser)?.email || email : email,
        password,
      });
      if (error) throw error;
      toast.success("🚀 ACCESS GRANTED!", {
        description: "Welcome to the system",
      });
      navigate("/");
    } catch (error: any) {
      toast.error("❌ ACCESS DENIED", {
        description: error.message || "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (userId: string) => {
    setSelectedUser(userId);
    const user = TEST_USERS.find(u => u.id === userId);
    if (user) {
      setEmail(user.email);
      toast.info(`Selected: ${user.name}`, {
        description: "Enter password to continue",
      });
    }
  };

  return (
    <Card className="relative overflow-hidden border-2 border-green-500/30 shadow-2xl backdrop-blur-xl bg-black/90 animate-fade-in">
      {/* Scanline overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(34,197,94,0.03)_50%)] bg-[length:100%_4px] pointer-events-none" />
      
      <CardHeader className="relative z-10 text-center space-y-4 pb-6">
        <div className="mx-auto w-20 h-20 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/50 border border-green-400/30">
          <Terminal className="w-10 h-10 text-black animate-pulse" />
        </div>
        
        <div>
          <CardTitle className="text-3xl font-black text-green-400 mb-2 tracking-wider font-mono">
            [AUTHENTICATION_REQUIRED]
          </CardTitle>
          <CardDescription className="text-base text-green-500/70 font-mono">
            Enter credentials to access system
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 px-6 pb-6">
        {/* Quick User Selection */}
        <div className="mb-6 space-y-3">
          <Label className="flex items-center gap-2 text-sm font-mono text-green-400">
            <User className="w-4 h-4" />
            [QUICK_SELECT_USER]
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {TEST_USERS.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleQuickLogin(user.id)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  selectedUser === user.id
                    ? "border-green-500 bg-green-500/20 text-green-300"
                    : "border-green-500/30 bg-black/40 text-green-500/70 hover:border-green-500/50"
                }`}
              >
                <div className="text-2xl mb-1">{user.icon}</div>
                <div className="text-xs font-mono font-bold">{user.id.toUpperCase()}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-mono text-green-400">
              <Mail className="w-4 h-4" />
              [EMAIL]
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="user@system.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-green-500/30 bg-black/60 text-green-400 placeholder:text-green-600/50 focus:border-green-500 font-mono h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2 text-sm font-mono text-green-400">
              <Lock className="w-4 h-4" />
              [PASSWORD]
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="border-green-500/30 bg-black/60 text-green-400 placeholder:text-green-600/50 focus:border-green-500 font-mono h-11"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full gap-2 shadow-2xl h-12 text-base bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-black font-black transition-all hover:scale-105 font-mono tracking-wider border border-green-400/50" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                AUTHENTICATING...
              </div>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                [GRANT_ACCESS]
              </>
            )}
          </Button>

          <div className="pt-3 border-t border-green-500/20">
            <p className="text-xs text-center text-green-500/50 font-mono">
              <Shield className="w-3 h-3 inline mr-1" />
              ENCRYPTED CONNECTION • PIN: 1309 REQUIRED
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

