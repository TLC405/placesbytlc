import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

type SaveStatus = 'idle' | 'saving' | 'saved';

interface UseAutosaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void> | void;
  delay?: number; // milliseconds (300-800)
  enabled?: boolean;
  showToasts?: boolean;
}

export const useAutosave = <T>({
  data,
  onSave,
  delay = 500,
  enabled = true,
  showToasts = false
}: UseAutosaveOptions<T>) => {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<T>(data);
  const isMountedRef = useRef(false);

  const save = useCallback(async () => {
    if (!enabled) return;

    setStatus('saving');
    
    try {
      await onSave(data);
      setStatus('saved');
      
      if (showToasts) {
        toast.success('Saved', { duration: 1000 });
      }
      
      // Reset to idle after 2 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Autosave error:', error);
      setStatus('idle');
      
      if (showToasts) {
        toast.error('Failed to save');
      }
    }
  }, [data, onSave, enabled, showToasts]);

  useEffect(() => {
    // Skip first render
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      previousDataRef.current = data;
      return;
    }

    // Skip if data hasn't changed
    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
      return;
    }

    previousDataRef.current = data;

    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      save();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, save]);

  const forceSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    save();
  }, [save]);

  return {
    status,
    forceSave
  };
};
