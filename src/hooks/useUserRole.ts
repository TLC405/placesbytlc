import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'admin' | 'moderator' | 'tester' | 'user' | null;

export const useUserRole = () => {
  const [role, setRole] = useState<AppRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRole(null);
          setLoading(false);
          return;
        }

        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .order('role', { ascending: true }); // admin comes first alphabetically

        if (roles && roles.length > 0) {
          // Return the highest priority role (admin > moderator > tester > user)
          const roleHierarchy: AppRole[] = ['admin', 'moderator', 'tester', 'user'];
          const userRole = roleHierarchy.find(r => 
            roles.some(dbRole => dbRole.role === r)
          ) || 'user';
          setRole(userRole);
        } else {
          setRole('user');
        }
      } catch (error) {
        console.error('Error fetching role:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchRole();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { role, loading };
};
