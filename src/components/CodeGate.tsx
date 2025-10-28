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

  useEffect(() => {
    const appUnlocked = sessionStorage.getItem("app_unlocked");
    const accessLevel = sessionStorage.getItem("access_level");
    if (appUnlocked === "true" && (accessLevel === "tester" || accessLevel === "admin")) {
      setUnlocked(true);
    } else {
      // Clear any invalid sessions
      sessionStorage.removeItem("app_unlocked");
      sessionStorage.removeItem("access_level");
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
        toast.error("⚠️ Admin access requires authentication - Please sign in first");
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
      <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden relative">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: `
                linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, .05) 25%, rgba(0, 255, 0, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .05) 75%, rgba(0, 255, 0, .05) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, .05) 25%, rgba(0, 255, 0, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .05) 75%, rgba(0, 255, 0, .05) 76%, transparent 77%, transparent)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/10 to-transparent animate-scan" />
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 w-full max-w-6xl px-6 mx-auto flex items-center justify-center min-h-screen">
          {!selectedMode ? (
            <div className="w-full space-y-12 animate-fade-in">
              {/* Epic Header */}
              <div className="text-center space-y-6 border-4 border-green-500 p-12 bg-black/80 backdrop-blur-xl shadow-[0_0_80px_rgba(34,197,94,0.4)]">
                <Shield className="w-40 h-40 mx-auto text-green-500 animate-pulse drop-shadow-[0_0_40px_rgba(34,197,94,0.8)]" />
                <h1 className="text-9xl font-black text-green-500 tracking-widest animate-pulse-glow" style={{ textShadow: '0 0 30px rgba(34,197,94,0.8)' }}>
                  INPERSON.TLC
                </h1>
                <div className="text-2xl text-green-400 tracking-wider font-bold animate-pulse">
                  COMMAND CENTER
                </div>
              </div>

              {/* Mode Selection - Large Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* BETA TESTERS */}
                <button
                  onClick={() => setSelectedMode("warlord")}
                  className="group relative p-16 bg-black/80 backdrop-blur-xl border-8 border-yellow-500/70 rounded-3xl hover:border-yellow-400 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_100px_rgba(234,179,8,0.6)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Swords className="w-32 h-32 mx-auto mb-8 text-yellow-500 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_30px_rgba(234,179,8,0.8)]" />
                  <h2 className="text-8xl font-black text-yellow-500 tracking-wider mb-4" style={{ textShadow: '0 0 20px rgba(234,179,8,0.6)' }}>BETA</h2>
                  <h3 className="text-6xl font-black text-yellow-400 tracking-wider" style={{ textShadow: '0 0 15px rgba(234,179,8,0.4)' }}>TESTERS</h3>
                </button>

                {/* ADMIN TLC */}
                <button
                  onClick={() => setSelectedMode("admin")}
                  className="group relative p-16 bg-black/80 backdrop-blur-xl border-8 border-red-500/70 rounded-3xl hover:border-red-400 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_100px_rgba(239,68,68,0.6)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Terminal className="w-32 h-32 mx-auto mb-8 text-red-500 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]" />
                  <h2 className="text-8xl font-black text-red-500 tracking-wider mb-4" style={{ textShadow: '0 0 20px rgba(239,68,68,0.6)' }}>ADMIN</h2>
                  <h3 className="text-6xl font-black text-red-400 tracking-wider" style={{ textShadow: '0 0 15px rgba(239,68,68,0.4)' }}>TLC</h3>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-3xl space-y-8 animate-fade-in">
              {/* Code Input Section */}
              <div className="border-4 border-green-500 p-12 bg-black/90 backdrop-blur-xl shadow-[0_0_80px_rgba(34,197,94,0.4)]">
                <div className={`w-40 h-40 mx-auto rounded-full ${selectedMode === "warlord" ? "bg-yellow-500/30 border-yellow-500" : "bg-red-500/30 border-red-500"} backdrop-blur-xl flex items-center justify-center border-8 shadow-[0_0_60px_rgba(234,179,8,0.5)] mb-8`}>
                  {selectedMode === "warlord" ? (
                    <Swords className="w-24 h-24 text-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.8)]" />
                  ) : (
                    <Terminal className="w-24 h-24 text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
                  )}
                </div>
                
                <h2 className={`text-9xl font-black tracking-wider text-center mb-12 ${selectedMode === "warlord" ? "text-yellow-500" : "text-red-500"}`} style={{ textShadow: '0 0 30px rgba(234,179,8,0.6)' }}>
                  {selectedMode === "warlord" ? "BETA" : "ADMIN"}
                </h2>

                {/* Input */}
                <div className="relative mb-8">
                  <Input
                    type="password"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                    placeholder="_ _ _ _"
                    className={`text-center text-8xl font-black tracking-[0.8em] bg-black/70 backdrop-blur-xl ${selectedMode === "warlord" ? "border-yellow-500 text-yellow-500 focus:border-yellow-400" : "border-red-500 text-red-500 focus:border-red-400"} border-8 h-40 rounded-3xl focus:shadow-[0_0_80px_rgba(234,179,8,0.4)] transition-all duration-300`}
                    autoFocus
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-8">
                  <Button
                    onClick={() => {
                      setSelectedMode(null);
                      setCode("");
                    }}
                    variant="outline"
                    className="flex-1 h-24 text-3xl border-8 border-gray-700 text-gray-400 hover:bg-gray-900/70 hover:text-gray-300 hover:border-gray-600 font-black tracking-wider transition-all duration-300 bg-black/70"
                  >
                    BACK
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className={`flex-1 h-24 text-3xl font-black tracking-wider ${selectedMode === "warlord" ? "bg-yellow-500 hover:bg-yellow-600 border-yellow-600 text-black" : "bg-red-500 hover:bg-red-600 border-red-600 text-black"} border-8 shadow-[0_0_40px_rgba(234,179,8,0.4)] hover:shadow-[0_0_80px_rgba(234,179,8,0.6)] transition-all duration-300`}
                  >
                    ACCESS
                  </Button>
                </div>
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
