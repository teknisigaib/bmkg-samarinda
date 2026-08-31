import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Analisis Suhu Rata-Rata Harian | BMKG APT Pranoto Samarinda",
  description: "Analisis grafik historis suhu udara rata-rata harian di Stasiun Meteorologi APT Pranoto Samarinda.",
};

export default function AnalisisSuhuHarianPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 pt-4">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
          items={[
            { label: "...", href: "/" },
            { label: "Iklim" },
            { label: "..." },
            { label: "..." },
            { label: "Analisis Suhu Harian" }
          ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mx-auto">
           <h1 className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Analisis Suhu Harian
           </h1>
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl">
              Pemantauan tren historis suhu udara harian di Stasiun Meteorologi APT Pranoto Samarinda.
           </p>
        </section>

        {/* --- PURE TYPOGRAPHY CONTENT --- */}
        <div className="relative z-10 pt-8 border-t border-slate-200">
          
          {/* Tempat Gambar Grafik Suhu Harian */}
          <div className="mb-10 w-full flex justify-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
             <Image 
                src="/perubahan-iklim/suhu-harian.png" 
                alt="Grafik Historis Suhu Udara Rata-Rata Harian" 
                width={800} 
                height={400} 
                className="w-full h-auto object-contain mix-blend-multiply"
             />
          </div>

          <div className="space-y-10">
            <article className="flex flex-col">
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 text-center">
                Analisis Suhu Rata Rata Harian di Stamet APT Pranoto Samarinda
              </h3>
              
              <p className="text-slate-700 text-base leading-relaxed text-justify">
                Berdasarkan analisis grafik Historis Suhu Udara Rata-Rata Harian di Stasiun Meteorologi APT Pranoto 1981-2025, tren suhu udara rata-rata harian di Samarinda secara historis cenderung stabil dengan pola puncak kehangatan di rentang Maret–Mei, namun tren pergerakan suhu pada tahun 2025 justru memperlihatkan pola anomali yang unik. Sepanjang tahun 2025, fluktuasi suhu sama sekali tidak menunjukkan tren pemanasan berkelanjutan atau gelombang panas (heatwave) ekstrem, melainkan secara konsisten berulang kali menukik tajam menembus batas bawah kewajaran (Persentil 5), terutama pada rentang bulan Mei hingga Oktober. Bagi masyarakat, pergeseran tren ini mengindikasikan bahwa alih-alih menghadapi cuaca yang semakin terik memanggang, Samarinda justru lebih sering mengalami hari-hari yang mendadak jauh lebih sejuk di luar kebiasaan historisnya. Secara meteorologis, tren penurunan suhu harian yang drastis dan berulang ini merupakan penanda kuat akan tingginya intensitas curah hujan atau tebalnya tutupan awan pada periode tersebut, sehingga fokus kewaspadaan masyarakat dan pemerintah daerah perlu lebih diarahkan pada antisipasi rentetan cuaca basah (seperti genangan atau banjir) dibandingkan ancaman suhu panas.
              </p>
            </article>
          </div>
        </div>

      </div>
    </div>
  );
}