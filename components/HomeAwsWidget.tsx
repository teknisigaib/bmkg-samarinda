"use client";

import React, { useState, useEffect } from "react";
import AwsWidgetContent from "./AwsWidgetContent";
import { AwsSnapshotData, AwsApiData } from "@/lib/aws-types";
import { transformAwsData } from "@/lib/aws-utils";
import { Loader2 } from "lucide-react";

export default function HomeAwsWidget() {
  const [data, setData] = useState<AwsSnapshotData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/aws-proxy');
      
      if (!response.ok) throw new Error("Gagal mengambil data");
      
      const json: AwsApiData = await response.json();
      const transformed = transformAwsData(json);
      
      setData(transformed);
      setLoading(false);
    } catch (error) {
      console.error("Widget Fetch Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // TAMPILAN LOADING
  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-400 animate-pulse min-h-[180px]">
         <Loader2 className="w-8 h-8 animate-spin text-blue-300" />
         <span className="text-xs font-medium">Memuat Data AWS...</span>
      </div>
    );
  }

  // TAMPILAN ERROR
  if (!data) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-red-400 min-h-[180px]">
        <span className="text-sm font-medium">Data AWS Tidak Tersedia</span>
        <button 
            onClick={fetchData}
            className="mt-2 text-xs bg-red-50 px-3 py-1 rounded-full hover:bg-red-100 transition"
        >
            Coba Lagi
        </button>
      </div>
    );
  }

  return <AwsWidgetContent data={data} />;
}