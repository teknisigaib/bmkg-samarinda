import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      
      {/* --- SECTION 1: HERO & FLOATING CARD --- */}
      <section className="relative bg-slate-100 pb-32">
        {/* Simulasi Background Biru Hero */}
        <div className="bg-slate-200 h-[500px] w-full relative overflow-hidden">
            <div className="container mx-auto px-4 pt-20 space-y-6">
                <Skeleton className="h-6 w-48 bg-slate-300" /> {/* Label */}
                <Skeleton className="h-12 w-2/3 bg-slate-300" /> {/* Judul Besar Baris 1 */}
                <Skeleton className="h-12 w-1/2 bg-slate-300" /> {/* Judul Besar Baris 2 */}
                <Skeleton className="h-4 w-1/3 bg-slate-300 mt-4" /> {/* Deskripsi */}
                <Skeleton className="h-10 w-40 rounded-full bg-slate-300 mt-6" /> {/* Tombol */}
            </div>
        </div>

        {/* Simulasi Floating Card (Cuaca Kaltim) */}
        {/* Menggunakan margin negatif agar menumpuk seperti di desain asli */}
        <div className="container mx-auto px-4 -mt-20 relative z-10">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 h-48 flex gap-6 items-center">
                {/* Tab Kiri */}
                <div className="w-1/4 space-y-4 border-r pr-6 border-slate-100">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
                {/* Konten Kanan (Icon Cuaca & Suhu) */}
                <div className="flex-1 flex items-center justify-between px-8">
                     <Skeleton className="h-24 w-24 rounded-full" /> {/* Icon Awan */}
                     <div className="space-y-2">
                        <Skeleton className="h-10 w-32" /> {/* Suhu */}
                        <Skeleton className="h-4 w-20" />
                     </div>
                     <div className="space-y-2">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-24" />
                     </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- SECTION 2: AVIATION / METEOROLOGI PENERBANGAN --- */}
      <section className="container mx-auto px-4 mt-12 mb-16">
        {/* Wrapper abu-abu melengkung besar */}
        <div className="bg-slate-100/50 rounded-[3rem] p-8 md:p-12 space-y-8">
            
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-10 w-96" /> {/* Judul Stasiun */}
                </div>
                <Skeleton className="h-10 w-32 rounded-lg" /> {/* Badge UTC */}
            </div>

            {/* Grid 4 Kotak Kecil (Wind, Visibility, Temp, Pressure) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl h-32 flex flex-col justify-between border border-slate-100">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                ))}
            </div>

            {/* Grid Visual Runway & List Cuaca */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[300px]">
                {/* Runway (Kiri - Lebar 2 kolom) */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-6 flex items-center justify-center">
                    <Skeleton className="h-48 w-48 rounded-full" /> {/* Lingkaran Kompas */}
                </div>
                {/* List Kanan (Kanan - Lebar 1 kolom) */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                </div>
            </div>

            {/* Grid METAR & TAF (Hitam) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-24 w-full rounded-xl bg-slate-800/20" /> {/* Metar Gelap */}
                <Skeleton className="h-24 w-full rounded-xl bg-slate-800/20" /> {/* Taf Gelap */}
            </div>
        </div>
      </section>

      {/* --- SECTION 3: LAYANAN KAMI --- */}
      <section className="container mx-auto px-4 mb-20">
        <div className="mb-8 space-y-2">
             <Skeleton className="h-4 w-32" />
             <Skeleton className="h-10 w-1/2" />
        </div>
        
        {/* Grid 4 Kartu Layanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 h-64 flex flex-col justify-between">
                    <Skeleton className="h-12 w-12 rounded-xl" /> {/* Icon */}
                    <div className="space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                    </div>
                    <Skeleton className="h-4 w-24" /> {/* Link Bawah */}
                </div>
            ))}
        </div>
      </section>

      {/* --- SECTION 4: PUBLIKASI --- */}
      <section className="container mx-auto px-4 mb-20">
         <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-8 w-48" /> {/* Judul */}
            <Skeleton className="h-4 w-24" /> {/* Link Arsip */}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom Kiri (Artikel Besar & List Kecil) */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 flex gap-6">
                    <Skeleton className="w-1/3 h-48 rounded-xl" /> {/* Gambar Artikel */}
                    <div className="flex-1 space-y-4 py-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-2/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-24 mt-4" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                     <div className="bg-white p-4 rounded-xl border border-slate-100 flex gap-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                     </div>
                     <div className="bg-white p-4 rounded-xl border border-slate-100 flex gap-4">
                        <Skeleton className="h-16 w-16 rounded-lg" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                     </div>
                </div>
            </div>

            {/* Kolom Kanan (Buletin) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 h-full flex flex-col items-center text-center space-y-4">
                 <div className="w-full flex justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-16" />
                 </div>
                 <Skeleton className="h-64 w-48 rounded shadow-sm my-4" /> {/* Cover Buletin */}
                 <Skeleton className="h-6 w-32" />
                 <Skeleton className="h-4 w-24" />
                 <Skeleton className="h-10 w-full rounded-lg mt-auto" />
            </div>
         </div>
      </section>

    </main>
  );
}