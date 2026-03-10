import { NextResponse } from 'next/server';

// PENTING: Mencegah Next.js melakukan caching statis saat build time
export const dynamic = 'force-dynamic';

export async function GET() {
  const TARGET_URL = "https://aviationweather.gov/api/data/isigmet?format=geojson&level=3000";

  try {
    const response = await fetch(TARGET_URL, {
      headers: {
        // Menyamar agar tidak diblokir firewall server tujuan
        'User-Agent': 'Mozilla/5.0 (compatible; BMKG-Dashboard/1.0)',
      },
      // Opsional: Revalidate setiap 5 menit (300 detik) jika masih ingin sedikit caching
      next: { revalidate: 300 } 
    });

    if (!response.ok) {
      throw new Error(`Upstream API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Proxy Sigmet Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data SIGMET", details: error.message },
      { status: 500 }
    );
  }
}