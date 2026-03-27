import { NextResponse } from "next/server";

// Konfigurasi direktori dan prefix untuk masing-masing radar
const RADAR_SITES: Record<string, { dir: string, prefix: string }> = {
  'BAL': { dir: 'Balikpapan', prefix: 'BAL' },
  'MTW': { dir: 'Muarateweh', prefix: 'MTW' },
  'BAN': { dir: 'Banjarmasin', prefix: 'BAN' }
};

export async function GET(request: Request) {
  // 1. SISTEM KEAMANAN
  const referer = request.headers.get("referer");
  const allowedDomain = "localhost:3000"; 
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!isDevelopment && (!referer || !referer.includes(allowedDomain))) {
    return new NextResponse("Akses Ditolak.", { status: 403 });
  }

  // 2. AMBIL PARAMETER SITE DARI URL
  const { searchParams } = new URL(request.url);
  const siteCode = searchParams.get("site") || "BAL"; // Default ke Balikpapan jika kosong
  
  const siteConfig = RADAR_SITES[siteCode];
  if (!siteConfig) {
    return new NextResponse("Kode Radar tidak valid.", { status: 400 });
  }

  try {
    const baseUrl = `https://cuaca.bmkg.go.id/data/public/sidarma/data/raster/${siteConfig.dir}/CMAX`;
    const now = new Date();
    
    let validUrl: string | null = null;
    let validTime: Date | null = null; 

    // 3. CARI FILE TERBARU
    for (let i = 0; i < 6; i++) {
      const checkTime = new Date(now.getTime() - (i * 5 * 60000));
      const minutes = Math.floor(checkTime.getUTCMinutes() / 5) * 5;
      checkTime.setUTCMinutes(minutes);
      
      const year = checkTime.getUTCFullYear();
      const month = String(checkTime.getUTCMonth() + 1).padStart(2, '0');
      const day = String(checkTime.getUTCDate()).padStart(2, '0');
      const dateStr = `${year}${month}${day}`;
      
      const hours = String(checkTime.getUTCHours()).padStart(2, '0');
      const mins = String(checkTime.getUTCMinutes()).padStart(2, '0');
      const timeStr = `${hours}${mins}`;
      
      // Gunakan prefix dinamis sesuai stasiun
      const targetUrl = `${baseUrl}/${siteConfig.prefix}-${dateStr}-${timeStr}.png`;
      
      const checkRes = await fetch(targetUrl, { method: 'HEAD' });
      if (checkRes.ok) {
        validUrl = targetUrl;
        validTime = checkTime;
        break; 
      }
    }

    if (!validUrl || !validTime) return new NextResponse("Radar tidak tersedia.", { status: 404 });

    // 4. UNDUH & KIRIM GAMBAR
    const imageResponse = await fetch(validUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        "X-Robots-Tag": "noindex, nofollow",
        "X-Radar-Time": validTime.toISOString()
      },
    });

  } catch (error) {
    return new NextResponse("Terjadi kesalahan sistem.", { status: 500 });
  }
}