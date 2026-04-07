'use client';

import { useState, useRef, Suspense, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ChevronRight, ShoppingCart, Trash2,
  Search, Eye, X, Move, MousePointer, RotateCcw, RotateCw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { Canvas, useThree } from '@react-three/fiber';
import {
  OrbitControls, Grid, Environment, Text, Box,
} from '@react-three/drei';
import * as THREE from 'three';
import { FURNITURE } from '@/lib/data/furniture';
import { formatIDR } from '@/lib/utils';
import type { FurnitureProduct } from '@/types';

// ===== CONSTANTS =====
const GRID_SNAP = 0.5; // snap every 0.5m

// ===== HELPERS =====
function snapVal(v: number) {
  return Math.round(v / GRID_SNAP) * GRID_SNAP;
}

// ===== ROOM BOX =====
function RoomBox({ wallColor = '#f5f5f5', floorType = 'parket' }: { wallColor?: string; floorType?: string }) {
  const floorColors: Record<string, string> = {
    parket: '#D4B896',
    marmer: '#E8E8E8',
    beton: '#9CA3AF',
    karpet: '#6B7280',
  };
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={floorColors[floorType] || '#D4B896'} roughness={0.8} />
      </mesh>
      <mesh position={[0, 2, -4]} receiveShadow>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-4, 2, 0]} receiveShadow>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>
    </group>
  );
}

// ===== DRAGGABLE FURNITURE =====
interface FurnitureBox3DProps {
  item: FurnitureProduct;
  position: [number, number, number];
  rotation: number;
  isSelected: boolean;
  isDragMode: boolean;
  onSelect: () => void;
  onDragEnd: (newPos: [number, number, number]) => void;
  onRotateEnd: (newRot: number) => void;
}

