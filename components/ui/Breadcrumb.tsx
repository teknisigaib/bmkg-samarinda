import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string; // href bersifat opsional (jika tidak ada, berarti teks statis/kategori)
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string; // Memungkinkan kita menambah margin/padding kustom dari luar
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm font-medium text-slate-500 ${className}`}>
      {items.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center space-x-2">
            
            {/* LOGIKA RENDER ITEM */}
            {isLast ? (
              // 1. Jika Item Terakhir (Posisi saat ini): Teks tebal & gelap
              <span className="text-slate-900 font-semibold">
                {item.label}
              </span>
            ) : item.href ? (
              // 2. Jika punya Link: Bisa diklik dan hover biru
              <Link
                href={item.href}
                className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
              >
                {/* Otomatis tambahkan ikon Home jika ini adalah item pertama */}
                {isFirst && <Home className="w-4 h-4" />}
                <span className={isFirst ? "hidden sm:inline" : ""}>
                  {item.label}
                </span>
              </Link>
            ) : (
              // 3. Jika teks statis tengah (Kategori, tanpa link)
              <span className="hover:text-slate-700 transition-colors cursor-default">
                {item.label}
              </span>
            )}

            {/* LOGIKA PEMISAH (CHEVRON) */}
            {/* Jangan tampilkan chevron setelah item terakhir */}
            {!isLast && <ChevronRight className="w-4 h-4 text-slate-300" />}
            
          </div>
        );
      })}
    </nav>
  );
}