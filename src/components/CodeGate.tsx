import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Skull } from "lucide-react";
import { toast } from "sonner";

interface CodeGateProps {
  children: React.ReactNode;
}

export const CodeGate = ({ children }: CodeGateProps) => {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already unlocked
    const isUnlocked = sessionStorage.getItem("app_unlocked");
    if (isUnlocked === "true") {
      setUnlocked(true);
    }
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedCode = code.trim().toLowerCase();

    // Warlord Admin Code
    if (normalizedCode === "1309") {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .eq("role", "admin")
            .single();

          if (roleData) {
            sessionStorage.setItem("app_unlocked", "true");
            sessionStorage.setItem("access_level", "admin");
            setUnlocked(true);
            toast.success("🎖️ WARLORD ACCESS GRANTED - FULL COMMAND");
            navigate("/landing?access=admin");
            return;
          }
        }

        toast.error("⚠️ ADMIN CODE RECOGNIZED - Contact system administrator for role assignment");
        return;
      } catch (error) {
        console.error("Admin check error:", error);
        toast.error("⚠️ SECURITY CHECK FAILED");
        return;
      }
    }

    // Alpha Tester Code
    if (normalizedCode === "crip4lyfe") {
      sessionStorage.setItem("app_unlocked", "true");
      sessionStorage.setItem("access_level", "tester");
      setUnlocked(true);
      toast.success("✅ ALPHA TESTER ACCESS GRANTED");
      navigate("/landing?access=tester");
      return;
    }

    // Invalid code
    toast.error("🚫 INVALID CODE - ACCESS DENIED");
    setCode("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f0a]">
        <div className="text-center space-y-4">
          <Shield className="w-16 h-16 animate-pulse mx-auto text-[#ff6b00]" />
          <p className="text-[#00ff00] font-mono">INITIALIZING...</p>
        </div>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0a0f0a] via-[#111511] to-[#0d1b0d] relative overflow-hidden">
        {/* Tactical grid background */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(#00ff00 1px, transparent 1px),
              linear-gradient(90deg, #00ff00 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px"
          }}
        />

        {/* Animated radar sweep */}
        <div className="absolute top-10 right-10 w-32 h-32 border-2 border-[#ff6b00] rounded-full opacity-20 animate-ping" />
        <div className="absolute bottom-10 left-10 w-24 h-24 border-2 border-[#00ff00] opacity-20 animate-pulse" 
          style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} 
        />

        <Card className="w-full max-w-md bg-[#1a2e1a]/90 border-2 border-[#2d5a2d] shadow-2xl relative overflow-hidden backdrop-blur-sm">
          {/* CLASSIFIED stamp */}
          <div className="absolute top-4 right-4 transform rotate-12 opacity-20">
            <div className="border-4 border-[#cc0000] text-[#cc0000] font-bold px-4 py-2 text-2xl">
              CLASSIFIED
            </div>
          </div>

          {/* Hexagonal accent */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#ff6b00] via-[#cc0000] to-[#ff6b00]" />

          <div className="p-8 space-y-6 relative z-10">
            {/* Header with military badge */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <Shield className="w-20 h-20 text-[#00ff00] animate-pulse" />
                  <Lock className="w-8 h-8 text-[#ff6b00] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-[#00ff00] tracking-wider font-mono">
                  SECURITY CLEARANCE
                </h1>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px w-12 bg-[#ff6b00]" />
                  <Skull className="w-5 h-5 text-[#ff6b00]" />
                  <div className="h-px w-12 bg-[#ff6b00]" />
                </div>
                <p className="text-[#ffffff]/70 text-sm font-mono tracking-wide">
                  ENTER AUTHORIZED ACCESS CODE
                </p>
              </div>
            </div>

            {/* Code input form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs text-[#00ff00] font-mono tracking-widest block">
                  ⚠️ RESTRICTED ACCESS ⚠️
                </label>
                <Input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="••••"
                  className="bg-[#0d1b0d] border-2 border-[#2d5a2d] text-[#00ff00] text-center text-2xl tracking-[0.5em] font-mono uppercase focus:border-[#ff6b00] transition-colors h-16"
                  maxLength={4}
                  autoComplete="off"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#2d5a2d] to-[#1a3d1a] hover:from-[#ff6b00] hover:to-[#cc0000] text-[#00ff00] hover:text-white border-2 border-[#2d5a2d] hover:border-[#ff6b00] h-14 text-lg font-bold tracking-widest transition-all duration-300 transform hover:scale-105"
              >
                <Shield className="w-5 h-5 mr-2" />
                AUTHENTICATE
              </Button>
            </form>

            {/* Status bar */}
            <div className="pt-4 border-t border-[#2d5a2d]/50">
              <div className="flex items-center justify-between text-xs font-mono text-[#ffffff]/40">
                <span>SECURITY LEVEL: MAX</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#ff6b00] rounded-full animate-pulse" />
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Bottom tactical elements */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center space-y-1">
          <p className="text-[#00ff00]/40 text-xs font-mono tracking-wider">
            FELICIA.TLC SECURE ACCESS
          </p>
          <p className="text-[#ffffff]/20 text-[10px] font-mono">
            UNAUTHORIZED ACCESS PROHIBITED
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
