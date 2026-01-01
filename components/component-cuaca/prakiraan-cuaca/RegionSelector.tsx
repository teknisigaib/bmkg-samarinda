"use client";

import { useEffect, useState } from "react";
import { getProvinces, getRegencies, getDistricts, getVillages } from "@/lib/wilayah-utils";
import { Wilayah } from "@/data/kaltim-manual"; // Import type dari data manual
import { MapPin, ChevronRight } from "lucide-react";

interface Props {
  onRegionSelect: (adm4: string, fullLocationName: string) => void;
}

export default function RegionSelector({ onRegionSelect }: Props) {
  // Data State
  const [provinces, setProvinces] = useState<Wilayah[]>([]);
  const [regencies, setRegencies] = useState<Wilayah[]>([]);
  const [districts, setDistricts] = useState<Wilayah[]>([]);
  const [villages, setVillages] = useState<Wilayah[]>([]);

  // Selection State
  const [selectedProv, setSelectedProv] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDist, setSelectedDist] = useState("");
  const [selectedVill, setSelectedVill] = useState("");

  // 1. Load Provinsi (Kaltim) saat mount
  useEffect(() => {
    getProvinces().then(setProvinces);
  }, []);

  // Handle Perubahan Provinsi
  const handleProvChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedProv(id);
    // Reset anak-anaknya
    setSelectedCity(""); setSelectedDist(""); setSelectedVill("");
    setRegencies([]); setDistricts([]); setVillages([]);

    if (id) {
      const data = await getRegencies(id);
      setRegencies(data);
    }
  };

  // Handle Perubahan Kota
  const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedCity(id);
    setSelectedDist(""); setSelectedVill("");
    setDistricts([]); setVillages([]);

    if (id) {
      const data = await getDistricts(id);
      setDistricts(data);
    }
  };

  // Handle Perubahan Kecamatan
  const handleDistChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedDist(id);
    setSelectedVill("");
    setVillages([]);

    if (id) {
      const data = await getVillages(id);
      setVillages(data);
    }
  };

  // Handle Perubahan Kelurahan (Final)
  const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value; // ID Internal
    setSelectedVill(id);
    
    if (!id) return;

    // Cari object kelurahan untuk dapatkan bmkgCode
    const villageData = villages.find(v => v.id === id);
    if (!villageData || !villageData.bmkgCode) return;

    // Susun nama lengkap untuk label
    const cityName = regencies.find(r => r.id === selectedCity)?.name;
    const distName = districts.find(d => d.id === selectedDist)?.name;
    const fullName = `${villageData.name}, ${distName}, ${cityName}`;

    // Kirim Kode BMKG Valid ke Parent
    onRegionSelect(villageData.bmkgCode, fullName);
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-700">Lokasi: Kalimantan Timur</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PROVINSI (Readonly / Disabled karena cuma Kaltim) */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Provinsi</label>
                <select 
                    className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 appearance-none focus:outline-none"
                    onChange={handleProvChange}
                    value={selectedProv}
                >
                    <option value="">Pilih Provinsi...</option>
                    {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>

            {/* KOTA */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Kota/Kabupaten</label>
                <div className="relative">
                    <select 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        onChange={handleCityChange}
                        value={selectedCity}
                        disabled={!selectedProv}
                    >
                        <option value="">Pilih Kota...</option>
                        {regencies.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <ChevronRight className="absolute right-3 top-3 w-4 h-4 text-slate-400 rotate-90 pointer-events-none"/>
                </div>
            </div>

            {/* KECAMATAN */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Kecamatan</label>
                <div className="relative">
                    <select 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        onChange={handleDistChange}
                        value={selectedDist}
                        disabled={!selectedCity}
                    >
                        <option value="">Pilih Kecamatan...</option>
                        {districts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <ChevronRight className="absolute right-3 top-3 w-4 h-4 text-slate-400 rotate-90 pointer-events-none"/>
                </div>
            </div>

            {/* KELURAHAN */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase text-blue-600">Kelurahan / Desa</label>
                <div className="relative">
                    <select 
                        className="w-full p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm font-bold text-blue-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 hover:bg-blue-100 transition-colors"
                        onChange={handleVillageChange}
                        value={selectedVill}
                        disabled={!selectedDist}
                    >
                        <option value="">Pilih Kelurahan...</option>
                        {villages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <ChevronRight className="absolute right-3 top-3 w-4 h-4 text-blue-400 rotate-90 pointer-events-none"/>
                </div>
            </div>
        </div>
    </div>
  );
}