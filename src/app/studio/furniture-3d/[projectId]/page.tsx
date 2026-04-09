'use client';

import { useState, useRef, Suspense, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ChevronRight, ShoppingCart,
  Search, Eye, X, Move, MousePointer, RotateCw,
  ChevronUp, ChevronDown, Paintbrush, Store,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { Canvas, useThree, type ThreeEvent } from '@react-three/fiber';
import {
  OrbitControls, Grid, Environment, Text, Box,
} from '@react-three/drei';
import * as THREE from 'three';
import { FURNITURE } from '@/lib/data/furniture';
import { formatIDR } from '@/lib/utils';
import type { FurnitureProduct } from '@/types';

// ===== CONSTANTS =====
const GRID_SNAP = 0.5;

function snapVal(v: number) { return Math.round(v / GRID_SNAP) * GRID_SNAP; }

function setGlobalCursor(cursor: string) {
  if (typeof document !== 'undefined') { document.body.style.cursor = cursor; }
}

// ===== ROOM BOX =====
function RoomBox({ wallColor = '#f5f5f5', floorType = 'parket' }: { wallColor?: string; floorType?: string }) {
  const floorColors: Record<string, string> = {
    parket: '#D4B896', marmer: '#E8E8E8', beton: '#9CA3AF', karpet: '#6B7280',
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
  const pointerPos = useRef(new THREE.Vector2());

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onSelect();
    if (!isDragMode) return;
    dragPos.current.set(...position);
    dragging.current = true;
    setGlobalCursor('grabbing');
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
        const maxX = 4 - w / 2, minX = -4 + w / 2;
        const maxZ = 4 - d / 2, minZ = -4 + d / 2;
        dragPos.current.set(Math.max(minX, Math.min(maxX, rawX)), 0, Math.max(minZ, Math.min(maxZ, rawZ)));
        if (meshRef.current) meshRef.current.position.set(dragPos.current.x, 0, dragPos.current.z);
      }
    };
    const onUp = () => {
      dragging.current = false;
      setGlobalCursor('');
      onDragEnd([dragPos.current.x, 0, dragPos.current.z]);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [isDragMode, onSelect, onDragEnd, camera, gl, raycaster, w, d, position]);

  const dragRot = useRef(rotation);
  const rotating = useRef(false);
  useEffect(() => { if (!rotating.current) dragRot.current = rotation; }, [rotation]);

  const handleRotatePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onSelect();
    if (!isDragMode) return;
    rotating.current = true;
    setGlobalCursor('grab');
    let initialAngle = 0;
    const initialRot = rotation;
    const rect = gl.domElement.getBoundingClientRect();
    pointerPos.current.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointerPos.current, camera);
    if (raycaster.ray.intersectPlane(floorPlane.current, intersection.current)) {
      initialAngle = Math.atan2(intersection.current.x - position[0], intersection.current.z - position[2]);
    }
    const onMove = (ev: PointerEvent) => {
      const rect2 = gl.domElement.getBoundingClientRect();
      pointerPos.current.set(
        ((ev.clientX - rect2.left) / rect2.width) * 2 - 1,
        -((ev.clientY - rect2.top) / rect2.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointerPos.current, camera);
      if (raycaster.ray.intersectPlane(floorPlane.current, intersection.current)) {
        const currentAngle = Math.atan2(intersection.current.x - position[0], intersection.current.z - position[2]);
        let newRot = initialRot + (currentAngle - initialAngle);
        newRot = Math.round(newRot / (Math.PI / 8)) * (Math.PI / 8);
        dragRot.current = newRot;
        if (meshRef.current) meshRef.current.rotation.y = dragRot.current;
      }
    };
    const onUp = () => {
      rotating.current = false;
      setGlobalCursor('');
      onRotateEnd(dragRot.current);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [isDragMode, onSelect, camera, gl, raycaster, position, rotation, onRotateEnd]);

  return (
    <group ref={meshRef} position={position} rotation={[0, rotation, 0]} onPointerDown={handlePointerDown}>
      <Box args={[w, h, d]} position={[0, h / 2, 0]} castShadow>
        <meshStandardMaterial
          color={isSelected ? '#C9A84C' : baseColor} roughness={0.6} metalness={0.1}
          emissive={isSelected && isDragMode ? '#7a5a00' : '#000000'}
          emissiveIntensity={isSelected && isDragMode ? 0.3 : 0}
        />
      </Box>
      {isSelected && (
        <Text position={[0, h + 0.25, 0]} fontSize={0.15} color="#C9A84C" anchorX="center" anchorY="bottom">
          {item.name.split(' ').slice(0, 3).join(' ')}
        </Text>
      )}
      {isSelected && (
        <group position={[0, 0.01, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[Math.max(w, d) * 0.6, Math.max(w, d) * 0.7, 32]} />
            <meshBasicMaterial color="#C9A84C" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
          {isDragMode && (
            <group
              position={[Math.max(w, d) * 0.65, 0.05, 0]}
              onPointerDown={handleRotatePointerDown}
              onPointerOver={(e) => { e.stopPropagation(); setGlobalCursor('grab'); }}
              onPointerOut={(e) => { e.stopPropagation(); setGlobalCursor(''); }}
            >
              <mesh><sphereGeometry args={[0.2, 8, 8]} /><meshBasicMaterial visible={false} /></mesh>
              <mesh><sphereGeometry args={[0.06, 16, 16]} /><meshStandardMaterial color="#FFFFFF" emissive="#C9A84C" emissiveIntensity={0.5} /></mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.1, 0.02, 16, 32]} /><meshBasicMaterial color="#C9A84C" /></mesh>
            </group>
          )}
        </group>
      )}
    </group>
  );
}

