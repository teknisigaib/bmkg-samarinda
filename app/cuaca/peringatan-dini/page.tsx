import {  Clock, Info, FileText, ExternalLink, ImageIcon } from "lucide-react";
import { getLinkPeringatanDiniKaltim } from "@/lib/bmkg/warnings";
import { getCAPAlertDetail } from "@/lib/bmkg/cap";
import MapLoader from "@/components/component-cuaca/peringatan-dini/MapLoader";
import Image from "next/image"; // Jangan lupa import Image
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peringatan Dini Cuaca | BMKG Samarinda",
  description: "Informasi peringatan dini terjadinya hujan lebat di wilayah Kalimantan Timur.",
};

// Helper format tanggal
const formatDate = (isoStr: string) => {
    if(!isoStr) return "-";
    try {
        const date = new Date(isoStr);
        return new Intl.DateTimeFormat("id-ID", {
            timeZone: "Asia/Makassar", 
            day: "numeric", month: "short", 
            hour: "2-digit", minute: "2-digit", 
            hour12: false
        }).format(date).replace(/\./g, ":") + " WITA";
    } catch (e) { return isoStr; }
};

export default async function PeringatanPage() {
  const xmlLink = await getLinkPeringatanDiniKaltim();
  const alertData = xmlLink ? await getCAPAlertDetail(xmlLink) : null;

  return (
      <div className=" min-h-screen w-full mx-auto space-y-6">

        {/* KONDISI 1: AMAN */}
        {!alertData && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-blue-800">Cuaca Kondusif</h3>
                <p className="text-blue-700 mt-2">
                    Saat ini tidak terpantau adanya peringatan dini cuaca untuk wilayah Kalimantan Timur.
                </p>
            </div>
        )}

        {/* KONDISI 2: BAHAYA */}
        {alertData && (
            <div className="space-y-6">
                
                {/* CARD UTAMA */}
                
                    {/* Badge Level */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${alertData.severity === 'Severe' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            Tingkat: {alertData.severity}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                            {alertData.event}
                        </span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
                        {alertData.headline}
                    </h2>

                    {/* MAP VISUALIZATION */}
                    <div className="mb-8 relative z-0">
                        <MapLoader data={{ 
                            polygons: alertData.polygons, 
                            severity: alertData.severity,
                            event: alertData.event,
                            headline: alertData.headline,
                            areaDesc: alertData.areaDesc
                        }} />
                        <p className="text-center text-xs text-gray-400 mt-2">
                            *Area berwarna adalah wilayah terdampak langsung berdasarkan data radar/satelit
                        </p>
                    </div>

                    {/* DETAIL TEXT */}
                    <div className="space-y-6 text-sm border-t border-gray-100 pt-6">
                        
                        {/* Waktu */}
                        <div>
                            <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-blue-500" /> Waktu Berlaku
                            </h4>
                            <div className="ml-6 bg-blue-50 text-blue-800 px-4 py-3 rounded-xl inline-block">
                                <span className="font-medium">{formatDate(alertData.effective)}</span>
                                <span className="mx-2 opacity-50">s/d</span>
                                <span className="font-bold">{formatDate(alertData.expires)}</span>
                            </div>
                        </div>

                        {/* Deskripsi */}
                        <div>
                            <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-blue-500" /> Deskripsi Lengkap
                            </h4>
                            <div className="ml-6 p-4 bg-gray-50 rounded-xl text-gray-700 leading-relaxed text-justify">
                                {alertData.description}
                            </div>
                        </div>

                        {/* --- NEW: INFOGRAFIS RESMI --- */}
                        {alertData.web && (
                            <div className="pt-4">
                                <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                                    <ImageIcon className="w-4 h-4 text-blue-500" /> Infografis
                                </h4>
                                
                                <div className="ml-6 relative group">
                                    <div className="relative w-full max-w-md aspect-[1/1] rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm hover:shadow-md transition-all">
                                        <Image 
                                            src={alertData.web} 
                                            alt="Infografis Peringatan Dini BMKG" 
                                            fill
                                            className="object-contain"
                                            unoptimized 
                                        />
                                    </div>
                                    
                                    {/* Link Buka Gambar Asli */}
                                    <a 
                                        href={alertData.web} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2 font-medium hover:underline"
                                    >
                                        Buka gambar ukuran penuh <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            
        )}

      </div>
  );
}