import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getFurnitureById, getFeaturedFurniture } from '@/lib/data/furniture';
import { formatIDR } from '@/lib/utils';
import { waLink } from '@/lib/config';
import { Star, Box, ShoppingCart, ChevronRight, ArrowLeft, Check } from 'lucide-react';
import AddToCartButton from '@/components/cart/AddToCartButton';
import type { Metadata } from 'next';

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = getFurnitureById(id);
  if (!item) return { title: 'Produk Tidak Ditemukan' };
  return { title: item.name, description: item.description.substring(0, 160) };
}

export default async function FurnitureDetailPage({ params }: Props) {
  const { id } = await params;
  const item = getFurnitureById(id);
  if (!item) notFound();

  const related = getFeaturedFurniture().filter((f) => f.id !== item.id).slice(0, 4);
  const waMsg = waLink(`Halo, saya tertarik dengan produk "${item.name}" (SKU: ${item.sku}). Apakah masih tersedia?`);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '14px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <Link href="/furniture" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Furniture</Link>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--text-primary)' }}>{item.name}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <Link href="/furniture" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, marginBottom: 28 }}>
          <ArrowLeft size={16} /> Kembali ke Katalog
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
          {/* IMAGES */}
          <div>
            <div style={{ position: 'relative', height: 440, borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 16 }}>
              <Image src={item.images[0]} alt={item.name} fill style={{ objectFit: 'cover' }} unoptimized />
              {item.discount && (
                <div style={{ position: 'absolute', top: 16, left: 16 }}>
                  <span className="badge badge-red">-{item.discount}%</span>
                </div>
              )}
            </div>
            {item.images.length > 1 && (
              <div style={{ display: 'flex', gap: 10 }}>
                {item.images.slice(1, 4).map((img, i) => (
                  <div key={i} style={{ position: 'relative', width: 100, height: 80, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px solid var(--border-soft)', flexShrink: 0 }}>
                    <Image src={img} alt={`${item.name} ${i + 2}`} fill style={{ objectFit: 'cover' }} unoptimized />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
              {item.brand} · SKU: {item.sku}
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 16, lineHeight: 1.2 }}>
              {item.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(item.rating) ? 'var(--color-gold)' : 'transparent'} color="var(--color-gold)" />
                ))}
              </div>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{item.rating}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>({item.reviewCount} ulasan)</span>
              {item.stock > 0
                ? <span className="badge badge-green"><Check size={10} /> Stok: {item.stock}</span>
                : <span className="badge badge-red">Habis</span>}
            </div>

            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-gold-dark)' }}>{formatIDR(item.price)}</span>
              {item.originalPrice && (
                <span style={{ marginLeft: 12, fontSize: 18, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  {formatIDR(item.originalPrice)}
                </span>
              )}
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Pilihan Warna:</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {item.colors.map((c) => (
                  <div key={c.hex} title={c.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: c.hex, border: c.hex === '#FFFFFF' ? '2px solid #E5E7EB' : '2px solid transparent', cursor: 'pointer' }} />
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              {item.style.map((s) => <span key={s} className="badge badge-gray">{s}</span>)}
            </div>

            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: 24 }}>
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10, color: 'var(--text-muted)' }}>Dimensi Produk</p>
              <div style={{ display: 'flex', gap: 24, fontSize: 14 }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Lebar: </span><strong>{item.model3d.dimensions.width} cm</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Tinggi: </span><strong>{item.model3d.dimensions.height} cm</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Dalam: </span><strong>{item.model3d.dimensions.depth} cm</strong></div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '14px 20px', marginBottom: 24 }}>
              <p style={{ fontSize: 13 }}><strong>Material:</strong> {item.materials.join(' · ')}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link href={`/studio/furniture-3d/demo?product=${item.id}`} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                <Box size={18} /> Coba Virtual 3D
              </Link>
              <AddToCartButton 
                product={{
                  id: item.id,
                  type: 'furniture',
                  name: item.name,
                  price: item.price,
                  thumbnail: item.images[0]
                }} 
              />
              <a href={waMsg} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                💬 Tanya via WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginTop: 56, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: '32px 36px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 16 }}>Deskripsi Produk</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-secondary)' }}>{item.description}</p>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 32 }}>Produk Terkait</h2>
            <div className="grid-4">
              {related.map((r) => (
                <Link key={r.id} href={`/furniture/${r.id}`} className="card" style={{ textDecoration: 'none', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', height: 180 }}>
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
