import { FirstAidArticle, EmergencyNumber, ChecklistItem } from '../types/guide';

export const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  {
    id: '112',
    name: '112 Acil Çağrı Merkezi',
    number: '112',
    description: 'Ambulans, İtfaiye, Polis, Jandarma ve AFAD tek numarada birleşmiştir.',
    icon: 'call',
  },
  {
    id: '122',
    name: 'AFAD Afet ve Acil Durum',
    number: '122',
    description: 'Afet arama kurtarma koordinasyon birimi.',
    icon: 'warning',
  },
  {
    id: '110',
    name: 'İtfaiye Yangın İhbar',
    number: '110',
    description: 'Yangın, göçük kurtarma ve gaz sızıntısı bildirimleri.',
    icon: 'flame',
  },
  {
    id: '187',
    name: 'Doğalgaz Acil Arıza',
    number: '187',
    description: 'Deprem sonrası gaz kaçağı ve vana arızaları.',
    icon: 'alert-circle',
  },
];

export const FIRST_AID_ARTICLES: FirstAidArticle[] = [
  {
    id: 'rubble_survival',
    title: 'Göçük & Enkaz Altında Hayatta Kalma',
    shortDescription: 'Enkaz altında hava koruma, enerji tasarrufu ve kurtarma ekiplerine ses duyurma taktikleri.',
    icon: 'shield-checkmark',
    badge: 'Hayati Önem',
    criticalWarning:
      'Panik yapmayın ve sürekli bağırmayın! Bağırmak oksijeninizi tüketir, toz solumanıza ve sesinizin kısılmasına neden olur. Yalnızca dışarıdan ses duyduğunuzda karşılık verin.',
    category: 'rubble',
    steps: [
      {
        stepNumber: 1,
        title: 'Ağız ve Burnunuzu Kumaşla Kapatın',
        description:
          'Enkazdaki asbest, beton tozu ve partiküller akciğerleri tıkar. Bir kıyafet parçası, tişört veya mendille solunum yollarınızı derhal örtün.',
      },
      {
        stepNumber: 2,
        title: 'Hareketi Sınırlandırın ve Güvenli Alan Oluşturun',
        description:
          'Gereksiz hareketler üzerinizdeki moloz dengesini bozabilir. Vücudunuzun sıkışan kısımlarını zorlamadan mümkünse cenin pozisyonu alarak bekleyin.',
      },
      {
        stepNumber: 3,
        title: 'Ritmik Vuruşlarla Ses Çıkarın (3 Kez Kuralı)',
        description:
          'Demir, kalorifer borusu veya duvara sert bir cisimle ritmik olarak 3 kez vurun ("Tık - Tık - Tık"). Arama-kurtarma ekiplerinin akustik dinleme cihazları ritmik sesleri anında tespit eder.',
      },
      {
        stepNumber: 4,
        title: 'Kibrit veya Çakmak Kesinlikle Yakmayın',
        description:
          'Enkaz altında patlamış doğalgaz boruları veya kimyasal sızıntılar bulunabilir. Kıvılcım patlamaya yol açabilir. Işık için yalnızca telefon veya el feneri kullanın.',
      },
      {
        stepNumber: 5,
        title: 'Telefonunuzu Ekonomik Kullanın',
        description:
          'Şebeke yoksa telefonunuzu arama yapmak için sürekli zorlamayın, pil hızla biter. SMS/WhatsApp mesajı atın (ör: "Konum: 3. kat salon, 2 kişiyiz") ve ekran parlaklığını minimuma indirin.',
      },
    ],
    tips: [
      'Gözlerinizi tozdan korumak için sık sık ovuşturmayın.',
      'Dışarıdan iş makineleri sesi duyduğunuzda borulara vurarak konumunuzu belli edin.',
      'Zihninizi güçlü tutun; enkaz altında günler sonra sağ kurtulan binlerce insan olduğunu unutmayın.',
    ],
  },
  {
    id: 'crush_syndrome',
    title: 'Ezilme (Crush) Sendromu & Kompartman',
    shortDescription: 'Moloz altında uzun süre baskıya maruz kalan uzuvlar için hayati ilk yardım ve tuzaklar.',
    icon: 'medical',
    badge: 'Kritik Tıbbi Bilgi',
    criticalWarning:
      'DİKKAT: 1 saatten uzun süre baskı altında kalan bir uzvu hekim/sağlık personeli olmadan aniden serbest bırakmayın! Baskı aniden kalktığında hasarlı kaslardan kana karışan toksinler (potasyum ve miyoglobin) ani kalp durmasına ve böbrek iflasına yol açabilir.',
    category: 'crush',
    steps: [
      {
        stepNumber: 1,
        title: 'Baskıyı Aniden Kaldırmadan Önce Bilgi Alın',
        description:
          'Enkaz altında sıkışmış depremzede uzun süredir bekliyorsa, kurtarma öncesinde sağlık ekipleri tarafından damar yolu açılarak sıvı yüklemesi yapılması esastır.',
      },
      {
        stepNumber: 2,
        title: 'Ezilen Kişiye Kontrolsüz Su/Gıda Vermeyin',
        description:
          'Böbrek yükünü artırmamak ve olası acil ameliyat riskine karşı, medikal ekip onayı olmadan sıkışmış kişiye bol su içirilmemeli; yalnızca dudakları ıslatılmalıdır.',
      },
      {
        stepNumber: 3,
        title: 'Uzvu Kalp Seviyesinde Tutun',
        description:
          'Ezilen kol veya bacağı ne çok yukarı kaldırın ne de aşağı sarkıtın. Kalp seviyesinde düz tutarak dolaşımın aşırı basınç oluşturmasını engelleyin.',
      },
      {
        stepNumber: 4,
        title: 'İdrar Rengini ve Miktarını Takip Edin',
        description:
          'Kurtarılan kişinin idrar rengi çay rengi veya kola rengine dönüyorsa miyoglobin salınımı başlamıştır; derhal yoğun tıbbi diyaliz/sıvı tedavisi gerekir.',
      },
    ],
    tips: [
      'Crush sendromu göçükten çıkarıldıktan saatler sonra bile ölüme yol açabilir. Çıkarılan her depremzede mutlaka hastaneye sevk edilmelidir.',
      'Sıkışan bölgeye soğuk kompres uygulanabilir ancak direkt buz ten üzerine konmamalıdır.',
    ],
  },
  {
    id: 'severe_bleeding',
    title: 'Ağır Kanamalar ve Turnike Uygulaması',
    shortDescription: 'Atardamar ve toplardamar fışkıran kanamaların durdurulması, acil tampon ve turnike kuralı.',
    icon: 'water',
    badge: 'Dakikalarla Yarış',
    criticalWarning:
      'Turnike YALNIZCA uzuv kopmalarında veya doğrudan basıyla durdurulamayan hayati fışkıran kanamalarda son çare olarak kullanılır. Boyun ve gövdeye ASLA turnike uygulanmaz!',
    category: 'bleeding',
    steps: [
      {
        stepNumber: 1,
        title: 'Doğrudan Baskı (Tampon) Uygulayın',
        description:
          'Temiz bir bez, gazlı bez veya giysi parçasını yaranın tam üzerine koyup iki elinizle kuvvetlice bastırın. Kan bezi aşarsa bezi kaldırmadan üzerine ikinci bir bez ekleyin.',
      },
      {
        stepNumber: 2,
        title: 'Kanamalı Bölgeyi Kalp Seviyesinden Yukarı Kaldırın',
        description:
          'Eğer kol veya bacakta kırık şüphesi yoksa, yaralı uzvu kalp seviyesinin üzerine kaldırarak kan akış basıncını azaltın.',
      },
      {
        stepNumber: 3,
        title: 'Turnike Gerekliyse: Yaranın 5-7 cm Üstüne Bağlayın',
        description:
          'Yaranın hemen üzerine veya eklem yerine DEĞİL; tek kemikli bölgeye (pazı veya uyluk) en az 5 cm genişliğinde bez/kemer sarın. Tel, ince ip veya kablo KESİNLİKLE kullanmayın.',
      },
      {
        stepNumber: 4,
        title: 'Çubukla Sıkın ve Kilitleyin',
        description:
          'Düğümün içine bir çubuk (tahta, kalem, kaşık vb.) yerleştirip kanama durana kadar döndürün. Çubuğu çözülmeyecek şekilde sabitleyin.',
      },
      {
        stepNumber: 5,
        title: 'Turnike Saatini Alına veya Beze Yazın (T: 14:35)',
        description:
          'Turnikenin takıldığı dakikayı yaralının alnına silinmez kalemle "T: saat:dakika" şeklinde yazın. Sağlık personeli gelene kadar turnike asla gevşetilmemelidir.',
      },
    ],
    tips: [
      'Yaraya batan yabancı cisim (cam, demir, tahta) varsa ASLA çıkarmayın! Çıkarmak kanamayı patlatabilir. Cismin etrafını bezle destekleyip sabitleyin.',
      'Şok belirtileri (solgunluk, titreme, baygınlık) varsa yaralının ayaklarını 30 cm yukarı kaldırın ve üzerini örtün.',
    ],
  },
  {
    id: 'fracture_and_spine',
    title: 'Kırıklar, Çıkıklar ve Omurga Güvenliği',
    shortDescription: 'Enkazdan düşen cisimler sonucu oluşan kemik kırıkları, atel yapımı ve omurilik felci önleme.',
    icon: 'bandage',
    badge: 'Felç Riskini Önle',
    criticalWarning:
      'Boyun ve bel omurgası hasarından şüphelenilen depremzedeyi (yüksekten düşme, başa darbe, enkaz altında kalma) yangın veya patlama gibi acil ölüm tehdidi yoksa ASLA hareket ettirmeyin!',
    category: 'fracture',
    steps: [
      {
        stepNumber: 1,
        title: 'Yaralıyı Olduğu Yerde Koruyun',
        description:
          'Boynu iki elinizle baş-boyun-gövde ekseninde sabit tutun. Yaralının kafasını sağa sola çevirmesine veya doğrulmasına engel olun.',
      },
      {
        stepNumber: 2,
        title: 'Kırık Kemiği Yerine Oturtmaya Çalışmayın',
        description:
          'Eğrilmiş veya deriyi delmiş kemik parçalarını asla itmeyin veya düzeltmeye çalışmayın. Bu, sinirleri ve damarları kesebilir.',
      },
      {
        stepNumber: 3,
        title: 'Doğaçlama Atel ile Sabitleyin (İmmobilizasyon)',
        description:
          'Sert karton, tahta parçası, katlanmış dergi veya süpürge sapını uzvun altına ve yanına yerleştirin. Kırık noktasının bir üst ve bir altındaki eklemleri de içine alacak şekilde bezle sarın.',
      },
      {
        stepNumber: 4,
        title: 'Açık Kırıklarda Yarayı Temiz Bezle Örtün',
        description:
          'Kemik ucu dışarı çıkmışsa üzerini temiz ve nemli bir gazlı bezle gevşekçe kapatın, bastırmayın.',
      },
    ],
    tips: [
      'Taşıma zorunluysa, en az 3-4 kişi ile "kütük yuvarlama" tekniği uygulanarak omurga düzlüğü bozulmadan sedyeye veya sert kapıya alınmalıdır.',
      'Parmak uçlarını açıkta bırakın; morarma, soğukluk veya hissizlik atelin aşırı sıkı sarıldığını gösterir.',
    ],
  },
  {
    id: 'hypothermia',
    title: 'Hipotermi ve Soğuktan Korunma',
    shortDescription: 'Kış aylarında veya gece enkaz altında donma riskine karşı vücut ısısını koruma yöntemleri.',
    icon: 'snow',
    badge: 'Sinsi Tehlike',
    criticalWarning:
      'Hipotermi geçiren kişiye sıcak su torbası koymayın, kollarını bacaklarını ovuşturmayın ve direkt ateşe yaklaştırmayın! Ani ısıtma ölümcül kalp ritim bozukluğuna (aritmik şok) yol açabilir.',
    category: 'hypothermia',
    steps: [
      {
        stepNumber: 1,
        title: 'Zeminle Teması Derhal Kesin',
        description:
          'Beton soğuğu çok hızlı çeker. Kazazedenin altına karton parçası, köpük, tahta veya kıyafet sererek doğrudan toprak veya betonla temasını önleyin.',
      },
      {
        stepNumber: 2,
        title: 'Islak Giysileri Çıkarın',
        description:
          'Su buharlaşırken vücut ısısını 25 kat daha hızlı tüketir. Mümkünse ıslak giysileri kesip çıkarın ve kuru battaniye veya alüminyum termal örtüye sarın.',
      },
      {
        stepNumber: 3,
        title: 'Baş ve Boyun Bölgesini Örtün',
        description:
          'Vücut ısısının %40 ila %50\'si baş ve boyun bölgesinden kaybedilir. Bere, şal veya kıyafetle başı açıkta bırakmayacak şekilde sarın.',
      },
      {
        stepNumber: 4,
        title: 'Kademeli ve İçten Isıtma Sağlayın',
        description:
          'Bilinci açık ve yutkunabiliyorsa ılık, şekerli içecekler verin. Gövde merkezini (koltuk altları ve kasıklar) ılık örtülerle sararak ısıtın.',
      },
    ],
    tips: [
      'Hipotermide titreme durduysa ve kişi uykulu/kayıtsız hale geldiyse durum çok ciddidir; derhal tıbbi müdahale gereklidir.',
      'Alüminyum acil durum battaniyesi gümüş yüzeyi içe bakacak şekilde sarıldığında vücut ısısını yansıtır.',
    ],
  },
  {
    id: 'earthquake_behavior',
    title: 'Deprem Anında & Sonrasında Doğru Davranış',
    shortDescription: 'Çök-Kapan-Tutun doğru uygulaması, ilk 15 dakika tahliye planı ve kaçınılması gereken hatalar.',
    icon: 'home',
    badge: 'Hayat Üçgeni',
    criticalWarning:
      'Sarsıntı sırasında ASLA merdivenlere koşmayın, balkona çıkmayın ve asansör kullanmayın! Depremlerde can kayıplarının büyük çoğunluğu kaçmaya çalışırken merdiven boşluklarında gerçekleşir.',
    category: 'behavior',
    steps: [
      {
        stepNumber: 1,
        title: 'Çök - Kapan - Tutun (Sarsıntı Anı)',
        description:
          'Sağlam bir masa altına veya yük taşımayan dayanıklı bir mobilyanın (çamaşır makinesi, baza yanı) yanına çökün. Başınızı kollarınızla koruyun ve sarsıntı bitene kadar sabit mobilyaya tutunun.',
      },
      {
        stepNumber: 2,
        title: 'Pencerelerden ve Devrilebilecek Eşyalardan Uzak Durun',
        description:
          'Kütüphane, dolap ve cam kenarlarından uzak durarak iç duvarlara yakın cenin pozisyonu alın.',
      },
      {
        stepNumber: 3,
        title: 'Sarsıntı Bittiğinde: Tesisatları Kapatın',
        description:
          'Deprem sonrası yangınları önlemek için doğalgaz vanasını, elektrik sigortasını ve su sayacını derhal kapatın.',
      },
      {
        stepNumber: 4,
        title: 'Hızlı ve Sakin Tahliye',
        description:
          'Önceden hazırlanan acil durum çantanızı alıp sağlam ayakkabı giyerek merdivenlerden güvenli açık toplanma alanına ilerleyin.',
      },
    ],
    tips: [
      'Kapı eşiklerinde durmayın; modern binalarda kapı kasaları taşıyıcı değildir ve üzerinize yıkılabilir.',
      'Telefon hatlarını meşgul etmeyin; arama yerine internet tabanlı mesajlaşma veya SMS kullanın.',
    ],
  },
];

