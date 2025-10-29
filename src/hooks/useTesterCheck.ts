import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useTesterCheck = (showAlphaMessage = false) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkTesterRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      const isTester = roles?.some(r => (r.role as string) === 'tester') ?? false;
      
      if (isTester) {
        if (showAlphaMessage) {
          toast.error('⚠️ Period Tracker is in Alpha Phase', {
            description: 'This feature is not available for tester accounts yet. Check back soon!',
            duration: 5000
          });
        } else {
          toast.error('This feature is not available for tester accounts');
        }
        navigate('/');
      }
    };
    
    checkTesterRole();
  }, [navigate, showAlphaMessage]);
};
