import { useState, useEffect } from 'react';
import { validateEntryCode, hasEntryAccess } from '@/lib/pinAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface EntryGateProps {
  children: React.ReactNode;
}

export const EntryGate: React.FC<EntryGateProps> = ({ children }) => {
  const [code, setCode] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if already has access
    const access = hasEntryAccess();
    setHasAccess(access);
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast.error("Enter the access code");
      return;
    }

    const trimmedCode = code.trim().toLowerCase();
    
    // Check for PLATINUM developer mode code (1309)
    if (trimmedCode === "1309") {
      sessionStorage.setItem('tlc_dev_mode', 'true');
      sessionStorage.setItem('tlc_entry_session', 'true');
      localStorage.setItem('tlc_platinum_activated', Date.now().toString());
      setHasAccess(true);
      
      // Epic platinum mode activation
      toast.success("💎 PLATINUM MODE ACTIVATED! 💎", {
        description: "🚀 Super Developer Edition • 4 Premium Themes • Double Options • Admin Powers • Sky Is The Limit!",
        duration: 8000,
      });
      
      // Second toast for extra emphasis
      setTimeout(() => {
        toast.info("🎮 Welcome to the Matrix! 🎮", {
          description: "Check header for theme selector • Enhanced OKC Legend • Admin panel unlocked",
          duration: 6000,
        });
      }, 2000);
      
      return;
    }

    const isValid = validateEntryCode(trimmedCode);
    
    if (isValid) {
      setHasAccess(true);
      toast.success("🎉 Access granted!");
    } else {
      setShake(true);
      setCode('');
      setTimeout(() => setShake(false), 500);
      toast.error("❌ Invalid access code");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
      
      <Card className={`w-full max-w-md relative z-10 border-2 border-primary/30 shadow-2xl bg-card/95 backdrop-blur-xl ${shake ? 'animate-shake' : ''}`}>
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-variant flex items-center justify-center shadow-glow animate-pulse">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-black gradient-text">
            🔒 SECURE ACCESS
          </CardTitle>
          <CardDescription className="text-base">
            Enter the access code to continue
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter access code"
                  className="pl-10 h-12 text-center text-lg font-bold tracking-wider uppercase border-2 border-primary/20 focus:border-primary"
                  autoFocus
                  maxLength={20}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-bold gradient-primary shadow-glow hover:scale-105 transition-all"
            >
              UNLOCK ACCESS
            </Button>
          </form>
        </CardContent>
      </Card>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};
