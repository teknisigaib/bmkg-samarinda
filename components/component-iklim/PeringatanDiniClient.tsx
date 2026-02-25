"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { FileText, Download, ChevronLeft, ChevronRight, CloudRain, Sun, Calendar } from "lucide-react";
import { RegionData } from "@/components/component-iklim/PDIEMapClient";

const ClimateMapClient = dynamic(() => import("@/components/component-iklim/PDIEMapClient"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-400 animate-pulse rounded-xl border border-slate-100">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"/>
        <span className="text-xs font-medium tracking-wide">Memuat Peta...</span>
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

// Menerima data dari Server Component (page.tsx)
export default function PeringatanDiniClient({ initialDbData }: { initialDbData: any }) {
  // STATE UI
  const [activeTab, setActiveTab] = useState<"HUJAN" | "KEKERINGAN">("HUJAN");
  const [docPage, setDocPage] = useState(1);
  const [geoJson, setGeoJson] = useState(null);

  // Gunakan data dari server langsung
  const dbRegions: DbRegion[] = initialDbData?.regions || [];
  const dbDocs: DbDocument[] = initialDbData?.documents || [];
  const periodeLabel = initialDbData?.periodeLabel || "-";

  // Hanya ambil GeoJSON di Client (karena file statis lokal)
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

  const handlePageChange = (newPage: number) => {
    setDocPage(newPage);
  }

  const description = activeTab === "HUJAN" 
    ? "Monitoring potensi curah hujan tinggi yang dapat memicu bencana hidrometeorologi basah di wilayah Kalimantan Timur."
    : "Monitoring hari tanpa hujan berturut-turut untuk kewaspadaan kekeringan meteorologis di wilayah Kalimantan Timur.";

  return (
    <div className="space-y-8">
        {/* HEADER  */}
        <section className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 flex flex-col md:flex-row gap-6 items-center text-center md:items-start md:text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="bg-white p-4 rounded-full shadow-sm w-fit shrink-0">
            {activeTab === "HUJAN" ? <CloudRain className="w-8 h-8 text-emerald-600" /> : <Sun className="w-8 h-8 text-emerald-600" />}
          </div>
  
          <div className="flex-1 w-full">
            <h2 className="text-2xl font-bold text-slate-800">Peringatan Dini Iklim Ekstrem</h2>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed mx-auto md:mx-0">{description}</p>
            
            <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 shadow-sm">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Periode: <span className="font-bold text-slate-800">{periodeLabel}</span></span>
              </div>

              <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm inline-flex">
                  <button onClick={() => setActiveTab("HUJAN")} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${activeTab === "HUJAN" ? "bg-emerald-100 text-emerald-700 shadow-sm" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}>
                      <CloudRain className="w-3.5 h-3.5" /> Hujan Tinggi
                  </button>
                  <button onClick={() => setActiveTab("KEKERINGAN")} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${activeTab === "KEKERINGAN" ? "bg-emerald-100 text-emerald-700 shadow-sm" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}>
                      <Sun className="w-3.5 h-3.5" /> Kekeringan
                  </button>
              </div>
            </div>
          </div>
        </section>

        {/* MAP AREA  */}
        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                {geoJson ? (
                  <ClimateMapClient geoJsonData={geoJson} warningData={currentRegionData} warningType={activeTab} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm animate-pulse">Menyiapkan Peta GeoJSON...</div>
                )}

                <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Legenda Status</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-emerald-500"></span><span className="text-xs text-slate-600">Aman</span></div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-yellow-400"></span><span className="text-xs text-slate-600">Waspada</span></div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-orange-500"></span><span className="text-xs text-slate-600">Siaga</span></div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-red-600"></span><span className="text-xs text-slate-600">Awas</span></div>
                    </div>
                </div>
        </div>

        {/* DOCUMENTS */}
        <div className="pt-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-gray-400"/> Dokumen Analisis</h3>
            
            {filteredDocs.length > 0 ? (
                <div className="space-y-3">
                    {currentDocs.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-emerald-200 transition-colors shadow-sm group">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><FileText className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 group-hover:text-emerald-600">{doc.title}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{doc.date} • {doc.fileSize || "PDF"}</p>
                                </div>
                            </div>
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                <Download className="w-4 h-4" />
                            </a>
                        </div>
                    ))}
                    {totalDocPages > 1 && (
                        <div className="flex justify-center mt-4 gap-2">
                            <button onClick={() => handlePageChange(docPage - 1)} disabled={docPage === 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronLeft className="w-5 h-5 text-gray-500" /></button>
                            <span className="text-xs font-medium text-gray-400 py-1">Halaman {docPage}</span>
                            <button onClick={() => handlePageChange(docPage + 1)} disabled={docPage === totalDocPages} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronRight className="w-5 h-5 text-gray-500" /></button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-sm text-gray-400">Tidak ada dokumen tersedia untuk kategori ini.</p>
                </div>
            )}
        </div>
    </div>
  );
}