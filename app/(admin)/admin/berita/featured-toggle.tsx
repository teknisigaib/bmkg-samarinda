"use client";

import { Star } from "lucide-react";
import { setFeatured } from "@/app/(admin)/admin/actions"; // Import action tadi
import { useState } from "react";

interface FeaturedToggleProps {
  id: string;
  isFeatured: boolean;
}

export default function FeaturedToggle({ id, isFeatured }: FeaturedToggleProps) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (isFeatured) return; // Jika sudah featured, tidak perlu klik lagi (atau bisa dibuat toggle off)
    
    // Konfirmasi agar tidak sengaja terpencet
    if (!confirm("Jadikan ini sebagai Berita Utama? Berita utama sebelumnya akan diganti.")) return;

    setLoading(true);
    await setFeatured(id);
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading || isFeatured}
      className={`p-2 rounded-full transition-all duration-200 ${
        isFeatured 
          ? "text-yellow-500 bg-yellow-50 cursor-default" 
          : "text-gray-400 hover:text-yellow-500 hover:bg-gray-100"
      }`}
      title={isFeatured ? "Sedang Tayang sebagai Berita Utama" : "Jadikan Berita Utama"}
    >
      <Star 
        className={`w-5 h-5 ${loading ? "animate-pulse" : ""}`} 
        fill={isFeatured ? "currentColor" : "none"} // Isi warna jika featured
      />
    </button>
  );
}