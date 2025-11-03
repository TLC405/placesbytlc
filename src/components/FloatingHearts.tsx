import { useEffect, useState, useMemo, memo } from "react";
import { Heart } from "lucide-react";

interface FloatingElement {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  type: 'mushroom' | 'leaf' | 'sprout' | 'sparkle';
}

const FloatingHeartsComponent = () => {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const types: Array<'mushroom' | 'leaf' | 'sprout' | 'sparkle'> = ['mushroom', 'leaf', 'sprout', 'sparkle'];
    const newElements: FloatingElement[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 15,
      size: 20 + Math.random() * 30,
      opacity: 0.08 + Math.random() * 0.12,
      type: types[Math.floor(Math.random() * types.length)],
    }));
    setElements(newElements);
  }, []);

  const renderElement = (element: FloatingElement) => {
    const style = {
      left: `${element.left}%`,
      bottom: '-80px',
      width: `${element.size}px`,
      height: `${element.size}px`,
      opacity: element.opacity,
      animationDelay: `${element.delay}s`,
      animationDuration: `${element.duration}s`,
    };

    switch (element.type) {
      case 'mushroom':
        return (
          <div
            key={element.id}
            className="absolute animate-float-up text-shroomBrown flex items-center justify-center"
            style={{ ...style, fontSize: `${element.size * 0.9}px` }}
          >
            🍄
          </div>
        );
      case 'leaf':
        return (
          <div
            key={element.id}
            className="absolute animate-float-up text-shroomGreen flex items-center justify-center"
            style={{ ...style, fontSize: `${element.size * 0.8}px` }}
          >
            🌿
          </div>
        );
      case 'sprout':
        return (
          <div
            key={element.id}
            className="absolute animate-float-up text-shroomGreen font-bold flex items-center justify-center"
            style={{ ...style, fontSize: `${element.size * 0.8}px` }}
          >
            🌱
          </div>
        );
      case 'sparkle':
        return (
          <div
            key={element.id}
            className="absolute animate-float-up text-shroomYellow flex items-center justify-center"
            style={{ ...style, fontSize: `${element.size * 0.9}px` }}
          >
            ✨
          </div>
        );
    }
  };

  const styleBlock = useMemo(() => `
    @keyframes float-up {
      0% {
        transform: translateY(0) rotate(0deg) scale(0.8);
        opacity: 0;
      }
      10% {
        opacity: var(--element-opacity);
        transform: translateY(-10vh) rotate(45deg) scale(1);
      }
      50% {
        transform: translateY(-50vh) rotate(180deg) scale(1.1);
      }
      90% {
        opacity: var(--element-opacity);
      }
      100% {
        transform: translateY(-110vh) rotate(360deg) scale(0.8);
        opacity: 0;
      }
    }
    
    .animate-float-up {
      animation: float-up linear infinite;
      --element-opacity: 0.15;
      will-change: transform;
    }
  `, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {elements.map((element) => renderElement(element))}
      <style>{styleBlock}</style>
    </div>
  );
};

export const FloatingHearts = memo(FloatingHeartsComponent);