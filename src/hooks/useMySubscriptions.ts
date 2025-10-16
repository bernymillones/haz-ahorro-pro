// src/hooks/useMySubscriptions.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useMySubscriptions(supabaseUserId?: string) {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseUserId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('savings_plans')
        .select('*')
        .eq('user_id', supabaseUserId);
      if (!cancelled) {
        if (error) {
          console.error(error);
          setSubscriptions([]);
        } else {
          setSubscriptions(data || []);
        }
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [supabaseUserId]);

  return { subscriptions, loading };
}
