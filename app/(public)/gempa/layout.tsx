import GempaSidebar from "@/components/component-gempa/Sidebar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function GempaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="w-full md:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
            <div>
                <div className="-mb-4">
                    <Breadcrumbs items={[{ label: "Gempa Bumi" }]} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    Informasi Gempabumi
                </h1>
                <p className="text-gray-500 mt-2 text-sm md:text-base max-w-2xl">
                    Pantauan aktivitas kegempaan terkini dan historis di wilayah Indonesia.
                </p>
            </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-10">
          <GempaSidebar />
          <main className="flex-1 w-full min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}