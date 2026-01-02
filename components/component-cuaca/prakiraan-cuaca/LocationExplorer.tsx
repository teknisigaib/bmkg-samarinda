"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getRegencies, getDistricts, getVillages } from "@/lib/wilayah-utils";
import { searchCoordinates } from "@/lib/geocoding-utils";
import { MapPin, ChevronRight, Navigation, Layers, Search, MapPinned } from "lucide-react";

// --- TIPE DATA ---
interface Wilayah {
  id: string;
  name: string;
  bmkgCode?: string;
}

// --- ICON MARKER ---
const customIcon = L.divIcon({
  className: "custom-pin",
  html: `<div style="background-color: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); position: relative;">
            <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid white;"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

// --- HELPER AGAR PETA BERGERAK ---
function MapUpdater({ coords }: { coords: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo([coords.lat, coords.lng], 13, { duration: 2 });
  }, [coords, map]);
  return null;
}

interface Props {
  onLocationSelect: (adm4: string, fullLocationName: string) => void;
}

export default function LocationExplorer({ onLocationSelect }: Props) {
  // State Data Wilayah
  const [regencies, setRegencies] = useState<Wilayah[]>([]);
  const [districts, setDistricts] = useState<Wilayah[]>([]);
  const [villages, setVillages] = useState<Wilayah[]>([]);

  // State Pilihan User
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDist, setSelectedDist] = useState("");
  const [selectedVill, setSelectedVill] = useState("");

  // State Peta
  const [mapCoords, setMapCoords] = useState<{lat: number, lng: number} | null>(null);
  const [locationLabel, setLocationLabel] = useState("Kalimantan Timur");
  const [isSearchingMap, setIsSearchingMap] = useState(false);

  // Default Center: Samarinda
  const defaultCenter: [number, number] = [-0.5022, 117.1536];

  // Init: Load Kabupaten (Kode 64 = Kaltim)
  useEffect(() => {
    getRegencies("64").then((data: any) => setRegencies(data));
  }, []);

  // --- HANDLERS ---

  const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedCity(id);
    // Reset anak-anaknya
    setSelectedDist(""); setSelectedVill("");
    setDistricts([]); setVillages([]);
    
    // Fetch Kecamatan saja, JANGAN cari koordinat peta dulu
    if (id) {
      const data = await getDistricts(id);
      setDistricts(data as Wilayah[]);
    }
  };

  const handleDistChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedDist(id);
    // Reset Kelurahan
    setSelectedVill(""); setVillages([]);
    
    // Fetch Kelurahan saja, JANGAN cari koordinat peta dulu
    if (id) {
      const data = await getVillages(id);
      setVillages(data as Wilayah[]);
    }
  };

  const cleanName = (name: string) => {
    return name
      .replace(/KABUPATEN /i, "")
      .replace(/KOTA /i, "")
      .replace(/KECAMATAN /i, "")
      .replace(/KELURAHAN /i, "")
      .replace(/DESA /i, "")
      .trim();
  };

  const handleVillageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedVill(id);
    if (!id) return;

    const villageData = villages.find(v => v.id === id);
    if (!villageData) return;

    // --- 1. PROSES DATA CUACA (TETAP SAMA) ---
    const codeToSend = villageData.bmkgCode || villageData.id;
    const cityName = regencies.find(r => r.id === selectedCity)?.name || "";
    const distName = districts.find(d => d.id === selectedDist)?.name || "";
    const fullName = `${villageData.name}, ${cityName}`; // Label UI
    
    onLocationSelect(codeToSend, fullName);
    setLocationLabel(villageData.name); // Label Marker Peta

    // --- 2. PROSES PENCARIAN PETA (SUPAYA LEBIH AKURAT) ---
    setIsSearchingMap(true);
    
    // Siapkan nama yang bersih untuk pencarian
    const cleanVill = cleanName(villageData.name);
    const cleanDist = cleanName(distName);
    const cleanCity = cleanName(cityName);

    // STRATEGI PENCARIAN BERTINGKAT (TRY & CATCH)
    let coords = null;

    // Percobaan 1: Spesifik (Desa, Kecamatan, Kota)
    // Hapus "Kalimantan Timur" dari query spesifik karena kadang membingungkan OSM jika data desa tidak punya tag parent state
    coords = await searchCoordinates(`${cleanVill}, ${cleanDist}, ${cleanCity}`);

    // Percobaan 2: Kurangi Spesifisitas (Desa, Kota)
    if (!coords) {
        console.log("Coba 2: Desa + Kota");
        coords = await searchCoordinates(`${cleanVill}, ${cleanCity}`);
    }

    // Percobaan 3: Desa + Kaltim (Jika nama desa unik)
    if (!coords) {
        console.log("Coba 3: Desa + Provinsi");
        coords = await searchCoordinates(`${cleanVill}, Kalimantan Timur`);
    }

    // Percobaan 4 (Fallback Terakhir): Cari Kecamatan saja (Pasti ketemu)
    if (!coords) {
        console.log("Fallback: Kecamatan");
        coords = await searchCoordinates(`${cleanDist}, ${cleanCity}, Kalimantan Timur`);
    }

    // Update Peta jika salah satu berhasil
    if (coords) {
        setMapCoords(coords);
    } else {
        console.warn("Gagal menemukan koordinat untuk:", fullName);
    }
    
    setIsSearchingMap(false);
  };

  return (
    <div className="relative w-full md:w-[1000px] h-[500px] md:h-[600px] rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-200 bg-slate-100 group">
      
      {/* LAYER 1: PETA (BACKGROUND) */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
            center={defaultCenter} 
            zoom={8} 
            style={{ height: "100%", width: "100%" }} 
            zoomControl={false}
        >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
            
            {/* Helper untuk menggerakkan peta */}
            <MapUpdater coords={mapCoords} />

            {mapCoords && (
                <Marker position={[mapCoords.lat, mapCoords.lng]} icon={customIcon}>
                    <Popup className="font-sans font-bold">{locationLabel}</Popup>
                </Marker>
            )}
        </MapContainer>
      </div>

      {/* LAYER 2: PANEL FILTER (FLOATING) */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-center">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-[2rem] shadow-lg border border-white/50 w-full max-w-4xl transition-all hover:bg-white">
            
            {/* Header Panel */}
            <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-1.5 rounded-full text-blue-600"><Navigation className="w-3.5 h-3.5" /></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cari Lokasi (Kaltim)</span>
                </div>
                {/* Indikator Loading Peta */}
                {isSearchingMap && (
                    <span className="text-[10px] text-blue-600 animate-pulse flex items-center gap-1 font-medium">
                        <Search className="w-3 h-3"/> Mencari titik peta...
                    </span>
                )}
            </div>

            {/* Grid Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                {/* 1. KOTA */}
                <div className="relative">
                    <select 
                        className="w-full p-3 pl-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                        onChange={handleCityChange}
                        value={selectedCity}
                    >
                        <option value="">Pilih Kota/Kab...</option>
                        {regencies.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <ChevronRight className="absolute right-4 top-3.5 w-3.5 h-3.5 text-slate-400 rotate-90 pointer-events-none"/>
                </div>

                {/* 2. KECAMATAN */}
                <div className="relative">
                    <select 
                        className="w-full p-3 pl-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 appearance-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-slate-100"
                        onChange={handleDistChange}
                        value={selectedDist}
                        disabled={!selectedCity}
                    >
                        <option value="">Pilih Kecamatan...</option>
                        {districts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <ChevronRight className="absolute right-4 top-3.5 w-3.5 h-3.5 text-slate-400 rotate-90 pointer-events-none"/>
                </div>

                {/* 3. KELURAHAN (Pemicu Peta) */}
                <div className="relative">
                    <select 
                        className="w-full p-3 pl-9 bg-blue-50 border border-blue-200 rounded-2xl text-xs font-bold text-blue-700 appearance-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer disabled:opacity-50 disabled:bg-slate-50 disabled:border-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed hover:enabled:bg-blue-100 transition-colors shadow-sm"
                        onChange={handleVillageChange}
                        value={selectedVill}
                        disabled={!selectedDist}
                    >
                        <option value="">Pilih Kelurahan...</option>
                        {villages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <MapPin className="absolute left-3 top-3 w-3.5 h-3.5 text-blue-500 pointer-events-none"/>
                    <ChevronRight className="absolute right-4 top-3.5 w-3.5 h-3.5 text-blue-400 rotate-90 pointer-events-none"/>
                </div>

            </div>
        </div>
      </div>

      {/* Info Badge */}
      <div className="absolute bottom-4 right-4 z-[900] hidden md:block pointer-events-none">
         <div className="bg-white/80 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-medium text-slate-500 shadow-sm border border-white flex items-center gap-1.5">
            <Layers className="w-3 h-3" /> Peta Interaktif
         </div>
      </div>
    </div>
  );
}