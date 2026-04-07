'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, Menu, X, Home, Sofa, Shirt, Layers } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

const NAV_ITEMS = [
  { label: 'Properti', href: '/properti' },
  { label: 'Furniture', href: '/furniture' },
  { label: 'Fashion', href: '/fashion' },
  { label: 'Studio 3D', href: '/studio' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setIsMounted(true);
    try {
      if (localStorage.getItem('cl_user')) setIsLoggedIn(true);
    } catch { }
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: 'all 0.3s ease',
          background: scrolled || !isHome
            ? 'rgba(255, 255, 255, 0.95)'
            : 'transparent',
          backdropFilter: scrolled || !isHome ? 'blur(12px)' : 'none',
          borderBottom: scrolled || !isHome ? '1px solid #E5E7EB' : 'none',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: 68, gap: 0 }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36,
              background: 'var(--color-gold)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 18,
              color: '#1A1A2E',
            }}>
              C
            </div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 18,
              color: scrolled || !isHome ? 'var(--color-primary)' : 'white',
              letterSpacing: '-0.3px',
            }}>
              CerdasLiving
            </span>
          </Link>

          {/* Nav Links - Center */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4, margin: '0 auto' }}>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 15,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive
                      ? 'var(--color-gold)'
                      : (scrolled || !isHome ? 'var(--text-primary)' : 'rgba(255,255,255,0.9)'),
                    textDecoration: 'none',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.target as HTMLElement).style.color = 'var(--color-gold)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.target as HTMLElement).style.color = scrolled || !isHome
                        ? 'var(--text-primary)'
                        : 'rgba(255,255,255,0.9)';
                    }
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Search */}
            {searchOpen ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  autoFocus
                  type="text"
                  placeholder="Cari properti, furniture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-color)',
                    fontSize: 14,
                    width: 220,
                    background: 'white',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setSearchOpen(false);
                  }}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: 'var(--text-secondary)', display: 'flex' }}
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  color: scrolled || !isHome ? 'var(--text-primary)' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'var(--transition)',
                }}
              >
                <Search size={20} />
              </button>
            )}

            {/* Cart */}
            <Link href="/cart" style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              color: scrolled || !isHome ? 'var(--text-primary)' : 'white',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              position: 'relative',
            }}>
              <ShoppingCart size={20} />
              {isMounted && totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  width: 18,
                  height: 18,
                  background: 'var(--color-gold)',
                  borderRadius: '50%',
                  fontSize: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1A1A2E',
                  fontWeight: 700,
                  border: scrolled || !isHome ? '2px solid white' : '2px solid transparent',
                }}>
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* CTA Button */}
            {isMounted && isLoggedIn ? (
              <Link href="/bisnis" className="btn btn-primary btn-sm" style={{ marginLeft: 8 }}>
                Dashboard
              </Link>
            ) : (
              <Link href="/bisnis/login" className="btn btn-primary btn-sm" style={{ marginLeft: 8 }}>
                Masuk
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-only"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 8,
                color: scrolled || !isHome ? 'var(--text-primary)' : 'white',
                display: 'none',
              }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          background: 'white',
          paddingTop: 80,
          paddingLeft: 24,
          paddingRight: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-body)',
                fontSize: 18,
                fontWeight: 500,
                color: 'var(--text-primary)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              {item.label === 'Properti' && <Home size={20} />}
              {item.label === 'Furniture' && <Sofa size={20} />}
              {item.label === 'Fashion' && <Shirt size={20} />}
              {item.label === 'Studio 3D' && <Layers size={20} />}
              {item.label}
            </Link>
          ))}
          {isMounted && isLoggedIn ? (
            <Link href="/bisnis" className="btn btn-primary" style={{ marginTop: 16, textAlign: 'center' }}>
              Ke Dashboard
            </Link>
          ) : (
            <Link href="/bisnis/login" className="btn btn-primary" style={{ marginTop: 16, textAlign: 'center' }}>
              Masuk / Daftar
            </Link>
          )}
        </div>
      )}

      {/* Spacer for non-hero pages */}
      {!isHome && <div style={{ height: 68 }} />}
    </>
  );
}
