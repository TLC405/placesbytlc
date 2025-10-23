import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSessionTracker = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const pagesVisited = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const startSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      try {
        // Generate browser fingerprint
        const fingerprint = await generateFingerprint();
        
        // Get device info
        const deviceInfo = {
          screen: {
            width: window.screen.width,
            height: window.screen.height,
            colorDepth: window.screen.colorDepth,
          },
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          platform: navigator.platform,
          cookiesEnabled: navigator.cookieEnabled,
          doNotTrack: navigator.doNotTrack,
        };

        const { data, error } = await supabase.functions.invoke('session-tracker', {
          body: {
            action: 'start',
            data: {
              fingerprint,
              deviceInfo,
            }
          }
        });

        if (error) throw error;
        if (data?.sessionId) {
          setSessionId(data.sessionId);
          localStorage.setItem('currentSessionId', data.sessionId);
        }
      } catch (error) {
        console.error('Failed to start session:', error);
      }
    };

    startSession();

    // Track page visits
    const handleRouteChange = () => {
      pagesVisited.current += 1;
    };

    window.addEventListener('popstate', handleRouteChange);

    // Update session every 30 seconds
    intervalRef.current = setInterval(async () => {
      const currentSessionId = sessionId || localStorage.getItem('currentSessionId');
      if (!currentSessionId) return;

      try {
        await supabase.functions.invoke('session-tracker', {
          body: {
            action: 'update',
            sessionId: currentSessionId,
            data: {
              pagesVisited: pagesVisited.current
            }
          }
        });
      } catch (error) {
        console.error('Failed to update session:', error);
      }
    }, 30000);

    // End session on unmount/close
    const endSession = async () => {
      const currentSessionId = sessionId || localStorage.getItem('currentSessionId');
      if (!currentSessionId) return;

      try {
        await supabase.functions.invoke('session-tracker', {
          body: {
            action: 'end',
            sessionId: currentSessionId,
            data: {
              pagesVisited: pagesVisited.current
            }
          }
        });
        localStorage.removeItem('currentSessionId');
      } catch (error) {
        console.error('Failed to end session:', error);
      }
    };

    window.addEventListener('beforeunload', endSession);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('beforeunload', endSession);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      endSession();
    };
  }, [sessionId]);

  return { sessionId };
};

// Generate unique browser fingerprint
const generateFingerprint = async (): Promise<string> => {
  const data = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
  ].join('|');

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return hash.toString(36);
};