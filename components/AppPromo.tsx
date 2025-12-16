import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export default function AppPromo() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white overflow-hidden rounded-xl relative">
      {/* Dekorasi Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* Kolom Kiri: Teks */}
          <div className="md:w-1/2 space-y-6">
            <span className="inline-block bg-white/10 text-blue-200 px-4 py-1.5 rounded-full text-sm font-medium border border-white/20">
              Aplikasi Mobile Resmi
            </span>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Info BMKG dalam Genggaman Anda
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              Dapatkan informasi cuaca, iklim, dan gempabumi terkini langsung dari smartphone Anda. Notifikasi realtime dan akurat.
            </p>
            
            <ul className="space-y-3 mb-8">
                {["Peringatan Dini Cuaca", "Info Gempa Realtime", "Prakiraan Cuaca Kecamatan", "Peta Citra Satelit"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-green-400" /> {item}
                    </li>
                ))}
            </ul>

            <div className="flex flex-wrap gap-4">
                {/* Tombol Playstore (Mockup Style) */}
                <a href="https://play.google.com/store/apps/details?id=com.bmkg.infobmkg" target="_blank" className="bg-white/10 hover:bg-white/20 border border-white/20 p-2 rounded-xl flex items-center gap-3 transition pr-6">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        {/* Ikon Playstore sederhana */}
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-black"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.14L6.05,2.66Z" /></svg>
                    </div>
                    <div className="text-left">
                        <div className="text-[10px] uppercase tracking-wider opacity-70">Get it on</div>
                        <div className="font-bold text-sm">Google Play</div>
                    </div>
                </a>

                {/* Tombol AppStore */}
                <a href="https://apps.apple.com/id/app/infobmkg/id1114372539" target="_blank" className="bg-white/10 hover:bg-white/20 border border-white/20 p-2 rounded-xl flex items-center gap-3 transition pr-6">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-black"><path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.37 12.36,4.26 13,3.5Z" /></svg>
                    </div>
                    <div className="text-left">
                        <div className="text-[10px] uppercase tracking-wider opacity-70">Download on the</div>
                        <div className="font-bold text-sm">App Store</div>
                    </div>
                </a>
            </div>
          </div>

          {/* Kolom Kanan: Mockup HP (Ilustrasi CSS Sederhana jika tidak ada gambar) */}
          <div className="md:w-1/2 flex justify-center relative">
             {/* Lingkaran Glow di belakang HP */}
             <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-20 rounded-full"></div>
             
             {/* HP Mockup */}
             <div className="relative w-64 h-[500px] bg-black rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden z-10">
                {/* Screen Content */}
                <div className="w-full h-full bg-slate-800 relative">
                    <div className="absolute top-0 w-full h-6 bg-black flex justify-center items-center rounded-b-xl z-20">
                        <div className="w-20 h-4 bg-gray-800 rounded-full"></div>
                    </div>
                    {/* Placeholder Screenshot Aplikasi */}
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-2 p-6 text-center">
                        <Image src="/logo-bmkg.png" alt="Logo" width={60} height={60} className="opacity-50" />
                        <span className="font-bold text-xl text-white">Info BMKG</span>
                        <p className="text-xs">Tampilan Aplikasi Mobile</p>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}