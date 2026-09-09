"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, FileText, AlertCircle, MapPin } from 'lucide-react';
import ClimateLayerControl from './ClimateLayerControl';

export default function ClimateMap() {
  const [activeProduct, setActiveProduct] = useState('sebaran_hujan_harian');
  const [activePeriod, setActivePeriod] = useState('latest');
  const [mapStyle, setMapStyle] = useState('light');
  
  const [isLoading, setIsLoading] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [mapInfo, setMapInfo] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // State untuk nyimpen GeoJSON Masking Luar Kaltim
  const [kaltimMask, setKaltimMask] = useState<any>(null);

  const getBasemapUrl = () => {
    if (mapStyle === 'dark') return "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png";
    if (mapStyle === 'satellite') return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    return "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"; 
  };

  // 1. FETCH & BUAT MASKING LUAR KALTIM (Inverted Polygon)
  useEffect(() => {
    fetch('/geojson/WilayahKaltim1.json')
      .then(res => res.json())
      .then(data => {
        // Kotak raksasa penutup peta (dari Lng 90 sampai 140, menutupi area Indonesia)
        const boundingBox = [
          [90, -20], [140, -20], [140, 20], [90, 20], [90, -20]
        ];

        let holes: any[] = [];
        const features = data.features || [data];
        
        // Ambil batas luar area Kaltim dan jadikan "lubang" di dalam kotak raksasa
        features.forEach((feature: any) => {
          if (feature.geometry.type === 'Polygon') {
            holes.push(feature.geometry.coordinates[0]);
          } else if (feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates.forEach((poly: any) => {
              holes.push(poly[0]);
            });
          }
        });

        const maskGeoJSON = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [boundingBox, ...holes] // Array pertama adalah luar, sisanya adalah lubang
              },
              properties: {}
            }
          ]
        };

        setKaltimMask(maskGeoJSON);
      })
      .catch(err => console.error("Gagal memuat masking Kaltim:", err));
  }, []);

  // 2. FETCH DATA API WEBGIS IKLIM (DENGAN ANTI-NaN FILTER)
  useEffect(() => {
    const fetchMapData = async () => {
      setIsLoading(true);
      setErrorMsg(null);
      setGeoData(null);
      setMapInfo(null);

      try {
        const metaRes = await fetch(`https://webgis.bmkgaptpranoto.com/api/v1/maps/latest?category=${activeProduct}`);
        const metaJson = await metaRes.json();

        if (metaJson.status === 'success' && metaJson.data?.geojson_url) {
          setMapInfo(metaJson.data);
          
          const geoRes = await fetch(metaJson.data.geojson_url);
          const rawText = await geoRes.text();
          const cleanText = rawText.replace(/\bNaN\b/g, "null"); 
          let geoJsonData = JSON.parse(cleanText);
          
          if (geoJsonData.features && Array.isArray(geoJsonData.features)) {
            geoJsonData.features = geoJsonData.features.filter((feature: any) => {
              if (feature.properties) {
                if (feature.properties.nama === "NaN" || feature.properties.nama === "nan" || feature.properties.nama === null) return false;
                if (feature.properties.val === "NaN" || feature.properties.val === "nan" || feature.properties.val === null) return false;
              }
              if (feature.geometry?.type === 'Point') {
                const coords = feature.geometry.coordinates;
                if (!coords || coords.length < 2) return false;
                if (coords[0] === null || Number.isNaN(coords[0])) return false;
                if (coords[1] === null || Number.isNaN(coords[1])) return false;
              }
              return true; 
            });
          }
          
          setGeoData(geoJsonData);
        } else {
          setErrorMsg("Data belum tersedia untuk produk ini.");
        }
      } catch (err) {
        console.error("Gagal menarik data WebGIS:", err);
        setErrorMsg("Gagal memproses data WebGIS. Periksa format data dari server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMapData();
  }, [activeProduct, activePeriod]);

  const dynamicLegend = geoData?.metadata?.legend || mapInfo?.legend || [];

  return (
    <div className="w-full h-full bg-slate-100 overflow-hidden rounded-2xl relative flex">
      
      <style dangerouslySetInnerHTML={{__html: `
        .solid-popup .leaflet-popup-content-wrapper {
          background-color: #ffffff !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
          border: 1px solid #cbd5e1 !important;
          padding: 0 !important;
          opacity: 1 !important;
        }
        .solid-popup .leaflet-popup-content {
          margin: 14px !important;
          opacity: 1 !important;
        }
        .solid-popup .leaflet-popup-tip {
          background-color: #ffffff !important;
          border-top: 1px solid #cbd5e1 !important;
          border-left: 1px solid #cbd5e1 !important;
          opacity: 1 !important;
        }
        .solid-popup .leaflet-popup-close-button {
          color: #94a3b8 !important;
          margin-top: 12px !important;
          margin-right: 12px !important;
          transition: all 0.2s;
        }
        .solid-popup .leaflet-popup-close-button:hover {
          color: #ef4444 !important;
          background-color: #fef2f2 !important;
          border-radius: 6px !important;
        }
      `}} />

      {/* MAP ENGINE LAYER */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={[-0.502, 117.153]} 
          zoom={7} 
          zoomControl={false}
          className="w-full h-full bg-[#e2e8f0]"
        >
          <TileLayer key={mapStyle} url={getBasemapUrl()} attribution='&copy; BMKG' />
          <ZoomControl position="topright" />

          {/* LAYER 1: MASKING LUAR KALTIM (Area Gelap & Garis Lurus Tipis) */}
          {kaltimMask && (
            <GeoJSON 
              data={kaltimMask}
              style={{
                fillColor: '#0f172a', // Warna gelap masking (Slate-900)
                fillOpacity: 0.65, // Seberapa gelap area luar kaltim
                color: mapStyle === 'dark' ? '#94a3b8' : '#334155', // Garis perbatasan
                weight: 0.3, // Garis Lurus SANGAT TIPIS
                dashArray: '', // Pastikan lurus tanpa titik-titik
                opacity: 1 // Garisnya terlihat tajam
              }}
              interactive={false} // Cegah area gelap nyedot klik mouse
            />
          )}
          
          {/* LAYER 2: DATA IKLIM DARI API */}
          {geoData && geoData.features.length > 0 && (
            <GeoJSON 
              key={geoData.metadata?.update_time || activeProduct}
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
                   if (isNaN(latlng.lat) || isNaN(latlng.lng)) return L.marker([0,0], {opacity: 0});
                   
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
                  
                  if (props.nama === "NaN" || Number.isNaN(props.val)) return;

                  layer.bindPopup(`
                    <div class="min-w-[180px] flex flex-col font-sans">
                      <div class="flex items-center gap-2 mb-2">
                        <div class="flex items-center justify-center w-6 h-6 rounded border border-slate-200 bg-slate-50 shadow-sm shrink-0">
                          <div class="w-3 h-3 rounded-full border border-black/10" style="background-color: ${color}"></div>
                        </div>
                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">${titleLabel}</span>
                      </div>
                      
                      <h4 class="text-[13px] font-black text-slate-800 leading-tight mb-3 pr-4">
                        ${titleValue}
                      </h4>
                      
                      <div class="bg-blue-50 border border-blue-100 rounded-md p-2.5 flex flex-col gap-0.5">
                        <span class="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Nilai Pengukuran</span>
                        <div class="flex items-baseline gap-1">
                          <span class="text-[14px] font-black text-blue-900 font-mono tracking-tight">${props.range_text || props.val || '-'}</span>
                          <span class="text-[10px] font-bold text-blue-700">${unitLabel}</span>
                        </div>
                      </div>
                    </div>
                  `, {
                    className: 'solid-popup', 
                    minWidth: 200,
                  });
                }
              }}
            />
          )}
        </MapContainer>
      </div>

      <ClimateLayerControl 
        activeProduct={activeProduct} setActiveProduct={setActiveProduct}
        activePeriod={activePeriod} setActivePeriod={setActivePeriod}
        isLoading={isLoading} mapStyle={mapStyle} setMapStyle={setMapStyle}
      />

      {isLoading && (
        <div className="absolute inset-0 z-[1500] flex items-center justify-center bg-white/30 backdrop-blur-sm pointer-events-none transition-all">
          <div className="bg-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-100">
             <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
             <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">Sinkronisasi Peta...</span>
          </div>
        </div>
      )}
      
      {errorMsg && !isLoading && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1500] bg-white px-4 py-2.5 rounded-xl shadow-lg border border-red-200 flex items-center gap-2.5">
           <div className="bg-red-50 p-1.5 rounded-md"><AlertCircle className="w-4 h-4 text-red-600" /></div>
           <span className="text-[11px] font-bold text-slate-700 tracking-wide">{errorMsg}</span>
        </div>
      )}

      {geoData && (
        <div className="absolute bottom-4 right-4 z-[900] flex flex-col gap-3">
          
          <div className="bg-white rounded-xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] border border-slate-200/80 w-[240px] sm:w-[320px] overflow-hidden flex flex-col animate-in slide-in-from-bottom-2">
             <div className="bg-slate-50 px-3 py-2.5 flex items-center gap-2 border-b border-slate-100">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Narasi Analisis</span>
             </div>
             <div className="p-3.5 bg-white">
               <p className="text-[11px] leading-relaxed text-slate-600 text-justify line-clamp-4 hover:line-clamp-none transition-all cursor-pointer">
                 {geoData?.metadata?.ai_analysis || mapInfo?.analysis_text || "Tidak ada narasi yang tersedia."}
               </p>
             </div>
          </div>

          {dynamicLegend.length > 0 && (
            <div className="bg-white rounded-xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] border border-slate-200/80 w-[240px] sm:w-[320px] flex flex-col self-end overflow-hidden animate-in slide-in-from-bottom-4">
              <div className="bg-slate-50 border-b border-slate-100 px-3 py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-800 tracking-wider uppercase block">{mapInfo?.title || 'LEGENDA'}</span>
                  <span className="text-[9px] text-slate-500 font-medium">Periode: {mapInfo?.period}</span>
                </div>
                <MapPin className="w-4 h-4 text-slate-300" />
              </div>
              
              <div className="p-3 flex flex-col gap-2 max-h-[220px] overflow-y-auto custom-scrollbar bg-white">
                {dynamicLegend.map((leg: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div 
                      className={`shrink-0 border border-slate-200 shadow-sm ${activeProduct === 'hari_tanpa_hujan' ? 'w-3.5 h-3.5 rounded-full' : 'w-4 h-4 rounded-[4px]'}`} 
                      style={{ backgroundColor: leg.color }}
                    />
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[11px] font-bold text-slate-700 leading-tight">
                        {leg.category}
                      </span>
                      <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                        {leg.range_text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}