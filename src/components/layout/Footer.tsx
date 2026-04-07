import Link from 'next/link';

const FOOTER_LINKS = {
  properti: {
    heading: 'PROPERTI',
    links: [
      { label: 'Jual Rumah', href: '/properti?status=dijual&type=rumah' },
      { label: 'Sewa Apartemen', href: '/properti?status=disewa&type=apartemen' },
      { label: 'Villa Bali', href: '/properti?type=villa' },
      { label: 'Properti Komersial', href: '/properti?type=komersial' },
      { label: 'Tanah Kavling', href: '/properti?type=tanah' },
    ],
  },
  marketplace: {
    heading: 'MARKETPLACE',
    links: [
      { label: 'Furniture Premium', href: '/furniture' },
      { label: 'Fashion & Aksesori', href: '/fashion' },
      { label: 'Dekorasi Rumah', href: '/furniture?category=dekorasi' },
      { label: 'Furnitur Custom', href: '/furniture?custom=true' },
      { label: 'Flash Sale', href: '/sale' },
    ],
  },
  studio: {
    heading: 'STUDIO 3D',
    links: [
      { label: 'Designer Denah', href: '/studio/floor-planner/demo' },
      { label: 'Try-On Furniture', href: '/studio/furniture-3d/demo' },
      { label: 'Avatar Fashion', href: '/studio/fashion-avatar' },
    ],
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Main Footer */}
      <div className="container" style={{ paddingTop: 64, paddingBottom: 48 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
          gap: 48,
        }}>
          {/* Brand Column */}
          <div>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
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
                color: 'white',
              }}>
                CerdasLiving
              </span>
            </div>

            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 14,
              lineHeight: 1.7,
              maxWidth: 260,
              marginBottom: 24,
            }}>
              Platform properti & lifestyle premium Indonesia. Temukan hunian impian, furniture eksklusif, dan fashion terbaik dalam satu tempat.
            </p>

            {/* Tagline */}
            <p style={{
              color: 'var(--color-gold)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}>
              Hidup Lebih Cerdas, Lebih Bermakna
            </p>
          </div>

          {/* Links Columns */}
          {Object.entries(FOOTER_LINKS).map(([key, section]) => (
            <div key={key}>
              <h4 style={{
                color: 'var(--color-gold)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: 16,
                fontFamily: 'var(--font-body)',
              }}>
                {section.heading}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container" style={{
          paddingTop: 20,
          paddingBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
            © {currentYear} CerdasLiving Indonesia. Hak Cipta Dilindungi.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Kebijakan Privasi', 'Syarat Layanan', 'Hubungi Kami'].map((label) => (
              <Link key={label} href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
