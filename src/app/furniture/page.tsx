'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Star, Box, Heart, ChevronDown, X } from 'lucide-react';
import { FURNITURE } from '@/lib/data/furniture';
import { formatIDR } from '@/lib/utils';
import type { FurnitureFilter } from '@/types';

const CATEGORIES = ['Semua', 'sofa', 'meja', 'kursi', 'tempat_tidur', 'lemari', 'rak', 'dekorasi', 'lampu'];
const STYLES = ['Semua', 'scandinavian', 'modern', 'minimalist', 'industrial', 'japandi', 'luxury', 'art-deco', 'tropical'];
const BRANDS = ['Semua', 'ArteLiving', 'Kayu Kita', 'SleepCraft', 'SpaceMaxx', 'ErgoCraft', 'LumenCraft', 'SoftHome'];

const CATEGORY_LABELS: Record<string, string> = {
  sofa: 'Sofa',
  meja: 'Meja',
  kursi: 'Kursi',
  tempat_tidur: 'Tempat Tidur',
  lemari: 'Lemari',
  rak: 'Rak',
  dekorasi: 'Dekorasi',
  lampu: 'Lampu',
};

export default function FurniturePage() {
  const [filter, setFilter] = useState<FurnitureFilter>({ category: 'semua' });
  const [query, setQuery] = useState('');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('Semua');

  const filtered = useMemo(() => {
    return FURNITURE.filter((f) => {
      if (activeCategory !== 'Semua' && f.category !== activeCategory) return false;
      if (filter.style && filter.style !== 'Semua' && !f.style.includes(filter.style)) return false;
      if (filter.brand && filter.brand !== 'Semua' && f.brand !== filter.brand) return false;
      if (query && !f.name.toLowerCase().includes(query.toLowerCase()) && !f.brand.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [filter, query, activeCategory]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Page Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '40px 0 32px' }}>
        <div className="container">
          <p style={{ color: 'var(--color-gold)', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>
            Marketplace Furniture
          </p>
          <h1 className="text-h1" style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>
            Furniture Premium
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Koleksi furniture eksklusif dari brand terpilih. Coba virtual 3D sebelum beli.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {/* Search + Filters Row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-wrapper" style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
            <input
              type="text"
              className="input"
              placeholder="Cari furniture, brand..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ paddingLeft: 48 }}
            />
          </div>

          {/* Style Filter */}
          <div style={{ position: 'relative' }}>
            <select
              className="input"
              style={{ paddingRight: 36, appearance: 'none', cursor: 'pointer', minWidth: 160 }}
              value={filter.style || 'Semua'}
              onChange={(e) => setFilter((f) => ({ ...f, style: e.target.value }))}
            >
              {STYLES.map((s) => <option key={s} value={s}>{s === 'Semua' ? 'Style: Semua' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
          </div>

          {/* Brand Filter */}
          <div style={{ position: 'relative' }}>
            <select
              className="input"
              style={{ paddingRight: 36, appearance: 'none', cursor: 'pointer', minWidth: 160 }}
              value={filter.brand || 'Semua'}
              onChange={(e) => setFilter((f) => ({ ...f, brand: e.target.value }))}
            >
              {BRANDS.map((b) => <option key={b} value={b}>{b === 'Semua' ? 'Brand: Semua' : b}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
          </div>

          {/* Reset */}
          {(query || filter.style !== undefined || filter.brand !== undefined || activeCategory !== 'Semua') && (
            <button
              onClick={() => { setQuery(''); setFilter({}); setActiveCategory('Semua'); }}
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

        {/* Results Count */}
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
          Menampilkan <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> produk
        </p>

        {/* Furniture Grid */}
        <div className="grid-4">
          {filtered.map((item) => (
            <div key={item.id} className="card" style={{ overflow: 'hidden' }}>
              {/* Image */}
              <div style={{ position: 'relative', height: 220, overflow: 'hidden', display: 'block' }}>
                <Link href={`/furniture/${item.id}`} style={{ display: 'block', position: 'relative', height: '100%' }}>
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    unoptimized
                  />
                </Link>

                {/* Discount Badge */}
                {item.discount && (
                  <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <span className="badge badge-red">-{item.discount}%</span>
                  </div>
                )}

                {/* Save button */}
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

                {/* Try-3D Badge */}
                <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
                  <span className="badge badge-navy" style={{ fontSize: 10 }}>
                    <Box size={10} /> 3D Ready
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div style={{ padding: '16px 16px 14px' }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                  {item.brand}
                </p>
                <Link href={`/furniture/${item.id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.35 }}>
                    {item.name}
                  </h3>
                </Link>

                {/* Style Tags */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
                  {item.style.slice(0, 2).map((s) => (
                    <span key={s} className="badge badge-gray" style={{ fontSize: 10, padding: '2px 8px' }}>
                      {s}
                    </span>
                  ))}
                </div>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <Star size={12} fill="var(--color-gold)" color="var(--color-gold)" />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{item.rating}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>({item.reviewCount})</span>
                </div>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-gold-dark)' }}>
                    {formatIDR(item.price)}
                  </span>
                  {item.originalPrice && (
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      {formatIDR(item.originalPrice)}
                    </span>
                  )}
                </div>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link
                    href={`/studio/furniture-3d/demo?product=${item.id}`}
                    className="btn btn-sm btn-secondary"
                    style={{ flex: 1, fontSize: 12 }}
                  >
                    <Box size={12} /> Coba 3D
                  </Link>
                  <Link href={`/furniture/${item.id}`} className="btn btn-sm btn-primary" style={{ flex: 1, fontSize: 12 }}>
                    Beli
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
