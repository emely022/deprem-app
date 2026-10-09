import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Earthquake } from '../types/earthquake';
import { MagnitudeBadge } from './MagnitudeBadge';
import { formatTimeAgo } from '../utils/dateFormatter';

interface EarthquakeCardProps {
  earthquake: Earthquake;
  onPress: (eq: Earthquake) => void;
}

export const EarthquakeCard: React.FC<EarthquakeCardProps> = ({
  earthquake,
  onPress,
}) => {
  const timeAgo = formatTimeAgo(earthquake.time);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress(earthquake)}
      android_ripple={{ color: '#F1F5F9' }}
    >
      <View style={styles.badgeContainer}>
        <MagnitudeBadge magnitude={earthquake.magnitude} size="small" />
      </View>

      <View style={styles.contentContainer}>
        {/* Top Header: Flag + Country + Time */}
        <View style={styles.topRow}>
          <View style={styles.countryInfo}>
            <Text style={styles.flagEmoji}>{earthquake.flagEmoji}</Text>
            <Text style={styles.countryName} numberOfLines={1}>
              {earthquake.country}
            </Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.timeText}>{timeAgo}</Text>
          </View>
        </View>

        {/* Place Title */}
        <Text style={styles.placeText} numberOfLines={2}>
          {earthquake.place}
        </Text>

        {/* Bottom Details: Depth & Coordinates */}
        <View style={styles.bottomRow}>
          <Text style={styles.detailText}>
            Derinlik: <Text style={styles.detailValue}>{earthquake.depth} km</Text>
          </Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.detailText}>
            {earthquake.latitude.toFixed(2)}°, {earthquake.longitude.toFixed(2)}°
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  pressed: {
    opacity: 0.88,
    backgroundColor: '#F8FAFC',
  },
  badgeContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  flagEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  countryName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    maxWidth: 110,
  },
  dotSeparator: {
    fontSize: 12,
    color: '#94A3B8',
    marginHorizontal: 5,
  },
  timeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  placeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 19,
    marginBottom: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#64748B',
  },
  detailValue: {
    fontWeight: '600',
    color: '#475569',
  },
});
