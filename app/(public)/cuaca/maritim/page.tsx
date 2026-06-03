import MaritimeDashboard from "@/components/component-cuaca/cuaca-maritim/MaritimeDashboard";
import { KALTIM_AREAS, createSlug, combineForecasts, getWilmetosGeoJson } from "@/lib/bmkg/maritim";
import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Prakiraan Cuaca Maritim | BMKG APT Pranoto Samarinda",
  description: "Informasi prakiraan cuaca perairan dan pelabuhan di wilayah perairan Kalimantan Timur.",
};

export default async function MaritimePage() {
  // 1. Fetch Data Cuaca (Batch) dengan Penyamaran & Log Detektif
  const weatherPromises = KALTIM_AREAS.map(async (name) => {
    const slug = createSlug(name);
    try {
      const res = await fetch(`https://maritim.bmkg.go.id/api/perairan?slug=${slug}`, {
        cache: 'no-store',
        headers: {
          // 🛡️ PENYAMARAN: Biar API BMKG pusat ngira ini browser Chrome asli, bukan bot server!
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json",
          "Referer": "https://maritim.bmkg.go.id/"
        }
      });
      
      if (!res.ok) {
        throw new Error(`API BMKG nolak cuy! Status: ${res.status}`);
      }
      
      const json = await res.json();
      return { slug, data: combineForecasts(json) };
    } catch (e: any) { 
      // 🚨 DETEKTIF: Cetak erornya ke terminal server biar kita gak nebak-nebak
      console.error(`❌ [ERROR FETCH MARITIM] Gagal narik data untuk area ${name}:`, e.message);
      return null; 
    }
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
    <div className="min-h-screen">
       <div className="w-full mx-auto pt-0 pb-10 sm:px-4 lg:px-6">
           <Breadcrumb 
             className="mb-4" 
             items={[
               { label: "Beranda", href: "/" },
               { label: "Cuaca" }, 
               { label: "Cuaca Maritim" } 
             ]} 
           />
           {/* Kirim geoJsonData ke Dashboard */}
           <MaritimeDashboard initialData={initialCache} geoJsonData={geoJsonData} />
       </div>
    </div>
  );
}