"use client";

import { useState } from "react";
import { Layers, Radar, Satellite, Flame, AlertTriangle, X, Map, MapPin, Wind, Loader2, ShieldCheck } from "lucide-react";

import { useRadarLatest } from "@/components/hooks/useRadarLatest";
import { useHimawariData } from "@/components/hooks/useHimawariData";

interface LayerControlProps {
  showRadar: boolean;
  setShowRadar: (val: boolean) => void;
  showSatellite: boolean;
  setShowSatellite: (val: boolean) => void;
  showHotspot: boolean;
  setShowHotspot: (val: boolean) => void;
  showWarning: boolean;
  setShowWarning: (val: boolean) => void;
  showStations: boolean;
  setShowStations: (val: boolean) => void;
  mapStyle: string;
  setMapStyle: (val: string) => void;
  capData?: any; 
  isLoadingHotspot: boolean; // 👉 Prop baru untuk loading hotspot
  showWind: boolean; setShowWind: (val: boolean) => void;
  isLoadingWind: boolean; windTime: string | null;
}

export default function LayerControl({
  showRadar, setShowRadar,
  showSatellite, setShowSatellite,
  showHotspot, setShowHotspot,
  showWarning, setShowWarning,
  showStations, setShowStations,
  mapStyle, setMapStyle,
  capData,
  isLoadingHotspot, // 👉 Destructure prop baru
  showWind, setShowWind, isLoadingWind, windTime
}: LayerControlProps) {
  const [isOpen, setIsOpen] = useState(true);

  // DATA RADAR
  const { isOffline: balOffline, radarFrames: balFrames } = useRadarLatest("BAL");
  const { isOffline: mtwOffline, radarFrames: mtwFrames } = useRadarLatest("MTW");
  const { isOffline: trkOffline, radarFrames: trkFrames } = useRadarLatest("TRK");

  // DATA SATELIT HIMAWARI
  const { latest: satLatest } = useHimawariData();

  // Helper Jam Radar
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

  const balTime = getLatestTime(balFrames);
  const mtwTime = getLatestTime(mtwFrames);
  const trkTime = getLatestTime(trkFrames);
  const satTime = satLatest ? new Date(satLatest.timeUTC).toLocaleTimeString("id-ID", { timeZone: "Asia/Makassar", hour: "2-digit", minute: "2-digit" }) : null;

  const ToggleSwitch = ({ checked }: { checked: boolean }) => (
    <div className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors duration-300 ease-in-out ${checked ? 'bg-blue-500' : 'bg-slate-300'}`}>
      <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${checked ? 'translate-x-[14px]' : 'translate-x-0'}`} />
    </div>
  );

  const LayerItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between py-2.5 group focus:outline-none">
      <div className="flex items-center gap-3">
        <div className={`${active ? "text-blue-500" : "text-slate-400 group-hover:text-slate-600"} transition-colors`}>
          {icon}
        </div>
        <span className={`text-[11px] tracking-wide transition-colors ${active ? "text-slate-800 font-semibold" : "text-slate-600 font-medium group-hover:text-slate-800"}`}>
          {label}
        </span>
      </div>
      <ToggleSwitch checked={active} />
    </button>
  );

  return (
    <div className="absolute top-4 left-4 z-[1000] pointer-events-none flex flex-col gap-2">
      
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="pointer-events-auto bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-lg border border-slate-200/60 text-slate-600 hover:text-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          title="Buka Panel Layer"
        >
          <Layers size={20} />
        </button>
      )}

      {isOpen && (
        <div className="pointer-events-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/80 w-64 overflow-hidden animate-in slide-in-from-left-4 fade-in duration-300 flex flex-col max-h-[85vh]">
          
          <div className="p-3 flex items-center justify-between border-b border-slate-100 bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Layers size={14} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Kontrol Peta</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors focus:outline-none">
              <X size={14} />
            </button>
          </div>

          <div className="p-4 space-y-5 overflow-y-auto custom-scrollbar">
            
            {/* Bagian 1: Peta Dasar */}
            <div>
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-2.5 px-1">Peta Dasar</p>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setMapStyle('light')}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all ${mapStyle === 'light' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Map size={14} />
                  <span className="text-[9px] font-medium">Light</span>
                </button>
                <button 
                  onClick={() => setMapStyle('satellite')}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all ${mapStyle === 'satellite' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Satellite size={14} />
                  <span className="text-[9px] font-medium">Satelit</span>
                </button>
                <button 
                  onClick={() => setMapStyle('dark')}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all ${mapStyle === 'dark' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Map size={14} className={mapStyle === 'dark' ? '' : 'opacity-50'} />
                  <span className="text-[9px] font-medium">Dark</span>
                </button>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Bagian 2: Titik Stasiun */}
            <div>
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Stasiun Pengamatan</p>
              <div className="flex flex-col px-1">
                <LayerItem icon={<MapPin size={16} />} label="Stasiun Cuaca" active={showStations} onClick={() => setShowStations(!showStations)} />
                
                {showStations && (
                  <div className="ml-7 mr-1 mt-1 mb-2 bg-slate-50 border border-slate-100 rounded-lg p-2.5 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-600">
                        <div className="w-2.5 h-2.5 bg-slate-400" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div> ARG
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-600">
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-400"></div> AWS
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60">
                      <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-600">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div> Online
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-600">
                        <div className="w-2 h-2 rounded-full bg-slate-400"></div> Offline
                      </div>
                    </div>

                    <div className="pt-2 mt-1 border-t border-slate-200/60">
                      <p className="text-[8px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Curah Hujan (mm)</p>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-[9px] font-medium text-slate-600">
                          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full border-[2.5px] border-slate-300"></div>0-5</div>
                          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full border-[2.5px] border-sky-400"></div>5-20</div>
                          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full border-[2.5px] border-yellow-400"></div>20-50</div>
                        </div>
                        <div className="flex justify-start gap-4 items-center text-[9px] font-medium text-slate-600">
                          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full border-[2.5px] border-orange-500"></div>50-100</div>
                          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full border-[2.5px] border-red-500"></div>&gt;100</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Bagian 3: Lapisan Data */}
            <div>
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Lapisan Data</p>
              <div className="flex flex-col px-1">
                
                {/* SATELIT HIMAWARI */}
                <LayerItem icon={<Satellite size={16} />} label="Satelit Himawari" active={showSatellite} onClick={() => setShowSatellite(!showSatellite)} />
                {showSatellite && (
                  <div className="ml-7 mr-1 mb-2 bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-center justify-between text-[9px] font-medium text-slate-600 animate-in fade-in slide-in-from-top-1 duration-200">
                    <span className="flex items-center gap-1 text-slate-500">Citra Satelit</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-bold">{satTime ? `${satTime} WITA` : '--:--'}</span>
                      {!satTime ? (
                        <span className="text-blue-500 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Memuat</span>
                      ) : (
                        <span className="text-emerald-600 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Aktif</span>
                      )}
                    </div>
                  </div>
                )}

                {/* RADAR CUACA */}
                <LayerItem icon={<Radar size={16} />} label="Radar Cuaca" active={showRadar} onClick={() => setShowRadar(!showRadar)} />
                {showRadar && (
                  <div className="ml-7 mr-1 mb-2 bg-slate-50 border border-slate-100 rounded-lg p-2.5 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex justify-between items-center text-[9px] font-medium text-slate-600">
                      <span className="flex items-center gap-1">Balikpapan</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-bold">{balTime ? `${balTime} WITA` : '--:--'}</span>
                        {!balTime && !balOffline ? (
                           <span className="text-blue-500 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Memuat</span>
                        ) : balOffline ? (
                          <span className="text-slate-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Off</span>
                        ) : (
                          <span className="text-emerald-600 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Aktif</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-medium text-slate-600">
                      <span className="flex items-center gap-1">Muara Teweh</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-bold">{mtwTime ? `${mtwTime} WITA` : '--:--'}</span>
                        {!mtwTime && !mtwOffline ? (
                           <span className="text-blue-500 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Memuat</span>
                        ) : mtwOffline ? (
                          <span className="text-slate-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Off</span>
                        ) : (
                          <span className="text-emerald-600 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Aktif</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-medium text-slate-600">
                      <span className="flex items-center gap-1">Tarakan</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-bold">{trkTime ? `${trkTime} WITA` : '--:--'}</span>
                        {!trkTime && !trkOffline ? (
                           <span className="text-blue-500 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Memuat</span>
                        ) : trkOffline ? (
                          <span className="text-slate-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Off</span>
                        ) : (
                          <span className="text-emerald-600 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Aktif</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 👉 TITIK PANAS (HOTSPOT) DENGAN LOADING INDICATOR */}
                <LayerItem icon={<Flame size={16} />} label="Titik Panas (Hotspot)" active={showHotspot} onClick={() => setShowHotspot(!showHotspot)} />
                {showHotspot && (
                  <div className="ml-7 mr-1 mb-2 bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-center justify-between text-[9px] font-medium text-slate-600 animate-in fade-in slide-in-from-top-1 duration-200">
                    <span className="flex items-center gap-1 text-slate-500">Data H-1 BMKG</span>
                    <div className="flex items-center gap-1.5">
                      {isLoadingHotspot ? (
                        <span className="text-orange-500 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Memuat</span>
                      ) : (
                        <span className="text-emerald-600 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Aktif</span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* PERINGATAN DINI DENGAN INFO CAP */}
                <LayerItem icon={<AlertTriangle size={16} />} label="Peringatan Dini" active={showWarning} onClick={() => setShowWarning(!showWarning)} />
                
                {showWarning && (
                  <div className="ml-7 mr-1 mt-1 mb-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    {!capData ? (
                      <div className="flex items-center gap-2 py-1">
                        <Loader2 size={12} className="animate-spin text-slate-400" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi...</span>
                      </div>
                    ) : !capData.active ? (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <ShieldCheck size={14} />
                        <span className="text-[9px] font-bold uppercase tracking-tight">Kondisi Aman</span>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full animate-pulse ${
                            capData.severity === 'Severe' ? 'bg-orange-500' : 
                            capData.severity === 'Extreme' ? 'bg-red-500' : 'bg-yellow-500'
                          }`} />
                          <span className="text-[10px] font-black text-slate-800 leading-tight uppercase">
                            {capData.event}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-500 italic leading-tight line-clamp-2">
                          "{capData.headline}"
                        </p>
                        <div className="pt-1.5 border-t border-slate-100 flex justify-between items-center">
                          <span className="text-[8px] font-bold text-slate-400 uppercase">BMKG CAP</span>
                          {capData.web && (
                            <a href={capData.web} target="_blank" rel="noopener noreferrer" className="text-[8px] font-bold text-blue-500 hover:underline">
                              DETAIL
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 👉 ARAH ANGIN (STREAMLINES) */}
                <LayerItem icon={<Wind size={16} />} label="Arah Angin (Streamlines)" active={showWind} onClick={() => setShowWind(!showWind)} />
                {showWind && (
                  <div className="ml-7 mr-1 mb-2 bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-center justify-between text-[9px] font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                    
                    {/* 👇 INFO KETINGGIAN & SUMBER MODEL 👇 */}
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1 text-slate-600 font-bold">
                        Ketinggian 10m
                      </span>
                      <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">
                        Model: ECMWF
                      </span>
                    </div>

                    {/* STATUS WAKTU & LOADING */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-bold">{windTime ? windTime : '--:--'}</span>
                      {isLoadingWind ? (
                        <span className="text-blue-500 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Memuat</span>
                      ) : (
                        <span className="text-emerald-600 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Aktif</span>
                      )}
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