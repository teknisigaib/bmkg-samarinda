"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudSun,
  AlertTriangle,
  Plane,
  Ship,
  ChevronDown,
  Users,
  ClipboardList,
  FileText,
  Target,
  Activity,
  Map,
  DropletOff,
  CalendarDays,
  Calendar,
  Waves,
  Satellite,
  Flame,
  Newspaper,
  BookA,
  BookText,
} from "lucide-react";

export default function Navbar() {
  // State dropdown (desktop & mobile)
  const [profilOpen, setProfilOpen] = useState(false);
  const [cuacaOpen, setCuacaOpen] = useState(false);
  const [gempaOpen, setGempaOpen] = useState(false);
  const [iklimOpen, setIklimOpen] = useState(false);
  const [publikasiOpen, setPublikasiOpen] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProfilOpen, setMobileProfilOpen] = useState(false);
  const [mobileCuacaOpen, setMobileCuacaOpen] = useState(false);
  const [mobileGempaOpen, setMobileGempaOpen] = useState(false);
  const [mobileIklimOpen, setMobileIklimOpen] = useState(false);
  const [mobilePublikasiOpen, setMobilePublikasiOpen] = useState(false);

  // Menu data
  const profilMenu = [
    {
      name: "Visi & Misi",
      desc: "Tujuan dan arah pembangunan",
      href: "/profil/visi-misi",
      icon: <Target className="w-5 h-5 text-blue-500" />,
    },
    {
      name: "Tugas & Fungsi",
      desc: "Peran dan tanggung jawab utama",
      href: "/profil/tugas-fungsi",
      icon: <ClipboardList className="w-5 h-5 text-blue-500" />,
    },
    {
      name: "Daftar Pegawai",
      desc: "Struktur organisasi dan pegawai",
      href: "/profil/daftar-pegawai",
      icon: <Users className="w-5 h-5 text-blue-500" />,
    },
    {
      name: "Transparansi Kinerja",
      desc: "Pelaporan dan keterbukaan publik",
      href: "/profil/transparansi-kinerja",
      icon: <FileText className="w-5 h-5 text-blue-500" />,
    },
  ];

  const cuacaMenu = [
    {
      name: "Prakiraan Cuaca",
      desc: "Lihat prakiraan cuaca harian",
      href: "/cuaca/prakiraan",
      icon: <CloudSun className="w-5 h-5 text-blue-500" />,
    },
    {
      name: "Peringatan Dini",
      desc: "Informasi cuaca ekstrem",
      href: "/cuaca/peringatan-dini",
      icon: <AlertTriangle className="w-5 h-5 text-blue-500" />,
    },
    {
      name: "Cuaca Penerbangan",
      desc: "Info cuaca untuk penerbangan",
      href: "/cuaca/penerbangan",
      icon: <Plane className="w-5 h-5 text-blue-500" />,
    },
    {
      name: "Cuaca Maritim",
      desc: "Info cuaca untuk pelayaran",
      href: "/cuaca/maritim",
      icon: <Ship className="w-5 h-5 text-blue-500" />,
    },
    {
      name: "Satelit Cuaca",
      desc: "Visualisasi citra satelit cuaca",
      href: "/cuaca/satelit",
      icon: <Satellite className="w-5 h-5 text-blue-500" />,
    },
    {
      name: "Peringatan Karhutla",
      desc: "Kebakaran hutan dan lahan",
      href: "/cuaca/karhutla",
      icon: <Flame className="w-5 h-5 text-blue-500" />,
    }
  ];

  const gempaMenu = [
    {
      name: "Gempa Bumi Terbaru",
      desc: "Data gempa terkini",
      href: "/gempa/gempa-terbaru",
      icon: <Activity className="w-5 h-5 text-blue-500" />,
    },
    {
      name: "Gempa Bumi Dirasakan",
      desc: "Laporan gempa yang terasa",
      href: "/gempa/gempa-dirasakan",
      icon: <Map className="w-5 h-5 text-blue-500" />,
    },
  ];

  const iklimMenu = [
    {
      name: "Info Hari Tanpa Hujan",
      desc: "Pantauan hari tanpa hujan",
      href: "/iklim/hari-tanpa-hujan",
      icon: <DropletOff className="w-5 h-5 text-blue-500" />,
    },
    {
      name: "Analisis & Prakiraan Hujan Dasarian",
      desc: "Data hujan per 10 hari",
      href: "/iklim/hujan-dasarian",
      icon: <CalendarDays className="w-5 h-5 text-blue-500" />,
    },
    {
      name: "Analisis & Prakiraan Hujan Bulanan",
      desc: "Data hujan per bulan",
      href: "/iklim/hujan-bulanan",
      icon: <Calendar className="w-5 h-5 text-blue-500" />,
    },
    {
      name: "Potensi Banjir",
      desc: "Informasi potensi banjir",
      href: "/iklim/potensi-banjir",
      icon: <Waves className="w-5 h-5 text-blue-500" />,
    },
  ];

  const publikasiMenu = [
    {
      name: "Berita & Kegiatan",
      desc: "Berita terkini dan kegiatan BMKG",
      href: "/publikasi/berita-kegiatan",
      icon: <Newspaper className="w-5 h-5 text-blue-500" />,
    },
    {
      name: "Buletin",
      desc: "Publikasi buletin berkala",
      href: "/publikasi/buletin",
      icon: <BookA className="w-5 h-5 text-blue-500" />,
    },
    {
      name: "Artikel & Makalah",
      desc: "Artikel ilmiah",
      href: "/publikasi/artikel",
      icon: <BookText className="w-5 h-5 text-blue-500" />,
    },
  ];

  // Helper: close drawer
  const closeDrawer = () => {
    setMobileOpen(false);
    setMobileProfilOpen(false);
    setMobileCuacaOpen(false);
    setMobileGempaOpen(false);
    setMobileIklimOpen(false);
    setMobilePublikasiOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm fixed top-0 w-full z-9999">
      <div className="max-w-8xl mx-auto md:mx-10 px-4 flex items-center h-16 relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-bmkg.png"
            alt="Logo BMKG"
            width={40}
            height={40}
            priority
          />
          <div className="flex flex-col">
            <span className="text-gray-700 font-semibold text-xs md:text-sm">
              Badan Meteorologi, Klimatologi, dan Geofisika
            </span>
            <span className="text-xs md:text-sm text-gray-500 -mt-0.5">
              Stasiun Meteorologi APT Pranoto Samarinda
            </span>
          </div>
        </Link>

        {/* Menu Tengah (tanpa link Contact) */}
        <div className="hidden md:flex space-x-6 items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <DropdownMenu
            title="Profil"
            open={profilOpen}
            setOpen={setProfilOpen}
            items={profilMenu}
          />
          <DropdownMenu
            title="Cuaca"
            open={cuacaOpen}
            setOpen={setCuacaOpen}
            items={cuacaMenu}
          />
          <DropdownMenu
            title="Gempa"
            open={gempaOpen}
            setOpen={setGempaOpen}
            items={gempaMenu}
          />
          <DropdownMenu
            title="Iklim"
            open={iklimOpen}
            setOpen={setIklimOpen}
            items={iklimMenu}
          />
          <DropdownMenu
            title="Publikasi"
            open={publikasiOpen}
            setOpen={setPublikasiOpen}
            items={publikasiMenu}
          />
        </div>

        {/* Grup Kanan: Tombol Contact (desktop) & Tombol Hamburger (mobile) */}
        <div className="flex items-center gap-4 ml-auto">
          <Link
            href="/contact"
            className="hidden md:inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact
          </Link>
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden flex items-center text-gray-700"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        open={mobileOpen}
        closeDrawer={closeDrawer}
        profilMenu={profilMenu}
        cuacaMenu={cuacaMenu}
        gempaMenu={gempaMenu}
        iklimMenu={iklimMenu}
        publikasiMenu={publikasiMenu}
        mobileProfilOpen={mobileProfilOpen}
        setMobileProfilOpen={setMobileProfilOpen}
        mobileCuacaOpen={mobileCuacaOpen}
        setMobileCuacaOpen={setMobileCuacaOpen}
        mobileGempaOpen={mobileGempaOpen}
        setMobileGempaOpen={setMobileGempaOpen}
        mobileIklimOpen={mobileIklimOpen}
        setMobileIklimOpen={setMobileIklimOpen}
        mobilePublikasiOpen={mobilePublikasiOpen}
        setMobilePublikasiOpen={setMobilePublikasiOpen}
      />
    </nav>
  );
}

