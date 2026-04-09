'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Layers, Move, DoorOpen, Trash2, RotateCcw, Save, Box, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { getRoomLabel, getRoomColor } from '@/lib/utils';
import type { Room, RoomType } from '@/types';

const GRID_SIZE = 40; // pixels per 0.5m
const ROOM_TYPES: { type: RoomType; label: string; defaultW: number; defaultH: number }[] = [
  { type: 'ruang_tamu', label: 'Ruang Tamu', defaultW: 6, defaultH: 5 },
  { type: 'kamar_tidur', label: 'Kamar Tidur', defaultW: 5, defaultH: 4 },
  { type: 'dapur', label: 'Dapur', defaultW: 4, defaultH: 3 },
  { type: 'kamar_mandi', label: 'Kamar Mandi', defaultW: 2, defaultH: 2 },
  { type: 'ruang_makan', label: 'Ruang Makan', defaultW: 4, defaultH: 4 },
  { type: 'garasi', label: 'Garasi', defaultW: 5, defaultH: 4 },
  { type: 'ruang_kerja', label: 'Ruang Kerja', defaultW: 4, defaultH: 3 },
];

const TOOLS = [
  { id: 'draw', label: 'Gambar Ruangan', icon: Layers },
  { id: 'move', label: 'Pilih & Pindah', icon: Move },
  { id: 'door', label: 'Tambah Pintu', icon: DoorOpen },
  { id: 'delete', label: 'Hapus', icon: Trash2 },
];

type Tool = 'draw' | 'move' | 'door' | 'delete';

// ===== TOP BAR (extracted outside render) =====
interface TopBarProps {
  isMobile: boolean;
}

function TopBar({ isMobile }: TopBarProps) {
  return (
    <div style={{
      background: '#1a1a2e',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      padding: isMobile ? '10px 16px' : '12px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? 8 : 16,
      flexShrink: 0,
    }}>
      <Link href="/studio" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, flexShrink: 0 }}>
        <ArrowLeft size={16} /> {!isMobile && 'Studio'}
      </Link>
      {!isMobile && <ChevronRight size={14} color="rgba(255,255,255,0.3)" />}
      <span style={{ color: 'white', fontWeight: 600, fontSize: isMobile ? 14 : 16, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        Designer Denah Lantai
      </span>
      {!isMobile && (
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>— klik-seret untuk menggambar ruangan</span>
      )}
      <div style={{ marginLeft: isMobile ? 0 : 'auto', display: 'flex', gap: 8, flexShrink: 0 }}>
        <Link href="/studio/furniture-3d/demo" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Box size={14} /> {isMobile ? '3D' : 'Lanjut ke 3D'}
        </Link>
      </div>
    </div>
  );
}

// ===== DESKTOP PANEL (extracted outside render) =====
interface DesktopPanelProps {
  activeTool: Tool;
  setActiveTool: (t: Tool) => void;
  activeRoomType: RoomType;
  selectedRoom: Room | undefined;
  updateSelectedRoomDims: (w: number, h: number) => void;
  spawnRoom: (type: RoomType, defaultW: number, defaultH: number) => void;
  setRooms: (fn: (prev: Room[]) => Room[]) => void;
  setSelectedRoomId: (id: string | null) => void;
}

