import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SubRegionGridProps {
  title: string;
  regions: {
    id: string;
    name: string;
    temp: number;
    condition: string;
    icon: string;
  }[];
  onRegionClick: (id: string) => void;
}

export default function SubRegionGrid({ title, regions, onRegionClick }: SubRegionGridProps) {
  if (!regions || regions.length === 0) return null;

  return (
    <div className="mt-10">
      {/* Header Section */}
      <h3 className="font-bold text-lg text-slate-900 mb-5 px-1 flex items-center gap-2">
        <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
        {title}
      </h3>
      
      {/* Grid Container */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {regions.map((region) => (
          <button 
             key={region.id}
             onClick={() => onRegionClick(region.id)}
             className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-400 hover:shadow-md transition-all duration-200 text-left group flex flex-col h-full"
          >
             {/* Nama Wilayah */}
             <div className="flex justify-between items-start w-full mb-3">
               <span className="font-bold text-slate-700 text-sm group-hover:text-blue-600 leading-tight line-clamp-2">
                 {region.name}
               </span>
               <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all -mr-1 transform group-hover:translate-x-1" />
             </div>
             
             {/* Data Cuaca & Icon */}
             <div className="flex items-end gap-3 mt-auto">
               <div className="w-10 h-10 flex-shrink-0 bg-slate-50 rounded-full p-1 border border-slate-100 group-hover:bg-white transition-colors">
                 <img 
                   src={region.icon} 
                   alt={region.condition}
                   className="w-full h-full object-contain"
                   loading="lazy"
                 />
               </div>

               <div className="flex flex-col pb-0.5">
                 <div className="text-xl font-extrabold text-slate-900 leading-none">
                    {region.temp}°
                 </div>
                 <div className="text-[10px] font-medium text-slate-400 mt-1 truncate max-w-[80px]">
                    {region.condition}
                 </div>
               </div>
             </div>
          </button>
        ))}
      </div>
    </div>
  );
}