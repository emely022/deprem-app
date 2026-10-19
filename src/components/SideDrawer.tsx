import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  Linking,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDrawer } from '../context/DrawerContext';

const DRAWER_WIDTH = Math.min(Dimensions.get('window').width * 0.82, 340);

export const SideDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    closeDrawer,
    openFirstAid,
    openWhistle,
    openChecklist,
    openNumbers,
  } = useDrawer();

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isDrawerOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const handleCall112 = () => {
    Linking.openURL('tel:112').catch(() => {});
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
        <Animated.View
          style={[styles.backdrop, { opacity: fadeAnim }]}
        >
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
            {/* Header Profile / App Branding */}
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

              <Text style={styles.appName}>Deprem Takip & Güvenlik</Text>
              <Text style={styles.appSubtitle}>Afet & Acil Durum Merkezi</Text>

              <View style={styles.offlineStatusCard}>
                <View style={styles.onlineDot} />
                <Text style={styles.offlineStatusText}>
                  Çevrimdışı Kılavuz ve Araçlar Hazır
                </Text>
              </View>
            </View>

            {/* Quick Emergency Action Banner */}
            <View style={styles.emergencyCard}>
              <View style={styles.emergencyCardHeader}>
                <View style={styles.emergencyPulseIcon}>
                  <Ionicons name="warning" size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.emergencyCardTitle}>Acil Durum Hızlı Eylemler</Text>
              </View>

              <View style={styles.emergencyButtonsRow}>
                {/* S.O.S Whistle button */}
                <Pressable
                  style={({ pressed }) => [
                    styles.sosButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={openWhistle}
                >
                  <Ionicons name="megaphone" size={18} color="#FFFFFF" />
                  <Text style={styles.sosButtonText}>S.O.S Düdük</Text>
                </Pressable>

                {/* 112 Direct Call button */}
                <Pressable
                  style={({ pressed }) => [
                    styles.call112Button,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={handleCall112}
                >
                  <Ionicons name="call" size={18} color="#FFFFFF" />
                  <Text style={styles.call112ButtonText}>112 Acil</Text>
                </Pressable>
              </View>
            </View>

            {/* Section: Afet & İlk Yardım Araçları */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>GÜVENLİK & İLK YARDIM</Text>

              {/* 1. Depremzede İlk Yardım Rehberi */}
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={() => openFirstAid()}
              >
                <View
                  style={[
                    styles.menuItemIconBox,
                    { backgroundColor: '#FEE2E2' },
                  ]}
                >
                  <Ionicons name="medkit" size={20} color="#DC2626" />
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
                    Enkaz, Crush sendromu, kanamalar, kırıklar
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </Pressable>

              {/* 2. Acil Durum Düdüğü */}
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={openWhistle}
              >
                <View
                  style={[
                    styles.menuItemIconBox,
                    { backgroundColor: '#FEF3C7' },
                  ]}
                >
                  <Ionicons name="volume-high" size={20} color="#D97706" />
                </View>
                <View style={styles.menuItemBody}>
                  <View style={styles.menuItemTitleRow}>
                    <Text style={styles.menuItemTitle}>
                      Acil Durum Düdüğü (S.O.S)
                    </Text>
                    <View style={styles.badgeWarning}>
                      <Text style={styles.badgeWarningText}>Sesli / Flaş</Text>
                    </View>
                  </View>
                  <Text style={styles.menuItemSubtitle}>
                    Enkaz altında ses duyurma ve flaşör
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </Pressable>

              {/* 3. Afet Çantası Kontrol Listesi */}
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={openChecklist}
              >
                <View
                  style={[
                    styles.menuItemIconBox,
                    { backgroundColor: '#EFF6FF' },
                  ]}
                >
                  <Ionicons name="briefcase" size={20} color="#2563EB" />
                </View>
                <View style={styles.menuItemBody}>
                  <View style={styles.menuItemTitleRow}>
                    <Text style={styles.menuItemTitle}>
                      Deprem Çantası Listesi
                    </Text>
                    <View style={styles.badgePrimary}>
                      <Text style={styles.badgePrimaryText}>72 Saat</Text>
                    </View>
                  </View>
                  <Text style={styles.menuItemSubtitle}>
                    Zorunlu gıda, su ve hayatta kalma araçları
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </Pressable>

              {/* 4. Acil Durum Numaraları */}
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={openNumbers}
              >
                <View
                  style={[
                    styles.menuItemIconBox,
                    { backgroundColor: '#DCFCE7' },
                  ]}
                >
                  <Ionicons name="call" size={20} color="#16A34A" />
                </View>
                <View style={styles.menuItemBody}>
                  <Text style={styles.menuItemTitle}>
                    Acil Numaralar & Rehber
                  </Text>
                  <Text style={styles.menuItemSubtitle}>
                    112, 122 AFAD, İtfaiye, Doğalgaz
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </Pressable>
            </View>

            {/* Extensible Future Items Notice */}
            <View style={styles.futureNotice}>
              <Ionicons name="bulb-outline" size={16} color="#64748B" />
              <Text style={styles.futureNoticeText}>
                Yeni afet koruma araçları ve rehberler buraya eklenecektir.
              </Text>
            </View>
          </ScrollView>

          {/* Drawer Footer */}
          <View style={styles.drawerFooter}>
            <Text style={styles.footerBrand}>Deprem Güvenlik Sistemi</Text>
            <Text style={styles.footerSub}>v1.0.0 • Çevrimdışı Acil Kılavuz</Text>
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
    shadowOpacity: 0.25,
    shadowRadius: 16,
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
  emergencyCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  emergencyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  emergencyPulseIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#991B1B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emergencyButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sosButton: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sosButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  call112Button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  call112ButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
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
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 6,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  menuItemPressed: {
    backgroundColor: '#F8FAFC',
  },
  menuItemIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
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
    marginTop: 2,
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
  badgeWarning: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeWarningText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },
  badgePrimary: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgePrimaryText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  futureNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginHorizontal: 16,
    marginTop: 18,
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
    lineHeight: 15,
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
