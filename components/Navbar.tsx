"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";

type NavItem = {
  key: string;
  label: string;
  items: {
    name: string;
    desc: string;
    href: string;
  }[];
};

const NAV_ITEMS: NavItem[] = [
  {
    key: "profil",
    label: "Profil",
    items: [
      { name: "Visi & Misi", desc: "Tujuan dan arah pembangunan", href: "/profil/visi-misi" },
      { name: "Tugas & Fungsi", desc: "Peran dan tanggung jawab utama", href: "/profil/tugas-fungsi" },
      { name: "Daftar Pegawai", desc: "Struktur organisasi dan pegawai", href: "/profil/daftar-pegawai" },
      { name: "Transparansi Kinerja", desc: "Pelaporan dan keterbukaan publik", href: "/profil/transparansi-kinerja" },
    ]
  },
  {
    key: "cuaca",
    label: "Cuaca",
    items: [
      { name: "Prakiraan Cuaca", desc: "Lihat prakiraan cuaca harian", href: "/cuaca/prakiraan" },
      { name: "Peringatan Dini", desc: "Informasi cuaca ekstrem", href: "/cuaca/peringatan-dini" },
      { name: "Cuaca Penerbangan", desc: "Info cuaca untuk penerbangan", href: "/cuaca/penerbangan" },
      { name: "Cuaca Maritim", desc: "Info cuaca untuk pelayaran", href: "/cuaca/maritim" },
      { name: "Cuaca Mahakam", desc: "Prakiraan cuaca sungai Mahakam", href: "/cuaca/mahakam" },
      { name: "Satelit Cuaca", desc: "Visualisasi citra satelit cuaca", href: "/cuaca/satelit" },
      { name: "Peringatan Karhutla", desc: "Kebakaran hutan dan lahan", href: "/cuaca/karhutla" },
      { name: "Peta Cuaca", desc: "Peta pantauan cuaca secara real-time", href: "/cuaca/peta-cuaca" },
    ]
  },
  {
    key: "gempa",
    label: "Gempa",
    items: [
      { name: "Gempa Bumi Terbaru", desc: "Data gempa terkini", href: "/gempa/gempa-terbaru" },
    ]
  },
  {
    key: "iklim",
    label: "Iklim",
    items: [
      { name: "Info Hari Tanpa Hujan", desc: "Pantauan hari tanpa hujan", href: "/iklim/hari-tanpa-hujan" },
      { name: "Prakiraan Hujan", desc: "Prakiraan Hujan", href: "/iklim/prakiraan-hujan" },
      { name: "Analisis Hujan", desc: "Analisis Hujan", href: "/iklim/analisis-hujan" },
      { name: "PDIE", desc: "Peringatan Dini Iklim Ekstrem", href: "/iklim/peringatan-dini" },
      { name: "Kualitas Udara", desc: "Pantauan Konsentrasi PM25", href: "/iklim/kualitas-udara" },
    ]
  },
  {
    key: "publikasi",
    label: "Publikasi",
    items: [
      { name: "Berita & Kegiatan", desc: "Berita terkini BMKG", href: "/publikasi/berita-kegiatan" },
      { name: "Buletin", desc: "Publikasi buletin berkala", href: "/publikasi/buletin" },
      { name: "Artikel dan Makalah", desc: "Artikel ilmiah", href: "/publikasi/artikel" },
    ]
  }
];

