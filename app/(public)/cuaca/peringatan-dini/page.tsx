import { ShieldCheck, AlertTriangle, FileText, Clock } from "lucide-react"; // ✅ Clock Ditambahkan
import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import WarningMapWrapper from "@/components/component-cuaca/peringatan-dini/WarningMapWrapper";
import InfografisGallery from "@/components/component-cuaca/peringatan-dini/InfografisGallery";
import ShareButtons from "@/components/component-cuaca/peringatan-dini/ShareButtons";
import { fetchArcgisNowcasting } from "@/lib/bmkg/nowcast";

export const metadata: Metadata = {
  title: "Peringatan Dini Cuaca | BMKG APT Pranoto Samarinda",
  description: "Informasi peringatan dini Nowcasting Cuaca untuk wilayah Kalimantan Timur.",
};

const formatDateKaltim = (timestamp: number) => {
  if (!timestamp) return "-";
  const date = new Date(timestamp);
  const day = date.toLocaleString("id-ID", { timeZone: "Asia/Makassar", day: "2-digit" });
  const month = date.toLocaleString("id-ID", { timeZone: "Asia/Makassar", month: "long" });
  const year = date.toLocaleString("id-ID", { timeZone: "Asia/Makassar", year: "numeric" });
  const time = date.toLocaleString("id-ID", { timeZone: "Asia/Makassar", hour: "2-digit", minute: "2-digit" }).replace(/\./g, ":");
  return `${day} ${month} ${year} pkl. ${time}`;
};

const formatTimeKaltim = (timestamp: number) => {
  if (!timestamp) return "-";
  const date = new Date(timestamp);
  return date.toLocaleString("id-ID", { timeZone: "Asia/Makassar", hour: "2-digit", minute: "2-digit" }).replace(/\./g, ":");
};

