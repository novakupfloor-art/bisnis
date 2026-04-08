"use client";

import { useEffect } from "react";

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      // Hanya track sekali per sesi browser agar tidak spam
      if (sessionStorage.getItem('cl_tracked')) return;
      
      try {
        let ipInfo = null;
        try {
          // Meminta informasi IP address dan lokasi
          const res = await fetch("https://ipapi.co/json/");
          ipInfo = await res.json();
        } catch (e) {
          console.error("Gagal mendapatkan info IP", e);
        }

        const userAgent = window.navigator.userAgent;
        
        // Memeriksa apakah akses dari asing (bukan ID)
        const isForeign = ipInfo?.country_code && ipInfo.country_code !== "ID";
        
        // Memeriksa apakah ada kemungkinan bot/kompetitor
        const isBot = userAgent.toLowerCase().includes('bot') || userAgent.toLowerCase().includes('crawl');
        const isSuspicious = isForeign || isBot;

        let currentUser = 'Guest';
        try {
          const stored = localStorage.getItem("cl_user");
          if (stored) {
            const parsed = JSON.parse(stored);
            currentUser = parsed.key || 'Guest';
          }
        } catch {}

        const payload = {
          username: currentUser,
          ip: ipInfo?.ip || "Unknown IP",
          location: ipInfo ? `${ipInfo.city || 'Unknown City'}, ${ipInfo.region || ''}, ${ipInfo.country_name || 'Unknown Country'}` : "Unknown Location",
          org: ipInfo?.org || "Unknown ISP/Org",
          userAgent: userAgent,
          path: window.location.pathname,
          isSuspicious: isSuspicious ? true : false,
          countryCode: ipInfo?.country_code || 'XX'
        };

        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        sessionStorage.setItem('cl_tracked', 'true');
      } catch (err) {
        console.error("Tracking error:", err);
      }
    };

    trackVisitor();
  }, []);

  return null;
}
