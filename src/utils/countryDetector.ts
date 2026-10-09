export interface CountryInfo {
  name: string;
  flag: string;
}

interface PatternRule {
  pattern: RegExp;
  info: CountryInfo;
}

const RULES: PatternRule[] = [
  // Türkiye
  {
    pattern:
      /\b(turkey|t[uü]rkiye|marmara|aegean\s*sea|mediterranean\s*sea.*turkey|ege\s*denizi|akdeniz.*t[uü]rkiye|karadeniz|istanbul|izmir|ankara|antalya|bursa|adana|gaziantep|kahramanmara[sş]|hatay|malatya|ad[iı]yaman|d[uü]zce|bolu|van|elaz[iı][gğ]|bing[oö]l|mu[gğ]la|bodrum|fethiye|marmaris|dat[cç]a|[cç]anakkale|g[oö]k[cç]eada|bozcaada|bal[iı]kesir|manisa|denizli|k[uü]tahya|afyon|konya|kayseri|sivas|tokat|erzincan|erzurum|trabzon|rize|samsun|yalova|sakarya|kocaeli|osmaniye|kilis|mersin|iskenderun|antakya|samanda[gğ]|defne|k[iı]r[iı]kkale|amasya|giresun|artvin|kars|ardahan|a[gğ]r[iı]|i[gğ]d[iı]r|tunceli|mu[sş]|bitlis|siirt|batman|diyarbak[iı]r|[sş]anl[iı]urfa|mardin|[sş][iı]rnak|hakkari)\b/i,
    info: { name: 'Türkiye', flag: '🇹🇷' },
  },

  // United States & Territories
  {
    pattern:
      /\b(california|\bca\b|alaska|\bak\b|hawaii|\bhi\b|nevada|\bnv\b|texas|\btx\b|washington|\bwa\b|oregon|\bor\b|puerto\s*rico|\bpr\b|virgin\s*islands|montana|\bmt\b|idaho|\bid\b|utah|\but\b|wyoming|\bwy\b|oklahoma|\bok\b|arizona|\baz\b|new\s*mexico|\bnm\b|colorado|\bco\b|kansas|\bks\b|missouri|\bmo\b|tennessee|\btn\b|arkansas|\bar\b|louisiana|\bla\b|united\s*states|\busa\b|aleutian|san\s*francisco|los\s*angeles|san\s*diego|yellowstone)\b/i,
    info: { name: 'ABD', flag: '🇺🇸' },
  },

  // Japan
  {
    pattern:
      /\b(japan|honshu|hokkaido|kyushu|shikoku|ryukyu|tokyo|fukushima|iwate|miyagi|ibaraki|chiba|izu\s*islands|bonin|okinawa|osaka|kyoto|kobe|sendai|niigata|noto\s*peninsula)\b/i,
    info: { name: 'Japonya', flag: '🇯🇵' },
  },

  // Greece
  {
    pattern:
      /\b(greece|hellas|crete|dodecanese|ionian|peloponnese|cyclades|rhodes|lesbos|samos|chios|athens|thessaloniki|santorini|kos|zakynthos|kefalonia|lefkada|corfu|evia)\b/i,
    info: { name: 'Yunanistan', flag: '🇬🇷' },
  },

  // Italy
  {
    pattern:
      /\b(italy|italia|sicily|calabria|tyrrhenian|apennines|campania|naples|rome|lombardy|tuscany|umbria|abruzzo|marche|etna|vesuvius|stromboli)\b/i,
    info: { name: 'İtalya', flag: '🇮🇹' },
  },

  // Chile
  {
    pattern:
      /\b(chile|maule|tarapaca|antofagasta|atacama|coquimbo|valparaiso|santiago|bio-bio|los\s*lagos|arica|iquique|calama)\b/i,
    info: { name: 'Şili', flag: '🇨🇱' },
  },

  // Indonesia
  {
    pattern:
      /\b(indonesia|sumatra|sumatera|java|jawa|bali|lombok|flores|sulawesi|celebes|molucca|maluku|banda\s*sea|papua|jakarta|aceh|nias|mentawai)\b/i,
    info: { name: 'Endonezya', flag: '🇮🇩' },
  },

  // Philippines
  {
    pattern:
      /\b(philippines|filipinler|luzon|mindanao|visayas|leyte|samar|mindoro|panay|cebu|davao|manila)\b/i,
    info: { name: 'Filipinler', flag: '🇵🇭' },
  },

  // Mexico
  {
    pattern:
      /\b(mexico|meksika|oaxaca|chiapas|guerrero|michoacan|jalisco|colima|baja\s*california|mexico\s*city|puebla|veracruz)\b/i,
    info: { name: 'Meksika', flag: '🇲🇽' },
  },

  // Cyprus
  {
    pattern: /\b(cyprus|k[iı]br[iı]s|nicosia|limassol|larnaca|paphos)\b/i,
    info: { name: 'Kıbrıs', flag: '🇨🇾' },
  },

  // Panama
  {
    pattern: /\b(panama|pitaloza|chiriqui|bocas\s*del\s*toro)\b/i,
    info: { name: 'Panama', flag: '🇵🇦' },
  },

  // Iceland
  {
    pattern: /\b(iceland|[iı]zlanda|reykjanes|gr[ií]msey|reykjavik|akureyri|katla|hemla)\b/i,
    info: { name: 'İzlanda', flag: '🇮🇸' },
  },

  // New Zealand
  {
    pattern: /\b(new\s*zealand|yeni\s*zelanda|kermadec|auckland|wellington|christchurch|otago)\b/i,
    info: { name: 'Yeni Zelanda', flag: '🇳🇿' },
  },

  // Peru
  {
    pattern: /\b(peru|lima|arequipa|cusco|piura|ancash|loreto)\b/i,
    info: { name: 'Peru', flag: '🇵🇪' },
  },

  // Colombia
  {
    pattern: /\b(colombia|kolombiya|bogota|medellin|cali|santander|narino)\b/i,
    info: { name: 'Kolombiya', flag: '🇨🇴' },
  },

  // Ecuador
  {
    pattern: /\b(ecuador|ekvador|quito|guayaquil|galapagos)\b/i,
    info: { name: 'Ekvador', flag: '🇪🇨' },
  },

  // Argentina
  {
    pattern: /\b(argentina|arjantin|mendoza|san\s*juan|salta|jujuy)\b/i,
    info: { name: 'Arjantin', flag: '🇦🇷' },
  },

  // Bolivia
  {
    pattern: /\b(bolivia|bolivya|la\s*paz|potosi|santa\s*cruz)\b/i,
    info: { name: 'Bolivya', flag: '🇧🇴' },
  },

  // Russia
  {
    pattern:
      /\b(russia|rusya|kamchatka|sakhalin|kuril\s*islands|kuril|siberia|saha|vladivostok|komandorskiye)\b/i,
    info: { name: 'Rusya', flag: '🇷🇺' },
  },

  // China
  {
    pattern:
      /\b(china|[cç]in|sichuan|xinjiang|tibet|xizang|yunnan|qinghai|gansu|beijing|shanghai)\b/i,
    info: { name: 'Çin', flag: '🇨🇳' },
  },

  // Taiwan
  {
    pattern: /\b(taiwan|tayvan|taipei|hualien|taitung|yilan)\b/i,
    info: { name: 'Tayvan', flag: '🇹🇼' },
  },

  // Iran
  {
    pattern:
      /\b(iran|tehran|kermanshah|tabriz|shiraz|kerman|khuzestan|hormozgan|bandar\s*abbas|mashhad)\b/i,
    info: { name: 'İran', flag: '🇮🇷' },
  },

  // Iraq
  {
    pattern: /\b(iraq|irak|baghdad|erbil|sulaymaniyah|mosul|basra)\b/i,
    info: { name: 'Irak', flag: '🇮🇶' },
  },

  // Syria
  {
    pattern: /\b(syria|suriye|aleppo|halep|damascus|[sş]am|latakia|lazkiye|idlib)\b/i,
    info: { name: 'Suriye', flag: '🇸🇾' },
  },

  // Lebanon
  {
    pattern: /\b(lebanon|l[uü]bnan|beirut|beyrut|tripoli)\b/i,
    info: { name: 'Lübnan', flag: '🇱🇧' },
  },

  // Israel / Palestine
  {
    pattern: /\b(israel|[iı]srail|palestine|filistin|dead\s*sea|gaza|jerusalem|tel\s*aviv)\b/i,
    info: { name: 'İsrail / Filistin', flag: '🇮🇱' },
  },

  // Jordan
  {
    pattern: /\b(jordan|[uü]rd[uü]n|amman|aqaba)\b/i,
    info: { name: 'Ürdün', flag: '🇯🇴' },
  },

  // Afghanistan
  {
    pattern: /\b(afghanistan|afganistan|hindu\s*kush|kabul|badakhshan)\b/i,
    info: { name: 'Afganistan', flag: '🇦🇫' },
  },

  // Pakistan
  {
    pattern: /\b(pakistan|islamabad|balochistan|karachi|quetta|peshawar)\b/i,
    info: { name: 'Pakistan', flag: '🇵🇰' },
  },

  // India
  {
    pattern: /\b(india|hindistan|andaman|nicobar|himalayas|kashmir|assam|delhi)\b/i,
    info: { name: 'Hindistan', flag: '🇮🇳' },
  },

  // Nepal
  {
    pattern: /\b(nepal|kathmandu|pokhara)\b/i,
    info: { name: 'Nepal', flag: '🇳🇵' },
  },

  // Papua New Guinea
  {
    pattern: /\b(papua\s*new\s*guinea|papua\s*yeni\s*gine|new\s*britain|bougainville)\b/i,
    info: { name: 'Papua Yeni Gine', flag: '🇵🇬' },
  },

  // Fiji
  {
    pattern: /\b(fiji|suva)\b/i,
    info: { name: 'Fiji', flag: '🇫🇯' },
  },

  // Tonga
  {
    pattern: /\b(tonga|nuku'alofa)\b/i,
    info: { name: 'Tonga', flag: '🇹🇴' },
  },

  // Vanuatu
  {
    pattern: /\b(vanuatu|port\s*vila)\b/i,
    info: { name: 'Vanuatu', flag: '🇻🇺' },
  },

  // Solomon Islands
  {
    pattern: /\b(solomon\s*islands|solomon\s*adalar[iı])\b/i,
    info: { name: 'Solomon Adaları', flag: '🇸🇧' },
  },

  // Costa Rica
  {
    pattern: /\b(costa\s*rica|kosta\s*rika|san\s*jose)\b/i,
    info: { name: 'Kosta Rika', flag: '🇨🇷' },
  },

  // Guatemala
  {
    pattern: /\b(guatemala)\b/i,
    info: { name: 'Guatemala', flag: '🇬🇹' },
  },

  // El Salvador
  {
    pattern: /\b(el\s*salvador)\b/i,
    info: { name: 'El Salvador', flag: '🇸🇻' },
  },

  // Nicaragua
  {
    pattern: /\b(nicaragua|nikaragua)\b/i,
    info: { name: 'Nikaragua', flag: '🇳🇮' },
  },

  // Dominican Republic
  {
    pattern: /\b(dominican\s*republic|dominik\s*cumhuriyeti|santo\s*domingo)\b/i,
    info: { name: 'Dominik Cumhuriyeti', flag: '🇩🇴' },
  },

  // Haiti
  {
    pattern: /\b(haiti|port-au-prince)\b/i,
    info: { name: 'Haiti', flag: '🇭🇹' },
  },

  // Canada
  {
    pattern: /\b(canada|kanada|british\s*columbia|yukon|vancouver|quebec)\b/i,
    info: { name: 'Kanada', flag: '🇨🇦' },
  },

  // Australia
  {
    pattern: /\b(australia|avustralya|sydney|melbourne|queensland)\b/i,
    info: { name: 'Avustralya', flag: '🇦🇺' },
  },

  // Spain
  {
    pattern: /\b(spain|[iı]spanya|canary\s*islands|andalusia|gibraltar)\b/i,
    info: { name: 'İspanya', flag: '🇪🇸' },
  },

  // Portugal
  {
    pattern: /\b(portugal|portekiz|azores|azores\s*islands|madeira|lisbon)\b/i,
    info: { name: 'Portekiz', flag: '🇵🇹' },
  },

  // Azerbaijan
  {
    pattern: /\b(azerbaijan|azerbaycan|baku|baki|ganja|sheki)\b/i,
    info: { name: 'Azerbaycan', flag: '🇦🇿' },
  },

  // Georgia
  {
    pattern: /\b(georgia|g[uü]rcistan|tbilisi|batumi)\b/i,
    info: { name: 'Gürcistan', flag: '🇬🇪' },
  },

  // Armenia
  {
    pattern: /\b(armenia|ermenistan|yerevan|erevani)\b/i,
    info: { name: 'Ermenistan', flag: '🇦🇲' },
  },

  // Morocco
  {
    pattern: /\b(morocco|fas|marrakech|rabat|casablanca|al\s*hoceima)\b/i,
    info: { name: 'Fas', flag: '🇲🇦' },
  },

  // Algeria
  {
    pattern: /\b(algeria|cezayir|algiers)\b/i,
    info: { name: 'Cezayir', flag: '🇩🇿' },
  },

  // Egypt
  {
    pattern: /\b(egypt|m[iı]s[iı]r|cairo|sinai|red\s*sea)\b/i,
    info: { name: 'Mısır', flag: '🇪🇬' },
  },

  // Romania
  {
    pattern: /\b(romania|romanya|vrancea|bucharest)\b/i,
    info: { name: 'Romanya', flag: '🇷🇴' },
  },

  // Croatia / Balkans
  {
    pattern: /\b(croatia|h[iı]rvatistan|zagreb|petrinja)\b/i,
    info: { name: 'Hırvatistan', flag: '🇭🇷' },
  },
  {
    pattern: /\b(albania|arnavutluk|tirana|durres)\b/i,
    info: { name: 'Arnavutluk', flag: '🇦🇱' },
  },
  {
    pattern: /\b(serbia|s[iı]rbistan|belgrade)\b/i,
    info: { name: 'Sırbistan', flag: '🇷🇸' },
  },
  {
    pattern: /\b(bosnia|bosna|sarajevo)\b/i,
    info: { name: 'Bosna-Hersek', flag: '🇧🇦' },
  },
  {
    pattern: /\b(bulgaria|bulgaristan|sofia)\b/i,
    info: { name: 'Bulgaristan', flag: '🇧🇬' },
  },

  // Oceans / Ridges
  {
    pattern:
      /\b(mid-atlantic\s*ridge|central\s*mid-atlantic|south\s*mid-atlantic|north\s*mid-atlantic|carlsberg\s*ridge|reykjanes\s*ridge|south\s*sandwich\s*islands)\b/i,
    info: { name: 'Okyanus Sırtı', flag: '🌊' },
  },
  {
    pattern:
      /\b(pacific\s*ocean|atlantic\s*ocean|indian\s*ocean|southern\s*ocean|arctic\s*ocean)\b/i,
    info: { name: 'Açık Deniz', flag: '🌊' },
  },
];

/**
 * Heuristic fallback based on geographical coordinates (bounding boxes).
 */
function getCountryByCoordinates(lat: number, lon: number): CountryInfo | null {
  // Türkiye: ~35.8° to 42.2° N, 25.6° to 44.8° E
  if (lat >= 35.8 && lat <= 42.2 && lon >= 25.6 && lon <= 44.8) {
    return { name: 'Türkiye', flag: '🇹🇷' };
  }

  // Yunanistan & Ege: ~34.8° to 41.8° N, 19.3° to 28.5° E
  if (lat >= 34.8 && lat <= 41.8 && lon >= 19.3 && lon < 25.6) {
    return { name: 'Yunanistan', flag: '🇬🇷' };
  }

  // Kıbrıs Bölgesi: ~34.5° to 35.7° N, 32.1° to 34.7° E
  if (lat >= 34.5 && lat <= 35.7 && lon >= 32.1 && lon <= 34.7) {
    return { name: 'Kıbrıs', flag: '🇨🇾' };
  }

  // Japonya: ~24.0° to 46.0° N, 122.0° to 153.0° E
  if (lat >= 24.0 && lat <= 46.0 && lon >= 122.0 && lon <= 153.0) {
    return { name: 'Japonya', flag: '🇯🇵' };
  }

  // İtalya: ~36.5° to 47.0° N, 6.5° to 18.5° E
  if (lat >= 36.5 && lat <= 47.0 && lon >= 6.5 && lon <= 18.5) {
    return { name: 'İtalya', flag: '🇮🇹' };
  }

  // ABD - Alaska: ~51.0° to 71.5° N, -179.0° to -129.0° W
  if (lat >= 51.0 && lat <= 71.5 && lon >= -179.0 && lon <= -129.0) {
    return { name: 'ABD (Alaska)', flag: '🇺🇸' };
  }

  // ABD - Hawaii: ~18.5° to 22.5° N, -161.0° to -154.5° W
  if (lat >= 18.5 && lat <= 22.5 && lon >= -161.0 && lon <= -154.5) {
    return { name: 'ABD (Hawaii)', flag: '🇺🇸' };
  }

  // ABD - Kıta: ~24.5° to 49.5° N, -125.0° to -66.5° W
  if (lat >= 24.5 && lat <= 49.5 && lon >= -125.0 && lon <= -66.5) {
    return { name: 'ABD', flag: '🇺🇸' };
  }

  // Şili: ~ -56.0° to -17.5° S, -76.0° to -66.0° W
  if (lat >= -56.0 && lat <= -17.5 && lon >= -76.0 && lon <= -66.0) {
    return { name: 'Şili', flag: '🇨🇱' };
  }

  // Endonezya: ~ -11.0° to 6.0° N/S, 95.0° to 141.0° E
  if (lat >= -11.0 && lat <= 6.0 && lon >= 95.0 && lon <= 141.0) {
    return { name: 'Endonezya', flag: '🇮🇩' };
  }

  return null;
}

/**
 * Predicts country name and flag emoji from place description string
 * and coordinates.
 */
export function detectCountry(
  placeName: string | null | undefined,
  lat?: number,
  lon?: number
): CountryInfo {
  const text = (placeName || '').trim();

  // 1. Text Pattern Matching
  if (text) {
    for (const rule of RULES) {
      if (rule.pattern.test(text)) {
        return rule.info;
      }
    }
  }

  // 2. Coordinate Bounding Box Fallback
  if (typeof lat === 'number' && typeof lon === 'number') {
    const geoMatch = getCountryByCoordinates(lat, lon);
    if (geoMatch) {
      return geoMatch;
    }
  }

  // 3. Fallback: try to take the last part of place (e.g. "12 km SW of Honolulu, Hawaii")
  if (text.includes(',')) {
    const parts = text.split(',');
    const lastPart = parts[parts.length - 1].trim();
    if (lastPart.length > 2 && lastPart.length < 25) {
      return {
        name: lastPart,
        flag: '🌐',
      };
    }
  }

  return {
    name: text.length > 0 ? text : 'Bölge',
    flag: '🌐',
  };
}
