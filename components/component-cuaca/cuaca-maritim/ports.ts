export interface PortLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

// Daftar pelabuhan hardcoded agar peta bisa render marker tanpa fetch API
export const PORT_LOCATIONS: PortLocation[] = [
  { id: "0194", name: "Samarinda", lat: -0.508104, lng: 117.155324 },
  { id: "0193", name: "Balikpapan (Semayang)", lat: -1.2729, lng: 116.8285 },
  { id: "0196", name: "Bontang", lat: 0.1037, lng: 117.4950 },
  { id: "0195", name: "Tanjung Redeb (Berau)", lat: 2.1550, lng: 117.4958 },
  { id: "0197", name: "Tanah Grogot", lat: -1.9036, lng: 116.2192 },
  { id: "0198", name: "Sangatta", lat: 0.5097, lng: 117.5686 },
];