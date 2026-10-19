import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDrawer } from '../context/DrawerContext';

const DRAWER_WIDTH = Math.min(Dimensions.get('window').width * 0.8, 330);

export const SideDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer, openFirstAid } = useDrawer();

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isDrawerOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const handleOpenGuide = () => {
    openFirstAid();
  };

  return (
    <Modal
      visible={isDrawerOpen}
      transparent={true}
      animationType="none"
      onRequestClose={closeDrawer}
    >
      <View style={styles.overlayContainer}>
        {/* Backdrop Scrim */}
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <Pressable style={styles.backdropPressable} onPress={closeDrawer} />
        </Animated.View>

        {/* Sliding Drawer Panel */}
        <Animated.View
          style={[
            styles.drawerContainer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <ScrollView
            style={styles.drawerScroll}
            contentContainerStyle={styles.drawerContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header / App Branding */}
            <View style={styles.drawerHeader}>
              <View style={styles.headerTop}>
                <View style={styles.logoBadge}>
                  <Text style={styles.logoIcon}>🌍</Text>
                </View>
                <Pressable
                  style={styles.closeDrawerButton}
                  onPress={closeDrawer}
                  accessibilityLabel="Menüyü Kapat"
                >
                  <Ionicons name="close" size={22} color="#64748B" />
                </Pressable>
              </View>

              <Text style={styles.appName}>Deprem Takibi</Text>
              <Text style={styles.appSubtitle}>Menü & Güvenlik</Text>

              <View style={styles.offlineStatusCard}>
                <View style={styles.onlineDot} />
                <Text style={styles.offlineStatusText}>
                  Çevrimdışı Kılavuz Hazır
                </Text>
              </View>
            </View>

            {/* Menu Section */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>GÜVENLİK REHBERİ</Text>

              {/* Depremzede İlk Yardım Rehberi */}
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={handleOpenGuide}
              >
                <View style={styles.menuItemIconBox}>
                  <Ionicons name="medkit" size={22} color="#DC2626" />
                </View>
                <View style={styles.menuItemBody}>
                  <View style={styles.menuItemTitleRow}>
                    <Text style={styles.menuItemTitle}>
                      İlk Yardım Kılavuzu
                    </Text>
                    <View style={styles.badgeDanger}>
                      <Text style={styles.badgeDangerText}>Hayati</Text>
                    </View>
                  </View>
                  <Text style={styles.menuItemSubtitle}>
                    Duruma göre yönlendirme ve acil adımlar
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </Pressable>
            </View>

            {/* Clean Future Expansion Notice */}
            <View style={styles.futureNotice}>
              <Ionicons name="sparkles-outline" size={16} color="#64748B" />
              <Text style={styles.futureNoticeText}>
                İlerleyen adımlarda yeni araçlar ve özellikler bu menüye eklenecektir.
              </Text>
            </View>
          </ScrollView>

          {/* Drawer Footer */}
          <View style={styles.drawerFooter}>
            <Text style={styles.footerBrand}>Deprem Takip v1.0.0</Text>
            <Text style={styles.footerSub}>Afet anında %100 çevrimdışı çalışır</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  backdropPressable: {
    flex: 1,
  },
  drawerContainer: {
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 16,
  },
  drawerScroll: {
    flex: 1,
  },
  drawerContent: {
    paddingTop: Platform.OS === 'ios' ? 52 : 28,
    paddingBottom: 24,
  },
  drawerHeader: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logoIcon: {
    fontSize: 26,
  },
  closeDrawerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  appSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  offlineStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#16A34A',
  },
  offlineStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  menuSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  menuItemPressed: {
    backgroundColor: '#F8FAFC',
  },
  menuItemIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemBody: {
    flex: 1,
  },
  menuItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  menuItemSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
  },
  badgeDanger: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeDangerText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#DC2626',
  },
  futureNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  futureNoticeText: {
    flex: 1,
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  drawerFooter: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  footerBrand: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  footerSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
});
