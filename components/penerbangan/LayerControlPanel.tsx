"use client";

import { ReactNode } from "react";
import { 
  Map as MapIcon, CloudRain, Eye, 
  Satellite, Radar, Zap, Plane, AlertTriangle, Info // Tambah Info Icon
} from "lucide-react";

export type BaseMapType = 'dark' | 'light' | 'satellite_base';
export type OverlayType = 'himawari' | 'radar' | 'sigmet' | 'airports' | 'boundaries'; 

// --- DATA LEGEND SIGMET ---
const SIGMET_LEGEND_ITEMS = [
  { label: 'TS', color: 'bg-purple-500' },
  { label: 'TSGR', color: 'bg-purple-500' },
  { label: 'TURB', color: 'bg-green-500' },
  { label: 'LLWS', color: 'bg-green-500' },
  { label: 'MTW', color: 'bg-pink-500' },
  { label: 'ICE', color: 'bg-cyan-500' },
  { label: 'TC', color: 'bg-yellow-500' },
  { label: 'SS', color: 'bg-orange-500' },
  { label: 'DS', color: 'bg-orange-500' },
  { label: 'VA', color: 'bg-red-500' },
  { label: 'CLD', color: 'bg-blue-500' },
];

// --- WARNA BLOK HIMAWARI (Meniru gambar: Merah terang -> Oranye -> Kuning -> Hijau Muda -> Biru Muda -> Biru Tua) ---
const HIMAWARI_COLORS = [
    '#FF4D4D', '#FF6B6B', '#FFCC99', '#FFDAB9', '#FFB347', '#FF8C00', 
    '#EEDD82', '#BDB76B', '#9ACD32', '#7CFC00', '#32CD32', '#66CDAA', 
    '#20B2AA', '#00CED1', '#1E90FF', '#4169E1', '#0000CD', '#000080'
];

// --- WARNA BLOK RADAR (dBZ: Biru Muda -> Biru -> Hijau -> Kuning -> Merah -> Ungu) ---
const RADAR_COLORS = [
    '#00FFFF', '#00BFFF', '#0080FF', '#0040FF', '#00FF00', '#32CD32',
    '#228B22', '#006400', '#FFFF00', '#FFD700', '#FFA500', '#FF8C00',
    '#FF4500', '#FF0000', '#B22222', '#8B0000', '#FF00FF', '#8A2BE2'
];

interface Props {
  baseMap: BaseMapType;
  setBaseMap: (type: BaseMapType) => void;
  overlays: Record<OverlayType, boolean>;
  toggleOverlay: (type: OverlayType) => void;
  isOpen: boolean;
  himawariTime?: string;
  radarTime?: string;
}

function BaseMapGridItem({ active, onClick, label, icon }: any) {
    return (
        <button 
            onClick={onClick}
            className={`
                flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-md transition-all gap-1.5
                ${active 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-inner' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'}
            `}
        >
            {icon}
            <span className={`text-[9px] font-bold ${active ? 'text-blue-300' : ''}`}>
                {label}
            </span>
        </button>
    )
}

