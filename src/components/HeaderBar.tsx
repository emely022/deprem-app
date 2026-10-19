import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEarthquakes } from '../context/EarthquakeContext';
import { useDrawer } from '../context/DrawerContext';

export const HeaderBar: React.FC = () => {
  const {
    refreshing,
    refresh,
    filter,
    setFilter,
  } = useEarthquakes();
  const { openDrawer } = useDrawer();

  return (
    <View style={styles.container}>
      {/* Top row: Menu button + App title + Refresh button */}
      <View style={styles.topRow}>
        <View style={styles.leftContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.menuButton,
              pressed && styles.menuButtonPressed,
            ]}
            onPress={openDrawer}
            accessibilityLabel="Menüyü Aç"
          >
            <Ionicons name="menu" size={24} color="#0F172A" />
          </Pressable>

          <View style={styles.titleContainer}>
            <Text style={styles.titleIcon}>🌍</Text>
            <Text style={styles.appTitle}>Deprem Takibi</Text>
          </View>
        </View>

        <View style={styles.rightActions}>
          {/* Manual refresh button */}
          <Pressable
            style={({ pressed }) => [
              styles.refreshButton,
              pressed && styles.refreshButtonPressed,
            ]}
            onPress={refresh}
            disabled={refreshing}
            accessibilityLabel="Yenile"
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#2563EB" />
            ) : (
              <Ionicons name="refresh" size={20} color="#334155" />
            )}
          </Pressable>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Şehir, ülke veya bölge ara..."
          placeholderTextColor="#94A3B8"
          value={filter.searchQuery}
          onChangeText={(text) => setFilter({ searchQuery: text })}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
        {filter.searchQuery.length > 0 && (
          <Pressable
            onPress={() => setFilter({ searchQuery: '' })}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </Pressable>
        )}
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {/* All */}
        <Pressable
          style={[
            styles.chip,
            filter.magnitudeCategory === 'all' && styles.chipActive,
          ]}
          onPress={() => setFilter({ magnitudeCategory: 'all' })}
        >
          <Text
            style={[
              styles.chipText,
              filter.magnitudeCategory === 'all' && styles.chipTextActive,
            ]}
          >
            Tümü
          </Text>
        </Pressable>

        {/* M >= 3.0 (Kırmızı) */}
        <Pressable
          style={[
            styles.chip,
            filter.magnitudeCategory === 'ge3' && styles.chipActiveRed,
          ]}
          onPress={() =>
            setFilter({
              magnitudeCategory:
                filter.magnitudeCategory === 'ge3' ? 'all' : 'ge3',
            })
          }
        >
          <View style={styles.dotRed} />
          <Text
            style={[
              styles.chipText,
              filter.magnitudeCategory === 'ge3' && styles.chipTextActiveRed,
            ]}
          >
            M ≥ 3.0
          </Text>
        </Pressable>

        {/* M < 3.0 (Mavi) */}
        <Pressable
          style={[
            styles.chip,
            filter.magnitudeCategory === 'lt3' && styles.chipActiveBlue,
          ]}
          onPress={() =>
            setFilter({
              magnitudeCategory:
                filter.magnitudeCategory === 'lt3' ? 'all' : 'lt3',
            })
          }
        >
          <View style={styles.dotBlue} />
          <Text
            style={[
              styles.chipText,
              filter.magnitudeCategory === 'lt3' && styles.chipTextActiveBlue,
            ]}
          >
            M &lt; 3.0
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonPressed: {
    backgroundColor: '#E2E8F0',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButtonPressed: {
    backgroundColor: '#E2E8F0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  chipActiveRed: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
  },
  chipActiveBlue: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  chipTextActiveRed: {
    color: '#DC2626',
    fontWeight: '700',
  },
  chipTextActiveBlue: {
    color: '#2563EB',
    fontWeight: '700',
  },
  dotRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
    marginRight: 5,
  },
  dotBlue: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginRight: 5,
  },
});
