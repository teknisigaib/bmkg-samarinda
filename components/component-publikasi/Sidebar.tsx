"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Newspaper, Book, FileText, ChevronRight } from "lucide-react";

const sidebarItems = [
  { name: "Berita & Kegiatan", href: "/publikasi/berita-kegiatan", icon: <Newspaper className="w-4 h-4" /> },
  { name: "Buletin", href: "/publikasi/buletin", icon: <Book className="w-4 h-4" /> },
  { name: "Artikel & Makalah", href: "/publikasi/artikel", icon: <FileText className="w-4 h-4" /> }, // Route ini gabungan
];

export default function PublikasiSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-60 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
        
        {/* Header Sidebar */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-4">
          <span className="text-white font-bold text-sm uppercase tracking-wide">Menu Publikasi</span>
        </div>

        <nav className="p-2 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden
                  ${isActive 
                    ? "bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-600" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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