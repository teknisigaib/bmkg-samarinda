import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const TARGET_URL = "https://aviationweather.gov/api/data/isigmet?format=geojson&level=3000";

  try {
    const response = await fetch(TARGET_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BMKG-Dashboard/1.0)',
      },
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