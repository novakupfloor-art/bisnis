'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Check if user is logged in
    try {
      const user = localStorage.getItem('cl_user');
      if (user) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
        // Redirect to login if not logged in, unless already on login page
        if (pathname !== '/bisnis/login') {
          router.replace('/bisnis/login');
        }
      }
    } catch {
      setIsAuth(false);
      if (pathname !== '/bisnis/login') {
        router.replace('/bisnis/login');
      }
    }
  }, [mounted, pathname, router]);

  // Don't render content until auth check is done on client side
  if (!mounted) return null;
  
  // If not authenticated and not on login page, don't show content
  if (!isAuth && pathname !== '/bisnis/login') return null;

  return <>{children}</>;
}
