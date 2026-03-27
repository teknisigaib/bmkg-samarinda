export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { FileText, Download, Calendar, ShieldCheck, AlertCircle, FileBarChart } from "lucide-react";
import { getKinerjaDocs } from "@/lib/data-kinerja"; 
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Transparansi Kinerja | BMKG APT Pranoto Samarinda",
  description: "Laporan kinerja, rencana strategis, dan akuntabilitas Stasiun Meteorologi APT Pranoto.",
};

const CATEGORY_LABELS: Record<string, string> = {
  Renstra: "Rencana Strategis",
  RencanaKinerja: "Rencana Kinerja Tahunan",
  PerjanjianKinerja: "Perjanjian Kinerja",
  LaporanKinerja: "Laporan Kinerja Instansi Pemerintah"
};

const CATEGORIES = [
  { id: "Renstra", label: "1. Rencana Strategis (RENSTRA)" },
  { id: "RencanaKinerja", label: "2. Rencana Kinerja Tahunan (RKT)" },
  { id: "PerjanjianKinerja", label: "3. Perjanjian Kinerja (PK)" },
  { id: "LaporanKinerja", label: "4. Laporan Kinerja (LAKIP)" },
];

export default async function TransparansiKinerjaPage() {
  const allDocs = await getKinerjaDocs();

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="w-full mx-auto pt-6 space-y-8">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
            items={[
              { label: "Beranda", href: "/" },
              { label: "Profil" }, 
              { label: "Transparansi Kinerja" } 
            ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mb-10 mx-auto pt-2">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
           </div>
           
           <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Transparansi Kinerja
           </h1>
           
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl mb-8">
              Akses terbuka terhadap dokumen perencanaan, pengukuran, dan pelaporan akuntabilitas Stasiun Meteorologi APT Pranoto Samarinda.
           </p>

           
        </section>

        {/* Intro Section (Komitmen) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 flex gap-5 items-start shadow-sm">
          <div className="bg-blue-50 p-3 rounded-xl shrink-0 border border-blue-100 hidden md:block">
             <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <div>
              <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight mb-2">Komitmen Transparansi</h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                  Sebagai wujud akuntabilitas dan transparansi publik, Stasiun Meteorologi Kelas III APT Pranoto Samarinda berkomitmen penuh dalam menyediakan akses terbuka bagi masyarakat untuk meninjau dokumen perencanaan strategis dan pelaporan hasil capaian kinerja secara berkala.
              </p>
          </div>
        </section>

        {/* List Dokumen per Kategori */}
        <div className="space-y-8 pt-4">
          {CATEGORIES.map((cat) => {
              const docs = allDocs
                  .filter(d => d.category === cat.id)
                  .sort((a, b) => b.year.localeCompare(a.year));

              if (docs.length === 0) return null; 

              return (
                  <section key={cat.id} className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden group">
                      {/* Judul Kategori */}
                      <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
                          <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-3">
                              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                  <FileBarChart className="w-5 h-5 text-blue-600" />
                              </div>
                              {cat.label}
                          </h3>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                              {docs.length} File
                          </span>
                      </div>

                      {/* Scrollable Area */}
                      <div className="max-h-[350px] overflow-y-auto pr-3 custom-scrollbar -mr-3">
                          <div className="grid grid-cols-1 gap-4 pb-2">
                              {docs.map((doc) => {
                                  const displayTitle = doc.title || `${CATEGORY_LABELS[doc.category]} ${doc.year}`;
                                  
                                  return (
                                      <div key={doc.id} className="group/item bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:border-blue-300 hover:shadow-md transition-all duration-300 w-full relative overflow-hidden">
                                          
                                          {/* Aksen Kiri Hover */}
                                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>

                                          {/* Info Dokumen */}
                                          <div className="flex items-center gap-4 pl-1">
                                              <div className="bg-blue-50 text-blue-600 p-3.5 rounded-xl flex-shrink-0 border border-blue-100 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors duration-300 shadow-sm">
                                                  <FileText className="w-6 h-6" />
                                              </div>
                                              <div>
                                                  <h4 className="font-bold text-slate-800 text-base group-hover/item:text-blue-600 transition-colors line-clamp-1">
                                                      {displayTitle}
                                                  </h4>
                                                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-500 mt-1.5 uppercase tracking-widest">
                                                      <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 shadow-sm">
                                                          <Calendar className="w-3.5 h-3.5 text-blue-500" /> TA {doc.year}
                                                      </span>
                                                      <span className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md shadow-sm">
                                                          PDF {doc.fileSize ? `(${doc.fileSize})` : ""}
                                                      </span>
                                                  </div>
                                              </div>
                                          </div>

                                          {/* Tombol Download */}
                                          <a 
                                              href={doc.fileUrl} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all flex-shrink-0 w-full sm:w-auto justify-center"
                                          >
                                              <Download className="w-4 h-4" /> Unduh
                                          </a>

                                      </div>
                                  );
                              })}
                          </div>
                      </div>
                  </section>
              );
          })}
          
          {/* Empty State */}
          {allDocs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 text-center shadow-sm">
                  <div className="bg-slate-50 p-4 rounded-full border border-slate-100 mb-4">
                      <AlertCircle className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Belum ada dokumen</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto mt-2">
                      Dokumen kinerja instansi belum diunggah oleh administrator. Silakan cek kembali secara berkala.
                  </p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}