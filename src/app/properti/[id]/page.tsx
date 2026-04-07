import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPropertyById, PROPERTIES } from '@/lib/data/properties';
import { getFeaturedFurniture } from '@/lib/data/furniture';
import { formatIDR, formatDate, WhatsAppMessage } from '@/lib/utils';
import { MapPin, BedDouble, Bath, Square, Car, Building2, Calendar, Eye, Phone, MessageCircle, ArrowLeft, ChevronRight, Star } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) return { title: 'Properti Tidak Ditemukan' };
  return {
    title: property.title,
    description: property.description.substring(0, 160),
  };
}

export async function generateStaticParams() {
  return PROPERTIES.map((p) => ({ id: p.id }));
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) notFound();

  const suggestedFurniture = getFeaturedFurniture().slice(0, 3);
  const waMessage = WhatsAppMessage(
    property.agent.whatsapp,
    `Halo ${property.agent.name}, saya tertarik dengan properti "${property.title}" di CerdasLiving. Bisa berbagi informasi lebih lanjut?`
  );

  const specs = [
    { icon: BedDouble, label: 'Kamar Tidur', value: property.specs.kamarTidur > 0 ? `${property.specs.kamarTidur} Kamar` : '-' },
    { icon: Bath, label: 'Kamar Mandi', value: property.specs.kamarMandi > 0 ? `${property.specs.kamarMandi} Kamar` : '-' },
    { icon: Square, label: 'Luas Bangunan', value: `${property.specs.luasBangunan} m²` },
    { icon: Square, label: 'Luas Tanah', value: `${property.specs.luasTanah > 0 ? property.specs.luasTanah : '-'} m²` },
    { icon: Car, label: 'Garasi', value: property.specs.garasi > 0 ? `${property.specs.garasi} Mobil` : '-' },
    { icon: Building2, label: 'Lantai', value: `${property.specs.lantai} Lantai` },
  ];

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '14px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <Link href="/properti" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Properti</Link>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--text-primary)' }}>{property.title}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
        {/* Back Button */}
        <Link href="/properti" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14,
          marginBottom: 24,
        }}>
          <ArrowLeft size={16} /> Kembali ke Listing
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' }}>
          {/* LEFT COLUMN — Main Content */}
          <div>
            {/* Image Gallery */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '300px 200px', gap: 8, borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 32 }}>
              {/* Main Image */}
              <div style={{ gridRow: 'span 2', position: 'relative' }}>
                <Image src={property.images[0]} alt={property.title} fill style={{ objectFit: 'cover' }} unoptimized />
              </div>
              {/* Secondary Images */}
              {property.images.slice(1, 3).map((img, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <Image src={img} alt={`${property.title} ${i + 2}`} fill style={{ objectFit: 'cover' }} unoptimized />
                  {i === 1 && property.images.length > 3 && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(26,26,46,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: 18, fontWeight: 600,
                    }}>
                      +{property.images.length - 3} foto
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Title & Badges */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span className={`badge ${property.status === 'dijual' ? 'badge-gold' : 'badge-blue'}`}>
                  {property.status === 'dijual' ? 'Dijual' : 'Disewa'}
                </span>
                <span className="badge badge-gray">
                  {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                </span>
                {property.isFeatured && <span className="badge badge-green">⭐ Featured</span>}
              </div>

              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>
                {property.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14 }}>
                  <MapPin size={14} />
                  {property.address.street}, {property.address.kecamatan}, {property.address.kota}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13 }}>
                  <Eye size={13} /> {property.views.toLocaleString()} dilihat
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13 }}>
                  <Calendar size={13} /> {formatDate(property.publishedAt)}
                </div>
              </div>
            </div>

            {/* Specs Grid */}
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: 24,
              marginBottom: 32,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
            }}>
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40,
                    background: 'rgba(201,168,76,0.1)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} color="var(--color-gold-dark)" />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
                    <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 16 }}>Deskripsi</h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                {property.description}
              </p>
            </div>

            {/* Features */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 16 }}>Fasilitas & Fitur</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {property.features.map((feature) => (
                  <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'var(--color-gold-dark)', fontSize: 10 }}>✓</span>
                    </div>
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 16 }}>Lokasi</h2>
              <div style={{
                width: '100%', height: 280,
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 12, color: 'var(--text-muted)',
              }}>
                <MapPin size={32} color="var(--color-gold)" />
                <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {property.address.street}
                </p>
                <p style={{ fontSize: 13 }}>
                  {property.address.kecamatan}, {property.address.kota}, {property.address.provinsi}
                </p>
              </div>
            </div>

            {/* Furniture Recommendation */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>Furniture untuk Hunian Ini</h2>
                <Link href="/studio/furniture-3d/demo" style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: 'var(--color-gold)', fontSize: 13, fontWeight: 600, textDecoration: 'none',
                }}>
                  Coba di Studio 3D <ChevronRight size={14} />
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {suggestedFurniture.map((item) => (
                  <Link key={item.id} href={`/furniture/${item.id}`} className="card" style={{ textDecoration: 'none', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', height: 140 }}>
                      <Image src={item.images[0]} alt={item.name} fill style={{ objectFit: 'cover' }} unoptimized />
                    </div>
                    <div style={{ padding: '12px 14px' }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{item.name}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-gold-dark)' }}>{formatIDR(item.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Sticky Agent Card & Price */}
          <div style={{ position: 'sticky', top: 88 }}>
            {/* Price Card */}
            <div className="card" style={{ padding: 28, marginBottom: 20 }}>
              <p style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-gold-dark)', fontFamily: 'var(--font-body)', lineHeight: 1 }}>
                {formatIDR(property.price)}
              </p>
              {property.priceUnit !== 'total' && (
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4 }}>
                  per {property.priceUnit === 'per_bulan' ? 'bulan' : 'tahun'}
                </p>
              )}
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                Negosiasi: Hubungi agen
              </p>
            </div>

            {/* Agent Card */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 16 }}>
                Agen Properti
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <Image
                  src={property.agent.photo}
                  alt={property.agent.name}
                  width={56}
                  height={56}
                  style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-soft)' }}
                  unoptimized
                />
                <div>
                  <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{property.agent.name}</p>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} fill="var(--color-gold)" color="var(--color-gold)" />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a
                  href={waMessage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <a
                  href={`tel:${property.agent.phone}`}
                  className="btn btn-secondary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <Phone size={16} /> {property.agent.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
