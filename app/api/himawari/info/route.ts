import { NextResponse } from "next/server";

export async function GET() {
  // 1. Buat Pengawas Waktu (Timeout)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // Set maksimal 8 detik

  try {
    const response = await fetch(`https://satellite.bmkg.go.id/api22/modelrun?t=${Date.now()}`, {
      cache: 'no-store',
      signal: controller.signal // Pasang pengawas di sini
    });
    
    clearTimeout(timeoutId); // Matikan alarm jika fetch berhasil cepat

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();
    const himawariDates: string[] = data.himawari9 || [];

    if (himawariDates.length === 0) throw new Error("Data himawari kosong dari BMKG");

    const recentDates = himawariDates.slice(0, 12).reverse();
    
    const processedFrames = recentDates.map((isoStr) => {
      const d = new Date(isoStr);
      const proxyUrl = `/api/himawari/tile?baserun=${isoStr}&z={z}&x={x}&y={y}`;

      return {
        timeUTC: isoStr,
        label: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC',
        dateLabel: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', timeZone: 'UTC' }),
        url: proxyUrl
      };
    });

    return NextResponse.json({
        latest: processedFrames[processedFrames.length - 1],
        frames: processedFrames,
        serverTimeUTC: new Date().toISOString()
    });

  } catch (error: any) {
    clearTimeout(timeoutId); // Pastikan alarm tetap dimatikan saat error
    
    // 2. Tangani Error dengan Elegan tanpa membuat Terminal merah penuh darah
    if (error.name === 'AbortError') {
        console.warn("[Himawari Info] Server BMKG terlalu lambat (Timeout 8 detik).");
        return NextResponse.json({ error: "Koneksi ke server BMKG terputus (Timeout)" }, { status: 504 });
    }
    
    console.warn("[Himawari Info] Gagal mengambil data:", error.message);
    return NextResponse.json({ error: "Gagal memproses data Himawari" }, { status: 500 });
  }
}