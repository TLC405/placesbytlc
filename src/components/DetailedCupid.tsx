import { useEffect, useState } from "react";
import cupidImageOriginal from "@/assets/cupid-icon-original.png";
import { removeBackground, loadImage } from "@/lib/backgroundRemoval";

export const DetailedCupid = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cupidImage, setCupidImage] = useState<string>(cupidImageOriginal);
  const [isProcessing, setIsProcessing] = useState(true);

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

  // Show cupid after processing and 3 seconds
  useEffect(() => {
    if (isProcessing) return;
    
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
  }, [isProcessing]);

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
          right: 1.5rem;
          top: 1.5rem;
          width: 80px;
          height: auto;
          user-select: none;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          will-change: transform, filter;
          animation: tlc-float 3.2s ease-in-out infinite;
          filter: drop-shadow(0 8px 18px rgba(255, 106, 162, 0.3));
          cursor: pointer;
          z-index: 50;
          image-rendering: auto;
          -webkit-user-drag: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .cupid-float:hover {
          filter: drop-shadow(0 0 40px rgba(255, 106, 162, 0.5)) drop-shadow(0 8px 20px rgba(0, 0, 0, 0.25));
          transform: scale(1.05);
        }
        
        .cupid-float:active {
          transform: scale(0.95);
        }
        
        @media (max-width: 420px) {
          .cupid-float {
            width: 60px;
            top: 1rem;
            right: 1rem;
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
