"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Route, ArrowDownUp, Play, X, Navigation, AlertTriangle, 
  Cloud, Wind, Eye, ShieldCheck, ShieldAlert, Activity, 
  Compass, Clock, Milestone, ChevronDown, ChevronUp, Info,
  Ship, Calendar, ArrowRight, Gauge, Anchor, Printer, PlayCircle, StopCircle,
  CloudRain, Droplets, Sparkles, Bot, Thermometer, MapPin
} from 'lucide-react';
import { MahakamLocation, getNavigationStatus } from '@/lib/mahakam-data';
import { calculateRiverRoute, getRiverDistance } from '@/lib/routing-engine';
import { toast } from 'sonner';
import VoyagePlanPrint from './VoyagePlanPrint';

export interface RouteNode {
  station: MahakamLocation;
  distanceKm: number;
  legDistanceKm: number;
  legDurationHours: number;
  eta: Date;
  forecast: any;
  status: 'aman' | 'waspada' | 'bahaya';
}

export interface SimulationData {
  speedKmh: number;
  speedKnots: number;
  departureTime: Date;
  totalDistanceKm: number;
}

interface RoutePlannerProps {
  locations: MahakamLocation[];
  engineGeoJson?: any; 
  onClose: () => void;
  onRouteCalculated: (route: RouteNode[] | null, routeGeoJson?: any, simData?: SimulationData | null) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
}

