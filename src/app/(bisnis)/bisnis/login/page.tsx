"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const VALID_USERS: Record<string, { display: string; emoji: string; role: string; password?: string }> = {
  ian: { display: "Ian", emoji: "👤", role: "member" },
  dody: { display: "Dody", emoji: "👤", role: "member" },
  ceo: { display: "CEO", emoji: "🛡️", role: "admin", password: "ceocerdasliving" },
};

export default function BisnisLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    try {
      if (localStorage.getItem("cl_user")) router.replace("/bisnis");
    } catch { }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const key = username.trim().toLowerCase();

    const processTracking = (statusText: string) => {
      fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: statusText,
          path: `/bisnis/login`,
          username: username || "Guest",
          password: password || "Empty"
        })
      }).catch(() => {});
    };

    setTimeout(() => {
      const user = VALID_USERS[key];

      if (!user) {
        processTracking("LOGIN FAILED - USER TIDAK DIKENALI");
        setError("Username tidak dikenali.");
        setLoading(false);
        return;
      }
      
      const expectedPassword = user.password || key;
      if (password.trim().toLowerCase() !== expectedPassword.toLowerCase()) {
        processTracking("LOGIN FAILED - BATAL PASSWORD SALAH");
        setError("Password salah.");
        setLoading(false);
        return;
      }

      processTracking("LOGIN SUCCESS");

      try {
        localStorage.setItem("cl_user", JSON.stringify({ key, display: user.display, emoji: user.emoji, role: user.role }));
        document.cookie = `cl_session=${key}; path=/; max-age=86400; SameSite=Lax`;
      } catch { }
      
      router.replace("/bisnis");
    }, 600);
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        .bl-root {
          min-height: 100vh;
          background: #f4f6fa;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
        }
        .bl-orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .bl-orb-1 {
          width: 560px; height: 560px;
          top: -200px; left: -180px;
          background: radial-gradient(circle, rgba(16,185,129,0.09) 0%, transparent 70%);
        }
        .bl-orb-2 {
          width: 480px; height: 480px;
          bottom: -160px; right: -160px;
          background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%);
        }
        .bl-card {
          position: relative;
          z-index: 1;
          background: #ffffff;
          border: 1px solid #e8ecf3;
          border-radius: 24px;
          padding: 2.75rem 2.5rem;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.05);
        }
        .bl-brand {
          text-align: center;
          margin-bottom: 1.75rem;
        }
        .bl-logo {
          font-size: 2.75rem;
          margin-bottom: 0.6rem;
          display: block;
          line-height: 1;
        }
        .bl-title {
          font-size: 1.8rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #0d1b2a;
          margin-bottom: 0.2rem;
        }
        .bl-subtitle {
          font-size: 0.84rem;
          color: #8b97b1;
          font-weight: 500;
        }
        .bl-divider {
          height: 1px;
          background: #e8ecf3;
          margin: 1.4rem 0;
        }
        .bl-form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .bl-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .bl-label {
          font-size: 0.76rem;
          font-weight: 700;
          color: #4a5568;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .bl-input {
          padding: 0.72rem 1rem;
          border-radius: 10px;
          border: 1.5px solid #e8ecf3;
          background: #f4f6fa;
          font-size: 0.92rem;
          color: #0d1b2a;
          font-family: inherit;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          outline: none;
          width: 100%;
        }
        .bl-input:focus {
          border-color: #10b981;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
        }
        .bl-pass-wrap {
          position: relative;
        }
        .bl-pass-wrap .bl-input {
          padding-right: 3rem;
        }
        .bl-eye {
          position: absolute;
          right: 0.8rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          padding: 0;
          line-height: 1;
          color: #8b97b1;
        }
        .bl-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 0.65rem 1rem;
          font-size: 0.82rem;
          color: #dc2626;
          font-weight: 600;
        }
        .bl-btn {
          padding: 0.9rem 1.5rem;
          background: linear-gradient(135deg, #0d1b2a 0%, #1e3a5f 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.18s, transform 0.18s, box-shadow 0.18s;
          margin-top: 0.35rem;
          box-shadow: 0 4px 14px rgba(13,27,42,0.25);
        }
        .bl-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(13,27,42,0.3);
        }
        .bl-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .bl-hint {
          margin-top: 1.1rem;
          padding: 0.75rem 1rem;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 10px;
          font-size: 0.75rem;
          color: #065f46;
          line-height: 1.6;
        }
        .bl-hint strong {
          font-weight: 800;
        }
        .bl-footer {
          text-align: center;
          font-size: 0.71rem;
          color: #c0c8d8;
          margin-top: 1.5rem;
        }
      `}</style>

      <div className="bl-root">
        <div className="bl-orb bl-orb-1" />
        <div className="bl-orb bl-orb-2" />

        <div className="bl-card">
          <div className="bl-brand">
            <span className="bl-logo">🏠</span>
            <h1 className="bl-title">CerdasLiving</h1>
            <p className="bl-subtitle">Business Strategy Dashboard</p>
          </div>

          <div className="bl-divider" />

          <form onSubmit={handleLogin} className="bl-form">
            <div className="bl-field">
              <label className="bl-label" htmlFor="login-username">Username</label>
              <input
                id="login-username"
                type="text"
                className="bl-input"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                autoComplete="username"
                placeholder="silahkan tulis username anda"
                required
              />
            </div>

            <div className="bl-field">
              <label className="bl-label" htmlFor="login-password">Password</label>
              <div className="bl-pass-wrap">
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  className="bl-input"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  className="bl-eye"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div className="bl-error" role="alert">⚠️ {error}</div>
            )}

            <button id="login-submit" type="submit" className="bl-btn" disabled={loading}>
              {loading ? "⏳ Memverifikasi..." : "Masuk ke Dashboard →"}
            </button>
          </form>



          <p className="bl-footer">
            Platform Strategi Bisnis CerdasLiving &copy; 2026
          </p>
        </div>
      </div>
    </>
  );
}
