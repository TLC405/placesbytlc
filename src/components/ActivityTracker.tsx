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

      await supabase.functions.invoke('track-activity', {
        body: {
          activity_type: 'page_visit',
          activity_data: {
            path: location.pathname,
            timestamp: new Date().toISOString(),
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
