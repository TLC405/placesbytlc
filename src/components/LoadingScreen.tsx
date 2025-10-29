import { useEffect, useState } from "react";
import { Heart, Sparkles } from "lucide-react";
import feliciaPhoto from "@/assets/felicia-photo.jpg";

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    // Show text after a short delay
    const textTimer = setTimeout(() => {
      setTextVisible(true);
    }, 300);

    // Hide everything after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 5000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-700 overflow-hidden ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Background Image with Clay Filter Effect */}
      <div 
        className="absolute inset-0 animate-fade-in"
        style={{
          backgroundImage: `url(${feliciaPhoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'saturate(1.4) contrast(1.1) brightness(0.85)',
          animation: 'gentle-zoom 20s ease-in-out infinite'
        }}
      />
      
      {/* Clay/Frosted Glass Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.7) 0%, rgba(194, 57, 179, 0.8) 50%, rgba(255, 107, 157, 0.7) 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 3s ease infinite',
          backdropFilter: 'blur(8px) saturate(180%)',
          mixBlendMode: 'multiply'
        }}
      />
      
      {/* Additional Clay Texture Layer */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)',
          animation: 'texture-shift 8s linear infinite'
        }}
      />
      {/* Floating sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-white/30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-rose-300/40 animate-bounce"
            fill="currentColor"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${25 + Math.random() * 30}px`,
              height: `${25 + Math.random() * 30}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1.5 + Math.random() * 1.5}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8 px-6 max-w-4xl">
        {/* Epic Message */}
        <div 
          className={`transition-all duration-1000 transform ${
            textVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
          }`}
        >
          <div className="space-y-6">
            {/* Main Message */}
            <div className="relative inline-block">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
                <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
                  WELL HELLO
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
                  YOU&apos;RE LOOKING
                </div>
                <div className="relative inline-block">
                  <div className="animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}>
                    ABSOLUTELY
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 blur-2xl opacity-50 animate-pulse" />
                </div>
                <div className="relative inline-block">
                  <div 
                    className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-fade-in"
                    style={{ 
                      animationDelay: '0.7s', 
                      animationFillMode: 'backwards',
                      textShadow: '0 0 30px rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    STUNNING
                  </div>
                  <div className="absolute -inset-6 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 blur-3xl opacity-60 animate-pulse" />
                </div>
                <div 
                  className="animate-fade-in text-5xl sm:text-6xl md:text-7xl lg:text-8xl" 
                  style={{ animationDelay: '0.9s', animationFillMode: 'backwards' }}
                >
                  TODAY
                </div>
              </h1>

              {/* Glow effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse -z-10" />
            </div>

            {/* Felicia message with 3D clay effect */}
            <div 
              className="text-white text-5xl md:text-6xl lg:text-7xl font-black animate-fade-in relative"
              style={{ 
                animationDelay: '1.2s', 
                animationFillMode: 'backwards',
                textShadow: `
                  3px 3px 0px rgba(255, 182, 193, 0.4),
                  6px 6px 0px rgba(255, 105, 180, 0.3),
                  9px 9px 0px rgba(219, 112, 147, 0.2),
                  12px 12px 20px rgba(0, 0, 0, 0.3),
                  0 0 40px rgba(255, 192, 203, 0.5)
                `,
                transform: 'perspective(1000px) rotateX(5deg)',
                animation: 'float 3s ease-in-out infinite, fade-in 0.6s ease-out backwards 1.2s'
              }}
            >
              <span 
                className="relative inline-block"
                style={{
                  background: 'linear-gradient(145deg, #FFE4E1, #FFC0CB, #FFB6C1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'brightness(1.2) saturate(1.3)'
                }}
              >
                Felicia
              </span>
              <span 
                className="ml-2 inline-block animate-pulse"
                style={{
                  color: '#FFE4E1',
                  textShadow: '0 0 20px rgba(255, 192, 203, 0.8), 0 0 40px rgba(255, 182, 193, 0.6)'
                }}
              >
                *
              </span>
              <div className="absolute -inset-8 bg-gradient-to-r from-rose-300 via-pink-300 to-rose-300 blur-3xl opacity-50 animate-pulse -z-10" />
            </div>

            {/* Subtitle */}
            <p 
              className="text-white/90 text-lg md:text-xl font-medium drop-shadow-lg animate-fade-in"
              style={{ animationDelay: '1.5s', animationFillMode: 'backwards' }}
            >
              Preparing your perfect date night... ✨
            </p>
          </div>
        </div>

        {/* Animated loading dots */}
        <div 
          className="flex gap-3 justify-center animate-fade-in"
          style={{ animationDelay: '1.5s', animationFillMode: 'backwards' }}
        >
          <div className="w-4 h-4 rounded-full bg-white shadow-lg shadow-white/50 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-4 h-4 rounded-full bg-white shadow-lg shadow-white/50 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-4 h-4 rounded-full bg-white shadow-lg shadow-white/50 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>

      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes gentle-zoom {
          0%, 100% { 
            transform: scale(1); 
          }
          50% { 
            transform: scale(1.05); 
          }
        }
        
        @keyframes texture-shift {
          0% { 
            transform: translateX(0) translateY(0); 
          }
          100% { 
            transform: translateX(20px) translateY(20px); 
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: perspective(1000px) rotateX(5deg) translateY(0px);
          }
          50% {
            transform: perspective(1000px) rotateX(5deg) translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};
