// Utility functions for formatting

export const formatIDR = (amount: number): string => {
  if (amount >= 1000000000) {
    const value = amount / 1000000000;
    return `Rp ${value % 1 === 0 ? value : value.toFixed(1)} M`;
  }
  if (amount >= 1000000) {
    const value = amount / 1000000;
    return `Rp ${value % 1 === 0 ? value : value.toFixed(1)} Jt`;
  }
  return `Rp ${amount.toLocaleString('id-ID')}`;
};

export const formatIDRFull = (amount: number): string => {
  return `Rp ${amount.toLocaleString('id-ID')}`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const generateStars = (rating: number): string => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const WhatsAppMessage = (phone: string, message: string): string => {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
};

export const getRoomLabel = (type: string): string => {
  const labels: Record<string, string> = {
    ruang_tamu: 'Ruang Tamu',
    kamar_tidur: 'Kamar Tidur',
    dapur: 'Dapur',
    kamar_mandi: 'Kamar Mandi',
    ruang_makan: 'Ruang Makan',
    garasi: 'Garasi',
    ruang_kerja: 'Ruang Kerja',
  };
  return labels[type] || type;
};

export const getRoomColor = (type: string): string => {
  const colors: Record<string, string> = {
    ruang_tamu: '#DBEAFE',
    kamar_tidur: '#FCE7F3',
    dapur: '#D1FAE5',
    kamar_mandi: '#E0E7FF',
    ruang_makan: '#FEF3C7',
    garasi: '#F3F4F6',
    ruang_kerja: '#FDF2F8',
  };
  return colors[type] || '#F3F4F6';
};
