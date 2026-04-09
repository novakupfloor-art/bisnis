'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Client‑side auth guard.
 * Hanya melindungi route /bisnis/* (kecuali /bisnis/login).
 * Semua route lain (beranda, properti, fashion, furniture, studio, auth, dll)
 * dapat diakses bebas tanpa login.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  // Route yang butuh autentikasi: hanya /bisnis/* kecuali /bisnis/login
  const isProtectedPath = useMemo(() => {
    if (!pathname) return false;
    return pathname.startsWith('/bisnis') && !pathname.startsWith('/bisnis/login');
  }, [pathname]);

  useEffect(() => {
    setMounted(true);

    if (!isProtectedPath) return;

    let hasSession = false;
    try {
      hasSession = !!localStorage.getItem('cl_user');
    } catch { }

    if (!hasSession) {
      router.replace('/bisnis/login');
    }
  }, [pathname, router, isProtectedPath]);

  // Untuk route yang tidak dilindungi, render langsung (tidak perlu menunggu mount)
  if (!isProtectedPath) return <>{children}</>;

  // Untuk route yang dilindungi, tunggu sampai cek selesai
  if (!mounted) return null;

  // Cek session sekali lagi sebelum render
  let hasSession = false;
  try {
    hasSession = !!localStorage.getItem('cl_user');
  } catch { }

  if (!hasSession) return null;

  return <>{children}</>;
}
