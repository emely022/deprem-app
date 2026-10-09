import React, { useRef, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Pressable,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { Earthquake } from '../types/earthquake';
import { MagnitudeBadge } from './MagnitudeBadge';
import { formatTimeAgo } from '../utils/dateFormatter';

interface EarthquakeMapProps {
  earthquakes: Earthquake[];
  selectedEarthquake: Earthquake | null;
  onSelectEarthquake: (eq: Earthquake | null) => void;
  onOpenDetail: (eq: Earthquake) => void;
}

export const EarthquakeMap: React.FC<EarthquakeMapProps> = ({
  earthquakes,
  selectedEarthquake,
  onSelectEarthquake,
  onOpenDetail,
}) => {
  const webViewRef = useRef<WebView>(null);

  // Generate Leaflet HTML
  const htmlContent = useMemo(() => {
    const serializedEvents = JSON.stringify(
      earthquakes.map((e) => ({
        id: e.id,
        lat: e.latitude,
        lon: e.longitude,
        mag: e.magnitude,
        place: e.place,
        flag: e.flagEmoji,
        country: e.country,
        depth: e.depth,
      }))
    );

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      background: #E2E8F0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .custom-div-icon {
      background: transparent;
      border: none;
    }
    .marker-pin {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-weight: 800;
      font-size: 11px;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
      border: 2px solid #FFFFFF;
      transition: transform 0.2s;
    }
    .marker-pin:hover, .marker-pin.active {
      transform: scale(1.3);
      z-index: 1000 !important;
      border-color: #FEF08A;
    }
    .marker-blue {
      background: #2563EB;
    }
    .marker-red {
      background: #DC2626;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([20.0, 0.0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map);

    var earthquakes = ${serializedEvents};
    var markersMap = {};

    function sendMessage(data) {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      } else if (window.parent && window.parent.postMessage) {
        window.parent.postMessage(JSON.stringify(data), '*');
      }
    }

    earthquakes.forEach(function(item) {
      var isRed = item.mag >= 3.0;
      var colorClass = isRed ? 'marker-red' : 'marker-blue';
      var size = Math.max(22, Math.min(38, Math.round(18 + item.mag * 3.5)));
      
      var customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: '<div class="marker-pin ' + colorClass + '" style="width:' + size + 'px; height:' + size + 'px; line-height:' + size + 'px;">' + (item.mag > 0 ? item.mag.toFixed(1) : '') + '</div>',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });

      var marker = L.marker([item.lat, item.lon], { icon: customIcon });
      
      marker.on('click', function() {
        sendMessage({ type: 'SELECT_EARTHQUAKE', id: item.id });
      });

      marker.addTo(map);
      markersMap[item.id] = marker;
    });

    window.flyToLocation = function(lat, lon, zoom) {
      map.flyTo([lat, lon], zoom || 8, { duration: 1.2 });
    };
  </script>
</body>
</html>
    `;
  }, [earthquakes]);

  // Handle message from Leaflet
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent?.data || event.data);
      if (data.type === 'SELECT_EARTHQUAKE') {
        const found = earthquakes.find((e) => e.id === data.id);
        if (found) {
          onSelectEarthquake(found);
        }
      }
    } catch (e) {
      // Ignored
    }
  };

  // Fly to selected earthquake when selection changes
  useEffect(() => {
    if (selectedEarthquake && webViewRef.current) {
      const script = `window.flyToLocation && window.flyToLocation(${selectedEarthquake.latitude}, ${selectedEarthquake.longitude}, 8); true;`;
      webViewRef.current.injectJavaScript(script);
    }
  }, [selectedEarthquake]);

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        // Web fallback iframe
        // @ts-ignore
        <iframe
          srcDoc={htmlContent}
          style={styles.webIframe}
          title="Earthquake Map"
        />
      ) : (
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.webView}
          onMessage={handleMessage}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
        />
      )}

      {/* Selected Earthquake Floating Bottom Card */}
      {selectedEarthquake && (
        <View style={styles.floatingCard}>
          <Pressable
            style={styles.cardCloseBtn}
            onPress={() => onSelectEarthquake(null)}
          >
            <Ionicons name="close" size={18} color="#64748B" />
          </Pressable>

          <Pressable
            style={styles.cardContent}
            onPress={() => onOpenDetail(selectedEarthquake)}
          >
            <MagnitudeBadge magnitude={selectedEarthquake.magnitude} size="medium" />
            <View style={styles.cardInfo}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardFlag}>{selectedEarthquake.flagEmoji}</Text>
                <Text style={styles.cardCountry} numberOfLines={1}>
                  {selectedEarthquake.country}
                </Text>
                <Text style={styles.cardTime}>
                  • {formatTimeAgo(selectedEarthquake.time)}
                </Text>
              </View>
              <Text style={styles.cardPlace} numberOfLines={2}>
                {selectedEarthquake.place}
              </Text>
              <Text style={styles.cardDepth}>
                Derinlik: {selectedEarthquake.depth} km
              </Text>
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  webIframe: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
  },
  floatingCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardCloseBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardFlag: {
    fontSize: 14,
    marginRight: 4,
  },
  cardCountry: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    maxWidth: 120,
  },
  cardTime: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 4,
  },
  cardPlace: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
    marginBottom: 2,
  },
  cardDepth: {
    fontSize: 11,
    color: '#64748B',
  },
});
