import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUserRole = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);

        setIsAdmin(roles?.some(r => r.role === 'admin') || false);
      } catch (error) {
        console.error('Error checking role:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkRole();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => checkRole());
    return () => subscription.unsubscribe();
  }, []);

  return { isAdmin, isLoading };
};
