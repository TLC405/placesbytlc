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
      <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden relative">
        {/* Matrix-style background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, .05) 25%, rgba(0, 255, 0, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .05) 75%, rgba(0, 255, 0, .05) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, .05) 25%, rgba(0, 255, 0, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .05) 75%, rgba(0, 255, 0, .05) 76%, transparent 77%, transparent)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-scan" />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Shield className="w-24 h-24 text-green-500 animate-pulse" />
              </div>
              <h1 className="text-6xl font-bold text-green-500 tracking-wider animate-pulse-border">
                COMMAND CENTER
              </h1>
              <div className="h-1 w-32 bg-green-500 mx-auto animate-pulse" />
            </div>

            {/* Mode Selection or Code Input */}
            {!selectedMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                  className="p-8 bg-black/80 border-2 border-green-500 hover:border-yellow-500 cursor-pointer transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                  onClick={() => setSelectedMode("warlord")}
                >
                  <div className="text-center space-y-4">
                    <Swords className="w-16 h-16 mx-auto text-yellow-500" />
                    <h2 className="text-3xl font-bold text-yellow-500">WARLORD</h2>
                    <p className="text-sm text-green-400">TESTING ACCESS</p>
                  </div>
                </Card>

                <Card
                  className="p-8 bg-black/80 border-2 border-red-500 hover:border-orange-500 cursor-pointer transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                  onClick={() => setSelectedMode("admin")}
                >
                  <div className="text-center space-y-4">
                    <Terminal className="w-16 h-16 mx-auto text-red-500" />
                    <h2 className="text-3xl font-bold text-red-500">ADMIN</h2>
                    <p className="text-sm text-green-400">FULL CONTROL</p>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-8 bg-black/80 border-2 border-green-500">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-green-500">
                      {selectedMode === "warlord" ? "WARLORD CODE" : "ADMIN CODE"}
                    </h2>
                    <div className="h-0.5 w-24 bg-green-500 mx-auto" />
                  </div>

                  <Input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="ENTER CODE"
                    className="text-center text-4xl font-bold tracking-widest bg-black/50 border-green-500 text-green-400 focus:border-green-400 h-20"
                    autoFocus
                  />

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={() => {
                        setSelectedMode(null);
                        setCode("");
                      }}
                      variant="outline"
                      className="flex-1 h-14 text-lg border-red-500 text-red-500 hover:bg-red-500/10"
                    >
                      BACK
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-14 text-lg bg-green-500 hover:bg-green-600 text-black font-bold"
                    >
                      AUTHENTICATE
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* System Info */}
            <div className="text-center text-xs text-green-600 space-y-1">
              <div>SYSTEM STATUS: ACTIVE</div>
              <div>ENCRYPTION: AES-256</div>
              <div className="flex items-center justify-center gap-2">
                <span>SESSION:</span>
                <span className="text-green-400">{Math.random().toString(16).substr(2, 8).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          .animate-scan {
            animation: scan 4s linear infinite;
          }
          @keyframes pulse-border {
            0%, 100% { text-shadow: 0 0 10px #22c55e; }
            50% { text-shadow: 0 0 20px #22c55e, 0 0 30px #22c55e; }
          }
          .animate-pulse-border {
            animation: pulse-border 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
};
