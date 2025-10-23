import { useEffect, useState } from "react";
import cupidImageOriginal from "@/assets/cupid-icon-original.png";
import { removeBackground, loadImage } from "@/lib/backgroundRemoval";
import { supabase } from "@/integrations/supabase/client";

export const DetailedCupid = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cupidImage, setCupidImage] = useState<string>(cupidImageOriginal);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isEnabled, setIsEnabled] = useState(true);
  const [position, setPosition] = useState({ top: '1.5rem', right: '1.5rem', left: 'auto', bottom: 'auto' });

  // Process image to remove background
  useEffect(() => {
    const processImage = async () => {
      try {
        const img = await loadImage(cupidImageOriginal);
        const processedImage = await removeBackground(img);
        setCupidImage(processedImage);
        setIsProcessing(false);
      } catch (error) {
        console.error('Failed to process cupid image:', error);
        // Fallback to original if processing fails
        setIsProcessing(false);
      }
    };
    processImage();
  }, []);

  // Check if Cupid is enabled from database
  useEffect(() => {
    const checkEnabled = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'cupid_visible')
        .single();
      
      const settingValue = data?.setting_value as { enabled?: boolean } | null;
      setIsEnabled(settingValue?.enabled ?? true);
    };
    
    checkEnabled();
    
    // Subscribe to changes
    const channel = supabase
      .channel('app_settings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'app_settings', filter: 'setting_key=eq.cupid_visible' },
        (payload) => {
          const newValue = (payload.new as any)?.setting_value as { enabled?: boolean } | null;
          setIsEnabled(newValue?.enabled ?? true);
        }
      )
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Show cupid after processing and 3 seconds
  useEffect(() => {
    if (isProcessing || !isEnabled) return;
    
    // Check if permanently hidden
    const permanentlyHidden = localStorage.getItem('cupid_permanently_hidden');
    if (permanentlyHidden === 'true') {
      setIsVisible(false);
      return;
    }
    
    const checkHidden = localStorage.getItem('cupid_hidden_until');
    if (checkHidden) {
      const hideUntil = parseInt(checkHidden);
      if (Date.now() < hideUntil) {
        setIsVisible(false);
        const remaining = hideUntil - Date.now();
        setTimeout(() => {
          localStorage.removeItem('cupid_hidden_until');
          setIsVisible(true);
        }, remaining);
      } else {
        localStorage.removeItem('cupid_hidden_until');
        setTimeout(() => setIsVisible(true), 3000);
      }
    } else {
      setTimeout(() => setIsVisible(true), 3000);
    }
  }, [isProcessing, isEnabled]);

  // Make Cupid hop around the screen
  useEffect(() => {
    if (!isVisible) return;

    const positions = [
      { top: '1.5rem', right: '1.5rem', left: 'auto', bottom: 'auto' }, // top right
      { top: 'auto', right: '1.5rem', left: 'auto', bottom: '1.5rem' }, // bottom right
      { top: '1.5rem', right: 'auto', left: '1.5rem', bottom: 'auto' }, // top left
      { top: 'auto', right: 'auto', left: '1.5rem', bottom: '1.5rem' }, // bottom left
      { top: '50%', right: '1.5rem', left: 'auto', bottom: 'auto' }, // middle right
      { top: '50%', right: 'auto', left: '1.5rem', bottom: 'auto' }, // middle left
    ];

    const hopInterval = setInterval(() => {
      const randomPos = positions[Math.floor(Math.random() * positions.length)];
      setPosition(randomPos);
    }, 8000); // Hop every 8 seconds

    return () => clearInterval(hopInterval);
  }, [isVisible]);

  const handleTap = () => {
    const hideUntil = Date.now() + 10000;
    localStorage.setItem('cupid_hidden_until', hideUntil.toString());
    setIsVisible(false);
    
    setTimeout(() => {
      localStorage.removeItem('cupid_hidden_until');
      setIsVisible(true);
    }, 10000);
  };

  const handleHold = () => {
    localStorage.setItem('cupid_permanently_hidden', 'true');
    setIsVisible(false);
  };

  // Touch/hold detection
  let holdTimeout: NodeJS.Timeout;
  const handleTouchStart = () => {
    holdTimeout = setTimeout(() => {
      handleHold();
    }, 800); // 800ms hold to permanently dismiss
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    clearTimeout(holdTimeout);
  };

  const handleMouseDown = () => {
    holdTimeout = setTimeout(() => {
      handleHold();
    }, 800);
  };

  const handleMouseUp = () => {
    clearTimeout(holdTimeout);
  };

  if (!isVisible || !isEnabled) return null;

  return (
    <>
      <style>{`
        @keyframes tlc-walk {
          0%   { transform: translate3d(0, 0, 0) rotate(-3deg) scaleX(1); }
          25%  { transform: translate3d(-5px, -8px, 0) rotate(2deg) scaleX(1.02); }
          50%  { transform: translate3d(0, -12px, 0) rotate(-2deg) scaleX(0.98); }
          75%  { transform: translate3d(5px, -8px, 0) rotate(3deg) scaleX(1.02); }
          100% { transform: translate3d(0, 0, 0) rotate(-3deg) scaleX(1); }
        }
        
        @keyframes bubble-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.02); }
        }
        
        .cupid-float {
          position: fixed;
          width: 80px;
          height: auto;
          user-select: none;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          will-change: transform, filter, top, right, left, bottom;
          animation: tlc-walk 1.8s ease-in-out infinite;
          filter: drop-shadow(0 8px 18px rgba(255, 106, 162, 0.3));
          cursor: grab;
          z-index: 50;
          image-rendering: auto;
          -webkit-user-drag: none;
          transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .cupid-float:hover {
          filter: drop-shadow(0 0 40px rgba(255, 106, 162, 0.5)) drop-shadow(0 8px 20px rgba(0, 0, 0, 0.25));
          transform: scale(1.05);
        }
        
        .cupid-float:active {
          cursor: grabbing;
          transform: scale(0.95);
        }
        
        .cupid-chat-bubble {
          position: fixed;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 240, 245, 0.98));
          border: 2px solid rgba(255, 106, 162, 0.6);
          border-radius: 18px;
          padding: 12px 16px;
          font-size: 13px;
          font-weight: 600;
          color: #333;
          max-width: 220px;
          box-shadow: 0 8px 24px rgba(255, 106, 162, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1);
          pointer-events: none;
          z-index: 51;
          animation: bubble-bounce 2s ease-in-out infinite;
          line-height: 1.4;
        }
        
        .cupid-chat-bubble::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid rgba(255, 106, 162, 0.6);
        }
        
        @media (max-width: 420px) {
          .cupid-float {
            width: 60px;
          }
          .cupid-chat-bubble {
            font-size: 11px;
            max-width: 180px;
            padding: 10px 12px;
          }
        }
      `}</style>
      
      {/* Chat Bubble */}
      <div 
        className="cupid-chat-bubble"
        style={{
          top: position.top === 'auto' ? 'auto' : `calc(${position.top} - 80px)`,
          bottom: position.bottom === 'auto' ? 'auto' : `calc(${position.bottom} + 100px)`,
          left: position.left === 'auto' ? (position.right === 'auto' ? '50%' : 'auto') : position.left,
          right: position.right === 'auto' ? 'auto' : position.right,
          transform: position.left === 'auto' && position.right === 'auto' ? 'translateX(-50%)' : 'none',
        }}
      >
        Click me to hide. Hold me to leave forever. 💔
      </div>

      <img
        src={cupidImage}
        alt="Cupid"
        className="cupid-float"
        style={position}
        onClick={handleTap}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        draggable={false}
      />
    </>
  );
};
