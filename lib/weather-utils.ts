export const calculateFeelsLike = (t: number, rh: number, ws: number): number => {
  const expValue = (17.27 * t) / (237.7 + t);
  const e = (rh / 100) * 6.105 * Math.exp(expValue);
  return Math.round(t + (0.33 * e) - (0.70 * ws) - 4.00);
};

// Rotasi Angin
export const getWindRotation = (direction: string): number => {
  const map: { [key: string]: number } = { 
    'N': 0, 'U': 0, 'NNE': 22.5, 'NE': 45, 'TL': 45, 'ENE': 67.5, 
    'E': 90, 'T': 90, 'ESE': 112.5, 'SE': 135, 'TG': 135, 'SSE': 157.5, 
    'S': 180, 'SSW': 202.5, 'SW': 225, 'BD': 225, 'WSW': 247.5, 
    'W': 270, 'B': 270, 'WNW': 292.5, 'NW': 315, 'BL': 315, 'NNW': 337.5, 
    'VAR': 0 
  };
  return map[direction.toUpperCase()] || 0;
};

// Format Tanggal
export const getDayName = (dateStr: string) => {
  try { return new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(new Date(dateStr)); } 
  catch (e) { return ""; }
};

export const getFullDate = (dateStr: string) => {
  try { return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr)); } 
  catch (e) { return ""; }
};