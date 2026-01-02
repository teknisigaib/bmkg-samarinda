"use client";

import { BMKGResponse } from "./types";
import { 
    Wind, Droplets, MapPin, Navigation, 
    Clock, Eye, CalendarDays 
} from "lucide-react";
import { 
    ComposedChart, Area, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList
} from 'recharts';

interface Props {
    data: BMKGResponse;
}

// --- 1. HELPER (Tetap Sama) ---
const getWindRotation = (direction: string) => {
    const map: { [key: string]: number } = {
        'N': 0, 'U': 0, 'NNE': 22.5, 'NE': 45, 'TL': 45, 'ENE': 67.5,
        'E': 90, 'T': 90, 'ESE': 112.5, 'SE': 135, 'TG': 135, 'SSE': 157.5,
        'S': 180, 'SSW': 202.5, 'SW': 225, 'BD': 225, 'WSW': 247.5,
        'W': 270, 'B': 270, 'WNW': 292.5, 'NW': 315, 'BL': 315, 'NNW': 337.5,
        'VAR': 0, 
    };
    return map[direction.toUpperCase()] || 0;
};

// --- FUNGSI HITUNG SUHU DIRASAKAN (UPDATED) ---
function calculateApparentTemperature(t: number, rh: number, ws: number): number {
  // 1. Hitung Tekanan Uap (e) - Rumus Tetens
  // e = (RH / 100) * 6.105 * exp((17.27 * T) / (237.7 + T))
  const expValue = (17.27 * t) / (237.7 + t);
  const e = (rh / 100) * 6.105 * Math.exp(expValue);

  // 2. Hitung Apparent Temperature (AT)
  // Rumus: AT = T + 0.33e - 0.70ws - 4.00
  // Catatan: ws langsung menggunakan nilai dari API (km/jam) sesuai permintaan
  const at = t + (0.33 * e) - (0.70 * ws) - 4.00;

  return Math.round(at);
}

const getDayName = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(date);
    } catch (e) {
        return "";
    }
};

const getFullDate = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    } catch (e) {
        return "";
    }
};

// --- 2. CUSTOM COMPONENTS (Tetap Sama) ---
const CustomXAxisTick = ({ x, y, payload, data }: any) => {
    const currentItem = data.find((d: any) => d.datetime === payload.value);
    if (!currentItem) return null;
    
    const isNewDay = currentItem.time === "00:00";

    return (
        <g transform={`translate(${x},${y})`}>
            {/* LABEL HARI */}
            {isNewDay && (
                <g>
                    <rect x={-22} y={-110} width={44} height={20} rx={10} fill="#e0f2fe" />
                    <text x={0} y={-96} textAnchor="middle" fill="#0284c7" fontSize={10} fontWeight={800}>
                        {getDayName(currentItem.fullDate)}
                    </text>
                    <line x1={0} y1={-85} x2={0} y2={-10} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
                </g>
            )}

            {/* INFO ANGIN (Hanya Angka) */}
            <text x={0} y={0} dy={14} textAnchor="middle" fill="#0d9488" fontSize={11} fontWeight={800}>
                {currentItem.ws} 
            </text>
            
            {/* JAM */}
            <text x={0} y={0} dy={35} textAnchor="middle" fill={isNewDay ? "#1e293b" : "#64748b"} fontSize={11} fontWeight={isNewDay ? 800 : 700}>
                {currentItem.time}
            </text>
        </g>
    );
};

const CustomWindArrow = (props: any) => {
    // Props x, y, width, value otomatis dikirim oleh LabelList
    const { x, y, width, index, data } = props; 
    const item = data[index]; // Ambil data asli berdasarkan index
    
    if (!item) return null;

    const rotation = getWindRotation(item.wd);

    return (
        <g transform={`translate(${x + width / 2},${y - 25})`}> 
            {/* y - 20 artinya geser 20px ke atas dari puncak batang */}
            <foreignObject x={-10} y={0} width={20} height={20}>
                <Navigation 
                    width={20} 
                    height={20} 
                    color="#0d9488" // Warna disamakan dengan batang angin
                    fill="white"    // Isi putih agar kontras
                    strokeWidth={2}
                    style={{ 
                        transform: `rotate(${rotation}deg)`, 
                        display: 'block', 
                        margin: '0 auto',
                        filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))'
                    }} 
                />
            </foreignObject>
        </g>
    );
};

const CustomizedDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy) return null;

    return (
        <image 
            x={cx - 15} 
            y={cy - 35} 
            width={30}  
            height={30} 
            href={payload.image} 
            style={{ filter: 'drop-shadow(0px 3px 3px rgba(0,0,0,0.15))' }} 
        />
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const tempPayload = payload.find((p: any) => p.dataKey === 'temp');
        const windPayload = payload.find((p: any) => p.dataKey === 'ws');
        const data = tempPayload ? tempPayload.payload : {};
        const fl = calculateApparentTemperature(Number(data.temp), Number(data.hu), Number(data.ws));

        return (
            <div className="bg-slate-800 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700 z-50">
                <div className="flex items-center gap-2 border-b border-slate-600 pb-2 mb-2">
                    <CalendarDays className="w-3 h-3 text-blue-400"/>
                    <span className="font-bold">
                        {getDayName(data.fullDate)}, {data.time}
                    </span>
                </div>
                
                <div className="space-y-1">
                    <p className="flex justify-between gap-4"><span className="text-blue-200">Suhu:</span><span className="font-bold">{tempPayload ? tempPayload.value : '-'}°C</span></p>
                    <p className="flex justify-between gap-4"><span className="text-teal-200">Angin:</span><span className="font-bold">{windPayload ? windPayload.value : '-'} km/j</span></p>
                    <p className="flex justify-between gap-4"><span className="text-slate-400">Arah:</span><span className="font-bold">{data.wd}</span></p>
                    <p className="text-slate-400 capitalize italic mt-1">{data.desc}</p>
                </div>
            </div>
        );
    }
    return null;
};

