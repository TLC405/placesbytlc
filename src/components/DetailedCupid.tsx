import { useEffect, useState } from "react";
import cupidImage from "@/assets/cupid-transparent.png";

export const DetailedCupid = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [velocity, setVelocity] = useState({ x: 0.8, y: 0.6 });
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [hiddenUntil, setHiddenUntil] = useState<number | null>(null);

  // Check if temporarily hidden
  useEffect(() => {
    const checkHidden = localStorage.getItem('cupid_hidden_until');
    if (checkHidden) {
      const hideUntil = parseInt(checkHidden);
      if (Date.now() < hideUntil) {
        setHiddenUntil(hideUntil);
        setIsVisible(false);
      } else {
        localStorage.removeItem('cupid_hidden_until');
        setIsVisible(true);
      }
    } else {
      // Show after 3 seconds on load
      setTimeout(() => setIsVisible(true), 3000);
    }
  }, []);

  // Timer to check when to reappear
  useEffect(() => {
    if (hiddenUntil) {
      const interval = setInterval(() => {
        if (Date.now() >= hiddenUntil) {
          setHiddenUntil(null);
          localStorage.removeItem('cupid_hidden_until');
          setIsVisible(true);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [hiddenUntil]);

  // Bounce animation - screen pet behavior
  useEffect(() => {
    if (!isVisible || hiddenUntil) return;

    const interval = setInterval(() => {
      setPosition((prev) => {
        let newX = prev.x + velocity.x;
        let newY = prev.y + velocity.y;
        let newVelX = velocity.x;
        let newVelY = velocity.y;

        // Bounce off edges (leave 15% padding for cupid size)
        if (newX <= 5 || newX >= 85) {
          newVelX = -velocity.x;
          newX = newX <= 5 ? 5 : 85;
        }
        if (newY <= 5 || newY >= 80) {
          newVelY = -velocity.y;
          newY = newY <= 5 ? 5 : 80;
        }

        setVelocity({ x: newVelX, y: newVelY });
        return { x: newX, y: newY };
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isVisible, velocity, hiddenUntil]);

  // Eye tracking - follow mouse/touch
  useEffect(() => {
    if (!isVisible || hiddenUntil) return;

    const handleMove = (clientX: number, clientY: number) => {
      // Calculate offset from center of cupid to cursor
      const cupidCenterX = (position.x / 100) * window.innerWidth;
      const cupidCenterY = (position.y / 100) * window.innerHeight;
      
      const deltaX = clientX - cupidCenterX;
      const deltaY = clientY - cupidCenterY;
      
      // Normalize to -1 to 1 range and limit movement
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxOffset = 8; // Max pixels eyes can move
      
      if (distance > 0) {
        setEyeOffset({
          x: Math.max(-maxOffset, Math.min(maxOffset, (deltaX / distance) * Math.min(distance / 50, maxOffset))),
          y: Math.max(-maxOffset, Math.min(maxOffset, (deltaY / distance) * Math.min(distance / 50, maxOffset)))
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isVisible, position, hiddenUntil]);

  const handleTap = () => {
    // Hide for 10 seconds
    const hideUntil = Date.now() + 10000;
    localStorage.setItem('cupid_hidden_until', hideUntil.toString());
    setHiddenUntil(hideUntil);
    setIsVisible(false);
  };

  if (!isVisible || hiddenUntil) return null;

  return (
    <div
      className="fixed z-50 cursor-pointer transition-all duration-300 hover:scale-110"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        width: '100px',
        height: 'auto',
        filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.25))',
        pointerEvents: 'auto',
      }}
      onClick={handleTap}
    >
      <div className="relative animate-float-gentle">
        <img
          src={cupidImage}
          alt="TLC Cupid"
          className="w-full h-auto"
        />
        
        {/* Animated eyes overlay - follows cursor */}
        <div 
          className="absolute top-[28%] left-[42%] w-3 h-3 rounded-full bg-black transition-transform duration-200"
          style={{
            transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
          }}
        />
        <div 
          className="absolute top-[28%] right-[42%] w-3 h-3 rounded-full bg-black transition-transform duration-200"
          style={{
            transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
          }}
        />
      </div>

      <style>{`
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-8px) rotate(2deg);
          }
          50% {
            transform: translateY(-12px) rotate(0deg);
          }
          75% {
            transform: translateY(-8px) rotate(-2deg);
          }
        }

        .animate-float-gentle {
          animation: float-gentle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
