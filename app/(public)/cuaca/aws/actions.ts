"use server";

import { AWS_STATIONS, DEFAULT_STATION_ID } from "@/lib/aws-config";
import { transformAwsData } from "@/lib/aws-utils";
import { AwsApiData } from "@/lib/aws-types";

/**
 * Server Action untuk mengambil data AWS.
 * Berjalan di server, browser tidak akan melihat URL target.
 */
export async function getAwsStationData(stationId: string) {
  // 1. Cari URL berdasarkan ID
  const station = AWS_STATIONS.find((s) => s.id === stationId);
  
  if (!station) {
    throw new Error("Station ID not found");
  }

  try {
    // 2. Fetch ke API Asli (Server to Server)
    const res = await fetch(station.url, {
      cache: "no-store", // Pastikan data selalu real-time
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BMKG-Kaltim/1.0)",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data from ${station.name}`);
    }

    // 3. Transform Data di Server
    const json: AwsApiData = await res.json();
    const transformed = transformAwsData(json);

    return transformed;
  } catch (error) {
    console.error("AWS Server Action Error:", error);
    return null;
  }
}