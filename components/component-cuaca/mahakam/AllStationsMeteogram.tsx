"use client";

import React, { useMemo } from "react";
import { MahakamLocation, getNavigationStatus } from "@/lib/mahakam-data";
import { Thermometer, MapPin, Navigation2, X, CloudRain, Eye, Wind, Compass, ChevronLeft, ChevronRight } from "lucide-react";

interface AllStationsMeteogramProps {
  locations: MahakamLocation[];
  timeIndex: number;
  timestamps: string[];
  onSelectTime: (index: number) => void;
  onClose: () => void;
}

export default function AllStationsMeteogram({ locations, timeIndex, timestamps, onSelectTime, onClose }: AllStationsMeteogramProps) {
  // --- PENGATURAN UKURAN ---
  const ITEM_WIDTH = 85;  
  const LABEL_WIDTH = 95; 
  const TEMP_HEIGHT = 80; 
  const RAIN_HEIGHT = 55;  
  const ROW_HEIGHT = 48; 
  
  const timestamp = timestamps[timeIndex];

  // Format waktu untuk header
  const timeLabel = timestamp 
    ? new Intl.DateTimeFormat('id-ID', { 
        weekday: 'long', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Makassar' 
      }).format(new Date(timestamp)) + ' WITA'
    : '-';

  // Memformat data cuaca seluruh stasiun di jam yang sama
  const meteogramData = useMemo(() => {
    return locations.map((loc, i) => {
      const forecast = loc.forecasts?.[timeIndex];
      const wind = forecast?.windSpeed || 0;
      const visVal = forecast?.visibility_val || 99999;

      return {
        id: loc.id,
        name: loc.name.replace('Stasiun Meteorologi', '').replace('Stasiun', '').trim(),
        regency: loc.regency,
        temp: forecast?.temp || 0,
        rain: forecast?.rain || 0, 
        visibility: forecast?.visibility_val ? (forecast.visibility_val / 1000).toFixed(1) : '-', 
        icon: forecast?.weatherIcon,
        windSpeed: wind,
        windDeg: forecast?.windDeg || 0,
        status: getNavigationStatus(forecast?.condition || '', wind, visVal)
      };
    });
  }, [locations, timeIndex]);

  const CHART_WIDTH = Math.max(LABEL_WIDTH * 3, meteogramData.length * ITEM_WIDTH); 

  // Skala Suhu & Hujan
  const maxTemp = meteogramData.length ? Math.max(...meteogramData.map(d => d.temp)) + 1 : 35;
  const minTemp = meteogramData.length ? Math.min(...meteogramData.map(d => d.temp)) - 1 : 20;
  const maxRainData = meteogramData.length ? Math.max(...meteogramData.map(d => d.rain)) : 10;
  const maxRainScale = maxRainData < 5 ? 5 : maxRainData + 2;

  // Koordinat Y
  const getTempY = (temp: number) => {
    const range = maxTemp - minTemp || 1;
    return TEMP_HEIGHT - 18 - ((temp - minTemp) / range) * (TEMP_HEIGHT - 36); 
  };
  const getRainY = (rain: number) => RAIN_HEIGHT - (rain / maxRainScale) * (RAIN_HEIGHT - 15);

  // Rentang kolom header Kabupaten/Wilayah
  const regencySpans = useMemo(() => {
    if (!meteogramData || meteogramData.length === 0) return [];
    const spans: { label: string; span: number }[] = [];
    let currentSpan = 0;
    let currentLabel = meteogramData[0].regency;

    for (let i = 0; i < meteogramData.length; i++) {
      const d = meteogramData[i];
      if (d.regency !== currentLabel && i !== 0) {
        spans.push({ label: currentLabel, span: currentSpan });
        currentLabel = d.regency;
        currentSpan = 1;
      } else {
        currentSpan++;
      }
    }
    if (currentSpan > 0) spans.push({ label: currentLabel, span: currentSpan });
    return spans;
  }, [meteogramData]);

  // Generate Path SVG
  const memoizedPaths = useMemo(() => {
    if (meteogramData.length === 0) return { tArea: "", rArea: "", rLine: "" };
    
    // SUHU
    let tA = `M ${ITEM_WIDTH/2},${TEMP_HEIGHT} L ${ITEM_WIDTH/2},${getTempY(meteogramData[0].temp)}`;
    for (let i = 0; i < meteogramData.length - 1; i++) {
      const cX = i * ITEM_WIDTH + (ITEM_WIDTH/2);
      const cY = getTempY(meteogramData[i].temp);
      const nX = (i + 1) * ITEM_WIDTH + (ITEM_WIDTH/2);
      const nY = getTempY(meteogramData[i + 1].temp);
      const cPX = (cX + nX) / 2;
      const cur = ` C ${cPX},${cY} ${cPX},${nY} ${nX},${nY}`;
      tA += cur;
    }
    tA += ` L ${(meteogramData.length - 1) * ITEM_WIDTH + (ITEM_WIDTH/2)},${TEMP_HEIGHT} Z`;

    // HUJAN
    let rA = `M ${ITEM_WIDTH/2},${RAIN_HEIGHT} L ${ITEM_WIDTH/2},${getRainY(meteogramData[0].rain)}`;
    let rL = `M ${ITEM_WIDTH/2},${getRainY(meteogramData[0].rain)}`;
    for (let i = 0; i < meteogramData.length - 1; i++) {
      const cX = i * ITEM_WIDTH + (ITEM_WIDTH/2);
      const cY = getRainY(meteogramData[i].rain);
      const nX = (i + 1) * ITEM_WIDTH + (ITEM_WIDTH/2);
      const nY = getRainY(meteogramData[i + 1].rain);
      const cPX = (cX + nX) / 2;
      const cur = ` C ${cPX},${cY} ${cPX},${nY} ${nX},${nY}`;
      rA += cur; rL += cur;
    }
    rA += ` L ${(meteogramData.length - 1) * ITEM_WIDTH + (ITEM_WIDTH/2)},${RAIN_HEIGHT} Z`;
    
    return { tArea: tA, rArea: rA, rLine: rL };
  }, [meteogramData, maxTemp, minTemp, maxRainScale]);

  if (meteogramData.length === 0) return null;

  return (
    <div className="absolute inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300 flex items-center justify-center">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      
      <div className="relative w-full max-w-[95vw] lg:max-w-6xl bg-white rounded-[20px] ring-1 ring-slate-200/60 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-300">
        
        {/* HEADER DENGAN KONTROL WAKTU */}
        <div className="px-6 py-4 border-b border-blue-100 flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-white">
          <div className="flex flex-col">
            <h3 className="text-slate-800 font-extrabold text-[16px] tracking-tight flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                <MapPin className="w-4 h-4"/>
              </div>
              Prakiraan Cuaca
            </h3>
            
            {/* KONTROL WAKTU (PREV & NEXT) */}
            <div className="flex items-center gap-2 mt-1.5 pl-1">
              <span className="text-[11px] font-medium text-slate-500">Waktu:</span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => onSelectTime(Math.max(0, timeIndex - 1))}
                  disabled={timeIndex === 0}
                  className="p-1 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                  title="Mundur 1 Jam"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                
                <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100 text-[11px] min-w-[145px] text-center shadow-sm">
                  {timeLabel}
                </span>
                
                <button 
                  onClick={() => onSelectTime(Math.min(timestamps.length - 1, timeIndex + 1))}
                  disabled={timeIndex === timestamps.length - 1}
                  className="p-1 rounded-md bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                  title="Maju 1 Jam"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50 p-2 rounded-full transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex w-full relative bg-white">
          
          {/* KOLOM KIRI: KETERANGAN */}
          <div style={{ width: `${LABEL_WIDTH}px` }} className="shrink-0 bg-white border-r border-slate-100 flex flex-col z-30 shadow-[2px_0_8px_rgba(0,0,0,0.02)] text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
            <div className="h-[32px] flex items-center px-4 border-b border-blue-100/50 bg-blue-50/30 text-blue-800 font-bold">Wilayah</div>
            <div className="h-[48px] flex items-center px-4 border-b border-slate-50">Stasiun</div>
            <div className="h-[48px] flex items-center px-4 border-b border-slate-50">Kondisi</div>
            
            <div style={{ height: `${TEMP_HEIGHT}px` }} className="flex flex-col justify-center py-2 px-4 border-b border-slate-50">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Thermometer className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[11px] font-bold text-slate-700 capitalize">Suhu</span>
              </div>
              <span className="text-[9px] text-slate-400 normal-case pl-5">°Celcius</span>
            </div>
            
            <div style={{ height: `${RAIN_HEIGHT}px` }} className="flex flex-col justify-center py-2 px-4 border-b border-slate-50">
              <div className="flex items-center gap-1.5 mb-0.5">
                <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[11px] font-bold text-slate-700 capitalize">Hujan</span>
              </div>
              <span className="text-[9px] text-slate-400 normal-case pl-5">mm/jam</span>
            </div>
            
            <div style={{ height: `${ROW_HEIGHT}px` }} className="flex flex-col justify-center px-4 border-b border-slate-50">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[11px] font-bold text-slate-700 capitalize">Visib</span>
              </div>
              <span className="text-[9px] text-slate-400 normal-case pl-5">km</span>
            </div>
            
            <div style={{ height: `${ROW_HEIGHT}px` }} className="flex flex-col justify-center px-4 border-b border-slate-50">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Wind className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[11px] font-bold text-slate-700 capitalize">Angin</span>
              </div>
              <span className="text-[9px] text-slate-400 normal-case pl-5">km/jam</span>
            </div>
            
            <div style={{ height: `${ROW_HEIGHT}px` }} className="flex flex-col justify-center px-4 pb-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Compass className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[11px] font-bold text-slate-700 capitalize">Arah</span>
              </div>
              <span className="text-[9px] text-slate-400 normal-case pl-5">mata angin</span>
            </div>
          </div>

          {/* KOLOM KANAN: DATA & GRAFIK */}
          <div className="flex-1 overflow-x-auto relative pb-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
            
            <div style={{ width: `${CHART_WIDTH}px` }} className="flex flex-col relative">
              
              <div className="absolute inset-0 flex pointer-events-none z-0">
                {meteogramData.map((d) => {
                  let bgStatus = 'bg-transparent';
                  if (d.status === 'bahaya') bgStatus = 'bg-red-50/40';
                  if (d.status === 'waspada') bgStatus = 'bg-amber-50/30';
                  return (
                    <div key={`bg-${d.id}`} style={{ width: `${ITEM_WIDTH}px` }} className={`h-full transition-colors ${bgStatus}`}></div>
                  );
                })}
              </div>

              <div className="absolute inset-0 flex pointer-events-none z-10">
                {regencySpans.map((ds, i) => (
                  <div key={`v-line-${i}`} style={{ width: `${ds.span * ITEM_WIDTH}px` }} className={`shrink-0 h-full ${i !== 0 ? 'border-l border-blue-100/50' : ''}`} />
                ))}
              </div>

              <div className="flex h-[32px] border-b border-blue-100/50 relative z-20 bg-blue-50/80">
                {regencySpans.map((ds, i) => (
                  <div key={`day-span-${i}`} style={{ width: `${ds.span * ITEM_WIDTH}px` }} className="shrink-0 flex items-center justify-center px-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-800 whitespace-nowrap">
                      {ds.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex h-[48px] border-b border-slate-50 relative z-20">
                {meteogramData.map((d) => (
                  <div key={`st-${d.id}`} style={{ width: `${ITEM_WIDTH}px` }} className="shrink-0 flex items-center justify-center px-1">
                    <span className="text-[10px] font-bold text-slate-800 text-center leading-tight line-clamp-2">
                      {d.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex h-[48px] items-center border-b border-slate-50 relative z-20 overflow-visible">
                {meteogramData.map((d) => (
                  <div key={`ico-${d.id}`} style={{ width: `${ITEM_WIDTH}px` }} className="shrink-0 flex items-center justify-center">
                    {d.icon ? <img src={d.icon} alt="ico" className="w-7 h-7 object-contain drop-shadow-sm transition-transform hover:scale-110" /> : <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>}
                  </div>
                ))}
              </div>

              <div className="relative w-full z-20 border-b border-slate-50" style={{ height: `${TEMP_HEIGHT}px` }}>
                <svg width={CHART_WIDTH} height={TEMP_HEIGHT} className="absolute inset-0 overflow-visible">
                  <defs>
                    <linearGradient id="tempGradAll" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  {meteogramData.length > 0 && (
                    <path d={memoizedPaths.tArea} fill="url(#tempGradAll)" />
                  )}
                  {meteogramData.map((d, i) => (
                    <text key={`pt-${d.id}`} x={i * ITEM_WIDTH + (ITEM_WIDTH/2)} y={getTempY(d.temp) - 6} textAnchor="middle" className="text-[11px] font-bold fill-blue-700">
                      {d.temp}°
                    </text>
                  ))}
                </svg>
              </div>

              <div className="relative w-full z-20 border-b border-slate-50" style={{ height: `${RAIN_HEIGHT}px` }}>
                <svg width={CHART_WIDTH} height={RAIN_HEIGHT} className="absolute inset-0 overflow-visible">
                  <defs>
                    <linearGradient id="rainGradAll" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#cffafe" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {meteogramData.length > 0 && (
                    <>
                      <path d={memoizedPaths.rArea} fill="url(#rainGradAll)" />
                      <path d={memoizedPaths.rLine} fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </>
                  )}
                  {meteogramData.map((d, i) => {
                    if (d.rain === 0) return null;
                    return (
                      <text key={`pr-${d.id}`} x={i * ITEM_WIDTH + (ITEM_WIDTH/2)} y={getRainY(d.rain) - 5} textAnchor="middle" className="text-[10px] font-semibold fill-cyan-700">
                        {d.rain.toFixed(1)}
                      </text>
                    );
                  })}
                </svg>
              </div>

              <div className="flex items-center border-b border-slate-50 relative z-20" style={{ height: `${ROW_HEIGHT}px` }}>
                {meteogramData.map((d) => (
                  <div key={`vs-${d.id}`} style={{ width: `${ITEM_WIDTH}px` }} className="shrink-0 flex items-center justify-center">
                    <span className="text-[10px] font-medium text-slate-700 bg-white border border-slate-200 shadow-sm px-2 py-0.5 rounded-md">
                      {d.visibility}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center border-b border-slate-50 relative z-20" style={{ height: `${ROW_HEIGHT}px` }}>
                {meteogramData.map((d) => (
                  <div key={`ws-${d.id}`} style={{ width: `${ITEM_WIDTH}px` }} className="shrink-0 flex items-center justify-center">
                    <span className="text-[10px] font-medium text-slate-700 bg-white border border-slate-200 shadow-sm px-2 py-0.5 rounded-md">
                      {d.windSpeed}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center relative z-20 pb-1 overflow-visible" style={{ height: `${ROW_HEIGHT}px` }}>
                {meteogramData.map((d) => (
                  <div key={`wd-${d.id}`} style={{ width: `${ITEM_WIDTH}px` }} className="shrink-0 flex items-center justify-center mt-1">
                    <div style={{ transform: `rotate(${d.windDeg || 0}deg)` }} className="text-blue-500">
                      <Navigation2 className="w-3.5 h-3.5 fill-blue-100 stroke-blue-500" />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}