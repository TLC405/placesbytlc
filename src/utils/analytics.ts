import { supabase } from '@/integrations/supabase/client';

interface EventData {
  [key: string]: any;
}

export const trackEvent = async (
  eventType: string, 
  eventData: EventData = {}
) => {
  try {
    // Check if user has consented to analytics
    const consent = localStorage.getItem('analytics_consent');
    if (consent !== 'true') {
      return; // Don't track if no consent
    }
    
    // Track via edge function
    await supabase.functions.invoke('analytics-track', {
      body: {
        event_type: eventType,
        event_data: eventData,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Failed to track event:', error);
    // Fail silently - don't interrupt user experience
  }
};

export const trackPageView = async (pagePath: string) => {
  await trackEvent('page_view', { 
    page_url: pagePath,
    page_path: pagePath 
  });
};

export const trackButtonClick = async (buttonName: string, location: string) => {
  await trackEvent('button_click', { 
    button_name: buttonName,
    location 
  });
};

export const trackPhotoUpload = async () => {
  await trackEvent('photo_upload', {});
};

export const trackCartoonGeneration = async () => {
  await trackEvent('cartoon_gen', {});
};

export const setAnalyticsConsent = (consented: boolean) => {
  localStorage.setItem('analytics_consent', consented ? 'true' : 'false');
};

export const hasAnalyticsConsent = (): boolean => {
  return localStorage.getItem('analytics_consent') === 'true';
};
