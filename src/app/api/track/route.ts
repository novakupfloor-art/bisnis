import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Kita menggunakan file public/data.json atau folder di luar publik untuk menyimpan logs
// Di lingkungan production berbasis Node.js/Laragon, file ini akan bertahan secara lokal.
const dataDir = path.join(process.cwd(), 'data');
const dataFilePath = path.join(dataDir, 'tracking.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Pastikan direktori data ada
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Baca data yang ada
    let logs: any[] = [];
    try {
      const fileData = await fs.readFile(dataFilePath, 'utf8');
      logs = JSON.parse(fileData);
    } catch {
      // Jika belum ada file tracking atau error, mulai dengan array kosong
    }

    // Tambah log baru ke urutan pertama
    const newLog = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      ip: body.ip || 'Unknown IP',
      userAgent: body.userAgent || 'Unknown Agent',
      location: body.location || 'Unknown Location',
      org: body.org || 'Unknown Org',
      path: body.path || '/',
      isSuspicious: body.isSuspicious || false,
      countryCode: body.countryCode || 'XX'
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
    let logs: any[] = [];
    try {
      const fileData = await fs.readFile(dataFilePath, 'utf8');
      logs = JSON.parse(fileData);
    } catch {
      logs = []; // Return empty array if file not created yet
    }
    
    return NextResponse.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    console.error('Tracking GET Error:', error);
    return NextResponse.json({ success: false, error: 'Gagal membaca data tracking' }, { status: 500 });
  }
}
