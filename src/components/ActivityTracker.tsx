import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const ActivityTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView();
  }, [location]);

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
