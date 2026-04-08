'use client';
import './studio.css';

import Link from 'next/link';
import Image from 'next/image';
import { Layers, Box, User, ArrowRight, Plus } from 'lucide-react';
import type { Metadata } from 'next';

const STUDIO_OPTIONS = [
  {
    id: 'floor-planner',
    href: '/studio/floor-planner/demo',
    icon: Layers,
    badge: 'Baru',
    badgeType: 'blue',
    title: 'Designer Denah',
    description: 'Gambar denah lantai secara interaktif dengan grid snapping, tambahkan pintu, jendela, dan konversi ke visualisasi 3D.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
    cta: 'Mulai Sekarang',
  },
  {
    id: 'furniture-3d',
    href: '/studio/furniture-3d/demo',
    icon: Box,
    badge: 'Populer',
    badgeType: 'gold',
    title: '3D Furniture Try-On',
    description: 'Pilih template ruangan, tempatkan furniture dari katalog kami secara virtual, dan sesuaikan hingga sempurna.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    cta: 'Mulai Sekarang',
  },
  {
    id: 'fashion-avatar',
    href: '/studio/fashion-avatar',
    icon: User,
    badge: 'Imersif',
    badgeType: 'green',
    title: 'Avatar Fashion Try-On',
    description: 'Buat avatar sesuai tubuh Anda, coba berbagai pakaian dan aksesori dari koleksi kami secara virtual.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    cta: 'Mulai Sekarang',
  },
];

const DEMO_PROJECTS = [
  {
    id: 'demo',
    type: '3D Furniture',
    name: 'Ruang Tamu Scandinavian',
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
    updatedAt: '2 jam lalu',
  },
  {
    id: 'demo-2',
    type: 'Floor Planner',
    name: 'Denah Apartemen 2BR',
    thumbnail: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=80',
    updatedAt: '1 hari lalu',
  },
  {
    id: 'demo-3',
    type: '3D Furniture',
    name: 'Kamar Tidur Modern',
    thumbnail: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80',
    updatedAt: '3 hari lalu',
  },
];

export default function StudioPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="studio-scroll">
        <div className="studio-inner">
      {/* Page Header */}
      <div style={{
        background: 'var(--color-primary)',
        padding: '60px 0 48px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(201,168,76,0.1) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(45,107,228,0.1) 0%, transparent 60%)',
        }} />

        <div className="container" style={{ position: 'relative' }}>
          <p style={{ color: 'var(--color-gold)', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 16 }}>
            Studio Desain
          </p>
          <h1 className="text-hero" style={{ color: 'white', fontFamily: 'var(--font-display)', marginBottom: 16 }}>
            Wujudkan Ruang Impian Anda
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
            Teknologi virtual try-on terdepan untuk properti, furniture, dan fashion —
            rasakan sebelum Anda beli.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 56, paddingBottom: 80 }}>
        {/* Studio Options */}
        <div className="grid-3" style={{ marginBottom: 64 }}>
          {STUDIO_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.id} className="card" style={{ overflow: 'hidden' }}>
                {/* Image */}
                <div style={{ position: 'relative', height: 200 }}>
                  <Image
                    src={option.image}
                    alt={option.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                  {/* Badge */}
                  <div style={{ position: 'absolute', top: 16, right: 16 }}>
                    <span className={`badge badge-${option.badgeType}`}>
                      {option.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: 24 }}>
                  <div style={{ marginBottom: 12 }}>
                    <Icon size={28} color="var(--color-gold)" />
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 12 }}>
                    {option.title}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                    {option.description}
                  </p>
                  <Link
                    href={option.href}
                    style={{
                      color: 'var(--color-gold-dark)',
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {option.cta} <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* My Projects Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 4 }}>Project Saya</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Desain yang sudah Anda buat sebelumnya
              </p>
            </div>
            <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus size={16} /> Buat Project Baru
            </button>
          </div>

          <div className="grid-3">
            {DEMO_PROJECTS.map((project) => (
              <Link
                key={project.id}
                href={
                  project.type === 'Floor Planner'
                    ? `/studio/floor-planner/${project.id}`
                    : `/studio/furniture-3d/${project.id}`
                }
                className="card"
                style={{ textDecoration: 'none', display: 'block', overflow: 'hidden' }}
              >
                <div style={{ position: 'relative', height: 180 }}>
                  <Image
                    src={project.thumbnail}
                    alt={project.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                  <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <span className="badge badge-navy" style={{ fontSize: 10 }}>{project.type}</span>
                  </div>
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 6 }}>
                    {project.name}
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Diperbarui {project.updatedAt}
                  </p>
                </div>
              </Link>
            ))}

            {/* New Project Card */}
            <button
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: 40,
                minHeight: 240,
                transition: 'var(--transition)',
                color: 'var(--text-muted)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-gold)';
                (e.currentTarget as HTMLElement).style.color = 'var(--color-gold-dark)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
              }}
            >
              <div style={{
                width: 48, height: 48,
                borderRadius: '50%',
                border: '2px dashed currentColor',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Plus size={20} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Buat Project Baru</span>
            </button>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}
