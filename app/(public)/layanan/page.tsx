"use client";

import React from 'react';
import { 
  GraduationCap, ShieldCheck, Ship, Anchor, BarChart3, 
  MessageSquareText, Check, FileText, Info
} from 'lucide-react';

export default function PricingLayananPage() {
  
  const services = [
    {
      id: 1,
      title: "Data Akademik",
      description: "Untuk keperluan studi dan penelitian mahasiswa.",
      price: "Rp 0",
      period: "/ pengajuan",
      icon: GraduationCap,
      features: [
        "Akses data parameter lengkap",
        "Wajib KTM & Surat Pengantar",
        "Dukungan konsultasi dasar",
        "Format data digital (XLS/PDF)"
      ],
      url: "https://forms.google.com/your-form-student",
      isPopular: false
    },
    {
      id: 2,
      title: "Klaim Asuransi",
      description: "Data dukung resmi untuk proses klaim asuransi.",
      price: "Rp 175rb",
      period: "/ lokasi / hari",
      icon: ShieldCheck,
      features: [
        "Analisis cuaca historis (24 jam)",
        "Surat keterangan resmi BMKG",
        "Parameter hujan & angin kencang",
        "Validasi data radar/satelit"
      ],
      url: "https://forms.google.com/your-form-insurance",
      isPopular: false 
    },
    {
      id: 3,
      title: "Cuaca Pelayaran",
      description: "Keselamatan rute pelayaran kapal komersial.",
      price: "Rp 250rb",
      period: "/ rute / hari",
      icon: Ship,
      features: [
        "Prakiraan tinggi gelombang",
        "Peta arah & kecepatan angin",
        "Peringatan dini cuaca laut",
        "Rekomendasi keselamatan"
      ],
      url: "https://forms.google.com/your-form-voyage",
      isPopular: false
    },
    {
      id: 4,
      title: "Cuaca Pelabuhan",
      description: "Dukungan operasional bongkar muat logistik.",
      price: "Rp 225rb",
      period: "/ lokasi / hari",
      icon: Anchor,
      features: [
        "Prakiraan spesifik area dermaga",
        "Window time operasional aman",
        "Peringatan angin kencang",
        "Update per 6 jam"
      ],
      url: "https://forms.google.com/your-form-port",
      isPopular: false
    },
    {
      id: 5,
      title: "Analisis Hujan",
      description: "Buku publikasi data dan analisis iklim bulanan.",
      price: "Rp 65rb",
      period: "/ buku",
      icon: BarChart3,
      features: [
        "Buku digital (PDF High Res)",
        "Peta isohiet & distribusi hujan",
        "Analisis sifat hujan & hari hujan",
        "Arsip data 10 tahun terakhir"
      ],
      url: "https://forms.google.com/your-form-rain",
      isPopular: false
    },
    {
      id: 6,
      title: "Jasa Konsultasi",
      description: "Solusi khusus untuk proyek dan industri.",
      price: "Rp 3.75jt",
      period: "/ proyek",
      icon: MessageSquareText,
      features: [
        "Tim ahli meteorologi tersertifikasi",
        "Kajian risiko bencana hidrometeo",
        "Survei lokasi & pemasangan alat",
        "Laporan teknis komprehensif"
      ],
      url: "https://forms.google.com/your-form-consult",
      isPopular: false
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBFCFD] text-slate-900 py-20 overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Tarif & Layanan
          </h1>
          <p className="text-lg md:text-xl text-slate-500">
            Transparansi biaya PNBP untuk setiap kebutuhan data Anda. <br className="hidden md:block" />
            Pilih layanan yang sesuai, mulai dari akademik hingga industri.
          </p>
        </div>

        {/* GRID LAYANAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((item) => (
            <div key={item.id} className="relative group h-full">

              {/* CARD CONTAINER */}
              <div className={`relative flex flex-col h-full bg-white rounded-[32px] p-8 transition-all duration-300 border-2
                ${item.isPopular 
                  ? 'border-transparent shadow-xl shadow-teal-900/5' 
                  : 'border-slate-200 shadow-sm'
                }
                
                {/* === HOVER EFFECTS: BORDER BIRU & SHADOW === */}
                group-hover:border-blue-500 group-hover:shadow-xl group-hover:shadow-blue-500/10 group-hover:-translate-y-1
              `}>
                
                {/* Header: Icon & Title */}
                <div className="flex flex-col items-center text-center mb-6">

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">
                    {item.description}
                  </p>
                </div>

                {/* PRICE SECTION */}
                <div className="text-center mb-8 py-8 border-y border-slate-100 group-hover:border-slate-200 transition-colors">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                      {item.price}
                    </span>
                  </div>
                  <span className="text-sm text-slate-400 font-medium mt-1 block">
                    {item.period}
                  </span>
                  
                  {item.isPopular && (
                    <span className="inline-block mt-3 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-full group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                      Paling Banyak Dicari
                    </span>
                  )}
                </div>

                {/* Button CTA */}
                <div className="mb-8">
                  <a 
                    href={item.url}
                    target="_blank" 
                    rel="noreferrer"
                    className={`block w-full py-3.5 rounded-full text-center font-semibold text-sm transition-all duration-300 border
                      ${item.isPopular 
                        ? 'bg-slate-900 text-white border-transparent' 
                        : 'bg-white border-slate-200 text-slate-700'
                      }
                      group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white group-hover:shadow-md
                    `}
                  >
                    Ajukan Sekarang
                  </a>
                </div>

                {/* Features List */}
                <div className="flex-grow">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                    Yang Termasuk:
                  </p>
                  <ul className="space-y-3">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`mt-0.5 p-0.5 rounded-full transition-colors duration-300
                          bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600
                        `}>
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                        <span className="text-sm text-slate-600 leading-snug">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          ))}
        </div>


        {/*  ALUR PENGAJUAN  */}
        <div className="mb-20 mt-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Alur Permintaan Data</h2>
            <p className="text-slate-500">Proses mudah dan transparan dari pengajuan hingga data diterima.</p>
          </div>

          <div className="relative">
            {/* Garis Penghubung (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center shadow-sm">
                <div className="w-12 h-12 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl mb-4 border-4 border-white shadow-sm">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Isi Formulir</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pilih layanan di atas, klik "Ajukan", dan lengkapi data diri serta detail permintaan di Google Form.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center shadow-sm">
                <div className="w-12 h-12 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl mb-4 border-4 border-white shadow-sm">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Verifikasi & Billing</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Petugas memverifikasi. Jika disetujui, Anda akan menerima Kode Billing PNBP via Email/WA.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center shadow-sm">
                <div className="w-12 h-12 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl mb-4 border-4 border-white shadow-sm">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Pembayaran</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Lakukan pembayaran ke Kas Negara via ATM/M-Banking menggunakan Kode Billing (Simponi).
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center shadow-sm">
                <div className="w-12 h-12 mx-auto bg-green-50 text-green-600 rounded-full flex items-center justify-center font-bold text-xl mb-4 border-4 border-white shadow-sm">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Terima Data</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Setelah pembayaran terkonfirmasi lunas, softcopy data akan dikirimkan ke email Anda.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER  */}
        <div className="border-t border-slate-200 pt-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                 <FileText className="w-32 h-32 text-slate-900" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 uppercase tracking-wide mb-4">
                  <Info className="w-3 h-3" />
                  Dasar Hukum & Regulasi
                </div>

                <div className="space-y-4 text-slate-500 text-sm leading-relaxed">
                  <p>
                    Tarif layanan yang tercantum di atas telah sesuai dengan <strong className="text-slate-700">PP No. 47 Tahun 2018</strong> tentang 
                    Jenis dan Tarif Penerimaan Negara Bukan Pajak (PNBP) yang berlaku di BMKG.
                  </p>
                  <p>
                    Adapun ketentuan mengenai <strong className="text-slate-700">Tarif Rp.0,00 (Nol Rupiah)</strong> untuk kegiatan tertentu (seperti penelitian/pendidikan) 
                    diterapkan sesuai dengan <strong className="text-slate-700">Perka BMKG No. 12 Tahun 2019</strong> tentang 
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