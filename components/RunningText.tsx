import { AlertTriangle, CheckCircle2, Waves } from "lucide-react";
import { getPeringatanDiniKaltim } from "@/lib/bmkg/warnings";
import { getMaritimeWarnings } from "@/lib/bmkg/maritim";

export default async function RunningText() {
  const [weatherText, marineWarnings] = await Promise.all([
    getPeringatanDiniKaltim(),
    getMaritimeWarnings()
  ]);
  
  // Cek Kondisi Masing-masing
  const isWeatherSafe = weatherText.includes("Tidak ada peringatan");
  const isMarineSafe = marineWarnings.length === 0;
  
  //  Aman jika keduanya Aman
  const isOverallSafe = isWeatherSafe && isMarineSafe;

  // Susun Pesan Akhir
  let finalText = "";

  if (isOverallSafe) {
    // Jika semua aman, tampilkan pesan default cuaca
    finalText = weatherText;
  } else {
    // Susun pesan bahaya
    const parts = [];
    
    // Masukkan peringatan cuaca (jika ada bahaya)
    if (!isWeatherSafe) parts.push(weatherText);
    
    // Masukkan peringatan maritim (jika ada bahaya)
    if (!isMarineSafe) {
      const marineMsg = `WASPADA MARITIM: ${marineWarnings.join(" • ")}`;
      parts.push(marineMsg);
    }
    
    // Gabungkan dengan pemisah
    finalText = parts.join("  |  ");
  }

  // KONFIGURASI VISUAL
  const styles = isOverallSafe 
    ? {
        // Mode Aman (Biru/Hijau & Tenang)
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
        // Mode Bahaya 
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
          {/* Render Text */}
          <span>{finalText}</span>
          
          {/* Render Duplikat */}
          <span className="opacity-50 mx-4">•</span>
          <span>{finalText}</span>
        </div>
      </div>
    </div>
  );
}