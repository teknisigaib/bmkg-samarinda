import { NextRequest, NextResponse } from "next/server";
import { getAirportWeather } from "@/lib/aviation";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const icao = searchParams.get("icao");

  if (!icao) return NextResponse.json({ error: "Missing ICAO" }, { status: 400 });

  const data = await getAirportWeather(icao);

  if (!data) return NextResponse.json({ error: "Failed or Invalid ICAO" }, { status: 500 });

  return NextResponse.json(data);
}