export default function LayerControlPanel({ 
  baseMap, setBaseMap, overlays, toggleOverlay, isOpen,
  himawariTime, radarTime
}: Props) {
  
  return (
    <div className={`
      absolute top-16 left-6 z-[2000] 
      transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 pointer-events-none'}
      max-h-[calc(100%-5rem)] 
      flex flex-col
    `}>
      
      <div 
        className="w-64 flex-1 bg-[#1a1c23]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl py-3 overflow-y-auto overflow-x-hidden"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 transparent' }}
      >
        
        {/* GROUP 1: BASE MAPS */}

        <div className="px-3">
            <h4 className="text-[9px] uppercase font-bold text-slate-500 mb-2 tracking-widest pl-1">
                Peta Dasar
            </h4>
            <div className="flex bg-[#23252d] p-1 rounded-lg border border-white/5">
                <BaseMapGridItem 
                    active={baseMap === 'dark'} 
                    onClick={() => setBaseMap('dark')} 
                    label="Dark" 
                    icon={<CloudRain size={14}/>} 
                />
                <BaseMapGridItem 
                    active={baseMap === 'satellite_base'} 
                    onClick={() => setBaseMap('satellite_base')} 
                    label="Satelit" 
                    icon={<Satellite size={14}/>} 
                />
                 <BaseMapGridItem 
                    active={baseMap === 'light'} 
                    onClick={() => setBaseMap('light')} 
                    label="Light" 
                    icon={<MapIcon size={14}/>} 
                />
            </div>
        </div>

        <div className="my-3 border-t border-white/5 mx-3"></div>

        {/* GROUP 2: LAYERS */}
        <div className="px-3">
            <h4 className="text-[9px] uppercase font-bold text-slate-500 mb-2 tracking-widest pl-1">
                Lapisan Data
            </h4>
            <div className="space-y-3">
                
                {/* 1. HIMAWARI */}
                <ToggleItem 
                    active={overlays.himawari} 
                    onClick={() => toggleOverlay('himawari')}
                    label="Satelit Himawari"
                    icon={<Eye size={12} />}
                    time={overlays.himawari ? himawariTime : undefined}
                    legend={overlays.himawari && (
                        <div className="mt-1 bg-[#23252d] rounded-lg p-2 border border-white/5">
                            <div className="flex items-center gap-2">
                                {/* Color Blocks */}
                                <div className="flex-1 flex h-2 rounded overflow-hidden">
                                    {HIMAWARI_COLORS.map((c, i) => (
                                        <div key={i} className="h-full flex-1" style={{ backgroundColor: c }}></div>
                                    ))}
                                </div>
                                {/* Info Icon */}
                                <Info size={12} className="text-slate-400" />
                            </div>
                            <div className="flex justify-between text-[9px] text-slate-300 mt-1.5 font-sans tracking-wide">
                                <span>173.15°C</span>
                                <span>287.15°C</span>
                            </div>
                        </div>
                    )}
                />

                {/* 2. RADAR */}
                <ToggleItem 
                    active={overlays.radar} 
                    onClick={() => toggleOverlay('radar')}
                    label="Radar Cuaca"
                    icon={<Radar size={12} />}
                    time={overlays.radar ? radarTime : undefined}
                    legend={overlays.radar && (
                        <div className="mt-1 bg-[#23252d] rounded-lg p-2 border border-white/5">
                            <div className="flex items-center gap-2">
                                {/* Color Blocks */}
                                <div className="flex-1 flex h-2 rounded overflow-hidden">
                                    {RADAR_COLORS.map((c, i) => (
                                        <div key={i} className="h-full flex-1" style={{ backgroundColor: c }}></div>
                                    ))}
                                </div>
                                {/* Info Icon */}
                                <Info size={12} className="text-slate-400" />
                            </div>
                            <div className="flex justify-between text-[9px] text-slate-300 mt-1.5 font-sans tracking-wide">
                                <span>5 dBZ</span>
                                <span>65 dBZ</span>
                            </div>
                        </div>
                    )}
                />

                {/* 3. SIGMET */}
                <ToggleItem 
                    active={overlays.sigmet} 
                    onClick={() => toggleOverlay('sigmet')}
                    label="SIGMET"
                    icon={<Zap size={12} />}
                    legend={overlays.sigmet && (
                        <div className="grid grid-cols-4 gap-1 mt-2">
                            {SIGMET_LEGEND_ITEMS.map((item) => (
                                <div key={item.label} className="bg-[#23252d] border border-white/5 rounded px-1.5 py-1 flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${item.color} shadow-sm`}></div>
                                    <span className="text-[8px] font-bold text-slate-300 leading-none">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                />

                {/* 4. BANDARA */}
                <ToggleItem 
                    active={overlays.airports} 
                    onClick={() => toggleOverlay('airports')}
                    label="Bandara"
                    icon={<Plane size={12} />}
                />

                {/* 5. BOUNDARIES */}
                <ToggleItem 
                    active={overlays.boundaries} 
                    onClick={() => toggleOverlay('boundaries')}
                    label="Batas Wilayah"
                    icon={<MapIcon size={12} />}
                />
            </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function ToggleItem({ 
    active, onClick, label, icon, time, legend 
}: { 
    active: boolean, onClick: () => void, label: string, icon: ReactNode, time?: string, legend?: ReactNode 
}) {
    const isOffline = time?.includes("OFFLINE");

    return (
        <div className="flex flex-col">
            {/* Main Toggle Row */}
            <div 
                onClick={onClick}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer hover:bg-white/5 transition-all group"
            >
                <div className="flex items-center gap-2.5">
                    <span className={`${active ? 'text-white' : 'text-slate-500'}`}>{icon}</span>
                    <span className={`text-[11px] font-medium ${active ? 'text-white' : 'text-slate-300 group-hover:text-slate-200'}`}>
                        {label}
                    </span>
                </div>
                
                {/* Switch iOS Style */}
                <div className={`relative w-7 h-4 rounded-full transition-colors duration-300 ${active ? 'bg-blue-500' : 'bg-white/10 border border-white/5'}`}>
                    <div className={`absolute top-[1.5px] left-[2px] w-[13px] h-[13px] rounded-full bg-white shadow-sm transition-transform duration-300 ${active ? 'translate-x-[11px]' : 'translate-x-0'}`}></div>
                </div>
            </div>

            {/* Info Area (Legend & Time) */}
            {(active && (time || legend)) && (
                <div className="px-2 pb-1 animate-in slide-in-from-top-1 duration-200">
                    <div className="pl-6 border-l border-white/10 ml-[5px] pt-1">
                        
                        {/* WAKTU UPDATE / OFFLINE INDICATOR */}
                        {time && (
                            <div className="flex items-center gap-1.5 mb-2">
                                {isOffline ? (
                                    <span className="flex items-center gap-1 text-[9px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                                        <AlertTriangle size={8} /> OFFLINE
                                    </span>
                                ) : (
                                    <p className="text-[9px] text-emerald-400 font-mono flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        {time}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* LEGEND VISUAL */}
                        {legend && (
                            <div className="pr-1 pb-1">
                                {legend}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}