import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Kolom 1: Identitas */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
                <Image src="/logo-bmkg.png" alt="Logo BMKG" width={40} height={40} />
                <div>
                    <h3 className="text-white font-bold text-lg leading-tight">BMKG</h3>
                    <p className="text-xs text-slate-400">Stasiun Meteorologi Aji Pangeran Tumenggung Pranoto - Samarinda</p>
                </div>
            </div>
            <p className="leading-relaxed text-slate-400">
              Menyediakan layanan informasi cuaca, iklim, dan gempa bumi yang cepat, tepat, akurat, dan luas jangkauannya.
            </p>
            <div className="flex gap-4 pt-2">
                <a href="#" className="hover:text-white transition"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="hover:text-white transition"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="hover:text-white transition"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="hover:text-white transition"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Kolom 2: Kontak */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base mb-2">Hubungi Kami</h4>
            <div className="items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Kantor Operasional : Bandara APT Pranoto Jl. Poros Samarinda-Bontang, Samarinda, Kalimantan Timur</span>
            </div>
            <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Kantor Administrasi : Jl. Pipit No. 150, Samarinda, Kalimantan Timur</span>
            </div>
            <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>(0541) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>stamet.samarinda@bmkg.go.id</span>
            </div>
          </div>

          {/* Kolom 3: Tautan Cepat */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base mb-2">Tautan Cepat</h4>
            <ul className="space-y-2">
                <li><Link href="/profil/visi-misi" className="hover:text-blue-400 transition">Visi & Misi</Link></li>
                <li><Link href="/cuaca/prakiraan" className="hover:text-blue-400 transition">Prakiraan Cuaca</Link></li>
                <li><Link href="/publikasi/berita-kegiatan" className="hover:text-blue-400 transition">Berita Terkini</Link></li>
                <li><Link href="/publikasi/buletin" className="hover:text-blue-400 transition">Unduh Buletin</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400 transition">Hubungi Kami</Link></li>
            </ul>
          </div>

          {/* Kolom 4: Peta / Widget */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base mb-2">Lokasi Kantor</h4>
            {/* Embed Google Maps (Iframe) */}
            <div className="w-full h-40 bg-slate-800 rounded-lg overflow-hidden relative">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.691702587636!2d117.15!3d-0.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMzAnMDAuMCJTIDExN8KwMDknMDAuMCJF!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    className="absolute inset-0 grayscale hover:grayscale-0 transition duration-500"
                ></iframe>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} BMKG Stasiun Meteorologi APT Pranoto Samarinda. All rights reserved.</p>
            <p>Developed with ❤️ for Indonesia.</p>
        </div>
      </div>
    </footer>
  );
}