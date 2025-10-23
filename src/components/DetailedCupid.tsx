import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import cupidImage from "@/assets/cupid-character.jpg";

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
      // Random position (percentages for responsive)
      const x = Math.random() * 80 + 10; // 10% to 90%
      const y = Math.random() * 70 + 10; // 10% to 80%
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

    // Show every 15 seconds
    const interval = setInterval(showCupid, 15000);
    
    // Show after 5 seconds on mount
    const initialTimer = setTimeout(showCupid, 5000);

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
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(0.25)`,
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform, opacity',
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
        <img
          src={cupidImage}
          alt="TLC Cupid"
          style={{
            width: "400px",
            height: "auto",
            filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.5))",
          }}
        />

        {/* Blown Kiss Heart */}
        {isBlowingKiss && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 animate-kiss-float">
            <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
          </div>
        )}

        {/* Floating hearts around */}
        <div className="absolute -top-4 left-8 animate-float-heart-slow">
          <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
        </div>
        <div className="absolute top-12 -right-8 animate-float-heart-slow" style={{ animationDelay: "0.5s" }}>
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
        </div>
        <div className="absolute top-32 left-0 animate-float-heart-slow" style={{ animationDelay: "1s" }}>
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
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
      `}</style>
    </div>
  );
};
