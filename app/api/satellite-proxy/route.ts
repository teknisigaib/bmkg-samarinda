import { NextRequest, NextResponse } from "next/server";
import { Buffer } from "node:buffer";

// Bypass SSL
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const z = searchParams.get("z");
  const x = searchParams.get("x");
  const y = searchParams.get("y");
  const baserun = searchParams.get("baserun"); 

  if (!z || !x || !y || !baserun) {
    return returnEmptyPixel();
  }

  // URL Target BMKG SATELLITE
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
        // --- OPTIMASI KUNCI ---
        // Sama seperti radar, gunakan immutable agar animasi smooth
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (error: any) {
    return returnEmptyPixel();
  }
}

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