import Link from "next/link";
import { 
  LayoutDashboard, 
  Newspaper, 
  FileText, 
  LogOut, 
  DropletOff, // Icon HTH
  CloudRain,  // Icon Prakiraan
  BarChart3,  // Icon Analisis
  ChevronDown // Icon Panah
} from "lucide-react";
import SignOutButton from "./signout-button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar Fixed */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full overflow-y-auto custom-scrollbar z-50">
        
        {/* Header Logo */}
        <div className="p-6 border-b border-gray-100">
          <span className="text-xl font-bold text-blue-600 flex items-center gap-2">
            BMKG Admin
          </span>
        </div>

        <nav className="p-4 space-y-6">
          
          {/* GRUP 1: MENU UTAMA */}
          <div className="space-y-1">
            <Link href="/admin" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </Link>
            <Link href="/admin/berita" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium">
              <Newspaper className="w-5 h-5" /> Kelola Berita
            </Link>
            <Link href="/admin/publikasi" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium">
              <FileText className="w-5 h-5" /> Kelola Publikasi
            </Link>
          </div>

          {/* GRUP 2: MENU IKLIM (DIPERBAIKI) */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Data Iklim
            </p>
            
            {/* 1. HTH (Link Langsung) */}
            <Link href="/admin/iklim/hth" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium">
                <DropletOff className="w-5 h-5" /> Hari Tanpa Hujan
            </Link>

            {/* 2. PRAKIRAAN (Dropdown) */}
            <details className="group">
                <summary className="flex items-center justify-between p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg cursor-pointer list-none transition-colors font-medium">
                    <div className="flex items-center gap-3">
                        <CloudRain className="w-5 h-5" />
                        <span>Prakiraan Hujan</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                
                {/* Sub Menu */}
                <div className="pl-11 mt-1 space-y-1 border-l-2 border-gray-100 ml-5">
                    <Link href="/admin/iklim/prakiraan-hujan-dasarian" className="block py-2 px-2 text-sm text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-50">
                        Hujan Dasarian
                    </Link>
                    <Link href="/admin/iklim/prakiraan-hujan-bulanan" className="block py-2 px-2 text-sm text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-50">
                        Hujan Bulanan
                    </Link>
                    <Link href="/admin/iklim/prakiraan-sifat-dasarian" className="block py-2 px-2 text-sm text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-50">
                        Sifat Hujan
                    </Link>
                    <Link href="/admin/iklim/prakiraan-probabilitas" className="block py-2 px-2 text-sm text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-50">
                        Probabilitas
                    </Link>
                </div>
            </details>

            {/* 3. ANALISIS (Dropdown) */}
            <details className="group mt-1">
                <summary className="flex items-center justify-between p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg cursor-pointer list-none transition-colors font-medium">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="w-5 h-5" />
                        <span>Analisis Hujan</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                
                <div className="pl-11 mt-1 space-y-1 border-l-2 border-gray-100 ml-5">
                    <Link href="/admin/iklim/analisis-hujan-dasarian" className="block py-2 px-2 text-sm text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-50">
                        Hujan Dasarian
                    </Link>
                    <Link href="/admin/iklim/analisis-hujan-bulanan" className="block py-2 px-2 text-sm text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-50">
                        Hujan Bulanan
                    </Link>
                    <Link href="/admin/iklim/analisis-sifat-bulanan" className="block py-2 px-2 text-sm text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-50">
                        Sifat Hujan Bulanan
                    </Link>
                    <Link href="/admin/iklim/analisis-hari-hujan" className="block py-2 px-2 text-sm text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-50">
                        Hari Hujan Bulanan
                    </Link>
                </div>
            </details>
          </div>

          {/* GRUP 3: AKUN */}
          <div className="pt-4 border-t border-gray-100">
             <SignOutButton />
          </div>

        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 p-8 w-full">
        {children}
      </main>
    </div>
  );
}