import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Anomali Suhu Udara Bulanan | BMKG APT Pranoto Samarinda",
  description: "Data anomali suhu udara bulanan stasiun meteorologi di Kalimantan Timur.",
};

export default function AnomaliSuhuPage() {
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
            { label: "Anomali Suhu Udara" }
          ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mx-auto">
           <h1 className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Anomali Suhu Udara Bulanan
           </h1>
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl">
              Pemantauan penyimpangan suhu udara bulanan di stasiun pengamatan BMKG Kalimantan Timur.
           </p>
        </section>

        {/* --- PURE TYPOGRAPHY CONTENT --- */}
        <div className="relative z-10 pt-8 border-t border-slate-200">
          
          {/* Tempat Gambar Peta Anomali (Opsional jika ada) */}
          <div className="mb-10 w-full flex justify-center">
             <Image 
                src="/perubahan-iklim/peta-anomali.png" 
                alt="Peta Anomali Suhu Udara" 
                width={800} 
                height={400} 
                className="w-full h-auto object-contain mix-blend-multiply"
             />
          </div>

          <div className="space-y-10">
            {/* Paragraf 1: Analisis */}
            <article className="flex flex-col">
              <div className="flex items-start gap-3 mb-2">
                <div className="mt-2.5 w-2 h-2 rounded-full bg-slate-800 shrink-0"></div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                  Analisis Suhu Juli 2026
                </h3>
              </div>
              <p className="text-slate-700 text-base leading-relaxed text-justify pl-5">
                Berdasarkan peta Anomali Suhu Udara Bulanan, Pada bulan Juli 2026, seluruh wilayah Kalimantan Timur mengalami kenaikan suhu di atas rata-rata normal dengan suhu paling menyengat di Samarinda (Stamet APT Pranoto +1.7°C), disusul Balikpapan (Stamet SAMS Sepinggan +0.9°C) dan Berau (Stamet Kalimarau +0.7°C). Menghadapi cuaca yang lebih terik dan gerah ini, masyarakat diimbau untuk rutin minum air putih agar terhindar dari dehidrasi, mengurangi aktivitas di bawah paparan sinar matahari langsung pada jam terik siang hari, serta hindari membakar sampah atau lahan terbuka untuk meminimalkan risiko kebakaran.
              </p>
            </article>

            {/* Paragraf 2 / Tabel: Ranking */}
            <article className="flex flex-col">
              <div className="flex items-start gap-3 mb-4">
                <div className="mt-2.5 w-2 h-2 rounded-full bg-slate-800 shrink-0"></div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                  Rangking Stasiun dengan Anomali Suhu Udara Tertinggi di Kalimantan Timur
                </h3>
              </div>
              
              <div className="pl-5 overflow-x-auto mt-2">
                <table className="w-full text-left border-collapse text-sm md:text-base">
                   <thead>
                      <tr className="border-b-2 border-slate-800 text-slate-900">
                         <th className="py-3 px-2 md:px-4 font-bold whitespace-nowrap">Rank</th>
                         <th className="py-3 px-2 md:px-4 font-bold">Nama Stasiun</th>
                         <th className="py-3 px-2 md:px-4 font-bold whitespace-nowrap">Kota/Kabupaten</th>
                         <th className="py-3 px-2 md:px-4 font-bold whitespace-nowrap text-right">Nilai Anomali</th>
                      </tr>
                   </thead>
                   <tbody className="text-slate-700">
                      <tr className="border-b border-slate-200">
                         <td className="py-3 px-2 md:px-4 font-semibold text-slate-900">1</td>
                         <td className="py-3 px-2 md:px-4">Stasiun Meteorologi Kelas II Aji Pangeran Tumenggung Pranoto</td>
                         <td className="py-3 px-2 md:px-4">Samarinda</td>
                         <td className="py-3 px-2 md:px-4 font-bold text-slate-900 text-right">+1.7 °C</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                         <td className="py-3 px-2 md:px-4 font-semibold text-slate-900">2</td>
                         <td className="py-3 px-2 md:px-4">Stasiun Meteorologi Kelas I Sultan Aji Muhammad Sulaiman Sepinggan</td>
                         <td className="py-3 px-2 md:px-4">Balikpapan</td>
                         <td className="py-3 px-2 md:px-4 font-bold text-slate-900 text-right">+0.9 °C</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                         <td className="py-3 px-2 md:px-4 font-semibold text-slate-900">3</td>
                         <td className="py-3 px-2 md:px-4">Stasiun Meteorologi Kelas II Kalimarau</td>
                         <td className="py-3 px-2 md:px-4">Berau</td>
                         <td className="py-3 px-2 md:px-4 font-bold text-slate-900 text-right">+0.7 °C</td>
                      </tr>
                   </tbody>
                </table>
              </div>
            </article>
          </div>
        </div>

      </div>
    </div>
  );
}