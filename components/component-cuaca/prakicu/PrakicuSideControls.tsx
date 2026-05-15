"use client";

import React from "react";
import { 
  CloudRain, Thermometer, Wind, RefreshCw, 
  Loader2, LocateFixed, Bot, Mic, MicOff, 
  AlertTriangle 
} from "lucide-react";

interface SideControlsProps {
  activeLayer: "icon" | "temp" | "wind"; // ✅ Kembali ke 3 layer dasar
  setActiveLayer: (layer: "icon" | "temp" | "wind") => void;
  showNowcast: boolean; // ✅ State baru untuk Toggle Overlay
  setShowNowcast: (val: boolean) => void;
  isLocating: boolean;
  handleFindLocation: () => void;
  handleResetMap: () => void;
  setIsAIOpen: (val: boolean) => void;
  voiceModalIsOpen: boolean;
  handleVoiceCommand: () => void;
}

export default function PrakicuSideControls({
  activeLayer, setActiveLayer, showNowcast, setShowNowcast, isLocating, handleFindLocation, handleResetMap, setIsAIOpen, voiceModalIsOpen, handleVoiceCommand
}: SideControlsProps) {
  return (
    <div className="absolute top-16 right-2 md:top-4 md:right-4 z-[39] bg-white/90 backdrop-blur-md p-1.5 md:p-2 rounded-2xl shadow-lg border border-white/50 flex flex-col gap-1.5">
      
      {/* --- LAYER DASAR (PILIH SALAH SATU) --- */}
      <div className="flex flex-col gap-1 pb-1.5 border-b border-slate-200/60">
        {[
          { id: "icon", icon: CloudRain, title: "Layer Cuaca" }, 
          { id: "temp", icon: Thermometer, title: "Layer Suhu" }, 
          { id: "wind", icon: Wind, title: "Layer Angin" }
        ].map((layer) => (
          <button 
            key={layer.id} 
            title={layer.title} 
            onClick={() => setActiveLayer(layer.id as any)} 
            className={`p-2 rounded-xl transition-all w-9 h-9 md:w-11 md:h-11 flex items-center justify-center ${activeLayer === layer.id ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"}`}
          >
            <layer.icon className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        ))}
      </div>

      {/* --- OVERLAY & TOOLS --- */}
      <div className="flex flex-col gap-1 pt-0.5">
        
        {/* 🔥 TOMBOL TOGGLE NOWCASTING (OVERLAY) */}
        <button 
          title="Tampilkan Peringatan Dini (Nowcasting)" 
          onClick={() => setShowNowcast(!showNowcast)} 
          className={`w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-all ${showNowcast ? 'bg-[#d9940b] text-white shadow-md animate-pulse' : 'bg-slate-50 text-slate-600 hover:bg-orange-50 hover:text-[#d9940b] border border-slate-200/60'}`}
        >
          <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <button title="Deteksi GPS" onClick={handleFindLocation} disabled={isLocating} className={`w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-all ${isLocating ? 'text-blue-400' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-blue-600 border border-slate-200/60'}`}>
          {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4 md:w-5 md:h-5" />}
        </button>
        
        <button title="Reset Map" onClick={handleResetMap} className="w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-blue-600 border border-slate-200/60 transition-all">
          <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <button title="Asisten AI" onClick={() => setIsAIOpen(true)} className="w-9 h-9 md:w-11 md:h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md flex items-center justify-center transition-all group">
          <Bot className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
        </button>
        
        <button title="Perintah Suara" onClick={handleVoiceCommand} className={`w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-all shadow-sm ${voiceModalIsOpen ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-500 border border-slate-200/60'}`}>
          {voiceModalIsOpen ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 md:w-5 md:h-5" />}
        </button>
      </div>
    </div>
  );
}