function DesktopPanel({ activeTool, setActiveTool, activeRoomType, selectedRoom, updateSelectedRoomDims, spawnRoom, setRooms, setSelectedRoomId }: DesktopPanelProps) {
  return (
    <div className="studio-panel" style={{ width: 240, padding: 20, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Tools */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-gold)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>ALAT</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {TOOLS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTool(id as Tool)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 'var(--radius-md)',
                border: 'none',
                background: activeTool === id ? 'rgba(201,168,76,0.2)' : 'transparent',
                color: activeTool === id ? 'var(--color-gold)' : 'rgba(255,255,255,0.7)',
                cursor: 'pointer', fontSize: 14,
                fontWeight: activeTool === id ? 600 : 400,
                transition: 'var(--transition)', width: '100%', textAlign: 'left',
                borderLeft: activeTool === id ? '2px solid var(--color-gold)' : '2px solid transparent',
              }}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Room Edit */}
      {selectedRoom && (
        <div style={{ background: 'rgba(201,168,76,0.1)', borderRadius: 'var(--radius-md)', padding: '12px 14px', border: '1px solid rgba(201,168,76,0.3)' }}>
          <p style={{ fontSize: 11, color: 'var(--color-gold)', fontWeight: 600, marginBottom: 4 }}>DIPILIH</p>
          <p style={{ fontSize: 15, color: 'white', fontWeight: 600 }}>{selectedRoom.label}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <label style={{ flex: 1 }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 4 }}>Lebar (X) = m</span>
              <input type="number" value={selectedRoom.width * 0.5}
                onChange={(e) => updateSelectedRoomDims(parseFloat(e.target.value) || 0.5, selectedRoom.height * 0.5)}
                style={{ width: '100%', padding: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--color-gold)', borderRadius: 4, fontSize: 13, fontWeight: 600 }}
                step="0.5" min="1" />
            </label>
            <label style={{ flex: 1 }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 4 }}>Panjang (Y) = m</span>
              <input type="number" value={selectedRoom.height * 0.5}
                onChange={(e) => updateSelectedRoomDims(selectedRoom.width * 0.5, parseFloat(e.target.value) || 0.5)}
                style={{ width: '100%', padding: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--color-gold)', borderRadius: 4, fontSize: 13, fontWeight: 600 }}
                step="0.5" min="1" />
            </label>
          </div>
        </div>
      )}

      {/* Room Types */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-gold)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>TIPE RUANGAN</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ROOM_TYPES.map(({ type, label, defaultW, defaultH }) => (
            <button
              key={type}
              onClick={() => spawnRoom(type, defaultW, defaultH)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: 'none',
                background: activeRoomType === type && activeTool === 'draw' ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                color: activeRoomType === type && activeTool === 'draw' ? 'var(--color-gold)' : 'rgba(255,255,255,0.7)',
                cursor: 'pointer', fontSize: 13, transition: 'var(--transition)', width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: getRoomColor(type), border: '1px solid rgba(255,255,255,0.2)' }} />
                {label}
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{defaultW * 0.5}×{defaultH * 0.5}m</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scale */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>SKALA</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[['—', '1 kotak = 0.5 m'], ['——', '2 kotak = 1 m'], ['————', '4 kotak = 2 m']].map(([line, lbl]) => (
            <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>{line}</span>
              {lbl}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button className="btn btn-primary" style={{ width: '100%', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
          <Save size={14} /> Simpan Desain
        </button>
        <button
          onClick={() => { setRooms(() => []); setSelectedRoomId(null); }}
          style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <RotateCcw size={14} /> Reset Semua
        </button>
      </div>
    </div>
  );
}

// ===== MOBILE BOTTOM SHEET (extracted outside render) =====
interface MobileBottomSheetProps {
  mobilePanel: 'tools' | 'rooms' | null;
  setMobilePanel: (p: 'tools' | 'rooms' | null) => void;
  rooms: Room[];
  activeTool: Tool;
  setActiveTool: (t: Tool) => void;
  selectedRoom: Room | undefined;
  updateSelectedRoomDims: (w: number, h: number) => void;
  spawnRoom: (type: RoomType, defaultW: number, defaultH: number) => void;
  setRooms: (fn: (prev: Room[]) => Room[]) => void;
  setSelectedRoomId: (id: string | null) => void;
}

function MobileBottomSheet({ mobilePanel, setMobilePanel, rooms, activeTool, setActiveTool, selectedRoom, updateSelectedRoomDims, spawnRoom, setRooms, setSelectedRoomId }: MobileBottomSheetProps) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#1a1a2e',
      borderTop: '1px solid rgba(255,255,255,0.15)',
      zIndex: 100,
      borderRadius: '16px 16px 0 0',
      maxHeight: mobilePanel ? '55vh' : 'auto',
      display: 'flex',
      flexDirection: 'column',
      transition: 'max-height 0.3s ease',
      boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
    }}>
      {/* Tab Bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        {(['tools', 'rooms'] as const).map((panel) => (
          <button
            key={panel}
            onClick={() => setMobilePanel(mobilePanel === panel ? null : panel)}
            style={{
              flex: 1, padding: '12px 8px', background: 'transparent', border: 'none',
              borderBottom: mobilePanel === panel ? '2px solid var(--color-gold)' : '2px solid transparent',
              color: mobilePanel === panel ? 'var(--color-gold)' : 'rgba(255,255,255,0.5)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {panel === 'tools'
              ? <><Layers size={14} /> Alat</>
              : <><Box size={14} /> Ruangan ({rooms.length})</>
            }
            {mobilePanel === panel ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        ))}
      </div>

      {mobilePanel === 'tools' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {/* Tool Buttons */}
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-gold)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 10 }}>ALAT</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            {TOOLS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setActiveTool(id as Tool); setMobilePanel(null); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 12px', borderRadius: 'var(--radius-md)', border: 'none',
                  background: activeTool === id ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)',
                  color: activeTool === id ? 'var(--color-gold)' : 'rgba(255,255,255,0.7)',
                  cursor: 'pointer', fontSize: 13, fontWeight: activeTool === id ? 600 : 400,
                  borderLeft: activeTool === id ? '2px solid var(--color-gold)' : '2px solid transparent',
                }}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
          {selectedRoom && (
            <div style={{ background: 'rgba(201,168,76,0.1)', borderRadius: 'var(--radius-md)', padding: '12px', border: '1px solid rgba(201,168,76,0.3)', marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: 'var(--color-gold)', fontWeight: 600, marginBottom: 4 }}>DIPILIH: {selectedRoom.label}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <label style={{ flex: 1 }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 4 }}>Lebar</span>
                  <input type="number" value={selectedRoom.width * 0.5}
                    onChange={(e) => updateSelectedRoomDims(parseFloat(e.target.value) || 0.5, selectedRoom.height * 0.5)}
                    style={{ width: '100%', padding: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--color-gold)', borderRadius: 4, fontSize: 13 }}
                    step="0.5" min="1" />
                </label>
                <label style={{ flex: 1 }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 4 }}>Panjang</span>
                  <input type="number" value={selectedRoom.height * 0.5}
                    onChange={(e) => updateSelectedRoomDims(selectedRoom.width * 0.5, parseFloat(e.target.value) || 0.5)}
                    style={{ width: '100%', padding: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--color-gold)', borderRadius: 4, fontSize: 13 }}
                    step="0.5" min="1" />
                </label>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" style={{ flex: 1, display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
              <Save size={14} /> Simpan
            </button>
            <button onClick={() => { setRooms(() => []); setSelectedRoomId(null); }}
              style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>
      )}

      {mobilePanel === 'rooms' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-gold)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 10 }}>TIPE RUANGAN — Ketuk untuk menambah</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {ROOM_TYPES.map(({ type, label, defaultW, defaultH }) => (
              <button
                key={type}
                onClick={() => spawnRoom(type, defaultW, defaultH)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px', borderRadius: 'var(--radius-md)', border: 'none',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.8)',
                  cursor: 'pointer', fontSize: 13,
                  transition: 'var(--transition)',
                }}
              >
                <div style={{ width: 12, height: 12, borderRadius: 2, background: getRoomColor(type), flexShrink: 0 }} />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 1 }}>{label}</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{defaultW * 0.5}×{defaultH * 0.5}m</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== CANVAS AREA (extracted outside render) =====
interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  CANVAS_W: number;
  CANVAS_H: number;
  isMobile: boolean;
  activeTool: Tool;
  rooms: Room[];
  isDrawing: boolean;
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: () => void;
  handleTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  handleTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
}

function CanvasArea({ canvasRef, CANVAS_W, CANVAS_H, isMobile, activeTool, rooms, isDrawing, handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove }: CanvasAreaProps) {
  return (
    <div style={{
      flex: 1,
      background: 'white',
      overflow: 'auto',
      position: 'relative',
      cursor: activeTool === 'draw' ? 'crosshair' : activeTool === 'move' ? 'grab' : 'default',
    }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{ display: 'block', minWidth: isMobile ? CANVAS_W : '100%', height: 'auto' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      />
      {rooms.length === 0 && !isDrawing && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', color: 'var(--text-muted)',
        }}>
          <Layers size={isMobile ? 36 : 48} color="var(--border-color)" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: isMobile ? 14 : 16, fontWeight: 500, color: 'var(--text-secondary)' }}>
            {isMobile ? 'Buka panel bawah untuk menambah ruangan' : 'Klik-seret untuk menggambar ruangan'}
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {isMobile ? 'Atau pilih tipe ruangan lalu sentuh kanvas' : 'Pilih tipe ruangan di panel kiri, lalu gambar di kanvas'}
          </p>
        </div>
      )}
    </div>
  );
}

