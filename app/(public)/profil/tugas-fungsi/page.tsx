import type { Metadata } from "next";
import { CheckCircle2, ClipboardList, Database, Briefcase, ScrollText } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Tugas & Fungsi | BMKG APT Pranoto Samarinda",
  description: "Uraian tugas pokok dan fungsi operasional BMKG Stasiun Meteorologi APT Pranoto Samarinda.",
};

const PENGAMATAN_TASKS = [
    "Melaksanakan pengamatan meteorologi permukaan secara terus-menerus setiap 1 (satu) jam selama 24 jam setiap hari berdasarkan waktu standar internasional.",
    "Melaksanakan penyandian data meteorologi permukaan setiap jam pengamatan.",
    "Melaksanakan pengamatan cuaca khusus sesuai kebutuhan jaringan, antara lain radar cuaca/hujan, dan penerima citra satelit cuaca.",
    "Melaksanakan pengamatan meteorologi permukaan menggunakan peralatan di taman alat dan landas pacu untuk pelayanan penerbangan (METAR, SPECI, MET REPORT, dan SPECIAL).",
    "Melaksanakan pengamatan meteorologi paling sedikit terhadap unsur-unsur: radiasi matahari, suhu udara, tekanan udara, angin, kelembaban udara, awan, jarak pandang, curah hujan, penguapan.",
    "Melaksanakan kegiatan fam flight bagi stasiun meteorologi yang memberikan layanan penerbangan."
];

const PENGELOLAAN_TASKS = [
    "Melaksanakan pengiriman berita data sandi meteorologi permukaan pada jam-jam 00, 03, 06, 09, 12, 15, 18, 21 UTC secara tepat waktu.",
    "Melaksanakan monitoring dan kualiti kontrol pengiriman berita data sandi meteorologi permukaan dan udara atas.",
    "Melaksanakan pengumpulan data meteorologi permukaan untuk keperluan pemetaan dan analisis cuaca.",
    "Melaksanakan pengumpulan produk informasi dan prakiraan cuaca, produk Numerical Weather Prediction (NWP) dan/atau peringatan dini dari BMKG Pusat.",
    "Melaksanakan pertukaran data dan informasi cuaca penerbangan, sesuai ketentuan dan kebutuhan operasi.",
    "Melaporkan kejadian-kejadian cuaca ekstrim di wilayah pelayanan yang menjadi tanggung jawabnya ke BMKG Pusat.",
    "Melaporkan keadaan cuaca pada saat terjadinya kecelakaan pesawat ke Kepala Pusat Meteorologi Penerbangan dan Maritim BMKG.",
    "Melaksanakan pengiriman data hasil pengamatan lainnya menggunakan Sistem Pengelolaan Database MKKuG yang telah ditentukan."
];

export default function TugasFungsiPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="w-full mx-auto pt-6 space-y-8">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
            items={[
              { label: "Beranda", href: "/" },
              { label: "Profil" }, 
              { label: "Tugas & Fungsi" } 
            ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mb-10 mx-auto pt-2">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
           </div>
           
           <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Tugas & Fungsi
           </h1>
           
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl mb-2">
              Uraian tugas pokok operasional Stasiun Meteorologi APT Pranoto Samarinda.
           </p>
        </section>

        {/* --- TUGAS POKOK (DASAR HUKUM) --- */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="bg-blue-50 p-4 rounded-xl shrink-0 border border-blue-100 hidden md:block">
                    <ScrollText className="w-8 h-8 text-blue-600" />
                </div>
                <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base text-justify font-medium">
                    <p>
                        Sesuai <strong className="text-slate-800">Peraturan Kepala Badan Meteorologi, Klimatologi dan Geofisika Nomor 9 TAHUN 2014</strong> Tentang Uraian Tugas Stasiun Meteorologi, BAB II Pasal 4 bahwa Stasiun meteorologi merupakan Unit Pelaksana Teknis di lingkungan Badan Meteorologi, Klimatologi, dan Geofisika yang berada dibawah dan bertanggung jawab kepada Kepala BMKG. 
                    </p>
                    <p>
                        Adapun Tugas Pokok Stasiun Meteorologi seperti termuat dalam Bab II pasal 6 adalah melaksanakan pengamatan, pengelolaan data, pelayanan jasa dan tugas penunjang meliputi pemeliharaan peralatan, kerjasama/koordinasi, administrasi, dan tugas tambahan.
                    </p>
                </div>
            </div>
        </section>

        {/* --- URAIAN TUGAS SPESIFIK --- */}
        <section className="pt-6 space-y-8">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Uraian Tugas Operasional</h2>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                    Berikut adalah rincian tugas operasional harian Stasiun Meteorologi Aji Pangeran Tumenggung Pranoto, Samarinda, Kalimantan Timur.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
                
                {/* KOLOM PENGAMATAN */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                        <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100 shrink-0">
                            <ClipboardList className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Tugas Pengamatan</h3>
                    </div>
                    
                    <ul className="space-y-4">
                        {PENGAMATAN_TASKS.map((task, idx) => (
                            <li key={idx} className="flex gap-3 items-start group">
                                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span className="text-sm text-slate-600 font-medium leading-relaxed group-hover:text-slate-900 transition-colors">{task}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* KOLOM PENGELOLAAN DATA */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                        <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100 shrink-0">
                            <Database className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Pengelolaan Data</h3>
                    </div>
                    
                    <ul className="space-y-4">
                        {PENGELOLAAN_TASKS.map((task, idx) => (
                            <li key={idx} className="flex gap-3 items-start group">
                                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span className="text-sm text-slate-600 font-medium leading-relaxed group-hover:text-slate-900 transition-colors">{task}</span>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </section>

      </div>
    </div>
  );
}