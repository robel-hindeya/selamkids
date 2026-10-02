'use client';

import { useState, useEffect } from 'react';
import { AuthUser } from '@/types/auth';

export function useUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const json = await res.json();
        if (isMounted) {
          if (json.success && json.data) {
            setUser(json.data);
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch user');
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return { user, loading, error, isAuthenticated: !!user };
}
