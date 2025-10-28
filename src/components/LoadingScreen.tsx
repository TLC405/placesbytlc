import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Crosshair, Target, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [showText, setShowText] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [selectedMode, setSelectedMode] = useState<'tester' | 'admin' | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const role = localStorage.getItem('pin_role');
    const expiry = parseInt(localStorage.getItem('pin_expiry') || '0');
    
    if (role && Date.now() < expiry) {
      // Already logged in, proceed with loading
      startLoadingSequence();
    } else {
      // Show PIN input after initial animation
      const pinTimer = setTimeout(() => {
        setShowPinInput(true);
      }, 2000);
      return () => clearTimeout(pinTimer);
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

  const handlePinSubmit = async () => {
    const normalizedCode = pinCode.trim().toUpperCase();
    setIsUnlocking(true);

    // Simulate unlock animation
    await new Promise(resolve => setTimeout(resolve, 800));

    // Tester code
    if (normalizedCode === 'CRIP4LYFE' || normalizedCode === 'CRIP') {
      localStorage.setItem('pin_role', 'tester');
      localStorage.setItem('pin_expiry', String(Date.now() + 900000));
      toast.success('🎮 TESTER ACCESS GRANTED');
      navigate('/hacker');
      return;
    }

    // Admin code
    if (normalizedCode === '1309') {
      localStorage.setItem('pin_role', 'admin');
      localStorage.setItem('pin_expiry', String(Date.now() + 900000));
      toast.success('👑 ADMIN ACCESS GRANTED');
      navigate('/hacker');
      return;
    }

    toast.error('❌ INVALID CODE - ACCESS DENIED');
    setPinCode('');
    setIsUnlocking(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black">
      {/* COD-style hexagon grid background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(30deg, #4A5D23 12%, transparent 12.5%, transparent 87%, #4A5D23 87.5%, #4A5D23),
              linear-gradient(150deg, #4A5D23 12%, transparent 12.5%, transparent 87%, #4A5D23 87.5%, #4A5D23),
              linear-gradient(30deg, #4A5D23 12%, transparent 12.5%, transparent 87%, #4A5D23 87.5%, #4A5D23),
              linear-gradient(150deg, #4A5D23 12%, transparent 12.5%, transparent 87%, #4A5D23 87.5%, #4A5D23)
            `,
            backgroundSize: '80px 140px',
            backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px',
          }}
        />
      </div>

      {/* Animated scanline effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6B8E23]/20 to-transparent animate-scan" />
      </div>

      {/* Radial spotlight effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#FF6B35]/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#00D9FF]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Tactical grid lines */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(107, 142, 35, 0.5) 25%, rgba(107, 142, 35, 0.5) 26%, transparent 27%, transparent 74%, rgba(107, 142, 35, 0.5) 75%, rgba(107, 142, 35, 0.5) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(107, 142, 35, 0.5) 25%, rgba(107, 142, 35, 0.5) 26%, transparent 27%, transparent 74%, rgba(107, 142, 35, 0.5) 75%, rgba(107, 142, 35, 0.5) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '80px 80px',
        }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-8 max-w-6xl">
        {/* COD-style header with tactical elements */}
        <div className="mb-12 space-y-8">
          {/* Top tactical bar */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#6B8E23] to-transparent" />
            <Shield className="w-12 h-12 text-[#FF6B35] drop-shadow-[0_0_20px_rgba(255,107,53,0.8)] animate-pulse" />
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#6B8E23] to-transparent" />
          </div>

          {/* Mission label */}
          <div className="text-[#00D9FF] text-sm md:text-base font-mono tracking-[0.3em] uppercase mb-4 drop-shadow-[0_0_10px_rgba(0,217,255,0.8)]">
            [OPERATION: LOVEBIRD]
          </div>

          {/* Main heading - COD style */}
          <h1 
            className="text-6xl md:text-8xl font-black tracking-wider mb-6"
            style={{
              color: '#C8D5B9',
              textShadow: `
                0 0 10px rgba(107, 142, 35, 0.8),
                0 0 20px rgba(107, 142, 35, 0.6),
                0 0 30px rgba(107, 142, 35, 0.4),
                2px 2px 0 #4A5D23,
                -2px -2px 0 #4A5D23
              `,
              fontFamily: 'Impact, "Arial Black", sans-serif',
              letterSpacing: '0.1em',
            }}
          >
            DAMN YOU LOOK GOOD
          </h1>

          {/* Crosshair decoration */}
          <div className="flex items-center justify-center gap-8 my-8">
            <Crosshair className="w-8 h-8 text-[#FF6B35] animate-pulse" />
            <Target className="w-10 h-10 text-[#6B8E23] animate-spin" style={{ animationDuration: '8s' }} />
            <Crosshair className="w-8 h-8 text-[#FF6B35] animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          {/* PIN Input or Progress */}
          {showText && !showPinInput && (
            <div className="space-y-6 animate-fade-in">
              <p 
                className="text-xl md:text-3xl font-bold tracking-wide"
                style={{
                  color: '#00D9FF',
                  textShadow: '0 0 20px rgba(0, 217, 255, 0.8)',
                  fontFamily: '"Courier New", monospace',
                }}
              >
                PREPARING TO INFILTRATE... DATE NIGHT OPERATIONS
              </p>

              {/* Progress bar - COD style */}
              <div className="max-w-2xl mx-auto mt-8">
                <div className="flex justify-between text-[#6B8E23] text-sm font-mono mb-2">
                  <span>[LOADING ASSETS]</span>
                  <span>{Math.round(loadingProgress)}%</span>
                </div>
                <div className="h-3 bg-black/50 border-2 border-[#4A5D23] relative overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#6B8E23] via-[#FF6B35] to-[#6B8E23] transition-all duration-300"
                    style={{ 
                      width: `${loadingProgress}%`,
                      boxShadow: '0 0 20px rgba(107, 142, 35, 0.8)',
                    }}
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    style={{ animation: 'scan-horizontal 2s linear infinite' }}
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="text-[#C8D5B9] font-mono text-sm">
                  {loadingProgress < 30 && "⚡ INITIALIZING COMBAT SYSTEMS..."}
                  {loadingProgress >= 30 && loadingProgress < 60 && "🎯 LOADING TACTICAL MAP DATA..."}
                  {loadingProgress >= 60 && loadingProgress < 90 && "💥 DEPLOYING DATE NIGHT PROTOCOLS..."}
                  {loadingProgress >= 90 && "✅ MISSION READY - STANDING BY..."}
                </div>
              </div>
            </div>
          )}

          {/* PIN Authentication Panel */}
          {showPinInput && (
            <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
              <div 
                className="border-4 border-[#FF6B35] bg-black/90 backdrop-blur-xl p-12 relative overflow-hidden group"
                style={{
                  boxShadow: '0 0 60px rgba(255, 107, 53, 0.4), inset 0 0 60px rgba(255, 107, 53, 0.1)',
                }}
              >
                {/* Animated corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00D9FF] animate-pulse" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#00D9FF] animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#00D9FF] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#00D9FF] animate-pulse" style={{ animationDelay: '1.5s' }} />

                <Lock className="w-20 h-20 mx-auto mb-6 text-[#FF6B35] drop-shadow-[0_0_20px_rgba(255,107,53,0.8)] animate-pulse" />

                <h2 
                  className="text-5xl font-black text-center mb-2 tracking-wider"
                  style={{
                    color: '#00D9FF',
                    textShadow: '0 0 20px rgba(0, 217, 255, 0.8)',
                    fontFamily: 'Impact, "Arial Black", sans-serif',
                  }}
                >
                  AUTHORIZATION REQUIRED
                </h2>

                <p className="text-[#6B8E23] text-center font-mono mb-8 text-sm tracking-wide">
                  [ENTER SECURITY CODE TO PROCEED]
                </p>

                <div className="space-y-6">
                  <Input
                    type="password"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && !isUnlocking && handlePinSubmit()}
                    placeholder="_ _ _ _"
                    disabled={isUnlocking}
                    className="text-center text-6xl font-black tracking-[0.8em] bg-black/70 backdrop-blur-xl border-[#6B8E23] text-[#00D9FF] border-4 h-32 rounded-xl focus:border-[#FF6B35] focus:shadow-[0_0_40px_rgba(255,107,53,0.6)] transition-all duration-300"
                    style={{
                      textShadow: '0 0 10px rgba(0, 217, 255, 0.8)',
                    }}
                    autoFocus
                  />

                  <Button
                    onClick={handlePinSubmit}
                    disabled={isUnlocking || !pinCode}
                    className="w-full h-20 text-3xl font-black bg-gradient-to-r from-[#FF6B35] to-[#6B8E23] hover:from-[#6B8E23] hover:to-[#FF6B35] border-4 border-[#00D9FF] shadow-[0_0_40px_rgba(0,217,255,0.4)] hover:shadow-[0_0_60px_rgba(0,217,255,0.8)] transition-all duration-300 disabled:opacity-50"
                  >
                    {isUnlocking ? (
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                        <span>AUTHORIZING...</span>
                      </div>
                    ) : (
                      '⚡ INITIATE ACCESS'
                    )}
                  </Button>
                </div>

                <div className="mt-8 pt-8 border-t-2 border-[#4A5D23] space-y-3">
                  <div className="text-center text-[#6B8E23] font-mono text-xs tracking-wide">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-[#FF6B35] rounded-full animate-pulse" />
                      <span>SECURE CONNECTION ESTABLISHED</span>
                    </div>
                    <div>ENCRYPTION: AES-256 | PROTOCOL: TLS 1.3</div>
                  </div>
                </div>
              </div>

              {/* Hint panel */}
              <div className="border-2 border-[#4A5D23] bg-black/80 p-6 text-center">
                <p className="text-[#6B8E23] font-mono text-sm mb-2">
                  🎮 TESTERS: Use your access code
                </p>
                <p className="text-[#FF6B35] font-mono text-sm">
                  👑 ADMINS: Use tactical override code
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom status bar */}
        <div className="absolute bottom-8 left-0 right-0 px-8">
          <div className="border-2 border-[#4A5D23] bg-black/80 p-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between text-xs font-mono text-[#6B8E23]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#6B8E23] rounded-full animate-pulse" />
                <span>SYSTEM ONLINE</span>
              </div>
              <div>CLEARANCE: ALPHA</div>
              <div>STATUS: AUTHORIZED</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        @keyframes scan-horizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};