"use client";

import { useState } from "react";
import ClimateViewer from "@/components/component-iklim/ClimateViewer";
import { CloudRain, Calendar, Activity, Percent } from "lucide-react";

// Tipe Data untuk Props 
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

interface PrakiraanTabsProps {
  dataDasarian: ClimateItem[];
  dataBulanan: ClimateItem[];
  dataSifat: ClimateItem[];
  dataProbabilitas: ClimateItem[];
}

export default function PrakiraanTabs({ 
  dataDasarian, 
  dataBulanan, 
  dataSifat, 
  dataProbabilitas 
}: PrakiraanTabsProps) {
  
  // State Tab Aktif (Default: Hujan Dasarian)
  const [activeTab, setActiveTab] = useState<"dasarian" | "bulanan" | "sifat" | "probabilitas">("dasarian");

  // Helper untuk render konten berdasarkan tab
  const renderContent = () => {
    switch (activeTab) {
      case "dasarian":
        return dataDasarian.length > 0 ? (
          <ClimateViewer key="dasarian" data={dataDasarian} />
        ) : <EmptyState msg="Data Prakiraan Hujan Dasarian belum tersedia." />;
      
      case "bulanan":
        return dataBulanan.length > 0 ? (
          <ClimateViewer key="bulanan" data={dataBulanan} />
        ) : <EmptyState msg="Data Prakiraan Hujan Bulanan belum tersedia." />;
      
      case "sifat":
        return dataSifat.length > 0 ? (
          <ClimateViewer key="sifat" data={dataSifat} />
        ) : <EmptyState msg="Data Prakiraan Sifat Hujan belum tersedia." />;
      
      case "probabilitas":
        return dataProbabilitas.length > 0 ? (
          <ClimateViewer key="probabilitas" data={dataProbabilitas} />
        ) : <EmptyState msg="Data Prakiraan Probabilitas belum tersedia." />;
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* AB NAVIGATION */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl border border-gray-200">
        <TabButton 
            isActive={activeTab === "dasarian"} 
            onClick={() => setActiveTab("dasarian")}
            icon={<CloudRain className="w-4 h-4" />}
            label="Hujan Dasarian"
        />
        <TabButton 
            isActive={activeTab === "bulanan"} 
            onClick={() => setActiveTab("bulanan")}
            icon={<Calendar className="w-4 h-4" />}
            label="Hujan Bulanan"
        />
        <TabButton 
            isActive={activeTab === "sifat"} 
            onClick={() => setActiveTab("sifat")}
            icon={<Activity className="w-4 h-4" />}
            label="Sifat Hujan"
        />
        <TabButton 
            isActive={activeTab === "probabilitas"} 
            onClick={() => setActiveTab("probabilitas")}
            icon={<Percent className="w-4 h-4" />}
            label="Probabilitas"
        />
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[500px]">
        {renderContent()}
      </div>

    </div>
  );
}

// Komponen Kecil Tombol Tab
function TabButton({ isActive, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
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

// Komponen Empty State
function EmptyState({ msg }: { msg: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center">
            <p className="text-gray-500 font-medium">{msg}</p>
        </div>
    )
}