import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

export const DetailedCupid = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isBlowingKiss, setIsBlowingKiss] = useState(false);
  const [isFalling, setIsFalling] = useState(false);
  const [isKissDetecting, setIsKissDetecting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isPermanentlyRemoved, setIsPermanentlyRemoved] = useState(false);
  const [tempRemoveUntil, setTempRemoveUntil] = useState<number | null>(null);

  // Check for permanent removal and temporary removal
  useEffect(() => {
    const permanentRemove = localStorage.getItem('cupid_permanent_remove');
    const tempRemove = localStorage.getItem('cupid_temp_remove');
    
    if (permanentRemove === 'true') {
      setIsPermanentlyRemoved(true);
      return;
    }
    
    if (tempRemove) {
      const removeUntil = parseInt(tempRemove);
      if (Date.now() < removeUntil) {
        setTempRemoveUntil(removeUntil);
      } else {
        localStorage.removeItem('cupid_temp_remove');
      }
    }
  }, []);

  // Check if temp remove expired
  useEffect(() => {
    if (tempRemoveUntil) {
      const interval = setInterval(() => {
        if (Date.now() >= tempRemoveUntil) {
          setTempRemoveUntil(null);
          localStorage.removeItem('cupid_temp_remove');
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [tempRemoveUntil]);

  // Motion detection for "kiss" gesture
  useEffect(() => {
    if (isPermanentlyRemoved || tempRemoveUntil || !isVisible) return;

    let lastZ = 0;
    let rapidMoveCount = 0;

    const handleMotion = (event: DeviceMotionEvent) => {
      const accel = event.accelerationIncludingGravity;
      if (!accel || !accel.z) return;

      const currentZ = accel.z;
      const zDiff = Math.abs(currentZ - lastZ);

      // Detect rapid forward movement (phone towards face)
      if (zDiff > 8) {
        rapidMoveCount++;
        if (rapidMoveCount >= 3) {
          setIsKissDetecting(true);
          rapidMoveCount = 0;
        }
      } else {
        rapidMoveCount = Math.max(0, rapidMoveCount - 1);
      }

      lastZ = currentZ;
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [isPermanentlyRemoved, tempRemoveUntil, isVisible]);

  // Kiss countdown sequence
  useEffect(() => {
    if (!isKissDetecting) return;

    const audio = new Audio();
    const countdownSequence = [3, 2, 1, 0];
    let index = 0;

    const countdownInterval = setInterval(() => {
      if (index < countdownSequence.length) {
        const num = countdownSequence[index];
        setCountdown(num);
        
        // Play countdown audio (using speech synthesis as fallback)
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(num === 0 ? 'aweee' : num.toString());
          utterance.rate = 1.5;
          window.speechSynthesis.speak(utterance);
        }
        
        index++;
      } else {
        clearInterval(countdownInterval);
        localStorage.setItem('cupid_permanent_remove', 'true');
        setIsPermanentlyRemoved(true);
        setIsVisible(false);
        setIsKissDetecting(false);
        setCountdown(null);
      }
    }, 800);

    return () => clearInterval(countdownInterval);
  }, [isKissDetecting]);

  useEffect(() => {
    if (isPermanentlyRemoved || tempRemoveUntil) return;

    const showCupid = () => {
      // Random position
      const x = Math.random() * (window.innerWidth - 200);
      const y = Math.random() * (window.innerHeight - 240);
      const rot = (Math.random() - 0.5) * 30;
      
      setPosition({ x, y });
      setRotation(rot);
      setIsVisible(true);
      setIsFalling(false);

      // Randomly blow kiss (30% chance)
      if (Math.random() < 0.3) {
        setTimeout(() => setIsBlowingKiss(true), 2000);
        setTimeout(() => setIsBlowingKiss(false), 3000);
      }

      // Hide after 8 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 8000);
    };

    // Show every 10 seconds
    const interval = setInterval(showCupid, 10000);
    
    // Show after 3 seconds on mount
    const initialTimer = setTimeout(showCupid, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, [isPermanentlyRemoved, tempRemoveUntil]);

  const handleTap = () => {
    // Temp remove for 30 seconds
    const removeUntil = Date.now() + 30000;
    localStorage.setItem('cupid_temp_remove', removeUntil.toString());
    setTempRemoveUntil(removeUntil);
    setIsVisible(false);
  };

  const handleSwat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFalling(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsFalling(false);
    }, 1000);
  };

  if (!isVisible || isPermanentlyRemoved || tempRemoveUntil) return null;


  return (
    <div
      className={`fixed z-50 transition-all duration-1000 cursor-pointer ${
        isFalling ? 'animate-fall-and-spin' : 'pointer-events-auto'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `rotate(${rotation}deg) scale(0.6)`,
        opacity: isVisible ? 1 : 0,
      }}
      onClick={handleTap}
      onDoubleClick={handleSwat}
    >
      {countdown !== null && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-4 text-6xl font-black text-white drop-shadow-lg animate-pulse z-50">
          {countdown === 0 ? '❤️ AWEEE!' : countdown}
        </div>
      )}

      <div className={`relative ${isFalling ? '' : 'animate-float-gentle'}`}>
        <svg
          width="200"
          height="233"
          viewBox="0 0 240 280"
          className="drop-shadow-2xl"
        >
          {/* Wings */}
          <g className="wings-left">
            <ellipse cx="60" cy="100" rx="50" ry="70" fill="white" opacity="0.95" />
            <ellipse cx="55" cy="95" rx="40" ry="60" fill="#FFE4E1" opacity="0.8" />
            <ellipse cx="50" cy="90" rx="30" ry="50" fill="white" opacity="0.7" />
            <path d="M 60 70 Q 55 85 60 100" stroke="#FFB6C1" strokeWidth="1.5" fill="none" />
            <path d="M 70 75 Q 65 90 70 105" stroke="#FFB6C1" strokeWidth="1.5" fill="none" />
            <path d="M 50 75 Q 45 90 50 105" stroke="#FFB6C1" strokeWidth="1.5" fill="none" />
          </g>
          
          <g className="wings-right">
            <ellipse cx="180" cy="100" rx="50" ry="70" fill="white" opacity="0.95" />
            <ellipse cx="185" cy="95" rx="40" ry="60" fill="#FFE4E1" opacity="0.8" />
            <ellipse cx="190" cy="90" rx="30" ry="50" fill="white" opacity="0.7" />
            <path d="M 180 70 Q 185 85 180 100" stroke="#FFB6C1" strokeWidth="1.5" fill="none" />
            <path d="M 170 75 Q 175 90 170 105" stroke="#FFB6C1" strokeWidth="1.5" fill="none" />
            <path d="M 190 75 Q 195 90 190 105" stroke="#FFB6C1" strokeWidth="1.5" fill="none" />
          </g>

          {/* Body */}
          <ellipse cx="120" cy="140" rx="35" ry="50" fill="#FFDAB9" />
          
          {/* White Diaper */}
          <rect x="90" y="165" width="60" height="45" rx="8" fill="white" />
          <path d="M 95 180 Q 120 175 145 180" stroke="#E0E0E0" strokeWidth="2" fill="none" />
          <path d="M 95 195 Q 120 190 145 195" stroke="#E0E0E0" strokeWidth="2" fill="none" />

          {/* Pink T-Shirt */}
          <ellipse cx="120" cy="120" rx="40" ry="35" fill="#FF69B4" />
          <rect x="80" y="105" width="80" height="40" rx="5" fill="#FF69B4" />
          <text x="120" y="118" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">DATE NIGHTS</text>
          <text x="120" y="130" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">ARE DOPE!</text>

          {/* Arms */}
          <ellipse cx="80" cy="125" rx="12" ry="30" fill="#FFDAB9" transform="rotate(-20 80 125)" />
          <ellipse cx="160" cy="125" rx="12" ry="30" fill="#FFDAB9" transform="rotate(20 160 125)" />
          
          {/* Hands */}
          <circle cx="75" cy="145" r="10" fill="#FFDAB9" />
          <circle cx="165" cy="145" r="10" fill="#FFDAB9" />

          {/* Head */}
          <circle cx="120" cy="60" r="38" fill="#D2691E" />
          
          {/* Hair - curly brown */}
          <circle cx="95" cy="35" r="18" fill="#8B4513" />
          <circle cx="110" cy="28" r="18" fill="#8B4513" />
          <circle cx="130" cy="28" r="18" fill="#8B4513" />
          <circle cx="145" cy="35" r="18" fill="#8B4513" />
          <circle cx="120" cy="25" r="16" fill="#8B4513" />

          {/* Face - Eyes */}
          <ellipse cx="105" cy="58" rx="8" ry="10" fill="white" />
          <circle cx="107" cy="59" r="5" fill="#4169E1" />
          <circle cx="108" cy="58" r="2" fill="black" />
          <circle cx="109" cy="60" r="1" fill="white" />
          
          <ellipse cx="135" cy="58" rx="8" ry="10" fill="white" />
          <circle cx="137" cy="59" r="5" fill="#4169E1" />
          <circle cx="138" cy="58" r="2" fill="black" />
          <circle cx="139" cy="60" r="1" fill="white" />

          {/* Eyebrows */}
          <path d="M 95 50 Q 105 48 115 50" stroke="#654321" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 125 50 Q 135 48 145 50" stroke="#654321" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Nose */}
          <ellipse cx="120" cy="65" rx="4" ry="6" fill="#A0522D" />

          {/* Mouth - Kiss or Smile */}
          {isBlowingKiss ? (
            <circle cx="120" cy="75" r="8" fill="#FF69B4" opacity="0.8" />
          ) : (
            <path d="M 105 72 Q 120 82 135 72" stroke="#8B4513" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}

          {/* Rosy cheeks */}
          <ellipse cx="95" cy="68" rx="8" ry="6" fill="#FF69B4" opacity="0.4" />
          <ellipse cx="145" cy="68" rx="8" ry="6" fill="#FF69B4" opacity="0.4" />

          {/* Legs */}
          <ellipse cx="105" cy="230" rx="14" ry="35" fill="#FFDAB9" />
          <ellipse cx="135" cy="230" rx="14" ry="35" fill="#FFDAB9" />

          {/* Feet */}
          <ellipse cx="105" cy="260" rx="16" ry="10" fill="#D2691E" />
          <ellipse cx="135" cy="260" rx="16" ry="10" fill="#D2691E" />

          {/* Golden Bow with Arrow */}
          <g transform="translate(150, 100) rotate(30)">
            <path d="M 0 0 Q -5 -20 -10 -40" stroke="#FFD700" strokeWidth="3" fill="none" />
            <path d="M -10 -40 L -12 -42 M -10 -40 L -8 -42" stroke="#FFD700" strokeWidth="2" />
            <circle cx="0" cy="0" r="3" fill="#FFD700" />
            <path d="M 5 -5 L 15 5" stroke="#8B4513" strokeWidth="2" />
          </g>

          {/* Sparkles */}
          <circle cx="50" cy="50" r="3" fill="#FFD700" className="sparkle-1" />
          <circle cx="190" cy="60" r="3" fill="#FFD700" className="sparkle-2" />
          <circle cx="70" cy="180" r="2" fill="#FF69B4" className="sparkle-3" />
          <circle cx="170" cy="200" r="2" fill="#FF69B4" className="sparkle-4" />
        </svg>

        {/* Blown Kiss Heart */}
        {isBlowingKiss && (
          <div className="absolute top-8 left-32 animate-kiss-float">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
          </div>
        )}

        {/* Floating hearts around */}
        <div className="absolute -top-4 left-8 animate-float-heart-slow">
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
        </div>
        <div className="absolute top-12 -right-8 animate-float-heart-slow" style={{ animationDelay: "0.5s" }}>
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
        </div>
        <div className="absolute top-32 left-0 animate-float-heart-slow" style={{ animationDelay: "1s" }}>
          <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
        </div>
      </div>

      <style>{`
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.03);
          }
        }

        @keyframes float-heart-slow {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-30px, 60px) rotate(180deg) scale(0);
            opacity: 0;
          }
        }

        @keyframes kiss-float {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(50px, -50px) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes fall-and-spin {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes sparkle-twinkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(0.5);
          }
        }

        .animate-float-gentle {
          animation: float-gentle 3s ease-in-out infinite;
        }

        .animate-float-heart-slow {
          animation: float-heart-slow 4s ease-out infinite;
        }

        .animate-kiss-float {
          animation: kiss-float 2s ease-out forwards;
        }

        .animate-fall-and-spin {
          animation: fall-and-spin 1s ease-in forwards;
          pointer-events: none;
        }

        .sparkle-1, .sparkle-2, .sparkle-3, .sparkle-4 {
          animation: sparkle-twinkle 2s ease-in-out infinite;
        }

        .sparkle-2 {
          animation-delay: 0.5s;
        }

        .sparkle-3 {
          animation-delay: 1s;
        }

        .sparkle-4 {
          animation-delay: 1.5s;
        }
      `}</style>
    </div>
  );
};
