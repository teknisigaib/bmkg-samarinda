"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, YAxis 
} from "recharts";
import { MapPin, CalendarDays, Droplets, Wind, Eye, Clock, Cloud, Navigation, Thermometer } from "lucide-react";
import type { WeatherResponse, WeatherDataPoint } from "@/lib/bmkg/types";
import LocationPicker from "./LocationPicker";
// --- HELPERS ---
const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":");
};

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short" });
};

const getRotation = (wd: string): string => {
    const directions: Record<string, string> = {
        "N": "0deg", "NNE": "22.5deg", "NE": "45deg", "ENE": "67.5deg",
        "E": "90deg", "ESE": "112.5deg", "SE": "135deg", "SSE": "157.5deg",
        "S": "180deg", "SSW": "202.5deg", "SW": "225deg", "WSW": "247.5deg",
        "W": "270deg", "WNW": "292.5deg", "NW": "315deg", "NNW": "337.5deg",
        "VAR": "0deg"
    };
    return directions[wd] || "0deg";
};

// --- COMPONENT: HERO CARD ---
const CurrentWeatherCard = ({ 
  data, 
  location, 
  onLocationChange 
}: { 
  data: WeatherDataPoint, 
  location: any,
  onLocationChange: (loc: any) => void 
}) => {
  return (
    // CARD CONTAINER:
    // p-5: Padding di mobile pas (tidak terlalu tebal/tipis)
    // md:p-10: Padding di desktop lebih lega
    <div className="w-full bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl p-5 md:p-10 shadow-lg relative overflow-hidden transition-all duration-300 group">
      
      {/* Background Decor (Blob) */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-8">
        
        {/* BAGIAN KIRI: Info Utama */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
          
          {/* --- [BARU] LOCATION PICKER --- */}
          {/* Menggantikan badge statis. Sekarang user bisa klik untuk ganti lokasi. */}
          <div className="mb-6 relative z-20">
             <LocationPicker 
                currentLocation={location} 
                onSelectLocation={onLocationChange} 
             />
          </div>

          {/* Wrapper Tanggal & Jam */}
          <div className="flex justify-center md:justify-start gap-2 w-full mb-4">
               <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg text-xs md:text-sm text-blue-100 backdrop-blur-sm border border-white/5">
                  <CalendarDays className="w-3.5 h-3.5 text-yellow-400" />
                  {formatDate(data.local_datetime)}
               </div>
               <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg text-xs md:text-sm text-blue-100 backdrop-blur-sm border border-white/5">
                  <Clock className="w-3.5 h-3.5 text-yellow-400" />
                  {formatTime(data.local_datetime)} WITA
               </div>
          </div>

          {/* Suhu Besar & Ikon */}
          <div className="flex items-center justify-center md:justify-start gap-4 md:gap-6 w-full">
            <div className="text-7xl md:text-8xl font-bold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-200 drop-shadow-sm">
                {data.t}°
            </div>
            <div className="relative w-24 h-24 md:w-32 md:h-32 filter drop-shadow-2xl animate-in zoom-in duration-500">
                <Image 
                    src={data.image} 
                    alt={data.weather_desc} 
                    fill 
                    className="object-contain"
                    unoptimized
                />
            </div>
          </div>
          
          {/* Deskripsi Cuaca */}
          <div className="mt-2 text-2xl font-medium text-white tracking-tight">{data.weather_desc}</div>
        </div>

        {/* BAGIAN KANAN: Detail Grid */}
        <div className="grid grid-cols-2 gap-2 w-full md:w-auto mt-2 md:mt-0">
            <DetailItem 
                icon={<Wind className="w-4 h-4"/>} 
                label="Angin" 
                value={`${data.ws} km/j`} 
                sub={data.wd} 
                subIcon={<Navigation className="w-3 h-3 text-yellow-400" style={{ transform: `rotate(${getRotation(data.wd)})` }} />} 
            />
            <DetailItem 
                icon={<Droplets className="w-4 h-4"/>} 
                label="Lembap" 
                value={`${data.hu}%`} 
                sub="Relatif" 
            />
            <DetailItem 
                icon={<Eye className="w-4 h-4"/>} 
                label="Visibilitas" 
                value={data.vs_text} 
                sub="Jarak" 
            />
            <DetailItem 
                icon={<Cloud className="w-4 h-4"/>} 
                label="Awan" 
                value={`${data.tcc || 0}%`} 
                sub="Tutupan" 
            />
        </div>

      </div>
    </div>
  );
};

// Sub-Component Detail Item (Compact Style)
const DetailItem = ({ icon, label, value, sub, subIcon }: any) => (
    <div className="flex flex-col p-3 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm min-w-[130px] hover:bg-white/20 transition-colors group cursor-default">
        <div className="flex items-center gap-1.5 text-blue-200 mb-0.5">
            {icon} <span className="text-[10px] uppercase tracking-wide font-bold group-hover:text-white transition-colors">{label}</span>
        </div>
        <span className="font-bold text-lg">{value}</span>
        <div className="flex items-center gap-1 mt-0.5 text-[10px] text-blue-200 opacity-80 group-hover:opacity-100">
            {subIcon}
            <span>{sub}</span>
        </div>
    </div>
);

// --- COMPONENT: CONTINUOUS CHART (FIXED LOGIC) ---
const ContinuousChart = ({ data, onHover }: { data: any[], onHover: (d: any) => void }) => {
    
    const chartData = data.map(d => ({
        ...d,
        time: formatTime(d.local_datetime),
        dayLabel: formatDate(d.local_datetime).split(',')[0],
        fullDate: d.local_datetime
    }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;
            return (
                <div className="bg-white/95 backdrop-blur px-4 py-3 rounded-xl shadow-xl border border-blue-100 text-center min-w-[100px] z-50">
                    <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">
                        {formatDate(d.fullDate)} • {d.time}
                    </p>
                    <div className="relative w-10 h-10 mx-auto my-1">
                        <Image src={d.image} alt="icon" fill className="object-contain" unoptimized/>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{d.t}°</p>
                    <p className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                        {d.weather_desc}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        // CARD LUAR: Relative agar aman
        <div className="w-full bg-white rounded-3xl border border-gray-100 p-2 md:p-6 shadow-sm mt-6 flex flex-col relative">
            
            {/* Header Card */}
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-blue-600" /> Tren Suhu (3 Hari)
                </h3>
                <span className="text-[10px] text-blue-500 bg-blue-50 px-2 py-1 rounded-full font-medium">
                    &larr; Geser &rarr;
                </span>
            </div>
            
            {/* === PERBAIKAN UTAMA DI SINI ===
               Masalah: Div ini sebelumnya ikut melebar mengikuti anaknya (1000px).
               Solusi: Kita paksa max-width nya selebar layar dikurangi margin (padding halaman).
               
               - max-w-[calc(100vw-4rem)]: Lebar maksimal adalah Lebar Layar - 4rem (sekitar 64px untuk margin kiri kanan).
               - overflow-x-scroll: Paksa scrollbar muncul.
            */}
            <div className="w-full max-w-[calc(80vw-3rem)] md:max-w-full overflow-x-auto pb-4 custom-scrollbar">
                
                {/* KONTEN DALAM (YANG LEBAR) */}
                <div className="h-[300px] w-[1000px] md:w-full shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart 
                            data={chartData} 
                            margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
                            onMouseMove={(e) => {
                                if (e.activePayload && e.activePayload[0]) {
                                    onHover(e.activePayload[0].payload);
                                }
                            }}
                            onMouseLeave={() => onHover(null)}
                        >
                            <defs>
                                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            
                            <XAxis 
                                dataKey="fullDate" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={({ x, y, payload, index }) => {
                                    const dataPoint = chartData[index];
                                    if(!dataPoint) return null;
                                    const showDay = dataPoint.time === "08:00" || index === 0;
                                    
                                    return (
                                        <g transform={`translate(${x},${y})`}>
                                            <text x={0} y={0} dy={16} textAnchor="middle" fill="#9ca3af" fontSize={12} fontWeight={500}>
                                                {dataPoint.time}
                                            </text>
                                            {showDay && (
                                                <text x={0} y={0} dy={36} textAnchor="middle" fill="#2563eb" fontSize={11} fontWeight="bold" style={{textTransform:'uppercase', letterSpacing: '0.05em'}}>
                                                    {dataPoint.dayLabel}
                                                </text>
                                            )}
                                        </g>
                                    );
                                }}
                                interval={0} 
                            />
                            
                            <YAxis hide domain={['dataMin - 2', 'auto']} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            
                            <Area 
                                type="monotone" 
                                dataKey="t" 
                                stroke="#2563eb" 
                                strokeWidth={4} 
                                fillOpacity={1} 
                                fill="url(#colorTemp)" 
                                activeDot={{ r: 6, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function WeatherDashboard({ response }: { response: WeatherResponse }) {
  const [hoveredData, setHoveredData] = useState<WeatherDataPoint | null>(null);
  
  // Data Logic
  const allForecasts = response.data?.[0]?.cuaca?.flat() || [];
  const currentData = allForecasts[0]; 
  const displayData = hoveredData || currentData;

  // --- LOGIC GANTI LOKASI (DUMMY) ---
  const handleLocationChange = (newLocation: any) => {
    // Di sini nanti Anda memanggil Server Action atau Router Push
    // Contoh: router.push(`?adm4=${newLocation.id}`)
    console.log("User memilih lokasi baru:", newLocation);
    alert(`Memuat cuaca untuk: ${newLocation.kecamatan}... (Logic API belum dipasang)`);
  };

  if (!displayData) return <div className="text-center py-10 text-gray-400">Data cuaca tidak tersedia.</div>;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 px-4 md:px-0 overflow-hidden">
      
      {/* 1. Hero Card (Sekarang punya onLocationChange) */}
      <CurrentWeatherCard 
        data={displayData} 
        location={response.lokasi} 
        onLocationChange={handleLocationChange} // <-- PASS FUNCTION INI
      />

      {/* 2. Grafik */}
      <ContinuousChart data={allForecasts} onHover={setHoveredData} />

    </div>
  );
}