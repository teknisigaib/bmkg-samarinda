import Image from "next/image";
import { CheckCircle2, Smartphone, Download } from "lucide-react";

export default function AppPromo() {
  return (
   
    <section className="relative py-12 md:py-16 mb-12 bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden rounded-2xl">
      
      <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#ffffff" fillOpacity="0.2" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 lg:gap-16">
          
          {/* KOLOM KIRI: TEKS & TOMBOL  */}
          <div className="md:w-1/2 text-white space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-blue-100 border border-white/20">
              <Smartphone className="w-4 h-4" />
              Aplikasi Mobile Resmi
            </div>
            
            {/* Judul */}
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Info BMKG dalam Genggaman.
              <span className="block text-blue-200">Cepat, Akurat, Realtime.</span>
            </h2>
            
            {/* Deskripsi */}
            <p className="text-blue-100 text-base md:text-lg leading-relaxed max-w-xl">
              Dapatkan notifikasi dini cuaca ekstrem, gempa bumi, dan prakiraan iklim langsung di smartphone Anda di mana saja, kapan saja.
            </p>
            
            {/* List Fitur */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {["Notifikasi Peringatan Dini", "Info Gempa < 5 Menit", "Cuaca per Kecamatan", "Citra Satelit & Radar"].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-blue-100 font-medium text-sm">
                        <CheckCircle2 className="w-5 h-5 text-green-300 flex-shrink-0" /> {item}
                    </li>
                ))}
            </ul>

            {/* Tombol Download*/}
            <div className="flex flex-wrap gap-4">
              <AppButton 
                href="https://play.google.com/store/apps/details?id=com.bmkg.infobmkg"
                storeName="Google Play"
                icon={<GooglePlayIcon />}
              />
              <AppButton 
                href="https://apps.apple.com/id/app/infobmkg/id1114372539"
                storeName="App Store"
                icon={<AppStoreIcon />}
              />
            </div>
          </div>

          {/*  KOLOM KANAN */}
          <div className="md:w-1/2 flex justify-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
            
            <div className="relative w-[240px] h-[480px] bg-slate-900 rounded-[2.5rem] border-[6px] border-slate-800 shadow-2xl overflow-hidden z-10 transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500 group">
               {/* Notch */}
               <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 flex justify-center z-20">
                   <div className="w-24 h-4 bg-slate-800 rounded-b-xl"></div>
               </div>

            
               <div className="relative w-full h-full bg-white">
                    <Image 
                        src="https://placehold.co/240x480/1e3a8a/ffffff?text=Info+BMKG+App+Screen" 
                        alt="Info BMKG App Screenshot" 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-8 left-0 w-full text-center text-white p-4">
                        <Image src="/logo-bmkg.png" alt="Logo" width={40} height={40} className="mx-auto mb-2 drop-shadow-md" />
                        <h3 className="font-bold text-lg drop-shadow-md">Info BMKG</h3>
                        <p className="text-xs text-blue-100">Cuaca, Iklim, & Gempa Bumi</p>
                    </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// --- KOMPONEN PENDUKUNG UNTUK TOMBOL ---

function AppButton({ href, storeName, icon }: { href: string; storeName: string; icon: React.ReactNode }) {
  return (
    <a 
        href={href} 
        target="_blank" 
        // Style Tombol yang Lebih Cerah & Menonjol
        className="bg-white text-blue-900 hover:bg-blue-50 p-2 rounded-xl flex items-center gap-3 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 pr-5 group"
    >
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div className="text-left leading-tight">
            <div className="text-[10px] uppercase tracking-wider opacity-80">Download on</div>
            <div className="font-bold text-sm">{storeName}</div>
        </div>
    </a>
  );
}

// Ikon SVG yang Sama
const GooglePlayIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.14L6.05,2.66Z" /></svg>);
const AppStoreIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.37 12.36,4.26 13,3.5Z" /></svg>);