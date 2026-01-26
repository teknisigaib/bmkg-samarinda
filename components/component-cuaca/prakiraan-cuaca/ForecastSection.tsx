import React from 'react';
import { HourlyForecast, DailyForecast } from '@/lib/types';
import { Sun, Cloud, CloudRain, CloudLightning, Moon } from 'lucide-react';

const getIcon = (name: string, className: string) => {
    switch(name) {
      case 'sun': return <Sun className={className} />;
      case 'cloud-rain': return <CloudRain className={className} />;
      case 'cloud-lightning': return <CloudLightning className={className} />;
      case 'moon': return <Moon className={className} />;
      default: return <Cloud className={className} />;
    }
};

export default function ForecastSection({ hourly, daily }: { hourly: HourlyForecast[], daily: DailyForecast[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 border-t border-slate-200 pt-8">
      
      {/* Hourly */}
      <div className="lg:col-span-7">
        <h3 className="font-bold text-lg text-slate-900 mb-4 px-1">Prakiraan Per Jam</h3>
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between overflow-x-auto gap-4 pb-2 scrollbar-hide">
            {hourly.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 min-w-[4.5rem] p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-default">
                <span className="text-xs text-slate-400 font-semibold">{item.time}</span>
                {getIcon(item.icon, "w-8 h-8 text-slate-700")}
                <span className="text-base font-bold text-slate-900">{item.temp}°</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily */}
      <div className="lg:col-span-5">
        <h3 className="font-bold text-lg text-slate-900 mb-4 px-1">7 Hari Kedepan</h3>
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm space-y-1">
          {daily.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-slate-50 transition-colors cursor-default group">
              <div className="w-20 font-semibold text-sm text-slate-700">{item.day}</div>
              <div className="flex items-center gap-2 flex-1">
                {getIcon(item.icon, "w-5 h-5 text-slate-400 group-hover:text-blue-500")}
                <span className="text-xs text-slate-500 hidden sm:block">{item.condition}</span>
              </div>
              <div className="flex items-center gap-3 w-32 justify-end text-sm">
                <span className="text-slate-400 w-6 text-right">{item.min}°</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                  <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-300 to-amber-300 w-full opacity-80"></div>
                </div>
                <span className="font-bold text-slate-900 w-6 text-right">{item.max}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}