"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Info, Satellite, ZoomIn } from "lucide-react";
import ImageLightbox from "@/components/ui/ImageLightbox"; // Import Lightbox kita

export default function RPSatelitSection() {
  const [imageError, setImageError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // State untuk menyimpan timestamp agar tidak terjadi Hydration Mismatch
  const [timestamp, setTimestamp] = useState<string>("");

  // Generate timestamp hanya di sisi klien setelah komponen di-mount
  useEffect(() => {
    setTimestamp(Date.now().toString());
  }, []);

  // URL gambar dari BMKG (Ditambah timestamp untuk bypass cache)
  const imageUrl = timestamp 
    ? `https://inderaja.bmkg.go.id/IMAGE/HIMA/H08_RP_Kaltim.png?id=${timestamp}`
    : `https://inderaja.bmkg.go.id/IMAGE/HIMA/H08_RP_Kaltim.png`;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col h-full">
        
        {/* HEADER KARTU (DIPINDAHKAN KE TENGAH) */}
        <div className="flex items-center justify-center border-b border-slate-100 pb-2 mb-2">
            <h2 className="font-semibold text-slate-800">
              Himawari-9 Rainfall Potential
            </h2>
        </div>

        {/* AREA GAMBAR (Thumbnail) */}
        <div 
            className="relative w-full aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-200 group cursor-pointer"
            onClick={() => !imageError && setIsLightboxOpen(true)}
        >
          {!imageError ? (
            <>
                <Image
                    src={imageUrl}
                    alt="Citra Satelit Himawari RP Kalimantan Timur"
                    fill
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                    onError={() => setImageError(true)}
                />
                
                {/* Overlay Hover "Perbesar" */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="bg-white/95 backdrop-blur-sm text-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm translate-y-2 group-hover:translate-y-0">
                        <ZoomIn className="w-3.5 h-3.5 text-blue-600" /> Klik Untuk Perbesar
                    </div>
                </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <Satellite className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs font-bold uppercase tracking-widest">Koneksi Satelit Terputus</p>
            </div>
          )}
        </div>

        {/* AREA DESKRIPSI */}
        <div className="mt-5 bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium text-justify">
              Produk <strong>Himawari-9 Potential Rainfall</strong> adalah produk yang digunakan 
              untuk mengestimasi potensi curah hujan, yang disajikan berdasarkan kategori 
              ringan, sedang, lebat, hingga sangat lebat, dengan menggunakan hubungan antara 
              suhu puncak awan dengan curah hujan yang berpotensi dihasilkan.
            </p>
        </div>

      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {!imageError && (
          <ImageLightbox 
            isOpen={isLightboxOpen}
            imageUrl={imageUrl}
            title="Citra Satelit Himawari-9 (Rainfall Potential)"
            description="Estimasi potensi curah hujan berdasarkan kategori (Ringan hingga Sangat Lebat)."
            altText="Satelit Himawari RP Kaltim"
            onClose={() => setIsLightboxOpen(false)}
          />
      )}
    </>
  );
}