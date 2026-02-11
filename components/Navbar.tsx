"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudSun, AlertTriangle, Plane, Ship, ChevronDown, Users, ClipboardList,
  FileText, Target, Activity, Map, DropletOff,
  Satellite, Flame, Newspaper, BookA, BookText, Menu, X, OctagonAlert, CloudRain, BarChart3, Leaf, Waves, Radio
} from "lucide-react";

type NavItem = {
  key: string;
  label: string;
  items: {
    name: string;
    desc: string;
    href: string;
    icon: React.ReactNode;
  }[];
};

const NAV_ITEMS: NavItem[] = [
  {
    key: "profil",
    label: "Profil",
    items: [
      { name: "Visi & Misi", desc: "Tujuan dan arah pembangunan", href: "/profil/visi-misi", icon: <Target className="w-5 h-5 text-blue-500" /> },
      { name: "Tugas & Fungsi", desc: "Peran dan tanggung jawab utama", href: "/profil/tugas-fungsi", icon: <ClipboardList className="w-5 h-5 text-blue-500" /> },
      { name: "Daftar Pegawai", desc: "Struktur organisasi dan pegawai", href: "/profil/daftar-pegawai", icon: <Users className="w-5 h-5 text-blue-500" /> },
      { name: "Transparansi Kinerja", desc: "Pelaporan dan keterbukaan publik", href: "/profil/transparansi-kinerja", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    ]
  },
  {
    key: "cuaca",
    label: "Cuaca",
    items: [
      { name: "Prakiraan Cuaca", desc: "Lihat prakiraan cuaca harian", href: "/cuaca/prakiraan", icon: <CloudSun className="w-5 h-5 text-blue-500" /> },
      { name: "Peringatan Dini", desc: "Informasi cuaca ekstrem", href: "/cuaca/peringatan-dini", icon: <AlertTriangle className="w-5 h-5 text-blue-500" /> },
      { name: "Cuaca Penerbangan", desc: "Info cuaca untuk penerbangan", href: "/cuaca/penerbangan", icon: <Plane className="w-5 h-5 text-blue-500" /> },
      { name: "Cuaca Maritim", desc: "Info cuaca untuk pelayaran", href: "/cuaca/maritim", icon: <Ship className="w-5 h-5 text-blue-500" /> },
      { name: "Cuaca Mahakam", desc: "Prakiraan cuaca sungai Mahakam", href: "/cuaca/mahakam", icon: <Waves className="w-5 h-5 text-blue-500" /> },
      { name: "Satelit Cuaca", desc: "Visualisasi citra satelit cuaca", href: "/cuaca/satelit", icon: <Satellite className="w-5 h-5 text-blue-500" /> },
      { name: "Peringatan Karhutla", desc: "Kebakaran hutan dan lahan", href: "/cuaca/karhutla", icon: <Flame className="w-5 h-5 text-blue-500" /> },
      { name: "Cuaca RealTime", desc: "Data Realtime Automatic Weather Station", href: "/cuaca/aws", icon: <Radio className="w-5 h-5 text-blue-500" /> },
    ]
  },
  {
    key: "gempa",
    label: "Gempa",
    items: [
      { name: "Gempa Bumi Terbaru", desc: "Data gempa terkini", href: "/gempa/gempa-terbaru", icon: <Activity className="w-5 h-5 text-blue-500" /> },
      { name: "Gempa Bumi Dirasakan", desc: "Laporan gempa yang terasa", href: "/gempa/gempa-dirasakan", icon: <Map className="w-5 h-5 text-blue-500" /> },
    ]
  },
  {
    key: "iklim",
    label: "Iklim",
    items: [
      { name: "Info Hari Tanpa Hujan", desc: "Pantauan hari tanpa hujan", href: "/iklim/hari-tanpa-hujan", icon: <DropletOff className="w-5 h-5 text-blue-500" /> },
      { name: "Prakiraan Hujan", desc: "Prakiraan Hujan", href: "/iklim/prakiraan-hujan", icon: <CloudRain className="w-5 h-5 text-blue-500" /> },
      { name: "Analisis Hujan", desc: "Analisis Hujan", href: "/iklim/analisis-hujan", icon: <BarChart3 className="w-5 h-5 text-blue-500" /> },
      { name: "PDIE", desc: "Peringatan Dini Iklim Ekstrem", href: "/iklim/peringatan-dini", icon: <OctagonAlert className="w-5 h-5 text-blue-500" /> },
      { name: "Kualitas Udara", desc: "Pantauan Konsentrasi PM25", href: "/iklim/kualitas-udara", icon: <Leaf className="w-5 h-5 text-blue-500" /> },
    ]
  },
  {
    key: "publikasi",
    label: "Publikasi",
    items: [
      { name: "Berita & Kegiatan", desc: "Berita terkini BMKG", href: "/publikasi/berita-kegiatan", icon: <Newspaper className="w-5 h-5 text-blue-500" /> },
      { name: "Buletin", desc: "Publikasi buletin berkala", href: "/publikasi/buletin", icon: <BookA className="w-5 h-5 text-blue-500" /> },
      { name: "Artikel dan Makalah", desc: "Artikel ilmiah", href: "/publikasi/artikel", icon: <BookText className="w-5 h-5 text-blue-500" /> },
    ]
  }
];

export default function Navbar() {
  // State Desktop
  const [activeDesktop, setActiveDesktop] = useState<string | null>(null);

  // State Mobile
  const [mobileOpen, setMobileOpen] = useState(false);
  // State Mobile Submenu:
  const [activeMobileSub, setActiveMobileSub] = useState<string | null>(null);

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm fixed top-0 w-full z-[9999]">
        <div className="max-w-8xl mx-auto md:mx-10 px-4 flex items-center h-16 relative">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-50">
            <Image 
              src="/logo-bmkg.png" 
              alt="Logo BMKG" 
              width={40} 
              height={40} 
              priority 
              className="w-9 h-8 md:w-12 md:h-10"
              sizes="(max-width: 768px) 36px, 48px"
            />
            <div className="flex flex-col">
              <span className="text-gray-800 font-bold text-xs md:text-sm leading-tight">Badan Meteorologi Klimatologi & Geofisika</span>
              <span className="text-[10px] md:text-sm text-gray-500 font-medium -mt-0.5">Stasiun Meteorologi APT Pranoto Samarinda</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-1 items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <Link href="/" className="px-4 py-2 text-md font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">Home</Link>
             {NAV_ITEMS.map((menu) => (
                <div key={menu.key} className="relative" onMouseEnter={() => setActiveDesktop(menu.key)} onMouseLeave={() => setActiveDesktop(null)}>
                   <button 
                     className={`px-4 py-2 text-md font-medium flex items-center gap-1 rounded-full transition-colors ${activeDesktop === menu.key ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"}`}
                     aria-expanded={activeDesktop === menu.key}
                   >
                      {menu.label} <ChevronDown className={`w-3 h-3 transition-transform ${activeDesktop === menu.key ? 'rotate-180' : ''}`} />
                   </button>
                   <AnimatePresence>
                     {activeDesktop === menu.key && (
                        <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-black/5">
                           <div className="py-2">
                             {menu.items.map((item) => (
                               <Link key={item.href} href={item.href} onClick={() => setActiveDesktop(null)} className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50 transition group">
                                 <div className="p-2 bg-blue-50 rounded-lg shrink-0 text-blue-600 group-hover:bg-white group-hover:shadow-sm transition">{item.icon}</div>
                                 <div><p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 tracking-wide">{item.name}</p><p className="text-xs text-gray-500 leading-snug">{item.desc}</p></div>
                               </Link>
                             ))}
                           </div>
                        </motion.div>
                     )}
                   </AnimatePresence>
                </div>
             ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 ml-auto">
            <Link href="/contact" className="hidden md:inline-flex items-center justify-center bg-white text-slate-600 text-sm font-semibold px-5 py-2 rounded-xl hover:bg-blue-700 transition-all border-slate-600 border-1 hover:text-white">Kontak Kami</Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition" aria-label="Toggle Menu" aria-expanded={mobileOpen}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[10000] lg:hidden"
            />
            {/* Drawer Content */}
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-2xl backdrop-blur-md z-[10001] p-6 overflow-y-auto lg:hidden border-l border-gray-100"
            >
              {/* Header Drawer */}
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-xl text-gray-800">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full" aria-label="Close Menu"><X className="w-5 h-5" /></button>
              </div>

              {/* Isi Menu Mobile */}
              <div className="space-y-1">
                <Link href="/" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 rounded-xl transition">Home</Link>
                {NAV_ITEMS.map((menu) => (
                  <div key={menu.key} className="overflow-hidden">
                    <button 
                      onClick={() => setActiveMobileSub(activeMobileSub === menu.key ? null : menu.key)} 
                      className="w-full flex items-center justify-between px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 rounded-xl transition"
                      aria-expanded={activeMobileSub === menu.key}
                    >
                      {menu.label} <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeMobileSub === menu.key ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {activeMobileSub === menu.key && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="bg-gray-50/50 rounded-xl mt-1 mb-2 px-3 py-2 space-y-1">
                            {menu.items.map((item) => (
                              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition">
                                <span className="p-1 bg-white rounded shadow-sm text-blue-500">{item.icon}</span>
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                <Link href="/contact" onClick={() => setMobileOpen(false)} className="block mt-4 px-4 py-3 text-center bg-white text-slate-600 font-semibold border-1 border-slate-600 rounded-xl hover:bg-blue-700 hover:text-white transition ">Kontak Kami</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}