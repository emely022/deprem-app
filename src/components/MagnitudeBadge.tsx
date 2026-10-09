import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MagnitudeBadgeProps {
  magnitude: number;
  size?: 'small' | 'medium' | 'large';
}

export const MagnitudeBadge: React.FC<MagnitudeBadgeProps> = ({
  magnitude,
  size = 'small',
}) => {
  // Requirement: 3.0 altı mavi daire, 3.0 ve üstü kırmızı daire.
  const isRed = magnitude >= 3.0;
  const bgColor = isRed ? '#DC2626' : '#2563EB';

  const dimensionStyle =
    size === 'large'
      ? styles.large
      : size === 'medium'
      ? styles.medium
      : styles.small;

  const textStyle =
    size === 'large'
      ? styles.textLarge
      : size === 'medium'
      ? styles.textMedium
      : styles.textSmall;

  const displayMag =
    magnitude > 0 ? magnitude.toFixed(1) : '—';

  return (
    <View style={[styles.circle, dimensionStyle, { backgroundColor: bgColor }]}>
      <Text style={[styles.text, textStyle]}>{displayMag}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3.5,
    elevation: 3,
  },
  small: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  medium: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  large: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
  },
  textSmall: {
    fontSize: 16,
  },
  textMedium: {
    fontSize: 19,
  },
  textLarge: {
    fontSize: 24,
  },
});
