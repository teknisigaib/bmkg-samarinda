import { NextRequest, NextResponse } from "next/server";
import { Buffer } from "node:buffer";

// Bypass SSL
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // 1. Terima parameter
  const z = searchParams.get("z");
  const x = searchParams.get("x");
  const y = searchParams.get("y");
  const baserun = searchParams.get("baserun"); // Format: 2025-12-28T08:40:00Z

  // 2. Validasi
  if (!z || !x || !y || !baserun) {
    return returnEmptyPixel();
  }

  // 3. RAKIT URL SATELIT
  // Perhatikan: Satelit BMKG biasanya menggunakan standar XYZ (bukan TMS), jadi urutannya z/x/y
  const targetUrl = `https://satellite.bmkg.go.id/api22/tile/${z}/${x}/${y}.png?tiletype=himawari9&modelname=himawari9&param=EH&baserun=${baserun}`;

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Referer": "https://satellite.bmkg.go.id/",
      },
      cache: "no-store",
    });

    if (!response.ok) {
        return returnEmptyPixel();
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (error: any) {
    console.error("[Satellite Proxy Error]", error.message);
    return returnEmptyPixel();
  }
}

// Helper: Pixel Transparan
function returnEmptyPixel() {
  const emptyPixel = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
  );
  return new NextResponse(emptyPixel, {
    headers: { "Content-Type": "image/gif" },
  });
}