export const dynamic = 'force-dynamic'; 
import type { Metadata } from "next";
import { Wind, ActivitySquare, Clock } from "lucide-react"; // <-- Tambahkan Clock disini
import AirQualityView from "@/components/component-iklim/kualitas-udara/AirQualityView";
import Breadcrumb from "@/components/ui/Breadcrumb";
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: "Kualitas Udara | BMKG APT Pranoto Samarinda",
  description: "Monitoring Kualitas Udara (PM2.5) Kota Samarinda secara real-time.",
};

async function getPm25Data() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'pm25-cache.json');
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent);
    } else {
       console.log("File tidak ditemukan di:", filePath);
    }
  } catch (error) {
    console.error("Gagal baca cache di server:", error);
  }

  // Data default jika gagal
  return { success: false, current: 0, history: [], lastUpdate: "-" };
}

export default async function AirQualityPage() {
  const initialData = await getPm25Data();

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="w-full mx-auto pt-6  space-y-6">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
            items={[
              { label: "Beranda", href: "/" },
              { label: "Iklim" }, 
              { label: "Kualitas Udara PM2.5" } 
            ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mb-10 max-w-3xl mx-auto pt-2">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
              {/* Glow hijau untuk tema kualitas udara */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
           </div>
           
           <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Kualitas Udara (PM<sub className="text-2xl md:text-4xl">2.5</sub>)
           </h1>
           
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl mb-8">
              Monitoring konsentrasi partikulat udara halus (PM2.5) secara *real-time* berdasarkan sensor di Stasiun Meteorologi APT Pranoto Samarinda.
           </p>

           <div className="relative z-10 flex flex-wrap justify-center items-center bg-white border border-slate-200 rounded-2xl shadow-sm p-1">
             
              
              {/* --- INFO WAKTU TERAKHIR DIPINDAH KESINI --- */}
              <div className="flex items-center gap-2 px-4 py-1.5 border-r border-slate-100">
                 <Clock className="w-4 h-4 text-blue-500" />
                 <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    Update: {initialData.lastUpdate || '-'}
                 </span>
              </div>

              
           </div>
        </section>

        {/* --- CLIENT COMPONENT --- */}
        <AirQualityView initialData={initialData} />

      </div>
    </div>
  );
}