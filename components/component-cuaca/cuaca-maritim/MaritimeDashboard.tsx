"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  Ship, Anchor, Info, Clock, Map, Waves, Loader2 
} from "lucide-react";

// Import Components
import MaritimeControl from "./MaritimeControl";
import MaritimeDetail from "./MaritimeDetail";
import MaritimeForecastTable from "./MaritimeForecastTable";

// Import Actions & Utils
import { getMaritimeDetail } from "@/app/(public)/cuaca/maritim/actions"; 
import { 
  createSlug, 
  KALTIM_AREAS, 
  KALTIM_PORTS, 
  findClosestIndex,
  NewMaritimeForecastItem 
} from "@/lib/bmkg/maritim";

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

interface DashboardProps {
  initialData: Record<string, NewMaritimeForecastItem[]>;
  geoJsonData: any; // Tambahkan Prop ini
}
export default function MaritimeDashboard({ initialData, geoJsonData }: DashboardProps) {
  // State
  const [regionDataCache, setRegionDataCache] = useState(initialData);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [dayIndex, setDayIndex] = useState(0);
  const [currentType, setCurrentType] = useState<'area' | 'port'>('area');

  // --- LOGIKA HEADER ---
  const todayLabel = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'Asia/Makassar'
  });
  
  const totalPoints = KALTIM_AREAS.length + KALTIM_PORTS.length;

  // Set Waktu Awal (Real-time) berdasarkan data pertama
  useEffect(() => {
    const firstKey = Object.keys(initialData)[0];
    if (firstKey && initialData[firstKey]) {
      setDayIndex(findClosestIndex(initialData[firstKey]));
    }
  }, [initialData]);

  // --- HANDLER SELEKSI WILAYAH ---
  const handleSelect = async (name: string, type: 'area' | 'port' = 'area') => {
    const slug = createSlug(name);
    setCurrentType(type);
    
    // 1. Cek Cache (Client Side)
    if (type === 'area' && regionDataCache[slug]) {
        const combined = regionDataCache[slug];
        setSelectedDetail({ name, combined, type });
        setDayIndex(findClosestIndex(combined)); 
        return;
    }

    // 2. Fetch Baru (Server Action)
    setLoadingDetail(true);
    // Kita kosongkan detail lama agar loading skeleton muncul
    setSelectedDetail(null); 

    try {
      const result = await getMaritimeDetail(name, type);
      if (result) {
          setSelectedDetail(result);
          // Simpan ke cache jika itu Area (karena sering diakses)
          if (type === 'area') {
              setRegionDataCache((prev: any) => ({ ...prev, [slug]: result.combined }));
          }
          setDayIndex(findClosestIndex(result.combined));
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
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
      <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center text-center md:items-start md:text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          
          <div className="bg-white p-4 rounded-full shadow-sm w-fit shrink-0 ring-4 ring-blue-50/50">
              <Ship className="w-8 h-8 text-blue-600" />
          </div>
  
          <div className="flex-1 w-full">
              <h2 className="text-2xl font-bold text-slate-800">
                  Cuaca Maritim & Pelabuhan
              </h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed mx-auto md:mx-0">
                 Informasi tinggi gelombang, arus laut, dan cuaca pelabuhan di wilayah perairan Kalimantan Timur.
              </p>
              
              <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-600 shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>{todayLabel}</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-600 shadow-sm">
                    <Map className="w-3.5 h-3.5 text-blue-500" />
                    <span><strong>{totalPoints}</strong> Area & Pelabuhan</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-blue-600 px-3 py-1.5 rounded-md border border-blue-600 text-xs font-bold text-white shadow-sm shadow-blue-200">
                    <Waves className="w-3.5 h-3.5" />
                    <span>Sumber: Maritim BMKG</span>
                </div>
              </div>
          </div>
      </section>

      {/* --- MAP CONTAINER --- */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 h-[650px] group">
          
          {/* 1. Komponen Peta */}
          <MaritimeMap 
            onSelect={handleSelect} 
            regionCache={regionDataCache} 
            dayIndex={dayIndex}
            geoData={geoJsonData} // <-- Oper Data GeoJSON ke sini
          />
          

          {/* 3. Time Slider Control (Bawah Tengah) */}
          {timestamps.length > 0 && (
            <MaritimeControl 
               timestamps={timestamps} 
               selectedIndex={dayIndex} 
               onSelect={setDayIndex} 
            />
          )}
          
          {/* --- LOGIKA TAMPILAN KARTU DETAIL --- */}

          {/* STATE A: Loading (Sedang Fetch Server Action) */}
          {loadingDetail && <DetailLoadingCard />}
          
          {/* STATE B: Data Tersedia (Tampilkan Detail) */}
          {!loadingDetail && activeForecast && (
             <MaritimeDetail 
                data={{ ...activeForecast, name: selectedDetail.name, type: currentType }} 
                onClose={() => setSelectedDetail(null)} 
             />
          )}

          {/* STATE C: Idle / Belum Ada Pilihan (Tampilkan Petunjuk) */}
          {!loadingDetail && !selectedDetail && (
            <div className="absolute top-4 right-4 z-[900] w-64 bg-white/95 backdrop-blur-md p-5 rounded-xl shadow-xl shadow-slate-200/50 border border-white/50 animate-in fade-in slide-in-from-right-4 duration-500">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Info className="w-3 h-3" /> PETUNJUK PETA
                </h4>
                <p className="text-gray-400 text-xs italic leading-relaxed">
                    Klik pada area perairan (poligon biru) atau titik pelabuhan (dot merah) di peta, atau gunakan kolom pencarian untuk melihat detail.
                </p>
            </div>
          )}
      </div>

      {/* --- TABEL DETAIL --- */}
      {selectedDetail && !loadingDetail && (
        <MaritimeForecastTable 
           data={selectedDetail.combined} 
           locationName={selectedDetail.name} 
           isPort={currentType === 'port'} 
        />
      )}
    </div>
  );
}