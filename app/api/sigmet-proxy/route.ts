import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Pastikan data selalu fresh

export async function GET() {
  // URL Target: Aviation Weather Center (NOAA)
  const TARGET_URL = "https://aviationweather.gov/api/data/isigmet?format=geojson&level=3000";

  try {
    const response = await fetch(TARGET_URL, {
      headers: {
        // Penting: Beberapa API memblokir request tanpa User-Agent
        'User-Agent': 'Mozilla/5.0 (compatible; BMKG-Dashboard/1.0)',
      },
      // Opsional: Revalidate setiap 5 menit agar tidak spam ke server NOAA
      next: { revalidate: 300 } 
    });

    if (!response.ok) {
      throw new Error(`Upstream API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Kembalikan data ke frontend dengan status 200
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Proxy Sigmet Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data SIGMET", details: error.message },
      { status: 500 }
    );
  }
}