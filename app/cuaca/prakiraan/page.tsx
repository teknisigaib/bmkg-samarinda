"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import WeatherSummary from "@/components/component-cuaca/prakiraan-cuaca/WeatherSummary";
import { Loader2, MapPinOff, CloudRain } from "lucide-react";

// Load LocationExplorer
const LocationExplorer = dynamic(
  () => import("@/components/component-cuaca/prakiraan-cuaca/LocationExplorer"),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full min-w-[900px] h-[500px] md:h-[700px] bg-slate-50 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400 border border-slate-200 animate-pulse">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-300" />
        <span className="text-xs font-bold">Memuat Peta...</span>
      </div>
    ) 
  }
);

export default function WeatherPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [weatherData, setWeatherData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleLocationSelect = async (adm4Code: string, locationName: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${adm4Code}`);
            if (!res.ok) throw new Error("Gagal mengambil data BMKG.");
            const apiData = await res.json();
            if (!apiData.data) throw new Error("Data kosong.");
            setWeatherData(apiData);
        } catch (err: any) {
            setError(err.message);
            setWeatherData(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full bg-white min-h-screen pb-20">
            

            {/* 2. CONTAINER KONTEN UTAMA */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-8">
                
                {/* PETA & SELECTOR */}
                <section className="relative z-0 shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-200 overflow-x-auto scrollbar-hide">
                    <LocationExplorer onLocationSelect={handleLocationSelect} />
                </section>

                {/* HASIL CUACA */}
                <section className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-[200px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-60 text-slate-400 gap-4 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            <span className="text-sm font-bold text-slate-600">Mengambil Data Cuaca...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-60 text-red-400 gap-3 bg-red-50/50 rounded-[2.5rem] border border-red-100 p-6 text-center">
                            <MapPinOff className="w-10 h-10 mb-2 opacity-50" />
                            <span className="text-lg font-bold text-red-500">Gagal Memuat</span>
                            <span className="text-sm max-w-md">{error}</span>
                        </div>
                    ) : weatherData ? (
                        <WeatherSummary data={weatherData} />
                    ) : (
                        <div className="hidden lg:flex flex-col items-center justify-center h-32 text-slate-300 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                            <span className="text-sm font-medium">Grafik cuaca akan tampil di sini setelah lokasi dipilih</span>
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}