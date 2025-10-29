import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Helper to generate browser fingerprint
const generateFingerprint = async () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
  }
  const canvasData = canvas.toDataURL();
  
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
    navigator.plugins.length,
    canvasData,
  ].join('|||');
  
  const encoder = new TextEncoder();
  const data = encoder.encode(components);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Helper to parse carrier name from ISP organization
const parseCarrierName = (org: string = ''): string => {
  const carriers: Record<string, string> = {
    'tmobile': 'T-Mobile',
    't-mobile': 'T-Mobile',
    'verizon': 'Verizon',
    'att': 'AT&T',
    'at&t': 'AT&T',
    'sprint': 'Sprint',
    'comcast': 'Comcast',
    'charter': 'Charter/Spectrum',
    'cox': 'Cox',
    'frontier': 'Frontier',
    'centurylink': 'CenturyLink',
  };
  
  const lowerOrg = org.toLowerCase();
  for (const [key, name] of Object.entries(carriers)) {
    if (lowerOrg.includes(key)) return name;
  }
  return org || 'Unknown';
};

// Helper to detect ad blocker
const detectAdBlocker = async (): Promise<boolean> => {
  try {
    await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
      method: 'HEAD',
      mode: 'no-cors',
    });
    return false;
  } catch {
    return true;
  }
};

// Helper to estimate network speed
const estimateNetworkSpeed = async (): Promise<{ speed: string; latency: number }> => {
  const startTime = performance.now();
  try {
    await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' });
    const latency = performance.now() - startTime;
    
    let speed = 'Unknown';
    if (latency < 100) speed = 'Fast';
    else if (latency < 300) speed = 'Medium';
    else speed = 'Slow';
    
    return { speed, latency: Math.round(latency) };
  } catch {
    return { speed: 'Unknown', latency: 0 };
  }
};

// Get returning visitor status
const getVisitorStatus = (): { isReturning: boolean; visitCount: number; firstVisit: string } => {
  const stored = localStorage.getItem('visitor_tracking');
  if (stored) {
    const data = JSON.parse(stored);
    data.visitCount++;
    localStorage.setItem('visitor_tracking', JSON.stringify(data));
    return { isReturning: true, ...data };
  } else {
    const data = { visitCount: 1, firstVisit: new Date().toISOString() };
    localStorage.setItem('visitor_tracking', JSON.stringify(data));
    return { isReturning: false, ...data };
  }
};

