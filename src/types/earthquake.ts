export type EarthquakeSource = 'USGS' | 'EMSC' | 'BOTH';

export interface Earthquake {
  id: string;
  source: EarthquakeSource;
  originalIdUSGS?: string;
  originalIdEMSC?: string;
  magnitude: number;
  place: string;
  country: string;
  flagEmoji: string;
  time: number; // UTC timestamp in milliseconds
  latitude: number;
  longitude: number;
  depth: number; // in kilometers
  url?: string;
}

export interface USGSFeature {
  type: 'Feature';
  id: string;
  properties: {
    mag: number | null;
    place: string | null;
    time: number;
    updated?: number;
    tz?: number | null;
    url?: string;
    detail?: string;
    felt?: number | null;
    cdi?: number | null;
    mmi?: number | null;
    alert?: string | null;
    status?: string;
    tsunami?: number;
    sig?: number;
    net?: string;
    code?: string;
    ids?: string;
    sources?: string;
    types?: string;
    nst?: number | null;
    dmin?: number | null;
    rms?: number | null;
    gap?: number | null;
    magType?: string;
    type?: string;
    title?: string;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number, number]; // [longitude, latitude, depth]
  };
}

export interface USGSFeatureCollection {
  type: 'FeatureCollection';
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count?: number;
    limit?: number;
    offset?: number;
  };
  features: USGSFeature[];
}

export interface EMSCFeature {
  type: 'Feature';
  id: string;
  geometry: {
    type: 'Point';
    coordinates: [number, number, number]; // [longitude, latitude, -depth]
  };
  properties: {
    source_id?: string;
    source_catalog?: string;
    lastupdate?: string;
    time: string; // ISO string e.g. "2026-10-09T18:14:40.0Z"
    flynn_region: string;
    lat: number;
    lon: number;
    depth: number;
    evtype?: string;
    auth?: string;
    mag: number | null;
    magtype?: string;
    unid: string;
  };
}

export interface EMSCFeatureCollection {
  type: 'FeatureCollection';
  metadata: {
    count: number;
  };
  features: EMSCFeature[];
}

export interface FilterOptions {
  searchQuery: string;
  magnitudeCategory: 'all' | 'ge3' | 'lt3';
}
