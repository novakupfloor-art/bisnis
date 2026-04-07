'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Star, Heart, X, ChevronDown, User } from 'lucide-react';
import { FASHION } from '@/lib/data/fashion';
import { formatIDR } from '@/lib/utils';

const CATEGORIES = ['Semua', 'outerwear', 'dress', 'kemeja', 'celana', 'sepatu', 'tas', 'aksesori'];
const GENDER_OPTIONS = ['Semua', 'pria', 'wanita', 'unisex'];
const CATEGORY_LABELS: Record<string, string> = {
  outerwear: 'Outerwear',
  dress: 'Dress',
  kemeja: 'Kemeja',
  celana: 'Celana',
  sepatu: 'Sepatu',
  tas: 'Tas',
  aksesori: 'Aksesori',
};

export default function FashionPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [activeGender, setActiveGender] = useState('Semua');
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return FASHION.filter((f) => {
      if (activeCategory !== 'Semua' && f.category !== activeCategory) return false;
      if (activeGender !== 'Semua' && f.gender !== activeGender) return false;
      if (query && !f.name.toLowerCase().includes(query.toLowerCase()) && !f.brand.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, activeCategory, activeGender]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Page Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '40px 0 32px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ color: 'var(--color-gold)', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>
                Fashion & Aksesori
              </p>
              <h1 className="text-h1" style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>
                Koleksi Terkurasi
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
                Fashion premium dengan teknologi avatar virtual try-on.
              </p>
            </div>
            <Link href="/studio/fashion-avatar" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={16} /> Avatar Try-On
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {/* Search */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
            <input
              type="text"
              className="input"
              placeholder="Cari brand, produk..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ paddingLeft: 48 }}
            />
          </div>

          {/* Gender Filter */}
          <div style={{ display: 'flex', gap: 6 }}>
            {GENDER_OPTIONS.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGender(g)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: '1.5px solid',
                  borderColor: activeGender === g ? 'var(--color-gold)' : 'var(--border-color)',
                  background: activeGender === g ? 'var(--color-gold)' : 'white',
                  color: activeGender === g ? '#1A1A2E' : 'var(--text-secondary)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                {g === 'Semua' ? 'Semua' : g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>

          {(query || activeCategory !== 'Semua' || activeGender !== 'Semua') && (
            <button
              onClick={() => { setQuery(''); setActiveCategory('Semua'); setActiveGender('Semua'); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <X size={14} /> Reset
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="scroll-x" style={{ marginBottom: 32, gap: 8 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid',
                borderColor: activeCategory === cat ? 'var(--color-gold)' : 'var(--border-color)',
                background: activeCategory === cat ? 'var(--color-gold)' : 'white',
                color: activeCategory === cat ? '#1A1A2E' : 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {cat === 'Semua' ? 'Semua' : CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        {/* Results */}
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
          Menampilkan <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> produk
        </p>

        {/* Fashion Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {filtered.map((item) => (
            <div key={item.id} className="card" style={{ overflow: 'hidden' }}>
              {/* Image */}
              <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
                <Link href={`/fashion/${item.id}`}>
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    unoptimized
                  />
                </Link>

                {/* Sale Badge */}
                {item.originalPrice && (
                  <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <span className="badge badge-red">Sale</span>
                  </div>
                )}

                {/* Gender Badge */}
                <div style={{ position: 'absolute', top: 12, right: item.originalPrice ? undefined : 12, left: item.originalPrice ? undefined : 12 }}>
                  <span className="badge badge-gray" style={{ background: 'rgba(255,255,255,0.9)', fontSize: 10 }}>
                    {item.gender === 'pria' ? '👨 Pria' : item.gender === 'wanita' ? '👩 Wanita' : '✨ Unisex'}
                  </span>
                </div>

                {/* Save */}
                <button
                  onClick={() => toggleSave(item.id)}
                  style={{
                    position: 'absolute', top: 10, right: 10,
                    width: 32, height: 32,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.95)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <Heart size={14} fill={savedIds.includes(item.id) ? '#EF4444' : 'transparent'} color={savedIds.includes(item.id) ? '#EF4444' : '#9CA3AF'} />
                </button>

                {/* Try-On hover overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(26,26,46,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                >
                  <Link href="/studio/fashion-avatar" className="btn btn-primary btn-sm">
                    Virtual Try-On
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '14px 16px' }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                  {item.brand}
                </p>
                <Link href={`/fashion/${item.id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.3 }}>
                    {item.name}
                  </h3>
                </Link>

                {/* Colors */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                  {item.colors.map((c) => (
                    <div key={c.hex} title={c.name} style={{
                      width: 16, height: 16, borderRadius: '50%',
                      background: c.hex,
                      border: c.hex === '#FFFFFF' ? '1.5px solid #E5E7EB' : 'none',
                    }} />
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-gold-dark)' }}>
                      {formatIDR(item.price)}
                    </p>
                    {item.originalPrice && (
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        {formatIDR(item.originalPrice)}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star size={12} fill="var(--color-gold)" color="var(--color-gold)" />
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{item.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
