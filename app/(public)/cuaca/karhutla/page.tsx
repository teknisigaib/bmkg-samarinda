export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { getHotspotTrend } from "@/lib/data-karhutla"; 
import HotspotMapWrapper from "@/components/component-cuaca/karhutla/HotspotMapWrapper";
import KarhutlaStaticMaps from "@/components/component-cuaca/karhutla/KarhutlaStaticMaps"; 
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionDivider from "@/components/ui/SectionDivider"; 

export const revalidate = 600; 

export const metadata: Metadata = {
  title: "Titik Panas (Hotspot) | BMKG APT Pranoto Samarinda",
  description: "Monitoring titik panas (hotspot) di wilayah Kalimantan Timur.",
};

export default async function KarhutlaPage() {
  // Hanya fetch data Rekap Tren & Statistik saja
  // Map sudah super mandiri mengambil data ribuan titik langsung via Client-side
  const trendData = await getHotspotTrend();

  return (
    <div className="min-h-screen">
       <div className="w-full mx-auto pt-0 pb-4 sm:px-4 lg:px-6">
          
          {/* --- BREADCRUMB --- */}
          <Breadcrumb className="mb-2" 
             items={[
               { label: "Beranda", href: "/" },
               { label: "Cuaca" }, 
               { label: "Peringatan Karhutla" } 
             ]} 
          />

          <div className="space-y-12 w-full mb-20">
            
            {/* 1. MAP UTAMA (Otomatis Fetch API di Client) */}
            <section>
              <HotspotMapWrapper />
            </section>

            {/* 3. PETA ANALISIS SPASIAL STATIC */}
            <section className="mt-24 scroll-mt-20">
              <SectionDivider title="Analisis & Prakiraan Spasial" className="mb-8" />
              <KarhutlaStaticMaps />
            </section>

          </div>
       </div>
    </div>
  );
}