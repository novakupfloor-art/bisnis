'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // We rely on server‑side middleware for protection. The client guard only prevents
  // hydration mismatches by rendering nothing until the component is mounted.
  useEffect(() => {
    setMounted(true);
  }, []);

        sessionStorage.clear();
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
