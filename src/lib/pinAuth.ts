// PIN Authentication System - No Supabase, Pure Client-Side
import { toast } from "sonner";

const STORAGE_KEYS = {
  ADMIN_PIN: 'tlc_admin_pin',
  ENTRY_CODE: 'tlc_entry_code',
  ADMIN_SESSION: 'tlc_admin_session',
  ENTRY_SESSION: 'tlc_entry_session',
  CONFIG: 'tlc_config'
} as const;

interface AppConfig {
  adminPIN: string;
  entryCode: string;
  imageProvider: 'Disabled' | 'HTTP Webhook' | 'Local Worker' | '3rd-party API';
  llmKey: string | null;
  analyticsEndpoint: string | null;
  testerMode: boolean;
  features: {
    autosave: boolean;
    debugCopilot: boolean;
    analytics: boolean;
  };
}

const DEFAULT_CONFIG: AppConfig = {
  adminPIN: "1309",
  entryCode: "crip",
  imageProvider: "Disabled",
  llmKey: null,
  analyticsEndpoint: null,
  testerMode: false,
  features: {
    autosave: true,
    debugCopilot: true,
    analytics: true
  }
};

// Initialize config with defaults
export const initializeConfig = (): AppConfig => {
  const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
  if (stored) {
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_CONFIG;
    }
  }
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
  return DEFAULT_CONFIG;
};

// Get current config
export const getConfig = (): AppConfig => {
  const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
  if (stored) {
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_CONFIG;
    }
  }
  return DEFAULT_CONFIG;
};

// Update config
export const updateConfig = (updates: Partial<AppConfig>): void => {
  const current = getConfig();
  const updated = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));
};

// Entry Code Validation
export const validateEntryCode = (code: string): boolean => {
  const config = getConfig();
  const isValid = code === config.entryCode;
  
  if (isValid) {
    sessionStorage.setItem(STORAGE_KEYS.ENTRY_SESSION, 'true');
  }
  
  return isValid;
};

export const hasEntryAccess = (): boolean => {
  return sessionStorage.getItem(STORAGE_KEYS.ENTRY_SESSION) === 'true';
};

export const clearEntryAccess = (): void => {
  sessionStorage.removeItem(STORAGE_KEYS.ENTRY_SESSION);
};

// Admin PIN Validation
export const validateAdminPIN = (pin: string): boolean => {
  const config = getConfig();
  const isValid = pin === config.adminPIN;
  
  if (isValid) {
    const session = {
      timestamp: Date.now(),
      expires: Date.now() + (30 * 60 * 1000) // 30 minutes
    };
    sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
    toast.success("🔓 Admin access granted");
  } else {
    toast.error("❌ Invalid PIN");
  }
  
  return isValid;
};

export const hasAdminAccess = (): boolean => {
  const stored = sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
  if (!stored) return false;
  
  try {
    const session = JSON.parse(stored);
    const now = Date.now();
    
    if (now > session.expires) {
      clearAdminAccess();
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

export const clearAdminAccess = (): void => {
  sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  toast.info("🔒 Admin session ended");
};

export const extendAdminSession = (): void => {
  if (hasAdminAccess()) {
    const session = {
      timestamp: Date.now(),
      expires: Date.now() + (30 * 60 * 1000)
    };
    sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
  }
};

// Change credentials (admin only)
export const changeAdminPIN = (oldPIN: string, newPIN: string): boolean => {
  const config = getConfig();
  
  if (oldPIN !== config.adminPIN) {
    toast.error("❌ Current PIN incorrect");
    return false;
  }
  
  if (newPIN.length < 4) {
    toast.error("❌ PIN must be at least 4 digits");
    return false;
  }
  
  updateConfig({ adminPIN: newPIN });
  toast.success("✅ Admin PIN updated");
  return true;
};

export const changeEntryCode = (oldCode: string, newCode: string): boolean => {
  const config = getConfig();
  
  if (oldCode !== config.entryCode) {
    toast.error("❌ Current code incorrect");
    return false;
  }
  
  if (newCode.length < 3) {
    toast.error("❌ Code must be at least 3 characters");
    return false;
  }
  
  updateConfig({ entryCode: newCode });
  toast.success("✅ Entry code updated");
  return true;
};

// Fresh install simulator
export const simulateFreshInstall = (): void => {
  if (confirm("⚠️ This will clear ALL local data and reload the app. Continue?")) {
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Clear caches
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }
    
    toast.success("🔄 Fresh install simulated. Reloading...");
    
    setTimeout(() => {
      window.location.href = '/';
      window.location.reload();
    }, 1000);
  }
};
