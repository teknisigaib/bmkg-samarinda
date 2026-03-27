"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Download, User, Calendar, X, ExternalLink, Tag, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

export type PublikasiType = "Artikel" | "Makalah";

export type PublikasiItem = {
  id: string;
  type: PublikasiType;
  title: string;
  author: string;
  year: string;
  tags: string[];
  abstract: string;
  cover?: string;
  pdfUrl: string;
};

interface PublikasiListProps {
  initialData: PublikasiItem[];
}

const ITEMS_PER_PAGE = 5;

export default function PublikasiListClient({ initialData }: PublikasiListProps) {
  const [selectedItem, setSelectedItem] = useState<PublikasiItem | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"Semua" | PublikasiType>("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = initialData.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                        item.author.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "Semua" || item.type === filterType;
    return matchSearch && matchType;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterType]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full space-y-10 pb-10">

        {/* Controls */}
        <div className="space-y-6">
            {/* Tabs Filter */}
            <div className="flex justify-center">
                <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 inline-flex">
                    {(["Semua", "Artikel", "Makalah"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilterType(tab)}
                            className={`px-6 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-200 ${
                                filterType === tab
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all"
                    placeholder="Cari judul publikasi atau nama penulis..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>

        {/* List Data */}
        <div className="space-y-5 max-w-4xl mx-auto">
          {currentData.length > 0 ? (
            currentData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedItem(item)}
                className={`group relative bg-white rounded-2xl p-5 md:p-7 border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden
                  ${item.type === 'Artikel' ? 'border-slate-200 hover:border-orange-300' : 'border-slate-200 hover:border-blue-300'}
                `}
              >
                {/* Border Aksen Kiri */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 
                    ${item.type === 'Artikel' ? 'bg-orange-400' : 'bg-blue-500'}
                `}></div>

                <div className="pl-3 md:pl-4 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest border ${
                                item.type === 'Artikel' 
                                ? 'bg-orange-50 text-orange-600 border-orange-100' 
                                : 'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                                {item.type}
                            </span>
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" /> {item.year}
                            </span>
                        </div>
                        <div className="text-slate-300 group-hover:text-blue-600 transition-colors bg-slate-50 p-2 rounded-full">
                            <Download className="w-4 h-4" />
                        </div>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-snug">
                        {item.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-100">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {item.author}
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-5 font-medium">
                        {item.abstract}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                        {item.tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
                                <Tag className="w-3 h-3 text-slate-400" /> {tag}
                            </span>
                        ))}
                    </div>
                </div>
              </motion.div>
            ))
          ) : (
            /* Empty State */
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <BookOpen className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">Tidak ada dokumen yang ditemukan.</p>
                <button 
                    onClick={() => { setSearch(""); setFilterType("Semua"); }}
                    className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors mt-3 px-4 py-2 bg-blue-50 rounded-lg"
                >
                    Reset Filter Pencarian
                </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredData.length > ITEMS_PER_PAGE && (
            <div className="mt-12 flex justify-center items-center gap-3">
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

        {/* Modal PDF Viewer */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center p-0 md:p-6"
            >
              <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
              
              <motion.div
                layoutId={`card-${selectedItem.id}`}
                className="bg-white w-full h-full md:max-w-5xl md:h-[90vh] md:rounded-2xl shadow-2xl relative flex flex-col overflow-hidden z-10"
              >
                {/* Header Modal */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white">
                  <div className="pr-4 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest border ${
                            selectedItem.type === 'Artikel' ? 'bg-orange-50 border-orange-100 text-orange-700' : 'bg-blue-50 border-blue-100 text-blue-700'
                        }`}>
                            {selectedItem.type}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tahun {selectedItem.year}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 line-clamp-1 text-sm md:text-base">{selectedItem.title}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <a 
                        href={selectedItem.pdfUrl} 
                        download 
                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh
                    </a>
                    <div className="w-px h-6 bg-slate-200 hidden md:block mx-1"></div>
                    <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-grow bg-slate-100 relative">
                  <iframe src={`${selectedItem.pdfUrl}#toolbar=0&view=FitH`} className="w-full h-full border-none" title="PDF Viewer" />
                  
                  {/* Tombol Eksternal untuk HP */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:hidden">
                    <a href={selectedItem.pdfUrl} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white shadow-xl rounded-full text-xs font-bold uppercase tracking-widest">
                      <ExternalLink className="w-4 h-4" /> Buka di Browser
                    </a>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}