import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const ActivityTracker = () => {
  const location = useLocation();
  const sessionStartTime = useRef(Date.now());
  const lastActivityTime = useRef(Date.now());

  useEffect(() => {
    trackPageView();
    setupAdvancedTracking();
  }, [location]);

  // Track session duration and engagement
  useEffect(() => {
    const activityInterval = setInterval(() => {
      const sessionDuration = Date.now() - sessionStartTime.current;
      const idleTime = Date.now() - lastActivityTime.current;
      
      trackSessionMetrics({
        session_duration: sessionDuration,
        idle_time: idleTime,
        is_active: idleTime < 60000, // Active if less than 1 min idle
      });
    }, 30000); // Track every 30 seconds

    return () => clearInterval(activityInterval);
  }, []);

  const setupAdvancedTracking = () => {
    // Track all clicks
    const trackClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      lastActivityTime.current = Date.now();
      
      trackInteraction({
        type: 'click',
        element: target.tagName,
        text: target.textContent?.substring(0, 100) || '',
        classes: target.className,
        id: target.id,
        x: e.clientX,
        y: e.clientY,
        timestamp: new Date().toISOString(),
      });
    };

    // Track scroll depth
    let maxScroll = 0;
    const trackScroll = () => {
      lastActivityTime.current = Date.now();
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        trackInteraction({
          type: 'scroll',
          depth: Math.round(scrollPercent),
          position: window.scrollY,
        });
      }
    };

    // Track form interactions
    const trackFormInteraction = (e: Event) => {
      const target = e.target as HTMLInputElement;
      lastActivityTime.current = Date.now();
      
      trackInteraction({
        type: 'form_interaction',
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
      
      if (mouseMoveCount % 50 === 0) { // Track every 50 movements
        trackInteraction({
          type: 'mouse_activity',
          movement_count: mouseMoveCount,
        });
      }
    };

    // Track keyboard usage
    const trackKeyboard = () => {
      lastActivityTime.current = Date.now();
      trackInteraction({
        type: 'keyboard_activity',
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
      trackInteraction({
        type: 'visibility_change',
        hidden: document.hidden,
      });
    });

    // Cleanup
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

      // Get comprehensive location and device data
      const getLocationData = async () => {
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          return {
            // Location Details
            ip: data.ip,
            city: data.city,
            region: data.region,
            region_code: data.region_code,
            country: data.country_name,
            country_code: data.country_code,
            postal: data.postal,
            latitude: data.latitude,
            longitude: data.longitude,
            timezone: data.timezone,
            utc_offset: data.utc_offset,
            
            // Network Details
            org: data.org,
            asn: data.asn,
            
            // Currency/Language
            currency: data.currency,
            languages: data.languages,
            
            // Connection Type
            connection_type: (navigator as any).connection ? (navigator as any).connection.effectiveType : 'unknown',
          };
        } catch {
          return {};
        }
      };

      const locationData = await getLocationData();

      // Get device details
      const deviceData = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        colorDepth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
        referrer: document.referrer || 'direct',
        online: navigator.onLine,
      };

      await supabase.functions.invoke('track-activity', {
        body: {
          activity_type: 'page_visit',
          activity_data: {
            path: location.pathname,
            timestamp: new Date().toISOString(),
            ...locationData,
            ...deviceData,
          }
        }
      });
    } catch (error) {
      // Silent fail - don't disrupt user experience
      console.debug('Activity tracking skipped');
    }
  };

  return null; // Invisible component
};

// Track user interactions (clicks, scrolls, etc.)
const trackInteraction = async (interactionData: any) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase.functions.invoke('track-activity', {
      body: {
        activity_type: 'interaction',
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
