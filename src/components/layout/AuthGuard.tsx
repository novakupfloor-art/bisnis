'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Client‑side guard that mirrors the server‑side middleware.
 * It checks for the presence of the `cl_session` cookie and, if missing,
 * redirects the user to the login page (`/bisnis/login`).
 * The component renders nothing until the check is performed to avoid
 * hydration mismatches.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Ensure this runs only in the browser
    const hasSession = typeof document !== 'undefined' && document.cookie.includes('cl_session');
    setIsAuth(!!hasSession);
    setMounted(true);

    // If the user is not authenticated and is not already on the login page, redirect.
    if (!hasSession && pathname !== '/bisnis/login') {
      router.replace('/bisnis/login');
    }
    // No else – allow rendering of children when authenticated.
  }, [pathname, router]);

  // Prevent rendering until the client‑side check finishes.
  if (!mounted) return null;

  // If not authenticated and not on the login page, render nothing (router will redirect).
  if (!isAuth && pathname !== '/bisnis/login') return null;

  return <>{children}</>;
}
