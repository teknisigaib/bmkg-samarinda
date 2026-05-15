"use client";

import { useState } from "react";
import { Layers, Radar, Satellite, Flame, AlertTriangle, X, Map, MapPin, Wind, Loader2, ShieldCheck, Info } from "lucide-react";

import { useRadarLatest } from "@/components/hooks/useRadarLatest";
import { useHimawariData } from "@/components/hooks/useHimawariData";

interface LayerControlProps {
  showRadar: boolean; setShowRadar: (val: boolean) => void;
  showSatellite: boolean; setShowSatellite: (val: boolean) => void;
  showHotspot: boolean; setShowHotspot: (val: boolean) => void;
  showWarning: boolean; setShowWarning: (val: boolean) => void;
  showStations: boolean; setShowStations: (val: boolean) => void;
  mapStyle: string; setMapStyle: (val: string) => void;
  nowcastData?: any; // ✅ Terima data Nowcast
  isLoadingHotspot: boolean; 
  showWind: boolean; setShowWind: (val: boolean) => void;
  isLoadingWind: boolean; windTime: string | null;
}

export default function LayerControl({
  showRadar, setShowRadar, showSatellite, setShowSatellite,
  showHotspot, setShowHotspot, showWarning, setShowWarning,
  showStations, setShowStations, mapStyle, setMapStyle,
  nowcastData, isLoadingHotspot, showWind, setShowWind, isLoadingWind, windTime
}: LayerControlProps) {
  const [isOpen, setIsOpen] = useState(true);

  // DATA RADAR
  const { isOffline: balOffline, radarFrames: balFrames } = useRadarLatest("BAL");
  const { isOffline: mtwOffline, radarFrames: mtwFrames } = useRadarLatest("MTW");
  const { isOffline: trkOffline, radarFrames: trkFrames } = useRadarLatest("TRK");

  // DATA SATELIT HIMAWARI
  const { latest: satLatest } = useHimawariData();

  const getLatestTime = (frames: any[]) => {
    if (!frames || frames.length === 0) return null;
    let maxTime = 0;
    frames.forEach((f: any) => {
      const t = new Date(f.timeUTC).getTime();
      if (t > maxTime) maxTime = t;
    });
    if (maxTime === 0) return null;
    return new Date(maxTime).toLocaleTimeString("id-ID", { timeZone: "Asia/Makassar", hour: "2-digit", minute: "2-digit" });
  };

  const balTime = getLatestTime(balFrames); const mtwTime = getLatestTime(mtwFrames); const trkTime = getLatestTime(trkFrames);
  const satTime = satLatest ? new Date(satLatest.timeUTC).toLocaleTimeString("id-ID", { timeZone: "Asia/Makassar", hour: "2-digit", minute: "2-digit" }) : null;

  const ToggleSwitch = ({ checked }: { checked: boolean }) => (
    <div className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors duration-300 ease-in-out ${checked ? 'bg-blue-500' : 'bg-slate-300'}`}>
      <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${checked ? 'translate-x-[14px]' : 'translate-x-0'}`} />
    </div>
  );

  const LayerItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between py-2.5 group focus:outline-none">
      <div className="flex items-center gap-3">
        <div className={`${active ? "text-blue-500" : "text-slate-400 group-hover:text-slate-600"} transition-colors`}>{icon}</div>
        <span className={`text-[11px] tracking-wide transition-colors ${active ? "text-slate-800 font-semibold" : "text-slate-600 font-medium group-hover:text-slate-800"}`}>{label}</span>
      </div>
      <ToggleSwitch checked={active} />
    </button>
  );

  return (
    <div className="absolute top-4 left-4 bottom-4 z-[1000] pointer-events-none flex flex-col">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="pointer-events-auto bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-lg border border-slate-200/60 text-slate-600 hover:text-blue-500 transition-all focus:outline-none w-fit">
          <Layers size={20} />
        </button>
      )}

      {isOpen && (
        <div className="pointer-events-auto bg-white/50 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/80 w-64 overflow-hidden animate-in slide-in-from-left-4 fade-in duration-300 flex flex-col max-h-full">
          
          {/* HEADER */}
          <div className="p-3 flex items-center justify-between border-b border-slate-100 bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-2.5">
              <img src="/logo-bmkg.png" alt="Logo BMKG" className="w-7 h-7 object-contain drop-shadow-sm" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-800 leading-tight">Stasiun Meteorologi</span>
                <span className="text-[9px] font-medium text-slate-500 leading-tight">APT Pranoto Samarinda</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors focus:outline-none">
              <X size={14} />
            </button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
            
            {/* 1. PETA DASAR */}
            <div>
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-2 px-1">Peta Dasar</p>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button onClick={() => setMapStyle('light')} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all ${mapStyle === 'light' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}><Map size={14} /><span className="text-[9px] font-medium">Light</span></button>
                <button onClick={() => setMapStyle('satellite')} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all ${mapStyle === 'satellite' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}><Satellite size={14} /><span className="text-[9px] font-medium">Satelit</span></button>
                <button onClick={() => setMapStyle('dark')} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all ${mapStyle === 'dark' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}><Map size={14} className={mapStyle === 'dark' ? '' : 'opacity-50'} /><span className="text-[9px] font-medium">Dark</span></button>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 2. LAPISAN DATA */}
            <div>
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1 px-1">Lapisan Data</p>
              <div className="flex flex-col">
                
                {/* 👉 SATELIT HIMAWARI */}
                <LayerItem icon={<Satellite size={16} />} label="Satelit Himawari" active={showSatellite} onClick={() => setShowSatellite(!showSatellite)} />
                {showSatellite && (
                  <div className="mt-1 mb-2 bg-slate-50/80 border border-slate-100 rounded-xl p-2.5 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-medium text-slate-700">Citra Satelit</span>
                      <div className="flex items-center gap-1.5 text-[9px]">
                        <span className="text-slate-500 font-normal">{satTime ? `${satTime} WITA` : '--:--'}</span>
                        {!satTime ? <span className="text-blue-500 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Memuat</span> : <span className="text-emerald-600 flex items-center gap-1 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Aktif</span>}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <div className="flex flex-1 h-3 rounded-md overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
                          {['#eb3324', '#f16522', '#f5911e', '#f8b617', '#fdd600', '#e5e51b', '#b6d433', '#83c241', '#40b44a', '#00a859', '#00b08b', '#00b8c9', '#00a0e1', '#0072bc', '#2e3192', '#1b1464'].map((color, idx) => (
                            <div key={idx} className="flex-1" style={{ backgroundColor: color }} />
                          ))}
                        </div>
                        <Info size={14} className="text-slate-400 shrink-0" />
                      </div>
                      <div className="flex justify-between items-center mt-1.5 text-[9px] font-medium text-slate-500">
                        <span>173.15K</span>
                        <span>287.15K</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 👉 RADAR CUACA */}
                <LayerItem icon={<Radar size={16} />} label="Radar Cuaca" active={showRadar} onClick={() => setShowRadar(!showRadar)} />
                {showRadar && (
                  <div className="mt-1 mb-2 bg-slate-50/80 border border-slate-100 rounded-xl p-2.5 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                        <span className="text-[10px] font-medium text-slate-700">Balikpapan</span>
                        <div className="flex items-center gap-1.5 text-[9px]">
                          <span className="text-slate-500 font-normal">{balTime ? `${balTime} WITA` : '--:--'}</span>
                          {!balTime && !balOffline ? <span className="text-blue-500 flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> Memuat</span> : balOffline ? <span className="text-slate-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Off</span> : <span className="text-emerald-600 flex items-center gap-1 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Aktif</span>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                        <span className="text-[10px] font-medium text-slate-700">Muara Teweh</span>
                        <div className="flex items-center gap-1.5 text-[9px]">
                          <span className="text-slate-500 font-normal">{mtwTime ? `${mtwTime} WITA` : '--:--'}</span>
                          {!mtwTime && !mtwOffline ? <span className="text-blue-500 flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> Memuat</span> : mtwOffline ? <span className="text-slate-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Off</span> : <span className="text-emerald-600 flex items-center gap-1 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Aktif</span>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                        <span className="text-[10px] font-medium text-slate-700">Tarakan</span>
                        <div className="flex items-center gap-1.5 text-[9px]">
                          <span className="text-slate-500 font-normal">{trkTime ? `${trkTime} WITA` : '--:--'}</span>
                          {!trkTime && !trkOffline ? <span className="text-blue-500 flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> Memuat</span> : trkOffline ? <span className="text-slate-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Off</span> : <span className="text-emerald-600 flex items-center gap-1 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Aktif</span>}
                        </div>
                      </div>
                    </div>
                    <div className="pt-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex flex-1 h-3 rounded-md overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
                          {['#00e6ff', '#0099ff', '#0000ff', '#00ff00', '#99ff00', '#ffff00', '#ffcc00', '#ff9900', '#ff0000', '#cc0000', '#990000', '#ff00ff'].map((color, idx) => (
                            <div key={idx} className="flex-1" style={{ backgroundColor: color }} />
                          ))}
                        </div>
                        <Info size={14} className="text-slate-400 shrink-0" />
                      </div>
                      <div className="flex justify-between items-center mt-1.5 text-[9px] font-medium text-slate-500">
                        <span>5dBZ</span>
                        <span>65dBZ</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 👉 STASIUN CUACA (ARG/AWS) */}
                <LayerItem icon={<MapPin size={16} />} label="ARG & AWS" active={showStations} onClick={() => setShowStations(!showStations)} />
                {showStations && (
                  <div>
                      <p className="text-[9px] font-medium uppercase tracking-widest text-slate-400 mb-2">Intensitas Hujan (mm)</p>
                      <div className="flex flex-col gap-1.5 bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-[10px] font-light text-slate-600">
                            <div className="w-2.5 h-2.5 rounded-full border-[3px] border-blue-400"></div>0.2 - 5 mm
                          </div>
                          <span className="text-[9px] font-light text-slate-500">Sangat Ringan</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-[10px] font-light text-slate-600">
                            <div className="w-2.5 h-2.5 rounded-full border-[3px] border-emerald-400"></div>5 - 20 mm
                          </div>
                          <span className="text-[9px] font-light text-slate-500">Ringan</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-[10px] font-light text-slate-600">
                            <div className="w-2.5 h-2.5 rounded-full border-[3px] border-yellow-400"></div>20 - 50 mm
                          </div>
                          <span className="text-[9px] font-light text-slate-500">Sedang</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-[10px] font-light text-slate-600">
                            <div className="w-2.5 h-2.5 rounded-full border-[3px] border-orange-400"></div>50 - 100 mm
                          </div>
                          <span className="text-[9px] font-light text-slate-500">Lebat</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-[10px] font-light text-slate-600">
                            <div className="w-2.5 h-2.5 rounded-full border-[3px] border-red-400"></div>100 - 150 mm
                          </div>
                          <span className="text-[9px] font-light text-slate-500">Sangat Lebat</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-[10px] font-light text-slate-600">
                            <div className="w-2.5 h-2.5 rounded-full border-[3px] border-purple-400"></div>&gt; 150 mm
                          </div>
                          <span className="text-[9px] font-light text-slate-500">Ekstrem</span>
                        </div>
                      </div>
                    </div>
                )}

                {/* 👉 TITIK PANAS (HOTSPOT) */}
                <LayerItem icon={<Flame size={16} />} label="Titik Panas (Hotspot)" active={showHotspot} onClick={() => setShowHotspot(!showHotspot)} />
                {showHotspot && (
                  <div className="mt-1 mb-2 bg-slate-50/80 border border-slate-100 rounded-xl p-2.5 flex items-center justify-between text-[9px] font-normal text-slate-600 animate-in fade-in slide-in-from-top-1 duration-200">
                    <span className="flex items-center gap-1 text-slate-500 font-medium">Data Hotspot</span>
                    <div className="flex items-center gap-1.5">
                      {isLoadingHotspot ? <span className="text-orange-500 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm font-medium"><Loader2 size={10} className="animate-spin" /> Memuat</span> : <span className="text-emerald-600 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm font-medium"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Aktif</span>}
                    </div>
                  </div>
                )}
                
                {/* ✅ PERBAIKAN: PERINGATAN DINI MENGGUNAKAN DATA ARCGIS */}
                <LayerItem icon={<AlertTriangle size={16} />} label="Peringatan Dini" active={showWarning} onClick={() => setShowWarning(!showWarning)} />
                {showWarning && (
                  <div className="mt-1 mb-2 bg-slate-50/80 border border-slate-100 rounded-xl p-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    {!nowcastData ? (
                      <div className="flex items-center gap-2 py-1 bg-white px-3 rounded-lg border border-slate-100 shadow-sm w-fit">
                        <Loader2 size={12} className="animate-spin text-slate-400" />
                        <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Sinkronisasi...</span>
                      </div>
                    ) : nowcastData.features?.length === 0 ? (
                      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm w-fit">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] font-medium uppercase tracking-tight">Aman Terkendali</span>
                      </div>
                    ) : (
                      <div className="space-y-2 bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2.5 h-2.5 rounded-full animate-pulse bg-[#fdaf15] shadow-[0_0_8px_rgba(253,175,21,0.5)]`} />
                          <span className="text-[10px] font-bold text-slate-800 leading-tight uppercase">Peringatan Aktif</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-snug line-clamp-2">
                          Terpantau potensi hujan sedang-lebat di <strong className="text-slate-700">{nowcastData.features.length} titik kecamatan</strong>.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 👉 ANGIN 10M */}
                <LayerItem icon={<Wind size={16} />} label="Angin 10m" active={showWind} onClick={() => setShowWind(!showWind)} />
                {showWind && (
                  <div className="mt-1 mb-2 bg-slate-50/80 border border-slate-100 rounded-xl p-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-100 shadow-sm text-[9px]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Model:</span>
                        <span className="font-semibold text-blue-500 uppercase tracking-widest">ECMWF</span>
                      </div>
                      <span className="text-slate-500 font-medium">{windTime ? windTime : '--:--'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}