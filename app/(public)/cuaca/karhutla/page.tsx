// app/cuaca/karhutla/page.tsx
export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { getRawWeeklyHotspots, getHotspotTrend } from "@/lib/data-karhutla"; 
import HotspotMapWrapper from "@/components/component-cuaca/karhutla/HotspotMapWrapper";
import KarhutlaStaticMaps from "@/components/component-cuaca/karhutla/KarhutlaStaticMaps"; 
import KarhutlaStats from "@/components/component-cuaca/karhutla/KarhutlaStats"; 
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionDivider from "@/components/ui/SectionDivider"; 

export const revalidate = 600; 

export const metadata: Metadata = {
  title: "Peringatan Karhutla | BMKG APT PranotoSamarinda",
  description: "Monitoring titik panas (hotspot) di wilayah Kalimantan Timur.",
};

export default async function KarhutlaPage() {
  const [weeklyHotspots, trendData] = await Promise.all([
    getRawWeeklyHotspots(),
    getHotspotTrend()
  ]);

  // Ambil tanggal update terakhir
  const lastUpdateString = weeklyHotspots.length > 0 
    ? weeklyHotspots[0].date.split(" ")[0] 
    : new Date().toLocaleDateString("id-ID");

  return (
    <div className="min-h-screen">
       <div className="w-full mx-auto pt-6 pb-10 sm:px-4 lg:px-6">
          
          {/* --- BREADCRUMB --- */}
          <Breadcrumb 
             className="mb-10" 
             items={[
               { label: "Beranda", href: "/" },
               { label: "Cuaca" }, 
               { label: "Peringatan Karhutla" } 
             ]} 
          />

          <div className="space-y-12 w-full mb-20">
            
            {/* 1. MAP UTAMA */}
            <section>
              <HotspotMapWrapper 
                  data={weeklyHotspots} 
                  lastUpdateString={lastUpdateString} 
              />
            </section>

            {/* 2. STATISTIK & HIMBAUAN */}
            <section className="mt-24 scroll-mt-20">
              <SectionDivider title="Statistik & Tren Karhutla" className="mb-8" />
              <KarhutlaStats trend={trendData} />
            </section>

            {/* 3. PETA ANALISIS SPASIAL */}
            <section className="mt-24 scroll-mt-20">
              <SectionDivider title="Analisis & Prakiraan Spasial" className="mb-8" />
              <KarhutlaStaticMaps />
            </section>

          </div>
       </div>
    </div>
  );
}