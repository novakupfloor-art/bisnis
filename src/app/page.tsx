import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Star, Users, Building2, Award, ChevronRight } from 'lucide-react';
import { getFeaturedProperties } from '@/lib/data/properties';
import { getFeaturedFurniture } from '@/lib/data/furniture';
import { getFeaturedFashion } from '@/lib/data/fashion';
import { formatIDR } from '@/lib/utils';
import AuthCtaHome from '@/components/ui/AuthCtaHome';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CerdasLiving — Properti & Lifestyle Premium Indonesia',
  description: 'Wujudkan rumah impianmu bersama CerdasLiving. Temukan properti, furniture eksklusif, dan desain ruangan virtual 3D.',
};

const TESTIMONIALS = [
  {
    id: '1',
    name: 'Anisa Rahmatika',
    role: 'Interior Designer, Jakarta',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    content: 'Studio 3D CerdasLiving mengubah cara saya bekerja. Klien bisa lihat langsung bagaimana furniture akan terlihat sebelum beli. Luar biasa!',
    rating: 5,
  },
  {
    id: '2',
    name: 'Dito Prasetyo',
    role: 'CEO, Bandung',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    content: 'Saya menemukan villa impian di Bali melalui CerdasLiving. Prosesnya mudah, agentnya responsif, dan harganya transparan. Sangat rekomendasikan!',
    rating: 5,
  },
  {
    id: '3',
    name: 'Maya Sari',
    role: 'Arsitek, Surabaya',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    content: 'Floor planner 2D-nya akurat dan mudah digunakan. Saya bisa presentasi denah ke klien langsung dari platform ini. Fitur konversi ke 3D-nya memukau!',
    rating: 5,
  },
];

const STATS = [
  { value: '10.000+', label: 'Pengguna Puas', icon: Users },
  { value: '500+', label: 'Properti Terdaftar', icon: Building2 },
  { value: '2.000+', label: 'Produk Furniture', icon: Award },
  { value: '98%', label: 'Kepuasan Pelanggan', icon: CheckCircle },
];

