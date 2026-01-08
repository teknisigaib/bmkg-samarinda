"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { AlertTriangle, CloudRain, Sun, Info } from "lucide-react";
import { WarningLevel } from "@/components/component-iklim/PDIEMapClient"; // Import tipe data tadi

// 1. Dynamic Import Peta (Agar tidak error SSR)
const ClimateMapClient = dynamic(() => import("@/components/component-iklim/PDIEMapClient"), { 
  ssr: false,
  loading: () => <div className="w-full h-[500px] bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Memuat Peta...</div>
});

// --- DATA DUMMY (Nanti ini dari Database via API) ---
const DUMMY_RAIN_DATA = [
  { id: "1", name: "Samarinda", level: "AWAS" as WarningLevel },
  { id: "2", name: "Balikpapan", level: "SIAGA" as WarningLevel },
  { id: "3", name: "Kutai Kartanegara", level: "WASPADA" as WarningLevel },
  { id: "4", name: "Bontang", level: "AMAN" as WarningLevel },
  { id: "5", name: "Kutai Timur", level: "AMAN" as WarningLevel },
  // ... kabupaten lain
];

const DUMMY_DROUGHT_DATA = [
  { id: "1", name: "Samarinda", level: "AMAN" as WarningLevel },
  { id: "2", name: "Balikpapan", level: "AMAN" as WarningLevel },
  { id: "3", name: "Paser", level: "SIAGA" as WarningLevel },
  { id: "4", name: "Penajam Paser Utara", level: "WASPADA" as WarningLevel },
  // ... kabupaten lain
];

export default function PeringatanDiniPage() {
  const [activeTab, setActiveTab] = useState<"HUJAN" | "KEKERINGAN">("HUJAN");
  const [geoJson, setGeoJson] = useState(null);

  // 2. Fetch GeoJSON saat mount
  useEffect(() => {
    // Pastikan Anda menaruh file 'kaltim-kabupaten.json' di folder public/maps/
    fetch("/maps/Kabupaten-Kota.geojson")
      .then(res => res.json())
      .then(data => setGeoJson(data))
      .catch(err => console.error("Gagal load peta", err));
  }, []);

  // Pilih data berdasarkan tab yang aktif
  const currentData = activeTab === "HUJAN" ? DUMMY_RAIN_DATA : DUMMY_DROUGHT_DATA;

  // Statistik Ringkas
  const countAwas = currentData.filter(x => x.level === "AWAS").length;
  const countSiaga = currentData.filter(x => x.level === "SIAGA").length;
  const countWaspada = currentData.filter(x => x.level === "WASPADA").length;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Peringatan Dini Iklim</h1>
          <p className="text-slate-500">
            Monitor potensi cuaca ekstrem dan kekeringan di wilayah Kalimantan Timur.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Tombol Switch */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
                <button
                    onClick={() => setActiveTab("HUJAN")}
                    className={`flex-1 md:flex-none flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        activeTab === "HUJAN" 
                        ? "bg-white text-blue-700 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                    <CloudRain className="w-4 h-4" />
                    Curah Hujan Tinggi
                </button>
                <button
                    onClick={() => setActiveTab("KEKERINGAN")}
                    className={`flex-1 md:flex-none flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        activeTab === "KEKERINGAN" 
                        ? "bg-white text-orange-600 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                    <Sun className="w-4 h-4" />
                    Kekeringan Meteorologis
                </button>
            </div>

            {/* Info Status Singkat */}
            <div className="flex gap-4 text-xs font-semibold">
                {countAwas > 0 && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full">
                        <AlertTriangle className="w-3.5 h-3.5" /> {countAwas} Awas
                    </span>
                )}
                {countSiaga > 0 && (
                     <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                        <Info className="w-3.5 h-3.5" /> {countSiaga} Siaga
                    </span>
                )}
                {countWaspada > 0 && (
                     <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                        <Info className="w-3.5 h-3.5" /> {countWaspada} Waspada
                    </span>
                )}
            </div>
        </div>

        {/* Main Layout: Peta & Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Kolom Kiri: PETA */}
            <div className="lg:col-span-2 h-[500px] md:h-[600px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                {geoJson ? (
                    <ClimateMapClient 
                        geoJsonData={geoJson} 
                        warningData={currentData} 
                        warningType={activeTab} 
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                        Memuat Data Geospasial...
                    </div>
                )}
            </div>

            {/* Kolom Kanan: DETAIL TEKS / DAFTAR */}
            <div className="space-y-6">
                
                {/* Penjelasan Peringatan */}
                <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
                    <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                        {activeTab === "HUJAN" ? <CloudRain className="w-5 h-5"/> : <Sun className="w-5 h-5"/>}
                        Tentang Peringatan Ini
                    </h3>
                    <p className="text-sm text-blue-800 leading-relaxed">
                        {activeTab === "HUJAN" 
                            ? "Peringatan potensi curah hujan lebat yang dapat mengakibatkan bencana hidrometeorologi seperti banjir dan tanah longsor."
                            : "Peringatan potensi berkurangnya curah hujan yang dapat memicu kekeringan lahan, kekurangan air bersih, dan peningkatan potensi karhutla."
                        }
                    </p>
                </div>

                {/* Daftar Wilayah Terdampak (Hanya yang ada warning) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700">
                        Wilayah Terdampak
                    </div>
                    <ul className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                        {currentData
                            .filter(d => d.level !== "AMAN")
                            .sort((a, b) => {
                                const order = { "AWAS": 1, "SIAGA": 2, "WASPADA": 3, "AMAN": 4 };
                                return order[a.level] - order[b.level];
                            })
                            .map((item) => (
                            <li key={item.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                                <span className="font-medium text-slate-800">{item.name}</span>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                                    item.level === "AWAS" ? "bg-red-100 text-red-700" :
                                    item.level === "SIAGA" ? "bg-orange-100 text-orange-700" :
                                    "bg-yellow-100 text-yellow-700"
                                }`}>
                                    {item.level}
                                </span>
                            </li>
                        ))}
                        
                        {currentData.filter(d => d.level !== "AMAN").length === 0 && (
                            <li className="p-8 text-center text-slate-400 text-sm">
                                Tidak ada peringatan dini aktif di seluruh wilayah saat ini.
                            </li>
                        )}
                    </ul>
                </div>

            </div>

        </div>

      </div>
    </div>
  );
}