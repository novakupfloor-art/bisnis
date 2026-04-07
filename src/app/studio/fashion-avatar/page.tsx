'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ChevronRight, ShoppingCart, X } from 'lucide-react';
import { FASHION } from '@/lib/data/fashion';
import { formatIDR } from '@/lib/utils';
import type { FashionCategory } from '@/types';

const FASHION_CATEGORIES: { key: FashionCategory | 'semua'; label: string }[] = [
  { key: 'semua', label: 'Semua' },
  { key: 'outerwear', label: 'Outerwear' },
  { key: 'dress', label: 'Dress' },
  { key: 'kemeja', label: 'Kemeja' },
  { key: 'celana', label: 'Celana' },
  { key: 'sepatu', label: 'Sepatu' },
  { key: 'aksesori', label: 'Aksesori' },
  { key: 'tas', label: 'Tas' },
];

const BACKGROUNDS = ['Studio', 'Taman', 'Pantai', 'Urban'];

const SKIN_COLORS = [
  '#FDBCB4', '#E8A98A', '#D4956A', '#C68642', '#A0522D',
];

const HAIR_COLORS = [
  '#2C1810', '#8B4513', '#C9A84C', '#D2691E', '#F5DEB3', '#FFFFFF',
];

interface OutfitState {
  jacket?: { id: string; name: string; price: number; image: string };
  top?: { id: string; name: string; price: number; image: string };
  bottom?: { id: string; name: string; price: number; image: string };
  shoes?: { id: string; name: string; price: number; image: string };
  bag?: { id: string; name: string; price: number; image: string };
  accessories?: { id: string; name: string; price: number; image: string };
}

// Simple SVG Avatar Component
function AvatarSVG({
  height,
  bodyType,
  skinColor,
  hairColor,
  outfit,
}: {
  height: number;
  bodyType: string;
  skinColor: string;
  hairColor: string;
  outfit: OutfitState;
}) {
  const scale = (height - 145) / 55; // 0 to 1
  const bodyWidth = bodyType === 'kurus' ? 28 : bodyType === 'besar' ? 44 : 36;

  return (
    <svg viewBox="0 0 120 300" style={{ width: '100%', height: '100%', maxWidth: 260 }}>
      {/* Hair */}
      <ellipse cx="60" cy="38" rx="24" ry="28" fill={hairColor} />
      
      {/* Head */}
      <circle cx="60" cy="50" r="22" fill={skinColor} />
      
      {/* Neck */}
      <rect x="53" y="70" width="14" height="16" rx="4" fill={skinColor} />

      {/* Torso / Top */}
      <rect
        x={60 - bodyWidth / 2}
        y="83"
        width={bodyWidth}
        height="80"
        rx="8"
        fill={outfit.jacket ? '#1E3A5F' : outfit.top ? '#C2703F' : skinColor}
      />

      {/* Arms */}
      <rect x={60 - bodyWidth / 2 - 16} y="86" width="14" height="68" rx="7" fill={outfit.jacket || outfit.top ? '#9CA3AF' : skinColor} />
      <rect x={60 + bodyWidth / 2 + 2} y="86" width="14" height="68" rx="7" fill={outfit.jacket || outfit.top ? '#9CA3AF' : skinColor} />

      {/* Legs / Bottom */}
      <rect
        x={60 - bodyWidth / 2}
        y="160"
        width={bodyWidth / 2 - 2}
        height="90"
        rx="6"
        fill={outfit.bottom ? '#1E3A5F' : '#374151'}
      />
      <rect
        x={60 + 2}
        y="160"
        width={bodyWidth / 2 - 2}
        height="90"
        rx="6"
        fill={outfit.bottom ? '#1E3A5F' : '#374151'}
      />

      {/* Shoes */}
      <ellipse cx={60 - bodyWidth / 4} cy="252" rx="14" ry="6" fill={outfit.shoes ? '#8B4513' : '#1C1C1C'} />
      <ellipse cx={60 + bodyWidth / 4 + 2} cy="252" rx="14" ry="6" fill={outfit.shoes ? '#8B4513' : '#1C1C1C'} />

      {/* Face features */}
      <circle cx="54" cy="49" r="3" fill="#333" opacity="0.6" />
      <circle cx="66" cy="49" r="3" fill="#333" opacity="0.6" />
      <path d="M 52 58 Q 60 63 68 58" stroke="#333" strokeWidth="1.5" fill="none" opacity="0.6" />

      {/* Accessories */}
      {outfit.accessories && (
        <circle cx="60" cy="80" r="4" fill="#C9A84C" />
      )}

      {/* Bag */}
      {outfit.bag && (
        <rect x={60 + bodyWidth / 2 + 16} y="130" width="18" height="22" rx="4" fill="#C4883A" />
      )}
    </svg>
  );
}