function SceneClickDeselect({ onDeselect }: { onDeselect: () => void }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} onPointerDown={(e) => { e.stopPropagation(); onDeselect(); }}>
      <planeGeometry args={[100, 100]} /><meshBasicMaterial visible={false} />
    </mesh>
  );
}

interface PlacedItem { id: string; productId: string; position: [number, number, number]; rotation: number; }

const WALL_COLORS = [
  { name: 'Navy', hex: '#1E3A5F' }, { name: 'Cokelat', hex: '#92400E' },
  { name: 'Sage', hex: '#4B7A5E' }, { name: 'Abu', hex: '#6B7280' },
  { name: 'Putih', hex: '#F5F5F5' }, { name: 'Merah Bata', hex: '#B91C1C' },
];
const FLOOR_TYPES = ['Parket', 'Marmer', 'Beton', 'Karpet'];
const LIGHTING_OPTIONS = ['Siang', 'Senja', 'Malam'];

type ViewMode = 'view' | 'move';
type MobileTab = 'shop' | 'kustom' | 'keranjang' | null;

// ===== 3D CANVAS COMPONENT =====
function Studio3DCanvas({ placedItems, selectedItemId, setSelectedItemId, wallColor, floorType, lightMode, viewMode, handleDragEnd, handleRotateEnd, environmentPresets }: {
  placedItems: PlacedItem[]; selectedItemId: string | null; setSelectedItemId: (id: string | null) => void;
  wallColor: string; floorType: string; lightMode: string; viewMode: ViewMode;
  handleDragEnd: (id: string, pos: [number, number, number]) => void;
  handleRotateEnd: (id: string, rot: number) => void;
  environmentPresets: Record<string, 'city' | 'sunset' | 'night' | 'apartment'>;
}) {
  const isDragMode = viewMode === 'move';
  return (
    <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }} style={{ width: '100%', height: '100%', cursor: isDragMode ? 'default' : 'grab' }}>
      <Suspense fallback={null}><Environment preset={environmentPresets[lightMode] || 'city'} /></Suspense>
      <ambientLight intensity={lightMode === 'Malam' ? 0.3 : 0.6} />
      <directionalLight position={[5, 8, 5]} intensity={lightMode === 'Malam' ? 0.5 : 1} castShadow shadow-mapSize={[1024, 1024]} />
      <RoomBox wallColor={wallColor} floorType={floorType} />
      <SceneClickDeselect onDeselect={() => setSelectedItemId(null)} />
      {placedItems.map((item) => {
        const product = FURNITURE.find((f) => f.id === item.productId);
        if (!product) return null;
        return (
          <FurnitureBox3D key={item.id} item={product} position={item.position} rotation={item.rotation || 0}
            isSelected={selectedItemId === item.id} isDragMode={isDragMode}
            onSelect={() => setSelectedItemId(item.id)}
            onDragEnd={(newPos) => handleDragEnd(item.id, newPos)}
            onRotateEnd={(newRot) => handleRotateEnd(item.id, newRot)}
          />
        );
      })}
      <OrbitControls makeDefault enabled={!isDragMode} enablePan={!isDragMode} />
      <Grid args={[8, 8]} cellSize={0.5} cellColor="#4B5563" sectionColor="#6B7280" fadeDistance={20} />
    </Canvas>
  );
}

