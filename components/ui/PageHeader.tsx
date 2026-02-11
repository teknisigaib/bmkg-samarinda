"use client";

import Link from "next/link";
import { ChevronRight, Home, CloudSun, Plane, Anchor, Map as MapIcon } from "lucide-react";

type PageType = 'forecast' | 'aviation' | 'maritime' | 'default';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  type?: PageType;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function PageHeader({ 
  title, 
  subtitle, 
  type = 'default', 
  breadcrumbs = [] 
}: PageHeaderProps) {

  const getConfig = (t: PageType) => {
    switch (t) {
      case 'forecast':
        return { 
          icon: <CloudSun className="w-6 h-6 text-blue-600" />, 
          bg: "bg-blue-50", 
          border: "border-blue-100",
          textAccent: "text-blue-600"
        };
      case 'aviation':
        return { 
          icon: <Plane className="w-6 h-6 text-sky-600" />, 
          bg: "bg-sky-50", 
          border: "border-sky-100",
          textAccent: "text-sky-600"
        };
      case 'maritime':
        return { 
          icon: <Anchor className="w-6 h-6 text-teal-600" />, 
          bg: "bg-teal-50", 
          border: "border-teal-100",
          textAccent: "text-teal-600"
        };
      default:
        return { 
          icon: <MapIcon className="w-6 h-6 text-slate-600" />, 
          bg: "bg-slate-50", 
          border: "border-slate-100",
          textAccent: "text-slate-600"
        };
    }
  };

  const theme = getConfig(type);

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-8">
        
        {/* BREADCRUMBS*/}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-4 md:mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/" className="hover:text-slate-600 transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
          
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-slate-300" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-slate-600 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className={`cursor-default ${idx === breadcrumbs.length - 1 ? theme.textAccent : ''}`}>
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* JUDUL & IKON */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
          
          {/* Icon Box */}
          <div className={`w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl flex items-center justify-center border shadow-sm ${theme.bg} ${theme.border}`}>
            {theme.icon}
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-3xl">
                {subtitle}
              </p>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}