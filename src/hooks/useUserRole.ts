import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = 'admin' | 'moderator' | 'alpha' | 'beta' | 'delta' | 'user';

interface UserRoleData {
  roles: UserRole[];
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isLoading: boolean;
  userId: string | null;
}

export const useUserRole = (): UserRoleData => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setRoles([]);
          setUserId(null);
          setIsLoading(false);
          return;
        }

        setUserId(session.user.id);

        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);

        if (userRoles && userRoles.length > 0) {
          setRoles(userRoles.map(r => r.role as UserRole));
        } else {
          setRoles([]);
        }
      } catch (error) {
        console.error('Error checking role:', error);
        setRoles([]);
      } finally {
        setIsLoading(false);
      }
    };

    checkRole();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => checkRole());
    return () => subscription.unsubscribe();
  }, []);

  const hasRole = (role: UserRole) => roles.includes(role);
  
  const hasAnyRole = (checkRoles: UserRole[]) => {
    return checkRoles.some(role => roles.includes(role));
  };

  return { roles, hasRole, hasAnyRole, isLoading, userId };
};
