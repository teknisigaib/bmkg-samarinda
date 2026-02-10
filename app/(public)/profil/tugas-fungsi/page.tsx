import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Tugas & Fungsi | BMKG Samarinda",
};

export default function TugasFungsiPage() {
  const tasks = [
    "Pengamatan Meteorologi, Klimatologi, dan Geofisika.",
    "Pengelolaan data dan informasi Meteorologi, Klimatologi, dan Geofisika.",
    "Pelayanan jasa Meteorologi, Klimatologi, dan Geofisika.",
    "Pemeliharaan alat Meteorologi, Klimatologi, dan Geofisika.",
    "Koordinasi dan kerja sama.",
    "Pelaksanaan administrasi dan kerumahtanggaan."
  ];

  return (
    <div className="w- full space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tugas Pokok</h2>
        <p className="text-gray-600 leading-relaxed mb-6">
            Sesuai Peraturan Kepala Badan Meteorologi, Klimatologi dan Geofisika Nomor 9 TAHUN 2014 Tentang Uraian Tugas Stasiun Meteorologi, BAB II Pasal 4 bahwa Stasiun meteorologi merupakan Unit Pelaksana Teknis di lingkungan Badan Meteorologi, Klimatologi, dan Geofisika yang berada dibawah dan bertanggung jawab kepada Kepala Badan Meteorologi, Klimatologi, dan Geofisika. Adapun Tugas Pokok Stasiun Meteorologi seperti termuat dalam Bab II pasal 6 adalah melaksanakan pengamatan, pengelolaan data, pelayanan jasa dan tugas penunjang meliputi pemeliharaan peralatan, kerjasama/koordinasi, administrasi, dan tugas tambahan.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Fungsi</h2>
        <div className="grid gap-4">
            {tasks.map((task, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{task}</span>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
}