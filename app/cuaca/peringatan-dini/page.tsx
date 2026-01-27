import { Clock, Info, FileText, ExternalLink, ImageIcon, ShieldCheck } from "lucide-react";
import { getLinkPeringatanDiniKaltim } from "@/lib/bmkg/warnings";
import { getCAPAlertDetail } from "@/lib/bmkg/cap";
import MapLoader from "@/components/component-cuaca/peringatan-dini/MapLoader";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peringatan Dini Cuaca | BMKG APT Pranoto Samarinda",
  description: "Informasi peringatan dini terjadinya hujan lebat di wilayah Kalimantan Timur.",
};

// Helper format tanggal
const formatDate = (isoStr: string) => {
  if (!isoStr) return "-";
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

  // Persiapkan data untuk MapLoader
  // Jika alertData null, kita kirim objek default dengan polygons kosong
  // agar peta tetap muncul (base layer) tapi bersih.
  const mapDisplayData = alertData ? {
    polygons: alertData.polygons,
    severity: alertData.severity,
    event: alertData.event,
    headline: alertData.headline,
    areaDesc: alertData.areaDesc
  } : {
    polygons: [], // Array kosong = Peta bersih
    severity: 'None',
    event: 'Normal',
    headline: 'Tidak ada peringatan',
    areaDesc: ''
  };

  return (
    <div className="min-h-screen w-full mx-auto space-y-6 pb-20">

      {/* BAGIAN 1: HEADER STATUS (AMAN atau BAHAYA) */}
      <div className="mb-4">
        {!alertData ? (
          // KONDISI AMAN
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 text-center md:text-left shadow-sm">
            <div className="bg-emerald-100 p-3 rounded-full">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-800">Status: Kondusif</h3>
              <p className="text-emerald-700 text-sm">
                Tidak ada peringatan dini cuaca signifikan yang terpantau di wilayah Kalimantan Timur saat ini. Pantau terus informasi prakiraan cuaca terbaru dari BMKG APT Pranoto Samarinda.
              </p>
            </div>
          </div>
        ) : (
          // KONDISI BAHAYA
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${alertData.severity === 'Severe' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                Tingkat: {alertData.severity}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
                {alertData.event}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
              {alertData.headline}
            </h2>
          </div>
        )}
      </div>

      {/* BAGIAN 2: PETA (FIXED SIZE) */}
      <div className="w-full block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Peta */}
        <div className="w-full p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            Visualisasi Area
          </h3>
          <span className="text-[10px] text-gray-400 bg-white px-2 py-1 rounded border">
            Sumber: BMKG Nowcasting
          </span>
        </div>
        
        {/* CONTAINER UTAMA PETA */}
        {/* 'w-full' dan 'block' memastikan dia mengambil lebar penuh dari parent */}
        <div className="relative w-full block bg-slate-100 h-[400px] md:h-[550px] lg:h-[600px]">
          
          {/* CONTAINER MAP LOADER */}
          {/* Menggunakan absolute inset-0 menjamin dia menempel ke pojok-pojok container induk */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
             <MapLoader data={mapDisplayData} />
          </div>
          
          {/* OVERLAY STATUS AMAN (Jika alertData null) */}
          {!alertData && (
            <div className="absolute top-4 right-4 z-[400] max-w-[200px] animate-in fade-in zoom-in duration-500 pointer-events-none">
              <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-emerald-100">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    Aman Terkendali
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight">
                    Tidak ada peringatan dini cuaca signifikan di area ini.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Caption */}
        <div className="w-full p-3 bg-gray-50 text-center border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {alertData 
              ? "*Area berwarna menunjukkan wilayah yang berpotensi terdampak cuaca ekstrem." 
              : "Peta menampilkan seluruh wilayah Kalimantan Timur. Cuaca terpantau normal."}
          </p>
        </div>
      </div>

      {/* BAGIAN 3: DETAIL INFORMASI (HANYA MUNCUL JIKA ADA ALERT) */}
      {alertData && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Waktu */}
          <div>
            <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-blue-500" /> Waktu Berlaku
            </h4>
            <div className="bg-blue-50 text-blue-900 border border-blue-100 px-5 py-3 rounded-xl inline-flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
              <span className="font-semibold">{formatDate(alertData.effective)}</span>
              <span className="hidden md:inline text-blue-300">➜</span>
              <span className="md:hidden text-xs text-blue-400">sampai dengan</span>
              <span className="font-bold text-blue-700">{formatDate(alertData.expires)}</span>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Deskripsi */}
          <div>
            <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-500" /> Detail Peringatan
            </h4>
            <div className="p-5 bg-gray-50 rounded-xl text-gray-700 leading-relaxed text-justify text-sm md:text-base border border-gray-100">
              {alertData.description}
            </div>
          </div>

          {/* Infografis */}
          {alertData.web && (
            <div>
              <hr className="border-gray-100 mb-8" />
              <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-blue-500" /> Infografis Resmi
              </h4>
              <div className="bg-gray-100 rounded-xl p-2 md:p-4 inline-block border border-gray-200">
                <div className="relative w-full max-w-lg aspect-[4/5] md:aspect-square rounded-lg overflow-hidden bg-white shadow-sm">
                  <Image
                    src={alertData.web}
                    alt="Infografis Peringatan Dini BMKG"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="mt-3 text-right">
                  <a
                    href={alertData.web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                  >
                    Buka gambar penuh <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}