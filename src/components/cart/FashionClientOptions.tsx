'use client';

import { useState } from 'react';
import AddToCartButton from './AddToCartButton';

interface Props {
  product: { id: string; type: 'fashion'; name: string; price: number; thumbnail: string };
  colors: { hex: string; name: string }[];
  sizes: string[];
}

export default function FashionClientOptions({ product, colors, sizes }: Props) {
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '');

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Warna Tersedia:</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {colors.map((c) => (
            <button 
              key={c.hex} 
              title={c.name} 
              onClick={() => setSelectedColor(c.name)} 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <div style={{ 
                width: 30, height: 30, borderRadius: '50%', background: c.hex, 
                border: c.hex === '#FFFFFF' ? '1px solid #E5E7EB' : 'none', 
                boxShadow: selectedColor === c.name ? '0 0 0 2px white, 0 0 0 4px var(--color-gold)' : '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'var(--transition)'
              }} />
              <span style={{ fontSize: 10, color: selectedColor === c.name ? 'var(--color-primary)' : 'var(--text-muted)', fontWeight: selectedColor === c.name ? 700 : 400 }}>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Pilih Ukuran:</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {sizes.map((s) => (
            <button 
              key={s} 
              onClick={() => setSelectedSize(s)} 
              style={{ 
                padding: '8px 18px', borderRadius: 'var(--radius-sm)', border: '1.5px solid', 
                borderColor: selectedSize === s ? 'var(--color-gold)' : 'var(--border-color)', 
                background: selectedSize === s ? 'var(--color-gold)' : 'white', 
                color: selectedSize === s ? '#1A1A2E' : 'inherit', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'var(--transition)' 
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <AddToCartButton 
        product={product}
        customizations={{ color: selectedColor, size: selectedSize }}
      />
    </>
  );
}
