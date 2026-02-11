import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("http://202.90.199.132/aws-new/data/station/latest/4000000055", {
      cache: "no-store", 
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch from source: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dari sensor" },
      { status: 500 }
    );
  }
}