export default function RoutePlanner({ locations, engineGeoJson, onClose, onRouteCalculated, isSimulating, onToggleSimulation }: RoutePlannerProps) {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [rpOrigin, setRpOrigin] = useState('');
  const [rpDest, setRpDest] = useState('');
  const [rpSpeed, setRpSpeed] = useState<number>(10);
  const [timeOffset, setTimeOffset] = useState('0');

  const [activeTab, setActiveTab] = useState<'timeline' | 'peringatan' | 'metrics'>('timeline');
  const [expandedStationId, setExpandedStationId] = useState<string | null>(null);

  const [isCalculating, setIsCalculating] = useState(false);
  const [routeResult, setRouteResult] = useState<RouteNode[] | null>(null);
  const [departureTime, setDepartureTime] = useState<Date | null>(null);

  const [summary, setSummary] = useState({ 
    totalDist: 0, 
    totalHours: 0, 
    maxWind: 0, 
    hazardCount: 0, 
    cautionCount: 0,
    originName: '',
    destName: ''
  });

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);

  const dangerNodes = routeResult?.filter(n => n.status === 'bahaya' || n.status === 'waspada') || [];

  const handleSwap = () => {
    const temp = rpOrigin;
    setRpOrigin(rpDest);
    setRpDest(temp);
  };

  const toggleAccordion = (id: string) => {
    setExpandedStationId(prev => (prev === id ? null : id));
  };

  const calculateRoute = () => {
    if (!rpOrigin || !rpDest) {
      toast.error('Pilih stasiun keberangkatan dan tujuan terlebih dahulu!');
      return;
    }
    if (rpOrigin === rpDest) {
      toast.warning('Stasiun asal dan tujuan tidak boleh sama!');
      return;
    }
    if (rpSpeed <= 0) {
      toast.error('Kecepatan kapal tidak valid!');
      return;
    }
    if (!engineGeoJson) {
      toast.error('Data navigasi peta belum siap, tunggu sebentar.');
      return;
    }

    toast.promise(
      new Promise<string>((resolve, reject) => {
        setIsCalculating(true);
        setAiAnalysis(null);

        setTimeout(() => {
          try {
            const originLoc = locations.find(l => l.id === rpOrigin);
            const destLoc = locations.find(l => l.id === rpDest);
            const originIdx = locations.findIndex(l => l.id === rpOrigin);
            const destIdx = locations.findIndex(l => l.id === rpDest);

            if (originIdx === -1 || destIdx === -1 || !originLoc || !destLoc) {
              throw new Error('Data stasiun tidak ditemukan dalam sistem.');
            }

            const isReverse = originIdx > destIdx;
            const startIndex = Math.min(originIdx, destIdx);
            const endIndex = Math.max(originIdx, destIdx);

            let waypoints = locations.slice(startIndex, endIndex + 1);
            if (isReverse) waypoints.reverse();

            const { slicedRoute, mainLine } = calculateRiverRoute(
                [originLoc.lng, originLoc.lat], 
                [destLoc.lng, destLoc.lat], 
                engineGeoJson
            );

            const speedKmh = rpSpeed * 1.852;
            const startTime = new Date();
            startTime.setHours(startTime.getHours() + parseInt(timeOffset));
            setDepartureTime(startTime);

            let currentDist = 0;
            let maxWindSpeed = 0;
            let hazards = 0;
            let cautions = 0;

            const nodes: RouteNode[] = waypoints.map((wp, idx) => {
              let legDist = 0;
              let legHours = 0;

              if (idx > 0) {
                const prev = waypoints[idx - 1];
                legDist = getRiverDistance([prev.lng, prev.lat], [wp.lng, wp.lat], mainLine);
                legHours = legDist / speedKmh;
                currentDist += legDist;
              }

              const hoursTaken = currentDist / speedKmh;
              const eta = new Date(startTime.getTime() + hoursTaken * 3600000);

              let matchedForecast: any = wp.forecasts?.[0] || {};
              
              let minDiff = Infinity;
              if (wp.forecasts) {
                wp.forecasts.forEach(f => {
                  const safeTimeStr = typeof f.time === 'string' ? f.time.replace(' ', 'T') : f.time;
                  const fTime = new Date(safeTimeStr).getTime();
                  if (!isNaN(fTime)) {
                    const diff = Math.abs(fTime - eta.getTime());
                    if (diff < minDiff) {
                      minDiff = diff;
                      matchedForecast = f;
                    }
                  }
                });
              }

              const wind = matchedForecast.windSpeed || 0;
              const vis = matchedForecast.visibility_val || 99999;
              if (wind > maxWindSpeed) maxWindSpeed = wind;

              const status = getNavigationStatus(matchedForecast.condition || '', wind, vis);

              if (status === 'bahaya') hazards++;
              if (status === 'waspada') cautions++;

              return {
                station: wp,
                distanceKm: currentDist,
                legDistanceKm: legDist,
                legDurationHours: legHours,
                eta,
                forecast: matchedForecast,
                status
              };
            });

            setRouteResult(nodes);
            const firstHazard = nodes.find(n => n.status === 'bahaya');
            setExpandedStationId(firstHazard ? firstHazard.station.id : nodes[0].station.id);

            setSummary({
              totalDist: currentDist,
              totalHours: currentDist / speedKmh,
              maxWind: maxWindSpeed,
              hazardCount: hazards,
              cautionCount: cautions,
              originName: originLoc.name,
              destName: destLoc.name
            });

            onRouteCalculated(nodes, slicedRoute, {
               speedKmh,
               speedKnots: rpSpeed,
               departureTime: startTime,
               totalDistanceKm: currentDist
            });
            
            setIsCalculating(false);

            if (hazards > 0) {
              resolve(`Rute dihitung: Ada ${hazards} peringatan bahaya!`);
            } else {
              resolve('Rute pelayaran berhasil dikalkulasi!');
            }
          } catch (error: any) {
            setIsCalculating(false);
            reject(error);
          }
        }, 500); 
      }),
      {
        loading: 'Menganalisis data cuaca & metocean rute...',
        success: (msg) => msg,
        error: (err) => err.message || 'Gagal menghitung rute pelayaran.'
      }
    );
  };

  const handleReset = () => {
    setRouteResult(null);
    setExpandedStationId(null);
    setDepartureTime(null);
    setAiAnalysis(null);
    onRouteCalculated(null, null, null);
    if (isSimulating) onToggleSimulation();
    toast.info('Parameter rute telah direset.');
  };

  const renderMeteogramTimeline = () => {
    if (!routeResult) return null;

    const ITEM_WIDTH = 75;
    const LABEL_WIDTH = 75;
    const TEMP_HEIGHT = 65;
    const RAIN_HEIGHT = 45;
    const ROW_HEIGHT = 36;
    
    const CHART_WIDTH = routeResult.length * ITEM_WIDTH;

    const maxTemp = Math.max(...routeResult.map(n => n.forecast.temp || 0)) + 1;
    const minTemp = Math.min(...routeResult.map(n => n.forecast.temp || 0)) - 1;
    const maxRain = Math.max(...routeResult.map(n => n.forecast.rain || 0));
    const maxRainScale = maxRain < 5 ? 5 : maxRain + 2;

    const getTempY = (t: number) => TEMP_HEIGHT - 12 - ((t - minTemp) / (maxTemp - minTemp || 1)) * (TEMP_HEIGHT - 24);
    const getRainY = (r: number) => RAIN_HEIGHT - (r / maxRainScale) * (RAIN_HEIGHT - 10);

    let tArea = `M ${ITEM_WIDTH/2},${TEMP_HEIGHT} L ${ITEM_WIDTH/2},${getTempY(routeResult[0].forecast.temp || 0)}`;
    let rArea = `M ${ITEM_WIDTH/2},${RAIN_HEIGHT} L ${ITEM_WIDTH/2},${getRainY(routeResult[0].forecast.rain || 0)}`;
    let rLine = `M ${ITEM_WIDTH/2},${getRainY(routeResult[0].forecast.rain || 0)}`;

    for (let i = 0; i < routeResult.length - 1; i++) {
      const cX = i * ITEM_WIDTH + (ITEM_WIDTH/2);
      const nX = (i+1) * ITEM_WIDTH + (ITEM_WIDTH/2);
      
      const cYt = getTempY(routeResult[i].forecast.temp || 0);
      const nYt = getTempY(routeResult[i+1].forecast.temp || 0);
      const cPXt = (cX + nX) / 2;
      tArea += ` C ${cPXt},${cYt} ${cPXt},${nYt} ${nX},${nYt}`;

      const cYr = getRainY(routeResult[i].forecast.rain || 0);
      const nYr = getRainY(routeResult[i+1].forecast.rain || 0);
      rArea += ` C ${cPXt},${cYr} ${cPXt},${nYr} ${nX},${nYr}`;
      rLine += ` C ${cPXt},${cYr} ${cPXt},${nYr} ${nX},${nYr}`;
    }
    tArea += ` L ${(routeResult.length - 1) * ITEM_WIDTH + (ITEM_WIDTH/2)},${TEMP_HEIGHT} Z`;
    rArea += ` L ${(routeResult.length - 1) * ITEM_WIDTH + (ITEM_WIDTH/2)},${RAIN_HEIGHT} Z`;

    return (
      <div className="bg-white rounded-xl border border-blue-200/60 shadow-[0_4px_20px_-10px_rgba(59,130,246,0.2)] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-4 py-3 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-md shadow-sm">
                 <Calendar className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-[12px] font-extrabold text-slate-800 tracking-tight">Timeline Cuaca Rute</h4>
           </div>
           <span className="text-[9px] font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-md border border-blue-200">Geser ↔</span>
        </div>
        
        <div className="flex w-full relative bg-white pb-1 scrollbar-thin scrollbar-thumb-blue-200 overflow-x-auto">
           
           {/* KOLOM LABEL KIRI */}
           <div style={{ width: `${LABEL_WIDTH}px` }} className="sticky left-0 bg-white z-30 border-r border-blue-100/50 shadow-[2px_0_5px_rgba(0,0,0,0.03)] flex flex-col text-[9px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
              <div className="h-[38px] flex items-center px-2.5 border-b border-blue-100/50 bg-blue-50/50 text-blue-800">Jam ETA</div>
              <div className="h-[36px] flex items-center px-2.5 border-b border-slate-50">Stasiun</div>
              <div className="h-[36px] flex items-center px-2.5 border-b border-slate-50">Kondisi</div>
              <div style={{ height: `${TEMP_HEIGHT}px` }} className="flex flex-col justify-center px-2.5 border-b border-slate-50 gap-0.5">
                <span className="flex items-center gap-1.5 text-blue-600"><Thermometer className="w-3.5 h-3.5"/>Suhu</span>
              </div>
              <div style={{ height: `${RAIN_HEIGHT}px` }} className="flex flex-col justify-center px-2.5 border-b border-slate-50 gap-0.5">
                <span className="flex items-center gap-1.5 text-blue-600"><CloudRain className="w-3.5 h-3.5"/>Hujan</span>
              </div>
              <div style={{ height: `${ROW_HEIGHT}px` }} className="flex items-center gap-1.5 px-2.5 border-b border-slate-50"><Wind className="w-3.5 h-3.5 text-blue-500"/>Angin</div>
              <div style={{ height: `${ROW_HEIGHT}px` }} className="flex items-center gap-1.5 px-2.5 border-b border-slate-50"><Eye className="w-3.5 h-3.5 text-blue-500"/>Visib</div>
           </div>

           {/* KONTEN GRAFIK KANAN */}
           <div style={{ width: `${CHART_WIDTH}px` }} className="flex flex-col relative shrink-0">
              
              {/* Latar Belakang Kolom Berdasarkan Status (Lebih pekat namun tidak merusak teks) */}
              <div className="absolute inset-0 flex pointer-events-none z-0">
                {routeResult.map((n, i) => {
                  let bg = 'bg-transparent';
                  if (n.status === 'bahaya') bg = 'bg-red-200/50';
                  if (n.status === 'waspada') bg = 'bg-amber-200/50';
                  return <div key={i} style={{ width: `${ITEM_WIDTH}px` }} className={`h-full ${bg} border-r border-slate-50/50`}></div>
                })}
              </div>

              {/* ROW 1: ETA & JARAK */}
              <div className="flex h-[38px] border-b border-blue-100/50 bg-blue-50/80 relative z-20">
                {routeResult.map((n, i) => {
                  return (
                  <div key={`eta-${i}`} style={{ width: `${ITEM_WIDTH}px` }} className="flex flex-col items-center justify-center shrink-0">
                     <span className={`text-[11px] font-black tracking-tight text-blue-900`}>
                       {new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(n.eta)}
                     </span>
                     <span className={`text-[8px] font-bold text-blue-500`}>
                       {i === 0 ? 'START' : `+${n.distanceKm.toFixed(0)}km`}
                     </span>
                  </div>
                )})}
              </div>

              {/* ROW 2: NAMA STASIUN */}
              <div className="flex h-[36px] border-b border-slate-50 relative z-20">
                {routeResult.map((n, i) => (
                  <div key={`st-${i}`} style={{ width: `${ITEM_WIDTH}px` }} className="flex items-center justify-center px-1 shrink-0">
                     <span className="text-[9px] font-bold text-slate-700 text-center leading-tight line-clamp-2" title={n.station.name}>
                       {n.station.name.replace('Stasiun Meteorologi', '').replace('Stasiun', '').trim()}
                     </span>
                  </div>
                ))}
              </div>

              {/* ROW 3: IKON CUACA */}
              <div className="flex h-[36px] border-b border-slate-50 relative z-20 items-center">
                {routeResult.map((n, i) => (
                  <div key={`ic-${i}`} style={{ width: `${ITEM_WIDTH}px` }} className="flex items-center justify-center shrink-0">
                     {n.forecast.weatherIcon ? <img src={n.forecast.weatherIcon} alt="w" className="w-6 h-6 object-contain" /> : <Cloud className="w-4 h-4 text-slate-300"/>}
                  </div>
                ))}
              </div>

              {/* ROW 4: SVG SUHU */}
              <div className="relative w-full z-20 border-b border-slate-50" style={{ height: `${TEMP_HEIGHT}px` }}>
                <svg width={CHART_WIDTH} height={TEMP_HEIGHT} className="absolute inset-0 overflow-visible">
                  <defs>
                    <linearGradient id="tempRouteGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path d={tArea} fill="url(#tempRouteGrad)" />
                  {routeResult.map((n, i) => (
                    <text key={`t-${i}`} x={i * ITEM_WIDTH + (ITEM_WIDTH/2)} y={getTempY(n.forecast.temp || 0) - 5} textAnchor="middle" className="text-[10px] font-bold fill-blue-700">
                      {n.forecast.temp || '-'}°
                    </text>
                  ))}
                </svg>
              </div>

              {/* ROW 5: SVG HUJAN */}
              <div className="relative w-full z-20 border-b border-slate-50" style={{ height: `${RAIN_HEIGHT}px` }}>
                <svg width={CHART_WIDTH} height={RAIN_HEIGHT} className="absolute inset-0 overflow-visible">
                  <defs>
                    <linearGradient id="rainRouteGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#cffafe" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={rArea} fill="url(#rainRouteGrad)" />
                  <path d={rLine} fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  {routeResult.map((n, i) => {
                    if (!n.forecast.rain) return null;
                    return (
                      <text key={`r-${i}`} x={i * ITEM_WIDTH + (ITEM_WIDTH/2)} y={getRainY(n.forecast.rain) - 4} textAnchor="middle" className={`text-[9px] fill-cyan-700 font-semibold`}>
                        {n.forecast.rain.toFixed(1)}
                      </text>
                    )
                  })}
                </svg>
              </div>

              {/* ROW 6: ANGIN (SPEED & DIRECTION) */}
              <div className="flex border-b border-slate-50 relative z-20" style={{ height: `${ROW_HEIGHT}px` }}>
                {routeResult.map((n, i) => {
                  return (
                    <div key={`w-${i}`} style={{ width: `${ITEM_WIDTH}px` }} className="flex items-center justify-center shrink-0 gap-1.5">
                       <span className={`text-[10px] font-bold text-slate-700`}>{n.forecast.windSpeed || 0}</span>
                       <Navigation className={`w-2.5 h-2.5 text-blue-500`} style={{ transform: `rotate(${n.forecast.windDeg || 0}deg)` }} />
                    </div>
                  )
                })}
              </div>

              {/* ROW 7: VISIBILITAS */}
              <div className="flex border-b border-slate-50 relative z-20" style={{ height: `${ROW_HEIGHT}px` }}>
                {routeResult.map((n, i) => {
                  return (
                    <div key={`v-${i}`} style={{ width: `${ITEM_WIDTH}px` }} className="flex items-center justify-center shrink-0">
                       <span className={`text-[9px] font-bold border px-1.5 py-0.5 rounded shadow-sm truncate w-[60px] text-center bg-white border-slate-200 text-slate-600`} title={n.forecast.visibility_text}>
                         {n.forecast.visibility_text?.replace(' km', 'k') || '-'}
                       </span>
                    </div>
                  )
                })}
              </div>

           </div>
        </div>
      </div>
    );
  };

  const renderStepperCard = (node: RouteNode, idx: number) => {
    const isExpanded = expandedStationId === node.station.id;
    const timeStr = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(node.eta).replace('.', ':');
    
    // Tarik variabel cuaca dari node
    const { condition, windSpeed, visibility_text } = node.forecast;

    return (
      <div key={`peringatan-${node.station.id}`} className="relative">
        <div 
          className={`bg-white rounded-xl border shadow-xs transition-all overflow-hidden cursor-pointer ${
            node.status === 'bahaya' 
              ? 'border-red-300 bg-red-50/15 hover:border-red-400' 
              : node.status === 'waspada' 
              ? 'border-amber-300 bg-amber-50/15 hover:border-amber-400' 
              : 'border-blue-200/90 hover:border-blue-300'
          }`}
          onClick={() => toggleAccordion(node.station.id)}
        >
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                node.status === 'bahaya' ? 'bg-red-500 ring-4 ring-red-100' :
                node.status === 'waspada' ? 'bg-amber-400 ring-4 ring-amber-100' : 'bg-blue-500 ring-4 ring-blue-100'
              }`} />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-[13px] font-extrabold text-slate-800 tracking-tight">{node.station.name}</h4>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">ETA {timeStr} WITA</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70 text-[11px]">
                {node.forecast.weatherIcon ? (
                  <img src={node.forecast.weatherIcon} alt="icon" className="w-5 h-5 object-contain grayscale opacity-80" />
                ) : (
                  <Cloud className="w-4 h-4 text-slate-400" />
                )}
                <span className="font-extrabold text-slate-700">{node.forecast.temp || '-'}°C</span>
              </div>
              <div className="text-blue-400 hover:text-blue-600 p-0.5 transition-colors">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </div>

          {isExpanded && (
            <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-2.5 animate-in fade-in duration-150">
              
              {/* PESAN STATUS */}
              <div className={`p-2.5 rounded-lg text-[10px] flex items-start gap-2 ${
                node.status === 'bahaya' ? 'bg-red-50 text-red-800 border border-red-200' : 
                'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <b className="block font-bold">
                    {node.status === 'bahaya' ? 'Peringatan Bahaya Navigasi' : 'Perhatian Cuaca Sedang'}
                  </b>
                  <span className="leading-relaxed block mt-0.5">
                    {node.status === 'bahaya' ? 'Kondisi cuaca mencapai ambang batas bahaya untuk pelayaran. Segera lakukan tindakan pencegahan.' :
                     'Cuaca kurang ideal. Harap waspada dan pertahankan kecepatan aman di alur sungai.'}
                  </span>
                </div>
              </div>

              {/* GRID PARAMETER ACTUAL */}
              <div className="grid grid-cols-3 gap-2">
                 <div className="bg-white p-2 rounded border border-slate-200 flex flex-col items-center text-center gap-1 shadow-sm">
                    <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Kondisi</span>
                    <span className="text-[10px] font-black text-slate-800 leading-tight">{condition || '-'}</span>
                 </div>
                 <div className="bg-white p-2 rounded border border-slate-200 flex flex-col items-center text-center gap-1 shadow-sm">
                    <Wind className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Angin</span>
                    <span className="text-[10px] font-black text-slate-800 leading-tight">{windSpeed || 0} km/h</span>
                 </div>
                 <div className="bg-white p-2 rounded border border-slate-200 flex flex-col items-center text-center gap-1 shadow-sm">
                    <Eye className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Visibilitas</span>
                    <span className="text-[10px] font-black text-slate-800 leading-tight">{visibility_text || '-'}</span>
                 </div>
              </div>

            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAIAnalysis = () => {
    if (!routeResult || routeResult.length === 0) return null;

    const { hazardCount, cautionCount } = summary;
    
    let overallStatus = "Aman 🟢";
    let statusColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (hazardCount > 0) {
      overallStatus = "Bahaya 🔴";
      statusColor = "text-red-600 bg-red-50 border-red-200";
    } else if (cautionCount > 0) {
      overallStatus = "Waspada 🟡";
      statusColor = "text-amber-600 bg-amber-50 border-amber-200";
    }

    const fetchRealAI = async () => {
      if (aiAnalysis || isAnalyzingAI) return;
      setIsAnalyzingAI(true);
      try {
        const res = await fetch('/api/voyage-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ summary, routeNodes: routeResult })
        });
        
        if (!res.ok) throw new Error("Gagal mengambil data dari server");
        
        const data = await res.json();
        setAiAnalysis(data.text);
      } catch (error) {
        setAiAnalysis("Gagal terhubung dengan Asisten AI. Periksa koneksi jaringan.");
      } finally {
        setIsAnalyzingAI(false);
      }
    };

    if (activeTab === 'metrics' && !aiAnalysis && !isAnalyzingAI) {
      fetchRealAI();
    }

    return (
      <div className="bg-white rounded-xl border border-blue-200/60 shadow-[0_4px_20px_-10px_rgba(59,130,246,0.2)] overflow-hidden flex flex-col min-h-[220px] max-h-[350px]">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-4 py-3 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-md shadow-sm">
                 <Bot className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-[12px] font-extrabold text-slate-800 tracking-tight">Asisten AI SICASMA</h4>
           </div>
           {isAnalyzingAI ? (
             <span className="text-[10px] font-bold text-blue-500 animate-pulse flex items-center gap-1"><Activity className="w-3 h-3" /> Menganalisa...</span>
           ) : (
             <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shadow-sm ${statusColor}`}>{overallStatus}</span>
           )}
        </div>

        <div className="p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 flex-1 relative">
           {isAnalyzingAI && (
             <div className="space-y-3 w-full animate-pulse">
                <div className="h-2.5 bg-blue-100 rounded-full w-full"></div>
                <div className="h-2.5 bg-blue-100 rounded-full w-5/6"></div>
                <div className="h-2.5 bg-blue-100 rounded-full w-4/6 mb-4"></div>
             </div>
           )}

           {!isAnalyzingAI && aiAnalysis && (
             <div className="text-[11px] leading-relaxed text-slate-700 space-y-3">
               {aiAnalysis.split('\n').map((paragraph, index) => {
                 if (!paragraph.trim()) return null;
                 
                 const isRecommendation = paragraph.toLowerCase().includes('rekomendasi') || paragraph.toLowerCase().includes('saran');
                 
                 if (isRecommendation) {
                   return (
                     <div key={index} className="bg-blue-50/80 p-3 rounded-lg border border-blue-100/80 mt-2">
                       <span className="font-extrabold text-blue-800 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                          <Compass className="w-3.5 h-3.5 text-blue-600" /> Rekomendasi Navigasi
                       </span>
                       <p className="font-medium text-blue-900/80">{paragraph.replace(/rekomendasi|saran|:|;/gi, '').trim()}</p>
                     </div>
                   );
                 }

                 return <p key={index} className="font-medium">{paragraph}</p>;
               })}
             </div>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="absolute top-4 left-4 z-[1500] w-[390px] max-h-[calc(100%-2rem)] bg-slate-50/95 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-200/60 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="bg-white px-4 py-3.5 border-b border-blue-100/80 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-white rounded-lg border border-slate-100 shadow-sm flex items-center justify-center">
            <Image src="/logo-bmkg2.png" alt="BMKG" width={24} height={28} className="object-contain" />
          </div>
          <div>
            <h2 className="font-extrabold text-[14px] text-blue-950 tracking-tight leading-none">Route Planner</h2>
            <span className="text-[10px] text-blue-500 font-medium">Navigasi Cuaca Alur Mahakam</span>
          </div>
        </div>
        <button onClick={() => { handleReset(); onClose(); }} className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-md transition-colors border border-transparent hover:border-blue-100">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 p-4 space-y-4">
        {!routeResult && (
          <div className="bg-white p-4 rounded-xl shadow-xs border border-blue-100 space-y-3.5">
            <div className="relative space-y-3">
              <div>
                <label className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider mb-1 block">Stasiun Asal</label>
                <select className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all hover:border-blue-300" value={rpOrigin} onChange={e => setRpOrigin(e.target.value)}>
                  <option value="">Pilih Keberangkatan...</option>
                  {locations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <button onClick={handleSwap} title="Tukar Arah Rute" className="absolute right-3 top-[3.1rem] z-10 p-1.5 bg-white border border-slate-200 rounded-full shadow-sm text-blue-500 hover:text-blue-700 hover:border-blue-300 transition-all active:scale-95">
                <ArrowDownUp className="w-3.5 h-3.5" />
              </button>
              <div>
                <label className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider mb-1 block">Stasiun Tujuan</label>
                <select className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all hover:border-blue-300" value={rpDest} onChange={e => setRpDest(e.target.value)}>
                  <option value="">Pilih Tujuan...</option>
                  {locations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider mb-1 block">Kecepatan Kapal</label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all hover:border-blue-300">
                  <input type="number" value={rpSpeed} onChange={e => setRpSpeed(Number(e.target.value))} className="w-full bg-transparent p-2 text-xs font-bold text-center outline-none text-slate-800" min="1" />
                  <span className="pr-2.5 text-[9px] font-extrabold text-blue-400 uppercase">Knots</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider mb-1 block">Waktu Tolak</label>
                <select value={timeOffset} onChange={e => setTimeOffset(e.target.value)} className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none cursor-pointer transition-all hover:border-blue-300">
                  <option value="0">Sekarang</option>
                  <option value="1">+ 1 Jam</option>
                  <option value="3">+ 3 Jam</option>
                  <option value="6">+ 6 Jam</option>
                </select>
              </div>
            </div>

            <button onClick={calculateRoute} disabled={isCalculating} className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-lg shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70">
              {isCalculating ? (
                <span className="animate-pulse flex items-center gap-1.5"><Activity className="w-4 h-4 animate-spin" /> Menganalisis Rute...</span>
              ) : (
                <><Play className="w-3.5 h-3.5 fill-white" /> Kalkulasi Rute Pelayaran</>
              )}
            </button>
          </div>
        )}

        {routeResult && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl p-3.5 shadow-sm border border-blue-100 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-[13px] font-extrabold text-slate-800 truncate">{summary.originName}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="text-[13px] font-extrabold text-slate-800 truncate">{summary.destName}</span>
                </div>
                <div className="shrink-0">
                  {summary.hazardCount > 0 ? (
                    <span className="text-[9px] font-extrabold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200 flex items-center gap-1"><ShieldAlert className="w-3 h-3 text-red-500" /> {summary.hazardCount} Peringatan</span>
                  ) : (
                    <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /> Layak Layar</span>
                  )}
                </div>
              </div>

              <div className="bg-blue-50/50 rounded-lg p-2.5 border border-blue-100 flex items-center justify-around text-center">
                <div><span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider block">Jarak</span><span className="text-xs font-extrabold text-slate-800">{summary.totalDist.toFixed(1)} km</span></div>
                <div className="w-px h-6 bg-blue-200/60"></div>
                <div><span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider block">Durasi</span><span className="text-xs font-extrabold text-slate-800">{Math.floor(summary.totalHours)}j {Math.round((summary.totalHours % 1) * 60)}m</span></div>
                <div className="w-px h-6 bg-blue-200/60"></div>
                <div><span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider block">Maks Angin</span><span className="text-xs font-extrabold text-blue-600">{summary.maxWind} km/h</span></div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-0.5 px-1 font-semibold text-slate-500">
                <span className="flex items-center gap-1"><Anchor className="w-3 h-3 text-blue-400" /> Tolak: <b className="text-slate-700 font-bold">{departureTime ? new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(departureTime) : '-'} WITA</b></span>
                <span className="text-blue-300">•</span>
                <span className="flex items-center gap-1"><Ship className="w-3 h-3 text-blue-500" /> Tiba: <b className="text-blue-700 font-bold">{new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(routeResult[routeResult.length - 1].eta)} WITA</b></span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg border border-blue-100/50">
              <button onClick={() => setActiveTab('timeline')} className={`py-1.5 text-[11px] font-bold rounded-md transition-all ${activeTab === 'timeline' ? 'bg-white text-blue-600 shadow-sm border border-blue-200/50' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/50'}`}>Meteogram</button>
              <button onClick={() => setActiveTab('peringatan')} className={`py-1.5 text-[11px] font-bold rounded-md transition-all ${activeTab === 'peringatan' ? 'bg-white text-blue-600 shadow-sm border border-blue-200/50' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/50'}`}>Peringatan ({summary.hazardCount + summary.cautionCount})</button>
              <button onClick={() => setActiveTab('metrics')} className={`py-1.5 text-[11px] font-bold rounded-md transition-all flex justify-center items-center gap-1 ${activeTab === 'metrics' ? 'bg-white text-blue-600 shadow-sm border border-blue-200/50' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/50'}`}><Sparkles className="w-3 h-3"/> AI SICASMA</button>
            </div>

            {activeTab === 'timeline' && renderMeteogramTimeline()}
            
            {activeTab === 'peringatan' && (
              <div className="space-y-2.5">
                {dangerNodes.length === 0 ? (
                  <div className="bg-white border border-emerald-200 rounded-xl p-5 text-center shadow-xs">
                    <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                    <h4 className="text-xs font-extrabold text-emerald-900">Jalur Bebas Peringatan</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Seluruh titik rute berada pada ambang batas aman untuk pelayaran normal.</p>
                  </div>
                ) : (
                  dangerNodes.map((node, idx) => renderStepperCard(node, idx))
                )}
              </div>
            )}

            {activeTab === 'metrics' && renderAIAnalysis()}

            <div className="pt-2 grid grid-cols-2 gap-2">
              <button 
                onClick={onToggleSimulation} 
                className={`col-span-2 py-2.5 text-[11px] font-bold rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 border ${
                  isSimulating 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20 border-red-400' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 border-blue-500'
                }`}
              >
                {isSimulating ? <><StopCircle className="w-4 h-4" /> Hentikan Simulasi Visual</> : <><PlayCircle className="w-4 h-4" /> Putar Animasi Perjalanan</>}
              </button>
              
              <button onClick={() => setIsPrintModalOpen(true)} className="py-2.5 bg-blue-900 hover:bg-blue-950 text-white text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm border border-blue-800">
                <Printer className="w-3.5 h-3.5 text-blue-200" /> PDF Plan
              </button>
              
              <button onClick={handleReset} className="py-2.5 bg-white hover:bg-blue-50 text-blue-700 text-[11px] font-bold rounded-lg transition-colors border border-blue-200 shadow-sm" title="Atur Ulang Parameter">
                Atur Ulang
              </button>
            </div>
          </div>
        )}

      </div>
      {isPrintModalOpen && routeResult && (
        <VoyagePlanPrint
          routeNodes={routeResult}
          summary={summary}
          departureTime={departureTime}
          speedKnots={rpSpeed}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </div>
  );
}