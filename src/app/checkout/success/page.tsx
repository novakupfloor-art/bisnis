'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import config from '@/lib/config';

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore(state => state.clearCart);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    // Generate random order ID on mount to avoid hydration mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrderId('INV-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'));
    
    // Clear cart after a small delay so it doesn't instantly flash
    const timer = setTimeout(() => {
      clearCart();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [clearCart]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '64px 40px', borderRadius: 'var(--radius-xl)', boxShadow: '0 24px 80px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: 500, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <CheckCircle size={80} color="var(--color-green)" strokeWidth={1.5} />
        </div>
        
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, marginBottom: 12 }}>Pesanan Berhasil!</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 8 }}>
          Terima kasih telah berbelanja di {config.appName}. Pesanan Anda sedang kami proses.
        </p>
        
        <div style={{ background: 'var(--bg-secondary)', padding: '16px 24px', borderRadius: 'var(--radius-md)', display: 'inline-block', marginBottom: 40, marginTop: 16 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>ID Pesanan</span>
          <strong style={{ fontSize: 18, color: 'var(--text-primary)', letterSpacing: '1px' }}>{orderId || 'INV-......'}</strong>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link href="/properti" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', gap: 8 }}>
            <Home size={18} /> Kembali ke Beranda
          </Link>
          <Link href="/furniture" className="btn btn-secondary btn-lg" style={{ width: '100%', justifyContent: 'center', gap: 8 }}>
            <ShoppingBag size={18} /> Lanjut Belanja
          </Link>
        </div>
      </div>
    </div>
  );
}
