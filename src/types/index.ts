// ===== SHARED TYPESCRIPT TYPES — CERDASLIVING.COM =====

// ===== PROPERTY TYPES =====
export type PropertyType = 'rumah' | 'apartemen' | 'villa' | 'komersial' | 'tanah';
export type PropertyStatus = 'dijual' | 'disewa';

export interface PropertySpecs {
  luasTanah: number;
  luasBangunan: number;
  kamarTidur: number;
  kamarMandi: number;
  garasi: number;
  lantai: number;
}

export interface PropertyAddress {
  street: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  kodePos?: string;
}

export interface PropertyAgent {
  id: string;
  name: string;
  photo: string;
  phone: string;
  whatsapp: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  priceUnit: 'total' | 'per_bulan' | 'per_tahun';
  address: PropertyAddress;
  coordinates: { lat: number; lng: number };
  specs: PropertySpecs;
  features: string[];
  images: string[];
  virtualTourUrl?: string;
  floorPlanUrl?: string;
  agent: PropertyAgent;
  views: number;
  isFeatured: boolean;
  publishedAt: string;
}

// ===== PRODUCT TYPES =====
export type FurnitureCategory = 'sofa' | 'meja' | 'kursi' | 'tempat_tidur' | 'lemari' | 'rak' | 'dekorasi' | 'lampu';
export type FashionCategory = 'outerwear' | 'dress' | 'kemeja' | 'celana' | 'sepatu' | 'aksesori' | 'tas';

export interface ColorVariant {
  name: string;
  hex: string;
}

export interface FurnitureModel3D {
  glbUrl: string;
  thumbnailUrl: string;
  dimensions: { width: number; height: number; depth: number }; // cm
}

export interface FurnitureProduct {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: FurnitureCategory;
  subcategory: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  images: string[];
  model3d: FurnitureModel3D;
  materials: string[];
  colors: ColorVariant[];
  style: string[];
  room: string[];
  weight: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  tags: string[];
}

export interface FashionProduct {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: FashionCategory;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  colors: ColorVariant[];
  sizes: string[];
  material: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  gender: 'pria' | 'wanita' | 'unisex';
  tags: string[];
}

// ===== DESIGN STUDIO TYPES =====
export type RoomType = 
  | 'ruang_tamu' 
  | 'kamar_tidur' 
  | 'dapur' 
  | 'kamar_mandi' 
  | 'ruang_makan' 
  | 'garasi' 
  | 'ruang_kerja';

export interface RoomElement {
  id: string;
  type: 'pintu' | 'jendela' | 'tangga';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface Room {
  roomId: string;
  type: RoomType;
  label: string;
  x: number;
  y: number;
  width: number;  // grid units
  height: number; // grid units
  color: string;
  elements: RoomElement[];
}

export interface CanvasFurnitureItem {
  canvasItemId: string;
  productId: string;        // FK ke FurnitureProduct
  sku: string;
  name: string;
  thumbnail: string;
  model3dUrl: string;
  price: number;
  dimensions: { w: number; h: number; d: number };
  position: { x: number; y: number; z: number };
  rotation: number;
  roomId?: string;
  inCartStatus: 'not_added' | 'in_cart' | 'purchased';
}

export interface DesignCanvasSettings {
  gridSize: number;  // default 50 (= 0.5 meter)
  unit: 'cm' | 'm';
  backgroundColor: string;
}

export interface DesignProject {
  projectId: string;
  userId: string;
  name: string;
  thumbnail?: string;
  rooms: Room[];
  furnitureItems: CanvasFurnitureItem[];
  canvasSettings: DesignCanvasSettings;
  linkedCartId?: string;
  totalFurnitureValue: number;
  status: 'draft' | 'published' | 'archived';
  type: 'floor_planner' | 'furniture_3d' | 'fashion_avatar';
  createdAt: string;
  updatedAt: string;
}

// ===== CART & ORDER TYPES =====
export interface CartItem {
  id: string;
  productId: string;
  productType: 'furniture' | 'fashion' | 'property_service';
  name: string;
  thumbnail: string;
  price: number;
  quantity: number;
  customizations?: Record<string, string>;
  fromDesignId?: string; // jika dari design studio
}

export interface Cart {
  cartId: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  fromDesignId?: string;
  createdAt: string;
  updatedAt: string;
}

// ===== USER TYPES =====
export interface UserPreferences {
  stylePreference: string[];
  budgetRange: { min: number; max: number };
  preferredLocations: string[];
}

export interface FashionAvatar {
  height: number;         // cm (145-200)
  bodyType: 'kurus' | 'sedang' | 'besar';
  skinColor: string;      // hex
  hairColor: string;      // hex
  outfit: {
    jacket?: string;
    top?: string;
    bottom?: string;
    shoes?: string;
    bag?: string;
    accessories?: string;
  };
}

export interface User {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  preferences: UserPreferences;
  fashionAvatar: FashionAvatar;
  savedPropertyIds: string[];
  wishlistProductIds: string[];
  createdAt: string;
}

// ===== FILTER TYPES =====
export interface PropertyFilter {
  type?: PropertyType | 'semua';
  status?: PropertyStatus | 'semua';
  minPrice?: number;
  maxPrice?: number;
  kota?: string;
  kamarTidur?: number;
  minLuas?: number;
  maxLuas?: number;
  query?: string;
}

export interface FurnitureFilter {
  category?: FurnitureCategory | 'semua';
  style?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  room?: string;
  query?: string;
}

export interface FashionFilter {
  category?: FashionCategory | 'semua';
  brand?: string;
  gender?: 'pria' | 'wanita' | 'unisex' | 'semua';
  minPrice?: number;
  maxPrice?: number;
  query?: string;
}

// ===== UI TYPES =====
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  content: string;
  rating: number;
  propertyType?: string;
}

export interface Stat {
  label: string;
  value: string;
  icon?: string;
}
