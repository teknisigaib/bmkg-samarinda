"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { WeatherDataPoint } from "./PrakicuMap";

// IMPORT DATA & KOMPONEN
import { DATA_KALTIM } from "@/data/kaltim-manual"; 
import PrakicuTimeline from "./PrakicuTimeline";
import PrakicuMeteogram from "./PrakicuMeteogram";
import PrakicuAIPanel from "./PrakicuAIPanel";
import { useVoiceCommand, VoiceModalOverlay } from "./PrakicuVoice"; 
import PrakicuLocationNav from "./PrakicuLocationNav";
import PrakicuSideControls from "./PrakicuSideControls";

const MapComponent = dynamic(() => import("./PrakicuMap"), { ssr: false });
const BMKG_API_BASE = "https://cuaca.bmkg.go.id/api/df/v1/forecast/adm";

const mapBMKGWeather = (code: number) => {
  if (code <= 2) return "sunny";               
  if (code > 2 && code <= 45) return "cloudy"; 
  if (code >= 60 && code <= 80) return "rain"; 
  return "storm";                              
};

export default function PrakicuWrapper() {
  const [activeLayer, setActiveLayer] = useState<"icon" | "temp" | "wind">("icon");
  const [activeTimeIndex, setActiveTimeIndex] = useState(0);
  const [currentZoom, setCurrentZoom] = useState<number>(6);
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [rawBmkgData, setRawBmkgData] = useState<any[]>([]);
  const [isLoadingMain, setIsLoadingMain] = useState(true);
  const [isFetchingSub, setIsFetchingSub] = useState(false);
  
  const [isLocating, setIsLocating] = useState(false);
  const [flyToTarget, setFlyToTarget] = useState<{ lat: number; lon: number; zoom: number; ts: number } | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);
  
  const [selectedLocation, setSelectedLocation] = useState<{id: string, name: string, type: string}>({
    id: "64", name: "Kalimantan Timur", type: "provinsi"
  });

  const [lastZoomedId, setLastZoomedId] = useState("");
  const [isAIOpen, setIsAIOpen] = useState(false);

  // =========================================================
  // SISTEM PENGAMAN (Penjaga API & Kunci Animasi Peta)
  // =========================================================
  const fetchedSubAreas = useRef(new Set<string>());
  const isMapFlying = useRef(false);

  // SINKRONISASI DROPDOWN
  const activeKotaId = useMemo(() => {
    const cid = selectedLocation.id?.trim();
    return (!cid || cid === "64") ? "" : cid.substring(0, 5);
  }, [selectedLocation.id]);

  const activeKecamatanId = useMemo(() => {
    const cid = selectedLocation.id?.trim();
    return (selectedLocation.type === 'kecamatan' || selectedLocation.type === 'kelurahan') ? cid.substring(0, 8) : "";
  }, [selectedLocation.id, selectedLocation.type]);

  const availableKecamatan = useMemo(() => {
    if (!activeKotaId) return [];
    const kota = DATA_KALTIM?.find((k: any) => k.id === activeKotaId);
    return kota?.districts || [];
  }, [activeKotaId]);

  // MASTER RESET
  const handleResetMap = () => {
    isMapFlying.current = true;
    setSelectedLocation({ id: "64", name: "Kalimantan Timur", type: "provinsi" });
    setFlyToTarget({ lat: 0.5, lon: 116.4, zoom: 6, ts: Date.now() });
    setLastZoomedId("64");
    setResetTrigger(t => t + 1);
    setTimeout(() => { isMapFlying.current = false; }, 2500);
  };

  // AUTO-RESET SAAT ZOOM OUT
  useEffect(() => {
    if (isMapFlying.current) return;

    if (currentZoom <= 7 && selectedLocation.id !== "64") {
      setSelectedLocation({ id: "64", name: "Kalimantan Timur", type: "provinsi" });
      setLastZoomedId("64");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentZoom]);

  // HANDLERS
  const handleKotaChange = (val: string) => {
    if (!val) { handleResetMap(); return; }
    const kotaManual = DATA_KALTIM.find((k: any) => k.id === val);
    if (kotaManual) {
      setSelectedLocation({ id: val, name: kotaManual.name, type: "kota" });
    }
  };

  const handleKecamatanChange = (val: string) => {
    if (!val) return handleKotaChange(activeKotaId);
    const kotaManual = DATA_KALTIM.find((k: any) => k.id === activeKotaId);
    const kecManual = kotaManual?.districts?.find((d: any) => d.id === val);
    if (kecManual) {
      setSelectedLocation({ id: val, name: kecManual.name, type: "kecamatan" });
    }
  };

  const handleFindLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        isMapFlying.current = true;
        setFlyToTarget({ lat: latitude, lon: longitude, zoom: 11, ts: Date.now() });
        setTimeout(() => { isMapFlying.current = false; }, 2500);

        setUserCoords({ lat: latitude, lon: longitude });

        if (processedData.length > 0) {
          let nearest = processedData[0];
          let minDist = Infinity;
          processedData.forEach(s => {
            const d = Math.sqrt(Math.pow(s.lat - latitude, 2) + Math.pow(s.lon - longitude, 2));
            if (d < minDist) { minDist = d; nearest = s; }
          });
          setSelectedLocation({ id: nearest.id, name: nearest.name, type: nearest.type });
        }
        setIsLocating(false);
      }, () => setIsLocating(false)
    );
  };

  // API FETCHING UTAMA (Provinsi)
  useEffect(() => {
    const fetchBMKGMain = async () => {
      setIsLoadingMain(true);
      try {
        const response = await fetch(`${BMKG_API_BASE}?adm1=64`);
        const json = await response.json();
        if (json && json.data) setRawBmkgData(json.data);
      } catch (error) {} finally { setIsLoadingMain(false); }
    };
    fetchBMKGMain();
  }, []);

  // FETCHING SUB-AREA ANTI-SPAM
  useEffect(() => {
    const sid = selectedLocation.id?.trim();
    if (!sid || sid === "64") return;

    if (fetchedSubAreas.current.has(sid)) return;
    fetchedSubAreas.current.add(sid);

    const fetchSubArea = async () => {
      setIsFetchingSub(true);
      try {
        let url = "";
        if (selectedLocation.type === "kota") url = `${BMKG_API_BASE}?adm2=${sid}`;
        else if (selectedLocation.type === "kecamatan") url = `${BMKG_API_BASE}?adm3=${sid}`;
        else if (selectedLocation.type === "kelurahan") url = `${BMKG_API_BASE}?adm4=${sid}`; 
        
        if (url) {
          const res = await fetch(url);
          const json = await res.json();
          if (json && json.data) {
            setRawBmkgData((prev) => {
              const existingIds = new Set(prev.map((p) => p.lokasi.adm4?.trim() || p.lokasi.adm3?.trim() || p.lokasi.adm2?.trim()));
              const newData = json.data.filter((d: any) => {
                const itemId = d.lokasi.adm4?.trim() || d.lokasi.adm3?.trim() || d.lokasi.adm2?.trim();
                return !existingIds.has(itemId);
              });
              if (newData.length === 0) return prev; 
              return [...prev, ...newData];
            });
          }
        }
      } catch (error) {
        fetchedSubAreas.current.delete(sid);
      } finally { 
        setIsFetchingSub(false); 
      }
    };
    fetchSubArea();
  }, [selectedLocation.id, selectedLocation.type]);

  const processedData = useMemo(() => {
    if (!rawBmkgData || rawBmkgData.length === 0) return [];
    return rawBmkgData.map((item) => {
      const loc = item.lokasi;
      let type: "kota" | "kecamatan" | "kelurahan" = "kota";
      let name = ""; let id = ""; let parentId = "";
      
      if (loc.type === "adm2") { type = "kota"; name = loc.kotkab; id = loc.adm2?.trim(); parentId = loc.adm1?.trim(); } 
      else if (loc.type === "adm3") { type = "kecamatan"; name = loc.kecamatan; id = loc.adm3?.trim(); parentId = loc.adm2?.trim(); } 
      else if (loc.type === "adm4") { type = "kelurahan"; name = loc.desa || loc.kelurahan; id = loc.adm4?.trim(); parentId = loc.adm3?.trim(); }
      
      const hourlyData = item.cuaca.flat().map((w: any) => ({
         time: w.local_datetime.split(" ")[1].substring(0, 5), temp: w.t, windSpeed: w.ws, windDir: w.wd_deg, rain: w.tp || 0, image: w.image, weather: mapBMKGWeather(w.weather)
      }));
      return { id, parentId, name, lat: loc.lat, lon: loc.lon, type, hourly: hourlyData };
    });
  }, [rawBmkgData]);

  // AUTO-LOCK ZOOM
  useEffect(() => {
    if (!selectedLocation.id || selectedLocation.id === "64" || lastZoomedId === selectedLocation.id) return; 
    const station = processedData.find(s => s.id === selectedLocation.id);
    if (station) {
      const zoomLevel = selectedLocation.type === 'kecamatan' ? 12 : (selectedLocation.type === 'kelurahan' ? 14 : 10);
      
      isMapFlying.current = true;
      setFlyToTarget({ lat: Number(station.lat), lon: Number(station.lon), zoom: zoomLevel, ts: Date.now() });
      setLastZoomedId(selectedLocation.id); 
      
      setTimeout(() => { isMapFlying.current = false; }, 2500); 
    }
  }, [selectedLocation.id, selectedLocation.type, processedData, lastZoomedId]);

  const timeLabels = useMemo(() => processedData[0]?.hourly?.slice(0, 8).map((h: any) => h.time) || ["00:00","03:00","06:00","09:00","12:00","15:00","18:00","21:00"], [processedData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeLabels.length > 0) {
      interval = setInterval(() => {
        setActiveTimeIndex((prev) => {
          if (prev >= timeLabels.length - 1) { setIsPlaying(false); setTimeout(() => setActiveTimeIndex(0), 500); return prev; }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLabels.length]);

  const currentMapData: WeatherDataPoint[] = useMemo(() => {
    if (processedData.length === 0) return [];
    let filteredData: any[] = [];
    
    if (currentZoom >= 12 && activeKecamatanId) {
      filteredData = processedData.filter(s => s.type === "kelurahan" && s.parentId === activeKecamatanId);
      if (filteredData.length === 0) filteredData = processedData.filter(s => s.type === "kecamatan" && s.parentId === activeKotaId);
    } 
    else if (currentZoom >= 9 && activeKotaId) {
      filteredData = processedData.filter(s => s.type === "kecamatan" && s.parentId === activeKotaId);
    }
    
    if (filteredData.length === 0) {
      filteredData = processedData.filter(s => s.type === "kota");
    }
    
    return filteredData.map((station) => {
        const activeHour = station.hourly[Math.min(activeTimeIndex, Math.max(0, station.hourly.length - 1))] || station.hourly[0];
        return { id: station.id, name: station.name, lat: station.lat, lon: station.lon, type: station.type as any, temp: activeHour?.temp || 0, windSpeed: activeHour?.windSpeed || 0, windDir: activeHour?.windDir || 0, image: activeHour?.image || "", weather: activeHour?.weather || "sunny" };
    });
  }, [processedData, activeTimeIndex, currentZoom, activeKotaId, activeKecamatanId]);

  const meteogramData = useMemo(() => {
    if (!rawBmkgData || rawBmkgData.length === 0) return [];
    const sid = selectedLocation.id;
    let activeRawData = rawBmkgData.find(d => (d.lokasi.adm4?.trim() === sid) || (d.lokasi.adm3?.trim() === sid) || (d.lokasi.adm2?.trim() === sid));
    
    if (!activeRawData) {
      if (selectedLocation.type === "kelurahan") activeRawData = rawBmkgData.find(d => d.lokasi.adm3?.trim() === sid.substring(0, 8));
      if (!activeRawData && (selectedLocation.type === "kecamatan" || selectedLocation.type === "kelurahan")) {
        activeRawData = rawBmkgData.find(d => d.lokasi.adm2?.trim() === sid.substring(0, 5));
      }
    }

    if (!activeRawData && sid === "64") activeRawData = rawBmkgData.find(d => d.lokasi.type === "adm2");
    if (!activeRawData) return [];
    
    let dayIndex = 0; let lastDate = "";
    return activeRawData.cuaca.flat().map((w: any, i: number) => {
      const datePart = w.local_datetime.split(" ")[0]; 
      const timePart = w.local_datetime.split(" ")[1].substring(0, 5); 
      let isNewDay = (i === 0 || (lastDate !== "" && datePart !== lastDate));
      if (i !== 0 && datePart !== lastDate) dayIndex++;
      lastDate = datePart;

      let dLabel = "";
      if (isNewDay) {
        if (dayIndex === 0) dLabel = "Hari Ini";
        else if (dayIndex === 1) dLabel = "Besok";
        else if (dayIndex === 2) dLabel = "Lusa";
        else dLabel = `${datePart.split("-")[2]}/${datePart.split("-")[1]}`;
      }
      return { id: `mg-${i}`, dayLabel: dLabel, time: timePart, temp: w.t, rain: w.tp || 0, windSpeed: w.ws, windDir: w.wd_deg, image: w.image };
    });
  }, [rawBmkgData, selectedLocation.id, selectedLocation.type]);

  const flatManualData = useMemo(() => {
    const result: { id: string; name: string; type: string }[] = [];
    if (!DATA_KALTIM) return result;
    DATA_KALTIM.forEach((city: any) => {
      result.push({ id: city.id, name: city.name, type: 'kota' });
      city.districts?.forEach((dist: any) => { result.push({ id: dist.id, name: dist.name, type: 'kecamatan' }); });
    });
    return result;
  }, []);

  const { voiceModal, setVoiceModal, handleVoiceCommand } = useVoiceCommand(flatManualData, setFlyToTarget, setSelectedLocation, setIsAIOpen);

  if (isLoadingMain) return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-slate-50 rounded-2xl shadow-sm border border-slate-200">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
      <span className="text-xs font-bold text-slate-400">Sinkronisasi...</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <PrakicuLocationNav 
        activeKotaId={activeKotaId} activeKecamatanId={activeKecamatanId} availableKecamatan={availableKecamatan}
        handleKotaChange={handleKotaChange} handleKecamatanChange={handleKecamatanChange}
      />

      <div className="relative w-full h-[60vh] min-h-[450px] md:min-h-[550px] bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200 z-[1]">
        
        <MapComponent 
          data={currentMapData} activeLayer={activeLayer} onZoomChange={setCurrentZoom} resetTrigger={resetTrigger}
          onMarkerClick={(id, name, type) => {
            setSelectedLocation({ id, name, type: type || 'kota' });
          }}
          activeLocationId={selectedLocation.id} flyToTarget={flyToTarget} userCoords={userCoords}
        />

        <PrakicuSideControls 
          activeLayer={activeLayer} setActiveLayer={setActiveLayer} isLocating={isLocating}
          handleFindLocation={handleFindLocation} handleResetMap={handleResetMap} setIsAIOpen={setIsAIOpen}
          voiceModalIsOpen={voiceModal.isOpen} handleVoiceCommand={handleVoiceCommand}
        />

        <PrakicuTimeline isPlaying={isPlaying} setIsPlaying={setIsPlaying} timeLabels={timeLabels} activeTimeIndex={activeTimeIndex} setActiveTimeIndex={setActiveTimeIndex} />
        <PrakicuAIPanel isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} meteogramData={meteogramData} selectedLocation={selectedLocation} isFetchingSub={isFetchingSub} />
        <VoiceModalOverlay voiceModal={voiceModal} setVoiceModal={setVoiceModal} handleVoiceCommand={handleVoiceCommand} />
      </div>

      <PrakicuMeteogram meteogramData={meteogramData} isFetchingSub={isFetchingSub} selectedLocation={selectedLocation} />
    </div>
  );
}