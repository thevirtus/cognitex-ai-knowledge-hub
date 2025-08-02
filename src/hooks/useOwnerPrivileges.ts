import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useOwnerPrivileges = () => {
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOwnerStatus();
  }, []);

  const checkOwnerStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const { data, error } = await supabase
          .from('owner_privileges')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();
        
        if (!error && data) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      } else {
        setIsOwner(false);
      }
    } catch (error) {
      console.error('Error checking owner status:', error);
      setIsOwner(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOwner,
    isLoading,
    checkOwnerStatus,
  };
};