import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Glosarium Perubahan Iklim | BMKG APT Pranoto Samarinda",
  description: "Daftar istilah dan definisi terkait perubahan iklim, proyeksi cuaca, dan meteorologi.",
};

const GLOSSARY_DATA = [
  {
    term: "Climate (Iklim)",
    desc: "Cuaca rata-rata, atau lebih tepatnya, sebagai deskripsi statistik dalam hal rata-rata dan variabilitas kuantitas yang relevan selama periode waktu mulai dari bulan hingga ribuan atau jutaan tahun. Periode klasik untuk merata-ratakan variabel-variabel ini adalah 30 tahun, sebagaimana didefinisikan oleh Organisasi Meteorologi Dunia. Kuantitas yang relevan paling sering adalah variabel permukaan seperti suhu, curah hujan, dan angin. Iklim dalam arti yang lebih luas adalah keadaan, termasuk deskripsi statistik, dari sistem iklim."
  },
  {
    term: "Climate Change (Perubahan Iklim)",
    desc: "Perubahan pada kondisi iklim yang dapat diidentifikasi (misalnya, dengan menggunakan uji statistik) melalui perubahan rata-rata dan/atau variabilitas sifat-sifatnya dan yang berlangsung dalam jangka waktu yang panjang, biasanya puluhan tahun atau lebih. Perubahan iklim dapat terjadi karena proses internal alami atau pemaksaan eksternal seperti modulasi siklus matahari, letusan gunung berapi, dan perubahan antropogenik yang terus-menerus dalam komposisi atmosfer atau penggunaan lahan. UNFCCC membuat perbedaan antara perubahan iklim yang disebabkan oleh aktivitas manusia yang mengubah komposisi atmosfer dan variabilitas iklim yang disebabkan oleh penyebab alami."
  },
  {
    term: "Climate Projection (Proyeksi Iklim)",
    desc: "Respons simulasi sistem iklim terhadap skenario emisi atau konsentrasi gas rumah kaca (GRK) dan aerosol di masa mendatang, dan perubahan penggunaan lahan, yang umumnya diperoleh dengan menggunakan model iklim. Proyeksi iklim dibedakan dari prediksi iklim berdasarkan ketergantungannya pada skenario emisi/konsentrasi/pemaksaan radiasi yang digunakan, yang pada gilirannya didasarkan pada asumsi mengenai, misalnya, perkembangan sosial ekonomi dan teknologi di masa mendatang yang mungkin terwujud atau tidak."
  },
  {
    term: "CMIP (Coupled Model Intercomparison Project)",
    desc: "Aktivitas pemodelan iklim dari World Climate Research Programme (WCRP) yang mengoordinasikan dan mengarsipkan simulasi model iklim berdasarkan masukan model bersama oleh kelompok pemodelan dari seluruh dunia. Set data multimodel CMIP3 mencakup proyeksi menggunakan skenario SRES. Set data CMIP5 mencakup proyeksi menggunakan Representative Concentration Pathways (RCP). Fase CMIP6 melibatkan serangkaian eksperimen model umum serta serangkaian proyek perbandingan model (MIP)."
  },
  {
    term: "Ensemble",
    desc: "Sekelompok simulasi model paralel yang mencirikan kondisi iklim historis, prediksi iklim, atau proyeksi iklim. Variasi hasil di seluruh anggota ensemble dapat memberikan perkiraan ketidakpastian berbasis pemodelan. Ensemble yang dibuat dengan model yang sama tetapi kondisi awal yang berbeda hanya mencirikan ketidakpastian yang terkait dengan variabilitas iklim internal, sedangkan ensemble multimodel mencakup dampak perbedaan model."
  },
  {
    term: "Global Warming (Pemanasan Global)",
    desc: "Peningkatan suhu permukaan rata-rata global (GMST) yang dirata-ratakan selama periode 30 tahun, atau periode 30 tahun yang berpusat pada tahun atau dekade tertentu, dinyatakan relatif terhadap tingkat pra-industri kecuali dinyatakan lain."
  },
  {
    term: "Downscaling",
    desc: "Metode yang memperoleh informasi skala lokal hingga regional (hingga 100 km) dari model skala yang lebih besar atau analisis data. Ada dua metode utama: downscaling dinamis (menggunakan model iklim regional/resolusi tinggi) dan downscaling empiris/statistik (berdasarkan observasi dan hubungan statistik). Kedua metode tersebut dapat digabungkan."
  },
  {
    term: "SSP (Shared Socio-economic Pathway)",
    desc: "Dikembangkan untuk melengkapi Jalur Konsentrasi Representatif (RCP) dengan berbagai tantangan sosial ekonomi untuk adaptasi dan mitigasi. Berdasarkan lima narasi, SSP menggambarkan masa depan sosial ekonomi alternatif tanpa adanya intervensi kebijakan iklim, yang terdiri dari pembangunan berkelanjutan (SSP1), persaingan regional (SSP3), ketidaksetaraan (SSP4), pembangunan berbahan bakar fosil (SSP5), dan pembangunan jalan tengah (SSP2)."
  },
  {
    term: "SSP245",
    desc: "Skenario proyeksi iklim dengan tingkat emisi menengah dimana dunia terus berkembang dengan tren ekonomi dan sosial saat ini. Tidak ada perubahan besar dalam kebijakan iklim, tetapi ada beberapa upaya mitigasi. Beberapa negara menerapkan kebijakan hijau, tetapi pertumbuhan ekonomi dan ketergantungan energi fosil tetap ada."
  },
  {
    term: "SSP585",
    desc: "Skenario proyeksi iklim dengan tingkat emisi tertinggi, dimana Dunia terus berkembang dengan ketergantungan yang sangat tinggi pada bahan bakar fosil. Tidak ada regulasi iklim yang ketat, dan ekonomi berfokus pada pertumbuhan cepat tanpa memperhitungkan dampak lingkungan. Teknologi berkembang pesat, tetapi digunakan untuk meningkatkan konsumsi energi, bukan mitigasi emisi."
  },
  {
    term: "Tren atau Laju Perubahan",
    desc: "Arah umum atau pola jangka panjang dalam data. Misalnya, jika data suhu udara menunjukkan peningkatan rata-rata dari tahun ke tahun, maka kita bisa mengatakan ada tren peningkatan suhu. Tren bisa bersifat positif (peningkatan), negatif (penurunan), atau netral (tidak ada perubahan signifikan). Mengidentifikasi tren penting untuk memahami perubahan iklim dan dampaknya."
  },
  {
    term: "Warming Stripes",
    desc: "Visualisasi data yang diciptakan oleh Professor Ed Hawkins dari University of Reading, Inggris. Visualisasi ini menggambarkan perubahan suhu udara pada suatu lokasi selama periode tertentu dalam bentuk garis-garis berwarna. Setiap garis mewakili satu tahun, biru (dingin) dan merah (hangat). Semakin gelap warnanya, semakin besar anomali suhu dari rata-rata."
  },
  {
    term: "TMm (Mean Temperature)",
    desc: "Rata-rata suhu udara harian dalam suatu periode (bulanan atau tahunan). Dihitung dari rata-rata nilai suhu minimum dan suhu maksimum harian."
  },
  {
    term: "TMn (Minimum Temperature Mean)",
    desc: "Rata-rata dari suhu udara minimum harian (TN) dalam periode tertentu (bulanan atau tahunan)."
  },
  {
    term: "TMx (Maximum Temperature Mean)",
    desc: "Rata-rata dari suhu udara maksimum harian (TX) dalam periode tertentu (bulanan atau tahunan)."
  },
  {
    term: "RX1D (Highest 1-day Precipitation Amount)",
    desc: "Jumlah curah hujan maksimum harian tertinggi yang terjadi dalam satu hari penuh selama periode tertentu (bulanan atau tahunan)."
  },
  {
    term: "PRCPTOT (Annual Total Precipitation on Wet Days)",
    desc: "Total curah hujan tahunan yang dihitung hanya pada hari-hari basah (hari dengan curah hujan ≥1 mm)."
  },
  {
    term: "R95P (Very Wet Days Precipitation)",
    desc: "Total curah hujan tahunan yang berasal dari hari-hari sangat basah, yaitu hari-hari ketika curah hujan harian melebihi ambang batas persentil ke-95 dari basis data historis harian."
  },
  {
    term: "CWD (Consecutive Wet Days)",
    desc: "Jumlah hari basah berturut-turut maksimum dalam suatu periode di mana curah hujan harian selalu ≥1 mm."
  },
  {
    term: "CDD (Consecutive Dry Days)",
    desc: "Jumlah hari kering berturut-turut maksimum dalam suatu periode di mana curah hujan harian selalu <1 mm."
  },
  {
    term: "SDII (Simple Daily Intensity Index)",
    desc: "Indeks intensitas curah hujan harian sederhana. Dihitung dengan membagi total curah hujan tahunan pada hari basah dengan jumlah hari basah dalam tahun tersebut."
  }
];

