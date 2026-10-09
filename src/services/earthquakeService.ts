import {
  Earthquake,
  USGSFeatureCollection,
  EMSCFeatureCollection,
} from '../types/earthquake';
import { detectCountry } from '../utils/countryDetector';

const USGS_URL =
  'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=200&orderby=time';
const EMSC_URL =
  'https://www.seismicportal.eu/fdsnws/event/1/query?format=json&limit=200&orderby=time';

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
 * Fetches earthquakes from USGS API.
 */
export async function fetchUSGS(): Promise<Earthquake[]> {
  const res = await fetch(USGS_URL, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`USGS HTTP Error: ${res.status}`);
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
 * Fetches earthquakes from EMSC API.
 */
export async function fetchEMSC(): Promise<Earthquake[]> {
  const res = await fetch(EMSC_URL, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`EMSC HTTP Error: ${res.status}`);
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
 * Two events are deemed duplicates if:
 * - Time difference <= 120 seconds (2 minutes)
 * - Distance <= 120 km
 * - Magnitude difference <= 0.8
 */
export function deduplicateEarthquakes(
  list1: Earthquake[],
  list2: Earthquake[]
): Earthquake[] {
  const allEvents = [...list1, ...list2];
  // Sort descending by time initially
  allEvents.sort((a, b) => b.time - a.time);

  const merged: Earthquake[] = [];
  const visited = new Set<string>();

  for (let i = 0; i < allEvents.length; i++) {
    const item = allEvents[i];
    if (visited.has(item.id)) continue;

    let matchedItem: Earthquake | null = null;

    // Look for matching duplicates in remaining items
    for (let j = i + 1; j < allEvents.length; j++) {
      const candidate = allEvents[j];
      if (visited.has(candidate.id)) continue;

      const timeDiff = Math.abs(item.time - candidate.time);
      // Beyond 3 minutes, since sorted by time, break early optimization
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
      // Create unified earthquake record combining best details
      const usgsPart = item.source === 'USGS' ? item : matchedItem.source === 'USGS' ? matchedItem : null;
      const emscPart = item.source === 'EMSC' ? item : matchedItem.source === 'EMSC' ? matchedItem : null;

      // Prefer USGS place string if it includes local landmark details (e.g. "12 km SW of...")
      // otherwise use whatever is more descriptive
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
        time: Math.min(item.time, matchedItem.time), // Earliest reported origin time
        latitude: Math.round(((item.latitude + matchedItem.latitude) / 2) * 1000) / 1000,
        longitude: Math.round(((item.longitude + matchedItem.longitude) / 2) * 1000) / 1000,
        depth: Math.round(((item.depth + matchedItem.depth) / 2) * 10) / 10,
        url: usgsPart?.url || emscPart?.url,
      });
    } else {
      merged.push(item);
    }
  }

  // Sort descending by time (newest first)
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
 * Fetches from both USGS and EMSC in parallel, deduplicates and returns results.
 */
export async function fetchCombinedEarthquakes(): Promise<FetchResult> {
  const errors: string[] = [];
  let usgsList: Earthquake[] = [];
  let emscList: Earthquake[] = [];

  const [usgsRes, emscRes] = await Promise.allSettled([
    fetchUSGS(),
    fetchEMSC(),
  ]);

  if (usgsRes.status === 'fulfilled') {
    usgsList = usgsRes.value;
  } else {
    errors.push(`USGS: ${usgsRes.reason?.message || 'Erişilemedi'}`);
  }

  if (emscRes.status === 'fulfilled') {
    emscList = emscRes.value;
  } else {
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
