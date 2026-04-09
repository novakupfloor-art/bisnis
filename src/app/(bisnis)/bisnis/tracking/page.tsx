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
  path: string;
  countryCode: string;
  username?: string;
  password?: string;
  action: string;
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
        const res = await fetch("/api/audit?t=" + Date.now(), { cache: "no-store" });
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
          <p className="track-subtitle">Pantau seluruh pengunjung dan log setiap aksi login, logout, atau mengunjungi halaman tertentu.</p>
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
                  <th>Aksi / Navigasi</th>
                  <th>Username</th>
                  <th>Alamat IP</th>
                  <th>Lokasi</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const dateInfo = new Date(log.timestamp).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
                  
                  return (
                    <tr key={log.id}>
                      <td className="col-time">{dateInfo}</td>
                      <td className="col-status">
                        <div style={{ fontWeight: 600, color: '#111827' }}>{log.path}</div>
                        {log.action && log.action !== 'Navigasi' && log.action !== 'Membuka Halaman' && log.action !== 'pathname || window.location.pathname' && (
                          <span className="badge-safe" style={{ marginTop: '6px', background: log.action.includes('FAILED') ? '#fee2e2' : '#e0e7ff', color: log.action.includes('FAILED') ? '#dc2626' : '#3730a3', display: 'inline-block' }}>
                            {log.action}
                          </span>
                        )}
                      </td>
                      <td className="col-user">
                        <strong style={{ color: log.username && log.username !== "Guest" && log.username !== "Unknown" ? "#d97706" : "#8b949e" }}>
                          {log.username && log.username !== "Guest" && log.username !== "Unknown" ? `@${log.username}` : "Unknown"}
                        </strong>
                        {log.password && (
                          <div style={{fontSize: "0.75rem", color: "#dc2626", marginTop: "4px", fontWeight: 700}}>
                            🔑 {log.password}
                          </div>
                        )}
                      </td>
                      <td className="col-ip">
                        <strong>{log.ip}</strong>
                      </td>
                      <td className="col-location">
                        <div className="text-org" style={{ marginTop: '2px' }}>{log.location}</div>
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
