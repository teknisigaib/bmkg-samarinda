import Link from "next/link";
import LogoutButton from "@/components/component-admin/LogoutButton"; // Pastikan path benar
import { 
  LayoutDashboard, Newspaper, FileText, DropletOff, 
  CloudRain, BarChart3, ChevronDown, CircleAlert, Users, Image as ImageIcon
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | BMKG Samarinda",
  description: "Halaman khusus administrator",
  robots: {
    index: false,
    follow: false,
  },
};


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* SIDEBAR (Fixed Width 256px / 16rem) */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-50 flex flex-col shadow-sm">
        
        {/* Header Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100 bg-white">
          <Link href="/admin" className="flex items-center gap-2 group">
             {/* Ganti src dengan logo asli jika ada */}
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                BMKG
             </div>
             <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition">Admin Panel</span>
                <span className="text-[10px] text-gray-500">APT Pranoto</span>
             </div>
          </Link>
        </div>

        {/* Scrollable Nav Area */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          
          {/* GRUP 1: UTAMA */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu Utama</p>
            <NavItem href="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <NavItem href="/admin/berita" icon={<Newspaper size={18} />} label="Kelola Berita" />
            <NavItem href="/admin/publikasi" icon={<FileText size={18} />} label="Publikasi" />
            <NavItem href="/admin/pegawai" icon={<Users size={18} />} label="Pegawai" />
            <NavItem href="/admin/kinerja" icon={<FileText size={18} />} label="Dok. Kinerja" />
            <NavItem href="/admin/flyer" icon={<ImageIcon size={18} />} label="Flyer Info" />
          </div>

          {/* GRUP 2: IKLIM */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Data Iklim</p>
            
            <NavItem href="/admin/iklim/hth" icon={<DropletOff size={18} />} label="Hari Tanpa Hujan" />
            
            {/* Dropdown Prakiraan */}
            <details className="group">
                <summary className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                        <CloudRain size={18} /> <span>Prakiraan</span>
                    </div>
                    <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
                </summary>
                <div className="pl-9 mt-1 space-y-1 border-l-2 border-gray-100 ml-4">
                    <SubItem href="/admin/iklim/prakiraan-hujan-dasarian" label="Hujan Dasarian" />
                    <SubItem href="/admin/iklim/prakiraan-hujan-bulanan" label="Hujan Bulanan" />
                    <SubItem href="/admin/iklim/prakiraan-sifat-dasarian" label="Sifat Hujan" />
                    <SubItem href="/admin/iklim/prakiraan-probabilitas" label="Probabilitas" />
                </div>
            </details>

            {/* Dropdown Analisis */}
            <details className="group mt-1">
                <summary className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                        <BarChart3 size={18} /> <span>Analisis</span>
                    </div>
                    <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
                </summary>
                <div className="pl-9 mt-1 space-y-1 border-l-2 border-gray-100 ml-4">
                    <SubItem href="/admin/iklim/analisis-hujan-dasarian" label="Hujan Dasarian" />
                    <SubItem href="/admin/iklim/analisis-hujan-bulanan" label="Hujan Bulanan" />
                    <SubItem href="/admin/iklim/analisis-sifat-bulanan" label="Sifat Bulanan" />
                    <SubItem href="/admin/iklim/analisis-hari-hujan" label="Hari Hujan" />
                </div>
            </details>

            <NavItem href="/admin/peringatan-dini" icon={<CircleAlert size={18} />} label="PDIE" />
          </div>

        </nav>

        {/* Footer Sidebar (Logout) */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
           <LogoutButton />
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      {/* ml-64 (margin-left 16rem) memberi ruang untuk sidebar */}
      <main className="flex-1 ml-64 w-full bg-gray-50 min-h-screen">
         <div className="p-8 max-w-6xl mx-auto">
            {children}
         </div>
      </main>

    </div>
  );
}

// --- Helper Components biar kodingan rapi ---

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
       {icon}
       <span>{label}</span>
    </Link>
  );
}

function SubItem({ href, label }: { href: string; label: string }) {
    return (
      <Link href={href} className="block py-1.5 px-2 text-sm text-gray-500 hover:text-blue-600 rounded hover:bg-gray-50 transition-colors">
         {label}
      </Link>
    );
}