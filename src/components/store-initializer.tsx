'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/use-store';
import { createClient } from '@/lib/supabase/client';

export function StoreInitializer() {
  const { setUserId, loadData, clearData } = useStore();

  useEffect(() => {
    const supabase = createClient();

    // getSession() reads from cookies and refreshes via refresh token if needed —
    // more reliable than getUser() for initial load after the access token has expired.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        loadData();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Only clear on explicit sign-out, not on transient session events
        clearData();
      } else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session?.user) {
        setUserId(session.user.id);
        loadData();
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
