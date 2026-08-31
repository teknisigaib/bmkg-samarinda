"use client";

import React, { useState } from "react";
import Image from "next/image";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { CloudRain, ThermometerSun } from "lucide-react";

// --- DATA CURAH HUJAN ---
const DATA_HUJAN = [
  {
    title: "Laju Perubahan Hari Basah Berturut-turut (CWD)",
    image: "/perubahan-iklim/hujan-cwd.png",
    desc: "Grafik laju perubahan jumlah hari basah berturut-turut (CWD) pada periode 1981–2025 menunjukkan fluktuasi tahunan yang cukup tinggi, dengan nilai indeks berkisar antara 6 hingga 15 hari. Secara umum, terdapat tren peningkatan yang relatif lemah, ditunjukkan dengan nilai laju perubahan sebesar 0.017. Hal ini mengindikasikan kecenderungan durasi hari basah berturut-turut yang sedikit memanjang. Nilai tertinggi terjadi pada kisaran tahun 2007, sedangkan nilai terendah muncul pada beberapa periode seperti awal 1990-an dan sekitar tahun 2003. Meskipun demikian, pola tahunan yang sangat berfluktuasi ini menunjukkan bahwa peningkatan CWD belum berlangsung secara konsisten setiap tahunnya."
  },
  {
    title: "Laju Perubahan Hari Kering Berturut-turut (CDD)",
    image: "/perubahan-iklim/hujan-cdd.png",
    desc: "Berdasarkan grafik jumlah hari kering berturut-turut (CDD) periode 1981–2025, terlihat adanya tren penurunan durasi hari kering di Stasiun Meteorologi Aji Pangeran Tumenggung Pranoto. Tren ini ditunjukkan oleh garis putus-putus merah yang miring ke bawah, dengan laju perubahan yang kini tercatat sebesar -0.584. Walaupun sempat mengalami lonjakan ekstrem pada akhir 1990-an dan awal 2000-an (mencapai nilai indeks >60), frekuensi dan durasi periode kering secara keseluruhan cenderung berkurang dan menjadi lebih stabil pada level yang lebih rendah setelah tahun 2015."
  },
  {
    title: "Laju Perubahan Total Curah Hujan Tahunan",
    image: "/perubahan-iklim/hujan-prcptot.png",
    desc: "Grafik ini menunjukan tren peningkatan laju perubahan total curah hujan tahunan dari periode 1981 hingga 2025 di Stasiun Meteorologi Aji Pangeran Tumenggung Pranoto. Tren jangka panjang (garis merah) terus menanjak dengan laju perubahan positif yang cukup signifikan, yakni sebesar 28.42. Meskipun terdapat fluktuasi antartahun, puncak akumulasi curah hujan tertinggi tercatat pada kisaran tahun 2013, yang menembus nilai 4500 mm."
  },
  {
    title: "Laju Perubahan Intensitas Curah Hujan Ekstrem Harian",
    image: "/perubahan-iklim/hujan-rx1d.png",
    desc: "Grafik ini menunjukkan tren peningkatan intensitas curah hujan ekstrem harian (RX1-day maksimum) dengan laju perubahan sebesar 4.09. Terlihat adanya peningkatan variabilitas yang sangat tajam setelah tahun 2010. Pada periode tersebut, terjadi beberapa puncak ekstrem yang menembus nilai 300 mm hingga 350 mm (seperti pada kisaran 2013, 2016, dan 2020), yang berbanding terbalik dengan kondisi pada periode 1981–2010 di mana curah hujan ekstrem harian relatif lebih stabil di bawah 200 mm."
  },
  {
    title: "Laju Perubahan Rata-rata Intensitas Curah Hujan",
    image: "/perubahan-iklim/hujan-sdii.png",
    desc: "Grafik menunjukkan tren peningkatan positif yang relatif stabil pada rata-rata intensitas curah hujan per hari hujan di Stasiun Meteorologi Aji Pangeran Tumenggung Pranoto periode 1981–2025. Tren ini ditandai oleh garis merah yang naik dengan laju perubahan 0.09. Nilai indeks sebagian besar berfluktuasi pada kisaran 12 hingga 16 mm/hari pada periode 1981–2012, sebelum mengalami lonjakan signifikan di atas 20 mm/hari pada rentang tahun 2013–2017. Setelah itu, nilainya kembali melandai mendekati angka 12 mm/hari di akhir periode pengamatan (2025)."
  },
  {
    title: "Laju Perubahan Total Curah Hujan Ekstrem Tahunan",
    image: "/perubahan-iklim/hujan-r95p.png",
    desc: "Grafik ini menunjukkan tren peningkatan jangka panjang pada total curah hujan ekstrem tahunan (persentil ke-95) di Stasiun Meteorologi Aji Pangeran Tumenggung Pranoto periode 1981–2025, dengan laju perubahan positif sebesar 17.85. Nilai indeks secara umum berfluktuasi cukup stabil di bawah 1000 mm sejak tahun 1981 hingga 2012. Namun, terjadi lonjakan ekstrem yang menembus puncak 2500 mm pada tahun 2013, sebelum akhirnya kembali melandai dan berfluktuasi di kisaran 300–1000 mm hingga akhir periode pengamatan."
  }
];

