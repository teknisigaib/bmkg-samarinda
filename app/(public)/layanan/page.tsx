"use client";

import React from 'react';
import { 
  GraduationCap, ShieldCheck, Ship, Anchor, BarChart3, 
  MessageSquareText, Check, FileText, Info, Database, Receipt
} from 'lucide-react';
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function PricingLayananPage() {
  
  const services = [
    {
      id: 1,
      title: "Data Akademik",
      description: "Untuk keperluan studi dan penelitian mahasiswa.",
      price: "Rp 0",
      period: "/ pengajuan",
      icon: GraduationCap,
      url: "https://docs.google.com/forms/d/e/1FAIpQLSe5xlkOtp5diRcCz1ce--khqrOjccAi3OflxkRcINeUDzU6hQ/viewform",
      isPopular: false
    },
    {
      id: 2,
      title: "Klaim Asuransi",
      description: "Data dukung resmi untuk proses klaim asuransi.",
      price: "Rp 175rb",
      period: "/ lokasi / hari",
      icon: ShieldCheck,
      url: "https://docs.google.com/forms/d/e/1FAIpQLSfdcKKSEfCkggG40jFdM7CkLaAVgmYyH8Fh5cmqS-jvx0z49g/viewform",
      isPopular: false 
    },
    {
      id: 3,
      title: "Cuaca Pelayaran",
      description: "Keselamatan rute pelayaran kapal komersial.",
      price: "Rp 250rb",
      period: "/ rute / hari",
      icon: Ship,
      url: "https://docs.google.com/forms/d/e/1FAIpQLSeg2mPTD18NEmOdjO7YJFfM6l9Z2ciz5JFRs8vCRyddTc1P7A/viewform",
      isPopular: false
    },
    {
      id: 4,
      title: "Cuaca Pelabuhan",
      description: "Dukungan operasional bongkar muat logistik.",
      price: "Rp 225rb",
      period: "/ lokasi / hari",
      icon: Anchor,
      url: "https://docs.google.com/forms/d/e/1FAIpQLSflHlgI6TIBt07kSZ0ciu6Bkjd7lm3DFfHvSCc-mGL3l0DBSA/viewform",
      isPopular: false
    },
    {
      id: 5,
      title: "Analisis Hujan",
      description: "Buku publikasi data dan analisis iklim bulanan.",
      price: "Rp 65rb",
      period: "/ buku",
      icon: BarChart3,
      url: "https://docs.google.com/forms/d/e/1FAIpQLSfittGEQR1ifH2E5wnMq-95AUXQKUp-66w29A3nEFjPDBRcTQ/viewform",
      isPopular: false
    },
    {
      id: 6,
      title: "Jasa Konsultasi",
      description: "Solusi khusus untuk proyek dan industri.",
      price: "Rp 3.75jt",
      period: "/ proyek",
      icon: MessageSquareText,
      url: "https://docs.google.com/forms/d/e/1FAIpQLSemY2Mv1Z2e4-920lb6qabd0DHBcaX82n4yW37-xLJOff-frg/viewform",
      isPopular: false
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="w-full mx-auto pt-6 px-4 lg:px-8 space-y-12">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
            items={[
              { label: "Beranda", href: "/" },
              { label: "Layanan" }, 
              { label: "Tarif & Layanan Data" } 
            ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mb-16 mx-auto pt-2">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
           </div>
           
           <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Tarif & Layanan Data
           </h1>
           
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl mb-8">
              Transparansi biaya PNBP untuk setiap kebutuhan data Anda. Pilih layanan yang sesuai, mulai dari keperluan akademik hingga operasional industri.
           </p>

           
        </section>

        {/* --- GRID LAYANAN --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((item) => (
            <div key={item.id} className="relative group h-full">

              {/* CARD CONTAINER */}
              <div className={`relative flex flex-col h-full bg-white rounded-2xl p-8 transition-all duration-300 border
                ${item.isPopular 
                  ? 'border-blue-200 shadow-lg shadow-blue-900/5' 
                  : 'border-slate-200 shadow-sm'
                }
                group-hover:border-blue-500 group-hover:shadow-xl group-hover:shadow-blue-500/10 group-hover:-translate-y-1
              `}>
                
                {/* Header: Icon & Title */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                      <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium max-w-[240px]">
                    {item.description}
                  </p>
                </div>

                {/* PRICE SECTION */}
                <div className="text-center mb-8 py-6 border-y border-slate-100 group-hover:border-slate-200 transition-colors">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                      {item.price}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 block">
                    {item.period}
                  </span>
                  
                  {item.isPopular && (
                    <span className="inline-block mt-4 px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-md">
                      Paling Banyak Dicari
                    </span>
                  )}
                </div>

                {/* Button CTA */}
                <div className="mt-auto">
                  <a 
                    href={item.url}
                    target="_blank" 
                    rel="noreferrer"
                    className={`block w-full py-3.5 rounded-xl text-center font-bold text-xs uppercase tracking-widest transition-all duration-300 border
                      ${item.isPopular 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                      }
                      group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white group-hover:shadow-md
                    `}
                  >
                    Ajukan Sekarang
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* --- ALUR PENGAJUAN --- */}
        <div className="pt-16 mb-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Alur Permintaan Data</h2>
            <p className="text-slate-500 font-medium text-sm md:text-base">Proses mudah dan transparan dari tahap pengajuan hingga data diterima.</p>
          </div>

          <div className="relative">
            {/* Garis Penghubung (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-slate-200 -translate-y-1/2 z-0 border-dashed border-t"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 relative z-10">
              {/* Step 1 */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 mx-auto bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xl mb-5 border border-blue-100 shadow-sm">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Isi Formulir</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Pilih layanan di atas, klik "Ajukan", dan lengkapi data diri serta detail permintaan di Google Form.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 mx-auto bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xl mb-5 border border-blue-100 shadow-sm">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Verifikasi & Billing</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Petugas memverifikasi. Jika disetujui, Anda akan menerima Kode Billing PNBP via Email/WA.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 mx-auto bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xl mb-5 border border-blue-100 shadow-sm">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Pembayaran</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Lakukan pembayaran ke Kas Negara via ATM/M-Banking menggunakan Kode Billing (Simponi).
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 mx-auto bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black text-xl mb-5 border border-emerald-100 shadow-sm">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Terima Data</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Setelah pembayaran terkonfirmasi lunas, *softcopy* data akan dikirimkan ke email Anda.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- FOOTER (Dasar Hukum) --- */}
        <div className="pt-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm text-center relative overflow-hidden">
              {/* Ikon Latar */}
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none">
                 <FileText className="w-48 h-48 text-slate-900" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-5">
                  <Info className="w-3.5 h-3.5 text-blue-500" />
                  Dasar Hukum & Regulasi
                </div>

                <div className="space-y-4 text-slate-500 text-sm md:text-base font-medium leading-relaxed text-justify md:text-center">
                  <p>
                    Tarif layanan yang tercantum di atas telah sesuai dengan <strong className="text-slate-800 font-bold">Peraturan Pemerintah (PP) No. 47 Tahun 2018</strong> tentang 
                    Jenis dan Tarif Penerimaan Negara Bukan Pajak (PNBP) yang berlaku di BMKG.
                  </p>
                  <p>
                    Adapun ketentuan mengenai <strong className="text-blue-700 font-bold">Tarif Rp 0,00 (Nol Rupiah)</strong> untuk kegiatan tertentu (seperti penelitian pendidikan/mahasiswa) 
                    diterapkan secara ketat sesuai dengan <strong className="text-slate-800 font-bold">Perka BMKG No. 12 Tahun 2019</strong> tentang 
                    Persyaratan dan Tata Cara Pengenaan Tarif Nol Rupiah Atas Jenis PNBP.
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