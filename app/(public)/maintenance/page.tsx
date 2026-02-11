import Link from "next/link";
import { Wrench, ArrowLeft, Clock, ShieldAlert } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center">
        
        {/* Ikon Animasi */}
        <div className="relative mb-8 inline-block">
          <div className="absolute inset-0 bg-amber-100 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-white p-6 rounded-full shadow-lg border-4 border-amber-50">
            <Wrench className="w-16 h-16 text-amber-500" />
          </div>
          {/* Badge Kecil */}
          <div className="absolute -bottom-2 -right-2 bg-slate-800 text-white p-2 rounded-full border-4 border-slate-50 shadow-sm">
             <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* Judul & Deskripsi */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          Halaman Sedang Dalam Pemeliharaan
        </h1>
        
        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
          Mohon maaf, saat ini kami sedang melakukan pemeliharaan dan perbaikan halaman website. Silahkan kunjungi halaman lain atau hubungi admin BMKG APT Pranoto Samarinda.
        </p>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-medium shadow-lg shadow-slate-200"
          >
            <ArrowLeft size={18} />
            Halaman Utama
          </Link>
          
          <a
            href="https://wa.me/6281249425470"
            target="_blank"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-medium"
          >
            Hubungi Admin
          </a>
        </div>

        <div className="mt-12 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} BMKG Stasiun Meteorologi APT Pranoto.
        </div>

      </div>
    </div>
  );
}