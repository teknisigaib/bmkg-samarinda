"use client";

import React, { useState, useEffect } from 'react';
import { Map as MapIcon, Calendar, Droplets, Sun, CloudRain, BarChart2, ChevronLeft, MapPin, ChevronDown, Layers } from 'lucide-react';

const CLIMATE_CATEGORIES = [
  {
    title: 'Pemantauan Terkini',
    items: [
      { id: 'sebaran_hujan_harian', name: 'Curah Hujan Harian', icon: Droplets },
      { id: 'hari_tanpa_hujan', name: 'Hari Tanpa Hujan', icon: MapPin }, // <-- FIXED: Sudah diganti jadi hari_tanpa_hujan
    ]
  },
  {
    title: 'Analisis Iklim',
    items: [
      { id: 'analisis_hujan_dasarian', name: 'Curah Hujan Dasarian', icon: BarChart2 },
      { id: 'analisis_hujan_bulanan', name: 'Curah Hujan Bulanan', icon: BarChart2 },
      { id: 'analisis_sifat_hujan', name: 'Sifat Hujan Bulanan', icon: Layers },
      { id: 'analisis_hari_hujan', name: 'Jumlah Hari Hujan', icon: CloudRain },
    ]
  },
  {
    title: 'Prakiraan Iklim',
    items: [
      { id: 'prakiraan_hujan_dasarian', name: 'Prakiraan CH Dasarian', icon: CloudRain },
      { id: 'prakiraan_hujan_bulanan', name: 'Prakiraan CH Bulanan', icon: CloudRain },
      { id: 'prakiraan_sifat_hujan_das', name: 'Prakiraan SH Dasarian', icon: Layers },
      { id: 'prakiraan_sifat_hujan_bln', name: 'Prakiraan SH Bulanan', icon: Layers },
    ]
  }
];

const PERIODE_OPTIONS = [
  { id: 'latest', label: 'Data Terbaru (Latest)' },
];

interface LayerControlProps {
  activeProduct: string;
  setActiveProduct: (val: string) => void;
  activePeriod: string;
  setActivePeriod: (val: string) => void;
  isLoading: boolean;
  mapStyle: string;
  setMapStyle: (val: string) => void;
}

export default function ClimateLayerControl({
  activeProduct, setActiveProduct, activePeriod, setActivePeriod, isLoading, mapStyle, setMapStyle
}: LayerControlProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [openCategories, setOpenCategories] = useState<string[]>(['Pemantauan Terkini', 'Analisis Iklim']);

  useEffect(() => {
    if (window.innerWidth < 768) setIsOpen(false);
  }, []);

  const toggleCategory = (title: string) => {
    setOpenCategories(prev => prev.includes(title) ? prev.filter(c => c !== title) : [...prev, title]);
  };

  const LayerItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all border-b border-slate-100 last:border-b-0 hover:bg-slate-50 ${
        active ? 'bg-blue-50/40' : 'bg-white'
      }`}
    >
      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
        active ? 'border-blue-600 bg-white' : 'border-slate-300 bg-slate-50'
      }`}>
        {active && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-in zoom-in duration-200" />}
      </div>
      
      <div className="flex items-center gap-2 flex-1">
        <Icon size={14} className={active ? 'text-blue-600' : 'text-slate-400'} strokeWidth={active ? 2 : 1.5} />
        <span className={`text-[11px] tracking-wide line-clamp-1 ${active ? "text-blue-700 font-semibold" : "text-slate-600 font-medium"}`}>
          {label}
        </span>
      </div>
    </button>
  );

  return (
    <div className="absolute top-4 left-4 bottom-4 z-[1000] pointer-events-none flex flex-col">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="pointer-events-auto bg-white p-2.5 rounded-xl shadow-[0_4px_15px_-3px_rgba(0,0,0,0.1)] border border-slate-200 text-slate-600 hover:text-blue-600 transition-all focus:outline-none"
        >
          <Layers size={20} strokeWidth={1.5} />
        </button>
      )}

      {isOpen && (
        <div className="pointer-events-auto bg-white rounded-xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] border border-slate-200/80 w-[280px] overflow-hidden flex flex-col max-h-full animate-in slide-in-from-left-4 fade-in duration-200">
          
          <div className="px-4 py-3 flex items-center justify-between bg-white border-b border-slate-100 shadow-sm shrink-0 z-10">
            <div className="flex items-center gap-3">
              <img src="/logo-bmkg2.png" alt="BMKG" className="w-6 h-7 object-contain" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 leading-none">WebGIS Iklim</span>
                <span className="text-[10px] text-blue-600 font-semibold mt-1 uppercase tracking-widest">Kaltim</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1 rounded-md transition-colors focus:outline-none">
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
            <div className="p-4 border-b border-slate-100 bg-white">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">Basemap</span>
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/50 shadow-inner">
                <button onClick={() => setMapStyle('light')} className={`flex-1 py-1.5 text-[10px] rounded-md transition-all ${mapStyle === 'light' ? 'bg-white text-blue-700 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-700 font-medium'}`}>Light</button>
                <button onClick={() => setMapStyle('satellite')} className={`flex-1 py-1.5 text-[10px] rounded-md transition-all ${mapStyle === 'satellite' ? 'bg-white text-blue-700 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-700 font-medium'}`}>Satelit</button>
                <button onClick={() => setMapStyle('dark')} className={`flex-1 py-1.5 text-[10px] rounded-md transition-all ${mapStyle === 'dark' ? 'bg-white text-blue-700 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-700 font-medium'}`}>Dark</button>
              </div>
            </div>

            <div className="p-4 border-b border-slate-100 bg-white">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">Periode Waktu</span>
              <div className="relative">
                <select 
                  value={activePeriod}
                  onChange={(e) => setActivePeriod(e.target.value)}
                  className="w-full text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer appearance-none shadow-sm"
                >
                  {PERIODE_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" strokeWidth={2} />
              </div>
            </div>

            <div className="p-2 space-y-2">
              {CLIMATE_CATEGORIES.map(category => {
                const isCatOpen = openCategories.includes(category.title);
                return (
                  <div key={category.title} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <button 
                      onClick={() => toggleCategory(category.title)}
                      className="w-full px-3 py-2.5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{category.title}</span>
                      <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isCatOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
                    </button>
                    
                    <div className={`transition-all duration-300 origin-top overflow-hidden ${isCatOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                      <div className="flex flex-col bg-white border-t border-slate-100">
                        {category.items.map(prod => (
                          <LayerItem 
                            key={prod.id} 
                            icon={prod.icon} 
                            label={prod.name} 
                            active={activeProduct === prod.id} 
                            onClick={() => {
                              setActiveProduct(prod.id);
                              if (window.innerWidth < 768) setIsOpen(false);
                            }} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}