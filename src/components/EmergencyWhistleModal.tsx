import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const EmergencyWhistleModal: React.FC<Props> = ({ visible, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [strobeActive, setStrobeActive] = useState(false);
  const [mode, setMode] = useState<'whistle' | 'sos'>('whistle');
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const webViewRef = useRef<WebView>(null);

  // Stop everything when modal is closed
  useEffect(() => {
    if (!visible) {
      setIsPlaying(false);
      setStrobeActive(false);
      stopAudio();
    }
  }, [visible]);

  // Pulse animation when whistle is active
  useEffect(() => {
    let anim: Animated.CompositeAnimation | null = null;
    if (isPlaying) {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
        ])
      );
      anim.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      if (anim) anim.stop();
    };
  }, [isPlaying]);

  // Screen strobe flash effect for visual alerting in the dark
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setStrobeActive((prev) => !prev);
      }, 500);
    } else {
      setStrobeActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const toggleSound = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopAudio();
    } else {
      setIsPlaying(true);
      startAudio(mode);
    }
  };

  const handleModeChange = (newMode: 'whistle' | 'sos') => {
    setMode(newMode);
    if (isPlaying) {
      startAudio(newMode);
    }
  };

  const startAudio = (soundMode: 'whistle' | 'sos') => {
    const code = `
      if (window.startTone) {
        window.startTone("${soundMode}");
      }
      true;
    `;
    webViewRef.current?.injectJavaScript(code);
  };

  const stopAudio = () => {
    const code = `
      if (window.stopTone) {
        window.stopTone();
      }
      true;
    `;
    webViewRef.current?.injectJavaScript(code);
  };

  // Embedded Web Audio synthesizer: generates an acoustic emergency whistle (3200Hz - 3600Hz frequency modulation)
  // or international SOS Morse pattern (· · · — — — · · ·)
  const audioHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <script>
          var audioCtx = null;
          var isRunning = false;
          var loopTimer = null;

          function getAudioContext() {
            if (!audioCtx) {
              var AudioContext = window.AudioContext || window.webkitAudioContext;
              audioCtx = new AudioContext();
            }
            if (audioCtx.state === 'suspended') {
              audioCtx.resume();
            }
            return audioCtx;
          }

          function playWhistleBeep(duration) {
            try {
              var ctx = getAudioContext();
              var osc = ctx.createOscillator();
              var gain = ctx.createGain();

              osc.type = 'triangle';
              // Modulate between 3000Hz and 3400Hz to mimic a real rescue whistle chamber resonance
              osc.frequency.setValueAtTime(3100, ctx.currentTime);
              osc.frequency.exponentialRampToValueAtTime(3450, ctx.currentTime + duration * 0.5);
              osc.frequency.exponentialRampToValueAtTime(3050, ctx.currentTime + duration);

              gain.gain.setValueAtTime(0, ctx.currentTime);
              gain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.04);
              gain.gain.setValueAtTime(1.0, ctx.currentTime + duration - 0.05);
              gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

              osc.connect(gain);
              gain.connect(ctx.destination);

              osc.start(ctx.currentTime);
              osc.stop(ctx.currentTime + duration);
            } catch(e) {}
          }

          window.startTone = function(mode) {
            window.stopTone();
            isRunning = true;
            getAudioContext();

            if (mode === 'whistle') {
              // Whistle loop: 0.6s loud blast, 0.3s pause
              function tickWhistle() {
                if (!isRunning) return;
                playWhistleBeep(0.55);
                loopTimer = setTimeout(tickWhistle, 900);
              }
              tickWhistle();
            } else if (mode === 'sos') {
              // SOS: 3 short (0.2s), 3 long (0.6s), 3 short (0.2s)
              var sosSeq = [
                0.2, 0.15,
                0.2, 0.15,
                0.2, 0.3,
                0.55, 0.2,
                0.55, 0.2,
                0.55, 0.3,
                0.2, 0.15,
                0.2, 0.15,
                0.2, 1.2
              ];
              var idx = 0;
              function stepSOS() {
                if (!isRunning) return;
                var isSound = (idx % 2 === 0);
                var dur = sosSeq[idx];
                if (isSound) {
                  playWhistleBeep(dur);
                }
                idx = (idx + 1) % sosSeq.length;
                loopTimer = setTimeout(stepSOS, dur * 1000);
              }
              stepSOS();
            }
          };

          window.stopTone = function() {
            isRunning = false;
            if (loopTimer) {
              clearTimeout(loopTimer);
              loopTimer = null;
            }
          };
        </script>
      </body>
    </html>
  `;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          isPlaying && strobeActive && styles.containerStrobe,
        ]}
      >
        {/* Hidden Audio Synthesizer */}
        <View style={styles.hiddenWebView}>
          <WebView
            ref={webViewRef}
            source={{ html: audioHtml }}
            originWhitelist={['*']}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
          />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerBadge}>100% ÇEVRİMDIŞI</Text>
            <Text style={styles.title}>Acil Durum Düdüğü (S.O.S)</Text>
          </View>
          <Pressable
            style={styles.closeButton}
            onPress={() => {
              setIsPlaying(false);
              stopAudio();
              onClose();
            }}
          >
            <Ionicons name="close" size={24} color="#0F172A" />
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.description}>
            Enkaz altında sesinizi yormadan ve oksijen kaybetmeden kurtarma ekiplerine
            duyurmak için kesintisiz yüksek frekanslı sinyal üretir.
          </Text>

          {/* Mode Selector */}
          <View style={styles.modeSelector}>
            <Pressable
              style={[
                styles.modeButton,
                mode === 'whistle' && styles.modeButtonActive,
              ]}
              onPress={() => handleModeChange('whistle')}
            >
              <Ionicons
                name="volume-high"
                size={18}
                color={mode === 'whistle' ? '#FFFFFF' : '#475569'}
              />
              <Text
                style={[
                  styles.modeButtonText,
                  mode === 'whistle' && styles.modeButtonTextActive,
                ]}
              >
                Kurtarma Düdüğü
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.modeButton,
                mode === 'sos' && styles.modeButtonActive,
              ]}
              onPress={() => handleModeChange('sos')}
            >
              <Ionicons
                name="radio"
                size={18}
                color={mode === 'sos' ? '#FFFFFF' : '#475569'}
              />
              <Text
                style={[
                  styles.modeButtonText,
                  mode === 'sos' && styles.modeButtonTextActive,
                ]}
              >
                Mors S.O.S (· · · — — — · · ·)
              </Text>
            </Pressable>
          </View>

          {/* Big Interactive Sound Button */}
          <View style={styles.buttonContainer}>
            <Animated.View
              style={[
                styles.pulseRing,
                isPlaying && styles.pulseRingActive,
                { transform: [{ scale: pulseAnim }] },
              ]}
            />
            <Pressable
              style={({ pressed }) => [
                styles.mainButton,
                isPlaying ? styles.mainButtonPlaying : styles.mainButtonIdle,
                pressed && styles.mainButtonPressed,
              ]}
              onPress={toggleSound}
            >
              <Ionicons
                name={isPlaying ? 'stop' : 'megaphone'}
                size={64}
                color="#FFFFFF"
              />
              <Text style={styles.mainButtonText}>
                {isPlaying ? 'DÜDÜĞÜ DURDUR' : 'DÜDÜĞÜ ÇAL'}
              </Text>
              <Text style={styles.mainButtonSubtext}>
                {isPlaying ? 'Sinyal Gönderiliyor...' : 'Ses ve Flaş Başlatmak İçin Basın'}
              </Text>
            </Pressable>
          </View>

          {/* Rescue Tips Card */}
          <View style={styles.tipCard}>
            <View style={styles.tipTitleRow}>
              <Ionicons name="information-circle" size={20} color="#DC2626" />
              <Text style={styles.tipTitle}>Enkaz Altında Ses Kullanımı</Text>
            </View>
            <Text style={styles.tipText}>
              • Sürekli bağırmayın; boğazınız kurur ve nefesiniz tükenir.{'\n'}
              • Telefonunuzun sesini sonuna kadar açıp açık bir boru veya duvara yaslayın.{'\n'}
              • Dışarıdan "Sesimi duyan var mı?" çağrısı geldiğinde butona basın veya ritmik olarak sert bir cisimle 3 kez vurun.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'ios' ? 54 : 24,
  },
  containerStrobe: {
    backgroundColor: '#FEE2E2',
  },
  hiddenWebView: {
    width: 0,
    height: 0,
    opacity: 0,
    position: 'absolute',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flex: 1,
  },
  headerBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  title: {
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
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  description: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 10,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    gap: 4,
    width: '100%',
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 9,
    gap: 6,
  },
  modeButtonActive: {
    backgroundColor: '#DC2626',
  },
  modeButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  pulseRing: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
  },
  pulseRingActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.35)',
  },
  mainButton: {
    width: 190,
    height: 190,
    borderRadius: 95,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  mainButtonIdle: {
    backgroundColor: '#DC2626',
  },
  mainButtonPlaying: {
    backgroundColor: '#0F172A',
  },
  mainButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  mainButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
  },
  tipTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  tipText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
});
