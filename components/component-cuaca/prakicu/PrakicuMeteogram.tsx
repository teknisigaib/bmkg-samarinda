"use client";

import React, { useMemo } from "react";
import { Thermometer, MapIcon, Navigation2, Loader2 } from "lucide-react";

interface MeteogramProps {
  meteogramData: any[];
  isFetchingSub: boolean;
  selectedLocation: { id: string; name: string; type: string };
}

export default function PrakicuMeteogram({ meteogramData, isFetchingSub, selectedLocation }: MeteogramProps) {
  
  const ITEM_WIDTH = 55; 
  const LABEL_WIDTH = 80; 
  const CHART_WIDTH = Math.max(24 * ITEM_WIDTH, meteogramData.length * ITEM_WIDTH); 
  
  // Pemisahan area agar lega (Desain Premium)
  const TEMP_HEIGHT = 90;
  const RAIN_HEIGHT = 65;
  
  // Skala Suhu
  const maxTemp = meteogramData.length ? Math.max(...meteogramData.map(d => d.temp)) + 1 : 35;
  const minTemp = meteogramData.length ? Math.min(...meteogramData.map(d => d.temp)) - 1 : 20;
  
  // Skala Hujan
  const maxRainData = meteogramData.length ? Math.max(...meteogramData.map(d => d.rain)) : 10;
  const maxRainScale = maxRainData < 5 ? 5 : maxRainData + 2;

  // Koordinat Y
  const getTempY = (temp: number) => {
    const range = maxTemp - minTemp || 1;
    return 70 - ((temp - minTemp) / range) * 65; 
  };
  const getRainY = (rain: number) => RAIN_HEIGHT - (rain / maxRainScale) * 45;

  const isNightTime = (timeStr: string) => {
    if (!timeStr) return false;
    const hour = parseInt(timeStr.split(":")[0], 10);
    return hour >= 18 || hour < 6;
  };

  // =========================================================
  // LOGIKA BARU: Menghitung Rentang (Span) Masing-masing Hari
  // =========================================================
  const daySpans = useMemo(() => {
    if (!meteogramData || meteogramData.length === 0) return [];
    
    const spans: { label: string; span: number }[] = [];
    let currentSpan = 0;
    let currentLabel = meteogramData[0].dayLabel || "Hari Ini";

    for (let i = 0; i < meteogramData.length; i++) {
      const d = meteogramData[i];
      // Jika dayLabel tidak kosong dan bukan index 0, berarti ganti hari
      if (d.dayLabel && i !== 0) {
        spans.push({ label: currentLabel, span: currentSpan });
        currentLabel = d.dayLabel;
        currentSpan = 1;
      } else {
        currentSpan++;
      }
    }
    // Masukkan hari terakhir ke dalam array
    if (currentSpan > 0) {
      spans.push({ label: currentLabel, span: currentSpan });
    }
    return spans;
  }, [meteogramData]);

  const memoizedPaths = useMemo(() => {
    if (meteogramData.length === 0) return { tLine: "", tArea: "", rArea: "", rLine: "" };
    
    // SUHU
    let tL = `M ${ITEM_WIDTH/2},${getTempY(meteogramData[0].temp)}`;
    let tA = `M ${ITEM_WIDTH/2},${TEMP_HEIGHT} L ${ITEM_WIDTH/2},${getTempY(meteogramData[0].temp)}`;
    for (let i = 0; i < meteogramData.length - 1; i++) {
      const cX = i * ITEM_WIDTH + (ITEM_WIDTH/2);
      const cY = getTempY(meteogramData[i].temp);
      const nX = (i + 1) * ITEM_WIDTH + (ITEM_WIDTH/2);
      const nY = getTempY(meteogramData[i + 1].temp);
      const cPX = (cX + nX) / 2;
      const cur = ` C ${cPX},${cY} ${cPX},${nY} ${nX},${nY}`;
      tL += cur; tA += cur;
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
    
    return { tLine: tL, tArea: tA, rArea: rA, rLine: rL };
  }, [meteogramData, maxTemp, minTemp, maxRainScale]);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-4 relative">
      
      {/* Loading Overlay */}
      {isFetchingSub && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-[10px] font-black text-slate-500 mt-2 tracking-widest uppercase">Sinkronisasi...</span>
        </div>
      )}

      {/* HEADER */}
      <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
        <h3 className="text-slate-800 font-black text-lg flex items-center gap-2">
          <div className="p-1.5 bg-slate-100 rounded-lg">
            <Thermometer className="w-4 h-4 md:w-5 md:h-5 text-slate-700" />
          </div> 
          Meteogram
        </h3>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
          <MapIcon className="w-3.5 h-3.5 text-slate-400" />
          {selectedLocation.name} <span className="opacity-50">| {selectedLocation.type.toUpperCase()}</span>
        </div>
      </div>

      <div className="flex w-full relative">
        
        {/* KOLOM KIRI: KETERANGAN (Fixed) */}
        <div style={{ width: `${LABEL_WIDTH}px` }} className="shrink-0 bg-[#f8f9fa] border-r border-slate-200/80 flex flex-col z-20 shadow-[2px_0_5px_rgba(0,0,0,0.03)] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="h-[30px] flex items-center px-4 border-b border-slate-200/50">Hari</div>
          <div className="h-[28px] flex items-center px-4 border-b border-slate-200/50">Jam</div>
          <div className="h-[50px] flex items-center px-4 border-b border-slate-200/50">Kondisi</div>
          
          <div style={{ height: `${TEMP_HEIGHT}px` }} className="flex flex-col justify-end py-2 px-4 border-b border-slate-200/50">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black text-slate-600">Suhu</span>
              <span className="text-[9px] font-medium text-slate-400 normal-case">°C</span>
            </div>
          </div>
          
          <div style={{ height: `${RAIN_HEIGHT}px` }} className="flex flex-col justify-end py-3 px-4 border-b border-slate-200/50">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black text-slate-600">Hujan</span>
              <span className="text-[9px] font-medium text-slate-400 normal-case">mm</span>
            </div>
          </div>
          
          <div className="h-[30px] flex items-center px-4 border-b border-slate-200/50">Angin</div>
          <div className="h-[30px] flex items-center px-4 pb-1">Arah</div>
        </div>

        {/* KOLOM KANAN: DATA & GRAFIK (Scrollable X) */}
        <div className="flex-1 overflow-x-auto custom-scrollbar relative pb-1">
          
          {/* Garis Merah Putus-putus "Waktu Saat Ini" */}
          <div className="absolute top-0 bottom-0 z-30 pointer-events-none" style={{ left: `${ITEM_WIDTH / 2}px`, borderLeft: '1.5px dashed #ef4444', opacity: 0.6 }}></div>

          <div style={{ width: `${CHART_WIDTH}px` }} className="flex flex-col relative">
            
            {/* Latar Belakang Malam */}
            <div className="absolute inset-0 flex pointer-events-none z-0">
              {meteogramData.map((d, i) => (
                <div key={`bg-${i}`} style={{ width: `${ITEM_WIDTH}px` }} className={`h-full ${isNightTime(d.time) ? 'bg-slate-800/[0.04]' : 'bg-transparent'}`}></div>
              ))}
            </div>

            {/* ========================================================= */}
            {/* GARIS PEMISAH HARI VERTIKAL (Tembus dari atas ke bawah) */}
            {/* ========================================================= */}
            <div className="absolute inset-0 flex pointer-events-none z-10">
              {daySpans.map((ds, i) => (
                <div 
                  key={`v-line-${i}`} 
                  style={{ width: `${ds.span * ITEM_WIDTH}px` }} 
                  className={`shrink-0 h-full ${i !== 0 ? 'border-l border-slate-300/60' : ''}`} 
                />
              ))}
            </div>

            {/* ========================================================= */}
            {/* ROW 1: HARI (Rata Tengah) */}
            {/* ========================================================= */}
            <div className="flex h-[30px] border-b border-slate-200/50 relative z-20">
              {daySpans.map((ds, i) => (
                <div 
                  key={`day-span-${i}`} 
                  style={{ width: `${ds.span * ITEM_WIDTH}px` }} 
                  className="shrink-0 flex items-center justify-center px-2"
                >
                  <span className="text-[11px] font-bold text-slate-700 whitespace-nowrap bg-white/60 px-2 py-0.5 rounded-full">
                    {ds.label}
                  </span>
                </div>
              ))}
            </div>

            {/* ROW 2: JAM */}
            <div className="flex h-[28px] border-b border-slate-200/50 relative z-20">
              {meteogramData.map((d) => (
                <div key={`time-${d.id}`} style={{ width: `${ITEM_WIDTH}px` }} className="shrink-0 flex items-center justify-center">
                  <span className="text-[11px] font-black text-slate-600">{d.time.split(':')[0]}</span>
                </div>
              ))}
            </div>

            {/* ROW 3: IKON KONDISI */}
            <div className="flex h-[50px] items-center border-b border-slate-200/50 relative z-20 overflow-visible">
              {meteogramData.map((d) => (
                <div key={`ico-${d.id}`} style={{ width: `${ITEM_WIDTH}px` }} className="shrink-0 flex items-center justify-center">
                  <img src={d.image} alt="ico" className="w-8 h-8 object-contain drop-shadow-sm hover:scale-110 transition-transform cursor-pointer" />
                </div>
              ))}
            </div>

            {/* ROW 4: SVG GRAFIK SUHU */}
            <div className="relative w-full z-20 border-b border-slate-200/50" style={{ height: `${TEMP_HEIGHT}px` }}>
              <svg width={CHART_WIDTH} height={TEMP_HEIGHT} className="absolute inset-0 overflow-visible">
                <defs>
                  <linearGradient id="pinkGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {meteogramData.length > 0 && (
                  <>
                    <path d={memoizedPaths.tArea} fill="url(#pinkGrad)" />
                    <path d={memoizedPaths.tLine} fill="none" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                )}
                {meteogramData.map((d, i) => {
                  const x = i * ITEM_WIDTH + (ITEM_WIDTH/2);
                  return (
                    <text key={`pt-${d.id}`} x={x} y={TEMP_HEIGHT - 8} textAnchor="middle" className="text-[12px] font-black fill-slate-800">
                      {d.temp}°
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* ROW 5: SVG GRAFIK HUJAN */}
            <div className="relative w-full z-20 border-b border-slate-200/50" style={{ height: `${RAIN_HEIGHT}px` }}>
              <svg width={CHART_WIDTH} height={RAIN_HEIGHT} className="absolute inset-0 overflow-visible">
                <defs>
                  <linearGradient id="rainGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
                {meteogramData.length > 0 && (
                  <>
                    <path d={memoizedPaths.rArea} fill="url(#rainGrad)" />
                    <path d={memoizedPaths.rLine} fill="none" stroke="#38bdf8" strokeWidth="0.1" />
                  </>
                )}
                {meteogramData.map((d, i) => {
                  if (d.rain === 0) return null;
                  const x = i * ITEM_WIDTH + (ITEM_WIDTH/2);
                  const ry = getRainY(d.rain);
                  return (
                    <text key={`pr-${d.id}`} x={x} y={ry - 6} textAnchor="middle" className="text-[11px] font-black fill-blue-700">
                      {d.rain.toFixed(1)}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* ROW 6: KECEPATAN ANGIN */}
            <div className="flex h-[30px] items-center border-b border-slate-200/50 relative z-20">
              {meteogramData.map((d) => (
                <div key={`ws-${d.id}`} style={{ width: `${ITEM_WIDTH}px` }} className="shrink-0 flex items-center justify-center">
                  <span className="text-[11px] font-black text-slate-600">{d.windSpeed}</span>
                </div>
              ))}
            </div>

            {/* ROW 7: ARAH ANGIN */}
            <div className="flex h-[30px] items-center relative z-20 pb-1 overflow-visible">
              {meteogramData.map((d) => (
                <div key={`wd-${d.id}`} style={{ width: `${ITEM_WIDTH}px` }} className="shrink-0 flex items-center justify-center mt-1">
                  <div style={{ transform: `rotate(${d.windDir}deg)` }} className="text-blue-500">
                    <Navigation2 className="w-4 h-4 fill-blue-500 stroke-blue-500" />
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