export const dynamic = 'force-dynamic';
export const revalidate = 0; 

import MahakamDashboard from "@/components/component-cuaca/mahakam/MahakamDashboard";
import Breadcrumb from "@/components/ui/Breadcrumb"; // Import Breadcrumb
import WeatherLegend from "@/components/component-cuaca/WeatherLegend"; // 🔥 Import komponen legenda
import { getMahakamData } from "@/lib/mahakam-data"; 
import { getTidalForecast } from "@/lib/tide-service"; 
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prakiraan Cuaca Sungai Mahakam | BMKG APT Pranoto Samarinda",
  description: "Informasi prakiraan cuaca maritim dan pasang surut Sungai Mahakam.",
};

export default async function Page() {
  const [mahakamData, tideData] = await Promise.all([
    getMahakamData(),
    getTidalForecast().catch(() => [])
  ]);

  return (
    // Tambah bg-slate-50/50 biar warna latar nyatu sama komponen legenda
    <div className="min-h-screen bg-slate-50/50 pb-20"> 
       <div className="w-full mx-auto pt-0 pb-4 sm:px-4 lg:px-6">
           
           {/* --- 1. BREADCRUMB NAVIGATION --- */}
           <Breadcrumb 
             className="mb-4" // Margin bottom digedein dikit biar rapi
             items={[
               { label: "Beranda", href: "/" },
               { label: "Cuaca" }, 
               { label: "SiCASMA" } 
             ]} 
           />

           {/* --- 2. MAIN DASHBOARD --- */}
           <MahakamDashboard 
              data={mahakamData} 
              tideData={tideData} 
           />

           {/* --- 3. LEGENDA IKON CUACA --- */}
           <div className="mt-0">
             <WeatherLegend />
           </div>

       </div>
    </div>
  );
}