"use client";

import React, { useState } from "react";
import Image from "next/image";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { ThermometerSun, ThermometerSnowflake, Thermometer, FileText, Download } from "lucide-react";

// --- DATA PROYEKSI SUHU UDARA (Struktur identik dengan Proyeksi Hujan) ---
const PROYEKSI_DATA = {
  tmm: {
    title: "TMm (Suhu Udara Rata-Rata Tahunan)",
    definition: "TMm (Mean Temperature) merupakan rata-rata suhu udara harian dalam suatu periode (tahunan). Indikator ini digunakan untuk mengukur tren pemanasan suhu secara umum dan menyeluruh di suatu wilayah.",
    nf: {
      subtitle: "SSP 585 Near Future (2021–2050)",
      image: "/perubahan-iklim/tmm-nf.png",
      desc: "Berdasarkan skenario SSP585, proyeksi perubahan suhu udara rata-rata tahunan pada periode Near Future (2021–2050) terhadap Baseline (1981–2010) menunjukkan tren kenaikan yang merata di seluruh wilayah Kalimantan Timur. Seluruh kabupaten/kota diproyeksikan mengalami peningkatan suhu udara rata-rata pada kategori sebesar <1.6°C."
    },
    ff: {
      subtitle: "SSP 585 Far Future (2071–2100)",
      image: "/perubahan-iklim/tmm-ff.png",
      desc: "Berdasarkan skenario emisi tinggi SSP585, proyeksi menunjukkan pemanasan ekstrem di seluruh Kalimantan Timur pada periode Far Future (2071-2100). Wilayah bagian barat yang meliputi (Mahakam Ulu, Kutai Barat, Kutai Kartanegara, Paser, serta bagian barat Berau dan Kutai Timur) diproyeksikan mengalami kenaikan suhu mencapai 3.4 – 3.7 °C, sementara wilayah pesisir timur hingga selatan berada pada kategori kenaikan 3.1 – 3.4 °C."
    }
  },
  tmn: {
    title: "TMn (Suhu Udara Minimum Tahunan)",
    definition: "TMn (Minimum Temperature Mean) merepresentasikan rata-rata suhu udara terendah harian (suhu minimum) pada malam atau dini hari dalam periode tahunan. Perubahan pada TMn sangat penting untuk melihat tingkat hilangnya pendinginan alami di malam hari.",
    nf: {
      subtitle: "SSP 585 Near Future (2021–2050)",
      image: "/perubahan-iklim/tmn-nf.png",
      desc: "Berdasarkan skenario emisi tinggi SSP585, proyeksi peningkatan suhu udara minimum tahunan pada periode 2021–2050 juga menunjukkan distribusi perubahan yang selaras. Wilayah pedalaman bagian barat hingga tengah diproyeksikan mengalami peningkatan suhu minimum sebesar 1.9 – 2.2 °C, sementara area sepanjang pesisir timur Kalimantan Timur berada pada kategori kenaikan sebesar 1.6 – 1.9 °C."
    },
    ff: {
      subtitle: "SSP 585 Far Future (2071–2100)",
      image: "/perubahan-iklim/tmn-ff.png",
      desc: "Berdasarkan skenario emisi tinggi SSP585, proyeksi menunjukkan pemanasan ekstrem pada suhu udara minimum di seluruh Kalimantan Timur pada periode 2071–2100. Sebagian besar wilayah Kalimantan Timur diproyeksikan mengalami kenaikan suhu minimum mencapai 3.4 – 3.7 °C (ditandai dengan dominasi warna merah tua), sedangkan wilayah sepanjang garis pantai pesisir timur berada pada kategori kenaikan 3.1 – 3.4 °C."
    }
  },
  tmx: {
    title: "TMx (Suhu Udara Maksimum Tahunan)",
    definition: "TMx (Maximum Temperature Mean) adalah rata-rata suhu udara tertinggi harian (suhu maksimum) pada siang hari dalam periode tahunan. Indikator ini menyoroti tingkat keparahan suhu panas ekstrem dan potensi gelombang panas di masa depan.",
    nf: {
      subtitle: "SSP 585 Near Future (2021–2050)",
      image: "/perubahan-iklim/tmx-nf.png",
      desc: "Berdasarkan skenario SSP585, proyeksi perubahan suhu udara Maksimum tahunan pada periode Near Future (2021–2050) terhadap Baseline (1981–2010) menunjukkan tren kenaikan yang merata di seluruh wilayah Kalimantan Timur. Seluruh kabupaten/kota diproyeksikan mengalami peningkatan suhu udara rata-rata pada kategori sebesar <1.6°C."
    },
    ff: {
      subtitle: "SSP 585 Far Future (2071–2100)",
      image: "/perubahan-iklim/tmx-ff.png",
      desc: "Berdasarkan skenario emisi tinggi SSP585, proyeksi menunjukkan pemanasan ekstrem pada suhu udara maksimum di seluruh Kalimantan Timur pada Far Future (2071–2100). Wilayah bagian barat (Mahakam Ulu, Kutai Barat, Kutai Kartanegara, Paser, serta bagian barat Kutai Timur dan Berau) diproyeksikan mengalami lonjakan suhu maksimum sebesar 3.4 – 3.7 °C (kategori merah tua), sementara area sepanjang jalur pesisir timur diproyeksikan mengalami peningkatan sebesar 3.1 – 3.4 °C."
    }
  }
};

