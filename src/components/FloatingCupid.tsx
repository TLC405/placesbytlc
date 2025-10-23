import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface FloatingCupidProps {
  isActive: boolean;
}

export const FloatingCupid = ({ isActive }: FloatingCupidProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShow(true);
    } else {
      const timeout = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isActive]);

  if (!show) return null;

  return (
    <>
      <div className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
        {/* Flying Cupid */}
        <div className="cupid-float absolute top-1/3 left-0">
          <div className="relative animate-bounce">
            {/* Cupid Body */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-300 to-pink-500 shadow-2xl flex items-center justify-center border-4 border-white">
              <Heart className="w-10 h-10 text-white fill-white animate-pulse" />
            </div>
            {/* Wings */}
            <div className="absolute -top-2 -left-3 w-8 h-8 bg-white rounded-full opacity-90 animate-wing-left"></div>
            <div className="absolute -top-2 -right-3 w-8 h-8 bg-white rounded-full opacity-90 animate-wing-right"></div>
            {/* Trail hearts */}
            <div className="absolute top-10 left-10 animate-float-heart-1">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
            </div>
            <div className="absolute top-8 left-6 animate-float-heart-2">
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
            </div>
            <div className="absolute top-12 left-12 animate-float-heart-3">
              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
            </div>
          </div>
        </div>

        {/* Searching Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-clip-text text-transparent font-black text-4xl md:text-6xl animate-pulse drop-shadow-2xl">
            Finding Love Spots...
          </div>
          <div className="text-pink-600 font-bold text-xl md:text-2xl mt-2 animate-bounce">
            💕 Cupid is searching 💕
          </div>
        </div>

        {/* Scattered hearts around */}
        <div className="scattered-hearts">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-random"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <Heart className="w-6 h-6 text-pink-400 fill-pink-400 opacity-60" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes cupid-float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(30vw, -10vh) rotate(10deg);
          }
          50% {
            transform: translate(60vw, 5vh) rotate(-5deg);
          }
          75% {
            transform: translate(40vw, -5vh) rotate(5deg);
          }
        }

        @keyframes wing-left {
          0%, 100% { transform: rotate(-20deg) translateY(0); }
          50% { transform: rotate(-30deg) translateY(-4px); }
        }

        @keyframes wing-right {
          0%, 100% { transform: rotate(20deg) translateY(0); }
          50% { transform: rotate(30deg) translateY(-4px); }
        }

        @keyframes float-heart-1 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-30px, 40px) scale(0); opacity: 0; }
        }

        @keyframes float-heart-2 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-20px, 50px) scale(0); opacity: 0; }
        }

        @keyframes float-heart-3 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-40px, 45px) scale(0); opacity: 0; }
        }

        @keyframes float-random {
          0%, 100% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-30px) rotate(180deg) scale(1.3);
            opacity: 1;
          }
        }

        .cupid-float {
          animation: cupid-float 4s ease-in-out infinite;
        }

        .animate-wing-left {
          animation: wing-left 0.5s ease-in-out infinite;
        }

        .animate-wing-right {
          animation: wing-right 0.5s ease-in-out infinite;
        }

        .animate-float-heart-1 {
          animation: float-heart-1 2s ease-out infinite;
        }

        .animate-float-heart-2 {
          animation: float-heart-2 2.2s ease-out infinite;
        }

        .animate-float-heart-3 {
          animation: float-heart-3 1.8s ease-out infinite;
        }

        .animate-float-random {
          animation: float-random 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};
