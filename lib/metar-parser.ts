import { parseMetar, IMetar, ICloud, IWeatherCondition, IMetarTrend, Remark } from "metar-taf-parser";

export interface ParsedTrend {
  type: string;      
  fullText: string;   
  summary: string;   
}

export interface ParsedWeather {
  raw: string;
  station: string;
  time: Date;
  wind: {
    direction: number | "VRB";
    speed: number;
    unit: string;
    gust?: number;
  };
  visibility: {
    meters: number;
    text: string;
  };
  temperature: number | null;
  dewPoint: number | null;
  qnh: number | null;
  clouds: string[];
  weatherConditions: string[];
  flightCategory: string;
  trends: ParsedTrend[]; 
  remarks: string[];     
}

export function parseRawMetar(rawString: string): ParsedWeather | null {
  try {
    const cleanRaw = rawString
      .replace(/^(METAR|SPECI)\s+/i, "") 
      .replace(/\s+/g, " ") 
      .trim();

    const result: IMetar = parseMetar(cleanRaw);

    // 1. LOGIKA WAKTU OBSERVASI
    let obsTime = new Date(); 
    if (result.day !== undefined && result.hour !== undefined && result.minute !== undefined) {
        const now = new Date();
        const currentYear = now.getUTCFullYear();
        const currentMonth = now.getUTCMonth(); 

        let candidateDate = new Date(Date.UTC(currentYear, currentMonth, result.day, result.hour, result.minute));

        if (candidateDate.getTime() - now.getTime() > 25 * 24 * 60 * 60 * 1000) {
            candidateDate.setUTCMonth(currentMonth - 1);
        }
        if (now.getTime() - candidateDate.getTime() > 25 * 24 * 60 * 60 * 1000) {
             candidateDate.setUTCMonth(currentMonth + 1);
        }
        obsTime = candidateDate;
    }

    // 2. WIND
    let windDir: number | "VRB" = 0;
    if (result.wind) {
        if (result.wind.direction === "VRB") {
            windDir = "VRB";
        } else {

            windDir = result.wind.degrees ?? 0;
        }
    }

    // 3. VISIBILITY
    let visMeters = 10000;
    let visText = ">=10 km";

    if (result.visibility) {
        visMeters = result.visibility.value;
        if (result.visibility.unit === "SM") { 
            visMeters = Math.round(visMeters * 1609.34);
        }

        if (visMeters >= 9999) {
            visText = ">=10 km";
        } else if (visMeters < 1000) {
            visText = `${visMeters} m`;
        } else {
            visText = `${(visMeters / 1000).toFixed(1)} km`;
        }
    }

    if (result.cavok) {
        visMeters = 10000;
        visText = "CAVOK (Clear)";
    }

    // 4. TEMP & DEW
    const temp = result.temperature ?? null;
    const dew = result.dewPoint ?? null;

    // 5. PRESSURE / ALTIMETER
    let qnh: number | null = null;
    
    if (result.altimeter) {
         if (result.altimeter.unit === "inHg") {
             // Konversi inHg ke hPa
             qnh = Math.round(result.altimeter.value * 33.8639);
         } else {
             qnh = Math.round(result.altimeter.value);
         }
    }

    // 6. CLOUDS
    let cloudsList: string[] = [];
    if (result.clouds && result.clouds.length > 0) {
        cloudsList = result.clouds.map((c: ICloud) => {
            const heightStr = c.height 
                ? Math.floor(c.height / 100).toString().padStart(3, "0") 
                : "///";
            const typeStr = c.type ? ` ${c.type}` : "";
            return `${c.quantity}${heightStr}${typeStr}`;
        });
    } else if (result.cavok) {
        cloudsList = ["CAVOK"];
    } else {
        cloudsList = ["NSC"];
    }

    // 7. WEATHER CONDITIONS
    let weatherList: string[] = [];
    if (result.weatherConditions && result.weatherConditions.length > 0) {
        weatherList = result.weatherConditions.map((w: IWeatherCondition) => {
            const intensity = w.intensity ?? "";
            const descriptor = w.descriptive ?? "";
            const phenomenons = w.phenomenons ? w.phenomenons.join("") : "";
            return `${intensity}${descriptor}${phenomenons}`;
        });
    }

    // --- 8. TRENDS (TEMPO/BECMG) ---
    let parsedTrends: ParsedTrend[] = [];
    
    if (result.trends && result.trends.length > 0) {
        parsedTrends = result.trends.map((t: IMetarTrend) => {
            return {
                type: t.type, 
                fullText: t.raw, 
                summary: "" 
            };
        });
    }

    // --- 9. LOGIKA BARU: REMARKS (RMK) ---
    let parsedRemarks: string[] = [];
    if (result.remarks && result.remarks.length > 0) {
        parsedRemarks = result.remarks.map((r: Remark) => r.raw);
    }

    return {
      raw: cleanRaw,
      station: result.station, 
      time: obsTime, 
      wind: {
        direction: windDir,
        speed: result.wind?.speed ?? 0,
        unit: result.wind?.unit ?? "KT",
        gust: result.wind?.gust
      },
      visibility: {
        meters: visMeters,
        text: visText
      },
      temperature: result.temperature ?? null,
      dewPoint: result.dewPoint ?? null,
      qnh: qnh,
      clouds: cloudsList.length > 0 ? cloudsList : ["NSC"],
      weatherConditions: weatherList,
      flightCategory: "Unknown",
      trends: parsedTrends,
      remarks: parsedRemarks
    };

  } catch (error) {
    console.error("METAR Parser Error:", error);
    return null;
  }
}