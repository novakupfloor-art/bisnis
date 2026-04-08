import Link from 'next/link';
import type { Metadata } from 'next';
import './canvas.css';

export const metadata: Metadata = {
  title: 'Luxury Business Model Canvas – Cerdas Living',
  description: 'Visualisasi Elegan Business Model Canvas untuk ekosistem Cerdas Living.',
};

export default function BusinessCanvasPage() {
  return (
    <div className="canvas-root">
      <main className="canvas-container">
        
        {/* Navigation */}
        <nav className="canvas-nav">
          <Link href="/bisnis" className="nav-btn btn-dark">
            ← Kembali ke Dashboard Bisnis
          </Link>
          <Link href="/" className="nav-btn btn-gold">
            Buka Portal Utama →
          </Link>
        </nav>

        {/* Header */}
        <header className="canvas-header">
          <div className="canvas-title-sub">Visualisasi Ekosistem</div>
          <h1 className="canvas-title-main">Business Model Canvas</h1>
          <div style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, transparent, #c5a059, transparent)', margin: '1.5rem auto 0' }} />
        </header>

        {/* Canvas Layout */}
        <div className="canvas-grid">

          {/* Key Partnerships */}
          <div className="canvas-card card-kp">
            <div className="card-header">
              <div className="card-icon">🤝</div>
              <h3 className="card-title">Key Partnerships</h3>
            </div>
            <div className="card-content">
              <ul className="card-list">
                <li>Agen properti &amp; broker</li>
                <li>Developer properti</li>
                <li>UMKM furniture &amp; lifestyle</li>
                <li>Bank &amp; penyedia KPR</li>
                <li>Vendor teknologi (payment gateway, maps, API)</li>
              </ul>
            </div>
          </div>

          {/* Key Activities */}
          <div className="canvas-card card-ka">
            <div className="card-header">
              <div className="card-icon">⚙️</div>
              <h3 className="card-title">Key Activities</h3>
            </div>
            <div className="card-content">
              <ul className="card-list">
                <li>Pengembangan &amp; maintenance platform</li>
                <li>Akuisisi user (traffic &amp; komunitas)</li>
                <li>Onboarding agen, developer, UMKM</li>
                <li>Kurasi listing &amp; produk</li>
                <li>Aktivitas marketing &amp; edukasi</li>
              </ul>
            </div>
          </div>

          {/* Key Resources */}
          <div className="canvas-card card-kr">
            <div className="card-header">
              <div className="card-icon">💎</div>
              <h3 className="card-title">Key Resources</h3>
            </div>
            <div className="card-content">
              <ul className="card-list">
                <li>Platform (website &amp; sistem 3D)</li>
                <li>Database listing &amp; produk</li>
                <li>Brand CerdasLiving</li>
                <li>Jaringan partner </li>
                <li>Data user &amp; analitik perilaku</li>
              </ul>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="canvas-card card-vp">
            <div className="card-header">
              <div className="card-icon">✨</div>
              <h3 className="card-title">Value Proposition</h3>
            </div>
            <div className="card-content">
              <ul className="card-list">
                <li className="subheading">Untuk End User</li>
                <li>Platform terpadu: cari runah, desain, &amp; isi perabot</li>
                <li>Kurangi risiko salah beli via visualisasi inspiratif</li>
                <li>Hemat waktu &amp; sangat praktis</li>
                
                <li className="subheading">Untuk Agen &amp; UMKM</li>
                <li>Listing gratis &amp; akses pasar masif</li>
                <li>Exposure tinggi &amp; lead berkualitas</li>
                <li>Tools digital super (SaaS 3D Studio)</li>

                <li className="subheading">Untuk Partner &amp; Bank</li>
                <li>Akses instan ke target demografi yang tepat</li>
                <li>Targeting audience berbasis behavioral data</li>
              </ul>
            </div>
          </div>

          {/* Customer Relationships */}
          <div className="canvas-card card-cr">
            <div className="card-header">
              <div className="card-icon">❤️</div>
              <h3 className="card-title">Customer Relationships</h3>
            </div>
            <div className="card-content">
              <ul className="card-list">
                <li>Self-service (eksplorasi mandiri)</li>
                <li>Assisted service (Konsultasi via CS)</li>
                <li>Community engagement</li>
                <li>Sistem Notifikasi &amp; Platform Edukasi</li>
              </ul>
            </div>
          </div>

          {/* Channels */}
          <div className="canvas-card card-ch">
            <div className="card-header">
              <div className="card-icon">📢</div>
              <h3 className="card-title">Channels</h3>
            </div>
            <div className="card-content">
              <ul className="card-list">
                <li>Website (platform utama)</li>
                <li>SEO Organik (properti &amp; lifestyle)</li>
                <li>Media Sosial Visuak (TikTok, IG, Pinterest)</li>
                <li>Push Marketing via WhatsApp API</li>
                <li>Partnership event &amp; komersial</li>
              </ul>
            </div>
          </div>

          {/* Customer Segments */}
          <div className="canvas-card card-cs">
            <div className="card-header">
              <div className="card-icon">🎯</div>
              <h3 className="card-title">Customer Segments</h3>
            </div>
            <div className="card-content">
              <ul className="card-list">
                <li className="subheading">Primary (End User)</li>
                <li>Individu/pasangan pencari properti</li>
                <li>Pecinta desain &amp; pembeli furniture</li>
                <li>Generasi mobile-first</li>

                <li className="subheading">Secondary (Supply Side)</li>
                <li>Agen properti (freelance &amp; corporate)</li>
                <li>Developer properti menengah-besar</li>
                <li>UMKM furniture/fashion</li>

                <li className="subheading">Tertiary (Strategic Partner)</li>
                <li>Bank Nasional (Penyedia KPR)</li>
                <li>Brand multinasional untuk eksposur</li>
              </ul>
            </div>
          </div>

          {/* Cost Structure */}
          <div className="canvas-card card-cost">
            <div className="card-header" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <div className="card-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: 'transparent' }}>📉</div>
              <h3 className="card-title">Cost Structure</h3>
            </div>
            <div className="card-content card-split">
              <ul className="card-list">
                <li className="subheading" style={{ color: '#ef4444', borderBottomColor: 'rgba(239,68,68,0.2)' }}>Fixed Cost</li>
                <li>Infrastruktur (Server, Rendering Cloud, Database)</li>
                <li>Gaji Tim Inti (Developer, CS, Operatif, Eksekutif)</li>
                <li>Legal, Compliance &amp; Sewa Kantor</li>
              </ul>
              <ul className="card-list">
                <li className="subheading" style={{ color: '#ef4444', borderBottomColor: 'rgba(239,68,68,0.2)' }}>Variable Cost</li>
                <li>Marketing, Kampanye &amp; PR Nasional</li>
                <li>Customer Success &amp; Pengembangan Komunitas</li>
                <li>Operasional Partnership &amp; Subsidi</li>
                <li>Lisensi API &amp; Tools Payment Gateway</li>
              </ul>
            </div>
          </div>

          {/* Revenue Streams */}
          <div className="canvas-card card-rev">
            <div className="card-header" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
              <div className="card-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderColor: 'transparent' }}>📈</div>
              <h3 className="card-title">Revenue Streams</h3>
            </div>
            <div className="card-content card-split">
              <ul className="card-list">
                <li className="subheading" style={{ color: '#10b981', borderBottomColor: 'rgba(16,185,129,0.2)' }}>B2C &amp; Agen Monetization</li>
                <li><strong>Featured Listing:</strong> Layanan Freemium; charge bulanan untuk listing yang di pin (prioritas).</li>
                <li><strong>SaaS 3D Subscription:</strong> Akses premium simulasi arsitektural.</li>
                <li><strong>Marketplace Fee:</strong> Komisi per checkout furniture.</li>
              </ul>
              <ul className="card-list">
                <li className="subheading" style={{ color: '#10b981', borderBottomColor: 'rgba(16,185,129,0.2)' }}>B2B &amp; Enterprise</li>
                <li><strong>Ads &amp; Sponsored Placement:</strong> Vendor bank KPR beriklan pada listing potensial.</li>
                <li><strong>Business Intelligence:</strong> Laporan analitik tren hunian untuk developer raksasa.</li>
                <li><strong>Event &amp; Expo Virtual:</strong> Pameran digital berbayar.</li>
              </ul>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
