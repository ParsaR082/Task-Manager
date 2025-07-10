'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth({ required = true, redirectTo = '/login' } = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === 'loading';
  const authenticated = status === 'authenticated';

  useEffect(() => {
    if (!loading) {
      if (required && !authenticated) {
        router.push(redirectTo);
      }
    }
  }, [loading, authenticated, required, redirectTo, router]);

  return {
    session,
    loading,
    authenticated,
    user: session?.user,
  };
} 