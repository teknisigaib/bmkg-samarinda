export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import Image from "next/image";
import { Award, Briefcase, Star, Users, Wrench, CloudRain, Sun, FileText } from "lucide-react"; 
import { getPegawai, Pegawai } from "@/lib/data-pegawai";

export const metadata: Metadata = {
  title: "Daftar Pegawai | BMKG Samarinda",
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
  
  // CARD 1: KEPALA STASIUN
  const kepalaStasiun = pegawai.find((p) => p.group === "Pimpinan" && p.is_ketua);

  // Filter sisa pegawai
  const nonKepala = pegawai.filter((p) => !(p.group === "Pimpinan" && p.is_ketua));

  // CARD 2: STRUKTURAL
  const struktural = nonKepala.filter((p) => p.group === "Struktural");

  // CARD 3: FUNGSIONAL
  const fungsional = nonKepala.filter((p) => p.group === "Fungsional");
  
  const admin = sortFungsional(fungsional.filter((p) => p.sub_group === "Administrasi"));
  const meteo = sortFungsional(fungsional.filter((p) => p.sub_group === "Meteorologi"));
  const klimato = sortFungsional(fungsional.filter((p) => p.sub_group === "Klimatologi"));
  const teknisi = sortFungsional(fungsional.filter((p) => p.sub_group === "Teknisi"));

  // CARD 4: PPNPN
  const ppnpn = nonKepala.filter((p) => p.group === "PPNPN"); 

  // --- KOMPONEN KARTU KECIL (Reusable) ---
  const PegawaiCard = ({ item }: { item: Pegawai }) => {
    // Cek apakah dia Ketua Tim di kelompok Fungsional
    const isKetuaTim = item.group === "Fungsional" && item.is_ketua;
    
    return (
      <div className={`w-full bg-white rounded-xl p-5 border ${isKetuaTim ? 'border-blue-300 shadow-md bg-blue-50/30' : 'border-gray-200 hover:shadow-md'} transition-all flex items-start gap-4`}>
          <div className={`relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 shadow-sm ${isKetuaTim ? 'border-blue-400' : 'border-gray-100 bg-gray-100'}`}>
            {item.image ? (
               <Image src={item.image} alt={item.name} fill className="object-cover" />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] font-bold bg-gray-100">NA</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1 truncate">{item.name}</h4>
            
            {/* Tampilan Jabatan */}
            <div className={`text-xs font-medium truncate ${isKetuaTim ? 'text-blue-700' : 'text-blue-600'}`}>
              {isKetuaTim ? (
                <div className="flex items-center gap-1.5 font-bold">
                  <Star className="w-3 h-3 fill-blue-600 text-blue-600" />
                  Ketua Tim 
                  <span className="text-gray-400 font-normal">•</span>
                  <span className="font-normal">{item.position}</span>
                </div>
              ) : (
                item.position
              )}
            </div>

          </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-12">
      
      {/* CARD 1: KEPALA STASIUN */}
      {kepalaStasiun && (
        <section className="w-full">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3 w-full">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <h2 className="text-xl font-bold text-gray-800">Pimpinan Stasiun</h2>
            </div>
            <div className="w-full bg-gradient-to-r from-blue-50 to-white p-6 md:p-8 rounded-2xl border border-blue-100 shadow-sm grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center">
                <div className="relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0 mx-auto md:mx-0 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
                    {kepalaStasiun.image && <Image src={kepalaStasiun.image} alt={kepalaStasiun.name} fill className="object-cover" />}
                </div>
                <div className="space-y-3 text-center md:text-left w-full">
                    <div>
                        <span className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                            Kepala Stasiun
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{kepalaStasiun.name}</h3>
                        <p className="text-sm text-gray-500 mt-2 font-medium">{kepalaStasiun.position}</p>
                    </div>
                </div>
            </div>
        </section>
      )}

      {/* CARD 2: JABATAN STRUKTURAL */}
      {struktural.length > 0 && (
        <section className="w-full">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3 w-full">
                <Award className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Jabatan Struktural</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {struktural.map((item, idx) => <PegawaiCard key={idx} item={item} />)}
            </div>
        </section>
      )}

      {/* CARD 3: KELOMPOK JABATAN FUNGSIONAL */}
      {(admin.length > 0 || meteo.length > 0 || klimato.length > 0 || teknisi.length > 0) && (
        <section className="w-full space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-3 w-full">
                <Briefcase className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Kelompok Jabatan Fungsional</h2>
            </div>

            {/* Sub 1: Administrasi */}
            {admin.length > 0 && (
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <h3 className="flex items-center gap-2 font-bold text-gray-700 mb-4"><FileText className="w-5 h-5" /> Administrasi & TU</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{admin.map((item, idx) => <PegawaiCard key={idx} item={item} />)}</div>
              </div>
            )}

            {/* Sub 2: Meteorologi */}
            {meteo.length > 0 && (
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <h3 className="flex items-center gap-2 font-bold text-gray-700 mb-4"><CloudRain className="w-5 h-5" /> Meteorologi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{meteo.map((item, idx) => <PegawaiCard key={idx} item={item} />)}</div>
              </div>
            )}

            {/* Sub 3: Klimatologi */}
            {klimato.length > 0 && (
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <h3 className="flex items-center gap-2 font-bold text-gray-700 mb-4"><Sun className="w-5 h-5" /> Klimatologi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{klimato.map((item, idx) => <PegawaiCard key={idx} item={item} />)}</div>
              </div>
            )}

            {/* Sub 4: Teknisi */}
            {teknisi.length > 0 && (
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <h3 className="flex items-center gap-2 font-bold text-gray-700 mb-4"><Wrench className="w-5 h-5" /> Teknisi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{teknisi.map((item, idx) => <PegawaiCard key={idx} item={item} />)}</div>
              </div>
            )}
        </section>
      )}

      {/* CARD 4: KELOMPOK PPNPN */}
      {ppnpn.length > 0 && (
        <section className="w-full">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3 w-full">
                <Users className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-800">Kelompok PPNPN</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
              {ppnpn.map((item, idx) => <PegawaiCard key={idx} item={item} />)}
            </div>
        </section>
      )}

    </div>
  );
}