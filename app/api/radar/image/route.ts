import { NextResponse } from "next/server";

// Ganti dengan IP Proxmox Anda
const GATEWAY_URL = process.env.GATEWAY_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path"); // Contoh isi: /radar-frame/Tarakan/...

  if (!path) {
      return new NextResponse("Path gambar tidak diberikan", { status: 400 });
  }

  const targetUrl = `${GATEWAY_URL}${path}`;

  try {
    const res = await fetch(targetUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error("Gambar radar tidak ditemukan di server asli");
    
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600" // Peta Leaflet akan menyimpannya 1 jam
      }
    });
  } catch (err) {
    return new NextResponse("Gagal memuat gambar radar", { status: 500 });
  }
}