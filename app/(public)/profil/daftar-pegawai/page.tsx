export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import Image from "next/image";
import { Award, Briefcase, Star } from "lucide-react";
import { getPegawai } from "@/lib/data-pegawai";

export const metadata: Metadata = {
  title: "Daftar Pegawai | BMKG Samarinda",
};

export default async function DaftarPegawaiPage() {
  
  // 1. Fetch Data
  const pegawai = await getPegawai();

  // 2. Filter Data
  const pimpinan = pegawai.filter((p) => p.group === "Pimpinan");
  const struktural = pegawai.filter((p) => p.group === "Struktural");
  const fungsional = pegawai.filter((p) => p.group === "Fungsional");

  return (
    <div className="w-full space-y-12">
      
      {/* 1. KEPALA STASIUN */}
      {pimpinan.length > 0 && (
        <section className="w-full">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3 w-full">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <h2 className="text-xl font-bold text-gray-800">Pimpinan Stasiun</h2>
            </div>

            <div className="grid grid-cols-1 w-full gap-6">
                {pimpinan.map((item, idx) => (
                <div key={idx} className="w-full bg-gradient-to-r from-blue-50 to-white p-6 md:p-8 rounded-2xl border border-blue-100 shadow-sm grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center">
                    <div className="relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0 mx-auto md:mx-0 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="space-y-3 text-center md:text-left w-full">
                        <div>
                            <span className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                                {item.position}
                            </span>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{item.name}</h3>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </section>
      )}

      {/* 2. STRUKTURAL */}
      {struktural.length > 0 && (
        <section className="w-full">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3 w-full">
                <Award className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Pejabat Struktural</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {struktural.map((item, idx) => (
                <div key={idx} className="w-full bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all flex items-start gap-4">
                   <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 shadow-sm">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1 truncate">{item.name}</h4>
                      <p className="text-xs text-blue-600 font-medium mb-2 truncate">{item.position}</p>
                   </div>
                </div>
              ))}
            </div>
        </section>
      )}

      {/* 3. KELOMPOK FUNGSIONAL */}
      {fungsional.length > 0 && (
        <section className="w-full">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3 w-full">
                <Briefcase className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Kelompok Jabatan Fungsional</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
              {fungsional.map((item, idx) => (
                <div key={idx} className="w-full bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all flex items-start gap-4">
                   <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 shadow-sm">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1 truncate">{item.name}</h4>
                      <p className="text-xs text-blue-600 font-medium mb-2 truncate">{item.position}</p>
                   </div>
                </div>
              ))}
            </div>
        </section>
      )}

    </div>
  );
}