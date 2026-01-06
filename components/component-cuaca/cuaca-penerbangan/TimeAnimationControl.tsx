import { Play, Pause } from "lucide-react";
import { formatDisplayTime } from "@/lib/bmkg/aviation-utils";
import { useMemo } from "react";

interface TimeControlProps {
    steps: Date[];
    currentIndex: number;
    isPlaying: boolean;
    onPlayToggle: () => void;
    onSeek: (index: number) => void;
    label: string;
    color?: string;
    className?: string; // Tambahkan ini agar bisa diatur layoutnya
}

export default function TimeAnimationControl({ steps, currentIndex, isPlaying, onPlayToggle, onSeek, label, className = "" }: TimeControlProps) {
    const currentTime = steps[currentIndex];
    const latestTime = steps[steps.length - 1];
    
    const percent = steps.length > 1 ? (currentIndex / (steps.length - 1)) * 100 : 0;

    // --- THEME CONFIG (Neon Lime - Infrared Style) ---
    const THEME = {
        accentBg: 'bg-[#155dfc]', 
        accentText: 'text-[#155dfc]',
        trackBg: 'bg-slate-700/50'
    };

    const formattedDateHeader = useMemo(() => {
        if (!latestTime) return "";
        return latestTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }, [latestTime]);

    // Interval tick marks
    const tickInterval = Math.max(1, Math.floor(steps.length / 5));

    return (
        // CARD CONTAINER: Rounded, Floating, Compact Padding
        <div className={`bg-slate-900/40 backdrop-blur-md border border-slate-700/50 p-3 rounded-2xl shadow-2xl font-sans animate-in zoom-in-95 duration-300 pointer-events-auto flex flex-col justify-center ${className}`}>
            
            {/* HEADER COMPACT (Title & Date) */}
            <div className="flex justify-between items-end mb-2 px-1">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${THEME.accentBg} shadow-[0_0_6px_currentColor] animate-pulse`}></span>
                    <span className="font-black text-[11px] uppercase tracking-widest text-slate-200 drop-shadow-md">
                        {label}
                    </span>
                </div>
                <div className="font-mono text-[10px] text-slate-400 font-medium">
                    {formattedDateHeader}
                </div>
            </div>

            <div className="flex items-center gap-3">
                
                {/* 1. PLAY BUTTON (Compact & Modern) */}
                <button 
                    onClick={onPlayToggle}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all border border-white/10 ${isPlaying ? 'bg-[#155dfc] text-white shadow-[0_0_10px_rgba(190,242,100,0.4)]' : 'bg-slate-800 hover:bg-slate-700 text-white'} shadow-sm`}
                >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                </button>

                {/* 2. SLIDER AREA */}
                <div className="flex-1 relative group h-6 flex items-center">
                    
                    {/* Floating Bubble (Muncul saat hover/drag atau aktif) */}
                    <div 
                        className={`absolute -top-7 -translate-x-1/2 z-30 ${THEME.accentBg} text-white text-[10px] font-black px-2 py-0.5 rounded shadow-lg whitespace-nowrap transition-all duration-150 ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                        style={{ left: `${percent}%` }}
                    >
                        {currentTime ? formatDisplayTime(currentTime) : "--:--"}
                        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 ${THEME.accentBg} rotate-45`}></div>
                    </div>

                    {/* Track Background */}
                    <div className={`absolute left-0 right-0 h-1.5 ${THEME.trackBg} rounded-full`}></div>
                    
                    {/* Active Track */}
                    <div 
                        className={`absolute left-0 h-1.5 rounded-full transition-all duration-75 ${THEME.accentBg}`} 
                        style={{ width: `${percent}%` }}
                    ></div>
                    
                    {/* Input Slider */}
                    <input 
                        type="range" 
                        min={0} 
                        max={steps.length - 1} 
                        value={currentIndex}
                        onChange={(e) => onSeek(parseInt(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-40"
                    />
                    
                    {/* Thumb (Bola) */}
                    <div 
                        className={`absolute w-3.5 h-3.5 bg-white rounded-full border-2 shadow-sm transition-transform pointer-events-none z-30 ${isPlaying ? 'scale-125' : 'group-hover:scale-125'}`}
                        style={{ left: `calc(${percent}% - 7px)` }} 
                    ></div>

                    {/* Ticks (Garis halus di bawah) */}
                    <div className="absolute top-2 left-0 right-0 h-4 w-full pointer-events-none">
                        {steps.map((step, idx) => {
                            if (idx % tickInterval !== 0 && idx !== steps.length - 1) return null;
                            const tickPercent = (idx / (steps.length - 1)) * 100;
                            return (
                                <div 
                                    key={idx} 
                                    className="absolute h-2 w-[2px] bg-white"
                                    style={{ left: `${tickPercent}%` }}
                                ></div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}