// --- DATA SUHU UDARA ---
const DATA_SUHU = [
  {
    title: "Nilai Suhu Udara Rata-rata",
    image: "/perubahan-iklim/suhu-tmm.png",
    desc: "Grafik ini menampilkan tren kenaikan suhu udara rata-rata harian secara umum dengan laju perubahan sebesar 0.017. Fluktuasi suhu berkisar dominan antara 26°C hingga 27.5°C, di mana terjadi lonjakan suhu ekstrem pada tahun 1998 hingga menyentuh angka 28°C, diikuti tren hangat yang relatif stabil pada periode 2002–2015 sebelum kembali berfluktuasi tajam hingga 2025."
  },
  {
    title: "Nilai Maksimum Harian Suhu Udara Rata-rata",
    image: "/perubahan-iklim/suhu-tmx.png",
    desc: "Grafik ini menunjukkan tren peningkatan pada nilai maksimum harian dari suhu udara rata-rata setahun dengan laju perubahan positif (0.015). Sebagian besar nilai berada pada rentang 28°C hingga 30°C, dengan titik terendah terjadi di awal periode (1981) sekitar 26.5°C dan puncak tertinggi dicapai pada tahun 1998 yang menembus di atas 31°C."
  },
  {
    title: "Nilai Minimum Harian Suhu Udara Rata-rata",
    image: "/perubahan-iklim/suhu-tmn.png",
    desc: "Grafik ini memperlihatkan tren peningkatan yang lebih perlahan pada batas suhu minimum harian dengan laju perubahan 0.010. Nilai suhu minimum dominan berfluktuasi pada kisaran 23°C hingga 25.2°C, meski sempat diawali dengan nilai tertinggi mendekati 26.5°C pada tahun 1981 serta mengalami penurunan terendah hingga menyentuh kisaran 22.4°C di sekitar tahun 2023."
  }
];

// --- KOMPONEN TOMBOL TAB ---
function TabButton({ isActive, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
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

export default function GrafikLajuIklimPage() {
  const [activeTab, setActiveTab] = useState<"hujan" | "suhu">("hujan");

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 pt-4">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
          items={[
            { label: "...", href: "/" },
            { label: "Iklim" },
            { label: "..." },
            { label: "..." },
            { label: "Grafik Laju" }
          ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mx-auto pb-4">
           <h1 className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Grafik Laju Perubahan Iklim
           </h1>
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl">
              Analisis tren jangka panjang berdasarkan parameter curah hujan dan suhu udara dari stasiun observasi BMKG.
           </p>
        </section>

        {/* --- TAB NAVIGATION --- */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200 max-w-2xl mx-auto">
          <TabButton 
             isActive={activeTab === "hujan"} 
             onClick={() => setActiveTab("hujan")}
             icon={<CloudRain className="w-4 h-4" />}
             label="Perubahan Curah Hujan"
          />
          <TabButton 
             isActive={activeTab === "suhu"} 
             onClick={() => setActiveTab("suhu")}
             icon={<ThermometerSun className="w-4 h-4" />}
             label="Perubahan Suhu Udara"
          />
        </div>

        {/* --- CONTENT AREA (GRID 2 KOLOM) --- */}
        <div className="pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {activeTab === "hujan" && DATA_HUJAN.map((item, index) => (
              <article key={index} className="flex flex-col">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">
                  {item.title}
                </h3>
                
                <div className="mb-6 bg-white rounded-xl border border-slate-200 p-2 overflow-hidden flex justify-center shadow-sm">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    width={800} height={400} 
                    className="w-full h-auto object-contain mix-blend-multiply"
                  />
                </div>
                
                <p className="text-slate-700 text-base leading-relaxed text-justify">
                  {item.desc}
                </p>
              </article>
            ))}

            {activeTab === "suhu" && DATA_SUHU.map((item, index) => (
              <article key={index} className="flex flex-col">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">
                  {item.title}
                </h3>
                
                <div className="mb-6 bg-white rounded-xl border border-slate-200 p-2 overflow-hidden flex justify-center shadow-sm">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    width={800} height={400} 
                    className="w-full h-auto object-contain mix-blend-multiply"
                  />
                </div>
                
                <p className="text-slate-700 text-base leading-relaxed text-justify">
                  {item.desc}
                </p>
              </article>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}