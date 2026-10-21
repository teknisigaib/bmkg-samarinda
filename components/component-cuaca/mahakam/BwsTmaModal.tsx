"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, MapPin, Loader2, AlertCircle, Droplets, TrendingUp, CalendarClock } from "lucide-react";

interface BwsTmaModalProps {
  station: { name: string; lat: number; lng: number };
  onClose: () => void;
}

export default function BwsTmaModal({ station, onClose }: BwsTmaModalProps) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setErrorMsg("");
        
        const res = await fetch("https://tma.bmkgaptpranoto.com/api/water-levels");
        if (!res.ok) throw new Error("Gagal terhubung ke server TMA.");
        
        const json = await res.json();
        
        const match = json.data?.find((s: any) => 
          s.station?.trim().toLowerCase() === station.name.trim().toLowerCase()
        );

        if (match && match.data && match.data.length > 0) {
          const validHistory = match.data
            .filter((d: any) => d.record_date !== null)
            .slice(0, 7);
            
          if (validHistory.length > 0) {
            setData(validHistory);
          } else {
            setErrorMsg("Data histori TMA kosong untuk stasiun ini.");
          }
        } else {
          setErrorMsg("Data stasiun tidak ditemukan di server.");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Terjadi kesalahan saat menarik data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [station.name]);

  const formatFullDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  const formatShortDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  const latestValid = data.find(d => d.tma_07 !== null);

  const chartData = [...data].reverse();
  const validPoints = chartData.map((d, i) => ({ ...d, index: i })).filter(d => d.tma_07 !== null);
  const maxTma = Math.max(...chartData.map(d => d.tma_07 || 0), 1);

  const getX = (i: number) => (i / (chartData.length - 1 || 1)) * 100;
  // Map Y dari 15% (atas) hingga 85% (bawah) agar titik tidak terpotong di grafik yang lebih pendek
  const getY = (val: number) => 85 - ((val / maxTma) * 70);

  const linePath = validPoints.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.index)} ${getY(d.tma_07)}`).join(" ");

  return (
    <div className="absolute inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-300">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      
      <div className="relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-white shadow-2xl z-10 flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* HEADER (Desain Sebelumnya) */}
        <div className="bg-sky-500 p-3.5 flex justify-between items-start sm:items-center">
          <div className="flex items-start sm:items-center gap-3 text-white">
            <div className="bg-white p-1.5 rounded-lg shadow-sm flex items-center justify-center shrink-0">
              <Image src="/pupr.png" alt="PUPR" width={22} height={22} className="object-contain" />
            </div>
            <div className="flex flex-col">
              <h2 className="font-bold text-base leading-none mb-1">Pos Duga Air BWS</h2>
              <p className="text-[9px] sm:text-[10px] font-medium text-sky-100 uppercase tracking-widest leading-tight">
                Balai Wilayah Sungai<br className="sm:hidden" /> Kalimantan IV Samarinda
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 bg-white/20 text-white hover:bg-white/30 rounded-full transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY (Lebih Padat/Compact) */}
        <div className="p-4 flex flex-col">
          <h3 className="text-[13px] font-black text-slate-800 mb-3 leading-snug text-center px-2 uppercase tracking-wide">
            {station.name}
          </h3>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest animate-pulse">Menarik Data...</span>
            </div>
          ) : errorMsg ? (
            <div className="flex flex-col items-center text-center py-6 px-4 bg-red-50 rounded-xl border border-red-100 mb-2 w-full">
              <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
              <p className="text-[11px] font-medium text-red-600">{errorMsg}</p>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              
              {/* KARTU DATA TERBARU (Lebih Pipih) */}
              <div className="w-full bg-gradient-to-br from-sky-50 to-white border border-sky-100 p-3 rounded-xl shadow-sm flex items-center justify-between relative overflow-hidden group">
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <Droplets className="w-24 h-24 text-sky-900" />
                 </div>
                 
                 <div className="flex flex-col gap-1 relative z-10">
                    <div className="flex items-center gap-1.5 text-sky-600 bg-sky-100/50 w-max px-2 py-0.5 rounded-full border border-sky-200/50">
                       <CalendarClock className="w-3 h-3" />
                       <span className="text-[9px] font-bold uppercase tracking-widest">Update 07:00</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 ml-1">
                       {latestValid ? formatFullDate(latestValid.record_date) : "Belum Ada Data"}
                    </span>
                 </div>

                 <div className="flex items-baseline gap-0.5 relative z-10 pr-1">
                    <span className="text-3xl font-black text-sky-600 tracking-tight">
                       {latestValid ? latestValid.tma_07.toFixed(2) : "-"}
                    </span>
                    {latestValid && <span className="text-xs font-bold text-sky-400 ml-0.5">m</span>}
                 </div>
              </div>
              
              {/* GRAFIK 7 HARI (Tinggi Dikurangi) */}
              <div className="flex flex-col mt-1">
                <div className="flex items-center justify-between px-1 pb-1">
                   <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Tren 7 Hari Terakhir</span>
                   </div>
                </div>
                
                {/* Tinggi grafik dipangkas dari h-36 menjadi h-28 */}
                <div className="relative w-full h-28 mt-4 mb-4 border-b border-slate-100">
                  <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                     
                     {/* GARIS GRID VERTIKAL TIPIS */}
                     {chartData.map((_, i) => {
                        const x = getX(i);
                        return (
                          <line 
                            key={`grid-${i}`}
                            x1={`${x}`} y1="0" x2={`${x}`} y2="100" 
                            stroke="#f1f5f9" // slate-100
                            strokeWidth="0.5"
                            vectorEffect="non-scaling-stroke"
                          />
                        );
                     })}

                     {/* AREA GRADIEN */}
                     {validPoints.length > 1 && (
                       <>
                         <defs>
                           <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2"/>
                             <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0"/>
                           </linearGradient>
                         </defs>
                         <path
                           d={`${linePath} L ${getX(validPoints[validPoints.length-1].index)} 100 L ${getX(validPoints[0].index)} 100 Z`}
                           fill="url(#areaGrad)"
                           vectorEffect="non-scaling-stroke"
                         />
                       </>
                     )}
                     
                     {/* GARIS UTAMA */}
                     <path
                       d={linePath}
                       fill="none"
                       stroke="#0ea5e9"
                       strokeWidth="2"
                       vectorEffect="non-scaling-stroke"
                       strokeLinecap="round"
                       strokeLinejoin="round"
                     />
                  </svg>

                  {/* ELEMEN ABSOLUTE (Titik & Label) */}
                  {chartData.map((d, i) => {
                     const x = getX(i);
                     const isNull = d.tma_07 === null;
                     const y = isNull ? null : getY(d.tma_07);

                     return (
                        <React.Fragment key={i}>
                           {!isNull && (
                              <div 
                                className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 group" 
                                style={{ left: `${x}%`, top: `${y}%` }}
                              >
                                 <span className="text-[9px] font-bold text-slate-600 absolute bottom-3 bg-white/70 backdrop-blur-sm px-0.5 rounded">
                                    {d.tma_07.toFixed(1)}
                                 </span>
                                 <div className="w-2 h-2 bg-white border-[2px] border-sky-500 rounded-full z-10 shadow-sm relative"></div>
                              </div>
                           )}
                           
                           {/* Tanggal di Bawah Grid */}
                           <span 
                             className="absolute text-[8px] text-slate-400 font-semibold w-10 text-center -translate-x-1/2 top-full mt-1.5" 
                             style={{ left: `${x}%` }}
                           >
                              {formatShortDate(d.record_date)}
                           </span>
                        </React.Fragment>
                     );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* KOORDINAT FOOTER (Desain Sebelumnya) */}
          <div className="w-full mt-2 bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between shadow-sm">
             <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Koordinat</span>
             </div>
             <span className="text-[11px] text-slate-700 font-mono font-semibold">
                {station.lat.toFixed(4)}, {station.lng.toFixed(4)}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}