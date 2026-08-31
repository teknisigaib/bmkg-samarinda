"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";

// Tipe Data Rekursif: Mengizinkan subItems di dalam subItems (Tak terbatas)
type NavSubItem = {
  name: string;
  desc: string;
  href?: string;
  subItems?: NavSubItem[]; 
};

type NavItem = {
  key: string;
  label: string;
  items: NavSubItem[];
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
      {
        name: "Perubahan Iklim",
        desc: "Fakta, indikator, dan proyeksi",
        subItems: [
          { name: "Fakta Perubahan Iklim", desc: "Informasi dasar", href: "/iklim/perubahan-iklim/fakta" },
          { 
            name: "Indikator Perubahan Iklim", 
            desc: "Warming stripes & anomali", 
            subItems: [
              { name: "Warming Stripes", desc: "Visualisasi pemanasan global", href: "/iklim/perubahan-iklim/indikator/warming-stripes" },
              { name: "Anomali Suhu Udara Bulanan", desc: "Penyimpangan suhu rata-rata", href: "/iklim/perubahan-iklim/indikator/anomali-suhu" },
              { name: "Analisis Suhu Udara Harian", desc: "Analisis suhu udara rata-rata harian", href: "/iklim/perubahan-iklim/indikator/analisis-suhu-harian" },
              { name: "Grafik Laju Perubahan Iklim", desc: "Tren perubahan dari waktu ke waktu", href: "/iklim/perubahan-iklim/indikator/grafik-laju" },
            ]
          },
          { 
            name: "Proyeksi Perubahan Iklim", 
            desc: "Prediksi curah hujan & suhu", 
            subItems: [
              { name: "Proyeksi Curah Hujan", desc: "Estimasi curah hujan di masa depan", href: "/iklim/perubahan-iklim/proyeksi/curah-hujan" },
              { name: "Proyeksi Suhu Udara", desc: "Estimasi suhu udara di masa depan", href: "/iklim/perubahan-iklim/proyeksi/suhu-udara" },
            ]
          },
          { name: "Glosarium", desc: "Istilah terkait perubahan iklim", href: "/iklim/perubahan-iklim/glosarium" },
        ]
      }
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
  
  // State untuk melacak sub-menu (level 2) yang sedang di-hover di desktop
  const [activeDesktopSub, setActiveDesktopSub] = useState<string | null>(null);
  
  // State untuk melacak sub-sub-menu (level 3) yang sedang di-hover di desktop
  const [activeDesktopSubSub, setActiveDesktopSubSub] = useState<string | null>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMobileSub, setActiveMobileSub] = useState<string | null>(null);
  
  // PERBAIKAN: Gunakan Record (Object) untuk melacak banyak sub-menu yang terbuka di mobile
  const [expandedMobileItems, setExpandedMobileItems] = useState<Record<string, boolean>>({});

  const isPathActive = (key: string) => pathname.startsWith(`/${key}`);

  const handleCloseMobileMenu = () => {
    setMobileOpen(false);
    setActiveMobileSub(null);
    setExpandedMobileItems({}); // Reset semua sub-menu mobile
  };

  // Komponen untuk me-render sub-item di Desktop
  const renderDesktopSubItem = (item: NavSubItem) => {
    const isSubActive = item.href ? pathname === item.href : false;

    if (item.subItems) {
      const isHovered = activeDesktopSub === item.name;
      
      return (
        <div 
          key={item.name}
          className="relative py-3.5 border-b border-slate-100 group/item"
          onMouseEnter={() => setActiveDesktopSub(item.name)}
          onMouseLeave={() => {
              setActiveDesktopSub(null);
              setActiveDesktopSubSub(null);
          }}
        >
          <div className="flex items-center justify-between cursor-pointer text-slate-800 group-hover/item:text-blue-600 transition-colors">
            <div>
              <p className="text-sm font-semibold mb-0.5">{item.name}</p>
              <p className="text-[12px] text-slate-500 leading-snug">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover/item:text-blue-600 transition-colors" />
          </div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute left-full top-0 ml-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-visible z-50"
              >
                <div className="px-4 py-2">
                  {item.subItems.map((sub) => (
                    <React.Fragment key={sub.name}>
                       {/* Render level 3 (sub-sub-items) jika ada */}
                       {sub.subItems ? (
                          <div 
                             className="relative py-3 border-b border-slate-100 last:border-b-0 group/subitem"
                             onMouseEnter={() => setActiveDesktopSubSub(sub.name)}
                             onMouseLeave={() => setActiveDesktopSubSub(null)}
                          >
                             <div className="flex items-center justify-between cursor-pointer text-slate-700 group-hover/subitem:text-blue-600 transition-colors">
                                <div>
                                   <p className="text-sm font-medium">{sub.name}</p>
                                   <p className="text-[11px] text-slate-400 leading-tight">{sub.desc}</p>
                                </div>
                                <ChevronRight className="w-3 h-3 text-slate-300 group-hover/subitem:text-blue-500" />
                             </div>

                             <AnimatePresence>
                               {activeDesktopSubSub === sub.name && (
                                 <motion.div
                                   initial={{ opacity: 0, x: -5 }}
                                   animate={{ opacity: 1, x: 0 }}
                                   exit={{ opacity: 0, x: -5 }}
                                   transition={{ duration: 0.1 }}
                                   className="absolute left-full top-0 ml-1 w-56 bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden z-[60]"
                                 >
                                    <div className="px-3 py-1">
                                      {sub.subItems.map(deepSub => (
                                          <Link 
                                            key={deepSub.href} 
                                            href={deepSub.href!}
                                            onClick={() => {
                                                setActiveDesktop(null);
                                                setActiveDesktopSub(null);
                                                setActiveDesktopSubSub(null);
                                            }}
                                            className="block py-2.5 border-b border-slate-50 last:border-b-0 group/deep"
                                          >
                                             <p className="text-sm font-medium text-slate-600 group-hover/deep:text-blue-600 transition-colors">{deepSub.name}</p>
                                          </Link>
                                      ))}
                                    </div>
                                 </motion.div>
                               )}
                             </AnimatePresence>
                          </div>
                       ) : (
                          <Link 
                            href={sub.href!}
                            onClick={() => {
                                setActiveDesktop(null);
                                setActiveDesktopSub(null);
                                setActiveDesktopSubSub(null);
                            }}
                            className="block py-3 border-b border-slate-100 last:border-b-0 group/link"
                          >
                            <p className="text-sm font-medium text-slate-700 group-hover/link:text-blue-600 transition-colors">{sub.name}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-tight group-hover/link:text-slate-500">{sub.desc}</p>
                          </Link>
                       )}
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <Link 
        key={item.href} 
        href={item.href!} 
        onClick={() => {
            setActiveDesktop(null);
            setActiveDesktopSub(null);
            setActiveDesktopSubSub(null);
        }} 
        className={`block py-3.5 group/item transition-all border-b border-slate-100 last:border-b-0`}
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
  };

  // Render rekursif untuk mobile dengan state expandedMobileItems
  const renderMobileSubItems = (subItems: any[], parentName: string, level: number = 1) => {
    return subItems.map((item) => {
      const isExpanded = !!expandedMobileItems[item.name];
      const isSubActive = item.href && pathname === item.href;

      if (item.subItems) {
        return (
          <div key={item.name} className="flex flex-col border-b border-slate-100 last:border-b-0 py-1">
            <button 
              onClick={() => {
                setExpandedMobileItems(prev => ({
                  ...prev,
                  [item.name]: !prev[item.name] // Toggle buka/tutup khusus item ini saja
                }));
              }} 
              className={`w-full flex items-center justify-between py-2 text-sm font-semibold transition-colors ${
                isExpanded ? "text-blue-600" : "text-slate-700"
              }`}
            >
              {item.name}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180 text-blue-600" : "text-slate-400"}`} />
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
                   <div className={`flex flex-col pl-3 ml-1.5 border-l-2 border-slate-200 mt-1 mb-2`}>
                      {renderMobileSubItems(item.subItems, item.name, level + 1)}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      }

      return (
        <Link 
          key={item.name} 
          href={item.href!} 
          onClick={handleCloseMobileMenu}
          className={`flex flex-col py-2.5 group border-b border-slate-50 last:border-b-0`}
        >
          <span className={`text-[13px] font-medium transition-colors ${
            isSubActive ? "text-blue-600" : "text-slate-600 group-hover:text-blue-600"
          }`}>
            {item.name}
          </span>
          {item.desc && (
             <span className="text-[10px] text-slate-400 mt-0.5 leading-snug">
               {item.desc}
             </span>
          )}
        </Link>
      );
    });
  };

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm fixed top-0 w-full z-[9990] transition-all">
        <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[64px]">
          
          <Link href="/" className="flex items-center gap-2 sm:gap-3 z-50 group shrink-0">
            <Image 
              src="/logo-bmkg2.png" 
              alt="Logo BMKG" 
              width={44} 
              height={44} 
              priority 
              className="w-8 h-9 sm:w-10 sm:h-12 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col justify-center space-y-0.5">
              <span className="text-gray-700 font-bold text-[12px] sm:text-xs md:text-sm leading-tight">
                Stasiun Meteorologi Kelas II
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm text-gray-500 font-medium tracking-tight leading-tight">
                Aji Pangeran Tumenggung Pranoto, Samarinda
              </span>
            </div>
          </Link>

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
              
              // PERBAIKAN: Aktifkan 2 kolom jika item lebih dari 5 (termasuk menu Iklim & Cuaca)
              const isMultiColumn = menu.items.length > 5;

              return (
                <div 
                  key={menu.key} 
                  className="relative" 
                  onMouseEnter={() => setActiveDesktop(menu.key)} 
                  onMouseLeave={() => {
                      setActiveDesktop(null);
                      setActiveDesktopSub(null);
                      setActiveDesktopSubSub(null);
                  }}
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
                        className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-visible"
                        style={{ width: isMultiColumn ? '600px' : '300px' }}
                      >
                        <div className={`px-6 py-4 grid gap-x-8 ${isMultiColumn ? 'grid-cols-2' : 'grid-cols-1'}`}>
                          {menu.items.map((item) => renderDesktopSubItem(item))}
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

          <div className="flex items-center gap-3 z-50 shrink-0">
            <Link 
               href="/contact" 
               className="hidden md:flex items-center justify-center text-sm font-semibold px-5 py-2.5 rounded-lg bg-white text-slate-700 hover:bg-slate-200 transition-colors border border-slate-300 whitespace-nowrap"
            >
               Kontak Kami
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

      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-0 z-[9999] lg:hidden bg-white/95 backdrop-blur-xl flex flex-col h-[100dvh]"
          >
            <div className="flex justify-between items-center px-4 sm:px-6 h-[64px] border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                <Image src="/logo-bmkg2.png" alt="BMKG" width={26} height={28} className="w-7 h-7" />
                <span className="font-semibold text-slate-800 text-sm tracking-tight">Menu Navigasi</span>
              </div>
              <button 
                onClick={handleCloseMobileMenu} 
                className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 pb-28">
              <div className="flex flex-col">
                
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
                            <div className="flex flex-col pl-4 ml-1.5 border-l-[3px] border-slate-200 mb-3 mt-1">
                              {renderMobileSubItems(menu.items, menu.key)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                <Link 
                  href="/layanan" 
                  onClick={handleCloseMobileMenu} 
                  className={`py-3.5 text-[17px] font-semibold transition-colors ${
                    pathname.startsWith("/layanan") ? "text-blue-600" : "text-slate-700"
                  }`}
                >
                  Layanan
                </Link>

              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full px-6 pb-8 pt-4 bg-gradient-to-t from-white via-white/95 to-transparent">
              <Link 
                href="/contact" 
                onClick={handleCloseMobileMenu} 
                className="flex items-center justify-center w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-slate-900/10 active:scale-[0.98] transition-all"
              >
                Kontak Kami
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}