// app/radar-frame/[...path]/route.ts
import { NextResponse } from "next/server";

// UBAH INI: Masukkan alamat IP dan Port Gateway Proxmox Anda
// Contoh: "http://192.168.1.100:4000"
const GATEWAY_URL = process.env.GATEWAY_URL || "http://radar.bmkgaptpranoto.com"; 

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  // Di Next.js 15, params wajib di-await!
  const resolvedParams = await params;
  const pathString = resolvedParams.path.join("/");
  
  // Rakit URL menuju Proxmox
  const targetUrl = `${GATEWAY_URL}/radar-frame/${pathString}`;

  try {
    const res = await fetch(targetUrl, { cache: 'no-store' });
    
    if (!res.ok) {
        throw new Error("Gambar tidak ditemukan di Gateway");
    }

    const buffer = await res.arrayBuffer();

    // Kembalikan gambar murni ke Leaflet Peta
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600", // Cache 1 jam di browser
      }
    });
  } catch (err) {
    // Jika benar-benar gagal, tolak dengan cepat agar peta tidak hang
    return new NextResponse("Radar Image Not Found", { status: 404 });
  }
}