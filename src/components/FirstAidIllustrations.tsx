import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IllustrationProps {
  situationId: string;
  isHighContrast: boolean;
  fontMultiplier: number;
}

export const FirstAidIllustration: React.FC<IllustrationProps> = ({
  situationId,
  isHighContrast,
  fontMultiplier,
}) => {
  const textColor = isHighContrast ? '#FFFFFF' : '#0F172A';
  const subColor = isHighContrast ? '#E5E7EB' : '#475569';
  const boxBg = isHighContrast ? '#1E293B' : '#F1F5F9';
  const borderColor = isHighContrast ? '#475569' : '#CBD5E1';

  switch (situationId) {
    case 'rubble_trapped':
      return (
        <View style={[styles.diagramCard, { backgroundColor: boxBg, borderColor }]}>
          <Text style={[styles.diagramHeaderTitle, { color: textColor, fontSize: 13 * fontMultiplier }]}>
            📊 Enkaz Altı Ses & Korunma Şeması
          </Text>
          <View style={styles.flowRow}>
            {/* Box 1: Solunum */}
            <View style={styles.diagramNode}>
              <View style={[styles.iconCircle, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="medical" size={20} color="#2563EB" />
              </View>
              <Text style={[styles.nodeTitle, { color: textColor, fontSize: 11 * fontMultiplier }]}>
                Ağız & Burun
              </Text>
              <Text style={[styles.nodeDesc, { color: subColor, fontSize: 10 * fontMultiplier }]}>
                Kumaşla örtün
              </Text>
            </View>

            <Ionicons name="arrow-forward" size={16} color={subColor} style={styles.flowArrow} />

            {/* Box 2: Ritmik Vuruş */}
            <View style={[styles.diagramNode, styles.nodeHighlight]}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="radio" size={20} color="#DC2626" />
              </View>
              <Text style={[styles.nodeTitle, { color: '#DC2626', fontSize: 11 * fontMultiplier }]}>
                3 Ritmik Vuruş
              </Text>
              <Text style={[styles.nodeDesc, { color: subColor, fontSize: 10 * fontMultiplier }]}>
                Tık - Tık - Tık
              </Text>
            </View>

            <Ionicons name="arrow-forward" size={16} color={subColor} style={styles.flowArrow} />

            {/* Box 3: Enerji */}
            <View style={styles.diagramNode}>
              <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="battery-charging" size={20} color="#16A34A" />
              </View>
              <Text style={[styles.nodeTitle, { color: textColor, fontSize: 11 * fontMultiplier }]}>
                Oksijen & Güç
              </Text>
              <Text style={[styles.nodeDesc, { color: subColor, fontSize: 10 * fontMultiplier }]}>
                Cenin pozisyonu
              </Text>
            </View>
          </View>
        </View>
      );

    case 'crush_syndrome':
      return (
        <View style={[styles.diagramCard, { backgroundColor: isHighContrast ? '#450A0A' : '#FEF2F2', borderColor: '#EF4444' }]}>
          <Text style={[styles.diagramHeaderTitle, { color: '#DC2626', fontSize: 13 * fontMultiplier }]}>
            🛑 Crush (Ezilme) Hayati Akış Şeması
          </Text>
          <View style={styles.flowRow}>
            {/* Box 1 */}
            <View style={styles.diagramNode}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="cube" size={20} color="#DC2626" />
              </View>
              <Text style={[styles.nodeTitle, { color: textColor, fontSize: 11 * fontMultiplier }]}>
                1. Bası Altında
              </Text>
              <Text style={[styles.nodeDesc, { color: subColor, fontSize: 10 * fontMultiplier }]}>
                Toksin birikir
              </Text>
            </View>

            <Ionicons name="arrow-forward" size={16} color="#DC2626" style={styles.flowArrow} />

            {/* Box 2: Kırmızı Kritik Nokta */}
            <View style={[styles.diagramNode, { borderColor: '#DC2626', borderWidth: 2, backgroundColor: isHighContrast ? '#7F1D1D' : '#FFFFFF' }]}>
              <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="water" size={20} color="#2563EB" />
              </View>
              <Text style={[styles.nodeTitle, { color: '#2563EB', fontSize: 11 * fontMultiplier, fontWeight: '900' }]}>
                2. UMKE Serumu
              </Text>
              <Text style={[styles.nodeDesc, { color: subColor, fontSize: 10 * fontMultiplier }]}>
                Damar yolu zorunlu
              </Text>
            </View>

            <Ionicons name="arrow-forward" size={16} color="#DC2626" style={styles.flowArrow} />

            {/* Box 3 */}
            <View style={styles.diagramNode}>
              <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="checkmark-done-circle" size={20} color="#16A34A" />
              </View>
              <Text style={[styles.nodeTitle, { color: textColor, fontSize: 11 * fontMultiplier }]}>
                3. Kaldırma
              </Text>
              <Text style={[styles.nodeDesc, { color: subColor, fontSize: 10 * fontMultiplier }]}>
                Hekim kontrolüyle
              </Text>
            </View>
          </View>
          <View style={styles.crushBannerSub}>
            <Text style={[styles.crushBannerText, { fontSize: 11 * fontMultiplier }]}>
              ⚠️ Serum verilmeden moloz kaldırılırsa toksinler kalbi durdurabilir.
            </Text>
          </View>
        </View>
      );

    case 'heavy_bleeding':
      return (
        <View style={[styles.diagramCard, { backgroundColor: boxBg, borderColor }]}>
          <Text style={[styles.diagramHeaderTitle, { color: textColor, fontSize: 13 * fontMultiplier }]}>
            🩸 Kanama Durdurma & Turnike Konum Şeması
          </Text>
          <View style={styles.flowRow}>
            {/* Box 1 */}
            <View style={styles.diagramNode}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="hand-left" size={20} color="#DC2626" />
              </View>
              <Text style={[styles.nodeTitle, { color: textColor, fontSize: 11 * fontMultiplier }]}>
                Doğrudan Bası
              </Text>
              <Text style={[styles.nodeDesc, { color: subColor, fontSize: 10 * fontMultiplier }]}>
                Temiz bezle tampon
              </Text>
            </View>

            <Ionicons name="arrow-forward" size={16} color={subColor} style={styles.flowArrow} />

            {/* Box 2 */}
            <View style={styles.diagramNode}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="git-commit" size={20} color="#D97706" />
              </View>
              <Text style={[styles.nodeTitle, { color: textColor, fontSize: 11 * fontMultiplier }]}>
                5-7 cm Mesafe
              </Text>
              <Text style={[styles.nodeDesc, { color: subColor, fontSize: 10 * fontMultiplier }]}>
                Yaranın üstüne turnike
              </Text>
            </View>

            <Ionicons name="arrow-forward" size={16} color={subColor} style={styles.flowArrow} />

            {/* Box 3 */}
            <View style={styles.diagramNode}>
              <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="time" size={20} color="#2563EB" />
              </View>
              <Text style={[styles.nodeTitle, { color: textColor, fontSize: 11 * fontMultiplier }]}>
                Saat Yaz (T:)
              </Text>
              <Text style={[styles.nodeDesc, { color: subColor, fontSize: 10 * fontMultiplier }]}>
                Alına saat belirtin
              </Text>
            </View>
          </View>
        </View>
      );

    case 'fracture_spine':
      return (
        <View style={[styles.diagramCard, { backgroundColor: boxBg, borderColor }]}>
          <Text style={[styles.diagramHeaderTitle, { color: textColor, fontSize: 13 * fontMultiplier }]}>
            🦴 Kırık Sabitleme & Atelleme Şeması
          </Text>
          <View style={styles.flowRow}>
            {/* Box 1 */}
            <View style={styles.diagramNode}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="close-circle" size={20} color="#DC2626" />
              </View>
              <Text style={[styles.nodeTitle, { color: textColor, fontSize: 11 * fontMultiplier }]}>
                Hareketsiz Tut
              </Text>
              <Text style={[styles.nodeDesc, { color: subColor, fontSize: 10 * fontMultiplier }]}>
                Düzeltmeye çalışma
              </Text>
            </View>

            <Ionicons name="arrow-forward" size={16} color={subColor} style={styles.flowArrow} />

            {/* Box 2 */}
            <View style={styles.diagramNode}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="layers" size={20} color="#D97706" />
              </View>
              <Text style={[styles.nodeTitle, { color: textColor, fontSize: 11 * fontMultiplier }]}>
                Sert Atel Koy
              </Text>
              <Text style={[styles.nodeDesc, { color: subColor, fontSize: 10 * fontMultiplier }]}>
                Karton veya tahta
              </Text>
            </View>

            <Ionicons name="arrow-forward" size={16} color={subColor} style={styles.flowArrow} />

            {/* Box 3 */}
            <View style={styles.diagramNode}>
              <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="shield-checkmark" size={20} color="#16A34A" />
              </View>
              <Text style={[styles.nodeTitle, { color: textColor, fontSize: 11 * fontMultiplier }]}>
                İki Eklemi Bağla
              </Text>
              <Text style={[styles.nodeDesc, { color: subColor, fontSize: 10 * fontMultiplier }]}>
                Üst ve alt eklem
              </Text>
            </View>
          </View>
        </View>
      );

    case 'earthquake_moment':
      return (
        <View style={[styles.diagramCard, { backgroundColor: boxBg, borderColor }]}>
          <Text style={[styles.diagramHeaderTitle, { color: textColor, fontSize: 13 * fontMultiplier }]}>
            🏠 Çök - Kapan - Tutun Hayat Üçgeni Şeması
          </Text>
          <View style={styles.flowRow}>
            {/* Box 1 */}
            <View style={styles.diagramNode}>
              <View style={[styles.iconCircle, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="body" size={20} color="#2563EB" />
              </View>
              <Text style={[styles.nodeTitle, { color: textColor, fontSize: 11 * fontMultiplier }]}>
                1. ÇÖK
              </Text>
              <Text style={[styles.nodeDesc, { color: subColor, fontSize: 10 * fontMultiplier }]}>
                Sağlam eşya yanı
              </Text>
            </View>

            <Ionicons name="arrow-forward" size={16} color={subColor} style={styles.flowArrow} />

            {/* Box 2 */}
            <View style={styles.diagramNode}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="shield" size={20} color="#D97706" />
              </View>
              <Text style={[styles.nodeTitle, { color: textColor, fontSize: 11 * fontMultiplier }]}>
                2. KAPAN
              </Text>
              <Text style={[styles.nodeDesc, { color: subColor, fontSize: 10 * fontMultiplier }]}>
                Baş ve boynu ört
              </Text>
            </View>

            <Ionicons name="arrow-forward" size={16} color={subColor} style={styles.flowArrow} />

            {/* Box 3 */}
            <View style={styles.diagramNode}>
              <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="hand-right" size={20} color="#16A34A" />
              </View>
              <Text style={[styles.nodeTitle, { color: textColor, fontSize: 11 * fontMultiplier }]}>
                3. TUTUN
              </Text>
              <Text style={[styles.nodeDesc, { color: subColor, fontSize: 10 * fontMultiplier }]}>
                Sarsıntı bitene dek
              </Text>
            </View>
          </View>
        </View>
      );

    case 'hypothermia_cold':
      return (
        <View style={[styles.diagramCard, { backgroundColor: boxBg, borderColor }]}>
          <Text style={[styles.diagramHeaderTitle, { color: textColor, fontSize: 13 * fontMultiplier }]}>
            ❄️ Vücut Isısını Koruma & Zemin İzolasyon Şeması
          </Text>
          <View style={styles.flowRow}>
            {/* Box 1 */}
            <View style={styles.diagramNode}>
              <View style={[styles.iconCircle, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="layers" size={20} color="#2563EB" />
              </View>
              <Text style={[styles.nodeTitle, { color: textColor, fontSize: 11 * fontMultiplier }]}>
                Zemini Kes
              </Text>
              <Text style={[styles.nodeDesc, { color: subColor, fontSize: 10 * fontMultiplier }]}>
                Karton / köpük ser
              </Text>
            </View>

            <Ionicons name="arrow-forward" size={16} color={subColor} style={styles.flowArrow} />

            {/* Box 2 */}
            <View style={styles.diagramNode}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="shirt" size={20} color="#D97706" />
              </View>
              <Text style={[styles.nodeTitle, { color: textColor, fontSize: 11 * fontMultiplier }]}>
                Islak Giysiyi At
              </Text>
              <Text style={[styles.nodeDesc, { color: subColor, fontSize: 10 * fontMultiplier }]}>
                Kuru battaniye sar
              </Text>
            </View>

            <Ionicons name="arrow-forward" size={16} color={subColor} style={styles.flowArrow} />

            {/* Box 3 */}
            <View style={styles.diagramNode}>
              <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="flame" size={20} color="#16A34A" />
              </View>
              <Text style={[styles.nodeTitle, { color: textColor, fontSize: 11 * fontMultiplier }]}>
                Gövdeden Isıt
              </Text>
              <Text style={[styles.nodeDesc, { color: subColor, fontSize: 10 * fontMultiplier }]}>
                Kademeli ve ılık
              </Text>
            </View>
          </View>
        </View>
      );

    default:
      return null;
  }
};

const styles = StyleSheet.create({
  diagramCard: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    marginVertical: 10,
  },
  diagramHeaderTitle: {
    fontWeight: '800',
    marginBottom: 12,
  },
  flowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  diagramNode: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  nodeHighlight: {
    borderRadius: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  nodeTitle: {
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 2,
  },
  nodeDesc: {
    textAlign: 'center',
    lineHeight: 13,
  },
  flowArrow: {
    marginHorizontal: 2,
  },
  crushBannerSub: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FCA5A5',
  },
  crushBannerText: {
    color: '#991B1B',
    fontWeight: '700',
    textAlign: 'center',
  },
});
