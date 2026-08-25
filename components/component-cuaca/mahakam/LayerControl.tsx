"use client";

import React, { useState } from 'react';
import { Layers, Radar, Satellite, Map, X, Loader2 } from 'lucide-react'; 
import { useRadarLatest } from "@/components/hooks/useRadarLatest";
import { useHimawariData } from "@/components/hooks/useHimawariData";

export type MapLayersState = {
  radar: boolean;
  satellite: boolean;
};

interface LayerControlProps {
  activeLayers: MapLayersState;
  onToggleLayer: (layer: keyof MapLayersState) => void;
  mapStyle: string;
  setMapStyle: (val: string) => void;
  layerOpacity: { radar: number; satellite: number };
  onOpacityChange: (layer: keyof MapLayersState, value: number) => void;
}

export default function LayerControl({ 
  activeLayers, 
  onToggleLayer,
  mapStyle, 
  setMapStyle,
  layerOpacity,
  onOpacityChange
}: LayerControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { isLoading: isRadarLoading } = useRadarLatest("BAL");
  const { isLoading: isSatLoading } = useHimawariData();

  const ToggleSwitch = ({ checked }: { checked: boolean }) => (
    <div className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors duration-300 ease-in-out ${checked ? 'bg-blue-500' : 'bg-slate-300'}`}>
      <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${checked ? 'translate-x-[14px]' : 'translate-x-0'}`} />
    </div>
  );

  const LayerItem = ({ 
    icon, 
    label, 
    active, 
    onClick, 
    isLoading 
  }: { 
    icon: React.ReactNode, 
    label: string, 
    active: boolean, 
    onClick: () => void,
    isLoading?: boolean
  }) => (
    <div className="w-full flex items-center justify-between py-2 group cursor-pointer" onClick={onClick}>
      <button className="flex flex-1 items-center gap-3 focus:outline-none text-left">
        <div className={`${active ? "text-blue-500" : "text-slate-400 group-hover:text-slate-600"} transition-colors`}>
            {icon}
        </div>
        <div className="flex items-center gap-2">
            <span className={`text-[11px] tracking-wide transition-colors ${active ? "text-slate-800 font-semibold" : "text-slate-600 font-medium group-hover:text-slate-800"}`}>
                {label}
            </span>
            {active && isLoading && (
                <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
            )}
        </div>
      </button>
      <div className="flex items-center gap-2">
        <button className="focus:outline-none ml-1 pointer-events-none">
          <ToggleSwitch checked={active} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="absolute top-4 left-4 bottom-4 z-[1000] pointer-events-none flex flex-col">
      
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="pointer-events-auto bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-lg border border-slate-200/60 text-slate-600 hover:text-blue-500 transition-all focus:outline-none w-fit group"
        >
          <Layers size={20} className="group-hover:scale-110 transition-transform" />
        </button>
      )}

      {isOpen && (
        <div className="pointer-events-auto bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/80 w-64 overflow-hidden animate-in slide-in-from-left-4 fade-in duration-300 flex flex-col max-h-full">
          
          <div className="p-3 flex items-center justify-between border-b border-slate-100 bg-slate-50/80 shrink-0">
            <div className="flex items-center gap-2.5">
              <img src="/logo-bmkg.png" alt="Logo BMKG" className="w-7 h-7 object-contain drop-shadow-sm" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-800 leading-tight">Navigasi Cuaca</span>
                <span className="text-[9px] font-medium text-slate-500 leading-tight">Sungai Mahakam</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors focus:outline-none"
            >
              <X size={14} />
            </button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
            
            <div>
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-2 px-1">Peta Dasar</p>
              <div className="flex bg-slate-100/80 p-1 rounded-xl">
                <button onClick={() => setMapStyle('light')} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all ${mapStyle === 'light' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}>
                  <Map size={14} /><span className="text-[9px]">Light</span>
                </button>
                <button onClick={() => setMapStyle('satellite')} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all ${mapStyle === 'satellite' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}>
                  <Satellite size={14} /><span className="text-[9px]">Satelit</span>
                </button>
                <button onClick={() => setMapStyle('dark')} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all ${mapStyle === 'dark' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}>
                  <Map size={14} className={mapStyle === 'dark' ? '' : 'opacity-50'} /><span className="text-[9px]">Dark</span>
                </button>
              </div>
            </div>

            <hr className="border-slate-100/80" />

            <div>
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1 px-1">Lapisan Cuaca</p>
              <div className="flex flex-col gap-1">
                
                {/* GRUP SATELIT */}
                <div className="flex flex-col bg-slate-50/50 rounded-xl p-1 transition-colors border border-transparent hover:border-slate-100">
                  <LayerItem 
                    icon={<Satellite size={16} />} 
                    label="Satelit Himawari" 
                    active={activeLayers.satellite} 
                    isLoading={isSatLoading}
                    onClick={() => onToggleLayer('satellite')} 
                  />
                  {activeLayers.satellite && (
                    <div className="px-2 pb-2 pt-1 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] text-slate-400 font-medium tracking-wide">Opasitas</span>
                        
                        {/* CUSTOM MODERN SLIDER */}
                        <input 
                          type="range" 
                          min="0" max="1" step="0.05"
                          value={layerOpacity.satellite}
                          onChange={(e) => onOpacityChange('satellite', parseFloat(e.target.value))}
                          className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer focus:outline-none 
                                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 
                                     [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full 
                                     [&::-webkit-slider-thumb]:shadow-[0_1px_5px_rgba(0,0,0,0.3)] [&::-webkit-slider-thumb]:border 
                                     [&::-webkit-slider-thumb]:border-slate-200 [&::-webkit-slider-thumb]:transition-transform 
                                     hover:[&::-webkit-slider-thumb]:scale-125"
                          style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${layerOpacity.satellite * 100}%, #e2e8f0 ${layerOpacity.satellite * 100}%, #e2e8f0 100%)`
                          }}
                        />

                        <span className="text-[9px] text-slate-600 font-bold w-6 text-right">
                          {Math.round(layerOpacity.satellite * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* GRUP RADAR */}
                <div className="flex flex-col bg-slate-50/50 rounded-xl p-1 transition-colors border border-transparent hover:border-slate-100">
                  <LayerItem 
                    icon={<Radar size={16} />} 
                    label="Radar Cuaca" 
                    active={activeLayers.radar} 
                    isLoading={isRadarLoading}
                    onClick={() => onToggleLayer('radar')} 
                  />
                  {activeLayers.radar && (
                    <div className="px-2 pb-2 pt-1 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] text-slate-400 font-medium tracking-wide">Opasitas</span>
                        
                        {/* CUSTOM MODERN SLIDER */}
                        <input 
                          type="range" 
                          min="0" max="1" step="0.05"
                          value={layerOpacity.radar}
                          onChange={(e) => onOpacityChange('radar', parseFloat(e.target.value))}
                          className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer focus:outline-none 
                                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 
                                     [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full 
                                     [&::-webkit-slider-thumb]:shadow-[0_1px_5px_rgba(0,0,0,0.3)] [&::-webkit-slider-thumb]:border 
                                     [&::-webkit-slider-thumb]:border-slate-200 [&::-webkit-slider-thumb]:transition-transform 
                                     hover:[&::-webkit-slider-thumb]:scale-125"
                          style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${layerOpacity.radar * 100}%, #e2e8f0 ${layerOpacity.radar * 100}%, #e2e8f0 100%)`
                          }}
                        />

                        <span className="text-[9px] text-slate-600 font-bold w-6 text-right">
                          {Math.round(layerOpacity.radar * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}