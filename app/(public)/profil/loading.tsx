export default function MapLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 animate-fade-in">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* 1. KIRI ATAS: BREADCRUMB */}
        <div className="flex items-center justify-start gap-2 mb-10 md:mb-14">
          <div className="h-4 w-16 bg-slate-200 animate-pulse rounded-md"></div>
          <div className="h-3 w-3 bg-slate-200 animate-pulse rounded-full"></div>
          <div className="h-4 w-20 bg-slate-200 animate-pulse rounded-md"></div>
          <div className="h-3 w-3 bg-slate-200 animate-pulse rounded-full"></div>
          <div className="h-4 w-28 bg-slate-200 animate-pulse rounded-md"></div>
        </div>

        {/* 2. TENGAH BAWAH: JUDUL HEADER HALAMAN */}
        <div className="flex flex-col items-center justify-center text-center mb-6 relative">
          {/* Efek Blur Glow di belakang judul (opsional biar elegan) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="h-10 md:h-12 w-64 md:w-96 bg-slate-200 animate-pulse rounded-2xl mb-4 relative z-10"></div>
          <div className="h-5 w-48 md:w-72 bg-slate-200 animate-pulse rounded-xl relative z-10"></div>
        </div>

        {/* 3. SEGMEN PIL INFORMASI KECIL (DI BAWAH JUDUL) */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 relative z-10">
          <div className="h-8 w-24 bg-slate-200 animate-pulse rounded-full"></div>
          <div className="h-8 w-32 bg-slate-200 animate-pulse rounded-full"></div>
          <div className="h-8 w-20 bg-slate-200 animate-pulse rounded-full"></div>
          <div className="h-8 w-28 bg-slate-200 animate-pulse rounded-full hidden sm:block"></div>
        </div>

        {/* 4. FULL PETA KOTAK BESAR */}
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm">
          {/* Inner Map Skeleton */}
          <div className="w-full h-[450px] md:h-[650px] lg:h-[750px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center border border-slate-200/60">
             {/* Ikon loading di tengah peta (opsional, biar gak terlalu kosong) */}
             <div className="w-16 h-16 bg-slate-200 rounded-full animate-pulse opacity-50"></div>
          </div>
        </div>

      </div>
    </div>
  );
}