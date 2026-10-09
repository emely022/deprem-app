import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { EarthquakeProvider } from '../context/EarthquakeContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <EarthquakeProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </EarthquakeProvider>
    </SafeAreaProvider>
  );
}
