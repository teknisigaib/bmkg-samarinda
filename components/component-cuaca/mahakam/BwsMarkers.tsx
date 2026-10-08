"use client";

import React, { useState, useEffect } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";
import BwsTmaModal from "./BwsTmaModal"; // Sesuaikan path import modal lu

// Tipe data stasiun statis lu (yang ada koordinatnya)
interface Station {
  name: string;
  lat: number;
  lng: number;
}

interface BwsMarkersProps {
  stations: Station[]; // Oper array stasiun BWS lu ke sini
}

export default function BwsMarkers({ stations }: BwsMarkersProps) {
  const [tmaData, setTmaData] = useState<any[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  // Fetch data TMA dari API lokal kita saat peta dimuat
  useEffect(() => {
    const fetchTma = async () => {
      try {
        const res = await fetch("/api/duga-air");
        if (!res.ok) return;
        const json = await res.json();
        
        // Gabungkan semua Wilayah Sungai jadi 1 array biar gampang dicari
        let allStations: any[] = [];
        for (const wsKey in json) {
          allStations = [...allStations, ...json[wsKey]];
        }
        setTmaData(allStations);
      } catch (err) {
        console.error("Gagal memuat data TMA:", err);
      }
    };

    fetchTma();
    // Auto-refresh setiap 5 menit
    const interval = setInterval(fetchTma, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fungsi membuat icon berlabel angka
  const createLabelIcon = (stationName: string) => {
    // Cari data TMA yang cocok dengan nama stasiun
    const matchedData = tmaData.find((d: any) => 
      d.nama?.trim().toLowerCase() === stationName.trim().toLowerCase()
    );

    // Ambil nilai TMA terbaru (prioritas jam 17, lalu 12, lalu 07)
    let latestTma = "-";
    if (matchedData) {
      if (matchedData.tma_17 !== null && matchedData.tma_17 !== undefined) {
        latestTma = matchedData.tma_17;
      } else if (matchedData.tma_12 !== null && matchedData.tma_12 !== undefined) {
        latestTma = matchedData.tma_12;
      } else if (matchedData.tma_07 !== null && matchedData.tma_07 !== undefined) {
        latestTma = matchedData.tma_07;
      }
    }

    return L.divIcon({
      className: "bg-transparent", // Hapus style bawaan
      // Kita buat kotaknya ngepas sama ukuran lingkaran titik (14px)
      html: `
        <div class="relative flex justify-center items-center w-[14px] h-[14px]">
          <!-- Label Angka Melayang di Atas (Absolute) -->
          <div class="absolute bottom-4 bg-white/95 backdrop-blur-sm border border-sky-400 text-sky-700 text-[11px] font-black px-1.5 py-0.5 rounded shadow-md whitespace-nowrap z-50">
            ${latestTma} m
          </div>
          
          <!-- Titik Lingkaran Posisinya Pas di Tengah Container -->
          <div class="w-3.5 h-3.5 bg-sky-500 border-[1.5px] border-white rounded-full shadow-sm z-40"></div>
        </div>
      `,
      iconSize: [14, 14], // Ukuran ngepas lingkaran
      iconAnchor: [7, 7], // Ngunci persis di titik tengah lingkaran (7px, 7px)
    });
  };

  return (
    <>
      {stations.map((station, idx) => (
        <Marker
          key={idx}
          position={[station.lat, station.lng]}
          icon={createLabelIcon(station.name)}
          eventHandlers={{
            click: () => setSelectedStation(station),
          }}
        />
      ))}

      {/* Tampilkan modal jika titik diklik */}
      {selectedStation && (
        <BwsTmaModal 
          station={selectedStation} 
          onClose={() => setSelectedStation(null)} 
        />
      )}
    </>
  );
}