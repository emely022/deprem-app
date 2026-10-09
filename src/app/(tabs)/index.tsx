import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEarthquakes } from '../../context/EarthquakeContext';
import { HeaderBar } from '../../components/HeaderBar';
import { EarthquakeCard } from '../../components/EarthquakeCard';
import { EarthquakeDetailModal } from '../../components/EarthquakeDetailModal';
import { Earthquake } from '../../types/earthquake';

export default function ListScreen() {
  const router = useRouter();
  const {
    filteredEarthquakes,
    earthquakes,
    loading,
    refreshing,
    refresh,
    filter,
    setFilter,
    setSelectedEarthquake,
  } = useEarthquakes();

  const [modalEarthquake, setModalEarthquake] = useState<Earthquake | null>(null);

  const handleCardPress = (eq: Earthquake) => {
    setModalEarthquake(eq);
  };

  const handleShowOnMap = (eq: Earthquake) => {
    setSelectedEarthquake(eq);
    router.push('/(tabs)/map');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <HeaderBar />

      <View style={styles.container}>
        {loading && earthquakes.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>
              Deprem verileri alınıyor...
            </Text>
          </View>
        ) : filteredEarthquakes.length === 0 ? (
          <View style={styles.centerContainer}>
            <Ionicons name="search-outline" size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>Eşleşen deprem bulunamadı</Text>
            <Text style={styles.emptySubtitle}>
              Arama kriterlerinizi değiştirerek tekrar deneyebilirsiniz.
            </Text>
            {(filter.searchQuery.length > 0 ||
              filter.magnitudeCategory !== 'all') && (
              <Pressable
                style={styles.resetButton}
                onPress={() =>
                  setFilter({
                    searchQuery: '',
                    magnitudeCategory: 'all',
                  })
                }
              >
                <Text style={styles.resetButtonText}>Filtreleri Temizle</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredEarthquakes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EarthquakeCard earthquake={item} onPress={handleCardPress} />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}
                colors={['#2563EB']}
                tintColor="#2563EB"
              />
            }
            contentContainerStyle={styles.listContent}
            initialNumToRender={15}
            maxToRenderPerBatch={20}
            windowSize={11}
          />
        )}
      </View>

      <EarthquakeDetailModal
        visible={!!modalEarthquake}
        earthquake={modalEarthquake}
        onClose={() => setModalEarthquake(null)}
        onShowOnMap={handleShowOnMap}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    paddingVertical: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#334155',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  resetButton: {
    marginTop: 16,
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
