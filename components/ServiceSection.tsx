import Link from "next/link";
import { Database, CloudRain, GraduationCap, PhoneForwarded, ArrowRight, ExternalLink } from "lucide-react";

const services = [
  {
    title: "Pelayanan Data",
    desc: "Permintaan data meteorologi untuk riset, konstruksi, dan klaim asuransi.",
    icon: <Database className="w-6 h-6 text-white" />,
    color: "bg-blue-600",
    href: "/layanan/data", 
  },
  {
    title: "Monitoring Hujan",
    desc: "Pantauan intensitas dan sebaran hujan realtime dari Automatic Rain Gauge (ARG)",
    icon: <CloudRain className="w-6 h-6 text-white" />,
    color: "bg-sky-600", // Warna Langit/Hujan
    href: "https://monitoringarg.bmkgaptpranoto.com/", // Link ke halaman detail (nanti bisa dibuat)
    external: true, // Menandakan link eksternal
  },
  {
    title: "Prakerin & Magang",
    desc: "Program edukasi dan praktik kerja lapangan bagi pelajar/mahasiswa.",
    icon: <GraduationCap className="w-6 h-6 text-white" />,
    color: "bg-teal-600",
    href: "/profil/kontak",
  },
  {
    title: "Pengaduan Publik",
    desc: "Layanan aspirasi dan pengaduan masyarakat via SP4N LAPOR!",
    icon: <PhoneForwarded className="w-6 h-6 text-white" />,
    color: "bg-rose-600",
    href: "https://www.lapor.go.id/",
    external: true,
  },
];

export default function ServiceSection() {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-blue-600 font-bold tracking-wider text-sm uppercase mb-2 block">Layanan Kami</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Produk & Layanan <br/> Stasiun Meteorologi APT Pranoto Samarinda
            </h2>
          </div>
          <p className="text-gray-500 max-w-md text-sm md:text-base leading-relaxed text-right md:text-left">
            Mengedepankan transparansi, kecepatan, dan akurasi dalam melayani kebutuhan informasi masyarakat dan mitra kerja.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, index) => (
            <div key={index} className="group relative">
                {/* Link Wrapper */}
                {item.external ? (
                    <a href={item.href} target="_blank" rel="noreferrer" className="block h-full">
                        <ServiceCardContent item={item} />
                    </a>
                ) : (
                    <Link href={item.href} className="block h-full">
                        <ServiceCardContent item={item} />
                    </Link>
                )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// Komponen Isi Card
function ServiceCardContent({ item }: { item: any }) {
    return (
        <div className="h-full bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 relative overflow-hidden flex flex-col">
            
            {/* Gradient Background on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Icon Box */}
            <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shadow-lg shadow-blue-900/10 mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10`}>
                {item.icon}
            </div>

            {/* Content */}
            <div className="relative z-10 flex-grow">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors">
                    {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {item.desc}
                </p>
            </div>

            {/* Action Footer */}
            <div className="relative z-10 pt-4 mt-auto border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
                    {item.external ? "Akses Eksternal" : "Lihat Detail"}
                </span>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    {item.external ? <ExternalLink className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </div>
            </div>
        </div>
    )
}