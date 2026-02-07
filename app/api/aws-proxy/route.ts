// src/app/api/aws-proxy/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Server Next.js melakukan fetch ke API HTTP (ini diperbolehkan di sisi server)
    const res = await fetch("http://202.90.199.132/aws-new/data/station/latest/4000000055", {
      cache: "no-store", // Pastikan selalu ambil data terbaru
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch from source: ${res.status}`);
    }

    const data = await res.json();

    // Kembalikan data ke frontend dengan status 200
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dari sensor" },
      { status: 500 }
    );
  }
}