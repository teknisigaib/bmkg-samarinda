import React from 'react';
import { HAZARD_COLORS, RADAR_DBZ_COLORS, RADAR_DBZ_LABELS, SATELLITE_IR_COLORS, SATELLITE_IR_LABELS } from "@/lib/bmkg/aviation-utils";

interface LegendProps {
    className?: string;
}


// --- 1. RADAR LEGEND (NEW DISCRETE STYLE) ---
export const RadarLegend = ({ className }: LegendProps) => {
    return (
        <div className={`p-2 rounded-lg font-sans transition-all ${className || "bg-slate-900/80 backdrop-blur-md border border-slate-700 shadow-lg mb-2"}`}>
            {/* Judul kecil (Opsional, atau bisa dihapus jika ingin persis gambar bar saja) */}
            {/* <div className="text-[10px] font-bold text-slate-300 mb-1 uppercase tracking-wider">Reflectivity</div> */}

            <div className="flex items-center gap-2">
                {/* Container Bar & Labels */}
                <div className="flex-1">
                    
                    {/* Color Segments */}
                    <div className="flex w-full h-3 rounded-full overflow-hidden border border-white/10">
                        {RADAR_DBZ_COLORS.map((color, idx) => (
                            <div 
                                key={idx} 
                                style={{ backgroundColor: color }} 
                                className="flex-1 h-full"
                                title={`${RADAR_DBZ_LABELS[idx]} dBZ`} 
                            />
                        ))}
                    </div>

                    {/* Numeric Labels */}
                    <div className="flex justify-between w-full mt-0.5 px-[1px]">
                        {RADAR_DBZ_LABELS.map((val, idx) => (
                            <span 
                                key={idx} 
                                className="text-[9px] text-white font-mono font-bold leading-none flex justify-center w-full text-center"
                                style={{ width: `${100 / RADAR_DBZ_LABELS.length}%` }} 
                            >
                                {val}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Satuan di Kanan */}
                <span className="text-xs font-bold text-white mb-3">dbz</span>
            </div>
        </div>
    );
};

// --- 2. SATELLITE LEGEND (NEW DISCRETE STYLE) ---
export const SatelliteLegend = ({ className }: LegendProps) => {
    return (
        <div className={`p-2 rounded-lg font-sans transition-all ${className || "bg-slate-900/80 backdrop-blur-md border border-slate-700 shadow-lg mb-2"}`}>
            {/* Opsional: Judul Kecil */}
            {/* <div className="text-[10px] font-bold text-slate-300 mb-1 uppercase tracking-wider">Cloud Top Temp (°C)</div> */}

            <div className="flex items-center gap-2">
                <div className="flex-1">
                    
                    {/* Color Segments */}
                    <div className="flex w-full h-3 rounded-full overflow-hidden border border-white/10">
                        {SATELLITE_IR_COLORS.map((color, idx) => (
                            <div 
                                key={idx} 
                                style={{ backgroundColor: color }} 
                                className="flex-1 h-full"
                                title={`${SATELLITE_IR_LABELS[idx]} °C`} 
                            />
                        ))}
                    </div>

                    {/* Numeric Labels */}
                    <div className="flex justify-between w-full mt-0.5 px-[1px]">
                        {SATELLITE_IR_LABELS.map((val, idx) => (
                            <span 
                                key={idx} 
                                className="text-[9px] text-white font-mono font-bold leading-none flex justify-center w-full text-center"
                                style={{ width: `${100 / SATELLITE_IR_LABELS.length}%` }} 
                            >
                                {val}
                            </span>
                        ))}
                    </div>
                </div>
                
                {/* Satuan di Kanan */}
                <span className="text-xs font-bold text-white mb-3">°C</span>
            </div>
        </div>
    );
};

// --- 3. SIGMET LEGEND (NEW - CATEGORICAL) ---
export const SigmetLegend = ({ className }: LegendProps) => {
    // List bahaya utama yang ingin ditampilkan
    const hazards = [
        { code: 'TS', label: 'Storm' },
        { code: 'TURB', label: 'Turbulence' },
        { code: 'ICE', label: 'Icing' },
        { code: 'VA', label: 'Volcanic Ash' },
        { code: 'TC', label: 'Cyclone' },
    ];

    return (
        <div className={`p-2 rounded-lg font-sans transition-all ${className}`}>
            <div className="text-[10px] font-bold text-slate-300 mb-2 uppercase tracking-wider">Hazard Types</div>
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
                {hazards.map((h) => (
                    <div key={h.code} className="flex items-center gap-2">
                        <span 
                            className="w-2.5 h-2.5 rounded-sm shadow-sm border border-white/10" 
                            style={{ backgroundColor: HAZARD_COLORS[h.code] || '#94a3b8' }}
                        ></span>
                        <span className="text-[9px] text-slate-400 font-medium">{h.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};