export default function GlosariumPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 pt-4">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* --- BREADCRUMB --- */}
        <Breadcrumb 
          items={[
            { label: "...", href: "/" },
            { label: "Iklim" },
            { label: "..." },
            { label: "Glosarium" }
          ]} 
        />

        {/* --- HEADER SECTION --- */}
        <section className="relative flex flex-col items-center justify-center text-center mx-auto">
           <h1 className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Glosarium Iklim
           </h1>
           
           <p className="relative z-10 text-sm md:text-base text-slate-500 leading-relaxed font-medium px-4 max-w-2xl">
              Panduan referensi dan definisi istilah-istilah teknis yang digunakan dalam data, analisis, dan proyeksi perubahan iklim BMKG.
           </p>
        </section>

        {/* --- PURE TYPOGRAPHY LIST --- */}
        <div className="relative z-10 pt-8 border-t border-slate-200">
          <div className="space-y-10">
            {GLOSSARY_DATA.map((item, index) => (
              <article key={index} className="flex flex-col">
                <div className="flex items-start gap-3 mb-2">
                  <div className="mt-2.5 w-2 h-2 rounded-full bg-slate-800 shrink-0"></div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                    {item.term}
                  </h3>
                </div>
                <p className="text-slate-700 text-base leading-relaxed text-justify pl-5">
                  {item.desc}
                </p>
              </article>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}