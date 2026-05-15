import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionDivider from "@/components/ui/SectionDivider"; 
import { Activity, MapPin, Clock, Layers, AlertTriangle, Calendar, Radio } from "lucide-react";
import { Metadata } from "next";

// IMPORT DARI FILE CLIENT
import { ClickableMainMap, ShakemapButton } from "@/components/component-gempa/ClientGempaInteractions";

// 🔥 HUBUNGKAN KE LIB YANG SUDAH DIPERBAIKI
import { getGempaTerbaru, getGempaDirasakanList } from "@/lib/bmkg/gempa";

export const metadata: Metadata = {
  title: "Gempa Bumi Terbaru & Dirasakan | BMKG APT Pranoto Samarinda",
  description: "Informasi gempa bumi terbaru dan daftar gempa bumi yang dirasakan di wilayah Indonesia.",
};

export default async function GempaTerbaruPage() {
  // 🔥 AMBIL DATA DARI LIB SUPER STABIL
  const [gempaTerbaru, listGempaDirasakan] = await Promise.all([
    getGempaTerbaru(),
    getGempaDirasakanList()
  ]);

  return (
    <div className="min-h-screen pb-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMB */}
        <Breadcrumb 
          className="mb-8" 
          items={[
            { label: "Beranda", href: "/" }, 
            { label: "Gempa", href: "/gempa" }, 
            { label: "Gempa Bumi Terbaru" }
          ]} 
        />

        {/* HEADER UTAMA */}
        <section className="mb-12 max-w-3xl mx-auto text-center flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-slate-900">
            Gempa Bumi Terbaru
          </h1>
          <p className="text-sm md:text-base text-slate-500 leading-relaxed font-medium">
            Parameter gempa bumi terkini (M &ge; 5.0) di wilayah Indonesia. Data diperbarui otomatis dari BMKG.
          </p>
        </section>

        {/* --- SECTION 1: GEMPA TERBARU --- */}
        {gempaTerbaru ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-16">
            
            {/* KOLOM KIRI: SHAKEMAP PETA UTAMA */}
            <div className="lg:col-span-4 flex flex-col">
              <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-sm h-full flex flex-col">
                {/* Menggunakan ShakemapUrl yang sudah disiapkan oleh Lib */}
                <ClickableMainMap shakemapUrl={gempaTerbaru.ShakemapUrl || ""} />
              </div>
            </div>

            {/* KOLOM KANAN: KARTU PARAMETER GEMPA */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col h-full">
                
                {/* 1. SECTION HIGHLIGHT */}
                <div className="flex flex-col md:flex-row md:items-center gap-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                      <span className="text-xl font-black text-rose-600">{gempaTerbaru.Magnitude}</span>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1">Magnitudo</p>
                      <h2 className="text-2xl font-extrabold text-slate-900 leading-none">M {gempaTerbaru.Magnitude}</h2>
                    </div>
                  </div>
                  <div className="hidden md:block w-px h-12 bg-slate-100"></div>
                  <div className="flex items-center gap-4 flex-1 md:pl-4">
                    <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      <Clock size={22} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1">Waktu Kejadian</p>
                      <p className="text-lg font-bold text-slate-900 leading-tight">{gempaTerbaru.Tanggal}</p>
                      <p className="text-sm font-medium text-slate-500">{gempaTerbaru.Jam}</p>
                    </div>
                  </div>
                </div>

                {/* 2. SECTION LOKASI & KEDALAMAN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-slate-100">
                  <div className="flex gap-4">
                    <div className="mt-0.5 shrink-0 text-slate-400"><MapPin size={20} /></div>
                    <div>
                      <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1.5">Titik Koordinat</p>
                      <p className="text-base font-bold text-slate-900 mb-0.5">{gempaTerbaru.Lintang}, {gempaTerbaru.Bujur}</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{gempaTerbaru.Wilayah}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-0.5 shrink-0 text-slate-400"><Layers size={20} /></div>
                    <div>
                      <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1.5">Kedalaman</p>
                      <p className="text-base font-bold text-slate-900">{gempaTerbaru.Kedalaman}</p>
                    </div>
                  </div>
                </div>

                {/* 3. SECTION POTENSI & DIRASAKAN */}
                <div className="flex flex-col gap-6 pt-6">
                  <div className="flex gap-4">
                    <div className="mt-0.5 shrink-0 text-rose-400"><AlertTriangle size={20} /></div>
                    <div>
                      <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1.5">Potensi Tsunami</p>
                      <p className="text-base font-bold text-slate-900">{gempaTerbaru.Potensi}</p>
                    </div>
                  </div>
                  {gempaTerbaru.Dirasakan && gempaTerbaru.Dirasakan !== "-" && (
                    <div className="flex gap-4">
                      <div className="mt-0.5 shrink-0 text-blue-400"><Activity size={20} /></div>
                      <div>
                        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1.5">Wilayah Dirasakan (Skala MMI)</p>
                        <p className="text-sm md:text-base text-slate-700 leading-relaxed">{gempaTerbaru.Dirasakan}</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
            
          </div>
        ) : (
          <div className="mb-16 bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
             <p className="text-slate-500 font-semibold italic">Data gempa bumi terbaru sedang tidak tersedia.</p>
          </div>
        )}

        {/* --- SECTION 2: DAFTAR GEMPA DIRASAKAN --- */}
        {listGempaDirasakan.length > 0 && (
          <section className="max-w-5xl mx-auto">
            <SectionDivider title="Daftar Gempa Dirasakan" className="mb-6" />

            <div className="flex flex-col gap-5">
              {listGempaDirasakan.map((gempa, index) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden hover:shadow-md transition-shadow">
                  
                  {/* KOLOM KIRI: MAGNITUDO */}
                  <div className="w-full md:w-40 flex md:flex-col items-center justify-around md:justify-center p-4 md:py-8 border-b md:border-b-0 md:border-r border-slate-100 shrink-0">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Magnitudo</p>
                      <p className="text-3xl font-black text-orange-600 leading-none">{gempa.Magnitude}</p>
                    </div>
                    <div className="w-px h-10 md:w-8 md:h-px bg-slate-100 my-0 md:my-5"></div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Kedalaman</p>
                      <p className="text-base font-bold text-slate-800 leading-none">{gempa.Kedalaman}</p>
                    </div>
                  </div>

                  {/* KOLOM KANAN: DETAIL */}
                  <div className="flex-1 p-5 md:p-6 lg:px-8 flex flex-col justify-center gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5"><Calendar size={16} className="text-slate-400" /><span>{gempa.Tanggal}</span></div>
                        <div className="flex items-center gap-1.5"><Clock size={16} className="text-slate-400" /><span>{gempa.Jam}</span></div>
                      </div>
                      {/* 🔥 SEKARANG INI AMAN! Karena ShakemapUrl sudah dirakit di Lib */}
                      <ShakemapButton shakemapUrl={gempa.ShakemapUrl || ""} wilayah={gempa.Wilayah} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug">{gempa.Wilayah}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin size={16} className="text-blue-500" /><span>{gempa.Lintang}, {gempa.Bujur}</span>
                    </div>

                    {gempa.Dirasakan && gempa.Dirasakan !== "-" && (
                      <div className="mt-2 bg-slate-50/80 border border-slate-100 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">
                          <Radio size={14} /><span>Dirasakan (MMI)</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">{gempa.Dirasakan}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}