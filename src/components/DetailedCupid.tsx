import { useEffect, useState, useRef, useCallback } from "react";
import cupidImageOriginal from "@/assets/cupid-icon-original.png";
import { supabase } from "@/integrations/supabase/client";

export const DetailedCupid = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isPopped, setIsPopped] = useState(false);
  const [position, setPosition] = useState({ top: '1.5rem', right: '1.5rem', left: 'auto', bottom: 'auto' });
  const [isRunning, setIsRunning] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [isDodging, setIsDodging] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [transparentSrc, setTransparentSrc] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    speed: 5000, dodgeDistance: 150, size: 80, hideTime: 8000,
    floatAnimation: true, evasiveness: 0.7, soundEnabled: true,
    actionFrequency: 5000, transparency: 1, shadowIntensity: 0.3
  });
  const cupidRef = useRef<HTMLImageElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Canvas-based background removal
  const removeBackground = useCallback((imgSrc: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Sample corners to detect background color
      const corners = [
        0, // top-left
        (canvas.width - 1) * 4, // top-right
        (canvas.height - 1) * canvas.width * 4, // bottom-left
        ((canvas.height - 1) * canvas.width + (canvas.width - 1)) * 4, // bottom-right
      ];

      let bgR = 0, bgG = 0, bgB = 0;
      corners.forEach(i => { bgR += data[i]; bgG += data[i + 1]; bgB += data[i + 2]; });
      bgR /= 4; bgG /= 4; bgB /= 4;

      const threshold = 60;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
        
        if (dist < threshold) {
          data[i + 3] = 0; // fully transparent
        } else if (dist < threshold + 30) {
          // Feathered edge
          data[i + 3] = Math.round(((dist - threshold) / 30) * 255);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setTransparentSrc(canvas.toDataURL("image/png"));
    };
    img.src = imgSrc;
  }, []);

  useEffect(() => {
    removeBackground(cupidImageOriginal);
  }, [removeBackground]);

  // Load settings from database
  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await supabase.from('app_settings').select('setting_value').eq('setting_key', 'cupid_visible').single();
      const settingValue = data?.setting_value as any;
      setIsEnabled(settingValue?.enabled ?? true);
      if (settingValue?.settings) setSettings(prev => ({ ...prev, ...settingValue.settings }));
    };
    loadSettings();

    const popped = localStorage.getItem('cupid_popped');
    if (popped === 'true') {
      setIsPopped(true);
      setIsVisible(true);
      setPosition({ top: '1.5rem', right: '1.5rem', left: 'auto', bottom: 'auto' });
    }

    const channel = supabase
      .channel('app_settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_settings', filter: 'setting_key=eq.cupid_visible' },
        (payload) => {
          const newValue = (payload.new as any)?.setting_value;
          setIsEnabled(newValue?.enabled ?? true);
          if (newValue?.settings) setSettings(prev => ({ ...prev, ...newValue.settings }));
        }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (!isEnabled || isPopped) return;
    const checkHidden = localStorage.getItem('cupid_hidden_until');
    if (checkHidden) {
      const hideUntil = parseInt(checkHidden);
      if (Date.now() < hideUntil) {
        setIsVisible(false);
        setTimeout(() => { localStorage.removeItem('cupid_hidden_until'); setIsVisible(true); }, hideUntil - Date.now());
      } else {
        localStorage.removeItem('cupid_hidden_until');
        setTimeout(() => setIsVisible(true), 3000);
      }
    } else {
      setTimeout(() => setIsVisible(true), 3000);
    }
  }, [isEnabled, isPopped]);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => { audioContextRef.current?.close(); };
  }, []);

  const playPopSound = () => {
    if (!audioContextRef.current || !settings.soundEnabled) return;
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.type = 'sine'; osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const positions = [
    { top: '1.5rem', right: '1.5rem', left: 'auto', bottom: 'auto' },
    { top: 'auto', right: '1.5rem', left: 'auto', bottom: '1.5rem' },
    { top: '1.5rem', right: 'auto', left: '1.5rem', bottom: 'auto' },
    { top: 'auto', right: 'auto', left: '1.5rem', bottom: '1.5rem' },
    { top: '50%', right: '1.5rem', left: 'auto', bottom: 'auto' },
    { top: '50%', right: 'auto', left: '1.5rem', bottom: 'auto' },
  ];

  useEffect(() => {
    if (!isVisible || !cupidRef.current || isDodging || isPopped) return;
    const checkDistance = () => {
      const rect = cupidRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      const dist = Math.sqrt((mousePos.x - cx) ** 2 + (mousePos.y - cy) ** 2);
      if (dist < settings.dodgeDistance && Math.random() > (1 - settings.evasiveness)) {
        setIsDodging(true);
        setPosition(positions[Math.floor(Math.random() * positions.length)]);
        setTimeout(() => setIsDodging(false), 800);
      }
    };
    const interval = setInterval(checkDistance, 100);
    return () => clearInterval(interval);
  }, [isVisible, mousePos, isDodging]);

  useEffect(() => {
    if (!isVisible || isPopped) return;
    const performAction = () => {
      const action = Math.random();
      if (action < 0.3) {
        setIsPeeking(true);
        const peekPositions = [
          { top: '50%', right: '-40px', left: 'auto', bottom: 'auto' },
          { top: '50%', right: 'auto', left: '-40px', bottom: 'auto' },
        ];
        setPosition(peekPositions[Math.floor(Math.random() * peekPositions.length)]);
        setTimeout(() => { setIsPeeking(false); setPosition(positions[Math.floor(Math.random() * positions.length)]); }, 2000);
      } else if (action < 0.6) {
        setIsRunning(true);
        const yPos = Math.random() > 0.5 ? '20%' : '70%';
        setPosition({ top: yPos, right: 'auto', left: '-100px', bottom: 'auto' });
        setTimeout(() => setPosition({ top: yPos, right: '-100px', left: 'auto', bottom: 'auto' }), 50);
        setTimeout(() => { setIsRunning(false); setPosition(positions[Math.floor(Math.random() * positions.length)]); }, 1500);
      } else {
        setPosition(positions[Math.floor(Math.random() * positions.length)]);
      }
    };
    const interval = setInterval(performAction, settings.actionFrequency);
    return () => clearInterval(interval);
  }, [isVisible, isPopped, settings.actionFrequency]);

  const handleTap = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isPopped) return;
    if (isDodging || isRunning) return;
    playPopSound();
    setIsPopped(true);
    localStorage.setItem('cupid_popped', 'true');
    setPosition({ top: '1.5rem', right: '1.5rem', left: 'auto', bottom: 'auto' });
    if (settings.hideTime > 0) {
      setTimeout(() => { localStorage.removeItem('cupid_popped'); setIsPopped(false); }, settings.hideTime);
    }
  };

  if (!isVisible || !isEnabled) return null;

  const imgSrc = transparentSrc || cupidImageOriginal;

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
          width: ${settings.size}px;
          height: auto;
          user-select: none;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          will-change: transform, filter, top, right, left, bottom;
          animation: ${settings.floatAnimation ? 'tlc-float 3.2s ease-in-out infinite' : 'none'};
          filter: drop-shadow(0 8px 18px rgba(255, 106, 162, ${settings.shadowIntensity}));
          cursor: pointer;
          z-index: 50;
          image-rendering: auto;
          -webkit-user-drag: none;
          transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: ${settings.transparency};
          background: transparent;
        }
        .cupid-float.popped {
          width: 40px !important;
          animation: none !important;
          filter: grayscale(0.3) drop-shadow(0 2px 8px rgba(255, 106, 162, 0.2));
          transform: rotate(-90deg) scale(0.8);
          cursor: default;
          opacity: 0.7;
        }
        .cupid-float.running { transition: all 0.8s linear !important; animation: none; transform: scale(1.1); }
        .cupid-float.peeking { animation: peek 2s ease-in-out; transform: scale(0.9); }
        .cupid-float.dodging { transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important; transform: scale(0.8) rotate(15deg); }
        @keyframes peek { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(20px); } }
        .cupid-float:hover { filter: drop-shadow(0 0 40px rgba(255, 106, 162, 0.5)) drop-shadow(0 8px 20px rgba(0, 0, 0, 0.25)); transform: scale(1.05); }
        .cupid-float:active { transform: scale(0.95); }
        @media (max-width: 420px) { .cupid-float { width: 60px; top: 1rem; right: 1rem; } }
      `}</style>
      
      <img
        ref={cupidRef}
        src={imgSrc}
        alt="Cupid"
        className={`cupid-float ${isPopped ? 'popped' : ''} ${isRunning ? 'running' : ''} ${isPeeking ? 'peeking' : ''} ${isDodging ? 'dodging' : ''}`}
        style={{ ...position, background: 'transparent' }}
        onClick={handleTap}
        onMouseEnter={() => {
          if (Math.random() > 0.5 && !isDodging && !isPopped) {
            window.dispatchEvent(new MouseEvent('mousemove', { clientX: mousePos.x + 200, clientY: mousePos.y + 200 }));
          }
        }}
        draggable={false}
      />
    </>
  );
};
