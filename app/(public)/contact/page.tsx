import type { Metadata } from "next";
import { MapPin, Mail, Clock, Facebook, Instagram, Twitter, Youtube, Globe, Plane } from "lucide-react";

export const metadata: Metadata = {
  title: "Hubungi Kami | BMKG Samarinda",
  description: "Informasi kontak, lokasi, dan media sosial Stasiun Meteorologi APT Pranoto Samarinda.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- HEADER --- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                Hubungi Kami
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
                Informasi lokasi kantor administrasi, kantor operasional, dan kontak layanan Stasiun Meteorologi Kelas III APT Pranoto Samarinda.
            </p>
        </div>

        {/* --- GRID INFO CARDS (Updated: 4 Kolom) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            
            {/* Card 1: Kantor Administrasi */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-all group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <MapPin className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Kantor Administrasi</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                    Jl. Pipit No. 150, Eks Bandara Temindung,<br />
                    Kec. Sungai Pinang, Samarinda<br />
                </p>
            </div>

            {/* Card 2: Kantor Operasional */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-all group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Plane className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Kantor Operasional</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                    Komplek Bandara APT Pranoto<br />
                    Jl. Poros Samarinda-Bontang<br />
                </p>
            </div>

            {/* Card 3: Kontak Digital */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-all group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Mail className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Kontak</h3>
                <div className="space-y-1 text-sm">
                    <a href="mailto:stamet.samarinda@bmkg.go.id" className="block text-gray-600 hover:text-blue-600 font-medium transition">
                        stamet.samarinda@bmkg.go.id
                    </a>
                    <a href="tel:85350611416" className="block text-gray-600 hover:text-blue-600 font-medium transition">
                        (+62) 85350611416 (WhatsApp/Telp)
                    </a>
                </div>
            </div>

            {/* Card 4: Jam Operasional */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-all group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Clock className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Jam Operasional</h3>
                <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-semibold text-gray-800">Admin:</span> 08.00 - 16.00 (Senin-Jumat)</p>
                    <p><span className="font-semibold text-gray-800">Obs:</span> 24 Jam (Setiap Hari)</p>
                </div>
            </div>

        </div>

        {/* --- SOCIAL MEDIA SECTION --- */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 mb-12 text-center text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-8">Ikuti Kami di Media Sosial</h3>
            <div className="flex flex-wrap justify-center gap-6">
                <SocialButton href="https://www.facebook.com/bmkg.kotasamarinda/" icon={<Facebook className="w-6 h-6" />} label="Facebook" color="hover:bg-[#1877F2]" />
                <SocialButton href="https://www.instagram.com/stamet.samarinda.bmkg?igsh=MWQwb3hlYzk5ZzdyNQ==" icon={<Instagram className="w-6 h-6" />} label="Instagram" color="hover:bg-[#E4405F]" />
                <SocialButton href="https://x.com/BMKG_Samarinda?t=2adlrNpRoV46_BxZtN9yAg&s=09" icon={<Twitter className="w-6 h-6" />} label="X" color="hover:bg-[#1DA1F2]" />
                <SocialButton href="www.youtube.com/@ceceproby" icon={<Youtube className="w-6 h-6" />} label="YouTube" color="hover:bg-[#FF0000]" />
                <SocialButton href="https://bmkg.go.id" icon={<Globe className="w-6 h-6" />} label="Portal BMKG" color="hover:bg-green-600" />
            </div>
        </div>

        {/* --- MAP SECTION --- */}
        <div className="w-full h-[500px] bg-gray-200 rounded-3xl overflow-hidden shadow-md border-4 border-white relative group">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3453.2606505314493!2d117.25393150266467!3d-0.3724284457308565!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df5d9c63ea06c0d%3A0xd599c6e1587a385f!2sSamarinda%20Airport%20Meteorological%20Office!5e0!3m2!1sen!2sid!4v1767771756216!5m2!1sen!2sid"
                width="100%"
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                className="filter grayscale group-hover:grayscale-0 transition duration-1000 ease-in-out"
            ></iframe>
            
            {/* Label Overlay */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg border border-gray-200 hidden md:block">
                <p className="font-bold text-gray-900">Stasiun Meteorologi Samarinda</p>
                <p className="text-xs text-gray-500">Bandara APT Pranoto</p>
            </div>
        </div>

      </div>
    </div>
  );
}

// Komponen Tombol Sosmed
function SocialButton({ href, icon, label, color }: { href: string, icon: React.ReactNode, label: string, color: string }) {
    return (
        <a 
            href={href} 
            target="_blank" 
            rel="noreferrer"
            className={`flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-full transition-all transform hover:-translate-y-1 hover:shadow-lg ${color}`}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </a>
    )
}