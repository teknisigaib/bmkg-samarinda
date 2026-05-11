"use client";

import React, { useState } from "react";
import { Mic, Loader2, MapIcon, RotateCcw, X } from "lucide-react";

export function useVoiceCommand(
  flatManualData: any[],
  setFlyToTarget: (target: any) => void,
  setSelectedLocation: (loc: any) => void,
  setIsAIOpen: (isOpen: boolean) => void
) {
  const [voiceModal, setVoiceModal] = useState<{isOpen: boolean, status: 'listening'|'processing'|'not-found', text: string}>({
    isOpen: false, status: 'listening', text: ''
  });

  const handleVoiceCommand = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser Anda tidak mendukung Voice Command.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = true; 
    recognition.continuous = false; 

    recognition.onstart = () => setVoiceModal({ isOpen: true, status: 'listening', text: '' });
    recognition.onend = () => setVoiceModal(prev => prev.status === 'listening' && !prev.text ? { ...prev, isOpen: false } : prev);

    recognition.onresult = async (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      
      const currentResult = event.results[event.results.length - 1];
      setVoiceModal(prev => ({ ...prev, text: currentTranscript }));

      if (!currentResult.isFinal) return;

      const finalTranscript = currentTranscript.toLowerCase();
      setVoiceModal({ isOpen: true, status: 'processing', text: finalTranscript });
      
      const matches = flatManualData.filter(loc => {
        const cleanName = loc.name.toLowerCase().replace(/kota |kabupaten |kab\. |kecamatan |desa |kelurahan /g, "").trim();
        return cleanName.length > 2 && finalTranscript.includes(cleanName);
      });
      
      matches.sort((a, b) => b.name.length - a.name.length);
      const matchedManual = matches[0]; 
      
      if (matchedManual) {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(matchedManual.name)} Kalimantan Timur&limit=1`);
          const data = await res.json();
          if (data && data.length > 0) {
             setFlyToTarget({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), zoom: matchedManual.type === 'kota' ? 10 : 13, ts: Date.now() });
          }
        } catch(e) {}
        
        setSelectedLocation({ id: matchedManual.id, name: matchedManual.name, type: matchedManual.type as any });
        setVoiceModal({ isOpen: false, status: 'listening', text: '' }); 
        setIsAIOpen(true); 
      } else {
        setVoiceModal({ isOpen: true, status: 'not-found', text: finalTranscript });
      }
    };
    recognition.start();
  };

  return { voiceModal, setVoiceModal, handleVoiceCommand };
}

export function VoiceModalOverlay({ 
  voiceModal, 
  setVoiceModal, 
  handleVoiceCommand 
}: { 
  voiceModal: any, 
  setVoiceModal: any, 
  handleVoiceCommand: () => void 
}) {
  if (!voiceModal.isOpen) return null;
  
  return (
    // KOREKSI Z-INDEX: Menggunakan z-[50] agar tetap di dalam peta
    <div className="absolute inset-0 z-[50] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95 text-center min-w-[280px] max-w-sm border-2 border-slate-100">
        
        {voiceModal.status === 'listening' && (
          <div className="relative flex items-center justify-center w-16 h-16 mb-2">
            <div className="absolute w-full h-full bg-red-100 rounded-full animate-ping opacity-70"></div>
            <div className="relative w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        )}

        {voiceModal.status === 'processing' && (
          <div className="flex items-center justify-center w-16 h-16 mb-2">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          </div>
        )}

        {voiceModal.status === 'not-found' && (
          <div className="flex items-center justify-center w-16 h-16 mb-2 bg-amber-100 rounded-full">
            <MapIcon className="w-7 h-7 text-amber-500" />
          </div>
        )}
        
        <h3 className="text-lg font-black text-slate-800">
          {voiceModal.status === 'listening' ? "Mendengarkan..." : voiceModal.status === 'processing' ? "Melacak Lokasi..." : "Lokasi Tidak Ditemukan"}
        </h3>

        <div className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 min-h-[50px] flex items-center justify-center">
          <p className="text-sm font-medium text-slate-700 italic">{voiceModal.text ? `"${voiceModal.text}"` : "..."}</p>
        </div>
        
        {voiceModal.status === 'not-found' ? (
          <div className="flex gap-2 w-full mt-2">
            <button onClick={handleVoiceCommand} className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Ulangi
            </button>
            <button onClick={() => setVoiceModal({ isOpen: false, status: 'listening', text: '' })} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all">
              Tutup
            </button>
          </div>
        ) : (
          <button onClick={() => setVoiceModal({ isOpen: false, status: 'listening', text: '' })} className="mt-2 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all w-full">
            Batal
          </button>
        )}
      </div>
    </div>
  );
}