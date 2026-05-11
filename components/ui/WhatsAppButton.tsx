"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function WhatsAppButton() {
  // Ganti dengan nomor WhatsApp operasional admin
  // WAJIB gunakan format 62 (tanpa 0 di depan, tanpa tanda +)
  const phoneNumber = "6285350611416"; 
  
  // Pesan otomatis saat user membuka WA
  const defaultMessage = "Halo Admin BMKG Samarinda, saya ingin bertanya terkait layanan data meteorologi dan klimatologi.";
  
  // Encode URL agar spasi menjadi format yang dibaca browser (%20)
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <Link 
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full hover:bg-[#20bd5a] hover:-translate-y-1 transition-all duration-300 group"
      aria-label="Hubungi Admin WhatsApp"
    >
      <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
      
      {/* Tooltip yang muncul saat di-hover */}
      <span className="absolute right-16 bg-white text-slate-800 text-xs font-bold px-3 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-100">
        Hubungi Admin
      </span>
    </Link>
  );
}