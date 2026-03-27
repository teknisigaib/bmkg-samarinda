import { Clock, FileText, ShieldCheck, AlertTriangle, MapPin, RadioTower } from "lucide-react"; 
import { getLinkPeringatanDiniKaltim } from "@/lib/bmkg/warnings";
import { getCAPAlertDetail } from "@/lib/bmkg/cap";
import MapLoader from "@/components/component-cuaca/peringatan-dini/MapLoader";
import AlertImageViewer from "@/components/component-cuaca/peringatan-dini/AlertImageViewer"; // <--- Import Komponen Baru
import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

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

  const isSevere = alertData?.severity === 'Severe';

  const mapDisplayData = alertData ? {
    polygons: alertData.polygons,
    severity: alertData.severity,
    event: alertData.event,
    headline: alertData.headline,
    areaDesc: alertData.areaDesc
  } : {
    polygons: [],
    severity: 'None',
    event: 'Normal',
    headline: 'Tidak ada peringatan',
    areaDesc: ''
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="w-full mx-auto pt-6 lg:px-8 space-y-6">

        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
            items={[
              { label: "Beranda", href: "/" },
              { label: "Cuaca" }, 
              { label: "Peringatan Dini" } 
            ]} 
        />

        {/* --- HEADER TITLE & SIMPLE STATUS PILL --- */}
        {/* --- HEADER SECTION (GAYA CUACA PENERBANGAN) --- */}
        <section className="relative flex flex-col items-center justify-center text-center mb-10 max-w-3xl mx-auto pt-2">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
           </div>
           
           <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Peringatan Dini Cuaca
           </h1>
           
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-4xl mb-8">
              Sistem peringatan dini cuaca ekstrem untuk wilayah administrasi Provinsi Kalimantan Timur.
           </p>

           <div className="relative z-10 flex flex-wrap items-center justify-center bg-white border border-slate-200 rounded-2xl shadow-sm p-1">
              {!alertData ? (
                  <div className="flex items-center gap-2 px-4 py-1.5 border-slate-100">
                     <ShieldCheck className="w-4 h-4 text-emerald-500" />
                     <span className="text-xs font-semibold text-slate-700">
                        Tidak Ada Peringatan Dini Cuaca
                     </span>
                  </div>
              ) : (
                  <>
                    <div className="flex items-center gap-2 px-4 py-1.5 border-r border-slate-100">
                       <span className="relative flex h-2 w-2 shrink-0">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isSevere ? 'bg-red-400' : 'bg-amber-400'} opacity-75`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${isSevere ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                       </span>
                       <AlertTriangle className={`w-4 h-4 ${isSevere ? 'text-red-500' : 'text-amber-500'}`} />
                       <span className={`text-xs font-semibold ${isSevere ? 'text-red-700' : 'text-amber-700'}`}>
                          {alertData.event}
                       </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5">
                       <Clock className="w-4 h-4 text-blue-500" />
                       <span className="text-xs font-semibold text-slate-700">
                          s/d {formatDate(alertData.expires)}
                       </span>
                    </div>
                  </>
              )}
           </div>
        </section>

        {/* --- BAGIAN PETA --- */}
        <div className="relative w-full h-[400px] md:h-[550px] lg:h-[600px] bg-slate-100 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="absolute inset-0 w-full h-full overflow-hidden">
               <MapLoader data={mapDisplayData} />
            </div>
            
            {!alertData && (
              <div className="absolute top-4 right-4 z-[400] max-w-[200px] animate-in fade-in zoom-in duration-500 pointer-events-none">
                <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-emerald-100">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      Aman Terkendali
                    </div>
                    <p className="text-[10px] font-medium text-slate-500 leading-tight">
                      Tidak ada peringatan dini cuaca signifikan di area ini.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="absolute bottom-4 left-4 md:left-6 z-[400] pointer-events-none">
                <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Radar BMKG Kaltim</span>
                    <span className="text-[9px] font-medium text-slate-500">
                        {alertData ? "*Area berwarna menunjukkan potensi terdampak." : "*Seluruh wilayah terpantau normal."}
                    </span>
                </div>
            </div>
        </div>

        {/* --- BAGIAN DETAIL INFORMASI --- */}
        {alertData && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               
               {/* KOLOM KIRI: Waktu & Teks (Span 2 Kolom Jika Ada Gambar) */}
               <div className={`space-y-6 ${alertData.web ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                  
                  {/* Blok Waktu */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 border border-slate-100 p-4 md:px-5 rounded-xl">
                     <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Periode Berlaku</span>
                     </div>
                     <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        <span className="font-bold text-sm text-slate-800 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-sm">{formatDate(alertData.effective)}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">S/D</span>
                        <span className="font-bold text-sm text-blue-700 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-sm">{formatDate(alertData.expires)}</span>
                     </div>
                  </div>

                  {/* Blok Deskripsi */}
                  <div>
                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <FileText className="w-4 h-4 text-blue-500" /> Detail Peringatan Wilayah
                     </h4>
                     <div className="text-slate-700 leading-relaxed text-sm md:text-base font-medium whitespace-pre-line">
                        {alertData.description}
                     </div>
                  </div>
               </div>

               {/* KOLOM KANAN: Integrasi Komponen ImageLightbox Anda */}
               {alertData.web && (
                  <AlertImageViewer imageUrl={alertData.web} />
               )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}