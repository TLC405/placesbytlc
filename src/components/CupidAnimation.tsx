import { useEffect, useState } from "react";

export const CupidAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Hide after animation completes (12s animation)
      setTimeout(() => setIsVisible(false), 12000);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Female Cupid (being chased) */}
      <div className="cupid-female absolute">
        <svg width="80" height="80" viewBox="0 0 100 100" className="animate-spin-slow">
          {/* Female Cupid - pink colors */}
          <circle cx="50" cy="40" r="20" fill="#FFB6C1" />
          <circle cx="45" cy="38" r="3" fill="#8B4513" />
          <circle cx="55" cy="38" r="3" fill="#8B4513" />
          <path d="M 45 45 Q 50 48 55 45" stroke="#FF69B4" strokeWidth="2" fill="none" />
          {/* Crown */}
          <path d="M 35 25 L 40 30 L 45 25 L 50 30 L 55 25 L 60 30 L 65 25" stroke="#FFD700" strokeWidth="2" fill="none" />
          {/* Wings */}
          <ellipse cx="30" cy="50" rx="15" ry="25" fill="#FFE4E1" opacity="0.8" />
          <ellipse cx="70" cy="50" rx="15" ry="25" fill="#FFE4E1" opacity="0.8" />
          {/* Body */}
          <ellipse cx="50" cy="65" rx="12" ry="20" fill="#FFB6C1" />
          {/* Heart trail */}
          <g className="hearts-trail">
            <path d="M 50 80 Q 45 75 40 80 Q 35 85 40 90 Q 50 100 50 100 Q 50 100 60 90 Q 65 85 60 80 Q 55 75 50 80" fill="#FF69B4" opacity="0.6" />
          </g>
        </svg>
      </div>

      {/* Male Cupid (chasing) */}
      <div className="cupid-male absolute">
        <svg width="80" height="80" viewBox="0 0 100 100" className="animate-spin-slow">
          {/* Male Cupid - blue colors */}
          <circle cx="50" cy="40" r="20" fill="#87CEEB" />
          <circle cx="45" cy="38" r="3" fill="#8B4513" />
          <circle cx="55" cy="38" r="3" fill="#8B4513" />
          <path d="M 45 45 Q 50 48 55 45" stroke="#4169E1" strokeWidth="2" fill="none" />
          {/* Wings */}
          <ellipse cx="30" cy="50" rx="15" ry="25" fill="#E0F4FF" opacity="0.8" />
          <ellipse cx="70" cy="50" rx="15" ry="25" fill="#E0F4FF" opacity="0.8" />
          {/* Body */}
          <ellipse cx="50" cy="65" rx="12" ry="20" fill="#87CEEB" />
          {/* Bow and Arrow */}
          <path d="M 70 45 Q 75 40 80 45" stroke="#8B4513" strokeWidth="2" fill="none" />
          <line x1="75" y1="40" x2="85" y2="35" stroke="#FFD700" strokeWidth="2" />
          {/* Arrow sparkles */}
          <circle cx="85" cy="33" r="2" fill="#FFD700" className="animate-pulse" />
          <circle cx="87" cy="36" r="2" fill="#FFD700" className="animate-pulse" style={{ animationDelay: "0.2s" }} />
        </svg>
      </div>

      <style>{`
        @keyframes cupid-chase-female {
          0% {
            left: -10%;
            bottom: 10%;
            transform: rotate(0deg) scale(1);
          }
          25% {
            left: 30%;
            bottom: 40%;
            transform: rotate(20deg) scale(1.1);
          }
          50% {
            left: 50%;
            bottom: 60%;
            transform: rotate(-10deg) scale(1);
          }
          75% {
            left: 75%;
            bottom: 50%;
            transform: rotate(15deg) scale(1.1);
          }
          100% {
            left: 110%;
            bottom: 20%;
            transform: rotate(0deg) scale(1);
          }
        }

        @keyframes cupid-chase-male {
          0% {
            left: -15%;
            bottom: 5%;
            transform: rotate(5deg) scale(1);
          }
          25% {
            left: 25%;
            bottom: 35%;
            transform: rotate(25deg) scale(1.05);
          }
          50% {
            left: 45%;
            bottom: 55%;
            transform: rotate(-5deg) scale(1);
          }
          75% {
            left: 70%;
            bottom: 45%;
            transform: rotate(20deg) scale(1.05);
          }
          100% {
            left: 105%;
            bottom: 15%;
            transform: rotate(5deg) scale(1);
          }
        }

        @keyframes drop-hearts {
          0%, 100% {
            opacity: 0.6;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 0.3;
            transform: translateY(10px) scale(0.8);
          }
        }

        .cupid-female {
          animation: cupid-chase-female 12s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards;
        }

        .cupid-male {
          animation: cupid-chase-male 12s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards;
        }

        .hearts-trail {
          animation: drop-hearts 1s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
