"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Map, ChevronRight } from "lucide-react";

const sidebarItems = [
  { name: "Gempa Bumi Terbaru", href: "/gempa/gempa-terbaru", icon: <Activity className="w-4 h-4" /> },
  { name: "Gempa Bumi Dirasakan", href: "/gempa/gempa-dirasakan", icon: <Map className="w-4 h-4" /> },
];

export default function GempaSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-72 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
        <div className="bg-gradient-to-r from-red-700 to-red-600 px-6 py-4">
          <span className="text-white font-bold text-sm uppercase tracking-wide">Informasi Gempa</span>
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
                    ? "bg-red-50 text-red-700 shadow-sm border-l-4 border-red-600" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <span className={isActive ? "text-red-600" : "text-gray-400 group-hover:text-gray-600"}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "text-red-600 opacity-100" : "text-gray-300 opacity-0 group-hover:opacity-100"}`} />
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}