export const ActivityTracker = () => {
  const location = useLocation();
  const sessionStartTime = useRef(Date.now());
  const lastActivityTime = useRef(Date.now());
  const pageEnterTime = useRef<number>(Date.now());
  const copyPasteEvents = useRef<number>(0);
  const rageClicks = useRef<{ x: number; y: number; time: number }[]>([]);
  const deadClicks = useRef<number>(0);

  useEffect(() => {
    pageEnterTime.current = Date.now();
    trackPageView();
    setupAdvancedTracking();
    
    // Track copy/paste events
    const handleCopy = () => {
      copyPasteEvents.current++;
      trackInteraction('copy', { count: copyPasteEvents.current });
    };
    
    const handlePaste = () => {
      copyPasteEvents.current++;
      trackInteraction('paste', { count: copyPasteEvents.current });
    };

    // Track rage clicks (multiple clicks in same area rapidly)
    const handleRageClick = (e: MouseEvent) => {
      const now = Date.now();
      rageClicks.current.push({ x: e.clientX, y: e.clientY, time: now });
      
      // Keep only last 3 seconds of clicks
      rageClicks.current = rageClicks.current.filter(click => now - click.time < 3000);
      
      // Detect rage click (5+ clicks within 50px radius in 3 seconds)
      if (rageClicks.current.length >= 5) {
        const recent = rageClicks.current.slice(-5);
        const distances = recent.map((c, i) => 
          i === 0 ? 0 : Math.sqrt(Math.pow(c.x - recent[i-1].x, 2) + Math.pow(c.y - recent[i-1].y, 2))
        );
        const maxDistance = Math.max(...distances);
        
        if (maxDistance < 50) {
          trackInteraction('rage_click', { x: e.clientX, y: e.clientY });
          rageClicks.current = [];
        }
      }
    };

    // Track dead clicks (clicks on non-interactive elements)
    const handleDeadClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.tagName === 'BUTTON' || 
                           target.tagName === 'A' || 
                           target.tagName === 'INPUT' ||
                           target.onclick !== null ||
                           target.classList.contains('clickable');
      
      if (!isInteractive) {
        deadClicks.current++;
        trackInteraction('dead_click', { 
          count: deadClicks.current,
          element: target.tagName,
          x: e.clientX,
          y: e.clientY,
        });
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('click', handleRageClick);
    document.addEventListener('click', handleDeadClick);
    
    // Track session duration and idle time
    const sessionInterval = setInterval(() => {
      const sessionDuration = Date.now() - sessionStartTime.current;
      const idleTime = Date.now() - lastActivityTime.current;
      
      if (sessionDuration % 30000 === 0) {
        trackSessionMetrics({
          session_duration: sessionDuration,
          idle_time: idleTime,
          is_active: idleTime < 60000,
        });
      }
    }, 1000);

    return () => {
      // Track time on page when leaving
      const timeOnPage = Date.now() - pageEnterTime.current;
      trackInteraction('page_exit', { 
        timeOnPage: Math.round(timeOnPage / 1000),
        path: location.pathname,
      });
      
      clearInterval(sessionInterval);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('click', handleRageClick);
      document.removeEventListener('click', handleDeadClick);
    };
  }, [location]);

  const setupAdvancedTracking = () => {
    // Track all clicks
    const trackClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      lastActivityTime.current = Date.now();
      
      trackInteraction('click', {
        element: target.tagName,
        text: target.textContent?.substring(0, 100) || '',
        classes: target.className,
        id: target.id,
        x: e.clientX,
        y: e.clientY,
      });
    };

    // Track scroll depth
    let maxScroll = 0;
    const trackScroll = () => {
      lastActivityTime.current = Date.now();
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        trackInteraction('scroll', {
          depth: Math.round(scrollPercent),
          position: window.scrollY,
        });
      }
    };

    // Track form interactions
    const trackFormInteraction = (e: Event) => {
      const target = e.target as HTMLInputElement;
      lastActivityTime.current = Date.now();
      
      trackInteraction('form_interaction', {
        field_type: target.type,
        field_name: target.name,
        field_id: target.id,
      });
    };

    // Track mouse movement patterns
    let mouseMoveCount = 0;
    const trackMouseMove = () => {
      mouseMoveCount++;
      lastActivityTime.current = Date.now();
      
      if (mouseMoveCount % 50 === 0) {
        trackInteraction('mouse_activity', {
          movement_count: mouseMoveCount,
        });
      }
    };

    // Track keyboard usage
    const trackKeyboard = () => {
      lastActivityTime.current = Date.now();
      trackInteraction('keyboard_activity', {
        timestamp: new Date().toISOString(),
      });
    };

    // Add event listeners
    document.addEventListener('click', trackClick);
    document.addEventListener('scroll', trackScroll, { passive: true });
    document.addEventListener('input', trackFormInteraction);
    document.addEventListener('mousemove', trackMouseMove, { passive: true });
    document.addEventListener('keydown', trackKeyboard);

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      trackInteraction('visibility_change', {
        hidden: document.hidden,
      });
    });

    return () => {
      document.removeEventListener('click', trackClick);
      document.removeEventListener('scroll', trackScroll);
      document.removeEventListener('input', trackFormInteraction);
      document.removeEventListener('mousemove', trackMouseMove);
      document.removeEventListener('keydown', trackKeyboard);
    };
  };

  const trackPageView = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Gather comprehensive location data
      const locationData = await fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .catch(() => ({}));

      // Parse carrier name
      const carrierName = parseCarrierName(locationData.org);

      // Get battery info
      let batteryInfo = {};
      if ('getBattery' in navigator) {
        try {
          const battery: any = await (navigator as any).getBattery();
          batteryInfo = {
            level: Math.round(battery.level * 100),
            charging: battery.charging,
          };
        } catch {}
      }

      // Get GPU info
      let gpuInfo = 'Unknown';
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            gpuInfo = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          }
        }
      } catch {}

      // Get memory info
      const memoryInfo = (performance as any).memory ? {
        jsHeapSizeLimit: Math.round((performance as any).memory.jsHeapSizeLimit / 1048576),
        totalJSHeapSize: Math.round((performance as any).memory.totalJSHeapSize / 1048576),
        usedJSHeapSize: Math.round((performance as any).memory.usedJSHeapSize / 1048576),
      } : {};

      // Generate fingerprint
      const fingerprint = await generateFingerprint();

      // Detect ad blocker
      const hasAdBlocker = await detectAdBlocker();

      // Estimate network speed
      const networkSpeed = await estimateNetworkSpeed();

      // Get visitor status
      const visitorStatus = getVisitorStatus();

      // Get performance metrics
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const performanceMetrics = perfData ? {
        loadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
        domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
        responseTime: Math.round(perfData.responseEnd - perfData.requestStart),
      } : {};

      // Gather detailed device information
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        languages: navigator.languages,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,
        colorDepth: window.screen.colorDepth,
        pixelDepth: window.screen.pixelDepth,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        touchPoints: navigator.maxTouchPoints,
        hardwareConcurrency: navigator.hardwareConcurrency,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        memory: memoryInfo,
        gpu: gpuInfo,
        battery: batteryInfo,
      };

      const activityData = {
        path: location.pathname,
        search: location.search,
        hash: location.hash,
        referrer: document.referrer,
        title: document.title,
        timestamp: new Date().toISOString(),
        sessionId: session?.user?.id || 'anonymous',
        location: { ...locationData, carrierName },
        device: deviceInfo,
        fingerprint,
        visitor: visitorStatus,
        security: {
          hasAdBlocker,
          vpnDetected: locationData.threat === 'vpn',
          proxyDetected: locationData.threat === 'proxy',
        },
        network: networkSpeed,
        performance: performanceMetrics,
      };

      await supabase.functions.invoke('track-activity', {
        body: {
          activity_type: 'page_visit',
          activity_data: activityData,
        }
      });
    } catch (error) {
      console.debug('Activity tracking skipped');
    }
  };

  return null;
};

