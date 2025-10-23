import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

export const DetailedCupid = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const showCupid = () => {
      // Random position
      const x = Math.random() * (window.innerWidth - 300);
      const y = Math.random() * (window.innerHeight - 300);
      const rot = (Math.random() - 0.5) * 30; // -15 to +15 degrees
      
      setPosition({ x, y });
      setRotation(rot);
      setIsVisible(true);

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
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none transition-all duration-1000"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `rotate(${rotation}deg)`,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="relative animate-float-gentle">
        <svg
          width="240"
          height="280"
          viewBox="0 0 240 280"
          className="drop-shadow-2xl"
        >
          {/* Wings - large and detailed */}
          <g className="wings-left">
            <ellipse cx="60" cy="100" rx="50" ry="70" fill="white" opacity="0.95" />
            <ellipse cx="55" cy="95" rx="40" ry="60" fill="#FFE4E1" opacity="0.8" />
            <ellipse cx="50" cy="90" rx="30" ry="50" fill="white" opacity="0.7" />
            {/* Feather details */}
            <path d="M 60 70 Q 55 85 60 100" stroke="#FFB6C1" strokeWidth="1.5" fill="none" />
            <path d="M 70 75 Q 65 90 70 105" stroke="#FFB6C1" strokeWidth="1.5" fill="none" />
            <path d="M 50 75 Q 45 90 50 105" stroke="#FFB6C1" strokeWidth="1.5" fill="none" />
          </g>
          
          <g className="wings-right">
            <ellipse cx="180" cy="100" rx="50" ry="70" fill="white" opacity="0.95" />
            <ellipse cx="185" cy="95" rx="40" ry="60" fill="#FFE4E1" opacity="0.8" />
            <ellipse cx="190" cy="90" rx="30" ry="50" fill="white" opacity="0.7" />
            {/* Feather details */}
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

          {/* Pink T-Shirt with text */}
          <ellipse cx="120" cy="120" rx="40" ry="35" fill="#FF69B4" />
          <rect x="80" y="105" width="80" height="40" rx="5" fill="#FF69B4" />
          <text x="120" y="118" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">DATE NIGHTS</text>
          <text x="120" y="130" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">ARE DOPE!</text>

          {/* Arms */}
          <ellipse cx="80" cy="125" rx="12" ry="30" fill="#FFDAB9" transform="rotate(-20 80 125)" />
          <ellipse cx="160" cy="125" rx="12" ry="30" fill="#FFDAB9" transform="rotate(20 160 125)" />
          
          {/* Hands - holding heart */}
          <circle cx="75" cy="145" r="10" fill="#FFDAB9" />
          <circle cx="165" cy="145" r="10" fill="#FFDAB9" />

          {/* Head - detailed cartoon face */}
          <circle cx="120" cy="60" r="38" fill="#D2691E" />
          
          {/* Hair - curly brown */}
          <circle cx="95" cy="35" r="18" fill="#8B4513" />
          <circle cx="110" cy="28" r="18" fill="#8B4513" />
          <circle cx="130" cy="28" r="18" fill="#8B4513" />
          <circle cx="145" cy="35" r="18" fill="#8B4513" />
          <circle cx="120" cy="25" r="16" fill="#8B4513" />

          {/* Face details */}
          {/* Eyes - big cartoon eyes */}
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

          {/* Mouth - big smile */}
          <path d="M 105 72 Q 120 82 135 72" stroke="#8B4513" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 108 73 Q 120 80 132 73" fill="white" opacity="0.3" />

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

          {/* Sparkles around */}
          <circle cx="50" cy="50" r="3" fill="#FFD700" className="sparkle-1" />
          <circle cx="190" cy="60" r="3" fill="#FFD700" className="sparkle-2" />
          <circle cx="70" cy="180" r="2" fill="#FF69B4" className="sparkle-3" />
          <circle cx="170" cy="200" r="2" fill="#FF69B4" className="sparkle-4" />

          {/* Heart trail */}
          <g className="heart-trail">
            <path d="M 120 240 L 115 235 Q 110 230 110 235 Q 110 240 115 245 L 120 250 L 125 245 Q 130 240 130 235 Q 130 230 125 235 Z" fill="#FF1493" opacity="0.7" />
          </g>
        </svg>

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
            transform: translateY(-20px) scale(1.05);
          }
        }

        @keyframes wings-flap {
          0%, 100% {
            transform: scaleX(1);
          }
          50% {
            transform: scaleX(0.9);
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
          animation: float-gentle 4s ease-in-out infinite;
        }

        .wings-left, .wings-right {
          animation: wings-flap 1.5s ease-in-out infinite;
          transform-origin: center;
        }

        .wings-right {
          animation-delay: 0.1s;
        }

        .animate-float-heart-slow {
          animation: float-heart-slow 4s ease-out infinite;
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

        .heart-trail {
          animation: float-heart-slow 3s ease-out infinite;
        }
      `}</style>
    </div>
  );
};
