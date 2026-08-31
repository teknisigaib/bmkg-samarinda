"use client";

import React, { useState } from "react";
import Image from "next/image";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Droplets, CloudRain, CloudLightning, Calendar, Sun, Activity, Info, FileText, Download } from "lucide-react";

// --- DATA PROYEKSI CURAH HUJAN ---
const PROYEKSI_DATA = {
  prcptot: {
    title: "PRCPTOT (Curah Hujan Akumulatif Total Tahunan)",
    definition: "PRCPTOT adalah Total curah hujan tahunan yang dihitung hanya pada hari-hari basah (hari dengan curah hujan ≥1 mm).",
    nf: {
      subtitle: "SSP 585 Near Future (2021–2050)",
      image: "/perubahan-iklim/prcptot-nf.png",
      desc: "Berdasarkan peta proyeksi skenario SSP585, analisis perubahan curah hujan kumulatif total tahunan untuk periode Near Future (2021–2050) terhadap periode Baseline (1981–2010) menunjukkan tren peningkatan yang seragam, berada dalam kategori perubahan sebesar 0 – 5% di seluruh wilayah Provinsi Kalimantan Timur."
    },
    ff: {
      subtitle: "SSP 585 Far Future (2071–2100)",
      image: "/perubahan-iklim/prcptot-ff.png",
      desc: "Berdasarkan skenario SSP585, proyeksi perubahan curah hujan kumulatif total tahunan pada periode Far Future (2071–2100) terhadap Baseline (1981–2010) menunjukkan variasi peningkatan yang lebih signifikan. Wilayah Kabupaten Mahakam Ulu diproyeksikan mengalami kenaikan curah hujan dalam kategori 10 – 15%, sementara wilayah Kutai Barat, sebagian Kutai Kartanegara, dan sebagian Kutai Timur berada pada kategori 5 – 10%. Adapun wilayah lainnya di sisi timur dan selatan, mulai dari Berau, Samarinda, hingga Paser, diproyeksikan berada dalam kategori perubahan sebesar 0 – 5%."
    }
  },
  r95p: {
    title: "R95P (Curah Hujan Ekstrem Tahunan)",
    definition: "R95P adalah Total curah hujan tahunan yang berasal dari hari-hari sangat basah, yaitu hari-hari ketika curah hujan harian melebihi ambang batas persentil ke-95 dari basis data historis harian.",
    nf: {
      subtitle: "SSP 585 Near Future (2021–2050)",
      image: "/perubahan-iklim/r95p-nf.png",
      desc: "Berdasarkan skenario SSP585, proyeksi perubahan curah hujan ekstrem tahunan pada periode Near Future (2021–2050) terhadap Baseline (1981–2010) menunjukkan adanya variasi peningkatan di wilayah Kalimantan Timur. Wilayah bagian barat dan utara yang mencakup Kabupaten Mahakam Ulu, Kutai Barat, sebagian Kutai Kartanegara, dan sebagian Berau diproyeksikan mengalami kenaikan curah hujan ekstrem dalam kategori 5 – 10%. Sementara itu, wilayah lainnya seperti Kutai Timur, Samarinda, Balikpapan, Penajam Paser Utara, hingga Paser berada dalam kategori perubahan sebesar 0 – 5%."
    },
    ff: {
      subtitle: "SSP 585 Far Future (2071–2100)",
      image: "/perubahan-iklim/r95p-ff.png",
      desc: "Berdasarkan skenario SSP585, proyeksi perubahan curah hujan ekstrem tahunan pada periode Far Future (2071–2100) terhadap Baseline (1981–2010) menunjukkan variasi peningkatan yang sangat signifikan di wilayah Kalimantan Timur. Wilayah Kabupaten Mahakam Ulu dan sebagian Kutai Barat diproyeksikan mengalami kenaikan curah hujan ekstrem dalam kategori > 20%. Wilayah lainnya yang mencakup sebagian besar Kutai Barat, sebagian Kutai Kartanegara, dan sebagian Berau berada pada kategori 15 – 20%. Sementara itu, wilayah Penajam Paser Utara, sebagian besar Berau, sebagian Kutai Kartanegara, sebagian Kutai Timur, dan sebagian Paser berada dalam kategori 10 – 15%."
    }
  },
  rx1day: {
    title: "RX1Day (Hujan Paling Deras dalam 24 Jam)",
    definition: "RX1Day adalah Jumlah curah hujan maksimum harian tertinggi yang terjadi dalam satu hari penuh selama periode tertentu (bulanan atau tahunan).",
    nf: {
      subtitle: "SSP 585 Near Future (2021–2050)",
      image: "/perubahan-iklim/rx1day-nf.png",
      desc: "Berdasarkan skenario SSP585, proyeksi perubahan jumlah curah hujan paling deras dalam 24 Jam pada periode Near Future (2021–2050) terhadap Baseline (1981–2010) menunjukkan adanya variasi peningkatan yang signifikan di wilayah Kalimantan Timur. Sebagian besar wilayah Kaltim didominasi mengalami kenaikan dalam kategori 5 – 20%. Namun, wilayah yang meliputi sebagian kecil Mahakam Ulu, Kutai Timur, dan Kutai Kartanegara mencapai kategori perubahan >20%."
    },
    ff: {
      subtitle: "SSP 585 Far Future (2071–2100)",
      image: "/perubahan-iklim/rx1day-ff.png",
      desc: "Berdasarkan peta proyeksi skenario SSP585, analisis perubahan jumlah curah hujan paling deras dalam 24 Jam untuk periode Far Future (2071–2100) terhadap periode Baseline (1981–2010) menunjukkan tren peningkatan yang seragam, secara konsisten berada dalam kategori perubahan sebesar > 20% di seluruh wilayah Provinsi Kalimantan Timur."
    }
  },
  cwd: {
    title: "CWD (Consecutive Wet Days)",
    definition: "CWD adalah Jumlah hari basah berturut-turut maksimum dalam suatu periode di mana curah hujan harian selalu ≥1 mm.",
    nf: {
      subtitle: "SSP 585 Near Future (2021–2050)",
      image: "/perubahan-iklim/cwd-nf.png",
      desc: "Berdasarkan skenario SSP585, proyeksi perubahan runtutan hari hujan tahunan pada periode Near Future (2021–2050) terhadap Baseline (1981–2010) menunjukkan adanya perubahan positif dan negatif yang cukup merata di wilayah Kalimantan Timur. Pada bagian utara Sebagian besar didominasi dengan perubahan dengan kategori 0 – 5%. Sementara itu, pada bagian selatan diproyeksikan mengalami kenaikan dalam kategori (-5) – 0%."
    },
    ff: {
      subtitle: "SSP 585 Far Future (2071–2100)",
      image: "/perubahan-iklim/cwd-ff.png",
      desc: "Berdasarkan peta proyeksi skenario SSP585, analisis perubahan runtutan hari hujan tahunan untuk periode Far Future (2071–2100) terhadap periode Baseline (1981–2010) menunjukkan tren perubahan yang bervariasi dari (-5) – 5%, Namun, Sebagian kecil wilayah Mahakam Ulu bagian Selatan dan Kutai Timur bagian timur mengalami perubahan sebesar 5 – 10%."
    }
  },
  cdd: {
    title: "CDD (Consecutive Dry Days)",
    definition: "CDD adalah Jumlah hari kering berturut-turut maksimum dalam suatu periode di mana curah hujan harian selalu <1 mm.",
    nf: {
      subtitle: "SSP 585 Near Future (2021–2050)",
      image: "/perubahan-iklim/cdd-nf.png",
      desc: "Berdasarkan skenario SSP585, proyeksi perubahan hari tanpa hujan tahunan pada periode Near Future (2021–2050) terhadap Baseline (1981–2010) menunjukkan adanya perubahan positif yang sangat signifikan merata sebesar >20% di seluruh wilayah Kalimantan Timur. Mengindikasikan Seluruh Wilayah Kalimantan Timur diproyeksikan akan mengalami runtutan hari tanpa hujan yang jauh lebih panjang kedepannya."
    },
    ff: {
      subtitle: "SSP 585 Far Future (2071–2100)",
      image: "/perubahan-iklim/cdd-ff.png",
      desc: "Berdasarkan skenario SSP585, proyeksi perubahan hari tanpa hujan tahunan pada periode Far Future (2071–2100) terhadap Baseline (1981–2010) menunjukkan adanya perubahan positif yang sangat signifikan merata sebesar >20% di seluruh wilayah Kalimantan Timur. Mengindikasikan Seluruh Wilayah Kalimantan Timur diproyeksikan akan mengalami runtutan hari tanpa hujan yang jauh lebih panjang kedepannya."
    }
  },
  sdii: {
    title: "SDII (Rata-Rata Intensitas Hujan Harian)",
    definition: "SDII adalah Indeks intensitas curah hujan harian sederhana. Dihitung dengan membagi total curah hujan tahunan pada hari basah dengan jumlah hari basah dalam tahun tersebut.",
    nf: {
      subtitle: "SSP 585 Near Future (2021–2050)",
      image: "/perubahan-iklim/sdii-nf.png",
      desc: "Berdasarkan peta proyeksi skenario SSP585, analisis perubahan indeks Rata-Rata Intensitas Hujan Harian untuk periode Near Future (2021–2050) terhadap periode Baseline (1981–2010) menunjukkan tren peningkatan yang seragam, secara konsisten berada dalam kategori perubahan sebesar 0 – 5% di seluruh wilayah Provinsi Kalimantan Timur. Namun terdapat sangat kecil bagian Mahakam ulu bagian barat yang mengalami perubahan 5 – 10%."
    },
    ff: {
      subtitle: "SSP 585 Far Future (2071–2100)",
      image: "/perubahan-iklim/sdii-ff.png",
      desc: "Berdasarkan skenario SSP585, proyeksi perubahan indeks Rata-Rata Intensitas Hujan Harian pada periode Far Future (2071–2100) terhadap Baseline (1981–2010) menunjukkan adanya variasi peningkatan di wilayah Kalimantan Timur. Wilayah bagian barat dan tengah yang mencakup Kabupaten Mahakam Ulu, Kutai Barat, dan Kabupaten Kutai Kartanegara diproyeksikan mengalami kenaikan intensitas curah hujan dalam kategori 5 – 10%, sedangkan wilayah bagian timur dan selatan seperti Berau, Kutai Timur, Samarinda, hingga Paser berada dalam kategori perubahan sebesar 0 – 5%."
    }
  }
};

