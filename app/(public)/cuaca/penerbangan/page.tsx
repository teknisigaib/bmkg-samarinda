import FlightMap from "@/components/component-cuaca/penerbangan/FlightMap"; 
import AviationCharts from "@/components/component-cuaca/penerbangan/AviationCharts";
import AwosWidget from "@/components/component-cuaca/penerbangan/AwosWidget"; 
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionDivider from "@/components/ui/SectionDivider"; // Import komponen Divider
import { ShieldCheck, RefreshCw } from "lucide-react"; // Ikon Radio & Activity dihapus
import { getAirportWeather, AIRPORT_DB } from "@/lib/aviation"; 
import { Metadata } from "next";

// --- KONFIGURASI ROUTE ---
export const dynamic = "force-dynamic"; 

// --- METADATA (SEO) ---
export const metadata: Metadata = {
  title: "Prakiraan Cuaca Penerbangan | BMKG APT Pranoto Samarinda",
  description: "Monitor cuaca penerbangan real-time, METAR, TAF, SIGMET, dan data AWOS live untuk bandara APT Pranoto Samarinda dan sekitarnya.",
  keywords: ["Cuaca Penerbangan", "WALS", "AWOS Samarinda", "METAR Indonesia", "Peta Penerbangan"],
};

export default async function AviationPage() {
  // 1. FETCH SEMUA DATA BANDARA DI SERVER
  const airportKeys = Object.keys(AIRPORT_DB);
  const weatherPromises = airportKeys.map(icao => getAirportWeather(icao));
  const weatherResults = await Promise.all(weatherPromises);
  const initialAirportData = weatherResults.filter((item): item is NonNullable<typeof item> => item !== null);
  
  // Hitung bandara online
  const onlineAirportsCount = initialAirportData.length;
  
  // Waktu render server (dalam UTC)
  const serverTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

  return (
    <div className="min-h-screen">
       <div className="w-full mx-auto pt-6 pb-10 sm:px-4 lg:px-6">
           
           {/* --- 1. BREADCRUMB NAVIGATION --- */}
           <Breadcrumb 
             className="mb-10" 
             items={[
               { label: "Beranda", href: "/" },
               { label: "Cuaca" }, 
               { label: "Cuaca Penerbangan" } 
             ]} 
           />

           {/* --- 2. HEADER SECTION --- */}
           <section className="relative flex flex-col items-center justify-center text-center mb-10 max-w-3xl mx-auto pt-2">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
              </div>
              
              <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
                 Cuaca Penerbangan
              </h1>
              
              <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-4xl mb-8">
                 Sistem pemantauan udara terpadu. Menyediakan data observasi METAR, prakiraan TAF, peringatan SIGMET, dan instrumen AWOS Real-time.
              </p>

              <div className="relative z-10 flex items-center bg-white border border-slate-200 rounded-xl shadow-sm p-1">
                 <div className="flex items-center gap-2 px-4 py-1.5 border-r border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-slate-700">{onlineAirportsCount} Bandara Terpantau</span>
                 </div>
                 
                 <div className="flex items-center gap-2 px-4 py-1.5">
                    <RefreshCw className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-medium text-slate-500">Sync: {serverTime} UTC</span>
                 </div>
              </div>
           </section>

           {/* --- 3. PETA UTAMA --- */}
           <div className="w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200/50 bg-slate-900">
               <FlightMap initialAirports={initialAirportData} />
           </div>

           {/* --- 4. LIVE AWOS INSTRUMENT PANEL --- */}
           <div className="w-full mx-auto mt-24 mb-12 max-w-7xl">
               {/* Memanggil komponen Divider Baru */}
               <SectionDivider title="Data AWOS Live" className="mb-8" />
               <AwosWidget />
           </div>

           {/* --- 5. DATA STATIS (CHARTS) --- */}
           <div className="w-full mx-auto mt-24 mb-16 max-w-7xl">
               {/* Memanggil komponen Divider Baru */}
               <SectionDivider title="Forecast" className="mb-8" />
               <AviationCharts />
           </div>

       </div>
    </div>
  );
}