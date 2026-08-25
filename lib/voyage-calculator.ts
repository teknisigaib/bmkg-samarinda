import * as turf from '@turf/turf';
import { FeatureCollection } from 'geojson';
import { MahakamLocation } from './mahakam-data';

export interface VoyageResult {
  route: FeatureCollection;
  distanceKm: number;
}

// --- TOPOLOGI SUNGAI MAHAKAM (HULU KE HILIR) ---
// TAMBAHKAN EXPORT DI SINI CYA!
export const RIVER_TOPOLOGY = [
  "Long Apari", "Long Pahangai", "Long Bagun", "Long Hubung", "Laham", 
  "Long Iram", "Tering", "Barong Tongkok", "Sekolaq Darat", "Melak", "Mook Manaar Bulatn", "Muara Pahu", "Penyinggahan",
  "Muara Muntai", "Muara Wis", "Kota Bangun", "Muara Kaman", "Sebulu", "Tenggarong Seberang", "Tenggarong", "Loa Kulu", "Loa Janan", 
  "Loa Janan Ilir", "Sungai Kunjang", "Samarinda Ulu", "Samarinda Kota", "Samarinda Seberang", "Samarinda Ilir", "Sambutan", "Palaran", 
  "Anggana" 
];

export function calculateRiverRoute(
  startLoc: MahakamLocation,
  endLoc: MahakamLocation,
  riverGeoJson: any
): VoyageResult {
  try {
    // 1. Cari index posisi stasiun A dan stasiun B di sungai
    const startIndex = RIVER_TOPOLOGY.indexOf(startLoc.name);
    const endIndex = RIVER_TOPOLOGY.indexOf(endLoc.name);

    if (startIndex === -1 || endIndex === -1) {
      throw new Error(`Stasiun tidak ditemukan dalam topologi sungai. (A: ${startLoc.name}, B: ${endLoc.name})`);
    }

    // 2. Tentukan arah rute (Bisa berlayar ke hulu atau ke hilir)
    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);

    // 3. Ambil daftar kecamatan yang dilewati kapal
    const passedDistricts = RIVER_TOPOLOGY.slice(minIndex, maxIndex + 1);

    // 4. Kumpulkan hanya segmen GeoJSON yang dilewati (Filter)
    const filteredFeatures = riverGeoJson.features.filter((feature: any) => {
      const kecamatan = feature.properties?.nm_kecamatan;
      return passedDistricts.includes(kecamatan);
    });

    // 5. Bungkus ulang jadi satu file GeoJSON baru
    const routeCollection: FeatureCollection = {
      type: "FeatureCollection",
      features: filteredFeatures
    };

    // 6. Minta Turf.js hitung total jarak dari kumpulan segmen tersebut
    const distanceKm = turf.length(routeCollection, { units: 'kilometers' });

    return {
      route: routeCollection,
      distanceKm: Number(distanceKm.toFixed(1))
    };

  } catch (error) {
    console.warn("[VOYAGE PLANNER] Gagal memetakan jalur by urutan kecamatan, fallback lurus.", error);
    
    // Fallback Darurat
    const startPt = turf.point([startLoc.lng, startLoc.lat]);
    const endPt = turf.point([endLoc.lng, endLoc.lat]);
    const directDist = turf.distance(startPt, endPt, { units: 'kilometers' });
    
    return {
      route: turf.featureCollection([
        turf.lineString([[startLoc.lng, startLoc.lat], [endLoc.lng, endLoc.lat]])
      ]),
      distanceKm: Number((directDist * 1.3).toFixed(1))
    };
  }
}