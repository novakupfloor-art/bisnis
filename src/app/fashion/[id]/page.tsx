import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getFashionById, getFeaturedFashion } from '@/lib/data/fashion';
import { formatIDR } from '@/lib/utils';
import { Star, ShoppingCart, ChevronRight, ArrowLeft, User } from 'lucide-react';
import FashionClientOptions from '@/components/cart/FashionClientOptions';
import type { Metadata } from 'next';

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = getFashionById(id);
  if (!item) return { title: 'Produk Tidak Ditemukan' };
  return { title: item.name, description: item.description.substring(0, 160) };
}

export default async function FashionDetailPage({ params }: Props) {
  const { id } = await params;
  const item = getFashionById(id);
  if (!item) notFound();

  const related = getFeaturedFashion().filter((f) => f.id !== item.id).slice(0, 4);

  const genderLabel = item.gender === 'pria' ? '👨 Pria' : item.gender === 'wanita' ? '👩 Wanita' : '✨ Unisex';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '14px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <Link href="/fashion" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Fashion</Link>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--text-primary)' }}>{item.name}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <Link href="/fashion" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, marginBottom: 28 }}>
          <ArrowLeft size={16} /> Kembali ke Katalog
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
          {/* IMAGES */}
          <div>
            <div style={{ position: 'relative', height: 520, borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 12 }}>
              <Image src={item.images[0]} alt={item.name} fill style={{ objectFit: 'cover' }} unoptimized />
            </div>
            {item.images.length > 1 && (
              <div style={{ display: 'flex', gap: 10 }}>
                {item.images.slice(1, 3).map((img, i) => (
                  <div key={i} style={{ position: 'relative', width: 110, height: 90, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px solid var(--border-soft)', flexShrink: 0 }}>
                    <Image src={img} alt={item.name} fill style={{ objectFit: 'cover' }} unoptimized />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <span className="badge badge-gray">{item.brand}</span>
              <span className="badge badge-gray">{genderLabel}</span>
              <span className="badge badge-gray">{item.category}</span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>
              {item.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(item.rating) ? 'var(--color-gold)' : 'transparent'} color="var(--color-gold)" />
                ))}
              </div>
              <span style={{ fontWeight: 600 }}>{item.rating}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>({item.reviewCount} ulasan)</span>
            </div>

            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-gold-dark)' }}>{formatIDR(item.price)}</span>
              {item.originalPrice && (
                <span style={{ marginLeft: 12, fontSize: 18, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  {formatIDR(item.originalPrice)}
                </span>
              )}
            </div>

            <FashionClientOptions 
              product={{
                id: item.id,
                type: 'fashion',
                name: item.name,
                price: item.price,
                thumbnail: item.images[0]
              }}
              colors={item.colors}
              sizes={item.sizes}
            />

            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
              <strong>Material:</strong> {item.material}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link href="/studio/fashion-avatar" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                <User size={18} /> Virtual Try-On Avatar
              </Link>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginTop: 56, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: '32px 36px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 16 }}>Deskripsi</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-secondary)' }}>{item.description}</p>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 32 }}>Koleksi Terkait</h2>
            <div className="grid-4">
              {related.map((r) => (
                <Link key={r.id} href={`/fashion/${r.id}`} className="card" style={{ textDecoration: 'none', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', height: 240 }}>
                    <Image src={r.images[0]} alt={r.name} fill style={{ objectFit: 'cover' }} unoptimized />
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{r.brand}</p>
                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>{r.name}</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-gold-dark)' }}>{formatIDR(r.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
