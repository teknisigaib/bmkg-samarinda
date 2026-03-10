"use client";

import { X, AlertTriangle, Clock, ArrowUp, Navigation, Activity, FileText, ArrowDown } from "lucide-react";

export interface SigmetProperties {
  hazard: string;
  qualifier?: string; // <--- Kita akan pakai ini
  firId: string;
  firName: string;
  seriesId: string;
  validTimeFrom: string;
  validTimeTo: string;
  base?: number;
  top?: number;
  dir?: string;
  spd?: string;
  chng?: string; 
  rawSigmet: string;
}

interface Props {
  data: SigmetProperties | null;
  onClose: () => void;
}

const getHazardInfo = (code: string) => {
  const map: Record<string, { label: string, color: string }> = {
    TS: { label: 'THUNDERSTORM', color: 'bg-purple-600' },
    TURB: { label: 'TURBULENCE', color: 'bg-green-600' },
    ICE: { label: 'ICING', color: 'bg-cyan-600' },
    VA: { label: 'VOLCANIC ASH', color: 'bg-red-600' },
    MTW: { label: 'MOUNTAIN WAVE', color: 'bg-pink-600' },
    TC: { label: 'TROPICAL CYCLONE', color: 'bg-yellow-600' },
  };
  return map[code] || { label: code, color: 'bg-slate-600' };
};

// Helper untuk Qualifier (EMBD, OBSC, FRQ, SQL)
const getQualifierLabel = (code?: string) => {
    if (!code) return null;
    const map: Record<string, string> = {
        EMBD: 'EMBEDDED',
        OBSC: 'OBSCURED',
        FRQ: 'FREQUENT',
        SQL: 'SQUALL LINE',
        HVY: 'HEAVY',
        SEV: 'SEVERE',
        ISOL: 'ISOLATED'
    };
    return map[code] || code;
};

export default function SigmetDetailPanel({ data, onClose }: Props) {
  const isOpen = !!data;
  const hazardInfo = data ? getHazardInfo(data.hazard) : { label: '', color: '' };
  const qualifierLabel = data ? getQualifierLabel(data.qualifier) : null;

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' UTC';
  };

  return (
    <div 
      className={`
        absolute top-0 right-0 bottom-0 w-full md:w-[400px] z-[2050]
        bg-white/95 backdrop-blur-xl border-l border-slate-200 shadow-2xl
        transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      {data && (
        <>
          {/* --- HEADER --- */}
          <div className="p-6 border-b border-slate-100 bg-white">
            <div className="flex justify-between items-start mb-4">
               <div className="flex gap-2">
                   {/* 1. BADGE HAZARD UTAMA */}
                   <div className={`px-3 py-1 rounded text-xs font-bold text-white tracking-widest ${hazardInfo.color}`}>
                      {hazardInfo.label}
                   </div>
                   
                   {/* 2. BADGE QUALIFIER (BARU) - Tampil jika ada data qualifier */}
                   {qualifierLabel && (
                       <div className="px-3 py-1 rounded text-xs font-bold bg-slate-800 text-white tracking-widest border border-slate-600">
                          {qualifierLabel}
                       </div>
                   )}
               </div>

               <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-slate-800">
                <AlertTriangle size={24} className="text-rose-500" />
                <h2 className="text-2xl font-black tracking-tight">SIGMET {data.seriesId}</h2>
            </div>
            <p className="text-sm font-medium text-slate-500 mt-1">{data.firName} ({data.firId})</p>
          </div>

          {/* --- CONTENT --- */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-slate-50/50">
            
            <div className="grid grid-cols-2 gap-4">
                {/* VALIDITAS */}
                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
                        <Clock size={12} /> Validitas
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">From:</span>
                            <span className="font-mono font-bold text-slate-800">{formatTime(data.validTimeFrom)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">To:</span>
                            <span className="font-mono font-bold text-slate-800">{formatTime(data.validTimeTo)}</span>
                        </div>
                    </div>
                </div>

                {/* FLIGHT LEVEL (UPDATED) */}
                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
                        <ArrowUp size={12} /> Flight Level
                    </div>
                    
                    {/* Top Level */}
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-800">
                            {data.top ? `FL${data.top/100}` : 'xxx'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">TOP</span>
                    </div>

                    {/* Base Level (Conditional Render) */}
                    <div className="text-xs text-slate-500 border-t border-slate-100 pt-1 mt-1 flex justify-between items-center">
                        <span>Base:</span>
                        <span className="font-bold text-slate-700">
                            {data.base === 0 ? 'SFC (Surface)' : data.base ? `FL${data.base/100}` : '-'}
                        </span>
                    </div>
                </div>
            </div>

            {/* MOVEMENT & INTENSITY */}
            <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-1">
                        <Navigation size={12} /> Movement
                    </div>
                    <div className="font-bold text-slate-800 text-lg">
                        {data.dir ? data.dir : 'STNR'} 
                        {data.spd && data.spd !== '0' && <span className="text-slate-500 text-sm ml-1">@ {data.spd}kt</span>}
                    </div>
                </div>
                <div className="h-10 w-px bg-slate-100 mx-4"></div>
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-1">
                        <Activity size={12} /> Intensity
                    </div>
                    <div className="font-bold text-slate-800 text-lg">
                        {data.chng === 'NC' ? 'No Change' : 
                         data.chng === 'INTSF' ? 'Intensifying' : 
                         data.chng === 'WKN' ? 'Weakening' : data.chng || '-'}
                    </div>
                </div>
            </div>

            {/* RAW MESSAGE */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <FileText size={12} /> Raw Message
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed shadow-inner">
                    {data.rawSigmet}
                </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}