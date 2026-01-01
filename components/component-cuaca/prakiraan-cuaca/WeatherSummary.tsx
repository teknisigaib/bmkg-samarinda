"use client";

import { BMKGResponse } from "./types";
import { 
    Wind, Droplets, MapPin, Navigation, 
    Clock, Eye // Tambah icon Eye
} from "lucide-react";
import { 
    ComposedChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';

interface Props {
    data: BMKGResponse;
}

// --- 1. HELPER ---
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

// --- 2. CUSTOM COMPONENTS ---
const CustomXAxisTick = ({ x, y, payload, data }: any) => {
    const currentItem = data.find((d: any) => d.time === payload.value);
    if (!currentItem) return null;
    const rotation = getWindRotation(currentItem.wd);

    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={12} textAnchor="middle" fill="#94a3b8" fontSize={9} fontWeight={500}>
                {currentItem.ws} <tspan fontSize={7}>km/j</tspan>
            </text>
            <foreignObject x={-6} y={16} width={12} height={12}>
                <Navigation width={12} height={12} color="#3b82f6" style={{ transform: `rotate(${rotation}deg)`, display: 'block', margin: '0 auto' }} />
            </foreignObject>
            <text x={0} y={0} dy={42} textAnchor="middle" fill="#64748b" fontSize={10} fontWeight={700}>
                {payload.value}
            </text>
        </g>
    );
};

const CustomizedDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy) return null;
    return (
        <image x={cx - 12} y={cy - 12} width={24} height={24} href={payload.image} style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.2))' }} />
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const tempPayload = payload.find((p: any) => p.dataKey === 'temp');
        const windPayload = payload.find((p: any) => p.dataKey === 'ws');
        const data = tempPayload ? tempPayload.payload : {};

        return (
            <div className="bg-slate-800 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700 z-50">
                <p className="font-bold mb-2 border-b border-slate-600 pb-1">{label}</p>
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
    // 1. SAFETY CHECK: Mencegah crash jika data kosong
    if (!data || !data.data || !data.data[0] || !data.data[0].cuaca) {
        return <div className="p-8 text-center text-slate-400">Data cuaca tidak tersedia untuk lokasi ini.</div>;
    }

    const flatWeather = data.data[0].cuaca.flat();
    const current = flatWeather[0];
    const location = data.lokasi;
    
    // Safety check tambahan untuk array kosong
    if (!current) return null;

    const chartData = flatWeather.slice(0, 12).map(item => ({
        time: item.local_datetime.split(' ')[1].substring(0, 5),
        temp: item.t,
        desc: item.weather_desc,
        ws: item.ws,
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

            {/* HERO CARD */}
            <div className="relative w-full overflow-hidden bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 p-4 md:p-8">
                <div className="absolute -top-24 -right-24 w-48 md:w-64 h-48 md:h-64 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-48 md:w-64 h-48 md:h-64 bg-teal-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                    {/* Suhu */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-auto">
                        <span className="text-[4rem] md:text-[6rem] leading-none font-bold text-slate-800 tracking-tighter">
                            {current.t}°
                        </span>
                        <div className="mt-1 md:mt-2">
                            <div className="text-base md:text-xl font-medium text-slate-800">{current.weather_desc}</div>
                            <div className="text-[10px] md:text-sm text-slate-400">Terasa seperti <span className="text-slate-600 font-bold">{current.t + 2}°</span></div>
                        </div>
                    </div>

                    {/* Ikon */}
                    <div className="w-20 h-20 md:w-40 md:h-40 shrink-0 transform hover:scale-105 transition-transform duration-500">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={current.image} alt="Weather Icon" className="w-full h-full object-contain drop-shadow-2xl" />
                    </div>

                    {/* DETAIL GRID (Updated: 2 Columns on Mobile for Balance) */}
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3 w-full md:w-auto min-w-[200px]">
                        
                        {/* 1. Angin */}
                        <div className="flex flex-col md:flex-row items-center md:justify-between bg-slate-50/80 backdrop-blur border border-slate-100 p-2 md:p-3 rounded-xl md:rounded-2xl text-center md:text-left">
                            <div className="flex items-center gap-2 mb-1 md:mb-0">
                                <div className="p-1 md:p-2 bg-blue-100 text-blue-600 rounded-full"><Wind className="w-3 h-3 md:w-4 md:h-4" /></div>
                                <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:block">Angin</span>
                            </div>
                            <div className="text-[10px] md:text-sm font-bold text-slate-700">{current.ws} <span className="text-[8px] md:text-[10px] font-normal text-slate-400">km/j</span></div>
                        </div>

                        {/* 2. Lembap */}
                        <div className="flex flex-col md:flex-row items-center md:justify-between bg-slate-50/80 backdrop-blur border border-slate-100 p-2 md:p-3 rounded-xl md:rounded-2xl text-center md:text-left">
                            <div className="flex items-center gap-2 mb-1 md:mb-0">
                                <div className="p-1 md:p-2 bg-indigo-100 text-indigo-600 rounded-full"><Droplets className="w-3 h-3 md:w-4 md:h-4" /></div>
                                <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:block">Lembap</span>
                            </div>
                            <div className="text-[10px] md:text-sm font-bold text-slate-700">{current.hu}<span className="text-[8px] md:text-[10px] font-normal text-slate-400">%</span></div>
                        </div>

                        {/* 3. Arah */}
                        <div className="flex flex-col md:flex-row items-center md:justify-between bg-slate-50/80 backdrop-blur border border-slate-100 p-2 md:p-3 rounded-xl md:rounded-2xl text-center md:text-left">
                            <div className="flex items-center gap-2 mb-1 md:mb-0">
                                <div className="p-1 md:p-2 bg-emerald-100 text-emerald-600 rounded-full"><Navigation className="w-3 h-3 md:w-4 md:h-4" /></div>
                                <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:block">Arah</span>
                            </div>
                            <div className="text-[10px] md:text-sm font-bold text-slate-700">{current.wd}</div>
                        </div>

                        {/* 4. VISIBILITY (BARU: Agar Grid Seimbang 2x2 di Mobile) */}
                        <div className="flex flex-col md:flex-row items-center md:justify-between bg-slate-50/80 backdrop-blur border border-slate-100 p-2 md:p-3 rounded-xl md:rounded-2xl text-center md:text-left">
                            <div className="flex items-center gap-2 mb-1 md:mb-0">
                                <div className="p-1 md:p-2 bg-amber-100 text-amber-600 rounded-full"><Eye className="w-3 h-3 md:w-4 md:h-4" /></div>
                                <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:block">Visibilitas</span>
                            </div>
                            <div className="text-[10px] md:text-sm font-bold text-slate-700 truncate max-w-[50px] md:max-w-none">{current.vs_text}</div>
                        </div>

                    </div>
                </div>
            </div>

            {/* CHART SECTION */}
            <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-slate-100 max-sm:max-w-xs md:w-full mx-auto overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 md:mb-6 gap-2">
                    <div>
                        <h3 className="text-base md:text-lg font-bold text-slate-800">Tren Mikro Cuaca</h3>
                        <div className="flex flex-wrap gap-2 md:gap-3 mt-1">
                            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-500 font-medium">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div> Suhu & Ikon
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-500 font-medium">
                                <div className="w-2 h-2 rounded-full bg-teal-400"></div> Kecepatan Angin
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="w-full overflow-x-auto pb-2 md:pb-4 scrollbar-hide touch-pan-x">
                    <div className="h-[320px] md:h-[350px] min-w-[550px] md:min-w-full select-none">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 50 }}>
                                <defs>
                                    <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3"/>
                                <XAxis dataKey="time" axisLine={false} tickLine={false} interval={0} tick={<CustomXAxisTick data={chartData} />} />
                                <YAxis yAxisId="left" orientation="left" domain={['dataMin - 2', 'dataMax + 2']} hide />
                                <YAxis yAxisId="right" orientation="right" domain={[0, 'dataMax + 20']} hide />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} />
                                <Area yAxisId="right" type="monotone" dataKey="ws" stroke="none" fill="url(#colorWind)" animationDuration={1500} />
                                <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={3} dot={<CustomizedDot />} activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 0, fill: 'white', opacity: 0.5 }} animationDuration={1500} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
}