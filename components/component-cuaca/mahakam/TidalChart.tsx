"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Waves, ArrowUp, ArrowDown, Info, MapPin, Clock } from "lucide-react";

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
        // Multiplier 4 agar padat
        const chartWidth = Math.max(800, data.length * 4);
        const targetX = (targetIndex / (data.length - 1)) * chartWidth;
        const clientWidth = containerRef.current.clientWidth;
        containerRef.current.scrollLeft = targetX - (clientWidth / 2);
    }
  }, [data]);

  if (!data || data.length === 0) {
    return (
        <div className="w-full h-32 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 text-sm">
            Data tidak tersedia.
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
  
  // Responsive Height Logic (Simulasi di CSS nanti)
  const chartHeight = 220; // Base height calculation
  const getY = (height: number) => {
    const range = maxVal - minVal || 1; 
    // Margin atas bawah lebih ketat agar tidak buang space
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
    // Extend ke bawah untuk gradient
    d += ` V ${chartHeight + 50} H 0 Z`; 
    return d;
  }, [data, maxVal, minVal, chartWidth, datum]);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      
      {/* HEADER: RESPONSIF (MOBILE PADAT, DESKTOP RAPI) */}
      <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        
        {/* BAGIAN KIRI: ICON & JUDUL */}
        <div className="flex items-start gap-3 md:items-center">
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-base md:text-lg leading-tight truncate">
                    Pasang Surut Sungai Mahakam
                </h3>
                
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1">
                    <div className="flex items-center gap-1 text-[11px] md:text-xs text-slate-500 font-medium truncate">
                        <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                        <span className="truncate">{locationName}</span>
                    </div>
                    {/* Badge WITA */}
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 shrink-0">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>WITA (UTC+8)</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-row items-center justify-between md:justify-end gap-3 w-full md:w-auto mt-2 md:mt-0">
            
            {/* SWITCHER */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
                <button onClick={() => setDatum('LAT')} className={`px-3 py-1 md:px-4 md:py-1.5 rounded-md text-[10px] md:text-xs font-bold transition-all ${datum === 'LAT' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}>LAT</button>
                <button onClick={() => setDatum('MSL')} className={`px-3 py-1 md:px-4 md:py-1.5 rounded-md text-[10px] md:text-xs font-bold transition-all ${datum === 'MSL' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}>MSL</button>
            </div>
            
            {/* STATS */}
            <div className="flex gap-3 md:gap-4 text-[10px] md:text-xs font-medium bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col items-end">
                    <span className="text-slate-400 flex items-center gap-1 uppercase tracking-wider text-[9px] md:text-[10px]">Maks <ArrowUp className="w-2.5 h-2.5 text-red-500" /></span>
                    <span className="text-slate-800 font-bold text-sm md:text-base">{highestPoint ? getDataHeight(highestPoint).toFixed(2) : '-'}m</span>
                </div>
                <div className="w-px h-auto bg-slate-200"></div>
                <div className="flex flex-col items-end">
                    <span className="text-slate-400 flex items-center gap-1 uppercase tracking-wider text-[9px] md:text-[10px]">Min <ArrowDown className="w-2.5 h-2.5 text-emerald-500" /></span>
                    <span className="text-slate-800 font-bold text-sm md:text-base">{lowestPoint ? getDataHeight(lowestPoint).toFixed(2) : '-'}m</span>
                </div>
            </div>

        </div>
      </div>

      <div ref={containerRef} className="relative w-full overflow-x-auto custom-scrollbar bg-gradient-to-b from-white to-slate-50 scroll-smooth h-[220px]">
         <div style={{ width: chartWidth, height: '200px' }} className="relative">
            <svg width={chartWidth} height="200" className="overflow-visible">
                <defs>
                    <linearGradient id="waterGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {datum === 'MSL' && <line x1="0" y1={getY(0)} x2={chartWidth} y2={getY(0)} stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />}

                {[0, 1, 2, 3].map((line, i) => {
                    const yPos = 30 + (i * 40); 
                    return <line key={i} x1="0" y1={yPos} x2={chartWidth} y2={yPos} stroke="#e2e8f0" strokeWidth="1" />;
                })}

                <path d={pathData} fill="url(#waterGradient)" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" className="transition-all duration-500" />

                {nowIndex !== -1 && (
                    <g className="animate-in fade-in duration-1000 z-50">
                        <line x1={getX(nowIndex)} y1="30" x2={getX(nowIndex)} y2="200" stroke="#2563eb" strokeWidth="2" strokeDasharray="4 2" />
                        <rect x={getX(nowIndex) - 35} y="0" width="70" height="30" rx="6" fill="#2563eb" className="shadow-sm" />
                        <text x={getX(nowIndex)} y="10" textAnchor="middle" className="text-[8px] font-bold fill-blue-100 uppercase tracking-wider">SEKARANG</text>
                        <text x={getX(nowIndex)} y="23" textAnchor="middle" className="text-[11px] font-bold fill-white">{getDataHeight(data[nowIndex]).toFixed(2)} m</text>
                        <circle cx={getX(nowIndex)} cy={getY(getDataHeight(data[nowIndex]))} r={5} fill="#2563eb" stroke="white" strokeWidth="2" />
                    </g>
                )}

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
                        <g key={i} className="group">
                            <rect x={cx - 3} y={0} width="6" height="200" fill="transparent" className="cursor-crosshair" />
                            <line x1={cx} y1={cy} x2={cx} y2="200" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            <circle cx={cx} cy={cy} r={isLocalHigh || isLocalLow ? 3 : 2} className={`transition-all group-hover:r-4 ${isLocalHigh || isLocalLow ? 'fill-white stroke-blue-600 stroke-2' : 'fill-blue-400 opacity-0 group-hover:opacity-100'}`} />
                            {isLocalHigh && (
                                <g>
                                    <text x={cx} y={cy - 12} textAnchor="middle" className="text-[10px] font-bold fill-red-600 select-none drop-shadow-sm">{val.toFixed(2)}</text>
                                    
                                </g>
                            )}
                            {isLocalLow && (
                                <g>
                                    <text x={cx} y={cy + 18} textAnchor="middle" className="text-[10px] font-bold fill-emerald-600 select-none drop-shadow-sm">{val.toFixed(2)}</text>
                                    
                                </g>
                            )}
                            {showLabel && !isLocalLow && <text x={cx} y="190" textAnchor="middle" className="fill-slate-400 text-[10px] font-medium">{d.label}</text>}
                            {showDate && (
                                <g>
                                    <line x1={cx} y1="0" x2={cx} y2="200" stroke="#e2e8f0" strokeWidth="1.5" />
                                    <rect x={cx + 4} y="5" width="50" height="18" rx="4" fill="#f1f5f9" />
                                    <text x={cx + 29} y="17" textAnchor="middle" className="fill-slate-600 text-[10px] font-bold uppercase tracking-wider">{d.dateLabel}</text>
                                </g>
                            )}
                            <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                <rect x={cx > chartWidth - 100 ? cx - 70 : cx - 30} y={cy - 45} width="65" height="38" rx="6" fill="#1e293b" />
                                <text x={cx > chartWidth - 100 ? cx - 38 : cx + 2} y={cy - 28} textAnchor="middle" fill="white" className="text-[11px] font-bold">{val.toFixed(2)} m</text>
                                <text x={cx > chartWidth - 100 ? cx - 38 : cx + 2} y={cy - 16} textAnchor="middle" fill="#94a3b8" className="text-[9px]">{datum}</text>
                            </g>
                        </g>
                    );
                })}
            </svg>
        </div>
      </div>
      
      {/* FOOTER */}
      <div className="bg-slate-50 p-3 md:p-4 border-t border-slate-200">
        <div className="flex items-start gap-2 md:gap-3">
            <Info className="w-4 h-4 md:w-5 md:h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-[10px] md:text-xs text-slate-600 space-y-0.5">
                <p>
                    <span className="font-bold text-slate-700">LAT:</span> Kedalaman dari surut terendah (navigasi).
                </p>
                <p>
                    <span className="font-bold text-slate-700">MSL:</span> Relatif terhadap rata-rata muka laut.
                </p>
                <p className="text-slate-400 italic pt-1">
                    *Waktu ditampilkan dalam zona waktu WITA.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}