export default function Navbar() {
  const pathname = usePathname(); 
  const [activeDesktop, setActiveDesktop] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMobileSub, setActiveMobileSub] = useState<string | null>(null);

  const isPathActive = (key: string) => pathname.startsWith(`/${key}`);

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm fixed top-0 w-full z-[9999] transition-all">
        {/* Tambahkan 'relative' di sini agar absolute centering berfungsi baik */}
        <div className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between h-[60px]">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 z-50 group">
            <Image 
              src="/logo-bmkg.png" 
              alt="Logo BMKG" 
              width={44} 
              height={44} 
              priority 
              className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col justify-center">
              <span className="text-gray-900 font-bold text-[12px] sm:text-xs md:text-sm tracking-tight leading-tight">
                BMKG
              </span>
              <span className="text-[9px] sm:text-[12px] md:text-sm text-gray-500 font-medium leading-tight">
                Stasiun Meteorologi APT Pranoto
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU - Menggunakan Absolute Centering agar benar-benar di tengah */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 justify-center items-center space-x-1">
            <Link 
              href="/" 
              className={`px-3 xl:px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                pathname === "/" ? "bg-slate-100 text-blue-700" : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
              }`}
            >
              Beranda
            </Link>
             
            {NAV_ITEMS.map((menu) => {
              const isActive = isPathActive(menu.key);
              const isHovered = activeDesktop === menu.key;
              const isMultiColumn = menu.items.length > 5;

              return (
                <div 
                  key={menu.key} 
                  className="relative" 
                  onMouseEnter={() => setActiveDesktop(menu.key)} 
                  onMouseLeave={() => setActiveDesktop(null)}
                >
                  <button 
                    className={`px-3 xl:px-4 py-2 text-sm font-semibold flex items-center gap-1.5 rounded-lg transition-all ${
                       isHovered ? "bg-slate-50 text-gray-900" 
                     : isActive ? "bg-slate-100 text-blue-700" 
                     : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
                    }`}
                  >
                    {menu.label}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isHovered ? "rotate-180" : "opacity-50"}`} />
                  </button>

                  <AnimatePresence>
                    {isHovered && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.98 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 10, scale: 0.98 }} 
                        transition={{ duration: 0.15, ease: "easeOut" }} 
                        className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden"
                        style={{ width: isMultiColumn ? '600px' : '280px' }}
                      >
                        {/* Gap diperbesar sedikit jadi gap-2 agar border tidak dempet */}
                        <div className={`p-3 grid gap-2 ${isMultiColumn ? 'grid-cols-2' : 'grid-cols-1'}`}>
                          {menu.items.map((item) => {
                            const isSubActive = pathname === item.href;
                            return (
                              <Link 
                                key={item.href} 
                                href={item.href} 
                                onClick={() => setActiveDesktop(null)} 
                                // REVISI BORDER: Menambahkan border tipis di setiap item
                                className={`block p-3 rounded-xl border transition-all group/item ${
                                  isSubActive 
                                    ? 'bg-blue-50/50 border-blue-100' 
                                    : 'border-gray-100/70 hover:bg-slate-50 hover:border-gray-200 hover:shadow-sm'
                                }`}
                              >
                                <p className={`text-sm font-semibold mb-0.5 transition-colors ${
                                  isSubActive ? 'text-blue-700' : 'text-gray-800 group-hover/item:text-blue-600'
                                }`}>
                                  {item.name}
                                </p>
                                <p className="text-[12px] text-gray-500 leading-snug">
                                  {item.desc}
                                </p>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* TAMBAHAN MENU LAYANAN DATA DI DESKTOP */}
            <Link 
              href="/layanan" 
              className={`px-3 xl:px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                pathname.startsWith("/layanan") ? "bg-slate-100 text-blue-700" : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
              }`}
            >
              Layanan Data
            </Link>

          </div>

          {/* RIGHT ACTION BUTTON */}
          <div className="flex items-center gap-3 z-50">
            <Link 
               href="/contact" 
               className="hidden md:flex items-center justify-center text-sm font-semibold px-5 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow-sm"
            >
               Hubungi Kami
            </Link>
            
            <button 
              onClick={() => setMobileOpen(true)} 
              className="lg:hidden p-2 text-gray-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </nav>

      {/* MOBILE FULL-SCREEN MENU (Sisa kode mobile tetap sama) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white z-[10000] lg:hidden flex flex-col h-[100dvh]"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <span className="font-bold text-lg text-gray-900">Menu Navigasi</span>
              <button 
                onClick={() => setMobileOpen(false)} 
                className="p-2 text-gray-500 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <Link 
                href="/" 
                onClick={() => setMobileOpen(false)} 
                className={`block px-4 py-3.5 text-base font-semibold rounded-xl mb-2 transition-colors ${
                  pathname === "/" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-slate-50"
                }`}
              >
                Beranda
              </Link>
              
              <div className="space-y-2">
                {NAV_ITEMS.map((menu) => {
                  const isActive = isPathActive(menu.key);
                  const isExpanded = activeMobileSub === menu.key;

                  return (
                    <div key={menu.key} className="bg-slate-50/50 rounded-xl overflow-hidden border border-gray-100">
                      <button 
                        onClick={() => setActiveMobileSub(isExpanded ? null : menu.key)} 
                        className={`w-full flex items-center justify-between px-4 py-3.5 text-base font-semibold transition-colors ${
                          isActive || isExpanded ? "text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {menu.label}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: "auto", opacity: 1 }} 
                            exit={{ height: 0, opacity: 0 }} 
                            className="overflow-hidden bg-white"
                          >
                            <div className="p-2 space-y-1">
                              {menu.items.map((item) => {
                            const isSubActive = pathname === item.href;
                            return (
                              <Link 
                                key={item.href} 
                                href={item.href} 
                                onClick={() => setActiveDesktop(null)} 
                                // REVISI BORDER: Garis dipertegas (gray-200) & diberi shadow ringan
                                className={`block p-3 rounded-xl border shadow-sm transition-all group/item ${
                                  isSubActive 
                                    ? 'bg-blue-50 border-blue-200' 
                                    : 'bg-white border-gray-200 hover:bg-slate-50 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5'
                                }`}
                              >
                                <p className={`text-sm font-semibold mb-0.5 transition-colors ${
                                  isSubActive ? 'text-blue-700' : 'text-gray-800 group-hover/item:text-blue-600'
                                }`}>
                                  {item.name}
                                </p>
                                <p className="text-[12px] text-gray-500 leading-snug">
                                  {item.desc}
                                </p>
                              </Link>
                            );
                          })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* TAMBAHAN MENU LAYANAN DATA DI MOBILE */}
                <Link 
                  href="/layanan" 
                  onClick={() => setMobileOpen(false)} 
                  className={`block px-4 py-3.5 mt-2 text-base font-semibold rounded-xl transition-colors border border-transparent ${
                    pathname.startsWith("/layanan") ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-slate-50/50 text-gray-700 hover:bg-slate-50 border-gray-100"
                  }`}
                >
                  Layanan Data
                </Link>

              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-slate-50">
              <Link 
                href="/contact" 
                onClick={() => setMobileOpen(false)} 
                className="flex items-center justify-center w-full py-3.5 bg-gray-900 text-white font-semibold rounded-xl"
              >
                Hubungi Kami
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}