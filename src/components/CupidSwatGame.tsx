import { useState, useEffect, useRef } from 'react';
import { Heart, Zap } from 'lucide-react';

interface CupidSwatGameProps {
  isActive: boolean;
  onScore?: (score: number) => void;
}

interface CupidPosition {
  x: number;
  y: number;
  id: number;
  isHit: boolean;
}

export const CupidSwatGame = ({ isActive, onScore }: CupidSwatGameProps) => {
  const [cupids, setCupids] = useState<CupidPosition[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const cupidIdRef = useRef(0);

  useEffect(() => {
    if (!isActive) return;

    // Spawn cupids every 800ms
    const spawnInterval = setInterval(() => {
      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        const newCupid: CupidPosition = {
          x: Math.random() * (rect.width - 60),
          y: Math.random() * (rect.height - 60),
          id: cupidIdRef.current++,
          isHit: false,
        };
        setCupids(prev => [...prev, newCupid]);

        // Remove cupid after 2 seconds if not hit
        setTimeout(() => {
          setCupids(prev => prev.filter(c => c.id !== newCupid.id));
          setCombo(0); // Reset combo if cupid escapes
        }, 2000);
      }
    }, 800);

    // Countdown timer
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          clearInterval(spawnInterval);
          if (onScore) onScore(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(timerInterval);
    };
  }, [isActive, score, onScore]);

  const handleCupidClick = (cupidId: number) => {
    setCupids(prev =>
      prev.map(c => (c.id === cupidId ? { ...c, isHit: true } : c))
    );

    // Calculate score with combo multiplier
    const newCombo = combo + 1;
    const points = 10 * Math.max(1, Math.floor(newCombo / 3) + 1);
    setScore(prev => prev + points);
    setCombo(newCombo);

    // Remove hit cupid after animation
    setTimeout(() => {
      setCupids(prev => prev.filter(c => c.id !== cupidId));
    }, 300);
  };

  if (!isActive) return null;

  return (
    <div className="relative w-full h-[500px] border-4 border-primary/30 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-100/50 via-purple-100/50 to-blue-100/50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Game HUD */}
      <div className="absolute top-4 left-0 right-0 z-10 flex justify-between px-6">
        <div className="glass px-6 py-3 rounded-full border-2 border-primary/30">
          <div className="text-2xl font-black text-primary flex items-center gap-2">
            <Zap className="w-6 h-6 fill-primary" />
            {score}
          </div>
          {combo > 2 && (
            <div className="text-xs font-bold text-orange-500 animate-pulse">
              {combo}x COMBO!
            </div>
          )}
        </div>
        <div className="glass px-6 py-3 rounded-full border-2 border-primary/30">
          <div className="text-2xl font-black text-primary">
            ⏱️ {timeLeft}s
          </div>
        </div>
      </div>

      {/* Game Title */}
      <div className="absolute top-20 left-0 right-0 z-10 text-center pointer-events-none">
        <h2 className="text-4xl font-black gradient-text drop-shadow-lg animate-pulse">
          🎯 SWAT THE CUPID! 🎯
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Click the flying cupids while your image generates!
        </p>
      </div>

      {/* Game Area */}
      <div
        ref={gameAreaRef}
        className="absolute inset-0 cursor-crosshair"
      >
        {/* Floating Cupids */}
        {cupids.map(cupid => (
          <button
            key={cupid.id}
            onClick={() => handleCupidClick(cupid.id)}
            className={`absolute transition-all duration-300 ${
              cupid.isHit
                ? 'scale-150 rotate-180 opacity-0'
                : 'scale-100 opacity-100 hover:scale-125'
            }`}
            style={{
              left: `${cupid.x}px`,
              top: `${cupid.y}px`,
              animation: cupid.isHit ? '' : 'float 2s ease-in-out infinite',
            }}
          >
            <Heart
              className="w-12 h-12 text-pink-500 fill-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]"
              style={{
                filter: cupid.isHit
                  ? 'drop-shadow(0 0 20px rgba(255,0,0,1))'
                  : '',
              }}
            />
          </button>
        ))}
      </div>

      {/* Game Over */}
      {timeLeft === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-20 animate-fade-in">
          <div className="text-center glass p-12 rounded-3xl border-4 border-primary">
            <h2 className="text-6xl font-black gradient-text mb-4">
              TIME'S UP!
            </h2>
            <div className="text-8xl font-black text-primary mb-4">
              {score}
            </div>
            <p className="text-xl text-muted-foreground">
              {score > 200 && '🏆 LEGENDARY SWATTER!'}
              {score > 100 && score <= 200 && '⭐ CUPID HUNTER!'}
              {score <= 100 && '💪 NICE TRY!'}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-15px) rotate(-10deg);
          }
          50% {
            transform: translateY(-5px) rotate(10deg);
          }
          75% {
            transform: translateY(-20px) rotate(-5deg);
          }
        }
      `}</style>
    </div>
  );
};