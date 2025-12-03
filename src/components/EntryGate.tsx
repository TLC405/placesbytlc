import { useState, useEffect } from 'react';
import { validateEntryCode, hasEntryAccess } from '@/lib/pinAuth';
import { Input } from '@/components/ui/input';
import { Heart, Lock } from 'lucide-react';
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
    
    // PLATINUM developer mode code (1309)
    if (trimmedCode === "1309") {
      sessionStorage.setItem('tlc_dev_mode', 'true');
      sessionStorage.setItem('tlc_entry_session', 'true');
      localStorage.setItem('tlc_platinum_activated', Date.now().toString());
      setHasAccess(true);
      
      toast.success("Platinum Mode Activated", {
        description: "Welcome to the premium experience",
        duration: 5000,
      });
      return;
    }

    const isValid = validateEntryCode(trimmedCode);
    
    if (isValid) {
      setHasAccess(true);
      toast.success("Welcome!", {
        description: "Access granted",
      });
    } else {
      setShake(true);
      setCode('');
      setTimeout(() => setShake(false), 500);
      toast.error("Invalid code");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className={`w-full max-w-sm space-y-8 ${shake ? 'animate-shake' : ''}`}>
        {/* Logo */}
        <div className="text-center space-y-4 animate-in">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-display text-foreground">Places by TLC</h1>
            <p className="text-body mt-1">Enter your access code to continue</p>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 animate-in-delay-1">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Access code"
              className="h-14 pl-12 text-center text-lg font-medium tracking-widest uppercase bg-card border-border focus:border-primary rounded-xl"
              autoFocus
              maxLength={20}
            />
          </div>
          
          <button type="submit" className="btn-primary w-full h-12">
            Continue
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground animate-in-delay-2">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};
