// components/component-cuaca/cuaca-penerbangan/FlightSharedUI.tsx
import { ParsedMetar, getPublicSummary } from "@/lib/bmkg/aviation-utils";
import { Thermometer } from "lucide-react";

// 1. Metric Item (Kotak Kecil)
export function TicketMetricItem({ icon, label, value, sub, mini = false }: any) {
    return (
        <div className={`bg-white rounded-xl border border-slate-200 shadow-sm flex ${mini ? 'flex-row items-center gap-3 p-2' : 'flex-col gap-2 p-4'} relative overflow-hidden group hover:border-blue-300 transition-all`}>
            <div className={`flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-wider ${mini ? '' : 'mb-1'}`}>
                <div className={`${mini ? 'p-1.5' : ''} text-blue-500 bg-slate-50 rounded`}>{icon}</div>
                {!mini && <span>{label}</span>}
            </div>
            
            <div>
                {mini && <div className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-0.5">{label}</div>}
                <div className={`${mini ? 'text-sm' : 'text-xl'} font-black text-slate-800 leading-none tracking-tight`}>{value}</div>
                {sub && <div className="text-xs font-medium text-slate-400 mt-1">{sub}</div>}
            </div>
            {!mini && <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-slate-100 rotate-45 group-hover:bg-blue-50 transition-colors"></div>}
        </div>
    )
}

// 2. Raw Data Block (METAR/TAF Text)
export function RawDataBlock({ title, data, colorClass, bgClass, borderClass, isTaf = false }: any) {
    return (
        <div className={`rounded-2xl p-4 border ${bgClass} ${borderClass}`}>
            <div className="flex items-center gap-2 mb-3">
                <span className={`font-black text-[10px] px-2 py-1 rounded-md uppercase tracking-widest ${colorClass} bg-slate-900/50 border ${borderClass}`}>
                    {title}
                </span>
            </div>
            <div className="space-y-2">
                {data.length > 0 ? data.slice(0, isTaf ? 1 : 2).map((item: any, idx: number) => (
                    <div key={idx} className={`font-mono text-sm ${colorClass} leading-relaxed break-words`}>
                        <span className="text-slate-500 mr-2 text-xs font-semibold select-none">
                            [{item.issued_time ? item.issued_time.substring(11, 16) : (item.observed_time ? item.observed_time.substring(11, 16) : "AUTO")}Z]
                        </span>
                        {item.data_text}
                    </div>
                )) : <div className="text-slate-600 text-xs italic font-medium pl-1">Data tidak tersedia saat ini.</div>}
            </div>
        </div>
    )
}

// 3. Small Airport Card (Kartu Grid)
export function SmallAirportCard({ airport }: { airport: ParsedMetar }) {
    const { status, humanWeather } = getPublicSummary(airport.visibility, airport.weather);
    const iconUrl = `https://web-aviation.bmkg.go.id/images/weathers/${airport.symbol}.png`;

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-blue-300 group h-full cursor-pointer">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {airport.station_name.split(' - ')[0]}
                    </h4>
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">{airport.icao_id}</span>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${status.color.split(' ')[0].replace('bg-', 'bg-').replace('-100', '-500')}`}></div>
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-3">
                <div className="w-8 h-8 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={iconUrl} alt="icon" className="w-full h-full object-contain" />
                </div>
                <div>
                    <div className="font-medium text-gray-800 leading-tight line-clamp-1">{humanWeather}</div>
                    <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <Thermometer className="w-3 h-3"/> {airport.temp}°C
                    </div>
                </div>
            </div>
        </div>
    );
}