'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/use-store';
import { createClient } from '@/lib/supabase/client';

export function StoreInitializer() {
  const { setUserId, loadData, clearData } = useStore();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        loadData();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Only clear on explicit sign-out, not on transient session events
        clearData();
      } else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        setUserId(session.user.id);
        loadData();
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
