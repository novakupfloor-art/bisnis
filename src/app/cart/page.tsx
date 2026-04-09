'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2, ChevronRight, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatIDR } from '@/lib/utils';
import config from '@/lib/config';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getSubtotal, getTotalItems } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Mencegah hydration mismatch

  const subtotal = getSubtotal();
  const ppn = subtotal * 0.11; // PPN 11%
  const total = subtotal + ppn;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Breadcrumb Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '14px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--text-primary)' }}>Keranjang Belanja</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Keranjang Anda</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
          {items.length > 0 ? `Anda memiliki ${getTotalItems()} item di dalam keranjang.` : 'Keranjang belanja Anda masih kosong.'}
        </p>

        {items.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '80px 20px', textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, background: 'var(--bg-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--text-muted)' }}>
              <ShoppingCart size={32} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 12 }}>Keranjang Kosong</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto 32px' }}>
              Anda belum menambahkan produk apa pun ke dalam keranjang belanja. Telusuri katalog kami untuk menemukan produk premium untuk ruangan Anda.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link href="/furniture" className="btn btn-primary">Belanja Furniture</Link>
              <Link href="/fashion" className="btn btn-secondary">Belanja Fashion</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
            
            {/* Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: 20, background: 'white', padding: 24, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                  {/* Thumbnail */}
                  <div style={{ width: 120, height: 120, position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-secondary)', flexShrink: 0 }}>
                    {item.thumbnail ? (
                      <Image src={item.thumbnail} alt={item.name} fill style={{ objectFit: 'cover' }} unoptimized />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <ShoppingCart size={24} />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <Link href={`/${item.productType}/${item.productId}`} style={{ textDecoration: 'none' }}>
                          <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{item.name}</h3>
                        </Link>
                        {/* Customizations (Color/Size) */}
                        {item.customizations && Object.entries(item.customizations).length > 0 && (
                          <div style={{ display: 'flex', gap: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
                            {Object.entries(item.customizations).map(([key, val]) => (
                              <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <strong style={{ textTransform: 'capitalize' }}>{key}:</strong>
                                {key === 'color' && val.startsWith('#') ? (
                                  <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: val, border: '1px solid var(--border-color)' }} />
                                ) : (
                                  val
                                )}
                              </span>
                            ))}
                          </div>
                        )}
                        {item.fromDesignId && (
                          <span className="badge badge-gold" style={{ marginTop: 8, display: 'inline-block' }}>Dari Studio 3D</span>
                        )}
                      </div>
                      <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-gold-dark)' }}>
                        {formatIDR(item.price * item.quantity)}
                      </p>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {/* Quantity Control */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                        <button onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1} style={{ background: 'none', border: 'none', padding: '6px 10px', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', color: item.quantity <= 1 ? 'var(--text-muted)' : 'var(--text-primary)', display: 'flex' }}>
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: 14, fontWeight: 600, width: 32, textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex' }}>
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Trash2 size={16} /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Link href="/furniture" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, marginTop: 16 }}>
                <ArrowLeft size={16} /> Lanjut Belanja
              </Link>
            </div>

            {/* Order Summary */}
            <div style={{ position: 'sticky', top: 100, background: 'white', padding: 24, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Ringkasan Pesanan</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24, borderBottom: '1px solid var(--border-color)', paddingBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, color: 'var(--text-secondary)' }}>
                  <span>Subtotal ({getTotalItems()} item)</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{formatIDR(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, color: 'var(--text-secondary)' }}>
                  <span>PPN (11%)</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{formatIDR(ppn)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, color: 'var(--text-secondary)' }}>
                  <span>Biaya Pengiriman</span>
                  <span style={{ color: 'var(--color-gold-dark)', fontWeight: 500 }}>Gratis</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
                <span style={{ fontSize: 16, fontWeight: 600 }}>Total Akhir</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-primary)' }}>{formatIDR(total)}</span>
              </div>

              <button 
                onClick={() => router.push('/checkout')} 
                className="btn btn-primary btn-lg" 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Lanjut ke Pembayaran
              </button>
              
              <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan dari {config.appName}.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
