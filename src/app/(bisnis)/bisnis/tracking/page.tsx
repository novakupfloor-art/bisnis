"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./tracking.css";

interface TrackLog {
  id: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  location: string;
  org: string;
  path: string;
  isSuspicious: boolean;
  countryCode: string;
  username?: string;
}

export default function TrackingDashboard() {
  const router = useRouter();
  const [logs, setLogs] = useState<TrackLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("cl_user");
      if (!stored) {
        router.replace("/bisnis/login");
        return;
      }
      const user = JSON.parse(stored);
      if (user.role !== "admin") {
        router.replace("/bisnis");
      }
    } catch {
      router.replace("/bisnis/login");
    }
  }, [router]);

  useEffect(() => {
    if (!mounted) return;
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/track?t=" + Date.now(), { cache: "no-store" });
        if (!res.ok) throw new Error("Gagal mengambil data tracking.");
        const data = await res.json();
        if (data.success) {
          setLogs(data.data);
        } else {
          setError(data.error);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Terjadi kesalahan.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="track-root">
      <div className="track-header">
        <div>
          <h1 className="track-title">🛡️ Sistem Pengawasan Akses (CEO)</h1>
          <p className="track-subtitle">Pantau seluruh pengunjung dan verifikasi apakah ada pihak asing atau kompetitor yang mengakses CerdasLiving secara mencurigakan.</p>
        </div>
        <Link href="/bisnis" className="back-btn">← Kembali ke Dashboard</Link>
      </div>

      <div className="track-container">
        {loading ? (
          <div className="loading-state">⏳ Mengambil data sensor pengawasan...</div>
        ) : error ? (
          <div className="error-state">❌ {error}</div>
        ) : logs.length === 0 ? (
          <div className="empty-state">Belum ada data tracking tersimpan.</div>
        ) : (
          <div className="table-wrapper">
            <table className="track-table">
              <thead>
                <tr>
                  <th>Waktu (WIB)</th>
                  <th>Username</th>
                  <th>Alamat IP</th>
                  <th>Lokasi (ISP / Org)</th>
                  <th>Asal Negara</th>
                  <th>Browser / Perangkat</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const dateInfo = new Date(log.timestamp).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
                  return (
                    <tr key={log.id} className={log.isSuspicious ? "row-suspicious" : ""}>
                      <td className="col-time">{dateInfo}</td>
                      <td className="col-user">
                        <strong style={{ color: log.username && log.username !== "Guest" && log.username !== "Unknown" ? "#d97706" : "#8b949e" }}>
                          {log.username && log.username !== "Guest" && log.username !== "Unknown" ? `@${log.username}` : "Unknown"}
                        </strong>
                        <div style={{fontSize: "0.75rem", color: "#8b949e", marginTop: "4px"}}>{log.path}</div>
                      </td>
                      <td className="col-ip">
                        <strong>{log.ip}</strong>
                      </td>
                      <td className="col-location">
                        <div>{log.location}</div>
                        <div className="text-org">{log.org}</div>
                      </td>
                      <td className="col-country">
                        {log.countryCode === 'ID' ? '🇮🇩 Indonesia' : `🌏 ${log.countryCode} (Asing)`}
                      </td>
                      <td className="col-agent" title={log.userAgent}>
                        {log.userAgent.length > 50 ? `${log.userAgent.substring(0, 50)}...` : log.userAgent}
                      </td>
                      <td className="col-status">
                        {log.isSuspicious ? (
                          <span className="badge-danger">🚨 Pihak Asing/Bot</span>
                        ) : (
                          <span className="badge-safe">✅ Aman (Lokal)</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