export default function FashionAvatarPage() {
  const [activeCategory, setActiveCategory] = useState<string>('semua');
  const [background, setBackground] = useState('Studio');
  const [height, setHeight] = useState(168);
  const [bodyType, setBodyType] = useState<'kurus' | 'sedang' | 'besar'>('sedang');
  const [skinColor, setSkinColor] = useState(SKIN_COLORS[1]);
  const [hairColor, setHairColor] = useState(HAIR_COLORS[0]);
  const [outfit, setOutfit] = useState<OutfitState>({});

  const filteredFashion = activeCategory === 'semua'
    ? FASHION
    : FASHION.filter((f) => f.category === activeCategory);

  const addToOutfit = (item: typeof FASHION[0]) => {
    const slot = getOutfitSlot(item.category);
    setOutfit((prev) => ({
      ...prev,
      [slot]: { id: item.id, name: item.name, price: item.price, image: item.images[0] },
    }));
  };

  const getOutfitSlot = (category: string): keyof OutfitState => {
    const slots: Record<string, keyof OutfitState> = {
      outerwear: 'jacket',
      dress: 'top',
      kemeja: 'top',
      celana: 'bottom',
      sepatu: 'shoes',
      tas: 'bag',
      aksesori: 'accessories',
    };
    return slots[category] || 'top';
  };

  const outfitSlotLabels: { key: keyof OutfitState; label: string }[] = [
    { key: 'jacket', label: 'Luar / Jaket' },
    { key: 'top', label: 'Atasan' },
    { key: 'bottom', label: 'Bawahan' },
    { key: 'shoes', label: 'Sepatu' },
    { key: 'bag', label: 'Tas' },
    { key: 'accessories', label: 'Aksesori' },
  ];

  const totalOutfitPrice = Object.values(outfit).reduce(
    (sum, item) => sum + (item?.price || 0), 0
  );

  const bgColors: Record<string, string> = {
    Studio: '#2D2D4E',
    Taman: '#1A4D2E',
    Pantai: '#1E3A5F',
    Urban: '#1C1C2E',
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#1a1a2e', overflow: 'hidden' }}>
      {/* Top Bar */}
      <div style={{
        background: '#1a1a2e',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '12px 24px',
        display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0,
      }}>
        <Link href="/studio" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
          <ArrowLeft size={16} /> Studio
        </Link>
        <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
        <span style={{ color: 'white', fontWeight: 600, fontSize: 16 }}>Virtual Avatar Try-On</span>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* LEFT — Fashion Catalog */}
        <div className="studio-panel" style={{ width: 260, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Koleksi Fashion</p>
            <div className="scroll-x" style={{ gap: 5 }}>
              {FASHION_CATEGORIES.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: activeCategory === key ? 'var(--color-gold)' : 'rgba(255,255,255,0.15)',
                    background: activeCategory === key ? 'var(--color-gold)' : 'transparent',
                    color: activeCategory === key ? '#1A1A2E' : 'rgba(255,255,255,0.6)',
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {filteredFashion.map((item) => (
              <div
                key={item.id}
                onClick={() => addToOutfit(item)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  border: '1px solid transparent',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.4)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
                  <Image src={item.images[0]} alt={item.name} width={40} height={40} style={{ objectFit: 'cover' }} unoptimized />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'white', marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                  <p style={{ fontSize: 10, color: 'var(--color-gold)' }}>{formatIDR(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER — Avatar Canvas */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', background: bgColors[background] || '#2D2D4E', position: 'relative', overflow: 'hidden' }}>
          {/* Background Tabs */}
          <div style={{ display: 'flex', gap: 8, padding: '12px 0', position: 'relative', zIndex: 1 }}>
            {BACKGROUNDS.map((bg) => (
              <button
                key={bg}
                onClick={() => setBackground(bg)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: background === bg ? 'var(--color-gold)' : 'rgba(255,255,255,0.2)',
                  background: background === bg ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)',
                  color: background === bg ? '#1A1A2E' : 'white',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {bg}
              </button>
            ))}
          </div>

          {/* Avatar */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px' }}>
            <AvatarSVG
              height={height}
              bodyType={bodyType}
              skinColor={skinColor}
              hairColor={hairColor}
              outfit={outfit}
            />
          </div>

          {/* Height indicator */}
          <div style={{ padding: 12, color: 'rgba(255,255,255,0.6)', fontSize: 13, textAlign: 'center' }}>
            {height} cm
          </div>

          {/* Avatar Controls */}
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(12px)',
            padding: '16px 24px',
            width: '100%',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}>
            {/* Height */}
            <div>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>
                Tinggi: <strong style={{ color: 'white' }}>{height} cm</strong>
              </label>
              <input
                type="range" min="145" max="200" value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Body Type */}
            <div>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>Tipe Tubuh</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['kurus', 'sedang', 'besar'] as const).map((bt) => (
                  <button
                    key={bt}
                    onClick={() => setBodyType(bt)}
                    style={{
                      padding: '4px 10px', borderRadius: 'var(--radius-full)',
                      border: '1px solid',
                      borderColor: bodyType === bt ? 'var(--color-gold)' : 'rgba(255,255,255,0.2)',
                      background: bodyType === bt ? 'var(--color-gold)' : 'transparent',
                      color: bodyType === bt ? '#1A1A2E' : 'rgba(255,255,255,0.7)',
                      fontSize: 11, cursor: 'pointer',
                    }}
                  >
                    {bt.charAt(0).toUpperCase() + bt.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Color */}
            <div>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>Warna Kulit</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {SKIN_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSkinColor(c)}
                    style={{
                      width: 24, height: 24, borderRadius: '50%', background: c, border: skinColor === c ? '2px solid var(--color-gold)' : '2px solid transparent', cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Hair Color */}
            <div>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>Warna Rambut</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {HAIR_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setHairColor(c)}
                    style={{
                      width: 24, height: 24, borderRadius: '50%', background: c,
                      border: hairColor === c ? '2px solid var(--color-gold)' : c === '#FFFFFF' ? '1.5px solid rgba(255,255,255,0.3)' : '2px solid transparent',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Outfit Summary */}
        <div className="studio-panel" style={{ width: 260, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>👤</span>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>Outfit Saya</p>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {outfitSlotLabels.map(({ key, label }) => {
              const item = outfit[key];
              return (
                <div
                  key={key}
                  style={{
                    background: item ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.04)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    border: item ? '1px solid rgba(201,168,76,0.25)' : '1px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontSize: 11, color: 'var(--color-gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                      {label}
                    </p>
                    {item && (
                      <button
                        onClick={() => setOutfit((prev) => { const next = { ...prev }; delete next[key]; return next; })}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,100,100,0.6)', padding: 0 }}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                  {item ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Image src={item.image} alt={item.name} width={36} height={36} style={{ borderRadius: 4, objectFit: 'cover' }} unoptimized />
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'white', lineHeight: 1.3 }}>{item.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--color-gold)' }}>{formatIDR(item.price)}</p>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
                      {label} — belum dipilih
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Total & Checkout */}
          <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Total Outfit</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>{formatIDR(totalOutfitPrice)}</span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: totalOutfitPrice === 0 ? 0.5 : 1 }}
              disabled={totalOutfitPrice === 0}
            >
              <ShoppingCart size={16} /> Checkout Outfit
            </button>

            <Link href="/fashion" style={{
              display: 'block', marginTop: 8, textAlign: 'center', fontSize: 12,
              color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
            }}>
              Lihat Semua Fashion →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
