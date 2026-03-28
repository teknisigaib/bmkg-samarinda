"use client";

import { useState } from "react";
import ClimateViewer from "@/components/component-iklim/ClimateViewer";
import { CloudRain, Calendar, Activity, BarChart2, Percent } from "lucide-react";

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

// Interface Props Diperbarui (Jadi 5 Array)
interface PrakiraanTabsProps {
  dataDasarian: ClimateItem[];
  dataBulanan: ClimateItem[];
  dataSifatDasarian: ClimateItem[];
  dataSifatBulanan: ClimateItem[];
  dataProbabilitas: ClimateItem[];
}

export default function PrakiraanTabs({ 
  dataDasarian, 
  dataBulanan, 
  dataSifatDasarian, 
  dataSifatBulanan,
  dataProbabilitas 
}: PrakiraanTabsProps) {
  
  // State Tab Aktif Ditambah jadi 5
  const [activeTab, setActiveTab] = useState<"dasarian" | "bulanan" | "sifatDasarian" | "sifatBulanan" | "probabilitas">("dasarian");

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
      
      case "sifatDasarian":
        return dataSifatDasarian.length > 0 ? (
          <ClimateViewer key="sifatDasarian" data={dataSifatDasarian} />
        ) : <EmptyState msg="Data Prakiraan Sifat Hujan Dasarian belum tersedia." />;

      case "sifatBulanan":
        return dataSifatBulanan.length > 0 ? (
          <ClimateViewer key="sifatBulanan" data={dataSifatBulanan} />
        ) : <EmptyState msg="Data Prakiraan Sifat Hujan Bulanan belum tersedia." />;
      
      case "probabilitas":
        return dataProbabilitas.length > 0 ? (
          <ClimateViewer key="probabilitas" data={dataProbabilitas} />
        ) : <EmptyState msg="Data Prakiraan Probabilitas Hujan belum tersedia." />;
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* TAB NAVIGATION (Disesuaikan jadi 5 kolom responsif) */}
      <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200">
        <TabButton 
            isActive={activeTab === "dasarian"} 
            onClick={() => setActiveTab("dasarian")}
            icon={<CloudRain className="w-4 h-4 shrink-0" />}
            label="Hujan Dasarian"
            className="col-span-1 lg:flex-1"
        />
        <TabButton 
            isActive={activeTab === "bulanan"} 
            onClick={() => setActiveTab("bulanan")}
            icon={<Calendar className="w-4 h-4 shrink-0" />}
            label="Hujan Bulanan"
            className="col-span-1 lg:flex-1"
        />
        <TabButton 
            isActive={activeTab === "sifatDasarian"} 
            onClick={() => setActiveTab("sifatDasarian")}
            icon={<Activity className="w-4 h-4 shrink-0" />}
            label="Sifat Dasarian"
            className="col-span-1 lg:flex-1"
        />
        <TabButton 
            isActive={activeTab === "sifatBulanan"} 
            onClick={() => setActiveTab("sifatBulanan")}
            icon={<BarChart2 className="w-4 h-4 shrink-0" />}
            label="Sifat Bulanan"
            className="col-span-1 lg:flex-1"
        />
        <TabButton 
            isActive={activeTab === "probabilitas"} 
            onClick={() => setActiveTab("probabilitas")}
            icon={<Percent className="w-4 h-4 shrink-0" />}
            label="Probabilitas"
            className="col-span-2 lg:flex-1" // Di HP, Probabilitas mengambil lebar penuh (2 kolom)
        />
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[500px]">
        {renderContent()}
      </div>

    </div>
  );
}

// Komponen Kecil Tombol Tab Diperbarui
function TabButton({ isActive, onClick, icon, label, className = "" }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center gap-2 px-3 py-3 md:py-2.5 rounded-xl text-[13px] md:text-sm font-bold transition-all duration-200 ${
                isActive 
                ? "bg-white text-green-700 shadow-sm border border-gray-200/60 ring-1 ring-black/5" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
            } ${className}`}
        >
            {icon}
            <span className="whitespace-nowrap">{label}</span>
        </button>
    )
}

// Komponen Empty State
function EmptyState({ msg }: { msg: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-3xl border border-dashed border-gray-300 text-center">
            <CloudRain className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">{msg}</p>
        </div>
    )
}