import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Warming Stripes Kaltim | BMKG APT Pranoto Samarinda",
  description: "Visualisasi Warming Stripes perubahan iklim di Kalimantan Timur.",
};

export default function WarmingStripesPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 pt-4">
      <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
          items={[
            { label: "...", href: "/" },
            { label: "Iklim" },
            { label: "..." },
            { label: "..." },
            { label: "Warming Stripes" }
          ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mx-auto">
           <h1 className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Warming Stripes
           </h1>
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl">
              Indikator visual pergeseran suhu jangka panjang di wilayah Kalimantan Timur.
           </p>
        </section>

        {/* --- PURE TYPOGRAPHY CONTENT --- */}
        <div className="relative z-10 pt-8 border-t border-slate-200">
          
          {/* Tempat Gambar Warming Stripes (Pastikan lu punya gambarnya) */}
          <div className="mb-10 w-full flex justify-center">
             <Image 
                src="/perubahan-iklim/warming-stripes.png" 
                alt="Visualisasi Warming Stripes Kalimantan Timur" 
                width={800} 
                height={400} 
                className="w-full h-auto object-contain mix-blend-multiply"
             />
          </div>

          <div className="space-y-10">
            <article className="flex flex-col">
              <div className="flex items-start gap-3 mb-2">
                <div className="mt-2.5 w-2 h-2 rounded-full bg-slate-800 shrink-0"></div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                  Pergeseran Suhu di Kalimantan Timur
                </h3>
              </div>
              <p className="text-slate-700 text-base leading-relaxed text-justify pl-5">
                Visualisasi Warming Stripes di Kalimantan Timur menunjukkan pergeseran suhu yang didominasi warna biru (dingin) pada periode awal (1981–1996) menuju dominasi warna merah (hangat) yang makin intens pada dekade terakhir (2010-an ke atas). Fenomena suhu ekstrem positif sangat selaras dengan kejadian fenomena iklim global El Niño Kuat, ditunjukkan oleh lonjakan anomali tinggi pada tahun 1998 (+0.52C), 2016 (+0.66C yang menjadi rekor terpanas), serta tahun 2024 (+0.41C). Sebaliknya, penurunan anomali suhu yang cukup signifikan terjadi pada tahun 2025 (mencapai -0.11C, terlihat dari garis biru muda di paling ujung kanan) yang mengindikasikan fase pemulihan atau pengaruh dinamika atmosfer basah (La Niña) setelah lonjakan suhu di tahun 2023–2024.
              </p>
            </article>
          </div>
        </div>

      </div>
    </div>
  );
}