"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DropletOff, CloudRain, BarChart3, ChevronRight } from "lucide-react";

const sidebarItems = [
  { 
    name: "Hari Tanpa Hujan", 
    href: "/iklim/hari-tanpa-hujan", 
    icon: <DropletOff className="w-4 h-4" /> 
  },
  { 
    name: "Prakiraan Hujan", 
    href: "/iklim/prakiraan-hujan", 
    icon: <CloudRain className="w-4 h-4" /> 
  },
  { 
    name: "Analisis Hujan", 
    href: "/iklim/analisis-hujan", 
    icon: <BarChart3 className="w-4 h-4" /> 
  },
];

export default function IklimSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-72 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
        <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-4">
          <span className="text-white font-bold text-sm uppercase tracking-wide">Informasi Iklim</span>
        </div>
        <nav className="p-2 space-y-1">
          {sidebarItems.map((item) => {
            // Logic Active: Jika URL diawali dengan href menu
            const isActive = pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden
                  ${isActive 
                    ? "bg-green-50 text-green-700 shadow-sm border-l-4 border-green-600" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <span className={isActive ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "text-green-600 opacity-100" : "text-gray-300 opacity-0 group-hover:opacity-100"}`} />
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}