export interface PortLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export const PORT_LOCATIONS: PortLocation[] = [
  { id: "0194", name: "Samarinda", lat: -0.508104, lng: 117.155324 },
  { id: "0193", name: "Semayang, Balikpapan", lat: -1.2729, lng: 116.8285 },
  { id: "0197", name: "Tanah Grogot", lat: -1.9036, lng: 116.2192 },
  { id: "0198", name: "Tanjung Santan", lat: 0.5097, lng: 117.5686 },
  { id: "0199", name: "Sangkuliran", lat: 0.986576, lng: 117.98810 },
  { id: "0418", name: "Penajam", lat: -1.24324578, lng: 116.77685738 },
  { id: "0419", name: "Karingau", lat: -1.200851, lng: 116.817897 },
];