type TabKey = keyof typeof PROYEKSI_DATA;

// --- KOMPONEN TOMBOL TAB (Identik dengan Proyeksi Hujan) ---
function TabButton({ isActive, onClick, icon, label }: { isActive: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
        isActive 
        ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
        : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
      }`}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

export default function ProyeksiSuhuUdaraPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("tmm");

  const currentData = PROYEKSI_DATA[activeTab];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 pt-4">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
          items={[
            { label: "...", href: "/" },
            { label: "Iklim" },
            { label: "..." },
            { label: "..." },
            { label: "Proyeksi Suhu Udara" }
          ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mx-auto pb-4">
           <h1 className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Proyeksi Suhu Udara
           </h1>
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl">
              Peta proyeksi perubahan parameter suhu udara berdasarkan skenario SSP585 untuk periode Near Future (2021-2050) dan Far Future (2071-2100).
           </p>
        </section>

        {/* --- TAB NAVIGATION --- */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200 w-full max-w-3xl mx-auto">
          <TabButton 
             isActive={activeTab === "tmm"} 
             onClick={() => setActiveTab("tmm")}
             icon={<Thermometer className="w-4 h-4" />}
             label="TMm"
          />
          <TabButton 
             isActive={activeTab === "tmn"} 
             onClick={() => setActiveTab("tmn")}
             icon={<ThermometerSnowflake className="w-4 h-4" />}
             label="TMn"
          />
          <TabButton 
             isActive={activeTab === "tmx"} 
             onClick={() => setActiveTab("tmx")}
             icon={<ThermometerSun className="w-4 h-4" />}
             label="TMx"
          />
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Definisi Parameter */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="flex items-start gap-3 bg-blue-100/70 p-4 rounded-xl border border-blue-200">
              <Thermometer className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
              <p className="text-slate-600 text-sm italic leading-relaxed text-justify">
                {currentData.definition}
              </p>
            </div>
          </div>

          {/* Grid 2 Kolom (Kiri: Near Future, Kanan: Far Future) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
            
            {/* Kolom Near Future */}
            <article className="flex flex-col">
              <h3 className="text-lg font-bold text-slate-700 mb-4 text-center bg-slate-100 py-2 rounded-lg border border-slate-200">
                {currentData.nf.subtitle}
              </h3>
              
              <div className="mb-6 bg-white rounded-xl border border-slate-200 p-2 overflow-hidden flex justify-center shadow-sm">
                <Image 
                  src={currentData.nf.image} 
                  alt={`${currentData.title} Near Future`} 
                  width={600} height={400} 
                  className="w-full h-auto object-contain mix-blend-multiply"
                />
              </div>
              
              <p className="text-slate-700 text-base leading-relaxed text-justify">
                {currentData.nf.desc}
              </p>
            </article>

            {/* Kolom Far Future */}
            <article className="flex flex-col">
              <h3 className="text-lg font-bold text-slate-700 mb-4 text-center bg-slate-100 py-2 rounded-lg border border-slate-200">
                {currentData.ff.subtitle}
              </h3>
              
              <div className="mb-6 bg-white rounded-xl border border-slate-200 p-2 overflow-hidden flex justify-center shadow-sm">
                <Image 
                  src={currentData.ff.image} 
                  alt={`${currentData.title} Far Future`} 
                  width={600} height={400} 
                  className="w-full h-auto object-contain mix-blend-multiply"
                />
              </div>
              
              <p className="text-slate-700 text-base leading-relaxed text-justify">
                {currentData.ff.desc}
              </p>
            </article>

          </div>
        </div>

        {/* --- DOWNLOAD SECTION CTA --- */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex justify-center">
           <a 
              href="/perubahan-iklim/dokumen/detail-proyeksi-suhu.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-fit px-5 py-3 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 rounded-xl shadow-sm transition-all duration-200 group relative z-20"
           >
              <div className="bg-red-50 p-2 rounded-lg">
                 <FileText className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex flex-col text-left mr-2">
                 <span className="text-sm font-bold group-hover:text-blue-700 transition-colors">Dokumen Detail Analisis Proyeksi</span>
                 <span className="text-[11px] text-slate-500 font-medium">Format PDF • 2.0 MB</span>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
           </a>
        </div>

      </div>
    </div>
  );
}