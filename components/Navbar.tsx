"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";

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
      { name: "Prakiraan Cuaca", desc: "Lihat prakiraan cuaca harian", href: "/cuaca/prakicu" },
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

  const handleCloseMobileMenu = () => {
    setMobileOpen(false);
    setActiveMobileSub(null);
  };

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm fixed top-0 w-full z-[9990] transition-all">
        <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[64px]">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 z-50 group shrink-0">
            <Image 
              src="/logo-bmkg.png" 
              alt="Logo BMKG" 
              width={44} 
              height={44} 
              priority 
              className="w-9 h-9 sm:w-11 sm:h-11 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col justify-center">
              <span className="text-gray-900 font-bold text-[12px] sm:text-xs md:text-sm tracking-tight leading-tight">
                BMKG
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm text-gray-500 font-medium leading-tight">
                Stasiun Meteorologi APT Pranoto
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 justify-center items-center space-x-2 z-40">
            <Link 
              href="/" 
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
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
                    className={`px-3 py-2 text-sm font-semibold flex items-center rounded-lg transition-all ${
                        isHovered ? "bg-slate-50 text-gray-900" 
                      : isActive ? "bg-slate-100 text-blue-700" 
                      : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
                    }`}
                  >
                    {menu.label}
                  </button>

                  <AnimatePresence>
                    {isHovered && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.98 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 10, scale: 0.98 }} 
                        transition={{ duration: 0.15, ease: "easeOut" }} 
                        className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden"
                        style={{ width: isMultiColumn ? '640px' : '300px' }}
                      >
                        <div className={`px-6 py-4 grid gap-x-10 ${isMultiColumn ? 'grid-cols-2' : 'grid-cols-1'}`}>
                          {menu.items.map((item, index) => {
                            const isSubActive = pathname === item.href;
                            const isLastRow = isMultiColumn 
                              ? index >= menu.items.length - (menu.items.length % 2 === 0 ? 2 : 1)
                              : index === menu.items.length - 1;

                            return (
                              <Link 
                                key={item.href} 
                                href={item.href} 
                                onClick={() => setActiveDesktop(null)} 
                                className={`block py-3.5 group/item transition-all ${
                                  !isLastRow ? 'border-b border-slate-100' : ''
                                }`}
                              >
                                <p className={`text-sm font-semibold mb-0.5 transition-transform duration-300 ${
                                  isSubActive ? 'text-blue-700' : 'text-slate-800 group-hover/item:text-blue-600 group-hover/item:translate-x-1'
                                }`}>
                                  {item.name}
                                </p>
                                <p className="text-[12px] text-slate-500 leading-snug transition-transform duration-300 group-hover/item:translate-x-1">
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

            <Link 
              href="/layanan" 
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
                pathname.startsWith("/layanan") ? "bg-slate-100 text-blue-700" : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
              }`}
            >
              Layanan
            </Link>
          </div>

          {/* RIGHT ACTION BUTTON */}
          <div className="flex items-center gap-3 z-50 shrink-0">
            <Link 
               href="/contact" 
               className="hidden md:flex items-center justify-center text-sm font-semibold px-5 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow-sm whitespace-nowrap"
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

      {/* MOBILE FULL-SCREEN MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-0 z-[9999] lg:hidden bg-white/95 backdrop-blur-xl flex flex-col h-[100dvh]"
          >
            {/* Header Mobile Menu */}
            <div className="flex justify-between items-center px-4 sm:px-6 h-[64px] border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                <Image src="/logo-bmkg.png" alt="BMKG" width={28} height={28} className="w-7 h-7" />
                <span className="font-semibold text-slate-800 text-sm tracking-tight">Menu Navigasi</span>
              </div>
              <button 
                onClick={handleCloseMobileMenu} 
                className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List Menu */}
            <div className="flex-1 overflow-y-auto px-6 py-4 pb-28">
              <div className="flex flex-col">
                
                {/* Border dipertegas jadi border-slate-200 */}
                <Link 
                  href="/" 
                  onClick={handleCloseMobileMenu} 
                  className={`py-3.5 text-[17px] font-semibold transition-colors border-b border-slate-200 ${
                    pathname === "/" ? "text-blue-600" : "text-slate-700"
                  }`}
                >
                  Beranda
                </Link>
                
                {NAV_ITEMS.map((menu) => {
                  const isActive = isPathActive(menu.key);
                  const isExpanded = activeMobileSub === menu.key;

                  return (
                    <div key={menu.key} className="flex flex-col border-b border-slate-200">
                      <button 
                        onClick={() => setActiveMobileSub(isExpanded ? null : menu.key)} 
                        className={`w-full flex items-center justify-between py-3.5 text-[17px] font-semibold transition-colors ${
                          isActive || isExpanded ? "text-blue-600" : "text-slate-700"
                        }`}
                      >
                        {menu.label}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180 text-blue-600" : "text-slate-400"}`} />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: "auto", opacity: 1 }} 
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            {/* Garis thread di kiri diperjelas (border-slate-200) */}
                            <div className="flex flex-col pl-4 ml-1.5 border-l-[3px] border-slate-200 mb-3 mt-1">
                              {menu.items.map((item, index) => {
                                const isSubActive = pathname === item.href;
                                const isLastItem = index === menu.items.length - 1;
                                
                                return (
                                  <Link 
                                    key={item.href} 
                                    href={item.href} 
                                    onClick={handleCloseMobileMenu}
                                    // Pemisah antar item sub-menu menggunakan border-b
                                    className={`flex flex-col py-3 group ${!isLastItem ? 'border-b border-slate-100' : ''}`}
                                  >
                                    <span className={`text-sm font-medium transition-colors ${
                                      isSubActive ? "text-blue-600" : "text-slate-600 group-hover:text-blue-600"
                                    }`}>
                                      {item.name}
                                    </span>
                                    <span className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                                      {item.desc}
                                    </span>
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

                <Link 
                  href="/ptsp" 
                  onClick={handleCloseMobileMenu} 
                  className={`py-3.5 text-[17px] font-semibold transition-colors ${
                    pathname.startsWith("/ptsp") ? "text-blue-600" : "text-slate-700"
                  }`}
                >
                  Layanan
                </Link>

              </div>
            </div>

            {/* Sticky Bottom Action Button */}
            <div className="absolute bottom-0 left-0 w-full px-6 pb-8 pt-4 bg-gradient-to-t from-white via-white/95 to-transparent">
              <Link 
                href="/contact" 
                onClick={handleCloseMobileMenu} 
                className="flex items-center justify-center w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-slate-900/10 active:scale-[0.98] transition-all"
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