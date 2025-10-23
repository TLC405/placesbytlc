import { useState, useEffect, useRef } from "react";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const InteractiveCupid = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDead, setIsDead] = useState(false);
  const [isBlowingKiss, setIsBlowingKiss] = useState(false);
  const [isDisabled, setIsDisabled] = useState(() => {
    return localStorage.getItem('cupidDisabled') === 'true';
  });
  const cupidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDisabled) return;

    const showCupid = () => {
      if (isDead) return;
      
      const x = Math.random() * (window.innerWidth - 200);
      const y = Math.random() * (window.innerHeight - 200);
      setPosition({ x, y });
      setIsVisible(true);

      // Sometimes blow a kiss
      if (Math.random() > 0.5) {
        setTimeout(() => {
          setIsBlowingKiss(true);
          setTimeout(() => setIsBlowingKiss(false), 2000);
        }, 1500);
      }

      // Hide after 5 seconds
      setTimeout(() => {
        if (!isDead) setIsVisible(false);
      }, 5000);
    };

    const interval = setInterval(showCupid, 10000);
    showCupid(); // Show immediately on mount

    return () => clearInterval(interval);
  }, [isDead, isDisabled]);

  const handleSwat = () => {
    setIsDead(true);
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIsDead(false);
      }, 2000);
    }, 1000);
  };

  const handleDisable = () => {
    setIsDisabled(true);
    localStorage.setItem('cupidDisabled', 'true');
    setIsVisible(false);
  };

  const handleEnable = () => {
    setIsDisabled(false);
    localStorage.removeItem('cupidDisabled');
  };

  if (isDisabled) {
    return (
      <Button
        onClick={handleEnable}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 gap-2"
      >
        <Heart className="w-4 h-4" />
        Enable Cupid
      </Button>
    );
  }

  if (!isVisible) return null;

  return (
    <div
      ref={cupidRef}
      className={`fixed z-50 transition-all duration-700 cursor-pointer ${
        isDead ? 'rotate-180 opacity-0' : 'hover:scale-110'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isDead ? 'translateY(100vh) rotate(180deg)' : 'translateY(0)',
      }}
      onClick={handleSwat}
    >
      <div className="relative animate-bounce">
        {/* Cupid Body - Brown skin tone */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 shadow-2xl flex items-center justify-center border-4 border-white relative">
          {/* Face */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Eyes */}
            <div className="flex gap-3 mb-1">
              <div className={`w-2 h-2 bg-black rounded-full ${isBlowingKiss ? 'animate-pulse' : ''}`}></div>
              <div className={`w-2 h-2 bg-black rounded-full ${isBlowingKiss ? '' : 'animate-pulse'}`}></div>
            </div>
            {/* Mouth */}
            <div className={`w-6 h-3 border-2 border-black rounded-full border-t-0 ${isBlowingKiss ? 'animate-ping' : ''}`}></div>
          </div>
        </div>

        {/* White Diaper */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-white rounded-lg shadow-lg border-2 border-gray-300"></div>

        {/* Pink Shirt with Text */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-12 bg-pink-400 rounded-lg shadow-lg flex items-center justify-center">
          <span className="text-[8px] font-black text-white text-center leading-tight">
            DATE<br/>NIGHTS<br/>ARE<br/>DOPE
          </span>
        </div>

        {/* Wings */}
        <div className="absolute top-2 -left-4 w-10 h-10 bg-white rounded-full opacity-90 animate-wing-left shadow-xl"></div>
        <div className="absolute top-2 -right-4 w-10 h-10 bg-white rounded-full opacity-90 animate-wing-right shadow-xl"></div>

        {/* Flying hearts trail */}
        <div className="absolute -top-2 left-10 animate-float-heart-1">
          <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
        </div>
        <div className="absolute top-4 left-12 animate-float-heart-2">
          <Heart className="w-2 h-2 text-rose-400 fill-rose-400" />
        </div>

        {/* Kiss effect */}
        {isBlowingKiss && (
          <div className="absolute -right-8 top-8 animate-ping">
            <span className="text-4xl">💋</span>
          </div>
        )}
      </div>

      {/* Disable button */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          handleDisable();
        }}
        variant="ghost"
        size="icon"
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600"
      >
        <X className="w-3 h-3 text-white" />
      </Button>

      <style>{`
        @keyframes wing-left {
          0%, 100% { transform: rotate(-30deg) translateY(0); }
          50% { transform: rotate(-45deg) translateY(-6px); }
        }

        @keyframes wing-right {
          0%, 100% { transform: rotate(30deg) translateY(0); }
          50% { transform: rotate(45deg) translateY(-6px); }
        }

        @keyframes float-heart-1 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-20px, 30px) scale(0); opacity: 0; }
        }

        @keyframes float-heart-2 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-15px, 35px) scale(0); opacity: 0; }
        }

        .animate-wing-left {
          animation: wing-left 0.4s ease-in-out infinite;
        }

        .animate-wing-right {
          animation: wing-right 0.4s ease-in-out infinite;
        }

        .animate-float-heart-1 {
          animation: float-heart-1 1.5s ease-out infinite;
        }

        .animate-float-heart-2 {
          animation: float-heart-2 1.7s ease-out infinite;
        }
      `}</style>
    </div>
  );
};
