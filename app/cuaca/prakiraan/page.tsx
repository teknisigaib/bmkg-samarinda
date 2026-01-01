"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import WeatherSummary from "@/components/component-cuaca/prakiraan-cuaca/WeatherSummary";
import RegionSelector from "@/components/component-cuaca/prakiraan-cuaca/RegionSelector";
import { Loader2, MapPinOff, CloudSun } from "lucide-react";

// Load Peta (Hanya sebagai Visualizer sekarang)
const LocationMap = dynamic(
  () => import("@/components/component-cuaca/prakiraan-cuaca/LocationMap"),
  { ssr: false, loading: () => <div className="h-full w-full bg-slate-100 flex items-center justify-center">Memuat Peta...</div> }
);

export default function WeatherPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [weatherData, setWeatherData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    
    // Koordinat Peta (Didapat DARI API BMKG setelah fetch sukses)
    const [mapCoords, setMapCoords] = useState<{lat: number, lng: number} | null>(null);
    const [locationLabel, setLocationLabel] = useState("");

    // Handler saat user memilih Kelurahan di Dropdown
    const handleRegionSelect = async (adm4Code: string, locationName: string) => {
        setIsLoading(true);
        setError(null);
        setLocationLabel(locationName);
        
        try {
            // Fetch langsung ke BMKG menggunakan Kode yang SUDAH PASTI BENAR (dari file manual)
            const res = await fetch(`https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${adm4Code}`);
            
            if (!res.ok) throw new Error("Gagal mengambil data BMKG (Kode Wilayah mungkin tidak aktif di server BMKG).");

            const apiData = await res.json();

            if (!apiData.data || apiData.data.length === 0) {
                throw new Error("Data cuaca kosong dari BMKG.");
            }

            setWeatherData(apiData);

            // Update Peta berdasarkan koordinat presisi dari BMKG
            if (apiData.lokasi?.lat && apiData.lokasi?.lon) {
                setMapCoords({
                    lat: parseFloat(apiData.lokasi.lat),
                    lng: parseFloat(apiData.lokasi.lon)
                });
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Terjadi kesalahan.");
            setWeatherData(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 md:space-y-8">
            <div className="text-center space-y-2 mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-2 shadow-sm border border-blue-100">
                    <CloudSun className="w-8 h-8 text-blue-500" />
                </div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Cuaca Mikro Kaltim</h1>
                <p className="text-slate-500 max-w-lg mx-auto text-sm md:text-base">
                    Data cuaca tingkat kelurahan/desa di Kalimantan Timur. 
                    <br/><span className="text-xs italic opacity-70">(Database disesuaikan manual dengan Kode BMKG)</span>
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* INPUT: DROPDOWN */}
                <div className="lg:col-span-5 flex flex-col h-full">
                    <RegionSelector onRegionSelect={handleRegionSelect} />
                </div>

                {/* OUTPUT: MAP PREVIEW */}
                <div className="lg:col-span-7 h-[300px] lg:h-auto min-h-[300px] bg-slate-100 rounded-[2rem] overflow-hidden shadow-inner border border-slate-200 relative">
                    <LocationMap coords={mapCoords} label={locationLabel} />
                    
                    {!mapCoords && (
                        <div className="absolute inset-0 bg-slate-900/5 flex items-center justify-center pointer-events-none z-[1000]">
                            <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold text-slate-500 shadow-sm border border-white">
                                Lokasi Kelurahan akan muncul di sini
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* OUTPUT: WEATHER DASHBOARD */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-[300px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-80 text-slate-400 gap-4 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                        <span className="text-sm font-bold text-slate-700">Mengambil Data BMKG...</span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-80 text-red-400 gap-3 bg-red-50/50 rounded-[2rem] border border-red-100 p-6 text-center">
                        <MapPinOff className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-lg font-bold text-red-500">Error</span>
                        <span className="text-sm">{error}</span>
                    </div>
                ) : weatherData ? (
                    <WeatherSummary data={weatherData} />
                ) : (
                    <div className="hidden lg:flex flex-col items-center justify-center h-40 text-slate-300 border-2 border-dashed border-slate-100 rounded-[2rem]">
                        <span className="text-sm font-medium">Grafik cuaca tampil di sini</span>
                    </div>
                )}
            </section>
        </div>
    );
}