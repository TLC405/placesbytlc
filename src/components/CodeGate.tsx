import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Terminal, Swords } from "lucide-react";

interface CodeGateProps {
  children: React.ReactNode;
}

export const CodeGate = ({ children }: CodeGateProps) => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState<"warlord" | "admin" | null>(null);
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    const appUnlocked = sessionStorage.getItem("app_unlocked");
    if (appUnlocked === "true") {
      setUnlocked(true);
    }
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedCode = code.trim().toUpperCase();

    // Warlord/Tester code
    if (normalizedCode === "CRIP4LYFE" || normalizedCode === "CRIP") {
      sessionStorage.setItem("app_unlocked", "true");
      sessionStorage.setItem("access_level", "tester");
      setUnlocked(true);
      toast.success("🎮 WARLORD ACCESS GRANTED");
      navigate("/hacker");
      return;
    }

    // Admin code
    if (normalizedCode === "1309") {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("⚠️ Admin requires authentication");
        return;
      }

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const isAdmin = roles?.some(r => r.role === 'admin');

      if (!isAdmin) {
        toast.error("❌ Admin privileges required");
        return;
      }

      sessionStorage.setItem("app_unlocked", "true");
      sessionStorage.setItem("access_level", "admin");
      setUnlocked(true);
      toast.success("👑 ADMIN ACCESS GRANTED");
      navigate("/hacker");
      return;
    }

    toast.error("❌ INVALID CODE");
    setCode("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden relative flex items-center justify-center">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(34, 197, 94, .08) 25%, rgba(34, 197, 94, .08) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .08) 75%, rgba(34, 197, 94, .08) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(34, 197, 94, .08) 25%, rgba(34, 197, 94, .08) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .08) 75%, rgba(34, 197, 94, .08) 76%, transparent 77%, transparent)`,
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        {/* Scanning lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/10 to-transparent animate-scan" />
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 w-full max-w-6xl px-6">
          {!selectedMode ? (
            <div className="space-y-12 animate-fade-in">
              {/* Minimal Header */}
              <div className="text-center space-y-4">
                <Shield className="w-32 h-32 mx-auto text-green-500 animate-pulse drop-shadow-[0_0_30px_rgba(34,197,94,0.6)]" />
                <h1 className="text-8xl font-black text-green-500 tracking-widest animate-pulse-glow">
                  ACCESS
                </h1>
              </div>

              {/* Mode Selection - Minimal Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <button
                  onClick={() => setSelectedMode("warlord")}
                  className="group relative p-12 bg-black/60 backdrop-blur-xl border-4 border-yellow-500/50 rounded-2xl hover:border-yellow-500 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_60px_rgba(234,179,8,0.4)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Swords className="w-24 h-24 mx-auto mb-6 text-yellow-500 group-hover:scale-110 transition-transform duration-500" />
                  <h2 className="text-6xl font-black text-yellow-500 tracking-wider">WARLORD</h2>
                </button>

                <button
                  onClick={() => setSelectedMode("admin")}
                  className="group relative p-12 bg-black/60 backdrop-blur-xl border-4 border-red-500/50 rounded-2xl hover:border-red-500 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_60px_rgba(239,68,68,0.4)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Terminal className="w-24 h-24 mx-auto mb-6 text-red-500 group-hover:scale-110 transition-transform duration-500" />
                  <h2 className="text-6xl font-black text-red-500 tracking-wider">ADMIN</h2>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
              {/* Code Input Section - Minimal */}
              <div className="text-center space-y-6">
                <div className={`w-32 h-32 mx-auto rounded-full ${selectedMode === "warlord" ? "bg-yellow-500/20" : "bg-red-500/20"} backdrop-blur-xl flex items-center justify-center border-4 ${selectedMode === "warlord" ? "border-yellow-500" : "border-red-500"} shadow-[0_0_60px_rgba(234,179,8,0.4)]`}>
                  {selectedMode === "warlord" ? (
                    <Swords className="w-20 h-20 text-yellow-500" />
                  ) : (
                    <Terminal className="w-20 h-20 text-red-500" />
                  )}
                </div>
                
                <h2 className={`text-7xl font-black tracking-wider ${selectedMode === "warlord" ? "text-yellow-500" : "text-red-500"}`}>
                  {selectedMode === "warlord" ? "WARLORD" : "ADMIN"}
                </h2>
              </div>

              {/* Input */}
              <div className="relative">
                <Input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  placeholder="_ _ _ _"
                  className={`text-center text-6xl font-black tracking-[0.5em] bg-black/50 backdrop-blur-xl ${selectedMode === "warlord" ? "border-yellow-500 text-yellow-500 focus:border-yellow-400" : "border-red-500 text-red-500 focus:border-red-400"} border-4 h-32 rounded-2xl focus:shadow-[0_0_60px_rgba(234,179,8,0.3)] transition-all duration-300`}
                  autoFocus
                />
                {inputFocused && (
                  <div className="absolute -bottom-8 left-0 right-0 text-center text-sm text-gray-500 animate-pulse">
                    ENTER CODE
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-6">
                <Button
                  onClick={() => {
                    setSelectedMode(null);
                    setCode("");
                  }}
                  variant="outline"
                  className="flex-1 h-20 text-2xl border-4 border-gray-700 text-gray-400 hover:bg-gray-900/50 hover:text-gray-300 hover:border-gray-600 font-black tracking-wider transition-all duration-300"
                >
                  BACK
                </Button>
                <Button
                  onClick={handleSubmit}
                  className={`flex-1 h-20 text-2xl font-black tracking-wider ${selectedMode === "warlord" ? "bg-yellow-500 hover:bg-yellow-600 border-yellow-600" : "bg-red-500 hover:bg-red-600 border-red-600"} text-black border-4 shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:shadow-[0_0_60px_rgba(234,179,8,0.5)] transition-all duration-300`}
                >
                  ACCESS
                </Button>
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          .animate-scan {
            animation: scan 6s linear infinite;
          }
          @keyframes pulse-glow {
            0%, 100% { text-shadow: 0 0 20px #22c55e, 0 0 40px #22c55e; }
            50% { text-shadow: 0 0 30px #22c55e, 0 0 60px #22c55e, 0 0 80px #22c55e; }
          }
          .animate-pulse-glow {
            animation: pulse-glow 3s ease-in-out infinite;
          }
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
};
