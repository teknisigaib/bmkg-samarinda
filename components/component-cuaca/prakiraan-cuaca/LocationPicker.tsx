"use client";

import { useState } from "react";
import { Search, MapPin, X, Navigation, Map as MapIcon, ChevronRight, History } from "lucide-react";
import dynamic from "next/dynamic";

// Import komponen peta secara dinamis (matikan SSR)
const MapWithNoSSR = dynamic(() => import("./KaltimMap"), { 
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
            <p className="animate-pulse">Memuat Peta Kaltim...</p>
        </div>
    )
});

interface LocationPickerProps {
  currentLocation: {
    kecamatan: string;
    kotkab: string;
    provinsi: string;
  };
  onSelectLocation: (loc: any) => void;
}

export default function LocationPicker({ currentLocation, onSelectLocation }: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"search" | "map">("search");
  const [searchQuery, setSearchQuery] = useState("");

  // --- DUMMY DATA UNTUK DEMO ---
  const recentLocations = [
    { kecamatan: "Samarinda Kota", kotkab: "Samarinda", provinsi: "Kalimantan Timur" },
    { kecamatan: "Balikpapan Selatan", kotkab: "Balikpapan", provinsi: "Kalimantan Timur" },
    { kecamatan: "Tebet", kotkab: "Jakarta Selatan", provinsi: "DKI Jakarta" },
  ];

  return (
    <>
      {/* 1. TRIGGER (TOMBOL DI HEADER) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-blue-100 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all border border-white/10 group"
      >
        <MapPin className="w-4 h-4 text-yellow-400 group-hover:animate-bounce" />
        <div className="flex flex-col items-start text-xs">
          <span className="opacity-70 font-medium text-[10px] uppercase tracking-wider">Lokasi Terpilih</span>
          <span className="font-bold text-white truncate max-w-[150px] md:max-w-xs">
            {currentLocation.kecamatan}, {currentLocation.kotkab}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 opacity-50 ml-1" />
      </button>

      {/* 2. MODAL / BOTTOM SHEET OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center">
          
          {/* Backdrop (Klik untuk tutup) */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* MAIN CONTAINER */}
          <div className="relative bg-white w-full md:max-w-lg h-[90vh] md:h-[600px] rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            
            {/* --- HEADER MODAL --- */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-lg text-gray-800">Ganti Lokasi</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* --- TABS (Search vs Map) --- */}
            <div className="p-2 mx-6 mt-4 bg-gray-100 rounded-xl flex shrink-0">
                <button 
                    onClick={() => setMode("search")}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${mode === "search" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    <Search className="w-4 h-4" /> Pencarian
                </button>
                <button 
                    onClick={() => setMode("map")}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${mode === "map" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    <MapIcon className="w-4 h-4" /> Peta Interaktif
                </button>
            </div>

            {/* --- KONTEN UTAMA --- */}
            <div className="flex-1 overflow-y-auto p-6 relative">
                
                {/* A. MODE PENCARIAN */}
                {mode === "search" && (
                    <div className="space-y-6">
                        {/* Input Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Cari kecamatan, kota, atau provinsi..." 
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                        </div>

                        {/* Current Location Button */}
                        <button className="w-full flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors group">
                            <div className="p-2 bg-blue-200 rounded-full text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Navigation className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-sm">Gunakan Lokasi Saya</div>
                                <div className="text-xs opacity-70">Deteksi via GPS</div>
                            </div>
                        </button>

                        {/* Recent Locations */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <History className="w-3 h-3" /> Terakhir Dilihat
                            </h4>
                            <div className="space-y-2">
                                {recentLocations.map((loc, idx) => (
                                    <button 
                                        key={idx}
                                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 transition-all group"
                                        onClick={() => {
                                            onSelectLocation(loc);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-gray-700 group-hover:text-blue-700">{loc.kecamatan}</div>
                                                <div className="text-xs text-gray-400">{loc.kotkab}, {loc.provinsi}</div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* B. MODE PETA (Real Interactive Map) */}
                {mode === "map" && (
                    <div className="absolute inset-0 bg-gray-100 flex flex-col">
                        
                        {/* AREA PETA */}
                        <div className="flex-1 relative z-0">
                            <MapWithNoSSR 
                                onSelect={(coords) => console.log("Titik dipilih:", coords)} 
                            />
                            
                            {/* Overlay UI (Pin Tengah Statis - Opsional jika ingin gaya Uber) */}
                            {/* Anda bisa menghapus ini jika ingin menggunakan Marker klik biasa */}
                            <div className="absolute inset-0 pointer-events-none z-[1000] flex items-center justify-center pb-8">
                                <div className="relative">
                                     <MapPin className="w-10 h-10 text-red-600 fill-red-600 drop-shadow-xl -translate-y-1/2" />
                                     <div className="absolute top-0 left-1/2 w-2 h-2 bg-black/30 rounded-full blur-[2px] -translate-x-1/2"></div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Action */}
                        <div className="p-4 bg-white border-t border-gray-100 relative z-10 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                            <div className="mb-3">
                                <span className="text-xs text-gray-400 font-bold uppercase">Titik Koordinat</span>
                                <h4 className="text-sm font-medium text-gray-600">Geser pin ke lokasi rumah Anda</h4>
                            </div>
                            <button 
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                onClick={() => setIsOpen(false)}
                            >
                                Konfirmasi Titik Ini
                            </button>
                        </div>
                    </div>
                )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}