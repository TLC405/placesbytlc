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
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-indigo-600 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="text-center space-y-6 animate-fade-in">
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-5xl font-black text-white">T</span>
          </div>
          <div className="absolute -inset-2 bg-white/20 rounded-3xl animate-pulse -z-10" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white">TLC Date Night</h1>
          {showSpecialMessage ? (
            <p className="text-white/90 text-lg animate-pulse">
              Felicia is beautiful <span className="inline-block animate-pulse text-rose-300">❤️</span>
            </p>
          ) : (
            <p className="text-white/80">Loading your perfect date...</p>
          )}
        </div>

        <div className="flex gap-2 justify-center">
          <div className="w-2 h-2 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
};
