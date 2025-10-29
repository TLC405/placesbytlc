export type AppRole = 'admin' | 'warlord' | 'tester' | 'couple' | null;

export interface Permission {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export const ROLE_PERMISSIONS: Record<string, Record<string, Permission>> = {
  admin: {
    places: { view: true, create: true, update: true, delete: true },
    teefee: { view: true, create: true, update: true, delete: true },
    search: { view: true, create: true, update: true, delete: true },
    uploads: { view: true, create: true, update: true, delete: true },
    export: { view: true, create: true, update: true, delete: true },
    settings: { view: true, create: true, update: true, delete: true },
    admin: { view: true, create: true, update: true, delete: true },
  },
  warlord: {
    places: { view: true, create: true, update: true, delete: true },
    teefee: { view: true, create: true, update: true, delete: true },
    search: { view: true, create: true, update: true, delete: true },
    uploads: { view: true, create: true, update: true, delete: true },
    export: { view: true, create: true, update: true, delete: true },
    settings: { view: true, create: true, update: true, delete: true },
    admin: { view: true, create: true, update: true, delete: true },
  },
  tester: {
    places: { view: true, create: false, update: false, delete: false },
    teefee: { view: true, create: true, update: true, delete: true },
    search: { view: true, create: true, update: true, delete: true },
    uploads: { view: true, create: false, update: false, delete: false },
    export: { view: true, create: false, update: false, delete: false },
    settings: { view: true, create: false, update: false, delete: false },
    admin: { view: false, create: false, update: false, delete: false },
  },
  couple: {
    places: { view: true, create: true, update: true, delete: true },
    teefee: { view: true, create: true, update: true, delete: true },
    search: { view: true, create: true, update: true, delete: true },
    uploads: { view: true, create: true, update: true, delete: true },
    export: { view: true, create: true, update: true, delete: true },
    settings: { view: true, create: true, update: true, delete: true },
    admin: { view: false, create: false, update: false, delete: false },
  },
};

export const getStoredRole = (): AppRole => {
  const role = localStorage.getItem('pin_role');
  const expiry = parseInt(localStorage.getItem('pin_expiry') || '0');
  
  if (role && Date.now() < expiry) {
    return role as AppRole;
  }
  
  clearStoredRole();
  return null;
};

export const hasPermission = (
  role: AppRole,
  resource: string,
  action: 'view' | 'create' | 'update' | 'delete'
): boolean => {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role]?.[resource];
  return permissions?.[action] ?? false;
};

export const canAccess = (role: AppRole, resource: string): boolean => {
  return hasPermission(role, resource, 'view');
};

export const canModify = (role: AppRole, resource: string): boolean => {
  return hasPermission(role, resource, 'create') || 
         hasPermission(role, resource, 'update') || 
         hasPermission(role, resource, 'delete');
};

export const showLockedToast = (resource: string) => {
  return `🔒 ${resource} is locked for testers. Full access coming soon!`;
};

export const clearStoredRole = () => {
  localStorage.removeItem('pin_role');
  localStorage.removeItem('pin_expiry');
  localStorage.removeItem('tlc_app_role');
  localStorage.removeItem('tlc_user_id');
  localStorage.removeItem('tlc_username');
};

export const canAccessAdminPanel = (role: AppRole): boolean => {
  return role === 'warlord' || role === 'admin';
};

export const storeRole = (role: AppRole, expiresIn: number) => {
  localStorage.setItem('pin_role', role);
  localStorage.setItem('pin_expiry', String(Date.now() + (expiresIn * 1000)));
};

export const getTimeRemaining = (): number => {
  const expiry = parseInt(localStorage.getItem('pin_expiry') || '0');
  const remaining = Math.max(0, expiry - Date.now());
  return Math.floor(remaining / 1000);
};
