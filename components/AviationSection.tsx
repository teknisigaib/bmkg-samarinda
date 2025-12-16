import { getMetarData } from "@/lib/aviation-api"; // Import fungsi fetcher
import { Plane, Wind, Eye, Cloud, Thermometer, Navigation, ArrowUpRight, AlertCircle } from "lucide-react";

export default async function AviationSection() {
  // 1. Ambil Data Real untuk WALS (Samarinda)
  const data = await getMetarData("WALL");

  // Jika API Down/Data Kosong, gunakan Fallback (Mockup) atau tampilkan pesan error
  if (!data) {
    return (
      <section className="bg-slate-900 text-white py-16 text-center">
        <div className="flex flex-col items-center gap-2 opacity-50">
            <AlertCircle className="w-10 h-10" />
            <p>Data Penerbangan Tidak Tersedia Saat Ini</p>
        </div>
      </section>
    );
  }

  // 2. Format & Konversi Data
  const windDir = typeof data.wdir === 'number' ? data.wdir : 0; // Handle Variable wind
  
  // Konversi Visibility: Miles -> KM (1 Mile = 1.609 KM)
  // Jika visib "+" (lebih dari), API kasih null/string kadang, jadi kita handle safe
  const visibilityKm = data.visib ? (data.visib * 1.60934).toFixed(1) : "10+"; 
  
  // Ambil data awan pertama (jika ada)
  const cloudInfo = data.clouds && data.clouds.length > 0 
    ? `${data.clouds[0].cover} ${data.clouds[0].base ? (data.clouds[0].base * 100) : ''}ft` // base dikali 100 krn format NOAA
    : "NSC / CAVOK"; // No Significant Cloud

  // Format Jam (Report Time)
  const reportTime = new Date(data.reportTime).toLocaleTimeString('id-ID', {
    hour: '2-digit', 
    minute: '2-digit', 
    timeZone: 'UTC' // Penerbangan selalu pakai UTC (Zulu)
  }) + " UTC";

  return (
    <section className="bg-slate-900 text-white py-16 rounded-2xl  relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
        <Plane className="w-96 h-96" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 border-b border-slate-700 pb-6">
            <div>
                <div className="flex items-center gap-2 text-yellow-400 font-bold tracking-wider text-sm mb-1">
                    <Plane className="w-4 h-4" />
                    AVIATION METEOROLOGY
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                    APT Pranoto Airport ({data.icaoId})
                </h2>
                <p className="text-slate-400 mt-1">Data Pengamatan Udara Permukaan (Real-time)</p>
            </div>
            <div className="text-right">
                <p className="text-slate-400 text-sm">Observation Time:</p>
                <p className="text-2xl font-mono font-bold text-yellow-400">{reportTime}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* KOLOM 1: PARAMETER UTAMA */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Wind Card */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-2">
                        <Wind className="w-4 h-4" /> Wind
                    </div>
                    <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold">{data.wspd}</span>
                        <span className="text-sm font-medium mb-1">KT</span>
                    </div>
                    <div className="text-sm text-yellow-400 mt-1 flex items-center gap-1">
                        <Navigation className="w-3 h-3" style={{ transform: `rotate(${windDir}deg)` }} />
                        {data.wdir === "VRB" ? "VRB" : `${windDir}°`}
                    </div>
                </div>

                {/* Visibility Card */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-2">
                        <Eye className="w-4 h-4" /> Visibility
                    </div>
                    <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold">{visibilityKm}</span>
                        <span className="text-sm font-medium mb-1">KM</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                        {parseFloat(visibilityKm as string) > 5 ? "Good Vis" : "Poor Vis"}
                    </div>
                </div>

                {/* Weather Card */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 md:col-span-2">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-2">
                        <Cloud className="w-4 h-4" /> Weather & Clouds
                    </div>
                    {/* RawOb parsing is complex, better show Cloud info + Raw string below */}
                    <div className="font-bold text-lg text-white">
                        {cloudInfo}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                        Dew Point: {data.dewp}°C
                    </div>
                </div>

                {/* Temp */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-2">
                        <Thermometer className="w-4 h-4" /> Temp
                    </div>
                    <div className="text-2xl font-bold">{data.temp}°C</div>
                </div>

                {/* QNH */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-2">
                        QNH
                    </div>
                    {/* Altim di API NOAA biasanya inHg (cth: 29.92), perlu konversi ke hPa jika nilainya kecil */}
                    {/* Tapi endpoint JSON kadang sudah kasih mb. Kita cek: jika < 1100 brti mb, jika < 40 brti inHg */}
                    <div className="text-2xl font-bold">
                        {data.altim > 800 ? Math.round(data.altim) : Math.round(data.altim * 33.8639)} 
                        <span className="text-sm font-normal ml-1">hPa</span>
                    </div>
                </div>

            </div>

            {/* KOLOM 2: VISUALISASI */}
            <div className="space-y-4">
                
                {/* Visualisasi Runway (Interaktif sesuai data) */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden h-48">
                    <span className="absolute top-2 left-3 text-xs text-slate-500 font-bold">RUNWAY 04/22</span>
                    
                    {/* Runway */}
                    <div className="w-24 h-full bg-slate-600 border-x-4 border-slate-500 relative flex flex-col justify-between items-center py-2">
                        <span className="text-white font-bold text-xl rotate-180">22</span>
                        <div className="h-full w-1 border-l-2 border-dashed border-white opacity-50"></div>
                        <span className="text-white font-bold text-xl">04</span>
                    </div>

                    {/* Wind Arrow (Hanya muncul jika arah angin valid/bukan VRB) */}
                    {typeof data.wdir === 'number' && (
                        <div 
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            style={{ transform: `rotate(${data.wdir}deg)` }}
                        >
                            <div className="flex flex-col items-center animate-pulse">
                                <ArrowUpRight className="w-12 h-12 text-yellow-400 drop-shadow-lg" />
                                <span className="bg-black/50 text-yellow-400 text-[10px] px-1 rounded transform -rotate-180">
                                    {data.wspd} KT
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Raw METAR */}
                <div className="bg-black/40 p-4 rounded-lg border border-slate-700 font-mono text-sm text-green-400 break-words shadow-inner">
                    <span className="block text-slate-500 text-xs mb-1 select-none">RAW METAR:</span>
                    {data.rawOb}
                </div>

            </div>

        </div>
      </div>
    </section>
  );
}