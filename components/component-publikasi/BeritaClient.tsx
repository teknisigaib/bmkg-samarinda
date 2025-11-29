"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Calendar, User, ArrowRight, Tag, ChevronLeft, ChevronRight } from "lucide-react";
// HAPUS import MOCK_NEWS dari sini! Kita pakai props.

const ITEMS_PER_PAGE = 6;

// 1. Definisikan Tipe Data Props
interface NewsItem {
  id: string; // ID Prisma itu string (CUID), bukan number
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
  initialData: NewsItem[]; // Data yang diterima dari Database
}

// 2. Terima Props di sini
export default function BeritaClient({ initialData }: BeritaClientProps) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // 3. Gunakan 'initialData' sebagai sumber data, BUKAN 'MOCK_NEWS'
  const filteredNews = initialData.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "All" || item.category === filterCategory;
    return matchSearch && matchCategory;
  });

  // --- Sisa logika di bawah ini SAMA PERSIS, tidak perlu diubah ---
  
  const featuredNews = search === "" && filterCategory === "All" 
    ? initialData.find((item) => item.isFeatured) // Ganti MOCK_NEWS jadi initialData
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
    <div className="min-h-screen bg-gray-50 pb-20 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-800"
          >
            Berita & Kegiatan
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Informasi terkini seputar meteorologi, klimatologi, geofisika, serta kegiatan resmi Stasiun Meteorologi APT Pranoto Samarinda.
          </motion.p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {["All", "Berita", "Kegiatan", "Edukasi"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  filterCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berita..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Featured News */}
        {featuredNews && currentPage === 1 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12"
          >
            <Link href={`/publikasi/berita-kegiatan/${featuredNews.slug}`} className="group relative block overflow-hidden rounded-2xl shadow-lg">
              <div className="grid md:grid-cols-2 h-full bg-white">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <Image
                    src={featuredNews.image}
                    alt={featuredNews.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Utama
                  </div>
                </div>
                <div className="p-6 md:p-10 flex flex-col justify-center bg-gradient-to-br from-white to-blue-200">
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1 text-blue-600 font-semibold">
                      <Tag className="w-3 h-3" /> {featuredNews.category}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {featuredNews.date}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 group-hover:text-blue-700 transition-colors">
                    {featuredNews.title}
                  </h2>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {featuredNews.excerpt}
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold text-sm gap-2">
                    Baca Selengkapnya <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* List News Grid */}
        <div id="news-grid" className="scroll-mt-24">
            {currentListNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentListNews.map((news, index) => (
                <motion.div
                    key={news.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Link href={`/publikasi/berita-kegiatan/${news.slug}`} className="group flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all">
                    <div className="relative h-48 overflow-hidden">
                        <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2 py-1 rounded shadow-sm">
                        {news.category}
                        </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {news.date}
                        </span>
                        <span className="flex items-center gap-1">
                            <User className="w-3 h-3" /> {news.author}
                        </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {news.title}
                        </h3>
                        
                        <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow">
                        {news.excerpt}
                        </p>
                        
                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <span className="text-blue-600 text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Baca <ArrowRight className="w-3 h-3" />
                        </span>
                        </div>
                    </div>
                    </Link>
                </motion.div>
                ))}
            </div>
            ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">Tidak ada berita yang ditemukan.</p>
                <button 
                    onClick={() => { setSearch(""); setFilterCategory("All"); }}
                    className="mt-2 text-blue-600 text-sm hover:underline"
                >
                    Reset Filter
                </button>
            </div>
            )}
        </div>

        {/* Pagination */}
        {listNews.length > ITEMS_PER_PAGE && (
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

      </div>
    </div>
  );
}