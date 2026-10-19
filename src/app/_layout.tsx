import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { EarthquakeProvider } from '../context/EarthquakeContext';
import { DrawerProvider, useDrawer } from '../context/DrawerContext';
import { SideDrawer } from '../components/SideDrawer';
import { FirstAidGuideModal } from '../components/FirstAidGuideModal';
import { EmergencyWhistleModal } from '../components/EmergencyWhistleModal';

function AppContent() {
  const { activeModal, selectedCategory, closeModal } = useDrawer();

  const isFirstAidOpen =
    activeModal === 'firstAid' ||
    activeModal === 'checklist' ||
    activeModal === 'numbers';

  const initialCat =
    activeModal === 'checklist'
      ? 'checklist'
      : activeModal === 'numbers'
      ? 'numbers'
      : selectedCategory;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>

      {/* Global Slide-In Drawer */}
      <SideDrawer />

      {/* Offline First Aid & Emergency Checklist Modal */}
      <FirstAidGuideModal
        visible={isFirstAidOpen}
        initialCategory={initialCat}
        onClose={closeModal}
      />

      {/* Emergency Audio & Visual Whistle / SOS Modal */}
      <EmergencyWhistleModal
        visible={activeModal === 'whistle'}
        onClose={closeModal}
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
