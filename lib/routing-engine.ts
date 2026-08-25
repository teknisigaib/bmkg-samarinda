import * as turf from '@turf/turf';

/**
 * Mengekstrak dan memastikan GeoJSON adalah LineString murni
 */
export function getMainLineString(engineGeoJson: any) {
  if (!engineGeoJson) return null;
  let mainLine = engineGeoJson;
  
  if (engineGeoJson.type === 'FeatureCollection' && engineGeoJson.features.length > 0) {
    mainLine = engineGeoJson.features[0];
  }
  
  if (mainLine.geometry && mainLine.geometry.type === 'MultiLineString') {
    mainLine = turf.lineString(mainLine.geometry.coordinates[0]);
  }
  
  return mainLine;
}

/**
 * Menghitung dan memotong rute sungai dari titik Asal ke Tujuan
 */
export function calculateRiverRoute(originCoords: [number, number], destCoords: [number, number], engineGeoJson: any) {
  const mainLine = getMainLineString(engineGeoJson);
  if (!mainLine) throw new Error("Format GeoJSON Engine tidak valid.");

  const originPt = turf.point(originCoords);
  const destPt = turf.point(destCoords);

  const snappedOrigin = turf.nearestPointOnLine(mainLine, originPt);
  const snappedDest = turf.nearestPointOnLine(mainLine, destPt);

  const slicedRoute = turf.lineSlice(snappedOrigin, snappedDest, mainLine);

  // Cek arah dan putar balik (reverse) jika terbalik (ujung pertama lebih dekat ke tujuan)
  const coords = slicedRoute.geometry.coordinates;
  if (coords.length > 1) {
    const firstCoord = coords[0];
    const distToOrigin = turf.distance(turf.point(firstCoord), originPt);
    const distToDest = turf.distance(turf.point(firstCoord), destPt);
    
    if (distToDest < distToOrigin) {
      slicedRoute.geometry.coordinates.reverse();
    }
  }
  
  return { slicedRoute, mainLine };
}

/**
 * Menghitung jarak presisi (mengikuti lengkungan asli sungai) antar 2 titik
 */
export function getRiverDistance(ptA: [number, number], ptB: [number, number], mainLine: any): number {
    const snapA = turf.nearestPointOnLine(mainLine, turf.point(ptA));
    const snapB = turf.nearestPointOnLine(mainLine, turf.point(ptB));
    const legSlice = turf.lineSlice(snapA, snapB, mainLine);
    return turf.length(legSlice, { units: 'kilometers' });
}