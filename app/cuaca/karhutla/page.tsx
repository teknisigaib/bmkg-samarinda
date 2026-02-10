export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { Map as MapIcon } from "lucide-react"; // Hapus import Flame, Info, RefreshCw
import { getRawWeeklyHotspots, getHotspotTrend } from "@/lib/data-karhutla"; 
import HotspotMapWrapper from "@/components/component-cuaca/karhutla/HotspotMapWrapper";
import KarhutlaStaticMaps from "@/components/component-cuaca/karhutla/KarhutlaStaticMaps"; 
import KarhutlaStats from "@/components/component-cuaca/karhutla/KarhutlaStats"; 

export const revalidate = 600; 

export const metadata: Metadata = {
  title: "Peringatan Karhutla | BMKG Samarinda",
  description: "Monitoring titik panas (hotspot) di wilayah Kalimantan Timur.",
};

export default async function KarhutlaPage() {
  const [weeklyHotspots, trendData] = await Promise.all([
    getRawWeeklyHotspots(),
    getHotspotTrend()
  ]);

  // Ambil tanggal update terakhir dari data paling baru yg didapat
  // Kita kirim string ini ke Client Component
  const lastUpdateString = weeklyHotspots.length > 0 
    ? weeklyHotspots[0].date.split(" ")[0] 
    : new Date().toLocaleDateString("id-ID");

  return (
    <div className="space-y-10 w-full mb-20">
      
      <section>
        <HotspotMapWrapper 
            data={weeklyHotspots} 
            lastUpdateString={lastUpdateString} 
        />
      </section>

      {/* STATISTIK & HIMBAUAN */}
      <section>
        <KarhutlaStats trend={trendData} />
      </section>

      {/* PETA ANALISIS SPARTAN */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-gray-200 pb-3">
            <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                   <MapIcon className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Analisis & Prakiraan (SPARTAN)</h3>
                    <p className="text-sm text-gray-500">Sistem Peringatan Kebakaran Hutan dan Lahan</p>
                </div>
            </div>
        </div>
        <KarhutlaStaticMaps />
      </section>

    </div>
  );
}