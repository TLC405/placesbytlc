import { useEffect, useState } from 'react';
import { Shield, Target, Lock, Users, Crown, GamepadIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AppLogo } from '@/components/AppLogo';
import { Progress } from '@/components/ui/progress';

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
      // Show everything immediately
      setShowText(true);
      setShowModeSelect(true);
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background/98 to-background">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-4">
        {/* App Logo - Always visible */}
        <div className="mb-8 animate-fade-in">
          <AppLogo />
        </div>

        {/* Mode Selection - Show immediately */}
        {showModeSelect && !showPinInput && !loadingProgress && (
          <div className="space-y-6 animate-scale-in">
            <div className="text-center mb-6">
              <Shield className="w-12 h-12 text-primary mx-auto mb-3 animate-pulse" />
              <h2 className="text-3xl font-black gradient-text">SELECT MODE</h2>
            </div>

            <div className="grid gap-3">
              <Button
                onClick={() => handleModeSelect('tester')}
                size="lg"
                className="h-24 text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <GamepadIcon className="w-8 h-8" />
                  <div className="text-left">
                    <div>TESTER MODE</div>
                    <div className="text-xs opacity-80 font-normal">Limited Access</div>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => handleModeSelect('admin')}
                size="lg"
                className="h-24 text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition-all hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <Crown className="w-8 h-8" />
                  <div className="text-left">
                    <div>ADMIN MODE</div>
                    <div className="text-xs opacity-80 font-normal">Full Control</div>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => handleModeSelect('couple')}
                size="lg"
                className="h-24 text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 transition-all hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8" />
                  <div className="text-left">
                    <div>COUPLE MODE</div>
                    <div className="text-xs opacity-80 font-normal">Shared Access</div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        )}

        {/* PIN Input */}
        {showPinInput && !loadingProgress && (
          <div className="space-y-6 animate-scale-in">
            <div className="text-center mb-6">
              <Lock className="w-12 h-12 text-primary mx-auto mb-3 animate-pulse" />
              <h2 className="text-3xl font-black gradient-text">
                {selectedMode === 'tester' ? 'TESTER' : 'ADMIN'} PIN
              </h2>
              <p className="text-sm text-muted-foreground mt-2">Enter security code</p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              <Input
                type="password"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && !isUnlocking && handlePinSubmit()}
                placeholder="Enter PIN"
                disabled={isUnlocking}
                className="text-center text-3xl font-mono tracking-widest h-16 border-2 border-primary/30"
                autoFocus
              />

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowPinInput(false);
                    setShowModeSelect(true);
                    setPinCode('');
                  }}
                  variant="outline"
                  className="flex-1 h-12"
                  disabled={isUnlocking}
                >
                  Back
                </Button>
                <Button
                  onClick={handlePinSubmit}
                  disabled={isUnlocking || !pinCode}
                  className="flex-1 h-12 bg-gradient-to-r from-primary to-accent"
                >
                  {isUnlocking ? 'Authorizing...' : 'AUTHENTICATE'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Progress */}
        {loadingProgress > 0 && (
          <div className="space-y-6 animate-scale-in max-w-md mx-auto">
            <div className="text-center">
              <Shield className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl font-black gradient-text mb-2">INITIALIZING</h3>
              <p className="text-muted-foreground text-sm">
                {loadingProgress < 30 && "Verifying credentials..."}
                {loadingProgress >= 30 && loadingProgress < 60 && "Loading modules..."}
                {loadingProgress >= 60 && loadingProgress < 90 && "Preparing interface..."}
                {loadingProgress >= 90 && "Ready to launch!"}
              </p>
            </div>
            
            <div className="space-y-2">
              <Progress value={loadingProgress} className="h-2" />
              <div className="text-center text-sm font-bold text-muted-foreground">
                {Math.round(loadingProgress)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
