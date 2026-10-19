import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useEarthquakes } from '../../context/EarthquakeContext';
import { useDrawer } from '../../context/DrawerContext';
import { EarthquakeMap } from '../../components/EarthquakeMap';
import { EarthquakeDetailModal } from '../../components/EarthquakeDetailModal';
import { Earthquake } from '../../types/earthquake';

export default function MapScreen() {
  const {
    filteredEarthquakes,
    selectedEarthquake,
    setSelectedEarthquake,
    filter,
    setFilter,
  } = useEarthquakes();
  const { openDrawer } = useDrawer();

  const [modalEarthquake, setModalEarthquake] = useState<Earthquake | null>(null);

  const handleOpenDetail = (eq: Earthquake) => {
    setModalEarthquake(eq);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Map Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.menuButton,
              pressed && styles.menuButtonPressed,
            ]}
            onPress={openDrawer}
            accessibilityLabel="Menüyü Aç"
          >
            <Ionicons name="menu" size={22} color="#0F172A" />
          </Pressable>
          <Text style={styles.titleIcon}>🗺️</Text>
          <Text style={styles.headerTitle}>Deprem Haritası</Text>
        </View>

        <View style={styles.headerRight}>

          {/* Magnitude Filter Quick Toggle */}
          <Pressable
            style={[
              styles.filterToggle,
              filter.magnitudeCategory === 'ge3' && styles.filterToggleActive,
            ]}
            onPress={() =>
              setFilter({
                magnitudeCategory:
                  filter.magnitudeCategory === 'ge3' ? 'all' : 'ge3',
              })
            }
          >
            <Text
              style={[
                styles.filterToggleText,
                filter.magnitudeCategory === 'ge3' && styles.filterToggleTextActive,
              ]}
            >
              {filter.magnitudeCategory === 'ge3' ? '🔴 M ≥ 3.0' : 'Tümü'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Map View */}
      <EarthquakeMap
        earthquakes={filteredEarthquakes}
        selectedEarthquake={selectedEarthquake}
        onSelectEarthquake={setSelectedEarthquake}
        onOpenDetail={handleOpenDetail}
      />

      {/* Modal */}
      <EarthquakeDetailModal
        visible={!!modalEarthquake}
        earthquake={modalEarthquake}
        onClose={() => setModalEarthquake(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  menuButtonPressed: {
    backgroundColor: '#E2E8F0',
  },
  titleIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterToggle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterToggleActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
  },
  filterToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  filterToggleTextActive: {
    color: '#DC2626',
  },
});
