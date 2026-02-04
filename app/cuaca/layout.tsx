import CuacaSidebar from "@/components/component-cuaca/Sidebar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function CuacaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-20">
      
      {/* Container Full Width Konsisten */}
      <div className="w-full max-w-[1600px] mx-auto px-0 sm:px-4 lg:px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
          <div>
            <div className="-mb-4">
              <Breadcrumbs items={[{ label: "Cuaca" }]} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Layanan Informasi Cuaca
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base max-w-2xl">
              Prakiraan cuaca publik, maritim dan penerbangan untuk wilayah Kalimantan Timur.
            </p>
          </div>
        </div>

        {/* --- CONTENT WRAPPER --- */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-10">
          
        {/* Sidebar */}
        <CuacaSidebar />

        {/* Area Konten */}
        <main className="flex-1 w-full min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 pt-4 p-2 md:p-10 min-h-[600px]">
          {children}
        </main>

      </div>
    </div>
  </div>
);
}