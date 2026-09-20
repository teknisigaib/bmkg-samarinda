"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, AlertCircle, AlignLeft, CalendarClock, ShieldCheck, Download, Info } from 'lucide-react';
import ClimateLayerControl from './ClimateLayerControl';
import ImageLightbox from '@/components/ui/ImageLightbox'; 

export interface ApiMetadata {
  map_type: string;
  period: string;
  update_time: string;
  analysis_text: string;
  legend: { min_value: number; max_value: number; range_text: string; color: string; category: string }[];
  image_url?: string; 
  author?: string;
  creator?: string;
  unit?: string;
}

export default function ClimateMap() {
  const [mapStyle, setMapStyle] = useState('light');
  const [activeProduct, setActiveProduct] = useState('sebaran_hujan_harian');
  const [activeQueryParams, setActiveQueryParams] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [mapMetadata, setMapMetadata] = useState<ApiMetadata | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); 

  const getBasemapUrl = () => {
    if (mapStyle === 'dark') return "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png?key=cb1_32wf_1_a69d1812376e13fad46ef99a";
    if (mapStyle === 'satellite') return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    return "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=cb1_32wf_1_a69d1812376e13fad46ef99a"; 
  };

  useEffect(() => {
    if (!activeProduct || !activeQueryParams) {
      setGeoData(null);
      setMapMetadata(null);
      setErrorMsg('');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setErrorMsg('');
      setGeoData(null);
      setMapMetadata(null);

      try {
        const apiUrl = `https://webgis.bmkgaptpranoto.com/api/v1/maps/search?category=${activeProduct}&${activeQueryParams}`;
        const res = await fetch(apiUrl);
        
        // 🚀 FIX 1: TANGKAP ERROR 404 SECARA SPESIFIK
        if (res.status === 404) {
          throw new Error("NOT_FOUND");
        }
        if (!res.ok) {
          throw new Error("SERVER_ERROR");
        }
        
        const json = await res.json();
        if (json.status !== "success" || !json.data || !json.data.geojson_url) {
           throw new Error("Data GeoJSON tidak ditemukan untuk periode ini.");
        }

        const geojsonRes = await fetch(json.data.geojson_url);
        if (!geojsonRes.ok) throw new Error("Gagal mengunduh file GeoJSON.");
        let geojsonData = await geojsonRes.json();

        if (geojsonData.features && Array.isArray(geojsonData.features)) {
          geojsonData.features = geojsonData.features.filter((feature: any) => {
            if (feature.properties) {
              if (feature.properties.nama === "NaN" || feature.properties.nama === "nan") return false;
              if (feature.properties.val === "NaN" || feature.properties.val === "nan") return false;
            }
            if (feature.geometry?.type === 'Point') {
              const coords = feature.geometry.coordinates;
              if (!coords || coords.length < 2) return false;
              if (coords[0] === null || Number.isNaN(coords[0]) || coords[0] === "NaN") return false;
              if (coords[1] === null || Number.isNaN(coords[1]) || coords[1] === "NaN") return false;
            }
            return true;
          });
        }

        setGeoData(geojsonData);
        
        const baseMetadata = geojsonData.metadata ? { ...geojsonData.metadata } : {
            map_type: json.data.title,
            period: json.data.period,
            update_time: json.data.update_time,
            analysis_text: json.data.analysis_text,
            legend: []
        };
        baseMetadata.image_url = json.data.image_url; 
        
        setMapMetadata(baseMetadata);

      } catch (err: any) {
        console.error("Fetch Data Error:", err);
        // 🚀 FIX 2: UBAH PESAN BERDASARKAN ERROR
        if (err.message === "NOT_FOUND") {
           setErrorMsg("Data belum tersedia untuk tanggal atau periode tersebut.");
        } else if (err.message === "SERVER_ERROR") {
           setErrorMsg("Terjadi kesalahan pada server saat mengambil data.");
        } else {
           setErrorMsg(err.message || "Terjadi kesalahan.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const timeout = setTimeout(() => { fetchData(); }, 500);
    return () => clearTimeout(timeout);
  }, [activeProduct, activeQueryParams]);

  // KOMPONEN KARTU ANALISIS
  const AnalysisCard = () => {
    if (!mapMetadata || isLoading || errorMsg) return null;
    return (
      <div className="bg-white md:bg-white/95 backdrop-blur-md rounded-2xl md:rounded-xl shadow-sm md:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/80 p-4 pointer-events-auto md:animate-in md:fade-in md:slide-in-from-bottom-4">
         
         <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
            <AlignLeft className="w-4 h-4 text-blue-500" />
            <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">Info & Analisis Peta</h4>
         </div>

         {/* GRID DATA METADATA */}
         <div className="mb-3 grid grid-cols-2 gap-x-2 gap-y-3 bg-slate-50 p-3 rounded-lg border border-slate-100/80">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <CalendarClock className="w-3 h-3 text-slate-400" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Periode</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-700 leading-tight truncate">
                {mapMetadata.period || "-"}
              </span>
            </div>
            
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-slate-400" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Update</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-700 leading-tight truncate">
                {mapMetadata.update_time || "-"}
              </span>
            </div>

            {/* AUTHOR / SUMBER */}
            <div className="col-span-2 flex flex-col gap-1 border-t border-slate-200/60 pt-3">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-blue-500" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Author / Stasiun</span>
              </div>
              <span className="text-[10px] font-semibold text-blue-700 leading-tight">
                {mapMetadata.author || "-"}
              </span>
            </div>

            {/* KREATOR (TIM) */}
            <div className="flex flex-col gap-1 border-t border-slate-200/60 pt-3">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-blue-500" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Kreator (Tim)</span>
              </div>
              <span className="text-[10px] font-semibold text-blue-700 leading-tight truncate">
                {mapMetadata.creator || "-"}
              </span>
            </div>

            {/* SATUAN */}
            <div className="flex flex-col gap-1 border-t border-slate-200/60 pt-3">
              <div className="flex items-center gap-1.5">
                <Info className="w-3 h-3 text-blue-500" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Satuan</span>
              </div>
              <span className="text-[10px] font-semibold text-blue-700 leading-tight truncate">
                {mapMetadata.unit || "-"}
              </span>
            </div>
         </div>

         {/* TEKS ANALISIS */}
         <div className="max-h-[30vh] md:max-h-32 overflow-y-auto custom-scrollbar pr-2 text-[10.5px] text-slate-600 font-medium leading-relaxed text-justify mb-3">
            {mapMetadata.analysis_text || "Tidak ada narasi analisis yang tersedia untuk periode ini."}
         </div>

         {/* TOMBOL GAMBAR PETA */}
         {mapMetadata.image_url && (
            <button 
                onClick={() => setIsLightboxOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-600 rounded-lg transition-colors group focus:outline-none shadow-sm"
            >
                <Download size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Lihat Gambar Peta</span>
            </button>
         )}
      </div>
    );
  };

  return (
    <>
      <div className="w-full flex flex-col md:block">
        
        <style dangerouslySetInnerHTML={{__html: `
          .solid-popup .leaflet-popup-content-wrapper { background-color: #ffffff !important; border-radius: 12px !important; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important; border: 1px solid #cbd5e1 !important; padding: 0 !important; opacity: 1 !important; }
          .solid-popup .leaflet-popup-content { margin: 14px !important; opacity: 1 !important; }
          .solid-popup .leaflet-popup-tip { background-color: #ffffff !important; border-top: 1px solid #cbd5e1 !important; border-left: 1px solid #cbd5e1 !important; opacity: 1 !important; }
          .solid-popup .leaflet-popup-close-button { color: #94a3b8 !important; margin-top: 12px !important; margin-right: 12px !important; transition: all 0.2s; }
          .solid-popup .leaflet-popup-close-button:hover { color: #ef4444 !important; background-color: #fef2f2 !important; border-radius: 6px !important; }
        `}} />

        {/* 1. MAP ENGINE LAYER */}
        <div className="relative w-full h-[65vh] min-h-[450px] md:h-[75vh] md:min-h-[600px] bg-slate-100 rounded-2xl overflow-hidden shadow-xl border border-slate-200">
          
          <div className="absolute inset-0 z-0">
            <MapContainer 
              center={[-0.502, 117.153]} 
              zoom={7} 
              zoomControl={false}
              className="w-full h-full bg-[#e2e8f0]"
            >
              <TileLayer key={mapStyle} url={getBasemapUrl()} attribution='&copy; CARTO' />
              <ZoomControl position="topright" />
              
              {geoData && (
                <GeoJSON 
                  key={`${activeProduct}-${activeQueryParams}`} 
                  data={geoData} 
                  style={(feature) => ({
                    color: feature?.properties?.stroke || '#ffffff',
                    weight: feature?.properties?.['stroke-width'] ?? 0.5,
                    opacity: feature?.properties?.['stroke-opacity'] ?? 0.8,
                    fillOpacity: feature?.properties?.['fill-opacity'] ?? 0.85,
                    fillColor: feature?.properties?.fill || '#cbd5e1'
                  })}
                  pointToLayer={(feature, latlng) => {
                    if (feature.geometry.type === 'Point' || activeProduct === 'hari_tanpa_hujan') {
                       return L.circleMarker(latlng, {
                         radius: 6, 
                         fillColor: feature?.properties?.fill || '#ef4444', 
                         color: '#ffffff', 
                         weight: 1.5, 
                         opacity: 1, 
                         fillOpacity: 1
                       });
                    }
                    return L.marker(latlng);
                  }}
                  onEachFeature={(feature, layer) => {
                    if (feature.properties) {
                      const props = feature.properties;
                      const color = props.fill || '#3b82f6';
                      
                      const isPointData = feature.geometry.type === 'Point' || props.nama !== undefined;
                      const titleLabel = isPointData ? 'Stasiun / Lokasi' : 'Kategori Area';
                      const titleValue = isPointData ? (props.nama || 'Lokasi Tidak Diketahui') : (props.category || 'Tidak Ada Data');
                      const unitLabel = isPointData && activeProduct === 'hari_tanpa_hujan' ? 'Hari' : (geoData?.metadata?.unit || '');
                      
                      layer.bindPopup(`
                        <div class="min-w-[180px] flex flex-col font-sans">
                          <div class="flex items-center gap-2 mb-2">
                            <div class="flex items-center justify-center w-6 h-6 rounded border border-slate-200 bg-slate-50 shadow-sm shrink-0">
                              <div class="w-3 h-3 rounded-full border border-black/10" style="background-color: ${color}"></div>
                            </div>
                            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">${titleLabel}</span>
                          </div>
                          <h4 class="text-[13px] font-black text-slate-800 leading-tight mb-3 pr-4">${titleValue}</h4>
                          <div class="bg-blue-50 border border-blue-100 rounded-md p-2.5 flex flex-col gap-0.5">
                            <span class="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Nilai Pengukuran</span>
                            <div class="flex items-baseline gap-1">
                              <span class="text-[14px] font-black text-blue-900 font-mono tracking-tight">${props.range_text || props.val || '-'}</span>
                              <span class="text-[10px] font-bold text-blue-700">${unitLabel}</span>
                            </div>
                          </div>
                        </div>
                      `, { className: 'solid-popup', minWidth: 200 });
                    }
                  }}
                />
              )}
            </MapContainer>
          </div>

          <ClimateLayerControl 
            activeProduct={activeProduct} setActiveProduct={setActiveProduct}
            activeQueryParams={activeQueryParams} setActiveQueryParams={setActiveQueryParams}
            mapStyle={mapStyle} setMapStyle={setMapStyle}
            mapMetadata={mapMetadata} isLoading={isLoading}
          />

          {isLoading && (
            <div className="absolute inset-0 z-[1500] flex items-center justify-center bg-white/40 backdrop-blur-sm pointer-events-none">
              <div className="bg-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100">
                 <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                 <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Loading ...</span>
              </div>
            </div>
          )}
          
          {/* 🚀 FIX 3: OVERLAY NOTIFIKASI ERROR (Blur Kaca) */}
          {errorMsg && !isLoading && (
            <div className="absolute inset-0 z-[800] flex items-center justify-center bg-slate-100/50 backdrop-blur-sm pointer-events-none transition-all">
              <div className="bg-white px-6 py-4 rounded-xl shadow-xl flex flex-col items-center gap-2 border border-slate-200 text-center animate-in zoom-in-95 duration-200 max-w-[250px]">
                 <span className="text-sm font-black text-slate-800 uppercase tracking-widest">
                    Tidak Ada Data
                 </span>
                 <span className="text-[10.5px] text-slate-500 font-medium leading-relaxed">
                    {errorMsg}
                 </span>
              </div>
            </div>
          )}

          {/* 2A. PANEL KARTU INFORMASI (DESKTOP SAJA) */}
          <div className="hidden md:flex absolute bottom-4 right-4 z-[900] w-[360px] pointer-events-none flex-col">
            <AnalysisCard />
          </div>

        </div>

        {/* 2B. PANEL KARTU INFORMASI (MOBILE SAJA) */}
        <div className="flex md:hidden mt-4 w-full px-1">
          <AnalysisCard />
        </div>
        
      </div>

      {/* RENDER MODAL GAMBAR */}
      <ImageLightbox 
        isOpen={isLightboxOpen}
        imageUrl={mapMetadata?.image_url || null}
        title={mapMetadata?.map_type || "Peta Iklim Interaktif"}
        description={`Periode Data: ${mapMetadata?.period || "-"}`}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
}