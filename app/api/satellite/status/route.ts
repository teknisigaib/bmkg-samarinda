import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const PROBE_URL_PATTERN = (timeStr: string) => 
    `https://inasiam.bmkg.go.id/api/tilerv3/tiles/himawari:ir:output=shaded:modelrun=${timeStr}:validtime=${timeStr}/3/6/4?size=256`;

// Helper untuk delay (agar tidak membebani server BMKG)
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function GET() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const checkTime = new Date(); 
    // Bulatkan ke 10 menit terdekat
    const minutes = Math.floor(checkTime.getUTCMinutes() / 10) * 10;
    checkTime.setUTCMinutes(minutes, 0, 0);

    // Kita kurangi loop max jadi 12 (2 jam) agar tidak terlalu lama jika server down total
    for (let i = 0; i < 12; i++) {
        const yyyy = checkTime.getUTCFullYear();
        const mm = String(checkTime.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(checkTime.getUTCDate()).padStart(2, '0');
        const hh = String(checkTime.getUTCHours()).padStart(2, '0');
        const min = String(checkTime.getUTCMinutes()).padStart(2, '0');
        const timeStr = `${yyyy}${mm}${dd}${hh}${min}`;

        const urlToCheck = PROBE_URL_PATTERN(timeStr);

        // --- ADDED: ABORT CONTROLLER (TIMEOUT) ---
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // Max 3 detik per request

        try {
            const response = await fetch(urlToCheck, { 
                method: "HEAD", 
                headers: {
                    // Gunakan User-Agent Browser standar agar tidak diblokir Firewall
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Referer": "https://inasiam.bmkg.go.id/",
                    "Connection": "keep-alive"
                },
                cache: "no-store",
                next: { revalidate: 0 },
                signal: controller.signal // Pasang sinyal timeout
            });
            
            clearTimeout(timeoutId); // Hapus timer jika sukses

            const contentType = response.headers.get("content-type");
            
            if (response.ok && contentType && contentType.includes("image")) {
                return NextResponse.json({
                    available: true,
                    latest_time_code: timeStr,
                    timestamp: checkTime.getTime(),
                }, {
                    headers: { "Cache-Control": "no-store, max-age=0" }
                });
            }
        } catch (e: any) {
            // Tangkap error timeout atau ECONNRESET tanpa menghentikan loop
            // console.warn(`Probe skip ${timeStr}: ${e.message}`);
        } finally {
            clearTimeout(timeoutId);
        }

        // --- ADDED: DELAY ---
        // Beri jeda 200ms sebelum request berikutnya agar tidak dianggap spam
        await sleep(200);

        // Mundur 10 menit
        checkTime.setMinutes(checkTime.getMinutes() - 10);
    }

    // Jika loop selesai dan tidak ada hasil, return status OFFLine (bukan Error 500)
    return NextResponse.json({ 
        available: false, 
        message: "BMKG Server Unreachable or Data Stale" 
    }, { status: 200 }); // Return 200 OK tapi status available false, agar frontend tidak error
}