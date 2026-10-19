import { SituationCategory, GuideMetadata } from '../types/guide';

export const GUIDE_METADATA: GuideMetadata = {
  medicalReviewer: 'Afet Tıbbı ve Acil Sağlık Uzman Kurulu',
  reviewStatus: 'Klinik Acil Protokollere Uygun Olarak İncelenmiştir',
  sources: [
    'T.C. Sağlık Bakanlığı Acil Sağlık Hizmetleri Genel Müdürlüğü',
    'AFAD (Afet ve Acil Durum Yönetimi Başkanlığı)',
    'Türk Kızılayı İlkyardım Eğitim El Kitabı',
    'ITLS (International Trauma Life Support) Afet Ezilme Kılavuzu',
  ],
  lastUpdated: 'Ekim 2026',
  version: '2.1 (Afet Çevrimdışı Sürümü)',
  offlineNote: 'Bu kılavuz %100 çevrimdışıdır. İnternet ve şebeke kesintilerinde çalışır.',
};

export const SITUATIONS: SituationCategory[] = [
  {
    id: 'rubble_trapped',
    title: 'Enkaz Altındayım / Sıkıştım',
    subtitle: 'Hava koruma, ses duyurma ve enerjiyi tasarruflu kullanma adımları.',
    icon: 'cube',
    badge: 'Hayati Öncelik',
    urgency: 'critical',
    criticalAlert:
      'Sürekli bağırmayın! Bağırmak oksijeninizi tüketir ve toz solumanıza sebep olur. Sadece dışarıdan ses duyduğunuzda karşılık verin.',
    steps: [
      {
        stepNumber: 1,
        title: 'Solunum Yollarınızı Kumaşla Kapatın',
        description:
          'Kıyafetiniz veya mendille ağız ve burnunuzu sıkıca örtün. Beton ve asbest tozu akciğer kanallarını tıkayabilir.',
      },
      {
        stepNumber: 2,
        title: 'Boru veya Duvara Ritmik Vurun (3 Kez)',
        description:
          'Sert bir cisimle yakındaki demir veya kalorifer borusuna ritmik 3 vuruş yapın ("Tık - Tık - Tık"). Arama ekiplerinin dinleme cihazları ritmik sesleri arar.',
      },
      {
        stepNumber: 3,
        title: 'Kibrit, Çakmak veya Kıvılcım Yakmayın',
        description:
          'Patlamış doğalgaz boruları veya kimyasal sızıntı olabilir. Işık kaynağı olarak yalnızca telefon ışığı veya fener kullanın.',
      },
      {
        stepNumber: 4,
        title: 'Gereksiz Hareketi Durdurun',
        description:
          'Üzerinizdeki molozun dengesini bozmamak için hareketleri minimumda tutun ve cenin pozisyonunda bekleyin.',
      },
    ],
    donts: [
      'Panikle aralıksız çığlık atmayın.',
      'Gözlerinizi tozlu ellerle ovuşturmayın.',
      'Şebeke yokken arama yapmaya çalışıp telefon şarjını bitirmeyin.',
    ],
  },
  {
    id: 'crush_syndrome',
    title: 'Enkazdan Yaralı Çıkarılıyor / Ezilme',
    subtitle: 'Crush (Ezilme) sendromu: Profesyonel ekip olmadan molozu tek başınıza kaldırmayın!',
    icon: 'warning',
    badge: 'Tıbbi Ekip Zorunlu',
    urgency: 'critical',
    isCrushSyndromeSpecial: true,
    criticalAlert:
      'DİKKAT: BU BİR "KENDİN YAP" TALİMATI DEĞİLDİR! Enkaz altında uzun süre sıkışan uzvun üzerindeki yük, UMKE / 112 sağlık personeli damar yolu açıp sıvı vermeden ANİDEN KALDIRILIRSA, kaslardan kana karışan toksinler (potasyum ve miyoglobin) dakikalar içinde kalbi durdurabilir ve böbrekleri iflas ettirebilir.',
    citizenRole: [
      '112 ve UMKE ekiplerine yaralının KAÇ SAATTİR bası altında olduğunu net olarak söyleyin.',
      'Sağlık ekibi enkaz başına gelene kadar sıkışan uzuv üzerindeki molozu kendi başınıza ÇEKİP KALDIRMAYIN.',
      'Yaralıya kontrolsüz biçimde bol su içirmeyin veya yemek vermeyin (böbrek yükü ve olası acil ameliyat riski). Sadece dudaklarını nemlendirin.',
      'Yaralının bilincini açık tutmak için sakin bir ses tonuyla konuşun ve ısı kaybını önlemek için açıkta kalan gövdesini örtün.',
    ],
    medicalRole: [
      'Enkaz altındayken (bası kalkmadan önce) damar yolu açılarak yoğun izotonik/bikarbonat sıvı resüsitasyonu başlatılır.',
      'Enkaz, sağlık personelinin kontrollü onayı ile aşamalı olarak kaldırılır.',
      'Kurtarma sonrasında EKG takibi, potasyum düşürücü tedavi ve acil diyaliz planlaması yapılır.',
    ],
    donts: [
      'Molozu hızla çekip yaralıyı aniden dışarı fırlatmayın.',
      'Ezilen kola veya bacağa masaj yapmayın, ovuşturmayın.',
      'Yaralıya şekerli içecek veya bol miktarda sıvı içirmeyin.',
    ],
    steps: [],
  },
  {
    id: 'heavy_bleeding',
    title: 'Ağır Kanama Var',
    subtitle: 'Doğrudan tampon, baskı uygulama ve acil kanama durdurma adımları.',
    icon: 'water',
    badge: 'Dakikalarla Yarış',
    urgency: 'high',
    criticalAlert:
      'Turnike YALNIZCA uzuv kopmalarında veya baskıyla durdurulamayan fışkıran kanamalarda son çare olarak tek kemikli bölgeye uygulanır. Boyun ve gövdeye ASLA turnike sarılmaz!',
    steps: [
      {
        stepNumber: 1,
        title: 'Temiz Bezle Doğrudan Baskı Yapın',
        description:
          'Kıyafet veya gazlı bezi yaranın tam üstüne yerleştirip iki elinizle sıkıca bastırın. Kan bezi aşarsa bezi kaldırmadan üstüne yeni bez ekleyin.',
      },
      {
        stepNumber: 2,
        title: 'Kanamalı Uzvu Kalp Seviyesinden Yukarı Tutun',
        description:
          'Kırık şüphesi yoksa yaralı kolu veya bacağı yukarı kaldırarak kan akış basıncını azaltın.',
      },
      {
        stepNumber: 3,
        title: 'Zorunlu Hallerde Turnike (Tek Kemikli Bölge)',
        description:
          'En az 5 cm genişliğinde bez veya kemerle yaranın 5-7 cm üstünden bağlayın. Düğümün içine bir çubuk koyup kanama durana kadar çevirin ve sabitleyin.',
      },
      {
        stepNumber: 4,
        title: 'Turnike Saatini Mutlaka Yazın',
        description:
          'Yaralının alnına veya turnike bezine takıldığı saati silinmez kalemle yazın (ör: T: 15:40). Sağlık personeli gelene kadar gevşetmeyin.',
      },
    ],
    donts: [
      'İp, kablo, tel gibi ince cisimlerle asla turnike yapmayın (dokuyu keser).',
      'Yaraya saplanmış cisim (cam, demir) varsa ASLA çıkarmayın, etrafını bezle destekleyip sabitleyin.',
    ],
  },
  {
    id: 'fracture_spine',
    title: 'Kırık, Çıkık veya Omurga Şüphesi',
    subtitle: 'Omurilik felcini önleme, hareketsizlik kuralı ve doğaçlama atelleme.',
    icon: 'bandage',
    badge: 'Felç Riskini Önle',
    urgency: 'high',
    criticalAlert:
      'Yangın veya patlama tehlikesi yoksa boyun/bel hasarı şüphesi olan yaralıyı ASLA HAREKET ETTİRMEYİN! Başı, boynu ve omurgayı düz bir çizgide sabit tutun.',
    steps: [
      {
        stepNumber: 1,
        title: 'Yaralıyı Olduğu Yerde Sabitleyin',
        description:
          'Yaralının ayağa kalkmasına, başını sağa sola çevirmesine izin vermeyin. Boynu iki elinizle nazikçe sabit tutun.',
      },
      {
        stepNumber: 2,
        title: 'Kemiği Yerine Oturtmaya Çalışmayın',
        description:
          'Dışarı fırlamış veya eğrilmiş kemikleri düzeltmeye kalkışmayın. Bu işlem damar ve sinirleri kesebilir.',
      },
      {
        stepNumber: 3,
        title: 'Sert Malzemeyle Atelleyin (Sabitleyin)',
        description:
          'Karton, tahta veya rulo gazete parçasını uzvun altına yerleştirin. Kırık bölgesinin bir üst ve bir alt eklemini de içine alacak şekilde bezle sarın.',
      },
      {
        stepNumber: 4,
        title: 'Taşıma Zorunluysa Düz Bir Zeminde Taşıyın',
        description:
          'En az 3-4 kişi ile "kütük yuvarlama" yöntemiyle omurgayı bükmeden sert bir kapı veya sedye üzerine aktarın.',
      },
    ],
    donts: [
      'Kırık kemiği yerine oturtmaya çalışmayın.',
      'Omurga şüphelisi kişiyi kollarından veya bacaklarından tutup tek başına sürüklemeyin.',
    ],
  },
  {
    id: 'earthquake_moment',
    title: 'Deprem Anında / Sarsıntı Sırasında',
    subtitle: 'Çök-Kapan-Tutun doğru uygulaması ve ilk 15 dakika tahliye planı.',
    icon: 'home',
    badge: 'Hayat Üçgeni',
    urgency: 'standard',
    criticalAlert:
      'Sarsıntı sırasında ASLA merdivenlere koşmayın, balkona çıkmayın ve asansör kullanmayın! Can kayıplarının çoğu merdivenlerde kaçmaya çalışırken gerçekleşir.',
    steps: [
      {
        stepNumber: 1,
        title: 'Çök - Kapan - Tutun Pozisyonu Alın',
        description:
          'Dayanıklı bir mobilyanın (çamaşır makinesi, baza, sağlam koltuk) yanına cenin pozisyonunda çökün. Baş ve boynunuzu kollarınızla örtün ve sarsıntı bitene kadar mobilyaya tutunun.',
      },
      {
        stepNumber: 2,
        title: 'Cam ve Ağır Dolaplardan Uzak Durun',
        description:
          'Pencere kenarlarından, devrilebilecek kitaplık ve avizelerden uzak iç duvar diplerinde durun.',
      },
      {
        stepNumber: 3,
        title: 'Sarsıntı Durduğunda: Tesisatları Kapatın',
        description:
          'Yangın çıkmaması için doğalgaz vanasını, elektrik sigortasını ve su vanasını derhal kapatın.',
      },
      {
        stepNumber: 4,
        title: 'Sakin ve Planlı Tahliye',
        description:
          'Sağlam ayakkabılarınızı giyin, hazırladıysanız acil çantanızı alıp merdivenlerden güvenli açık toplanma alanına geçin.',
      },
    ],
    donts: [
      'Asansöre asla binmeyin.',
      'Pencerelerden veya balkondan atlamayın.',
      'Kapı eşiğinde durmayın (modern yapılarda kapı eşikleri taşıyıcı değildir).',
    ],
  },
  {
    id: 'hypothermia_cold',
    title: 'Soğuk ve Hipotermi Riski',
    subtitle: 'Enkaz altında veya açık toplanma alanında vücut ısısını koruma.',
    icon: 'snow',
    badge: 'Isı Koruma',
    urgency: 'standard',
    criticalAlert:
      'Hipotermi geçiren kişiyi aniden aşırı sıcak ortama sokmayın, kollarını sertçe ovuşturmayın ve sıcak su dökerek ısıtmayın! Bu işlem öldürücü kalp ritim bozukluğuna yol açabilir.',
    steps: [
      {
        stepNumber: 1,
        title: 'Zeminle Doğrudan Teması Kesin',
        description:
          'Beton zemin vücut ısısını çok hızlı çeker. Kazazedenin altına karton, strafor, tahta veya kıyafet serin.',
      },
      {
        stepNumber: 2,
        title: 'Islak Giysileri Çıkarın',
        description:
          'Su buharlaşırken ısıyı 25 kat daha hızlı tüketir. Islak giysileri çıkarıp kuru battaniye veya alüminyum termal örtü sarın.',
      },
      {
        stepNumber: 3,
        title: 'Baş ve Boyun Bölgesini Örtün',
        description:
          'Vücut ısısının yarısına yakını baş ve boyundan kaybedilir. Bere, şal veya kumaşla başı sıcak tutun.',
      },
      {
        stepNumber: 4,
        title: 'Kademeli ve Gövdeden Isıtın',
        description:
          'Isıtma gövde merkezinden (koltuk altı ve göğüs) kademeli yapılmalıdır. Bilinci açıksa ılık ve şekerli içecekler verilebilir.',
      },
    ],
    donts: [
      'Alkol vermeyin (damarları genişletip ısı kaybını artırır).',
      'Doğrudan ateş veya soba yanına koymayın.',
    ],
  },
];
