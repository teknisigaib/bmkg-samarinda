export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ClimateMapWrapper from "@/components/component-iklim/webgis-iklim/ClimateMapWrapper";

export const metadata: Metadata = {
  title: "WebGIS Iklim | BMKG APT Pranoto Samarinda",
  description: "Peta iklim interaktif visualisasi spasial curah hujan, sifat hujan, dan hari tanpa hujan (HTH) di wilayah Kalimantan Timur.",
};

export const revalidate = 60;

export default function PetaIklimPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-10">
      <div className="w-full mx-auto pt-0 space-y-6">
        
        <Breadcrumb 
            items={[
              { label: "Beranda", href: "/" },
              { label: "Iklim" }, 
              { label: "WebGIS Iklim" } 
            ]} 
        />

        <section className="relative flex flex-col items-center justify-center text-center mx-auto pt-0">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
           </div>
           
           <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              WebGIS Iklim
           </h1>
           
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl">
              Eksplorasi visual spasial secara interaktif untuk data curah hujan, prakiraan sifat hujan, dan hari tanpa hujan (HTH) wilayah Kalimantan Timur.
           </p>
        </section>

        {/* FIX: Wrapper Peta dibebaskan dari overflow-hidden agar kartu mobile bisa tampil di bawahnya */}
        <div className="px-0 md:px-4 w-full max-w-[1400px] mx-auto">
            <ClimateMapWrapper />
        </div>

      </div>
    </div>
  );
}