import PublikasiSidebar from "@/components/component-publikasi/Sidebar"; // Import Sidebar khusus Publikasi
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function PublikasiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20"> {/* pt-10 sesuai request */}
      
      <div className="mw-full md:max-w-[1600px] mx-auto px-0 sm:px-4 lg:px-6">
        
        {/* --- HEADER BARU --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
            
            {/* Bagian Judul */}
            <div>
                {/* Breadcrumbs: Label diganti jadi 'Publikasi' */}
                <div className="-mb-4">
                    <Breadcrumbs 
                        items={[
                            { label: "Publikasi" } 
                        ]} 
                    />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    Publikasi & Informasi
                </h1>
                <p className="text-gray-500 mt-2 text-sm md:text-base max-w-2xl">
                    Pusat informasi terkini meliputi Berita Kegiatan, Arsip Buletin, serta Artikel & Makalah Ilmiah.
                </p>
            </div>
        </div>

        {/* --- LAYOUT UTAMA --- */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-10">
          
          {/* Sidebar Publikasi */}
          <PublikasiSidebar />

          {/* Konten Utama (White Box) */}
          <main className="flex-1 w-full min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}