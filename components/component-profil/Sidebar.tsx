"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Target, ClipboardList, Users, FileText, ChevronRight } from "lucide-react";

const sidebarItems = [
  { name: "Visi & Misi", href: "/profil/visi-misi", icon: <Target className="w-4 h-4" /> },
  { name: "Tugas & Fungsi", href: "/profil/tugas-fungsi", icon: <ClipboardList className="w-4 h-4" /> },
  { name: "Daftar Pegawai", href: "/profil/daftar-pegawai", icon: <Users className="w-4 h-4" /> },
  { name: "Transparansi Kinerja", href: "/profil/transparansi-kinerja", icon: <FileText className="w-4 h-4" /> },
];

export default function ProfilSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-72 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
        
        {/* Header Sidebar */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-4">
          <span className="text-white font-bold text-sm uppercase tracking-wide">Menu Profil</span>
        </div>

        <nav className="p-2 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden
                  ${isActive 
                    ? "bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-600" // Style Aktif
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900" // Style Tidak Aktif
                  }
                `}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <span className={isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>
                
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "text-blue-600 opacity-100" : "text-gray-300 opacity-0 group-hover:opacity-100"}`} />
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}