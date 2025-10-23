import { useEffect, useState } from "react";

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showSpecialMessage] = useState(Math.random() < 0.33);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 204, 213, 0.95), rgba(204, 153, 255, 0.95), rgba(255, 153, 204, 0.95))'
      }}
    >
      <div className="text-center space-y-6 animate-fade-in">
        <div className="relative">
          <div className="w-28 h-28 mx-auto rounded-3xl bg-white/30 backdrop-blur-md flex items-center justify-center shadow-romantic">
            <span className="text-6xl font-black text-white drop-shadow-lg">T</span>
          </div>
          <div className="absolute -inset-3 bg-white/20 rounded-[2rem] animate-pulse -z-10" />
          <div className="absolute -inset-6 bg-white/10 rounded-[2.5rem] animate-pulse -z-20" style={{ animationDelay: '0.3s' }} />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg tracking-tight">
            TLC & Felicia's Date Night
          </h1>
          {showSpecialMessage ? (
            <p className="text-white text-xl font-medium drop-shadow">
              Felicia is beautiful <span className="inline-block heart-pulse text-rose-200 drop-shadow text-2xl">❤️</span>
            </p>
          ) : (
            <p className="text-white/90 text-lg drop-shadow">Loading your romantic adventure...</p>
          )}
        </div>

        <div className="flex gap-2.5 justify-center">
          <div className="w-3 h-3 rounded-full bg-white/90 animate-bounce shadow-lg" style={{ animationDelay: "0ms" }} />
          <div className="w-3 h-3 rounded-full bg-white/90 animate-bounce shadow-lg" style={{ animationDelay: "150ms" }} />
          <div className="w-3 h-3 rounded-full bg-white/90 animate-bounce shadow-lg" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
};
