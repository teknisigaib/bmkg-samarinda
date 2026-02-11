"use client";

import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  accentColor?: string;
}

export default function SectionHeader({ 
  title, 
  description, 
  icon: Icon,
  accentColor = "blue"
}: SectionHeaderProps) {

  const colorVariants: any = {
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    teal: { bg: "bg-teal-50", text: "text-teal-600" },
    orange: { bg: "bg-orange-50", text: "text-orange-600" },
    slate: { bg: "bg-slate-50", text: "text-slate-600" },
  };
  const colors = colorVariants[accentColor] || colorVariants.blue;

  return (
    <div className="flex flex-col items-center text-center space-y-4 my-10 px-4">
    
      {Icon && (
        <div className={`p-3 ${colors.bg} ${colors.text} rounded-2xl shadow-sm inline-flex mb-2`}>
          <Icon className="w-8 h-8" strokeWidth={2} />
        </div>
      )}

      {/* Judul yang */}
      <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
        {title}
      </h2>
      
      {/* Deskripsi  */}
      <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
        {description}
      </p>
    </div>
  );
}