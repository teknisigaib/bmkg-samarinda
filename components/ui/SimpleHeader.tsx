"use client";

interface SimpleHeaderProps {
  title: string;
  description: string;
  color?: "blue" | "teal" | "emerald" | "orange" | "slate";
}

export default function SimpleHeader({ 
  title, 
  description, 
  color = "blue" 
}: SimpleHeaderProps) {

  const theme = {
    blue: "bg-blue-50 border-blue-100 text-slate-600",
    teal: "bg-teal-50 border-teal-100 text-slate-600",
    emerald: "bg-emerald-50 border-emerald-100 text-slate-600",
    orange: "bg-orange-50 border-orange-100 text-slate-600",
    slate: "bg-slate-50 border-slate-200 text-slate-600",
  }[color];

  return (
    <div className="flex flex-col items-center text-center py-10 px-4">
      
      {/* JUDUL */}
      <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-6">
        {title}
      </h2>
      
      {/*  NARASI */}
      <div className={`
        relative px-6 py-4 md:px-10 md:py-6 rounded-[2rem] 
        border ${theme} max-w-3xl mx-auto
      `}>
        <p className="text-sm md:text-base leading-relaxed font-medium">
          {description}
        </p>
      </div>

    </div>
  );
}