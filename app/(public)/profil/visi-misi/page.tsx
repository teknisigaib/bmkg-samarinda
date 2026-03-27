import type { Metadata } from "next";
import { Target, ShieldCheck, CheckCircle2, Globe2, Activity, Users, Eye } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Visi & Misi | BMKG APT Pranoto Samarinda",
  description: "Visi, misi, dan tujuan BMKG dalam memberikan pelayanan informasi cuaca dan iklim.",
};

const MISI_DATA = [
  {
    icon: <Activity className="w-5 h-5 text-blue-600" />,
    title: "Mengamati dan memahami fenomena meteorologi, klimatologi, kualitas udara dan geofisika.",
    desc: "BMKG melaksanakan operasional pengamatan dan pengumpulan data secara teratur, lengkap dan akurat guna dipakai untuk mengenali dan memahami karakteristik unsur-unsur meteorologi, klimatologi, kualitas udara, dan geofisika guna membuat prakiraan dan informasi yang akurat.",
  },
  {
    icon: <Users className="w-5 h-5 text-blue-600" />,
    title: "Menyediakan data, informasi dan jasa yang handal dan terpercaya.",
    desc: "Menyediakan data, informasi dan jasa meteorologi, klimatologi, kualitas udara, dan geofisika kepada para pengguna sesuai dengan kebutuhan dan keinginan mereka dengan tingkat akurasi tinggi dan tepat waktu.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
    title: "Mengkoordinasikan dan memfasilitasi kegiatan di bidang MKG.",
    desc: "Sesuai dengan kewenangan BMKG, maka BMKG wajib mengawasi pelaksanaan operasional, memberi pedoman teknis, serta berwenang untuk mengkalibrasi peralatan meteorologi, klimatologi, kualitas udara, dan geofisika sesuai dengan peraturan yang berlaku.",
  },
  {
    icon: <Globe2 className="w-5 h-5 text-blue-600" />,
    title: "Berpartisipasi aktif dalam kegiatan internasional.",
    desc: "BMKG dalam melaksanakan kegiatan secara operasional selalu mengacu pada ketentuan internasional mengingat bahwa fenomena meteorologi, klimatologi, kualitas udara, dan geofisika tidak terbatas dan tidak terkait pada batas batas wilayah suatu negara manapun.",
  }
];

export default function VisiMisiPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="w-full mx-auto pt-6 space-y-8">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
            items={[
              { label: "Beranda", href: "/" },
              { label: "Profil" }, 
              { label: "Visi & Misi" } 
            ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mb-10 mx-auto pt-2">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
           </div>
           
           <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Visi & Misi
           </h1>
           
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl mb-2">
              Arah kebijakan, tujuan, dan komitmen pelayanan Badan Meteorologi, Klimatologi, dan Geofisika.
           </p>
        </section>

        {/* --- KATA PENGANTAR (Latar Belakang) --- */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="bg-blue-50 p-4 rounded-xl shrink-0 border border-blue-100 hidden md:block">
                    <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
                <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base text-justify font-medium">
                    <p>
                        Dalam rangka mendukung dan mengemban tugas pokok dan fungsi serta memperhatikan kewenangan BMKG agar lebih efektif dan efisien, maka diperlukan aparatur yang profesional, bertanggung jawab dan berwibawa serta bebas dari Korupsi, Kolusi, dan Nepotisme (KKN).
                    </p>
                    <p>
                        Disamping itu harus dapat menjunjung tinggi kedisiplinan, kejujuran dan kebenaran guna ikut serta memberikan pelayanan informasi yang cepat, tepat dan akurat. Oleh karena itu kebijakan yang dilakukan mengacu pada Visi, Misi, dan Tujuan BMKG yang telah ditetapkan.
                    </p>
                </div>
            </div>
        </section>

        {/* --- VISI SECTION --- */}
        <section className="space-y-6 pt-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <Eye className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Visi BMKG</h2>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 md:p-10 shadow-lg text-center relative overflow-hidden">
               
                <p className="relative z-10 text-xl md:text-2xl text-white font-semibold leading-relaxed">
                    "Mewujudkan BMKG yang <span className="text-blue-200 font-black">handal, tanggap dan mampu</span> dalam rangka mendukung keselamatan masyarakat serta keberhasilan pembangunan nasional, dan berperan aktif di tingkat Internasional."
                </p>
            </div>

            {/* Penjelasan Terminologi Visi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <h4 className="font-bold text-slate-800 uppercase tracking-widest text-[11px]">Pelayanan Handal</h4>
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed text-justify">
                        Pelayanan BMKG terhadap penyajian data, informasi pelayanan jasa meteorologi, klimatologi, kualitas udara, dan geofisika yang akurat, tepat sasaran, tepat guna, cepat, lengkap, dan dapat dipertanggungjawabkan.
                    </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <h4 className="font-bold text-slate-800 uppercase tracking-widest text-[11px]">Tanggap & Mampu</h4>
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed text-justify">
                        BMKG dapat menangkap dan merumuskan kebutuhan stakeholder akan data, informasi, dan jasa MKG serta mampu memberikan pelayanan sesuai dengan kebutuhan pengguna jasa.
                    </p>
                </div>
            </div>
        </section>

        {/* --- MISI SECTION --- */}
        <section className="space-y-6 pt-8">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <Target className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Misi BMKG</h2>
            </div>

            <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed">
                Dalam rangka mewujudkan Visi BMKG, maka diperlukan langkah-langkah strategis yang jelas untuk mewujudkan Misi yang telah ditetapkan, yaitu:
            </p>

            <div className="space-y-4">
                {MISI_DATA.map((misi, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row gap-5 items-start hover:border-blue-300 transition-colors duration-300">
                        {/* Angka / Ikon */}
                        <div className="flex-shrink-0 w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center font-black text-xl text-slate-300">
                            0{index + 1}
                        </div>
                        
                        {/* Konten Misi & Rincian */}
                        <div className="space-y-2 w-full">
                            <h3 className="text-base md:text-lg font-bold text-slate-800 leading-snug">
                                {misi.title}
                            </h3>
                            <div className="w-10 h-0.5 bg-blue-500 rounded-full my-3"></div>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed text-justify">
                                {misi.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

      </div>
    </div>
  );
}