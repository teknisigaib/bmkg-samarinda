import type { Metadata } from "next";
import { Flame, Map as MapIcon, Info } from "lucide-react";
import { getHotspots } from "@/lib/data-karhutla";
import HotspotMapWrapper from "@/components/component-cuaca/karhutla/HotspotMapWrapper";
import KarhutlaStaticMaps from "@/components/component-cuaca/karhutla/KarhutlaStaticMaps"; 

export const metadata: Metadata = {
  title: "Peringatan Karhutla | BMKG Samarinda",
  description: "Monitoring titik panas (hotspot) di wilayah Kalimantan Timur.",
};

export default async function KarhutlaPage() {
  const hotspots = await getHotspots();

  return (
    <div className="space-y-10 w-full">
      
      {/* Intro */}
      <section className="bg-red-50 border border-red-100 rounded-xl p-6 flex gap-4 items-start shadow-sm">
        <div className="bg-white p-3 rounded-full shadow-sm">
            <Flame className="w-8 h-8 text-red-600" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-gray-800">Monitoring Titik Panas (Hotspot)</h2>
            <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                Peta sebaran titik panas di wilayah Kalimantan Timur berdasarkan pantauan satelit (SNPP/NOAA20). 
                Data diperbarui secara berkala untuk deteksi dini potensi kebakaran hutan dan lahan.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-red-100 text-xs font-bold text-red-600">
                <Info className="w-3 h-3" />
                Terdeteksi: {hotspots.length} Titik Panas
            </div>
        </div>
      </section>

      {/* PETA INTERAKTIF HOTSPOT */}
      <section>
        <HotspotMapWrapper data={hotspots} />
      </section>

      {/* --- BAGIAN BAWAH: PETA STATIS (SPARTAN) --- */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-gray-200 pb-3">
            <div className="flex items-center gap-3">
                <MapIcon className="w-6 h-6 text-gray-700" />
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Analisis & Prakiraan (SPARTAN)</h3>
                    <p className="text-sm text-gray-500">Sistem Peringatan Kebakaran Hutan dan Lahan</p>
                </div>
            </div>
        </div>

        {/* Panggil Komponen Peta Statis */}
        <KarhutlaStaticMaps />
        
      </section>

    </div>
  );
}