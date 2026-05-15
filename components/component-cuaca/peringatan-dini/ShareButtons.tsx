"use client";

import { useState } from "react";
import { MessageCircle, Copy, Check } from "lucide-react";

export default function ShareButtons({ textToShare }: { textToShare: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin teks", err);
    }
  };

  const handleWhatsApp = () => {
    // Membuka link wa.me dengan teks yang sudah di-encode agar rapi (enter & spasi aman)
    const url = `https://wa.me/?text=${encodeURIComponent(textToShare)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-slate-100">
      <button
        onClick={handleWhatsApp}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
      >
        <MessageCircle className="w-4 h-4" />
        Bagikan ke WA
      </button>
      
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        {copied ? "Tersalin!" : "Salin Teks"}
      </button>
    </div>
  );
}