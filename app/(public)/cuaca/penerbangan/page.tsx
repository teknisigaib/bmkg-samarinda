import type { Metadata } from "next";
import { getAllAirportsWeather } from "@/lib/bmkg/aviation"; 
import { filterKaltimAirports } from "@/lib/bmkg/aviation-utils";
import AviationDashboard from "@/components/component-cuaca/cuaca-penerbangan/AviationDashboard";
import AviationChart from "@/components/component-cuaca/cuaca-penerbangan/AviationChart";

export const metadata: Metadata = {
  title: "Cuaca Penerbangan | BMKG Samarinda",
  description: "Informasi METAR, SPECI, dan TAF untuk navigasi penerbangan wilayah Kalimantan Timur.",
};

// Revalidate data setiap 5 menit
export const revalidate = 300; 

export default async function AviationPage() {
  // 1. Fetch Data Utama
  const allAirports = await getAllAirportsWeather();
  
  // 2. Filter bandara Kaltim
  const kaltimAirports = filterKaltimAirports(allAirports);

  return (
    <div className="w-full space-y-10 max-sm:max-w-xs pb-20">
        
        {/* DASHBOARD UTAMA */}
        <AviationDashboard 
            airports={kaltimAirports} 
        />

        {/*  PETA  */}
        <section>
            <div className="flex items-center gap-3 px-1 mb-4">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                <h3 className="text-xl font-bold text-slate-800">Visualisasi Area Penerbangan</h3>
            </div>
            <AviationChart />
        </section>

    </div>
  );
}