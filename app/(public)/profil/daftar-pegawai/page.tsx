export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import Image from "next/image";
import { Award, Briefcase, Star, Users, Wrench, CloudRain, Sun, FileText, BadgeCheck } from "lucide-react"; 
import { getPegawai, Pegawai } from "@/lib/data-pegawai";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Daftar Pegawai | BMKG APT Pranoto Samarinda",
  description: "Daftar struktural dan fungsional pegawai Stasiun Meteorologi APT Pranoto Samarinda.",
};

const sortFungsional = (pegawaiList: Pegawai[]) => {
  return pegawaiList.sort((a, b) => {
    if (a.is_ketua && !b.is_ketua) return -1;
    if (!a.is_ketua && b.is_ketua) return 1;
    return 0; 
  });
};

export default async function DaftarPegawaiPage() {
  const pegawai = await getPegawai();

  // --- PEMBAGIAN DATA ---
  const kepalaStasiun = pegawai.find((p) => p.group === "Pimpinan" && p.is_ketua);
  const nonKepala = pegawai.filter((p) => !(p.group === "Pimpinan" && p.is_ketua));
  
  const struktural = nonKepala.filter((p) => p.group === "Struktural");
  const fungsional = nonKepala.filter((p) => p.group === "Fungsional");
  
  const admin = sortFungsional(fungsional.filter((p) => p.sub_group === "Administrasi"));
  const meteo = sortFungsional(fungsional.filter((p) => p.sub_group === "Meteorologi"));
  const klimato = sortFungsional(fungsional.filter((p) => p.sub_group === "Klimatologi"));
  const teknisi = sortFungsional(fungsional.filter((p) => p.sub_group === "Teknisi"));

  const ppnpn = nonKepala.filter((p) => p.group === "PPNPN"); 

  // --- KOMPONEN KARTU KECIL (Reusable) ---
  const PegawaiCard = ({ item }: { item: Pegawai }) => {
    const isKetuaTim = item.group === "Fungsional" && item.is_ketua;
    
    return (
      <div className={`w-full bg-white rounded-2xl p-5 border shadow-sm transition-all duration-300 flex items-center gap-6 group hover:shadow-lg ${
        /* CATATAN 1: Mengubah border amber menjadi blue untuk Ketua Tim */
        isKetuaTim ? 'border-blue-200 hover:border-blue-300' : 'border-slate-200 hover:border-blue-300'
      }`}>
          {/* CATATAN 2: Memperbesar foto pegawai dari w-16 h-16 menjadi w-20 h-20 */}
          <div className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 shadow-sm transition-transform duration-500 group-hover:scale-105 ${
            /* CATATAN 1: Mengubah border amber menjadi blue */
            isKetuaTim ? 'border-blue-400' : 'border-slate-100 bg-slate-50'
          }`}>
            {item.image ? (
               <Image src={item.image} alt={item.name} fill className="object-cover" />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold bg-slate-50">NA</div>
            )}
          </div>
          
          <div className="flex-1 min-w-0 space-y-1.5">
            <h4 className="font-bold text-slate-800 text-sm md:text-base leading-tight truncate group-hover:text-blue-600 transition-colors">
              {item.name}
            </h4>
            
            <div className={`text-[11px] font-bold uppercase tracking-wider truncate flex flex-col gap-1 ${
                /* CATATAN 1: Mengubah text amber menjadi blue untuk Ketua Tim */
                isKetuaTim ? 'text-blue-600' : 'text-slate-500'
            }`}>
              {isKetuaTim ? (
                <>
                  {/* CATATAN 1: Mengubah fill amber menjadi blue */}
                  <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500" /> Ketua Tim</span>
                  <span className="text-slate-500 font-medium truncate">{item.position}</span>
                </>
              ) : (
                <span className="truncate">{item.position}</span>
              )}
            </div>
          </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="w-full mx-auto pt-6 space-y-12">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
            items={[
              { label: "Beranda", href: "/" },
              { label: "Profil" }, 
              { label: "Daftar Pegawai" } 
            ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mb-16 mx-auto pt-2">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
           </div>
           
           <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Daftar Pegawai
           </h1>
           
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl mb-6">
              Struktur organisasi dan susunan personalia Stasiun Meteorologi APT Pranoto Samarinda.
           </p>

           <div className="relative z-10 flex flex-wrap justify-center items-center bg-white border border-slate-200 rounded-2xl shadow-sm p-1">
              <div className="flex items-center gap-2 px-4 py-1.5">
                 <Users className="w-4 h-4 text-blue-500" />
                 <span className="text-xs font-semibold text-slate-700 uppercase tracking-widest">{pegawai.length} Personel Aktif</span>
              </div>
           </div>
        </section>

        {/* CARD 1: KEPALA STASIUN (HERO) */}
        {kepalaStasiun && (
          <section className="w-full flex justify-center mb-16">
              <div className="relative w-full max-w-2xl bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-lg text-center flex flex-col items-center overflow-hidden">
                  
                  {/* CATATAN 1: Mengubah garis aksen amber menjadi blue */}
                  <div className="absolute -top-1 w-32 h-2 bg-blue-600 rounded-b-full"></div>
                  
                  {/* CATATAN 2: Memperbesar foto Kepala Stasiun */}
                  {/* Dari w-36 h-36 md:w-44 md:h-44 menjadi w-40 h-40 md:w-52 md:h-52 */}
                  {/* CATATAN 1: Mengubah ring amber menjadi blue */}
                  <div className="relative w-40 h-40 md:w-52 md:h-52 flex-shrink-0 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-slate-100 mb-6 ring-4 ring-blue-50 transform -translate-y-2">
                      {kepalaStasiun.image ? (
                        <Image src={kepalaStasiun.image} alt={kepalaStasiun.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">NA</div>
                      )}
                  </div>
                  
                  {/* CATATAN 1: Mengubah badge amber menjadi blue */}
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-3 border border-blue-100 shadow-sm mt-[-10px]">
                      <BadgeCheck className="w-4 h-4" /> Kepala Stasiun
                  </span>
                  
                  <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">{kepalaStasiun.name}</h3>
                  <p className="text-sm md:text-base text-slate-500 mt-2 font-medium">{kepalaStasiun.position}</p>
              </div>
          </section>
        )}

        {/* CARD 2: JABATAN STRUKTURAL */}
        {struktural.length > 0 && (
          <section className="w-full">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-3 w-full">
                  <Award className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Jabatan Struktural</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {struktural.map((item, idx) => <PegawaiCard key={idx} item={item} />)}
              </div>
          </section>
        )}

        {/* CARD 3: KELOMPOK JABATAN FUNGSIONAL */}
        {(admin.length > 0 || meteo.length > 0 || klimato.length > 0 || teknisi.length > 0) && (
          <section className="w-full space-y-8 pt-8">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3 w-full">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Kelompok Jabatan Fungsional</h2>
              </div>

              {/* Sub 1: Administrasi */}
              {admin.length > 0 && (
                <div className="bg-slate-50/50 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="flex items-center gap-2 font-bold text-slate-700 uppercase tracking-widest text-sm mb-6">
                    <FileText className="w-5 h-5 text-blue-500" /> Administrasi & Tata Usaha
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{admin.map((item, idx) => <PegawaiCard key={idx} item={item} />)}</div>
                </div>
              )}

              {/* Sub 2: Meteorologi */}
              {meteo.length > 0 && (
                <div className="bg-slate-50/50 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="flex items-center gap-2 font-bold text-slate-700 uppercase tracking-widest text-sm mb-6">
                    <CloudRain className="w-5 h-5 text-blue-500" /> Meteorologi Penerbangan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{meteo.map((item, idx) => <PegawaiCard key={idx} item={item} />)}</div>
                </div>
              )}

              {/* Sub 3: Klimatologi */}
              {klimato.length > 0 && (
                <div className="bg-slate-50/50 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="flex items-center gap-2 font-bold text-slate-700 uppercase tracking-widest text-sm mb-6">
                    {/* CATATAN 1: Mengubah ikon sun amber menjadi blue */}
                    <Sun className="w-5 h-5 text-blue-500" /> Klimatologi
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{klimato.map((item, idx) => <PegawaiCard key={idx} item={item} />)}</div>
                </div>
              )}

              {/* Sub 4: Teknisi */}
              {teknisi.length > 0 && (
                <div className="bg-slate-50/50 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="flex items-center gap-2 font-bold text-slate-700 uppercase tracking-widest text-sm mb-6">
                    <Wrench className="w-5 h-5 text-emerald-500" /> Teknisi Instrumentasi
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{teknisi.map((item, idx) => <PegawaiCard key={idx} item={item} />)}</div>
                </div>
              )}
          </section>
        )}

        {/* CARD 4: KELOMPOK PPNPN */}
        {ppnpn.length > 0 && (
          <section className="w-full pt-8">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-3 w-full">
                  <Users className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Kelompok PPNPN</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {ppnpn.map((item, idx) => <PegawaiCard key={idx} item={item} />)}
              </div>
          </section>
        )}

      </div>
    </div>
  );
}