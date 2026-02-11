import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, CornerDownLeft } from 'lucide-react';
import { regionList, RegionOption } from '@/lib/regions';

interface LocationSearchProps {
  onSelectLocation: (id: string) => void;
}

export default function LocationSearch({ onSelectLocation }: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RegionOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const resultListRef = useRef<HTMLDivElement>(null);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);
    
    if (value.length > 0) {
      setIsOpen(true);
      const filtered = regionList.filter(region => 
        region.name.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    } else {
      setIsOpen(false);
      setResults([]);
    }
  };

  const handleSelect = (id: string) => {
    onSelectLocation(id);
    setQuery("");
    setIsOpen(false);
    setActiveIndex(-1);
  };

  // LOGIKA KEYBOARD (Arrow Up, Down, Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex(prev => {
          const nextIndex = prev < results.length - 1 ? prev + 1 : prev;
          scrollToItem(nextIndex);
          return nextIndex;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex(prev => {
          const nextIndex = prev > 0 ? prev - 1 : 0;
          scrollToItem(nextIndex);
          return nextIndex;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < results.length) {
          handleSelect(results[activeIndex].id);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  // Helper agar scroll mengikuti sorotan keyboard
  const scrollToItem = (index: number) => {
    const list = resultListRef.current;
    if (list) {
      const item = list.children[index + 1] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  };

  // Klik luar menutup dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        
        <input 
          type="text" 
          value={query}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className="block w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm text-sm font-medium" 
          placeholder="Cari Kota, Kecamatan, atau Desa..." 
        />
        
        {query && (
          <button 
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* DROPDOWN */}
      {isOpen && results.length > 0 && (
        <div 
          ref={resultListRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 max-h-72 overflow-y-auto z-50 scrollbar-thin scrollbar-thumb-slate-200"
        >
          <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-white z-10">
            Hasil Pencarian
          </div>
          
          {results.map((res, index) => {
            const isActive = index === activeIndex;

            return (
              <button 
                key={res.id}
                onClick={() => handleSelect(res.id)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between group border-b border-slate-50 last:border-0 transition-colors
                  ${isActive ? 'bg-blue-50' : 'hover:bg-slate-50'}
                `}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full transition-colors ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
                      {res.name}
                    </div>
                    {res.parentName && (
                      <div className="text-xs text-slate-400">di {res.parentName}</div>
                    )}
                  </div>
                </div>
                
                {/* Indikator Enter saat aktif */}
                {isActive ? (
                  <CornerDownLeft className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 uppercase border border-slate-200 px-2 py-0.5 rounded-full bg-slate-50">
                    {res.level === 'district' ? 'Kec' : res.level === 'village' ? 'Desa' : res.level}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {isOpen && query.length > 0 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 text-center z-50">
          <p className="text-sm text-slate-500">Lokasi tidak ditemukan.</p>
        </div>
      )}
    </div>
  );
}