import FlightMap from "@/components/penerbangan/FlightMap"; 
import AviationCharts from "@/components/penerbangan/AviationCharts";
import AwosWidget from "@/components/penerbangan/AwosWidget"; 
import { Plane, Activity, Radio, Clock, ShieldCheck } from "lucide-react";
import { getAirportWeather, AIRPORT_DB } from "@/lib/aviation"; 
import { Metadata } from "next";

// --- KONFIGURASI ROUTE ---
export const dynamic = "force-dynamic"; 

// --- METADATA (SEO) ---
export const metadata: Metadata = {
  title: "Cuaca Penerbangan | BMKG APT Pranoto Samarinda",
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
       <div className="w-full mx-auto pt-8">
           
           {/* --- HEADER SECTION --- */}
           <section className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center text-center md:items-start md:text-left shadow-sm transition-all mb-8">
              
              {/* Icon Box */}
              <div className="bg-white p-3 rounded-full shadow-sm w-fit ring-4 ring-blue-50/50">
                <Plane className="w-8 h-8 text-blue-600" />
              </div>
      
              <div className="flex-1 w-full">
                
                {/* Judul & Deskripsi */}
                <div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2 justify-center md:justify-start">
                        Prakiraan Cuaca Penerbangan
                    </h1>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                        Sistem pemantauan cuaca penerbangan terpadu. Menyediakan data observasi METAR, prakiraan TAF, peringatan dini SIGMET, dan instrumen AWOS Real-time untuk wilayah udara Indonesia.
                    </p>
                </div>

                {/* Container Badge */}
                <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-3">
                  
                  {/* Badge Status */}
                  <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border text-xs font-bold shadow-sm border-emerald-200 text-emerald-700">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    System Online
                  </div>
                  
                  {/* Badge Waktu Update */}
                  <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-blue-200 text-xs font-medium text-gray-600 shadow-sm">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>Sync: {serverTime} UTC</span>
                  </div>

                  {/* Badge Info Tambahan (Menggantikan Selector AWS) */}
                  <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-blue-200 text-xs font-medium text-gray-600 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                      <span>{onlineAirportsCount} Airports Monitored</span>
                  </div>

                </div>
              </div>
           </section>

           {/* --- 2. PETA UTAMA --- */}
           
            <div className="w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden relative">
                <FlightMap initialAirports={initialAirportData} />
            </div>

           {/* --- 3. LIVE AWOS INSTRUMENT PANEL --- */}
           <div className="w-full mx-auto mt-12 mb-8">
            <div className="mb-6 flex items-center gap-4">
                   <div className="h-px bg-slate-200 flex-1"></div>
                   <div className="flex items-center gap-2 text-slate-400 px-2">
                       <Radio size={16} className="text-blue-500" />
                       <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                           Live AWOS Instruments
                       </span>
                   </div>
                   <div className="h-px bg-slate-200 flex-1"></div>
               </div>

               <AwosWidget />
           </div>

           {/* --- 4. DATA STATIS (CHARTS) --- */}
           <div className="w-full mx-auto mt-12 mb-12">
               <div className="mb-6 flex items-center gap-4">
                   <div className="h-px bg-slate-200 flex-1"></div>
                   <div className="flex items-center gap-2 text-slate-400 px-2">
                       <Activity size={16} className="text-emerald-500" />
                       <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                           BMKG Forecast Models
                       </span>
                   </div>
                   <div className="h-px bg-slate-200 flex-1"></div>
               </div>

               <AviationCharts />
           </div>

       </div>
    </div>
  );
}