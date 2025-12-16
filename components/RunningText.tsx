import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { getPeringatanDiniKaltim } from "@/lib/bmkg/warnings";

export default async function RunningText() {
  const text = await getPeringatanDiniKaltim();
  
  // Cek apakah kondisi Aman
  const isSafe = text.includes("Tidak ada peringatan");

  // KONFIGURASI VISUAL
  const styles = isSafe 
    ? {
        // Mode Aman (Biru & Tenang)
        bg: "bg-green-600",
        border: "border-green-700",
        labelBg: "bg-green-700",
        textColor: "text-white",
        iconColor: "text-green-200",
        Icon: CheckCircle2,
        label: "INFO CUACA:",
        maskGradient: "from-green-600",
        // Speed: 40 detik (Sangat Lambat/Santai)
        speed: "15s" 
      }
    : {
        // Mode Bahaya (Kuning/Merah & Cepat)
        bg: "bg-yellow-400",
        border: "border-yellow-500",
        labelBg: "bg-yellow-500",
        textColor: "text-blue-900",
        iconColor: "text-red-600",
        Icon: AlertTriangle,
        label: "PERINGATAN DINI:",
        maskGradient: "from-yellow-400",
        // Speed: 15 detik (Cepat/Urgent)
        speed: "60s"
      };

  return (
    <div className={`${styles.bg} ${styles.border} ${styles.textColor} border-b text-sm font-semibold h-10 overflow-hidden relative flex items-center z-40 shadow-sm transition-colors duration-500`}>
      
      {/* Label Statis (Kiri) */}
      <div className={`absolute left-0 top-0 bottom-0 ${styles.labelBg} px-4 flex items-center gap-2 z-20 shadow-lg md:px-6`}>
        {/* Icon berkedip hanya jika bahaya */}
        <styles.Icon className={`w-4 h-4 ${isSafe ? "" : "animate-pulse"} ${styles.iconColor}`} />
        <span className="font-bold uppercase tracking-tight text-xs md:text-sm whitespace-nowrap">
          {styles.label}
        </span>
      </div>
      
      {/* Gradient Masking (Agar teks muncul halus dari balik label) */}
      <div className={`absolute left-[130px] md:left-[160px] top-0 bottom-0 w-16 bg-gradient-to-r ${styles.maskGradient} to-transparent z-10`}></div>

      {/* Teks Berjalan */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center pl-[150px] md:pl-[180px]">
        <div 
            className="animate-marquee whitespace-nowrap absolute"
            // DI SINI KUNCINYA: Override durasi animasi lewat inline style
            style={{ animationDuration: styles.speed }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}