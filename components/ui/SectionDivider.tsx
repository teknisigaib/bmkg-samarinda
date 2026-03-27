interface SectionDividerProps {
  title: string;
  className?: string; // Memungkinkan Anda mengatur spasi (margin/padding) dari halaman yang memanggilnya
}

export default function SectionDivider({ title, className = "" }: SectionDividerProps) {
  return (
    <div className={`flex items-center w-full ${className}`}>
      
      {/* Garis Kiri: Tipis, warna abu-abu netral, membentang penuh sesuai sisa ruang */}
      <div className="flex-1 h-px bg-slate-200"></div>
      
      {/* Teks di Tengah: Warna gelap tegas (slate-800), kapital semua, dengan spasi huruf lebar */}
      <h2 className="px-6 text-xs font-bold uppercase tracking-wide text-slate-800">
        {title}
      </h2>
      
      {/* Garis Kanan: Tipis, warna abu-abu netral, membentang penuh sesuai sisa ruang */}
      <div className="flex-1 h-px bg-slate-200"></div>
      
    </div>
  );
}