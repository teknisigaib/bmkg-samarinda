"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  Info, Clock, Map, Loader2 
} from "lucide-react";
import SectionDivider from "@/components/ui/SectionDivider";

// Import Components
import MaritimeControl from "./MaritimeControl";
import MaritimeDetail from "./MaritimeDetail";
import MaritimeForecastTable from "./MaritimeForecastTable";

// 1. Import Utils & Constants dari file asli
import { 
  KALTIM_AREAS, 
  KALTIM_PORTS, 
  findClosestIndex,
  NewMaritimeForecastItem,
  combineForecasts
} from "@/lib/bmkg/maritim";

// 2. Import Fungsi Fetch dari file ACTIONS yang baru
import {
  getWilmetosGeoJson,
  getPerairanData,
  getPelabuhanData
} from "@/lib/bmkg/maritim-actions";

// Dynamic Import Peta (No SSR)
const MaritimeMap = dynamic(() => import("./MaritimeMap"), { 
  ssr: false,
  loading: () => (
    <div className="h-[650px] w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">
      Memuat Peta...
    </div>
  )
});

// --- KOMPONEN LOADING KARTU (SKELETON) ---
function DetailLoadingCard() {
  return (
    <div className="absolute top-4 right-4 z-[1001] w-72 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between mb-4">
        <div className="h-3 w-20 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-4 w-4 bg-slate-200 rounded-full animate-pulse"></div>
      </div>
      <div className="h-5 w-3/4 bg-slate-200 rounded mb-2 animate-pulse"></div>
      <div className="h-3 w-1/2 bg-slate-200 rounded mb-4 animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-10 w-full bg-slate-100 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-2 gap-2">
           <div className="h-16 bg-slate-100 rounded-lg animate-pulse"></div>
           <div className="h-16 bg-slate-100 rounded-lg animate-pulse"></div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-blue-500 font-medium">
         <Loader2 className="w-3 h-3 animate-spin" /> Mengambil data terbaru...
      </div>
    </div>
  );
}

