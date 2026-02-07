"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  CloudSun, 
  AlertTriangle, 
  Plane, 
  Ship, 
  Satellite, 
  Flame, 
  ChevronRight, 
  Waves,
  Radio
} from "lucide-react";

const sidebarItems = [
  { 
    name: "Prakiraan Cuaca", 
    href: "/cuaca/prakiraan", 
    icon: <CloudSun className="w-4 h-4" /> 
  },
  { 
    name: "Peringatan Dini", 
    href: "/cuaca/peringatan-dini", 
    icon: <AlertTriangle className="w-4 h-4" /> 
  },
  { 
    name: "Cuaca Penerbangan", 
    href: "/cuaca/penerbangan", 
    icon: <Plane className="w-4 h-4" /> 
  },
  { 
    name: "Cuaca Maritim", 
    href: "/cuaca/maritim", 
    icon: <Ship className="w-4 h-4" /> 
  },
  { 
    name: "Cuaca Mahakam", 
    href: "/cuaca/mahakam", 
    icon: <Waves className="w-4 h-4" /> 
  },
  { 
    name: "Satelit Cuaca", 
    href: "/cuaca/satelit", 
    icon: <Satellite className="w-4 h-4" /> 
  },
  { 
    name: "Peringatan Karhutla", 
    href: "/cuaca/karhutla", 
    icon: <Flame className="w-4 h-4" /> 
  },
  { 
    name: "Cuaca RealTime", 
    href: "/cuaca/aws", 
    icon: <Radio className="w-4 h-4" /> 
  },
];

export default function CuacaSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-60 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
        {/* Header Sidebar dengan Gradasi Biru Langit */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-600 px-6 py-4">
          <span className="text-white font-bold text-sm uppercase tracking-wide">
            Informasi Cuaca
          </span>
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
                    ? "bg-sky-50 text-sky-700 shadow-sm border-l-4 border-sky-600" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <span className={isActive ? "text-sky-600" : "text-gray-400 group-hover:text-gray-600"}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "text-sky-600 opacity-100" : "text-gray-300 opacity-0 group-hover:opacity-100"}`} />
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}