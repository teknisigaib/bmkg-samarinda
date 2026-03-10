"use client";

import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { TimeFrame } from "@/components/hooks/useTimeMachine";

interface Props {
  frames: TimeFrame[];
  currentIndex: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onJumpToLive: () => void;
  onIndexChange: (index: number) => void;
}

export default function TimeControlPanel({ 
  frames, currentIndex, isPlaying, onTogglePlay, onJumpToLive, onIndexChange 
}: Props) {
  
  if (frames.length === 0) return null;

  const currentFrame = frames[currentIndex];
  // Pastikan currentFrame ada untuk mencegah crash
  if (!currentFrame) return null;

  const isLive = currentIndex === frames.length - 1;

  // Handler Slider
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onIndexChange(parseInt(e.target.value));
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[2000] w-auto max-w-[95%]">
      
      {/* CAPSULE CONTAINER: Lebih Ramping (py-2, px-3) */}
      <div className="bg-neutral-900/95 border border-neutral-700 rounded-xl px-3 py-2 shadow-xl flex items-center gap-3">
        
        {/* 1. PLAY BUTTON (Kecil: w-8 h-8) */}
        <button 
            onClick={onTogglePlay}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors shadow-lg active:scale-95"
        >
            {isPlaying ? <Pause size={14} fill="black" /> : <Play size={14} fill="black" className="ml-0.5"/>}
        </button>

        {/* 2. TIMELINE INFO & SLIDER */}
        <div className="flex flex-col justify-center gap-0.5 w-36 md:w-48">
            
            {/* Info Baris Atas: Waktu & Tanggal */}
            <div className="flex justify-between items-baseline px-0.5 leading-none">
                <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-mono font-bold text-white">{currentFrame.label}</span>
                    <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">{currentFrame.dateLabel}</span>
                </div>
                
                {/* Indikator Live (Teks Saja) */}
                <button 
                    onClick={onJumpToLive}
                    className={`text-[9px] font-bold tracking-wider transition-colors flex items-center gap-1
                    ${isLive ? 'text-rose-500 cursor-default' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                    <div className={`w-1.5 h-1.5 rounded-full bg-current ${isLive ? 'animate-pulse' : ''}`}></div>
                    LIVE
                </button>
            </div>

            {/* Slider Compact */}
            <div className="relative h-3 flex items-center group">
                {/* Track */}
                <div className="absolute w-full h-1 bg-neutral-700 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-neutral-400 transition-all duration-300 ease-linear"
                        style={{ width: `${(currentIndex / (frames.length - 1)) * 100}%` }}
                    />
                </div>

                {/* Input (Invisible) */}
                <input 
                    type="range" 
                    min={0} 
                    max={frames.length - 1} 
                    value={currentIndex}
                    onChange={handleSliderChange}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                />

                {/* Thumb (Kecil: w-2.5 h-2.5) */}
                <div 
                    className="absolute w-2.5 h-2.5 bg-white rounded-full shadow border border-neutral-400 pointer-events-none transition-all duration-300 ease-linear"
                    style={{ left: `${(currentIndex / (frames.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}
                />
            </div>
        </div>

        {/* 3. STEP CONTROLS (Opsional: Sangat Kecil) */}
        <div className="hidden sm:flex items-center gap-0.5 border-l border-neutral-700 pl-2">
             <button 
                onClick={() => onIndexChange(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="p-1 text-neutral-500 hover:text-white disabled:opacity-20 transition-colors"
            >
                <SkipBack size={14} />
            </button>
            <button 
                onClick={() => onIndexChange(Math.min(frames.length - 1, currentIndex + 1))}
                disabled={isLive}
                className="p-1 text-neutral-500 hover:text-white disabled:opacity-20 transition-colors"
            >
                <SkipForward size={14} />
            </button>
        </div>

      </div>
    </div>
  );
}