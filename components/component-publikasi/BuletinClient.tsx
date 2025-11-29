"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  Download, 
  FileText, 
  Filter, 
  X, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  RotateCcw
} from "lucide-react";

// --- Definisi Tipe Data (Sesuai dengan yang dikirim dari page.tsx) ---
export type BuletinItem = {
  id: string;
  title: string;
  edition: string;
  year: string;
  cover: string;
  pdfUrl: string;
};

interface BuletinClientProps {
  initialData: BuletinItem[];
}

const ITEMS_PER_PAGE = 8;

export default function BuletinClient({ initialData }: BuletinClientProps) {
  const [selectedBuletin, setSelectedBuletin] = useState<BuletinItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState("All");

  // 1. Ambil daftar tahun unik dari data database
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(initialData.map((item) => item.year)));
    return uniqueYears.sort((a, b) => Number(b) - Number(a));
  }, [initialData]);

  // 2. Filter Logic
  const filteredData = initialData.filter((item) => {
    return selectedYear === "All" || item.year === selectedYear;
  });

  // 3. Pagination Logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset halaman saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear]);

  // Handler Ganti Halaman
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler Reset Filter
  const handleReset = () => {
    setSelectedYear("All");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-800"
          >
            Arsip Buletin
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Kumpulan publikasi buletin analisis cuaca, iklim, dan kualitas udara. 
            Silakan pilih tahun terbitan untuk menemukan dokumen yang Anda butuhkan.
          </motion.p>
        </div>

        {/* Filter Section */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
             <div className="pl-3 text-gray-400">
                <Filter className="w-5 h-5" />
             </div>
             <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="appearance-none bg-transparent hover:bg-gray-50 text-gray-700 py-2 px-4 pr-8 rounded-lg font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors"
                >
                  <option value="All">Semua Tahun</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      Tahun {year}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-gray-400">
                   <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
            </div>

            {selectedYear !== "All" && (
                <>
                    <div className="w-px h-6 bg-gray-200"></div>
                    <button 
                        onClick={handleReset}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Tampilkan Semua"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </>
            )}
          </div>
        </div>

        {/* Grid Data */}
        {currentData.length > 0 ? (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {currentData.map((item, index) => (
              <motion.div
                key={item.id}
                layoutId={`card-${item.id}`}
                onClick={() => setSelectedBuletin(item)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
              >
                <div className="relative aspect-[3/4] bg-gray-200 overflow-hidden border-b border-gray-100">
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/60 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-white font-semibold flex items-center gap-2 border border-white/50 px-4 py-2 rounded-full backdrop-blur-sm">
                          <Eye className="w-5 h-5" /> Lihat
                      </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="text-xs text-gray-500 mb-2">Tahun {item.year}</div>
                  <h3 className="text-sm md:text-base font-bold text-gray-800 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                  </h3>
                  <p className="text-xs text-blue-600 font-medium mt-auto pt-2">
                      Edisi: {item.edition}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
             /* Empty State */
             <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <FileText className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium mb-3">
                    {selectedYear === "All" ? "Belum ada buletin." : `Belum ada buletin tahun ${selectedYear}`}
                </p>
                {selectedYear !== "All" && (
                    <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                        <RotateCcw className="w-4 h-4" /> Tampilkan Semua
                    </button>
                )}
            </div>
        )}

        {/* Pagination Controls */}
        {filteredData.length > ITEMS_PER_PAGE && (
            <div className="mt-12 flex justify-center items-center gap-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium text-gray-600">
                    Halaman <span className="text-blue-600 font-bold">{currentPage}</span> dari {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        )}

        {/* Modal PDF Viewer */}
        <AnimatePresence>
          {selectedBuletin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6"
            >
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedBuletin(null)} />
              <motion.div
                layoutId={`card-${selectedBuletin.id}`}
                className="bg-white w-full max-w-5xl h-[85vh] md:h-[90vh] rounded-2xl shadow-2xl relative flex flex-col overflow-hidden z-10"
              >
                <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                  <div>
                    <h3 className="font-bold text-gray-800 line-clamp-1">{selectedBuletin.title}</h3>
                    <p className="text-xs text-gray-500">{selectedBuletin.edition}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={selectedBuletin.pdfUrl} download className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                      <Download className="w-4 h-4" /> Download
                    </a>
                    <button onClick={() => setSelectedBuletin(null)} className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex-grow bg-gray-100 relative">
                  <iframe src={`${selectedBuletin.pdfUrl}#toolbar=0&view=FitH`} className="w-full h-full" title="PDF Viewer" />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:hidden">
                    <a href={selectedBuletin.pdfUrl} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white shadow-lg rounded-full font-semibold">
                      <ExternalLink className="w-4 h-4" /> Buka Fullscreen
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}