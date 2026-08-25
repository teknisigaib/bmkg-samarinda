"use client";

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { RouteNode } from './RoutePlanner';
import { Ship, Clock, Compass, Download, X, ZoomIn, ZoomOut, ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

interface VoyagePlanPrintProps {
  routeNodes: RouteNode[];
  summary: {
    totalDist: number;
    totalHours: number;
    maxWind: number;
    hazardCount: number;
    cautionCount: number;
    originName: string;
    destName: string;
  };
  departureTime: Date | null;
  speedKnots: number;
  onClose: () => void;
}

export default function VoyagePlanPrint({
  routeNodes,
  summary,
  departureTime,
  speedKnots,
  onClose
}: VoyagePlanPrintProps) {
  const [mounted, setMounted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const docRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const fsElement = (document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement) as HTMLElement | null;

    setPortalTarget(fsElement || document.body);

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!mounted || !portalTarget) return null;

  const arrivalTime = routeNodes[routeNodes.length - 1]?.eta;
  const printDate = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(new Date());

  // GENERATE PDF BERKUALITAS TINGGI DENGAN HTML-TO-IMAGE & JSPDF
  const handleDownloadPDF = async () => {
    if (!docRef.current) return;
    setIsGenerating(true);

    const toastId = toast.loading('Sedang merender & menyusun dokumen PDF...');

    try {
      const element = docRef.current;
      
      // Amankan transform zoom saat capture
      const originalTransform = element.style.transform;
      element.style.transform = 'none';

      // Render elemen ke JPG dengan kualitas tinggi (scale 2 untuk ketajaman teks)
      const dataUrl = await toJpeg(element, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });

      // Kembalikan zoom preview
      element.style.transform = originalTransform;

      // Inisialisasi PDF A4 Portrait
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const margin = 8; // Margin 8mm
      const contentWidth = pdfWidth - (margin * 2);
      
      // Hitung tinggi proporsional dari elemen asli
      const elemRect = element.getBoundingClientRect();
      const contentHeight = (elemRect.height * contentWidth) / elemRect.width;

      if (contentHeight <= pdfHeight - (margin * 2)) {
        // Muat 1 halaman
        pdf.addImage(dataUrl, 'JPEG', margin, margin, contentWidth, contentHeight);
      } else {
        // Multi-page jika melebihi 1 halaman
        let heightLeft = contentHeight;
        let position = margin;

        pdf.addImage(dataUrl, 'JPEG', margin, position, contentWidth, contentHeight);
        heightLeft -= (pdfHeight - (margin * 2));

        while (heightLeft > 0) {
          position = heightLeft - contentHeight + margin;
          pdf.addPage();
          pdf.addImage(dataUrl, 'JPEG', margin, position, contentWidth, contentHeight);
          heightLeft -= (pdfHeight - (margin * 2));
        }
      }

      const cleanOrigin = summary.originName.replace(/\s+/g, '_');
      const cleanDest = summary.destName.replace(/\s+/g, '_');
      const filename = `Dokumen_Cuaca_Mahakam_${cleanOrigin}_ke_${cleanDest}.pdf`;

      pdf.save(filename);

      toast.success('Dokumen PDF berhasil diunduh!', {
        id: toastId,
        description: `File tersimpan sebagai ${filename}`
      });
    } catch (err) {
      console.error("Gagal generate PDF:", err);
      toast.error('Gagal membuat dokumen PDF. Coba kembali.', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] bg-slate-950/85 backdrop-blur-md flex flex-col justify-between items-center p-3 sm:p-6">
      
      {/* 1. TOP ACTION BAR */}
      <div className="w-full max-w-5xl bg-slate-900 text-white px-5 py-3 rounded-2xl border border-slate-800 flex justify-between items-center shadow-2xl shrink-0 mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Ship className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs sm:text-sm tracking-tight text-slate-100">
              Pratinjau Dokumen Cuaca Pelayaran Sungai Mahakam
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">
              Stasiun Meteorologi Kelas II Aji Pangeran Tumenggung Pranoto - Samarinda
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-xl border border-slate-700 mr-2 text-xs">
            <button 
              onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))} 
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
              title="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-bold text-slate-300 w-10 text-center">{zoomLevel}%</span>
            <button 
              onClick={() => setZoomLevel(prev => Math.min(130, prev + 10))} 
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
              title="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Membuat PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh Dokumen PDF</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            title="Tutup Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. SCROLLABLE PREVIEW CONTAINER */}
      <div className="w-full flex-1 overflow-y-auto overflow-x-auto flex justify-center items-start pb-6 scrollbar-thin scrollbar-thumb-slate-700">
        
        {/* LEMBAR DOKUMEN RESMI A4 */}
        <div 
          ref={docRef}
          style={{ 
            transform: `scale(${zoomLevel / 100})`, 
            transformOrigin: 'top center',
            fontFamily: 'poppins'
          }}
          className="bg-white text-slate-900 w-[790px] min-h-[1080px] p-8 shadow-2xl rounded-sm space-y-4 transition-transform duration-150 text-[11px] leading-normal"
        >
          
          {/* KOP SURAT RESMI BMKG */}
          <div className="border-b-[3px] border-double border-black pb-3">
            <div className="flex items-center gap-4">
              <div className="shrink-0">
                <img 
                  src="/logo-bmkg2.png" 
                  alt="Logo BMKG" 
                  className="w-16 h-16 object-contain"
                />
              </div>

              <div className="text-center flex-1 pr-4">
                <h2 className="text-[12px] font-bold tracking-wider text-slate-900 uppercase leading-tight">
                  BADAN METEOROLOGI, KLIMATOLOGI, DAN GEOFISIKA
                </h2>
                <h1 className="text-[13.5px] font-black tracking-tight text-black uppercase mt-0.5 leading-tight">
                  STASIUN METEOROLOGI KELAS II AJI PANGERAN TUMENGGUNG PRANOTO - SAMARINDA
                </h1>
                <p className="text-[9.5px] text-slate-700 font-medium mt-1 leading-tight">
                  Bandara APT Pranoto / Jl. Pipit No. 150, Sungai Pinang, Kota Samarinda, Kalimantan Timur 75119
                </p>
                <p className="text-[9px] text-slate-600 font-medium mt-0.5">
                  Telp: (0541) 741160 | Layanan Informasi: (+62) 853-5061-1416
                </p>
                <p className="text-[9px] text-blue-900 font-semibold">
                  Email: stamet.samarinda@bmkg.go.id | Website: stamet-samarinda.bmkg.go.id
                </p>
              </div>
            </div>
          </div>

          {/* JUDUL DOKUMEN */}
          <div className="text-center space-y-0.5 pt-0.5">
            <h2 className="text-[15px] font-black tracking-tight uppercase text-black underline decoration-2 decoration-blue-900 underline-offset-4">
              DOKUMEN CUACA PELAYARAN SUNGAI MAHAKAM
            </h2>
            <p className="text-[11px] font-bold text-blue-900 tracking-wide">
              Sistem Informasi Cuaca Pelayaran Sungai Mahakam
            </p>
            <div className="flex justify-between items-center text-[9.5px] text-slate-600 pt-1 border-b border-slate-300 pb-1">
              <span><b>No:</b> ............................................................</span>
              <span><b>Waktu Penerbitan:</b> {printDate} WITA</span>
            </div>
          </div>

          {/* PARAMETER PELAYARAN */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="border border-slate-300 border-l-4 border-l-blue-900 rounded-lg p-2.5 bg-slate-50 space-y-1">
              <h3 className="font-black text-slate-900 uppercase tracking-wider text-[10px] border-b border-slate-200 pb-0.5 flex items-center gap-1.5">
                <Compass className="w-3 h-3 text-blue-900" /> I. Profil Rencana Rute
              </h3>
              <div className="grid grid-cols-2 gap-y-0.5 pt-0.5 text-[10.5px]">
                <span className="text-slate-600">Stasiun Asal:</span>
                <span className="font-bold text-black">{summary.originName}</span>
                <span className="text-slate-600">Stasiun Tujuan:</span>
                <span className="font-bold text-black">{summary.destName}</span>
                <span className="text-slate-600">Total Jarak Alur:</span>
                <span className="font-bold text-black">{summary.totalDist.toFixed(1)} km</span>
                <span className="text-slate-600">Kecepatan Kapal:</span>
                <span className="font-bold text-black">{speedKnots} Knots ({(speedKnots * 1.852).toFixed(1)} km/h)</span>
              </div>
            </div>

            <div className="border border-slate-300 border-l-4 border-l-emerald-800 rounded-lg p-2.5 bg-slate-50 space-y-1">
              <h3 className="font-black text-slate-900 uppercase tracking-wider text-[10px] border-b border-slate-200 pb-0.5 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-emerald-800" /> II. Estimasi Waktu & Keselamatan
              </h3>
              <div className="grid grid-cols-2 gap-y-0.5 pt-0.5 text-[10.5px]">
                <span className="text-slate-600">Waktu Tolak (ETD):</span>
                <span className="font-bold text-black">
                  {departureTime ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'short', timeStyle: 'short' }).format(departureTime) : '-'} WITA
                </span>
                <span className="text-slate-600">Estimasi Tiba (ETA):</span>
                <span className="font-bold text-emerald-900">
                  {arrivalTime ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'short', timeStyle: 'short' }).format(arrivalTime) : '-'} WITA
                </span>
                <span className="text-slate-600">Estimasi Durasi:</span>
                <span className="font-bold text-black">{Math.floor(summary.totalHours)}j {Math.round((summary.totalHours % 1) * 60)}m</span>
                <span className="text-slate-600">Indeks Kelayakan:</span>
                <span>
                  {summary.hazardCount > 0 ? (
                    <span className="font-black text-red-800 bg-red-100 px-1.5 py-0.2 rounded border border-red-300 inline-flex items-center gap-1 text-[9px]">
                      <ShieldAlert className="w-2.5 h-2.5 text-red-700" /> RAWAN ({summary.hazardCount} TITIK)
                    </span>
                  ) : (
                    <span className="font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300 inline-flex items-center gap-1 text-[9px]">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-700" /> KONDUSIF / AMAN
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* TABEL WAYPOINTS */}
          <div>
            <h3 className="font-black text-slate-900 uppercase tracking-wider text-[10px] mb-1 flex items-center justify-between">
              <span>III. TABEL PRAKIRAAN CUACA & ANGIN SEPANJANG ALUR SUNGAI</span>
              <span className="text-[9px] font-normal text-slate-500">Total: {routeNodes.length} Waypoints</span>
            </h3>
            <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
              <thead>
                <tr className="bg-slate-800 text-white uppercase text-[9px] font-black border-b border-slate-700">
                  <th className="p-1.5 border-r border-slate-600 text-center w-6">No</th>
                  <th className="p-1.5 border-r border-slate-600">Stasiun Waypoint</th>
                  <th className="p-1.5 border-r border-slate-600 text-center">Jarak (km)</th>
                  <th className="p-1.5 border-r border-slate-600 text-center">ETA (WITA)</th>
                  <th className="p-1.5 border-r border-slate-600">Cuaca</th>
                  <th className="p-1.5 border-r border-slate-600 text-center">Suhu</th>
                  <th className="p-1.5 border-r border-slate-600">Angin</th>
                  <th className="p-1.5 border-r border-slate-600 text-center">Visibilitas</th>
                  <th className="p-1.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {routeNodes.map((node, idx) => {
                  const isDanger = node.status === 'bahaya';
                  const isCaution = node.status === 'waspada';
                  const timeStr = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(node.eta);

                  return (
                    <tr 
                      key={node.station.id} 
                      className={`border-b border-slate-200 ${idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'} ${isDanger ? 'bg-red-50 font-bold' : ''}`}
                    >
                      <td className="p-1.5 border-r border-slate-200 text-center text-slate-500">{idx + 1}</td>
                      <td className="p-1.5 border-r border-slate-200 font-bold text-slate-900">
                        {node.station.name}
                        {idx === 0 && <span className="ml-1 text-[8px] text-blue-900 font-black">[ASAL]</span>}
                        {idx === routeNodes.length - 1 && <span className="ml-1 text-[8px] text-emerald-900 font-black">[TUJUAN]</span>}
                      </td>
                      <td className="p-1.5 border-r border-slate-200 text-center">
                        {node.distanceKm.toFixed(1)}
                      </td>
                      <td className="p-1.5 border-r border-slate-200 text-center font-bold text-black">
                        {timeStr}
                      </td>
                      <td className="p-1.5 border-r border-slate-200 text-slate-800">
                        {node.forecast.condition || '-'}
                      </td>
                      <td className="p-1.5 border-r border-slate-200 text-center">
                        {node.forecast.temp || '-'}°C
                      </td>
                      <td className="p-1.5 border-r border-slate-200 text-slate-800">
                        {node.forecast.windSpeed || 0} km/h ({node.forecast.windDeg || 0}°)
                      </td>
                      <td className="p-1.5 border-r border-slate-200 text-center text-slate-700">
                        {node.forecast.visibility_text || '>10 km'}
                      </td>
                      <td className="p-1.5 text-center font-black text-[9px]">
                        {isDanger ? (
                          <span className="text-red-700">BAHAYA</span>
                        ) : isCaution ? (
                          <span className="text-amber-700">WASPADA</span>
                        ) : (
                          <span className="text-emerald-700">AMAN</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* CATATAN KESELAMATAN */}
          <div className="border border-slate-300 rounded-lg p-2 bg-slate-50 text-[9px] space-y-0.5 text-slate-700 leading-tight">
            <h4 className="font-black text-slate-900 uppercase">IV. CATATAN KESELAMATAN & DISKLAIMER MARITIM:</h4>
            <ol className="list-decimal pl-4 space-y-0.2">
              <li>Prakiraan cuaca disusun berdasarkan model numerik BMKG dan dapat berubah sewaktu-waktu sesuai dinamika atmosfer lokal Kalimantan Timur.</li>
              <li>Nakhoda/Master Kapal dan Perwira Jaga wajib memantau visual cuaca aktual, tinggi pasang surut alur sungai, serta radio navigasi maritim VHF Saluran 16.</li>
              <li>Apabila visibilitas menurun di bawah 4 km akibat hujan lebat atau kabut asap, nakhoda diimbau mengurangi laju kapal serta menyalakan lampu navigasi dan isyarat kabut.</li>
            </ol>
          </div>

          {/* KOLOM TANDA TANGAN */}
          <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-300 text-center text-[10px]">
            <div>
              <p className="font-semibold text-slate-600">Diverifikasi Oleh,</p>
              <p className="font-bold text-slate-900 mt-0.5">Forecaster</p>
              <div className="h-10 flex items-end justify-center">
                <span className="text-slate-400">( .................................................. )</span>
              </div>
            </div>
            <div>
              <p className="font-semibold text-slate-600">Diterima & Diketahui Oleh,</p>
              <p className="font-bold text-slate-900 mt-0.5">Nakhoda Kapal / Master</p>
              <div className="h-10 flex items-end justify-center">
                <span className="text-slate-400">( .................................................. )</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>,
    portalTarget
  );
}