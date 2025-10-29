import React, { useEffect, useState } from "react";
import { Heart, Sparkles } from "lucide-react";

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    // Show text after a short delay
    const textTimer = setTimeout(() => {
      setTextVisible(true);
    }, 300);

    // Hide everything after ~2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 2000);

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
      {/* Enhanced Gradient Background with multiple layers */}
      <div 
        className="absolute inset-0 animate-fade-in"
        style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(255, 107, 157, 0.95) 0%, rgba(219, 112, 147, 0.85) 25%, rgba(194, 57, 179, 0.9) 50%, rgba(138, 43, 226, 0.95) 75%, rgba(147, 51, 234, 1) 100%)',
          backgroundSize: '150% 150%',
          backgroundPosition: 'center',
          animation: 'gentle-zoom 15s ease-in-out infinite'
        }}
      />
      
      {/* Secondary animated layer */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 70% 60%, rgba(236, 72, 153, 0.6) 0%, transparent 60%)',
          animation: 'gentle-zoom 12s ease-in-out infinite reverse'
        }}
      />
      
      {/* Clay/Frosted Glass Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.6) 0%, rgba(194, 57, 179, 0.7) 50%, rgba(255, 107, 157, 0.6) 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 4s ease infinite',
          backdropFilter: 'blur(10px) saturate(200%)',
          mixBlendMode: 'overlay'
        }}
      />
      
      {/* Shimmer effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s ease-in-out infinite'
        }}
      />
      
      {/* Additional Clay Texture Layer */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.08) 10px, rgba(255,255,255,0.08) 20px)',
          animation: 'texture-shift 8s linear infinite'
        }}
      />

      {/* Enhanced floating sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <Sparkles
            key={`sparkle-${i}`}
            className="absolute text-white/40 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${15 + Math.random() * 35}px`,
              height: `${15 + Math.random() * 35}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              filter: `blur(${Math.random() * 2}px)`,
            }}
          />
        ))}
      </div>

      {/* Enhanced floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Heart
            key={`heart-${i}`}
            className="absolute text-rose-200/50 animate-bounce"
            fill="currentColor"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1.5 + Math.random() * 2}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      {/* Enhanced animated text with particles */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-30 transition-all duration-1000 pointer-events-none ${
          textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Multiple layered glows */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className={`w-[600px] h-[600px] rounded-full bg-gradient-to-r from-pink-400/50 via-purple-400/50 to-rose-400/50 blur-3xl transition-all duration-1000 ${
            textVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`} 
          style={{ animation: 'gentle-zoom 4s ease-in-out infinite' }}
          />
          <div className={`absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-400/40 to-fuchsia-400/40 blur-2xl transition-all duration-1200 ${
            textVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
          style={{ animation: 'gentle-zoom 5s ease-in-out infinite reverse' }}
          />
        </div>

        {/* Sparkle particles around text */}
        {textVisible && (
          <>
            {[...Array(30)].map((_, i) => (
              <Sparkles
                key={`sparkle-text-${i}`}
                className="absolute text-white/70"
                style={{
                  width: `${Math.random() * 14 + 10}px`,
                  height: `${Math.random() * 14 + 10}px`,
                  left: `${38 + Math.random() * 24}%`,
                  top: `${38 + Math.random() * 24}%`,
                  animation: `float ${Math.random() * 3 + 3}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                  filter: `blur(${Math.random() * 2}px)`,
                }}
              />
            ))}
          </>
        )}
        
        {/* Text with enhanced styling */}
        <div className="relative z-10 text-center px-4">
          <h1
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black relative leading-tight pb-6"
            style={{
              background: 'linear-gradient(135deg, #ec4899, #a855f7, #f472b6, #c084fc, #ec4899)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'wave-color 4s ease-in-out infinite',
              textShadow: '0 0 60px rgba(236, 72, 153, 0.6)',
              filter: 'drop-shadow(0 6px 30px rgba(168, 85, 247, 0.5))',
            }}
          >
            Hello gorgeous
          </h1>
          
          {/* Subtitle */}
          <p 
            className="text-lg md:text-2xl font-bold mt-4 animate-pulse"
            style={{
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradient-shift 3s ease-in-out infinite',
              filter: 'drop-shadow(0 2px 10px rgba(251, 191, 36, 0.6))',
            }}
          >
            exploring a new city together. one date at a time ✨
          </p>
        </div>
      </div>

      <style>{`
        :root {
          --wave-color-0: #FF69B4;
          --wave-color-1: #FF1493;
          --wave-color-2: #DA70D6;
          --wave-color-3: #BA55D3;
          --wave-color-4: #9370DB;
          --wave-color-5: #8A2BE2;
          --wave-color-6: #FF69B4;
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes gentle-zoom {
          0%, 100% { 
            transform: scale(1); 
          }
          50% { 
            transform: scale(1.08); 
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
            transform: perspective(1000px) rotateX(5deg) translateY(-15px);
          }
        }
        
        @keyframes wave-color {
          0%, 100% {
            filter: brightness(1.3) saturate(1.4) drop-shadow(0 0 20px currentColor) hue-rotate(0deg);
            transform: translateY(0) scale(1);
          }
          25% {
            filter: brightness(1.5) saturate(1.6) drop-shadow(0 0 25px currentColor) hue-rotate(30deg);
            transform: translateY(-8px) scale(1.05);
          }
          50% {
            filter: brightness(1.3) saturate(1.4) drop-shadow(0 0 20px currentColor) hue-rotate(60deg);
            transform: translateY(0) scale(1);
          }
          75% {
            filter: brightness(1.5) saturate(1.6) drop-shadow(0 0 25px currentColor) hue-rotate(90deg);
            transform: translateY(-8px) scale(1.05);
          }
        }
        
        .wave-letter {
          animation: wave-color 3s ease-in-out infinite;
        }

        /* Performance & A11y: Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </div>
  );
};
