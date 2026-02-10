"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  FileText, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Info
} from "lucide-react";
import { getPdieData } from "@/app/(admin)/admin/peringatan-dini/actions"; 
import { RegionData } from "@/components/component-iklim/PDIEMapClient";

// DYNAMIC IMPORT PETA
const ClimateMapClient = dynamic(() => import("@/components/component-iklim/PDIEMapClient"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-400 animate-pulse rounded-xl border border-slate-100">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"/>
        <span className="text-xs font-medium tracking-wide">Memuat Peta...</span>
    </div>
  )
});

// Tipe Data Lokal
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

export default function PeringatanDiniPage() {
  // STATE UI
  const [activeTab, setActiveTab] = useState<"HUJAN" | "KEKERINGAN">("HUJAN");
  const [docPage, setDocPage] = useState(1);
  // STATE DATA
  const [isLoading, setIsLoading] = useState(true);
  const [geoJson, setGeoJson] = useState(null);
  const [dbRegions, setDbRegions] = useState<DbRegion[]>([]);
  const [dbDocs, setDbDocs] = useState<DbDocument[]>([]);
  const [periodeLabel, setPeriodeLabel] = useState("");

  // FETCH DATA
  useEffect(() => {
    async function fetchData() {
        try {
            const mapRes = await fetch("/maps/Kabupaten-Kota.geojson");
            const mapData = await mapRes.json();
            setGeoJson(mapData);

            const dbData = await getPdieData();
            // @ts-ignore 
            setDbRegions(dbData.regions);
            setPeriodeLabel(dbData.periodeLabel);
            // @ts-ignore
            setDbDocs(dbData.documents);

        } catch (error) {
            console.error("Gagal memuat data sistem:", error);
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, []);

  // DATA PROCESSING
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


  // PAGINATION HANDLER
  const handlePageChange = (newPage: number) => {
    setDocPage(newPage);
  }

  // LOADING SCREEN
  if (isLoading) {
      return (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-8 h-8 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="text-sm text-slate-400">Memuat Data...</span>
          </div>
      );
  }

  return (
    <div className="space-y-8">
        
        {/*  TITLE & INFO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">
                    Peringatan Dini Iklim
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Periode Aktif: <span className="font-bold text-blue-600">{periodeLabel || "-"}</span>
                </p>
            </div>
            
            {/* Simple Tab Switcher */}
            <div className="bg-slate-100 p-1 rounded-lg inline-flex">
                <button
                    onClick={() => setActiveTab("HUJAN")}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                        activeTab === "HUJAN" 
                        ? "bg-white text-blue-600 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                    Curah Hujan Tinggi
                </button>
                <button
                    onClick={() => setActiveTab("KEKERINGAN")}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                        activeTab === "KEKERINGAN" 
                        ? "bg-white text-amber-600 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                    Kekeringan
                </button>
            </div>
        </div>


        {/* 2. MAP AREA  */}
        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                {geoJson && (
                <ClimateMapClient 
                    geoJsonData={geoJson} 
                    warningData={currentRegionData} 
                    warningType={activeTab} 
                />
                )}

                {/* Legend (Bottom Left) */}
                <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Legenda</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-xl bg-emerald-500"></span> 
                            <span className="text-xs text-slate-600">Aman</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-xl bg-yellow-400"></span> 
                            <span className="text-xs text-slate-600">Waspada</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-xl bg-orange-500"></span> 
                            <span className="text-xs text-slate-600">Siaga</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-xl bg-red-600"></span> 
                            <span className="text-xs text-slate-600">Awas</span>
                        </div>
                    </div>
                </div>
        </div>

        {/* DOCUMENTS */}
        <div className="pt-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400"/>
                Dokumen Analisis
            </h3>
            
            {filteredDocs.length > 0 ? (
                <div className="space-y-3">
                    {currentDocs.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 transition-colors shadow-sm group">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${doc.type === 'HUJAN' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'}`}>
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-600">{doc.title}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{doc.date} • {doc.fileSize || "PDF"}</p>
                                </div>
                            </div>
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Download className="w-4 h-4" />
                            </a>
                        </div>
                    ))}

                    {/* Pagination */}
                    {totalDocPages > 1 && (
                        <div className="flex justify-center mt-4 gap-2">
                            <button onClick={() => handlePageChange(docPage - 1)} disabled={docPage === 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                                <ChevronLeft className="w-5 h-5 text-gray-500" />
                            </button>
                            <span className="text-xs font-medium text-gray-400 py-1">Halaman {docPage}</span>
                            <button onClick={() => handlePageChange(docPage + 1)} disabled={docPage === totalDocPages} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                                <ChevronRight className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-sm text-gray-400">Tidak ada dokumen tersedia.</p>
                </div>
            )}
        </div>

    </div>
  );
}