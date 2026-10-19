import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { EarthquakeProvider } from '../context/EarthquakeContext';
import { DrawerProvider, useDrawer } from '../context/DrawerContext';
import { SideDrawer } from '../components/SideDrawer';
import { FirstAidGuideModal } from '../components/FirstAidGuideModal';

function AppContent() {
  const { isFirstAidOpen, closeFirstAid } = useDrawer();

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>

      {/* Global Slide-In Drawer */}
      <SideDrawer />

      {/* Offline Situation-Based First Aid Guide Modal */}
      <FirstAidGuideModal
        visible={isFirstAidOpen}
        onClose={(reopenDrawer) => closeFirstAid(reopenDrawer)}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <EarthquakeProvider>
        <DrawerProvider>
          <AppContent />
        </DrawerProvider>
      </EarthquakeProvider>
    </SafeAreaProvider>
  );
}
