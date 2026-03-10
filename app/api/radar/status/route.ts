import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// URL Radar (Menggunakan Z=3, X=6, Y=4 sebagai sampel probe)
const PROBE_URL_PATTERN = (timeStr: string) => 
    `https://inasiam.bmkg.go.id/api/tilerv3/tiles/radar:reflectivity:output=shaded:modelrun=${timeStr}:validtime=${timeStr}/3/6/4`;

// Helper Delay
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function GET() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const checkTime = new Date();
    // Bulatkan ke 10 menit terdekat
    const minutes = Math.floor(checkTime.getUTCMinutes() / 10) * 10;
    checkTime.setUTCMinutes(minutes, 0, 0);

    // Loop Radar kita buat lebih panjang (24x = 4 jam) karena radar sering telat update dibanding satelit
    for (let i = 0; i < 24; i++) {
        const yyyy = checkTime.getUTCFullYear();
        const mm = String(checkTime.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(checkTime.getUTCDate()).padStart(2, '0');
        const hh = String(checkTime.getUTCHours()).padStart(2, '0');
        const min = String(checkTime.getUTCMinutes()).padStart(2, '0');
        const timeStr = `${yyyy}${mm}${dd}${hh}${min}`;

        const urlToCheck = PROBE_URL_PATTERN(timeStr);

        // --- TIMEOUT CONTROLLER ---
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // Max 3 detik

        try {
            const response = await fetch(urlToCheck, { 
                method: "HEAD", 
                headers: {
                    // Header Browser Standar agar lolos firewall
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Referer": "https://inasiam.bmkg.go.id/",
                    "Connection": "keep-alive"
                },
                cache: "no-store",
                next: { revalidate: 0 },
                signal: controller.signal
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
        } catch (e) {
            // Ignore error (Timeout/Reset) dan lanjut loop
        } finally {
            clearTimeout(timeoutId);
        }

        // --- DELAY 200ms ---
        await sleep(200);

        // Mundur 10 menit
        checkTime.setMinutes(checkTime.getMinutes() - 10);
    }

    // Jika gagal total, return status 200 OK dengan flag available: false
    // Ini agar frontend tidak crash, melainkan menampilkan badge "OFFLINE"
    return NextResponse.json({ 
        available: false, 
        message: "Radar Data Unreachable" 
    }, { status: 200 });
}