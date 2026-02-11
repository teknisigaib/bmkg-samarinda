"use client"; // Opsional, tapi aman untuk animasi UI

import { AlertTriangle, CheckCircle2, Waves } from "lucide-react";

interface RunningTextProps {
  weatherText: string;
  marineWarnings: string[];
}

export default function RunningText({ weatherText, marineWarnings }: RunningTextProps) {
  
  // LOGIKA PEMROSESAN DATA
  const isWeatherSafe = weatherText.includes("Tidak ada peringatan") || weatherText.toLowerCase().includes("nihil");
  const isMarineSafe = (!marineWarnings || marineWarnings.length === 0);
  const isOverallSafe = isWeatherSafe && isMarineSafe;

  // Susun Pesan Akhir
  let finalText = "";

  if (isOverallSafe) {
    finalText = weatherText;
  } else {
    const parts = [];
    if (!isWeatherSafe) parts.push(weatherText);
    if (!isMarineSafe) {
      const marineMsg = `WASPADA MARITIM: ${marineWarnings.join(" • ")}`;
      parts.push(marineMsg);
    }
    finalText = parts.join("  |  ");
  }

  // KONFIGURASI VISUAL
  const styles = isOverallSafe 
    ? {
        bg: "bg-green-600",
        border: "border-green-700",
        labelBg: "bg-green-700",
        textColor: "text-white",
        iconColor: "text-green-200",
        Icon: CheckCircle2,
        label: "INFO TERKINI:",
        maskGradient: "from-green-600",
        speed: "25s"
      }
    : {
        bg: "bg-yellow-400",
        border: "border-yellow-500",
        labelBg: "bg-yellow-500",
        textColor: "text-blue-900",
        iconColor: "text-red-600",
        Icon: AlertTriangle, 
        label: "PERINGATAN DINI:",
        maskGradient: "from-yellow-400",
        speed: "45s"
      };

  const DisplayIcon = (!isMarineSafe && isWeatherSafe) ? Waves : styles.Icon;

  return (
    <div className={`${styles.bg} ${styles.border} ${styles.textColor} border-b text-sm font-semibold h-10 overflow-hidden relative flex items-center z-40 shadow-sm transition-colors duration-500`}>
      
      {/* Label Statis (Kiri) */}
      <div className={`absolute left-0 top-0 bottom-0 ${styles.labelBg} px-4 flex items-center gap-2 z-20 shadow-lg md:px-6`}>
        <DisplayIcon className={`w-4 h-4 ${isOverallSafe ? "" : "animate-pulse"} ${styles.iconColor}`} />
        <span className="font-bold uppercase tracking-tight text-xs md:text-sm whitespace-nowrap">
          {styles.label}
        </span>
      </div>
      
      {/* Gradient Masking */}
      <div className={`absolute left-[130px] md:left-[160px] top-0 bottom-0 w-16 bg-gradient-to-r ${styles.maskGradient} to-transparent z-10`}></div>

      {/* Teks Berjalan */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center pl-[150px] md:pl-[180px]">
        <div 
            className="animate-marquee whitespace-nowrap absolute flex items-center gap-8"
            style={{ animationDuration: styles.speed }}
        >
          <span>{finalText}</span>
          <span className="opacity-50 mx-4">•</span>
          <span>{finalText}</span>
        </div>
      </div>
    </div>
  );
}