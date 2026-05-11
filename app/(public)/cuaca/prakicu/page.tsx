export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PrakicuWrapper from "@/components/component-cuaca/prakicu/PrakicuWrapper";

export const metadata: Metadata = {
  title: "Prakiraan Cuaca | BMKG APT Pranoto Samarinda",
  description: "Informasi prakiraan cuaca dan data observasi terkini untuk wilayah Kalimantan Timur dan sekitarnya.",
};

export default function PrakicuPage() {
  return (
    <div className="min-h-screen pb-24 bg-slate-50/50">
      {/* Container utama tanpa batas lebar (W-FULL) agar seragam dengan Pantauan Cuaca */}
      <div className="w-full mx-auto pt-6">
        
        {/* BREADCRUMB */}
        <Breadcrumb 
          className="mb-8" 
          items={[
            { label: "Beranda", href: "/" },
            { label: "Cuaca", href: "/cuaca" }, 
            { label: "Prakiraan Cuaca" } 
          ]} 
        />

        {/* HERO SECTION - Mengikuti style PantauanCuacaPage */}
        <section className="relative flex flex-col items-center justify-center text-center mb-10 mx-auto pt-2 max-w-3xl">
           {/* Efek Glow Latar Belakang (Warna Blue untuk membedakan dengan Cyan di Pantauan) */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
           </div>
           
           <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
             Prakiraan Cuaca
           </h1>
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4">
             Informasi prakiraan cuaca numerik berbasis model untuk wilayah Kalimantan Timur. Pantau pergerakan awan, suhu, dan intensitas hujan secara presisi.
           </p>
        </section>

        {/* WRAPPER KOMPONEN (Peta, AI, Voice Command) */}
        {/* Padding-x ditangani di dalam wrapper atau container ini agar tetap rapi */}
        <div className="w-full mx-auto">
          <PrakicuWrapper />
        </div>

      </div>
    </div>
  );
}