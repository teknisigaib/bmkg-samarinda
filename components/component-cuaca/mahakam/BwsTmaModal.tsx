"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, MapPin, Waves, CalendarClock, Loader2, AlertCircle, Droplets } from "lucide-react";

interface BwsTmaModalProps {
  station: { name: string; lat: number; lng: number };
  onClose: () => void;
}

export default function BwsTmaModal({ station, onClose }: BwsTmaModalProps) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setErrorMsg("");
        
        // Panggil API Proxy Internal
        const res = await fetch("/api/duga-air");
        if (!res.ok) throw new Error("Gagal terhubung ke server internal.");
        
        const json = await res.json();
        let foundStation = null;

        for (const wsKey in json) {
          const stationsArray = json[wsKey];
          const match = stationsArray.find((s: any) => 
            s.nama?.trim().toLowerCase() === station.name.trim().toLowerCase()
          );
          
          if (match) {
            foundStation = match;
            break;
          }
        }

        if (foundStation) {
          setData(foundStation);
        } else {
          setErrorMsg("Data detail untuk stasiun ini belum tersedia di server.");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Terjadi kesalahan saat menarik data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [station.name]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  const renderTmaValue = (val: any) => {
    if (val === null || val === undefined || val === false) return "-";
    return val;
  };

  return (
    <div className="absolute inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-300">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      
      <div className="relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-white shadow-2xl z-10 flex flex-col animate-in zoom-in-95 duration-300">
        
        <div className="bg-sky-500 p-4 flex justify-between items-start sm:items-center">
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

        <div className="p-5 flex flex-col items-center">
          <h3 className="text-[13px] font-black text-slate-800 mb-4 leading-snug text-center px-2">
            {station.name}
          </h3>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
              <span className="text-xs font-semibold text-slate-500 animate-pulse">Menarik data TMA...</span>
            </div>
          ) : errorMsg ? (
            <div className="flex flex-col items-center text-center py-6 px-4 bg-red-50 rounded-xl border border-red-100 mb-4 w-full">
              <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
              <p className="text-[11px] font-medium text-red-600">{errorMsg}</p>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <CalendarClock className="w-3 h-3" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Update</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 pl-4">
                    {formatDate(data.tanggal)}
                  </span>
                </div>
                
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Waves className="w-3 h-3" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Sungai</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 pl-4 truncate">
                    {data.sungai || "-"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 px-1">
                   <Droplets className="w-3.5 h-3.5 text-sky-500" />
                   <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Tinggi Muka Air (TMA)</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white border border-sky-100 shadow-sm p-2 rounded-xl flex flex-col items-center justify-center text-center">
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">07:00</span>
                     <span className="text-xl font-black text-sky-600 font-mono tracking-tighter">
                        {renderTmaValue(data.tma_07)}
                     </span>
                     <span className="text-[9px] font-semibold text-sky-400">Meter</span>
                  </div>
                  
                  <div className="bg-white border border-sky-100 shadow-sm p-2 rounded-xl flex flex-col items-center justify-center text-center">
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">12:00</span>
                     <span className="text-xl font-black text-sky-600 font-mono tracking-tighter">
                        {renderTmaValue(data.tma_12)}
                     </span>
                     <span className="text-[9px] font-semibold text-sky-400">Meter</span>
                  </div>

                  <div className="bg-white border border-sky-100 shadow-sm p-2 rounded-xl flex flex-col items-center justify-center text-center">
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">17:00</span>
                     <span className="text-xl font-black text-sky-600 font-mono tracking-tighter">
                        {renderTmaValue(data.tma_17)}
                     </span>
                     <span className="text-[9px] font-semibold text-sky-400">Meter</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          <div className="w-full mt-4 bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between shadow-sm">
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