import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SITUATIONS, GUIDE_METADATA } from '../data/firstAidData';
import { SituationCategory, TextSizeOption } from '../types/guide';

interface Props {
  visible: boolean;
  onClose: (reopenDrawer?: boolean) => void;
}

export const FirstAidGuideModal: React.FC<Props> = ({ visible, onClose }) => {
  const [selectedSituation, setSelectedSituation] = useState<SituationCategory | null>(null);
  const [textSize, setTextSize] = useState<TextSizeOption>('normal');
  const [highContrast, setHighContrast] = useState(false);

  // Reset state when closed
  React.useEffect(() => {
    if (!visible) {
      setSelectedSituation(null);
    }
  }, [visible]);

  if (!visible) return null;

  // Font size multiplier
  const fontMultiplier = textSize === 'xlarge' ? 1.35 : textSize === 'large' ? 1.18 : 1.0;

  const cycleTextSize = () => {
    if (textSize === 'normal') setTextSize('large');
    else if (textSize === 'large') setTextSize('xlarge');
    else setTextSize('normal');
  };

  const getTextSizeLabel = () => {
    if (textSize === 'normal') return 'A Metin';
    if (textSize === 'large') return 'A+ Büyük';
    return 'A++ Çok Büyük';
  };

  // Color theme based on High Contrast
  const theme = {
    bg: highContrast ? '#000000' : '#F8FAFC',
    cardBg: highContrast ? '#111827' : '#FFFFFF',
    textMain: highContrast ? '#FFFFFF' : '#0F172A',
    textSub: highContrast ? '#E5E7EB' : '#475569',
    textMuted: highContrast ? '#9CA3AF' : '#64748B',
    border: highContrast ? '#374151' : '#E2E8F0',
    primary: highContrast ? '#FBBF24' : '#DC2626',
    dangerBg: highContrast ? '#450A0A' : '#FEF2F2',
    dangerBorder: highContrast ? '#EF4444' : '#FCA5A5',
    dangerText: highContrast ? '#FCA5A5' : '#991B1B',
    highlightText: highContrast ? '#FDE047' : '#DC2626',
    badgeBg: highContrast ? '#1F2937' : '#F1F5F9',
  };

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
                Durum Değiştir
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

          {/* Accessibility Quick Controls (Text Size + High Contrast) */}
          <View style={styles.accessibilityControls}>
            {/* Text Size Toggle */}
            <Pressable
              style={[styles.accButton, { backgroundColor: theme.badgeBg, borderColor: theme.border }]}
              onPress={cycleTextSize}
            >
              <Text style={[styles.accButtonText, { color: theme.textMain }]}>
                {getTextSizeLabel()}
              </Text>
            </Pressable>

            {/* High Contrast Toggle */}
            <Pressable
              style={[
                styles.accButton,
                highContrast && styles.accButtonActive,
                { backgroundColor: highContrast ? '#F59E0B' : theme.badgeBg, borderColor: theme.border },
              ]}
              onPress={() => setHighContrast(!highContrast)}
            >
              <Ionicons
                name="contrast"
                size={16}
                color={highContrast ? '#000000' : theme.textMain}
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

        {/* SCREEN 1: SITUATION SELECTION ("Neredeyim ve ne yaşıyorum?") */}
        {!selectedSituation ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.landingContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Calm, low-text introductory banner */}
            <View style={styles.landingHeader}>
              <View style={styles.offlinePill}>
                <Ionicons name="shield-checkmark" size={13} color="#16A34A" />
                <Text style={styles.offlinePillText}>%100 ÇEVRİMDIŞI REHBER</Text>
              </View>
              <Text
                style={[
                  styles.landingQuestion,
                  { color: theme.textMain, fontSize: 22 * fontMultiplier },
                ]}
              >
                Neredeyim ve ne yaşıyorum?
              </Text>
              <Text
                style={[
                  styles.landingSubtitle,
                  { color: theme.textSub, fontSize: 13 * fontMultiplier },
                ]}
              >
                Bulunduğunuz duruma dokunarak adım adım hayati yönergelere ulaşın:
              </Text>
            </View>

            {/* Situation Selection Cards */}
            <View style={styles.situationsGrid}>
              {SITUATIONS.map((sit) => {
                const isCrush = sit.isCrushSyndromeSpecial;
                return (
                  <Pressable
                    key={sit.id}
                    style={({ pressed }) => [
                      styles.situationCard,
                      {
                        backgroundColor: isCrush
                          ? highContrast ? '#450A0A' : '#FEF2F2'
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
                              : highContrast ? '#374151' : '#FEE2E2',
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
                                ? highContrast ? '#1F2937' : '#FEE2E2'
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
                          color: isCrush ? (highContrast ? '#FCA5A5' : '#991B1B') : theme.textMain,
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
                          color: isCrush ? (highContrast ? '#FEE2E2' : '#7F1D1D') : theme.textSub,
                          fontSize: 12 * fontMultiplier,
                        },
                      ]}
                    >
                      {sit.subtitle}
                    </Text>

                    <View style={styles.cardFooterRow}>
                      <Text
                        style={[
                          styles.viewGuideText,
                          { color: isCrush ? '#DC2626' : '#2563EB', fontSize: 12 * fontMultiplier },
                        ]}
                      >
                        Yönergeyi Gör →
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

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
                  Başka Bir Durum Seç
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
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accButtonActive: {
    backgroundColor: '#F59E0B',
  },
  accButtonText: {
    fontSize: 11,
    fontWeight: '800',
  },
  closeIconButton: {
    padding: 6,
  },
  scrollView: {
    flex: 1,
  },
  landingContent: {
    padding: 16,
    paddingBottom: 40,
  },
  landingHeader: {
    marginBottom: 16,
  },
  offlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 8,
  },
  offlinePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
    letterSpacing: 0.5,
  },
  landingQuestion: {
    fontWeight: '900',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  landingSubtitle: {
    lineHeight: 18,
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
    opacity: 0.85,
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
    marginBottom: 10,
  },
  cardFooterRow: {
    alignItems: 'flex-end',
  },
  viewGuideText: {
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
    marginBottom: 16,
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
