'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AuthCtaHome() {
  const [state, setState] = useState<{ mounted: boolean; isLoggedIn: boolean }>({
    mounted: false,
    isLoggedIn: false,
  });

  useEffect(() => {
    let isLoggedIn = false;
    try {
      isLoggedIn = !!localStorage.getItem('cl_user');
    } catch {}
    // Single setState call – tidak ada cascading render
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ mounted: true, isLoggedIn });
  }, []);

  if (!state.mounted) return <div style={{ height: 60 }} />;

  return (
    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
      <Link href="/properti" className="btn btn-primary btn-lg">
        Jelajahi Properti <ArrowRight size={18} />
      </Link>
      
      {state.isLoggedIn ? (
        <Link href="/bisnis" className="btn btn-lg" style={{
          background: 'var(--color-primary)',
          color: 'white',
          border: '2px solid var(--color-primary)',
          padding: '16px 32px',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          fontSize: 16,
        }}>
          Dashboard Anda
        </Link>
      ) : (
        <Link href="/bisnis/login" className="btn btn-lg" style={{
          background: 'transparent',
          color: 'white',
          border: '2px solid rgba(255,255,255,0.4)',
          padding: '16px 32px',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          fontSize: 16,
        }}>
          Daftar Gratis
        </Link>
      )}
    </div>
  );
}
