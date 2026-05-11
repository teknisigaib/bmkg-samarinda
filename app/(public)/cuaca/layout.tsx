export default function CuacaLayout({ children }: { children: React.ReactNode }) {
  return (
    // Gunakan bg-slate-50 untuk latar belakang yang sangat lembut dan modern
    <div className="min-h-screen bg-slate-50 pt-8 pb-20">
      
      {/* Container Full Width */}
      <div className="w-full max-w-[1800px] mx-auto px-2 sm:px-6 lg:px-8">

        {/* --- CONTENT WRAPPER --- */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-10">

          {/* Area Konten: "NO CARD" STYLE */}
          <main className="flex-1 w-full min-w-0">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}