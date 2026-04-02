import { NextResponse } from 'next/server';
import { fetchBMKGHotspot } from '@/lib/data-karhutla'; 

export async function GET() {
  try {
    // 1. Ambil waktu hari ini
    const targetDate = new Date();
    
    // 2. Mundurkan tepat 1 hari ke belakang (H-1)
    targetDate.setDate(targetDate.getDate() - 1);
    
    // 3. Tarik datanya dari BMKG
    const data = await fetchBMKGHotspot(targetDate);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Gagal mengambil data hotspot H-1:", error);
    return NextResponse.json({ error: 'Gagal memuat hotspot' }, { status: 500 });
  }
}