// ===== MOBILE TOOL QUICK BAR (extracted outside render) =====
interface MobileQuickBarProps {
  activeTool: Tool;
  setActiveTool: (t: Tool) => void;
}

function MobileQuickBar({ activeTool, setActiveTool }: MobileQuickBarProps) {
  return (
    <div style={{
      background: '#1a1a2e',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      overflowX: 'auto',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', flexShrink: 0 }}>Alat:</span>
      {TOOLS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTool(id as Tool)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 10px', borderRadius: 'var(--radius-full)', border: 'none', flexShrink: 0,
            background: activeTool === id ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)',
            color: activeTool === id ? 'var(--color-gold)' : 'rgba(255,255,255,0.6)',
            cursor: 'pointer', fontSize: 11, fontWeight: activeTool === id ? 600 : 400,
            outline: activeTool === id ? '1px solid rgba(201,168,76,0.4)' : 'none',
          }}
        >
          <Icon size={12} /> {label}
        </button>
      ))}
    </div>
  );
}

// ===== MAIN PAGE =====
export default function FloorPlannerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTool, setActiveTool] = useState<Tool>('draw');
  const [activeRoomType, setActiveRoomType] = useState<RoomType>('ruang_tamu');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawCurrent, setDrawCurrent] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<'tools' | 'rooms' | null>('rooms');

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Canvas size based on device
  const CANVAS_W = isMobile ? 800 : 1200;
  const CANVAS_H = isMobile ? 500 : 700;

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += GRID_SIZE) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += GRID_SIZE) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Scale indicators
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '10px DM Sans, sans-serif';
    for (let i = 1; i <= Math.floor(canvas.width / GRID_SIZE); i++) {
      ctx.fillText(`${i * 0.5}m`, i * GRID_SIZE + 2, 12);
    }
    for (let i = 1; i <= Math.floor(canvas.height / GRID_SIZE); i++) {
      ctx.fillText(`${i * 0.5}m`, 2, i * GRID_SIZE + 10);
    }
    ctx.fillText('0m', 2, 12);

    // Draw rooms
    rooms.forEach((room) => {
      const rx = room.x * GRID_SIZE;
      const ry = room.y * GRID_SIZE;
      const rw = room.width * GRID_SIZE;
      const rh = room.height * GRID_SIZE;
      const isSelected = room.roomId === selectedRoomId;

      ctx.fillStyle = isSelected ? 'rgba(201,168,76,0.2)' : room.color;
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeStyle = isSelected ? 'var(--color-gold, #C9A84C)' : '#6B7280';
      ctx.lineWidth = isSelected ? 2 : 1.5;
      ctx.strokeRect(rx, ry, rw, rh);
      ctx.fillStyle = '#374151';
      ctx.font = `${isSelected ? '600' : '500'} 12px DM Sans, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(room.label, rx + rw / 2, ry + rh / 2 - 6);
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '10px DM Sans, sans-serif';
      const wMeters = (room.width * 0.5).toFixed(1);
      const hMeters = (room.height * 0.5).toFixed(1);
      ctx.fillText(`${wMeters}×${hMeters}m`, rx + rw / 2, ry + rh / 2 + 10);
      ctx.textAlign = 'left';
    });

    // Draw preview
    if (isDrawing && drawStart && drawCurrent) {
      const rx = Math.min(drawStart.x, drawCurrent.x);
      const ry = Math.min(drawStart.y, drawCurrent.y);
      const rw = Math.abs(drawCurrent.x - drawStart.x);
      const rh = Math.abs(drawCurrent.y - drawStart.y);
      const color = getRoomColor(activeRoomType);
      ctx.fillStyle = color.replace(')', ', 0.5)').replace('rgb', 'rgba');
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeStyle = '#C9A84C';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(rx, ry, rw, rh);
      ctx.setLineDash([]);
    }
  }, [rooms, selectedRoomId, isDrawing, drawStart, drawCurrent, activeRoomType]);

  useEffect(() => { redrawCanvas(); }, [redrawCanvas]);

  const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;
  const getPlacementOffset = (count: number) => (count % 5) - 2;

  const getCanvasPosFromMouse = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const getCanvasPosFromTouch = (touch: React.Touch, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    };
  };

  const getRoomAtPos = (x: number, y: number): Room | null => {
    for (let i = rooms.length - 1; i >= 0; i--) {
      const r = rooms[i];
      const rx = r.x * GRID_SIZE, ry = r.y * GRID_SIZE;
      const rw = r.width * GRID_SIZE, rh = r.height * GRID_SIZE;
      if (x >= rx && x <= rx + rw && y >= ry && y <= ry + rh) return r;
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPosFromMouse(e);
    if (activeTool === 'draw') {
      const snapped = { x: snapToGrid(pos.x), y: snapToGrid(pos.y) };
      setDrawStart(snapped); setDrawCurrent(snapped); setIsDrawing(true);
    } else if (activeTool === 'move') {
      const room = getRoomAtPos(pos.x, pos.y);
      if (room) {
        setSelectedRoomId(room.roomId); setIsDragging(true);
        setDragOffset({ x: pos.x - room.x * GRID_SIZE, y: pos.y - room.y * GRID_SIZE });
      } else { setSelectedRoomId(null); }
    } else if (activeTool === 'delete') {
      const room = getRoomAtPos(pos.x, pos.y);
      if (room) { setRooms((prev) => prev.filter((r) => r.roomId !== room.roomId)); setSelectedRoomId(null); }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPosFromMouse(e);
    if (isDrawing) {
      setDrawCurrent({ x: snapToGrid(pos.x), y: snapToGrid(pos.y) });
    } else if (isDragging && selectedRoomId) {
      const snapped = { x: snapToGrid(pos.x - dragOffset.x), y: snapToGrid(pos.y - dragOffset.y) };
      setRooms((prev) => prev.map((r) =>
        r.roomId === selectedRoomId ? { ...r, x: snapped.x / GRID_SIZE, y: snapped.y / GRID_SIZE } : r
      ));
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && drawStart && drawCurrent) {
      const rx = Math.min(drawStart.x, drawCurrent.x);
      const ry = Math.min(drawStart.y, drawCurrent.y);
      const rw = Math.abs(drawCurrent.x - drawStart.x);
      const rh = Math.abs(drawCurrent.y - drawStart.y);
      if (rw >= GRID_SIZE && rh >= GRID_SIZE) {
        const newRoom: Room = {
          roomId: crypto.randomUUID(),
          type: activeRoomType,
          label: getRoomLabel(activeRoomType),
          x: rx / GRID_SIZE, y: ry / GRID_SIZE,
          width: Math.round(rw / GRID_SIZE),
          height: Math.round(rh / GRID_SIZE),
          color: getRoomColor(activeRoomType),
          elements: [],
        };
        setRooms((prev) => [...prev, newRoom]);
        setSelectedRoomId(newRoom.roomId);
      }
    }
    setIsDrawing(false); setDrawStart(null); setDrawCurrent(null); setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const touch = e.touches[0];
    const pos = getCanvasPosFromTouch(touch, canvas);
    if (activeTool === 'draw') {
      const snapped = { x: snapToGrid(pos.x), y: snapToGrid(pos.y) };
      setDrawStart(snapped); setDrawCurrent(snapped); setIsDrawing(true);
    } else if (activeTool === 'move') {
      const room = getRoomAtPos(pos.x, pos.y);
      if (room) {
        setSelectedRoomId(room.roomId); setIsDragging(true);
        setDragOffset({ x: pos.x - room.x * GRID_SIZE, y: pos.y - room.y * GRID_SIZE });
      } else { setSelectedRoomId(null); }
    } else if (activeTool === 'delete') {
      const room = getRoomAtPos(pos.x, pos.y);
      if (room) { setRooms((prev) => prev.filter((r) => r.roomId !== room.roomId)); setSelectedRoomId(null); }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const touch = e.touches[0];
    const pos = getCanvasPosFromTouch(touch, canvas);
    if (isDrawing) {
      setDrawCurrent({ x: snapToGrid(pos.x), y: snapToGrid(pos.y) });
    } else if (isDragging && selectedRoomId) {
      const snapped = { x: snapToGrid(pos.x - dragOffset.x), y: snapToGrid(pos.y - dragOffset.y) };
      setRooms((prev) => prev.map((r) =>
        r.roomId === selectedRoomId ? { ...r, x: snapped.x / GRID_SIZE, y: snapped.y / GRID_SIZE } : r
      ));
    }
  };

  const selectedRoom = rooms.find((r) => r.roomId === selectedRoomId);

  const updateSelectedRoomDims = (wMeters: number, hMeters: number) => {
    setRooms(prev => prev.map(r =>
      r.roomId === selectedRoomId
        ? { ...r, width: Math.max(1, wMeters * 2), height: Math.max(1, hMeters * 2) }
        : r
    ));
  };

  const spawnRoom = (type: RoomType, defaultW: number, defaultH: number) => {
    const sameTypeCount = rooms.filter((room) => room.type === type).length;
    const newRoom: Room = {
      roomId: crypto.randomUUID(),
      type: type,
      label: getRoomLabel(type),
      x: Math.round((CANVAS_W / GRID_SIZE) / 2) - Math.floor(defaultW / 2) + getPlacementOffset(sameTypeCount),
      y: Math.round((CANVAS_H / GRID_SIZE) / 2) - Math.floor(defaultH / 2) + getPlacementOffset(sameTypeCount + 2),
      width: defaultW,
      height: defaultH,
      color: getRoomColor(type),
      elements: [],
    };
    setRooms((prev) => [...prev, newRoom]);
    setSelectedRoomId(newRoom.roomId);
    setActiveRoomType(type);
    setActiveTool('move');
    if (isMobile) setMobilePanel(null);
  };

  const canvasAreaProps: CanvasAreaProps = {
    canvasRef, CANVAS_W, CANVAS_H, isMobile, activeTool, rooms, isDrawing,
    handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove,
  };

  const desktopPanelProps: DesktopPanelProps = {
    activeTool, setActiveTool, activeRoomType, selectedRoom,
    updateSelectedRoomDims, spawnRoom, setRooms, setSelectedRoomId,
  };

  const mobileBottomSheetProps: MobileBottomSheetProps = {
    mobilePanel, setMobilePanel, rooms, activeTool, setActiveTool,
    selectedRoom, updateSelectedRoomDims, spawnRoom, setRooms, setSelectedRoomId,
  };

  if (!isMobile) {
    // DESKTOP
    return (
      <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', background: '#1a1a2e', overflow: 'hidden' }}>
        <TopBar isMobile={isMobile} />
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
          <DesktopPanel {...desktopPanelProps} />
          <CanvasArea {...canvasAreaProps} />
        </div>
      </div>
    );
  }

  // MOBILE
  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', background: '#1a1a2e', overflow: 'hidden', position: 'relative' }}>
      <TopBar isMobile={isMobile} />
      <MobileQuickBar activeTool={activeTool} setActiveTool={setActiveTool} />
      <div style={{
        flex: 1,
        overflow: 'hidden',
        paddingBottom: mobilePanel ? '55vh' : '48px',
        transition: 'padding-bottom 0.3s ease',
      }}>
        <CanvasArea {...canvasAreaProps} />
      </div>
      <MobileBottomSheet {...mobileBottomSheetProps} />
    </div>
  );
}
