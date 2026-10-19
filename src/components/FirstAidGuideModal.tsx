import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SITUATIONS, GUIDE_METADATA } from '../data/firstAidData';
import { SituationCategory, TextSizeOption } from '../types/guide';
import { normalizeForSearch } from '../utils/searchHelper';
import { FirstAidIllustration } from './FirstAidIllustrations';

interface Props {
  visible: boolean;
  onClose: (reopenDrawer?: boolean) => void;
}

export const FirstAidGuideModal: React.FC<Props> = ({ visible, onClose }) => {
  const [selectedSituation, setSelectedSituation] = useState<SituationCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [textSize, setTextSize] = useState<TextSizeOption>('normal');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Reset state when closed
  React.useEffect(() => {
    if (!visible) {
      setSelectedSituation(null);
      setSearchQuery('');
    }
  }, [visible]);

  // Font size multiplier
  const fontMultiplier = textSize === 'xlarge' ? 1.35 : textSize === 'large' ? 1.18 : 1.0;

  const cycleTextSize = () => {
    if (textSize === 'normal') setTextSize('large');
    else if (textSize === 'large') setTextSize('xlarge');
    else setTextSize('normal');
  };

  const getTextSizeLabel = () => {
    if (textSize === 'normal') return 'A Punto';
    if (textSize === 'large') return 'A+ Büyük';
    return 'A++ İri';
  };

  // Color theme based on Day/Night (isDarkMode)
  const theme = {
    bg: isDarkMode ? '#0B0F19' : '#F8FAFC',
    cardBg: isDarkMode ? '#151D2F' : '#FFFFFF',
    textMain: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#CBD5E1' : '#475569',
    textMuted: isDarkMode ? '#94A3B8' : '#64748B',
    border: isDarkMode ? '#1E293B' : '#E2E8F0',
    primary: isDarkMode ? '#FBBF24' : '#DC2626',
    dangerBg: isDarkMode ? '#3B0D0D' : '#FEF2F2',
    dangerBorder: isDarkMode ? '#EF4444' : '#FCA5A5',
    dangerText: isDarkMode ? '#FCA5A5' : '#991B1B',
    highlightText: isDarkMode ? '#FDE047' : '#DC2626',
    badgeBg: isDarkMode ? '#1E293B' : '#F1F5F9',
    searchBg: isDarkMode ? '#151D2F' : '#FFFFFF',
    searchInput: isDarkMode ? '#FFFFFF' : '#0F172A',
  };

  // Filter situations based on search query
  const filteredSituations = useMemo(() => {
    if (!searchQuery.trim()) return SITUATIONS;
    const q = normalizeForSearch(searchQuery);

    return SITUATIONS.filter((sit) => {
      const titleMatch = normalizeForSearch(sit.title).includes(q);
      const subMatch = normalizeForSearch(sit.subtitle).includes(q);
      const alertMatch = sit.criticalAlert ? normalizeForSearch(sit.criticalAlert).includes(q) : false;
      const stepsMatch = sit.steps.some(
        (s) => normalizeForSearch(s.title).includes(q) || normalizeForSearch(s.description).includes(q)
      );
      const rolesMatch = (sit.citizenRole || []).some((r) => normalizeForSearch(r).includes(q));
      return titleMatch || subMatch || alertMatch || stepsMatch || rolesMatch;
    });
  }, [searchQuery]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={() => onClose(false)}
    >
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        {/* Top Header Bar */}
        <View style={[styles.header, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}>
          {/* Back button: Returns to drawer from landing, or to situation list from detail */}
          {selectedSituation ? (
            <Pressable
              style={styles.headerNavButton}
              onPress={() => setSelectedSituation(null)}
              accessibilityLabel="Durum Seçimine Dön"
            >
              <Ionicons name="arrow-back" size={20} color={theme.textMain} />
              <Text style={[styles.headerNavButtonText, { color: theme.textMain }]}>
                Geri
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.headerNavButton}
              onPress={() => onClose(true)}
              accessibilityLabel="Menüye Dön"
            >
              <Ionicons name="menu" size={20} color={theme.textMain} />
              <Text style={[styles.headerNavButtonText, { color: theme.textMain }]}>
                Menüye Dön
              </Text>
            </Pressable>
          )}

          {/* Accessibility Quick Controls (Punto Toggle + Gece/Gündüz Modu) */}
          <View style={styles.accessibilityControls}>
            {/* Punto (Text Size) Toggle */}
            <Pressable
              style={[styles.accButton, { backgroundColor: theme.badgeBg, borderColor: theme.border }]}
              onPress={cycleTextSize}
              accessibilityLabel="Yazı Boyutu"
            >
              <Text style={[styles.accButtonText, { color: theme.textMain }]}>
                {getTextSizeLabel()}
              </Text>
            </Pressable>

            {/* Gece / Gündüz Toggle */}
            <Pressable
              style={[
                styles.accButton,
                isDarkMode && styles.accButtonActive,
                { backgroundColor: isDarkMode ? '#1E293B' : theme.badgeBg, borderColor: theme.border },
              ]}
              onPress={() => setIsDarkMode(!isDarkMode)}
              accessibilityLabel="Gece Gündüz Modu"
            >
              <Ionicons
                name={isDarkMode ? 'moon' : 'sunny'}
                size={16}
                color={isDarkMode ? '#FBBF24' : '#F59E0B'}
              />
            </Pressable>

            {/* Close to main screen */}
            <Pressable
              style={styles.closeIconButton}
              onPress={() => onClose(false)}
              accessibilityLabel="Kılavuzu Kapat"
            >
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </Pressable>
          </View>
        </View>

        {/* SCREEN 1: SITUATION SELECTION WITH SEARCH BAR */}
        {!selectedSituation ? (
          <View style={styles.flexOne}>
            {/* Search Bar */}
            <View style={[styles.searchContainer, { backgroundColor: theme.searchBg, borderColor: theme.border }]}>
              <Ionicons name="search" size={18} color="#94A3B8" />
              <TextInput
                style={[styles.searchInput, { color: theme.searchInput, fontSize: 13 * fontMultiplier }]}
                placeholder="Konu veya belirti ara (ör: turnike, kırık, crush, enkaz)..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </Pressable>
              )}
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.landingContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Offline Status Badge */}
              <View style={styles.offlinePillRow}>
                <View style={styles.offlinePill}>
                  <Ionicons name="shield-checkmark" size={13} color="#16A34A" />
                  <Text style={styles.offlinePillText}>%100 ÇEVRİMDIŞI İLK YARDIM</Text>
                </View>
                <Text style={[styles.guideCountText, { color: theme.textMuted, fontSize: 11 * fontMultiplier }]}>
                  {filteredSituations.length} Konu
                </Text>
              </View>

              {/* No search results view */}
              {filteredSituations.length === 0 ? (
                <View style={styles.emptySearchBox}>
                  <Ionicons name="search-outline" size={40} color="#94A3B8" />
                  <Text style={[styles.emptySearchTitle, { color: theme.textMain }]}>
                    Eşleşen ilk yardım konusu bulunamadı
                  </Text>
                  <Text style={[styles.emptySearchSub, { color: theme.textMuted }]}>
                    "{searchQuery}" araması için farklı bir arama terimi deneyin.
                  </Text>
                  <Pressable style={styles.clearFilterBtn} onPress={() => setSearchQuery('')}>
                    <Text style={styles.clearFilterText}>Aramayı Temizle</Text>
                  </Pressable>
                </View>
              ) : (
                /* Situation Selection Cards with Visual Elements */
                <View style={styles.situationsGrid}>
                  {filteredSituations.map((sit) => {
                    const isCrush = sit.isCrushSyndromeSpecial;
                    return (
                      <Pressable
                        key={sit.id}
                        style={({ pressed }) => [
                          styles.situationCard,
                          {
                            backgroundColor: isCrush
                              ? isDarkMode ? '#2D0A0A' : '#FEF2F2'
                              : theme.cardBg,
                            borderColor: isCrush
                              ? '#EF4444'
                              : theme.border,
                          },
                          pressed && styles.cardPressed,
                        ]}
                        onPress={() => setSelectedSituation(sit)}
                      >
                        <View style={styles.cardHeaderRow}>
                          <View
                            style={[
                              styles.cardIconBox,
                              {
                                backgroundColor: isCrush
                                  ? '#DC2626'
                                  : isDarkMode ? '#1E293B' : '#FEE2E2',
                              },
                            ]}
                          >
                            <Ionicons
                              name={sit.icon as any}
                              size={22}
                              color={isCrush ? '#FFFFFF' : '#DC2626'}
                            />
                          </View>
                          <View style={styles.cardBadgeBox}>
                            <Text
                              style={[
                                styles.cardBadgeText,
                                {
                                  color: isCrush ? '#DC2626' : theme.textMuted,
                                  backgroundColor: isCrush
                                    ? isDarkMode ? '#1F2937' : '#FEE2E2'
                                    : theme.badgeBg,
                                },
                              ]}
                            >
                              {sit.badge}
                            </Text>
                          </View>
                        </View>

                        <Text
                          style={[
                            styles.situationTitle,
                            {
                              color: isCrush ? (isDarkMode ? '#FCA5A5' : '#991B1B') : theme.textMain,
                              fontSize: 16 * fontMultiplier,
                            },
                          ]}
                        >
                          {sit.title}
                        </Text>

                        <Text
                          style={[
                            styles.situationSubtitle,
                            {
                              color: isCrush ? (isDarkMode ? '#FEE2E2' : '#7F1D1D') : theme.textSub,
                              fontSize: 12 * fontMultiplier,
                            },
                          ]}
                        >
                          {sit.subtitle}
                        </Text>

                        {/* Inline Visual Diagram Preview */}
                        <FirstAidIllustration
                          situationId={sit.id}
                          isHighContrast={isDarkMode}
                          fontMultiplier={fontMultiplier}
                        />

                        <View style={styles.cardFooterRow}>
                          <Text
                            style={[
                              styles.viewGuideText,
                              { color: isCrush ? '#DC2626' : '#2563EB', fontSize: 12 * fontMultiplier },
                            ]}
                          >
                            Adım Adım Rehberi Aç →
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              )}

              {/* Güvenilirlik ve Tıbbi Kaynak Göstergeleri */}
              <View style={[styles.trustBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
                <View style={styles.trustTitleRow}>
                  <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                  <Text style={[styles.trustTitle, { color: theme.textMain, fontSize: 13 * fontMultiplier }]}>
                    {GUIDE_METADATA.reviewStatus}
                  </Text>
                </View>

                <Text style={[styles.trustDetail, { color: theme.textMuted, fontSize: 11 * fontMultiplier }]}>
                  • Denetleyen: {GUIDE_METADATA.medicalReviewer}
                </Text>
                <Text style={[styles.trustDetail, { color: theme.textMuted, fontSize: 11 * fontMultiplier }]}>
                  • Kaynaklar: {GUIDE_METADATA.sources.join(', ')}
                </Text>
                <Text style={[styles.trustDetail, { color: theme.textMuted, fontSize: 11 * fontMultiplier }]}>
                  • Sürüm: {GUIDE_METADATA.version} ({GUIDE_METADATA.lastUpdated})
                </Text>
                <Text style={[styles.trustDetail, { color: '#16A34A', fontSize: 11 * fontMultiplier, fontWeight: '700', marginTop: 4 }]}>
                  • {GUIDE_METADATA.offlineNote}
                </Text>
              </View>
            </ScrollView>
          </View>
        ) : (
          /* SCREEN 2: SINGLE TASK / DETAIL SCREEN ("Tek ekran, tek görev") */
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.detailContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Screen Header */}
            <View style={styles.detailTitleSection}>
              <View style={styles.detailBadgeRow}>
                <Text style={[styles.detailBadge, { color: theme.highlightText }]}>
                  {selectedSituation.badge}
                </Text>
                <Text style={[styles.singleTaskNotice, { color: theme.textMuted }]}>
                  Tek Ekran, Odaklanmış Rehber
                </Text>
              </View>
              <Text
                style={[
                  styles.detailMainTitle,
                  { color: theme.textMain, fontSize: 22 * fontMultiplier },
                ]}
              >
                {selectedSituation.title}
              </Text>
            </View>

            {/* Visual Diagram / Infographic for this situation */}
            <FirstAidIllustration
              situationId={selectedSituation.id}
              isHighContrast={isDarkMode}
              fontMultiplier={fontMultiplier}
            />

            {/* CRUSH SENDROMU ÖZEL TASARIMI (ASLA KENDİN YAP REHBERİ DEĞİLDİR) */}
            {selectedSituation.isCrushSyndromeSpecial ? (
              <View style={styles.crushContainer}>
                {/* Büyük Kırmızı Hayati Uyarı Kutusu */}
                <View
                  style={[
                    styles.crushAlertBox,
                    {
                      backgroundColor: theme.dangerBg,
                      borderColor: theme.dangerBorder,
                    },
                  ]}
                >
                  <View style={styles.crushAlertHeader}>
                    <Ionicons name="alert-circle" size={26} color="#DC2626" />
                    <Text
                      style={[
                        styles.crushAlertHeading,
                        { fontSize: 15 * fontMultiplier },
                      ]}
                    >
                      BU BİR "KENDİN YAP" (DIY) REHBERİ DEĞİLDİR!
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.crushAlertText,
                      { color: theme.dangerText, fontSize: 13 * fontMultiplier },
                    ]}
                  >
                    {selectedSituation.criticalAlert}
                  </Text>
                </View>

                {/* Sizin Rolünüz (Çevredeki Vatandaşlar) */}
                <View
                  style={[
                    styles.roleCard,
                    { backgroundColor: theme.cardBg, borderColor: theme.border },
                  ]}
                >
                  <View style={styles.roleHeaderRow}>
                    <View style={[styles.roleIconBox, { backgroundColor: '#EFF6FF' }]}>
                      <Ionicons name="people" size={20} color="#2563EB" />
                    </View>
                    <Text
                      style={[
                        styles.roleHeading,
                        { color: '#1E40AF', fontSize: 15 * fontMultiplier },
                      ]}
                    >
                      Sizin Rolünüz (Çevredeki Vatandaşlar)
                    </Text>
                  </View>
                  {selectedSituation.citizenRole?.map((role, idx) => (
                    <View key={idx} style={styles.roleItemRow}>
                      <Text style={[styles.roleBullet, { color: '#2563EB' }]}>✓</Text>
                      <Text
                        style={[
                          styles.roleItemText,
                          { color: theme.textMain, fontSize: 13 * fontMultiplier },
                        ]}
                      >
                        {role}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Profesyonel Sağlık Ekiplerinin Rolü (UMKE / 112) */}
                <View
                  style={[
                    styles.roleCard,
                    { backgroundColor: theme.cardBg, borderColor: theme.border },
                  ]}
                >
                  <View style={styles.roleHeaderRow}>
                    <View style={[styles.roleIconBox, { backgroundColor: '#DCFCE7' }]}>
                      <Ionicons name="medical" size={20} color="#16A34A" />
                    </View>
                    <Text
                      style={[
                        styles.roleHeading,
                        { color: '#15803D', fontSize: 15 * fontMultiplier },
                      ]}
                    >
                      Sağlık & Kurtarma Ekiplerinin Rolü (UMKE / 112)
                    </Text>
                  </View>
                  {selectedSituation.medicalRole?.map((role, idx) => (
                    <View key={idx} style={styles.roleItemRow}>
                      <Text style={[styles.roleBullet, { color: '#16A34A' }]}>🏥</Text>
                      <Text
                        style={[
                          styles.roleItemText,
                          { color: theme.textMain, fontSize: 13 * fontMultiplier },
                        ]}
                      >
                        {role}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Asla Yapılmaması Gerekenler */}
                {selectedSituation.donts && (
                  <View
                    style={[
                      styles.dontsBox,
                      { backgroundColor: theme.cardBg, borderColor: '#FCA5A5' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dontsTitle,
                        { color: '#DC2626', fontSize: 14 * fontMultiplier },
                      ]}
                    >
                      🚫 Asla Yapılmaması Gereken Hayati Hatalar
                    </Text>
                    {selectedSituation.donts.map((dont, idx) => (
                      <View key={idx} style={styles.dontItemRow}>
                        <Text style={styles.dontCross}>✕</Text>
                        <Text
                          style={[
                            styles.dontText,
                            { color: theme.textMain, fontSize: 13 * fontMultiplier },
                          ]}
                        >
                          {dont}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ) : (
              /* DİĞER DURUMLAR: TEK EKRAN ADIM ADIM REHBERİ */
              <View style={styles.standardStepsContainer}>
                {/* Critical Alert if exists */}
                {selectedSituation.criticalAlert && (
                  <View
                    style={[
                      styles.standardAlertBox,
                      {
                        backgroundColor: theme.dangerBg,
                        borderColor: theme.dangerBorder,
                      },
                    ]}
                  >
                    <Ionicons name="alert-circle" size={20} color="#DC2626" />
                    <Text
                      style={[
                        styles.standardAlertText,
                        { color: theme.dangerText, fontSize: 13 * fontMultiplier },
                      ]}
                    >
                      {selectedSituation.criticalAlert}
                    </Text>
                  </View>
                )}

                {/* Step By Step List */}
                <Text
                  style={[
                    styles.stepsSectionHeader,
                    { color: theme.textMain, fontSize: 15 * fontMultiplier },
                  ]}
                >
                  Sırasıyla Uygulamanız Gereken Adımlar:
                </Text>

                {selectedSituation.steps.map((step) => (
                  <View
                    key={step.stepNumber}
                    style={[
                      styles.stepCard,
                      { backgroundColor: theme.cardBg, borderColor: theme.border },
                    ]}
                  >
                    <View style={styles.stepNumBadge}>
                      <Text style={styles.stepNumText}>{step.stepNumber}</Text>
                    </View>
                    <View style={styles.stepContent}>
                      <Text
                        style={[
                          styles.stepTitle,
                          { color: theme.textMain, fontSize: 15 * fontMultiplier },
                        ]}
                      >
                        {step.title}
                      </Text>
                      <Text
                        style={[
                          styles.stepDescription,
                          { color: theme.textSub, fontSize: 13 * fontMultiplier },
                        ]}
                      >
                        {step.description}
                      </Text>
                    </View>
                  </View>
                ))}

                {/* Yapılmaması Gerekenler */}
                {selectedSituation.donts && selectedSituation.donts.length > 0 && (
                  <View
                    style={[
                      styles.dontsBox,
                      { backgroundColor: theme.cardBg, borderColor: theme.border },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dontsTitle,
                        { color: '#DC2626', fontSize: 14 * fontMultiplier },
                      ]}
                    >
                      🚫 Kaçınılması Gereken Hatalar
                    </Text>
                    {selectedSituation.donts.map((d, i) => (
                      <View key={i} style={styles.dontItemRow}>
                        <Text style={styles.dontCross}>✕</Text>
                        <Text
                          style={[
                            styles.dontText,
                            { color: theme.textSub, fontSize: 12 * fontMultiplier },
                          ]}
                        >
                          {d}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Bottom Navigation Buttons */}
            <View style={styles.bottomButtons}>
              <Pressable
                style={[styles.bottomBackButton, { borderColor: theme.border }]}
                onPress={() => setSelectedSituation(null)}
              >
                <Ionicons name="arrow-back" size={18} color={theme.textMain} />
                <Text style={[styles.bottomBackButtonText, { color: theme.textMain }]}>
                  Geri Dön
                </Text>
              </Pressable>

              <Pressable
                style={styles.bottomMenuButton}
                onPress={() => onClose(true)}
              >
                <Ionicons name="menu" size={18} color="#FFFFFF" />
                <Text style={styles.bottomMenuButtonText}>Menüye Dön</Text>
              </Pressable>
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  flexOne: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  headerNavButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  accessibilityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accButton: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accButtonActive: {
    backgroundColor: '#1E293B',
  },
  accButtonText: {
    fontSize: 11,
    fontWeight: '800',
  },
  closeIconButton: {
    padding: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
  },
  clearSearchBtn: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  landingContent: {
    padding: 16,
    paddingBottom: 40,
  },
  offlinePillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  offlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  offlinePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
    letterSpacing: 0.5,
  },
  guideCountText: {
    fontWeight: '600',
  },
  situationsGrid: {
    gap: 12,
    marginBottom: 20,
  },
  situationCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBadgeBox: {
    borderRadius: 6,
  },
  cardBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    textTransform: 'uppercase',
  },
  situationTitle: {
    fontWeight: '800',
    marginBottom: 4,
  },
  situationSubtitle: {
    lineHeight: 17,
    marginBottom: 6,
  },
  cardFooterRow: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  viewGuideText: {
    fontWeight: '700',
  },
  emptySearchBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  emptySearchTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 10,
    textAlign: 'center',
  },
  emptySearchSub: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 18,
  },
  clearFilterBtn: {
    marginTop: 14,
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearFilterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  trustBox: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    gap: 4,
  },
  trustTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  trustTitle: {
    fontWeight: '800',
  },
  trustDetail: {
    lineHeight: 16,
  },
  detailContent: {
    padding: 16,
    paddingBottom: 40,
  },
  detailTitleSection: {
    marginBottom: 14,
  },
  detailBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailBadge: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  singleTaskNotice: {
    fontSize: 11,
    fontWeight: '500',
  },
  detailMainTitle: {
    fontWeight: '900',
    lineHeight: 28,
  },
  crushContainer: {
    gap: 14,
    marginBottom: 20,
  },
  crushAlertBox: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    gap: 8,
  },
  crushAlertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  crushAlertHeading: {
    fontWeight: '900',
    color: '#DC2626',
    flex: 1,
  },
  crushAlertText: {
    lineHeight: 20,
    fontWeight: '600',
  },
  roleCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  roleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  roleIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleHeading: {
    fontWeight: '800',
    flex: 1,
  },
  roleItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  roleBullet: {
    fontSize: 14,
    fontWeight: '900',
    marginTop: 1,
  },
  roleItemText: {
    flex: 1,
    lineHeight: 19,
    fontWeight: '500',
  },
  dontsBox: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  dontsTitle: {
    fontWeight: '800',
    marginBottom: 4,
  },
  dontItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  dontCross: {
    color: '#DC2626',
    fontWeight: '900',
    fontSize: 13,
    marginTop: 2,
  },
  dontText: {
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
  standardStepsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  standardAlertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    gap: 8,
    marginBottom: 4,
  },
  standardAlertText: {
    flex: 1,
    lineHeight: 18,
    fontWeight: '600',
  },
  stepsSectionHeader: {
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 4,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  stepNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontWeight: '800',
    marginBottom: 4,
  },
  stepDescription: {
    lineHeight: 19,
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  bottomBackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  bottomBackButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  bottomMenuButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    gap: 6,
  },
  bottomMenuButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
