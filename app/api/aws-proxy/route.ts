import { NextResponse } from 'next/server';
import { AWS_STATIONS } from '@/lib/aws-config';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // Cari konfigurasi stasiun berdasarkan ID, jika tidak ada pakai default (index 0)
  const station = AWS_STATIONS.find(s => s.id === id) || AWS_STATIONS[0];

  try {
    const res = await fetch(station.url, {
      cache: 'no-store',
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    if (!res.ok) throw new Error('Failed to fetch from Source');
    const data = await res.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch AWS data' }, { status: 500 });
  }
}