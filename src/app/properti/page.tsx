'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, SlidersHorizontal, MapPin, BedDouble, Bath, Square, Star, Heart, X, ChevronDown } from 'lucide-react';
import { PROPERTIES } from '@/lib/data/properties';
import { formatIDR } from '@/lib/utils';
import type { Property, PropertyFilter } from '@/types';

const PROPERTY_TYPES = ['Semua', 'rumah', 'apartemen', 'villa', 'komersial', 'tanah'];
const KOTA_OPTIONS = ['Semua Kota', 'Jakarta Selatan', 'Jakarta Utara', 'Bandung', 'Surabaya', 'Badung'];

export default function PropertiPage() {
  const [filter, setFilter] = useState<PropertyFilter>({ status: 'semua', type: 'semua' });
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return PROPERTIES.filter((p) => {
      if (filter.status && filter.status !== 'semua' && p.status !== filter.status) return false;
      if (filter.type && filter.type !== 'semua' && p.type !== filter.type) return false;
      if (filter.kota && filter.kota !== 'Semua Kota' && p.address.kota !== filter.kota) return false;
      if (query && !p.title.toLowerCase().includes(query.toLowerCase()) &&
          !p.address.kota.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [filter, query]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Page Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '40px 0 32px' }}>
        <div className="container">
          <p style={{ color: 'var(--color-gold)', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>
            Properti Premium
          </p>
          <h1 className="text-h1" style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>
            Temukan Hunian Impian
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Koleksi properti pilihan dari seluruh Indonesia
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {/* Search Bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <div className="search-wrapper" style={{ flex: 1, minWidth: 280 }}>
            <Search size={18} className="search-icon" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
            <input
              type="text"
              className="input"
              placeholder="Cari properti, lokasi..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ paddingLeft: 48 }}
            />
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => setShowFilter(!showFilter)}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <SlidersHorizontal size={16} />
            Filter
          </button>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div style={{
            background: 'white',
            border: '1px solid var(--border-soft)',
            borderRadius: 'var(--radius-lg)',
            padding: 24,
            marginBottom: 24,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
          }}>
            {/* Status */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['semua', 'dijual', 'disewa'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter((f) => ({ ...f, status: s as PropertyFilter['status'] }))}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      border: '1.5px solid',
                      borderColor: filter.status === s ? 'var(--color-gold)' : 'var(--border-color)',
                      background: filter.status === s ? 'var(--color-gold)' : 'transparent',
                      color: filter.status === s ? '#1A1A2E' : 'var(--text-secondary)',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                  >
                    {s === 'semua' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tipe</label>
              <div style={{ position: 'relative' }}>
                <select
                  className="input"
                  style={{ paddingRight: 36, appearance: 'none', cursor: 'pointer' }}
                  value={filter.type || 'semua'}
                  onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value as PropertyFilter['type'] }))}
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t.toLowerCase()}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
              </div>
            </div>

            {/* Kota */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kota</label>
              <div style={{ position: 'relative' }}>
                <select
                  className="input"
                  style={{ paddingRight: 36, appearance: 'none', cursor: 'pointer' }}
                  value={filter.kota || 'Semua Kota'}
                  onChange={(e) => setFilter((f) => ({ ...f, kota: e.target.value }))}
                >
                  {KOTA_OPTIONS.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
              </div>
            </div>

            {/* Reset */}
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={() => { setFilter({ status: 'semua', type: 'semua' }); setQuery(''); }}
                className="btn btn-ghost"
                style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-error)', width: '100%', justifyContent: 'center' }}
              >
                <X size={14} /> Reset Filter
              </button>
            </div>
          </div>
        )}

        {/* Quick Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {['semua', 'dijual', 'disewa'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter((f) => ({ ...f, status: s as PropertyFilter['status'] }))}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid',
                borderColor: filter.status === s ? 'var(--color-gold)' : 'var(--border-color)',
                background: filter.status === s ? 'var(--color-gold)' : 'white',
                color: filter.status === s ? '#1A1A2E' : 'var(--text-secondary)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              {s === 'semua' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
          Menampilkan <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> properti
          {query && ` untuk "${query}"`}
        </p>

        {/* Property Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🏠</p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 8 }}>Properti tidak ditemukan</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Coba ubah filter atau kata kunci pencarian</p>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isSaved={savedIds.includes(property.id)}
                onSave={() => toggleSave(property.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PropertyCard({ property, isSaved, onSave }: { property: Property; isSaved: boolean; onSave: () => void }) {
  return (
    <div className="card property-card" style={{ overflow: 'hidden' }}>
      {/* Image */}
      <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
        <Link href={`/properti/${property.id}`}>
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="property-card-image"
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        </Link>

        {/* Featured Badge */}
        {property.isFeatured && (
          <div style={{ position: 'absolute', top: 14, left: 14 }}>
            <span className="badge badge-gold">⭐ Featured</span>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={onSave}
          style={{
            position: 'absolute', top: 12, right: 12,
            width: 36, height: 36,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            transition: 'var(--transition)',
          }}
        >
          <Heart
            size={16}
            fill={isSaved ? '#EF4444' : 'transparent'}
            color={isSaved ? '#EF4444' : '#9CA3AF'}
          />
        </button>

        {/* Status overlay */}
        <div style={{ position: 'absolute', bottom: 14, right: 14 }}>
          <span className={`badge ${property.status === 'dijual' ? 'badge-gold' : 'badge-blue'}`}>
            {property.status === 'dijual' ? 'Dijual' : 'Disewa'}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '20px 20px 16px' }}>
        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
          <MapPin size={12} color="var(--text-muted)" />
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {property.address.kecamatan}, {property.address.kota}
          </p>
        </div>

        {/* Title */}
        <Link href={`/properti/${property.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize: 16, fontWeight: 600, color: 'var(--text-primary)',
            marginBottom: 14, lineHeight: 1.35, fontFamily: 'var(--font-display)',
          }}>
            {property.title}
          </h3>
        </Link>

        {/* Specs */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          {property.specs.kamarTidur > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
              <BedDouble size={14} /> {property.specs.kamarTidur} KT
            </div>
          )}
          {property.specs.kamarMandi > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
              <Bath size={14} /> {property.specs.kamarMandi} KM
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
            <Square size={14} /> {property.specs.luasBangunan}m²
          </div>
        </div>

        {/* Divider */}
        <div className="divider" style={{ margin: '12px 0' }} />

        {/* Price & CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-gold-dark)' }}>
              {formatIDR(property.price)}
            </p>
            {property.priceUnit !== 'total' && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                per {property.priceUnit === 'per_bulan' ? 'bulan' : 'tahun'}
              </p>
            )}
          </div>
          <Link href={`/properti/${property.id}`} className="btn btn-primary btn-sm">
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
