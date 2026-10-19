import {
  Earthquake,
  USGSFeatureCollection,
  EMSCFeatureCollection,
} from '../types/earthquake';
import { detectCountry } from '../utils/countryDetector';

// USGS real-time CDN feed: updated every minute, served globally via Akamai CDN (<200ms latency)
const USGS_URL =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

// EMSC real-time seismic portal query (optimized to limit=150 for fast response)
const EMSC_URL =
  'https://www.seismicportal.eu/fdsnws/event/1/query?format=json&limit=150&orderby=time';

const REQUEST_TIMEOUT_MS = 6000;

/**
 * Fetch wrapper with timeout using AbortController to prevent network hangs.
 */
async function fetchWithTimeout(url: string, timeoutMs = REQUEST_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Calculates distance in kilometers between two latitude/longitude points
 * using the Haversine formula.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Fetches earthquakes from USGS real-time CDN feed.
 */
export async function fetchUSGS(): Promise<Earthquake[]> {
  const res = await fetchWithTimeout(USGS_URL);
  if (!res.ok) {
    throw new Error(`USGS HTTP Hatası: ${res.status}`);
  }
  const data: USGSFeatureCollection = await res.json();
  if (!data.features || !Array.isArray(data.features)) {
    return [];
  }

  return data.features.map((f) => {
    const lon = f.geometry.coordinates[0];
    const lat = f.geometry.coordinates[1];
    const depth = Math.abs(f.geometry.coordinates[2] || 0);
    const mag = Math.round(((f.properties.mag ?? 0) * 10)) / 10;
    const place = f.properties.place || 'Bilinmeyen Konum';
    const country = detectCountry(place, lat, lon);

    return {
      id: `usgs-${f.id}`,
      source: 'USGS' as const,
      originalIdUSGS: f.id,
      magnitude: mag,
      place,
      country: country.name,
      flagEmoji: country.flag,
      time: f.properties.time,
      latitude: lat,
      longitude: lon,
      depth,
      url: f.properties.url,
    };
  });
}

/**
 * Fetches earthquakes from EMSC API with timeout.
 */
export async function fetchEMSC(): Promise<Earthquake[]> {
  const res = await fetchWithTimeout(EMSC_URL);
  if (!res.ok) {
    throw new Error(`EMSC HTTP Hatası: ${res.status}`);
  }
  const data: EMSCFeatureCollection = await res.json();
  if (!data.features || !Array.isArray(data.features)) {
    return [];
  }

  return data.features.map((f) => {
    const lon = f.properties.lon ?? f.geometry.coordinates[0];
    const lat = f.properties.lat ?? f.geometry.coordinates[1];
    const depth = Math.abs(f.properties.depth ?? f.geometry.coordinates[2] ?? 0);
    const mag = Math.round(((f.properties.mag ?? 0) * 10)) / 10;
    const place = f.properties.flynn_region || 'Bilinmeyen Konum';
    const timeMs = new Date(f.properties.time).getTime();
    const country = detectCountry(place, lat, lon);

    return {
      id: `emsc-${f.properties.unid || f.id}`,
      source: 'EMSC' as const,
      originalIdEMSC: f.properties.unid || f.id,
      magnitude: mag,
      place,
      country: country.name,
      flagEmoji: country.flag,
      time: timeMs,
      latitude: lat,
      longitude: lon,
      depth,
      url: `https://www.seismicportal.eu/eventdetails.html?unid=${f.properties.unid || f.id}`,
    };
  });
}

/**
 * Merges and deduplicates earthquake lists from USGS and EMSC.
 */
export function deduplicateEarthquakes(
  list1: Earthquake[],
  list2: Earthquake[]
): Earthquake[] {
  const allEvents = [...list1, ...list2];
  allEvents.sort((a, b) => b.time - a.time);

  const merged: Earthquake[] = [];
  const visited = new Set<string>();

  for (let i = 0; i < allEvents.length; i++) {
    const item = allEvents[i];
    if (visited.has(item.id)) continue;

    let matchedItem: Earthquake | null = null;

    for (let j = i + 1; j < allEvents.length; j++) {
      const candidate = allEvents[j];
      if (visited.has(candidate.id)) continue;

      const timeDiff = Math.abs(item.time - candidate.time);
      if (timeDiff > 180_000) {
        break;
      }

      if (timeDiff <= 120_000) {
        const distKm = calculateDistanceKm(
          item.latitude,
          item.longitude,
          candidate.latitude,
          candidate.longitude
        );

        const magDiff = Math.abs(item.magnitude - candidate.magnitude);

        if (distKm <= 120 && (magDiff <= 0.8 || item.magnitude === 0 || candidate.magnitude === 0)) {
          matchedItem = candidate;
          visited.add(candidate.id);
          break;
        }
      }
    }

    visited.add(item.id);

    if (matchedItem) {
      const usgsPart = item.source === 'USGS' ? item : matchedItem.source === 'USGS' ? matchedItem : null;
      const emscPart = item.source === 'EMSC' ? item : matchedItem.source === 'EMSC' ? matchedItem : null;

      let bestPlace = item.place;
      if (usgsPart?.place && usgsPart.place.length > 5) {
        bestPlace = usgsPart.place;
      } else if (emscPart?.place) {
        bestPlace = emscPart.place;
      }

      const bestCountry = detectCountry(bestPlace, item.latitude, item.longitude);
      const unifiedMag =
        item.magnitude > 0 && matchedItem.magnitude > 0
          ? Math.round(((item.magnitude + matchedItem.magnitude) / 2) * 10) / 10
          : Math.max(item.magnitude, matchedItem.magnitude);

      merged.push({
        id: `merged-${usgsPart?.originalIdUSGS || item.id}-${emscPart?.originalIdEMSC || matchedItem.id}`,
        source: 'BOTH',
        originalIdUSGS: usgsPart?.originalIdUSGS,
        originalIdEMSC: emscPart?.originalIdEMSC,
        magnitude: unifiedMag,
        place: bestPlace,
        country: bestCountry.name,
        flagEmoji: bestCountry.flag,
        time: Math.min(item.time, matchedItem.time),
        latitude: Math.round(((item.latitude + matchedItem.latitude) / 2) * 1000) / 1000,
        longitude: Math.round(((item.longitude + matchedItem.longitude) / 2) * 1000) / 1000,
        depth: Math.round(((item.depth + matchedItem.depth) / 2) * 10) / 10,
        url: usgsPart?.url || emscPart?.url,
      });
    } else {
      merged.push(item);
    }
  }

  merged.sort((a, b) => b.time - a.time);
  return merged;
}

export interface FetchResult {
  earthquakes: Earthquake[];
  totalUSGS: number;
  totalEMSC: number;
  duplicateCount: number;
  errors: string[];
}

/**
 * Fetches from both USGS and EMSC in parallel.
 * Supports progressive callback `onProgress` so the UI receives and displays
 * the first responding API immediately (e.g. USGS in <200ms) without waiting!
 */
export async function fetchCombinedEarthquakes(
  onProgress?: (partial: Earthquake[]) => void
): Promise<FetchResult> {
  const errors: string[] = [];
  let usgsList: Earthquake[] = [];
  let emscList: Earthquake[] = [];

  const usgsPromise = fetchUSGS().then((list) => {
    usgsList = list;
    if (onProgress && list.length > 0) {
      onProgress(list);
    }
    return list;
  });

  const emscPromise = fetchEMSC().then((list) => {
    emscList = list;
    if (onProgress && list.length > 0 && usgsList.length === 0) {
      onProgress(list);
    }
    return list;
  });

  const [usgsRes, emscRes] = await Promise.allSettled([usgsPromise, emscPromise]);

  if (usgsRes.status === 'rejected') {
    errors.push(`USGS: ${usgsRes.reason?.message || 'Erişilemedi'}`);
  }

  if (emscRes.status === 'rejected') {
    errors.push(`EMSC: ${emscRes.reason?.message || 'Erişilemedi'}`);
  }

  const merged = deduplicateEarthquakes(usgsList, emscList);
  const totalCombined = usgsList.length + emscList.length;
  const duplicateCount = Math.max(0, totalCombined - merged.length);

  return {
    earthquakes: merged,
    totalUSGS: usgsList.length,
    totalEMSC: emscList.length,
    duplicateCount,
    errors,
  };
}
