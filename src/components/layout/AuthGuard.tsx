'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Client‑side auth guard.
 * MENGUNCIL SEMUA HALAMAN.
 * Pengguna yang belum login TIDAK BISA mengakses halaman manapun
 * kecuali halaman `/bisnis/login`.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // MENCEGAH AKSES DARI SEMUA HALAMAN KECUALI LOGIN
  const isProtectedPath = useMemo(() => {
    if (!pathname) return false;
    // Kecualikan hanya halaman login bisnis
    return !pathname.startsWith('/bisnis/login');
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
    
    // Jika di halaman login, abaikan pengecekan
    if (!isProtectedPath) return;

    const checkSession = () => {
      try {
        const user = localStorage.getItem('cl_user');
        if (!user) {
          router.replace('/bisnis/login');
        }
      } catch (e) {
        router.replace('/bisnis/login');
      }
    };

    checkSession();
  }, [pathname, router, isProtectedPath]);

  // Render halaman login tanpa hambatan
  if (!isProtectedPath) return <>{children}</>;

  // Untuk halaman yang dikunci, tunggu hingga Client-side Hydration selesai
  if (!mounted) return null;

  // Verifikasi session terakhir sebelum konten dimunculkan
  let hasValidSession = false;
  try {
    hasValidSession = !!localStorage.getItem('cl_user');
  } catch { }

  if (!hasValidSession) {
    return null;
  }

  return <>{children}</>;
}