// --- MAIN COMPONENT ---
export default function WeatherSummary({ data }: Props) {
    if (!data || !data.data || !data.data[0] || !data.data[0].cuaca) {
        return <div className="p-8 text-center text-slate-400">Data cuaca tidak tersedia.</div>;
    }

    const flatWeather = data.data[0].cuaca.flat();
    const current = flatWeather[0];
    const location = data.lokasi;
    const currentDate = current.local_datetime.split(' ')[0];
    
    if (!current) return null;

    const tempVal = Number(current.t) || 0;
    const humVal = Number(current.hu) || 0;
    const windVal = Number(current.ws) || 0;
    
    const feelsLike = calculateApparentTemperature(tempVal, humVal, windVal);

    const chartData = flatWeather.slice(0, 24).map(item => ({
        datetime: item.local_datetime,
        fullDate: item.local_datetime.split(' ')[0], 
        time: item.local_datetime.split(' ')[1].substring(0, 5), 
        temp: Number(item.t) || 0, 
        desc: item.weather_desc,
        ws: Number(item.ws) || 0,
        wd: item.wd,
        image: item.image 
    }));

    return (
        <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20 w-full max-w-full overflow-x-hidden">
            
            {/* HEADER LOCATION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end px-0 md:px-1 gap-3">
                <div>
                    <div className="flex items-center gap-1.5 text-blue-600 mb-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">Lokasi Terpilih</span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight leading-none truncate max-w-[280px] md:max-w-none">
                        {location.desa}
                    </h2>
                    <p className="text-slate-500 mt-0.5 font-medium text-xs md:text-base">
                        {location.kecamatan}, {location.kotkab}
                    </p>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 self-start md:self-auto text-slate-600 bg-slate-100 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full mt-1 md:mt-0">
                    <Clock className="w-3 h-3"/>
                    <span className="text-[10px] md:text-xs font-mono">Update: {current.local_datetime.split(' ')[1].substring(0, 5)}</span>
                </div>
            </div>

            {/* --- HERO CARD  --- */}
            <div className="relative w-full overflow-hidden bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-blue-100 shadow-[0_15px_40px_-10px_rgba(59,130,246,0.1)] p-4 md:p-10">
                {/* Background Pattern Abstrak (Gelombang Halus di Pojok) */}
                <div className="absolute bottom-0 right-0 w-64 h-64 opacity-30 pointer-events-none">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#3B82F6" d="M42.7,-73.2C55.9,-67.1,67.6,-57.4,76.4,-45.6C85.2,-33.8,91.1,-19.9,89.3,-6.9C87.5,6.1,78,18.2,68.2,29.3C58.4,40.4,48.3,50.5,37.1,58.3C25.9,66.1,13.6,71.6,-0.3,72.1C-14.2,72.6,-26.8,68.1,-39.3,61.4C-51.8,54.7,-64.2,45.8,-73.4,34.2C-82.6,22.6,-88.6,8.3,-86.3,-5.1C-84,-18.5,-73.4,-31,-62.4,-41.2C-51.4,-51.4,-40,-59.3,-28.4,-66.2C-16.8,-73.1,-5,-79,7.8,-82.3L20.6,-85.6Z" transform="translate(100 100) scale(1.1)" />
                    </svg>
                </div>

                <div className="relative z-10 flex flex-col xl:flex-row gap-8 xl:gap-16 items-start xl:items-center">
                    
                    {/* BAGIAN KIRI: Info Utama (Judul & Suhu) */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full shadow-lg shadow-blue-600/30">
                                Hari Ini
                            </span>
                            <span className="px-4 py-1.5 bg-white text-slate-600 text-xs font-semibold rounded-full border border-slate-100 shadow-sm">
                                {getFullDate(currentDate)}
                            </span>
                        </div>

                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight mb-2">
                                {current.weather_desc}
                            </h2>
                            <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-md">
                                Suhu saat ini mencapai <span className="font-bold text-slate-700">{current.t}°C</span> namun terasa seperti <span className="font-bold text-slate-700">{feelsLike}°</span>. Kondisi angin bertiup dari arah {current.wd}.
                            </p>
                        </div>

                        {/* Indikator Suhu Besar */}
                        <div className="w-full flex justify-center md:justify-start">
                            <div className="inline-flex items-center gap-3 md:gap-4 bg-white/60 backdrop-blur-sm p-3 md:p-4 rounded-2xl border border-white shadow-sm">
                                <img src={current.image} alt="Icon" className="w-12 h-12 md:w-16 md:h-16 drop-shadow-md" />
                                <div>
                                    <span className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tighter">{current.t}°</span>
                                    <div className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">Suhu Udara</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BAGIAN KANAN: Kartu Metrik (Wind & Atmosphere) */}
                    <div className="grid grid-cols-2 gap-3 md:gap-4 w-full xl:w-auto">
                        
                        {/* KARTU 1: ANGIN */}
                        <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                            <div className="flex justify-center items-center gap-2 mb-2 md:mb-4">
                                <div className="p-1.5 md:p-2 bg-blue-50 text-blue-600 rounded-full">
                                    <Wind className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <span className="text-[10px] md:text-xs font-bold text-slate-400 tracking-widest uppercase">ANGIN</span>
                            </div>
                            
                            <div className="flex justify-center items-center gap-1 mb-2">
                                {/* Font lebih kecil di mobile (text-2xl) agar muat */}
                                <span className="text-2xl md:text-4xl font-black text-slate-800">{current.ws}</span>
                                <span className="text-[10px] md:text-sm font-medium text-slate-400">km/j</span>
                            </div>
                            
                            <div className="inline-flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 bg-slate-50 rounded-full text-[10px] md:text-xs font-semibold text-slate-600 w-full justify-center">
                                <Navigation className="w-2.5 h-2.5 md:w-3 md:h-3" style={{ transform: `rotate(${getWindRotation(current.wd)}deg)` }} />
                                <span className="truncate">Arah: {current.wd}</span>
                            </div>
                        </div>

                        {/* KARTU 2: ATMOSFER */}
                        <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                            <div className="flex justify-center items-center gap-2 mb-2 md:mb-4">
                                <div className="p-1.5 md:p-2 bg-indigo-50 text-indigo-600 rounded-full">
                                    <Droplets className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <span className="text-[10px] md:text-xs font-bold text-slate-400 tracking-widest uppercase">KELEMBABAN</span>
                            </div>
                            
                            <div className="flex justify-center items-center gap-1 mb-2">
                                <span className="text-2xl md:text-4xl font-black text-slate-800">{current.hu}</span>
                                <span className="text-[10px] md:text-sm font-medium text-slate-400">%</span>
                            </div>

                            <div className="inline-flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 bg-slate-50 rounded-full text-[10px] md:text-xs font-semibold text-slate-600 w-full justify-center">
                                <Eye className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-400" />
                                <span className="truncate">Vis: {current.vs_text}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* CHART SECTION */}
            <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-slate-100 max-sm:max-w-xs md:w-full mx-auto overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 md:mb-6 gap-2">
                    <div>
                        <h3 className="text-xl md:text-lg font-bold text-slate-800">Grafik Cuaca</h3>
                        <div className="flex flex-wrap gap-2 md:gap-3 mt-1">
                            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-500 font-medium">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div> Suhu Udara
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-500 font-medium">
                                <div className="w-2 h-2 rounded-full bg-teal-600"></div> Kecepatan Angin
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="w-full overflow-x-auto pb-2 md:pb-4 scrollbar-hide touch-pan-x">
                    <div className="h-[400px] md:h-[400px] min-w-[900px] md:min-w-full select-none [&_.recharts-wrapper]:!outline-none [&_.recharts-surface]:!outline-none">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart 
                                data={chartData} 
                                margin={{ top: 20, right: 10, left: 0, bottom: 50 }} 
                            >
                                <defs>
                                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>

                                <CartesianGrid 
                                    vertical={true}       
                                    horizontal={false}     
                                    stroke="#e2e8f0"      
                                    strokeDasharray="4 4" 
                                />

                                <XAxis 
                                    dataKey="datetime" 
                                    axisLine={false}
                                    tickLine={false}
                                    interval={0} 
                                    padding={{ left: 20, right: 20 }}
                                    tick={<CustomXAxisTick data={chartData} />} 
                                />
                                
                                {/* FIX: Domain 'dataMin - 10' akan membuat angka minimum sumbu Y jauh lebih rendah
                                    dari data terendah Anda. Efek visualnya: Grafik suhu akan terangkat ke atas 
                                    menjauhi bagian bawah chart (tempat grafik batang angin berada).
                                */}
                                <YAxis 
                                    yAxisId="left" 
                                    orientation="left" 
                                    domain={['dataMin - 15', 'dataMax + 5']} 
                                    hide 
                                />
                                
                                {/* YAxis Kanan untuk Angin */}
                                <YAxis 
                                    yAxisId="right" 
                                    orientation="right" 
                                    domain={[0, 'dataMax + 20']} 
                                    hide 
                                />
                                
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '3 3' }} />
                                
                                {/* GRAFIK BATANG UNTUK ANGIN */}
                                <Bar 
                                    yAxisId="right"
                                    dataKey="ws" 
                                    fill="#2dd4bf" 
                                    barSize={18} 
                                    radius={[4, 4, 0, 0]} 
                                    animationDuration={1500}
                                >
                                    {/* TAMBAHKAN LABEL LIST DI SINI UNTUK IKON PANAH */}
                                    <LabelList 
                                        dataKey="ws" 
                                        content={<CustomWindArrow data={chartData} />} 
                                    />
                                </Bar>
                                
                                {/* GRAFIK AREA UNTUK SUHU */}
                                <Area 
                                    yAxisId="left" 
                                    type="monotone" 
                                    dataKey="temp" 
                                    stroke="#3b82f6" 
                                    strokeWidth={2}
                                    fill="url(#colorTemp)" 
                                    dot={<CustomizedDot />} 
                                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 0, fill: '#3b82f6', opacity: 0.5 }} 
                                    animationDuration={1500}
                                     
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
}