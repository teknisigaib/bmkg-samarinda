import { getRealtimeWeatherData } from "@/lib/api-cuaca";

export default async function LiveRainfallTicker() {
  // 1. Fetch Data Asli dari API
  const rawData = await getRealtimeWeatherData();

  // 2. Proteksi jika data kosong
  const displayData = rawData && rawData.length > 0 
    ? rawData 
    : [{ station_name: "Data Telemetri Belum Tersedia", rain_total: 0 }];

  // 3. Gandakan array beberapa kali agar tidak putus di monitor layar lebar (Ultrawide)
  const tickerData = [...displayData, ...displayData, ...displayData, ...displayData];

  return (
    <div className="w-full bg-transparent flex items-center overflow-hidden h-12 relative z-30">

      {/* Area Teks Berjalan (Running Text) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          /* Karena digandakan 4 kali, geser sejauh -25% untuk reset animasi mulus */
          100% { transform: translateX(-25%); }
        }
        .animate-ticker {
          display: flex;
          width: max-content;
          animation: ticker-scroll 50s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="animate-ticker pl-32 sm:pl-48 cursor-default">
        {tickerData.map((data, index) => (
          <div 
            key={`${data.station_name}-${index}`} 
            // PERBAIKAN: Tambahkan whitespace-nowrap dan flex-shrink-0 di sini
            className="flex items-center whitespace-nowrap flex-shrink-0"
          >
            <div className="flex items-center gap-1.5 px-6">
              
              <span className="text-slate-800 font-semibold text-sm mr-1">
                {data.station_name}
              </span>
              
              {/* Data Hujan dengan 1 angka desimal */}
              <span className="text-sm font-semibold text-slate-600">
                {(data.rain_total || 0).toFixed(1)} <span className="text-[10px]">mm</span>
              </span>

            </div>
            
            {/* Titik Pemisah Antar Stasiun */}
            <div className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0"></div>
          </div>
        ))}
      </div>

    </div>
  );
}