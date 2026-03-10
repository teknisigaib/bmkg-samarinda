import MaritimeDashboard from "@/components/component-cuaca/cuaca-maritim/MaritimeDashboard";
import { KALTIM_AREAS, createSlug, combineForecasts, getWilmetosGeoJson } from "@/lib/bmkg/maritim"; // Import getWilmetosGeoJson
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Prakiraan Cuaca Maritim | BMKG APT Pranoto Samarinda",
  description: "Informasi prakiraan cuaca perairan dan pelabuhan di wilayah perairan Kalimantan Timur.",
};

export default async function MaritimePage() {
  // 1. Fetch Data Cuaca (Batch)
  const weatherPromises = KALTIM_AREAS.map(async (name) => {
    const slug = createSlug(name);
    try {
      const res = await fetch(`https://maritim.bmkg.go.id/api/perairan?slug=${slug}`, {
        cache: 'no-store'
      });
      const json = await res.json();
      return { slug, data: combineForecasts(json) };
    } catch (e) { return null; }
  });

  // 2. Fetch Data Peta (GeoJSON) - Di Server!
  const geoJsonPromise = getWilmetosGeoJson();

  // Jalankan paralel agar cepat
  const [weatherResults, geoJsonData] = await Promise.all([
    Promise.all(weatherPromises),
    geoJsonPromise
  ]);

  const initialCache: Record<string, any> = {};
  weatherResults.forEach(res => {
    if (res) initialCache[res.slug] = res.data;
  });

  return (
    <main className="min-h-screen w-full  bg-white">
       {/* Kirim geoJsonData ke Dashboard */}
       <MaritimeDashboard initialData={initialCache} geoJsonData={geoJsonData} />
    </main>
  );
}