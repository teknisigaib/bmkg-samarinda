"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, User, ArrowRight, ChevronLeft, ChevronRight, Filter } from "lucide-react";

const ITEMS_PER_PAGE = 9;
const CATEGORIES = ["Semua", "Berita", "Kegiatan", "Edukasi"];

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: "Berita" | "Kegiatan" | "Edukasi";
  date: string;
  author: string;
  excerpt: string;
  image: string;
  isFeatured: boolean;
}

interface BeritaClientProps {
  initialData: NewsItem[];
}

export default function BeritaClient({ initialData }: BeritaClientProps) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredNews = initialData.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "Semua" || item.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const featuredNews = search === "" && filterCategory === "Semua" 
    ? initialData.find((item) => item.isFeatured) 
    : null;

  const listNews = featuredNews 
    ? filteredNews.filter(item => item.id !== featuredNews.id) 
    : filteredNews;

  const totalPages = Math.ceil(listNews.length / ITEMS_PER_PAGE);
  const currentListNews = listNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterCategory]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const gridElement = document.getElementById("news-grid");
    if (gridElement) {
        gridElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full space-y-8 pb-10">

        {/* Tab & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-slate-200">
          
          {/* Left Tabs */}
          <div className="flex items-center gap-8  w-full md:w-auto no-scrollbar relative">
             {CATEGORIES.map((cat) => {
               const isActive = filterCategory === cat;
               return (
                 <button
                   key={cat}
                   onClick={() => setFilterCategory(cat)}
                   className={`relative pb-3 text-sm font-semibold transition-colors  ${
                     isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-700"
                   }`}
                 >
                   {cat}
                   {/* Animated Underline */}
                   {isActive && (
                     <motion.div 
                       layoutId="activeTabBerita"
                       className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-blue-600 rounded-t-full"
                     />
                   )}
                 </button>
               )
             })}
          </div>

          {/* Right: Search Bar */}
          <div className="relative w-full md:w-72 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              placeholder="Cari artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Featured News */}
        <AnimatePresence>
        {featuredNews && currentPage === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-10"
          >
            <Link href={`/publikasi/berita-kegiatan/${featuredNews.slug}`} className="group relative block overflow-hidden rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 hover:shadow-blue-900/5 transition-all duration-500 bg-white">
              <div className="grid md:grid-cols-2 h-full">
                <div className="relative h-64 md:h-auto overflow-hidden bg-slate-100">
                  <Image
                    src={featuredNews.image}
                    alt={featuredNews.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-slate-200 text-blue-700 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5" /> Berita Utama
                  </div>
                </div>
                <div className="p-6 md:p-10 flex flex-col justify-center bg-white relative">
                  
                  <div className="flex items-center gap-3 text-[12px] text-slate-500 mb-4">
                    <span className="text-blue-600 bg-blue-50 border font-bold border-blue-100 px-3 py-1 rounded-lg">
                      {featuredNews.category}
                    </span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {featuredNews.date}</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 leading-snug group-hover:text-blue-700 transition-colors">
                    {featuredNews.title}
                  </h2>
                  <p className="text-slate-500 mb-8 line-clamp-3 text-sm md:text-base leading-relaxed font-medium">
                    {featuredNews.excerpt}
                  </p>
                  
                  <div className="flex items-center text-blue-600 font-bold text-[10px] uppercase tracking-widest gap-2 mt-auto group-hover:gap-3 transition-all">
                    BACA SELENGKAPNYA <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}
        </AnimatePresence>

        {/* List News Grid */}
        <div id="news-grid" className="scroll-mt-32">
            {currentListNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentListNews.map((news, index) => (
                <motion.div
                    key={news.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                    <Link href={`/publikasi/berita-kegiatan/${news.slug}`} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 hover:shadow-blue-900/5">
                        
                        {/* Image Container */}
                        <div className="relative h-52 overflow-hidden bg-slate-100">
                            <Image
                                src={news.image}
                                alt={news.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Category Badge Floating */}
                            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm border border-slate-200 text-slate-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
                                {news.category}
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center flex-wrap gap-2 text-[12px] text-slate-500 mb-4">
                                <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                                    <Calendar className="w-3 h-3 text-blue-500" /> {news.date}
                                </span>
                                <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                                  <User className="w-3 h-3 text-emerald-500" /> {news.author}
                                </span> 
                            </div>
                            
                            <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                                {news.title}
                            </h3>
                            
                            <p className="text-slate-500 text-sm mb-5 line-clamp-3 leading-relaxed flex-grow font-medium">
                                {news.excerpt}
                            </p>
                            
                            <div className="pt-4 border-t border-slate-100 flex items-center text-blue-600 text-[10px] font-bold uppercase tracking-widest group-hover:text-blue-800">
                                Baca Artikel <ArrowRight className="w-3 h-3 ml-1.5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                </motion.div>
                ))}
            </div>
            ) : (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm"
            >
                <div className="bg-slate-50 p-4 rounded-full mb-4 shadow-sm border border-slate-100">
                    <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Tidak ada hasil ditemukan</h3>
                <p className="text-slate-500 text-sm mb-6 font-medium">Coba kata kunci lain atau ubah filter kategori pencarian.</p>
                <button 
                    onClick={() => { setSearch(""); setFilterCategory("All"); }}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                >
                    Reset Filter
                </button>
            </motion.div>
            )}
        </div>

        {/* Pagination  */}
        {listNews.length > ITEMS_PER_PAGE && (
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

      </div>
  );
}