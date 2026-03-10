import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  const { type, slug } = await params;
  
  // type = 'area' -> perairan
  // type = 'port' -> pelabuhan
  const endpoint = type === 'port' ? 'pelabuhan' : 'perairan';
  const url = `https://maritim.bmkg.go.id/api/${endpoint}?slug=${slug}`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return NextResponse.json({ error: "Gagal" }, { status: response.status });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}