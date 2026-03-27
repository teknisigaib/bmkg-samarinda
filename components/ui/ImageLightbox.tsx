"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ImageLightboxProps {
  isOpen: boolean;
  imageUrl: string | null;
  title?: string;
  description?: string;
  altText?: string;
  onClose: () => void;
}

export default function ImageLightbox({
  isOpen,
  imageUrl,
  title,
  description,
  altText = "Fullscreen Image",
  onClose,
}: ImageLightboxProps) {
  
  // Efek samping: Mengunci scroll latar belakang dan menangani tombol "Escape"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden"; // Kunci scroll
      window.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup saat komponen ditutup
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Jika tidak terbuka atau tidak ada gambar, jangan render apa-apa
  if (!isOpen || !imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-lg flex flex-col items-center justify-center animate-in fade-in duration-200" 
      onClick={onClose} // Tutup jika area gelap diklik
    >
      {/* Header Info & Tombol Tutup */}
      <div className="absolute top-0 w-full p-4 md:p-6 flex justify-between items-start z-50 pointer-events-none">
        
        {/* Teks Kiri */}
        <div className="pointer-events-auto max-w-[70%] md:max-w-md">
          {title && <h3 className="text-white font-bold text-base md:text-lg mb-0.5">{title}</h3>}
          {description && <p className="text-blue-200 text-[10px] md:text-xs leading-relaxed opacity-80">{description}</p>}
        </div>

        {/* Tombol X Kanan */}
        <button 
          onClick={onClose}
          className="p-2 md:p-3 bg-white/10 hover:bg-blue-600/50 rounded-full text-white transition-colors pointer-events-auto group shadow-sm shrink-0"
          aria-label="Tutup gambar"
        >
          <X className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>

      </div>
      
      {/* Area Gambar */}
      <div 
        // REVISI: Tambahkan pt-20 (padding top) agar di mobile gambar tidak tertimpa tombol close
        className="w-full h-full flex items-center justify-center p-4 pt-20 md:p-12 overflow-auto" 
        onClick={(e) => e.stopPropagation()} // Mencegah klik pada gambar menutup modal
      >
        <img 
          src={imageUrl} 
          alt={altText} 
          // REVISI: Hapus max-w-none. Gunakan max-w-full & max-h-full di SEMUA ukuran layar.
          className="max-w-full max-h-full object-contain shadow-2xl bg-white rounded-md m-auto" 
        />
      </div>
    </div>
  );
}