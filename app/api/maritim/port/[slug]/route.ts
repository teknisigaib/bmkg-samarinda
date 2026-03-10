import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    // URL API khusus Pelabuhan
    const url = `https://maritim.bmkg.go.id/api/pelabuhan?slug=${slug}`;

    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return NextResponse.json({ error: "Gagal" }, { status: response.status });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}