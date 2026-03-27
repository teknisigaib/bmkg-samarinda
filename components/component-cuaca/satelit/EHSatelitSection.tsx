"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Satellite, ZoomIn } from "lucide-react";
import ImageLightbox from "@/components/ui/ImageLightbox"; // Import Lightbox kita

export default function EHSatelitSection() {
  const [imageError, setImageError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // State untuk menyimpan timestamp agar tidak terjadi Hydration Mismatch
  const [timestamp, setTimestamp] = useState<string>("");

  // Generate timestamp hanya di sisi klien setelah komponen di-mount
  useEffect(() => {
    setTimestamp(Date.now().toString());
  }, []);

  // URL gambar dari BMKG (Ditambah timestamp untuk bypass cache)
  // Jika timestamp kosong (saat SSR), jangan tambahkan parameter id
  const imageUrl = timestamp 
    ? `https://inderaja.bmkg.go.id/IMAGE/HIMA/H08_EH_Kaltim.png?id=${timestamp}`
    : `https://inderaja.bmkg.go.id/IMAGE/HIMA/H08_EH_Kaltim.png`;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col h-full">
        
        {/* HEADER KARTU (DIPINDAHKAN KE TENGAH) */}
        <div className="flex items-center justify-center border-b border-slate-100 pb-2 mb-2">
            <h2 className="font-semibold text-slate-800">
              Himawari-9 Enhanced IR
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
                    alt="Citra Satelit Himawari Kalimantan Timur"
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
        <div className="bg-blue-50 text-gray-700 rounded-xl p-4 mt-4 border border-blue-100">
            <p className="text-sm sm:text-base text-justify">
              Produk <strong>Himawari-9 EH</strong> menunjukkan suhu puncak awan yang didapat dari 
              pengamatan radiasi yang diklasifikasi dengan pewarnaan tertentu, dimana warna hitam atau biru 
              menunjukkan tidak terdapat pembentukan awan yang banyak (cerah), sedangkan 
              semakin dingin suhu puncak awan, dimana warna mendekati jingga hingga merah, 
              menunjukan pertumbuhan awan yang signifikan dan berpotensi terbentuknya awan Cumulonimbus.
            </p>
        </div>

      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {!imageError && (
          <ImageLightbox 
            isOpen={isLightboxOpen}
            imageUrl={imageUrl}
            title="Citra Satelit Himawari-9 (EH)"
            description="Pemantauan suhu puncak awan. Semakin merah, awan semakin tebal (berpotensi hujan)."
            altText="Satelit Himawari Kaltim"
            onClose={() => setIsLightboxOpen(false)}
          />
      )}
    </>
  );
}