// Track user interactions
const trackInteraction = async (type: string, interactionData: any) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase.functions.invoke('track-activity', {
      body: {
        activity_type: type,
        activity_data: {
          ...interactionData,
          path: window.location.pathname,
          timestamp: new Date().toISOString(),
        }
      }
    });
  } catch (error) {
    // Silent fail
  }
};

// Track session metrics
const trackSessionMetrics = async (metricsData: any) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase.functions.invoke('track-activity', {
      body: {
        activity_type: 'session_metrics',
        activity_data: {
          ...metricsData,
          path: window.location.pathname,
          timestamp: new Date().toISOString(),
        }
      }
    });
  } catch (error) {
    // Silent fail
  }
};

export const trackPlaceView = async (place: any) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase.functions.invoke('track-activity', {
      body: {
        activity_type: 'place_view',
        activity_data: {
          place_id: place.place_id,
          name: place.name,
          types: place.types,
          price_level: place.price_level,
        }
      }
    });
  } catch (error) {
    console.debug('Place tracking skipped');
  }
};

export const trackPlaceSave = async (place: any) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase.functions.invoke('track-activity', {
      body: {
        activity_type: 'place_save',
        activity_data: {
          place_id: place.place_id,
          name: place.name,
          types: place.types,
          price_level: place.price_level,
        }
      }
    });
  } catch (error) {
    console.debug('Place save tracking skipped');
  }
};

export const trackSearch = async (query: string, filters: any) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase.functions.invoke('track-activity', {
      body: {
        activity_type: 'search',
        activity_data: {
          query,
          filters,
          timestamp: new Date().toISOString(),
        }
      }
    });
  } catch (error) {
    console.debug('Search tracking skipped');
  }
};
