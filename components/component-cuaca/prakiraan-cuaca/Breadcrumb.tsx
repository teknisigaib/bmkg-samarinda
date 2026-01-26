// components/Breadcrumb.tsx (Bisa dibuat komponen terpisah)
import { ChevronRight, Home } from 'lucide-react';

export default function LocationBreadcrumb({ items }: { items: { name: string, url: string }[] }) {
  return (
    <nav className="flex items-center text-sm text-slate-500 mb-4 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
      <Home className="w-4 h-4 mr-2 text-slate-400" />
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-1 text-slate-300" />
          <span 
            className={`
              ${index === items.length - 1 
                ? 'font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md' 
                : 'hover:text-slate-800 cursor-pointer transition-colors'}
            `}
          >
            {item.name}
          </span>
        </div>
      ))}
    </nav>
  );
}