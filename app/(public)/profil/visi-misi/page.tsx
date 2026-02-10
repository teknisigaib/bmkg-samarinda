import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visi & Misi | BMKG Samarinda",
};

export default function VisiMisiPage() {
  return (
    <div className="space-y-8">
      {/* Visi */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-100">
            Visi
        </h2>
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
            <p className="text-lg text-blue-900 font-medium italic leading-relaxed">
                "Mewujudkan BMKG yang handal, tanggap dan mampu dalam rangka mendukung keselamatan masyarakat serta keberhasilan pembangunan nasional, dan berperan aktif di tingkat internasional."
            </p>
        </div>
      </section>

      {/* Misi */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-100">
            Misi
        </h2>
        <ul className="space-y-4">
            {[
                "Mengamati dan memahami fenomena meteorologi, klimatologi, kualitas udara dan geofisika.",
                "Menyediakan data, informasi dan jasa meteorologi, klimatologi, kualitas udara dan geofisika yang handal dan terpercaya.",
                "Mengkoordinasikan dan memfasilitasi kegiatan di bidang meteorologi, klimatologi, kualitas udara dan geofisika.",
                "Berpartisipasi aktif dalam kegiatan internasional di bidang meteorologi, klimatologi, kualitas udara dan geofisika."
            ].map((misi, index) => (
                <li key={index} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                    </div>
                    <p className="text-gray-600 leading-relaxed mt-1">{misi}</p>
                </li>
            ))}
        </ul>
      </section>
    </div>
  );
}