function FurnitureBox3D({ item, position, rotation, isSelected, isDragMode, onSelect, onDragEnd, onRotateEnd }: FurnitureBox3DProps) {
  const { camera, gl, raycaster } = useThree();
  const meshRef = useRef<THREE.Group>(null);
  const dragging = useRef(false);
  const floorPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const intersection = useRef(new THREE.Vector3());

  // For smooth drag
  const dragPos = useRef<THREE.Vector3>(new THREE.Vector3(...position));

  const { dimensions } = item.model3d;
  const w = Math.min(dimensions.width / 100, 2);
  const h = Math.min(dimensions.height / 100, 1.5);
  const d = Math.min(dimensions.depth / 100, 2);

  const colors: Record<string, string> = {
    sofa: '#9CA3AF', meja: '#D4B896', kursi: '#6B7280',
    tempat_tidur: '#E8D5B7', lemari: '#C4B5A5', rak: '#8B7355',
    dekorasi: '#F9A8D4', lampu: '#FDE68A',
  };
  const baseColor = colors[item.category] || '#9CA3AF';

  // Track live pointer for drag
  const pointerPos = useRef(new THREE.Vector2());

  const handlePointerDown = useCallback((e: { stopPropagation: () => void; clientX: number; clientY: number }) => {
    e.stopPropagation();
    onSelect();
    if (!isDragMode) return;
    
    // Sync current position before drag starts
    dragPos.current.set(...position);
    
    dragging.current = true;
    gl.domElement.style.cursor = 'grabbing';

    const onMove = (ev: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      pointerPos.current.set(
        ((ev.clientX - rect.left) / rect.width) * 2 - 1,
        -((ev.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointerPos.current, camera);
      if (raycaster.ray.intersectPlane(floorPlane.current, intersection.current)) {
        const rawX = snapVal(intersection.current.x);
        const rawZ = snapVal(intersection.current.z);

        // Batasi agar tidak melewati tembok (area -4 sampai 4, dikurangi setengah dimensi objek)
        const maxX = 4 - w / 2;
        const minX = -4 + w / 2;
        const maxZ = 4 - d / 2;
        const minZ = -4 + d / 2;

        dragPos.current.set(
          Math.max(minX, Math.min(maxX, rawX)),
          0,
          Math.max(minZ, Math.min(maxZ, rawZ))
        );
        if (meshRef.current) {
          meshRef.current.position.set(dragPos.current.x, 0, dragPos.current.z);
        }
      }
    };

    const onUp = () => {
      dragging.current = false;
      gl.domElement.style.cursor = '';
      onDragEnd([dragPos.current.x, 0, dragPos.current.z]);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [isDragMode, onSelect, onDragEnd, camera, gl, raycaster, w, d, position]);

  const dragRot = useRef(rotation);
  const rotating = useRef(false);

  // Sync rotation back if it changes externally
  if (!rotating.current) {
    dragRot.current = rotation;
  }

  const handleRotatePointerDown = useCallback((e: { stopPropagation: () => void; clientX: number; clientY: number }) => {
    e.stopPropagation();
    onSelect();
    if (!isDragMode) return;
    
    rotating.current = true;
    gl.domElement.style.cursor = 'grab';

    // Calculate initial angle so we rotate relatively
    let initialAngle = 0;
    let initialRot = rotation;
    
    const rect = gl.domElement.getBoundingClientRect();
    pointerPos.current.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointerPos.current, camera);
    if (raycaster.ray.intersectPlane(floorPlane.current, intersection.current)) {
      const dx = intersection.current.x - position[0];
      const dz = intersection.current.z - position[2];
      initialAngle = Math.atan2(dx, dz);
    }

    const onMove = (ev: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      pointerPos.current.set(
        ((ev.clientX - rect.left) / rect.width) * 2 - 1,
        -((ev.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointerPos.current, camera);
      if (raycaster.ray.intersectPlane(floorPlane.current, intersection.current)) {
        const dx = intersection.current.x - position[0];
        const dz = intersection.current.z - position[2];
        const currentAngle = Math.atan2(dx, dz);
        
        let delta = currentAngle - initialAngle;
        let newRot = initialRot + delta;
        
        // Snap to 22.5 degrees (Pi/8) for neat placement
        newRot = Math.round(newRot / (Math.PI / 8)) * (Math.PI / 8);

        dragRot.current = newRot;
        if (meshRef.current) {
          meshRef.current.rotation.y = dragRot.current;
        }
      }
    };

    const onUp = () => {
      rotating.current = false;
      gl.domElement.style.cursor = '';
      onRotateEnd(dragRot.current);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [isDragMode, onSelect, camera, gl, raycaster, position, rotation, onRotateEnd]);

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={[0, rotation, 0]}
      onPointerDown={handlePointerDown as any}
    >
      <Box args={[w, h, d]} position={[0, h / 2, 0]} castShadow>
        <meshStandardMaterial
          color={isSelected ? '#C9A84C' : baseColor}
          roughness={0.6}
          metalness={0.1}
          emissive={isSelected && isDragMode ? '#7a5a00' : '#000000'}
          emissiveIntensity={isSelected && isDragMode ? 0.3 : 0}
        />
      </Box>
      {isSelected && (
        <Text
          position={[0, h + 0.25, 0]}
          fontSize={0.15}
          color="#C9A84C"
          anchorX="center"
          anchorY="bottom"
        >
          {item.name.split(' ').slice(0, 3).join(' ')}
        </Text>
      )}
      {/* Selection ring + Rotate Handle */}
      {isSelected && (
        <group position={[0, 0.01, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[Math.max(w, d) * 0.6, Math.max(w, d) * 0.7, 32]} />
            <meshBasicMaterial color="#C9A84C" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
          
          {isDragMode && (
            <group 
              position={[Math.max(w, d) * 0.65, 0.05, 0]}
              onPointerDown={handleRotatePointerDown as any}
              onPointerOver={(e) => { e.stopPropagation(); gl.domElement.style.cursor = 'grab'; }}
              onPointerOut={(e) => { e.stopPropagation(); gl.domElement.style.cursor = ''; }}
            >
              {/* Invisible Hitbox for easier grabbing */}
              <mesh>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshBasicMaterial visible={false} />
              </mesh>
              {/* Inner knob */}
              <mesh>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color="#FFFFFF" emissive="#C9A84C" emissiveIntensity={0.5} />
              </mesh>
              {/* Outer ring */}
              <mesh rotation={[-Math.PI/2, 0, 0]}>
                <torusGeometry args={[0.1, 0.02, 16, 32]} />
                <meshBasicMaterial color="#C9A84C" />
              </mesh>
            </group>
          )}
        </group>
      )}
    </group>
  );
}

// ===== SCENE CLICK DESELECT =====
function SceneClickDeselect({ onDeselect, isDragMode }: { onDeselect: () => void; isDragMode: boolean }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      onPointerDown={(e) => {
        e.stopPropagation();
        onDeselect();
      }}
    >
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}

// ===== TYPES =====
interface PlacedItem {
  id: string;
  productId: string;
  position: [number, number, number];
  rotation: number;
}

// ===== CONSTANTS =====
const WALL_COLORS = [
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Cokelat', hex: '#92400E' },
  { name: 'Sage', hex: '#4B7A5E' },
  { name: 'Abu', hex: '#6B7280' },
  { name: 'Putih', hex: '#F5F5F5' },
  { name: 'Merah Bata', hex: '#B91C1C' },
];
const FLOOR_TYPES = ['Parket', 'Marmer', 'Beton', 'Karpet'];
const LIGHTING_OPTIONS = ['Siang', 'Senja', 'Malam'];

type ViewMode = 'view' | 'move';

// ===== MAIN PAGE =====
export default function Furniture3DPage() {
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [wallColor, setWallColor] = useState('#F5F5F5');
  const [floorType, setFloorType] = useState('parket');
  const [lightMode, setLightMode] = useState('Siang');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [viewMode, setViewMode] = useState<ViewMode>('view');

  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const filteredFurniture = FURNITURE.filter((f) => {
    if (filterCategory !== 'Semua' && f.category !== filterCategory) return false;
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const addToCanvas = (product: FurnitureProduct) => {
    const existing = placedItems.filter((i) => i.productId === product.id).length;
    const offset = existing * 0.5;
    const newItem: PlacedItem = {
      id: `placed-${Date.now()}`,
      productId: product.id,
      position: [
        parseFloat(((Math.random() * 4 - 2) + offset).toFixed(1)),
        0,
        parseFloat(((Math.random() * 4 - 2) + offset).toFixed(1)),
      ],
      rotation: 0,
    };
    setPlacedItems((prev) => [...prev, newItem]);
    setSelectedItemId(newItem.id);
    setViewMode('move'); // auto switch to move mode
  };

  const removeItem = (id: string) => {
    setPlacedItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedItemId === id) setSelectedItemId(null);
  };

  const handleDragEnd = (id: string, newPos: [number, number, number]) => {
    setPlacedItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, position: newPos } : item)
    );
  };

  const handleRotate = (id: string) => {
    setPlacedItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, rotation: (item.rotation || 0) + Math.PI / 2 } : item)
    );
  };

  const handleRotateEnd = (id: string, newRot: number) => {
    setPlacedItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, rotation: newRot } : item)
    );
  };

  const handleAddAllToCart = () => {
    placedItems.forEach((item) => {
      const product = FURNITURE.find((f) => f.id === item.productId);
      if (product) {
        addItem({
          id: crypto.randomUUID(),
          productId: product.id,
          productType: 'furniture',
          name: product.name,
          price: product.price,
          thumbnail: product.images[0],
          quantity: 1,
          fromDesignId: '3d-studio-project',
        });
      }
    });
    router.push('/cart');
  };

  const totalPrice = placedItems.reduce((sum, item) => {
    const product = FURNITURE.find((f) => f.id === item.productId);
    return sum + (product?.price || 0);
  }, 0);

  const environmentPresets: Record<string, 'city' | 'sunset' | 'night' | 'apartment'> = {
    Siang: 'city', Senja: 'sunset', Malam: 'apartment',
  };

  const isDragMode = viewMode === 'move';

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#1a1a2e', overflow: 'hidden' }}>
      {/* Top Bar */}
      <div style={{
        background: '#1a1a2e',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexShrink: 0,
      }}>
        <Link href="/studio" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
          <ArrowLeft size={16} /> Studio
        </Link>
        <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
        <span style={{ color: 'white', fontWeight: 600, fontSize: 16 }}>3D Furniture Try-On</span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
          {isDragMode ? '— seret furniture untuk memindahkan posisi' : '— seret layar untuk memutar tampilan'}
        </span>

        {/* Mode Toggle */}
        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          background: 'rgba(255,255,255,0.07)',
          borderRadius: 8,
          padding: 4,
          gap: 4,
        }}>
          {([
            { mode: 'view' as ViewMode, label: 'Putar Kamera', icon: MousePointer },
            { mode: 'move' as ViewMode, label: 'Pindah Furniture', icon: Move },
          ] as const).map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              title={label}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                background: viewMode === mode ? 'rgba(201,168,76,0.25)' : 'transparent',
                color: viewMode === mode ? 'var(--color-gold, #C9A84C)' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: viewMode === mode ? 700 : 400,
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3-column layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT — Furniture Catalog */}
        <div className="studio-panel" style={{ width: 280, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Katalog Furniture</p>
            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 8 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Cari furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '8px 8px 8px 30px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'white', fontSize: 13, outline: 'none',
                }}
              />
            </div>
            {/* Category filter */}
            <div className="scroll-x" style={{ gap: 6 }}>
              {['Semua', 'sofa', 'meja', 'kursi', 'lampu'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: filterCategory === cat ? 'var(--color-gold)' : 'rgba(255,255,255,0.15)',
                    background: filterCategory === cat ? 'var(--color-gold)' : 'transparent',
                    color: filterCategory === cat ? '#1A1A2E' : 'rgba(255,255,255,0.6)',
                    fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Furniture List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredFurniture.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.4)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
                onClick={() => addToCanvas(item)}
              >
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 22 }}>
                    {item.category === 'sofa' ? '🛋️' : item.category === 'meja' ? '🪑' : item.category === 'lampu' ? '💡' : '🪴'}
                  </span>
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'white', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--color-gold)' }}>{formatIDR(item.price)}</p>
                </div>
                <button style={{ background: 'rgba(201,168,76,0.15)', border: 'none', borderRadius: 4, padding: '4px 8px', color: 'var(--color-gold)', fontSize: 11, cursor: 'pointer', flexShrink: 0 }}>
                  + Tambah
                </button>
              </div>
            ))}
          </div>

          {/* Customization */}
          <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-gold)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>
              Kustomisasi
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Warna Dinding</p>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              {WALL_COLORS.map((c) => (
                <button key={c.hex} title={c.name} onClick={() => setWallColor(c.hex)} style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: c.hex,
                  border: wallColor === c.hex ? '2px solid var(--color-gold)' : '2px solid transparent',
                  cursor: 'pointer', outline: 'none',
                }} />
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Jenis Lantai</p>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              {FLOOR_TYPES.map((f) => (
                <button key={f} onClick={() => setFloorType(f.toLowerCase())} style={{
                  padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid',
                  borderColor: floorType === f.toLowerCase() ? 'var(--color-gold)' : 'rgba(255,255,255,0.2)',
                  background: floorType === f.toLowerCase() ? 'var(--color-gold)' : 'transparent',
                  color: floorType === f.toLowerCase() ? '#1A1A2E' : 'rgba(255,255,255,0.6)',
                  fontSize: 11, cursor: 'pointer',
                }}>{f}</button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Pencahayaan</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {LIGHTING_OPTIONS.map((l) => (
                <button key={l} onClick={() => setLightMode(l)} style={{
                  padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid',
                  borderColor: lightMode === l ? 'var(--color-gold)' : 'rgba(255,255,255,0.2)',
                  background: lightMode === l ? 'var(--color-gold)' : 'transparent',
                  color: lightMode === l ? '#1A1A2E' : 'rgba(255,255,255,0.6)',
                  fontSize: 11, cursor: 'pointer',
                }}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER — 3D Canvas */}
        <div style={{ flex: 1, position: 'relative', background: '#2d2d4e' }}>
          {/* Mode hint badge */}
          <div style={{
            position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
            zIndex: 10, pointerEvents: 'none',
            background: isDragMode ? 'rgba(201,168,76,0.2)' : 'rgba(0,0,0,0.4)',
            border: `1px solid ${isDragMode ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: 20, padding: '5px 14px',
            display: 'flex', alignItems: 'center', gap: 6,
            backdropFilter: 'blur(8px)',
          }}>
            {isDragMode
              ? <><Move size={12} color="#C9A84C" /><span style={{ fontSize: 12, color: '#C9A84C', fontWeight: 600 }}>Mode Pindah — klik &amp; seret furniture</span></>
              : <><MousePointer size={12} color="rgba(255,255,255,0.6)" /><span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Mode Kamera — seret layar untuk memutar</span></>
            }
          </div>

          <Canvas
            shadows
            camera={{ position: [5, 5, 5], fov: 50 }}
            style={{ width: '100%', height: '100%', cursor: isDragMode ? 'default' : 'grab' }}
          >
            <Suspense fallback={null}>
              <Environment preset={environmentPresets[lightMode] || 'city'} />
            </Suspense>

            <ambientLight intensity={lightMode === 'Malam' ? 0.3 : 0.6} />
            <directionalLight
              position={[5, 8, 5]}
              intensity={lightMode === 'Malam' ? 0.5 : 1}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />

            <RoomBox wallColor={wallColor} floorType={floorType} />

            {/* Invisible floor to deselect */}
            <SceneClickDeselect
              onDeselect={() => setSelectedItemId(null)}
              isDragMode={isDragMode}
            />

            {placedItems.map((item) => {
              const product = FURNITURE.find((f) => f.id === item.productId);
              if (!product) return null;
              return (
                <FurnitureBox3D
                  key={item.id}
                  item={product}
                  position={item.position}
                  rotation={item.rotation || 0}
                  isSelected={selectedItemId === item.id}
                  isDragMode={isDragMode}
                  onSelect={() => setSelectedItemId(item.id)}
                  onDragEnd={(newPos) => handleDragEnd(item.id, newPos)}
                  onRotateEnd={(newRot) => handleRotateEnd(item.id, newRot)}
                />
              );
            })}

            {/* OrbitControls — disabled when in drag mode or dragging selected item */}
            <OrbitControls
              makeDefault
              enabled={!isDragMode}
              enablePan={!isDragMode}
            />
            <Grid
              args={[8, 8]}
              cellSize={0.5}
              cellColor="#4B5563"
              sectionColor="#6B7280"
              fadeDistance={20}
            />
          </Canvas>

          {placedItems.length === 0 && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none', textAlign: 'center',
            }}>
              <div style={{ opacity: 0.4 }}>
                <p style={{ fontSize: 32, marginBottom: 12 }}>🛋️</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: 500 }}>
                  Pilih furniture dari katalog untuk ditempatkan
                </p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
                  Gunakan mode <strong>Pindah</strong> untuk menggeser posisi furniture
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Cart Summary */}
        <div className="studio-panel" style={{ width: 280, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShoppingCart size={16} color="var(--color-gold)" />
              <p style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>Ringkasan Furniture</p>
            </div>
            {placedItems.length > 0 && selectedItemId && (
              <div style={{
                marginTop: 10,
                padding: '8px 10px',
                background: 'rgba(201,168,76,0.1)',
                borderRadius: 8,
                border: '1px solid rgba(201,168,76,0.2)',
              }}>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Posisi Dipilih</p>
                {(() => {
                  const sel = placedItems.find((i) => i.id === selectedItemId);
                  return sel ? (
                    <p style={{ fontSize: 12, color: 'var(--color-gold)', fontFamily: 'monospace' }}>
                      X: {sel.position[0].toFixed(1)}m &nbsp; Z: {sel.position[2].toFixed(1)}m
                    </p>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {placedItems.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, textAlign: 'center', paddingTop: 32 }}>
                Belum ada furniture di canvas
              </p>
            ) : (
              placedItems.map((item) => {
                const product = FURNITURE.find((f) => f.id === item.productId);
                if (!product) return null;
                return (
                  <div
                    key={item.id}
                    style={{
                      background: selectedItemId === item.id ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.05)',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 12px',
                      border: selectedItemId === item.id ? '1px solid rgba(201,168,76,0.3)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                    onClick={() => { setSelectedItemId(item.id); }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'white', marginBottom: 2, lineHeight: 1.3 }}>
                          {product.name}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--color-gold)' }}>
                          {formatIDR(product.price)}
                        </p>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2, fontFamily: 'monospace' }}>
                          ({item.position[0].toFixed(1)}, {item.position[2].toFixed(1)})
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRotate(item.id);
                            setSelectedItemId(item.id);
                          }}
                          title="Putar 90°"
                          style={{ background: 'rgba(201,168,76,0.15)', border: 'none', borderRadius: 4, padding: '4px 6px', color: 'var(--color-gold)', cursor: 'pointer' }}
                        >
                          <RotateCw size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItemId(item.id);
                            setViewMode('move');
                          }}
                          title="Pindahkan"
                          style={{ background: 'rgba(201,168,76,0.15)', border: 'none', borderRadius: 4, padding: '4px 6px', color: 'var(--color-gold)', cursor: 'pointer' }}
                        >
                          <Move size={12} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', color: 'rgba(255,100,100,0.6)' }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      <Link
                        href={`/furniture/${product.id}`}
                        style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 4, padding: '5px 0', color: 'rgba(255,255,255,0.7)', fontSize: 10, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                      >
                        <Eye size={10} /> Lihat Produk
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Total & Checkout */}
          <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Total ({placedItems.length} item)</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>{formatIDR(totalPrice)}</span>
            </div>
            <button
              onClick={handleAddAllToCart}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: placedItems.length === 0 ? 0.5 : 1 }}
              disabled={placedItems.length === 0 ? true : undefined}
            >
              <ShoppingCart size={16} /> Beli Semua Furniture
            </button>
            {placedItems.length > 0 && (
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginTop: 8 }}>
                Semua furniture di canvas akan ditambahkan ke keranjang
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
