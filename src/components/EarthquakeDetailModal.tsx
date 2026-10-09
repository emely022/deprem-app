import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Linking,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Earthquake } from '../types/earthquake';
import { MagnitudeBadge } from './MagnitudeBadge';
import { formatFullDateTime, formatTimeAgo } from '../utils/dateFormatter';

interface EarthquakeDetailModalProps {
  earthquake: Earthquake | null;
  visible: boolean;
  onClose: () => void;
  onShowOnMap?: (eq: Earthquake) => void;
}

export const EarthquakeDetailModal: React.FC<EarthquakeDetailModalProps> = ({
  earthquake,
  visible,
  onClose,
  onShowOnMap,
}) => {
  if (!earthquake) return null;

  const handleOpenSource = () => {
    if (earthquake.url) {
      Linking.openURL(earthquake.url);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.dragPill} />
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={22} color="#64748B" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {/* Main Badge & Title */}
            <View style={styles.topSection}>
              <MagnitudeBadge magnitude={earthquake.magnitude} size="large" />
              <View style={styles.topInfo}>
                <View style={styles.countryRow}>
                  <Text style={styles.flagEmoji}>{earthquake.flagEmoji}</Text>
                  <Text style={styles.countryTitle}>{earthquake.country}</Text>
                </View>
                <Text style={styles.timeAgoText}>
                  {formatTimeAgo(earthquake.time)} ({formatFullDateTime(earthquake.time)})
                </Text>
              </View>
            </View>

            {/* Place */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>Konum Bilgisi</Text>
              <Text style={styles.placeTitle}>{earthquake.place}</Text>
            </View>

            {/* Grid of details */}
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Ionicons name="layers-outline" size={20} color="#2563EB" />
                <Text style={styles.gridLabel}>Derinlik</Text>
                <Text style={styles.gridValue}>{earthquake.depth} km</Text>
              </View>

              <View style={styles.gridItem}>
                <Ionicons name="locate-outline" size={20} color="#059669" />
                <Text style={styles.gridLabel}>Koordinatlar</Text>
                <Text style={styles.gridValue}>
                  {earthquake.latitude.toFixed(3)}°, {earthquake.longitude.toFixed(3)}°
                </Text>
              </View>

              <View style={styles.gridItem}>
                <Ionicons name="time-outline" size={20} color="#7C3AED" />
                <Text style={styles.gridLabel}>Oluş Zamanı</Text>
                <Text style={styles.gridValue}>{formatTimeAgo(earthquake.time)}</Text>
              </View>

              <View style={styles.gridItem}>
                <Ionicons
                  name={earthquake.magnitude >= 3.0 ? 'warning-outline' : 'shield-checkmark-outline'}
                  size={20}
                  color={earthquake.magnitude >= 3.0 ? '#DC2626' : '#2563EB'}
                />
                <Text style={styles.gridLabel}>Risk Seviyesi</Text>
                <Text
                  style={[
                    styles.gridValue,
                    { color: earthquake.magnitude >= 3.0 ? '#DC2626' : '#2563EB' },
                  ]}
                >
                  {earthquake.magnitude >= 3.0 ? 'Orta / Yüksek' : 'Hafif (M < 3.0)'}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              {onShowOnMap && (
                <Pressable
                  style={styles.primaryButton}
                  onPress={() => {
                    onClose();
                    onShowOnMap(earthquake);
                  }}
                >
                  <Ionicons name="map" size={18} color="#FFFFFF" style={styles.btnIcon} />
                  <Text style={styles.primaryButtonText}>Haritada Odaklan</Text>
                </Pressable>
              )}

              {earthquake.url && (
                <Pressable style={styles.secondaryButton} onPress={handleOpenSource}>
                  <Ionicons
                    name="open-outline"
                    size={18}
                    color="#0F172A"
                    style={styles.btnIcon}
                  />
                  <Text style={styles.secondaryButtonText}>Detaylı Sayfayı Aç</Text>
                </Pressable>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  sheetHeader: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
    position: 'relative',
  },
  dragPill: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  topInfo: {
    marginLeft: 16,
    flex: 1,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  flagEmoji: {
    fontSize: 22,
    marginRight: 8,
  },
  countryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  timeAgoText: {
    fontSize: 13,
    color: '#64748B',
  },
  sectionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  placeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 6,
    marginBottom: 2,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  actionsContainer: {
    gap: 10,
    marginBottom: 10,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '600',
  },
});
