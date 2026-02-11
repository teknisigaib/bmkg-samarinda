import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: any) {
  const params = await context.params;
  const id = params?.id;

  if (!id) {
    return NextResponse.json(
      { message: "Parameter ID pelabuhan tidak ditemukan" },
      { status: 400 }
    );
  }

  const encodedId = encodeURIComponent(id);
  const url = `https://peta-maritim.bmkg.go.id/public_api/pelabuhan/${encodedId}.json`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`BMKG API returned status: ${response.status} for URL: ${url}`);
    }

    const jsonData = await response.json();

    if (!jsonData || !jsonData.data) {
      throw new Error("Format data API tidak valid atau 'data' kosong.");
    }

    return NextResponse.json(jsonData);

  } catch (error: any) {
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server: " + error.message },
      { status: 500 }
    );
  }
}
