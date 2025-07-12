'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

interface UserContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  session: null,
  loading: true,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Listen for session changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, session, loading }}>
      {children}
    </UserContext.Provider>
  );
}; 