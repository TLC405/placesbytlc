import { useState, useEffect } from "react";
import { Shield, Zap, Crown } from "lucide-react";

export const FloatingEmoji = () => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - 30,
        y: e.clientY - 30,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div
      className="fixed z-[90] cursor-move select-none transition-transform hover:scale-110"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl shadow-orange-500/50 animate-pulse border-2 border-white/30">
          <span className="text-2xl">🤖</span>
        </div>
        
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg whitespace-nowrap animate-fade-in">
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3" />
              <span>Guardian Bot • PIN Protected</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-yellow-400">
              <Zap className="w-3 h-3" />
              <span>Drag me anywhere!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
