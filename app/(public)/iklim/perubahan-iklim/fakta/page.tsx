import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Fakta Perubahan Iklim | BMKG APT Pranoto Samarinda",
  description: "Fakta, indikator, tren pemanasan global, dan dampaknya terhadap iklim di wilayah Indonesia.",
};

export default function FaktaPerubahanIklimPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 pt-4">
      <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
          items={[
            { label: "...", href: "/" },
            { label: "Iklim" },
            { label: "..."},
            { label: "Fakta Perubahan Iklim" }
          ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mx-auto">
           <h1 className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Fakta Perubahan Iklim
           </h1>
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl">
              Pemanasan global telah menjadi salah satu isu lingkungan yang paling mendesak di abad ke-21.
           </p>
        </section>

        {/* --- PURE TYPOGRAPHY CONTENT --- */}
        <div className="relative z-10 pt-8 border-t border-slate-200">
          <div className="space-y-12">
            
            {/* BAGIAN 1: PENGANTAR GLOBAL */}
            <article className="flex flex-col">
              <div className="flex items-start gap-3 mb-4">
                <div className="mt-2.5 w-2 h-2 rounded-full bg-slate-800 shrink-0"></div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                  Fenomena Pemanasan Global
                </h3>
              </div>
              <div className="space-y-4 text-slate-700 text-base leading-relaxed text-justify pl-0 lg:pl-5">
                <p>
                  Pemanasan global telah menjadi salah satu isu lingkungan yang paling mendesak di abad ke-21. Fenomena ini merujuk pada peningkatan suhu rata-rata permukaan bumi akibat peningkatan konsentrasi gas rumah kaca di atmosfer. Sejak era Revolusi Industri, kegiatan manusia, seperti pembakaran bahan bakar fosil, deforestasi, dan peningkatan aktivitas industri, telah menghasilkan emisi karbon dioksida (CO2), metana, dan gas lainnya yang berperan besar dalam perubahan iklim.
                </p>
                <p>
                  Secara global, data menunjukkan bahwa dekade terakhir merupakan periode terpanas yang pernah tercatat. Organisasi Meteorologi Dunia (WMO) melaporkan bahwa suhu global rata-rata telah meningkat lebih dari 1,3°C sejak era pra-industri, dan tren ini terus berlanjut. Peningkatan suhu ini menyebabkan perubahan drastis pada sistem cuaca global, termasuk peningkatan frekuensi gelombang panas, pengurangan es di kutub, dan kenaikan permukaan laut.
                </p>
              </div>
            </article>

            {/* BAGIAN 2: DAMPAK DI INDONESIA */}
            <article className="flex flex-col">
              <div className="flex items-start gap-3 mb-4">
                <div className="mt-2.5 w-2 h-2 rounded-full bg-slate-800 shrink-0"></div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                  Pengamatan Iklim di Indonesia
                </h3>
              </div>
              <div className="space-y-4 text-slate-700 text-base leading-relaxed text-justify pl-0 lg:pl-5">
                <p>
                  Pengamatan iklim di Indonesia dimulai pertama kali pada tahun 1866 di Jakarta. Kenaikan suhu di Indonesia terus meningkat sejak masa pra-industri seiring dengan perubahan iklim global. Laju dan nilai kenaikan suhu permukaan di Indonesia relatif lebih rendah dibandingkan kenaikan suhu global. Gletser di dekat Puncak Jaya, Papua, Indonesia, yang merupakan gletser tropis terakhir di wilayah Pasifik Barat, baru-baru ini lapisan es mengalami penurunan yang cukup pesat dan laju penipisannya meningkat sebesar 5,4 kali lipat, ditambah dengan peningkatan tajam pada episode El Nino tahun 2015-2016 (Permana dkk, 2019).
                </p>
              </div>
            </article>

            {/* BAGIAN 3: GRAFIK TREN JANGKA PANJANG (PI1.png) */}
            <article className="flex flex-col">
              <div className="flex items-start gap-3 mb-4">
                <div className="mt-2.5 w-2 h-2 rounded-full bg-slate-800 shrink-0"></div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                  Tren Pemanasan Jangka Panjang
                </h3>
              </div>
              
              <div className="mb-6 bg-white rounded-xl border border-slate-200 p-2 overflow-hidden flex justify-center shadow-sm ml-0 lg:ml-5">
                <Image 
                  src="/perubahan-iklim/PI1.png" 
                  alt="Grafik Tren Pemanasan Jangka Panjang" 
                  width={800} 
                  height={400} 
                  className="w-full h-auto object-contain mix-blend-multiply"
                />
              </div>

              <div className="space-y-4 text-slate-700 text-base leading-relaxed text-justify pl-0 lg:pl-5">
                <p>
                  Grafik diatas menunjukkan tren pemanasan jangka panjang yang konsisten, dengan lonjakan anomali suhu yang meningkat tajam sejak rentang 1980-an hingga 2025. Sepanjang tahun 1850 hingga pertengahan abad ke-20, anomali suhu berfluktuasi stabil pada nilai negatif hingga mendekati 0°C, sebelum terus naik hingga menembus angka di atas +1.0°C pada dekade terakhir (2015–2025). Konsistensi pola antara data tingkat global dan regional Indonesia dari seluruh basis data (HadCRUT, GISTEMP, NOAAGlobalTemp, dan Berkeley Earth) menegaskan bahwa akselerasi pemanasan iklim terjadi secara nyata dan selaras di skala global maupun nasional.
                </p>
              </div>
            </article>

            {/* BAGIAN 4: KONDISI TERKINI 2025 (PI2.png) */}
            <article className="flex flex-col">
              <div className="flex items-start gap-3 mb-4">
                <div className="mt-2.5 w-2 h-2 rounded-full bg-slate-800 shrink-0"></div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                  Kondisi Iklim Indonesia 2025
                </h3>
              </div>

              <div className="space-y-4 text-slate-700 text-base leading-relaxed text-justify pl-0 lg:pl-5 mb-6">
                <p>
                  Kondisi iklim Indonesia pada tahun 2025 mengalami tahun terpanas ke-6 sepanjang sejarah sebesar +0,38°C dibandingkan suhu normal tahun 1991-2020.
                </p>
              </div>

              <div className="mb-6 bg-white rounded-xl border border-slate-200 p-2 overflow-hidden flex justify-center shadow-sm ml-0 lg:ml-5">
                <Image 
                  src="/perubahan-iklim/PI2.png" 
                  alt="Grafik Suhu Udara Harian Indonesia" 
                  width={800} 
                  height={400} 
                  className="w-full h-auto object-contain mix-blend-multiply"
                />
              </div>

              <div className="space-y-4 text-slate-700 text-base leading-relaxed text-justify pl-0 lg:pl-5">
                <p>
                  Grafik di atas merupakan grafik suhu udara harian Indonesia selama setahun dari rata-rata nilai suhu udara hasil observasi di seluruh Stasiun BMKG dari periode 1981 s.d 2025. Garis berwarna biru muda hingga merah muda merupakan periode tahun 1981 s.d 2023, sedangkan tahun 2025 adalah garis berwarna merah. Secara umum tahun 2025 merupakan tahun terpanas sepanjang pengamatan, ini ditunjukkan oleh posisi garis merah yang berada di atas rata-rata garis lainnya hampir sepanjang tahun. Berdasarkan data dari 117 stasiun pengamatan BMKG, suhu udara rata-rata periode 1991-2020 di Indonesia sebesar 26.7 °C dan suhu udara rata-rata tahun 2025 sebesar 27.0 °C, sehingga anomali suhu udara rata-rata tahun 2025 sebesar 0.38 °C.
                </p>
              </div>
            </article>

          </div>
        </div>

      </div>
    </div>
  );
}