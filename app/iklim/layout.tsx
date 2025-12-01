import IklimSidebar from "@/components/component-iklim/Sidebar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function IklimLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
            <div>
                <div className="-mb-4">
                    <Breadcrumbs items={[{ label: "Iklim" }]} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    Layanan Informasi Iklim
                </h1>
                <p className="text-gray-500 mt-2 text-sm md:text-base max-w-2xl">
                    Monitoring dan analisis unsur iklim untuk wilayah Kalimantan Timur.
                </p>
            </div>
            <div className="hidden md:block text-right">
                <span className="block text-xs text-gray-400 uppercase tracking-wider font-bold">Update Berkala</span>
                <span className="text-sm font-medium text-gray-700">Per Dasarian / Bulan</span>
            </div>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-10">
          <IklimSidebar />
          <main className="flex-1 w-full min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}