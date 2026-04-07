'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import config from '@/lib/config';

export default function RegisterPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        width: '100%', maxWidth: 440,
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '44px 40px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
      }}>
        {/* Logo + Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, background: 'var(--color-gold)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: '#1A1A2E', margin: '0 auto 14px' }}>C</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
            Daftar ke {config.appName}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Sudah punya akun?{' '}
            <Link href="/auth/login" style={{ color: 'var(--color-gold-dark)', fontWeight: 600, textDecoration: 'none' }}>Masuk</Link>
          </p>
        </div>

        {/* Steps Indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {[1, 2].map((s) => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= s ? 'var(--color-gold)' : 'var(--border-color)', transition: 'var(--transition)' }} />
          ))}
        </div>

        {step === 1 ? (
          <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 7 }}>Nama Lengkap</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input id="reg-name" type="text" className="input" placeholder="Nama lengkap Anda" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={{ paddingLeft: 44 }} required />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 7 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input id="reg-email" type="email" className="input" placeholder="email@kamu.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} style={{ paddingLeft: 44 }} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15, marginTop: 8 }}>
              Lanjut <ArrowRight size={16} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>atau</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
            </div>
            <button type="button" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.25-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
              </svg>
              Daftar dengan Google
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 7 }}>Nomor WhatsApp</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input id="reg-phone" type="tel" className="input" placeholder="08xxxxxxxxxx" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} style={{ paddingLeft: 44 }} required />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 7 }}>Buat Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input id="reg-password" type={showPwd ? 'text' : 'password'} className="input" placeholder="Min. 8 karakter" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} style={{ paddingLeft: 44, paddingRight: 44 }} required minLength={8} />
                <button type="button" onClick={() => setShowPwd((v) => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Min. 8 karakter dengan kombinasi huruf dan angka</p>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Dengan mendaftar, Anda menyetujui{' '}
              <Link href="#" style={{ color: 'var(--color-gold-dark)', textDecoration: 'none', fontWeight: 600 }}>Syarat Layanan</Link>
              {' '}dan{' '}
              <Link href="#" style={{ color: 'var(--color-gold-dark)', textDecoration: 'none', fontWeight: 600 }}>Kebijakan Privasi</Link>
              {' '}CerdasLiving.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>← Kembali</button>
              <button id="reg-submit" type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center' }}>
                {loading ? 'Mendaftar...' : 'Buat Akun'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
