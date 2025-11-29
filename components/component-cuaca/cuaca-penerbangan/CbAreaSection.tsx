"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Scan } from "lucide-react"; // 🔍 ikon zoom

const cbTypes = [
  { label: "CB Base", file: "cb_base" },
  { label: "CB Top", file: "cb_top" },
  { label: "CB Extent", file: "cb_extend" },
];

const times = ["00", "06", "12", "18"];

export default function CBAreaSection() {
  const [selectedCbType, setSelectedCbType] = useState(cbTypes[0]);
  const [selectedTime, setSelectedTime] = useState("00");
  const [imageError, setImageError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false); // 🔍 zoom state

  // Link dasar
  const imageUrl = `https://web-aviation.bmkg.go.id/model/area/${selectedCbType.file}_${selectedTime}.png?id=${Date.now()}`;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mt-6 max-w-7xl mx-auto">
      {/* Header + Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Prakiraan Area Cumulonimbus (CB)
        </h2>

        <div className="flex flex-wrap gap-2">
          <select
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
            value={selectedCbType.label}
            onChange={(e) => {
              const selected = cbTypes.find((t) => t.label === e.target.value);
              if (selected) setSelectedCbType(selected);
              setImageError(false);
            }}
          >
            {cbTypes.map((t) => (
              <option key={t.file} value={t.label}>
                {t.label}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
            value={selectedTime}
            onChange={(e) => {
              setSelectedTime(e.target.value);
              setImageError(false);
            }}
          >
            {times.map((t) => (
              <option key={t} value={t}>
                {t}:00 UTC
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gambar dengan animasi */}
      <div className="relative w-full aspect-[4/3] bg-white rounded-xl overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!imageError ? (
            <motion.div
              key={`${selectedCbType.file}-${selectedTime}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Image
                src={imageUrl}
                alt={`CB Area ${selectedCbType.label} ${selectedTime}:00 UTC`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 90vw"
                unoptimized
                onError={() => setImageError(true)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center text-gray-500 text-sm p-4"
            >
              Data untuk waktu ini belum tersedia di server BMKG.<br />
              Coba pilih waktu lain.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tombol Zoom */}
        <button
          onClick={() => setIsZoomed(true)}
          className="absolute bottom-3 right-3 bg-gray-800/40 hover:bg-gray-800/60 text-white p-2 rounded-full transition-all"
          title="Perbesar Gambar"
        >
          <Scan size={20} />
        </button>
      </div>

      {/* Deskripsi */}
      <div className="bg-blue-50 text-gray-700 rounded-xl p-4 mt-4 border border-blue-100">
        <p className="text-sm leading-relaxed">
          <strong>Prakiraan Area Cumulonimbus (CB)</strong> menggambarkan area
          dan karakteristik awan cumulonimbus yang berpotensi menimbulkan
          cuaca signifikan seperti badai petir, turbulensi, dan hujan lebat.
          Informasi mencakup <em>ketinggian dasar</em>, <em>ketinggian puncak</em>,
          serta <em>luas tutupan</em> awan CB yang digunakan pilot dan pengatur lalu lintas udara
          untuk menjaga keselamatan penerbangan.
        </p>
      </div>

      {/* Modal Zoom */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-black rounded-lg overflow-hidden max-w-5xl w-full aspect-[3.9/3]"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <Image
                src={imageUrl}
                alt={`Zoomed ${selectedCbType.label}`}
                fill
                className="object-contain"
                unoptimized
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-3 right-3 bg-red-500 hover:bg-gray-800/70 text-white px-3 py-1.5 rounded-md text-sm"
              >
                X
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-sm text-gray-500 text-center mt-3">
        Sumber: BMKG Aviation Meteorology
      </p>
    </div>
  );
}