export default function MaritimeDashboard() {
  // State
  const [regionDataCache, setRegionDataCache] = useState<Record<string, NewMaritimeForecastItem[]>>({});
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [dayIndex, setDayIndex] = useState(0);
  const [currentType, setCurrentType] = useState<'area' | 'port'>('area');

  const todayLabel = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'Asia/Makassar'
  });
  const totalPoints = KALTIM_AREAS.length + KALTIM_PORTS.length;

  // --- EFEK PERTAMA: Tarik Peta & Data Latar Belakang menggunakan fungsi Library ---
  useEffect(() => {
    let isMounted = true;

    async function initData() {
      try {
        // 1. Tarik Peta GeoJSON via Library
        const geoJson = await getWilmetosGeoJson();
        if (geoJson && isMounted) {
          setGeoJsonData(geoJson);
          setIsMapReady(true);
        }

        // 2. Tarik Data Area (Background Fetch) Biar Peta Berwarna
        const tempCache: Record<string, any> = {};
        for (const area of KALTIM_AREAS) {
          try {
            // Menggunakan area.id (misal: "P.Y.02")
            const data = await getPerairanData(area.id);
            if (data) {
              const combined = combineForecasts(data);
              tempCache[area.id] = combined;
              
              // Set index waktu otomatis berdasarkan data pertama yang berhasil ditarik
              if (Object.keys(tempCache).length === 1 && isMounted) {
                setDayIndex(findClosestIndex(combined));
              }
            }
          } catch (e) {
            console.warn(`Gagal ambil cuaca awal ${area.name}`);
          }
        }
        if (isMounted) setRegionDataCache(tempCache);
      } catch (error) {
        console.error("Gagal inisialisasi data:", error);
      }
    }

    initData();
    return () => { isMounted = false; };
  }, []);

  // --- HANDLER SELEKSI WILAYAH ---
 // --- HANDLER SELEKSI WILAYAH ---
  const handleSelect = async (name: string, type: 'area' | 'port' = 'area', codeId?: string) => {
    if (!codeId) {
       console.error("ID Kode tidak ditemukan untuk area/pelabuhan:", name);
       return;
    }
    
    setCurrentType(type);
    
    // 1. Cek Cache Lokal Browser menggunakan codeId
    if (type === 'area' && regionDataCache[codeId]) {
        const combined = regionDataCache[codeId];
        setSelectedDetail({ name, combined, type });
        setDayIndex(findClosestIndex(combined)); 
        return;
    }

    // 2. Fetch Baru Menggunakan Library API
    setLoadingDetail(true);
    // HAPUS atau KOMENTARI baris ini: setSelectedDetail(null); 
    // Biarkan UI menampilkan data lama sambil loading yang baru

    try {
      const data = type === 'port' 
        ? await getPelabuhanData(codeId)
        : await getPerairanData(codeId);
      
      if (data) {
        const combined = combineForecasts(data);
        const result = { name, type, combined };
        
        setSelectedDetail(result);
        
        // TETAP PERTAHANKAN CACHE LAMA SAAT MENYIMPAN YANG BARU
        if (type === 'area') {
            setRegionDataCache((prev: any) => ({ ...prev, [codeId]: combined }));
        }
        setDayIndex(findClosestIndex(combined));
      } else {
        throw new Error(`Data tidak ditemukan.`);
      }
    } catch (error) {
      console.error("Gagal mengambil data dari API:", error);
      alert(`Waduh, data ${name} gagal ditarik dari BMKG Pusat. Coba lagi nanti ya.`);
    } finally {
      setLoadingDetail(false);
    }
  };

  // --- TIMESTAMPS UNTUK SLIDER ---
  const timestamps = useMemo(() => {
    if (selectedDetail) return selectedDetail.combined.map((f: any) => f.time);
    const firstKey = Object.keys(regionDataCache)[0];
    if (firstKey) return regionDataCache[firstKey].map((f: any) => f.time);
    return [];
  }, [regionDataCache, selectedDetail]);

  const activeForecast = selectedDetail?.combined[dayIndex];

  return (
    <div className="w-full space-y-8 pb-20">
      
      {/* --- HEADER --- */}
      <section className="relative flex flex-col items-center justify-center text-center mb-10 max-w-3xl mx-auto pt-2">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
             <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
          </div>
          <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
             Cuaca Maritim
          </h1>
          <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl mb-8">
             Sistem pemantauan perairan terpadu. Menyediakan informasi tinggi gelombang, arus laut, dan cuaca pelabuhan di wilayah Kalimantan Timur.
          </p>
          <div className="relative z-10 flex items-center bg-white border border-slate-200 rounded-md shadow-sm p-1">
             <div className="flex items-center gap-2 px-4 py-1.5 border-r border-slate-100">
                <span className="text-xs font-semibold text-slate-700">{totalPoints} Area Terpantau</span>
             </div>
             <div className="flex items-center gap-2 px-4 py-1.5">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-slate-500">Sync: {todayLabel}</span>
             </div>
          </div>
      </section>

      {/* --- MAP CONTAINER --- */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 h-[650px] group">
          
          {/* Komponen Peta */}
          {isMapReady ? (
            <MaritimeMap 
              onSelect={handleSelect} 
              regionCache={regionDataCache} 
              dayIndex={dayIndex}
              geoData={geoJsonData}
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 gap-3">
               <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
               <p className="font-medium animate-pulse">Menghubungkan ke satelit BMKG...</p>
            </div>
          )}

          {/* Time Slider Control */}
          {timestamps.length > 0 && (
            <MaritimeControl 
               timestamps={timestamps} 
               selectedIndex={dayIndex} 
               onSelect={setDayIndex} 
            />
          )}
          
          {/* STATE A: Loading Kartu Detail */}
          {loadingDetail && <DetailLoadingCard />}
          
          {/* STATE B: Data Tersedia */}
          {!loadingDetail && activeForecast && (
             <MaritimeDetail 
                data={{ ...activeForecast, name: selectedDetail.name, type: currentType }} 
                onClose={() => setSelectedDetail(null)} 
             />
          )}

          {/* STATE C: Petunjuk Awal */}
          {!loadingDetail && !selectedDetail && isMapReady && (
            <div className="absolute top-4 right-4 z-[900] w-64 bg-white/95 backdrop-blur-md p-5 rounded-xl shadow-xl shadow-slate-200/50 border border-white/50 animate-in fade-in slide-in-from-right-4 duration-500">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Info className="w-3 h-3" /> PETUNJUK PETA
                </h4>
                <p className="text-gray-400 text-xs italic leading-relaxed">
                    Klik pada area perairan (poligon biru) atau titik pelabuhan (dot merah) di peta untuk melihat detail.
                </p>
            </div>
          )}
      </div>

      {/* --- TABEL DETAIL --- */}
      {selectedDetail && !loadingDetail && (
        <div className="w-full mx-auto mt-24 mb-16">
            <SectionDivider title={`Rincian Prakiraan - ${selectedDetail.name}`} className="mb-8" />
            <MaritimeForecastTable 
               data={selectedDetail.combined} 
               locationName={selectedDetail.name} 
               isPort={currentType === 'port'} 
            />
        </div>
      )}
    </div>
  );
}