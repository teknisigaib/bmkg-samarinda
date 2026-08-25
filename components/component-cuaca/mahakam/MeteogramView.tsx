"use client";

import React, { useMemo } from "react";
import { MahakamLocation } from "@/lib/mahakam-data";
import { Thermometer, MapPin, Navigation2, X, CloudRain, Eye, Wind, Compass } from "lucide-react";

interface MeteogramViewProps {
  data: MahakamLocation;
  onClose: () => void;
}

export default function MeteogramView({ data, onClose }: MeteogramViewProps) {
  // --- PENGATURAN UKURAN ---
  const ITEM_WIDTH = 52; 
  const LABEL_WIDTH = 95; // Sedikit dilebarkan untuk teks satuan
  const TEMP_HEIGHT = 80; 
  const RAIN_HEIGHT = 55;  
  const ROW_HEIGHT = 48; // Tinggi standar baru untuk baris yang punya 2 baris teks
  
  // Memformat data cuaca untuk meteogram
  const meteogramData = useMemo(() => {
    if (!data.forecasts) return [];
    return data.forecasts.map((f, i) => {
      const dateObj = new Date(f.time);
      return {
        id: i,
        time: f.time,
        timeStr: new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Makassar' }).format(dateObj).replace('.', ':'),
        dayLabel: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', timeZone: 'Asia/Makassar' }).format(dateObj),
        temp: f.temp,
        rain: f.rain || 0, 
        visibility: f.visibility_val ? (f.visibility_val / 1000).toFixed(1) : '-', 
        icon: f.weatherIcon,
        windSpeed: f.windSpeed,
        windDeg: f.windDeg
      };
    });
  }, [data]);

  const CHART_WIDTH = Math.max(LABEL_WIDTH * 3, meteogramData.length * ITEM_WIDTH); 

  // Skala Suhu
  const maxTemp = meteogramData.length ? Math.max(...meteogramData.map(d => d.temp)) + 1 : 35;
  const minTemp = meteogramData.length ? Math.min(...meteogramData.map(d => d.temp)) - 1 : 20;
  
  // Skala Hujan
  const maxRainData = meteogramData.length ? Math.max(...meteogramData.map(d => d.rain)) : 10;
  const maxRainScale = maxRainData < 5 ? 5 : maxRainData + 2;

  // Koordinat Y
  const getTempY = (temp: number) => {
    const range = maxTemp - minTemp || 1;
    return TEMP_HEIGHT - 18 - ((temp - minTemp) / range) * (TEMP_HEIGHT - 36); 
  };
  const getRainY = (rain: number) => RAIN_HEIGHT - (rain / maxRainScale) * (RAIN_HEIGHT - 15);

  // Cek apakah malam hari (jam 18:00 - 05:59)
  const isNightTime = (timeStr: string) => {
    if (!timeStr) return false;
    const hour = parseInt(timeStr.split(":")[0], 10);
    return hour >= 18 || hour < 6;
  };

  // Rentang kolom header hari
  const daySpans = useMemo(() => {
    if (!meteogramData || meteogramData.length === 0) return [];
    const spans: { label: string; span: number }[] = [];
    let currentSpan = 0;
    let currentLabel = meteogramData[0].dayLabel;

    for (let i = 0; i < meteogramData.length; i++) {
      const d = meteogramData[i];
      if (d.dayLabel !== currentLabel && i !== 0) {
        spans.push({ label: currentLabel, span: currentSpan });
        currentLabel = d.dayLabel;
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
    
    // SUHU (Hanya Area Tanpa Garis)
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
    <div className="w-full bg-white rounded-[20px] ring-1 ring-slate-200/60 shadow-2xl overflow-hidden relative">
      
      {/* HEADER: Ultra Minimalist */}
      <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
        <div className="flex flex-col">
          <h3 className="text-slate-800 font-bold text-[16px] tracking-tight flex items-center gap-2">
            Meteogram {data.name}
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mt-0.5">
            <MapPin className="w-3.5 h-3.5" />
            {data.regency}
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex w-full relative bg-white">
        
        {/* KOLOM KIRI: KETERANGAN */}
        <div style={{ width: `${LABEL_WIDTH}px` }} className="shrink-0 bg-white border-r border-slate-100 flex flex-col z-30 shadow-[2px_0_8px_rgba(0,0,0,0.02)] text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
          <div className="h-[32px] flex items-center px-4 border-b border-slate-50">Hari</div>
          <div className="h-[32px] flex items-center px-4 border-b border-slate-50">Jam</div>
          <div className="h-[48px] flex items-center px-4 border-b border-slate-50">Kondisi</div>
          
          <div style={{ height: `${TEMP_HEIGHT}px` }} className="flex flex-col justify-center py-2 px-4 border-b border-slate-50">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Thermometer className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-700 capitalize">Suhu</span>
            </div>
            <span className="text-[9px] text-slate-400 normal-case pl-5">°Celcius</span>
          </div>
          
          <div style={{ height: `${RAIN_HEIGHT}px` }} className="flex flex-col justify-center py-2 px-4 border-b border-slate-50">
            <div className="flex items-center gap-1.5 mb-0.5">
              <CloudRain className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-700 capitalize">Hujan</span>
            </div>
            <span className="text-[9px] text-slate-400 normal-case pl-5">mm/jam</span>
          </div>
          
          {/* Tambahan Satuan: Visibilitas */}
          <div style={{ height: `${ROW_HEIGHT}px` }} className="flex flex-col justify-center px-4 border-b border-slate-50">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-700 capitalize">Visib</span>
            </div>
            <span className="text-[9px] text-slate-400 normal-case pl-5">km</span>
          </div>
          
          {/* Tambahan Satuan: Angin */}
          <div style={{ height: `${ROW_HEIGHT}px` }} className="flex flex-col justify-center px-4 border-b border-slate-50">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Wind className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-700 capitalize">Angin</span>
            </div>
            <span className="text-[9px] text-slate-400 normal-case pl-5">km/jam</span>
          </div>
          
          {/* Tambahan Satuan: Arah Angin */}
          <div style={{ height: `${ROW_HEIGHT}px` }} className="flex flex-col justify-center px-4 pb-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Compass className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-700 capitalize">Arah</span>
            </div>
            <span className="text-[9px] text-slate-400 normal-case pl-5">mata angin</span>
          </div>
        </div>

        {/* KOLOM KANAN: DATA & GRAFIK */}
        <div className="flex-1 overflow-x-auto relative pb-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          
          <div style={{ width: `${CHART_WIDTH}px` }} className="flex flex-col relative">
            
            {/* Latar Belakang Malam (Sangat Lembut) */}
            <div className="absolute inset-0 flex pointer-events-none z-0">
              {meteogramData.map((d, i) => (
                <div key={`bg-${d.id}`} style={{ width: `${ITEM_WIDTH}px` }} className={`h-full transition-colors ${isNightTime(d.timeStr) ? 'bg-slate-900/[0.02]' : 'bg-transparent'}`}></div>
              ))}
            </div>

            {/* Garis Pemisah Hari */}
            <div className="absolute inset-0 flex pointer-events-none z-10">
              {daySpans.map((ds, i) => (
                <div key={`v-line-${i}`} style={{ width: `${ds.span * ITEM_WIDTH}px` }} className={`shrink-0 h-full ${i !== 0 ? 'border-l border-slate-100' : ''}`} />
              ))}
            </div>

            {/* ROW 1: HARI */}
            <div className="flex h-[32px] border-b border-slate-50 relative z-20">
              {daySpans.map((ds, i) => (
                <div key={`day-span-${i}`} style={{ width: `${ds.span * ITEM_WIDTH}px` }} className="shrink-0 flex items-center justify-center px-2">
                  <span className="text-[11px] font-semibold text-slate-600 whitespace-nowrap">
                    {ds.label}
                  </span>
                </div>
              ))}
            </div>

            {/* ROW 2: JAM */}
            <div className="flex h-[32px] border-b border-slate-50 relative z-20">
              {meteogramData.map((d) => (
                <div key={`time-${d.id}`} style={{ width: `${ITEM_WIDTH}px` }} className="shrink-0 flex items-center justify-center">
                  <span className="text-[11px] font-medium text-slate-500">{d.timeStr.split(':')[0]}</span>
                </div>
              ))}
            </div>

            {/* ROW 3: IKON KONDISI */}
            <div className="flex h-[48px] items-center border-b border-slate-50 relative z-20 overflow-visible">
              {meteogramData.map((d) => (
                <div key={`ico-${d.id}`} style={{ width: `${ITEM_WIDTH}px` }} className="shrink-0 flex items-center justify-center">
                  {d.icon ? <img src={d.icon} alt="ico" className="w-7 h-7 object-contain drop-shadow-sm transition-transform hover:scale-110" /> : <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>}
                </div>
              ))}
            </div>

            {/* ROW 4: SVG GRAFIK SUHU (GAYA BORDERLESS AREA - FULL BLUE) */}
            <div className="relative w-full z-20 border-b border-slate-50" style={{ height: `${TEMP_HEIGHT}px` }}>
              <svg width={CHART_WIDTH} height={TEMP_HEIGHT} className="absolute inset-0 overflow-visible">
                <defs>
                  <linearGradient id="tempGradPro" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.45" /> {/* Blue-600 */}
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" /> {/* Blue-500 */}
                  </linearGradient>
                </defs>
                {meteogramData.length > 0 && (
                  <path d={memoizedPaths.tArea} fill="url(#tempGradPro)" />
                )}
                {meteogramData.map((d, i) => (
                  <text key={`pt-${d.id}`} x={i * ITEM_WIDTH + (ITEM_WIDTH/2)} y={getTempY(d.temp) - 6} textAnchor="middle" className="text-[11px] font-bold fill-blue-700">
                    {d.temp}°
                  </text>
                ))}
              </svg>
            </div>

            {/* ROW 5: SVG GRAFIK HUJAN (Warna Cyan/Teal Tipis) */}
            <div className="relative w-full z-20 border-b border-slate-50" style={{ height: `${RAIN_HEIGHT}px` }}>
              <svg width={CHART_WIDTH} height={RAIN_HEIGHT} className="absolute inset-0 overflow-visible">
                <defs>
                  <linearGradient id="rainGradPro" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" /> {/* Cyan-500 */}
                    <stop offset="100%" stopColor="#cffafe" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {meteogramData.length > 0 && (
                  <>
                    <path d={memoizedPaths.rArea} fill="url(#rainGradPro)" />
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

            {/* ROW 6: VISIBILITAS */}
            <div className="flex items-center border-b border-slate-50 relative z-20" style={{ height: `${ROW_HEIGHT}px` }}>
              {meteogramData.map((d) => (
                <div key={`vs-${d.id}`} style={{ width: `${ITEM_WIDTH}px` }} className="shrink-0 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md">
                    {d.visibility}
                  </span>
                </div>
              ))}
            </div>

            {/* ROW 7: KECEPATAN ANGIN */}
            <div className="flex items-center border-b border-slate-50 relative z-20" style={{ height: `${ROW_HEIGHT}px` }}>
              {meteogramData.map((d) => (
                <div key={`ws-${d.id}`} style={{ width: `${ITEM_WIDTH}px` }} className="shrink-0 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md">
                    {d.windSpeed}
                  </span>
                </div>
              ))}
            </div>

            {/* ROW 8: ARAH ANGIN */}
            <div className="flex items-center relative z-20 pb-1 overflow-visible" style={{ height: `${ROW_HEIGHT}px` }}>
              {meteogramData.map((d) => (
                <div key={`wd-${d.id}`} style={{ width: `${ITEM_WIDTH}px` }} className="shrink-0 flex items-center justify-center mt-1">
                  <div style={{ transform: `rotate(${d.windDeg || 0}deg)` }} className="text-slate-400">
                    <Navigation2 className="w-3.5 h-3.5 fill-slate-300 stroke-slate-400" />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}