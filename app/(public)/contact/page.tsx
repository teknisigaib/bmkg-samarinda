import type { Metadata } from "next";
import { MapPin, Mail, Clock, Facebook, Instagram, Twitter, Youtube, Globe, Plane, Phone, Building2, Headset, FileText } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Kontak Kami | BMKG Samarinda",
  description: "Informasi kontak, lokasi, dan media sosial Stasiun Meteorologi APT Pranoto Samarinda.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="w-full mx-auto pt-0 space-y-8">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
            items={[
              { label: "Beranda", href: "/" },
              { label: "Kontak Kami" } 
            ]} 
        />

        {/* --- HEADERS --- */}
        <section className="relative flex flex-col items-center justify-center text-center mb-8 mx-auto pt-0">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
           </div>
           
           <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Kontak Kami
           </h1>
           
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl mb-2">
              Pusat bantuan, layanan informasi data cuaca, serta lokasi operasional Stasiun Meteorologi Kelas III APT Pranoto Samarinda.
           </p>
        </section>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* --- BAGIAN 1: MEGA CARD (PUSAT LAYANAN & SOSMED) --- */}
          {/* --- BAGIAN 1: MEGA CARD (PUSAT LAYANAN & SOSMED) --- */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-14 overflow-hidden flex flex-col">
             

             {/* Baris 1: Informasi Esensial (3 Kolom) */}
             <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                 
                 {/* Segmen 1: Jam Operasional */}
                 <div className="flex flex-col p-8 md:p-10">
                     {/* Ikon Diseragamkan ke Biru */}
                     <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100 mb-5">
                         <Clock className="w-6 h-6" />
                     </div>
                     <h3 className="text-lg font-bold text-slate-800 mb-4">Waktu Operasional</h3>
                     <div className="space-y-4 text-sm font-medium text-slate-600">
                         <div>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pelayanan & Administrasi</p>
                             <p className="text-slate-800">Senin - Kamis (07.30 - 16.00 WITA)</p>
                             <p className="text-slate-800">Jumat (07.30 - 16.30 WITA)</p>
                         </div>
                         <div>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Observasi & Cuaca Penerbangan</p>
                             <p className="flex items-center gap-2 text-slate-800">
                                 {/* Tanda pulse diubah jadi biru */}
                                 <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> 24 Jam (Setiap Hari)
                             </p>
                         </div>
                     </div>
                 </div>

                 {/* Segmen 2: Saluran Komunikasi */}
                 <div className="flex flex-col p-8 md:p-10">
                     {/* Ikon Diseragamkan ke Biru */}
                     <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100 mb-5">
                         <Phone className="w-6 h-6" />
                     </div>
                     <h3 className="text-lg font-bold text-slate-800 mb-4">Kontak</h3>
                     <div className="space-y-4 text-sm font-medium">
                         <div className="flex flex-col gap-1">
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Resmi</span>
                             <a href="mailto:stamet.samarinda@bmkg.go.id" className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition">
                                 <Mail className="w-4 h-4 text-slate-400 shrink-0" /> <span className="truncate">stamet.samarinda@bmkg.go.id</span>
                             </a>
                         </div>
                         <div className="flex flex-col gap-1">
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pelayanan & Konsultasi Cuaca</span>
                             <a href="tel:85350611416" className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition">
                                 <Phone className="w-4 h-4 text-slate-400 shrink-0" /> <span>(+62) 8535-0611-416</span>
                             </a>
                         </div>
                         <div className="flex flex-col gap-1">
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Telepon Administrasi</span>
                             <span className="flex items-center gap-2 text-slate-700">
                                 <Building2 className="w-4 h-4 text-slate-400 shrink-0" /> <span>(0541) 741160</span>
                             </span>
                         </div>
                     </div>
                 </div>

                 {/* Segmen 3: Layanan Data & Pengaduan */}
                 <div className="flex flex-col p-8 md:p-10">
                     {/* Ikon Diseragamkan ke Biru */}
                     <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100 mb-5">
                         <FileText className="w-6 h-6" />
                     </div>
                     <h3 className="text-lg font-bold text-slate-800 mb-3">Permintaan Data Publik</h3>
                     <p className="text-sm text-slate-600 leading-relaxed font-medium mb-4">
                         Untuk keperluan riset, asuransi, maupun proyek, seluruh permohonan data dan informasi iklim dilayani secara satu pintu.
                     </p>
                     <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 mt-auto">
                         <p className="text-xs font-bold text-slate-500 mb-1.5">Akses Layanan Terpadu:</p>
                         <a href="https://stamet-samarinda.bmkg.go.id/layanan" target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1.5 transition-colors">
                             Portal Layanan Data <Globe className="w-3.5 h-3.5" />
                         </a>
                     </div>
                 </div>

             </div>

             {/* Baris 2: Social Media */}
             <div className="bg-slate-50 px-8 py-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0">
                <div className="text-center md:text-left">
                    <h3 className="text-sm font-bold text-slate-800 mb-1">Media Sosial</h3>
                    <p className="text-xs font-medium text-slate-500">Ikuti kami untuk update cuaca dan peringatan dini terkini.</p>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-end gap-3">
                    {/* Warna Dasar Slate (Abu-abu), Warna Brand saat di-Hover */}
                    <SocialButton href="https://www.facebook.com/bmkg.kotasamarinda/" icon={<Facebook className="w-4 h-4" />} label="Facebook" color="text-slate-600 hover:bg-[#1877F2] hover:text-white border-slate-200 hover:border-[#1877F2]" />
                    <SocialButton href="https://www.instagram.com/stamet.samarinda.bmkg" icon={<Instagram className="w-4 h-4" />} label="Instagram" color="text-slate-600 hover:bg-[#E4405F] hover:text-white border-slate-200 hover:border-[#E4405F]" />
                    <SocialButton href="https://x.com/BMKG_Samarinda" icon={<Twitter className="w-4 h-4" />} label="X" color="text-slate-600 hover:bg-[#1DA1F2] hover:text-white border-slate-200 hover:border-[#1DA1F2]" />
                    <SocialButton href="https://www.youtube.com/@ceceproby" icon={<Youtube className="w-4 h-4" />} label="YouTube" color="text-slate-600 hover:bg-[#FF0000] hover:text-white border-slate-200 hover:border-[#FF0000]" />
                </div>
             </div>
          </div>

          {/* --- BAGIAN 2: LOKASI KANTOR (PETA + ALAMAT MENYATU) --- */}
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center mt-10">Lokasi Kantor Kami</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              
              {/* CARD LOKASI 1: ADMINISTRASI */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-300 transition-all">
                  <div className="w-full h-[280px] bg-slate-100 relative overflow-hidden border-b border-slate-100">
                      <iframe 
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d969.0246872220944!2d117.15666815393446!3d-0.4820979236670655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df67f415f49114b%3A0x467b4b65732a47b4!2sAdministrasi%20BMKG%20Samarinda!5e0!3m2!1sen!2sid!4v1779084128087!5m2!1sen!2sid"
                          width="100%"
                          height="100%" 
                          style={{ border: 0 }} 
                          allowFullScreen 
                          loading="lazy"
                          className="filter grayscale-[50%] group-hover:grayscale-0 transition duration-700 ease-in-out"
                          title="Peta Kantor Administrasi"
                      ></iframe>
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2 pointer-events-none">
                          <Building2 className="w-4 h-4 text-slate-600" />
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Administrasi</span>
                      </div>
                  </div>
                  <div className="p-6 md:p-8">
                      <h3 className="text-xl font-bold text-slate-800 mb-4">Kantor Administrasi</h3>
                      <div className="flex items-start gap-3">
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 shrink-0 mt-0.5">
                              <MapPin className="w-5 h-5 text-slate-500" />
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">
                              Jl. Pipit No. 150, Bandara Temindung,<br />
                              Kecamatan Sungai Pinang,<br />
                              Kota Samarinda, Kalimantan Timur 75119.
                          </p>
                      </div>
                  </div>
              </div>

              {/* CARD LOKASI 2: OPERASIONAL */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group hover:shadow-md hover:border-blue-300 transition-all">
                  <div className="w-full h-[280px] bg-slate-100 relative overflow-hidden border-b border-slate-100">
                      <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d814.8608445135244!2d117.25398160368444!3d-0.37428938870092066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df5d9c63ea06c0d%3A0xd599c6e1587a385f!2sSamarinda%20Airport%20Meteorological%20Office!5e0!3m2!1sen!2sid!4v1779084636908!5m2!1sen!2sid" 
                          width="100%"
                          height="100%" 
                          style={{ border: 0 }} 
                          allowFullScreen 
                          loading="lazy"
                          className="filter grayscale-[50%] group-hover:grayscale-0 transition duration-700 ease-in-out"
                          title="Peta Kantor Operasional"
                      ></iframe>
                      <div className="absolute top-4 right-4 bg-blue-600/95 backdrop-blur px-3 py-1.5 rounded-xl shadow-sm border border-blue-500 flex items-center gap-2 pointer-events-none text-white">
                          <Plane className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">Operasional</span>
                      </div>
                  </div>
                  <div className="p-6 md:p-8">
                      <h3 className="text-xl font-bold text-slate-800 mb-4">Kantor Operasional</h3>
                      <div className="flex items-start gap-3">
                          <div className="bg-blue-50 p-2 rounded-lg border border-blue-100 shrink-0 mt-0.5">
                              <MapPin className="w-5 h-5 text-blue-600" />
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">
                              Gedung BMKG, Komplek Bandara A.P.T Pranoto,<br />
                              Sungai Siring, Kecamatan Samarinda Utara,<br />
                              Kota Samarinda, Kalimantan Timur 75116.
                          </p>
                      </div>
                  </div>
              </div>

          </div>

        </div>
      </div>
    </div>
  );
}

// Komponen Tombol Sosmed yang Disesuaikan
function SocialButton({ href, icon, label, color }: { href: string, icon: React.ReactNode, label: string, color: string }) {
    return (
        <a 
            href={href} 
            target="_blank" 
            rel="noreferrer"
            className={`flex items-center gap-2 bg-white border px-4 py-2 rounded-xl transition-all shadow-sm ${color} focus:outline-none`}
        >
            {icon}
            <span className="font-bold text-xs">{label}</span>
        </a>
    )
}