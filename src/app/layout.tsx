import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AuthGuard from '@/components/layout/AuthGuard';
import AntiScreenshot from '@/components/layout/AntiScreenshot';

export const metadata: Metadata = {
  title: {
    default: 'CerdasLiving — Properti & Lifestyle Premium Indonesia',
    template: '%s | CerdasLiving',
  },
  description:
    'Platform properti & lifestyle premium Indonesia. Temukan rumah impian, furniture eksklusif, fashion terkini, dan desain ruangan virtual 3D dalam satu tempat.',
  keywords: ['properti', 'rumah', 'furniture', 'fashion', 'studio desain 3D', 'Indonesia'],
  authors: [{ name: 'CerdasLiving' }],
  openGraph: {
    title: 'CerdasLiving — Properti & Lifestyle Premium Indonesia',
    description: 'One-stop platform properti, furniture, fashion & design studio terdepan di Indonesia.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'CerdasLiving',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AntiScreenshot />
        <AuthGuard>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthGuard>
      </body>
    </html>
  );
}
