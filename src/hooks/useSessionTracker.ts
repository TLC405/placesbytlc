import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSessionTracker = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const pagesVisited = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const isStartingRef = useRef(false);

  useEffect(() => {
    const startSession = async () => {
      // Prevent multiple concurrent starts
      if (isStartingRef.current) return;
      isStartingRef.current = true;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        isStartingRef.current = false;
        return;
      }

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

        if (error) {
          console.debug('Session tracker not available:', error.message);
          isStartingRef.current = false;
          return;
        }
        
        if (data?.sessionId) {
          setSessionId(data.sessionId);
          localStorage.setItem('currentSessionId', data.sessionId);
        }
      } catch (error) {
        console.debug('Session tracking skipped');
      } finally {
        isStartingRef.current = false;
      }
    };

    // Delay start to avoid race conditions
    const startTimeout = setTimeout(startSession, 1000);

    // Track page visits
    const handleRouteChange = () => {
      pagesVisited.current += 1;
    };

    window.addEventListener('popstate', handleRouteChange);

    // Update session every 60 seconds (reduced frequency)
    intervalRef.current = setInterval(async () => {
      const currentSessionId = sessionId || localStorage.getItem('currentSessionId');
      if (!currentSessionId || isStartingRef.current) return;

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
        // Silent fail for updates
        console.debug('Session update skipped');
      }
    }, 60000);

    // End session on unmount/close
    const endSession = async () => {
      const currentSessionId = sessionId || localStorage.getItem('currentSessionId');
      if (!currentSessionId || isStartingRef.current) return;

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
        // Silent fail for end session
        console.debug('Session end skipped');
      }
    };

    window.addEventListener('beforeunload', endSession);

    return () => {
      clearTimeout(startTimeout);
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