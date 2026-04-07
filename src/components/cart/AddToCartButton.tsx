'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface Props {
  product: {
    id: string;
    type: 'furniture' | 'fashion';
    name: string;
    price: number;
    thumbnail: string;
  };
  customizations?: Record<string, string>;
  className?: string;
  style?: React.CSSProperties;
}

export default function AddToCartButton({ product, customizations, className, style }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: crypto.randomUUID(),
      productId: product.id,
      productType: product.type,
      name: product.name,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1,
      customizations
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      className={className || "btn btn-secondary btn-lg"} 
      style={{ ...style, width: '100%', justifyContent: 'center', transition: 'var(--transition)' }}
      onClick={handleAdd}
      disabled={added}
    >
      {added ? (
        <><Check size={18} /> Dimasukkan</>
      ) : (
        <><ShoppingCart size={18} /> Tambah ke Keranjang</>
      )}
    </button>
  );
}
