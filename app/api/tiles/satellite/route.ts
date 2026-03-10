import { NextRequest, NextResponse } from "next/server";
import { Buffer } from "node:buffer";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
export const dynamic = 'force-dynamic';

// --- HELPER FUNCTIONS ---

// Mengubah string "202403061200" menjadi Date Object
function parseTimeCode(timeCode: string): Date {
  const year = parseInt(timeCode.substring(0, 4));
  const month = parseInt(timeCode.substring(4, 6)) - 1; 
  const day = parseInt(timeCode.substring(6, 8));
  const hour = parseInt(timeCode.substring(8, 10));
  const min = parseInt(timeCode.substring(10, 12));
  return new Date(Date.UTC(year, month, day, hour, min));
}

// Mengubah Date Object menjadi string "202403061200"
function formatTimeCode(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const min = String(date.getUTCMinutes()).padStart(2, '0');
  return `${year}${month}${day}${hour}${min}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const z = searchParams.get("z");
  const x = searchParams.get("x");
  const y = searchParams.get("y");
  let timeStr = searchParams.get("time"); // Waktu awal dari Frontend

  if (!z || !x || !y || !timeStr) return returnEmptyPixel();

  let attempt = 0;
  const maxRetries = 6; // Coba mundur sampai 60 menit ke belakang (6 x 10 menit)
  let finalResponse: Response | null = null;

  // --- LOGIKA SMART SEARCH ---
  while (attempt < maxRetries) {
    // URL INA-SIAM (Sesuai request)
    const targetUrl = `https://inasiam.bmkg.go.id/api/tilerv3/tiles/himawari:ir:output=shaded:modelrun=${timeStr}:validtime=${timeStr}/${z}/${x}/${y}?size=256`;

    try {
      // console.log(`Attempt ${attempt + 1}: Fetching ${timeStr}...`); // Uncomment untuk debug server

      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; BMKG-Dashboard/1.0)",
          // Header Referer kadang wajib untuk INA-SIAM
          "Referer": "https://inasiam.bmkg.go.id/",
        },
        next: { revalidate: 300 }
      });

      // Cek apakah response valid & berupa gambar
      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("image")) {
        finalResponse = response;
        break; // BERHASIL! Keluar dari loop
      }

      // GAGAL? Mundurkan waktu 10 menit
      const dateObj = parseTimeCode(timeStr!);
      dateObj.setMinutes(dateObj.getMinutes() - 10);
      timeStr = formatTimeCode(dateObj); // Set waktu baru untuk loop berikutnya
      
      attempt++;

    } catch (error) {
      // Jika network error, coba lagi dengan waktu mundur
      attempt++;
    }
  }

  // --- HASIL AKHIR ---
  if (finalResponse) {
    const arrayBuffer = await finalResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=600, s-maxage=600",
        "Access-Control-Allow-Origin": "*",
        // Header info supaya kita tahu data jam berapa yang akhirnya didapat
        "X-Satellite-Timestamp": timeStr || "unknown" 
      },
    });
  }

  // Menyerah setelah 6x percobaan -> Return Transparan
  return returnEmptyPixel();
}

function returnEmptyPixel() {
  const emptyPixel = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");
  return new NextResponse(emptyPixel, { headers: { "Content-Type": "image/gif" } });
}