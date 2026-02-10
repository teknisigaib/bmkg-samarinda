export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { FileText, Download, Calendar, ShieldCheck, AlertCircle } from "lucide-react";
import { getKinerjaDocs } from "@/lib/data-kinerja"; 

export const metadata: Metadata = {
  title: "Transparansi Kinerja | BMKG Samarinda",
  description: "Laporan kinerja dan akuntabilitas Stasiun Meteorologi APT Pranoto.",
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
    <div className="space-y-10 w-full">
      
      {/* Intro Section */}
      <section className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4 items-start shadow-sm">
        <ShieldCheck className="w-10 h-10 text-blue-600 flex-shrink-0 mt-1" />
        <div>
            <h2 className="text-lg font-bold text-gray-800">Komitmen Transparansi</h2>
            <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                Sebagai wujud akuntabilitas dan transparansi publik, Stasiun Meteorologi APT Pranoto Samarinda menyediakan akses terbuka terhadap dokumen perencanaan, pengukuran, dan pelaporan kinerja instansi.
            </p>
        </div>
      </section>

      {/* List Dokumen per Kategori */}
      <div className="space-y-12">
        {CATEGORIES.map((cat) => {
            // 1. FILTER sesuai kategori
            // 2. SORT berdasarkan tahun (Terbaru di atas / Descending)
            const docs = allDocs
                .filter(d => d.category === cat.id)
                .sort((a, b) => b.year.localeCompare(a.year)); // Logika Sort Disini

            if (docs.length === 0) return null; 

            return (
                <section key={cat.id} className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    {/* Judul Kategori */}
                    <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        {cat.label}
                    </h3>

                    {/* Scrollable Area */}
                    <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-1 gap-3">
                            {docs.map((doc) => {
                                const displayTitle = doc.title || `${CATEGORY_LABELS[doc.category]} ${doc.year}`;
                                
                                return (
                                    <div key={doc.id} className="group bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition-all w-full">
                                        
                                        {/* Info Dokumen */}
                                        <div className="flex items-start gap-4">
                                            <div className="bg-red-50 text-red-600 p-3 rounded-xl flex-shrink-0 group-hover:bg-red-100 transition-colors">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-base md:text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {displayTitle}
                                                </h4>
                                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1.5">
                                                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded font-mono font-medium">
                                                        <Calendar className="w-3 h-3" /> {doc.year}
                                                    </span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span className="bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
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
                                            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all flex-shrink-0 w-full sm:w-auto justify-center"
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
            <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 text-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Belum ada dokumen</h3>
                <p className="text-gray-500 max-w-sm mx-auto mt-1">
                    Dokumen kinerja belum diunggah oleh admin. Silakan cek kembali nanti.
                </p>
            </div>
        )}
      </div>
    </div>
  );
}