export default function HomePage() {
  const featuredProperties = getFeaturedProperties().slice(0, 4);
  const featuredFurniture = getFeaturedFurniture().slice(0, 4);
  const featuredFashion = getFeaturedFashion().slice(0, 6);

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section style={{
        position: 'relative',
        height: '100vh',
        minHeight: 600,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        {/* Background Image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=90"
            alt="Interior rumah impian"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
            unoptimized
          />
          {/* Gradient Overlay */}
          <div className="gradient-hero" style={{ position: 'absolute', inset: 0 }} />
        </div>

        {/* Hero Content */}
        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 80 }}>
          <div style={{ maxWidth: 680 }}>
            {/* Badge */}
            <div className="animate-fade-up" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(201,168,76,0.2)',
              border: '1px solid rgba(201,168,76,0.4)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 16px',
              marginBottom: 24,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-gold)', display: 'inline-block' }} />
              <span style={{ color: 'var(--color-gold)', fontSize: 12, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Platform Lifestyle Premium Indonesia
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-hero animate-fade-up delay-100" style={{
              color: 'white',
              marginBottom: 12,
              fontFamily: 'var(--font-display)',
              lineHeight: 1.1,
            }}>
              Wujudkan{' '}
              <span style={{ color: 'var(--color-gold)' }}>Rumah Impianmu</span>
            </h1>

            <p className="animate-fade-up delay-200" style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: 18,
              lineHeight: 1.7,
              marginBottom: 40,
              maxWidth: 560,
            }}>
              Temukan properti impian, rancang ruang dengan virtual 3D,
              pilih furniture eksklusif, dan ekspresikan style hidup Anda
              — semua dalam satu platform terpadu.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/properti" className="btn btn-primary btn-lg">
                Jelajahi Properti
                <ArrowRight size={18} />
              </Link>
              <Link href="/studio" className="btn btn-lg" style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}>
                Coba Studio 3D
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          color: 'rgba(255,255,255,0.5)',
          fontSize: 12,
          letterSpacing: '1px',
        }}>
          <div style={{
            width: 1,
            height: 48,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)',
          }} />
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section style={{ background: 'var(--color-primary)', padding: '32px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
            textAlign: 'center',
          }}>
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <Icon size={24} color="var(--color-gold)" />
                  <p style={{ fontSize: 28, fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.3px' }}>
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROPERTIES ===== */}
      <section className="section">
        <div className="container">
          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
            <div>
              <p style={{ color: 'var(--color-gold)', fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>
                Properti Pilihan
              </p>
              <h2 className="text-h1" style={{ fontFamily: 'var(--font-display)' }}>Hunian Premium</h2>
            </div>
            <Link href="/properti" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: 'var(--color-gold)', fontSize: 14, fontWeight: 600, textDecoration: 'none',
            }}>
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>

          {/* Property Cards */}
          <div className="scroll-x">
            {featuredProperties.map((property) => (
              <Link
                key={property.id}
                href={`/properti/${property.id}`}
                className="card property-card"
                style={{
                  minWidth: 320,
                  maxWidth: 360,
                  textDecoration: 'none',
                  flexShrink: 0,
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="property-card-image"
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                  {/* Status Badge */}
                  <div style={{ position: 'absolute', top: 16, left: 16 }}>
                    <span className={`badge ${property.status === 'dijual' ? 'badge-gold' : 'badge-blue'}`}>
                      {property.status === 'dijual' ? '🏷 Dijual' : '🔑 Disewa'}
                    </span>
                  </div>
                  {/* Type Badge */}
                  <div style={{ position: 'absolute', top: 16, right: 16 }}>
                    <span className="badge badge-gray" style={{ background: 'rgba(255,255,255,0.9)' }}>
                      {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '20px 20px 16px' }}>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    📍 {property.address.kecamatan}, {property.address.kota}
                  </p>
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 12,
                    lineHeight: 1.3,
                    fontFamily: 'var(--font-display)',
                  }}>
                    {property.title}
                  </h3>

                  {/* Specs */}
                  <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                    {property.specs.kamarTidur > 0 && (
                      <span>🛏 {property.specs.kamarTidur} KT</span>
                    )}
                    {property.specs.kamarMandi > 0 && (
                      <span>🚿 {property.specs.kamarMandi} KM</span>
                    )}
                    <span>📐 {property.specs.luasBangunan}m²</span>
                  </div>

                  {/* Price */}
                  <p style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: 'var(--color-gold-dark)',
                    fontFamily: 'var(--font-body)',
                  }}>
                    {formatIDR(property.price)}
                    {property.priceUnit !== 'total' && (
                      <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)' }}>
                        /{property.priceUnit === 'per_bulan' ? 'bln' : 'thn'}
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STUDIO 3D PROMO BANNER ===== */}
      <section style={{ background: 'var(--bg-secondary)', padding: '64px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 48,
            alignItems: 'center',
            background: 'var(--color-primary)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            minHeight: 340,
          }}>
            {/* Content */}
            <div style={{ padding: '48px 56px' }}>
              <p style={{ color: 'var(--color-gold)', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 16 }}>
                Studio Desain 3D
              </p>
              <h2 className="text-h1" style={{ color: 'white', fontFamily: 'var(--font-display)', marginBottom: 16 }}>
                Rancang Ruangan Impian Anda
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
                Gambar denah lantai, tempatkan furniture secara virtual,
                dan lihat hasilnya dalam tampilan 3D yang imersif —
                sebelum Anda membeli.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <Link href="/studio/floor-planner/demo" className="btn btn-primary">
                  Mulai Desain
                </Link>
                <Link href="/studio/furniture-3d/demo" className="btn btn-lg" style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-md)',
                }}>
                  Coba Furniture 3D
                </Link>
              </div>
            </div>

            {/* Image */}
            <div style={{ position: 'relative', height: 340 }}>
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=90"
                alt="Interior design 3D"
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FURNITURE PICKS ===== */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
            <div>
              <p style={{ color: 'var(--color-gold)', fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>
                Furniture Terpilih
              </p>
              <h2 className="text-h1" style={{ fontFamily: 'var(--font-display)' }}>Koleksi Premium</h2>
            </div>
            <Link href="/furniture" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: 'var(--color-gold)', fontSize: 14, fontWeight: 600, textDecoration: 'none',
            }}>
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid-4">
            {featuredFurniture.map((item) => (
              <Link
                key={item.id}
                href={`/furniture/${item.id}`}
                className="card"
                style={{ textDecoration: 'none' }}
              >
                <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    unoptimized
                  />
                  {item.discount && (
                    <div style={{ position: 'absolute', top: 12, left: 12 }}>
                      <span className="badge badge-red">-{item.discount}%</span>
                    </div>
                  )}
                </div>
                <div style={{ padding: 16 }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                    {item.brand}
                  </p>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.3 }}>
                    {item.name}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-gold-dark)' }}>
                      {formatIDR(item.price)}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={12} fill="var(--color-gold)" color="var(--color-gold)" />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FASHION SHOWCASE ===== */}
      <section style={{ background: 'var(--bg-secondary)' }} className="section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
            <div>
              <p style={{ color: 'var(--color-gold)', fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>
                Fashion & Aksesori
              </p>
              <h2 className="text-h1" style={{ fontFamily: 'var(--font-display)' }}>Koleksi Terbaru</h2>
            </div>
            <Link href="/fashion" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: 'var(--color-gold)', fontSize: 14, fontWeight: 600, textDecoration: 'none',
            }}>
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>

          {/* Masonry-like Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}>
            {featuredFashion.map((item, idx) => (
              <Link
                key={item.id}
                href={`/fashion/${item.id}`}
                className="card"
                style={{
                  textDecoration: 'none',
                  gridRow: idx < 2 ? 'span 1' : 'auto',
                }}
              >
                <div style={{ position: 'relative', height: idx < 2 ? 280 : 200, overflow: 'hidden' }}>
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    unoptimized
                  />
                  <div className="gradient-card-bottom" style={{ position: 'absolute', inset: 0 }} />
                  <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginBottom: 2 }}>{item.brand}</p>
                    <p style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{item.name}</p>
                    <p style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: 15 }}>{formatIDR(item.price)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Virtual Try-On Banner */}
          <div style={{
            marginTop: 32,
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-soft)',
            padding: '28px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
          }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8 }}>
                👗 Coba Fashion dengan Avatar Virtual
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Buat avatar sesuai tubuh Anda dan coba berbagai pakaian secara virtual sebelum membeli.
              </p>
            </div>
            <Link href="/studio/fashion-avatar" className="btn btn-primary" style={{ flexShrink: 0 }}>
              Coba Sekarang <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: 'var(--color-gold)', fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>
              Apa Kata Mereka
            </p>
            <h2 className="text-h1" style={{ fontFamily: 'var(--font-display)' }}>Cerita Pelanggan Kami</h2>
          </div>

          <div className="grid-3">
            {TESTIMONIALS.map((testi) => (
              <div key={testi.id} className="card" style={{ padding: 28 }}>
                {/* Stars */}
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {Array.from({ length: testi.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="var(--color-gold)" color="var(--color-gold)" />
                  ))}
                </div>

                {/* Content */}
                <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 20, fontStyle: 'italic' }}>
                  &quot;{testi.content}&quot;
                </p>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Image
                    src={testi.avatar}
                    alt={testi.name}
                    width={44}
                    height={44}
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                    unoptimized
                  />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{testi.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{testi.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, #2a2a6e 100%)',
        padding: '80px 0',
        textAlign: 'center',
      }}>
        <div className="container">
          <h2 className="text-hero" style={{ color: 'white', fontFamily: 'var(--font-display)', marginBottom: 16 }}>
            Mulai Perjalananmu Hari Ini
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
            Bergabung dengan 10.000+ pengguna yang sudah menemukan rumah impian mereka bersama CerdasLiving.
          </p>
          <AuthCtaHome />
        </div>
      </section>
    </>
  );
}
