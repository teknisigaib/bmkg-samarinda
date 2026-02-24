"use client";

import { useState } from "react";
import ClimateViewer from "@/components/component-iklim/ClimateViewer";
import { CloudRain, CalendarDays, Activity, Calendar, AlertCircle } from "lucide-react";

// Tipe Data
type ClimateItem = {
  id: string;
  title: string;
  period: string;
  dasarian: string;
  bulan: string;
  image: string;
  analysis: string;
  isLatest: boolean;
};

interface AnalisisTabsProps {
  hujanDasarian: ClimateItem[];
  hujanBulanan: ClimateItem[];
  sifatBulanan: ClimateItem[];
  hariHujan: ClimateItem[];
}

export default function AnalisisTabs({ 
  hujanDasarian, 
  hujanBulanan, 
  sifatBulanan, 
  hariHujan 
}: AnalisisTabsProps) {
  
  const [activeTab, setActiveTab] = useState<"h_dasarian" | "h_bulanan" | "sifat" | "hari_hujan">("h_dasarian");

  const renderContent = () => {
    switch (activeTab) {
      case "h_dasarian":
        return hujanDasarian.length > 0 
        ? <ClimateViewer key="h_dasarian" data={hujanDasarian} /> // <-- DITAMBAHKAN KEY
        : <EmptyState title="Analisis Hujan Dasarian" />;
      
      case "h_bulanan":
        return hujanBulanan.length > 0 
        ? <ClimateViewer key="h_bulanan" data={hujanBulanan} /> // <-- DITAMBAHKAN KEY
        : <EmptyState title="Analisis Hujan Bulanan" />;
      
      case "sifat":
        return sifatBulanan.length > 0 
        ? <ClimateViewer key="sifat" data={sifatBulanan} /> // <-- DITAMBAHKAN KEY
        : <EmptyState title="Analisis Sifat Hujan" />;
      
      case "hari_hujan":
        return hariHujan.length > 0 
        ? <ClimateViewer key="hari_hujan" data={hariHujan} /> // <-- DITAMBAHKAN KEY
        : <EmptyState title="Analisis Hari Hujan" />;
        
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* TAB NAVIGATION */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 rounded-xl border border-gray-200">
        <TabButton 
            isActive={activeTab === "h_dasarian"} 
            onClick={() => setActiveTab("h_dasarian")}
            icon={<CloudRain className="w-4 h-4" />}
            label="Hujan Dasarian"
        />
        <TabButton 
            isActive={activeTab === "h_bulanan"} 
            onClick={() => setActiveTab("h_bulanan")}
            icon={<CalendarDays className="w-4 h-4" />}
            label="Hujan Bulanan"
        />
        <TabButton 
            isActive={activeTab === "sifat"} 
            onClick={() => setActiveTab("sifat")}
            icon={<Activity className="w-4 h-4" />}
            label="Sifat Hujan"
        />
        <TabButton 
            isActive={activeTab === "hari_hujan"} 
            onClick={() => setActiveTab("hari_hujan")}
            icon={<Calendar className="w-4 h-4" />}
            label="Hari Hujan"
        />
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderContent()}
      </div>

    </div>
  );
}

// Sub Components
function TabButton({ isActive, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                isActive 
                ? "bg-white text-green-700 shadow-sm border border-gray-200" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
            }`}
        >
            {icon}
            <span className="whitespace-nowrap">{label}</span>
        </button>
    )
}

function EmptyState({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <AlertCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Data Tidak Tersedia</h3>
            <p className="text-gray-500 max-w-md mt-1">
                Belum ada data untuk kategori <strong>{title}</strong>.
            </p>
        </div>
    )
}