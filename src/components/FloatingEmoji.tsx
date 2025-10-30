import { useState, useEffect, useCallback, memo } from "react";
import { FloatingRobotMenu } from "./FloatingRobotMenu";

const FloatingEmojiComponent = () => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - 30,
        y: e.clientY - 30,
      });
    }
  }, [isDragging]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const distance = Math.sqrt(
        Math.pow(e.clientX - dragStart.x, 2) + Math.pow(e.clientY - dragStart.y, 2)
      );
      
      if (distance < 5) {
        setShowMenu(true);
      }
    }
    setIsDragging(false);
  }, [isDragging, dragStart]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setShowMenu(true);
    }
  }, []);

  const handleCloseMenu = useCallback(() => {
    setShowMenu(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="Guardian bot menu - drag to move or click to open"
        className="fixed z-[90] cursor-move select-none transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 rounded-full"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
      >
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl shadow-orange-500/50 animate-pulse border-2 border-white/30">
            <span className="text-2xl" aria-hidden="true">🤖</span>
          </div>
          
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse" aria-hidden="true" />
        </div>
      </div>

      <FloatingRobotMenu
        isOpen={showMenu}
        onClose={handleCloseMenu}
        position={position}
      />
    </>
  );
};

export const FloatingEmoji = memo(FloatingEmojiComponent);
