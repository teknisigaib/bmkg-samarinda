// app/api/nowcast/route.ts

import { NextResponse } from 'next/server';
import { fetchArcgisNowcasting } from '@/lib/bmkg/nowcast'; // ✅ Import dari lib

export async function GET() {
  try {
    // Panggil fungsi sentral
    const data = await fetchArcgisNowcasting();

    if (!data) {
      throw new Error("Data kosong dari BMKG");
    }
    
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 's-maxage=300, stale-while-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data dari BMKG." },
      { status: 500 }
    );
  }
}