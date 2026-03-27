import { NextResponse } from "next/server";

// Ganti dengan IP Proxmox Anda
const GATEWAY_URL = process.env.GATEWAY_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const site = searchParams.get("site");

  if (!site) return NextResponse.json({ error: "Parameter site wajib diisi" }, { status: 400 });

  try {
    const res = await fetch(`${GATEWAY_URL}/radar-api/${site}/data`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Gagal menghubungi Gateway");
    
    const data = await res.json();

    // 1. REWRITE URL LATEST -> Arahkan ke Proxy Internal
    if (data.latest && data.latest.url) {
        data.latest.url = `/api/radar/image?path=${encodeURIComponent(data.latest.url)}`;
    }
    
    // 2. REWRITE SEMUA URL FRAMES -> Arahkan ke Proxy Internal
    if (data.frames && Array.isArray(data.frames)) {
        data.frames = data.frames.map((frame: any) => ({
            ...frame,
            url: `/api/radar/image?path=${encodeURIComponent(frame.url)}`
        }));
    }
    
    return NextResponse.json(data);

  } catch (error) {
    console.error("Radar Info API Error:", error);
    return NextResponse.json({ error: "Gagal memproses data radar" }, { status: 500 });
  }
}