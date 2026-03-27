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

  const filteredData = initialData.filter((item) => {
    return item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           item.edition.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    document.getElementById("buletin-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="w-full space-y-10 pb-10">

        {/* SEARCH BAR */}
        <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input 
                type="text" 
                placeholder="Cari edisi atau judul buletin..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm font-medium text-slate-800 placeholder-slate-400"
            />
        </div>

        {/* GRID DATA  */}
        <div id="buletin-grid" className="scroll-mt-32">
           {currentData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {currentData.map((item, index) => (
                    <motion.div
                        layoutId={`card-${item.id}`}
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="group flex flex-col items-center text-center cursor-pointer h-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300"
                        onClick={() => setSelectedBuletin(item)}
                    >
                  
                        <div className="relative w-full aspect-[3/4] max-w-[210px] mx-auto rounded-lg overflow-hidden shadow-md mb-5 bg-slate-100 border border-slate-200">
                            <Image
                                src={item.cover}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 150px, 210px"
                            />
                            
                            {/* Overlay Hover */}
                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors" />
                            
                            {/* Badge Tahun */}
                            <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm text-slate-800 border border-slate-200 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-md shadow-sm z-10">
                                {item.year}
                            </div>
                        </div>

                        {/* Text Info */}
                        <div className="w-full flex flex-col flex-grow items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-800 leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {item.title}
                            </h3>
                            <div className="text-[10px] bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-slate-500 uppercase tracking-widest font-bold w-fit">
                                {item.edition}
                            </div>
                        </div>

                    </motion.div>
                ))}
            </div>
           ) : (
             /* Empty State */
             <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="bg-slate-50 p-4 rounded-full mb-4 border border-slate-100">
                   <FileText className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Tidak ada buletin ditemukan</h3>
                <p className="text-sm font-medium text-slate-500 mb-6">Coba gunakan kata kunci pencarian yang lain.</p>
                <button 
                    onClick={() => setSearchQuery("")}
                    className="px-6 py-2 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                >
                    Hapus Pencarian
                </button>
             </div>
           )}
        </div>

        {/* PAGINATION  */}
        {filteredData.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center items-center gap-3 pt-8">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-white transition-all bg-white shadow-sm"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-1 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Halaman <span className="text-blue-600 ml-1">{currentPage}</span> <span className="mx-1">/</span> {totalPages}
                    </span>
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-white transition-all bg-white shadow-sm"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        )}

        {/* MODAL PDF VIEWER  */}
        <AnimatePresence>
          {selectedBuletin && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6"
            >
              <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md" onClick={() => setSelectedBuletin(null)} />
              
              <motion.div
                layoutId={`card-${selectedBuletin.id}`}
                className="bg-white w-full h-full md:max-w-5xl md:h-[90vh] md:rounded-3xl shadow-2xl relative flex flex-col overflow-hidden z-10"
              >
                {/* Header Modal */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white">
                  <div className="flex items-center gap-4">
                      <div className="hidden sm:block w-10 h-14 relative rounded border border-slate-200 overflow-hidden bg-slate-100">
                          <Image src={selectedBuletin.cover} alt="Cover" fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 line-clamp-1 text-sm md:text-base mb-0.5">{selectedBuletin.title}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedBuletin.edition}</p>
                      </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a 
                        href={selectedBuletin.pdfUrl} 
                        download 
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Unduh PDF</span>
                    </a>
                    <div className="w-px h-6 bg-slate-200 hidden md:block mx-1"></div>
                    <button onClick={() => setSelectedBuletin(null)} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500">
                      <X className="w-5 h-5" />
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