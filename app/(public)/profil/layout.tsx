import ProfilSidebar from "@/components/component-profil/Sidebar";
import Breadcrumbs from "@/components/ui/Breadcrumbs"; // <--- 1. Import Component Ini

export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- HEADER BARU --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
            
            {/* Bagian Judul */}
            <div>
                {/* 2. Panggil Component Breadcrumbs di sini */}
                {/* Kita cuma perlu kirim item 'Profil' karena 'Home' sudah otomatis ada di dalam component */}
                <div className="-mb-4"> {/* Sedikit margin negatif agar tidak terlalu jauh dari Judul */}
                    <Breadcrumbs 
                        items={[
                            { label: "Profil" } // Tidak pakai href karena ini sedang aktif (text only)
                        ]} 
                    />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    Profil Stasiun
                </h1>
                <p className="text-gray-500 mt-2 text-sm md:text-base max-w-2xl">
                    Informasi lengkap mengenai Visi Misi, Tugas, dan Struktur Organisasi Stasiun Meteorologi APT Pranoto.
                </p>
            </div>
        </div>

        {/* --- LAYOUT UTAMA --- */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-10">
          
          <ProfilSidebar />

          <main className="flex-1 w-full min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}