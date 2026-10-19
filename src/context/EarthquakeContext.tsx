import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  Earthquake,
  FilterOptions,
} from '../types/earthquake';
import {
  fetchCombinedEarthquakes,
  FetchResult,
} from '../services/earthquakeService';
import { normalizeForSearch } from '../utils/searchHelper';

interface EarthquakeContextType {
  earthquakes: Earthquake[];
  filteredEarthquakes: Earthquake[];
  loading: boolean;
  refreshing: boolean;
  lastUpdated: Date | null;
  secondsLeft: number;
  filter: FilterOptions;
  setFilter: (update: Partial<FilterOptions>) => void;
  refresh: () => Promise<void>;
  stats: {
    totalUSGS: number;
    totalEMSC: number;
    duplicateCount: number;
    errors: string[];
  };
  selectedEarthquake: Earthquake | null;
  setSelectedEarthquake: (eq: Earthquake | null) => void;
}

const EarthquakeContext = createContext<EarthquakeContextType | undefined>(
  undefined
);

const REFRESH_INTERVAL_SECONDS = 60;

export const EarthquakeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(REFRESH_INTERVAL_SECONDS);
  const [selectedEarthquake, setSelectedEarthquake] =
    useState<Earthquake | null>(null);

  const [stats, setStats] = useState<{
    totalUSGS: number;
    totalEMSC: number;
    duplicateCount: number;
    errors: string[];
  }>({
    totalUSGS: 0,
    totalEMSC: 0,
    duplicateCount: 0,
    errors: [],
  });

  const [filter, setFilterState] = useState<FilterOptions>({
    searchQuery: '',
    magnitudeCategory: 'all',
  });

  const setFilter = useCallback((update: Partial<FilterOptions>) => {
    setFilterState((prev) => ({ ...prev, ...update }));
  }, []);

  const isFetchingRef = useRef(false);

  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (isManualRefresh) {
      setRefreshing(true);
    }

    try {
      const res: FetchResult = await fetchCombinedEarthquakes((partialList) => {
        // Immediate display: As soon as the fastest API responds (<200ms), show data and dismiss spinner!
        setEarthquakes((prev) => {
          if (prev.length === 0 && partialList.length > 0) {
            setLoading(false);
            return partialList;
          }
          return prev;
        });
      });
      setEarthquakes(res.earthquakes);
      setStats({
        totalUSGS: res.totalUSGS,
        totalEMSC: res.totalEMSC,
        duplicateCount: res.duplicateCount,
        errors: res.errors,
      });
      setLastUpdated(new Date());
      setSecondsLeft(REFRESH_INTERVAL_SECONDS);
    } catch (err: any) {
      setStats((prev) => ({
        ...prev,
        errors: [...prev.errors, err?.message || 'Veri alınamadı'],
      }));
    } finally {
      setLoading(false);
      setRefreshing(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // 1-second countdown and 60-second auto-refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Trigger refresh
          loadData(false);
          return REFRESH_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loadData]);

  const refresh = useCallback(async () => {
    setSecondsLeft(REFRESH_INTERVAL_SECONDS);
    await loadData(true);
  }, [loadData]);

  // Filtered earthquakes memoization
  const filteredEarthquakes = useMemo(() => {
    return earthquakes.filter((eq) => {
      // 1. Search Query (matches place name or country)
      if (filter.searchQuery.trim().length > 0) {
        const queryNorm = normalizeForSearch(filter.searchQuery);
        const placeNorm = normalizeForSearch(eq.place);
        const countryNorm = normalizeForSearch(eq.country);
        if (!placeNorm.includes(queryNorm) && !countryNorm.includes(queryNorm)) {
          return false;
        }
      }

      // 2. Magnitude Category (< 3.0 vs >= 3.0)
      if (filter.magnitudeCategory === 'ge3' && eq.magnitude < 3.0) {
        return false;
      }
      if (filter.magnitudeCategory === 'lt3' && eq.magnitude >= 3.0) {
        return false;
      }

      return true;
    });
  }, [earthquakes, filter]);

  return (
    <EarthquakeContext.Provider
      value={{
        earthquakes,
        filteredEarthquakes,
        loading,
        refreshing,
        lastUpdated,
        secondsLeft,
        filter,
        setFilter,
        refresh,
        stats,
        selectedEarthquake,
        setSelectedEarthquake,
      }}
    >
      {children}
    </EarthquakeContext.Provider>
  );
};

export function useEarthquakes(): EarthquakeContextType {
  const context = useContext(EarthquakeContext);
  if (!context) {
    throw new Error('useEarthquakes must be used within an EarthquakeProvider');
  }
  return context;
}
