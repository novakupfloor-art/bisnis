'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { pushLoginLog } from '@/lib/loginLog';

/**
 * Tracks each page visit and stores the details in localStorage.
 * Captured fields: username (from cl_user), IP, location, ISP, user‑agent,
 * current path, suspicion flag, and timestamp.
 */
export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const track = async () => {
      try {
        // Fetch IP and geo info – tolerant to failures.
        let ipInfo: any = null;
        try {
          const res = await fetch('https://ipapi.co/json/');
          ipInfo = await res.json();
        } catch (e) {
          console.error('IP lookup failed', e);
        }

        const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
        const isForeign = ipInfo?.country_code && ipInfo.country_code !== 'ID';
        const isBot = /bot|crawl|spider/i.test(userAgent);
        const isSuspicious = isForeign || isBot;

        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('cl_user') : null;
        const username = storedUser || 'Unknown';

        const payload = {
          username,
          ip: ipInfo?.ip || 'Unknown IP',
          location: ipInfo
            ? `${ipInfo.city || 'Unknown City'}, ${ipInfo.region || ''}, ${ipInfo.country_name || 'Unknown Country'}`
            : 'Unknown Location',
          org: ipInfo?.org || 'Unknown ISP/Org',
          userAgent,
          path: pathname || window.location.pathname,
          isSuspicious,
          countryCode: ipInfo?.country_code || 'XX',
          timestamp: new Date().toISOString(),
        };

        // Store the visit log locally (same array used for login logs).
        pushLoginLog(payload);
      } catch (err) {
        console.error('VisitorTracker error', err);
      }
    };
    track();
  }, [pathname]);

  return null;
}
