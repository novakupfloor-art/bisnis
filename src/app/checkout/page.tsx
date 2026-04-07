'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { formatIDR } from '@/lib/utils';
import { ChevronRight, ArrowLeft, CreditCard, Wallet, Building2, CheckCircle2 } from 'lucide-react';
import config from '@/lib/config';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getTotalItems } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

  useEffect(() => {
    setIsMounted(true);
    // Jika tidak ada item di keranjang tapi bukan SSR, redirect kembali
    const hasItems = useCartStore.getState().items.length > 0;
    if (isMounted && !hasItems) {
      router.replace('/cart');
    }
  }, [isMounted, router]);

  if (!isMounted || items.length === 0) return null;

  const subtotal = getSubtotal();
  const ppn = subtotal * 0.11;
  const total = subtotal + ppn;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulasi proses bayar (mock API call)
    await new Promise(r => setTimeout(r, 1500));
    
    // Redirect ke Success (hapus cart akan dilakukan di halaman success agar animasi lancar)
    router.push('/checkout/success');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Cepat Checkout Header */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border-color)', padding: '20px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--color-primary)', textDecoration: 'none' }}>
            {config.appName}
          </Link>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Checkout Aman</span>
            <CheckCircle2 size={16} color="var(--color-gold)" />
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <Link href="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, marginBottom: 28 }}>
          <ArrowLeft size={16} /> Kembali ke Keranjang
        </Link>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Pembayaran</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 40, alignItems: 'start' }}>
          
          {/* Kolom Kiri - FOrm */}
          <form id="checkout-form" onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            
            {/* Informasi Pengiriman */}
            <div style={{ background: 'white', padding: 32, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>1. Informasi Pengiriman</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Nama Lengkap</label>
                  <input type="text" className="input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Email</label>
                  <input type="email" className="input" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Nomor Telepon</label>
                  <input type="tel" className="input" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}/>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Alamat Lengkap</label>
                  <textarea className="input" rows={3} required style={{ resize: 'none' }} value={form.address} onChange={e => setForm({...form, address: e.target.value})}></textarea>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Kota / Kabupaten</label>
                  <input type="text" className="input" required value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Kode Pos</label>
                  <input type="text" className="input" required value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div style={{ background: 'white', padding: 32, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>2. Metode Pembayaran</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { id: 'bank_transfer', label: 'Transfer Virtual Account (BCA, Mandiri, BRI)', icon: <Building2 size={20} /> },
                  { id: 'credit_card', label: 'Kartu Kredit / Debit', icon: <CreditCard size={20} /> },
                  { id: 'ewallet', label: 'E-Wallet (GoPay, OVO, ShopeePay)', icon: <Wallet size={20} /> },
                ].map((method) => (
                  <label 
                    key={method.id} 
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', 
                      border: paymentMethod === method.id ? '2px solid var(--color-gold)' : '1px solid var(--border-color)', 
                      borderRadius: 'var(--radius-md)', background: paymentMethod === method.id ? 'rgba(201,168,76,0.05)' : 'white',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value={method.id} 
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      style={{ width: 18, height: 18, accentColor: 'var(--color-gold)' }}
                    />
                    <div style={{ color: paymentMethod === method.id ? 'var(--color-gold-dark)' : 'var(--text-secondary)' }}>
                      {method.icon}
                    </div>
                    <span style={{ fontSize: 15, fontWeight: paymentMethod === method.id ? 600 : 500 }}>
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: 18 }}>
              {loading ? 'Memproses Pesanan...' : `Bayar ${formatIDR(total)} Sekarang`}
            </button>
            
          </form>

          {/* Kolom Kanan - Summary */}
          <div style={{ position: 'sticky', top: 32 }}>
            <div style={{ background: 'white', padding: 24, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Order Summary</h3>
              
              {/* Item List (Mini) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24, borderBottom: '1px solid var(--border-color)', paddingBottom: 24, maxHeight: 300, overflowY: 'auto' }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 64, height: 64, position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--bg-secondary)', flexShrink: 0 }}>
                      <Image src={item.thumbnail} alt={item.name} fill style={{ objectFit: 'cover' }} unoptimized />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h4>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.quantity} x {formatIDR(item.price)}</div>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {formatIDR(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)' }}>
                  <span>Subtotal ({getTotalItems()} item)</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{formatIDR(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)' }}>
                  <span>PPN (11%)</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{formatIDR(ppn)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)' }}>
                  <span>Pengiriman</span>
                  <span style={{ color: 'var(--color-gold-dark)', fontWeight: 500 }}>Gratis</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 20, borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>Total Dibayar</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-primary)' }}>{formatIDR(total)}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24, justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              <span>Transaksi dienkripsi penuh</span>
              •
              <span>Pembayaran Aman SSL</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
