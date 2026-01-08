"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, User, ArrowRight, Tag, ChevronLeft, ChevronRight, Filter } from "lucide-react";

const ITEMS_PER_PAGE = 6;
const CATEGORIES = ["All", "Berita", "Kegiatan", "Edukasi"];

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
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // --- LOGIC (Tetap Sama) ---
  const filteredNews = initialData.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "All" || item.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const featuredNews = search === "" && filterCategory === "All" 
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
    <div className="w-full space-y-10">

        {/* --- 1. NEW DESIGN: FILTER & SEARCH SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-gray-100">
          
          {/* Left: Modern Tabs */}
          <div className="flex items-center gap-8 overflow-x-auto w-full md:w-auto no-scrollbar relative">
             {CATEGORIES.map((cat) => {
               const isActive = filterCategory === cat;
               return (
                 <button
                   key={cat}
                   onClick={() => setFilterCategory(cat)}
                   className={`relative pb-3 text-sm font-medium transition-colors whitespace-nowrap ${
                     isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-800"
                   }`}
                 >
                   {cat}
                   {/* Animated Underline */}
                   {isActive && (
                     <motion.div 
                       layoutId="activeTab"
                       className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 rounded-full"
                     />
                   )}
                 </button>
               )
             })}
          </div>

          {/* Right: Search Bar */}
          <div className="relative w-full md:w-72 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-50 border-none text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all duration-300 shadow-sm"
              placeholder="Cari artikel atau kegiatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Featured News (Desain Sedikit Diperhalus Shadow-nya) */}
        <AnimatePresence>
        {featuredNews && currentPage === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-12"
          >
            <Link href={`/publikasi/berita-kegiatan/${featuredNews.slug}`} className="group relative block overflow-hidden rounded-3xl shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500">
              <div className="grid md:grid-cols-2 h-full bg-white">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <Image
                    src={featuredNews.image}
                    alt={featuredNews.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/20 to-transparent md:hidden" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Utama
                  </div>
                </div>
                <div className="p-6 md:p-12 flex flex-col justify-center bg-white relative">
                  {/* Decorative Background Element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 opacity-50" />

                  <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-4 uppercase tracking-wider">
                    <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {featuredNews.category}
                    </span>
                    <span>{featuredNews.date}</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-slate-600 transition-colors">
                    {featuredNews.title}
                  </h2>
                  <p className="text-gray-500 mb-8 line-clamp-3 text-base md:text-lg leading-relaxed">
                    {featuredNews.excerpt}
                  </p>
                  
                  <div className="flex items-center text-blue-700 font-bold text-sm gap-2 mt-auto group-hover:gap-3 transition-all">
                    BACA SELENGKAPNYA <ArrowRight className="w-4 h-4" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentListNews.map((news, index) => (
                <motion.div
                    key={news.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                    <Link href={`/publikasi/berita-kegiatan/${news.slug}`} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5">
                        {/* Image Container */}
                        <div className="relative h-52 overflow-hidden">
                            <Image
                                src={news.image}
                                alt={news.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            {/* Category Badge Floating */}
                            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-gray-800 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md shadow-sm">
                                {news.category}
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center text-xs text-gray-400 mb-4">
                                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full">
                                    <Calendar className="w-3 h-3" /> {news.date}
                                </span>
                                {/* Author */}
                                <span className="flex px-2 items-center gap-1">
                                  <User className="w-3 h-3" /> {news.author}
                                </span> 
                            </div>
                            
                            <h3 className="text-lg font-bold text-gray-800 mb-3 leading-snug group-hover:text-slate-600 transition-colors line-clamp-2">
                                {news.title}
                            </h3>
                            
                            <p className="text-gray-500 text-sm mb-5 line-clamp-3 leading-relaxed flex-grow">
                                {news.excerpt}
                            </p>
                            
                            <div className="pt-4 border-t border-gray-50 flex items-center text-blue-600 text-xs font-bold uppercase tracking-wider group-hover:text-blue-700">
                                Baca Artikel <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                </motion.div>
                ))}
            </div>
            ) : (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"
            >
                <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                    <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Tidak ada hasil ditemukan</h3>
                <p className="text-gray-500 text-sm mb-6">Coba kata kunci lain atau ubah filter kategori.</p>
                <button 
                    onClick={() => { setSearch(""); setFilterCategory("All"); }}
                    className="px-6 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                    Reset Filter
                </button>
            </motion.div>
            )}
        </div>

        {/* Pagination (Minimalist) */}
        {listNews.length > ITEMS_PER_PAGE && (
            <div className="mt-16 flex justify-center items-center gap-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-white hover:border-blue-200 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all bg-white shadow-sm"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-1 px-4">
                    <span className="text-sm font-medium text-gray-500">
                        Halaman <span className="text-gray-900 font-bold">{currentPage}</span> / {totalPages}
                    </span>
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-white hover:border-blue-200 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all bg-white shadow-sm"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        )}

      </div>
  );
}