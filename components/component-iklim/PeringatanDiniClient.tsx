"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { FileText, Download, ChevronLeft, ChevronRight, CloudRain, Sun, Calendar } from "lucide-react";
import { RegionData } from "@/components/component-iklim/PDIEMapClient";

const ClimateMapClient = dynamic(() => import("@/components/component-iklim/PDIEMapClient"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-400 animate-pulse rounded-2xl border border-slate-200">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"/>
        <span className="text-xs font-bold uppercase tracking-widest">Memuat Peta Spasial...</span>
    </div>
  )
});

interface DbRegion {
    id: string;
    name: string;
    rainLevel: string;
    droughtLevel: string;
}

interface DbDocument {
    id: string;
    title: string;
    date: string;
    fileUrl: string;
    fileSize: string | null;
    type: string;
}

const DOCS_PER_PAGE = 5;

export default function PeringatanDiniClient({ initialDbData }: { initialDbData: any }) {
  const [activeTab, setActiveTab] = useState<"HUJAN" | "KEKERINGAN">("HUJAN");
  const [docPage, setDocPage] = useState(1);
  const [geoJson, setGeoJson] = useState(null);

  const dbRegions: DbRegion[] = initialDbData?.regions || [];
  const dbDocs: DbDocument[] = initialDbData?.documents || [];
  const periodeLabel = initialDbData?.periodeLabel || "-";

  useEffect(() => {
    async function fetchMap() {
        try {
            const mapRes = await fetch("/maps/Kabupaten-Kota.geojson");
            const mapData = await mapRes.json();
            setGeoJson(mapData);
        } catch (error) {
            console.error("Gagal memuat peta:", error);
        }
    }
    fetchMap();
  }, []);

  const currentRegionData: RegionData[] = dbRegions.map(region => ({
      id: region.id,
      name: region.name,
      level: (activeTab === "HUJAN" ? region.rainLevel : region.droughtLevel) as any
  }));

  const filteredDocs = dbDocs.filter(doc => doc.type === activeTab);
  
  const totalDocPages = Math.ceil(filteredDocs.length / DOCS_PER_PAGE);
  const currentDocs = filteredDocs.slice(
    (docPage - 1) * DOCS_PER_PAGE,
    docPage * DOCS_PER_PAGE
  );

  useEffect(() => {
    setDocPage(1);
  }, [activeTab]);

  const handlePageChange = (newPage: number) => {
    setDocPage(newPage);
  }

  return (
    <div className="space-y-6">
        
        {/* PANEL KONTROL (Sesuai Referensi Gambar) */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 md:px-6 md:py-4 flex flex-col md:flex-row justify-between items-center gap-5 shadow-sm w-full">
            
            {/* Kiri: Info Periode */}
            <div className="flex items-center gap-4 w-full md:w-auto">
               <div className="w-11 h-11 shrink-0 flex items-center justify-center bg-blue-50/50 border border-blue-100 rounded-xl">
                   <Calendar className="w-5 h-5 text-blue-600" />
               </div>
               <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Periode Pemantauan</p>
                   <p className="text-sm md:text-base font-bold text-slate-900">{periodeLabel}</p>
               </div>
            </div>

            {/* Kanan: Tab Switcher */}
            <div className="flex items-center p-1 w-full md:w-auto rounded-xl">
                <button 
                    onClick={() => setActiveTab("HUJAN")} 
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                        activeTab === "HUJAN" 
                        ? "bg-white text-blue-700 shadow-sm border border-slate-200" 
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent"
                    }`}
                >
                    <CloudRain className="w-4 h-4" /> Hujan Tinggi
                </button>
                <button 
                    onClick={() => setActiveTab("KEKERINGAN")} 
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                        activeTab === "KEKERINGAN" 
                        ? "bg-white text-slate-800 shadow-sm border border-slate-200" 
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent"
                    }`}
                >
                    <Sun className="w-4 h-4" /> Kekeringan
                </button>
            </div>
        </div>

        {/* MAP AREA */}
        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm p-1">
            <div className="w-full h-full rounded-xl overflow-hidden relative bg-slate-50">
                {geoJson ? (
                  <ClimateMapClient geoJsonData={geoJson} warningData={currentRegionData} warningType={activeTab} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm animate-pulse">Menyiapkan Peta GeoJSON...</div>
                )}

                <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Legenda Status</h4>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                        <div className="flex items-center gap-2.5"><span className="w-3 h-3 rounded bg-[#10b981] shadow-sm"></span><span className="text-xs font-medium text-slate-600">Aman</span></div>
                        <div className="flex items-center gap-2.5"><span className="w-3 h-3 rounded bg-[#eab308] shadow-sm"></span><span className="text-xs font-medium text-slate-600">Waspada</span></div>
                        <div className="flex items-center gap-2.5"><span className="w-3 h-3 rounded bg-[#f97316] shadow-sm"></span><span className="text-xs font-medium text-slate-600">Siaga</span></div>
                        <div className="flex items-center gap-2.5"><span className="w-3 h-3 rounded bg-[#ef4444] shadow-sm"></span><span className="text-xs font-medium text-slate-600">Awas</span></div>
                    </div>
                </div>
            </div>
        </div>

        {/* DOCUMENTS */}
        <div className="pt-2">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2 tracking-tight">
                <FileText className="w-5 h-5 text-blue-500"/> Dokumen Analisis
            </h3>
            
            {filteredDocs.length > 0 ? (
                <div className="space-y-3">
                    {currentDocs.map((doc) => (
                        <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 shadow-sm group gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{doc.title}</p>
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                                        <span>{doc.date}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        <span>{doc.fileSize || "PDF"}</span>
                                    </div>
                                </div>
                            </div>
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto text-xs font-bold uppercase tracking-widest bg-slate-50 border border-slate-200 text-slate-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 rounded-lg transition-all">
                                <Download className="w-4 h-4" /> Unduh
                            </a>
                        </div>
                    ))}
                    {totalDocPages > 1 && (
                        <div className="flex justify-center mt-6 gap-3 items-center">
                            <button onClick={() => handlePageChange(docPage - 1)} disabled={docPage === 1} className="w-10 h-10 flex justify-center items-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-colors shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest py-1 bg-white border border-slate-200 px-4 rounded-lg shadow-sm">Hal {docPage} / {totalDocPages}</span>
                            <button onClick={() => handlePageChange(docPage + 1)} disabled={docPage === totalDocPages} className="w-10 h-10 flex justify-center items-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-colors shadow-sm"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Tidak ada dokumen tersedia untuk kategori ini.</p>
                </div>
            )}
        </div>
    </div>
  );
}