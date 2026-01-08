"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  FileText, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Search
} from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Filter Logic (Hanya Search)
  const filteredData = initialData.filter((item) => {
    return item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           item.edition.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset halaman saat search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    document.getElementById("buletin-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="w-full space-y-8">

        {/* --- 1. SEARCH BAR ONLY --- */}
        <div className="max-w-md mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input 
                type="text" 
                placeholder="Cari edisi atau judul buletin..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm hover:shadow-md"
            />
        </div>

        {/* --- 2. GRID DATA --- */}
        <div id="buletin-grid">
           {currentData.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                {currentData.map((item, index) => (
                    <motion.div
                        layoutId={`card-${item.id}`}
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="group flex flex-col items-center text-center cursor-pointer h-full"
                        onClick={() => setSelectedBuletin(item)}
                    >
                        {/* --- FIXED SIZE CONTAINER ---
                           1. h-[280px]: Tinggi fix (sekitar ukuran A4 diperkecil). 
                              Ubah angka ini jika ingin lebih tinggi/pendek.
                           2. w-full max-w-[210px]: Lebar menyesuaikan, tapi mentok di 210px.
                           3. mx-auto: Posisi di tengah-tengah kolom grid.
                        */}
                        <div className="relative w-[210px] h-[280px] mx-auto rounded-md overflow-hidden shadow-lg shadow-slate-300 mb-5 transform group-hover:-translate-y-2 transition-all duration-300 bg-slate-200 border border-slate-100">
                            
                            <Image
                                src={item.cover}
                                alt={item.title}
                                fill
                                // object-cover akan memotong gambar agar pas di kotak 210x280 tanpa gepeng
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 150px, 210px"
                            />
                            
                            {/* Overlay Hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            
                            {/* Badge Tahun */}
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-sm z-10">
                                {item.year}
                            </div>
                        </div>

                        {/* Text Info */}
                        <div className="w-full max-w-[210px] mx-auto flex flex-col flex-grow">
                            <h3 className="text-sm font-bold text-slate-800 leading-snug mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {item.title}
                            </h3>
                            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mt-auto">
                                {item.edition}
                            </p>
                        </div>

                    </motion.div>
                ))}
            </div>
           ) : (
             /* Empty State */
             <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <FileText className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm font-medium">Tidak ada buletin ditemukan.</p>
                <button 
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-xs text-blue-600 hover:underline"
                >
                    Hapus Pencarian
                </button>
             </div>
           )}
        </div>

        {/* --- 3. PAGINATION --- */}
        {filteredData.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center gap-2 pt-8">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full border border-gray-100 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:shadow-none transition bg-white"
                >
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                <div className="flex items-center px-4 text-xs font-bold text-slate-600 bg-white rounded-full border border-gray-100">
                    {currentPage} / {totalPages}
                </div>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full border border-gray-100 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:shadow-none transition bg-white"
                >
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
            </div>
        )}

        {/* --- 4. MODAL PDF VIEWER --- */}
        <AnimatePresence>
          {selectedBuletin && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6"
            >
              <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm" onClick={() => setSelectedBuletin(null)} />
              
              <motion.div
                layoutId={`card-${selectedBuletin.id}`}
                className="bg-white w-full h-full md:max-w-5xl md:h-[90vh] md:rounded-2xl shadow-2xl relative flex flex-col overflow-hidden z-10"
              >
                {/* Header Modal */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-white">
                  <div className="flex items-center gap-3">
                      <div className="hidden sm:block w-8 h-10 relative rounded overflow-hidden bg-slate-200">
                          <Image src={selectedBuletin.cover} alt="Cover" fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 line-clamp-1 text-sm md:text-base">{selectedBuletin.title}</h3>
                        <p className="text-[10px] md:text-xs font-medium text-slate-500 uppercase">{selectedBuletin.edition}</p>
                      </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a 
                        href={selectedBuletin.pdfUrl} 
                        download 
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-slate-800 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">PDF</span>
                    </a>
                    <button onClick={() => setSelectedBuletin(null)} className="p-1.5 hover:bg-gray-100 rounded-full transition">
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                </div>

                <div className="flex-grow bg-slate-100 relative">
                  <iframe src={`${selectedBuletin.pdfUrl}#toolbar=0&view=FitH`} className="w-full h-full border-none" title="PDF Viewer" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}