"use client";

import Link from "next/link";
import { 
  FileSearch, 
  Users, 
  Megaphone, 
  MessageSquareHeart, 
  Plane, 
  Map, 
  Waves,
  Flame,
  ArrowRight,
  ExternalLink
} from "lucide-react";

const SERVICES = [
  {
    title: "Permohonan Data",
    desc: "Layanan permintaan data meteorologi, klimatologi, dan geofisika secara resmi.",
    icon: FileSearch,
    link: "/layanan",
    isExternal: false
  },
  {
    title: "Kunjungan & Internship",
    desc: "Prosedur pengajuan kunjungan edukasi atau kerja praktik mahasiswa/siswa.",
    icon: Users,
    link: "https://wa.me/6285350611416?text=Halo%20BMKG%20APT%20Pranoto,%20saya%20ingin%20bertanya%20mengenai%20prosedur%20kunjungan/magang.",
    isExternal: true
  },
  {
    title: "Peta Penerbangan",
    desc: "Visualisasi peta cuaca jalur penerbangan dan kondisi bandara secara spasial.",
    icon: Plane,
    link: "/cuaca/penerbangan",
    isExternal: false
  },
  {
    title: "Peta Cuaca Real-time",
    desc: "Pantauan kondisi cuaca terkini di seluruh wilayah melalui peta interaktif.",
    icon: Map,
    link: "/cuaca/peta-cuaca",
    isExternal: false
  },
  {
    title: "Cuaca Sungai Mahakam",
    desc: "Informasi khusus kondisi cuaca dan hidrologi untuk jalur transportasi sungai.",
    icon: Waves,
    link: "/cuaca/mahakam",
    isExternal: false
  },
  {
    title: "Peringatan Karhutla",
    desc: "Pantauan titik panas (hotspot) dan potensi kemudahan kebakaran hutan dan lahan.",
    icon: Flame,
    link: "/cuaca/karhutla",
    isExternal: false
  },
  {
    title: "Lapor.go.id",
    desc: "Layanan aspirasi dan pengaduan daring rakyat yang terintegrasi nasional.",
    icon: Megaphone,
    link: "https://www.lapor.go.id/instansi/badan-meteorologi-klimatologi-dan-geofisika",
    isExternal: true
  },
  {
    title: "Saran & Pengaduan",
    desc: "Kotak saran digital untuk perbaikan kualitas pelayanan operasional kami.",
    icon: MessageSquareHeart,
    link: "https://docs.google.com/forms/d/e/1FAIpQLSeamL8VTvF-XqGMn6tqHAEZM2co5pDomJJpIlXnhvl9ZAlWRA/viewform",
    isExternal: true
  }
];

export default function PublicServices() {
  return (
    <section className="w-full py-6 px-4 sm:px-6 lg:px-12 bg-white">

      {/* GRID LAYANAN - 8 ITEM (2 Row x 4 Column on Large Screens) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {SERVICES.map((service, idx) => (
          <Link 
            href={service.link} 
            key={idx}
            target={service.isExternal ? "_blank" : "_self"}
            className="group bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-500 relative overflow-hidden flex flex-col h-full"
          >
            {/* Background Decor Icon */}
            <service.icon className="absolute -right-6 -bottom-6 w-28 h-28 text-slate-200/30 group-hover:text-blue-500/5 transition-colors duration-500" />

            <div className="relative z-10 flex flex-col h-full">
              {/* Box Ikon */}
              <div className="bg-white border border-slate-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:border-blue-100 group-hover:scale-110 transition-all duration-300">
                <service.icon className="w-6 h-6 text-blue-600" />
              </div>
              
              <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                {service.desc}
              </p>

              <div className="mt-auto flex items-center justify-between text-blue-600 font-bold text-[11px] uppercase tracking-widest">
                <span>{service.isExternal ? "Buka Tautan" : "Lihat Halaman"}</span>
                <div className="bg-blue-50 p-1.5 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {service.isExternal ? (
                    <ExternalLink className="w-3 h-3" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}