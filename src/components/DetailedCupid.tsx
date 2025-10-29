import { useEffect, useState, useRef } from "react";
import cupidImageOriginal from "@/assets/cupid-icon-original.png";
import { removeBackground, loadImage } from "@/lib/backgroundRemoval";
import { supabase } from "@/integrations/supabase/client";

export const DetailedCupid = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cupidImage, setCupidImage] = useState<string>(cupidImageOriginal);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isEnabled, setIsEnabled] = useState(true);
  const [position, setPosition] = useState({ top: '1.5rem', right: '1.5rem', left: 'auto', bottom: 'auto' });
  const [isRunning, setIsRunning] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [isDodging, setIsDodging] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cupidRef = useRef<HTMLImageElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

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

  // Initialize Audio Context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Play fun water drop sound effect
  const playPopSound = () => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Water drop effect: quick descending frequency
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
    
    // Volume envelope
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    oscillator.type = 'sine';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  };

  // Track mouse position for evasive behavior
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Evasive behavior - dodge when mouse gets close
  useEffect(() => {
    if (!isVisible || !cupidRef.current || isDodging) return;

    const checkDistance = () => {
      const rect = cupidRef.current?.getBoundingClientRect();
      if (!rect) return;

      const cupidCenterX = rect.left + rect.width / 2;
      const cupidCenterY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(mousePos.x - cupidCenterX, 2) + 
        Math.pow(mousePos.y - cupidCenterY, 2)
      );

      // If mouse within 150px, dodge!
      if (distance < 150 && Math.random() > 0.3) {
        setIsDodging(true);
        
        // Quick dodge to random position
        const positions = [
          { top: '1.5rem', right: '1.5rem', left: 'auto', bottom: 'auto' },
          { top: 'auto', right: '1.5rem', left: 'auto', bottom: '1.5rem' },
          { top: '1.5rem', right: 'auto', left: '1.5rem', bottom: 'auto' },
          { top: 'auto', right: 'auto', left: '1.5rem', bottom: '1.5rem' },
          { top: '50%', right: '1.5rem', left: 'auto', bottom: 'auto' },
          { top: '50%', right: 'auto', left: '1.5rem', bottom: 'auto' },
        ];
        
        const randomPos = positions[Math.floor(Math.random() * positions.length)];
        setPosition(randomPos);
        
        setTimeout(() => setIsDodging(false), 800);
      }
    };

    const interval = setInterval(checkDistance, 100);
    return () => clearInterval(interval);
  }, [isVisible, mousePos, isDodging]);

  // Make Cupid do various actions: hop, run, peek
  useEffect(() => {
    if (!isVisible) return;

    const positions = [
      { top: '1.5rem', right: '1.5rem', left: 'auto', bottom: 'auto' },
      { top: 'auto', right: '1.5rem', left: 'auto', bottom: '1.5rem' },
      { top: '1.5rem', right: 'auto', left: '1.5rem', bottom: 'auto' },
      { top: 'auto', right: 'auto', left: '1.5rem', bottom: '1.5rem' },
      { top: '50%', right: '1.5rem', left: 'auto', bottom: 'auto' },
      { top: '50%', right: 'auto', left: '1.5rem', bottom: 'auto' },
    ];

    const performAction = () => {
      const action = Math.random();
      
      if (action < 0.3) {
        // Peek out from edge
        setIsPeeking(true);
        const peekPositions = [
          { top: '50%', right: '-40px', left: 'auto', bottom: 'auto' },
          { top: '50%', right: 'auto', left: '-40px', bottom: 'auto' },
          { top: '-40px', right: 'auto', left: '50%', bottom: 'auto' },
          { top: 'auto', right: 'auto', left: '50%', bottom: '-40px' },
        ];
        setPosition(peekPositions[Math.floor(Math.random() * peekPositions.length)]);
        
        setTimeout(() => {
          setIsPeeking(false);
          setPosition(positions[Math.floor(Math.random() * positions.length)]);
        }, 2000);
        
      } else if (action < 0.6) {
        // Run across screen
        setIsRunning(true);
        const startSide = Math.random() > 0.5 ? 'left' : 'right';
        const yPos = Math.random() > 0.5 ? '20%' : '70%';
        
        if (startSide === 'left') {
          setPosition({ top: yPos, right: 'auto', left: '-100px', bottom: 'auto' });
          setTimeout(() => {
            setPosition({ top: yPos, right: '-100px', left: 'auto', bottom: 'auto' });
          }, 50);
        } else {
          setPosition({ top: yPos, right: '-100px', left: 'auto', bottom: 'auto' });
          setTimeout(() => {
            setPosition({ top: yPos, right: 'auto', left: '-100px', bottom: 'auto' });
          }, 50);
        }
        
        setTimeout(() => {
          setIsRunning(false);
          setPosition(positions[Math.floor(Math.random() * positions.length)]);
        }, 1500);
        
      } else {
        // Normal hop
        const randomPos = positions[Math.floor(Math.random() * positions.length)];
        setPosition(randomPos);
      }
    };

    const actionInterval = setInterval(performAction, 5000);
    return () => clearInterval(actionInterval);
  }, [isVisible]);

  const handleTap = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Only catch if not dodging or running
    if (isDodging || isRunning) {
      // Play miss sound
      if (audioContextRef.current) {
        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 100;
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
      return;
    }
    
    // Success! Play pop sound
    playPopSound();
    
    const hideUntil = Date.now() + 8000;
    localStorage.setItem('cupid_hidden_until', hideUntil.toString());
    setIsVisible(false);
    
    setTimeout(() => {
      localStorage.removeItem('cupid_hidden_until');
      setIsVisible(true);
    }, 8000);
  };

  if (!isVisible || !isEnabled) return null;

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
          width: 80px;
          height: auto;
          user-select: none;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          will-change: transform, filter, top, right, left, bottom;
          animation: tlc-float 3.2s ease-in-out infinite;
          filter: drop-shadow(0 8px 18px rgba(255, 106, 162, 0.3));
          cursor: pointer;
          z-index: 50;
          image-rendering: auto;
          -webkit-user-drag: none;
          transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .cupid-float.running {
          transition: all 0.8s linear !important;
          animation: none;
          transform: scale(1.1);
        }
        
        .cupid-float.peeking {
          animation: peek 2s ease-in-out;
          transform: scale(0.9);
        }
        
        .cupid-float.dodging {
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
          transform: scale(0.8) rotate(15deg);
        }
        
        @keyframes peek {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(20px); }
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
        ref={cupidRef}
        src={cupidImage}
        alt="Cupid"
        className={`cupid-float ${isRunning ? 'running' : ''} ${isPeeking ? 'peeking' : ''} ${isDodging ? 'dodging' : ''}`}
        style={position}
        onClick={handleTap}
        onMouseEnter={() => {
          // Extra evasive on hover
          if (Math.random() > 0.5 && !isDodging) {
            const quickDodge = new MouseEvent('mousemove', {
              clientX: mousePos.x + 200,
              clientY: mousePos.y + 200
            });
            window.dispatchEvent(quickDodge);
          }
        }}
        draggable={false}
      />
    </>
  );
};
