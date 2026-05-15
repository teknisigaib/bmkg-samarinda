"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { ArrowUp, ArrowDown, Info, Clock, Navigation } from "lucide-react";

export type TideData = {
  originalTime: string;
  label: string;
  dateLabel: string;
  heightLAT: number; 
  heightMSL: number; 
  isHigh: boolean;
  isLow: boolean;
};

interface TidalChartProps {
  data: TideData[];
  locationName?: string;
}

export default function TidalChart({ data, locationName = "Terminal Peti Kemas Palaran" }: TidalChartProps) {
  const [datum, setDatum] = useState<'LAT' | 'MSL'>('LAT');
  const [nowIndex, setNowIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- 1. AUTO SCROLL & CURRENT TIME ---
  useEffect(() => {
    if (!data || data.length === 0) return;

    const now = new Date().getTime();
    const foundIndex = data.findIndex(d => new Date(d.originalTime).getTime() > now);
    const targetIndex = foundIndex > 0 ? foundIndex - 1 : (foundIndex === 0 ? 0 : data.length - 1);
    
    setNowIndex(targetIndex);

    if (containerRef.current && targetIndex > 0) {
        const chartWidth = Math.max(800, data.length * 4);
        const targetX = (targetIndex / (data.length - 1)) * chartWidth;
        const clientWidth = containerRef.current.clientWidth;
        containerRef.current.scrollLeft = targetX - (clientWidth / 2);
    }
  }, [data]);

  if (!data || data.length === 0) {
    return (
        <div className="w-full h-32 bg-slate-50 rounded-[2rem] border border-slate-200 flex items-center justify-center text-slate-400 text-sm font-bold uppercase tracking-widest">
            Data Tidak Tersedia
        </div>
    );
  }

  const getDataHeight = (d: TideData) => (datum === 'LAT' ? d.heightLAT : d.heightMSL);

  const currentHeights = data.map(getDataHeight);
  const maxVal = Math.max(...currentHeights);
  const minVal = Math.min(...currentHeights);
  
  const highestPoint = data.find(d => getDataHeight(d) === maxVal);
  const lowestPoint = data.find(d => getDataHeight(d) === minVal);

  const markerStatus = useMemo(() => {
    const statuses = new Array(data.length).fill(null).map(() => ({ isLocalHigh: false, isLocalLow: false }));
    const windowSize = 10; 

    for (let i = 0; i < data.length; i++) {
        const currentVal = getDataHeight(data[i]);
        let isMax = true;
        let isMin = true;
        const start = Math.max(0, i - windowSize);
        const end = Math.min(data.length, i + windowSize + 1);

        for (let j = start; j < end; j++) {
            if (i === j) continue; 
            const neighborVal = getDataHeight(data[j]);
            if (neighborVal > currentVal) isMax = false;
            if (neighborVal < currentVal) isMin = false;
            if (neighborVal === currentVal && j < i) {
                isMax = false;
                isMin = false;
            }
        }
        if (isMax) statuses[i].isLocalHigh = true;
        if (isMin) statuses[i].isLocalLow = true;
    }
    return statuses;
  }, [data, datum]); 

  const chartWidth = Math.max(800, data.length * 4); 
  const getX = (index: number) => (index / (data.length - 1)) * chartWidth;
  
  const chartHeight = 220; 
  const getY = (height: number) => {
    const range = maxVal - minVal || 1; 
    return (chartHeight - 30) - ((height - minVal) / range) * (chartHeight - 60);
  };

  const pathData = useMemo(() => {
    let d = `M ${getX(0)} ${getY(getDataHeight(data[0]))}`;
    for (let i = 1; i < data.length; i++) {
      const x = getX(i);
      const y = getY(getDataHeight(data[i]));
      const prevX = getX(i - 1);
      const prevY = getY(getDataHeight(data[i - 1]));
      
      const cp1x = prevX + (x - prevX) / 2;
      const cp1y = prevY;
      const cp2x = prevX + (x - prevX) / 2;
      const cp2y = y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
    }
    d += ` V ${chartHeight + 50} H 0 Z`; 
    return d;
  }, [data, maxVal, minVal, chartWidth, datum]);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden transition-all flex flex-col relative">
      
      {/* --- HEADER: SIMETRIS & BERSIH --- */}
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between bg-white z-10 gap-4">
        
        {/* Spacer Kiri (Desktop) */}
        <div className="w-full md:w-64 flex justify-center md:justify-start">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button 
                    onClick={() => setDatum('LAT')} 
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all ${datum === 'LAT' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    LAT
                </button>
                <button 
                    onClick={() => setDatum('MSL')} 
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all ${datum === 'MSL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    MSL
                </button>
            </div>
        </div>

        {/* Tengah: Judul */}
        <div className="flex flex-col items-center text-center">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-1">
                Prakiraan Pasang Surut
            </h3>
            <h2 className="text-xl font-black text-slate-900 leading-none">
                {locationName}
            </h2>
            <div className="flex items-center gap-1 text-[10px] text-blue-600 font-bold mt-2 uppercase tracking-widest px-3 py-1 bg-blue-50 rounded-full border border-blue-100/50">
                <Clock className="w-3 h-3" />
                <span>Waktu Lokal (WITA)</span>
            </div>
        </div>

        {/* Kanan: Statistik Ekstrim */}
        <div className="w-full md:w-64 flex justify-center md:justify-end">
            <div className="flex gap-4 text-xs font-medium bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                <div className="flex flex-col items-end">
                    <span className="text-slate-400 flex items-center gap-1 uppercase tracking-widest text-[9px] font-bold">Maks <ArrowUp className="w-3 h-3 text-red-500" /></span>
                    <span className="text-slate-800 font-black text-sm">{highestPoint ? getDataHeight(highestPoint).toFixed(2) : '-'}m</span>
                </div>
                <div className="w-px h-auto bg-slate-200"></div>
                <div className="flex flex-col items-end">
                    <span className="text-slate-400 flex items-center gap-1 uppercase tracking-widest text-[9px] font-bold">Min <ArrowDown className="w-3 h-3 text-emerald-500" /></span>
                    <span className="text-slate-800 font-black text-sm">{lowestPoint ? getDataHeight(lowestPoint).toFixed(2) : '-'}m</span>
                </div>
            </div>
        </div>

      </div>

      {/* --- AREA GRAFIK --- */}
      <div ref={containerRef} className="relative w-full overflow-x-auto custom-scrollbar bg-slate-50/50 scroll-smooth h-[280px]">
         <div style={{ width: chartWidth, height: '240px' }} className="relative mt-4">
            <svg width={chartWidth} height="240" className="overflow-visible">
                <defs>
                    <linearGradient id="waterGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Garis Referensi MSL (Jika Mode MSL) */}
                {datum === 'MSL' && <line x1="0" y1={getY(0)} x2={chartWidth} y2={getY(0)} stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />}

                {/* Garis Horizontal Latar */}
                {[0, 1, 2, 3].map((line, i) => {
                    const yPos = 30 + (i * 45); 
                    return <line key={i} x1="0" y1={yPos} x2={chartWidth} y2={yPos} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 4" />;
                })}

                {/* Path Gelombang */}
                <path d={pathData} fill="url(#waterGradient)" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" className="transition-all duration-500" />

                {/* Marker Waktu Sekarang */}
                {nowIndex !== -1 && (
                    <g className="animate-in fade-in duration-1000 z-1000">
                        <line x1={getX(nowIndex)} y1="30" x2={getX(nowIndex)} y2="220" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4 2" />
                        <rect x={getX(nowIndex) - 35} y="0" width="70" height="28" rx="14" fill="#2563eb" className="shadow-sm" />
                        <text x={getX(nowIndex)} y="12" textAnchor="middle" className="text-[8px] font-bold fill-blue-100 uppercase tracking-wider">SEKARANG</text>
                        <text x={getX(nowIndex)} y="23" textAnchor="middle" className="text-[10px] font-bold fill-white">{getDataHeight(data[nowIndex]).toFixed(2)}m</text>
                        <circle cx={getX(nowIndex)} cy={getY(getDataHeight(data[nowIndex]))} r={5} fill="#2563eb" stroke="white" strokeWidth="2" />
                    </g>
                )}

                {/* Plot Data Points & Label */}
                {data.map((d, i) => {
                    const val = getDataHeight(d);
                    const cx = getX(i);
                    const cy = getY(val);
                    const isFullHour = d.label.endsWith(":00");
                    const hour = parseInt(d.label.split(":")[0]);
                    const showLabel = isFullHour && (hour % 4 === 0); 
                    const showDate = d.label === "00:00"; 
                    const { isLocalHigh, isLocalLow } = markerStatus[i];

                    return (
                        <g key={i} className="group cursor-crosshair">
                            {/* Area Interaksi */}
                            <rect x={cx - 5} y={0} width="10" height="220" fill="transparent" />
                            
                            {/* Garis Hover */}
                            <line x1={cx} y1={cy} x2={cx} y2="220" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            {/* Titik Marker */}
                            <circle cx={cx} cy={cy} r={isLocalHigh || isLocalLow ? 4 : 2} className={`transition-all ${isLocalHigh || isLocalLow ? 'fill-white stroke-blue-600 stroke-2' : 'fill-blue-400 opacity-0 group-hover:opacity-100'}`} />
                            
                            {/* Label Tinggi (Maks) */}
                            {isLocalHigh && (
                                <text x={cx} y={cy - 12} textAnchor="middle" className="text-[10px] font-bold fill-red-500 select-none drop-shadow-sm">{val.toFixed(2)}</text>
                            )}
                            
                            {/* Label Rendah (Min) */}
                            {isLocalLow && (
                                <text x={cx} y={cy + 18} textAnchor="middle" className="text-[10px] font-bold fill-emerald-600 select-none drop-shadow-sm">{val.toFixed(2)}</text>
                            )}
                            
                            {/* Label Jam Bawah */}
                            {showLabel && !isLocalLow && <text x={cx} y="210" textAnchor="middle" className="fill-slate-400 text-[9px] font-bold tracking-wider">{d.label}</text>}
                            
                            {/* Label Ganti Hari */}
                            {showDate && (
                                <g>
                                    <line x1={cx} y1="0" x2={cx} y2="220" stroke="#cbd5e1" strokeWidth="1" />
                                    <rect x={cx + 4} y="5" width="54" height="18" rx="9" fill="#f1f5f9" />
                                    <text x={cx + 31} y="17" textAnchor="middle" className="fill-slate-600 text-[9px] font-bold uppercase tracking-wider">{d.dateLabel}</text>
                                </g>
                            )}
                            
                            {/* Tooltip Hover */}
                            <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                <rect x={cx > chartWidth - 80 ? cx - 60 : cx - 30} y={cy - 40} width="60" height="34" rx="8" fill="#1e293b" />
                                <text x={cx > chartWidth - 80 ? cx - 30 : cx} y={cy - 24} textAnchor="middle" fill="white" className="text-[10px] font-bold">{val.toFixed(2)}m</text>
                                <text x={cx > chartWidth - 80 ? cx - 30 : cx} y={cy - 13} textAnchor="middle" fill="#94a3b8" className="text-[8px] uppercase tracking-widest">{d.label}</text>
                            </g>
                        </g>
                    );
                })}
            </svg>
         </div>
      </div>
      
      {/* --- FOOTER: KETERANGAN --- */}
      <div className="bg-white px-6 py-4 border-t border-slate-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Datum Referensi</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-[10px] text-slate-500 font-medium">
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-700">LAT:</span> 
                    <span>Lowest Astronomical Tide (Kedalaman navigasi aman).</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-700">MSL:</span> 
                    <span>Mean Sea Level (Relatif rata-rata muka laut).</span>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
}