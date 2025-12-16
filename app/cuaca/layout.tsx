import CuacaSidebar from "@/components/component-cuaca/Sidebar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function CuacaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-20">
      
      {/* Container Full Width Konsisten */}
      <div className="max-w-[1600px] mx-auto px-0 sm:px-6 lg:px-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
            <div>
                <div className="-mb-4">
                    <Breadcrumbs items={[{ label: "Cuaca" }]} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    Layanan Meteorologi
                </h1>
                <p className="text-gray-500 mt-2 text-sm md:text-base max-w-2xl">
                    Informasi cuaca publik, penerbangan, dan maritim terupdate untuk wilayah Kalimantan Timur dan sekitarnya.
                </p>
            </div>
            
            {/* Info Update */}
            <div className="hidden md:block text-right">
                <span className="block text-xs text-gray-400 uppercase tracking-wider font-bold">Status Data</span>
                <div className="flex items-center justify-end gap-2 mt-1">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-medium text-gray-700">Realtime System</span>
                </div>
            </div>
        </div>

        {/* --- CONTENT WRAPPER --- */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-10 items-start">
          
          {/* Sidebar */}
          <CuacaSidebar />

          {/* Area Konten (Tempat Anda menaruh konten yang sudah ada) */}
          <main className="flex-1 w-full min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-10 min-h-[600px]">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}