export default async function PeringatanPage() {
  const geoData = await fetchArcgisNowcasting();
  const features = geoData?.features || [];
  const hasWarnings = features.length > 0;
  
  const now = new Date();
  const year = now.toLocaleString("en-US", { timeZone: "Asia/Makassar", year: "numeric" });
  const month = now.toLocaleString("en-US", { timeZone: "Asia/Makassar", month: "2-digit" });
  const day = now.toLocaleString("en-US", { timeZone: "Asia/Makassar", day: "2-digit" });
  const imgInfografis = `https://nowcasting.bmkg.go.id/infografis/CKT/${year}/${month}/${day}/infografis.jpg`;
  const imgText = `https://nowcasting.bmkg.go.id/infografis/CKT/${year}/${month}/${day}/infografis_text.jpg`;

  // ✅ LOGIKA WAKTU SYNC LIVE
  const syncLabel = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Makassar",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(now).replace(/\./g, ":") + " WITA";

  const terjadi: Record<string, string[]> = {};
  const meluas: Record<string, string[]> = {};
  let waktuPembuatan = 0; let waktuBerlaku = 0; let waktuBerakhir = 0;

  if (hasWarnings) {
    waktuPembuatan = features[0].properties.waktupembuatan;
    waktuBerlaku = features[0].properties.waktuberlaku;
    waktuBerakhir = features[0].properties.waktuberakhir;

    features.forEach((f: any) => {
      const props = f.properties;
      const isMeluas = String(props.tipearea || "").toLowerCase().includes("meluas");
      if (isMeluas) {
        if (!meluas[props.namakotakab]) meluas[props.namakotakab] = [];
        if (!meluas[props.namakotakab].includes(props.namakecamatan)) meluas[props.namakotakab].push(props.namakecamatan);
      } else {
        if (!terjadi[props.namakotakab]) terjadi[props.namakotakab] = [];
        if (!terjadi[props.namakotakab].includes(props.namakecamatan)) terjadi[props.namakotakab].push(props.namakecamatan);
      }
    });
  }

  let waText = "";
  if (hasWarnings) {
    waText += `*UPDATE Peringatan Dini Cuaca Wilayah Kalimantan Timur* tgl ${formatDateKaltim(waktuPembuatan)} WITA berpotensi terjadi hujan dengan intensitas sedang hingga lebat yang dapat disertai kilat/petir dan angin kencang pada pkl ${formatTimeKaltim(waktuBerlaku)} WITA di:\n\n`;

    if (Object.keys(terjadi).length > 0) {
      Object.keys(terjadi).forEach(kab => {
        waText += `*${kab}:* ${terjadi[kab].join(", ")},\n`;
      });
      waText += "\n";
    }

    if (Object.keys(meluas).length > 0) {
      waText += `Dan dapat meluas ke wilayah:\n`;
      Object.keys(meluas).forEach(kab => {
        waText += `*${kab}:* ${meluas[kab].join(", ")},\n`;
      });
      waText += "\n";
    }

    waText += `Kondisi ini diperkirakan masih dapat berlangsung hingga pkl *${formatTimeKaltim(waktuBerakhir)} WITA*\n`;
    waText += `*Prakirawan BMKG - Kalimantan Timur*\n\n`;
    waText += `🌍 *Peta Interaktif & Info Lengkap:*\nhttps://stamet-samarinda.bmkg.go.id/cuaca/peringatan-dini\n\n`;
    waText += `🗺️ *Visual Infografis:*\n${imgInfografis}`;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="w-full mx-auto pt-6 lg:px-8 space-y-6">
        <Breadcrumb items={[ { label: "Beranda", href: "/" }, { label: "Cuaca" }, { label: "Peringatan Dini" } ]} />

        <section className="relative flex flex-col items-center justify-center text-center mb-10 max-w-3xl mx-auto pt-2">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
           </div>
           <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">Peringatan Dini Cuaca</h1>
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-4xl mb-8">Sistem peringatan dini cuaca (Nowcasting) untuk wilayah Provinsi Kalimantan Timur</p>

           {/* ✅ SYMMETRICAL STATUS BAR (UNIFIED CAPSULE) */}
           <div className="relative z-10 flex items-center bg-white border border-slate-200 rounded-xl shadow-sm p-1 transition-all hover:shadow-md">
             
             {/* KIRI: Status Peringatan */}
             <div className="flex items-center gap-2 px-4 py-1.5 border-r border-slate-100">
               {!hasWarnings ? (
                  <>
                     <ShieldCheck className="w-4 h-4 text-emerald-500" />
                     <span className="text-xs font-medium text-slate-500">Tidak Ada Peringatan Dini</span>
                  </>
               ) : (
                  <>
                     <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fdaf15] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#fdaf15]"></span>
                     </span>
                     <AlertTriangle className="w-4 h-4 text-[#d9940b]" />
                     <span className="text-xs font-medium font-semibold text-slate-500">Peringatan Dini Aktif</span>
                  </>
               )}
             </div>

             {/* KANAN: Waktu Sinkronisasi Live */}
             <div className="flex items-center gap-2 px-4 py-1.5">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-slate-500">Sync: {syncLabel}</span>
             </div>

           </div>
        </section>

        <div className="relative w-full h-[450px] md:h-[600px] bg-slate-100 rounded-2xl shadow-sm overflow-hidden border border-slate-200">
            <WarningMapWrapper data={geoData} />
        </div>

        {hasWarnings && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8 space-y-8 md:space-y-10">
            
            <div className="w-full">
               <InfografisGallery imgMap={imgInfografis} imgText={imgText} />
            </div>

            <div className="w-full space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Narasi Peringatan Dini</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Format rilis resmi sebaran wilayah terdampak</p>
                </div>
              </div>

              <div className="text-slate-700 text-sm md:text-base leading-relaxed font-medium">
                <p className="mb-6 text-justify">
                  <strong>UPDATE Peringatan Dini Cuaca Wilayah Kalimantan Timur</strong> tgl {formatDateKaltim(waktuPembuatan)} berpotensi terjadi hujan dengan intensitas sedang hingga lebat yang dapat disertai kilat/petir dan angin kencang pada pkl {formatTimeKaltim(waktuBerlaku)} WITA.
                </p>

                <div className={`grid grid-cols-1 gap-6 md:gap-8 mb-8 ${Object.keys(meluas).length > 0 ? "md:grid-cols-2" : ""}`}>
                  
                  {Object.keys(terjadi).length > 0 && (
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      <p className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#fdaf15]"></span>
                        Wilayah Terdampak:
                      </p>
                      <div className="space-y-3">
                        {Object.keys(terjadi).map(kab => (
                          <div key={kab} className="pl-3 border-l-[3px] border-[#fdaf15]">
                            <span className="font-bold text-slate-900">{kab}:</span> <span className="text-slate-600 leading-snug block mt-0.5">{terjadi[kab].join(", ")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {Object.keys(meluas).length > 0 && (
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      <p className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#fdfc14] border border-slate-300"></span>
                        Potensi Meluas Ke:
                      </p>
                      <div className="space-y-3">
                        {Object.keys(meluas).map(kab => (
                          <div key={kab} className="pl-3 border-l-[3px] border-[#fdfc14]">
                            <span className="font-bold text-slate-900">{kab}:</span> <span className="text-slate-600 leading-snug block mt-0.5">{meluas[kab].join(", ")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <p className="text-justify mb-1">
                    Kondisi ini diperkirakan masih dapat berlangsung hingga pkl <strong>{formatTimeKaltim(waktuBerakhir)} WITA</strong>.
                    Kondisi ini berpotensi menimbulkan dampak berupa jarak pandang berkurang, angin kencang, dan banjir lokal.
                    Masyarakat dihimbau untuk tetap waspada, mengurangi aktivitas di luar ruangan, serta mengambil langkah-langkah pencegahan yang diperlukan guna menjaga keselamatan.
                  </p>
                  <p className="font-bold text-slate-900 mb-6">
                    Prakirawan BMKG - Kalimantan Timur
                  </p>
                  
                  <ShareButtons textToShare={waText} />
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}