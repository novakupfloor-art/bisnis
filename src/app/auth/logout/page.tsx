'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearLoginLogs } from '@/lib/loginLog';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const runLogout = async () => {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
        });
      } catch (err) {
        console.error('Logout failed', err);
      } finally {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cl_user');
          clearLoginLogs();
          sessionStorage.clear();
        }

        router.replace('/auth/login');
      }
    };

    void runLogout();
  }, [router]);

  return null;
}
