import type { Metadata } from "next";
import { Satellite, Globe2 } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import EHSatelitSection from "@/components/component-cuaca/satelit/EHSatelitSection";
import RPSatelitSection from "@/components/component-cuaca/satelit/RPSatelitSection";

export const metadata: Metadata = {
  title: "Citra Satelit Cuaca | BMKG APT Pranoto Samarinda",
  description:
    "Citra satelit Himawari dan HCAI dari BMKG untuk pemantauan cuaca di wilayah Indonesia dan Kalimantan Timur.",
};

export default function SatelitPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="w-full mx-auto pt-6 lg:px-8 max-w-7xl space-y-6">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
            items={[
              { label: "Beranda", href: "/" },
              { label: "Cuaca" }, 
              { label: "Citra Satelit" } 
            ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mb-10 max-w-3xl mx-auto pt-2">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
           </div>
           
           <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Citra Satelit Cuaca
           </h1>
           
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-4xl mb-8">
              Pemantauan tutupan awan dan sebaran potensi hujan waktu nyata (*real-time*) menggunakan instrumen satelit Himawari-9.
           </p>

           <div className="relative z-10 flex flex-wrap justify-center items-center bg-white border border-slate-200 rounded-2xl shadow-sm p-1">
              <div className="flex items-center gap-2 px-4 py-1.5 border-r border-slate-100">
                 <Satellite className="w-4 h-4 text-blue-500" />
                 <span className="text-xs font-semibold text-slate-700">Satelit Himawari-9</span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-1.5">
                 <Globe2 className="w-4 h-4 text-emerald-500" />
                 <span className="text-xs font-semibold text-slate-500">Wilayah Indonesia</span>
              </div>
           </div>
        </section>

        {/* --- KONTEN GRID SATELIT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <EHSatelitSection />
          <RPSatelitSection />
        </div>

      </div>
    </div>
  );
}