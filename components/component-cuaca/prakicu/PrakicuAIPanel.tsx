"use client";

import React, { useState, useEffect } from "react";
import { Bot, Loader2, RefreshCw, X, Volume2, VolumeX, MapIcon, Share2 } from "lucide-react";

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  meteogramData: any[];
  selectedLocation: { id: string; name: string; type: string };
  isFetchingSub?: boolean;
}

export default function PrakicuAIPanel({ isOpen, onClose, meteogramData, selectedLocation, isFetchingSub = false }: AIPanelProps) {
  const [aiSummary, setAiSummary] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => { setAiSummary(""); }, [selectedLocation.id]);

  useEffect(() => {
    if (!isOpen) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    if (isOpen && !aiSummary && !isAiLoading && !isFetchingSub && meteogramData.length > 0) {
      const timer = setTimeout(() => { handleAskAI(); }, 500);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isFetchingSub, selectedLocation.id, aiSummary, isAiLoading, meteogramData.length]); 

  const handleAskAI = async () => {
    if (meteogramData.length === 0) return;
    setIsAiLoading(true);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    try {
      const dataForAI = meteogramData.slice(0, 8).map(d => ({ waktu: d.time, suhu: d.temp, hujan: d.rain, kecepatanAngin: d.windSpeed }));
      const response = await fetch('/api/cuaca-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationName: selectedLocation.name, level: selectedLocation.type, weatherData: dataForAI })
      });
      const result = await response.json();
      if (result.summary) setAiSummary(result.summary);
    } catch (error) {
      console.error("AI Error");
    } finally { setIsAiLoading(false); }
  };

  const handleShareWA = () => {
    if (!aiSummary) return;
    const text = `*PRAKIRAAN CUACA BMKG - ${selectedLocation.name.toUpperCase()}*\n\n${aiSummary}\n\n_Sumber: BMKG APT Pranoto Samarinda_\n_Cek selengkapnya di: ${window.location.href}_`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(aiSummary.replace(/°C/gi, " derajat Celcius"));
      utterance.lang = 'id-ID';
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* HEADER JENDELA */}
        <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            <h3 className="font-bold text-xs tracking-wide">Asisten AI BMKG</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* KONTEN JENDELA */}
        <div className="p-4 md:p-5 bg-gradient-to-br from-indigo-50/30 to-white min-h-[180px]">
          <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 truncate pr-2">
              <MapIcon className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{selectedLocation.name}</span>
            </span>
            
            {/* DERETAN TOMBOL KENDALI (SELALU MUNCUL, WARNA DINAMIS) */}
            {/* DERETAN TOMBOL KENDALI (SEJAJAR HORIZONTAL) */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* 1. Tombol WhatsApp (Hijau) */}
              <button 
                onClick={handleShareWA} 
                disabled={!aiSummary || isAiLoading || isFetchingSub}
                title="Bagikan ke WhatsApp" 
                className="p-1.5 rounded-md transition-colors disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center justify-center"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* 2. Tombol Suara AI (Biru / Kuning) */}
              <button 
                onClick={toggleSpeech} 
                disabled={!aiSummary || isAiLoading || isFetchingSub}
                title="Putar Suara AI"
                className={`p-1.5 rounded-md transition-colors disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center ${isSpeaking ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* 3. Tombol Refresh (Biru) */}
              <button 
                onClick={handleAskAI} 
                disabled={isAiLoading || isFetchingSub || meteogramData.length === 0} 
                title="Muat Ulang Laporan"
                className="p-1.5 rounded-md transition-colors disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed bg-indigo-100 text-indigo-700 hover:bg-indigo-200 flex items-center justify-center"
              >
                <RefreshCw className={`w-4 h-4 ${isAiLoading || isFetchingSub ? 'animate-spin' : ''}`} />
              </button>

            </div>
          </h4>

          {/* STATUS LOADING / HASIL */}
          {isFetchingSub ? (
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
              <p className="text-[10px] font-bold text-indigo-500 animate-pulse">Menghubungkan ke {selectedLocation.name}...</p>
            </div>
          ) : meteogramData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                 <MapIcon className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-xs font-bold text-slate-600">Data Belum Tersedia</p>
            </div>
          ) : isAiLoading ? (
            <div className="flex flex-col items-center justify-center py-4 gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center animate-pulse">
                  <Bot className="w-5 h-5 text-indigo-600" />
                </div>
                <Loader2 className="w-4 h-4 text-indigo-500 animate-spin absolute -bottom-1 -right-1" />
              </div>
              <p className="text-[10px] font-bold text-indigo-400 animate-pulse">Sedang menganalisis...</p>
            </div>
          ) : (
            <div className="text-[13px] text-slate-700 leading-relaxed font-medium whitespace-pre-line max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
              {aiSummary || "Klik tombol refresh untuk memulai analisis."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}