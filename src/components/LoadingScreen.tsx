import { useEffect, useState } from 'react';
import { Shield, Target, Lock, Users, Crown, GamepadIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface LoadingScreenProps {
  onComplete: () => void;
  onAuthenticated?: (role: 'tester' | 'admin') => void;
}

export const LoadingScreen = ({ onComplete, onAuthenticated }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showText, setShowText] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showModeSelect, setShowModeSelect] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [selectedMode, setSelectedMode] = useState<'tester' | 'admin' | 'couple' | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('pin_role');
    const expiry = parseInt(localStorage.getItem('pin_expiry') || '0');
    
    if (role && Date.now() < expiry) {
      startLoadingSequence();
    } else {
      const modeTimer = setTimeout(() => {
        setShowModeSelect(true);
      }, 2000);
      return () => clearTimeout(modeTimer);
    }
  }, []);

  const startLoadingSequence = () => {
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 50);

    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 500);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 600);
    }, 4500);
  };

  const handleModeSelect = (mode: 'tester' | 'admin' | 'couple') => {
    setSelectedMode(mode);
    
    if (mode === 'couple') {
      localStorage.setItem('pin_role', 'couple');
      localStorage.setItem('pin_expiry', String(Date.now() + 900000));
      toast.success('Couple Mode activated!');
      startLoadingSequence();
    } else {
      setShowModeSelect(false);
      setShowPinInput(true);
    }
  };

  const handlePinSubmit = async () => {
    const normalizedCode = pinCode.trim().toUpperCase();
    setIsUnlocking(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    if (normalizedCode === 'CRIP4LYFE' || normalizedCode === 'CRIP') {
      localStorage.setItem('pin_role', 'tester');
      localStorage.setItem('pin_expiry', String(Date.now() + 900000));
      toast.success('TESTER ACCESS GRANTED');
      if (onAuthenticated) onAuthenticated('tester');
      startLoadingSequence();
      return;
    }

    if (normalizedCode === '1309') {
      localStorage.setItem('pin_role', 'admin');
      localStorage.setItem('pin_expiry', String(Date.now() + 900000));
      toast.success('ADMIN ACCESS GRANTED');
      if (onAuthenticated) onAuthenticated('admin');
      startLoadingSequence();
      return;
    }

    toast.error('INVALID CODE - ACCESS DENIED');
    setPinCode('');
    setIsUnlocking(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(30deg, #4A5D23 12%, transparent 12.5%, transparent 87%, #4A5D23 87.5%, #4A5D23),
              linear-gradient(150deg, #4A5D23 12%, transparent 12.5%, transparent 87%, #4A5D23 87.5%, #4A5D23)
            `,
            backgroundSize: '80px 140px',
            backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px',
          }}
        />
      </div>

      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#FF6B35]/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#00D9FF]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center px-8 max-w-6xl">
        <div className="mb-12 space-y-8">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#6B8E23] to-transparent" />
            <Shield className="w-12 h-12 text-[#FF6B35] animate-pulse" />
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#6B8E23] to-transparent" />
          </div>

          <div className="text-[#00D9FF] text-sm md:text-base font-mono tracking-[0.3em] uppercase mb-4">
            [OPERATION: LOVEBIRD]
          </div>

          <h1 
            className="text-6xl md:text-8xl font-black tracking-wider mb-6"
            style={{
              color: '#C8D5B9',
              textShadow: `
                0 0 10px rgba(107, 142, 35, 0.8),
                2px 2px 0 #4A5D23,
                -2px -2px 0 #4A5D23
              `,
              fontFamily: 'Impact, "Arial Black", sans-serif',
            }}
          >
            DAMN YOU LOOK GOOD
          </h1>

          <div className="flex items-center justify-center gap-8 my-8">
            <Target className="w-10 h-10 text-[#6B8E23] animate-spin" style={{ animationDuration: '8s' }} />
          </div>

          {showText && !showModeSelect && !showPinInput && (
            <div className="space-y-6 animate-fade-in">
              <p 
                className="text-xl md:text-3xl font-bold tracking-wide"
                style={{
                  color: '#00D9FF',
                  textShadow: '0 0 20px rgba(0, 217, 255, 0.8)',
                  fontFamily: '"Courier New", monospace',
                }}
              >
                PREPARING DATE NIGHT OPERATIONS
              </p>

              <div className="max-w-2xl mx-auto mt-8">
                <div className="flex justify-between text-[#6B8E23] text-sm font-mono mb-2">
                  <span>[LOADING]</span>
                  <span>{Math.round(loadingProgress)}%</span>
                </div>
                <div className="h-3 bg-black/50 border-2 border-[#4A5D23] relative overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#6B8E23] via-[#FF6B35] to-[#6B8E23] transition-all duration-300"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
              </div>

              <div className="text-[#C8D5B9] font-mono text-sm">
                {loadingProgress < 30 && "INITIALIZING..."}
                {loadingProgress >= 30 && loadingProgress < 60 && "LOADING DATA..."}
                {loadingProgress >= 60 && loadingProgress < 90 && "DEPLOYING..."}
                {loadingProgress >= 90 && "READY..."}
              </div>
            </div>
          )}

          {showModeSelect && (
            <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
              <h2 
                className="text-4xl font-black text-center mb-8"
                style={{
                  color: '#00D9FF',
                  textShadow: '0 0 20px rgba(0, 217, 255, 0.8)',
                }}
              >
                SELECT MODE
              </h2>

              <div className="grid gap-4">
                <Button
                  onClick={() => handleModeSelect('tester')}
                  className="h-32 text-2xl font-black bg-gradient-to-r from-[#6B8E23] to-[#FF6B35] hover:opacity-90 border-4 border-[#00D9FF]"
                >
                  <GamepadIcon className="mr-4 w-12 h-12" />
                  TESTER MODE
                </Button>

                <Button
                  onClick={() => handleModeSelect('admin')}
                  className="h-32 text-2xl font-black bg-gradient-to-r from-[#FF6B35] to-[#6B8E23] hover:opacity-90 border-4 border-[#00D9FF]"
                >
                  <Crown className="mr-4 w-12 h-12" />
                  ADMIN MODE
                </Button>

                <Button
                  onClick={() => handleModeSelect('couple')}
                  className="h-32 text-2xl font-black bg-gradient-to-r from-[#00D9FF] to-[#6B8E23] hover:opacity-90 border-4 border-[#FF6B35]"
                >
                  <Users className="mr-4 w-12 h-12" />
                  COUPLE MODE
                </Button>
              </div>
            </div>
          )}

          {showPinInput && (
            <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
              <div 
                className="border-4 border-[#FF6B35] bg-black/90 p-12 relative"
              >
                <Lock className="w-20 h-20 mx-auto mb-6 text-[#FF6B35] animate-pulse" />

                <h2 
                  className="text-5xl font-black text-center mb-2"
                  style={{
                    color: '#00D9FF',
                    textShadow: '0 0 20px rgba(0, 217, 255, 0.8)',
                  }}
                >
                  {selectedMode === 'tester' ? 'TESTER' : 'ADMIN'} PIN
                </h2>

                <p className="text-[#6B8E23] text-center font-mono mb-8 text-sm">
                  [ENTER SECURITY CODE]
                </p>

                <div className="space-y-6">
                  <Input
                    type="password"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && !isUnlocking && handlePinSubmit()}
                    placeholder="_ _ _ _"
                    disabled={isUnlocking}
                    className="text-center text-6xl font-black tracking-[0.8em] bg-black/70 border-[#6B8E23] text-[#00D9FF] border-4 h-32 rounded-xl"
                    autoFocus
                  />

                  <Button
                    onClick={handlePinSubmit}
                    disabled={isUnlocking || !pinCode}
                    className="w-full h-20 text-3xl font-black bg-gradient-to-r from-[#FF6B35] to-[#6B8E23] border-4 border-[#00D9FF]"
                  >
                    {isUnlocking ? 'AUTHORIZING...' : 'INITIATE ACCESS'}
                  </Button>

                  <Button
                    onClick={() => {
                      setShowPinInput(false);
                      setShowModeSelect(true);
                      setPinCode('');
                    }}
                    variant="outline"
                    className="w-full border-[#4A5D23] text-[#6B8E23]"
                  >
                    BACK
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
