import CuacaSidebar from "@/components/component-cuaca/Sidebar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function CuacaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-20">
      
      {/* Container Full Width Konsisten */}
      <div className="max-w-[1700px] mx-auto px-0 sm:px-6 lg:px-8">

        {/* --- CONTENT WRAPPER --- */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-10">
          
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