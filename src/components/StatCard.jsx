/**
 * Stat Card Component
 * Animated statistics card for session metrics
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import aiTheme from '../theme/aiTheme';

export default function StatCard({ 
  value = 0, 
  label = '', 
  icon = '',
  type = 'default', // 'default', 'success', 'error', 'warning'
  animate = true,
}) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const prevValue = useSharedValue(value);

  useEffect(() => {
    // Initial mount animation
    if (animate) {
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 400 });
    } else {
      scale.value = 1;
      opacity.value = 1;
    }
  }, []);

  useEffect(() => {
    // Value change animation
    if (value !== prevValue.value && animate) {
      scale.value = withSequence(
        withSpring(1.15, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );
      prevValue.value = value;
    }
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return aiTheme.success + '15';
      case 'error':
        return aiTheme.error + '15';
      case 'warning':
        return aiTheme.warning + '15';
      default:
        return aiTheme.gray[100];
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return aiTheme.success;
      case 'error':
        return aiTheme.error;
      case 'warning':
        return aiTheme.warningDark;
      default:
        return aiTheme.textPrimary;
    }
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: getBackgroundColor() }, animatedStyle]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.value, { color: getTextColor() }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: aiTheme.spacing.md,
    borderRadius: aiTheme.radius.md,
    minWidth: 80,
    ...aiTheme.shadow.sm,
  },
  icon: {
    fontSize: aiTheme.fontSize.lg,
    marginBottom: aiTheme.spacing.xs,
  },
  value: {
    fontSize: aiTheme.fontSize.xxl,
    fontWeight: 'bold',
  },
  label: {
    fontSize: aiTheme.fontSize.xs,
    color: aiTheme.textSecondary,
    marginTop: aiTheme.spacing.xs,
    textAlign: 'center',
  },
});
