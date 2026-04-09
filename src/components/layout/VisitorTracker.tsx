'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { pushLoginLog } from '@/lib/loginLog';

/**
 * Tracks each page visit and stores the details in localStorage.
 * Captured fields: username (from cl_user), IP, location, ISP, user‑agent,
 * current path, suspicion flag, and timestamp.
 */
interface IpInfo {
  ip?: string;
  city?: string;
  region?: string;
  country_name?: string;
  country_code?: string;
  org?: string;
}

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const track = async () => {
      try {
        let ipInfo: IpInfo | null = null;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1200);
          const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
          clearTimeout(timeoutId);
          if (res.ok) {
            ipInfo = await res.json() as IpInfo;
          }
        } catch { } // fail fast silently on network/timeout error

        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('cl_user') : null;
        let username = 'Guest';
        if (storedUser) {
          try {
            username = JSON.parse(storedUser).key || 'User';
          } catch { }
        }

        const locationStr = ipInfo && ipInfo.city
          ? `${ipInfo.city}, ${ipInfo.region || ''}, ${ipInfo.country_name || ''}`
          : 'Indonesia';

        const payload = {
          action: "Navigasi",
          path: pathname || window.location.pathname,
          username: username,
          ip: ipInfo?.ip || "Unknown IP",
          location: locationStr
        };

        fetch('/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(() => { });
      } catch (err) {
        console.error('VisitorTracker error', err);
      }
    };
    track();
  }, [pathname]);

  return null;
}
