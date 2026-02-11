"use client";
import { Plane, Wind, Eye, Droplets, Gauge } from "lucide-react";
import { ParsedMetar, getPublicSummary, calculateDistance, estimateDuration, getVisibilityStatus } from "@/lib/bmkg/aviation-utils";
import { TicketMetricItem } from "./FlightSharedUI";

export default function RouteWeatherCard({ origin, destination }: { origin: ParsedMetar, destination: ParsedMetar }) {
    const distance = calculateDistance(parseFloat(origin.latitude), parseFloat(origin.longitude), parseFloat(destination.latitude), parseFloat(destination.longitude));
    const duration = estimateDuration(distance);

    return (
        <div className="w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
            
            {/* FLIGHT INFO */}
            <div className="relative z-10 px-6 pt-10 pb-6 md:px-10">
                <div className="flex justify-between items-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                        <Plane className="w-4 h-4 text-blue-500" /><span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Flight Route Weather</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-400 tracking-widest">FLT: {origin.icao_id}-{destination.icao_id}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* Origin */}
                    <div className="text-center md:text-left">
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">From</div>
                        <h2 className="text-5xl font-black text-slate-800 tracking-tighter">{origin.icao_id}</h2>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wide">Origin</span>
                            <p className="text-sm font-medium text-slate-500 truncate max-w-[150px]">{origin.station_name.split('-')[0]}</p>
                        </div>
                    </div>

                    {/* Flight Visualization */}
                    <div className="flex flex-col items-center justify-center w-full">
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                            <span>{distance} KM</span><span className="w-1 h-1 rounded-full bg-slate-300"></span><span>{duration}</span>
                        </div>
                        <div className="relative w-full h-12 flex items-center justify-center">
                            <div className="absolute top-1/2 left-0 w-full h-0 border-t-2 border-dashed border-slate-300"></div>
                            <div className="absolute top-1/2 left-0 w-2 h-2 bg-blue-500 rounded-full -translate-y-1/2 shadow-sm"></div>
                            <div className="absolute top-1/2 right-0 w-2 h-2 bg-slate-300 rounded-full -translate-y-1/2 shadow-sm"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2.5 rounded-full border border-blue-100 shadow-lg z-10">
                                <Plane className="w-6 h-6 text-blue-600 rotate-90 fill-blue-50" />
                            </div>
                        </div>
                    </div>

                    {/* Destination */}
                    <div className="text-center md:text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">To</div>
                        <h2 className="text-5xl font-black text-slate-800 tracking-tighter">{destination.icao_id}</h2>
                        <div className="flex items-center justify-center md:justify-end gap-2 mt-1">
                            <p className="text-sm font-medium text-slate-500 truncate max-w-[150px]">{destination.station_name.split('-')[0]}</p>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wide">Dest</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* TEAR LINE  */}
            <div className="relative w-full h-8 my-2 bg-slate-50/50">
                <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-slate-300"></div>
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full shadow-inner"></div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full shadow-inner"></div>
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-slate-50 px-3 text-slate-300"><span className="text-[10px] font-mono tracking-widest uppercase">Weather Details</span></div>
            </div>

            {/*  WEATHER DETAILS */}
            <div className="relative z-10 px-6 pb-8 pt-6 md:px-10 md:pb-10 bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <WeatherColumnTicket airport={origin} label="Origin Conditions" />
                    <div className="hidden md:block absolute left-1/2 top-8 bottom-20 w-px border-l-2 border-dashed border-slate-200/60 -translate-x-1/2"></div>
                    <WeatherColumnTicket airport={destination} label="Dest Conditions" />
                </div>
            </div>
        </div>
    );
}

// UPDATED WEATHER COLUMN
function WeatherColumnTicket({ airport, label }: { airport: ParsedMetar, label: string }) {
    const { humanWeather } = getPublicSummary(airport.visibility, airport.weather);
    const visStatus = getVisibilityStatus(airport.visibility);
    const iconUrl = `https://web-aviation.bmkg.go.id/images/weathers/${airport.symbol}.png`;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded shadow-sm border border-slate-100">{label}</span>
                <div className={`px-2 py-1 rounded-md border flex items-center gap-1.5 ${visStatus.className}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${visStatus.dot}`}></div>
                    <span className="text-[10px] font-bold">{visStatus.label}</span>
                </div>
            </div>

            {/* 2. Main Weather*/}
            <div className="flex items-center justify-center gap-5 mb-6 flex-1">
                <div className="w-20 h-20 shrink-0 bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
                    <img src={iconUrl} alt="Weather Icon" className="w-full h-full object-contain drop-shadow-md" />
                </div>
                
                {/* Text Kanan */}
                <div className="flex flex-col items-start">
                    <div className="text-5xl font-black text-slate-800 flex items-start tracking-tighter leading-none">
                        {airport.temp}<span className="text-2xl text-slate-400 font-medium mt-1 ml-0.5">°C</span>
                    </div>
                    <div className="text-sm font-bold text-slate-500 leading-tight mt-1.5 px-2.5 py-0.5 bg-white border border-slate-200/60 rounded-lg shadow-sm">
                        {humanWeather}
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mt-auto">
                <TicketMetricItem icon={<Wind className="w-3.5 h-3.5" />} label="Wind" value={`${airport.wind_speed} km/j`} mini={true} />
                <TicketMetricItem icon={<Eye className="w-3.5 h-3.5" />} label="Vis" value={`${airport.visibility} km`} mini={true} />
                <TicketMetricItem icon={<Gauge className="w-3.5 h-3.5" />} label="QNH" value={`${airport.pressure} hPa`} mini={true} />
                <TicketMetricItem icon={<Droplets className="w-3.5 h-3.5" />} label="Dew" value={`${airport.dew_point} °C`} mini={true} />
            </div>
        </div>
    );
}