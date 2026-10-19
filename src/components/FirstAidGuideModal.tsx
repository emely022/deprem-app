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
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  FIRST_AID_ARTICLES,
  DISASTER_CHECKLIST,
  EMERGENCY_NUMBERS,
} from '../data/firstAidData';
import { FirstAidArticle, ChecklistItem, EmergencyNumber } from '../types/guide';
import { normalizeForSearch } from '../utils/searchHelper';

interface Props {
  visible: boolean;
  initialCategory?: string | null;
  onClose: () => void;
}

type TabType = 'guide' | 'checklist' | 'numbers';

export const FirstAidGuideModal: React.FC<Props> = ({
  visible,
  initialCategory,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('guide');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('rubble_survival');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Reset category on open
  React.useEffect(() => {
    if (visible) {
      if (initialCategory) {
        if (initialCategory === 'checklist') {
          setActiveTab('checklist');
        } else if (initialCategory === 'numbers') {
          setActiveTab('numbers');
        } else {
          setActiveTab('guide');
          setSelectedCategory(initialCategory);
          setExpandedId(
            FIRST_AID_ARTICLES.find((a) => a.category === initialCategory)?.id || null
          );
        }
      } else {
        setActiveTab('guide');
        setSelectedCategory('all');
      }
    }
  }, [visible, initialCategory]);

  // Toggle checklist checkbox
  const toggleChecklist = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Direct phone call for emergency numbers
  const handleCall = (num: string) => {
    Linking.openURL(`tel:${num}`).catch(() => {});
  };

  // Filtered articles
  const filteredArticles = useMemo(() => {
    let result = FIRST_AID_ARTICLES;

    if (selectedCategory !== 'all') {
      result = result.filter((a) => a.category === selectedCategory);
    }

    if (searchQuery.trim().length > 0) {
      const q = normalizeForSearch(searchQuery);
      result = result.filter((a) => {
        const titleMatch = normalizeForSearch(a.title).includes(q);
        const descMatch = normalizeForSearch(a.shortDescription).includes(q);
        const stepsMatch = a.steps.some((s) =>
          normalizeForSearch(s.title + ' ' + s.description).includes(q)
        );
        return titleMatch || descMatch || stepsMatch;
      });
    }

    return result;
  }, [selectedCategory, searchQuery]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.badgeRow}>
              <View style={styles.offlinePill}>
                <Ionicons name="cloud-offline" size={12} color="#16A34A" />
                <Text style={styles.offlinePillText}>%100 ÇEVRİMDIŞI</Text>
              </View>
              <Text style={styles.headerSub}>İnternet bağlantısı gerektirmez</Text>
            </View>
            <Text style={styles.headerTitle}>Deprem Acil İlk Yardım</Text>
          </View>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#0F172A" />
          </Pressable>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tabItem, activeTab === 'guide' && styles.tabItemActive]}
            onPress={() => setActiveTab('guide')}
          >
            <Ionicons
              name="medkit"
              size={16}
              color={activeTab === 'guide' ? '#DC2626' : '#64748B'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'guide' && styles.tabTextActive,
              ]}
            >
              İlk Yardım
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tabItem,
              activeTab === 'checklist' && styles.tabItemActive,
            ]}
            onPress={() => setActiveTab('checklist')}
          >
            <Ionicons
              name="checkbox"
              size={16}
              color={activeTab === 'checklist' ? '#DC2626' : '#64748B'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'checklist' && styles.tabTextActive,
              ]}
            >
              Afet Çantası
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tabItem,
              activeTab === 'numbers' && styles.tabItemActive,
            ]}
            onPress={() => setActiveTab('numbers')}
          >
            <Ionicons
              name="call"
              size={16}
              color={activeTab === 'numbers' ? '#DC2626' : '#64748B'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'numbers' && styles.tabTextActive,
              ]}
            >
              Acil Numaralar
            </Text>
          </Pressable>
        </View>

        {/* TAB 1: FIRST AID GUIDE */}
        {activeTab === 'guide' && (
          <View style={styles.tabContent}>
            {/* Search Input */}
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="İlk yardım konusu veya belirti ara (ör: turnike, enkaz, kırık)..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </Pressable>
              )}
            </View>

            {/* Category filter pills */}
            <View style={styles.categoriesWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {[
                  { id: 'all', label: 'Tümü' },
                  { id: 'rubble', label: '🪨 Enkaz Altı' },
                  { id: 'crush', label: '⚠️ Crush Sendromu' },
                  { id: 'bleeding', label: '🩸 Kanamalar' },
                  { id: 'fracture', label: '🦴 Kırık & Omurga' },
                  { id: 'hypothermia', label: '❄️ Hipotermi' },
                  { id: 'behavior', label: '🏠 Çök-Kapan-Tutun' },
                ].map((cat) => (
                  <Pressable
                    key={cat.id}
                    style={[
                      styles.categoryChip,
                      selectedCategory === cat.id && styles.categoryChipActive,
                    ]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        selectedCategory === cat.id &&
                          styles.categoryChipTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Articles List */}
            <ScrollView
              style={styles.articlesList}
              contentContainerStyle={styles.articlesContent}
              showsVerticalScrollIndicator={false}
            >
              {filteredArticles.length === 0 ? (
                <View style={styles.emptyView}>
                  <Ionicons name="search-outline" size={44} color="#94A3B8" />
                  <Text style={styles.emptyTitle}>Sonuç bulunamadı</Text>
                  <Text style={styles.emptyDesc}>
                    Aramanızla eşleşen ilk yardım konusu bulunamadı.
                  </Text>
                </View>
              ) : (
                filteredArticles.map((article) => {
                  const isExpanded = expandedId === article.id;
                  return (
                    <View key={article.id} style={styles.articleCard}>
                      <Pressable
                        style={styles.articleHeader}
                        onPress={() =>
                          setExpandedId(isExpanded ? null : article.id)
                        }
                      >
                        <View style={styles.articleIconBox}>
                          <Ionicons
                            name={article.icon as any}
                            size={22}
                            color="#DC2626"
                          />
                        </View>
                        <View style={styles.articleInfo}>
                          {article.badge && (
                            <Text style={styles.articleBadge}>
                              {article.badge}
                            </Text>
                          )}
                          <Text style={styles.articleTitle}>
                            {article.title}
                          </Text>
                          <Text style={styles.articleShortDesc}>
                            {article.shortDescription}
                          </Text>
                        </View>
                        <Ionicons
                          name={isExpanded ? 'chevron-up' : 'chevron-down'}
                          size={20}
                          color="#64748B"
                        />
                      </Pressable>

                      {isExpanded && (
                        <View style={styles.articleExpandedContent}>
                          {/* Critical Warning Alert Box */}
                          {article.criticalWarning && (
                            <View style={styles.criticalWarningBox}>
                              <Ionicons
                                name="alert-circle"
                                size={22}
                                color="#DC2626"
                                style={styles.warningIcon}
                              />
                              <View style={styles.warningTextContainer}>
                                <Text style={styles.warningTitle}>
                                  HAYATİ UYARI
                                </Text>
                                <Text style={styles.warningBody}>
                                  {article.criticalWarning}
                                </Text>
                              </View>
                            </View>
                          )}

                          {/* Step-by-Step Directions */}
                          <Text style={styles.sectionHeaderTitle}>
                            📋 Adım Adım Yapılması Gerekenler
                          </Text>
                          {article.steps.map((step) => (
                            <View key={step.stepNumber} style={styles.stepItem}>
                              <View style={styles.stepNumberBadge}>
                                <Text style={styles.stepNumberText}>
                                  {step.stepNumber}
                                </Text>
                              </View>
                              <View style={styles.stepBody}>
                                <Text style={styles.stepTitle}>
                                  {step.title}
                                </Text>
                                <Text style={styles.stepDesc}>
                                  {step.description}
                                </Text>
                              </View>
                            </View>
                          ))}

                          {/* Practical Tips */}
                          {article.tips && article.tips.length > 0 && (
                            <View style={styles.tipsBox}>
                              <Text style={styles.tipsBoxTitle}>
                                💡 Hayat Kurtaran İpuçları
                              </Text>
                              {article.tips.map((tip, idx) => (
                                <View key={idx} style={styles.tipBulletRow}>
                                  <Text style={styles.tipBullet}>•</Text>
                                  <Text style={styles.tipBulletText}>
                                    {tip}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        )}

        {/* TAB 2: DISASTER CHECKLIST */}
        {activeTab === 'checklist' && (
          <ScrollView
            style={styles.tabContent}
            contentContainerStyle={styles.checklistContent}
          >
            <View style={styles.checklistBanner}>
              <Ionicons name="briefcase" size={28} color="#2563EB" />
              <View style={styles.checklistBannerText}>
                <Text style={styles.checklistBannerTitle}>
                  72 Saatlik Deprem Çantası
                </Text>
                <Text style={styles.checklistBannerDesc}>
                  Kurtarma ekipleri ulaşana kadar hayatta kalmanızı sağlayacak en temel malzemeler.
                </Text>
              </View>
            </View>

            {DISASTER_CHECKLIST.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <Pressable
                  key={item.id}
                  style={[
                    styles.checkItemCard,
                    isChecked && styles.checkItemCardDone,
                  ]}
                  onPress={() => toggleChecklist(item.id)}
                >
                  <Ionicons
                    name={isChecked ? 'checkbox' : 'square-outline'}
                    size={24}
                    color={isChecked ? '#16A34A' : '#94A3B8'}
                    style={styles.checkIcon}
                  />
                  <View style={styles.checkTextContainer}>
                    <View style={styles.checkTitleRow}>
                      <Text
                        style={[
                          styles.checkItemTitle,
                          isChecked && styles.checkItemTitleDone,
                        ]}
                      >
                        {item.title}
                      </Text>
                      {item.essential && (
                        <View style={styles.essentialBadge}>
                          <Text style={styles.essentialBadgeText}>Zorunlu</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.checkItemDesc}>
                      {item.description}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {/* TAB 3: EMERGENCY NUMBERS */}
        {activeTab === 'numbers' && (
          <ScrollView
            style={styles.tabContent}
            contentContainerStyle={styles.numbersContent}
          >
            <View style={styles.numbersNotice}>
              <Ionicons name="information-circle" size={20} color="#DC2626" />
              <Text style={styles.numbersNoticeText}>
                Deprem anında sesli arama yerine SMS veya internet mesajı tercih edilmelidir. Hatları yalnızca acil durumlar için arayın.
              </Text>
            </View>

            {EMERGENCY_NUMBERS.map((num) => (
              <View key={num.id} style={styles.numberCard}>
                <View style={styles.numberInfo}>
                  <Text style={styles.numberTitle}>{num.name}</Text>
                  <Text style={styles.numberDesc}>{num.description}</Text>
                  <Text style={styles.numberDigit}>{num.number}</Text>
                </View>
                <Pressable
                  style={styles.callActionButton}
                  onPress={() => handleCall(num.number)}
                >
                  <Ionicons name="call" size={20} color="#FFFFFF" />
                  <Text style={styles.callActionText}>Hemen Ara</Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  offlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  offlinePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#DC2626',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#DC2626',
    fontWeight: '700',
  },
  tabContent: {
    flex: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
  },
  categoriesWrapper: {
    marginBottom: 6,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  articlesList: {
    flex: 1,
  },
  articlesContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  articleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  articleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  articleIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleInfo: {
    flex: 1,
  },
  articleBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  articleShortDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  articleExpandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FAFAFA',
  },
  criticalWarningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
    gap: 10,
  },
  warningIcon: {
    marginTop: 2,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  warningBody: {
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 17,
    fontWeight: '600',
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10,
    marginBottom: 10,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 10,
  },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  stepBody: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  stepDesc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
    lineHeight: 17,
  },
  tipsBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  tipsBoxTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
    marginBottom: 6,
  },
  tipBulletRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  tipBullet: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '700',
  },
  tipBulletText: {
    flex: 1,
    fontSize: 12,
    color: '#15803D',
    lineHeight: 17,
  },
  emptyView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginTop: 10,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  checklistContent: {
    padding: 16,
    gap: 10,
    paddingBottom: 40,
  },
  checklistBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 4,
  },
  checklistBannerText: {
    flex: 1,
  },
  checklistBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E40AF',
  },
  checklistBannerDesc: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 2,
    lineHeight: 16,
  },
  checkItemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  checkItemCardDone: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    opacity: 0.7,
  },
  checkIcon: {
    marginTop: 2,
  },
  checkTextContainer: {
    flex: 1,
  },
  checkTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  checkItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  checkItemTitleDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  essentialBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  essentialBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
  },
  checkItemDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 16,
  },
  numbersContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  numbersNotice: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 6,
  },
  numbersNoticeText: {
    flex: 1,
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 17,
    fontWeight: '600',
  },
  numberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  numberInfo: {
    flex: 1,
  },
  numberTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  numberDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  numberDigit: {
    fontSize: 22,
    fontWeight: '900',
    color: '#DC2626',
    marginTop: 6,
    letterSpacing: 1,
  },
  callActionButton: {
    backgroundColor: '#16A34A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  callActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
