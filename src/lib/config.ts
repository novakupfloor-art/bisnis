// =====================================================
// CERDASLIVING — CENTRALIZED CONFIG
// Semua konfigurasi app dibaca dari .env
// JANGAN hardcode URL/kontak di komponen langsung!
// Gunakan config.appUrl, config.whatsapp, dst.
// =====================================================

export const config = {
  // App
  appName:    process.env.NEXT_PUBLIC_APP_NAME    || 'CerdasLiving',
  appTagline: process.env.NEXT_PUBLIC_APP_TAGLINE || 'Properti & Lifestyle Premium Indonesia',
  appUrl:     process.env.NEXT_PUBLIC_APP_URL     || 'http://localhost:3000',
  locale:     process.env.NEXT_PUBLIC_APP_LOCALE  || 'id-ID',
  currency:   process.env.NEXT_PUBLIC_APP_CURRENCY || 'IDR',

  // Kontak
  whatsapp:  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890',
  email:     process.env.NEXT_PUBLIC_CONTACT_EMAIL   || 'hello@cerdasliving.com',
  phone:     process.env.NEXT_PUBLIC_CONTACT_PHONE   || '+62 21 1234 5678',
  address:   process.env.NEXT_PUBLIC_OFFICE_ADDRESS  || 'Jakarta Selatan, Indonesia',

  // Social Media
  social: {
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '#',
    facebook:  process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK  || '#',
    youtube:   process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE   || '#',
    tiktok:    process.env.NEXT_PUBLIC_SOCIAL_TIKTOK    || '#',
  },

  // Google Maps
  maps: {
    apiKey:  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    defaultLat:  parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LAT  || '-6.2297'),
    defaultLng:  parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LNG  || '106.8295'),
    defaultZoom: parseInt(process.env.NEXT_PUBLIC_DEFAULT_ZOOM   || '12'),
  },

  // API
  api: {
    url:        process.env.NEXT_PUBLIC_API_URL      || '',
    timeout:    parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
    useMock:    process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false',
    mediaBase:  process.env.NEXT_PUBLIC_MEDIA_BASE_URL || '',
    maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '5242880'),
  },

  // Fitur Flag
  features: {
    studio3D:       process.env.NEXT_PUBLIC_FEATURE_STUDIO_3D      !== 'false',
    fashionAvatar:  process.env.NEXT_PUBLIC_FEATURE_FASHION_AVATAR !== 'false',
    floorPlanner:   process.env.NEXT_PUBLIC_FEATURE_FLOOR_PLANNER  !== 'false',
    chat:           process.env.NEXT_PUBLIC_FEATURE_CHAT           === 'true',
    payment:        process.env.NEXT_PUBLIC_FEATURE_PAYMENT        === 'true',
  },

  // Analytics
  analytics: {
    gaId:       process.env.NEXT_PUBLIC_GA_ID        || '',
    metaPixel:  process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
  },

  // Pagination
  itemsPerPage: parseInt(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE || '12'),
} as const;

// Helper: buat link WhatsApp
export const waLink = (message: string, phone?: string): string => {
  const num = phone || config.whatsapp;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
};

// Helper: format mata uang IDR
export const formatCurrency = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    const v = amount / 1_000_000_000;
    return `Rp ${v % 1 === 0 ? v : v.toFixed(1)} M`;
  }
  if (amount >= 1_000_000) {
    const v = amount / 1_000_000;
    return `Rp ${v % 1 === 0 ? v : v.toFixed(1)} Jt`;
  }
  return `Rp ${amount.toLocaleString(config.locale)}`;
};

export default config;
