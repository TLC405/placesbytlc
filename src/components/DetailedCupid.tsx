import { useEffect, useState } from "react";
import cupidImage from "@/assets/cupid-tlc-transparent.png";

export const DetailedCupid = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show cupid after 3 seconds
  useEffect(() => {
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
  }, []);

  const handleTap = () => {
    const hideUntil = Date.now() + 10000;
    localStorage.setItem('cupid_hidden_until', hideUntil.toString());
    setIsVisible(false);
    
    setTimeout(() => {
      localStorage.removeItem('cupid_hidden_until');
      setIsVisible(true);
    }, 10000);
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes tlc-float {
          0%   { transform: translate3d(0, 0, 0) rotate(0deg); }
          50%  { transform: translate3d(0, -8px, 0) rotate(-2deg); }
          100% { transform: translate3d(0, 0, 0) rotate(0deg); }
        }
        
        .cupid-float {
          position: fixed;
          right: 1rem;
          bottom: 7rem;
          width: 120px;
          height: auto;
          user-select: none;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          will-change: transform, filter;
          animation: tlc-float 3.2s ease-in-out infinite;
          filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.25));
          cursor: pointer;
          z-index: 50;
          image-rendering: auto;
          -webkit-user-drag: none;
          transition: opacity 0.3s ease-out;
        }
        
        .cupid-float:hover {
          filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.35));
        }
        
        @media (max-width: 420px) {
          .cupid-float {
            width: 92px;
            bottom: 6rem;
            right: 0.75rem;
          }
        }
        
        /* Kill any mystery dots or markers */
        ul, li {
          list-style: none;
        }
        
        .fab, .badge, .dot, .handle, .resize-handle, 
        .drag-handle, .audio-toggle, .music-dot, .scroll-dot {
          display: none !important;
        }
      `}</style>
      
      <img
        src={cupidImage}
        alt="Cupid"
        className="cupid-float"
        onClick={handleTap}
        draggable={false}
      />
    </>
  );
};