export const DISASTER_CHECKLIST: ChecklistItem[] = [
  {
    id: 'c1',
    title: 'Kişi Başı Günlük 3-4 Litre Su (Min. 3 Günlük)',
    category: 'water_food',
    description: 'Kapalı pet şişelerde, serin ve gölgede saklanan içme suyu.',
    essential: true,
  },
  {
    id: 'c2',
    title: 'Yüksek Kalorili, Bozulmayan Kuru Gıdalar',
    category: 'water_food',
    description: 'Konserve, kuru yemiş, kuru meyve, bisküvi, bebek maması.',
    essential: true,
  },
  {
    id: 'c3',
    title: 'Yüksek Sesli Acil Durum Düdüğü',
    category: 'tools',
    description: 'Enkaz altında sesinizi yormadan kurtarma ekiplerine duyurmak için en kritik araç.',
    essential: true,
  },
  {
    id: 'c4',
    title: 'El Feneri ve Yedek Piller / Dinamolu Fener',
    category: 'tools',
    description: 'Elektrikler kesildiğinde ve enkaz altında aydınlatma sağlamak için.',
    essential: true,
  },
  {
    id: 'c5',
    title: 'Tam Donanımlı İlk Yardım Çantası',
    category: 'health',
    description: 'Sargı bezi, steril gazlı bez, turnike, yara bandı, antiseptik solüsyon, makas.',
    essential: true,
  },
  {
    id: 'c6',
    title: 'Sürekli Kullanılan Reçeteli İlaçlar',
    category: 'health',
    description: 'Tansiyon, şeker, kalp, astım gibi hayati ilaçların en az 1 haftalık yedek kutusu.',
    essential: true,
  },
  {
    id: 'c7',
    title: 'Taşınabilir Güç Kaynağı (Powerbank)',
    category: 'tools',
    description: 'Dolu halde tutulan şarj aleti ve bağlantı kabloları.',
    essential: true,
  },
  {
    id: 'c8',
    title: 'Termal Acil Durum Battaniyesi',
    category: 'tools',
    description: 'Hafif, katlandığında cep boyutunda olan alüminyum soğuk koruyucu battaniye.',
    essential: true,
  },
  {
    id: 'c9',
    title: 'Toz Maskesi (FFP2/FFP3 veya Cerrahi Maske)',
    category: 'health',
    description: 'Enkaz tozu ve asbest solunumunu engellemek için.',
    essential: true,
  },
  {
    id: 'c10',
    title: 'Önemli Evrak ve Kimlik Fotokopileri',
    category: 'documents',
    description: 'Kimlik, tapu, ruhsat, sigorta poliçesi ve acil nakit para su geçirmez poşette saklanmalı.',
    essential: true,
  },
  {
    id: 'c11',
    title: 'İş Eldiveni ve Çok Amaçlı Çakı',
    category: 'tools',
    description: 'Moloz ve cam kırıklarından korunmak için kalın deri/iş eldiveni.',
    essential: false,
  },
  {
    id: 'c12',
    title: 'Hijyen Malzemeleri & Islak Mendil',
    category: 'health',
    description: 'Sabun, dezenfektan, hijyenik ped ve tuvalet kağıdı.',
    essential: false,
  },
];