// ===== FURNITURE LIST COMPONENT (extracted outside render) =====
interface FurnitureListProps {
  compact?: boolean;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filterCategory: string;
  setFilterCategory: (v: string) => void;
  filteredFurniture: FurnitureProduct[];
  addToCanvas: (item: FurnitureProduct) => void;
}

function FurnitureList({ compact = false, searchQuery, setSearchQuery, filterCategory, setFilterCategory, filteredFurniture, addToCanvas }: FurnitureListProps) {
  return (
    <>
      {/* Search */}
      <div style={{ padding: compact ? '12px 14px 8px' : '16px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }} />
          <input
            type="text" placeholder="Cari furniture..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '8px 8px 8px 30px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', fontSize: 13, outline: 'none' }}
          />
        </div>
        {/* Category chips */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {['Semua', 'sofa', 'meja', 'kursi', 'lampu'].map((cat) => (
            <button key={cat} onClick={() => setFilterCategory(cat)} style={{
              padding: '4px 12px', borderRadius: 999, border: '1px solid',
              borderColor: filterCategory === cat ? 'var(--color-gold)' : 'rgba(255,255,255,0.15)',
              background: filterCategory === cat ? 'var(--color-gold)' : 'transparent',
              color: filterCategory === cat ? '#1A1A2E' : 'rgba(255,255,255,0.6)',
              fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filteredFurniture.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', paddingTop: 20 }}>Tidak ditemukan</p>
        ) : filteredFurniture.map((item) => (
          <div key={item.id}
            onClick={() => addToCanvas(item)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 12px',
              cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.45)'}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = 'transparent'}
          >
            {/* Emoji icon */}
            <div style={{ width: 46, height: 46, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>
              {item.category === 'sofa' ? '🛋️' : item.category === 'meja' ? '🪑' : item.category === 'lampu' ? '💡' : item.category === 'kursi' ? '🪑' : '🪴'}
            </div>
            {/* Info */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
              <p style={{ fontSize: 12, color: 'var(--color-gold)', fontWeight: 500 }}>{formatIDR(item.price)}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{item.category} · {item.model3d.dimensions.width}×{item.model3d.dimensions.depth}cm</p>
            </div>
            {/* Add button */}
            <button style={{
              background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.35)',
              borderRadius: 6, padding: '6px 10px', color: 'var(--color-gold)',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0, lineHeight: 1,
            }}>
              + Tambah
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

// ===== CUSTOMIZATION PANEL (extracted outside render) =====
interface KustomPanelProps {
  wallColor: string;
  setWallColor: (v: string) => void;
  floorType: string;
  setFloorType: (v: string) => void;
  lightMode: string;
  setLightMode: (v: string) => void;
}

function KustomPanel({ wallColor, setWallColor, floorType, setFloorType, lightMode, setLightMode }: KustomPanelProps) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px' }}>
      {/* Wall Color */}
      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-gold)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Warna Dinding</p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {WALL_COLORS.map((c) => (
          <button key={c.hex} title={c.name} onClick={() => setWallColor(c.hex)} style={{
            width: 36, height: 36, borderRadius: '50%', background: c.hex, cursor: 'pointer', outline: 'none',
            border: wallColor === c.hex ? '3px solid var(--color-gold)' : '3px solid transparent',
            boxShadow: wallColor === c.hex ? '0 0 0 2px rgba(201,168,76,0.4)' : 'none',
          }} />
        ))}
      </div>

      {/* Floor */}
      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-gold)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>Jenis Lantai</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {FLOOR_TYPES.map((f) => (
          <button key={f} onClick={() => setFloorType(f.toLowerCase())} style={{
            padding: '7px 14px', borderRadius: 8, border: '1px solid',
            borderColor: floorType === f.toLowerCase() ? 'var(--color-gold)' : 'rgba(255,255,255,0.2)',
            background: floorType === f.toLowerCase() ? 'var(--color-gold)' : 'rgba(255,255,255,0.05)',
            color: floorType === f.toLowerCase() ? '#1A1A2E' : 'rgba(255,255,255,0.7)',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>{f}</button>
        ))}
      </div>

      {/* Lighting */}
      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-gold)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>Pencahayaan</p>
      <div style={{ display: 'flex', gap: 8 }}>
        {LIGHTING_OPTIONS.map((l) => (
          <button key={l} onClick={() => setLightMode(l)} style={{
            padding: '7px 14px', borderRadius: 8, border: '1px solid',
            borderColor: lightMode === l ? 'var(--color-gold)' : 'rgba(255,255,255,0.2)',
            background: lightMode === l ? 'var(--color-gold)' : 'rgba(255,255,255,0.05)',
            color: lightMode === l ? '#1A1A2E' : 'rgba(255,255,255,0.7)',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>{l}</button>
        ))}
      </div>
    </div>
  );
}

// ===== CART PANEL CONTENT (extracted outside render) =====
interface CartPanelContentProps {
  placedItems: PlacedItem[];
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  setMobileTab: (tab: MobileTab) => void;
  setViewMode: (mode: ViewMode) => void;
  handleRotate: (id: string) => void;
  removeItem: (id: string) => void;
  handleAddAllToCart: () => void;
  totalPrice: number;
}

function CartPanelContent({ placedItems, selectedItemId, setSelectedItemId, setMobileTab, setViewMode, handleRotate, removeItem, handleAddAllToCart, totalPrice }: CartPanelContentProps) {
  return (
    <>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Selected position info */}
        {placedItems.length > 0 && selectedItemId && (() => {
          const sel = placedItems.find((i) => i.id === selectedItemId);
          return sel ? (
            <div style={{ padding: '8px 10px', background: 'rgba(201,168,76,0.1)', borderRadius: 8, border: '1px solid rgba(201,168,76,0.2)', marginBottom: 4 }}>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Posisi Dipilih</p>
              <p style={{ fontSize: 12, color: 'var(--color-gold)', fontFamily: 'monospace' }}>X: {sel.position[0].toFixed(1)}m &nbsp; Z: {sel.position[2].toFixed(1)}m</p>
            </div>
          ) : null;
        })()}

        {placedItems.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 24 }}>
            <p style={{ fontSize: 28, marginBottom: 8 }}>🛋️</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Belum ada furniture di canvas</p>
            <button onClick={() => setMobileTab('shop')} style={{
              marginTop: 12, padding: '8px 16px', background: 'rgba(201,168,76,0.15)',
              border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8,
              color: 'var(--color-gold)', fontSize: 13, cursor: 'pointer',
            }}>Buka Shop →</button>
          </div>
        ) : placedItems.map((item) => {
          const product = FURNITURE.find((f) => f.id === item.productId);
          if (!product) return null;
          return (
            <div key={item.id}
              style={{
                background: selectedItemId === item.id ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.05)',
                borderRadius: 10, padding: '11px 12px',
                border: selectedItemId === item.id ? '1px solid rgba(201,168,76,0.35)' : '1px solid transparent',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onClick={() => setSelectedItemId(item.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 2, lineHeight: 1.3 }}>{product.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-gold)' }}>{formatIDR(product.price)}</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2, fontFamily: 'monospace' }}>
                    ({item.position[0].toFixed(1)}, {item.position[2].toFixed(1)})
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <button onClick={(e) => { e.stopPropagation(); handleRotate(item.id); setSelectedItemId(item.id); }}
                    title="Putar 90°"
                    style={{ background: 'rgba(201,168,76,0.15)', border: 'none', borderRadius: 6, padding: '5px 7px', color: 'var(--color-gold)', cursor: 'pointer' }}>
                    <RotateCw size={12} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedItemId(item.id); setViewMode('move'); }}
                    title="Pindahkan"
                    style={{ background: 'rgba(201,168,76,0.15)', border: 'none', borderRadius: 6, padding: '5px 7px', color: 'var(--color-gold)', cursor: 'pointer' }}>
                    <Move size={12} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                    style={{ background: 'rgba(255,80,80,0.1)', border: 'none', borderRadius: 6, padding: '5px 7px', color: 'rgba(255,100,100,0.7)', cursor: 'pointer' }}>
                    <X size={12} />
                  </button>
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <Link href={`/furniture/${product.id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 6, padding: '5px 10px', color: 'rgba(255,255,255,0.6)', fontSize: 11, textDecoration: 'none', width: 'fit-content' }}>
                  <Eye size={10} /> Lihat Produk
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total & CTA */}
      <div style={{ padding: '14px', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>Total ({placedItems.length} item)</span>
          <span style={{ fontSize: 17, fontWeight: 700, color: 'white' }}>{formatIDR(totalPrice)}</span>
        </div>
        <button onClick={handleAddAllToCart} className="btn btn-primary"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: placedItems.length === 0 ? 0.5 : 1 }}
          disabled={placedItems.length === 0}>
          <ShoppingCart size={16} /> Beli Semua Furniture
        </button>
      </div>
    </>
  );
}

// ===== DESKTOP LEFT PANEL (extracted outside render) =====
interface DesktopLeftPanelProps extends FurnitureListProps, KustomPanelProps {}

function DesktopLeftPanel(props: DesktopLeftPanelProps) {
  return (
    <div className="studio-panel" style={{ width: 300, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <p style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Katalog Furniture</p>
      </div>
      <FurnitureList {...props} />
      {/* Customization below list on desktop */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-gold)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>Kustomisasi</p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Warna Dinding</p>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          {WALL_COLORS.map((c) => (
            <button key={c.hex} title={c.name} onClick={() => props.setWallColor(c.hex)} style={{
              width: 26, height: 26, borderRadius: '50%', background: c.hex, cursor: 'pointer', outline: 'none',
              border: props.wallColor === c.hex ? '2px solid var(--color-gold)' : '2px solid transparent',
            }} />
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Lantai</p>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          {FLOOR_TYPES.map((f) => (
            <button key={f} onClick={() => props.setFloorType(f.toLowerCase())} style={{
              padding: '3px 8px', borderRadius: 999, border: '1px solid',
              borderColor: props.floorType === f.toLowerCase() ? 'var(--color-gold)' : 'rgba(255,255,255,0.2)',
              background: props.floorType === f.toLowerCase() ? 'var(--color-gold)' : 'transparent',
              color: props.floorType === f.toLowerCase() ? '#1A1A2E' : 'rgba(255,255,255,0.6)',
              fontSize: 11, cursor: 'pointer',
            }}>{f}</button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Cahaya</p>
        <div style={{ display: 'flex', gap: 6 }}>
          {LIGHTING_OPTIONS.map((l) => (
            <button key={l} onClick={() => props.setLightMode(l)} style={{
              padding: '3px 8px', borderRadius: 999, border: '1px solid',
              borderColor: props.lightMode === l ? 'var(--color-gold)' : 'rgba(255,255,255,0.2)',
              background: props.lightMode === l ? 'var(--color-gold)' : 'transparent',
              color: props.lightMode === l ? '#1A1A2E' : 'rgba(255,255,255,0.6)',
              fontSize: 11, cursor: 'pointer',
            }}>{l}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== DESKTOP RIGHT PANEL (extracted outside render) =====
function DesktopRightPanel(props: CartPanelContentProps) {
  return (
    <div className="studio-panel" style={{ width: 280, display: 'flex', flexDirection: 'column', borderRight: 'none', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShoppingCart size={16} color="var(--color-gold)" />
          <p style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>Ringkasan Furniture</p>
        </div>
      </div>
      <CartPanelContent {...props} />
    </div>
  );
}

// ===== TOP BAR (extracted outside render) =====
interface TopBarProps {
  isMobile: boolean;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

function TopBar({ isMobile, viewMode, setViewMode }: TopBarProps) {
  return (
    <div style={{
      background: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.1)',
      padding: isMobile ? '10px 14px' : '11px 24px',
      display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16, flexShrink: 0,
    }}>
      <Link href="/studio" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, flexShrink: 0 }}>
        <ArrowLeft size={16} />{!isMobile && ' Studio'}
      </Link>
      {!isMobile && <ChevronRight size={14} color="rgba(255,255,255,0.3)" />}
      <span style={{ color: 'white', fontWeight: 600, fontSize: isMobile ? 14 : 16, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        3D Furniture Try-On
      </span>
      {/* Mode toggle */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.07)', borderRadius: 8, padding: 3, gap: 3, flexShrink: 0 }}>
        {([
          { mode: 'view' as ViewMode, Icon: MousePointer, label: 'Kamera' },
          { mode: 'move' as ViewMode, Icon: Move, label: 'Pindah' },
        ]).map(({ mode, Icon, label }) => (
          <button key={mode} onClick={() => setViewMode(mode)} title={label} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: isMobile ? '5px 9px' : '6px 12px',
            borderRadius: 6, border: 'none',
            background: viewMode === mode ? 'rgba(201,168,76,0.25)' : 'transparent',
            color: viewMode === mode ? '#C9A84C' : 'rgba(255,255,255,0.5)',
            cursor: 'pointer', fontSize: 12, fontWeight: viewMode === mode ? 700 : 400,
          }}>
            <Icon size={13} />{!isMobile && ` ${label}`}
          </button>
        ))}
      </div>
    </div>
  );
}

// ===== MOBILE BOTTOM SHEET (extracted outside render) =====
interface MobileBottomSheetProps {
  mobileTab: MobileTab;
  setMobileTab: (tab: MobileTab) => void;
  placedItems: PlacedItem[];
  furnitureListProps: FurnitureListProps;
  kustomPanelProps: KustomPanelProps;
  cartPanelProps: CartPanelContentProps;
}

function MobileBottomSheet({ mobileTab, setMobileTab, placedItems, furnitureListProps, kustomPanelProps, cartPanelProps }: MobileBottomSheetProps) {
  const BOTTOM_PANEL_HEIGHT = '62vh';
  const TABS: { id: MobileTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'shop', label: 'Shop', icon: <Store size={15} /> },
    { id: 'kustom', label: 'Kustomisasi', icon: <Paintbrush size={15} /> },
    { id: 'keranjang', label: 'Keranjang', icon: <ShoppingCart size={15} />, badge: placedItems.length },
  ];

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#1a1a2e',
      borderTop: '2px solid rgba(255,255,255,0.1)',
      zIndex: 200,
      borderRadius: '18px 18px 0 0',
      maxHeight: mobileTab ? BOTTOM_PANEL_HEIGHT : 'auto',
      display: 'flex', flexDirection: 'column',
      transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1)',
      boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
    }}>
      {/* Tab Bar */}
      <div style={{ display: 'flex', flexShrink: 0 }}>
        {TABS.map(({ id, label, icon, badge }) => (
          <button key={id} onClick={() => setMobileTab(mobileTab === id ? null : id)} style={{
            flex: 1, padding: '13px 6px 10px',
            background: 'transparent', border: 'none',
            borderBottom: mobileTab === id ? '2px solid var(--color-gold)' : '2px solid transparent',
            color: mobileTab === id ? 'var(--color-gold)' : 'rgba(255,255,255,0.45)',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            position: 'relative',
          }}>
            {icon} {label}
            {/* Badge */}
            {(badge !== undefined && badge > 0) && (
              <span style={{
                position: 'absolute', top: 8, right: '22%',
                background: '#C9A84C', color: '#1A1A2E',
                borderRadius: '50%', width: 16, height: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 800, lineHeight: 1,
              }}>{badge}</span>
            )}
            {/* Chevron */}
            {mobileTab === id
              ? <ChevronDown size={12} style={{ opacity: 0.6 }} />
              : <ChevronUp size={12} style={{ opacity: 0.4 }} />
            }
          </button>
        ))}
      </div>

      {/* Content */}
      {mobileTab && (
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {mobileTab === 'shop' && <FurnitureList {...furnitureListProps} compact />}
          {mobileTab === 'kustom' && <KustomPanel {...kustomPanelProps} />}
          {mobileTab === 'keranjang' && <CartPanelContent {...cartPanelProps} />}
        </div>
      )}
    </div>
  );
}

// ===== CENTER CANVAS AREA (extracted outside render) =====
interface CanvasCenterProps {
  extraPaddingBottom?: string;
  isDragMode: boolean;
  isMobile: boolean;
  placedItems: PlacedItem[];
  canvasProps: {
    placedItems: PlacedItem[];
    selectedItemId: string | null;
    setSelectedItemId: (id: string | null) => void;
    wallColor: string;
    floorType: string;
    lightMode: string;
    viewMode: ViewMode;
    handleDragEnd: (id: string, pos: [number, number, number]) => void;
    handleRotateEnd: (id: string, rot: number) => void;
    environmentPresets: Record<string, 'city' | 'sunset' | 'night' | 'apartment'>;
  };
}

function CanvasCenter({ extraPaddingBottom, isDragMode, isMobile, placedItems, canvasProps }: CanvasCenterProps) {
  return (
    <div style={{ flex: 1, position: 'relative', background: '#2d2d4e', overflow: 'hidden', paddingBottom: extraPaddingBottom }}>
      {/* Mode badge */}
      <div style={{
        position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, pointerEvents: 'none',
        background: isDragMode ? 'rgba(201,168,76,0.2)' : 'rgba(0,0,0,0.45)',
        border: `1px solid ${isDragMode ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.12)'}`,
        borderRadius: 20, padding: '5px 14px',
        display: 'flex', alignItems: 'center', gap: 6,
        backdropFilter: 'blur(8px)', whiteSpace: 'nowrap',
      }}>
        {isDragMode
          ? <><Move size={11} color="#C9A84C" /><span style={{ fontSize: 11, color: '#C9A84C', fontWeight: 600 }}>Mode Pindah — seret furniture</span></>
          : <><MousePointer size={11} color="rgba(255,255,255,0.6)" /><span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Mode Kamera — seret untuk putar</span></>
        }
      </div>

      <Studio3DCanvas {...canvasProps} />

      {placedItems.length === 0 && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', textAlign: 'center',
        }}>
          <div style={{ opacity: 0.4 }}>
            <p style={{ fontSize: 30, marginBottom: 10 }}>🛋️</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: isMobile ? 13 : 15, fontWeight: 500 }}>
              {isMobile ? 'Buka Shop di bawah untuk menambah furniture' : 'Pilih furniture dari katalog untuk ditempatkan'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

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
  const [mobileTab, setMobileTab] = useState<MobileTab>('shop');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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
      id: crypto.randomUUID(), productId: product.id,
      position: [
        parseFloat((((existing % 5) - 2) + offset).toFixed(1)), 0,
        parseFloat(((((existing + 2) % 5) - 2) + offset).toFixed(1)),
      ],
      rotation: 0,
    };
    setPlacedItems((prev) => [...prev, newItem]);
    setSelectedItemId(newItem.id);
    setViewMode('move');
    if (isMobile) setMobileTab('keranjang');
  };

  const removeItem = (id: string) => {
    setPlacedItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedItemId === id) setSelectedItemId(null);
  };

  const handleDragEnd = (id: string, newPos: [number, number, number]) =>
    setPlacedItems((prev) => prev.map((item) => item.id === id ? { ...item, position: newPos } : item));

  const handleRotate = (id: string) =>
    setPlacedItems((prev) => prev.map((item) => item.id === id ? { ...item, rotation: (item.rotation || 0) + Math.PI / 2 } : item));

  const handleRotateEnd = (id: string, newRot: number) =>
    setPlacedItems((prev) => prev.map((item) => item.id === id ? { ...item, rotation: newRot } : item));

  const handleAddAllToCart = () => {
    placedItems.forEach((item) => {
      const product = FURNITURE.find((f) => f.id === item.productId);
      if (product) {
        addItem({
          id: crypto.randomUUID(), productId: product.id, productType: 'furniture',
          name: product.name, price: product.price, thumbnail: product.images[0],
          quantity: 1, fromDesignId: '3d-studio-project',
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

  const canvasProps = {
    placedItems, selectedItemId, setSelectedItemId,
    wallColor, floorType, lightMode, viewMode,
    handleDragEnd, handleRotateEnd, environmentPresets,
  };

  const furnitureListProps: FurnitureListProps = {
    searchQuery, setSearchQuery, filterCategory, setFilterCategory,
    filteredFurniture, addToCanvas,
  };

  const kustomPanelProps: KustomPanelProps = {
    wallColor, setWallColor, floorType, setFloorType, lightMode, setLightMode,
  };

  const cartPanelProps: CartPanelContentProps = {
    placedItems, selectedItemId, setSelectedItemId,
    setMobileTab, setViewMode, handleRotate, removeItem,
    handleAddAllToCart, totalPrice,
  };

  const canvasCenterProps: CanvasCenterProps = {
    isDragMode, isMobile, placedItems, canvasProps,
  };

  // ===== DESKTOP LAYOUT =====
  if (!isMobile) {
    return (
      <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', background: '#1a1a2e', overflow: 'hidden' }}>
        <TopBar isMobile={isMobile} viewMode={viewMode} setViewMode={setViewMode} />
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
          <DesktopLeftPanel {...furnitureListProps} {...kustomPanelProps} />
          <CanvasCenter {...canvasCenterProps} />
          <DesktopRightPanel {...cartPanelProps} />
        </div>
      </div>
    );
  }

  // ===== MOBILE LAYOUT =====
  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', background: '#1a1a2e', overflow: 'hidden', position: 'relative' }}>
      <TopBar isMobile={isMobile} viewMode={viewMode} setViewMode={setViewMode} />
      <CanvasCenter {...canvasCenterProps} extraPaddingBottom={mobileTab ? '62vh' : '56px'} />
      <MobileBottomSheet
        mobileTab={mobileTab}
        setMobileTab={setMobileTab}
        placedItems={placedItems}
        furnitureListProps={furnitureListProps}
        kustomPanelProps={kustomPanelProps}
        cartPanelProps={cartPanelProps}
      />
    </div>
  );
}
