import { NextRequest, NextResponse } from "next/server";
import { Buffer } from "node:buffer";

// Bypass SSL Error (Opsional, untuk server BMKG yang kadang SSL-nya bermasalah)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const z = searchParams.get("z");
  const x = searchParams.get("x");
  const y = searchParams.get("y");
  const time = searchParams.get("time"); // Format: YYYYMMDDHHmm

  // Validasi Parameter
  if (!z || !x || !y || !time) {
    return returnEmptyPixel();
  }

  // URL Target Radar INA-SIAM
  const targetUrl = `https://inasiam.bmkg.go.id/api/tilerv3/tiles/radar:reflectivity:output=shaded:modelrun=${time}:validtime=${time}/${z}/${x}/${y}`;

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BMKG-Dashboard/1.0)",
        "Referer": "https://inasiam.bmkg.go.id/",
      },
      next: { revalidate: 300 } // Cache 5 menit
    });

    if (!response.ok) {
        return returnEmptyPixel();
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (error) {
    return returnEmptyPixel();
  }
}

// Helper: 1x1 Pixel Transparan (Supaya peta tidak error/silang merah)
function returnEmptyPixel() {
  const emptyPixel = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
  );
  return new NextResponse(emptyPixel, {
    headers: { 
        "Content-Type": "image/gif",
        "Cache-Control": "public, max-age=3600"
    },
  });
}