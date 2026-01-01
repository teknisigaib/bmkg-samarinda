// app/api/wilayah-proxy/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Ambil parameter 'q' dari URL (contoh: provinces.json)
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  try {
    // Server Next.js melakukan fetch ke GitHub (Tidak kena CORS)
    const targetUrl = `https://emsifa.github.io/api-wilayah-indonesia/api/${query}`;
    
    const res = await fetch(targetUrl);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch from source: ${res.statusText}`);
    }

    const data = await res.json();

    // Kembalikan data ke browser dengan status 200 OK
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}