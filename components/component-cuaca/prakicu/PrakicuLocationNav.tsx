"use client";

import React, { useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { DATA_KALTIM } from "@/data/kaltim-manual";

// Komponen ModernSelect Internal
const ModernSelect = ({ value, options, onChange, placeholder, disabled }: { value: string, options: any[], onChange: (val: string) => void, placeholder: string, disabled?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.id === value);

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-32 md:w-44 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all outline-none ${
          disabled 
            ? 'opacity-40 cursor-not-allowed text-slate-400' 
            : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600 cursor-pointer'
        }`}
      >
        <span className="truncate pr-2">{selectedOption ? selectedOption.name : placeholder}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <>
          <div className="fixed inset-0 z-[450]" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 mt-2 w-56 md:w-64 max-h-60 overflow-y-auto bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-[500] animate-in fade-in zoom-in-95 duration-200 custom-scrollbar p-1.5">
            <div className={`px-3 py-2.5 text-xs text-slate-500 hover:bg-slate-100 cursor-pointer rounded-lg mb-1 transition-colors ${!value ? 'bg-slate-50 font-bold' : ''}`} onClick={() => { onChange(""); setIsOpen(false); }}>
              {placeholder}
            </div>
            {options.map((opt) => {
              const isSelected = value === opt.id;
              return (
                <div key={opt.id} className={`px-3 py-2.5 text-xs cursor-pointer rounded-lg transition-all flex items-center justify-between ${isSelected ? 'bg-blue-50 text-blue-700 font-black' : 'text-slate-700 hover:bg-slate-50 font-semibold'}`} onClick={() => { onChange(opt.id); setIsOpen(false); }}>
                  <span className="truncate">{opt.name}</span>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-sm shrink-0"></div>}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// Komponen Utama Pil Navigasi
interface LocationNavProps {
  activeKotaId: string;
  activeKecamatanId: string;
  availableKecamatan: any[];
  handleKotaChange: (val: string) => void;
  handleKecamatanChange: (val: string) => void;
}

export default function PrakicuLocationNav({ activeKotaId, activeKecamatanId, availableKecamatan, handleKotaChange, handleKecamatanChange }: LocationNavProps) {
  return (
    <div className="flex w-full justify-center px-2 relative z-[450] mb-2">
      {/* Mengadopsi gaya desain referensi secara presisi */}
      <div className="flex items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm p-1 w-fit mx-auto">
        
        {/* Segmen Ikon Map */}
        <div className="flex items-center justify-center px-3 py-1 border-r border-slate-100">
          <MapPin className="w-4 h-4 text-blue-500" />
        </div>

        {/* Segmen Dropdown Kota */}
        <div className="px-1 border-r border-slate-100">
          <ModernSelect 
            value={activeKotaId}
            options={DATA_KALTIM || []}
            onChange={handleKotaChange}
            placeholder="Pilih Kabupaten/Kota"
          />
        </div>

        {/* Segmen Dropdown Kecamatan */}
        <div className="px-1">
          <ModernSelect 
            value={activeKecamatanId}
            options={availableKecamatan}
            onChange={handleKecamatanChange}
            placeholder="Pilih Kecamatan"
            disabled={!activeKotaId || availableKecamatan.length === 0}
          />
        </div>

      </div>
    </div>
  );
}