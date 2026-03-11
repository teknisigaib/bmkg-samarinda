import { NextRequest, NextResponse } from "next/server";

// Paksa agar tidak menolak SSL jika ada masalah sertifikat
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  
  if (!url) {
    return new NextResponse("Missing URL", { status: 400 });
  }

  try {
    // 1. Backend kita menyamar menjadi browser asli dan mengambil gambar dari BMKG
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://inasiam.bmkg.go.id/",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8"
      },
      cache: "no-store", // Jangan simpan cache agar selalu fresh
    });

    if (!response.ok) {
       return new NextResponse(`BMKG Error: ${response.status}`, { status: response.status });
    }

    // 2. Ubah gambar menjadi format data biner (Buffer)
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. KUNCI UTAMA: Kita buat aturan/header baru yang BERSIH
    // Kita BUANG header Cross-Origin-Resource-Policy milik BMKG
    const headers = new Headers();
    headers.set("Content-Type", response.headers.get("Content-Type") || "image/png");
    headers.set("Cache-Control", "public, max-age=3600");
    headers.set("Access-Control-Allow-Origin", "*"); // Izinkan web kita membacanya

    // 4. Kirim gambar bersih ke browser
    return new NextResponse(buffer, {
      status: 200,
      headers: headers,
    });

  } catch (error) {
    console.error("Proxy Tile Error:", error);
    return new NextResponse("Internal Proxy Error", { status: 500 });
  }
}