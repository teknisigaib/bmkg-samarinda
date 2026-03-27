import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const baserun = searchParams.get("baserun");
  const z = searchParams.get("z");
  const x = searchParams.get("x");
  const y = searchParams.get("y");

  if (!baserun || !z || !x || !y) {
      return new NextResponse("Koordinat Tile tidak valid", { status: 400 });
  }

  const targetUrl = `https://satellite.bmkg.go.id/api22/tile/${z}/${x}/${y}.png?tiletype=himawari9&modelname=himawari9&param=EH&baserun=${baserun}`;

  // 1. Buat Pengawas Waktu (Timeout 5 detik)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); 

  try {
    const res = await fetch(targetUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error("Tile HTTP Fail");
    
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
        "X-Robots-Tag": "noindex, nofollow"
      }
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    
    // 2. Silent Fail: Jangan pakai console.error() agar terminal tidak banjir!
    // Kita cukup kirim 404 atau 504 ke Leaflet. Leaflet akan mengabaikannya (tile dibiarkan kosong)
    const status = err.name === 'AbortError' ? 504 : 404;
    return new NextResponse("Tile Tidak Tersedia", { status });
  }
}