/* --------------------------
    Dropdown Menu (Desktop)
--------------------------- */
function DropdownMenu({ title, open, setOpen, items }: any) {
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1">
        {title}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
          >
            <div className="py-2">
              {items.map((item: any) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50 transition"
                >
                  <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* --------------------------
    Mobile Drawer
--------------------------- */
function MobileDrawer({
  open,
  closeDrawer,
  profilMenu,
  cuacaMenu,
  gempaMenu,
  iklimMenu,
  publikasiMenu,
  mobileProfilOpen,
  setMobileProfilOpen,
  mobileCuacaOpen,
  setMobileCuacaOpen,
  mobileGempaOpen,
  setMobileGempaOpen,
  mobileIklimOpen,
  setMobileIklimOpen,
  mobilePublikasiOpen,
  setMobilePublikasiOpen
}: any) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-4 overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-blue-700">Menu</span>
            <button
              onClick={closeDrawer}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Links */}
          <div className="space-y-2">
            <Link
              href="/"
              onClick={closeDrawer}
              className="block px-2 py-2 text-gray-700 rounded hover:bg-blue-50"
            >
              Home
            </Link>

            {/* Profil */}
            <MobileSubMenu
              title="Profil"
              items={profilMenu}
              open={mobileProfilOpen}
              setOpen={setMobileProfilOpen}
            />

            {/* Cuaca */}
            <MobileSubMenu
              title="Cuaca"
              items={cuacaMenu}
              open={mobileCuacaOpen}
              setOpen={setMobileCuacaOpen}
            />

            {/* Gempa */}
            <MobileSubMenu
              title="Gempa"
              items={gempaMenu}
              open={mobileGempaOpen}
              setOpen={setMobileGempaOpen}
            />

            {/* Iklim */}
            <MobileSubMenu
              title="Iklim"
              items={iklimMenu}
              open={mobileIklimOpen}
              setOpen={setMobileIklimOpen}
            />

            {/* Publikasi */}
            <MobileSubMenu
              title="Publikasi"
              items={publikasiMenu}
              open={mobilePublikasiOpen}
              setOpen={setMobilePublikasiOpen}
            />

            <Link
              href="/contact"
              onClick={closeDrawer}
              className="block px-2 py-2 text-gray-700 rounded hover:bg-blue-50"
            >
              Contact
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* --------------------------
    Mobile SubMenu
--------------------------- */
function MobileSubMenu({ title, items, open, setOpen }: any) {
  return (
    <div>
      <button
        onClick={() => setOpen((s: boolean) => !s)}
        className="w-full flex items-center justify-between px-2 py-2 text-gray-700 rounded hover:bg-blue-50"
        aria-expanded={open}
      >
        <span className="font-medium">{title}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-1 pl-4">
              {items.map((item: any) => (
                <motion.div key={item.href} whileTap={{ scale: 0.96 }}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 px-2 py-2 rounded hover:bg-blue-50 text-gray-700"
                  >
                    <div className="p-1 bg-gray-100 rounded">{item.icon}</div>
                    <div>
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}