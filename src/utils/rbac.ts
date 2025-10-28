export type AppRole = 'warlord' | 'admin' | 'tester';

export const ROLE_SCOPES: Record<AppRole, string[]> = {
  warlord: ['*'], // All permissions
  admin: [
    'places.read',
    'places.write',
    'teefee.read',
    'teefee.write',
    'uploads.read',
    'uploads.write',
    'analytics.read',
    'analytics.write',
    'export.read',
    'settings.read',
    'settings.write',
    'admin.access',
  ],
  tester: [
    'places.read',
    'teefee.read',
    'uploads.write', // Limited to own runs
  ],
};

export const hasPermission = (role: AppRole, scope: string): boolean => {
  const scopes = ROLE_SCOPES[role];
  return scopes.includes('*') || scopes.includes(scope);
};

export const canAccessAdminPanel = (role: AppRole): boolean => {
  return role === 'warlord' || role === 'admin';
};

// Storage helpers
export const storeRole = (role: AppRole, expiresIn: number) => {
  localStorage.setItem('pin_role', role);
  localStorage.setItem('pin_expiry', String(Date.now() + (expiresIn * 1000)));
};

export const getStoredRole = (): AppRole | null => {
  const role = localStorage.getItem('pin_role') as AppRole | null;
  const expiry = parseInt(localStorage.getItem('pin_expiry') || '0');
  
  // Check if expired
  if (!role || Date.now() > expiry) {
    console.log('Role expired or missing, clearing storage');
    clearStoredRole();
    return null;
  }
  
  return role;
};

// Helper to check time remaining
export const getTimeRemaining = (): number => {
  const expiry = parseInt(localStorage.getItem('pin_expiry') || '0');
  const remaining = Math.max(0, expiry - Date.now());
  return Math.floor(remaining / 1000); // Return seconds
};

export const clearStoredRole = () => {
  localStorage.removeItem('pin_role');
  localStorage.removeItem('pin_expiry');
};