type TabKey = keyof typeof PROYEKSI_DATA;

// --- KOMPONEN TOMBOL TAB ---
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

export default function ProyeksiCurahHujanPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("prcptot");

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
            { label: "Proyeksi Curah Hujan" }
          ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mx-auto pb-4">
           <h1 className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Proyeksi Curah Hujan
           </h1>
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl">
              Peta proyeksi perubahan parameter curah hujan berdasarkan skenario SSP585 untuk periode Near Future (2021-2050) dan Far Future (2071-2100).
           </p>
        </section>

        {/* --- TAB NAVIGATION --- */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200 w-full mx-auto">
          <TabButton 
             isActive={activeTab === "prcptot"} 
             onClick={() => setActiveTab("prcptot")}
             icon={<Droplets className="w-4 h-4" />}
             label="PRCPTOT"
          />
          <TabButton 
             isActive={activeTab === "r95p"} 
             onClick={() => setActiveTab("r95p")}
             icon={<CloudLightning className="w-4 h-4" />}
             label="R95P"
          />
          <TabButton 
             isActive={activeTab === "rx1day"} 
             onClick={() => setActiveTab("rx1day")}
             icon={<CloudRain className="w-4 h-4" />}
             label="RX1Day"
          />
          <TabButton 
             isActive={activeTab === "cwd"} 
             onClick={() => setActiveTab("cwd")}
             icon={<Calendar className="w-4 h-4" />}
             label="CWD"
          />
          <TabButton 
             isActive={activeTab === "cdd"} 
             onClick={() => setActiveTab("cdd")}
             icon={<Sun className="w-4 h-4" />}
             label="CDD"
          />
          <TabButton 
             isActive={activeTab === "sdii"} 
             onClick={() => setActiveTab("sdii")}
             icon={<Activity className="w-4 h-4" />}
             label="SDII"
          />
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Definisi Parameter */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="flex items-start gap-2 bg-blue-100/40 p-4 rounded-xl border border-blue-200">
              <Info className="w-5 h-5 text-slate-500 shrink-0" />
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

        {/* --- DOWNLOAD SECTION --- */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex justify-center">
           <a 
              href="/perubahan-iklim/dokumen/detail-proyeksi-hujan.pdf" 
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