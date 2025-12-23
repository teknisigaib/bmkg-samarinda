"use client";

import { useState } from "react";
import MaritimSection from "@/components/component-cuaca/cuaca-maritim/MaritimSection";
import PrakiraanMaritim from "@/components/component-cuaca/cuaca-maritim/PrakiraanMaritim";
import KartuCuacaPelabuhan from "@/components/component-cuaca/cuaca-maritim/KartuCuacaPelabuhan";
import { daftarWilayah } from "@/lib/daftar_wilayah";
import { daftarPelabuhan } from "@/lib/daftar-pelabuhan";

type ViewType = "perairan" | "pelabuhan";

export default function Page() {
  const [activeView, setActiveView] = useState<ViewType>("perairan");
  const [highlightId, setHighlightId] = useState<string | null>(null);

  // Klik area polygon perairan
  const handleMapPolygonClick = (cardId: string) => {
    setActiveView("perairan");
    setHighlightId(cardId);
    scrollToCard(cardId);
  };

  // Klik marker pelabuhan
  const handlePelabuhanClick = (cardId: string) => {
    setActiveView("pelabuhan");
    setHighlightId(cardId);
    scrollToCard(cardId);
  };

  const scrollToCard = (cardId: string) => {
    setTimeout(() => {
      const el = document.getElementById(cardId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
    setTimeout(() => setHighlightId(null), 2000); // highlight hilang otomatis
  };

  return (
    // Mengubah container utama agar kontennya berada di tengah
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 mt-3">
      <div className="w-full text-center">
        <h1 className="text-xl md:text-3xl font-bold text-gray-700 mb-2">
          Cuaca Maritim
        </h1>
        <p className="text-gray-600 mb-6 mx-auto text-base">
    Selamat datang di pusat informasi cuaca maritim. Halaman ini dirancang untuk
    memberikan Anda gambaran lengkap mengenai kondisi cuaca di laut. Anda dapat
    menjelajahi peta interaktif untuk melihat kondisi gelombang, angin, dan cuaca
    secara visual.
  </p>
      </div>

      <div className="w-full mb-8">
        <MaritimSection
          onPolygonClick={handleMapPolygonClick}
          onPelabuhanClick={handlePelabuhanClick}
        />
      </div>

      {/* 🔘 Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveView("perairan")}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeView === "perairan"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Prakiraan Perairan
          </button>
          <button
            onClick={() => setActiveView("pelabuhan")}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeView === "pelabuhan"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Prakiraan Pelabuhan
          </button>
        </nav>
      </div>

      {/* 🔹 Konten */}
      <div>
        {activeView === "perairan" && (
          <div className="space-y-6">
            {daftarWilayah.map((wilayah) => (
              <div
                key={wilayah.id}
                id={wilayah.cardId}
                className={`transition-all duration-500 rounded-xl ${
                  highlightId === wilayah.cardId
                    ? "ring-4 ring-blue-400 ring-opacity-70 shadow-md scale-[1.02] animate-pulse-glow"
                    : ""
                }`}
              >
                <PrakiraanMaritim nama={wilayah.nama} id={wilayah.id} />
              </div>
            ))}
          </div>
        )}

        {activeView === "pelabuhan" && (
          <div className="flex flex-col items-center gap-6">
            {daftarPelabuhan.map((pelabuhan) => (
              <div
                key={pelabuhan.id}
                id={pelabuhan.cardId}
                className={`transition-all duration-500 rounded-xl ${
                  highlightId === pelabuhan.cardId
                    ? "ring-4 ring-blue-400 ring-opacity-70 shadow-md scale-[1.02] animate-pulse-glow"
                    : ""
                }`}
              >
                <KartuCuacaPelabuhan id={pelabuhan.id} nama={pelabuhan.nama} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}