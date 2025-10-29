import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { hasAdminAccess, extendAdminSession, hasEntryAccess } from '@/lib/pinAuth';

interface PINContextType {
  isAdmin: boolean;
  hasEntry: boolean;
  checkAdminAccess: () => boolean;
  checkEntryAccess: () => boolean;
}

const PINContext = createContext<PINContextType | undefined>(undefined);

export const PINProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasEntry, setHasEntry] = useState(false);

  const checkAdminAccess = () => {
    const hasAccess = hasAdminAccess();
    setIsAdmin(hasAccess);
    if (hasAccess) {
      extendAdminSession();
    }
    return hasAccess;
  };

  const checkEntryAccess = () => {
    const hasAccess = hasEntryAccess();
    setHasEntry(hasAccess);
    return hasAccess;
  };

  useEffect(() => {
    checkAdminAccess();
    checkEntryAccess();
    
    // Check session every minute
    const interval = setInterval(() => {
      checkAdminAccess();
      checkEntryAccess();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PINContext.Provider value={{ isAdmin, hasEntry, checkAdminAccess, checkEntryAccess }}>
      {children}
    </PINContext.Provider>
  );
};

export const usePIN = () => {
  const context = useContext(PINContext);
  if (context === undefined) {
    // Graceful fallback to avoid runtime crashes if provider isn't mounted
    console.warn('usePIN used outside a PINProvider. Returning safe defaults.');
    return {
      isAdmin: false,
      hasEntry: false,
      checkAdminAccess: () => false,
      checkEntryAccess: () => false,
    } as PINContextType;
  }
  return context;
};
